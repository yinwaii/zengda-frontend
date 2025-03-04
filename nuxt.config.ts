// https://nuxt.com/docs/api/configuration/nuxt-config
const apiPath = 'http://127.0.0.1:4523/m1/5552475-5229490-default';

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
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  css: [
    '~/assets/scss/index.scss',
    "@wangeditor/editor/dist/css/style.css",
    '@vue-office/docx/lib/index.css',
    '@vue-office/excel/lib/index.css',
  ],
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
  elementPlus: {
    importStyle: 'scss',
    themes: ['dark'],
    icon: 'ElIcon',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/assets/scss/element/index.scss" as element;`,
        },
      }
    }
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  // experimental: {
  //   decorators: true,
  //   renderJsonPayloads: true
  // },
  imports: {
    dirs: ['models/**']
  }
})