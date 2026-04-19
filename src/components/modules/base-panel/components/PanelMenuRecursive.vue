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
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRight } from 'lucide-vue-next'
import { actionHub, type PanelSection } from '@/types'
import { getIconByName } from '@/config/types/icon.data.ts'

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
    return getIconByName(item.icon)
  }

  // 如果 icon 是组件，直接返回
  return item.icon
}

/**
 * 点击处理
 */
const handleClick = async (item: PanelSection) => {
  if (item.disabled) return

  // 如果有子节点，不触发选择，只展开/折叠
  if (item.children && item.children.length > 0) {
    return
  }

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
          <span>{{ getLabel(item) }}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <!-- 有子节点 - 使用 Collapsible -->
      <Collapsible v-else as-child class="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="getLabel(item)" :disabled="item.disabled">
              <component :is="getIcon(item)" v-if="getIcon(item)" class="h-4 w-4" />
              <span>{{ getLabel(item) }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <template v-for="child in getList(item.children)" :key="child.id">
                <!-- 如果子节点还有子节点，递归渲染 -->
                <SidebarMenuSubItem v-if="child.children?.length">
                  <Collapsible as-child class="group/sub-collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger as-child>
                        <SidebarMenuSubButton>
                          <component :is="getIcon(child)" v-if="getIcon(child)" class="h-3 w-3" />
                          <span>{{ getLabel(child) }}</span>
                          <ChevronRight
                            class="ml-auto transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-90"
                          />
                        </SidebarMenuSubButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem
                            v-for="grandChild in getList(child.children)"
                            :key="grandChild.id"
                          >
                            <SidebarMenuSubButton
                              :data-active="active === grandChild.id"
                              @click="handleClick(grandChild)"
                            >
                              <span>{{ getLabel(grandChild) }}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenuSubItem>
                <!-- 否则直接渲染 -->
                <SidebarMenuSubItem v-else>
                  <SidebarMenuSubButton
                    :data-active="active === child.id"
                    @click="handleClick(child)"
                  >
                    <component :is="getIcon(child)" v-if="getIcon(child)" class="h-3 w-3" />
                    <span>{{ getLabel(child) }}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </template>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </template>
  </SidebarMenu>
</template>
