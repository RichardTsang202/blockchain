# 部署清单

## 部署前准备

### 环境要求
- [ ] Node.js 16+ 或 Python 3.8+
- [ ] PostgreSQL 12+
- [ ] Redis 6+
- [ ] Docker (推荐)
- [ ] SSL证书

### 域名和DNS配置
- [ ] 主域名解析 (yourapp.com)
- [ ] API子域名解析 (api.yourapp.com)
- [ ] CDN域名解析 (cdn.yourapp.com)
- [ ] SSL证书配置

## 后端部署

### 数据库部署

#### PostgreSQL配置
```bash
# 1. 创建数据库
psql -U postgres
CREATE DATABASE blockchain_news;
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE blockchain_news TO app_user;
```

#### 数据库迁移
- [ ] 运行数据库迁移脚本
- [ ] 创建初始管理员账户
- [ ] 导入交易所基础数据
- [ ] 设置数据库索引
- [ ] 配置数据库备份策略

#### Redis配置
- [ ] 安装Redis服务
- [ ] 配置Redis密码
- [ ] 设置内存限制
- [ ] 配置持久化策略

### 应用服务器部署

#### 环境变量配置
```bash
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://app_user:secure_password@localhost:5432/blockchain_news
REDIS_URL=redis://:password@localhost:6379
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
WEBHOOK_SECRET=your-webhook-secret-key
CLOUD_STORAGE_ACCESS_KEY=your-cloud-storage-key
CLOUD_STORAGE_SECRET_KEY=your-cloud-storage-secret
CLOUD_STORAGE_BUCKET=your-bucket-name
FRONTEND_URL=https://yourapp.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_admin_password
```

#### Docker部署 (推荐)
```bash
# 1. 构建镜像
docker build -t blockchain-news-api .

# 2. 运行容器
docker run -d \
  --name blockchain-news-api \
  --env-file .env.production \
  -p 3000:3000 \
  blockchain-news-api
```

#### 传统部署
```bash
# 1. 安装依赖
npm ci --production

# 2. 构建应用
npm run build

# 3. 启动应用
npm start

# 4. 使用PM2管理进程 (推荐)
npm install -g pm2
pm2 start ecosystem.config.js
```

### 反向代理配置 (Nginx)

```nginx
# /etc/nginx/sites-available/blockchain-news-api
server {
    listen 80;
    server_name api.yourapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourapp.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 请求大小限制
    client_max_body_size 50M;

    # API代理
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

    # 健康检查
    location /health {
        access_log off;
        proxy_pass http://localhost:3000/health;
    }
}
```

### 部署验证
- [ ] API健康检查通过 (`GET /health`)
- [ ] 数据库连接正常
- [ ] Redis连接正常
- [ ] 文件上传功能正常
- [ ] Webhook接收功能正常
- [ ] 管理后台可访问

## 前端部署

### 构建配置

#### 环境变量
```bash
# .env.production
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_CDN_URL=https://cdn.yourapp.com
REACT_APP_WECHAT_APPID=your_wechat_appid
REACT_APP_SENTRY_DSN=your_sentry_dsn
GENERATE_SOURCEMAP=false
```

#### 构建优化
```bash
# 1. 安装依赖
npm ci

# 2. 构建生产版本
npm run build

# 3. 分析包大小 (可选)
npm run analyze
```

### 静态文件部署

#### Netlify部署
```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_API_URL = "https://api.yourapp.com"
```

#### Vercel部署
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 传统服务器部署 (Nginx)
```nginx
# /etc/nginx/sites-available/blockchain-news-frontend
server {
    listen 80;
    server_name yourapp.com www.yourapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourapp.com www.yourapp.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    root /var/www/blockchain-news/build;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PWA支持
    location /manifest.json {
        expires 1d;
        add_header Cache-Control "public";
    }

    location /service-worker.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 部署验证
- [ ] 网站可正常访问
- [ ] PWA功能正常 (可安装、离线缓存)
- [ ] 移动端适配正常
- [ ] API调用正常
- [ ] 分享功能正常
- [ ] 性能指标达标 (Lighthouse > 90)

## 云服务部署

### Heroku部署

#### 后端部署
```bash
# 1. 安装Heroku CLI
# 2. 登录Heroku
heroku login

# 3. 创建应用
heroku create blockchain-news-api

# 4. 添加数据库
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# 5. 设置环境变量
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
# ... 其他环境变量

# 6. 部署
git push heroku main

# 7. 运行数据库迁移
heroku run npm run migrate
```

#### 前端部署
```bash
# 使用Heroku Buildpack
heroku create blockchain-news-frontend
heroku buildpacks:set mars/create-react-app
heroku config:set REACT_APP_API_URL=https://blockchain-news-api.herokuapp.com
git push heroku main
```

### Railway部署

```toml
# railway.toml
[build]
cmd = "npm run build"

[deploy]
cmd = "npm start"

[env]
NODE_ENV = "production"
```

### 阿里云部署

#### ECS服务器配置
- [ ] 购买ECS实例 (2核4G起)
- [ ] 配置安全组 (开放80, 443, 22端口)
- [ ] 安装Docker和Docker Compose
- [ ] 配置域名解析

#### Docker Compose部署
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: blockchain_news
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    command: redis-server --requirepass redis_password
    ports:
      - "6379:6379"

  api:
    build: .
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://app_user:secure_password@postgres:5432/blockchain_news
      REDIS_URL: redis://:redis_password@redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./frontend/build:/usr/share/nginx/html
    depends_on:
      - api

volumes:
  postgres_data:
```

## 监控和日志

### 应用监控
- [ ] 配置Sentry错误监控
- [ ] 设置Uptime监控
- [ ] 配置性能监控 (New Relic/DataDog)
- [ ] 设置告警通知

### 日志管理
```javascript
// 生产环境日志配置
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

### 健康检查
```javascript
// 健康检查端点
app.get('/health', async (req, res) => {
  try {
    // 检查数据库连接
    await db.query('SELECT 1')
    
    // 检查Redis连接
    await redis.ping()
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    })
  }
})
```

## 安全配置

### SSL/TLS配置
- [ ] 申请SSL证书 (Let's Encrypt推荐)
- [ ] 配置HTTPS重定向
- [ ] 启用HSTS
- [ ] 配置安全头

### 防火墙配置
```bash
# UFW防火墙配置
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 备份策略
- [ ] 数据库自动备份 (每日)
- [ ] 文件存储备份
- [ ] 配置文件备份
- [ ] 备份恢复测试

## 性能优化

### 数据库优化
- [ ] 配置连接池
- [ ] 添加必要索引
- [ ] 查询性能优化
- [ ] 定期数据清理

### 缓存策略
- [ ] Redis缓存配置
- [ ] CDN配置
- [ ] 浏览器缓存策略
- [ ] API响应缓存

### 负载均衡 (高并发场景)
- [ ] 配置负载均衡器
- [ ] 多实例部署
- [ ] 数据库读写分离
- [ ] 静态资源CDN

## 部署后验证清单

### 功能验证
- [ ] 用户注册登录正常
- [ ] 资讯列表加载正常
- [ ] 投票功能正常
- [ ] 分享功能正常
- [ ] 管理后台正常
- [ ] Webhook接收正常
- [ ] 文件上传正常

### 性能验证
- [ ] 页面加载时间 < 3秒
- [ ] API响应时间 < 500ms
- [ ] Lighthouse性能评分 > 90
- [ ] 移动端体验良好

### 安全验证
- [ ] HTTPS配置正确
- [ ] 安全头配置完整
- [ ] 敏感信息不泄露
- [ ] API访问控制正常

### 监控验证
- [ ] 错误监控正常
- [ ] 性能监控正常
- [ ] 日志记录正常
- [ ] 告警通知正常

## 上线发布

### 发布流程
1. [ ] 代码审查通过
2. [ ] 测试环境验证通过
3. [ ] 性能测试通过
4. [ ] 安全测试通过
5. [ ] 备份当前生产环境
6. [ ] 部署新版本
7. [ ] 验证部署结果
8. [ ] 监控系统状态
9. [ ] 准备回滚方案

### 回滚准备
- [ ] 数据库回滚脚本
- [ ] 应用版本回滚
- [ ] DNS切换方案
- [ ] 紧急联系方式

## 维护计划

### 定期维护
- [ ] 每周系统更新
- [ ] 每月安全补丁
- [ ] 每季度性能优化
- [ ] 每年架构评估

### 监控指标
- [ ] 系统可用性 > 99.5%
- [ ] 响应时间 < 500ms
- [ ] 错误率 < 1%
- [ ] 用户满意度 > 90%