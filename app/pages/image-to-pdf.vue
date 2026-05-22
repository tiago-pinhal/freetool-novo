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
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="items.length > 0"
    :see-also-links="[
      { label: t('see1'), to: 'image-resizer' },
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
</i18n>
