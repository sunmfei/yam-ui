<template>
  <div class="relative w-full max-w-2xl mx-auto">

    <!-- ===== 搜索框 ===== -->
    <Motion
      :initial="{ opacity: 0, y: 20, scale: 0.96 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.5 }"
    >
      <div
        class="relative flex items-center gap-3 px-5 py-4 rounded-2xl
               bg-white/10 backdrop-blur-xl border border-white/20
               transition-all duration-300"
        :class="focus ? 'scale-[1.02] border-purple-400/40 shadow-lg shadow-purple-500/20' : ''"
      >

        <!-- 搜索图标 -->
        <span class="text-white/60">🔍</span>

        <!-- 输入框 -->
        <input
          v-model="keyword"
          @focus="openPanel = true; focus = true"
          @blur="onBlur"
          @input="onInput"
          @keydown.down.prevent="moveDown"
          @keydown.up.prevent="moveUp"
          @keydown.enter="selectActive"
          placeholder="输入关键词开始 AI 搜索..."
          class="flex-1 bg-transparent outline-none text-white text-lg placeholder-white/40"
        />

        <!-- 清空 -->
        <button
          v-if="keyword"
          @click="clear"
          class="text-white/60 hover:text-white"
        >
          ✕
        </button>

        <!-- 搜索 -->
        <button
          @click="search(keyword)"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500"
        >
          搜索
        </button>
      </div>
    </Motion>

    <!-- ===== 下拉面板 ===== -->
    <Motion
      v-if="openPanel && suggestions.length"
      :initial="{ opacity: 0, y: -10 }"
      :animate="{ opacity: 1, y: 0 }"
      class="absolute left-0 right-0 mt-3 rounded-2xl overflow-hidden
             bg-black/70 backdrop-blur-xl border border-white/10"
    >
      <div
        v-for="(item, index) in suggestions"
        :key="item"
        @mousedown.prevent="select(item)"
        :class="[
          'px-4 py-3 cursor-pointer transition',
          index === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
        ]"
      >
        {{ item }}
      </div>

      <!-- 热词 -->
      <div class="border-t border-white/10 px-4 py-2 text-xs text-white/50">
        热词：
        <span
          v-for="t in hotList"
          :key="t"
          @mousedown.prevent="select(t)"
          class="ml-2 cursor-pointer hover:text-white"
        >
          {{ t }}
        </span>
      </div>
    </Motion>

  </div>
</template>

<script setup lang="ts">
/**
 * AI 搜索框逻辑：
 * - keyword：输入内容
 * - suggestions：联想结果
 * - hotList：热词
 * - history：历史记录
 * - activeIndex：键盘选中索引
 * - openPanel：控制下拉面板
 */

import { ref } from 'vue'
import { Motion } from 'motion-v'

const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

const keyword = ref('')
const focus = ref(false)

const openPanel = ref(false)
const activeIndex = ref(-1)

const hotList = ['Spring Boot', 'Vue3', 'Redis', 'MySQL', 'Docker']

const history = ref<string[]>([])

/**
 * 模拟 AI 联想（你后面可以换 API）
 */
const suggestions = ref<string[]>([])

const mockAI = (val: string) => {
  if (!val) return []
  return [
    val + ' 教程',
    val + ' 面试题',
    val + ' 原理',
    val + ' 最佳实践',
    val + ' 实战项目'
  ]
}

/**
 * 输入触发联想
 */
const onInput = () => {
  suggestions.value = mockAI(keyword.value)
  activeIndex.value = -1
}

/**
 * 键盘 ↓
 */
const moveDown = () => {
  if (activeIndex.value < suggestions.value.length - 1) {
    activeIndex.value++
  }
}

/**
 * 键盘 ↑
 */
const moveUp = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

/**
 * 回车选择
 */
const selectActive = () => {
  const val = suggestions.value[activeIndex.value] || keyword.value
  search(val)
}

/**
 * 点击选择
 */
const select = (val: string) => {
  search(val)
}

/**
 * 搜索逻辑
 */
const search = (val: string) => {
  if (!val.trim()) return

  keyword.value = val
  openPanel.value = false

  history.value = [val, ...history.value.filter(i => i !== val)].slice(0, 8)

  emit('search', val)
}

/**
 * 清空
 */
const clear = () => {
  keyword.value = ''
  suggestions.value = []
}

/**
 * 失焦延迟关闭（避免点击丢失）
 */
const onBlur = () => {
  setTimeout(() => {
    openPanel.value = false
    focus.value = false
  }, 150)
}
</script>
