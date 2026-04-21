<script setup lang="ts">
interface FaqItem {
  question: string
  answer: string
}

interface Props {
  title: string
  items: FaqItem[]
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'heroicons:question-mark-circle',
  items: () => []
})
</script>

<template>
  <section v-if="items.length > 0">
    <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
      <Icon :name="icon" class="text-primary w-6 h-6" />
      {{ title }}
    </h2>
    <div class="space-y-4">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="collapse collapse-arrow bg-base-200/50 border border-base-content/5 rounded-2xl"
      >
        <input type="radio" name="faq-accordion" :checked="index === 0" /> 
        <div class="collapse-title text-lg font-bold text-base-content hover:text-primary transition-colors">
          {{ item.question }}
        </div>
        <div class="collapse-content text-base-content/60 leading-relaxed pb-4">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
