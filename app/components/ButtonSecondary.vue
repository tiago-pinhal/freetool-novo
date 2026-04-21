<script setup lang="ts">
interface Props {
  isLoading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: string
}

defineProps<Props>()
defineEmits(['click'])
</script>

<template>
  <button 
    :type="type || 'button'"
    :disabled="disabled || isLoading"
    class="btn btn-secondary btn-lg px-8 rounded-2xl gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    @click="$emit('click', $event)"
  >
    <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
    <Icon v-else-if="icon" :name="icon" class="w-5 h-5" />
    <slot />
  </button>
</template>
