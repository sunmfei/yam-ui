<template>
  <!--
    文件核心作用：Shadcn 风格搜索组件（纯 UI + 事件透传�?
    模块职责划分�?
      1. 输入控制
      2. 引擎选择 UI
      3. 事件抛出
    整体结构说明�?
      居中容器 + 极简输入卡片
    对外能力�?
      - search 事件
      - input / focus / blur / engine-change
    关键设计点：
      - 不内置业务逻辑
      - 中性色视觉体系
      - �?shadcn 风格统一
  -->
  <div class="w-full max-w-[28rem] sm:max-w-[36rem] mx-auto px-2 sm:px-0">
    <div
      class="flex flex-wrap sm:flex-nowrap items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border shadow-sm transition-all duration-200"
      :class="focus ? 'ring-1 ring-border shadow-md' : 'hover:shadow-md'"
    >
      <!-- 图标 -->
      <div class="text-muted-foreground">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <!-- 输入 -->
      <input
        ref="inputRef"
        v-model="keyword"
        type="text"
        class="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
        @input="handleInput"
      />

      <!-- 引擎选择 -->
      <div v-if="engines.length" class="relative engine-selector shrink-0">
        <button
          class="px-2 py-1 text-xs rounded-md bg-muted text-foreground hover:bg-accent transition"
          @click="toggleMenu"
        >
          {{ currentEngine?.name }}
        </button>

        <div
          v-if="showMenu"
          class="absolute right-0 top-full mt-2 w-40 bg-popover border border-border rounded-md shadow-md z-50 overflow-hidden"
        >
          <button
            v-for="eng in engines"
            :key="eng.id"
            class="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent"
            @click="selectEngine(eng)"
          >
            {{ eng.name }}
          </button>
        </div>
      </div>

      <!-- 清除 -->
      <button v-if="keyword" class="text-muted-foreground hover:text-foreground" @click="clear">
        �?
      </button>

      <!-- 搜索 -->
      <button
        class="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition shrink-0"
        @click="handleSearch"
      >
        搜索
      </button>
    </div>

    <!-- 快捷提示 -->
    <div class="mt-3 text-center text-xs text-muted-foreground px-2">
      <span class="hidden sm:inline">Enter 搜索 · / 聚焦 · Esc 清除</span>
      <span class="sm:hidden">点击搜索按钮</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 文件核心作用：搜索组件逻辑（受控）
 * 模块职责�?
 * 1. 输入状态管�?
 * 2. 引擎选择管理
 * 3. 事件透传
 *
 * 对外能力�?
 * - search(keyword, engine)
 * - engine-change
 *
 * 设计点：
 * - 不处理跳�?
 * - 所有数据外部控�?
 */

import { ref, watch, onMounted, onUnmounted } from 'vue'

export interface SearchEngine {
  id: string
  name: string
  url: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    engines: SearchEngine[]
    currentEngineId?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: '搜索内容...',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'search', keyword: string, engine: SearchEngine): void
  (e: 'engine-change', engine: SearchEngine): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const keyword = ref(props.modelValue)
const focus = ref(false)
const showMenu = ref(false)

watch(
  () => props.modelValue,
  (v) => (keyword.value = v)
)
watch(keyword, (v) => emit('update:modelValue', v))

const currentEngine = ref<SearchEngine | undefined>(
  props.engines.find((e) => e.id === props.currentEngineId) || props.engines[0]
)

const handleFocus = () => {
  focus.value = true
}

const handleBlur = () => {
  setTimeout(() => {
    focus.value = false
  }, 150)
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.engine-selector')) {
    showMenu.value = false
  }
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const selectEngine = (eng: SearchEngine) => {
  currentEngine.value = eng
  showMenu.value = false
  emit('engine-change', eng)
}

const handleSearch = () => {
  if (!keyword.value.trim() || !currentEngine.value) return
  emit('search', keyword.value.trim(), currentEngine.value)
}

const handleInput = () => {
  emit('update:modelValue', keyword.value)
}

const clear = () => {
  keyword.value = ''
  inputRef.value?.focus()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === '/' && document.activeElement !== inputRef.value) {
    e.preventDefault()
    inputRef.value?.focus()
  }
  if (e.key === 'Escape') clear()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>
