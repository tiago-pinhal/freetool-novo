<script setup lang="ts">
const props = defineProps<{
  adSlot?: string
  adFormat?: string
  responsive?: string
}>()

const insRef = ref<HTMLElement>()
const isDev = import.meta.dev
const { onLoaded } = useScriptGoogleAdsense()

const reservedHeight = computed(() => {
  if (!props.adFormat || props.adFormat === 'auto' || props.adFormat === 'vertical') {
    return 'min-h-[280px]'
  }
  return 'min-h-[100px]'
})

onLoaded(async () => {
  await nextTick()
  if (!insRef.value || insRef.value.offsetWidth === 0) return
  try {
    // @ts-ignore
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {
    console.warn('AdSense:', e)
  }
})
</script>

<template>
  <div 
    class="adsense-wrapper w-full flex justify-center items-center bg-base-200/20 rounded-xl overflow-hidden relative transition-all duration-300"
    :class="reservedHeight"
  >
    <div v-if="isDev" class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="text-center">
        <span class="text-[10px] uppercase tracking-widest font-bold text-base-content/50 border border-base-content/5 px-4 py-2 rounded-full block mb-2">
          Google Adsense (Dev Mode)
        </span>
        <div class="text-xs text-base-content/50 italic">
          Format: {{ adFormat || 'auto' }} | ID: {{ adSlot || 'default' }}
        </div>
      </div>
    </div>

    <ins v-else
      ref="insRef"
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-6172875094663882"
      :data-ad-slot="adSlot || '9118007770'"
      :data-ad-format="adFormat || 'auto'"
      :data-full-width-responsive="responsive || 'true'"
    ></ins>
  </div>
</template>