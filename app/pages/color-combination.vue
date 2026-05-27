<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import Color from '~/components/Color.vue'

const { t, locale } = useI18n({ useScope: 'local' })

const state = reactive({
  color: '#3b82f6',
  format: 'toHexString',
  combinations: ['analogous', 'monochromatic', 'splitcomplement', 'triad', 'tetrad', 'complement']
})

const stateColors = reactive<Record<string, string[]>>({
  analogous: [],
  monochromatic: [],
  splitcomplement: [],
  triad: [],
  tetrad: [],
  complement: []
})

const palettes = ['analogous', 'monochromatic', 'splitcomplement', 'triad', 'tetrad', 'complement']
const formats = [
  { value: 'toHexString', label: 'HEX' },
  { value: 'toHex8String', label: 'HEX 8' },
  { value: 'toRgbString', label: 'RGB' },
  { value: 'toPercentageRgb', label: 'RGB %' },
  { value: 'toHsvString', label: 'HSV' },
  { value: 'toHslString', label: 'HSL' }
]

const showAds = ref(false)
const colorText = ref(state.color)

watch(() => state.color, (val) => { colorText.value = val })

function applyColorText() {
  const tc = (window as any).tinycolor
  if (tc && tc(colorText.value).isValid()) {
    state.color = tc(colorText.value).toHexString()
  } else {
    colorText.value = state.color
  }
}

const { status: tcStatus } = useScript('https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/tinycolor.js', { trigger: 'client' })
const tcLoaded = computed(() => tcStatus.value === 'loaded')

watch(() => [state.color, state.format], () => generate(true), { deep: true })
watch(tcLoaded, (loaded) => { if (loaded) generate(false) }, { immediate: true })

function generate(isAds: boolean) {
  if (!tcLoaded.value) return
  const tc = (window as any).tinycolor
  const base = tc(state.color)

  stateColors.analogous = base.analogous().map((c: any) => c[state.format]())
  stateColors.monochromatic = base.monochromatic().map((c: any) => c[state.format]())
  stateColors.splitcomplement = base.splitcomplement().map((c: any) => c[state.format]())
  stateColors.triad = base.triad().map((c: any) => c[state.format]())
  stateColors.tetrad = base.tetrad().map((c: any) => c[state.format]())
  stateColors.complement = [base.complement()[state.format]()]

  if (isAds) showAds.value = true
}

// --- SEO ---
usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  faq: [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') },
    { question: t('faq4q'), answer: t('faq4a') },
    { question: t('faq5q'), answer: t('faq5a') }
  ],
})

useHead({
  htmlAttrs: { lang: locale.value },
  title: t('pageTitle'),
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:title', content: t('ogTitle') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: t('ogLocale') },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: t('ogTitle') },
    { name: 'twitter:description', content: t('meta') }
  ]
})

defineI18nRoute({
  paths: {
    en: '/color-combination',
    pt: '/combinacao-de-cores',
    es: '/combinacion-de-colores',
    fr: '/combinaison-de-couleurs',
    it: '/combinazione-di-colori',
    id: '/kombinasi-warna',
    de: '/farbkombination',
    nl: '/kleurcombinatie',
    ru: '/kombinaciya-cvetov'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('intro')"
    :show-ads="showAds"
    :info-description="t('about_desc')"
    :see-also-links="[
      { label: t('see1'), to: 'random-colors' },
      { label: t('see2'), to: 'dominant-colors-of-the-image' },
      { label: t('see3'), to: 'color-converter' },
      { label: t('see4'), to: 'qrcode-generator' }
    ]"
  >
    <div class="flex flex-col py-8 w-full max-w-2xl mx-auto">
      <div class="flex flex-wrap items-end gap-3 mb-6">
        <div class="grid min-w-[120px] flex-1">
          <label for="base-color" class="text-xs text-base-content/60 mb-1 font-medium">{{ t('optColor') }}:</label>
          <div class="flex gap-1.5">
            <input id="base-color" type="color" v-model="state.color" class="input input-bordered input-sm h-[32px] w-10 p-0.5 cursor-pointer flex-none" />
            <input
              type="text"
              v-model="colorText"
              @blur="applyColorText"
              @keydown.enter="applyColorText"
              class="input input-bordered input-sm w-full font-mono"
              placeholder="#000000"
              maxlength="25"
            />
          </div>
        </div>
        <div class="grid min-w-[120px] flex-1">
          <label for="fmt" class="text-xs text-base-content/60 mb-1 font-medium">{{ t('format') }}:</label>
          <select id="fmt" v-model="state.format" class="select select-bordered select-sm w-full">
            <option v-for="f in formats" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-xs text-base-content/60 mb-2 font-medium">{{ t('optPalettes') }}:</p>
        <div class="flex flex-wrap gap-x-2.5 gap-y-2">
          <label
            v-for="p in palettes"
            :key="p"
            class="flex items-center gap-2 px-3 py-1.5 border rounded-full cursor-pointer select-none transition-all duration-200"
            :class="state.combinations.includes(p) ? 'border-primary/40 bg-primary/5 hover:bg-primary/10' : 'border-base-content/10 bg-base-200/30 hover:bg-base-200/70'"
          >
            <input
              type="checkbox"
              :value="p"
              v-model="state.combinations"
              class="checkbox checkbox-sm checkbox-primary"
            />
            <span class="text-sm font-medium" :class="state.combinations.includes(p) ? 'text-primary' : 'text-base-content/80'">{{ t(p) }}</span>
          </label>
        </div>
      </div>

      <div class="flex flex-col gap-6 mt-2">
        <template v-for="palette in palettes" :key="palette">
          <div v-show="state.combinations.includes(palette)">
            <p class="text-sm font-semibold mb-2 text-base-content/80">{{ t(palette) }}</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(color, i) in stateColors[palette]"
                :key="palette + i"
                class="relative h-16 rounded overflow-hidden"
                style="min-width: 7rem; flex: 1 1 7rem;"
              >
                <Color :color="color" class="w-full h-full" />
              </div>
            </div>
          </div>
        </template>
      </div>

    </div>

    <template #info>
      <div class="space-y-8">
        <HowToSection
          :title="t('how_title')"
          :items="[
            { title: t('step_1_t'), description: t('step_1_d') },
            { title: t('step_2_t'), description: t('step_2_d') },
            { title: t('step_3_t'), description: t('step_3_d') },
            { title: t('step_4_t'), description: t('step_4_d') }
          ]"
        />

        <FeatureSection
          :title="t('features_title')"
          :items="[t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')]"
        />

        <UseCaseSection
          :title="t('apps_title')"
          :items="[
            { title: t('app1_t'), description: t('app1_d') },
            { title: t('app2_t'), description: t('app2_d') },
            { title: t('app3_t'), description: t('app3_d') },
            { title: t('app4_t'), description: t('app4_d') },
            { title: t('app5_t'), description: t('app5_d') },
            { title: t('app6_t'), description: t('app6_d') }
          ]"
        />

        <section class="pt-2">
          <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Icon name="heroicons:swatch-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('palettes_title') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="p in [
              { key: 'analogous', d: 'analog_d' },
              { key: 'monochromatic', d: 'mono_d' },
              { key: 'splitcomplement', d: 'split_d' },
              { key: 'triad', d: 'triad_d' },
              { key: 'tetrad', d: 'tetrad_d' },
              { key: 'complement', d: 'compl_d' }
            ]" :key="p.key" class="rounded-xl border border-base-content/10 bg-base-200/30 p-4">
              <p class="font-semibold text-sm text-base-content mb-1.5">{{ t(p.key) }}</p>
              <p class="text-sm text-base-content/65 leading-relaxed">{{ t(p.d) }}</p>
            </div>
          </div>
        </section>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq1q'), answer: t('faq1a') },
            { question: t('faq2q'), answer: t('faq2a') },
            { question: t('faq3q'), answer: t('faq3a') },
            { question: t('faq4q'), answer: t('faq4a') },
            { question: t('faq5q'), answer: t('faq5a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    pageTitle: "Gerador de Combinação de Cores — Complementares, Análogas e Triádicas | Grátis",
    ogTitle: "Gerador de Combinação de Cores: Paletas Online Grátis pela Teoria das Cores",
    ogLocale: "pt_BR",
    title: "Combinação de Cores",
    intro: "Gere paletas de cores harmoniosas a partir de qualquer cor base. Explore combinações complementares, análogas, monocromáticas, triádicas e tetrádicas em HEX, RGB, HSL e outros formatos. Clique em qualquer cor para copiá-la.",
    meta: "Gerador gratuito de combinação de cores baseado na teoria das cores. Explore paletas complementares, análogas, triádicas e monocromáticas a partir de qualquer cor base em HEX, RGB ou HSL.",
    about_desc: "Esta ferramenta gera paletas de cores baseadas na teoria das cores a partir de qualquer cor que você escolher. Ela calcula automaticamente seis tipos de combinações (análoga, monocromática, complementar dividida, triádica, tetrádica e complementar) e exibe os resultados em tempo real conforme você ajusta a cor base ou o formato de saída. Útil para criar sistemas de cores coesos para UI, branding e projetos gráficos.",
    optColor: "Cor Base",
    optPalettes: "Combinações visíveis",
    format: "Formato",
    analogous: "Análoga",
    analog_d: "Use quando quiser um visual calmo e coeso. Ótima para fundos, landing pages e marcas que transmitem equilíbrio",
    monochromatic: "Monocromática",
    mono_d: "Perfeita para criar hierarquia sem introduzir novas cores. Ideal para textos, botões e estados de hover",
    splitcomplement: "Complementar Dividida",
    split_d: "Bom meio-termo entre contraste e suavidade. Funciona bem em interfaces com mais de um elemento de destaque",
    triad: "Triádica",
    triad_d: "Escolha para projetos que precisam de energia e diversidade. Funciona bem em dashboards e materiais de marketing",
    tetrad: "Tetrádica",
    tetrad_d: "Indicada para sistemas de design complexos com múltiplas categorias ou seções visualmente distintas",
    complement: "Complementar",
    compl_d: "Ideal quando você precisa de impacto imediato. Ótima para CTAs, badges de alerta e elementos que precisam chamar atenção",
    how_title: "Como Usar este Gerador de Paletas de Cores",
    step_1_t: "Escolha uma cor base",
    step_1_d: "Clique no seletor de cor e escolha qualquer cor como ponto de partida. Pode ser a cor principal da sua marca, um tom que você quer explorar ou qualquer cor que já tenha em mãos",
    step_2_t: "Selecione o formato de saída",
    step_2_d: "Escolha entre os formatos disponíveis: HEX, HEX 8, RGB, RGB %, HSV ou HSL",
    step_3_t: "Ative as combinações desejadas",
    step_3_d: "Use os checkboxes para exibir apenas os tipos de paleta que desejar, como análoga, monocromática, complementar, triádica, tetrádica ou complementar dividida",
    step_4_t: "Copie qualquer cor",
    step_4_d: "Clique em qualquer cor da paleta para copiar seu código equivalente",
    features_title: "Recursos",
    feature_1: "Seis tipos de combinações: análoga, monocromática, complementar dividida, triádica, tetrádica e complementar",
    feature_2: "Suporte a HEX, HEX8, RGB, RGB%, HSV e HSL",
    feature_3: "Clique em qualquer cor para copiar o valor instantaneamente",
    feature_4: "Filtre quais paletas exibir conforme sua necessidade",
    apps_title: "Aplicações Práticas",
    app1_t: "Paletas de UI e sistemas de design",
    app1_d: "Crie paletas coesas a partir de uma cor de marca, explorando tons que combinam naturalmente pelo círculo cromático",
    app2_t: "Marketing e materiais visuais",
    app2_d: "Escolha esquemas de cores para apresentações, posters e materiais de marketing com harmonia garantida pela teoria das cores",
    app3_t: "Front-end e CSS",
    app3_d: "Copie valores em HEX, RGB ou HSL diretamente para o seu CSS, escolhendo a paleta que melhor se adapta ao projeto sem precisar calcular as cores manualmente",
    app4_t: "Redesign e prototipagem",
    app4_d: "Teste diferentes teorias de cores em redesigns de interface antes de definir o sistema de design final",
    app5_t: "Ilustração e identidade visual",
    app5_d: "Explore paletas monocromáticas ou análogas para ilustrações, ícones e elementos visuais consistentes",
    app6_t: "Design de interiores",
    app6_d: "Componha paletas harmoniosas para ambientes, escolhendo cores de paredes, móveis e revestimentos que combinam entre si pela teoria das cores",
    palettes_title: "Tipos de Paletas Disponíveis",
    faq_title: "Perguntas e Respostas",
    faq1q: "Qual a diferença entre paleta análoga e monocromática?",
    faq1a: "A paleta análoga usa cores vizinhas no círculo cromático, criando uma sensação de harmonia com leve variação de cor. Já a monocromática usa diferentes saturações e luminosidades da mesma cor, resultando em um visual mais uniforme e elegante.",
    faq2q: "Qual formato devo escolher: HEX, RGB ou HSL?",
    faq2a: "HEX é o mais prático para CSS e handoff de design. RGB ou RGBA é melhor quando você precisa de transparência. HSL é mais intuitivo para ajustes manuais de luminosidade e saturação sem mudar o tom.",
    faq3q: "Posso usar essa ferramenta para criar paletas pastel?",
    faq3a: "Sim. Escolha uma cor base clara e suave no seletor e as combinações geradas seguirão a mesma faixa de luminosidade. As paletas Análoga e Monocromática funcionam especialmente bem para resultados pastéis.",
    faq4q: "Por que a paleta Complementar exibe apenas uma cor?",
    faq4a: "A cor complementar é única por definição: é a cor diretamente oposta à cor base no círculo cromático. As demais paletas (Análoga, Triádica, etc.) retornam múltiplas cores porque utilizam relações de ângulo que geram conjuntos. A Complementar retorna somente um resultado.",
    faq5q: "O que são cores complementares?",
    faq5a: "Cores complementares são pares de cores posicionadas diretamente opostas no círculo cromático. Quando colocadas lado a lado, criam forte contraste e tensão visual — tornando cada cor mais vibrante. Pares comuns incluem azul/laranja, vermelho/verde e amarelo/violeta. Esta ferramenta gera automaticamente a cor complementar para qualquer cor base escolhida.",
    see1: "Cores Aleatórias",
    see2: "Cores da Imagem",
    see3: "Conversor de Cores",
    see4: "Gerador de QR Code"
  },
  en: {
    pageTitle: "Color Combination Generator — Complementary, Analogous & Triadic | Free",
    ogTitle: "Color Combination Generator: Free Colour Theory Palette Tool",
    ogLocale: "en_US",
    title: "Color Combination",
    intro: "Generate harmonious color palettes from any base colour. Explore complementary, analogous, monochromatic, triadic and tetradic combinations in HEX, RGB, HSL and more. Click any colour to copy it.",
    meta: "Free colour combination generator based on colour theory. Explore complementary, analogous, triadic and monochromatic palettes from any base colour in HEX, RGB or HSL.",
    about_desc: "This tool generates color palettes based on color theory from any color you choose. It automatically calculates six types of combinations (analogous, monochromatic, split-complementary, triadic, tetradic and complementary) and displays the results in real time as you adjust the base color or output format. Useful for building cohesive color systems for UI, branding and graphic projects.",
    optColor: "Base Color",
    optPalettes: "Visible combinations",
    format: "Format",
    analogous: "Analogous",
    analog_d: "Use when you want a calm and cohesive look. Great for backgrounds, landing pages and brands that convey balance",
    monochromatic: "Monochromatic",
    mono_d: "Perfect for creating hierarchy without introducing new colors. Ideal for text, buttons and hover states",
    splitcomplement: "Split-Complementary",
    split_d: "A good middle ground between contrast and softness. Works well in interfaces with more than one focal element",
    triad: "Triadic",
    triad_d: "Choose for projects that need energy and diversity. Works well in dashboards and marketing materials",
    tetrad: "Tetradic",
    tetrad_d: "Suited for complex design systems with multiple categories or visually distinct sections",
    complement: "Complementary",
    compl_d: "Ideal when you need immediate visual impact. Great for CTAs, alert badges and elements that need to stand out",
    how_title: "How to Use this Color Palette Generator",
    step_1_t: "Pick a base color",
    step_1_d: "Click the color picker and choose any color as your starting point. It can be your brand's primary color, a tone you want to explore, or any color you already have in mind",
    step_2_t: "Select the output format",
    step_2_d: "Choose from the available formats: HEX, HEX 8, RGB, RGB %, HSV or HSL",
    step_3_t: "Enable the desired combinations",
    step_3_d: "Use the checkboxes to show only the palette types you need, such as analogous, monochromatic, complementary, triadic, tetradic or split-complementary",
    step_4_t: "Copy any color",
    step_4_d: "Click any color swatch to copy its value to your clipboard",
    features_title: "Features",
    feature_1: "Six combination types: analogous, monochromatic, split-complementary, triadic, tetradic and complementary",
    feature_2: "Supports HEX, HEX8, RGB, RGB%, HSV and HSL",
    feature_3: "Click any color to copy its value instantly",
    feature_4: "Filter which palettes to display based on your needs",
    apps_title: "Practical Applications",
    app1_t: "UI palettes and design systems",
    app1_d: "Build cohesive palettes from a brand color, exploring tones that naturally harmonize through the color wheel",
    app2_t: "Marketing and visual materials",
    app2_d: "Choose color schemes for presentations, posters and marketing materials with harmony guaranteed by color theory",
    app3_t: "Front-end and CSS",
    app3_d: "Copy HEX, RGB or HSL values directly into your CSS, choosing the palette that best fits your project without calculating colors manually",
    app4_t: "Redesign and prototyping",
    app4_d: "Test different color theories in interface redesigns before finalizing your design system",
    app5_t: "Illustration and visual identity",
    app5_d: "Explore monochromatic or analogous palettes for illustrations, icons and consistent visual elements",
    app6_t: "Interior design",
    app6_d: "Compose harmonious palettes for spaces, choosing wall colors, furniture and finishes that work together through color theory",
    palettes_title: "Supported Palette Types",
    faq_title: "Questions and Answers",
    faq1q: "What is the difference between analogous and monochromatic palettes?",
    faq1a: "An analogous palette uses neighboring colors on the color wheel, creating a sense of harmony with slight color variation. A monochromatic palette uses different saturations and lightness values of the same color, resulting in a more uniform and elegant look.",
    faq2q: "Which format should I choose: HEX, RGB or HSL?",
    faq2a: "HEX is the most practical for CSS and design handoff. RGB or RGBA is better when you need transparency. HSL is more intuitive for manually adjusting lightness and saturation without changing the hue.",
    faq3q: "Can I use this tool to create pastel palettes?",
    faq3a: "Yes. Choose a light and soft base color in the picker and the generated combinations will follow the same lightness range. The Analogous and Monochromatic palettes work especially well for pastel results.",
    faq4q: "Why does the Complementary palette show only one color?",
    faq4a: "The complementary color is unique by definition: it is the color directly opposite the base color on the color wheel. Other palettes (Analogous, Triadic, etc.) return multiple colors because they use angular relationships that produce sets. Complementary always returns a single result.",
    faq5q: "What are complementary colors?",
    faq5a: "Complementary colors are pairs of colors positioned directly opposite each other on the color wheel. When placed side by side, they create strong contrast and visual tension — making each color appear more vibrant. Common complementary pairs include blue/orange, red/green, and yellow/violet. This tool automatically generates the complementary color for any base color you choose.",
    see1: "Random Colors",
    see2: "Image Colors",
    see3: "Color Converter",
    see4: "QR Code Generator"
  },
  es: {
    pageTitle: "Generador de Combinación de Colores — Complementarios, Análogos y Triádicos | Gratis",
    ogTitle: "Generador de Combinación de Colores: Paletas por Teoría del Color | Gratis",
    ogLocale: "es_ES",
    title: "Combinación de Colores",
    intro: "Genera paletas de colores armoniosas a partir de cualquier color base. Explora combinaciones complementarias, análogas, monocromáticas, triádicas y tetrádicas en HEX, RGB, HSL y más. Haz clic en cualquier color para copiarlo.",
    meta: "Generador gratuito de combinación de colores basado en la teoría del color. Explora paletas complementarias, análogas, triádicas y monocromáticas desde cualquier color base en HEX, RGB o HSL.",
    about_desc: "Esta herramienta genera paletas de colores basadas en la teoría del color a partir de cualquier color que elijas. Calcula automáticamente seis tipos de combinaciones (análoga, monocromática, complementaria dividida, triádica, tetrádica y complementaria) y muestra los resultados en tiempo real mientras ajustas el color base o el formato de salida. Útil para crear sistemas de color cohesivos para UI, branding y proyectos gráficos.",
    optColor: "Color Base",
    optPalettes: "Combinaciones visibles",
    format: "Formato",
    analogous: "Análoga",
    analog_d: "Úsala cuando quieras un aspecto tranquilo y cohesivo. Ideal para fondos, landing pages y marcas que transmiten equilibrio",
    monochromatic: "Monocromática",
    mono_d: "Perfecta para crear jerarquía sin introducir nuevos colores. Ideal para textos, botones y estados hover",
    splitcomplement: "Complementaria Dividida",
    split_d: "Un buen punto medio entre contraste y suavidad. Funciona bien en interfaces con más de un elemento destacado",
    triad: "Triádica",
    triad_d: "Elige para proyectos que necesitan energía y diversidad. Funciona bien en dashboards y materiales de marketing",
    tetrad: "Tetrádica",
    tetrad_d: "Indicada para sistemas de diseño complejos con múltiples categorías o secciones visualmente distintas",
    complement: "Complementaria",
    compl_d: "Ideal cuando necesitas impacto visual inmediato. Perfecta para CTAs, badges de alerta y elementos que deben destacar",
    how_title: "Cómo Usar este Generador de Paletas de Colores",
    step_1_t: "Elige un color base",
    step_1_d: "Haz clic en el selector de color y elige cualquier color como punto de partida. Puede ser el color principal de tu marca, un tono que quieras explorar o cualquier color que ya tengas en mente",
    step_2_t: "Selecciona el formato de salida",
    step_2_d: "Elige entre los formatos disponibles: HEX, HEX 8, RGB, RGB %, HSV o HSL",
    step_3_t: "Activa las combinaciones deseadas",
    step_3_d: "Usa los checkboxes para mostrar solo los tipos de paleta que necesites, como análoga, monocromática, complementaria, triádica, tetrádica o complementaria dividida",
    step_4_t: "Copia cualquier color",
    step_4_d: "Haz clic en cualquier muestra de color para copiar su valor al portapapeles",
    features_title: "Características",
    feature_1: "Seis tipos de combinaciones: análoga, monocromática, complementaria dividida, triádica, tetrádica y complementaria",
    feature_2: "Compatible con HEX, HEX8, RGB, RGB%, HSV y HSL",
    feature_3: "Haz clic en cualquier color para copiar su valor al instante",
    feature_4: "Filtra qué paletas mostrar según tus necesidades",
    apps_title: "Aplicaciones Prácticas",
    app1_t: "Paletas de UI y sistemas de diseño",
    app1_d: "Crea paletas cohesivas a partir de un color de marca, explorando tonos que armonizan naturalmente a través del círculo cromático",
    app2_t: "Marketing y materiales visuales",
    app2_d: "Elige esquemas de color para presentaciones, posters y materiales de marketing con armonía garantizada por la teoría del color",
    app3_t: "Front-end y CSS",
    app3_d: "Copia valores en HEX, RGB o HSL directamente en tu CSS, eligiendo la paleta que mejor se adapte al proyecto sin calcular los colores manualmente",
    app4_t: "Rediseño y prototipado",
    app4_d: "Prueba diferentes teorías de color en rediseños de interfaz antes de definir el sistema de diseño final",
    app5_t: "Ilustración e identidad visual",
    app5_d: "Explora paletas monocromáticas o análogas para ilustraciones, iconos y elementos visuales consistentes",
    app6_t: "Diseño de interiores",
    app6_d: "Compón paletas armoniosas para espacios, eligiendo colores de paredes, muebles y revestimientos que combinen entre sí según la teoría del color",
    palettes_title: "Tipos de Paletas Disponibles",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Cuál es la diferencia entre la paleta análoga y la monocromática?",
    faq1a: "La paleta análoga usa colores vecinos en el círculo cromático, creando una sensación de armonía con leve variación de color. La monocromática usa diferentes saturaciones y luminosidades del mismo color, resultando en un aspecto más uniforme y elegante.",
    faq2q: "¿Qué formato debo elegir: HEX, RGB o HSL?",
    faq2a: "HEX es el más práctico para CSS y handoff de diseño. RGB o RGBA es mejor cuando necesitas transparencia. HSL es más intuitivo para ajustes manuales de luminosidad y saturación sin cambiar el tono.",
    faq3q: "¿Puedo usar esta herramienta para crear paletas pastel?",
    faq3a: "Sí. Elige un color base claro y suave en el selector y las combinaciones generadas seguirán el mismo rango de luminosidad. Las paletas Análoga y Monocromática funcionan especialmente bien para resultados pastel.",
    faq4q: "¿Por qué la paleta Complementaria muestra solo un color?",
    faq4a: "El color complementario es único por definición: es el color directamente opuesto al color base en el círculo cromático. Las demás paletas (Análoga, Triádica, etc.) devuelven múltiples colores porque utilizan relaciones angulares que generan conjuntos. La Complementaria siempre devuelve un único resultado.",
    faq5q: "¿Qué son los colores complementarios?",
    faq5a: "Los colores complementarios son pares de colores ubicados directamente opuestos en el círculo cromático. Cuando se colocan uno al lado del otro, crean un fuerte contraste y tensión visual, haciendo que cada color parezca más vibrante. Pares comunes incluyen azul/naranja, rojo/verde y amarillo/violeta. Esta herramienta genera automáticamente el color complementario para cualquier color base elegido.",
    see1: "Colores Aleatorios",
    see2: "Colores de la Imagen",
    see3: "Convertidor de Colores",
    see4: "Generador de QR Code"
  },
  fr: {
    pageTitle: "Générateur de Combinaison de Couleurs — Complémentaires, Analogues & Triadiques | Gratuit",
    ogTitle: "Générateur de Combinaison de Couleurs : Palettes par Théorie des Couleurs | Gratuit",
    ogLocale: "fr_FR",
    title: "Combinaison de Couleurs",
    intro: "Générez des palettes de couleurs harmonieuses à partir de n'importe quelle couleur de base. Explorez des combinaisons complémentaires, analogues, monochromes, triadiques et tétradiques en HEX, RGB, HSL et autres formats. Cliquez sur n'importe quelle couleur pour la copier.",
    meta: "Générateur gratuit de combinaison de couleurs basé sur la théorie des couleurs. Explorez des palettes complémentaires, analogues, triadiques et monochromes depuis n'importe quelle couleur de base en HEX, RGB ou HSL.",
    about_desc: "Cet outil génère des palettes de couleurs basées sur la théorie des couleurs à partir de n'importe quelle couleur que vous choisissez. Il calcule automatiquement six types de combinaisons (analogue, monochrome, complémentaire adjacente, triadique, tétradique et complémentaire) et affiche les résultats en temps réel à mesure que vous ajustez la couleur de base ou le format de sortie. Utile pour créer des systèmes de couleurs cohérents pour l'UI, le branding et les projets graphiques.",
    optColor: "Couleur de Base",
    optPalettes: "Combinaisons visibles",
    format: "Format",
    analogous: "Analogue",
    analog_d: "Utilisez-la lorsque vous souhaitez un rendu calme et cohérent. Excellente pour les arrière-plans, les landing pages et les marques transmettant l'équilibre",
    monochromatic: "Monochrome",
    mono_d: "Parfaite pour créer une hiérarchie sans introduire de nouvelles couleurs. Idéale pour les textes, les boutons et les états de survol (hover)",
    splitcomplement: "Complémentaire Adjacente",
    split_d: "Un bon compromis entre contraste et douceur. Fonctionne bien dans les interfaces comportant plus d'un élément mis en valeur",
    triad: "Triadique",
    triad_d: "À privilégier pour les projets nécessitant de l'énergie et de la diversité. Fonctionne bien sur les tableaux de bord (dashboards) et les supports marketing",
    tetrad: "Tétradique",
    tetrad_d: "Indiquée pour les systèmes de design complexes avec de multiples catégories ou des sections visuellement distinctes",
    complement: "Complémentaire",
    compl_d: "Idéale lorsque vous avez besoin d'un impact immédiat. Excellente pour les appels à l'action (CTAs), les badges d'alerte et les éléments qui doivent attirer l'attention",
    how_title: "Comment Utiliser ce Générateur de Palettes de Couleurs",
    step_1_t: "Choisissez une couleur de base",
    step_1_d: "Cliquez sur le sélecteur de couleur et choisissez une couleur comme point de départ. Il peut s'agir de la couleur principale de votre marque, d'une teinte que vous souhaitez explorer ou de n'importe quelle couleur que vous avez sous la main",
    step_2_t: "Sélectionnez le format de sortie",
    step_2_d: "Choisissez parmi les formats disponibles : HEX, HEX 8, RGB, RGB %, HSV ou HSL",
    step_3_t: "Activez les combinaisons souhaitées",
    step_3_d: "Utilisez les cases à cocher pour afficher uniquement les types de palettes que vous souhaitez, tels que analogue, monochrome, complémentaire, triadique, tétradique ou complémentaire adjacente",
    step_4_t: "Copiez n'importe quelle couleur",
    step_4_d: "Cliquez sur n'importe quelle couleur de la palette pour copier son code équivalent",
    features_title: "Fonctionnalités",
    feature_1: "Six types de combinaisons : analogue, monochrome, complémentaire adjacente, triadique, tétradique et complémentaire",
    feature_2: "Prise en charge de HEX, HEX8, RGB, RGB %, HSV et HSL",
    feature_3: "Cliquez sur n'importe quelle couleur pour copier instantanément sa valeur",
    feature_4: "Filtrez les palettes à afficher selon vos besoins",
    apps_title: "Applications Pratiques",
    app1_t: "Palettes d'interface utilisateur (UI) et design systems",
    app1_d: "Créez des palettes cohérentes à partir de la couleur de votre marque, en explorant des teintes qui s'associent naturellement à l'aide du cercle chromatique",
    app2_t: "Marketing et supports visuels",
    app2_d: "Choisissez des harmonies de couleurs pour vos présentations, affiches et supports marketing avec une cohérence garantie par la théorie des couleurs",
    app3_t: "Intégration front-end et CSS",
    app3_d: "Copiez les valeurs en HEX, RGB ou HSL directement dans votre CSS, en choisissant la palette la plus adaptée au projet sans avoir à calculer manuellement les codes de couleurs",
    app4_t: "Redesign et prototypage",
    app4_d: "Testez différentes théories des couleurs lors de la refonte d'interfaces avant de définir le design system final",
    app5_t: "Illustration et identité visuelle",
    app5_d: "Explorez des palettes monochromes ou analogues pour des illustrations, des icônes et des éléments visuels cohérents",
    app6_t: "Design d'intérieur",
    app6_d: "Composez des palettes harmonieuses pour des espaces de vie, en choisissant des teintes pour les murs, le mobilier et les revêtements qui s'associent parfaitement grâce à la théorie des couleurs",
    palettes_title: "Harmonies de Palette Prises en Charge",
    faq_title: "Questions et Réponses",
    faq1q: "Quelle est la différence entre une palette analogue et une palette monochrome ?",
    faq1a: "La palette analogue utilise des couleurs voisines sur le cercle chromatique, créant une sensation d'harmonie avec de subtiles variations de teintes. En revanche, la palette monochrome utilise différentes saturations et luminosités d'une seule et même couleur, offrant un rendu plus épuré, uniforme et élégant.",
    faq2q: "Quel format dois-je choisir : HEX, RGB ou HSL ?",
    faq2a: "Le format HEX est le plus pratique pour le CSS et le transfert de design (handoff). Les formats RGB ou RGBA sont préférables pour la transparence. Le format HSL est plus intuitif pour effectuer des ajustements manuels de luminosité et de saturation sans altérer la teinte de base.",
    faq3q: "Puis-je utiliser cet outil pour créer des palettes pastel ?",
    faq3a: "Oui. Sélectionnez une couleur de base claire et douce dans le sélecteur, et toutes les harmonies générées conserveront ce même niveau de clarté. Les palettes analogues et monochromes sont particulièrement adaptées pour obtenir des teintes pastel harmonieuses.",
    faq4q: "Pourquoi la palette Complémentaire n'affiche-t-elle qu'une seule couleur ?",
    faq4a: "La couleur complémentaire est unique par définition : c'est la couleur directement opposée à la couleur de base sur le cercle chromatique. Les autres palettes (Analogue, Triadique, etc.) renvoient plusieurs couleurs car elles utilisent des relations d'angle qui génèrent des ensembles. La palette Complémentaire ne renvoie qu'un seul résultat.",
    faq5q: "Que sont les couleurs complémentaires ?",
    faq5a: "Les couleurs complémentaires sont des paires de couleurs situées directement à l'opposé sur le cercle chromatique. Placées côte à côte, elles créent un fort contraste et une tension visuelle — rendant chaque couleur plus vibrante. Les paires courantes incluent bleu/orange, rouge/vert et jaune/violet. Cet outil génère automatiquement la couleur complémentaire pour n'importe quelle couleur de base choisie.",
    see1: "Couleurs Aléatoires",
    see2: "Couleurs de l'Image",
    see3: "Convertisseur de Couleurs",
    see4: "Générateur de QR Code"
  },
  it: {
    pageTitle: "Generatore di Combinazioni di Colori — Complementari, Analoghe e Triadiche | Gratis",
    ogTitle: "Generatore di Combinazioni di Colori: Palette per Teoria dei Colori | Gratis",
    ogLocale: "it_IT",
    title: "Combinazione di Colori",
    intro: "Genera palette di colori armoniose da qualsiasi colore di base. Esplora combinazioni complementari, analoghe, monocromatiche, triadiche e tetradiche in HEX, RGB, HSL e altri formati. Clicca su qualsiasi colore per copiarlo.",
    meta: "Generatore gratuito di combinazioni di colori basato sulla teoria dei colori. Esplora palette complementari, analoghe, triadiche e monocromatiche da qualsiasi colore di base in HEX, RGB o HSL.",
    about_desc: "Questo strumento genera palette di colori basate sulla teoria dei colori a partire da qualsiasi colore scelto. Calcola automaticamente sei tipi di combinazioni (analoga, monocromatica, complementare divisa, triadica, tetradica e complementare) e mostra i risultati in tempo reale mentre regoli il colore di base o il formato di output. Utile per creare sistemi di colori coerenti per UI, branding e progetti grafici.",
    optColor: "Colore di Base",
    optPalettes: "Combinazioni visibili",
    format: "Formato",
    analogous: "Analoga",
    analog_d: "Usa quando desideri un aspetto calmo e coeso. Ottima per sfondi, landing page e marchi che trasmettono equilibrio",
    monochromatic: "Monocromatica",
    mono_d: "Perfetta per creare gerarchia senza introdurre nuovi colori. Ideale per testi, pulsanti e stati di hover",
    splitcomplement: "Complementare Divisa",
    split_d: "Un buon compromesso tra contrasto e morbidezza. Funziona bene in interfacce con più di un elemento di rilievo",
    triad: "Triadica",
    triad_d: "Scegli per progetti che richiedono energia e diversità. Funziona bene in dashboard e materiali di marketing",
    tetrad: "Tetradica",
    tetrad_d: "Indicata per sistemi di design complessi con molteplici categorie o sezioni visivamente distinte",
    complement: "Complementare",
    compl_d: "Ideale quando hai bisogno di un impatto immediato. Ottima per CTA, badge di avviso ed elementi che devono attirare l'attenzione",
    how_title: "Come Usare questo Generatore di Palette di Colori",
    step_1_t: "Scegli un colore di base",
    step_1_d: "Clicca sul selettore di colori e scegli un colore qualsiasi come punto di partenza. Può essere il colore principale del tuo brand, una tonalità che vuoi esplorare o qualsiasi colore che hai già a disposizione",
    step_2_t: "Seleziona il formato di output",
    step_2_d: "Scegli tra i formati disponibili: HEX, HEX 8, RGB, RGB %, HSV o HSL",
    step_3_t: "Attiva le combinazioni desiderate",
    step_3_d: "Usa le caselle di controllo per mostrare solo i tipi di palette che desideri, come analoga, monocromatica, complementare, triadica, tetradica o complementare divisa",
    step_4_t: "Copia qualsiasi colore",
    step_4_d: "Clicca su qualsiasi colore della palette per copiare il suo codice equivalente",
    features_title: "Funzionalità",
    feature_1: "Sei tipi di combinazioni: analoga, monocromatica, complementare divisa, triadica, tetradica e complementare",
    feature_2: "Supporto per HEX, HEX8, RGB, RGB%, HSV e HSL",
    feature_3: "Clicca su qualsiasi colore per copiarne il valore all'istante",
    feature_4: "Filtra quali palette mostrare in base alle tue esigenze",
    apps_title: "Applicazioni Pratiche",
    app1_t: "Palette di UI e sistemi di design",
    app1_d: "Crea palette coerenti a partire da un colore del brand, esplorando tonalità che si abbinano naturalmente lungo la ruota dei colori",
    app2_t: "Marketing e materiali visivi",
    app2_d: "Scegli schemi di colori per presentazioni, poster e materiali di marketing con un'armonia garantita dalla teoria dei colori",
    app3_t: "Front-end e CSS",
    app3_d: "Copia valori in HEX, RGB o HSL direttamente nel tuo CSS, scegliendo la palette che meglio si adatta al progetto senza dover calcolare i colori manualmente",
    app4_t: "Redesign e prototipazione",
    app4_d: "Testa diverse teorie dei colori nei redesign di interfacce prima di definire il sistema di design finale",
    app5_t: "Illustrazione e identità visiva",
    app5_d: "Esplora palette monocromatiche o analoghe per illustrazioni, icone ed elementi visivi coerenti",
    app6_t: "Design di interni",
    app6_d: "Componi palette armoniose per ambienti, scegliendo colori per pareti, mobili e rivestimenti che si abbinano tra loro secondo la teoria dei colori",
    palettes_title: "Tipi di Palette Supportati",
    faq_title: "Domande e Risposte",
    faq1q: "Qual è la differenza tra palette analoga e monocromatica?",
    faq1a: "La palette analoga utilizza colori vicini sulla ruota dei colori, creando una sensazione di armonia con una leggera variazione cromatica. Quella monocromatica utilizza invece diverse saturazioni e luminosità dello stesso colore, con un risultato finale più uniforme ed elegante.",
    faq2q: "Quale formato dovrei scegliere: HEX, RGB o HSL?",
    faq2a: "HEX è il più pratico per CSS e handoff di design. RGB o RGBA è preferibile quando serve la trasparenza. HSL è più intuitivo per regolazioni manuali di luminosità e saturazione senza cambiare la tonalità.",
    faq3q: "Posso utilizzare questo strumento per creare palette pastello?",
    faq3a: "Sì. Scegli un colore di base chiaro e tenue nel selettore e le combinazioni generate seguiranno la stessa gamma di luminosità. Le palette Analoga e Monocromatica funzionano particolarmente bene per ottenere toni pastello.",
    faq4q: "Perché la palette Complementare mostra solo un colore?",
    faq4a: "Il colore complementare è unico per definizione: è il colore direttamente opposto al colore di base sulla ruota dei colori. Le altre palette (Analoga, Triadica, ecc.) restituiscono più colori perché utilizzano relazioni angolari che generano insiemi. La palette Complementare restituisce un solo risultato.",
    faq5q: "Cosa sono i colori complementari?",
    faq5a: "I colori complementari sono coppie di colori posizionati direttamente opposti sulla ruota dei colori. Quando affiancati, creano un forte contrasto e tensione visiva — rendendo ogni colore più vivido. Le coppie comuni includono blu/arancione, rosso/verde e giallo/viola. Questo strumento genera automaticamente il colore complementare per qualsiasi colore di base scelto.",
    see1: "Colori Casuali",
    see2: "Colori dell'Immagine",
    see3: "Convertitore di Colori",
    see4: "Generatore di QR Code"
  },
  id: {
    pageTitle: "Generator Kombinasi Warna — Komplementer, Analog & Triadik | Gratis",
    ogTitle: "Generator Kombinasi Warna: Palet Berdasarkan Teori Warna | Gratis",
    ogLocale: "id_ID",
    title: "Kombinasi Warna",
    intro: "Buat palet warna yang harmonis dari warna dasar apa pun. Jelajahi kombinasi komplementer, analog, monokromatik, triadik, dan tetradik dalam format HEX, RGB, HSL, dan lainnya. Klik pada warna apa saja untuk menyalinnya.",
    meta: "Generator kombinasi warna gratis berdasarkan teori warna. Jelajahi palet komplementer, analog, triadik, dan monokromatik dari warna dasar apa pun dalam format HEX, RGB, atau HSL.",
    about_desc: "Alat ini menghasilkan palet warna berdasarkan teori warna dari warna apa pun yang Anda pilih. Alat ini secara otomatis menghitung enam jenis kombinasi (analog, monokromatik, komplementer terpisah, triadik, tetradik, dan komplementer) dan menampilkan hasilnya secara real-time saat Anda menyesuaikan warna dasar atau format keluaran. Sangat berguna untuk membuat sistem warna yang kohesif untuk UI, branding, dan proyek grafis.",
    optColor: "Warna Dasar",
    optPalettes: "Kombinasi Terlihat",
    format: "Format",
    analogous: "Analog",
    analog_d: "Gunakan saat Anda menginginkan tampilan yang tenang dan kohesif. Sangat cocok untuk latar belakang, landing page, dan merek yang menyampaikan keseimbangan",
    monochromatic: "Monokromatik",
    mono_d: "Sempurna untuk menciptakan hierarki tanpa memperkenalkan warna baru. Ideal untuk teks, tombol, dan status hover",
    splitcomplement: "Komplementer Terpisah",
    split_d: "Jalan tengah yang baik antara kontras dan kelembutan. Berfungsi dengan baik pada antarmuka dengan lebih dari satu elemen sorotan",
    triad: "Triadik",
    triad_d: "Pilih untuk proyek yang membutuhkan energi dan keragaman. Berfungsi dengan baik di dashboard dan materi pemasaran",
    tetrad: "Tetradik",
    tetrad_d: "Direkomendasikan untuk sistem desain yang kompleks dengan banyak kategori atau bagian yang berbeda secara visual",
    complement: "Komplementer",
    compl_d: "Ideal saat Anda membutuhkan dampak langsung. Sangat baik untuk CTA, lencana peringatan, dan elemen yang perlu menarik perhatian",
    how_title: "Cara Menggunakan Generator Palet Warna Ini",
    step_1_t: "Pilih warna dasar",
    step_1_d: "Klik pada pemilih warna dan pilih warna apa saja sebagai titik awal. Ini bisa berupa warna utama merek Anda, warna yang ingin Anda jelajahi, atau warna apa pun yang sudah Anda miliki",
    step_2_t: "Pilih format keluaran",
    step_2_d: "Pilih dari format yang tersedia: HEX, HEX 8, RGB, RGB %, HSV, atau HSL",
    step_3_t: "Aktifkan kombinasi yang diinginkan",
    step_3_d: "Gunakan kotak centang untuk hanya menampilkan jenis palet yang Anda inginkan, seperti analog, monokromatik, komplementer, triadik, tetradik, atau komplementer terpisah",
    step_4_t: "Salin warna apa saja",
    step_4_d: "Klik pada warna apa saja di palet untuk menyalin kode ekuivalennya",
    features_title: "Fitur",
    feature_1: "Enam jenis kombinasi: analog, monokromatik, komplementer terpisah, triadik, tetradik, dan komplementer",
    feature_2: "Dukungan untuk HEX, HEX8, RGB, RGB%, HSV, dan HSL",
    feature_3: "Klik pada warna apa saja untuk menyalin nilainya secara instan",
    feature_4: "Filter palet mana yang ingin ditampilkan sesuai kebutuhan Anda",
    apps_title: "Penerapan Praktis",
    app1_t: "Palet UI dan sistem desain",
    app1_d: "Buat palet yang kohesif dari warna merek, jelajahi warna yang serasi secara alami melalui roda warna",
    app2_t: "Pemasaran dan materi visual",
    app2_d: "Pilih skema warna untuk presentasi, poster, dan materi pemasaran dengan harmoni yang dijamin oleh teori warna",
    app3_t: "Front-end dan CSS",
    app3_d: "Salin nilai dalam HEX, RGB, atau HSL langsung ke CSS Anda, pilih palet yang paling sesuai dengan proyek tanpa harus menghitung warna secara manual",
    app4_t: "Desain ulang dan prototipe",
    app4_d: "Uji berbagai teori warna dalam desain ulang antarmuka sebelum menentukan sistem desain akhir",
    app5_t: "Ilustrasi dan identitas visual",
    app5_d: "Jelajahi palet monokromatik atau analog untuk ilustrasi, ikon, dan elemen visual yang konsisten",
    app6_t: "Desain interior",
    app6_d: "Susun palet yang harmonis untuk ruangan, pilih warna dinding, furnitur, dan pelapis yang serasi satu sama lain berdasarkan teori warna",
    palettes_title: "Jenis Palet yang Didukung",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Apa perbedaan antara palet analog dan monokromatik?",
    faq1a: "Palet analog menggunakan warna-warna yang berdekatan pada roda warna, menciptakan rasa harmoni dengan sedikit variasi warna. Sementara itu, palet monokromatik menggunakan tingkat saturasi dan kecerahan yang berbeda dari warna yang sama, menghasilkan tampilan yang lebih seragam dan elegan.",
    faq2q: "Format mana yang harus saya pilih: HEX, RGB, atau HSL?",
    faq2a: "HEX adalah yang paling praktis untuk CSS dan handoff desain. RGB atau RGBA lebih baik saat Anda membutuhkan transparansi. HSL lebih intuitif untuk penyesuaian kecerahan dan saturasi secara manual tanpa mengubah warna dasar.",
    faq3q: "Bisakah saya menggunakan alat ini untuk membuat palet pastel?",
    faq3a: "Ya. Pilih warna dasar yang terang dan lembut pada pemilih warna, dan kombinasi yang dihasilkan akan mengikuti kisaran kecerahan yang sama. Palet Analog dan Monokromatik bekerja sangat baik untuk hasil warna pastel.",
    faq4q: "Mengapa palet Komplementer hanya menampilkan satu warna?",
    faq4a: "Warna komplementer secara definisi unik: yaitu warna yang berada tepat di seberang warna dasar pada roda warna. Palet lain (Analog, Triadik, dll.) menghasilkan beberapa warna karena menggunakan hubungan sudut yang menghasilkan rangkaian warna. Palet Komplementer hanya mengembalikan satu hasil.",
    faq5q: "Apa itu warna komplementer?",
    faq5a: "Warna komplementer adalah pasangan warna yang berada tepat berseberangan di roda warna. Ketika diletakkan berdampingan, keduanya menciptakan kontras kuat dan tegangan visual — membuat setiap warna tampak lebih hidup. Pasangan umum termasuk biru/oranye, merah/hijau, dan kuning/ungu. Alat ini secara otomatis menghasilkan warna komplementer untuk warna dasar apa pun yang Anda pilih.",
    see1: "Warna Acak",
    see2: "Warna Gambar",
    see3: "Konverter Warna",
    see4: "Generator Kode QR"
  },
  de: {
    pageTitle: "Farbkombination Generator — Komplementär, Analog & Triadisch | Kostenlos",
    ogTitle: "Farbkombination Generator: Paletten nach Farbtheorie | Kostenlos",
    ogLocale: "de_DE",
    title: "Farbkombination",
    intro: "Erstelle harmonische Farbpaletten aus jeder Grundfarbe. Erkunde komplementäre, analoge, monochromatische, triadische und tetriadische Kombinationen in HEX, RGB, HSL und mehr. Klicke auf eine Farbe, um sie zu kopieren.",
    meta: "Kostenloser Farbkombination-Generator auf Basis der Farbtheorie. Entdecke komplementäre, analoge, triadische und monochromatische Paletten aus jeder Grundfarbe in HEX, RGB oder HSL.",
    about_desc: "Dieses Tool generiert Farbpaletten basierend auf der Farbtheorie aus jeder gewählten Farbe. Es berechnet automatisch sechs Kombinationstypen (analog, monochrom, geteilte Komplementärfarbe, triadisch, tetriadisch und komplementär) und zeigt die Ergebnisse in Echtzeit an, während du die Grundfarbe oder das Ausgabeformat anpasst. Nützlich für kohärente Farbsysteme in UI, Branding und Grafikprojekten.",
    optColor: "Grundfarbe",
    optPalettes: "Sichtbare Kombinationen",
    format: "Format",
    analogous: "Analog",
    analog_d: "Verwende sie für einen ruhigen und stimmigen Look. Ideal für Hintergründe, Landing Pages und Marken, die Ausgeglichenheit vermitteln",
    monochromatic: "Monochrom",
    mono_d: "Perfekt für Hierarchie ohne neue Farben einzuführen. Ideal für Texte, Schaltflächen und Hover-Zustände",
    splitcomplement: "Geteilte Komplementärfarbe",
    split_d: "Eine gute Balance zwischen Kontrast und Sanftheit. Funktioniert gut in Interfaces mit mehr als einem Fokuselement",
    triad: "Triadisch",
    triad_d: "Wähle diese für Projekte, die Energie und Vielfalt brauchen. Funktioniert gut in Dashboards und Marketingmaterialien",
    tetrad: "Tetriadisch",
    tetrad_d: "Geeignet für komplexe Designsysteme mit mehreren Kategorien oder visuell eigenständigen Bereichen",
    complement: "Komplementär",
    compl_d: "Ideal für sofortige visuelle Wirkung. Perfekt für CTAs, Warnungs-Badges und Elemente, die hervorstechen müssen",
    how_title: "So verwendest du diesen Farbpaletten-Generator",
    step_1_t: "Wähle eine Grundfarbe",
    step_1_d: "Klicke auf die Farbauswahl und wähle eine Farbe als Ausgangspunkt. Es kann die Hauptfarbe deiner Marke sein, ein Ton den du erkunden möchtest oder eine Farbe, die du bereits kennst",
    step_2_t: "Wähle das Ausgabeformat",
    step_2_d: "Wähle aus den verfügbaren Formaten: HEX, HEX 8, RGB, RGB %, HSV oder HSL",
    step_3_t: "Aktiviere die gewünschten Kombinationen",
    step_3_d: "Nutze die Checkboxen, um nur die benötigten Palettentypen anzuzeigen, wie analog, monochrom, komplementär, triadisch, tetriadisch oder geteilte Komplementärfarbe",
    step_4_t: "Kopiere eine Farbe",
    step_4_d: "Klicke auf ein Farbfeld, um seinen Wert in die Zwischenablage zu kopieren",
    features_title: "Funktionen",
    feature_1: "Sechs Kombinationstypen: analog, monochrom, geteilte Komplementärfarbe, triadisch, tetriadisch und komplementär",
    feature_2: "Unterstützt HEX, HEX8, RGB, RGB%, HSV und HSL",
    feature_3: "Klicke auf eine Farbe, um den Wert sofort zu kopieren",
    feature_4: "Filtere, welche Paletten angezeigt werden sollen",
    apps_title: "Praktische Anwendungen",
    app1_t: "UI-Paletten und Designsysteme",
    app1_d: "Erstelle stimmige Paletten aus einer Markenfarbe und erkunde Töne, die sich über den Farbkreis natürlich ergänzen",
    app2_t: "Marketing und visuelle Materialien",
    app2_d: "Wähle Farbschemata für Präsentationen, Poster und Marketingmaterialien mit durch Farbtheorie garantierter Harmonie",
    app3_t: "Front-end und CSS",
    app3_d: "Kopiere HEX-, RGB- oder HSL-Werte direkt in dein CSS und wähle die Palette, die am besten zum Projekt passt, ohne Farben manuell berechnen zu müssen",
    app4_t: "Redesign und Prototyping",
    app4_d: "Teste verschiedene Farbtheorien bei Interface-Redesigns, bevor du das endgültige Designsystem festlegst",
    app5_t: "Illustration und visuelle Identität",
    app5_d: "Erkunde monochromatische oder analoge Paletten für Illustrationen, Icons und konsistente visuelle Elemente",
    app6_t: "Innenarchitektur",
    app6_d: "Stelle harmonische Paletten für Räume zusammen und wähle Wand-, Möbel- und Bodenfarben, die sich laut Farbtheorie ergänzen",
    palettes_title: "Unterstützte Palettentypen",
    faq_title: "Fragen und Antworten",
    faq1q: "Was ist der Unterschied zwischen analoger und monochromatischer Palette?",
    faq1a: "Eine analoge Palette verwendet benachbarte Farben auf dem Farbkreis und erzeugt ein harmonisches Gefühl mit leichter Farbvariation. Eine monochromatische Palette verwendet verschiedene Sättigungen und Helligkeitswerte derselben Farbe und ergibt ein einheitlicheres und eleganteres Erscheinungsbild.",
    faq2q: "Welches Format soll ich wählen: HEX, RGB oder HSL?",
    faq2a: "HEX ist am praktischsten für CSS und Design-Handoff. RGB oder RGBA ist besser, wenn du Transparenz benötigst. HSL ist intuitiver für manuelle Anpassungen von Helligkeit und Sättigung ohne den Farbton zu ändern.",
    faq3q: "Kann ich dieses Tool verwenden, um Pastellpaletten zu erstellen?",
    faq3a: "Ja. Wähle eine helle und weiche Grundfarbe im Selektor und die generierten Kombinationen folgen demselben Helligkeitsbereich. Die analogen und monochromatischen Paletten funktionieren besonders gut für Pastellergebnisse.",
    faq4q: "Warum zeigt die Komplementärpalette nur eine Farbe?",
    faq4a: "Die Komplementärfarbe ist per Definition einzigartig: Sie ist die Farbe, die der Grundfarbe auf dem Farbkreis direkt gegenüberliegt. Andere Paletten (Analog, Triadisch usw.) geben mehrere Farben zurück, weil sie Winkelbeziehungen nutzen, die Mengen erzeugen. Die Komplementärpalette gibt immer nur ein Ergebnis zurück.",
    faq5q: "Was sind Komplementärfarben?",
    faq5a: "Komplementärfarben sind Farbpaare, die sich auf dem Farbkreis direkt gegenüberliegen. Nebeneinander platziert erzeugen sie starken Kontrast und visuelle Spannung — jede Farbe wirkt dadurch leuchtender. Häufige Komplementärpaare sind Blau/Orange, Rot/Grün und Gelb/Violett. Dieses Tool generiert automatisch die Komplementärfarbe für jede gewählte Grundfarbe.",
    see1: "Zufällige Farben",
    see2: "Bildfarben",
    see3: "Farben-Konverter",
    see4: "QR-Code-Generator"
  },
  nl: {
    pageTitle: "Kleurcombinatie Generator — Complementaire, Analoge & Triadische Paletten | Gratis",
    ogTitle: "Kleurcombinatie Generator: Paletten op Basis van Kleurentheorie | Gratis",
    ogLocale: "nl_NL",
    title: "Kleurcombinatie",
    intro: "Genereer harmonieuze kleurenpaletten op basis van elke basiskleur. Ontdek complementaire, analoge, monochrome, triadische en tetradische combinaties in HEX, RGB, HSL en andere formaten. Klik op een kleur om deze te kopiëren.",
    meta: "Gratis kleurcombinatie generator op basis van de kleurentheorie. Ontdek complementaire, analoge, triadische en monochrome paletten van elke basiskleur in HEX, RGB of HSL.",
    about_desc: "Deze tool genereert kleurenpaletten op basis van de kleurentheorie van elke gewenste kleur. De tool berekent automatisch zes soorten combinaties (analoog, monochroom, gesplitst complementair, triadisch, tetradisch en complementair) en toont de resultaten in realtime terwijl je de basiskleur of het uitvoerformaat aanpast. Handig voor het maken van samenhangende kleurenschema's voor UI, branding en grafische projecten.",
    optColor: "Basiskleur",
    optPalettes: "Zichtbare combinaties",
    format: "Formaat",
    analogous: "Analoog",
    analog_d: "Gebruik wanneer je een rustige en samenhangende uitstraling wilt. Geweldig voor achtergronden, landingpages en merken die balans uitstralen",
    monochromatic: "Monochroom",
    mono_d: "Perfect voor het creëren van hiërarchie zonder nieuwe kleuren te introduceren. Ideaal voor teksten, knoppen en hover-states",
    splitcomplement: "Gesplitst complementair",
    split_d: "Een goede middenweg tussen contrast en zachtheid. Werkt goed in interfaces met meer dan één prominent element",
    triad: "Triadisch",
    triad_d: "Kies voor projecten die energie en diversiteit nodig hebben. Werkt goed in dashboards en marketingmateriaal",
    tetrad: "Tetradisch",
    tetrad_d: "Aanbevolen voor complexe design systems met meerdere categorieën of visueel verschillende secties",
    complement: "Complementair",
    compl_d: "Ideaal wanneer je directe impact nodig hebt. Geweldig voor CTA's, waarschuwingsbadges en elementen die de aandacht moeten trekken",
    how_title: "Hoe gebruik je deze kleurenpalet generator?",
    step_1_t: "Kies een basiskleur",
    step_1_d: "Klik op de kleurkiezer en kies een kleur als startpunt. Dit kan de primaire kleur van je merk zijn, een tint die je wilt verkennen of een kleur die je al bij de hand hebt",
    step_2_t: "Selecteer het uitvoerformaat",
    step_2_d: "Kies uit de beschikbare formaten: HEX, HEX 8, RGB, RGB %, HSV of HSL",
    step_3_t: "Activeer de gewenste combinaties",
    step_3_d: "Gebruik de selectievakjes om alleen de soorten paletten te tonen die je wilt, zoals analoog, monochroom, complementair, triadisch, tetradisch of gesplitst complementair",
    step_4_t: "Kopieer een kleur",
    step_4_d: "Klik op een kleur in het palet om de bijbehorende code te kopiëren",
    features_title: "Kenmerken",
    feature_1: "Zes soorten combinaties: analoog, monochroom, gesplitst complementair, triadisch, tetradisch en complementair",
    feature_2: "Ondersteuning voor HEX, HEX8, RGB, RGB%, HSV en HSL",
    feature_3: "Klik op een kleur om de waarde direct te kopiëren",
    feature_4: "Filter welke paletten getoond moeten worden op basis van je behoeften",
    apps_title: "Praktische toepassingen",
    app1_t: "UI-paletten en design systems",
    app1_d: "Maak samenhangende paletten op basis van een merkkleur en verken tinten die natuurlijk bij elkaar passen op de kleurencirkel",
    app2_t: "Marketing en visueel materiaal",
    app2_d: "Kies kleurenschema's voor presentaties, posters en marketingmateriaal met een gegarandeerde harmonie volgens de kleurentheorie",
    app3_t: "Front-end en CSS",
    app3_d: "Kopieer waarden in HEX, RGB of HSL rechtstreeks naar je CSS en kies het palet dat het beste bij je project past, zonder kleuren handmatig te hoeven berekenen",
    app4_t: "Herontwerp en prototyping",
    app4_d: "Test verschillende kleurentheorieën in interface-herontwerpen voordat je het definitieve design system vastlegt",
    app5_t: "Illustratie en visuele identiteit",
    app5_d: "Ontdek monochrome of analoge paletten voor consistente illustraties, pictogrammen en visuele elementen",
    app6_t: "Interieurontwerp",
    app6_d: "Stel harmonieuze paletten samen voor ruimtes door kleuren te kiezen voor muren, meubels en bekleding die bij elkaar passen volgens de kleurentheorie",
    palettes_title: "Ondersteunde soorten paletten",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Wat is het verschil tussen een analoog en monochroom palet?",
    faq1a: "Een analoog palet maakt gebruik van naast elkaar gelegen kleuren op de kleurencirkel, wat een gevoel van harmonie geeft met een lichte kleurvariatie. Een monochroom palet gebruikt daarentegen verschillende verzadigingen en helderheden van dezelfde kleur, wat resulteert in een strakker en eleganter uiterlijk.",
    faq2q: "Welk formaat moet ik kiezen: HEX, RGB of HSL?",
    faq2a: "HEX is het meest praktisch voor CSS en design-handoff. RGB of RGBA is het beste als je transparantie nodig hebt. HSL is intuïtiever voor handmatige aanpassingen van helderheid en verzadiging zonder de basistint te veranderen.",
    faq3q: "Kan ik deze tool gebruiken om pastelpaletten te maken?",
    faq3a: "Ja. Kies een lichte en zachte basiskleur in de kleurkiezer en de gegenereerde combinaties zullen dezelfde helderheidsreeks volgen. Analoge en monochrome paletten werken bijzonder goed voor pastelkleurige resultaten.",
    faq4q: "Waarom toont het Complementaire palet slechts één kleur?",
    faq4a: "De complementaire kleur is per definitie uniek: het is de kleur die recht tegenover de basiskleur op de kleurencirkel ligt. Andere paletten (Analoog, Triadisch, enz.) retourneren meerdere kleuren omdat ze hoekrelaties gebruiken die sets genereren. Het Complementaire palet retourneert slechts één resultaat.",
    faq5q: "Wat zijn complementaire kleuren?",
    faq5a: "Complementaire kleuren zijn paren van kleuren die direct tegenover elkaar liggen op de kleurencirkel. Naast elkaar geplaatst creëren ze sterk contrast en visuele spanning — waardoor elke kleur levendiger lijkt. Veelvoorkomende paren zijn blauw/oranje, rood/groen en geel/violet. Deze tool genereert automatisch de complementaire kleur voor elke basiskleur die je kiest.",
    see1: "Willekeurige Kleuren",
    see2: "Afbeeldingskleuren",
    see3: "Kleur Converter",
    see4: "QR-codegenerator"
  },
  ru: {
    pageTitle: "Генератор цветовых комбинаций — комплементарные, аналогичные и триадные палитры | Бесплатно",
    ogTitle: "Генератор цветовых комбинаций: бесплатный онлайн-инструмент теории цвета",
    ogLocale: "ru_RU",
    title: "Цветовые комбинации",
    intro: "Генерируйте гармоничные цветовые палитры на основе любого базового цвета. Исследуйте комплементарные, аналогичные, монохроматические, триадные и тетрадные сочетания в форматах HEX, RGB, HSL и других. Кликните на любой цвет, чтобы скопировать его.",
    meta: "Бесплатный генератор цветовых комбинаций на основе теории цвета. Исследуйте комплементарные, аналогичные, триадные и монохроматические палитры от любого базового цвета в форматах HEX, RGB или HSL.",
    about_desc: "Этот инструмент генерирует цветовые палитры на основе теории цвета из любого выбранного вами цвета. Он автоматически рассчитывает шесть типов комбинаций (аналогичные, монохроматические, сплит-комплементарные, триадные, тетрадные и комплементарные) и отображает результаты в реальном времени по мере изменения базового цвета или формата вывода. Полезно для создания целостных цветовых схем в дизайне интерфейсов, брендинге и графике.",
    optColor: "Базовый цвет",
    optPalettes: "Видимые комбинации",
    format: "Формат",
    analogous: "Аналогичные",
    analog_d: "Используйте, когда хотите создать спокойный и целостный вид. Отлично подходит для фонов, лендингов и брендов, транслирующих баланс",
    monochromatic: "Монохроматические",
    mono_d: "Идеально подходит для создания иерархии элементов без добавления новых цветов. Подходит для текстов, кнопок и эффектов наведения (hover)",
    splitcomplement: "Сплит-комплементарные",
    split_d: "Хороший компромисс между контрастностью и мягкостью. Отлично работает в интерфейсах с несколькими акцентными элементами",
    triad: "Триадные",
    triad_d: "Выбирайте для проектов, требующих динамики и разнообразия. Хорошо подходит для дашбордов и маркетинговых материалов",
    tetrad: "Тетрадные",
    tetrad_d: "Рекомендуется для сложных дизайн-систем с множеством категорий или визуально различающихся разделов",
    complement: "Комплементарные",
    compl_d: "Идеально подходит для мгновенного визуального акцента. Подходит для призывов к действию (CTA), уведомлений и элементов, требующих особого внимания",
    how_title: "Как использовать этот генератор цветовых палитр",
    step_1_t: "Выберите базовый цвет",
    step_1_d: "Нажмите на селектор цвета и выберите любой цвет в качестве отправной точки. Это может быть основной цвет вашего бренда или любой тон, который вы хотите исследовать",
    step_2_t: "Выберите формат вывода",
    step_2_d: "Выберите один из доступных форматов: HEX, HEX 8, RGB, RGB %, HSV или HSL",
    step_3_t: "Активируйте нужные комбинации",
    step_3_d: "Используйте чекбоксы, чтобы показать только интересующие вас типы палитр",
    step_4_t: "Скопируйте любой цвет",
    step_4_d: "Кликните на любой цвет в палитре, чтобы скопировать его код в буфер обмена",
    features_title: "Возможности",
    feature_1: "Шесть типов сочетаний: аналогичные, монохроматические, сплит-комплементарные, триадные, тетрадные и комплементарные",
    feature_2: "Поддержка форматов HEX, HEX8, RGB, RGB%, HSV и HSL",
    feature_3: "Копирование значения любого цвета в один клик",
    feature_4: "Фильтрация отображаемых палитр под ваши задачи",
    apps_title: "Практическое применение",
    app1_t: "Палитры интерфейса и дизайн-системы",
    app1_d: "Создавайте гармоничные палитры из цвета бренда, исследуя естественные сочетания на цветовом круге",
    app2_t: "Маркетинг и визуальные материалы",
    app2_d: "Подбирайте цветовые схемы для презентаций, постеров и промо-материалов с научно подтвержденной гармонией",
    app3_t: "Фронтенд и CSS",
    app3_d: "Копируйте значения HEX, RGB или HSL прямо в стили CSS, подбирая палитру без ручных расчетов",
    app4_t: "Редизайн и прототипирование",
    app4_d: "Тестируйте различные цветовые гармонии в макетах интерфейса перед утверждением финальной палитры",
    app5_t: "Иллюстрации и фирменный стиль",
    app5_d: "Используйте монохроматические или аналогичные палитры для создания консистентных иллюстраций и иконок",
    app6_t: "Дизайн интерьеров",
    app6_d: "Составляйте гармоничные палитры для помещений, подбирая сочетания цветов стен, мебели и отделки",
    palettes_title: "Доступные типы палитр",
    faq_title: "Вопросы и ответы",
    faq1q: "В чем разница между аналогичными и монохроматическими палитрами?",
    faq1a: "Аналогичная палитра использует соседние цвета на цветовом круге, создавая ощущение плавности с мягкими изменениями тона. Монохроматическая палитра использует разные уровни насыщенности и яркости одного и того же цвета, обеспечивая строгое, элегантное и однородное решение.",
    faq2q: "Какой формат выбрать: HEX, RGB или HSL?",
    faq2a: "HEX — самый удобный формат для CSS и передачи дизайна в разработку. RGB или RGBA незаменим при работе с прозрачностью. HSL наиболее интуитивен для ручной регулировки яркости и насыщенности без изменения самого цветового тона.",
    faq3q: "Можно ли использовать этот инструмент для создания пастельных палитр?",
    faq3a: "Да. Выберите мягкий и светлый базовый цвет, и все сгенерированные гармонии сохранят этот уровень светлоты. Аналогичные и монохроматические палитры особенно хороши для пастельных решений.",
    faq4q: "Почему комплементарная палитра показывает только один цвет?",
    faq4a: "Комплементарный (дополнительный) цвет уникален по определению — это цвет, расположенный строго напротив базового на цветовом круге. Другие палитры выдают больше цветов, так как строятся на угловых соотношениях. Комплементарная дает ровно один результат.",
    faq5q: "Что такое комплементарные цвета?",
    faq5a: "Комплементарные цвета — это пары цветов, расположенные друг напротив друга на цветовом круге. При совместном использовании они создают максимальный контраст и визуальное напряжение, делая каждый цвет ярче. Классические пары: синий/оранжевый, красный/зеленый, желтый/фиолетовый. Наш инструмент автоматически находит дополнительный цвет к любому выбранному базовому.",
    see1: "Случайные цвета",
    see2: "Цвета из изображения",
    see3: "Конвертер цветов",
    see4: "Генератор QR-кодов"
  }
}
</i18n>
