# 组件体系使用规范

## 📁 目录结构

```
src/components/
├── base/                    # 基础组件封装层（必须通过此层访问UI组件）
│   ├── button/             # BaseButton
│   ├── input/              # BaseInput  
│   ├── select/             # BaseSelect
│   ├── modal/              # BaseModal
│   ├── switch/             # BaseSwitch
│   ├── table/              # BaseTable
│   └── index.vue            # 统一导出
├── business/               # 业务组件（Sun前缀，开箱即用）
│   ├── sun-table/          # SunTable
│   ├── sun-form/           # SunForm
│   ├── sun-search/         # SunSearch
│   └── index.vue            # 统一导出
├── modules/                # 复杂模块组件（语义化命名）
│   ├── menu/               # 菜单模块
│   ├── navbar/             # 导航栏模块
│   └── index.vue            # 统一导出
└── ui/                     # 第三方UI组件（禁止直接引用）
    ├── button/
    ├── input/
    └── ...
```

---

## 🎯 组件命名规范

### 1. Base层（基础组件）
- **前缀**: `Base`
- **示例**: `BaseButton`, `BaseInput`, `BaseTable`
- **用途**: 封装第三方UI组件，提供统一接口

### 2. Business层（业务组件）
- **前缀**: `Sun`
- **示例**: `SunTable`, `SunForm`, `SunSearch`
- **用途**: 基于Base层封装的业务级组件，开箱即用

### 3. Modules层（模块组件）
- **命名**: 语义化名称，无前缀
- **示例**: `MenuTree`, `NavbarMain`, `SearchModule`
- **用途**: 复杂业务模块，包含多个子组件

### 4. UI层（第三方组件）
- **命名**: 保持原样，不修改
- **示例**: `Button`, `Input`, `Dialog`
- **用途**: 第三方UI库组件，**禁止在业务代码中直接使用**

---

## ⚠️ 强制约束

### ❌ 禁止事项

1. **禁止直接使用ui组件**
   ```vue
   <!-- 错误 -->
   <script setup>
   import { Button } from '@/components/ui/button'
   </script>
   
   <!-- 正确 -->
   <script setup>
   import { BaseButton } from '@/components/base/button'
   </script>
   ```

2. **禁止省略name属性**
   ```vue
   <!-- 错误 -->
   <script setup lang="ts">
   const props = defineProps<{...}>()
   </script>
   
   <!-- 正确 -->
   <script setup lang="ts">
   defineOptions({
     name: 'BaseButton',
   })
   const props = defineProps<{...}>()
   </script>
   ```

3. **禁止跨层引用**
   ```vue
   <!-- 错误：business层直接引用ui层 -->
   import { Button } from '@/components/ui/button'
   
   <!-- 正确：business层引用base层 -->
   import { BaseButton } from '@/components/base/button'
   ```

### ✅ 推荐做法

1. **优先使用自动导入**
   ```vue
   <!-- 无需手动import，自动识别 -->
   <template>
     <BaseButton>点击</BaseButton>
     <SunTable :data="list" />
   </template>
   ```

2. **需要类型时使用手动导入**
   ```vue
   <script setup lang="ts">
   import { BaseTable } from '@/components/base/table'
   import type { TreeTableColumn } from '@/components/base/table'
   </script>
   ```

---

## 🔧 自动导入配置

### Vite配置（vite.config.ts）
```typescript
import Components from 'unplugin-vue-components/vite'

Components({
  dirs: [
    'src/components/base',      // ✅ 自动注册base组件
    'src/components/business',  // ✅ 自动注册business组件
    'src/components/modules',   // ✅ 自动注册modules组件
  ],
  exclude: [/node_modules/, /src\/components\/ui/], // ❌ 排除ui目录
  extensions: ['vue'],
  dts: 'src/components.d.ts',  // 生成类型声明
})
```

### 类型声明
- 自动生成：`src/components.d.ts`
- 手动更新：运行 `pnpm dev` 或 `pnpm build`

---

## 📝 组件开发规范

### 1. 创建Base层组件
```vue
<template>
  <!-- 封装ui组件 -->
  <button :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

/**
 * BaseButton - 基础按钮组件
 * 
 * 封装 ui/button，提供统一的按钮样式和交互
 * 禁止在业务代码中直接使用 ui/button
 */
defineOptions({
  name: 'BaseButton',
})

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'destructive' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'default',
    size: 'default',
  }
)
</script>
```

### 2. 创建Business层组件
```vue
<template>
  <div>
    <BaseTable :data="data" :columns="columns">
      <!-- 业务逻辑 -->
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
/**
 * SunTable - 业务表格组件
 * 
 * 基于 BaseTable 封装的业务级表格组件
 * 提供开箱即用的业务功能
 */
defineOptions({
  name: 'SunTable',
})

// 业务逻辑...
</script>
```

### 3. 导出文件规范
```typescript
// src/components/base/index.vue
/**
 * Base 层组件统一导出
 * 
 * 基础组件封装层：所有业务代码必须通过此层访问UI组件
 * 禁止直接使用 @/components/ui/*
 */

export { default as BaseButton } from './button/BaseButton.vue'
export { default as BaseInput } from './input/BaseInput.vue'
export { default as BaseTable } from './table/BaseTable.vue'
```

---

## 🚀 迁移指南

### 从旧结构迁移

1. **替换import路径**
   ```bash
   # 旧路径 → 新路径
   @/components/table/BaseTable.vue → @/components/base/table/BaseTable.vue
   @/components/ui/button → @/components/base/button
   ```

2. **替换组件标签**
   ```bash
   # 批量替换
   <Button> → <BaseButton>
   <Input> → <BaseInput>
   <Switch> → <BaseSwitch>
   ```

3. **验证类型声明**
   ```bash
   pnpm dev  # 自动生成 components.d.ts
   ```

---

## 📌 注意事项

1. **ui目录不参与自动导入**：所有ui组件必须通过base层间接使用
2. **name属性必填**：每个组件必须定义`defineOptions({ name: 'Xxx' })`
3. **注释规范**：每个组件必须包含JSDoc注释说明用途
4. **类型安全**：优先使用TypeScript，导出类型定义
5. **按需导入**：大型组件使用懒加载，避免首屏体积过大

---

## 🔍 常见问题

### Q: 为什么不能直接使用ui组件？
A: 统一通过base层封装可以：
- 集中管理UI库升级
- 统一样式和交互规范
- 便于后续替换UI库

### Q: 自动导入不生效怎么办？
A: 检查以下几点：
1. 组件是否在 `base/business/modules` 目录下
2. 组件文件名是否与标签名匹配（忽略大小写）
3. 重启开发服务器 `pnpm dev`
4. 删除 `src/components.d.ts` 后重新生成

### Q: 如何添加新的基础组件？
A: 
1. 在 `src/components/base/xxx/` 创建组件
2. 添加 `defineOptions({ name: 'BaseXxx' })`
3. 在 `src/components/base/index.vue` 中导出
4. 重启开发服务器

---

**最后更新**: 2026-04-18  
**维护者**: Yam UI Team
