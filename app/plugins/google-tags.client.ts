/**
 * Loads Google Tag Manager when configured.
 *
 * All other tags (GA4, AdSense, Funding Choices) are managed, consented,
 * and fired directly within the GTM container.
 *
 * Critical contract with components/Adsense.vue:
 *   The Adsense component will check for window.adsbygoogle or gtmId.
 *   Initializing window.adsbygoogle here prevents runtime errors if
 *   components try to push ad requests before GTM loads the AdSense script.
 */

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    adsbygoogle: unknown[]
  }
}

function runWhenIdle(callback: () => void, timeout = 4000): void {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, { timeout })
    return
  }

  window.setTimeout(callback, 1)
}

/**
 * Injects the Google Tag Manager container when a container ID is configured.
 */
function injectGtmContainer(containerId: string): void {
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const gtmScript = document.createElement('script')
  gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + containerId
  gtmScript.async = true
  gtmScript.fetchPriority = 'low'
  document.head.appendChild(gtmScript)
}

export default defineNuxtPlugin(() => {
  if (!import.meta.env.PROD || !import.meta.client) return

  // Initialize globals synchronously to prevent runtime errors if components try to interact with them early
  window.adsbygoogle = window.adsbygoogle ?? []
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function (...args: unknown[]) { window.dataLayer.push(args) }

  const { public: { gtmId = '' } } = useRuntimeConfig()

  if (gtmId) {
    onNuxtReady(() => {
      runWhenIdle(() => {
        injectGtmContainer(gtmId)
      })
    })
  }
})
