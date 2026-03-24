# 如何添加你自己的 AI 工具/工作流/Agent

## 快速开始

编辑 `data/my-tools.json` 文件，按照以下格式添加你的工具：

## 配置文件格式

```json
{
  "category": {
    "id": "my-tools",
    "name": "我的工具",
    "icon": "⭐"
  },
  "tools": [
    {
      "name": "工具名称",
      "url": "https://你的工具链接.com",
      "desc": "工具描述",
      "tags": ["标签 1", "标签 2"]
    }
  ]
}
```

## 完整示例

```json
{
  "category": {
    "id": "my-tools",
    "name": "我的工具",
    "icon": "⭐"
  },
  "tools": [
    {
      "name": "智能客服 Agent",
      "url": "https://coze.cn/bot/123456",
      "desc": "基于扣子平台搭建的客服机器人，支持多轮对话和知识库查询",
      "tags": ["Agent", "客服", "扣子"]
    },
    {
      "name": "文章写作工作流",
      "url": "https://coze.cn/workflow/789012",
      "desc": "自动收集素材、生成大纲、撰写文章的完整工作流",
      "tags": ["工作流", "写作", "自动化"]
    },
    {
      "name": "数据分析工具",
      "url": "https://your-domain.com/data-analysis",
      "desc": "上传 Excel 自动生成可视化报表和分析结论",
      "tags": ["工具", "数据分析", "可视化"]
    },
    {
      "name": "图片处理 API",
      "url": "https://api.your-domain.com/image",
      "desc": "提供批量抠图、压缩、格式转换的 API 服务",
      "tags": ["API", "图片处理"]
    }
  ]
}
```

## 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 工具/Agent/工作流名称 |
| `url` | ✅ | 访问链接（可以是扣子、Dify、自建服务等） |
| `desc` | ✅ | 简短描述（建议 20 字以内） |
| `tags` | ❌ | 标签数组，用于分类和搜索 |

## 常见平台链接示例

### 扣子 (Coze)
- Bot: `https://coze.cn/bot/xxxxxx`
- 工作流：`https://coze.cn/workflow/xxxxxx`

### Dify
- 应用：`https://cloud.dify.ai/app/xxxxxx`

### 自建服务
- 直接填写你的域名：`https://your-tool.com`

### GitHub 项目
- 项目地址：`https://github.com/username/repo`
- Demo 地址：`https://username.github.io/repo`

## 部署更新

修改完成后，提交并推送代码：

```bash
cd ai-toolbox
git add data/my-tools.json
git commit -m "添加自定义工具"
git push
```

GitHub Pages 会在 1-2 分钟内自动更新。

## 进阶：修改分类名称

如果想修改"我的工具"这个分类的名称和图标：

```json
{
  "category": {
    "id": "my-tools",
    "name": "老谭的工具箱",  // 自定义名称
    "icon": "🛠️"            // 自定义图标
  },
  "tools": [...]
}
```

## 问题排查

1. **工具不显示？** 检查 JSON 格式是否正确（可用 https://jsonlint.com/ 验证）
2. **链接打不开？** 确保 URL 包含 `https://` 或 `http://`
3. **样式错乱？** 清除浏览器缓存后刷新

---

有问题？联系 清月科技 🚀
