// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
  ],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  nitro: {
    storage: {
      'data': {
        driver: 'fs',
        base: './.data/storage'
      }
    }
  }
})
