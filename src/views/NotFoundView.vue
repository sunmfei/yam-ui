<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <h1 class="mb-4 text-6xl font-bold text-gray-800 dark:text-gray-200">404</h1>
    <p class="mb-8 text-xl text-gray-600 dark:text-gray-400">Oops! Page not found</p>
    <button
      @click="goHome"
      class="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
    >
      Go Home
    </button>
  </div>
</template>
