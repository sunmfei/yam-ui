import { GlobalRegister } from '@/global/registry-loader.ts'
import { GlobalInit } from '@/global/init-loader.ts'

export const GlobalFunctions = async (app: any) => {
  await GlobalRegister()
  await GlobalInit(app)
}
