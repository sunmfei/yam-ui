<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number
  shadow?: boolean
  instanceId?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  shadow: false,
  instanceId: '',
})

// 生成唯一 ID，防止多个实例冲突
const gradId = computed(() => `sakura-petal-grad-${props.instanceId}`)
const filterId = computed(() => `sakura-shadow-filter-${props.instanceId}`)
const petalId = computed(() => `sakura-petal-path-${props.instanceId}`)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- 花瓣渐变 -->
      <radialGradient :id="gradId" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#fff5f7" />
        <stop offset="55%" stop-color="#ff9eb5" />
        <stop offset="100%" stop-color="#ff6f91" />
      </radialGradient>

      <!-- 阴影滤镜 -->
      <filter v-if="shadow" :id="filterId" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.25" />
      </filter>

      <!-- 花瓣路径（心形缺口） -->
      <path
        :id="petalId"
        d="M12 2 C8 2 5 5 5 8 C5 11 8 14 12 18 C16 14 19 11 19 8 C19 5 16 2 12 2 Z M12 5 C13.5 5 15 6.5 15 8 C15 9.5 13.5 11 12 12 C10.5 11 9 9.5 9 8 C9 6.5 10.5 5 12 5 Z"
      />
    </defs>

    <!-- 绘制 5 个花瓣 -->
    <g :filter="shadow ? `url(#${filterId})` : ''" transform="translate(0, 1)">
      <use :href="`#${petalId}`" :fill="`url(#${gradId})`" transform="rotate(0 12 10)" />
      <use :href="`#${petalId}`" :fill="`url(#${gradId})`" transform="rotate(72 12 10)" />
      <use :href="`#${petalId}`" :fill="`url(#${gradId})`" transform="rotate(144 12 10)" />
      <use :href="`#${petalId}`" :fill="`url(#${gradId})`" transform="rotate(216 12 10)" />
      <use :href="`#${petalId}`" :fill="`url(#${gradId})`" transform="rotate(288 12 10)" />

      <!-- 花蕊 -->
      <circle cx="12" cy="10" r="1.5" fill="#ffd700" opacity="0.9" />
      <circle cx="11" cy="9" r="0.5" fill="#ff8c00" />
      <circle cx="13" cy="9" r="0.5" fill="#ff8c00" />
      <circle cx="12" cy="11.5" r="0.5" fill="#ff8c00" />
    </g>
  </svg>
</template>
