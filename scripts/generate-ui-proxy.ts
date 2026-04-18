/**
 * UI组件自动代理生成器
 *
 * 功能：
 * 1. 自动扫描 src/components/ui 目录下的所有组件
 * 2. 生成带 Base 前缀的代理导出
 * 3. 如果 base 目录下已有同名组件，则跳过（使用自定义组件）
 *
 * 使用方式：
 * pnpm run generate:ui-proxy
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UI_DIR = path.resolve(__dirname, '../src/components/ui')
const BASE_DIR = path.resolve(__dirname, '../src/components/base')
const OUTPUT_FILE = path.resolve(BASE_DIR, 'ui-proxy.ts')

// 需要排除的文件/目录
const EXCLUDE_PATTERNS = [
  /^index\./, // index.ts/index.vue
  /\.d\.ts$/, // 类型声明文件
  /types/, // types 目录
]

// 已有的 base 组件（需要排除，避免覆盖）
const existingBaseComponents = new Set<string>()

/**
 * 扫描 base 目录，获取已存在的组件名
 */
function scanExistingBaseComponents() {
  if (!fs.existsSync(BASE_DIR)) return

  const items = fs.readdirSync(BASE_DIR, { withFileTypes: true })
  for (const item of items) {
    if (item.isDirectory() && !item.name.startsWith('.')) {
      // 检查是否有同名 Vue 文件
      const vueFile = path.join(BASE_DIR, item.name, `Base${capitalize(item.name)}.vue`)
      if (fs.existsSync(vueFile)) {
        existingBaseComponents.add(item.name.toLowerCase())
      }
    }
  }
}

/**
 * 首字母大写
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 将 kebab-case 转换为 PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((part) => capitalize(part))
    .join('')
}

/**
 * 检查是否应该排除
 */
function shouldExclude(name: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(name))
}

/**
 * 递归扫描目录，收集组件信息
 */
interface ComponentInfo {
  name: string // 原始名称（如 Button）
  pascalName: string // PascalCase名称（如 Button）
  basePath: string // 基础路径（如 button）
  importPath: string // 导入路径（如 @/components/ui/button）
  isDefault: boolean // 是否是 default 导出
  hasNamedExports: string[] // 命名导出列表
}

function scanDirectory(dir: string, relativePath: string = ''): ComponentInfo[] {
  const components: ComponentInfo[] = []

  if (!fs.existsSync(dir)) return components

  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relPath = relativePath ? `${relativePath}/${item.name}` : item.name

    if (item.isDirectory()) {
      // 跳过排除的目录
      if (shouldExclude(item.name)) continue

      // 检查目录下是否有 index.ts/index.vue
      const hasIndexTs = fs.existsSync(path.join(fullPath, 'index.ts'))
      const hasIndexVue = fs.existsSync(path.join(fullPath, 'index.vue'))

      if (hasIndexTs || hasIndexVue) {
        // 有 index 文件，读取所有导出
        const indexPath = hasIndexTs
          ? path.join(fullPath, 'index.ts')
          : path.join(fullPath, 'index.vue')

        if (hasIndexTs) {
          const content = fs.readFileSync(indexPath, 'utf-8')
          // 匹配所有 export { ... } from '...' 语句
          const exportMatches = content.matchAll(/export\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g)

          for (const match of exportMatches) {
            if (!match[1] || !match[2]) continue

            const exportsStr = match[1]
            const exports = exportsStr.split(',').map((s) => s.trim())

            for (const exp of exports) {
              // 解析: "default as Xxx" 或 "Xxx"
              let exportName: string

              if (exp.startsWith('default as ')) {
                // export { default as Avatar } → 这是命名导出 Avatar
                exportName = exp.replace('default as ', '').trim()
              } else {
                exportName = exp.trim()
              }

              const componentName = toPascalCase(exportName)

              // 检查是否已存在
              if (existingBaseComponents.has(item.name.toLowerCase())) {
                console.log(`⏭️  跳过 ${componentName}（base 中已有自定义组件）`)
                continue
              }

              components.push({
                name: exportName,
                pascalName: componentName,
                basePath: relPath,
                importPath: `@/components/ui/${relPath}`,
                isDefault: false, // index.ts 中的导出都是命名导出
                hasNamedExports: [exportName],
              })
            }
          }
        } else {
          // index.vue，使用目录名
          const componentName = toPascalCase(item.name)

          if (existingBaseComponents.has(item.name.toLowerCase())) {
            console.log(`⏭️  跳过 ${componentName}（base 中已有自定义组件）`)
            continue
          }

          components.push({
            name: componentName,
            pascalName: componentName,
            basePath: relPath,
            importPath: `@/components/ui/${relPath}`,
            isDefault: true,
            hasNamedExports: [],
          })
        }
      } else {
        // 没有 index 文件，递归扫描子目录和.vue文件
        const subComponents = scanDirectory(fullPath, relPath)
        components.push(...subComponents)
      }
    }
  }

  return components
}

/**
 * 扫描目录下的所有 .vue 文件（无 index 时）
 */
function _scanVueFilesInDir(dir: string, relativePath: string): ComponentInfo[] {
  const components: ComponentInfo[] = []

  if (!fs.existsSync(dir)) return components

  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.vue') && !shouldExclude(file.name)) {
      const fileName = file.name.replace('.vue', '')
      const componentName = toPascalCase(fileName)

      // 检查是否已存在
      const dirName = path.basename(dir)
      if (existingBaseComponents.has(dirName.toLowerCase())) {
        console.log(`⏭️  跳过 ${componentName}（base 中已有自定义组件）`)
        continue
      }

      components.push({
        name: componentName,
        pascalName: componentName,
        basePath: relativePath,
        importPath: `@/components/ui/${relativePath}/${file.name}`,
        isDefault: true,
        hasNamedExports: [],
      })
    }
  }

  return components
}

/**
 * 读取 Vue 文件，分析导出
 */
function _analyzeVueFile(filePath: string): { hasDefault: boolean; namedExports: string[] } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    // 简单分析：检查是否有 script setup 和 export
    const hasScriptSetup = content.includes('<script setup')
    const hasDefaultExport = hasScriptSetup // script setup 默认导出组件

    // 查找命名导出（export const/function/type）
    const namedExports: string[] = []
    const exportMatches = content.matchAll(
      /export\s+(?:const|function|type|interface|enum)\s+(\w+)/g
    )
    for (const match of exportMatches) {
      if (match[1]) {
        namedExports.push(match[1])
      }
    }

    return {
      hasDefault: hasDefaultExport,
      namedExports,
    }
  } catch {
    return { hasDefault: true, namedExports: [] }
  }
}

/**
 * 生成代理文件内容
 */
function generateProxyFile(components: ComponentInfo[]): string {
  const lines: string[] = []

  lines.push('/**')
  lines.push(' * UI组件自动代理导出')
  lines.push(' * ')
  lines.push(' * ⚠️  此文件由脚本自动生成，请勿手动修改')
  lines.push(' * ')
  lines.push(' * 生成命令：pnpm run generate:ui-proxy')
  lines.push(' * ')
  lines.push(' * 策略：')
  lines.push(' * 1. 自动扫描 ui 目录下的所有组件')
  lines.push(' * 2. 如果 base 层有同名组件，优先使用 base 层的（需在脚本中配置）')
  lines.push(' * 3. 否则直接导出 ui 层的组件并添加 Base 前缀')
  lines.push(' * ')
  lines.push(' * 使用方式：')
  lines.push(" * import { BaseButton, BaseInput } from '@/components/base/ui-proxy'")
  lines.push(' */')
  lines.push('')
  lines.push('// =============================================')
  lines.push('// 自动生成的 UI 组件代理')
  lines.push('// =============================================')
  lines.push('')

  // 按目录分组
  const groupedByDir = new Map<string, ComponentInfo[]>()
  for (const comp of components) {
    const dir = comp.basePath.split('/')[0]
    if (!groupedByDir.has(dir)) {
      groupedByDir.set(dir, [])
    }
    groupedByDir.get(dir)!.push(comp)
  }

  // 生成导出语句
  for (const [dir, comps] of groupedByDir) {
    lines.push(`// ${dir} 相关`)

    for (const comp of comps) {
      if (comp.isDefault) {
        // 默认导出：export { default as BaseXxx } from '...'
        lines.push(`export { default as Base${comp.pascalName} } from '${comp.importPath}'`)
      } else {
        // 命名导出：export { Xxx as BaseXxx } from '...'
        for (const named of comp.hasNamedExports) {
          lines.push(`export { ${named} as Base${named} } from '${comp.importPath}'`)
        }
      }
    }

    lines.push('')
  }

  lines.push('// =============================================')
  lines.push('// 手动维护的特殊导出（不会被自动覆盖）')
  lines.push('// =============================================')
  lines.push('')
  lines.push('// 在这里添加需要手动维护的导出')
  lines.push('')

  return lines.join('\n')
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 开始扫描 UI 组件...')

  // 1. 扫描已存在的 base 组件
  scanExistingBaseComponents()
  console.log(`✅ 发现 ${existingBaseComponents.size} 个已存在的 base 组件`)

  // 2. 扫描 ui 目录
  const components = scanDirectory(UI_DIR)
  console.log(`✅ 发现 ${components.length} 个 UI 组件`)

  // 3. 生成代理文件
  const content = generateProxyFile(components)
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8')
  console.log(`✅ 生成代理文件: ${OUTPUT_FILE}`)

  console.log('\n✨ 完成！')
  console.log(`   - 共生成 ${components.length} 个组件代理`)
  console.log(`   - 跳过 ${existingBaseComponents.size} 个已自定义的组件`)
}

main().catch((error) => {
  console.error('❌ 生成失败:', error)
  process.exit(1)
})
