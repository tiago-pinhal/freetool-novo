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
    see1: "Emoji Picker",
    see2: "QR Code Generator",
    see3: "Random Colors",
    see4: "Dominant Colors of the Image"
  },
  pt: {
    title: "Gerador de Código de Barras",
    page_title: "Gerador de Código de Barras - Criar Códigos Online Grátis",
    meta: "Crie códigos de barras online grátis em diferentes formatos. Personalize tamanho, cores, texto e baixe como imagem PNG.",
    og_title: "Gerador de Código de Barras Online e Grátis",
    intro: "Gere códigos de barras personalizados para produtos, etiquetas, estoque, ingressos e materiais internos. A visualização prévia atualiza em tempo real de acordo com as configurações escolhidas, mostrando até que momento o conteúdo é válido para o formato em questão.",

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
    filename: "Meu Codigo de Barras",
    download_success: "Código de barras baixado com sucesso.",

    features_title: "Recursos do gerador de código de barras",
    feature_1: "Suporte a CODE128, EAN, UPC, CODE39, CODE93, ITF, MSI, Pharmacode e Codabar.",
    feature_2: "Ajuste de altura, largura das barras, margens, fonte, tamanho e posição do texto.",
    feature_3: "Personalização das cores das barras e do fundo com prévia em tempo real.",
    feature_4: "Download em imagem PNG, direto no navegador, sem necessidade de cadastro.",

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
    see1: "Selector de Emojis",
    see2: "Generador de Código QR",
    see3: "Colores Aleatorios",
    see4: "Colores Dominantes de la Imagen"
  },
  fr: {
    see1: "Sélecteur d'Emoji",
    see2: "Générateur de Code QR",
    see3: "Couleurs Aléatoires",
    see4: "Couleurs Dominantes de l'Image"
  },
  it: {
    see1: "Selettore di Emoji",
    see2: "Generatore di Codice QR",
    see3: "Colori Casuali",
    see4: "Colori Dominanti dell'Immagine"
  },
  id: {
    see1: "Pemilih Emoji",
    see2: "Generator Kode QR",
    see3: "Warna Acak",
    see4: "Warna Dominan Gambar"
  }
}
</i18n>
