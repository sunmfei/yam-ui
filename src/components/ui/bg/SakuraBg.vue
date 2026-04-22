<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SakuraIcon from '@/components/ui/icon/SakuraIcon.vue'

interface Props {
  /** 容器宽度 */
  width?: string | number
  /** 容器高度 */
  height?: string | number
  /** 樱花数量（建议 30-150） */
  count?: number
  /** 飘落速度（秒，建议 6-12） */
  fallSpeed?: number
  /** 风力强度（像素，建议 50-200） */
  windStrength?: number
  /** 风向 (left | right | none) */
  windDirection?: 'left' | 'right' | 'none'
  /** 落地停留时间（秒），0 表示不循环 */
  stayTime?: number
  /** 樱花颜色（顶部-浅色） */
  colorTop?: string
  /** 樱花颜色（底部-深色） */
  colorBottom?: string
  /** 是否显示渐变蒙版 */
  showGradientMask?: boolean
  /** 渐变起始透明度 */
  gradientStartOpacity?: number
  /** 渐变结束透明度 */
  gradientEndOpacity?: number
  /** 额外类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  count: 80,
  fallSpeed: 8,
  windStrength: 120,
  windDirection: 'right',
  stayTime: 2,
  colorTop: '',
  colorBottom: '',
  showGradientMask: true,
  gradientStartOpacity: 0.3,
  gradientEndOpacity: 0.9,
  class: '',
})

// 樱花粒子接口
interface Sakura {
  id: number
  x: number // 水平位置（百分比）
  y: number // 垂直位置（百分比）
  size: number // 大小
  fallSpeed: number // 下落速度
  windOffset: number // 风力偏移
  rotation: number // 旋转角度
  rotationSpeed: number // 旋转速度
  opacity: number // 当前透明度
  landed: boolean // 是否已落地
  landTime: number // 落地时间戳
}

const sakuras = ref<Sakura[]>([])
let animationFrameId: number | null = null
let lastTimestamp = 0

/**
 * 创建单个樱花
 */
function createSakura(id: number, randomY = false): Sakura {
  // 根据风向计算起始位置和风力
  const getWindParams = () => {
    if (props.windDirection === 'none') {
      return { startX: Math.random() * 100, windForce: 0 }
    }

    const direction = props.windDirection === 'left' ? -1 : 1
    const windForce = direction * props.windStrength

    // 关键：风从左来，樱花从右侧出现；风从右来，樱花从左侧出现
    let startX
    if (props.windDirection === 'left') {
      // 左风：从右侧 60%-100% 区域出现
      startX = 60 + Math.random() * 40
    } else {
      // 右风：从左侧 0%-40% 区域出现
      startX = Math.random() * 40
    }

    return { startX, windForce }
  }

  const { startX, windForce } = getWindParams()

  return {
    id,
    x: startX,
    y: randomY ? Math.random() * -100 : -10 - Math.random() * 50, // 从上方不同位置开始
    size: Math.random() * 10 + 8, // 8-18px
    fallSpeed: Math.random() * 3 + props.fallSpeed - 1.5, // 基础速度 ± 1.5s
    windOffset: windForce * (0.8 + Math.random() * 0.4), // 风力影响，80%-120%
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 90, // -45 到 45 deg/s
    opacity: 0,
    landed: false,
    landTime: 0,
  }
}

/**
 * 生成樱花粒子
 */
function generateSakuras() {
  sakuras.value = Array.from({ length: props.count }, (_, i) => createSakura(i, true))
}

/**
 * 动画更新
 */
function animate(timestamp: number) {
  if (!lastTimestamp) lastTimestamp = timestamp
  const deltaTime = (timestamp - lastTimestamp) / 1000 // 转换为秒
  lastTimestamp = timestamp

  sakuras.value.forEach((sakura) => {
    if (!sakura.landed) {
      // 下落阶段
      sakura.y += (deltaTime / sakura.fallSpeed) * 100 // 根据速度下落

      // 水平移动（风力持续推动 + 轻微摇摆）
      const sway = Math.sin(timestamp * 0.002 + sakura.id) * 10 // 轻微摇摆 ±10px
      const windMovement = (sakura.windOffset / window.innerWidth) * 100 * deltaTime
      sakura.x += windMovement + (sway / window.innerWidth) * 100 * deltaTime

      // 旋转
      sakura.rotation += sakura.rotationSpeed * deltaTime

      // 根据位置计算透明度（渐变效果）
      const progress = Math.max(0, Math.min(1, (sakura.y + 50) / 150))
      sakura.opacity =
        props.gradientStartOpacity +
        (props.gradientEndOpacity - props.gradientStartOpacity) * progress

      // 检测是否落地或飘出屏幕
      if (sakura.y >= 95 || sakura.x < -20 || sakura.x > 120) {
        sakura.y = 95
        sakura.landed = true
        sakura.landTime = timestamp
      }
    } else {
      // 落地阶段
      const stayedTime = (timestamp - sakura.landTime) / 1000 // 已停留时间（秒）

      if (props.stayTime > 0 && stayedTime >= props.stayTime) {
        // 停留时间到，重置到顶部（不同高度，形成连续飘落）
        Object.assign(sakura, createSakura(sakura.id, false))
      } else {
        // 渐隐效果（最后 0.5 秒）
        if (props.stayTime > 0.5) {
          const fadeProgress = Math.max(0, (stayedTime - (props.stayTime - 0.5)) / 0.5)
          sakura.opacity *= 1 - fadeProgress
        }
      }
    }
  })

  // eslint-disable-next-line no-undef
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  generateSakuras()
  // eslint-disable-next-line no-undef
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrameId) {
    // eslint-disable-next-line no-undef
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div
    :class="['relative overflow-hidden', $props.class]"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }"
  >
    <!-- 樱花粒子 -->
    <div
      v-for="sakura in sakuras"
      :key="sakura.id"
      class="absolute pointer-events-none"
      :style="{
        left: `${sakura.x}%`,
        top: `${sakura.y}%`,
        width: `${sakura.size}px`,
        height: `${sakura.size}px`,
        transform: `rotate(${sakura.rotation}deg)`,
        opacity: sakura.opacity,
        transition: 'opacity 0.3s ease',
      }"
    >
      <!-- 樱花图标组件 -->
      <SakuraIcon :size="sakura.size" :shadow="true" :instance-id="sakura.id" />
    </div>

    <!-- 渐变蒙版层（从上到下颜色过渡） -->
    <div
      v-if="showGradientMask"
      class="absolute inset-0 pointer-events-none"
      :style="{
        background: `linear-gradient(to bottom,
          rgba(255,255,255,${1 - gradientStartOpacity}) 0%,
          rgba(255,255,255,${1 - gradientEndOpacity}) 100%)`,
      }"
    />
  </div>
</template>
