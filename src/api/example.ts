/**
 * API 服务示例
 * 展示如何使用 HTTP 请求封装
 */

import { http } from '@/utils/request'

// 用户相关 API
export const userApi = {
  // 登录
  login(data: { username: string; password: string }) {
    return http.post('/auth/login', data)
  },

  // 获取用户信息
  getUserInfo() {
    return http.get('/user/info')
  },

  // 更新用户信息
  updateUserInfo(data: Record<string, unknown>) {
    return http.put('/user/info', data)
  },

  // 登出
  logout() {
    return http.post('/auth/logout')
  },
}

// 示例：在其他组件中使用
/*
import { userApi } from '@/api/example'

async function handleLogin() {
  try {
    const result = await userApi.login({
      username: 'test',
      password: '123456'
    })
    console.log('Login success:', result)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
*/
