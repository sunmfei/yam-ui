# Frontend Deploy Scripts

前端部署脚本位于当前项目目录下，支持：

- 本地 Docker 部署
- 远程 Docker 部署
- Linux/macOS 与 Windows
- 自动生成镜像版本号

脚本列表：

- `deploy/local-deploy.sh`
- `deploy/local-deploy.ps1`
- `deploy/remote-deploy.sh`
- `deploy/remote-deploy.ps1`

默认版本格式：

- `yyyyMMdd-HHmmss-<git短哈希>`

本地部署：

```bash
bash deploy/local-deploy.sh
```

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\local-deploy.ps1
```

远程部署：

```bash
bash deploy/remote-deploy.sh 192.168.31.11 MFei
```

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\remote-deploy.ps1 -HostName 192.168.31.11 -UserName MFei
```

远程脚本行为：

- 读取本地前端项目内容
- 打包上传到远程目录
- 在远程执行 `docker compose build`
- 在远程执行 `docker compose up -d --force-recreate`

Compose 文件约定：

- `docker-compose.yml`：给 IDEA / 本地直接 Compose 面板使用，固定 `local-dev` tag
- `docker-compose.deploy.yml`：给部署脚本使用，支持动态 `VERSION`
