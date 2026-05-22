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
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  faq: faqItems.value
})

useHead({
  title: t('page_title'),
  link: [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css' },
  ],
  meta: [
    { name: 'description', content: t('meta') }
  ],
})

const { onLoaded } = useScript('https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js', { trigger: 'client' })

onLoaded(() => {
  scriptReady.value = true
  if (imageLoaded.value) initCropper()
})

onBeforeUnmount(() => destroyCropper())

function onImageSelected(file: File | File[]) {
  const selectedFile = Array.isArray(file) ? file[0] : file
  if (!selectedFile) return

  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value)
  imageSrc.value = URL.createObjectURL(selectedFile)
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
    en: '/crop-image',
    pt: '/recortar-imagem',
    es: '/recortar-imagen',
    fr: '/rogner-image',
    it: '/ritaglia-immagine',
    id: '/pemotong-gambar',
    de: '/bild-zuschneiden',
    nl: '/afbeelding-bijsnijden',
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
      <p class="text-sm text-base-content/70">{{ t('upload_hint') }}</p>
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
  title: "Crop Image"
  page_title: "Crop Image Online - Free form or presets"
  meta: "Crop images online for free with presets for Instagram, YouTube, TikTok, and more. Rotate, flip, and export as PNG, JPEG, or WebP."
  intro: "Crop your images quickly and easily with ready-made presets for the main social networks. All processing happens locally in your browser, which means your images never leave your device, ensuring complete privacy."
  upload_hint: "Supports JPG, PNG, WebP, GIF, and more"
  aspect_ratio: "Aspect Ratio"
  width: "Width (px)"
  height: "Height (px)"
  preset_free: "Free — No restriction"
  preset_square: "Instagram Post, Profile Picture"
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
  smaller_size: "smaller file size"
  modern: "modern format"
  quality: "Quality"
  crop_btn: "Crop and Download"
  new_image: "New Image"
  features_title: "Image Cropper Features"
  feature_1: "Ready-made presets for Instagram, YouTube, TikTok, and other social networks"
  feature_2: "Custom pixel dimensions with locked aspect ratio"
  feature_3: "Rotate 90° and flip horizontally or vertically"
  feature_4: "Export as PNG, JPEG, or WebP with adjustable quality"
  use_cases_title: "When to Use the Image Cropper"
  use_cases_desc: "Cropping is one of the most common editing tasks. The right crop improves composition, meets platform requirements, and reduces unnecessary file size."
  uc_1_title: "Social Media Content"
  uc_1_desc: "Use the ready-made presets to get the exact dimensions required by Instagram, YouTube, TikTok, Facebook, Twitter, and other platforms."
  uc_2_title: "Profile Photos and Avatars"
  uc_2_desc: "Crop photos into a perfect 1:1 square for profile pictures, team pages, or business cards."
  uc_3_title: "Video Thumbnails"
  uc_3_desc: "Create 16:9 thumbnails for YouTube and other video platforms with the ideal crop and composition."
  uc_4_title: "Blog and Website Images"
  uc_4_desc: "Crop images to specific dimensions that fit your site layout, without installing any software."
  how_to_title: "How to Crop an Image"
  how_1_title: "Upload your image"
  how_1_desc: "Click to upload or drag and drop any image file (JPG, PNG, WebP, GIF, or BMP) to get started."
  how_2_title: "Choose a preset or custom size"
  how_2_desc: "Select a social media preset or enter pixel dimensions. Drag the crop handles or the image to adjust the selection."
  how_3_title: "Download the cropped image"
  how_3_desc: "Choose PNG for maximum quality, JPEG or WebP for smaller file size, and click Crop and Download."
  faq_title: "Questions and Answers"
  faq_1_q: "How do I crop an image for Instagram?"
  faq_1_a: "Select the 1:1 (Square) preset for feed posts, 4:5 (Portrait) for better engagement, or 9:16 (Stories) for Stories and Reels. Upload your image, adjust the crop area, and download it."
  faq_2_q: "What is the ideal size for a YouTube thumbnail?"
  faq_2_a: "YouTube thumbnails should be 1280×720 pixels (16:9 aspect ratio). Select the 'YouTube' preset and the tool will crop your image to the exact dimensions."
  faq_3_q: "Can I crop without losing quality?"
  faq_3_a: "Yes. Export as PNG for lossless quality. For photos, JPEG or WebP at 90%+ quality preserves excellent detail with a smaller file size."
  faq_4_q: "Can I rotate or flip before cropping?"
  faq_4_a: "Yes. Use the rotation buttons to turn the image by 90° and the flip buttons to mirror it horizontally or vertically before finishing the crop."
  see1: "Dominant Colors of the Image"
  see2: "QR Code Generator"
  see3: "Barcode Generator"
  see4: "Image Resizer"

pt:
  title: "Recortar Imagem"
  page_title: "Recortar Imagem Online - Formato livre ou predefinido para Redes Sociais"
  meta: "Recorte imagens online gratuitamente com formatos para Instagram, YouTube, TikTok e mais. Gire, espelhe e exporte como PNG, JPEG ou WebP."
  intro: "Recorte suas imagens de forma rápida e fácil com formatos prontos para as principais redes sociais. Todo o processamento acontece localmente no seu navegador, ou seja, suas imagens nunca saem do seu dispositivo, garantindo privacidade absoluta."
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
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Como recortar imagem para Instagram?"
  faq_1_a: "Selecione o formato 1:1 (Quadrado) para posts no feed, 4:5 (Retrato) para melhor engajamento, ou 9:16 (Stories) para Stories e Reels. Faça upload, ajuste a área de recorte e baixe."
  faq_2_q: "Qual o tamanho ideal para thumbnail do YouTube?"
  faq_2_a: "Thumbnails do YouTube devem ter 1280×720 pixels (proporção 16:9). Selecione o formato 'YouTube' e a ferramenta recortará sua imagem nas dimensões exatas."
  faq_3_q: "Posso recortar sem perder qualidade?"
  faq_3_a: "Sim. Exporte como PNG para qualidade sem perdas. Para fotos, JPEG ou WebP com 90%+ de qualidade preserva excelente detalhe com menor tamanho de arquivo."
  faq_4_q: "Posso girar ou espelhar antes de recortar?"
  faq_4_a: "Sim. Use os botões de rotação para girar a imagem 90° e os botões de espelho para refletir horizontal ou verticalmente antes de finalizar o recorte."
  see1: "Cores Dominantes da Imagem"
  see2: "Gerador de QR Code"
  see3: "Gerador de Código de Barras"
  see4: "Redimensionar Imagem"

es:
  title: "Recortar Imagen"
  page_title: "Recortar Imagen Online - Formato libre o predefinido"
  meta: "Recorta imágenes online gratis con formatos para Instagram, YouTube, TikTok y más. Gira, voltea y exporta como PNG, JPEG o WebP."
  intro: "Recorta tus imágenes de forma rápida y sencilla con formatos listos para las principales redes sociales. Todo el procesamiento ocurre localmente en tu navegador, es decir, tus imágenes nunca salen de tu dispositivo, garantizando privacidad total."
  upload_hint: "Compatible con JPG, PNG, WebP, GIF y más"
  aspect_ratio: "Proporción"
  width: "Ancho (px)"
  height: "Alto (px)"
  preset_free: "Libre — Sin restricción"
  preset_square: "Publicación de Instagram, Foto de Perfil"
  preset_portrait: "Instagram Vertical (mejor interacción)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Vista previa de Facebook / Twitter"
  preset_custom: "Dimensiones personalizadas"
  rotate: "Girar"
  rotate_left: "Girar 90° a la izquierda"
  rotate_right: "Girar 90° a la derecha"
  flip: "Voltear"
  flip_h: "Voltear horizontalmente"
  flip_v: "Voltear verticalmente"
  horizontal: "H"
  vertical: "V"
  reset: "Restablecer"
  format: "Formato de Exportación"
  high_quality: "mayor calidad"
  smaller_size: "menor tamaño"
  modern: "formato moderno"
  quality: "Calidad"
  crop_btn: "Recortar y Descargar"
  new_image: "Nueva Imagen"
  features_title: "Funciones del Recortador de Imagen"
  feature_1: "Formatos listos para Instagram, YouTube, TikTok y otras redes sociales"
  feature_2: "Dimensiones personalizadas en píxeles con proporción bloqueada"
  feature_3: "Girar 90° y voltear horizontal o verticalmente"
  feature_4: "Exportar como PNG, JPEG o WebP con calidad ajustable"
  use_cases_title: "Cuándo usar el Recortador de Imagen"
  use_cases_desc: "Recortar es una de las tareas de edición más comunes. El recorte correcto mejora la composición, cumple con los requisitos de las plataformas y reduce el tamaño innecesario del archivo."
  uc_1_title: "Contenido para Redes Sociales"
  uc_1_desc: "Usa los formatos listos para obtener las dimensiones exactas requeridas por Instagram, YouTube, TikTok, Facebook, Twitter y otras plataformas."
  uc_2_title: "Fotos de Perfil y Avatares"
  uc_2_desc: "Recorta fotos en un cuadrado perfecto de 1:1 para fotos de perfil, páginas de equipo o tarjetas de presentación."
  uc_3_title: "Miniaturas de Video"
  uc_3_desc: "Crea miniaturas 16:9 para YouTube y otras plataformas de video con el recorte y la composición ideales."
  uc_4_title: "Imágenes para Blog y Sitio Web"
  uc_4_desc: "Recorta imágenes a dimensiones específicas que se ajusten al diseño de tu sitio, sin instalar ningún software."
  how_to_title: "Cómo Recortar una Imagen"
  how_1_title: "Sube tu imagen"
  how_1_desc: "Haz clic para subir o arrastra y suelta cualquier archivo de imagen (JPG, PNG, WebP, GIF o BMP) para empezar."
  how_2_title: "Elige un formato o tamaño personalizado"
  how_2_desc: "Selecciona un formato para redes sociales o introduce dimensiones en píxeles. Arrastra los controles de recorte o la imagen para ajustar la selección."
  how_3_title: "Descarga la imagen recortada"
  how_3_desc: "Elige PNG para máxima calidad, JPEG o WebP para menor tamaño de archivo y haz clic en Recortar y Descargar."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Cómo recortar una imagen para Instagram?"
  faq_1_a: "Selecciona el formato 1:1 (Cuadrado) para publicaciones del feed, 4:5 (Vertical) para mejor interacción, o 9:16 (Stories) para Stories y Reels. Sube tu imagen, ajusta el área de recorte y descárgala."
  faq_2_q: "¿Cuál es el tamaño ideal para una miniatura de YouTube?"
  faq_2_a: "Las miniaturas de YouTube deben tener 1280×720 píxeles (proporción 16:9). Selecciona el formato 'YouTube' y la herramienta recortará tu imagen a las dimensiones exactas."
  faq_3_q: "¿Puedo recortar sin perder calidad?"
  faq_3_a: "Sí. Exporta como PNG para una calidad sin pérdidas. Para fotos, JPEG o WebP con calidad superior al 90% conserva excelente detalle con un tamaño de archivo menor."
  faq_4_q: "¿Puedo girar o voltear antes de recortar?"
  faq_4_a: "Sí. Usa los botones de rotación para girar la imagen 90° y los botones de volteo para reflejarla horizontal o verticalmente antes de finalizar el recorte."
  see1: "Colores Dominantes de la Imagen"
  see2: "Generador de Código QR"
  see3: "Generador de Código de Barras"
  see4: "Redimensionar Imagen"

fr:
  title: "Recadrer l'Image"
  page_title: "Recadrer l'Image en Ligne - Format libre ou prédéfini"
  meta: "Recadrez vos images en ligne gratuitement avec des formats prédéfinis pour Instagram, YouTube, TikTok et plus encore. Faites pivoter, retournez et exportez en PNG, JPEG ou WebP."
  intro: "Recadrez vos images rapidement et facilement grâce à des formats prêts à l'emploi pour les principaux réseaux sociaux. Tout le traitement s'effectue localement dans votre navigateur, ce qui signifie que vos images ne quittent jamais votre appareil et que votre confidentialité est totalement préservée."
  upload_hint: "Compatible avec JPG, PNG, WebP, GIF et plus"
  aspect_ratio: "Proportion"
  width: "Largeur (px)"
  height: "Hauteur (px)"
  preset_free: "Libre — Sans restriction"
  preset_square: "Publication Instagram, photo de profil"
  preset_portrait: "Instagram Portrait (meilleur engagement)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Aperçu Facebook / Twitter"
  preset_custom: "Dimensions personnalisées"
  rotate: "Pivoter"
  rotate_left: "Pivoter de 90° à gauche"
  rotate_right: "Pivoter de 90° à droite"
  flip: "Retourner"
  flip_h: "Retourner horizontalement"
  flip_v: "Retourner verticalement"
  horizontal: "H"
  vertical: "V"
  reset: "Réinitialiser"
  format: "Format d'exportation"
  high_quality: "qualité maximale"
  smaller_size: "taille de fichier réduite"
  modern: "format moderne"
  quality: "Qualité"
  crop_btn: "Recadrer et Télécharger"
  new_image: "Nouvelle Image"
  features_title: "Fonctionnalités de l'Outil de Recadrage"
  feature_1: "Formats prêts à l'emploi pour Instagram, YouTube, TikTok et autres réseaux sociaux"
  feature_2: "Dimensions personnalisées en pixels avec proportion verrouillée"
  feature_3: "Rotation à 90° et retournement horizontal ou vertical"
  feature_4: "Exportation en PNG, JPEG ou WebP avec qualité ajustable"
  use_cases_title: "Quand utiliser l'outil de recadrage"
  use_cases_desc: "Le recadrage est l'une des tâches d'édition les plus courantes. Un bon recadrage améliore la composition, répond aux exigences des plateformes et réduit la taille de fichier inutile."
  uc_1_title: "Contenu pour les réseaux sociaux"
  uc_1_desc: "Utilisez les formats prêts à l'emploi pour obtenir les dimensions exactes requises par Instagram, YouTube, TikTok, Facebook, Twitter et d'autres plateformes."
  uc_2_title: "Photos de profil et avatars"
  uc_2_desc: "Recadrez vos photos en carré parfait 1:1 pour les photos de profil, pages d'équipe ou cartes de visite."
  uc_3_title: "Miniatures vidéo"
  uc_3_desc: "Créez des miniatures 16:9 pour YouTube et d'autres plateformes vidéo avec le cadrage idéal."
  uc_4_title: "Images pour blog et site web"
  uc_4_desc: "Recadrez des images à des dimensions spécifiques adaptées à la mise en page de votre site, sans installer de logiciel."
  how_to_title: "Comment Recadrer une Image"
  how_1_title: "Téléchargez votre image"
  how_1_desc: "Cliquez pour télécharger ou glissez-déposez n'importe quel fichier image (JPG, PNG, WebP, GIF ou BMP) pour commencer."
  how_2_title: "Choisissez un format ou une taille personnalisée"
  how_2_desc: "Sélectionnez un format pour réseau social ou saisissez des dimensions en pixels. Faites glisser les poignées de recadrage ou l'image pour ajuster la sélection."
  how_3_title: "Téléchargez l'image recadrée"
  how_3_desc: "Choisissez PNG pour une qualité maximale, JPEG ou WebP pour un fichier plus léger, puis cliquez sur Recadrer et Télécharger."
  faq_title: "Questions et Réponses"
  faq_1_q: "Comment recadrer une image pour Instagram ?"
  faq_1_a: "Sélectionnez le format 1:1 (Carré) pour les publications du fil, 4:5 (Portrait) pour un meilleur engagement, ou 9:16 (Stories) pour les Stories et Reels. Téléchargez votre image, ajustez la zone de recadrage, puis téléchargez-la."
  faq_2_q: "Quelle est la taille idéale pour une miniature YouTube ?"
  faq_2_a: "Les miniatures YouTube doivent faire 1280×720 pixels (16:9). Sélectionnez le format 'YouTube' pour obtenir les dimensions exactes."
  faq_3_q: "Puis-je recadrer sans perdre de qualité ?"
  faq_3_a: "Oui. Exportez en PNG pour une qualité sans perte. Pour les photos, JPEG ou WebP avec une qualité de 90 % ou plus conservent d'excellents détails avec un fichier plus léger."
  faq_4_q: "Puis-je faire pivoter ou retourner l'image avant de la recadrer ?"
  faq_4_a: "Oui. Utilisez les boutons de rotation pour faire pivoter l'image de 90° et les boutons de retournement pour la refléter horizontalement ou verticalement avant de finaliser le recadrage."
  see1: "Couleurs Dominantes de l'Image"
  see2: "Générateur de QR Code"
  see3: "Générateur de Code-barres"
  see4: "Redimensionner l'Image"

it:
  title: "Ritaglia Immagine"
  page_title: "Ritaglia Immagine Online - Formato libero o predefinito"
  meta: "Ritaglia immagini online gratis con preset per Instagram, YouTube, TikTok e altro. Ruota, rifletti ed esporta in PNG, JPEG o WebP."
  intro: "Ritaglia le tue immagini in modo rapido e semplice con formati pronti per i principali social network. Tutta l'elaborazione avviene localmente nel tuo browser, quindi le tue immagini non lasciano mai il dispositivo e la tua privacy resta completamente protetta."
  upload_hint: "Supporta JPG, PNG, WebP, GIF e altro"
  aspect_ratio: "Rapporto d'aspetto"
  width: "Larghezza (px)"
  height: "Altezza (px)"
  preset_free: "Libero — Nessuna limitazione"
  preset_square: "Post Instagram, foto profilo"
  preset_portrait: "Instagram verticale (miglior coinvolgimento)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Anteprima Facebook / Twitter"
  preset_custom: "Dimensioni personalizzate"
  rotate: "Ruota"
  rotate_left: "Ruota di 90° a sinistra"
  rotate_right: "Ruota di 90° a destra"
  flip: "Rifletti"
  flip_h: "Rifletti orizzontalmente"
  flip_v: "Rifletti verticalmente"
  horizontal: "H"
  vertical: "V"
  reset: "Reimposta"
  format: "Formato di Esportazione"
  high_quality: "massima qualità"
  smaller_size: "dimensione file minore"
  modern: "formato moderno"
  quality: "Qualità"
  crop_btn: "Ritaglia e Scarica"
  new_image: "Nuova Immagine"
  features_title: "Funzionalità dello Strumento di Ritaglio"
  feature_1: "Preset pronti per Instagram, YouTube, TikTok e altri social network"
  feature_2: "Dimensioni personalizzate in pixel con proporzioni bloccate"
  feature_3: "Rotazione di 90° e riflessione orizzontale o verticale"
  feature_4: "Esporta in PNG, JPEG o WebP con qualità regolabile"
  use_cases_title: "Quando usare lo strumento di ritaglio"
  use_cases_desc: "Ritagliare è una delle operazioni di modifica più comuni. Il ritaglio giusto migliora la composizione, soddisfa i requisiti delle piattaforme e riduce la dimensione inutile del file."
  uc_1_title: "Contenuti per i social media"
  uc_1_desc: "Usa i preset pronti per ottenere le dimensioni esatte richieste da Instagram, YouTube, TikTok, Facebook, Twitter e altre piattaforme."
  uc_2_title: "Foto profilo e avatar"
  uc_2_desc: "Ritaglia le foto in un quadrato perfetto 1:1 per foto profilo, pagine del team o biglietti da visita."
  uc_3_title: "Miniature video"
  uc_3_desc: "Crea miniature 16:9 per YouTube e altre piattaforme video con il ritaglio e la composizione ideali."
  uc_4_title: "Immagini per blog e sito web"
  uc_4_desc: "Ritaglia immagini con dimensioni specifiche adatte al layout del tuo sito, senza installare alcun software."
  how_to_title: "Come Ritagliare un'Immagine"
  how_1_title: "Carica la tua immagine"
  how_1_desc: "Fai clic per caricare o trascina e rilascia qualsiasi file immagine (JPG, PNG, WebP, GIF o BMP) per iniziare."
  how_2_title: "Scegli un formato o una dimensione personalizzata"
  how_2_desc: "Seleziona un preset per social media o inserisci dimensioni in pixel. Trascina le maniglie di ritaglio o l'immagine per regolare la selezione."
  how_3_title: "Scarica l'immagine ritagliata"
  how_3_desc: "Scegli PNG per la massima qualità, JPEG o WebP per file più leggeri, quindi clicca su Ritaglia e Scarica."
  faq_title: "Domande e Risposte"
  faq_1_q: "Come ritagliare un'immagine per Instagram?"
  faq_1_a: "Seleziona il formato 1:1 (Quadrato) per i post del feed, 4:5 (Ritratto) per un maggiore coinvolgimento, o 9:16 per Stories e Reels. Carica, regola l'area e scarica."
  faq_2_q: "Qual è la dimensione ideale per una miniatura di YouTube?"
  faq_2_a: "Le miniature di YouTube devono essere 1280×720 pixel (16:9). Seleziona il formato 'YouTube' e lo strumento ritaglierà l'immagine alle dimensioni esatte."
  faq_3_q: "Posso ritagliare senza perdere qualità?"
  faq_3_a: "Sì. Esporta in PNG per una qualità senza perdite. Per le foto, JPEG o WebP al 90%+ conservano ottimi dettagli con file di dimensioni ridotte."
  faq_4_q: "Posso ruotare o riflettere l'immagine prima del ritaglio?"
  faq_4_a: "Sì. Usa i pulsanti di rotazione (90°) o quelli speculari prima di finalizzare il ritaglio."
  see1: "Colori Dominanti dell'Immagine"
  see2: "Generatore di QR Code"
  see3: "Generatore di Codice a Barre"
  see4: "Ridimensiona Immagine"

id:
  title: "Potong Gambar"
  page_title: "Potong Gambar Online - Format bebas atau prasetel"
  meta: "Potong gambar online gratis dengan preset untuk Instagram, YouTube, TikTok, dan lainnya. Putar, balik, dan ekspor sebagai PNG, JPEG, atau WebP."
  intro: "Potong gambar Anda dengan cepat dan mudah menggunakan preset siap pakai untuk jejaring sosial utama. Semua pemrosesan terjadi secara lokal di browser Anda, jadi gambar Anda tidak pernah meninggalkan perangkat dan privasi Anda tetap terjaga sepenuhnya."
  upload_hint: "Mendukung JPG, PNG, WebP, GIF, dan lainnya"
  aspect_ratio: "Rasio Aspek"
  width: "Lebar (px)"
  height: "Tinggi (px)"
  preset_free: "Bebas — Tanpa batasan"
  preset_square: "Postingan Instagram, foto profil"
  preset_portrait: "Instagram potret (interaksi terbaik)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Pratinjau Facebook / Twitter"
  preset_custom: "Dimensi kustom"
  rotate: "Putar"
  rotate_left: "Putar 90° ke kiri"
  rotate_right: "Putar 90° ke kanan"
  flip: "Balik"
  flip_h: "Balik horizontal"
  flip_v: "Balik vertikal"
  horizontal: "H"
  vertical: "V"
  reset: "Setel ulang"
  format: "Format Ekspor"
  high_quality: "kualitas tertinggi"
  smaller_size: "ukuran file lebih kecil"
  modern: "format modern"
  quality: "Kualitas"
  crop_btn: "Potong dan Unduh"
  new_image: "Gambar Baru"
  features_title: "Fitur Alat Potong Gambar"
  feature_1: "Preset siap pakai untuk Instagram, YouTube, TikTok, dan jejaring sosial lainnya"
  feature_2: "Dimensi piksel kustom dengan rasio aspek terkunci"
  feature_3: "Putar 90° dan balik secara horizontal atau vertikal"
  feature_4: "Ekspor sebagai PNG, JPEG, atau WebP dengan kualitas yang dapat diatur"
  use_cases_title: "Kapan menggunakan alat potong gambar"
  use_cases_desc: "Memotong adalah salah satu tugas pengeditan yang paling umum. Potongan yang tepat memperbaiki komposisi, memenuhi kebutuhan platform, dan mengurangi ukuran file yang tidak perlu."
  uc_1_title: "Konten media sosial"
  uc_1_desc: "Gunakan preset siap pakai untuk mendapatkan dimensi tepat yang dibutuhkan Instagram, YouTube, TikTok, Facebook, Twitter, dan platform lainnya."
  uc_2_title: "Foto profil dan avatar"
  uc_2_desc: "Potong foto menjadi persegi 1:1 yang sempurna untuk foto profil, halaman tim, atau kartu nama."
  uc_3_title: "Thumbnail video"
  uc_3_desc: "Buat thumbnail 16:9 untuk YouTube dan platform video lainnya dengan potongan dan komposisi yang ideal."
  uc_4_title: "Gambar untuk blog dan situs web"
  uc_4_desc: "Potong gambar ke dimensi tertentu yang sesuai dengan tata letak situs Anda, tanpa perlu memasang perangkat lunak."
  how_to_title: "Cara Memotong Gambar"
  how_1_title: "Unggah gambar Anda"
  how_1_desc: "Klik untuk mengunggah atau seret dan lepas file gambar apa pun (JPG, PNG, WebP, GIF, atau BMP) untuk memulai."
  how_2_title: "Pilih format atau ukuran kustom"
  how_2_desc: "Pilih preset media sosial atau masukkan dimensi piksel. Seret pegangan potong atau gambar untuk menyesuaikan pilihan."
  how_3_title: "Unduh gambar yang dipotong"
  how_3_desc: "Pilih PNG untuk kualitas maksimal, JPEG atau WebP untuk ukuran file lebih kecil, lalu klik Potong dan Unduh."
  faq_title: "Pertanyaan dan Jawaban"
  faq_1_q: "Bagaimana cara memotong gambar untuk Instagram?"
  faq_1_a: "Pilih format 1:1 (Kotak) untuk postingan feed, 4:5 (Potret) untuk keterlibatan lebih baik, atau 9:16 untuk Stories dan Reels. Unggah, sesuaikan area, unduh."
  faq_2_q: "Berapa ukuran ideal untuk thumbnail YouTube?"
  faq_2_a: "Thumbnail YouTube harus berukuran 1280×720 piksel (rasio 16:9). Pilih format 'YouTube' dan alat akan memotong gambar Anda ke dimensi yang tepat."
  faq_3_q: "Bisakah saya memotong tanpa kehilangan kualitas?"
  faq_3_a: "Ya. Ekspor sebagai PNG untuk kualitas tanpa kehilangan. Untuk foto, JPEG atau WebP dengan kualitas 90%+ mempertahankan detail luar biasa dengan ukuran file lebih kecil."
  faq_4_q: "Bisakah saya memutar atau mencerminkan gambar sebelum memotong?"
  faq_4_a: "Ya. Gunakan tombol putar (90°) atau tombol cermin sebelum menyelesaikan pemotongan."
  see1: "Warna Dominan Gambar"
  see2: "Generator QR Code"
  see3: "Generator Barcode"
  see4: "Pengubah Ukuran Gambar"
de:
  title: "Bild Zuschneiden"
  page_title: "Bild Online Zuschneiden - Freiform oder Voreinstellungen"
  meta: "Schneide Bilder online kostenlos mit Vorlagen für Instagram, YouTube, TikTok und mehr zu. Drehe, spiegele und exportiere als PNG, JPEG oder WebP."
  intro: "Schneide deine Bilder schnell und einfach mit fertigen Vorlagen für die wichtigsten sozialen Netzwerke zu. Die gesamte Verarbeitung findet lokal in deinem Browser statt, das heißt, deine Bilder verlassen niemals dein Gerät und deine Privatsphäre bleibt vollständig geschützt."
  upload_hint: "Unterstützt JPG, PNG, WebP, GIF und mehr"
  aspect_ratio: "Seitenverhältnis"
  width: "Breite (px)"
  height: "Höhe (px)"
  preset_free: "Frei — Keine Einschränkung"
  preset_square: "Instagram-Beitrag, Profilbild"
  preset_portrait: "Instagram Hochformat (beste Interaktion)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook- / Twitter-Vorschau"
  preset_custom: "Benutzerdefinierte Maße"
  rotate: "Drehen"
  rotate_left: "90° nach links drehen"
  rotate_right: "90° nach rechts drehen"
  flip: "Spiegeln"
  flip_h: "Horizontal spiegeln"
  flip_v: "Vertikal spiegeln"
  horizontal: "H"
  vertical: "V"
  reset: "Zurücksetzen"
  format: "Exportformat"
  high_quality: "höchste Qualität"
  smaller_size: "kleinere Dateigröße"
  modern: "modernes Format"
  quality: "Qualität"
  crop_btn: "Zuschneiden und Herunterladen"
  new_image: "Neues Bild"
  features_title: "Funktionen des Bildzuschnitt-Tools"
  feature_1: "Fertige Vorlagen für Instagram, YouTube, TikTok und andere soziale Netzwerke"
  feature_2: "Benutzerdefinierte Pixelmaße mit gesperrtem Seitenverhältnis"
  feature_3: "Um 90° drehen und horizontal oder vertikal spiegeln"
  feature_4: "Als PNG, JPEG oder WebP mit anpassbarer Qualität exportieren"
  use_cases_title: "Wann das Bildzuschnitt-Tool sinnvoll ist"
  use_cases_desc: "Zuschneiden gehört zu den häufigsten Bearbeitungsaufgaben. Der richtige Zuschnitt verbessert die Komposition, erfüllt Plattformanforderungen und reduziert unnötige Dateigröße."
  uc_1_title: "Inhalte für Soziale Medien"
  uc_1_desc: "Nutze die fertigen Vorlagen, um die exakten Maße für Instagram, YouTube, TikTok, Facebook, Twitter und andere Plattformen zu erhalten."
  uc_2_title: "Profilfotos und Avatare"
  uc_2_desc: "Schneide Fotos in ein perfektes 1:1-Quadrat für Profilbilder, Teamseiten oder Visitenkarten zu."
  uc_3_title: "Video-Thumbnails"
  uc_3_desc: "Erstelle 16:9-Thumbnails für YouTube und andere Videoplattformen mit idealem Zuschnitt und passender Komposition."
  uc_4_title: "Bilder für Blog und Website"
  uc_4_desc: "Schneide Bilder auf bestimmte Maße zu, die zu deinem Webseitenlayout passen, ganz ohne zusätzliche Software."
  how_to_title: "So schneidest du ein Bild zu"
  how_1_title: "Lade dein Bild hoch"
  how_1_desc: "Klicke zum Hochladen oder ziehe eine Bilddatei (JPG, PNG, WebP, GIF oder BMP) per Drag-and-drop hinein, um zu starten."
  how_2_title: "Wähle eine Vorlage oder eine benutzerdefinierte Größe"
  how_2_desc: "Wähle ein Format für soziale Medien oder gib Pixelmaße ein. Ziehe die Zuschneidegriffe oder das Bild, um die Auswahl anzupassen."
  how_3_title: "Lade das zugeschnittene Bild herunter"
  how_3_desc: "Wähle PNG für maximale Qualität, JPEG oder WebP für kleinere Dateien und klicke auf Zuschneiden und Herunterladen."
  faq_title: "Fragen und Antworten"
  faq_1_q: "Wie schneide ich ein Bild für Instagram zu?"
  faq_1_a: "Wähle das Format 1:1 (Quadrat) für Feed-Posts, 4:5 (Hochformat) für bessere Interaktion oder 9:16 (Stories) für Stories und Reels. Lade dein Bild hoch, passe den Zuschnitt an und lade es herunter."
  faq_2_q: "Welche Größe ist ideal für ein YouTube-Thumbnail?"
  faq_2_a: "YouTube-Thumbnails sollten 1280×720 Pixel groß sein (Seitenverhältnis 16:9). Wähle die Vorlage 'YouTube' und das Tool schneidet dein Bild auf die exakten Maße zu."
  faq_3_q: "Kann ich zuschneiden, ohne Qualität zu verlieren?"
  faq_3_a: "Ja. Exportiere als PNG für verlustfreie Qualität. Für Fotos bewahren JPEG oder WebP mit 90 % oder mehr Qualität sehr viele Details bei kleinerer Dateigröße."
  faq_4_q: "Kann ich vor dem Zuschneiden drehen oder spiegeln?"
  faq_4_a: "Ja. Verwende die Drehbuttons, um das Bild um 90° zu drehen, und die Spiegelbuttons, um es horizontal oder vertikal zu spiegeln, bevor du den Zuschnitt abschließt."
  see1: "Dominante Farben des Bildes"
  see2: "QR-Code-Generator"
  see3: "Barcode-Generator"
  see4: "Bildgröße ändern"
nl:
  title: "Afbeelding Bijsnijden"
  page_title: "Afbeelding Online Bijsnijden - Vrije vorm of voorinstellingen"
  meta: "Snijd afbeeldingen online gratis bij met presets voor Instagram, YouTube, TikTok en meer. Draai, spiegel en exporteer als PNG, JPEG of WebP."
  intro: "Snijd je afbeeldingen snel en eenvoudig bij met kant-en-klare presets voor de belangrijkste sociale netwerken. Alle verwerking gebeurt lokaal in je browser, wat betekent dat je afbeeldingen je apparaat nooit verlaten en je privacy volledig behouden blijft."
  upload_hint: "Ondersteunt JPG, PNG, WebP, GIF en meer"
  aspect_ratio: "Beeldverhouding"
  width: "Breedte (px)"
  height: "Hoogte (px)"
  preset_free: "Vrij — Geen beperking"
  preset_square: "Instagram-bericht, profielfoto"
  preset_portrait: "Instagram-portret (beste betrokkenheid)"
  preset_stories: "Stories / Reels / TikTok / Shorts"
  preset_landscape: "Facebook / Twitter-voorbeeld"
  preset_custom: "Aangepaste afmetingen"
  rotate: "Draaien"
  rotate_left: "90° naar links draaien"
  rotate_right: "90° naar rechts draaien"
  flip: "Spiegelen"
  flip_h: "Horizontaal spiegelen"
  flip_v: "Verticaal spiegelen"
  horizontal: "H"
  vertical: "V"
  reset: "Resetten"
  format: "Exportformaat"
  high_quality: "hoogste kwaliteit"
  smaller_size: "kleinere bestandsgrootte"
  modern: "modern formaat"
  quality: "Kwaliteit"
  crop_btn: "Bijsnijden en Downloaden"
  new_image: "Nieuwe Afbeelding"
  features_title: "Functies van de Afbeeldingsbijsnijder"
  feature_1: "Kant-en-klare presets voor Instagram, YouTube, TikTok en andere sociale netwerken"
  feature_2: "Aangepaste pixelafmetingen met vergrendelde beeldverhouding"
  feature_3: "90° draaien en horizontaal of verticaal spiegelen"
  feature_4: "Exporteren als PNG, JPEG of WebP met instelbare kwaliteit"
  use_cases_title: "Wanneer de afbeeldingsbijsnijder te gebruiken"
  use_cases_desc: "Bijsnijden is een van de meest voorkomende bewerkingstaken. De juiste uitsnede verbetert de compositie, voldoet aan platformvereisten en vermindert onnodige bestandsgrootte."
  uc_1_title: "Content voor sociale media"
  uc_1_desc: "Gebruik de kant-en-klare presets om de exacte afmetingen te krijgen die vereist zijn door Instagram, YouTube, TikTok, Facebook, Twitter en andere platforms."
  uc_2_title: "Profielfoto's en avatars"
  uc_2_desc: "Snijd foto's bij tot een perfect 1:1-vierkant voor profielfoto's, teampagina's of visitekaartjes."
  uc_3_title: "Videominiaturen"
  uc_3_desc: "Maak 16:9-miniaturen voor YouTube en andere videoplatforms met de ideale uitsnede en compositie."
  uc_4_title: "Afbeeldingen voor blog en website"
  uc_4_desc: "Snijd afbeeldingen bij tot specifieke afmetingen die passen bij de lay-out van je site, zonder software te installeren."
  how_to_title: "Hoe een Afbeelding Bijsnijden"
  how_1_title: "Upload je afbeelding"
  how_1_desc: "Klik om te uploaden of versleep een afbeelding (JPG, PNG, WebP, GIF of BMP) om te beginnen."
  how_2_title: "Kies een preset of aangepast formaat"
  how_2_desc: "Selecteer een socialmedia-preset of voer pixelafmetingen in. Sleep de bijsnijdgrepen of de afbeelding om de selectie aan te passen."
  how_3_title: "Download de bijgesneden afbeelding"
  how_3_desc: "Kies PNG voor maximale kwaliteit, JPEG of WebP voor een kleiner bestand, en klik op Bijsnijden en Downloaden."
  faq_title: "Vragen en Antwoorden"
  faq_1_q: "Hoe snijd ik een afbeelding bij voor Instagram?"
  faq_1_a: "Selecteer het formaat 1:1 (Vierkant) voor feed-berichten, 4:5 (Portret) voor betere betrokkenheid, of 9:16 voor Stories en Reels. Upload, pas aan en download."
  faq_2_q: "Wat is de ideale grootte voor een YouTube-thumbnail?"
  faq_2_a: "YouTube-thumbnails moeten 1280×720 pixels zijn (16:9). Selecteer het formaat 'YouTube' om de afbeelding in de exacte afmetingen bij te snijden."
  faq_3_q: "Kan ik bijsnijden zonder kwaliteitsverlies?"
  faq_3_a: "Ja. Exporteer als PNG voor verliesvrije kwaliteit. Voor foto's behoudt JPEG of WebP op 90%+ uitstekende details met een kleinere bestandsgrootte."
  faq_4_q: "Kan ik de afbeelding draaien of spiegelen voor het bijsnijden?"
  faq_4_a: "Ja. Gebruik de draaiknoppen om de afbeelding 90° te draaien en de spiegelknoppen om deze horizontaal of verticaal te spiegelen voordat je het bijsnijden voltooit."
  see1: "Dominante Kleuren van de Afbeelding"
  see2: "QR-Code Generator"
  see3: "Barcode Generator"
  see4: "Afbeeldingsgrootte Wijzigen"
</i18n>
