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

withDefaults(defineProps<Props>(), {
  showAds: false
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
    <section 
      :aria-label="title" class="bg-base-100 text-base-content rounded-xl shadow-sm border border-primary/20 p-4"
    >
      <slot />
    </section>

    <!-- Seção de Anúncios Central (Condicional) -->
    <Transition
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="transition duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="showAds" class="my-8">
        <Adsense v-once />
      </div>
    </Transition>

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