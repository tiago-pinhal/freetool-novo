<script setup lang="ts">

const props = defineProps<{
  adSlot?: string
  adFormat?: string
  responsive?: string
}>()

const insRef = ref<HTMLElement>()
const isDev = import.meta.dev
const { onLoaded } = useScriptGoogleAdsense()

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
  <div class="adsense-wrapper w-full flex justify-center bg-base-200/20 rounded-xl overflow-hidden min-h-[250px] relative">
   
    <div v-if="isDev" class="absolute inset-0 pointer-events-none">
      <span class="text-[10px] uppercase tracking-widest font-bold text-base-content/50 border border-base-content/5 px-4 py-2 rounded-full">
        Google Adsense (Dev Mode)
      </span>
    </div>

    <ins v-else
      ref="insRef"
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-3940256099942544"
      :data-ad-slot="adSlot || '1234567890'"
      :data-ad-format="adFormat || 'auto'"
      :data-full-width-responsive="responsive || 'true'"
    ></ins>
  </div>
</template>