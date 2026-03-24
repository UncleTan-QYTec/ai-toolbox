#!/bin/bash

# 快速添加工具脚本
# 用法：./add-tool.sh "工具名称" "链接" "描述" "标签 1" "标签 2" ...

if [ $# -lt 3 ]; then
    echo "用法：./add-tool.sh \"工具名称\" \"链接\" \"描述\" [\"标签 1\" \"标签 2\" ...]"
    echo "示例：./add-tool.sh \"智能客服\" \"https://coze.cn/bot/123\" \"客服机器人\" \"Agent\" \"客服\""
    exit 1
fi

NAME="$1"
URL="$2"
DESC="$3"
shift 3

# 构建标签数组
TAGS=""
if [ $# -gt 0 ]; then
    TAGS=$(printf '"%s", ' "$@")
    TAGS="[${TAGS%, }]"
fi

# 读取现有文件
FILE="data/my-tools.json"
if [ ! -f "$FILE" ]; then
    echo "错误：未找到 $FILE 文件"
    exit 1
fi

# 创建新工具条目
NEW_TOOL="    {
      \"name\": \"$NAME\",
      \"url\": \"$URL\",
      \"desc\": \"$DESC\",
      \"tags\": $TAGS
    }"

# 使用 Python 安全地添加工具（避免 sed 处理 JSON 的问题）
python3 << EOF
import json

with open('$FILE', 'r', encoding='utf-8') as f:
    data = json.load(f)

new_tool = {
    "name": "$NAME",
    "url": "$URL",
    "desc": "$DESC",
    "tags": $TAGS if "$TAGS" else []
}

data['tools'].append(new_tool)

with open('$FILE', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✓ 已添加工具：$NAME")
EOF

echo "✓ 工具已添加到 $FILE"
echo "运行 'git add $FILE && git commit -m \"add: $NAME\" && git push' 来发布更新"
