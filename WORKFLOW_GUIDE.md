# AI 工作流开发指南

本指南帮助你将自己的 AI 工作流/Agent 集成到 AI 工具箱网站。

## 📁 项目结构

```
ai-toolbox/
├── index.html              # 主站
├── ppt-generator/          # PPT 生成器（示例）
│   ├── index.html          # 工作流前端页面
│   ├── style.css           # 样式
│   ├── app.js              # 前端逻辑
│   ├── api-proxy.js        # 后端代理（可选）
│   └── README.md           # 使用说明
└── data/
    └── my-tools.json       # 工具配置
```

## 🚀 添加新工作流的步骤

### 步骤 1：创建工作流目录

```bash
cd ai-toolbox
mkdir -p your-workflow-name
```

### 步骤 2：创建前端页面

参考 `ppt-generator/` 的结构：

```
your-workflow-name/
├── index.html      # 主页面
├── style.css       # 样式（可选，可复用主站样式）
├── app.js          # 交互逻辑
└── README.md       # 说明文档
```

### 步骤 3：配置 API 集成

如果工作流需要调用外部 API（如 Skywork、扣子等）：

1. **前端直连**（仅测试）：在 `app.js` 中配置 API Key
2. **后端代理**（生产）：创建 `api-proxy.js`

### 步骤 4：添加到工具列表

编辑 `data/my-tools.json`：

```json
{
  "tools": [
    {
      "name": "你的工作流名称",
      "url": "./your-workflow-name/",
      "desc": "简短描述",
      "tags": ["标签 1", "标签 2"]
    }
  ]
}
```

### 步骤 5：提交发布

```bash
git add .
git commit -m "feat: 新增 XXX 工作流"
git push
```

## 📋 完整示例：AI 写作助手

### 1. 创建目录

```bash
mkdir -p ai-writer
```

### 2. index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>AI 写作助手</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <a href="../index.html" class="logo-link">
                <span>🚀</span><h1>AI 工具箱</h1>
            </a>
        </div>
    </header>
    
    <section class="hero">
        <h2>✍️ AI 写作助手</h2>
        <p>输入主题，AI 帮你写文章</p>
    </section>
    
    <script src="app.js"></script>
</body>
</html>
```

### 3. app.js

```javascript
async function generate() {
    const topic = document.getElementById('topic').value;
    const response = await fetch('https://api.skywork.ai/v1/write', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
    });
    const result = await response.json();
    document.getElementById('output').textContent = result.content;
}
```

### 4. 配置工具列表

编辑 `data/my-tools.json`：

```json
{
  "name": "AI 写作助手",
  "url": "./ai-writer/",
  "desc": "输入主题，自动生成文章",
  "tags": ["写作", "Skywork"]
}
```

## 🔌 常见 API 集成

### Skywork.ai

```javascript
const response = await fetch('https://api.skywork.ai/v1/chat', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'skywork-v1',
        messages: [{ role: 'user', content: '你好' }]
    })
});
```

### 扣子 (Coze) API

```javascript
const response = await fetch('https://api.coze.cn/v1/chat', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        bot_id: 'YOUR_BOT_ID',
        user_id: 'user_123',
        query: '你好'
    })
});
```

### Dify API

```javascript
const response = await fetch('https://api.dify.ai/v1/chat-messages', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${DIFY_KEY}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        inputs: {},
        query: '你好',
        response_mode: 'blocking'
    })
});
```

## 🎨 样式复用

所有工作流可以复用主站样式：

```html
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="style.css">
```

## 📦 部署选项

### 静态部署（GitHub Pages）

- ✅ 免费
- ✅ 简单
- ⚠️ 前端不能安全存储 API Key

### 全栈部署（Vercel/Netlify + Functions）

```
前端 → Serverless Functions → 外部 API
```

### 自建服务器

```bash
# Node.js 示例
npm install express
node api-proxy.js
```

## 🔒 安全建议

1. **不要在前端暴露 API Key** - 使用后端代理
2. **添加速率限制** - 防止滥用
3. **用户认证** - 如果需要付费功能
4. **HTTPS** - 生产环境必须使用

## 💡 创意工作流示例

| 工作流 | 功能 | API |
|--------|------|-----|
| AI PPT | 生成演示文稿 | Skywork |
| AI 写作 | 写文章/报告 | Skywork/扣子 |
| AI 绘画 | 生成图片 | Stable Diffusion |
| AI 翻译 | 多语言翻译 | DeepL/谷歌 |
| AI 客服 | 自动回复 | 扣子/Dify |
| AI 分析 | 数据分析 | Skywork |

## ❓ 常见问题

**Q: 如何测试我的工作流？**

A: 本地运行 `python3 -m http.server 8080`，访问 `localhost:8080/your-workflow/`

**Q: API Key 应该放在哪里？**

A: 测试时可在前端，生产环境必须用后端代理

**Q: 如何添加付费功能？**

A: 需要添加用户系统和支付集成，建议使用后端服务

---

需要帮助？联系 清月科技 🚀
