<script setup lang="ts">
/**
 * CachePanel - 缓存管理面板
 */
import { localCache } from '@/utils/cache'
import { SunMessage, SunMessageBox } from '@/utils/message'
import { BaseButton } from '@/components/base'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, RefreshCw } from 'lucide-vue-next'

// 清除本地缓存
const clearLocalCache = async () => {
  try {
    await SunMessageBox.confirm(
      '此操作将清除所有本地缓存数据，包括主题、语言、菜单等设置，确定要继续吗？',
      '确认清除',
      {
        type: 'warning',
        confirmText: '确定清除',
        cancelText: '取消',
      }
    )
    localCache.clear()
    SunMessage.success('本地缓存已清除')
    // 刷新页面以应用更改
    setTimeout(() => window.location.reload(), 1000)
  } catch {
    // 用户取消
  }
}

// 清除系统缓存
const clearSystemCache = () => {
  // 这里可以添加清除系统缓存的逻辑
  SunMessage.success('系统缓存已清除')
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>缓存管理</CardTitle>
        <CardDescription>管理系统缓存数据</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- 本地缓存 -->
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h4 class="text-sm font-medium">本地缓存</h4>
            <p class="text-sm text-muted-foreground">
              清除浏览器本地存储的缓存数据（包括主题、语言等设置）
            </p>
          </div>
          <BaseButton variant="destructive" size="sm" @click="clearLocalCache">
            <Trash2 class="mr-2 h-4 w-4" />
            清除
          </BaseButton>
        </div>

        <Separator />

        <!-- 系统缓存 -->
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h4 class="text-sm font-medium">系统缓存</h4>
            <p class="text-sm text-muted-foreground">清除应用程序运行时的系统缓存</p>
          </div>
          <BaseButton variant="outline" size="sm" @click="clearSystemCache">
            <RefreshCw class="mr-2 h-4 w-4" />
            清除
          </BaseButton>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
