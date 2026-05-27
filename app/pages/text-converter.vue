<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const { t, locale } = useI18n({ useScope: 'local' })

const text = ref('')
const copied = ref(false)
const state = reactive({
  tab: 0,
  ads: false
})

const tabs = computed(() => [
  { label: t('tab1'), icon: 'heroicons:language-20-solid' },
  { label: t('tab2'), icon: 'heroicons:sparkles-20-solid' },
  { label: t('tab3'), icon: 'heroicons:code-bracket-20-solid' }
])

const characterCount = computed(() => text.value.length)
const wordCount = computed(() => text.value.split(/\s+/).filter(Boolean).length)

const faqs = computed(() => [
  { question: t('faq1q'), answer: t('faq1a') },
  { question: t('faq2q'), answer: t('faq2a') },
  { question: t('faq3q'), answer: t('faq3a') },
  { question: t('faq4q'), answer: t('faq4a') }
])

const features = computed(() => [
  t('feature1'),
  t('feature2'),
  t('feature3'),
  t('feature4')
])

const howToSteps = computed(() => [
  { name: t('step_1_title'), text: t('step_1_desc') },
  { name: t('step_2_title'), text: t('step_2_desc') },
  { name: t('step_3_title'), text: t('step_3_desc') }
])

const stopWords: Record<string, string[]> = {
  en: ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'of', 'in', 'with'],
  pt: ['a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos', 'e', 'ou', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'sem'],
  es: ['a', 'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'y', 'o', 'en', 'con', 'por', 'para', 'sin'],
  fr: ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'en', 'a', 'au', 'aux', 'par', 'pour', 'avec', 'sans'],
  it: ['il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 'di', 'del', 'dello', 'della', 'dei', 'degli', 'delle', 'e', 'o', 'in', 'a', 'da', 'con', 'per', 'su'],
  id: ['di', 'ke', 'dari', 'dan', 'atau', 'pada', 'oleh', 'untuk', 'dengan', 'yang', 'si', 'sang', 'pun'],
  de: ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem', 'einen', 'und', 'oder', 'aber', 'für', 'mit', 'auf', 'in', 'bei', 'von', 'zu', 'aus', 'an'],
  nl: ['de', 'het', 'een', 'en', 'of', 'maar', 'want', 'voor', 'met', 'op', 'in', 'bij', 'van', 'naar', 'uit', 'aan', 'te', 'door'],
  ru: ['и', 'в', 'во', 'не', 'на', 'с', 'со', 'что', 'как', 'а', 'то', 'или', 'но', 'к', 'ко', 'у', 'за', 'из', 'о', 'об', 'обо', 'от', 'ото', 'по', 'для', 'без', 'безо', 'до', 'под', 'подо', 'пред', 'предо', 'через', 'чрез', 'над', 'надо']
}

function markChanged() {
  state.ads = true
}

function setText(value: string) {
  text.value = value
  markChanged()
}

async function copyToClipboard() {
  if (!text.value || !import.meta.client) {
    return
  }

  try {
    await navigator.clipboard.writeText(text.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy text:', error)
  }
}

function removeAccentsFrom(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function splitWords(value: string) {
  return removeAccentsFrom(value)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function toUpperCase() {
  setText(text.value.toUpperCase())
}

function toLowerCase() {
  setText(text.value.toLowerCase())
}

function capitalize() {
  setText(text.value.replace(/\p{L}\S*/gu, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
}

function toTitleCase() {
  const words = stopWords[locale.value] || stopWords.en
  const converted = text.value.toLowerCase().replace(/\p{L}\S*/gu, (word, index) => {
    if (index > 0 && words.includes(word.toLowerCase())) {
      return word.toLowerCase()
    }

    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  setText(converted.charAt(0).toUpperCase() + converted.slice(1))
}

function toSentenceCase() {
  setText(text.value.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, value => value.toUpperCase()))
}

function alternate() {
  let shouldUppercase = text.value.charAt(0) !== text.value.charAt(0).toUpperCase()

  setText(text.value.split('').map(char => {
    if (!/\p{L}/u.test(char)) {
      return char
    }

    const converted = shouldUppercase ? char.toUpperCase() : char.toLowerCase()
    shouldUppercase = !shouldUppercase

    return converted
  }).join(''))
}

function toggleCase() {
  setText(text.value.split('').map(char => {
    const upper = char.toUpperCase()
    const lower = char.toLowerCase()

    if (char === upper && char !== lower) {
      return lower
    }

    if (char === lower && char !== upper) {
      return upper
    }

    return char
  }).join(''))
}

function invert() {
  setText(text.value.split('').reverse().join(''))
}

function removeAccents() {
  setText(removeAccentsFrom(text.value))
}

function removeExtraSpaces() {
  setText(text.value.replace(/\s+/g, ' ').trim())
}

function removeLineBreaks() {
  setText(text.value.replace(/\r?\n/g, ' '))
}

function removeBlankLines() {
  setText(text.value.replace(/^\s*[\r\n]/gm, ''))
}

function removeNumbers() {
  setText(text.value.replace(/[0-9]/g, ''))
}

function removePunctuation() {
  setText(text.value.replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' '))
}

function toCamelCase() {
  const words = splitWords(text.value)
  setText(words.map((word, index) => {
    const lower = word.toLowerCase()
    return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1)
  }).join(''))
}

function toPascalCase() {
  setText(splitWords(text.value).map(word => {
    const lower = word.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }).join(''))
}

function toSnakeCase() {
  setText(splitWords(text.value).map(word => word.toLowerCase()).join('_'))
}

function toHyphenCase() {
  setText(splitWords(text.value).map(word => word.toLowerCase()).join('-'))
}

function toUrlSlug() {
  setText(removeAccentsFrom(text.value)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-'))
}

function toDotCase() {
  setText(splitWords(text.value).map(word => word.toLowerCase()).join('.'))
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: features.value,
  faq: faqs.value
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

defineI18nRoute({
  paths: {
    en: '/text-converter',
    pt: '/conversor-de-texto',
    es: '/convertidor-de-texto',
    fr: '/convertisseur-de-texte',
    it: '/convertitore-di-testo',
    id: '/konverter-teks',
    de: '/text-konverter',
    nl: '/tekst-converter',
    ru: '/konverter-teksta'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'invisible-character' },
      { label: t('see2'), to: 'fancy-letters' },
      { label: t('see3'), to: 'text-counter' },
      { label: t('see4'), to: 'text-comparator' }
    ]"
  >
    <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="form-control w-full">
        <textarea
          id="txt"
          v-model="text"
          rows="8"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-base leading-relaxed"
          :placeholder="t('plc')"
          autofocus
        ></textarea>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="text-sm text-base-content/70">
          <span class="font-medium text-base-content">{{ characterCount }}</span> {{ t('chars') }}
          <span class="mx-2 text-base-content/30">|</span>
          <span class="font-medium text-base-content">{{ wordCount }}</span> {{ t('words') }}
        </div>

        <button
          type="button"
          class="btn btn-sm btn-outline gap-2 self-start sm:self-auto"
          :class="{ 'btn-success': copied }"
          :disabled="!text"
          @click="copyToClipboard"
        >
          <Icon
            :name="copied ? 'heroicons:check-20-solid' : 'heroicons:clipboard-document-20-solid'"
            class="w-4 h-4"
            aria-hidden="true"
          />
          {{ copied ? t('copied') : t('copy') }}
        </button>
      </div>

      <div role="tablist" class="tabs tabs-boxed bg-base-200 p-1">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          type="button"
          role="tab"
          class="tab gap-2 h-auto min-h-10 py-2"
          :class="{ 'tab-active': state.tab === index }"
          @click="state.tab = index"
        >
          <Icon :name="tab.icon" class="w-4 h-4" aria-hidden="true" />
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
      </div>

      <div v-show="state.tab === 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <button type="button" class="btn btn-neutral" @click="toUpperCase">{{ t('bup') }}</button>
        <button type="button" class="btn btn-neutral" @click="toLowerCase">{{ t('blow') }}</button>
        <button type="button" class="btn btn-neutral" @click="capitalize">{{ t('bcap') }}</button>
        <button type="button" class="btn btn-neutral" @click="toTitleCase">{{ t('btitle') }}</button>
        <button type="button" class="btn btn-neutral" @click="toSentenceCase">{{ t('bsent') }}</button>
        <button type="button" class="btn btn-neutral" @click="alternate">{{ t('balt') }}</button>
        <button type="button" class="btn btn-neutral" @click="toggleCase">{{ t('btoggle') }}</button>
        <button type="button" class="btn btn-neutral" @click="invert">{{ t('brev') }}</button>
      </div>

      <div v-show="state.tab === 1" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <button type="button" class="btn btn-neutral" @click="removeAccents">{{ t('bacc') }}</button>
        <button type="button" class="btn btn-neutral" @click="removeExtraSpaces">{{ t('bspaces') }}</button>
        <button type="button" class="btn btn-neutral" @click="removeLineBreaks">{{ t('brlb') }}</button>
        <button type="button" class="btn btn-neutral" @click="removeBlankLines">{{ t('brbl') }}</button>
        <button type="button" class="btn btn-neutral" @click="removeNumbers">{{ t('bnumbers') }}</button>
        <button type="button" class="btn btn-neutral" @click="removePunctuation">{{ t('bpunct') }}</button>
      </div>

      <div v-show="state.tab === 2" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <button type="button" class="btn btn-neutral" @click="toCamelCase">camelCase</button>
        <button type="button" class="btn btn-neutral" @click="toPascalCase">PascalCase</button>
        <button type="button" class="btn btn-neutral" @click="toSnakeCase">snake_case</button>
        <button type="button" class="btn btn-neutral" @click="toHyphenCase">kebab-case</button>
        <button type="button" class="btn btn-neutral" @click="toUrlSlug">{{ t('bslug') }}</button>
        <button type="button" class="btn btn-neutral" @click="toDotCase">dot.case</button>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <p class="text-base-content/80 leading-relaxed">{{ t('about_desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="features"
        />

        <UseCaseSection
          :title="t('apps_title')"
          :items="[
            { title: t('app_1_t'), description: t('app_1_d') },
            { title: t('app_2_t'), description: t('app_2_d') },
            { title: t('app_3_t'), description: t('app_3_d') },
            { title: t('app_4_t'), description: t('app_4_d') },
            { title: t('app_5_t'), description: t('app_5_d') }
          ]"
        />

        <UseCaseSection
          :title="t('edge_title')"
          :description="t('edge_desc')"
          :items="[
            { title: t('edge_1_t'), description: t('edge_1_d') },
            { title: t('edge_2_t'), description: t('edge_2_d') },
            { title: t('edge_3_t'), description: t('edge_3_d') },
            { title: t('edge_4_t'), description: t('edge_4_d') }
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <UseCaseSection
          :title="t('conversion_title')"
          :description="t('conversion_desc')"
          :items="[
            { title: t('tab1'), description: t('conversion_case') },
            { title: t('tab2'), description: t('conversion_clean') },
            { title: t('tab3'), description: t('conversion_code') }
          ]"
        />

        <FaqSection :title="t('faq_title')" :items="faqs" />
      </div>
    </template>
  </ToolPage>

  <DragDropText @on-drop="value => text = value" />
</template>

<i18n lang="yaml">
{
  pt: {
    m_title: "Conversor de Texto Online Grátis – Maiúsculas e Minúsculas",
    title: "Conversor de Texto",
    meta: "Converta texto de letras maiúsculas para minúsculas (e vice-versa), remova acentos, limpe espaços extras e muito mais. Tudo o que você precisa para formatar e padronizar textos de forma simples, rápida e gratuita.",
    about_desc: "Este conversor de texto online permite editar, formatar e organizar textos rapidamente em uma única ferramenta. Insira seu conteúdo para converter letras maiúsculas e minúsculas, remover acentos, limpar formatações indesejadas de textos copiados e transformar frases em diferentes estilos de escrita, inclusive para redes sociais. Ideal para padronizar documentos, formatar mensagens e organizar listas de forma prática, rápida e eficiente.",
    how_to_use_title: "Como usar o Conversor de Texto",
    step_1_title: "Cole ou digite o texto",
    step_1_desc: "Insira o conteúdo no campo principal ou arraste um arquivo de texto para carregar o conteúdo.",
    step_2_title: "Escolha uma categoria",
    step_2_desc: "Use as abas para alternar entre conversões de case, limpeza de texto e formatos de programação.",
    step_3_title: "Aplique e copie",
    step_3_desc: "Clique na conversão desejada e copie o resultado formatado para usar em documentos, posts, código ou mensagens de texto.",
    apps_title: "Aplicações e Casos de Uso",
    app_1_t: "Escrita e edição",
    app_1_d: "Corrija capitalização, padronize textos e prepare títulos com mais rapidez.",
    app_2_t: "SEO e conteúdo",
    app_2_d: "Crie títulos, URLs amigáveis e trechos mais limpos para artigos, páginas e metadados.",
    app_3_t: "Programação",
    app_3_d: "Transforme frases em camelCase, PascalCase, snake_case, kebab-case e dot.case para variáveis, classes e namespaces.",
    app_4_t: "Limpeza de texto",
    app_4_d: "Remova acentos, números, pontuação, linhas em branco, espaços extras e quebras de linha.",
    app_5_t: "Reaproveitamento",
    app_5_d: "Adapte o mesmo texto para documentos, redes sociais, código, URLs e descrições técnicas.",
    edge_title: "Precisão e Casos Especiais",
    edge_desc: "O conversor cobre detalhes práticos que fazem diferença quando o mesmo conteúdo precisa circular por formatos diferentes.",
    edge_1_t: "Vários modos de case",
    edge_1_d: "Use maiúsculas, minúsculas, capitalização, title case, sentence case, case alternado e inversão de case.",
    edge_2_t: "Limpeza de formatação",
    edge_2_d: "Remova problemas comuns de texto copiado de PDFs, planilhas, documentos e páginas web.",
    edge_3_t: "Formatos técnicos",
    edge_3_d: "Gere nomes compatíveis com padrões comuns de código, slugs e caminhos de configuração.",
    edge_4_t: "Fluxo rápido",
    edge_4_d: "Tudo acontece no navegador: cole, transforme e copie com privacidade e rapidez.",
    conversion_title: "Tipos de Conversão Disponíveis",
    conversion_desc: "As conversões estão organizadas por objetivo para facilitar a escolha durante a edição.",
    conversion_case: "Converte entre MAIÚSCULAS, minúsculas, Capitalizar, Title Case, Sentence case, aLtErNaR, tOGGLE cASE e texto invertido.",
    conversion_clean: "Remove acentos, espaços extras, quebras de linha, linhas em branco, números e pontuação.",
    conversion_code: "Gera camelCase, PascalCase, snake_case, kebab-case, URL slug e dot.case.",
    faq_title: "Perguntas e Respostas",
    faq1q: "O que este conversor de texto faz?",
    faq1a: "Esta ferramenta altera o case do texto, faz limpeza de formatação, remove acentos e espaços e converte frases para estilos de programação como camelCase, snake_case e kebab-case.",
    faq2q: "Posso usar para nomes de variáveis em programação?",
    faq2a: "Sim. A aba de programação converte texto para camelCase, PascalCase, snake_case, kebab-case, dot.case e slugs de URL.",
    faq3q: "Posso limpar texto copiado de PDFs ou documentos?",
    faq3a: "Sim. As ferramentas de limpeza removem espaços extras, linhas em branco, quebras de linha, números, pontuação e acentos de texto copiado.",
    faq4q: "Como converter letras maiúsculas para minúsculas?",
    faq4a: "Basta colar o seu texto na área principal e clicar no botão 'minúsculas' na aba de conversão. O texto será transformado instantaneamente.",
    features_title: "Principais Funcionalidades",
    feature1: "Conversão para maiúsculas, minúsculas, title case e sentence case",
    feature2: "Ferramentas para remover espaços, acentos, pontuação e quebras de linha",
    feature3: "Formatos de programação como camelCase, snake_case e kebab-case",
    feature4: "Geração de URL slug e conversão para dot.case",
    tab1: "Maiúsculas/Minúsculas",
    tab2: "Limpeza de Texto",
    tab3: "Programação",
    bup: "MAIÚSCULAS",
    blow: "minúsculas",
    balt: "aLtErNaR",
    bcap: "Capitalizar",
    btitle: "Title Case",
    bsent: "Sentence case",
    btoggle: "tOGGLE cASE",
    bacc: "Remover Acentos",
    bspaces: "Remover Espaços Extras",
    brlb: "Remover Quebras de Linha",
    brbl: "Remover Linhas em Branco",
    bnumbers: "Remover Números",
    bpunct: "Remover Pontuação",
    bslug: "URL Slug",
    brev: "Inverter Texto",
    plc: "Cole seu texto aqui ou arraste um arquivo",
    chars: "caracteres",
    words: "palavras",
    copy: "Copiar",
    copied: "Copiado!",
    see1: "Caractere Invisível",
    see2: "Letras Diferentes",
    see3: "Contador de Texto",
    see4: "Comparador de Texto"
  },
  en: {
    m_title: "Case Converter – Uppercase to Lowercase Online Free",
    title: "Text Converter",
    meta: "Convert text from uppercase to lowercase (and vice versa), remove accents, clear extra spaces and much more. Everything you need to format and standardize texts simply, quickly, and for free.",
    about_desc: "This online text converter allows you to edit, format, and organize texts quickly in a single tool. Insert your content to convert uppercase and lowercase letters, remove accents, clean up unwanted formatting from copied texts, and transform sentences into different writing styles, including for social media. Ideal for standardizing documents, formatting messages, and organizing lists practically, quickly, and efficiently.",
    how_to_use_title: "How to Use the Text Converter",
    step_1_title: "Paste or type the text",
    step_1_desc: "Insert the content in the main field or drag and drop a text file to load the content.",
    step_2_title: "Choose a category",
    step_2_desc: "Use the tabs to switch between case conversions, text cleaning, and programming formats.",
    step_3_title: "Apply and copy",
    step_3_desc: "Click the desired conversion and copy the formatted result to use in documents, posts, code, or text messages.",
    apps_title: "Applications and Use Cases",
    app_1_t: "Writing and editing",
    app_1_d: "Correct capitalization, standardize texts, and prepare titles faster.",
    app_2_t: "SEO and content",
    app_2_d: "Create titles, SEO-friendly URLs, and cleaner snippets for articles, pages, and metadata.",
    app_3_t: "Programming",
    app_3_d: "Transform sentences into camelCase, PascalCase, snake_case, kebab-case, and dot.case for variables, classes, and namespaces.",
    app_4_t: "Text cleaning",
    app_4_d: "Remove accents, numbers, punctuation, blank lines, extra spaces, and line breaks.",
    app_5_t: "Repurposing",
    app_5_d: "Adapt the same text for documents, social media, code, URLs, and technical descriptions.",
    edge_title: "Precision and Special Cases",
    edge_desc: "The converter covers practical details that make a difference when the same content needs to circulate in different formats.",
    edge_1_t: "Multiple case modes",
    edge_1_d: "Use uppercase, lowercase, capitalize, title case, sentence case, alternate case, and toggle case.",
    edge_2_t: "Formatting cleanup",
    edge_2_d: "Remove common problems from text copied from PDFs, spreadsheets, documents, and web pages.",
    edge_3_t: "Technical formats",
    edge_3_d: "Generate names compatible with common code standards, slugs, and configuration paths.",
    edge_4_t: "Fast workflow",
    edge_4_d: "Everything happens in the browser: paste, transform, and copy with privacy and speed.",
    conversion_title: "Available Conversion Types",
    conversion_desc: "Conversions are organized by purpose to make choosing easier during editing.",
    conversion_case: "Converts between UPPERCASE, lowercase, Capitalize, Title Case, Sentence case, aLtErNaTe, tOGGLE cASE, and reversed text.",
    conversion_clean: "Removes accents, extra spaces, line breaks, blank lines, numbers, and punctuation.",
    conversion_code: "Generates camelCase, PascalCase, snake_case, kebab-case, URL slug, and dot.case.",
    faq_title: "Questions and Answers",
    faq1q: "What does this text converter do?",
    faq1a: "This tool alters the text case, performs formatting cleanup, removes accents and spaces, and converts sentences into programming styles like camelCase, snake_case, and kebab-case.",
    faq2q: "Can I use it for programming variable names?",
    faq2a: "Yes. The programming tab converts text to camelCase, PascalCase, snake_case, kebab-case, dot.case, and URL slugs.",
    faq3q: "Can I clean text copied from PDFs or documents?",
    faq3a: "Yes. The cleaning tools remove extra spaces, blank lines, line breaks, numbers, punctuation, and accents from copied text.",
    faq4q: "How to convert uppercase to lowercase?",
    faq4a: "Simply paste your text into the main area and click the 'lowercase' button in the case conversion tab. The text will be instantly transformed.",
    features_title: "Key Features",
    feature1: "Conversion to uppercase, lowercase, title case, and sentence case",
    feature2: "Tools to remove spaces, accents, punctuation, and line breaks",
    feature3: "Programming formats like camelCase, snake_case, and kebab-case",
    feature4: "URL slug generation and conversion to dot.case",
    tab1: "Uppercase/Lowercase",
    tab2: "Text Cleaning",
    tab3: "Programming",
    bup: "UPPERCASE",
    blow: "lowercase",
    balt: "aLtErNaTe",
    bcap: "Capitalize",
    btitle: "Title Case",
    bsent: "Sentence case",
    btoggle: "tOGGLE cASE",
    bacc: "Remove Accents",
    bspaces: "Remove Extra Spaces",
    brlb: "Remove Line Breaks",
    brbl: "Remove Blank Lines",
    bnumbers: "Remove Numbers",
    bpunct: "Remove Punctuation",
    bslug: "URL Slug",
    brev: "Reverse Text",
    plc: "Paste your text here or drag and drop a file",
    chars: "characters",
    words: "words",
    copy: "Copy",
    copied: "Copied!",
    see1: "Invisible Character",
    see2: "Fancy Letters",
    see3: "Text Counter",
    see4: "Text Comparator"
  },
  es: {
    m_title: "Convertidor de Mayúsculas y Minúsculas Online Gratis",
    title: "Convertidor de Texto",
    meta: "Convierte texto de mayúsculas a minúsculas (y viceversa), elimina acentos, limpia espacios extra y mucho más. Todo lo que necesitas para formatear y estandarizar textos de forma sencilla, rápida y gratuita.",
    about_desc: "Este convertidor de texto online te permite editar, formatear y organizar textos rápidamente en una sola herramienta. Inserta tu contenido para convertir letras a mayúsculas y minúsculas, eliminar acentos, limpiar formatos no deseados de textos copiados y transformar frases en diferentes estilos de escritura, incluso para redes sociales. Ideal para estandarizar documentos, formatear mensajes y organizar listas de forma práctica, rápida y eficiente.",
    how_to_use_title: "Cómo usar el Convertidor de Texto",
    step_1_title: "Pega o escribe el texto",
    step_1_desc: "Inserta el contenido en el campo principal o arrastra un archivo de texto para cargarlo.",
    step_2_title: "Elige una categoría",
    step_2_desc: "Usa las pestañas para cambiar entre conversiones de mayúsculas/minúsculas, limpieza de texto y formatos de programación.",
    step_3_title: "Aplica y copia",
    step_3_desc: "Haz clic en la conversión deseada y copia el resultado formateado para usar en documentos, publicaciones, código o mensajes de texto.",
    apps_title: "Aplicaciones y Casos de Uso",
    app_1_t: "Escritura y edición",
    app_1_d: "Corrige mayúsculas, estandariza textos y prepara títulos más rápido.",
    app_2_t: "SEO y contenido",
    app_2_d: "Crea títulos, URLs amigables y fragmentos más limpios para artículos, páginas y metadatos.",
    app_3_t: "Programación",
    app_3_d: "Transforma frases a camelCase, PascalCase, snake_case, kebab-case y dot.case para variables, clases y espacios de nombres.",
    app_4_t: "Limpieza de texto",
    app_4_d: "Elimina acentos, números, puntuación, líneas en blanco, espacios extra y saltos de línea.",
    app_5_t: "Reutilización",
    app_5_d: "Adapta el mismo texto para documentos, redes sociales, código, URLs y descripciones técnicas.",
    edge_title: "Precisión y Casos Especiales",
    edge_desc: "El convertidor cubre detalles prácticos que marcan la diferencia cuando el mismo contenido necesita circular en diferentes formatos.",
    edge_1_t: "Varios modos de conversión",
    edge_1_d: "Usa mayúsculas, minúsculas, capitalizar, title case, sentence case, alternar y alternar mayúsculas/minúsculas.",
    edge_2_t: "Limpieza de formato",
    edge_2_d: "Elimina problemas comunes de texto copiado de PDFs, hojas de cálculo, documentos y páginas web.",
    edge_3_t: "Formatos técnicos",
    edge_3_d: "Genera nombres compatibles con estándares comunes de código, slugs y rutas de configuración.",
    edge_4_t: "Flujo de trabajo rápido",
    edge_4_d: "Todo sucede en el navegador: pega, transforma y copia con privacidad y rapidez.",
    conversion_title: "Tipos de Conversión Disponibles",
    conversion_desc: "Las conversiones están organizadas por propósito para facilitar la elección durante la edición.",
    conversion_case: "Convierte entre MAYÚSCULAS, minúsculas, Capitalizar, Title Case, Sentence case, aLtErNaR, iNVERTIR MAY/MIN y texto invertido.",
    conversion_clean: "Elimina acentos, espacios extra, saltos de línea, líneas en blanco, números y puntuación.",
    conversion_code: "Genera camelCase, PascalCase, snake_case, kebab-case, URL slug y dot.case.",
    faq_title: "Preguntas Frecuentes",
    faq1q: "¿Qué hace este convertidor de texto?",
    faq1a: "Esta herramienta cambia las mayúsculas/minúsculas del texto, limpia el formato, elimina acentos y espacios, y convierte frases a estilos de programación como camelCase, snake_case y kebab-case.",
    faq2q: "¿Puedo usarlo para nombres de variables en programación?",
    faq2a: "Sí. La pestaña de programación convierte texto a camelCase, PascalCase, snake_case, kebab-case, dot.case y slugs de URL.",
    faq3q: "¿Puedo limpiar texto copiado de PDFs o documentos?",
    faq3a: "Sí. Las herramientas de limpieza eliminan espacios extra, líneas en blanco, saltos de línea, números, puntuación y acentos de textos copiados.",
    faq4q: "¿Cómo convertir mayúsculas a minúsculas?",
    faq4a: "Simplemente pega tu texto en el área principal y haz clic en el botón 'minúsculas' en la pestaña de conversión. El texto se transformará instantáneamente.",
    features_title: "Características Principales",
    feature1: "Conversión a mayúsculas, minúsculas, title case y sentence case",
    feature2: "Herramientas para eliminar espacios, acentos, puntuación y saltos de línea",
    feature3: "Formatos de programación como camelCase, snake_case y kebab-case",
    feature4: "Generación de URL slug y conversión a dot.case",
    tab1: "Mayúsculas/Minúsculas",
    tab2: "Limpiar Texto",
    tab3: "Programación",
    bup: "MAYÚSCULAS",
    blow: "minúsculas",
    balt: "aLtErNaR",
    bcap: "Capitalizar",
    btitle: "Title Case",
    bsent: "Sentence case",
    btoggle: "iNVERTIR MAY/MIN",
    bacc: "Eliminar Acentos",
    bspaces: "Eliminar Espacios Extra",
    brlb: "Eliminar Saltos de Línea",
    brbl: "Eliminar Líneas en Blanco",
    bnumbers: "Eliminar Números",
    bpunct: "Eliminar Puntuación",
    bslug: "URL Slug",
    brev: "Invertir Texto",
    plc: "Pega tu texto aquí o arrastra un archivo",
    chars: "caracteres",
    words: "palabras",
    copy: "Copiar",
    copied: "¡Copiado!",
    see1: "Carácter Invisible",
    see2: "Letras Diferentes",
    see3: "Contador de Texto",
    see4: "Comparador de Texto"
  },
  fr: {
    m_title: "Convertisseur de Majuscules et Minuscules en Ligne Gratuit",
    title: "Convertisseur de Texte",
    meta: "Convertissez du texte de majuscules en minuscules (et vice versa), supprimez les accents, nettoyez les espaces supplémentaires et bien plus encore. Tout ce dont vous avez besoin pour formater et standardiser des textes de manière simple, rapide et gratuite.",
    about_desc: "Ce convertisseur de texte en ligne vous permet d'éditer, de formater et d'organiser des textes rapidement dans un seul outil. Insérez votre contenu pour convertir les lettres en majuscules et minuscules, supprimer les accents, nettoyer les formatages indésirables des textes copiés et transformer les phrases dans différents styles d'écriture, y compris pour les réseaux sociaux. Idéal pour standardiser des documents, formater des messages et organiser des listes de manière pratique, rapide et efficace.",
    how_to_use_title: "Comment utiliser le Convertisseur de Texte",
    step_1_title: "Collez ou tapez le texte",
    step_1_desc: "Insérez le contenu dans le champ principal ou faites glisser un fichier texte pour le charger.",
    step_2_title: "Choisissez une catégorie",
    step_2_desc: "Utilisez les onglets pour basculer entre les conversions de casse, le nettoyage de texte et les formats de programmation.",
    step_3_title: "Appliquez et copiez",
    step_3_desc: "Cliquez sur la conversion souhaitée et copiez le résultat formaté pour l'utiliser dans des documents, des publications, du code ou des messages texte.",
    apps_title: "Applications et Cas d'Utilisation",
    app_1_t: "Écriture et édition",
    app_1_d: "Corrigez les majuscules, standardisez les textes et préparez les titres plus rapidement.",
    app_2_t: "SEO et contenu",
    app_2_d: "Créez des titres, des URL conviviales et des extraits plus propres pour les articles, les pages et les métadonnées.",
    app_3_t: "Programmation",
    app_3_d: "Transformez les phrases en camelCase, PascalCase, snake_case, kebab-case et dot.case pour les variables, les classes et les espaces de noms.",
    app_4_t: "Nettoyage de texte",
    app_4_d: "Supprimez les accents, les nombres, la ponctuation, les lignes vides, les espaces supplémentaires et les sauts de ligne.",
    app_5_t: "Réutilisation",
    app_5_d: "Adapte le même texte pour les documents, les réseaux sociaux, le code, les URL et les descriptions techniques.",
    edge_title: "Précision et Cas Spéciaux",
    edge_desc: "Le convertisseur couvre des détails pratiques qui font la différence lorsque le même contenu doit circuler dans différents formats.",
    edge_1_t: "Plusieurs modes de casse",
    edge_1_d: "Utilisez les majuscules, les minuscules, la capitalisation, le format de titre, le format de phrase, la casse alternée et l'inversion de casse.",
    edge_2_t: "Nettoyage de formatage",
    edge_2_d: "Éliminez les problèmes courants du texte copié depuis des PDF, des feuilles de calcul, des documents et des pages web.",
    edge_3_t: "Formats techniques",
    edge_3_d: "Générez des noms compatibles avec les normes de code courantes, les slugs et les chemins de configuration.",
    edge_4_t: "Flux de travail rapide",
    edge_4_d: "Tout se passe dans le navigateur : collez, transformez et copiez avec confidentialité et rapidité.",
    conversion_title: "Types de Conversion Disponibles",
    conversion_desc: "Les conversions sont organisées par objectif pour faciliter le choix lors de l'édition.",
    conversion_case: "Convertit entre MAJUSCULES, minuscules, Capitaliser, Casse de Titre, Casse de phrase, aLtErNeR, iNVERSER LA CASSE et texte inversé.",
    conversion_clean: "Supprime les accents, les espaces supplémentaires, les sauts de ligne, les lignes vides, les nombres et la ponctuation.",
    conversion_code: "Génère du camelCase, PascalCase, snake_case, kebab-case, URL slug et dot.case.",
    faq_title: "Questions Fréquentes",
    faq1q: "Que fait ce convertisseur de texte ?",
    faq1a: "Cet outil modifie la casse du texte, effectue un nettoyage du formatage, supprime les accents et les espaces, et convertit les phrases en styles de programmation comme camelCase, snake_case et kebab-case.",
    faq2q: "Puis-je l'utiliser pour les noms de variables en programmation ?",
    faq2a: "Oui. L'onglet de programmation convertit le texte en camelCase, PascalCase, snake_case, kebab-case, dot.case et en slugs d'URL.",
    faq3q: "Puis-je nettoyer le texte copié à partir de PDF ou de documents ?",
    faq3a: "Oui. Les outils de nettoyage suppriment les espaces supplémentaires, les lignes vides, les sauts de ligne, les nombres, la ponctuation et les accents du texte copié.",
    faq4q: "Comment convertir des majuscules en minuscules ?",
    faq4a: "Il suffit de coller votre texte dans la zone principale et de cliquer sur le bouton 'minuscules' dans l'onglet de conversion. Le texte sera instantanément transformé.",
    features_title: "Fonctionnalités Principales",
    feature1: "Conversion en majuscules, minuscules, casse de titre et casse de phrase",
    feature2: "Outils pour supprimer les espaces, les accents, la ponctuation et les sauts de ligne",
    feature3: "Formats de programmation comme camelCase, snake_case et kebab-case",
    feature4: "Génération de slug URL et conversion en dot.case",
    tab1: "Majuscules/Minuscules",
    tab2: "Nettoyer le Texte",
    tab3: "Programmation",
    bup: "MAJUSCULES",
    blow: "minuscules",
    balt: "aLtErNeR",
    bcap: "Capitaliser",
    btitle: "Casse de Titre",
    bsent: "Casse de phrase",
    btoggle: "iNVERSER LA CASSE",
    bacc: "Supprimer les Accents",
    bspaces: "Supprimer les Espaces Suppl.",
    brlb: "Supprimer les Sauts de Ligne",
    brbl: "Supprimer les Lignes Vides",
    bnumbers: "Supprimer les Nombres",
    bpunct: "Supprimer la Ponctuation",
    bslug: "URL Slug",
    brev: "Inverser le Texte",
    plc: "Collez votre texte ici ou faites glisser un fichier",
    chars: "caractères",
    words: "mots",
    copy: "Copier",
    copied: "Copié !",
    see1: "Caractère Invisible",
    see2: "Lettres Différentes",
    see3: "Compteur de Texte",
    see4: "Comparateur de Texte"
  },
  it: {
    m_title: "Convertitore di Maiuscole e Minuscole Online Gratis",
    title: "Convertitore di Testo",
    meta: "Converti il testo da maiuscole in minuscole (e viceversa), rimuovi gli accenti, pulisci gli spazi extra e molto altro. Tutto ciò di cui hai bisogno per formattare e standardizzare i testi in modo semplice, rapido e gratuito.",
    about_desc: "Questo convertitore di testo online ti consente di modificare, formattare e organizzare i testi rapidamente in un unico strumento. Inserisci il tuo contenuto per convertire le lettere in maiuscole e minuscole, rimuovere gli accenti, ripulire le formattazioni indesiderate dai testi copiati e trasformare le frasi in diversi stili di scrittura, anche per i social network. Ideale per standardizzare documenti, formattare messaggi e organizzare elenchi in modo pratico, veloce ed efficiente.",
    how_to_use_title: "Come usare il Convertitore di Testo",
    step_1_title: "Incolla o digita il testo",
    step_1_desc: "Inserisci il contenuto nel campo principale o trascina un file di testo per caricarlo.",
    step_2_title: "Scegli una categoria",
    step_2_desc: "Usa le schede per passare dalla conversione delle maiuscole/minuscole alla pulizia del testo o ai formati di programmazione.",
    step_3_title: "Applica e copia",
    step_3_desc: "Clicca sulla conversione desiderata e copia il risultato formattato per utilizzarlo in documenti, post, codice o messaggi di testo.",
    apps_title: "Applicazioni e Casi d'Uso",
    app_1_t: "Scrittura e modifica",
    app_1_d: "Correggi le maiuscole, standardizza i testi e prepara i titoli più velocemente.",
    app_2_t: "SEO e contenuti",
    app_2_d: "Crea titoli, URL SEO-friendly e snippet più puliti per articoli, pagine e metadati.",
    app_3_t: "Programmazione",
    app_3_d: "Trasforma le frasi in camelCase, PascalCase, snake_case, kebab-case e dot.case per variabili, classi e namespace.",
    app_4_t: "Pulizia del testo",
    app_4_d: "Rimuovi accenti, numeri, punteggiatura, righe vuote, spazi extra e interruzioni di riga.",
    app_5_t: "Riutilizzo",
    app_5_d: "Adatta lo stesso testo per documenti, social network, codice, URL e descrizioni tecniche.",
    edge_title: "Precisione e Casi Speciali",
    edge_desc: "Il convertitore copre dettagli pratici che fanno la differenza quando lo stesso contenuto deve circolare in formati diversi.",
    edge_1_t: "Molteplici modalità di conversione",
    edge_1_d: "Usa maiuscole, minuscole, capitalizzazione, title case, sentence case, alternato e inverti maiuscole/minuscole.",
    edge_2_t: "Pulizia della formattazione",
    edge_2_d: "Elimina i problemi comuni dal testo copiato da PDF, fogli di calcolo, documenti e pagine web.",
    edge_3_t: "Formati tecnici",
    edge_3_d: "Genera nomi compatibili con i comuni standard di codice, slug e percorsi di configurazione.",
    edge_4_t: "Flusso di lavoro veloce",
    edge_4_d: "Tutto avviene nel browser: incolla, trasforma e copia con privacy e velocità.",
    conversion_title: "Tipi di Conversione Disponibili",
    conversion_desc: "Le conversioni sono organizzate per scopo per facilitare la scelta durante la modifica.",
    conversion_case: "Converte tra MAIUSCOLE, minuscole, Capitalizza, Title Case, Sentence case, aLtErNaTo, iNVERTI MAIUSCOLE/MINUSCOLE e testo invertito.",
    conversion_clean: "Rimuove accenti, spazi extra, interruzioni di riga, righe vuote, numeri e punteggiatura.",
    conversion_code: "Genera camelCase, PascalCase, snake_case, kebab-case, URL slug e dot.case.",
    faq_title: "Domande Frequenti",
    faq1q: "Cosa fa questo convertitore di testo?",
    faq1a: "Questo strumento modifica le maiuscole/minuscole del testo, esegue la pulizia della formattazione, rimuove accenti e spazi e converte le frasi in stili di programmazione come camelCase, snake_case e kebab-case.",
    faq2q: "Posso usarlo per i nomi delle variabili in programmazione?",
    faq2a: "Sì. La scheda di programmazione converte il testo in camelCase, PascalCase, snake_case, kebab-case, dot.case e URL slug.",
    faq3q: "Posso pulire il testo copiato da PDF o documenti?",
    faq3a: "Sì. Gli strumenti di pulizia rimuovono spazi extra, righe vuote, interruzioni di riga, numeri, punteggiatura e accenti dai testi copiati.",
    faq4q: "Come convertire le maiuscole in minuscole?",
    faq4a: "Basta incollare il testo nell'area principale e cliccare sul pulsante 'minuscole' nella scheda di conversione. Il testo verrà trasformato istantaneamente.",
    features_title: "Funzionalità Principali",
    feature1: "Conversione in maiuscolo, minuscolo, title case e sentence case",
    feature2: "Strumenti per rimuovere spazi, accenti, punteggiatura e interruzioni di riga",
    feature3: "Formati di programmazione come camelCase, snake_case e kebab-case",
    feature4: "Generazione di URL slug e conversione in dot.case",
    tab1: "Maiuscole/Minuscole",
    tab2: "Pulizia Testo",
    tab3: "Programmazione",
    bup: "MAIUSCOLE",
    blow: "minuscole",
    balt: "aLtErNaTo",
    bcap: "Capitalizza",
    btitle: "Title Case",
    bsent: "Sentence case",
    btoggle: "iNVERTI MAI/MIN",
    bacc: "Rimuovi Accenti",
    bspaces: "Rimuovi Spazi Extra",
    brlb: "Rimuovi Interruzioni di Riga",
    brbl: "Rimuovi Righe Vuote",
    bnumbers: "Rimuovi Numeri",
    bpunct: "Rimuovi Punteggiatura",
    bslug: "URL Slug",
    brev: "Inverti Testo",
    plc: "Incolla qui il tuo testo o trascina un file",
    chars: "caratteri",
    words: "parole",
    copy: "Copia",
    copied: "Copiato!",
    see1: "Carattere Invisibile",
    see2: "Lettere Diverse",
    see3: "Contatore di Testo",
    see4: "Comparatore di Testo"
  },
  id: {
    m_title: "Konverter Huruf Besar dan Kecil Online Gratis",
    title: "Konverter Teks",
    meta: "Ubah teks dari huruf besar menjadi huruf kecil (dan sebaliknya), hapus aksen, bersihkan spasi berlebih, dan banyak lagi. Semua yang Anda butuhkan untuk memformat dan menstandarkan teks secara sederhana, cepat, dan gratis.",
    about_desc: "Konverter teks online ini memungkinkan Anda mengedit, memformat, dan mengatur teks dengan cepat dalam satu alat. Masukkan konten Anda untuk mengubah huruf menjadi huruf besar dan kecil, menghapus aksen, membersihkan format yang tidak diinginkan dari teks yang disalin, dan mengubah kalimat menjadi berbagai gaya penulisan, termasuk untuk media sosial. Ideal untuk menstandarkan dokumen, memformat pesan, dan mengatur daftar secara praktis, cepat, dan efisien.",
    how_to_use_title: "Cara Menggunakan Konverter Teks",
    step_1_title: "Tempel atau ketik teks",
    step_1_desc: "Masukkan konten di bidang utama atau seret dan lepas file teks untuk memuat konten.",
    step_2_title: "Pilih kategori",
    step_2_desc: "Gunakan tab untuk beralih antara konversi huruf besar/kecil, pembersihan teks, dan format pemrograman.",
    step_3_title: "Terapkan dan salin",
    step_3_desc: "Klik konversi yang diinginkan dan salin hasil yang diformat untuk digunakan dalam dokumen, postingan, kode, atau pesan teks.",
    apps_title: "Aplikasi dan Contoh Penggunaan",
    app_1_t: "Penulisan dan pengeditan",
    app_1_d: "Perbaiki kapitalisasi, standarkan teks, dan siapkan judul dengan lebih cepat.",
    app_2_t: "SEO dan konten",
    app_2_d: "Buat judul, URL ramah SEO, dan cuplikan yang lebih bersih untuk artikel, halaman, dan metadata.",
    app_3_t: "Pemrograman",
    app_3_d: "Ubah kalimat menjadi camelCase, PascalCase, snake_case, kebab-case, dan dot.case untuk variabel, kelas, dan namespace.",
    app_4_t: "Pembersihan teks",
    app_4_d: "Hapus aksen, angka, tanda baca, baris kosong, spasi berlebih, dan jeda baris.",
    app_5_t: "Penggunaan ulang",
    app_5_d: "Sesuaikan teks yang sama untuk dokumen, media sosial, kode, URL, dan deskripsi teknis.",
    edge_title: "Presisi dan Kasus Khusus",
    edge_desc: "Konverter ini mencakup detail praktis yang membuat perbedaan saat konten yang sama perlu diedarkan dalam berbagai format.",
    edge_1_t: "Berbagai mode konversi huruf",
    edge_1_d: "Gunakan huruf besar, huruf kecil, kapitalisasi, huruf judul, huruf kalimat, huruf bergantian, dan kebalikan huruf besar/kecil.",
    edge_2_t: "Pembersihan format",
    edge_2_d: "Hilangkan masalah umum dari teks yang disalin dari PDF, spreadsheet, dokumen, dan halaman web.",
    edge_3_t: "Format teknis",
    edge_3_d: "Hasilkan nama yang kompatibel dengan standar kode umum, slug, dan jalur konfigurasi.",
    edge_4_t: "Alur kerja cepat",
    edge_4_d: "Semuanya terjadi di browser: tempel, ubah, dan salin dengan privasi dan kecepatan.",
    conversion_title: "Jenis Konversi yang Tersedia",
    conversion_desc: "Konversi diatur berdasarkan tujuan agar lebih mudah dipilih saat mengedit.",
    conversion_case: "Mengonversi antara HURUF BESAR, huruf kecil, Kapitalisasi, Huruf Judul, Huruf kalimat, bErGaNtIaN, kEbAlIkAn, dan teks terbalik.",
    conversion_clean: "Menghapus aksen, spasi berlebih, jeda baris, baris kosong, angka, dan tanda baca.",
    conversion_code: "Menghasilkan camelCase, PascalCase, snake_case, kebab-case, slug URL, dan dot.case.",
    faq_title: "Pertanyaan yang Sering Diajukan",
    faq1q: "Apa fungsi konverter teks ini?",
    faq1a: "Alat ini mengubah besar/kecil teks, membersihkan format, menghapus aksen dan spasi, dan mengubah kalimat menjadi gaya pemrograman seperti camelCase, snake_case, dan kebab-case.",
    faq2q: "Bisakah saya menggunakannya untuk nama variabel pemrograman?",
    faq2a: "Ya. Tab pemrograman mengonversi teks menjadi camelCase, PascalCase, snake_case, kebab-case, dot.case, dan slug URL.",
    faq3q: "Bisakah saya membersihkan teks yang disalin dari PDF atau dokumen?",
    faq3a: "Ya. Alat pembersihan menghapus spasi berlebih, baris kosong, jeda baris, angka, tanda baca, dan aksen dari teks yang disalin.",
    faq4q: "Bagaimana cara mengubah huruf besar menjadi huruf kecil?",
    faq4a: "Cukup tempelkan teks Anda ke area utama dan klik tombol 'huruf kecil' di tab konversi. Teks akan langsung diubah.",
    features_title: "Fitur Utama",
    feature1: "Konversi ke huruf besar, huruf kecil, huruf judul, dan huruf kalimat",
    feature2: "Alat untuk menghapus spasi, aksen, tanda baca, dan jeda baris",
    feature3: "Format pemrograman seperti camelCase, snake_case, dan kebab-case",
    feature4: "Pembuatan slug URL dan konversi ke dot.case",
    tab1: "Huruf Besar/Kecil",
    tab2: "Pembersihan Teks",
    tab3: "Pemrograman",
    bup: "HURUF BESAR",
    blow: "huruf kecil",
    balt: "bErGaNtIaN",
    bcap: "Kapitalisasi",
    btitle: "Huruf Judul",
    bsent: "Huruf kalimat",
    btoggle: "kEbAlIkAn",
    bacc: "Hapus Aksen",
    bspaces: "Hapus Spasi Berlebih",
    brlb: "Hapus Jeda Baris",
    brbl: "Hapus Baris Kosong",
    bnumbers: "Hapus Angka",
    bpunct: "Hapus Tanda Baca",
    bslug: "Slug URL",
    brev: "Balikkan Teks",
    plc: "Tempel teks Anda di sini atau seret dan lepas file",
    chars: "karakter",
    words: "kata",
    copy: "Salin",
    copied: "Disalin!",
    see1: "Karakter Tak Terlihat",
    see2: "Huruf Berbeda",
    see3: "Penghitung Teks",
    see4: "Komparator Teks"
  },
  de: {
    m_title: "Groß- und Kleinschreibung Konverter Online Kostenlos",
    title: "Textkonverter",
    meta: "Konvertieren Sie Text von Großbuchstaben in Kleinbuchstaben (und umgekehrt), entfernen Sie Akzente, bereinigen Sie zusätzliche Leerzeichen und vieles mehr. Alles, was Sie brauchen, um Texte einfach, schnell und kostenlos zu formatieren und zu standardisieren.",
    about_desc: "Dieser Online-Textkonverter ermöglicht es Ihnen, Texte schnell in einem einzigen Tool zu bearbeiten, zu formatieren und zu organisieren. Fügen Sie Ihren Inhalt ein, um Buchstaben in Groß- und Kleinbuchstaben umzuwandeln, Akzente zu entfernen, unerwünschte Formatierungen aus kopierten Texten zu bereinigen und Sätze in verschiedene Schreibstile umzuwandeln, auch für soziale Medien. Ideal, um Dokumente zu standardisieren, Nachrichten zu formatieren und Listen praktisch, schnell und effizient zu organisieren.",
    how_to_use_title: "So verwenden Sie den Textkonverter",
    step_1_title: "Text einfügen oder eingeben",
    step_1_desc: "Fügen Sie den Inhalt in das Hauptfeld ein oder ziehen Sie eine Textdatei hinein, um den Inhalt zu laden.",
    step_2_title: "Kategorie wählen",
    step_2_desc: "Verwenden Sie die Registerkarten, um zwischen Groß-/Kleinschreibung, Textbereinigung und Programmierformaten zu wechseln.",
    step_3_title: "Anwenden und kopieren",
    step_3_desc: "Klicken Sie auf die gewünschte Konvertierung und kopieren Sie das formatierte Ergebnis, um es in Dokumenten, Beiträgen, Code oder Textnachrichten zu verwenden.",
    apps_title: "Anwendungen und Anwendungsfälle",
    app_1_t: "Schreiben und Bearbeiten",
    app_1_d: "Korrigieren Sie die Groß-/Kleinschreibung, standardisieren Sie Texte und bereiten Sie Titel schneller vor.",
    app_2_t: "SEO und Inhalte",
    app_2_d: "Erstellen Sie Titel, SEO-freundliche URLs und sauberere Snippets für Artikel, Seiten und Metadaten.",
    app_3_t: "Programmierung",
    app_3_d: "Verwandeln Sie Sätze in camelCase, PascalCase, snake_case, kebab-case und dot.case für Variablen, Klassen und Namespaces.",
    app_4_t: "Textbereinigung",
    app_4_d: "Entfernen Sie Akzente, Zahlen, Satzzeichen, Leerzeilen, zusätzliche Leerzeichen und Zeilenumbrüche.",
    app_5_t: "Wiederverwendung",
    app_5_d: "Passen Sie denselben Text für Dokumente, soziale Medien, Code, URLs und technische Beschreibungen an.",
    edge_title: "Präzision und Sonderfälle",
    edge_desc: "Der Konverter deckt praktische Details ab, die den Unterschied machen, wenn derselbe Inhalt in verschiedenen Formaten zirkulieren muss.",
    edge_1_t: "Mehrere Konvertierungsmodi",
    edge_1_d: "Verwenden Sie Großbuchstaben, Kleinbuchstaben, Kapitalisieren, Titel-Schreibweise, Satz-Schreibweise, abwechselnd und Fall umkehren.",
    edge_2_t: "Formatierungsbereinigung",
    edge_2_d: "Beseitigen Sie häufige Probleme bei kopiertem Text aus PDFs, Tabellenkalkulationen, Dokumenten und Webseiten.",
    edge_3_t: "Technische Formate",
    edge_3_d: "Generieren Sie Namen, die mit gängigen Code-Standards, Slugs und Konfigurationspfaden kompatibel sind.",
    edge_4_t: "Schneller Workflow",
    edge_4_d: "Alles passiert im Browser: Einfügen, transformieren und kopieren mit Datenschutz und Geschwindigkeit.",
    conversion_title: "Verfügbare Konvertierungsarten",
    conversion_desc: "Die Konvertierungen sind nach Zweck organisiert, um die Auswahl während der Bearbeitung zu erleichtern.",
    conversion_case: "Konvertiert zwischen GROSSBUCHSTABEN, kleinbuchstaben, Kapitalisieren, Titel-Schreibweise, Satz-schreibweise, aBwEcHsElNd, fALL uMKEHREN und umgekehrtem Text.",
    conversion_clean: "Entfernt Akzente, zusätzliche Leerzeichen, Zeilenumbrüche, Leerzeilen, Zahlen und Satzzeichen.",
    conversion_code: "Generiert camelCase, PascalCase, snake_case, kebab-case, URL-Slug und dot.case.",
    faq_title: "Häufig gestellte Fragen",
    faq1q: "Was macht dieser Textkonverter?",
    faq1a: "Dieses Tool ändert die Groß-/Kleinschreibung des Textes, bereinigt die Formatierung, entfernt Akzente und Leerzeichen und wandelt Sätze in Programmierstile wie camelCase, snake_case und kebab-case um.",
    faq2q: "Kann ich es für Variablennamen in der Programmierung verwenden?",
    faq2a: "Ja. Die Registerkarte Programmierung konvertiert Text in camelCase, PascalCase, snake_case, kebab-case, dot.case und URL-Slugs.",
    faq3q: "Kann ich Text bereinigen, der aus PDFs oder Dokumenten kopiert wurde?",
    faq3a: "Ja. Die Bereinigungstools entfernen zusätzliche Leerzeichen, Leerzeilen, Zeilenumbrüche, Zahlen, Satzzeichen und Akzente aus kopiertem Text.",
    faq4q: "Wie wandle ich Großbuchstaben in Kleinbuchstaben um?",
    faq4a: "Fügen Sie einfach Ihren Text in den Hauptbereich ein und klicken Sie auf die Schaltfläche 'kleinschreibung' in der Registerkarte für die Groß-/Kleinschreibung. Der Text wird sofort umgewandelt.",
    features_title: "Hauptmerkmale",
    feature1: "Konvertierung in Großbuchstaben, Kleinbuchstaben, Titel-Schreibweise und Satz-Schreibweise",
    feature2: "Tools zum Entfernen von Leerzeichen, Akzenten, Satzzeichen und Zeilenumbrüchen",
    feature3: "Programmierformate wie camelCase, snake_case und kebab-case",
    feature4: "Generierung von URL-Slugs und Konvertierung in dot.case",
    tab1: "Groß-/Kleinschreibung",
    tab2: "Text bereinigen",
    tab3: "Programmierung",
    bup: "GROSSBUCHSTABEN",
    blow: "kleinbuchstaben",
    balt: "aBwEcHsElNd",
    bcap: "Kapitalisieren",
    btitle: "Titel-Schreibweise",
    bsent: "Satz-schreibweise",
    btoggle: "fALL uMKEHREN",
    bacc: "Akzente entfernen",
    bspaces: "Zusätzliche Leerzeichen entfernen",
    brlb: "Zeilenumbrüche entfernen",
    brbl: "Leerzeilen entfernen",
    bnumbers: "Zahlen entfernen",
    bpunct: "Satzzeichen entfernen",
    bslug: "URL-Slug",
    brev: "Text umkehren",
    plc: "Fügen Sie hier Ihren Text ein oder ziehen Sie eine Datei hinein",
    chars: "Zeichen",
    words: "Wörter",
    copy: "Kopieren",
    copied: "Kopiert!",
    see1: "Unsichtbares Zeichen",
    see2: "Verschiedene Buchstaben",
    see3: "Textzähler",
    see4: "Textvergleicher"
  },
  nl: {
    m_title: "Tekst Converter Online Gratis – Hoofdletters en Kleine Letters",
    title: "Tekst Converter",
    meta: "Converteer tekst van hoofdletters naar kleine letters (en vice versa), verwijder accenten, wis extra spaties en nog veel meer. Alles wat je nodig hebt om teksten eenvoudig, snel en gratis op te maken en te standaardiseren.",
    about_desc: "Met deze online tekstconverter kun je teksten snel bewerken, opmaken en ordenen in één enkele tool. Voeg je inhoud in om letters om te zetten in hoofdletters en kleine letters, accenten te verwijderen, ongewenste opmaak uit gekopieerde teksten te wissen en zinnen om te zetten in verschillende schrijfstijlen, inclusief voor sociale media. Ideaal voor het standaardiseren van documenten, het opmaken van berichten en het ordenen van lijsten op een praktische, snelle en efficiënte manier.",
    how_to_use_title: "Hoe de Tekst Converter te gebruiken",
    step_1_title: "Plak of typ de tekst",
    step_1_desc: "Voeg de inhoud in het hoofdveld in of sleep een tekstbestand om de inhoud te laden.",
    step_2_title: "Kies een categorie",
    step_2_desc: "Gebruik de tabbladen om te schakelen tussen het converteren van hoofdletters/kleine letters, tekst opschonen en programmeerformaten.",
    step_3_title: "Toepassen en kopiëren",
    step_3_desc: "Klik op de gewenste conversie en kopieer het opgemaakte resultaat om het te gebruiken in documenten, posts, code of tekstberichten.",
    apps_title: "Toepassingen en Use Cases",
    app_1_t: "Schrijven en bewerken",
    app_1_d: "Corrigeer hoofdletters, standaardiseer teksten en bereid titels sneller voor.",
    app_2_t: "SEO en inhoud",
    app_2_d: "Maak titels, SEO-vriendelijke URL's en schonere snippets voor artikelen, pagina's en metadata.",
    app_3_t: "Programmering",
    app_3_d: "Zet zinnen om in camelCase, PascalCase, snake_case, kebab-case en dot.case voor variabelen, klassen en namespaces.",
    app_4_t: "Tekst opschonen",
    app_4_d: "Verwijder accenten, cijfers, interpunctie, lege regels, extra spaties en regeleinden.",
    app_5_t: "Hergebruik",
    app_5_d: "Pas dezelfde tekst aan voor documenten, sociale media, code, URL's en technische beschrijvingen.",
    edge_title: "Precisie en Speciale Gevallen",
    edge_desc: "De converter dekt praktische details die het verschil maken wanneer dezelfde inhoud in verschillende formaten moet circuleren.",
    edge_1_t: "Meerdere conversiemodi",
    edge_1_d: "Gebruik hoofdletters, kleine letters, kapitaliseren, titel case, zin case, afwisselend en keer om.",
    edge_2_t: "Opmaak opschonen",
    edge_2_d: "Verwijder veelvoorkomende problemen uit tekst gekopieerd van PDF's, spreadsheets, documenten en webpagina's.",
    edge_3_t: "Technische formaten",
    edge_3_d: "Genereer namen die compatibel zijn met veelvoorkomende codestandaarden, slugs en configuratiepaden.",
    edge_4_t: "Snelle workflow",
    edge_4_d: "Alles gebeurt in de browser: plakken, transformeren en kopiëren met privacy en snelheid.",
    conversion_title: "Beschikbare Conversietypes",
    conversion_desc: "Conversies zijn georganiseerd per doel om het kiezen tijdens het bewerken te vergemakkelijken.",
    conversion_case: "Converteert tussen HOOFDLETTERS, kleine letters, Kapitaliseren, Titel Case, Zin case, aFwIsSeLeNd, oMGEKEERD en omgekeerde tekst.",
    conversion_clean: "Verwijdert accenten, extra spaties, regeleinden, lege regels, cijfers en interpunctie.",
    conversion_code: "Genereert camelCase, PascalCase, snake_case, kebab-case, URL slug en dot.case.",
    faq_title: "Veelgestelde Vragen",
    faq1q: "Wat doet deze tekst converter?",
    faq1a: "Deze tool wijzigt de hoofdletters/kleine letters van de tekst, voert opmaak opschonen uit, verwijdert accenten en spaties, en converteert zinnen naar programmeerstijlen zoals camelCase, snake_case en kebab-case.",
    faq2q: "Kan ik het gebruiken voor variabelenamen bij het programmeren?",
    faq2a: "Ja. Het tabblad programmeren converteert tekst naar camelCase, PascalCase, snake_case, kebab-case, dot.case en URL slugs.",
    faq3q: "Kan ik tekst opschonen die gekopieerd is uit PDF's of documenten?",
    faq3a: "Ja. De opschoontools verwijderen extra spaties, lege regels, regeleinden, cijfers, interpunctie en accenten uit gekopieerde tekst.",
    faq4q: "Hoe verander ik hoofdletters in kleine letters?",
    faq4a: "Plak uw tekst in het hoofdgebied en klik op de knop 'kleine letters' in het conversietabblad. De tekst wordt direct getransformeerd.",
    features_title: "Belangrijkste Kenmerken",
    feature1: "Conversie naar hoofdletters, kleine letters, titel case en zin case",
    feature2: "Tools om spaties, accenten, interpunctie en regeleinden te verwijderen",
    feature3: "Programmeerformaten zoals camelCase, snake_case en kebab-case",
    feature4: "URL slug generatie en conversie naar dot.case",
    tab1: "Hoofdletters/Kleine letters",
    tab2: "Tekst Opschonen",
    tab3: "Programmering",
    bup: "HOOFDLETTERS",
    blow: "kleine letters",
    balt: "aFwIsSeLeNd",
    bcap: "Kapitaliseren",
    btitle: "Titel Case",
    bsent: "Zin case",
    btoggle: "oMGEKEERD",
    bacc: "Accenten Verwijderen",
    bspaces: "Extra Spaties Verwijderen",
    brlb: "Regeleinden Verwijderen",
    brbl: "Lege Regels Verwijderen",
    bnumbers: "Cijfers Verwijderen",
    bpunct: "Interpunctie Verwijderen",
    bslug: "URL Slug",
    brev: "Tekst Omkeren",
    plc: "Plak hier je tekst of sleep een bestand",
    chars: "tekens",
    words: "woorden",
    copy: "Kopiëren",
    copied: "Gekopieerd!",
    see1: "Onzichtbaar Teken",
    see2: "Verschillende Letters",
    see3: "Tekst Teller",
    see4: "Tekst Vergelijker"
  },
  ru: {
    m_title: "Онлайн-конвертер текста — регистр, удаление пробелов и акцентов",
    title: "Конвертер текста",
    meta: "Бесплатный онлайн-конвертер текста. Преобразование регистра (из заглавных в строчные и наоборот), удаление акцентов, лишних пробелов, пустых строк и пунктуации. Быстро и удобно.",
    about_desc: "Этот бесплатный онлайн-конвертер позволяет быстро редактировать, форматировать и упорядочивать текст прямо в браузере. Вы можете легко преобразовывать регистр букв, удалять диакритические знаки (акценты), очищать нежелательное форматирование из скопированных текстов, а также переводить фразы в различные стили написания, включая форматы для программирования и соцсетей. Идеально подходит для стандартизации документов, подготовки сообщений и структурирования списков.",
    how_to_use_title: "Как использовать конвертер текста",
    step_1_title: "Вставьте или введите текст",
    step_1_desc: "Введите ваш текст в главное поле или просто перетащите текстовый файл для его загрузки.",
    step_2_title: "Выберите категорию",
    step_2_desc: "Используйте вкладки для переключения между изменением регистра, очисткой текста и стилями для программирования.",
    step_3_title: "Примените и скопируйте",
    step_3_desc: "Нажмите на нужную кнопку конвертации и скопируйте отформатированный результат для использования в документах, коде или сообщениях.",
    apps_title: "Сферы применения и примеры использования",
    app_1_t: "Редактирование и копирайтинг",
    app_1_d: "Быстро исправляйте регистр букв, приводите тексты к единому стандарту и оформляйте заголовки.",
    app_2_t: "SEO и контент-маркетинг",
    app_2_d: "Создавайте заголовки, оптимизированные для поисковых систем URL-адреса и чистые сниппеты для веб-страниц.",
    app_3_t: "Программирование",
    app_3_d: "Преобразуйте обычные фразы в camelCase, PascalCase, snake_case, kebab-case и dot.case для имен переменных, классов и пространств имен.",
    app_4_t: "Очистка данных",
    app_4_d: "Легко удаляйте акценты, цифры, пунктуацию, пустые строки, лишние пробелы и переносы.",
    app_5_t: "Адаптация контента",
    app_5_d: "Быстро адаптируйте один и тот же текст для документов, соцсетей, кода, URL-адресов и технических описаний.",
    edge_title: "Точность и особые случаи",
    edge_desc: "Конвертер учитывает практические нюансы, которые важны при переносе контента между различными форматами.",
    edge_1_t: "Множество режимов регистра",
    edge_1_d: "Используйте заглавные, строчные буквы, капитализацию каждого слова, регистр заголовков, предложений, чередование или инверсию.",
    edge_2_t: "Очистка форматирования",
    edge_2_d: "Устраняйте частые проблемы при копировании текста из PDF-файлов, электронных таблиц, документов и веб-страниц.",
    edge_3_t: "Технические форматы",
    edge_3_d: "Генерируйте имена, совместимые с популярными стандартами кода, URL-слагами и путями конфигурации.",
    edge_4_t: "Быстрый рабочий процесс",
    edge_4_d: "Все вычисления происходят прямо в браузере: ваши данные конфиденциальны, а обработка происходит мгновенно.",
    conversion_title: "Доступные типы конвертации",
    conversion_desc: "Все операции удобно распределены по категориям для быстрого выбора во время редактирования.",
    conversion_case: "Изменение регистра: ЗАГЛАВНЫЕ, строчные, Начинать С Прописных, Регистр Заголовков, Регистр предложений, чЕрЕдОвАнИе, иНвЕрСиЯ и перевернутый текст.",
    conversion_clean: "Очистка текста: удаление акцентов, лишних пробелов, переносов строк, пустых строк, цифр и пунктуации.",
    conversion_code: "Форматы кода: генерация camelCase, PascalCase, snake_case, kebab-case, URL-слагов и dot.case.",
    faq_title: "Вопросы и ответы",
    faq1q: "Что делает этот конвертер текста?",
    faq1a: "Этот инструмент изменяет регистр букв, выполняет очистку форматирования, удаляет акценты и пробелы, а также преобразует обычные фразы в форматы кода, такие как camelCase, snake_case, kebab-case и другие.",
    faq2q: "Можно ли использовать его для имен переменных в программировании?",
    faq2a: "Да. Вкладка программирования преобразует текст в стандарты camelCase, PascalCase, snake_case, kebab-case, dot.case и URL-слаги.",
    faq3q: "Можно ли очистить текст, скопированный из PDF или документов?",
    faq3a: "Да. Инструменты очистки эффективно удаляют лишние пробелы, пустые строки, переносы строк, цифры, знаки препинания и акценты из любого скопированного фрагмента.",
    faq4q: "Как перевести заглавные буквы в строчные?",
    faq4a: "Просто вставьте ваш текст в главное поле ввода и нажмите кнопку «строчные» во вкладке изменения регистра. Текст будет преобразован мгновенно.",
    features_title: "Основные возможности",
    feature1: "Преобразование в заглавные, строчные буквы, регистр заголовков и предложений",
    feature2: "Удаление лишних пробелов, акцентов, пунктуации и переносов строк",
    feature3: "Популярные форматы кода: camelCase, snake_case, kebab-case",
    feature4: "Создание URL-слагов и преобразование в dot.case",
    tab1: "Регистр",
    tab2: "Очистка текста",
    tab3: "Программирование",
    bup: "ЗАГЛАВНЫЕ",
    blow: "строчные",
    balt: "чЕрЕдОвАнИе",
    bcap: "Начинать С Прописных",
    btitle: "Регистр Заголовков",
    bsent: "Регистр предложений",
    btoggle: "иНвЕрСиЯ",
    bacc: "Удалить акценты",
    bspaces: "Удалить лишние пробелы",
    brlb: "Удалить переносы строк",
    brbl: "Удалить пустые строки",
    bnumbers: "Удалить цифры",
    bpunct: "Удалить пунктуацию",
    bslug: "URL-слаг",
    brev: "Перевернуть текст",
    plc: "Вставьте ваш текст сюда или перетащите файл",
    chars: "символов",
    words: "слов",
    copy: "Копировать",
    copied: "Скопировано!",
    see1: "Невидимый символ",
    see2: "Красивые буквы",
    see3: "Счетчик текста",
    see4: "Сравнение текстов"
  }
}
</i18n>
