<script setup lang="ts">
interface Option {
  label: string | number
  value: any
}

interface Props {
  label?: string
  modelValue: any
  options: Option[]
  placeholder?: string
}

defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const id = useId()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const parsed = Number(target.value)
  emit('update:modelValue', isNaN(parsed) ? target.value : parsed)
}
</script>

<template>
  <div class="form-control w-full">
    <label v-if="label" :for="id" class="label cursor-pointer">
      <span class="label-text font-bold text-base-content text-xs uppercase tracking-wider">
        {{ label }}
      </span>
    </label>
    <select 
      :id="id"
      :value="modelValue" 
      class="select select-bordered select-lg bg-base-200 rounded-2xl w-full transition-all duration-300 focus:border-primary"
      @change="handleChange"
      :aria-label="!label ? placeholder : undefined"
    >
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>

.select:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
