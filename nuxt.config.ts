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
  modules: ['@element-plus/nuxt', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt', 'lucide-nuxt', '@nuxtjs/color-mode'],
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
    renderJsonPayloads: true,
    payloadExtraction: false
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
        base: './.nuxt/db'
      }
    },
    // 配置静态资源
    publicAssets: [{
      dir: resolve(__dirname, 'public'),
      baseURL: '/'
    }],
    // 添加 MIME 类型配置
    routeRules: {
      '/**/*.css': { headers: { 'content-type': 'text/css' } },
      '/**/*.js': { headers: { 'content-type': 'application/javascript' } }
    }
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      cssMinify: true
    },
    // 减少网络请求
    server: {
      hmr: {
        protocol: 'ws'
      },
      middlewareMode: false,
      fs: {
        strict: false
      }
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        scopeBehaviour: 'local'
      },
      devSourcemap: true
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
  
  // 添加路由相关的构建优化
  build: {
    transpile: [
      'vue-router',
      // 其他需要转译的依赖...
    ],
  },
})