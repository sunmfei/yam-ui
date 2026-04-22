<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <!-- ===== 鎼滅储妗?===== -->
    <Motion
      :initial="{ opacity: 0, y: 20, scale: 0.96 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.5 }"
    >
      <div
        class="relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300"
        :class="focus ? 'scale-[1.02] border-purple-400/40 shadow-lg shadow-purple-500/20' : ''"
      >
        <!-- 鎼滅储鍥炬爣 -->
        <span class="text-white/60">馃攳</span>

        <!-- 杈撳叆妗?-->
        <input
          v-model="keyword"
          placeholder="杈撳叆鍏抽敭璇嶅紑濮?AI 鎼滅储..."
          class="flex-1 bg-transparent outline-none text-white text-lg placeholder-white/40"
          @focus="
            openPanel = true
            focus = true
          "
          @blur="onBlur"
          @input="onInput"
          @keydown.down.prevent="moveDown"
          @keydown.up.prevent="moveUp"
          @keydown.enter="selectActive"
        />

        <!-- 娓呯┖ -->
        <button v-if="keyword" class="text-white/60 hover:text-white" @click="clear">鉁?/button>

        <!-- 鎼滅储 -->
        <button
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500"
          @click="search(keyword)"
        >
          鎼滅储
        </button>
      </div>
    </Motion>

    <!-- ===== 涓嬫媺闈㈡澘 ===== -->
    <Motion
      v-if="openPanel && suggestions.length"
      :initial="{ opacity: 0, y: -10 }"
      :animate="{ opacity: 1, y: 0 }"
      class="absolute left-0 right-0 mt-3 rounded-2xl overflow-hidden bg-black/70 backdrop-blur-xl border border-white/10"
    >
      <div
        v-for="(item, index) in suggestions"
        :key="item"
        :class="[
          'px-4 py-3 cursor-pointer transition',
          index === activeIndex ? 'bg-white/10' : 'hover:bg-white/5',
        ]"
        @mousedown.prevent="select(item)"
      >
        {{ item }}
      </div>

      <!-- 鐑�瘝 -->
      <div class="border-t border-white/10 px-4 py-2 text-xs text-white/50">
        鐑�瘝锛?
        <span
          v-for="t in hotList"
          :key="t"
          class="ml-2 cursor-pointer hover:text-white"
          @mousedown.prevent="select(t)"
        >
          {{ t }}
        </span>
      </div>
    </Motion>
  </div>
</template>

<script setup lang="ts">
/**
 * AI 鎼滅储妗嗛€昏緫锛?
 * - keyword锛氳緭鍏ュ唴瀹?
 * - suggestions锛氳仈鎯崇粨鏋?
 * - hotList锛氱儹璇?
 * - history锛氬巻鍙茶�褰?
 * - activeIndex锛氶敭鐩橀€変腑绱㈠紩
 * - openPanel锛氭帶鍒朵笅鎷夐潰鏉?
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
 * 妯℃嫙 AI 鑱旀兂锛堜綘鍚庨潰鍙�互鎹?API锛?
 */
const suggestions = ref<string[]>([])

const mockAI = (val: string) => {
  if (!val) return []
  return [val + ' 教程', val + ' 面试', val + ' 原理', val + ' 最佳实践', val + ' 实战项目']
}

/**
 * 杈撳叆瑙﹀彂鑱旀兂
 */
const onInput = () => {
  suggestions.value = mockAI(keyword.value)
  activeIndex.value = -1
}

/**
 * 閿�洏 鈫?
 */
const moveDown = () => {
  if (activeIndex.value < suggestions.value.length - 1) {
    activeIndex.value++
  }
}

/**
 * 閿�洏 鈫?
 */
const moveUp = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

/**
 * 鍥炶溅閫夋嫨
 */
const selectActive = () => {
  const val = suggestions.value[activeIndex.value] || keyword.value
  search(val)
}

/**
 * 鐐瑰嚮閫夋嫨
 */
const select = (val: string) => {
  search(val)
}

/**
 * 鎼滅储閫昏緫
 */
const search = (val: string) => {
  if (!val.trim()) return

  keyword.value = val
  openPanel.value = false

  history.value = [val, ...history.value.filter((i) => i !== val)].slice(0, 8)

  emit('search', val)
}

/**
 * 娓呯┖
 */
const clear = () => {
  keyword.value = ''
  suggestions.value = []
}

/**
 * 澶辩劍寤惰繜鍏抽棴锛堥伩鍏嶇偣鍑讳涪澶憋級
 */
const onBlur = () => {
  setTimeout(() => {
    openPanel.value = false
    focus.value = false
  }, 150)
}
</script>
