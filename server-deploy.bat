@echo off
echo Tarot App Server Deployment Script
echo ===================================

if "%1"=="" (
    echo Usage:
    echo   server-deploy.bat test     - Test deployment locally
    echo   server-deploy.bat prod     - Production deployment guide
    echo   server-deploy.bat docker   - Docker deployment
    goto :end
)

set MODE=%1

if "%MODE%"=="test" (
    echo.
    echo 🔧 Testing local deployment...
    call start.bat
    goto :end
)

if "%MODE%"=="prod" (
    echo.
    echo 🌐 Production Deployment Guide
    echo ================================
    echo.
    echo 1. Server Requirements:
    echo    - Ubuntu 20.04+ or CentOS 8+
    echo    - 2GB+ RAM, 1+ CPU core
    echo    - Node.js 20.x installed
    echo.
    echo 2. Setup Commands:
    echo    curl -fsSL https://deb.nodesource.com/setup_20.x ^| sudo -E bash -
    echo    sudo apt-get install -y nodejs
    echo    sudo npm install -g pm2
    echo    sudo apt install nginx -y
    echo.
    echo 3. Deploy Commands:
    echo    git clone [your-repo] /var/www/tarot-app
    echo    cd /var/www/tarot-app
    echo    npm install --production
    echo    npm run build
    echo    pm2 start npm --name "tarot-app" -- start
    echo.
    echo 4. Nginx Config:
    echo    Copy nginx.conf to /etc/nginx/sites-available/tarot-app
    echo    sudo ln -s /etc/nginx/sites-available/tarot-app /etc/nginx/sites-enabled/
    echo    sudo nginx -t && sudo systemctl restart nginx
    echo.
    echo 5. Firewall:
    echo    sudo ufw allow 22,80,443/tcp
    echo    sudo ufw enable
    echo.
    echo See SERVER-DEPLOYMENT.md for detailed instructions.
    goto :end
)

if "%MODE%"=="docker" (
    echo.
    echo 🐳 Docker Deployment
    echo =====================
    echo.
    echo 1. Build Docker Image:
    echo    docker build -t tarot-app .
    echo.
    echo 2. Run Container:
    echo    docker run -d -p 3000:3000 --name tarot-app --env-file .env tarot-app
    echo.
    echo 3. With Docker Compose:
    echo    docker-compose up -d
    echo.
    goto :end
)

echo ❌ Unknown mode: %MODE%

:end
pause