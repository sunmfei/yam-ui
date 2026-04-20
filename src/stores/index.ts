import { createPinia } from 'pinia'

export { useAppStore } from './app'
export { useUserStore } from './user'

const pinia = createPinia()

export default pinia
