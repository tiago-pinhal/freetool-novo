import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  nitro: {
    preset: 'static',
    prerender: {
      concurrency: 5
    }
  },

  modules: ['@nuxtjs/i18n', '@nuxt/scripts', '@nuxtjs/sitemap'],

  site: {
    url: 'https://www.freetool.dev'
  },

  sitemap: {
    zeroRuntime: true
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        'data-theme': 'night'
      },
      meta: [
        { name: 'author', content: 'Tiago A. M. Pinhal' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://api.iconify.design' }
      ]
    }
  },

  hooks: {
    'nitro:config'(nitroConfig) {
      if (nitroConfig.imports) {
        nitroConfig.imports.imports = (nitroConfig.imports.imports || []).filter(
          (i: any) => i.name !== 'useAppConfig'
        )
      }
    }
  },

  i18n: {
    baseUrl: 'https://www.freetool.dev',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en',
        isCatchallLocale: true
      },
      {
        code: 'pt',
        name: 'Português',
        language: 'pt'
      },
      {
        code: 'es',
        name: 'Español',
        language: 'es'
      },
      {
        code: 'fr',
        name: 'Français',
        language: 'fr'
      },
      {
        code: 'it',
        name: 'Italiano',
        language: 'it'
      },
      {
        code: 'id',
        name: 'Bahasa Indonesia',
        language: 'id'
      },
      {
        code: 'de',
        name: 'Deutsch',
        language: 'de'
      },
      {
        code: 'nl',
        name: 'Nederlands',
        language: 'nl'
      }
    ],
    defaultLocale: 'en',
    strategy: "prefix_except_default",
    trailingSlash: true
  }
})