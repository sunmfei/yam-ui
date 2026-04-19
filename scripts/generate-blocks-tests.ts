import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BLOCKS_DIR = path.join(__dirname, '../src/components/blocks')
const OUTPUT_DIR = path.join(__dirname, '../src/views/panel/admin/components/blocks')

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 获取所有 blocks
const blocks = fs.readdirSync(BLOCKS_DIR).filter((item) => {
  const fullPath = path.join(BLOCKS_DIR, item)
  return fs.statSync(fullPath).isDirectory() && !item.startsWith('_')
})

console.log(`📦 发现 ${blocks.length} 个 blocks`)

// 为每个 block 创建测试组件
for (const blockName of blocks) {
  const componentName = blockName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const content = `<script setup lang="ts">
/**
 * ${componentName} - ${blockName} Block 测试
 */
import BlockPage from '@/components/blocks/${blockName}/page.vue'
</script>

<template>
  <div class="h-full">
    <BlockPage />
  </div>
</template>
`

  const outputPath = path.join(OUTPUT_DIR, `${componentName}.vue`)
  fs.writeFileSync(outputPath, content, 'utf-8')
  console.log(`✓ 创建: ${componentName}.vue`)
}

console.log(`\n✨ 完成！共创建 ${blocks.length} 个测试组件`)
