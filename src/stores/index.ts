import { createPinia } from 'pinia'

// Base stores
export { useAppStore } from './base'

// Business stores
export { useUserStore } from './business'

// System stores
export { useCacheStore } from './system'

const pinia = createPinia()

export default pinia
