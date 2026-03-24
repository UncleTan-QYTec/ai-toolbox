# AI PPT 生成器 - 快速开始

## 🎯 功能说明

这是一个完整的 AI PPT 生成系统，包含：

1. **前端页面** - 用户输入主题、选择风格
2. **后端服务** - 接收请求、调用 Skywork 技能
3. **Skywork PPT 技能** - 实际生成 PPT

## ⚡ 5 分钟快速启动

### 前提条件

- ✅ Node.js >= 16
- ✅ Python >= 3.8
- ✅ Skywork 账号（已认证）

### 步骤 1：安装依赖

```bash
cd /home/klnhtt/.openclaw/workspace-coder/ai-toolbox/ppt-generator

# 安装 Node.js 依赖
npm install
```

### 步骤 2：启动后端

```bash
node server.js
```

看到以下输出表示成功：
```
🚀 AI PPT 生成器后端服务已启动
📍 监听端口：http://localhost:3000
```

### 步骤 3：打开前端

浏览器访问：**http://localhost:3000/**

### 步骤 4：生成 PPT

1. 输入主题，例如："2024 年人工智能发展趋势"
2. 选择页数（10 页）
3. 选择风格（商务专业）
4. 点击"✨ 开始生成"
5. 等待进度条完成（约 5-10 分钟）
6. 点击"📥 下载 PPT"

## 📋 完整流程示例

### 用户操作

```
1. 打开网页 http://localhost:3000/
2. 输入："新能源汽车市场分析"
3. 选择：15 页、科技感、中文
4. 点击生成
```

### 系统处理

```
前端 → POST /api/ppt/generate
       ↓
后端 → 创建任务 ID: ppt_xxx
       ↓
后端 → 调用 Skywork 技能
       ↓
Skywork → 生成大纲 (10%)
          ↓
          生成幻灯片 (30-80%)
          ↓
          渲染图片 (90%)
          ↓
          导出 PPTX (100%)
       ↓
后端 → 轮询进度（每 3 秒）
       ↓
前端 → 实时更新进度条
       ↓
完成 → 提供下载链接
```

### 生成结果

- 📄 文件格式：`.pptx`
- 📊 页数：15 页
- 📍 保存位置：`/tmp/ppt-outputs/ppt_xxx.pptx`
- 🔗 下载链接：`http://localhost:3000/api/ppt/download/ppt_xxx`

## 🎨 风格选项

| 风格 | 说明 | 适用场景 |
|------|------|---------|
| 商务专业 | 简洁大方 | 商业计划、汇报 |
| 创意设计 | 活泼创意 | 营销方案、活动 |
| 简约现代 | 极简风格 | 产品介绍、路演 |
| 教育培训 | 清晰易懂 | 课件、培训材料 |
| 科技感 | 未来感强 | 技术分享、科技 |

## 📊 进度说明

生成过程分为 4 个阶段：

```
1. 生成大纲 (0-20%)
   └─ 分析主题，创建结构

2. 生成幻灯片 (20-80%)
   └─ 逐页创建内容

3. 渲染图片 (80-95%)
   └─ 生成配图、图表

4. 导出 PPTX (95-100%)
   └─ 打包下载文件
```

## 🐛 常见问题

### Q: 点击生成没反应？

A: 检查后端是否启动：
```bash
curl http://localhost:3000/api/health
```

### Q: 进度一直停在 0%？

A: 
1. 检查 Skywork 认证：`python3 scripts/skywork_auth.py --check`
2. 查看后端日志
3. 确认 Python 环境正常

### Q: 下载失败？

A:
1. 确认任务状态为 `completed`
2. 检查文件是否存在：`ls -la /tmp/ppt-outputs/`
3. 查看浏览器控制台错误

### Q: 生成速度慢？

A:
- 正常速度：5-10 分钟/10 页
- 优化建议：
  - 减少页数
  - 避免复杂图表
  - 升级服务器配置

## 🔧 自定义配置

### 修改默认主题

编辑 `index.html`：
```html
<textarea id="topicInput" placeholder="默认提示词..."></textarea>
```

### 修改默认页数

编辑 `index.html`：
```html
<select id="slideCount">
    <option value="10" selected>10 页（标准版）</option>
</select>
```

### 修改 API 地址

编辑 `app.js`：
```javascript
const CONFIG = {
    backendApiUrl: 'http://localhost:3000/api/ppt'
    // 生产环境改为：
    // backendApiUrl: 'https://your-domain.com/api/ppt'
};
```

## 📝 示例主题

可以直接使用这些主题测试：

```
• 2024 年人工智能发展趋势
• 新能源汽车市场分析
• 项目管理方法论培训
• 数字化转型方案
• 团队建设活动策划
• 产品发布会演示文稿
• 年度销售总结报告
• 创业融资商业计划书
```

## 🚀 下一步

- [ ] 添加用户登录
- [ ] 支持上传模板
- [ ] 支持在线编辑
- [ ] 添加支付功能
- [ ] 部署到生产环境

---

**技术支持**：清月科技  
**文档**：查看 DEPLOY.md 获取详细部署指南
