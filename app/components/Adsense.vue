<script setup lang="ts">
/**
 * Single Google AdSense unit.
 *
 * Responsibilities (single responsibility):
 *  - Render exactly one <ins class="adsbygoogle"> when ad consent is granted.
 *  - Trigger the AdSense fill request only ONCE, and only AFTER the AdSense
 *    script is loaded and the slot has a non-zero width. Pushing while the slot
 *    is 0px wide (hydration under <ClientOnly>, sticky aside, breakpoint not
 *    yet applied) makes
 *    AdSense read the slot as 0x0 and reply `unfilled` permanently.
 *  - Stay SSR-safe and clean up its own observer.
 *
 * NOT handled here on purpose: layout / breakpoint decisions (e.g. "show the
 * vertical unit on desktop only"). That is the parent's concern. A `vertical`
 * unit requested on a narrow mobile viewport has no inventory and returns
 * `unfilled`, so the parent must simply not mount a vertical slot on mobile.
 */

type AdFormat = 'auto' | 'horizontal' | 'vertical' | 'rectangle' | 'fluid'

const props = withDefaults(defineProps<{
  adSlot?: string
  adFormat?: AdFormat
  responsive?: boolean
}>(), {
  adFormat: 'auto',
  responsive: true,
})

const insRef = ref<HTMLElement | null>(null)
const isDev = import.meta.dev
const { public: { gtmId = '' } } = useRuntimeConfig()

declare global {
  interface Window {
    __freetoolAdsenseReady?: boolean
    __freetoolNextAdPushAt?: number
  }
}

let resizeObserver: ResizeObserver | null = null
let removeReadyListener: (() => void) | null = null
let hasPushed = false
let hasScheduledPush = false

const reservedHeight = computed(() => {
  switch (props.adFormat) {
    case 'vertical':
      return 'min-h-[250px] sm:min-h-[600px]'
    case 'horizontal':
      return 'min-h-[280px] sm:min-h-[90px]'
    case 'rectangle':
      return 'min-h-[250px]'
    case 'fluid':
      return 'min-h-[200px]'
    default:
      return 'min-h-[280px] sm:min-h-[90px]'
  }
})

function runWhenIdle(callback: () => void, timeout = 3000): void {
  const requestIdleCallback = window.requestIdleCallback
  if (requestIdleCallback) {
    requestIdleCallback(callback, { timeout })
    return
  }

  window.setTimeout(callback, 1)
}

function scheduleAdsensePush(callback: () => void): void {
  const now = Date.now()
  const nextPushAt = window.__freetoolNextAdPushAt ?? 0
  const wait = Math.max(0, nextPushAt - now)
  window.__freetoolNextAdPushAt = now + wait + 600

  window.setTimeout(() => runWhenIdle(callback), wait)
}

function disconnectObserver(): void {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

function clearReadyListener(): void {
  if (removeReadyListener) {
    removeReadyListener()
    removeReadyListener = null
  }
}

/**
 * Attempts the AdSense fill request.
 * Returns true once the attempt is settled (so callers stop retrying):
 *  - true  -> pushed, or already filled by something else, or push errored
 *             (no point retrying an errored/duplicate push)
 *  - false -> not laid out yet (width 0); caller should keep waiting
 */
function tryPush(): boolean {
  if (hasPushed || hasScheduledPush) return true
  if (!window.__freetoolAdsenseReady) return false

  const el = insRef.value
  if (!el) return false

  // Belt-and-suspenders: if this <ins> was already processed, do not push
  // again (AdSense throws "All ins elements already have ads").
  if (el.getAttribute('data-adsbygoogle-status')) {
    hasPushed = true
    return true
  }

  // The decisive guard: a 0-width slot is interpreted as 0x0 -> unfilled.
  if (el.offsetWidth === 0) return false

  hasScheduledPush = true
  scheduleAdsensePush(() => {
    if (hasPushed) return

    hasPushed = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      if (isDev) console.warn('[Adsense] push failed:', error)
    }
  })
  return true
}

function startFillWhenReady(): void {
  if (!import.meta.client) return

  if (window.__freetoolAdsenseReady) {
    startFillWhenVisible()
    return
  }

  if (removeReadyListener) return

  const onReady = () => {
    clearReadyListener()
    startFillWhenVisible()
  }

  window.addEventListener('freetool:adsense-ready', onReady, { once: true })
  removeReadyListener = () => window.removeEventListener('freetool:adsense-ready', onReady)
}

function startFillWhenVisible(): void {
  // Browser-only: ResizeObserver / window do not exist during SSR.
  if (!import.meta.client) return

  // Fast path: slot already has a real width.
  if (tryPush()) return

  const el = insRef.value
  if (!el) return

  // Width is 0 right now. Observe the slot and push the moment it gets a
  // real width (layout settled / breakpoint applied), then stop observing.
  // If the slot stays hidden (e.g. desktop-only unit on mobile), width
  // stays 0, the push never fires, and no wasted `unfilled` request is made.
  resizeObserver = new ResizeObserver(() => {
    if (tryPush()) disconnectObserver()
  })
  resizeObserver.observe(el)
}

watch(
  insRef,
  async (el) => {
    if (!el) return
    // Wait a tick for the DOM element to be fully integrated
    await nextTick()
    startFillWhenReady()
  },
  { immediate: true },
)

onScopeDispose(() => {
  disconnectObserver()
  clearReadyListener()
})
</script>

<template>
  <div
    class="adsense-wrapper w-full flex justify-center items-center rounded-xl overflow-hidden relative"
    :class="reservedHeight"
  >
    <div
      v-if="isDev"
      class="absolute inset-0 flex items-center justify-center pointer-events-none bg-base-200/20"
    >
      <div class="text-center">
        <span class="text-[10px] uppercase tracking-widest font-bold text-base-content border border-base-content/10 px-4 py-2 rounded-full block mb-2">
          Google Adsense (Dev Mode)
        </span>
        <div class="text-xs text-base-content/60 italic">
          Format: {{ adFormat }} | Slot: {{ adSlot || 'default' }}
        </div>
      </div>
    </div>

    <ClientOnly v-else>
      <!--
        width:100% is REQUIRED, not cosmetic. The wrapper is a flex
        container (justify-center / items-center); a bare display:block
        child with no width collapses to its content width, and an empty
        <ins> has zero content => offsetWidth stays 0 even on desktop with
        a settled layout. AdSense then reads the slot as 0x0 and replies
        `unfilled`. width:100% makes the slot inherit the wrapper width so
        the ResizeObserver can measure a real size and the push can fire.
      -->
      <ins
        ref="insRef"
        class="adsbygoogle"
        style="display:block; width:100%"
        data-ad-client="ca-pub-6172875094663882"
        :data-ad-slot="adSlot || '5577057946'"
        :data-ad-format="adFormat"
        :data-full-width-responsive="String(responsive)"
      />
    </ClientOnly>
  </div>
</template>