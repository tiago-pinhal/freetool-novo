<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: 'Home | Freetool.Dev',
  meta: [{ name: "description", content: t('d2') }],
})

usePageJsonLd({
  type: 'page',
  name: 'Freetool.Dev',
  description: t('d2')
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
    <section class="relative overflow-hidden py-8 pb-8 sm:py-16">
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
          <p class="text-lg sm:text-xl text-base-content leading-relaxed mb-10 max-w-2xl mx-auto">
            {{ t('d2') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Fun Tools Section -->
    <section class="pb-12 sm:pb-16">
      <div class="container mx-auto max-w-6xl px-4">
        <div class="flex items-center gap-4 mb-8">
          <Icon name="heroicons:fire-20-solid" class="w-6 h-6 text-orange-400 shrink-0" aria-hidden="true" />
          <h2 class="text-2xl font-bold text-base-content">{{ t('fun_title') }}</h2>
          <div class="h-px flex-1 bg-base-content/10"></div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(130px,auto)]">

          <!-- FANCY LETTERS — hero card (col-span-2, row-span-2) -->
          <NuxtLinkLocale
            :to="localePath('fancy-letters')"
            class="group col-span-2 row-span-2 relative p-[2px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600"
          >
            <div class="relative h-full w-full rounded-[calc(1.5rem-2px)] bg-base-300/92 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-6 sm:p-8">
              <!-- ambient glow -->
              <div class="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/25 transition-colors duration-500"></div>
              <div class="absolute -bottom-12 -left-12 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <!-- hover glow overlay -->
              <div class="absolute inset-0 rounded-[calc(1.5rem-2px)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600"></div>

              <!-- Font preview stack -->
              <div class="flex flex-col gap-0.5 leading-snug select-none flex-1">
                <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-violet-300/60">ℋℯ𝓁𝓁ℴ</span>
                <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-fuchsia-300/70">𝕳𝖊𝖑𝖑𝖔 🅷🅴🅻🅻🅾</span>
                <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-300/80">.｡.:*⚝.:**:. Ḧëḷḷö .:**:.⚝*:.｡.</span>
                <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-200/90">︻▅🅶🅰🅼🅴▆▇◤</span>
                <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-200/90">▄︻デ ᴳᴬᴹᴱ ═━一</span>
                <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-white">₍₍(∩´ ᵕ `∩)⁾⁾ ℓσνє</span>
              </div>

              <!-- Label -->
              <div class="mt-4 flex items-end justify-between">
                <div>
                  <div class="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-1">{{ t('fl_label') }}</div>
                  <div class="text-lg sm:text-xl font-extrabold text-base-content group-hover:text-white transition-colors duration-300">{{ t('fl_title') }}</div>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-white/10 rounded-xl p-2">
                  <Icon name="heroicons:arrow-up-right" class="w-5 h-5 text-white" aria-hidden="true" />
                </div>
              </div>
            </div>
          </NuxtLinkLocale>

          <!-- EMOJI PICKER -->
          <NuxtLinkLocale
            :to="localePath('emoji-picker')"
            class="group relative p-[2px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500"
          >
            <div class="relative h-full w-full rounded-[calc(1.5rem-2px)] bg-base-300/92 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-4 sm:p-5">
              <div class="absolute inset-0 rounded-[calc(1.5rem-2px)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500"></div>
              <div class="text-2xl sm:text-3xl leading-relaxed tracking-wide select-none">
                😍 🔥 ✨ 💓<br>🎯 👑 🌈 💎
              </div>
              <div>
                <div class="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-0.5">{{ t('emoji_label') }}</div>
                <div class="text-sm font-bold text-base-content group-hover:text-white transition-colors duration-300">{{ t('emoji_title') }}</div>
              </div>
            </div>
          </NuxtLinkLocale>

          <!-- SYMBOL PICKER -->
          <NuxtLinkLocale
            :to="localePath('copy-paste-symbols')"
            class="group relative p-[2px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600"
          >
            <div class="relative h-full w-full rounded-[calc(1.5rem-2px)] bg-base-300/92 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-4 sm:p-5">
              <div class="absolute inset-0 rounded-[calc(1.5rem-2px)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600"></div>
              <div class="text-2xl sm:text-3xl leading-relaxed tracking-widest text-teal-300 select-none">
                ★ ♛ ♬ ✈<br>♥ ⚡ ∞ ✦
              </div>
              <div>
                <div class="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-0.5">{{ t('sym_label') }}</div>
                <div class="text-sm font-bold text-base-content group-hover:text-white transition-colors duration-300">{{ t('sym_title') }}</div>
              </div>
            </div>
          </NuxtLinkLocale>

          <!-- LENNY FACE -->
          <NuxtLinkLocale
            :to="localePath('lenny-face')"
            class="group relative p-[2px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500"
          >
            <div class="relative h-full w-full rounded-[calc(1.5rem-2px)] bg-base-300/92 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-4 sm:p-5">
              <div class="absolute inset-0 rounded-[calc(1.5rem-2px)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500"></div>
              <div class="font-mono text-sm sm:text-base leading-loose text-base-content/80 select-none">
                <div>( ͡° ͜ʖ ͡°)</div>
                <div>¯\_(ツ)_/¯</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-0.5">{{ t('lenny_label') }}</div>
                <div class="text-sm font-bold text-base-content group-hover:text-white transition-colors duration-300">{{ t('lenny_title') }}</div>
              </div>
            </div>
          </NuxtLinkLocale>

          <!-- KAOMOJI -->
          <NuxtLinkLocale
            :to="localePath('kaomoji')"
            class="group relative p-[2px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600"
          >
            <div class="relative h-full w-full rounded-[calc(1.5rem-2px)] bg-base-300/92 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-4 sm:p-5">
              <div class="absolute inset-0 rounded-[calc(1.5rem-2px)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600"></div>
              <div class="font-mono text-xs sm:text-sm leading-loose text-base-content/80 select-none">
                <div>(づ｡◕‿‿◕｡)づ</div>
                <div>(⌐■_■)</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-0.5">{{ t('kao_label') }}</div>
                <div class="text-sm font-bold text-base-content group-hover:text-white transition-colors duration-300">{{ t('kao_title') }}</div>
              </div>
            </div>
          </NuxtLinkLocale>

        </div>
      </div>
    </section>

    <!-- Tools Grid Section -->
    <section class="pb-16">
      <div class="container mx-auto max-w-6xl px-4">
        <div class="flex items-center gap-4 mb-12">
          <h2 class="text-2xl font-bold text-base-content">{{ t('d3') }}</h2>
          <div class="h-px flex-1 bg-base-content/10"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-5 gap-6">
          <ToolCard
            v-for="(tool, i) in toolCategories"
            :key="tool.id"
            :to="localePath(tool.to)"
            :icon="tool.icon"
            :title="tool.title"
            :index="i"
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
        d3: "Tools for...",
        pdf: "PDF",
        clr: "Colors",
        img: "Images",
        txt: "Texts",
        dts: "Dates and Times",
        rand: "Random Data Generators",
        min: "Minify Code",
        fmt: "Format Code",
        conv: "Converters",
        misc: "Various Tools",
        fun_title: "Trending",
        fl_label: "100+ styles · nick & bio",
        fl_title: "Fancy Letters",
        emoji_label: "1000+ emojis",
        emoji_title: "Emoji Picker",
        sym_label: "For nicknames",
        sym_title: "Symbol Picker",
        lenny_label: "Text faces",
        lenny_title: "Lenny Face",
        kao_label: "Japanese emoticons",
        kao_title: "Kaomoji"
    },
    pt: {
        d1: "Bem-vindo ao",
        d2: "Simplifique suas tarefas com ferramentas online gratuitas, incluindo soluções para desenvolvedores de software.",
        d3: "Ferramentas para...",
        pdf: "PDF",
        clr: "Cores",
        img: "Imagens",
        txt: "Textos",
        dts: "Datas e Horas",
        rand: "Dados Aleatórios",
        min: "Minificar Código",
        fmt: "Formatar Código",
        conv: "Conversores",
        misc: "Ferramentas Diversas",
        fun_title: "Em Alta",
        fl_label: "100+ estilos · nick & bio",
        fl_title: "Letras Diferenciadas",
        emoji_label: "1000+ emojis",
        emoji_title: "Seletor de Emojis",
        sym_label: "Para nickname",
        sym_title: "Seletor de Símbolos",
        lenny_label: "Carinhas de texto",
        lenny_title: "Lenny Face",
        kao_label: "Emoticons japoneses",
        kao_title: "Kaomoji"
    },
    es: {
        d1: "Bienvenido a",
        d2: "Simplifica tus tareas con herramientas en línea gratuitas, incluidas soluciones para desarrolladores de software.",
        d3: "Herramientas para...",
        pdf: "PDF",
        clr: "Colores",
        img: "Imágenes",
        txt: "Textos",
        dts: "Fechas y Horas",
        rand: "Datos Aleatorios",
        min: "Minificar Código",
        fmt: "Formatear Código",
        conv: "Convertidores",
        misc: "Herramientas Diversas",
        fun_title: "Tendencias",
        fl_label: "100+ estilos · nick & bio",
        fl_title: "Letras Especiales",
        emoji_label: "1000+ emojis",
        emoji_title: "Selector de Emojis",
        sym_label: "Para nickname",
        sym_title: "Selector de Símbolos",
        lenny_label: "Caritas de texto",
        lenny_title: "Lenny Face",
        kao_label: "Emoticonos japoneses",
        kao_title: "Kaomoji"
    },
    fr: {
        d1: "Bienvenue chez",
        d2: "Simplifiez vos tâches avec des outils en ligne gratuits, y compris des solutions pour les développeurs de logiciels.",
        d3: "Outils pour...",
        pdf: "PDF",
        clr: "Couleurs",
        img: "Images",
        txt: "Textes",
        dts: "Dates et Heures",
        rand: "Données Aléatoires",
        min: "Minifier le Code",
        fmt: "Formater le Code",
        conv: "Convertisseurs",
        misc: "Outils Divers",
        fun_title: "Tendances",
        fl_label: "100+ styles",
        fl_title: "Lettres Fantaisie",
        emoji_label: "1000+ emojis",
        emoji_title: "Sélecteur d'Emojis",
        sym_label: "Pour les pseudos",
        sym_title: "Sélecteur de Symboles",
        lenny_label: "Visages en texte",
        lenny_title: "Lenny Face",
        kao_label: "Émoticônes japonais",
        kao_title: "Kaomoji"
    },
    it: {
        d1: "Benvenuto su",
        d2: "Semplifica le tue attività con strumenti online gratuiti, incluse soluzioni per sviluppatori software.",
        d3: "Strumenti per...",
        pdf: "PDF",
        clr: "Colori",
        img: "Immagini",
        txt: "Testi",
        dts: "Date e Ore",
        rand: "Dati Casuali",
        min: "Minimizza Codice",
        fmt: "Formatta Codice",
        conv: "Convertitori",
        misc: "Strumenti Diversi",
        fun_title: "Di Tendenza",
        fl_label: "100+ stili · nick & bio",
        fl_title: "Lettere Stilizzate",
        emoji_label: "1000+ emoji",
        emoji_title: "Selettore di Emoji",
        sym_label: "Per i nickname",
        sym_title: "Selettore di Simboli",
        lenny_label: "Faccine di testo",
        lenny_title: "Lenny Face",
        kao_label: "Emoticon giapponesi",
        kao_title: "Kaomoji"
    },
    id: {
        d1: "Selamat datang di",
        d2: "Sederhanakan tugas Anda dengan alat online gratis, termasuk solusi untuk pengembang perangkat lunak.",
        d3: "Alat untuk...",
        pdf: "PDF",
        clr: "Warna",
        img: "Gambar",
        txt: "Teks",
        dts: "Tanggal dan Waktu",
        rand: "Data Acak",
        min: "Minifikasi Kode",
        fmt: "Format Kode",
        conv: "Konverter",
        misc: "Alat Lainnya",
        fun_title: "Sedang Tren",
        fl_label: "100+ gaya · nick & bio",
        fl_title: "Huruf Keren",
        emoji_label: "1000+ emoji",
        emoji_title: "Pilih Emoji",
        sym_label: "Untuk nickname",
        sym_title: "Pilih Simbol",
        lenny_label: "Wajah teks",
        lenny_title: "Lenny Face",
        kao_label: "Emotikon Jepang",
        kao_title: "Kaomoji"
    },
    de: {
        d1: "Willkommen bei",
        d2: "Vereinfache deine Aufgaben mit kostenlosen Online-Tools, einschließlich Lösungen für Softwareentwickler.",
        d3: "Tools für...",
        pdf: "PDF",
        clr: "Farben",
        img: "Bilder",
        txt: "Texte",
        dts: "Datum und Uhrzeit",
        rand: "Zufallsdaten",
        min: "Code minifizieren",
        fmt: "Code formatieren",
        conv: "Konverter",
        misc: "Verschiedene Tools",
        fun_title: "Im Trend",
        fl_label: "100+ Stile · nick & bio",
        fl_title: "Schriftarten-Generator",
        emoji_label: "1000+ Emojis",
        emoji_title: "Emoji-Auswahl",
        sym_label: "Für Nicknames",
        sym_title: "Symbol-Auswahl",
        lenny_label: "Textgesichter",
        lenny_title: "Lenny Face",
        kao_label: "Japanische Emoticons",
        kao_title: "Kaomoji"
    },
    nl: {
        d1: "Welkom bij",
        d2: "Vereenvoudig je taken met gratis online tools, inclusief oplossingen voor softwareontwikkelaars.",
        d3: "Tools voor...",
        pdf: "PDF-tools",
        clr: "Kleuren",
        img: "Afbeeldingen",
        txt: "Teksten",
        dts: "Datum & Tijd",
        rand: "Willekeurige gegevens",
        min: "Code-minifiers",
        fmt: "Code-formatteerders",
        conv: "Converters",
        misc: "Diverse tools",
        fun_title: "Trending",
        fl_label: "100+ stijlen · nick & bio",
        fl_title: "Mooie Letters",
        emoji_label: "1000+ emoji's",
        emoji_title: "Emoji-kiezer",
        sym_label: "Voor nicknames",
        sym_title: "Symboolkiezer",
        lenny_label: "Tekstgezichten",
        lenny_title: "Lenny Face",
        kao_label: "Japanse emoticons",
        kao_title: "Kaomoji"
    },
    ru: {
        d1: "Добро пожаловать в",
        d2: "Упростите свои задачи с помощью бесплатных онлайн-инструментов, включая решения для разработчиков программного обеспечения.",
        d3: "Инструменты для...",
        pdf: "PDF",
        clr: "Цвета",
        img: "Изображения",
        txt: "Тексты",
        dts: "Дата и время",
        rand: "Генераторы случайных данных",
        min: "Минификация кода",
        fmt: "Форматирование кода",
        conv: "Конвертеры",
        misc: "Различные инструменты",
        fun_title: "В тренде",
        fl_label: "100+ стилей · ник и био",
        fl_title: "Красивые шрифты",
        emoji_label: "1000+ эмодзи",
        emoji_title: "Выбор эмодзи",
        sym_label: "Для никнеймов",
        sym_title: "Выбор символов",
        lenny_label: "Текстовые смайлы",
        lenny_title: "Смайлы Ленни",
        kao_label: "Японские смайлики",
        kao_title: "Каомодзи"
    }
}
</i18n>
