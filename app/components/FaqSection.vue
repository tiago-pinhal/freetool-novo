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

const name = useId()

withDefaults(defineProps<Props>(), {
  icon: 'heroicons:question-mark-circle',
  items: () => []
})
</script>

<template>
  <section v-if="items.length > 0">
    <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
      <Icon :name="icon" class="text-primary w-6 h-6" aria-hidden="true" />
      {{ title }}
    </h2>
    <div class="space-y-4">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="collapse collapse-arrow bg-base-200/50 border border-base-content/20 rounded-2xl"
      >
        <input 
          type="radio" 
          :name="name" 
          :checked="index === 0" 
          :aria-label="item.question"
        /> 
        <div class="collapse-title text-lg font-bold text-base-content hover:text-primary transition-colors">
          {{ item.question }}
        </div>
        <div class="collapse-content text-base-content/90 leading-relaxed pb-4">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
