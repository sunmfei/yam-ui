import { createApp } from 'vue'
import './style.css'
import './main.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { setupErrorHandler } from './utils/errorHandler'
import { useAppStore } from './stores/app'
import { validateEnv } from './utils/env'

// 验证环境变量
validateEnv()

const app = createApp(App)

// 设置全局错误处理
setupErrorHandler(app)

// 使用插件
app.use(router)
app.use(pinia)

// 初始化应用设置
const appStore = useAppStore()
appStore.initFromStorage()

// 挂载应用
app.mount('#app')
