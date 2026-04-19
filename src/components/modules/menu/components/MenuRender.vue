<script setup lang="ts">
/**
 * MenuRender - 菜单项渲染组件
 *
 * 根据菜单节点类型递归渲染不同的菜单项
 * 支持：ACTION、ROUTE、MENU、SELECT 四种类型
 */

import { useRouter } from 'vue-router'
import actionHub from '@/types'
import { type MenuNode, MenuType } from '@/types'
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from '@/components/ui/menubar'
import * as LucideIcons from 'lucide-vue-next'

// 定义组件名称，支持递归调用
defineOptions({
  name: 'MenuRender',
})

const props = defineProps<{
  /** 当前菜单节点 */
  node: MenuNode
  /** 是否在子菜单内容中（只渲染 MenubarItem） */
  isInSubContent?: boolean
}>()

const router = useRouter()

/**
 * 获取图标名称
 * 优先级：动态图标 > 静态图标 > 默认图标
 */
function getIcon(): string {
  if (props.node.getIconKey) {
    const icon = actionHub.getString(props.node.getIconKey)
    if (icon) return icon
  }
  return props.node.icon || 'Circle'
}

/**
 * 获取图标组件
 */
function getIconComponent(iconName: string) {
  const pascalName = iconName.charAt(0).toUpperCase() + iconName.slice(1)
  // @ts-expect-error - dynamic icon lookup
  return LucideIcons[pascalName] || LucideIcons.Circle
}

/**
 * 执行动作（ACTION 类型）
 */
function runAction() {
  if (props.node.actionKey) {
    console.log('props.node.actionKey::::', props.node.actionKey)
    actionHub.executeAction(props.node.actionKey)
  }
}

/**
 * 执行选择（SELECT 类型的子项）
 */
function runSelect(item: MenuNode) {
  if (props.node.onChangeKey) {
    actionHub.executeAction(props.node.onChangeKey, item)
  }
}

/**
 * 处理子项点击（优先执行子项 actionKey，其次执行父级 onChangeKey）
 */
function handleItemClick(item: MenuNode) {
  if (item.actionKey) {
    actionHub.executeAction(item.actionKey)
  } else if (props.node.onChangeKey) {
    runSelect(item)
  }
}

/**
 * 获取选择器显示文本（SELECT 类型）
 */
function getLabel(): string {
  if (props.node.getValueKey) {
    return actionHub.getString(props.node.getValueKey) || props.node.name
  }
  return props.node.name
}

/**
 * 路由跳转（ROUTE 类型）
 */
function goRoute() {
  if (props.node.path) {
    router.push(props.node.path)
  }
}
</script>

<template>
  <!-- ================= 在子菜单内容中（只渲染 MenubarItem） ================= -->
  <template v-if="isInSubContent">
    <!-- ACTION 类型 -->
    <MenubarItem v-if="node.type === MenuType.ACTION" @click="runAction">
      <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
      {{ node.name }}
    </MenubarItem>

    <!-- ROUTE 类型 -->
    <MenubarItem v-else-if="node.type === MenuType.ROUTE" @click="goRoute">
      <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
      {{ node.name }}
    </MenubarItem>

    <!-- MENU 类型（嵌套子菜单） -->
    <MenubarSub v-else-if="node.type === MenuType.MENU">
      <MenubarSubTrigger>
        <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
        {{ node.name }}
      </MenubarSubTrigger>
      <MenubarSubContent>
        <MenuRender
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :is-in-sub-content="true"
        />
      </MenubarSubContent>
    </MenubarSub>

    <!-- SELECT 类型 -->
    <MenubarSub v-else-if="node.type === MenuType.SELECT">
      <MenubarSubTrigger>
        <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
        {{ getLabel() }}
      </MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem v-for="item in node.children" :key="item.id" @click="handleItemClick(item)">
          {{ item.name }}
        </MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  </template>

  <!-- ================= 顶级菜单（渲染完整 MenubarMenu） ================= -->
  <template v-else>
    <!-- ACTION 类型 -->
    <MenubarMenu v-if="node.type === MenuType.ACTION">
      <MenubarTrigger @click="runAction">
        <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
        {{ node.name }}
      </MenubarTrigger>
    </MenubarMenu>

    <!-- ROUTE 类型 -->
    <MenubarMenu v-else-if="node.type === MenuType.ROUTE">
      <MenubarTrigger @click="goRoute">
        <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
        {{ node.name }}
      </MenubarTrigger>
    </MenubarMenu>

    <!-- MENU 类型 -->
    <MenubarMenu v-else-if="node.type === MenuType.MENU">
      <MenubarTrigger>
        <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
        {{ node.name }}
      </MenubarTrigger>

      <MenubarContent>
        <MenuRender
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :is-in-sub-content="true"
        />
      </MenubarContent>
    </MenubarMenu>

    <!-- SELECT 类型 -->
    <MenubarMenu v-else-if="node.type === MenuType.SELECT">
      <MenubarTrigger>
        <component :is="getIconComponent(getIcon())" class="mr-2 h-4 w-4" />
        {{ getLabel() }}
      </MenubarTrigger>

      <MenubarContent>
        <MenubarItem v-for="item in node.children" :key="item.id" @click="handleItemClick(item)">
          {{ item.name }}
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </template>
</template>
