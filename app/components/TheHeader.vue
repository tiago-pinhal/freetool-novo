<script setup lang="ts">
const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Ferramentas', href: '#' },
  { name: 'Sobre', href: '#' },
  { name: 'Contato', href: '#' },
]
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-base-content/10 bg-base-100/80 backdrop-blur-md">
    <div class="navbar container mx-auto px-4">
      <div class="flex-1">
        <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold">
          <div class="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-content">?</div>
          <span>[Brand]</span>
        </NuxtLink>
      </div>

      <div class="flex-none">
        <ul class="menu menu-horizontal hidden px-1 md:flex gap-2">
          <li v-for="link in navLinks" :key="link.name">
            <NuxtLink :to="link.href" class="rounded-lg">{{ link.name }}</NuxtLink>
          </li>
        </ul>
        
        <div class="ml-4 flex items-center gap-2">
          <button class="btn btn-primary btn-sm md:btn-md">[Action]</button>
          
          <!-- Mobile Menu Icon (Placeholder) -->
          <button class="btn btn-ghost btn-square md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
