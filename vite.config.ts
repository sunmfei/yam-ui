import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import Components from 'unplugin-vue-components/vite'
import { spawn } from 'child_process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量（仅 VITE_ 前缀）
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  // 开发模式下自动生成 UI 代理
  if (mode === 'development') {
    console.log('🔄 生成 UI 组件代理...')
    spawn('pnpm', ['run', 'generate:ui-proxy'], {
      stdio: 'inherit',
      shell: true,
    }).on('close', (code) => {
      if (code === 0) {
        console.log('✅ UI 代理生成完成')
      } else {
        console.error('❌ UI 代理生成失败')
      }
    })
  }

  return {
    plugins: [
      tailwindcss(),
      vue(),
      // 组件自动导入配置
      Components({
        // 自动导入的目录（排除ui目录）
        dirs: [
          'src/components/base', // 基础组件层
          'src/components/business', // 业务组件层
          'src/components/modules', // 模块组件层
        ],
        // 排除ui目录，不自动注册第三方组件
        exclude: [/node_modules/, /src\/components\/ui/],
        extensions: ['vue'],
        // 生成类型声明文件
        dts: 'src/components.d.ts',
        // 自定义组件名称解析器
        resolvers: [],
      }),
      // Gzip 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240, // 10kb 以上才压缩
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // Brotli 压缩（更好的压缩率）
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      // 包分析工具（仅在生产构建时启用）
      mode === 'analyze' &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 服务器配置
    server: {
      port: Number(env.VITE_SERVER_PORT) || 5173,
      host: true,
      open: false,
      cors: true,
    },
    // 构建配置
    build: {
      // 输出目录
      outDir: 'dist',
      // 静态资源目录
      assetsDir: 'assets',
      // 启用 sourcemap（生产环境建议关闭）
      sourcemap: mode === 'development',
      // 代码分割阈值
      chunkSizeWarningLimit: 1000,
      // CSS 代码分割
      cssCodeSplit: true,
      // 目标浏览器
      target: 'es2015',
      // 最小化
      minify: 'terser',
      // Terser 压缩配置
      terserOptions: {
        compress: {
          // 生产环境移除 console 和 debugger
          drop_console: mode === 'production',
          drop_debugger: true,
          // 移除纯函数调用
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        },
        format: {
          // 移除注释
          comments: false,
        },
      },
      // Rollup 打包配置
      rollupOptions: {
        output: {
          // 手动代码分割
          manualChunks(id) {
            // node_modules 中的依赖单独打包
            if (id.includes('node_modules')) {
              // Vue 核心库
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vue-vendor'
              }
              // VueUse 工具库
              if (id.includes('@vueuse')) {
                return 'vueuse'
              }
              // 动画库
              if (id.includes('motion')) {
                return 'motion'
              }
              // TailwindCSS 相关
              if (id.includes('tailwind') || id.includes('@inspira')) {
                return 'ui-vendor'
              }
              // 其他第三方库
              return 'vendor'
            }
          },
          // 资源文件命名规则
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // 图片资源
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || '')) {
              return 'assets/images/[name]-[hash][extname]'
            }
            // 字体文件
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            // CSS 文件
            if (/\.css$/i.test(assetInfo.name || '')) {
              return 'assets/css/[name]-[hash][extname]'
            }
            // 其他资源
            return 'assets/[ext]/[name]-[hash].[ext]'
          },
        },
      },
    },
    // CSS 配置
    css: {
      devSourcemap: mode === 'development',
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['vue', '@vueuse/core', 'motion-v'],
      exclude: [],
    },
    // 预览配置
    preview: {
      port: 4173,
      host: true,
      strictPort: false,
    },
    // 日志级别
    logLevel: mode === 'development' ? 'info' : 'warn',
    // 清除控制台
    clearScreen: true,
  }
})
