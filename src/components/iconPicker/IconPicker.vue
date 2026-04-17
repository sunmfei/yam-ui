<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { iconList, iconCategories, type IconCategory } from '@/config/types/icon.data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-vue-next'
import { localCache } from '@/utils/cache/localCache'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const open = ref(false)
const keyword = ref('')
const category = ref<IconCategory | 'recent' | 'favorite'>('all')
const current = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (v) => {
    current.value = v || ''
  }
)

/** 最近 + 收藏 */
const RECENT_KEY = 'local_icon_recent'
const FAVORITE_KEY = 'local_icon_fav'

const recent = ref<string[]>(localCache.get(RECENT_KEY) || [])
const favorites = ref<string[]>(localCache.get(FAVORITE_KEY) || [])

function saveRecent(name: string) {
  recent.value = [name, ...recent.value.filter((i) => i !== name)].slice(0, 10)
  localCache.set(RECENT_KEY, recent.value)
}

function toggleFavorite(name: string) {
  favorites.value = favorites.value.includes(name)
    ? favorites.value.filter((i) => i !== name)
    : [...favorites.value, name]

  localCache.set(FAVORITE_KEY, favorites.value)
}

/** 过滤 */
const list = computed(() => {
  let res = iconList

  if (category.value === 'recent') {
    res = iconList.filter((i) => recent.value.includes(i.name))
  } else if (category.value === 'favorite') {
    res = iconList.filter((i) => favorites.value.includes(i.name))
  } else if (category.value !== 'all') {
    res = iconList.filter((i) => i.category === category.value)
  }

  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    res = res.filter((i) => {
      // 匹配英文名称
      const matchEnglish = i.name.toLowerCase().includes(kw)
      // 匹配中文关键词
      const matchChinese = i.chineseKeywords.some((keyword) => keyword.toLowerCase().includes(kw))
      return matchEnglish || matchChinese
    })
  }

  return res
})

function select(name: string) {
  current.value = name
}

function confirm() {
  emit('update:modelValue', current.value)
  saveRecent(current.value)
  open.value = false
}

function openDialog() {
  open.value = true
  keyword.value = ''
  category.value = 'all'
}
</script>

<template>
  <div>
    <!-- trigger -->
    <Button variant="outline" class="gap-2" @click="openDialog">
      <component
        :is="iconList.find((i) => i.name === modelValue)?.icon"
        v-if="modelValue"
        class="h-4 w-4"
      />
      {{ modelValue || '选择图标' }}
    </Button>

    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-175 flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>选择图标</DialogTitle>
        </DialogHeader>

        <!-- search -->
        <Input v-model="keyword" placeholder="搜索图标..." class="mb-3" />

        <!-- category -->
        <div class="flex flex-wrap gap-2 mb-3">
          <Badge
            v-for="(label, key) in iconCategories"
            :key="key"
            :variant="category === key ? 'default' : 'outline'"
            class="cursor-pointer"
            @click="category = key"
          >
            {{ label }}
          </Badge>

          <Badge variant="outline" class="cursor-pointer" @click="category = 'recent'">最近</Badge>
          <Badge variant="outline" class="cursor-pointer" @click="category = 'favorite'">
            收藏
          </Badge>
        </div>

        <!-- list -->
        <div class="flex-1 overflow-auto grid grid-cols-8 gap-2 p-2 border rounded">
          <div
            v-for="item in list"
            :key="item.name"
            class="relative p-2 border rounded cursor-pointer hover:bg-accent"
            :class="{ 'bg-primary/10 border-primary': current === item.name }"
            @click="select(item.name)"
          >
            <!-- favorite -->
            <div class="absolute top-1 right-1" @click.stop="toggleFavorite(item.name)">
              <Star
                class="h-3 w-3"
                :class="favorites.includes(item.name) ? 'text-yellow-400 fill-yellow-400' : ''"
              />
            </div>

            <component :is="item.icon" class="h-5 w-5" />
            <div class="text-[10px] truncate">{{ item.name }}</div>
          </div>
        </div>

        <!-- footer -->
        <DialogFooter>
          <Button variant="outline" @click="open = false">取消</Button>
          <Button @click="confirm">确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
