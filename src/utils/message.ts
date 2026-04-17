// 消息类型
type MessageType = 'success' | 'warning' | 'error' | 'info'

// 消息配置
interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
}

// 创建消息组件
function createMessageComponent(options: MessageOptions) {
  const { message, type = 'info', duration = 3000 } = options

  const container = document.createElement('div')
  container.className = `fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-4`

  const colors = {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
  }

  container.innerHTML = `
    <div class="${colors[type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[200px] justify-center">
      <span class="font-bold">${icons[type]}</span>
      <span>${message}</span>
    </div>
  `

  document.body.appendChild(container)

  // 自动移除
  setTimeout(() => {
    container.classList.add('animate-out', 'fade-out', 'slide-out-to-top-4')
    setTimeout(() => {
      document.body.removeChild(container)
    }, 300)
  }, duration)
}

// 消息提示
export const ElMessage = {
  success(message: string, duration?: number) {
    createMessageComponent({ message, type: 'success', duration })
  },
  warning(message: string, duration?: number) {
    createMessageComponent({ message, type: 'warning', duration })
  },
  error(message: string, duration?: number) {
    createMessageComponent({ message, type: 'error', duration })
  },
  info(message: string, duration?: number) {
    createMessageComponent({ message, type: 'info', duration })
  },
}

// 确认对话框
export const ElMessageBox = {
  confirm(
    message: string,
    title?: string,
    options?: {
      confirmButtonText?: string
      cancelButtonText?: string
      type?: MessageType
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const { confirmButtonText = '确定', cancelButtonText = '取消', type = 'info' } = options || {}

      const container = document.createElement('div')
      container.className =
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in'

      const colors = {
        success: 'text-green-500',
        warning: 'text-yellow-500',
        error: 'text-red-500',
        info: 'text-blue-500',
      }

      const icons = {
        success: '✓',
        warning: '⚠',
        error: '✕',
        info: 'ℹ',
      }

      container.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95">
          <div class="flex items-start gap-4 mb-4">
            <div class="${colors[type]} text-2xl font-bold">${icons[type]}</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">${title || '提示'}</h3>
              <p class="text-gray-600 dark:text-gray-400">${message}</p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button id="cancel-btn" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              ${cancelButtonText}
            </button>
            <button id="confirm-btn" class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              ${confirmButtonText}
            </button>
          </div>
        </div>
      `

      document.body.appendChild(container)

      const cancelBtn = container.querySelector('#cancel-btn') as HTMLButtonElement
      const confirmBtn = container.querySelector('#confirm-btn') as HTMLButtonElement

      cancelBtn.onclick = () => {
        document.body.removeChild(container)
        reject(new Error('User cancelled'))
      }

      confirmBtn.onclick = () => {
        document.body.removeChild(container)
        resolve()
      }

      // 点击背景关闭
      container.onclick = (e) => {
        if (e.target === container) {
          document.body.removeChild(container)
          reject(new Error('User cancelled'))
        }
      }
    })
  },
}
