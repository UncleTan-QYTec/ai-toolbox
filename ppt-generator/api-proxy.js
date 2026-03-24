/**
 * Skywork API 代理示例（Node.js）
 * 
 * 使用方法：
 * 1. npm install express cors dotenv
 * 2. 创建 .env 文件，添加 SKYWORK_API_KEY=your_key
 * 3. node api-proxy.js
 * 4. 修改 app.js 中的 skyworkApiUrl 为 http://localhost:3000/api/ppt/generate
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API 代理端点
app.post('/api/ppt/generate', async (req, res) => {
    try {
        const { topic, slideCount, style, language } = req.body;

        // 验证参数
        if (!topic) {
            return res.status(400).json({ error: '主题不能为空' });
        }

        // 调用 Skywork API
        const response = await fetch('https://api.skywork.ai/v1/ppt/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SKYWORK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic,
                slideCount: parseInt(slideCount) || 10,
                style: style || 'business',
                language: language || 'zh'
            })
        });

        if (!response.ok) {
            throw new Error(`Skywork API 错误：${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('API 代理错误:', error);
        res.status(500).json({ 
            error: '生成失败', 
            message: error.message 
        });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'ppt-generator-proxy' });
});

app.listen(PORT, () => {
    console.log(`🚀 PPT API Proxy 运行在 http://localhost:${PORT}`);
    console.log(`📝 代理端点：http://localhost:${PORT}/api/ppt/generate`);
});
