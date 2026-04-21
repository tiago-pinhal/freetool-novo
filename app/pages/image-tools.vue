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
        pt: '/ferramentas-para-imagens',
        es: '/herramientas-para-imagenes',
        fr: '/outils-pour-images',
        it: '/strumenti-per-immagini',
        id: '/alat-gambar',
        de: '/bild-werkzeuge'
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
      <ToolCard         :title="t('emoji')" 
        to="emoji-picker" 
        icon="mdi:sticker-emoji"
        :index="0"
      />
      <ToolCard         :title="t('symbol')" 
        to="symbol-picker" 
        icon="mdi:omega"
        :index="1"
      />
      <ToolCard         :title="t('qr')" 
        to="qrcode-generator" 
        icon="mdi:qrcode"
        :index="2"
      />
      <ToolCard         :title="t('barcode')" 
        to="barcode-generator" 
        icon="mdi:barcode"
        :index="3"
      />
      <ToolCard         :title="t('cropper')" 
        to="image-cropper" 
        icon="mdi:crop"
        :index="4"
      />
      <ToolCard         :title="t('resizer')" 
        to="image-resizer" 
        icon="mdi:resize"
        :index="5"
      />
      <ToolCard         :title="t('img_pdf')" 
        to="image-to-pdf" 
        icon="mdi:file-pdf-box"
        :index="6"
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
        title: "Image Tools",
        meta: "Free online image tools: emoji picker, symbol picker, QR code and barcode generators, image cropper, resizer and image to PDF converter. No installation needed!",
        desc: "Pick emojis and symbols, generate QR codes and barcodes, crop and resize images or even convert them to PDF. All processing happens in your browser, your files never leave your device and no installation is required.",
        emoji: "Emoji Picker",
        symbol: "Symbol Picker",
        qr: "QR Code Generator",
        barcode: "Barcode Generator",
        cropper: "Image Cropper",
        resizer: "Image Resizer",
        img_pdf: "Image to PDF",
    },
    pt: {
        title: "Ferramentas para Imagem",
        meta: "Ferramentas de imagem online grátis: seletor de emoji, seletor de símbolos, gerador de QR code e código de barras, recorte, redimensionamento e conversão de imagem para PDF. Sem instalação!",
        desc: "Escolha emojis e símbolos, gere QR codes e códigos de barras, recorte e redimensione imagens ou até mesmo converta imagens em PDF. Todo o processamento acontece no seu navegador, seus arquivos nunca saem do seu dispositivo e nenhuma instalação é necessária.",
        emoji: "Seletor de Emoji",
        symbol: "Seletor de Símbolos",
        qr: "Gerador de QR Code",
        barcode: "Gerador de Código de Barras",
        cropper: "Recortar Imagem",
        resizer: "Redimensionar Imagem",
        img_pdf: "Imagem para PDF",
    },
    es: {
        title: "Herramientas para Imágenes",
        meta: "Herramientas de imagen online gratis: selector de emoji y símbolos, generador de QR y códigos de barras, recorte, redimensionamiento y conversión de imagen a PDF. Sin instalación!",
        desc: "Elige emojis y símbolos, genera códigos QR y de barras, recorta y redimensiona imágenes o incluso conviértelas a PDF. Todo el procesamiento ocurre en tu navegador, tus archivos nunca salen de tu dispositivo y no necesitas instalar nada.",
        emoji: "Selector de Emoji",
        symbol: "Selector de Símbolos",
        qr: "Generador de QR Code",
        barcode: "Generador de Códigos de Barras",
        cropper: "Recortar Imagen",
        resizer: "Redimensionar Imagen",
        img_pdf: "Imagen a PDF",
    },
    fr: {
        title: "Outils pour Images",
        meta: "Outils d'image en ligne gratuits : sélecteur d'emoji et de symboles, générateur de QR code et de codes-barres, rognage, redimensionnement et conversion d'image en PDF. Sans installation !",
        desc: "Choisissez des emojis et des symboles, générez des codes QR et des codes-barres, rognez et redimensionnez des images ou convertissez-les même en PDF. Tout le traitement se fait dans votre navigateur, vos fichiers ne quittent jamais votre appareil et aucune installation n'est requise.",
        emoji: "Sélecteur d'Emoji",
        symbol: "Sélecteur de Symboles",
        qr: "Générateur de QR Code",
        barcode: "Générateur de Codes-barres",
        cropper: "Rogner Image",
        resizer: "Redimensionner Image",
        img_pdf: "Image en PDF",
    },
    it: {
        title: "Strumenti per Immagini",
        meta: "Strumenti immagine online gratuiti: selettore di emoji e simboli, generatore di QR code e codici a barre, ritaglio, ridimensionamento e conversione immagine in PDF. Senza installazione!",
        desc: "Scegli emoji e simboli, genera codici QR e codici a barre, ritaglia e ridimensiona immagini o addirittura convertile in PDF. Tutta l'elaborazione avviene nel tuo browser, i tuoi file non lasciano mai il dispositivo e non è necessaria alcuna installazione.",
        emoji: "Selettore di Emoji",
        symbol: "Selettore di Simboli",
        qr: "Generatore di QR Code",
        barcode: "Generatore di Codici a Barre",
        cropper: "Ritaglia Immagine",
        resizer: "Ridimensiona Immagine",
        img_pdf: "Immagine in PDF",
    },
    id: {
        title: "Alat Gambar",
        meta: "Alat gambar online gratis: pemilih emoji dan simbol, generator kode QR dan barcode, pemotong, pengubah ukuran gambar dan konversi gambar ke PDF. Tanpa instalasi!",
        desc: "Pilih emoji dan simbol, buat kode QR dan barcode, potong dan ubah ukuran gambar atau bahkan konversi ke PDF. Semua pemrosesan dilakukan di browser Anda, file Anda tidak pernah meninggalkan perangkat dan tidak diperlukan instalasi apa pun.",
        emoji: "Pemilih Emoji",
        symbol: "Pemilih Simbol",
        qr: "Generator Kode QR",
        barcode: "Generator Barcode",
        cropper: "Pemotong Gambar",
        resizer: "Pengubah Ukuran Gambar",
        img_pdf: "Gambar ke PDF",
    },
    de: {
        title: "Bild-Werkzeuge",
        meta: "Kostenlose Online-Bildtools: Emoji- und Symbol-Auswahl, QR-Code- und Barcode-Generator, Bild zuschneiden, Größe ändern und in PDF konvertieren. Ohne Installation!",
        desc: "Wählen Sie Emojis und Symbole, erstellen Sie QR-Codes und Barcodes, schneiden Sie Bilder zu und ändern Sie ihre Größe oder konvertieren Sie sie sogar in PDF. Die gesamte Verarbeitung erfolgt in Ihrem Browser, Ihre Dateien verlassen niemals Ihr Gerät und eine Installation ist nicht erforderlich.",
        emoji: "Emoji-Auswahl",
        symbol: "Symbol-Auswahl",
        qr: "QR-Code-Generator",
        barcode: "Barcode-Generator",
        cropper: "Bild zuschneiden",
        resizer: "Bildgröße ändern",
        img_pdf: "Bild zu PDF",
    }
}
</i18n>
