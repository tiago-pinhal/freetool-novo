<script setup lang="ts">
const head = useLocaleHead({ dir: true, lang: true, seo: true })

useHead({
  htmlAttrs: {
    lang: () => head.value.htmlAttrs?.lang,
    dir: () => head.value.htmlAttrs?.dir as 'ltr' | 'rtl' | 'auto' | undefined
  },
  link: () => head.value.link || [],
  meta: () => [
    ...(head.value.meta || []),
    { property: 'og:image', content: 'https://www.freetool.dev/img/logo.png' },
    { name: 'twitter:image', content: 'https://www.freetool.dev/img/logo.png' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>