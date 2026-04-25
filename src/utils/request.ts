import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useUserStore } from '@/stores'

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  skipAuthRefresh?: boolean
}

export interface HttpRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh?: boolean
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const retryableConfig = config as RetryableAxiosRequestConfig

    if (
      !retryableConfig.skipAuthRefresh &&
      userStore.token &&
      userStore.refreshToken &&
      userStore.shouldRefreshToken
    ) {
      try {
        await userStore.refreshAccessToken()
      } catch (error) {
        console.error('Failed to refresh token before request:', error)
      }
    }

    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    if (res?.code && res.code !== 200) {
      console.error('API Error:', res.message || 'Error')

      if (res.code === 401) {
        const userStore = useUserStore()
        void userStore.logout({ redirectToLogin: true, callApi: false })
      }

      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  async (error) => {
    console.error('Response error:', error.message)

    if (error.response) {
      const status = error.response.status
      const originalRequest = error.config as RetryableAxiosRequestConfig | undefined

      switch (status) {
        case 400:
          console.error('请求参数错误')
          break
        case 401: {
          console.error('未授权,请重新登录')
          const userStore = useUserStore()

          if (
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.skipAuthRefresh &&
            userStore.refreshToken
          ) {
            originalRequest._retry = true

            try {
              const nextToken = await userStore.refreshAccessToken(true)
              originalRequest.headers.Authorization = `Bearer ${nextToken}`
              return service(originalRequest)
            } catch (refreshError) {
              console.error('Refresh token failed:', refreshError)
            }
          }

          await userStore.logout({ redirectToLogin: true, callApi: false })
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

export const http = {
  get<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  patch<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },
}

export default service
