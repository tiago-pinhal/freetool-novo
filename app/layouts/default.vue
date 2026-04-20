<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()
const isHomePage = computed(() => route.path === localePath('/'))
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TheHeader />
    <div class="drawer flex-1">
      <input id="main-drawer" type="checkbox" class="drawer-toggle" />
      <div 
        class="drawer-content flex flex-col transition-all duration-300"
        :class="{ 'lg:ml-20': !isHomePage }"
      >
        <main class="flex-grow">
          <slot />
        </main>
        <TheFooter />
      </div>
      <Drawer />
    </div>
  </div>
</template>
