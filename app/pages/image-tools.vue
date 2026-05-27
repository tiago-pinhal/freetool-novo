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
        nl: '/afbeeldingstools',
        ru: '/instrumenty-dlya-izobrazheniy'
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
        to="copy-paste-symbols" 
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
      <ToolCard :title="t('blur')"
        to="blur-image"
        icon="mdi:blur"
        :index="10"
      />
      <ToolCard :title="t('compressor')"
        to="image-compressor"
        icon="mdi:image-minus"
        :index="11"
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
    meta: "Free online image tools: image compressor, emoji picker, kaomoji picker, symbol picker, QR code and barcode generators, image cropper, resizer, blur tool, and image to PDF converter. No installation needed!",
    desc: "Compress, crop, resize, and blur images, convert them to PDF, pick emojis, kaomojis and symbols, or generate QR codes and barcodes. All processing happens in your browser, your files never leave your device and no installation is required.",
    emoji: "Emoji Picker",
    symbol: "Symbol Picker",
    kaomoji: "Kaomoji Picker",
    lenny: "Lenny Face Generator",
    qr: "QR Code Generator",
    barcode: "Barcode Generator",
    cropper: "Image Cropper",
    resizer: "Image Resizer",
    blur: "Blur Image",
    img_pdf: "Image to PDF",
    signature: "Signature Maker",
    compressor: "Compress Image",
  },
  pt: {
    title: "Ferramentas para Imagem",
    meta: "Ferramentas de imagem online grátis: compressor de imagem, seletor de emoji, seletor de kaomojis, seletor de símbolos, gerador de QR code e código de barras, recorte, redimensionamento, desfoque e conversão de imagem para PDF. Sem instalação!",
    desc: "Comprima, recorte, redimensione e desfoque imagens, converta imagens em PDF, escolha emojis, kaomojis e símbolos, ou gere QR codes e códigos de barras. Todo o processamento acontece no seu navegador, seus arquivos nunca saem do seu dispositivo e nenhuma instalação é necessária.",
    emoji: "Seletor de Emoji",
    symbol: "Seletor de Símbolos",
    kaomoji: "Seletor de Kaomojis",
    lenny: "Gerador de Lenny Face",
    qr: "Gerador de QR Code",
    barcode: "Gerador de Código de Barras",
    cropper: "Recortar Imagem",
    resizer: "Redimensionar Imagem",
    blur: "Desfocar Imagem",
    img_pdf: "Imagem para PDF",
    signature: "Assinar Online",
    compressor: "Comprimir Imagem",
  },
  es: {
    title: "Herramientas para Imágenes",
    meta: "Herramientas de imagen online gratis: compresor de imagen, selector de emoji, kaomojis y símbolos, generador de QR y códigos de barras, recorte, redimensionamiento, desenfoque y conversión de imagen a PDF. ¡Sin instalación!",
    desc: "Comprime, recorta, redimensiona y desenfoca imágenes, conviértelas a PDF, elige emojis, kaomojis y símbolos, o genera códigos QR y de barras. Todo el procesamiento ocurre en tu navegador, tus archivos nunca salen de tu dispositivo y no necesitas instalar nada.",
    emoji: "Selector de Emoji",
    symbol: "Selector de Símbolos",
    kaomoji: "Selector de Kaomojis",
    lenny: "Generador de Lenny Face",
    qr: "Generador de Códigos QR",
    barcode: "Generador de Códigos de Barras",
    cropper: "Recortar Imagen",
    resizer: "Redimensionar Imagen",
    blur: "Desenfocar Imagen",
    img_pdf: "Imagen a PDF",
    signature: "Firma Online",
    compressor: "Comprimir Imagen",
  },
  fr: {
    title: "Outils pour Images",
    meta: "Outils d'image en ligne gratuits : compresseur d'image, sélecteur d'emoji, de kaomoji et de symboles, générateur de QR code et de codes-barres, rognage, redimensionnement, floutage et conversion d'image en PDF. Sans installation !",
    desc: "Compressez, rognez, redimensionnez et floutez des images, convertissez-les en PDF, choisissez des emojis, des kaomojis et des symboles, ou générez des codes QR et des codes-barres. Tout le traitement se fait dans votre navigateur, vos fichiers ne quittent jamais votre appareil et aucune installation n'est requise.",
    emoji: "Sélecteur d'Emoji",
    symbol: "Sélecteur de Symboles",
    kaomoji: "Sélecteur de Kaomoji",
    lenny: "Générateur de Lenny Face",
    qr: "Générateur de QR Code",
    barcode: "Générateur de Codes-barres",
    cropper: "Rogner Image",
    resizer: "Redimensionner Image",
    blur: "Flouter Image",
    img_pdf: "Image en PDF",
    signature: "Signature en Ligne",
    compressor: "Compresser Image",
  },
  it: {
    title: "Strumenti per Immagini",
    meta: "Strumenti immagine online gratuiti: compressore di immagini, selettore di emoji, kaomoji e simboli, generatore di QR code e codici a barre, ritaglio, ridimensionamento, sfocatura e conversione immagine in PDF. Senza installazione!",
    desc: "Comprimere, ritaglia, ridimensiona e sfoca immagini, convertile in PDF, scegli emoji, kaomoji e simboli, o genera codici QR e codici a barre. Tutta l'elaborazione avviene nel tuo browser, i tuoi file non lasciano mai il dispositivo e non è necessaria alcuna installazione.",
    emoji: "Selettore di Emoji",
    symbol: "Selettore di Simboli",
    kaomoji: "Seletore di Kaomoji",
    lenny: "Generatore di Lenny Face",
    qr: "Generatore di QR Code",
    barcode: "Generatore di Codici a Barre",
    cropper: "Ritaglia Immagine",
    resizer: "Ridimensiona Immagine",
    blur: "Sfocare Immagine",
    img_pdf: "Immagine in PDF",
    signature: "Firma Online",
    compressor: "Comprimere Immagine",
  },
  id: {
    title: "Alat Gambar",
    meta: "Alat gambar online gratis: kompres gambar, pemilih emoji, kaomoji dan simbol, generator kode QR dan barcode, pemotong, pengubah ukuran, pembuat buram gambar, dan konversi gambar ke PDF. Tanpa instalasi!",
    desc: "Kompres, potong, ubah ukuran, dan buramkan gambar, konversi ke PDF, pilih emoji, kaomoji dan simbol, atau buat kode QR dan barcode. Semua pemrosesan dilakukan di browser Anda, file Anda tidak pernah meninggalkan perangkat Anda dan tidak diperlukan instalasi.",
    emoji: "Pemilih Emoji",
    symbol: "Pemilih Simbol",
    kaomoji: "Pemilih Kaomoji",
    lenny: "Generator Lenny Face",
    qr: "Generator Kode QR",
    barcode: "Generator Barcode",
    cropper: "Pemotong Gambar",
    resizer: "Pengubah Ukuran Gambar",
    blur: "Buramkan Gambar",
    img_pdf: "Gambar ke PDF",
    signature: "Tanda Tangan Online",
    compressor: "Kompres Gambar",
  },
  de: {
    title: "Bild-Werkzeuge",
    meta: "Kostenlose Online-Bildwerkzeuge: Bild komprimieren, Emoji-, Kaomoji- und Symbol-Auswahl, QR-Code- und Barcode-Generator, Bild zuschneiden, Größe ändern, weichzeichnen und in PDF umwandeln. Keine Installation erforderlich!",
    desc: "Komprimiere, schneide Bilder zu, ändere deren Größe, zeichne sie weich, konvertiere sie in PDF, wähle Emojis, Kaomojis und Symbole, oder erstelle QR-Codes und Barcodes. Die gesamte Verarbeitung erfolgt in deinem Browser, deine Dateien verlassen nie dein Gerät und es ist keine Installation erforderlich.",
    emoji: "Emoji-Auswahl",
    symbol: "Symbol-Auswahl",
    kaomoji: "Kaomoji-Auswahl",
    lenny: "Lenny-Face-Generator",
    qr: "QR-Code-Generator",
    barcode: "Barcode-Generator",
    cropper: "Bild zuschneiden",
    resizer: "Bildgröße ändern",
    blur: "Bild weichzeichnen",
    img_pdf: "Bild zu PDF",
    signature: "Online Unterschrift",
    compressor: "Bild komprimieren",
  },
  nl: {
    title: "Afbeeldingstools",
    meta: "Gratis online afbeeldingstools: afbeelding comprimeren, emoji-kiezer, kaomoji-kiezer, symboolkiezer, QR-code- en barcodegeneratoren, afbeelding bijsnijden, formaat wijzigen, vervagen en afbeelding naar PDF converter. Geen installatie nodig!",
    desc: "Comprimeer, snijd afbeeldingen bij, wijzig het formaat, vervaag ze, converteer ze naar PDF, kies emoji's, kaomoji's en symbolen, of genereer QR-codes en barcodes. Alle verwerking vindt plaats in je browser, je bestanden verlaten je apparaat nooit en er is geen installatie nodig.",
    emoji: "Emoji-kiezer",
    symbol: "Symboolkiezer",
    kaomoji: "Kaomoji-kiezer",
    lenny: "Lenny Face-generator",
    qr: "QR-codegenerator",
    barcode: "Barcodegenerator",
    cropper: "Bijsnijden",
    resizer: "Formaat wijzigen",
    blur: "Afbeelding Vervagen",
    img_pdf: "Afbeelding naar PDF",
    signature: "Online Handtekening",
    compressor: "Afbeelding comprimeren",
  },
  ru: {
    title: "Инструменты для изображений",
    meta: "Бесплатные онлайн-инструменты для работы с изображениями: сжатие изображений, выбор смайликов (эмодзи), каомодзи и символов, генераторы QR-кодов и штрихкодов, обрезка, изменение размера, размытие и конвертер изображений в PDF. Без установки!",
    desc: "Сжимайте, обрезайте, изменяйте размер и размывайте изображения, конвертируйте их в PDF, выбирайте эмодзи, каомодзи и символы, а также генерируйте QR-коды и штрихкоды. Вся обработка происходит в вашем браузере, ваши файлы никогда не покидают ваше устройство, и установка программ не требуется.",
    emoji: "Выбор эмодзи",
    symbol: "Выбор символов",
    kaomoji: "Выбор каомодзи",
    lenny: "Генератор Lenny Face",
    qr: "Генератор QR-кодов",
    barcode: "Генератор штрихкодов",
    cropper: "Обрезка изображений",
    resizer: "Изменение размера",
    blur: "Размытие изображений",
    img_pdf: "Изображение в PDF",
    signature: "Создание подписи",
    compressor: "Сжатие изображений"
  }
}
</i18n>
