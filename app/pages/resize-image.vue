<script setup lang="ts">
declare global {
  interface Window { pica: any }
}

type ResizeMode = 'preset' | 'custom' | 'percentage'
type ExportFormat = 'png' | 'jpeg' | 'webp'
type PresetCategory = 'appStore' | 'social' | 'web' | 'ecommerce' | 'print'

const { t } = useI18n({ useScope: 'local' })

const fileName = ref('')
const originalWidth = ref(0)
const originalHeight = ref(0)
const targetWidth = ref(0)
const targetHeight = ref(0)
const imageLoaded = ref(false)
const lockAspectRatio = ref(true)
const exportFormat = ref<ExportFormat>('png')
const quality = ref(92)
const isProcessing = ref(false)
const resizeMode = ref<ResizeMode>('preset')
const selectedCategory = ref<PresetCategory>('appStore')
const selectedPresetId = ref('')
const selectedPercentage = ref<number | null>(null)
const scriptReady = ref(false)

let originalFile: File | null = null
let picaInstance: any = null

const percentages = [25, 50, 75, 100, 150, 200]

const presets = {
  appStore: [
    { id: 'appIcon', label: 'App Icon', width: 512, height: 512, description: 'Icon for app stores' },
    { id: 'featureGraphic', label: 'Feature Graphic', width: 1024, height: 500, description: 'Promotional banner' },
    { id: 'phoneScreenshot16', label: 'Phone Screenshot 16:9', width: 1920, height: 1080, description: 'Smartphone landscape' },
    { id: 'phoneScreenshot9', label: 'Phone Screenshot 9:16', width: 1080, height: 1920, description: 'Smartphone portrait' },
    { id: 'tablet7', label: 'Tablet 7"', width: 1280, height: 800, description: 'Tablet 7 inch' },
    { id: 'tablet10', label: 'Tablet 10"', width: 1920, height: 1200, description: 'Tablet 10 inch' },
    { id: 'tvBanner', label: 'TV Banner', width: 1280, height: 720, description: 'Smart TV / Android TV' },
  ],
  social: [
    { id: 'igPost', label: 'Instagram Post', width: 1080, height: 1080, description: 'Square feed post' },
    { id: 'igStory', label: 'Instagram Story', width: 1080, height: 1920, description: 'Stories/Reels' },
    { id: 'igPortrait', label: 'Instagram Portrait', width: 1080, height: 1350, description: 'Best engagement' },
    { id: 'fbCover', label: 'Facebook Cover', width: 820, height: 312, description: 'Profile cover' },
    { id: 'fbPost', label: 'Facebook Post', width: 1200, height: 630, description: 'Link preview' },
    { id: 'xHeader', label: 'Twitter/X Header', width: 1500, height: 500, description: 'Profile banner' },
    { id: 'xPost', label: 'Twitter/X Post', width: 1200, height: 675, description: 'Post image' },
    { id: 'ytThumb', label: 'YouTube Thumbnail', width: 1280, height: 720, description: 'Video thumbnail' },
    { id: 'ytBanner', label: 'YouTube Banner', width: 2560, height: 1440, description: 'Channel cover' },
    { id: 'linkedinBanner', label: 'LinkedIn Banner', width: 1584, height: 396, description: 'Profile cover' },
    { id: 'linkedinPost', label: 'LinkedIn Post', width: 1200, height: 627, description: 'Post image' },
    { id: 'tiktok', label: 'TikTok Video', width: 1080, height: 1920, description: 'Vertical video' },
    { id: 'pinterest', label: 'Pinterest Pin', width: 1000, height: 1500, description: '2:3 pin' },
  ],
  web: [
    { id: 'favicon16', label: 'Favicon', width: 32, height: 32, description: 'Browser tab icon' },
    { id: 'favicon180', label: 'Apple Touch Icon', width: 180, height: 180, description: 'iOS home screen' },
    { id: 'favicon192', label: 'Android Icon', width: 192, height: 192, description: 'PWA icon' },
    { id: 'favicon512', label: 'PWA Icon HD', width: 512, height: 512, description: 'PWA splash screen' },
    { id: 'ogImage', label: 'OG Image', width: 1200, height: 630, description: 'Social share preview' },
    { id: 'hd', label: 'Full HD', width: 1920, height: 1080, description: 'Desktop wallpaper' },
    { id: '4k', label: '4K Ultra HD', width: 3840, height: 2160, description: 'High resolution display' },
    { id: 'heroBanner', label: 'Hero Banner', width: 1920, height: 600, description: 'Website header' },
  ],
  ecommerce: [
    { id: 'productSquare', label: 'Product Square', width: 800, height: 800, description: 'Product thumbnail' },
    { id: 'productLarge', label: 'Product Large', width: 1200, height: 1200, description: 'Product detail' },
    { id: 'productRect', label: 'Product Rectangle', width: 1200, height: 800, description: 'Product banner' },
    { id: 'bannerWide', label: 'Promotional Banner', width: 1920, height: 600, description: 'Wide banner' },
    { id: 'bannerMobile', label: 'Mobile Banner', width: 640, height: 320, description: 'Mobile promotion' },
  ],
  print: [
    { id: 'a4', label: 'A4 (300 DPI)', width: 2480, height: 3508, description: 'Document A4' },
    { id: 'a5', label: 'A5 (300 DPI)', width: 1748, height: 2480, description: 'Document A5' },
    { id: 'letter', label: 'Letter (300 DPI)', width: 2550, height: 3300, description: 'US Letter' },
    { id: 'businessCard', label: 'Business Card', width: 1050, height: 600, description: '3.5×2 inches' },
    { id: 'photo4x6', label: 'Photo 4×6', width: 1200, height: 1800, description: 'Standard photo' },
    { id: 'photo5x7', label: 'Photo 5×7', width: 1500, height: 2100, description: 'Medium photo' },
  ],
} as const

const currentCategoryPresets = computed(() => presets[selectedCategory.value] || [])
const currentPreset = computed(() => currentCategoryPresets.value.find(preset => preset.id === selectedPresetId.value))

const faqItems = computed(() => [
  { question: t('faq1q'), answer: t('faq1a') },
  { question: t('faq2q'), answer: t('faq2a') },
  { question: t('faq3q'), answer: t('faq3a') },
  { question: t('faq4q'), answer: t('faq4a') },
  { question: t('faq5q'), answer: t('faq5a') },
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('d21'), t('d22'), t('d23'), t('d24'), t('d25')],
  howToName: t('t5'),
  howToSteps: [
    { name: t('how1t'), text: t('how1d') },
    { name: t('how2t'), text: t('how2d') },
    { name: t('how3t'), text: t('how3d') },
  ],
  faq: faqItems.value,
})

useHead({
  title: t('pageTitle'),
  meta: [
    { name: 'description', content: t('metaDescription') }
  ],
})

const { onLoaded } = useScript('https://cdn.jsdelivr.net/npm/pica@9.0.1/dist/pica.min.js', { trigger: 'client' })

onLoaded(() => {
  scriptReady.value = true
  if (typeof window !== 'undefined' && window.pica) {
    picaInstance = new window.pica()
  }
})

watch(selectedCategory, () => {
  const firstPreset = currentCategoryPresets.value[0]
  selectedPresetId.value = firstPreset?.id ?? ''
  if (resizeMode.value === 'preset') onPresetChange()
})

function onImageSelected(file: File | File[]) {
  const selectedFile = Array.isArray(file) ? file[0] : file
  if (!selectedFile) return

  originalFile = selectedFile
  fileName.value = selectedFile.name
  selectedPercentage.value = null

  const img = new Image()
  img.onload = () => {
    originalWidth.value = img.width
    originalHeight.value = img.height
    targetWidth.value = img.width
    targetHeight.value = img.height
    imageLoaded.value = true

    const firstPreset = currentCategoryPresets.value[0]
    selectedPresetId.value = firstPreset?.id ?? ''
    if (resizeMode.value === 'preset') onPresetChange()

    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(selectedFile)
}

function onPresetChange() {
  const preset = currentPreset.value
  if (!preset) return

  targetWidth.value = preset.width
  targetHeight.value = preset.height
  lockAspectRatio.value = false
  selectedPercentage.value = null
}

function onWidthChange() {
  selectedPercentage.value = null
  if (lockAspectRatio.value && originalWidth.value && originalHeight.value && targetWidth.value > 0) {
    const ratio = originalHeight.value / originalWidth.value
    targetHeight.value = Math.round(targetWidth.value * ratio)
  }
}

function onHeightChange() {
  selectedPercentage.value = null
  if (lockAspectRatio.value && originalWidth.value && originalHeight.value && targetHeight.value > 0) {
    const ratio = originalWidth.value / originalHeight.value
    targetWidth.value = Math.round(targetHeight.value * ratio)
  }
}

function resizeByPercentage(pct: number) {
  selectedPercentage.value = pct
  targetWidth.value = Math.max(1, Math.round(originalWidth.value * pct / 100))
  targetHeight.value = Math.max(1, Math.round(originalHeight.value * pct / 100))
}

async function download() {
  if (!originalFile || !targetWidth.value || !targetHeight.value) return

  isProcessing.value = true
  let srcUrl = ''

  try {
    const img = new Image()
    srcUrl = URL.createObjectURL(originalFile)
    img.src = srcUrl
    await img.decode()

    const destCanvas = document.createElement('canvas')
    destCanvas.width = targetWidth.value
    destCanvas.height = targetHeight.value

    const mimeType = exportFormat.value === 'png'
      ? 'image/png'
      : exportFormat.value === 'jpeg'
        ? 'image/jpeg'
        : 'image/webp'

    let blob: Blob | null = null

    if (scriptReady.value && picaInstance) {
      try {
        const srcCanvas = document.createElement('canvas')
        srcCanvas.width = img.width
        srcCanvas.height = img.height

        const srcCtx = srcCanvas.getContext('2d')
        if (srcCtx) {
          srcCtx.drawImage(img, 0, 0)
          await picaInstance.resize(srcCanvas, destCanvas, { quality: 3 })
          blob = await picaInstance.toBlob(
            destCanvas,
            mimeType,
            exportFormat.value === 'png' ? undefined : quality.value / 100,
          )
        }
      } catch {
        blob = null
      }
    }

    if (!blob) {
      const ctx = destCanvas.getContext('2d')
      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, targetWidth.value, targetHeight.value)
        blob = await new Promise(resolve => {
          destCanvas.toBlob(resolve, mimeType, exportFormat.value === 'png' ? undefined : quality.value / 100)
        })
      }
    }

    if (!blob) return

    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    const originalName = fileName.value.replace(/\.[^/.]+$/, '')
    a.download = `${originalName}_${targetWidth.value}x${targetHeight.value}.${exportFormat.value}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  } finally {
    if (srcUrl) URL.revokeObjectURL(srcUrl)
    isProcessing.value = false
  }
}

function newImage() {
  imageLoaded.value = false
  originalFile = null
  fileName.value = ''
  originalWidth.value = 0
  originalHeight.value = 0
  targetWidth.value = 0
  targetHeight.value = 0
  lockAspectRatio.value = true
  exportFormat.value = 'png'
  quality.value = 92
  resizeMode.value = 'preset'
  selectedCategory.value = 'appStore'
  selectedPresetId.value = ''
  selectedPercentage.value = null
}

defineI18nRoute({
  paths: {
    en: '/resize-image',
    pt: '/redimensionar-imagem',
    es: '/redimensionar-imagen',
    fr: '/redimensionner-image',
    it: '/ridimensiona-immagine',
    id: '/pengubah-ukuran-gambar',
    de: '/bildgroesse-aendern',
    nl: '/afbeelding-herschalen',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="imageLoaded"
    :see-also-links="[
      { label: t('see1'), to: 'crop-image' },
      { label: t('see2'), to: 'qrcode-generator' },
      { label: t('see3'), to: 'dominant-colors-of-the-image' },
      { label: t('see4'), to: 'barcode-generator' },
    ]"
  >
    <div v-if="!imageLoaded" class="flex flex-col items-center justify-center py-8 gap-4">
      <ImageUploader :show="true" @on-file="onImageSelected" />
      <p class="text-sm text-base-content/70">{{ t('uploadHint') }}</p>
    </div>

    <div v-else class="max-w-2xl mx-auto space-y-4">
      <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4">
        <div class="flex items-start gap-3">
          <Icon name="heroicons:photo-20-solid" class="w-5 h-5 mt-0.5 text-primary" />
          <div class="min-w-0">
            <p class="font-bold truncate">{{ fileName }}</p>
            <p class="text-sm text-base-content/60">
              {{ t('original') }}: {{ originalWidth }} × {{ originalHeight }} px
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
        <p class="text-sm font-bold">{{ t('chooseMode') }}</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            class="btn btn-sm"
            :class="resizeMode === 'preset' ? 'btn-primary' : 'btn-ghost'"
            @click="resizeMode = 'preset'; onPresetChange()"
          >
            {{ t('modePreset') }}
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="resizeMode === 'custom' ? 'btn-primary' : 'btn-ghost'"
            @click="resizeMode = 'custom'; lockAspectRatio = true; selectedPercentage = null"
          >
            {{ t('modeCustom') }}
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="resizeMode === 'percentage' ? 'btn-primary' : 'btn-ghost'"
            @click="resizeMode = 'percentage'"
          >
            {{ t('modePercentage') }}
          </button>
        </div>
      </section>

      <section v-if="resizeMode === 'preset'" class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
        <label class="form-control w-full">
          <span class="label-text mb-2 font-bold">{{ t('chooseCategory') }}</span>
          <select v-model="selectedCategory" class="select select-bordered bg-base-100 w-full">
            <option value="appStore">{{ t('catAppStore') }}</option>
            <option value="social">{{ t('catSocial') }}</option>
            <option value="web">{{ t('catWeb') }}</option>
            <option value="ecommerce">{{ t('catEcommerce') }}</option>
            <option value="print">{{ t('catPrint') }}</option>
          </select>
        </label>

        <label class="form-control w-full">
          <span class="label-text mb-2 font-bold">{{ t('chooseSize') }}</span>
          <select v-model="selectedPresetId" class="select select-bordered bg-base-100 w-full" @change="onPresetChange">
            <option v-for="preset in currentCategoryPresets" :key="preset.id" :value="preset.id">
              {{ preset.label }} ({{ preset.width }}×{{ preset.height }})
            </option>
          </select>
          <span class="label-text-alt mt-2 text-base-content/60">{{ currentPreset?.description }}</span>
        </label>
      </section>

      <section v-if="resizeMode === 'custom'" class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <label class="form-control">
            <span class="label-text mb-1 font-semibold">{{ t('width') }}</span>
            <input
              v-model.number="targetWidth"
              type="number"
              min="1"
              max="10000"
              class="input input-bordered bg-base-100 w-full"
              @input="onWidthChange"
            >
          </label>
          <label class="form-control">
            <span class="label-text mb-1 font-semibold">{{ t('height') }}</span>
            <input
              v-model.number="targetHeight"
              type="number"
              min="1"
              max="10000"
              class="input input-bordered bg-base-100 w-full"
              @input="onHeightChange"
            >
          </label>
        </div>

        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="lockAspectRatio" type="checkbox" class="checkbox checkbox-sm" />
          <span class="label-text">{{ t('lockRatio') }}</span>
        </label>
      </section>

      <section v-if="resizeMode === 'percentage'" class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
        <p class="text-sm font-bold">{{ t('choosePercentage') }}</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="pct in percentages"
            :key="pct"
            type="button"
            class="btn btn-sm"
            :class="selectedPercentage === pct ? 'btn-primary' : 'btn-ghost'"
            @click="resizeByPercentage(pct)"
          >
            {{ pct }}%
          </button>
        </div>
      </section>

      <section class="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center space-y-1">
        <p class="text-sm text-base-content/60">{{ t('result') }}</p>
        <p class="text-2xl font-black tracking-tight">{{ targetWidth }} × {{ targetHeight }} px</p>
      </section>

      <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
        <label class="form-control w-full">
          <span class="label-text mb-2 font-bold">{{ t('chooseFormat') }}</span>
          <select v-model="exportFormat" class="select select-bordered bg-base-100 w-full">
            <option value="png">PNG — {{ t('highQuality') }}</option>
            <option value="jpeg">JPEG — {{ t('smallerSize') }}</option>
            <option value="webp">WebP — {{ t('modern') }}</option>
          </select>
        </label>

        <label v-if="exportFormat !== 'png'" class="form-control w-full">
          <span class="label-text mb-1 font-bold">{{ t('quality') }}: {{ quality }}%</span>
          <input v-model.number="quality" type="range" min="10" max="100" step="1" class="range range-primary range-sm" />
        </label>
      </section>

      <div class="flex flex-col gap-2">
        <button type="button" class="btn btn-primary w-full" :disabled="isProcessing" @click="download">
          <Icon v-if="!isProcessing" name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
          <span>{{ isProcessing ? `${t('processing')}...` : t('download') }}</span>
        </button>
        <button type="button" class="btn btn-ghost w-full" @click="newImage">
          <Icon name="heroicons:arrow-path-20-solid" class="w-5 h-5" />
          {{ t('restart') }}
        </button>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('d1') }}</p>

        <FeatureSection
          :title="t('t2')"
          :items="[t('d21'), t('d22'), t('d23'), t('d24'), t('d25')]"
        />

        <UseCaseSection
          :title="t('t3')"
          :description="t('d3')"
          :items="[
            { title: t('catAppStore'), description: t('catAppStoreDesc') },
            { title: t('catSocial'), description: t('catSocialDesc') },
            { title: t('catWeb'), description: t('catWebDesc') },
            { title: t('catEcommerce'), description: t('catEcommerceDesc') },
            { title: t('catPrint'), description: t('catPrintDesc') },
          ]"
        />

        <HowToSection
          :title="t('t5')"
          :items="[
            { title: t('how1t'), description: t('how1d') },
            { title: t('how2t'), description: t('how2d') },
            { title: t('how3t'), description: t('how3d') },
          ]"
        />

        <FaqSection :title="t('faqTitle')" :items="faqItems" />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
en:
  title: "Resize Image"
  meta: "Resize images online for free."
  see1: "Crop Image"
  see2: "QR Code Generator"
  see3: "Dominant Colors of Image"
  see4: "Barcode Generator"

pt:
  title: "Redimensionar Imagem"
  pageTitle: "Redimensionar Imagem Online: Ajuste Fotos com Modelos de Tamanho Profissionais"
  meta: "Ferramenta rápida e precisa para redimensionar imagens. Use modelos de tamanho para Instagram, YouTube, e-commerce ou defina tamanhos personalizados com alta qualidade."
  metaDescription: "Redimensione imagens online grátis. Escolha dimensões personalizadas ou use modelos de tamanho para Instagram, YouTube e lojas de apps. Redimensionamento de alta qualidade com Lanczos."
  d1: "Ajuste o tamanho de suas fotos e imagens com precisão profissional de forma simples e rápida. Utilize nossos modelos de tamanho inteligentes para redes sociais ou configure dimensões personalizadas para garantir que fique perfeito em qualquer tela ou impresso."
  t2: "Funcionalidades"
  d21: "30+ tamanhos pré-definidos organizados por categoria"
  d22: "Dimensões personalizadas com bloqueio de proporção"
  d23: "Redimensionamento rápido por porcentagem (25%, 50%, 150%, 200%)"
  d24: "Algoritmo de redimensionamento Lanczos de alta qualidade"
  d25: "Exportar como PNG, JPEG ou WebP"
  t3: "Tamanhos por Categoria"
  d3: "Tamanhos otimizados para cada uso"
  catAppStore: "Loja de Apps"
  catAppStoreDesc: "Ícones, screenshots e gráficos promocionais para apps móveis"
  catSocial: "Redes Sociais"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web & Desktop"
  catWebDesc: "Favicons, imagens OG, wallpapers e banners"
  catEcommerce: "E-commerce"
  catEcommerceDesc: "Imagens de produtos e banners promocionais"
  catPrint: "Impressão"
  catPrintDesc: "A4, A5, fotos e cartões de visita"
  t5: "Como Usar"
  how1t: "Faça upload da sua imagem"
  how1d: "Clique para enviar a imagem que você quer redimensionar. O arquivo é processado localmente no navegador, sem upload para servidores."
  how2t: "Escolha o modo e o tamanho final"
  how2d: "Use um tamanho predefinido, informe dimensões livres em pixels ou aplique uma porcentagem para reduzir ou ampliar a imagem."
  how3t: "Escolha o formato e baixe"
  how3d: "Selecione PNG para máxima qualidade, JPEG para arquivos menores ou WebP para um formato moderno, depois baixe a imagem redimensionada."
  faqTitle: "Perguntas Frequentes"
  faq1q: "Qual tamanho do ícone para loja de apps?"
  faq1a: "Ícones de app devem ter 512×512 pixels para Google Play e App Store. Selecione a categoria 'Loja de Apps' e escolha o modelo 'App Icon' para as dimensões exatas."
  faq2q: "Como redimensionar imagem para Instagram sem cortar?"
  faq2a: "Use o modo por porcentagem para escalar proporcionalmente. Para feed do Instagram, redimensione para caber em 1080px de largura. Para Stories, use 1080×1920 quando a proporção da imagem permitir."
  faq3q: "Qual o melhor tamanho para thumbnail do YouTube?"
  faq3a: "Thumbnails do YouTube devem ter 1280×720 pixels, em proporção 16:9. Selecione 'Redes Sociais' e escolha 'YouTube Thumbnail' para gerar esse tamanho."
  faq4q: "Como diminuir o tamanho do arquivo sem perder qualidade?"
  faq4a: "A ferramenta usa redimensionamento de alta qualidade com Lanczos. Para arquivos menores, exporte como WebP ou JPEG com qualidade alta. Evite ampliar imagens muito além do tamanho original."
  faq5q: "Posso redimensionar imagem para pixels específicos?"
  faq5a: "Sim. Use o modo 'Dimensões Personalizadas' e informe largura e altura exatas em pixels. Ative 'Manter proporção' para recalcular automaticamente a outra dimensão."
  uploadHint: "Suporta JPG, PNG, WebP, GIF e mais"
  original: "Original"
  chooseMode: "Escolha como redimensionar"
  modePreset: "Modelos de Tamanho"
  modeCustom: "Dimensões Personalizadas"
  modePercentage: "Por Porcentagem"
  chooseCategory: "Escolha uma categoria"
  chooseSize: "Escolha o tamanho final"
  choosePercentage: "Escolha uma porcentagem"
  width: "Largura (px)"
  height: "Altura (px)"
  lockRatio: "Manter proporção"
  result: "Resultado"
  chooseFormat: "Escolha o formato de exportação"
  format: "Formato"
  highQuality: "maior qualidade"
  smallerSize: "menor tamanho"
  modern: "formato moderno"
  quality: "Qualidade"
  download: "Baixar"
  restart: "Recomeçar"
  processing: "Processando"
  previewNote: "O download será gerado com essas dimensões."
  see1: "Recortar Imagem"
  see2: "Gerador de QR Code"
  see3: "Cores Dominantes da Imagem"
  see4: "Gerador de Código de Barras"

es:
  title: "Redimensionar Imagen"
  meta: "Redimensiona imágenes online gratis."
  see1: "Recortar Imagen"
  see2: "Generador de QR Code"
  see3: "Colores Dominantes de la Imagen"
  see4: "Generador de Código de Barras"

fr:
  title: "Redimensionner Image"
  meta: "Redimensionnez des images en ligne gratuitement."
  see1: "Rogner Image"
  see2: "Générateur de QR Code"
  see3: "Couleurs Dominantes de l'Image"
  see4: "Générateur de Codes-barres"

it:
  title: "Ridimensiona Immagine"
  meta: "Ridimensiona immagini online gratuitamente."
  see1: "Ritaglia Immagine"
  see2: "Generatore di QR Code"
  see3: "Colori Dominanti dell'Immagine"
  see4: "Generatore di Codici a Barre"

id:
  title: "Pengubah Ukuran Gambar"
  meta: "Ubah ukuran gambar online gratis."
  see1: "Pemotong Gambar"
  see2: "Generator Kode QR"
  see3: "Warna Dominan Gambar"
  see4: "Generator Barcode"
</i18n>
