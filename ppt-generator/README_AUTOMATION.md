# 🔄 自动化流程说明

## 完整架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户浏览器                                │
│  ┌───────────────┐                                             │
│  │  前端页面      │                                             │
│  │  index.html   │                                             │
│  │  + app.js     │                                             │
│  └───────┬───────┘                                             │
│          │                                                      │
└──────────┼──────────────────────────────────────────────────────┘
           │ HTTP/WS
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js 后端服务                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  server.js                                                │  │
│  │                                                           │  │
│  │  📥 接收请求                                              │  │
│  │     - POST /api/ppt/generate                             │  │
│  │     - GET  /api/ppt/status/:id                           │  │
│  │     - GET  /api/ppt/download/:id                         │  │
│  │                                                           │  │
│  │  📊 任务管理                                              │  │
│  │     - 创建任务 ID                                         │  │
│  │     - 存储任务状态                                        │  │
│  │     - 轮询进度                                            │  │
│  │                                                           │  │
│  │  🔄 调用 Skywork                                          │  │
│  │     - 执行 Python 脚本                                     │  │
│  │     - 监控日志文件                                        │  │
│  │     - 解析进度信息                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           │
           │ exec()
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Skywork PPT 技能                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  run_ppt_write.py                                         │  │
│  │                                                           │  │
│  │  1️⃣ 环境检查                                              │  │
│  │     - 检查 Python 版本                                     │  │
│  │     - 安装依赖                                            │  │
│  │                                                           │  │
│  │  2️⃣ 认证                                                  │  │
│  │     - 检查 Skywork Token                                  │  │
│  │                                                           │  │
│  │  3️⃣ 网络搜索（可选）                                      │  │
│  │     - 搜索主题相关内容                                    │  │
│  │     - 生成参考报告                                        │  │
│  │                                                           │  │
│  │  4️⃣ 调用 Skywork API                                      │  │
│  │     - 发送生成请求                                        │  │
│  │     - 流式接收响应                                        │  │
│  │                                                           │  │
│  │  5️⃣ 生成 PPTX                                             │  │
│  │     - 创建大纲                                            │  │
│  │     - 生成每页内容                                        │  │
│  │     - 渲染图片                                            │  │
│  │     - 导出文件                                            │  │
│  │                                                           │  │
│  │  6️⃣ 输出结果                                              │  │
│  │     - 本地路径：/tmp/xxx.pptx                            │  │
│  │     - 下载链接：https://...                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 数据流

### 1. 创建任务

**前端 → 后端**
```javascript
POST /api/ppt/generate
{
  "topic": "人工智能发展趋势",
  "slideCount": 10,
  "style": "business",
  "language": "zh"
}
```

**后端响应**
```json
{
  "success": true,
  "taskId": "ppt_1234567890",
  "message": "任务已创建",
  "estimatedTime": "5-10 分钟"
}
```

### 2. 轮询进度

**前端 → 后端（每 3 秒）**
```javascript
GET /api/ppt/status/ppt_1234567890
```

**后端响应（进行中）**
```json
{
  "success": true,
  "task": {
    "id": "ppt_1234567890",
    "status": "processing",
    "progress": 45,
    "stage": "Generating slides"
  }
}
```

**后端响应（完成）**
```json
{
  "success": true,
  "task": {
    "id": "ppt_1234567890",
    "status": "completed",
    "progress": 100,
    "stage": "完成",
    "downloadUrl": "http://..."
  }
}
```

### 3. 下载文件

**前端 → 后端**
```javascript
GET /api/ppt/download/ppt_1234567890
```

**后端响应**
```
Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation
Content-Disposition: attachment; filename="PPT_人工智能发展趋势.pptx"

[二进制 PPTX 文件数据]
```

## ⏱️ 时间线

```
T=0s     用户点击"生成"
         ↓
T=0.1s   前端发送 POST 请求
         ↓
T=0.5s   后端创建任务，返回 taskId
         ↓
T=0.6s   后端执行 Skywork 脚本（后台）
         ↓
T=1s     前端开始轮询（每 3 秒一次）
         ↓
T=1-60s  [阶段 1] 生成大纲 (0-20%)
         ↓
T=60-300s [阶段 2] 生成幻灯片 (20-80%)
         ↓
T=300-450s [阶段 3] 渲染图片 (80-95%)
         ↓
T=450-500s [阶段 4] 导出 PPTX (95-100%)
         ↓
T=500s   后端检测到 [DONE]
         ↓
T=500s   前端收到完成状态
         ↓
T=500s   用户点击下载
```

## 🔍 日志文件示例

后端轮询的日志文件内容：

```
[PID] 12345
[START] 开始生成 PPT
[PHASE] 初始化
[PING] 5% | 准备中
[PING] 10% | 生成大纲
[OUTLINE] 1. 人工智能概述...
[PING] 20% | 生成大纲完成
[PING] 30% | 生成幻灯片 - 第 1 页
[PING] 35% | 生成幻灯片 - 第 2 页
...
[PING] 80% | 生成幻灯片完成
[PING] 85% | 渲染图片
[PING] 90% | 渲染图片 - 图 1
[PING] 95% | 导出 PPTX
[DONE] saved=/tmp/ppt_xxx.pptx download_url=https://...
```

## 🎯 关键代码片段

### 后端 - 创建任务

```javascript
app.post('/api/ppt/generate', async (req, res) => {
    const taskId = uuidv4();
    const command = `python3 scripts/run_ppt_write.py "${query}" ...`;
    
    exec(command, (error) => {
        // 处理完成/错误
    });
    
    startProgressMonitoring(taskId, logPath);
    
    res.json({ taskId, success: true });
});
```

### 后端 - 轮询进度

```javascript
function startProgressMonitoring(taskId, logPath) {
    setInterval(() => {
        const content = fs.readFileSync(logPath, 'utf-8');
        
        // 解析 [PING] xx% | stage
        const match = content.match(/\[PING\] (\d+)% \| (.+)/);
        if (match) {
            updateTask(taskId, {
                progress: match[1],
                stage: match[2]
            });
        }
    }, 3000);
}
```

### 前端 - 轮询状态

```javascript
function pollTaskStatus(taskId) {
    setInterval(async () => {
        const response = await fetch(`/api/ppt/status/${taskId}`);
        const task = (await response.json()).task;
        
        updateProgress(task.progress, task.stage);
        
        if (task.status === 'completed') {
            showResult();
        }
    }, 3000);
}
```

## 🛡️ 错误处理

### 1. 认证失败
```
[ERROR] Skywork authentication failed
→ 前端显示："请先完成 Skywork 认证"
→ 引导用户运行：python3 scripts/skywork_auth.py --login
```

### 2. 生成超时
```
Timeout after 10 minutes
→ 后端标记任务为 'timeout'
→ 前端显示："生成超时，请稍后重试"
```

### 3. 余额不足
```
[ERROR] Insufficient benefit
→ 后端检测到错误
→ 前端显示："余额不足，请充值"
→ 提供充值链接
```

## 📈 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 响应时间 | < 1s | API 响应速度 |
| 生成速度 | 30-60s/页 | PPT 生成速度 |
| 并发任务 | 5-10 个 | 同时生成数量 |
| 文件大小 | < 50MB | 单个 PPT 大小 |
| 成功率 | > 95% | 生成成功概率 |

---

**技术栈**：
- 前端：HTML + CSS + JavaScript (原生)
- 后端：Node.js + Express
- 技能：Python + Skywork PPT
- 通信：HTTP REST API

**部署方式**：
- 开发：本地运行 `node server.js`
- 生产：PM2 + Nginx + HTTPS
