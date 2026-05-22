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
    { id: 'appIconAndroid', label: 'App Icon (Android)', width: 512, height: 512, description: 'Google Play store icon' },
    { id: 'appIconiOS', label: 'App Icon (iOS)', width: 1024, height: 1024, description: 'Apple App Store icon' },
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
  faq: faqItems.value
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
  pageTitle: "Resize Image Online - Free Tool with Size Models"
  meta: "Resize images to exact dimensions with predefined size models for app stores, social media, web, and print"
  metaDescription: "Resize images online for free. Use size models for app stores, social media, web, and print. High-quality image resizing for sharp, professional results."
  ogTitle: "Resize Image - Free Online Tool"
  ogLocale: "en_US"
  d1: "All processing happens locally in your browser - your images are never uploaded to any server."
  t2: "Features"
  d21: "30+ predefined sizes organized by category"
  d22: "Custom dimensions with aspect ratio lock"
  d23: "Quick resizing by percentage (25%, 50%, 150%, 200%)"
  d24: "Sharp, professional quality resizing"
  d25: "Export as PNG, JPEG, or WebP"
  t3: "Sizes by Category"
  d3: "Optimized sizes for each use case"
  catAppStore: "App Store"
  catAppStoreDesc: "Icons, screenshots, and promotional graphics for mobile apps"
  catSocial: "Social Media"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web & Desktop"
  catWebDesc: "Favicons, OG images, wallpapers, and banners"
  catEcommerce: "E-commerce"
  catEcommerceDesc: "Product images and promotional banners"
  catPrint: "Print"
  catPrintDesc: "A4, A5, photos, and business cards"
  t5: "How to Use"
  how1t: "Upload your image"
  how1d: "Click to upload the image you want to resize. The file is processed locally in your browser, without being sent to any server."
  how2t: "Choose the mode and final size"
  how2d: "Use a predefined size model, enter free dimensions in pixels, or apply a percentage to reduce or enlarge the image."
  how3t: "Choose the format and download"
  how3d: "Select PNG for maximum quality, JPEG for smaller files, or WebP for a modern format, then download the resized image."
  faqTitle: "Frequently Asked Questions"
  faq1q: "What size should an app store icon be?"
  faq1a: "App icons should be 512×512 pixels for Google Play and 1024×1024 for the App Store. Select the 'App Store' category and choose the appropriate model for the exact dimensions."
  faq2q: "How do I resize an image for Instagram without cropping?"
  faq2a: "Use percentage mode to scale proportionally. For the Instagram feed, resize to fit 1080px width. For Stories, use 1080×1920 when the image ratio allows it."
  faq3q: "What is the best size for a YouTube thumbnail?"
  faq3a: "YouTube thumbnails should be 1280×720 pixels in a 16:9 ratio. Select 'Social Media' and choose 'YouTube Thumbnail' to generate that size."
  faq4q: "How do I reduce file size without losing quality?"
  faq4a: "The tool uses professional resizing technology that preserves sharpness. For smaller files, export as WebP or JPEG with high quality. Avoid enlarging images far beyond their original size."
  faq5q: "Can I resize an image to specific pixel dimensions?"
  faq5a: "Yes. Use 'Free Size' mode and enter the exact width and height in pixels. Enable 'Keep aspect ratio' to automatically recalculate the other dimension."
  uploadHint: "Supports JPG, PNG, WebP, GIF, and more"
  original: "Original"
  chooseMode: "How do you want to resize?"
  modePreset: "Size Models"
  modeCustom: "Free Size"
  modePercentage: "By Percentage"
  chooseCategory: "Choose a category"
  chooseSize: "Choose the final size"
  choosePercentage: "Choose a percentage"
  width: "Width (px)"
  height: "Height (px)"
  lockRatio: "Keep aspect ratio"
  result: "Result"
  chooseFormat: "Choose the export format"
  format: "Format"
  highQuality: "higher quality"
  smallerSize: "smaller size"
  modern: "modern format"
  quality: "Quality"
  download: "Download"
  restart: "Start Over"
  processing: "Processing"
  previewNote: "The download will be generated with these dimensions."
  see1: "Crop Image"
  see2: "QR Code Generator"
  see3: "Dominant Colors of Image"
  see4: "Barcode Generator"

pt:
  title: "Redimensionar Imagem"
  pageTitle: "Redimensionar Imagem Online: Ajuste Fotos com Modelos de Tamanho Profissionais"
  meta: "Ferramenta rápida e precisa para redimensionar imagens. Use modelos de tamanho para Instagram, YouTube, e-commerce ou defina tamanhos personalizados com alta qualidade."
  metaDescription: "Redimensione imagens online grátis. Escolha dimensões personalizadas ou use modelos de tamanho para Instagram, YouTube e lojas de apps. Redimensionamento de alta qualidade com nitidez profissional."
  d1: "Ajuste o tamanho de suas fotos e imagens com precisão profissional de forma simples e rápida. Utilize nossos modelos de tamanho inteligentes para redes sociais ou configure dimensões personalizadas para garantir o encaixe perfeito em qualquer tela ou impresso."
  t2: "Funcionalidades"
  d21: "30+ tamanhos pré-definidos organizados por categoria"
  d22: "Dimensões personalizadas com bloqueio de proporção"
  d23: "Redimensionamento rápido por porcentagem (25%, 50%, 150%, 200%)"
  d24: "Redimensionamento nítido com qualidade profissional"
  d25: "Exportar resultado como PNG, JPEG ou WebP"
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
  faqTitle: "Perguntas e Respostas"
  faq1q: "Qual tamanho do ícone para loja de apps?"
  faq1a: "Ícones de app devem ter 512×512 pixels para Google Play e 1024×1024 para App Store. Selecione a categoria 'Loja de Apps' e escolha o modelo apropriado para as dimensões exatas."
  faq2q: "Como redimensionar imagem para Instagram sem cortar?"
  faq2a: "Use o modo por porcentagem para escalar proporcionalmente. Para feed do Instagram, redimensione para caber em 1080px de largura. Para Stories, use 1080×1920 quando a proporção da imagem permitir."
  faq3q: "Qual o melhor tamanho para thumbnail do YouTube?"
  faq3a: "Thumbnails do YouTube devem ter 1280×720 pixels, em proporção 16:9. Selecione 'Redes Sociais' e escolha 'YouTube Thumbnail' para gerar esse tamanho."
  faq4q: "Como diminuir o tamanho do arquivo sem perder qualidade?"
  faq4a: "A ferramenta usa tecnologia de redimensionamento profissional que preserva a nitidez. Para arquivos menores, exporte como WebP ou JPEG com qualidade alta. Evite ampliar imagens muito além do tamanho original."
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
  pageTitle: "Redimensionar Imagen Online - Herramienta Gratis con Modelos de Tamaño"
  meta: "Redimensiona imágenes a dimensiones exactas con modelos de tamaño para tiendas de apps, redes sociales, web e impresión"
  metaDescription: "Redimensiona imágenes online gratis. Usa modelos de tamaño para tiendas de apps, redes sociales, web e impresión. Redimensionamiento de alta calidad para resultados nítidos."
  ogTitle: "Redimensionar Imagen - Herramienta Online Gratis"
  ogLocale: "es_ES"
  d1: "Todo el procesamiento ocurre localmente en tu navegador - tus imágenes nunca se suben a ningún servidor."
  t2: "Funciones"
  d21: "Más de 30 modelos de tamaño organizados por categoría"
  d22: "Dimensiones personalizadas con bloqueo de proporción"
  d23: "Redimensionamiento rápido por porcentaje (25%, 50%, 150%, 200%)"
  d24: "Redimensionamiento nítido con calidad profesional"
  d25: "Exportar resultado como PNG, JPEG o WebP"
  t3: "Tamaños por Categoría"
  d3: "Tamaños optimizados para cada uso"
  catAppStore: "Tienda de Apps"
  catAppStoreDesc: "Iconos, capturas de pantalla y gráficos promocionales para apps móviles"
  catSocial: "Redes Sociales"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web y Escritorio"
  catWebDesc: "Favicons, imágenes OG, fondos de pantalla y banners"
  catEcommerce: "E-commerce"
  catEcommerceDesc: "Imágenes de productos y banners promocionales"
  catPrint: "Impresión"
  catPrintDesc: "A4, A5, fotos y tarjetas de presentación"
  t5: "Cómo Usarlo"
  how1t: "Sube tu imagen"
  how1d: "Haz clic para subir la imagen que quieres redimensionar. El archivo se procesa localmente en tu navegador, sin enviarse a ningún servidor."
  how2t: "Elige el modo y el tamaño final"
  how2d: "Usa un modelo de tamaño, introduce dimensiones libres en píxeles o aplica un porcentaje para reducir o ampliar la imagen."
  how3t: "Elige el formato y descarga"
  how3d: "Selecciona PNG para máxima calidad, JPEG para archivos más pequeños o WebP para un formato moderno y luego descarga la imagen redimensionada."
  faqTitle: "Preguntas y Respuestas"
  faq1q: "¿Qué tamaño debe tener un icono para tienda de apps?"
  faq1a: "Los iconos de app deben tener 512×512 píxeles para Google Play y 1024×1024 para App Store. Selecciona la categoría 'Tienda de Apps' y elige el modelo apropiado para las dimensiones exactas."
  faq2q: "¿Cómo redimensiono una imagen para Instagram sin recortarla?"
  faq2a: "Usa el modo por porcentaje para escalar proporcionalmente. Para el feed de Instagram, ajusta el ancho a 1080 px. Para Stories, usa 1080×1920 cuando la proporción de la imagen lo permita."
  faq3q: "¿Cuál es el mejor tamaño para una miniatura de YouTube?"
  faq3a: "Las miniaturas de YouTube deben tener 1280×720 píxeles con proporción 16:9. Selecciona 'Redes Sociales' y elige 'YouTube Thumbnail' para generar ese tamaño."
  faq4q: "¿Cómo reduzco el tamaño del archivo sin perder calidad?"
  faq4a: "La herramienta usa tecnología de redimensionamiento profesional que preserva la nitidez. Para archivos más pequeños, exporta como WebP o JPEG con calidad alta."
  faq5q: "¿Puedo redimensionar una imagen para píxeles específicos?"
  faq5a: "Sí. Usa el modo 'Dimensiones Personalizadas' e introduce el ancho y el alto exactos en píxeles. Activa 'Mantener proporción' para recalcular automáticamente la otra dimensión."
  uploadHint: "Compatible con JPG, PNG, WebP, GIF y más"
  original: "Original"
  chooseMode: "¿Cómo quieres redimensionar?"
  modePreset: "Modelos de Tamaño"
  modeCustom: "Dimensiones Personalizadas"
  modePercentage: "Por Porcentaje"
  chooseCategory: "Elige una categoría"
  chooseSize: "Elige el tamaño final"
  choosePercentage: "Elige un porcentaje"
  width: "Ancho (px)"
  height: "Alto (px)"
  lockRatio: "Mantener proporción"
  result: "Resultado"
  chooseFormat: "Elige el formato de exportación"
  format: "Formato"
  highQuality: "mayor calidad"
  smallerSize: "menor tamaño"
  modern: "formato moderno"
  quality: "Calidad"
  download: "Descargar"
  restart: "Reiniciar"
  processing: "Procesando"
  previewNote: "La descarga se generará con estas dimensiones."
  see1: "Recortar Imagen"
  see2: "Generador de QR Code"
  see3: "Colores Dominantes de la Imagen"
  see4: "Generador de Código de Barras"

fr:
  title: "Redimensionner une Image"
  pageTitle: "Redimensionner une Image en Ligne : ajustez vos photos avec des tailles prédéfinies professionnelles"
  meta: "Outil rapide et précis pour redimensionner des images. Utilisez des tailles prédéfinies pour Instagram, YouTube, l'e-commerce ou définissez des dimensions personnalisées avec un rendu de haute qualité."
  metaDescription: "Redimensionnez des images en ligne gratuitement. Choisissez des dimensions personnalisées ou utilisez des tailles prédéfinies pour Instagram, YouTube et les stores d'applications. Redimensionnement de haute qualité."
  d1: "Ajustez la taille de vos photos et images avec une précision professionnelle, simplement et rapidement. Utilisez nos tailles prédéfinies pour les réseaux sociaux ou configurez des dimensions personnalisées afin d'obtenir un rendu parfait sur n'importe quel écran ou support imprimé."
  t2: "Fonctionnalités"
  d21: "30+ tailles prédéfinies organisées par catégorie"
  d22: "Dimensions personnalisées avec verrouillage des proportions"
  d23: "Redimensionnement rapide par pourcentage (25%, 50%, 150%, 200%)"
  d24: "Redimensionnement net avec qualité professionnelle"
  d25: "Exporter le résultat au format PNG, JPEG ou WebP"
  t3: "Tailles par catégorie"
  d3: "Tailles optimisées pour chaque usage"
  catAppStore: "Stores d'applications"
  catAppStoreDesc: "Icônes, captures d'écran et visuels promotionnels pour applications mobiles"
  catSocial: "Réseaux sociaux"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web & Bureau"
  catWebDesc: "Favicons, images OG, fonds d'écran et bannières"
  catEcommerce: "E-commerce"
  catEcommerceDesc: "Images de produits et bannières promotionnelles"
  catPrint: "Impression"
  catPrintDesc: "A4, A5, photos et cartes de visite"
  t5: "Comment utiliser"
  how1t: "Téléchargez votre image"
  how1d: "Cliquez pour téléverser l'image que vous souhaitez redimensionner. Le fichier est traité localement dans le navigateur, sans envoi vers un serveur."
  how2t: "Choisissez le mode et la taille finale"
  how2d: "Utilisez une taille prédéfinie, saisissez des dimensions libres en pixels ou appliquez un pourcentage pour réduire ou agrandir l'image."
  how3t: "Choisissez le format et téléchargez"
  how3d: "Sélectionnez PNG pour une qualité maximale, JPEG pour des fichiers plus petits ou WebP pour un format moderne, puis téléchargez l'image redimensionnée."
  faqTitle: "Questions fréquentes"
  faq1q: "Quelle taille d'icône pour les stores d'applications ?"
  faq1a: "Les icônes d'application doivent mesurer 512×512 pixels pour Google Play et 1024×1024 pour l'App Store. Sélectionnez la catégorie 'Stores d'applications' et choisissez la taille appropriée."
  faq2q: "Comment redimensionner une image pour Instagram sans la rogner ?"
  faq2a: "Utilisez le mode par pourcentage pour une mise à l'échelle proportionnelle. Pour le fil Instagram, redimensionnez l'image à 1080 px de large. Pour les Stories, utilisez 1080×1920 si les proportions de l'image le permettent."
  faq3q: "Quelle est la meilleure taille pour une miniature YouTube ?"
  faq3a: "Les miniatures YouTube doivent mesurer 1280×720 pixels, avec un ratio 16:9. Sélectionnez 'Réseaux sociaux' et choisissez 'YouTube Thumbnail'."
  faq4q: "Comment réduire la taille du fichier sans perdre de qualité ?"
  faq4a: "L'outil utilise une technologie de redimensionnement professionnelle qui préserve la netteté. Pour des fichiers plus légers, exportez en WebP ou en JPEG avec une qualité élevée."
  faq5q: "Puis-je redimensionner une image à des pixels spécifiques ?"
  faq5a: "Oui. Utilisez le mode 'Dimensions personnalisées' et saisissez la largeur et la hauteur exactes en pixels. Activez 'Conserver les proportions' pour recalculer automatiquement l'autre dimension."
  uploadHint: "Prend en charge JPG, PNG, WebP, GIF et plus"
  original: "Original"
  chooseMode: "Choisissez comment redimensionner"
  modePreset: "Tailles prédéfinies"
  modeCustom: "Dimensions personnalisées"
  modePercentage: "Par pourcentage"
  chooseCategory: "Choisissez une catégorie"
  chooseSize: "Choisissez la taille finale"
  choosePercentage: "Choisissez un pourcentage"
  width: "Largeur (px)"
  height: "Hauteur (px)"
  lockRatio: "Conserver les proportions"
  result: "Résultat"
  chooseFormat: "Choisissez le format d'exportation"
  format: "Format"
  highQuality: "meilleure qualité"
  smallerSize: "taille réduite"
  modern: "format moderne"
  quality: "Qualité"
  download: "Télécharger"
  restart: "Recommencer"
  processing: "Traitement en cours"
  previewNote: "Le téléchargement sera généré avec ces dimensions."

it:
  title: "Ridimensiona Immagine"
  pageTitle: "Ridimensiona Immagine Online: adatta le foto con dimensioni predefinite professionali"
  meta: "Strumento rapido e preciso per ridimensionare immagini. Usa dimensioni predefinite per Instagram, YouTube, e-commerce oppure imposta misure personalizzate con alta qualità."
  metaDescription: "Ridimensiona immagini online gratuitamente. Scegli dimensioni personalizzate o usa dimensioni predefinite per Instagram, YouTube e store di app. Ridimensionamento di alta qualità."
  d1: "Regola le dimensioni delle tue foto e immagini con precisione professionale in modo semplice e veloce. Usa le nostre dimensioni predefinite per i social network oppure configura misure personalizzate per ottenere un risultato perfetto su qualsiasi schermo o supporto stampato."
  t2: "Funzionalità"
  d21: "30+ dimensioni predefinite organizzate per categoria"
  d22: "Dimensioni personalizzate con blocco delle proporzioni"
  d23: "Ridimensionamento rapido in percentuale (25%, 50%, 150%, 200%)"
  d24: "Ridimensionamento nitido con qualità professionale"
  d25: "Esporta il risultato come PNG, JPEG o WebP"
  t3: "Dimensioni per categoria"
  d3: "Dimensioni ottimizzate per ogni utilizzo"
  catAppStore: "Store di app"
  catAppStoreDesc: "Icone, screenshot e grafiche promozionali per app mobili"
  catSocial: "Social Network"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web & Desktop"
  catWebDesc: "Favicon, immagini OG, sfondi e banner"
  catEcommerce: "E-commerce"
  catEcommerceDesc: "Immagini di prodotti e banner promozionali"
  catPrint: "Stampa"
  catPrintDesc: "A4, A5, foto e biglietti da visita"
  t5: "Come usare"
  how1t: "Carica la tua immagine"
  how1d: "Clicca per caricare l'immagine che desideri ridimensionare. Il file viene elaborato localmente nel browser, senza caricamento sui server."
  how2t: "Scegli la modalità e la dimensione finale"
  how2d: "Usa una dimensione predefinita, inserisci misure libere in pixel oppure applica una percentuale per ridurre o ingrandire l'immagine."
  how3t: "Scegli il formato e scarica"
  how3d: "Seleziona PNG per la massima qualità, JPEG per file più piccoli o WebP per un formato moderno, quindi scarica l'immagine ridimensionata."
  faqTitle: "Domande frequenti"
  faq1q: "Qual è la dimensione dell'icona per lo store di app?"
  faq1a: "Le icone delle app devono essere di 512×512 pixel per Google Play e 1024×1024 per l'App Store. Seleziona la categoria 'Store di app' e scegli la dimensione appropriata."
  faq2q: "Come ridimensionare un'immagine per Instagram senza ritagliarla?"
  faq2a: "Usa la modalità percentuale per ridimensionare in modo proporzionale. Per il feed di Instagram, porta l'immagine a 1080 px di larghezza. Per le Stories, usa 1080×1920 se le proporzioni dell'immagine lo consentono."
  faq3q: "Qual è la dimensione migliore per la miniatura di YouTube?"
  faq3a: "Le miniature di YouTube devono essere di 1280×720 pixel, con rapporto 16:9. Seleziona 'Social Network' e scegli 'YouTube Thumbnail'."
  faq4q: "Come ridurre la dimensione del file senza perdere qualità?"
  faq4a: "Lo strumento utilizza una tecnologia di ridimensionamento professionale che preserva la nitidezza. Per file più leggeri, esporta in WebP o JPEG con qualità elevata."
  faq5q: "Posso ridimensionare l'immagine a pixel specifici?"
  faq5a: "Sì. Usa la modalità 'Dimensioni personalizzate' e inserisci larghezza e altezza esatte in pixel. Attiva 'Mantieni proporzioni' per ricalcolare automaticamente l'altra dimensione."
  uploadHint: "Supporta JPG, PNG, WebP, GIF e altro"
  original: "Originale"
  chooseMode: "Scegli come ridimensionare"
  modePreset: "Dimensioni predefinite"
  modeCustom: "Dimensioni personalizzate"
  modePercentage: "In percentuale"
  chooseCategory: "Scegli una categoria"
  chooseSize: "Scegli la dimensione finale"
  choosePercentage: "Scegli una percentuale"
  width: "Larghezza (px)"
  height: "Altezza (px)"
  lockRatio: "Mantieni proporzioni"
  result: "Risultato"
  chooseFormat: "Scegli il formato di esportazione"
  format: "Formato"
  highQuality: "migliore qualità"
  smallerSize: "dimensioni ridotte"
  modern: "formato moderno"
  quality: "Qualità"
  download: "Scarica"
  restart: "Ricomincia"
  processing: "Elaborazione in corso"
  previewNote: "Il download sarà generato con queste dimensioni."
  see1: "Ritaglia Immagine"
  see2: "Generatore di QR Code"
  see3: "Colori Dominanti dell'Immagine"
  see4: "Generatore di Codici a Barre"

id:
  title: "Ubah Ukuran Gambar"
  pageTitle: "Ubah Ukuran Gambar Online: sesuaikan foto dengan preset ukuran profesional"
  meta: "Alat cepat dan akurat untuk mengubah ukuran gambar. Gunakan preset ukuran untuk Instagram, YouTube, e-commerce, atau atur ukuran khusus dengan kualitas tinggi."
  metaDescription: "Ubah ukuran gambar online gratis. Pilih dimensi khusus atau gunakan preset ukuran untuk Instagram, YouTube, dan toko aplikasi. Pengubahan ukuran berkualitas tinggi."
  d1: "Sesuaikan ukuran foto dan gambar Anda dengan presisi profesional secara cepat dan mudah. Gunakan preset ukuran kami untuk media sosial atau atur dimensi khusus agar hasilnya pas di layar maupun media cetak."
  t2: "Fitur"
  d21: "30+ ukuran preset yang disusun berdasarkan kategori"
  d22: "Dimensi khusus dengan kunci rasio aspek"
  d23: "Ubah ukuran cepat berdasarkan persentase (25%, 50%, 150%, 200%)"
  d24: "Ubah ukuran tajam dengan kualitas profesional"
  d25: "Ekspor hasil sebagai PNG, JPEG, atau WebP"
  t3: "Ukuran berdasarkan kategori"
  d3: "Ukuran yang dioptimalkan untuk setiap penggunaan"
  catAppStore: "Toko Aplikasi"
  catAppStoreDesc: "Ikon, tangkapan layar, dan grafik promosi untuk aplikasi seluler"
  catSocial: "Media Sosial"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web & Desktop"
  catWebDesc: "Favicon, gambar OG, wallpaper, dan banner"
  catEcommerce: "E-commerce"
  catEcommerceDesc: "Gambar produk dan banner promosi"
  catPrint: "Cetak"
  catPrintDesc: "A4, A5, foto, dan kartu nama"
  t5: "Cara menggunakan"
  how1t: "Unggah gambar Anda"
  how1d: "Klik untuk mengunggah gambar yang ingin Anda ubah ukurannya. File diproses secara lokal di browser, tanpa diunggah ke server."
  how2t: "Pilih mode dan ukuran akhir"
  how2d: "Gunakan preset ukuran, masukkan dimensi bebas dalam piksel, atau terapkan persentase untuk memperkecil atau memperbesar gambar."
  how3t: "Pilih format dan unduh"
  how3d: "Pilih PNG untuk kualitas maksimal, JPEG untuk file lebih kecil, atau WebP untuk format modern, lalu unduh gambar yang telah diubah ukurannya."
  faqTitle: "Pertanyaan umum"
  faq1q: "Berapa ukuran ikon untuk toko aplikasi?"
  faq1a: "Ikon aplikasi harus berukuran 512×512 piksel untuk Google Play dan 1024×1024 untuk App Store. Pilih kategori 'Toko Aplikasi' dan gunakan preset yang sesuai."
  faq2q: "Bagaimana cara mengubah ukuran gambar untuk Instagram tanpa memotong?"
  faq2a: "Gunakan mode persentase untuk menskalakan secara proporsional. Untuk feed Instagram, ubah ukuran gambar ke lebar 1080 px. Untuk Stories, gunakan 1080×1920 jika rasio gambar memungkinkan."
  faq3q: "Berapa ukuran terbaik untuk thumbnail YouTube?"
  faq3a: "Thumbnail YouTube harus berukuran 1280×720 piksel dengan rasio 16:9. Pilih 'Media Sosial' lalu pilih 'YouTube Thumbnail'."
  faq4q: "Bagaimana cara memperkecil ukuran file tanpa kehilangan kualitas?"
  faq4a: "Alat ini menggunakan teknologi pengubahan ukuran profesional yang menjaga ketajaman. Untuk file yang lebih kecil, ekspor sebagai WebP atau JPEG dengan kualitas tinggi."
  faq5q: "Dapatkah saya mengubah ukuran gambar ke piksel tertentu?"
  faq5a: "Ya. Gunakan mode 'Dimensi Khusus' dan masukkan lebar serta tinggi yang tepat dalam piksel. Aktifkan 'Jaga rasio aspek' untuk menghitung ulang dimensi lainnya secara otomatis."
  uploadHint: "Mendukung JPG, PNG, WebP, GIF, dan lainnya"
  original: "Asli"
  chooseMode: "Pilih cara mengubah ukuran"
  modePreset: "Preset Ukuran"
  modeCustom: "Dimensi Khusus"
  modePercentage: "Berdasarkan Persentase"
  chooseCategory: "Pilih kategori"
  chooseSize: "Pilih ukuran akhir"
  choosePercentage: "Pilih persentase"
  width: "Lebar (px)"
  height: "Tinggi (px)"
  lockRatio: "Jaga rasio aspek"
  result: "Hasil"
  chooseFormat: "Pilih format ekspor"
  format: "Format"
  highQuality: "kualitas terbaik"
  smallerSize: "ukuran lebih kecil"
  modern: "format modern"
  quality: "Kualitas"
  download: "Unduh"
  restart: "Mulai Ulang"
  processing: "Sedang Memproses"
  previewNote: "Unduhan akan dibuat dengan dimensi ini."
  see1: "Pemotong Gambar"
  see2: "Generator Kode QR"
  see3: "Warna Dominan Gambar"
  see4: "Generator Barcode"

de:
  title: "Bildgröße ändern"
  pageTitle: "Bildgröße online ändern - Kostenloses Tool mit Größenvorlagen"
  meta: "Ändere Bilder auf exakte Abmessungen mit vordefinierten Größen für App Stores, soziale Netzwerke, Web und Druck."
  metaDescription: "Bilder online kostenlos skalieren. Verwende Größenvorlagen für App Stores, soziale Medien, Web und Druck. Hochwertige Bildskalierung für scharfe Ergebnisse."
  ogTitle: "Bildgröße ändern - Kostenloses Online-Tool"
  ogLocale: "de_DE"
  d1: "Die gesamte Verarbeitung findet lokal in deinem Browser statt - deine Bilder werden niemals auf einen Server hochgeladen."
  t2: "Funktionen"
  d21: "30+ Größenvorlagen nach Kategorie organisiert"
  d22: "Benutzerdefinierte Abmessungen mit gesperrtem Seitenverhältnis"
  d23: "Schnelles Skalieren nach Prozent (25 %, 50 %, 150 %, 200 %)"
  d24: "Scharfe Skalierung in Profi-Qualität"
  d25: "Export als PNG, JPEG oder WebP"
  t3: "Größen nach Kategorie"
  d3: "Optimierte Größen für jeden Anwendungsfall"
  catAppStore: "App Store"
  catAppStoreDesc: "Symbole, Screenshots und Werbegrafiken für mobile Apps"
  catSocial: "Soziale Medien"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web & Desktop"
  catWebDesc: "Favicons, OG-Bilder, Hintergrundbilder und Banner"
  catEcommerce: "E-Commerce"
  catEcommerceDesc: "Produktbilder und Werbebanner"
  catPrint: "Druck"
  catPrintDesc: "A4, A5, Fotos und Visitenkarten"
  t5: "So funktioniert's"
  how1t: "Lade dein Bild hoch"
  how1d: "Klicke, um das Bild hochzuladen, dessen Größe du ändern möchtest. Die Datei wird lokal in deinem Browser verarbeitet und nicht an einen Server gesendet."
  how2t: "Wähle Modus und Zielgröße"
  how2d: "Verwende eine Größenvorlage, gib freie Pixelmaße ein oder wende einen Prozentsatz an, um das Bild zu verkleinern oder zu vergrößern."
  how3t: "Wähle das Format und lade herunter"
  how3d: "Wähle PNG für maximale Qualität, JPEG für kleinere Dateien oder WebP für ein modernes Format und lade dann das skalierte Bild herunter."
  faqTitle: "Häufig gestellte Fragen"
  faq1q: "Welche Größe sollte ein App-Store-Symbol haben?"
  faq1a: "App-Symbole sollten für Google Play 512×512 Pixel und für den App Store 1024×1024 Pixel haben. Wähle die Kategorie 'App Store' und die passende Vorlage für die exakten Abmessungen."
  faq2q: "Wie ändere ich die Bildgröße für Instagram ohne Zuschneiden?"
  faq2a: "Verwende den Prozentmodus, um proportional zu skalieren. Für den Instagram-Feed passe die Breite auf 1080 px an. Für Stories nutze 1080×1920, wenn das Seitenverhältnis des Bildes dazu passt."
  faq3q: "Welche Größe ist am besten für ein YouTube-Thumbnail?"
  faq3a: "YouTube-Thumbnails sollten 1280×720 Pixel im Verhältnis 16:9 haben. Wähle 'Soziale Medien' und dann 'YouTube Thumbnail', um diese Größe zu erzeugen."
  faq4q: "Wie reduziere ich die Dateigröße ohne Qualitätsverlust?"
  faq4a: "Das Tool verwendet professionelle Skalierungstechnologie, die die Schärfe bewahrt. Für kleinere Dateien exportiere als WebP oder JPEG mit hoher Qualität. Vermeide es, Bilder weit über ihre Originalgröße hinaus zu vergrößern."
  faq5q: "Kann ich die Bildgröße auf bestimmte Pixelmaße ändern?"
  faq5a: "Ja. Verwende den Modus 'Benutzerdefinierte Größe' und gib die exakte Breite und Höhe in Pixeln ein. Aktiviere 'Seitenverhältnis beibehalten', damit die andere Dimension automatisch berechnet wird."
  uploadHint: "Unterstützt JPG, PNG, WebP, GIF und mehr"
  original: "Original"
  chooseMode: "Wie möchtest du die Bildgröße ändern?"
  modePreset: "Größenvorlagen"
  modeCustom: "Benutzerdefinierte Größe"
  modePercentage: "Nach Prozent"
  chooseCategory: "Wähle eine Kategorie"
  chooseSize: "Wähle die Zielgröße"
  choosePercentage: "Wähle einen Prozentsatz"
  width: "Breite (px)"
  height: "Höhe (px)"
  lockRatio: "Seitenverhältnis beibehalten"
  result: "Ergebnis"
  chooseFormat: "Wähle das Exportformat"
  format: "Format"
  highQuality: "höhere Qualität"
  smallerSize: "kleinere Dateigröße"
  modern: "modernes Format"
  quality: "Qualität"
  download: "Herunterladen"
  restart: "Neu starten"
  processing: "Wird verarbeitet"
  previewNote: "Der Download wird mit diesen Abmessungen erstellt."
  see1: "Bild zuschneiden"
  see2: "QR-Code-Generator"
  see3: "Dominante Farben des Bildes"
  see4: "Barcode-Generator"

nl:
  title: "Afbeelding schalen"
  pageTitle: "Afbeelding online schalen - Gratis tool met formaatvoorinstellingen"
  meta: "Schaal afbeeldingen naar exacte afmetingen met vooraf ingestelde formaten voor appstores, sociale media, web en drukwerk."
  metaDescription: "Schaal afbeeldingen gratis online. Gebruik formaatvoorinstellingen voor appstores, sociale media, web en drukwerk. Hoogwaardige beeldschaling voor scherpe resultaten."
  ogTitle: "Afbeelding schalen - Gratis online tool"
  ogLocale: "nl_NL"
  d1: "Alle verwerking vindt lokaal plaats in je browser - je afbeeldingen worden nooit naar een server verzonden."
  t2: "Functies"
  d21: "30+ formaatvoorinstellingen per categorie"
  d22: "Aangepaste afmetingen met vergrendeling van de beeldverhouding"
  d23: "Snel schalen op percentage (25%, 50%, 150%, 200%)"
  d24: "Scherp schalen met professionele kwaliteit"
  d25: "Exporteren als PNG, JPEG of WebP"
  t3: "Formaten per categorie"
  d3: "Geoptimaliseerde formaten voor elk gebruik"
  catAppStore: "App Store"
  catAppStoreDesc: "Pictogrammen, screenshots en promotionele afbeeldingen voor mobiele apps"
  catSocial: "Sociale media"
  catSocialDesc: "Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook"
  catWeb: "Web & Desktop"
  catWebDesc: "Favicons, OG-afbeeldingen, achtergronden en banners"
  catEcommerce: "E-commerce"
  catEcommerceDesc: "Productafbeeldingen en promotiebanners"
  catPrint: "Drukwerk"
  catPrintDesc: "A4, A5, foto's en visitekaartjes"
  t5: "Hoe te gebruiken"
  how1t: "Upload je afbeelding"
  how1d: "Klik om de afbeelding te uploaden die je wilt schalen. Het bestand wordt lokaal in je browser verwerkt en niet naar een server verzonden."
  how2t: "Kies modus en eindformaat"
  how2d: "Gebruik een formaatvoorinstelling, voer vrije pixelmaten in of pas een percentage toe om de afbeelding te verkleinen of te vergroten."
  how3t: "Kies het formaat en download"
  how3d: "Kies PNG voor maximale kwaliteit, JPEG voor kleinere bestanden of WebP voor een modern formaat, en download vervolgens de geschaalde afbeelding."
  faqTitle: "Veelgestelde vragen"
  faq1q: "Welke maat moet een app store-pictogram hebben?"
  faq1a: "App-pictogrammen moeten 512×512 pixels zijn voor Google Play en 1024×1024 voor de App Store. Selecteer de categorie 'App Store' en kies de juiste voorinstelling voor de exacte afmetingen."
  faq2q: "Hoe verander ik de grootte van een afbeelding voor Instagram zonder bijsnijden?"
  faq2a: "Gebruik de percentagemodus om proportioneel te schalen. Voor de Instagram-feed pas je de breedte aan naar 1080 px. Voor Stories gebruik je 1080×1920 als de beeldverhouding van de afbeelding dit toelaat."
  faq3q: "Wat is de beste maat voor een YouTube-thumbnail?"
  faq3a: "YouTube-thumbnails moeten 1280×720 pixels zijn in een 16:9-verhouding. Kies 'Sociale media' en vervolgens 'YouTube Thumbnail' om dit formaat te genereren."
  faq4q: "Hoe verklein ik de bestandsgrootte zonder kwaliteitsverlies?"
  faq4a: "De tool maakt gebruik van professionele schaaltechnologie die de scherpte behoudt. Voor kleinere bestanden exporteer je als WebP of JPEG met hoge kwaliteit."
  faq5q: "Kan ik de afmetingen van een afbeelding wijzigen naar specifieke pixels?"
  faq5a: "Ja. Gebruik de modus 'Aangepaste afmetingen' en vul de exacte breedte en hoogte in pixels in. Schakel 'Beeldverhouding behouden' in om de andere afmeting automatisch te laten berekenen."
  uploadHint: "Ondersteunt JPG, PNG, WebP, GIF en meer"
  original: "Origineel"
  chooseMode: "Hoe wil je het formaat aanpassen?"
  modePreset: "Formaatvoorinstellingen"
  modeCustom: "Aangepaste afmetingen"
  modePercentage: "Op percentage"
  chooseCategory: "Kies een categorie"
  chooseSize: "Kies het eindformaat"
  choosePercentage: "Kies een percentage"
  width: "Breedte (px)"
  height: "Hoogte (px)"
  lockRatio: "Beeldverhouding behouden"
  result: "Resultaat"
  chooseFormat: "Kies het exportformaat"
  format: "Formaat"
  highQuality: "hogere kwaliteit"
  smallerSize: "kleinere bestandsgrootte"
  modern: "modern formaat"
  quality: "Kwaliteit"
  download: "Downloaden"
  restart: "Opnieuw beginnen"
  processing: "Bezig met verwerken"
  previewNote: "De download wordt met deze afmetingen gegenereerd."
  see1: "Afbeelding bijsnijden"
  see2: "QR-codegenerator"
  see3: "Dominante kleuren van de afbeelding"
  see4: "Barcodegenerator"
</i18n>
