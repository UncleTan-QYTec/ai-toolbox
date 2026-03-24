/**
 * AI PPT 生成器 - 后端服务
 * 
 * 功能：
 * 1. 接收前端请求
 * 2. 调用 Skywork PPT 技能生成 PPT
 * 3. 轮询进度并推送给前端
 * 4. 返回下载链接
 * 
 * 使用方式：
 * 1. npm install express cors uuid
 * 2. node server.js
 * 3. 前端配置 API 地址为 http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 任务存储（生产环境应该用 Redis/数据库）
const tasks = new Map();

// Skywork PPT 技能路径
const SKYWORK_SKILL_DIR = '/home/klnhtt/.openclaw/workspace-coder/skills/skywork-ppt-1.0.3';
const OUTPUT_DIR = '/tmp/ppt-outputs';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * 创建 PPT 生成任务
 */
app.post('/api/ppt/generate', async (req, res) => {
    try {
        const { topic, slideCount = 10, style = 'business', language = 'zh' } = req.body;

        if (!topic) {
            return res.status(400).json({ error: '主题不能为空' });
        }

        // 创建任务 ID
        const taskId = uuidv4();
        const timestamp = Date.now();
        const outputPath = path.join(OUTPUT_DIR, `ppt_${taskId}.pptx`);
        const logPath = path.join(OUTPUT_DIR, `ppt_${taskId}.log`);

        // 保存任务信息
        tasks.set(taskId, {
            id: taskId,
            topic,
            slideCount,
            style,
            language,
            status: 'pending',
            progress: 0,
            stage: '准备中',
            createdAt: timestamp,
            outputPath,
            logPath,
            downloadUrl: null
        });

        // 构建 Skywork PPT 命令
        const styleMap = {
            business: '商务专业',
            creative: '创意设计',
            minimal: '简约现代',
            education: '教育培训',
            tech: '科技感'
        };

        const query = `${topic}，${slideCount}页，${styleMap[style] || style}风格`;
        const langMap = { zh: 'Chinese', en: 'English', ja: 'Japanese', ko: 'Korean' };
        const skyworkLang = langMap[language] || 'Chinese';

        const command = `cd ${SKYWORK_SKILL_DIR} && python3 scripts/run_ppt_write.py "${query}" \\
            --language ${skyworkLang} \\
            --log_path "${logPath}" \\
            -o "${outputPath}"`;

        console.log(`[Task ${taskId}] 开始生成 PPT: ${topic}`);
        console.log(`[Task ${taskId}] 命令：${command}`);

        // 执行命令（后台运行）
        exec(command, {
            timeout: 600000, // 10 分钟超时
            maxBuffer: 1024 * 1024 * 10
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[Task ${taskId}] 执行错误:`, error);
                updateTask(taskId, {
                    status: 'error',
                    error: error.message
                });
                return;
            }

            // 检查日志文件获取最终结果
            if (fs.existsSync(logPath)) {
                const logContent = fs.readFileSync(logPath, 'utf-8');
                const doneMatch = logContent.match(/\[DONE\] saved=(.+?) download_url=(.+)/);
                
                if (doneMatch) {
                    updateTask(taskId, {
                        status: 'completed',
                        progress: 100,
                        stage: '完成',
                        outputPath: doneMatch[1],
                        downloadUrl: doneMatch[2]
                    });
                } else {
                    updateTask(taskId, {
                        status: 'error',
                        error: '生成完成但未找到输出文件'
                    });
                }
            }
        });

        // 启动进度监控
        startProgressMonitoring(taskId, logPath);

        // 立即返回任务 ID
        res.json({
            success: true,
            taskId,
            message: 'PPT 生成任务已创建',
            estimatedTime: '5-10 分钟'
        });

    } catch (error) {
        console.error('创建任务失败:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * 获取任务状态
 */
app.get('/api/ppt/status/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.get(taskId);

    if (!task) {
        return res.status(404).json({ error: '任务不存在' });
    }

    res.json({
        success: true,
        task: {
            id: task.id,
            status: task.status,
            progress: task.progress,
            stage: task.stage,
            topic: task.topic,
            createdAt: task.createdAt,
            downloadUrl: task.downloadUrl,
            error: task.error
        }
    });
});

/**
 * 获取所有任务（用于管理界面）
 */
app.get('/api/ppt/tasks', (req, res) => {
    const allTasks = Array.from(tasks.values()).map(task => ({
        id: task.id,
        topic: task.topic,
        status: task.status,
        progress: task.progress,
        stage: task.stage,
        createdAt: task.createdAt,
        downloadUrl: task.downloadUrl
    }));

    // 按创建时间倒序
    allTasks.sort((a, b) => b.createdAt - a.createdAt);

    res.json({
        success: true,
        tasks: allTasks
    });
});

/**
 * 下载 PPT 文件
 */
app.get('/api/ppt/download/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.get(taskId);

    if (!task) {
        return res.status(404).json({ error: '任务不存在' });
    }

    if (task.status !== 'completed' || !task.outputPath) {
        return res.status(400).json({ error: 'PPT 尚未生成完成' });
    }

    if (!fs.existsSync(task.outputPath)) {
        return res.status(404).json({ error: 'PPT 文件不存在' });
    }

    const filename = `PPT_${task.topic.slice(0, 20)}.pptx`;
    res.download(task.outputPath, filename);
});

/**
 * 删除任务
 */
app.delete('/api/ppt/task/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.get(taskId);

    if (!task) {
        return res.status(404).json({ error: '任务不存在' });
    }

    // 删除输出文件
    if (task.outputPath && fs.existsSync(task.outputPath)) {
        fs.unlinkSync(task.outputPath);
    }

    // 删除日志文件
    if (task.logPath && fs.existsSync(task.logPath)) {
        fs.unlinkSync(task.logPath);
    }

    tasks.delete(taskId);

    res.json({ success: true, message: '任务已删除' });
});

/**
 * 更新任务状态
 */
function updateTask(taskId, updates) {
    const task = tasks.get(taskId);
    if (task) {
        Object.assign(task, updates);
        console.log(`[Task ${taskId}] 状态更新：${updates.status} (${updates.progress}%)`);
    }
}

/**
 * 轮询日志文件监控进度
 */
function startProgressMonitoring(taskId, logPath) {
    let lastRead = 0;
    let pid = null;

    const monitorInterval = setInterval(() => {
        if (!fs.existsSync(logPath)) {
            return; // 日志文件还未创建
        }

        try {
            const content = fs.readFileSync(logPath, 'utf-8');
            const lines = content.split('\n');

            // 提取 PID
            const pidMatch = content.match(/\[PID\] (\d+)/);
            if (pidMatch && !pid) {
                pid = pidMatch[1];
                console.log(`[Task ${taskId}] 进程 PID: ${pid}`);
            }

            // 解析进度
            for (let i = lastRead; i < lines.length; i++) {
                const line = lines[i];

                // 进度更新 [PING] 30% | Generating slides
                const pingMatch = line.match(/\[PING\] (\d+)% \| (.+)/);
                if (pingMatch) {
                    updateTask(taskId, {
                        progress: parseInt(pingMatch[1]),
                        stage: pingMatch[2].trim()
                    });
                }

                // 阶段更新 [PHASE] ...
                const phaseMatch = line.match(/\[PHASE\] (.+)/);
                if (phaseMatch) {
                    updateTask(taskId, {
                        stage: phaseMatch[1].trim()
                    });
                }

                // 错误 [ERROR] ...
                const errorMatch = line.match(/\[ERROR\] (.+)/);
                if (errorMatch) {
                    updateTask(taskId, {
                        status: 'error',
                        error: errorMatch[1].trim()
                    });
                    clearInterval(monitorInterval);
                }

                // 完成 [DONE] ...
                const doneMatch = line.match(/\[DONE\]/);
                if (doneMatch) {
                    updateTask(taskId, {
                        status: 'completed',
                        progress: 100,
                        stage: '完成'
                    });
                    clearInterval(monitorInterval);
                }
            }

            lastRead = lines.length;

        } catch (error) {
            console.error(`[Task ${taskId}] 读取日志失败:`, error);
        }

        // 检查任务是否已结束
        const task = tasks.get(taskId);
        if (task && (task.status === 'completed' || task.status === 'error')) {
            clearInterval(monitorInterval);
        }

    }, 3000); // 每 3 秒检查一次

    // 5 分钟后自动停止监控
    setTimeout(() => clearInterval(monitorInterval), 300000);
}

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'ppt-generator-server',
        timestamp: Date.now(),
        activeTasks: tasks.size
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 AI PPT 生成器后端服务已启动`);
    console.log(`📍 监听端口：http://localhost:${PORT}`);
    console.log(`📝 API 端点:`);
    console.log(`   POST /api/ppt/generate    - 创建生成任务`);
    console.log(`   GET  /api/ppt/status/:id  - 查询任务状态`);
    console.log(`   GET  /api/ppt/download/:id - 下载 PPT 文件`);
    console.log(`   GET  /api/health          - 健康检查`);
    console.log(`\n💡 Skywork 技能目录：${SKYWORK_SKILL_DIR}`);
    console.log(`💾 输出目录：${OUTPUT_DIR}`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 服务正在关闭...');
    
    // 清理未完成的任务
    for (const [taskId, task] of tasks.entries()) {
        if (task.status === 'pending' || task.status === 'processing') {
            console.log(`清理任务 ${taskId}`);
            if (task.outputPath && fs.existsSync(task.outputPath)) {
                fs.unlinkSync(task.outputPath);
            }
        }
    }
    
    process.exit(0);
});
