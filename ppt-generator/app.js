// AI PPT 生成器 - 主逻辑

// 配置
const CONFIG = {
    // Skywork API 配置 - 请替换为你的实际配置
    skyworkApiUrl: 'https://api.skywork.ai/v1/ppt/generate',
    skyworkApiKey: '', // 从环境变量或配置中获取
    
    // 本地存储键
    storageKey: 'ppt_generator_history',
    
    // 生成超时时间（毫秒）
    timeout: 120000
};

// 当前生成状态
let currentGeneration = null;
let startTime = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    checkConfig();
});

// 检查配置
function checkConfig() {
    if (!CONFIG.skyworkApiKey) {
        console.warn('Skywork API Key 未配置，将使用模拟模式');
        showToast('提示：Skywork API 未配置，当前为演示模式', 'info');
    }
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
        // 调用 Skywork API（或模拟）
        const result = await callSkyworkAPI(topic, slideCount, style, language);
        
        // 显示结果
        showResult(result);
        
        // 保存到历史记录
        saveToHistory({
            topic,
            slideCount,
            style,
            language,
            result,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('生成失败:', error);
        showToast(error.message || '生成失败，请重试', 'error');
        showStep1();
    }
}

// 调用 Skywork API
async function callSkyworkAPI(topic, slideCount, style, language) {
    // 如果没有配置 API Key，使用模拟数据
    if (!CONFIG.skyworkApiKey) {
        return await simulateGeneration(topic, slideCount, style, language);
    }

    // 实际 API 调用
    const response = await fetch(CONFIG.skyworkApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.skyworkApiKey}`
        },
        body: JSON.stringify({
            topic,
            slideCount: parseInt(slideCount),
            style,
            language
        })
    });

    if (!response.ok) {
        throw new Error('API 调用失败：' + response.statusText);
    }

    return await response.json();
}

// 模拟生成（演示用）
async function simulateGeneration(topic, slideCount, style, language) {
    // 模拟进度更新
    updateProgress(10, '正在分析主题...');
    await sleep(1000);
    
    updateProgress(30, '正在生成大纲...');
    document.getElementById('loadStep1').classList.add('active');
    await sleep(1500);
    
    updateProgress(60, '正在设计页面...');
    document.getElementById('loadStep1').classList.remove('active');
    document.getElementById('loadStep1').classList.add('completed');
    document.getElementById('loadStep2').classList.add('active');
    await sleep(1500);
    
    updateProgress(85, '正在优化排版...');
    document.getElementById('loadStep2').classList.remove('active');
    document.getElementById('loadStep2').classList.add('completed');
    document.getElementById('loadStep3').classList.add('active');
    await sleep(1000);
    
    updateProgress(100, '生成完成！');
    document.getElementById('loadStep3').classList.remove('active');
    document.getElementById('loadStep3').classList.add('completed');
    await sleep(500);

    // 生成模拟数据
    const slides = [];
    const slideCountNum = parseInt(slideCount);
    
    // 封面页
    slides.push({
        number: 1,
        title: topic,
        content: ['AI 自动生成演示文稿', `风格：${getStyleName(style)}`, `语言：${language === 'zh' ? '中文' : 'English'}`],
        type: 'cover'
    });

    // 内容页
    for (let i = 2; i <= slideCountNum; i++) {
        slides.push({
            number: i,
            title: `第 ${i-1} 部分 - ${getRandomTitle(i-1)}`,
            content: getRandomContent(),
            type: 'content'
        });
    }

    // 结束页
    slides.push({
        number: slides.length + 1,
        title: '感谢观看',
        content: ['THANK YOU', '如有问题，欢迎交流'],
        type: 'ending'
    });

    return {
        slides,
        downloadUrl: '#',
        pptId: 'demo_' + Date.now()
    };
}

// 辅助函数
function getStyleName(style) {
    const styles = {
        business: '商务专业',
        creative: '创意设计',
        minimal: '简约现代',
        education: '教育培训',
        tech: '科技感'
    };
    return styles[style] || style;
}

function getRandomTitle(index) {
    const titles = [
        '背景介绍', '市场分析', '技术方案', '实施计划',
        '团队介绍', '财务预测', '风险评估', '总结展望'
    ];
    return titles[(index - 1) % titles.length];
}

function getRandomContent() {
    const contents = [
        ['关键点一：详细说明内容', '关键点二：详细说明内容', '关键点三：详细说明内容'],
        ['数据支持：XX% 增长率', '案例分享：成功项目示例', '趋势分析：未来发展方向'],
        ['技术架构：系统组成说明', '核心功能：主要特性列表', '优势对比：与竞品差异']
    ];
    return contents[Math.floor(Math.random() * contents.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    if (!currentGeneration) {
        showToast('没有可下载的 PPT', 'error');
        return;
    }

    // 实际项目中，这里应该调用后端 API 生成真实的 .pptx 文件
    // 演示模式下，显示提示
    showToast('演示模式：实际项目中将下载 .pptx 文件', 'info');
    
    // 模拟下载
    // window.location.href = currentGeneration.downloadUrl;
}

// 重新生成
function regenerate() {
    showStep1();
    currentGeneration = null;
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
