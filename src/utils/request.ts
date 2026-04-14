import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()

    // 在请求发送之前做一些事情
    if (userStore.token) {
      // 让每个请求携带 token
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    return config
  },
  (error) => {
    // 处理请求错误
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const res = response.data

    // 如果返回的状态码不是 200，则认为是错误
    if (res.code && res.code !== 200) {
      console.error('API Error:', res.message || 'Error')

      // 401: 未授权，需要重新登录
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
        // 可以在这里跳转到登录页
        // window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  (error) => {
    // 处理响应错误
    console.error('Response error:', error.message)

    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 400:
          console.error('请求参数错误')
          break
        case 401: {
          console.error('未授权,请重新登录')
          const userStore = useUserStore()
          userStore.logout()
          // window.location.href = '/login'
          break
        }
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求资源不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        case 502:
          console.error('网关错误')
          break
        case 503:
          console.error('服务不可用')
          break
        case 504:
          console.error('网关超时')
          break
        default:
          console.error(`连接错误${status}`)
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('请求超时，请稍后重试')
    } else if (!window.navigator.onLine) {
      console.error('网络连接异常，请检查网络')
    }

    return Promise.reject(error)
  }
)

// 导出请求方法
export const http = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },
}

export default service
