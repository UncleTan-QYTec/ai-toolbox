// AI PPT 生成器 - 前端逻辑

// API 配置
const API_CONFIG = {
    // Skywork API 端点（需要后端代理）
    baseUrl: '/api/ppt',
    // 或者直接使用 Skywork API
    // skyworkUrl: 'https://api.skywork.ai/v1/ppt/generate'
};

// 状态管理
let currentState = {
    topic: '',
    slideCount: 10,
    style: 'business',
    language: 'zh',
    generating: false,
    result: null,
    startTime: null
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    setupEventListeners();
});

// 设置事件监听
function setupEventListeners() {
    // 回车键提交（Ctrl+Enter）
    document.getElementById('topicInput').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generatePPT();
        }
    });
}

// 生成 PPT
async function generatePPT() {
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput.value.trim();

    if (!topic) {
        showToast('请输入 PPT 主题', 'error');
        topicInput.focus();
        return;
    }

    // 更新状态
    currentState = {
        topic,
        slideCount: parseInt(document.getElementById('slideCount').value),
        style: document.getElementById('style').value,
        language: document.getElementById('language').value,
        generating: true,
        result: null,
        startTime: Date.now()
    };

    // 切换到加载状态
    showStep('step2');
    updateProgress(0, '正在分析主题...');

    try {
        // 调用 API 生成 PPT
        const result = await callSkyworkAPI(currentState);
        
        // 生成完成
        currentState.result = result;
        currentState.generating = false;
        
        // 计算生成时间
        const generateTime = Math.round((Date.now() - currentState.startTime) / 1000);
        
        // 显示结果
        showResult(result, generateTime);
        
        // 保存到历史记录
        saveToHistory({
            topic,
            slideCount: currentState.slideCount,
            style: currentState.style,
            time: new Date().toISOString(),
            result
        });

    } catch (error) {
        console.error('生成失败:', error);
        showToast(error.message || '生成失败，请重试', 'error');
        showStep('step1');
    }
}

// 调用 Skywork API
async function callSkyworkAPI(params) {
    const progressSteps = [
        { percent: 20, text: '正在生成大纲...', step: 'loadStep1' },
        { percent: 50, text: '正在设计页面...', step: 'loadStep2' },
        { percent: 80, text: '正在优化排版...', step: 'loadStep3' },
        { percent: 100, text: '生成完成！', step: 'loadStep3' }
    ];

    // 模拟进度更新
    for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        updateProgress(step.percent, step.text);
        if (step.step) {
            document.getElementById(step.step).classList.add('active', 'completed');
        }
    }

    // 实际调用后端 API
    try {
        const response = await fetch(API_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: params.topic,
                slide_count: params.slideCount,
                style: params.style,
                language: params.language
            })
        });

        if (!response.ok) {
            // 如果后端不可用，返回模拟数据用于演示
            console.warn('API 不可用，使用模拟数据');
            return generateMockData(params);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.warn('API 调用失败，使用模拟数据:', error);
        // 返回模拟数据用于演示
        await new Promise(resolve => setTimeout(resolve, 1000));
        return generateMockData(params);
    }
}

// 生成模拟数据（用于演示）
function generateMockData(params) {
    const slides = [];
    const topics = [
        '封面页',
        '目录',
        '背景介绍',
        '核心概念',
        '市场分析',
        '技术方案',
        '实施计划',
        '预期成果',
        '风险评估',
        '总结展望'
    ];

    for (let i = 0; i < params.slideCount; i++) {
        slides.push({
            number: i + 1,
            title: topics[i] || `第${i + 1}页`,
            content: [
                `这是关于"${params.topic}"的第${i + 1}页内容`,
                '• 关键点一：详细说明内容',
                '• 关键点二：详细说明内容',
                '• 关键点三：详细说明内容'
            ].join('\n')
        });
    }

    return {
        slides,
        downloadUrl: '#',
        previewUrl: '#'
    };
}

// 更新进度
function updateProgress(percent, text) {
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = text;
}

// 显示步骤
function showStep(stepId) {
    ['step1', 'step2', 'step3'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(stepId).style.display = 'block';
}

// 显示结果
function showResult(result, generateTime) {
    showStep('step3');

    // 更新结果信息
    document.getElementById('slideCountResult').textContent = currentState.slideCount;
    document.getElementById('generateTime').textContent = generateTime;

    // 生成预览
    const previewContainer = document.getElementById('pptPreview');
    previewContainer.innerHTML = result.slides.map(slide => `
        <div class="slide-preview">
            <div class="slide-number">第 ${slide.number} 页</div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-content">${formatContent(slide.content)}</div>
        </div>
    `).join('');

    // 重置加载步骤状态
    ['loadStep1', 'loadStep2', 'loadStep3'].forEach(id => {
        document.getElementById(id).classList.remove('active', 'completed');
    });
}

// 格式化内容
function formatContent(content) {
    return content.replace(/\n/g, '<br>').replace(/•/g, '•');
}

// 下载 PPT
function downloadPPT() {
    if (!currentState.result) {
        showToast('没有可下载的内容', 'error');
        return;
    }

    // 实际场景中，这里会触发文件下载
    // window.open(currentState.result.downloadUrl, '_blank');
    
    // 演示：生成一个简单的 PPT 文件
    createAndDownloadPPT();
    showToast('下载已开始', 'success');
}

// 创建并下载 PPT（演示用）
function createAndDownloadPPT() {
    // 这里可以集成 PPTX 库来生成真实的 PPT 文件
    // 目前创建一个简单的文本文件作为演示
    const content = currentState.result.slides.map(slide => 
        `=== 第 ${slide.number} 页：${slide.title} ===\n${slide.content}`
    ).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PPT-${currentState.topic.substring(0, 20)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// 重新生成
function regenerate() {
    showStep('step1');
    document.getElementById('topicInput').value = '';
    document.getElementById('topicInput').focus();
}

// 编辑 PPT
function editPPT() {
    showToast('编辑功能开发中...', 'success');
}

// 保存到历史记录
function saveToHistory(record) {
    let history = getHistory();
    history.unshift({
        id: Date.now(),
        ...record
    });
    
    // 只保留最近 20 条
    history = history.slice(0, 20);
    
    localStorage.setItem('ppt_history', JSON.stringify(history));
    loadHistory();
}

// 获取历史记录
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('ppt_history')) || [];
    } catch {
        return [];
    }
}

// 加载历史记录
function loadHistory() {
    const history = getHistory();
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
                    ${item.slideCount}页 · ${item.style} · ${formatTime(item.time)}
                </div>
            </div>
            <div class="history-actions">
                <button class="history-btn download" onclick="downloadHistory(${item.id})">
                    📥 下载
                </button>
                <button class="history-btn delete" onclick="deleteHistory(${item.id})">
                    🗑️ 删除
                </button>
            </div>
        </div>
    `).join('');
}

// 格式化时间
function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return date.toLocaleDateString('zh-CN');
}

// 下载历史记录
function downloadHistory(id) {
    const history = getHistory();
    const item = history.find(h => h.id === id);
    
    if (!item) {
        showToast('记录不存在', 'error');
        return;
    }

    currentState.result = item.result;
    downloadPPT();
}

// 删除历史记录
function deleteHistory(id) {
    let history = getHistory();
    history = history.filter(h => h.id !== id);
    localStorage.setItem('ppt_history', JSON.stringify(history));
    loadHistory();
    showToast('已删除', 'success');
}

// 显示提示
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 导航平滑滚动
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
