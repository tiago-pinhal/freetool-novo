const GA_ID = 'G-B57PC5L4JC'
const ADSENSE_CLIENT = 'ca-pub-6172875094663882'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.env.PROD || !import.meta.client) return

  nuxtApp.runWithContext(() => {
    useHead({
      script: [
        // 1. Consent Mode — deve rodar ANTES do GA4 e AdSense inicializarem
        {
          innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'})`,
          tagPosition: 'head'
        },
        // 2. AdSense — mantém async (precisa inicializar cedo para preencher os slots de anúncio)
        {
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
          async: true,
          crossorigin: 'anonymous',
          tagPosition: 'head'
        },
        // 3. Funding Choices — painel de consentimento de anúncios (GDPR)
        {
          src: `https://fundingchoicesmessages.google.com/i/pub-6172875094663882?ers=1`,
          async: true,
          tagPosition: 'head'
        },
        {
          innerHTML: `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`,
          tagPosition: 'head'
        }
      ]
    })

    // 4. GA4 — carrega quando o browser está ocioso (após o LCP)
    // trigger: 'idle' evita bloquear a thread principal durante o carregamento inicial
    // Os eventos de pageview são enfileirados no dataLayer e processados quando o script carrega
    useScriptGoogleAnalytics({ id: GA_ID }, { trigger: 'idle' })
  })
})
