// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      title: '增达科技报价系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: '增达科技报价系统', content: '增达科技报价系统' }
      ],
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  plugins: [
    { src: '@/plugins/wangeditor.js', ssr: false },
    { src: '@/plugins/nuxt-office.ts', ssr: false },
  ],
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'lucide-nuxt'],
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
    public: {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  experimental: {
    decorators: true,
    renderJsonPayloads: true
  },
  imports: {
    dirs: ['models/**', 'lib/*']
  },
  shadcn: {
    prefix: 'shadcn',
    componentDir: './components/ui'
  }
})