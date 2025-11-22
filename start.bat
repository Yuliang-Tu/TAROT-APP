@echo off
chcp 65001 >nul
echo Tarot App Starting...
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js not found. Please install Node.js first
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

:: Check dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Dependencies installation failed
        pause
        exit /b 1
    )
)

:: Check env file
if not exist ".env" (
    echo Warning: .env file not found
    echo Please ensure DEEPSEEK_API_KEY is configured
    echo.
)

:: Build application
echo Building application...
npm run build
if %errorlevel% neq 0 (
    echo Build failed
    pause
    exit /b 1
)

echo Starting production server...
echo Access: http://localhost:3000
echo Press Ctrl+C to stop server
echo.

npm start

pause