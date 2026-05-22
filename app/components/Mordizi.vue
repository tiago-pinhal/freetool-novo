<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })
</script>

<template>
  <div v-if="locale === 'pt'" class="w-fit mt-4">
    <div class="flex items-center gap-4 rounded-xl border border-orange-500/30 bg-orange-950/30 px-4 py-3">
      <img src="https://www.freetool.dev/img/mordizi.webp" alt="Mordizi" class="w-12 h-12 rounded-xl shrink-0" />
      <div class="flex flex-col gap-1">
        <span class="text-orange-400 font-semibold text-sm leading-tight">{{ t('label') }}</span>
        <span class="text-white font-bold text-base leading-tight">{{ t('title') }}</span>
        <span class="text-gray-300 text-sm leading-snug max-w-xs">{{ t('desc') }}</span>
        <div class="flex gap-2 mt-1">
          <a
            href="https://www.mordizi.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium px-3 py-1 rounded-lg border border-orange-500/50 hover:bg-orange-950/60 text-orange-300 transition-colors"
          >{{ t('btnSite') }}</a>
          <a
            href="https://play.google.com/store/apps/details?id=com.mordizi&hl=pt_BR"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium px-3 py-1 rounded-lg border border-orange-500/50 hover:bg-orange-950/60 text-orange-300 transition-colors"
          >{{ t('btnPlay') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
{
  pt: {
    label: "Conheça nosso novo sistema",
    title: "Mordizi — Cardápio Digital Interativo",
    desc: "Receba pedidos organizados diretamente no seu WhatsApp.",
    btnSite: "Site",
    btnPlay: "Google Play"
  }
}
</i18n>
