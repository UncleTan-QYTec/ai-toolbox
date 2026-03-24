// AI 工具箱 - 主脚本

let toolsData = null;
let myToolsData = null;
let activeCategory = 'all';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadToolsData();
    await loadMyToolsData();
    renderCategoryTabs();
    renderTools('all');
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
    if (myToolsData && myToolsData.tools && myToolsData.tools.length > 0) {
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
    
    // 渲染工具
    renderTools(categoryId);
}

// 渲染工具卡片
function renderTools(categoryId) {
    const grid = document.getElementById('toolsGrid');
    grid.innerHTML = '';
    
    let tools = [];
    
    // 检查是否是"我的工具"分类
    if (myToolsData && categoryId === myToolsData.category.id) {
        tools = myToolsData.tools.map(tool => ({
            ...tool,
            categoryId: myToolsData.category.id,
            categoryIcon: myToolsData.category.icon,
            categoryName: myToolsData.category.name,
            isCustom: true
        }));
    } else if (categoryId === 'all') {
        // 显示所有工具（包括自定义工具）
        toolsData.categories.forEach(category => {
            tools = tools.concat(category.tools.map(tool => ({
                ...tool,
                categoryId: category.id,
                categoryIcon: category.icon,
                categoryName: category.name
            })));
        });
        // 添加自定义工具
        if (myToolsData && myToolsData.tools) {
            tools = myToolsData.tools.map(tool => ({
                ...tool,
                categoryId: myToolsData.category.id,
                categoryIcon: myToolsData.category.icon,
                categoryName: myToolsData.category.name,
                isCustom: true
            })).concat(tools);
        }
    } else {
        // 显示指定分类工具
        const category = toolsData.categories.find(c => c.id === categoryId);
        if (category) {
            tools = category.tools.map(tool => ({
                ...tool,
                categoryId: category.id,
                categoryIcon: category.icon,
                categoryName: category.name
            }));
        }
    }
    
    // 创建工具卡片
    tools.forEach((tool, index) => {
        const card = createToolCard(tool, index);
        grid.appendChild(card);
    });
}

// 创建工具卡片
function createToolCard(tool, index) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    // 自定义工具添加特殊标记
    const customBadge = tool.isCustom ? '<span class="custom-badge">⭐ 自制</span>' : '';
    
    // 标签显示
    const tagsHtml = tool.tags ? 
        `<div class="tool-tags">${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}</div>` : '';
    
    card.innerHTML = `
        ${customBadge}
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
            <h3 class="tool-name">${tool.name}</h3>
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
        renderTools(activeCategory);
        return;
    }
    
    const grid = document.getElementById('toolsGrid');
    grid.innerHTML = '';
    
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
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">未找到匹配的工具</p>';
        return;
    }
    
    filteredTools.forEach((tool, index) => {
        const card = createToolCard(tool, index);
        grid.appendChild(card);
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
    const grid = document.getElementById('toolsGrid');
    grid.innerHTML = `<p style="text-align: center; color: #f5576c; grid-column: 1/-1;">${message}</p>`;
}

// 更新网站信息
function updateSiteInfo() {
    if (toolsData && toolsData.siteInfo) {
        document.title = toolsData.siteInfo.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaDesc) metaDesc.content = toolsData.siteInfo.description;
        if (metaKeywords) metaKeywords.content = toolsData.siteInfo.keywords;
    }
}
