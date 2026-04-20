<template>
  <img
    :src="`https://api.iconify.design/${lib}:${name}`"
    :alt="name"
    class="icon"
  />
</template>

<script setup lang="ts">
interface Props {
  name: string
  lib?: string
}

withDefaults(defineProps<Props>(), {
  lib: 'heroicons'
})
</script>

<style scoped>
.icon {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
}
</style>
