<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { GalleryVerticalEnd } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AUTH_CONFIG } from '@/config/auth'
import { SunMessage } from '@/utils/message'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const route = useRoute()

const username = ref('admin')
const password = ref('123456')
const isSubmitting = ref(false)

const redirectTarget = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect ? redirect : '/'
})

async function handleLogin() {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    await userStore.startLogin({
      username: username.value.trim(),
      password: password.value,
      redirect: redirectTarget.value,
    })
  } catch (error) {
    console.error('Failed to start OIDC login:', error)
    SunMessage.error('登录跳转失败，请稍后重试')
    isSubmitting.value = false
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6')">
    <form @submit.prevent="handleLogin">
      <FieldGroup>
        <div class="flex flex-col items-center gap-2 text-center">
          <div class="flex flex-col items-center gap-2 font-medium"></div>
          <h1 class="text-xl font-bold">统一认证登录</h1>
          <FieldDescription>使用 OAuth2 + OIDC 授权码模式接入认证中心</FieldDescription>
        </div>
        <Field>
          <FieldLabel for="yam-login-username">账号</FieldLabel>
          <Input
            id="yam-login-username"
            v-model="username"
            autocomplete="username"
            placeholder="admin / user"
            required
          />
        </Field>
        <Field>
          <FieldLabel for="yam-login-password">密码</FieldLabel>
          <Input
            id="yam-login-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="123456"
            required
          />
        </Field>
        <Field>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? '正在跳转认证中心...' : '登录' }}
          </Button>
        </Field>
        <FieldSeparator>或</FieldSeparator>
        <Field class="grid gap-4 sm:grid-cols-2">
          <Button variant="outline" type="button" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
            Apple 登录
          </Button>
          <Button variant="outline" type="button" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Google 登录
          </Button>
        </Field>
      </FieldGroup>
    </form>
    <FieldDescription class="px-6 text-center">
      <!--      客户端: {{ AUTH_CONFIG.clientId }}-->
    </FieldDescription>
  </div>
</template>
