<script setup lang="ts">
import { computed } from 'vue'
import {
  BaseBreadcrumb,
  BaseBreadcrumbList,
  BaseBreadcrumbItem,
  BaseBreadcrumbLink,
  BaseBreadcrumbPage,
  BaseBreadcrumbSeparator,
  BaseBreadcrumbEllipsis,
} from '@/components/base/ui-proxy'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * BreadcrumbItem - 面包屑项配置
 */
export interface BreadcrumbItemConfig {
  /** 显示文本 */
  title: string
  /** 链接路径（可选，不提供则为当前页） */
  href?: string
  /** 是否为当前页 */
  isCurrent?: boolean
}

/**
 * BreadcrumbProps - 面包屑组件属性
 */
interface Props {
  /** 面包屑项列表 */
  items: BreadcrumbItemConfig[]
  /** 最大显示项数（超出则折叠） */
  maxItems?: number
  /** 折叠时显示的文本 */
  ellipsisText?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 5,
  ellipsisText: '更多',
})

/**
 * 计算需要显示的面包屑项
 */
const displayItems = computed(() => {
  if (props.items.length <= props.maxItems) {
    return props.items.map((item) => ({ ...item, isEllipsis: false as const }))
  }

  // 始终显示第一项和最后一项，中间折叠
  const first = { ...props.items[0], isEllipsis: false as const }
  const last = { ...props.items[props.items.length - 1], isEllipsis: false as const }
  const middle = props.items.slice(1, -1)

  return [
    first,
    { title: props.ellipsisText, isEllipsis: true as const, middleItems: middle },
    last,
  ]
})
</script>

<template>
  <BaseBreadcrumb>
    <BaseBreadcrumbList>
      <template v-for="(item, index) in displayItems" :key="index">
        <!-- 普通面包屑项 -->
        <template v-if="'isEllipsis' in item && item.isEllipsis">
          <BaseBreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger class="flex items-center gap-1">
                <BaseBreadcrumbEllipsis class="h-4 w-4" />
                <span class="sr-only">{{ item.title }}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  v-for="middleItem in item.middleItems"
                  :key="middleItem.title"
                  @click="$router.push(middleItem.href || '/')"
                >
                  {{ middleItem.title }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BaseBreadcrumbItem>
          <BaseBreadcrumbSeparator />
        </template>

        <!-- 可点击的面包屑项 -->
        <template v-else-if="item.href && !('isCurrent' in item && item.isCurrent)">
          <BaseBreadcrumbItem>
            <BaseBreadcrumbLink :href="item.href">
              {{ item.title }}
            </BaseBreadcrumbLink>
          </BaseBreadcrumbItem>
          <BaseBreadcrumbSeparator v-if="index < displayItems.length - 1" />
        </template>

        <!-- 当前页面面包屑项 -->
        <template v-else>
          <BaseBreadcrumbItem>
            <BaseBreadcrumbPage>{{ item.title }}</BaseBreadcrumbPage>
          </BaseBreadcrumbItem>
          <BaseBreadcrumbSeparator v-if="index < displayItems.length - 1" />
        </template>
      </template>
    </BaseBreadcrumbList>
  </BaseBreadcrumb>
</template>
