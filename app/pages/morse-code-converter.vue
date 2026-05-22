<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

// Constants outside setup — defined once per module, not per component instance
const MORSE_MAP: Readonly<Record<string, string>> = Object.freeze({
  A: '.-',   B: '-...', C: '-.-.', D: '-..',  E: '.',
  F: '..-.', G: '--.',  H: '....', I: '..',   J: '.---',
  K: '-.-',  L: '.-..', M: '--',   N: '-.',   O: '---',
  P: '.--.', Q: '--.-', R: '.-.',  S: '...',  T: '-',
  U: '..-',  V: '...-', W: '.--',  X: '-..-', Y: '-.--',
  Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '(': '-.--.', ')': '-.--.-', '&': '.-...',
  ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '@': '.--.-.'
})

const REVERSE_MORSE_MAP: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    Object.entries(MORSE_MAP).map(([char, code]) => [code, char])
  )
)

const WORD_SEPARATOR = ' / '
const UNKNOWN_CHAR = '?'
const MORSE_PATTERN = /^[.\-\s/]+$/
const MIN_LENGTH_FOR_DETECTION = 3

const LETTER_CODES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({ char: c, code: MORSE_MAP[c] }))
const NUMBER_CODES = '0123456789'.split('').map(c => ({ char: c, code: MORSE_MAP[c] }))
const PUNCT_CHARS: Array<{ char: string; key: string }> = [
  { char: '.', key: 'punct_period' }, { char: ',', key: 'punct_comma' },
  { char: '?', key: 'punct_question' }, { char: "'", key: 'punct_apostrophe' },
  { char: '!', key: 'punct_exclamation' }, { char: '(', key: 'punct_paren_open' },
  { char: ')', key: 'punct_paren_close' }, { char: '&', key: 'punct_ampersand' },
  { char: ':', key: 'punct_colon' }, { char: ';', key: 'punct_semicolon' },
  { char: '=', key: 'punct_equals' }, { char: '+', key: 'punct_plus' },
  { char: '-', key: 'punct_hyphen' }, { char: '_', key: 'punct_underscore' },
  { char: '"', key: 'punct_quote' }, { char: '@', key: 'punct_at' }
]

const DOT_DURATION = 0.1
const TONE_FREQ = 600
const RAMP_TIME = 0.005

const toneGain = ref(0.5)

const input = ref('')
const output = ref('')
const hasUnknown = ref(false)
const notMorseInput = ref(false)
const looksLikeMorse = ref(false)
const isPlaying = ref(false)
const lastDirection = ref<'encode' | 'decode' | null>(null)
let audioCtx: AudioContext | null = null
let stopTimeoutId: ReturnType<typeof setTimeout> | null = null

const punctTable = computed(() =>
  PUNCT_CHARS.map(({ char, key }) => ({ label: t(key), char, code: MORSE_MAP[char] }))
)

const hasMorseSymbols = computed(() => /[.\-]/.test(output.value))

const faqs = computed(() => [
  { question: t('faq1q'), answer: t('faq1a') },
  { question: t('faq2q'), answer: t('faq2a') },
  { question: t('faq3q'), answer: t('faq3a') },
  { question: t('faq4q'), answer: t('faq4a') },
  { question: t('faq5q'), answer: t('faq5a') },
  { question: t('faq6q'), answer: t('faq6a') },
  { question: t('faq7q'), answer: t('faq7a') },
  { question: t('faq8q'), answer: t('faq8a') }
])

const features = computed(() => [t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5')])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: features.value,
  faq: faqs.value
})

useHead({
  title: t('meta_title'),
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:title', content: t('meta_title') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: t('meta_title') },
    { name: 'twitter:description', content: t('meta') }
  ]
})

/**
 * Normalizes text by removing diacritics, converting smart quotes/dashes,
 * and replacing non-breaking spaces. Ensures the input matches the strict
 * ASCII subset supported by the Morse map.
 */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')                       // decompose accented chars (café → cafe + ◌́)
    .replace(/[\u0300-\u036f]/g, '')        // strip combining diacritical marks
    .replace(/[\u2018\u2019\u02BC]/g, "'")  // smart single quotes → straight quote
    .replace(/[\u201C\u201D]/g, '"')        // smart double quotes → straight quote
    .replace(/[\u2013\u2014]/g, '-')        // en-dash and em-dash → hyphen
    .replace(/\u00A0/g, ' ')                // non-breaking space → normal space
}

/**
 * Encodes plain text into International Morse Code.
 * Words are joined by ' / ' and letters by a single space.
 */
function encodeToMorse(text: string): { result: string; hasUnknown: boolean; looksLikeMorse?: boolean } {
  const trimmed = normalizeText(text).trim()
  if (!trimmed) return { result: '', hasUnknown: false }
  if (trimmed.length >= MIN_LENGTH_FOR_DETECTION && MORSE_PATTERN.test(trimmed)) {
    return { result: '', hasUnknown: false, looksLikeMorse: true }
  }

  let unknown = false
  const result = trimmed
    .toUpperCase()
    .split(/\s+/)
    .map(word =>
      Array.from(word)
        .map(char => {
          const code = MORSE_MAP[char]
          if (code) return code
          unknown = true
          return UNKNOWN_CHAR
        })
        .join(' ')
    )
    .join(WORD_SEPARATOR)

  return { result, hasUnknown: unknown }
}

/**
 * Decodes Morse Code back into plain text.
 * Accepts flexible whitespace around the word separator '/'.
 */
function decodeFromMorse(code: string): { result: string; hasUnknown: boolean; notMorse?: boolean } {
  const trimmed = code.trim()
  if (!trimmed) return { result: '', hasUnknown: false }
  if (!MORSE_PATTERN.test(trimmed)) return { result: '', hasUnknown: false, notMorse: true }

  let unknown = false
  const result = trimmed
    .split(/\s*\/\s*/)
    .map(word =>
      word
        .split(/\s+/)
        .filter(Boolean)
        .map(token => {
          const char = REVERSE_MORSE_MAP[token]
          if (char) return char
          unknown = true
          return UNKNOWN_CHAR
        })
        .join('')
    )
    .join(' ')

  return { result, hasUnknown: unknown }
}

function handleToMorse() {
  stopMorse()
  notMorseInput.value = false
  const { result, hasUnknown: unknown, looksLikeMorse: looks } = encodeToMorse(input.value)
  if (looks) {
    looksLikeMorse.value = true
    output.value = ''
    hasUnknown.value = false
    return
  }
  looksLikeMorse.value = false
  output.value = result
  hasUnknown.value = unknown
  lastDirection.value = 'encode'
}

function handleFromMorse() {
  stopMorse()
  looksLikeMorse.value = false
  const { result, hasUnknown: unknown, notMorse } = decodeFromMorse(input.value)
  if (notMorse) {
    notMorseInput.value = true
    output.value = ''
    hasUnknown.value = false
    return
  }
  notMorseInput.value = false
  output.value = result
  hasUnknown.value = unknown
  lastDirection.value = 'decode'
}

async function playMorse() {
  if (isPlaying.value || !output.value) return

  cleanupAudio()
  isPlaying.value = true
  audioCtx = new AudioContext()
  const ctx = audioCtx

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      isPlaying.value = false
      return
    }
  }

  const dot = DOT_DURATION
  const dash = dot * 3
  const symbolGap = dot
  const letterGap = dot * 3
  const wordGap = dot * 7

  let time = ctx.currentTime + 0.05
  const words = output.value.split(' / ')

  for (const [wi, word] of words.entries()) {
    const letters = word.trim().split(' ').filter(Boolean)
    for (const [li, letter] of letters.entries()) {
      const symbols = Array.from(letter)
      for (const [si, symbol] of symbols.entries()) {
        if (symbol !== '.' && symbol !== '-') continue
        const duration = symbol === '.' ? dot : dash
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = TONE_FREQ
        osc.type = 'sine'
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(toneGain.value, time + RAMP_TIME)
        gain.gain.setValueAtTime(toneGain.value, time + duration - RAMP_TIME)
        gain.gain.linearRampToValueAtTime(0, time + duration)
        osc.start(time)
        osc.stop(time + duration)
        time += duration
        if (si < symbols.length - 1) time += symbolGap
      }
      if (li < letters.length - 1) time += letterGap
    }
    if (wi < words.length - 1) time += wordGap
  }

  stopTimeoutId = setTimeout(() => cleanupAudio(), (time - ctx.currentTime + 0.1) * 1000)
}

function stopMorse() {
  cleanupAudio()
}

function cleanupAudio() {
  if (stopTimeoutId) {
    clearTimeout(stopTimeoutId)
    stopTimeoutId = null
  }
  if (audioCtx) {
    audioCtx.close().catch(() => { /* already closed */ })
    audioCtx = null
  }
  isPlaying.value = false
}

onBeforeUnmount(() => cleanupAudio())

defineI18nRoute({
  paths: {
    en: '/morse-code-converter',
    pt: '/conversor-de-codigo-morse',
    es: '/convertidor-de-codigo-morse',
    fr: '/convertisseur-code-morse',
    it: '/convertitore-codice-morse',
    id: '/konverter-kode-morse',
    de: '/morsecode-konverter',
    nl: '/morsecode-converter'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :see-also-links="[
      { label: t('see1'), to: 'text-converter' },
      { label: t('see2'), to: 'text-comparator' },
      { label: t('see3'), to: 'roman-numerals-converter' },
      { label: t('see4'), to: 'text-counter' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="form-control w-full">
        <label class="label" for="morse-input">
          <span class="label-text font-bold text-base-content">{{ t('label_input') }}</span>
        </label>
        <textarea
          id="morse-input"
          v-model="input"
          rows="5"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-base leading-relaxed font-mono"
          :placeholder="t('placeholder')"
          autofocus
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
        ></textarea>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <ButtonPrimary
          icon="heroicons:arrow-right-circle-20-solid"
          :disabled="!input.trim()"
          @click="handleToMorse"
        >
          {{ t('btn_to_morse') }}
        </ButtonPrimary>

        <ButtonSecondary
          icon="heroicons:arrow-left-circle-20-solid"
          :disabled="!input.trim()"
          @click="handleFromMorse"
        >
          {{ t('btn_from_morse') }}
        </ButtonSecondary>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        leave-active-class="transition duration-200 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="output || notMorseInput || looksLikeMorse" class="space-y-3" aria-live="polite" aria-atomic="true">
          <div v-if="notMorseInput" class="alert alert-info rounded-2xl">
            <Icon name="heroicons:information-circle-20-solid" class="w-5 h-5" aria-hidden="true" />
            <span class="text-sm">{{ t('warn_not_morse') }}</span>
          </div>

          <div v-if="looksLikeMorse" class="alert alert-info rounded-2xl">
            <Icon name="heroicons:information-circle-20-solid" class="w-5 h-5" aria-hidden="true" />
            <span class="text-sm">{{ t('warn_looks_morse') }}</span>
          </div>

          <div v-if="hasUnknown" class="alert alert-warning rounded-2xl">
            <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5" aria-hidden="true" />
            <span class="text-sm">{{ t('warn_unknown') }}</span>
          </div>

          <Blockcopy v-if="output" :label="t('result')" :content="output">
            {{ output }}
          </Blockcopy>

          <div v-if="lastDirection === 'encode' && hasMorseSymbols" class="flex items-center justify-end gap-3">
            <div class="flex items-center gap-2 opacity-70">
              <Icon name="heroicons:speaker-wave-20-solid" class="w-4 h-4 text-base-content/50 shrink-0" aria-hidden="true" />
              <input
                v-model.number="toneGain"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="range range-xs w-24"
                :aria-label="t('label_volume')"
              />
            </div>
            <button
              type="button"
              :aria-pressed="isPlaying"
              class="btn btn-sm gap-2 transition-all"
              :class="isPlaying ? 'btn-error' : 'btn-ghost text-base-content/70 hover:text-primary'"
              @click="isPlaying ? stopMorse() : playMorse()"
            >
              <Icon
                :name="isPlaying ? 'heroicons:stop-20-solid' : 'heroicons:speaker-wave-20-solid'"
                class="w-4 h-4"
                aria-hidden="true"
              />
              {{ isPlaying ? t('btn_stop') : t('btn_play') }}
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <p class="text-base-content/80 leading-relaxed">{{ t('about_desc') }}</p>
        <p class="text-base-content/80 leading-relaxed">{{ t('about_desc2') }}</p>

        <FeatureSection :title="t('features_title')" :items="features" />

        <div>
          <h2 class="text-xl font-bold text-base-content mb-3">{{ t('what_title') }}</h2>
          <div class="space-y-3">
            <p class="text-base-content/80 leading-relaxed">{{ t('what_p1') }}</p>
            <p class="text-base-content/80 leading-relaxed">{{ t('what_p2') }}</p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold text-base-content mb-3">{{ t('how_works_title') }}</h2>
          <div class="space-y-3">
            <p class="text-base-content/80 leading-relaxed">{{ t('how_works_p1') }}</p>
            <p class="text-base-content/80 leading-relaxed">{{ t('how_works_p2') }}</p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold text-base-content mb-4">{{ t('table_title') }}</h2>
          <div class="border border-base-content/10 rounded-2xl p-5 bg-base-200/30 space-y-5">
            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-2">{{ t('table_letters') }}</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 font-mono text-sm">
                <div v-for="{ char, code } in LETTER_CODES" :key="char" class="flex gap-2">
                  <span class="font-bold w-4 text-base-content">{{ char }}</span>
                  <span class="text-base-content/40">·</span>
                  <span class="text-base-content/70">{{ code }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-2">{{ t('table_numbers') }}</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 font-mono text-sm">
                <div v-for="{ char, code } in NUMBER_CODES" :key="char" class="flex gap-2">
                  <span class="font-bold w-4 text-base-content">{{ char }}</span>
                  <span class="text-base-content/40">·</span>
                  <span class="text-base-content/70">{{ code }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-2">{{ t('table_punct') }}</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 font-mono text-sm">
                <div v-for="{ label, char, code } in punctTable" :key="char" class="flex gap-2 items-baseline">
                  <span class="font-bold text-base-content">{{ label }}</span>
                  <span class="text-base-content/40 shrink-0">·</span>
                  <span class="text-base-content/70 shrink-0">{{ code }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
            { title: t('use_4_t'), description: t('use_4_d') },
            { title: t('use_5_t'), description: t('use_5_d') },
            { title: t('use_6_t'), description: t('use_6_d') }
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

        <FaqSection :title="t('faq_title')" :items="faqs" />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    title: "Conversor de Código Morse",
    meta_title: "Conversor de Código Morse Grátis - Texto ↔ Morse com Áudio",
    meta: "Converta texto em código Morse e decodifique Morse em texto diretamente no navegador. Compatível com letras, números e pontuação. Sem cadastro e sem envio de dados.",
    about_desc: "Este Conversor de Código Morse permite transformar qualquer texto em sinais Morse (pontos e traços) e decodificar sequências Morse de volta para o texto original. Todo o processamento acontece diretamente no navegador, sem envio de dados para servidores. Também conhecido como tradutor Morse ou conversor do alfabeto Morse, a ferramenta é útil para estudantes, radioamadores, escoteiros, curiosos e profissionais que precisam trabalhar com o código Morse padronizado internacionalmente.",
    about_desc2: "A conversão funciona nos dois sentidos: você pode digitar uma palavra em português e obter a sequência correspondente em pontos e traços, ou colar uma mensagem em Morse e ler o texto decodificado. Também é possível ouvir o resultado em áudio com a cadência correta de pontos e traços, ideal para quem está aprendendo a reconhecer Morse pelo som. A ferramenta suporta letras de A a Z, números de 0 a 9 e os principais sinais de pontuação definidos pelo padrão internacional.",
    label_input: "Texto ou código Morse",
    placeholder: "Digite um texto ou cole um código Morse aqui...",
    btn_to_morse: "Texto → Morse",
    btn_from_morse: "Morse → Texto",
    result: "Resultado",
    btn_play: "Reproduzir em Morse",
    btn_stop: "Parar",
    label_volume: "Volume",
    warn_unknown: "Alguns caracteres não foram reconhecidos e foram marcados com '?'.",
    warn_not_morse: "O texto digitado não parece ser código Morse. Use o botão 'Texto → Morse' para converter texto comum em código Morse.",
    warn_looks_morse: "O conteúdo digitado parece ser código Morse. Use o botão 'Morse → Texto' para decodificá-lo.",
    features_title: "Principais Funcionalidades",
    f_1: "Conversão de texto para código Morse",
    f_2: "Decodificação de código Morse para texto",
    f_3: "Reprodução do código Morse em áudio no navegador",
    f_4: "Compatível com letras, números e pontuação",
    f_5: "Processamento local que garante total privacidade",
    what_title: "O que é o Código Morse",
    what_p1: "O código Morse é um sistema de comunicação que representa letras, números e sinais de pontuação por meio de sequências de sinais curtos e longos, popularmente chamados de pontos e traços. Cada caractere possui uma combinação única dessas marcas, permitindo que mensagens sejam transmitidas por som, luz, rádio ou até mesmo por batidas em uma superfície.",
    what_p2: "Sua principal característica é a simplicidade. Diferente de outros sistemas de codificação, o Morse precisa apenas de dois estados: ligado e desligado, curto e longo. Isso o torna extremamente confiável em condições adversas. Uma mensagem em Morse pode ser compreendida mesmo com ruído de fundo, sinal fraco de rádio ou baixa visibilidade — situações em que a voz humana poderia falhar.",
    how_works_title: "Como Funciona o Código Morse",
    how_works_p1: "Cada elemento do código possui uma duração específica. Um traço dura três vezes mais que um ponto. O espaço entre pontos e traços dentro de uma mesma letra equivale a um ponto. O espaço entre letras equivale a três pontos, e o espaço entre palavras equivale a sete pontos. Essa proporção permite que operadores experientes leiam Morse em velocidades surpreendentes, identificando o ritmo antes mesmo dos caracteres individuais.",
    how_works_p2: "Na representação escrita, como a usada nesta ferramenta, as letras são separadas por um espaço simples e as palavras são separadas pelo símbolo de barra (/). O FAQ abaixo traz exemplos práticos de como essa convenção funciona ao converter frases reais.",
    table_title: "Tabela do Alfabeto Morse Internacional",
    table_letters: "Letras",
    table_numbers: "Números",
    table_punct: "Pontuação",
    punct_period: "Ponto final",
    punct_comma: "Vírgula",
    punct_question: "Interrogação",
    punct_apostrophe: "Apóstrofo",
    punct_exclamation: "Exclamação",
    punct_paren_open: "Parêntese de abertura",
    punct_paren_close: "Parêntese de fechamento",
    punct_ampersand: "E comercial",
    punct_colon: "Dois-pontos",
    punct_semicolon: "Ponto e vírgula",
    punct_equals: "Igual",
    punct_plus: "Mais",
    punct_hyphen: "Hífen",
    punct_underscore: "Sublinhado",
    punct_quote: "Aspas",
    punct_at: "Arroba",
    use_cases_title: "Onde o Código Morse é Usado Hoje",
    use_1_t: "Radioamadorismo",
    use_1_d: "O radioamadorismo é hoje o principal refúgio do Morse. Operadores ao redor do mundo se comunicam em ondas curtas usando o modo CW (Continuous Wave), que é essencialmente código Morse. Para muitos, trata-se de tradição e habilidade, mas existe também um motivo técnico: o sinal CW consegue atravessar interferências e percorrer longas distâncias usando potência muito baixa, algo que comunicações por voz dificilmente alcançam.",
    use_2_t: "Aviação",
    use_2_d: "Radiofaróis e estações de navegação ainda transmitem seus identificadores em Morse, repetindo o código de letras da estação a cada poucos segundos. Pilotos são treinados para reconhecer essas sequências e confirmar que estão sintonizados na frequência correta.",
    use_3_t: "Comunicações militares",
    use_3_d: "As forças armadas mantêm o Morse como recurso secundário em situações em que rádios digitais podem falhar ou ser interceptados. A capacidade de transmitir usando equipamentos improvisados é considerada um recurso estratégico.",
    use_4_t: "Acessibilidade",
    use_4_d: "Pessoas com limitações motoras severas utilizam adaptações do Morse para se comunicar. Com um único botão ou movimento das pálpebras, é possível escrever palavras inteiras, e já existem aplicativos modernos baseados nesse princípio.",
    use_5_t: "Escotismo e atividades educacionais",
    use_5_d: "Muitos grupos escoteiros ensinam o código como parte do programa de comunicação e sinalização, mantendo viva uma habilidade prática e historicamente importante.",
    use_6_t: "Situações de emergência",
    use_6_d: "O sinal SOS (três pontos, três traços, três pontos) é reconhecido universalmente. Pessoas em áreas remotas já utilizaram lanternas, espelhos e fogueiras para enviar pedidos de socorro em Morse, e equipes de resgate são treinadas para identificar essas sequências.",
    how_to_use_title: "Como usar",
    step_1_title: "Insira o conteúdo",
    step_1_desc: "Digite um texto comum para convertê-lo em Morse ou cole uma sequência Morse (pontos, traços e barras) para decodificá-la.",
    step_2_title: "Escolha a direção",
    step_2_desc: "Clique em 'Texto → Morse' para codificar ou em 'Morse → Texto' para decodificar.",
    step_3_title: "Copie o resultado",
    step_3_desc: "Use o botão de copiar para enviar o resultado para a área de transferência.",
    faq_title: "Perguntas Frequentes",
    faq1q: "Qual é a diferença entre Morse americano e Morse internacional?",
    faq1a: "O Morse americano, também chamado de Morse original, foi a versão criada por Samuel Morse para a telegrafia ferroviária dos Estados Unidos. Ele utilizava pausas internas em algumas letras, o que dificultava a transmissão por rádio. O Morse internacional, padronizado em 1865, eliminou essas pausas e simplificou várias letras, tornando-se o padrão mundial. Esta ferramenta utiliza o padrão internacional.",
    faq2q: "Como digitar código Morse no celular?",
    faq2a: "A forma mais simples é usar uma ferramenta como esta: digite o texto em português e copie o resultado em Morse. Para transmitir o sinal em si, alguns aplicativos convertem o texto em sons ou flashes de lanterna, reproduzindo o ritmo correto de pontos e traços.",
    faq3q: "Como representar acentos e caracteres especiais em Morse?",
    faq3a: "O padrão internacional do código Morse não inclui acentos. Esta ferramenta remove automaticamente os acentos antes da conversão, então 'café' é tratado como 'CAFE'. Caracteres especiais fora do alfabeto latino, números e pontuações suportadas são marcados com '?'.",
    faq4q: "Quanto tempo leva para aprender código Morse?",
    faq4a: "Para reconhecimento básico, entre 5 e 10 palavras por minuto, a maioria das pessoas precisa de quatro a oito semanas de prática regular, dedicando cerca de 15 a 30 minutos por dia. Já atingir velocidades de conversação fluente, acima de 20 palavras por minuto, pode levar de seis meses a um ano.",
    faq5q: "Como funciona a separação de palavras no código Morse?",
    faq5a: "Na transmissão sonora, as palavras são separadas por uma pausa equivalente a sete pontos. Na representação escrita, as letras são separadas por espaço simples e as palavras pelo símbolo de barra (/). Por exemplo, 'OI TU' fica como --- .. / - ..-",
    faq6q: "Por que SOS é o sinal de emergência?",
    faq6a: "É comum pensar que SOS significa 'Save Our Souls' ou 'Save Our Ship'. Na prática, as letras não foram escolhidas pelo significado, mas pela simplicidade da sequência: três pontos, três traços e três pontos, sem pausas entre as letras. Essa combinação é fácil de transmitir, difícil de confundir com outras mensagens e reconhecível mesmo em condições ruins. O sinal foi adotado como padrão internacional de socorro marítimo em 1908, substituindo o antigo CQD usado pela Marconi Company. Em 1912, o naufrágio do Titanic ajudou a popularizar o SOS no imaginário público, embora os operadores do navio tenham transmitido tanto CQD quanto SOS naquela noite.",
    faq7q: "Quais caracteres são suportados nesta ferramenta?",
    faq7a: "A ferramenta suporta todas as letras do alfabeto latino de A a Z, os números de 0 a 9 e os sinais de pontuação mais comuns do padrão internacional, incluindo ponto, vírgula, interrogação, exclamação, arroba, parênteses e outros. Caracteres fora desse conjunto são marcados com interrogação no resultado.",
    faq8q: "Posso ouvir o código Morse em áudio?",
    faq8a: "Sim. Após converter um texto em código Morse, basta clicar no botão de reprodução para ouvir o resultado com a cadência correta de pontos e traços. O som é gerado localmente pelo navegador, sem necessidade de instalar nada, e é útil para quem está aprendendo a reconhecer Morse pelo som.",
    see1: "Conversor de Texto",
    see2: "Comparador de Texto",
    see3: "Conversor de Números Romanos",
    see4: "Contador de Texto"
  },
  en: {
    title: "Morse Code Converter",
    meta_title: "Free Morse Code Converter - Text ↔ Morse with Audio",
    meta: "Convert text to Morse code and decode Morse code back to text directly in your browser. Supports letters, numbers, and punctuation. No sign-up required and no data sent.",
    about_desc: "This Morse Code Converter allows you to transform any text into Morse code signals (dots and dashes) and decode Morse code sequences back into plain text. All processing happens directly in your browser, with no data sent to external servers. Also known as a Morse code translator or Morse alphabet converter, this tool is useful for students, amateur radio operators, scouts, hobbyists, and professionals who work with internationally standardized Morse code.",
    about_desc2: "Conversion works both ways: type a word and get the corresponding dot-and-dash sequence, or paste a Morse code message and read the decoded text. You can also listen to the result as audio with the correct timing of dots and dashes, making it ideal for anyone learning to recognize Morse code by ear. The tool supports letters from A to Z, digits from 0 to 9, and the main punctuation marks defined by the international standard.",
    label_input: "Text or Morse code",
    placeholder: "Type text or paste Morse code here...",
    btn_to_morse: "Text → Morse",
    btn_from_morse: "Morse → Text",
    result: "Result",
    btn_play: "Play Morse Audio",
    btn_stop: "Stop",
    label_volume: "Volume",
    warn_unknown: "Some characters were not recognized and have been replaced with '?'.",
    warn_not_morse: "The input does not appear to be Morse code. Use the 'Text → Morse' button to convert regular text into Morse code.",
    warn_looks_morse: "The input appears to be Morse code. Use the 'Morse → Text' button to decode it.",
    features_title: "Key Features",
    f_1: "Convert text to Morse code",
    f_2: "Decode Morse code into text",
    f_3: "Play Morse code audio directly in the browser",
    f_4: "Supports letters, numbers, and punctuation",
    f_5: "Local processing for complete privacy",
    what_title: "What Is Morse Code",
    what_p1: "Morse code is a communication system that represents letters, numbers, and punctuation using sequences of short and long signals, commonly known as dots and dashes. Each character has a unique combination of these signals, allowing messages to be transmitted through sound, light, radio, or even tapping on a surface.",
    what_p2: "Its main characteristic is simplicity. Unlike many other encoding systems, Morse code requires only two states: on and off, short and long. This makes it extremely reliable in adverse conditions. A Morse code message can still be understood through background noise, weak radio signals, or low visibility — situations where spoken communication may fail.",
    how_works_title: "How Morse Code Works",
    how_works_p1: "Each element of Morse code has a precise duration. A dash lasts three times longer than a dot. The gap between dots and dashes within the same letter equals one dot. The gap between letters equals three dots, and the gap between words equals seven dots. This timing ratio allows experienced operators to read Morse code at surprisingly high speeds, recognizing the rhythm even before identifying individual characters.",
    how_works_p2: "In written form, as used in this tool, letters are separated by a single space and words are separated by a slash (/). The FAQ below includes practical examples showing how this convention works when converting real phrases.",
    table_title: "International Morse Code Alphabet",
    table_letters: "Letters",
    table_numbers: "Numbers",
    table_punct: "Punctuation",
    punct_period: "Period",
    punct_comma: "Comma",
    punct_question: "Question mark",
    punct_apostrophe: "Apostrophe",
    punct_exclamation: "Exclamation mark",
    punct_paren_open: "Opening parenthesis",
    punct_paren_close: "Closing parenthesis",
    punct_ampersand: "Ampersand",
    punct_colon: "Colon",
    punct_semicolon: "Semicolon",
    punct_equals: "Equals sign",
    punct_plus: "Plus sign",
    punct_hyphen: "Hyphen",
    punct_underscore: "Underscore",
    punct_quote: "Quotation marks",
    punct_at: "At sign",
    use_cases_title: "Where Morse Code Is Used Today",
    use_1_t: "Amateur radio",
    use_1_d: "Amateur radio is the primary modern use of Morse code today. Operators around the world communicate on shortwave frequencies using CW (Continuous Wave) mode, which is essentially Morse code. For many enthusiasts, it is both a tradition and a technical skill. There is also a practical advantage: CW signals can travel through interference and across very long distances using extremely low power, something voice communication often cannot achieve.",
    use_2_t: "Aviation",
    use_2_d: "Radio beacons and navigation stations still transmit their identifiers in Morse code, repeating the station letter sequence every few seconds. Pilots are trained to recognize these patterns and confirm that they are tuned to the correct frequency.",
    use_3_t: "Military communications",
    use_3_d: "Military organizations continue to maintain Morse code as a backup communication method in situations where digital radio systems may fail or be intercepted. The ability to transmit messages using improvised equipment is considered a strategic advantage.",
    use_4_t: "Accessibility",
    use_4_d: "People with severe motor impairments use Morse code adaptations to communicate. With a single button press or even an eyelid movement, it is possible to write complete words, and many modern accessibility applications are based on this principle.",
    use_5_t: "Scouting and education",
    use_5_d: "Many scout groups teach Morse code as part of their communication and signaling activities, helping preserve a practical and historically important skill.",
    use_6_t: "Emergency situations",
    use_6_d: "The SOS signal (three dots, three dashes, three dots) is universally recognized. People in remote areas have used flashlights, mirrors, and fires to send Morse code distress signals, and rescue teams are trained to identify these sequences.",
    how_to_use_title: "How to Use",
    step_1_title: "Enter the content",
    step_1_desc: "Type regular text to convert it into Morse code, or paste a Morse code sequence (dots, dashes, and slashes) to decode it.",
    step_2_title: "Choose the direction",
    step_2_desc: "Click 'Text → Morse' to encode or 'Morse → Text' to decode.",
    step_3_title: "Copy the result",
    step_3_desc: "Use the copy button to send the result to your clipboard.",
    faq_title: "Frequently Asked Questions",
    faq1q: "What is the difference between American Morse and International Morse?",
    faq1a: "American Morse, also known as the original Morse code, was the version created by Samuel Morse for railroad telegraph systems in the United States. It used internal pauses in some letters, which made radio transmission more difficult. International Morse, standardized in 1865, removed those pauses and simplified several characters, eventually becoming the worldwide standard. This tool uses the international standard.",
    faq2q: "How can I type Morse code on a phone?",
    faq2a: "The easiest way is to use a tool like this one: type your text and copy the generated Morse code. To actually transmit the signal, some apps can convert text into sounds or flashlight pulses, reproducing the correct dot-and-dash rhythm.",
    faq3q: "How are accents and special characters represented in Morse code?",
    faq3a: "The international Morse code standard does not include accented characters. This tool automatically removes accents before conversion, so 'café' becomes 'CAFE'. Characters outside the Latin alphabet, digits, and supported punctuation marks are replaced with '?'.",
    faq4q: "How long does it take to learn Morse code?",
    faq4a: "For basic recognition at speeds between 5 and 10 words per minute, most people need four to eight weeks of regular practice, usually around 15 to 30 minutes per day. Reaching fluent conversational speeds above 20 words per minute can take anywhere from six months to a year.",
    faq5q: "How does word separation work in Morse code?",
    faq5a: "In audio transmission, words are separated by a pause equal to seven dots. In written form, letters are separated by a single space and words are separated by a slash (/). For example, 'HI YOU' becomes .... .. / -.-- --- ..-",
    faq6q: "Why is SOS the emergency signal?",
    faq6a: "A common misconception is that SOS stands for 'Save Our Souls' or 'Save Our Ship'. In reality, the letters were chosen not for their meaning, but for the simplicity of the sequence: three dots, three dashes, and three dots, with no pauses between letters. This pattern is easy to transmit, difficult to confuse with other messages, and recognizable even under poor conditions. The signal was adopted as the international maritime distress standard in 1908, replacing the older CQD signal used by the Marconi Company. In 1912, the sinking of the Titanic helped popularize SOS worldwide, although the ship's operators transmitted both CQD and SOS that night.",
    faq7q: "Which characters are supported by this tool?",
    faq7a: "The tool supports all Latin alphabet letters from A to Z, digits from 0 to 9, and the most common punctuation marks defined by the international standard, including periods, commas, question marks, exclamation marks, parentheses, the at sign, and others. Characters outside this set are replaced with a question mark in the output.",
    faq8q: "Can I listen to Morse code as audio?",
    faq8a: "Yes. After converting text into Morse code, simply click the play button to hear the result with the correct timing of dots and dashes. The audio is generated locally in your browser with no installation required, making it useful for anyone learning to recognize Morse code by ear.",
    see1: "Text Converter",
    see2: "Text Comparator",
    see3: "Roman Numerals Converter",
    see4: "Text Counter"
  },
  es: {
    title: "Conversor de Código Morse",
    meta_title: "Conversor de Código Morse Gratis - Texto ↔ Morse con Audio",
    meta: "Convierte texto a código Morse y decodifica código Morse a texto directamente en tu navegador. Compatible con letras, números y signos de puntuación. Sin registro y sin envío de datos.",
    about_desc: "Este Conversor de Código Morse permite transformar cualquier texto en señales Morse (puntos y rayas) y decodificar secuencias de código Morse nuevamente en texto. Todo el procesamiento ocurre directamente en tu navegador, sin enviar datos a servidores externos. También conocido como traductor Morse o conversor del alfabeto Morse, esta herramienta es útil para estudiantes, radioaficionados, scouts, aficionados y profesionales que trabajan con el código Morse estandarizado internacionalmente.",
    about_desc2: "La conversión funciona en ambos sentidos: puedes escribir una palabra y obtener la secuencia correspondiente de puntos y rayas, o pegar un mensaje en código Morse y leer el texto decodificado. También puedes escuchar el resultado en audio con el ritmo correcto de puntos y rayas, ideal para quienes están aprendiendo a reconocer código Morse de oído. La herramienta admite letras de la A a la Z, números del 0 al 9 y los principales signos de puntuación definidos por el estándar internacional.",
    label_input: "Texto o código Morse",
    placeholder: "Escribe un texto o pega un código Morse aquí...",
    btn_to_morse: "Texto → Morse",
    btn_from_morse: "Morse → Texto",
    result: "Resultado",
    btn_play: "Reproducir audio Morse",
    btn_stop: "Detener",
    label_volume: "Volumen",
    warn_unknown: "Algunos caracteres no fueron reconocidos y se han reemplazado por '?'.",
    warn_not_morse: "El contenido ingresado no parece ser código Morse. Usa el botón 'Texto → Morse' para convertir texto normal a código Morse.",
    warn_looks_morse: "El contenido ingresado parece ser código Morse. Usa el botón 'Morse → Texto' para decodificarlo.",
    features_title: "Características Principales",
    f_1: "Conversión de texto a código Morse",
    f_2: "Decodificación de código Morse a texto",
    f_3: "Reproducción de audio Morse directamente en el navegador",
    f_4: "Compatible con letras, números y signos de puntuación",
    f_5: "Procesamiento local para garantizar total privacidad",
    what_title: "Qué es el Código Morse",
    what_p1: "El código Morse es un sistema de comunicación que representa letras, números y signos de puntuación mediante secuencias de señales cortas y largas, conocidas popularmente como puntos y rayas. Cada carácter tiene una combinación única de estas señales, lo que permite transmitir mensajes mediante sonido, luz, radio o incluso golpes sobre una superficie.",
    what_p2: "Su principal característica es la simplicidad. A diferencia de muchos otros sistemas de codificación, el código Morse solo requiere dos estados: encendido y apagado, corto y largo. Esto lo hace extremadamente confiable en condiciones adversas. Un mensaje en código Morse puede entenderse incluso con ruido de fondo, señales de radio débiles o baja visibilidad, situaciones en las que la voz humana podría fallar.",
    how_works_title: "Cómo Funciona el Código Morse",
    how_works_p1: "Cada elemento del código Morse tiene una duración precisa. Una raya dura tres veces más que un punto. El espacio entre puntos y rayas dentro de una misma letra equivale a un punto. El espacio entre letras equivale a tres puntos, y el espacio entre palabras equivale a siete puntos. Esta proporción permite que operadores experimentados lean código Morse a velocidades sorprendentes, reconociendo el ritmo incluso antes de identificar los caracteres individuales.",
    how_works_p2: "En la representación escrita, como la utilizada en esta herramienta, las letras se separan con un espacio simple y las palabras con una barra (/). La sección de preguntas frecuentes incluye ejemplos prácticos de cómo funciona esta convención al convertir frases reales.",
    table_title: "Tabla del Alfabeto Morse Internacional",
    table_letters: "Letras",
    table_numbers: "Números",
    table_punct: "Puntuación",
    punct_period: "Punto final",
    punct_comma: "Coma",
    punct_question: "Signo de interrogación",
    punct_apostrophe: "Apóstrofo",
    punct_exclamation: "Signo de exclamación",
    punct_paren_open: "Paréntesis de apertura",
    punct_paren_close: "Paréntesis de cierre",
    punct_ampersand: "Ampersand",
    punct_colon: "Dos puntos",
    punct_semicolon: "Punto y coma",
    punct_equals: "Signo igual",
    punct_plus: "Signo más",
    punct_hyphen: "Guion",
    punct_underscore: "Guion bajo",
    punct_quote: "Comillas",
    punct_at: "Arroba",
    use_cases_title: "Dónde se Usa el Código Morse Hoy",
    use_1_t: "Radioafición",
    use_1_d: "La radioafición es uno de los principales usos modernos del código Morse. Operadores de todo el mundo se comunican en onda corta utilizando el modo CW (Continuous Wave), que es esencialmente código Morse. Para muchos aficionados, representa tanto una tradición como una habilidad técnica. Además, existe una ventaja práctica: las señales CW pueden atravesar interferencias y recorrer grandes distancias utilizando muy poca potencia, algo que las comunicaciones por voz muchas veces no consiguen.",
    use_2_t: "Aviación",
    use_2_d: "Los radiofaros y estaciones de navegación todavía transmiten sus identificadores en código Morse, repitiendo la secuencia de letras de la estación cada pocos segundos. Los pilotos son entrenados para reconocer estas señales y confirmar que están sintonizados en la frecuencia correcta.",
    use_3_t: "Comunicaciones militares",
    use_3_d: "Las fuerzas armadas mantienen el código Morse como método de comunicación de respaldo en situaciones donde los sistemas digitales pueden fallar o ser interceptados. La capacidad de transmitir mensajes utilizando equipos improvisados se considera una ventaja estratégica.",
    use_4_t: "Accesibilidad",
    use_4_d: "Personas con limitaciones motoras severas utilizan adaptaciones del código Morse para comunicarse. Con un solo botón o incluso con el movimiento de un párpado, es posible escribir palabras completas, y muchas aplicaciones modernas de accesibilidad se basan en este principio.",
    use_5_t: "Escultismo y educación",
    use_5_d: "Muchos grupos scouts enseñan código Morse como parte de sus actividades de comunicación y señalización, ayudando a preservar una habilidad práctica e históricamente importante.",
    use_6_t: "Situaciones de emergencia",
    use_6_d: "La señal SOS (tres puntos, tres rayas y tres puntos) es reconocida universalmente. Personas en zonas remotas han utilizado linternas, espejos y fogatas para enviar señales de socorro en código Morse, y los equipos de rescate están entrenados para identificar estas secuencias.",
    how_to_use_title: "Cómo usar",
    step_1_title: "Ingresa el contenido",
    step_1_desc: "Escribe un texto normal para convertirlo en código Morse o pega una secuencia Morse (puntos, rayas y barras) para decodificarla.",
    step_2_title: "Elige la dirección",
    step_2_desc: "Haz clic en 'Texto → Morse' para codificar o en 'Morse → Texto' para decodificar.",
    step_3_title: "Copia el resultado",
    step_3_desc: "Usa el botón de copiar para enviar el resultado al portapapeles.",
    faq_title: "Preguntas Frecuentes",
    faq1q: "¿Cuál es la diferencia entre Morse americano y Morse internacional?",
    faq1a: "El Morse americano, también conocido como Morse original, fue la versión creada por Samuel Morse para los sistemas telegráficos ferroviarios de Estados Unidos. Utilizaba pausas internas en algunas letras, lo que dificultaba la transmisión por radio. El Morse internacional, estandarizado en 1865, eliminó esas pausas y simplificó varios caracteres, convirtiéndose en el estándar mundial. Esta herramienta utiliza el estándar internacional.",
    faq2q: "¿Cómo puedo escribir código Morse en el móvil?",
    faq2a: "La forma más sencilla es usar una herramienta como esta: escribe tu texto y copia el código Morse generado. Para transmitir realmente la señal, algunas aplicaciones convierten el texto en sonidos o destellos de linterna, reproduciendo el ritmo correcto de puntos y rayas.",
    faq3q: "¿Cómo se representan las tildes y caracteres especiales en código Morse?",
    faq3a: "El estándar internacional del código Morse no incluye caracteres acentuados. Esta herramienta elimina automáticamente los acentos antes de la conversión, por lo que 'café' se convierte en 'CAFE'. Los caracteres fuera del alfabeto latino, números y signos de puntuación compatibles se reemplazan por '?'.",
    faq4q: "¿Cuánto tiempo se tarda en aprender código Morse?",
    faq4a: "Para un reconocimiento básico, entre 5 y 10 palabras por minuto, la mayoría de las personas necesita entre cuatro y ocho semanas de práctica regular, dedicando alrededor de 15 a 30 minutos diarios. Alcanzar velocidades fluidas de conversación superiores a 20 palabras por minuto puede llevar entre seis meses y un año.",
    faq5q: "¿Cómo funciona la separación de palabras en código Morse?",
    faq5a: "En la transmisión de audio, las palabras se separan mediante una pausa equivalente a siete puntos. En la representación escrita, las letras se separan con un espacio simple y las palabras con una barra (/). Por ejemplo, 'HOLA TU' se escribe como .... --- .-.. .- / - ..-",
    faq6q: "¿Por qué SOS es la señal de emergencia?",
    faq6a: "Es común pensar que SOS significa 'Save Our Souls' o 'Save Our Ship'. En realidad, las letras no fueron elegidas por su significado, sino por la simplicidad de la secuencia: tres puntos, tres rayas y tres puntos, sin pausas entre letras. Esta combinación es fácil de transmitir, difícil de confundir con otros mensajes y reconocible incluso en malas condiciones. La señal fue adoptada como estándar internacional de socorro marítimo en 1908, reemplazando al antiguo CQD utilizado por la Compañía Marconi. En 1912, el hundimiento del Titanic ayudó a popularizar el SOS en todo el mundo, aunque los operadores del barco transmitieron tanto CQD como SOS aquella noche.",
    faq7q: "¿Qué caracteres admite esta herramienta?",
    faq7a: "La herramienta admite todas las letras del alfabeto latino de la A a la Z, los números del 0 al 9 y los signos de puntuación más comunes definidos por el estándar internacional, incluyendo punto, coma, interrogación, exclamación, arroba, paréntesis y otros. Los caracteres fuera de este conjunto se reemplazan por un signo de interrogación en el resultado.",
    faq8q: "¿Puedo escuchar el código Morse en audio?",
    faq8a: "Sí. Después de convertir texto en código Morse, solo tienes que hacer clic en el botón de reproducción para escuchar el resultado con el ritmo correcto de puntos y rayas. El audio se genera localmente en el navegador, sin necesidad de instalar nada, y resulta útil para quienes están aprendiendo a reconocer código Morse de oído.",
    see1: "Convertidor de Texto",
    see2: "Comparador de Textos",
    see3: "Convertidor de Números Romanos",
    see4: "Contador de Texto"
  },
  fr: {
    title: "Convertisseur de Code Morse",
    meta_title: "Convertisseur de Code Morse Gratuit - Texte ↔ Morse avec Audio",
    meta: "Convertissez du texte en code Morse et décodez du code Morse en texte directement dans votre navigateur. Prend en charge les lettres, les chiffres et la ponctuation. Sans inscription et sans envoi de données.",
    about_desc: "Ce convertisseur de code Morse vous permet de transformer n'importe quel texte en signaux Morse (points et tirets) et de décoder des séquences de code Morse en texte clair. Tout le traitement s'effectue directement dans votre navigateur, sans aucun envoi de données vers des serveurs externes. Également connu sous le nom de traducteur Morse ou convertisseur d'alphabet Morse, cet outil est utile pour les étudiants, les radioamateurs, les scouts, les passionnés et les professionnels travaillant avec le code Morse standardisé à l'international.",
    about_desc2: "La conversion fonctionne dans les deux sens : vous pouvez saisir un mot et obtenir sa séquence correspondante en points et tirets, ou coller un message en code Morse et lire le texte décodé. Vous pouvez également écouter le résultat en audio avec le rythme correct des points et des tirets, idéal pour apprendre à reconnaître le code Morse à l'oreille. L'outil prend en charge les lettres de A à Z, les chiffres de 0 à 9 et les principaux signes de ponctuation définis par la norme internationale.",
    label_input: "Texte ou code Morse",
    placeholder: "Saisissez du texte ou collez du code Morse ici...",
    btn_to_morse: "Texte → Morse",
    btn_from_morse: "Morse → Texte",
    result: "Résultat",
    btn_play: "Lecture audio Morse",
    btn_stop: "Arrêter",
    label_volume: "Volume",
    warn_unknown: "Certains caractères n'ont pas été reconnus et ont été remplacés par '?'.",
    warn_not_morse: "Le contenu saisi ne semble pas être du code Morse. Utilisez le bouton 'Texte → Morse' pour convertir du texte classique en code Morse.",
    warn_looks_morse: "Le contenu saisi semble être du code Morse. Utilisez le bouton 'Morse → Texte' pour le décoder.",
    features_title: "Fonctionnalités Principales",
    f_1: "Conversion de texte en code Morse",
    f_2: "Décodage de code Morse en texte",
    f_3: "Lecture audio du code Morse directement dans le navigateur",
    f_4: "Prise en charge des lettres, des chiffres et de la ponctuation",
    f_5: "Traitement local garantissant une confidentialité totale",
    what_title: "Qu'est-ce que le Code Morse",
    what_p1: "Le code Morse est un système de communication qui représente les lettres, les chiffres et les signes de ponctuation à l'aide de séquences de signaux courts et longs, communément appelés points et tirets. Chaque caractère possède une combinaison unique de ces signaux, permettant de transmettre des messages par le son, la lumière, la radio ou même des tapotements sur une surface.",
    what_p2: "Sa principale caractéristique est sa simplicité. Contrairement à d'autres systèmes de codage, le code Morse ne nécessite que deux états : allumé et éteint, court et long. Cela le rend extrêmement fiable dans des conditions difficiles. Un message en code Morse peut être compris malgré les bruits de fond, les signaux radio faibles ou une visibilité réduite, des situations où la voix humaine pourrait échouer.",
    how_works_title: "Comment Fonctionne le Code Morse",
    how_works_p1: "Chaque élément du code Morse possède une durée précise. Un tiret dure trois fois plus longtemps qu'un point. L'espace entre les points et les tirets au sein d'une même lettre équivaut à un point. L'espace entre les lettres équivaut à trois points, et l'espace entre les mots équivaut à sept points. Ce rapport de durée permet aux opérateurs expérimentés de lire le code Morse à des vitesses surprenantes, en reconnaissant le rythme avant même d'identifier chaque caractère.",
    how_works_p2: "Dans la représentation écrite, comme celle utilisée dans cet outil, les lettres sont séparées par un espace simple et les mots par une barre oblique (/). La FAQ ci-dessous propose des exemples pratiques montrant comment cette convention fonctionne lors de la conversion de phrases réelles.",
    table_title: "Tableau de l'Alphabet Morse International",
    table_letters: "Lettres",
    table_numbers: "Chiffres",
    table_punct: "Ponctuation",
    punct_period: "Point final",
    punct_comma: "Virgule",
    punct_question: "Point d'interrogation",
    punct_apostrophe: "Apostrophe",
    punct_exclamation: "Point d'exclamation",
    punct_paren_open: "Parenthèse ouvrante",
    punct_paren_close: "Parenthèse fermante",
    punct_ampersand: "Esperluette",
    punct_colon: "Deux-points",
    punct_semicolon: "Point-virgule",
    punct_equals: "Signe égal",
    punct_plus: "Plus",
    punct_hyphen: "Trait d'union",
    punct_underscore: "Tiret bas",
    punct_quote: "Guillemets",
    punct_at: "Arobase",
    use_cases_title: "Où le Code Morse est-il Utilisé Aujourd'hui ?",
    use_1_t: "Radioamateurisme",
    use_1_d: "Le radioamateurisme est aujourd'hui l'un des principaux usages modernes du code Morse. Des opérateurs du monde entier communiquent sur ondes courtes en utilisant le mode CW (Continuous Wave), qui repose essentiellement sur le code Morse. Pour beaucoup, il s'agit à la fois d'une tradition et d'une compétence technique. Il existe également un avantage pratique : les signaux CW peuvent traverser les interférences et parcourir de très longues distances avec une puissance extrêmement faible, ce que les communications vocales ne permettent pas toujours.",
    use_2_t: "Aviation",
    use_2_d: "Les radiophares et les stations de navigation transmettent toujours leurs identifiants en code Morse, en répétant la séquence de lettres de la station toutes les quelques secondes. Les pilotes sont formés à reconnaître ces séquences afin de confirmer qu'ils sont bien réglés sur la bonne fréquence.",
    use_3_t: "Communications militaires",
    use_3_d: "Les forces armées conservent le code Morse comme méthode de communication de secours dans les situations où les systèmes radio numériques peuvent échouer ou être interceptés. La capacité à transmettre des messages avec du matériel improvisé est considérée comme un avantage stratégique.",
    use_4_t: "Accessibilité",
    use_4_d: "Les personnes souffrant de limitations motrices sévères utilisent des adaptations du code Morse pour communiquer. Avec un seul bouton ou même un mouvement de paupière, il est possible d'écrire des mots entiers, et de nombreuses applications modernes d'accessibilité reposent sur ce principe.",
    use_5_t: "Scoutisme et activités éducatives",
    use_5_d: "De nombreux groupes scouts enseignent le code Morse dans le cadre de leurs activités de communication et de signalisation, contribuant ainsi à préserver une compétence pratique et historiquement importante.",
    use_6_t: "Situations d'urgence",
    use_6_d: "Le signal SOS (trois points, trois tirets, trois points) est universellement reconnu. Des personnes isolées dans des zones reculées ont utilisé des lampes de poche, des miroirs et des feux pour envoyer des signaux de détresse en code Morse, et les équipes de secours sont formées à reconnaître ces séquences.",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Saisissez le contenu",
    step_1_desc: "Saisissez un texte classique à convertir en code Morse ou collez une séquence Morse (points, tirets et barres obliques) pour la décoder.",
    step_2_title: "Choisissez la direction",
    step_2_desc: "Cliquez sur 'Texte → Morse' pour encoder ou sur 'Morse → Texte' pour décoder.",
    step_3_title: "Copiez le résultat",
    step_3_desc: "Utilisez le bouton de copie pour envoyer le résultat dans le presse-papiers.",
    faq_title: "Questions Fréquentes",
    faq1q: "Quelle est la différence entre le Morse américain et le Morse international ?",
    faq1a: "Le Morse américain, également appelé Morse original, était la version créée par Samuel Morse pour les systèmes télégraphiques ferroviaires des États-Unis. Il utilisait des pauses internes dans certaines lettres, ce qui rendait la transmission radio plus difficile. Le Morse international, standardisé en 1865, a supprimé ces pauses et simplifié plusieurs caractères, devenant ainsi la norme mondiale. Cet outil utilise la norme internationale.",
    faq2q: "Comment taper du code Morse sur un téléphone portable ?",
    faq2a: "Le moyen le plus simple consiste à utiliser un outil comme celui-ci : saisissez votre texte puis copiez le code Morse généré. Pour transmettre réellement le signal, certaines applications convertissent le texte en sons ou en flashs lumineux, reproduisant le rythme correct des points et des tirets.",
    faq3q: "Comment représenter les accents et les caractères spéciaux en code Morse ?",
    faq3a: "La norme internationale du code Morse ne prend pas en charge les caractères accentués. Cet outil supprime automatiquement les accents avant la conversion ; ainsi, 'café' devient 'CAFE'. Les caractères en dehors de l'alphabet latin, les chiffres et les signes de ponctuation pris en charge sont remplacés par '?'.",
    faq4q: "Combien de temps faut-il pour apprendre le code Morse ?",
    faq4a: "Pour une reconnaissance de base à une vitesse comprise entre 5 et 10 mots par minute, la plupart des personnes ont besoin de quatre à huit semaines de pratique régulière, à raison d'environ 15 à 30 minutes par jour. Atteindre une vitesse fluide supérieure à 20 mots par minute peut demander entre six mois et un an.",
    faq5q: "Comment fonctionne la séparation des mots en code Morse ?",
    faq5a: "Dans la transmission audio, les mots sont séparés par une pause équivalente à sept points. Dans la représentation écrite, les lettres sont séparées par un espace simple et les mots par une barre oblique (/). Par exemple, 'OUI TOI' devient --- ..- .. / - --- ..",
    faq6q: "Pourquoi SOS est-il le signal d'urgence ?",
    faq6a: "Une idée reçue fréquente est de penser que SOS signifie 'Save Our Souls' ou 'Save Our Ship'. En réalité, ces lettres n'ont pas été choisies pour leur signification, mais pour la simplicité de la séquence : trois points, trois tirets et trois points, sans pause entre les lettres. Cette combinaison est facile à transmettre, difficile à confondre avec d'autres messages et reconnaissable même dans des conditions difficiles. Le signal a été adopté comme norme internationale de détresse maritime en 1908, remplaçant l'ancien CQD utilisé par la Marconi Company. En 1912, le naufrage du Titanic a contribué à populariser le SOS dans le monde entier, bien que les opérateurs du navire aient transmis à la fois CQD et SOS cette nuit-là.",
    faq7q: "Quels caractères sont pris en charge par cet outil ?",
    faq7a: "L'outil prend en charge toutes les lettres de l'alphabet latin de A à Z, les chiffres de 0 à 9 ainsi que les signes de ponctuation les plus courants définis par la norme internationale, notamment le point, la virgule, le point d'interrogation, le point d'exclamation, l'arobase, les parenthèses et d'autres encore. Les caractères ne figurant pas dans cet ensemble sont remplacés par un point d'interrogation dans le résultat.",
    faq8q: "Puis-je écouter le code Morse en audio ?",
    faq8a: "Oui. Après avoir converti un texte en code Morse, il suffit de cliquer sur le bouton de lecture pour écouter le résultat avec le rythme correct des points et des tirets. Le son est généré localement par votre navigateur, sans aucune installation nécessaire, ce qui est idéal pour apprendre à reconnaître le code Morse à l'oreille.",
    see1: "Convertisseur de Texte",
    see2: "Comparateur de Texte",
    see3: "Convertisseur de Nombres Romains",
    see4: "Compteur de Texte"
  },
  it: {
    title: "Convertitore di Codice Morse",
    meta_title: "Convertitore di Codice Morse Gratis - Testo ↔ Morse con Audio",
    meta: "Converti testo in codice Morse e decodifica codice Morse in testo direttamente nel tuo browser. Supporta lettere, numeri e segni di punteggiatura. Nessuna registrazione e nessun invio di dati.",
    about_desc: "Questo convertitore di codice Morse ti consente di trasformare qualsiasi testo in segnali Morse (punti e tratti) e decodificare sequenze di codice Morse nuovamente in testo normale. Tutta l'elaborazione avviene direttamente nel tuo browser, senza inviare dati a server esterni. Conosciuto anche come traduttore Morse o convertitore dell'alfabeto Morse, questo strumento è utile per studenti, radioamatori, scout, appassionati e professionisti che lavorano con il codice Morse standardizzato a livello internazionale.",
    about_desc2: "La conversione funziona in entrambe le direzioni: puoi digitare una parola e ottenere la corrispondente sequenza di punti e tratti, oppure incollare un messaggio in codice Morse e leggere il testo decodificato. Puoi anche ascoltare il risultato in audio con il ritmo corretto di punti e tratti, ideale per chi sta imparando a riconoscere il codice Morse a orecchio. Lo strumento supporta lettere dalla A alla Z, numeri da 0 a 9 e i principali segni di punteggiatura definiti dallo standard internazionale.",
    label_input: "Testo o codice Morse",
    placeholder: "Digita un testo o incolla un codice Morse qui...",
    btn_to_morse: "Testo → Morse",
    btn_from_morse: "Morse → Testo",
    result: "Risultato",
    btn_play: "Riproduci audio Morse",
    btn_stop: "Ferma",
    label_volume: "Volume",
    warn_unknown: "Alcuni caratteri non sono stati riconosciuti e sono stati sostituiti con '?'.",
    warn_not_morse: "Il contenuto inserito non sembra essere codice Morse. Usa il pulsante 'Testo → Morse' per convertire il testo normale in codice Morse.",
    warn_looks_morse: "Il contenuto inserito sembra essere codice Morse. Usa il pulsante 'Morse → Testo' per decodificarlo.",
    features_title: "Funzionalità Principali",
    f_1: "Conversione da testo a codice Morse",
    f_2: "Decodifica da codice Morse a testo",
    f_3: "Riproduzione audio del codice Morse direttamente nel browser",
    f_4: "Supporto per lettere, numeri e segni di punteggiatura",
    f_5: "Elaborazione locale per garantire la massima privacy",
    what_title: "Cos'è il Codice Morse",
    what_p1: "Il codice Morse è un sistema di comunicazione che rappresenta lettere, numeri e segni di punteggiatura tramite sequenze di segnali brevi e lunghi, comunemente chiamati punti e tratti. Ogni carattere possiede una combinazione unica di questi segnali, permettendo la trasmissione di messaggi tramite suono, luce, radio o persino colpi su una superficie.",
    what_p2: "La sua caratteristica principale è la semplicità. A differenza di molti altri sistemi di codifica, il codice Morse richiede soltanto due stati: acceso e spento, breve e lungo. Questo lo rende estremamente affidabile in condizioni difficili. Un messaggio in codice Morse può essere compreso anche in presenza di rumore di fondo, segnali radio deboli o scarsa visibilità, situazioni in cui la voce umana potrebbe non essere efficace.",
    how_works_title: "Come Funziona il Codice Morse",
    how_works_p1: "Ogni elemento del codice Morse ha una durata precisa. Un trattino dura tre volte più di un punto. Lo spazio tra punti e trattini all'interno della stessa lettera equivale a un punto. Lo spazio tra le lettere equivale a tre punti e lo spazio tra le parole equivale a sette punti. Questa proporzione permette agli operatori esperti di leggere il codice Morse a velocità sorprendenti, riconoscendo il ritmo ancora prima di identificare i singoli caratteri.",
    how_works_p2: "Nella rappresentazione scritta, come quella utilizzata in questo strumento, le lettere sono separate da uno spazio singolo e le parole da una barra (/). La sezione FAQ qui sotto mostra esempi pratici di come questa convenzione venga applicata nella conversione di frasi reali.",
    table_title: "Tabella dell'Alfabeto Morse Internazionale",
    table_letters: "Lettere",
    table_numbers: "Numeri",
    table_punct: "Punteggiatura",
    punct_period: "Punto",
    punct_comma: "Virgola",
    punct_question: "Punto interrogativo",
    punct_apostrophe: "Apostrofo",
    punct_exclamation: "Punto esclamativo",
    punct_paren_open: "Parentesi aperta",
    punct_paren_close: "Parentesi chiusa",
    punct_ampersand: "E commerciale",
    punct_colon: "Due punti",
    punct_semicolon: "Punto e virgola",
    punct_equals: "Segno di uguale",
    punct_plus: "Più",
    punct_hyphen: "Trattino",
    punct_underscore: "Trattino basso",
    punct_quote: "Virgolette",
    punct_at: "Chiocciola",
    use_cases_title: "Dove viene Utilizzato il Codice Morse Oggi",
    use_1_t: "Radioamatorismo",
    use_1_d: "Il radioamatorismo rappresenta oggi uno dei principali utilizzi moderni del codice Morse. Operatori di tutto il mondo comunicano sulle onde corte utilizzando la modalità CW (Continuous Wave), che si basa essenzialmente sul codice Morse. Per molti appassionati è sia una tradizione sia una competenza tecnica. Esiste inoltre un vantaggio pratico: i segnali CW riescono ad attraversare interferenze e coprire lunghe distanze utilizzando una potenza molto ridotta, cosa che le comunicazioni vocali spesso non riescono a fare.",
    use_2_t: "Aviazione",
    use_2_d: "I radiofari e le stazioni di navigazione trasmettono ancora i loro identificativi in codice Morse, ripetendo la sequenza di lettere della stazione ogni pochi secondi. I piloti vengono addestrati a riconoscere queste sequenze per confermare di essere sintonizzati sulla frequenza corretta.",
    use_3_t: "Comunicazioni militari",
    use_3_d: "Le forze armate mantengono il codice Morse come metodo di comunicazione di emergenza nelle situazioni in cui i sistemi radio digitali possono fallire o essere intercettati. La capacità di trasmettere messaggi utilizzando apparecchiature improvvisate è considerata un vantaggio strategico.",
    use_4_t: "Accessibilità",
    use_4_d: "Le persone con gravi limitazioni motorie utilizzano adattamenti del codice Morse per comunicare. Con un solo pulsante o persino con il movimento di una palpebra, è possibile scrivere parole complete, e molte moderne applicazioni per l'accessibilità si basano su questo principio.",
    use_5_t: "Scoutismo e attività educative",
    use_5_d: "Molti gruppi scout insegnano il codice Morse come parte delle attività di comunicazione e segnalazione, contribuendo a preservare una competenza pratica e storicamente importante.",
    use_6_t: "Situazioni di emergenza",
    use_6_d: "Il segnale SOS (tre punti, tre tratti e tre punti) è universalmente riconosciuto. Persone isolate in aree remote hanno utilizzato torce, specchi e fuochi per inviare segnali di soccorso in codice Morse, e le squadre di soccorso sono addestrate a riconoscere queste sequenze.",
    how_to_use_title: "Come usare",
    step_1_title: "Inserisci il contenuto",
    step_1_desc: "Digita un testo normale da convertire in codice Morse oppure incolla una sequenza Morse (punti, tratti e barre) per decodificarla.",
    step_2_title: "Scegli la direzione",
    step_2_desc: "Fai clic su 'Testo → Morse' per codificare oppure su 'Morse → Testo' per decodificare.",
    step_3_title: "Copia il risultato",
    step_3_desc: "Usa il pulsante di copia per inviare il risultato negli appunti.",
    faq_title: "Domande Frequenti",
    faq1q: "Qual è la differenza tra il Morse americano e il Morse internazionale?",
    faq1a: "Il Morse americano, noto anche come Morse originale, era la versione creata da Samuel Morse per i sistemi telegrafici ferroviari degli Stati Uniti. Utilizzava pause interne in alcune lettere, rendendo più difficile la trasmissione via radio. Il Morse internazionale, standardizzato nel 1865, eliminò queste pause e semplificò diversi caratteri, diventando lo standard mondiale. Questo strumento utilizza lo standard internazionale.",
    faq2q: "Come posso scrivere codice Morse sul cellulare?",
    faq2a: "Il modo più semplice è utilizzare uno strumento come questo: digita il tuo testo e copia il codice Morse generato. Per trasmettere realmente il segnale, alcune applicazioni trasformano il testo in suoni o lampeggi di torcia, riproducendo il corretto ritmo di punti e tratti.",
    faq3q: "Come vengono rappresentati accenti e caratteri speciali nel codice Morse?",
    faq3a: "Lo standard internazionale del codice Morse non include i caratteri accentati. Questo strumento rimuove automaticamente gli accenti prima della conversione, quindi 'café' diventa 'CAFE'. I caratteri al di fuori dell'alfabeto latino, i numeri e i segni di punteggiatura supportati vengono sostituiti con '?'.",
    faq4q: "Quanto tempo serve per imparare il codice Morse?",
    faq4a: "Per un riconoscimento di base tra 5 e 10 parole al minuto, la maggior parte delle persone ha bisogno di quattro-otto settimane di pratica regolare, dedicando circa 15-30 minuti al giorno. Raggiungere una velocità fluida superiore a 20 parole al minuto può richiedere da sei mesi a un anno.",
    faq5q: "Come funziona la separazione delle parole nel codice Morse?",
    faq5a: "Nella trasmissione audio, le parole sono separate da una pausa equivalente a sette punti. Nella rappresentazione scritta, le lettere sono separate da uno spazio singolo e le parole da una barra (/). Ad esempio, 'CIAO TU' diventa -.-. .. .- --- / - ..-",
    faq6q: "Perché SOS è il segnale di emergenza?",
    faq6a: "È comune pensare che SOS significhi 'Save Our Souls' oppure 'Save Our Ship'. In realtà, le lettere non furono scelte per il loro significato, ma per la semplicità della sequenza: tre punti, tre tratti e tre punti, senza pause tra le lettere. Questa combinazione è facile da trasmettere, difficile da confondere con altri messaggi e riconoscibile anche in condizioni difficili. Il segnale venne adottato come standard internazionale di soccorso marittimo nel 1908, sostituendo il vecchio CQD utilizzato dalla Marconi Company. Nel 1912, il naufragio del Titanic contribuì a rendere famoso il SOS in tutto il mondo, anche se gli operatori della nave trasmisero sia CQD sia SOS quella notte.",
    faq7q: "Quali caratteri supporta questo strumento?",
    faq7a: "Lo strumento supporta tutte le lettere dell'alfabeto latino dalla A alla Z, i numeri da 0 a 9 e i segni di punteggiatura più comuni definiti dallo standard internazionale, inclusi punto, virgola, punto interrogativo, punto esclamativo, chiocciola, parentesi e altri ancora. I caratteri non inclusi in questo insieme vengono sostituiti con un punto interrogativo nel risultato.",
    faq8q: "Posso ascoltare il codice Morse in audio?",
    faq8a: "Sì. Dopo aver convertito un testo in codice Morse, basta fare clic sul pulsante di riproduzione per ascoltare il risultato con il corretto ritmo di punti e tratti. L'audio viene generato localmente dal browser, senza necessità di installare nulla, ed è utile per chi sta imparando a riconoscere il codice Morse a orecchio.",
    see1: "Convertitore di Testo",
    see2: "Comparatore di Testo",
    see3: "Convertitore di Numeri Romani",
    see4: "Contatore di Testo"
  },
  id: {
    title: "Konverter Kode Morse",
    meta_title: "Konverter Kode Morse Gratis - Teks ↔ Morse dengan Audio",
    meta: "Konversikan teks ke kode Morse dan dekodekan kode Morse kembali menjadi teks langsung di browser Anda. Mendukung huruf, angka, dan tanda baca. Tanpa registrasi dan tanpa pengiriman data.",
    about_desc: "Konverter Kode Morse ini memungkinkan Anda mengubah teks apa pun menjadi sinyal kode Morse (titik dan garis) serta mendekodekan urutan kode Morse kembali menjadi teks biasa. Semua pemrosesan dilakukan langsung di browser Anda tanpa mengirim data ke server eksternal. Juga dikenal sebagai penerjemah Morse atau konverter alfabet Morse, alat ini berguna bagi pelajar, radio amatir, pramuka, penghobi, dan profesional yang bekerja dengan kode Morse standar internasional.",
    about_desc2: "Konversi bekerja dalam dua arah: ketik sebuah kata untuk mendapatkan urutan titik dan garis yang sesuai, atau tempel pesan kode Morse untuk membaca teks yang telah didekodekan. Anda juga dapat mendengarkan hasilnya dalam bentuk audio dengan ritme titik dan garis yang tepat, sangat ideal bagi siapa saja yang sedang belajar mengenali kode Morse melalui pendengaran. Alat ini mendukung huruf A hingga Z, angka 0 hingga 9, serta tanda baca utama yang ditetapkan dalam standar internasional.",
    label_input: "Teks atau kode Morse",
    placeholder: "Ketik teks atau tempel kode Morse di sini...",
    btn_to_morse: "Teks → Morse",
    btn_from_morse: "Morse → Teks",
    result: "Hasil",
    btn_play: "Putar Audio Morse",
    btn_stop: "Hentikan",
    label_volume: "Volume",
    warn_unknown: "Beberapa karakter tidak dikenali dan telah diganti dengan '?'.",
    warn_not_morse: "Input tidak tampak seperti kode Morse. Gunakan tombol 'Teks → Morse' untuk mengonversi teks biasa menjadi kode Morse.",
    warn_looks_morse: "Input tampak seperti kode Morse. Gunakan tombol 'Morse → Teks' untuk mendekodekannya.",
    features_title: "Fitur Utama",
    f_1: "Konversi teks menjadi kode Morse",
    f_2: "Dekode kode Morse menjadi teks",
    f_3: "Pemutaran audio kode Morse langsung di browser",
    f_4: "Mendukung huruf, angka, dan tanda baca",
    f_5: "Pemrosesan lokal untuk privasi penuh",
    what_title: "Apa Itu Kode Morse",
    what_p1: "Kode Morse adalah sistem komunikasi yang merepresentasikan huruf, angka, dan tanda baca menggunakan urutan sinyal pendek dan panjang, yang umumnya dikenal sebagai titik dan garis. Setiap karakter memiliki kombinasi unik dari sinyal-sinyal tersebut, sehingga pesan dapat dikirim melalui suara, cahaya, radio, atau bahkan ketukan pada suatu permukaan.",
    what_p2: "Karakteristik utamanya adalah kesederhanaan. Berbeda dengan banyak sistem pengodean lainnya, kode Morse hanya memerlukan dua kondisi: aktif dan nonaktif, pendek dan panjang. Hal ini membuatnya sangat andal dalam kondisi sulit. Pesan kode Morse masih dapat dipahami meskipun terdapat kebisingan latar belakang, sinyal radio yang lemah, atau jarak pandang yang buruk — situasi di mana komunikasi suara biasa bisa gagal.",
    how_works_title: "Cara Kerja Kode Morse",
    how_works_p1: "Setiap elemen kode Morse memiliki durasi yang tepat. Garis berdurasi tiga kali lebih lama daripada titik. Jeda antara titik dan garis dalam satu huruf setara dengan satu titik. Jeda antar huruf setara dengan tiga titik, dan jeda antar kata setara dengan tujuh titik. Rasio waktu inilah yang memungkinkan operator berpengalaman membaca kode Morse dengan kecepatan tinggi, bahkan mengenali ritmenya sebelum mengidentifikasi karakter satu per satu.",
    how_works_p2: "Dalam bentuk tertulis, seperti yang digunakan dalam alat ini, huruf dipisahkan dengan satu spasi dan kata dipisahkan dengan garis miring (/). Bagian FAQ di bawah ini berisi contoh praktis tentang bagaimana konvensi ini digunakan saat mengonversi kalimat nyata.",
    table_title: "Tabel Alfabet Morse Internasional",
    table_letters: "Huruf",
    table_numbers: "Angka",
    table_punct: "Tanda Baca",
    punct_period: "Titik",
    punct_comma: "Koma",
    punct_question: "Tanda tanya",
    punct_apostrophe: "Apostrof",
    punct_exclamation: "Tanda seru",
    punct_paren_open: "Tanda kurung buka",
    punct_paren_close: "Tanda kurung tutup",
    punct_ampersand: "Ampersand",
    punct_colon: "Titik dua",
    punct_semicolon: "Titik koma",
    punct_equals: "Tanda sama dengan",
    punct_plus: "Tanda tambah",
    punct_hyphen: "Tanda hubung",
    punct_underscore: "Garis bawah",
    punct_quote: "Tanda kutip",
    punct_at: "Simbol {'@'}",
    use_cases_title: "Di Mana Kode Morse Digunakan Saat Ini",
    use_1_t: "Radio Amatir",
    use_1_d: "Radio amatir merupakan salah satu penggunaan modern utama kode Morse saat ini. Operator di seluruh dunia berkomunikasi melalui gelombang pendek menggunakan mode CW (Continuous Wave), yang pada dasarnya menggunakan kode Morse. Bagi banyak penghobi, hal ini merupakan tradisi sekaligus keterampilan teknis. Selain itu, sinyal CW mampu menembus gangguan dan menjangkau jarak yang sangat jauh dengan daya yang sangat rendah, sesuatu yang sering kali tidak dapat dicapai oleh komunikasi suara.",
    use_2_t: "Penerbangan",
    use_2_d: "Suar radio dan stasiun navigasi masih memancarkan identitas mereka dalam kode Morse, dengan mengulangi urutan huruf stasiun setiap beberapa detik. Pilot dilatih untuk mengenali urutan ini guna memastikan bahwa mereka berada pada frekuensi yang benar.",
    use_3_t: "Komunikasi Militer",
    use_3_d: "Militer masih mempertahankan kode Morse sebagai metode komunikasi cadangan dalam situasi ketika sistem radio digital dapat gagal atau disadap. Kemampuan mengirim pesan menggunakan peralatan sederhana dianggap sebagai keuntungan strategis.",
    use_4_t: "Aksesibilitas",
    use_4_d: "Orang dengan keterbatasan motorik berat menggunakan adaptasi kode Morse untuk berkomunikasi. Dengan satu tombol atau bahkan gerakan kelopak mata, seseorang dapat menulis kata-kata lengkap, dan banyak aplikasi aksesibilitas modern dibangun berdasarkan prinsip ini.",
    use_5_t: "Kepramukaan dan Pendidikan",
    use_5_d: "Banyak kelompok pramuka mengajarkan kode Morse sebagai bagian dari kegiatan komunikasi dan pensinyalan mereka, membantu menjaga keterampilan praktis dan bersejarah ini tetap hidup.",
    use_6_t: "Situasi Darurat",
    use_6_d: "Sinyal SOS (tiga titik, tiga garis, tiga titik) diakui secara universal. Orang-orang di daerah terpencil telah menggunakan senter, cermin, dan api untuk mengirim sinyal darurat dalam kode Morse, dan tim penyelamat dilatih untuk mengenali urutan tersebut.",
    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Masukkan Konten",
    step_1_desc: "Ketik teks biasa untuk dikonversi menjadi kode Morse atau tempel urutan Morse (titik, garis, dan garis miring) untuk didekodekan.",
    step_2_title: "Pilih Arah",
    step_2_desc: "Klik 'Teks → Morse' untuk mengodekan atau 'Morse → Teks' untuk mendekodekan.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Gunakan tombol salin untuk mengirim hasil ke papan klip.",
    faq_title: "Pertanyaan Umum",
    faq1q: "Apa perbedaan antara Morse Amerika dan Morse Internasional?",
    faq1a: "Morse Amerika, yang juga dikenal sebagai kode Morse asli, adalah versi yang dibuat oleh Samuel Morse untuk sistem telegraf kereta api di Amerika Serikat. Sistem ini menggunakan jeda internal pada beberapa huruf, sehingga transmisi radio menjadi lebih sulit. Morse Internasional, yang distandardisasi pada tahun 1865, menghilangkan jeda tersebut dan menyederhanakan beberapa karakter sehingga menjadi standar dunia. Alat ini menggunakan standar internasional.",
    faq2q: "Bagaimana cara mengetik kode Morse di ponsel?",
    faq2a: "Cara termudah adalah menggunakan alat seperti ini: ketik teks Anda lalu salin kode Morse yang dihasilkan. Untuk benar-benar mengirim sinyal, beberapa aplikasi dapat mengubah teks menjadi suara atau kilatan lampu, mengikuti ritme titik dan garis yang benar.",
    faq3q: "Bagaimana aksen dan karakter khusus direpresentasikan dalam kode Morse?",
    faq3a: "Standar internasional kode Morse tidak mendukung karakter beraksen. Alat ini secara otomatis menghapus aksen sebelum konversi, sehingga 'café' akan menjadi 'CAFE'. Karakter di luar alfabet Latin, angka, dan tanda baca yang didukung akan diganti dengan '?'.",
    faq4q: "Berapa lama waktu yang dibutuhkan untuk mempelajari kode Morse?",
    faq4a: "Untuk pengenalan dasar dengan kecepatan 5 hingga 10 kata per menit, kebanyakan orang membutuhkan latihan rutin selama empat hingga delapan minggu, sekitar 15 hingga 30 menit per hari. Untuk mencapai kecepatan percakapan yang lancar di atas 20 kata per menit, biasanya dibutuhkan waktu antara enam bulan hingga satu tahun.",
    faq5q: "Bagaimana cara kerja pemisahan kata dalam kode Morse?",
    faq5a: "Dalam transmisi audio, kata dipisahkan dengan jeda yang setara dengan tujuh titik. Dalam bentuk tertulis, huruf dipisahkan dengan satu spasi dan kata dipisahkan dengan garis miring (/). Sebagai contoh, 'HI YOU' menjadi .... .. / -.-- --- ..-",
    faq6q: "Mengapa SOS menjadi sinyal darurat?",
    faq6a: "Banyak orang mengira SOS merupakan singkatan dari 'Save Our Souls' atau 'Save Our Ship'. Sebenarnya, huruf-huruf tersebut dipilih bukan karena maknanya, melainkan karena kesederhanaan polanya: tiga titik, tiga garis, dan tiga titik tanpa jeda antar huruf. Kombinasi ini mudah dikirim, sulit tertukar dengan pesan lain, dan tetap dapat dikenali bahkan dalam kondisi buruk. Sinyal ini diadopsi sebagai standar maritim internasional untuk keadaan darurat pada tahun 1908, menggantikan sinyal CQD yang sebelumnya digunakan oleh Marconi Company. Pada tahun 1912, tenggelamnya Titanic membantu mempopulerkan SOS di seluruh dunia, meskipun operator kapal saat itu mengirimkan baik CQD maupun SOS.",
    faq7q: "Karakter apa saja yang didukung oleh alat ini?",
    faq7a: "Alat ini mendukung semua huruf alfabet Latin dari A hingga Z, angka 0 hingga 9, serta tanda baca paling umum dalam standar internasional, termasuk titik, koma, tanda tanya, tanda seru, simbol {'@'}, tanda kurung, dan lainnya. Karakter di luar set ini akan diganti dengan tanda tanya pada hasil.",
    faq8q: "Apakah saya bisa mendengarkan kode Morse dalam bentuk audio?",
    faq8a: "Ya. Setelah mengonversi teks menjadi kode Morse, cukup klik tombol putar untuk mendengarkan hasilnya dengan ritme titik dan garis yang tepat. Audio dihasilkan secara lokal oleh browser tanpa perlu instalasi apa pun, sehingga sangat berguna bagi siapa saja yang sedang belajar mengenali kode Morse melalui pendengaran.",
    see1: "Konverter Teks",
    see2: "Pembanding Teks",
    see3: "Konverter Angka Romawi",
    see4: "Penghitung Teks"
  },
  de: {
    title: "Morsecode-Konverter",
    meta_title: "Kostenloser Morsecode-Konverter – Text ↔ Morse mit Audio",
    meta: "Konvertieren Sie Text in Morsecode und dekodieren Sie Morse zurück in Text direkt im Browser. Unterstützt Buchstaben, Zahlen und Satzzeichen. Keine Registrierung, keine Datenübertragung.",
    about_desc: "Dieser Morsecode-Konverter ermöglicht es Ihnen, beliebigen Text in Morse-Signale (Punkte und Striche) umzuwandeln und Morse-Sequenzen zurück in den Originaltext zu dekodieren. Die gesamte Verarbeitung findet direkt in Ihrem Browser statt, ohne Daten an Server zu senden. Auch als Morse-Übersetzer oder Morse-Alphabet-Konverter bekannt, ist das Tool nützlich für Studierende, Amateurfunkbegeisterte, Pfadfinder und alle, die mit dem international standardisierten Morsecode arbeiten müssen.",
    about_desc2: "Die Konvertierung funktioniert in beide Richtungen: Geben Sie ein Wort ein und erhalten Sie die entsprechende Punkt-und-Strich-Sequenz, oder fügen Sie eine Morse-Nachricht ein und lesen Sie den dekodierten Text. Sie können das Ergebnis auch als Audio mit dem korrekten Timing anhören – ideal zum Erlernen des Morse-Hörens. Das Tool unterstützt Buchstaben A bis Z, Ziffern 0 bis 9 und die wichtigsten Satzzeichen des internationalen Standards.",
    label_input: "Text oder Morsecode",
    placeholder: "Text eingeben oder Morsecode hier einfügen...",
    btn_to_morse: "Text → Morse",
    btn_from_morse: "Morse → Text",
    result: "Ergebnis",
    btn_play: "Morse-Audio abspielen",
    btn_stop: "Stopp",
    label_volume: "Lautstärke",
    warn_unknown: "Einige Zeichen wurden nicht erkannt und mit '?' markiert.",
    warn_not_morse: "Die Eingabe sieht nicht wie Morsecode aus. Verwenden Sie die Schaltfläche 'Text → Morse', um normalen Text in Morsecode umzuwandeln.",
    warn_looks_morse: "Die Eingabe sieht wie Morsecode aus. Verwenden Sie die Schaltfläche 'Morse → Text', um ihn zu dekodieren.",
    features_title: "Hauptfunktionen",
    f_1: "Konvertierung von Text in Morsecode",
    f_2: "Dekodierung von Morsecode in Text",
    f_3: "Morsecode-Audio-Wiedergabe im Browser",
    f_4: "Unterstützung für Buchstaben, Zahlen und Satzzeichen",
    f_5: "Lokale Verarbeitung für vollständigen Datenschutz",
    what_title: "Was ist Morsecode",
    what_p1: "Morsecode ist ein Kommunikationssystem, das Buchstaben, Zahlen und Satzzeichen durch Sequenzen kurzer und langer Signale darstellt, allgemein als Punkte und Striche bezeichnet. Jedes Zeichen hat eine einzigartige Kombination dieser Markierungen, die es ermöglicht, Nachrichten per Ton, Licht, Funk oder sogar durch Klopfen auf einer Oberfläche zu übertragen.",
    what_p2: "Sein Hauptmerkmal ist die Einfachheit. Anders als andere Kodierungssysteme benötigt Morse nur zwei Zustände: ein und aus, kurz und lang. Das macht es extrem robust unter widrigen Bedingungen. Eine Morse-Nachricht kann trotz Hintergrundgeräuschen, schwachem Funksignal oder schlechter Sicht verstanden werden – Situationen, in denen die menschliche Stimme versagen würde.",
    how_works_title: "Wie Morsecode funktioniert",
    how_works_p1: "Jedes Element des Codes hat eine genaue Dauer. Ein Strich dauert dreimal so lang wie ein Punkt. Der Abstand zwischen Punkten und Strichen innerhalb desselben Buchstabens entspricht einem Punkt. Der Abstand zwischen Buchstaben entspricht drei Punkten, und der Abstand zwischen Wörtern entspricht sieben Punkten. Dieses Verhältnis ermöglicht es erfahrenen Operatoren, Morse mit überraschender Geschwindigkeit zu lesen und den Rhythmus zu erfassen, noch bevor die einzelnen Zeichen erkannt werden.",
    how_works_p2: "In der schriftlichen Darstellung, wie sie in diesem Tool verwendet wird, werden Buchstaben durch ein einfaches Leerzeichen und Wörter durch einen Schrägstrich getrennt. Die FAQ weiter unten enthält praktische Beispiele, wie diese Konvention beim Konvertieren realer Sätze angewendet wird.",
    table_title: "Tabelle des internationalen Morse-Alphabets",
    table_letters: "Buchstaben",
    table_numbers: "Zahlen",
    table_punct: "Satzzeichen",
    punct_period: "Punkt",
    punct_comma: "Komma",
    punct_question: "Fragezeichen",
    punct_apostrophe: "Apostroph",
    punct_exclamation: "Ausrufezeichen",
    punct_paren_open: "Öffnende Klammer",
    punct_paren_close: "Schließende Klammer",
    punct_ampersand: "Kaufmännisches Und (&)",
    punct_colon: "Doppelpunkt",
    punct_semicolon: "Semikolon",
    punct_equals: "Gleichheitszeichen",
    punct_plus: "Pluszeichen",
    punct_hyphen: "Bindestrich",
    punct_underscore: "Unterstrich",
    punct_quote: "Anführungszeichen",
    punct_at: "At-Zeichen",
    use_cases_title: "Wo wird Morsecode heute verwendet",
    use_1_t: "Amateurfunk",
    use_1_d: "Der Amateurfunk ist heute das Hauptrefugium des Morsecodes. Operatoren aus aller Welt kommunizieren auf Kurzwelle im CW-Modus (Continuous Wave), der im Wesentlichen Morsecode ist. Für viele ist es eine Frage der Tradition und Fertigkeit, aber es gibt auch einen technischen Grund: CW-Signale durchdringen Interferenzen und überbrücken enorme Entfernungen bei sehr geringer Sendeleistung – etwas, das Sprachkommunikation nicht erreichen kann.",
    use_2_t: "Luftfahrt",
    use_2_d: "Funkfeuer und Navigationsstationen übertragen ihren Identifikator noch immer in Morsecode und wiederholen den Stationscode alle paar Sekunden. Piloten werden darauf trainiert, diese Sequenzen zu erkennen und zu bestätigen, dass sie auf der richtigen Frequenz eingestellt sind.",
    use_3_t: "Militärkommunikation",
    use_3_d: "Streitkräfte behalten Morse als sekundäre Ressource für Situationen, in denen digitale Funkgeräte ausfallen oder abgehört werden könnten. Die Fähigkeit, mit improvisierten Geräten zu senden, gilt als strategischer Vorteil.",
    use_4_t: "Barrierefreiheit",
    use_4_d: "Menschen mit schweren motorischen Einschränkungen nutzen Morse-Anpassungen zur Kommunikation. Mit einem einzigen Tastendruck oder einer Augenlidbewegung lassen sich ganze Wörter schreiben, und es gibt moderne Anwendungen, die auf diesem Prinzip basieren.",
    use_5_t: "Pfadfinder und Bildung",
    use_5_d: "Viele Pfadfindergruppen unterrichten den Code als Teil ihres Kommunikations- und Signalisierungsprogramms und halten damit eine praktische und historisch wichtige Fähigkeit am Leben.",
    use_6_t: "Notfallsituationen",
    use_6_d: "Das SOS-Signal (drei Punkte, drei Striche, drei Punkte) ist weltweit anerkannt. Überlebende in abgelegenen Gebieten haben Taschenlampen, Spiegel und Feuer benutzt, um Notsignale in Morse zu senden, und Rettungsteams sind darauf trainiert, diese Sequenzen zu erkennen.",
    how_to_use_title: "So verwenden Sie das Tool",
    step_1_title: "Inhalt eingeben",
    step_1_desc: "Geben Sie normalen Text zur Umwandlung in Morse ein oder fügen Sie eine Morse-Sequenz (Punkte, Striche und Schrägstriche) zum Dekodieren ein.",
    step_2_title: "Richtung wählen",
    step_2_desc: "Klicken Sie auf 'Text → Morse' zum Kodieren oder auf 'Morse → Text' zum Dekodieren.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Verwenden Sie die Kopierschaltfläche, um das Ergebnis in die Zwischenablage zu übertragen.",
    faq_title: "Häufig gestellte Fragen",
    faq1q: "Was ist der Unterschied zwischen amerikanischem und internationalem Morsecode?",
    faq1a: "Der amerikanische Morsecode, auch Original-Morse genannt, war die von Samuel Morse für die US-Eisenbahntelegrafie entwickelte Version. Er verwendete interne Pausen bei einigen Buchstaben, was die Funkübertragung erschwerte. Der internationale Morsecode, 1865 standardisiert, beseitigte diese Pausen und vereinfachte mehrere Buchstaben – er wurde zum Weltstandard. Dieses Tool verwendet den internationalen Standard.",
    faq2q: "Wie gebe ich Morsecode auf einem Mobiltelefon ein?",
    faq2a: "Am einfachsten ist es, ein Tool wie dieses zu verwenden: Text eingeben und das Morse-Ergebnis kopieren. Um das Signal tatsächlich zu übertragen, konvertieren einige Apps den Text in Töne oder Taschenlampen-Blinksignale, die den korrekten Rhythmus von Punkten und Strichen wiedergeben.",
    faq3q: "Wie werden Umlaute und Sonderzeichen in Morse dargestellt?",
    faq3a: "Der internationale Morse-Standard deckt keine Umlaute oder Akzentzeichen ab. Dieses Tool entfernt Akzente vor der Konvertierung automatisch und behandelt zum Beispiel 'café' als 'CAFE'. Zeichen außerhalb des lateinischen Alphabets, Ziffern und unterstützte Satzzeichen werden mit '?' markiert.",
    faq4q: "Wie lange dauert es, Morsecode zu lernen?",
    faq4a: "Für eine grundlegende Erkennung von 5 bis 10 Wörtern pro Minute benötigen die meisten Menschen vier bis acht Wochen regelmäßiges Üben, etwa 15 bis 30 Minuten täglich. Fließende Gesprächsgeschwindigkeiten über 20 Wörter pro Minute zu erreichen, kann sechs Monate bis ein Jahr dauern.",
    faq5q: "Wie funktioniert die Worttrennung im Morsecode?",
    faq5a: "Bei der Tonübertragung werden Wörter durch eine Pause getrennt, die sieben Punkten entspricht. In der schriftlichen Darstellung werden Buchstaben durch ein Leerzeichen und Wörter durch einen Schrägstrich getrennt. Zum Beispiel wird 'HI DU' zu .... .. / -.. ..-",
    faq6q: "Warum ist SOS das Notsignal?",
    faq6a: "Ein verbreitetes Missverständnis ist, dass SOS für 'Save Our Souls' oder 'Save Our Ship' steht. Tatsächlich wurden die Buchstaben nicht wegen ihrer Bedeutung gewählt, sondern wegen der Einfachheit der Sequenz: drei Punkte, drei Striche, drei Punkte, ohne Pausen zwischen den Buchstaben. Diese Kombination ist einfach zu senden, schwer mit anderen Nachrichten zu verwechseln und auch unter schlechten Bedingungen erkennbar. Das Signal wurde 1908 als internationaler Seenotrufstandard eingeführt und ersetzte das alte CQD der Marconi Company. 1912 brachte der Untergang der Titanic das SOS ins öffentliche Bewusstsein, obwohl die Funker des Schiffes in jener Nacht sowohl CQD als auch SOS sendeten.",
    faq7q: "Welche Zeichen unterstützt dieses Tool?",
    faq7a: "Das Tool unterstützt alle Buchstaben des lateinischen Alphabets von A bis Z, Ziffern von 0 bis 9 und die häufigsten Satzzeichen des internationalen Standards, darunter Punkt, Komma, Fragezeichen, Ausrufezeichen, At-Zeichen, Klammern und weitere. Zeichen außerhalb dieser Menge werden im Ergebnis mit einem Fragezeichen markiert.",
    faq8q: "Kann ich den Morsecode als Audio anhören?",
    faq8a: "Ja. Nachdem Sie Text in Morsecode umgewandelt haben, klicken Sie einfach auf die Wiedergabetaste, um das Ergebnis mit dem korrekten Timing von Punkten und Strichen zu hören. Der Ton wird lokal vom Browser erzeugt, ohne dass eine Installation erforderlich ist, und ist hilfreich für alle, die Morse hören lernen möchten.",
    see1: "Textkonverter",
    see2: "Text-Vergleicher",
    see3: "Römische Zahlen",
    see4: "Textzähler"
  },
  nl: {
    title: "Morsecode-converter",
    meta_title: "Gratis Morsecode-converter – Tekst ↔ Morse met audio",
    meta: "Converteer tekst naar morsecode en decodeer morse terug naar tekst, rechtstreeks in uw browser. Ondersteunt letters, cijfers en leestekens. Geen registratie en geen gegevensverzending.",
    about_desc: "Deze Morsecode-converter stelt u in staat elke tekst om te zetten in morse-signalen (punten en strepen) en morse-reeksen terug te decoderen naar de oorspronkelijke tekst. Alle verwerking vindt rechtstreeks in uw browser plaats, zonder gegevens naar servers te verzenden. Ook bekend als morse-vertaler of morse-alfabetconverter, is de tool nuttig voor studenten, radioamateurs, padvinders en iedereen die met de internationaal gestandaardiseerde morsecode wil werken.",
    about_desc2: "De conversie werkt in beide richtingen: typ een woord en ontvang de bijbehorende punt-en-streep-reeks, of plak een morsebericht en lees de gedecodeerde tekst. U kunt het resultaat ook beluisteren als audio met de juiste timing, ideaal voor wie morse wil leren herkennen op gehoor. De tool ondersteunt letters A tot Z, cijfers 0 tot 9 en de belangrijkste leestekens van de internationale standaard.",
    label_input: "Tekst of morsecode",
    placeholder: "Typ tekst of plak morsecode hier...",
    btn_to_morse: "Tekst → Morse",
    btn_from_morse: "Morse → Tekst",
    result: "Resultaat",
    btn_play: "Afspelen in Morse",
    btn_stop: "Stoppen",
    label_volume: "Volume",
    warn_unknown: "Sommige tekens werden niet herkend en zijn gemarkeerd met '?'.",
    warn_not_morse: "De invoer ziet er niet uit als morsecode. Gebruik de knop 'Tekst → Morse' om gewone tekst naar morsecode te converteren.",
    warn_looks_morse: "De invoer ziet eruit als morsecode. Gebruik de knop 'Morse → Tekst' om het te decoderen.",
    features_title: "Belangrijkste functies",
    f_1: "Conversie van tekst naar morsecode",
    f_2: "Decodering van morsecode naar tekst",
    f_3: "Audio-weergave van morsecode in de browser",
    f_4: "Ondersteuning voor letters, cijfers en leestekens",
    f_5: "Lokale verwerking voor volledige privacy",
    what_title: "Wat is morsecode",
    what_p1: "Morsecode is een communicatiesysteem dat letters, cijfers en leestekens weergeeft door middel van reeksen korte en lange signalen, gewoonlijk punten en strepen genoemd. Elk teken heeft een unieke combinatie van deze markeringen, waardoor berichten kunnen worden verzonden via geluid, licht, radio of zelfs door te tikken op een oppervlak.",
    what_p2: "Het belangrijkste kenmerk is de eenvoud. Anders dan andere coderingssystemen heeft morse slechts twee toestanden nodig: aan en uit, kort en lang. Dit maakt het extreem robuust onder moeilijke omstandigheden. Een morsebericht kan worden begrepen ondanks achtergrondlawaai, een zwak radiosignaal of slecht zicht – situaties waarbij de menselijke stem zou falen.",
    how_works_title: "Hoe morsecode werkt",
    how_works_p1: "Elk element van de code heeft een nauwkeurige duur. Een streep duurt drie keer zo lang als een punt. De ruimte tussen punten en strepen binnen dezelfde letter is gelijk aan één punt. De ruimte tussen letters is gelijk aan drie punten, en de ruimte tussen woorden is gelijk aan zeven punten. Deze verhouding stelt ervaren operators in staat morse op verrassende snelheden te lezen, waarbij ze het ritme oppikken voordat de afzonderlijke tekens worden herkend.",
    how_works_p2: "In de schriftelijke weergave, zoals gebruikt in dit hulpmiddel, worden letters gescheiden door een enkele spatie en woorden door een schuine streep. De onderstaande FAQ bevat praktische voorbeelden van hoe deze conventie wordt toegepast bij het converteren van echte zinnen.",
    table_title: "Tabel van het internationale morse-alfabet",
    table_letters: "Letters",
    table_numbers: "Cijfers",
    table_punct: "Leestekens",
    punct_period: "Punt",
    punct_comma: "Komma",
    punct_question: "Vraagteken",
    punct_apostrophe: "Apostrof",
    punct_exclamation: "Uitroepteken",
    punct_paren_open: "Openingshaakje",
    punct_paren_close: "Sluitingshaakje",
    punct_ampersand: "En-teken (&)",
    punct_colon: "Dubbele punt",
    punct_semicolon: "Puntkomma",
    punct_equals: "Gelijkteken",
    punct_plus: "Plusteken",
    punct_hyphen: "Koppelteken",
    punct_underscore: "Laag streepje",
    punct_quote: "Aanhalingstekens",
    punct_at: "Apenstaartje",
    use_cases_title: "Waar wordt morsecode vandaag nog gebruikt",
    use_1_t: "Amateurradio",
    use_1_d: "Amateurradio is een van de belangrijkste moderne toepassingen van morsecode vandaag de dag. Operators over de hele wereld communiceren op kortegolf via de CW-modus (Continuous Wave), wat in wezen morsecode is. Voor velen is het een kwestie van traditie en vaardigheid, maar er is ook een technische reden: CW-signalen doorbreken storingen en overbruggen enorme afstanden met zeer laag vermogen – iets wat spraakcommunicatie niet kan bereiken.",
    use_2_t: "Luchtvaart",
    use_2_d: "Radiobakens en navigatiestations zenden hun identificatie nog steeds in morse uit en herhalen de stationscode elke paar seconden. Piloten worden getraind om deze reeksen te herkennen en te bevestigen dat ze op de juiste frequentie zijn afgestemd.",
    use_3_t: "Militaire communicatie",
    use_3_d: "Strijdkrachten houden morse als secundaire bron voor situaties waarin digitale radio's kunnen uitvallen of worden onderschept. De mogelijkheid om te zenden met geïmproviseerde apparatuur wordt beschouwd als een strategisch voordeel.",
    use_4_t: "Toegankelijkheid",
    use_4_d: "Mensen met ernstige motorische beperkingen gebruiken morse-aanpassingen om te communiceren. Met één druk op een knop of een ooglidbeweging kunnen hele woorden worden geschreven, en er zijn moderne toepassingen gebaseerd op dit principe.",
    use_5_t: "Scouting en onderwijs",
    use_5_d: "Veel scoutinggroepen onderwijzen de code als onderdeel van hun communicatie- en seinprogramma en houden daarmee een praktische en historisch belangrijke vaardigheid in leven.",
    use_6_t: "Noodsituaties",
    use_6_d: "Het SOS-signaal (drie punten, drie strepen, drie punten) is wereldwijd erkend. Overlevenden in afgelegen gebieden hebben zaklampen, spiegels en vuren gebruikt om noodsignalen in morse te geven, en reddingsteams worden getraind om deze reeksen te herkennen.",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Voer de inhoud in",
    step_1_desc: "Typ gewone tekst om naar morse te converteren, of plak een morse-reeks (punten, strepen en schuine strepen) om te decoderen.",
    step_2_title: "Kies de richting",
    step_2_desc: "Klik op 'Tekst → Morse' om te coderen, of op 'Morse → Tekst' om te decoderen.",
    step_3_title: "Kopieer het resultaat",
    step_3_desc: "Gebruik de kopieerknop om het resultaat naar het klembord te sturen.",
    faq_title: "Veelgestelde vragen",
    faq1q: "Wat is het verschil tussen Amerikaanse morse en internationale morse?",
    faq1a: "De Amerikaanse morse, ook wel de originele morse genoemd, was de versie die Samuel Morse ontwikkelde voor de Amerikaanse spoorwegtelegrafie. Deze gebruikte interne pauzes bij sommige letters, wat radiotransmissie bemoeilijkte. De internationale morse, gestandaardiseerd in 1865, elimineerde die pauzes en vereenvoudigde verschillende letters – en werd de wereldstandaard. Dit hulpmiddel gebruikt de internationale standaard.",
    faq2q: "Hoe typ ik morsecode op een telefoon?",
    faq2a: "De eenvoudigste manier is een hulpmiddel zoals dit te gebruiken: typ uw tekst en kopieer het morse-resultaat. Om het signaal daadwerkelijk te verzenden, converteren sommige apps de tekst naar geluiden of zaklampflitsen die het juiste ritme van punten en strepen nabootsen.",
    faq3q: "Hoe worden accenten en speciale tekens weergegeven in morse?",
    faq3a: "De internationale morse-standaard ondersteunt geen accenten. Dit hulpmiddel verwijdert accenten automatisch voor de conversie, zodat 'café' wordt behandeld als 'CAFE'. Tekens buiten het Latijnse alfabet, cijfers en ondersteunde leestekens worden gemarkeerd met '?'.",
    faq4q: "Hoe lang duurt het om morsecode te leren?",
    faq4a: "Voor basisherkenning op 5 tot 10 woorden per minuut hebben de meeste mensen vier tot acht weken regelmatige oefening nodig, ongeveer 15 tot 30 minuten per dag. Vloeiende gesprekssnelheden boven de 20 woorden per minuut bereiken kan zes maanden tot een jaar duren.",
    faq5q: "Hoe werkt woordscheiding in morsecode?",
    faq5a: "Bij audiotransmissie worden woorden gescheiden door een pauze gelijk aan zeven punten. In de schriftelijke weergave worden letters gescheiden door een spatie en woorden door een schuine streep. Zo wordt 'HI YOU' bijvoorbeeld .... .. / -.-- --- ..-",
    faq6q: "Waarom is SOS het noodsignaal?",
    faq6a: "Een veelvoorkomend misverstand is dat SOS staat voor 'Save Our Souls' of 'Save Our Ship'. In werkelijkheid werden de letters niet gekozen om hun betekenis, maar om de eenvoud van de reeks: drie punten, drie strepen, drie punten, zonder pauzes tussen de letters. Deze combinatie is eenvoudig te verzenden, moeilijk te verwarren met andere berichten en herkenbaar zelfs in slechte omstandigheden. Het signaal werd in 1908 aangenomen als internationale maritieme noodstandaard en verving het oude CQD van de Marconi Company. In 1912 bracht het zinken van de Titanic SOS onder de aandacht van het grote publiek, hoewel de operators van het schip die nacht zowel CQD als SOS uitzonden.",
    faq7q: "Welke tekens ondersteunt dit hulpmiddel?",
    faq7a: "Het hulpmiddel ondersteunt alle letters van het Latijnse alfabet van A tot Z, cijfers van 0 tot 9 en de meest voorkomende leestekens van de internationale standaard, waaronder punt, komma, vraagteken, uitroepteken, apenstaartje, haakjes en andere. Tekens buiten deze set worden in het resultaat gemarkeerd met een vraagteken.",
    faq8q: "Kan ik de morsecode als audio beluisteren?",
    faq8a: "Ja. Nadat u tekst naar morsecode heeft geconverteerd, klikt u gewoon op de afspeelknop om het resultaat te horen met de juiste timing van punten en strepen. Het geluid wordt lokaal door de browser gegenereerd zonder installatie, en is handig voor iedereen die morse wil leren herkennen op gehoor.",
    see1: "Tekstconverter",
    see2: "Tekstvergelijker",
    see3: "Romeinse cijfers",
    see4: "Tekstteller"
  }
}
</i18n>
