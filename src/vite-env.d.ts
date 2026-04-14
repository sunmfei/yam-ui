/// <reference types="vite/client" />

// 环境变量类型声明
interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production' | 'test'
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_ENABLE_MOCK?: string
  readonly VITE_LOG_LEVEL?: string
  readonly VITE_ENABLE_ANALYZE?: string
  readonly VITE_CDN_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vue 文件模块声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

// 图片资源声明
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.ico' {
  const src: string
  export default src
}

// 字体文件声明
declare module '*.woff' {
  const src: string
  export default src
}

declare module '*.woff2' {
  const src: string
  export default src
}

declare module '*.eot' {
  const src: string
  export default src
}

declare module '*.ttf' {
  const src: string
  export default src
}

declare module '*.otf' {
  const src: string
  export default src
}

// 音频/视频文件声明
declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.mp4' {
  const src: string
  export default src
}

declare module '*.webm' {
  const src: string
  export default src
}
