# 🚀 塔罗牌应用服务器部署清单

## 📋 部署前检查

### 服务器环境
- [ ] 服务器规格：2核4G内存以上
- [ ] 操作系统：Ubuntu 20.04+ 或 CentOS 8+
- [ ] 已购买域名（可选，但推荐）
- [ ] 服务器SSH连接正常

### 软件依赖
- [ ] Node.js 20.x 已安装
- [ ] npm 版本匹配
- [ ] PM2 进程管理器已安装
- [ ] Nginx 反向代理已安装
- [ ] 防火墙端口已开放（80, 443, 22）

---

## 🔧 本地准备

### 项目文件
- [ ] 代码已提交到Git仓库
- [ ] `.env.example` 文件存在
- [ ] `package.json` 构建脚本正确
- [ ] 本地构建测试通过：`npm run build`

### 环境变量
- [ ] `DEEPSEEK_API_KEY` 已获取
- [ ] 生产环境变量已配置
- [ ] 敏感信息已从代码中移除

---

## 🌐 服务器部署步骤

### 1. 基础环境搭建
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2
sudo npm install -g pm2

# 安装Nginx
sudo apt install nginx -y
```
- [ ] 系统更新完成
- [ ] Node.js 安装成功
- [ ] PM2 安装成功
- [ ] Nginx 安装成功

### 2. 项目部署
```bash
# 创建项目目录
sudo mkdir -p /var/www/tarot-app
cd /var/www/tarot-app

# 克隆项目
git clone <your-repo-url> .

# 安装依赖
npm install --production

# 配置环境变量
cp .env.example .env
nano .env
```
- [ ] 项目目录创建成功
- [ ] 代码克隆完成
- [ ] 依赖安装成功
- [ ] 环境变量配置完成

### 3. 构建和启动
```bash
# 构建项目
npm run build

# PM2启动
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
- [ ] 项目构建成功
- [ ] PM2 启动成功
- [ ] 开机自启配置完成

### 4. Nginx配置
```bash
# 配置反向代理
sudo cp nginx.conf /etc/nginx/sites-available/tarot-app
sudo ln -s /etc/nginx/sites-available/tarot-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
- [ ] Nginx 配置文件复制成功
- [ ] 配置语法检查通过
- [ ] Nginx 重启成功

---

## 🔒 安全配置

### 防火墙设置
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```
- [ ] SSH 端口开放
- [ ] HTTP 端口开放
- [ ] HTTPS 端口开放
- [ ] 防火墙启用

### SSL证书（可选但推荐）
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```
- [ ] Certbot 安装成功
- [ ] SSL证书获取成功
- [ ] 自动续期配置完成

---

## 🧪 测试验证

### 功能测试
- [ ] 网站可以正常访问：`http://your-domain.com`
- [ ] 页面加载正常，无404错误
- [ ] API接口响应正常：`/api/tarot`
- [ ] 塔罗牌功能完整可用
- [ ] 移动端适配正常

### 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] API响应时间 < 2秒
- [ ] 内存使用率 < 80%
- [ ] CPU使用率 < 70%

### 监控配置
```bash
# PM2监控
pm2 monit

# 查看日志
pm2 logs tarot-app

# 设置告警（可选）
# 安装监控工具如 UptimeRobot
```
- [ ] PM2 监控正常
- [ ] 日志记录正常
- [ ] 外部监控配置完成

---

## 🔄 维护更新

### 更新流程
```bash
#!/bin/bash
cd /var/www/tarot-app
git pull origin main
npm install
npm run build
pm2 restart tarot-app
```
- [ ] 更新脚本创建完成
- [ ] 测试更新流程正常

### 备份策略
- [ ] 代码备份策略制定
- [ ] 数据库备份策略（如有）
- [ ] 配置文件备份策略

---

## ✅ 部署完成确认

- [ ] 所有部署步骤完成
- [ ] 功能测试通过
- [ ] 性能测试通过
- [ ] 安全配置完成
- [ ] 监控配置完成
- [ ] 文档更新完成
- [ ] 备份策略制定

---

## 🆘 常见问题排查

### 问题1：网站无法访问
```bash
# 检查服务状态
pm2 status
sudo systemctl status nginx

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

### 问题2：API返回500错误
```bash
# 查看应用日志
pm2 logs tarot-app

# 检查环境变量
cat /var/www/tarot-app/.env
```

### 问题3：内存不足
```bash
# 查看内存使用
free -h
top

# 创建交换文件
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📞 支持联系方式

- 📧 技术支持：[your-email]
- 📚 文档：查看项目README.md
- 🔗 官方文档：Next.js, PM2, Nginx

---

**部署完成后，请确保所有项目都已勾选 ✅**