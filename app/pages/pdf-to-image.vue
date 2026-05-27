<script setup lang="ts">
declare global {
  interface Window {
    'pdfjs-dist/build/pdf': any
    JSZip: any
    download: any
  }
}

interface PageItem {
  dataUrl: string
  pageNum: number
}

const { t } = useI18n({ useScope: 'local' })

const pages = ref<PageItem[]>([])
const loading = ref(false)
const converting = ref(false)
const format = ref<'jpg' | 'png'>('jpg')
const qualityLevel = ref<'normal' | 'high' | 'ultra'>('high')
let pdfViewer: any = null

const faqItems = computed(() => [
  { question: t('faq_1_q'), answer: t('faq_1_a') },
  { question: t('faq_2_q'), answer: t('faq_2_a') },
  { question: t('faq_3_q'), answer: t('faq_3_a') },
  { question: t('faq_4_q'), answer: t('faq_4_a') },
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  faq: faqItems.value,
})

useHead({
  title: t('page_title'),
  meta: [{ name: 'description', content: t('meta') }],
})

const { onLoaded: onPdfjsLoaded } = useScript(
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.min.js',
  { trigger: 'client' }
)
useScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', { trigger: 'client' })
useScript('https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js', { trigger: 'client' })

onPdfjsLoaded(() => {
  pdfViewer = window['pdfjs-dist/build/pdf']
  if (pdfViewer) {
    pdfViewer.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'
  }
})

async function onPdfSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  await renderPdf(input.files[0]!)
  input.value = ''
}

async function renderPdf(file: File) {
  if (!pdfViewer) {
    pdfViewer = window['pdfjs-dist/build/pdf']
    if (pdfViewer) {
      pdfViewer.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'
    }
  }
  if (!pdfViewer) return

  loading.value = true
  pages.value = []

  const scaleMap = { normal: 1.5, high: 2, ultra: 3 }
  const scale = scaleMap[qualityLevel.value]
  const mimeType = format.value === 'png' ? 'image/png' : 'image/jpeg'

  try {
    const url = URL.createObjectURL(file)
    const pdfDoc = await pdfViewer.getDocument(url).promise
    URL.revokeObjectURL(url)

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i)
      const viewport = page.getViewport({ scale })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
      pages.value.push({ dataUrl: canvas.toDataURL(mimeType, 0.92), pageNum: i })
    }
  } catch (e: any) {
    alert(e?.name === 'PasswordException' ? t('err_pass') : t('err'))
  } finally {
    loading.value = false
  }
}

function downloadPage(page: PageItem) {
  const ext = format.value === 'png' ? 'png' : 'jpg'
  window.download(page.dataUrl, `pagina-${page.pageNum}.${ext}`)
}

async function downloadAll() {
  if (!pages.value.length || !window.download) return

  if (pages.value.length === 1) {
    downloadPage(pages.value[0]!)
    return
  }

  if (!window.JSZip) return

  converting.value = true
  setTimeout(async () => {
    try {
      const zip = new window.JSZip()
      const ext = format.value === 'png' ? 'png' : 'jpg'
      for (const page of pages.value) {
        const base64 = page.dataUrl.split(',')[1]!
        zip.file(`pagina-${page.pageNum}.${ext}`, base64, { base64: true })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      window.download(blob, 'imagens.zip', 'application/zip')
    } finally {
      converting.value = false
    }
  }, 100)
}

function reload() {
  pages.value = []
}

defineI18nRoute({
  paths: {
    en: '/pdf-to-image',
    pt: '/pdf-para-imagem',
    es: '/pdf-a-imagen',
    fr: '/pdf-en-image',
    it: '/pdf-in-immagine',
    id: '/pdf-ke-gambar',
    de: '/pdf-zu-bild',
    nl: '/pdf-naar-afbeelding',
    ru: '/pdf-v-izobrazhenie',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="pages.length > 0"
    :see-also-links="[
      { label: t('see1'), to: 'image-to-pdf' },
      { label: t('see2'), to: 'pdf-editor' },
      { label: t('see3'), to: 'pdf-splitter' },
      { label: t('see4'), to: 'resize-image' },
    ]"
  >
    <!-- Upload state -->
    <div v-if="pages.length === 0 && !loading" class="flex flex-col items-center justify-center py-8 gap-6">
      <label class="flex flex-col items-center justify-center w-full max-w-2xl h-44 border-2 border-dashed rounded-xl border-base-content/20 bg-base-200/40 hover:bg-base-200/70 hover:border-primary/40 transition-colors cursor-pointer">
        <Icon name="heroicons:document-arrow-up-20-solid" class="w-12 h-12 mb-3 text-base-content/60" />
        <p class="mb-2 text-base-content/70">
          <span class="font-semibold">{{ t('click_upload') }}</span> {{ t('or_drag') }}
        </p>
        <input type="file" accept="application/pdf" class="hidden" @change="onPdfSelected" />
      </label>

      <div class="flex flex-wrap gap-6 justify-center">
        <div class="flex items-center gap-2">
          <span class="text-sm text-base-content/70">{{ t('format') }}:</span>
          <div class="join">
            <button
              type="button"
              class="join-item btn btn-sm"
              :class="format === 'jpg' ? 'btn-primary' : 'btn-outline border-base-content/20'"
              @click="format = 'jpg'"
            >JPG</button>
            <button
              type="button"
              class="join-item btn btn-sm"
              :class="format === 'png' ? 'btn-primary' : 'btn-outline border-base-content/20'"
              @click="format = 'png'"
            >PNG</button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-base-content/70">{{ t('quality') }}:</span>
          <select v-model="qualityLevel" class="select select-sm select-bordered">
            <option value="normal">{{ t('q_normal') }}</option>
            <option value="high">{{ t('q_high') }}</option>
            <option value="ultra">{{ t('q_ultra') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Initial loading state -->
    <div v-else-if="loading && pages.length === 0" class="flex flex-col items-center justify-center py-16 gap-4">
      <span class="loading loading-spinner loading-lg text-primary" />
      <p class="text-base-content/70">{{ t('converting') }}</p>
    </div>

    <!-- Pages state -->
    <div v-else class="space-y-4">
      <div class="flex flex-wrap gap-2 items-center">
        <button type="button" class="btn btn-ghost btn-sm" :disabled="loading" @click="reload">
          <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4" /> {{ t('restart') }}
        </button>
        <span v-if="loading" class="text-sm text-base-content/50">{{ t('rendering') }}</span>
        <button
          type="button"
          class="btn btn-primary btn-sm ml-auto"
          :disabled="converting || loading"
          @click="downloadAll"
        >
          <Icon
            name="heroicons:document-arrow-down-20-solid"
            class="w-4 h-4"
            :class="{ 'animate-spin': converting }"
          />
          {{ converting ? t('downloading') : pages.length === 1 ? t('download_image') : t('download_all') }}
        </button>
      </div>

      <div class="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div
          v-for="page in pages"
          :key="page.pageNum"
          class="relative group rounded-xl overflow-hidden border border-base-content/10 bg-base-200/35"
        >
          <div class="h-32 sm:h-40 flex items-center justify-center bg-base-200/50 overflow-hidden">
            <img
              :src="page.dataUrl"
              class="max-w-full max-h-full object-contain"
              :alt="`Página ${page.pageNum}`"
            />
          </div>
          <button
            type="button"
            class="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            :aria-label="t('download_page')"
            @click="downloadPage(page)"
          >
            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-4 h-4 text-white" />
          </button>
          <div class="text-xs text-center text-base-content/40 py-1">{{ page.pageNum }}</div>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('intro') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :description="t('use_cases_desc')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') },
            { title: t('uc_4_title'), description: t('uc_4_desc') },
          ]"
        />

        <HowToSection
          :title="t('how_to_title')"
          :items="[
            { title: t('how_1_title'), description: t('how_1_desc') },
            { title: t('how_2_title'), description: t('how_2_desc') },
            { title: t('how_3_title'), description: t('how_3_desc') },
          ]"
        />

        <FaqSection :title="t('faq_title')" :items="faqItems" />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
en:
  title: "PDF to Image"
  page_title: "Convert PDF to Image Online - Free"
  meta: "Convert PDF pages to JPG or PNG online for free. Adjust image quality and download all pages in a single ZIP file. 100% local and secure processing."
  intro: "Convert each page of your PDF into a crisp JPG or PNG image. Choose the ideal resolution and download the complete batch compressed in a single ZIP, or save pages individually. Everything is processed locally in your browser, ensuring total privacy."
  click_upload: "Click to upload"
  or_drag: "or drag and drop"
  restart: "Start over"
  converting: "Converting..."
  rendering: "Converting remaining pages..."
  downloading: "Downloading..."
  download_image: "Download Image"
  download_all: "Download All (ZIP)"
  download_page: "Download page"
  format: "Format"
  quality: "Quality"
  q_normal: "Normal"
  q_high: "High"
  q_ultra: "Ultra"
  err: "An error occurred while trying to open the PDF file"
  err_pass: "Password-protected PDF file"
  features_title: "PDF to Image Converter Features"
  feature_1: "Convert each PDF page into an independent image"
  feature_2: "Choose between JPG (smaller size) or PNG (lossless quality)"
  feature_3: "Three rendering quality levels: Normal, High, and Ultra"
  feature_4: "100% private — local processing, your files never leave your device"
  use_cases_title: "When to Use the PDF to Image Converter"
  use_cases_desc: "Converting a PDF to an image is ideal when you need to extract the visual content of a document to publish on social media, include in presentations, or edit in graphic design software."
  uc_1_title: "Share on Social Media"
  uc_1_desc: "Publish reports, portfolios, academic certificates, or menus directly and visually on Instagram, LinkedIn, and WhatsApp, without requiring users to download a file."
  uc_2_title: "Edit PDF Content"
  uc_2_desc: "Transform pages into editable files to easily use them in Canva, Photoshop, or other design tools."
  uc_3_title: "Create Thumbnails and Previews"
  uc_3_desc: "Create attractive cover images and previews (thumbnails) for e-books, presentations, or contracts on blogs and digital product platforms."
  uc_4_title: "Print Specific Pages"
  uc_4_desc: "Generate image versions of separate pages to resize and print quickly and practically."
  how_to_title: "How to Convert PDF to Image"
  how_1_title: "Configure and upload your PDF"
  how_1_desc: "Select the format (JPG or PNG), choose the quality, and upload your PDF by clicking on the upload area or dragging the file."
  how_2_title: "Wait for the conversion"
  how_2_desc: "Each PDF page is rendered individually on your screen in real time, with no waiting queues."
  how_3_title: "Download your images"
  how_3_desc: "Click 'Download All' to get a compressed ZIP or download individual pages by hovering over a page and clicking the download icon."
  faq_title: "Questions & Answers"
  faq_1_q: "What is the difference between JPG and PNG?"
  faq_1_a: "JPG compresses the image to generate smaller files, making it ideal for photos and long reports. PNG preserves all original details with lossless quality, recommended for small text, logos, and elements with transparent backgrounds."
  faq_2_q: "Which quality level should I choose?"
  faq_2_a: "Normal quality is ideal for quick on-screen viewing. High meets most needs with excellence. Ultra generates maximum clarity and detail, producing larger files and requiring a bit more processing."
  faq_3_q: "Are my files sent to any server?"
  faq_3_a: "No. The entire process is performed locally in your own browser. Your files never leave your device, ensuring total privacy and confidentiality."
  faq_4_q: "Does the converter support password-protected PDFs?"
  faq_4_a: "No. To ensure security and the feasibility of 100% local processing, password-protected files are not supported. Remove the PDF password before converting."
  see1: "Image to PDF"
  see2: "PDF Editor"
  see3: "Split PDF"
  see4: "Resize Image"
es:
  title: "PDF a Imagen"
  page_title: "Convertir PDF a Imagen Online - Gratis"
  meta: "Convierte páginas de PDF a JPG o PNG online y gratis. Ajusta la calidad de la imagen y descarga todas las páginas en un solo archivo ZIP. Procesamiento 100% local y seguro."
  intro: "Convierte cada página de tu PDF en una imagen nítida en formato JPG o PNG. Elige la resolución ideal y descarga el lote completo comprimido en un único ZIP, o guarda las páginas individualmente. Todo se procesa localmente en tu navegador, garantizando total privacidad."
  click_upload: "Haz clic para subir"
  or_drag: "o arrastra y suelta"
  restart: "Reiniciar"
  converting: "Convirtiendo..."
  rendering: "Convirtiendo páginas restantes..."
  downloading: "Descargando..."
  download_image: "Descargar Imagen"
  download_all: "Descargar Todo (ZIP)"
  download_page: "Descargar página"
  format: "Formato"
  quality: "Calidad"
  q_normal: "Normal"
  q_high: "Alta"
  q_ultra: "Ultra"
  err: "Ocurrió un error al intentar abrir el archivo PDF"
  err_pass: "Archivo PDF protegido por contraseña"
  features_title: "Características del Conversor de PDF a Imagen"
  feature_1: "Convierte cada página del PDF en una imagen independiente"
  feature_2: "Elige entre JPG (menor tamaño) o PNG (sin pérdida de calidad)"
  feature_3: "Tres niveles de calidad de renderizado: Normal, Alta y Ultra"
  feature_4: "100% privado — procesamiento local, tus archivos nunca salen de tu dispositivo"
  use_cases_title: "Cuándo Usar el Conversor de PDF a Imagen"
  use_cases_desc: "La conversión de PDF a imagen es ideal cuando necesitas extraer el contenido visual de un documento para publicarlo en redes sociales, incluirlo en presentaciones o editarlo en programas de diseño gráfico."
  uc_1_title: "Compartir en Redes Sociales"
  uc_1_desc: "Publica informes, portafolios, certificados académicos o menús de forma directa y visual en Instagram, LinkedIn y WhatsApp, sin exigir que el usuario descargue un archivo."
  uc_2_title: "Editar Contenido del PDF"
  uc_2_desc: "Transforma las páginas en archivos editables para usarlos fácilmente en Canva, Photoshop u otras herramientas de diseño."
  uc_3_title: "Crear Miniaturas y Previsualizaciones"
  uc_3_desc: "Crea imágenes de portada y previsualizaciones (thumbnails) atractivas para libros electrónicos, presentaciones o contratos en blogs y plataformas de infoproductos."
  uc_4_title: "Imprimir Páginas Específicas"
  uc_4_desc: "Genera versiones en imagen de páginas sueltas para redimensionarlas e imprimirlas de forma rápida y práctica."
  how_to_title: "Cómo Convertir PDF a Imagen"
  how_1_title: "Configura y sube tu PDF"
  how_1_desc: "Selecciona el formato (JPG o PNG), elige la calidad y sube tu PDF haciendo clic en el área de carga o arrastrando el archivo."
  how_2_title: "Espera la conversión"
  how_2_desc: "Cada página del PDF se renderiza individualmente en tu pantalla en tiempo real, sin colas de espera."
  how_3_title: "Descarga las imágenes"
  how_3_desc: "Haz clic en 'Descargar Todo' para obtener un ZIP comprimido o descarga páginas individuales pasando el cursor y haciendo clic en el icono de descarga."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Cuál es la diferencia entre JPG y PNG?"
  faq_1_a: "El JPG comprime la imagen generando archivos más ligeros, ideal para fotos e informes largos. El PNG preserva todos los detalles originales sin pérdida de calidad, recomendado para textos pequeños, logotipos y elementos con fondo transparente."
  faq_2_q: "¿Qué nivel de calidad debo elegir?"
  faq_2_a: "La calidad Normal es ideal para una visualización rápida en pantalla. La Alta cumple con excelencia en la mayoría de los casos. La Ultra genera la máxima nitidez y detalle, produciendo archivos más grandes y requiriendo un poco más de procesamiento."
  faq_3_q: "¿Mis archivos se envían a algún servidor?"
  faq_3_a: "No. Todo el proceso se realiza localmente en tu propio navegador. Tus archivos nunca salen de tu dispositivo, garantizando total privacidad y confidencialidad."
  faq_4_q: "¿El conversor es compatible con PDF protegidos por contraseña?"
  faq_4_a: "No. Para garantizar la seguridad y la viabilidad del procesamiento 100% local, los archivos protegidos con contraseña no son compatibles. Elimina la contraseña del PDF antes de realizar la conversión."
  see1: "Imagen a PDF"
  see2: "Editor de PDF"
  see3: "Dividir PDF"
  see4: "Redimensionar Imagen"
fr:
  title: "PDF en Image"
  page_title: "Convertir un PDF en Image en Ligne - Gratuit"
  meta: "Convertissez les pages de vos PDF en JPG ou PNG en ligne et gratuitement. Ajustez la qualité de l'image et téléchargez toutes les pages dans un seul fichier ZIP. Traitement 100 % local et sécurisé."
  intro: "Convertissez chaque page de votre PDF en une image nette au format JPG ou PNG. Choisissez la résolution idéale et téléchargez le lot complet compressé dans un seul fichier ZIP, ou enregistrez les pages individuellement. Tout est traité localement dans votre navigateur, garantissant une confidentialité totale."
  click_upload: "Cliquez pour importer"
  or_drag: "ou glissez-déposez"
  restart: "Recommencer"
  converting: "Conversion en cours..."
  rendering: "Conversion des pages restantes..."
  downloading: "Téléchargement..."
  download_image: "Télécharger l'image"
  download_all: "Tout télécharger (ZIP)"
  download_page: "Télécharger la page"
  format: "Format"
  quality: "Qualité"
  q_normal: "Normale"
  q_high: "Élevée"
  q_ultra: "Ultra"
  err: "Une erreur est survenue lors de l'ouverture du fichier PDF"
  err_pass: "Fichier PDF protégé par mot de passe"
  features_title: "Fonctionnalités du Convertisseur PDF en Image"
  feature_1: "Convertissez chaque page du PDF en une image indépendante"
  feature_2: "Choisissez entre JPG (taille réduite) ou PNG (sans perte de qualité)"
  feature_3: "Trois niveaux de qualité de rendu : Normale, Élevée et Ultra"
  feature_4: "100 % privé — traitement local, vos fichiers ne quittent jamais votre appareil"
  use_cases_title: "Quand Utiliser le Convertisseur de PDF en Image"
  use_cases_desc: "La conversion de PDF en image est idéale lorsque vous devez extraire le contenu visuel d'un document pour le publier sur les réseaux sociaux, l'inclure dans des présentations ou l'éditer dans des logiciels de graphisme."
  uc_1_title: "Partager sur les Réseaux Sociaux"
  uc_1_desc: "Publiez des rapports, des portfolios, des certificats académiques ou des menus directement et visuellement sur Instagram, LinkedIn et WhatsApp, sans obliger l'utilisateur à télécharger un fichier."
  uc_2_title: "Modifier le Contenu du PDF"
  uc_2_desc: "Transformez les pages en fichiers modifiables pour les utiliser facilement dans Canva, Photoshop ou d'autres outils de création."
  uc_3_title: "Créer des Miniatures et Aperçus"
  uc_3_desc: "Créez des images de couverture et des aperçus (thumbnails) attrayants pour des e-books, des présentations ou des contrats sur des blogs et des plateformes d'infoproduits."
  uc_4_title: "Imprimer des Pages Spécifiques"
  uc_4_desc: "Générez des versions image de pages individuelles pour les redimensionner et les imprimer rapidement et facilement."
  how_to_title: "Comment Convertir un PDF en Image"
  how_1_title: "Configurez et importez votre PDF"
  how_1_desc: "Sélectionnez le format (JPG ou PNG), choisissez la qualité et importez votre PDF en cliquant sur la zone de téléchargement ou en faisant glisser le fichier."
  how_2_title: "Attendez la conversion"
  how_2_desc: "Chaque page du PDF est générée individuellement sur votre écran en temps réel, sans file d'attente."
  how_3_title: "Téléchargez les images"
  how_3_desc: "Cliquez sur 'Tout télécharger' pour obtenir un ZIP compressé ou téléchargez des pages individuelles en survolant la page et en cliquant sur l'icône de téléchargement."
  faq_title: "Questions & Réponses"
  faq_1_q: "Quelle est la différence entre JPG et PNG ?"
  faq_1_a: "Le JPG compresse l'image pour générer des fichiers plus légers, ce qui est idéal pour les photos et les rapports volumineux. Le PNG préserve tous les détails d'origine sans perte de qualité, recommandé pour les petits textes, les logos et les éléments avec un fond transparent."
  faq_2_q: "Quel niveau de qualité dois-je choisir ?"
  faq_2_a: "La qualité Normale est idéale pour une visualisation rapide à l'écran. La qualité Élevée répond parfaitement à la plupart des besoins. La qualité Ultra offre une netteté et des détails optimaux, ce qui génère des fichiers plus volumineux et nécessite un peu plus de traitement."
  faq_3_q: "Mes fichiers sont-ils envoyés vers un serveur ?"
  faq_3_a: "Non. Tout le processus est effectué localement dans votre propre navigateur. Vos fichiers ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité totales."
  faq_4_q: "Le convertisseur prend-il en charge les PDF protégés par mot de passe ?"
  faq_4_a: "Non. Afin de garantir la sécurité et la faisabilité du traitement 100 % local, les fichiers protégés par mot de passe ne sont pas pris en charge. Veuillez supprimer le mot de passe du PDF avant la conversion."
  see1: "Image en PDF"
  see2: "Éditeur PDF"
  see3: "Diviser PDF"
  see4: "Redimensionner Image"
it:
  title: "PDF in Immagine"
  page_title: "Convertire PDF in Immagine Online - Gratis"
  meta: "Converti le pagine dei PDF in immagini JPG o PNG online e gratis. Regola la qualità dell'immagine e scarica tutte le pagine in un unico file ZIP. Elaborazione 100% locale e sicura."
  intro: "Converti ogni pagina del tuo PDF in un'immagine nitida in formato JPG o PNG. Scegli la risoluzione ideale e scarica l'intero lotto compresso in un unico file ZIP, oppure salva le pagine singolarmente. Tutto viene elaborato localmente nel tuo browser, garantendo una privacy totale."
  click_upload: "Clicca per caricare"
  or_drag: "o trascina e rilascia"
  restart: "Ricomincia"
  converting: "Conversione in corso..."
  rendering: "Conversione delle pagine rimanenti..."
  downloading: "Download in corso..."
  download_image: "Scarica Immagine"
  download_all: "Scarica Tutto (ZIP)"
  download_page: "Scarica pagina"
  format: "Formato"
  quality: "Qualità"
  q_normal: "Normale"
  q_high: "Alta"
  q_ultra: "Ultra"
  err: "Si è verificato un errore durante l'apertura del file PDF"
  err_pass: "File PDF protetto da password"
  features_title: "Caratteristiche del Convertitore da PDF a Immagine"
  feature_1: "Converti ogni pagina del PDF in un'immagine indipendente"
  feature_2: "Scegli tra JPG (dimensioni ridotte) o PNG (senza perdita di qualità)"
  feature_3: "Tre livelli di qualità di rendering: Normale, Alta e Ultra"
  feature_4: "100% privato — elaborazione locale, i tuoi file non lasciano mai il tuo dispositivo"
  use_cases_title: "Quando Usare il Convertitore da PDF a Immagine"
  use_cases_desc: "La conversione da PDF a immagine è ideale quando devi estrarre il contenuto visivo di un documento per pubblicarlo sui social network, inserirlo in presentazioni o modificarlo in software di grafica."
  uc_1_title: "Condividere sui Social Network"
  uc_1_desc: "Pubblica report, portfolio, certificati accademici o menu in modo diretto e visivo su Instagram, LinkedIn e WhatsApp, senza richiedere all'utente di scaricare un file."
  uc_2_title: "Modificare il Contenuto del PDF"
  uc_2_desc: "Trasforma le pagine in file modificabili per utilizzarli facilmente in Canva, Photoshop o altri strumenti di progettazione."
  uc_3_title: "Creare Miniature e Anteprime"
  uc_3_desc: "Crea immagini di copertina e anteprime (thumbnails) accattivanti per e-book, presentazioni o contratti su blog e piattaforme di infoprodotti."
  uc_4_title: "Stampare Pagine Specifiche"
  uc_4_desc: "Genera versioni immagine di singole pagine per ridimensionarle e stamparle in modo rapido e pratico."
  how_to_title: "Come Convertire un PDF in Immagine"
  how_1_title: "Configura e carica il tuo PDF"
  how_1_desc: "Seleziona il formato (JPG o PNG), scegli la qualità e carica il tuo PDF cliccando sull'area di caricamento o trascinando il file."
  how_2_title: "Attendi la conversione"
  how_2_desc: "Ogni pagina del PDF viene renderizzata singolarmente sullo schermo in tempo reale, senza code di attesa."
  how_3_title: "Scarica le immagini"
  how_3_desc: "Clicca su 'Scarica Tutto' per ottenere un ZIP compresso o scarica le singole pagine passando il cursore e cliccando sull'icona di download."
  faq_title: "Domande & Risposte"
  faq_1_q: "Qual è la differenza tra JPG e PNG?"
  faq_1_a: "Il JPG comprime l'immagine generando file più leggeri, ideale per foto e report lunghi. Il PNG conserva tutti i dettagli originali senza perdita di qualità, consigliato per testi piccoli, loghi ed elementi con sfondo trasparente."
  faq_2_q: "Quale livello di qualità dovrei scegliere?"
  faq_2_a: "La qualità Normale è ideale per una rapida visualizzazione sullo schermo. Quella Alta soddisfa con eccellenza la maggior parte delle esigenze. Quella Ultra genera la massima nitidezza e dettaglio, producendo file più grandi e richiedendo un po' più di elaborazione."
  faq_3_q: "I miei file vengono inviati a qualche server?"
  faq_3_a: "No. Tutto il processo viene eseguito localmente nel tuo browser. I tuoi file non lasciano mai il tuo dispositivo, garantendo totale privacy e riservatezza."
  faq_4_q: "Il convertitore supporta PDF protetti da password?"
  faq_4_a: "No. Per garantire la sicurezza e la fattibilità dell'elaborazione 100% locale, i file protetti da password non sono supportati. Rimuovi la password dal PDF prima della conversione."
  see1: "Immagine in PDF"
  see2: "Editor PDF"
  see3: "Dividi PDF"
  see4: "Ridimensiona Immagine"
id:
  title: "PDF ke Gambar"
  page_title: "Ubah PDF ke Gambar Online - Gratis"
  meta: "Ubah halaman PDF menjadi gambar JPG atau PNG online secara gratis. Sesuaikan kualitas gambar dan unduh semua halaman dalam satu file ZIP. Pemrosesan 100% lokal dan aman."
  intro: "Ubah setiap halaman PDF Anda menjadi gambar JPG atau PNG yang tajam. Pilih resolusi ideal dan unduh seluruh batch dalam satu file ZIP, atau simpan halaman secara individual. Semua diproses secara lokal di browser Anda, menjamin privasi penuh."
  click_upload: "Klik untuk mengunggah"
  or_drag: "atau seret dan lepaskan"
  restart: "Mulai Ulang"
  converting: "Mengonversi..."
  rendering: "Mengonversi halaman yang tersisa..."
  downloading: "Mengunduh..."
  download_image: "Unduh Gambar"
  download_all: "Unduh Semua (ZIP)"
  download_page: "Unduh halaman"
  format: "Format"
  quality: "Kualitas"
  q_normal: "Normal"
  q_high: "Tinggi"
  q_ultra: "Ultra"
  err: "Terjadi kesalahan saat mencoba membuka file PDF"
  err_pass: "File PDF dilindungi sandi"
  features_title: "Fitur Pengonversi PDF ke Gambar"
  feature_1: "Ubah setiap halaman PDF menjadi gambar terpisah"
  feature_2: "Pilih antara JPG (ukuran lebih kecil) atau PNG (kualitas tanpa penurunan)"
  feature_3: "Tiga tingkat kualitas rendering: Normal, Tinggi, dan Ultra"
  feature_4: "100% pribadi — pemrosesan lokal, file Anda tidak pernah meninggalkan perangkat Anda"
  use_cases_title: "Kapan Menggunakan Pengonversi PDF ke Gambar"
  use_cases_desc: "Mengonversi PDF ke gambar sangat ideal ketika Anda perlu mengekstrak konten visual dokumen untuk dipublikasikan di media sosial, dimasukkan ke dalam presentasi, atau diedit di perangkat lunak desain grafis."
  uc_1_title: "Bagikan di Media Sosial"
  uc_1_desc: "Publikasikan laporan, portofolio, sertifikat akademis, atau menu makanan secara langsung dan visual di Instagram, LinkedIn, dan WhatsApp, tanpa mengharuskan pengguna mengunduh file."
  uc_2_title: "Edit Konten PDF"
  uc_2_desc: "Ubah halaman menjadi file yang dapat diedit untuk digunakan dengan mudah di Canva, Photoshop, atau alat desain lainnya."
  uc_3_title: "Buat Miniatur dan Pratinjau"
  uc_3_desc: "Buat gambar sampul dan pratinjau (thumbnails) yang menarik untuk e-book, presentasi, atau kontrak di blog dan platform produk digital."
  uc_4_title: "Cetak Halaman Tertentu"
  uc_4_desc: "Hasilkan versi gambar dari halaman tertentu untuk mengubah ukuran dan mencetak secara cepat dan praktis."
  how_to_title: "Cara Mengonversi PDF ke Gambar"
  how_1_title: "Atur dan unggah PDF Anda"
  how_1_desc: "Pilih format (JPG atau PNG), pilih kualitas, lalu unggah PDF Anda dengan mengklik area unggahan atau menyeret file."
  how_2_title: "Tunggu konversi selesai"
  how_2_desc: "Setiap halaman PDF dirender secara individual di layar Anda secara real-time, tanpa antrean."
  how_3_title: "Unduh gambar Anda"
  how_3_desc: "Klik 'Unduh Semua' untuk mendapatkan file ZIP atau unduh halaman jika Anda ingin mengambil halaman secara individual dengan mengarahkan kursor dan mengklik ikon unduh."
  faq_title: "Pertanyaan & Jawaban"
  faq_1_q: "Apa perbedaan antara JPG dan PNG?"
  faq_1_a: "JPG mengompresi gambar untuk menghasilkan file yang lebih kecil, sangat ideal untuk foto dan laporan panjang. PNG mempertahankan semua detail asli tanpa kehilangan kualitas, direkomendasikan untuk teks kecil, logo, dan elemen dengan latar belakang transparan."
  faq_2_q: "Tingkat kualitas mana yang harus saya pilih?"
  faq_2_a: "Kualitas Normal ideal untuk pratinjau cepat di layar. Kualitas Tinggi memenuhi sebagian besar kebutuhan dengan sangat baik. Kualitas Ultra menghasilkan ketajaman dan detail maksimum, menghasilkan file yang lebih besar dan membutuhkan sedikit lebih banyak waktu pemrosesan."
  faq_3_q: "Apakah file saya dikirim ke server?"
  faq_3_a: "Tidak. Seluruh proses dilakukan secara lokal di browser Anda sendiri. File Anda tidak pernah meninggalkan perangkat Anda, menjamin privasi dan kerahasiaan penuh."
  faq_4_q: "Apakah pengonversi ini mendukung PDF yang dilindungi sandi?"
  faq_4_a: "Tidak. Untuk menjamin keamanan dan kelayakan pemrosesan 100% lokal, file yang dilindungi sandi tidak didukung. Hapus sandi PDF sebelum melakukan konversi."
  see1: "Gambar ke PDF"
  see2: "Editor PDF"
  see3: "Bagi PDF"
  see4: "Ubah Ukuran Gambar"
de:
  title: "PDF zu Bild"
  page_title: "PDF in Bilder umwandeln online - Kostenlos"
  meta: "Konvertieren Sie PDF-Seiten online und kostenlos in JPG- oder PNG-Bilder. Passen Sie die Bildqualität an und laden Sie alle Seiten in einer einzigen ZIP-Datei herunter. 100% lokale und sichere Verarbeitung."
  intro: "Konvertieren Sie jede Seite Ihres PDFs in ein gestochen scharfes JPG- oder PNG-Bild. Wählen Sie die ideale Auflösung und laden Sie alle Bilder gesammelt in einer ZIP-Datei herunter oder speichern Sie einzelne Seiten. Alles wird lokal in Ihrem Browser verarbeitet, was absolute Privatsphäre garantiert."
  click_upload: "Klicken zum Hochladen"
  or_drag: "oder per Drag & Drop herüberziehen"
  restart: "Neustarten"
  converting: "Wird konvertiert..."
  rendering: "Restliche Seiten werden konvertiert..."
  downloading: "Wird heruntergeladen..."
  download_image: "Bild herunterladen"
  download_all: "Alles herunterladen (ZIP)"
  download_page: "Seite herunterladen"
  format: "Format"
  quality: "Qualität"
  q_normal: "Normal"
  q_high: "Hoch"
  q_ultra: "Ultra"
  err: "Beim Öffnen der PDF-Datei ist ein Fehler aufgetreten"
  err_pass: "Passwortgeschützte PDF-Datei"
  features_title: "Funktionen des PDF-zu-Bild-Konverters"
  feature_1: "Konvertieren Sie jede PDF-Seite in ein separates Bild"
  feature_2: "Wählen Sie zwischen JPG (kleinere Dateigröße) oder PNG (verlustfreie Qualität)"
  feature_3: "Drei Stufen der Rendering-Qualität: Normal, Hoch und Ultra"
  feature_4: "100% privat — lokale Verarbeitung, Ihre Dateien verlassen niemals Ihr Gerät"
  use_cases_title: "Wann man den PDF-zu-Bild-Konverter verwendet"
  use_cases_desc: "Die Umwandlung von PDF in Bilder ist ideal, wenn Sie den visuellen Inhalt eines Dokuments extrahieren möchten, um ihn in sozialen Netzwerken zu posten, in Präsentationen einzufügen oder in Grafikprogrammen zu bearbeiten."
  uc_1_title: "In sozialen Netzwerken teilen"
  uc_1_desc: "Veröffentlichen Sie Berichte, Portfolios, akademische Zertifikate oder Speisekarten direkt und visuell auf Instagram, LinkedIn und WhatsApp, ohne dass der Benutzer eine Datei herunterladen muss."
  uc_2_title: "PDF-Inhalte bearbeiten"
  uc_2_desc: "Verwandeln Sie Seiten in bearbeitbare Dateien zur einfachen Verwendung in Canva, Photoshop oder anderen Designtools."
  uc_3_title: "Vorschaubilder und Previews erstellen"
  uc_3_desc: "Erstellen Sie ansprechende Cover- und Vorschaubilder (Thumbnails) für E-Books, Präsentationen oder Verträge in Blogs und auf Infoprodukt-Plattformen."
  uc_4_title: "Bestimmte Seiten drucken"
  uc_4_desc: "Erzeugen Sie Bildversionen einzelner Seiten, um sie schnell und einfach in der gewünschten Größe auszudrucken."
  how_to_title: "So konvertieren Sie PDF in Bild"
  how_1_title: "PDF konfigurieren und hochladen"
  how_1_desc: "Wählen Sie das Format (JPG oder PNG) und die gewünschte Qualität aus und laden Sie Ihr PDF hoch, indem Sie auf den Upload-Bereich klicken oder die Datei hineinziehen."
  how_2_title: "Warten Sie auf die Konvertierung"
  how_2_desc: "Jede PDF-Seite wird in Echtzeit einzeln auf Ihrem Bildschirm gerendert, ganz ohne Warteschlangen."
  how_3_title: "Laden Sie die Bilder herunter"
  how_3_desc: "Klicken Sie auf 'Alles herunterladen', um eine komprimierte ZIP-Datei zu erhalten, oder laden Sie einzelne Seiten herunter, indem Sie den Mauszeiger über die Seite bewegen und auf das Download-Symbol klicken."
  faq_title: "Fragen & Antworten"
  faq_1_q: "Was ist der Unterschied zwischen JPG und PNG?"
  faq_1_a: "JPG komprimiert das Bild für kleinere Dateien, ideal für Fotos und lange Berichte. PNG bewahrt alle Originaldetails ohne Qualitätsverlust, empfohlen für kleinen Text, Logos und Elemente mit transparentem Hintergrund."
  faq_2_q: "Welche Qualitätsstufe sollte ich wählen?"
  faq_2_a: "Die Qualität 'Normal' ist ideal für eine schnelle Anzeige auf dem Bildschirm. 'Hoch' erfüllt die meisten Anforderungen hervorragend. 'Ultra' bietet maximale Schärfe und Detailgenauigkeit, was größere Dateien erzeugt und etwas mehr Rechenzeit erfordert."
  faq_3_q: "Werden meine Dateien an einen Server gesendet?"
  faq_3_a: "Nein. Der gesamte Prozess wird lokal in Ihrem eigenen Browser ausgeführt. Ihre Dateien verlassen niemals Ihr Gerät, was absolute Privatsphäre und Vertraulichkeit garantiert."
  faq_4_q: "Unterstützt der Konverter passwortgeschützte PDFs?"
  faq_4_a: "Nein. Um Sicherheit und die Machbarkeit einer 100% lokalen Verarbeitung zu gewährleisten, werden passwortgeschützte Dateien nicht unterstützt. Entfernen Sie das Passwort des PDFs vor der Konvertierung."
  see1: "Bild in PDF"
  see2: "PDF-Editor"
  see3: "PDF aufteilen"
  see4: "Bildgröße ändern"
nl:
  title: "PDF naar Afbeelding"
  page_title: "PDF omzetten naar Afbeelding Online - Gratis"
  meta: "Converteer PDF-pagina's online en gratis naar JPG- of PNG-afbeeldingen. Pas de beeldkwaliteit aan en download alle pagina's in één ZIP-bestand. 100% lokale en veilige verwerking."
  intro: "Converteer elke pagina van uw PDF naar een haarscherpe JPG- of PNG-afbeelding. Kies de ideale resolutie en download de volledige batch gecomprimeerd in één ZIP-bestand, of sla pagina's individueel op. Alles wordt lokaal in uw browser verwerkt, wat absolute privacy garandeert."
  click_upload: "Klik om te uploaden"
  or_drag: "of sleep het bestand hiernaartoe"
  restart: "Opnieuw starten"
  converting: "Converteren..."
  rendering: "Resterende pagina's converteren..."
  downloading: "Downloaden..."
  download_image: "Afbeelding downloaden"
  download_all: "Alles downloaden (ZIP)"
  download_page: "Pagina downloaden"
  format: "Format"
  quality: "Kwaliteit"
  q_normal: "Normaal"
  q_high: "Hoog"
  q_ultra: "Ultra"
  err: "Er is een fout opgetreden bij het openen van het PDF-bestand"
  err_pass: "Wachtwoordbeveiligd PDF-bestand"
  features_title: "Kenmerken van de PDF naar Afbeelding Converter"
  feature_1: "Converteer elke PDF-pagina naar een afzonderlijke afbeelding"
  feature_2: "Kies tussen JPG (kleiner bestand) of PNG (verliesvrije kwaliteit)"
  feature_3: "Drie niveaus van renderingskwaliteit: Normaal, Hoog en Ultra"
  feature_4: "100% privé — lokale verwerking, uw bestanden verlaten uw apparaat nooit"
  use_cases_title: "Wanneer de PDF naar Afbeelding Converter te gebruiken"
  use_cases_desc: "De omzetting van PDF naar afbeelding is ideaal wanneer u de visuele inhoud van een document wilt extraheren om deze op sociale media te plaatsen, in presentaties op te nemen of in grafische software te bewerken."
  uc_1_title: "Delen op Sociale Media"
  uc_1_desc: "Publiceer rapporten, portfolio's, academische certificaten of menukaarten direct en visueel op Instagram, LinkedIn en WhatsApp, zonder dat de gebruiker een bestand hoeft te downloaden."
  uc_2_title: "PDF-inhoud Bewerken"
  uc_2_desc: "Zet pagina's om in bewerkbare bestanden voor eenvoudig gebruik in Canva, Photoshop of andere ontwerptools."
  uc_3_title: "Miniaturen en Previews Maken"
  uc_3_desc: "Maak aantrekkelijke omslag- en voorbeeldafbeeldingen (thumbnails) voor e-books, presentaties of contracten op blogs en infoproducten-platforms."
  uc_4_title: "Specifieke Pagina's Printen"
  uc_4_desc: "Genereer afbeeldingsversies van losse pagina's om ze snel en eenvoudig op de gewenste grootte af te drukken."
  how_to_title: "Hoe PDF om te zetten naar Afbeelding"
  how_1_title: "PDF configureren en uploaden"
  how_1_desc: "Selecteer het formaat (JPG of PNG) en de gewenste kwaliteit en upload uw PDF door op het uploadgebied te klikken of het bestand hiernaartoe te slepen."
  how_2_title: "Wacht op de conversie"
  how_2_desc: "Elke PDF-pagina wordt in realtime individueel op uw scherm gerenderd, zonder wachtrijen."
  how_3_title: "Download uw afbeeldingen"
  how_3_desc: "Klik op 'Alles downloaden' om een gecomprimeerd ZIP-bestand te downloaden, of download afzonderlijke pagina's door de muisaanwijzer over een pagina te bewegen en op het downloadpictogram te klikken."
  faq_title: "Vragen & Antwoorden"
  faq_1_q: "Wat is het verschil tussen JPG en PNG?"
  faq_1_a: "JPG comprimeert de afbeelding voor kleinere bestanden, ideaal voor foto's en lange rapporten. PNG behoudt alle originele details zonder kwaliteitsverlies, aanbevolen voor kleine tekst, logo's en elementen met een transparante achtergrond."
  faq_2_q: "Welk kwaliteitsniveau moet ik kiezen?"
  faq_2_a: "De kwaliteit 'Normaal' is ideaal voor een snelle weergave op het scherm. 'Hoog' voldoet uitstekend aan de meeste behoeften. 'Ultra' biedt maximale scherpte en details, wat grotere bestanden genereert en wat meer verwerkingstijd vereist."
  faq_3_q: "Worden mijn bestanden naar een server verzonden?"
  faq_3_a: "Nee. Het hele proces wordt lokaal in uw eigen browser uitgevoerd. Uw bestanden verlaten uw apparaat nooit, wat absolute privacy en vertrouwelijkheid garandeert."
  faq_4_q: "Ondersteunt de converter wachtwoordbeveiligde PDF-bestanden?"
  faq_4_a: "Nee. Om veiligheid en de haalbaarheid van 100% lokale verwerking te garanderen, worden wachtwoordbeveiligde bestanden niet ondersteund. Verwijder het wachtwoord van de PDF voor de conversie."
  see1: "Afbeelding naar PDF"
  see2: "PDF-editor"
  see3: "PDF splitsen"
  see4: "Afbeelding verkleinen"
pt:
  title: "PDF para Imagem"
  page_title: "Converter PDF para Imagem Online - Grátis"
  meta: "Converta páginas de PDF em JPG ou PNG online e grátis. Ajuste a qualidade da imagem e baixe todas as páginas em um único arquivo ZIP. Processamento 100% local e seguro."
  intro: "Converta cada página do seu PDF em uma imagem nítida no formato JPG ou PNG. Escolha a resolução ideal e baixe o lote completo compactado em um único ZIP, ou salve as páginas individualmente. Tudo é processado localmente no seu navegador, garantindo total privacidade."
  click_upload: "Clique para fazer upload"
  or_drag: "ou arraste e solte"
  restart: "Recomeçar"
  converting: "Convertendo..."
  rendering: "Convertendo páginas restantes..."
  downloading: "Baixando..."
  download_image: "Baixar Imagem"
  download_all: "Baixar Tudo (ZIP)"
  download_page: "Baixar página"
  format: "Formato"
  quality: "Qualidade"
  q_normal: "Normal"
  q_high: "Alta"
  q_ultra: "Ultra"
  err: "Ocorreu um erro ao tentar abrir o arquivo PDF"
  err_pass: "Arquivo PDF protegido por senha"
  features_title: "Recursos do Conversor PDF para Imagem"
  feature_1: "Converta cada página do PDF em uma imagem independente"
  feature_2: "Escolha entre JPG (menor tamanho) ou PNG (sem perda de qualidade)"
  feature_3: "Três níveis de qualidade de renderização: Normal, Alta e Ultra"
  feature_4: "100% privado — processamento local, seus arquivos nunca saem do seu dispositivo"
  use_cases_title: "Quando Usar o Conversor de PDF para Imagem"
  use_cases_desc: "A conversão de PDF para imagem é ideal quando você precisa extrair o conteúdo visual de um documento para publicar em redes sociais, incluir em apresentações ou editar em softwares gráficos."
  uc_1_title: "Compartilhar nas Redes Sociais"
  uc_1_desc: "Publique relatórios, portfólios, certificados acadêmicos ou cardápios de forma direta e visual no Instagram, LinkedIn e WhatsApp, sem exigir que o usuário baixe um arquivo."
  uc_2_title: "Editar Conteúdo do PDF"
  uc_2_desc: "Transforme as páginas em arquivos editáveis para usar facilmente no Canva, Photoshop ou outras ferramentas de design."
  uc_3_title: "Criar Miniaturas e Previews"
  uc_3_desc: "Crie imagens de capa e pré-visualização (thumbnails) atraentes para e-books, apresentações ou contratos em blogs e plataformas de infoprodutos."
  uc_4_title: "Imprimir Páginas Específicas"
  uc_4_desc: "Gere versões em imagem de páginas avulsas para redimensionar e imprimir de forma rápida e prática."
  how_to_title: "Como Converter PDF em Imagem"
  how_1_title: "Configure e envie seu PDF"
  how_1_desc: "Selecione o formato (JPG ou PNG), escolha a qualidade e envie seu PDF clicando na área de upload ou arrastando o arquivo."
  how_2_title: "Aguarde a conversão"
  how_2_desc: "Cada página do PDF é renderizada individualmente na tela em tempo real, sem filas de espera."
  how_3_title: "Baixe as imagens"
  how_3_desc: "Clique em 'Baixar Tudo' para obter um ZIP compactado ou baixe páginas individuais passando o mouse e clicando no ícone de download."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Qual a diferença entre JPG e PNG?"
  faq_1_a: "O JPG comprime a imagem gerando arquivos mais leves, sendo ideal para fotos e relatórios longos. O PNG preserva todos os detalhes originais sem perda de qualidade, recomendado para textos pequenos, logotipos e elementos com fundo transparente."
  faq_2_q: "Qual nível de qualidade devo escolher?"
  faq_2_a: "A qualidade Normal é ideal para visualização rápida em tela. A Alta atende com excelência a maioria dos casos. Já a Ultra gera o máximo de nitidez e detalhes, produzindo arquivos maiores e exigindo um pouco mais de processamento."
  faq_3_q: "Meus arquivos são enviados para algum servidor?"
  faq_3_a: "Não. Todo o processo é realizado localmente no seu próprio navegador. Seus arquivos nunca saem do seu dispositivo, garantindo total privacidade e confidencialidade."
  faq_4_q: "O conversor suporta PDFs protegidos por senha?"
  faq_4_a: "Não. Para garantir a segurança e a viabilidade do processamento 100% local, arquivos protegidos com senha não são suportados. Remova a senha do PDF antes de realizar a conversão."
  see1: "Imagem para PDF"
  see2: "Editor de PDF"
  see3: "Dividir PDF"
  see4: "Redimensionar Imagem"
ru:
  title: "PDF в изображения"
  page_title: "Конвертировать PDF в изображения онлайн - Бесплатно"
  meta: "Конвертируйте страницы PDF в JPG или PNG онлайн бесплатно. Настраивайте качество изображений и скачивайте все страницы в одном ZIP-архиве. 100% локальная и безопасная обработка."
  intro: "Преобразуйте каждую страницу вашего PDF-документа в четкое изображение JPG или PNG. Выберите оптимальное разрешение и скачайте весь пакет в одном ZIP-архиве или сохраняйте страницы по отдельности. Все процессы выполняются локально в вашем браузере, обеспечивая абсолютную конфиденциальность."
  click_upload: "Нажмите для загрузки"
  or_drag: "или перетащите файл сюда"
  restart: "Начать заново"
  converting: "Конвертирование..."
  rendering: "Конвертирование оставшихся страниц..."
  downloading: "Скачивание..."
  download_image: "Скачать изображение"
  download_all: "Скачать все (ZIP)"
  download_page: "Скачать страницу"
  format: "Формат"
  quality: "Качество"
  q_normal: "Обычное"
  q_high: "Высокое"
  q_ultra: "Ультра"
  err: "Произошла ошибка при попытке открыть PDF-файл"
  err_pass: "PDF-файл защищен паролем"
  features_title: "Возможности конвертера PDF в изображения"
  feature_1: "Конвертирование каждой страницы PDF в отдельное изображение"
  feature_2: "Выбор между JPG (меньший размер) или PNG (без потери качества)"
  feature_3: "Три уровня качества рендеринга: Обычное, Высокое и Ультра"
  feature_4: "100% конфиденциально — локальная обработка, ваши файлы никогда не покинут устройство"
  use_cases_title: "Когда использовать конвертер PDF в изображения"
  use_cases_desc: "Конвертирование PDF в изображения идеально подходит, когда вам нужно извлечь визуальное содержимое документа для публикации в социальных сетях, вставки в презентации или редактирования в графических редакторах."
  uc_1_title: "Публикация в социальных сетях"
  uc_1_desc: "Публикуйте отчеты, портфолио, академические сертификаты или меню напрямую и наглядно в Instagram, LinkedIn и WhatsApp без необходимости скачивания файлов пользователями."
  uc_2_title: "Редактирование содержимого PDF"
  uc_2_desc: "Превращайте страницы в редактируемые файлы для удобного использования в Canva, Photoshop или других инструментах дизайна."
  uc_3_title: "Создание миниатюр и превью"
  uc_3_desc: "Создавайте привлекательные обложки и превью (миниатюры) для электронных книг, презентаций или договоров в блогах и на платформах цифровых продуктов."
  uc_4_title: "Печать определенных страниц"
  uc_4_desc: "Генерируйте графические версии отдельных страниц для быстрого и практичного изменения размера и печати."
  how_to_title: "Как конвертировать PDF в изображения"
  how_1_title: "Настройте и загрузите PDF"
  how_1_desc: "Выберите формат (JPG или PNG), выберите качество и загрузите свой PDF-файл, кликнув по зоне загрузки или перетащив файл."
  how_2_title: "Дождитесь конвертирования"
  how_2_desc: "Каждая страница PDF рендерится индивидуально на вашем экране в реальном времени, без очередей ожидания."
  how_3_title: "Скачайте ваши изображения"
  how_3_desc: "Нажмите «Скачать все», чтобы получить сжатый ZIP-архив, или скачивайте отдельные страницы, наведя курсор и нажав на иконку скачивания."
  faq_title: "Вопросы и ответы"
  faq_1_q: "В чем разница между JPG и PNG?"
  faq_1_a: "JPG сжимает изображение для получения файлов меньшего размера, что идеально подходит для фотографий и длинных отчетов. PNG сохраняет все исходные детали без потери качества, что рекомендуется для мелкого текста, логотипов и элементов с прозрачным фоном."
  faq_2_q: "Какое качество мне выбрать?"
  faq_2_a: "Обычное качество идеально подходит для быстрого просмотра на экране. Высокое отлично отвечает большинству потребностей. Ультра обеспечивает максимальную четкость и детализацию, создавая файлы большего размера и требуя чуть больше времени на обработку."
  faq_3_q: "Отправляются ли мои файлы на какой-либо сервер?"
  faq_3_a: "Нет. Весь процесс выполняется локально в вашем собственном браузере. Ваши файлы никогда не покидают устройство, гарантируя полную приватность и конфиденциальность."
  faq_4_q: "Поддерживает ли конвертер защищенные паролем PDF?"
  faq_4_a: "Нет. Для обеспечения безопасности и возможности 100% локальной обработки защищенные паролем файлы не поддерживаются. Пожалуйста, снимите пароль с PDF перед конвертированием."
  see1: "Изображение в PDF"
  see2: "PDF редактор"
  see3: "Разделить PDF"
  see4: "Изменить размер картинки"
</i18n>
