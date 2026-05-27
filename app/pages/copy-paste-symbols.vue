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
  features: [t('f_1'), t('f_2'), t('f_3')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') }
  ]
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') },
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
    en: '/copy-paste-symbols',
    pt: '/simbolos-copiar-colar',
    es: '/simbolos-copiar-pegar',
    fr: '/symboles-copier-coller',
    it: '/simboli-copiare-incollare',
    id: '/simbol-salin-tempel',
    de: '/symbole-kopieren-einfuegen',
    nl: '/symbolen-kopieren-plakken',
    ru: '/simvoly-kopirovat-vstavit'
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
          :items="[t('f_1'), t('f_2'), t('f_3')]"
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
    m_title: "Símbolos para Copiar e Colar ★ ♥ → ∑ ← - Setas, Matemática e Mais",
    title: "Símbolos para Copiar e Colar",
    meta: "Copie e cole mais de 1.000 símbolos Unicode grátis — setas ←→, matemática ∑√π, corações ♥, estrelas ★, moedas €$, frações ½¾ e letras gregas. 25 categorias.",
    d1: "Navegue por 25 categorias que incluem setas, símbolos matemáticos, moedas, letras gregas, fonética e símbolos musicais. A ferramenta organiza mais de 1.000 símbolos prontos para copiar e colar em documentos, redes sociais, apresentações e outros aplicativos.",

    category_label: "Selecione uma categoria",
    symbols_count: "símbolos",
    recently_copied: "Copiados recentemente",
    copied_announce: "Símbolo copiado para a área de transferência",
    results_label: "Grade de símbolos",

  features_title: "Funcionalidades",
    f_1: "Variedade Abrangente: Mais de 1.000 símbolos catalogados em 25 categorias, de matemática a ícones decorativos.",
    f_2: "Histórico Automático: Seus símbolos favoritos são salvos localmente no navegador para acesso instantâneo em visitas futuras.",
    f_3: "Compatibilidade Universal: Símbolos em Unicode nativo, garantindo que funcionem perfeitamente em qualquer sistema, rede social ou documento.",

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
    hiw_1_desc: "Selecione a categoria desejada no menu suspenso.",
    hiw_2_title: "Clique no símbolo para copiar",
    hiw_2_desc: "Um único clique em qualquer símbolo o copia automaticamente para a área de transferência.",
    hiw_3_title: "Cole onde quiser",
    hiw_3_desc: "Com o símbolo copiado, cole em qualquer lugar: Word, Google Docs, WhatsApp, Instagram, e-mail, código ou terminal.",

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
    faq_1_a: "Acesse esta página, selecione a categoria desejada e clique em qualquer símbolo. Ele é copiado automaticamente para a área de transferência. Em seguida, vá ao aplicativo ou documento desejado e cole. Não é necessário instalar nada.",
    faq_2_q: "Os símbolos funcionam no Instagram, WhatsApp e outras redes sociais?",
    faq_2_a: "Sim. Todos os símbolos desta ferramenta são caracteres Unicode e funcionam em Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord e qualquer plataforma que aceite texto. Basta copiar e colar diretamente na bio, legenda ou mensagem.",
    faq_3_q: "Posso usar símbolos matemáticos em documentos do Word e Google Docs?",
    faq_3_a: "Sim. Símbolos como ∑, ∫, √, ≤, ≥, π e letras gregas como α e β colam corretamente no Microsoft Word, Google Docs, LibreOffice e qualquer editor de texto. Para textos acadêmicos e científicos, esta é a forma mais rápida de inserir notação matemática.",
    faq_4_q: "Qual é a diferença entre símbolos Unicode e caracteres especiais do teclado?",
    faq_4_a: "O teclado padrão oferece apenas cerca de 100 caracteres. O Unicode define mais de 140.000 caracteres, incluindo símbolos de todas as línguas, matemática, música, moedas e muito mais. Esta ferramenta dá acesso a centenas desses símbolos que não existem no teclado comum.",
    faq_5_q: "Os símbolos funcionam em títulos de e-mail e assuntos de newsletter?",
    faq_5_a: "Sim, com ressalvas. Caracteres Unicode simples, como ★, →, ✓ e ♥, costumam ser exibidos corretamente na maioria dos clientes de e-mail modernos.",
    see1: "Seletor de Emojis",
    see2: "Letras Estilizadas",
    see3: "Gerador de Texto",
    see4: "Letras ASCII"
  },
  en: {
    m_title: "Copy and Paste Symbols ★ ♥ → ∑ ← - Arrows, Math, Currency & More",
    title: "Symbols to Copy and Paste",
    meta: "Copy and paste 1,000+ Unicode symbols free — arrows ←→, math ∑√π, hearts ♥, stars ★, currencies €$, fractions ½¾, Greek letters and 20 more categories.",
    d1: "Browse through 25 categories that include arrows, math symbols, currencies, Greek letters, phonetics, and musical symbols. The tool organizes over 1,000 symbols ready to be copied and pasted into documents, social networks, presentations, and other apps.",

    category_label: "Select a category",
    symbols_count: "symbols",
    recently_copied: "Recently copied",
    copied_announce: "Symbol copied to clipboard",
    results_label: "Symbol grid",

    features_title: "Features",
    f_1: "Comprehensive Variety: Over 1,000 symbols cataloged in 25 categories, from math to decorative icons.",
    f_2: "Automatic History: Your favorite symbols are saved locally in your browser for instant access on future visits.",
    f_3: "Universal Compatibility: Native Unicode symbols, ensuring they work perfectly on any system, social network, or document.",

    use_cases_title: "Where to use Unicode symbols",
    uc_1_title: "Academic documents and texts",
    uc_1_desc: "Math symbols (∑ ∫ √ ≈), Greek letters (α β γ) and fractions (½ ¾) are indispensable in scientific papers, formulas, and technical reports. Paste directly into any text editor.",
    uc_2_title: "Social media and profile bios",
    uc_2_desc: "Use arrows, stars, hearts, and decorative symbols to make your bio stand out on Instagram, TikTok, or Twitter. Unicode symbols paste correctly on all mobile and web apps.",
    uc_3_title: "Presentations and design",
    uc_3_desc: "Box-drawing characters (─ │ ╔ ╗) create visual structures in slides and documents. Warning (⚠ ⚡) and technical (⚙ ✂) symbols communicate information clearly and visually.",
    uc_4_title: "Programming and markdown",
    uc_4_desc: "Comparison symbols (≤ ≥ ≠), mathematical operators, and typographic punctuation marks (— … «») improve code comments, technical documentation, and README files.",

    how_it_works_title: "How to use",
    hiw_1_title: "Choose a category",
    hiw_1_desc: "Select the desired category from the dropdown menu.",
    hiw_2_title: "Click the symbol to copy",
    hiw_2_desc: "A single click on any symbol automatically copies it to your clipboard.",
    hiw_3_title: "Paste wherever you want",
    hiw_3_desc: "With the copied symbol, paste it anywhere: Word, Google Docs, WhatsApp, Instagram, email, code, or terminal.",

    categories_title: "Available symbol categories",
    categories_intro: "The symbols are organized into 25 categories for easy navigation:",

    cat0: "Arrows",
    cat0_d: "Arrows in all directions and styles for navigation, flowcharts, and diagrams.",
    cat1: "Geometric Shapes",
    cat1_d: "Squares, triangles, circles, and other shapes for design and visual representation.",
    cat2: "Stars and Decoratives",
    cat2_d: "Stars, flourishes, and decorative ornaments to highlight text and designs.",
    cat3: "Hearts",
    cat3_d: "Heart variations to express affection in messages and posts.",
    cat4: "Math",
    cat4_d: "Operators, integrals, roots, and essential symbols for mathematical notation.",
    cat5: "Comparison",
    cat5_d: "Equality, inequality, and order relation signs for equations and logic.",
    cat6: "Fractions",
    cat6_d: "Unicode fractions ready to use in text without special formatting.",
    cat7: "Numeric",
    cat7_d: "Circled numbers, subscripts, and superscripts for lists and technical notation.",
    cat8: "Currencies",
    cat8_d: "Currency symbols from around the world for financial documents and prices.",
    cat9: "Punctuation and Typography",
    cat9_d: "Dashes, ellipses, special quotes, and typographic signs for professional writing.",
    cat10: "Rights and Trademarks",
    cat10_d: "Copyright, registered trademark, patent, and legal symbols for official documents.",
    cat11: "Greek Letters",
    cat11_d: "Complete Greek alphabet (uppercase and lowercase) for math, physics, and science.",
    cat12: "Phonetic",
    cat12_d: "International Phonetic Alphabet (IPA) symbols for linguistics and pronunciation.",
    cat13: "Music and Media",
    cat13_d: "Musical notes and playback symbols for music-related content.",
    cat14: "Grouping",
    cat14_d: "Parentheses, brackets, braces, and special delimiters for code and math.",
    cat15: "Lines and Borders",
    cat15_d: "Box-drawing characters to create tables, borders, and visual structures in plain text.",
    cat16: "Units and Measurements",
    cat16_d: "Degrees, temperature, measurement units, and standardized scientific symbols.",
    cat17: "People and Gender",
    cat17_d: "Gender symbols, identity, and basic facial expressions.",
    cat18: "Games",
    cat18_d: "Chess pieces, playing cards, and dice for games and hobbies.",
    cat19: "Religious and Spiritual",
    cat19_d: "Religious and spiritual symbols from various traditions and cultures.",
    cat20: "Technical and Warnings",
    cat20_d: "Warning icons, tools, and technical symbols for signage and communication.",
    cat21: "Japanese Symbols",
    cat21_d: "Characters and symbols from the Japanese writing system for multilingual content.",
    cat22: "Asterisks and Ornaments",
    cat22_d: "Asterisk variations and typographic ornaments for notes and decoration.",
    cat23: "Zodiac and Astrology",
    cat23_d: "Zodiac signs and planetary symbols for astrology and astronomy.",
    cat24: "Miscellaneous",
    cat24_d: "Various weather, object, and general-purpose icon symbols.",

    unicode_title: "Why Unicode symbols work on any platform",
    unicode_p1: "Unicode symbols are standardized text characters, not images. This means they work on any device, operating system, or app that supports text: from Android to iPhone, Windows to Mac, Word to Google Docs, Instagram to Discord. When you copy a symbol here and paste it elsewhere, the result is always compatible.",
    unicode_p2: "The visual appearance may vary slightly across platforms and fonts, but the character itself is universal. Symbols like ∑, →, ♥, and € are recognized globally and rendered correctly in virtually all modern contexts.",

    faq_title: "Questions and Answers",
    faq_1_q: "How to copy and paste special symbols on the computer?",
    faq_1_a: "Access this page, select the desired category, and click any symbol. It is automatically copied to the clipboard. Then, go to the desired app or document and paste. There's no need to install anything.",
    faq_2_q: "Do the symbols work on Instagram, WhatsApp, and other social networks?",
    faq_2_a: "Yes. All symbols in this tool are Unicode characters and work on Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord, and any platform that accepts text. Just copy and paste directly into your bio, caption, or message.",
    faq_3_q: "Can I use math symbols in Word and Google Docs?",
    faq_3_a: "Yes. Symbols like ∑, ∫, √, ≤, ≥, π, and Greek letters like α and β paste correctly in Microsoft Word, Google Docs, LibreOffice, and any text editor. For academic and scientific texts, this is the fastest way to insert mathematical notation.",
    faq_4_q: "What is the difference between Unicode symbols and special keyboard characters?",
    faq_4_a: "The standard keyboard offers only about 100 characters. Unicode defines over 140,000 characters, including symbols for all languages, math, music, currencies, and more. This tool gives you access to hundreds of these symbols that don't exist on a regular keyboard.",
    faq_5_q: "Do symbols work in email subjects and newsletter titles?",
    faq_5_a: "Yes, with caveats. Simple Unicode characters, like ★, →, ✓, and ♥, are usually displayed correctly in most modern email clients.",
    see1: "Emoji Picker",
    see2: "Fancy Letters",
    see3: "Text Generator",
    see4: "ASCII Letter Generator"
  },
  es: {
    m_title: "Símbolos para Copiar y Pegar ★ ♥ → ∑ ← - Flechas, Matemáticas y Más",
    title: "Símbolos para Copiar y Pegar",
    meta: "Copia y pega más de 1.000 símbolos Unicode gratis — flechas ←→, matemáticas ∑√π, corazones ♥, estrellas ★, monedas €$, fracciones ½¾ y letras griegas. 25 categorías.",
    d1: "Navega por 25 categorías que incluyen flechas, símbolos matemáticos, monedas, letras griegas, fonética y símbolos musicales. La herramienta organiza más de 1.000 símbolos listos para copiar y pegar en documentos, redes sociales, presentaciones y otras aplicaciones.",

    category_label: "Selecciona una categoría",
    symbols_count: "símbolos",
    recently_copied: "Copiados recientemente",
    copied_announce: "Símbolo copiado al portapapeles",
    results_label: "Cuadrícula de símbolos",

    features_title: "Características",
    f_1: "Variedad exhaustiva: Más de 1.000 símbolos catalogados en 25 categorías, desde matemáticas hasta iconos decorativos.",
    f_2: "Historial automático: Tus símbolos favoritos se guardan localmente en tu navegador para un acceso instantáneo en futuras visitas.",
    f_3: "Compatibilidad universal: Símbolos Unicode nativos, asegurando que funcionen perfectamente en cualquier sistema, red social o documento.",

    use_cases_title: "Dónde usar símbolos Unicode",
    uc_1_title: "Documentos y textos académicos",
    uc_1_desc: "Los símbolos matemáticos (∑ ∫ √ ≈), letras griegas (α β γ) y fracciones (½ ¾) son indispensables en artículos científicos, fórmulas y reportes técnicos. Pega directamente en cualquier editor de texto.",
    uc_2_title: "Redes sociales y biografías de perfil",
    uc_2_desc: "Usa flechas, estrellas, corazones y símbolos decorativos para hacer que tu biografía destaque en Instagram, TikTok o Twitter. Los símbolos Unicode se pegan correctamente en todas las aplicaciones móviles y web.",
    uc_3_title: "Presentaciones y diseño",
    uc_3_desc: "Los caracteres de dibujo de cajas (─ │ ╔ ╗) crean estructuras visuales en diapositivas y documentos. Los símbolos de advertencia (⚠ ⚡) y técnicos (⚙ ✂) comunican información de forma clara y visual.",
    uc_4_title: "Programación y markdown",
    uc_4_desc: "Los símbolos de comparación (≤ ≥ ≠), operadores matemáticos y signos de puntuación tipográfica (— … «») mejoran los comentarios de código, la documentación técnica y los archivos README.",

    how_it_works_title: "Cómo usar",
    hiw_1_title: "Elige una categoría",
    hiw_1_desc: "Selecciona la categoría deseada en el menú desplegable.",
    hiw_2_title: "Haz clic en el símbolo para copiar",
    hiw_2_desc: "Un solo clic en cualquier símbolo lo copia automáticamente a tu portapapeles.",
    hiw_3_title: "Pega donde quieras",
    hiw_3_desc: "Con el símbolo copiado, pégalo en cualquier lugar: Word, Google Docs, WhatsApp, Instagram, correo electrónico, código o terminal.",

    categories_title: "Categorías de símbolos disponibles",
    categories_intro: "Los símbolos están organizados en 25 categorías para facilitar la navegación:",

    cat0: "Flechas",
    cat0_d: "Flechas en todas las direcciones y estilos para navegación, diagramas de flujo y esquemas.",
    cat1: "Formas Geométricas",
    cat1_d: "Cuadrados, triángulos, círculos y otras formas para diseño y representación visual.",
    cat2: "Estrellas y Decorativos",
    cat2_d: "Estrellas, florituras y ornamentos decorativos para resaltar textos y diseños.",
    cat3: "Corazones",
    cat3_d: "Variaciones de corazones para expresar afecto en mensajes y publicaciones.",
    cat4: "Matemáticas",
    cat4_d: "Operadores, integrales, raíces y símbolos esenciales para notación matemática.",
    cat5: "Comparación",
    cat5_d: "Signos de igualdad, desigualdad y relaciones de orden para ecuaciones y lógica.",
    cat6: "Fracciones",
    cat6_d: "Fracciones Unicode listas para usar en texto sin formato especial.",
    cat7: "Numérico",
    cat7_d: "Números en círculos, subíndices y superíndices para listas y notación técnica.",
    cat8: "Monedas",
    cat8_d: "Símbolos de monedas de todo el mundo para documentos financieros y precios.",
    cat9: "Puntuación y Tipografía",
    cat9_d: "Guiones, puntos suspensivos, comillas especiales y signos tipográficos para escritura profesional.",
    cat10: "Derechos y Marcas",
    cat10_d: "Copyright, marca registrada, patente y símbolos legales para documentos oficiales.",
    cat11: "Letras Griegas",
    cat11_d: "Alfabeto griego completo (mayúsculas y minúsculas) para matemáticas, física y ciencias.",
    cat12: "Fonética",
    cat12_d: "Símbolos del Alfabeto Fonético Internacional (AFI) para lingüística y pronunciación.",
    cat13: "Música y Medios",
    cat13_d: "Notas musicales y símbolos de reproducción para contenido relacionado con la música.",
    cat14: "Agrupación",
    cat14_d: "Paréntesis, corchetes, llaves y delimitadores especiales para código y matemáticas.",
    cat15: "Líneas y Bordes",
    cat15_d: "Caracteres de dibujo de cajas para crear tablas, bordes y estructuras visuales en texto plano.",
    cat16: "Unidades y Medidas",
    cat16_d: "Grados, temperatura, unidades de medida y símbolos científicos estandarizados.",
    cat17: "Personas y Género",
    cat17_d: "Símbolos de género, identidad y expresiones faciales básicas.",
    cat18: "Juegos",
    cat18_d: "Piezas de ajedrez, naipes y dados para juegos y pasatiempos.",
    cat19: "Religiosos y Espirituales",
    cat19_d: "Símbolos religiosos y espirituales de diversas tradiciones y culturas.",
    cat20: "Técnicos y Advertencias",
    cat20_d: "Iconos de advertencia, herramientas y símbolos técnicos para señalización y comunicación.",
    cat21: "Símbolos Japoneses",
    cat21_d: "Caracteres y símbolos del sistema de escritura japonés para contenido multilingüe.",
    cat22: "Asteriscos y Ornamentos",
    cat22_d: "Variaciones de asteriscos y ornamentos tipográficos para notas y decoración.",
    cat23: "Zodíaco y Astrología",
    cat23_d: "Signos del zodíaco y símbolos planetarios para astrología y astronomía.",
    cat24: "Misceláneos",
    cat24_d: "Varios símbolos de clima, objetos e iconos de uso general.",

    unicode_title: "Por qué los símbolos Unicode funcionan en cualquier plataforma",
    unicode_p1: "Los símbolos Unicode son caracteres de texto estandarizados, no imágenes. Esto significa que funcionan en cualquier dispositivo, sistema operativo o aplicación que admita texto: de Android a iPhone, de Windows a Mac, de Word a Google Docs, de Instagram a Discord. Cuando copias un símbolo aquí y lo pegas en otro lugar, el resultado siempre es compatible.",
    unicode_p2: "La apariencia visual puede variar ligeramente entre plataformas y fuentes, pero el carácter en sí es universal. Símbolos como ∑, →, ♥ y € son reconocidos globalmente y se representan correctamente en prácticamente todos los contextos modernos.",

    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cómo copiar y pegar símbolos especiales en la computadora?",
    faq_1_a: "Accede a esta página, selecciona la categoría deseada y haz clic en cualquier símbolo. Se copiará automáticamente al portapapeles. Luego, ve a la aplicación o documento deseado y pégalo. No es necesario instalar nada.",
    faq_2_q: "¿Los símbolos funcionan en Instagram, WhatsApp y otras redes sociales?",
    faq_2_a: "Sí. Todos los símbolos de esta herramienta son caracteres Unicode y funcionan en Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord y en cualquier plataforma que acepte texto. Solo tienes que copiar y pegar directamente en tu biografía, subtítulo o mensaje.",
    faq_3_q: "¿Puedo usar símbolos matemáticos en Word y Google Docs?",
    faq_3_a: "Sí. Símbolos como ∑, ∫, √, ≤, ≥, π y letras griegas como α y β se pegan correctamente en Microsoft Word, Google Docs, LibreOffice y cualquier editor de texto. Para textos académicos y científicos, esta es la forma más rápida de insertar notación matemática.",
    faq_4_q: "¿Cuál es la diferencia entre los símbolos Unicode y los caracteres especiales del teclado?",
    faq_4_a: "El teclado estándar ofrece solo unos 100 caracteres. Unicode define más de 140.000 caracteres, incluidos símbolos para todos los idiomas, matemáticas, música, monedas y más. Esta herramienta te da acceso a cientos de estos símbolos que no existen en un teclado normal.",
    faq_5_q: "¿Funcionan los símbolos en los asuntos de correos electrónicos y boletines?",
    faq_5_a: "Sí, con algunas excepciones. Los caracteres Unicode simples, como ★, →, ✓ y ♥, generalmente se muestran correctamente en la mayoría de los clientes de correo electrónico modernos.",
    see1: "Selector de Emojis",
    see2: "Letras Estilizadas",
    see3: "Generador de Texto",
    see4: "Generador de Letras ASCII"
  },
  fr: {
    m_title: "Symboles à Copier-Coller ★ ♥ → ∑ ← - Flèches, Maths et Plus | Gratuit",
    title: "Symboles à Copier-Coller",
    meta: "Copiez-collez plus de 1 000 symboles Unicode gratuitement — flèches ←→, maths ∑√π, cœurs ♥, étoiles ★, devises €$, fractions ½¾ et lettres grecques. 25 catégories.",
    d1: "Parcourez 25 catégories comprenant des flèches, des symboles mathématiques, des devises, des lettres grecques, de la phonétique et des symboles musicaux. L'outil organise plus de 1 000 symboles prêts à être copiés et collés dans des documents, des réseaux sociaux, des présentations et d'autres applications.",

    category_label: "Sélectionnez une catégorie",
    symbols_count: "symboles",
    recently_copied: "Récemment copiés",
    copied_announce: "Symbole copié dans le presse-papiers",
    results_label: "Grille de symboles",

    features_title: "Fonctionnalités",
    f_1: "Variété Complète : Plus de 1 000 symboles catalogués dans 25 catégories, des mathématiques aux icônes décoratives.",
    f_2: "Historique Automatique : Vos symboles préférés sont enregistrés localement dans votre navigateur pour un accès instantané lors de vos prochaines visites.",
    f_3: "Compatibilité Universelle : Symboles Unicode natifs, garantissant qu'ils fonctionnent parfaitement sur n'importe quel système, réseau social ou document.",

    use_cases_title: "Où utiliser les symboles Unicode",
    uc_1_title: "Documents et textes académiques",
    uc_1_desc: "Les symboles mathématiques (∑ ∫ √ ≈), les lettres grecques (α β γ) et les fractions (½ ¾) sont indispensables dans les articles scientifiques, les formules et les rapports techniques. Collez-les directement dans n'importe quel éditeur de texte.",
    uc_2_title: "Réseaux sociaux et biographies de profil",
    uc_2_desc: "Utilisez des flèches, des étoiles, des cœurs et des symboles décoratifs pour faire ressortir votre biographie sur Instagram, TikTok ou Twitter. Les symboles Unicode se collent correctement sur toutes les applications mobiles et web.",
    uc_3_title: "Présentations et design",
    uc_3_desc: "Les caractères de dessin de boîtes (─ │ ╔ ╗) créent des structures visuelles dans les diapositives et les documents. Les symboles d'avertissement (⚠ ⚡) et techniques (⚙ ✂) communiquent des informations de manière claire et visuelle.",
    uc_4_title: "Programmation et markdown",
    uc_4_desc: "Les symboles de comparaison (≤ ≥ ≠), les opérateurs mathématiques et les signes de ponctuation typographique (— … «») améliorent les commentaires de code, la documentation technique et les fichiers README.",

    how_it_works_title: "Comment utiliser",
    hiw_1_title: "Choisissez une catégorie",
    hiw_1_desc: "Sélectionnez la catégorie souhaitée dans le menu déroulant.",
    hiw_2_title: "Cliquez sur le symbole pour copier",
    hiw_2_desc: "Un simple clic sur n'importe quel symbole le copie automatiquement dans votre presse-papiers.",
    hiw_3_title: "Collez où vous voulez",
    hiw_3_desc: "Avec le symbole copié, collez-le n'importe où : Word, Google Docs, WhatsApp, Instagram, e-mail, code ou terminal.",

    categories_title: "Catégories de symboles disponibles",
    categories_intro: "Les symboles sont organisés en 25 catégories pour faciliter la navigation :",

    cat0: "Flèches",
    cat0_d: "Flèches dans toutes les directions et tous les styles pour la navigation, les organigrammes et les diagrammes.",
    cat1: "Formes Géométriques",
    cat1_d: "Carrés, triangles, cercles et autres formes pour le design et la représentation visuelle.",
    cat2: "Étoiles et Décoratifs",
    cat2_d: "Étoiles, fioritures et ornements décoratifs pour mettre en valeur les textes et les designs.",
    cat3: "Cœurs",
    cat3_d: "Variations de cœurs pour exprimer l'affection dans les messages et les publications.",
    cat4: "Mathématiques",
    cat4_d: "Opérateurs, intégrales, racines et symboles essentiels pour la notation mathématique.",
    cat5: "Comparaison",
    cat5_d: "Signes d'égalité, d'inégalité et de relation d'ordre pour les équations et la logique.",
    cat6: "Fractions",
    cat6_d: "Fractions Unicode prêtes à l'emploi dans du texte sans formatage spécial.",
    cat7: "Numérique",
    cat7_d: "Nombres entourés, indices et exposants pour les listes et la notation technique.",
    cat8: "Devises",
    cat8_d: "Symboles monétaires du monde entier pour les documents financiers et les prix.",
    cat9: "Ponctuation et Typographie",
    cat9_d: "Tirets, points de suspension, guillemets spéciaux et signes typographiques pour une écriture professionnelle.",
    cat10: "Droits et Marques",
    cat10_d: "Copyright, marque déposée, brevet et symboles légaux pour les documents officiels.",
    cat11: "Lettres Grecques",
    cat11_d: "Alphabet grec complet (majuscules et minuscules) pour les mathématiques, la physique et les sciences.",
    cat12: "Phonétique",
    cat12_d: "Symboles de l'Alphabet Phonétique International (API) pour la linguistique et la prononciation.",
    cat13: "Musique et Médias",
    cat13_d: "Notes de musique et symboles de lecture pour le contenu lié à la musique.",
    cat14: "Groupement",
    cat14_d: "Parenthèses, crochets, accolades et délimiteurs spéciaux pour le code et les mathématiques.",
    cat15: "Lignes et Bordures",
    cat15_d: "Caractères de dessin de boîtes pour créer des tableaux, bordures et structures visuelles en texte brut.",
    cat16: "Unités et Mesures",
    cat16_d: "Degrés, température, unités de mesure et symboles scientifiques normalisés.",
    cat17: "Personnes et Genre",
    cat17_d: "Symboles de genre, d'identité et expressions faciales de base.",
    cat18: "Jeux",
    cat18_d: "Pièces d'échecs, cartes à jouer et dés pour les jeux et les passe-temps.",
    cat19: "Religieux et Spirituel",
    cat19_d: "Symboles religieux et spirituels de diverses traditions et cultures.",
    cat20: "Technique et Avertissements",
    cat20_d: "Icônes d'avertissement, outils et symboles techniques pour la signalisation et la communication.",
    cat21: "Symboles Japonais",
    cat21_d: "Caractères et symboles du système d'écriture japonais pour le contenu multilingue.",
    cat22: "Astérisques et Ornements",
    cat22_d: "Variations d'astérisques et ornements typographiques pour les notes et la décoration.",
    cat23: "Zodiaque et Astrologie",
    cat23_d: "Signes du zodiaque et symboles planétaires pour l'astrologie et l'astronomie.",
    cat24: "Divers",
    cat24_d: "Divers symboles météorologiques, d'objets et d'icônes à usage général.",

    unicode_title: "Pourquoi les symboles Unicode fonctionnent sur n'importe quelle plateforme",
    unicode_p1: "Les symboles Unicode sont des caractères de texte normalisés, pas des images. Cela signifie qu'ils fonctionnent sur n'importe quel appareil, système d'exploitation ou application prenant en charge le texte : d'Android à l'iPhone, de Windows à Mac, de Word à Google Docs, d'Instagram à Discord. Lorsque vous copiez un symbole ici et le collez ailleurs, le résultat est toujours compatible.",
    unicode_p2: "L'apparence visuelle peut varier légèrement selon les plates-formes et les polices, mais le caractère lui-même est universel. Des symboles tels que ∑, →, ♥ et € sont reconnus mondialement et rendus correctement dans presque tous les contextes modernes.",

    faq_title: "Questions et Réponses",
    faq_1_q: "Comment copier et coller des symboles spéciaux sur l'ordinateur ?",
    faq_1_a: "Accédez à cette page, sélectionnez la catégorie souhaitée et cliquez sur n'importe quel symbole. Il est automatiquement copié dans le presse-papiers. Ensuite, allez dans l'application ou le document souhaité et collez-le. Il n'y a rien à installer.",
    faq_2_q: "Les symboles fonctionnent-ils sur Instagram, WhatsApp et d'autres réseaux sociaux ?",
    faq_2_a: "Oui. Tous les symboles de cet outil sont des caractères Unicode et fonctionnent sur Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord et toute plateforme qui accepte du texte. Il vous suffit de copier et coller directement dans votre biographie, votre légende ou votre message.",
    faq_3_q: "Puis-je utiliser des symboles mathématiques dans Word et Google Docs ?",
    faq_3_a: "Oui. Des symboles comme ∑, ∫, √, ≤, ≥, π et des lettres grecques comme α et β se collent correctement dans Microsoft Word, Google Docs, LibreOffice et n'importe quel éditeur de texte. Pour les textes académiques et scientifiques, c'est le moyen le plus rapide d'insérer une notation mathématique.",
    faq_4_q: "Quelle est la différence entre les symboles Unicode et les caractères spéciaux du clavier ?",
    faq_4_a: "Le clavier standard n'offre qu'une centaine de caractères. Unicode définit plus de 140 000 caractères, y compris des symboles pour toutes les langues, les mathématiques, la musique, les devises, etc. Cet outil vous donne accès à des centaines de ces symboles qui n'existent pas sur un clavier normal.",
    faq_5_q: "Les symboles fonctionnent-ils dans les objets d'e-mails et les titres de newsletters ?",
    faq_5_a: "Oui, avec quelques réserves. Les caractères Unicode simples, tels que ★, →, ✓ et ♥, s'affichent généralement correctement dans la plupart des clients de messagerie modernes.",
    see1: "Sélecteur d'Emojis",
    see2: "Lettres Stylisées",
    see3: "Générateur de Texte",
    see4: "Générateur de Lettres ASCII"
  },
  it: {
    m_title: "Simboli da Copiare e Incollare ★ ♥ → ∑ ← - Frecce, Matematica e Altro",
    title: "Simboli da Copiare e Incollare",
    meta: "Copia e incolla oltre 1.000 simboli Unicode gratis — frecce ←→, matematica ∑√π, cuori ♥, stelle ★, valute €$, frazioni ½¾ e lettere greche. 25 categorie.",
    d1: "Sfoglia 25 categorie che includono frecce, simboli matematici, valute, lettere greche, fonetica e simboli musicali. Lo strumento organizza oltre 1.000 simboli pronti per essere copiati e incollati in documenti, social network, presentazioni e altre app.",

    category_label: "Seleziona una categoria",
    symbols_count: "simboli",
    recently_copied: "Copiati di recente",
    copied_announce: "Simbolo copiato negli appunti",
    results_label: "Griglia dei simboli",

    features_title: "Funzionalità",
    f_1: "Varietà Completa: Oltre 1.000 simboli catalogati in 25 categorie, dalla matematica alle icone decorative.",
    f_2: "Cronologia Automatica: I tuoi simboli preferiti vengono salvati localmente nel tuo browser per un accesso istantaneo alle visite future.",
    f_3: "Compatibilità Universale: Simboli Unicode nativi, assicurando che funzionino perfettamente su qualsiasi sistema, social network o documento.",

    use_cases_title: "Dove utilizzare i simboli Unicode",
    uc_1_title: "Documenti e testi accademici",
    uc_1_desc: "Simboli matematici (∑ ∫ √ ≈), lettere greche (α β γ) e frazioni (½ ¾) sono indispensabili in articoli scientifici, formule e relazioni tecniche. Incolla direttamente in qualsiasi editor di testo.",
    uc_2_title: "Social media e biografie dei profili",
    uc_2_desc: "Usa frecce, stelle, cuori e simboli decorativi per far risaltare la tua biografia su Instagram, TikTok o Twitter. I simboli Unicode si incollano correttamente su tutte le app mobili e web.",
    uc_3_title: "Presentazioni e design",
    uc_3_desc: "I caratteri di disegno delle caselle (─ │ ╔ ╗) creano strutture visive in diapositive e documenti. I simboli di avviso (⚠ ⚡) e tecnici (⚙ ✂) comunicano le informazioni in modo chiaro e visivo.",
    uc_4_title: "Programmazione e markdown",
    uc_4_desc: "I simboli di confronto (≤ ≥ ≠), gli operatori matematici e i segni di punteggiatura tipografica (— … «») migliorano i commenti al codice, la documentazione tecnica e i file README.",

    how_it_works_title: "Come usare",
    hiw_1_title: "Scegli una categoria",
    hiw_1_desc: "Seleziona la categoria desiderata dal menu a tendina.",
    hiw_2_title: "Clicca sul simbolo per copiare",
    hiw_2_desc: "Un singolo clic su qualsiasi simbolo lo copia automaticamente negli appunti.",
    hiw_3_title: "Incolla dove vuoi",
    hiw_3_desc: "Con il simbolo copiato, incollalo ovunque: Word, Google Docs, WhatsApp, Instagram, e-mail, codice o terminale.",

    categories_title: "Categorie di simboli disponibili",
    categories_intro: "I simboli sono organizzati in 25 categorie per una facile navigazione:",

    cat0: "Frecce",
    cat0_d: "Frecce in tutte le direzioni e stili per navigazione, diagrammi di flusso e schemi.",
    cat1: "Forme Geometriche",
    cat1_d: "Quadrati, triangoli, cerchi e altre forme per il design e la rappresentazione visiva.",
    cat2: "Stelle e Decorativi",
    cat2_d: "Stelle, ghirigori e ornamenti decorativi per evidenziare testi e design.",
    cat3: "Cuori",
    cat3_d: "Variazioni di cuori per esprimere affetto in messaggi e post.",
    cat4: "Matematica",
    cat4_d: "Operatori, integrali, radici e simboli essenziali per la notazione matematica.",
    cat5: "Confronto",
    cat5_d: "Segni di uguaglianza, disuguaglianza e relazioni d'ordine per equazioni e logica.",
    cat6: "Frazioni",
    cat6_d: "Frazioni Unicode pronte all'uso nel testo senza formattazione speciale.",
    cat7: "Numerico",
    cat7_d: "Numeri cerchiati, pedici e apici per elenchi e notazione tecnica.",
    cat8: "Valute",
    cat8_d: "Simboli di valuta da tutto il mondo per documenti finanziari e prezzi.",
    cat9: "Punteggiatura e Tipografia",
    cat9_d: "Trattini, ellissi, virgolette speciali e segni tipografici per la scrittura professionale.",
    cat10: "Diritti e Marchi",
    cat10_d: "Copyright, marchio registrato, brevetto e simboli legali per documenti ufficiali.",
    cat11: "Lettere Greche",
    cat11_d: "Alfabeto greco completo (maiuscolo e minuscolo) per matematica, fisica e scienze.",
    cat12: "Fonetica",
    cat12_d: "Simboli dell'Alfabeto Fonetico Internazionale (AFI) per linguistica e pronuncia.",
    cat13: "Musica e Media",
    cat13_d: "Note musicali e simboli di riproduzione per contenuti relativi alla musica.",
    cat14: "Raggruppamento",
    cat14_d: "Parentesi, parentesi quadre, parentesi graffe e delimitatori speciali per codice e matematica.",
    cat15: "Linee e Bordi",
    cat15_d: "Caratteri di disegno delle caselle per creare tabelle, bordi e strutture visive in testo normale.",
    cat16: "Unità e Misure",
    cat16_d: "Gradi, temperatura, unità di misura e simboli scientifici standardizzati.",
    cat17: "Persone e Genere",
    cat17_d: "Simboli di genere, identità ed espressioni facciali di base.",
    cat18: "Giochi",
    cat18_d: "Pezzi degli scacchi, carte da gioco e dadi per giochi e passatempi.",
    cat19: "Religioso e Spirituale",
    cat19_d: "Simboli religiosi e spirituali di varie tradizioni e culture.",
    cat20: "Tecnico e Avvertenze",
    cat20_d: "Icone di avviso, strumenti e simboli tecnici per segnaletica e comunicazione.",
    cat21: "Simboli Giapponesi",
    cat21_d: "Caratteri e simboli del sistema di scrittura giapponese per contenuti multilingue.",
    cat22: "Asterischi e Ornamenti",
    cat22_d: "Variazioni di asterischi e ornamenti tipografici per note e decorazioni.",
    cat23: "Zodiaco e Astrologia",
    cat23_d: "Segni zodiacali e simboli planetari per astrologia e astronomia.",
    cat24: "Varie",
    cat24_d: "Vari simboli meteorologici, oggetti e icone di uso generale.",

    unicode_title: "Perché i simboli Unicode funzionano su qualsiasi piattaforma",
    unicode_p1: "I simboli Unicode sono caratteri di testo standardizzati, non immagini. Ciò significa che funzionano su qualsiasi dispositivo, sistema operativo o app che supporti il testo: da Android a iPhone, da Windows a Mac, da Word a Google Docs, da Instagram a Discord. Quando copi un simbolo qui e lo incolli altrove, il risultato è sempre compatibile.",
    unicode_p2: "L'aspetto visivo può variare leggermente a seconda delle piattaforme e dei caratteri, ma il carattere in sé è universale. Simboli come ∑, →, ♥ ed € sono riconosciuti a livello globale e resi correttamente in quasi tutti i contesti moderni.",

    faq_title: "Domande e Risposte",
    faq_1_q: "Come copiare e incollare simboli speciali sul computer?",
    faq_1_a: "Accedi a questa pagina, seleziona la categoria desiderata e fai clic su qualsiasi simbolo. Viene copiato automaticamente negli appunti. Quindi, vai all'app o al documento desiderato e incollalo. Non c'è bisogno di installare nulla.",
    faq_2_q: "I simboli funzionano su Instagram, WhatsApp e altri social network?",
    faq_2_a: "Sì. Tutti i simboli in questo strumento sono caratteri Unicode e funzionano su Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord e qualsiasi piattaforma che accetti testo. Basta copiare e incollare direttamente nella tua biografia, didascalia o messaggio.",
    faq_3_q: "Posso usare simboli matematici in Word e Google Docs?",
    faq_3_a: "Sì. Simboli come ∑, ∫, √, ≤, ≥, π e lettere greche come α e β si incollano correttamente in Microsoft Word, Google Docs, LibreOffice e qualsiasi editor di testo. Per i testi accademici e scientifici, questo è il modo più rapido per inserire la notazione matematica.",
    faq_4_q: "Qual è la differenza tra i simboli Unicode e i caratteri speciali della tastiera?",
    faq_4_a: "La tastiera standard offre solo circa 100 caratteri. Unicode definisce oltre 140.000 caratteri, inclusi simboli per tutte le lingue, matematica, musica, valute e altro ancora. Questo strumento ti dà accesso a centinaia di questi simboli che non esistono su una normale tastiera.",
    faq_5_q: "I simboli funzionano negli oggetti delle e-mail e nei titoli delle newsletter?",
    faq_5_a: "Sì, con alcune avvertenze. Semplici caratteri Unicode, come ★, →, ✓ e ♥, vengono generalmente visualizzati correttamente nella maggior parte dei moderni client di posta elettronica.",
    see1: "Selettore di Emoji",
    see2: "Lettere Diverse",
    see3: "Generatore di Testo",
    see4: "Generatore di Lettere ASCII"
  },
  id: {
    m_title: "Simbol untuk Disalin dan Ditempel ★ ♥ → ∑ ← - Panah, Matematika & Lainnya",
    title: "Simbol untuk Disalin dan Ditempel",
    meta: "Salin dan tempel lebih dari 1.000 simbol Unicode gratis — panah ←→, matematika ∑√π, hati ♥, bintang ★, mata uang €$, pecahan ½¾ dan huruf Yunani. 25 kategori.",
    d1: "Jelajahi 25 kategori yang mencakup panah, simbol matematika, mata uang, huruf Yunani, fonetik, dan simbol musik. Alat ini mengatur lebih dari 1.000 simbol yang siap disalin dan ditempel ke dokumen, jejaring sosial, presentasi, dan aplikasi lainnya.",

    category_label: "Pilih kategori",
    symbols_count: "simbol",
    recently_copied: "Baru saja disalin",
    copied_announce: "Simbol disalin ke papan klip",
    results_label: "Kisi simbol",

    features_title: "Fitur",
    f_1: "Variasi Komprehensif: Lebih dari 1.000 simbol dikatalogkan dalam 25 kategori, dari matematika hingga ikon dekoratif.",
    f_2: "Riwayat Otomatis: Simbol favorit Anda disimpan secara lokal di browser Anda untuk akses instan pada kunjungan berikutnya.",
    f_3: "Kompatibilitas Universal: Simbol Unicode asli, memastikan mereka berfungsi sempurna di sistem, jejaring sosial, atau dokumen apa pun.",

    use_cases_title: "Tempat menggunakan simbol Unicode",
    uc_1_title: "Dokumen dan teks akademik",
    uc_1_desc: "Simbol matematika (∑ ∫ √ ≈), huruf Yunani (α β γ), dan pecahan (½ ¾) sangat diperlukan dalam makalah ilmiah, rumus, dan laporan teknis. Tempel langsung ke editor teks apa pun.",
    uc_2_title: "Media sosial dan bio profil",
    uc_2_desc: "Gunakan panah, bintang, hati, dan simbol dekoratif untuk membuat bio Anda menonjol di Instagram, TikTok, atau Twitter. Simbol Unicode menempel dengan benar di semua aplikasi seluler dan web.",
    uc_3_title: "Presentasi dan desain",
    uc_3_desc: "Karakter gambar kotak (─ │ ╔ ╗) membuat struktur visual dalam slide dan dokumen. Simbol peringatan (⚠ ⚡) dan teknis (⚙ ✂) mengomunikasikan informasi secara jelas dan visual.",
    uc_4_title: "Pemrograman dan markdown",
    uc_4_desc: "Simbol perbandingan (≤ ≥ ≠), operator matematika, dan tanda baca tipografi (— … «») meningkatkan komentar kode, dokumentasi teknis, dan file README.",

    how_it_works_title: "Cara menggunakan",
    hiw_1_title: "Pilih kategori",
    hiw_1_desc: "Pilih kategori yang diinginkan dari menu tarik-turun.",
    hiw_2_title: "Klik simbol untuk menyalin",
    hiw_2_desc: "Satu klik pada simbol apa pun akan secara otomatis menyalinnya ke papan klip Anda.",
    hiw_3_title: "Tempel di mana pun Anda mau",
    hiw_3_desc: "Dengan simbol yang disalin, tempelkan di mana saja: Word, Google Docs, WhatsApp, Instagram, email, kode, atau terminal.",

    categories_title: "Kategori simbol yang tersedia",
    categories_intro: "Simbol diatur ke dalam 25 kategori untuk navigasi yang mudah:",

    cat0: "Panah",
    cat0_d: "Panah ke segala arah dan gaya untuk navigasi, diagram alur, dan diagram.",
    cat1: "Bentuk Geometris",
    cat1_d: "Persegi, segitiga, lingkaran, dan bentuk lain untuk desain dan representasi visual.",
    cat2: "Bintang dan Dekorasi",
    cat2_d: "Bintang, ornamen, dan dekorasi untuk menyorot teks dan desain.",
    cat3: "Hati",
    cat3_d: "Variasi hati untuk mengungkapkan kasih sayang dalam pesan dan postingan.",
    cat4: "Matematika",
    cat4_d: "Operator, integral, akar, dan simbol penting untuk notasi matematika.",
    cat5: "Perbandingan",
    cat5_d: "Tanda persamaan, ketidaksamaan, dan relasi urutan untuk persamaan dan logika.",
    cat6: "Pecahan",
    cat6_d: "Pecahan Unicode siap digunakan dalam teks tanpa pemformatan khusus.",
    cat7: "Numerik",
    cat7_d: "Angka dalam lingkaran, subskrip, dan superskrip untuk daftar dan notasi teknis.",
    cat8: "Mata Uang",
    cat8_d: "Simbol mata uang dari seluruh dunia untuk dokumen keuangan dan harga.",
    cat9: "Tanda Baca dan Tipografi",
    cat9_d: "Tanda hubung, elipsis, tanda kutip khusus, dan tanda tipografi untuk penulisan profesional.",
    cat10: "Hak dan Merek Dagang",
    cat10_d: "Hak cipta, merek dagang terdaftar, paten, dan simbol hukum untuk dokumen resmi.",
    cat11: "Huruf Yunani",
    cat11_d: "Alfabet Yunani lengkap (huruf besar dan kecil) untuk matematika, fisika, dan sains.",
    cat12: "Fonetik",
    cat12_d: "Simbol Alfabet Fonetik Internasional (IPA) untuk linguistik dan pengucapan.",
    cat13: "Musik dan Media",
    cat13_d: "Nada musik dan simbol pemutaran untuk konten terkait musik.",
    cat14: "Pengelompokan",
    cat14_d: "Tanda kurung, tanda kurung siku, tanda kurung kurawal, dan pembatas khusus untuk kode dan matematika.",
    cat15: "Garis dan Batas",
    cat15_d: "Karakter gambar kotak untuk membuat tabel, batas, dan struktur visual dalam teks biasa.",
    cat16: "Satuan dan Ukuran",
    cat16_d: "Derajat, suhu, satuan ukuran, dan simbol ilmiah standar.",
    cat17: "Orang dan Gender",
    cat17_d: "Simbol gender, identitas, dan ekspresi wajah dasar.",
    cat18: "Permainan",
    cat18_d: "Bidak catur, kartu remi, dan dadu untuk permainan dan hobi.",
    cat19: "Agama dan Spiritual",
    cat19_d: "Simbol agama dan spiritual dari berbagai tradisi dan budaya.",
    cat20: "Teknis dan Peringatan",
    cat20_d: "Ikon peringatan, alat, dan simbol teknis untuk papan tanda dan komunikasi.",
    cat21: "Simbol Jepang",
    cat21_d: "Karakter dan simbol dari sistem tulisan Jepang untuk konten multibahasa.",
    cat22: "Asterisk dan Ornamen",
    cat22_d: "Variasi asterisk dan ornamen tipografi untuk catatan dan dekorasi.",
    cat23: "Zodiak dan Astrologi",
    cat23_d: "Tanda zodiak dan simbol planet untuk astrologi dan astronomi.",
    cat24: "Lain-lain",
    cat24_d: "Berbagai simbol cuaca, objek, dan ikon tujuan umum.",

    unicode_title: "Mengapa simbol Unicode berfungsi di platform apa pun",
    unicode_p1: "Simbol Unicode adalah karakter teks standar, bukan gambar. Ini berarti mereka berfungsi di perangkat, sistem operasi, atau aplikasi apa pun yang mendukung teks: dari Android hingga iPhone, Windows hingga Mac, Word hingga Google Docs, Instagram hingga Discord. Saat Anda menyalin simbol di sini dan menempelkannya di tempat lain, hasilnya selalu kompatibel.",
    unicode_p2: "Penampilan visual mungkin sedikit berbeda di seluruh platform dan font, tetapi karakter itu sendiri bersifat universal. Simbol seperti ∑, →, ♥, dan € dikenali secara global dan ditampilkan dengan benar di hampir semua konteks modern.",

    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Bagaimana cara menyalin dan menempelkan simbol khusus di komputer?",
    faq_1_a: "Akses halaman ini, pilih kategori yang diinginkan, dan klik simbol apa pun. Ini secara otomatis disalin ke papan klip. Kemudian, buka aplikasi atau dokumen yang diinginkan dan tempel. Tidak perlu menginstal apa pun.",
    faq_2_q: "Apakah simbol berfungsi di Instagram, WhatsApp, dan jejaring sosial lainnya?",
    faq_2_a: "Ya. Semua simbol dalam alat ini adalah karakter Unicode dan berfungsi di Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord, dan platform apa pun yang menerima teks. Cukup salin dan tempel langsung ke bio, keterangan, atau pesan Anda.",
    faq_3_q: "Bisakah saya menggunakan simbol matematika di Word dan Google Docs?",
    faq_3_a: "Ya. Simbol seperti ∑, ∫, √, ≤, ≥, π, dan huruf Yunani seperti α dan β menempel dengan benar di Microsoft Word, Google Docs, LibreOffice, dan editor teks apa pun. Untuk teks akademik dan ilmiah, ini adalah cara tercepat untuk memasukkan notasi matematika.",
    faq_4_q: "Apa perbedaan antara simbol Unicode dan karakter keyboard khusus?",
    faq_4_a: "Keyboard standar hanya menawarkan sekitar 100 karakter. Unicode mendefinisikan lebih dari 140.000 karakter, termasuk simbol untuk semua bahasa, matematika, musik, mata uang, dan banyak lagi. Alat ini memberi Anda akses ke ratusan simbol ini yang tidak ada di keyboard biasa.",
    faq_5_q: "Apakah simbol berfungsi di subjek email dan judul buletin?",
    faq_5_a: "Ya, dengan beberapa pengecualian. Karakter Unicode sederhana, seperti ★, →, ✓, dan ♥, biasanya ditampilkan dengan benar di sebagian besar klien email modern.",
    see1: "Pemilih Emoji",
    see2: "Huruf Gaya",
    see3: "Generator Teks",
    see4: "Generator Huruf ASCII"
  },
  de: {
    m_title: "Symbole Kopieren und Einfügen ★ ♥ → ∑ ← - Pfeile, Mathe & Mehr | Kostenlos",
    title: "Symbole zum Kopieren und Einfügen",
    meta: "Über 1.000 Unicode-Symbole kostenlos kopieren und einfügen — Pfeile ←→, Mathematik ∑√π, Herzen ♥, Sterne ★, Währungen €$, Brüche ½¾ und griechische Buchstaben. 25 Kategorien.",
    d1: "Durchsuchen Sie 25 Kategorien mit Pfeilen, mathematischen Symbolen, Währungen, griechischen Buchstaben, Phonetik und musikalischen Symbolen. Das Tool organisiert über 1.000 Symbole, die sofort in Dokumente, soziale Netzwerke, Präsentationen und andere Apps kopiert und eingefügt werden können.",

    category_label: "Kategorie auswählen",
    symbols_count: "Symbole",
    recently_copied: "Kürzlich kopiert",
    copied_announce: "Symbol in die Zwischenablage kopiert",
    results_label: "Symbolraster",

    features_title: "Funktionen",
    f_1: "Umfassende Vielfalt: Über 1.000 Symbole in 25 Kategorien katalogisiert, von Mathematik bis hin zu dekorativen Symbolen.",
    f_2: "Automatischer Verlauf: Ihre Lieblingssymbole werden lokal in Ihrem Browser gespeichert, damit Sie bei zukünftigen Besuchen sofort darauf zugreifen können.",
    f_3: "Universelle Kompatibilität: Native Unicode-Symbole, die sicherstellen, dass sie auf jedem System, in jedem sozialen Netzwerk oder Dokument einwandfrei funktionieren.",

    use_cases_title: "Wo Unicode-Symbole verwendet werden können",
    uc_1_title: "Akademische Dokumente und Texte",
    uc_1_desc: "Mathematische Symbole (∑ ∫ √ ≈), griechische Buchstaben (α β γ) und Brüche (½ ¾) sind in wissenschaftlichen Arbeiten, Formeln und technischen Berichten unverzichtbar. Fügen Sie sie direkt in einen beliebigen Texteditor ein.",
    uc_2_title: "Soziale Medien und Profil-Biografien",
    uc_2_desc: "Verwenden Sie Pfeile, Sterne, Herzen und dekorative Symbole, um Ihre Biografie auf Instagram, TikTok oder Twitter hervorzuheben. Unicode-Symbole lassen sich problemlos in allen mobilen und Web-Apps einfügen.",
    uc_3_title: "Präsentationen und Design",
    uc_3_desc: "Rahmenzeichen (─ │ ╔ ╗) schaffen visuelle Strukturen in Folien und Dokumenten. Warn- (⚠ ⚡) und technische (⚙ ✂) Symbole kommunizieren Informationen klar und visuell.",
    uc_4_title: "Programmierung und Markdown",
    uc_4_desc: "Vergleichssymbole (≤ ≥ ≠), mathematische Operatoren und typografische Satzzeichen (— … «») verbessern Codekommentare, technische Dokumentationen und README-Dateien.",

    how_it_works_title: "Wie man es benutzt",
    hiw_1_title: "Wählen Sie eine Kategorie",
    hiw_1_desc: "Wählen Sie die gewünschte Kategorie aus dem Dropdown-Menü aus.",
    hiw_2_title: "Klicken Sie zum Kopieren auf das Symbol",
    hiw_2_desc: "Ein einziger Klick auf ein beliebiges Symbol kopiert es automatisch in Ihre Zwischenablage.",
    hiw_3_title: "Fügen Sie es überall ein",
    hiw_3_desc: "Fügen Sie das kopierte Symbol überall ein: Word, Google Docs, WhatsApp, Instagram, E-Mail, Code oder Terminal.",

    categories_title: "Verfügbare Symbolkategorien",
    categories_intro: "Die Symbole sind in 25 Kategorien zur einfachen Navigation unterteilt:",

    cat0: "Pfeile",
    cat0_d: "Pfeile in alle Richtungen und Stile für Navigation, Flussdiagramme und Diagramme.",
    cat1: "Geometrische Formen",
    cat1_d: "Quadrate, Dreiecke, Kreise und andere Formen für Design und visuelle Darstellung.",
    cat2: "Sterne und Dekoratives",
    cat2_d: "Sterne, Schnörkel und dekorative Ornamente zum Hervorheben von Texten und Designs.",
    cat3: "Herzen",
    cat3_d: "Herzvariationen zum Ausdruck von Zuneigung in Nachrichten und Beiträgen.",
    cat4: "Mathematik",
    cat4_d: "Operatoren, Integrale, Wurzeln und wesentliche Symbole für die mathematische Notation.",
    cat5: "Vergleich",
    cat5_d: "Gleichheits-, Ungleichheits- und Ordnungsrelationszeichen für Gleichungen und Logik.",
    cat6: "Brüche",
    cat6_d: "Unicode-Brüche zur sofortigen Verwendung in Texten ohne spezielle Formatierung.",
    cat7: "Numerisch",
    cat7_d: "Eingekreiste Zahlen, Tief- und Hochstellungen für Listen und technische Notationen.",
    cat8: "Währungen",
    cat8_d: "Währungssymbole aus aller Welt für Finanzdokumente und Preise.",
    cat9: "Zeichensetzung und Typografie",
    cat9_d: "Gedankenstriche, Auslassungspunkte, spezielle Anführungszeichen und typografische Zeichen für professionelles Schreiben.",
    cat10: "Rechte und Marken",
    cat10_d: "Copyright, eingetragenes Warenzeichen, Patent und rechtliche Symbole für offizielle Dokumente.",
    cat11: "Griechische Buchstaben",
    cat11_d: "Komplettes griechisches Alphabet (Groß- und Kleinbuchstaben) für Mathematik, Physik und Wissenschaft.",
    cat12: "Phonetik",
    cat12_d: "Symbole des Internationalen Phonetischen Alphabets (IPA) für Sprachwissenschaft und Aussprache.",
    cat13: "Musik und Medien",
    cat13_d: "Noten und Wiedergabesymbole für musikbezogene Inhalte.",
    cat14: "Gruppierung",
    cat14_d: "Klammern, eckige Klammern, geschweifte Klammern und spezielle Begrenzer für Code und Mathematik.",
    cat15: "Linien und Rahmen",
    cat15_d: "Rahmenzeichen zum Erstellen von Tabellen, Rahmen und visuellen Strukturen in einfachem Text.",
    cat16: "Einheiten und Maße",
    cat16_d: "Grad, Temperatur, Maßeinheiten und standardisierte wissenschaftliche Symbole.",
    cat17: "Menschen und Geschlecht",
    cat17_d: "Geschlechtssymbole, Identität und grundlegende Gesichtsausdrücke.",
    cat18: "Spiele",
    cat18_d: "Schachfiguren, Spielkarten und Würfel für Spiele und Hobbys.",
    cat19: "Religiös und Spirituell",
    cat19_d: "Religiöse und spirituelle Symbole aus verschiedenen Traditionen und Kulturen.",
    cat20: "Technik und Warnungen",
    cat20_d: "Warnsymbole, Werkzeuge und technische Symbole für Beschilderung und Kommunikation.",
    cat21: "Japanische Symbole",
    cat21_d: "Zeichen und Symbole aus dem japanischen Schriftsystem für mehrsprachige Inhalte.",
    cat22: "Sternchen und Ornamente",
    cat22_d: "Sternchenvariationen und typografische Ornamente für Notizen und Dekorationen.",
    cat23: "Tierkreis und Astrologie",
    cat23_d: "Sternzeichen und Planetensymbole für Astrologie und Astronomie.",
    cat24: "Verschiedenes",
    cat24_d: "Verschiedene Wetter-, Objekt- und allgemeine Symbole.",

    unicode_title: "Warum Unicode-Symbole auf jeder Plattform funktionieren",
    unicode_p1: "Unicode-Symbole sind standardisierte Textzeichen, keine Bilder. Das bedeutet, dass sie auf jedem Gerät, Betriebssystem oder jeder App funktionieren, die Text unterstützt: von Android bis iPhone, Windows bis Mac, Word bis Google Docs, Instagram bis Discord. Wenn Sie hier ein Symbol kopieren und an einer anderen Stelle einfügen, ist das Ergebnis immer kompatibel.",
    unicode_p2: "Das visuelle Erscheinungsbild kann je nach Plattform und Schriftart leicht variieren, aber das Zeichen selbst ist universell. Symbole wie ∑, →, ♥ und € werden weltweit anerkannt und in fast allen modernen Kontexten korrekt dargestellt.",

    faq_title: "Fragen und Antworten",
    faq_1_q: "Wie kopiere ich Sonderzeichen auf dem Computer und füge sie ein?",
    faq_1_a: "Rufen Sie diese Seite auf, wählen Sie die gewünschte Kategorie und klicken Sie auf ein beliebiges Symbol. Es wird automatisch in die Zwischenablage kopiert. Gehen Sie dann zur gewünschten App oder zum gewünschten Dokument und fügen Sie es ein. Es muss nichts installiert werden.",
    faq_2_q: "Funktionieren die Symbole auf Instagram, WhatsApp und anderen sozialen Netzwerken?",
    faq_2_a: "Ja. Alle Symbole in diesem Tool sind Unicode-Zeichen und funktionieren auf Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord und jeder Plattform, die Text akzeptiert. Kopieren Sie sie einfach und fügen Sie sie direkt in Ihre Biografie, Bildunterschrift oder Nachricht ein.",
    faq_3_q: "Kann ich mathematische Symbole in Word und Google Docs verwenden?",
    faq_3_a: "Ja. Symbole wie ∑, ∫, √, ≤, ≥, π und griechische Buchstaben wie α und β können problemlos in Microsoft Word, Google Docs, LibreOffice und jedem anderen Texteditor eingefügt werden. Für akademische und wissenschaftliche Texte ist dies der schnellste Weg, mathematische Notationen einzufügen.",
    faq_4_q: "Was ist der Unterschied zwischen Unicode-Symbolen und Sonderzeichen auf der Tastatur?",
    faq_4_a: "Die Standardtastatur bietet nur etwa 100 Zeichen. Unicode definiert über 140.000 Zeichen, einschließlich Symbolen für alle Sprachen, Mathematik, Musik, Währungen und mehr. Dieses Tool bietet Ihnen Zugriff auf Hunderte dieser Symbole, die auf einer normalen Tastatur nicht vorhanden sind.",
    faq_5_q: "Funktionieren Symbole in E-Mail-Betreffen und Newsletter-Titeln?",
    faq_5_a: "Ja, mit einigen Ausnahmen. Einfache Unicode-Zeichen wie ★, →, ✓ und ♥ werden in den meisten modernen E-Mail-Clients normalerweise korrekt angezeigt.",
    see1: "Emoji-Auswahl",
    see2: "Schriftarten-Generator",
    see3: "Text-Generator",
    see4: "ASCII-Buchstaben-Generator"
  },
  nl: {
    m_title: "Symbolen Kopiëren en Plakken ★ ♥ → ∑ ← - Pijlen, Wiskunde & Meer",
    title: "Symbolen om te kopiëren en plakken",
    meta: "Kopieer en plak meer dan 1.000 Unicode-symbolen gratis — pijlen ←→, wiskunde ∑√π, harten ♥, sterren ★, valuta €$, breuken ½¾ en Griekse letters. 25 categorieën.",
    d1: "Blader door 25 categorieën met pijlen, wiskundige symbolen, valuta's, Griekse letters, fonetiek en muzikale symbolen. De tool organiseert meer dan 1.000 symbolen die klaar zijn om te worden gekopieerd en geplakt in documenten, sociale netwerken, presentaties en andere apps.",

    category_label: "Selecteer een categorie",
    symbols_count: "symbolen",
    recently_copied: "Recent gekopieerd",
    copied_announce: "Symbool naar klembord gekopieerd",
    results_label: "Symboolraster",

    features_title: "Functies",
    f_1: "Uitgebreide variëteit: Meer dan 1.000 symbolen gecatalogiseerd in 25 categorieën, van wiskunde tot decoratieve pictogrammen.",
    f_2: "Automatische geschiedenis: Uw favoriete symbolen worden lokaal in uw browser opgeslagen voor directe toegang bij toekomstige bezoeken.",
    f_3: "Universele compatibiliteit: Native Unicode-symbolen, zodat ze perfect werken op elk systeem, sociaal netwerk of document.",

    use_cases_title: "Waar Unicode-symbolen te gebruiken",
    uc_1_title: "Academische documenten en teksten",
    uc_1_desc: "Wiskundige symbolen (∑ ∫ √ ≈), Griekse letters (α β γ) en breuken (½ ¾) zijn onmisbaar in wetenschappelijke artikelen, formules en technische rapporten. Plak ze direct in elke teksteditor.",
    uc_2_title: "Sociale media en profielbiografieën",
    uc_2_desc: "Gebruik pijlen, sterren, harten en decoratieve symbolen om uw biografie te laten opvallen op Instagram, TikTok of Twitter. Unicode-symbolen worden correct geplakt in alle mobiele en web-apps.",
    uc_3_title: "Presentaties en ontwerp",
    uc_3_desc: "Kadertekens (─ │ ╔ ╗) creëren visuele structuren in dia's en documenten. Waarschuwings- (⚠ ⚡) en technische (⚙ ✂) symbolen communiceren informatie duidelijk en visueel.",
    uc_4_title: "Programmering en markdown",
    uc_4_desc: "Vergelijkingssymbolen (≤ ≥ ≠), wiskundige operatoren en typografische leestekens (— … «») verbeteren codecommentaar, technische documentatie en README-bestanden.",

    how_it_works_title: "Hoe te gebruiken",
    hiw_1_title: "Kies een categorie",
    hiw_1_desc: "Selecteer de gewenste categorie in het vervolgkeuzemenu.",
    hiw_2_title: "Klik op het symbool om te kopiëren",
    hiw_2_desc: "Een enkele klik op een symbool kopieert het automatisch naar uw klembord.",
    hiw_3_title: "Plak waar u maar wilt",
    hiw_3_desc: "Met het gekopieerde symbool kunt u het overal plakken: Word, Google Docs, WhatsApp, Instagram, e-mail, code of terminal.",

    categories_title: "Beschikbare symboolcategorieën",
    categories_intro: "De symbolen zijn onderverdeeld in 25 categorieën voor eenvoudige navigatie:",

    cat0: "Pijlen",
    cat0_d: "Pijlen in alle richtingen en stijlen voor navigatie, stroomdiagrammen en diagrammen.",
    cat1: "Geometrische Vormen",
    cat1_d: "Vierkanten, driehoeken, cirkels en andere vormen voor ontwerp en visuele representatie.",
    cat2: "Sterren en Decoratief",
    cat2_d: "Sterren, krullen en decoratieve ornamenten om tekst en ontwerpen te markeren.",
    cat3: "Harten",
    cat3_d: "Hartvariaties om genegenheid uit te drukken in berichten en berichten.",
    cat4: "Wiskunde",
    cat4_d: "Operatoren, integralen, wortels en essentiële symbolen voor wiskundige notatie.",
    cat5: "Vergelijking",
    cat5_d: "Gelijkheids-, ongelijkheids- en orderelatortekens voor vergelijkingen en logica.",
    cat6: "Breuken",
    cat6_d: "Unicode-breuken klaar voor gebruik in tekst zonder speciale opmaak.",
    cat7: "Numeriek",
    cat7_d: "Omcirkelde nummers, subscripts en superscripts voor lijsten en technische notatie.",
    cat8: "Valuta's",
    cat8_d: "Valutasymbolen van over de hele wereld voor financiële documenten en prijzen.",
    cat9: "Leestekens en Typografie",
    cat9_d: "Streepjes, weglatingstekens, speciale aanhalingstekens en typografische tekens voor professioneel schrijven.",
    cat10: "Rechten en Merken",
    cat10_d: "Copyright, gedeponeerd handelsmerk, patent en juridische symbolen voor officiële documenten.",
    cat11: "Griekse Letters",
    cat11_d: "Volledig Grieks alfabet (hoofdletters en kleine letters) voor wiskunde, natuurkunde en wetenschap.",
    cat12: "Fonetisch",
    cat12_d: "Internationaal Fonetisch Alfabet (IPA) symbolen voor linguïstiek en uitspraak.",
    cat13: "Muziek en Media",
    cat13_d: "Muzieknoten en afspeelsymbolen voor muziekgerelateerde inhoud.",
    cat14: "Groepering",
    cat14_d: "Haakjes, vierkante haakjes, accolades en speciale scheidingstekens voor code en wiskunde.",
    cat15: "Lijnen en Randen",
    cat15_d: "Kadertekens om tabellen, randen en visuele structuren in platte tekst te maken.",
    cat16: "Eenheden en Metingen",
    cat16_d: "Graden, temperatuur, meeteenheden en gestandaardiseerde wetenschappelijke symbolen.",
    cat17: "Mensen en Geslacht",
    cat17_d: "Geslachtssymbolen, identiteit en basisgezichtsuitdrukkingen.",
    cat18: "Spellen",
    cat18_d: "Schaakstukken, speelkaarten en dobbelstenen voor spellen en hobby's.",
    cat19: "Religieus en Spiritueel",
    cat19_d: "Religieuze en spirituele symbolen uit verschillende tradities en culturen.",
    cat20: "Technisch en Waarschuwingen",
    cat20_d: "Waarschuwingspictogrammen, gereedschappen en technische symbolen voor bewegwijzering en communicatie.",
    cat21: "Japanse Symbolen",
    cat21_d: "Tekens en symbolen uit het Japanse schrijfsysteem voor meertalige inhoud.",
    cat22: "Asterisken en Ornamenten",
    cat22_d: "Asteriskvariaties en typografische ornamenten voor notities en decoratie.",
    cat23: "Dierenriem en Astrologie",
    cat23_d: "Sterrenbeelden en planetaire symbolen voor astrologie en astronomie.",
    cat24: "Diversen",
    cat24_d: "Verschillende weer-, object- en algemene doelsymbolen.",

    unicode_title: "Waarom Unicode-symbolen op elk platform werken",
    unicode_p1: "Unicode-symbolen zijn gestandaardiseerde teksttekens, geen afbeeldingen. Dit betekent dat ze werken op elk apparaat, besturingssysteem of app die tekst ondersteunt: van Android tot iPhone, Windows tot Mac, Word tot Google Docs, Instagram tot Discord. Wanneer u hier een symbool kopieert en ergens anders plakt, is het resultaat altijd compatibel.",
    unicode_p2: "Het visuele uiterlijk kan enigszins variëren tussen platforms en lettertypen, maar het teken zelf is universeel. Symbolen zoals ∑, →, ♥ en € worden wereldwijd herkend en correct weergegeven in vrijwel alle moderne contexten.",

    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Hoe speciale symbolen op de computer kopiëren en plakken?",
    faq_1_a: "Ga naar deze pagina, selecteer de gewenste categorie en klik op een symbool. Het wordt automatisch naar het klembord gekopieerd. Ga vervolgens naar de gewenste app of document en plak het. U hoeft niets te installeren.",
    faq_2_q: "Werken de symbolen op Instagram, WhatsApp en andere sociale netwerken?",
    faq_2_a: "Ja. Alle symbolen in deze tool zijn Unicode-tekens en werken op Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord en elk platform dat tekst accepteert. Kopieer en plak gewoon rechtstreeks in uw bio, bijschrift of bericht.",
    faq_3_q: "Kan ik wiskundige symbolen gebruiken in Word en Google Docs?",
    faq_3_a: "Ja. Symbolen zoals ∑, ∫, √, ≤, ≥, π en Griekse letters zoals α en β worden correct geplakt in Microsoft Word, Google Docs, LibreOffice en elke teksteditor. Voor academische en wetenschappelijke teksten is dit de snelste manier om wiskundige notatie in te voegen.",
    faq_4_q: "Wat is het verschil tussen Unicode-symbolen en speciale toetsenbordtekens?",
    faq_4_a: "Het standaardtoetsenbord biedt slechts ongeveer 100 tekens. Unicode definieert meer dan 140.000 tekens, inclusief symbolen voor alle talen, wiskunde, muziek, valuta's en meer. Deze tool geeft u toegang tot honderden van deze symbolen die niet bestaan op een normaal toetsenbord.",
    faq_5_q: "Werken symbolen in e-mailonderwerpen en nieuwsbrieftitels?",
    faq_5_a: "Ja, met enkele kanttekeningen. Eenvoudige Unicode-tekens, zoals ★, →, ✓ en ♥, worden over het algemeen correct weergegeven in de meeste moderne e-mailclients.",
    see1: "Emoji-Kiezer",
    see2: "Mooie Letters",
    see3: "Tekstgenerator",
    see4: "ASCII-lettergenerator"
  },
  ru: {
    m_title: "Символы для Копирования и Вставки ★ ♥ → ∑ ← - Стрелки, Математика и Многое Другое",
    title: "Символы для Копирования и Вставки",
    meta: "Копируйте и вставляйте более 1000 бесплатных символов Unicode — стрелки ←→, математику ∑√π, сердца ♥, звезды ★, валюты €$, дроби ½¾ и греческие буквы. 25 категорий.",
    d1: "Изучите 25 категорий, включающих стрелки, математические символы, валюты, греческие буквы, фонетику и музыкальные знаки. Инструмент систематизирует более 1000 символов, готовых для копирования и вставки в документы, социальные сети, презентации и другие приложения.",
    category_label: "Выберите категорию",
    symbols_count: "символов",
    recently_copied: "Недавно скопированные",
    copied_announce: "Символ скопирован в буфер обмена",
    results_label: "Сетка символов",
    features_title: "Возможности",
    f_1: "Широкий выбор: Более 1000 символов, распределенных по 25 категориям, от математики до декоративных значков.",
    f_2: "Автоматическое сохранение: Ваши любимые символы сохраняются локально в браузере для быстрого доступа при следующих визитах.",
    f_3: "Универсальная совместимость: Символы в нативном формате Unicode, гарантирующем корректную работу в любых системах, социальных сетях и документах.",
    use_cases_title: "Где использовать символы Unicode",
    uc_1_title: "Документы и академические тексты",
    uc_1_desc: "Математические символы (∑ ∫ √ ≈), греческие буквы (α β γ) и дроби (½ ¾) незаменимы в научных статьях, формулах и технических отчетах. Вставляйте их прямо в любой текстовый редактор.",
    uc_2_title: "Социальные сети и описание профиля",
    uc_2_desc: "Используйте стрелки, звезды, сердца и декоративные элементы, чтобы выделить свою био в Instagram, TikTok или Twitter. Символы Unicode корректно отображаются во всех мобильных и веб-приложениях.",
    uc_3_title: "Презентации и дизайн",
    uc_3_desc: "Символы псевдографики (─ │ ╔ ╗) помогают создавать визуальные структуры в слайдах и документах. Предупреждающие (⚠ ⚡) и технические (⚙ ✂) символы делают информацию нагляднее.",
    uc_4_title: "Программирование и markdown",
    uc_4_desc: "Символы сравнения (≤ ≥ ≠), математические операторы и знаки типографики (— … «») улучшают комментарии к коду, техническую документацию и файлы README.",
    how_it_works_title: "Как пользоваться",
    hiw_1_title: "Выберите категорию",
    hiw_1_desc: "Выберите нужную категорию в раскрывающемся меню.",
    hiw_2_title: "Кликните на символ, чтобы скопировать",
    hiw_2_desc: "Один клик на любой символ автоматически копирует его в буфер обмена.",
    hiw_3_title: "Вставьте куда угодно",
    hiw_3_desc: "Вставьте скопированный символ в нужное место: Word, Google Docs, WhatsApp, Instagram, электронное письмо, код или терминал.",
    categories_title: "Доступные категории символов",
    categories_intro: "Символы распределены по 25 категориям для удобства навигации:",
    cat0: "Стрелки",
    cat0_d: "Стрелки во всех направлениях и стилях для навигации, блок-схем и диаграмм.",
    cat1: "Геометрические фигуры",
    cat1_d: "Квадраты, треугольники, круги и другие фигуры для дизайна и визуального представления.",
    cat2: "Звезды и декор",
    cat2_d: "Звезды, завитки и декоративные орнаменты для выделения текста и дизайна.",
    cat3: "Сердца",
    cat3_d: "Различные варианты сердец для выражения чувств в сообщениях и публикациях.",
    cat4: "Математика",
    cat4_d: "Операторы, интегралы, корни и ключевые символы для математической нотации.",
    cat5: "Сравнение",
    cat5_d: "Знаки равенства, неравенства и отношения порядка для уравнений и логики.",
    cat6: "Дроби",
    cat6_d: "Дроби Unicode, готовые к использованию в тексте без необходимости специального форматирования.",
    cat7: "Числа",
    cat7_d: "Числа в кружках, подстрочные и надстрочные знаки для списков и технических записей.",
    cat8: "Валюты",
    cat8_d: "Символы валют со всего мира для финансовых документов и прайс-листов.",
    cat9: "Знаки препинания и типографика",
    cat9_d: "Тире, многоточия, специальные кавычки и типографские знаки для профессионального письма.",
    cat10: "Права и торговые марки",
    cat10_d: "Символы копирайта, зарегистрированной торговой марки, патента и юридические знаки для официальных документов.",
    cat11: "Греческие буквы",
    cat11_d: "Полный греческий алфавит (прописные и строчные буквы) для математики, физики и науки.",
    cat12: "Фонетика",
    cat12_d: "Символы Международного фонетического алфавита (МФА) для лингвистики и произношения.",
    cat13: "Музыка и медиа",
    cat13_d: "Музыкальные ноты и символы воспроизведения для контента, связанного с музыкой.",
    cat14: "Группировка",
    cat14_d: "Круглые, квадратные, фигурные скобки и специальные разделители для кода и математики.",
    cat15: "Линии и рамки",
    cat15_d: "Символы псевдографики для создания таблиц, рамок и визуальных структур в простом тексте.",
    cat16: "Единицы измерения",
    cat16_d: "Градусы, температура, единицы измерения и стандартизированные научные символы.",
    cat17: "Люди и гендер",
    cat17_d: "Символы гендера, идентичности и базовые смайлы.",
    cat18: "Игры",
    cat18_d: "Шахматные фигуры, игральные карты и кости для игр и хобби.",
    cat19: "Религия и духовность",
    cat19_d: "Религиозные и духовные символы различных традиций и культур.",
    cat20: "Техника и предупреждения",
    cat20_d: "Значки предупреждений, инструменты и технические символы для сигнализации и коммуникации.",
    cat21: "Японские символы",
    cat21_d: "Иероглифы и символы японской письменности для многоязычного контента.",
    cat22: "Звездочки и орнаменты",
    cat22_d: "Различные варианты звездочек и типографских орнаментов для сносок и украшения.",
    cat23: "Зодиак и астрология",
    cat23_d: "Знаки зодиака и планетарные символы для астрологии и астрономии.",
    cat24: "Разное",
    cat24_d: "Различные символы погоды, предметов и значки общего назначения.",
    unicode_title: "Почему символы Unicode работают на любой платформе",
    unicode_p1: "Символы Unicode — это стандартизированные текстовые символы, а не изображения. Это означает, что они работают на любом устройстве, операционной системе или приложении, поддерживающем текст: от Android до iPhone, от Windows до Mac, от Word до Google Docs, от Instagram до Discord. Когда вы копируете символ здесь и вставляете его в другом месте, результат всегда совместим.",
    unicode_p2: "Внешний вид может незначительно отличаться в зависимости от платформы и шрифта, но сам символ является универсальным. Такие символы, как ∑, →, ♥ и €, распознаются во всем мире и корректно отображаются практически во всех современных контекстах.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Как копировать и вставлять специальные символы на компьютере?",
    faq_1_a: "Перейдите на эту страницу, выберите нужную категорию и кликните на любой символ. Он автоматически скопируется в буфер обмена. Затем перейдите в нужное приложение или документ и вставьте его. Ничего устанавливать не нужно.",
    faq_2_q: "Работают ли символы в Instagram, WhatsApp и других социальных сетях?",
    faq_2_a: "Да. Все символы в этом инструменте являются символами Unicode и работают в Instagram, WhatsApp, TikTok, Twitter, Telegram, Discord и на любой платформе, принимающей текст. Просто скопируйте и вставьте непосредственно в свою био, подпись или сообщение.",
    faq_3_q: "Могу ли я использовать математические символы в Word и Google Docs?",
    faq_3_a: "Да. Символы, такие как ∑, ∫, √, ≤, ≥, π, и греческие буквы, такие как α и β, корректно вставляются в Microsoft Word, Google Docs, LibreOffice и любой текстовый редактор. Для академических и научных текстов это самый быстрый способ ввода математических обозначений.",
    faq_4_q: "В чем разница между символами Unicode и специальными символами клавиатуры?",
    faq_4_a: "Стандартная клавиатура предлагает всего около 100 символов. Unicode определяет более 140 000 символов, включая знаки всех языков мира, математики, музыки, валют и многого другого. Этот инструмент дает вам доступ к сотням таких символов, которых нет на обычной клавиатуре.",
    faq_5_q: "Работают ли символы в темах писем и заголовках рассылок?",
    faq_5_a: "Да, с некоторыми оговорками. Простые символы Unicode, такие как ★, →, ✓ и ♥, обычно корректно отображаются в большинстве современных почтовых клиентов.",
    see1: "Выбор эмодзи",
    see2: "Красивые шрифты",
    see3: "Генератор текста",
    see4: "Генератор ASCII-арта"
  }
}
</i18n>
