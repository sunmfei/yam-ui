<template>
  <!--
    搜索框外层：
    - 居中布局
    - Motion 控制入场动画
  -->
  <Motion
    :initial="{ opacity: 0, y: 20, scale: 0.96 }"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :transition="{ duration: 0.5 }"
  >
    <div class="w-full max-w-3xl mx-auto">
      <!-- ===== 搜索主体 ===== -->
      <div
        class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300"
        :class="focus ? 'scale-[1.02] border-cyan-400/40 shadow-lg shadow-cyan-500/20' : ''"
      >
        <!-- 搜索图标 -->
        <span class="text-white/60">🔍</span>

        <!-- 输入�?-->
        <input
          v-model="keyword"
          placeholder="输入关键词开始搜�?.."
          class="flex-1 bg-transparent outline-none text-white text-lg placeholder-white/40"
          @focus="focus = true"
          @blur="focus = false"
          @keyup.enter="doSearch"
        />

        <!-- 搜索引擎选择 -->
        <select
          v-model="engine"
          class="bg-white/10 text-white text-sm px-3 py-2 rounded-lg border border-white/20 outline-none"
        >
          <option value="google">Google</option>
          <option value="bing">Bing</option>
          <option value="baidu">Baidu</option>
        </select>

        <!-- 搜索按钮 -->
        <button
          class="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 active:scale-95 transition"
          @click="doSearch"
        >
          搜索
        </button>
      </div>

      <!-- ===== 快捷提示 ===== -->
      <div class="mt-3 text-xs text-white/40 text-center">
        支持 Google / Bing / Baidu 自由切换搜索引擎
      </div>
    </div>
  </Motion>
</template>

<script setup lang="ts">
/**
 * 搜索框核心逻辑�?
 * 1. keyword：输入内�?
 * 2. engine：搜索引擎选择
 * 3. focus：控制动效状�?
 * 4. doSearch：根据引擎拼�?URL 跳转
 */

import { ref } from 'vue'
import { Motion } from 'motion-v'

const keyword = ref('')
const engine = ref<'google' | 'bing' | 'baidu'>('google')
const focus = ref(false)

/**
 * 搜索引擎 URL 映射
 */
const engineMap = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
}

/**
 * 执行搜索
 */
const doSearch = () => {
  if (!keyword.value.trim()) return

  const base = engineMap[engine.value]
  window.open(base + encodeURIComponent(keyword.value), '_blank')
}
</script>
