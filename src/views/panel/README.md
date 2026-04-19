# Panel 模块

动态面板组件系统，支持配置驱动的页面结构。

## 目录结构

```
src/views/panel/
├── index.ts                    # 模块统一导出
├── router/
│   └── index.ts               # 路由汇总
└── {module}/                   # 面板模块（如 settings）
    ├── components/            # 面板组件
    │   ├── XxxPanel.vue
    │   └── YyyPanel.vue
    └── router/
        └── index.ts           # 模块路由配置
```

## 核心特性

### 1. 配置驱动
通过 `PanelSection` 配置自动生成侧边栏菜单和页面内容：

```typescript
const sections: PanelSection[] = [
  {
    id: 'appearance',
    label: '外观设置',
    icon: 'Palette',
    componentPath: 'settings/components/AppearancePanel',
    order: 1,
  },
]
```

### 2. 动态组件加载
使用 `componentPath` 自动从 `/src/views/panel/` 目录加载组件，无需手动 import。

### 3. 灵活的侧边栏配置
- 方向：`side: 'left' | 'right'`
- 宽度：`sidebarWidth: '240px'`
- 背景：`sidebarBgClass`, `contentBgClass`
- 折叠：`collapsible: boolean`

## 创建新面板模块

### 1. 创建模块目录

```bash
mkdir -p src/views/panel/{module}/components
mkdir -p src/views/panel/{module}/router
```

### 2. 创建面板组件

```vue
<!-- src/views/panel/{module}/components/XxxPanel.vue -->
<script setup lang="ts">
// 你的面板逻辑
</script>

<template>
  <div>面板内容</div>
</template>
```

### 3. 配置路由

```typescript
// src/views/panel/{module}/router/index.ts
import type { FrontendRoute } from '@/types'

export const {module}Routes: FrontendRoute[] = [
  {
    name: '{Module}',
    path: '/{module}',
    component: () => import('@/views/panel/{module}/{Module}View.vue'),
    meta: {
      title: '模块标题',
      icon: 'IconName',
    },
  },
]
```

### 4. 注册到主路由

在 `src/views/panel/router/index.ts` 中添加：

```typescript
import { {module}Routes } from './{module}/router'

export const panelRoutes: FrontendRoute[] = [
  ...settingsRoutes,
  ...{module}Routes,  // 新增
]
```

## 使用 BasePanel

```vue
<script setup lang="ts">
import { BasePanel } from '@/views/panel'
import type { PanelSection } from '@/types'

const sections: PanelSection[] = [
  {
    id: 'item1',
    label: '项目1',
    icon: 'Home',
    componentPath: 'module/components/Item1Panel',
  },
]

const activeSection = ref('item1')
</script>

<template>
  <BasePanel
    :sections="sections"
    :active="activeSection"
    side="left"
    sidebar-width="260px"
    @update:active="activeSection = $event"
  >
    <template #header>
      自定义头部
    </template>
  </BasePanel>
</template>
```

## PanelSection 配置项

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| label | string | 显示文本 |
| icon | string | 图标名称（lucide-vue-next） |
| componentPath | string | 组件路径（相对于 /src/views/panel/） |
| getter | string | 动态获取 label 的 action key |
| actionKey | string | 动作执行 key |
| onItemClickKey | string | 点击事件处理 key |
| disabled | boolean | 是否禁用 |
| hidden | boolean | 是否隐藏 |
| order | number | 排序权重 |
| children | PanelSection[] | 子菜单 |
| meta | Record<string, any> | 扩展元数据 |

## 注意事项

1. **组件路径**：`componentPath` 不需要 `.vue` 后缀
2. **图标名称**：使用 lucide-vue-next 的图标名称字符串
3. **文件命名**：组件文件使用 PascalCase（如 `AppearancePanel.vue`）
4. **路由注册**：新模块必须在 `panel/router/index.ts` 中注册
