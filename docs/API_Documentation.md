# API接口文档

## 基础信息

**Base URL**: `https://api.yourapp.com`  
**API版本**: v1  
**认证方式**: JWT Bearer Token  
**数据格式**: JSON  

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 分页响应
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 认证接口

### 用户注册

**POST** `/api/auth/register`

**请求参数**:
```json
{
  "username": "string", // 用户名，3-20位字符
  "password": "string"  // 密码，最少6位
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

### 用户登录

**POST** `/api/auth/login`

**请求参数**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

### 获取用户信息

**GET** `/api/auth/me`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 资讯接口

### 获取资讯列表

**GET** `/api/news`

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认20，最大100
- `source`: 资讯来源过滤

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "比特币价格突破新高",
      "content": "据最新消息，比特币价格今日突破...",
      "image_url": "https://cdn.example.com/image1.jpg",
      "source": "CoinDesk",
      "published_at": "2024-01-01T10:00:00Z",
      "votes": {
        "bullish": 150,
        "bearish": 30
      },
      "user_vote": "bullish" // 当前用户的投票，未登录时为null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 获取资讯详情

**GET** `/api/news/{id}`

**路径参数**:
- `id`: 资讯ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "比特币价格突破新高",
    "content": "据最新消息，比特币价格今日突破...",
    "image_url": "https://cdn.example.com/image1.jpg",
    "source": "CoinDesk",
    "published_at": "2024-01-01T10:00:00Z",
    "votes": {
      "bullish": 150,
      "bearish": 30
    },
    "user_vote": "bullish"
  }
}
```

### 资讯投票

**POST** `/api/news/{id}/vote`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 资讯ID

**请求参数**:
```json
{
  "vote_type": "bullish" // "bullish" 或 "bearish"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "vote_type": "bullish",
    "votes": {
      "bullish": 151,
      "bearish": 30
    }
  },
  "message": "投票成功"
}
```

### Webhook接收资讯

**POST** `/api/webhook/news`

**请求头**:
```
X-Webhook-Signature: sha256=<signature>
Content-Type: application/json
```

**请求参数**:
```json
{
  "title": "string",
  "content": "string",
  "image_url": "string", // 可选
  "source": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "新资讯标题",
    "published_at": "2024-01-01T12:00:00Z"
  },
  "message": "资讯接收成功"
}
```

## 知识库接口

### 获取知识列表

**GET** `/api/knowledge`

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `content_type`: 内容类型过滤 (text/image/audio/video)
- `search`: 搜索关键词

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "区块链基础知识",
      "content": "区块链是一种分布式账本技术...",
      "content_type": "text",
      "media_url": null,
      "author": {
        "id": 1,
        "username": "admin"
      },
      "published_at": "2024-01-01T10:00:00Z",
      "votes": {
        "useful": 200,
        "useless": 5
      },
      "user_vote": "useful"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 获取知识详情

**GET** `/api/knowledge/{id}`

**路径参数**:
- `id`: 知识ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "区块链基础知识",
    "content": "区块链是一种分布式账本技术...",
    "content_type": "video",
    "media_url": "https://cdn.example.com/video1.mp4",
    "author": {
      "id": 1,
      "username": "admin"
    },
    "published_at": "2024-01-01T10:00:00Z",
    "votes": {
      "useful": 200,
      "useless": 5
    },
    "user_vote": "useful"
  }
}
```

### 知识投票

**POST** `/api/knowledge/{id}/vote`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 知识ID

**请求参数**:
```json
{
  "vote_type": "useful" // "useful" 或 "useless"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "vote_type": "useful",
    "votes": {
      "useful": 201,
      "useless": 5
    }
  },
  "message": "投票成功"
}
```

## 交易所接口

### 获取交易所列表

**GET** `/api/exchanges`

**查询参数**:
- `search`: 搜索关键词
- `page`: 页码，默认1
- `limit`: 每页数量，默认50

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Binance",
      "description": "全球领先的数字货币交易平台",
      "logo_url": "https://cdn.example.com/binance-logo.png",
      "website_url": "https://www.binance.com",
      "sort_order": 1
    },
    {
      "id": 2,
      "name": "Coinbase",
      "description": "美国最大的数字货币交易所",
      "logo_url": "https://cdn.example.com/coinbase-logo.png",
      "website_url": "https://www.coinbase.com",
      "sort_order": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 25,
    "totalPages": 1
  }
}
```

### 获取交易所详情

**GET** `/api/exchanges/{id}`

**路径参数**:
- `id`: 交易所ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Binance",
    "description": "全球领先的数字货币交易平台，支持多种数字货币交易...",
    "logo_url": "https://cdn.example.com/binance-logo.png",
    "website_url": "https://www.binance.com",
    "sort_order": 1
  }
}
```

## 管理后台接口

### 知识内容管理

#### 创建知识内容

**POST** `/api/admin/knowledge`

**请求头**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**请求参数**:
```json
{
  "title": "string",
  "content": "string",
  "content_type": "text", // text/image/audio/video
  "media_url": "string" // 可选，媒体文件URL
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "新知识内容",
    "content_type": "text",
    "published_at": "2024-01-01T12:00:00Z"
  },
  "message": "知识内容创建成功"
}
```

#### 更新知识内容

**PUT** `/api/admin/knowledge/{id}`

**请求头**:
```
Authorization: Bearer <admin_token>
```

**路径参数**:
- `id`: 知识ID

**请求参数**:
```json
{
  "title": "string",
  "content": "string",
  "content_type": "text",
  "media_url": "string"
}
```

#### 删除知识内容

**DELETE** `/api/admin/knowledge/{id}`

**请求头**:
```
Authorization: Bearer <admin_token>
```

**路径参数**:
- `id`: 知识ID

### 文件上传

**POST** `/api/admin/upload`

**请求头**:
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**请求参数**:
- `file`: 文件 (支持图片、音频、视频)
- `type`: 文件类型 (image/audio/video)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/uploads/file123.jpg",
    "filename": "file123.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  },
  "message": "文件上传成功"
}
```

## 错误码说明

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| AUTH_REQUIRED | 401 | 需要登录认证 |
| INVALID_TOKEN | 401 | Token无效或过期 |
| PERMISSION_DENIED | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| DUPLICATE_USERNAME | 400 | 用户名已存在 |
| INVALID_CREDENTIALS | 401 | 用户名或密码错误 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |
| SERVER_ERROR | 500 | 服务器内部错误 |
| WEBHOOK_SIGNATURE_INVALID | 401 | Webhook签名验证失败 |

## 请求限制

- **通用API**: 每IP每分钟100次请求
- **投票API**: 每IP每分钟10次请求
- **认证API**: 每IP每分钟5次请求
- **文件上传**: 每个文件最大50MB
- **Webhook**: 无限制(需要签名验证)

## 数据格式说明

### 时间格式
所有时间字段使用ISO 8601格式: `2024-01-01T12:00:00Z`

### 文件URL格式
所有文件URL使用HTTPS协议，支持CDN加速

### 分页参数
- `page`: 页码，从1开始
- `limit`: 每页数量，默认20，最大100

## SDK和示例代码

### JavaScript示例
```javascript
// 获取资讯列表
const getNews = async (page = 1, limit = 20) => {
  const response = await fetch(`/api/news?page=${page}&limit=${limit}`)
  const data = await response.json()
  return data
}

// 用户登录
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  const data = await response.json()
  
  if (data.success) {
    localStorage.setItem('token', data.data.token)
  }
  
  return data
}

// 投票
const vote = async (type, id, voteType) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`/api/${type}/${id}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ vote_type: voteType })
  })
  return await response.json()
}
```

### cURL示例
```bash
# 获取资讯列表
curl -X GET "https://api.yourapp.com/api/news?page=1&limit=20"

# 用户登录
curl -X POST "https://api.yourapp.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'

# 资讯投票
curl -X POST "https://api.yourapp.com/api/news/1/vote" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"vote_type":"bullish"}'
```