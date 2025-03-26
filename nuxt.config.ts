// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      title: '增达科技报价系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: '增达科技报价系统', content: '增达科技报价系统' }
      ],
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  plugins: [
    { src: '@/plugins/wangeditor.js', ssr: false },
    { src: '@/plugins/nuxt-office.ts', ssr: false },
  ],
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt', 'lucide-nuxt', '@nuxtjs/color-mode'],
  css: [
    "@wangeditor/editor/dist/css/style.css",
    '@vue-office/docx/lib/index.css',
    '@vue-office/excel/lib/index.css',
  ],
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
  runtimeConfig: {
    dufsServer: process.env.DUFS_SERVER || 'http://localhost:6990',
    public: {
      apiBase: process.env.API_BASE || '',
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
    }
  },
  vite: {
    optimizeDeps: {
      include: ['tinymce/tinymce']
    },
    build: {
      rollupOptions: {
        external: ['tinymce/tinymce']
      }
    }
  }
})