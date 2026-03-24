# AI PPT 生成器 - 部署指南

## 📋 完整架构

```
┌─────────────┐      ┌──────────────┐      ┌──────────────────┐
│   前端页面   │ ────▶ │  后端服务     │ ────▶ │ Skywork PPT 技能  │
│ (index.html)│      │ (server.js)  │      │ (Python 脚本)     │
└─────────────┘      └──────────────┘      └──────────────────┘
       ▲                      │
       │                      ▼
       │              ┌──────────────┐
       └──────────────│  返回 PPT 文件  │
                      └──────────────┘
```

## 🚀 快速启动（本地开发）

### 步骤 1：安装 Node.js 依赖

```bash
cd ppt-generator
npm init -y
npm install express cors uuid
```

### 步骤 2：启动后端服务

```bash
node server.js
```

输出：
```
🚀 AI PPT 生成器后端服务已启动
📍 监听端口：http://localhost:3000
📝 API 端点:
   POST /api/ppt/generate    - 创建生成任务
   GET  /api/ppt/status/:id  - 查询任务状态
   GET  /api/ppt/download/:id - 下载 PPT 文件
   GET  /api/health          - 健康检查
```

### 步骤 3：打开前端页面

浏览器访问：`http://localhost:3000/`

### 步骤 4：测试生成

1. 输入 PPT 主题（例如："人工智能发展趋势"）
2. 选择页数、风格、语言
3. 点击"开始生成"
4. 等待 5-10 分钟
5. 下载生成的 PPT

## 🌐 生产环境部署

### 方案 A：Vercel / Netlify

#### 1. 准备 `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "$1"
    }
  ],
  "env": {
    "SKYWORK_SKILL_DIR": "/var/task/skywork-ppt-1.0.3"
  }
}
```

⚠️ **注意**：Vercel Serverless 函数有超时限制（10-60 秒），不适合长时间运行的 PPT 生成任务。

### 方案 B：自建服务器（推荐）

#### 1. 服务器要求

- Node.js >= 16
- Python >= 3.8
- 至少 2GB 内存
- 10GB 存储空间

#### 2. 安装依赖

```bash
# Node.js
npm install express cors uuid pm2 -g

# Python
pip3 install python-pptx requests
```

#### 3. 配置 Skywork 认证

```bash
cd /path/to/skywork-ppt-1.0.3
python3 scripts/skywork_auth.py --login
```

#### 4. 使用 PM2 管理进程

```bash
# 启动服务
pm2 start server.js --name ppt-generator

# 开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs ppt-generator
```

#### 5. 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name ppt.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6. HTTPS 配置（可选）

```bash
# 使用 Let's Encrypt
sudo certbot --nginx -d ppt.your-domain.com
```

## 🔧 配置选项

### 修改后端端口

编辑 `server.js`：
```javascript
const PORT = process.env.PORT || 3000;
```

或使用环境变量：
```bash
PORT=8080 node server.js
```

### 修改输出目录

编辑 `server.js`：
```javascript
const OUTPUT_DIR = '/path/to/your/outputs';
```

### 修改 Skywork 技能路径

编辑 `server.js`：
```javascript
const SKYWORK_SKILL_DIR = '/path/to/skywork-ppt-1.0.3';
```

## 📊 API 文档

### POST /api/ppt/generate

创建 PPT 生成任务

**请求体**：
```json
{
  "topic": "人工智能发展趋势",
  "slideCount": 10,
  "style": "business",
  "language": "zh"
}
```

**响应**：
```json
{
  "success": true,
  "taskId": "uuid-here",
  "message": "PPT 生成任务已创建",
  "estimatedTime": "5-10 分钟"
}
```

### GET /api/ppt/status/:taskId

查询任务状态

**响应**：
```json
{
  "success": true,
  "task": {
    "id": "uuid-here",
    "status": "processing",
    "progress": 45,
    "stage": "Generating slides",
    "topic": "人工智能发展趋势",
    "createdAt": 1234567890
  }
}
```

状态说明：
- `pending`: 等待中
- `processing`: 生成中
- `completed`: 已完成
- `error`: 出错

### GET /api/ppt/download/:taskId

下载 PPT 文件

**响应**：直接返回 `.pptx` 文件

### GET /api/health

健康检查

**响应**：
```json
{
  "status": "ok",
  "service": "ppt-generator-server",
  "timestamp": 1234567890,
  "activeTasks": 3
}
```

## 🐛 问题排查

### 问题 1：后端启动失败

**错误**：`Cannot find module 'express'`

**解决**：
```bash
npm install express cors uuid
```

### 问题 2：Skywork 认证失败

**错误**：`Authentication failed`

**解决**：
```bash
python3 scripts/skywork_auth.py --login
```

### 问题 3：生成超时

**现象**：任务状态一直是 `processing`

**解决**：
- 检查 Skywork 技能日志
- 增加超时时间（默认 10 分钟）
- 检查服务器资源

### 问题 4：文件下载失败

**错误**：`File not found`

**解决**：
- 检查输出目录权限
- 确认任务状态为 `completed`
- 查看日志文件

## 📝 日志管理

### 查看实时日志

```bash
# 后端服务日志
pm2 logs ppt-generator

# Skywork 技能日志
tail -f /tmp/ppt-outputs/*.log
```

### 清理旧文件

```bash
# 清理 7 天前的输出文件
find /tmp/ppt-outputs -name "*.pptx" -mtime +7 -delete
find /tmp/ppt-outputs -name "*.log" -mtime +7 -delete
```

## 🔐 安全建议

1. **添加 API 认证**：
```javascript
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});
```

2. **限制请求大小**：
```javascript
app.use(express.json({ limit: '1mb' }));
```

3. **添加速率限制**：
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 10 // 最多 10 个请求
});
app.use('/api/ppt/generate', limiter);
```

## 📈 性能优化

1. **使用 Redis 存储任务状态**（替代内存 Map）
2. **添加任务队列**（避免并发过高）
3. **启用 Gzip 压缩**
4. **使用 CDN 分发 PPT 文件**

---

需要帮助？查看 README.md 或联系 清月科技 🚀
