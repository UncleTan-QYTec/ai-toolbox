#!/bin/bash

# AI PPT 生成器 - 一键启动脚本
# 自动安装依赖并启动后端服务

echo "🚀 AI PPT 生成器 - 启动脚本"
echo "=========================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    echo "   macOS: brew install node"
    echo "   Ubuntu: sudo apt install nodejs npm"
    exit 1
fi

echo "✅ Node.js 版本：$(node --version)"

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 未检测到 Python3，请先安装 Python 3.8+"
    exit 1
fi

echo "✅ Python 版本：$(python3 --version)"

# 检查 Skywork 认证
SKYWORK_DIR="/home/klnhtt/.openclaw/workspace-coder/skills/skywork-ppt-1.0.3"
if [ -f "$SKYWORK_DIR/scripts/skywork_auth.py" ]; then
    echo "✅ Skywork PPT 技能已安装"
    python3 "$SKYWORK_DIR/scripts/skywork_auth.py" --check > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Skywork 认证有效"
    else
        echo "⚠️  Skywork 未认证，请先运行："
        echo "   python3 $SKYWORK_DIR/scripts/skywork_auth.py --login"
    fi
else
    echo "⚠️  未找到 Skywork PPT 技能"
fi

echo ""
echo "📦 安装依赖..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"
echo ""
echo "🌐 启动服务..."
echo ""
echo "=========================="
echo "服务已启动！"
echo "前端地址：http://localhost:3000"
echo "API 地址：http://localhost:3000/api/ppt"
echo "按 Ctrl+C 停止服务"
echo "=========================="
echo ""

# 启动服务
node server.js
