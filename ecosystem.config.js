module.exports = {
  apps: [{
    name: 'tarot-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/tarot-app',
    instances: 'max',  // 根据CPU核心数自动设置实例数
    exec_mode: 'cluster',  // 集群模式
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: '/var/log/pm2/tarot-app-error.log',
    out_file: '/var/log/pm2/tarot-app-out.log',
    log_file: '/var/log/pm2/tarot-app-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024',
    
    // 监控和重启配置
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    
    // 优雅关闭
    kill_timeout: 5000
  }]
};