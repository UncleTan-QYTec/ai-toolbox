/**
 * AI PPT 生成器 - 后端服务
 * 调用 Skywork.ai API 生成 PPT
 * 
 * 使用方法：
 * 1. 安装依赖：npm install express cors dotenv
 * 2. 配置环境变量：cp .env.example .env (填入 Skywork API Key)
 * 3. 启动服务：node server.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Skywork API 配置
const SKYWORK_CONFIG = {
    apiKey: process.env.SKYWORK_API_KEY || '',
    baseUrl: process.env.SKYWORK_API_URL || 'https://api.skywork.ai/v1',
    model: process.env.SKYWORK_MODEL || 'skywork-ppt-v1'
};

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        skyworkConfigured: !!SKYWORK_CONFIG.apiKey
    });
});

// PPT 生成接口
app.post('/api/ppt', async (req, res) => {
    try {
        const { topic, slide_count = 10, style = 'business', language = 'zh' } = req.body;

        // 参数验证
        if (!topic || topic.trim().length === 0) {
            return res.status(400).json({
                error: '主题不能为空',
                code: 'INVALID_TOPIC'
            });
        }

        if (slide_count < 5 || slide_count > 30) {
            return res.status(400).json({
                error: '页数必须在 5-30 之间',
                code: 'INVALID_SLIDE_COUNT'
            });
        }

        console.log(`[PPT Generate] Topic: ${topic}, Slides: ${slide_count}, Style: ${style}`);

        // 如果配置了 Skywork API Key，调用真实 API
        if (SKYWORK_CONFIG.apiKey) {
            try {
                const result = await callSkyworkAPI({
                    topic,
                    slide_count,
                    style,
                    language
                });
                return res.json(result);
            } catch (skyworkError) {
                console.error('Skywork API 调用失败:', skyworkError.message);
                // 降级到模拟数据
            }
        }

        // 返回模拟数据（用于测试）
        const mockResult = generateMockPPT(topic, slide_count, style, language);
        res.json(mockResult);

    } catch (error) {
        console.error('PPT 生成错误:', error);
        res.status(500).json({
            error: '生成失败，请稍后重试',
            code: 'GENERATION_ERROR',
            details: error.message
        });
    }
});

// 调用 Skywork API
async function callSkyworkAPI(params) {
    const response = await axios.post(
        `${SKYWORK_CONFIG.baseUrl}/ppt/generate`,
        {
            model: SKYWORK_CONFIG.model,
            prompt: params.topic,
            options: {
                slide_count: params.slide_count,
                style: params.style,
                language: params.language
            }
        },
        {
            headers: {
                'Authorization': `Bearer ${SKYWORK_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 60000 // 60 秒超时
        }
    );

    return {
        slides: response.data.slides || [],
        downloadUrl: response.data.download_url || '',
        previewUrl: response.data.preview_url || '',
        pptId: response.data.id || ''
    };
}

// 生成模拟 PPT 数据
function generateMockPPT(topic, slideCount, style, language) {
    const slideTemplates = {
        business: {
            colors: ['#1e40af', '#ffffff', '#f3f4f6'],
            fonts: ['Arial', 'Microsoft YaHei']
        },
        creative: {
            colors: ['#7c3aed', '#fbbf24', '#ffffff'],
            fonts: ['Georgia', 'SimHei']
        },
        minimal: {
            colors: ['#000000', '#ffffff', '#e5e7eb'],
            fonts: ['Helvetica', 'PingFang SC']
        },
        education: {
            colors: ['#059669', '#dbeafe', '#ffffff'],
            fonts: ['Verdana', 'KaiTi']
        },
        tech: {
            colors: ['#0891b2', '#0f172a', '#ffffff'],
            fonts: ['Consolas', 'Microsoft YaHei']
        }
    };

    const styleConfig = slideTemplates[style] || slideTemplates.business;

    const slides = [];
    
    // 封面页
    slides.push({
        number: 1,
        title: topic,
        subtitle: `AI 自动生成 · ${new Date().toLocaleDateString('zh-CN')}`,
        type: 'cover',
        content: '',
        style: styleConfig
    });

    // 目录页
    slides.push({
        number: 2,
        title: '目录',
        type: 'toc',
        content: [
            '背景介绍',
            '核心内容',
            '案例分析',
            '总结展望'
        ],
        style: styleConfig
    });

    // 内容页
    for (let i = 3; i <= slideCount; i++) {
        slides.push({
            number: i,
            title: `第${i-1}章：${topic} - 要点${i-2}`,
            type: 'content',
            content: [
                `核心观点 ${i-2}-1：详细说明内容`,
                `核心观点 ${i-2}-2：详细说明内容`,
                `核心观点 ${i-2}-3：详细说明内容`,
                `数据支持：XX 增长率达到 XX%`,
                `案例分析：成功实践分享`
            ],
            style: styleConfig
        });
    }

    // 总结页
    slides.push({
        number: slideCount,
        title: '总结与展望',
        type: 'summary',
        content: [
            '核心要点回顾',
            '下一步行动计划',
            'Q&A 问答环节'
        ],
        style: styleConfig
    });

    return {
        slides,
        metadata: {
            topic,
            slideCount,
            style,
            language,
            createdAt: new Date().toISOString()
        },
        downloadUrl: '/api/ppt/download',
        previewUrl: '/api/ppt/preview'
    };
}

// PPT 下载接口（生成 PPTX 文件）
app.get('/api/ppt/download', async (req, res) => {
    try {
        // 这里可以集成 PPTX 库生成真实的 PPT 文件
        // 目前返回一个示例文件
        
        const pptxContent = `PPT 文件内容
生成时间：${new Date().toISOString()}

这是一个示例 PPT 文件。
实际使用中，这里会生成真实的.pptx 文件。

建议使用以下库来生成 PPT:
- pptxgenjs (Node.js)
- python-pptx (Python)
`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', 'attachment; filename="presentation.pptx"');
        res.send(pptxContent);

    } catch (error) {
        res.status(500).json({ error: '下载失败' });
    }
});

// PPT 预览接口
app.get('/api/ppt/preview', (req, res) => {
    res.json({
        message: '预览功能开发中',
        slides: []
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: '服务器内部错误',
        code: 'INTERNAL_ERROR'
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        error: '接口不存在',
        code: 'NOT_FOUND'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║     AI PPT Generator Server                   ║
╠═══════════════════════════════════════════════╣
║  Status: Running                              ║
║  Port: ${PORT}                                    ║
║  Skywork API: ${SKYWORK_CONFIG.apiKey ? 'Configured' : 'Not Configured'}              ║
║                                               ║
║  Endpoints:                                   ║
║  - GET  /health                               ║
║  - POST /api/ppt                              ║
║  - GET  /api/ppt/download                     ║
║  - GET  /api/ppt/preview                      ║
╚═══════════════════════════════════════════════╝
    `);
});
