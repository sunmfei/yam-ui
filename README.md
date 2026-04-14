# Yam UI

一个基于 Vue 3 + TypeScript + Vite + TailwindCSS v4 的现代化 UI 项目，已配置为生产级标准。

## ✨ 特性

- 🚀 **Vite 8** - 极速的开发服务器和构建工具
- 🎨 **TailwindCSS v4** - 实用优先的 CSS 框架
- 📦 **TypeScript** - 严格的类型检查
- 🎭 **Motion-V** - 流畅的动画效果
- 🔧 **VueUse** - 实用的 Composition API 工具集
- 🗜️ **Gzip & Brotli 压缩** - 自动资源压缩
- 📊 **包分析工具** - 可视化打包结果
- 🌍 **环境变量管理** - 多环境配置支持

## 📦 安装

```bash
pnpm install
```

## 🔧 开发

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check
```

## 🏗️ 构建

```bash
# 生产环境构建
pnpm build

# 构建并分析包大小
pnpm build:analyze

# 预览生产构建
pnpm preview
```

## 📁 项目结构

```
yam-ui/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 图片、字体等资源
│   ├── components/     # 组件
│   │   └── ui/        # UI 组件
│   ├── App.vue        # 根组件
│   ├── main.ts        # 入口文件
│   ├── main.css       # 全局样式
│   └── vite-env.d.ts  # 类型声明
├── .env.development   # 开发环境变量
├── .env.production    # 生产环境变量
├── .editorconfig      # 编辑器配置
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目依赖
```

## ⚙️ 配置说明

### 环境变量

项目支持多环境配置：

- `.env.development` - 开发环境
- `.env.production` - 生产环境

使用方式：

```typescript
// 访问环境变量
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
```

### Vite 优化

#### 代码分割

自动将第三方库分割为独立的 chunk：

- `vue-vendor` - Vue 核心库
- `vueuse` - VueUse 工具库
- `motion` - 动画库
- `ui-vendor` - UI 相关库
- `vendor` - 其他第三方库

#### 资源分类

构建后的资源按类型分类存储：

- `assets/js/` - JavaScript 文件
- `assets/css/` - CSS 文件
- `assets/images/` - 图片资源
- `assets/fonts/` - 字体文件

#### 压缩优化

- ✅ Terser 压缩（移除 console、debugger）
- ✅ Gzip 压缩（>10kb 文件）
- ✅ Brotli 压缩（更好的压缩率）

### TypeScript 严格模式

启用了以下严格检查：

- `strict` - 所有严格检查
- `noImplicitAny` - 禁止隐式 any
- `strictNullChecks` - 严格 null 检查
- `noUnusedLocals` - 未使用的局部变量检查
- `noUnusedParameters` - 未使用的参数检查
- `noImplicitReturns` - 确保所有代码路径都有返回值

## 🎯 最佳实践

### 1. 组件开发

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 明确的类型定义
const count = ref<number>(0)

// 函数类型定义
function increment(): void {
  count.value++
}
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

### 2. 路径别名

使用 `@` 别名引用 src 目录：

```typescript
import Component from '@/components/Component.vue'
import { useUtils } from '@/utils'
```

### 3. 环境变量

在代码中使用环境变量：

```typescript
// 创建 API 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
```

## 📊 性能分析

运行以下命令查看包大小分析：

```bash
pnpm build:analyze
```

这将在浏览器中打开一个可视化的包分析报告，帮助你优化打包体积。

## 🔍 代码质量

### 类型检查

```bash
pnpm type-check
```

### 代码规范

项目使用 EditorConfig 保持代码风格一致。建议安装对应的编辑器插件。

## 🚀 部署

### 构建产物

运行 `pnpm build` 后，生成的文件在 `dist/` 目录：

```
dist/
├── assets/
│   ├── js/       # JavaScript 文件（带 hash）
│   ├── css/      # CSS 文件（带 hash）
│   ├── images/   # 图片资源（带 hash）
│   └── fonts/    # 字体文件（带 hash）
├── index.html
└── *.gz, *.br   # 压缩文件
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/yam-ui/dist;
    index index.html;

    # 启用 Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📝 许可证

MIT
