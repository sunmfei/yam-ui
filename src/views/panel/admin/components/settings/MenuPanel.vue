<script setup lang="ts">
/**
 * MenuPanel - 菜单配置面板
 */
import { localCache, LocalCacheKey } from '@/utils/cache'
import { SunMessage, SunMessageBox } from '@/utils/message.ts'
import { BaseButton } from '@/components/base'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw } from 'lucide-vue-next'

// 重置菜单配置
const resetMenuConfig = async () => {
  try {
    await SunMessageBox.confirm(
      '此操作将重置所有菜单配置为默认状态，且不可撤销，确定要继续吗？',
      '确认重置',
      {
        type: 'warning',
        confirmText: '确定重置',
        cancelText: '取消',
      }
    )
    localCache.remove(LocalCacheKey.MENU_CONFIG)
    SunMessage.success('菜单配置已重置，请刷新页面')
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>菜单配置</CardTitle>
        <CardDescription>管理导航菜单设置</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- 重置菜单 -->
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h4 class="text-sm font-medium">重置菜单配置</h4>
            <p class="text-sm text-muted-foreground">将菜单配置恢复为默认状态（此操作不可撤销）</p>
          </div>
          <BaseButton variant="destructive" size="sm" @click="resetMenuConfig">
            <RefreshCw class="mr-2 h-4 w-4" />
            重置
          </BaseButton>
        </div>

        <Separator />

        <!-- 菜单说明 -->
        <div class="rounded-lg border bg-muted/50 p-4">
          <h4 class="mb-2 text-sm font-medium">提示</h4>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li>• 您可以在"菜单管理"页面中自定义菜单结构</li>
            <li>• 重置后将丢失所有自定义菜单配置</li>
            <li>• 建议先导出备份再进行重置操作</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
