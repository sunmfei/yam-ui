<template>
  <!-- button -->
  <NavigationMenuItem v-if="node.type === 'button'">
    <button class="nav-button" @click="emitAction(node)">
      <component :is="getIconComponent(getIcon(node))" class="h-4 w-4" />
      {{ node.name }}
    </button>
  </NavigationMenuItem>

  <!-- route -->
  <NavigationMenuItem v-else-if="node.type === 'route'">
    <button class="nav-button" @click="goRoute(node)">
      <component :is="getIconComponent(getIcon(node))" class="h-4 w-4" />
      {{ node.name }}
    </button>
  </NavigationMenuItem>

  <!-- dropdown - 使用 Navigation Menu -->
  <NavigationMenuItem v-else-if="node.type === 'dropdown'">
    <NavigationMenuTrigger>
      <component :is="getIconComponent(getIcon(node))" class="h-4 w-4" />
      {{ node.name }}
    </NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul class="grid w-50 gap-3 p-4">
        <li v-for="child in node.children" :key="child.id">
          <Navbar :node="child" @action="emitAction" />
        </li>
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>

  <!-- list - 使用 Navigation Menu -->
  <NavigationMenuItem v-else-if="node.type === 'list'">
    <NavigationMenuTrigger>
      {{ getSelectedLabel(node) }}
    </NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul class="grid w-50 gap-3 p-4">
        <li v-for="item in node.children" :key="item.id">
          <button
            class="block w-full rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            @click="emitListItem(node, item)"
          >
            {{ item.name }}
          </button>
        </li>
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
</template>

<script setup lang="ts">
import type { MenuNode } from '@/types'
import { useRouter } from 'vue-router'
import actionHub from '@/types'
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'
import * as LucideIcons from 'lucide-vue-next'

const router = useRouter()

const _props = defineProps<{
  node: MenuNode
}>()

const emit = defineEmits(['action'])

function emitAction(node: MenuNode) {
  if (node.actionKey) {
    const handler = actionHub.getAction(node.actionKey)
    handler?.()
  } else {
    emit('action', node)
  }
}

function goRoute(node: MenuNode) {
  if (node.path) router.push(node.path)
}

function emitListItem(parent: MenuNode, item: MenuNode) {
  if (parent.onItemClickKey) {
    const handler = actionHub.getAction(parent.onItemClickKey)
    handler?.(item)
  }
}

function getSelectedLabel(node: MenuNode) {
  if (node.getSelectedLabelKey) {
    return actionHub.getString(node.getSelectedLabelKey) || node.name
  }
  return node.name
}

function getIcon(node: MenuNode) {
  // 优先使用动态图�?
  if (node.getIconKey) {
    const icon = actionHub.getString(node.getIconKey)
    if (icon) return icon
  }
  // 其次使用静态图�?
  return node.icon || 'Circle'
}

function getIconComponent(iconName: string) {
  // 将图标名称转换为 PascalCase
  const pascalName = iconName.charAt(0).toUpperCase() + iconName.slice(1)
  // @ts-expect-error - dynamic icon lookup
  return LucideIcons[pascalName] || LucideIcons.Circle
}
</script>

<style scoped lang="scss">
.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .dark &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
