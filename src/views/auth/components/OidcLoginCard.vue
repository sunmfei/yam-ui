<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ShieldCheck, UserRound } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

const scopeText = computed(() => AUTH_CONFIG.scopes.join(' '))

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
    <Card
      class="overflow-hidden border-white/60 bg-white/90 p-0 shadow-2xl shadow-slate-950/10 backdrop-blur"
    >
      <CardContent class="grid p-0 lg:grid-cols-[1.05fr_0.95fr]">
        <form class="p-6 md:p-8" @submit.prevent="handleLogin">
          <FieldGroup>
            <div class="flex flex-col gap-3 text-center lg:text-left">
              <div
                class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30 lg:mx-0"
              >
                <ShieldCheck class="size-6" />
              </div>
              <div>
                <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
                  YAM 统一认证登录
                </h1>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                  使用 OAuth2 + OIDC 授权码模式接入认证中心，前端只负责发起授权，不直接处理
                  `client_secret`。
                </p>
              </div>
            </div>

            <Field>
              <FieldLabel for="yam-login-username">测试账号</FieldLabel>
              <Input
                id="yam-login-username"
                v-model="username"
                autocomplete="username"
                placeholder="admin / user"
              />
              <FieldDescription>
                输入认证中心账号，前端会调用 `POST /login` 完成登录。
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel for="yam-login-password">测试密码</FieldLabel>
              <Input
                id="yam-login-password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="123456"
              />
            </Field>

            <Field>
              <Button type="submit" class="h-11 w-full" :disabled="isSubmitting">
                {{ isSubmitting ? '正在跳转认证中心...' : '前往认证中心登录' }}
              </Button>
            </Field>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-white/90">
              对接摘要
            </FieldSeparator>

            <div
              class="grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-600"
            >
              <div class="flex items-start gap-3">
                <UserRound class="mt-0.5 size-4 text-sky-600" />
                <div>
                  <p class="font-medium text-slate-900">登录完成后自动回跳</p>
                  <p class="mt-1 break-all text-xs text-slate-500">{{ redirectTarget }}</p>
                </div>
              </div>
              <div>
                <p class="font-medium text-slate-900">客户端</p>
                <p class="mt-1 text-xs text-slate-500">{{ AUTH_CONFIG.clientId }}</p>
              </div>
              <div>
                <p class="font-medium text-slate-900">Scopes</p>
                <p class="mt-1 break-all text-xs text-slate-500">{{ scopeText }}</p>
              </div>
            </div>
          </FieldGroup>
        </form>

        <div
          class="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top,#dbeafe,transparent_42%),linear-gradient(160deg,#0f172a_0%,#0f766e_55%,#cffafe_100%)] p-8 text-white lg:flex lg:flex-col lg:justify-between"
        >
          <div class="absolute inset-0 opacity-30">
            <div class="absolute left-10 top-10 size-40 rounded-full bg-white/20 blur-3xl" />
            <div class="absolute bottom-0 right-0 size-56 rounded-full bg-cyan-200/30 blur-3xl" />
          </div>
          <div class="relative space-y-4">
            <div
              class="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs tracking-[0.24em] text-cyan-50"
            >
              AUTH CENTER
            </div>
            <h2 class="max-w-sm text-3xl font-semibold leading-tight">
              统一会话、回调换 token、前端只缓存系统态认证信息。
            </h2>
            <p class="max-w-md text-sm leading-6 text-cyan-50/85">
              当前页面只做授权入口。认证成功后会在回调页完成 state 校验、code 换
              token、拉取用户信息，再恢复到原始业务地址。
            </p>
          </div>

          <div
            class="relative grid gap-3 rounded-3xl border border-white/15 bg-black/15 p-5 backdrop-blur-sm"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="text-cyan-50/80">Issuer</span>
              <span class="max-w-[15rem] truncate font-medium text-white">
                {{ AUTH_CONFIG.issuer }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-cyan-50/80">Callback</span>
              <span class="font-medium text-white">/callback</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-cyan-50/80">Session Cache</span>
              <span class="font-medium text-white">systemCache</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
