// 初始化菜单动作注册（用于从数据库加载的菜单）
import { validateEnv } from '@/utils'
import { setupErrorHandler } from '@/utils'

export const GlobalInit = async (app: any) => {
  // 验证环境变量
  validateEnv()
  // 设置全局错误处理
  setupErrorHandler(app)
}
