<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const COPY_FEEDBACK_MS = 2000

interface InvisibleChar {
  key: string
  char: string
  code: string
  platforms: string[]
}

const characters: InvisibleChar[] = [
  { key: 'zwsp',        char: '​', code: 'U+200B', platforms: ['WhatsApp', 'Discord', 'Instagram', 'Telegram'] },
  { key: 'hangul',      char: 'ㅤ', code: 'U+3164', platforms: ['Discord', 'Valorant', 'Roblox', 'Minecraft'] },
  { key: 'braille',     char: '⠀', code: 'U+2800', platforms: ['Discord', 'Twitter', 'WhatsApp', 'Instagram'] },
  { key: 'nbsp',        char: ' ', code: 'U+00A0', platforms: ['WhatsApp', 'Instagram', 'Telegram', 'Facebook'] },
  { key: 'zwnj',        char: '‌', code: 'U+200C', platforms: ['Discord', 'Telegram', 'Twitter'] },
  { key: 'zwj',         char: '‍', code: 'U+200D', platforms: ['Discord', 'Twitter', 'Facebook'] },
  { key: 'wj',          char: '⁠', code: 'U+2060', platforms: ['Discord', 'Twitter', 'Instagram'] },
  { key: 'nnbsp',       char: ' ', code: 'U+202F', platforms: ['Twitter', 'Discord'] },
  { key: 'ideographic', char: '　', code: 'U+3000', platforms: ['Discord', 'Instagram', 'Twitter'] },
]

const platformBadge: Record<string, string> = {
  WhatsApp:  'badge-success',
  Discord:   'badge-primary',
  Instagram: 'badge-secondary',
  Telegram:  'badge-info',
  Twitter:   'badge-neutral',
  Valorant:  'badge-error',
  Roblox:    'badge-accent',
  Minecraft: 'badge-warning',
  Facebook:  'badge-info',
}

const state = reactive({
  selectedKey:     'zwsp',
  quantity:        1,
  copiedKey:       null as string | null,
  copyAnnouncement: '',
  analyzeText:     '',
  cleanedText:     null as string | null,
})

const selected   = computed(() => characters.find(c => c.key === state.selectedKey)!)
const generated  = computed(() => selected.value.char.repeat(state.quantity))
const invisibleSet = new Set(characters.map(c => c.char))
const detectedCount = computed(() =>
  [...state.analyzeText].filter(ch => invisibleSet.has(ch)).length
)

function selectChar(key: string) {
  state.selectedKey = key
}

async function triggerCopy(key: string, text: string) {
  try {
    await navigator.clipboard.writeText(text)
    state.copiedKey = key
    state.copyAnnouncement = t('copied_announce')
    setTimeout(() => {
      state.copiedKey = null
      state.copyAnnouncement = ''
    }, COPY_FEEDBACK_MS)
  } catch {}
}

function incrementQty() { if (state.quantity < 100) state.quantity++ }
function decrementQty()  { if (state.quantity > 1)  state.quantity-- }

function removeInvisible() {
  state.cleanedText = [...state.analyzeText].filter(ch => !invisibleSet.has(ch)).join('')
}

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
  ],
})

useHead({
  title: t('m_title'),
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    en: '/invisible-character',
    pt: '/caractere-invisivel',
    es: '/caracter-invisible',
    fr: '/caractere-invisible',
    it: '/carattere-invisibile',
    id: '/karakter-tak-terlihat',
    de: '/unsichtbares-zeichen',
    nl: '/onzichtbaar-teken',
    ru: '/nevidimyj-simvol',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="true"
    :see-also-links="[
      { label: t('see1'), to: 'fancy-letters' },
      { label: t('see2'), to: 'lenny-face' },
      { label: t('see3'), to: 'copy-paste-symbols' },
      { label: t('see4'), to: 'text-converter' }
    ]"
  >
    <div aria-live="polite" class="sr-only">{{ state.copyAnnouncement }}</div>

    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Painel do caractere selecionado -->
      <div class="bg-base-200 rounded-3xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p class="font-semibold text-base-content">{{ t(selected.key + '_name') }}</p>
            <p class="text-xs text-base-content/50 font-mono mt-0.5">({{ selected.code }})</p>
          </div>
          <div class="flex flex-wrap items-center gap-1">
            <span class="text-xs text-base-content/50 mr-1">{{ t('compat_label') }}</span>
            <span
              v-for="p in selected.platforms"
              :key="p"
              class="badge badge-sm"
              :class="platformBadge[p]"
            >{{ p }}</span>
          </div>
        </div>

        <!-- Controle de quantidade + botão copiar -->
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center bg-base-100 rounded-xl px-2 py-1 gap-1 shadow-sm">
            <button
              type="button"
              class="btn btn-ghost btn-sm btn-square"
              :disabled="state.quantity <= 1"
              @click="decrementQty"
            >−</button>
            <input
              v-model.number="state.quantity"
              type="number"
              min="1"
              max="100"
              class="w-14 text-center text-sm font-mono bg-transparent border-none outline-none"
            />
            <button
              type="button"
              class="btn btn-ghost btn-sm btn-square"
              :disabled="state.quantity >= 100"
              @click="incrementQty"
            >+</button>
          </div>
          <span class="text-sm text-base-content/50">{{ state.quantity === 1 ? t('quantity_singular') : t('quantity_label') }}</span>
          <button
            type="button"
            class="btn flex-1 gap-2 transition-all"
            :class="state.copiedKey === 'generated' ? 'btn-success' : 'btn-primary'"
            @click="triggerCopy('generated', generated)"
          >
            <Icon
              :name="state.copiedKey === 'generated' ? 'material-symbols:check-circle-rounded' : 'material-symbols:content-copy-rounded'"
              class="w-5 h-5"
            />
            {{ state.copiedKey === 'generated' ? t('copied') : t('copy_btn') }}
          </button>
        </div>
      </div>

      <!-- Biblioteca de caracteres -->
      <div>
        <div class="flex items-baseline gap-2 mb-3">
          <p class="text-sm font-bold text-base-content/70 uppercase tracking-wide">{{ t('library_title') }}</p>
          <p class="text-sm text-base-content/50">( {{ t('library_hint') }} )</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="char in characters"
            :key="char.key"
            class="bg-base-200 rounded-2xl p-4 cursor-pointer transition-all"
            :class="state.selectedKey === char.key ? 'ring-2 ring-primary' : 'hover:bg-base-300'"
            role="button"
            :aria-pressed="state.selectedKey === char.key"
            @click="selectChar(char.key)"
          >
            <div class="mb-2">
              <p class="font-medium text-sm leading-snug">{{ t(char.key + '_name') }}</p>
              <p class="text-xs text-base-content/50 font-mono">{{ char.code }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-1">
              <span class="text-xs text-base-content/50 mr-1">{{ t('compat_label') }}</span>
              <span
                v-for="p in char.platforms"
                :key="p"
                class="badge badge-xs"
                :class="platformBadge[p]"
              >{{ p }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detector / Removedor -->
      <div class="bg-base-200 rounded-3xl p-6 space-y-3">
        <div>
          <p class="font-semibold text-base-content">{{ t('analyzer_title') }}</p>
          <p class="text-sm text-base-content/60 mt-0.5">{{ t('analyzer_desc') }}</p>
        </div>
        <textarea
          v-model="state.analyzeText"
          class="textarea textarea-bordered w-full h-28 font-mono text-sm resize-none"
          :placeholder="t('analyzer_placeholder')"
        />
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="btn btn-outline btn-sm gap-2"
            :disabled="!state.analyzeText"
            @click="removeInvisible"
          >
            <Icon name="material-symbols:ink-eraser-rounded" class="w-4 h-4" />
            {{ t('remove_btn') }}
          </button>
          <span
            v-if="state.analyzeText"
            class="text-sm flex items-center gap-1"
            :class="detectedCount > 0 ? 'text-warning' : 'text-base-content/50'"
          >
            <Icon
              :name="detectedCount > 0 ? 'material-symbols:visibility-off-rounded' : 'material-symbols:check-circle-outline-rounded'"
              class="w-4 h-4"
            />
            {{ detectedCount > 0 ? t('detected_found', { count: detectedCount }) : t('detected_none') }}
          </span>
        </div>
        <LineCopy
          v-if="state.cleanedText !== null"
          :content="state.cleanedText || t('empty_result')"
          :label="t('cleaned_result')"
        />
      </div>

    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('d1') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
        />

        <!-- Guia de cada caractere -->
        <h2 class="text-2xl font-bold text-base-content mb-4 flex items-center">
          <Icon name="heroicons:book-open-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
          {{ t('chars_section_title') }}
        </h2>
        <div
          v-for="char in characters"
          :key="char.key"
          class="bg-base-200 rounded-2xl"
        >
          <div class="flex items-baseline gap-2 mb-1 flex-wrap">
            <h3 class="font-bold text-base">{{ t(char.key + '_name') }}</h3>
            <span class="text-xs font-mono text-base-content/50">({{ char.code }})</span>
          </div>
          <p class="text-sm text-base-content/70 leading-relaxed">{{ t(char.key + '_desc') }}</p>
        </div>

        <HowToSection
          :title="t('hiw_title')"
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
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="json">
{
  "pt": {
    "m_title": "Espaço Invisível – Gerador de Caractere Invisível e Letra Invisível | FreeTool",
    "title": "Gerador de Espaço Invisível",
    "meta": "Gere e copie espaço invisível, caracteres invisíveis e letras invisíveis para WhatsApp, Discord, Instagram e jogos. Zero Width Space, Hangul Filler e mais.",
    "d1": "Os caracteres invisíveis são símbolos Unicode sem representação visual que existem dentro do texto. Eles são amplamente usados para criar mensagens em branco no WhatsApp, nomes vazios no Discord e em jogos como Valorant, ou para separar parágrafos em legendas do Instagram de forma mais elegante. Com esta ferramenta, você pode gerar e copiar facilmente diferentes tipos de espaços vazios e caracteres invisíveis (como o Zero Width Space, o Preenchedor Hangul e o Braille em Branco) na quantidade que desejar. Nossa plataforma também oferece informações detalhadas de compatibilidade e um detector integrado para identificar e remover caracteres ocultos de qualquer texto.",
    "zwsp_name": "Espaço de Largura Zero",
    "hangul_name": "Preenchedor Hangul",
    "braille_name": "Braille em Branco",
    "nbsp_name": "Espaço Inquebrável",
    "zwnj_name": "Não-Juntador de Largura Zero",
    "zwj_name": "Juntador de Largura Zero",
    "wj_name": "Juntador de Palavras",
    "nnbsp_name": "Espaço Estreito Inquebrável",
    "ideographic_name": "Espaço Ideográfico",
    "compat_label": "Compatibilidade com:",
    "copy_btn": "Copiar",
    "copied": "Copiado!",
    "copied_announce": "Caractere invisível copiado para a área de transferência",
    "quantity_singular": "espaço",
    "quantity_label": "espaços",
    "library_title": "Biblioteca de Caracteres",
    "library_hint": "Selecione uma opção",
    "analyzer_title": "Detector de Caracteres Invisíveis",
    "analyzer_desc": "Cole qualquer texto para detectar quantos caracteres invisíveis ele contém e removê-los com um clique.",
    "analyzer_placeholder": "Cole o texto aqui para analisar...",
    "remove_btn": "Remover Invisíveis",
    "detected_found": "{count} caractere(s) invisível(eis) encontrado(s)",
    "detected_none": "Nenhum caractere invisível encontrado",
    "cleaned_result": "Texto sem caracteres invisíveis:",
    "empty_result": "(texto ficou vazio após a remoção)",
    "features_title": "Recursos",
    "f_1": "9 tipos de caracteres invisíveis Unicode com badges de compatibilidade por plataforma (WhatsApp, Discord, Instagram e mais).",
    "f_2": "Gerador de quantidade: gere de 1 a 100 espaços invisíveis de uma só vez.",
    "f_3": "Detector integrado: identifique e remova caracteres invisíveis ocultos em qualquer texto colado.",
    "f_4": "Seleção visual com destaque da plataforma ideal para cada caractere.",
    "hiw_title": "Como Usar",
    "hiw_1_title": "Escolha o caractere",
    "hiw_1_desc": "Selecione o tipo de caractere invisível na biblioteca. Cada um tem propriedades únicas e funciona melhor em plataformas específicas — as etiquetas coloridas mostram onde cada um é compatível.",
    "hiw_2_title": "Defina a quantidade",
    "hiw_2_desc": "Use o controle de quantidade para gerar entre 1 e 100 cópias. Alguns aplicativos exigem um número mínimo de caracteres para aceitar o campo.",
    "hiw_3_title": "Copie e cole",
    "hiw_3_desc": "Clique no botão Copiar e cole onde precisar: WhatsApp, Discord, Instagram, Valorant, Roblox ou qualquer campo de texto.",
    "chars_section_title": "Guia de Caracteres Invisíveis",
    "zwsp_desc": "O Zero Width Space (espaço invisível de largura zero) é o caractere invisível mais popular e amplamente suportado. Funciona no WhatsApp para criar mensagens em branco, no Discord para separar texto sem espaço visível, e no Instagram para formatar legendas e bio. Por não ocupar largura visual, é imperceptível ao leitor, mas existe como caractere real no texto.",
    "hangul_desc": "O Preenchedor Hangul é um caractere do alfabeto coreano usado como espaço vazio em nomes de usuário e nicknames. É o preferido para criar nomes invisíveis no Discord, Valorant, Roblox e Minecraft, pois a maioria desses sistemas aceita o caractere sem bloqueá-lo. Ao contrário do Zero Width Space, ele ocupa uma pequena largura, o que pode ser necessário quando o sistema exige ao menos um caractere visível.",
    "braille_desc": "O Braille em Branco é o ponto de código U+2800 do sistema Braille, que representa uma célula vazia sem nenhum ponto elevado. Visualmente indistinguível de um espaço, é amplamente usado no Discord, Twitter/X, WhatsApp e Instagram. É especialmente útil para criar linhas em branco em bios e legendas do Instagram, onde espaços comuns são removidos automaticamente.",
    "nbsp_desc": "O Espaço Inquebrável impede que a linha seja quebrada entre duas palavras. Visualmente idêntico a um espaço comum, mas os sistemas não o tratam como separador de palavras. É amplamente suportado no WhatsApp, Instagram, Telegram e Facebook. Diferentemente de outros caracteres invisíveis, ele ocupa a mesma largura de um espaço normal.",
    "zwnj_desc": "O Não-Juntador de Largura Zero impede a ligadura entre dois caracteres adjacentes sem adicionar espaço visual. Originalmente criado para idiomas como árabe e persa, onde letras se unem automaticamente. No contexto de redes sociais, é usado para separar texto de forma invisível no Discord e Telegram.",
    "zwj_desc": "O Juntador de Largura Zero é o oposto do ZWNJ: força a junção visual entre caracteres adjacentes. É amplamente usado para criar emojis compostos — como a família formada por três emojis separados por ZWJ. No Discord e Twitter, também serve como separador invisível em textos.",
    "wj_desc": "O Juntador de Palavras funciona como o Zero Width Space, mas com uma diferença importante: impede a quebra de linha no ponto onde está inserido. É útil quando você quer um separador invisível que garanta que o texto não seja dividido entre linhas, mantendo palavras juntas no Discord, Twitter e Instagram.",
    "nnbsp_desc": "O Espaço Estreito Inquebrável é um espaço de largura reduzida (menor que um espaço normal) que também impede quebra de linha. É usado em tipografia formal para separar números de unidades ou antes de pontuação em francês. Em redes sociais, aparece como um espaço muito sutil e quase invisível no Twitter e Discord.",
    "ideographic_desc": "O Espaço Ideográfico é um espaço de largura completa (full-width) originário dos sistemas de escrita do Leste Asiático, como japonês e chinês. Visualmente ocupa o dobro da largura de um espaço comum ocidental. É reconhecível em alguns contextos, mas em campos de nome e bio do Discord e Instagram pode passar despercebido como um simples espaço largo.",
    "faq_title": "Perguntas e Respostas",
    "faq_1_q": "O que é um caractere invisível ou letra invisível?",
    "faq_1_a": "Um caractere invisível (também chamado de letra invisível, espaço em branco ou espaço invisível) é um símbolo Unicode que não tem representação visual, mas existe como um caractere real dentro do texto. Exemplos populares incluem o Zero Width Space (U+200B), o Preenchedor Hangul (U+3164) e o Braille em Branco (U+2800). Eles são amplamente usados em mensageiros, jogos e redes sociais.",
    "faq_2_q": "Como enviar uma mensagem em branco no WhatsApp?",
    "faq_2_a": "Para enviar uma mensagem em branco no WhatsApp, copie o Zero Width Space (U+200B) ou o Braille em Branco (U+2800) com nossa ferramenta, cole no campo de mensagem do WhatsApp e envie. O destinatário verá uma mensagem aparentemente vazia.",
    "faq_3_q": "Como criar um nome vazio no Discord?",
    "faq_3_a": "O Preenchedor Hangul (U+3164) é o mais popular para criar nomes vazios no Discord. Copie o caractere com nossa ferramenta, vá até Configurações do Usuário no Discord, clique em Editar Perfil e cole como seu nome de exibição. Alguns servidores podem bloquear nomes invisíveis por políticas internas.",
    "faq_4_q": "Os caracteres invisíveis são seguros de usar?",
    "faq_4_a": "Sim. Caracteres invisíveis são símbolos Unicode padrão e completamente seguros — fazem parte da especificação Unicode e são suportados por todos os sistemas operacionais modernos. Use com responsabilidade para não violar as políticas de uso de cada plataforma.",
    "faq_5_q": "Como remover caracteres invisíveis ou espaços em branco ocultos de um texto?",
    "faq_5_a": "Use o Detector de Caracteres Invisíveis desta página: cole o texto no campo de análise e clique em \"Remover Invisíveis\". A ferramenta identifica e remove automaticamente todos os caracteres invisíveis — como Zero Width Space, Hangul Filler e Braille em Branco — e exibe o texto limpo pronto para copiar. Isso é especialmente útil para textos copiados de PDFs, editores de texto ou mensagens de WhatsApp que podem conter caracteres ocultos.",
    "see1": "Letras Diferentes",
    "see2": "Lenny Face",
    "see3": "Símbolos Especiais",
    "see4": "Conversor de Texto"
  },
  "en": {
    "m_title": "Invisible Character & Letter Generator – Blank Space Copy Paste | FreeTool",
    "title": "Invisible Character Generator",
    "meta": "Generate and copy invisible characters, invisible letters and blank spaces for WhatsApp, Discord, Instagram and games. Zero Width Space, Hangul Filler, Braille Blank and more.",
    "d1": "Invisible characters are Unicode symbols with no visual representation that exist within text. They are widely used to send blank messages on WhatsApp, create empty names on Discord and games like Valorant, or separate paragraphs in Instagram captions more elegantly. With this tool, you can easily generate and copy different types of blank spaces and invisible characters — such as Zero Width Space, Hangul Filler and Braille Blank — in any quantity. Our platform also provides detailed compatibility information and a built-in detector to identify and remove hidden characters from any text.",
    "zwsp_name": "Zero Width Space",
    "hangul_name": "Hangul Filler",
    "braille_name": "Braille Blank",
    "nbsp_name": "Non-Breaking Space",
    "zwnj_name": "Zero Width Non-Joiner",
    "zwj_name": "Zero Width Joiner",
    "wj_name": "Word Joiner",
    "nnbsp_name": "Narrow No-Break Space",
    "ideographic_name": "Ideographic Space",
    "compat_label": "Works on:",
    "copy_btn": "Copy",
    "copied": "Copied!",
    "copied_announce": "Invisible character copied to clipboard",
    "quantity_singular": "space",
    "quantity_label": "spaces",
    "library_title": "Character Library",
    "library_hint": "Select one to copy",
    "analyzer_title": "Invisible Character Detector",
    "analyzer_desc": "Paste any text to detect how many invisible characters it contains and remove them with one click.",
    "analyzer_placeholder": "Paste text here to analyze...",
    "remove_btn": "Remove Invisible",
    "detected_found": "{count} invisible character(s) found",
    "detected_none": "No invisible characters found",
    "cleaned_result": "Text without invisible characters:",
    "empty_result": "(text was empty after removal)",
    "features_title": "Features",
    "f_1": "9 types of Unicode invisible characters with platform compatibility labels (WhatsApp, Discord, Instagram and more).",
    "f_2": "Quantity generator: produce 1 to 100 invisible spaces at once.",
    "f_3": "Built-in detector: identify and remove hidden invisible characters from any pasted text.",
    "f_4": "Visual selection with platform highlights showing the best character for each use case.",
    "hiw_title": "How To Use",
    "hiw_1_title": "Choose the character",
    "hiw_1_desc": "Select the type of invisible character from the library. Each one has unique properties and works best on specific platforms — the colored labels show where each one is compatible.",
    "hiw_2_title": "Set the quantity",
    "hiw_2_desc": "Use the quantity control to generate between 1 and 100 spaces. Some apps require a minimum number of characters to accept a field.",
    "hiw_3_title": "Copy and paste",
    "hiw_3_desc": "Click the Copy button and paste wherever you need: WhatsApp, Discord, Instagram, Valorant, Roblox or any text field.",
    "chars_section_title": "Invisible Character Guide",
    "zwsp_desc": "The Zero Width Space is the most popular and widely supported invisible character. It works on WhatsApp to create blank messages, on Discord to separate text without visible spacing, and on Instagram to format captions and bios. Since it takes up no visual width, it is imperceptible to the reader yet exists as a real character in the text.",
    "hangul_desc": "The Hangul Filler is a character from the Korean alphabet used as an empty placeholder in usernames and nicknames. It is the go-to choice for creating invisible names on Discord, Valorant, Roblox and Minecraft, as most of these systems accept it without blocking it. Unlike the Zero Width Space, it occupies a small width, which may be necessary when a system requires at least one visible character.",
    "braille_desc": "The Braille Blank is code point U+2800 in the Braille system, representing an empty cell with no raised dots. Visually indistinguishable from a space, it is widely used on Discord, Twitter/X, WhatsApp and Instagram. It is especially useful for creating blank lines in Instagram bios and captions, where regular spaces are automatically stripped.",
    "nbsp_desc": "The Non-Breaking Space prevents a line break between two words. Visually identical to a regular space, but systems do not treat it as a word separator. It is widely supported on WhatsApp, Instagram, Telegram and Facebook. Unlike other invisible characters, it occupies the same width as a normal space.",
    "zwnj_desc": "The Zero Width Non-Joiner prevents ligatures between two adjacent characters without adding any visual space. Originally created for languages like Arabic and Persian, where letters join automatically. On social media, it is used to invisibly separate text on Discord and Telegram.",
    "zwj_desc": "The Zero Width Joiner is the opposite of the ZWNJ: it forces a visual join between adjacent characters. It is widely used to create compound emojis — such as a family emoji composed of multiple emojis joined by ZWJ. On Discord and Twitter, it also serves as an invisible separator within text.",
    "wj_desc": "The Word Joiner works like the Zero Width Space, but with one key difference: it prevents a line break at the point where it is inserted. It is useful when you want an invisible separator that ensures text is not split across lines, keeping words together on Discord, Twitter and Instagram.",
    "nnbsp_desc": "The Narrow No-Break Space is a reduced-width space (narrower than a regular space) that also prevents line breaks. It is used in formal typography to separate numbers from units or before punctuation marks in French. On social media, it appears as a very subtle, near-invisible space on Twitter and Discord.",
    "ideographic_desc": "The Ideographic Space is a full-width space originating from East Asian writing systems such as Japanese and Chinese. Visually it occupies twice the width of a standard Western space. It may be noticeable in some contexts, but in name and bio fields on Discord and Instagram it can pass unnoticed as a simple wide space.",
    "faq_title": "Questions and Answers",
    "faq_1_q": "What is an invisible character or invisible letter?",
    "faq_1_a": "An invisible character (also called an invisible letter, blank space or invisible space) is a Unicode symbol that has no visual representation but exists as a real character within text. Popular examples include Zero Width Space (U+200B), Hangul Filler (U+3164) and Braille Blank (U+2800). They are widely used in messaging apps, games and social networks.",
    "faq_2_q": "How to send a blank message on WhatsApp?",
    "faq_2_a": "To send a blank message on WhatsApp, copy the Zero Width Space (U+200B) or Braille Blank (U+2800) using our tool, paste it into the WhatsApp message field and send. The recipient will see an apparently empty message.",
    "faq_3_q": "How to create an empty name on Discord?",
    "faq_3_a": "The Hangul Filler (U+3164) is the most popular choice for creating empty names on Discord. Copy the character with our tool, go to User Settings in Discord, click Edit Profile and paste it as your display name. Some servers may block invisible names based on their own policies.",
    "faq_4_q": "Are invisible characters safe to use?",
    "faq_4_a": "Yes. Invisible characters are standard Unicode symbols and completely safe — they are part of the Unicode specification and supported by all modern operating systems. Use them responsibly and avoid violating each platform's terms of service.",
    "faq_5_q": "How to remove invisible characters or hidden blank spaces from text?",
    "faq_5_a": "Use the Invisible Character Detector on this page: paste your text into the analysis field and click \"Remove Invisible\". The tool automatically identifies and strips all invisible characters — such as Zero Width Space, Hangul Filler and Braille Blank — and displays the clean text ready to copy. This is especially useful for text copied from PDFs, word processors or WhatsApp messages that may contain hidden characters.",
    "see1": "Fancy Letters",
    "see2": "Lenny Face",
    "see3": "Special Symbols",
    "see4": "Text Converter"
  },
  "es": {
    "m_title": "Caracteres Invisibles – Letra Invisible y Espacio en Blanco | FreeTool",
    "title": "Generador de Caracteres Invisibles",
    "meta": "Genera y copia caracteres invisibles, letras invisibles y espacios en blanco para WhatsApp, Discord, Instagram y juegos. Zero Width Space, Hangul Filler y más.",
    "d1": "Los caracteres invisibles son símbolos Unicode sin representación visual que existen dentro del texto. Se usan ampliamente para enviar mensajes en blanco en WhatsApp, crear nombres vacíos en Discord y juegos como Valorant, o separar párrafos en las descripciones de Instagram de forma más elegante. Con esta herramienta puedes generar y copiar fácilmente distintos tipos de espacios vacíos y caracteres invisibles — como el Zero Width Space, el Hangul Filler y el Braille en Blanco — en la cantidad que desees. Nuestra plataforma también ofrece información detallada de compatibilidad y un detector integrado para identificar y eliminar caracteres ocultos de cualquier texto.",
    "zwsp_name": "Espacio de Ancho Cero",
    "hangul_name": "Relleno Hangul",
    "braille_name": "Braille en Blanco",
    "nbsp_name": "Espacio de No Separación",
    "zwnj_name": "No Conector de Ancho Cero",
    "zwj_name": "Conector de Ancho Cero",
    "wj_name": "Conector de Palabras",
    "nnbsp_name": "Espacio Estrecho de No Separación",
    "ideographic_name": "Espacio Ideográfico",
    "compat_label": "Funciona en:",
    "copy_btn": "Copiar",
    "copied": "¡Copiado!",
    "copied_announce": "Carácter invisible copiado al portapapeles",
    "quantity_singular": "espacio",
    "quantity_label": "espacios",
    "library_title": "Biblioteca de Caracteres",
    "library_hint": "Selecciona uno para copiar",
    "analyzer_title": "Detector de Caracteres Invisibles",
    "analyzer_desc": "Pega cualquier texto para detectar cuántos caracteres invisibles contiene y eliminarlos con un clic.",
    "analyzer_placeholder": "Pega el texto aquí para analizar...",
    "remove_btn": "Eliminar Invisibles",
    "detected_found": "{count} carácter(es) invisible(s) encontrado(s)",
    "detected_none": "No se encontraron caracteres invisibles",
    "cleaned_result": "Texto sin caracteres invisibles:",
    "empty_result": "(el texto quedó vacío tras la eliminación)",
    "features_title": "Características",
    "f_1": "9 tipos de caracteres Unicode invisibles con etiquetas de compatibilidad por plataforma (WhatsApp, Discord, Instagram y más).",
    "f_2": "Generador de cantidad: produce de 1 a 100 espacios invisibles de una sola vez.",
    "f_3": "Detector integrado: identifica y elimina caracteres invisibles ocultos en cualquier texto pegado.",
    "f_4": "Selección visual con indicadores de plataforma que muestran el mejor carácter para cada caso.",
    "hiw_title": "Cómo Usar",
    "hiw_1_title": "Elige el carácter",
    "hiw_1_desc": "Selecciona el tipo de carácter invisible en la biblioteca. Cada uno tiene propiedades únicas y funciona mejor en plataformas específicas — las etiquetas de colores muestran dónde es compatible cada uno.",
    "hiw_2_title": "Define la cantidad",
    "hiw_2_desc": "Usa el control de cantidad para generar entre 1 y 100 espacios. Algunas apps requieren un número mínimo de caracteres para aceptar un campo.",
    "hiw_3_title": "Copia y pega",
    "hiw_3_desc": "Haz clic en el botón Copiar y pega donde necesites: WhatsApp, Discord, Instagram, Valorant, Roblox o cualquier campo de texto.",
    "chars_section_title": "Guía de Caracteres Invisibles",
    "zwsp_desc": "El Espacio de Ancho Cero es el carácter invisible más popular y ampliamente soportado. Funciona en WhatsApp para crear mensajes en blanco, en Discord para separar texto sin espacio visible, y en Instagram para formatear descripciones y bios. Al no ocupar ancho visual, es imperceptible para el lector pero existe como un carácter real en el texto.",
    "hangul_desc": "El Relleno Hangul es un carácter del alfabeto coreano usado como espacio vacío en nombres de usuario y apodos. Es la opción preferida para crear nombres invisibles en Discord, Valorant, Roblox y Minecraft, ya que la mayoría de estos sistemas lo acepta sin bloquearlo. A diferencia del Espacio de Ancho Cero, ocupa un pequeño ancho, lo que puede ser necesario cuando el sistema exige al menos un carácter visible.",
    "braille_desc": "El Braille en Blanco es el punto de código U+2800 del sistema Braille, que representa una celda vacía sin ningún punto elevado. Visualmente indistinguible de un espacio, se usa ampliamente en Discord, Twitter/X, WhatsApp e Instagram. Es especialmente útil para crear líneas en blanco en bios y descripciones de Instagram, donde los espacios comunes se eliminan automáticamente.",
    "nbsp_desc": "El Espacio de No Separación impide que la línea se corte entre dos palabras. Visualmente idéntico a un espacio común, pero los sistemas no lo tratan como separador de palabras. Tiene amplio soporte en WhatsApp, Instagram, Telegram y Facebook. A diferencia de otros caracteres invisibles, ocupa el mismo ancho que un espacio normal.",
    "zwnj_desc": "El No Conector de Ancho Cero impide la ligadura entre dos caracteres adyacentes sin añadir espacio visual. Fue creado originalmente para idiomas como el árabe y el persa, donde las letras se unen automáticamente. En redes sociales, se usa para separar texto de forma invisible en Discord y Telegram.",
    "zwj_desc": "El Conector de Ancho Cero es lo opuesto al ZWNJ: fuerza la unión visual entre caracteres adyacentes. Se usa ampliamente para crear emojis compuestos — como la familia formada por varios emojis unidos por ZWJ. En Discord y Twitter también sirve como separador invisible dentro del texto.",
    "wj_desc": "El Conector de Palabras funciona como el Espacio de Ancho Cero, pero con una diferencia clave: impide el salto de línea en el punto donde está insertado. Es útil cuando quieres un separador invisible que garantice que el texto no se divida entre líneas, manteniendo las palabras juntas en Discord, Twitter e Instagram.",
    "nnbsp_desc": "El Espacio Estrecho de No Separación es un espacio de ancho reducido (más estrecho que un espacio normal) que también impide saltos de línea. Se usa en tipografía formal para separar números de unidades o antes de signos de puntuación en francés. En redes sociales, aparece como un espacio muy sutil y casi invisible en Twitter y Discord.",
    "ideographic_desc": "El Espacio Ideográfico es un espacio de ancho completo (full-width) propio de los sistemas de escritura de Asia Oriental, como el japonés y el chino. Visualmente ocupa el doble del ancho de un espacio occidental estándar. Puede ser perceptible en algunos contextos, pero en campos de nombre y bio de Discord e Instagram puede pasar desapercibido como un simple espacio ancho.",
    "faq_title": "Preguntas y Respuestas",
    "faq_1_q": "¿Qué es un carácter invisible o letra invisible?",
    "faq_1_a": "Un carácter invisible (también llamado letra invisible, espacio en blanco o espacio invisible) es un símbolo Unicode que no tiene representación visual pero existe como un carácter real dentro del texto. Ejemplos populares incluyen el Espacio de Ancho Cero (U+200B), el Relleno Hangul (U+3164) y el Braille en Blanco (U+2800). Son ampliamente usados en apps de mensajería, juegos y redes sociales.",
    "faq_2_q": "¿Cómo enviar un mensaje en blanco en WhatsApp?",
    "faq_2_a": "Para enviar un mensaje en blanco en WhatsApp, copia el Espacio de Ancho Cero (U+200B) o el Braille en Blanco (U+2800) con nuestra herramienta, pégalo en el campo de mensaje de WhatsApp y envíalo. El destinatario verá un mensaje aparentemente vacío.",
    "faq_3_q": "¿Cómo crear un nombre vacío en Discord?",
    "faq_3_a": "El Relleno Hangul (U+3164) es la opción más popular para crear nombres vacíos en Discord. Copia el carácter con nuestra herramienta, ve a Configuración de Usuario en Discord, haz clic en Editar Perfil y pégalo como tu nombre de visualización. Algunos servidores pueden bloquear nombres invisibles según sus propias políticas.",
    "faq_4_q": "¿Son seguros los caracteres invisibles?",
    "faq_4_a": "Sí. Los caracteres invisibles son símbolos Unicode estándar y completamente seguros — forman parte de la especificación Unicode y están soportados por todos los sistemas operativos modernos. Úsalos con responsabilidad y evita infringir los términos de servicio de cada plataforma.",
    "faq_5_q": "¿Cómo eliminar caracteres invisibles o espacios en blanco ocultos de un texto?",
    "faq_5_a": "Usa el Detector de Caracteres Invisibles de esta página: pega el texto en el campo de análisis y haz clic en \"Eliminar Invisibles\". La herramienta identifica y elimina automáticamente todos los caracteres invisibles — como Zero Width Space, Hangul Filler y Braille en Blanco — y muestra el texto limpio listo para copiar. Esto es especialmente útil para textos copiados de PDFs, editores de texto o mensajes de WhatsApp que pueden contener caracteres ocultos.",
    "see1": "Letras Especiales",
    "see2": "Lenny Face",
    "see3": "Símbolos Especiales",
    "see4": "Convertidor de Texto"
  },
  "fr": {
    "m_title": "Générateur de Caractères Invisibles – Espace Vide Copier-Coller | FreeTool",
    "title": "Générateur de Caractères Invisibles",
    "meta": "Générez et copiez des caractères invisibles et espaces vides pour WhatsApp, Discord, Instagram et jeux. Zero Width Space, Hangul Filler, Braille Vide et plus.",
    "d1": "Les caractères invisibles sont des symboles Unicode sans représentation visuelle qui existent dans le texte. Ils sont largement utilisés pour envoyer des messages vides sur WhatsApp, créer des noms vides sur Discord et dans des jeux comme Valorant, ou séparer des paragraphes dans les légendes Instagram de façon plus élégante. Avec cet outil, vous pouvez facilement générer et copier différents types d'espaces vides et de caractères invisibles — comme le Zero Width Space, le Hangul Filler et le Braille Vide — en toute quantité. Notre plateforme fournit également des informations détaillées de compatibilité et un détecteur intégré pour identifier et supprimer les caractères cachés de n'importe quel texte.",
    "zwsp_name": "Espace de Largeur Nulle",
    "hangul_name": "Remplissage Hangul",
    "braille_name": "Braille Vide",
    "nbsp_name": "Espace Insécable",
    "zwnj_name": "Non-Joineur de Largeur Nulle",
    "zwj_name": "Joineur de Largeur Nulle",
    "wj_name": "Joineur de Mots",
    "nnbsp_name": "Espace Insécable Étroit",
    "ideographic_name": "Espace Idéographique",
    "compat_label": "Fonctionne sur :",
    "copy_btn": "Copier",
    "copied": "Copié !",
    "copied_announce": "Caractère invisible copié dans le presse-papiers",
    "quantity_singular": "espace",
    "quantity_label": "espaces",
    "library_title": "Bibliothèque de Caractères",
    "library_hint": "Sélectionnez-en un pour copier",
    "analyzer_title": "Détecteur de Caractères Invisibles",
    "analyzer_desc": "Collez n'importe quel texte pour détecter combien de caractères invisibles il contient et les supprimer en un clic.",
    "analyzer_placeholder": "Collez le texte ici pour analyser...",
    "remove_btn": "Supprimer les Invisibles",
    "detected_found": "{count} caractère(s) invisible(s) trouvé(s)",
    "detected_none": "Aucun caractère invisible trouvé",
    "cleaned_result": "Texte sans caractères invisibles :",
    "empty_result": "(le texte était vide après suppression)",
    "features_title": "Fonctionnalités",
    "f_1": "9 types de caractères Unicode invisibles avec étiquettes de compatibilité par plateforme (WhatsApp, Discord, Instagram et plus).",
    "f_2": "Générateur de quantité : produisez de 1 à 100 espaces invisibles en une seule fois.",
    "f_3": "Détecteur intégré : identifiez et supprimez les caractères invisibles cachés dans n'importe quel texte collé.",
    "f_4": "Sélection visuelle avec indicateurs de plateforme montrant le meilleur caractère pour chaque usage.",
    "hiw_title": "Comment Utiliser",
    "hiw_1_title": "Choisissez le caractère",
    "hiw_1_desc": "Sélectionnez le type de caractère invisible dans la bibliothèque. Chacun a des propriétés uniques et fonctionne mieux sur des plateformes spécifiques — les étiquettes colorées indiquent où chacun est compatible.",
    "hiw_2_title": "Définissez la quantité",
    "hiw_2_desc": "Utilisez le contrôle de quantité pour générer entre 1 et 100 espaces. Certaines applications exigent un nombre minimum de caractères pour accepter un champ.",
    "hiw_3_title": "Copiez et collez",
    "hiw_3_desc": "Cliquez sur le bouton Copier et collez où vous en avez besoin : WhatsApp, Discord, Instagram, Valorant, Roblox ou n'importe quel champ de texte.",
    "chars_section_title": "Guide des Caractères Invisibles",
    "zwsp_desc": "L'Espace de Largeur Nulle est le caractère invisible le plus populaire et le plus largement supporté. Il fonctionne sur WhatsApp pour créer des messages vides, sur Discord pour séparer du texte sans espace visible, et sur Instagram pour formater les légendes et les bios. N'occupant aucune largeur visuelle, il est imperceptible pour le lecteur mais existe comme un vrai caractère dans le texte.",
    "hangul_desc": "Le Remplissage Hangul est un caractère de l'alphabet coréen utilisé comme espace vide dans les noms d'utilisateur et les pseudonymes. C'est le choix privilégié pour créer des noms invisibles sur Discord, Valorant, Roblox et Minecraft, car la plupart de ces systèmes l'acceptent sans le bloquer. Contrairement à l'Espace de Largeur Nulle, il occupe une petite largeur, ce qui peut être nécessaire quand le système exige au moins un caractère visible.",
    "braille_desc": "Le Braille Vide est le point de code U+2800 du système Braille, représentant une cellule vide sans aucun point en relief. Visuellement indiscernable d'un espace, il est largement utilisé sur Discord, Twitter/X, WhatsApp et Instagram. Il est particulièrement utile pour créer des lignes vides dans les bios et légendes Instagram, où les espaces ordinaires sont automatiquement supprimés.",
    "nbsp_desc": "L'Espace Insécable empêche le retour à la ligne entre deux mots. Visuellement identique à un espace ordinaire, mais les systèmes ne le traitent pas comme un séparateur de mots. Il est largement supporté sur WhatsApp, Instagram, Telegram et Facebook. Contrairement aux autres caractères invisibles, il occupe la même largeur qu'un espace normal.",
    "zwnj_desc": "Le Non-Joineur de Largeur Nulle empêche la ligature entre deux caractères adjacents sans ajouter d'espace visuel. Créé à l'origine pour des langues comme l'arabe et le persan, où les lettres se joignent automatiquement. Sur les réseaux sociaux, il est utilisé pour séparer du texte de façon invisible sur Discord et Telegram.",
    "zwj_desc": "Le Joineur de Largeur Nulle est l'opposé du ZWNJ : il force la jonction visuelle entre des caractères adjacents. Il est largement utilisé pour créer des emojis composés — comme la famille formée de plusieurs emojis joints par ZWJ. Sur Discord et Twitter, il sert également de séparateur invisible dans les textes.",
    "wj_desc": "Le Joineur de Mots fonctionne comme l'Espace de Largeur Nulle, mais avec une différence clé : il empêche le retour à la ligne à l'endroit où il est inséré. Il est utile quand vous souhaitez un séparateur invisible garantissant que le texte ne soit pas divisé entre les lignes, maintenant les mots ensemble sur Discord, Twitter et Instagram.",
    "nnbsp_desc": "L'Espace Insécable Étroit est un espace de largeur réduite (plus étroit qu'un espace normal) qui empêche également les retours à la ligne. Il est utilisé en typographie formelle pour séparer les nombres des unités ou avant les signes de ponctuation en français. Sur les réseaux sociaux, il apparaît comme un espace très subtil et quasi invisible sur Twitter et Discord.",
    "ideographic_desc": "L'Espace Idéographique est un espace pleine largeur (full-width) issu des systèmes d'écriture d'Asie orientale, comme le japonais et le chinois. Visuellement, il occupe le double de la largeur d'un espace occidental standard. Il peut être perceptible dans certains contextes, mais dans les champs de nom et de bio de Discord et Instagram, il peut passer inaperçu comme un simple espace large.",
    "faq_title": "Questions et Réponses",
    "faq_1_q": "Qu'est-ce qu'un caractère invisible ou une lettre invisible ?",
    "faq_1_a": "Un caractère invisible (aussi appelé lettre invisible, espace vide ou espace invisible) est un symbole Unicode sans représentation visuelle qui existe comme un vrai caractère dans le texte. Exemples populaires : Espace de Largeur Nulle (U+200B), Remplissage Hangul (U+3164) et Braille Vide (U+2800). Ils sont largement utilisés dans les messageries, les jeux et les réseaux sociaux.",
    "faq_2_q": "Comment envoyer un message vide sur WhatsApp ?",
    "faq_2_a": "Pour envoyer un message vide sur WhatsApp, copiez l'Espace de Largeur Nulle (U+200B) ou le Braille Vide (U+2800) avec notre outil, collez-le dans le champ de message WhatsApp et envoyez. Le destinataire verra un message apparemment vide.",
    "faq_3_q": "Comment créer un nom vide sur Discord ?",
    "faq_3_a": "Le Remplissage Hangul (U+3164) est le choix le plus populaire pour créer des noms vides sur Discord. Copiez le caractère avec notre outil, allez dans Paramètres Utilisateur sur Discord, cliquez sur Modifier le Profil et collez-le comme nom d'affichage. Certains serveurs peuvent bloquer les noms invisibles selon leurs propres règles.",
    "faq_4_q": "Les caractères invisibles sont-ils sûrs à utiliser ?",
    "faq_4_a": "Oui. Les caractères invisibles sont des symboles Unicode standard et totalement sûrs — ils font partie de la spécification Unicode et sont supportés par tous les systèmes d'exploitation modernes. Utilisez-les de façon responsable et évitez d'enfreindre les conditions d'utilisation de chaque plateforme.",
    "faq_5_q": "Comment supprimer les caractères invisibles ou les espaces cachés d'un texte ?",
    "faq_5_a": "Utilisez le Détecteur de Caractères Invisibles de cette page : collez le texte dans le champ d'analyse et cliquez sur \"Supprimer les Invisibles\". L'outil identifie et supprime automatiquement tous les caractères invisibles — comme Zero Width Space, Remplissage Hangul et Braille Vide — et affiche le texte propre prêt à copier. C'est particulièrement utile pour les textes copiés depuis des PDFs, des éditeurs de texte ou des messages WhatsApp qui peuvent contenir des caractères cachés.",
    "see1": "Lettres Stylisées",
    "see2": "Lenny Face",
    "see3": "Symboles Spéciaux",
    "see4": "Convertisseur de Texte"
  },
  "it": {
    "m_title": "Generatore di Caratteri Invisibili – Spazio Vuoto Copia e Incolla | FreeTool",
    "title": "Generatore di Caratteri Invisibili",
    "meta": "Genera e copia caratteri invisibili e spazi vuoti per WhatsApp, Discord, Instagram e giochi. Zero Width Space, Hangul Filler, Braille Vuoto e altro.",
    "d1": "I caratteri invisibili sono simboli Unicode privi di rappresentazione visiva che esistono all'interno del testo. Sono ampiamente usati per inviare messaggi vuoti su WhatsApp, creare nomi vuoti su Discord e in giochi come Valorant, o separare paragrafi nelle didascalie di Instagram in modo più elegante. Con questo strumento puoi generare e copiare facilmente diversi tipi di spazi vuoti e caratteri invisibili — come Zero Width Space, Hangul Filler e Braille Vuoto — nella quantità desiderata. La nostra piattaforma offre anche informazioni dettagliate sulla compatibilità e un rilevatore integrato per identificare e rimuovere caratteri nascosti da qualsiasi testo.",
    "zwsp_name": "Spazio a Larghezza Zero",
    "hangul_name": "Riempitivo Hangul",
    "braille_name": "Braille Vuoto",
    "nbsp_name": "Spazio Unificatore",
    "zwnj_name": "Non Connettore a Larghezza Zero",
    "zwj_name": "Connettore a Larghezza Zero",
    "wj_name": "Connettore di Parole",
    "nnbsp_name": "Spazio Stretto Unificatore",
    "ideographic_name": "Spazio Ideografico",
    "compat_label": "Funziona su:",
    "copy_btn": "Copia",
    "copied": "Copiato!",
    "copied_announce": "Carattere invisibile copiato negli appunti",
    "quantity_singular": "spazio",
    "quantity_label": "spazi",
    "library_title": "Libreria di Caratteri",
    "library_hint": "Selezionane uno per copiare",
    "analyzer_title": "Rilevatore di Caratteri Invisibili",
    "analyzer_desc": "Incolla qualsiasi testo per rilevare quanti caratteri invisibili contiene e rimuoverli con un clic.",
    "analyzer_placeholder": "Incolla il testo qui per analizzare...",
    "remove_btn": "Rimuovi Invisibili",
    "detected_found": "{count} carattere/i invisibile/i trovato/i",
    "detected_none": "Nessun carattere invisibile trovato",
    "cleaned_result": "Testo senza caratteri invisibili:",
    "empty_result": "(il testo era vuoto dopo la rimozione)",
    "features_title": "Funzionalità",
    "f_1": "9 tipi di caratteri Unicode invisibili con etichette di compatibilità per piattaforma (WhatsApp, Discord, Instagram e altro).",
    "f_2": "Generatore di quantità: produce da 1 a 100 spazi invisibili in una sola volta.",
    "f_3": "Rilevatore integrato: identifica e rimuove caratteri invisibili nascosti in qualsiasi testo incollato.",
    "f_4": "Selezione visiva con indicatori di piattaforma che mostrano il carattere migliore per ogni caso d'uso.",
    "hiw_title": "Come Usare",
    "hiw_1_title": "Scegli il carattere",
    "hiw_1_desc": "Seleziona il tipo di carattere invisibile dalla libreria. Ognuno ha proprietà uniche e funziona meglio su piattaforme specifiche — le etichette colorate mostrano dove ciascuno è compatibile.",
    "hiw_2_title": "Imposta la quantità",
    "hiw_2_desc": "Usa il controllo della quantità per generare tra 1 e 100 spazi. Alcune app richiedono un numero minimo di caratteri per accettare un campo.",
    "hiw_3_title": "Copia e incolla",
    "hiw_3_desc": "Clicca sul pulsante Copia e incolla dove ti serve: WhatsApp, Discord, Instagram, Valorant, Roblox o qualsiasi campo di testo.",
    "chars_section_title": "Guida ai Caratteri Invisibili",
    "zwsp_desc": "Lo Spazio a Larghezza Zero è il carattere invisibile più popolare e ampiamente supportato. Funziona su WhatsApp per creare messaggi vuoti, su Discord per separare il testo senza spazio visibile, e su Instagram per formattare didascalie e bio. Non occupando alcuna larghezza visiva, è impercettibile al lettore ma esiste come carattere reale nel testo.",
    "hangul_desc": "Il Riempitivo Hangul è un carattere dell'alfabeto coreano usato come segnaposto vuoto nei nomi utente e nei soprannomi. È la scelta preferita per creare nomi invisibili su Discord, Valorant, Roblox e Minecraft, poiché la maggior parte di questi sistemi lo accetta senza bloccarlo. A differenza dello Spazio a Larghezza Zero, occupa una piccola larghezza, il che può essere necessario quando il sistema richiede almeno un carattere visibile.",
    "braille_desc": "Il Braille Vuoto è il punto di codice U+2800 del sistema Braille, che rappresenta una cella vuota senza alcun punto in rilievo. Visivamente indistinguibile da uno spazio, è ampiamente usato su Discord, Twitter/X, WhatsApp e Instagram. È particolarmente utile per creare righe vuote nelle bio e nelle didascalie di Instagram, dove gli spazi comuni vengono rimossi automaticamente.",
    "nbsp_desc": "Lo Spazio Unificatore impedisce l'interruzione di riga tra due parole. Visivamente identico a uno spazio comune, ma i sistemi non lo trattano come separatore di parole. È ampiamente supportato su WhatsApp, Instagram, Telegram e Facebook. A differenza di altri caratteri invisibili, occupa la stessa larghezza di uno spazio normale.",
    "zwnj_desc": "Il Non Connettore a Larghezza Zero impedisce la legatura tra due caratteri adiacenti senza aggiungere spazio visivo. Creato originariamente per lingue come l'arabo e il persiano, dove le lettere si uniscono automaticamente. Sui social media, viene usato per separare il testo in modo invisibile su Discord e Telegram.",
    "zwj_desc": "Il Connettore a Larghezza Zero è l'opposto del ZWNJ: forza la giunzione visiva tra caratteri adiacenti. È ampiamente usato per creare emoji composte — come la famiglia formata da più emoji uniti dal ZWJ. Su Discord e Twitter serve anche come separatore invisibile nei testi.",
    "wj_desc": "Il Connettore di Parole funziona come lo Spazio a Larghezza Zero, ma con una differenza chiave: impedisce l'interruzione di riga nel punto in cui è inserito. È utile quando si vuole un separatore invisibile che garantisca che il testo non venga diviso tra le righe, mantenendo le parole unite su Discord, Twitter e Instagram.",
    "nnbsp_desc": "Lo Spazio Stretto Unificatore è uno spazio di larghezza ridotta (più stretto di uno spazio normale) che impedisce anche le interruzioni di riga. Viene usato in tipografia formale per separare i numeri dalle unità o prima della punteggiatura in francese. Sui social media appare come uno spazio molto sottile e quasi invisibile su Twitter e Discord.",
    "ideographic_desc": "Lo Spazio Ideografico è uno spazio a larghezza piena (full-width) originario dei sistemi di scrittura dell'Asia orientale, come il giapponese e il cinese. Visivamente occupa il doppio della larghezza di uno spazio occidentale standard. Può essere percettibile in alcuni contesti, ma nei campi nome e bio di Discord e Instagram può passare inosservato come un semplice spazio largo.",
    "faq_title": "Domande e Risposte",
    "faq_1_q": "Cos'è un carattere invisibile o una lettera invisibile?",
    "faq_1_a": "Un carattere invisibile (detto anche lettera invisibile, spazio vuoto o spazio invisibile) è un simbolo Unicode privo di rappresentazione visiva che esiste come carattere reale nel testo. Esempi popolari includono lo Spazio a Larghezza Zero (U+200B), il Riempitivo Hangul (U+3164) e il Braille Vuoto (U+2800). Sono ampiamente usati nelle app di messaggistica, nei giochi e nei social network.",
    "faq_2_q": "Come inviare un messaggio vuoto su WhatsApp?",
    "faq_2_a": "Per inviare un messaggio vuoto su WhatsApp, copia lo Spazio a Larghezza Zero (U+200B) o il Braille Vuoto (U+2800) con il nostro strumento, incollalo nel campo messaggio di WhatsApp e invia. Il destinatario vedrà un messaggio apparentemente vuoto.",
    "faq_3_q": "Come creare un nome vuoto su Discord?",
    "faq_3_a": "Il Riempitivo Hangul (U+3164) è la scelta più popolare per creare nomi vuoti su Discord. Copia il carattere con il nostro strumento, vai su Impostazioni Utente in Discord, clicca su Modifica Profilo e incollalo come nome visualizzato. Alcuni server potrebbero bloccare i nomi invisibili in base alle proprie policy.",
    "faq_4_q": "I caratteri invisibili sono sicuri da usare?",
    "faq_4_a": "Sì. I caratteri invisibili sono simboli Unicode standard e completamente sicuri — fanno parte della specifica Unicode e sono supportati da tutti i sistemi operativi moderni. Usali in modo responsabile ed evita di violare i termini di servizio di ciascuna piattaforma.",
    "faq_5_q": "Come rimuovere caratteri invisibili o spazi vuoti nascosti da un testo?",
    "faq_5_a": "Usa il Rilevatore di Caratteri Invisibili di questa pagina: incolla il testo nel campo di analisi e clicca su \"Rimuovi Invisibili\". Lo strumento identifica e rimuove automaticamente tutti i caratteri invisibili — come Zero Width Space, Riempitivo Hangul e Braille Vuoto — e mostra il testo pulito pronto da copiare. È particolarmente utile per testi copiati da PDF, editor di testo o messaggi WhatsApp che possono contenere caratteri nascosti.",
    "see1": "Lettere Speciali",
    "see2": "Lenny Face",
    "see3": "Simboli Speciali",
    "see4": "Convertitore di Testo"
  },
  "id": {
    "m_title": "Generator Spasi Kosong – Karakter Tak Terlihat Salin Tempel | FreeTool",
    "title": "Generator Spasi Kosong",
    "meta": "Buat dan salin spasi kosong dan karakter tak terlihat untuk WhatsApp, Discord, Instagram, dan game. Zero Width Space, Hangul Filler, Braille Kosong, dan lainnya.",
    "d1": "Karakter tak terlihat adalah simbol Unicode tanpa representasi visual yang ada di dalam teks. Karakter ini banyak digunakan untuk mengirim pesan kosong di WhatsApp, membuat nama kosong di Discord dan game seperti Valorant, atau memisahkan paragraf di caption Instagram dengan lebih elegan. Dengan alat ini, kamu bisa dengan mudah membuat dan menyalin berbagai jenis spasi kosong dan karakter tak terlihat — seperti Zero Width Space, Hangul Filler, dan Braille Kosong — dalam jumlah berapa pun. Platform kami juga menyediakan informasi kompatibilitas lengkap dan detektor bawaan untuk mendeteksi serta menghapus karakter tersembunyi dari teks apa pun.",
    "zwsp_name": "Spasi Lebar Nol",
    "hangul_name": "Pengisi Hangul",
    "braille_name": "Braille Kosong",
    "nbsp_name": "Spasi Tidak Putus",
    "zwnj_name": "Non-Penghubung Lebar Nol",
    "zwj_name": "Penghubung Lebar Nol",
    "wj_name": "Penghubung Kata",
    "nnbsp_name": "Spasi Sempit Tidak Putus",
    "ideographic_name": "Spasi Ideografis",
    "compat_label": "Berfungsi di:",
    "copy_btn": "Salin",
    "copied": "Disalin!",
    "copied_announce": "Karakter tak terlihat disalin ke clipboard",
    "quantity_singular": "spasi",
    "quantity_label": "spasi",
    "library_title": "Perpustakaan Karakter",
    "library_hint": "Pilih satu untuk disalin",
    "analyzer_title": "Detektor Karakter Tak Terlihat",
    "analyzer_desc": "Tempel teks apa pun untuk mendeteksi berapa banyak karakter tak terlihat yang ada dan menghapusnya dengan satu klik.",
    "analyzer_placeholder": "Tempel teks di sini untuk dianalisis...",
    "remove_btn": "Hapus yang Tak Terlihat",
    "detected_found": "{count} karakter tak terlihat ditemukan",
    "detected_none": "Tidak ada karakter tak terlihat ditemukan",
    "cleaned_result": "Teks tanpa karakter tak terlihat:",
    "empty_result": "(teks kosong setelah penghapusan)",
    "features_title": "Fitur",
    "f_1": "9 jenis karakter Unicode tak terlihat dengan label kompatibilitas per platform (WhatsApp, Discord, Instagram, dan lainnya).",
    "f_2": "Generator jumlah: buat 1 hingga 100 spasi tak terlihat sekaligus.",
    "f_3": "Detektor bawaan: identifikasi dan hapus karakter tak terlihat tersembunyi dari teks apa pun.",
    "f_4": "Pilihan visual dengan indikator platform yang menunjukkan karakter terbaik untuk setiap kasus penggunaan.",
    "hiw_title": "Cara Menggunakan",
    "hiw_1_title": "Pilih karakternya",
    "hiw_1_desc": "Pilih jenis karakter tak terlihat dari perpustakaan. Masing-masing memiliki sifat unik dan paling cocok untuk platform tertentu — label berwarna menunjukkan di mana setiap karakter kompatibel.",
    "hiw_2_title": "Atur jumlahnya",
    "hiw_2_desc": "Gunakan kontrol jumlah untuk membuat antara 1 hingga 100 spasi. Beberapa aplikasi memerlukan jumlah karakter minimum untuk menerima kolom isian.",
    "hiw_3_title": "Salin dan tempel",
    "hiw_3_desc": "Klik tombol Salin dan tempel di mana pun kamu butuhkan: WhatsApp, Discord, Instagram, Valorant, Roblox, atau kolom teks apa pun.",
    "chars_section_title": "Panduan Karakter Tak Terlihat",
    "zwsp_desc": "Spasi Lebar Nol adalah karakter tak terlihat yang paling populer dan paling banyak didukung. Berfungsi di WhatsApp untuk membuat pesan kosong, di Discord untuk memisahkan teks tanpa spasi yang terlihat, dan di Instagram untuk memformat caption dan bio. Karena tidak memakan lebar visual, karakter ini tidak terlihat oleh pembaca namun tetap ada sebagai karakter nyata dalam teks.",
    "hangul_desc": "Pengisi Hangul adalah karakter dari alfabet Korea yang digunakan sebagai ruang kosong di nama pengguna dan julukan. Ini adalah pilihan utama untuk membuat nama tak terlihat di Discord, Valorant, Roblox, dan Minecraft, karena sebagian besar sistem menerimanya tanpa memblokir. Berbeda dengan Spasi Lebar Nol, karakter ini menempati sedikit lebar, yang mungkin diperlukan ketika sistem mengharuskan setidaknya satu karakter yang terlihat.",
    "braille_desc": "Braille Kosong adalah titik kode U+2800 dalam sistem Braille, yang mewakili sel kosong tanpa titik timbul. Secara visual tidak bisa dibedakan dari spasi biasa, karakter ini banyak digunakan di Discord, Twitter/X, WhatsApp, dan Instagram. Sangat berguna untuk membuat baris kosong di bio dan caption Instagram, di mana spasi biasa dihapus secara otomatis.",
    "nbsp_desc": "Spasi Tidak Putus mencegah baris terputus di antara dua kata. Secara visual identik dengan spasi biasa, tetapi sistem tidak memperlakukannya sebagai pemisah kata. Didukung luas di WhatsApp, Instagram, Telegram, dan Facebook. Berbeda dengan karakter tak terlihat lainnya, karakter ini memiliki lebar yang sama dengan spasi normal.",
    "zwnj_desc": "Non-Penghubung Lebar Nol mencegah ligatur antara dua karakter yang berdekatan tanpa menambahkan spasi visual. Awalnya dibuat untuk bahasa seperti Arab dan Persia, di mana huruf-huruf bergabung secara otomatis. Di media sosial, digunakan untuk memisahkan teks secara tak terlihat di Discord dan Telegram.",
    "zwj_desc": "Penghubung Lebar Nol adalah kebalikan dari ZWNJ: memaksa penggabungan visual antara karakter yang berdekatan. Banyak digunakan untuk membuat emoji gabungan — seperti emoji keluarga yang terdiri dari beberapa emoji yang dihubungkan oleh ZWJ. Di Discord dan Twitter juga berfungsi sebagai pemisah tak terlihat dalam teks.",
    "wj_desc": "Penghubung Kata berfungsi seperti Spasi Lebar Nol, tetapi dengan perbedaan penting: mencegah baris terputus di tempat ia disisipkan. Berguna ketika kamu ingin pemisah tak terlihat yang memastikan teks tidak terpecah antar baris, menjaga kata-kata tetap bersama di Discord, Twitter, dan Instagram.",
    "nnbsp_desc": "Spasi Sempit Tidak Putus adalah spasi dengan lebar yang lebih kecil dari spasi normal yang juga mencegah pemisahan baris. Digunakan dalam tipografi formal untuk memisahkan angka dari satuan atau sebelum tanda baca dalam bahasa Prancis. Di media sosial, muncul sebagai spasi yang sangat halus dan hampir tak terlihat di Twitter dan Discord.",
    "ideographic_desc": "Spasi Ideografis adalah spasi lebar penuh (full-width) yang berasal dari sistem penulisan Asia Timur, seperti Jepang dan Cina. Secara visual menempati dua kali lebar spasi Barat standar. Bisa terlihat dalam beberapa konteks, tetapi di kolom nama dan bio Discord serta Instagram bisa luput dari perhatian sebagai spasi lebar biasa.",
    "faq_title": "Pertanyaan Umum",
    "faq_1_q": "Apa itu karakter tak terlihat atau huruf tak terlihat?",
    "faq_1_a": "Karakter tak terlihat (disebut juga huruf tak terlihat, spasi kosong, atau spasi tak terlihat) adalah simbol Unicode tanpa representasi visual yang ada sebagai karakter nyata dalam teks. Contoh populer meliputi Spasi Lebar Nol (U+200B), Pengisi Hangul (U+3164), dan Braille Kosong (U+2800). Karakter-karakter ini banyak digunakan di aplikasi pesan, game, dan media sosial.",
    "faq_2_q": "Cara mengirim pesan kosong di WhatsApp?",
    "faq_2_a": "Untuk mengirim pesan kosong di WhatsApp, salin Spasi Lebar Nol (U+200B) atau Braille Kosong (U+2800) menggunakan alat kami, tempel di kolom pesan WhatsApp, lalu kirim. Penerima akan melihat pesan yang tampaknya kosong.",
    "faq_3_q": "Cara membuat nama kosong di Discord?",
    "faq_3_a": "Pengisi Hangul (U+3164) adalah pilihan paling populer untuk membuat nama kosong di Discord. Salin karakternya dengan alat kami, buka Pengaturan Pengguna di Discord, klik Edit Profil, dan tempel sebagai nama tampilan kamu. Beberapa server mungkin memblokir nama tak terlihat berdasarkan kebijakan mereka sendiri.",
    "faq_4_q": "Apakah karakter tak terlihat aman digunakan?",
    "faq_4_a": "Ya. Karakter tak terlihat adalah simbol Unicode standar dan sepenuhnya aman — merupakan bagian dari spesifikasi Unicode dan didukung oleh semua sistem operasi modern. Gunakan dengan bertanggung jawab dan hindari melanggar ketentuan layanan setiap platform.",
    "faq_5_q": "Cara menghapus karakter tak terlihat atau spasi tersembunyi dari teks?",
    "faq_5_a": "Gunakan Detektor Karakter Tak Terlihat di halaman ini: tempel teks ke kolom analisis dan klik \"Hapus yang Tak Terlihat\". Alat ini secara otomatis mengidentifikasi dan menghapus semua karakter tak terlihat — seperti Zero Width Space, Pengisi Hangul, dan Braille Kosong — lalu menampilkan teks bersih yang siap disalin. Sangat berguna untuk teks yang disalin dari PDF, pengolah kata, atau pesan WhatsApp yang mungkin mengandung karakter tersembunyi.",
    "see1": "Huruf Mewah",
    "see2": "Lenny Face",
    "see3": "Simbol Khusus",
    "see4": "Konverter Teks"
  },
  "de": {
    "m_title": "Generator für Unsichtbare Zeichen – Leerzeichen Kopieren Einfügen | FreeTool",
    "title": "Generator für Unsichtbare Zeichen",
    "meta": "Erstelle und kopiere unsichtbare Zeichen und Leerzeichen für WhatsApp, Discord, Instagram und Spiele. Zero Width Space, Hangul Filler, Braille Leer und mehr.",
    "d1": "Unsichtbare Zeichen sind Unicode-Symbole ohne visuelle Darstellung, die im Text vorhanden sind. Sie werden häufig verwendet, um leere Nachrichten auf WhatsApp zu senden, leere Namen auf Discord und in Spielen wie Valorant zu erstellen oder Absätze in Instagram-Bildunterschriften eleganter zu trennen. Mit diesem Tool kannst du ganz einfach verschiedene Arten von Leerzeichen und unsichtbaren Zeichen generieren und kopieren — wie Zero Width Space, Hangul Filler und Braille Leer — in beliebiger Anzahl. Unsere Plattform bietet außerdem detaillierte Kompatibilitätsinformationen und einen integrierten Detektor, um versteckte Zeichen in jedem Text zu erkennen und zu entfernen.",
    "zwsp_name": "Leerzeichen mit Nullbreite",
    "hangul_name": "Hangul-Füller",
    "braille_name": "Braille Leer",
    "nbsp_name": "Geschütztes Leerzeichen",
    "zwnj_name": "Nicht-Verbinder mit Nullbreite",
    "zwj_name": "Verbinder mit Nullbreite",
    "wj_name": "Wortverbinder",
    "nnbsp_name": "Schmales geschütztes Leerzeichen",
    "ideographic_name": "Ideografisches Leerzeichen",
    "compat_label": "Funktioniert auf:",
    "copy_btn": "Kopieren",
    "copied": "Kopiert!",
    "copied_announce": "Unsichtbares Zeichen in die Zwischenablage kopiert",
    "quantity_singular": "Leerzeichen",
    "quantity_label": "Leerzeichen",
    "library_title": "Zeichenbibliothek",
    "library_hint": "Eines auswählen zum Kopieren",
    "analyzer_title": "Detektor für Unsichtbare Zeichen",
    "analyzer_desc": "Füge einen beliebigen Text ein, um zu erkennen, wie viele unsichtbare Zeichen er enthält, und entferne sie mit einem Klick.",
    "analyzer_placeholder": "Text hier einfügen zum Analysieren...",
    "remove_btn": "Unsichtbare Entfernen",
    "detected_found": "{count} unsichtbares/unsichtbare Zeichen gefunden",
    "detected_none": "Keine unsichtbaren Zeichen gefunden",
    "cleaned_result": "Text ohne unsichtbare Zeichen:",
    "empty_result": "(Text war nach der Entfernung leer)",
    "features_title": "Funktionen",
    "f_1": "9 Typen unsichtbarer Unicode-Zeichen mit farbigen Kompatibilitätsetiketten pro Plattform (WhatsApp, Discord, Instagram und mehr).",
    "f_2": "Mengengenerator: erstelle 1 bis 100 unsichtbare Leerzeichen auf einmal.",
    "f_3": "Integrierter Detektor: erkenne und entferne versteckte unsichtbare Zeichen in jedem eingefügten Text.",
    "f_4": "Visuelle Auswahl mit Plattform-Indikatoren, die das beste Zeichen für jeden Anwendungsfall zeigen.",
    "hiw_title": "Anleitung",
    "hiw_1_title": "Zeichen auswählen",
    "hiw_1_desc": "Wähle den Typ des unsichtbaren Zeichens aus der Bibliothek. Jedes hat einzigartige Eigenschaften und funktioniert am besten auf bestimmten Plattformen — die farbigen Etiketten zeigen, wo jedes kompatibel ist.",
    "hiw_2_title": "Menge festlegen",
    "hiw_2_desc": "Verwende die Mengensteuerung, um zwischen 1 und 100 Leerzeichen zu generieren. Einige Apps erfordern eine Mindestanzahl von Zeichen, um ein Feld zu akzeptieren.",
    "hiw_3_title": "Kopieren und einfügen",
    "hiw_3_desc": "Klicke auf die Schaltfläche Kopieren und füge es ein, wo immer du es brauchst: WhatsApp, Discord, Instagram, Valorant, Roblox oder ein beliebiges Textfeld.",
    "chars_section_title": "Leitfaden für Unsichtbare Zeichen",
    "zwsp_desc": "Das Leerzeichen mit Nullbreite ist das beliebteste und am weitesten unterstützte unsichtbare Zeichen. Es funktioniert auf WhatsApp zum Erstellen leerer Nachrichten, auf Discord zum Trennen von Text ohne sichtbaren Abstand und auf Instagram zum Formatieren von Bildunterschriften und Bios. Da es keine visuelle Breite einnimmt, ist es für den Leser unsichtbar, existiert aber als echtes Zeichen im Text.",
    "hangul_desc": "Der Hangul-Füller ist ein Zeichen aus dem koreanischen Alphabet, das als leerer Platzhalter in Benutzernamen und Spitznamen verwendet wird. Er ist die bevorzugte Wahl für unsichtbare Namen auf Discord, Valorant, Roblox und Minecraft, da die meisten dieser Systeme ihn ohne Blockierung akzeptieren. Im Gegensatz zum Leerzeichen mit Nullbreite nimmt er eine kleine Breite ein, was nötig sein kann, wenn das System mindestens ein sichtbares Zeichen erfordert.",
    "braille_desc": "Braille Leer ist der Codepunkt U+2800 im Braille-System und repräsentiert eine leere Zelle ohne erhabene Punkte. Optisch nicht von einem Leerzeichen zu unterscheiden, wird es häufig auf Discord, Twitter/X, WhatsApp und Instagram verwendet. Es ist besonders nützlich zum Erstellen leerer Zeilen in Instagram-Bios und -Bildunterschriften, wo normale Leerzeichen automatisch entfernt werden.",
    "nbsp_desc": "Das geschützte Leerzeichen verhindert einen Zeilenumbruch zwischen zwei Wörtern. Optisch identisch mit einem normalen Leerzeichen, aber Systeme behandeln es nicht als Worttrennzeichen. Es wird auf WhatsApp, Instagram, Telegram und Facebook weitgehend unterstützt. Im Gegensatz zu anderen unsichtbaren Zeichen nimmt es die gleiche Breite wie ein normales Leerzeichen ein.",
    "zwnj_desc": "Der Nicht-Verbinder mit Nullbreite verhindert Ligaturen zwischen zwei benachbarten Zeichen, ohne visuellen Abstand hinzuzufügen. Er wurde ursprünglich für Sprachen wie Arabisch und Persisch entwickelt, wo Buchstaben automatisch verbunden werden. In sozialen Medien wird er verwendet, um Text auf Discord und Telegram unsichtbar zu trennen.",
    "zwj_desc": "Der Verbinder mit Nullbreite ist das Gegenteil des ZWNJ: Er erzwingt eine visuelle Verbindung zwischen benachbarten Zeichen. Er wird häufig verwendet, um zusammengesetzte Emojis zu erstellen — wie eine Familie aus mehreren durch ZWJ verbundenen Emojis. Auf Discord und Twitter dient er auch als unsichtbarer Trenner in Texten.",
    "wj_desc": "Der Wortverbinder funktioniert wie das Leerzeichen mit Nullbreite, aber mit einem wichtigen Unterschied: Er verhindert einen Zeilenumbruch an der Stelle, an der er eingefügt wird. Er ist nützlich, wenn du einen unsichtbaren Trenner möchtest, der sicherstellt, dass der Text nicht zwischen Zeilen aufgeteilt wird, und Wörter auf Discord, Twitter und Instagram zusammenhält.",
    "nnbsp_desc": "Das schmale geschützte Leerzeichen ist ein Leerzeichen mit reduzierter Breite (schmaler als ein normales Leerzeichen), das auch Zeilenumbrüche verhindert. Es wird in der formalen Typografie verwendet, um Zahlen von Einheiten oder vor Satzzeichen im Französischen zu trennen. In sozialen Medien erscheint es als sehr subtiler, fast unsichtbarer Abstand auf Twitter und Discord.",
    "ideographic_desc": "Das ideografische Leerzeichen ist ein vollbreites Leerzeichen aus ostasiatischen Schriftsystemen wie Japanisch und Chinesisch. Es nimmt optisch die doppelte Breite eines westlichen Standardleerzeichens ein. Es kann in einigen Kontexten auffallen, aber in Name- und Bio-Feldern von Discord und Instagram kann es als einfaches breites Leerzeichen unbemerkt bleiben.",
    "faq_title": "Häufig Gestellte Fragen",
    "faq_1_q": "Was ist ein unsichtbares Zeichen oder ein unsichtbarer Buchstabe?",
    "faq_1_a": "Ein unsichtbares Zeichen (auch unsichtbarer Buchstabe, Leerzeichen oder unsichtbarer Abstand genannt) ist ein Unicode-Symbol ohne visuelle Darstellung, das als echtes Zeichen im Text existiert. Bekannte Beispiele sind das Leerzeichen mit Nullbreite (U+200B), der Hangul-Füller (U+3164) und Braille Leer (U+2800). Sie werden häufig in Messaging-Apps, Spielen und sozialen Netzwerken verwendet.",
    "faq_2_q": "Wie sendet man eine leere Nachricht auf WhatsApp?",
    "faq_2_a": "Um eine leere Nachricht auf WhatsApp zu senden, kopiere das Leerzeichen mit Nullbreite (U+200B) oder Braille Leer (U+2800) mit unserem Tool, füge es in das WhatsApp-Nachrichtenfeld ein und sende es ab. Der Empfänger sieht eine scheinbar leere Nachricht.",
    "faq_3_q": "Wie erstellt man einen leeren Namen auf Discord?",
    "faq_3_a": "Der Hangul-Füller (U+3164) ist die beliebteste Wahl für leere Namen auf Discord. Kopiere das Zeichen mit unserem Tool, gehe zu den Benutzereinstellungen auf Discord, klicke auf Profil bearbeiten und füge es als Anzeigenamen ein. Einige Server können unsichtbare Namen aufgrund ihrer eigenen Richtlinien blockieren.",
    "faq_4_q": "Sind unsichtbare Zeichen sicher zu verwenden?",
    "faq_4_a": "Ja. Unsichtbare Zeichen sind Standard-Unicode-Symbole und vollständig sicher — sie sind Teil der Unicode-Spezifikation und werden von allen modernen Betriebssystemen unterstützt. Verwende sie verantwortungsbewusst und vermeide Verstöße gegen die Nutzungsbedingungen der jeweiligen Plattform.",
    "faq_5_q": "Wie entfernt man unsichtbare Zeichen oder versteckte Leerzeichen aus einem Text?",
    "faq_5_a": "Verwende den Detektor für Unsichtbare Zeichen auf dieser Seite: Füge den Text in das Analysefeld ein und klicke auf \"Unsichtbare Entfernen\". Das Tool erkennt und entfernt automatisch alle unsichtbaren Zeichen — wie Zero Width Space, Hangul-Füller und Braille Leer — und zeigt den bereinigten Text zum Kopieren an. Dies ist besonders nützlich für Texte, die aus PDFs, Textverarbeitungsprogrammen oder WhatsApp-Nachrichten kopiert wurden und versteckte Zeichen enthalten können.",
    "see1": "Besondere Buchstaben",
    "see2": "Lenny Face",
    "see3": "Sonderzeichen",
    "see4": "Text-Konverter"
  },
  "nl": {
    "m_title": "Generator voor Onzichtbare Tekens – Lege Ruimte Kopiëren Plakken | FreeTool",
    "title": "Generator voor Onzichtbare Tekens",
    "meta": "Maak en kopieer onzichtbare tekens en lege spaties voor WhatsApp, Discord, Instagram en games. Zero Width Space, Hangul Filler, Braille Leeg en meer.",
    "d1": "Onzichtbare tekens zijn Unicode-symbolen zonder visuele weergave die in tekst bestaan. Ze worden veel gebruikt om lege berichten op WhatsApp te sturen, lege namen op Discord en in games zoals Valorant aan te maken, of alinea's in Instagram-onderschriften eleganter te scheiden. Met dit hulpmiddel kun je eenvoudig verschillende soorten lege spaties en onzichtbare tekens genereren en kopiëren — zoals Zero Width Space, Hangul Filler en Braille Leeg — in elke gewenste hoeveelheid. Ons platform biedt ook gedetailleerde compatibiliteitsinformatie en een ingebouwde detector om verborgen tekens in elke tekst te identificeren en te verwijderen.",
    "zwsp_name": "Nulbreedte Spatie",
    "hangul_name": "Hangul Opvulling",
    "braille_name": "Braille Leeg",
    "nbsp_name": "Vaste Spatie",
    "zwnj_name": "Nulbreedte Niet-verbinder",
    "zwj_name": "Nulbreedte Verbinder",
    "wj_name": "Woordverbinder",
    "nnbsp_name": "Smalle Vaste Spatie",
    "ideographic_name": "Ideografische Spatie",
    "compat_label": "Werkt op:",
    "copy_btn": "Kopiëren",
    "copied": "Gekopieerd!",
    "copied_announce": "Onzichtbaar teken gekopieerd naar klembord",
    "quantity_singular": "spatie",
    "quantity_label": "spaties",
    "library_title": "Tekenbibliotheek",
    "library_hint": "Selecteer er één om te kopiëren",
    "analyzer_title": "Detector voor Onzichtbare Tekens",
    "analyzer_desc": "Plak een willekeurige tekst om te detecteren hoeveel onzichtbare tekens erin zitten en verwijder ze met één klik.",
    "analyzer_placeholder": "Plak de tekst hier om te analyseren...",
    "remove_btn": "Verwijder Onzichtbare",
    "detected_found": "{count} onzichtbaar/onzichtbare teken(s) gevonden",
    "detected_none": "Geen onzichtbare tekens gevonden",
    "cleaned_result": "Tekst zonder onzichtbare tekens:",
    "empty_result": "(tekst was leeg na verwijdering)",
    "features_title": "Functies",
    "f_1": "9 soorten onzichtbare Unicode-tekens met gekleurde compatibiliteitslabels per platform (WhatsApp, Discord, Instagram en meer).",
    "f_2": "Hoeveelheidsgenerator: maak 1 tot 100 onzichtbare spaties tegelijk.",
    "f_3": "Ingebouwde detector: identificeer en verwijder verborgen onzichtbare tekens uit elke geplakte tekst.",
    "f_4": "Visuele selectie met platformindicatoren die het beste teken voor elk gebruiksscenario tonen.",
    "hiw_title": "Hoe Te Gebruiken",
    "hiw_1_title": "Kies het teken",
    "hiw_1_desc": "Selecteer het type onzichtbaar teken uit de bibliotheek. Elk heeft unieke eigenschappen en werkt het best op specifieke platforms — de gekleurde labels tonen waar elk teken compatibel is.",
    "hiw_2_title": "Stel de hoeveelheid in",
    "hiw_2_desc": "Gebruik de hoeveelheidsregelaar om tussen 1 en 100 spaties te genereren. Sommige apps vereisen een minimum aantal tekens om een veld te accepteren.",
    "hiw_3_title": "Kopieer en plak",
    "hiw_3_desc": "Klik op de knop Kopiëren en plak waar je het nodig hebt: WhatsApp, Discord, Instagram, Valorant, Roblox of een willekeurig tekstveld.",
    "chars_section_title": "Gids voor Onzichtbare Tekens",
    "zwsp_desc": "De Nulbreedte Spatie is het meest populaire en breed ondersteunde onzichtbare teken. Het werkt op WhatsApp om lege berichten te maken, op Discord om tekst te scheiden zonder zichtbare ruimte, en op Instagram om onderschriften en bio's op te maken. Omdat het geen visuele breedte inneemt, is het onwaarneembaar voor de lezer maar bestaat het als een echt teken in de tekst.",
    "hangul_desc": "De Hangul Opvulling is een teken uit het Koreaanse alfabet dat als lege plaatshouder wordt gebruikt in gebruikersnamen en bijnamen. Het is de voorkeursoptie voor het maken van onzichtbare namen op Discord, Valorant, Roblox en Minecraft, omdat de meeste van deze systemen het accepteren zonder het te blokkeren. In tegenstelling tot de Nulbreedte Spatie neemt het een kleine breedte in, wat nodig kan zijn wanneer het systeem minimaal één zichtbaar teken vereist.",
    "braille_desc": "Braille Leeg is codepunt U+2800 in het Braille-systeem, dat een lege cel zonder verheven punten vertegenwoordigt. Visueel niet te onderscheiden van een spatie, wordt het veel gebruikt op Discord, Twitter/X, WhatsApp en Instagram. Het is bijzonder nuttig voor het maken van lege regels in Instagram-bio's en -onderschriften, waar gewone spaties automatisch worden verwijderd.",
    "nbsp_desc": "De Vaste Spatie voorkomt een regelafbreking tussen twee woorden. Visueel identiek aan een gewone spatie, maar systemen behandelen het niet als een woordscheidingsteken. Het wordt breed ondersteund op WhatsApp, Instagram, Telegram en Facebook. In tegenstelling tot andere onzichtbare tekens neemt het dezelfde breedte in als een normale spatie.",
    "zwnj_desc": "De Nulbreedte Niet-verbinder voorkomt ligaturen tussen twee aangrenzende tekens zonder visuele ruimte toe te voegen. Oorspronkelijk gemaakt voor talen zoals Arabisch en Perzisch, waar letters automatisch worden verbonden. Op sociale media wordt het gebruikt om tekst onzichtbaar te scheiden op Discord en Telegram.",
    "zwj_desc": "De Nulbreedte Verbinder is het tegenovergestelde van de ZWNJ: het forceert een visuele verbinding tussen aangrenzende tekens. Het wordt veel gebruikt om samengestelde emoji's te maken — zoals een gezinsemoji bestaande uit meerdere emoji's verbonden door ZWJ. Op Discord en Twitter dient het ook als onzichtbare scheider in teksten.",
    "wj_desc": "De Woordverbinder werkt als de Nulbreedte Spatie, maar met een belangrijk verschil: het voorkomt een regelafbreking op het punt waar het is ingevoegd. Het is handig wanneer je een onzichtbare scheider wilt die ervoor zorgt dat tekst niet over regels wordt gesplitst, waardoor woorden samen blijven op Discord, Twitter en Instagram.",
    "nnbsp_desc": "De Smalle Vaste Spatie is een spatie met verminderde breedte (smaller dan een normale spatie) die ook regelafbrekingen voorkomt. Het wordt gebruikt in formele typografie om getallen van eenheden te scheiden of voor leestekens in het Frans. Op sociale media verschijnt het als een zeer subtiele, bijna onzichtbare ruimte op Twitter en Discord.",
    "ideographic_desc": "De Ideografische Spatie is een volledige breedte spatie afkomstig uit Oost-Aziatische schrijfsystemen zoals Japans en Chinees. Visueel neemt het de dubbele breedte in van een standaard westerse spatie. Het kan opvallen in sommige contexten, maar in naam- en bio-velden op Discord en Instagram kan het onopgemerkt blijven als een eenvoudige brede spatie.",
    "faq_title": "Veelgestelde Vragen",
    "faq_1_q": "Wat is een onzichtbaar teken of onzichtbare letter?",
    "faq_1_a": "Een onzichtbaar teken (ook onzichtbare letter, lege ruimte of onzichtbare spatie genoemd) is een Unicode-symbool zonder visuele weergave dat als een echt teken in tekst bestaat. Populaire voorbeelden zijn Nulbreedte Spatie (U+200B), Hangul Opvulling (U+3164) en Braille Leeg (U+2800). Ze worden veel gebruikt in berichtenapps, games en sociale netwerken.",
    "faq_2_q": "Hoe stuur je een leeg bericht op WhatsApp?",
    "faq_2_a": "Om een leeg bericht op WhatsApp te sturen, kopieer je de Nulbreedte Spatie (U+200B) of Braille Leeg (U+2800) met ons hulpmiddel, plak het in het WhatsApp-berichtveld en verstuur. De ontvanger ziet een schijnbaar leeg bericht.",
    "faq_3_q": "Hoe maak je een lege naam op Discord?",
    "faq_3_a": "De Hangul Opvulling (U+3164) is de meest populaire keuze voor lege namen op Discord. Kopieer het teken met ons hulpmiddel, ga naar Gebruikersinstellingen op Discord, klik op Profiel Bewerken en plak het als je weergavenaam. Sommige servers kunnen onzichtbare namen blokkeren op basis van hun eigen beleid.",
    "faq_4_q": "Zijn onzichtbare tekens veilig te gebruiken?",
    "faq_4_a": "Ja. Onzichtbare tekens zijn standaard Unicode-symbolen en volledig veilig — ze maken deel uit van de Unicode-specificatie en worden ondersteund door alle moderne besturingssystemen. Gebruik ze verantwoordelijk en vermijd schending van de gebruiksvoorwaarden van elk platform.",
    "faq_5_q": "Hoe verwijder je onzichtbare tekens of verborgen spaties uit een tekst?",
    "faq_5_a": "Gebruik de Detector voor Onzichtbare Tekens op deze pagina: plak de tekst in het analyseveld en klik op \"Verwijder Onzichtbare\". Het hulpmiddel identificeert en verwijdert automatisch alle onzichtbare tekens — zoals Zero Width Space, Hangul Opvulling en Braille Leeg — en toont de schone tekst klaar om te kopiëren. Dit is bijzonder handig voor teksten gekopieerd uit PDF's, tekstverwerkers of WhatsApp-berichten die verborgen tekens kunnen bevatten.",
    "see1": "Bijzondere Letters",
    "see2": "Lenny Face",
    "see3": "Speciale Symbolen",
    "see4": "Tekstconverter"
  },
  "ru": {
    "m_title": "Невидимый символ – скопировать и вставить пустой символ | FreeTool",
    "title": "Генератор невидимых символов",
    "meta": "Создавайте и копируйте невидимые символы, пустые пробелы и скрытые буквы для WhatsApp, Discord, Instagram и игр. Поддержка Zero Width Space, Hangul Filler и других форматов.",
    "d1": "Невидимые символы — это специальные знаки Unicode, которые не имеют визуального отображения, но присутствуют в тексте как реальные символы. Они широко используются для отправки пустых сообщений в WhatsApp, создания «невидимых» ников в Discord и играх вроде Valorant, а также для красивого разделения абзацев в Instagram. Наш генератор позволяет легко создавать и копировать различные виды пустых пространств и невидимых букв (таких как Zero Width Space, Hangul Filler и Braille Blank) в любом необходимом количестве. Мы также предоставляем подробную информацию о совместимости и встроенный анализатор для поиска и быстрого удаления скрытых символов из любого готового текста.",
    "zwsp_name": "Пробел нулевой ширины (ZWSP)",
    "hangul_name": "Заполнитель Хангыль",
    "braille_name": "Пустой шрифт Брайля",
    "nbsp_name": "Неразрывный пробел (NBSP)",
    "zwnj_name": "Несоединитель нулевой ширины (ZWNJ)",
    "zwj_name": "Соединитель нулевой ширины (ZWJ)",
    "wj_name": "Соединитель слов (WJ)",
    "nnbsp_name": "Узкий неразрывный пробел (NNBSP)",
    "ideographic_name": "Идеографический пробел",
    "compat_label": "Совместимо с:",
    "copy_btn": "Копировать",
    "copied": "Скопировано!",
    "copied_announce": "Невидимый символ скопирован в буфер обмена",
    "quantity_singular": "символ",
    "quantity_label": "символов",
    "library_title": "Библиотека символов",
    "library_hint": "Выберите для копирования",
    "analyzer_title": "Детектор невидимых символов",
    "analyzer_desc": "Вставьте любой текст, чтобы узнать, сколько невидимых символов в нем скрыто, и мгновенно удалить их.",
    "analyzer_placeholder": "Вставьте текст сюда для анализа...",
    "remove_btn": "Удалить невидимые символы",
    "detected_found": "Найдено невидимых символов: {count}",
    "detected_none": "Невидимых символов не обнаружено",
    "cleaned_result": "Текст без невидимых символов:",
    "empty_result": "(текст стал полностью пустым после удаления)",
    "features_title": "Возможности",
    "f_1": "9 типов невидимых символов Unicode с индикаторами совместимости для популярных платформ (WhatsApp, Discord, Instagram и др.).",
    "f_2": "Генератор количества: создавайте от 1 до 100 пустых пробелов за один клик.",
    "f_3": "Встроенный детектор: находите и стирайте скрытые невидимые символы из любого скопированного текста.",
    "f_4": "Удобный интерфейс с подсказками по выбору лучшего символа под конкретную задачу.",
    "hiw_title": "Как использовать",
    "hiw_1_title": "Выберите символ",
    "hiw_1_desc": "Выберите подходящий тип невидимого символа в библиотеке. Каждый из них обладает своими свойствами — цветные теги подскажут, с какими приложениями он совместим.",
    "hiw_2_title": "Укажите количество",
    "hiw_2_desc": "Настройте количество для генерации (от 1 до 100 копий). Некоторым системам требуется минимальное количество знаков, чтобы принять пустое поле.",
    "hiw_3_title": "Скопируйте и вставьте",
    "hiw_3_desc": "Нажмите «Копировать» и используйте полученный символ в WhatsApp, Discord, Instagram, Valorant, Roblox или любом другом текстовом полем.",
    "chars_section_title": "Справочник по невидимым символам",
    "zwsp_desc": "Пробел нулевой ширины (Zero Width Space) — самый популярный и универсальный невидимый символ. Подходит для WhatsApp (отправка пустых сообщений), Discord (разделение текста без пробела) и Instagram (форматирование описаний и био). Он не занимает визуального места на экране, но технически присутствует в строке.",
    "hangul_desc": "Заполнитель Хангыль (Hangul Filler) — специальный корейский символ, используемый в качестве пустого знака в никнеймах и именах пользователей. Отлично подходит для создания пустых ников в Discord, Valorant, Roblox and Minecraft, так как большинство игровых платформ не блокируют его. Он имеет небольшую физическую ширину, что помогает обходить проверки на минимальную длину имени.",
    "braille_desc": "Пустой шрифт Брайля (Braille Blank) — это кодовая точка U+2800 в системе Брайля, обозначающая пустую ячейку без выпуклых точек. Визуально он неотличим от обычного пробела, но широко используется в Discord, Twitter/X, WhatsApp и Instagram. Особенно полезен для создания пустых строк в описаниях профилей Instagram, где обычные переводы строк часто сбрасываются.",
    "nbsp_desc": "Неразрывный пробел (Non-Breaking Space) предотвращает автоматический перенос строки на месте пробела. Внешне он идентичен обычному пробелу, но системы не расценивают его как разделитель слов. Имеет отличную поддержку в WhatsApp, Instagram, Telegram и Facebook, сохраняя стандартную ширину обычного пробела.",
    "zwnj_desc": "Несоединитель нулевой ширины (Zero Width Non-Joiner) запрещает слияние соседних букв (лигатур) без добавления видимого расстояния между ними. Исторически создан для языков со сложной вязью (например, персидского или арабского). В социальных сетях (Discord, Telegram) используется как скрытый разделитель.",
    "zwj_desc": "Соединитель нулевой ширины (Zero Width Joiner) является противоположностью ZWNJ. Он принудительно объединяет стоящие рядом символы. Чаще всего применяется для сборки составных эмодзи (например, эмодзи семьи, состоящего из нескольких отдельных знаков). В Discord и Twitter также служит невидимым маркером.",
    "wj_desc": "Соединитель слов (Word Joiner) ведет себя аналогично пробелу нулевой ширины, но при этом жестко связывает слова по обе стороны от себя, запрещая перенос строки в этой точке. Помогает сохранять целостность фраз в Discord, Twitter и Instagram без добавления видимых отступов.",
    "nnbsp_desc": "Узкий неразрывный пробел (Narrow No-Break Space) имеет меньшую ширину, чем стандартный пробел, и также препятствует переносу строки. Часто применяется в типографике (например, для отделения чисел от единиц измерения или перед знаками препинания во французском языке). Почти незаметен в Discord и Twitter.",
    "ideographic_desc": "Идеографический пробел (Ideographic Space) — это широкий пробел (full-width), пришедший из восточноазиатских письменностей (японской, китайской). Он занимает в два раза больше места, чем обычный латинский пробел. В полях профиля Discord или Instagram он может выглядеть просто как длинный пустой отступ.",
    "faq_title": "Вопросы и ответы",
    "faq_1_q": "Что такое невидимый символ или пустая буква?",
    "faq_1_a": "Невидимый символ (или пустая буква, скрытый пробел) — это знак в стандарте Unicode, который не имеет графического очертания, но считывается системами как полноценный текстовый символ. Самые популярные примеры: пробел нулевой ширины (U+200B), заполнитель хангыль (U+3164) и пустой знак Брайля (U+2800). Они очень популярны в мессенджерах, социальных сетях и играх.",
    "faq_2_q": "Как отправить пустое сообщение в WhatsApp?",
    "faq_2_a": "Чтобы отправить абсолютно пустое сообщение в WhatsApp, скопируйте пробел нулевой ширины (U+200B) или пустой знак Брайля (U+2800) с помощью нашего генератора, вставьте его в поле ввода чата WhatsApp и нажмите отправить. Ваш собеседник получит сообщение без текста.",
    "faq_3_q": "Как сделать пустой ник в Discord?",
    "faq_3_a": "Для создания пустого или невидимого имени в Discord чаще всего используют заполнитель Хангыль (U+3164). Скопируйте его на нашем сайте, зайдите в настройки профиля Discord и вставьте в поле «Отображаемое имя». Пожалуйста, учитывайте, что некоторые серверы могут модерировать подобные ники.",
    "faq_4_q": "Безопасно ли использовать скрытые невидимые символы?",
    "faq_4_a": "Да. Все невидимые символы являются частью официальной универсальной спецификации Unicode и полностью поддерживаются всеми современными операционными системами (Android, iOS, Windows, macOS). Используйте их ответственно и в соответствии с правилами конкретных платформ.",
    "faq_5_q": "Как быстро найти и удалить скрытые пробелы или невидимые знаки из текста?",
    "faq_5_a": "Используйте встроенный детектор на этой странице: вставьте ваш текст в поле анализатора и нажмите «Удалить невидимые символы». Инструмент мгновенно отсканирует текст, определит точное количество невидимых знаков и полностью вырежет их, оставив чистый и готовый к копированию текст. Это крайне полезно при очистке скопированных материалов из PDF-файлов, текстовых редакторов или сообщений.",
    "see1": "Красивые буквы",
    "see2": "Lenny Face",
    "see3": "Специальные символы",
    "see4": "Конвертер текста"
  }
}
</i18n>
