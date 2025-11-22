# 塔罗牌占卜应用 - 服务器部署指南

## 🌐 部署方案选择

### 方案1：云服务器部署（推荐）
### 方案2：免费平台部署
### 方案3：VPS自建

---

## 🚀 方案1：云服务器部署

### 1.1 准备工作
- **服务器配置**：2核4G内存，Ubuntu 20.04或CentOS 8
- **推荐云服务商**：
  - 阿里云ECS
  - 腾讯云CVM
  - 华为云ECS
- **域名**（可选）：用于HTTPS配置

### 1.2 服务器环境配置
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version

# 安装PM2（进程管理）
sudo npm install -g pm2

# 安装Nginx（反向代理）
sudo apt install nginx -y
```

### 1.3 部署应用
```bash
# 创建项目目录
sudo mkdir -p /var/www/tarot-app
cd /var/www/tarot-app

# 上传项目文件（使用SCP或Git）
git clone <your-repo-url> .

# 安装依赖
npm install --production

# 配置环境变量
cp .env.example .env
nano .env  # 编辑环境变量，设置DEEPSEEK_API_KEY

# 构建项目
npm run build

# 使用PM2启动
pm2 start npm --name "tarot-app" -- start
pm2 save
pm2 startup
```

### 1.4 配置Nginx反向代理
```bash
# 创建Nginx配置文件
sudo nano /etc/nginx/sites-available/tarot-app
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/tarot-app /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

---

## 🆓 方案2：免费平台部署

### 2.1 Vercel部署（推荐）
```bash
# 安装Vercel CLI
npm install -g vercel

# 在项目根目录执行
vercel

# 按提示配置：
# - Framework: Next.js
# - Build Settings: npm run build
# - Output Directory: .next
# - Install Command: npm install
```

### 2.2 Netlify部署
```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 构建项目
npm run build

# 部署
netlify deploy --prod --dir=.next
```

### 2.3 Railway部署
1. 访问 [railway.app](https://railway.app)
2. 连接GitHub仓库
3. 自动部署配置：
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variable: `DEEPSEEK_API_KEY`

---

## 🛠️ 方案3：VPS自建部署

### 3.1 服务器准备
```bash
# 安装Docker（如果使用Docker部署）
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3.2 使用Docker部署
```bash
# 上传项目文件
git clone <your-repo-url> /opt/tarot-app
cd /opt/tarot-app

# 构建并启动
docker-compose up -d

# 配置开机自启
sudo systemctl enable docker
```

---

## 🔧 生产环境配置

### 环境变量配置
```bash
# 生产环境.env文件示例
NODE_ENV=production
DEEPSEEK_API_KEY=your-actual-api-key
PORT=3000
```

### 防火墙设置
```bash
# Ubuntu/Debian
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### SSL证书配置（Let's Encrypt）
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 监控和维护

### PM2监控
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs tarot-app

# 重启应用
pm2 restart tarot-app

# 监控面板
pm2 monit
```

### 日志管理
```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/tarot-app

/var/www/tarot-app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 🚨 常见问题解决

### 端口占用
```bash
# 查看端口占用
sudo netstat -tlnp | grep :3000

# 杀死进程
sudo kill -9 <PID>
```

### 内存不足
```bash
# 查看内存使用
free -h

# 创建交换文件
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 权限问题
```bash
# 修改文件权限
sudo chown -R www-data:www-data /var/www/tarot-app
sudo chmod -R 755 /var/www/tarot-app
```

---

## 📋 部署清单

- [ ] 服务器购买和初始化
- [ ] Node.js环境安装
- [ ] PM2进程管理器安装
- [ ] Nginx反向代理配置
- [ ] 域名解析配置
- [ ] SSL证书安装
- [ ] 防火墙端口开放
- [ ] 环境变量配置
- [ ] 应用部署和测试
- [ ] 监控和日志配置

---

## 🎯 快速启动命令

### 一键部署脚本
```bash
# 保存为 deploy.sh
#!/bin/bash
cd /var/www/tarot-app
git pull origin main
npm install
npm run build
pm2 restart tarot-app
echo "Deployment completed!"
```

### 更新应用
```bash
./deploy.sh  # 一键更新
```