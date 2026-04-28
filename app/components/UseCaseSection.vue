<script setup lang="ts">
type ListItem = string | {
  title: string
  description: string
}

interface Props {
  title: string
  description?: string
  items: ListItem[]
}

withDefaults(defineProps<Props>(), {
  items: () => []
})
</script>

<template>
  <section v-if="items.length > 0" class="pt-2">
    <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
      <Icon name="heroicons:check-badge-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
      {{ title }}
    </h2>
    <p v-if="description" class="mb-6 text-base-content/80 leading-relaxed">
      {{ description }}
    </p>
    <div class="bg-base-200/30 rounded-3xl p-8 border border-base-content/20">
      <ul class="grid sm:grid-cols-2 gap-x-8 gap-y-6 list-none p-0 m-0">
        <li 
          v-for="(item, index) in items" 
          :key="index" 
          class="flex gap-4"
        >
          <div class="mt-1 shrink-0">
            <Icon 
              name="heroicons:check-circle-20-solid" 
              class="text-success w-5 h-5" 
            />
          </div>
          <div v-if="typeof item === 'object'">
            <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">
              {{ item.title }}
            </strong>
            <span class="text-base-content/80 leading-relaxed">
              {{ item.description }}
            </span>
          </div>
          <div v-else>
            <span class="text-base-content leading-relaxed">
              {{ item }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
