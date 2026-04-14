import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // 全局超时时间
    testTimeout: 10000,
    // 环境
    environment: 'jsdom',
    // 包含的文件
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 排除的文件
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/**/*.d.ts', 'src/main.ts', 'src/vite-env.d.ts'],
    },
    // 全局 mocks
    globals: true,
    // setup 文件
    setupFiles: ['./src/test/setup.ts'],
  },
})
