# Yam UI - 快速开始

## 🚀 5分钟上手

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 3. 构建生产版本

```bash
pnpm build
```

输出在 `dist/` 目录

### 4. 预览生产构建

```bash
pnpm preview
```

访问 http://localhost:4173

## 📋 常用命令

| 命令                 | 说明                |
| -------------------- | ------------------- |
| `pnpm dev`           | 启动开发服务器      |
| `pnpm build`         | 生产构建            |
| `pnpm build:analyze` | 构建并分析包大小    |
| `pnpm preview`       | 预览生产构建        |
| `pnpm type-check`    | TypeScript 类型检查 |

## 📁 项目结构

```
yam-ui/
├── src/
│   ├── components/    # 组件
│   ├── assets/        # 静态资源
│   ├── App.vue       # 根组件
│   └── main.ts       # 入口文件
├── public/            # 公共静态文件
├── .env.development   # 开发环境配置
├── .env.production    # 生产环境配置
└── vite.config.ts     # Vite 配置
```

## 🔧 环境变量

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
```

## 💡 提示

- 使用 `@/` 别名引用 src 目录
- 所有组件使用 `<script setup lang="ts">`
- 严格的 TypeScript 检查已启用

## 📖 详细文档

查看 [README.md](./README.md) 和 [PRODUCTION_CONFIG.md](./PRODUCTION_CONFIG.md) 了解更多信息。
