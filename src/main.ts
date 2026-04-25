import { createApp } from 'vue'
import 'vue-sonner/style.css'
import './style.css'
import './main.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'

import { useAppStore, useUserStore } from '@/stores'
import { GlobalFunctions } from '@/global'

const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia)

// 初始化应用设置
const appStore = useAppStore()
appStore.initFromStorage()

const userStore = useUserStore()
userStore.initFromStorage()

await GlobalFunctions(app)

// 挂载应用
app.mount('#app')
