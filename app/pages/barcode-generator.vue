<script setup lang="ts">
type BarcodeOptions = {
  format: string
  displayValue: boolean
  width: number
  height: number
  font: string
  fontOptions: string
  textPosition: string
  textAlign: string
  textMargin: number
  fontSize: number
  background: string
  lineColor: string
  margin: number
}

type JsBarcodeFunction = (element: string | HTMLElement | SVGElement, text: string, options: BarcodeOptions) => void

declare global {
  interface Window {
    JsBarcode?: JsBarcodeFunction
  }
}

const { t } = useI18n({ useScope: 'local' })

const formats = [
  'CODE128',
  'CODE128A',
  'CODE128B',
  'CODE128C',
  'EAN2',
  'EAN5',
  'EAN8',
  'EAN13',
  'UPC',
  'UPCE',
  'CODE39',
  'CODE93',
  'ITF',
  'ITF14',
  'MSI',
  'MSI10',
  'MSI11',
  'MSI1010',
  'MSI1110',
  'pharmacode',
  'codabar'
]

const fonts = [
  'Arial',
  'Calibri',
  'Courier New',
  'Cursive',
  'Helvetica',
  'Lucida Sans',
  'Monospace',
  'Palatino',
  'Sans-serif',
  'Serif'
]

const text = ref('123456')
const barcodeRef = ref<HTMLImageElement | null>(null)
const barcodeLoaded = ref(false)
const error = ref<unknown>(null)
const downloadFeedback = ref('')

const state = reactive<BarcodeOptions>({
  format: 'CODE128',
  displayValue: true,
  width: 2,
  height: 100,
  font: 'monospace',
  fontOptions: '',
  textPosition: 'bottom',
  textAlign: 'center',
  textMargin: 2,
  fontSize: 20,
  background: '#ffffff',
  lineColor: '#111827',
  margin: 10
})

const faqItems = computed(() => [
  { question: t('faq_1_q'), answer: t('faq_1_a') },
  { question: t('faq_2_q'), answer: t('faq_2_a') },
  { question: t('faq_3_q'), answer: t('faq_3_a') }
])

const hasCustomData = computed(() => {
  return text.value.trim() !== '' && text.value.trim() !== '123456'
})

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  howToName: t('how_to_title'),
  howToSteps: [
    { name: t('how_1_title'), text: t('how_1_desc') },
    { name: t('how_2_title'), text: t('how_2_desc') },
    { name: t('how_3_title'), text: t('how_3_desc') }
  ],
  faq: faqItems.value
})

useHead({
  title: t('page_title'),
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:title', content: t('og_title') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: t('og_title') },
    { name: 'twitter:description', content: t('meta') }
  ]
})

watch(text, () => {
  if (barcodeLoaded.value) generate()
})

watch(state, () => {
  if (barcodeLoaded.value) generate()
}, { deep: true })

const { onLoaded } = useScript('https://cdn.jsdelivr.net/npm/jsbarcode@3.12.3/dist/JsBarcode.all.min.js', {
  trigger: 'client'
})

onLoaded(() => {
  barcodeLoaded.value = true
  generate()
})

onMounted(() => {
  if (window.JsBarcode) {
    barcodeLoaded.value = true
    generate()
  }
})

function generate() {
  if (!window.JsBarcode || !barcodeRef.value) return

  try {
    error.value = null
    window.JsBarcode(barcodeRef.value, getBarcodeText(), {
      ...state,
      width: clampNumber(state.width, 1, 4, 2),
      height: clampNumber(state.height, 10, 150, 100),
      textMargin: clampNumber(state.textMargin, 0, 25, 2),
      fontSize: clampNumber(state.fontSize, 1, 40, 20),
      margin: clampNumber(state.margin, 0, 60, 10)
    })
  } catch (ex) {
    error.value = ex
  }
}

function getBarcodeText() {
  return text.value.trim() || 'Freetool'
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function download() {
  if (!barcodeRef.value?.src || error.value) return

  const link = document.createElement('a')
  link.href = barcodeRef.value.src
  link.download = `${t('filename')}.png`
  link.click()

  downloadFeedback.value = t('download_success')
  window.setTimeout(() => {
    downloadFeedback.value = ''
  }, 2000)
}

defineI18nRoute({
  paths: {
    en: '/barcode-generator',
    pt: '/gerador-de-codigo-de-barras',
    es: '/generador-de-codigos-de-barras',
    fr: '/generateur-de-codes-barres',
    it: '/generatore-di-codici-a-barre',
    id: '/generator-barcode',
    de: '/barcode-generator',
    nl: '/barcode-generator'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="hasCustomData"
    :see-also-links="[
      { label: t('see1'), to: 'emoji-picker' },
      { label: t('see2'), to: 'qrcode-generator' },
      { label: t('see3'), to: 'random-colors' },
      { label: t('see4'), to: 'dominant-colors-of-the-image' }
    ]"
  >
    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div class="space-y-4">
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4">
          <h2 class="mb-4 text-lg font-bold text-base-content">{{ t('data') }}</h2>

          <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
            <label class="form-control">
              <span class="label-text mb-2 font-semibold">{{ t('text') }}</span>
              <input
                v-model="text"
                type="text"
                class="input input-bordered bg-base-100"
                :placeholder="t('text_placeholder')"
                autofocus
                autocomplete="off"
                spellcheck="false"
              />
            </label>

            <label class="form-control">
              <span class="label-text mb-2 font-semibold">{{ t('format') }}</span>
              <select v-model="state.format" class="select select-bordered bg-base-100">
                <option v-for="format in formats" :key="format" :value="format">
                  {{ format.toUpperCase() }}
                </option>
              </select>
            </label>
          </div>
        </section>

        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4">
          <h2 class="mb-4 text-lg font-bold text-base-content">{{ t('dimensions') }}</h2>

          <div class="grid gap-5 sm:grid-cols-2">
            <label class="form-control">
              <span class="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
                {{ t('height') }}
                <span class="badge badge-outline">{{ state.height }}</span>
              </span>
              <input v-model.number="state.height" type="range" min="10" max="150" class="range range-primary" />
            </label>

            <label class="form-control">
              <span class="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
                {{ t('width') }}
                <span class="badge badge-outline">{{ state.width }}</span>
              </span>
              <input v-model.number="state.width" type="range" min="1" max="4" step="0.1" class="range range-primary" />
            </label>

            <label class="form-control">
              <span class="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
                {{ t('text_margin') }}
                <span class="badge badge-outline">{{ state.textMargin }}</span>
              </span>
              <input v-model.number="state.textMargin" type="range" min="0" max="25" class="range range-primary" />
            </label>

            <label class="form-control">
              <span class="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
                {{ t('margin') }}
                <span class="badge badge-outline">{{ state.margin }}</span>
              </span>
              <input v-model.number="state.margin" type="range" min="0" max="60" class="range range-primary" />
            </label>
          </div>
        </section>

        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4">
          <h2 class="mb-4 text-lg font-bold text-base-content">{{ t('styles') }}</h2>

          <div class="grid gap-4">
            <label class="label cursor-pointer justify-start gap-3 rounded-2xl bg-base-100 px-4">
              <input v-model="state.displayValue" type="checkbox" class="toggle toggle-primary" />
              <span class="label-text font-semibold">{{ t('display') }}</span>
            </label>

            <div v-if="state.displayValue" class="grid gap-4 sm:grid-cols-2">
              <label class="form-control">
                <span class="label-text mb-2 font-semibold">{{ t('font') }}</span>
                <select v-model="state.font" class="select select-bordered bg-base-100">
                  <option v-for="font in fonts" :key="font" :value="font.toLowerCase()">
                    {{ font }}
                  </option>
                </select>
              </label>

              <label class="form-control">
                <span class="label-text mb-2 font-semibold">{{ t('font_options') }}</span>
                <select v-model="state.fontOptions" class="select select-bordered bg-base-100">
                  <option value="">{{ t('normal') }}</option>
                  <option value="bold">{{ t('bold') }}</option>
                  <option value="italic">{{ t('italic') }}</option>
                  <option value="bold italic">{{ t('bold_italic') }}</option>
                </select>
              </label>

              <label class="form-control">
                <span class="label-text mb-2 font-semibold">{{ t('text_position') }}</span>
                <select v-model="state.textPosition" class="select select-bordered bg-base-100">
                  <option value="bottom">{{ t('bottom') }}</option>
                  <option value="top">{{ t('top') }}</option>
                </select>
              </label>

              <label class="form-control">
                <span class="label-text mb-2 font-semibold">{{ t('text_align') }}</span>
                <select v-model="state.textAlign" class="select select-bordered bg-base-100">
                  <option value="left">{{ t('left') }}</option>
                  <option value="center">{{ t('center') }}</option>
                  <option value="right">{{ t('right') }}</option>
                </select>
              </label>

              <label class="form-control sm:col-span-2">
                <span class="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
                  {{ t('font_size') }}
                  <span class="badge badge-outline">{{ state.fontSize }}</span>
                </span>
                <input v-model.number="state.fontSize" type="range" min="1" max="40" class="range range-primary w-full" />
              </label>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4">
          <h2 class="mb-4 text-lg font-bold text-base-content">{{ t('colors') }}</h2>

          <div class="grid gap-3 sm:grid-cols-2">
            <label class="barcode-color-control">
              <span>{{ t('background') }}</span>
              <input v-model="state.background" type="color" />
            </label>

            <label class="barcode-color-control">
              <span>{{ t('line_color') }}</span>
              <input v-model="state.lineColor" type="color" />
            </label>
          </div>
        </section>
      </div>

      <aside class="lg:sticky lg:top-6 lg:self-start">
        <div class="rounded-2xl border border-primary/20 bg-base-100 p-4 shadow-sm">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold">{{ t('preview') }}</h2>
            <span class="badge badge-outline">{{ state.format.toUpperCase() }}</span>
          </div>

          <div class="flex min-h-[220px] items-center justify-center overflow-x-auto rounded-2xl bg-base-200/50 p-4">
            <img
              v-show="!error"
              ref="barcodeRef"
              class="max-w-none rounded-lg border border-base-content/10 bg-white p-2"
              :alt="t('preview_alt')"
            />
            <div v-if="error" class="rounded-2xl border border-error/30 bg-error/10 p-4 text-sm text-error">
              "{{ getBarcodeText() }}" {{ t('error') }}.
            </div>
          </div>

          <button type="button" class="btn btn-primary mt-4 w-full" :disabled="!barcodeLoaded || Boolean(error)" @click="download">
            <Icon name="heroicons:arrow-down-tray-20-solid" class="h-5 w-5" aria-hidden="true" />
            Download PNG
          </button>

          <p class="mt-3 text-sm text-base-content/70">{{ t('scan_tip') }}</p>
          <div role="status" aria-live="polite" class="sr-only">{{ downloadFeedback }}</div>
        </div>
      </aside>
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
            { title: t('uc_4_title'), description: t('uc_4_desc') }
          ]"
        />

        <section>
          <h2 class="mb-3 text-2xl font-bold text-base-content flex items-center gap-2">
            <Icon name="material-symbols:barcode" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('types_title') }}
          </h2>
          <p class="mb-4 text-base-content/80 leading-relaxed">{{ t('types_desc') }}</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <p v-for="key in ['type_code128', 'type_ean', 'type_upc', 'type_code39', 'type_itf', 'type_msi', 'type_pharma', 'type_codabar']" :key="key" class="rounded-2xl border border-base-content/10 bg-base-200/40 p-4">
              {{ t(key) }}
            </p>
          </div>
        </section>

        <HowToSection
          :title="t('how_to_title')"
          :items="[
            { title: t('how_1_title'), description: t('how_1_desc') },
            { title: t('how_2_title'), description: t('how_2_desc') },
            { title: t('how_3_title'), description: t('how_3_desc') }
          ]"
        />

        <FaqSection :title="t('faq_title')" :items="faqItems" />
      </div>
    </template>
  </ToolPage>
</template>

<style scoped>
.barcode-color-control {
  display: flex;
  min-height: 3.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid color-mix(in oklab, currentColor 12%, transparent);
  border-radius: 1rem;
  background: color-mix(in oklab, currentColor 4%, transparent);
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.barcode-color-control input {
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  cursor: pointer;
  border: 0;
  border-radius: 999px;
  background: transparent;
  padding: 0;
}
</style>

<i18n lang="yaml">
{
  en: {
    title: "Barcode Generator",
    page_title: "Barcode Generator - Create Free Barcodes Online",
    meta: "Free online barcode generator. Create labels in CODE128, EAN-13, UPC, CODE39 and more. Customize and download as PNG image without registration.",
    og_title: "Free Online Barcode Generator",
    intro: "Generate professional barcodes ready for printing, with instant local processing. Ideal for product labels, inventory control and logistics, with real-time preview and format validation.",

    data: "Barcode Data",
    text: "Code",
    text_placeholder: "Enter the barcode value",
    format: "Format",
    dimensions: "Dimensions",
    width: "Bar width",
    height: "Height",
    margin: "Outer margin",
    text_margin: "Text margin",
    styles: "Text & Style",
    display: "Display value below or above the code",
    font: "Font",
    font_options: "Font style",
    normal: "Normal",
    bold: "Bold",
    italic: "Italic",
    bold_italic: "Bold Italic",
    font_size: "Font size",
    text_position: "Text position",
    bottom: "Bottom",
    top: "Top",
    text_align: "Alignment",
    left: "Left",
    center: "Center",
    right: "Right",
    colors: "Colors",
    background: "Background color",
    line_color: "Bar color",
    preview: "Preview",
    preview_alt: "Preview of the generated barcode",
    scan_tip: "Tip: use high contrast between bars and background and test reading before printing labels in batch.",
    error: "is not a valid input for this barcode format",
    filename: "My Barcode",
    download_success: "Barcode downloaded successfully.",

    features_title: "Barcode generator features",
    feature_1: "Support for CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode and Codabar.",
    feature_2: "Adjust height, bar width, margins, font, size and text position.",
    feature_3: "Bar and background color customization with real-time preview.",
    feature_4: "High-resolution PNG download, ready for crisp printing on labels, packaging and documents.",

    use_cases_title: "Where to use barcodes",
    use_cases_desc: "Barcodes are useful when you need to identify items quickly, in a standardized way and compatible with common readers.",
    uc_1_title: "Products and retail",
    uc_1_desc: "Create codes for labels, packaging and system registration tests. For commercial products, confirm the standard required by your marketplace.",
    uc_2_title: "Stock and inventory",
    uc_2_desc: "Use CODE128, CODE39, ITF or MSI to identify shelves, assets, parts, boxes and internal movements.",
    uc_3_title: "Tickets, labels and events",
    uc_3_desc: "Generate codes for credentials, vouchers, wristbands, shipping labels and entry check-in.",
    uc_4_title: "Logistics and shipping",
    uc_4_desc: "Use formats like ITF-14 and CODE128 on boxes, volumes and sorting, tracking and shipping processes.",

    how_to_title: "How to create a barcode",
    how_1_title: "Enter the value",
    how_1_desc: "Insert the number or text to be encoded. Each format accepts a specific set of characters and sizes.",
    how_2_title: "Choose the format",
    how_2_desc: "Select the format according to your application.",
    how_3_title: "Customize and Download",
    how_3_desc: "Adjust colors and sizes as needed. Once ready, download the high-resolution PNG image.",

    types_title: "Available Barcode types",
    types_desc: "Each format serves a different purpose in industry and retail.",
    type_code128: "CODE128 and variants A, B and C: compact and versatile format for text, numbers, internal labels and logistics.",
    type_ean: "EAN-13 and EAN-8: the international standard for retail products found in supermarkets.",
    type_upc: "UPC-A: common standard in North America for consumer products.",
    type_code39: "CODE39: widely used in industry and government for alphanumeric data.",
    type_itf: "ITF (Interleaved 2 of 5): common for numbering boxes and packages in logistics.",
    type_msi: "MSI: mostly used for labeling shelves and inventory in retail.",
    type_pharma: "Pharmacode: used in the pharmaceutical industry for packaging control.",
    type_codabar: "Codabar: used in blood banks, libraries and some shipping forms.",

    faq_title: "Frequently Asked Questions",
    faq_1_q: "Why is the barcode not generating?",
    faq_1_a: "Check if the input value is compatible with the chosen format. EAN and UPC require only numbers, for example.",
    faq_2_q: "Can I print the generated barcode?",
    faq_2_a: "Yes. Download the high-quality PNG image and print it. We recommend testing the reading with a scanner before printing in large quantities.",
    faq_3_q: "What is the difference between CODE128 A, B and C?",
    faq_3_a: "They are sub-types that optimize the data encoding: 'A' for uppercase and control chars, 'B' for lowercase and numbers, and 'C' for numeric-only pairs (very compact).",

    see1: "Emoji Picker",
    see2: "QR Code Generator",
    see3: "Random Colors",
    see4: "Dominant Colors of the Image"
  },
  pt: {
    title: "Gerador de Código de Barras",
    page_title: "Gerador de Código de Barras - Criar Códigos Online Grátis",
    meta: "Gerador de código de barras online grátis. Crie etiquetas em CODE128, EAN-13, UPC, CODE39 e mais. Personalize e baixe em Imagem PNG.",
    og_title: "Gerador de Código de Barras Online e Grátis",
    intro: "Gere códigos de barras profissionais prontos para impressão, com processamento local e instantâneo. Ideal para etiquetas de produtos, controle de estoque e logística, com visualização em tempo real e validação de formatos.",

    data: "Dados do código",
    text: "Código",
    text_placeholder: "Digite o valor do código de barras",
    format: "Formato",
    dimensions: "Medidas",
    width: "Largura das barras",
    height: "Altura",
    margin: "Margem externa",
    text_margin: "Margem do texto",
    styles: "Texto e estilo",
    display: "Exibir valor abaixo ou acima do código",
    font: "Fonte",
    font_options: "Estilo da fonte",
    normal: "Normal",
    bold: "Negrito",
    italic: "Itálico",
    bold_italic: "Negrito e itálico",
    font_size: "Tamanho do texto",
    text_position: "Posição do texto",
    bottom: "Inferior",
    top: "Superior",
    text_align: "Alinhamento",
    left: "Esquerda",
    center: "Centro",
    right: "Direita",
    colors: "Cores",
    background: "Cor de fundo",
    line_color: "Cor das barras",
    preview: "Pré-visualização",
    preview_alt: "Pré-visualização do código de barras gerado",
    scan_tip: "Dica: use alto contraste entre barras e fundo e teste a leitura antes de imprimir etiquetas em lote.",
    error: "não é uma entrada válida para este formato de código de barras",
    filename: "Meu Código de Barras",
    download_success: "Código de barras baixado com sucesso.",

    features_title: "Recursos do gerador de código de barras",
    feature_1: "Suporte a CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode e Codabar.",
    feature_2: "Ajuste de altura, largura das barras, margens, fonte, tamanho e posição do texto.",
    feature_3: "Personalização das cores das barras e do fundo com prévia em tempo real.",
    feature_4: "Download em PNG de alta resolução, pronto para impressão nítida em etiquetas, embalagens e documentos.",

    use_cases_title: "Onde usar códigos de barras",
    use_cases_desc: "Códigos de barras são úteis quando você precisa identificar itens de forma rápida, padronizada e compatível com leitores comuns.",
    uc_1_title: "Produtos e varejo",
    uc_1_desc: "Crie códigos para rótulos, embalagens e testes de cadastro em sistemas de venda. Para produtos comerciais, confirme o padrão exigido pelo marketplace ou varejista.",
    uc_2_title: "Estoque e inventário",
    uc_2_desc: "Use CODE128, CODE39, ITF ou MSI para identificar prateleiras, ativos, peças, caixas e movimentações internas.",
    uc_3_title: "Ingressos, etiquetas e eventos",
    uc_3_desc: "Gere códigos para credenciais, comprovantes, pulseiras, etiquetas de despacho e conferência de entrada.",
    uc_4_title: "Logística e transporte",
    uc_4_desc: "Use formatos como ITF-14 e CODE128 em caixas, volumes e processos de separação, rastreio e expedição.",

    how_to_title: "Como criar um código de barras",
    how_1_title: "Digite o valor",
    how_1_desc: "Insira o número ou texto que será codificado. Cada formato aceita um conjunto específico de caracteres e tamanhos.",
    how_2_title: "Escolha o formato",
    how_2_desc: "Selecione o formato conforme sua aplicação.",
    how_3_title: "Personalize e baixe",
    how_3_desc: "Ajuste dimensões, texto e cores. Depois confira a prévia, teste em um leitor e então baixe o código de barras gerado.",

    types_title: "Formatos de código de barras suportados",
    types_desc: "A escolha do formato depende do tipo de dado, do leitor usado e da finalidade do código.",
    type_code128: "CODE128 e variantes A, B e C: formato compacto e versátil para texto, números, etiquetas internas e logística.",
    type_ean: "EAN-13, EAN-8, EAN-5 e EAN-2: padrões usados no varejo para identificação de produtos e extensões de informação.",
    type_upc: "UPC e UPC-E: comuns nos Estados Unidos e Canadá para produtos de varejo.",
    type_code39: "CODE39 e CODE93: aceitam dados alfanuméricos e aparecem em inventário, indústria e identificação interna.",
    type_itf: "ITF e ITF-14: usados em caixas, embalagens secundárias, armazenamento e transporte.",
    type_msi: "MSI e variantes: usados em bibliotecas, prateleiras e aplicações internas de controle.",
    type_pharma: "Pharmacode: padrão voltado a produtos farmacêuticos e processos de rastreabilidade.",
    type_codabar: "Codabar: usado em bibliotecas, transporte, bancos de sangue e sistemas legados.",

    faq_title: "Perguntas e Respostas",
    faq_1_q: "Por que o código de barras não está sendo gerado?",
    faq_1_a: "Cada padrão tem regras próprias. EAN-13 exige números e tamanho específico, UPC também tem quantidade fixa de dígitos, enquanto CODE128 aceita mais variações. Troque o formato ou ajuste o valor informado.",
    faq_2_q: "Posso imprimir o código de barras gerado?",
    faq_2_a: "Sim. Baixe a imagem gerada e use em etiquetas, documentos ou embalagens. Para impressão, mantenha bom contraste, margens suficientes e teste a leitura no tamanho final.",
    faq_3_q: "Qual a diferença entre CODE128 A, B e C?",
    faq_3_a: "CODE128A é usado para maiúsculas e caracteres de controle, CODE128B aceita letras maiúsculas e minúsculas, e CODE128C é otimizado para pares numéricos.",

    see1: "Seletor de Emoji",
    see2: "Gerador de QR Code",
    see3: "Cores Aleatórias",
    see4: "Cores Dominantes da Imagem"
  },
  es: {
    title: "Generador de Código de Barras",
    page_title: "Generador de Código de Barras - Crear Códigos Online Gratis",
    meta: "Generador de código de barras online y gratis. Crea etiquetas en CODE128, EAN-13, UPC, CODE39 y más. Personaliza y descarga como imagen PNG sin registro.",
    og_title: "Generador de Código de Barras Online y Gratis",
    intro: "Genera códigos de barras profesionales listos para imprimir, con procesamiento local e instantáneo. Ideal para etiquetas de productos, control de stock y logística, con vista previa en tiempo real y validación de formatos.",

    data: "Datos del código",
    text: "Código",
    text_placeholder: "Ingrese el valor del código de barras",
    format: "Formato",
    dimensions: "Dimensiones",
    width: "Ancho de las barras",
    height: "Altura",
    margin: "Margen exterior",
    text_margin: "Margen del texto",
    styles: "Texto y Estilo",
    display: "Mostrar valor debajo o arriba del código",
    font: "Fuente",
    font_options: "Estilo de fuente",
    normal: "Normal",
    bold: "Negrita",
    italic: "Cursiva",
    bold_italic: "Negrita Cursiva",
    font_size: "Tamaño de fuente",
    text_position: "Posición del texto",
    bottom: "Inferior",
    top: "Superior",
    text_align: "Alineación",
    left: "Izquierda",
    center: "Centro",
    right: "Derecha",
    colors: "Colores",
    background: "Color de fondo",
    line_color: "Color de barras",
    preview: "Vista previa",
    preview_alt: "Vista previa del código de barras generado",
    scan_tip: "Sugerencia: use un alto contraste entre las barras y el fondo y pruebe la lectura antes de imprimir etiquetas en lote.",
    error: "no es una entrada válida para este formato de código de barras",
    filename: "Mi Código de Barras",
    download_success: "Código de barras descargado con éxito.",

    features_title: "Características del generador de códigos de barras",
    feature_1: "Soporte para CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode y Codabar.",
    feature_2: "Ajuste de altura, ancho de barras, márgenes, fuente, tamaño y posición del texto.",
    feature_3: "Personalización de colores de barras y fondo con vista previa en tiempo real.",
    feature_4: "Descarga en PNG de alta resolución, lista para una impresión nítida en etiquetas, envases y documentos.",

    use_cases_title: "Dónde usar códigos de barras",
    use_cases_desc: "Los códigos de barras son útiles cuando necesita identificar artículos de manera rápida, estandarizada y compatible con lectores comunes.",
    uc_1_title: "Productos y comercio",
    uc_1_desc: "Cree códigos para etiquetas, envases y pruebas de registro en sistemas. Para productos comerciales, confirme el estándar requerido por su marketplace.",
    uc_2_title: "Stock e inventario",
    uc_2_desc: "Use CODE128, CODE39, ITF o MSI para identificar estantes, activos, piezas, cajas y movimientos internos.",
    uc_3_title: "Entradas, etiquetas y eventos",
    uc_3_desc: "Genere códigos para credenciales, vales, pulseras, etiquetas de envío y control de acceso.",
    uc_4_title: "Logística y transporte",
    uc_4_desc: "Use formatos como ITF-14 y CODE128 en cajas, bultos y procesos de clasificación, seguimiento y envío.",

    how_to_title: "Cómo crear un código de barras",
    how_1_title: "Ingrese el valor",
    how_1_desc: "Inserte el número o texto que será codificado. Cada formato acepta un conjunto específico de caracteres y tamaños.",
    how_2_title: "Elija el formato",
    how_2_desc: "Seleccione el formato según su aplicación.",
    how_3_title: "Personalice y Descargue",
    how_3_desc: "Ajuste colores y tamaños según sea necesario. Una vez listo, descargue la imagen PNG de alta resolución.",

    types_title: "Tipos de Código de Barras disponibles",
    types_desc: "Cada formato tiene un propósito diferente en la industria y el comercio.",
    type_code128: "CODE128 y variantes A, B y C: formato compacto y versátil para texto, números, etiquetas internas y logística.",
    type_ean: "EAN-13 y EAN-8: el estándar internacional para productos de consumo en supermercados.",
    type_upc: "UPC-A: estándar común en Norteamérica para productos de consumo.",
    type_code39: "CODE39: muy utilizado en la industria y el gobierno para datos alfanuméricos.",
    type_itf: "ITF (Interleaved 2 of 5): común para numerar cajas y paquetes en logística.",
    type_msi: "MSI: utilizado principalmente para el etiquetado de estantes e inventario en tiendas.",
    type_pharma: "Pharmacode: utilizado en la industria farmacéutica para el control de envases.",
    type_codabar: "Codabar: utilizado en bancos de sangre, bibliotecas y algunos formularios de envío.",

    faq_title: "Preguntas Frecuentes",
    faq_1_q: "¿Por qué no se genera el código de barras?",
    faq_1_a: "Verifique si el valor de entrada es compatible con el formato elegido. EAN y UPC requieren solo números, por ejemplo.",
    faq_2_q: "¿Puedo imprimir el código de barras generado?",
    faq_2_a: "Sí. Descargue la imagen PNG de alta calidad e imprímala. Recomendamos probar la lectura con un escáner antes de imprimir en grandes cantidades.",
    faq_3_q: "¿Cuál es la diferencia entre CODE128 A, B y C?",
    faq_3_a: "Son subtipos que optimizan la codificación: 'A' para mayúsculas y caracteres de control, 'B' para minúsculas y números, y 'C' para pares numéricos (muy compacto).",

    see1: "Selector de Emojis",
    see2: "Generador de Código QR",
    see3: "Colores Aleatorios",
    see4: "Colores Dominantes de la Imagen"
  },
  fr: {
    title: "Générateur de Code-Barres",
    page_title: "Générateur de Code-Barres - Créer des Codes en Ligne Gratuitement",
    meta: "Générateur de code-barres en ligne et gratuit. Créez des étiquettes en CODE128, EAN-13, UPC, CODE39 et plus. Personnalisez et téléchargez en image PNG sans inscription.",
    og_title: "Générateur de Code-Barres en Ligne et Gratuit",
    intro: "Générez des codes-barres professionnels prêts pour l'impression, avec un traitement local et instantané. Idéal pour les étiquettes de produits, le contrôle des stocks et la logistique, avec aperçu en temps réel et validation des formats.",

    data: "Données du code",
    text: "Code",
    text_placeholder: "Entrez la valeur du code-barres",
    format: "Format",
    dimensions: "Dimensions",
    width: "Largeur des barres",
    height: "Hauteur",
    margin: "Marge externe",
    text_margin: "Marge du texte",
    styles: "Texte & Style",
    display: "Afficher la valeur au-dessous ou au-dessus du code",
    font: "Police",
    font_options: "Style de police",
    normal: "Normal",
    bold: "Gras",
    italic: "Italique",
    bold_italic: "Gras Italique",
    font_size: "Taille de la police",
    text_position: "Position du texte",
    bottom: "Bas",
    top: "Haut",
    text_align: "Alignement",
    left: "Gauche",
    center: "Centre",
    right: "Droite",
    colors: "Couleurs",
    background: "Couleur de fond",
    line_color: "Couleur des barres",
    preview: "Aperçu",
    preview_alt: "Aperçu du code-barres généré",
    scan_tip: "Conseil : utilisez un contraste élevé entre les barres et le fond et testez la lecture avant d'imprimer des étiquettes en lot.",
    error: "n'est pas une entrée valide pour ce format de code-barres",
    filename: "Mon Code-Barres",
    download_success: "Code-barres téléchargé avec succès.",

    features_title: "Fonctionnalités du générateur de codes-barres",
    feature_1: "Support pour CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode et Codabar.",
    feature_2: "Réglage de la hauteur, largeur des barres, marges, police, taille et position du texte.",
    feature_3: "Personnalisation des couleurs des barres et du fond avec aperçu en temps réel.",
    feature_4: "Téléchargement en PNG haute résolution, prêt pour une impression nette sur étiquettes, emballages et documents.",

    use_cases_title: "Où utiliser des codes-barres",
    use_cases_desc: "Les codes-barres sont utiles lorsque vous devez identifier des articles rapidement, de manière standardisée et compatible avec les lecteurs courants.",
    uc_1_title: "Produits et vente au détail",
    uc_1_desc: "Créez des codes pour les étiquettes, les emballages et les tests d'enregistrement système. Pour les produits commerciaux, confirmez la norme requise par votre marketplace.",
    uc_2_title: "Stock et inventaire",
    uc_2_desc: "Utilisez CODE128, CODE39, ITF ou MSI pour identifier les étagères, les actifs, les pièces, les boîtes et les mouvements internes.",
    uc_3_title: "Billets, étiquettes et événements",
    uc_3_desc: "Générez des codes pour les accréditations, les bons, les bracelets, les étiquettes d'expédition et le contrôle d'entrée.",
    uc_4_title: "Logistique et transport",
    uc_4_desc: "Utilisez des formats comme ITF-14 et CODE128 sur les boîtes, les volumes et les processus de tri, de suivi et d'expédition.",

    how_to_title: "Comment créer un code-barres",
    how_1_title: "Entrez la valeur",
    how_1_desc: "Insérez le numéro ou le texte à encoder. Chaque format accepte un ensemble spécifique de caractères et de tailles.",
    how_2_title: "Choisissez le format",
    how_2_desc: "Sélectionnez le format selon votre application.",
    how_3_title: "Personnalisez et Téléchargez",
    how_3_desc: "Ajustez les couleurs et les tailles selon vos besoins. Une fois prêt, téléchargez l'image PNG haute résolution.",

    types_title: "Types de codes-barres disponibles",
    types_desc: "Chaque format répond à un objectif différent dans l'industrie et le commerce.",
    type_code128: "CODE128 et variantes A, B et C : format compact et polyvalent pour le texte, les chiffres, les étiquettes internes et la logistique.",
    type_ean: "EAN-13 et EAN-8 : la norme internationale pour les produits de détail trouvés dans les supermarchés.",
    type_upc: "UPC-A : norme courante en Amérique du Nord pour les produits de consommation.",
    type_code39: "CODE39 : largement utilisé dans l'industrie et le gouvernement pour les données alphanumériques.",
    type_itf: "ITF (Interleaved 2 of 5) : courant pour la numérotation des boîtes et des colis en logistique.",
    type_msi: "MSI : principalement utilisé pour l'étiquetage des étagères et l'inventaire dans le commerce de détail.",
    type_pharma: "Pharmacode : utilisé dans l'industrie pharmaceutique pour le contrôle des emballages.",
    type_codabar: "Codabar : utilisé dans les banques de sang, les bibliothèques et certains formulaires d'expédition.",

    faq_title: "Foire Aux Questions",
    faq_1_q: "Pourquoi le code-barres ne se génère-t-il pas ?",
    faq_1_a: "Vérifiez si la valeur d'entrée est compatible avec le format choisi. EAN et UPC ne requièrent que des chiffres, par exemple.",
    faq_2_q: "Puis-je imprimer le code-barres généré ?",
    faq_2_a: "Oui. Téléchargez l'image PNG de haute qualité et imprimez-la. Nous recommandons de tester la lecture avec un scanner avant d'imprimer en grandes quantités.",
    faq_3_q: "Quelle est la différence entre CODE128 A, B et C ?",
    faq_3_a: "Ce sont des sous-types qui optimisent l'encodage : 'A' pour les majuscules et caractères de contrôle, 'B' pour les minuscules et chiffres, et 'C' pour les paires numériques (très compact).",

    see1: "Sélecteur d'Emoji",
    see2: "Générateur de Code QR",
    see3: "Couleurs Aléatoires",
    see4: "Couleurs Dominantes de l'Image"
  },
  it: {
    title: "Generatore di Codici a Barre",
    page_title: "Generatore di Codici a Barre - Crea Codici Online Gratis",
    meta: "Generatore di codici a barre online e gratuito. Crea etichette in CODE128, EAN-13, UPC, CODE39 e altro ancora. Personalizza e scarica come immagine PNG senza registrazione.",
    og_title: "Generatore di Codici a Barre Online e Gratis",
    intro: "Genera codici a barre professionali pronti per la stampa, con elaborazione locale istantanea. Ideale per etichette di prodotti, controllo delle scorte e logistica, con anteprima in tempo reale e convalida del formato.",

    data: "Dati del codice",
    text: "Codice",
    text_placeholder: "Inserisci il valore del codice a barre",
    format: "Formato",
    dimensions: "Dimensioni",
    width: "Larghezza delle barre",
    height: "Altezza",
    margin: "Margine esterno",
    text_margin: "Margine del testo",
    styles: "Testo e Stile",
    display: "Visualizza il valore sotto o sopra il codice",
    font: "Carattere",
    font_options: "Stile carattere",
    normal: "Normale",
    bold: "Grassetto",
    italic: "Corsivo",
    bold_italic: "Grassetto Corsivo",
    font_size: "Dimensione carattere",
    text_position: "Posizione del testo",
    bottom: "Inferiore",
    top: "Superiore",
    text_align: "Allineamento",
    left: "Sinistra",
    center: "Centro",
    right: "Destra",
    colors: "Colori",
    background: "Colore di sfondo",
    line_color: "Colore delle barre",
    preview: "Anteprima",
    preview_alt: "Anteprima del codice a barre generato",
    scan_tip: "Suggerimento: usa un contrasto elevato tra le barre e lo sfondo e prova la lettura prima di stampare le etichette in lotti.",
    error: "non è un input valido per questo formato di codice a barre",
    filename: "Mio Codice a Barre",
    download_success: "Codice a barre scaricato con successo.",

    features_title: "Caratteristiche del generatore di codici a barre",
    feature_1: "Supporto per CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode e Codabar.",
    feature_2: "Regola altezza, larghezza delle barre, margini, carattere, dimensione e posizione del testo.",
    feature_3: "Personalizzazione dei colori delle barre e dello sfondo con anteprima in tempo reale.",
    feature_4: "Download in PNG ad alta risoluzione, pronto per una stampa nitida su etichette, imballaggi e documenti.",

    use_cases_title: "Dove usare i codici a barre",
    use_cases_desc: "I codici a barre sono utili quando è necessario identificare gli articoli in modo rapido, standardizzato e compatibile con i lettori comuni.",
    uc_1_title: "Prodotti e vendita al dettaglio",
    uc_1_desc: "Crea codici per etichette, imballaggi e test di registrazione del sistema. Per i prodotti commerciali, conferma lo standard richiesto dal tuo marketplace.",
    uc_2_title: "Stock e inventario",
    uc_2_desc: "Usa CODE128, CODE39, ITF o MSI per identificare scaffali, beni, parti, scatole e movimenti interni.",
    uc_3_title: "Biglietti, etichette ed eventi",
    uc_3_desc: "Genera codici per credenziali, voucher, braccialetti, etichette di spedizione e check-in all'ingresso.",
    uc_4_title: "Logistica e spedizione",
    uc_4_desc: "Usa formati come ITF-14 e CODE128 su scatole, volumi e processi di smistamento, tracciamento e spedizione.",

    how_to_title: "Come creare un codice a barre",
    how_1_title: "Inserisci il valore",
    how_1_desc: "Inserisci il numero o il testo da codificare. Ogni formato accetta un set specifico di caratteri e dimensioni.",
    how_2_title: "Scegli il formato",
    how_2_desc: "Seleziona il formato in base alla tua applicazione.",
    how_3_title: "Personalizza e Scarica",
    how_3_desc: "Regola i colori e le dimensioni secondo necessità. Una volta pronto, scarica l'immagine PNG ad alta risoluzione.",

    types_title: "Tipi di codici a barre disponibili",
    types_desc: "Ogni formato serve a uno scopo diverso nell'industria e nel commercio.",
    type_code128: "CODE128 e varianti A, B e C: formato compatto e versatile per testo, numeri, etichette interne e logistica.",
    type_ean: "EAN-13 ed EAN-8: lo standard internazionale per i prodotti al dettaglio che si trovano nei supermercati.",
    type_upc: "UPC-A: standard comune in Nord America per i prodotti di consumo.",
    type_code39: "CODE39: ampiamente utilizzato nell'industria e nel governo per i dati alfanumerici.",
    type_itf: "ITF (Interleaved 2 of 5): comune per la numerazione di scatole e colli in logistica.",
    type_msi: "MSI: utilizzato principalmente per l'etichettatura degli scaffali e l'inventario nel commercio al dettaglio.",
    type_pharma: "Pharmacode: utilizzato nell'industria farmaceutica per il controllo degli imballaggi.",
    type_codabar: "Codabar: utilizzato in banche del sangue, biblioteche e alcuni moduli di spedizione.",

    faq_title: "Domande Frequenti",
    faq_1_q: "Perché il codice a barre non viene generato?",
    faq_1_a: "Verifica se il valore inserito è compatibile con il formato scelto. EAN e UPC richiedono solo numeri, ad esempio.",
    faq_2_q: "Posso stampare il codice a barre generato?",
    faq_2_a: "Sì. Scarica l'immagine PNG di alta qualità e stampala. Consigliamo di testare la lettura con uno scanner prima di stampare in grandi quantità.",
    faq_3_q: "Qual è la differenza tra CODE128 A, B e C?",
    faq_3_a: "Sono sottotipi che optimizzano la codifica dei dati: 'A' per maiuscole e caratteri di controllo, 'B' per minuscole e numeri, e 'C' per coppie numeriche (molto compatto).",

    see1: "Selettore di Emoji",
    see2: "Generatore di Codice QR",
    see3: "Colori Casuali",
    see4: "Colori Dominanti dell'Immagine"
  },
  id: {
    title: "Generator Barcode",
    page_title: "Generator Barcode - Buat Barcode Online Gratis",
    meta: "Generator barcode online dan gratis. Buat label dalam CODE128, EAN-13, UPC, CODE39 dan banyak lagi. Sesuaikan dan unduh sebagai gambar PNG tanpa registrasi.",
    og_title: "Generator Barcode Online Gratis",
    intro: "Hasilkan barcode profesional yang siap dicetak, dengan pemrosesan lokal instan. Ideal untuk label produk, kontrol stok, dan logistik, dengan pratinjau waktu nyata dan validasi format.",

    data: "Data Barcode",
    text: "Kode",
    text_placeholder: "Masukkan nilai barcode",
    format: "Format",
    dimensions: "Dimensi",
    width: "Lebar batang",
    height: "Tinggi",
    margin: "Margin luar",
    text_margin: "Margin teks",
    styles: "Teks & Gaya",
    display: "Tampilkan nilai di bawah atau di atas kode",
    font: "Font",
    font_options: "Gaya font",
    normal: "Normal",
    bold: "Tebal",
    italic: "Miring",
    bold_italic: "Tebal Miring",
    font_size: "Ukuran font",
    text_position: "Posisi teks",
    bottom: "Bawah",
    top: "Atas",
    text_align: "Perataan",
    left: "Kiri",
    center: "Tengah",
    right: "Kanan",
    colors: "Warna",
    background: "Warna latar belakang",
    line_color: "Warna batang",
    preview: "Pratinjau",
    preview_alt: "Pratinjau barcode yang dihasilkan",
    scan_tip: "Tip: gunakan kontras tinggi antara batang dan latar belakang dan uji pembacaan sebelum mencetak label dalam jumlah banyak.",
    error: "bukan input yang valid untuk format barcode ini",
    filename: "Barcode Saya",
    download_success: "Barcode berhasil diunduh.",

    features_title: "Fitur generator barcode",
    feature_1: "Dukungan untuk CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode, dan Codabar.",
    feature_2: "Sesuaikan tinggi, lebar batang, margin, font, ukuran, dan posisi teks.",
    feature_3: "Kustomisasi warna batang dan latar belakang dengan pratinjau waktu nyata.",
    feature_4: "Unduh PNG resolusi tinggi, siap untuk pencetakan tajam pada label, kemasan, dan dokumen.",

    use_cases_title: "Tempat menggunakan barcode",
    use_cases_desc: "Barcode berguna saat Anda perlu mengidentifikasi item dengan cepat, secara standar, dan kompatibel dengan pembaca umum.",
    uc_1_title: "Produk dan ritel",
    uc_1_desc: "Buat kode untuk label, kemasan, dan uji registrasi sistem. Untuk produk komersial, konfirmasikan standar yang diperlukan oleh marketplace Anda.",
    uc_2_title: "Stok dan inventaris",
    uc_2_desc: "Gunakan CODE128, CODE39, ITF atau MSI untuk mengidentifikasi rak, aset, suku cadang, kotak, dan pergerakan internal.",
    uc_3_title: "Tiket, label, dan acara",
    uc_3_desc: "Hasilkan kode untuk kredensial, voucher, gelang, label pengiriman, dan check-in masuk.",
    uc_4_title: "Logistik dan pengiriman",
    uc_4_desc: "Gunakan format seperti ITF-14 dan CODE128 pada kotak, volume, dan proses penyortiran, pelacakan, dan pengiriman.",

    how_to_title: "Cara membuat barcode",
    how_1_title: "Masukkan nilai",
    how_1_desc: "Masukkan nomor atau teks yang akan dikodekan. Setiap format menerima set karakter dan ukuran tertentu.",
    how_2_title: "Pilih format",
    how_2_desc: "Pilih format sesuai dengan aplikasi Anda.",
    how_3_title: "Kustomisasi dan Unduh",
    how_3_desc: "Sesuaikan warna dan ukuran sesuai kebutuhan. Setelah siap, unduh gambar PNG resolusi tinggi.",

    types_title: "Jenis Barcode yang tersedia",
    types_desc: "Setiap format melayani tujuan yang berbeda dalam industri dan ritel.",
    type_code128: "CODE128 dan varian A, B, dan C: format ringkas dan serbaguna untuk teks, angka, label internal, dan logistik.",
    type_ean: "EAN-13 dan EAN-8: standar internasional untuk produk ritel yang ditemukan di supermarket.",
    type_upc: "UPC-A: standar umum di Amerika Utara untuk produk konsumen.",
    type_code39: "CODE39: banyak digunakan dalam industri dan pemerintah untuk data alfanumerik.",
    type_itf: "ITF (Interleaved 2 of 5): umum untuk penomoran kotak dan paket dalam logistik.",
    type_msi: "MSI: sebagian besar digunakan untuk pelabelan rak dan inventaris dalam ritel.",
    type_pharma: "Pharmacode: digunakan dalam industri farmasi untuk kontrol kemasan.",
    type_codabar: "Codabar: digunakan di bank darah, perpustakaan, dan beberapa formulir pengiriman.",

    faq_title: "Pertanyaan yang Sering Diajukan",
    faq_1_q: "Mengapa barcode tidak muncul?",
    faq_1_a: "Periksa apakah nilai input kompatibel dengan format yang dipilih. EAN dan UPC hanya memerlukan angka, misalnya.",
    faq_2_q: "Dapatkah saya mencetak barcode yang dihasilkan?",
    faq_2_a: "Ya. Unduh gambar PNG berkualitas tinggi dan cetak. Kami menyarankan untuk menguji pembacaan dengan pemindai sebelum mencetak dalam jumlah besar.",
    faq_3_q: "Apa perbedaan antara CODE128 A, B, dan C?",
    faq_3_a: "Ini adalah sub-tipe yang mengoptimalkan pengkodean data: 'A' untuk huruf besar dan karakter kontrol, 'B' untuk huruf kecil dan angka, dan 'C' untuk pasangan numerik (sangat ringkas).",

    see1: "Pemilih Emoji",
    see2: "Generator Kode QR",
    see3: "Warna Acak",
    see4: "Warna Dominan Gambar"
  },
  de: {
    title: "Barcode-Generator",
    page_title: "Barcode-Generator - Kostenlos online Barcodes erstellen",
    meta: "Kostenloser Online-Barcode-Generator. Erstellen Sie Etiketten in CODE128, EAN-13, UPC, CODE39 und mehr. Anpassen und als PNG-Bild herunterladen ohne Registrierung.",
    og_title: "Kostenloser Online-Barcode-Generator",
    intro: "Erstellen Sie professionelle Barcodes für den Druck mit sofortiger lokaler Verarbeitung. Ideal für Produktetiketten, Bestandskontrolle und Logistik, mit Echtzeit-Vorschau und Formatvalidierung.",

    data: "Barcode-Daten",
    text: "Code",
    text_placeholder: "Geben Sie den Barcode-Wert ein",
    format: "Format",
    dimensions: "Abmessungen",
    width: "Strichbreite",
    height: "Höhe",
    margin: "Außenrand",
    text_margin: "Textrand",
    styles: "Text & Stil",
    display: "Wert unter oder über dem Code anzeigen",
    font: "Schriftart",
    font_options: "Schriftstil",
    normal: "Normal",
    bold: "Fett",
    italic: "Kursiv",
    bold_italic: "Fett Kursiv",
    font_size: "Schriftgröße",
    text_position: "Textposition",
    bottom: "Unten",
    top: "Oben",
    text_align: "Ausrichtung",
    left: "Links",
    center: "Mitte",
    right: "Rechts",
    colors: "Farben",
    background: "Hintergrundfarbe",
    line_color: "Strichfarbe",
    preview: "Vorschau",
    preview_alt: "Vorschau des generierten Barcodes",
    scan_tip: "Tipp: Verwenden Sie einen hohen Kontrast zwischen Strichen und Hintergrund und testen Sie das Lesen, bevor Sie Etiketten in großen Mengen drucken.",
    error: "ist keine gültige Eingabe für dieses Barcode-Format",
    filename: "Mein Barcode",
    download_success: "Barcode erfolgreich heruntergeladen.",

    features_title: "Funktionen des Barcode-Generators",
    feature_1: "Unterstützung für CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode und Codabar.",
    feature_2: "Höhe, Strichbreite, Ränder, Schriftart, Größe und Textposition anpassen.",
    feature_3: "Anpassung der Strich- und Hintergrundfarbe mit Echtzeit-Vorschau.",
    feature_4: "Hochauflösender PNG-Download, bereit für den gestochen scharfen Druck auf Etiketten, Verpackungen und Dokumenten.",

    use_cases_title: "Wo Barcodes verwendet werden",
    use_cases_desc: "Barcodes sind nützlich, wenn Sie Artikel schnell, standardisiert und mit gängigen Lesegeräten kompatibel identifizieren müssen.",
    uc_1_title: "Produkte und Einzelhandel",
    uc_1_desc: "Erstellen Sie Codes für Etiketten, Verpackungen und Systemregistrierungstests. Bestätigen Sie bei kommerziellen Produkten den von Ihrem Marktplatz geforderten Standard.",
    uc_2_title: "Bestand und Inventar",
    uc_2_desc: "Verwenden Sie CODE128, CODE39, ITF oder MSI, um Regale, Anlagen, Teile, Kartons und interne Bewegungen zu identifizieren.",
    uc_3_title: "Tickets, Etiketten und Veranstaltungen",
    uc_3_desc: "Generieren Sie Codes für Ausweise, Gutscheine, Armbänder, Versandetiketten und den Check-in am Eingang.",
    uc_4_title: "Logistik und Versand",
    uc_4_desc: "Verwenden Sie Formate wie ITF-14 und CODE128 auf Kartons, Volumen und bei Sortier-, Verfolgungs- und Versandprozessen.",

    how_to_title: "So erstellen Sie einen Barcode",
    how_1_title: "Wert eingeben",
    how_1_desc: "Geben Sie die zu codierende Nummer oder den Text ein. Jedes Format akzeptiert eine bestimmte Reihe von Zeichen und Größen.",
    how_2_title: "Format wählen",
    how_2_desc: "Wählen Sie das Format entsprechend Ihrer Anwendung.",
    how_3_title: "Anpassen und herunterladen",
    how_3_desc: "Passen Sie Farben und Größen nach Bedarf an. Laden Sie anschließend das hochauflösende PNG-Bild herunter.",

    types_title: "Verfügbare Barcode-Typen",
    types_desc: "Jedes Format erfüllt in Industrie und Handel einen anderen Zweck.",
    type_code128: "CODE128 und Varianten A, B und C: kompaktes und vielseitiges Format für Text, Zahlen, interne Etiketten und Logistik.",
    type_ean: "EAN-13 und EAN-8: der internationale Standard für Einzelhandelsprodukte in Supermärkten.",
    type_upc: "UPC-A: gängiger Standard in Nordamerika für Konsumgüter.",
    type_code39: "CODE39: in Industrie und Regierung weit verbreitet für alphanumerische Daten.",
    type_itf: "ITF (Interleaved 2 of 5): üblich für die Nummerierung von Kartons und Paketen in der Logistik.",
    type_msi: "MSI: wird hauptsächlich für die Regaletikettierung und Inventur im Einzelhandel verwendet.",
    type_pharma: "Pharmacode: in der Pharmaindustrie zur Verpackungskontrolle verwendet.",
    type_codabar: "Codabar: verwendet in Blutbanken, Bibliotheken und einigen Versandformularen.",

    faq_title: "Häufig gestellte Fragen",
    faq_1_q: "Warum wird der Barcode nicht generiert?",
    faq_1_a: "Überprüfen Sie, ob der Eingabewert mit dem gewählten Format kompatibel ist. EAN und UPC erfordern beispielsweise nur Zahlen.",
    faq_2_q: "Kann ich den generierten Barcode ausdrucken?",
    faq_2_a: "Ja. Laden Sie das hochwertige PNG-Bild herunter und drucken Sie es aus. Wir empfehlen, das Lesen mit einem Scanner zu testen, bevor Sie in großen Mengen drucken.",
    faq_3_q: "Was ist der Unterschied zwischen CODE128 A, B und C?",
    faq_3_a: "Es handelt sich um Untertypen, die die Datencodierung optimieren: 'A' für Großbuchstaben und Steuerzeichen, 'B' für Kleinbuchstaben und Zahlen und 'C' für reine Zahlenpaare (sehr kompakt).",

    see1: "Emoji-Auswahl",
    see2: "QR-Code-Generator",
    see3: "Zufällige Farben",
    see4: "Dominante Farben des Bildes"
  },
  nl: {
    title: "Barcode Generator",
    page_title: "Barcode Generator - Maak Gratis Barcodes Online",
    meta: "Gratis online barcode generator. Maak labels in CODE128, EAN-13, UPC, CODE39 en meer. Pas aan en download als PNG-afbeelding zonder registratie.",
    og_title: "Gratis Online Barcode Generator",
    intro: "Genereer professionele barcodes klaar voor afdrukken, met directe lokale verwerking. Ideaal voor productlabels, voorraadbeheer en logistiek, met realtime voorbeeld en formaatvalidatie.",

    data: "Barcode Gegevens",
    text: "Code",
    text_placeholder: "Voer de barcodewaarde in",
    format: "Formaat",
    dimensions: "Afmetingen",
    width: "Balkbreedte",
    height: "Hoogte",
    margin: "Buitenmarge",
    text_margin: "Tekstmarge",
    styles: "Tekst & Stijl",
    display: "Waarde onder of boven de code weergeven",
    font: "Lettertype",
    font_options: "Lettertypestijl",
    normal: "Normaal",
    bold: "Vet",
    italic: "Cursief",
    bold_italic: "Vet Cursief",
    font_size: "Tekengrootte",
    text_position: "Tekstpositie",
    bottom: "Onder",
    top: "Boven",
    text_align: "Uitlijning",
    left: "Links",
    center: "Midden",
    right: "Rechts",
    colors: "Kleuren",
    background: "Achtergrondkleur",
    line_color: "Balkkleur",
    preview: "Voorbeeld",
    preview_alt: "Voorbeeld van de gegenereerde barcode",
    scan_tip: "Tip: gebruik een hoog contrast tussen balken en achtergrond en test het lezen voordat u labels in bulk afdrukt.",
    error: "is geen geldige invoer voor dit barcodeformaat",
    filename: "Mijn Barcode",
    download_success: "Barcode succesvol gedownload.",

    features_title: "Functies van de barcode generator",
    feature_1: "Ondersteuning voor CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode en Codabar.",
    feature_2: "Pas hoogte, balkbreedte, marges, lettertype, grootte en tekstpositie aan.",
    feature_3: "Aanpassing van balk- en achtergrondkleur met realtime voorbeeld.",
    feature_4: "PNG-download in hoge resolutie, klaar voor scherp afdrukken op labels, verpakkingen en documenten.",

    use_cases_title: "Waar barcodes te gebruiken",
    use_cases_desc: "Barcodes zijn handig wanneer u items snel, op een gestandaardiseerde manier en compatibel met gangbare lezers moet identificeren.",
    uc_1_title: "Producten en detailhandel",
    uc_1_desc: "Maak codes voor labels, verpakkingen en systeemregistratietests. Bevestig voor commerciële producten de norm die door uw marktplaats wordt vereist.",
    uc_2_title: "Voorraad en inventaris",
    uc_2_desc: "Gebruik CODE128, CODE39, ITF of MSI om planken, activa, onderdelen, dozen en interne verplaatsingen te identificeren.",
    uc_3_title: "Tickets, labels en evenementen",
    uc_3_desc: "Genereer codes voor inloggegevens, vouchers, polsbandjes, verzendlabels en inchecken bij toegang.",
    uc_4_title: "Logistiek en verzending",
    uc_4_desc: "Gebruik formaten zoals ITF-14 en CODE128 op dozen, volumes en sorteer-, volg- en verzendprocessen.",

    how_to_title: "Hoe een barcode te maken",
    how_1_title: "Voer de waarde in",
    how_1_desc: "Voer het nummer of de tekst in die moet worden gecodeerd. Elk formaat accepteert een specifieke set tekens en formaten.",
    how_2_title: "Kies het formaat",
    how_2_desc: "Selecteer het formaat volgens uw toepassing.",
    how_3_title: "Aanpassen en downloaden",
    how_3_desc: "Pas kleuren en formaten naar wens aan. Zodra u klaar bent, downloadt u de PNG-afbeelding in hoge resolutie.",

    types_title: "Beschikbare barcodetypes",
    types_desc: "Elk formaat dient een ander doel in industrie en detailhandel.",
    type_code128: "CODE128 en varianten A, B en C: compact en veelzijdig formaat voor tekst, cijfers, interne labels en logistiek.",
    type_ean: "EAN-13 en EAN-8: de internationale standaard voor detailhandelsproducten in supermarkten.",
    type_upc: "UPC-A: algemene standaard in Noord-Amerika voor consumentenproducten.",
    type_code39: "CODE39: veel gebruikt in industrie en overheid voor alfanumerieke gegevens.",
    type_itf: "ITF (Interleaved 2 of 5): gebruikelijk voor het nummeren van dozen en pakketten in de logistiek.",
    type_msi: "MSI: meestal gebruikt voor schapetikettering en inventarisatie in de detailhandel.",
    type_pharma: "Pharmacode: gebruikt in de farmaceutische industrie voor verpakkingscontrole.",
    type_codabar: "Codabar: gebruikt in bloedbanken, bibliotheken en sommige verzendformulieren.",

    faq_title: "Veelgestelde vragen",
    faq_1_q: "Waarom wordt de barcode niet gegenereerd?",
    faq_1_a: "Controleer of de ingevoerde waarde compatibel is met het gekozen formaat. EAN en UPC vereisen bijvoorbeeld alleen cijfers.",
    faq_2_q: "Kan ik de gegenereerde barcode afdrukken?",
    faq_2_a: "Ja. Download de hoogwaardige PNG-afbeelding en druk deze af. We raden aan om het lezen met een scanner te testen voordat u grote hoeveelheden afdrukt.",
    faq_3_q: "Wat is het verschil tussen CODE128 A, B en C?",
    faq_3_a: "Het zijn subtypen die de gegevenscodering optimaliseren: 'A' voor hoofdletters en controletekens, 'B' voor kleine letters en cijfers, en 'C' voor alleen numerieke paren (zeer compact).",

    see1: "Emoji-kiezer",
    see2: "QR Code Generator",
    see3: "Willekeurige kleuren",
    see4: "Dominante kleuren van de afbeelding"
  }
}
</i18n>
