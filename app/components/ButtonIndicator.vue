<script setup lang="ts">
const props = defineProps<{
  ariaLabel?: string
}>()

const emit = defineEmits(['onClick'])

const check = ref(false)

function handleClick() {
  if (check.value) return 
  
  check.value = true
  setTimeout(() => {
    check.value = false
  }, 2000)
  
  emit('onClick')
}
</script>

<template>
  <button 
    type="button" 
    @click.prevent="handleClick" 
    class="relative group transition-all duration-300 active:scale-90"
    :aria-label="ariaLabel"
  >
    <slot />
    
    <!-- Indicador de Sucesso com aria-live para anunciar a cópia -->
    <div class="sr-only" aria-live="polite">
      {{ check ? 'Copiado com sucesso' : '' }}
    </div>
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-0 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-0 opacity-0"
    >
      <div 
        v-show="check" 
        class="absolute -top-2 -right-2 w-5 h-5 bg-success text-success-content rounded-full flex items-center justify-center shadow-lg border-2 border-base-100 z-20"
      >
        <Icon name="heroicons:check-16-solid" class="w-3 h-3" />
      </div>
    </Transition>
  </button>
</template>
