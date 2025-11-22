# 🔮 DeepTarot - 塔罗牌占卜应用

基于 Next.js 和 DeepSeek AI 的智能塔罗牌占卜 Web 应用。

## ✨ 功能特色

- 🎴 **完整塔罗牌组**：22张大阿尔克那塔罗牌
- 🤖 **AI 智能解读**：基于 DeepSeek 的专业解读
- 🌟 **沉浸式界面**：神秘星空背景，优雅动画
- 📱 **响应式设计**：完美适配桌面和移动设备
- ⚡ **实时流式响应**：AI 解读实时显示
- 🎯 **圣三角牌阵**：过去、现在、未来三张牌布局

## 🛠️ 技术栈

- **前端框架**：Next.js 16 + React 19
- **样式系统**：Tailwind CSS v4
- **AI 集成**：OpenAI SDK (连接 DeepSeek API)
- **图标库**：Lucide React
- **部署方式**：Node.js + PM2 + Nginx / Docker

## 🚀 快速开始

### 1. 环境要求
- Node.js 20.x+
- npm 或 yarn
- DEEPSEEK_API_KEY（从 [DeepSeek 平台](https://platform.deepseek.com/) 获取）

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置你的 API Key
```

### 4. 启动应用

#### 开发模式（推荐用于测试）
```bash
# Windows：双击 dev.bat
# Linux/Mac：./dev.sh
npm run dev
```

#### 生产模式（推荐用于部署）
```bash
# Windows：双击 start.bat
# Linux/Mac：./start.sh
npm run build
npm start
```

#### Docker 部署
```bash
docker-compose up -d
```

## 🌐 服务器部署

### 部署方案选择
- **云服务器**（推荐）：阿里云、腾讯云等 + PM2 + Nginx
- **免费平台**：Vercel、Netlify、Railway
- **Docker**：容器化部署

### 详细指南
查看 `SERVER-DEPLOYMENT.md` 了解完整部署流程

### 快速部署命令
```bash
# 服务器环境初始化
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
sudo apt install nginx -y

# 部署应用
git clone <your-repo> /var/www/tarot-app
cd /var/www/tarot-app
npm install --production
npm run build
pm2 start npm --name "tarot-app" -- start
```

## 📁 项目结构

```
my-tarot-app/
├── app/
│   ├── page.jsx              # 主页面（塔罗牌界面）
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式
│   └── api/tarot/route.ts   # AI 解读 API
├── public/                 # 静态资源
├── scripts/                # 部署脚本
│   ├── start.bat           # Windows 生产启动
│   ├── dev.bat            # Windows 开发启动
│   └── deploy.sh         # Linux 部署脚本
├── config/
│   ├── nginx.conf         # Nginx 配置
│   └── ecosystem.config.js # PM2 配置
├── .env.example          # 环境变量模板
├── SERVER-DEPLOYMENT.md  # 服务器部署指南
├── DEPLOYMENT-CHECKLIST.md # 部署清单
└── README.md            # 项目说明（本文件）
```

## 🎮 使用方法

1. **提出问题**：在输入框中输入你的困惑
2. **开始占卜**：点击占卜按钮，等待洗牌动画
3. **抽取塔罗牌**：点击牌堆抽取3张牌（过去、现在、未来）
4. **AI 解读**：点击"召唤 DeepSeek 解读"获取专业分析

## ⚙️ 配置说明

### 环境变量
```bash
NODE_ENV=production           # 环境模式
DEEPSEEK_API_KEY=your-key    # DeepSeek API 密钥
PORT=3000                   # 应用端口
HOSTNAME=0.0.0.0           # 监听地址
```

### 端口修改
```bash
# Windows
set PORT=8080 && npm start

# Linux/Mac  
PORT=8080 npm start
```

## 🔧 维护和监控

### PM2 常用命令
```bash
pm2 status                    # 查看应用状态
pm2 logs tarot-app            # 查看日志
pm2 restart tarot-app          # 重启应用
pm2 monit                     # 监控面板
```

### 应用更新
```bash
cd /var/www/tarot-app
git pull origin main
npm install
npm run build
pm2 restart tarot-app
```

## 🚨 常见问题

### 1. API 无响应
- 检查 DEEPSEEK_API_KEY 是否正确
- 确认 API 密钥额度充足
- 查看服务器日志：`pm2 logs`

### 2. 页面加载慢
- 检查服务器性能（内存、CPU）
- 优化 Nginx 配置
- 启用 gzip 压缩

### 3. 构建失败
- 清除缓存：`rm -rf .next`
- 重新安装依赖：`npm install`
- 检查 Node.js 版本

## 📞 支持

- 📧 **技术支持**：检查项目文档
- 📖 **部署指南**：`SERVER-DEPLOYMENT.md`
- ✅ **部署清单**：`DEPLOYMENT-CHECKLIST.md`

## 📄 许可证

MIT License

---

**🎊 祝你的塔罗牌占卜应用运行顺利！**