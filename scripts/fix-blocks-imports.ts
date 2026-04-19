import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BLOCKS_DIR = path.join(__dirname, '../src/components/blocks')

/**
 * 递归查找所有 .vue 文件
 */
function findVueFiles(dir: string): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...findVueFiles(fullPath))
    } else if (item.endsWith('.vue')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * 修复导入路径
 */
function fixImportPaths(content: string): string {
  let fixed = content

  // 修复 @/registry/new-york-v4/ui/ -> @/components/ui/
  fixed = fixed.replace(/@\/registry\/new-york-v4\/ui\//g, '@/components/ui/')

  // 修复 @/registry/new-york-v4/blocks/ -> @/components/blocks/
  fixed = fixed.replace(/@\/registry\/new-york-v4\/blocks\//g, '@/components/blocks/')

  // 修复 @/registry/new-york-v4/lib/ -> @/lib/
  fixed = fixed.replace(/@\/registry\/new-york-v4\/lib\//g, '@/lib/')

  // 修复其他可能的 registry 路径
  fixed = fixed.replace(/@\/registry\/[^/]+\/ui\//g, '@/components/ui/')
  fixed = fixed.replace(/@\/registry\/[^/]+\/blocks\//g, '@/components/blocks/')
  fixed = fixed.replace(/@\/registry\/[^/]+\/lib\//g, '@/lib/')

  return fixed
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 开始扫描 blocks 目录...')

  const vueFiles = findVueFiles(BLOCKS_DIR)
  console.log(`✅ 发现 ${vueFiles.length} 个 Vue 文件`)

  let fixedCount = 0

  for (const filePath of vueFiles) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fixedContent = fixImportPaths(content)

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf-8')
      const relativePath = path.relative(path.join(__dirname, '..'), filePath)
      console.log(`✓ 修复: ${relativePath}`)
      fixedCount++
    }
  }

  console.log(`\n✨ 完成！共修复 ${fixedCount} 个文件`)
}

main().catch((error) => {
  console.error('❌ 修复失败:', error)
  process.exit(1)
})
