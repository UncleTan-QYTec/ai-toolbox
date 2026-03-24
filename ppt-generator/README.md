# AI PPT 生成器

基于 Skywork.ai API 的 PPT 自动生成工具。

## 功能

- ✨ 输入主题自动生成 PPT
- 📊 支持 5-20 页可选
- 🎨 5 种风格模板（商务、创意、简约、教育、科技）
- 🌐 中英文双语支持
- 💾 本地历史记录

## 配置 Skywork API

### 1. 获取 API Key

访问 [Skywork 开放平台](https://platform.skywork.ai/) 注册并获取 API Key。

### 2. 配置方式

#### 方式 A：直接配置（前端演示）

编辑 `app.js`，修改 CONFIG：

```javascript
const CONFIG = {
    skyworkApiUrl: 'https://api.skywork.ai/v1/ppt/generate',
    skyworkApiKey: 'YOUR_API_KEY_HERE'
};
```

⚠️ **注意**：前端直接配置 API Key 仅用于测试，生产环境请使用后端代理！

#### 方式 B：后端代理（推荐）

创建 `config.js`：

```javascript
const CONFIG = {
    skyworkApiUrl: '/api/ppt/generate',  // 你的后端代理地址
    skyworkApiKey: ''  // 后端处理
};
```

### 3. Skywork API 请求格式

```json
POST https://api.skywork.ai/v1/ppt/generate

Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "topic": "2024 年人工智能发展趋势",
  "slideCount": 10,
  "style": "business",
  "language": "zh"
}
```

### 4. 响应格式

```json
{
  "slides": [
    {
      "number": 1,
      "title": "封面标题",
      "content": ["要点 1", "要点 2"],
      "type": "cover"
    }
  ],
  "downloadUrl": "https://...",
  "pptId": "xxx"
}
```

## 本地运行

```bash
cd ppt-generator

# 方式 1: Python
python3 -m http.server 8080

# 方式 2: Node.js
npx serve
```

访问 `http://localhost:8080`

## 部署

### 静态部署（演示模式）

直接部署到 GitHub Pages 即可，使用模拟数据。

### 生产部署（真实 API）

需要后端服务代理 API 请求：

```
前端 → 你的后端 → Skywork API
```

后端示例（Node.js + Express）：

```javascript
app.post('/api/ppt/generate', async (req, res) => {
  const response = await fetch('https://api.skywork.ai/v1/ppt/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SKYWORK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});
```

## 自定义

### 修改默认配置

编辑 `index.html` 中的默认值：

```html
<select id="slideCount">
    <option value="10" selected>10 页（标准版）</option>
</select>
```

### 添加新风格

编辑 `app.js` 中的 `getStyleName` 函数和选项。

## 集成到你的网站

在你的网站中添加链接：

```html
<a href="/ai-toolbox/ppt-generator/" class="tool-card">
    <h3>📊 AI PPT 生成器</h3>
    <p>输入主题，30 秒生成专业 PPT</p>
</a>
```

## 问题排查

1. **生成失败**：检查 API Key 是否正确
2. **跨域错误**：使用后端代理方式
3. **下载不了**：需要后端生成真实 .pptx 文件

## 扩展功能

- [ ] 支持上传大纲生成
- [ ] 支持自定义模板
- [ ] 支持导出 PDF
- [ ] 支持在线编辑

---

Powered by Skywork.ai | Made with ❤️ by 清月科技
