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
  modules: ['@element-plus/nuxt', 'nuxt-codemirror'],
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
  },
  nitro: {
    devProxy: {
      "/api": {
        target: apiPath,
        changeOrigin: true,
        prependPath: true,
      }
    },
    routeRules: {
      '/api/**': {
        proxy: `${apiPath}/**`
      }
    }
  }
})