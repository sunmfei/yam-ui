<script setup lang="ts">
/**
 * AppearancePanel - 外观设置面板
 */
import { useAppStore } from '@/stores'
import { localCache, LocalCacheKey } from '@/utils/cache'
import { SunMessage } from '@/utils/message.ts'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const appStore = useAppStore()

// 主题选项
const themeOptions = [
  { value: 'light', label: '浅色模式' },
  { value: 'dark', label: '深色模式' },
  { value: 'auto', label: '跟随系统' },
]

// 背景选项
const backgroundOptions = [
  { value: 'none', label: '无背景' },
  { value: 'gradient', label: '渐变背景' },
  { value: 'particles', label: '粒子效果' },
  { value: 'grid', label: '网格背景' },
  { value: 'wave', label: '波浪背景' },
  { value: 'nature', label: '自然背景' },
  { value: 'sakura', label: '樱花飘落' },
]

// 切换主题
const handleThemeChange = (value: string | number | boolean) => {
  const themeValue = String(value)
  if (themeValue === 'auto') {
    appStore.setAutoTheme()
  } else {
    appStore.setTheme(themeValue === 'dark')
  }
  localCache.set(LocalCacheKey.THEME, themeValue)
  SunMessage.success('主题已更新')
}

// 切换背景
const handleBackgroundChange = (value: string | number | boolean) => {
  const bgValue = String(value)
  appStore.setBackgroundType(bgValue as any)
  SunMessage.success('背景已更新')
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>外观设置</CardTitle>
        <CardDescription>自定义界面的视觉风格</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- 主题选择 -->
        <div class="space-y-3">
          <Label>主题模式</Label>
          <RadioGroup
            :model-value="appStore.theme"
            class="grid grid-cols-3 gap-4"
            @update:model-value="handleThemeChange"
          >
            <div
              v-for="option in themeOptions"
              :key="option.value"
              class="flex items-center space-x-2"
            >
              <RadioGroupItem :id="option.value" :value="option.value" />
              <Label :for="option.value">{{ option.label }}</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <!-- 背景选择 -->
        <div class="space-y-3">
          <Label>背景样式</Label>
          <RadioGroup
            :model-value="appStore.backgroundType"
            class="grid grid-cols-2 sm:grid-cols-3 gap-4"
            @update:model-value="handleBackgroundChange"
          >
            <div
              v-for="option in backgroundOptions"
              :key="option.value"
              class="flex items-center space-x-2"
            >
              <RadioGroupItem :id="option.value" :value="option.value" />
              <Label :for="option.value">{{ option.label }}</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
