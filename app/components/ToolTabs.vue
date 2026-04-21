<script setup lang="ts">
interface Tab {
  id: string
  label: string
}

const props = defineProps<{
  tabs: Tab[]
  activeTab?: string
  name?: string
}>()

const emit = defineEmits(['update:activeTab'])

const groupName = props.name || `tabs_${Math.random().toString(36).substring(2, 9)}`

function handleTabChange(tabId: string) {
  emit('update:activeTab', tabId)
}
</script>

<template>
  <div class="tabs tabs-boxed bg-base-200 p-1.5 rounded-2xl border border-base-content/10 shadow-inner mb-8 w-fit mx-auto sm:mx-0">
    <template v-for="tab in tabs" :key="tab.id">
      <input
        type="radio"
        :name="groupName"
        class="tab !h-10 px-6 transition-all duration-300 font-semibold"
        :aria-label="tab.label"
        :checked="activeTab === tab.id"
        @change="handleTabChange(tab.id)"
      />
    </template>
  </div>

  <!-- Área de Conteúdo -->
  <div class="tab-content-wrapper min-h-[200px]">
    <div v-for="tab in tabs" :key="`${tab.id}-content`" v-show="activeTab === tab.id">
      <slot :name="tab.id"></slot>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/css/main.css";

.tab:checked {
  @apply bg-primary text-primary-content shadow-md !rounded-xl opacity-100 scale-[1.02];
}

.tab {
  @apply text-base-content/60 hover:text-base-content hover:bg-base-content/5 !rounded-xl transition-all duration-200;
}
</style>
