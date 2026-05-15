import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const GA_ID = 'G-B57PC5L4JC'
const ADSENSE_CLIENT = 'ca-pub-6172875094663882'
const COOKIE_DOMAIN = '.freetool.dev'

const translations: Record<string, CookieConsent.Translation> = {
  en: {
    consentModal: {
      description: 'We use cookies to analyze traffic and serve ads. <a href="/privacy/" class="cc__link">Learn more</a>',
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Decline',
      showPreferencesBtn: 'Manage'
    },
    preferencesModal: {
      title: 'Cookie preferences',
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Reject all',
      savePreferencesBtn: 'Save',
      closeIconLabel: 'Close',
      sections: [
        { title: 'Strictly necessary', description: 'Required for the site to function.', linkedCategory: 'necessary' },
        { title: 'Analytics', description: 'Help us understand how visitors use the site.', linkedCategory: 'analytics' },
        { title: 'Advertising', description: 'Used to serve personalized ads via Google AdSense.', linkedCategory: 'ads' }
      ]
    }
  },
  pt: {
    consentModal: {
      description: 'Usamos cookies para analisar o tráfego e exibir anúncios. <a href="/privacy/" class="cc__link">Saiba mais</a>',
      acceptAllBtn: 'Aceitar todos',
      acceptNecessaryBtn: 'Recusar',
      showPreferencesBtn: 'Gerir'
    },
    preferencesModal: {
      title: 'Preferências de cookies',
      acceptAllBtn: 'Aceitar todos',
      acceptNecessaryBtn: 'Recusar todos',
      savePreferencesBtn: 'Guardar',
      closeIconLabel: 'Fechar',
      sections: [
        { title: 'Estritamente necessários', description: 'Necessários para o funcionamento do site.', linkedCategory: 'necessary' },
        { title: 'Análise', description: 'Ajudam-nos a perceber como os visitantes usam o site.', linkedCategory: 'analytics' },
        { title: 'Publicidade', description: 'Utilizados para exibir anúncios personalizados via Google AdSense.', linkedCategory: 'ads' }
      ]
    }
  },
  es: {
    consentModal: {
      description: 'Usamos cookies para analizar el tráfico y mostrar anuncios. <a href="/privacy/" class="cc__link">Más información</a>',
      acceptAllBtn: 'Aceptar todo',
      acceptNecessaryBtn: 'Rechazar',
      showPreferencesBtn: 'Gestionar'
    },
    preferencesModal: {
      title: 'Preferencias de cookies',
      acceptAllBtn: 'Aceptar todo',
      acceptNecessaryBtn: 'Rechazar todo',
      savePreferencesBtn: 'Guardar',
      closeIconLabel: 'Cerrar',
      sections: [
        { title: 'Estrictamente necesarias', description: 'Necesarias para el funcionamiento del sitio.', linkedCategory: 'necessary' },
        { title: 'Analítica', description: 'Nos ayudan a entender cómo los visitantes usan el sitio.', linkedCategory: 'analytics' },
        { title: 'Publicidad', description: 'Se usan para mostrar anuncios personalizados mediante Google AdSense.', linkedCategory: 'ads' }
      ]
    }
  },
  fr: {
    consentModal: {
      description: 'Nous utilisons des cookies pour analyser le trafic et afficher des publicités. <a href="/privacy/" class="cc__link">En savoir plus</a>',
      acceptAllBtn: 'Tout accepter',
      acceptNecessaryBtn: 'Refuser',
      showPreferencesBtn: 'Gérer'
    },
    preferencesModal: {
      title: 'Préférences de cookies',
      acceptAllBtn: 'Tout accepter',
      acceptNecessaryBtn: 'Tout refuser',
      savePreferencesBtn: 'Enregistrer',
      closeIconLabel: 'Fermer',
      sections: [
        { title: 'Strictement nécessaires', description: 'Nécessaires au fonctionnement du site.', linkedCategory: 'necessary' },
        { title: 'Analytique', description: 'Nous aident à comprendre comment les visiteurs utilisent le site.', linkedCategory: 'analytics' },
        { title: 'Publicité', description: 'Utilisés pour afficher des publicités personnalisées via Google AdSense.', linkedCategory: 'ads' }
      ]
    }
  },
  it: {
    consentModal: {
      description: 'Utilizziamo cookie per analizzare il traffico e mostrare annunci. <a href="/privacy/" class="cc__link">Scopri di più</a>',
      acceptAllBtn: 'Accetta tutto',
      acceptNecessaryBtn: 'Rifiuta',
      showPreferencesBtn: 'Gestisci'
    },
    preferencesModal: {
      title: 'Preferenze cookie',
      acceptAllBtn: 'Accetta tutto',
      acceptNecessaryBtn: 'Rifiuta tutto',
      savePreferencesBtn: 'Salva',
      closeIconLabel: 'Chiudi',
      sections: [
        { title: 'Strettamente necessari', description: 'Necessari per il funzionamento del sito.', linkedCategory: 'necessary' },
        { title: 'Analisi', description: 'Ci aiutano a capire come i visitatori usano il sito.', linkedCategory: 'analytics' },
        { title: 'Pubblicità', description: 'Usati per mostrare annunci personalizzati tramite Google AdSense.', linkedCategory: 'ads' }
      ]
    }
  },
  id: {
    consentModal: {
      description: 'Kami menggunakan cookie untuk menganalisis lalu lintas dan menampilkan iklan. <a href="/privacy/" class="cc__link">Pelajari lebih lanjut</a>',
      acceptAllBtn: 'Terima semua',
      acceptNecessaryBtn: 'Tolak',
      showPreferencesBtn: 'Kelola'
    },
    preferencesModal: {
      title: 'Preferensi cookie',
      acceptAllBtn: 'Terima semua',
      acceptNecessaryBtn: 'Tolak semua',
      savePreferencesBtn: 'Simpan',
      closeIconLabel: 'Tutup',
      sections: [
        { title: 'Sangat diperlukan', description: 'Diperlukan agar situs dapat berfungsi.', linkedCategory: 'necessary' },
        { title: 'Analitik', description: 'Membantu kami memahami cara pengunjung menggunakan situs.', linkedCategory: 'analytics' },
        { title: 'Iklan', description: 'Digunakan untuk menampilkan iklan yang dipersonalisasi melalui Google AdSense.', linkedCategory: 'ads' }
      ]
    }
  },
  de: {
    consentModal: {
      description: 'Wir verwenden Cookies, um den Datenverkehr zu analysieren und Werbung anzuzeigen. <a href="/privacy/" class="cc__link">Mehr erfahren</a>',
      acceptAllBtn: 'Alle akzeptieren',
      acceptNecessaryBtn: 'Ablehnen',
      showPreferencesBtn: 'Verwalten'
    },
    preferencesModal: {
      title: 'Cookie-Einstellungen',
      acceptAllBtn: 'Alle akzeptieren',
      acceptNecessaryBtn: 'Alle ablehnen',
      savePreferencesBtn: 'Speichern',
      closeIconLabel: 'Schließen',
      sections: [
        { title: 'Unbedingt erforderlich', description: 'Für das Funktionieren der Website erforderlich.', linkedCategory: 'necessary' },
        { title: 'Analyse', description: 'Helfen uns zu verstehen, wie Besucher die Website nutzen.', linkedCategory: 'analytics' },
        { title: 'Werbung', description: 'Werden verwendet, um personalisierte Anzeigen über Google AdSense zu schalten.', linkedCategory: 'ads' }
      ]
    }
  },
  nl: {
    consentModal: {
      description: 'We gebruiken cookies om verkeer te analyseren en advertenties weer te geven. <a href="/privacy/" class="cc__link">Meer informatie</a>',
      acceptAllBtn: 'Alles accepteren',
      acceptNecessaryBtn: 'Weigeren',
      showPreferencesBtn: 'Beheren'
    },
    preferencesModal: {
      title: 'Cookie-voorkeuren',
      acceptAllBtn: 'Alles accepteren',
      acceptNecessaryBtn: 'Alles weigeren',
      savePreferencesBtn: 'Opslaan',
      closeIconLabel: 'Sluiten',
      sections: [
        { title: 'Strikt noodzakelijk', description: 'Vereist voor het functioneren van de site.', linkedCategory: 'necessary' },
        { title: 'Analyse', description: 'Helpen ons te begrijpen hoe bezoekers de site gebruiken.', linkedCategory: 'analytics' },
        { title: 'Advertenties', description: 'Worden gebruikt om gepersonaliseerde advertenties via Google AdSense te tonen.', linkedCategory: 'ads' }
      ]
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  //document.documentElement.classList.add('cc--darkmode')

  const locale = (nuxtApp.$i18n as any)?.locale?.value as string || 'en'
  const supportedLocales = Object.keys(translations)
  const currentLocale = supportedLocales.includes(locale) ? locale : 'en'

  const { analyticsConsent, adsConsent } = useConsentState()

  let gaLoaded = false
  let adsLoaded = false

  const loadGA = () => {
    analyticsConsent.value = true
    if (!import.meta.env.PROD) return

    const w = window as any
    w[`ga-disable-${GA_ID}`] = false

    if (gaLoaded) {
      if (typeof w.gtag === 'function') {
        w.gtag('consent', 'update', { analytics_storage: 'granted' })
        w.gtag('config', GA_ID)
      }
      return
    }

    gaLoaded = true
    nuxtApp.runWithContext(() => {
      useHead({
        script: [
          { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true, tagPosition: 'head' },
          { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'granted'});gtag('js',new Date());gtag('config','${GA_ID}')`, tagPosition: 'head' }
        ]
      })
    })
  }

  const revokeGA = () => {
    analyticsConsent.value = false
    const w = window as any
    if (typeof w.gtag === 'function') {
      w.gtag('consent', 'update', { analytics_storage: 'denied' })
    }
    w[`ga-disable-${GA_ID}`] = true
  }

  const loadAds = () => {
    adsConsent.value = true
    if (adsLoaded || !import.meta.env.PROD) return
    adsLoaded = true
    nuxtApp.runWithContext(() => {
      useHead({
        script: [
          { src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`, async: true, crossorigin: 'anonymous' as any, tagPosition: 'head' }
        ]
      })
    })
  }

  const revokeAds = () => {
    adsConsent.value = false
  }

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'box',
        position: 'bottom left',
        equalWeightButtons: false
      }
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        autoClear: {
          cookies: [
            { name: /^_ga/, domain: COOKIE_DOMAIN },
            { name: '_gid', domain: COOKIE_DOMAIN },
            { name: /^_gat/, domain: COOKIE_DOMAIN }
          ]
        }
      },
      ads: {}
    },
    language: {
      default: currentLocale,
      translations
    },
    onConsent: () => {
      if (CookieConsent.acceptedCategory('analytics')) loadGA()
      if (CookieConsent.acceptedCategory('ads')) loadAds()
    },
    onChange: ({ changedCategories }) => {
      if (changedCategories.includes('analytics')) {
        CookieConsent.acceptedCategory('analytics') ? loadGA() : revokeGA()
      }
      if (changedCategories.includes('ads')) {
        CookieConsent.acceptedCategory('ads') ? loadAds() : revokeAds()
      }
    }
  })
})
