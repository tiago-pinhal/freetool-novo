import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/i18n', '@nuxt/scripts'],

  scripts: {
    registry: {
      googleAdsense: {
        client: process.env.NODE_ENV === 'production' 
          ? 'ca-pub-6172875094663882' 
          : 'ca-pub-3940256099942544'
      }
    }
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
      }
    ],
    defaultLocale: 'en',
    strategy: "prefix_except_default",
    trailingSlash: true
  }
})