<script setup lang="ts">
import { ref, computed } from 'vue'
import Color from '~/components/Color.vue'

declare global {
  interface Window {
    ColorThief: any
  }
}

const dominantColor = ref('') 
const palette = ref<string[]>([]) 
const canvasRef = ref<HTMLCanvasElement | null>(null)

const { t, locale } = useI18n({ useScope: 'local' })
const route = useRoute()
const siteUrl = 'https://www.freetool.dev'
const canonicalUrl = computed(() => `${siteUrl}${route.path}`)

const { status: ctStatus } = useScript('https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.4.0/color-thief.umd.js', { trigger: 'client' })
const ctLoaded = computed(() => ctStatus.value === 'loaded')

function onFile(file: File) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  
  let img = new Image();
  const objectUrl = (window.URL || window.webkitURL).createObjectURL(file);
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    ctx.drawImage(
      img, 
      0, 0, 
      img.width, img.height, 
      (canvas.width - img.width * ratio) / 2, 
      (canvas.height - img.height * ratio) / 2, 
      img.width * ratio, 
      img.height * ratio
    );  
    
    const ColorThiefClass = (window as any).ColorThief;
    if (ColorThiefClass) {
      const colorThief = new ColorThiefClass();
      dominantColor.value = toHex(colorThief.getColor(img));
      palette.value = colorThief.getPalette(img).map((color: any) => toHex(color));
    }
    
    (window.URL || window.webkitURL).revokeObjectURL(objectUrl);
  }
  img.src = objectUrl;
}

function toHex(arr: number[]) {
  return "#" + ((1 << 24) + (arr[0] << 16) + (arr[1] << 8) + arr[2]).toString(16).slice(1);
}

function reset() {
  dominantColor.value = '';
  palette.value = [];
}

// --- SEO & Schema ---
usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('feature_1'),
    t('feature_2'),
    t('feature_3'),
    t('feature_4'),
    t('feature_5')
  ],
  faq: [
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') }
  ]
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  },
  title: t('pageTitle'),
  link: [
    { rel: 'canonical', href: canonicalUrl.value }
  ],
  meta: [
    { name: "description", content: t('meta') },
    { property: 'og:title', content: t('ogTitle') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: t('ogLocale') },
    { property: 'og:url', content: canonicalUrl.value },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: t('ogTitle') },
    { name: 'twitter:description', content: t('meta') }
  ]
}))

defineI18nRoute({
  paths: {
    en: '/dominant-colors-of-the-image',
    pt: '/cores-dominantes-da-imagem', 
    es: '/colores-dominantes-de-la-imagen', 
    fr: '/couleurs-dominantes-de-l-image',
    it: '/colori-dominanti-dell-immagine',
    id: '/warna-dominan-gambar',
    de: '/dominante-farben-des-bildes',
    nl: '/dominante-kleuren-van-de-afbeelding'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!dominantColor"
    :see-also-links="[
      { label: t('see1'), to: 'random-colors' },
      { label: t('see2'), to: 'color-converter' },
      { label: t('see3'), to: 'color-combination' },
      { label: t('see4'), to: 'qrcode-generator' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div v-show="!dominantColor" class="flex flex-col items-center justify-center py-8 gap-4">
        <ImageUploader :show="!dominantColor" @on-file="onFile" />
      </div>

      <div v-show="dominantColor" class="flex flex-col md:flex-row gap-6 items-start">
        <div class="w-full md:w-auto flex-shrink-0 flex flex-col items-center">
          <div class="checkerboard p-2 rounded-2xl border border-base-content/10 bg-base-100 max-w-full overflow-hidden flex items-center justify-center shadow-inner">
            <canvas ref="canvasRef" height="300" class="max-w-full h-auto cursor-crosshair rounded-xl" />
          </div>
          <button type="button" @click="reset" class="btn btn-outline btn-primary w-full mt-4 flex items-center gap-2 justify-center rounded-xl">
            <Icon name="restart.svg?width=18&height=18&color=currentColor" lib="mdi"/> {{ t('restart') }}
          </button>
        </div>
       
        <div class="grid gap-6 w-full md:flex-1">
          <!-- Dominant Color Section -->
          <div class="space-y-2 bg-base-200/30 p-5 rounded-2xl border border-base-content/10">
            <p class="text-sm font-bold text-base-content/85 uppercase tracking-wider">{{ t('dominant') }}</p>
            <div class="relative group h-24 w-full max-w-xs rounded-xl overflow-hidden shadow-md">
              <Color :color="dominantColor" class="w-full h-full" />
            </div>
          </div>

          <!-- Palette Section -->
          <div class="space-y-2 bg-base-200/30 p-5 rounded-2xl border border-base-content/10">
            <p class="text-sm font-bold text-base-content/85 uppercase tracking-wider">{{ t('palette') }}</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <div v-for="(color, i) in palette" :key="i" class="relative group h-20 w-full rounded-xl overflow-hidden shadow-sm">
                <Color :color="color" class="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <div>
          <p class="text-base-content/80 leading-relaxed">{{ t('intro') }}</p>
        </div>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4'), t('feature_5')]"
        />

        <UseCaseSection
          :title="t('apps_title')"
          :items="[t('app1'), t('app2'), t('app3'), t('app4'), t('app5')]"
        />

        <HowToSection
          :title="t('how_title')"
          :items="[
            { title: t('step_1_t'), description: t('step_1_d') },
            { title: t('step_2_t'), description: t('step_2_d') },
            { title: t('step_3_t'), description: t('step_3_d') }
          ]"
        />

        <div>
          <h2 class="text-2xl font-bold text-base-content mb-3 flex items-center gap-2">
            <Icon name="heroicons:information-circle-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('tech_title') }}
          </h2>
          <p class="mb-6 text-base-content/85 leading-relaxed">
            {{ t('tech_desc') }}
          </p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div 
              v-for="(item, index) in [t('tech1'), t('tech2'), t('tech3'), t('tech4')]" 
              :key="index"
              class="bg-base-200/40 p-5 rounded-2xl border border-base-content/10 flex items-start gap-4"
            >
              <div class="shrink-0 mt-0.5">
                <Icon 
                  name="heroicons:information-circle-20-solid" 
                  class="text-info w-5 h-5" 
                />
              </div>
              <span class="text-base-content/80 text-sm leading-relaxed">
                {{ item }}
              </span>
            </div>
          </div>
        </div>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq2q'), answer: t('faq2a') },
            { question: t('faq3q'), answer: t('faq3a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "Image Color Extractor — Dominant Color and Palette | Free Online",
    ogTitle: "Image Color Extractor — Extract Colors from Any Photo",
    ogLocale: "en_US",
    title: "Image Colors",
    intro: "Identify the color profile of any image in seconds. Our Color Extractor analyzes your images locally to extract the dominant color and generate a ready-to-use palette. Upload a photo, screenshot, illustration, logo or product image to get HEX codes ideal for UI, branding, CSS variables, moodboards and visual analysis.",
    meta: "Discover the color profile of any image with our free online palette extractor. Automatically generate a palette with the dominant colors of the image.",
    how_title: "How It Works",
    step_1_t: "Upload the Image",
    step_1_d: "Upload the image you want to analyze.",
    step_2_t: "Analyze the Profile",
    step_2_d: "The tool will analyze the pixel distribution to identify the dominant color and extract the most present colors in the image.",
    step_3_t: "Copy the Colors",
    step_3_d: "Click any generated color swatch to copy its HEX code.",
    apps_title: "Common Applications",
    app1: "Extract palettes from logos, screenshots, hero images and product photos to build interfaces visually aligned with brand identity",
    app2: "Capture HEX codes from reference images to assemble brand boards, presentations, ads and social media layouts",
    app3: "Identify background, highlight and supporting colors from photographs before building landing pages, banners or ecommerce pages",
    app4: "Analyze artwork, illustrations and portfolio images to understand the chromatic balance and visual style of a project",
    app5: "Use palette extraction in moodboards, interior references, fashion research and creative direction when visual consistency is essential",
    tech_title: "Technical Notes",
    tech_desc: "A few practical details affect how extracted colors should be interpreted in real projects:",
    tech1: "The dominant color is not always the most visually important one. Large backgrounds, shadows or neutral areas may occupy more space in the image than the main subject's colors, even when those are visually more striking",
    tech2: "Images with gradients, lighting variations, blur or compression may produce approximate palettes and not necessarily exact branding values",
    tech3: "For a cleaner and more consistent palette, use a cropped image highlighting the main subject rather than the full composition",
    tech4: "This tool is ideal for quick color extraction and exploration. For finalizing values in a brand system, it is still recommended to validate the colors in your design workflow",
    faq_title: "Frequently Asked Questions",
    faq2q: "Which image formats work best?",
    faq2a: "Common formats like PNG, JPG/JPEG and WebP work well. Cleaner images with less compression and a clearer main subject tend to produce more useful palettes.",
    faq3q: "Why does the dominant color sometimes look different from the main subject?",
    faq3a: "Because the tool analyzes the overall pixel distribution. If the image has a large background, shadows or neutral areas, those regions may influence the dominant result more than a smaller highlighted object.",
    features_title: "Key Features",
    feature_1: "Quickly identify dominant colors in images",
    feature_2: "Generate color palettes from any image",
    feature_3: "Extract HEX codes with a single click",
    feature_4: "Supports formats like JPG, PNG and WebP",
    feature_5: "Local browser processing for complete privacy",
    restart: "Start Over",
    dominant: "Dominant color",
    palette: "Image palette",
    see1: "Random Colors",
    see2: "Color Converter",
    see3: "Color Combination",
    see4: "QR Code Generator"
  },
  pt: {
    pageTitle: "Extrator de Cores de Imagem — Cor Dominante e Paleta | Online Grátis",
    ogTitle: "Extrator de Cores de Imagem — Extraia Cores de Qualquer Foto",
    ogLocale: "pt_BR",
    title: "Cores da Imagem",
    intro: "Identifique o perfil cromático de qualquer imagem em segundos. Nosso Extrator de Cores analisa suas imagens localmente para extrair a cor dominante e gerar uma paleta pronta para uso. Envie uma foto, screenshot, ilustração, logo ou imagem de produto para obter códigos HEX ideais para UI, branding, variáveis CSS, moodboards e análise visual.",
    meta: "Descubra o perfil cromático de qualquer imagem com nosso extrator de paletas online gratuito. Gere automaticamente uma paleta com as cores dominantes da imagem.",
    how_title: "Como Funciona",
    step_1_t: "Envie a Imagem",
    step_1_d: "Faça upload da imagem que você quer analisar.",
    step_2_t: "Analise o Perfil",
    step_2_d: "A ferramenta analisará a distribuição dos pixels para identificar a cor predominante e extrair as cores mais presentes na imagem.",
    step_3_t: "Copie as Cores",
    step_3_d: "Clique em qualquer uma das amostras de cores geradas para copiar o código HEX correspondente.",
    apps_title: "Aplicações Comuns",
    app1: "Extraia paletas de logos, screenshots, hero images e fotos de produtos para criar interfaces visualmente alinhadas à identidade da marca",
    app2: "Capture códigos HEX de imagens de referência para montar brand boards, apresentações, anúncios e layouts para redes sociais",
    app3: "Identifique cores de fundo, destaque e apoio a partir de fotografias antes de criar landing pages, banners ou páginas de ecommerce",
    app4: "Analise artes, ilustrações e imagens de portfólio para compreender o equilíbrio cromático e o estilo visual de um projeto",
    app5: "Use a extração de paletas em moodboards, referências de interiores, pesquisas de moda e direção criativa quando consistência visual for essencial",
    tech_title: "Notas Técnicas",
    tech_desc: "Alguns detalhes práticos afetam a forma como as cores extraídas devem ser interpretadas em projetos reais:",
    tech1: "A cor dominante nem sempre é a visualmente mais importante. Fundos amplos, sombras ou áreas neutras podem ocupar mais espaço na imagem do que as cores do elemento principal, mesmo que estas sejam visualmente mais marcantes",
    tech2: "Imagens com gradientes, variações de iluminação, desfoque ou compressão podem gerar paletas aproximadas e não necessariamente valores exatos de branding",
    tech3: "Para obter uma paleta mais limpa e consistente, utilize uma imagem recortada destacando o elemento principal em vez da composição completa",
    tech4: "Esta ferramenta é ideal para extração e exploração rápida de cores. Para definir valores finais de um sistema de marca, ainda é recomendado validar as cores no seu fluxo de design",
    faq_title: "Perguntas Frequentes",
    faq2q: "Quais formatos de imagem funcionam melhor?",
    faq2a: "Formatos comuns como PNG, JPG/JPEG e WebP funcionam bem. Imagens mais limpas, com menos compressão e com o assunto principal mais claro, costumam gerar paletas mais úteis.",
    faq3q: "Por que a cor dominante às vezes parece diferente do objeto principal?",
    faq3a: "Porque a ferramenta analisa a distribuição geral dos pixels. Se a imagem tiver muito fundo, sombras ou áreas neutras, essas regiões podem influenciar o resultado dominante mais do que um objeto menor em destaque.",
    features_title: "Principais Recursos",
    feature_1: "Identifique rapidamente as cores dominantes em imagens",
    feature_2: "Gere paletas de cores a partir de qualquer imagem",
    feature_3: "Extraia códigos HEX com um único clique",
    feature_4: "Suporta formatos como JPG, PNG e WebP",
    feature_5: "Processamento local no navegador para total privacidade",
    restart: "Recomeçar",
    dominant: "Cor dominante",
    palette: "Paleta da imagem",
    see1: "Cores Aleatórias",
    see2: "Conversor de Cores",
    see3: "Combinação de Cores",
    see4: "Gerador de QR Code"
  },
  es: {
    pageTitle: "Extractor de Colores de Imagen — Color Dominante y Paleta | Online Gratis",
    ogTitle: "Extractor de Colores de Imagen — Extrae Colores de Cualquier Foto",
    ogLocale: "es_ES",
    title: "Colores de la Imagen",
    intro: "Identifica el perfil cromático de cualquier imagen en segundos. Nuestro Extractor de Colores analiza tus imágenes localmente para extraer el color dominante y generar una paleta lista para usar. Sube una foto, captura de pantalla, ilustración, logo o imagen de producto para obtener códigos HEX ideales para UI, branding, variables CSS, moodboards y análisis visual.",
    meta: "Descubre el perfil cromático de cualquier imagen con nuestro extractor de paletas online gratuito. Genera automáticamente una paleta con los colores dominantes de la imagen.",
    how_title: "Cómo Funciona",
    step_1_t: "Sube la Imagen",
    step_1_d: "Sube la imagen que quieres analizar.",
    step_2_t: "Analiza el Perfil",
    step_2_d: "La herramienta analizará la distribución de píxeles para identificar el color predominante y extraer los colores más presentes en la imagen.",
    step_3_t: "Copia los Colores",
    step_3_d: "Haz clic en cualquier muestra de color generada para copiar su código HEX.",
    apps_title: "Aplicaciones Comunes",
    app1: "Extrae paletas de logos, capturas de pantalla, hero images y fotos de productos para crear interfaces visualmente alineadas con la identidad de marca",
    app2: "Captura códigos HEX de imágenes de referencia para armar brand boards, presentaciones, anuncios y layouts para redes sociales",
    app3: "Identifica colores de fondo, destaque y apoyo a partir de fotografías antes de crear landing pages, banners o páginas de ecommerce",
    app4: "Analiza artes, ilustraciones e imágenes de portafolio para comprender el equilibrio cromático y el estilo visual de un proyecto",
    app5: "Usa la extracción de paletas en moodboards, referencias de interiores, investigación de moda y dirección creativa cuando la consistencia visual es esencial",
    tech_title: "Notas Técnicas",
    tech_desc: "Algunos detalles prácticos afectan la forma en que los colores extraídos deben interpretarse en proyectos reales:",
    tech1: "El color dominante no siempre es el más importante visualmente. Fondos amplios, sombras o áreas neutras pueden ocupar más espacio en la imagen que los colores del elemento principal, aunque estos sean visualmente más llamativos",
    tech2: "Las imágenes con degradados, variaciones de iluminación, desenfoque o compresión pueden generar paletas aproximadas y no necesariamente valores exactos de branding",
    tech3: "Para obtener una paleta más limpia y consistente, usa una imagen recortada que destaque el elemento principal en lugar de la composición completa",
    tech4: "Esta herramienta es ideal para la extracción y exploración rápida de colores. Para definir valores finales de un sistema de marca, se recomienda validar los colores en tu flujo de diseño",
    faq_title: "Preguntas Frecuentes",
    faq2q: "¿Qué formatos de imagen funcionan mejor?",
    faq2a: "Formatos comunes como PNG, JPG/JPEG y WebP funcionan bien. Las imágenes más limpias, con menos compresión y con el sujeto principal más claro, suelen generar paletas más útiles.",
    faq3q: "¿Por qué el color dominante a veces parece diferente al objeto principal?",
    faq3a: "Porque la herramienta analiza la distribución general de píxeles. Si la imagen tiene mucho fondo, sombras o áreas neutras, esas regiones pueden influir en el resultado dominante más que un objeto más pequeño en primer plano.",
    features_title: "Características Principales",
    feature_1: "Identifica rápidamente los colores dominantes en imágenes",
    feature_2: "Genera paletas de colores a partir de cualquier imagen",
    feature_3: "Extrae códigos HEX con un solo clic",
    feature_4: "Compatible con formatos como JPG, PNG y WebP",
    feature_5: "Procesamiento local en el navegador para total privacidad",
    restart: "Empezar de nuevo",
    dominant: "Color dominante",
    palette: "Paleta de la imagen",
    see1: "Colores Aleatorios",
    see2: "Convertidor de Colores",
    see3: "Combinación de Colores",
    see4: "Generador de QR Code"
  },
  fr: {
    pageTitle: "Extracteur de Couleur d'Image — Couleur Dominante et Palette | En Ligne Gratuit",
    ogTitle: "Extracteur de Couleur d'Image — Extrayez les Couleurs de n'importe quelle Photo",
    ogLocale: "fr_FR",
    title: "Couleurs de l'Image",
    intro: "Identifiez le profil chromatique de n'importe quelle image en quelques secondes. Notre Extracteur de Couleur analyse vos images localement pour extraire la couleur dominante et générer une palette prête à l'emploi. Téléchargez une photo, une capture d'écran, une illustration, un logo ou une image de produit pour obtenir des codes HEX idéaux pour l'UI, le branding, les variables CSS, les moodboards et l'analyse visuelle.",
    meta: "Découvrez le profil chromatique de n'importe quelle image avec notre extracteur de palette en ligne gratuit. Générez automatiquement une palette avec les couleurs dominantes de l'image.",
    how_title: "Comment ça Fonctionne",
    step_1_t: "Envoyez l'Image",
    step_1_d: "Téléchargez l'image que vous souhaitez analyser.",
    step_2_t: "Analysez le Profil",
    step_2_d: "L'outil analysera la distribution des pixels pour identifier la couleur prédominante et extraire les couleurs les plus présentes dans l'image.",
    step_3_t: "Copiez les Couleurs",
    step_3_d: "Cliquez sur l'un des échantillons de couleurs générés pour copier le code HEX correspondant.",
    apps_title: "Applications Courantes",
    app1: "Extrayez des palettes de logos, de captures d'écran, d'images d'en-tête (hero images) et de photos de produits pour créer des interfaces visuellement alignées sur l'identité de la marque",
    app2: "Capturez des codes HEX à partir d'images de référence pour concevoir des brand boards, des présentations, des publicités et des mises en page pour les réseaux sociaux",
    app3: "Identifiez les couleurs d'arrière-plan, de mise en valeur et de soutien à partir de photographies avant de créer des landing pages, des bannières ou des pages d'e-commerce",
    app4: "Analysez des œuvres d'art, des illustrations et des images de portfolio pour comprendre l'équilibre chromatique et le style visuel d'un projet",
    app5: "Utilisez l'extraction de palettes dans des moodboards, des références de décoration d'intérieur, des recherches de mode et de la direction artistique lorsque la cohérence visuelle est essentielle",
    tech_title: "Notes Techniques",
    tech_desc: "Certains détails pratiques influencent la manière dont les couleurs extraites doivent être interprétées dans les projets réels :",
    tech1: "La couleur dominante n'est pas toujours la plus importante visuellement. Des arrière-plans larges, des ombres ou des zones neutres peuvent occuper plus d'espace sur l'image que les couleurs de l'élément principal, même si ces dernières sont visuellement plus marquantes",
    tech2: "Les images avec des dégradés, des variations de lumière, du flou ou de la compression peuvent générer des palettes approximatives et pas nécessairement des valeurs de branding exactes",
    tech3: "Pour obtenir une palette plus propre et plus cohérente, utilisez une image recadrée mettant en valeur l'élément principal plutôt que la composition complète",
    tech4: "Cet outil est idéal pour l'extraction et l'exploration rapide des couleurs. Pour définir les valeurs finales d'une charte graphique, il reste recommandé de valider les couleurs dans votre flux de travail de conception",
    faq_title: "Questions et Réponses",
    faq2q: "Quels formats d'image fonctionnent le mieux ?",
    faq2a: "Les formats courants comme PNG, JPG/JPEG et WebP fonctionnent très bien. Les images plus nettes, moins compressées et avec le sujet principal bien visible ont tendance à générer des palettes plus utiles.",
    faq3q: "Pourquoi la couleur dominante semble-t-elle parfois différente de l'objet principal ?",
    faq3a: "Parce que l'outil analyse la distribution globale des pixels. Si l'image comporte un grand arrière-plan, des ombres ou des zones neutres, ces régions peuvent influencer le résultat dominant plus qu'un objet plus petit mis en valeur.",
    features_title: "Principaux Atouts",
    feature_1: "Identifiez rapidement les couleurs dominantes dans les images",
    feature_2: "Générez des palettes de couleurs à partir de n'importe quelle image",
    feature_3: "Extrayez des codes HEX en un seul clic",
    feature_4: "Prend en charge les formats comme JPG, PNG et WebP",
    feature_5: "Traitement local dans le navigateur pour une confidentialité totale",
    restart: "Recommencer",
    dominant: "Couleur dominante",
    palette: "Palette de l'image",
    see1: "Couleurs Aléatoires",
    see2: "Convertisseur de Couleurs",
    see3: "Combinaison de Couleurs",
    see4: "Générateur de QR Code"
  },
  it: {
    pageTitle: "Estrattore di Colori da Immagine — Colore Dominante e Palette | Online Gratis",
    ogTitle: "Estrattore di Colori da Immagine — Estrai Colori da Qualsiasi Foto",
    ogLocale: "it_IT",
    title: "Colori dell'Immagine",
    intro: "Identifica il profilo cromatico di qualsiasi immagine in pochi secondi. Il nostro Estrattore di Colori analizza le tue immagini localmente per estrarre il colore dominante e generare una palette pronta all'uso. Carica una foto, uno screenshot, un'illustrazione, un logo o un'immagine di prodotto per ottenere codici HEX ideali per UI, branding, variabili CSS, moodboard e analisi visiva.",
    meta: "Scopri il profilo cromatico di qualsiasi immagine con il nostro estrattore di palette online gratuito. Genera automaticamente una palette con i colori dominanti dell'immagine.",
    how_title: "Come Funziona",
    step_1_t: "Invia l'Immagine",
    step_1_d: "Carica l'immagine che desideri analizzare.",
    step_2_t: "Analizza il Profilo",
    step_2_d: "Lo strumento analizzerà la distribuzione dei pixel per identificare il colore predominante ed estrarre i colori più presenti nell'immagine.",
    step_3_t: "Copia i Colori",
    step_3_d: "Clicca su uno qualsiasi dei campioni di colore generati per copiare il codice HEX corrispondente.",
    apps_title: "Applicazioni Comuni",
    app1: "Estrai palette da loghi, screenshot, hero image e foto di prodotti per creare interfacce visivamente allineate all'identità del brand",
    app2: "Cattura codici HEX da immagini di riferimento per comporre brand board, presentazioni, annunci e layout per i social network",
    app3: "Identifica colori di sfondo, evidenziazione e supporto da fotografie prima di creare landing page, banner o pagine di e-commerce",
    app4: "Analizza opere d'arte, illustrazioni e immagini di portfolio per comprendere l'equilibrio cromatico e lo stile visuale di un progetto",
    app5: "Usa l'estrazione di palette in moodboard, riferimenti per l'interior design, ricerche di moda e direzione artistica quando la coerenza visiva è essenziale",
    tech_title: "Note Tecniche",
    tech_desc: "Alcuni dettagli pratici influenzano il modo in cui i colori estratti devono essere interpretati nei progetti reali :",
    tech1: "Il colore dominante non è sempre il più importante visivamente. Sfondi ampi, ombre o aree neutre possono occupare più spazio nell'immagine rispetto ai colori dell'elemento principal, anche se questi ultimi sono visivamente più marcati",
    tech2: "Le immagini con sfumature, variazioni di luce, sfocatura o compressione possono generare palette approssimative e non necessariamente valori di branding esatti",
    tech3: "Per ottenere una palette più pulita e coerente, utilizza un'immagine ritagliata che evidenzi l'elemento principale piuttosto che la composizione completa",
    tech4: "Questo strumento è ideale per l'estrazione e l'esplorazione rapida dei colori. Per definire i valori finali di un brand system, si consiglia comunque di validare i colori nel proprio flusso di lavoro di progettazione",
    faq_title: "Domande e Risposte",
    faq2q: "Quali formati di immagine funzionano meglio ?",
    faq2a: "I formati comuni come PNG, JPG/JPEG e WebP funzionano molto bene. Le immagini più nitide, meno compresse e con il soggetto principale ben visibile tendono a generare palette più utili.",
    faq3q: "Perché il colore dominante a volte sembra diverso dall'oggetto principale ?",
    faq3a: "Perché lo strumento analizza la distribuzione complessiva dei pixel. Se l'immagine presenta un grande sfondo, ombre o aree neutre, queste regioni possono influenzare il risultato dominante più di un oggetto in evidenza più piccolo.",
    features_title: "Caratteristiche Principali",
    feature_1: "Identifica rapidamente i colori dominanti nelle immagini",
    feature_2: "Genera palette di colori da qualsiasi immagine",
    feature_3: "Estrai codici HEX con un singolo clic",
    feature_4: "Supporta formati come JPG, PNG e WebP",
    feature_5: "Elaborazione locale nel browser per una privacy totale",
    restart: "Ricomincia",
    dominant: "Colore dominante",
    palette: "Palette dell'immagine",
    see1: "Colori Casuali",
    see2: "Convertitore di Colori",
    see3: "Combinazione di Colori",
    see4: "Generatore di QR Code"
  },
  id: {
    pageTitle: "Ekstraktor Warna Gambar — Warna Dominan dan Palet | Gratis Online",
    ogTitle: "Ekstraktor Warna Gambar — Ekstrak Warna dari Foto Apapun",
    ogLocale: "id_ID",
    title: "Warna Gambar",
    intro: "Identifikasi profil warna gambar apapun dalam hitungan detik. Ekstraktor Warna kami menganalisis gambar secara lokal untuk mengekstrak warna dominan dan menghasilkan palet siap pakai. Unggah foto, tangkapan layar, ilustrasi, logo, atau gambar produk untuk mendapatkan kode HEX ideal untuk UI, branding, variabel CSS, moodboard, dan analisis visual.",
    meta: "Temukan profil warna gambar apapun dengan ekstraktor palet online gratis kami. Buat palet secara otomatis dari warna dominan gambar.",
    how_title: "Cara Penggunaan",
    step_1_t: "Unggah Gambar",
    step_1_d: "Unggah gambar yang ingin kamu analisis.",
    step_2_t: "Analisis Profil",
    step_2_d: "Alat ini akan menganalisis distribusi piksel untuk mengidentifikasi warna dominan dan mengekstrak warna yang paling banyak muncul dalam gambar.",
    step_3_t: "Salin Warna",
    step_3_d: "Klik sampel warna mana saja untuk menyalin kode HEX-nya.",
    apps_title: "Penggunaan Umum",
    app1: "Ekstrak palet dari logo, tangkapan layar, hero image, dan foto produk untuk membangun antarmuka yang selaras dengan identitas merek",
    app2: "Ambil kode HEX dari gambar referensi untuk menyusun brand board, presentasi, iklan, dan tata letak media sosial",
    app3: "Identifikasi warna latar belakang, sorotan, dan pendukung dari foto sebelum membuat landing page, banner, atau halaman ecommerce",
    app4: "Analisis karya seni, ilustrasi, dan gambar portofolio untuk memahami keseimbangan warna dan gaya visual suatu proyek",
    app5: "Gunakan ekstraksi palet dalam moodboard, referensi interior, riset mode, dan arahan kreatif ketika konsistensi visual sangat penting",
    tech_title: "Catatan Teknis",
    tech_desc: "Beberapa detail praktis memengaruhi cara warna yang diekstrak harus ditafsirkan dalam proyek nyata:",
    tech1: "Warna dominan tidak selalu yang paling penting secara visual. Latar belakang luas, bayangan, atau area netral bisa menempati lebih banyak ruang dalam gambar dibanding warna elemen utama, meskipun warna tersebut secara visual lebih mencolok",
    tech2: "Gambar dengan gradien, variasi pencahayaan, blur, atau kompresi dapat menghasilkan palet yang mendekati dan belum tentu nilai branding yang tepat",
    tech3: "Untuk palet yang lebih bersih dan konsisten, gunakan gambar yang dipotong untuk menonjolkan elemen utama, bukan komposisi penuh",
    tech4: "Alat ini ideal untuk ekstraksi dan eksplorasi warna secara cepat. Untuk menentukan nilai akhir sistem merek, tetap disarankan untuk memvalidasi warna dalam alur desain kamu",
    faq_title: "Pertanyaan Umum",
    faq2q: "Format gambar apa yang paling cocok?",
    faq2a: "Format umum seperti PNG, JPG/JPEG, dan WebP bekerja dengan baik. Gambar yang lebih bersih dengan kompresi lebih rendah dan subjek utama yang lebih jelas cenderung menghasilkan palet yang lebih berguna.",
    faq3q: "Mengapa warna dominan terkadang terlihat berbeda dari objek utama?",
    faq3a: "Karena alat ini menganalisis distribusi piksel secara keseluruhan. Jika gambar memiliki banyak latar belakang, bayangan, atau area netral, area-area tersebut dapat memengaruhi hasil dominan lebih dari objek kecil yang disorot.",
    features_title: "Fitur Utama",
    feature_1: "Identifikasi warna dominan gambar dengan cepat",
    feature_2: "Buat palet warna dari gambar apapun",
    feature_3: "Ekstrak kode HEX hanya dengan satu klik",
    feature_4: "Mendukung format seperti JPG, PNG, dan WebP",
    feature_5: "Pemrosesan lokal di browser untuk privasi penuh",
    restart: "Mulai Ulang",
    dominant: "Warna dominan",
    palette: "Palet gambar",
    see1: "Warna Acak",
    see2: "Konverter Warna",
    see3: "Kombinasi Warna",
    see4: "Generator Kode QR"
  },
  de: {
    pageTitle: "Bildfarben-Extraktor — Dominante Farbe und Palette | Kostenlos Online",
    ogTitle: "Bildfarben-Extraktor — Farben aus jedem Foto extrahieren",
    ogLocale: "de_DE",
    title: "Bildfarben",
    intro: "Identifiziere das Farbprofil eines beliebigen Bildes in Sekunden. Unser Farb-Extraktor analysiert deine Bilder lokal, um die dominante Farbe zu extrahieren und eine gebrauchsfertige Palette zu erstellen. Lade ein Foto, einen Screenshot, eine Illustration, ein Logo oder ein Produktbild hoch und erhalte HEX-Codes für UI, Branding, CSS-Variablen, Moodboards und visuelle Analyse.",
    meta: "Entdecke das Farbprofil eines beliebigen Bildes mit unserem kostenlosen Online-Palettenextraktor. Erstelle automatisch eine Palette mit den dominanten Farben des Bildes.",
    how_title: "So funktioniert es",
    step_1_t: "Bild hochladen",
    step_1_d: "Lade das Bild hoch, das du analysieren möchtest.",
    step_2_t: "Profil analysieren",
    step_2_d: "Das Tool analysiert die Pixelverteilung, um die dominante Farbe zu identifizieren und die am häufigsten vorhandenen Farben im Bild zu extrahieren.",
    step_3_t: "Farben kopieren",
    step_3_d: "Klicke auf ein beliebiges generiertes Farbfeld, um den HEX-Code zu kopieren.",
    apps_title: "Häufige Anwendungen",
    app1: "Extrahiere Paletten aus Logos, Screenshots, Hero-Images und Produktfotos, um Interfaces zu erstellen, die visuell zur Markenidentität passen",
    app2: "Erfasse HEX-Codes aus Referenzbildern für Brand Boards, Präsentationen, Anzeigen und Social-Media-Layouts",
    app3: "Identifiziere Hintergrund-, Highlight- und Unterstützungsfarben aus Fotos, bevor du Landing Pages, Banner oder E-Commerce-Seiten erstellst",
    app4: "Analysiere Kunstwerke, Illustrationen und Portfolio-Bilder, um die chromatische Balance und den visuellen Stil eines Projekts zu verstehen",
    app5: "Nutze die Palettenextraktion in Moodboards, Innenreferenzen, Modeforschung und kreativer Direktion, wenn visuelle Konsistenz entscheidend ist",
    tech_title: "Technische Hinweise",
    tech_desc: "Einige praktische Details beeinflussen, wie die extrahierten Farben in echten Projekten interpretiert werden sollten:",
    tech1: "Die dominante Farbe ist nicht immer die visuell wichtigste. Große Hintergründe, Schatten oder neutrale Bereiche können mehr Platz im Bild einnehmen als die Farben des Hauptmotivs, auch wenn diese visuell markanter sind",
    tech2: "Bilder mit Verläufen, Beleuchtungsvariationen, Unschärfe oder Kompression können ungefähre Paletten erzeugen und nicht unbedingt genaue Branding-Werte",
    tech3: "Für eine sauberere und konsistentere Palette verwende ein zugeschnittenes Bild, das das Hauptmotiv hervorhebt, anstatt der vollständigen Komposition",
    tech4: "Dieses Tool eignet sich ideal für schnelle Farbextraktion und -erkundung. Für die endgültige Definition von Werten in einem Markensystem empfiehlt es sich, die Farben in deinem Design-Workflow zu validieren",
    faq_title: "Häufig gestellte Fragen",
    faq2q: "Welche Bildformate funktionieren am besten?",
    faq2a: "Gängige Formate wie PNG, JPG/JPEG und WebP funktionieren gut. Sauberere Bilder mit weniger Kompression und einem klareren Hauptmotiv erzeugen in der Regel nützlichere Paletten.",
    faq3q: "Warum sieht die dominante Farbe manchmal anders aus als das Hauptmotiv?",
    faq3a: "Weil das Tool die gesamte Pixelverteilung analysiert. Wenn das Bild viel Hintergrund, Schatten oder neutrale Bereiche hat, können diese Regionen das dominante Ergebnis stärker beeinflussen als ein kleineres hervorgehobenes Objekt.",
    features_title: "Hauptfunktionen",
    feature_1: "Identifiziere schnell dominante Farben in Bildern",
    feature_2: "Erstelle Farbpaletten aus beliebigen Bildern",
    feature_3: "Extrahiere HEX-Codes mit einem einzigen Klick",
    feature_4: "Unterstützt Formate wie JPG, PNG und WebP",
    feature_5: "Lokale Verarbeitung im Browser für vollständige Privatsphäre",
    restart: "Neu starten",
    dominant: "Dominante Farbe",
    palette: "Bildpalette",
    see1: "Zufällige Farben",
    see2: "Farben-Konverter",
    see3: "Farbkombination",
    see4: "QR-Code-Generator"
  },
  nl: {
    pageTitle: "Beeldkleur Extractor — Dominante Kleur en Palet | Gratis Online",
    ogTitle: "Beeldkleur Extractor — Extraheer Kleuren uit Elke Foto",
    ogLocale: "nl_NL",
    title: "Beeldkleuren",
    intro: "Identificeer het kleurprofiel van een afbeelding in seconden. Onze Kleur Extractor analyseert afbeeldingen lokaal om de dominante kleur te extraheren en een gebruiksklaar palet te genereren. Upload een foto, screenshot, illustratie, logo of productafbeelding voor HEX-codes die ideaal zijn voor UI, branding, CSS-variabelen, moodboards en visuele analyse.",
    meta: "Ontdek het kleurprofiel van een afbeelding met onze gratis online palet extractor. Genereer automatisch een palet met de dominante kleuren van de afbeelding.",
    how_title: "Hoe Het Werkt",
    step_1_t: "Upload de Afbeelding",
    step_1_d: "Upload de afbeelding die je wilt analyseren.",
    step_2_t: "Analyseer het Profiel",
    step_2_d: "Het tool analyseert de pixelverdeling om de dominante kleur te identificeren en de meest aanwezige kleuren in de afbeelding te extraheren.",
    step_3_t: "Kopieer de Kleuren",
    step_3_d: "Klik op een gegenereerd kleurstaal om de HEX-code te kopiëren.",
    apps_title: "Veelvoorkomende Toepassingen",
    app1: "Extraheer paletten uit logo's, screenshots, hero images en productfoto's om interfaces te bouwen die visueel aansluiten bij de merkidentiteit",
    app2: "Leg HEX-codes vast uit referentieafbeeldingen voor brand boards, presentaties, advertenties en social media layouts",
    app3: "Identificeer achtergrond-, uitlicht- en ondersteunende kleuren uit foto's voordat je landing pages, banners of ecommerce-pagina's maakt",
    app4: "Analyseer kunstwerken, illustraties en portfolioafbeeldingen om de chromatische balans en visuele stijl van een project te begrijpen",
    app5: "Gebruik paletextractie in moodboards, interieurreferences, modeonderzoek en creatieve richting wanneer visuele consistentie essentieel is",
    tech_title: "Technische Opmerkingen",
    tech_desc: "Enkele praktische details beïnvloeden hoe geëxtraheerde kleuren in echte projecten geïnterpreteerd moeten worden:",
    tech1: "De dominante kleur is niet altijd de visueel belangrijkste. Grote achtergronden, schaduwen of neutrale gebieden kunnen meer ruimte innemen dan de kleuren van het hoofdonderwerp, ook al zijn die visueel opvallender",
    tech2: "Afbeeldingen met verlopen, belichtingsvariaties, onscherpte of compressie kunnen benaderende paletten opleveren en niet noodzakelijk exacte brandingwaarden",
    tech3: "Gebruik voor een schoner en consistenter palet een bijgesneden afbeelding die het hoofdonderwerp benadrukt in plaats van de volledige compositie",
    tech4: "Dit tool is ideaal voor snelle kleurextractie en verkenning. Voor het vastleggen van definitieve waarden in een merksysteem wordt aangeraden de kleuren te valideren in je ontwerpworkflow",
    faq_title: "Veelgestelde Vragen",
    faq2q: "Welke afbeeldingsformaten werken het beste?",
    faq2a: "Veelgebruikte formaten zoals PNG, JPG/JPEG en WebP werken goed. Schonere afbeeldingen met minder compressie en een duidelijker hoofdonderwerp leveren doorgaans nuttigere paletten op.",
    faq3q: "Waarom ziet de dominante kleur er soms anders uit dan het hoofdonderwerp?",
    faq3a: "Omdat het tool de algehele pixelverdeling analyseert. Als de afbeelding veel achtergrond, schaduwen of neutrale gebieden heeft, kunnen die regio's het dominante resultaat meer beïnvloeden dan een kleiner uitgelicht object.",
    features_title: "Belangrijkste Functies",
    feature_1: "Identificeer snel dominante kleuren in afbeeldingen",
    feature_2: "Genereer kleurenpaletten uit elke afbeelding",
    feature_3: "Extraheer HEX-codes met één klik",
    feature_4: "Ondersteunt formaten zoals JPG, PNG en WebP",
    feature_5: "Lokale verwerking in de browser voor volledige privacy",
    restart: "Opnieuw beginnen",
    dominant: "Dominante kleur",
    palette: "Afbeeldingspalet",
    see1: "Willekeurige Kleuren",
    see2: "Kleur Converter",
    see3: "Kleurencombinatie",
    see4: "QR-codegenerator"
  }
}
</i18n>

<style scoped>
.checkerboard {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 8 8'%3E%3Crect width='4' height='4' fill='%23888' fill-opacity='0.15'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23888' fill-opacity='0.15'/%3E%3C/svg%3E");
  background-repeat: repeat;
}
</style>
