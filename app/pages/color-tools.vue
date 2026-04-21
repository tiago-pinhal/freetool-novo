<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta'),
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') },
  ],
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }],
})

defineI18nRoute({
    paths: {
        pt: '/ferramentas-para-cores',
        es: '/herramientas-para-colores',
        fr: '/outils-pour-couleurs',
        it: '/strumenti-per-colori',
        id: '/alat-warna',
        de: '/farb-werkzeuge'
    }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content/70 mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-6">
      <ToolCard 
        class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
        :title="t('random')" 
        to="random-colors" 
        icon="mdi:format-color-fill"
        :index="0"
      />
      <ToolCard 
        class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
        :title="t('dominant')" 
        to="dominant-colors-of-the-image" 
        icon="mdi:select-color"
        :index="1"
      />
      <ToolCard 
        class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
        :title="t('converter')" 
        to="color-converter" 
        icon="mdi:palette-swatch"
        :index="2"
      />
      <ToolCard 
        class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
        :title="t('combination')" 
        to="color-combination" 
        icon="mdi:palette-swatch-variant"
        :index="3"
      />
    </div>

    <div class="mt-16 bg-base-200/50 rounded-3xl p-8 border border-base-content/5">
      <Adsense />
    </div>
  </div>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Color Tools",
        meta: "Free online color tools: random palettes, image color extractor, color converter and color combinations. No installation needed!",
        desc: "Generate random color palettes, pull dominant colors straight from an image, switch between color formats and put together harmonious combinations. Everything runs in your browser, your files never leave your device and no installation is needed.",
        random: "Random Colors",
        dominant: "Image Colors",
        contrast: "Color Contrast",
        converter: "Color Converter",
        combination: "Color Combination",
    },
    pt: {
        title: "Ferramentas para Cores",
        meta: "Ferramentas de cores online grátis: paletas aleatórias, extrator de cores de imagem, conversor de cores e combinações. Sem instalação!",
        desc: "Gere paletas aleatórias de cores, extraia as cores predominantes de qualquer imagem, converta entre formatos de cor e monte combinações harmoniosas. Todo o processamento acontece no seu navegador, seus arquivos nunca saem do seu dispositivo e nenhuma instalação é necessária.",
        random: "Cores Aleatórias",
        dominant: "Cores da Imagem",
        contrast: "Contraste de Cores",
        converter: "Conversor de Cores",
        combination: "Combinação de Cores",
    },
    es: {
        title: "Herramientas para Colores",
        meta: "Herramientas de colores online gratis: paletas aleatorias, extractor de colores de imagen, convertidor de colores y combinaciones. Sin instalación!",
        desc: "Genera paletas de colores al azar, extrae los colores predominantes de cualquier imagen, convierte entre formatos y crea combinaciones armoniosas. Todo funciona en tu navegador, tus archivos no van a ningún lado y no necesitas instalar nada.",
        random: "Colores Aleatorios",
        dominant: "Colores de la Imagen",
        contrast: "Contraste de Colores",
        converter: "Convertidor de Colores",
        combination: "Combinación de Colores",
    },
    fr: {
        title: "Outils pour Couleurs",
        meta: "Outils de couleurs en ligne gratuits : palettes aléatoires, extraction de couleurs depuis une image, convertisseur et combinaisons. Sans installation !",
        desc: "Générez des palettes de couleurs aléatoires, extrayez les couleurs dominantes d'une image, convertissez entre différents formats et composez des combinaisons harmonieuses. Tout fonctionne dans votre navigateur, vos fichiers restent sur votre appareil et aucune installation n'est nécessaire.",
        random: "Couleurs Aléatoires",
        dominant: "Couleurs de l'Image",
        contrast: "Contraste de Couleurs",
        converter: "Convertisseur de Couleurs",
        combination: "Combinaison de Couleurs",
    },
    it: {
        title: "Strumenti per Colori",
        meta: "Strumenti di colori online gratuiti: palette casuali, estrazione colori da immagine, convertitore di colori e combinazioni. Senza installazione!",
        desc: "Genera palette di colori casuali, estrai i colori dominanti da qualsiasi immagine, converti tra formati e crea combinazioni armoniose. Tutto funziona nel tuo browser, i tuoi file rimangono sul dispositivo e non è necessaria alcuna installazione.",
        random: "Colori Casuali",
        dominant: "Colori dell'Immagine",
        contrast: "Contrasto dei Colori",
        converter: "Convertitore di Colori",
        combination: "Combinazione di Colori",
    },
    id: {
        title: "Alat Warna",
        meta: "Alat warna online gratis: palet acak, ekstraksi warna dari gambar, konverter warna, dan kombinasi warna. Tanpa instalasi!",
        desc: "Buat palet warna acak, ekstrak warna dominan dari gambar apa pun, konversi antar format warna dan susun kombinasi yang harmonis. Semua berjalan di browser Anda, file Anda tetap di perangkat dan tidak perlu instalasi apa pun.",
        random: "Warna Acak",
        dominant: "Warna Gambar",
        contrast: "Kontras Warna",
        converter: "Konverter Warna",
        combination: "Kombinasi Warna",
    },
    de: {
        title: "Farb-Werkzeuge",
        meta: "Kostenlose Online-Farbtools: Zufallspaletten, Farbextraktion aus Bildern, Farbumrechner und Farbkombinationen. Ohne Installation!",
        desc: "Erstellen Sie zufällige Farbpaletten, extrahieren Sie dominante Farben aus beliebigen Bildern, konvertieren Sie zwischen Farbformaten und entwerfen Sie harmonische Kombinationen. Alles läuft in Ihrem Browser, Ihre Dateien bleiben auf Ihrem Gerät und eine Installation ist nicht nötig.",
        random: "Zufallsfarben",
        dominant: "Bildfarben",
        contrast: "Farbkontrast",
        converter: "Farbumrechner",
        combination: "Farbkombination",
    }
}
</i18n>
