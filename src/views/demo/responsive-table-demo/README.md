# 响应式表格容器使用指南

## 概述

BaseTable 组件现在支持响应式容器尺寸配置，用户可以通过配置面板动态调整表格容器的宽度和高度。

## 功能特性

### 1. 预设尺寸

- **小 (Small)**: 宽度 70%，高度 80vh
- **中 (Medium)**: 宽度 85%，高度 90vh（默认）
- **大 (Large)**: 宽度 100%，高度 100vh
- **全屏 (Fullscreen)**: 固定定位，覆盖整个视口

### 2. 自定义尺寸

当选择"自定义"模式时，可以输入任意的宽度和高度值：
- 宽度支持：百分比（如 `80%`）、像素（如 `1200px`）、视口单位（如 `90vw`）
- 高度支持：百分比（如 `80%`）、像素（如 `800px`）、视口单位（如 `90vh`）

## 使用方法

### 基础用法

```vue
<template>
  <BaseTable
    title="我的表格"
    :data="tableData"
    :columns="tableColumns"
    :configurable="true"
    container-size="medium"
  />
</template>

<script setup lang="ts">
import BaseTable from '@/components/table/BaseTable.vue'

const tableData = ref([...])
const tableColumns = ref([...])
</script>
```

### 指定初始尺寸

```vue
<BaseTable
  title="小尺寸表格"
  :data="tableData"
  :columns="tableColumns"
  :configurable="true"
  container-size="small"
/>

<BaseTable
  title="大尺寸表格"
  :data="tableData"
  :columns="tableColumns"
  :configurable="true"
  container-size="large"
/>
```

### 自定义尺寸

```vue
<BaseTable
  title="自定义尺寸"
  :data="tableData"
  :columns="tableColumns"
  :configurable="true"
  container-size="custom"
  custom-width="75%"
  custom-height="85vh"
/>
```

### 全屏模式

```vue
<BaseTable
  title="全屏表格"
  :data="tableData"
  :columns="tableColumns"
  :configurable="true"
  :fullscreen="true"
/>
```

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `containerSize` | `'small' \| 'medium' \| 'large' \| 'custom'` | `'medium'` | 容器预设尺寸 |
| `customWidth` | `string` | `'85%'` | 自定义宽度（仅在 containerSize='custom' 时生效） |
| `customHeight` | `string` | `'auto'` | 自定义高度（仅在 containerSize='custom' 时生效） |
| `fullscreen` | `boolean` | `false` | 是否全屏显示 |
| `configurable` | `boolean` | `false` | 是否启用配置面板 |

## 配置面板操作

当 `configurable` 设置为 `true` 时，配置面板会显示以下选项：

1. **预设尺寸按钮组**
   - 小 (70%)
   - 中 (85%)
   - 大 (100%)
   - 全屏

2. **自定义尺寸输入**（选择自定义或全屏时显示）
   - 宽度输入框
   - 高度输入框

## 响应式行为

- 所有尺寸切换都有平滑的过渡动画（300ms）
- 容器会自动居中显示
- 最大宽高限制为视口大小，防止溢出
- 全屏模式下使用固定定位，z-index 为 50

## 完整示例

查看 `/src/views/demo/responsive-table-demo/index.vue` 获取完整的演示代码。

## 技术实现

### ResponsiveContainer 组件

独立的响应式容器组件，负责处理尺寸逻辑：

```typescript
export type ContainerSize = 'small' | 'medium' | 'large' | 'custom'

interface Props {
  size?: ContainerSize
  customWidth?: string
  customHeight?: string
  fullscreen?: boolean
  class?: HTMLAttributes['class']
}
```

### BaseTable 集成

BaseTable 内部使用 ResponsiveContainer 包裹内容区域，并通过配置面板控制其属性。

## 注意事项

1. 旧的 `width` prop 已被标记为废弃，请使用 `containerSize` 代替
2. 自定义尺寸支持任何有效的 CSS 宽度和高度值
3. 全屏模式会覆盖其他尺寸设置
4. 配置面板中的更改是实时的，无需刷新页面
