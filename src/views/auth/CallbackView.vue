<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LoaderCircle } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SunMessage } from '@/utils/message'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const code = typeof route.query.code === 'string' ? route.query.code : ''
  const state = typeof route.query.state === 'string' ? route.query.state : ''

  if (!code || !state) {
    errorMessage.value = '认证回调缺少 code 或 state 参数'
    loading.value = false
    return
  }

  try {
    const redirect = await userStore.handleCallback(code, state)
    SunMessage.success('登录成功，正在进入系统')
    await router.replace(redirect)
  } catch (error) {
    console.error('Failed to complete login callback:', error)
    errorMessage.value = error instanceof Error ? error.message : '登录回调处理失败'
    SunMessage.error(errorMessage.value)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-svh items-center justify-center px-6 py-10">
    <Card
      class="w-full max-w-lg border-white/60 bg-white/90 shadow-2xl shadow-slate-950/10 backdrop-blur"
    >
      <CardHeader class="text-center">
        <CardTitle>{{ loading ? '正在完成登录' : '登录状态' }}</CardTitle>
        <CardDescription>
          {{
            loading ? '正在校验授权状态并换取令牌，请稍候。' : errorMessage || '认证流程已完成。'
          }}
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col items-center gap-4 pb-8">
        <LoaderCircle v-if="loading" class="size-9 animate-spin text-sky-600" />
        <p v-else-if="errorMessage" class="text-center text-sm text-red-500">{{ errorMessage }}</p>
        <p v-else class="text-sm text-slate-500">正在跳转...</p>
      </CardContent>
    </Card>
  </div>
</template>
