<script setup lang="ts">
const props = defineProps<{
  to: string
  icon: string
  title: string
  index?: number
  cols?: 3 | 4 | 5
}>()

const widthClasses = {
  3: 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]',
  4: 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]',
  5: 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-20px)]',
}

// Premium gradient combinations
const gradients = [
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-emerald-400 via-teal-500 to-cyan-500',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-sky-400 via-blue-500 to-indigo-600',
  'from-fuchsia-500 via-purple-600 to-violet-700',
  'from-lime-400 via-emerald-500 to-teal-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
]

const currentGradient = computed(() => gradients[(props.index || 0) % gradients.length])
</script>

<template>
  <NuxtLinkLocale
    :to="to"
    :class="[widthClasses[cols ?? 4], 'group relative p-[2px] rounded-3xl transition-all duration-500 h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer', `bg-gradient-to-br ${currentGradient}`]"
  >
    <!-- Card Inner -->
    <div class="relative flex-1 bg-base-300/95 backdrop-blur-xl rounded-[calc(1.5rem-1.5px)] px-6 py-5 flex flex-row items-center gap-5 transition-all duration-500 group-hover:bg-base-300/70" style="background-clip: padding-box;">

      <!-- Dynamic Glow overlay on hover -->
      <div
        aria-hidden="true"
        class="absolute inset-0 rounded-[calc(1.5rem-1.5px)] opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
        :class="`bg-gradient-to-br ${currentGradient}`"
      ></div>

      <!-- Icon Container -->
      <div class="shrink-0 w-14 h-14 rounded-2xl bg-base-content/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-base-content/10 transition-all duration-500">
        <Icon :name="icon" class="w-7 h-7 text-primary group-hover:brightness-125" aria-hidden="true" />
      </div>

      <h3 class="text-base font-bold text-base-content group-hover:text-white transition-colors leading-tight">
        {{ title }}
      </h3>

      <!-- Arrow icon -->
      <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-60 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
        <Icon name="heroicons:arrow-up-right" class="w-4 h-4 text-base-content" aria-hidden="true" />
      </div>
    </div>
  </NuxtLinkLocale>
</template>
