# 缓存管理系统

## 📁 文件结构

```
src/
├── types/
│   └── cache.ts              # 缓存类型定义
└── utils/
    └── cache/
        ├── baseCache.ts      # 缓存基类
        ├── localCache.ts     # 本地缓存（用户行为）
        ├── systemCache.ts    # 系统缓存（服务器数据）
        ├── icon.data.utils.ts          # 统一出口
        └── example.ts        # 使用示例
```

## 🎯 设计理念

### 两种缓存类型

1. **本地缓存 (LocalCache)** - 保存用户行为数据
   - 使用 `localStorage` 持久化存储
   - 关闭浏览器后数据仍然保留
   - 适用场景：主题偏好、语言设置、搜索历史等

2. **系统缓存 (SystemCache)** - 保存服务器数据
   - 使用 `sessionStorage` 临时存储
   - 关闭浏览器后自动清除
   - 适用场景：用户信息、Token、API 响应数据等

## 🚀 基本用法

### 导入

```typescript
import { localCache, systemCache, LocalCacheKey, SystemCacheKey } from '@/utils/cache'
```

### 设置缓存

```typescript
// 基本用法
localCache.set(LocalCacheKey.THEME, 'dark')

// 带过期时间（毫秒）
systemCache.set(SystemCacheKey.USER_INFO, userInfo, {
  expire: 24 * 60 * 60 * 1000 // 24小时
})
```

### 获取缓存

```typescript
const theme = localCache.get<string>(LocalCacheKey.THEME)
const userInfo = systemCache.get(SystemCacheKey.USER_INFO)
```

### 删除缓存

```typescript
// 删除单个
localCache.remove(LocalCacheKey.THEME)

// 清空所有
localCache.clearAll()
systemCache.clearAll()
```

## 🧹 清理方法

### 1. 清理所有缓存

```typescript
import { clearAllCache } from '@/utils/cache'

clearAllCache()
```

### 2. 清理过期缓存

```typescript
import { clearExpiredCache } from '@/utils/cache'

clearExpiredCache()
```

### 3. 清理指定类型的缓存

```typescript
// 清理本地缓存中匹配 "searchBox" 的项
localCache.clearByPattern('search')

// 清理系统缓存中匹配 "api" 的项
systemCache.clearByPattern('api')
```

### 4. 清理认证相关缓存（登出时）

```typescript
systemCache.clearAuth()
```

### 5. 自定义清理函数

参考 `example.ts` 中的实现，可以根据业务需求编写特定的清理逻辑。

## 📊 缓存统计

```typescript
import { getCacheStats, formatBytes } from '@/utils/cache'

const stats = getCacheStats()
console.log(`本地缓存: ${stats.local.count} 项, ${formatBytes(stats.local.size)}`)
console.log(`系统缓存: ${stats.system.count} 项, ${formatBytes(stats.system.size)}`)
```

## 💡 最佳实践

### 1. 使用枚举键名

```typescript
// ✅ 推荐
localCache.set(LocalCacheKey.THEME, 'dark')

// ❌ 不推荐
localCache.set('theme', 'dark')
```

### 2. 设置合理的过期时间

```typescript
// Token: 7天
systemCache.set(SystemCacheKey.TOKEN, token, {
  expire: 7 * 24 * 60 * 60 * 1000
})

// API数据: 5分钟
systemCache.set(`${SystemCacheKey.API_DATA}:users`, data, {
  expire: 5 * 60 * 1000
})

// 用户偏好: 30天
localCache.set(LocalCacheKey.USER_PREFERENCES, prefs, {
  expire: 30 * 24 * 60 * 60 * 1000
})
```

### 3. 应用启动时清理过期缓存

```typescript
// main.ts
import { cleanupExpiredCache } from '@/utils/cache/example'

cleanupExpiredCache()
```

### 4. 登出时清理认证缓存

```typescript
import { logout } from '@/utils/cache/example'

function handleLogout() {
  logout()
  // 跳转到登录页
}
```

## 🔑 可用的缓存键名

### LocalCacheKey（本地缓存）
- `THEME` - 主题偏好
- `LANGUAGE` - 语言设置
- `BACKGROUND_TYPE` - 背景类型
- `SEARCH_HISTORY` - 搜索历史
- `USER_PREFERENCES` - 用户偏好

### SystemCacheKey（系统缓存）
- `USER_INFO` - 用户信息
- `TOKEN` - 认证令牌
- `API_DATA` - API 响应数据
- `CONFIG` - 系统配置
- `DICTIONARY` - 字典数据

## 📝 扩展示例

参考 `src/utils/cache/example.ts` 文件，里面包含了完整的使用示例：
- 搜索历史管理
- 用户偏好设置
- 用户信息和 Token 管理
- API 数据缓存
- 登出清理逻辑
