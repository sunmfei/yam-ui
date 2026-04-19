<template>
  <div class="menu-tree-item">
    <div
      class="flex items-center gap-4 border-b p-3 transition-colors hover:bg-muted"
      :style="{ paddingLeft: `${level * 24 + 12}px` }"
    >
      <div class="flex-1 font-medium">{{ item.name }}</div>
      <div class="w-[120px] text-sm text-muted-foreground">{{ item.icon || '-' }}</div>
      <div class="w-[120px]">
        <span class="rounded bg-muted px-2 py-0.5 text-xs">{{ getTypeLabel(item.type) }}</span>
      </div>
      <div class="min-w-[200px] text-sm text-muted-foreground">
        <span v-if="hasPath(item)">{{ (item as any).path }}</span>
        <span
          v-else-if="hasAction(item)"
          class="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        >
          函数
        </span>
        <span v-else class="text-gray-400">未配置</span>
      </div>
      <div class="w-[80px] text-sm text-muted-foreground">{{ item.order }}</div>
      <div class="flex gap-1">
        <button
          class="rounded px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
          @click="$emit('add', item)"
        >
          添加子项
        </button>
        <button
          class="rounded px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
          @click="$emit('edit', item)"
        >
          编辑
        </button>
        <button
          class="rounded px-2 py-1 text-xs text-destructive transition-colors hover:bg-destructive/10"
          @click="$emit('delete', item)"
        >
          删除
        </button>
      </div>
    </div>

    <!-- 递归渲染子菜单 -->
    <template v-if="item.children && Array.isArray(item.children)">
      <MenuTreeItem
        v-for="child in item.children"
        :key="child.id || child.name"
        :item="child"
        :level="level + 1"
        @add="$emit('add', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { MenuNode } from '@/types'

interface Props {
  item: MenuNode
  level: number
}

defineProps<Props>()

defineEmits<{
  add: [item: MenuNode]
  edit: [item: MenuNode]
  delete: [item: MenuNode]
}>()

// 类型守卫
function hasPath(menu: MenuNode): boolean {
  return menu.type === 'route' || (!!menu.path && typeof menu.path === 'string')
}

function hasAction(menu: MenuNode): boolean {
  return !!menu.actionKey && typeof menu.actionKey === 'string'
}

function getTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
    button: '按钮',
    dropdown: '下拉',
    list: '列表',
    route: '路由',
  }
  return labels[type || 'button'] || '按钮'
}
</script>
