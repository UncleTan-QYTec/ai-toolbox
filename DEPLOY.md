# 部署说明

## 在线访问

网站已发布到 GitHub Pages：

**https://uncletan-qytec.github.io/ai-toolbox/**

## 本地运行

```bash
cd ai-toolbox

# 方法 1: Python
python3 -m http.server 8080

# 方法 2: Node.js
npx serve

# 方法 3: PHP
php -S localhost:8080
```

然后访问 `http://localhost:8080`

## 更新工具

编辑 `data/tools.json` 文件，添加或修改工具信息。

## 自定义样式

编辑 `css/style.css` 文件，修改颜色变量：

```css
:root {
    --primary-color: #6366f1;    /* 主色调 */
    --secondary-color: #8b5cf6;  /* 次色调 */
    --bg-color: #0f0f23;         /* 背景色 */
}
```

## 部署到其他平台

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
拖拽 `ai-toolbox` 文件夹到 Netlify Drop

---

Made with ❤️ by 清月科技
