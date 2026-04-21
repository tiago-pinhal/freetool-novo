<script setup lang="ts">
const props = defineProps<{
  content: any
  label: string
}>()

const { t } = useI18n({ useScope: 'local' })

const copied = ref(false)

async function copy() {
  const text = props.content?.toString() ?? ''
  if (!text || copied.value) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Falha ao copiar:', err)
  }
}
</script>

<template>
  <div v-if="content" class="my-6">
    <span class="text-xs font-bold uppercase tracking-wider text-base-content/50 px-1">
      {{ label }}:
    </span>

    <div
      class="mt-2 flex items-center gap-3 p-3 pl-5 rounded-2xl border transition-all duration-300 group max-w-full overflow-hidden"
      :class="copied
        ? 'bg-base-200 border-success/50 shadow-[0_0_0_3px_oklch(var(--su)/0.15)]'
        : 'bg-base-200 border-base-content/10 hover:border-primary/20'"
    >
      <!-- Conteúdo (Truncado) -->
      <div class="flex-1 font-mono text-base font-medium text-base-content/80 truncate">
        <slot>{{ content }}</slot>
      </div>

      <!-- Botão de Cópia -->
      <button
        type="button"
        @click="copy"
        :aria-label="`${t('copy')} ${label}`"
        class="btn btn-square btn-ghost btn-sm transition-all duration-300 cursor-pointer active:scale-90 flex-shrink-0"
        :class="copied ? 'text-success' : 'text-base-content/30 hover:text-primary'"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-50 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-50 opacity-0"
          mode="out-in"
        >
          <Icon
            :key="copied ? 'check' : 'copy'"
            :name="copied ? 'heroicons:check-20-solid' : 'heroicons:document-duplicate-20-solid'"
            class="w-5 h-5"
            aria-hidden="true"
          />
        </Transition>
      </button>
    </div>
  </div>
</template>

<i18n lang="yaml">
{
  en: { copy: "Copy" },
  pt: { copy: "Copiar" },
  es: { copy: "Copiar" },
  fr: { copy: "Copier" },
  it: { copy: "Copia" },
  id: { copy: "Salin" },
  de: { copy: "Kopieren" }
}
</i18n>
