#!/bin/bash

echo "🔮 启动塔罗牌占卜应用..."
echo

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js"
    echo "下载地址：https://nodejs.org/"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告：未找到 .env 文件"
    echo "请确保 DEEPSEEK_API_KEY 已配置"
    echo
fi

# 启动生产服务器
echo "🚀 正在构建应用..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "🌟 启动生产服务器..."
echo "访问地址：http://localhost:3000"
echo "按 Ctrl+C 停止服务器"
echo

npm start