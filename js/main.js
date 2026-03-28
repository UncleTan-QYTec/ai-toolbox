// 黑狸 AI 工具箱 - 主脚本

let toolsData = null;
let myToolsData = null;
let activeCategory = 'all';

// 工具 Logo 映射（使用首字母或品牌色）
const toolLogos = {
    // 写作类
    'DeepSeek': { emoji: '🐋', color: '#0066FF' },
    '文心一言': { emoji: '💬', color: '#FF6600' },
    '通义千问': { emoji: '🤖', color: '#6666FF' },
    'Kimi': { emoji: '🌙', color: '#9966FF' },
    '智谱清言': { emoji: '🧠', color: '#0099FF' },
    '讯飞星火': { emoji: '✨', color: '#FF3366' },
    
    // 图片类
    'Midjourney': { emoji: '🎨', color: '#5865F2' },
    'Stable Diffusion': { emoji: '🌊', color: '#FF9900' },
    'DALL-E 3': { emoji: '🎭', color: '#00C4B4' },
    'Leonardo.ai': { emoji: '🦁', color: '#FFD700' },
    'Remove.bg': { emoji: '✂️', color: '#FF6B6B' },
    'Upscale.media': { emoji: '🔍', color: '#4ECDC4' },
    
    // 视频类
    'Runway': { emoji: '🎬', color: '#00D4AA' },
    'Pika Labs': { emoji: '⚡', color: '#FF0080' },
    'HeyGen': { emoji: '👤', color: '#0066FF' },
    'D-ID': { emoji: '😊', color: '#FF6600' },
    '剪映': { emoji: '🎥', color: '#00F0FF' },
    'Sora': { emoji: '🎞️', color: '#10B981' },
    
    // 办公类
    '🔥 AI PPT 生成器': { emoji: '📊', color: '#6366F1' },
    'Gamma': { emoji: 'Γ', color: '#FF5722' },
    'Tome': { emoji: '📖', color: '#9C27B0' },
    'Notion AI': { emoji: '📝', color: '#000000' },
    '飞书智能伙伴': { emoji: '🚀', color: '#00D0E8' },
    '钉钉 AI': { emoji: '💼', color: '#0084FF' },
    'WPS AI': { emoji: '📄', color: '#FF6600' },
    
    // 编程类
    'GitHub Copilot': { emoji: '🐙', color: '#181717' },
    'Cursor': { emoji: '🎯', color: '#00AAFF' },
    'Codeium': { emoji: '⚡', color: '#8B5CF6' },
    '通义灵码': { emoji: '💻', color: '#6666FF' },
    'CodeWhisperer': { emoji: '🗣️', color: '#FF9900' },
    'Devin': { emoji: '🤖', color: '#00D4AA' },
    
    // 设计类
    'Canva AI': { emoji: '🎨', color: '#00C4CC' },
    'Figma AI': { emoji: '🖌️', color: '#F24E1E' },
    'Looka': { emoji: '💡', color: '#000000' },
    'Uizard': { emoji: '📱', color: '#7C3AED' },
    'Khroma': { emoji: '🌈', color: '#FF6B6B' },
    'Fontjoy': { emoji: '🔤', color: '#4A90D9' },
    
    // 音频类
    'Suno': { emoji: '🎵', color: '#FF4757' },
    'ElevenLabs': { emoji: '🗣️', color: '#0052CC' },
    'Adobe Podcast': { emoji: '🎙️', color: '#FF0000' },
    'Descript': { emoji: '📻', color: '#00D1B2' },
    'Murf.ai': { emoji: '🎧', color: '#5C6BC0' },
    '剪映配音': { emoji: '🎤', color: '#00F0FF' },
    
    // 翻译类
    'DeepL': { emoji: '🌐', color: '#002878' },
    '谷歌翻译': { emoji: '🔤', color: '#4285F4' },
    '百度翻译': { emoji: '🈯', color: '#2932E1' },
    '有道翻译': { emoji: '📚', color: '#E4393C' },
    '彩云小译': { emoji: '☁️', color: '#FF6B35' },
    '沉浸式翻译': { emoji: '📖', color: '#00B894' },
    
    // 搜索类
    'Perplexity': { emoji: '❓', color: '#00D4AA' },
    '秘塔 AI 搜索': { emoji: '🔍', color: '#FF6600' },
    '天工 AI': { emoji: '🔭', color: '#6366F1' },
    '360 AI 搜索': { emoji: '🔎', color: '#00AA00' },
    '博查': { emoji: '📊', color: '#0066FF' },
    'Felo': { emoji: '🌏', color: '#FF5722' },
    
    // 学习类
    '可汗学院 AI': { emoji: '🎓', color: '#14D6A2' },
    'Coursera AI': { emoji: '📚', color: '#0056D2' },
    '多邻国': { emoji: '🦉', color: '#58CC02' },
    'Quizlet AI': { emoji: '🃏', color: '#4255FF' },
    'Otter.ai': { emoji: '🦦', color: '#00BFFF' },
    'Grammarly': { emoji: '✅', color: '#15C39A' }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadToolsData();
    await loadMyToolsData();
    renderCategoryTabs();
    renderToolsSections();
    setupEventListeners();
});

// 加载工具数据
async function loadToolsData() {
    try {
        const response = await fetch('data/tools.json');
        toolsData = await response.json();
    } catch (error) {
        console.error('加载工具数据失败:', error);
        showError('加载工具数据失败，请稍后重试');
    }
}

// 加载自定义工具数据
async function loadMyToolsData() {
    try {
        const response = await fetch('data/my-tools.json');
        myToolsData = await response.json();
    } catch (error) {
        console.log('未找到自定义工具配置，使用默认值');
        myToolsData = null;
    }
}

// 渲染分类标签
function renderCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabs');
    
    // 全部标签
    const allTab = createCategoryTab('all', '🔥', '全部');
    allTab.classList.add('active');
    tabsContainer.appendChild(allTab);
    
    // 我的工具标签（如果有自定义工具）
    if (myToolsData && myToolsData.category.id) {
        const myToolsTab = createCategoryTab(
            myToolsData.category.id, 
            myToolsData.category.icon, 
            myToolsData.category.name
        );
        tabsContainer.appendChild(myToolsTab);
    }
    
    // 各个分类标签
    toolsData.categories.forEach(category => {
        const tab = createCategoryTab(category.id, category.icon, category.name);
        tabsContainer.appendChild(tab);
    });
}

// 创建分类标签
function createCategoryTab(id, icon, name) {
    const tab = document.createElement('button');
    tab.className = 'category-tab';
    tab.dataset.category = id;
    tab.innerHTML = `<span>${icon}</span><span>${name}</span>`;
    tab.addEventListener('click', () => switchCategory(id));
    return tab;
}

// 切换分类
function switchCategory(categoryId) {
    activeCategory = categoryId;
    
    // 更新标签状态
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === categoryId);
    });
    
    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#tools');
    });
    
    // 滚动到工具区域
    const toolsSection = document.getElementById('tools');
    toolsSection.scrollIntoView({ behavior: 'smooth' });
    
    // 渲染工具
    renderToolsSections(categoryId);
}

// 渲染分区工具（主要函数）
function renderToolsSections(filterCategory = 'all') {
    const container = document.getElementById('toolsContainer');
    container.innerHTML = '';
    
    if (filterCategory === 'all') {
        // 显示所有分类
        toolsData.categories.forEach(category => {
            const section = createCategorySection(category);
            container.appendChild(section);
        });
        
        // 添加自定义工具分类
        if (myToolsData && myToolsData.tools && myToolsData.tools.length > 0) {
            const myToolsSection = createMyToolsSection();
            container.appendChild(myToolsSection);
        }
    } else if (myToolsData && filterCategory === myToolsData.category.id) {
        // 只显示自定义工具
        const myToolsSection = createMyToolsSection();
        container.appendChild(myToolsSection);
    } else {
        // 显示指定分类
        const category = toolsData.categories.find(c => c.id === filterCategory);
        if (category) {
            const section = createCategorySection(category);
            container.appendChild(section);
        }
    }
}

// 创建分类分区
function createCategorySection(category) {
    const section = document.createElement('div');
    section.className = 'category-section';
    section.dataset.category = category.id;
    
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <span class="category-header-icon">${category.icon}</span>
        <h3>${category.name}</h3>
    `;
    
    const grid = document.createElement('div');
    grid.className = 'tools-grid';
    
    category.tools.forEach((tool, index) => {
        const card = createToolCardWithLogo(tool, index, category);
        grid.appendChild(card);
    });
    
    section.appendChild(header);
    section.appendChild(grid);
    
    return section;
}

// 创建自定义工具分区
function createMyToolsSection() {
    const section = document.createElement('div');
    section.className = 'category-section';
    section.dataset.category = myToolsData.category.id;
    
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <span class="category-header-icon">${myToolsData.category.icon}</span>
        <h3>${myToolsData.category.name}</h3>
    `;
    
    const grid = document.createElement('div');
    grid.className = 'tools-grid';
    
    myToolsData.tools.forEach((tool, index) => {
        const card = createToolCardWithLogo(tool, index, myToolsData.category, true);
        grid.appendChild(card);
    });
    
    section.appendChild(header);
    section.appendChild(grid);
    
    return section;
}

// 创建带 Logo 的工具卡片
function createToolCardWithLogo(tool, index, category, isCustom = false) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    if (tool.featured) card.classList.add('featured');
    card.style.animationDelay = `${index * 0.05}s`;
    
    // 获取工具 Logo
    const logoInfo = toolLogos[tool.name] || { emoji: '🚀', color: '#6366f1' };
    const logoHtml = logoInfo.emoji.length === 1 
        ? `<span class="tool-logo-placeholder">${logoInfo.emoji}</span>`
        : `<span class="tool-logo-placeholder" style="color: ${logoInfo.color}; font-weight: bold;">${logoInfo.emoji}</span>`;
    
    // 自定义工具标记
    const customBadge = isCustom ? '<span class="custom-badge">⭐ 自制</span>' : '';
    
    // 推荐工具标记
    const featuredBadge = tool.featured ? '<span class="featured-badge">🔥 本站推荐</span>' : '';
    
    // 标签显示
    const tagsHtml = tool.tags ? 
        `<div class="tool-tags">${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}</div>` : '';
    
    card.innerHTML = `
        ${featuredBadge}${customBadge}
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
            <div class="tool-logo" style="border-color: ${logoInfo.color}40; background: ${logoInfo.color}15;">
                ${logoHtml}
            </div>
            <div class="tool-header">
                <h3 class="tool-name">${tool.name}</h3>
            </div>
            <p class="tool-desc">${tool.desc}</p>
            ${tagsHtml}
            <span class="tool-link">
                访问网站 →
            </span>
        </a>
    `;
    
    return card;
}

// 设置事件监听
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // 导航链接
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
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
}

// 搜索处理
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
        renderToolsSections(activeCategory);
        return;
    }
    
    const container = document.getElementById('toolsContainer');
    container.innerHTML = '';
    
    let allTools = [];
    toolsData.categories.forEach(category => {
        allTools = allTools.concat(category.tools.map(tool => ({
            ...tool,
            categoryId: category.id,
            categoryIcon: category.icon,
            categoryName: category.name
        })));
    });
    
    const filteredTools = allTools.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query) ||
        tool.categoryName.toLowerCase().includes(query)
    );
    
    if (filteredTools.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">未找到匹配的工具</p>';
        return;
    }
    
    // 按分类分组显示搜索结果
    const groupedTools = {};
    filteredTools.forEach(tool => {
        if (!groupedTools[tool.categoryId]) {
            groupedTools[tool.categoryId] = [];
        }
        groupedTools[tool.categoryId].push(tool);
    });
    
    Object.keys(groupedTools).forEach(categoryId => {
        const category = toolsData.categories.find(c => c.id === categoryId);
        if (category) {
            const section = document.createElement('div');
            section.className = 'category-section';
            
            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <span class="category-header-icon">${category.icon}</span>
                <h3>${category.name}（搜索结果）</h3>
            `;
            
            const grid = document.createElement('div');
            grid.className = 'tools-grid';
            
            groupedTools[categoryId].forEach((tool, index) => {
                const card = createToolCardWithLogo(tool, index, category);
                grid.appendChild(card);
            });
            
            section.appendChild(header);
            section.appendChild(grid);
            container.appendChild(section);
        }
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 显示错误信息
function showError(message) {
    console.error(message);
    const container = document.getElementById('toolsContainer');
    container.innerHTML = `<p style="text-align: center; color: #f5576c; padding: 40px;">${message}</p>`;
}
