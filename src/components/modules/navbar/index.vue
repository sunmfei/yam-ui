<template>
  <nav class="app-navbar" :style="navbarStyle">
    <NavigationMenu>
      <NavigationMenuList>
        <NavbarItem v-for="node in menuNodes" :key="node.id" :node="node" />
      </NavigationMenuList>
    </NavigationMenu>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu'
import NavbarItem from './NavbarItem.vue'
import { useAppStore } from '@/stores'
import { NAVBAR_THEMES, type NavbarTheme, type NavbarThemeConfig } from './data/navbar-themes'
import type { MenuNode } from '@/types'

const appStore = useAppStore()

// Props 定义
interface AppNavbarProps {
  menuNodes?: MenuNode[]
  theme?: NavbarTheme
  navbarConfig?: Partial<NavbarThemeConfig>
}

const props = withDefaults(defineProps<AppNavbarProps>(), {
  menuNodes: () => [],
  theme: 'glass',
  navbarConfig: undefined,
})

// 合并配置：自定义配置优先，否则使用主题配置
const finalConfig = computed<NavbarThemeConfig>(() => {
  const themeConfig = NAVBAR_THEMES[props.theme] ?? NAVBAR_THEMES.glass
  if (props.navbarConfig) {
    return {
      ...themeConfig,
      ...props.navbarConfig,
    }
  }
  return themeConfig
})

// 动态计算导航栏样式
const navbarStyle = computed(() => ({
  background: appStore.isDark ? finalConfig.value.dark : finalConfig.value.light,
  backdropFilter: `blur(${finalConfig.value.blur})`,
  borderBottom: `1px solid ${appStore.isDark ? finalConfig.value.darkBorderColor : finalConfig.value.borderColor}`,
  padding: finalConfig.value.padding,
}))
</script>

<style scoped lang="scss">
.app-navbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}
</style>
