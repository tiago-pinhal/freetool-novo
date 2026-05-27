<script setup lang="ts">
declare global {
  interface Window { StackBlur: any }
}

const { t } = useI18n({ useScope: 'local' })

// ─── Refs de DOM ──────────────────────────────────────────────────────────────
const canvasRef   = ref<HTMLCanvasElement | null>(null)
const previewRef  = ref<HTMLCanvasElement | null>(null)
const wrapperRef  = ref<HTMLDivElement | null>(null)

// ─── Estado da imagem ─────────────────────────────────────────────────────────
const imageSrc    = ref('')
const imageLoaded = ref(false)
const scriptReady = ref(false)
let   originalImage: HTMLImageElement | null = null
let   originalPixels: ImageData | null = null

// ─── Controles ────────────────────────────────────────────────────────────────
const blurRadius  = ref(10)
const blurMode    = ref<'full' | 'region'>('full')
const regionShape = ref<'rectangle' | 'circle'>('rectangle')

// ─── Seleção de região ────────────────────────────────────────────────────────
interface SelectionShape {
  x: number
  y: number
  w: number
  h: number
  shape: 'rectangle' | 'circle'
}

const isSelecting      = ref(false)
const selections       = ref<SelectionShape[]>([])
const currentSelection = reactive({ x: 0, y: 0, w: 0, h: 0 })
let   dragStart        = { x: 0, y: 0 }

// ─── SEO / i18n ───────────────────────────────────────────────────────────────
usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
  ]
})

useHead({
  title: t('page_title'),
  meta: [{ name: 'description', content: t('meta') }]
})

// ─── Carregamento do StackBlur via CDN ────────────────────────────────────────
const { onLoaded } = useScript(
  'https://unpkg.com/stackblur-canvas@2.7.0/dist/stackblur.min.js',
  { trigger: 'client' }
)

onLoaded(() => {
  scriptReady.value = true
  if (imageLoaded.value) applyBlur()
})

onBeforeUnmount(() => {
  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value)
})

// ─── Upload ───────────────────────────────────────────────────────────────────
function onImageSelected(file: File | File[]) {
  const selectedFile = Array.isArray(file) ? file[0] : file
  if (!selectedFile) return

  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value)
  imageSrc.value = URL.createObjectURL(selectedFile)

  const img = new Image()
  img.onload = () => {
    originalImage = img
    imageLoaded.value = true
    selections.value = []

    nextTick(() => {
      drawOriginal()
      if (scriptReady.value) applyBlur()
    })
  }
  img.src = imageSrc.value
}

// ─── Desenha imagem original no canvas principal ──────────────────────────────
function drawOriginal() {
  const canvas = canvasRef.value
  if (!canvas || !originalImage) return

  canvas.width  = originalImage.naturalWidth
  canvas.height = originalImage.naturalHeight

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(originalImage, 0, 0)
  originalPixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  syncPreview()
}

// ─── Aplica blur ──────────────────────────────────────────────────────────────
function applyBlur() {
  const canvas = canvasRef.value
  if (!canvas || !window.StackBlur || !originalImage || !originalPixels) return

  const ctx = canvas.getContext('2d')!

  if (blurMode.value === 'full') {
    ctx.putImageData(originalPixels, 0, 0)
    window.StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, blurRadius.value)

  } else {
    // Restaura original
    ctx.putImageData(originalPixels, 0, 0)

    if (selections.value.length > 0) {
      // Canvas temporário com blur aplicado na imagem inteira
      const tmp    = document.createElement('canvas')
      tmp.width    = canvas.width
      tmp.height   = canvas.height
      const tmpCtx = tmp.getContext('2d')!
      tmpCtx.putImageData(originalPixels, 0, 0)
      window.StackBlur.canvasRGB(tmp, 0, 0, tmp.width, tmp.height, blurRadius.value)

      // Para cada seleção salva, copia apenas a região borrada de volta ao canvas principal
      for (const sel of selections.value) {
        const rx = sel.w < 0 ? sel.x + sel.w : sel.x
        const ry = sel.h < 0 ? sel.y + sel.h : sel.y
        const rw = Math.abs(sel.w)
        const rh = Math.abs(sel.h)
        if (rw === 0 || rh === 0) continue

        ctx.save()
        ctx.beginPath()
        if (sel.shape === 'circle') {
          ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, 2 * Math.PI)
        } else {
          ctx.rect(rx, ry, rw, rh)
        }
        ctx.clip()
        ctx.drawImage(tmp, rx, ry, rw, rh, rx, ry, rw, rh)
        ctx.restore()
      }
    }
  }

  syncPreview()
}

// ─── Sincroniza canvas de preview ─────────────────────────────────────────────
function syncPreview() {
  const src  = canvasRef.value
  const dest = previewRef.value
  if (!src || !dest) return

  dest.width  = src.width
  dest.height = src.height

  const ctx = dest.getContext('2d')!
  ctx.drawImage(src, 0, 0)

  if (blurMode.value === 'region' && isSelecting.value) {
    drawSelectionOverlay(ctx, currentSelection, regionShape.value)
  }
}

function drawSelectionOverlay(
  ctx: CanvasRenderingContext2D,
  sel: { x: number; y: number; w: number; h: number },
  shape: 'rectangle' | 'circle'
) {
  const rx = sel.w < 0 ? sel.x + sel.w : sel.x
  const ry = sel.h < 0 ? sel.y + sel.h : sel.y
  const rw = Math.abs(sel.w)
  const rh = Math.abs(sel.h)
  if (rw === 0 || rh === 0) return

  ctx.save()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth   = Math.max(2, canvasRef.value!.width * 0.002)
  ctx.setLineDash([8, 4])
  ctx.beginPath()

  if (shape === 'circle') {
    ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, 2 * Math.PI)
  } else {
    ctx.rect(rx, ry, rw, rh)
  }

  ctx.stroke()
  ctx.restore()
}

// ─── Mouse events ─────────────────────────────────────────────────────────────
function getCanvasCoords(e: PointerEvent): { x: number; y: number } {
  const preview = previewRef.value!
  const rect    = preview.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) * (preview.width  / rect.width),
    y: (e.clientY - rect.top)  * (preview.height / rect.height),
  }
}

function onPointerDown(e: PointerEvent) {
  if (blurMode.value !== 'region') return
  // Captura o ponteiro para receber eventos mesmo fora do canvas durante o arrasto
  const preview = previewRef.value
  if (preview) {
    try {
      preview.setPointerCapture(e.pointerId)
    } catch {}
  }
  const coords = getCanvasCoords(e)
  dragStart    = coords
  isSelecting.value = true
  Object.assign(currentSelection, { x: coords.x, y: coords.y, w: 0, h: 0 })
}

function onPointerMove(e: PointerEvent) {
  if (!isSelecting.value || blurMode.value !== 'region') return
  const coords        = getCanvasCoords(e)
  currentSelection.w  = coords.x - dragStart.x
  currentSelection.h  = coords.y - dragStart.y
  syncPreview()
}

function onPointerUp(e: PointerEvent) {
  if (!isSelecting.value) return
  isSelecting.value = false

  const preview = previewRef.value
  if (preview) {
    try {
      preview.releasePointerCapture(e.pointerId)
    } catch {}
  }

  if (currentSelection.w !== 0 && currentSelection.h !== 0) {
    // Persiste a seleção no array
    selections.value.push({
      x: currentSelection.x,
      y: currentSelection.y,
      w: currentSelection.w,
      h: currentSelection.h,
      shape: regionShape.value,
    })
    Object.assign(currentSelection, { x: 0, y: 0, w: 0, h: 0 })
    if (scriptReady.value) applyBlur()
  }
}

// ─── Undo / Clear ─────────────────────────────────────────────────────────────

/** Remove a última seleção adicionada e reaplica o blur nas restantes */
function undoLastSelection() {
  if (selections.value.length === 0) return
  selections.value.pop()
  applyBlur()
}

/** Remove todas as seleções e restaura a imagem original */
function clearAllSelections() {
  selections.value = []
  // Restaura pixels originais diretamente — sem blur
  const canvas = canvasRef.value
  if (!canvas || !originalPixels) return
  canvas.getContext('2d')!.putImageData(originalPixels, 0, 0)
  syncPreview()
}

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(blurRadius,   () => { if (scriptReady.value && imageLoaded.value) applyBlur() })
watch(regionShape,  () => { if (scriptReady.value && imageLoaded.value) applyBlur() })

watch(blurMode, () => {
  selections.value = []
  drawOriginal()
  if (scriptReady.value && imageLoaded.value) applyBlur()
})

// ─── Download ─────────────────────────────────────────────────────────────────
function download() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = 'imagem-blur.png'
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

// ─── Nova imagem ──────────────────────────────────────────────────────────────
function newImage() {
  imageLoaded.value = false
  selections.value  = []
  if (imageSrc.value) URL.revokeObjectURL(imageSrc.value)
  imageSrc.value    = ''
  originalImage     = null
  originalPixels    = null
  blurRadius.value  = 10
  blurMode.value    = 'full'
  regionShape.value = 'rectangle'
}

defineI18nRoute({
  paths: {
    en: '/blur-image',
    pt: '/desfocar-imagem',
    es: '/desenfocar-imagen',
    fr: '/flouter-image',
    it: '/sfoca-immagine',
    id: '/blur-gambar',
    de: '/bild-weichzeichnen',
    nl: '/afbeelding-vervagen',
    ru: '/razmyt-izobrazhenie',
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
      { label: t('see2'), to: 'resize-image' },
      { label: t('see3'), to: 'dominant-colors-of-the-image' },
      { label: t('see4'), to: 'qrcode-generator' },
    ]"
  >
    <!-- Estado de upload -->
    <div v-if="!imageLoaded" class="flex flex-col items-center justify-center py-8 gap-4">
      <ImageUploader :show="true" @on-file="onImageSelected" />
      <p class="text-sm text-base-content/70">{{ t('upload_hint') }}</p>
    </div>

    <!-- Estado de edição -->
    <div v-else class="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">

      <!-- Painel de controles -->
      <div class="space-y-4">

        <!-- Modo de blur -->
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-base-content/60">{{ t('mode_label') }}</p>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" class="radio radio-primary radio-sm" value="full" v-model="blurMode" />
              <span class="text-sm font-medium">{{ t('mode_full') }}</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" class="radio radio-primary radio-sm" value="region" v-model="blurMode" />
              <span class="text-sm font-medium">{{ t('mode_region') }}</span>
            </label>
          </div>

          <!-- Formato da seleção -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="blurMode === 'region'" class="pt-3 border-t border-base-content/10 space-y-2">
              <p class="text-[10px] font-bold uppercase tracking-widest text-base-content/50">{{ t('shape_label') }}</p>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" class="radio radio-primary radio-xs" value="rectangle" v-model="regionShape" />
                  <span>{{ t('shape_rect') }}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" class="radio radio-primary radio-xs" value="circle" v-model="regionShape" />
                  <span>{{ t('shape_circle') }}</span>
                </label>
              </div>
            </div>
          </Transition>

          <!-- Undo / Clear — só aparece quando há seleções -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="blurMode === 'region' && selections.length > 0" class="pt-3 border-t border-base-content/10 flex gap-2">
              <button
                type="button"
                class="btn btn-outline btn-xs flex-1"
                @click="undoLastSelection"
              >
                <Icon name="heroicons:arrow-uturn-left-20-solid" class="w-3.5 h-3.5" />
                {{ t('undo_btn') }}
              </button>
              <button
                type="button"
                class="btn btn-ghost btn-xs text-error hover:bg-error/10 flex-1"
                @click="clearAllSelections"
              >
                <Icon name="heroicons:trash-20-solid" class="w-3.5 h-3.5" />
                {{ t('clear_btn') }}
              </button>
            </div>
          </Transition>

          <!-- Dica de uso -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <p v-if="blurMode === 'region'" class="text-xs text-base-content/50 leading-relaxed">
              {{ t('region_hint') }}
            </p>
          </Transition>
        </section>

        <!-- Controle de radius -->
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
          <label class="form-control w-full">
            <span class="label-text mb-1 font-bold">
              {{ t('blur_label') }}: <span class="text-primary">{{ blurRadius }}px</span>
            </span>
            <input
              type="range"
              v-model.number="blurRadius"
              min="0"
              max="100"
              step="1"
              class="range range-primary range-sm"
            />
            <div class="flex justify-between text-xs text-base-content/40 px-1 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </label>
        </section>

        <!-- Botões de ação -->
        <div class="flex flex-col gap-2">
          <button type="button" class="btn btn-primary w-full" @click="download">
            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
            {{ t('download_btn') }}
          </button>
          <button type="button" class="btn btn-ghost w-full" @click="newImage">
            <Icon name="heroicons:arrow-path-20-solid" class="w-5 h-5" />
            {{ t('new_image') }}
          </button>
        </div>
      </div>

      <!-- Preview interativo -->
      <div
        ref="wrapperRef"
        class="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200/20 min-h-64 flex items-center justify-center"
        :class="{ 'cursor-crosshair': blurMode === 'region' }"
      >
        <canvas ref="canvasRef" class="hidden" />
        <canvas
          ref="previewRef"
          class="block w-full h-auto max-h-[72vh] object-contain touch-none"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
        />
      </div>
    </div>

    <!-- Seção informativa -->
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

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
pt:
  title: "Desfoque de Imagem"
  page_title: "Desfocar / Borrar Imagem Online - Rostos, Fundo e Áreas"
  meta: "Desfoque ou borre imagens online de forma fácil e rápida. Aplique blur na foto inteira, em rostos, no fundo ou em áreas específicas como senhas em capturas de tela."
  intro: "Esta ferramenta online para desfocar (ou borrar) imagens oferece controle preciso sobre onde e como o blur é aplicado. Dá para desfocar a imagem inteira, embaçar o fundo, cobrir rostos ou selecionar múltiplas regiões independentes usando retângulo ou círculo. Cada seleção é acumulada e pode ser desfeita individualmente. Todo o processamento ocorre localmente no navegador, garantindo total privacidade."
  upload_hint: "Suporta JPG, PNG, WebP e outros formatos"
  mode_label: "Modo de desfoque"
  mode_full: "Imagem inteira"
  mode_region: "Região selecionável"
  region_hint: "Clique e arraste sobre a imagem para selecionar a área que receberá o desfoque. É possível adicionar múltiplas seleções."
  shape_label: "Formato da seleção"
  shape_rect: "Retângulo"
  shape_circle: "Círculo"
  undo_btn: "Desfazer"
  clear_btn: "Limpar todas"
  blur_label: "Intensidade do blur"
  download_btn: "Baixar imagem"
  new_image: "Nova imagem"
  features_title: "Recursos da Ferramenta"
  feature_1: "Blur na imagem inteira com controle deslizante de intensidade de 0 a 100"
  feature_2: "Seleção de regiões por retângulo ou círculo com suporte a múltiplas áreas acumuladas"
  feature_3: "Desfazer a última seleção ou limpar todas de uma vez"
  feature_4: "Processamento 100% local no navegador, garantindo total privacidade"
  use_cases_title: "Quando usar o Desfoque de Imagem"
  use_cases_desc: "O desfoque é uma técnica essencial para proteger privacidade, criar efeitos visuais e destacar elementos em composições."
  uc_1_title: "Desfocar Rosto e Proteger Dados Sensíveis"
  uc_1_desc: "Desfoque rostos em fotos, placas de veículos, documentos ou qualquer informação pessoal antes de compartilhar uma imagem publicamente. Use a seleção circular para cobrir rostos com precisão."
  uc_2_title: "Desfocar Fundo e Efeito Bokeh"
  uc_2_desc: "Aplique desfoque suave na imagem inteira para destacar o elemento principal ou borre o fundo em etapas com seleções acumuladas para criar um efeito bokeh simples."
  uc_3_title: "Borrar Texto e Senhas em Capturas de Tela"
  uc_3_desc: "Borre campos de senha, tokens, e-mails ou qualquer dado confidencial em prints antes de incluí-los em tutoriais ou relatórios. Selecione cada campo individualmente e desfaça se necessário."
  how_to_title: "Como desfocar uma imagem"
  how_1_title: "Faça o upload da imagem"
  how_1_desc: "Clique para selecionar ou arraste qualquer arquivo de imagem (JPG, PNG, WebP) para a área de upload."
  how_2_title: "Configure o modo e a intensidade"
  how_2_desc: "Escolha entre desfoque na imagem inteira ou por região. No modo região, selecione o formato retangular ou circular, arraste sobre as áreas desejadas e ajuste a intensidade com o controle deslizante. Use o botão desfazer para remover a última seleção ou limpar todas para recomeçar."
  how_3_title: "Baixe o resultado"
  how_3_desc: "Clique em Baixar imagem para salvar o resultado em PNG com a resolução original da imagem."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Consigo desfocar múltiplas regiões ao mesmo tempo?"
  faq_1_a: "Sim. No modo região, cada seleção feita com o mouse é acumulada sobre a imagem. É possível adicionar quantas regiões quiser, desfazer a última individualmente ou limpar todas de uma vez."
  faq_2_q: "O download preserva a resolução original?"
  faq_2_a: "Sim. O download é gerado diretamente na resolução nativa da imagem, sem nenhum redimensionamento ou perda de qualidade."
  see1: "Recortar Imagem"
  see2: "Redimensionar Imagem"
  see3: "Cores Dominantes"
  see4: "Gerador de QR Code"

en:
  title: "Blur Image"
  page_title: "Blur Image Online - Blur Photo, Faces, Background & Text Free"
  meta: "Blur images and photos online for free. Apply the blur effect to the entire image or selectively blur faces, backgrounds, sensitive text in screenshots, or any custom region."
  intro: "This free online image blur tool gives you precise control over where and how the blur is applied. Whether you need to blur a face, blur the background of a photo, or hide sensitive text in a screenshot, you can blur the entire image or select multiple independent regions using a rectangle or circle. Each selection is accumulated and can be undone individually. All processing happens locally in your browser, ensuring complete privacy."
  upload_hint: "Supports JPG, PNG, WebP and other formats"
  mode_label: "Blur mode"
  mode_full: "Entire image"
  mode_region: "Selectable region"
  region_hint: "Click and drag over the image to select the area to blur. You can add multiple selections."
  shape_label: "Selection shape"
  shape_rect: "Rectangle"
  shape_circle: "Circle"
  undo_btn: "Undo"
  clear_btn: "Clear all"
  blur_label: "Blur intensity"
  download_btn: "Download image"
  new_image: "New image"
  features_title: "Tool Features"
  feature_1: "Full image blur with an intensity slider from 0 to 100"
  feature_2: "Region selection by rectangle or circle with support for multiple accumulated areas"
  feature_3: "Undo the last selection or clear all at once"
  feature_4: "100% local processing in the browser, ensuring complete privacy"
  use_cases_title: "When to Use the Image Blur Tool"
  use_cases_desc: "Blurring is an essential technique for protecting privacy, creating visual effects, and highlighting elements in compositions."
  uc_1_title: "Blur Faces and Protect Sensitive Data"
  uc_1_desc: "Blur faces in photos, hide license plates, documents, or any personal information before sharing an image publicly. Use the circular selection to cover faces with precision."
  uc_2_title: "Blur Background and Bokeh Effect"
  uc_2_desc: "Apply a soft blur to the entire image to highlight the main subject, or blur the background of a photo in steps using accumulated selections to create a simple bokeh effect."
  uc_3_title: "Blur Text and Passwords in Screenshots"
  uc_3_desc: "Blur password fields, tokens, emails, or any confidential text in screenshots before including them in tutorials or reports. Select each field individually and undo if needed."
  how_to_title: "How to blur an image"
  how_1_title: "Upload your image"
  how_1_desc: "Click to select or drag any image file (JPG, PNG, WebP) into the upload area."
  how_2_title: "Set the mode and intensity"
  how_2_desc: "Choose between blurring the entire image or a specific region. In region mode, select a rectangular or circular shape, drag over the desired areas, and adjust the intensity with the slider. Use the undo button to remove the last selection or clear all to start over."
  how_3_title: "Download the result"
  how_3_desc: "Click Download image to save the result as a PNG at the original image resolution."
  faq_title: "Questions and Answers"
  faq_1_q: "Can I blur multiple regions at the same time?"
  faq_1_a: "Yes. In region mode, each selection made with the mouse is accumulated on the image. You can add as many regions as you want, undo the last one individually, or clear all at once."
  faq_2_q: "Does the download preserve the original resolution?"
  faq_2_a: "Yes. The download is generated directly at the native resolution of the image, with no resizing or quality loss."
  see1: "Crop Image"
  see2: "Image Resizer"
  see3: "Dominant Colors"
  see4: "QR Code Generator"

es:
  title: "Desenfocar Imagen"
  page_title: "Desenfocar o Difuminar Imagen Online - Rostros y Fondo"
  meta: "Desenfoca o difumina imágenes online gratis y fácilmente. Aplica el efecto blur a la foto completa, a rostros, al fondo o solo a las áreas que desees."
  intro: "Esta herramienta online para desenfocar (o difuminar) imágenes ofrece un control preciso sobre dónde y cómo se aplica el blur. Puedes desenfocar la imagen completa, difuminar el fondo, ocultar rostros o seleccionar múltiples regiones independientes usando un rectángulo o un círculo. Cada selección se acumula y puede deshacerse individualmente. Todo el procesamiento ocurre localmente en el navegador, garantizando total privacidad."
  upload_hint: "Admite JPG, PNG, WebP y otros formatos"
  mode_label: "Modo de desenfoque"
  mode_full: "Imagen completa"
  mode_region: "Región seleccionable"
  region_hint: "Haz clic y arrastra sobre la imagen para seleccionar el área que recibirá el desenfoque. Puedes agregar múltiples selecciones."
  shape_label: "Forma de la selección"
  shape_rect: "Rectángulo"
  shape_circle: "Círculo"
  undo_btn: "Deshacer"
  clear_btn: "Limpiar todo"
  blur_label: "Intensidad del desenfoque"
  download_btn: "Descargar imagen"
  new_image: "Nueva imagen"
  features_title: "Características de la Herramienta"
  feature_1: "Desenfoque en la imagen completa con control deslizante de intensidad de 0 a 100"
  feature_2: "Selección de regiones por rectángulo o círculo con soporte para múltiples áreas acumuladas"
  feature_3: "Deshacer la última selección o limpiar todas de una vez"
  feature_4: "Procesamiento 100% local en el navegador, garantizando total privacidad"
  use_cases_title: "Cuándo usar el Desenfoque de Imagen"
  use_cases_desc: "El desenfoque es una técnica esencial para proteger la privacidad, crear efectos visuales y destacar elementos en composiciones."
  uc_1_title: "Desenfocar Rostros y Proteger Datos Sensibles"
  uc_1_desc: "Desenfoca rostros, oculta matrículas, documentos o cualquier información personal antes de compartir una imagen públicamente. Usa la selección circular para cubrir rostros con precisión."
  uc_2_title: "Desenfocar Fondo y Efecto Bokeh"
  uc_2_desc: "Aplica un desenfoque suave a la imagen completa para destacar el elemento principal, o difumina el fondo en pasos con selecciones acumuladas para crear un efecto bokeh simple."
  uc_3_title: "Difuminar Texto y Contraseñas en Capturas de Pantalla"
  uc_3_desc: "Difumina campos de contraseña, tokens, correos electrónicos o cualquier dato confidencial en capturas de pantalla antes de incluirlos en tutoriales o informes. Selecciona cada campo individualmente y deshaz si es necesario."
  how_to_title: "Cómo desenfocar una imagen"
  how_1_title: "Sube tu imagen"
  how_1_desc: "Haz clic para seleccionar o arrastra cualquier archivo de imagen (JPG, PNG, WebP) al área de carga."
  how_2_title: "Configura el modo y la intensidad"
  how_2_desc: "Elige entre desenfocar la imagen completa o una región específica. En el modo región, selecciona la forma rectangular o circular, arrastra sobre las áreas deseadas y ajusta la intensidad con el control deslizante. Usa el botón deshacer para eliminar la última selección o limpiar todo para empezar de nuevo."
  how_3_title: "Descarga el resultado"
  how_3_desc: "Haz clic en Descargar imagen para guardar el resultado en PNG con la resolución original de la imagen."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Puedo desenfocar múltiples regiones al mismo tiempo?"
  faq_1_a: "Sí. En el modo región, cada selección hecha con el mouse se acumula sobre la imagen. Puedes agregar tantas regiones como quieras, deshacer la última individualmente o limpiar todas de una vez."
  faq_2_q: "¿La descarga preserva la resolución original?"
  faq_2_a: "Sí. La descarga se genera directamente en la resolución nativa de la imagen, sin ningún redimensionamiento ni pérdida de calidad."
  see1: "Recortar Imagen"
  see2: "Redimensionar Imagen"
  see3: "Colores Dominantes"
  see4: "Generador de Código QR"

fr:
  title: "Flouter une Image"
  page_title: "Flouter une Photo ou Image en Ligne - Visage, Arrière-plan, Zone"
  meta: "Floutez une photo ou une image en ligne gratuitement. Appliquez l'effet de flou sur la photo entière, sur un visage, sur l'arrière-plan ou uniquement sur les zones de votre choix."
  intro: "Cet outil en ligne pour flouter une image vous offre un contrôle précis sur l'endroit et la manière dont le flou est appliqué. Vous pouvez flouter l'image entière, flouter un visage, flouter l'arrière-plan d'une photo ou sélectionner plusieurs régions indépendantes en utilisant un rectangle ou un cercle. Chaque sélection est cumulée et peut être annulée individuellement. Tout le traitement s'effectue localement dans votre navigateur, garantissant une confidentialité totale."
  upload_hint: "Prend en charge JPG, PNG, WebP et d'autres formats"
  mode_label: "Mode de floutage"
  mode_full: "Image entière"
  mode_region: "Région sélectionnable"
  region_hint: "Cliquez et faites glisser sur l'image pour sélectionner la zone à flouter. Vous pouvez ajouter plusieurs sélections."
  shape_label: "Forme de la sélection"
  shape_rect: "Rectangle"
  shape_circle: "Cercle"
  undo_btn: "Annuler"
  clear_btn: "Tout effacer"
  blur_label: "Intensité du flou"
  download_btn: "Télécharger l'image"
  new_image: "Nouvelle image"
  features_title: "Fonctionnalités de l'outil"
  feature_1: "Flou sur l'image entière avec un curseur d'intensité de 0 à 100"
  feature_2: "Sélection de régions par rectangle ou cercle avec prise en charge de plusieurs zones cumulées"
  feature_3: "Annuler la dernière sélection ou tout effacer en une seule fois"
  feature_4: "Traitement 100% local dans le navigateur, garantissant une confidentialité totale"
  use_cases_title: "Quand utiliser le floutage d'image"
  use_cases_desc: "Le floutage est une technique essentielle pour protéger la vie privée, créer des effets visuels et mettre en valeur des éléments dans des compositions."
  uc_1_title: "Flouter un visage et protéger les données sensibles"
  uc_1_desc: "Floutez des visages sur des photos, masquez des plaques d'immatriculation, des documents ou toute information personnelle avant de partager une image publiquement. Utilisez la sélection circulaire pour couvrir les visages avec précision."
  uc_2_title: "Flouter l'arrière-plan et effet bokeh"
  uc_2_desc: "Appliquez un flou doux sur l'image entière pour mettre en valeur le sujet principal, ou floutez l'arrière-plan d'une photo par étapes avec des sélections cumulées pour créer un effet bokeh simple."
  uc_3_title: "Flouter du texte et des mots de passe dans les captures d'écran"
  uc_3_desc: "Floutez des champs de mot de passe, des tokens, des e-mails ou toute donnée confidentielle dans des captures d'écran avant de les inclure dans des tutoriels ou des rapports. Sélectionnez chaque champ individuellement et annulez si nécessaire."
  how_to_title: "Comment flouter une image"
  how_1_title: "Importez votre image"
  how_1_desc: "Cliquez pour sélectionner ou faites glisser n'importe quel fichier image (JPG, PNG, WebP) dans la zone de téléchargement."
  how_2_title: "Configurez le mode et l'intensité"
  how_2_desc: "Choisissez entre flouter l'image entière ou une région spécifique. En mode région, sélectionnez la forme rectangulaire ou circulaire, faites glisser sur les zones souhaitées et ajustez l'intensité avec le curseur. Utilisez le bouton annuler pour supprimer la dernière sélection ou tout effacer pour recommencer."
  how_3_title: "Téléchargez le résultat"
  how_3_desc: "Cliquez sur Télécharger l'image pour enregistrer le résultat en PNG à la résolution originale de l'image."
  faq_title: "Questions et Réponses"
  faq_1_q: "Puis-je flouter plusieurs régions en même temps ?"
  faq_1_a: "Oui. En mode région, chaque sélection effectuée avec la souris est cumulée sur l'image. Vous pouvez ajouter autant de régions que vous le souhaitez, annuler la dernière individuellement ou tout effacer en une seule fois."
  faq_2_q: "Le téléchargement préserve-t-il la résolution originale ?"
  faq_2_a: "Oui. Le téléchargement est généré directement à la résolution native de l'image, sans aucun redimensionnement ni perte de qualité."
  see1: "Rogner une image"
  see2: "Redimensionner une image"
  see3: "Couleurs dominantes"
  see4: "Générateur de QR Code"

it:
  title: "Sfoca Immagine"
  page_title: "Sfocare Foto e Immagine Online Gratis - Volti, Sfondo, Aree"
  meta: "Sfoca foto e immagini online gratis e in modo semplice. Applica l'effetto di sfocatura all'intera foto, ai volti, allo sfondo o solo alle aree che desideri."
  intro: "Questo strumento online per sfocare immagini offre un controllo preciso su dove e come viene applicata la sfocatura. Puoi sfocare l'intera immagine, sfocare lo sfondo di una foto, coprire volti o selezionare più regioni indipendenti usando un rettangolo o un cerchio. Ogni selezione viene accumulata e può essere annullata individualmente. Tutta l'elaborazione avviene localmente nel browser, garantendo la massima privacy."
  upload_hint: "Supporta JPG, PNG, WebP e altri formati"
  mode_label: "Modalità di sfocatura"
  mode_full: "Intera immagine"
  mode_region: "Regione selezionabile"
  region_hint: "Fai clic e trascina sull'immagine per selezionare l'area da sfocare. Puoi aggiungere più selezioni."
  shape_label: "Forma della selezione"
  shape_rect: "Rettangolo"
  shape_circle: "Cerchio"
  undo_btn: "Annulla"
  clear_btn: "Cancella tutto"
  blur_label: "Intensità della sfocatura"
  download_btn: "Scarica immagine"
  new_image: "Nuova immagine"
  features_title: "Funzionalità dello strumento"
  feature_1: "Sfocatura dell'intera immagine con cursore di intensità da 0 a 100"
  feature_2: "Selezione di regioni per rettangolo o cerchio con supporto per più aree accumulate"
  feature_3: "Annulla l'ultima selezione o cancella tutto in una volta"
  feature_4: "Elaborazione 100% locale nel browser, garantendo la massima privacy"
  use_cases_title: "Quando usare la sfocatura dell'immagine"
  use_cases_desc: "La sfocatura è una tecnica essenziale per proteggere la privacy, creare effetti visivi e mettere in risalto elementi nelle composizioni."
  uc_1_title: "Sfocare i volti e proteggere i dati sensibili"
  uc_1_desc: "Sfoca volti nelle foto, nascondi targhe, documenti o qualsiasi informazione personale prima di condividere un'immagine pubblicamente. Usa la selezione circolare per coprire i volti con precisione."
  uc_2_title: "Sfocare lo sfondo ed effetto bokeh"
  uc_2_desc: "Applica una sfocatura morbida all'intera immagine per mettere in risalto il soggetto principale, oppure sfoca lo sfondo in più passaggi con selezioni accumulate per creare un semplice effetto bokeh."
  uc_3_title: "Sfocare testo e password negli screenshot"
  uc_3_desc: "Sfoca campi password, token, e-mail o qualsiasi dato riservato negli screenshot prima di includerli in tutorial o report. Seleziona ogni campo individualmente e annulla se necessario."
  how_to_title: "Come sfocare un'immagine"
  how_1_title: "Carica la tua immagine"
  how_1_desc: "Fai clic per selezionare o trascina qualsiasi file immagine (JPG, PNG, WebP) nell'area di caricamento."
  how_2_title: "Configura la modalità e l'intensità"
  how_2_desc: "Scegli tra la sfocatura dell'intera immagine o di una regione specifica. In modalità regione, seleziona la forma rettangolare o circolare, trascina sulle aree desiderate e regola l'intensità con il cursore. Usa il pulsante annulla per rimuovere l'ultima selezione o cancella tutto per ricominciare."
  how_3_title: "Scarica il risultato"
  how_3_desc: "Fai clic su Scarica immagine per salvare il risultato in PNG alla risoluzione originale dell'immagine."
  faq_title: "Domande e Risposte"
  faq_1_q: "Posso sfocare più regioni contemporaneamente?"
  faq_1_a: "Sì. In modalità regione, ogni selezione effettuata con il mouse viene accumulata sull'immagine. Puoi aggiungere tutte le regioni che vuoi, annullare l'ultima individualmente o cancellare tutto in una volta."
  faq_2_q: "Il download preserva la risoluzione originale?"
  faq_2_a: "Sì. Il download viene generato direttamente alla risoluzione nativa dell'immagine, senza alcun ridimensionamento o perdita di qualità."
  see1: "Ritaglia immagine"
  see2: "Ridimensiona immagine"
  see3: "Colori dominanti"
  see4: "Generatore di QR Code"

id:
  title: "Blur Gambar"
  page_title: "Blur Foto dan Gambar Online Gratis - Wajah, Latar Belakang, Area"
  meta: "Blur foto dan gambar online gratis dengan mudah. Terapkan efek blur pada seluruh foto, wajah, latar belakang, atau hanya area yang ingin Anda sensor."
  intro: "Alat blur gambar online ini memberikan kontrol tepat atas di mana dan bagaimana blur diterapkan. Anda dapat memblur seluruh gambar, memburamkan latar belakang, menyensor wajah, atau memilih beberapa wilayah independen menggunakan persegi panjang atau lingkaran. Setiap seleksi terakumulasi dan dapat dibatalkan satu per satu. Semua pemrosesan dilakukan secara lokal di browser Anda, menjamin privasi yang sepenuhnya terlindungi."
  upload_hint: "Mendukung JPG, PNG, WebP dan format lainnya"
  mode_label: "Mode blur"
  mode_full: "Seluruh gambar"
  mode_region: "Wilayah yang dapat dipilih"
  region_hint: "Klik dan seret pada gambar untuk memilih area yang akan diblur. Anda dapat menambahkan beberapa seleksi."
  shape_label: "Bentuk seleksi"
  shape_rect: "Persegi panjang"
  shape_circle: "Lingkaran"
  undo_btn: "Batalkan"
  clear_btn: "Hapus semua"
  blur_label: "Intensitas blur"
  download_btn: "Unduh gambar"
  new_image: "Gambar baru"
  features_title: "Fitur Alat"
  feature_1: "Blur seluruh gambar dengan penggeser intensitas dari 0 hingga 100"
  feature_2: "Pemilihan wilayah dengan persegi panjang atau lingkaran dengan dukungan beberapa area terakumulasi"
  feature_3: "Batalkan seleksi terakhir atau hapus semua sekaligus"
  feature_4: "Pemrosesan 100% lokal di browser, menjamin privasi yang sepenuhnya terlindungi"
  use_cases_title: "Kapan Menggunakan Blur Gambar"
  use_cases_desc: "Blur adalah teknik penting untuk melindungi privasi, menciptakan efek visual, dan menonjolkan elemen dalam komposisi."
  uc_1_title: "Sensor Wajah dan Lindungi Data Sensitif"
  uc_1_desc: "Sensor wajah pada foto, sembunyikan plat nomor, dokumen, atau informasi pribadi apa pun sebelum berbagi gambar secara publik. Gunakan seleksi melingkar untuk menutupi wajah dengan presisi."
  uc_2_title: "Blur Latar Belakang dan Efek Bokeh"
  uc_2_desc: "Terapkan blur lembut pada seluruh gambar untuk menonjolkan subjek utama, atau buramkan latar belakang secara bertahap menggunakan seleksi terakumulasi untuk membuat efek bokeh sederhana."
  uc_3_title: "Sensor Teks dan Kata Sandi di Tangkapan Layar"
  uc_3_desc: "Blur kolom kata sandi, token, email, atau data rahasia apa pun dalam tangkapan layar sebelum menyertakannya dalam tutorial atau laporan. Pilih setiap kolom satu per satu dan batalkan jika diperlukan."
  how_to_title: "Cara memblur gambar"
  how_1_title: "Unggah gambar Anda"
  how_1_desc: "Klik untuk memilih atau seret file gambar apa pun (JPG, PNG, WebP) ke area unggah."
  how_2_title: "Atur mode dan intensitas"
  how_2_desc: "Pilih antara memblur seluruh gambar atau wilayah tertentu. Dalam mode wilayah, pilih bentuk persegi panjang atau lingkaran, seret ke area yang diinginkan, dan sesuaikan intensitas dengan penggeser. Gunakan tombol batalkan untuk menghapus seleksi terakhir atau hapus semua untuk memulai dari awal."
  how_3_title: "Unduh hasilnya"
  how_3_desc: "Klik Unduh gambar untuk menyimpan hasilnya dalam format PNG dengan resolusi asli gambar."
  faq_title: "Pertanyaan dan Jawaban"
  faq_1_q: "Bisakah saya memblur beberapa wilayah sekaligus?"
  faq_1_a: "Ya. Dalam mode wilayah, setiap seleksi yang dibuat dengan mouse terakumulasi pada gambar. Anda dapat menambahkan wilayah sebanyak yang Anda inginkan, membatalkan yang terakhir satu per satu, atau menghapus semua sekaligus."
  faq_2_q: "Apakah unduhan mempertahankan resolusi asli?"
  faq_2_a: "Ya. Unduhan dihasilkan langsung pada resolusi asli gambar, tanpa perubahan ukuran atau kehilangan kualitas apa pun."
  see1: "Pangkas Gambar"
  see2: "Ubah Ukuran Gambar"
  see3: "Warna Dominan"
  see4: "Generator Kode QR"

de:
  title: "Bild weichzeichnen"
  page_title: "Bild verpixeln und weichzeichnen online - Gesichter, Hintergrund, Bereich"
  meta: "Bilder online kostenlos verpixeln oder weichzeichnen. Wenden Sie den Unschärfeeffekt auf das gesamte Foto, Gesichter, den Hintergrund oder gezielt ausgewählte Bereiche an."
  intro: "Dieses Online-Werkzeug zum Weichzeichnen von Bildern bietet präzise Kontrolle darüber, wo und wie die Unschärfe angewendet wird. Sie können das gesamte Bild weichzeichnen, den Hintergrund verwischen, Gesichter unkenntlich machen oder mehrere unabhängige Bereiche mit einem Rechteck oder einem Kreis auswählen. Jede Auswahl wird kumuliert und kann einzeln rückgängig gemacht werden. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser und gewährleistet vollständige Privatsphäre."
  upload_hint: "Unterstützt JPG, PNG, WebP und andere Formate"
  mode_label: "Unschärfemodus"
  mode_full: "Gesamtes Bild"
  mode_region: "Auswählbarer Bereich"
  region_hint: "Klicken und ziehen Sie auf dem Bild, um den Bereich auszuwählen, der weichgezeichnet werden soll. Sie können mehrere Auswahlen hinzufügen."
  shape_label: "Auswahlform"
  shape_rect: "Rechteck"
  shape_circle: "Kreis"
  undo_btn: "Rückgängig"
  clear_btn: "Alle löschen"
  blur_label: "Unschärfeintensität"
  download_btn: "Bild herunterladen"
  new_image: "Neues Bild"
  features_title: "Funktionen des Werkzeugs"
  feature_1: "Unschärfe auf das gesamte Bild mit einem Intensitätsregler von 0 bis 100"
  feature_2: "Bereichsauswahl per Rechteck oder Kreis mit Unterstützung mehrerer kumulierter Bereiche"
  feature_3: "Letzte Auswahl rückgängig machen oder alle auf einmal löschen"
  feature_4: "100% lokale Verarbeitung im Browser, die vollständige Privatsphäre gewährleistet"
  use_cases_title: "Wann das Weichzeichnen von Bildern verwendet werden sollte"
  use_cases_desc: "Weichzeichnen ist eine wesentliche Technik zum Schutz der Privatsphäre, zur Erzeugung visueller Effekte und zur Hervorhebung von Elementen in Kompositionen."
  uc_1_title: "Gesichter weichzeichnen und sensible Daten schützen"
  uc_1_desc: "Machen Sie Gesichter auf Fotos unkenntlich, verbergen Sie Nummernschilder, Dokumente oder persönliche Informationen, bevor Sie ein Bild öffentlich teilen. Verwenden Sie die kreisförmige Auswahl, um Gesichter präzise abzudecken."
  uc_2_title: "Hintergrund weichzeichnen und Bokeh-Effekt"
  uc_2_desc: "Wenden Sie eine sanfte Unschärfe auf das gesamte Bild an, um das Hauptmotiv hervorzuheben, oder zeichnen Sie den Hintergrund schrittweise mit kumulierten Auswahlen weich, um einen einfachen Bokeh-Effekt zu erzeugen."
  uc_3_title: "Text und Passwörter in Screenshots weichzeichnen"
  uc_3_desc: "Zeichnen Sie Passwortfelder, Tokens, E-Mails oder vertrauliche Daten in Screenshots weich, bevor Sie sie in Tutorials oder Berichten verwenden. Wählen Sie jedes Feld einzeln aus und machen Sie die Auswahl bei Bedarf rückgängig."
  how_to_title: "So zeichnen Sie ein Bild weich"
  how_1_title: "Bild hochladen"
  how_1_desc: "Klicken Sie zum Auswählen oder ziehen Sie eine Bilddatei (JPG, PNG, WebP) in den Upload-Bereich."
  how_2_title: "Modus und Intensität einstellen"
  how_2_desc: "Wählen Sie zwischen dem Weichzeichnen des gesamten Bildes oder eines bestimmten Bereichs. Im Bereichsmodus wählen Sie die rechteckige oder kreisförmige Form, ziehen Sie über die gewünschten Bereiche und passen Sie die Intensität mit dem Regler an. Verwenden Sie die Schaltfläche Rückgängig, um die letzte Auswahl zu entfernen, oder löschen Sie alle, um von vorne zu beginnen."
  how_3_title: "Ergebnis herunterladen"
  how_3_desc: "Klicken Sie auf Bild herunterladen, um das Ergebnis als PNG in der Originalauflösung des Bildes zu speichern."
  faq_title: "Fragen und Antworten"
  faq_1_q: "Kann ich mehrere Bereiche gleichzeitig weichzeichnen?"
  faq_1_a: "Ja. Im Bereichsmodus wird jede mit der Maus vorgenommene Auswahl auf dem Bild kumuliert. Sie können so viele Bereiche hinzufügen, wie Sie möchten, die letzte einzeln rückgängig machen oder alle auf einmal löschen."
  faq_2_q: "Behält der Download die Originalauflösung bei?"
  faq_2_a: "Ja. Der Download wird direkt in der nativen Auflösung des Bildes erstellt, ohne Größenänderung oder Qualitätsverlust."
  see1: "Bild zuschneiden"
  see2: "Bild skalieren"
  see3: "Dominante Farben"
  see4: "QR-Code-Generator"

nl:
  title: "Afbeelding vervagen"
  page_title: "Foto Wazig Maken of Afbeelding Vervagen Online - Gezichten en Achtergrond"
  meta: "Maak foto's wazig of vervaag afbeeldingen gratis online. Pas het blur-effect toe op de hele foto, op gezichten, op de achtergrond of alleen op de gebieden die u wilt vervagen."
  intro: "Dit online hulpmiddel voor het vervagen van afbeeldingen biedt nauwkeurige controle over waar en hoe de vervaging wordt toegepast. U kunt de hele afbeelding vervagen, de achtergrond blurren, gezichten onherkenbaar maken of meerdere onafhankelijke regio's selecteren met een rechthoek of cirkel. Elke selectie wordt gecumuleerd en kan afzonderlijk ongedaan worden gemaakt. Alle verwerking vindt lokaal plaats in uw browser, wat volledige privacy garandeert."
  upload_hint: "Ondersteunt JPG, PNG, WebP en andere formaten"
  mode_label: "Vervagingsmodus"
  mode_full: "Hele afbeelding"
  mode_region: "Selecteerbare regio"
  region_hint: "Klik en sleep op de afbeelding om het gebied te selecteren dat vervaagd moet worden. U kunt meerdere selecties toevoegen."
  shape_label: "Selectievorm"
  shape_rect: "Rechthoek"
  shape_circle: "Cirkel"
  undo_btn: "Ongedaan maken"
  clear_btn: "Alles wissen"
  blur_label: "Vervagingsintensiteit"
  download_btn: "Afbeelding downloaden"
  new_image: "Nieuwe afbeelding"
  features_title: "Functies van het hulpmiddel"
  feature_1: "Vervaging van de hele afbeelding met een intensiteitsschuifregelaar van 0 tot 100"
  feature_2: "Regiokeuze per rechthoek of cirkel met ondersteuning voor meerdere gecumuleerde gebieden"
  feature_3: "Laatste selectie ongedaan maken of alles in één keer wissen"
  feature_4: "100% lokale verwerking in de browser, wat volledige privacy garandeert"
  use_cases_title: "Wanneer het vervagen van afbeeldingen te gebruiken"
  use_cases_desc: "Vervaging is een essentiële techniek voor het beschermen van privacy, het creëren van visuele effecten en het benadrukken van elementen in composities."
  uc_1_title: "Gezichten vervagen en gevoelige gegevens beschermen"
  uc_1_desc: "Vervaag gezichten op foto's, verberg kentekens, documenten of persoonlijke informatie voordat u een afbeelding openbaar deelt. Gebruik de cirkelvormige selectie om gezichten nauwkeurig te bedekken."
  uc_2_title: "Achtergrond vervagen en bokeh-effect"
  uc_2_desc: "Pas een zachte vervaging toe op de hele afbeelding om het hoofdonderwerp te benadrukken, of vervaag de achtergrond stapsgewijs met gecumuleerde selecties om een eenvoudig bokeh-effect te creëren."
  uc_3_title: "Tekst en wachtwoorden in schermafbeeldingen vervagen"
  uc_3_desc: "Vervaag wachtwoordvelden, tokens, e-mails of vertrouwelijke gegevens in schermafbeeldingen voordat u ze opneemt in tutorials of rapporten. Selecteer elk veld afzonderlijk en maak de selectie ongedaan indien nodig."
  how_to_title: "Hoe een afbeelding te vervagen"
  how_1_title: "Upload uw afbeelding"
  how_1_desc: "Klik om een afbeeldingsbestand (JPG, PNG, WebP) te selecteren of sleep het naar het uploadgebied."
  how_2_title: "Stel de modus en intensiteit in"
  how_2_desc: "Kies tussen het vervagen van de hele afbeelding of een specifieke regio. Selecteer in de regiomodus de rechthoekige of cirkelvormige vorm, sleep over de gewenste gebieden en pas de intensiteit aan met de schuifregelaar. Gebruik de knop ongedaan maken om de laatste selectie te verwijderen of wis alles om opnieuw te beginnen."
  how_3_title: "Download het resultaat"
  how_3_desc: "Klik op Afbeelding downloaden om het resultaat op te slaan als PNG met de oorspronkelijke resolutie van de afbeelding."
  faq_title: "Vragen en Antwoorden"
  faq_1_q: "Kan ik meerdere regio's tegelijk vervagen?"
  faq_1_a: "Ja. In de regiomodus wordt elke selectie die met de muis wordt gemaakt gecumuleerd op de afbeelding. U kunt zoveel regio's toevoegen als u wilt, de laatste afzonderlijk ongedaan maken of alles in één keer wissen."
  faq_2_q: "Behoudt de download de oorspronkelijke resolutie?"
  faq_2_a: "Ja. De download wordt rechtstreeks gegenereerd op de oorspronkelijke resolutie van de afbeelding, zonder enige verkleining of kwaliteitsverlies."
  see1: "Afbeelding bijsnijden"
  see2: "Afbeelding verkleinen"
  see3: "Dominante kleuren"
  see4: "QR-codegenerator"
ru:
  title: "Размытие изображений"
  page_title: "Размытие изображений онлайн: лица, фон и области"
  meta: "Легко и быстро размывайте изображения онлайн. Применяйте эффект размытия ко всему фото, лицам, фону или скрывайте конфиденциальные данные на скриншотах."
  intro: "Этот бесплатный онлайн-инструмент позволяет точно настроить эффект размытия на ваших изображениях. Вы можете размыть всё фото целиком, сделать нерезким фон, скрыть лица или цензурировать текстовые области, выделив их прямоугольными или круглыми рамками. Можно наложить несколько областей размытия одновременно и при необходимости отменять последние действия. Все процессы происходят локально в браузере, обеспечивая полную конфиденциальность."
  upload_hint: "Поддерживаются форматы JPG, PNG, WebP и др."
  mode_label: "Режим размытия"
  mode_full: "Вся картинка"
  mode_region: "Выбранные области"
  region_hint: "Нажмите и проведите мышью/пальцем по изображению, чтобы выделить область для размытия. Вы можете добавить несколько рамок."
  shape_label: "Форма выделения"
  shape_rect: "Прямоугольник"
  shape_circle: "Круг"
  undo_btn: "Отменить"
  clear_btn: "Очистить все"
  blur_label: "Интенсивность размытия"
  download_btn: "Скачать изображение"
  new_image: "Новое изображение"
  features_title: "Возможности инструмента"
  feature_1: "Размытие всего изображения целиком с регулировкой силы от 0 до 100"
  feature_2: "Выделение областей прямоугольной или круглой рамкой с поддержкой наложения нескольких зон"
  feature_3: "Удобная отмена последнего выделения или полная очистка холста в один клик"
  feature_4: "Обработка файлов на 100% локально в браузере для абсолютной безопасности данных"
  use_cases_title: "Когда применяется размытие изображений"
  use_cases_desc: "Эффект размытия — незаменимый инструмент для защиты персональных данных, создания красивых художественных эффектов и расстановки акцентов на кадрах."
  uc_1_title: "Размытие лиц и защита личных данных"
  uc_1_desc: "Скрывайте лица людей, номера автомобилей, реквизиты документов или любую другую персональную информацию перед публикацией снимка в сети. Круглое выделение идеально подходит для точного скрытия лиц."
  uc_2_title: "Размытие фона и эффект боке"
  uc_2_desc: "Накладывайте мягкую нерезкость на всё фото для акцента на главном объекте либо размывайте только фоновый план в несколько слоев для создания художественного эффекта боке."
  uc_3_title: "Цензурирование текста и паролей на скриншотах"
  uc_3_desc: "Скрывайте поля паролей, платежные данные, адреса почты или любые конфиденциальные тексты на скриншотах перед добавлением их в отчеты или инструкции. Выделяйте каждую строку отдельно и отменяйте при необходимости."
  how_to_title: "Как размыть изображение"
  how_1_title: "Загрузите изображение"
  how_1_desc: "Нажмите кнопку выбора файла или просто перетащите изображение (JPG, PNG, WebP) в область загрузки."
  how_2_title: "Настройте режим и размытие"
  how_2_desc: "Выберите размытие всей картинки или отдельных зон. В режиме областей укажите круглую или прямоугольную рамку, выделите нужные детали на фото и настройте ползунком силу эффекта. При ошибке отмените последнее действие кнопкой сброса."
  how_3_title: "Скачайте результат"
  how_3_desc: "Нажмите «Скачать изображение», чтобы сохранить готовый PNG-файл в оригинальном высоком разрешении."
  faq_title: "Часто задаваемые вопросы"
  faq_1_q: "Можно ли размыть несколько областей одновременно?"
  faq_1_a: "Да. В режиме областей каждое новое выделение накладывается поверх предыдущих. Вы можете добавить сколько угодно рамок, легко отменять последние действия по очереди или очистить все сразу."
  faq_2_q: "Сохраняется ли оригинальное разрешение при скачивании?"
  faq_2_a: "Да. Файл сохраняется строго в исходном разрешении вашего снимка без какого-либо сжатия или уменьшения качества."
  see1: "Обрезка изображений"
  see2: "Изменение размера изображений"
  see3: "Доминантные цвета изображения"
  see4: "Генератор QR-кодов"
</i18n>