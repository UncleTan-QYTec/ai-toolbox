# Skywork PPT 技能测试报告

## ✅ 安装验证

### 1. 技能文件检查
```
✓ 技能目录：/home/klnhtt/.openclaw/workspace-coder/skills/skywork-ppt-1.0.3/
✓ 脚本文件：
  - run_ppt_write.py (PPT 生成)
  - skywork_auth.py (认证)
  - local_pptx_ops.py (本地操作)
  - parse_file.py (文件解析)
  - web_search.py (网络搜索)
  - upload_files.py (文件上传)
  - config.py (配置)
```

### 2. 环境检查
```
✓ Python 版本：Python 3.12.3
✓ Python 路径：/usr/bin/python3
✓ 依赖检查：python-pptx 已安装
```

### 3. 认证状态
```
✓ Skywork Token：有效
✓ 认证文件：~/.skywork_token 存在
```

### 4. 功能测试

#### Layer 1 - 生成 PPT
```bash
python3 scripts/run_ppt_write.py "人工智能发展趋势" \
  --language Chinese \
  -o /tmp/test_ppt.pptx
```

#### Layer 2 - 模板模仿
```bash
python3 scripts/run_ppt_write.py "新的主题" \
  --language Chinese \
  --template_urls "https://..." \
  -o /tmp/test_ppt2.pptx
```

#### Layer 3 - 本地操作
```bash
# 查看信息
python3 scripts/local_pptx_ops.py info --file test.pptx

# 删除幻灯片
python3 scripts/local_pptx_ops.py delete --file test.pptx --slides 2,4

# 重新排序
python3 scripts/local_pptx_ops.py reorder --file test.pptx --order 2,1,3,4,5
```

#### Layer 4 - 编辑 PPT
```bash
python3 scripts/run_ppt_write.py "让封面更专业" \
  --language Chinese \
  --pptx-url "https://..." \
  -o /tmp/edited.pptx
```

## 📋 使用流程

### 前端集成方式

网站前端（`ppt-generator/app.js`）需要：

1. **调用后端代理**（推荐）：
```javascript
const response = await fetch('/api/ppt/generate', {
    method: 'POST',
    body: JSON.stringify({
        topic: '人工智能发展趋势',
        slideCount: 10,
        style: 'business',
        language: 'zh'
    })
});
```

2. **后端调用 Skywork 技能**：
```bash
python3 /path/to/skywork-ppt/scripts/run_ppt_write.py \
    "人工智能发展趋势，10 页，商务风格" \
    --language Chinese \
    -o /path/to/output.pptx
```

3. **返回下载链接给前端**

## 🔧 配置选项

### 语言参数映射
| 前端语言 | Skywork 参数 |
|---------|-------------|
| zh | Chinese |
| en | English |
| ja | Japanese |
| ko | Korean |

### 风格参数映射
| 前端风格 | 说明 |
|---------|------|
| business | 商务专业 |
| creative | 创意设计 |
| minimal | 简约现代 |
| education | 教育培训 |
| tech | 科技感 |

## ⚠️ 注意事项

1. **执行超时**：PPT 生成需要 5-10 分钟，设置 `yieldMs: 600000`
2. **进度监控**：每 5 秒读取日志文件，向用户报告进度
3. **错误处理**：检查 `[ERROR]` 标记，提取错误信息
4. **Token 有效期**：定期检查认证状态

## 🚀 部署建议

### 方案 A：直接集成到现有网站
- 前端保持不变（使用模拟数据）
- 后端添加 `/api/ppt/generate` 端点
- 调用 Skywork 技能生成真实 PPT

### 方案 B：独立服务
- 部署 Skywork 技能到服务器
- 前端直接调用后端 API
- 支持队列管理（多用户并发）

## 📝 示例命令

完整生成流程：
```bash
# 1. 环境检查
PYTHON_CMD="python3"

# 2. 网络搜索（可选）
$PYTHON_CMD scripts/web_search.py "人工智能 2026 发展趋势"

# 3. 生成 PPT
$PYTHON_CMD scripts/run_ppt_write.py "人工智能发展趋势" \
  --language Chinese \
  --reference-file /tmp/search_results.md \
  -o /tmp/ai_trends.pptx

# 4. 输出结果
# [DONE] saved=/tmp/ai_trends.pptx download_url=https://...
```

---

**测试状态**：✅ 技能已就绪，可以开始使用！
