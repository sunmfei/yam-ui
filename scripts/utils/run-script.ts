/**
 * 脚本执行工具
 *
 * 功能：
 * 1. 统一执行 npm/pnpm 脚本
 * 2. 支持同步/异步执行
 * 3. 提供友好的日志输出
 */

import { spawn } from 'child_process'

export interface ScriptOptions {
  /** 是否显示完整输出 */
  verbose?: boolean
  /** 是否在失败时抛出错误 */
  throwOnError?: boolean
}

/**
 * 执行 pnpm 脚本
 *
 * @param scriptName - 脚本名称（如 'generate:ui-proxy'）
 * @param options - 配置选项
 * @returns Promise<number> - 退出码
 */
export function runScript(scriptName: string, options: ScriptOptions = {}): Promise<number> {
  const { verbose = true, throwOnError = false } = options

  return new Promise((resolve, reject) => {
    console.log(`🔄 执行脚本: ${scriptName}`)

    const child = spawn('pnpm', ['run', scriptName], {
      stdio: verbose ? 'inherit' : 'pipe',
      shell: true,
    })

    child.on('close', (code) => {
      const exitCode = code ?? 1 // null 时默认为 1（失败）

      if (exitCode === 0) {
        console.log(`✅ 脚本执行成功: ${scriptName}`)
        resolve(exitCode)
      } else {
        const message = `❌ 脚本执行失败: ${scriptName} (退出码: ${exitCode})`
        console.error(message)
        if (throwOnError) {
          reject(new Error(message))
        } else {
          resolve(exitCode)
        }
      }
    })

    child.on('error', (error) => {
      const message = `⚠️  脚本执行异常: ${scriptName} - ${error.message}`
      console.error(message)
      if (throwOnError) {
        reject(error)
      } else {
        resolve(1)
      }
    })
  })
}

/**
 * 并行执行多个脚本
 *
 * @param scriptNames - 脚本名称数组
 * @param options - 配置选项
 * @returns Promise<number[]> - 所有脚本的退出码
 */
export async function runScriptsParallel(
  scriptNames: string[],
  options: ScriptOptions = {}
): Promise<number[]> {
  console.log(`🔄 并行执行 ${scriptNames.length} 个脚本...`)

  const results = await Promise.all(scriptNames.map((name) => runScript(name, options)))

  const failedCount = results.filter((code) => code !== 0).length
  if (failedCount > 0) {
    console.warn(`⚠️  ${failedCount}/${scriptNames.length} 个脚本执行失败`)
  } else {
    console.log(`✅ 所有脚本执行成功`)
  }

  return results
}

/**
 * 串行执行多个脚本
 *
 * @param scriptNames - 脚本名称数组
 * @param options - 配置选项
 * @returns Promise<number[]> - 所有脚本的退出码
 */
export async function runScriptsSeries(
  scriptNames: string[],
  options: ScriptOptions = {}
): Promise<number[]> {
  console.log(`🔄 串行执行 ${scriptNames.length} 个脚本...`)

  const results: number[] = []

  for (const name of scriptNames) {
    const code = await runScript(name, options)
    results.push(code)

    // 如果某个脚本失败且需要抛出错误，则中断
    if (code !== 0 && options.throwOnError) {
      break
    }
  }

  const failedCount = results.filter((code) => code !== 0).length
  if (failedCount > 0) {
    console.warn(`⚠️  ${failedCount}/${scriptNames.length} 个脚本执行失败`)
  } else {
    console.log(`✅ 所有脚本执行成功`)
  }

  return results
}
