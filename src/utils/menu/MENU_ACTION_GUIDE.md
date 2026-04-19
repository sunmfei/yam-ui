# 菜单动作注册系统使用指南

## 概述

当菜单数据从数据库加载时（纯 JSON），无法直接包含函数。本系统通过**注册表模式**，将字符串标识符映射到实际的函数实现。

## 核心概念

### 1. 注册表 (MenuActionRegistry)

集中管理所有菜单相关的处理函数，通过唯一的字符串键（key）进行注册和查找。

### 2. 两种使用方式

- **直接配置**：在代码中直接定义函数（适合静态菜单）
- **注册键引用**：通过 key 引用已注册的函数（适合数据库菜单）

## 使用步骤

### 步骤 1：注册处理函数

在应用启动时（如 `main.ts` 或专门的初始化文件）注册处理函数：

```typescript
import { menuActionRegistry } from '@/utils/menu/menuActionRegistry'
import type { ListItemData } from '@/data/menu'

// 注册列表项点击处理
menuActionRegistry.registerListItemClick('background-change', async (item: ListItemData) => {
  const { useAppStore } = await import('@/stores/app')
  const appStore = useAppStore()
  
  if (typeof item.value === 'string') {
    appStore.setBackgroundType(item.value as any)
  }
  console.log(`✓ 已切换背景: ${item.label}`)
})

// 注册获取选中标签的处理
menuActionRegistry.registerGetSelectedLabel('background-current', () => {
  const { useAppStore } = require('@/stores/app')
  const appStore = useAppStore()
  
  const labelMap: Record<string, string> = {
    particles: '粒子效果',
    gradient: '渐变光晕',
    grid: '网格线条',
    wave: '波浪动画',
    nature: '自然风景',
    none: '无背景',
  }
  
  return labelMap[appStore.backgroundType] || '背景选择'
})
```

### 步骤 2：配置数据库菜单

数据库中的菜单数据（JSON 格式）：

```json
{
  "name": "背景选择",
  "type": "list",
  "icon": "Reading",
  "order": 3,
  "children": [
    { "label": "粒子效果", "value": "particles" },
    { "label": "渐变光晕", "value": "gradient" },
    { "label": "网格线条", "value": "grid" }
  ],
  "onItemClickKey": "background-change",
  "getSelectedLabelKey": "background-current"
}
```

### 步骤 3：转换并合并菜单

```typescript
import { convertDatabaseMenuToAppMenu } from '@/utils/menu/menuConverter'
import { DEFAULT_MENU } from '@/views/searchBox/data/MenuData'

// 从 API 获取数据库菜单
const dbMenus = await fetchMenuFromAPI()

// 转换为应用菜单（自动映射函数）
const convertedMenus = convertDatabaseMenuToAppMenu(dbMenus)

// 合并静态和动态菜单
const allMenus = [...DEFAULT_MENU, ...convertedMenus]
```

## 完整示例

### 示例 1：背景选择菜单

#### 注册函数

```typescript
// src/utils/menu/menuActions.ts
import { menuActionRegistry } from './menuActionRegistry'
import type { ListItemData } from '@/data/menu'

export function initBackgroundActions() {
  // 点击处理
  menuActionRegistry.registerListItemClick('bg-change', async (item) => {
    const { useAppStore } = await import('@/stores/app')
    const store = useAppStore()
    
    if (typeof item.value === 'string') {
      store.setBackgroundType(item.value as any)
    }
  })
  
  // 获取当前选中
  menuActionRegistry.registerGetSelectedLabel('bg-current', () => {
    const { useAppStore } = require('@/stores/app')
    const store = useAppStore()
    
    const labels: Record<string, string> = {
      particles: '粒子效果',
      gradient: '渐变光晕',
      grid: '网格线条',
      wave: '波浪动画',
      nature: '自然风景',
      none: '无背景',
    }
    
    return labels[store.backgroundType]
  })
}
```

#### 数据库数据

```json
{
  "name": "背景选择",
  "type": "list",
  "icon": "Reading",
  "order": 3,
  "children": [
    { "label": "粒子效果", "value": "particles" },
    { "label": "渐变光晕", "value": "gradient" },
    { "label": "网格线条", "value": "grid" },
    { "label": "波浪动画", "value": "wave" },
    { "label": "自然风景", "value": "nature" },
    { "label": "无背景", "value": "none" }
  ],
  "onItemClickKey": "bg-change",
  "getSelectedLabelKey": "bg-current"
}
```

### 示例 2：语言切换菜单

#### 注册函数

```typescript
menuActionRegistry.registerListItemClick('lang-change', async (item) => {
  const { useLangStore } = await import('@/stores/lang')
  const store = useLangStore()
  store.setLang(item.value as string)
})

menuActionRegistry.registerGetSelectedLabel('lang-current', () => {
  const { useLangStore } = require('@/stores/lang')
  const store = useLangStore()
  return store.currentLang === 'zh' ? '中文' : 'English'
})
```

#### 数据库数据

```json
{
  "name": "语言选择",
  "type": "list",
  "icon": "Translate",
  "order": 4,
  "children": [
    { "label": "中文", "value": "zh" },
    { "label": "English", "value": "en" }
  ],
  "onItemClickKey": "lang-change",
  "getSelectedLabelKey": "lang-current"
}
```

## API 参考

### MenuActionRegistry

#### 注册方法

```typescript
// 注册列表项点击处理
registerListItemClick(key: string, handler: ListItemClickHandler): void

// 注册获取选中标签处理
registerGetSelectedLabel(key: string, handler: GetSelectedLabelHandler): void
```

#### 查询方法

```typescript
// 获取处理函数
getListItemClick(key: string): ListItemClickHandler | undefined
getGetSelectedLabel(key: string): GetSelectedLabelHandler | undefined

// 检查是否存在
hasListItemClick(key: string): boolean
hasGetSelectedLabel(key: string): boolean
```

#### 工具方法

```typescript
// 清除所有注册
clear(): void

// 获取所有已注册的键
getRegisteredKeys(): {
  listItemClick: string[]
  getSelectedLabel: string[]
}
```

### MenuItem 类型扩展

```typescript
interface ActionMenuItem {
  // ... 其他属性
  
  // 直接配置函数（优先级高）
  onItemClick?: (item: ListItemData) => void | Promise<void>
  getSelectedLabel?: () => string | undefined
  
  // 或通过 key 引用（适合数据库）
  onItemClickKey?: string
  getSelectedLabelKey?: string
}
```

## 优先级规则

组件渲染时的查找顺序：

1. **直接配置的函数** (`onItemClick` / `getSelectedLabel`) - 最高优先级
2. **注册键引用的函数** (`onItemClickKey` / `getSelectedLabelKey`) - 次优先级
3. **默认行为** - 如果都没有配置

## 最佳实践

### ✅ 推荐做法

1. **统一的注册文件**：将所有注册集中在一个文件中管理
2. **语义化的键名**：使用清晰的命名，如 `bg-change`、`lang-current`
3. **错误处理**：在注册的处理函数中添加 try-catch
4. **类型安全**：确保 handler 的参数和返回值类型正确

### ❌ 避免的做法

1. 不要在数据库中存储函数代码
2. 不要硬编码判断菜单名称
3. 不要忘记注册处理函数就使用 key
4. 不要使用重复的键名

## 调试技巧

### 查看所有已注册的键

```typescript
console.log(menuActionRegistry.getRegisteredKeys())
// 输出:
// {
//   listItemClick: ['bg-change', 'lang-change'],
//   getSelectedLabel: ['bg-current', 'lang-current']
// }
```

### 检查是否已注册

```typescript
if (!menuActionRegistry.hasListItemClick('my-key')) {
  console.warn('⚠️ 未注册处理函数: my-key')
}
```

### 测试转换

```typescript
import { convertDatabaseMenuToAppMenu } from '@/utils/menu/menuConverter'

const dbMenu = {
  name: '测试',
  type: 'list',
  children: [{ label: '选项1', value: 'opt1' }],
  onItemClickKey: 'test-click'
}

const result = convertDatabaseMenuToAppMenu([dbMenu])
console.log(result[0].onItemClick) // 应该是一个函数
```

## 常见问题

### Q: 为什么需要两套机制（直接配置 + 注册键）？

A: 
- **直接配置**：适合静态菜单，代码简洁直观
- **注册键**：适合数据库菜单，支持动态加载

两者可以共存，直接配置优先级更高。

### Q: 如何处理异步依赖？

A: 在处理函数中使用动态 import：

```typescript
menuActionRegistry.registerListItemClick('my-action', async (item) => {
  const { useSomeStore } = await import('@/stores/someStore')
  const store = useSomeStore()
  // 使用 store...
})
```

### Q: 注册表会在热更新时丢失吗？

A: 不会。注册表是单例，只要不刷新页面就会保持。如果需要重新注册，可以先调用 `clear()`。

### Q: 如何为不同的用户显示不同的菜单？

A: 在后端根据用户权限返回不同的菜单数据，前端统一转换即可：

```typescript
const userMenus = await fetchUserMenus(userId)
const menus = convertDatabaseMenuToAppMenu(userMenus)
```

## 相关文件

- [`menuActionRegistry.ts`](./menuActionRegistry.ts) - 注册表实现
- [`menuConverter.ts`](./menuConverter.ts) - 数据转换工具
- [`menuActionExample.ts`](./menuActionExample.ts) - 完整示例
- [`menu.ts`](../../types/menu.ts) - 类型定义
