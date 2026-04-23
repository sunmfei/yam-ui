<!--
文件核心作用：
企业级 iframe 容器组件（配置驱动版），支持超时、重试、心跳检测与安全隔离

模块职责划分：
- 容器层：统一卡片 UI
- 控制层：iframeConfig（配置驱动）
- 状态层：loading / error / timeout / retry
- 通信层：heartbeat 心跳检测（可选）
- 安全层：sandbox 安全策略
- 渲染层：iframe + fallback

整体结构说明：
container -> overlay -> iframe | fallback

对外能力或接口说明：
通过 iframeConfig 完全控制行为，无业务侵入

关键设计点总结：
- 配置驱动
- 自动恢复机制
- 企业级容错与安全控制
-->

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { Loader2, AlertCircle } from 'lucide-vue-next'

/**
 * 功能：iframe 配置
 * 结果：统一控制组件行为
 * 设计目的：实现完全解耦与可配置化
 */
type IframeConfig = {
  src: string
  fallbackSrc?: string
  title?: string

  height?: string | number
  width?: string | number

  loading?: boolean

  timeout?: number
  retry?: number

  sandbox?: string

  heartbeat?: {
    enable: boolean
    interval: number
    message?: unknown
  }
}

const props = withDefaults(
  defineProps<{
    config: IframeConfig
    rounded?: boolean
    shadow?: boolean
    border?: boolean
  }>(),
  {
    rounded: true,
    shadow: true,
    border: true,
  }
)

const emit = defineEmits<{
  (e: 'load'): void
  (e: 'error'): void
  (e: 'timeout'): void
  (e: 'retry', count: number): void
}>()

/**
 * 状态管理
 */
const isLoading = ref(true)
const hasError = ref(false)
const useFallback = ref(false)
const retryCount = ref(0)

const iframeRef = ref<HTMLIFrameElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null

/**
 * 容器样式
 */
const containerClasses = computed(() =>
  [
    'relative flex flex-col overflow-hidden bg-background',
    props.rounded ? 'rounded-2xl' : '',
    props.shadow ? 'shadow-md' : '',
    props.border ? 'border border-border/40' : '',
  ].join(' ')
)

/**
 * 尺寸
 */
const sizeStyle = computed(() => {
  const h =
    typeof props.config.height === 'number' ? `${props.config.height}px` : props.config.height

  const w = typeof props.config.width === 'number' ? `${props.config.width}px` : props.config.width

  return { height: h || '400px', width: w || '100%' }
})

/**
 * 启动超时
 */
function startTimeout() {
  clearTimeout(timer!)

  timer = setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false
      hasError.value = true
      useFallback.value = true
      emit('timeout')
    }
  }, props.config.timeout ?? 8000)
}

/**
 * 心跳检测
 */
function startHeartbeat() {
  const hb = props.config.heartbeat
  if (!hb?.enable) return

  clearInterval(heartbeatTimer!)

  heartbeatTimer = setInterval(() => {
    try {
      iframeRef.value?.contentWindow?.postMessage(hb.message ?? 'ping', '*')
    } catch {
      // 忽略跨域限制
    }
  }, hb.interval)
}

/**
 * 加载成功
 */
function handleLoad() {
  isLoading.value = false
  hasError.value = false
  clearTimeout(timer!)
  emit('load')

  startHeartbeat()
}

/**
 * 加载失败
 */
function handleError() {
  triggerFail()
}

/**
 * 失败统一处理
 */
function triggerFail() {
  isLoading.value = false
  hasError.value = true

  const maxRetry = props.config.retry ?? 0

  if (retryCount.value < maxRetry) {
    retryCount.value++
    emit('retry', retryCount.value)
    reload()
    return
  }

  useFallback.value = true
  clearTimeout(timer!)
  emit('error')
}

/**
 * 重载
 */
function reload() {
  isLoading.value = true
  hasError.value = false
  useFallback.value = false

  if (iframeRef.value) {
    iframeRef.value.src = props.config.src
  }

  startTimeout()
}

/**
 * 页面可见性控制（节能）
 */
function handleVisibility() {
  if (document.hidden) {
    clearInterval(heartbeatTimer!)
  } else {
    startHeartbeat()
  }
}

onMounted(() => {
  startTimeout()
  startHeartbeat()
  document.addEventListener('visibilitychange', handleVisibility)
})

onBeforeUnmount(() => {
  clearTimeout(timer!)
  clearInterval(heartbeatTimer!)
  document.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<template>
  <div :class="containerClasses" :style="sizeStyle">
    <!-- loading -->
    <div
      v-if="config.loading && isLoading"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-muted/40 backdrop-blur"
    >
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
      <span class="text-sm text-muted-foreground">加载中...</span>
    </div>

    <!-- iframe -->
    <iframe
      v-if="!useFallback"
      ref="iframeRef"
      :src="config.src"
      :title="config.title || 'iframe'"
      :sandbox="config.sandbox"
      class="w-full h-full transition-all duration-300"
      frameborder="0"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- fallback -->
    <div v-if="useFallback" class="w-full h-full flex items-center justify-center">
      <slot name="fallback">
        <div class="flex flex-col items-center gap-3 text-center">
          <AlertCircle class="w-8 h-8 text-destructive" />
          <span class="text-sm text-muted-foreground">页面不可访问</span>
          <button class="px-4 py-2 rounded-lg bg-primary text-primary-foreground" @click="reload">
            重新加载
          </button>
        </div>
      </slot>
    </div>

    <!-- fallback iframe -->
    <iframe
      v-if="useFallback && config.fallbackSrc"
      :src="config.fallbackSrc"
      class="absolute inset-0 w-full h-full"
      frameborder="0"
    />
  </div>
</template>
