<script setup lang="ts">
/**
 * SidebarFooterWrapper - 侧边栏底部包装组件
 */
import SidebarUser from './SidebarUser.vue'

const user = {
  name: 'Admin',
  email: 'admin@example.com',
  avatar: '/avatars/admin.jpg',
}
</script>

<template>
  <SidebarUser :user="user" />
</template>
