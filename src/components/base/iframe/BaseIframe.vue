<!--
文件核心作用：
企业级 iframe 容器组件（增强版），支持智能错误检测、快速失败与优雅降级

模块职责划分：
- 容器层：统一卡片 UI
- 控制层：iframeConfig（配置驱动）
- 状态层：loading / error / timeout / retry
- 检测层：主动探测 + 被动监听
- 安全层：sandbox 安全策略
- 渲染层：iframe + fallback

整体结构说明：
container -> overlay -> iframe | fallback

对外能力或接口说明：
通过 iframeConfig 完全控制行为，无业务侵入

关键设计点总结：
- 配置驱动
- 多层错误检测（超时 + 内容检测 + 事件监听）
- 快速失败机制（3秒超时）
- 优雅降级展示
-->

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'
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

  timeout?: number // 超时时间（毫秒），默认 3000
  retry?: number // 重试次数，默认 0

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
const iframeKey = ref(0) // 用于强制重建 iframe

const iframeRef = ref<HTMLIFrameElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let checkTimer: ReturnType<typeof setTimeout> | null = null
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
 * 启动超时检测
 */
function startTimeout() {
  clearTimeout(timer!)

  const timeout = props.config.timeout ?? 3000 // 默认 3 秒快速失败

  timer = setTimeout(() => {
    if (isLoading.value) {
      console.warn('[BaseIframe] ⏱️ 加载超时:', props.config.src)
      triggerFail()
    }
  }, timeout)
}

/**
 * 延迟检查 iframe 内容
 */
function scheduleContentCheck() {
  clearTimeout(checkTimer!)

  // 在 iframe load 后延迟检查，给浏览器时间渲染错误页面
  checkTimer = setTimeout(() => {
    checkIframeContent()
  }, 500)
}

/**
 * 检测 iframe 内容是否包含错误
 */
function checkIframeContent() {
  try {
    const iframe = iframeRef.value
    if (!iframe) return

    // 尝试访问 iframe 文档
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) {
      // 无法访问，可能是跨域或加载失败
      console.warn('[BaseIframe] 🔒 无法访问 iframe 文档（可能跨域或加载失败）')
      return
    }

    // 检查文档标题和正文
    const title = doc.title?.toLowerCase() || ''
    const bodyText = doc.body?.innerText?.toLowerCase() || ''
    const fullText = `${title} ${bodyText}`

    // 错误关键词列表
    const errorKeywords = [
      'refused',
      'error',
      '拒绝',
      '无法访问',
      'connection refused',
      'err_connection_refused',
      'err_connection_timed_out',
      'err_name_not_resolved',
      "site can't be reached",
      '此网站无法访问',
      '连接已重置',
    ]

    // 检查是否包含错误关键词
    const hasErrorKeyword = errorKeywords.some((keyword) => fullText.includes(keyword))

    if (hasErrorKeyword) {
      console.warn('[BaseIframe] ❌ 检测到错误内容:', {
        title: doc.title,
        src: props.config.src,
      })
      triggerFail()
    } else if (isLoading.value) {
      // 没有检测到错误，标记为加载成功
      console.log('[BaseIframe] ✅ 加载成功:', props.config.src)
      isLoading.value = false
      hasError.value = false
      clearTimeout(timer!)
      emit('load')
      startHeartbeat()
    }
  } catch (error) {
    // 跨域限制，无法读取内容
    console.warn('[BaseIframe] 🔒 跨域限制，无法检测内容:', error)
    // 如果还在加载中，假设成功（因为无法检测）
    if (isLoading.value) {
      isLoading.value = false
      clearTimeout(timer!)
      emit('load')
      startHeartbeat()
    }
  }
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
 * iframe 加载完成事件
 */
function handleLoad() {
  // 延迟检查内容，区分正常页面和错误页面
  scheduleContentCheck()
}

/**
 * iframe 加载错误事件
 */
function handleError() {
  console.warn('[BaseIframe] ⚠️ 触发 error 事件:', props.config.src)
  triggerFail()
}

/**
 * 失败统一处理
 */
function triggerFail() {
  if (hasError.value) return // 防止重复触发

  isLoading.value = false
  hasError.value = true

  const maxRetry = props.config.retry ?? 0

  if (retryCount.value < maxRetry) {
    retryCount.value++
    console.log(`[BaseIframe] 🔄 重试 (${retryCount.value}/${maxRetry}):`, props.config.src)
    emit('retry', retryCount.value)
    reload()
    return
  }

  useFallback.value = true
  clearTimeout(timer!)
  clearTimeout(checkTimer!)
  emit('error')
}

/**
 * 在新窗口打开
 */
function openInNewTab() {
  window.open(props.config.src, '_blank')
}

/**
 * 重载
 */
function reload() {
  isLoading.value = true
  hasError.value = false
  useFallback.value = false

  // 使用 key 强制重建 iframe，避免 chrome-error:// 跨域问题
  iframeKey.value++

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

// 监听 src 变化，重新开始加载
watch(
  () => props.config.src,
  () => {
    if (!useFallback.value) {
      reload()
    }
  }
)

onMounted(() => {
  startTimeout()
  startHeartbeat()
  document.addEventListener('visibilitychange', handleVisibility)
})

onBeforeUnmount(() => {
  clearTimeout(timer!)
  clearTimeout(checkTimer!)
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
      :key="iframeKey"
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
    <div v-if="useFallback" class="w-full h-full flex items-center justify-center bg-muted/20">
      <slot name="fallback">
        <div class="flex flex-col items-center gap-3 text-center px-6 py-8">
          <div class="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
            <AlertCircle class="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">暂时无法预览此网站</p>
            <p class="text-xs text-muted-foreground/60">可能是网络问题或该网站限制了嵌入访问</p>
          </div>
          <button
            class="px-4 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 text-sm flex items-center gap-1.5"
            @click="openInNewTab"
          >
            <span>在新窗口打开</span>
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
