# AI PPT 生成器 📊

基于 Skywork.ai API 的智能演示文稿生成服务

## 功能特点

- ✨ **AI 生成**：输入主题，自动生成完整 PPT
- 🎨 **多种风格**：商务、创意、简约、教育、科技
- 📄 **灵活页数**：5-30 页可选
- 🌍 **多语言**：支持中文、英文
- 💾 **历史记录**：本地保存生成记录
- 📥 **一键下载**：生成可编辑的 PPTX 文件

## 快速开始

### 前端使用（无需后端）

1. 访问：`https://uncletan-qytec.github.io/ai-toolbox/ppt-generator/`
2. 输入 PPT 主题
3. 选择页数和风格
4. 点击"开始生成"

> 注意：纯前端模式下使用模拟数据演示，需要真实生成请部署后端服务

### 后端部署

#### 1. 安装依赖

```bash
cd ppt-generator
npm install
```

#### 2. 配置 API Key

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Skywork API Key：

```
SKYWORK_API_KEY=your_actual_api_key
```

获取 API Key: https://platform.skywork.ai/

#### 3. 启动服务

```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

服务启动后访问：http://localhost:3000

## API 接口

### 生成 PPT

```bash
POST /api/ppt
Content-Type: application/json

{
  "topic": "2024 年人工智能发展趋势",
  "slide_count": 10,
  "style": "business",
  "language": "zh"
}
```

**响应：**

```json
{
  "slides": [
    {
      "number": 1,
      "title": "封面页标题",
      "content": "页面内容...",
      "type": "cover"
    }
  ],
  "downloadUrl": "/api/ppt/download",
  "previewUrl": "/api/ppt/preview"
}
```

### 健康检查

```bash
GET /health
```

## 配置选项

### PPT 风格

| 风格 | 说明 | 适用场景 |
|------|------|----------|
| `business` | 商务专业 | 工作汇报、商业计划 |
| `creative` | 创意设计 | 创意提案、艺术设计 |
| `minimal` | 简约现代 | 学术报告、简洁演示 |
| `education` | 教育培训 | 课件、培训材料 |
| `tech` | 科技感 | 技术分享、产品介绍 |

### 页数范围

- 最少：5 页
- 最多：30 页
- 推荐：10-15 页

## 集成到网站

### 方式 1：GitHub Pages

前端已部署到：https://uncletan-qytec.github.io/ai-toolbox/ppt-generator/

### 方式 2：自建服务

1. 部署后端服务到服务器
2. 修改 `app.js` 中的 `API_CONFIG.baseUrl`
3. 重新部署前端

```javascript
const API_CONFIG = {
    baseUrl: 'https://your-server.com/api/ppt'
};
```

### 方式 3：Vercel/Netlify

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## Skywork API 对接

### 获取 API Key

1. 访问 https://platform.skywork.ai/
2. 注册/登录账号
3. 进入 API 管理页面
4. 创建新的 API Key

### API 调用示例

```python
import requests

response = requests.post(
    'https://api.skywork.ai/v1/ppt/generate',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    json={
        'model': 'skywork-ppt-v1',
        'prompt': '人工智能发展趋势',
        'options': {
            'slide_count': 10,
            'style': 'business'
        }
    }
)

print(response.json())
```

## 本地开发

```bash
# 克隆项目
git clone https://github.com/UncleTan-QYTec/ai-toolbox.git

# 进入目录
cd ai-toolbox/ppt-generator

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 API Key

# 启动开发服务器
npm run dev
```

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **后端**：Node.js, Express
- **AI**：Skywork.ai API
- **部署**：GitHub Pages, Vercel

## 常见问题

### Q: 生成失败怎么办？
A: 检查网络连接、API Key 是否正确，或查看服务器日志

### Q: 可以自定义模板吗？
A: 当前版本使用 AI 自动生成，自定义模板功能开发中

### Q: 支持导出其他格式吗？
A: 目前支持 PPTX，PDF 格式开发中

## 更新日志

### v1.0.0 (2024-03-24)
- ✨ 初始版本发布
- ✨ 支持 5 种 PPT 风格
- ✨ 历史记录功能
- ✨ Skywork API 集成

## 许可证

MIT License

---

Made with ❤️ by 清月科技
