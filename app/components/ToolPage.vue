<script setup lang="ts">
interface Props {
  title: string
  description?: string
  infoTitle?: string
  infoDescription?: string
  wikiUrl?: string
  wikiLabel?: string
  seeAlsoLinks?: Array<{ label: string; to: string }>
  showAds?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAds: true
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 pt-8 pb-8 lg:pb-12">
    <!-- Cabeçalho da Ferramenta -->
    <div class="mb-6 text-left">
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-base-content mb-3">
        {{ title }}
      </h1>
      <p v-if="description" class="text-lg text-base-content leading-relaxed">
        {{ description }}
      </p>
    </div>

    <!-- Área Principal da Ferramenta (Slot) -->
    <div class="bg-base-100 rounded-xl shadow-sm border border-primary/20 p-4">
      <slot />
    </div>

    <!-- Seção de Anúncios Central (Condicional) -->
    <div v-if="showAds" class="mb-8">
      <Adsense v-once />
    </div>

    <!-- Informações Detalhadas (ToolInfo) -->
    <ToolInfo 
      v-if="infoDescription || $slots.info"
      :title="infoTitle"
      :description="infoDescription"
      :wiki-url="wikiUrl"
      :wiki-label="wikiLabel"
    >
      <slot name="info" />
    </ToolInfo>

    <!-- Links Relacionados (SeeAlso) -->
    <SeeAlso 
      v-if="seeAlsoLinks && seeAlsoLinks.length > 0"
      :links="seeAlsoLinks" 
    />
  </div>
</template>
