<script setup lang="ts">
defineProps<{
  to: string
  icon: string
  title: string
  gradient?: string
}>()
</script>

<template>
  <NuxtLinkLocale
    :to="to"
    class="group relative p-8 rounded-3xl bg-base-200/40 backdrop-blur-md border border-base-content/5 transition-all duration-500 hover:-translate-y-2 hover:border-primary/60 hover:shadow-[0_0_30px_-5px_var(--color-primary)] hover:bg-base-200/60 h-full flex flex-col items-center justify-center text-center"
  >
    <!-- Background Glow intensity (optional/subtle) -->
    <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 shadow-[inset_0_0_20px_var(--color-primary)] transition-opacity duration-500 pointer-events-none"></div>

    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
      <Icon :name="icon" class="w-8 h-8 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
    </div>
    
    <h3 class="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
      {{ title }}
    </h3>

    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <Icon name="arrow-up-right" class="w-5 h-5 text-base-content/30" aria-hidden="true" />
    </div>
  </NuxtLinkLocale>
</template>
