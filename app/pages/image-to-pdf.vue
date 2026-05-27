<script setup lang="ts">
declare global {
  interface Window {
    Sortable: any
    PDFLib: any
    download: any
  }
}

interface Item {
  id: number
  file: File
  url: string
  name: string
}

const { t } = useI18n({ useScope: 'local' })

const items = ref<Item[]>([])
const loading = ref(false)
const extraInput = ref<HTMLInputElement | null>(null)
const sortableReady = ref(false)
let sortable: any = null
let idCounter = 0

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
  meta: [
    { name: 'description', content: t('meta') }
  ],
})

const { onLoaded: onSortableLoaded } = useScript('https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js', { trigger: 'client' })
useScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js', { trigger: 'client' })
useScript('https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js', { trigger: 'client' })

onSortableLoaded(() => {
  sortableReady.value = true
  if (items.value.length > 0) nextTick(() => initSortable())
})

onBeforeUnmount(() => {
  items.value.forEach(item => URL.revokeObjectURL(item.url))
  sortable?.destroy()
})

watch(() => items.value.length, (newLen, oldLen) => {
  if (newLen > 0 && oldLen === 0 && sortableReady.value) {
    nextTick(() => initSortable())
  } else if (newLen === 0) {
    sortable?.destroy()
    sortable = null
  }
})

function initSortable() {
  const el = document.getElementById('imgs-grid')
  if (!el || !window.Sortable || sortable) return
  sortable = window.Sortable.create(el, { animation: 150 })
}

function onImageSelected(file: File | File[]) {
  addImages(Array.isArray(file) ? file : [file])
}

function onExtraFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    addImages([...input.files])
    input.value = ''
  }
}

function addImages(files: File[]) {
  files.forEach(f => {
    items.value.push({ id: idCounter++, file: f, url: URL.createObjectURL(f), name: f.name })
  })
}

function removeItem(id: number) {
  const idx = items.value.findIndex(item => item.id === id)
  if (idx === -1) return
  const item = items.value[idx]
  if (item) {
    URL.revokeObjectURL(item.url)
    items.value.splice(idx, 1)
  }
}

function reload() {
  items.value.forEach(item => URL.revokeObjectURL(item.url))
  items.value = []
  sortable?.destroy()
  sortable = null
}

function addMore() {
  extraInput.value?.click()
}

function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as ArrayBuffer)
    r.onerror = reject
    r.readAsArrayBuffer(file)
  })
}

async function convert() {
  if (!window.PDFLib || !window.download) return
  loading.value = true

  setTimeout(async () => {
    try {
      const ids: number[] = sortable
        ? sortable.toArray().map(Number)
        : items.value.map(item => item.id)
      const itemById = new Map(items.value.map(item => [item.id, item]))
      const pdfDoc = await window.PDFLib.PDFDocument.create()

      for (const id of ids) {
        const item = itemById.get(id)
        if (!item) continue
        const buffer = await readFile(item.file)

        const image = await (async () => {
          try {
            return item.file.type === 'image/png'
              ? await pdfDoc.embedPng(buffer)
              : await pdfDoc.embedJpg(buffer)
          } catch {
            return item.file.type === 'image/png'
              ? await pdfDoc.embedJpg(buffer)
              : await pdfDoc.embedPng(buffer)
          }
        })()

        const imgDims = image.scale(1)
        const page = pdfDoc.addPage([imgDims.width, imgDims.height])
        page.drawImage(image, { x: 0, y: 0, width: imgDims.width, height: imgDims.height })
      }

      window.download(await pdfDoc.save(), 'images.pdf', 'application/pdf')
    } finally {
      loading.value = false
    }
  }, 100)
}

defineI18nRoute({
  paths: {
    en: '/image-to-pdf',
    pt: '/imagem-para-pdf',
    es: '/imagen-a-pdf',
    fr: '/image-en-pdf',
    it: '/immagine-in-pdf',
    id: '/gambar-ke-pdf',
    de: '/bild-zu-pdf',
    nl: '/afbeelding-naar-pdf',
    ru: '/izobrazheniya-v-pdf',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="items.length > 0"
    :see-also-links="[
      { label: t('see1'), to: 'resize-image' },
      { label: t('see2'), to: 'crop-image' },
      { label: t('see3'), to: 'pdf-to-image' },
      { label: t('see4'), to: 'pdf-editor' },
    ]"
  >
    <!-- Upload state -->
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-8 gap-4">
      <ImageUploader :show="true" :multiple="true" @on-file="onImageSelected" />
      <p class="text-sm text-base-content/70">{{ t('upload_hint') }}</p>
    </div>

    <!-- Images loaded state -->
    <div v-else class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-ghost btn-sm" @click="reload">
          <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4" /> {{ t('restart') }}
        </button>
        <button type="button" class="btn btn-ghost btn-sm" @click="addMore">
          <Icon name="heroicons:plus-20-solid" class="w-4 h-4" /> {{ t('add_image') }}
        </button>
        <button type="button" class="btn btn-primary btn-sm ml-auto" :disabled="loading" @click="convert">
          <Icon name="heroicons:document-arrow-down-20-solid" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          {{ loading ? t('converting') : t('convert') }}
        </button>
      </div>

      <input ref="extraInput" type="file" accept="image/*" multiple class="hidden" @change="onExtraFiles" />

      <div id="imgs-grid" class="grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        <div
          v-for="(item, i) in items"
          :key="item.id"
          :data-id="item.id"
          class="relative group cursor-grab rounded-xl overflow-hidden border border-base-content/10 bg-base-200/35"
        >
          <img :src="item.url" class="w-full h-24 object-cover" :alt="`image ${i + 1}`" />
          <button
            type="button"
            class="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            :aria-label="t('remove')"
            @click="removeItem(item.id)"
          >
            <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white" />
          </button>
          <div class="text-xs text-center text-base-content/40 py-1 truncate px-1">{{ item.name }}</div>
        </div>
      </div>

      <p v-if="items.length > 1" class="text-xs text-base-content/40">{{ t('drag_hint') }}</p>
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
  title: "Image to PDF"
  page_title: "Convert Image to PDF Online - Free"
  meta: "Convert one or multiple images into a single PDF file. Drag to reorder pages. Supports JPG, PNG, and WebP. Local processing, no file uploads."
  intro: "Convert one or multiple images into a single PDF file instantly. Supports JPEG, PNG, and other formats. All processing happens directly in your browser, with no need to install anything and without sending your files to any server."
  upload_hint: "Supports JPG, PNG, WebP, GIF and more — select multiple images at once"
  restart: "Start Over"
  add_image: "Add Image"
  convert: "Convert to PDF"
  converting: "Converting..."
  remove: "Remove"
  drag_hint: "Drag thumbnails to reorder PDF pages"
  features_title: "Image to PDF Converter Features"
  feature_1: "Convert multiple images into a single PDF with customizable order"
  feature_2: "Reorder pages by dragging thumbnails before converting"
  feature_3: "Supports JPEG, PNG, WebP, and other image formats"
  feature_4: "100% private — local processing, files never leave your device"
  use_cases_title: "When to Use the Image to PDF Converter"
  use_cases_desc: "Converting images to PDF is ideal when you need to share multiple photos in a single organized file, easy to open on any device."
  uc_1_title: "Document Scanning"
  uc_1_desc: "Photographed a contract, receipt, or form? Convert the photo to PDF to archive or email it easily."
  uc_2_title: "Portfolio and Presentations"
  uc_2_desc: "Gather multiple work images into a single PDF to send portfolios, proposals, or visual presentations."
  uc_3_title: "Travel Photos and Albums"
  uc_3_desc: "Group photos from a trip or event into a PDF to share with friends and family practically."
  uc_4_title: "Vouchers and Receipts"
  uc_4_desc: "Compile photos of vouchers, invoices, or receipts into a single PDF for personal or professional organization."
  how_to_title: "How to Convert Image to PDF"
  how_1_title: "Upload your images"
  how_1_desc: "Click to upload or drag and drop one or more images (JPG, PNG, WebP, GIF, or BMP) to start."
  how_2_title: "Organize the page order"
  how_2_desc: "Drag the thumbnails to define the order of the pages in the PDF. Add more images by clicking Add Image."
  how_3_title: "Convert and download the PDF"
  how_3_desc: "Click Convert to PDF. The file is generated locally in your browser and the download starts automatically."
  faq_title: "Questions and Answers"
  faq_1_q: "Which image formats are supported?"
  faq_1_a: "JPEG and PNG are fully supported. Other formats like WebP and GIF may work depending on your browser."
  faq_2_q: "Is there a limit on the number of images?"
  faq_2_a: "There is no fixed limit, but very large batches may require more browser memory. For best results, convert in groups of up to 30 images."
  faq_3_q: "Are my files uploaded to any server?"
  faq_3_a: "No. All processing occurs directly in your browser. Your images are never sent to any server, ensuring complete privacy."
  faq_4_q: "Can I define the page order before converting?"
  faq_4_a: "Yes. After uploading the images, drag the thumbnails to reorder the pages before clicking Convert to PDF."
  see1: "Resize Image"
  see2: "Crop Image"
  see3: "PDF to Image"
  see4: "PDF Editor"

pt:
  title: "Imagem para PDF"
  page_title: "Converter Imagem para PDF Online - Grátis"
  meta: "Converta uma ou várias imagens em um único arquivo PDF. Arraste para reordenar as páginas. Suporta JPG, PNG e WebP. Processamento local, sem enviar arquivos."
  intro: "Converta uma ou várias imagens em um único arquivo PDF instantaneamente. Suporta JPEG, PNG e outros formatos. Todo o processamento acontece diretamente no seu navegador, sem necessidade de instalar nada e sem enviar seus arquivos para servidores."
  upload_hint: "Suporta JPG, PNG, WebP, GIF e mais — selecione várias imagens de uma vez"
  restart: "Recomeçar"
  add_image: "Adicionar Imagem"
  convert: "Converter para PDF"
  converting: "Convertendo..."
  remove: "Remover"
  drag_hint: "Arraste as miniaturas para reordenar as páginas do PDF"
  features_title: "Recursos do Conversor Imagem para PDF"
  feature_1: "Converta múltiplas imagens em um único PDF com ordem personalizável"
  feature_2: "Reordene páginas arrastando as miniaturas antes de converter"
  feature_3: "Suporta JPEG, PNG, WebP e outros formatos de imagem"
  feature_4: "100% privado — processamento local, os arquivos nunca saem do seu dispositivo"
  use_cases_title: "Quando Usar o Conversor de Imagem para PDF"
  use_cases_desc: "Converter imagens em PDF é ideal quando você precisa compartilhar várias fotos em um único arquivo organizado, fácil de abrir em qualquer dispositivo."
  uc_1_title: "Digitalização de Documentos"
  uc_1_desc: "Fotografou um contrato, recibo ou formulário? Converta a foto em PDF para arquivar ou enviar por e-mail com facilidade."
  uc_2_title: "Portfólio e Apresentações"
  uc_2_desc: "Reúna várias imagens de trabalho em um único PDF para enviar portfólios, propostas ou apresentações visuais."
  uc_3_title: "Fotos de Viagem e Álbuns"
  uc_3_desc: "Agrupe fotos de uma viagem ou evento em um PDF para compartilhar com amigos e família de forma prática."
  uc_4_title: "Comprovantes e Recibos"
  uc_4_desc: "Compile fotos de comprovantes, notas fiscais ou recibos em um único PDF para organização pessoal ou profissional."
  how_to_title: "Como Converter Imagem em PDF"
  how_1_title: "Envie suas imagens"
  how_1_desc: "Clique para fazer upload ou arraste e solte uma ou mais imagens (JPG, PNG, WebP, GIF ou BMP) para começar."
  how_2_title: "Organize a ordem das páginas"
  how_2_desc: "Arraste as miniaturas para definir a ordem das páginas no PDF. Adicione mais imagens clicando em Adicionar Imagem."
  how_3_title: "Converta e baixe o PDF"
  how_3_desc: "Clique em Converter para PDF. O arquivo é gerado localmente no seu navegador e o download começa automaticamente."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Quais formatos de imagem são suportados?"
  faq_1_a: "JPEG e PNG são totalmente suportados. Outros formatos como WebP e GIF podem funcionar dependendo do navegador."
  faq_2_q: "Há um limite no número de imagens?"
  faq_2_a: "Não há limite fixo, mas lotes muito grandes podem exigir mais memória do navegador. Para melhores resultados, converta em grupos de até 30 imagens."
  faq_3_q: "Meus arquivos são enviados para algum servidor?"
  faq_3_a: "Não. Todo o processamento ocorre diretamente no seu navegador. Suas imagens nunca são enviadas para nenhum servidor, garantindo total privacidade."
  faq_4_q: "Posso definir a ordem das páginas antes de converter?"
  faq_4_a: "Sim. Após fazer upload das imagens, arraste as miniaturas para reordenar as páginas antes de clicar em Converter para PDF."
  see1: "Redimensionar Imagem"
  see2: "Recortar Imagem"
  see3: "PDF para Imagem"
  see4: "Editor de PDF"

es:
  title: "Imagen a PDF"
  page_title: "Convertir Imagen a PDF Online - Gratis"
  meta: "Convierte una o varias imágenes en un solo archivo PDF. Arrastra para reordenar las páginas. Soporta JPG, PNG y WebP. Procesamiento local, sin enviar archivos."
  intro: "Convierte una o varias imágenes en un solo archivo PDF al instante. Soporta JPEG, PNG y otros formatos. Todo el procesamiento ocurre directamente en tu navegador, sin necesidad de instalar nada y sin enviar tus archivos a ningún servidor."
  upload_hint: "Soporta JPG, PNG, WebP, GIF y más — selecciona varias imágenes a la vez"
  restart: "Empezar de nuevo"
  add_image: "Añadir Imagen"
  convert: "Convertir a PDF"
  converting: "Convirtiendo..."
  remove: "Eliminar"
  drag_hint: "Arrastra las miniaturas para reordenar las páginas del PDF"
  features_title: "Características del Convertidor de Imagen a PDF"
  feature_1: "Convierte múltiples imágenes en un solo PDF con orden personalizable"
  feature_2: "Reordena las páginas arrastrando las miniaturas antes de convertir"
  feature_3: "Soporta JPEG, PNG, WebP y otros formatos de imagen"
  feature_4: "100% privado — procesamiento local, los archivos nunca salen de tu dispositivo"
  use_cases_title: "Cuándo usar el Convertidor de Imagen a PDF"
  use_cases_desc: "Convertir imágenes a PDF es ideal cuando necesitas compartir varias fotos en un solo archivo organizado, fácil de abrir en cualquier dispositivo."
  uc_1_title: "Digitalización de Documentos"
  uc_1_desc: "¿Fotografiaste un contrato, recibo o formulario? Convierte la foto a PDF para archivarla o enviarla por correo electrónico fácilmente."
  uc_2_title: "Portafolio y Presentaciones"
  uc_2_desc: "Reúne varias imágenes de trabajo en un solo PDF para enviar portafolios, propuestas o presentaciones visuales."
  uc_3_title: "Fotos de Viaje y Álbumes"
  uc_3_desc: "Agrupa fotos de un viaje o evento en un PDF para compartirlas con amigos y familiares de forma práctica."
  uc_4_title: "Comprobantes y Recibos"
  uc_4_desc: "Compila fotos de comprobantes, facturas o recibos en un solo PDF para tu organización personal o profesional."
  how_to_title: "Cómo Convertir Imagen a PDF"
  how_1_title: "Sube tus imágenes"
  how_1_desc: "Haz clic para subir o arrastra y suelta una o más imágenes (JPG, PNG, WebP, GIF o BMP) para empezar."
  how_2_title: "Organiza el orden de las páginas"
  how_2_desc: "Arrastra las miniaturas para definir el orden de las páginas en el PDF. Añade más imágenes haciendo clic en Añadir Imagen."
  how_3_title: "Convierte y descarga el PDF"
  how_3_desc: "Haz clic en Convertir a PDF. El archivo se genera localmente en tu navegador y la descarga comenzará automáticamente."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Qué formatos de imagen son compatibles?"
  faq_1_a: "JPEG y PNG son totalmente compatibles. Otros formatos como WebP y GIF pueden funcionar dependiendo de tu navegador."
  faq_2_q: "¿Hay un límite en el número de imágenes?"
  faq_2_a: "No hay un límite fijo, pero lotes muy grandes pueden requerir más memoria del navegador. Para obtener los mejores resultados, convierte en grupos de hasta 30 imágenes."
  faq_3_q: "¿Se envían mis archivos a algún servidor?"
  faq_3_a: "No. Todo el procesamiento ocurre directamente en tu navegador. Tus imágenes nunca se envían a ningún servidor, garantizando total privacidad."
  faq_4_q: "¿Puedo definir el orden de las páginas antes de convertir?"
  faq_4_a: "Sí. Después de subir las imágenes, arrastra las miniaturas para reordenar las páginas antes de hacer clic en Convertir a PDF."
  see1: "Redimensionar Imagen"
  see2: "Recortar Imagen"
  see3: "PDF a Imagen"
  see4: "Editor de PDF"

fr:
  title: "Image en PDF"
  page_title: "Convertir Image en PDF en Ligne - Gratuit"
  meta: "Convertisez une ou plusieurs images en un seul fichier PDF. Glissez-déposez pour réorganiser les pages. Prend en charge JPG, PNG et WebP. Traitement local, aucun envoi de fichier."
  intro: "Convertissez instantanément une ou plusieurs images en un seul fichier PDF. Prend en charge le JPEG, le PNG et d'autres formats. Tout le traitement se fait directement dans votre navigateur, sans besoin d'installer quoi que ce soit et sans envoyer vos fichiers à aucun serveur."
  upload_hint: "Prend en charge JPG, PNG, WebP, GIF et plus — sélectionnez plusieurs images à la fois"
  restart: "Recommencer"
  add_image: "Ajouter une image"
  convert: "Convertir en PDF"
  converting: "Conversion..."
  remove: "Supprimer"
  drag_hint: "Faites glisser les miniatures pour réorganiser les pages du PDF"
  features_title: "Fonctionnalités du convertisseur Image en PDF"
  feature_1: "Convertissez plusieurs images en un seul PDF avec un ordre personnalisable"
  feature_2: "Réorganisez les pages en faisant glisser les miniatures avant la conversion"
  feature_3: "Prend en charge le JPEG, PNG, WebP et d'autres formats d'image"
  feature_4: "100% privé — traitement local, vos fichiers ne quittent jamais votre appareil"
  use_cases_title: "Quand utiliser le convertisseur Image en PDF"
  use_cases_desc: "La conversion d'images en PDF est idéale lorsque vous devez partager plusieurs photos dans un seul fichier organisé, facile à ouvrir sur n'importe quel appareil."
  uc_1_title: "Numérisation de documents"
  uc_1_desc: "Vous avez photographié un contrat, un reçu ou un formulaire ? Convertissez la photo en PDF pour l'archiver ou l'envoyer par e-mail facilement."
  uc_2_title: "Portfolio et présentations"
  uc_2_desc: "Rassemblez plusieurs images de votre travail dans un seul PDF pour envoyer des portfolios, des propositions ou des présentations visuelles."
  uc_3_title: "Photos de voyage et albums"
  uc_3_desc: "Regroupez les photos d'un voyage ou d'un événement dans un PDF pour les partager de manière pratique avec vos amis et votre famille."
  uc_4_title: "Justificatifs et reçus"
  uc_4_desc: "Compilez des photos de justificatifs, de factures ou de reçus dans un seul PDF pour votre organisation personnelle ou professionnelle."
  how_to_title: "Comment convertir une image en PDF"
  how_1_title: "Téléchargez vos images"
  how_1_desc: "Cliquez pour télécharger ou glissez-déposez une ou plusieurs images (JPG, PNG, WebP, GIF ou BMP) pour commencer."
  how_2_title: "Organisez l'ordre des pages"
  how_2_desc: "Faites glisser les miniatures pour définir l'ordre des pages dans le PDF. Ajoutez d'autres images en cliquant sur Ajouter une image."
  how_3_title: "Convertissez et téléchargez le PDF"
  how_3_desc: "Cliquez sur Convertir en PDF. Le fichier est généré localement dans votre navigateur et le téléchargement démarre automatiquement."
  faq_title: "Questions et réponses"
  faq_1_q: "Quels formats d'image sont pris en charge ?"
  faq_1_a: "Les formats JPEG et PNG sont entièrement pris en charge. D'autres formats comme WebP et GIF peuvent fonctionner selon votre navigateur."
  faq_2_q: "Y a-t-il une limite au nombre d'images ?"
  faq_2_a: "Il n'y a pas de limite fixe, mais les lots très volumineux peuvent nécessiter plus de mémoire de la part du navigateur. Pour de meilleurs résultats, convertissez par groupes de 30 images maximum."
  faq_3_q: "Mes fichiers sont-ils téléchargés sur un serveur ?"
  faq_3_a: "Non. Tout le traitement s'effectue directement dans votre navigateur. Vos images ne sont jamais envoyées à aucun serveur, garantissant une confidentialité totale."
  faq_4_q: "Puis-je définir l'ordre des pages avant la conversion ?"
  faq_4_a: "Oui. Après avoir téléchargé les images, faites glisser les miniatures pour réorganiser les pages avant de cliquer sur Convertir en PDF."
  see1: "Redimensionner l'image"
  see2: "Recadrer l'image"
  see3: "PDF en Image"
  see4: "Éditeur PDF"

it:
  title: "Immagine in PDF"
  page_title: "Convertire Immagine in PDF Online - Gratis"
  meta: "Converti una o più immagini in un unico file PDF. Trascina per riordinare le pagine. Supporta JPG, PNG e WebP. Elaborazione locale, nessun caricamento di file."
  intro: "Converti istantaneamente una o più immagini in un unico file PDF. Supporta JPEG, PNG e altri formati. Tutta l'elaborazione avviene direttamente nel tuo browser, senza necessità di installare nulla e senza inviare i tuoi file a nessun server."
  upload_hint: "Supporta JPG, PNG, WebP, GIF e altro — seleziona più immagini contemporaneamente"
  restart: "Ricomincia"
  add_image: "Aggiungi immagine"
  convert: "Converti in PDF"
  converting: "Conversione in corso..."
  remove: "Rimuovi"
  drag_hint: "Trascina le miniature per riordinare le pagine del PDF"
  features_title: "Funzionalità del convertitore da Immagine a PDF"
  feature_1: "Converti più immagini in un unico PDF con ordine personalizzabile"
  feature_2: "Riordina le pagine trascinando le miniature prima di convertire"
  feature_3: "Supporta JPEG, PNG, WebP e altri formati di immagine"
  feature_4: "100% privato — elaborazione locale, i file non lasciano mai il tuo dispositivo"
  use_cases_title: "Quando utilizzare il convertitore da Immagine a PDF"
  use_cases_desc: "Convertire le immagini in PDF è l'ideale quando hai la necessità di condividere più foto in un unico file organizzato, facile da aprire su qualsiasi dispositivo."
  uc_1_title: "Scansione di documenti"
  uc_1_desc: "Hai fotografato un contratto, una ricevuta o un modulo? Converti la foto in PDF per archiviarla o inviarla via e-mail facilmente."
  uc_2_title: "Portfolio e presentazioni"
  uc_2_desc: "Raccogli più immagini del tuo lavoro in un unico PDF per inviare portfolio, proposte o presentazioni visive."
  uc_3_title: "Foto di viaggio e album"
  uc_3_desc: "Raggruppa le foto di un viaggio o di un evento in un PDF per condividerle in modo pratico con amici e familiari."
  uc_4_title: "Ricevute e scontrini"
  uc_4_desc: "Raccogli le foto di ricevute, fatture o scontrini in un unico PDF per l'organizzazione personale o professionale."
  how_to_title: "Come convertire un'immagine in PDF"
  how_1_title: "Carica le tue immagini"
  how_1_desc: "Fai clic per caricare o trascina e rilascia una o più immagini (JPG, PNG, WebP, GIF o BMP) per iniziare."
  how_2_title: "Organizza l'ordine delle pagine"
  how_2_desc: "Trascina le miniature per definire l'ordine delle pagine nel PDF. Aggiungi altre immagini facendo clic su Aggiungi immagine."
  how_3_title: "Converti e scarica il PDF"
  how_3_desc: "Fai clic su Converti in PDF. Il file viene generato localmente nel tuo browser e il download inizia automaticamente."
  faq_title: "Domande e risposte"
  faq_1_q: "Quali formati di immagine sono supportati?"
  faq_1_a: "JPEG e PNG sono completamente supportati. Altri formati come WebP e GIF potrebbero funzionare a seconda del browser."
  faq_2_q: "C'è un limite al numero di immagini?"
  faq_2_a: "Non c'è un limite fisso, ma lotti molto grandi possono richiedere più memoria del browser. Per risultati ottimali, converti in gruppi di massimo 30 immagini."
  faq_3_q: "I miei file vengono caricati su qualche server?"
  faq_3_a: "No. Tutta l'elaborazione avviene direttamente nel tuo browser. Le tue immagini non vengono mai inviate a nessun server, garantendo la massima privacy."
  faq_4_q: "Posso definire l'ordine delle pagine prima di convertire?"
  faq_4_a: "Sì. Dopo aver caricato le immagini, trascina le miniature per riordinare le pagine prima di fare clic su Converti in PDF."
  see1: "Ridimensiona immagine"
  see2: "Ritaglia immagine"
  see3: "PDF in Immagine"
  see4: "Editor PDF"

id:
  title: "Gambar ke PDF"
  page_title: "Ubah Gambar ke PDF Online - Gratis"
  meta: "Ubah satu atau beberapa gambar menjadi satu file PDF. Seret untuk mengatur ulang halaman. Mendukung JPG, PNG, dan WebP. Pemrosesan lokal, tanpa mengunggah file."
  intro: "Ubah satu atau beberapa gambar menjadi satu file PDF secara instan. Mendukung JPEG, PNG, dan format lainnya. Semua pemrosesan terjadi langsung di browser Anda, tanpa perlu menginstal apa pun dan tanpa mengirim file Anda ke server mana pun."
  upload_hint: "Mendukung JPG, PNG, WebP, GIF, dan lainnya — pilih beberapa gambar sekaligus"
  restart: "Mulai Ulang"
  add_image: "Tambah Gambar"
  convert: "Ubah ke PDF"
  converting: "Mengubah..."
  remove: "Hapus"
  drag_hint: "Seret gambar mini untuk mengatur ulang halaman PDF"
  features_title: "Fitur Pengubah Gambar ke PDF"
  feature_1: "Ubah banyak gambar menjadi satu PDF dengan urutan yang dapat disesuaikan"
  feature_2: "Atur ulang halaman dengan menyeret gambar mini sebelum mengubah"
  feature_3: "Mendukung JPEG, PNG, WebP, dan format gambar lainnya"
  feature_4: "100% pribadi — pemrosesan lokal, file tidak pernah meninggalkan perangkat Anda"
  use_cases_title: "Kapan Menggunakan Pengubah Gambar ke PDF"
  use_cases_desc: "Mengubah gambar ke PDF sangat ideal ketika Anda perlu membagikan banyak foto dalam satu file terorganisir yang mudah dibuka di perangkat apa pun."
  uc_1_title: "Pemindaian Dokumen"
  uc_1_desc: "Memotret kontrak, tanda terima, atau formulir? Ubah foto ke PDF untuk diarsipkan atau dikirim melalui email dengan mudah."
  uc_2_title: "Portofolio dan Presentasi"
  uc_2_desc: "Kumpulkan banyak gambar hasil kerja menjadi satu PDF untuk mengirim portofolio, proposal, atau presentasi visual."
  uc_3_title: "Foto Liburan dan Album"
  uc_3_desc: "Kelompokkan foto dari perjalanan atau acara menjadi satu PDF untuk dibagikan dengan teman dan keluarga secara praktis."
  uc_4_title: "Tanda Terima dan Bukti Pembayaran"
  uc_4_desc: "Kumpulkan foto tanda terima, faktur, atau bukti pembayaran menjadi satu PDF untuk pengaturan pribadi atau profesional."
  how_to_title: "Cara Mengubah Gambar ke PDF"
  how_1_title: "Unggah gambar Anda"
  how_1_desc: "Klik untuk mengunggah atau seret dan lepas satu atau lebih gambar (JPG, PNG, WebP, GIF, atau BMP) untuk memulai."
  how_2_title: "Atur urutan halaman"
  how_2_desc: "Seret gambar mini untuk menentukan urutan halaman dalam PDF. Tambahkan lebih banyak gambar dengan mengeklik Tambah Gambar."
  how_3_title: "Ubah dan unduh PDF"
  how_3_desc: "Klik Ubah ke PDF. File dibuat secara lokal di browser Anda dan unduhan akan dimulai secara otomatis."
  faq_title: "Pertanyaan dan Jawaban"
  faq_1_q: "Format gambar apa saja yang didukung?"
  faq_1_a: "JPEG dan PNG sepenuhnya didukung. Format lain seperti WebP dan GIF mungkin berfungsi tergantung pada browser Anda."
  faq_2_q: "Apakah ada batasan jumlah gambar?"
  faq_2_a: "Tidak ada batasan pasti, tetapi jumlah yang sangat besar mungkin memerlukan lebih banyak memori browser. Untuk hasil terbaik, ubah dalam kelompok hingga 30 gambar."
  faq_3_q: "Apakah file saya diunggah ke server?"
  faq_3_a: "Tidak. Semua pemrosesan terjadi langsung di browser Anda. Gambar Anda tidak pernah dikirim ke server mana pun, memastikan privasi penuh."
  faq_4_q: "Bisakah saya mengatur urutan halaman sebelum mengubah?"
  faq_4_a: "Ya. Setelah mengunggah gambar, seret gambar mini untuk mengatur ulang halaman sebelum mengeklik Ubah ke PDF."
  see1: "Ubah Ukuran Gambar"
  see2: "Potong Gambar"
  see3: "PDF ke Gambar"
  see4: "Editor PDF"

de:
  title: "Bild zu PDF"
  page_title: "Bild in PDF umwandeln Online - Kostenlos"
  meta: "Wandeln Sie ein oder mehrere Bilder in eine einzige PDF-Datei um. Ziehen Sie, um Seiten neu anzuordnen. Unterstützt JPG, PNG und WebP. Lokale Verarbeitung, kein Hochladen von Dateien."
  intro: "Wandeln Sie sofort ein oder mehrere Bilder in eine einzige PDF-Datei um. Unterstützt JPEG, PNG und andere Formate. Die gesamte Verarbeitung erfolgt direkt in Ihrem Browser, ohne dass etwas installiert oder Ihre Dateien an einen Server gesendet werden müssen."
  upload_hint: "Unterstützt JPG, PNG, WebP, GIF und mehr — wählen Sie mehrere Bilder gleichzeitig aus"
  restart: "Neu beginnen"
  add_image: "Bild hinzufügen"
  convert: "In PDF umwandeln"
  converting: "Wird umgewandelt..."
  remove: "Entfernen"
  drag_hint: "Ziehen Sie die Miniaturansichten, um die PDF-Seiten neu anzuordnen"
  features_title: "Funktionen des Bild-zu-PDF-Konverters"
  feature_1: "Wandeln Sie mehrere Bilder in eine einzige PDF mit anpassbarer Reihenfolge um"
  feature_2: "Ordnen Sie Seiten neu an, indem Sie vor der Umwandlung Miniaturansichten ziehen"
  feature_3: "Unterstützt JPEG, PNG, WebP und andere Bildformate"
  feature_4: "100% privat — lokale Verarbeitung, Dateien verlassen niemals Ihr Gerät"
  use_cases_title: "Wann man den Bild-zu-PDF-Konverter verwendet"
  use_cases_desc: "Das Umwandeln von Bildern in PDF ist ideal, wenn Sie mehrere Fotos in einer organisierten Datei teilen möchten, die auf jedem Gerät leicht zu öffnen ist."
  uc_1_title: "Dokumente scannen"
  uc_1_desc: "Einen Vertrag, eine Quittung oder ein Formular fotografiert? Wandeln Sie das Foto in ein PDF um, um es einfach zu archivieren oder per E-Mail zu versenden."
  uc_2_title: "Portfolio und Präsentationen"
  uc_2_desc: "Sammeln Sie mehrere Arbeitsbilder in einer einzigen PDF, um Portfolios, Vorschläge oder visuelle Präsentationen zu versenden."
  uc_3_title: "Reisefotos und Alben"
  uc_3_desc: "Gruppieren Sie Fotos einer Reise oder Veranstaltung in einem PDF, um sie praktisch mit Freunden und Familie zu teilen."
  uc_4_title: "Belege und Quittungen"
  uc_4_desc: "Fassen Sie Fotos von Belegen, Rechnungen oder Quittungen in einem einzigen PDF für Ihre persönliche oder berufliche Organisation zusammen."
  how_to_title: "Wie man ein Bild in ein PDF umwandelt"
  how_1_title: "Laden Sie Ihre Bilder hoch"
  how_1_desc: "Klicken Sie zum Hochladen oder ziehen Sie ein oder mehrere Bilder (JPG, PNG, WebP, GIF oder BMP), um zu beginnen."
  how_2_title: "Organisieren Sie die Seitenreihenfolge"
  how_2_desc: "Ziehen Sie die Miniaturansichten, um die Reihenfolge der Seiten im PDF festzulegen. Fügen Sie durch Klicken auf Bild hinzufügen weitere Bilder hinzu."
  how_3_title: "PDF umwandeln und herunterladen"
  how_3_desc: "Klicken Sie auf In PDF umwandeln. Die Datei wird lokal in Ihrem Browser generiert und der Download startet automatisch."
  faq_title: "Fragen und Antworten"
  faq_1_q: "Welche Bildformate werden unterstützt?"
  faq_1_a: "JPEG und PNG werden vollständig unterstützt. Andere Formate wie WebP und GIF können je nach Browser funktionieren."
  faq_2_q: "Gibt es ein Limit für die Anzahl der Bilder?"
  faq_2_a: "Es gibt kein festes Limit, aber sehr große Stapel können mehr Arbeitsspeicher des Browsers erfordern. Für beste Ergebnisse in Gruppen von bis zu 30 Bildern umwandeln."
  faq_3_q: "Werden meine Dateien auf einen Server hochgeladen?"
  faq_3_a: "Nein. Die gesamte Verarbeitung erfolgt direkt in Ihrem Browser. Ihre Bilder werden niemals an einen Server gesendet, was vollständige Privatsphäre gewährleistet."
  faq_4_q: "Kann ich die Seitenreihenfolge vor dem Umwandeln festlegen?"
  faq_4_a: "Ja. Nachdem Sie die Bilder hochgeladen haben, ziehen Sie die Miniaturansichten, um die Seiten vor dem Klicken auf In PDF umwandeln neu anzuordnen."
  see1: "Bildgröße ändern"
  see2: "Bild zuschneiden"
  see3: "PDF zu Bild"
  see4: "PDF Editor"

nl:
  title: "Afbeelding naar PDF"
  page_title: "Afbeelding naar PDF Converteren Online - Gratis"
  meta: "Converteer een of meerdere afbeeldingen naar een enkel PDF-bestand. Sleep om pagina's opnieuw te ordenen. Ondersteunt JPG, PNG en WebP. Lokale verwerking, geen bestanden uploaden."
  intro: "Converteer direct een of meerdere afbeeldingen naar een enkel PDF-bestand. Ondersteunt JPEG, PNG en andere formaten. Alle verwerking gebeurt direct in uw browser, zonder dat u iets hoeft te installeren en zonder uw bestanden naar een server te sturen."
  upload_hint: "Ondersteunt JPG, PNG, WebP, GIF en meer — selecteer meerdere afbeeldingen tegelijk"
  restart: "Opnieuw beginnen"
  add_image: "Afbeelding toevoegen"
  convert: "Converteren naar PDF"
  converting: "Converteren..."
  remove: "Verwijderen"
  drag_hint: "Sleep de miniaturen om PDF-pagina's opnieuw te ordenen"
  features_title: "Functies van de Afbeelding naar PDF Converter"
  feature_1: "Converteer meerdere afbeeldingen naar een enkele PDF met aanpasbare volgorde"
  feature_2: "Orden pagina's opnieuw door miniaturen te slepen voordat u converteert"
  feature_3: "Ondersteunt JPEG, PNG, WebP en andere afbeeldingsformaten"
  feature_4: "100% privé — lokale verwerking, bestanden verlaten nooit uw apparaat"
  use_cases_title: "Wanneer de Afbeelding naar PDF Converter gebruiken"
  use_cases_desc: "Het converteren van afbeeldingen naar PDF is ideaal wanneer u meerdere foto's in één georganiseerd bestand wilt delen, dat gemakkelijk te openen is op elk apparaat."
  uc_1_title: "Documenten scannen"
  uc_1_desc: "Een contract, bonnetje of formulier gefotografeerd? Converteer de foto naar PDF om deze eenvoudig te archiveren of per e-mail te verzenden."
  uc_2_title: "Portfolio en presentaties"
  uc_2_desc: "Verzamel meerdere werkafbeeldingen in een enkele PDF om portfolio's, voorstellen of visuele presentaties te verzenden."
  uc_3_title: "Reisfoto's en albums"
  uc_3_desc: "Groepeer foto's van een reis of evenement in een PDF om ze praktisch met vrienden en familie te delen."
  uc_4_title: "Bonnetjes en facturen"
  uc_4_desc: "Verzamel foto's van bonnetjes, rekeningen of facturen in een enkele PDF voor uw persoonlijke of professionele organisatie."
  how_to_title: "Hoe een afbeelding naar PDF te converteren"
  how_1_title: "Upload uw afbeeldingen"
  how_1_desc: "Klik om te uploaden of sleep een of meer afbeeldingen (JPG, PNG, WebP, GIF of BMP) om te beginnen."
  how_2_title: "Organiseer de paginavolgorde"
  how_2_desc: "Sleep de miniaturen om de volgorde van de pagina's in de PDF te bepalen. Voeg meer afbeeldingen toe door te klikken op Afbeelding toevoegen."
  how_3_title: "PDF converteren en downloaden"
  how_3_desc: "Klik op Converteren naar PDF. Het bestand wordt lokaal in uw browser gegenereerd en het downloaden begint automatisch."
  faq_title: "Vragen en antwoorden"
  faq_1_q: "Welke afbeeldingsformaten worden ondersteund?"
  faq_1_a: "JPEG en PNG worden volledig ondersteund. Andere formaten zoals WebP en GIF werken mogelijk afhankelijk van uw browser."
  faq_2_q: "Is er een limiet aan het aantal afbeeldingen?"
  faq_2_a: "Er is geen vaste limiet, maar zeer grote batches vereisen mogelijk meer browsergeheugen. Converteer voor de beste resultaten in groepen van maximaal 30 afbeeldingen."
  faq_3_q: "Worden mijn bestanden geüpload naar een server?"
  faq_3_a: "Nee. Alle verwerking gebeurt direct in uw browser. Uw afbeeldingen worden nooit naar een server gestuurd, wat volledige privacy garandeert."
  faq_4_q: "Kan ik de paginavolgorde bepalen voordat ik converteer?"
  faq_4_a: "Ja. Nadat u de afbeeldingen heeft geüpload, sleept u de miniaturen om de pagina's opnieuw te ordenen voordat u op Converteren naar PDF klikt."
  see1: "Afbeelding schalen"
  see2: "Afbeelding bijsnijden"
  see3: "PDF naar Afbeelding"
  see4: "PDF Editor"

ru:
  title: "Изображение в PDF"
  page_title: "Преобразовать изображение в PDF онлайн - Бесплатно"
  meta: "Преобразуйте одно или несколько изображений в один PDF-файл. Перетащите для изменения порядка страниц. Поддерживает JPG, PNG и WebP. Локальная обработка, без загрузки файлов."
  intro: "Мгновенно преобразуйте одно или несколько изображений в один PDF-файл. Поддерживает JPEG, PNG и другие форматы. Вся обработка происходит прямо в вашем браузере, без необходимости что-либо устанавливать и без отправки файлов на сервер."
  upload_hint: "Поддерживает JPG, PNG, WebP, GIF и другие — выберите несколько изображений сразу"
  restart: "Начать сначала"
  add_image: "Добавить изображение"
  convert: "Преобразовать в PDF"
  converting: "Преобразование..."
  remove: "Удалить"
  drag_hint: "Перетащите миниатюры, чтобы изменить порядок страниц PDF"
  features_title: "Возможности конвертера изображений в PDF"
  feature_1: "Преобразуйте несколько изображений в один PDF с настраиваемым порядком"
  feature_2: "Изменяйте порядок страниц, перетаскивая миниатюры перед преобразованием"
  feature_3: "Поддерживает JPEG, PNG, WebP и другие форматы изображений"
  feature_4: "100% конфиденциально — локальная обработка, файлы никогда не покидают ваше устройство"
  use_cases_title: "Когда использовать конвертер изображений в PDF"
  use_cases_desc: "Преобразование изображений в PDF идеально подходит, когда вам нужно поделиться несколькими фотографиями в одном организованном файле, который легко открыть на любом устройстве."
  uc_1_title: "Сканирование документов"
  uc_1_desc: "Сфотографировали договор, квитанцию или форму? Преобразуйте фотографию в PDF, чтобы легко сохранить ее или отправить по электронной почте."
  uc_2_title: "Портфолио и презентации"
  uc_2_desc: "Соберите несколько рабочих изображений в один PDF-файл для отправки портфолио, предложений или визуальных презентаций."
  uc_3_title: "Фотографии из путешествий и альбомы"
  uc_3_desc: "Сгруппируйте фотографии из поездки или мероприятия в PDF-файл, чтобы удобно поделиться ими с друзьями и семьей."
  uc_4_title: "Квитанции и чеки"
  uc_4_desc: "Соберите фотографии чеков, счетов или квитанций в один PDF-файл для личной или профессиональной организации."
  how_to_title: "Как преобразовать изображение в PDF"
  how_1_title: "Загрузите ваши изображения"
  how_1_desc: "Нажмите, чтобы загрузить, или перетащите одно или несколько изображений (JPG, PNG, WebP, GIF или BMP), чтобы начать."
  how_2_title: "Организуйте порядок страниц"
  how_2_desc: "Перетащите миниатюры, чтобы определить порядок страниц в PDF. Добавьте больше изображений, нажав Добавить изображение."
  how_3_title: "Преобразуйте и скачайте PDF"
  how_3_desc: "Нажмите Преобразовать в PDF. Файл генерируется локально в вашем браузере, и загрузка начнется автоматически."
  faq_title: "Вопросы и ответы"
  faq_1_q: "Какие форматы изображений поддерживаются?"
  faq_1_a: "JPEG и PNG полностью поддерживаются. Другие форматы, такие как WebP и GIF, могут работать в зависимости от вашего браузера."
  faq_2_q: "Есть ли ограничение на количество изображений?"
  faq_2_a: "Жесткого ограничения нет, но очень большие партии могут потребовать больше памяти браузера. Для достижения наилучших результатов преобразуйте группами до 30 изображений."
  faq_3_q: "Загружаются ли мои файлы на какой-либо сервер?"
  faq_3_a: "Нет. Вся обработка происходит прямо в вашем браузере. Ваши изображения никогда не отправляются на сервер, что обеспечивает полную конфиденциальность."
  faq_4_q: "Могу ли я определить порядок страниц перед преобразованием?"
  faq_4_a: "Да. После загрузки изображений перетащите миниатюры, чтобы изменить порядок страниц, прежде чем нажать Преобразовать в PDF."
  see1: "Изменить размер изображения"
  see2: "Обрезать изображение"
  see3: "PDF в изображение"
  see4: "Редактор PDF"
</i18n>
