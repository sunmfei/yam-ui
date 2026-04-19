// 消息类型
type MessageType = 'success' | 'warning' | 'error' | 'info'

// 消息配置
interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
}

// 确认对话框配置
interface ConfirmOptions {
  title?: string
  confirmText?: string
  cancelText?: string
  type?: MessageType
}

// 确认对话框回调
interface ConfirmCallback {
  resolve: () => void
  reject: (reason?: any) => void
}

// 动态创建确认对话框实例
//let confirmDialogInstance: any = null
const confirmCallbacks = new Map<string, ConfirmCallback>()

// 使用 vue-sonner 显示消息
function showToast(options: MessageOptions) {
  const { message, type = 'info', duration = 3000 } = options

  // 动态导入 toast（避免 SSR 问题）
  import('vue-sonner').then(({ toast }) => {
    switch (type) {
      case 'success':
        toast.success(message, { duration })
        break
      case 'warning':
        toast.warning(message, { duration })
        break
      case 'error':
        toast.error(message, { duration })
        break
      case 'info':
        toast.info(message, { duration })
        break
    }
  })
}

// 消息提示
export const SunMessage = {
  success(message: string, duration?: number) {
    showToast({ message, type: 'success', duration })
  },
  warning(message: string, duration?: number) {
    showToast({ message, type: 'warning', duration })
  },
  error(message: string, duration?: number) {
    showToast({ message, type: 'error', duration })
  },
  info(message: string, duration?: number) {
    showToast({ message, type: 'info', duration })
  },
}

// 确认对话框 - 返回 Promise
export const SunMessageBox = {
  confirm(message: string, title?: string, options?: ConfirmOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      // 动态导入组件和 createApp
      import('@/components/business/sun-confirm-dialog/SunConfirmDialog.vue').then(
        ({ default: ConfirmDialog }) => {
          import('vue').then(({ createApp, h }) => {
            const id = `confirm-${Date.now()}`

            // 存储回调
            confirmCallbacks.set(id, { resolve, reject })

            // 创建容器
            const container = document.createElement('div')
            container.id = id
            document.body.appendChild(container)

            // 创建 Vue 应用实例
            const app = createApp({
              render() {
                return h(ConfirmDialog, {
                  open: true,
                  title: title || '提示',
                  message,
                  type: options?.type || 'info',
                  confirmText: options?.confirmText || '确定',
                  cancelText: options?.cancelText || '取消',
                  'onUpdate:open': (val: boolean) => {
                    if (!val) {
                      // 对话框关闭时清理
                      setTimeout(() => {
                        app.unmount()
                        document.body.removeChild(container)
                        confirmCallbacks.delete(id)
                      }, 300)
                    }
                  },
                  onConfirm: () => {
                    resolve()
                  },
                  onCancel: () => {
                    reject(new Error('User cancelled'))
                  },
                })
              },
            })

            app.mount(container)
          })
        }
      )
    })
  },
}
