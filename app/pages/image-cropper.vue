<script setup lang="ts">
declare global {
  interface Window { Cropper: any }
}

const { t } = useI18n({ useScope: 'local' })

const imageRef = ref<HTMLImageElement | null>(null)
const imageSrc = ref('')
const imageLoaded = ref(false)
const scriptReady = ref(false)
let cropper: any = null

const selectedPresetId = ref('free')
const customWidth = ref(800)
const customHeight = ref(600)
const exportFormat = ref<'png' | 'jpeg' | 'webp'>('png')
const quality = ref(90)
const scaleX = ref(1)
const scaleY = ref(1)

const presets = computed(() => [
  { id: 'free',          label: t('preset_free'),      ratio: NaN },
  { id: 'square',        label: `1:1 — ${t('preset_square')}`,      ratio: 1 },
  { id: 'portrait',      label: `4:5 — ${t('preset_portrait')}`,    ratio: 4 / 5 },
  { id: 'stories',       label: `9:16 — ${t('preset_stories')}`,    ratio: 9 / 16 },
  { id: 'landscape',     label: `1.91:1 — ${t('preset_landscape')}`, ratio: 1.91 },
  { id: 'youtube',       label: `16:9 — YouTube`,      ratio: 16 / 9 },
  { id: 'twitter',       label: `3:1 — Twitter/X Header`, ratio: 3 },
  { id: 'linkedin',      label: `4:1 — LinkedIn Cover`, ratio: 4 },
  { id: 'pinterest',     label: `2:3 — Pinterest`,     ratio: 2 / 3 },
  { id: 'custom',        label: t('preset_custom'),    ratio: NaN },
])

const currentPreset = computed(() => presets.value.find(p => p.id === selectedPresetId.value))

const faqItems = computed(() => [
  { question: t('faq_1_q'), answer: t('faq_1_a') },
  { question: t('faq_2_q'), answer: t('faq_2_a') },
  { question: t('faq_3_q'), answer: t('faq_3_a') },
  { question: t('faq_4_q'), answer: t('faq_4_a') },
  { question: t('faq_5_q'), answer: t('faq_5_a') },
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
  link: [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css' },
  ],
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:title', content: t('og_title') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: t('og_title') },
    { name: 'twitter:description', content: t('meta') },
  ],
})

const { onLoaded } = useScript('https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js', { trigger: 'client' })

onLoaded(() => {
  scriptReady.value = true
  if (imageLoaded.value) initCropper()
})

onBeforeUnmount(() => destroyCropper())

function onImageSelected(file: File) {
  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value)
  imageSrc.value = URL.createObjectURL(file)
  imageLoaded.value = true
  nextTick(() => {
    if (scriptReady.value) initCropper()
  })
}

function initCropper() {
  if (!imageRef.value || !window.Cropper) return
  destroyCropper()
  const ratio = currentPreset.value?.ratio
  cropper = new window.Cropper(imageRef.value, {
    aspectRatio: ratio !== undefined && !isNaN(ratio) ? ratio : NaN,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.8,
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    responsive: true,
    background: true,
  })
}

function destroyCropper() {
  if (cropper) { cropper.destroy(); cropper = null }
}

function onPresetChange() {
  if (!cropper) return
  if (selectedPresetId.value === 'custom') {
    cropper.setAspectRatio(customWidth.value / customHeight.value)
  } else {
    const ratio = currentPreset.value?.ratio
    cropper.setAspectRatio(ratio !== undefined && !isNaN(ratio) ? ratio : NaN)
  }
}

function updateCustomAspectRatio() {
  if (cropper && selectedPresetId.value === 'custom') {
    cropper.setAspectRatio(customWidth.value / customHeight.value)
  }
}

function rotate(deg: number) { cropper?.rotate(deg) }

function flipH() { scaleX.value *= -1; cropper?.scaleX(scaleX.value) }
function flipV() { scaleY.value *= -1; cropper?.scaleY(scaleY.value) }
function zoomIn() { cropper?.zoom(0.1) }
function zoomOut() { cropper?.zoom(-0.1) }

function resetCrop() {
  cropper?.reset()
  scaleX.value = 1
  scaleY.value = 1
}

function download() {
  if (!cropper) return
  const opts: Record<string, unknown> = { imageSmoothingEnabled: true, imageSmoothingQuality: 'high' }
  if (selectedPresetId.value === 'custom') { opts.width = customWidth.value; opts.height = customHeight.value }
  const canvas = cropper.getCroppedCanvas(opts)
  if (!canvas) return
  const mime = exportFormat.value === 'jpeg' ? 'image/jpeg' : exportFormat.value === 'webp' ? 'image/webp' : 'image/png'
  const q = exportFormat.value === 'png' ? undefined : quality.value / 100
  canvas.toBlob((blob: Blob | null) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cropped.${exportFormat.value}`
    a.click()
    URL.revokeObjectURL(url)
  }, mime, q)
}

function newImage() {
  destroyCropper()
  imageLoaded.value = false
  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value)
  imageSrc.value = ''
  scaleX.value = 1
  scaleY.value = 1
  selectedPresetId.value = 'free'
}

defineI18nRoute({
  paths: {
    pt: '/recortar-imagem',
    es: '/recortar-imagen',
    fr: '/rogner-image',
    it: '/ritaglia-immagine',
    id: '/pemotong-gambar',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="imageLoaded"
    :see-also-links="[
      { label: t('see1'), to: 'dominant-colors-of-the-image' },
      { label: t('see2'), to: 'qrcode-generator' },
      { label: t('see3'), to: 'barcode-generator' },
      { label: t('see4'), to: 'image-resizer' },
    ]"
  >
    <!-- Upload state -->
    <div v-if="!imageLoaded" class="flex flex-col items-center justify-center py-8 gap-4">
      <ImageUploader :show="true" @on-file="onImageSelected" />
      <p class="text-sm text-base-content/50">{{ t('upload_hint') }}</p>
    </div>

    <!-- Cropper state -->
    <div v-else class="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">

      <!-- Controls -->
      <div class="space-y-4">
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
          <label class="form-control w-full">
            <span class="label-text mb-2 font-bold">{{ t('aspect_ratio') }}</span>
            <select v-model="selectedPresetId" class="select select-bordered bg-base-100 w-full" @change="onPresetChange">
              <option v-for="p in presets" :key="p.id" :value="p.id">{{ p.label }}</option>
            </select>
          </label>

          <div v-if="selectedPresetId === 'custom'" class="grid grid-cols-2 gap-2">
            <label class="form-control">
              <span class="label-text mb-1 font-semibold">{{ t('width') }}</span>
              <input type="number" v-model.number="customWidth" min="1" class="input input-bordered bg-base-100 w-full" @change="updateCustomAspectRatio" />
            </label>
            <label class="form-control">
              <span class="label-text mb-1 font-semibold">{{ t('height') }}</span>
              <input type="number" v-model.number="customHeight" min="1" class="input input-bordered bg-base-100 w-full" @change="updateCustomAspectRatio" />
            </label>
          </div>
        </section>

        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-2 text-base-content/60">{{ t('rotate') }}</p>
            <div class="flex gap-2">
              <button type="button" class="btn btn-sm btn-ghost flex-1" :aria-label="t('rotate_left')" @click="rotate(-90)">
                <Icon name="heroicons:arrow-uturn-left-20-solid" class="w-4 h-4" /> -90°
              </button>
              <button type="button" class="btn btn-sm btn-ghost flex-1" :aria-label="t('rotate_right')" @click="rotate(90)">
                +90° <Icon name="heroicons:arrow-uturn-right-20-solid" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-2 text-base-content/60">{{ t('flip') }}</p>
            <div class="flex gap-2">
              <button type="button" class="btn btn-sm btn-ghost flex-1" :aria-label="t('flip_h')" @click="flipH">
                <Icon name="heroicons:arrows-right-left-20-solid" class="w-4 h-4" /> {{ t('horizontal') }}
              </button>
              <button type="button" class="btn btn-sm btn-ghost flex-1" :aria-label="t('flip_v')" @click="flipV">
                <Icon name="heroicons:arrows-up-down-20-solid" class="w-4 h-4" /> {{ t('vertical') }}
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-2 text-base-content/60">Zoom</p>
            <div class="flex gap-2">
              <button type="button" class="btn btn-sm btn-ghost flex-1" @click="zoomOut">
                <Icon name="heroicons:magnifying-glass-minus-20-solid" class="w-4 h-4" />
              </button>
              <button type="button" class="btn btn-sm btn-ghost flex-1" @click="zoomIn">
                <Icon name="heroicons:magnifying-glass-plus-20-solid" class="w-4 h-4" />
              </button>
              <button type="button" class="btn btn-sm btn-ghost flex-1" :title="t('reset')" @click="resetCrop">
                <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
          <label class="form-control w-full">
            <span class="label-text mb-2 font-bold">{{ t('format') }}</span>
            <select v-model="exportFormat" class="select select-bordered bg-base-100 w-full">
              <option value="png">PNG — {{ t('high_quality') }}</option>
              <option value="jpeg">JPEG — {{ t('smaller_size') }}</option>
              <option value="webp">WebP — {{ t('modern') }}</option>
            </select>
          </label>

          <label v-if="exportFormat !== 'png'" class="form-control w-full">
            <span class="label-text mb-1 font-bold">{{ t('quality') }}: {{ quality }}%</span>
            <input type="range" v-model.number="quality" min="10" max="100" step="5" class="range range-primary range-sm" />
            <div class="flex justify-between text-xs text-base-content/40 px-1 mt-1">
              <span>10%</span><span>100%</span>
            </div>
          </label>
        </section>

        <div class="flex flex-col gap-2">
          <button type="button" class="btn btn-primary w-full" @click="download">
            <Icon name="heroicons:scissors-20-solid" class="w-5 h-5" />
            {{ t('crop_btn') }}
          </button>
          <button type="button" class="btn btn-ghost w-full" @click="newImage">
            <Icon name="heroicons:arrow-path-20-solid" class="w-5 h-5" />
            {{ t('new_image') }}
          </button>
        </div>
      </div>

      <!-- Cropper canvas -->
      <div class="cropper-wrapper rounded-2xl overflow-hidden border border-base-content/10 bg-base-200/20 min-h-64">
        <img ref="imageRef" :src="imageSrc" :alt="t('title')" class="block max-w-full" />
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

<style scoped>
.cropper-wrapper {
  max-height: 72vh;
  overflow: hidden;
}
.cropper-wrapper img {
  display: block;
  max-width: 100%;
}
</style>

<style>
.cropper-point {
  width: 12px !important;
  height: 12px !important;
  opacity: 1 !important;
  background-color: oklch(var(--p)) !important;
}
.cropper-point.point-nw { top: -6px !important; left: -6px !important; }
.cropper-point.point-ne { top: -6px !important; right: -6px !important; }
.cropper-point.point-sw { bottom: -6px !important; left: -6px !important; }
.cropper-point.point-se { bottom: -6px !important; right: -6px !important; }
.cropper-point.point-n,
.cropper-point.point-s { width: 24px !important; height: 8px !important; margin-left: -12px !important; }
.cropper-point.point-e,
.cropper-point.point-w { width: 8px !important; height: 24px !important; margin-top: -12px !important; }
.cropper-line { background-color: oklch(var(--p)) !important; }
.cropper-view-box { outline-color: oklch(var(--p)) !important; }
</style>

<i18n lang="yaml">
en:
  title: "Image Cropper"
  page_title: "Image Cropper Online - Free Crop Tool for Social Media"
  meta: "Crop images online for free with presets for Instagram, YouTube, TikTok and more. Rotate, flip and export as PNG, JPEG or WebP. 100% private — no upload to servers."
  og_title: "Free Online Image Cropper"
  intro: "Crop your images quickly and easily with presets optimized for every social media format. All processing happens in your browser — your images are never uploaded to any server."
  upload_hint: "Supports JPG, PNG, WebP, GIF and more"
  aspect_ratio: "Aspect Ratio"
  width: "Width (px)"
  height: "Height (px)"
  preset_free: "Free — No restriction"
  preset_square: "Instagram Post, Profile Photo"
  preset_portrait: "Instagram Portrait (best engagement)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook / Twitter Preview"
  preset_custom: "Custom dimensions"
  rotate: "Rotate"
  rotate_left: "Rotate 90° left"
  rotate_right: "Rotate 90° right"
  flip: "Flip"
  flip_h: "Flip horizontally"
  flip_v: "Flip vertically"
  horizontal: "H"
  vertical: "V"
  reset: "Reset"
  format: "Export Format"
  high_quality: "highest quality"
  smaller_size: "smaller file"
  modern: "modern format"
  quality: "Quality"
  crop_btn: "Crop & Download"
  new_image: "New Image"
  features_title: "Image Cropper Features"
  feature_1: "Social media presets for Instagram, YouTube, TikTok and more"
  feature_2: "Custom pixel dimensions with locked aspect ratio"
  feature_3: "Rotate 90° and flip horizontally or vertically"
  feature_4: "Export as PNG, JPEG or WebP with adjustable quality"
  use_cases_title: "When to use the Image Cropper"
  use_cases_desc: "Cropping is one of the most common image editing tasks. The right crop improves composition, meets platform requirements and reduces unnecessary file size."
  uc_1_title: "Social Media Content"
  uc_1_desc: "Use presets to get the exact dimensions required by Instagram, YouTube, TikTok, Facebook, Twitter and other platforms."
  uc_2_title: "Profile Photos & Avatars"
  uc_2_desc: "Crop photos into a perfect 1:1 square for profile pictures, team pages or contact cards."
  uc_3_title: "Video Thumbnails"
  uc_3_desc: "Create 16:9 thumbnails for YouTube and other video platforms with the right crop and composition."
  uc_4_title: "Blog & Website Images"
  uc_4_desc: "Crop images to specific dimensions that fit your website layout without any server upload or software installation."
  how_to_title: "How to Crop an Image"
  how_1_title: "Upload your image"
  how_1_desc: "Click to upload or drag and drop any image file (JPG, PNG, WebP, GIF or BMP) to start cropping."
  how_2_title: "Choose a preset or set custom size"
  how_2_desc: "Select a social media preset or enter custom pixel dimensions. Drag the crop handles or the image itself to adjust the selection."
  how_3_title: "Download the cropped image"
  how_3_desc: "Choose PNG for maximum quality, JPEG or WebP for a smaller file, then click Crop & Download."
  faq_title: "Frequently Asked Questions"
  faq_1_q: "How do I crop an image for Instagram?"
  faq_1_a: "Select the 1:1 (Square) preset for feed posts, 4:5 (Portrait) for the best engagement ratio, or 9:16 (Stories) for Stories and Reels. Upload your image, adjust the crop area and download."
  faq_2_q: "What is the ideal size for a YouTube thumbnail?"
  faq_2_a: "YouTube thumbnails should be 1280×720 pixels (16:9 ratio). Select the 'YouTube' preset and our tool will crop your image to the exact dimensions."
  faq_3_q: "Is my image uploaded to a server?"
  faq_3_a: "No. All processing happens locally in your browser using the Canvas API. Your images never leave your device, ensuring complete privacy."
  faq_4_q: "Can I crop without losing image quality?"
  faq_4_a: "Yes. Export as PNG for lossless quality. For photos, JPEG or WebP at 90%+ preserves excellent detail with a smaller file size."
  faq_5_q: "Can I rotate or flip before cropping?"
  faq_5_a: "Yes. Use the rotate buttons to turn the image 90° left or right, and the flip buttons to mirror horizontally or vertically before finalizing the crop."
  see1: "Dominant Colors of the Image"
  see2: "QR Code Generator"
  see3: "Barcode Generator"
  see4: "Image Resizer"

pt:
  title: "Recortar Imagem"
  page_title: "Recortar Imagem Online - Ferramenta Gratuita para Redes Sociais"
  meta: "Recorte imagens online gratuitamente com formatos para Instagram, YouTube, TikTok e mais. Gire, espelhe e exporte como PNG, JPEG ou WebP. 100% privado, sem envio para servidores."
  og_title: "Recortar Imagem Online Grátis"
  intro: "Recorte suas imagens de forma rápida e fácil com formatos prontos para as principais redes sociais. Todo o processamento acontece no seu navegador — suas imagens nunca são enviadas para nenhum servidor."
  upload_hint: "Suporta JPG, PNG, WebP, GIF e mais"
  aspect_ratio: "Proporção"
  width: "Largura (px)"
  height: "Altura (px)"
  preset_free: "Livre — Sem restrição"
  preset_square: "Instagram Post, Foto de Perfil"
  preset_portrait: "Instagram Retrato (melhor engajamento)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook / Twitter Preview"
  preset_custom: "Dimensões personalizadas"
  rotate: "Girar"
  rotate_left: "Girar 90° à esquerda"
  rotate_right: "Girar 90° à direita"
  flip: "Espelhar"
  flip_h: "Espelhar horizontalmente"
  flip_v: "Espelhar verticalmente"
  horizontal: "H"
  vertical: "V"
  reset: "Redefinir"
  format: "Formato de Exportação"
  high_quality: "maior qualidade"
  smaller_size: "menor tamanho"
  modern: "formato moderno"
  quality: "Qualidade"
  crop_btn: "Recortar e Baixar"
  new_image: "Nova Imagem"
  features_title: "Recursos do Recortador de Imagem"
  feature_1: "Formatos prontos para Instagram, YouTube, TikTok e outras redes"
  feature_2: "Dimensões personalizadas em pixels com proporção travada"
  feature_3: "Girar 90° e espelhar horizontal ou verticalmente"
  feature_4: "Exportar como PNG, JPEG ou WebP com qualidade ajustável"
  use_cases_title: "Quando usar o Recortador de Imagem"
  use_cases_desc: "Recortar é uma das tarefas de edição mais comuns. O recorte certo melhora a composição, atende aos requisitos das plataformas e reduz o tamanho desnecessário do arquivo."
  uc_1_title: "Conteúdo para Redes Sociais"
  uc_1_desc: "Use os formatos prontos para obter as dimensões exatas exigidas pelo Instagram, YouTube, TikTok, Facebook, Twitter e outras plataformas."
  uc_2_title: "Fotos de Perfil e Avatares"
  uc_2_desc: "Recorte fotos em um quadrado perfeito 1:1 para fotos de perfil, páginas de equipe ou cartões de visita."
  uc_3_title: "Thumbnails de Vídeo"
  uc_3_desc: "Crie thumbnails 16:9 para YouTube e outras plataformas de vídeo com recorte e composição ideais."
  uc_4_title: "Imagens para Blog e Site"
  uc_4_desc: "Recorte imagens para dimensões específicas que se ajustem ao layout do seu site, sem instalar nenhum software."
  how_to_title: "Como Recortar uma Imagem"
  how_1_title: "Faça upload da sua imagem"
  how_1_desc: "Clique para fazer upload ou arraste e solte qualquer arquivo de imagem (JPG, PNG, WebP, GIF ou BMP) para começar."
  how_2_title: "Escolha um formato ou tamanho personalizado"
  how_2_desc: "Selecione um formato de rede social ou insira dimensões em pixels. Arraste as alças de recorte ou a imagem para ajustar a seleção."
  how_3_title: "Baixe a imagem recortada"
  how_3_desc: "Escolha PNG para máxima qualidade, JPEG ou WebP para menor tamanho de arquivo e clique em Recortar e Baixar."
  faq_title: "Perguntas Frequentes"
  faq_1_q: "Como recortar imagem para Instagram?"
  faq_1_a: "Selecione o formato 1:1 (Quadrado) para posts no feed, 4:5 (Retrato) para melhor engajamento, ou 9:16 (Stories) para Stories e Reels. Faça upload, ajuste a área de recorte e baixe."
  faq_2_q: "Qual o tamanho ideal para thumbnail do YouTube?"
  faq_2_a: "Thumbnails do YouTube devem ter 1280×720 pixels (proporção 16:9). Selecione o formato 'YouTube' e a ferramenta recortará sua imagem nas dimensões exatas."
  faq_3_q: "Minha imagem é enviada para algum servidor?"
  faq_3_a: "Não. Todo processamento acontece localmente no seu navegador usando a Canvas API. Suas imagens nunca saem do seu dispositivo, garantindo privacidade completa."
  faq_4_q: "Posso recortar sem perder qualidade?"
  faq_4_a: "Sim. Exporte como PNG para qualidade sem perdas. Para fotos, JPEG ou WebP com 90%+ de qualidade preserva excelente detalhe com menor tamanho de arquivo."
  faq_5_q: "Posso girar ou espelhar antes de recortar?"
  faq_5_a: "Sim. Use os botões de rotação para girar a imagem 90° e os botões de espelho para refletir horizontal ou verticalmente antes de finalizar o recorte."
  see1: "Cores Dominantes da Imagem"
  see2: "Gerador de QR Code"
  see3: "Gerador de Código de Barras"
  see4: "Redimensionar Imagem"

es:
  title: "Recortar Imagen"
  page_title: "Recortar Imagen Online - Herramienta Gratuita para Redes Sociales"
  meta: "Recorte imágenes en línea gratis con presets para Instagram, YouTube, TikTok y más. Gire, voltee y exporte como PNG, JPEG o WebP. 100% privado, sin subir a servidores."
  og_title: "Recortar Imagen Online Gratis"
  intro: "Recorte sus imágenes de forma rápida y sencilla con presets optimizados para redes sociales. Todo el procesamiento ocurre en su navegador — sus imágenes nunca se envían a ningún servidor."
  upload_hint: "Compatible con JPG, PNG, WebP, GIF y más"
  aspect_ratio: "Relación de aspecto"
  width: "Ancho (px)"
  height: "Alto (px)"
  preset_free: "Libre — Sin restricción"
  preset_square: "Instagram Post, Foto de Perfil"
  preset_portrait: "Instagram Retrato (mejor engagement)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook / Twitter Preview"
  preset_custom: "Dimensiones personalizadas"
  rotate: "Rotar"
  rotate_left: "Rotar 90° izquierda"
  rotate_right: "Rotar 90° derecha"
  flip: "Voltear"
  flip_h: "Voltear horizontalmente"
  flip_v: "Voltear verticalmente"
  horizontal: "H"
  vertical: "V"
  reset: "Restablecer"
  format: "Formato de Exportación"
  high_quality: "mayor calidad"
  smaller_size: "archivo más pequeño"
  modern: "formato moderno"
  quality: "Calidad"
  crop_btn: "Recortar y Descargar"
  new_image: "Nueva Imagen"
  features_title: "Funciones del Recortador de Imágenes"
  feature_1: "Presets para Instagram, YouTube, TikTok y otras redes"
  feature_2: "Dimensiones personalizadas en píxeles con proporción bloqueada"
  feature_3: "Rotar 90° y voltear horizontal o verticalmente"
  feature_4: "Exportar como PNG, JPEG o WebP con calidad ajustable"
  use_cases_title: "Cuándo usar el Recortador de Imágenes"
  use_cases_desc: "Recortar es una de las tareas de edición más comunes. El recorte correcto mejora la composición, cumple con los requisitos de la plataforma y reduce el tamaño del archivo."
  uc_1_title: "Contenido para Redes Sociales"
  uc_1_desc: "Use los presets para obtener las dimensiones exactas requeridas por Instagram, YouTube, TikTok, Facebook, Twitter y otras plataformas."
  uc_2_title: "Fotos de Perfil y Avatares"
  uc_2_desc: "Recorte fotos en un cuadrado perfecto 1:1 para fotos de perfil, páginas de equipo o tarjetas de contacto."
  uc_3_title: "Miniaturas de Video"
  uc_3_desc: "Cree miniaturas 16:9 para YouTube y otras plataformas de video con el recorte y la composición correctos."
  uc_4_title: "Imágenes para Blog y Sitio Web"
  uc_4_desc: "Recorte imágenes a dimensiones específicas que se ajusten a su sitio web sin instalar ningún software."
  how_to_title: "Cómo Recortar una Imagen"
  how_1_title: "Suba su imagen"
  how_1_desc: "Haga clic para subir o arrastre y suelte cualquier archivo de imagen (JPG, PNG, WebP, GIF o BMP) para comenzar."
  how_2_title: "Elija un preset o tamaño personalizado"
  how_2_desc: "Seleccione un preset de red social o ingrese dimensiones en píxeles. Arrastre los controladores de recorte para ajustar la selección."
  how_3_title: "Descargue la imagen recortada"
  how_3_desc: "Elija PNG para máxima calidad, JPEG o WebP para un archivo más pequeño, y haga clic en Recortar y Descargar."
  faq_title: "Preguntas Frecuentes"
  faq_1_q: "¿Cómo recortar imagen para Instagram?"
  faq_1_a: "Seleccione el formato 1:1 (Cuadrado) para publicaciones en el feed, 4:5 (Retrato) para mejor engagement, o 9:16 (Stories) para Stories y Reels. Suba la imagen, ajuste el área de recorte y descargue."
  faq_2_q: "¿Cuál es el tamaño ideal para miniaturas de YouTube?"
  faq_2_a: "Las miniaturas de YouTube deben ser 1280×720 píxeles (relación 16:9). Seleccione el preset 'YouTube' y la herramienta recortará su imagen en las dimensiones exactas."
  faq_3_q: "¿Mi imagen se sube a algún servidor?"
  faq_3_a: "No. Todo el procesamiento ocurre localmente en su navegador usando la Canvas API. Sus imágenes nunca salen de su dispositivo, garantizando privacidad completa."
  faq_4_q: "¿Puedo recortar sin perder calidad?"
  faq_4_a: "Sí. Exporte como PNG para calidad sin pérdidas. Para fotos, JPEG o WebP con 90%+ de calidad preserva excelente detalle con un archivo más pequeño."
  faq_5_q: "¿Puedo rotar o voltear antes de recortar?"
  faq_5_a: "Sí. Use los botones de rotación para girar la imagen 90° y los de volteo para reflejar horizontal o verticalmente antes de finalizar el recorte."
  see1: "Colores Dominantes de la Imagen"
  see2: "Generador de Código QR"
  see3: "Generador de Código de Barras"
  see4: "Redimensionar Imagen"

fr:
  title: "Recadrer une Image"
  page_title: "Recadrer une Image en Ligne - Outil Gratuit pour les Réseaux Sociaux"
  meta: "Recadrez vos images en ligne gratuitement avec des presets pour Instagram, YouTube, TikTok et plus. Faites pivoter, retournez et exportez en PNG, JPEG ou WebP. 100% privé."
  og_title: "Recadrage d'Image en Ligne Gratuit"
  intro: "Recadrez vos images rapidement avec des presets optimisés pour chaque réseau social. Tout le traitement s'effectue dans votre navigateur — vos images ne sont jamais envoyées à un serveur."
  upload_hint: "Compatible avec JPG, PNG, WebP, GIF et plus"
  aspect_ratio: "Format d'image"
  width: "Largeur (px)"
  height: "Hauteur (px)"
  preset_free: "Libre — Sans restriction"
  preset_square: "Post Instagram, Photo de Profil"
  preset_portrait: "Portrait Instagram (meilleur engagement)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook / Twitter Aperçu"
  preset_custom: "Dimensions personnalisées"
  rotate: "Rotation"
  rotate_left: "Rotation 90° à gauche"
  rotate_right: "Rotation 90° à droite"
  flip: "Retourner"
  flip_h: "Retourner horizontalement"
  flip_v: "Retourner verticalement"
  horizontal: "H"
  vertical: "V"
  reset: "Réinitialiser"
  format: "Format d'exportation"
  high_quality: "meilleure qualité"
  smaller_size: "fichier plus petit"
  modern: "format moderne"
  quality: "Qualité"
  crop_btn: "Recadrer et Télécharger"
  new_image: "Nouvelle Image"
  features_title: "Fonctionnalités du Recadrage"
  feature_1: "Presets pour Instagram, YouTube, TikTok et autres réseaux"
  feature_2: "Dimensions personnalisées en pixels avec ratio verrouillé"
  feature_3: "Rotation 90° et retournement horizontal ou vertical"
  feature_4: "Export en PNG, JPEG ou WebP avec qualité réglable"
  use_cases_title: "Quand utiliser le recadrage d'image"
  use_cases_desc: "Le recadrage est l'une des tâches d'édition les plus courantes. Le bon recadrage améliore la composition, respecte les exigences des plateformes et réduit la taille du fichier."
  uc_1_title: "Contenu pour Réseaux Sociaux"
  uc_1_desc: "Utilisez les presets pour obtenir les dimensions exactes requises par Instagram, YouTube, TikTok, Facebook, Twitter et autres plateformes."
  uc_2_title: "Photos de Profil et Avatars"
  uc_2_desc: "Recadrez des photos en carré parfait 1:1 pour les photos de profil, pages d'équipe ou cartes de contact."
  uc_3_title: "Miniatures Vidéo"
  uc_3_desc: "Créez des miniatures 16:9 pour YouTube et autres plateformes vidéo avec le recadrage et la composition adaptés."
  uc_4_title: "Images pour Blog et Site Web"
  uc_4_desc: "Recadrez des images aux dimensions spécifiques qui s'adaptent à votre mise en page sans installer de logiciel."
  how_to_title: "Comment Recadrer une Image"
  how_1_title: "Téléchargez votre image"
  how_1_desc: "Cliquez pour télécharger ou faites glisser et déposez n'importe quel fichier image (JPG, PNG, WebP, GIF ou BMP)."
  how_2_title: "Choisissez un preset ou une taille personnalisée"
  how_2_desc: "Sélectionnez un preset de réseau social ou saisissez des dimensions en pixels. Faites glisser les poignées pour affiner la sélection."
  how_3_title: "Téléchargez l'image recadrée"
  how_3_desc: "Choisissez PNG pour qualité maximale, JPEG ou WebP pour un fichier plus petit, puis cliquez sur Recadrer et Télécharger."
  faq_title: "Foire Aux Questions"
  faq_1_q: "Comment recadrer une image pour Instagram ?"
  faq_1_a: "Sélectionnez le format 1:1 (Carré) pour les publications du fil, 4:5 (Portrait) pour le meilleur taux d'engagement, ou 9:16 (Stories) pour Stories et Reels."
  faq_2_q: "Quelle est la taille idéale pour une miniature YouTube ?"
  faq_2_a: "Les miniatures YouTube doivent faire 1280×720 pixels (format 16:9). Sélectionnez le preset 'YouTube' et l'outil recadrera votre image aux dimensions exactes."
  faq_3_q: "Mon image est-elle envoyée à un serveur ?"
  faq_3_a: "Non. Tout le traitement s'effectue localement dans votre navigateur via l'API Canvas. Vos images ne quittent jamais votre appareil."
  faq_4_q: "Puis-je recadrer sans perdre en qualité ?"
  faq_4_a: "Oui. Exportez en PNG pour une qualité sans perte. Pour les photos, JPEG ou WebP à 90%+ préserve d'excellents détails avec un fichier plus petit."
  faq_5_q: "Puis-je faire pivoter ou retourner avant de recadrer ?"
  faq_5_a: "Oui. Utilisez les boutons de rotation pour tourner l'image de 90° et les boutons de retournement pour une réflexion avant de finaliser le recadrage."
  see1: "Couleurs Dominantes de l'Image"
  see2: "Générateur de QR Code"
  see3: "Générateur de Code-barres"
  see4: "Redimensionner l'Image"

it:
  title: "Ritaglia Immagine"
  page_title: "Ritaglia Immagine Online - Strumento Gratuito per i Social Media"
  meta: "Ritaglia immagini online gratuitamente con preset per Instagram, YouTube, TikTok e altro. Ruota, specchia ed esporta in PNG, JPEG o WebP. 100% privato, senza caricamenti."
  og_title: "Ritaglia Immagine Online Gratis"
  intro: "Ritaglia le tue immagini rapidamente con preset ottimizzati per ogni social media. Tutta l'elaborazione avviene nel tuo browser — le tue immagini non vengono mai inviate a nessun server."
  upload_hint: "Supporta JPG, PNG, WebP, GIF e altri formati"
  aspect_ratio: "Proporzioni"
  width: "Larghezza (px)"
  height: "Altezza (px)"
  preset_free: "Libero — Nessuna restrizione"
  preset_square: "Instagram Post, Foto Profilo"
  preset_portrait: "Instagram Ritratto (miglior engagement)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook / Twitter Anteprima"
  preset_custom: "Dimensioni personalizzate"
  rotate: "Ruota"
  rotate_left: "Ruota 90° sinistra"
  rotate_right: "Ruota 90° destra"
  flip: "Specchia"
  flip_h: "Specchia orizzontalmente"
  flip_v: "Specchia verticalmente"
  horizontal: "H"
  vertical: "V"
  reset: "Ripristina"
  format: "Formato di Esportazione"
  high_quality: "massima qualità"
  smaller_size: "file più piccolo"
  modern: "formato moderno"
  quality: "Qualità"
  crop_btn: "Ritaglia e Scarica"
  new_image: "Nuova Immagine"
  features_title: "Funzionalità del Ritaglio Immagine"
  feature_1: "Preset per Instagram, YouTube, TikTok e altri social media"
  feature_2: "Dimensioni personalizzate in pixel con proporzione bloccata"
  feature_3: "Ruota 90° e specchia orizzontalmente o verticalmente"
  feature_4: "Esporta in PNG, JPEG o WebP con qualità regolabile"
  use_cases_title: "Quando usare il Ritaglio Immagine"
  use_cases_desc: "Il ritaglio è una delle attività di editing più comuni. Il ritaglio giusto migliora la composizione, soddisfa i requisiti delle piattaforme e riduce la dimensione del file."
  uc_1_title: "Contenuti per Social Media"
  uc_1_desc: "Usa i preset per ottenere le dimensioni esatte richieste da Instagram, YouTube, TikTok, Facebook, Twitter e altre piattaforme."
  uc_2_title: "Foto Profilo e Avatar"
  uc_2_desc: "Ritaglia le foto in un quadrato perfetto 1:1 per foto profilo, pagine team o biglietti da visita."
  uc_3_title: "Miniature Video"
  uc_3_desc: "Crea miniature 16:9 per YouTube e altre piattaforme video con il ritaglio e la composizione giusti."
  uc_4_title: "Immagini per Blog e Sito Web"
  uc_4_desc: "Ritaglia le immagini nelle dimensioni specifiche che si adattano al tuo sito web senza installare alcun software."
  how_to_title: "Come Ritagliare un'Immagine"
  how_1_title: "Carica la tua immagine"
  how_1_desc: "Clicca per caricare o trascina e rilascia qualsiasi file immagine (JPG, PNG, WebP, GIF o BMP) per iniziare."
  how_2_title: "Scegli un preset o le dimensioni personalizzate"
  how_2_desc: "Seleziona un preset per social media o inserisci dimensioni in pixel. Trascina i punti di ritaglio per perfezionare la selezione."
  how_3_title: "Scarica l'immagine ritagliata"
  how_3_desc: "Scegli PNG per la massima qualità, JPEG o WebP per un file più piccolo, poi clicca su Ritaglia e Scarica."
  faq_title: "Domande Frequenti"
  faq_1_q: "Come ritagliare un'immagine per Instagram?"
  faq_1_a: "Seleziona il formato 1:1 (Quadrato) per i post nel feed, 4:5 (Ritratto) per il miglior engagement, o 9:16 (Stories) per Stories e Reels."
  faq_2_q: "Qual è la dimensione ideale per le miniature YouTube?"
  faq_2_a: "Le miniature YouTube devono essere 1280×720 pixel (formato 16:9). Seleziona il preset 'YouTube' e lo strumento ritaglierà la tua immagine nelle dimensioni esatte."
  faq_3_q: "La mia immagine viene caricata su un server?"
  faq_3_a: "No. Tutta l'elaborazione avviene localmente nel tuo browser tramite la Canvas API. Le tue immagini non lasciano mai il tuo dispositivo."
  faq_4_q: "Posso ritagliare senza perdere qualità?"
  faq_4_a: "Sì. Esporta in PNG per qualità senza perdita. Per le foto, JPEG o WebP al 90%+ preserva ottimi dettagli con un file più piccolo."
  faq_5_q: "Posso ruotare o specchiare prima di ritagliare?"
  faq_5_a: "Sì. Usa i pulsanti di rotazione per girare l'immagine di 90° e i pulsanti di specchio per riflettere orizzontalmente o verticalmente prima di finalizzare il ritaglio."
  see1: "Colori Dominanti dell'Immagine"
  see2: "Generatore di QR Code"
  see3: "Generatore di Codice a Barre"
  see4: "Ridimensiona Immagine"

id:
  title: "Pemotong Gambar"
  page_title: "Pemotong Gambar Online - Alat Gratis untuk Media Sosial"
  meta: "Potong gambar secara online gratis dengan preset untuk Instagram, YouTube, TikTok dan lainnya. Putar, balik dan ekspor sebagai PNG, JPEG atau WebP. 100% privat, tanpa unggahan."
  og_title: "Pemotong Gambar Online Gratis"
  intro: "Potong gambar Anda dengan cepat menggunakan preset yang dioptimalkan untuk setiap platform media sosial. Semua pemrosesan terjadi di browser Anda — gambar tidak pernah diunggah ke server."
  upload_hint: "Mendukung JPG, PNG, WebP, GIF dan lainnya"
  aspect_ratio: "Rasio Aspek"
  width: "Lebar (px)"
  height: "Tinggi (px)"
  preset_free: "Bebas — Tanpa batasan"
  preset_square: "Instagram Post, Foto Profil"
  preset_portrait: "Instagram Potret (engagement terbaik)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook / Twitter Preview"
  preset_custom: "Dimensi kustom"
  rotate: "Putar"
  rotate_left: "Putar 90° ke kiri"
  rotate_right: "Putar 90° ke kanan"
  flip: "Balik"
  flip_h: "Balik horizontal"
  flip_v: "Balik vertikal"
  horizontal: "H"
  vertical: "V"
  reset: "Reset"
  format: "Format Ekspor"
  high_quality: "kualitas tertinggi"
  smaller_size: "file lebih kecil"
  modern: "format modern"
  quality: "Kualitas"
  crop_btn: "Potong & Unduh"
  new_image: "Gambar Baru"
  features_title: "Fitur Pemotong Gambar"
  feature_1: "Preset untuk Instagram, YouTube, TikTok dan media sosial lainnya"
  feature_2: "Dimensi kustom dalam piksel dengan rasio terkunci"
  feature_3: "Putar 90° dan balik horizontal atau vertikal"
  feature_4: "Ekspor sebagai PNG, JPEG atau WebP dengan kualitas yang dapat disesuaikan"
  use_cases_title: "Kapan Menggunakan Pemotong Gambar"
  use_cases_desc: "Memotong adalah salah satu tugas pengeditan gambar yang paling umum. Pemotongan yang tepat meningkatkan komposisi, memenuhi persyaratan platform dan mengurangi ukuran file."
  uc_1_title: "Konten Media Sosial"
  uc_1_desc: "Gunakan preset untuk mendapatkan dimensi yang tepat dari Instagram, YouTube, TikTok, Facebook, Twitter dan platform lainnya."
  uc_2_title: "Foto Profil dan Avatar"
  uc_2_desc: "Potong foto menjadi kotak sempurna 1:1 untuk foto profil, halaman tim atau kartu kontak."
  uc_3_title: "Thumbnail Video"
  uc_3_desc: "Buat thumbnail 16:9 untuk YouTube dan platform video lainnya dengan pemotongan dan komposisi yang tepat."
  uc_4_title: "Gambar untuk Blog dan Website"
  uc_4_desc: "Potong gambar ke dimensi tertentu yang sesuai dengan tata letak website Anda tanpa menginstal perangkat lunak apa pun."
  how_to_title: "Cara Memotong Gambar"
  how_1_title: "Unggah gambar Anda"
  how_1_desc: "Klik untuk mengunggah atau seret dan lepas file gambar apa pun (JPG, PNG, WebP, GIF atau BMP) untuk memulai."
  how_2_title: "Pilih preset atau ukuran kustom"
  how_2_desc: "Pilih preset media sosial atau masukkan dimensi dalam piksel. Seret pegangan pemotongan untuk menyempurnakan pilihan."
  how_3_title: "Unduh gambar yang dipotong"
  how_3_desc: "Pilih PNG untuk kualitas maksimal, JPEG atau WebP untuk file yang lebih kecil, lalu klik Potong & Unduh."
  faq_title: "Pertanyaan yang Sering Diajukan"
  faq_1_q: "Bagaimana cara memotong gambar untuk Instagram?"
  faq_1_a: "Pilih format 1:1 (Persegi) untuk postingan feed, 4:5 (Potret) untuk engagement terbaik, atau 9:16 (Stories) untuk Stories dan Reels."
  faq_2_q: "Berapa ukuran ideal untuk thumbnail YouTube?"
  faq_2_a: "Thumbnail YouTube harus berukuran 1280×720 piksel (rasio 16:9). Pilih preset 'YouTube' dan alat akan memotong gambar Anda ke dimensi yang tepat."
  faq_3_q: "Apakah gambar saya diunggah ke server?"
  faq_3_a: "Tidak. Semua pemrosesan terjadi secara lokal di browser Anda menggunakan Canvas API. Gambar Anda tidak pernah meninggalkan perangkat Anda."
  faq_4_q: "Bisakah saya memotong tanpa kehilangan kualitas?"
  faq_4_a: "Ya. Ekspor sebagai PNG untuk kualitas tanpa kehilangan. Untuk foto, JPEG atau WebP dengan kualitas 90%+ juga mempertahankan detail yang sangat baik."
  faq_5_q: "Bisakah saya memutar atau membalik sebelum memotong?"
  faq_5_a: "Ya. Gunakan tombol putar untuk memutar gambar 90° dan tombol balik untuk mencerminkan horizontal atau vertikal sebelum menyelesaikan pemotongan."
  see1: "Warna Dominan Gambar"
  see2: "Generator QR Code"
  see3: "Generator Barcode"
  see4: "Pengubah Ukuran Gambar"
</i18n>
