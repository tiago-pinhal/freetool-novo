<template>
  <span
    class="iconify"
    :style="maskStyle"
    role="img"
    :aria-label="name"
  ></span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  lib?: string
}>(), {
  lib: 'heroicons'
})

const maskStyle = computed(() => {
  // Ensure the name doesn't already have .svg or queries if we are adding them
  const cleanName = props.name.split('.')[0].split('?')[0]
  const url = `https://api.iconify.design/${props.lib}/${cleanName}.svg`
  return {
    maskImage: `url("${url}")`,
    WebkitMaskImage: `url("${url}")`
  }
})
</script>