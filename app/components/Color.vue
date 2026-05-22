<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  color: string
}>()

const { t } = useI18n({ useScope: 'local' })

const copied = ref(false)

async function copy() {
  if (!props.color || copied.value) return
  try {
    await navigator.clipboard.writeText(props.color)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch (err) {
    console.error('Failed to copy color:', err)
  }
}
</script>

<template>
  <button
    type="button"
    class="relative group cursor-pointer w-full h-full overflow-hidden border border-base-content/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
    :style="{ backgroundColor: color }"
    @click="copy"
    :aria-label="`${t('copy')} ${color}`"
  >
    <div 
      class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center"
    >
      <!-- Color Text (shown on hover) -->
      <span 
        class="opacity-0 group-hover:opacity-100 text-white font-mono text-sm font-semibold tracking-wider transition-opacity duration-200 drop-shadow-md"
        :class="{ 'opacity-0 group-hover:opacity-0': copied }"
      >
        {{ color }}
      </span>

      <!-- Copied Overlay -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div 
          v-if="copied"
          class="absolute inset-0 bg-success/90 backdrop-blur-sm flex items-center justify-center text-success-content font-bold text-sm tracking-wider"
        >
          <div class="flex items-center gap-1.5 drop-shadow-md">
            <Icon name="material-symbols:check-rounded" class="w-5 h-5" />
            {{ t('copied') }}
          </div>
        </div>
      </Transition>
    </div>
  </button>
</template>

<i18n lang="yaml">
{
  en: { copy: "Copy color", copied: "Copied!" },
  pt: { copy: "Copiar cor", copied: "Copiado!" },
  es: { copy: "Copiar color", copied: "¡Copiado!" },
  fr: { copy: "Copier la couleur", copied: "Copié !" },
  it: { copy: "Copia colore", copied: "Copiato!" },
  id: { copy: "Salin warna", copied: "Tersalin!" },
  de: { copy: "Farbe kopieren", copied: "Kopiert!" },
  nl: { copy: "Kleur kopiëren", copied: "Gekopieerd!" }
}
</i18n>
