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
  <div class="max-w-4xl mx-auto px-4 py-12 lg:py-20">
    <!-- Cabeçalho da Ferramenta -->
    <header class="mb-12 text-center sm:text-left">
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-base-content mb-6">
        {{ title }}
      </h1>
      <p v-if="description" class="text-lg text-base-content/60 max-w-2xl leading-relaxed">
        {{ description }}
      </p>
    </header>

    <!-- Área Principal da Ferramenta (Slot) -->
    <main class="bg-base-100 rounded-3xl shadow-sm border border-base-content/5 p-6 sm:p-10 mb-16">
      <slot />
    </main>

    <!-- Seção de Anúncios Central (Condicional) -->
    <div v-if="showAds" class="mb-16">
      <Adsense />
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
