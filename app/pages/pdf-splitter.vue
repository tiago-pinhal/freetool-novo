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
  { question: t('faq_3_q'), answer: t('faq_3_a') },
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  howToName: t('how_to_title'),
  howToSteps: [
    { name: t('how_1_title'), text: t('how_1_desc') },
    { name: t('how_2_title'), text: t('how_2_desc') },
    { name: t('how_3_title'), text: t('how_3_desc') },
  ],
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
  title: "Divisor de PDF"
  page_title: "Divisor de PDF Gratuito — Divida PDFs Online por Páginas"
  meta: "Divida arquivos PDF em documentos menores de forma rápida e segura, direto no navegador. Defina intervalos fixos ou personalizados e baixe tudo em um arquivo ZIP."
  intro: "O Divisor de PDF permite separar um arquivo PDF em vários documentos menores com total controle sobre os intervalos de páginas. Escolha uma divisão automática em partes iguais ou defina manualmente as páginas de cada parte. Tudo acontece no seu navegador, sem enviar arquivos para servidores."
  upload_hint: "Selecione um arquivo PDF para começar"
  click_upload: "Clique para fazer upload"
  or_drag: "ou arraste e solte"
  restart: "Recomeçar"
  download: "Baixar PDFs Divididos"
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
  use_cases_title: "Quando Usar o Divisor de PDF"
  use_cases_desc: "Dividir PDFs é útil sempre que você precisa extrair partes de um documento maior ou distribuir conteúdo de forma organizada."
  uc_1_title: "Extrair Capítulos"
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
  how_3_desc: "Clique em Baixar PDFs Divididos. Todos os arquivos gerados serão compactados em um único ZIP e o download começa automaticamente."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Qual a diferença entre intervalos fixos e personalizados?"
  faq_1_a: "Os intervalos fixos dividem o PDF automaticamente em partes com o mesmo número de páginas. Os intervalos personalizados permitem que você escolha manualmente as páginas de início e fim de cada parte."
  faq_2_q: "Posso visualizar as páginas antes de dividir?"
  faq_2_a: "Sim. Passe o mouse sobre qualquer miniatura de intervalo e clique no ícone de lupa para visualizar a primeira página daquele trecho em tamanho maior."
  faq_3_q: "Como os arquivos são entregues após a divisão?"
  faq_3_a: "Todos os PDFs gerados são compactados automaticamente em um único arquivo ZIP. O download começa assim que o processamento for concluído."
  see1: "Editor de PDF"
  see2: "Imagem para PDF"
  see3: "Numerar PDF"
  see4: "PDF para Imagem"
en:
  see1: "PDF Editor"
  see2: "Image to PDF"
  see3: "Numbering PDF"
  see4: "PDF to Image"
es:
  see1: "Editor de PDF"
  see2: "Imagen a PDF"
  see3: "Numerar PDF"
  see4: "PDF a Imagen"
fr:
  see1: "Éditeur de PDF"
  see2: "Image en PDF"
  see3: "Numéroter PDF"
  see4: "PDF en Image"
it:
  see1: "Editor di PDF"
  see2: "Immagine in PDF"
  see3: "Numerare PDF"
  see4: "PDF in Immagine"
id:
  see1: "Editor PDF"
  see2: "Gambar ke PDF"
  see3: "Beri Nomor PDF"
  see4: "PDF ke Gambar"
</i18n>
