<script setup lang="ts">
declare global {
  interface Window { Konva: any }
}

const { t } = useI18n({ useScope: 'local' })

const containerRef = ref<HTMLDivElement | null>(null)
const scriptReady = ref(false)
const hasDrawn = ref(false)

const mode = ref<'draw' | 'type'>('draw')
const penColor = ref('#000000')
const penWidth = ref(3)
const bgColor = ref('#ffffff')
const typedText = ref('')
const selectedFont = ref('Dancing Script')
const fontSize = ref(52)

const penWidths = [2, 3, 4, 6, 8]
const fonts = ['Dancing Script', 'Caveat', 'Pacifico', 'Sacramento']

let stage: any = null
let drawLayer: any = null
let guideLayer: any = null
let bgRect: any = null
let isPaint = false
let lastLine: any = null
let textNode: any = null
let transformer: any = null

const { onLoaded } = useScript('https://unpkg.com/konva@10.0.2/konva.min.js', { trigger: 'client' })

onLoaded(() => {
  scriptReady.value = true
  nextTick(() => initStage())
})

onBeforeUnmount(() => {
  if (stage) stage.destroy()
})

function initStage() {
  if (!containerRef.value || !window.Konva) return
  if (stage) stage.destroy()

  const w = containerRef.value.clientWidth
  const h = 220

  stage = new window.Konva.Stage({ container: containerRef.value, width: w, height: h })

  const bgLayer = new window.Konva.Layer()
  stage.add(bgLayer)

  bgRect = new window.Konva.Rect({ x: 0, y: 0, width: w, height: h, fill: bgColor.value })
  bgLayer.add(bgRect)

  guideLayer = new window.Konva.Layer()
  stage.add(guideLayer)

  guideLayer.add(new window.Konva.Line({
    points: [40, h - 56, w - 40, h - 56],
    stroke: '#ccc',
    strokeWidth: 1,
    dash: [6, 4],
  }))
  guideLayer.add(new window.Konva.Text({
    x: 40, y: h - 46,
    text: t('sign_here'),
    fontSize: 13,
    fill: '#aaa',
    fontFamily: 'Arial',
  }))

  drawLayer = new window.Konva.Layer()
  stage.add(drawLayer)

  stage.on('mousedown touchstart', () => {
    if (mode.value !== 'draw') return
    isPaint = true
    const pos = stage.getPointerPosition()
    lastLine = new window.Konva.Line({
      stroke: penColor.value,
      strokeWidth: penWidth.value,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.3,
      points: [pos.x, pos.y],
    })
    drawLayer.add(lastLine)
  })

  stage.on('mouseup touchend', () => { isPaint = false })

  stage.on('mousemove touchmove', (e: any) => {
    if (!isPaint || mode.value !== 'draw') return
    e.evt.preventDefault()
    const pos = stage.getPointerPosition()
    lastLine.points(lastLine.points().concat([pos.x, pos.y]))
    hasDrawn.value = true
  })
}

async function createTextNode() {
  if (!drawLayer || !stage || !window.Konva || !typedText.value.trim()) return

  await document.fonts.load(`700 ${fontSize.value}px "${selectedFont.value}"`)

  const w = stage.width()
  const h = stage.height()

  textNode = new window.Konva.Text({
    text: typedText.value,
    x: 40,
    y: (h - 80) / 2 - fontSize.value / 2,
    fontSize: fontSize.value,
    fontFamily: selectedFont.value,
    fontStyle: 'bold',
    fill: penColor.value,
    width: w - 80,
    align: 'center',
    draggable: true,
  })
  drawLayer.add(textNode)

  transformer = new window.Konva.Transformer({
    nodes: [textNode],
    enabledAnchors: ['middle-left', 'middle-right'],
    borderStroke: '#6366f1',
    anchorFill: '#6366f1',
    anchorStroke: 'white',
    anchorCornerRadius: 4,
    anchorSize: 10,
    boundBoxFunc: (_oldBox: any, newBox: any) => {
      newBox.width = Math.max(30, newBox.width)
      return newBox
    },
  })

  textNode.on('transform', () => {
    textNode.setAttrs({ width: textNode.width() * textNode.scaleX(), scaleX: 1 })
  })

  drawLayer.add(transformer)
  hasDrawn.value = true
}

function clearDraw() {
  if (drawLayer) drawLayer.destroyChildren()
  textNode = null
  transformer = null
  isPaint = false
  hasDrawn.value = false
}

function clear() {
  clearDraw()
  if (mode.value === 'type') typedText.value = ''
}

function triggerDownload(filename: string, dataURL: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function saveAsPng() {
  if (!stage) return
  guideLayer?.visible(false)
  transformer?.visible(false)
  drawLayer?.batchDraw()
  const dataURL = stage.toDataURL({ pixelRatio: 2 })
  guideLayer?.visible(true)
  transformer?.visible(true)
  drawLayer?.batchDraw()
  triggerDownload('assinatura.png', dataURL)
}

function saveTransparentPng() {
  if (!stage || !bgRect) return
  bgRect.fill('transparent')
  guideLayer?.visible(false)
  transformer?.visible(false)
  stage.getLayers()[0].draw()
  drawLayer?.batchDraw()
  const dataURL = stage.toDataURL({ pixelRatio: 2 })
  bgRect.fill(bgColor.value)
  guideLayer?.visible(true)
  transformer?.visible(true)
  stage.getLayers()[0].draw()
  drawLayer?.batchDraw()
  triggerDownload('assinatura-transparente.png', dataURL)
}

watch(mode, () => {
  clearDraw()
  if (mode.value === 'type' && typedText.value.trim()) {
    nextTick(() => createTextNode())
  }
})

watch(bgColor, (val) => {
  if (bgRect) {
    bgRect.fill(val)
    stage?.getLayers()[0].draw()
  }
})

// Watchers do modo Digitar: atualizam in-place para preservar posição/tamanho
watch(typedText, async (val) => {
  if (mode.value !== 'type') return
  if (!val.trim()) { clearDraw(); return }
  if (!textNode) { await createTextNode(); return }
  textNode.text(val)
  drawLayer?.batchDraw()
  hasDrawn.value = true
})

watch(selectedFont, async (val) => {
  if (mode.value !== 'type' || !textNode) return
  await document.fonts.load(`700 ${fontSize.value}px "${val}"`)
  textNode.fontFamily(val)
  transformer?.forceUpdate()
  drawLayer?.batchDraw()
})

watch(fontSize, async (val) => {
  if (mode.value !== 'type' || !textNode) return
  await document.fonts.load(`700 ${val}px "${selectedFont.value}"`)
  textNode.fontSize(val)
  transformer?.forceUpdate()
  drawLayer?.batchDraw()
})

watch(penColor, (val) => {
  if (mode.value !== 'type' || !textNode) return
  textNode.fill(val)
  drawLayer?.batchDraw()
})

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Caveat:wght@700&family=Pacifico&family=Sacramento&display=swap' }
  ]
})

defineI18nRoute({
  paths: {
    en: '/signature-maker',
    pt: '/assinar-online',
    es: '/firma-online',
    fr: '/signature-en-ligne',
    it: '/firma-online',
    id: '/tanda-tangan-online',
    de: '/unterschrift-online',
    nl: '/handtekening-online',
    ru: '/podpis-online',
  }
})
</script>

<template>
  <ToolPage :title="t('title')" :description="t('desc')" :show-ads="hasDrawn"
    :see-also-links="[
      { label: t('see1'), to: 'crop-image' },
      { label: t('see2'), to: 'image-to-pdf' },
      { label: t('see3'), to: 'resize-image' },
      { label: t('see4'), to: 'fancy-letters' },
    ]"
  >

    <div class="space-y-4">
      <!-- Abas de modo + botão limpar -->
      <div class="flex items-center justify-between">
        <div role="tablist" class="tabs tabs-boxed w-fit">
          <button role="tab" :class="['tab gap-1.5', mode === 'draw' && 'tab-active']" @click="mode = 'draw'">
            <Icon name="mdi:draw" class="w-4 h-4" />
            {{ t('tab_draw') }}
          </button>
          <button role="tab" :class="['tab gap-1.5', mode === 'type' && 'tab-active']" @click="mode = 'type'">
            <Icon name="mdi:format-text" class="w-4 h-4" />
            {{ t('tab_type') }}
          </button>
        </div>

        <button @click="clear" class="btn btn-outline btn-sm gap-1.5">
          <Icon name="mdi:eraser" class="w-4 h-4" />
          {{ t('clear') }}
        </button>
      </div>

      <!-- Controles: modo Desenhar -->
      <div v-if="mode === 'draw'" class="flex flex-wrap gap-3 items-center">
        <label class="flex items-center gap-2 text-sm font-medium">
          <Icon name="mdi:pencil" class="w-4 h-4 opacity-60" />
          <span class="opacity-70">{{ t('pen_color') }}</span>
          <input type="color" v-model="penColor" class="w-8 h-8 rounded cursor-pointer border border-base-300" />
        </label>

        <select v-model="penWidth" class="select select-bordered select-sm text-base font-medium w-fit">
          <option v-for="w in penWidths" :key="w" :value="w">{{ t('stroke') }} {{ w }}px</option>
        </select>

        <label class="flex items-center gap-2 text-sm font-medium">
          <span class="opacity-70">{{ t('bg_color') }}</span>
          <input type="color" v-model="bgColor" class="w-8 h-8 rounded cursor-pointer border border-base-300" />
        </label>

      </div>

      <!-- Controles: modo Digitar -->
      <div v-else class="flex flex-wrap gap-3 items-center">
        <input
          v-model="typedText"
          type="text"
          :placeholder="t('type_placeholder')"
          class="input input-bordered input-sm flex-1 min-w-40"
        />

        <select v-model="selectedFont"
          class="select select-bordered select-sm text-base font-medium w-fit min-w-40"
          :style="`font-family: '${selectedFont}'`">
          <option v-for="f in fonts" :key="f" :value="f" :style="`font-family: '${f}'`">{{ f }}</option>
        </select>

        <div class="flex items-center gap-2 text-sm">
          <span class="opacity-70 whitespace-nowrap text-xs">{{ t('font_size') }}</span>
          <input type="range" v-model.number="fontSize" min="24" max="96" step="4" class="range range-xs w-24" />
          <span class="text-xs opacity-50 w-8 tabular-nums">{{ fontSize }}px</span>
        </div>

        <label class="flex items-center gap-2 text-sm font-medium">
          <span class="opacity-70">{{ t('pen_color') }}</span>
          <input type="color" v-model="penColor" class="w-8 h-8 rounded cursor-pointer border border-base-300" />
        </label>

        <label class="flex items-center gap-2 text-sm font-medium">
          <span class="opacity-70">{{ t('bg_color') }}</span>
          <input type="color" v-model="bgColor" class="w-8 h-8 rounded cursor-pointer border border-base-300" />
        </label>

      </div>

      <!-- Canvas -->
      <div
        ref="containerRef"
        :class="['w-full rounded-xl border-2 border-dashed border-base-content/20 overflow-hidden touch-none', mode === 'draw' ? 'cursor-crosshair' : 'cursor-default']"
        style="min-height: 220px;"
      >
        <div v-if="!scriptReady" class="flex items-center justify-center h-80 text-base-content/40">
          <span class="loading loading-spinner loading-md mr-2"></span>
          {{ t('loading') }}
        </div>
      </div>

      <p v-if="mode === 'type' && hasDrawn" class="text-xs text-base-content/50 flex items-center gap-1">
        <Icon name="mdi:cursor-move" class="w-3.5 h-3.5" />
        {{ t('drag_hint') }}
      </p>

      <!-- Botões de download -->
      <div class="flex flex-wrap gap-3">
        <ButtonPrimary @click="saveAsPng" icon="mdi:download" :disabled="!hasDrawn" class="h-11">
          {{ t('save_png') }}
        </ButtonPrimary>
        <button @click="saveTransparentPng" :disabled="!hasDrawn"
          class="btn btn-outline h-11 gap-2 disabled:opacity-40">
          <Icon name="mdi:checkerboard" class="w-4 h-4" />
          {{ t('save_transparent') }}
        </button>
      </div>

      <p class="text-xs text-base-content/50 italic">{{ t('warning') }}</p>
    </div>

    <template #info>
      <div class="space-y-8">
        <section>
          <p>{{ t('d1') }}</p>
        </section>

        <FeatureSection :title="t('features_title')" :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5')]" />

        <HowToSection :title="t('how_to_use_title')" :items="[
          { title: t('step_1_title'), description: t('step_1_desc') },
          { title: t('step_2_title'), description: t('step_2_desc') },
          { title: t('step_3_title'), description: t('step_3_desc') },
        ]" />

        <FaqSection :title="t('faq_title')" :items="[
          { question: t('faq_1_q'), answer: t('faq_1_a') },
          { question: t('faq_2_q'), answer: t('faq_2_a') },
          { question: t('faq_3_q'), answer: t('faq_3_a') },
        ]" />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    pageTitle: "Criar Assinatura Online Grátis — Desenhe ou Digite",
    title: "Assinar Online",
    desc: "Desenhe ou digite sua assinatura digital diretamente no navegador, sem instalar nada e com total privacidade. Baixe em PNG com fundo branco ou transparente.",
    meta: "Crie sua assinatura digital online grátis. Desenhe com o mouse ou toque, ou digite seu nome em fonte cursiva. Baixe em PNG com fundo branco ou transparente. Sem cadastro.",

    tab_draw: "Desenhar",
    tab_type: "Digitar",
    sign_here: "Assine aqui",
    pen_color: "Cor",
    stroke: "Traço",
    bg_color: "Fundo",
    font_size: "Tamanho",
    clear: "Limpar",
    loading: "Carregando...",
    type_placeholder: "Digite seu nome...",
    drag_hint: "Arraste para reposicionar · Use as alças laterais para redimensionar",
    save_png: "Baixar",
    save_transparent: "Baixar Transparente",
    warning: "Sua assinatura é processada inteiramente no navegador e nunca é enviada a nenhum servidor.",

    d1: "Ferramenta gratuita para criar sua assinatura online, sem instalar nenhum software. Escolha entre desenhar com o mouse ou dedo, ou digitar seu nome usando uma das fontes cursivas disponíveis. Ajuste cor, espessura do traço e fundo, depois exporte como imagem. Todo o processamento acontece localmente no navegador, garantindo total privacidade.",

    features_title: "Funcionalidades",
    f_1: "Modo Desenhar: desenhe com mouse ou toque",
    f_2: "Modo Digitar: digite, arraste e redimensione livremente",
    f_3: "Escolha de cor e espessura do traço",
    f_4: "Escolha de tipografia cursiva",
    f_5: "Exportação em PNG com fundo branco ou transparente",

    how_to_use_title: "Como Usar",
    step_1_title: "Escolha o modo",
    step_1_desc: "Use \"Desenhar\" para assinar com o mouse ou dedo, ou \"Digitar\" para gerar uma assinatura a partir do seu nome usando uma fonte cursiva.",
    step_2_title: "Personalize",
    step_2_desc: "No modo Digitar, arraste o texto para reposicionar, use as alças laterais para ajustar a largura e o controle deslizante para alterar o tamanho da fonte.",
    step_3_title: "Exporte a imagem",
    step_3_desc: "Clique em \"Baixar\" para salvar com o fundo escolhido, ou em \"Baixar Transparente\" para exportar um PNG com fundo transparente, ideal para sobrepor em documentos.",

    faq_title: "Perguntas e Respostas",
    faq_1_q: "Minha assinatura fica salva em algum servidor?",
    faq_1_a: "Não. Todo o processamento acontece no seu navegador garantindo total privacidade. Nenhum dado é enviado para servidores. Sua assinatura existe apenas na memória do seu navegador até que a aba seja fechada ou recarregada.",
    faq_2_q: "Posso usar no celular?",
    faq_2_a: "Sim. No modo Desenhar, a área reconhece toques e funciona com o dedo ou caneta stylus. No modo Digitar, basta inserir o nome usando o teclado do celular.",
    faq_3_q: "A assinatura criada aqui tem valor jurídico?",
    faq_3_a: "Não diretamente. Esta ferramenta gera uma imagem da sua assinatura. Para validade jurídica, é necessário um certificado digital ou equivalente. O uso mais comum aqui é assinar visualmente documentos PDF em editores online, apresentações ou formulários que aceitam imagem de assinatura.",
    see1: "Recortar Imagem",
    see2: "Imagem para PDF",
    see3: "Redimensionar Imagem",
    see4: "Letras Diferentes",
  },
  en: {
    pageTitle: "Free Online Signature Maker — Draw or Type Your Signature",
    title: "Signature Maker",
    desc: "Draw or type your signature directly in the browser, with no installation and complete privacy. Download as PNG with a white or transparent background.",
    meta: "Free online signature maker. Draw with mouse or touch, or type your name in a cursive font. Download as PNG with white or transparent background. No sign-up needed.",

    tab_draw: "Draw",
    tab_type: "Type",
    sign_here: "Sign here",
    pen_color: "Color",
    stroke: "Stroke",
    bg_color: "Background",
    font_size: "Size",
    clear: "Clear",
    loading: "Loading...",
    type_placeholder: "Type your name...",
    drag_hint: "Drag to reposition · Use the side handles to resize",
    save_png: "Download",
    save_transparent: "Download Transparent",
    warning: "Your signature is processed entirely in your browser and is never sent to any server.",

    d1: "This free online signature maker lets you create your digital signature without installing any software. Choose between drawing with a mouse or finger, or typing your name in one of the available cursive fonts. Adjust the color, stroke width, and background, then export as an image. All processing happens locally in your browser, ensuring complete privacy.",

    features_title: "Features",
    f_1: "Draw mode: draw with mouse or touch",
    f_2: "Type mode: type, drag, and resize freely",
    f_3: "Pen color and stroke width selection",
    f_4: "Cursive font selection",
    f_5: "PNG export with white or transparent background",

    how_to_use_title: "How to Use",
    step_1_title: "Choose a mode",
    step_1_desc: "Use \"Draw\" to sign with your mouse or finger, or \"Type\" to generate a signature from your name using a cursive font.",
    step_2_title: "Customize",
    step_2_desc: "In Type mode, drag the text to reposition it, use the side handles to adjust the width, and the slider to change the font size.",
    step_3_title: "Export the image",
    step_3_desc: "Click \"Download\" to save with the chosen background, or \"Download Transparent\" to export a PNG with a transparent background, ideal for overlaying on documents.",

    faq_title: "Questions & Answers",
    faq_1_q: "Is my signature saved on any server?",
    faq_1_a: "No. All processing happens in your browser, ensuring complete privacy. No data is sent to any server. Your signature only exists in your browser's memory until the tab is closed or refreshed.",
    faq_2_q: "Can I use it on mobile?",
    faq_2_a: "Yes. In Draw mode, the canvas recognizes touch events and works with a finger or stylus. In Type mode, simply enter your name using your phone's keyboard.",
    faq_3_q: "Does a signature created here have legal value?",
    faq_3_a: "Not directly. This tool generates an image of your signature. For legal validity, a digital certificate or qualified electronic signature is typically required. The most common use here is visually signing PDF documents in online editors, presentations, or forms that accept a signature image.",
    see1: "Image Cropper",
    see2: "Image to PDF",
    see3: "Image Resizer",
    see4: "Fancy Letters",
  },
  es: {
    pageTitle: "Firma Online Gratis — Dibuja o Escribe tu Firma",
    title: "Firma Online",
    desc: "Dibuja o escribe tu firma digital directamente en el navegador, sin instalar nada y con total privacidad. Descarga en PNG con fondo blanco o transparente.",
    meta: "Crea tu firma digital online gratis. Dibuja con el ratón o el tacto, o escribe tu nombre con letra cursiva. Descarga en PNG con fondo blanco o transparente. Sin registro.",

    tab_draw: "Dibujar",
    tab_type: "Escribir",
    sign_here: "Firma aquí",
    pen_color: "Color",
    stroke: "Trazo",
    bg_color: "Fondo",
    font_size: "Tamaño",
    clear: "Limpiar",
    loading: "Cargando...",
    type_placeholder: "Escribe tu nombre...",
    drag_hint: "Arrastra para reposicionar · Usa las asas laterales para redimensionar",
    save_png: "Descargar",
    save_transparent: "Descargar Transparente",
    warning: "Tu firma se procesa completamente en el navegador y nunca se envía a ningún servidor.",

    d1: "Herramienta gratuita para crear tu firma online sin instalar ningún software. Elige entre dibujar con el ratón o el dedo, o escribir tu nombre con una de las fuentes cursivas disponibles. Ajusta el color, el grosor del trazo y el fondo, y luego exporta como imagen. Todo el procesamiento ocurre localmente en tu navegador, garantizando total privacidad.",

    features_title: "Funcionalidades",
    f_1: "Modo Dibujar: dibuja con ratón o tacto",
    f_2: "Modo Escribir: escribe, arrastra y redimensiona libremente",
    f_3: "Selección de color y grosor del trazo",
    f_4: "Selección de tipografía cursiva",
    f_5: "Exportación en PNG con fondo blanco o transparente",

    how_to_use_title: "Cómo Usar",
    step_1_title: "Elige un modo",
    step_1_desc: "Usa \"Dibujar\" para firmar con el ratón o el dedo, o \"Escribir\" para generar una firma a partir de tu nombre usando una fuente cursiva.",
    step_2_title: "Personaliza",
    step_2_desc: "En el modo Escribir, arrastra el texto para reposicionarlo, usa las asas laterales para ajustar el ancho y el control deslizante para cambiar el tamaño de fuente.",
    step_3_title: "Exporta la imagen",
    step_3_desc: "Haz clic en \"Descargar\" para guardar con el fondo elegido, o en \"Descargar Transparente\" para exportar un PNG con fondo transparente, ideal para superponer en documentos.",

    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mi firma se guarda en algún servidor?",
    faq_1_a: "No. Todo el procesamiento ocurre en tu navegador, garantizando total privacidad. No se envían datos a ningún servidor. Tu firma solo existe en la memoria de tu navegador hasta que cierres o recargues la pestaña.",
    faq_2_q: "¿Puedo usarlo en el móvil?",
    faq_2_a: "Sí. En el modo Dibujar, el área reconoce eventos táctiles y funciona con el dedo o un lápiz stylus. En el modo Escribir, solo tienes que introducir tu nombre con el teclado del móvil.",
    faq_3_q: "¿La firma creada aquí tiene validez legal?",
    faq_3_a: "No directamente. Esta herramienta genera una imagen de tu firma. Para validez legal, normalmente se requiere un certificado digital o una firma electrónica cualificada. El uso más común aquí es firmar visualmente documentos PDF en editores online, presentaciones o formularios que aceptan imagen de firma.",
    see1: "Recortar Imagen",
    see2: "Imagen a PDF",
    see3: "Redimensionar Imagen",
    see4: "Letras Bonitas",
  },
  fr: {
    pageTitle: "Signature en Ligne Gratuite — Dessinez ou Tapez votre Signature",
    title: "Signature en Ligne",
    desc: "Dessinez ou tapez votre signature numérique directement dans le navigateur, sans rien installer et en toute confidentialité. Téléchargez en PNG avec fond blanc ou transparent.",
    meta: "Créez votre signature numérique en ligne gratuitement. Dessinez à la souris ou au toucher, ou tapez votre nom en police cursive. Téléchargez en PNG. Sans inscription.",

    tab_draw: "Dessiner",
    tab_type: "Taper",
    sign_here: "Signez ici",
    pen_color: "Couleur",
    stroke: "Trait",
    bg_color: "Fond",
    font_size: "Taille",
    clear: "Effacer",
    loading: "Chargement...",
    type_placeholder: "Tapez votre nom...",
    drag_hint: "Faites glisser pour repositionner · Utilisez les poignées latérales pour redimensionner",
    save_png: "Télécharger",
    save_transparent: "Télécharger Transparent",
    warning: "Votre signature est traitée entièrement dans le navigateur et n'est jamais envoyée à un serveur.",

    d1: "Outil gratuit pour créer votre signature en ligne sans installer de logiciel. Choisissez entre dessiner avec la souris ou le doigt, ou taper votre nom avec l'une des polices cursives disponibles. Ajustez la couleur, l'épaisseur du trait et le fond, puis exportez en image. Tout le traitement se fait localement dans votre navigateur, garantissant une confidentialité totale.",

    features_title: "Fonctionnalités",
    f_1: "Mode Dessiner : dessinez à la souris ou au toucher",
    f_2: "Mode Taper : tapez, déplacez et redimensionnez librement",
    f_3: "Choix de la couleur et de l'épaisseur du trait",
    f_4: "Choix de la police cursive",
    f_5: "Export en PNG avec fond blanc ou transparent",

    how_to_use_title: "Comment Utiliser",
    step_1_title: "Choisissez un mode",
    step_1_desc: "Utilisez « Dessiner » pour signer avec la souris ou le doigt, ou « Taper » pour générer une signature à partir de votre nom avec une police cursive.",
    step_2_title: "Personnalisez",
    step_2_desc: "En mode Taper, faites glisser le texte pour le repositionner, utilisez les poignées latérales pour ajuster la largeur et le curseur pour modifier la taille de la police.",
    step_3_title: "Exportez l'image",
    step_3_desc: "Cliquez sur « Télécharger » pour sauvegarder avec le fond choisi, ou sur « Télécharger Transparent » pour exporter un PNG avec fond transparent, idéal pour l'insérer dans des documents.",

    faq_title: "Questions & Réponses",
    faq_1_q: "Ma signature est-elle sauvegardée sur un serveur ?",
    faq_1_a: "Non. Tout le traitement s'effectue dans votre navigateur, garantissant une confidentialité totale. Aucune donnée n'est envoyée à un serveur. Votre signature n'existe que dans la mémoire de votre navigateur jusqu'à ce que l'onglet soit fermé ou rechargé.",
    faq_2_q: "Puis-je l'utiliser sur mobile ?",
    faq_2_a: "Oui. En mode Dessiner, la zone reconnaît les événements tactiles et fonctionne avec le doigt ou un stylet. En mode Taper, il suffit de saisir votre nom avec le clavier du téléphone.",
    faq_3_q: "La signature créée ici a-t-elle une valeur juridique ?",
    faq_3_a: "Pas directement. Cet outil génère une image de votre signature. Pour une valeur juridique, un certificat numérique ou une signature électronique qualifiée est généralement requis. L'usage le plus courant est de signer visuellement des PDF dans des éditeurs en ligne, des présentations ou des formulaires acceptant une image de signature.",
    see1: "Rogner Image",
    see2: "Image en PDF",
    see3: "Redimensionner Image",
    see4: "Lettres Stylées",
  },
  it: {
    pageTitle: "Firma Online Gratis — Disegna o Digita la tua Firma",
    title: "Firma Online",
    desc: "Disegna o digita la tua firma digitale direttamente nel browser, senza installare nulla e con totale riservatezza. Scarica in PNG con sfondo bianco o trasparente.",
    meta: "Crea la tua firma digitale online gratis. Disegna con il mouse o il tocco, o digita il tuo nome con un font corsivo. Scarica in PNG con sfondo bianco o trasparente. Senza registrazione.",

    tab_draw: "Disegna",
    tab_type: "Digita",
    sign_here: "Firma qui",
    pen_color: "Colore",
    stroke: "Tratto",
    bg_color: "Sfondo",
    font_size: "Dimensione",
    clear: "Cancella",
    loading: "Caricamento...",
    type_placeholder: "Digita il tuo nome...",
    drag_hint: "Trascina per riposizionare · Usa le maniglie laterali per ridimensionare",
    save_png: "Scarica",
    save_transparent: "Scarica Trasparente",
    warning: "La tua firma viene elaborata interamente nel browser e non viene mai inviata a nessun server.",

    d1: "Strumento gratuito per creare la tua firma online senza installare alcun software. Scegli tra disegnare con il mouse o il dito, oppure digitare il tuo nome con uno dei font corsivi disponibili. Regola colore, spessore del tratto e sfondo, poi esporta come immagine. Tutta l'elaborazione avviene localmente nel browser, garantendo totale riservatezza.",

    features_title: "Funzionalità",
    f_1: "Modalità Disegna: disegna con mouse o tocco",
    f_2: "Modalità Digita: digita, trascina e ridimensiona liberamente",
    f_3: "Scelta del colore e dello spessore del tratto",
    f_4: "Scelta del font corsivo",
    f_5: "Esportazione in PNG con sfondo bianco o trasparente",

    how_to_use_title: "Come Usare",
    step_1_title: "Scegli una modalità",
    step_1_desc: "Usa «Disegna» per firmare con il mouse o il dito, o «Digita» per generare una firma dal tuo nome usando un font corsivo.",
    step_2_title: "Personalizza",
    step_2_desc: "In modalità Digita, trascina il testo per riposizionarlo, usa le maniglie laterali per regolare la larghezza e il cursore per cambiare la dimensione del font.",
    step_3_title: "Esporta l'immagine",
    step_3_desc: "Clicca su «Scarica» per salvare con lo sfondo scelto, o su «Scarica Trasparente» per esportare un PNG con sfondo trasparente, ideale da sovrapporre ai documenti.",

    faq_title: "Domande & Risposte",
    faq_1_q: "La mia firma viene salvata su qualche server?",
    faq_1_a: "No. Tutta l'elaborazione avviene nel tuo browser, garantendo totale riservatezza. Nessun dato viene inviato a server. La tua firma esiste solo nella memoria del browser fino a quando la scheda non viene chiusa o ricaricata.",
    faq_2_q: "Posso usarlo su mobile?",
    faq_2_a: "Sì. In modalità Disegna, l'area riconosce gli eventi touch e funziona con il dito o uno stilo. In modalità Digita, basta inserire il nome con la tastiera del telefono.",
    faq_3_q: "La firma creata qui ha valore legale?",
    faq_3_a: "Non direttamente. Questo strumento genera un'immagine della tua firma. Per validità legale è generalmente richiesto un certificato digitale o una firma elettronica qualificata. L'uso più comune è firmare visivamente documenti PDF in editor online, presentazioni o moduli che accettano un'immagine di firma.",
    see1: "Ritaglia Immagine",
    see2: "Immagine in PDF",
    see3: "Ridimensiona Immagine",
    see4: "Lettere Particolari",
  },
  id: {
    pageTitle: "Tanda Tangan Online Gratis — Gambar atau Ketik Tanda Tangan Anda",
    title: "Tanda Tangan Online",
    desc: "Gambar atau ketik tanda tangan digital Anda langsung di browser, tanpa instalasi dan dengan privasi penuh. Unduh dalam format PNG dengan latar putih atau transparan.",
    meta: "Buat tanda tangan digital online gratis. Gambar dengan mouse atau sentuhan, atau ketik nama Anda dengan font kursif. Unduh PNG dengan latar putih atau transparan. Tanpa registrasi.",

    tab_draw: "Gambar",
    tab_type: "Ketik",
    sign_here: "Tanda tangani di sini",
    pen_color: "Warna",
    stroke: "Ketebalan",
    bg_color: "Latar",
    font_size: "Ukuran",
    clear: "Hapus",
    loading: "Memuat...",
    type_placeholder: "Ketik nama Anda...",
    drag_hint: "Seret untuk memindahkan · Gunakan pegangan samping untuk mengubah ukuran",
    save_png: "Unduh",
    save_transparent: "Unduh Transparan",
    warning: "Tanda tangan Anda diproses sepenuhnya di browser dan tidak pernah dikirim ke server mana pun.",

    d1: "Alat gratis untuk membuat tanda tangan online tanpa menginstal perangkat lunak apa pun. Pilih antara menggambar dengan mouse atau jari, atau mengetik nama Anda menggunakan salah satu font kursif yang tersedia. Sesuaikan warna, ketebalan garis, dan latar belakang, lalu ekspor sebagai gambar. Semua pemrosesan dilakukan secara lokal di browser Anda, menjamin privasi penuh.",

    features_title: "Fitur",
    f_1: "Mode Gambar: gambar dengan mouse atau sentuhan",
    f_2: "Mode Ketik: ketik, seret, dan ubah ukuran bebas",
    f_3: "Pilihan warna dan ketebalan garis",
    f_4: "Pilihan font kursif",
    f_5: "Ekspor PNG dengan latar putih atau transparan",

    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Pilih mode",
    step_1_desc: "Gunakan \"Gambar\" untuk menandatangani dengan mouse atau jari, atau \"Ketik\" untuk membuat tanda tangan dari nama Anda menggunakan font kursif.",
    step_2_title: "Sesuaikan",
    step_2_desc: "Dalam mode Ketik, seret teks untuk memindahkannya, gunakan pegangan samping untuk menyesuaikan lebar, dan slider untuk mengubah ukuran font.",
    step_3_title: "Ekspor gambar",
    step_3_desc: "Klik \"Unduh\" untuk menyimpan dengan latar yang dipilih, atau \"Unduh Transparan\" untuk mengekspor PNG dengan latar transparan, ideal untuk ditempelkan pada dokumen.",

    faq_title: "Pertanyaan & Jawaban",
    faq_1_q: "Apakah tanda tangan saya disimpan di server?",
    faq_1_a: "Tidak. Semua pemrosesan dilakukan di browser Anda, menjamin privasi penuh. Tidak ada data yang dikirim ke server. Tanda tangan Anda hanya ada di memori browser hingga tab ditutup atau dimuat ulang.",
    faq_2_q: "Bisakah digunakan di ponsel?",
    faq_2_a: "Ya. Dalam mode Gambar, area kanvas mengenali sentuhan dan bekerja dengan jari atau stylus. Dalam mode Ketik, cukup masukkan nama menggunakan keyboard ponsel.",
    faq_3_q: "Apakah tanda tangan yang dibuat di sini memiliki kekuatan hukum?",
    faq_3_a: "Tidak secara langsung. Alat ini menghasilkan gambar tanda tangan Anda. Untuk keabsahan hukum, biasanya diperlukan sertifikat digital atau tanda tangan elektronik yang memenuhi syarat. Penggunaan paling umum di sini adalah menandatangani secara visual dokumen PDF di editor online, presentasi, atau formulir yang menerima gambar tanda tangan.",
    see1: "Pemotong Gambar",
    see2: "Gambar ke PDF",
    see3: "Pengubah Ukuran Gambar",
    see4: "Huruf Berbeda",
  },
  de: {
    pageTitle: "Kostenlose Online-Unterschrift — Zeichnen oder Tippen",
    title: "Online-Unterschrift",
    desc: "Zeichne oder tippe deine digitale Unterschrift direkt im Browser, ohne Installation und mit vollständiger Privatsphäre. Als PNG mit weißem oder transparentem Hintergrund herunterladen.",
    meta: "Erstelle deine digitale Unterschrift online kostenlos. Zeichne mit Maus oder Touch, oder tippe deinen Namen in einer Kursivschrift. PNG herunterladen. Ohne Registrierung.",

    tab_draw: "Zeichnen",
    tab_type: "Tippen",
    sign_here: "Hier unterschreiben",
    pen_color: "Farbe",
    stroke: "Strich",
    bg_color: "Hintergrund",
    font_size: "Größe",
    clear: "Löschen",
    loading: "Laden...",
    type_placeholder: "Namen eingeben...",
    drag_hint: "Ziehen zum Verschieben · Seitengriffe zum Skalieren verwenden",
    save_png: "Herunterladen",
    save_transparent: "Transparent herunterladen",
    warning: "Deine Unterschrift wird vollständig im Browser verarbeitet und nie an einen Server gesendet.",

    d1: "Kostenloses Tool zum Erstellen deiner Unterschrift online, ohne Software zu installieren. Wähle zwischen dem Zeichnen mit Maus oder Finger, oder dem Eintippen deines Namens mit einer der verfügbaren Kursivschriften. Passe Farbe, Strichstärke und Hintergrund an und exportiere das Ergebnis als Bild. Die gesamte Verarbeitung erfolgt lokal im Browser und garantiert vollständige Privatsphäre.",

    features_title: "Funktionen",
    f_1: "Zeichen-Modus: Zeichne mit Maus oder Touch",
    f_2: "Tipp-Modus: Tippen, verschieben und skalieren",
    f_3: "Auswahl von Farbe und Strichstärke",
    f_4: "Auswahl der Kursivschrift",
    f_5: "PNG-Export mit weißem oder transparentem Hintergrund",

    how_to_use_title: "Anleitung",
    step_1_title: "Modus wählen",
    step_1_desc: "Verwende \"Zeichnen\", um mit Maus oder Finger zu unterschreiben, oder \"Tippen\", um eine Unterschrift aus deinem Namen mit einer Kursivschrift zu erstellen.",
    step_2_title: "Anpassen",
    step_2_desc: "Im Tipp-Modus kannst du den Text verschieben, die Seitengriffe zum Anpassen der Breite nutzen und den Schieberegler zum Ändern der Schriftgröße verwenden.",
    step_3_title: "Bild exportieren",
    step_3_desc: "Klicke auf \"Herunterladen\", um mit dem gewählten Hintergrund zu speichern, oder auf \"Transparent herunterladen\" für ein PNG mit transparentem Hintergrund, ideal zum Einfügen in Dokumente.",

    faq_title: "Häufige Fragen",
    faq_1_q: "Wird meine Unterschrift auf einem Server gespeichert?",
    faq_1_a: "Nein. Die gesamte Verarbeitung erfolgt in deinem Browser und gewährleistet vollständige Privatsphäre. Es werden keine Daten an Server gesendet. Deine Unterschrift existiert nur im Arbeitsspeicher des Browsers, bis der Tab geschlossen oder neu geladen wird.",
    faq_2_q: "Kann ich es auf dem Smartphone nutzen?",
    faq_2_a: "Ja. Im Zeichen-Modus erkennt die Fläche Touch-Ereignisse und funktioniert mit dem Finger oder einem Stylus. Im Tipp-Modus gibst du deinen Namen einfach über die Smartphone-Tastatur ein.",
    faq_3_q: "Hat die hier erstellte Unterschrift rechtliche Gültigkeit?",
    faq_3_a: "Nicht direkt. Dieses Tool erzeugt ein Bild deiner Unterschrift. Für rechtliche Gültigkeit ist in der Regel ein digitales Zertifikat oder eine qualifizierte elektronische Signatur erforderlich. Der häufigste Anwendungsfall ist das visuelle Signieren von PDF-Dokumenten in Online-Editoren, Präsentationen oder Formularen, die ein Unterschriftsbild akzeptieren.",
    see1: "Bild zuschneiden",
    see2: "Bild zu PDF",
    see3: "Bildgröße ändern",
    see4: "Andere Buchstaben",
  },
  nl: {
    pageTitle: "Gratis Online Handtekening — Teken of Typ je Handtekening",
    title: "Online Handtekening",
    desc: "Teken of typ je digitale handtekening direct in de browser, zonder installatie en met volledige privacy. Download als PNG met witte of transparante achtergrond.",
    meta: "Maak je digitale handtekening online gratis. Teken met muis of aanraking, of typ je naam in een cursief lettertype. Download als PNG. Geen registratie nodig.",

    tab_draw: "Tekenen",
    tab_type: "Typen",
    sign_here: "Hier tekenen",
    pen_color: "Kleur",
    stroke: "Lijndikte",
    bg_color: "Achtergrond",
    font_size: "Grootte",
    clear: "Wissen",
    loading: "Laden...",
    type_placeholder: "Typ je naam...",
    drag_hint: "Sleep om te verplaatsen · Gebruik de zijgrepen om te vergroten of verkleinen",
    save_png: "Downloaden",
    save_transparent: "Transparant downloaden",
    warning: "Je handtekening wordt volledig in de browser verwerkt en nooit naar een server verzonden.",

    d1: "Gratis tool om je handtekening online te maken zonder software te installeren. Kies tussen tekenen met de muis of vinger, of je naam typen met een van de beschikbare cursieve lettertypen. Pas de kleur, lijndikte en achtergrond aan en exporteer het resultaat als afbeelding. Alle verwerking vindt lokaal in je browser plaats, wat volledige privacy garandeert.",

    features_title: "Functionaliteiten",
    f_1: "Tekenmodus: teken met muis of aanraking",
    f_2: "Typmodus: typ, versleep en vergroot of verklein vrij",
    f_3: "Keuze van kleur en lijndikte",
    f_4: "Keuze van cursief lettertype",
    f_5: "PNG-export met witte of transparante achtergrond",

    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Kies een modus",
    step_1_desc: "Gebruik \"Tekenen\" om te ondertekenen met de muis of vinger, of \"Typen\" om een handtekening te genereren vanuit je naam met een cursief lettertype.",
    step_2_title: "Aanpassen",
    step_2_desc: "In de typmodus kun je de tekst verslepen om hem te verplaatsen, de zijgrepen gebruiken om de breedte aan te passen en de schuifregelaar om de lettergrootte te wijzigen.",
    step_3_title: "Afbeelding exporteren",
    step_3_desc: "Klik op \"Downloaden\" om op te slaan met de gekozen achtergrond, of op \"Transparant downloaden\" om een PNG met transparante achtergrond te exporteren, ideaal om over documenten te plaatsen.",

    faq_title: "Veelgestelde vragen",
    faq_1_q: "Wordt mijn handtekening opgeslagen op een server?",
    faq_1_a: "Nee. Alle verwerking vindt plaats in je browser, wat volledige privacy garandeert. Er worden geen gegevens naar servers verzonden. Je handtekening bestaat alleen in het geheugen van je browser totdat het tabblad wordt gesloten of herladen.",
    faq_2_q: "Kan ik het op mijn telefoon gebruiken?",
    faq_2_a: "Ja. In de tekenmodus herkent het canvas aanraakgebeurtenissen en werkt het met een vinger of stylus. In de typmodus typ je gewoon je naam via het toetsenbord van je telefoon.",
    faq_3_q: "Heeft de hier gemaakte handtekening juridische waarde?",
    faq_3_a: "Niet direct. Deze tool genereert een afbeelding van je handtekening. Voor juridische geldigheid is doorgaans een digitaal certificaat of een gekwalificeerde elektronische handtekening vereist. Het meest voorkomende gebruik is het visueel ondertekenen van PDF-documenten in online editors, presentaties of formulieren die een handtekeningafbeelding accepteren.",
    see1: "Bijsnijden",
    see2: "Afbeelding naar PDF",
    see3: "Formaat wijzigen",
    see4: "Mooie letters",
  },
  ru: {
    pageTitle: "Создать подпись онлайн: бесплатно нарисовать или ввести",
    title: "Создать подпись",
    desc: "Нарисуйте или введите свою подпись прямо в браузере. Бесплатно, без установки программ и с полной конфиденциальностью. Скачивайте в формате PNG с белым или прозрачным фоном.",
    meta: "Онлайн-генератор подписей бесплатно. Нарисуйте подпись мышкой или на сенсорном экране, либо введите имя красивым рукописным шрифтом. Скачивайте в PNG с прозрачным или белым фоном без регистрации.",
    tab_draw: "Нарисовать",
    tab_type: "Ввести текст",
    sign_here: "Подпишите здесь",
    pen_color: "Цвет",
    stroke: "Толщина",
    bg_color: "Фон",
    font_size: "Размер",
    clear: "Очистить",
    loading: "Загрузка...",
    type_placeholder: "Введите ваше имя...",
    drag_hint: "Перетаскивайте для перемещения · Используйте боковые маркеры для масштабирования",
    save_png: "Скачать",
    save_transparent: "Скачать с прозрачным фоном",
    warning: "Ваша подпись обрабатывается исключительно в вашем браузере и никогда не передается на сервер.",
    d1: "Этот бесплатный онлайн-сервис позволяет создать цифровую подпись без установки каких-либо программ. Вы можете нарисовать её мышкой/пальцем или просто ввести своё имя, выбрав один из красивых рукописных шрифтов. Настраивайте цвет, толщину линий и фон, а затем сохраняйте готовую подпись как изображение. Вся обработка происходит локально в браузере, что гарантирует абсолютную конфиденциальность данных.",
    features_title: "Возможности",
    f_1: "Режим рисования: создание подписи мышкой или на сенсорном экране",
    f_2: "Режим ввода: создание подписи из текста с возможностью перетаскивания и масштабирования",
    f_3: "Выбор любого цвета подписи и толщины линий",
    f_4: "Коллекция элегантных рукописных шрифтов",
    f_5: "Экспорт в формате PNG с белым или прозрачным фоном",
    how_to_use_title: "Как пользоваться",
    step_1_title: "Выберите режим",
    step_1_desc: "Используйте режим «Нарисовать» для создания уникального росчерка пальцем или мышью, либо «Ввести текст» для генерации подписи из вашего имени красивым шрифтом.",
    step_2_title: "Настройте оформление",
    step_2_desc: "В режиме ввода текста вы можете перетаскивать подпись, изменять её ширину боковыми маркерами и настраивать размер букв с помощью ползунка.",
    step_3_title: "Скачайте изображение",
    step_3_desc: "Нажмите «Скачать» для сохранения подписи с выбранным фоном или «Скачать с прозрачным фоном» для экспорта в PNG без подложки, что идеально подходит для наложения подписи на документы.",
    faq_title: "Часто задаваемые вопросы",
    faq_1_q: "Сохраняется ли моя подпись на сервере?",
    faq_1_a: "Нет. Все процессы происходят локально на вашем устройстве, гарантируя полную конфиденциальность. Никакие данные не отправляются на наши или сторонние серверы. Подпись существует только в памяти вкладки браузера, пока вы её не закроете или не обновите.",
    faq_2_q: "Можно ли использовать сервис на мобильном телефоне?",
    faq_2_a: "Да. В режиме рисования холст отлично распознает касания пальцем или стилусом на экранах смартфонов и планшетов. В режиме ввода текста просто введите имя с помощью клавиатуры.",
    faq_3_q: "Имеет ли созданная здесь подпись юридическую силу?",
    faq_3_a: "Напрямую — нет. Инструмент создает графическое изображение вашей подписи (факсимиле). Для придания юридической силы обычно требуется квалифицированная электронная подпись (КЭП) или цифровой сертификат. Чаще всего созданную здесь картинку используют для визуального добавления подписи в PDF-документы через онлайн-редакторы, в презентации или формы обратной связи.",
    see1: "Обрезка изображений",
    see2: "Изображения в PDF",
    see3: "Изменение размера изображений",
    see4: "Красивые буквы"
  }
}
</i18n>
