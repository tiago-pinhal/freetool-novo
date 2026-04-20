<template>
  <!-- Mobile: DaisyUI drawer overlay -->
  <div v-if="!isHomePage" class="drawer-side z-[60] lg:hidden">
    <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="h-full bg-base-200 text-base-content flex flex-col shadow-xl border-r border-base-content/5">
      <nav aria-label="Main Navigation" class="flex-grow w-full overflow-y-auto custom-scrollbar">
        <ul class="menu menu-lg p-2 gap-1">
          <li v-for="item in menuItems" :key="item.path">
            <NuxtLink
              :to="localePath(item.path)"
              active-class="active"
              @click="closeDrawer"
              class="flex items-center gap-4"
            >
              <Icon :name="`${item.icon}.svg?width=24&height=24`" aria-hidden="true" />
              <span class="font-semibold text-sm">{{ t(item.label) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Desktop: Mini sidebar with tooltips -->
  <aside
    v-if="!isHomePage"
    aria-label="Main Navigation"
    class="hidden lg:flex flex-col fixed top-16 left-0 z-30 h-[calc(100vh-64px)] bg-base-200 border-r border-base-content/5 shadow-xl w-14 items-center pt-0 pb-4 overflow-visible"
  >
    <nav class="flex-grow w-full overflow-visible">
      <ul class="menu p-1 gap-1 items-center overflow-visible">
        <li v-for="item in menuItems" :key="item.path">
          <NuxtLink
            :to="localePath(item.path)"
            active-class="active"
            class="tooltip tooltip-right p-3"
            :data-tip="t(item.label)"
          >
            <Icon :name="`${item.icon}.svg?width=24&height=24`" aria-hidden="true" />
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
  { path: 'code-formatters', icon: 'bars-3-bottom-left', label: 'fmt' },
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
de:
    pdf: "PDF-Editor"
    clr: "Farben"
    img: "Bilder"
    txt: "Texte"
    dts: "Daten & Zeiten"
    rand: "Zufallsdaten"
    min: "Code minimieren"
    fmt: "Code formatieren"
    conv: "Konverter"
    misc: "Handliche Tools"
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
