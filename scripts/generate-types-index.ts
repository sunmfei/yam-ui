/**
 * Types自动导出生成器
 *
 * 功能：
 * 1. 自动扫描 src/types 目录下的所有类型定义文件
 * 2. 生成统一的 index.ts 导出文件
 * 3. 按目录分组（constants、enums、models）
 *
 * 使用方式：
 * pnpm run generate:types
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TYPES_DIR = path.resolve(__dirname, '../src/types')
const OUTPUT_FILE = path.resolve(TYPES_DIR, 'index.ts')

// 需要排除的文件/目录
const EXCLUDE_PATTERNS = [
  /^index\./, // index.ts
  /\.d\.ts$/, // 类型声明文件
]

/**
 * 检查是否应该排除
 */
function shouldExclude(name: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(name))
}

/**
 * 读取 TypeScript 文件，分析导出
 */
interface ExportInfo {
  name: string
  type: 'type' | 'const' | 'enum' | 'default'
  filePath: string
  relativePath: string
}

function analyzeFile(filePath: string, relativePath: string): ExportInfo[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const exports: ExportInfo[] = []

    // 匹配 export type { Xxx }
    const typeExports = content.matchAll(/export\s+type\s+{([^}]+)}/g)
    for (const match of typeExports) {
      if (match[1]) {
        const names = match[1].split(',').map((s) => s.trim())
        for (const name of names) {
          exports.push({
            name,
            type: 'type',
            filePath,
            relativePath,
          })
        }
      }
    }

    // 匹配 export { Xxx } (非 type)
    const constExports = content.matchAll(/export\s+(?:const|function)\s+(\w+)/g)
    for (const match of constExports) {
      if (match[1]) {
        exports.push({
          name: match[1],
          type: 'const',
          filePath,
          relativePath,
        })
      }
    }

    // 匹配 export const/enum
    const enumExports = content.matchAll(/export\s+(?:const|enum)\s+(\w+)/g)
    for (const match of enumExports) {
      if (match[1]) {
        // 避免重复
        if (!exports.find((e) => e.name === match[1])) {
          exports.push({
            name: match[1],
            type: 'enum',
            filePath,
            relativePath,
          })
        }
      }
    }

    // 匹配 export default
    if (content.includes('export default')) {
      exports.push({
        name: 'default',
        type: 'default',
        filePath,
        relativePath,
      })
    }

    return exports
  } catch (error) {
    console.error(`⚠️  分析文件失败: ${filePath}`, error)
    return []
  }
}

/**
 * 递归扫描目录
 */
function scanDirectory(dir: string, relativePath: string = ''): ExportInfo[] {
  const allExports: ExportInfo[] = []

  if (!fs.existsSync(dir)) return allExports

  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relPath = relativePath ? `${relativePath}/${item.name}` : item.name

    if (item.isDirectory()) {
      if (shouldExclude(item.name)) continue
      const subExports = scanDirectory(fullPath, relPath)
      allExports.push(...subExports)
    } else if (item.isFile() && item.name.endsWith('.ts') && !shouldExclude(item.name)) {
      const fileExports = analyzeFile(fullPath, relPath)
      allExports.push(...fileExports)
    }
  }

  return allExports
}

/**
 * 生成导入语句
 */
function generateImportStatement(exports: ExportInfo[], _dir: string): string {
  const lines: string[] = []

  // 按文件分组，并去重（忽略大小写）
  const groupedByFile = new Map<string, ExportInfo[]>()
  const seenFiles = new Set<string>()

  for (const exp of exports) {
    const normalizedPath = exp.relativePath.toLowerCase()

    // 跳过已处理的文件（避免重复导出）
    if (seenFiles.has(normalizedPath)) {
      continue
    }

    if (!groupedByFile.has(exp.relativePath)) {
      groupedByFile.set(exp.relativePath, [])
      seenFiles.add(normalizedPath)
    }
    groupedByFile.get(exp.relativePath)!.push(exp)
  }

  for (const [relativePath, fileExports] of groupedByFile) {
    // 移除 .ts 后缀
    const importPath = `./${relativePath.replace(/\.ts$/, '')}`

    // 分离 type 和非 type 导出
    const typeExports = fileExports.filter((e) => e.type === 'type')
    const valueExports = fileExports.filter((e) => e.type !== 'type')

    if (typeExports.length > 0) {
      const names = typeExports.map((e) => e.name).join(', ')
      lines.push(`export type { ${names} } from '${importPath}'`)
    }

    if (valueExports.length > 0) {
      const hasDefault = valueExports.find((e) => e.type === 'default')
      const namedExports = valueExports.filter((e) => e.type !== 'default')

      if (hasDefault && namedExports.length > 0) {
        const names = namedExports.map((e) => e.name).join(', ')
        lines.push(`export { ${names}, default } from '${importPath}'`)
      } else if (hasDefault) {
        lines.push(`export { default } from '${importPath}'`)
      } else if (namedExports.length > 0) {
        const names = namedExports.map((e) => e.name).join(', ')
        lines.push(`export { ${names} } from '${importPath}'`)
      }
    }
  }

  return lines.join('\n')
}

/**
 * 生成索引文件
 */
function generateIndexFile(allExports: ExportInfo[]): string {
  const lines: string[] = []

  lines.push('/**')
  lines.push(' * Types 统一导出')
  lines.push(' *')
  lines.push(' * ⚠️  此文件由脚本自动生成，请勿手动修改')
  lines.push(' *')
  lines.push(' * 生成命令：pnpm run generate:types')
  lines.push(' *')
  lines.push(' * 目录结构：')
  lines.push(' * - constants/ : 常量定义')
  lines.push(' * - enums/     : 枚举类型')
  lines.push(' * - models/    : 数据模型、接口和类')
  lines.push(' */')
  lines.push('')

  // 按目录分组
  const groupedByDir = new Map<string, ExportInfo[]>()
  for (const exp of allExports) {
    const dir = exp.relativePath.split('/')[0]
    if (!groupedByDir.has(dir)) {
      groupedByDir.set(dir, [])
    }
    groupedByDir.get(dir)!.push(exp)
  }

  // 生成各部分的导出
  const dirOrder = ['constants', 'enums', 'models']
  for (const dir of dirOrder) {
    const exports = groupedByDir.get(dir)
    if (!exports || exports.length === 0) continue

    lines.push(`// ==================== ${capitalize(dir)} ====================`)
    lines.push(generateImportStatement(exports, dir))
    lines.push('')
  }

  // 其他目录
  for (const [dir, exports] of groupedByDir) {
    if (dirOrder.includes(dir)) continue

    lines.push(`// ==================== ${capitalize(dir)} ====================`)
    lines.push(generateImportStatement(exports, dir))
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * 首字母大写
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 开始扫描 Types 目录...')

  // 扫描所有类型定义
  const allExports = scanDirectory(TYPES_DIR)
  console.log(`✅ 发现 ${allExports.length} 个类型导出`)

  // 生成索引文件
  const content = generateIndexFile(allExports)
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8')
  console.log(`✅ 生成索引文件: ${OUTPUT_FILE}`)

  console.log('\n✨ 完成！')
  console.log(`   - 共生成 ${allExports.length} 个类型导出`)
}

main().catch((error) => {
  console.error('❌ 生成失败:', error)
  process.exit(1)
})
