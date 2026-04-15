# 场景元素组件

可复用的自然场景元素组件库,可以像搭积木一样自由组合创建各种背景效果。

## 组件列表

### 🌞 Sun - 太阳
带光晕效果的太阳,带有呼吸动画。

```vue
<Sun 
  :size="96" 
  glow-intensity="medium" 
  class="absolute right-20 top-20" 
/>
```

**Props:**
- `size`: 太阳大小(像素),默认 96
- `glowIntensity`: 光晕强度 `'low' | 'medium' | 'high'`,默认 `'medium'`

---

### 🌙 Moon - 月亮
精致的月牙,带环形山纹理和浮动动画。

```vue
<Moon 
  :size="90" 
  phase="crescent" 
  class="absolute right-20 top-20" 
/>
```

**Props:**
- `size`: 月亮大小(像素),默认 90
- `phase`: 月相 `'crescent' | 'half' | 'full'`,默认 `'crescent'`

---

### ⭐ Stars - 星星
闪烁的星空效果。

```vue
<Stars 
  :count="50" 
  area="top-half" 
/>
```

**Props:**
- `count`: 星星数量,默认 50
- `area`: 分布区域 `'full' | 'top-half' | 'custom'`,默认 `'top-half'`

---

### ☁️ Clouds - 云朵
飘动的云朵,支持多层和不同速度。

```vue
<Clouds 
  :count="3" 
  speed="medium" 
  color="rgba(255, 255, 255, 0.9)" 
/>
```

**Props:**
- `count`: 云朵数量,默认 3
- `speed`: 飘动速度 `'slow' | 'medium' | 'fast'`,默认 `'medium'`
- `color`: 云朵颜色,默认 `'rgba(255, 255, 255, 0.9)'`

---

### 🌿 Grass - 草地
多层波浪草地,带摆动动画。

```vue
<Grass 
  :height="200" 
  :layers="2" 
  color="#52b788" 
  :animated="true" 
/>
```

**Props:**
- `height`: 草地高度(像素),默认 200
- `layers`: 层数 `1 | 2 | 3`,默认 2
- `color`: 草地颜色,默认 `'#52b788'`
- `animated`: 是否启用摆动动画,默认 `true`

---

### 🌸 Flowers - 花朵
多彩的花朵,带摇曳动画。

```vue
<Flowers 
  :count="8" 
  :colors="['#ef4444', '#f59e0b', '#ec4899']" 
  bottom-offset="bottom-16" 
/>
```

**Props:**
- `count`: 花朵数量,默认 8
- `colors`: 颜色数组,默认 6 种颜色
- `bottomOffset`: 底部偏移类名,默认 `'bottom-16'`

---

### 🌱 Dandelion - 蒲公英
包含飞散的种子和地面的植株。

```vue
<Dandelion 
  :flying-count="5" 
  :ground-count="5" 
  seed-color="rgba(255, 255, 255, 0.95)" 
/>
```

**Props:**
- `flyingCount`: 飞散种子数量,默认 5
- `groundCount`: 地面植株数量,默认 5
- `seedColor`: 种子颜色,默认 `'rgba(255, 255, 255, 0.95)'`

---

### 🐝 Bee - 蜜蜂
飞舞的小蜜蜂,带翅膀扇动动画。

```vue
<Bee :count="3" />
```

**Props:**
- `count`: 蜜蜂数量,默认 3

---

### 🐦 Birds - 飞鸟
飞翔的鸟群,V字形剪影。

```vue
<Birds 
  :count="3" 
  color="#1e293b" 
/>
```

**Props:**
- `count`: 鸟的数量,默认 3
- `color`: 鸟的颜色,默认 `'#1e293b'`

---

### 💫 ShootingStars - 流星
划过的流星效果。

```vue
<ShootingStars :count="3" />
```

**Props:**
- `count`: 流星数量,默认 3

---

## 组合示例

### 白天场景
```vue
<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- 渐变背景 -->
    <div class="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200" />
    
    <!-- 太阳 -->
    <Sun class="absolute right-20 top-20" />
    
    <!-- 云朵 -->
    <Clouds :count="3" speed="medium" />
    
    <!-- 飞鸟 -->
    <Birds :count="3" />
    
    <!-- 蜜蜂 -->
    <Bee :count="3" />
    
    <!-- 草地 -->
    <Grass :height="200" :layers="2" color="#52b788" />
    
    <!-- 花朵 -->
    <Flowers :count="8" />
    
    <!-- 蒲公英 -->
    <Dandelion :flying-count="5" :ground-count="5" />
  </div>
</template>

<script setup lang="ts">
import { Sun, Clouds, Birds, Bee, Grass, Flowers, Dandelion } from '@/components/ui/bg/scenes'
</script>
```

### 夜晚场景
```vue
<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- 渐变背景 -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700" />
    
    <!-- 月亮 -->
    <Moon class="absolute right-20 top-20 z-10" />
    
    <!-- 星星 -->
    <Stars :count="50" area="top-half" />
    
    <!-- 流星 -->
    <ShootingStars :count="3" />
    
    <!-- 云朵(暗色) -->
    <Clouds :count="3" speed="slow" color="rgba(255, 255, 255, 0.1)" />
    
    <!-- 草地(暗色) -->
    <Grass :height="200" :layers="2" color="#1b4332" />
  </div>
</template>

<script setup lang="ts">
import { Moon, Stars, ShootingStars, Clouds, Grass } from '@/components/ui/bg/scenes'
</script>
```

### 自定义场景
```vue
<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- 黄昏背景 -->
    <div class="absolute inset-0 bg-gradient-to-b from-orange-400 via-pink-400 to-purple-600" />
    
    <!-- 大太阳(黄昏) -->
    <Sun :size="120" glow-intensity="high" class="absolute right-32 top-32" />
    
    <!-- 慢速云朵 -->
    <Clouds :count="5" speed="slow" color="rgba(255, 200, 150, 0.8)" />
    
    <!-- 多层草地 -->
    <Grass :height="250" :layers="3" color="#2d6a4f" />
    
    <!-- 大量花朵 -->
    <Flowers :count="12" :colors="['#ff6b6b', '#feca57', '#ff9ff3']" />
  </div>
</template>

<script setup lang="ts">
import { Sun, Clouds, Grass, Flowers } from '@/components/ui/bg/scenes'
</script>
```

---

## 最佳实践

1. **层级管理**: 使用 `z-index` 控制元素前后关系
2. **性能优化**: 根据屏幕大小调整元素数量(`count`)
3. **主题适配**: 通过 `computed` 动态调整颜色
4. **灵活组合**: 按需引入需要的组件,不必全部使用
5. **位置控制**: 使用 Tailwind 的 position 类定位元素

---

## 扩展建议

你可以基于这些基础组件创建更复杂的场景:
- 添加季节变化(樱花、落叶、雪花)
- 增加天气效果(雨、雪、雾)
- 创建动物生态(蝴蝶、蜻蜓、小鹿)
- 实现日夜平滑过渡动画
