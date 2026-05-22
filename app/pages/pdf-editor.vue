<script setup lang="ts">
declare global {
  interface Window {
    Sortable: any
    PDFLib: any
    download: any
    'pdfjs-dist/build/pdf': any
  }
}

interface PageItem {
  thumbnail: string
  deleted: boolean
  rotation: number
}

const { t } = useI18n({ useScope: 'local' })

const pages = ref<PageItem[]>([])
const loading = ref(false)
const deleteTarget = ref<number | null>(null)
const deleteModal = ref<HTMLDialogElement | null>(null)
const expandModal = ref<HTMLDialogElement | null>(null)
const extraInput = ref<HTMLInputElement | null>(null)
let pdfViewer: any = null
let joinedDocs: any = null
let sortable: any = null

const hasPages = computed(() => pages.value.some(p => !p.deleted))
const visibleCount = computed(() => pages.value.filter(p => !p.deleted).length)

const faqItems = computed(() => [
  { question: t('faq_1_q'), answer: t('faq_1_a') },
  { question: t('faq_2_q'), answer: t('faq_2_a') },
  { question: t('faq_3_q'), answer: t('faq_3_a') },
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

const { onLoaded: onSortableLoaded } = useScript(
  'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js',
  { trigger: 'client' }
)
const { onLoaded: onPdfjsLoaded } = useScript(
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.min.js',
  { trigger: 'client' }
)
useScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js', { trigger: 'client' })
useScript('https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js', { trigger: 'client' })

onPdfjsLoaded(() => {
  pdfViewer = window['pdfjs-dist/build/pdf']
  if (pdfViewer) {
    pdfViewer.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'
  }
})

onSortableLoaded(() => {
  if (hasPages.value) nextTick(() => initSortable())
})

watch(hasPages, (newVal, oldVal) => {
  if (newVal && !oldVal && window.Sortable) {
    nextTick(() => initSortable())
  } else if (!newVal) {
    sortable?.destroy()
    sortable = null
  }
})

onBeforeUnmount(() => {
  sortable?.destroy()
})

function initSortable() {
  const el = document.getElementById('pages-grid')
  if (!el || !window.Sortable || sortable) return
  sortable = window.Sortable.create(el, { animation: 150 })
}

async function onPdfSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    await loadFiles([...input.files])
    input.value = ''
  }
}

async function onExtraFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    await loadFiles([...input.files])
    input.value = ''
  }
}

async function loadFiles(files: File[]) {
  for (const file of files) {
    const url = URL.createObjectURL(file)
    try {
      await loadPdf(url)
    } catch (e: any) {
      URL.revokeObjectURL(url)
      alert(e?.name === 'PasswordException' ? t('err_pass') : t('err'))
    }
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
  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i)
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: 125 / base.width })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
    pages.value.push({ thumbnail: canvas.toDataURL(), deleted: false, rotation: 0 })
  }

  const buffer = await fetch(url).then(r => r.arrayBuffer())
  URL.revokeObjectURL(url)
  const pdfLibDoc = await window.PDFLib.PDFDocument.load(buffer)

  if (!joinedDocs) {
    joinedDocs = pdfLibDoc
  } else {
    const copies = await joinedDocs.copyPages(pdfLibDoc, pdfLibDoc.getPageIndices())
    copies.forEach((p: any) => joinedDocs.addPage(p))
  }
}

function askDelete(index: number) {
  deleteTarget.value = index
  deleteModal.value?.showModal()
}

function confirmDelete() {
  if (deleteTarget.value !== null) {
    const item = pages.value[deleteTarget.value]
    if (item) item.deleted = true
  }
  deleteTarget.value = null
  deleteModal.value?.close()
}

function rotate(index: number, direction: 'left' | 'right') {
  const item = pages.value[index]
  if (!item || !joinedDocs) return
  const delta = direction === 'right' ? 90 : -90
  item.rotation += delta
  const page = joinedDocs.getPage(index)
  const current = page.getRotation().angle
  page.setRotation(window.PDFLib.degrees(current + delta))
}

async function expand(index: number) {
  if (!joinedDocs || !pdfViewer) return
  const pdfBytes = await joinedDocs.saveAsBase64({ dataUri: true })
  const raw = atob(pdfBytes.substring(pdfBytes.indexOf(';base64,') + ';base64,'.length))
  const array = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) array[i] = raw.charCodeAt(i)

  const doc = await pdfViewer.getDocument(array).promise
  const canvas = document.getElementById('view') as HTMLCanvasElement
  if (!canvas) return
  const page = await doc.getPage(index + 1)
  const viewport = page.getViewport({ scale: 0.8 })
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
  expandModal.value?.showModal()
}

function reload() {
  pages.value = []
  joinedDocs = null
  sortable?.destroy()
  sortable = null
}

function addMore() {
  extraInput.value?.click()
}

async function downloadDoc() {
  if (!joinedDocs || !window.PDFLib || !window.download) return
  loading.value = true

  setTimeout(async () => {
    try {
      const allIndices: number[] = sortable
        ? sortable.toArray().map(Number)
        : pages.value.map((_, i) => i)

      const deletedSet = new Set(pages.value.map((p, i) => p.deleted ? i : -1).filter(i => i >= 0))
      const indices = allIndices.filter(i => !deletedSet.has(i))
      if (indices.length === 0) return

      const doc = await window.PDFLib.PDFDocument.create()
      const copies = await doc.copyPages(joinedDocs, indices)
      copies.forEach((p: any) => doc.addPage(p))
      window.download(await doc.save(), 'PDF.pdf', 'application/pdf')
    } finally {
      loading.value = false
    }
  }, 100)
}

defineI18nRoute({
  paths: {
    en: '/pdf-editor',
    pt: '/editor-de-pdf',
    es: '/editor-de-pdf',
    fr: '/editeur-de-pdf',
    it: '/editor-di-pdf',
    id: '/editor-pdf',
    de: '/pdf-editor',
    nl: '/pdf-editor',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="hasPages"
    :see-also-links="[
      { label: t('see1'), to: 'image-to-pdf' },
      { label: t('see2'), to: 'pdf-splitter' },
      { label: t('see3'), to: 'numbering-pdf' },
      { label: t('see4'), to: 'pdf-to-image' },
    ]"
  >
    <!-- Upload state -->
    <div v-if="pages.length === 0" class="flex flex-col items-center justify-center py-8 gap-4">
      <label class="flex flex-col items-center justify-center w-full max-w-2xl h-44 border-2 border-dashed rounded-xl border-base-content/20 bg-base-200/40 hover:bg-base-200/70 hover:border-primary/40 transition-colors cursor-pointer">
        <Icon name="heroicons:document-arrow-up-20-solid" class="w-12 h-12 mb-3 text-base-content/60" />
        <p class="mb-2 text-base-content/70">
          <span class="font-semibold">{{ t('click_upload') }}</span> {{ t('or_drag') }}
        </p>
        <input type="file" accept="application/pdf" multiple class="hidden" @change="onPdfSelected" />
      </label>
      <p class="text-sm text-base-content/70">{{ t('upload_hint') }}</p>
    </div>

    <!-- Pages loaded state -->
    <div v-else class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-ghost btn-sm" @click="reload">
          <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4" /> {{ t('restart') }}
        </button>
        <button type="button" class="btn btn-ghost btn-sm" @click="addMore">
          <Icon name="heroicons:plus-20-solid" class="w-4 h-4" /> {{ t('add_pdf') }}
        </button>
        <button type="button" class="btn btn-primary btn-sm ml-auto" :disabled="loading" @click="downloadDoc">
          <Icon name="heroicons:document-arrow-down-20-solid" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          {{ loading ? t('downloading') : 'Download' }}
        </button>
      </div>

      <input ref="extraInput" type="file" accept="application/pdf" multiple class="hidden" @change="onExtraFiles" />

      <div id="pages-grid" class="flex flex-wrap gap-3">
        <div
          v-for="(item, i) in pages"
          :key="i"
          :data-id="i"
          v-show="!item.deleted"
          class="relative group cursor-grab rounded-xl overflow-hidden border border-base-content/10 bg-base-200/35 w-28"
        >
          <div class="h-36 flex items-center justify-center bg-base-200/50 overflow-hidden">
            <img
              :src="item.thumbnail"
              :style="{ transform: `rotate(${item.rotation}deg)` }"
              class="max-w-full max-h-full object-contain transition-transform"
              :alt="`Página ${i + 1}`"
            />
          </div>
          <div class="absolute top-1 right-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              class="bg-black/60 rounded-full p-0.5"
              :aria-label="t('expand')"
              @click="expand(i)"
            >
              <Icon name="heroicons:arrows-pointing-out-20-solid" class="w-3 h-3 text-white" />
            </button>
            <button
              type="button"
              class="bg-black/60 rounded-full p-0.5"
              :aria-label="t('rotate_left')"
              @click="rotate(i, 'left')"
            >
              <Icon name="heroicons:arrow-uturn-left-20-solid" class="w-3 h-3 text-white" />
            </button>
            <button
              type="button"
              class="bg-black/60 rounded-full p-0.5"
              :aria-label="t('rotate_right')"
              @click="rotate(i, 'right')"
            >
              <Icon name="heroicons:arrow-uturn-right-20-solid" class="w-3 h-3 text-white" />
            </button>
            <button
              type="button"
              class="bg-red-600/70 rounded-full p-0.5"
              :aria-label="t('remove')"
              @click="askDelete(i)"
            >
              <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white" />
            </button>
          </div>
          <div class="text-xs text-center text-base-content/40 py-1">{{ i + 1 }}</div>
        </div>
      </div>

      <p v-if="visibleCount > 1" class="text-xs text-base-content/40">{{ t('drag_hint') }}</p>
    </div>

    <!-- Delete confirmation modal -->
    <dialog ref="deleteModal" class="modal">
      <div class="modal-box">
        <p class="text-base-content">{{ t('question') }}</p>
        <div class="modal-action">
          <button type="button" class="btn btn-error btn-sm" @click="confirmDelete">{{ t('confirm') }}</button>
          <button type="button" class="btn btn-ghost btn-sm" @click="deleteModal?.close()">{{ t('cancel') }}</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>

    <!-- Expand modal -->
    <dialog ref="expandModal" class="modal">
      <div class="modal-box max-w-4xl w-full">
        <canvas id="view" class="max-w-full mx-auto block" />
        <div class="modal-action">
          <button type="button" class="btn btn-ghost btn-sm" @click="expandModal?.close()">{{ t('close') }}</button>
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
  title: "Editor de PDF"
  page_title: "Editor de PDF Online Grátis — Juntar, Excluir e Reorganizar"
  meta: "Editor de PDF online e gratuito: combine múltiplos arquivos, exclua páginas, rotacione e reordene. Processamento local, seus arquivos nunca saem do seu dispositivo."
  intro: "O Editor de PDF permite unir vários arquivos PDF em um único documento, excluir páginas desnecessárias, rotacionar páginas individualmente e reorganizá-las livremente. Todo o processamento acontece no próprio navegador, sem instalação e sem envio de arquivos para servidores, garantindo total privacidade."
  upload_hint: "Selecione um ou mais arquivos PDF para começar"
  click_upload: "Clique para fazer upload"
  or_drag: "ou arraste e solte"
  restart: "Recomeçar"
  add_pdf: "Adicionar PDF"
  downloading: "Baixando..."
  remove: "Remover página"
  rotate_left: "Girar para a esquerda"
  rotate_right: "Girar para a direita"
  expand: "Ampliar página"
  close: "Fechar"
  drag_hint: "Arraste as páginas para reordenar antes de baixar"
  question: "Tem certeza de que deseja excluir esta página?"
  confirm: "Excluir"
  cancel: "Cancelar"
  err: "Ocorreu um erro ao tentar abrir o arquivo"
  err_pass: "Arquivo PDF protegido por senha"
  features_title: "Recursos do Editor de PDF"
  feature_1: "Combine dois ou mais arquivos PDF em um único documento"
  feature_2: "Exclua páginas desnecessárias com um clique"
  feature_3: "Rotacione páginas individualmente para a esquerda ou direita"
  feature_4: "Reordene as páginas arrastando-as para a posição desejada"
  use_cases_title: "Quando Usar o Editor de PDF"
  use_cases_desc: "O editor de PDF online é ideal para quem precisa ajustar documentos digitais rapidamente, sem depender de softwares pagos ou instalação de programas."
  uc_1_title: "Juntar arquivos PDF"
  uc_1_desc: "Combine contratos, relatórios ou apresentações separados em um único PDF para facilitar o envio e o arquivamento."
  uc_2_title: "Limpar Documentos"
  uc_2_desc: "Remova páginas em branco, capas desnecessárias ou conteúdo confidencial antes de compartilhar um PDF."
  uc_3_title: "Corrigir Orientação"
  uc_3_desc: "Rotacione páginas digitalizadas que ficaram de cabeça para baixo ou na orientação errada, direto no navegador."
  uc_4_title: "Reorganizar Estrutura"
  uc_4_desc: "Reordene as páginas de um PDF para seguir a sequência correta, sem precisar reconstruir o documento do zero."
  how_to_title: "Como Usar o Editor de PDF"
  how_1_title: "Carregue seu PDF"
  how_1_desc: "Clique para fazer upload ou arraste e solte um ou mais arquivos PDF. Você pode adicionar mais PDFs depois para combiná-los em um só."
  how_2_title: "Edite as páginas"
  how_2_desc: "Rotacione, exclua ou reordene as páginas arrastando as miniaturas. Todas as alterações ficam visíveis antes de baixar."
  how_3_title: "Baixe o resultado"
  how_3_desc: "Clique em Download para salvar o PDF editado no seu dispositivo. O processamento é feito localmente no seu navegador, sem envio de dados."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Posso combinar vários PDFs em um só?"
  faq_1_a: "Sim. Basta carregar os arquivos PDF um a um (ou todos de uma vez). As páginas de todos os arquivos serão exibidas juntas e você poderá reordená-las antes de baixar."
  faq_2_q: "É possível excluir apenas algumas páginas?"
  faq_2_a: "Sim. Passe o mouse sobre qualquer miniatura e clique no ícone de excluir. A página será marcada como removida e não será incluída no PDF final."
  faq_3_q: "O editor suporta PDFs protegidos por senha?"
  faq_3_a: "Não. PDFs com proteção por senha não podem ser abertos pelo editor. Remova a senha do arquivo antes de tentar editá-lo."
  see1: "Imagem para PDF"
  see2: "Dividir PDF"
  see3: "Numerar PDF"
  see4: "PDF para Imagem"
en:
  title: "PDF Editor"
  page_title: "Free Online PDF Editor — Merge, Delete, and Reorder"
  meta: "Free online PDF editor: combine multiple files, delete pages, rotate, and reorder. Local processing, your files never leave your device."
  intro: "The PDF Editor lets you merge multiple PDF files into a single document, delete unnecessary pages, rotate individual pages, and reorder them freely. All processing happens in your browser, with no installation and no file uploads to servers, ensuring full privacy."
  upload_hint: "Select one or more PDF files to get started"
  click_upload: "Click to upload"
  or_drag: "or drag and drop"
  restart: "Start over"
  add_pdf: "Add PDF"
  downloading: "Downloading..."
  remove: "Remove page"
  rotate_left: "Rotate left"
  rotate_right: "Rotate right"
  expand: "Enlarge page"
  close: "Close"
  drag_hint: "Drag pages to reorder them before downloading"
  question: "Are you sure you want to delete this page?"
  confirm: "Delete"
  cancel: "Cancel"
  err: "An error occurred while trying to open the file"
  err_pass: "Password-protected PDF file"
  features_title: "PDF Editor Features"
  feature_1: "Combine two or more PDF files into a single document"
  feature_2: "Delete unnecessary pages with one click"
  feature_3: "Rotate individual pages left or right"
  feature_4: "Reorder pages by dragging them to the desired position"
  use_cases_title: "When to Use the PDF Editor"
  use_cases_desc: "The online PDF editor is ideal for anyone who needs to adjust digital documents quickly, without relying on paid software or installing programs."
  uc_1_title: "Merge PDF files"
  uc_1_desc: "Combine separate contracts, reports, or presentations into a single PDF to make sending and archiving easier."
  uc_2_title: "Clean Up Documents"
  uc_2_desc: "Remove blank pages, unnecessary covers, or confidential content before sharing a PDF."
  uc_3_title: "Fix Orientation"
  uc_3_desc: "Rotate scanned pages that ended up upside down or in the wrong orientation, directly in the browser."
  uc_4_title: "Reorganize Structure"
  uc_4_desc: "Reorder the pages of a PDF so they follow the correct sequence, without rebuilding the document from scratch."
  how_to_title: "How to Use the PDF Editor"
  how_1_title: "Upload your PDF"
  how_1_desc: "Click to upload or drag and drop one or more PDF files. You can add more PDFs later to combine them into one."
  how_2_title: "Edit the pages"
  how_2_desc: "Rotate, delete, or reorder pages by dragging the thumbnails. All changes are visible before downloading."
  how_3_title: "Download the result"
  how_3_desc: "Click Download to save the edited PDF to your device. Processing is done locally in your browser, with no data uploads."
  faq_title: "Questions and Answers"
  faq_1_q: "Can I combine multiple PDFs into one?"
  faq_1_a: "Yes. Just upload the PDF files one by one (or all at once). The pages from all files will be displayed together, and you can reorder them before downloading."
  faq_2_q: "Can I delete only some pages?"
  faq_2_a: "Yes. Hover over any thumbnail and click the delete icon. The page will be marked as removed and will not be included in the final PDF."
  faq_3_q: "Does the editor support password-protected PDFs?"
  faq_3_a: "No. Password-protected PDFs cannot be opened by the editor. Remove the password from the file before trying to edit it."
  see1: "Image to PDF"
  see2: "Split PDF"
  see3: "Numbering PDF"
  see4: "PDF to Image"
es:
  title: "Editor de PDF"
  page_title: "Editor de PDF Online Gratis - Unir, Eliminar y Reordenar"
  meta: "Editor de PDF online y gratuito: combina múltiples archivos, elimina páginas, rota y reordena. Procesamiento local, tus archivos nunca salen de tu dispositivo."
  intro: "El Editor de PDF te permite unir varios archivos PDF en un solo documento, eliminar páginas innecesarias, rotar páginas individualmente y reorganizarlas libremente. Todo el procesamiento ocurre en el propio navegador, sin instalación y sin enviar archivos a servidores, garantizando total privacidad."
  upload_hint: "Selecciona uno o más archivos PDF para empezar"
  click_upload: "Haz clic para subir"
  or_drag: "o arrastra y suelta"
  restart: "Empezar de nuevo"
  add_pdf: "Agregar PDF"
  downloading: "Descargando..."
  remove: "Eliminar página"
  rotate_left: "Girar a la izquierda"
  rotate_right: "Girar a la derecha"
  expand: "Ampliar página"
  close: "Cerrar"
  drag_hint: "Arrastra las páginas para reordenarlas antes de descargar"
  question: "¿Seguro que deseas eliminar esta página?"
  confirm: "Eliminar"
  cancel: "Cancelar"
  err: "Ocurrió un error al intentar abrir el archivo"
  err_pass: "Archivo PDF protegido con contraseña"
  features_title: "Funciones del Editor de PDF"
  feature_1: "Combina dos o más archivos PDF en un solo documento"
  feature_2: "Elimina páginas innecesarias con un clic"
  feature_3: "Rota páginas individualmente hacia la izquierda o la derecha"
  feature_4: "Reordena las páginas arrastrándolas a la posición deseada"
  use_cases_title: "Cuándo Usar el Editor de PDF"
  use_cases_desc: "El editor de PDF online es ideal para quienes necesitan ajustar documentos digitales rápidamente, sin depender de software de pago ni instalar programas."
  uc_1_title: "Unir archivos PDF"
  uc_1_desc: "Combina contratos, informes o presentaciones separados en un solo PDF para facilitar el envío y el archivado."
  uc_2_title: "Limpiar Documentos"
  uc_2_desc: "Elimina páginas en blanco, portadas innecesarias o contenido confidencial antes de compartir un PDF."
  uc_3_title: "Corregir Orientación"
  uc_3_desc: "Rota páginas escaneadas que quedaron boca abajo o con la orientación incorrecta, directamente en el navegador."
  uc_4_title: "Reorganizar Estructura"
  uc_4_desc: "Reordena las páginas de un PDF para que sigan la secuencia correcta, sin tener que reconstruir el documento desde cero."
  how_to_title: "Cómo Usar el Editor de PDF"
  how_1_title: "Carga tu PDF"
  how_1_desc: "Haz clic para subir o arrastra y suelta uno o más archivos PDF. Puedes agregar más PDFs después para combinarlos en uno solo."
  how_2_title: "Edita las páginas"
  how_2_desc: "Rota, elimina o reordena las páginas arrastrando las miniaturas. Todos los cambios quedan visibles antes de descargar."
  how_3_title: "Descarga el resultado"
  how_3_desc: "Haz clic en Download para guardar el PDF editado en tu dispositivo. El procesamiento se realiza localmente en tu navegador, sin enviar datos."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Puedo combinar varios PDFs en uno solo?"
  faq_1_a: "Sí. Solo tienes que cargar los archivos PDF uno por uno (o todos a la vez). Las páginas de todos los archivos se mostrarán juntas y podrás reordenarlas antes de descargar."
  faq_2_q: "¿Es posible eliminar solo algunas páginas?"
  faq_2_a: "Sí. Pasa el cursor sobre cualquier miniatura y haz clic en el icono de eliminar. La página se marcará como eliminada y no se incluirá en el PDF final."
  faq_3_q: "¿El editor admite PDFs protegidos con contraseña?"
  faq_3_a: "No. Los PDFs protegidos con contraseña no se pueden abrir en el editor. Quita la contraseña del archivo antes de intentar editarlo."
  see1: "Imagen a PDF"
  see2: "Dividir PDF"
  see3: "Numerar PDF"
  see4: "PDF a Imagen"
fr:
  title: "Éditeur de PDF"
  page_title: "Éditeur de PDF en Ligne Gratuit - Fusionner, Supprimer et Réorganiser"
  meta: "Éditeur de PDF en ligne gratuit : combinez plusieurs fichiers, supprimez des pages, faites-les pivoter et réorganisez-les. Traitement local, vos fichiers ne quittent jamais votre appareil."
  intro: "L'Éditeur de PDF vous permet de fusionner plusieurs fichiers PDF en un seul document, de supprimer les pages inutiles, de faire pivoter des pages individuellement et de les réorganiser librement. Tout le traitement se fait directement dans le navigateur, sans installation et sans envoi de fichiers vers des serveurs, pour garantir une confidentialité totale."
  upload_hint: "Sélectionnez un ou plusieurs fichiers PDF pour commencer"
  click_upload: "Cliquez pour téléverser"
  or_drag: "ou glissez-déposez"
  restart: "Recommencer"
  add_pdf: "Ajouter un PDF"
  downloading: "Téléchargement..."
  remove: "Supprimer la page"
  rotate_left: "Faire pivoter à gauche"
  rotate_right: "Faire pivoter à droite"
  expand: "Agrandir la page"
  close: "Fermer"
  drag_hint: "Faites glisser les pages pour les réorganiser avant de télécharger"
  question: "Voulez-vous vraiment supprimer cette page ?"
  confirm: "Supprimer"
  cancel: "Annuler"
  err: "Une erreur s'est produite lors de l'ouverture du fichier"
  err_pass: "Fichier PDF protégé par mot de passe"
  features_title: "Fonctionnalités de l'Éditeur de PDF"
  feature_1: "Combinez deux fichiers PDF ou plus en un seul document"
  feature_2: "Supprimez les pages inutiles en un clic"
  feature_3: "Faites pivoter des pages individuellement vers la gauche ou la droite"
  feature_4: "Réorganisez les pages en les faisant glisser à la position souhaitée"
  use_cases_title: "Quand Utiliser l'Éditeur de PDF"
  use_cases_desc: "L'éditeur de PDF en ligne est idéal pour celles et ceux qui doivent ajuster rapidement des documents numériques, sans dépendre de logiciels payants ni installer de programmes."
  uc_1_title: "Fusionner des fichiers PDF"
  uc_1_desc: "Combinez des contrats, rapports ou présentations séparés dans un seul PDF pour faciliter l'envoi et l'archivage."
  uc_2_title: "Nettoyer des Documents"
  uc_2_desc: "Supprimez les pages blanches, les couvertures inutiles ou le contenu confidentiel avant de partager un PDF."
  uc_3_title: "Corriger l'Orientation"
  uc_3_desc: "Faites pivoter les pages numérisées qui sont à l'envers ou dans la mauvaise orientation, directement dans le navigateur."
  uc_4_title: "Réorganiser la Structure"
  uc_4_desc: "Réorganisez les pages d'un PDF pour suivre la bonne séquence, sans avoir à reconstruire le document depuis zéro."
  how_to_title: "Comment Utiliser l'Éditeur de PDF"
  how_1_title: "Téléversez votre PDF"
  how_1_desc: "Cliquez pour téléverser ou glissez-déposez un ou plusieurs fichiers PDF. Vous pouvez ajouter d'autres PDF ensuite pour les combiner en un seul."
  how_2_title: "Modifiez les pages"
  how_2_desc: "Faites pivoter, supprimez ou réorganisez les pages en faisant glisser les miniatures. Toutes les modifications restent visibles avant le téléchargement."
  how_3_title: "Téléchargez le résultat"
  how_3_desc: "Cliquez sur Download pour enregistrer le PDF modifié sur votre appareil. Le traitement est effectué localement dans votre navigateur, sans envoi de données."
  faq_title: "Questions et Réponses"
  faq_1_q: "Puis-je combiner plusieurs PDF en un seul ?"
  faq_1_a: "Oui. Il suffit de téléverser les fichiers PDF un par un (ou tous à la fois). Les pages de tous les fichiers seront affichées ensemble et vous pourrez les réorganiser avant de télécharger."
  faq_2_q: "Est-il possible de supprimer seulement certaines pages ?"
  faq_2_a: "Oui. Passez le curseur sur n'importe quelle miniature et cliquez sur l'icône de suppression. La page sera marquée comme supprimée et ne sera pas incluse dans le PDF final."
  faq_3_q: "L'éditeur prend-il en charge les PDF protégés par mot de passe ?"
  faq_3_a: "Non. Les PDF protégés par mot de passe ne peuvent pas être ouverts par l'éditeur. Supprimez le mot de passe du fichier avant d'essayer de le modifier."
  see1: "Image en PDF"
  see2: "Diviser PDF"
  see3: "Numéroter PDF"
  see4: "PDF en Image"
it:
  title: "Editor PDF"
  page_title: "Editor PDF Online Gratis - Unisci, Elimina e Riordina"
  meta: "Editor PDF online gratuito: combina più file, elimina pagine, ruota e riordina. Elaborazione locale, i tuoi file non lasciano mai il tuo dispositivo."
  intro: "L'Editor PDF ti permette di unire più file PDF in un unico documento, eliminare pagine non necessarie, ruotare singole pagine e riorganizzarle liberamente. Tutta l'elaborazione avviene direttamente nel browser, senza installazione e senza inviare file ai server, garantendo la massima privacy."
  upload_hint: "Seleziona uno o più file PDF per iniziare"
  click_upload: "Fai clic per caricare"
  or_drag: "o trascina e rilascia"
  restart: "Ricomincia"
  add_pdf: "Aggiungi PDF"
  downloading: "Download in corso..."
  remove: "Rimuovi pagina"
  rotate_left: "Ruota a sinistra"
  rotate_right: "Ruota a destra"
  expand: "Ingrandisci pagina"
  close: "Chiudi"
  drag_hint: "Trascina le pagine per riordinarle prima di scaricare"
  question: "Sei sicuro di voler eliminare questa pagina?"
  confirm: "Elimina"
  cancel: "Annulla"
  err: "Si è verificato un errore durante l'apertura del file"
  err_pass: "File PDF protetto da password"
  features_title: "Funzioni dell'Editor PDF"
  feature_1: "Combina due o più file PDF in un unico documento"
  feature_2: "Elimina le pagine non necessarie con un clic"
  feature_3: "Ruota singole pagine a sinistra o a destra"
  feature_4: "Riordina le pagine trascinandole nella posizione desiderata"
  use_cases_title: "Quando Usare l'Editor PDF"
  use_cases_desc: "L'editor PDF online è ideale per chi deve modificare rapidamente documenti digitali, senza dipendere da software a pagamento o installare programmi."
  uc_1_title: "Unire file PDF"
  uc_1_desc: "Combina contratti, report o presentazioni separati in un unico PDF per semplificare l'invio e l'archiviazione."
  uc_2_title: "Pulire Documenti"
  uc_2_desc: "Rimuovi pagine bianche, copertine non necessarie o contenuti riservati prima di condividere un PDF."
  uc_3_title: "Correggere l'Orientamento"
  uc_3_desc: "Ruota le pagine scansionate rimaste capovolte o con orientamento errato, direttamente nel browser."
  uc_4_title: "Riorganizzare la Struttura"
  uc_4_desc: "Riordina le pagine di un PDF affinché seguano la sequenza corretta, senza dover ricostruire il documento da zero."
  how_to_title: "Come Usare l'Editor PDF"
  how_1_title: "Carica il tuo PDF"
  how_1_desc: "Fai clic per caricare oppure trascina e rilascia uno o più file PDF. Puoi aggiungere altri PDF in seguito per combinarli in uno solo."
  how_2_title: "Modifica le pagine"
  how_2_desc: "Ruota, elimina o riordina le pagine trascinando le miniature. Tutte le modifiche sono visibili prima del download."
  how_3_title: "Scarica il risultato"
  how_3_desc: "Fai clic su Download per salvare il PDF modificato sul tuo dispositivo. L'elaborazione viene eseguita localmente nel browser, senza invio di dati."
  faq_title: "Domande e Risposte"
  faq_1_q: "Posso combinare più PDF in uno solo?"
  faq_1_a: "Sì. Basta caricare i file PDF uno alla volta (o tutti insieme). Le pagine di tutti i file verranno mostrate insieme e potrai riordinarle prima di scaricare."
  faq_2_q: "È possibile eliminare solo alcune pagine?"
  faq_2_a: "Sì. Passa il cursore su qualsiasi miniatura e fai clic sull'icona di eliminazione. La pagina verrà contrassegnata come rimossa e non sarà inclusa nel PDF finale."
  faq_3_q: "L'editor supporta PDF protetti da password?"
  faq_3_a: "No. I PDF protetti da password non possono essere aperti dall'editor. Rimuovi la password dal file prima di provare a modificarlo."
  see1: "Immagine in PDF"
  see2: "Dividere PDF"
  see3: "Numerare PDF"
  see4: "PDF in Immagine"
id:
  title: "Editor PDF"
  page_title: "Editor PDF Online Gratis - Gabungkan, Hapus, dan Susun Ulang"
  meta: "Editor PDF online gratis: gabungkan beberapa file, hapus halaman, putar, dan susun ulang. Pemrosesan lokal, file Anda tidak pernah keluar dari perangkat Anda."
  intro: "Editor PDF memungkinkan Anda menggabungkan beberapa file PDF menjadi satu dokumen, menghapus halaman yang tidak diperlukan, memutar halaman satu per satu, dan menyusunnya ulang dengan bebas. Semua pemrosesan berlangsung langsung di browser, tanpa instalasi dan tanpa mengirim file ke server, sehingga privasi tetap terjaga."
  upload_hint: "Pilih satu atau beberapa file PDF untuk memulai"
  click_upload: "Klik untuk mengunggah"
  or_drag: "atau seret dan lepas"
  restart: "Mulai ulang"
  add_pdf: "Tambahkan PDF"
  downloading: "Mengunduh..."
  remove: "Hapus halaman"
  rotate_left: "Putar ke kiri"
  rotate_right: "Putar ke kanan"
  expand: "Perbesar halaman"
  close: "Tutup"
  drag_hint: "Seret halaman untuk menyusun ulang sebelum mengunduh"
  question: "Apakah Anda yakin ingin menghapus halaman ini?"
  confirm: "Hapus"
  cancel: "Batal"
  err: "Terjadi kesalahan saat mencoba membuka file"
  err_pass: "File PDF dilindungi kata sandi"
  features_title: "Fitur Editor PDF"
  feature_1: "Gabungkan dua atau lebih file PDF menjadi satu dokumen"
  feature_2: "Hapus halaman yang tidak diperlukan dengan satu klik"
  feature_3: "Putar halaman satu per satu ke kiri atau ke kanan"
  feature_4: "Susun ulang halaman dengan menyeretnya ke posisi yang diinginkan"
  use_cases_title: "Kapan Menggunakan Editor PDF"
  use_cases_desc: "Editor PDF online ideal untuk siapa pun yang perlu menyesuaikan dokumen digital dengan cepat, tanpa bergantung pada software berbayar atau menginstal program."
  uc_1_title: "Gabungkan file PDF"
  uc_1_desc: "Gabungkan kontrak, laporan, atau presentasi terpisah menjadi satu PDF agar lebih mudah dikirim dan diarsipkan."
  uc_2_title: "Bersihkan Dokumen"
  uc_2_desc: "Hapus halaman kosong, sampul yang tidak diperlukan, atau konten rahasia sebelum membagikan PDF."
  uc_3_title: "Perbaiki Orientasi"
  uc_3_desc: "Putar halaman hasil pemindaian yang terbalik atau memiliki orientasi salah, langsung di browser."
  uc_4_title: "Susun Ulang Struktur"
  uc_4_desc: "Susun ulang halaman PDF agar mengikuti urutan yang benar, tanpa perlu membuat ulang dokumen dari awal."
  how_to_title: "Cara Menggunakan Editor PDF"
  how_1_title: "Unggah PDF Anda"
  how_1_desc: "Klik untuk mengunggah atau seret dan lepas satu atau beberapa file PDF. Anda dapat menambahkan PDF lain nanti untuk menggabungkannya menjadi satu."
  how_2_title: "Edit halaman"
  how_2_desc: "Putar, hapus, atau susun ulang halaman dengan menyeret thumbnail. Semua perubahan terlihat sebelum diunduh."
  how_3_title: "Unduh hasilnya"
  how_3_desc: "Klik Download untuk menyimpan PDF yang telah diedit ke perangkat Anda. Pemrosesan dilakukan secara lokal di browser Anda, tanpa mengirim data."
  faq_title: "Pertanyaan dan Jawaban"
  faq_1_q: "Bisakah saya menggabungkan beberapa PDF menjadi satu?"
  faq_1_a: "Ya. Cukup unggah file PDF satu per satu (atau semuanya sekaligus). Halaman dari semua file akan ditampilkan bersama dan Anda dapat menyusunnya ulang sebelum mengunduh."
  faq_2_q: "Apakah mungkin menghapus hanya beberapa halaman?"
  faq_2_a: "Ya. Arahkan kursor ke thumbnail mana pun lalu klik ikon hapus. Halaman akan ditandai sebagai dihapus dan tidak akan disertakan dalam PDF akhir."
  faq_3_q: "Apakah editor mendukung PDF yang dilindungi kata sandi?"
  faq_3_a: "Tidak. PDF yang dilindungi kata sandi tidak dapat dibuka oleh editor. Hapus kata sandi dari file sebelum mencoba mengeditnya."
  see1: "Gambar ke PDF"
  see2: "Bagi PDF"
  see3: "Beri Nomor PDF"
  see4: "PDF ke Gambar"
de:
  title: "PDF-Editor"
  page_title: "Kostenloser Online-PDF-Editor - Zusammenführen, Löschen und Neuordnen"
  meta: "Kostenloser Online-PDF-Editor: Führen Sie mehrere Dateien zusammen, löschen Sie Seiten, drehen Sie sie und ordnen Sie sie neu an. Lokale Verarbeitung, Ihre Dateien verlassen nie Ihr Gerät."
  intro: "Mit dem PDF-Editor können Sie mehrere PDF-Dateien zu einem einzigen Dokument zusammenführen, unnötige Seiten löschen, einzelne Seiten drehen und frei neu anordnen. Die gesamte Verarbeitung erfolgt direkt im Browser, ohne Installation und ohne Dateien an Server zu senden, sodass Ihre Privatsphäre vollständig geschützt bleibt."
  upload_hint: "Wählen Sie eine oder mehrere PDF-Dateien aus, um zu beginnen"
  click_upload: "Klicken Sie zum Hochladen"
  or_drag: "oder ziehen und ablegen"
  restart: "Neu beginnen"
  add_pdf: "PDF hinzufügen"
  downloading: "Wird heruntergeladen..."
  remove: "Seite entfernen"
  rotate_left: "Nach links drehen"
  rotate_right: "Nach rechts drehen"
  expand: "Seite vergrößern"
  close: "Schließen"
  drag_hint: "Ziehen Sie die Seiten, um sie vor dem Herunterladen neu anzuordnen"
  question: "Sind Sie sicher, dass Sie diese Seite löschen möchten?"
  confirm: "Löschen"
  cancel: "Abbrechen"
  err: "Beim Öffnen der Datei ist ein Fehler aufgetreten"
  err_pass: "Passwortgeschützte PDF-Datei"
  features_title: "Funktionen des PDF-Editors"
  feature_1: "Führen Sie zwei oder mehr PDF-Dateien zu einem einzigen Dokument zusammen"
  feature_2: "Löschen Sie unnötige Seiten mit einem Klick"
  feature_3: "Drehen Sie einzelne Seiten nach links oder rechts"
  feature_4: "Ordnen Sie Seiten neu an, indem Sie sie an die gewünschte Position ziehen"
  use_cases_title: "Wann Sie den PDF-Editor verwenden sollten"
  use_cases_desc: "Der Online-PDF-Editor ist ideal für alle, die digitale Dokumente schnell anpassen müssen, ohne auf kostenpflichtige Software angewiesen zu sein oder Programme installieren zu müssen."
  uc_1_title: "PDF-Dateien zusammenführen"
  uc_1_desc: "Führen Sie separate Verträge, Berichte oder Präsentationen in einer einzigen PDF-Datei zusammen, um Versand und Archivierung zu erleichtern."
  uc_2_title: "Dokumente bereinigen"
  uc_2_desc: "Entfernen Sie leere Seiten, unnötige Deckblätter oder vertrauliche Inhalte, bevor Sie eine PDF-Datei teilen."
  uc_3_title: "Ausrichtung korrigieren"
  uc_3_desc: "Drehen Sie gescannte Seiten, die auf dem Kopf stehen oder falsch ausgerichtet sind, direkt im Browser."
  uc_4_title: "Struktur neu anordnen"
  uc_4_desc: "Ordnen Sie die Seiten einer PDF-Datei neu an, damit sie der richtigen Reihenfolge folgen, ohne das Dokument von Grund auf neu erstellen zu müssen."
  how_to_title: "So verwenden Sie den PDF-Editor"
  how_1_title: "Laden Sie Ihre PDF-Datei hoch"
  how_1_desc: "Klicken Sie zum Hochladen oder ziehen Sie eine oder mehrere PDF-Dateien per Drag-and-drop hinein. Sie können später weitere PDFs hinzufügen, um sie zu einer Datei zusammenzuführen."
  how_2_title: "Bearbeiten Sie die Seiten"
  how_2_desc: "Drehen, löschen oder ordnen Sie Seiten neu an, indem Sie die Miniaturansichten ziehen. Alle Änderungen sind vor dem Herunterladen sichtbar."
  how_3_title: "Laden Sie das Ergebnis herunter"
  how_3_desc: "Klicken Sie auf Download, um die bearbeitete PDF-Datei auf Ihrem Gerät zu speichern. Die Verarbeitung erfolgt lokal in Ihrem Browser, ohne Datenübertragung."
  faq_title: "Fragen und Antworten"
  faq_1_q: "Kann ich mehrere PDFs zu einer Datei zusammenführen?"
  faq_1_a: "Ja. Laden Sie die PDF-Dateien einfach nacheinander oder alle auf einmal hoch. Die Seiten aller Dateien werden gemeinsam angezeigt und können vor dem Herunterladen neu angeordnet werden."
  faq_2_q: "Kann ich nur bestimmte Seiten löschen?"
  faq_2_a: "Ja. Bewegen Sie den Mauszeiger über eine Miniaturansicht und klicken Sie auf das Löschsymbol. Die Seite wird als entfernt markiert und nicht in die endgültige PDF-Datei aufgenommen."
  faq_3_q: "Unterstützt der Editor passwortgeschützte PDFs?"
  faq_3_a: "Nein. Passwortgeschützte PDFs können vom Editor nicht geöffnet werden. Entfernen Sie das Passwort aus der Datei, bevor Sie versuchen, sie zu bearbeiten."
  see1: "Bild zu PDF"
  see2: "PDF teilen"
  see3: "PDF nummerieren"
  see4: "PDF zu Bild"
nl:
  title: "PDF-editor"
  page_title: "Gratis Online PDF-editor - Samenvoegen, Verwijderen en Herschikken"
  meta: "Gratis online PDF-editor: combineer meerdere bestanden, verwijder pagina's, roteer en herschik. Lokale verwerking, uw bestanden verlaten nooit uw apparaat."
  intro: "Met de PDF-editor kunt u meerdere PDF-bestanden samenvoegen tot één document, onnodige pagina's verwijderen, afzonderlijke pagina's roteren en ze vrij herschikken. Alle verwerking gebeurt rechtstreeks in de browser, zonder installatie en zonder bestanden naar servers te verzenden, zodat uw privacy volledig behouden blijft."
  upload_hint: "Selecteer een of meer PDF-bestanden om te beginnen"
  click_upload: "Klik om te uploaden"
  or_drag: "of sleep en zet neer"
  restart: "Opnieuw beginnen"
  add_pdf: "PDF toevoegen"
  downloading: "Bezig met downloaden..."
  remove: "Pagina verwijderen"
  rotate_left: "Naar links draaien"
  rotate_right: "Naar rechts draaien"
  expand: "Pagina vergroten"
  close: "Sluiten"
  drag_hint: "Sleep pagina's om ze te herschikken voordat u downloadt"
  question: "Weet u zeker dat u deze pagina wilt verwijderen?"
  confirm: "Verwijderen"
  cancel: "Annuleren"
  err: "Er is een fout opgetreden bij het openen van het bestand"
  err_pass: "PDF-bestand beveiligd met wachtwoord"
  features_title: "Functies van de PDF-editor"
  feature_1: "Combineer twee of meer PDF-bestanden tot één document"
  feature_2: "Verwijder onnodige pagina's met één klik"
  feature_3: "Roteer afzonderlijke pagina's naar links of rechts"
  feature_4: "Herschik pagina's door ze naar de gewenste positie te slepen"
  use_cases_title: "Wanneer u de PDF-editor gebruikt"
  use_cases_desc: "De online PDF-editor is ideaal voor iedereen die digitale documenten snel moet aanpassen, zonder afhankelijk te zijn van betaalde software of programma's te installeren."
  uc_1_title: "PDF-bestanden samenvoegen"
  uc_1_desc: "Combineer afzonderlijke contracten, rapporten of presentaties in één PDF om verzenden en archiveren eenvoudiger te maken."
  uc_2_title: "Documenten opschonen"
  uc_2_desc: "Verwijder lege pagina's, onnodige omslagen of vertrouwelijke inhoud voordat u een PDF deelt."
  uc_3_title: "Oriëntatie corrigeren"
  uc_3_desc: "Roteer gescande pagina's die ondersteboven staan of verkeerd georiënteerd zijn, rechtstreeks in de browser."
  uc_4_title: "Structuur herschikken"
  uc_4_desc: "Herschik de pagina's van een PDF zodat ze de juiste volgorde volgen, zonder het document helemaal opnieuw op te bouwen."
  how_to_title: "Hoe u de PDF-editor gebruikt"
  how_1_title: "Upload uw PDF"
  how_1_desc: "Klik om te uploaden of sleep een of meer PDF-bestanden naar het uploadvak. U kunt later meer PDF's toevoegen om ze tot één bestand te combineren."
  how_2_title: "Bewerk de pagina's"
  how_2_desc: "Roteer, verwijder of herschik pagina's door de miniaturen te slepen. Alle wijzigingen zijn zichtbaar voordat u downloadt."
  how_3_title: "Download het resultaat"
  how_3_desc: "Klik op Download om de bewerkte PDF op uw apparaat op te slaan. De verwerking gebeurt lokaal in uw browser, zonder gegevens te verzenden."
  faq_title: "Vragen en Antwoorden"
  faq_1_q: "Kan ik meerdere PDF's samenvoegen tot één bestand?"
  faq_1_a: "Ja. Upload de PDF-bestanden één voor één of allemaal tegelijk. De pagina's van alle bestanden worden samen weergegeven en u kunt ze herschikken voordat u downloadt."
  faq_2_q: "Kan ik slechts enkele pagina's verwijderen?"
  faq_2_a: "Ja. Beweeg de muis over een miniatuur en klik op het verwijderpictogram. De pagina wordt gemarkeerd als verwijderd en wordt niet opgenomen in de uiteindelijke PDF."
  faq_3_q: "Ondersteunt de editor PDF's die met een wachtwoord zijn beveiligd?"
  faq_3_a: "Nee. PDF's die met een wachtwoord zijn beveiligd, kunnen niet door de editor worden geopend. Verwijder het wachtwoord uit het bestand voordat u het probeert te bewerken."
  see1: "Afbeelding naar PDF"
  see2: "PDF splitsen"
  see3: "PDF nummeren"
  see4: "PDF naar afbeelding"
</i18n>
