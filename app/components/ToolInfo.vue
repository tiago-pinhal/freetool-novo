<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

interface Props {
  title?: string
  description?: string
  wikiUrl?: string
  wikiLabel?: string
}

defineProps<Props>()
</script>

<template>
  <section class="mt-8 bg-base-200 rounded-xl p-4 border border-base-content/20">
    <div>
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-info/20 flex items-center justify-center">
          <Icon name="heroicons:information-circle-20-solid" class="w-6 h-6 text-info" aria-hidden="true" />
        </div>
        <h2 class="text-2xl font-bold text-base-content">
          {{ title || t('about') }}
        </h2>
      </div>

      <div class="prose prose-sm max-w-none text-base-content/90 leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-base-content [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2 [&_h2]:mb-4">
        <p v-if="description">
          {{ description }}
        </p>
        <!-- Slot para conteúdo extra ou listas -->
        <slot />
      </div>

      <div v-if="wikiUrl" class="mt-8 pt-6 border-t border-info/10 flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-base-content">{{ t('label') }}</span>
        <a 
          :href="wikiUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-sm font-semibold text-info hover:brightness-110 transition-all group/link"
        >
          <!-- <Icon name="mdi:wikipedia" class="w-5 h-5" aria-hidden="true" /> -->
          <span class="border-b border-transparent group-hover/link:border-info">
            {{ wikiLabel || 'Wikipedia' }}
          </span>
          <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>

<i18n lang="yaml">
en:
  about: "About this tool"
  label: "Recommended Reading:"
pt:
  about: "Sobre esta ferramenta"
  label: "Leitura Recomendada:"
es:
  about: "Sobre esta herramienta"
  label: "Lectura Recomendada:"
fr:
  about: "À propos de cet outil"
  label: "Lecture recommandée :"
it:
  about: "Informazioni su questo strumento"
  label: "Lettura consigliata:"
id:
  about: "Tentang alat ini"
  label: "Bacaan yang Disarankan:"
</i18n>

<style scoped>
@reference "../assets/css/main.css";

/* Estilização para links dentro da descrição caso venham via slot ou string */
:deep(a) {
  @apply text-info font-medium hover:underline;
}
</style>
