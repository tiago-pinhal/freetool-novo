<script setup lang="ts">
declare global {
  interface Window {
    imageCompression: (file: File, options: Record<string, unknown>) => Promise<File>
  }
}

const { t } = useI18n({ useScope: 'local' })

// ─── Estado do arquivo ────────────────────────────────────────────────────────
const originalFile    = ref<File | null>(null)
const originalUrl     = ref('')
const compressedFile  = ref<File | null>(null)
const compressedUrl   = ref('')
const isCompressing   = ref(false)
const scriptReady     = ref(false)

// ─── Controles ────────────────────────────────────────────────────────────────
const quality            = ref(0.8)
const maxWidthOrHeight   = ref(0)
const outputFormat       = ref<'webp' | 'jpeg' | 'png'>('webp')

// ─── SEO / i18n ───────────────────────────────────────────────────────────────
usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
  ]
})

useHead({
  title: t('page_title'),
  meta: [{ name: 'description', content: t('meta') }]
})

// ─── Carregamento da lib via CDN ──────────────────────────────────────────────
const { onLoaded } = useScript(
  'https://cdn.jsdelivr.net/npm/browser-image-compression@1.0.13/dist/browser-image-compression.js',
  { trigger: 'client' }
)

onLoaded(() => {
  scriptReady.value = true
  if (originalFile.value) compress()
})

onBeforeUnmount(() => {
  if (originalUrl.value)   URL.revokeObjectURL(originalUrl.value)
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
})

// ─── Upload ───────────────────────────────────────────────────────────────────
function onImageSelected(file: File | File[]) {
  const selectedFile = Array.isArray(file) ? file[0] : file
  if (!selectedFile) return

  if (originalUrl.value)   URL.revokeObjectURL(originalUrl.value)
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)

  originalFile.value    = selectedFile
  originalUrl.value     = URL.createObjectURL(selectedFile)
  compressedFile.value  = null
  compressedUrl.value   = ''

  if (scriptReady.value) compress()
}

// ─── Compressão ───────────────────────────────────────────────────────────────
async function compress() {
  if (!originalFile.value || !window.imageCompression) return
  isCompressing.value = true
  try {
    const result = await window.imageCompression(originalFile.value, {
      maxSizeMB: 50,
      maxWidthOrHeight: maxWidthOrHeight.value || undefined,
      useWebWorker: true,
      fileType: `image/${outputFormat.value}`,
      initialQuality: quality.value,
    })
    if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
    compressedFile.value = result
    compressedUrl.value  = URL.createObjectURL(result)
  } finally {
    isCompressing.value = false
  }
}

// ─── Debounce para sliders ────────────────────────────────────────────────────
let compressTimer: ReturnType<typeof setTimeout> | null = null
function scheduleCompress() {
  if (!originalFile.value || !scriptReady.value) return
  if (compressTimer) clearTimeout(compressTimer)
  compressTimer = setTimeout(() => compress(), 300)
}

watch([quality, maxWidthOrHeight, outputFormat], scheduleCompress)

// ─── Helpers ──────────────────────────────────────────────────────────────────
const savings = computed(() => {
  if (!originalFile.value || !compressedFile.value) return 0
  const pct = (1 - compressedFile.value.size / originalFile.value.size) * 100
  return Math.max(0, Math.round(pct))
})

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// ─── Download ─────────────────────────────────────────────────────────────────
function download() {
  if (!compressedFile.value || !originalFile.value) return
  const url = URL.createObjectURL(compressedFile.value)
  const a   = document.createElement('a')
  const baseName = originalFile.value.name.replace(/\.[^.]+$/, '')
  a.href     = url
  a.download = `${baseName}-${t('filename_suffix')}.${outputFormat.value}`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Nova imagem ──────────────────────────────────────────────────────────────
function newImage() {
  if (originalUrl.value)   URL.revokeObjectURL(originalUrl.value)
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
  originalFile.value    = null
  originalUrl.value     = ''
  compressedFile.value  = null
  compressedUrl.value   = ''
  quality.value          = 0.8
  maxWidthOrHeight.value = 0
  outputFormat.value     = 'webp'
}

defineI18nRoute({
  paths: {
    en: '/image-compressor',
    pt: '/comprimir-imagem',
    es: '/comprimir-imagen',
    fr: '/compresser-image',
    it: '/comprimere-immagine',
    id: '/kompres-gambar',
    de: '/bild-komprimieren',
    nl: '/afbeelding-comprimeren',
    ru: '/szhat-kartinku',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="originalFile !== null"
    :see-also-links="[
      { label: t('see1'), to: 'resize-image' },
      { label: t('see2'), to: 'crop-image' },
      { label: t('see3'), to: 'blur-image' },
      { label: t('see4'), to: 'image-to-pdf' },
    ]"
  >
    <!-- Estado de upload -->
    <div v-if="!originalFile" class="flex flex-col items-center justify-center py-8 gap-4">
      <ImageUploader :show="true" @on-file="onImageSelected" />
      <p class="text-sm text-base-content/70">{{ t('upload_hint') }}</p>
    </div>

    <!-- Estado de edição -->
    <div v-else class="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">

      <!-- Painel de controles -->
      <div class="space-y-4">

        <!-- Formato de saída -->
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-base-content/60">{{ t('format_label') }}</p>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" class="radio radio-primary radio-sm" value="webp" v-model="outputFormat" />
              <span class="text-sm font-medium">WebP <span class="text-xs text-base-content/50">({{ t('format_recommended') }})</span></span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" class="radio radio-primary radio-sm" value="jpeg" v-model="outputFormat" />
              <span class="text-sm font-medium">JPEG</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" class="radio radio-primary radio-sm" value="png" v-model="outputFormat" />
              <span class="text-sm font-medium">PNG</span>
            </label>
          </div>
        </section>

        <!-- Qualidade -->
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
          <label class="form-control w-full">
            <span class="label-text mb-1 font-bold">
              {{ t('quality_label') }}: <span class="text-primary">{{ Math.round(quality * 100) }}%</span>
            </span>
            <input
              type="range"
              v-model.number="quality"
              min="0.1"
              max="1"
              step="0.05"
              class="range range-primary range-sm"
            />
            <div class="flex justify-between text-xs text-base-content/40 px-1 mt-1">
              <span>10%</span>
              <span>55%</span>
              <span>100%</span>
            </div>
          </label>
        </section>

        <!-- Tamanho máximo -->
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-3">
          <label class="form-control w-full">
            <span class="label-text mb-1 font-bold">{{ t('size_label') }}</span>
            <select v-model.number="maxWidthOrHeight" class="select select-bordered select-sm">
              <option :value="480">480px</option>
              <option :value="1280">1280px (HD)</option>
              <option :value="1920">1920px (Full HD)</option>
              <option :value="3840">3840px (4K)</option>
              <option :value="0">{{ t('size_original') }}</option>
            </select>
          </label>
        </section>

        <!-- Botões de ação -->
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="btn btn-primary w-full"
            :disabled="!compressedFile || isCompressing"
            @click="download"
          >
            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
            {{ t('download_btn') }}
          </button>
          <button type="button" class="btn btn-ghost w-full" @click="newImage">
            <Icon name="heroicons:arrow-path-20-solid" class="w-5 h-5" />
            {{ t('new_image') }}
          </button>
        </div>
      </div>

      <!-- Preview comparativo -->
      <div class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">

          <!-- Original -->
          <div class="rounded-2xl border border-base-content/10 bg-base-200/20 overflow-hidden">
            <div class="aspect-square flex items-center justify-center bg-base-200/40">
              <img :src="originalUrl" class="max-w-full max-h-full object-contain" alt="" />
            </div>
            <div class="p-3 text-center">
              <p class="text-xs uppercase tracking-widest text-base-content/50">{{ t('original_label') }}</p>
              <p class="text-sm font-bold mt-1">{{ originalFile ? formatBytes(originalFile.size) : '' }}</p>
            </div>
          </div>

          <!-- Comprimida -->
          <div class="rounded-2xl border border-primary/30 bg-base-200/20 overflow-hidden">
            <div class="aspect-square flex items-center justify-center bg-base-200/40 relative">
              <img v-if="compressedUrl" :src="compressedUrl" class="max-w-full max-h-full object-contain" alt="" />
              <span v-if="isCompressing" class="loading loading-spinner loading-lg text-primary absolute"></span>
            </div>
            <div class="p-3 text-center">
              <p class="text-xs uppercase tracking-widest text-base-content/50">{{ t('compressed_label') }}</p>
              <p class="text-sm font-bold mt-1 text-primary">
                <template v-if="compressedFile">
                  {{ formatBytes(compressedFile.size) }}
                  <span v-if="savings > 0" class="text-xs ml-2 opacity-70">(−{{ savings }}%)</span>
                </template>
                <template v-else>—</template>
              </p>
            </div>
          </div>
        </div>
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
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
pt:
  title: "Comprimir Imagem"
  page_title: "Comprimir Imagem Online - Reduzir JPG, PNG e WebP Grátis"
  meta: "Compressor de imagens online grátis. Comprima imagens e fotos para reduzir o tamanho dos arquivos mantendo a qualidade visual. Suporta JPG, PNG e WebP — processamento local no navegador."
  upload_hint: "Suporta JPG, PNG, WebP e outros formatos"
  format_label: "Formato de saída"
  format_recommended: "recomendado"
  quality_label: "Qualidade"
  size_label: "Largura/altura máxima"
  size_original: "Original (sem redimensionar)"
  download_btn: "Baixar imagem"
  new_image: "Nova imagem"
  original_label: "Original"
  compressed_label: "Comprimida"
  filename_suffix: "comprimida"
  intro: "Esta ferramenta online comprime fotos e imagens de forma simples e instantânea, reduzindo o tamanho dos arquivos para acelerar o carregamento de imagens em sites, facilitar o compartilhamento por e-mail ou redes sociais e liberar espaço no seu dispositivo. Todo o processamento ocorre localmente no navegador, preservando ao máximo a qualidade visual e garantindo total privacidade — sem necessidade de instalar nenhum software."
  features_title: "Recursos da Ferramenta"
  feature_1: "Conversão automática entre WebP, JPG e PNG durante a compressão"
  feature_2: "Controle deslizante de qualidade com pré-visualização do resultado e da porcentagem de economia"
  feature_3: "Redimensionamento opcional com proporção preservada"
  feature_4: "Processamento 100% local no navegador, garantindo total privacidade"
  use_cases_title: "Quando usar a Compressão de Imagem"
  use_cases_desc: "A compressão de imagens é essencial para otimização web, envio de arquivos em aplicativos de mensagem e economia de espaço no armazenamento em nuvem."
  uc_1_title: "Otimização para Web e Core Web Vitals"
  uc_1_desc: "Reduza o peso das páginas convertendo imagens para WebP com até 70% a 80% menos tamanho de arquivo, acelerando o carregamento das páginas e melhorando o LCP (Largest Contentful Paint)."
  uc_2_title: "Economia de Armazenamento em Nuvem"
  uc_2_desc: "Comprima coleções de fotos antes de fazer backup em serviços de armazenamento na nuvem ou compartilhamento de arquivos online."
  uc_3_title: "Anexar Fotos em E-mail e WhatsApp"
  uc_3_desc: "Reduza o tamanho de fotos para respeitar os limites de anexos em e-mails ou compartilhar rapidamente em aplicativos como WhatsApp e Telegram sem perda perceptível de qualidade."
  how_to_title: "Como comprimir uma imagem"
  how_1_title: "Faça o upload da imagem"
  how_1_desc: "Clique para selecionar ou arraste qualquer arquivo de imagem (JPG, PNG, WebP) para a área de upload."
  how_2_title: "Ajuste o formato e a qualidade"
  how_2_desc: "Defina o formato de saída, ajuste a qualidade e, opcionalmente, configure a largura e altura máximas."
  how_3_title: "Baixe o resultado"
  how_3_desc: "Clique em 'Baixar imagem' para salvar a versão otimizada da sua imagem."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "Por que o WebP é o formato recomendado?"
  faq_1_a: "WebP é o formato moderno padrão da web, oferecendo até 30% menos tamanho que JPG com a mesma qualidade visual. É suportado em todos os navegadores atuais (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "Como comprimir imagem sem perder qualidade?"
  faq_2_a: "Para comprimir imagem sem perder qualidade perceptível, mantenha o controle de qualidade acima de 70%. Nessa faixa, a diferença visual é imperceptível na maioria das fotos. Para imagens com texto, gráficos ou alto detalhe, recomenda-se manter acima de 85% para preservar a nitidez."
  faq_3_q: "Minhas imagens são enviadas para algum servidor?"
  faq_3_a: "Não. A compressão acontece diretamente no seu navegador, então suas imagens não são enviadas ou armazenadas em servidores."
  faq_4_q: "Qual é o limite de tamanho do arquivo?"
  faq_4_a: "Não há limite imposto pela ferramenta, mas como o processamento usa a memória do navegador, recomenda-se imagens de até 50 MB para uma experiência fluida. Arquivos muito grandes podem ficar lentos dependendo do dispositivo."
  see1: "Redimensionar Imagem"
  see2: "Recortar Imagem"
  see3: "Desfocar Imagem"
  see4: "Imagem para PDF"

en:
  title: "Compress Image"
  page_title: "Image Compressor - Compress JPG, PNG & WebP Online Free"
  meta: "Free online image compressor. Compress images and photos to reduce file size while keeping visual quality. Supports JPG, PNG and WebP — no upload, processed in your browser."
  upload_hint: "Supports JPG, PNG, WebP and other formats"
  format_label: "Output format"
  format_recommended: "recommended"
  quality_label: "Quality"
  size_label: "Max width/height"
  size_original: "Original (no resize)"
  download_btn: "Download image"
  new_image: "New image"
  original_label: "Original"
  compressed_label: "Compressed"
  filename_suffix: "compressed"
  intro: "This free online tool compresses your photos and images instantly, reducing file size to speed up image loading on websites, simplify sharing via email or social media, and free up storage on your device. All processing happens locally in your browser, preserving visual quality and ensuring full privacy — no software install required."
  features_title: "Tool Features"
  feature_1: "Automatic conversion between WebP, JPG and PNG during compression"
  feature_2: "Quality slider with live preview of the result and savings percentage"
  feature_3: "Optional resizing with aspect ratio preserved"
  feature_4: "100% local processing in the browser, ensuring complete privacy"
  use_cases_title: "When to Use Image Compression"
  use_cases_desc: "Compressing images is essential for web optimization, sending files through messaging apps, and saving space in cloud storage."
  uc_1_title: "Web Optimization and Core Web Vitals"
  uc_1_desc: "Reduce page weight by converting images to WebP with up to 70%–80% smaller file size, speeding up page loads and improving LCP (Largest Contentful Paint)."
  uc_2_title: "Saving Cloud Storage Space"
  uc_2_desc: "Compress photo collections before backing them up to cloud storage services or sharing them through online file transfer tools."
  uc_3_title: "Attaching Photos in Email and WhatsApp"
  uc_3_desc: "Shrink photos to fit email attachment limits or share quickly on apps like WhatsApp and Telegram with no noticeable quality loss."
  how_to_title: "How to compress an image"
  how_1_title: "Upload your image"
  how_1_desc: "Click to select or drag any image file (JPG, PNG, WebP) into the upload area."
  how_2_title: "Adjust format and quality"
  how_2_desc: "Choose the output format, adjust the quality and, optionally, set the maximum width and height."
  how_3_title: "Download the result"
  how_3_desc: "Click 'Download image' to save the optimized version of your image."
  faq_title: "Questions and Answers"
  faq_1_q: "Why is WebP the recommended format?"
  faq_1_a: "WebP is the modern web standard, offering up to 30% smaller files than JPG with the same visual quality. It is supported in every current browser (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "How do I compress an image without losing quality?"
  faq_2_a: "To compress an image without perceptible quality loss, keep the quality slider above 70%. In that range the visual difference is imperceptible in most photos. For images with text, graphics, or fine detail, stay above 85% to preserve sharpness."
  faq_3_q: "Are my images uploaded to any server?"
  faq_3_a: "No. Compression happens directly in your browser, so your images are not uploaded or stored on any server."
  faq_4_q: "What is the maximum file size?"
  faq_4_a: "There is no hard limit, but since processing uses your browser memory, we recommend images up to 50 MB for a smooth experience. Very large files may slow down depending on your device."
  see1: "Resize Image"
  see2: "Crop Image"
  see3: "Blur Image"
  see4: "Image to PDF"

es:
  title: "Comprimir Imagen"
  page_title: "Comprimir Imagen Online - Reducir JPG, PNG y WebP Gratis"
  meta: "Compresor de imágenes online gratis. Comprime imágenes y fotos para reducir el tamaño de los archivos manteniendo la calidad visual. Compatible con JPG, PNG y WebP — procesamiento local en el navegador."
  upload_hint: "Compatible con JPG, PNG, WebP y otros formatos"
  format_label: "Formato de salida"
  format_recommended: "recomendado"
  quality_label: "Calidad"
  size_label: "Ancho/alto máximo"
  size_original: "Original (sin redimensionar)"
  download_btn: "Descargar imagen"
  new_image: "Nueva imagen"
  original_label: "Original"
  compressed_label: "Comprimida"
  filename_suffix: "comprimida"
  intro: "Esta herramienta online comprime tus fotos e imágenes de forma sencilla e instantánea, reduciendo el tamaño de los archivos para acelerar la carga de imágenes en sitios web, facilitar el envío por correo o redes sociales y liberar espacio en tu dispositivo. Todo el procesamiento se realiza localmente en el navegador, preservando al máximo la calidad visual y garantizando total privacidad — sin necesidad de instalar ningún software."
  features_title: "Funciones de la Herramienta"
  feature_1: "Conversión automática entre WebP, JPG y PNG durante la compresión"
  feature_2: "Control deslizante de calidad con vista previa del resultado y porcentaje de ahorro"
  feature_3: "Redimensionado opcional manteniendo la proporción"
  feature_4: "Procesamiento 100% local en el navegador, garantizando total privacidad"
  use_cases_title: "Cuándo usar la Compresión de Imagen"
  use_cases_desc: "Comprimir imágenes es esencial para la optimización web, el envío de archivos por aplicaciones de mensajería y el ahorro de espacio en el almacenamiento en la nube."
  uc_1_title: "Optimización Web y Core Web Vitals"
  uc_1_desc: "Reduce el peso de las páginas convirtiendo imágenes a WebP con hasta un 70%–80% menos de tamaño, acelerando la carga de las páginas y mejorando el LCP (Largest Contentful Paint)."
  uc_2_title: "Ahorro de Almacenamiento en la Nube"
  uc_2_desc: "Comprime colecciones de fotos antes de hacer copias de seguridad en servicios de almacenamiento en la nube o de compartir archivos online."
  uc_3_title: "Adjuntar Fotos en Email y WhatsApp"
  uc_3_desc: "Reduce el tamaño de las fotos para no superar los límites de los archivos adjuntos en correos o para compartir rápidamente en aplicaciones como WhatsApp y Telegram sin pérdida perceptible de calidad."
  how_to_title: "Cómo comprimir una imagen"
  how_1_title: "Sube la imagen"
  how_1_desc: "Haz clic para seleccionar o arrastra cualquier archivo de imagen (JPG, PNG, WebP) al área de carga."
  how_2_title: "Ajusta el formato y la calidad"
  how_2_desc: "Define el formato de salida, ajusta la calidad y, opcionalmente, configura el ancho y alto máximos."
  how_3_title: "Descarga el resultado"
  how_3_desc: "Haz clic en 'Descargar imagen' para guardar la versión optimizada de tu imagen."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Por qué WebP es el formato recomendado?"
  faq_1_a: "WebP es el formato moderno estándar de la web, ofreciendo hasta un 30% menos de tamaño que JPG con la misma calidad visual. Es compatible con todos los navegadores actuales (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "¿Cómo comprimir una imagen sin perder calidad?"
  faq_2_a: "Para comprimir una imagen sin pérdida perceptible, mantén el control de calidad por encima del 70%. En ese rango la diferencia visual es imperceptible en la mayoría de las fotos. Para imágenes con texto, gráficos o gran detalle, mantén el valor por encima del 85% para preservar la nitidez."
  faq_3_q: "¿Mis imágenes se envían a algún servidor?"
  faq_3_a: "No. La compresión ocurre directamente en tu navegador, por lo que tus imágenes no se envían ni se almacenan en ningún servidor."
  faq_4_q: "¿Cuál es el tamaño máximo de archivo?"
  faq_4_a: "No hay un límite impuesto por la herramienta, pero como el procesamiento usa la memoria del navegador, recomendamos imágenes de hasta 50 MB para una experiencia fluida. Los archivos muy grandes pueden ralentizarse según el dispositivo."
  see1: "Redimensionar Imagen"
  see2: "Recortar Imagen"
  see3: "Desenfocar Imagen"
  see4: "Imagen a PDF"

fr:
  title: "Compresser une Image"
  page_title: "Compresser une Image en Ligne - Réduire JPG, PNG et WebP Gratuitement"
  meta: "Compresseur d'images en ligne gratuit. Compressez des images et des photos pour réduire la taille des fichiers tout en conservant la qualité visuelle. Prend en charge JPG, PNG et WebP — traitement local dans le navigateur."
  upload_hint: "Prend en charge JPG, PNG, WebP et d'autres formats"
  format_label: "Format de sortie"
  format_recommended: "recommandé"
  quality_label: "Qualité"
  size_label: "Largeur/hauteur max"
  size_original: "Original (sans redimensionner)"
  download_btn: "Télécharger l'image"
  new_image: "Nouvelle image"
  original_label: "Original"
  compressed_label: "Compressé"
  filename_suffix: "compresse"
  intro: "Cet outil en ligne gratuit compresse vos photos et images de manière simple et instantanée, en réduisant la taille des fichiers pour accélérer le chargement des images sur les sites web, faciliter le partage par e-mail ou sur les réseaux sociaux et libérer de l'espace sur votre appareil. Tout le traitement se fait localement dans le navigateur, préservant la qualité visuelle et garantissant une confidentialité totale — sans aucune installation."
  features_title: "Fonctionnalités de l'Outil"
  feature_1: "Conversion automatique entre WebP, JPG et PNG lors de la compression"
  feature_2: "Curseur de qualité avec aperçu en direct du résultat et du pourcentage d'économie"
  feature_3: "Redimensionnement optionnel avec proportion préservée"
  feature_4: "Traitement 100% local dans le navigateur, garantissant une confidentialité totale"
  use_cases_title: "Quand utiliser la Compression d'Image"
  use_cases_desc: "La compression d'images est essentielle pour l'optimisation web, l'envoi de fichiers via des applications de messagerie et l'économie d'espace dans le stockage cloud."
  uc_1_title: "Optimisation Web et Core Web Vitals"
  uc_1_desc: "Réduisez le poids des pages en convertissant les images en WebP avec jusqu'à 70%–80% de taille en moins, accélérant le chargement des pages et améliorant le LCP (Largest Contentful Paint)."
  uc_2_title: "Économie d'Espace de Stockage Cloud"
  uc_2_desc: "Compressez des collections de photos avant de les sauvegarder sur des services de stockage cloud ou de les partager via des outils de transfert de fichiers en ligne."
  uc_3_title: "Joindre des Photos par E-mail et WhatsApp"
  uc_3_desc: "Réduisez la taille des photos pour respecter les limites des pièces jointes par e-mail ou pour partager rapidement sur des applications comme WhatsApp et Telegram sans perte de qualité perceptible."
  how_to_title: "Comment compresser une image"
  how_1_title: "Téléchargez votre image"
  how_1_desc: "Cliquez pour sélectionner ou faites glisser n'importe quel fichier image (JPG, PNG, WebP) dans la zone de téléversement."
  how_2_title: "Ajustez le format et la qualité"
  how_2_desc: "Définissez le format de sortie, ajustez la qualité et, en option, configurez la largeur et la hauteur maximales."
  how_3_title: "Téléchargez le résultat"
  how_3_desc: "Cliquez sur 'Télécharger l'image' pour enregistrer la version optimisée de votre image."
  faq_title: "Questions et Réponses"
  faq_1_q: "Pourquoi WebP est-il le format recommandé ?"
  faq_1_a: "WebP est le format moderne standard du web, offrant jusqu'à 30% de taille en moins que JPG avec la même qualité visuelle. Il est pris en charge par tous les navigateurs actuels (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "Comment compresser une image sans perte de qualité ?"
  faq_2_a: "Pour compresser une image sans perte de qualité perceptible, maintenez le curseur de qualité au-dessus de 70%. Dans cette plage, la différence visuelle est imperceptible sur la plupart des photos. Pour les images avec du texte, des graphiques ou des détails fins, restez au-dessus de 85% pour préserver la netteté."
  faq_3_q: "Mes images sont-elles envoyées à un serveur ?"
  faq_3_a: "Non. La compression se fait directement dans votre navigateur, vos images ne sont donc pas envoyées ni stockées sur des serveurs."
  faq_4_q: "Quelle est la taille maximale de fichier ?"
  faq_4_a: "Il n'y a aucune limite imposée par l'outil, mais comme le traitement utilise la mémoire du navigateur, nous recommandons des images jusqu'à 50 Mo pour une expérience fluide. Les fichiers très volumineux peuvent ralentir selon l'appareil."
  see1: "Redimensionner Image"
  see2: "Recadrer Image"
  see3: "Flouter Image"
  see4: "Image en PDF"

it:
  title: "Comprimere Immagine"
  page_title: "Comprimere Immagine Online - Ridurre JPG, PNG e WebP Gratis"
  meta: "Compressore di immagini online gratuito. Comprimi immagini e foto per ridurre la dimensione dei file mantenendo la qualità visiva. Supporta JPG, PNG e WebP — elaborazione locale nel browser."
  upload_hint: "Supporta JPG, PNG, WebP e altri formati"
  format_label: "Formato di output"
  format_recommended: "consigliato"
  quality_label: "Qualità"
  size_label: "Larghezza/altezza max"
  size_original: "Originale (senza ridimensionare)"
  download_btn: "Scarica immagine"
  new_image: "Nuova immagine"
  original_label: "Originale"
  compressed_label: "Compressa"
  filename_suffix: "compressa"
  intro: "Questo strumento online gratuito comprime foto e immagini in modo semplice e immediato, riducendo la dimensione dei file per velocizzare il caricamento delle immagini sui siti web, facilitare la condivisione tramite e-mail o social network e liberare spazio sul dispositivo. L'intera elaborazione avviene localmente nel browser, preservando al massimo la qualità visiva e garantendo totale privacy — senza installare alcun software."
  features_title: "Funzionalità dello Strumento"
  feature_1: "Conversione automatica tra WebP, JPG e PNG durante la compressione"
  feature_2: "Cursore di qualità con anteprima del risultato e percentuale di risparmio"
  feature_3: "Ridimensionamento opzionale con proporzioni mantenute"
  feature_4: "Elaborazione 100% locale nel browser, garantendo totale privacy"
  use_cases_title: "Quando usare la Compressione delle Immagini"
  use_cases_desc: "Comprimere le immagini è essenziale per l'ottimizzazione web, l'invio di file tramite app di messaggistica e il risparmio di spazio nello storage in cloud."
  uc_1_title: "Ottimizzazione Web e Core Web Vitals"
  uc_1_desc: "Riduci il peso delle pagine convertendo le immagini in WebP fino al 70%–80% in meno di dimensione, accelerando il caricamento e migliorando l'LCP (Largest Contentful Paint)."
  uc_2_title: "Risparmio di Spazio nello Storage Cloud"
  uc_2_desc: "Comprimi raccolte di foto prima del backup su servizi di archiviazione cloud o della condivisione tramite strumenti di trasferimento online."
  uc_3_title: "Allegare Foto via E-mail e WhatsApp"
  uc_3_desc: "Riduci la dimensione delle foto per rientrare nei limiti degli allegati e-mail o per condividerle rapidamente su app come WhatsApp e Telegram senza perdita di qualità percepibile."
  how_to_title: "Come comprimere un'immagine"
  how_1_title: "Carica l'immagine"
  how_1_desc: "Fai clic per selezionare o trascina qualsiasi file immagine (JPG, PNG, WebP) nell'area di caricamento."
  how_2_title: "Imposta formato e qualità"
  how_2_desc: "Scegli il formato di output, regola la qualità e, opzionalmente, imposta larghezza e altezza massime."
  how_3_title: "Scarica il risultato"
  how_3_desc: "Fai clic su 'Scarica immagine' per salvare la versione ottimizzata della tua immagine."
  faq_title: "Domande e Risposte"
  faq_1_q: "Perché WebP è il formato consigliato?"
  faq_1_a: "WebP è il formato moderno standard del web, con dimensioni fino al 30% inferiori rispetto a JPG a parità di qualità visiva. È supportato da tutti i browser attuali (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "Come comprimere un'immagine senza perdere qualità?"
  faq_2_a: "Per comprimere un'immagine senza perdita di qualità percepibile, mantieni il cursore della qualità sopra il 70%. In questo intervallo la differenza visiva è impercettibile sulla maggior parte delle foto. Per immagini con testo, grafica o molti dettagli, resta sopra l'85% per preservare la nitidezza."
  faq_3_q: "Le mie immagini vengono inviate a qualche server?"
  faq_3_a: "No. La compressione avviene direttamente nel tuo browser, quindi le tue immagini non vengono inviate o memorizzate su alcun server."
  faq_4_q: "Qual è la dimensione massima del file?"
  faq_4_a: "Non c'è un limite imposto dallo strumento, ma poiché l'elaborazione usa la memoria del browser, consigliamo immagini fino a 50 MB per un'esperienza fluida. File molto grandi potrebbero risultare lenti a seconda del dispositivo."
  see1: "Ridimensionare Immagine"
  see2: "Ritagliare Immagine"
  see3: "Sfocare Immagine"
  see4: "Immagine in PDF"

id:
  title: "Kompres Gambar"
  page_title: "Kompres Foto dan Gambar Online - Perkecil JPG, PNG, WebP Gratis"
  meta: "Kompres foto dan gambar online gratis. Perkecil ukuran file foto JPG, PNG dan WebP tanpa kehilangan kualitas visual. Pemrosesan lokal di browser, tanpa unggah ke server."
  upload_hint: "Mendukung JPG, PNG, WebP, dan format lainnya"
  format_label: "Format keluaran"
  format_recommended: "disarankan"
  quality_label: "Kualitas"
  size_label: "Lebar/tinggi maksimum"
  size_original: "Asli (tanpa diubah ukuran)"
  download_btn: "Unduh gambar"
  new_image: "Gambar baru"
  original_label: "Asli"
  compressed_label: "Dikompres"
  filename_suffix: "dikompres"
  intro: "Alat online gratis ini mengompres foto dan gambar dengan cepat dan mudah, mengurangi ukuran file untuk mempercepat pemuatan gambar di situs web, mempermudah berbagi melalui email atau media sosial, dan menghemat ruang di perangkat Anda. Semua pemrosesan dilakukan secara lokal di browser, menjaga kualitas visual semaksimal mungkin dan memastikan privasi penuh — tanpa perlu menginstal perangkat lunak apa pun."
  features_title: "Fitur Alat"
  feature_1: "Konversi otomatis antara WebP, JPG, dan PNG selama kompresi"
  feature_2: "Slider kualitas dengan pratinjau hasil dan persentase penghematan"
  feature_3: "Pengubahan ukuran opsional dengan rasio aspek terjaga"
  feature_4: "Pemrosesan 100% lokal di browser, menjamin privasi penuh"
  use_cases_title: "Kapan menggunakan Kompresi Gambar"
  use_cases_desc: "Mengompres gambar penting untuk optimasi web, pengiriman file melalui aplikasi pesan, dan menghemat ruang penyimpanan cloud."
  uc_1_title: "Optimasi Web dan Core Web Vitals"
  uc_1_desc: "Kurangi bobot halaman dengan mengonversi gambar ke WebP yang ukurannya bisa 70%–80% lebih kecil, mempercepat pemuatan halaman dan meningkatkan LCP (Largest Contentful Paint)."
  uc_2_title: "Hemat Penyimpanan Cloud"
  uc_2_desc: "Kompres koleksi foto sebelum mencadangkannya ke layanan penyimpanan cloud atau berbagi melalui alat transfer file online."
  uc_3_title: "Lampirkan Foto di Email dan WhatsApp"
  uc_3_desc: "Perkecil ukuran foto agar sesuai dengan batas lampiran email atau berbagi cepat di aplikasi seperti WhatsApp dan Telegram tanpa kehilangan kualitas yang terlihat."
  how_to_title: "Cara mengompres gambar"
  how_1_title: "Unggah gambar"
  how_1_desc: "Klik untuk memilih atau seret file gambar apa pun (JPG, PNG, WebP) ke area unggah."
  how_2_title: "Atur format dan kualitas"
  how_2_desc: "Pilih format keluaran, atur kualitas dan, jika perlu, tentukan lebar dan tinggi maksimum."
  how_3_title: "Unduh hasilnya"
  how_3_desc: "Klik 'Unduh gambar' untuk menyimpan versi gambar yang sudah dioptimalkan."
  faq_title: "Pertanyaan dan Jawaban"
  faq_1_q: "Mengapa WebP adalah format yang disarankan?"
  faq_1_a: "WebP adalah format modern standar web yang menawarkan ukuran hingga 30% lebih kecil dari JPG dengan kualitas visual yang sama. Didukung oleh semua browser modern (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "Bagaimana cara mengompres gambar tanpa kehilangan kualitas?"
  faq_2_a: "Untuk mengompres gambar tanpa kehilangan kualitas yang terlihat, jaga slider kualitas di atas 70%. Pada rentang ini, perbedaan visual hampir tidak terlihat pada sebagian besar foto. Untuk gambar dengan teks, grafik, atau detail tinggi, pertahankan di atas 85% agar ketajaman tetap terjaga."
  faq_3_q: "Apakah gambar saya dikirim ke server?"
  faq_3_a: "Tidak. Kompresi terjadi langsung di browser Anda, sehingga gambar Anda tidak dikirim atau disimpan di server mana pun."
  faq_4_q: "Berapa ukuran file maksimum?"
  faq_4_a: "Tidak ada batas yang dipaksakan oleh alat, namun karena pemrosesan menggunakan memori browser, kami menyarankan gambar hingga 50 MB untuk pengalaman yang lancar. File yang sangat besar mungkin berjalan lambat tergantung perangkat."
  see1: "Ubah Ukuran Gambar"
  see2: "Potong Gambar"
  see3: "Buramkan Gambar"
  see4: "Gambar ke PDF"

de:
  title: "Bild Komprimieren"
  page_title: "Bild verkleinern und komprimieren online - JPG, PNG, WebP Gratis"
  meta: "Bilder online verkleinern und komprimieren, kostenlos. Reduzieren Sie die Dateigröße von JPG, PNG und WebP unter Beibehaltung der visuellen Qualität. Lokale Verarbeitung im Browser."
  upload_hint: "Unterstützt JPG, PNG, WebP und andere Formate"
  format_label: "Ausgabeformat"
  format_recommended: "empfohlen"
  quality_label: "Qualität"
  size_label: "Maximale Breite/Höhe"
  size_original: "Original (keine Größenänderung)"
  download_btn: "Bild herunterladen"
  new_image: "Neues Bild"
  original_label: "Original"
  compressed_label: "Komprimiert"
  filename_suffix: "komprimiert"
  intro: "Dieses kostenlose Online-Tool komprimiert Ihre Fotos und Bilder einfach und sofort. Es reduziert die Dateigröße, um das Laden von Bildern auf Websites zu beschleunigen, das Teilen per E-Mail oder über soziale Netzwerke zu vereinfachen und Speicherplatz auf Ihrem Gerät freizugeben. Die gesamte Verarbeitung erfolgt lokal im Browser, wobei die visuelle Qualität bestmöglich erhalten bleibt und volle Privatsphäre garantiert ist — ganz ohne Softwareinstallation."
  features_title: "Funktionen des Tools"
  feature_1: "Automatische Konvertierung zwischen WebP, JPG und PNG während der Komprimierung"
  feature_2: "Qualitätsregler mit Live-Vorschau und Anzeige der Einsparung in Prozent"
  feature_3: "Optionale Größenänderung mit beibehaltenem Seitenverhältnis"
  feature_4: "100% lokale Verarbeitung im Browser für vollständige Privatsphäre"
  use_cases_title: "Wann Bildkomprimierung verwenden"
  use_cases_desc: "Die Komprimierung von Bildern ist wichtig für die Weboptimierung, den Versand von Dateien über Messenger-Apps und das Sparen von Speicherplatz in der Cloud."
  uc_1_title: "Weboptimierung und Core Web Vitals"
  uc_1_desc: "Reduzieren Sie das Gewicht Ihrer Seiten, indem Sie Bilder in WebP konvertieren — mit bis zu 70%–80% kleinerer Dateigröße. Das beschleunigt das Laden der Seite und verbessert den LCP (Largest Contentful Paint)."
  uc_2_title: "Cloud-Speicherplatz sparen"
  uc_2_desc: "Komprimieren Sie Fotosammlungen, bevor Sie sie bei Cloud-Speicherdiensten sichern oder über Online-Dateitransferdienste teilen."
  uc_3_title: "Fotos per E-Mail und WhatsApp versenden"
  uc_3_desc: "Verkleinern Sie Fotos, um E-Mail-Anhangsgrenzen einzuhalten oder sie schnell über Apps wie WhatsApp und Telegram ohne sichtbaren Qualitätsverlust zu teilen."
  how_to_title: "So komprimieren Sie ein Bild"
  how_1_title: "Bild hochladen"
  how_1_desc: "Klicken Sie, um eine Datei auszuwählen, oder ziehen Sie eine beliebige Bilddatei (JPG, PNG, WebP) in den Upload-Bereich."
  how_2_title: "Format und Qualität einstellen"
  how_2_desc: "Wählen Sie das Ausgabeformat, passen Sie die Qualität an und legen Sie optional die maximale Breite und Höhe fest."
  how_3_title: "Ergebnis herunterladen"
  how_3_desc: "Klicken Sie auf 'Bild herunterladen', um die optimierte Version Ihres Bildes zu speichern."
  faq_title: "Fragen und Antworten"
  faq_1_q: "Warum ist WebP das empfohlene Format?"
  faq_1_a: "WebP ist der moderne Webstandard und bietet bei gleicher visueller Qualität bis zu 30% kleinere Dateien als JPG. Es wird von allen aktuellen Browsern unterstützt (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "Wie komprimiere ich ein Bild ohne Qualitätsverlust?"
  faq_2_a: "Um ein Bild ohne wahrnehmbaren Qualitätsverlust zu komprimieren, halten Sie den Qualitätsregler über 70%. In diesem Bereich ist der visuelle Unterschied bei den meisten Fotos kaum sichtbar. Bei Bildern mit Text, Grafiken oder feinen Details sollten Sie über 85% bleiben, um die Schärfe zu erhalten."
  faq_3_q: "Werden meine Bilder an einen Server gesendet?"
  faq_3_a: "Nein. Die Komprimierung erfolgt direkt in Ihrem Browser, sodass Ihre Bilder nicht an Server gesendet oder dort gespeichert werden."
  faq_4_q: "Was ist die maximale Dateigröße?"
  faq_4_a: "Es gibt kein vom Tool festgelegtes Limit, aber da die Verarbeitung den Browser-Speicher nutzt, empfehlen wir Bilder bis zu 50 MB für eine flüssige Nutzung. Sehr große Dateien können je nach Gerät langsamer werden."
  see1: "Bildgröße Ändern"
  see2: "Bild Zuschneiden"
  see3: "Bild Weichzeichnen"
  see4: "Bild zu PDF"

nl:
  title: "Afbeelding Comprimeren"
  page_title: "Foto Verkleinen of Afbeelding Comprimeren Online - JPG, PNG, WebP Gratis"
  meta: "Foto's verkleinen en afbeeldingen comprimeren online, gratis. Verklein de bestandsgrootte van JPG, PNG en WebP met behoud van de visuele kwaliteit. Lokale verwerking in de browser."
  upload_hint: "Ondersteunt JPG, PNG, WebP en andere formaten"
  format_label: "Uitvoerformaat"
  format_recommended: "aanbevolen"
  quality_label: "Kwaliteit"
  size_label: "Maximale breedte/hoogte"
  size_original: "Origineel (niet aanpassen)"
  download_btn: "Afbeelding downloaden"
  new_image: "Nieuwe afbeelding"
  original_label: "Origineel"
  compressed_label: "Gecomprimeerd"
  filename_suffix: "gecomprimeerd"
  intro: "Deze gratis online tool comprimeert je foto's en afbeeldingen eenvoudig en direct. Het verkleint de bestandsgrootte om het laden van afbeeldingen op websites te versnellen, het delen via e-mail of sociale media te vereenvoudigen en ruimte op je apparaat vrij te maken. Alle verwerking gebeurt lokaal in de browser, met behoud van de visuele kwaliteit en volledige privacy — zonder installatie van software."
  features_title: "Functies van de Tool"
  feature_1: "Automatische conversie tussen WebP, JPG en PNG tijdens de compressie"
  feature_2: "Kwaliteitschuif met live voorbeeld van het resultaat en het besparingspercentage"
  feature_3: "Optionele schaalverandering met behoud van de verhouding"
  feature_4: "100% lokale verwerking in de browser voor volledige privacy"
  use_cases_title: "Wanneer Afbeeldingscompressie gebruiken"
  use_cases_desc: "Afbeeldingen comprimeren is essentieel voor weboptimalisatie, het verzenden van bestanden via berichtenapps en het besparen van cloud-opslagruimte."
  uc_1_title: "Weboptimalisatie en Core Web Vitals"
  uc_1_desc: "Verklein het gewicht van je pagina's door afbeeldingen te converteren naar WebP met tot 70%–80% kleinere bestanden, versnel het laden van pagina's en verbeter de LCP (Largest Contentful Paint)."
  uc_2_title: "Cloud-opslag besparen"
  uc_2_desc: "Comprimeer foto-collecties voordat je ze back-upt naar cloudopslagdiensten of deelt via online bestandsoverdrachttools."
  uc_3_title: "Foto's bijvoegen in E-mail en WhatsApp"
  uc_3_desc: "Verklein foto's om binnen de bijlagelimiet van e-mails te blijven of snel te delen in apps zoals WhatsApp en Telegram zonder merkbaar kwaliteitsverlies."
  how_to_title: "Hoe een afbeelding comprimeren"
  how_1_title: "Upload je afbeelding"
  how_1_desc: "Klik om een afbeelding (JPG, PNG, WebP) te selecteren of sleep deze naar het uploadgebied."
  how_2_title: "Stel formaat en kwaliteit in"
  how_2_desc: "Kies het uitvoerformaat, pas de kwaliteit aan en stel desgewenst de maximale breedte en hoogte in."
  how_3_title: "Download het resultaat"
  how_3_desc: "Klik op 'Afbeelding downloaden' om de geoptimaliseerde versie van je afbeelding op te slaan."
  faq_title: "Vragen en Antwoorden"
  faq_1_q: "Waarom is WebP het aanbevolen formaat?"
  faq_1_a: "WebP is de moderne webstandaard en biedt tot 30% kleinere bestanden dan JPG bij dezelfde visuele kwaliteit. Het wordt ondersteund door alle huidige browsers (Chrome, Firefox, Safari, Edge)."
  faq_2_q: "Hoe comprimeer je een afbeelding zonder kwaliteitsverlies?"
  faq_2_a: "Om een afbeelding te comprimeren zonder merkbaar kwaliteitsverlies, houd je de kwaliteitsschuif boven 70%. In dat bereik is het visuele verschil bij de meeste foto's nauwelijks zichtbaar. Voor afbeeldingen met tekst, illustraties of fijne details blijf je boven 85% om de scherpte te behouden."
  faq_3_q: "Worden mijn afbeeldingen naar een server gestuurd?"
  faq_3_a: "Nee. De compressie vindt rechtstreeks in je browser plaats, dus je afbeeldingen worden niet naar een server verzonden of daar opgeslagen."
  faq_4_q: "Wat is de maximale bestandsgrootte?"
  faq_4_a: "Er is geen door de tool opgelegde limiet, maar omdat de verwerking het browsergeheugen gebruikt, raden we afbeeldingen tot 50 MB aan voor een vlotte ervaring. Erg grote bestanden kunnen traag worden afhankelijk van het apparaat."
  see1: "Afbeelding Vergroten/Verkleinen"
  see2: "Afbeelding Bijsnijden"
  see3: "Afbeelding Vervagen"
  see4: "Afbeelding naar PDF"
ru:
  title: "Сжатие изображений"
  page_title: "Сжатие изображений онлайн: сжать JPG, PNG, WebP"
  meta: "Бесплатный онлайн-компрессор изображений. Сжимайте фотографии и картинки для уменьшения размера файлов с сохранением визуального качества. Поддержка JPG, PNG, WebP."
  upload_hint: "Поддерживаются форматы JPG, PNG, WebP и др."
  format_label: "Формат сохранения"
  format_recommended: "рекомендуется"
  quality_label: "Качество"
  size_label: "Максимальная ширина/высота"
  size_original: "Оригинальный (без изменения)"
  download_btn: "Скачать изображение"
  new_image: "Новое изображение"
  original_label: "Исходный файл"
  compressed_label: "Сжатый файл"
  filename_suffix: "compressed"
  intro: "Этот бесплатный онлайн-инструмент позволяет мгновенно сжать фотографии и изображения, уменьшая размер файлов. Это ускорит загрузку страниц на сайтах, упростит отправку картинок по почте или в мессенджерах и освободит место на диске. Вся обработка происходит локально в браузере, сохраняя высокое визуальное качество и обеспечивая полную конфиденциальность — без установки стороннего ПО."
  features_title: "Возможности компрессора"
  feature_1: "Автоматическая конвертация форматов WebP, JPG и PNG в процессе сжатия"
  feature_2: "Регулировка качества ползунком с предпросмотром результата и процента экономии места"
  feature_3: "Дополнительное изменение разрешения с точным сохранением пропорций"
  feature_4: "Сжатие на 100% локально на вашем компьютере для абсолютной конфиденциальности"
  use_cases_title: "Когда полезно сжатие изображений"
  use_cases_desc: "Оптимизация размера файлов крайне важна для быстрой работы веб-сайтов, удобной отправки медиафайлов и экономии пространства на дисках."
  uc_1_title: "Оптимизация для сайтов и Core Web Vitals"
  uc_1_desc: "Ускорьте загрузку страниц, конвертируя графику в формат WebP с уменьшением размера до 70-80%, что улучшает показатели LCP (Largest Contentful Paint) в SEO."
  uc_2_title: "Экономия облачного пространства"
  uc_2_desc: "Сжимайте большие коллекции фотографий перед отправкой в облачные хранилища или файлообменники."
  uc_3_title: "Отправка картинок по почте и в мессенджерах"
  uc_3_desc: "Уменьшайте вес фото, чтобы уложиться в лимиты вложений электронной почты или быстрее делиться ими в Telegram и WhatsApp без видимого ухудшения качества."
  how_to_title: "Как сжать изображение"
  how_1_title: "Загрузите изображение"
  how_1_desc: "Нажмите кнопку загрузки или просто перетащите файл (JPG, PNG, WebP) на рабочую область."
  how_2_title: "Настройте формат и сжатие"
  how_2_desc: "Укажите выходной формат, настройте качество сжатия ползунком и, при желании, задайте максимальные ширину и высоту."
  how_3_title: "Скачайте готовый файл"
  how_3_desc: "Нажмите кнопку «Скачать изображение», чтобы сохранить оптимизированный файл."
  faq_title: "Часто задаваемые вопросы"
  faq_1_q: "Почему WebP рекомендуется как основной формат?"
  faq_1_a: "WebP — современный стандарт веб-графики, обеспечивающий сжатие на 30% эффективнее по сравнению с JPG при сохранении исходного качества. Поддерживается всеми современными браузерами."
  faq_2_q: "Как сжать картинку без потери качества?"
  faq_2_a: "Чтобы сжатие было визуально незаметным, держите ползунок качества на уровне выше 70%. Для большинства фотографий разница с оригиналом будет не видна глазом. Для изображений с мелким текстом, схемами или высокой детализацией рекомендуем устанавливать качество выше 85%."
  faq_3_q: "Загружаются ли изображения на внешний сервер?"
  faq_3_a: "Нет. Сжатие файлов происходит непосредственно на вашем компьютере с помощью ресурсов браузера, исходные изображения не отправляются в сеть."
  faq_4_q: "Каков максимальный размер файлов?"
  faq_4_a: "Сервис не накладывает жестких лимитов, однако, поскольку обработка задействует память браузера, для плавной работы советуем сжимать файлы объемом до 50 МБ. Файлы большего размера могут обрабатываться медленнее."
  see1: "Изменение размера изображений"
  see2: "Обрезка изображений"
  see3: "Размытие изображений"
  see4: "Изображения в PDF"
</i18n>
