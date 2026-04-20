<script setup lang="ts">
useHead({
  title: '[Nome do Projeto] - Ferramenta Digital',
  meta: [
    { name: 'description', content: '[Descrição otimizada para SEO do seu projeto.]' }
  ]
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-24 sm:py-32">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl text-base-content">
          [Título Principal da <span class="text-primary italic">Landing Page]</span>
        </h1>
        <p class="mt-6 text-lg leading-8 text-base-content/70 max-w-2xl mx-auto">
          [Uma descrição persuasiva que explica o valor central do seu produto ou serviço para os usuários.]
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button class="btn btn-primary btn-lg shadow-xl">[Botão Principal]</button>
          <button class="btn btn-ghost btn-lg">[Saiba Mais]</button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-base-200/50 py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold sm:text-4xl">[Título da Seção de Recursos]</h2>
          <p class="mt-4 text-base-content/60">[Subtítulo explicativo sobre os benefícios.]</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="card bg-base-100 shadow-xl border border-base-content/5 hover:border-primary/30 transition-all cursor-default">
            <div class="card-body items-center text-center">
              <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary grid place-items-center text-3xl mb-4">?</div>
              <h3 class="card-title text-2xl">[Recurso {{ i }}]</h3>
              <p class="text-base-content/70">[Descrição curta do recurso ou benefício.]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
