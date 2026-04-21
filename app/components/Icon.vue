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
  let [prefix, iconName] = props.name.includes(':') 
    ? props.name.split(':') 
    : [props.lib, props.name]

  // Clean the icon name from extensions or queries
  iconName = iconName.split('.')[0].split('?')[0]
  
  const url = `https://api.iconify.design/${prefix}/${iconName}.svg`
  return {
    maskImage: `url("${url}")`,
    WebkitMaskImage: `url("${url}")`
  }
})
</script>