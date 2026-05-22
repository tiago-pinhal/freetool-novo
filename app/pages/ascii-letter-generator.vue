<script setup lang="ts">
import { reactive, onMounted, computed, watch } from 'vue'

const { t } = useI18n({ useScope: 'local' })

interface PageData { idx: number; start: number; end: number }
interface FontResult { font: string; output: string }
interface State {
  text: string
  font: string
  width: string
  lineBreak: boolean
  output: string | null
  tab: string
  loading: boolean
  generating: boolean
  pages: PageData[]
  currPage: number
  showNavigator: boolean
  loadingRange: boolean
  fontResults: FontResult[]
  ads: boolean
}

const fonts = ["3-D", "1Row", "3D Diagonal", "3D-ASCII", "3x5", "4Max", "5 Line Oblique", "Acrobatic", "Alligator", "Alligator2", "Alpha", "Alphabet", "AMC 3 Line", "AMC 3 Liv1", "AMC AAA01", "AMC Neko", "AMC Razor", "AMC Razor2", "AMC Slash", "AMC Slider", "AMC Thin", "AMC Tubes", "AMC Untitled", "ANSI Regular", "ANSI Shadow", "Arrows", "ASCII New Roman", "Avatar", "B1FF", "Banner", "Banner3", "Banner3-D", "Banner4", "Barbwire", "Basic", "Bear", "Bell", "Benjamin", "Big Chief", "Big Money-ne", "Big Money-nw", "Big Money-se", "Big Money-sw", "Big", "Bigfig", "Binary", "Block", "Blocks", "Bloody", "Bolger", "Braced", "Bright", "Broadway KB", "Broadway", "Bubble", "Bulbhead", "Caligraphy", "Caligraphy2", "Calvin S", "Cards", "Catwalk", "Chiseled", "Chunky", "Coinstak", "Cola", "Colossal", "Computer", "Contessa", "Contrast", "Cosmike", "Crawford", "Crawford2", "Crazy", "Cricket", "Cursive", "Cyberlarge", "Cybermedium", "Cybersmall", "Cygnet", "DANC4", "Dancing Font", "Decimal", "Def Leppard", "Delta Corps Priest 1", "Diamond", "Diet Cola", "Digital", "Doh", "Doom", "DOS Rebel", "Dot Matrix", "Double Shorts", "Double", "Dr Pepper", "DWhistled", "Efti Chess", "Efti Font", "Efti Italic", "Efti Piti", "Efti Robot", "Efti Wall", "Efti Water", "Electronic", "Elite", "Epic", "Fender", "Filter", "Fire Font-k", "Fire Font-s", "Flipped", "Flower Power", "Four Tops", "Fraktur", "Fun Face", "Fun Faces", "Fuzzy", "Georgi16", "Georgia11", "Ghost", "Ghoulish", "Glenyn", "Goofy", "Gothic", "Graceful", "Gradient", "Graffiti", "Greek", "Heart Left", "Heart Right", "Henry 3D", "Hex", "Hieroglyphs", "Hollywood", "Horizontal Left", "Horizontal Right", "ICL-1900", "Impossible", "Invita", "Isometric1", "Isometric2", "Isometric3", "Isometric4", "Italic", "Ivrit", "Jacky", "Jazmine", "Jerusalem", "JS Block Letters", "JS Bracket Letters", "JS Capital Curves", "JS Cursive", "JS Stick Letters", "Katakana", "Kban", "Keyboard", "Knob", "Konto Slant", "Konto", "Larry 3D 2", "Larry 3D", "LCD", "Lean", "Letters", "Lil Devil", "Line Blocks", "Linux", "Lockergnome", "Madrid", "Marquee", "Maxfour", "Merlin1", "Merlin2", "Mike", "Mini", "Mirror", "Mnemonic", "Modular", "Morse", "Morse2", "Moscow", "Mshebrew210", "Muzzle", "Nancyj", "Nancyj-Fancy", "Nancyj-Improved", "Nancyj-Underlined", "Nipples", "NScript", "NT Greek", "NV Script", "O8", "Octal", "Ogre", "Old Banner", "OS2", "Pagga", "Patorjk's Cheese", "Patorjk-HeX", "Pawp", "Peaks Slant", "Peaks", "Pebbles", "Pepper", "Poison", "Puffy", "Puzzle", "Pyramid", "Rammstein", "Rectangles", "Red Phoenix", "Relief", "Relief2", "Reverse", "Roman", "Rot13", "Rotated", "Rounded", "Rowan Cap", "Rozzo", "Runic", "Runyc", "S Blood", "Santa Clara", "Script", "Serifcap", "Shadow", "Shimrod", "Short", "SL Script", "Slant Relief", "Slant", "Slide", "Small Caps", "Small Isometric1", "Small Keyboard", "Small Poison", "Small Script", "Small Shadow", "Small Slant", "Small Tengwar", "Small", "Soft", "Speed", "Spliff", "Stacey", "Stampate", "Stampatello", "Standard", "Star Strips", "Star Wars", "Stellar", "Stforek", "Stick Letters", "Stop", "Straight", "Stronger Than All", "Sub-Zero", "Swamp Land", "Swan", "Sweet", "Tanja", "Tengwar", "Term", "Test1", "The Edge", "Thick", "Thin", "THIS", "Thorned", "Three Point", "Ticks Slant", "Ticks", "Tiles", "Tinker-Toy", "Tombstone", "Train", "Trek", "Tsalagi", "Tubular", "Twisted", "Two Point", "Univers", "USA Flag", "Varsity", "Wavy", "Weird", "Wet Letter", "Whimsy", "Wow"]

const state: State = reactive({
  text: '',
  font: '3-D',
  width: 'none',
  lineBreak: false,
  output: null,
  tab: 'custom',
  loading: true,
  generating: false,
  pages: [],
  currPage: 0,
  showNavigator: false,
  loadingRange: false,
  fontResults: [],
  ads: false
})

const tabs = computed(() => [
  { id: 'custom', label: t('tab1') },
  { id: 'all', label: t('tab2') }
])

const fontOptions = computed(() => fonts.map(f => ({ label: f, value: f })))

const widthOptions = computed(() => [
  { label: t('default'), value: 'none' },
  { label: '40', value: '40' },
  { label: '50', value: '50' },
  { label: '60', value: '60' },
  { label: '70', value: '70' },
  { label: '80', value: '80' },
  { label: '90', value: '90' },
  { label: '100', value: '100' }
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') }
  ]
})

useHead({
  title: t('m_title'),
  meta: [{ name: 'description', content: t('meta') }]
})

onMounted(() => {
  generatePagination()
})

useScript('https://cdnjs.cloudflare.com/ajax/libs/fetch/3.6.20/fetch.min.js', { trigger: 'client' })

useScript('https://unpkg.com/figlet@1.5.2/lib/figlet.js', {
  trigger: 'client'
}).onLoaded(() => {
  const figlet = (window as any).figlet
  figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts' })
  figlet.preloadFonts(['3-D'], () => {
    state.output = figlet.textSync('Freetool', '3-D')
    state.loading = false
  })
})

watch([() => state.font, () => state.width, () => state.lineBreak], () => {
  state.output = null
})

function generate() {
  state.generating = true
  const text = state.text.trim() || 'Freetool'
  ;(window as any).figlet(
    text,
    {
      font: state.font,
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: state.width === 'none' ? undefined : Number(state.width),
      whitespaceBreak: state.width === 'none' ? undefined : state.lineBreak
    },
    (err: any, result: string) => {
      if (!err) {
        state.output = result
        state.ads = true
      }
      state.generating = false
    }
  )
}

function generateByRange(page: number, start: number, end: number) {
  state.currPage = page
  state.loadingRange = true
  state.fontResults = []
  const text = state.text.trim() || 'Freetool'

  fonts.slice(start, end + 1).forEach(font => {
    ;(window as any).figlet(
      text,
      { font, horizontalLayout: 'default', verticalLayout: 'default' },
      (_: any, result: string) => {
        state.fontResults.push({ font, output: result || '' })
      }
    )
  })

  state.loadingRange = false
  state.showNavigator = true
  state.ads = true
}

function generatePagination() {
  const perPage = 29
  const totalItems = fonts.length
  const pages: PageData[] = []

  for (let idx = 1; idx <= Math.ceil(totalItems / perPage); idx++) {
    const start = (idx - 1) * perPage
    let end = start + perPage - 1
    if (end > totalItems - 1) end = totalItems - 1
    pages.push({ idx, start, end })
  }
  state.pages = pages
}

defineI18nRoute({
  paths: {
    en: '/ascii-letter-generator',
    pt: '/gerador-de-letras-ascii',
    es: '/generador-de-letras-ascii',
    fr: '/generateur-de-lettres-ascii',
    it: '/generatore-di-lettere-ascii',
    id: '/generator-huruf-ascii',
    de: '/ascii-generator',
    nl: '/ascii-generator'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'fancy-letters' },
      { label: t('see2'), to: 'text-comparator' },
      { label: t('see3'), to: 'text-counter' },
      { label: t('see4'), to: 'text-converter' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="form-control w-full">
        <label for="ascii-input" class="label">
          <span class="label-text font-bold text-base-content text-xs uppercase tracking-wider">{{ t('input_label') }}</span>
        </label>
        <input
          id="ascii-input"
          v-model="state.text"
          type="text"
          class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl"
          :placeholder="t('plc')"
          autofocus
          autocomplete="off"
        />
      </div>

      <ToolTabs
        :tabs="tabs"
        :active-tab="state.tab"
        @update:active-tab="state.tab = $event"
      >
        <template #custom>
          <div class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <ToolSelect
                v-model="state.font"
                :label="t('fonts')"
                :options="fontOptions"
              />
              <div class="form-control w-full">
                <label for="width" class="label">
                  <span class="label-text font-bold text-base-content text-xs uppercase tracking-wider">{{ t('width') }}</span>
                </label>
                <select
                  id="width"
                  v-model="state.width"
                  class="select select-bordered select-lg bg-base-200 rounded-2xl w-full transition-all duration-300 focus:border-primary"
                >
                  <option v-for="opt in widthOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>

            <div v-show="state.width !== 'none'" class="flex items-center gap-3 px-1">
              <input
                id="break-toggle"
                v-model="state.lineBreak"
                type="checkbox"
                class="toggle toggle-primary"
              />
              <label for="break-toggle" class="label-text cursor-pointer select-none">{{ t('break') }}</label>
            </div>

            <ButtonPrimary
              :is-loading="state.loading || state.generating"
              :disabled="state.loading || state.generating"
              class="w-full"
              @click="generate"
            >
              {{ state.loading ? t('loading') : t('bt') }}
            </ButtonPrimary>

            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
            >
              <Blockcopy v-if="state.output" :label="t('result')" :content="state.output">
                <pre class="!whitespace-pre">{{ state.output }}</pre>
              </Blockcopy>
            </Transition>
          </div>
        </template>

        <template #all>
          <div class="space-y-4">
            <ButtonPrimary
              :is-loading="state.loadingRange"
              :disabled="state.loadingRange"
              class="w-full"
              @click="generateByRange(1, 0, 29)"
            >
              {{ t('bt') }}
            </ButtonPrimary>

            <div v-if="state.showNavigator" class="flex flex-wrap gap-1">
              <button
                v-for="{ idx, start, end } in state.pages"
                :key="idx"
                type="button"
                class="btn btn-sm"
                :class="idx === state.currPage ? 'btn-primary' : 'btn-ghost'"
                @click="generateByRange(idx, start, end)"
              >
                <span v-if="state.loadingRange && idx === state.currPage" class="loading loading-spinner loading-xs" />
                {{ idx }}
              </button>
            </div>

            <div class="max-h-[600px] overflow-y-auto space-y-3 pr-1">
              <Blockcopy
                v-for="{ font, output } in state.fontResults"
                :key="font"
                :label="font"
                :content="output"
              >
                <pre class="!whitespace-pre">{{ output }}</pre>
              </Blockcopy>
            </div>
          </div>
        </template>
      </ToolTabs>

      <Mordizi v-if="state.ads" />
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('d1') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :description="t('uc_intro')"
          :items="[
            { title: t('uc_1_t'), description: t('uc_1_d') },
            { title: t('uc_2_t'), description: t('uc_2_d') },
            { title: t('uc_3_t'), description: t('uc_3_d') },
            { title: t('uc_4_t'), description: t('uc_4_d') }
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') },
            { title: t('step_4_title'), description: t('step_4_desc') }
          ]"
        />

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    m_title: "Gerador de Arte ASCII: Texto para ASCII Online Grátis",
    title: "Gerador de Arte ASCII",
    meta: "Converta texto em arte ASCII com mais de 280 fontes criativas incluindo estilos 3D, banner e graffiti. Ideal para Discord, GitHub, comentários de código e redes sociais. Copie e cole instantaneamente.",
    input_label: "Seu texto",
    plc: "Digite seu texto aqui",
    fonts: "Fonte",
    width: "Largura",
    default: "Padrão",
    bt: "Gerar",
    loading: "Carregando...",
    break: "Habilitar quebra de linha nos espaços",
    result: "Resultado",
    tab1: "Fonte Personalizada",
    tab2: "Todas as Fontes",
    d1: "Crie designs de texto incríveis com mais de 280 fontes criativas e estilos FIGlet que variam do retrô ao 3D. Nossa ferramenta permite transformar nomes, nicks e mensagens em artes visuais para decorar servidores do Discord, READMEs do GitHub ou comentários em códigos, tudo com processamento imediato e sem precisar instalar nada no seu computador. Utilize a aba 'Fonte Personalizada' para gerar com uma fonte específica, ou explore a aba 'Todas as Fontes' para comparar seu texto em vários estilos de uma vez e encontrar o visual perfeito.",
    features_title: "Recursos",
    f_1: "Mais de 280 fontes criativas e estilos FIGlet",
    f_2: "Arte ASCII 3D, banner, graffiti e estilos retrô",
    use_cases_title: "Usos Comuns",
    uc_intro: "A arte de texto ASCII é versátil e pode enriquecer diversos contextos digitais com criatividade:",
    uc_1_t: "Discord e Slack",
    uc_1_d: "Crie banners chamativos e mensagens de boas-vindas para seus servidores e canais.",
    uc_2_t: "GitHub e READMEs",
    uc_2_d: "Adicione cabeçalhos estilosos aos seus arquivos README, documentação e saídas de console.",
    uc_3_t: "Redes Sociais",
    uc_3_d: "Destaque seus perfis no Twitter, Reddit, fóruns e plataformas de jogos com arte de texto única.",
    uc_4_t: "Assinaturas de E-mail",
    uc_4_d: "Adicione um toque retrô e tecnológico às suas assinaturas de e-mail e comunicações pessoais.",
    how_to_use_title: "Como usar",
    step_1_title: "Digite seu texto",
    step_1_desc: "Escreva a palavra, frase ou nickname que você quer transformar em arte ASCII no campo de entrada.",
    step_2_title: "Escolha uma fonte",
    step_2_desc: "Selecione entre mais de 280 fontes incluindo 3D, Banner, Block, Graffiti e muitos outros estilos únicos.",
    step_3_title: "Clique em Gerar",
    step_3_desc: "Pressione o botão Gerar e sua arte ASCII aparecerá instantaneamente abaixo.",
    step_4_title: "Copie e cole",
    step_4_desc: "Clique no botão Copiar e cole sua arte ASCII onde precisar.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O que é arte ASCII?",
    faq_1_a: "Arte ASCII é uma técnica de design gráfico que usa caracteres ASCII imprimíveis para criar imagens e texto artístico. Surgiu nos primórdios da computação, quando displays gráficos não estavam disponíveis, e continua popular pela estética retrô e compatibilidade universal.",
    faq_2_q: "O que são fontes FIGlet?",
    faq_2_a: "FIGlet é um programa que cria letras grandes a partir de texto comum. Cada fonte FIGlet define como cada caractere é desenhado usando caracteres ASCII. Nosso gerador inclui mais de 280 fontes FIGlet, de estilos simples a designs 3D e decorativos complexos.",
    faq_3_q: "Onde posso usar arte ASCII?",
    faq_3_a: "Arte ASCII funciona em qualquer lugar que suporte texto simples: Discord, Slack, READMEs do GitHub, Twitter, Reddit, e-mail, aplicativos de terminal, comentários de código e muito mais. Como usa apenas caracteres padrão, é exibida corretamente em qualquer dispositivo ou plataforma.",
    see1: "Letras Diferentes",
    see2: "Comparador de Texto",
    see3: "Contador de Texto",
    see4: "Conversor de Texto"
  },
  en: {
    m_title: "ASCII Letter Generator: Text to ASCII Art Online | Free",
    title: "ASCII Letter Generator",
    meta: "Free online ASCII letter generator. Convert text to ASCII art with 280+ creative font styles including 3D, banner and graffiti. Perfect for Discord, GitHub READMEs, code comments and social media. Instant copy and paste.",
    input_label: "Your text",
    plc: "Type your text here",
    fonts: "Font",
    width: "Width",
    default: "Default",
    bt: "Generate",
    loading: "Loading...",
    break: "Enable word wrap",
    result: "Result",
    tab1: "Custom Font",
    tab2: "All Fonts",
    d1: "Design eye-catching text art with a massive collection of over 280 creative FIGlet font styles ranging from retro to 3D. Easily transform any word into a visual masterpiece for Discord servers, GitHub READMEs, or code headers with instant processing that works directly in your browser without needing to install any software.",
    features_title: "Features",
    f_1: "280+ creative FIGlet font styles",
    f_2: "3D, banner, graffiti and retro ASCII art",
    use_cases_title: "Common Uses",
    uc_intro: "ASCII art text is versatile and can add personality to many digital contexts:",
    uc_1_t: "Discord & Slack",
    uc_1_d: "Create eye-catching banners and welcome messages for your servers and channels.",
    uc_2_t: "GitHub READMEs",
    uc_2_d: "Add stylish headers to your README files, code documentation and console outputs.",
    uc_3_t: "Social Media",
    uc_3_d: "Stand out on Twitter, Reddit, forums and gaming platforms with unique ASCII text art.",
    uc_4_t: "Email Signatures",
    uc_4_d: "Add a retro tech-inspired touch to your email signatures and personal communications.",
    how_to_use_title: "How to use",
    step_1_title: "Type your text",
    step_1_desc: "Enter the word, phrase or nickname you want to convert into ASCII art in the input field.",
    step_2_title: "Choose a font",
    step_2_desc: "Select from 280+ fonts including 3D, Banner, Block, Graffiti and many other unique styles.",
    step_3_title: "Click Generate",
    step_3_desc: "Press the Generate button and your ASCII art will appear instantly below.",
    step_4_title: "Copy and paste",
    step_4_desc: "Click the Copy button and paste your ASCII art wherever you need it.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is ASCII art?",
    faq_1_a: "ASCII art is a graphic design technique that uses printable ASCII characters to create images and text art. It originated in the early days of computing when graphical displays were not available, and remains popular for its retro aesthetic and universal compatibility.",
    faq_2_q: "What are FIGlet fonts?",
    faq_2_a: "FIGlet is a program that creates large letters out of ordinary text. Each FIGlet font defines how each character is drawn using ASCII characters. Our generator includes 280+ FIGlet fonts, ranging from simple styles to complex 3D and decorative designs.",
    faq_3_q: "Where can I use ASCII art?",
    faq_3_a: "ASCII art works anywhere plain text is supported: Discord, Slack, GitHub READMEs, Twitter, Reddit, email, terminal applications, code comments and more. Since it uses only standard characters, it displays correctly on any device or platform.",
    see1: "Fancy Letters",
    see2: "Text Comparator",
    see3: "Text Counter",
    see4: "Text Converter"
  },
  es: {
    m_title: "Generador de Letras ASCII: Texto a ASCII Online Gratis",
    title: "Generador de Letras ASCII",
    meta: "Convierte texto en arte ASCII con más de 280 fuentes creativas incluyendo estilos 3D, banner y graffiti. Ideal para Discord, GitHub y redes sociales. Copia y pega al instante.",
    input_label: "Tu texto",
    plc: "Escribe tu texto aquí",
    fonts: "Fuente",
    width: "Ancho",
    default: "Predeterminado",
    bt: "Generar",
    loading: "Cargando...",
    break: "Habilitar ajuste de línea",
    result: "Resultado",
    tab1: "Fuente Personalizada",
    tab2: "Todas as Fuentes",
    d1: "Crea diseños de texto memorables con más de 280 fuentes creativas y estilos FIGlet que van desde lo retro hasta el 3D. Nuestra herramienta te permite transformar nombres, nicks y mensajes en arte visual perfecto para decorar servidores de Discord, READMEs de GitHub o comentarios de código, todo con procesamiento inmediato y sin necesidad de instalar nada en tu ordenador.",
    features_title: "Características",
    f_1: "Más de 280 fuentes creativas y estilos FIGlet",
    f_2: "Arte ASCII 3D, banner, graffiti y estilos retro",
    use_cases_title: "Usos Comunes",
    uc_intro: "El arte de texto ASCII es versátil y puede enriquecer diversos contextos digitales con creatividad:",
    uc_1_t: "Discord y Slack",
    uc_1_d: "Crea banners llamativos y mensajes de bienvenida para tus servidores y canales.",
    uc_2_t: "GitHub y READMEs",
    uc_2_d: "Añade encabezados elegantes a tus archivos README, documentación y salidas de consola.",
    uc_3_t: "Redes Sociales",
    uc_3_d: "Destaca tus perfiles en Twitter, Reddit, foros y plataformas de juegos con arte de texto único.",
    uc_4_t: "Firmas de Email",
    uc_4_d: "Añade un toque retro y tecnológico a tus firmas de correo electrónico y comunicaciones personales.",
    how_to_use_title: "Cómo usar",
    step_1_title: "Escribe tu texto",
    step_1_desc: "Escribe la palabra, frase o apodo que quieras transformar en arte ASCII en el campo de entrada.",
    step_2_title: "Elige una fuente" ,
    step_2_desc: "Selecciona entre más de 280 fuentes incluyendo 3D, Banner, Block, Graffiti y muchos otros estilos únicos.",
    step_3_title: "Haz clic en Generar",
    step_3_desc: "Presiona el botón Generar y tu arte ASCII aparecerá instantáneamente debajo.",
    step_4_title: "Copia y pega",
    step_4_desc: "Haz clic en el botón Copiar y pega tu arte ASCII donde lo necesites.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Qué es el arte ASCII?",
    faq_1_a: "El arte ASCII es una técnica de diseño gráfico que utiliza caracteres ASCII imprimibles para crear imágenes y texto artístico. Surgió en los inicios de la informática, cuando no había pantallas gráficas, y sigue siendo popular por su estética retro y compatibilidad universal.",
    faq_2_q: "¿Qué son las fuentes FIGlet?",
    faq_2_a: "FIGlet es un programa que crea letras grandes a partir de texto ordinario. Cada fuente FIGlet define cómo se dibuja cada carácter utilizando caracteres ASCII. Nuestro generador incluye más de 280 fuentes FIGlet, desde estilos simples hasta diseños complejos en 3D y decorativos.",
    faq_3_q: "¿Dónde puedo usar arte ASCII?",
    faq_3_a: "El arte ASCII funciona en cualquier lugar que admita texto sin formato: Discord, Slack, READMEs de GitHub, Twitter, Reddit, correo electrónico, aplicaciones de terminal, comentarios de código y más. Al usar solo caracteres estándar, se muestra correctamente en cualquier dispositivo o plataforma.",
    see1: "Letras Diferentes",
    see2: "Comparador de Texto",
    see3: "Contador de Texto",
    see4: "Convertidor de Texto"
  },
  fr: {
    m_title: "Générateur de Lettres ASCII : Texte en ASCII Art Online Gratuit",
    title: "Générateur de Lettres ASCII",
    meta: "Convertissez du texte en art ASCII avec plus de 280 polices créatives incluant des styles 3D, bannière et graffiti. Idéal pour Discord, GitHub et les réseaux sociaux. Copiez et collez instantanément.",
    input_label: "Votre texte",
    plc: "Tapez votre texte ici",
    fonts: "Police",
    width: "Largeur",
    default: "Par défaut",
    bt: "Générer",
    loading: "Chargement...",
    break: "Activer le retour à la ligne",
    result: "Résultat",
    tab1: "Police Personnalisée",
    tab2: "Toutes les Polices",
    d1: "Créez des designs de texte mémorables avec plus de 280 polices créatives et styles FIGlet allant du rétro au 3D. Notre outil vous permet de transformer des noms, pseudos et messages en art visuel parfait pour décorer vos serveurs Discord, README GitHub ou commentaires de code, le tout avec un traitement immédiat directement dans votre navigateur sans aucune installation.",
    features_title: "Caractéristiques",
    f_1: "Plus de 280 polices créatives et styles FIGlet",
    f_2: "Art ASCII 3D, bannière, graffiti et styles rétro",
    use_cases_title: "Utilisations Courantes",
    uc_intro: "L'art du texte ASCII est polyvalent et peut enrichir divers contextes numériques avec créativité :",
    uc_1_t: "Discord et Slack",
    uc_1_d: "Créez des bannières accrocheuses et des messages de bienvenue pour vos serveurs et canaux.",
    uc_2_t: "GitHub et READMEs",
    uc_2_d: "Ajoutez des en-têtes stylés à vos fichiers README, documentation et sorties de console.",
    uc_3_t: "Réseaux Sociaux",
    uc_3_d: "Démarquez vos profils sur Twitter, Reddit, forums et plateformes de jeux avec un art de texte unique.",
    uc_4_t: "Signatures d'Email",
    uc_4_d: "Ajoutez une touche rétro et technologique à vos signatures d'e-mail et communications personnelles.",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Tapez votre texte",
    step_1_desc: "Entrez le mot, la phrase ou le pseudo que vous souhaitez transformer en art ASCII dans le champ de saisie.",
    step_2_title: "Choisissez une police",
    step_2_desc: "Sélectionnez parmi plus de 280 polices incluant 3D, Bannière, Block, Graffiti et bien d'autres styles uniques.",
    step_3_title: "Cliquez sur Générer",
    step_3_desc: "Appuyez sur le bouton Générer et votre art ASCII apparaîtra instantanément ci-dessous.",
    step_4_title: "Copiez et collez",
    step_4_desc: "Cliquez sur le bouton Copier et collez votre art ASCII où vous en avez besoin.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Qu'est-ce que l'art ASCII ?",
    faq_1_a: "L'art ASCII est une technique de conception graphique qui utilise des caractères ASCII imprimibles pour créer des images et du texte artistique. Il est né aux débuts de l'informatique, lorsque les affichages graphiques n'étaient pas disponibles, et reste populaire pour son esthétique rétro et sa compatibilité universelle.",
    faq_2_q: "Que sont les polices FIGlet ?",
    faq_2_a: "FIGlet est un programme qui crée de grandes lettres à partir de texte ordinaire. Chaque police FIGlet définit comment chaque caractère est dessiné à l'aide de caractères ASCII. Notre générateur comprend plus de 280 polices FIGlet, allant de styles simples à des designs complexes en 3D et décoratifs.",
    faq_3_q: "Où puis-je utiliser l'art ASCII ?",
    faq_3_a: "L'art ASCII fonctionne partout où le texte brut est pris en charge : Discord, Slack, README GitHub, Twitter, Reddit, e-mail, applications de terminal, commentaires de code et plus encore. Comme il utilise uniquement des caractères standard, il s'affiche correctement sur n'importe quel appareil ou plateforme.",
    see1: "Lettres Différentes",
    see2: "Comparateur de Texte",
    see3: "Compteur de Texte",
    see4: "Convertisseur de Texte"
  },
  it: {
    m_title: "Generatore di Lettere ASCII: Testo in ASCII Art Online Gratis",
    title: "Generatore di Lettere ASCII",
    meta: "Converti testo in arte ASCII con oltre 280 font creativi inclusi stili 3D, banner e graffiti. Ideale per Discord, GitHub e social media. Copia e incolla istantaneamente.",
    input_label: "Il tuo testo",
    plc: "Scrivi il tuo testo qui",
    fonts: "Font",
    width: "Larghezza",
    default: "Predefinito",
    bt: "Genera",
    loading: "Caricamento...",
    break: "Abilita a capo automatico",
    result: "Resultato",
    tab1: "Font Personalizzato",
    tab2: "Tutti i Font",
    d1: "Crea design di testo memorabili con oltre 280 font creativi e stili FIGlet che variano dal retrò al 3D. Il nostro strumento ti permette di trasformare nomi, nick e messaggi in arte visuale perfetta per decorare server Discord, README di GitHub o commenti nel codice, tutto con elaborazione immediata direttamente nel tuo browser senza alcuna installazione.",
    features_title: "Caratteristiche",
    f_1: "Oltre 280 font creativi e stili FIGlet",
    f_2: "Arte ASCII 3D, banner, graffiti e stili retrò",
    use_cases_title: "Utilizzi Comuni",
    uc_intro: "L'arte del testo ASCII è versatile e può arricchire diversi contesti digitali con creatività:",
    uc_1_t: "Discord e Slack",
    uc_1_d: "Crea banner accattivanti e messaggi di benvenuto per i tuoi server e canali.",
    uc_2_t: "GitHub e README",
    uc_2_d: "Aggiungi intestazioni eleganti ai tuoi file README, documentazione e output della console.",
    uc_3_t: "Social Media",
    uc_3_d: "Distingui i tuoi profili su Twitter, Reddit, forum e piattaforme di gioco con un'arte di testo unica.",
    uc_4_t: "Firme Email",
    uc_4_d: "Aggiungi un tocco retrò e tecnologico alle tue firme email e comunicazioni personali.",
    how_to_use_title: "Come usare",
    step_1_title: "Scrivi il tuo testo",
    step_1_desc: "Inserisci la parola, la frase o il nickname che vuoi trasformare in arte ASCII nel campo di input.",
    step_2_title: "Scegli un font",
    step_2_desc: "Seleziona tra oltre 280 font inclusi 3D, Banner, Block, Graffiti e molti altri stili unici.",
    step_3_title: "Clicca su Genera",
    step_3_desc: "Premi il pulsante Genera e la tua arte ASCII apparirà istantaneamente qui sotto.",
    step_4_title: "Copia e incolla",
    step_4_desc: "Clicca sul pulsante Copia e incolla la tua arte ASCII ovunque ne avrai bisogno.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Cos'è l'arte ASCII?",
    faq_1_a: "L'arte ASCII è una tecnica di progettazione grafica che utilizza caratteri ASCII stampabili per creare immagini e testo artistico. È nata nei primi giorni dell'informatica, quando i display grafici non erano disponibili, e rimane popolare per la sua estetica retrò e la compatibilità universale.",
    faq_2_q: "Cosa sono i font FIGlet?",
    faq_2_a: "FIGlet è un programma che crea lettere grandi partendo da testo ordinario. Ogni font FIGlet definisce come ogni carattere viene disegnato utilizzando caratteri ASCII. Il nostro generatore include oltre 280 font FIGlet, che spaziano da stili semplici a complessi design 3D e decorativi.",
    faq_3_q: "Dove posso usare l'arte ASCII?",
    faq_3_a: "L'arte ASCII funziona ovunque sia supportato il testo semplice: Discord, Slack, README di GitHub, Twitter, Reddit, email, applicazioni terminale, commenti nel codice e altro ancora. Poiché utilizza solo caratteri standard, viene visualizzata correttamente su qualsiasi dispositivo o piattaforma.",
    see1: "Lettere Diverse",
    see2: "Comparatore di Testo",
    see3: "Contatore di Testo",
    see4: "Convertitore di Testo"
  },
  id: {
    m_title: "Generator Huruf ASCII: Teks ke Seni ASCII Online Gratis",
    title: "Generator Huruf ASCII",
    meta: "Ubah teks menjadi seni ASCII dengan lebih dari 280 gaya font kreatif termasuk gaya 3D, banner, dan grafiti. Ideal untuk Discord, GitHub, dan media sosial. Salin dan tempel secara instan.",
    input_label: "Teks Anda",
    plc: "Ketik teks Anda di sini",
    fonts: "Font",
    width: "Lebar",
    default: "Default",
    bt: "Hasilkan",
    loading: "Memuat...",
    break: "Aktifkan bungkus kata",
    result: "Hasil",
    tab1: "Font Kustom",
    tab2: "Semua Font",
    d1: "Buat desain teks yang mengesankan dengan lebih dari 280 font kreatif dan gaya FIGlet mulai dari retro hingga 3D. Alat kami memungkinkan Anda mengubah nama, nick, dan pesan menjadi seni visual yang sempurna untuk mendekorasi server Discord, README GitHub, atau komentar kode, semuanya dengan pemrosesan instan langsung di browser Anda tanpa perlu instalasi apa pun.",
    features_title: "Fitur",
    f_1: "Lebih dari 280 font kreatif dan gaya FIGlet",
    f_2: "Seni ASCII 3D, banner, grafiti, dan gaya retro",
    use_cases_title: "Kegunaan Umum",
    uc_intro: "Seni teks ASCII serbaguna dan dapat memperkaya berbagai konteks digital dengan kreativitas:",
    uc_1_t: "Discord & Slack",
    uc_1_d: "Buat banner yang menarik dan pesan selamat datang untuk server dan saluran Anda.",
    uc_2_t: "GitHub & README",
    uc_2_d: "Tambahkan header bergaya ke file README, dokumentasi kode, dan output konsol Anda.",
    uc_3_t: "Media Sosial",
    uc_3_d: "Tonjolkan profil Anda di Twitter, Reddit, forum, dan platform game dengan seni teks ASCII yang unik.",
    uc_4_t: "Tanda Tangan Email",
    uc_4_d: "Tambahkan sentuhan retro yang terinspirasi teknologi ke tanda tangan email dan komunikasi pribadi Anda.",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Ketik teks Anda",
    step_1_desc: "Masukkan kata, frasa, atau nama panggilan yang ingin Anda ubah menjadi seni ASCII di bidang input.",
    step_2_title: "Pilih font",
    step_2_desc: "Pilih dari lebih dari 280 font termasuk 3D, Banner, Block, Grafiti, dan banyak gaya unik lainnya.",
    step_3_title: "Klik Hasilkan",
    step_3_desc: "Tekan tombol Hasilkan dan seni ASCII Anda akan muncul secara instan di bawah.",
    step_4_title: "Salin dan tempel",
    step_4_desc: "Klik tombol Salin dan tempel seni ASCII Anda di mana pun Anda membutuhkannya.",
    faq_title: "Pertanyaan & Jawaban",
    faq_1_q: "Apa itu seni ASCII?",
    faq_1_a: "Seni ASCII adalah teknik desain grafis yang menggunakan karakter ASCII yang dapat dicetak untuk membuat gambar dan seni teks. Ini berasal dari hari-hari awal komputasi ketika tampilan grafis belum tersedia, dan tetap populer karena estetika retro dan kompatibilitas universalnya.",
    faq_2_q: "Apa itu font FIGlet?",
    faq_2_a: "FIGlet adalah program yang membuat huruf besar dari teks biasa. Setiap font FIGlet mendefinisikan bagaimana setiap karakter digambar menggunakan karakter ASCII. Generator kami mencakup lebih dari 280 font FIGlet, mulai dari gaya sederhana hingga desain 3D dan dekoratif yang kompleks.",
    faq_3_q: "Di mana saya bisa menggunakan seni ASCII?",
    faq_3_a: "Seni ASCII berfungsi di mana pun teks biasa didukung: Discord, Slack, GitHub README, Twitter, Reddit, email, aplikasi terminal, komentar kode, dan banyak lagi. Karena hanya menggunakan karakter standar, seni ini ditampilkan dengan benar di perangkat atau platform apa pun.",
    see1: "Huruf Berbeda",
    see2: "Komparator Teks",
    see3: "Penghitung Teks",
    see4: "Konverter Teks"
  },
  de: {
    m_title: "ASCII Generator: Text in ASCII Art Online Kostenlos",
    title: "ASCII Generator",
    meta: "Konvertieren Sie Text in ASCII-Art mit über 280 kreativen Schriftarten, einschließlich 3D, Banner und Graffiti. Ideal für Discord, GitHub und soziale Medien. Sofort kopieren und einfügen.",
    input_label: "Ihr Text",
    plc: "Geben Sie Ihren Text hier ein",
    fonts: "Schriftart",
    width: "Breite",
    default: "Standard",
    bt: "Generieren",
    loading: "Wird geladen...",
    break: "Zeilenumbruch aktivieren",
    result: "Ergebnis",
    tab1: "Eigene Schriftart",
    tab2: "Alle Schriftarten",
    d1: "Erstellen Sie beeindruckende Textdesigns mit über 280 kreativen Schriftarten und FIGlet-Styles, die von Retro bis 3D reichen. Mit unserem Online-Tool können Sie Namen, Nicks und Nachrichten in visuelle Kunstwerke verwandeln, die perfekt für Discord-Server, GitHub-READMEs oder Code-Kommentare geeignet sind: Alles mit sofortiger Verarbeitung direkt in Ihrem Browser, ohne dass eine Installation erforderlich ist.",
    features_title: "Funktionen",
    f_1: "Über 280 kreative Schriftarten und FIGlet-Styles",
    f_2: "3D, Banner, Graffiti und Retro-ASCII-Art",
    use_cases_title: "Häufige Anwendungen",
    uc_intro: "ASCII-Textkunst ist vielseitig und kann verschiedene digitale Kontexte kreativ bereichern:",
    uc_1_t: "Discord & Slack",
    uc_1_d: "Erstellen Sie auffällige Banner und Willkommensnachrichten für Ihre Server und Kanäle.",
    uc_2_t: "GitHub & READMEs",
    uc_2_d: "Fügen Sie Ihren README-Dateien, der Code-Dokumentation und Konsolenausgaben stilvolle Header hinzu.",
    uc_3_t: "Soziale Medien",
    uc_3_d: "Heben Sie Ihre Profile auf Twitter, Reddit, Foren und Gaming-Plattformen mit einzigartiger Textkunst hervor.",
    uc_4_t: "E-Mail-Signaturen",
    uc_4_d: "Verleihen Sie Ihren E-Mail-Signaturen und persönlichen Nachrichten einen technologisch inspirierten Retro-Touch.",
    how_to_use_title: "Bedienungsanleitung",
    step_1_title: "Text eingeben",
    step_1_desc: "Geben Sie das Wort, die Phrase oder den Spitznamen, den Sie in ASCII-Art umwandeln möchten, in das Eingabefeld ein.",
    step_2_title: "Schriftart wählen",
    step_2_desc: "Wählen Sie aus über 280 Schriftarten, darunter 3D, Banner, Block, Graffiti und viele andere einzigartige Stile.",
    step_3_title: "Auf Generieren klicken",
    step_3_desc: "Drücken Sie die Schaltfläche Generieren, und Ihre ASCII-Art erscheint sofort darunter.",
    step_4_title: "Kopieren und einfügen",
    step_4_desc: "Klicken Sie auf die Schaltfläche Kopieren und fügen Sie Ihre ASCII-Art überall dort ein, wo Sie sie benötigen.",
    faq_title: "Fragen & Antworten",
    faq_1_q: "Was ist ASCII-Art?",
    faq_1_a: "ASCII-Art ist eine grafische Designtechnik, die druckbare ASCII-Zeichen verwendet, um Bilder und Textkunst zu erstellen. Sie entstand in den frühen Tagen der Computertechnik, als grafische Displays noch nicht verfügbar waren, und bleibt wegen ihrer Retro-Ästhetik und universellen Kompatibilität beliebt.",
    faq_2_q: "Was sind FIGlet-Schriftarten?",
    faq_2_a: "FIGlet ist ein program das große Buchstaben aus gewöhnlichem Text erstellt. Jede FIGlet-Schriftart definiert, wie jedes Zeichen mit ASCII-Zeichen gezeichnet wird. Unser Generator umfasst über 280 FIGlet-Schriftarten, die von einfachen Stilen bis hin zu komplexen 3D- und dekorativen Designs reichen.",
    faq_3_q: "Wo kann ich ASCII-Art verwenden?",
    faq_3_a: "ASCII-Art funktioniert überall dort, wo reiner Text unterstützt wird: Discord, Slack, GitHub-READMEs, Twitter, Reddit, E-Mail, Terminal-Anwendungen, Code-Kommentare und mehr. Da sie nur Standardzeichen verwendet, wird sie auf jedem Gerät oder jeder Plattform korrekt angezeigt.",
    see1: "Fancy Letters",
    see2: "Text-Vergleich",
    see3: "Text-Zähler",
    see4: "Text-Konverter"
  },
  nl: {
    m_title: "ASCII Generator: Tekst naar ASCII Art Online Gratis",
    title: "ASCII Generator",
    meta: "Converteer tekst naar ASCII-art met meer dan 280 creatieve lettertypen, waaronder 3D, banner en graffiti. Ideaal voor Discord, GitHub en sociale media. Direct kopiëren en plakken.",
    input_label: "Uw tekst",
    plc: "Typ hier uw tekst",
    fonts: "Lettertype",
    width: "Breedte",
    default: "Standaard",
    bt: "Genereren",
    loading: "Laden...",
    break: "Regelterugloop inschakelen",
    result: "Resultaat",
    tab1: "Aangepast Lettertype",
    tab2: "Alle Lettertypen",
    d1: "Maak gedenkwaardige tekstontwerpen met meer dan 280 creatieve lettertypen en FIGlet-stijlen variërend van retro tot 3D. Met onze online tool kun je namen, nicks en berichten veranderen in visuele kunstwerken die perfect zijn voor het versieren van Discord-servers, GitHub README's of code-commentaren: alles met directe verwerking in je browser zonder dat er installatie nodig is.",
    features_title: "Kenmerken",
    f_1: "Meer dan 280 creatieve lettertypen en FIGlet-stijlen",
    f_2: "3D, banner, graffiti en retro ASCII-art",
    use_cases_title: "Veelvoorkomend Gebruik",
    uc_intro: "ASCII-tekstkunst is veelzijdig en kan verschillende digitale contexten creatief verrijken:",
    uc_1_t: "Discord & Slack",
    uc_1_d: "Maak opvallende banners en welkomstberichten voor je servers en kanalen.",
    uc_2_t: "GitHub & README's",
    uc_2_d: "Voeg stijlvolle headers toe aan je README-bestanden, codedocumentatie en console-outputs.",
    uc_3_t: "Sociale Media",
    uc_3_d: "Val op op Twitter, Reddit, forums en gamingplatforms met unieke tekstkunst.",
    uc_4_t: "E-mailhandtekeningen",
    uc_4_d: "Voeg een retro, tech-geïnspireerde touch toe aan je e-mailhandtekeningen en persoonlijke communicatie.",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Typ je tekst",
    step_1_desc: "Voer het woord, de zin of de bijnaam die je wilt omzetten in ASCII-art in het invoerveld in.",
    step_2_title: "Kies een lettertype",
    step_2_desc: "Kies uit meer dan 280 lettertypen waaronder 3D, Banner, Block, Graffiti en vele andere unieke stijlen.",
    step_3_title: "Klik op Genereren",
    step_3_desc: "Druk op de knop Genereren en je ASCII-art verschijnt direct hieronder.",
    step_4_title: "Kopiëren en plakken",
    step_4_desc: "Klik op de knop Kopiëren en plak je ASCII-art waar je het nodig hebt.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is ASCII-art?",
    faq_1_a: "ASCII-art is een grafische ontwerptechniek die printbare ASCII-karakters gebruikt om afbeeldingen en tekstkunst te maken. Het ontstond in de begindagen van de computer toen grafische displays noch niet beschikbaar waren, en blijft populair vanwege de retro-esthetiek en universele compatibiliteit.",
    faq_2_q: "Wat zijn FIGlet-lettertypen?",
    faq_2_a: "FIGlet is een programma dat grote letters maakt van gewone tekst. Elk FIGlet-lettertype definieert hoe elk karakter wordt getekend met ASCII-karakters. Onze generator bevat meer dan 280 FIGlet-lettertypen, variërend van eenvoudige stijlen tot complexe 3D- en decoratieve ontwerpen.",
    faq_3_q: "Waar kan I ASCII-art gebruiken?",
    faq_3_a: "ASCII-art werkt overal waar platte tekst wordt ondersteund: Discord, Slack, GitHub README, Twitter, Reddit, e-mail, terminaltoepassingen, code-commentaren en meer. Omdat het alleen standaardkarakters gebruikt, wordt het correct weergegeven op elk apparaat of platform.",
    see1: "Fancy Letters",
    see2: "Tekstvergelijker",
    see3: "Tekstteller",
    see4: "Tekstconverter"
  }
}
</i18n>