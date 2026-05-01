<script setup lang="ts">
type AdFormat = 'auto' | 'horizontal' | 'vertical' | 'rectangle' | 'fluid'

const props = withDefaults(defineProps<{
  adSlot?: string
  adFormat?: AdFormat
  responsive?: boolean
}>(), {
  adFormat: 'auto',
  responsive: true
})

const insRef = ref<HTMLElement>()
const isDev = import.meta.dev
const { onLoaded } = useScriptGoogleAdsense()

const reservedHeight = computed(() => {
  switch (props.adFormat) {
    case 'vertical':
      return 'min-h-[600px]'
    case 'horizontal':
      return 'min-h-[90px]'
    case 'rectangle':
      return 'min-h-[250px]'
    case 'fluid':
      return 'min-h-[200px]'
    case 'auto':
    default:
      // Mobile: retângulo (280px) | Desktop: banner (90px)
      return 'min-h-[280px] sm:min-h-[90px]'
  }
})

onLoaded(async () => {
  await nextTick()
  if (!insRef.value || insRef.value.offsetWidth === 0) return
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {
    if (isDev) console.warn('AdSense push failed:', e)
  }
})
</script>

<template>
  <div
    class="adsense-wrapper w-full flex justify-center items-center rounded-xl overflow-hidden relative"
    :class="reservedHeight"
  >
    <!-- Placeholder para ambiente de desenvolvimento -->
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

    <!-- Anúncio real em produção -->
    <ins
      v-else
      ref="insRef"
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-6172875094663882"
      :data-ad-slot="adSlot || '9118007770'"
      :data-ad-format="adFormat"
      :data-full-width-responsive="String(responsive)"
    />
  </div>
</template>