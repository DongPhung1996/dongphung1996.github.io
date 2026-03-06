// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt'
  ],
  ssr: true,
  devtools: {
    enabled: true
  },
  app: {
    // Thay 'my-english-pod' bằng tên Repository của bạn trên GitHub
    baseURL: '/',
    buildAssetsDir: 'assets',
    head: {
      // 1. Title chính của trang web
      title: 'EnglishPod - Luyện nghe Tiếng Anh mỗi ngày',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Học tiếng Anh qua EnglishPod với đầy đủ audio, transcript và từ vựng bài bản. Cải thiện kỹ năng nghe nói tự nhiên nhất.', 
        },
        { property: 'og:title', content: 'EnglishPod - Học Tiếng Anh Giao Tiếp' },
        { property: 'og:description', content: 'Kho tàng bài học tiếng Anh giao tiếp thú vị, giúp bạn nghe hiểu người bản xứ dễ dàng.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image.png' },
        { name: 'keywords', content: 'englishpod, học tiếng anh, luyện nghe tiếng anh, english podcast' }
      ],
      link: [
        // 5. Favicon (Icon nhỏ trên tab trình duyệt)
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',
  nitro: {
    static: true
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
