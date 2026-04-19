/**
 * 菜单 Action 类型（执行行为）
 */
export type ActionHandler = (payload?: unknown) => void | Promise<void>

/**
 * 菜单 Getter 类型（获取展示值）
 */
export type GetterHandler = () => string | undefined
