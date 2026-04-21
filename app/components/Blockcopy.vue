<script setup lang="ts">
const props = defineProps<{
  content: string | null
  label: string
}>()

const { t } = useI18n({ useScope: 'local' })

const copied = ref(false)

async function copy() {
  if (!props.content || copied.value) return
  try {
    await navigator.clipboard.writeText(props.content.toString())
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Falha ao copiar:', err)
  }
}
</script>

<template>
  <div
    v-if="content"
    class="relative group mt-6 rounded-2xl border overflow-hidden transition-all duration-300"
    :class="copied ? 'border-success/50 shadow-[0_0_0_3px_oklch(var(--su)/0.15)]' : 'border-base-content/10 group-hover:border-primary/20'"
  >
    <!-- Header: Label + Botão Copiar -->
    <div class="flex items-center justify-between px-5 py-3 bg-base-300 border-b border-base-content/20">
      <span class="text-xs font-bold uppercase tracking-wider text-base-content/50">
        {{ label }}
      </span>

      <button
        type="button"
        @click="copy"
        :aria-label="`${t('copy')} ${label}`"
        class="btn btn-xs btn-ghost gap-2 transition-all duration-300 cursor-pointer active:scale-90"
        :class="copied ? 'text-success' : 'text-base-content/50 hover:text-primary'"
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
            class="w-4 h-4"
            aria-hidden="true"
          />
        </Transition>
        <span>{{ copied ? t('copied') : t('copy') }}</span>
      </button>
    </div>

    <!-- Conteúdo (Slot) -->
    <div class="relative overflow-hidden bg-base-200">
      <div class="px-6 py-5 overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-all min-h-[3rem] flex items-center">
        <slot />
      </div>

      <!-- Overlay de brilho sutil -->
      <div
        class="absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity pointer-events-none"
        :class="copied ? 'from-success/5 opacity-100' : 'from-primary/5 group-hover:opacity-100'"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/css/main.css";

:deep(pre) {
  @apply !bg-transparent !p-0 !m-0 !border-none;
}
</style>

<i18n lang="yaml">
{
  en: { copy: "Copy", copied: "Copied!" },
  pt: { copy: "Copiar", copied: "Copiado!" },
  es: { copy: "Copiar", copied: "¡Copiado!" },
  fr: { copy: "Copier", copied: "Copié !" },
  it: { copy: "Copia", copied: "Copiato!" },
  id: { copy: "Salin", copied: "Disalin!" },
  de: { copy: "Kopieren", copied: "Kopiert!" }
}
</i18n>
