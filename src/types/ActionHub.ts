/**
 * 菜单 Action 类型（执行行为）
 */
export type ActionHandler = (payload?: unknown) => void | Promise<void>

/**
 * 菜单 Getter 类型（获取展示值）
 */
export type GetterHandler = () => string | undefined

/**
 * 菜单注册表
 *
 * 职责拆分：
 * 1. action：执行行为（点击、切换、提交）
 * 2. getter：获取展示值（当前选中项）
 */
class ActionHub {
  /**
   * 执行类行为（button / click）
   */
  private actions = new Map<string, ActionHandler>()

  /**
   * 读取类行为（label / 状态显示）
   */
  private getters = new Map<string, GetterHandler>()

  // =========================
  // action 注册
  // =========================

  /**
   * 注册 action（点击行为）
   */
  registerAction(key: string, handler: ActionHandler): void {
    this.actions.set(key, handler)
    console.log(`✓ 注册 Action: ${key}`)
  }

  /**
   * 获取 action
   */
  getAction(key?: string): ActionHandler | undefined {
    if (!key) return undefined

    const handler = this.actions.get(key)

    if (!handler) {
      console.warn(`⚠️ 未找到 Action: ${key}`)
    }

    return handler
  }

  /**
   * 执行 action
   */
  async executeAction(key?: string, payload?: unknown) {
    const handler = this.getAction(key)
    if (!handler) return

    return await handler(payload)
  }

  // =========================
  // getter 注册
  // =========================

  /**
   * 注册 getter（展示值）
   */
  registerGetter(key: string, handler: GetterHandler): void {
    this.getters.set(key, handler)
    console.log(`✓ 注册 Getter: ${key}`)
  }

  /**
   * 获取 getter
   */
  getGetter(key?: string): GetterHandler | undefined {
    if (!key) return undefined

    const handler = this.getters.get(key)

    if (!handler) {
      console.warn(`⚠️ 未找到 Getter: ${key}`)
    }

    return handler
  }

  /**
   * 执行 getter（返回 string）
   */
  getString(key?: string): string | undefined {
    const handler = this.getGetter(key)
    if (!handler) return undefined

    return handler()
  }

  // =========================
  // 通用能力
  // =========================

  /**
   * 是否存在 action
   */
  hasAction(key: string): boolean {
    return this.actions.has(key)
  }

  /**
   * 是否存在 getter
   */
  hasGetter(key: string): boolean {
    return this.getters.has(key)
  }

  /**
   * 清空全部
   */
  clear(): void {
    this.actions.clear()
    this.getters.clear()
    console.log('✓ 菜单注册表已清空')
  }

  /**
   * 获取全部 key
   */
  getAllKeys() {
    return {
      actions: Array.from(this.actions.keys()),
      getters: Array.from(this.getters.keys()),
    }
  }
}

// 单例导出
export const actionHub = new ActionHub()
export default actionHub
