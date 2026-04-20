<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-content/10">
    <aside>
      <p class="text-sm opacity-70">
        &copy; {{ currentYear }} <span class="font-bold">FreeTool.dev</span>. Todos os direitos reservados.
      </p>
    </aside>
  </footer>
</template>

