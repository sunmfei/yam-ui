# Docker 使用指南

## 📋 前置要求

- Docker Desktop 已安装并运行
- Docker Compose V2 支持

## 🚀 快速开始

### 1. 环境配置

复制环境变量示例文件：
```bash
cp .env.docker.example .env
```

根据需要修改 `.env` 文件中的配置。

### 2. 开发环境

启动开发环境：
```bash
docker compose up yam-ui-dev
```

或者后台运行：
```bash
docker compose up -d yam-ui-dev
```

访问应用：
```
http://localhost:5173
```

查看日志：
```bash
docker compose logs -f yam-ui-dev
```

停止开发环境：
```bash
docker compose down yam-ui-dev
```

### 3. 生产环境

构建生产镜像：
```bash
docker compose build yam-ui-prod
```

启动生产环境：
```bash
docker compose --profile prod up yam-ui-prod
```

或者后台运行：
```bash
docker compose --profile prod up -d yam-ui-prod
```

访问应用：
```
http://localhost:80
```

停止生产环境：
```bash
docker compose --profile prod down yam-ui-prod
```

## 🔧 常用命令

### 构建镜像

只构建不运行：
```bash
# 开发环境
docker compose build yam-ui-dev

# 生产环境
docker compose build yam-ui-prod
```

### 查看容器状态

```bash
docker compose ps
```

### 进入容器

```bash
# 开发环境
docker compose exec yam-ui-dev sh

# 生产环境
docker compose exec yam-ui-prod sh
```

### 清理资源

停止并删除所有容器、网络：
```bash
docker compose down
```

清理未使用的镜像：
```bash
docker image prune -a
```

## 📝 配置文件说明

### Dockerfile
- 多阶段构建，减小最终镜像体积
- 第一阶段：使用 Node.js 20 Alpine 构建应用
- 第二阶段：使用 Nginx Alpine 提供静态文件服务

### Dockerfile.dev
- 开发环境专用
- 挂载源代码实现热更新
- 暴露 5173 端口

### docker-compose.yml
- 定义开发和生产两个服务
- 配置环境变量和网络
- 生产环境使用 profile 隔离

### nginx.conf
- SPA 路由支持
- Gzip 压缩
- 静态资源缓存策略
- 安全头配置

### .dockerignore
- 排除不必要的文件
- 优化构建速度
- 减小镜像体积

## 🔍 故障排查

### 端口被占用

修改 `.env` 文件中的端口配置：
```env
VITE_SERVER_PORT=3000
PROD_PORT=8080
```

### 构建失败

清理缓存后重新构建：
```bash
docker compose build --no-cache yam-ui-prod
```

### 无法访问宿主机服务

在 macOS/Windows 上使用 `host.docker.internal` 代替 `localhost`：
```env
VITE_API_PROXY_TARGET=http://host.docker.internal:48080
```

### 权限问题

确保 Docker Desktop 有足够的资源分配：
- CPU: 至少 2 核
- 内存: 至少 4GB
- Swap: 至少 1GB

## 📊 镜像优化建议

1. **定期清理**：清理未使用的镜像和容器
2. **使用 .dockerignore**：减少构建上下文
3. **多阶段构建**：减小最终镜像体积
4. **Alpine 基础镜像**：更小的镜像体积

## 🔐 生产部署注意事项

1. 使用 HTTPS（需要配置 SSL 证书）
2. 配置域名和 DNS
3. 设置防火墙规则
4. 启用日志收集
5. 配置健康检查
6. 使用 secrets 管理敏感信息

## 📞 技术支持

如有问题，请检查：
1. Docker 版本是否最新
2. 网络连接是否正常
3. 环境变量配置是否正确
4. 端口是否被占用
