# TreeTable Demo 使用指南

## 访问示例页面

启动项目后，在浏览器中访问：
```
http://localhost:5173/tree-table-demo
```

（端口号可能根据你的配置有所不同）

## 示例内容

本示例展示了 TreeTable 组件的 6 种常见使用场景：

### 1. 基本树形表格
展示最基础的树形数据展示功能，支持展开/折叠。

### 2. 带行选择功能
演示如何启用行选择，包括：
- 单选/多选
- 级联选择（选中父节点自动选中子节点）
- 实时显示已选中的行信息

### 3. 带分页功能
展示大数据量下的分页处理：
- 自定义每页条数
- 页码跳转
- 分页变化事件监听

### 4. 懒加载子节点
演示异步加载子节点：
- 模拟网络请求延迟
- 动态加载指示器
- 多层级懒加载

### 5. 自定义单元格渲染
展示如何使用插槽自定义单元格内容：
- 状态徽章显示
- 操作按钮
- 事件处理

### 6. 完整配置示例
综合展示所有功能的完整配置：
- 树形配置
- 选择配置
- 工具栏配置
- 分页配置
- 事件监听

## 代码位置

- **示例页面：** `src/views/tree-table-demo/index.vue`
- **路由配置：** `src/views/tree-table-demo/router/index.vue`
- **组件源码：** `src/components/ui/tree-table/index.vue`
- **类型定义：** `src/components/ui/tree-table/types.ts`
- **详细文档：** `src/components/ui/tree-table/README.md`

## 快速上手

### 1. 在你的组件中使用

```vue
<template>
  <TreeTable :data="myData" :columns="myColumns" />
</template>

<script setup lang="ts">
import TreeTable from '@/components/ui/tree-table/index.vue'
import type { TreeTableNode } from '@/components/ui/tree-table/data'

const myColumns = [
  { key: 'name', title: '名称' },
  { key: 'value', title: '值' },
]

const myData: TreeTableNode[] = [
  {
    id: '1',
    name: '项目 A',
    value: '100',
    children: [
      { id: '1-1', name: '子项 A1', value: '50' },
      { id: '1-2', name: '子项 A2', value: '50' },
    ],
  },
]
</script>
```

### 2. 添加更多功能

参考示例页面中的其他示例，逐步添加：
- 行选择：`:selection-config="{ enabled: true }"`
- 分页：`:pagination-config="{ enabled: true, pageSize: 10 }"`
- 懒加载：`:load-children="loadChildren"`
- 自定义单元格：使用 `<template #cell-xxx>` 插槽

### 3. 查看详细文档

阅读 `src/components/ui/tree-table/README.md` 了解：
- 所有 Props 详细说明
- 所有 Events 详细说明
- 数据类型定义
- 更多使用场景

## 运行项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问示例页面
# http://localhost:5173/tree-table-demo
```

## 学习路径建议

1. **先看示例 1** - 理解基本用法
2. **再看示例 5** - 学习自定义渲染（最常用）
3. **然后看示例 2、3** - 根据需求添加选择或分页
4. **最后看示例 4、6** - 学习高级功能

每个示例都是独立的，可以直接复制代码到你的项目中使用！

## 常见问题

**Q: 如何修改树的缩进？**
A: 设置 `treeConfig.indent`，例如 `:tree-config="{ indent: 32 }"`

**Q: 如何实现点击行展开？**
A: 设置 `treeConfig.expandOnRowClick: true`

**Q: 如何让父子节点选择不关联？**
A: 设置 `selectionConfig.checkStrictly: true`

**Q: 分页是对整个树分页还是对可见行分页？**
A: 对扁平化后的可见行进行分页（这是预期行为）

**Q: 如何在自定义单元格中阻止事件冒泡？**
A: 使用 `.stop` 修饰符，例如 `@click.stop="handleClick"`

## 需要帮助？

- 查看组件源码注释（非常详细）
- 阅读 README.md 文档
- 参考示例代码
- 联系开发团队
