<template>
  <!-- Mobile: DaisyUI drawer overlay -->
  <div v-if="!isHomePage" class="drawer-side z-30 lg:hidden">
    <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="h-full bg-base-200 text-base-content flex flex-col w-80 shadow-xl border-r border-base-content/5">
      <nav aria-label="Navegação principal" class="flex-grow w-full px-2 pt-4 overflow-y-auto custom-scrollbar">
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.path">
            <NuxtLink
              :to="localePath(item.path)"
              :aria-current="route.path === localePath(item.path) ? 'page' : undefined"
              class="flex items-center gap-4 px-4 py-2 rounded-2xl hover:text-primary transition-all duration-200 group active:scale-[0.98]"
              @click="closeDrawer"
            >
              <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center text-base-content/50 group-hover:text-primary transition-all duration-300">
                <Icon :name="`${item.icon}.svg?width=24&height=24`" aria-hidden="true" />
              </div>
              <span class="font-semibold text-sm">{{ t(item.label) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="mt-auto py-4 border-t border-base-content/10 text-center opacity-50">
        <p class="text-[10px] uppercase tracking-widest font-bold opacity-60">© {{ currentYear }} FreeTool.dev</p>
      </div>
    </div>
  </div>

  <!-- Desktop: sidebar fixed com hover expand -->
  <aside
    v-if="!isHomePage"
    aria-label="Navegação principal"
    class="hidden lg:flex flex-col fixed top-[77px] left-0 z-30 h-[calc(100vh-77px)] bg-base-200 border-r border-base-content/5 shadow-xl transition-[width] duration-300 ease-in-out overflow-hidden"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="isHovered = true"
    @focusout="isHovered = false"
  >
    <nav class="flex-grow w-full overflow-y-auto custom-scrollbar">
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <NuxtLink
            :to="localePath(item.path)"
            :aria-current="route.path === localePath(item.path) ? 'page' : undefined"
            class="flex items-center py-1 rounded-2xl hover:text-primary transition-all duration-200 group active:scale-[0.98]"
          >
            <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center text-base-content/50 group-hover:text-primary transition-all duration-300">
              <Icon :name="`${item.icon}.svg?width=24&height=24`" aria-hidden="true" />
            </div>
            <span
              class="font-semibold text-sm whitespace-nowrap transition-all duration-200"
              :class="isHovered ? 'opacity-100 pr-8' : 'sr-only'"
            >
              {{ t(item.label) }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const isHovered = ref(false)
const currentYear = new Date().getFullYear()

const isHomePage = computed(() => route.path === localePath('/'))

const menuItems = [
  { path: 'pdf-tools', icon: 'document', label: 'pdf' },
  { path: 'color-tools', icon: 'swatch', label: 'clr' },
  { path: 'image-tools', icon: 'photo', label: 'img' },
  { path: 'text-tools', icon: 'document-text', label: 'txt' },
  { path: 'date-time-tools', icon: 'calendar', label: 'dts' },
  { path: 'random-data', icon: 'circle-stack', label: 'rand' },
  { path: 'code-minifiers', icon: 'arrows-pointing-in', label: 'min' },
  { path: 'code-formatters', icon: 'bars-4', label: 'fmt' },
  { path: 'converters', icon: 'arrows-right-left', label: 'conv' },
  { path: 'various-tools', icon: 'squares-2x2', label: 'misc' },
]

const closeDrawer = () => {
  const checkbox = document.getElementById('main-drawer') as HTMLInputElement | null
  if (checkbox) checkbox.checked = false
}
</script>

<i18n lang="yaml">
en:
    pdf: "PDF Editor"
    clr: "Colors"
    img: "Images"
    txt: "Texts"
    dts: "Dates and Times"
    rand: "Random Data"
    min: "Minify Code"
    fmt: "Format Code"
    conv: "Converters"
    misc: "Various Tools"
pt:
    pdf: "Editor de PDF"
    clr: "Cores"
    img: "Imagens"
    txt: "Textos"
    dts: "Datas e Horas"
    rand: "Dados Aleatórios"
    min: "Minificar Código"
    fmt: "Formatar Código"
    conv: "Conversores"
    misc: "Diversas"
es:
    pdf: "Editor de PDF"
    clr: "Colores"
    img: "Imágenes"
    txt: "Textos"
    dts: "Fechas y Horas"
    rand: "Datos Aleatorios"
    min: "Minificar Código"
    fmt: "Formatear Código"
    conv: "Convertidores"
    misc: "Diversas"
fr:
    pdf: "Éditeur PDF"
    clr: "Couleurs"
    img: "Images"
    txt: "Textes"
    dts: "Dates et Heures"
    rand: "Données Aléatoires"
    min: "Minifier le Code"
    fmt: "Formater le Code"
    conv: "Convertisseurs"
    misc: "Divers"
it:
    pdf: "Editor di PDF"
    clr: "Colori"
    img: "Immagini"
    txt: "Testi"
    dts: "Date e Ore"
    rand: "Dati Casuali"
    min: "Minimizzare il Codice"
    fmt: "Formattare il Codice"
    conv: "Convertitori"
    misc: "Diversi"
id:
    pdf: "Editor PDF"
    clr: "Warna"
    img: "Gambar"
    txt: "Teks"
    dts: "Tanggal & Waktu"
    rand: "Data Acak"
    min: "Minifikasi Kode"
    fmt: "Pemformat Kode"
    conv: "Konverter"
    misc: "Berbagai Alat"
</i18n>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: color-mix(in oklch, var(--color-base-content) 10%, transparent);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: color-mix(in oklch, var(--color-base-content) 20%, transparent);
}
</style>
