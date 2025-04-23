// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      title: '增达科技报价系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: '增达科技报价系统', content: '增达科技报价系统' }
      ],
      link: [
        // 预加载字体
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    },
    // 添加路由过渡动画
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    // 配置静态资源路径
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    cdnURL: '',
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt', 'lucide-nuxt', '@nuxtjs/color-mode'],
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || '',
      dufsServer: process.env.DUFS_SERVER || ''
    }
  },
  experimental: {
    decorators: true,
    renderJsonPayloads: true
  },
  imports: {
    dirs: ['models/**']
  },
  shadcn: {
    prefix: 'shadcn',
    componentDir: './components/ui',
  },
  lucide: {
    prefix: "lucide",
  },
  pinia: {
    storesDirs: ['./stores']
  },
  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
    },
    debug: true
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    },
    // 修改为文件系统缓存
    storage: {
      cache: {
        driver: 'fs',
        base: './.nuxt/cache',
        ttl: 60 * 60 // 1小时缓存
      }
    },
    // 添加序列化配置，处理函数不可序列化的问题
    devStorage: {
      db: {
        driver: 'fs',
        base: './.nuxt/db' // 添加base选项指定存储路径
      }
    },
    // 配置静态资源
    publicAssets: [{
      dir: resolve(__dirname, 'public'),
      baseURL: '/'
    }]
  },
  vite: {
    optimizeDeps: {
      include: ['tinymce/tinymce'],
      exclude: ['tinymce/plugins/*'],
      force: true,
      esbuildOptions: {
        target: 'esnext',
        treeShaking: true
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'recharts': ['recharts'],
            'docx': ['docx', 'docx-preview']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    // 减少网络请求
    server: {
      hmr: {
        protocol: 'ws'
      },
      middlewareMode: false,
      fs: {
        strict: true
      },
      headers: {
        'Content-Type': 'text/css'
      }
    }
  },
  // 性能优化配置
  vue: {
    compilerOptions: {
      // 禁用热重载警告
      whitespace: 'condense',
      comments: false
    }
  },
  // 路由配置
  router: {
    options: {
      scrollBehaviorType: 'auto'
    }
  },
  
  // 确保路由相关插件优先加载
  plugins: [
    // 路由修复插件应该首先加载
    { src: '~/plugins/router-fix.ts', mode: 'client' },
    // 添加懒加载插件
    { src: '~/plugins/lazy-load.ts', mode: 'client' },
    // 添加内存监控插件
    { src: '~/plugins/memory-monitor.ts', mode: 'client' }
  ],
  
  // 添加路由相关的构建优化
  build: {
    transpile: [
      'vue-router',
      // 其他需要转译的依赖...
    ],
  },
  
  // 添加全局钩子来处理函数序列化问题
  hooks: {
    'build:before': async () => {
      // 创建静态资源目录
      const { copy } = await import('fs-extra')
      const { resolve } = await import('path')
      
      // 源路径和目标路径
      const tinymcePath = resolve('./node_modules/tinymce')
      const targetPath = resolve('./public/plugins/tinymce')
      
      try {
        // 复制TinyMCE资源到public目录
        await copy(tinymcePath, targetPath, {
          filter: (src: string) => {
            // 排除不需要的文件
            return !src.includes('node_modules') && 
                  !src.includes('.git') && 
                  !src.endsWith('.ts') &&
                  !src.endsWith('.map')
          }
        })
        console.log('✅ TinyMCE资源已复制到public/plugins/tinymce')
      } catch (error) {
        console.error('❌ 复制TinyMCE资源失败:', error)
      }
    },
    // 添加构建后处理钩子
    'build:done': () => {
      console.log('✅ 构建完成，已优化资源加载')
    }
  }
})