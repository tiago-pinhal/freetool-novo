import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-PDBB7DS'
    }
  },

  nitro: {
    preset: 'cloudflare-pages-static',
    prerender: {
      concurrency: 6,
      crawlLinks: true,
      routes: ['/']
    }
  },

  features: {
    inlineStyles: true
  },

  modules: ['@nuxtjs/i18n', '@nuxt/scripts', '@nuxtjs/sitemap'],

  site: {
    url: 'https://www.freetool.dev'
  },

  sitemap: {
    zeroRuntime: true
  },

  sourcemap: {
    server: false,
    client: false
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
        { rel: 'preconnect', href: 'https://api.iconify.design' },
        { rel: 'preconnect', href: 'https://pagead2.googlesyndication.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fundingchoicesmessages.google.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
        { rel: 'dns-prefetch', href: 'https://googleads.g.doubleclick.net' }
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
      },
      {
        code: 'ru',
        name: 'Русский',
        language: 'ru'
      }
    ],
    defaultLocale: 'en',
    strategy: "prefix_except_default",
    trailingSlash: true
  }
})