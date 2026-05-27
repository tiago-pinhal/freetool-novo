<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const COPY_FEEDBACK_MS = 2000

// [leftEye, rightEye] or [symmetricEye]
const eyeOptions: string[][] = [
  [' ͡°'],
  [' ͡ʘ'],
  ['ʘ'],
  [' ͡•'],
  ['ಠ'],
  [' ͡~'],
  ['ᵔ'],
  [' ͡≖'],
  [' ͡⊙'],
  ['◉'],
  ['☉'],
  ['◕'],
  ['◔'],
  ['✧'],
  ['♥'],
  ['•'],
  ['T'],
  ['^'],
  ['-'],
  ['x'],
  ['$'],
  ['@'],
  ['*'],
  ['□'],
  ['■'],
  ['▰'],
  ['・'],
  ['☼'],
  ['⚆'],
  ['⊜'],
  ['>'],
  ['❍'],
  ['─'],
  ['ᴗ'],
  ['σ'],
  ['☯'],
  ['ⴲ'],
  ['ළ'],
  ['ⱺ'],
  [' ͡ .'],
  [' ﾟ'],
  [' º '],
  ['ಥ'],
  ['눈'],
  ['★'],
  ['⌒'],
  ['⌐■', '■'],
  ['◣', '◢'],
  [' ͠°', ' °'],
  ['⇀', '↼'],
  ['´• ', ' •`'],
  ['ó', 'ò'],
  ['ò', 'ó'],
  ['>', '<'],
  ['ᗒ', 'ᗕ'],
  ['⪧', '⪦'],
  ['⪦', '⪧'],
  ['⪩', '⪨'],
  ['⪨', '⪩'],
  ['⪰', '⪯'],
  ['⩾', '⩽'],
  ['⩺', '⩹'],
  ['⩹', '⩺'],
  ['◥▶', '◀◤'],
  ['◍', '◎'],
]

const mouthOptions: string[] = [
  ' ͜ʖ',
  ' ͟ل͜',
  ' ͟ʖ',
  ' ʖ̯',
  ' ͜ل',
  '╭͜ʖ╮',
  '‿',
  '‿‿',
  'ω',
  'ᴥ',
  'ᗝ',
  'Ѡ',
  'ᗜ',
  'ヮ',
  'v',
  '▾',
  '‸',
  'Д',
  '∀',
  '.',
  '_',
  '□',
  '!',
  '人',
  'ロ',
  '◡',
  '╭╮',
  ' ³',
  ' ε ',
  '﹏',
  'ツ',
  '益',
  '╭∩╮',
  '⏠',
  '⍊',
  'ᗢ',
  ' ͜つ',
]

// [leftEar, rightEar]
const earOptions: string[][] = [
  ['(', ')'],
  ['[', ']'],
  ['ノ(', ')ヽ'],
  ['╯(', ')╰'],
  ['ᕦ(', ')ᕤ'],
  ['ᕙ(', ')ᕗ'],
  ['ᕕ(', ')ᕗ'],
  ['ʕ', 'ʔ'],
  ['q', 'p'],
  ['⎝', '⎠'],
  ['ᘳ', 'ᘰ'],
  ['ᖗ', 'ᖘ'],
  ['ᕮ', 'ᕭ'],
  ['ᕳ', 'ᕲ'],
  ['ᑫ', 'ᑷ'],
  ['ᑴ', 'ᑷ'],
  ['ヽ(', ')ﾉ'],
  ['\\(', ')/'],
  ['乁(', ')ㄏ'],
  ['└[', ']┘'],
  ['(づ', ')づ'],
  ['(ง', ')ง'],
  ['ლ(', 'ლ)'],
  ['⤜(', ')⤏'],
  ['(∩', ')⊃━☆ﾟ.*'],
  ['¯\\_(', ')_/¯'],
  ['୧(', ')୨'],
  ['ʢ', 'ʡ'],
  ['o(', ')o'],
  ['(ノ', ')ノ彡┻━┻'],
  ['(', ')╭∩╮'],
  ['╭∩╮(', ')╭∩╮'],
  ['⊂(', ')⊃'],
  ['(つ', ')つ'],
  ['✌(', ')✌'],
  ['ヘ(', ')ヘ'],
  ['(', ')ゞ'],
  ['ʚ(', ')ɞ'],
  ['ノ(', ')ノ'],
  ['༼', '༽'],
  ['༼ つ', '༽つ'],
]

const presets: { labelKey: string; face: string }[] = [
  { labelKey: 'p_classic', face: '( ͡° ͜ʖ ͡°)' },
  { labelKey: 'p_flex', face: 'ᕦ( ͡° ͜ʖ ͡°)ᕤ' },
  { labelKey: 'p_shrug', face: '¯\\_( ͡° ͜ʖ ͡°)_/¯' },
  { labelKey: 'p_magic', face: '(∩ ͡° ͜ʖ ͡°)⊃━☆ﾟ. * ･ ｡ﾟ' },
  { labelKey: 'p_table_flip', face: '（╯ ͡° ͟ل͜ ͡°）╯︵ ┻━┻' },
  { labelKey: 'p_unflip', face: '┬──┬ ノ( ͡° ل͜ ͡°ノ)' },
  { labelKey: 'p_fisticuffs', face: '(ง ͠° ͟ل͜ ͡°)ง' },
  { labelKey: 'p_love', face: '( ♥ ͜ʖ ♥)' },
  { labelKey: 'p_disapproval', face: '( ͡° ʖ̯ ͡°)' },
  { labelKey: 'p_tripping', face: '( ͡◉ ͜ʖ ͡◉)' },
  { labelKey: 'p_sensual', face: '(͠≖ ͜ʖ͠≖)' },
  { labelKey: 'p_peek', face: '( ͡° ͜ʖ├┬┴┬' },
  { labelKey: 'p_blush', face: '( ͡°⁄ ⁄ ͜⁄ ⁄ʖ⁄ ⁄ ͡°)' },
  { labelKey: 'p_bird', face: '( ͡° ͜ʖ ͡°)╭∩╮' },
  { labelKey: 'p_bear', face: 'ʕ ͡° ͜ʖ ͡°ʔ' },
  { labelKey: 'p_sword', face: '<:::::[]=¤( ͡° ͜ʖ ͡°)' },
  { labelKey: 'p_bill', face: '－－＝Ξ[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]' },
  { labelKey: 'p_wick', face: ` ̿̿ ̿̿ ̿̿ ̿'̿'̵͇̿з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿/'̿'̿ ̿ ̿̿ ̿̿ ̿̿` },
  { labelKey: 'p_straya', face: '( ͜。 ͡ʖ ͜。)' },
  { labelKey: 'p_thumbs_up', face: '( ͡⚆ ͜ʖ ͡⚆)∩╮' },
]

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') },
    { question: t('faq_6_q'), answer: t('faq_6_a') },
  ]
})

useHead({
  title: t('m_title'),
  meta: [{ name: 'description', content: t('meta') }]
})

const state = reactive({
  eyeIndex: 0,
  mouthIndex: 0,
  earIndex: 0,
  copiedFace: null as string | null,
  copyAnnouncement: '',
})

const composedFace = computed(() => {
  const eye = eyeOptions[state.eyeIndex]
  const mouth = mouthOptions[state.mouthIndex]
  const ear = earOptions[state.earIndex]
  const leftEye = eye[0]
  const rightEye = eye.length > 1 ? eye[1] : eye[0]
  return `${ear[0]}${leftEye}${mouth}${rightEye}${ear[1]}`
})

function randomize() {
  state.eyeIndex = Math.floor(Math.random() * eyeOptions.length)
  state.mouthIndex = Math.floor(Math.random() * mouthOptions.length)
  state.earIndex = Math.floor(Math.random() * earOptions.length)
}

async function copy(face: string) {
  try {
    await navigator.clipboard.writeText(face)
    state.copiedFace = face
    state.copyAnnouncement = t('copied_announce')
    setTimeout(() => {
      state.copiedFace = null
      state.copyAnnouncement = ''
    }, COPY_FEEDBACK_MS)
  } catch {}
}

function eyePreview(eye: string[]): string {
  const l = eye[0]
  const r = eye.length > 1 ? eye[1] : eye[0]
  return `${l} ${r}`
}

function earPreview(ear: string[]): string {
  return `${ear[0]}…${ear[1]}`
}

defineI18nRoute({
  paths: {
    en: '/lenny-face',
    pt: '/lenny-face',
    es: '/lenny-face',
    fr: '/lenny-face',
    it: '/lenny-face',
    id: '/lenny-face',
    de: '/lenny-face',
    nl: '/lenny-face',
    ru: '/lenny-face',
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="true"
    :see-also-links="[
      { label: t('see1'), to: 'kaomoji' },
      { label: t('see2'), to: 'emoji-picker' },
      { label: t('see3'), to: 'copy-paste-symbols' },
      { label: t('see4'), to: 'fancy-letters' },
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Preview + Copiar -->
      <div class="bg-base-200 rounded-3xl p-6 flex flex-col items-center gap-4">
        <div
          class="relative w-full min-h-[80px] flex items-center justify-center bg-base-100 rounded-2xl px-6 py-4 shadow-sm cursor-pointer select-all group"
          :class="state.copiedFace === composedFace ? 'ring-2 ring-success' : ''"
          @click="copy(composedFace)"
          :aria-label="`${t('copy_aria')} ${composedFace}`"
        >
          <span class="text-2xl sm:text-3xl font-medium tracking-wide text-center whitespace-pre-wrap break-all">
            {{ composedFace }}
          </span>
          <div
            class="absolute inset-0 flex items-center justify-center bg-success/90 text-success-content rounded-2xl opacity-0 transition-all duration-200"
            :class="state.copiedFace === composedFace ? '!opacity-100 z-10' : ''"
          >
            <div class="flex items-center gap-2 font-bold">
              <Icon name="material-symbols:check-circle-rounded" class="w-6 h-6" aria-hidden="true" />
              <span class="text-base uppercase tracking-wider">{{ t('copied') }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3 w-full">
          <button
            type="button"
            class="btn btn-primary flex-1 gap-2"
            @click="copy(composedFace)"
          >
            <Icon name="material-symbols:content-copy-rounded" class="w-5 h-5" />
            {{ t('copy_btn') }}
          </button>
          <button
            type="button"
            class="btn btn-outline gap-2"
            @click="randomize"
          >
            <Icon name="material-symbols:shuffle-rounded" class="w-5 h-5" />
            {{ t('random_btn') }}
          </button>
        </div>
      </div>

      <!-- Seletores -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <!-- Olhos -->
        <div class="bg-base-200 rounded-2xl p-4 space-y-2">
          <p class="text-sm font-bold text-base-content/70 uppercase tracking-wide">{{ t('label_eyes') }}</p>
          <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              v-for="(eye, i) in eyeOptions"
              :key="i"
              type="button"
              @click="state.eyeIndex = i"
              class="px-2.5 py-1.5 rounded-lg text-sm font-mono transition-all cursor-pointer whitespace-nowrap"
              :class="state.eyeIndex === i
                ? 'bg-primary text-primary-content shadow'
                : 'bg-base-100 hover:bg-base-300'"
            >
              {{ eyePreview(eye) }}
            </button>
          </div>
        </div>

        <!-- Boca -->
        <div class="bg-base-200 rounded-2xl p-4 space-y-2">
          <p class="text-sm font-bold text-base-content/70 uppercase tracking-wide">{{ t('label_mouth') }}</p>
          <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              v-for="(mouth, i) in mouthOptions"
              :key="i"
              type="button"
              @click="state.mouthIndex = i"
              class="px-2.5 py-1.5 rounded-lg text-sm font-mono transition-all cursor-pointer whitespace-nowrap"
              :class="state.mouthIndex === i
                ? 'bg-primary text-primary-content shadow'
                : 'bg-base-100 hover:bg-base-300'"
            >
              {{ mouth }}
            </button>
          </div>
        </div>

        <!-- Corpo -->
        <div class="bg-base-200 rounded-2xl p-4 space-y-2">
          <p class="text-sm font-bold text-base-content/70 uppercase tracking-wide">{{ t('label_arms') }}</p>
          <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              v-for="(ear, i) in earOptions"
              :key="i"
              type="button"
              @click="state.earIndex = i"
              class="px-2.5 py-1.5 rounded-lg text-sm font-mono transition-all cursor-pointer whitespace-nowrap"
              :class="state.earIndex === i
                ? 'bg-primary text-primary-content shadow'
                : 'bg-base-100 hover:bg-base-300'"
            >
              {{ earPreview(ear) }}
            </button>
          </div>
        </div>

      </div>

      <!-- Live region acessibilidade -->
      <div aria-live="polite" class="sr-only">{{ state.copyAnnouncement }}</div>

      <!-- Clássicos -->
      <div class="bg-base-200 rounded-3xl p-4 sm:p-6">
        <p class="text-sm font-bold text-base-content/70 uppercase tracking-wide mb-3">{{ t('presets_label') }}</p>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="preset in presets"
            :key="preset.labelKey"
            type="button"
            @click="copy(preset.face)"
            class="relative group flex flex-col items-center gap-1 px-4 py-3 bg-base-100 hover:bg-base-300 transition-all duration-200 rounded-2xl shadow-sm hover:shadow-md active:scale-95 cursor-pointer min-w-[80px]"
            :class="state.copiedFace === preset.face ? '!bg-success/20 ring-2 ring-success' : ''"
            :aria-label="`${t('copy_aria')} ${preset.face}`"
          >
            <span class="text-base sm:text-lg font-medium tracking-wide whitespace-nowrap text-center">{{ preset.face }}</span>
            <span class="text-xs text-base-content/70">{{ t(preset.labelKey) }}</span>

            <div
              class="absolute inset-0 flex items-center justify-center bg-success/90 text-success-content rounded-2xl opacity-0 transition-all duration-200"
              :class="state.copiedFace === preset.face ? '!opacity-100 z-10' : ''"
            >
              <div class="flex items-center gap-1.5 font-bold">
                <Icon name="material-symbols:check-circle-rounded" class="w-5 h-5" aria-hidden="true" />
                <span class="text-sm uppercase tracking-wider">{{ t('copied') }}</span>
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('d1') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
        />

        <HowToSection
          :title="t('how_it_works_title')"
          :items="[
            { title: t('hiw_1_title'), description: t('hiw_1_desc') },
            { title: t('hiw_2_title'), description: t('hiw_2_desc') },
            { title: t('hiw_3_title'), description: t('hiw_3_desc') },
          ]"
        />

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
            { question: t('faq_5_q'), answer: t('faq_5_a') },
            { question: t('faq_6_q'), answer: t('faq_6_a') },
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="json">
{
  "pt": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Copiar e Colar • 98.000+ Combinações Personalizadas",
    "title": "Gerador de Lenny Face",
    "meta": "O meme Lenny Face ( ͡° ͜ʖ ͡°) — copie 20 clássicos prontos ou crie o seu com mais de 98.000 combinações de olhos, boca e corpo. Grátis, funciona no WhatsApp, Discord, Reddit e jogos.",
    "d1": "O Lenny Face ( ͡° ͜ʖ ͡°) é um dos memes de texto mais icônicos da internet. Com este gerador online e gratuito, você monta sua própria versão combinando dezenas de estilos de olhos, bocas e corpos — mais de 98.000 combinações possíveis no total — gera combinações aleatórias com um clique ou escolhe um dos 20 clássicos prontos, como Flexão, Magia e Virando a Mesa. Além do gerador, a página serve como coleção de Lenny Faces para copiar e colar direto no WhatsApp, Discord, Reddit, TikTok, jogos e qualquer campo de texto.",
    "label_eyes": "Olhos",
    "label_mouth": "Boca",
    "label_arms": "Corpo",
    "copy_btn": "Copiar",
    "random_btn": "Aleatório",
    "copy_aria": "Copiar",
    "copied": "Copiado!",
    "copied_announce": "Lenny Face copiado para a área de transferência",
    "presets_label": "Clássicos",
    "features_title": "Recursos do Gerador de Lenny Face",
    "f_1": "Clique em qualquer carinha para copiá-la instantaneamente.",
    "f_2": "Combine olhos, boca e corpo para criar sua versão personalizada.",
    "f_3": "Botão Aleatório sorteia uma combinação nova com um clique.",
    "f_4": "20 clássicos prontos, incluindo Flexão, Magia e Virando a Mesa.",
    "how_it_works_title": "Como usar",
    "hiw_1_title": "Escolha as partes",
    "hiw_1_desc": "Selecione os olhos, a boca e o corpo nas grades. A prévia atualiza na hora.",
    "hiw_2_title": "Copie",
    "hiw_2_desc": "Clique no botão Copiar ou clique direto na prévia para copiar a carinha para a área de transferência.",
    "hiw_3_title": "Cole em qualquer lugar",
    "hiw_3_desc": "Cole seu Lenny Face no WhatsApp, Discord, Reddit, Twitter ou em qualquer campo de texto.",
    "faq_title": "Perguntas e Respostas",
    "faq_1_q": "O que é um Lenny Face?",
    "faq_1_a": "O Lenny Face ( ͡° ͜ʖ ͡°) é uma das carinhas de texto mais icônicas da internet. Criado com caracteres Unicode especiais, surgiu em fóruns online como o 4chan por volta de 2012 e rapidamente virou um meme mundialmente conhecido. Hoje, é amplamente usado em redes sociais, chats e jogos para expressar ironia, humor, sarcasmo ou segundas intenções.",
    "faq_2_q": "Lenny Face funciona no WhatsApp, Discord e redes sociais?",
    "faq_2_a": "Sim. Lenny Faces são compostos por caracteres Unicode padrão e funcionam na grande maioria das plataformas: WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok e a maioria dos jogos online. Em alguns casos, combinações com caracteres mais raros podem aparecer ligeiramente diferentes dependendo da fonte ou sistema operacional do destinatário.",
    "faq_3_q": "Posso usar Lenny Face em nicknames de jogos?",
    "faq_3_a": "Depende do jogo. Plataformas como Steam, Discord e a maioria dos jogos de PC aceitam caracteres Unicode sem problemas. Jogos mobile e consoles costumam ser mais restritivos — alguns bloqueiam caracteres especiais para evitar nomes ofensivos ou exploits. Recomendamos testar o Lenny Face no campo de nickname antes de salvar, pois os caracteres combinantes podem ser truncados ou recusados dependendo do sistema.",
    "faq_4_q": "O que significa o Lenny Face?",
    "faq_4_a": "O Lenny Face é um meme de internet que geralmente transmite um olhar malicioso ou cúmplice — ironia, sarcasmo, humor ou duplo sentido. Por causa de sua expressão satisfeita e ligeiramente perturbadora, tornou-se a carinha padrão para insinuar algo sem dizer diretamente. É um dos memes de texto mais reconhecidos da internet.",
    "faq_5_q": "Como digitar o Lenny Face no teclado?",
    "faq_5_a": "O Lenny Face usa caracteres Unicode combinantes especiais que não podem ser digitados diretamente em um teclado padrão. A forma mais fácil é copiá-lo desta página — clique em qualquer clássico ou use o gerador para criar o seu, e depois cole onde precisar. Algumas plataformas também têm extensões de navegador ou atalhos que o inserem automaticamente.",
    "faq_6_q": "Quantas combinações de Lenny Face existem?",
    "faq_6_a": "Com este gerador você pode criar mais de 98.000 combinações únicas — 65 estilos de olhos × 37 estilos de boca × 41 estilos de corpo. Cada combinação gera um Lenny Face diferente, desde o clássico ( ͡° ͜ʖ ͡°) até versões de urso, espada, magia e muito mais.",
    "p_classic": "Clássico",
    "p_flex": "Musculoso",
    "p_shrug": "Dando de Ombros",
    "p_magic": "Magia",
    "p_table_flip": "Virando a Mesa",
    "p_unflip": "Devolvendo a Mesa",
    "p_fisticuffs": "Lutando",
    "p_love": "Amor",
    "p_disapproval": "Desaprovação",
    "p_tripping": "Viajando",
    "p_sensual": "Sensual",
    "p_peek": "Espiando",
    "p_blush": "Corado",
    "p_bird": "Dedo do Meio",
    "p_bear": "Urso",
    "p_sword": "Espada",
    "p_bill": "Nota de Dólar",
    "p_wick": "John Wick",
    "p_straya": "Austrália",
    "p_thumbs_up": "Joinha",
    "see1": "Seletor de Kaomojis",
    "see2": "Seletor de Emojis",
    "see3": "Símbolos Especiais",
    "see4": "Letras Diferentes"
  },
  "en": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Copy & Paste • 98,000+ Custom Combinations",
    "title": "Lenny Face Generator",
    "meta": "The iconic Lenny Face ( ͡° ͜ʖ ͡°) meme — copy 20 classics or build your own from 98,000+ combinations. Free, works on WhatsApp, Discord, Reddit and games.",
    "d1": "The Lenny Face ( ͡° ͜ʖ ͡°) is one of the most iconic text memes on the internet. With this free online generator, you can build your own version by combining dozens of eye, mouth, and body styles — over 98,000 possible combinations in total — randomize them with a single click, or choose from 20 classic presets like Flex, Magic, and Table Flip. Beyond the generator, the page also works as a Lenny Face collection for quick copy and paste into WhatsApp, Discord, Reddit, TikTok, games, or any text field.",
    "label_eyes": "Eyes",
    "label_mouth": "Mouth",
    "label_arms": "Body",
    "copy_btn": "Copy",
    "random_btn": "Random",
    "copy_aria": "Copy",
    "copied": "Copied!",
    "copied_announce": "Lenny Face copied to clipboard",
    "presets_label": "Classics",
    "features_title": "Lenny Face Generator Features",
    "f_1": "Click on any face to copy it instantly.",
    "f_2": "Combine eyes, mouth, and body styles to create your own custom version.",
    "f_3": "The Random button shuffles a brand new combination with one click.",
    "f_4": "20 classic presets ready to use, including Flex, Magic, and Table Flip.",
    "how_it_works_title": "How to Use",
    "hiw_1_title": "Choose the parts",
    "hiw_1_desc": "Select eyes, mouth, and body from the grids. The preview updates instantly.",
    "hiw_2_title": "Copy it",
    "hiw_2_desc": "Click the Copy button or click directly on the preview to copy the face to your clipboard.",
    "hiw_3_title": "Paste anywhere",
    "hiw_3_desc": "Paste your Lenny Face into WhatsApp, Discord, Reddit, Twitter, or any other text field.",
    "faq_title": "Questions and Answers",
    "faq_1_q": "What is a Lenny Face?",
    "faq_1_a": "The Lenny Face ( ͡° ͜ʖ ͡°) is one of the most iconic text faces on the internet. Created using special Unicode characters, it originated on online forums like 4chan around 2012 and quickly became a globally recognized meme. Today, it is widely used across social media, chats, and games to convey irony, humor, sarcasm, or suggestive double entendres.",
    "faq_2_q": "Does Lenny Face work on WhatsApp, Discord, and social media?",
    "faq_2_a": "Yes. Lenny Faces are made of standard Unicode characters and work on the vast majority of platforms, including WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok, and most online games. In some cases, combinations with very rare characters might render slightly differently depending on the font or operating system of the recipient.",
    "faq_3_q": "Can I use Lenny Faces in game nicknames?",
    "faq_3_a": "It depends on the game. Platforms like Steam, Discord, and most PC games support Unicode characters without issues. Mobile games and consoles tend to be more restrictive—some block special characters to prevent offensive names or exploits. We recommend testing your Lenny Face in the nickname field before saving, as combining characters may get truncated or rejected depending on the system.",
    "faq_4_q": "What does the Lenny Face mean?",
    "faq_4_a": "The Lenny Face is an internet meme that typically conveys a suggestive or knowing look — irony, sarcasm, humor, or a double entendre. Because of its smug, slightly unsettling expression, it became the go-to reaction face for hinting at something without saying it directly. It is one of the most recognized text memes on the internet.",
    "faq_5_q": "How do I type the Lenny Face on a keyboard?",
    "faq_5_a": "The Lenny Face uses special Unicode combining characters that cannot be typed directly from a standard keyboard. The easiest way is to copy it from this page — click any classic preset or use the generator to build your own, then paste it wherever you need it. Some platforms also have browser extensions or keyboard shortcuts that insert it automatically.",
    "faq_6_q": "How many Lenny Face combinations are there?",
    "faq_6_a": "With this generator you can create over 98,000 unique combinations — 65 eye styles × 37 mouth styles × 41 body styles. Each combination produces a different Lenny Face, from the classic ( ͡° ͜ʖ ͡°) to bear versions, sword holders, magic casters, and many more.",
    "p_classic": "Classic",
    "p_flex": "Flex",
    "p_shrug": "Shrug",
    "p_magic": "Magic",
    "p_table_flip": "Table Flip",
    "p_unflip": "Unflip Table",
    "p_fisticuffs": "Fisticuffs",
    "p_love": "Love",
    "p_disapproval": "Disapproval",
    "p_tripping": "Tripping",
    "p_sensual": "Sensual",
    "p_peek": "Peeking",
    "p_blush": "Blushing",
    "p_bird": "Middle Finger",
    "p_bear": "Bear",
    "p_sword": "Sword",
    "p_bill": "Money Bill",
    "p_wick": "John Wick",
    "p_straya": "Straya",
    "p_thumbs_up": "Thumbs Up",
    "see1": "Kaomoji Picker",
    "see2": "Emoji Picker",
    "see3": "Special Symbols",
    "see4": "Fancy Letters"
  },
  "es": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Copiar y Pegar • 98.000+ Combinaciones Personalizadas",
    "title": "Generador de Lenny Face",
    "meta": "El meme Lenny Face ( ͡° ͜ʖ ͡°) — copia 20 clásicos o crea el tuyo con más de 98.000 combinaciones. Gratis, funciona en WhatsApp, Discord, Reddit y juegos.",
    "d1": "El Lenny Face ( ͡° ͜ʖ ͡°) es uno de los memes de texto más icónicos de internet. Con este generador online y gratuito, puedes crear tu propia versión combinando decenas de estilos de ojos, bocas y cuerpos — más de 98.000 combinaciones posibles en total — generar combinaciones aleatorias con un solo clic o elegir uno de los 20 clásicos listos, como Musculoso, Magia y Volteando la Mesa. Además del generador, la página también funciona como colección de Lenny Faces para copiar y pegar en WhatsApp, Discord, Reddit, TikTok, juegos y cualquier campo de texto.",
    "label_eyes": "Ojos",
    "label_mouth": "Boca",
    "label_arms": "Cuerpo",
    "copy_btn": "Copiar",
    "random_btn": "Aleatorio",
    "copy_aria": "Copiar",
    "copied": "¡Copiado!",
    "copied_announce": "Lenny Face copiado al portapapeles",
    "presets_label": "Clásicos",
    "features_title": "Características del Generador de Lenny Face",
    "f_1": "Haz clic en cualquier carita para copiarla instantáneamente.",
    "f_2": "Combina estilos de ojos, boca y cuerpo para crear tu propia versión personalizada.",
    "f_3": "El botón Aleatorio genera una combinación nueva con un solo clic.",
    "f_4": "20 clásicos listos para usar, incluyendo Musculoso, Magia y Volteando la Mesa.",
    "how_it_works_title": "Cómo usar",
    "hiw_1_title": "Elige las partes",
    "hiw_1_desc": "Selecciona los ojos, la boca y el cuerpo en las cuadrículas. La vista previa se actualiza al instante.",
    "hiw_2_title": "Copia",
    "hiw_2_desc": "Haz clic en el botón Copiar o directamente en la vista previa para copiar la carita a tu portapapeles.",
    "hiw_3_title": "Pega en cualquier lugar",
    "hiw_3_desc": "Pega tu Lenny Face en WhatsApp, Discord, Reddit, Twitter o cualquier otro campo de texto.",
    "faq_title": "Preguntas y Respuestas",
    "faq_1_q": "¿Qué es un Lenny Face?",
    "faq_1_a": "El Lenny Face ( ͡° ͜ʖ ͡°) es una de las caritas de texto más icónicas de internet. Creado con caracteres Unicode especiales, surgió en foros online como 4chan alrededor de 2012 y rápidamente se convirtió en un meme mundialmente conocido. Hoy en día se usa ampliamente en redes sociales, chats y juegos para expresar ironía, humor, sarcasmo o dobles sentidos.",
    "faq_2_q": "¿El Lenny Face funciona en WhatsApp, Discord y redes sociales?",
    "faq_2_a": "Sí. Los Lenny Faces están compuestos por caracteres Unicode estándar y funcionan en la gran mayoría de las plataformas: WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok y la mayoría de los juegos online. En algunos casos, las combinaciones con caracteres muy raros pueden verse ligeramente diferentes según la fuente o el sistema operativo del destinatario.",
    "faq_3_q": "¿Puedo usar Lenny Faces en nicknames de juegos?",
    "faq_3_a": "Depende del juego. Plataformas como Steam, Discord y la mayoría de los juegos de PC aceptan caracteres Unicode sin problemas. Los juegos móviles y de consolas suelen ser más restrictivos; algunos bloquean caracteres especiales para evitar nombres ofensivos o exploits. Recomendamos probar el Lenny Face en el campo de nickname antes de guardarlo, ya que los caracteres combinados pueden truncarse o rechazarse según el sistema.",
    "faq_4_q": "¿Qué significa el Lenny Face?",
    "faq_4_a": "El Lenny Face es un meme de internet que generalmente transmite una mirada sugerente o cómplice — ironía, sarcasmo, humor o dobles sentidos. Gracias a su expresión satisfecha y ligeramente perturbadora, se convirtió en la carita de reacción por defecto para insinuar algo sin decirlo directamente. Es uno de los memes de texto más reconocidos de internet.",
    "faq_5_q": "¿Cómo escribir el Lenny Face en el teclado?",
    "faq_5_a": "El Lenny Face usa caracteres Unicode combinantes especiales que no se pueden escribir directamente desde un teclado estándar. La forma más fácil es copiarlo desde esta página — haz clic en cualquier clásico o usa el generador para crear el tuyo, y luego pégalo donde lo necesites. Algunas plataformas también tienen extensiones de navegador o atajos que lo insertan automáticamente.",
    "faq_6_q": "¿Cuántas combinaciones de Lenny Face existen?",
    "faq_6_a": "Con este generador puedes crear más de 98.000 combinaciones únicas — 65 estilos de ojos × 37 estilos de boca × 41 estilos de cuerpo. Cada combinación produce un Lenny Face diferente, desde el clásico ( ͡° ͜ʖ ͡°) hasta versiones de oso, espada, magia y mucho más.",
    "p_classic": "Clásico",
    "p_flex": "Musculoso",
    "p_shrug": "Encogiéndose de Hombros",
    "p_magic": "Magia",
    "p_table_flip": "Volteando la Mesa",
    "p_unflip": "Devolviendo la Mesa",
    "p_fisticuffs": "Luchando",
    "p_love": "Amor",
    "p_disapproval": "Desaprobación",
    "p_tripping": "Viajando",
    "p_sensual": "Sensual",
    "p_peek": "Espiando",
    "p_blush": "Sonrojado",
    "p_bird": "Dedo del Medio",
    "p_bear": "Oso",
    "p_sword": "Espada",
    "p_bill": "Billete de Dólar",
    "p_wick": "John Wick",
    "p_straya": "Australia",
    "p_thumbs_up": "Pulgar Arriba",
    "see1": "Selector de Kaomoji",
    "see2": "Selector de Emoji",
    "see3": "Símbolos Especiales",
    "see4": "Letras Bonitas"
  },
  "fr": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Copier et Coller • 98 000+ Combinaisons Personnalisées",
    "title": "Générateur de Lenny Face",
    "meta": "Le mème Lenny Face ( ͡° ͜ʖ ͡°) — copiez 20 classiques ou créez le vôtre parmi plus de 98 000 combinaisons. Gratuit, fonctionne sur WhatsApp, Discord, Reddit et les jeux.",
    "d1": "Le Lenny Face ( ͡° ͜ʖ ͡°) est l'un des mèmes textuels les plus emblématiques d'Internet. Avec ce générateur en ligne gratuit, créez votre propre version en combinant des dizaines de styles d'yeux, de bouches et de corps — plus de 98 000 combinaisons possibles au total — générez des combinaisons aléatoires en un clic ou choisissez l'un des 20 classiques prêts à l'emploi, comme Musclé, Magie et Renverser la Table. Au-delà du générateur, la page fonctionne aussi comme une collection de Lenny Faces à copier et coller directement dans WhatsApp, Discord, Reddit, TikTok, les jeux et tout champ de texte.",
    "label_eyes": "Yeux",
    "label_mouth": "Bouche",
    "label_arms": "Corps",
    "copy_btn": "Copier",
    "random_btn": "Aléatoire",
    "copy_aria": "Copier",
    "copied": "Copié !",
    "copied_announce": "Lenny Face copié dans le presse-papiers",
    "presets_label": "Classiques",
    "features_title": "Fonctionnalités du Générateur de Lenny Face",
    "f_1": "Cliquez sur n'importe quelle émoticône pour la copier instantanément.",
    "f_2": "Combinez les styles d'yeux, de bouche et de corps pour créer votre propre version personnalisée.",
    "f_3": "Le bouton Aléatoire génère une nouvelle combinaison en un seul clic.",
    "f_4": "20 classiques prêts à l'emploi, dont Musclé, Magie et Renverser la Table.",
    "how_it_works_title": "Comment ça marche",
    "hiw_1_title": "Choisissez les éléments",
    "hiw_1_desc": "Sélectionnez les yeux, la bouche et le corps dans les grilles. L'aperçu se met à jour instantanément.",
    "hiw_2_title": "Copiez",
    "hiw_2_desc": "Cliquez sur le bouton Copier ou directement sur l'aperçu pour copier l'émoticône dans votre presse-papiers.",
    "hiw_3_title": "Collez n'importe où",
    "hiw_3_desc": "Collez votre Lenny Face dans WhatsApp, Discord, Reddit, Twitter ou tout autre champ de texte.",
    "faq_title": "Questions et Réponses",
    "faq_1_q": "Qu'est-ce qu'un Lenny Face ?",
    "faq_1_a": "Le Lenny Face ( ͡° ͜ʖ ͡°) est l'un des smileys textuels les plus célèbres d'Internet. Conçu avec des caractères Unicode spéciaux, il est apparu sur des forums en ligne comme 4chan vers 2012 et est rapidement devenu un mème mondialement connu. Aujourd'hui, il est largement utilisé sur les réseaux sociaux, les chats et les jeux pour exprimer l'ironie, l'humour, le sarcasme ou le sous-entendu.",
    "faq_2_q": "Le Lenny Face fonctionne-t-il sur WhatsApp, Discord et les réseaux sociaux ?",
    "faq_2_a": "Oui. Les Lenny Faces sont composés de caractères Unicode standards et fonctionnent sur la grande majorité des plateformes : WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok et la plupart des jeux en ligne. Dans certains cas, les combinaisons avec des caractères très rares peuvent s'afficher légèrement différemment selon la police ou le système d'exploitation du destinataire.",
    "faq_3_q": "Puis-je utiliser un Lenny Face comme pseudonyme de jeu ?",
    "faq_3_a": "Cela dépend du jeu. Les plateformes comme Steam, Discord et la plupart des jeux PC acceptent les caractères Unicode sans problème. Les jeux mobiles et sur console ont tendance à être plus restrictifs — certains bloquent les caractères spéciaux pour éviter les pseudonymes offensants ou les bugs. Nous vous conseillons de tester le Lenny Face dans le champ de pseudonyme avant de valider, car les caractères combinés peuvent être tronqués ou refusés selon le système.",
    "faq_4_q": "Que signifie le Lenny Face ?",
    "faq_4_a": "Le Lenny Face est un mème internet qui exprime généralement un regard suggestif ou complice — ironie, sarcasme, humour ou sous-entendu. En raison de son expression satisfaite et légèrement troublante, il est devenu la frimousse de réaction par défaut pour insinuer quelque chose sans le dire directement. C'est l'un des mèmes textuels les plus reconnus sur internet.",
    "faq_5_q": "Comment taper le Lenny Face sur un clavier ?",
    "faq_5_a": "Le Lenny Face utilise des caractères Unicode combinants spéciaux qui ne peuvent pas être tapés directement sur un clavier standard. La façon la plus simple est de le copier depuis cette page — cliquez sur un classique ou utilisez le générateur pour créer le vôtre, puis collez-le où vous en avez besoin. Certaines plateformes disposent également d'extensions de navigateur ou de raccourcis qui l'insèrent automatiquement.",
    "faq_6_q": "Combien de combinaisons de Lenny Face existe-t-il ?",
    "faq_6_a": "Avec ce générateur, vous pouvez créer plus de 98 000 combinaisons uniques — 65 styles d'yeux × 37 styles de bouche × 41 styles de corps. Chaque combinaison produit un Lenny Face différent, du classique ( ͡° ͜ʖ ͡°) aux versions ours, épée, magie et bien d'autres.",
    "p_classic": "Classique",
    "p_flex": "Musclé",
    "p_shrug": "Haussement d'Épaules",
    "p_magic": "Magie",
    "p_table_flip": "Renverser la Table",
    "p_unflip": "Remettre la Table",
    "p_fisticuffs": "Combat",
    "p_love": "Amour",
    "p_disapproval": "Désapprobation",
    "p_tripping": "Planant",
    "p_sensual": "Sensuel",
    "p_peek": "Regard Furtif",
    "p_blush": "Rougi",
    "p_bird": "Doigt d'Honneur",
    "p_bear": "Ours",
    "p_sword": "Épée",
    "p_bill": "Billet de Banque",
    "p_wick": "John Wick",
    "p_straya": "Australie",
    "p_thumbs_up": "Pouce en L'air",
    "see1": "Sélecteur de Kaomoji",
    "see2": "Sélecteur d'Emojis",
    "see3": "Symboles Spéciaux",
    "see4": "Lettres Stylées"
  },
  "it": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Copia e Incolla • 98.000+ Combinazioni Personalizzate",
    "title": "Generatore di Lenny Face",
    "meta": "Il meme Lenny Face ( ͡° ͜ʖ ͡°) — copia 20 classici o crea il tuo con oltre 98.000 combinazioni. Gratuito, funziona su WhatsApp, Discord, Reddit e giochi.",
    "d1": "Il Lenny Face ( ͡° ͜ʖ ͡°) è uno dei meme testuali più iconici del web. Con questo generatore online e gratuito, puoi creare la tua versione combinando decine di stili di occhi, bocche e corpi — oltre 98.000 combinazioni possibili in totale — generare combinazioni casuali con un clic o scegliere uno dei 20 classici pronti, come Muscoloso, Magia e Capovolgi il Tavolo. Oltre al generatore, la pagina funziona anche come raccolta di Lenny Face da copiare e incollare direttamente su WhatsApp, Discord, Reddit, TikTok, giochi e qualsiasi campo di testo.",
    "label_eyes": "Occhi",
    "label_mouth": "Bocca",
    "label_arms": "Corpo",
    "copy_btn": "Copia",
    "random_btn": "Casuale",
    "copy_aria": "Copia",
    "copied": "Copiato!",
    "copied_announce": "Lenny Face copiato negli appunti",
    "presets_label": "Classici",
    "features_title": "Caratteristiche del Generatore di Lenny Face",
    "f_1": "Clicca su qualsiasi faccina per copiarla istantaneamente.",
    "f_2": "Combina stili di occhi, bocca e corpo per creare la tua versione personalizzata.",
    "f_3": "Il pulsante Casuale genera una nuova combinazione con un solo clic.",
    "f_4": "20 classici pronti all'uso, tra cui Muscoloso, Magia e Capovolgi il Tavolo.",
    "how_it_works_title": "Come funziona",
    "hiw_1_title": "Scegli le parti",
    "hiw_1_desc": "Seleziona occhi, bocca e corpo nelle griglie. L'anteprima si aggiorna all'istante.",
    "hiw_2_title": "Copia",
    "hiw_2_desc": "Clicca sul pulsante Copia o direttamente sull'anteprima per copiare la faccina negli appunti.",
    "hiw_3_title": "Incolla ovunque",
    "hiw_3_desc": "Incolla il tuo Lenny Face su WhatsApp, Discord, Reddit, Twitter o qualsiasi altro campo di testo.",
    "faq_title": "Domande e Risposte",
    "faq_1_q": "Cos'è un Lenny Face?",
    "faq_1_a": "Il Lenny Face ( ͡° ͜ʖ ͡°) è una delle faccine testuali più famose del web. Creato utilizzando caratteri Unicode speciali, è nato su forum online come 4chan intorno al 2012 ed è diventato rapidamente un meme conosciuto in tutto il mondo. Oggi è ampiamente utilizzato su social network, chat e giochi per esprimere ironia, umorismo, sarcasmo o doppi sensi.",
    "faq_2_q": "Il Lenny Face funziona su WhatsApp, Discord e social network?",
    "faq_2_a": "Sì. I Lenny Face sono composti da caratteri Unicode standard e funzionano sulla stragrande maggioranza delle piattaforme: WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok e la maggior parte dei giochi online. In alcuni casi, combinazioni con caratteri molto rari potrebbero apparire leggermente diverse a seconda del font o del sistema operativo del destinatario.",
    "faq_3_q": "Posso usare i Lenny Face come nickname nei giochi?",
    "faq_3_a": "Dipende dal gioco. Piattaforme come Steam, Discord e la maggior parte dei giochi per PC supportano i caratteri Unicode senza problemi. I giochi per dispositivi mobili e console tendono a essere più restrittivi — alcuni bloccano i caratteri speciali per evitare nomi offensivi o exploit. Consigliamo di testare il Lenny Face nel campo del nickname prima di salvare, poiché i caratteri combinati potrebbero essere troncati o rifiutati a seconda del sistema.",
    "faq_4_q": "Cosa significa il Lenny Face?",
    "faq_4_a": "Il Lenny Face è un meme internet che esprime generalmente uno sguardo allusivo o complice — ironia, sarcasmo, umorismo o doppio senso. Per via della sua espressione soddisfatta e leggermente inquietante, è diventato la faccina di reazione predefinita per accennare a qualcosa senza dirlo direttamente. È uno dei meme testuali più riconosciuti su internet.",
    "faq_5_q": "Come si digita il Lenny Face sulla tastiera?",
    "faq_5_a": "Il Lenny Face utilizza caratteri Unicode combinanti speciali che non possono essere digitati direttamente da una tastiera standard. Il modo più semplice è copiarlo da questa pagina — clicca su un classico o usa il generatore per crearne uno personale, poi incollalo dove serve. Alcune piattaforme hanno anche estensioni del browser o scorciatoie che lo inseriscono automaticamente.",
    "faq_6_q": "Quante combinazioni di Lenny Face esistono?",
    "faq_6_a": "Con questo generatore puoi creare oltre 98.000 combinazioni uniche — 65 stili di occhi × 37 stili di bocca × 41 stili di corpo. Ogni combinazione produce un Lenny Face diverso, dal classico ( ͡° ͜ʖ ͡°) alle versioni orso, spada, magia e molte altre.",
    "p_classic": "Classico",
    "p_flex": "Muscoloso",
    "p_shrug": "Scrollata di Spalle",
    "p_magic": "Magia",
    "p_table_flip": "Capovolgi il Tavolo",
    "p_unflip": "Ripristina il Tavolo",
    "p_fisticuffs": "Lotta",
    "p_love": "Amore",
    "p_disapproval": "Disapprovazione",
    "p_tripping": "Allucinato",
    "p_sensual": "Sensuale",
    "p_peek": "Sbirciatina",
    "p_blush": "Arrossito",
    "p_bird": "Dito Medio",
    "p_bear": "Orso",
    "p_sword": "Spada",
    "p_bill": "Banconota",
    "p_wick": "John Wick",
    "p_straya": "Australia",
    "p_thumbs_up": "Pollice in Su",
    "see1": "Selettore di Kaomoji",
    "see2": "Selettore di Emoji",
    "see3": "Simboli Speciali",
    "see4": "Scritture Particolari"
  },
  "id": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Salin & Tempel • 98.000+ Kombinasi Kustom",
    "title": "Lenny Face Generator",
    "meta": "Meme Lenny Face ( ͡° ͜ʖ ͡°) — salin 20 klasik atau buat milikmu dari 98.000+ kombinasi. Gratis, berfungsi di WhatsApp, Discord, Reddit, dan game.",
    "d1": "Lenny Face ( ͡° ͜ʖ ͡°) adalah salah satu meme teks paling ikonik di internet. Dengan generator online gratis ini, kamu dapat membuat versi sendiri dengan menggabungkan puluhan gaya mata, mulut, dan tubuh — lebih dari 98.000 kombinasi yang mungkin — membuat kombinasi acak dengan sekali klik, atau memilih dari 20 preset klasik siap pakai seperti Pamer Otot, Sihir, dan Membalikkan Meja. Selain sebagai generator, halaman ini juga berfungsi sebagai koleksi Lenny Face untuk salin dan tempel langsung ke WhatsApp, Discord, Reddit, TikTok, game, dan kolom teks apa pun.",
    "label_eyes": "Mata",
    "label_mouth": "Mulut",
    "label_arms": "Tubuh",
    "copy_btn": "Salin",
    "random_btn": "Acak",
    "copy_aria": "Salin",
    "copied": "Tersalin!",
    "copied_announce": "Lenny Face berhasil disalin ke papan klip",
    "presets_label": "Klasik",
    "features_title": "Fitur Lenny Face Generator",
    "f_1": "Klik pada wajah teks mana pun untuk menyalinnya secara instan.",
    "f_2": "Gabungkan mata, mulut, dan tubuh untuk membuat versi kustom Anda sendiri.",
    "f_3": "Tombol Acak mengacak kombinasi baru hanya dengan satu klik.",
    "f_4": "20 preset klasik siap pakai, termasuk Flex, Sihir, dan Membalikkan Meja.",
    "how_it_works_title": "Cara Menggunakan",
    "hiw_1_title": "Pilih Bagian",
    "hiw_1_desc": "Pilih mata, mulut, dan tubuh dari kisi. Pratinjau akan langsung diperbarui.",
    "hiw_2_title": "Salin",
    "hiw_2_desc": "Klik tombol Salin atau klik langsung pada pratinjau untuk menyalin wajah teks ke papan klip Anda.",
    "hiw_3_title": "Tempel di Mana Saja",
    "hiw_3_desc": "Tempel Lenny Face Anda ke WhatsApp, Discord, Reddit, Twitter atau bidang teks lainnya.",
    "faq_title": "Pertanyaan dan Jawaban",
    "faq_1_q": "Apa itu Lenny Face?",
    "faq_1_a": "Lenny Face ( ͡° ͜ʖ ͡°) adalah salah satu wajah teks paling ikonik di internet. Dibuat menggunakan karakter Unicode khusus, ia pertama kali muncul di forum online seperti 4chan sekitar tahun 2012 dan dengan cepat menjadi meme terkenal di seluruh dunia. Saat ini, ia banyak digunakan di media sosial, obrolan, dan game untuk mengekspresikan ironi, humor, sarkasme, atau makna terselubung.",
    "faq_2_q": "Apakah Lenny Face berfungsi di WhatsApp, Discord, dan media sosial?",
    "faq_2_a": "Ya. Lenny Face terbuat dari karakter Unicode standar dan berfungsi di sebagian besar platform: WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok, dan sebagian besar game online. Dalam beberapa kasus, kombinasi dengan karakter yang sangat langka mungkin terlihat sedikit berbeda tergantung pada font atau sistem operasi penerima.",
    "faq_3_q": "Apakah saya bisa menggunakan Lenny Face untuk nama panggilan (nickname) game?",
    "faq_3_a": "Tergantung game-nya. Platform seperti Steam, Discord, dan sebagian besar game PC mendukung karakter Unicode tanpa masalah. Game seluler dan konsol cenderung lebih ketat — beberapa memblokir karakter khusus untuk mencegah nama ofensif atau eksploitasi sistem. Kami menyarankan untuk menguji Lenny Face di kolom nama panggilan sebelum menyimpan, karena karakter gabungan mungkin terpotong atau ditolak tergantung sistem.",
    "faq_4_q": "Apa arti Lenny Face?",
    "faq_4_a": "Lenny Face adalah meme internet yang biasanya menyampaikan tatapan sugestif atau tahu — ironi, sarkasme, humor, atau makna ganda. Karena ekspresinya yang puas dan sedikit aneh, ia menjadi wajah reaksi standar untuk menyiratkan sesuatu tanpa mengatakannya secara langsung. Ini adalah salah satu meme teks paling dikenal di internet.",
    "faq_5_q": "Bagaimana cara mengetik Lenny Face di keyboard?",
    "faq_5_a": "Lenny Face menggunakan karakter Unicode khusus yang tidak bisa diketik langsung dari keyboard standar. Cara paling mudah adalah menyalinnya dari halaman ini — klik salah satu klasik atau gunakan generator untuk membuat milikmu, lalu tempel di mana pun kamu membutuhkannya. Beberapa platform juga memiliki ekstensi browser atau pintasan keyboard yang menyisipkannya secara otomatis.",
    "faq_6_q": "Berapa banyak kombinasi Lenny Face yang tersedia?",
    "faq_6_a": "Dengan generator ini kamu dapat membuat lebih dari 98.000 kombinasi unik — 65 gaya mata × 37 gaya mulut × 41 gaya tubuh. Setiap kombinasi menghasilkan Lenny Face yang berbeda, mulai dari yang klasik ( ͡° ͜ʖ ͡°) hingga versi beruang, pedang, sihir, dan masih banyak lagi.",
    "p_classic": "Klasik",
    "p_flex": "Pamer Otot",
    "p_shrug": "Mengangkat Bahu",
    "p_magic": "Sihir",
    "p_table_flip": "Membalikkan Meja",
    "p_unflip": "Mengembalikan Meja",
    "p_fisticuffs": "Bertarung",
    "p_love": "Cinta",
    "p_disapproval": "Kecewa",
    "p_tripping": "Melayang",
    "p_sensual": "Sensual",
    "p_peek": "Mengintip",
    "p_blush": "Malu-malu",
    "p_bird": "Jari Tengah",
    "p_bear": "Beruang",
    "p_sword": "Pedang",
    "p_bill": "Uang Kertas",
    "p_wick": "John Wick",
    "p_straya": "Australia",
    "p_thumbs_up": "Jempol",
    "see1": "Pemilih Kaomoji",
    "see2": "Pemilih Emoji",
    "see3": "Simbol Spesial",
    "see4": "Tulisan Unik"
  },
  "de": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Kopieren & Einfügen • 98.000+ individuelle Kombinationen",
    "title": "Lenny Face Generator",
    "meta": "Das Lenny Face ( ͡° ͜ʖ ͡°) Meme — kopiere 20 Klassiker oder erstelle dein eigenes aus über 98.000 Kombinationen. Kostenlos, funktioniert auf WhatsApp, Discord, Reddit und in Spielen.",
    "d1": "Das Lenny Face ( ͡° ͜ʖ ͡°) ist eines der kultigsten Text-Memes im Internet. Mit diesem kostenlosen Online-Generator kannst du deine eigene Version erstellen, indem du Dutzende von Augen-, Mund- und Körperstilen kombinierst — insgesamt über 98.000 mögliche Kombinationen — mit einem Klick Zufallskombinationen erstellst oder aus 20 klassischen Vorlagen auswählst, wie Muskeln, Magie und Tisch umwerfen. Über den Generator hinaus dient die Seite auch als Lenny Face-Sammlung zum schnellen Kopieren und Einfügen in WhatsApp, Discord, Reddit, TikTok, Spiele oder jedes Textfeld.",
    "label_eyes": "Augen",
    "label_mouth": "Mund",
    "label_arms": "Körper",
    "copy_btn": "Kopieren",
    "random_btn": "Zufall",
    "copy_aria": "Kopieren",
    "copied": "Kopiert!",
    "copied_announce": "Lenny Face in die Zwischenablage kopiert",
    "presets_label": "Klassiker",
    "features_title": "Lenny Face Generator Funktionen",
    "f_1": "Klicke auf ein beliebiges Textgesicht, um es sofort zu kopieren.",
    "f_2": "Kombiniere Augen-, Mund- und Körperstile, um deine eigene personalisierte Version zu erstellen.",
    "f_3": "Der Zufall-Button mischt mit einem Klick eine völlig neue Kombination zusammen.",
    "f_4": "20 klassische Vorlagen einsatzbereit, darunter Muskeln, Magie und Tisch umwerfen.",
    "how_it_works_title": "So funktioniert's",
    "hiw_1_title": "Teile auswählen",
    "hiw_1_desc": "Wähle Augen, Mund und Körper aus den Rastern. Die Vorschau aktualisiert sich sofort.",
    "hiw_2_title": "Kopieren",
    "hiw_2_desc": "Klicke auf den Kopieren-Button oder direkt auf die Vorschau, um das Gesicht in deine Zwischenablage zu kopieren.",
    "hiw_3_title": "Überall einfügen",
    "hiw_3_desc": "Füge dein Lenny Face in WhatsApp, Discord, Reddit, Twitter oder jedes andere Textfeld ein.",
    "faq_title": "Fragen und Antworten",
    "faq_1_q": "Was ist ein Lenny Face?",
    "faq_1_a": "Das Lenny Face ( ͡° ͜ʖ ͡°) ist eines der bekanntesten Textgesichter im Internet. Es wurde aus speziellen Unicode-Zeichen erstellt, entstand um 2012 in Online-Foren wie 4chan und wurde schnell zu einem weltweit bekannten Meme. Heute wird es in sozialen Netzwerken, Chats und Spielen verwendet, um Ironie, Humor, Sarkasmus oder zweideutige Anspielungen auszudrücken.",
    "faq_2_q": "Funktioniert das Lenny Face auf WhatsApp, Discord und in sozialen Netzwerken?",
    "faq_2_a": "Ja. Lenny Faces bestehen aus Standard-Unicode-Zeichen und funktionieren auf den allermeisten Plattformen: WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok und den meisten Online-Spielen. In einigen Fällen können Kombinationen mit sehr seltenen Zeichen je nach Schriftart oder Betriebssystem des Empfängers leicht unterschiedlich aussehen.",
    "faq_3_q": "Kann ich Lenny Faces in Nicknames von Spielen verwenden?",
    "faq_3_a": "Das hängt vom Spiel ab. Plattformen wie Steam, Discord und die meisten PC-Spiele unterstützen Unicode-Zeichen problemlos. Mobile Games und Konsolen sind oft restriktiver — einige blockieren Sonderzeichen, um anstößige Namen oder Systemfehler zu vermeiden. Wir empfehlen, das Lenny Face vor dem Speichern im Nickname-Feld zu testen, da kombinierte Zeichen je nach System abgeschnitten oder abgelehnt werden können.",
    "faq_4_q": "Was bedeutet das Lenny Face?",
    "faq_4_a": "Das Lenny Face ist ein Internet-Meme, das in der Regel einen wissenden oder anzüglichen Blick ausdrückt — Ironie, Sarkasmus, Humor oder Doppeldeutigkeit. Wegen seines selbstgefälligen und leicht unheimlichen Ausdrucks wurde es zur Standard-Reaktionsfigur, wenn man etwas andeuten will, ohne es direkt auszusprechen. Es ist eines der bekanntesten Text-Memes im Internet.",
    "faq_5_q": "Wie tippt man das Lenny Face auf der Tastatur?",
    "faq_5_a": "Das Lenny Face verwendet spezielle kombinierte Unicode-Zeichen, die nicht direkt über eine Standard-Tastatur eingegeben werden können. Am einfachsten kopierst du es von dieser Seite — klicke auf einen Klassiker oder nutze den Generator, um dein eigenes zu erstellen, und füge es dann ein, wo du es brauchst. Einige Plattformen bieten auch Browser-Erweiterungen oder Tastenkürzel, die es automatisch einfügen.",
    "faq_6_q": "Wie viele Lenny Face-Kombinationen gibt es?",
    "faq_6_a": "Mit diesem Generator kannst du über 98.000 einzigartige Kombinationen erstellen — 65 Augenstile × 37 Mundstile × 41 Körperstile. Jede Kombination ergibt ein anderes Lenny Face, vom klassischen ( ͡° ͜ʖ ͡°) bis hin zu Bären-, Schwert-, Magie-Versionen und vielen mehr.",
    "p_classic": "Klassisch",
    "p_flex": "Muskeln",
    "p_shrug": "Achselzucken",
    "p_magic": "Magie",
    "p_table_flip": "Tisch umwerfen",
    "p_unflip": "Tisch hinstellen",
    "p_fisticuffs": "Kampf",
    "p_love": "Liebe",
    "p_disapproval": "Enttäuscht",
    "p_tripping": "Auf Trip",
    "p_sensual": "Sinnlich",
    "p_peek": "Spähen",
    "p_blush": "Erröten",
    "p_bird": "Mittelfinger",
    "p_bear": "Bär",
    "p_sword": "Schwert",
    "p_bill": "Geldschein",
    "p_wick": "John Wick",
    "p_straya": "Australien",
    "p_thumbs_up": "Daumen hoch",
    "see1": "Kaomoji-Auswahl",
    "see2": "Emoji-Auswahl",
    "see3": "Sonderzeichen",
    "see4": "Coole Schriften"
  },
  "nl": {
    "m_title": "( ͡° ͜ʖ ͡°) Lenny Face — Kopiëren & Plakken • 98.000+ Aangepaste Combinaties",
    "title": "Lenny Face Generator",
    "meta": "Het Lenny Face ( ͡° ͜ʖ ͡°) meme — kopieer 20 klassiekers of maak je eigen versie uit meer dan 98.000 combinaties. Gratis, werkt op WhatsApp, Discord, Reddit en games.",
    "d1": "De Lenny Face ( ͡° ͜ʖ ͡°) is een van de meest iconische tekstmemes op internet. Met deze gratis online generator kun je je eigen versie maken door tientallen stijlen van ogen, monden en lichamen te combineren — in totaal meer dan 98.000 mogelijke combinaties — met één klik willekeurige combinaties te genereren, of te kiezen uit 20 klassieke presets zoals Spierballen, Magie en Tafel Omdraaien. Naast de generator werkt de pagina ook als een Lenny Face-collectie om snel te kopiëren en te plakken in WhatsApp, Discord, Reddit, TikTok, games of elk tekstveld.",
    "label_eyes": "Ogen",
    "label_mouth": "Mond",
    "label_arms": "Lichaam",
    "copy_btn": "Kopiëren",
    "random_btn": "Willekeurig",
    "copy_aria": "Kopiëren",
    "copied": "Gekopieerd!",
    "copied_announce": "Lenny Face gekopieerd naar klembord",
    "presets_label": "Klassiekers",
    "features_title": "Lenny Face Generator Kenmerken",
    "f_1": "Klik op een tekstgezicht om het direct te kopiëren.",
    "f_2": "Combineer stijlen van ogen, mond en lichaam om je eigen aangepaste versie te maken.",
    "f_3": "De Willekeurig-knop maakt met één klik een gloednieuwe combinatie.",
    "f_4": "20 klassieke presets klaar voor gebruik, waaronder Spierballen, Magie en Tafel Omdraaien.",
    "how_it_works_title": "Hoe het werkt",
    "hiw_1_title": "Kies de onderdelen",
    "hiw_1_desc": "Selecteer ogen, mond en lichaam uit de roosters. Het voorbeeld wordt direct bijgewerkt.",
    "hiw_2_title": "Kopieer",
    "hiw_2_desc": "Klik op de Kopiëren-knop of klik direct op het voorbeeld om de emoticon naar je klembord te kopiëren.",
    "hiw_3_title": "Plak overal",
    "hiw_3_desc": "Plak je Lenny Face in WhatsApp, Discord, Reddit, Twitter of elk ander tekstveld.",
    "faq_title": "Vragen en Antwoorden",
    "faq_1_q": "Wat is een Lenny Face?",
    "faq_1_a": "De Lenny Face ( ͡° ͜ʖ ͡°) is een van de meest iconische tekstgezichten op het internet. Gemaakt met speciale Unicode-tekens, ontstond het rond 2012 op online forums zoals 4chan en werd het al snel een wereldwijd bekende meme. Tegenwoordig wordt het veel gebruikt op sociale media, chats en games om ironie, humor, sarcasme of dubbelzinnige toespelingen uit te drukken.",
    "faq_2_q": "Werkt Lenny Face op WhatsApp, Discord en sociale media?",
    "faq_2_a": "Ja. Lenny Faces bestaan uit standaard Unicode-tekens en werken op de overgrote meerderheid van de platforms: WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok en de meeste online games. In sommige gevallen kunnen combinaties met zeer zeldzame tekens er iets anders uitzien, afhankelijk van het lettertype of het besturingssysteem van de ontvanger.",
    "faq_3_q": "Kan ik Lenny Faces gebruiken in nicknames van games?",
    "faq_3_a": "Dat hangt af van het spel. Platforms zoals Steam, Discord en de meeste pc-games ondersteunen Unicode-tekens zonder problemen. Mobiele games en consoles zijn vaak restrictiever — sommige blokkeren speciale tekens om aanstootgevende namen of exploits te voorkomen. We raden aan om de Lenny Face in het nickname-veld te testen voordat je opslaat, omdat gecombineerde tekens afhankelijk van het systeem kunnen worden afgekapt of geweigerd.",
    "faq_4_q": "Wat betekent de Lenny Face?",
    "faq_4_a": "De Lenny Face is een internetmeme die doorgaans een suggestieve of wetende blik uitdrukt — ironie, sarcasme, humor of dubbelzinnigheid. Door zijn zelfvoldane en licht verontrustende uitdrukking werd het het standaard reactiegezichtje om iets te suggereren zonder het direct te zeggen. Het is een van de meest herkenbare tekstmemes op het internet.",
    "faq_5_q": "Hoe typ je de Lenny Face op een toetsenbord?",
    "faq_5_a": "De Lenny Face gebruikt speciale combinerende Unicode-tekens die niet direct via een standaardtoetsenbord kunnen worden ingevoerd. De eenvoudigste manier is om hem van deze pagina te kopiëren — klik op een klassieke versie of gebruik de generator om je eigen versie te maken, en plak hem vervolgens waar je hem nodig hebt. Sommige platforms hebben ook browserextensies of sneltoetsen die hem automatisch invoegen.",
    "faq_6_q": "Hoeveel Lenny Face-combinaties zijn er?",
    "faq_6_a": "Met deze generator kun je meer dan 98.000 unieke combinaties maken — 65 oogstijlen × 37 mondstijlen × 41 lichaamsstijlen. Elke combinatie levert een andere Lenny Face op, van de klassieke ( ͡° ͜ʖ ͡°) tot beer-, zwaard-, magie-versies en veel meer.",
    "p_classic": "Klassiek",
    "p_flex": "Spierballen",
    "p_shrug": "Schouderophalen",
    "p_magic": "Magie",
    "p_table_flip": "Tafel Omdraaien",
    "p_unflip": "Tafel Terugzetten",
    "p_fisticuffs": "Vechten",
    "p_love": "Liefde",
    "p_disapproval": "Afkeuring",
    "p_tripping": "Trippen",
    "p_sensual": "Sensueel",
    "p_peek": "Gluren",
    "p_blush": "Blozen",
    "p_bird": "Middelvinger",
    "p_bear": "Beer",
    "p_sword": "Zwaard",
    "p_bill": "Bankbiljet",
    "p_wick": "John Wick",
    "p_straya": "Australië",
    "p_thumbs_up": "Duim omhoog",
    "see1": "Kaomoji Kiezer",
    "see2": "Emoji Kiezer",
    "see3": "Speciale Symbolen",
    "see4": "Sierlijke Letters"
  },
  "ru": {
    "m_title": "( ͡° ͜ʖ ͡°) Ленни Фейс — Копировать и Вставить • 98 000+ Уникальных Комбинаций",
    "title": "Генератор Ленни Фейсов",
    "meta": "Легендарный мем Ленни Фейс ( ͡° ͜ʖ ͡°) — скопируйте 20 готовых классических вариантов или создайте свой собственный из более чем 98 000 комбинаций глаз, рта и тела. Бесплатно, работает в WhatsApp, Discord, Reddit и играх.",
    "d1": "Ленни Фейс ( ͡° ͜ʖ ͡°) — один из самых знаковых текстовых мемов в Интернете. С помощью этого бесплатного онлайн-генератора вы можете создать свою собственную версию, комбинируя десятки стилей глаз, рот и тела — всего более 98 000 возможных сочетаний. Создавайте случайные комбинации в один клик или выбирайте готовые варианты из 20 классических пресетов, таких как «Качок», «Магия» и «Переворачивание стола». Помимо генератора, страница служит коллекцией Ленни Фейсов для быстрого копирования и вставки в WhatsApp, Discord, Reddit, TikTok, игры или любое текстовое поле.",
    "label_eyes": "Глаза",
    "label_mouth": "Рот",
    "label_arms": "Тело",
    "copy_btn": "Копировать",
    "random_btn": "Случайно",
    "copy_aria": "Скопировать",
    "copied": "Скопировано!",
    "copied_announce": "Ленни Фейс скопирован в буфер обмена",
    "presets_label": "Классика",
    "features_title": "Возможности генератора Ленни Фейсов",
    "f_1": "Кликните на любое текстовое лицо, чтобы мгновенно скопировать его.",
    "f_2": "Комбинируйте стили глаз, рта и тела для создания собственной уникальной версии.",
    "f_3": "Кнопка «Случайно» генерирует совершенно новую комбинацию в один клик.",
    "f_4": "20 готовых классических пресетов, включая «Качок», «Магия» и «Переворачивание стола».",
    "how_it_works_title": "Как пользоваться",
    "hiw_1_title": "Выберите элементы",
    "hiw_1_desc": "Выберите глаза, рот и тело в таблицах. Предварительный просмотр обновится мгновенно.",
    "hiw_2_title": "Скопируйте",
    "hiw_2_desc": "Нажмите кнопку «Копировать» или кликните прямо на область предпросмотра, чтобы скопировать лицо в буфер обмена.",
    "hiw_3_title": "Вставьте куда угодно",
    "hiw_3_desc": "Вставьте Ленни Фейс в WhatsApp, Discord, Reddit, Twitter или любое другое текстовое поле.",
    "faq_title": "Вопросы и ответы",
    "faq_1_q": "Что такое Ленни Фейс?",
    "faq_1_a": "Ленни Фейс ( ͡° ͜ʖ ͡°) — одно из самых известных текстовых лиц в Интернете. Созданное с использованием специальных символов Unicode, оно появилось на онлайн-форумах, таких как 4chan, примерно в 2012 году и быстро стало всемирно известным мемом. Сегодня оно широко используется в социальных сетях, чатах и играх для выражения иронии, юмора, сарказма или двусмысленного подтекста.",
    "faq_2_q": "Работает ли Ленни Фейс в WhatsApp, Discord и социальных сетях?",
    "faq_2_a": "Да. Ленни Фейсы состоят из стандартных символов Unicode и работают на подавляющем большинстве платформ: WhatsApp, Telegram, Discord, Reddit, Twitter/X, Instagram, TikTok и в большинстве онлайн-игр. В некоторых случаях комбинации с очень редкими символами могут отображаться немного по-разному в зависимости от шрифта или операционной системы получателя.",
    "faq_3_q": "Могу ли я использовать Ленни Фейсы в игровых никнеймах?",
    "faq_3_a": "Это зависит от игры. Платформы, такие как Steam, Discord и большинство ПК-игр, поддерживают символы Unicode без проблем. Мобильные игры и консоли, как правило, более ограничены — некоторые блокируют специальные символы для предотвращения оскорбительных имен или системных ошибок. Мы рекомендуем протестировать Ленни Фейс в поле никнейма перед сохранением, так как комбинированные символы могут быть усечены или отклонены системой.",
    "faq_4_q": "Что означает Ленни Фейс?",
    "faq_4_a": "Ленни Фейс — это интернет-мем, который обычно выражает многозначительный или понимающий взгляд — иронию, сарказм, юмор или двойной смысл. Из-за своего самодовольного и слегка интригующего выражения оно стало стандартным смайликом реакции, когда хочется на что-то намекнуть, не говоря об этом напрямую. Это один из самых узнаваемых текстовых мемов в Интернете.",
    "faq_5_q": "Как напечатать Ленни Фейс на клавиатуре?",
    "faq_5_a": "В Ленни Фейсе используются специальные комбинируемые символы Unicode, которые нельзя ввести напрямую с обычной клавиатуры. Проще всего скопировать его с этой страницы — кликните на любой классический пресет или воспользуйтесь генератором, чтобы создать свой собственный, а затем вставьте его в нужное место. Некоторые платформы также предлагают расширения для браузеров или сочетания клавиш, которые вставляют его автоматически.",
    "faq_6_q": "Сколько существует комбинаций Ленни Фейса?",
    "faq_6_a": "С помощью этого генератора вы можете создать более 98 000 уникальных комбинаций — 65 стилей глаз × 37 стилей рта × 41 стиль тела. Каждая комбинация создает новый Ленни Фейс, от классического ( ͡° ͜ʖ ͡°) до вариантов с медведем, мечом, магией и многих других.",
    "p_classic": "Классика",
    "p_flex": "Качок",
    "p_shrug": "Пожимание плечами",
    "p_magic": "Магия",
    "p_table_flip": "Переворачивание стола",
    "p_unflip": "Возврат стола",
    "p_fisticuffs": "Драка",
    "p_love": "Любовь",
    "p_disapproval": "Неодобрение",
    "p_tripping": "Кайф",
    "p_sensual": "Сенсуальный",
    "p_peek": "Подглядывание",
    "p_blush": "Румянец",
    "p_bird": "Средний палец",
    "p_bear": "Медведь",
    "p_sword": "Меч",
    "p_bill": "Долларовая купюра",
    "p_wick": "Джон Уик",
    "p_straya": "Австралия",
    "p_thumbs_up": "Класс",
    "see1": "Выбор каомодзи",
    "see2": "Выбор эмодзи",
    "see3": "Специальные символы",
    "see4": "Красивые шрифты"
  }
}
</i18n>
