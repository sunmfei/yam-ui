export const GlobalRegister = async () => {
  // 初始化菜单动作注册
  actionRegister()
}

/**
 * 全局 action 注册
 */
function actionRegister() {
  const modules = import.meta.glob('@/actions/**/*.action.ts', { eager: true })
  console.log('modules: ', modules)
  for (const path in modules) {
    const mod: any = modules[path]

    // 执行默认导出（注册函数）
    mod.default?.()
  }

  console.log('✓ 全局 action 初始化完成')
}
