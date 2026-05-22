<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()
const isHomePage = computed(() => route.path === localePath('/'))
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TheHeader />
    <div class="drawer flex-1">
      <input id="main-drawer" type="checkbox" class="drawer-toggle" aria-label="Toggle menu" />
      <div 
        class="drawer-content flex flex-col transition-[margin] duration-300"
        :class="{ 'lg:ml-14': !isHomePage }"
      >
        <div class="flex flex-grow flex-col lg:flex-row lg:items-start gap-4">
          <main class="flex-1 min-w-0">
            <slot />
          </main>
          <AdSidebar />
        </div>
        <TheFooter />
      </div>
      <Drawer />
    </div>
  </div>
</template>
