<template>
  <!-- button -->
  <button v-if="node.type === 'button'" class="nav-button" @click="emitAction(node)">
    <el-icon>
      <component :is="getIcon(node)" />
    </el-icon>
    {{ node.name }}
  </button>

  <!-- route -->
  <button v-else-if="node.type === 'route'" class="nav-button" @click="goRoute(node)">
    <el-icon>
      <component :is="getIcon(node)" />
    </el-icon>
    {{ node.name }}
  </button>

  <!-- dropdown -->
  <el-dropdown v-else-if="node.type === 'dropdown'">
    <button class="nav-button">
      <el-icon>
        <component :is="getIcon(node)" />
      </el-icon>
      {{ node.name }}
    </button>

    <template #dropdown>
      <el-dropdown-menu>
        <SearchNavbar
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          @action="emitAction"
        />
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- list -->
  <el-dropdown v-else-if="node.type === 'list'">
    <button class="nav-button">
      {{ getSelectedLabel(node) }}
    </button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in node.children"
          :key="item.id"
          @click="emitListItem(node, item)"
        >
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import type { MenuNode } from '@/types/menu'
import { useRouter } from 'vue-router'
import actionHub from '@/types/ActionHub.ts'

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
  // 优先使用动态图标
  if (node.getIconKey) {
    const icon = actionHub.getString(node.getIconKey)
    if (icon) return icon
  }
  // 其次使用静态图标
  return node.icon || 'CircleClose'
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
