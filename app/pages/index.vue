<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: 'Home | Freetool.Dev',
  meta: [{ name: "description", content: t('d2') }],
})

const toolCategories = [
  { id: 'pdf', to: '/pdf-tools', icon: 'document', title: t('pdf') },
  { id: 'color', to: '/color-tools', icon: 'swatch', title: t('clr') },
  { id: 'image', to: '/image-tools', icon: 'photo', title: t('img') },
  { id: 'text', to: '/text-tools', icon: 'document-text', title: t('txt') },
  { id: 'datetime', to: '/date-time-tools', icon: 'calendar', title: t('dts') },
  { id: 'random', to: '/random-data', icon: 'circle-stack', title: t('rand') },
  { id: 'minify', to: '/code-minifiers', icon: 'arrows-pointing-in', title: t('min') },
  { id: 'format', to: '/code-formatters', icon: 'bars-4', title: t('fmt') },
  { id: 'convert', to: '/converters', icon: 'arrows-right-left', title: t('conv') },
  { id: 'misc', to: '/various-tools', icon: 'squares-2x2', title: t('misc') },
]
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
      <!-- Background Glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary rounded-full blur-[100px]"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl sm:text-8xl font-extrabold tracking-tighter mb-8 leading-tight">
            <span class="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {{ t('d1') }} Freetool
            </span>
          </h1>
          <p class="text-lg sm:text-xl text-base-content/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            {{ t('d2') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Tools Grid Section -->
    <section class="px-4">
      <div class="container mx-auto">
        <div class="flex items-center gap-4 mb-12">
          <h2 class="text-2xl font-bold text-base-content">{{ t('d3') }}</h2>
          <div class="h-px flex-1 bg-base-content/10"></div>
        </div>

        <div class="flex flex-wrap justify-center gap-6">
          <ToolCard
            v-for="(tool, i) in toolCategories"
            :key="tool.id"
            :to="tool.to"
            :icon="tool.icon"
            :title="tool.title"
            :index="i"
            :cols="5"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<i18n lang="yaml">
{
    en: {
        d1: "Welcome to",
        d2: "Simplify your tasks with free online tools, including solutions for software developers.",
        d3: "Browse by category",
        pdf: "PDF",
        clr: "Colors",
        img: "Images",
        txt: "Texts",
        dts: "Dates and Times",
        rand: "Random Data",
        min: "Minify Code",
        fmt: "Format Code",
        conv: "Converters",
        misc: "Various Tools"
    },
    pt: {
        d1: "Bem-vindo ao",
        d2: "Simplifique suas tarefas com ferramentas online gratuitas, incluindo soluções para desenvolvedores de software.",
        d3: "Navegar por categoria",
        pdf: "PDF",
        clr: "Cores",
        img: "Imagens",
        txt: "Textos",
        dts: "Datas e Horas",
        rand: "Dados Aleatórios",
        min: "Minificar Código",
        fmt: "Formatar Código",
        conv: "Conversores",
        misc: "Ferramentas Diversas"
    },
    es: {
        d1: "Bienvenido a",
        d2: "Simplifica tus tareas con herramientas en línea gratuitas, incluidas soluciones para desarrolladores de software.",
        d3: "Navegar por categoría",
        pdf: "PDF",
        clr: "Colores",
        img: "Imágenes",
        txt: "Textos",
        dts: "Fechas y Horas",
        rand: "Datos Aleatorios",
        min: "Minificar Código",
        fmt: "Formatear Código",
        conv: "Convertidores",
        misc: "Herramientas Diversas"
    },
    fr: {
        d1: "Bienvenue chez",
        d2: "Simplifiez vos tâches avec des outils en ligne gratuits, y compris des solutions pour les développeurs de logiciels.",
        d3: "Parcourir par catégorie",
        pdf: "PDF",
        clr: "Couleurs",
        img: "Images",
        txt: "Textes",
        dts: "Dates et Heures",
        rand: "Données Aléatoires",
        min: "Minifier le Code",
        fmt: "Formater le Code",
        conv: "Convertisseurs",
        misc: "Outils Divers"
    },
    it: {
        d1: "Benvenuto su",
        d2: "Semplifica le tue attività con strumenti online gratuiti, incluse soluzioni per sviluppatori software.",
        d3: "Sfoglia per categoria",
        pdf: "PDF",
        clr: "Colori",
        img: "Immagini",
        txt: "Testi",
        dts: "Date e Ore",
        rand: "Dati Casuali",
        min: "Minimizza Codice",
        fmt: "Formatta Codice",
        conv: "Convertitori",
        misc: "Strumenti Diversi"
    },
    id: {
        d1: "Selamat datang di",
        d2: "Sederhanakan tugas Anda dengan alat online gratis, termasuk solusi untuk pengembang perangkat lunak.",
        d3: "Telusuri per kategori",
        pdf: "PDF",
        clr: "Warna",
        img: "Gambar",
        txt: "Teks",
        dts: "Tanggal dan Waktu",
        rand: "Data Acak",
        min: "Minifikasi Kode",
        fmt: "Format Kode",
        conv: "Konverter",
        misc: "Alat Lainnya"
    },
    de: {
        d1: "Willkommen bei",
        d2: "Vereinfachen Sie Ihre Aufgaben mit kostenlosen Online-Tools, einschließlich Lösungen für Softwareentwickler.",
        d3: "Nach Kategorie durchsuchen",
        pdf: "PDF",
        clr: "Farben",
        img: "Bilder",
        txt: "Texte",
        dts: "Daten & Zeiten",
        rand: "Zufallsdaten",
        min: "Code minimieren",
        fmt: "Code formatieren",
        conv: "Konverter",
        misc: "Verschiedenes"
    }
}
</i18n>
