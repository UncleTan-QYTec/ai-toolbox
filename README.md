# AI 工具箱 🚀

> 精选全球优质 AI 应用，让 AI 技术触手可及

## 项目简介

AI 工具箱是一个全方位 AI 资源聚合平台，精选全球优质免费 AI 应用，涵盖多个领域：

- ✍️ **AI 写作** - 写作助手、论文工具、公文生成
- 🎨 **AI 图片** - 图像生成、抠图、修复、放大
- 🎬 **AI 视频** - 视频生成、数字人、剪辑
- 💼 **AI 办公** - PPT 生成、文档助手、数据分析
- 💻 **AI 编程** - 代码助手、IDE、开发框架
- 🖌️ **AI 设计** - Logo 设计、海报设计、3D 设计
- 🎵 **AI 音频** - 音乐生成、语音合成、配音
- 🌐 **AI 翻译** - 多语言翻译、字幕翻译
- 🔍 **AI 搜索** - 智能搜索引擎
- 📚 **AI 学习** - 学习课程、辅导工具

## 技术栈

- HTML5
- CSS3 (现代渐变、动画效果)
- JavaScript (ES6+)
- 响应式设计 (支持移动端)

## 本地运行

```bash
# 进入项目目录
cd ai-toolbox

# 使用 Python 启动本地服务器
python3 -m http.server 8080

# 或使用 Node.js
npx serve
```

然后访问 `http://localhost:8080`

## 部署

### GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在 Settings → Pages 中启用 GitHub Pages
3. 选择分支和文件夹

### Gitcode Pages

1. 将代码推送到 Gitcode 仓库
2. 在项目管理 → Pages 服务中启用

### Vercel / Netlify

直接连接 GitHub/Gitcode 仓库，自动部署

## 添加新工具

编辑 `data/tools.json` 文件，在对应分类下添加工具：

```json
{
  "name": "工具名称",
  "url": "https://example.com",
  "desc": "工具描述"
}
```

## 自定义

- 修改 `css/style.css` 中的颜色变量来自定义主题
- 修改 `data/tools.json` 中的 `siteInfo` 来自定义网站信息

## 许可证

MIT License

## 致谢

感谢所有 AI 工具的开发者们！

---

Made with ❤️ by 清月科技
