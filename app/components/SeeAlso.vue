<script setup lang="ts">
interface Links {
  label: string
  to: string
}

defineProps<{
  links: Links[]
}>()

const { t } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()
</script>

<template>
  <section class="mt-8">
    <div class="flex items-center gap-4 mb-8">
      <h2 class="text-sm font-bold text-base-content uppercase tracking-widest">
        {{ t('see') }}
      </h2>
      <div class="h-px flex-1 bg-base-content/10"></div>
    </div>

    <nav class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink v-for="(link, idx) in links" :key="idx" :to="localePath(link.to)"
        class="group flex items-center justify-between p-4 bg-base-200 hover:bg-base-200 rounded-2xl border border-base-content/10 hover:border-primary/30 transition-all duration-300 active:scale-[0.98] cursor-pointer">
        <span class="font-medium text-base-content group-hover:text-primary transition-colors">
          {{ link.label }}
        </span>
        <Icon name="heroicons:arrow-small-right-20-solid"
          class="w-5 h-5 text-base-content/50 group-hover:text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </section>
</template>

<i18n lang="yaml">
{
    en: {
      see: "See also"
    },
    pt: {
      see: "Veja também"
    },
    es: {
      see: "Ver también"
    },
    fr: {
      see: "Voir aussi"
    },
    it: {
      see: "Vedi anche"
    },
    id: {
      see: "Lihat juga"
    },
    de: {
      see: "Siehe auch"
    },
    nl: {
      see: "Zie ook"
    },
    ru: {
      see: "Смотрите также"
    }
}
</i18n>
