<script setup lang="ts">
declare global {
  interface Window {
    PDFLib: any
    download: any
    'pdfjs-dist/build/pdf': any
    JSZip: any
  }
}

const { t } = useI18n({ useScope: 'local' })

const thumbnails = ref<string[]>([])
const maxPages = ref(0)
const activeTab = ref(0)
const divisor = ref(1)
const fromPage = ref(1)
const toPage = ref(1)
const fixedIntervals = ref<[number, number][]>([])
const customIntervals = ref<[number, number][]>([])
const loading = ref(false)
const hasFile = ref(false)
const deleteTarget = ref<number | null>(null)
const deleteModal = ref<HTMLDialogElement | null>(null)
const previewModal = ref<HTMLDialogElement | null>(null)

let pdfViewer: any = null
let pdfJsDocRef: any = null
let pdfDoc: any = null

const faqItems = computed(() => [
  { question: t('faq_1_q'), answer: t('faq_1_a') },
  { question: t('faq_2_q'), answer: t('faq_2_a') },
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  faq: faqItems.value
})

useHead({
  title: t('page_title'),
  meta: [{ name: 'description', content: t('meta') }],
})

const { onLoaded: onPdfjsLoaded } = useScript(
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.min.js',
  { trigger: 'client' }
)
useScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js', { trigger: 'client' })
useScript('https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js', { trigger: 'client' })
useScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', { trigger: 'client' })

onPdfjsLoaded(() => {
  pdfViewer = window['pdfjs-dist/build/pdf']
  if (pdfViewer) {
    pdfViewer.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'
  }
})

watch(divisor, () => {
  if (hasFile.value) dividePages()
})

async function onPdfSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  const url = URL.createObjectURL(input.files[0])
  input.value = ''
  try {
    await loadPdf(url)
  } catch (e: any) {
    URL.revokeObjectURL(url)
    alert(e?.name === 'PasswordException' ? t('err_pass') : t('err'))
  }
}

async function loadPdf(url: string) {
  if (!pdfViewer) {
    pdfViewer = window['pdfjs-dist/build/pdf']
    if (pdfViewer) {
      pdfViewer.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'
    }
  }
  if (!pdfViewer || !window.PDFLib) throw new Error('Libraries not ready')

  const pdfJsDoc = await pdfViewer.getDocument(url).promise
  pdfJsDocRef = pdfJsDoc

  const buffer = await fetch(url).then(r => r.arrayBuffer())
  URL.revokeObjectURL(url)
  pdfDoc = await window.PDFLib.PDFDocument.load(buffer)

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i)
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: 125 / base.width })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
    thumbnails.value.push(canvas.toDataURL())
  }

  maxPages.value = pdfJsDoc.numPages
  toPage.value = pdfJsDoc.numPages
  hasFile.value = true
  dividePages()
}

function dividePages() {
  const intervals: [number, number][] = []
  let from = 1
  while (from <= maxPages.value) {
    const to = Math.min(from + divisor.value - 1, maxPages.value)
    intervals.push([from, to])
    from = to + 1
  }
  fixedIntervals.value = intervals
}

function addCustomInterval() {
  const from = fromPage.value
  const to = Math.min(toPage.value, maxPages.value)
  if (from > to || from > maxPages.value) return
  customIntervals.value.push([from, to])
  fromPage.value = Math.min(to + 1, maxPages.value)
  toPage.value = maxPages.value
}

function confirmDelete(index: number) {
  deleteTarget.value = index
  deleteModal.value?.showModal()
}

function doDelete() {
  if (deleteTarget.value !== null) {
    customIntervals.value.splice(deleteTarget.value, 1)
    deleteTarget.value = null
  }
  deleteModal.value?.close()
}

async function viewPage(pageNum: number) {
  if (!pdfJsDocRef) return
  const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement
  if (!canvas) return
  const page = await pdfJsDocRef.getPage(pageNum)
  const viewport = page.getViewport({ scale: 1.2 })
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
  previewModal.value?.showModal()
}

async function downloadSplitPDFs() {
  const intervals = activeTab.value === 0 ? fixedIntervals.value : customIntervals.value
  if (intervals.length === 0) {
    alert(t('no_intervals'))
    return
  }
  if (!window.JSZip || !window.PDFLib || !window.download) return
  loading.value = true

  setTimeout(async () => {
    try {
      const zip = new window.JSZip()
      for (const [from, to] of intervals) {
        const newPdf = await window.PDFLib.PDFDocument.create()
        const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i)
        const copies = await newPdf.copyPages(pdfDoc, indices)
        copies.forEach((p: any) => newPdf.addPage(p))
        const fileName = from !== to ? `PDF_${from}-${to}.pdf` : `PDF_${from}.pdf`
        zip.file(fileName, await newPdf.saveAsBase64(), { base64: true })
      }
      const content = await zip.generateAsync({ type: 'blob' })
      window.download(content, 'PDFs.zip', 'application/zip')
    } finally {
      loading.value = false
    }
  }, 100)
}

function reload() {
  thumbnails.value = []
  maxPages.value = 0
  fixedIntervals.value = []
  customIntervals.value = []
  divisor.value = 1
  fromPage.value = 1
  toPage.value = 1
  hasFile.value = false
  activeTab.value = 0
  pdfJsDocRef = null
  pdfDoc = null
}

defineI18nRoute({
  paths: {
    en: '/pdf-splitter',
    pt: '/divisor-de-pdf',
    es: '/divisor-de-pdf',
    fr: '/diviseur-de-pdf',
    it: '/divisore-pdf',
    id: '/pemisah-pdf',
    de: '/pdf-teiler',
    nl: '/pdf-splitser',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="hasFile"
    :see-also-links="[
      { label: t('see1'), to: 'pdf-editor' },
      { label: t('see2'), to: 'image-to-pdf' },
      { label: t('see3'), to: 'numbering-pdf' },
      { label: t('see4'), to: 'pdf-to-image' },
    ]"
  >
    <!-- Upload state -->
    <div v-if="!hasFile" class="flex flex-col items-center justify-center py-8 gap-4">
      <label class="flex flex-col items-center justify-center w-full max-w-2xl h-44 border-2 border-dashed rounded-xl border-base-content/20 bg-base-200/40 hover:bg-base-200/70 hover:border-primary/40 transition-colors cursor-pointer">
        <Icon name="heroicons:document-arrow-up-20-solid" class="w-12 h-12 mb-3 text-base-content/60" />
        <p class="mb-2 text-base-content/70">
          <span class="font-semibold">{{ t('click_upload') }}</span> {{ t('or_drag') }}
        </p>
        <input type="file" accept="application/pdf" class="hidden" @change="onPdfSelected" />
      </label>
      <p class="text-sm text-base-content/70">{{ t('upload_hint') }}</p>
    </div>

    <!-- File loaded state -->
    <div v-else class="space-y-4">
      <!-- Action bar -->
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-ghost btn-sm" @click="reload">
          <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4" /> {{ t('restart') }}
        </button>
        <button type="button" class="btn btn-primary btn-sm ml-auto" :disabled="loading" @click="downloadSplitPDFs">
          <Icon name="heroicons:document-arrow-down-20-solid" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          {{ loading ? t('downloading') : t('download') }}
        </button>
      </div>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered">
        <button
          role="tab"
          class="tab"
          :class="{ 'tab-active': activeTab === 0 }"
          @click="activeTab = 0"
        >
          {{ t('tab_fixed') }}
        </button>
        <button
          role="tab"
          class="tab"
          :class="{ 'tab-active': activeTab === 1 }"
          @click="activeTab = 1"
        >
          {{ t('tab_custom') }}
        </button>
      </div>

      <!-- Fixed intervals tab -->
      <div v-show="activeTab === 0" class="space-y-4">
        <div class="flex items-center gap-3 flex-wrap">
          <label class="text-sm font-medium text-base-content">{{ t('pages_per_split') }}:</label>
          <input
            v-model.number="divisor"
            type="number"
            min="1"
            :max="maxPages"
            class="input input-bordered input-sm w-20"
          />
          <span class="text-sm text-base-content/50">{{ t('total_pages') }}: {{ maxPages }}</span>
        </div>

        <div class="flex flex-wrap gap-3">
          <div
            v-for="([from, to], i) in fixedIntervals"
            :key="i"
            class="relative group cursor-default rounded-xl overflow-hidden border border-base-content/10 bg-base-200/35 w-28"
          >
            <div class="h-36 flex items-center justify-center bg-base-200/50 overflow-hidden">
              <img
                :src="thumbnails[from - 1]"
                class="max-w-full max-h-full object-contain"
                :alt="`Páginas ${from}–${to}`"
              />
            </div>
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                class="bg-black/60 rounded-full p-0.5"
                :aria-label="t('preview')"
                @click="viewPage(from)"
              >
                <Icon name="heroicons:arrows-pointing-out-20-solid" class="w-3 h-3 text-white" />
              </button>
            </div>
            <div class="text-xs text-center text-base-content/50 py-1 font-medium">
              {{ from === to ? `Pg. ${from}` : `${from}–${to}` }}
            </div>
          </div>
        </div>
      </div>

      <!-- Custom intervals tab -->
      <div v-show="activeTab === 1" class="space-y-4">
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-base-content/70">{{ t('from_page') }}</label>
            <input
              v-model.number="fromPage"
              type="number"
              min="1"
              :max="toPage"
              class="input input-bordered input-sm w-20"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-base-content/70">{{ t('to_page') }}</label>
            <input
              v-model.number="toPage"
              type="number"
              :min="fromPage"
              :max="maxPages"
              class="input input-bordered input-sm w-20"
            />
          </div>
          <button type="button" class="btn btn-outline btn-sm" @click="addCustomInterval">
            <Icon name="heroicons:plus-20-solid" class="w-4 h-4" /> {{ t('add_interval') }}
          </button>
          <span class="text-sm text-base-content/50 self-center">{{ t('total_pages') }}: {{ maxPages }}</span>
        </div>

        <div v-if="customIntervals.length === 0" class="text-sm text-base-content/40 py-2">
          {{ t('no_intervals_hint') }}
        </div>

        <div class="flex flex-wrap gap-3">
          <div
            v-for="([from, to], i) in customIntervals"
            :key="i"
            class="relative group cursor-default rounded-xl overflow-hidden border border-base-content/10 bg-base-200/35 w-28"
          >
            <div class="h-36 flex items-center justify-center bg-base-200/50 overflow-hidden">
              <img
                :src="thumbnails[from - 1]"
                class="max-w-full max-h-full object-contain"
                :alt="`Páginas ${from}–${to}`"
              />
            </div>
            <div class="absolute top-1 right-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                class="bg-black/60 rounded-full p-0.5"
                :aria-label="t('preview')"
                @click="viewPage(from)"
              >
                <Icon name="heroicons:arrows-pointing-out-20-solid" class="w-3 h-3 text-white" />
              </button>
              <button
                type="button"
                class="bg-red-600/70 rounded-full p-0.5"
                :aria-label="t('remove')"
                @click="confirmDelete(i)"
              >
                <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white" />
              </button>
            </div>
            <div class="text-xs text-center text-base-content/50 py-1 font-medium">
              {{ from === to ? `Pg. ${from}` : `${from}–${to}` }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <dialog ref="deleteModal" class="modal">
      <div class="modal-box">
        <p class="text-base-content">{{ t('question') }}</p>
        <div class="modal-action">
          <button type="button" class="btn btn-error btn-sm" @click="doDelete">{{ t('confirm') }}</button>
          <button type="button" class="btn btn-ghost btn-sm" @click="deleteModal?.close()">{{ t('cancel') }}</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>

    <!-- Page preview modal -->
    <dialog ref="previewModal" class="modal">
      <div class="modal-box max-w-4xl w-full">
        <canvas id="preview-canvas" class="max-w-full mx-auto block" />
        <div class="modal-action">
          <button type="button" class="btn btn-ghost btn-sm" @click="previewModal?.close()">{{ t('close') }}</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>

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
pt:
  title: "Dividir PDF"
  page_title: "Dividir PDF Online — Separar Arquivos PDF por Páginas Grátis"
  meta: "Divida e separe arquivos PDF em documentos menores de forma rápida e segura, direto no navegador. Defina intervalos fixos ou personalizados e baixe tudo em um arquivo ZIP."
  intro: "O Divisor de PDF permite dividir um arquivo PDF em vários documentos menores com total controle sobre os intervalos de páginas. Escolha uma divisão automática em partes iguais ou defina manualmente as páginas de cada parte. Tudo acontece no seu navegador, garantindo total privacidade."
  upload_hint: "Selecione um arquivo PDF para começar"
  click_upload: "Clique para fazer upload"
  or_drag: "ou arraste e solte"
  restart: "Recomeçar"
  download: "Baixar Arquivos"
  downloading: "Baixando..."
  tab_fixed: "Intervalos Fixos"
  tab_custom: "Intervalos Personalizados"
  pages_per_split: "Páginas por parte"
  total_pages: "Total de páginas"
  from_page: "Da página"
  to_page: "Até a página"
  add_interval: "Adicionar Intervalo"
  no_intervals_hint: "Adicione pelo menos um intervalo para dividir o PDF"
  preview: "Visualizar página"
  remove: "Remover intervalo"
  question: "Remover este intervalo de páginas?"
  confirm: "Remover"
  cancel: "Cancelar"
  close: "Fechar"
  err: "Ocorreu um erro ao tentar abrir o arquivo"
  err_pass: "Arquivo PDF protegido por senha"
  no_intervals: "Defina pelo menos um intervalo de páginas para dividir"
  features_title: "Recursos do Divisor de PDF"
  feature_1: "Divisão automática em partes iguais com intervalos definidos"
  feature_2: "Separação personalizada por páginas específicas ou intervalos livres"
  feature_3: "Pré-visualização das páginas antes de confirmar os cortes"
  feature_4: "Download de todos os PDFs gerados em um único arquivo ZIP"
  use_cases_title: "Quando Dividir um PDF"
  use_cases_desc: "Dividir PDFs é útil sempre que você precisa separar partes de um documento maior ou distribuir conteúdo de forma organizada."
  uc_1_title: "Separar Capítulos"
  uc_1_desc: "Separe capítulos de livros, apostilas, e-books ou relatórios em arquivos individuais para facilitar a leitura ou distribuição."
  uc_2_title: "Reduzir Tamanho"
  uc_2_desc: "Divida PDFs grandes em partes menores para enviar por e-mail ou compartilhar em plataformas com limite de tamanho de arquivo."
  uc_3_title: "Organizar Documentos Digitalizados"
  uc_3_desc: "Separe digitalizações em lote por documento, formulário ou destinatário, criando arquivos individuais organizados."
  uc_4_title: "Distribuir por Seção"
  uc_4_desc: "Divida um PDF de proposta, manual ou apresentação por seção para enviar apenas a parte relevante para cada destinatário."
  how_to_title: "Como Dividir um PDF"
  how_1_title: "Carregue seu PDF"
  how_1_desc: "Clique para fazer upload ou arraste e solte o arquivo PDF que deseja dividir."
  how_2_title: "Defina os intervalos"
  how_2_desc: "Use intervalos fixos para dividir em partes iguais, ou crie intervalos personalizados escolhendo exatamente quais páginas incluir em cada parte."
  how_3_title: "Baixe os arquivos"
  how_3_desc: "Clique em Baixar Arquivos. Todos os arquivos gerados serão compactados em um único ZIP."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Qual a diferença entre intervalos fixos e personalizados?"
  faq_1_a: "Os intervalos fixos dividem o PDF automaticamente em partes com o mesmo número de páginas. Os intervalos personalizados permitem que você escolha manualmente as páginas de início e fim de cada parte."
  faq_2_q: "Como os arquivos são entregues após a divisão?"
  faq_2_a: "Todos os PDFs gerados são compactados automaticamente em um único arquivo ZIP. O download começa assim que o processamento for concluído."
  see1: "Editor de PDF"
  see2: "Imagem para PDF"
  see3: "Numerar PDF"
  see4: "PDF para Imagem"
en:
  title: "Split PDF"
  page_title: "Split PDF Online — Separate PDF Pages for Free"
  meta: "Split PDF files into smaller documents quickly and securely, right in your browser. Set fixed or custom intervals and download everything in a ZIP file."
  intro: "PDF Splitter lets you split a PDF file into multiple smaller documents with full control over page ranges. Choose an automatic split into equal parts or manually define the pages for each part. Everything happens in your browser, ensuring complete privacy."
  upload_hint: "Select a PDF file to get started"
  click_upload: "Click to upload"
  or_drag: "or drag and drop"
  restart: "Start over"
  download: "Download Files"
  downloading: "Downloading..."
  tab_fixed: "Fixed Intervals"
  tab_custom: "Custom Intervals"
  pages_per_split: "Pages per part"
  total_pages: "Total pages"
  from_page: "From page"
  to_page: "To page"
  add_interval: "Add Interval"
  no_intervals_hint: "Add at least one interval to split the PDF"
  preview: "Preview page"
  remove: "Remove interval"
  question: "Remove this page range?"
  confirm: "Remove"
  cancel: "Cancel"
  close: "Close"
  err: "An error occurred while trying to open the file"
  err_pass: "Password-protected PDF file"
  no_intervals: "Define at least one page range to split"
  features_title: "PDF Splitter Features"
  feature_1: "Automatic splitting into equal parts with defined intervals"
  feature_2: "Custom separation by specific pages or flexible ranges"
  feature_3: "Preview pages before confirming the splits"
  feature_4: "Download all generated PDFs in a single ZIP file"
  use_cases_title: "When to Split a PDF"
  use_cases_desc: "Splitting PDFs is useful whenever you need to separate parts of a larger document or distribute content in an organized way."
  uc_1_title: "Separate Chapters"
  uc_1_desc: "Separate chapters from books, course materials, e-books, or reports into individual files for easier reading or distribution."
  uc_2_title: "Reduce File Size"
  uc_2_desc: "Split large PDFs into smaller parts to send by email or share on platforms with file size limits."
  uc_3_title: "Organize Scanned Documents"
  uc_3_desc: "Separate batch scans by document, form, or recipient, creating organized individual files."
  uc_4_title: "Distribute by Section"
  uc_4_desc: "Split a proposal, manual, or presentation PDF by section to send only the relevant part to each recipient."
  how_to_title: "How to Split a PDF"
  how_1_title: "Upload your PDF"
  how_1_desc: "Click to upload or drag and drop the PDF file you want to split."
  how_2_title: "Define the intervals"
  how_2_desc: "Use fixed intervals to split into equal parts, or create custom intervals by choosing exactly which pages to include in each part."
  how_3_title: "Download the files"
  how_3_desc: "Click Download Files. All generated files will be compressed into a single ZIP."
  faq_title: "Questions and Answers"
  faq_1_q: "What is the difference between fixed and custom intervals?"
  faq_1_a: "Fixed intervals automatically split the PDF into parts with the same number of pages. Custom intervals let you manually choose the start and end pages for each part."
  faq_2_q: "How are the files delivered after splitting?"
  faq_2_a: "All generated PDFs are automatically compressed into a single ZIP file. The download starts as soon as processing is complete."
  see1: "PDF Editor"
  see2: "Image to PDF"
  see3: "Numbering PDF"
  see4: "PDF to Image"
es:
  title: "Dividir PDF"
  page_title: "Dividir PDF Online — Separar Archivos PDF por Páginas Gratis"
  meta: "Divida y separe archivos PDF en documentos más pequeños de forma rápida y segura, directamente en su navegador. Defina intervalos fijos o personalizados y descargue todo en un archivo ZIP."
  intro: "El Divisor de PDF permite dividir un archivo PDF en varios documentos más pequeños con control total sobre los intervalos de páginas. Elija una división automática en partes iguales o defina manualmente las páginas de cada parte. Todo ocurre en su navegador, garantizando total privacidad."
  upload_hint: "Seleccione un archivo PDF para empezar"
  click_upload: "Haga clic para subir"
  or_drag: "o arrastre y suelte"
  restart: "Empezar de nuevo"
  download: "Descargar Archivos"
  downloading: "Descargando..."
  tab_fixed: "Intervalos Fijos"
  tab_custom: "Intervalos Personalizados"
  pages_per_split: "Páginas por parte"
  total_pages: "Total de páginas"
  from_page: "Desde la página"
  to_page: "Hasta la página"
  add_interval: "Añadir Intervalo"
  no_intervals_hint: "Añada al menos un intervalo para dividir el PDF"
  preview: "Previsualizar página"
  remove: "Eliminar intervalo"
  question: "¿Eliminar este intervalo de páginas?"
  confirm: "Eliminar"
  cancel: "Cancelar"
  close: "Cerrar"
  err: "Ocurrió un error al intentar abrir el archivo"
  err_pass: "Archivo PDF protegido con contraseña"
  no_intervals: "Defina al menos un intervalo de páginas para dividir"
  features_title: "Funciones del Divisor de PDF"
  feature_1: "División automática en partes iguales con intervalos definidos"
  feature_2: "Separación personalizada por páginas específicas o intervalos libres"
  feature_3: "Previsualización de las páginas antes de confirmar los cortes"
  feature_4: "Descarga de todos los PDF generados en un único archivo ZIP"
  use_cases_title: "Cuándo Dividir un PDF"
  use_cases_desc: "Dividir PDF es útil siempre que necesita separar partes de un documento más grande o distribuir contenido de forma organizada."
  uc_1_title: "Separar Capítulos"
  uc_1_desc: "Separe capítulos de libros, materiales de estudio, e-books o informes en archivos individuales para facilitar la lectura o distribución."
  uc_2_title: "Reducir Tamaño"
  uc_2_desc: "Divida PDF grandes en partes más pequeñas para enviarlos por correo electrónico o compartirlos en plataformas con límite de tamaño de archivo."
  uc_3_title: "Organizar Documentos Escaneados"
  uc_3_desc: "Separe escaneos por lotes por documento, formulario o destinatario, creando archivos individuales organizados."
  uc_4_title: "Distribuir por Sección"
  uc_4_desc: "Divida un PDF de propuesta, manual o presentación por sección para enviar solo la parte relevante a cada destinatario."
  how_to_title: "Cómo Dividir un PDF"
  how_1_title: "Suba su PDF"
  how_1_desc: "Haga clic para subir o arrastre y suelte el archivo PDF que desea dividir."
  how_2_title: "Defina los intervalos"
  how_2_desc: "Use intervalos fijos para dividir en partes iguales, o cree intervalos personalizados eligiendo exactamente qué páginas incluir en cada parte."
  how_3_title: "Descargue los archivos"
  how_3_desc: "Haga clic en Descargar Archivos. Todos los archivos generados se comprimirán en un único ZIP."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Cuál es la diferencia entre intervalos fijos y personalizados?"
  faq_1_a: "Los intervalos fijos dividen el PDF automáticamente en partes con el mismo número de páginas. Los intervalos personalizados le permiten elegir manualmente las páginas de inicio y fin de cada parte."
  faq_2_q: "¿Cómo se entregan los archivos después de la división?"
  faq_2_a: "Todos los PDF generados se comprimen automáticamente en un único archivo ZIP. La descarga comienza en cuanto finaliza el procesamiento."
  see1: "Editor de PDF"
  see2: "Imagen a PDF"
  see3: "Numerar PDF"
  see4: "PDF a Imagen"
fr:
  title: "Diviser PDF"
  page_title: "Diviser PDF en ligne — Séparer les pages PDF gratuitement"
  meta: "Divisez des fichiers PDF en documents plus petits rapidement et en toute sécurité, directement dans votre navigateur. Définissez des intervalles fixes ou personnalisés et téléchargez le tout dans un fichier ZIP."
  intro: "Le diviseur de PDF vous permet de diviser un fichier PDF en plusieurs documents plus petits avec un contrôle total sur les plages de pages. Choisissez une division automatique en parties égales ou définissez manuellement les pages de chaque partie. Tout se passe dans votre navigateur, garantissant une confidentialité totale."
  upload_hint: "Sélectionnez un fichier PDF pour commencer"
  click_upload: "Cliquez pour téléverser"
  or_drag: "ou glissez-déposez"
  restart: "Recommencer"
  download: "Télécharger les fichiers"
  downloading: "Téléchargement..."
  tab_fixed: "Intervalles fixes"
  tab_custom: "Intervalles personnalisés"
  pages_per_split: "Pages par partie"
  total_pages: "Nombre total de pages"
  from_page: "De la page"
  to_page: "À la page"
  add_interval: "Ajouter un intervalle"
  no_intervals_hint: "Ajoutez au moins un intervalle pour diviser le PDF"
  preview: "Aperçu de la page"
  remove: "Supprimer l'intervalle"
  question: "Supprimer cette plage de pages ?"
  confirm: "Supprimer"
  cancel: "Annuler"
  close: "Fermer"
  err: "Une erreur s'est produite lors de l'ouverture du fichier"
  err_pass: "Fichier PDF protégé par mot de passe"
  no_intervals: "Définissez au moins une plage de pages à diviser"
  features_title: "Fonctionnalités du diviseur de PDF"
  feature_1: "Division automatique en parties égales avec intervalles définis"
  feature_2: "Séparation personnalisée par pages spécifiques ou plages libres"
  feature_3: "Aperçu des pages avant de confirmer les découpes"
  feature_4: "Téléchargement de tous les PDF générés dans un seul fichier ZIP"
  use_cases_title: "Quand diviser un PDF"
  use_cases_desc: "Diviser des PDF est utile chaque fois que vous devez séparer des parties d'un document plus grand ou distribuer du contenu de manière organisée."
  uc_1_title: "Séparer des chapitres"
  uc_1_desc: "Séparez les chapitres de livres, supports de cours, e-books ou rapports en fichiers individuels pour faciliter la lecture ou la distribution."
  uc_2_title: "Réduire la taille"
  uc_2_desc: "Divisez les PDF volumineux en parties plus petites pour les envoyer par e-mail ou les partager sur des plateformes avec une limite de taille de fichier."
  uc_3_title: "Organiser des documents numérisés"
  uc_3_desc: "Séparez les numérisations par lot selon le document, le formulaire ou le destinataire, en créant des fichiers individuels organisés."
  uc_4_title: "Distribuer par section"
  uc_4_desc: "Divisez un PDF de proposition, de manuel ou de présentation par section afin d'envoyer uniquement la partie pertinente à chaque destinataire."
  how_to_title: "Comment diviser un PDF"
  how_1_title: "Téléversez votre PDF"
  how_1_desc: "Cliquez pour téléverser ou glissez-déposez le fichier PDF que vous souhaitez diviser."
  how_2_title: "Définissez les intervalles"
  how_2_desc: "Utilisez des intervalles fixes pour diviser en parties égales, ou créez des intervalles personnalisés en choisissant exactement les pages à inclure dans chaque partie."
  how_3_title: "Téléchargez les fichiers"
  how_3_desc: "Cliquez sur Télécharger les fichiers. Tous les fichiers générés seront compressés dans un seul ZIP."
  faq_title: "Questions et réponses"
  faq_1_q: "Quelle est la différence entre les intervalles fixes et personnalisés ?"
  faq_1_a: "Les intervalles fixes divisent automatiquement le PDF en parties ayant le même nombre de pages. Les intervalles personnalisés vous permettent de choisir manuellement les pages de début et de fin de chaque partie."
  faq_2_q: "Comment les fichiers sont-ils livrés après la division ?"
  faq_2_a: "Tous les PDF générés sont automatiquement compressés dans un seul fichier ZIP. Le téléchargement commence dès que le traitement est terminé."
  see1: "Éditeur de PDF"
  see2: "Image en PDF"
  see3: "Numéroter PDF"
  see4: "PDF en Image"
it:
  title: "Dividere PDF"
  page_title: "Dividere PDF Online — Separare pagine PDF gratuitamente"
  meta: "Dividi i file PDF in documenti più piccoli in modo rapido e sicuro, direttamente nel tuo browser. Imposta intervalli fissi o personalizzati e scarica tutto in un file ZIP."
  intro: "Il divisore PDF consente di dividere un file PDF in più documenti più piccoli con pieno controllo sugli intervalli di pagine. Scegli una divisione automatica in parti uguali o definisci manualmente le pagine di ogni parte. Tutto avviene nel tuo browser, garantendo la massima privacy."
  upload_hint: "Seleziona un file PDF per iniziare"
  click_upload: "Fai clic per caricare"
  or_drag: "o trascina e rilascia"
  restart: "Ricomincia"
  download: "Scarica File"
  downloading: "Download in corso..."
  tab_fixed: "Intervalli Fissi"
  tab_custom: "Intervalli Personalizzati"
  pages_per_split: "Pagine per parte"
  total_pages: "Totale pagine"
  from_page: "Dalla pagina"
  to_page: "Alla pagina"
  add_interval: "Aggiungi Intervallo"
  no_intervals_hint: "Aggiungi almeno un intervallo per dividere il PDF"
  preview: "Anteprima pagina"
  remove: "Rimuovi intervallo"
  question: "Rimuovere questo intervallo di pagine?"
  confirm: "Rimuovi"
  cancel: "Annulla"
  close: "Chiudi"
  err: "Si è verificato un errore durante l'apertura del file"
  err_pass: "File PDF protetto da password"
  no_intervals: "Definisci almeno un intervallo di pagine da dividere"
  features_title: "Funzionalità del divisore PDF"
  feature_1: "Divisione automatica in parti uguali con intervalli definiti"
  feature_2: "Separazione personalizzata per pagine specifiche o intervalli liberi"
  feature_3: "Anteprima delle pagine prima di confermare i tagli"
  feature_4: "Download di tutti i PDF generati in un unico file ZIP"
  use_cases_title: "Quando Dividere un PDF"
  use_cases_desc: "Dividere PDF è utile ogni volta che devi separare parti di un documento più grande o distribuire contenuti in modo organizzato."
  uc_1_title: "Separare Capitoli"
  uc_1_desc: "Separa capitoli di libri, dispense, e-book o report in file individuali per facilitare la lettura o la distribuzione."
  uc_2_title: "Ridurre Dimensione"
  uc_2_desc: "Dividi PDF di grandi dimensioni in parti più piccole per inviarli via e-mail o condividerli su piattaforme con limiti di dimensione dei file."
  uc_3_title: "Organizzare Documenti Scansionati"
  uc_3_desc: "Separa scansioni in blocco per documento, modulo o destinatario, creando file individuali organizzati."
  uc_4_title: "Distribuire per Sezione"
  uc_4_desc: "Dividi un PDF di proposta, manuale o presentazione per sezione per inviare solo la parte pertinente a ciascun destinatario."
  how_to_title: "Come Dividere un PDF"
  how_1_title: "Carica il tuo PDF"
  how_1_desc: "Fai clic per caricare o trascina e rilascia il file PDF che desideri dividere."
  how_2_title: "Definisci gli intervalli"
  how_2_desc: "Usa intervalli fissi per dividere in parti uguali, oppure crea intervalli personalizzati scegliendo esattamente quali pagine includere in ogni parte."
  how_3_title: "Scarica i file"
  how_3_desc: "Fai clic su Scarica File. Tutti i file generati verranno compressi in un unico ZIP."
  faq_title: "Domande e Risposte"
  faq_1_q: "Qual è la differenza tra intervalli fissi e personalizzati?"
  faq_1_a: "Gli intervalli fissi dividono automaticamente il PDF in parti con lo stesso numero di pagine. Gli intervalli personalizzati ti consentono di scegliere manualmente le pagine iniziali e finali di ogni parte."
  faq_2_q: "Come vengono consegnati i file dopo la divisione?"
  faq_2_a: "Tutti i PDF generati vengono compressi automaticamente in un unico file ZIP. Il download inizia non appena l'elaborazione è completata."
  see1: "Editor di PDF"
  see2: "Immagine in PDF"
  see3: "Numerare PDF"
  see4: "PDF in Immagine"
id:
  title: "Bagi PDF"
  page_title: "Bagi PDF Online — Pisahkan Halaman PDF secara Gratis"
  meta: "Bagi dan pisahkan file PDF menjadi dokumen yang lebih kecil dengan cepat dan aman, langsung di browser. Tentukan interval tetap atau khusus dan unduh semuanya dalam file ZIP."
  intro: "Pembagi PDF memungkinkan Anda membagi file PDF menjadi beberapa dokumen yang lebih kecil dengan kontrol penuh atas rentang halaman. Pilih pembagian otomatis menjadi bagian yang sama atau tentukan halaman untuk setiap bagian secara manual. Semuanya terjadi di browser Anda, memastikan privasi penuh."
  upload_hint: "Pilih file PDF untuk memulai"
  click_upload: "Klik untuk mengunggah"
  or_drag: "atau seret dan lepas"
  restart: "Mulai ulang"
  download: "Unduh File"
  downloading: "Mengunduh..."
  tab_fixed: "Interval Tetap"
  tab_custom: "Interval Khusus"
  pages_per_split: "Halaman per bagian"
  total_pages: "Total halaman"
  from_page: "Dari halaman"
  to_page: "Sampai halaman"
  add_interval: "Tambahkan Interval"
  no_intervals_hint: "Tambahkan setidaknya satu interval untuk membagi PDF"
  preview: "Pratinjau halaman"
  remove: "Hapus interval"
  question: "Hapus rentang halaman ini?"
  confirm: "Hapus"
  cancel: "Batal"
  close: "Tutup"
  err: "Terjadi kesalahan saat mencoba membuka file"
  err_pass: "File PDF dilindungi kata sandi"
  no_intervals: "Tentukan setidaknya satu rentang halaman untuk dibagi"
  features_title: "Fitur Pembagi PDF"
  feature_1: "Pembagian otomatis menjadi bagian yang sama dengan interval yang ditentukan"
  feature_2: "Pemisahan khusus berdasarkan halaman tertentu atau rentang bebas"
  feature_3: "Pratinjau halaman sebelum mengonfirmasi pemotongan"
  feature_4: "Unduh semua PDF yang dihasilkan dalam satu file ZIP"
  use_cases_title: "Kapan Membagi PDF"
  use_cases_desc: "Membagi PDF berguna saat Anda perlu memisahkan bagian dari dokumen yang lebih besar atau mendistribusikan konten secara teratur."
  uc_1_title: "Pisahkan Bab"
  uc_1_desc: "Pisahkan bab dari buku, materi kursus, e-book, atau laporan menjadi file tersendiri agar lebih mudah dibaca atau didistribusikan."
  uc_2_title: "Kurangi Ukuran"
  uc_2_desc: "Bagi PDF besar menjadi bagian yang lebih kecil untuk dikirim melalui email atau dibagikan di platform dengan batas ukuran file."
  uc_3_title: "Atur Dokumen Pindaian"
  uc_3_desc: "Pisahkan pindaian massal berdasarkan dokumen, formulir, atau penerima, lalu buat file individual yang terorganisir."
  uc_4_title: "Distribusikan per Bagian"
  uc_4_desc: "Bagi PDF proposal, manual, atau presentasi berdasarkan bagian untuk mengirim hanya bagian yang relevan kepada setiap penerima."
  how_to_title: "Cara Membagi PDF"
  how_1_title: "Unggah PDF Anda"
  how_1_desc: "Klik untuk mengunggah atau seret dan lepas file PDF yang ingin Anda bagi."
  how_2_title: "Tentukan interval"
  how_2_desc: "Gunakan interval tetap untuk membagi menjadi bagian yang sama, atau buat interval khusus dengan memilih halaman yang tepat untuk disertakan di setiap bagian."
  how_3_title: "Unduh file"
  how_3_desc: "Klik Unduh File. Semua file yang dihasilkan akan dikompresi dalam satu ZIP."
  faq_title: "Pertanyaan dan Jawaban"
  faq_1_q: "Apa perbedaan antara interval tetap dan khusus?"
  faq_1_a: "Interval tetap membagi PDF secara otomatis menjadi bagian dengan jumlah halaman yang sama. Interval khusus memungkinkan Anda memilih halaman awal dan akhir untuk setiap bagian secara manual."
  faq_2_q: "Bagaimana file dikirim setelah dibagi?"
  faq_2_a: "Semua PDF yang dihasilkan otomatis dikompresi dalam satu file ZIP. Unduhan dimulai segera setelah pemrosesan selesai."
  see1: "Editor PDF"
  see2: "Gambar ke PDF"
  see3: "Beri Nomor PDF"
  see4: "PDF ke Gambar"
de:
  title: "PDF teilen"
  page_title: "PDF online teilen — PDF-Seiten kostenlos trennen"
  meta: "Teilen und trennen Sie PDF-Dateien schnell und sicher direkt im Browser in kleinere Dokumente. Legen Sie feste oder benutzerdefinierte Intervalle fest und laden Sie alles als ZIP-Datei herunter."
  intro: "Mit dem PDF-Teiler können Sie eine PDF-Datei in mehrere kleinere Dokumente aufteilen und haben die volle Kontrolle über die Seitenbereiche. Wählen Sie eine automatische Aufteilung in gleiche Teile oder legen Sie die Seiten für jeden Teil manuell fest. Alles geschieht in Ihrem Browser und gewährleistet vollständige Privatsphäre."
  upload_hint: "Wählen Sie eine PDF-Datei aus, um zu beginnen"
  click_upload: "Klicken Sie zum Hochladen"
  or_drag: "oder ziehen und ablegen"
  restart: "Neu beginnen"
  download: "Dateien herunterladen"
  downloading: "Wird heruntergeladen..."
  tab_fixed: "Feste Intervalle"
  tab_custom: "Benutzerdefinierte Intervalle"
  pages_per_split: "Seiten pro Teil"
  total_pages: "Gesamtseiten"
  from_page: "Von Seite"
  to_page: "Bis Seite"
  add_interval: "Intervall hinzufügen"
  no_intervals_hint: "Fügen Sie mindestens ein Intervall hinzu, um die PDF-Datei zu teilen"
  preview: "Seite anzeigen"
  remove: "Intervall entfernen"
  question: "Diesen Seitenbereich entfernen?"
  confirm: "Entfernen"
  cancel: "Abbrechen"
  close: "Schließen"
  err: "Beim Öffnen der Datei ist ein Fehler aufgetreten"
  err_pass: "Passwortgeschützte PDF-Datei"
  no_intervals: "Legen Sie mindestens einen Seitenbereich zum Teilen fest"
  features_title: "Funktionen des PDF-Teilers"
  feature_1: "Automatische Aufteilung in gleiche Teile mit definierten Intervallen"
  feature_2: "Benutzerdefinierte Trennung nach bestimmten Seiten oder freien Bereichen"
  feature_3: "Vorschau der Seiten vor dem Bestätigen der Schnitte"
  feature_4: "Download aller generierten PDFs in einer einzigen ZIP-Datei"
  use_cases_title: "Wann ein PDF geteilt werden sollte"
  use_cases_desc: "Das Teilen von PDFs ist immer dann nützlich, wenn Sie Teile eines größeren Dokuments trennen oder Inhalte organisiert verteilen müssen."
  uc_1_title: "Kapitel trennen"
  uc_1_desc: "Trennen Sie Kapitel aus Büchern, Kursmaterialien, E-Books oder Berichten in einzelne Dateien, um sie einfacher zu lesen oder zu verteilen."
  uc_2_title: "Größe reduzieren"
  uc_2_desc: "Teilen Sie große PDFs in kleinere Teile auf, um sie per E-Mail zu versenden oder auf Plattformen mit Dateigrößenbeschränkung zu teilen."
  uc_3_title: "Gescannte Dokumente organisieren"
  uc_3_desc: "Trennen Sie Stapel-Scans nach Dokument, Formular oder Empfänger und erstellen Sie organisierte Einzeldateien."
  uc_4_title: "Nach Abschnitt verteilen"
  uc_4_desc: "Teilen Sie ein PDF-Angebot, Handbuch oder eine Präsentation nach Abschnitt auf, um nur den relevanten Teil an jeden Empfänger zu senden."
  how_to_title: "So teilen Sie ein PDF"
  how_1_title: "Laden Sie Ihr PDF hoch"
  how_1_desc: "Klicken Sie zum Hochladen oder ziehen Sie die PDF-Datei, die Sie teilen möchten, per Drag-and-drop."
  how_2_title: "Intervalle festlegen"
  how_2_desc: "Verwenden Sie feste Intervalle, um in gleiche Teile zu teilen, oder erstellen Sie benutzerdefinierte Intervalle, indem Sie genau auswählen, welche Seiten in jeden Teil aufgenommen werden sollen."
  how_3_title: "Dateien herunterladen"
  how_3_desc: "Klicken Sie auf Dateien herunterladen. Alle generierten Dateien werden in einer einzigen ZIP-Datei komprimiert."
  faq_title: "Fragen und Antworten"
  faq_1_q: "Was ist der Unterschied zwischen festen und benutzerdefinierten Intervallen?"
  faq_1_a: "Feste Intervalle teilen das PDF automatisch in Teile mit der gleichen Seitenanzahl auf. Mit benutzerdefinierten Intervallen können Sie die Start- und Endseiten für jeden Teil manuell auswählen."
  faq_2_q: "Wie werden die Dateien nach dem Teilen bereitgestellt?"
  faq_2_a: "Alle generierten PDFs werden automatisch in einer einzigen ZIP-Datei komprimiert. Der Download beginnt, sobald die Verarbeitung abgeschlossen ist."
  see1: "PDF-Editor"
  see2: "Bild zu PDF"
  see3: "PDF nummerieren"
  see4: "PDF zu Bild"
nl:
  title: "PDF splitsen"
  page_title: "Online PDF splitsen — PDF-pagina's gratis scheiden"
  meta: "Splits en scheid PDF-bestanden snel en veilig in kleinere documenten, rechtstreeks in de browser. Stel vaste of aangepaste intervallen in en download alles in een ZIP-bestand."
  intro: "Met de PDF-splitser kunt u een PDF-bestand opdelen in meerdere kleinere documenten met volledige controle over de paginabereiken. Kies een automatische verdeling in gelijke delen of stel handmatig de pagina's voor elk deel in. Alles gebeurt in uw browser, wat volledige privacy garandeert."
  upload_hint: "Selecteer een PDF-bestand om te beginnen"
  click_upload: "Klik om te uploaden"
  or_drag: "of sleep en zet neer"
  restart: "Opnieuw beginnen"
  download: "Bestanden downloaden"
  downloading: "Bezig met downloaden..."
  tab_fixed: "Vaste intervallen"
  tab_custom: "Aangepaste intervallen"
  pages_per_split: "Pagina's per deel"
  total_pages: "Totaal aantal pagina's"
  from_page: "Van pagina"
  to_page: "Tot pagina"
  add_interval: "Interval toevoegen"
  no_intervals_hint: "Voeg ten minste één interval toe om de PDF te splitsen"
  preview: "Pagina bekijken"
  remove: "Interval verwijderen"
  question: "Dit paginabereik verwijderen?"
  confirm: "Verwijderen"
  cancel: "Annuleren"
  close: "Sluiten"
  err: "Er is een fout opgetreden bij het openen van het bestand"
  err_pass: "Wachtwoordbeveiligd PDF-bestand"
  no_intervals: "Stel ten minste één paginabereik in om te splitsen"
  features_title: "Functies van de PDF-splitser"
  feature_1: "Automatische verdeling in gelijke delen met gedefinieerde intervallen"
  feature_2: "Aangepaste scheiding per specifieke pagina's of vrije bereiken"
  feature_3: "Voorbeeld van pagina's voordat u de splitsingen bevestigt"
  feature_4: "Download alle gegenereerde PDF's in één ZIP-bestand"
  use_cases_title: "Wanneer een PDF splitsen"
  use_cases_desc: "PDF's splitsen is handig wanneer u delen van een groter document moet scheiden of inhoud georganiseerd moet distribueren."
  uc_1_title: "Hoofdstukken scheiden"
  uc_1_desc: "Scheid hoofdstukken uit boeken, cursusmateriaal, e-books of rapporten in afzonderlijke bestanden voor gemakkelijker lezen of distribueren."
  uc_2_title: "Grootte verkleinen"
  uc_2_desc: "Splits grote PDF's in kleinere delen om ze per e-mail te verzenden of te delen op platforms met een bestandsgroottebeperking."
  uc_3_title: "Gescande documenten organiseren"
  uc_3_desc: "Scheid batchscans per document, formulier of ontvanger en maak georganiseerde afzonderlijke bestanden."
  uc_4_title: "Per sectie distribueren"
  uc_4_desc: "Splits een PDF-voorstel, handleiding of presentatie per sectie om alleen het relevante deel naar elke ontvanger te sturen."
  how_to_title: "Hoe een PDF splitsen"
  how_1_title: "Upload uw PDF"
  how_1_desc: "Klik om te uploaden of sleep het PDF-bestand dat u wilt splitsen."
  how_2_title: "Stel de intervallen in"
  how_2_desc: "Gebruik vaste intervallen om in gelijke delen te splitsen, of maak aangepaste intervallen door precies te kiezen welke pagina's in elk deel moeten worden opgenomen."
  how_3_title: "Download de bestanden"
  how_3_desc: "Klik op Bestanden downloaden. Alle gegenereerde bestanden worden gecomprimeerd in één ZIP-bestand."
  faq_title: "Vragen en antwoorden"
  faq_1_q: "Wat is het verschil tussen vaste en aangepaste intervallen?"
  faq_1_a: "Vaste intervallen splitsen de PDF automatisch in delen met hetzelfde aantal pagina's. Met aangepaste intervallen kunt u handmatig de begin- en eindpagina's voor elk deel kiezen."
  faq_2_q: "Hoe worden de bestanden na het splitsen geleverd?"
  faq_2_a: "Alle gegenereerde PDF's worden automatisch gecomprimeerd in één ZIP-bestand. De download begint zodra de verwerking is voltooid."
  see1: "PDF-editor"
  see2: "Afbeelding naar PDF"
  see3: "PDF nummeren"
  see4: "PDF naar afbeelding"
</i18n>
