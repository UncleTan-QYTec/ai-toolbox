# AI PPT 生成器 - 部署和使用指南

## 🚀 快速访问

### 在线演示（纯前端）
https://uncletan-qytec.github.io/ai-toolbox/ppt-generator/

> ⚠️ 注意：纯前端模式使用模拟数据演示，需要真实生成请部署后端

---

## 📦 完整部署方案

### 方案 1：前端 + 后端（推荐）

#### 步骤 1：获取 Skywork API Key

1. 访问 https://platform.skywork.ai/
2. 注册/登录账号
3. 进入控制台 → API 管理
4. 创建新的 API Key

#### 步骤 2：部署后端服务

**选项 A - 本地部署：**

```bash
cd ppt-generator
npm install
cp .env.example .env
# 编辑 .env 填入 SKYWORK_API_KEY
npm start
```

**选项 B - Vercel 部署：**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd ppt-generator
vercel
```

**选项 C - 服务器部署：**

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 克隆项目
git clone https://github.com/UncleTan-QYTec/ai-toolbox.git
cd ai-toolbox/ppt-generator

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
nano .env  # 填入 API Key

# 使用 PM2 运行
npm install -g pm2
pm2 start server.js --name ppt-generator
pm2 save
pm2 startup
```

#### 步骤 3：配置前端 API 地址

编辑 `ppt-generator/app.js`：

```javascript
const API_CONFIG = {
    baseUrl: 'https://your-backend-url.com/api/ppt'  // 改为你的后端地址
};
```

#### 步骤 4：重新部署前端

```bash
cd ..
git add .
git commit -m "update: 配置 PPT 生成器 API 地址"
git push
```

---

### 方案 2：仅前端（演示用）

无需任何配置，直接访问：
https://uncletan-qytec.github.io/ai-toolbox/ppt-generator/

适合：
- 快速演示
- UI 测试
- 功能展示

---

## 🔧 Skywork API 对接

### API 文档

Skywork PPT 生成 API 端点：
```
POST https://api.skywork.ai/v1/ppt/generate
```

### 请求格式

```json
{
  "model": "skywork-ppt-v1",
  "prompt": "人工智能发展趋势",
  "options": {
    "slide_count": 10,
    "style": "business",
    "language": "zh"
  }
}
```

### 响应格式

```json
{
  "id": "ppt_xxxxx",
  "slides": [
    {
      "number": 1,
      "title": "封面页",
      "content": "...",
      "type": "cover"
    }
  ],
  "download_url": "https://...",
  "preview_url": "https://..."
}
```

### Python 调用示例

```python
import requests
import json

API_KEY = "your_api_key"
URL = "https://api.skywork.ai/v1/ppt/generate"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "skywork-ppt-v1",
    "prompt": "2024 年人工智能发展趋势",
    "options": {
        "slide_count": 10,
        "style": "business",
        "language": "zh"
    }
}

response = requests.post(URL, headers=headers, json=data)
result = response.json()

print(json.dumps(result, indent=2, ensure_ascii=False))
```

---

## 🎨 自定义配置

### 修改 PPT 风格

编辑 `ppt-generator/app.js` 中的 `generateMockPPT` 函数，或修改后端 `server.js` 中的 `slideTemplates`。

### 添加新的风格

```javascript
const slideTemplates = {
    // ... 现有风格
    custom: {
        colors: ['#your-color', '#ffffff'],
        fonts: ['Your-Font', 'Fallback-Font']
    }
};
```

### 修改默认参数

```javascript
// 默认页数
<select id="slideCount">
    <option value="10" selected>10 页（标准版）</option>
</select>

// 默认风格
<select id="style">
    <option value="business" selected>商务专业</option>
</select>
```

---

## 📊 使用统计

### 查看生成记录

所有生成记录保存在浏览器本地存储：

```javascript
const history = localStorage.getItem('ppt_history');
console.log(JSON.parse(history));
```

### 清除历史记录

在浏览器控制台执行：
```javascript
localStorage.removeItem('ppt_history');
location.reload();
```

---

## 🐛 故障排查

### 问题 1：生成一直加载中

**原因：** API 调用失败或网络问题

**解决：**
1. 检查网络连接
2. 验证 API Key 是否正确
3. 查看浏览器控制台错误信息
4. 检查后端服务日志

### 问题 2：下载的文件打不开

**原因：** 当前使用模拟数据，未生成真实 PPTX

**解决：**
1. 部署后端服务
2. 集成 PPTX 生成库（如 `pptxgenjs`）
3. 或对接 Skywork 真实下载链接

### 问题 3：GitHub Pages 404

**原因：** 页面未正确部署

**解决：**
```bash
git push -f origin main
# 等待 1-2 分钟
# 访问 https://uncletan-qytec.github.io/ai-toolbox/ppt-generator/
```

---

## 📈 性能优化

### 前端优化

1. 压缩 CSS/JS 文件
2. 启用 CDN 加速
3. 添加 Service Worker 缓存

### 后端优化

1. 使用 Redis 缓存生成结果
2. 添加请求限流
3. 启用 Gzip 压缩

---

## 🔐 安全建议

1. **不要在前端暴露 API Key**
2. 使用后端代理调用 Skywork API
3. 添加 CORS 限制
4. 实现用户认证（如需要）
5. 设置请求频率限制

---

## 📞 技术支持

遇到问题？

1. 查看 `ppt-generator/README.md`
2. 检查 GitHub Issues
3. 联系 清月科技

---

**最后更新：** 2024-03-24
