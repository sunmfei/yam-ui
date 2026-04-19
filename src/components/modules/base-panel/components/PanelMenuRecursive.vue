<script setup lang="ts">
/**
 * PanelMenuRecursive - 多级菜单组件
 *
 * 功能：
 * 渲染多级菜单 + 行为控制 + 状态控制
 *
 * 执行结果：
 * 自动过滤 hidden、排序、禁用控制
 *
 * 设计目的：
 * 解耦 BasePanelRoot，统一菜单渲染逻辑
 */

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { actionHub, type PanelSection } from '@/types'

interface Props {
  items: PanelSection[]
  active?: string
}

const _props = defineProps<Props>()

const emit = defineEmits<{
  select: [string]
}>()

/**
 * 排序 + 过滤
 */
const getList = (list: PanelSection[]) => {
  return list.filter((i) => !i.hidden).sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * label
 */
const getLabel = (item: PanelSection) => {
  if (!item.getter) return item.label
  return actionHub.getString(item.getter) || item.label
}

/**
 * 获取图标组件
 */
const getIcon = (item: PanelSection) => {
  if (!item.icon) return null

  // 如果 icon 是字符串，尝试从 lucide-vue-next 动态导入
  if (typeof item.icon === 'string') {
    return null // TODO: 实现动态图标加载
  }

  // 如果 icon 是组件，直接返回
  return item.icon
}

/**
 * 点击处理
 */
const handleClick = async (item: PanelSection) => {
  if (item.disabled) return

  if (item.onItemClickKey) {
    await actionHub.executeAction(item.onItemClickKey, item)
  }

  if (item.actionKey) {
    await actionHub.executeAction(item.actionKey, item)
  }

  if (item.componentPath) {
    emit('select', item.id)
  }
}
</script>

<template>
  <SidebarMenu>
    <template v-for="item in getList(items)" :key="item.id">
      <!-- 无子节点 -->
      <SidebarMenuItem v-if="!item.children?.length">
        <SidebarMenuButton
          :data-active="active === item.id"
          :disabled="item.disabled"
          @click="handleClick(item)"
        >
          <component :is="getIcon(item)" v-if="getIcon(item)" class="h-4 w-4" />
          {{ getLabel(item) }}
        </SidebarMenuButton>
      </SidebarMenuItem>

      <!-- 有子节点 -->
      <SidebarMenuItem v-else>
        <SidebarMenuButton :disabled="item.disabled">
          <component :is="getIcon(item)" v-if="getIcon(item)" class="h-4 w-4" />
          {{ getLabel(item) }}
        </SidebarMenuButton>

        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <PanelMenuRecursive
              :items="item.children"
              :active="active"
              @select="(id) => emit('select', id)"
            />
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>
    </template>
  </SidebarMenu>
</template>
