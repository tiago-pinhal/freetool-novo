<script setup lang="ts">
const { t } = useI18n()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta')
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }]
})

defineI18nRoute({
    paths: {
        en: '/image-tools',
        pt: '/ferramentas-para-imagens',
        es: '/herramientas-para-imagenes',
        fr: '/outils-pour-images',
        it: '/strumenti-per-immagini',
        id: '/alat-gambar',
        de: '/bild-werkzeuge',
        nl: '/afbeeldingstools'
    }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">
      <ToolCard :title="t('emoji')" 
        to="emoji-picker" 
        icon="mdi:sticker-emoji"
        :index="0"
      />
      <ToolCard :title="t('symbol')" 
        to="symbol-picker" 
        icon="mdi:omega"
        :index="1"
      />
      <ToolCard :title="t('kaomoji')"
        to="kaomoji"
        icon="mdi:emoticon-happy-outline"
        :index="2"
      />
      <ToolCard :title="t('lenny')"
        to="lenny-face"
        icon="mdi:emoticon-wink-outline"
        :index="3"
      />
      <ToolCard :title="t('qr')"
        to="qrcode-generator"
        icon="mdi:qrcode"
        :index="4"
      />
      <ToolCard :title="t('barcode')"
        to="barcode-generator"
        icon="mdi:barcode"
        :index="5"
      />
      <ToolCard :title="t('cropper')"
        to="crop-image"
        icon="mdi:crop"
        :index="6"
      />
      <ToolCard :title="t('resizer')"
        to="resize-image"
        icon="mdi:resize"
        :index="7"
      />
      <ToolCard :title="t('img_pdf')"
        to="image-to-pdf"
        icon="mdi:file-pdf-box"
        :index="8"
      />
      <ToolCard :title="t('signature')"
        to="signature-maker"
        icon="mdi:draw-pen"
        :index="9"
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
    meta: "Free online image tools: emoji picker, kaomoji picker, symbol picker, QR code and barcode generators, image cropper, resizer and image to PDF converter. No installation needed!",
    desc: "Pick emojis, kaomojis and symbols, generate QR codes and barcodes, crop and resize images or even convert them to PDF. All processing happens in your browser, your files never leave your device and no installation is required.",
    emoji: "Emoji Picker",
    symbol: "Symbol Picker",
    kaomoji: "Kaomoji Picker",
    lenny: "Lenny Face Generator",
    qr: "QR Code Generator",
    barcode: "Barcode Generator",
    cropper: "Image Cropper",
    resizer: "Image Resizer",
    img_pdf: "Image to PDF",
    signature: "Signature Maker",
  },
  pt: {
    title: "Ferramentas para Imagem",
    meta: "Ferramentas de imagem online grátis: seletor de emoji, seletor de kaomojis, seletor de símbolos, gerador de QR code e código de barras, recorte, redimensionamento e conversão de imagem para PDF. Sem instalação!",
    desc: "Escolha emojis, kaomojis e símbolos, gere QR codes e códigos de barras, recorte e redimensione imagens ou até mesmo converta imagens em PDF. Todo o processamento acontece no seu navegador, seus arquivos nunca saem do seu dispositivo e nenhuma instalação é necessária.",
    emoji: "Seletor de Emoji",
    symbol: "Seletor de Símbolos",
    kaomoji: "Seletor de Kaomojis",
    lenny: "Gerador de Lenny Face",
    qr: "Gerador de QR Code",
    barcode: "Gerador de Código de Barras",
    cropper: "Recortar Imagem",
    resizer: "Redimensionar Imagem",
    img_pdf: "Imagem para PDF",
    signature: "Assinar Online",
  },
  es: {
    title: "Herramientas para Imágenes",
    meta: "Herramientas de imagen online gratis: selector de emoji, kaomojis y símbolos, generador de QR y códigos de barras, recorte, redimensionamiento y conversión de imagen a PDF. Sin instalación!",
    desc: "Elige emojis, kaomojis y símbolos, genera códigos QR y de barras, recorta y redimensiona imágenes o incluso conviértelas a PDF. Todo el procesamiento ocurre en tu navegador, tus archivos nunca salen de tu dispositivo y no necesitas instalar nada.",
    emoji: "Selector de Emoji",
    symbol: "Selector de Símbolos",
    kaomoji: "Selector de Kaomojis",
    lenny: "Generador de Lenny Face",
    qr: "Generador de Códigos QR",
    barcode: "Generador de Códigos de Barras",
    cropper: "Recortar Imagen",
    resizer: "Redimensionar Imagen",
    img_pdf: "Imagen a PDF",
    signature: "Firma Online",
  },
  fr: {
    title: "Outils pour Images",
    meta: "Outils d'image en ligne gratuits : sélecteur d'emoji, de kaomoji et de symboles, générateur de QR code et de codes-barres, rognage, redimensionnement et conversion d'image en PDF. Sans installation !",
    desc: "Choisissez des emojis, des kaomojis et des symboles, générez des codes QR et des codes-barres, rognez et redimensionnez des images ou convertissez-les même en PDF. Tout le traitement se fait dans votre navigateur, vos fichiers ne quittent jamais votre appareil et aucune installation n'est requise.",
    emoji: "Sélecteur d'Emoji",
    symbol: "Sélecteur de Symboles",
    kaomoji: "Sélecteur de Kaomoji",
    lenny: "Générateur de Lenny Face",
    qr: "Générateur de QR Code",
    barcode: "Générateur de Codes-barres",
    cropper: "Rogner Image",
    resizer: "Redimensionner Image",
    img_pdf: "Image en PDF",
    signature: "Signature en Ligne",
  },
  it: {
    title: "Strumenti per Immagini",
    meta: "Strumenti immagine online gratuiti: selettore di emoji, kaomoji e simboli, generatore di QR code e codici a barre, ritaglio, ridimensionamento e conversione immagine in PDF. Senza installazione!",
    desc: "Scegli emoji, kaomoji e simboli, genera codici QR e codici a barre, ritaglia e ridimensiona immagini o addirittura convertile in PDF. Tutta l'elaborazione avviene nel tuo browser, i tuoi file non lasciano mai il dispositivo e non è necessaria alcuna installazione.",
    emoji: "Selettore di Emoji",
    symbol: "Selettore di Simboli",
    kaomoji: "Selettore di Kaomoji",
    lenny: "Generatore di Lenny Face",
    qr: "Generatore di QR Code",
    barcode: "Generatore di Codici a Barre",
    cropper: "Ritaglia Immagine",
    resizer: "Ridimensiona Immagine",
    img_pdf: "Immagine in PDF",
    signature: "Firma Online",
  },
  id: {
    title: "Alat Gambar",
    meta: "Alat gambar online gratis: pemilih emoji, kaomoji dan simbol, generator kode QR dan barcode, pemotong, pengubah ukuran gambar dan konversi gambar ke PDF. Tanpa instalasi!",
    desc: "Pilih emoji, kaomoji dan simbol, buat kode QR dan barcode, potong dan ubah ukuran gambar atau bahkan konversi ke PDF. Semua pemrosesan dilakukan di browser Anda, file Anda tidak pernah meninggalkan perangkat Anda dan tidak diperlukan instalasi.",
    emoji: "Pemilih Emoji",
    symbol: "Pemilih Simbol",
    kaomoji: "Pemilih Kaomoji",
    lenny: "Generator Lenny Face",
    qr: "Generator Kode QR",
    barcode: "Generator Barcode",
    cropper: "Pemotong Gambar",
    resizer: "Pengubah Ukuran Gambar",
    img_pdf: "Gambar ke PDF",
    signature: "Tanda Tangan Online",
  },
  de: {
    title: "Bild-Werkzeuge",
    meta: "Kostenlose Online-Bildwerkzeuge: Emoji-, Kaomoji- und Symbol-Auswahl, QR-Code- und Barcode-Generator, Bild zuschneiden, Größe ändern und in PDF umwandeln. Keine Installation erforderlich!",
    desc: "Wähle Emojis, Kaomojis und Symbole, erstelle QR-Codes und Barcodes, schneide Bilder zu und ändere deren Größe oder konvertiere sie sogar in PDF. Die gesamte Verarbeitung erfolgt in deinem Browser, deine Dateien verlassen nie dein Gerät und es ist keine Installation erforderlich.",
    emoji: "Emoji-Auswahl",
    symbol: "Symbol-Auswahl",
    kaomoji: "Kaomoji-Auswahl",
    lenny: "Lenny-Face-Generator",
    qr: "QR-Code-Generator",
    barcode: "Barcode-Generator",
    cropper: "Bild zuschneiden",
    resizer: "Bildgröße ändern",
    img_pdf: "Bild zu PDF",
    signature: "Online Unterschrift",
  },
  nl: {
    title: "Afbeeldingstools",
    meta: "Gratis online afbeeldingstools: emoji-kiezer, kaomoji-kiezer, symboolkiezer, QR-code- en barcodegeneratoren, afbeelding bijsnijden, formaat wijzigen en afbeelding naar PDF converter. Geen installatie nodig!",
    desc: "Kies emoji's, kaomoji's en symbolen, genereer QR-codes en barcodes, snijd afbeeldingen bij en wijzig het formaat of converteer ze zelfs naar PDF. Alle verwerking vindt plaats in je browser, je bestanden verlaten je apparaat nooit en er is geen installatie nodig.",
    emoji: "Emoji-kiezer",
    symbol: "Symboolkiezer",
    kaomoji: "Kaomoji-kiezer",
    lenny: "Lenny Face-generator",
    qr: "QR-codegenerator",
    barcode: "Barcodegenerator",
    cropper: "Bijsnijden",
    resizer: "Formaat wijzigen",
    img_pdf: "Afbeelding naar PDF",
    signature: "Online Handtekening",
  }
}
</i18n>
