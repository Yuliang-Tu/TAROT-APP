#!/bin/bash

echo "🚀 塔罗牌应用服务器部署脚本"
echo "================================"

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法："
    echo "  ./deploy.sh local     - 本地测试部署"
    echo "  ./deploy.sh server    - 服务器生产部署"
    echo "  ./deploy.sh update    - 更新现有部署"
    exit 1
fi

MODE=$1

case $MODE in
    "local")
        echo "🔧 本地测试部署..."
        
        # 检查Node.js
        if ! command -v node &> /dev/null; then
            echo "❌ Node.js 未安装"
            exit 1
        fi
        
        # 安装依赖
        npm install
        
        # 构建
        npm run build
        
        # 启动
        npm start
        ;;
        
    "server")
        echo "🌐 服务器生产部署..."
        
        # 创建目录
        sudo mkdir -p /var/www/tarot-app
        cd /var/www/tarot-app
        
        # 上传文件（这里需要手动上传或使用git）
        echo "请确保项目文件已上传到 /var/www/tarot-app"
        
        # 安装依赖
        npm install --production
        
        # 构建项目
        npm run build
        
        # PM2启动
        pm2 start npm --name "tarot-app" -- start
        pm2 save
        
        echo "✅ 服务器部署完成"
        echo "访问地址：http://your-server-ip:3000"
        ;;
        
    "update")
        echo "🔄 更新现有部署..."
        
        cd /var/www/tarot-app
        
        # 拉取最新代码
        git pull origin main
        
        # 安装新依赖
        npm install
        
        # 重新构建
        npm run build
        
        # 重启服务
        pm2 restart tarot-app
        
        echo "✅ 更新完成"
        ;;
        
    *)
        echo "❌ 未知参数: $MODE"
        exit 1
        ;;
esac