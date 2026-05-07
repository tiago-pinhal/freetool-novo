<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const COPY_FEEDBACK_MS = 2000
const MAX_RECENT = 10

const categories = computed(() => [
  { icon: '→', key: 'cat0', symbols: ['←','→','↑','↓','↔','↕','↖','↗','↘','↙','↩','↪','↫','↬','↭','↮','↯','↰','↱','↲','↳','↴','↵','↶','↷','↸','↹','↺','↻','⇐','⇑','⇒','⇓','⇔','⇕','⇖','⇗','⇘','⇙','⇚','⇛','⇜','⇝','⇞','⇟','⇠','⇡','⇢','⇣','⇤','⇥','⇦','⇧','⇨','⇩','⇪','➔','➜','➡','➢','➣','➤','➥','➦','➧','➨','➩','➪','➫','➬','➭','➮','➯','➱','⬅','⬆','⬇','⬈','⬉','⬊','⬋','⟵','⟶','⟷','⟸','⟹','⟺'] },
  { icon: '■', key: 'cat1', symbols: ['■','□','▪','▫','▬','▭','▮','▯','▲','△','▴','▵','▶','▷','▸','▹','▼','▽','▾','▿','◀','◁','◂','◃','◄','◅','◆','◇','◈','◉','◊','○','◌','◍','◎','●','◐','◑','◒','◓','◔','◕','◖','◗','◢','◣','◤','◥','◦','◧','◨','◩','◪','◫','◬','◭','◮','◯','⬛','⬜','⭕','⬟','⬠','⬡','⬢','⬣','⬤'] },
  { icon: '★', key: 'cat2', symbols: ['★','☆','✦','✧','✩','✪','✫','✬','✭','✮','✯','✰','✱','✲','✳','✴','✵','✶','✷','✸','✹','✺','✻','✼','✽','✾','✿','❀','❁','❂','❃','❄','❅','❆','❇','❈','❉','❊','❋'] },
  { icon: '♥', key: 'cat3', symbols: ['♥','♡','❤','❥','❦','❧','❣'] },
  { icon: '∑', key: 'cat4', symbols: ['+','−','×','÷','=','±','∓','∞','∟','∠','∡','∢','∣','∥','∧','∨','∩','∪','∫','∬','∭','∮','√','∛','∜','∂','∆','∇','∑','∏','∐','∝','∴','∵','∶','∷','∸','∼','∽','∾','∿','≀','⊕','⊖','⊗','⊘','⊙','⊚','⊛','⊜','⊝','⊞','⊟','⊠','⊡','⊢','⊣','⊤','⊥'] },
  { icon: '≈', key: 'cat5', symbols: ['=','≠','≡','≢','≤','≥','≦','≧','≨','≩','≪','≫','≮','≯','≰','≱','≲','≳','≶','≷','≺','≻','≼','≽','≈','≉','≊','≋','≌','≍','≎','≏','≐','≑','≒','≓','≔','≕','≖','≗','≘','≙','≚','≛','≜','≝','≞','≟'] },
  { icon: '½', key: 'cat6', symbols: ['½','⅓','⅔','¼','¾','⅕','⅖','⅗','⅘','⅙','⅚','⅛','⅜','⅝','⅞','⅐','⅑','⅒','↉'] },
  { icon: '①', key: 'cat7', symbols: ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳','⑴','⑵','⑶','⑷','⑸','⑹','⑺','⑻','⑼','⑽','₀','₁','₂','₃','₄','₅','₆','₇','₈','₉','⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'] },
  { icon: '€', key: 'cat8', symbols: ['$','€','£','¥','¢','₿','₽','₩','₪','₫','₭','₮','₱','₲','₳','₴','₵','₷','₸','₹','₺','₼','₾','฿','﷼','؋','₡','₣','₤','₥','₦','₧','₨','₰'] },
  { icon: '«', key: 'cat9', symbols: ['·','•','‐','‑','‒','–','—','―','‖',"'",'`','‘','’','‚','‛','“','”','„','‟','†','‡','‣','‥','…','‰','‱','′','″','‴','‵','‶','‷','‸','‹','›','«','»','※','‼','‽','⁂','⁄','¡','¿','¦','§','¶'] },
  { icon: '©', key: 'cat10', symbols: ['©','®','™','℗','℠','℡','№','℅','℆','ℓ','Ω','Å','ℬ','ℭ','℮','ℰ','ℱ','ℵ','ℶ','ℷ','ℸ'] },
  { icon: 'α', key: 'cat11', symbols: ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','ς','σ','τ','υ','φ','χ','ψ','ω','Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω','ϐ','ϑ','ϒ','ϕ','ϖ'] },
  { icon: 'ə', key: 'cat12', symbols: ['ə','ʃ','ʒ','ʁ','ŋ','ɾ','ʔ','ʍ','ɪ','ʊ','ɐ','ɑ','ɒ','ɓ','ɔ','ɕ','ɖ','ɗ','ɛ','ɜ','ɝ','ɟ','ɠ','ɡ','ɢ','ɣ','ɤ','ɥ','ɦ','ɧ','ɨ','ɩ','ɫ','ɬ','ɭ','ɮ','ɯ','ɰ','ɱ','ɲ','ɳ','ɴ','ɵ','ɶ','ɷ','ɸ','ɹ','ɺ','ɻ','ɼ','ɽ','ɾ','ɿ','ʀ','ʂ','ʄ','ʅ','ʆ','ʇ','ʈ','ʉ','ʋ','ʌ','ʎ','ʏ','ʐ','ʑ','ʓ'] },
  { icon: '♪', key: 'cat13', symbols: ['♩','♪','♫','♬','♭','♮','♯','▶','◀'] },
  { icon: '⟨', key: 'cat14', symbols: ['(',')','[',']','{','}','⟨','⟩','⌈','⌉','⌊','⌋','【','】','〔','〕','〈','〉','《','》','「','」','『','』','〖','〗','❮','❯','❬','❭','❪','❫','❨','❩','⦃','⦄','⦅','⦆'] },
  { icon: '─', key: 'cat15', symbols: ['─','━','│','┃','┄','┅','┆','┇','┈','┉','┊','┋','┌','┍','┎','┏','┐','┑','┒','┓','└','┕','┖','┗','┘','┙','┚','┛','├','┤','┬','┴','┼','═','║','╔','╗','╚','╝','╞','╟','╠','╡','╢','╣','╤','╥','╦','╧','╨','╩','╪','╫','╬','╭','╮','╯','╰','╱','╲','╳','░','▒','▓','█','▀','▄','▌','▐'] },
  { icon: '°', key: 'cat16', symbols: ['°','℃','℉','%','‰','‱','′','″','‴','μ','Ω','ℓ','㎝','㎞','㎡','㎢','㎣','㎤','㎥','㎦','㎧','㎨','㎩','㎪','㎫','㎬','㏀','㏁','㏂','㏃','㏄','㏅','㏆','㏇','㏈','㏉','㏊','㏋','㏌','㏍','㏎','㏏','㏐','㏑','㏒','㏓','㏔','㏕','㏖','㏗','㏘','㏙','㏚','㏛','㏜','㏝'] },
  { icon: '♀', key: 'cat17', symbols: ['♀','♂','⚥','⚢','⚣','⚤','⚦','⚧','⚨','⚩','☺','☻','☹'] },
  { icon: '♟', key: 'cat18', symbols: ['♠','♥','♦','♣','♤','♡','♢','♧','♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟','⛀','⛁','⛂','⛃','⚀','⚁','⚂','⚃','⚄','⚅'] },
  { icon: '☯', key: 'cat19', symbols: ['✝','✞','✟','✠','☦','☧','☨','☩','☪','☫','☬','☭','☮','☯','☸','✡','☥','☤','☼','☽','☾','☰','☱','☲','☳','☴','☵','☶','☷','♁','⛎','✙','✚','✛','✜'] },
  { icon: '⚠', key: 'cat20', symbols: ['⚠','☢','☣','☠','☡','⚡','⚔','⚕','⚖','⚗','⚙','⚛','⚜','⚝','⚞','⚟','⚓','⚘','⚚','✂','✃','✄','✆','✇','✈','✉','✌','✍','✎','✏','✐','✑','✒'] },
  { icon: '〒', key: 'cat21', symbols: ['〒','〆','々','〜','〽','〰','〱','〲','〳','〴','〵','㊙','㊗','㊀','㊁','㊂','㊃','㊄','㊅','㊆','㊇','㊈','㊉','㊊','㊋','㊌','㊍','㊎','㊏','㊐','㊑','㊒','㊓','㊔','㊕','㊖','㊘','㊚','㊛','㊜','㊝','㊞','㊟','㊠','㊡','㊢','㊣','㊤','㊥','㊦','㊧','㊨','㊩','㊪','㊫','㊬','㊭','㊮','㊯','㊰','㋐','㋑','㋒','㋓','㋔','㋕','㋖','㋗','㋘','㋙','㋚','㋛','㋜','㋝','㋞','㋟','㋠','㋡','㋢','㋣','㋤','㋥','㋦','㋧','㋨','㋩','㋪','㋫','㋬','㋭'] },
  { icon: '✳', key: 'cat22', symbols: ['*','＊','∗','⁎','⁑','⁂','※','⊛','✱','✲','✳','✴','✵','✶','✷','✸','✹','✺','✻','✼','✽','✾','✿','❀','❁','❂','❃','❄','❅','❆','❇','❈','❉','❊','❋'] },
  { icon: '♈', key: 'cat23', symbols: ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','☿','♀','♁','♂','♃','♄','♅','♆','♇'] },
  { icon: '☀', key: 'cat24', symbols: ['☀','☁','☂','☃','☄','☇','☈','☉','☊','☋','☌','☍','☎','☏','☐','☑','☒','☓','☔','☕','☖','☗','☘','☙','☚','☛','☜','☝','☞','☟','☡','☢','☣','☤','☥','☼','☽','☾','✢','✣','✤','✥'] }
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  howToName: t('how_it_works_title'),
  howToSteps: [
    { name: t('hiw_1_title'), text: t('hiw_1_desc') },
    { name: t('hiw_2_title'), text: t('hiw_2_desc') },
    { name: t('hiw_3_title'), text: t('hiw_3_desc') }
  ],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') }
  ]
})

const state = reactive({
  tab: 0,
  recentlyCopied: [] as string[],
  copiedChar: null as string | null,
  copyAnnouncement: ''
})

onMounted(() => {
  try {
    const saved = localStorage.getItem('recentSymbols')
    if (saved) state.recentlyCopied = JSON.parse(saved).slice(0, MAX_RECENT)
  } catch {}
})

const currentSymbols = computed(() => categories.value[state.tab]?.symbols ?? [])

async function copy(sym: string) {
  try {
    await navigator.clipboard.writeText(sym)
    state.copiedChar = sym
    state.copyAnnouncement = t('copied_announce')
    addToRecent(sym)
    setTimeout(() => {
      state.copiedChar = null
      state.copyAnnouncement = ''
    }, COPY_FEEDBACK_MS)
  } catch {}
}

function addToRecent(sym: string) {
  const filtered = state.recentlyCopied.filter(s => s !== sym)
  state.recentlyCopied = [sym, ...filtered].slice(0, MAX_RECENT)
  try {
    localStorage.setItem('recentSymbols', JSON.stringify(state.recentlyCopied))
  } catch {}
}

defineI18nRoute({
  paths: {
    en: '/symbol-picker',
    pt: '/seletor-de-simbolos',
    es: '/selector-de-simbolos',
    fr: '/selecteur-de-symboles',
    it: '/selettore-di-simboli',
    id: '/pemilih-simbol',
    de: '/symbol-auswahl',
    nl: '/symbool-kiezer'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="true"
    :see-also-links="[
      { label: t('see1'), to: 'emoji-picker' },
      { label: t('see2'), to: 'fancy-letters' },
      { label: t('see3'), to: 'text-generator' },
      { label: t('see4'), to: 'ascii-letter-generator' }
    ]"
  >
    <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Seleção de categoria -->
      <div class="form-control w-full">
        <label for="symbol-category" class="label">
          <span class="label-text font-bold text-base-content">{{ t('category_label') }}</span>
          <span class="label-text-alt text-base-content/70 text-sm">
            {{ currentSymbols.length }} {{ t('symbols_count') }}
          </span>
        </label>
        <select
          id="symbol-category"
          v-model="state.tab"
          class="select select-bordered w-full bg-base-200 focus:bg-base-200 rounded-2xl text-base"
        >
          <option v-for="(cat, i) in categories" :key="i" :value="i">
            {{ cat.icon }} {{ t(cat.key) }}
          </option>
        </select>
      </div>

      <!-- Símbolos copiados recentemente -->
      <div v-if="state.recentlyCopied.length > 0" class="bg-base-200 rounded-2xl px-4 py-3">
        <p class="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">{{ t('recently_copied') }}</p>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="(sym, i) in state.recentlyCopied"
            :key="i"
            type="button"
            @click="copy(sym)"
            class="relative text-2xl p-1.5 rounded-xl transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer font-mono"
            :class="state.copiedChar === sym ? 'bg-success/20 scale-110 ring-2 ring-success' : ''"
          >
            {{ sym }}
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-0 opacity-0"
            >
              <span
                v-if="state.copiedChar === sym"
                class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-success rounded-full flex items-center justify-center text-success-content text-[10px] font-bold leading-none z-10"
              >✓</span>
            </Transition>
          </button>
        </div>
      </div>

      <!-- Grade de símbolos -->
      <div
        class="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm overflow-y-auto p-3"
        style="height: 380px"
        :aria-label="t('results_label')"
        role="list"
      >
        <div class="flex flex-wrap gap-0.5">
          <button
            v-for="sym in currentSymbols"
            :key="sym"
            type="button"
            role="listitem"
            :title="sym"
            :aria-label="sym"
            @click="copy(sym)"
            class="relative text-2xl p-2.5 rounded-xl transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer font-mono min-w-[3rem] flex items-center justify-center"
            :class="state.copiedChar === sym ? 'bg-success/20 scale-110 ring-2 ring-success' : 'hover:bg-base-200'"
          >
            {{ sym }}
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-0 opacity-0"
            >
              <span
                v-if="state.copiedChar === sym"
                class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-success rounded-full flex items-center justify-center text-success-content text-[10px] font-bold leading-none z-10"
              >✓</span>
            </Transition>
          </button>
        </div>
      </div>

      <!-- Anúncio acessível para leitores de tela -->
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
        {{ state.copyAnnouncement }}
      </div>

    </div>

    <template #info>
      <div class="space-y-8">

        <p>{{ t('d1') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') },
            { title: t('uc_4_title'), description: t('uc_4_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_it_works_title')"
          :items="[
            { title: t('hiw_1_title'), description: t('hiw_1_desc') },
            { title: t('hiw_2_title'), description: t('hiw_2_desc') },
            { title: t('hiw_3_title'), description: t('hiw_3_desc') }
          ]"
        />

        <!-- Glossário de categorias -->
        <div>
          <h2 class="text-xl font-bold mb-4">{{ t('categories_title') }}</h2>
          <p class="text-base-content mb-4">{{ t('categories_intro') }}</p>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="cat in categories"
              :key="cat.key"
              class="flex gap-2"
            >
              <span class="shrink-0 mt-0.5 text-lg leading-none font-mono" aria-hidden="true">{{ cat.icon }}</span>
              <p>
                <strong>{{ t(cat.key) }}:</strong>
                {{ t(cat.key + '_d') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Seção educacional sobre Unicode -->
        <div>
          <h2 class="text-xl font-bold mb-3">{{ t('unicode_title') }}</h2>
          <p class="text-base-content leading-relaxed">{{ t('unicode_p1') }}</p>
          <p class="text-base-content leading-relaxed mt-2">{{ t('unicode_p2') }}</p>
        </div>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
            { question: t('faq_5_q'), answer: t('faq_5_a') }
          ]"
        />

      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    m_title: "Símbolos para Copiar e Colar - Seletor de Símbolos Unicode ★ ← ∑ ♥",
    title: "Símbolos para Copiar e Colar",
    meta: "Seletor de símbolos Unicode gratuito para copiar e colar com um clique. Mais de 600 símbolos em 25 categorias: setas, matemática, moedas, letras gregas, frações, corações e muito mais.",
    d1: "Encontre e copie símbolos Unicode com um clique. Navegue por 25 categorias que incluem setas, símbolos matemáticos, moedas, letras gregas, fonética, símbolos musicais e muito mais. Esta ferramenta organiza mais de 600 símbolos prontos para colar em documentos, redes sociais, apresentações ou qualquer aplicativo que aceite texto.",

    category_label: "Selecione uma categoria",
    symbols_count: "símbolos",
    recently_copied: "Copiados recentemente",
    copied_announce: "Símbolo copiado para a área de transferência",
    results_label: "Grade de símbolos",

    features_title: "Recursos da ferramenta",
    f_1: "Mais de 600 símbolos Unicode em 25 categorias",
    f_2: "Cópia com um clique — sem selecionar nem arrastar",
    f_3: "Histórico dos símbolos copiados recentemente",
    f_4: "Funciona em qualquer dispositivo e plataforma",

    use_cases_title: "Onde usar símbolos Unicode",
    uc_1_title: "Documentos e textos acadêmicos",
    uc_1_desc: "Símbolos matemáticos (∑ ∫ √ ≈), letras gregas (α β γ) e frações (½ ¾) são indispensáveis em artigos científicos, fórmulas e relatórios técnicos. Cole diretamente em qualquer editor de texto.",
    uc_2_title: "Redes sociais e bio de perfil",
    uc_2_desc: "Use setas, estrelas, corações e símbolos decorativos para destacar sua bio no Instagram, TikTok ou Twitter. Símbolos Unicode colam corretamente em todos os aplicativos móveis e web.",
    uc_3_title: "Apresentações e design",
    uc_3_desc: "Linhas e bordas de caixa (─ │ ╔ ╗) criam estruturas visuais em slides e documentos. Símbolos de aviso (⚠ ⚡) e técnicos (⚙ ✂) comunicam informações de forma clara e visual.",
    uc_4_title: "Programação e markdown",
    uc_4_desc: "Símbolos de comparação (≤ ≥ ≠), operadores matemáticos e símbolos de pontuação tipográfica (— … «») melhoram comentários de código, documentação técnica e arquivos README.",

    how_it_works_title: "Como usar",
    hiw_1_title: "Escolha uma categoria",
    hiw_1_desc: "Selecione a categoria desejada no menu suspenso. Há 25 categorias organizadas por tema: setas, formas geométricas, matemática, moedas, letras gregas e muito mais.",
    hiw_2_title: "Clique no símbolo para copiar",
    hiw_2_desc: "Um único clique em qualquer símbolo o copia automaticamente para a área de transferência. Não é necessário selecionar, arrastar ou usar nenhum atalho de teclado.",
    hiw_3_title: "Cole onde quiser",
    hiw_3_desc: "Com o símbolo copiado, cole em qualquer lugar: Word, Google Docs, WhatsApp, Instagram, e-mail, código ou terminal. Todos os símbolos são Unicode puro e funcionam universalmente.",

    categories_title: "Categorias de símbolos disponíveis",
    categories_intro: "Os símbolos estão organizados em 25 categorias para facilitar a navegação:",

    cat0: "Setas",
    cat0_d: "Setas em todas as direções e estilos para navegação, fluxogramas e diagramas.",
    cat1: "Formas Geométricas",
    cat1_d: "Quadrados, triângulos, círculos e outras formas para design e representação visual.",
    cat2: "Estrelas e Decorativos",
    cat2_d: "Estrelas, florestas e ornamentos decorativos para destacar textos e designs.",
    cat3: "Corações",
    cat3_d: "Variações de corações para expressar afeto em mensagens e publicações.",
    cat4: "Matemática",
    cat4_d: "Operadores, integrais, raízes e símbolos essenciais para notação matemática.",
    cat5: "Comparação",
    cat5_d: "Sinais de igualdade, desigualdade e relações de ordem para equações e lógica.",
    cat6: "Frações",
    cat6_d: "Frações Unicode prontas para usar em textos sem precisar de formatação especial.",
    cat7: "Numérico",
    cat7_d: "Números circulados, subscritos e sobrescritos para listas e notação técnica.",
    cat8: "Moedas",
    cat8_d: "Símbolos de moedas do mundo inteiro para documentos financeiros e preços.",
    cat9: "Pontuação e Tipografia",
    cat9_d: "Travessões, reticências, aspas especiais e sinais tipográficos para escrita profissional.",
    cat10: "Direitos e Marcas",
    cat10_d: "Copyright, marca registrada, patente e símbolos legais para documentos oficiais.",
    cat11: "Letras Gregas",
    cat11_d: "Alfabeto grego completo (maiúsculas e minúsculas) para matemática, física e ciências.",
    cat12: "Fonético",
    cat12_d: "Símbolos do Alfabeto Fonético Internacional (IPA) para linguística e pronúncia.",
    cat13: "Musical e Mídia",
    cat13_d: "Notas musicais e símbolos de reprodução para conteúdos relacionados à música.",
    cat14: "Agrupamento",
    cat14_d: "Parênteses, colchetes, chaves e delimitadores especiais para código e matemática.",
    cat15: "Linhas e Bordas",
    cat15_d: "Caracteres de caixa para criar tabelas, bordas e estruturas visuais em texto simples.",
    cat16: "Unidades e Medidas",
    cat16_d: "Graus, temperatura, unidades de medida e símbolos científicos padronizados.",
    cat17: "Pessoas e Gênero",
    cat17_d: "Símbolos de gênero, identidade e expressões faciais básicas.",
    cat18: "Jogos",
    cat18_d: "Peças de xadrez, cartas de baralho e dados para jogos e passatempos.",
    cat19: "Religioso e Espiritual",
    cat19_d: "Símbolos religiosos e espirituais de diversas tradições e culturas.",
    cat20: "Técnico e Avisos",
    cat20_d: "Ícones de aviso, ferramentas e símbolos técnicos para sinalização e comunicação.",
    cat21: "Símbolos Japoneses",
    cat21_d: "Caracteres e símbolos do sistema de escrita japonês para conteúdo multilíngue.",
    cat22: "Asteriscos e Ornamentos",
    cat22_d: "Variações de asteriscos e ornamentos tipográficos para notas e decoração.",
    cat23: "Zodíaco e Astrologia",
    cat23_d: "Signos do zodíaco e símbolos planetários para astrologia e astronomia.",
    cat24: "Miscelâneos",
    cat24_d: "Símbolos variados de clima, objetos e ícones de uso geral.",

    unicode_title: "Por que símbolos Unicode funcionam em qualquer plataforma",
    unicode_p1: "Símbolos Unicode são caracteres de texto padronizados, não imagens. Isso significa que funcionam em qualquer dispositivo, sistema operacional ou aplicativo que suporte texto: do Android ao iPhone, do Windows ao Mac, do Word ao Google Docs, do Instagram ao Discord. Quando você copia um símbolo aqui e cola em outro lugar, o resultado é sempre compatível.",
    unicode_p2: "A aparência visual pode variar levemente entre plataformas e fontes, mas o caractere em si é universal. Símbolos como ∑, →, ♥ e € são reconhecidos globalmente e renderizados corretamente em praticamente todos os contextos modernos.",

    faq_title: "Perguntas e Respostas",
    faq_1_q: "Como copiar e colar símbolos especiais no computador?",
    faq_1_a: "Acesse esta página, selecione a categoria desejada e clique em qualquer símbolo. Ele é copiado automaticamente para a área de transferência. Em seguida, vá ao aplicativo ou documento desejado e cole com Ctrl+V (Windows/Linux) ou Cmd+V (Mac). Não é necessário instalar nada.",
    faq_2_q: "Os símbolos funcionam no Instagram, WhatsApp e outras redes sociais?",
    faq_2_a: "Sim. Todos os símbolos desta ferramenta são caracteres Unicode e funcionam em Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord e qualquer plataforma que aceite texto. Basta copiar e colar diretamente na bio, legenda ou mensagem.",
    faq_3_q: "Posso usar símbolos matemáticos em documentos do Word e Google Docs?",
    faq_3_a: "Sim. Símbolos como ∑, ∫, √, ≤, ≥, π e letras gregas como α e β colam corretamente no Microsoft Word, Google Docs, LibreOffice e qualquer editor de texto. Para textos acadêmicos e científicos, esta é a forma mais rápida de inserir notação matemática.",
    faq_4_q: "Qual é a diferença entre símbolos Unicode e caracteres especiais do teclado?",
    faq_4_a: "O teclado padrão oferece apenas cerca de 100 caracteres. O Unicode define mais de 140.000 caracteres, incluindo símbolos de todas as línguas, matemática, música, moedas e muito mais. Esta ferramenta dá acesso a centenas desses símbolos que não existem no teclado comum.",
    faq_5_q: "Os símbolos funcionam em títulos de e-mail e assuntos de newsletter?",
    faq_5_a: "Sim, com ressalvas. Símbolos simples como ★, →, ✓ e ♥ funcionam bem na maioria dos clientes de e-mail modernos e podem aumentar a taxa de abertura. Evite símbolos muito exóticos ou de categorias específicas de idiomas, pois alguns clientes de e-mail mais antigos podem não renderizá-los corretamente.",

    see1: "Seletor de Emojis",
    see2: "Letras Estilizadas",
    see3: "Gerador de Texto",
    see4: "Gerador de Letras ASCII"
  },
  en: {
    see1: "Emoji Picker",
    see2: "Fancy Letters",
    see3: "Text Generator",
    see4: "ASCII Letter Generator"
  },
  es: {
    see1: "Selector de Emojis",
    see2: "Letras Estilizadas",
    see3: "Generador de Texto",
    see4: "Generador de Letras ASCII"
  },
  fr: {
    see1: "Sélecteur d'Emojis",
    see2: "Lettres Stylisées",
    see3: "Générateur de Texte",
    see4: "Générateur de Lettres ASCII"
  },
  it: {
    see1: "Selettore di Emoji",
    see2: "Lettere Diverse",
    see3: "Generatore di Testo",
    see4: "Generatore di Lettere ASCII"
  },
  id: {
    see1: "Pemilih Emoji",
    see2: "Huruf Gaya",
    see3: "Generator Teks",
    see4: "Generator Huruf ASCII"
  },
  de: {
    see1: "Emoji-Auswahl",
    see2: "Schriftarten-Generator",
    see3: "Text-Generator",
    see4: "ASCII-Buchstaben-Generator"
  },
  nl: {
    see1: "Emoji-Kiezer",
    see2: "Mooie Letters",
    see3: "Tekstgenerator",
    see4: "ASCII-lettergenerator"
  }
}
</i18n>
