// AI PPT 生成器 - 主逻辑

// 配置
const CONFIG = {
    // 后端 API 地址（本地开发）
    backendApiUrl: 'http://localhost:3000/api/ppt',
    
    // 生产环境 API 地址（部署时修改）
    // backendApiUrl: 'https://your-domain.com/api/ppt',
    
    // 本地存储键
    storageKey: 'ppt_generator_history',
    
    // 轮询间隔（毫秒）
    pollInterval: 3000
};

// 当前生成状态
let currentGeneration = null;
let startTime = null;
let currentTaskId = null;
let pollTimer = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    checkConfig();
});

// 检查配置
function checkConfig() {
    console.log('🔧 PPT 生成器已启动');
    console.log('📡 后端 API:', CONFIG.backendApiUrl);
    showToast('已连接到后端服务', 'success');
}

// 生成 PPT
async function generatePPT() {
    const topic = document.getElementById('topicInput').value.trim();
    
    if (!topic) {
        showToast('请输入 PPT 主题', 'error');
        document.getElementById('topicInput').focus();
        return;
    }

    const slideCount = document.getElementById('slideCount').value;
    const style = document.getElementById('style').value;
    const language = document.getElementById('language').value;

    // 切换到加载状态
    showLoadingState();
    startTime = Date.now();

    try {
        // 调用后端 API 创建任务
        const response = await fetch(`${CONFIG.backendApiUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic,
                slideCount: parseInt(slideCount),
                style,
                language
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '创建任务失败');
        }

        const data = await response.json();
        currentTaskId = data.taskId;

        showToast('任务已创建，开始生成 PPT...', 'info');

        // 开始轮询任务状态
        startPolling(data.taskId);

    } catch (error) {
        console.error('生成失败:', error);
        showToast(error.message || '生成失败，请重试', 'error');
        showStep1();
    }
}

// 轮询任务状态
function startPolling(taskId) {
    pollTimer = setInterval(async () => {
        try {
            const response = await fetch(`${CONFIG.backendApiUrl}/status/${taskId}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error('查询状态失败');
            }

            const task = data.task;

            // 更新进度
            updateProgress(task.progress, task.stage);

            // 检查是否完成
            if (task.status === 'completed') {
                clearInterval(pollTimer);
                pollTimer = null;

                // 显示结果
                showResult({
                    slides: generatePreviewSlides(task.topic, task.stage),
                    downloadUrl: `${CONFIG.backendApiUrl}/download/${taskId}`,
                    pptId: taskId
                });

                // 保存到历史记录
                saveToHistory({
                    topic: task.topic,
                    slideCount: 10,
                    style: 'custom',
                    language: 'zh',
                    result: {
                        slides: generatePreviewSlides(task.topic, task.stage),
                        downloadUrl: task.downloadUrl || `${CONFIG.backendApiUrl}/download/${taskId}`
                    },
                    timestamp: Date.now()
                });

                showToast('PPT 生成完成！', 'success');

            } else if (task.status === 'error') {
                clearInterval(pollTimer);
                pollTimer = null;
                showToast(task.error || '生成失败', 'error');
                showStep1();
            }

        } catch (error) {
            console.error('轮询失败:', error);
        }
    }, CONFIG.pollInterval);
}

// 停止轮询
function stopPolling() {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
}

// 生成预览幻灯片（用于展示）
function generatePreviewSlides(topic, stage) {
    const slides = [
        {
            number: 1,
            title: topic,
            content: ['AI 自动生成演示文稿', 'Skywork PPT 技能驱动', '清月科技出品'],
            type: 'cover'
        },
        {
            number: 2,
            title: '目录',
            content: ['项目背景', '核心功能', '技术架构', '应用场景'],
            type: 'content'
        },
        {
            number: 3,
            title: '项目背景',
            content: ['市场需求分析', '用户痛点', '解决方案'],
            type: 'content'
        }
    ];
    return slides;
}



// 更新进度
function updateProgress(percent, text) {
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = text;
}

// 显示加载状态
function showLoadingState() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    document.getElementById('step3').style.display = 'none';
    
    // 重置进度
    updateProgress(0, '准备中...');
    document.querySelectorAll('.step-item').forEach(el => {
        el.classList.remove('active', 'completed');
    });
}

// 显示步骤 1
function showStep1() {
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
}

// 显示结果
function showResult(result) {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';

    // 渲染预览
    const previewContainer = document.getElementById('pptPreview');
    previewContainer.innerHTML = result.slides.map(slide => `
        <div class="slide-preview">
            <div class="slide-number">第 ${slide.number} 页</div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content">
                ${slide.content.map(item => `<div>• ${item}</div>`).join('')}
            </div>
        </div>
    `).join('');

    // 更新信息
    document.getElementById('slideCountResult').textContent = result.slides.length;
    document.getElementById('generateTime').textContent = Math.round((Date.now() - startTime) / 1000);

    // 保存当前生成结果
    currentGeneration = result;

    showToast('PPT 生成成功！', 'success');
}

// 下载 PPT
function downloadPPT() {
    if (!currentGeneration || !currentTaskId) {
        showToast('没有可下载的 PPT', 'error');
        return;
    }

    // 调用后端下载接口
    const downloadUrl = `${CONFIG.backendApiUrl}/download/${currentTaskId}`;
    
    // 创建临时链接触发下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `PPT_${Date.now()}.pptx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('开始下载 PPT...', 'success');
}

// 重新生成
function regenerate() {
    stopPolling();
    showStep1();
    currentGeneration = null;
    currentTaskId = null;
}

// 编辑内容
function editPPT() {
    showToast('编辑功能开发中...', 'info');
}

// 保存到历史记录
function saveToHistory(record) {
    let history = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    
    history.unshift({
        id: Date.now(),
        ...record
    });

    // 只保留最近 20 条
    history = history.slice(0, 20);
    
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
    loadHistory();
}

// 加载历史记录
function loadHistory() {
    const history = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    const container = document.getElementById('historyList');

    if (history.length === 0) {
        container.innerHTML = '<p class="empty-state">暂无历史记录</p>';
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-info">
                <div class="history-topic">${item.topic}</div>
                <div class="history-meta">
                    ${item.slides.length} 页 | 
                    ${new Date(item.timestamp).toLocaleString('zh-CN')}
                </div>
            </div>
            <div class="history-actions">
                <button class="history-btn download" onclick="downloadHistoryItem(${item.id})">
                    📥 下载
                </button>
                <button class="history-btn delete" onclick="deleteHistoryItem(${item.id})">
                    🗑️ 删除
                </button>
            </div>
        </div>
    `).join('');
}

// 下载历史记录项
function downloadHistoryItem(id) {
    const history = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    const item = history.find(h => h.id === id);
    
    if (item) {
        currentGeneration = item.result;
        downloadPPT();
    }
}

// 删除历史记录项
function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    history = history.filter(h => h.id !== id);
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
    loadHistory();
    showToast('已删除', 'success');
}

// 显示提示框
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
