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
  modules: ['@element-plus/nuxt'],
  css: ['~/assets/scss/index.scss'],
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
        scss: { api: 'modern-compiler' },
        additionalData: `@use "@/assets/scss/element/index.scss" as element;`,
      }
    }
  }
})
