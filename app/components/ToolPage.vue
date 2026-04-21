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
    <header class="mb-6 text-left">
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-base-content mb-3">
        {{ title }}
      </h1>
      <p v-if="description" class="text-lg text-base-content/60 max-w-2xl leading-relaxed">
        {{ description }}
      </p>
    </header>

    <!-- Área Principal da Ferramenta (Slot) -->
    <main class="bg-base-100 rounded-3xl shadow-sm border border-primary/20 p-6 sm:p-10 mb-8">
      <slot />
    </main>

    <!-- Seção de Anúncios Central (Condicional) -->
    <div v-if="showAds" class="mb-8">
      <Adsense v-once />
    </div>

    <!-- Informações Detalhadas (ToolInfo) -->
    <ToolInfo 
      v-if="infoDescription"
      :title="infoTitle"
      :description="infoDescription"
      :wiki-url="wikiUrl"
      :wiki-label="wikiLabel"
    />

    <!-- Links Relacionados (SeeAlso) -->
    <SeeAlso 
      v-if="seeAlsoLinks && seeAlsoLinks.length > 0"
      :links="seeAlsoLinks" 
    />
  </div>
</template>
