import { GlobalRegister } from '@/global/registry-loader.ts'
import { GlobalInit } from '@/global/init-loader.ts'
import type { Router } from 'vue-router'

export const GlobalFunctions = async (app: any, router: Router) => {
  await GlobalRegister(router)
  await GlobalInit(app)
}
