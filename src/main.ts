import { createApp } from 'vue'
import './style.css'
import './main.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'

import { useAppStore } from './stores/app'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 引入深色模式样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { GlobalFunctions } from '@/global'

const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia)
app.use(ElementPlus)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化应用设置
const appStore = useAppStore()
appStore.initFromStorage()

await GlobalFunctions(app)

// 挂载应用
app.mount('#app')
