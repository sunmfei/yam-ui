<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { Motion } from 'motion-v'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})

const appStore = useAppStore()

// 根据主题调整颜色
const _skyColor = computed(() => {
  return appStore.isDark ? '#1a1a2e' : '#87CEEB'
})

const cloudColor = computed(() => {
  return appStore.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'
})

const grassColor = computed(() => {
  return appStore.isDark ? '#1b4332' : '#52b788'
})

const dandelionColor = computed(() => {
  return appStore.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.95)'
})

// 蒲公英种子配置
const dandelions = [
  {
    id: 1,
    x: '20%',
    y: '60%',
    duration: 15,
    delay: 0,
    distanceX: 300,
    distanceY: -200,
    rotation: 360,
    size: 'w-2 h-2',
  },
  {
    id: 2,
    x: '50%',
    y: '55%',
    duration: 18,
    delay: 3,
    distanceX: -250,
    distanceY: -180,
    rotation: -360,
    size: 'w-2 h-2',
  },
  {
    id: 3,
    x: '70%',
    y: '65%',
    duration: 20,
    delay: 6,
    distanceX: 280,
    distanceY: -220,
    rotation: 360,
    size: 'w-2 h-2',
  },
  {
    id: 4,
    x: '35%',
    y: '58%',
    duration: 16,
    delay: 9,
    distanceX: -200,
    distanceY: -150,
    rotation: -360,
    size: 'w-1.5 h-1.5',
  },
  {
    id: 5,
    x: '80%',
    y: '62%',
    duration: 17,
    delay: 12,
    distanceX: 320,
    distanceY: -190,
    rotation: 360,
    size: 'w-1.5 h-1.5',
  },
]

// 星星配置（仅深色模式）
const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 60}%`,
  size: Math.random() > 0.7 ? 'w-1 h-1' : 'w-0.5 h-0.5',
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 3,
}))

// 花朵配置
const flowers = [
  { id: 1, x: '10%', color: '#ef4444', size: 6, type: 'tulip' },
  { id: 2, x: '25%', color: '#f59e0b', size: 5, type: 'daisy' },
  { id: 3, x: '40%', color: '#ec4899', size: 7, type: 'rose' },
  { id: 4, x: '55%', color: '#8b5cf6', size: 6, type: 'tulip' },
  { id: 5, x: '70%', color: '#f97316', size: 5, type: 'daisy' },
  { id: 6, x: '85%', color: '#ef4444', size: 6, type: 'rose' },
  { id: 7, x: '15%', color: '#fbbf24', size: 5, type: 'daisy' },
  { id: 8, x: '60%', color: '#ec4899', size: 7, type: 'tulip' },
]

// 草地上的蒲公英配置
const groundDandelions = [
  { id: 1, x: '18%', swayDelay: 0 },
  { id: 2, x: '35%', swayDelay: 0.5 },
  { id: 3, x: '52%', swayDelay: 1 },
  { id: 4, x: '68%', swayDelay: 1.5 },
  { id: 5, x: '82%', swayDelay: 2 },
]

// 小蜜蜂配置
const bees = [
  { id: 1, startX: '20%', startY: '70%', path: 'right-up', speed: 12 },
  { id: 2, startX: '60%', startY: '75%', path: 'left-down', speed: 15 },
  { id: 3, startX: '45%', startY: '72%', path: 'circle', speed: 18 },
]

// 飞鸟配置（白天）
const birds = [
  { id: 1, startY: '25%', delay: 0, duration: 20, size: 1 },
  { id: 2, startY: '30%', delay: 5, duration: 25, size: 0.8 },
  { id: 3, startY: '20%', delay: 10, duration: 22, size: 1.2 },
]

// 流星配置（夜晚）
const shootingStars = [
  { id: 1, startX: '70%', startY: '10%', delay: 3, duration: 2 },
  { id: 2, startX: '80%', startY: '5%', delay: 8, duration: 1.5 },
  { id: 3, startX: '60%', startY: '15%', delay: 15, duration: 2.5 },
]
</script>

<template>
  <div
    :class="['absolute inset-0 overflow-hidden', $props.class]"
    :style="{
      background: appStore.isDark
        ? 'linear-gradient(to bottom, rgba(2, 6, 23, 0.85) 0%, rgba(15, 23, 42, 0.85) 40%, rgba(30, 41, 59, 0.85) 100%)'
        : 'linear-gradient(to bottom, rgba(56, 189, 248, 0.85) 0%, rgba(125, 211, 252, 0.85) 50%, rgba(186, 230, 253, 0.85) 100%)',
    }"
  >
    <!-- 白天场景：太阳 -->
    <Motion
      v-if="!appStore.isDark"
      :animate="{ scale: [1, 1.1, 1] }"
      :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut' }"
      class="absolute right-20 top-20 h-24 w-24 rounded-full bg-yellow-300 shadow-[0_0_60px_rgba(253,224,71,0.6)]"
    />

    <!-- 夜晚场景：高级月牙 -->
    <Motion
      v-else
      :animate="{
        y: [0, -15, 0],
        rotate: [0, 2, 0],
      }"
      :transition="{
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }"
      class="absolute right-20 top-20 z-10"
    >
      <!-- 外层光晕背景（不会被遮挡） -->
      <div
        class="absolute -inset-6 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-200 opacity-25 blur-2xl"
      ></div>

      <!--
        月亮核心设计说明：
        1. 使用双圆遮罩形成真实月牙
        2. 渐变模拟月光照射
        3. filter 做柔光发亮
        4. 环形山只放在亮面区域
        5. 旋转240度：特定角度
      -->
      <svg
        width="90"
        height="90"
        viewBox="0 0 100 100"
        class="relative drop-shadow-[0_0_30px_rgba(255,248,200,0.6)]"
      >
        <defs>
          <!-- 月光渐变 -->
          <radialGradient id="moonGradient" cx="40%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#fffbeb" />
            <stop offset="50%" stop-color="#fef3c7" />
            <stop offset="100%" stop-color="#fde68a" />
          </radialGradient>

          <!-- 发光滤镜 -->
          <filter id="moonGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- 月牙遮罩 - 修正方向：亮面在左侧 -->
          <mask id="crescentMask">
            <rect width="100" height="100" fill="white" />
            <circle cx="38" cy="40" r="30" fill="black" />
          </mask>
        </defs>

        <!-- 月亮主体光晕层 -->
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="url(#moonGradient)"
          opacity="0.3"
          filter="url(#moonGlow)"
        />

        <!-- 月亮主体 -->
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="url(#moonGradient)"
          mask="url(#crescentMask)"
          filter="url(#moonGlow)"
          opacity="0.95"
        />

        <!-- 月球表面纹理（只放亮面区域 - 左侧） -->
        <circle cx="35" cy="38" r="2.5" fill="#d97706" opacity="0.25" />
        <circle cx="38" cy="48" r="2" fill="#d97706" opacity="0.2" />
        <circle cx="33" cy="58" r="2.2" fill="#d97706" opacity="0.18" />
        <circle cx="40" cy="62" r="1.6" fill="#d97706" opacity="0.15" />
        <circle cx="36" cy="52" r="1.8" fill="#d97706" opacity="0.15" />
      </svg>
    </Motion>

    <!-- 夜晚场景：星星 -->
    <div v-if="appStore.isDark" class="absolute inset-0">
      <Motion
        v-for="star in stars"
        :key="star.id"
        :class="['absolute rounded-full bg-white', star.size]"
        :style="{
          left: star.x,
          top: star.y,
        }"
        :animate="{
          opacity: [0.2, 1, 0.2],
          scale: [1, 1.5, 1],
        }"
        :transition="{
          duration: star.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: star.delay,
        }"
      />
    </div>

    <!-- 夜晚场景：流星 -->
    <div v-if="appStore.isDark" class="absolute inset-0">
      <Motion
        v-for="meteor in shootingStars"
        :key="meteor.id"
        class="absolute h-0.5 w-20"
        :style="{
          left: meteor.startX,
          top: meteor.startY,
          background: 'linear-gradient(to right, transparent, white)',
          transform: 'rotate(-45deg)',
        }"
        :initial="{ opacity: 0, x: 0, y: 0 }"
        :animate="{
          opacity: [0, 1, 0],
          x: 300,
          y: 300,
        }"
        :transition="{
          duration: meteor.duration,
          repeat: Infinity,
          delay: meteor.delay,
          ease: 'easeOut',
        }"
      />
    </div>

    <!-- 白天场景：飞鸟 -->
    <div v-if="!appStore.isDark" class="absolute inset-0">
      <Motion
        v-for="bird in birds"
        :key="bird.id"
        class="absolute"
        :style="{
          left: '-50px',
          top: bird.startY,
          transform: `scale(${bird.size})`,
        }"
        :animate="{
          x: ['0vw', '100vw'],
          y: [0, -20, 10, -10, 0],
        }"
        :transition="{
          x: { duration: bird.duration, repeat: Infinity, ease: 'linear', delay: bird.delay },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }"
      >
        <!-- 鸟的形状 - V字形 -->
        <svg width="30" height="15" viewBox="0 0 30 15">
          <path
            d="M 0 10 Q 7 0 15 8 Q 23 0 30 10"
            fill="none"
            stroke="#1e293b"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </Motion>
    </div>

    <!-- 云朵层 -->
    <div class="absolute inset-0">
      <!-- 云 1 -->
      <Motion
        :initial="{ x: -200 }"
        :animate="{ x: '100vw' }"
        :transition="{ duration: 60, repeat: Infinity, ease: 'linear' }"
        class="absolute"
        :style="{ top: '10%' }"
      >
        <div
          class="h-16 w-32 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(3px)' }"
        ></div>
        <div
          class="absolute -top-6 left-6 h-20 w-20 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(3px)' }"
        ></div>
        <div
          class="absolute -top-4 left-16 h-16 w-16 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(3px)' }"
        ></div>
      </Motion>

      <!-- 云 2 -->
      <Motion
        :initial="{ x: -300 }"
        :animate="{ x: '100vw' }"
        :transition="{ duration: 80, repeat: Infinity, ease: 'linear', delay: 10 }"
        class="absolute"
        :style="{ top: '20%' }"
      >
        <div
          class="h-12 w-24 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(2px)' }"
        ></div>
        <div
          class="absolute -top-4 left-4 h-14 w-14 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(2px)' }"
        ></div>
      </Motion>

      <!-- 云 3 -->
      <Motion
        :initial="{ x: -250 }"
        :animate="{ x: '100vw' }"
        :transition="{ duration: 70, repeat: Infinity, ease: 'linear', delay: 25 }"
        class="absolute"
        :style="{ top: '15%' }"
      >
        <div
          class="h-14 w-28 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(2px)' }"
        ></div>
        <div
          class="absolute -top-5 left-5 h-16 w-16 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(2px)' }"
        ></div>
        <div
          class="absolute -top-3 left-14 h-12 w-12 rounded-full"
          :style="{ backgroundColor: cloudColor, filter: 'blur(2px)' }"
        ></div>
      </Motion>
    </div>

    <!-- 白天场景：小蜜蜂 -->
    <div class="absolute inset-0">
      <Motion
        v-for="bee in bees"
        :key="bee.id"
        class="absolute"
        :style="{ left: bee.startX, top: bee.startY }"
        :animate="{
          x:
            bee.path === 'right-up'
              ? [0, 100, 50, 0]
              : bee.path === 'left-down'
                ? [0, -80, -40, 0]
                : [0, 30, 60, 30, 0],
          y:
            bee.path === 'right-up'
              ? [0, -60, -30, 0]
              : bee.path === 'left-down'
                ? [0, 40, 20, 0]
                : [0, -20, 0, 20, 0],
          rotate: [0, 10, -10, 0],
        }"
        :transition="{
          duration: bee.speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }"
      >
        <!-- 蜜蜂身体 -->
        <div class="relative">
          <div
            class="h-3 w-4 rounded-full bg-gradient-to-r from-yellow-400 via-black to-yellow-400 shadow-sm"
          >
            <!-- 翅膀 -->
            <Motion
              :animate="{ scaleY: [1, 0.3, 1] }"
              :transition="{ duration: 0.1, repeat: Infinity }"
              class="absolute -top-2 left-0 h-2 w-3 rounded-full bg-white opacity-70"
            />
            <Motion
              :animate="{ scaleY: [1, 0.3, 1] }"
              :transition="{ duration: 0.1, repeat: Infinity }"
              class="absolute -top-2 right-0 h-2 w-3 rounded-full bg-white opacity-70"
            />
          </div>
        </div>
      </Motion>
    </div>

    <!-- 草地 -->
    <div class="absolute bottom-0 w-full">
      <!-- 主草地 -->
      <svg viewBox="0 0 1440 320" class="w-full" preserveAspectRatio="none" style="height: 200px">
        <path
          :fill="grassColor"
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,197.3C960,181,1056,171,1152,181.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,197.3C960,181,1056,171,1152,181.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,218L48,224C96,229,192,240,288,234.7C384,229,480,208,576,213.3C672,219,768,240,864,234.7C960,229,1056,197,1152,192C1248,187,1344,208,1392,218.7L1440,229L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,197.3C960,181,1056,171,1152,181.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
            "
          />
        </path>
      </svg>

      <!-- 草地上的花朵和植物 -->
      <div class="absolute bottom-0 w-full" style="height: 200px">
        <!-- 花朵 -->
        <div
          v-for="flower in flowers"
          :key="flower.id"
          class="absolute bottom-16"
          :style="{ left: flower.x }"
        >
          <!-- 花茎 -->
          <Motion
            :animate="{ rotate: [-2, 2, -2] }"
            :transition="{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: flower.id * 0.2,
            }"
            class="mx-auto h-12 w-0.5 bg-green-600 origin-bottom"
          >
            <!-- 花朵头部 -->
            <div
              class="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full"
              :style="{
                width: `${flower.size * 3}px`,
                height: `${flower.size * 3}px`,
                backgroundColor: flower.color,
              }"
            >
              <!-- 花瓣效果 -->
              <div
                v-for="i in 5"
                :key="i"
                class="absolute rounded-full"
                :style="{
                  width: `${flower.size * 2}px`,
                  height: `${flower.size * 2}px`,
                  backgroundColor: flower.color,
                  opacity: 0.7,
                  transform: `rotate(${i * 72}deg) translateY(-${flower.size}px)`,
                }"
              ></div>
              <!-- 花心 -->
              <div
                class="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300"
              ></div>
            </div>
          </Motion>
        </div>

        <!-- 草地上的蒲公英 -->
        <div
          v-for="d in groundDandelions"
          :key="d.id"
          class="absolute bottom-16"
          :style="{ left: d.x }"
        >
          <Motion
            :animate="{ rotate: [-3, 3, -3] }"
            :transition="{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: d.swayDelay }"
            class="mx-auto h-10 w-0.5 bg-green-500 origin-bottom"
          >
            <!-- 蒲公英种子球 -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2">
              <div
                class="h-6 w-6 rounded-full bg-white opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              >
                <!-- 种子细节 -->
                <div
                  v-for="i in 8"
                  :key="i"
                  class="absolute h-0.5 w-3 bg-gray-300"
                  :style="{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  }"
                ></div>
              </div>
            </div>
          </Motion>
        </div>
      </div>

      <!-- 前景草地 -->
      <svg
        viewBox="0 0 1440 320"
        class="absolute bottom-0 w-full opacity-80"
        preserveAspectRatio="none"
        style="height: 150px"
      >
        <path
          :fill="grassColor"
          d="M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,261.3C672,267,768,245,864,229.3C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,261.3C672,267,768,245,864,229.3C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,250L48,256C96,261,192,272,288,266.7C384,261,480,240,576,245.3C672,251,768,272,864,266.7C960,261,1056,229,1152,224C1248,219,1344,240,1392,250.7L1440,261L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,261.3C672,267,768,245,864,229.3C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
            "
          />
        </path>
      </svg>
    </div>

    <!-- 蒲公英种子 -->
    <div class="absolute inset-0">
      <Motion
        v-for="d in dandelions"
        :key="d.id"
        :class="['absolute rounded-full', d.size]"
        :style="{
          backgroundColor: dandelionColor,
          boxShadow: `0 0 10px ${dandelionColor}`,
          top: d.y,
          left: d.x,
        }"
        :animate="{
          x: [0, d.distanceX, 0],
          y: [0, d.distanceY, 0],
          rotate: [0, d.rotation, 0],
          opacity: [0, 1, 1, 0],
        }"
        :transition="{
          duration: d.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: d.delay,
          times: [0, 0.1, 0.9, 1],
        }"
      />
    </div>
  </div>
</template>
