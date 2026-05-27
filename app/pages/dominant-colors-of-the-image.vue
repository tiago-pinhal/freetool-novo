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
    t('feature_4')
  ],
  faq: [
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') },
    { question: t('faq4q'), answer: t('faq4a') }
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
    nl: '/dominante-kleuren-van-de-afbeelding',
    ru: '/cveta-iz-izobrazheniya'
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
          :items="[t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')]"
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
            { question: t('faq3q'), answer: t('faq3a') },
            { question: t('faq4q'), answer: t('faq4a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "Color Palette from Image — Photo & Picture Color Extractor | Free",
    ogTitle: "Color Palette Generator from Image — Extract Colors from Any Photo or Picture",
    ogLocale: "en_US",
    title: "Image Colors",
    intro: "Get the color palette of any image, photo, or illustration. Automatically detect the dominant color and generate a complete HEX palette from photos, screenshots, logos, illustrations, and product images.\n\nOur Color Extractor performs all processing directly in your browser, ensuring complete privacy and instant results. Ideal for UI/UX, branding, CSS variables, design systems, moodboards, and professional visual analysis.",
    meta: "Generate color palettes from any image, photo, or picture. Instantly discover the dominant color and the corresponding HEX palette.",
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
    faq4q: "How do I extract a color palette from a photo?",
    faq4a: "Click the upload area and select your photo, or drag and drop it directly. The tool instantly analyses the pixel distribution and extracts the dominant colour plus a full colour palette with HEX codes.",
    features_title: "Key Features",
    feature_1: "Quickly identify dominant colors in images",
    feature_2: "Generate color palettes from any image",
    feature_3: "Extract HEX codes with a single click",
    feature_4: "Supports formats like JPG, PNG and WebP",
    restart: "Start Over",
    dominant: "Dominant color",
    palette: "Image palette",
    see1: "Random Colors",
    see2: "Color Converter",
    see3: "Color Combination",
    see4: "QR Code Generator"
  },
  pt: {
    pageTitle: "Paleta de Cores de Imagem — Extrator de Cores de Foto e Imagem | Grátis",
    ogTitle: "Gerador de Paleta de Cores de Imagem — Extraia Cores de Qualquer Foto",
    ogLocale: "pt_BR",
    title: "Cores da Imagem",
    intro: "Obtenha a paleta de cores de qualquer imagem, foto ou ilustração. Detecte automaticamente a cor dominante e gere uma paleta HEX completa a partir de fotos, screenshots, logos, ilustrações e imagens de produtos.\n\nNosso Extrator de Cores realiza todo o processamento diretamente no seu navegador, garantindo total privacidade e resultados instantâneos. Ideal para UI/UX, branding, variáveis CSS, design systems, moodboards e análise visual profissional.",
    meta: "Gere paletas de cores a partir de qualquer imagem, foto ou figura. Descubra instantaneamente a cor dominante e a paleta HEX correspondente.",
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
    faq4q: "Como extrair uma paleta de cores de uma foto?",
    faq4a: "Clique na área de upload e selecione sua foto, ou arraste e solte diretamente. A ferramenta analisa instantaneamente a distribuição de pixels e extrai a cor dominante mais uma paleta completa com códigos HEX.",
    features_title: "Principais Recursos",
    feature_1: "Identifique rapidamente as cores dominantes em imagens",
    feature_2: "Gere paletas de cores a partir de qualquer imagem",
    feature_3: "Extraia códigos HEX com um único clique",
    feature_4: "Suporta formatos como JPG, PNG e WebP",
    restart: "Recomeçar",
    dominant: "Cor dominante",
    palette: "Paleta da imagem",
    see1: "Cores Aleatórias",
    see2: "Conversor de Cores",
    see3: "Combinação de Cores",
    see4: "Gerador de QR Code"
  },
  es: {
    pageTitle: "Paleta de Colores desde Imagen — Extractor de Colores de Foto | Gratis",
    ogTitle: "Generador de Paleta de Colores desde Imagen — Extrae Colores de Cualquier Foto",
    ogLocale: "es_ES",
    title: "Colores de la Imagen",
    intro: "Obtén la paleta de colores de cualquier imagen, foto o ilustración. Detecta automáticamente el color dominante y genera una paleta HEX completa a partir de fotos, capturas de pantalla, logotipos, ilustraciones e imágenes de productos.\n\nNuestro Extractor de Colores realiza todo el procesamiento directamente en tu navegador, garantizando total privacidad y resultados instantáneos. Ideal para UI/UX, branding, variables CSS, sistemas de diseño, moodboards y análisis visual profesional.",
    meta: "Genera paletas de colores a partir de cualquier imagen, foto o ilustración. Descubre al instante el color dominante y la paleta HEX correspondiente.",
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
    faq4q: "¿Cómo extraigo una paleta de colores de una foto?",
    faq4a: "Haz clic en el área de carga y selecciona tu foto, o arrástrala y suéltala directamente. La herramienta analizará al instante la distribución de píxeles y extraerá el color dominante más una paleta completa con códigos HEX.",
    features_title: "Características Principales",
    feature_1: "Identifica rápidamente los colores dominantes en imágenes",
    feature_2: "Genera paletas de colores a partir de cualquier imagen",
    feature_3: "Extrae códigos HEX con un solo clic",
    feature_4: "Compatible con formatos como JPG, PNG y WebP",
    restart: "Empezar de nuevo",
    dominant: "Color dominante",
    palette: "Paleta de la imagen",
    see1: "Colores Aleatorios",
    see2: "Convertidor de Colores",
    see3: "Combinación de Colores",
    see4: "Generador de QR Code"
  },
  fr: {
    pageTitle: "Palette de Couleurs depuis Image — Extracteur de Couleurs de Photo | Gratuit",
    ogTitle: "Générateur de Palette depuis Image — Extrayez les Couleurs de n'importe quelle Photo",
    ogLocale: "fr_FR",
    title: "Couleurs de l'Image",
    intro: "Obtenez la palette de couleurs de n'importe quelle image, photo ou illustration. Détectez automatiquement la couleur dominante et générez une palette HEX complète à partir de photos, captures d'écran, logos, illustrations et images de produits.\n\nNotre Extracteur de Couleurs effectue tout le traitement directement dans votre navigateur, garantissant une confidentialité totale et des résultats instantanés. Idéal pour l'UI/UX, le branding, les variables CSS, les design systems, les moodboards et l'analyse visuelle professionnelle.",
    meta: "Générez des palettes de couleurs à partir de n'importe quelle image, photo ou illustration. Découvrez instantanément la couleur dominante et la palette HEX correspondante.",
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
    faq4q: "Comment extraire une palette de couleurs depuis une photo ?",
    faq4a: "Cliquez sur la zone de téléversement et sélectionnez votre photo, ou glissez-déposez-la directement. L'outil analyse instantanément la distribution des pixels et extrait la couleur dominante ainsi qu'une palette complète avec codes HEX.",
    features_title: "Principaux Atouts",
    feature_1: "Identifiez rapidement les couleurs dominantes dans les images",
    feature_2: "Générez des palettes de couleurs à partir de n'importe quelle image",
    feature_3: "Extrayez des codes HEX en un seul clic",
    feature_4: "Prend en charge les formats comme JPG, PNG et WebP",
    restart: "Recommencer",
    dominant: "Couleur dominante",
    palette: "Palette de l'image",
    see1: "Couleurs Aléatoires",
    see2: "Convertisseur de Couleurs",
    see3: "Combinaison de Couleurs",
    see4: "Générateur de QR Code"
  },
  it: {
    pageTitle: "Palette di Colori da Immagine — Estrattore di Colori da Foto | Gratis",
    ogTitle: "Generatore di Palette da Immagine — Estrai Colori da Qualsiasi Foto o Immagine",
    ogLocale: "it_IT",
    title: "Colori dell'Immagine",
    intro: "Ottieni la palette di colori da qualsiasi immagine, foto o illustrazione. Rileva automaticamente il colore dominante e genera una palette HEX completa da foto, screenshot, loghi, illustrazioni e immagini di prodotti.\n\nIl nostro Estrattore di Colori esegue tutte le elaborazioni direttamente nel tuo browser, garantendo la totale privacy e risultati istantanei. Ideale per UI/UX, branding, variabili CSS, design system, moodboard e analisi visiva professionale.",
    meta: "Genera palette di colori da qualsiasi immagine, foto o illustrazione. Scopri istantaneamente il colore dominante e la palette HEX corrispondente.",
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
    faq3q: "Perché il colore dominante a volte sembra diverso dall'oggetto principale?",
    faq3a: "Perché lo strumento analizza la distribuzione complessiva dei pixel. Se l'immagine presenta un grande sfondo, ombre o aree neutre, queste regioni possono influenzare il risultato dominante più di un oggetto in evidenza più piccolo.",
    faq4q: "Come estraggo una palette di colori da una foto?",
    faq4a: "Clicca sull'area di caricamento e seleziona la tua foto, oppure trascinala e rilasciala direttamente. Lo strumento analizzerà istantaneamente la distribuzione dei pixel ed estrarrà il colore dominante più una palette completa con codici HEX.",
    features_title: "Caratteristiche Principali",
    feature_1: "Identifica rapidamente i colori dominanti nelle immagini",
    feature_2: "Genera palette di colori da qualsiasi immagine",
    feature_3: "Estrai codici HEX con un singolo clic",
    feature_4: "Supporta formati come JPG, PNG e WebP",
    restart: "Ricomincia",
    dominant: "Colore dominante",
    palette: "Palette dell'immagine",
    see1: "Colori Casuali",
    see2: "Convertitore di Colori",
    see3: "Combinazione di Colori",
    see4: "Generatore di QR Code"
  },
  id: {
    pageTitle: "Palet Warna dari Gambar — Ekstraktor Warna Foto & Gambar | Gratis",
    ogTitle: "Generator Palet Warna dari Gambar — Ekstrak Warna dari Foto atau Gambar Apapun",
    ogLocale: "id_ID",
    title: "Warna Gambar",
    intro: "Dapatkan palet warna dari gambar, foto, atau ilustrasi apa pun. Deteksi warna dominan secara otomatis dan hasilkan palet HEX lengkap dari foto, tangkapan layar, logo, ilustrasi, dan gambar produk.\n\nEkstraktor Warna kami melakukan semua pemrosesan langsung di browser Anda, memastikan privasi penuh dan hasil instan. Sangat cocok untuk UI/UX, branding, variabel CSS, sistem desain, moodboard, dan analisis visual profesional.",
    meta: "Hasilkan palet warna dari gambar, foto, atau ilustrasi apa pun. Temukan warna dominan dan palet HEX yang sesuai secara instan.",
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
    faq4q: "Bagaimana cara mengekstrak palet warna dari foto?",
    faq4a: "Klik area unggah dan pilih foto Anda, atau seret dan lepas langsung ke area tersebut. Alat ini akan langsung menganalisis distribusi piksel dan mengekstrak warna dominan beserta palet lengkap dengan kode HEX.",
    features_title: "Fitur Utama",
    feature_1: "Identifikasi warna dominan gambar dengan cepat",
    feature_2: "Buat palet warna dari gambar apapun",
    feature_3: "Ekstrak kode HEX hanya dengan satu klik",
    feature_4: "Mendukung format seperti JPG, PNG, dan WebP",
    restart: "Mulai Ulang",
    dominant: "Warna dominan",
    palette: "Palet gambar",
    see1: "Warna Acak",
    see2: "Konverter Warna",
    see3: "Kombinasi Warna",
    see4: "Generator Kode QR"
  },
  de: {
    pageTitle: "Farbpalette aus Bild — Foto & Bild Farb-Extraktor | Kostenlos",
    ogTitle: "Farbpaletten-Generator aus Bild — Farben aus Foto oder Bild extrahieren",
    ogLocale: "de_DE",
    title: "Bildfarben",
    intro: "Holen Sie sich die Farbpalette von jedem Bild, Foto oder jeder Illustration. Erkennen Sie automatisch die dominante Farbe und generieren Sie eine vollständige HEX-Palette aus Fotos, Screenshots, Logos, Illustrationen und Produktbildern.\n\nUnser Farb-Extraktor führt die gesamte Verarbeitung direkt in Ihrem Browser durch und garantiert so absolute Privatsphäre und sofortige Ergebnisse. Ideal für UI/UX, Branding, CSS-Variablen, Design-Systeme, Moodboards und professionelle visuelle Analysen.",
    meta: "Generieren Sie Farbpaletten aus jedem Bild, Foto oder jeder Illustration. Entdecken Sie sofort die dominante Farbe und die entsprechende HEX-Palette.",
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
    faq4q: "Wie extrahiere ich eine Farbpalette aus einem Foto?",
    faq4a: "Klicke auf den Upload-Bereich und wähle dein Foto aus, oder ziehe es direkt per Drag & Drop hinein. Das Tool analysiert sofort die Pixelverteilung und extrahiert die dominante Farbe sowie eine vollständige Farbpalette mit HEX-Codes.",
    features_title: "Hauptfunktionen",
    feature_1: "Identifiziere schnell dominante Farben in Bildern",
    feature_2: "Erstelle Farbpaletten aus beliebigen Bildern",
    feature_3: "Extrahiere HEX-Codes mit einem einzigen Klick",
    feature_4: "Unterstützt Formate wie JPG, PNG und WebP",
    restart: "Neu starten",
    dominant: "Dominante Farbe",
    palette: "Bildpalette",
    see1: "Zufällige Farben",
    see2: "Farben-Konverter",
    see3: "Farbkombination",
    see4: "QR-Code-Generator"
  },
  nl: {
    pageTitle: "Kleurenpalet van Afbeelding — Foto & Afbeelding Kleur Extractor | Gratis",
    ogTitle: "Kleurenpalet Generator van Afbeelding — Extraheer Kleuren uit Elke Foto",
    ogLocale: "nl_NL",
    title: "Beeldkleuren",
    intro: "Ontvang het kleurenpalet van elke afbeelding, foto of illustratie. Detecteer automatisch de dominante kleur en genereer een compleet HEX-palet van foto's, screenshots, logo's, illustraties en productafbeeldingen.\n\nOnze Kleurenextractor voert alle verwerkingen rechtstreeks in uw browser uit, wat zorgt voor volledige privacy en onmiddellijke resultaten. Ideaal voor UI/UX, branding, CSS-variabelen, ontwerpsystemen, moodboards en professionele visuele analyse.",
    meta: "Genereer kleurenpaletten van elke afbeelding, foto of illustratie. Ontdek direct de dominante kleur en het bijbehorende HEX-palet.",
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
    faq4q: "Hoe extraheer ik een kleurenpalet uit een foto?",
    faq4a: "Klik op het uploadgebied en selecteer je foto, of sleep en zet hem er direct in neer. Het tool analyseert direct de pixelverdeling en extraheert de dominante kleur samen met een volledig kleurenpalet met HEX-codes.",
    features_title: "Belangrijkste Functies",
    feature_1: "Identificeer snel dominante kleuren in afbeeldingen",
    feature_2: "Genereer kleurenpaletten uit elke afbeelding",
    feature_3: "Extraheer HEX-codes met één klik",
    feature_4: "Ondersteunt formaten zoals JPG, PNG en WebP",
    restart: "Opnieuw beginnen",
    dominant: "Dominante kleur",
    palette: "Afbeeldingspalet",
    see1: "Willekeurige Kleuren",
    see2: "Kleur Converter",
    see3: "Kleurencombinatie",
    see4: "QR-codegenerator"
  },
  ru: {
    pageTitle: "Цветовая палитра из изображения — извлечь цвета из фото онлайн | Бесплатно",
    ogTitle: "Генератор цветовой палитры по изображению — извлечь цвета из любой фотографии",
    ogLocale: "ru_RU",
    title: "Цвета из изображения",
    intro: "Получите цветовую палитру любого изображения, фотографии или иллюстрации. Автоматически определяйте доминирующий цвет и создавайте полноценную HEX-палитру из фотографий, скриншотов, логотипов и изображений товаров.\n\nНаш инструмент выполняет всю обработку прямо в вашем браузере, обеспечивая полную конфиденциальность и мгновенный результат. Идеально для UI/UX-дизайна, брендинга, CSS-переменных, дизайн-систем и профессионального визуального анализа.",
    meta: "Генерируйте цветовые палитры из любого изображения, фотографии или рисунка. Мгновенно определяйте доминирующий цвет и соответствующую HEX-палитру.",
    how_title: "Как это работает",
    step_1_t: "Загрузите изображение",
    step_1_d: "Загрузите или перетащите изображение, которое вы хотите проанализировать.",
    step_2_t: "Анализ пикселей",
    step_2_d: "Инструмент проанализирует распределение пикселей, чтобы определить преобладающий цвет и извлечь наиболее часто встречающиеся цвета.",
    step_3_t: "Скопируйте цвета",
    step_3_d: "Кликните на любую сгенерированную плитку цвета, чтобы скопировать ее HEX-код.",
    apps_title: "Практическое применение",
    app1: "Извлекайте палитры из логотипов, скриншотов и фото товаров для создания интерфейсов, визуально соответствующих стилю бренда",
    app2: "Копируйте HEX-коды из референсных изображений для создания презентаций, рекламы и макетов для соцсетей",
    app3: "Определяйте фоновые, акцентные и поддерживающие цвета по фотографиям перед версткой лендингов или баннеров",
    app4: "Анализируйте иллюстрации и портфолио для понимания цветового баланса и визуального стиля проекта",
    app5: "Используйте извлечение палитр для мудбордов, дизайна интерьеров и творческого поиска, когда важна гармония",
    tech_title: "Технические примечания",
    tech_desc: "Несколько практических деталей, влияющих на интерпретацию извлеченных цветов в реальных проектах:",
    tech1: "Доминирующий цвет не всегда является самым важным визуально. Большой фон или тени могут занимать больше площади, чем основной элемент, даже если он выглядит ярче",
    tech2: "Изображения с градиентами, размытием или сильным сжатием могут давать примерную палитру, а не точные брендовые значения",
    tech3: "Для получения более чистой палитры загружайте обрезанный фрагмент с главным элементом вместо полной композиции",
    tech4: "Инструмент идеален для быстрого подбора. Для финального утверждения в бренд-буке рекомендуется проверять цвета вручную",
    faq_title: "Часто задаваемые вопросы",
    faq2q: "Какие форматы изображений поддерживаются?",
    faq2a: "Любые популярные форматы: PNG, JPG/JPEG и WebP. Изображения с хорошей четкостью и четким объектом дают наилучший результат.",
    faq3q: "Почему доминирующий цвет иногда отличается от цвета главного объекта?",
    faq3a: "Потому что алгоритм анализирует общее количество пикселей. Огромный фон или тени могут повлиять на результат сильнее, чем маленький яркий объект.",
    faq4q: "Как извлечь цветовую палитру из фотографии?",
    faq4a: "Нажмите на область загрузки и выберите фото или перетащите его мышкой. Инструмент мгновенно проанализирует распределение пикселей и выведет доминирующий цвет и HEX-палитру.",
    features_title: "Основные возможности",
    feature_1: "Быстрое определение доминирующего цвета на картинке",
    feature_2: "Создание цветовой палитры из любого файла",
    feature_3: "Копирование HEX-кодов в один клик",
    feature_4: "Поддержка форматов JPG, PNG и WebP",
    restart: "Начать заново",
    dominant: "Доминирующий цвет",
    palette: "Палитра изображения",
    see1: "Случайные цвета",
    see2: "Конвертер цветов",
    see3: "Цветовые комбинации",
    see4: "Генератор QR-кодов"
  }
}
</i18n>

<style scoped>
.checkerboard {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 8 8'%3E%3Crect width='4' height='4' fill='%23888' fill-opacity='0.15'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23888' fill-opacity='0.15'/%3E%3C/svg%3E");
  background-repeat: repeat;
}
</style>
