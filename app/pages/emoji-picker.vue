<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })

const COPY_FEEDBACK_MS = 2000
const MAX_RECENT = 10

interface EmojiItem { char: string; name: string; group: string }

const emojiCategories = [
  { icon: '😀', name: 'cat_smileys',    desc: 'cat_smileys_d'    },
  { icon: '👋', name: 'cat_gestures',   desc: 'cat_gestures_d'   },
  { icon: '🧑', name: 'cat_people',     desc: 'cat_people_d'     },
  { icon: '🐶', name: 'cat_animals',    desc: 'cat_animals_d'    },
  { icon: '🍔', name: 'cat_food',       desc: 'cat_food_d'       },
  { icon: '✈️', name: 'cat_travel',     desc: 'cat_travel_d'     },
  { icon: '⚽', name: 'cat_activities', desc: 'cat_activities_d' },
  { icon: '💡', name: 'cat_objects',    desc: 'cat_objects_d'    },
  { icon: '🔣', name: 'cat_symbols',    desc: 'cat_symbols_d'    },
  { icon: '🏳️', name: 'cat_flags',     desc: 'cat_flags_d'      }
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
    { question: t('faq_6_q'), answer: t('faq_6_a') }
  ]
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') },
  ]
})

const state = reactive({
  keyword: '',
  tab: 0,
  loading: true,
  data: [] as EmojiItem[],
  emojis: [] as EmojiItem[],
  categories: [] as string[],
  recentlyCopied: [] as string[],
  copiedChar: null as string | null,
  copyAnnouncement: ''
})

onMounted(async () => {
  try {
    const saved = localStorage.getItem('recentEmojis')
    if (saved) state.recentlyCopied = JSON.parse(saved).slice(0, MAX_RECENT)
  } catch {}

  try {
    const res = await fetch('https://unpkg.com/emoji.json')
    const json = await res.json()
    const seen = new Set<string>()
    const groups = new Set<string>()
    const data: EmojiItem[] = []

    for (const item of json) {
      if (!seen.has(item.name)) {
        seen.add(item.name)
        groups.add(item.group)
        data.push({ char: item.char, name: item.name.toLowerCase(), group: item.group })
      }
    }

    state.data = data
    state.categories = [...groups]
    filter()
  } catch {}

  state.loading = false
})

watch(() => state.tab, filter)
watch(() => state.keyword, filter)

function filter() {
  if (state.keyword.length >= 2) {
    const kw = state.keyword.toLowerCase()
    state.emojis = state.data.filter(item => item.name.includes(kw))
  } else {
    state.emojis = state.data.filter(item => item.group === state.categories[state.tab])
  }
}

async function copy(char: string) {
  try {
    await navigator.clipboard.writeText(char)
    state.copiedChar = char
    state.copyAnnouncement = t('copied_announce')
    addToRecent(char)
    setTimeout(() => {
      state.copiedChar = null
      state.copyAnnouncement = ''
    }, COPY_FEEDBACK_MS)
  } catch {}
}

function addToRecent(emoji: string) {
  const filtered = state.recentlyCopied.filter(e => e !== emoji)
  state.recentlyCopied = [emoji, ...filtered].slice(0, MAX_RECENT)
  try {
    localStorage.setItem('recentEmojis', JSON.stringify(state.recentlyCopied))
  } catch {}
}

defineI18nRoute({
  paths: {
    en: '/emoji-picker',
    pt: '/seletor-de-emojis',
    es: '/selector-de-emojis',
    fr: '/selecteur-d-emojis',
    it: '/selettore-di-emoji',
    id: '/pemilih-emoji',
    de: '/emoji-auswahl',
    nl: '/emoji-kiezer',
    ru: '/vybor-emoji'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.emojis.length > 0"
    :see-also-links="[
      { label: t('see1'), to: 'copy-paste-symbols' },
      { label: t('see2'), to: 'barcode-generator' },
      { label: 'Kaomojis', to: 'kaomoji' },
      { label: t('see4'), to: 'dominant-colors-of-the-image' }
    ]"
  >
    <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Campo de busca -->
      <div class="form-control w-full">
        <label for="emoji-search" class="label">
          <span class="label-text font-bold text-base-content">{{ t('search_label') }}</span>
          <span v-if="state.keyword && !state.loading" class="label-text-alt text-base-content/70 text-sm">
            {{ state.emojis.length }} {{ t('found') }}
          </span>
        </label>
        <div class="relative">
          <input
            id="emoji-search"
            v-model="state.keyword"
            type="text"
            class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl pl-12 pr-12"
            :placeholder="t('plc')"
            enterkeyhint="search"
            autocomplete="off"
            spellcheck="false"
            autofocus
          />
          <Icon
            name="material-symbols:search-rounded"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40 pointer-events-none"
            aria-hidden="true"
          />
          <button
            v-if="state.keyword"
            type="button"
            @click="state.keyword = ''"
            :aria-label="t('clear')"
            class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost btn-xs text-base-content/40 hover:text-base-content"
          >
            <Icon name="material-symbols:close-rounded" class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Emojis copiados recentemente -->
      <div v-if="state.recentlyCopied.length > 0" class="bg-base-200 rounded-2xl px-4 py-3">
        <p class="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">{{ t('recently_copied') }}</p>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="(emoji, i) in state.recentlyCopied"
            :key="i"
            type="button"
            @click="copy(emoji)"
            class="relative text-3xl p-1.5 rounded-xl transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            :class="state.copiedChar === emoji ? 'bg-success/20 scale-110 ring-2 ring-success' : ''"
          >
            {{ emoji }}
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-0 opacity-0"
            >
              <span
                v-if="state.copiedChar === emoji"
                class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-success rounded-full flex items-center justify-center text-success-content text-[10px] font-bold leading-none z-10"
              >✓</span>
            </Transition>
          </button>
        </div>
      </div>

      <!-- Abas de categorias -->
      <div v-show="!state.keyword">
        <p class="text-sm font-semibold text-base-content mb-2">{{ t('categories') }}</p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(cat, i) in emojiCategories"
            :key="i"
            type="button"
            @click="state.tab = i"
            :title="t(cat.name)"
            :aria-label="t(cat.name)"
            :aria-pressed="state.tab === i"
            class="btn btn-sm rounded-xl"
            :class="state.tab === i ? 'btn-primary' : 'btn-ghost bg-base-200'"
          >
            <span class="text-xl leading-none">{{ cat.icon }}</span>
          </button>
        </div>
        <p class="text-primary mt-2 font-medium">{{ t(emojiCategories[state.tab]?.name ?? '') }}</p>
      </div>

      <!-- Grade de emojis (altura fixa para evitar CLS) -->
      <div
        class="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm overflow-y-auto p-3"
        style="height: 420px"
        :aria-label="t('results_label')"
        role="list"
      >
        <!-- Loading -->
        <div v-if="state.loading" class="flex items-center justify-center h-full">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <!-- Estado vazio na busca -->
        <div
          v-else-if="state.emojis.length === 0 && state.keyword"
          class="flex flex-col items-center justify-center h-full gap-2"
        >
          <span class="text-4xl">🔍</span>
          <p class="text-base-content/60 text-sm">{{ t('empty') }}</p>
        </div>

        <!-- Grade -->
        <div v-else class="flex flex-wrap gap-0.5">
          <button
            v-for="item in state.emojis"
            :key="item.char"
            type="button"
            role="listitem"
            :title="item.name"
            :aria-label="item.name"
            @click="copy(item.char)"
            class="relative text-3xl p-2 rounded-xl transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            :class="state.copiedChar === item.char ? 'bg-success/20 scale-110 ring-2 ring-success' : ''"
          >
            {{ item.char }}
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-0 opacity-0"
            >
              <span
                v-if="state.copiedChar === item.char"
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

        <div>
          <h2 class="text-xl font-bold mb-3">{{ t('popular_title') }}</h2>
          <p class="text-base-content leading-relaxed">{{ t('popular_p') }}</p>
        </div>

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
          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="cat in emojiCategories"
              :key="cat.name"
              class="flex gap-2"
            >
              <span class="shrink-0 mt-0.5 text-lg leading-none" aria-hidden="true">{{ cat.icon }}</span>
              <p>
                <strong>{{ t(cat.name) }}:</strong>
                {{ t(cat.desc) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Seção educacional sobre emojis e Unicode -->
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
            { question: t('faq_5_q'), answer: t('faq_5_a') },
            { question: t('faq_6_q'), answer: t('faq_6_a') }
          ]"
        />

      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    m_title: "Copiar e Colar Emojis - Seletor de Emojis Online 😀❤️🎉",
    title: "Copiar e Colar Emojis",
    meta: "Seletor de emojis para copiar e colar. Pesquise por palavra-chave ou explore 10 categorias: sorrisos, animais, comida e símbolos. Funciona no celular, iPhone, Android e PC.",
    d1: "Pesquise qualquer emoji e copie com um clique. Navegue por 10 categorias ou digite uma palavra-chave para encontrar emojis de coração ❤️, estrela ⭐, fogo 🔥, carinhas fofas e muito mais. Compatível com WhatsApp, Instagram, TikTok, Discord e qualquer plataforma que aceite texto — iPhone, Android, Windows e Mac incluídos.",
    popular_title: "Emojis mais buscados",
    popular_p: "Entre os termos mais pesquisados para copiar e colar emojis estão: emojis de coração (❤️ 🧡 💛 💚 💙 💜), emoji de fogo 🔥, emoji de estrela ⭐, joinha 👍, rindo chorando 😂 e emojis fofos como 🥰 🤩 😍. Esta ferramenta permite encontrar todos eles de forma rápida   — basta digitar o nome na busca e clicar para copiar.",

    search_label: "Pesquisar emojis",
    plc: "Pesquisar... (ex: heart, fire, smile)",
    clear: "Limpar busca",
    categories: "Categorias",
    recently_copied: "Copiados recentemente",
    copied_label: "Copiado!",
    copied_announce: "Emoji copiado para a área de transferência",
    found: "encontrados",
    empty: "Nenhum emoji encontrado. Tente outra palavra-chave em inglês.",
    results_label: "Grade de emojis",

    use_cases_title: "Onde usar seus emojis",
    uc_1_title: "Instagram, TikTok e redes sociais",
    uc_1_desc: "Dê vida à sua bio, legendas e comentários com emojis expressivos. Posts com emojis geram mais engajamento e tornam o perfil mais humano e atraente.",
    uc_2_title: "WhatsApp e Telegram",
    uc_2_desc: "Expresse emoções com mais precisão nas conversas. Um emoji certo comunica o tom da mensagem sem espaço para mal-entendidos e torna os textos mais rápidos de ler.",
    uc_3_title: "Discord e comunidades online",
    uc_3_desc: "Personalize seu nome de usuário, reaja a mensagens e torne os canais mais dinâmicos. Emojis são a linguagem natural das comunidades digitais.",
    uc_4_title: "E-mails, apresentações e conteúdo",
    uc_4_desc: "Use com moderação para destacar pontos importantes, humanizar títulos e chamar atenção em assuntos de e-mail. Um emoji bem colocado aumenta a taxa de abertura.",

    how_it_works_title: "Como usar",
    hiw_1_title: "Navegue por categorias ou pesquise",
    hiw_1_desc: "Use as abas para explorar emojis por tema, ou digite uma palavra-chave em inglês (ex: heart, star, fire) para encontrar o emoji exato que você precisa.",
    hiw_2_title: "Clique para copiar",
    hiw_2_desc: "Um clique em qualquer emoji copia automaticamente para a área de transferência. Não é preciso selecionar, arrastar ou pressionar nenhuma tecla extra.",
    hiw_3_title: "Cole onde quiser",
    hiw_3_desc: "Uma vez copiado, cole onde quiser. Funciona em qualquer plataforma que aceite texto.",

    categories_title: "Categorias de emojis disponíveis",
    categories_intro: "Os emojis estão organizados em 10 categorias para facilitar a navegação. Veja o que cada uma inclui:",
    cat_smileys: "Sorrisos e Emoções",
    cat_smileys_d: "Carinhas felizes, tristes, surpresas, apaixonadas e muito mais. É a categoria mais usada para expressar sentimentos de forma rápida e universal.",
    cat_gestures: "Gestos",
    cat_gestures_d: "Mãos acenando, polegares, palmas e gestos do cotidiano. Ideais para expressar concordância, cumprimentos, pedidos e reações rápidas.",
    cat_people: "Pessoas",
    cat_people_d: "Avatares, famílias, profissões e representações diversas. Úteis para humanizar mensagens e representar diferentes contextos e identidades.",
    cat_animals: "Animais e Natureza",
    cat_animals_d: "Pets, animais selvagens, plantas, flores e fenômenos naturais. Perfeitos para quem ama o mundo natural ou quer dar um toque orgânico à mensagem.",
    cat_food: "Comida e Bebida",
    cat_food_d: "Frutas, refeições, sobremesas, bebidas e utensílios de cozinha. Muito usados em receitas, posts de gastronomia e conversas sobre comida.",
    cat_travel: "Viagens e Lugares",
    cat_travel_d: "Meios de transporte, pontos turísticos, construções e ambientes. Ótimos para posts de viagem, check-ins e conversas sobre destinos.",
    cat_activities: "Atividades",
    cat_activities_d: "Esportes, jogos, artes, música e hobbies. Expressam paixões, conquistas e momentos de lazer com clareza e dinamismo.",
    cat_objects: "Objetos",
    cat_objects_d: "Tecnologia, ferramentas, roupas, acessórios e objetos do dia a dia. Comunicam contextos, situações e temas específicos de forma visual.",
    cat_symbols: "Símbolos",
    cat_symbols_d: "Sinais de trânsito, símbolos religiosos, moedas, marcas e ícones. Úteis para contextualizar temas específicos e adicionar significados visuais.",
    cat_flags: "Bandeiras",
    cat_flags_d: "Bandeiras de países, territórios e comunidades. Excelentes para indicar origem, apoio a um time, contexto geográfico ou identidade cultural.",

    unicode_title: "Por que emojis funcionam em qualquer plataforma",
    unicode_p1: "Emojis são caracteres Unicode padronizados e não imagens ou arquivos. Isso significa que funcionam em todos os dispositivos, sistemas operacionais e aplicativos que suportam texto: do Android ao iPhone, do Windows ao Mac, do Instagram ao Discord. Quando você copia um emoji aqui e cola em outro lugar, o resultado é sempre compatível.",
    unicode_p2: "A aparência visual pode variar levemente entre plataformas (o ❤️ no iOS tem um estilo diferente do Android), mas o significado e a compatibilidade são universais.",

    faq_title: "Perguntas e Respostas",
    faq_1_q: "Como copiar e colar emojis pelo computador?",
    faq_1_a: "Acesse esta página, clique em qualquer emoji para copiá-lo automaticamente para a área de transferência. Em seguida, vá ao aplicativo ou site desejado e cole. Não é necessário instalar nada.",
    faq_2_q: "Os emojis funcionam na bio e nas legendas do Instagram?",
    faq_2_a: "Sim. O Instagram aceita todos os emojis Unicode na bio, legendas, comentários, histórias e nomes de usuário. Basta copiar o emoji nesta página e colar diretamente no Instagram, seja pelo celular ou pelo computador.",
    faq_3_q: "Posso usar emojis no nome e nas mensagens do WhatsApp?",
    faq_3_a: "Sim. O WhatsApp suporta emojis Unicode no nome do perfil, nas mensagens, nos status e nas descrições de grupos.",
    faq_4_q: "Emojis funcionam em nicknames de jogos como Free Fire e Roblox?",
    faq_4_a: "Depende do jogo. Alguns aceitam emojis nos nicknames, outros bloqueiam caracteres Unicode especiais por questões de moderação. Emojis simples como ❤️ e ⭐ costumam ter melhor compatibilidade. Sempre teste antes de salvar o nick.",
    faq_5_q: "Como funciona o filtro de busca?",
    faq_5_a: "À medida que você digita a palavra-chave, a ferramenta filtra automaticamente a lista, exibindo apenas os emojis que correspondem ao termo pesquisado. Isso permite encontrar o ícone exato de forma rápida e dinâmica.",
    faq_6_q: "Onde encontrar emojis fofos e emojis de coração para copiar e colar?",
    faq_6_a: "Use a caixa de pesquisa nesta página e digite palavras como 'heart', 'love', 'star' ou 'smile' para filtrar a lista instantaneamente. Você também pode abrir a categoria Sorrisos e Emoções para encontrar carinhas fofas, ou explorar todas as categorias disponíveis.",

    see1: "Seletor de Símbolos",
    see2: "Gerador de Código de Barras",
    see4: "Cores Dominantes da Imagem",

    f_1: "Mais de 3.000 emojis disponíveis",
    f_2: "Cópia com um clique",
    f_3: "Pesquisa por palavra-chave",
    f_4: "Histórico de emojis recentes"
  },
  en: {
    m_title: "Copy and Paste Emojis - Online Emoji Picker 😀❤️🎉",
    title: "Copy and Paste Emojis",
    meta: "Emoji picker to copy and paste. Search emojis by keyword or browse 10 categories — smileys, animals, food, and symbols. Works on iPhone, Android, and PC.",
    d1: "Search any emoji and copy paste with a single click. Browse 10 categories or type a keyword to instantly find heart emojis ❤️, star emojis ⭐, fire emojis 🔥, cute faces, and much more. Compatible with WhatsApp, Instagram, TikTok, Discord, and every platform that supports text — iPhone, Android, Windows, and Mac included.",
    popular_title: "Most searched emojis",
    popular_p: "Some of the most searched emoji copy paste terms include heart emojis (❤️ 🧡 💛 💚 💙 💜), fire emoji 🔥, star emoji ⭐, thumbs up 👍, laughing face 😂, and cute emojis like 🥰 🤩 😍. This tool lets you find all of them instantly — just type the name in the search box and click to copy.",

    search_label: "Search emojis",
    plc: "Search... (e.g., heart, fire, smile)",
    clear: "Clear search",
    categories: "Categories",
    recently_copied: "Recently copied",
    copied_label: "Copied!",
    copied_announce: "Emoji copied to clipboard",
    found: "found",
    empty: "No emojis found. Try another keyword.",
    results_label: "Emoji grid",

    use_cases_title: "Where to use your emojis",
    uc_1_title: "Instagram, TikTok, and social media",
    uc_1_desc: "Bring your bio, captions, and comments to life with expressive emojis. Posts with emojis generate more engagement and make your profile more human and appealing.",
    uc_2_title: "WhatsApp and Telegram",
    uc_2_desc: "Express emotions more accurately in your conversations. The right emoji sets the tone of the message, leaving no room for misunderstandings, and makes texts faster to read.",
    uc_3_title: "Discord and online communities",
    uc_3_desc: "Customize your username, react to messages, and make channels more dynamic. Emojis are the natural language of digital communities.",
    uc_4_title: "Emails, presentations, and content",
    uc_4_desc: "Use sparingly to highlight important points, humanize titles, and draw attention to email subject lines. A well-placed emoji increases the open rate.",

    how_it_works_title: "How to use",
    hiw_1_title: "Browse by categories or search",
    hiw_1_desc: "Use the tabs to explore emojis by theme, or type a keyword to find the exact emoji you need.",
    hiw_2_title: "Click to copy",
    hiw_2_desc: "A single click on any emoji automatically copies it to your clipboard. No need to select, drag, or press any extra keys.",
    hiw_3_title: "Paste anywhere",
    hiw_3_desc: "Once copied, paste it wherever you want. It works on any platform that accepts text.",

    categories_title: "Available emoji categories",
    categories_intro: "Emojis are organized into 10 categories to make navigation easier. Here is what each one includes:",
    cat_smileys: "Smileys & Emotion",
    cat_smileys_d: "Happy, sad, surprised, and in-love faces, and much more. It's the most used category to express feelings quickly and universally.",
    cat_gestures: "Gestures",
    cat_gestures_d: "Waving hands, thumbs up, palms, and everyday gestures. Ideal for expressing agreement, greetings, requests, and quick reactions.",
    cat_people: "People",
    cat_people_d: "Avatars, families, professions, and diverse representations. Useful for humanizing messages and representing different contexts and identities.",
    cat_animals: "Animals & Nature",
    cat_animals_d: "Pets, wild animals, plants, flowers, and natural phenomena. Perfect for those who love the natural world or want to add an organic touch to your message.",
    cat_food: "Food & Drink",
    cat_food_d: "Fruits, meals, desserts, drinks, and kitchen utensils. Widely used in recipes, food posts, and conversations about food.",
    cat_travel: "Travel & Places",
    cat_travel_d: "Means of transport, tourist spots, buildings, and environments. Great for travel posts, check-ins, and conversations about destinations.",
    cat_activities: "Activities",
    cat_activities_d: "Sports, games, arts, music, and hobbies. Express passions, achievements, and leisure moments clearly and dynamically.",
    cat_objects: "Objects",
    cat_objects_d: "Technology, tools, clothing, accessories, and everyday objects. They communicate specific contexts, situations, and themes visually.",
    cat_symbols: "Symbols",
    cat_symbols_d: "Traffic signs, religious symbols, currencies, brands, and icons. Useful for contextualizing specific themes and adding visual meaning.",
    cat_flags: "Flags",
    cat_flags_d: "Flags of countries, territories, and communities. Excellent for indicating origin, supporting a team, geographic context, or cultural identity.",

    unicode_title: "Why emojis work on any platform",
    unicode_p1: "Emojis are standardized Unicode characters, not images or files. This means they work on all devices, operating systems, and applications that support text: from Android to iPhone, Windows to Mac, Instagram to Discord. When you copy an emoji here and paste it elsewhere, the result is always compatible.",
    unicode_p2: "The visual appearance may vary slightly between platforms (the ❤️ on iOS has a different style than on Android), but the meaning and compatibility are universal.",

    faq_title: "Questions and Answers",
    faq_1_q: "How to copy and paste emojis on a computer?",
    faq_1_a: "Access this page, click on any emoji to automatically copy it to your clipboard. Then, go to your desired app or website and paste it. No installation required.",
    faq_2_q: "Do emojis work in Instagram bios and captions?",
    faq_2_a: "Yes. Instagram accepts all Unicode emojis in bios, captions, comments, stories, and usernames. Just copy the emoji on this page and paste it directly into Instagram, whether on your phone or computer.",
    faq_3_q: "Can I use emojis in my WhatsApp name and messages?",
    faq_3_a: "Yes. WhatsApp supports Unicode emojis in profile names, messages, statuses, and group descriptions.",
    faq_4_q: "Do emojis work in gaming nicknames like Free Fire and Roblox?",
    faq_4_a: "It depends on the game. Some accept emojis in nicknames, while others block special Unicode characters for moderation reasons. Simple emojis like ❤️ and ⭐ usually have better compatibility. Always test before saving your nick.",
    faq_5_q: "How does the search filter work?",
    faq_5_a: "As you type the keyword, the tool automatically filters the list, showing only the emojis that match your search term. This allows you to find the exact icon quickly and dynamically.",
    faq_6_q: "Where can I find cute emojis and heart emojis to copy and paste?",
    faq_6_a: "Use the search box on this page and type words like 'heart', 'love', 'star', or 'cute' to filter the emoji list instantly. You can also open the Smileys & Emotion category for cute faces, or browse all categories to discover emojis for any mood or occasion.",

    see1: "Symbol Picker",
    see2: "Barcode Generator",
    see4: "Dominant Colors of the Image",

    f_1: "More than 3,000 emojis available",
    f_2: "One-click copy",
    f_3: "Search by keyword",
    f_4: "Recent emojis history"
  },
  es: {
    m_title: "Copiar y Pegar Emojis - Selector de Emojis Online 😀❤️🎉",
    title: "Copiar y Pegar Emojis",
    meta: "Selector de emojis para copiar y pegar. Busca por palabra clave o explora 10 categorías: caras, animales, comida y símbolos. Funciona en iPhone, Android y PC.",
    d1: "Busca cualquier emoji y cópialo con un solo clic. Navega por 10 categorías o escribe una palabra clave para encontrar emojis de corazón ❤️, estrella ⭐, fuego 🔥, caras bonitas y mucho más. Compatible con WhatsApp, Instagram, TikTok, Discord y cualquier plataforma que acepte texto — iPhone, Android, Windows y Mac incluidos.",
    popular_title: "Emojis más buscados",
    popular_p: "Entre los términos más buscados para copiar y pegar emojis se encuentran: emojis de corazón (❤️ 🧡 💛 💚 💙 💜), emoji de fuego 🔥, emoji de estrella ⭐, pulgar arriba 👍, cara llorando de risa 😂 y emojis bonitos como 🥰 🤩 😍. Esta herramienta te permite encontrarlos al instante — escribe el nombre en el buscador y haz clic para copiar.",

    search_label: "Buscar emojis",
    plc: "Buscar... (ej: heart, fire, smile)",
    clear: "Borrar búsqueda",
    categories: "Categorías",
    recently_copied: "Copiados recientemente",
    copied_label: "¡Copiado!",
    copied_announce: "Emoji copiado al portapapeles",
    found: "encontrados",
    empty: "No se encontraron emojis. Intenta con otra palabra clave en inglés.",
    results_label: "Cuadrícula de emojis",

    use_cases_title: "Dónde usar tus emojis",
    uc_1_title: "Instagram, TikTok y redes sociales",
    uc_1_desc: "Dale vida a tu bio, subtítulos y comentarios con emojis expresivos. Las publicaciones con emojis generan más interacción y hacen que tu perfil sea más humano y atractivo.",
    uc_2_title: "WhatsApp y Telegram",
    uc_2_desc: "Expresa emociones con mayor precisión en tus conversaciones. El emoji adecuado establece el tono del mensaje, sin dejar lugar a malentendidos, y hace que los textos sean más rápidos de leer.",
    uc_3_title: "Discord y comunidades online",
    uc_3_desc: "Personaliza tu nombre de usuario, reacciona a los mensajes y haz que los canales sean más dinámicos. Los emojis son el lenguaje natural de las comunidades digitales.",
    uc_4_title: "Correos electrónicos, presentaciones y contenido",
    uc_4_desc: "Úsalos con moderación para resaltar puntos importantes, humanizar títulos y llamar la atención en asuntos de correo. Un emoji bien colocado aumenta la tasa de apertura.",

    how_it_works_title: "Cómo usar",
    hiw_1_title: "Navega por categorías o busca",
    hiw_1_desc: "Usa las pestañas para explorar emojis por tema, o escribe una palabra clave en inglés (ej: heart, star, fire) para encontrar el emoji exacto que necesitas.",
    hiw_2_title: "Haz clic para copiar",
    hiw_2_desc: "Un solo clic en cualquier emoji lo copia automáticamente al portapapeles. No es necesario seleccionar, arrastrar ni presionar ninguna tecla adicional.",
    hiw_3_title: "Pega en cualquier lugar",
    hiw_3_desc: "Una vez copiado, pégalo donde quieras. Funciona en cualquier plataforma que acepte texto.",

    categories_title: "Categorías de emojis disponibles",
    categories_intro: "Los emojis están organizados en 10 categorías para facilitar la navegación. Esto es lo que incluye cada una:",
    cat_smileys: "Emoticonos y Emociones",
    cat_smileys_d: "Caritas felices, tristes, sorprendidas y enamoradas, y mucho más. Es la categoría más utilizada para expresar sentimientos de forma rápida y universal.",
    cat_gestures: "Gestos",
    cat_gestures_d: "Manos saludando, pulgares arriba, palmas y gestos cotidianos. Ideales para expresar acuerdo, saludos, peticiones y reacciones rápidas.",
    cat_people: "Personas",
    cat_people_d: "Avatares, familias, profesiones y diversas representaciones. Útiles para humanizar mensajes y representar diferentes contextos e identidades.",
    cat_animals: "Animales y Naturaleza",
    cat_animals_d: "Mascotas, animales salvajes, plantas, flores y fenómenos naturales. Perfectos para los amantes del mundo natural o para dar un toque orgánico al mensaje.",
    cat_food: "Comida y Bebida",
    cat_food_d: "Frutas, comidas, postres, bebidas y utensilios de cocina. Muy utilizados en recetas, publicaciones gastronómicas y conversaciones sobre comida.",
    cat_travel: "Viajes y Lugares",
    cat_travel_d: "Medios de transporte, puntos turísticos, edificios y entornos. Ideales para publicaciones de viajes, check-ins y conversaciones sobre destinos.",
    cat_activities: "Actividades",
    cat_activities_d: "Deportes, juegos, artes, música y pasatiempos. Expresan pasiones, logros y momentos de ocio con claridad y dinamismo.",
    cat_objects: "Objetos",
    cat_objects_d: "Tecnología, herramientas, ropa, accesorios y objetos cotidianos. Comunican contextos específicos, situaciones y temas de forma visual.",
    cat_symbols: "Símbolos",
    cat_symbols_d: "Señales de tráfico, símbolos religiosos, monedas, marcas e iconos. Útiles para contextualizar temas específicos y añadir significado visual.",
    cat_flags: "Banderas",
    cat_flags_d: "Banderas de países, territorios y comunidades. Excelentes para indicar el origen, apoyar a un equipo, contexto geográfico o identidad cultural.",

    unicode_title: "Por qué los emojis funcionan en cualquier plataforma",
    unicode_p1: "Los emojis son caracteres Unicode estandarizados, no imágenes ni archivos. Esto significa que funcionan en todos los dispositivos, sistemas operativos y aplicaciones que admiten texto: desde Android hasta iPhone, desde Windows hasta Mac, desde Instagram hasta Discord. Cuando copias un emoji aquí y lo pegas en otro lugar, el resultado siempre es compatible.",
    unicode_p2: "La apariencia visual puede variar ligeramente entre plataformas (el ❤️ en iOS tiene un estilo diferente que en Android), pero el significado y la compatibilidad son universales.",

    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cómo copiar y pegar emojis en una computadora?",
    faq_1_a: "Accede a esta página, haz clic en cualquier emoji para copiarlo automáticamente al portapapeles. Luego, ve a la aplicación o sitio web deseado y pégalo. No requiere instalación.",
    faq_2_q: "¿Funcionan los emojis en las biografías y subtítulos de Instagram?",
    faq_2_a: "Sí. Instagram acepta todos los emojis Unicode en biografías, subtítulos, comentarios, historias y nombres de usuario. Simplemente copia el emoji en esta página y pégalo directamente en Instagram, ya sea en tu teléfono o computadora.",
    faq_3_q: "¿Puedo usar emojis en mi nombre y mensajes de WhatsApp?",
    faq_3_a: "Sí. WhatsApp admite emojis Unicode en nombres de perfil, mensajes, estados y descripciones de grupos.",
    faq_4_q: "¿Funcionan los emojis en los apodos de juegos como Free Fire y Roblox?",
    faq_4_a: "Depende del juego. Algunos aceptan emojis en los apodos, mientras que otros bloquean los caracteres Unicode especiales por razones de moderación. Emojis simples como ❤️ y ⭐ suelen tener mejor compatibilidad. Prueba siempre antes de guardar tu apodo.",
    faq_5_q: "¿Cómo funciona el filtro de búsqueda?",
    faq_5_a: "A medida que escribes la palabra clave, la herramienta filtra automáticamente la lista, mostrando solo los emojis que coinciden con el término de búsqueda. Esto te permite encontrar el icono exacto de forma rápida y dinámica.",
    faq_6_q: "¿Dónde encontrar emojis bonitos y emojis de corazón para copiar y pegar?",
    faq_6_a: "Usa el cuadro de búsqueda en esta página y escribe palabras como 'heart', 'love', 'star' o 'cute' para filtrar la lista al instante. También puedes abrir la categoría Emoticonos y Emociones para encontrar caras bonitas, o explorar todas las categorías disponibles.",

    see1: "Selector de Símbolos",
    see2: "Generador de Código de Barras",
    see4: "Colores Dominantes de la Imagen",

    f_1: "Más de 3.000 emojis disponibles",
    f_2: "Copia con un clic",
    f_3: "Búsqueda por palabra clave",
    f_4: "Historial de emojis recientes"
  },
  fr: {
    m_title: "Copier et Coller des Emojis - Sélecteur d'Emojis en Ligne 😀❤️🎉",
    title: "Copier et Coller des Emojis",
    meta: "Sélecteur d'emojis à copier et coller. Cherchez par mot-clé ou explorez 10 catégories : smileys, animaux, nourriture et symboles. Fonctionne sur iPhone, Android et PC.",
    d1: "Cherchez n'importe quel emoji et copiez-le en un clic. Parcourez 10 catégories ou tapez un mot-clé pour trouver des emojis cœur ❤️, étoile ⭐, feu 🔥, visages mignons et bien plus. Compatible avec WhatsApp, Instagram, TikTok, Discord et toute plateforme acceptant du texte — iPhone, Android, Windows et Mac inclus.",
    popular_title: "Emojis les plus recherchés",
    popular_p: "Parmi les termes les plus recherchés pour copier coller des emojis : emojis cœur (❤️ 🧡 💛 💚 💙 💜), emoji feu 🔥, emoji étoile ⭐, pouce levé 👍, mort de rire 😂 et emojis mignons comme 🥰 🤩 😍. Cet outil vous permet de tous les trouver instantanément — tapez le nom dans la recherche et cliquez pour copier.",

    search_label: "Rechercher des emojis",
    plc: "Rechercher... (ex: heart, fire, smile)",
    clear: "Effacer la recherche",
    categories: "Catégories",
    recently_copied: "Récemment copiés",
    copied_label: "Copié !",
    copied_announce: "Emoji copié dans le presse-papiers",
    found: "trouvés",
    empty: "Aucun emoji trouvé. Essayez un autre mot-clé en anglais.",
    results_label: "Grille d'emojis",

    use_cases_title: "Où utiliser vos emojis",
    uc_1_title: "Instagram, TikTok et réseaux sociaux",
    uc_1_desc: "Donnez vie à votre bio, vos légendes et vos commentaires avec des emojis expressifs. Les publications avec des emojis génèrent plus d'engagement et rendent votre profil plus humain et attrayant.",
    uc_2_title: "WhatsApp et Telegram",
    uc_2_desc: "Exprimez vos émotions avec plus de précision dans vos conversations. Le bon emoji donne le ton du message, ne laissant aucune place aux malentendus, et rend les textes plus rapides à lire.",
    uc_3_title: "Discord et communautés en ligne",
    uc_3_desc: "Personnalisez votre nom d'utilisateur, réagissez aux messages et rendez les canaux plus dynamiques. Les emojis sont le langage naturel des communautés numériques.",
    uc_4_title: "E-mails, présentations et contenu",
    uc_4_desc: "Utilisez-les avec modération pour souligner les points importants, humaniser les titres et attirer l'attention dans les objets d'e-mails. Un emoji bien placé augmente le taux d'ouverture.",

    how_it_works_title: "Comment utiliser",
    hiw_1_title: "Parcourez par catégories ou recherchez",
    hiw_1_desc: "Utilisez les onglets pour explorer les emojis par thème, ou tapez un mot-clé en anglais (ex: heart, star, fire) pour trouver l'emoji exact dont vous avez besoin.",
    hiw_2_title: "Cliquez pour copier",
    hiw_2_desc: "Un simple clic sur n'importe quel emoji le copie automatiquement dans votre presse-papiers. Pas besoin de sélectionner, glisser ou appuyer sur des touches supplémentaires.",
    hiw_3_title: "Collez n'importe où",
    hiw_3_desc: "Une fois copié, collez-le où vous le souhaitez. Cela fonctionne sur n'importe quelle plateforme acceptant du texte.",

    categories_title: "Catégories d'emojis disponibles",
    categories_intro: "Les emojis sont organisés en 10 catégories pour faciliter la navigation. Voici ce que chacune comprend :",
    cat_smileys: "Smileys et Émotions",
    cat_smileys_d: "Visages heureux, tristes, surpris et amoureux, et bien plus encore. C'est la catégorie la plus utilisée pour exprimer des sentiments de manière rapide et universelle.",
    cat_gestures: "Gestes",
    cat_gestures_d: "Mains qui saluent, pouces en l'air, paumes et gestos du quotidien. Idéal pour exprimer un accord, des salutations, des demandes et des réactions rapides.",
    cat_people: "Personnes",
    cat_people_d: "Avatars, familles, professions et diverses représentations. Utile pour humaniser les messages et représenter différents contextes et identités.",
    cat_animals: "Animaux et Nature",
    cat_animals_d: "Animaux de compagnie, animaux sauvages, plantes, fleurs et phénomènes naturels. Parfait pour ceux qui aiment le monde naturel ou souhaitent ajouter une touche organique à leur message.",
    cat_food: "Nourriture et Boisson",
    cat_food_d: "Fruits, repas, desserts, boissons et ustensiles de cuisine. Très utilisé dans les recettes, les publications gastronomiques et les conversations sur la nourriture.",
    cat_travel: "Voyages et Lieux",
    cat_travel_d: "Moyens de transport, sites touristiques, bâtiments et environnements. Idéal pour les publications de voyage, les check-ins et les conversations sur les destinations.",
    cat_activities: "Activités",
    cat_activities_d: "Sports, jeux, arts, musique et loisirs. Exprimez vos passions, vos réussites et vos moments de détente avec clarté et dynamisme.",
    cat_objects: "Objets",
    cat_objects_d: "Technologie, outils, vêtements, accessoires et objets du quotidien. Ils communiquent des contextes spécifiques, des situations et des thèmes de manière visuelle.",
    cat_symbols: "Symboles",
    cat_symbols_d: "Panneaux de signalisation, symboles religieux, devises, marques et icônes. Utile pour contextualiser des thèmes spécifiques et ajouter une signification visuelle.",
    cat_flags: "Drapeaux",
    cat_flags_d: "Drapeaux de pays, de territoires et de communautés. Excellent pour indiquer l'origine, soutenir une équipe, un contexte géographique ou une identité culturelle.",

    unicode_title: "Pourquoi les emojis fonctionnent sur n'importe quelle plateforme",
    unicode_p1: "Les emojis sont des caractères Unicode standardisés, et non des images ou des fichiers. Cela signifie qu'ils fonctionnent sur tous les appareils, systèmes d'exploitation et applications prenant en charge le texte : d'Android à iPhone, de Windows à Mac, d'Instagram à Discord. Lorsque vous copiez un emoji ici et le collez ailleurs, le résultat est toujours compatible.",
    unicode_p2: "L'apparence visuelle peut varier légèrement selon les plateformes (le ❤️ sur iOS a un style différent de celui sur Android), mais la signification et la compatibilité sont universelles.",

    faq_title: "Questions et Réponses",
    faq_1_q: "Comment copier et coller des emojis sur un ordinateur ?",
    faq_1_a: "Accédez à cette page, cliquez sur n'importe quel emoji pour le copier automatiquement dans votre presse-papiers. Ensuite, allez sur l'application ou le site Web de votre choix et collez-le. Aucune installation requise.",
    faq_2_q: "Les emojis fonctionnent-ils dans les bios et les légendes Instagram ?",
    faq_2_a: "Oui. Instagram accepte tous les emojis Unicode dans les bios, les légendes, les commentaires, les stories et les noms d'utilisateur. Copiez simplement l'emoji sur cette page et collez-le directement dans Instagram, que ce soit sur votre téléphone ou votre ordinateur.",
    faq_3_q: "Puis-je utiliser des emojis dans mon nom et mes messages WhatsApp ?",
    faq_3_a: "Oui. WhatsApp prend en charge les emojis Unicode dans les noms de profil, les messages, les statuts et les descriptions de groupe.",
    faq_4_q: "Les emojis fonctionnent-ils dans les pseudos de jeux comme Free Fire et Roblox ?",
    faq_4_a: "Cela dépend du jeu. Certains acceptent les emojis dans les pseudos, tandis que d'autres bloquent les caractères Unicode spéciaux pour des raisons de modération. Les emojis simples comme ❤️ et ⭐ ont généralement une meilleure compatibilité. Testez toujours avant d'enregistrer votre pseudo.",
    faq_5_q: "Comment fonctionne le filtre de recherche ?",
    faq_5_a: "Au fur et à mesure que vous tapez le mot-clé, l'outil filtre automatiquement la liste, en n'affichant que les emojis qui correspondent au terme de recherche. Cela vous permet de trouver l'icône exacte de manière rapide et dynamique.",
    faq_6_q: "Où trouver des emojis mignons et des emojis cœur à copier coller ?",
    faq_6_a: "Utilisez la barre de recherche et tapez des mots comme 'heart', 'love', 'star' ou 'cute' pour filtrer la liste instantanément. Vous pouvez aussi ouvrir la catégorie Smileys et Émotions pour les visages mignons, ou parcourir toutes les catégories disponibles.",

    see1: "Sélecteur de Symboles",
    see2: "Générateur de Code-Barres",
    see4: "Couleurs Dominantes de l'Image",

    f_1: "Plus de 3 000 emojis disponibles",
    f_2: "Copie en un clic",
    f_3: "Recherche par mot-clé",
    f_4: "Historique des emojis récents"
  },
  it: {
    m_title: "Copia e Incolla Emoji - Selettore Emoji Online 😀❤️🎉",
    title: "Copia e Incolla Emoji",
    meta: "Selettore di emoji da copiare e incollare. Cerca per parola chiave o esplora 10 categorie: faccine, animali, cibo e simboli. Funziona su iPhone, Android e PC.",
    d1: "Cerca qualsiasi emoji e copiala con un clic. Sfoglia 10 categorie o digita una parola chiave per trovare emoji cuore ❤️, stella ⭐, fuoco 🔥, faccine carine e molto altro. Compatibile con WhatsApp, Instagram, TikTok, Discord e qualsiasi piattaforma che accetti il testo — iPhone, Android, Windows e Mac inclusi.",
    popular_title: "Emoji più cercate",
    popular_p: "Tra i termini più cercati per copiare e incollare emoji ci sono: emoji cuore (❤️ 🧡 💛 💚 💙 💜), emoji fuoco 🔥, emoji stella ⭐, pollice su 👍, emoji risata 😂 e emoji carine come 🥰 🤩 😍. Questo strumento ti permette di trovarle tutte istantaneamente — digita il nome nella ricerca e clicca per copiare.",

    search_label: "Cerca emoji",
    plc: "Cerca... (es: heart, fire, smile)",
    clear: "Cancella ricerca",
    categories: "Categorie",
    recently_copied: "Copiati di recente",
    copied_label: "Copiato!",
    copied_announce: "Emoji copiato negli appunti",
    found: "trovati",
    empty: "Nessun emoji trovato. Prova un'altra parola chiave in inglese.",
    results_label: "Griglia di emoji",

    use_cases_title: "Dove usare le tue emoji",
    uc_1_title: "Instagram, TikTok e social media",
    uc_1_desc: "Dai vita alla tua bio, alle didascalie e ai commenti con emoji espressive. I post con emoji generano maggiore coinvolgimento e rendono il tuo profilo più umano e accattivante.",
    uc_2_title: "WhatsApp e Telegram",
    uc_2_desc: "Esprimi le tue emozioni con maggiore precisione nelle conversazioni. L'emoji giusta definisce il tono del messaggio, non lasciando spazio a malintesi, e rende i testi più veloci da leggere.",
    uc_3_title: "Discord e comunità online",
    uc_3_desc: "Personalizza il tuo nome utente, reagisci ai messaggi e rendi i canali più dinamici. Le emoji sono il linguaggio naturale delle comunità digitali.",
    uc_4_title: "E-mail, presentazioni e contenuti",
    uc_4_desc: "Usale con moderazione per evidenziare punti importanti, umanizzare i titoli e attirare l'attenzione negli oggetti delle e-mail. Un emoji ben posizionato aumenta il tasso di apertura.",

    how_it_works_title: "Come usare",
    hiw_1_title: "Naviga per categorie o cerca",
    hiw_1_desc: "Usa le schede per esplorare le emoji per tema, oppure digita una parola chiave in inglese (es: heart, star, fire) per trovare l'emoji esatto di cui hai bisogno.",
    hiw_2_title: "Clicca per copiare",
    hiw_2_desc: "Un solo clic su qualsiasi emoji lo copia automaticamente negli appunti. Non è necessario selezionare, trascinare o premere tasti aggiuntivi.",
    hiw_3_title: "Incolla ovunque",
    hiw_3_desc: "Una volta copiato, incollalo dove preferisci. Funziona su qualsiasi piattaforma che accetti il testo.",

    categories_title: "Categorie di emoji disponibili",
    categories_intro: "Le emoji sono organizzate in 10 categorie per facilitare la navigazione. Ecco cosa include ciascuna:",
    cat_smileys: "Faccine ed Emozioni",
    cat_smileys_d: "Volti felici, tristi, sorpresi e innamorati, e molto altro. È la categoria più usata per esprimere sentimenti in modo rapido e universale.",
    cat_gestures: "Gesti",
    cat_gestures_d: "Mani che salutano, pollici in su, palmi e gesti quotidiani. Ideali per esprimere accordo, saluti, richieste e reazioni rapide.",
    cat_people: "Persone",
    cat_people_d: "Avatar, famiglie, professioni e diverse rappresentazioni. Utili per umanizzare i messaggi e rappresentare diversi contesti e identità.",
    cat_animals: "Animali e Natura",
    cat_animals_d: "Animali domestici, animali selvatici, piante, fiori e fenomeni naturali. Perfetti per chi ama il mondo naturale o desidera aggiungere un tocco organico al proprio messaggio.",
    cat_food: "Cibo e Bevande",
    cat_food_d: "Frutta, pasti, dessert, bevande e utensili da cucina. Molto utilizzati nelle ricette, nei post gastronomici e nelle conversazioni sul cibo.",
    cat_travel: "Viaggi e Luoghi",
    cat_travel_d: "Mezzi di trasporto, punti turistici, edifici e ambienti. Ideali per post di viaggio, check-in e conversazioni sulle destinazioni.",
    cat_activities: "Attività",
    cat_activities_d: "Sport, giochi, arti, musica e hobby. Esprimi passioni, traguardi e momenti di svago con chiarezza e dinamismo.",
    cat_objects: "Oggetti",
    cat_objects_d: "Tecnologia, strumenti, abbigliamento, accessori e oggetti di uso quotidiano. Comunicano contesti specifici, situazioni e temi in modo visivo.",
    cat_symbols: "Simboli",
    cat_symbols_d: "Segnali stradali, simboli religiosi, valute, marchi e icone. Utili per contestualizzare temi specifici e aggiungere significato visivo.",
    cat_flags: "Bandiere",
    cat_flags_d: "Bandiere di paesi, territori e comunità. Eccellenti per indicare l'origine, supportare una squadra, un contesto geografico o un'identità culturale.",

    unicode_title: "Perché le emoji funzionano su qualsiasi piattaforma",
    unicode_p1: "Le emoji sono caratteri Unicode standardizzati, non immagini o file. Ciò significa che funzionano su tutti i dispositivi, sistemi operativi e applicazioni che supportano il testo: da Android a iPhone, da Windows a Mac, da Instagram a Discord. Quando copi un'emoji qui e la incolli altrove, il risultato è sempre compatibile.",
    unicode_p2: "L'aspetto visivo può variare leggermente tra le piattaforme (il ❤️ su iOS ha uno stile diverso rispetto ad Android), ma il significato e la compatibilità sono universali.",

    faq_title: "Domande e Risposte",
    faq_1_q: "Come copiare e incollare le emoji su un computer?",
    faq_1_a: "Accedi a questa pagina, clicca su qualsiasi emoji per copiarla automaticamente negli appunti. Poi vai all'applicazione o al sito web desiderato e incollala. Nessuna installazione richiesta.",
    faq_2_q: "Le emoji funzionano nelle bio e nelle didascalie di Instagram?",
    faq_2_a: "Sì. Instagram accetta tutte le emoji Unicode in bio, didascalie, commenti, storie e nomi utente. Copia semplicemente l'emoji in questa pagina e incollala direttamente in Instagram, sia dal tuo telefono che dal computer.",
    faq_3_q: "Posso usare le emoji nel mio nome e nei messaggi di WhatsApp?",
    faq_3_a: "Sì. WhatsApp supporta le emoji Unicode nei nomi del profilo, nei messaggi, negli stati e nelle descrizioni dei gruppi.",
    faq_4_q: "Le emoji funzionano nei nickname di giochi come Free Fire e Roblox?",
    faq_4_a: "Dipende dal gioco. Alcuni accettano emoji nei nickname, mentre altri bloccano i caratteri speciali Unicode per motivi di moderazione. Le emoji semplici come ❤️ e ⭐ hanno solitamente una compatibilità migliore. Testa sempre prima di salvare il tuo nickname.",
    faq_5_q: "Come funziona il filtro di ricerca?",
    faq_5_a: "Man mano che digiti la parola chiave, lo strumento filtra automaticamente l'elenco, mostrando solo le emoji che corrispondono al termine di ricerca. Questo ti consente di trovare l'icona esatta in modo rapido e dinamico.",
    faq_6_q: "Dove trovare emoji carine ed emoji cuore da copiare e incollare?",
    faq_6_a: "Usa la barra di ricerca e digita parole come 'heart', 'love', 'star' o 'cute' per filtrare la lista all'istante. Puoi anche aprire la categoria Faccine ed Emozioni per le faccine carine, o sfogliare tutte le categorie disponibili.",

    see1: "Selettore di Simboli",
    see2: "Generatore di Codice a Barre",
    see4: "Colori Dominanti dell'Immagine",

    f_1: "Oltre 3.000 emoji disponibili",
    f_2: "Copia con un clic",
    f_3: "Ricerca per parola chiave",
    f_4: "Cronologia delle emoji recenti"
  },
  id: {
    m_title: "Salin dan Tempel Emoji - Pemilih Emoji Online 😀❤️🎉",
    title: "Salin dan Tempel Emoji",
    meta: "Pemilih emoji untuk disalin dan ditempel. Cari berdasarkan kata kunci atau jelajahi 10 kategori: wajah, hewan, makanan, dan simbol. Berfungsi di iPhone, Android, dan PC.",
    d1: "Cari emoji apa saja dan salin dengan satu klik. Jelajahi 10 kategori atau ketik kata kunci untuk menemukan emoji hati ❤️, bintang ⭐, api 🔥, wajah lucu, dan banyak lagi. Kompatibel dengan WhatsApp, Instagram, TikTok, Discord, dan platform apa pun yang mendukung teks — termasuk iPhone, Android, Windows, dan Mac.",
    popular_title: "Emoji yang paling banyak dicari",
    popular_p: "Beberapa istilah pencarian emoji yang paling populer meliputi: emoji hati (❤️ 🧡 💛 💚 💙 💜), emoji api 🔥, emoji bintang ⭐, jempol 👍, emoji tertawa 😂, dan emoji lucu seperti 🥰 🤩 😍. Alat ini memungkinkan Anda menemukannya secara instan — cukup ketik namanya di kotak pencarian dan klik untuk menyalin.",

    search_label: "Cari emoji",
    plc: "Cari... (contoh: heart, fire, smile)",
    clear: "Hapus pencarian",
    categories: "Kategori",
    recently_copied: "Baru-baru ini disalin",
    copied_label: "Disalin!",
    copied_announce: "Emoji disalin ke papan klip",
    found: "ditemukan",
    empty: "Tidak ada emoji yang ditemukan. Coba kata kunci lain dalam bahasa Inggris.",
    results_label: "Kisi emoji",

    use_cases_title: "Di mana menggunakan emoji Anda",
    uc_1_title: "Instagram, TikTok, dan media sosial",
    uc_1_desc: "Hidupkan bio, takarir, dan komentar Anda dengan emoji yang ekspresif. Postingan dengan emoji menghasilkan lebih banyak keterlibatan dan membuat profil Anda lebih manusiawi dan menarik.",
    uc_2_title: "WhatsApp dan Telegram",
    uc_2_desc: "Ekspresikan emosi Anda dengan lebih akurat dalam percakapan Anda. Emoji yang tepat mengatur nada pesan, tanpa menyisakan ruang untuk kesalahpahaman, dan membuat teks lebih cepat dibaca.",
    uc_3_title: "Discord dan komunitas online",
    uc_3_desc: "Sesuaikan nama pengguna Anda, bereaksi terhadap pesan, dan buat saluran lebih dinamis. Emoji adalah bahasa alami dari komunitas digital.",
    uc_4_title: "Email, presentasi, dan konten",
    uc_4_desc: "Gunakan secukupnya untuk menyorot poin penting, memanusiakan judul, dan menarik perhatian di subjek email. Emoji yang ditempatkan dengan baik meningkatkan tingkat buka email.",

    how_it_works_title: "Cara menggunakan",
    hiw_1_title: "Telusuri berdasarkan kategori atau cari",
    hiw_1_desc: "Gunakan tab untuk menjelajahi emoji berdasarkan tema, atau ketik kata kunci dalam bahasa Inggris (contoh: heart, star, fire) untuk menemukan emoji persis yang Anda butuhkan.",
    hiw_2_title: "Klik untuk menyalin",
    hiw_2_desc: "Satu klik pada emoji mana pun secara otomatis menyalinnya ke papan klip Anda. Tidak perlu memilih, menyeret, atau menekan tombol tambahan apa pun.",
    hiw_3_title: "Tempel di mana saja",
    hiw_3_desc: "Setelah disalin, tempel di mana pun Anda mau. Ini berfungsi di platform mana pun yang menerima teks.",

    categories_title: "Kategori emoji yang tersedia",
    categories_intro: "Emoji disusun menjadi 10 kategori untuk memudahkan navigasi. Inilah yang termasuk dalam setiap kategori:",
    cat_smileys: "Smiley & Emosi",
    cat_smileys_d: "Wajah bahagia, sedih, terkejut, dan jatuh cinta, dan banyak lagi. Ini adalah kategori yang paling banyak digunakan untuk mengekspresikan perasaan dengan cepat dan universal.",
    cat_gestures: "Gestur",
    cat_gestures_d: "Tangan melambai, jempol ke atas, telapak tangan, dan gerakan sehari-hari. Ideal untuk mengekspresikan persetujuan, salam, permintaan, dan reaksi cepat.",
    cat_people: "Orang",
    cat_people_d: "Avatar, keluarga, profesi, dan beragam representasi. Berguna untuk memanusiakan pesan dan mewakili konteks dan identitas yang berbeda.",
    cat_animals: "Hewan & Alam",
    cat_animals_d: "Hewan peliharaan, hewan liar, tanaman, bunga, dan fenomena alam. Sempurna bagi mereka yang mencintai alam atau ingin menambahkan sentuhan organik pada pesan mereka.",
    cat_food: "Makanan & Minuman",
    cat_food_d: "Buah-buahan, makanan, makanan penutup, minuman, dan peralatan dapur. Banyak digunakan dalam resep, postingan gastronomi, dan percakapan tentang makanan.",
    cat_travel: "Perjalanan & Tempat",
    cat_travel_d: "Alat transportasi, tempat wisata, bangunan, dan lingkungan. Cocok untuk postingan perjalanan, lapor masuk, dan percakapan tentang destinasi.",
    cat_activities: "Aktivitas",
    cat_activities_d: "Olahraga, permainan, seni, musik, dan hobi. Ekspresikan gairah, pencapaian, dan momen santai Anda dengan jelas dan dinamis.",
    cat_objects: "Benda",
    cat_objects_d: "Teknologi, alat, pakaian, aksesori, dan benda sehari-hari. Mereka mengkomunikasikan konteks spesifik, situasi, dan tema secara visual.",
    cat_symbols: "Simbol",
    cat_symbols_d: "Rambu lalu lintas, simbol agama, mata uang, merek, dan ikon. Berguna untuk mengkontekstualisasikan tema tertentu dan menambahkan makna visual.",
    cat_flags: "Bendera",
    cat_flags_d: "Bendera negara, wilayah, dan komunitas. Sangat baik untuk menunjukkan asal, mendukung tim, konteks geografis, atau identitas budaya.",

    unicode_title: "Mengapa emoji berfungsi di platform apa pun",
    unicode_p1: "Emoji adalah karakter Unicode standar, bukan gambar atau file. Ini berarti bahwa mereka berfungsi di semua perangkat, sistem operasi, dan aplikasi yang mendukung teks: dari Android ke iPhone, Windows ke Mac, Instagram ke Discord. Saat Anda menyalin emoji di sini dan menempelkannya di tempat lain, hasilnya selalu kompatibel.",
    unicode_p2: "Penampilan visual mungkin sedikit berbeda antara platform (❤️ di iOS memiliki gaya yang berbeda dari Android), tetapi arti dan kompatibilitasnya universal.",

    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Bagaimana cara menyalin dan menempel emoji di komputer?",
    faq_1_a: "Akses halaman ini, klik emoji mana pun untuk menyalinnya secara otomatis ke papan klip Anda. Kemudian, buka aplikasi atau situs web yang Anda inginkan dan tempelkan. Tidak perlu penginstalan.",
    faq_2_q: "Apakah emoji berfungsi di bio dan takarir Instagram?",
    faq_2_a: "Ya. Instagram menerima semua emoji Unicode di bio, takarir, komentar, cerita, dan nama pengguna. Cukup salin emoji di halaman ini dan tempelkan langsung ke Instagram, baik di ponsel atau komputer Anda.",
    faq_3_q: "Bisakah saya menggunakan emoji di nama dan pesan WhatsApp saya?",
    faq_3_a: "Ya. WhatsApp mendukung emoji Unicode dalam nama profil, pesan, status, dan deskripsi grup.",
    faq_4_q: "Apakah emoji berfungsi di nama panggilan game seperti Free Fire dan Roblox?",
    faq_4_a: "Tergantung gamenya. Beberapa menerima emoji dalam nama panggilan, sementara yang lain memblokir karakter Unicode khusus untuk alasan moderasi. Emoji sederhana seperti ❤️ dan ⭐ biasanya memiliki kompatibilitas yang lebih baik. Selalu uji sebelum menyimpan nama panggilan Anda.",
    faq_5_q: "Bagaimana cara kerja filter pencarian?",
    faq_5_a: "Saat Anda mengetik kata kunci, alat ini secara otomatis memfilter daftar, hanya menampilkan emoji yang cocok dengan istilah pencarian Anda. Ini memungkinkan Anda menemukan ikon yang tepat dengan cepat dan dinamis.",
    faq_6_q: "Di mana menemukan emoji lucu dan emoji hati untuk disalin dan ditempel?",
    faq_6_a: "Gunakan kotak pencarian di halaman ini dan ketik kata seperti 'heart', 'love', 'star', atau 'cute' untuk memfilter daftar secara instan. Anda juga bisa membuka kategori Smiley & Emosi untuk wajah-wajah lucu, atau menelusuri semua kategori yang tersedia.",

    see1: "Pemilih Simbol",
    see2: "Generator Barcode",
    see4: "Warna Dominan Gambar",

    f_1: "Lebih dari 3.000 emoji tersedia",
    f_2: "Salin dengan satu klik",
    f_3: "Pencarian berdasarkan kata kunci",
    f_4: "Riwayat emoji terbaru"
  },
  de: {
    m_title: "Emojis Kopieren und Einfügen - Online Emoji-Auswahl 😀❤️🎉",
    title: "Emojis Kopieren und Einfügen",
    meta: "Emoji-Auswahl zum Kopieren und Einfügen. Suchen Sie per Stichwort oder durchsuchen Sie 10 Kategorien: Smileys, Tiere, Essen und Symbole. Funktioniert auf iPhone, Android und PC.",
    d1: "Suchen Sie jedes Emoji und kopieren Sie es mit einem Klick. Durchsuchen Sie 10 Kategorien oder tippen Sie ein Stichwort ein, um Herz-Emojis ❤️, Stern-Emojis ⭐, Feuer-Emojis 🔥, süße Gesichter und vieles mehr zu finden. Kompatibel mit WhatsApp, Instagram, TikTok, Discord und jeder Plattform, die Text akzeptiert — iPhone, Android, Windows und Mac inklusive.",
    popular_title: "Meistgesuchte Emojis",
    popular_p: "Zu den am häufigsten gesuchten Emoji-Kopieren-Einfügen-Begriffen gehören: Herz-Emojis (❤️ 🧡 💛 💚 💙 💜), Feuer-Emoji 🔥, Stern-Emoji ⭐, Daumen hoch 👍, Lach-Emoji 😂 und süße Emojis wie 🥰 🤩 😍. Dieses Tool findet sie alle sofort — geben Sie den Namen in die Suche ein und klicken Sie zum Kopieren.",

    search_label: "Emojis suchen",
    plc: "Suchen... (z.B. heart, fire, smile)",
    clear: "Suche löschen",
    categories: "Kategorien",
    recently_copied: "Kürzlich kopiert",
    copied_label: "Kopiert!",
    copied_announce: "Emoji in die Zwischenablage kopiert",
    found: "gefunden",
    empty: "Keine Emojis gefunden. Versuchen Sie ein anderes englisches Stichwort.",
    results_label: "Emoji-Raster",

    use_cases_title: "Wo Sie Ihre Emojis verwenden können",
    uc_1_title: "Instagram, TikTok und soziale Medien",
    uc_1_desc: "Erwecken Sie Ihre Bio, Bildunterschriften und Kommentare mit ausdrucksstarken Emojis zum Leben. Beiträge mit Emojis erzeugen mehr Engagement und machen Ihr Profil menschlicher und ansprechender.",
    uc_2_title: "WhatsApp und Telegram",
    uc_2_desc: "Drücken Sie Emotionen in Ihren Unterhaltungen präziser aus. Das richtige Emoji gibt den Ton der Nachricht an, lässt keinen Raum für Missverständnisse und macht Texte schneller lesbar.",
    uc_3_title: "Discord und Online-Communities",
    uc_3_desc: "Passen Sie Ihren Benutzernamen an, reagieren Sie auf Nachrichten und machen Sie Kanäle dynamischer. Emojis sind die natürliche Sprache digitaler Gemeinschaften.",
    uc_4_title: "E-Mails, Präsentationen und Inhalte",
    uc_4_desc: "Verwenden Sie sie sparsam, um wichtige Punkte hervorzuheben, Titel zu vermenschlichen und Aufmerksamkeit in E-Mail-Betreffzeilen zu erregen. Ein gut platziertes Emoji erhöht die Öffnungsrate.",

    how_it_works_title: "Wie man es benutzt",
    hiw_1_title: "Nach Kategorien durchsuchen oder suchen",
    hiw_1_desc: "Verwenden Sie die Tabs, um Emojis nach Themen zu erkunden, oder tippen Sie ein englisches Stichwort ein (z.B. heart, star, fire), um genau das Emoji zu finden, das Sie benötigen.",
    hiw_2_title: "Zum Kopieren klicken",
    hiw_2_desc: "Ein einziger Klick auf ein beliebiges Emoji kopiert es automatisch in Ihre Zwischenablage. Es ist kein Auswählen, Ziehen oder Drücken zusätzlicher Tasten erforderlich.",
    hiw_3_title: "Überall einfügen",
    hiw_3_desc: "Einmal kopiert, fügen Sie es ein, wo immer Sie möchten. Es funktioniert auf jeder Plattform, die Text akzeptiert.",

    categories_title: "Verfügbare Emoji-Kategorien",
    categories_intro: "Emojis sind in 10 Kategorien unterteilt, um die Navigation zu erleichtern. Hier ist, was jede enthält:",
    cat_smileys: "Smileys & Emotionen",
    cat_smileys_d: "Glückliche, traurige, überraschte und verliebte Gesichter und vieles mehr. Es ist die am häufigsten verwendete Kategorie, um Gefühle schnell und universell auszudrücken.",
    cat_gestures: "Gesten",
    cat_gestures_d: "Winkende Hände, Daumen hoch, Handflächen und alltägliche Gesten. Ideal, um Zustimmung, Grüße, Bitten und schnelle Reaktionen auszudrücken.",
    cat_people: "Personen",
    cat_people_d: "Avatare, Familien, Berufe und verschiedene Darstellungen. Nützlich, um Nachrichten zu vermenschlichen und verschiedene Kontexte und Identitäten darzustellen.",
    cat_animals: "Tiere & Natur",
    cat_animals_d: "Haustiere, wilde Tiere, Pflanzen, Blumen und Naturphänomene. Perfekt für alle, die die Natur lieben oder ihrer Nachricht eine organische Note verleihen möchten.",
    cat_food: "Essen & Trinken",
    cat_food_d: "Obst, Mahlzeiten, Desserts, Getränke und Küchenutensilien. Viel verwendet in Rezepten, Gastronomie-Beiträgen und Gesprächen über Essen.",
    cat_travel: "Reisen & Orte",
    cat_travel_d: "Transportmittel, Sehenswürdigkeiten, Gebäude und Umgebungen. Großartig für Reisebeiträge, Check-ins und Gespräche über Reiseziele.",
    cat_activities: "Aktivitäten",
    cat_activities_d: "Sport, Spiele, Kunst, Musik und Hobbys. Drücken Sie Leidenschaften, Erfolge und Freizeitmomente klar und dynamisch aus.",
    cat_objects: "Objekte",
    cat_objects_d: "Technologie, Werkzeuge, Kleidung, Accessoires und Alltagsgegenstände. Sie kommunizieren spezifische Kontexte, Situationen und Themen visuell.",
    cat_symbols: "Symbole",
    cat_symbols_d: "Verkehrsschilder, religiöse Symbole, Währungen, Marken und Symbole. Nützlich, um spezifische Themen in einen Kontext zu setzen und visuelle Bedeutung hinzuzufügen.",
    cat_flags: "Flaggen",
    cat_flags_d: "Flaggen von Ländern, Gebieten und Gemeinschaften. Hervorragend geeignet, um Herkunft anzuzeigen, ein Team zu unterstützen, für geografischen Kontext oder kulturelle Identität.",

    unicode_title: "Warum Emojis auf jeder Plattform funktionieren",
    unicode_p1: "Emojis sind standardisierte Unicode-Zeichen, keine Bilder oder Dateien. Das bedeutet, dass sie auf allen Geräten, Betriebssystemen und Anwendungen funktionieren, die Text unterstützen: von Android bis iPhone, von Windows bis Mac, von Instagram bis Discord. Wenn Sie hier ein Emoji kopieren und woanders einfügen, ist das Ergebnis immer kompatibel.",
    unicode_p2: "Das visuelle Erscheinungsbild kann zwischen den Plattformen leicht variieren (das ❤️ unter iOS hat einen anderen Stil als unter Android), aber die Bedeutung und Kompatibilität sind universell.",

    faq_title: "Fragen und Antworten",
    faq_1_q: "Wie kopiere und füge ich Emojis am Computer ein?",
    faq_1_a: "Greifen Sie auf diese Seite zu und klicken Sie auf ein beliebiges Emoji, um es automatisch in Ihre Zwischenablage zu kopieren. Gehen Sie dann zu Ihrer gewünschten App oder Website und fügen Sie es ein. Keine Installation erforderlich.",
    faq_2_q: "Funktionieren Emojis in Instagram-Bios und Bildunterschriften?",
    faq_2_a: "Ja. Instagram akzeptiert alle Unicode-Emojis in Bios, Bildunterschriften, Kommentaren, Stories und Benutzernamen. Kopieren Sie einfach das Emoji auf dieser Seite und fügen Sie es direkt in Instagram ein, egal ob auf Ihrem Telefon oder Computer.",
    faq_3_q: "Kann ich Emojis in meinem WhatsApp-Namen und in Nachrichten verwenden?",
    faq_3_a: "Ja. WhatsApp unterstützt Unicode-Emojis in Profilnamen, Nachrichten, Statusmeldungen und Gruppenbeschreibungen.",
    faq_4_q: "Funktionieren Emojis in Gaming-Nicknames wie Free Fire und Roblox?",
    faq_4_a: "Es hängt vom Spiel ab. Einige akzeptieren Emojis in Nicknames, während andere spezielle Unicode-Zeichen aus Moderationsgründen blockieren. Einfache Emojis wie ❤️ und ⭐ haben normalerweise eine bessere Kompatibilität. Testen Sie immer, bevor Sie Ihren Nick speichern.",
    faq_5_q: "Wie funktioniert der Suchfilter?",
    faq_5_a: "Während Sie das Stichwort eingeben, filtert das Tool die Liste automatisch und zeigt nur die Emojis an, die Ihrem Suchbegriff entsprechen. Dadurch finden Sie das genaue Symbol schnell und dynamisch.",
    faq_6_q: "Wo finde ich süße Emojis und Herz-Emojis zum Kopieren und Einfügen?",
    faq_6_a: "Nutzen Sie das Suchfeld und tippen Sie Wörter wie 'heart', 'love', 'star' oder 'cute' ein, um die Liste sofort zu filtern. Sie können auch die Kategorie Smileys & Emotionen für süße Gesichter öffnen oder alle verfügbaren Kategorien durchsuchen.",

    see1: "Symbol-Auswahl",
    see2: "Barcode-Generator",
    see4: "Dominante Bildfarben",

    f_1: "Mehr als 3.000 Emojis verfügbar",
    f_2: "Kopieren mit einem Klick",
    f_3: "Suche nach Stichwort",
    f_4: "Verlauf der letzten Emojis"
  },
  nl: {
    m_title: "Emoji's Kopiëren en Plakken - Online Emoji-Kiezer 😀❤️🎉",
    title: "Emoji's Kopiëren en Plakken",
    meta: "Emoji-kiezer om te kopiëren en plakken. Zoek op trefwoord of verken 10 categorieën: smileys, dieren, eten en symbolen. Werkt op iPhone, Android en PC.",
    d1: "Zoek een emoji en kopieer die met één klik. Blader door 10 categorieën of typ een trefwoord om hart-emoji's ❤️, ster-emoji's ⭐, vuur-emoji's 🔥, schattige gezichten en nog veel meer te vinden. Compatibel met WhatsApp, Instagram, TikTok, Discord en elk platform dat tekst accepteert — inclusief iPhone, Android, Windows en Mac.",
    popular_title: "Meest gezochte emoji's",
    popular_p: "Tot de meest gezochte emoji kopiëren en plakken-termen behoren: hart-emoji's (❤️ 🧡 💛 💚 💙 💜), vuur-emoji 🔥, ster-emoji ⭐, duim omhoog 👍, lach-emoji 😂 en schattige emoji's zoals 🥰 🤩 😍. Met dit tool vind je ze direct — typ de naam in het zoekveld en klik om te kopiëren.",

    search_label: "Zoek emoji's",
    plc: "Zoeken... (bijv. heart, fire, smile)",
    clear: "Zoekopdracht wissen",
    categories: "Categorieën",
    recently_copied: "Recent gekopieerd",
    copied_label: "Gekopieerd!",
    copied_announce: "Emoji gekopieerd naar klembord",
    found: "gevonden",
    empty: "Geen emoji's gevonden. Probeer een ander Engels trefwoord.",
    results_label: "Emoji-raster",

    use_cases_title: "Waar u uw emoji's kunt gebruiken",
    uc_1_title: "Instagram, TikTok en sociale media",
    uc_1_desc: "Breng je bio, bijschriften en reacties tot leven met expressieve emoji's. Berichten met emoji's genereren meer betrokkenheid en maken je profiel menselijker en aantrekkelijker.",
    uc_2_title: "WhatsApp en Telegram",
    uc_2_desc: "Druk je emoties nauwkeuriger uit in je gesprekken. De juiste emoji zet de toon van het bericht, laat geen ruimte voor misverstanden en maakt teksten sneller leesbaar.",
    uc_3_title: "Discord en online communities",
    uc_3_desc: "Pas je gebruikersnaam aan, reageer op berichten en maak kanalen dynamischer. Emoji's zijn de natuurlijke taal van digitale gemeenschappen.",
    uc_4_title: "E-mails, presentaties en inhoud",
    uc_4_desc: "Gebruik ze spaarzaam om belangrijke punten te benadrukken, titels te vermenselijken en de aandacht te trekken in onderwerpregels van e-mails. Een goed geplaatste emoji verhoogt de open rate.",

    how_it_works_title: "Hoe te gebruiken",
    hiw_1_title: "Blader door categorieën of zoek",
    hiw_1_desc: "Gebruik de tabbladen om emoji's op thema te verkennen, of typ een Engels trefwoord in (bijv. heart, star, fire) om precies de emoji te vinden die je nodig hebt.",
    hiw_2_title: "Klik om te kopiëren",
    hiw_2_desc: "Een enkele klik op een emoji kopieert deze automatisch naar uw klembord. U hoeft niet te selecteren, slepen of extra toetsen in te drukken.",
    hiw_3_title: "Plak overal",
    hiw_3_desc: "Eenmaal gekopieerd, plak je het waar je maar wilt. Het werkt op elk platform dat tekst accepteert.",

    categories_title: "Beschikbare emoji-categorieën",
    categories_intro: "Emoji's zijn geordend in 10 categorieën om navigatie te vergemakkelijken. Dit is wat elke categorie bevat:",
    cat_smileys: "Smileys en Emoties",
    cat_smileys_d: "Blije, droevige, verraste en verliefde gezichten en nog veel meer. Het is de meest gebruikte categorie om gevoelens snel en universeel uit te drukken.",
    cat_gestures: "Gebaren",
    cat_gestures_d: "Zwaaiende handen, duimen omhoog, handpalmen en alledaagse gebaren. Ideaal om instemming, groeten, verzoeken en snelle reacties uit te drukken.",
    cat_people: "Mensen",
    cat_people_d: "Avatars, families, beroepen en diverse weergaven. Handig om berichten te vermenselijken en verschillende contexten en identiteiten weer te geven.",
    cat_animals: "Dieren en Natuur",
    cat_animals_d: "Huisdieren, wilde dieren, planten, bloemen en natuurlijke fenomenen. Perfect voor degenen die van de natuur houden of een organisch tintje aan hun bericht willen toevoegen.",
    cat_food: "Eten en Drinken",
    cat_food_d: "Fruit, maaltijden, desserts, dranken en keukengerei. Veel gebruikt in recepten, gastronomische berichten en gesprekken over eten.",
    cat_travel: "Reizen en Plaatsen",
    cat_travel_d: "Vervoermiddelen, toeristische plekken, gebouwen en omgevingen. Geweldig voor reisberichten, check-ins en gesprekken over bestemmingen.",
    cat_activities: "Activiteiten",
    cat_activities_d: "Sport, spellen, kunst, muziek en hobby's. Druk uw passies, prestaties en vrijetijdsmomenten duidelijk en dynamisch uit.",
    cat_objects: "Objecten",
    cat_objects_d: "Technologie, gereedschappen, kleding, accessoires en alledaagse voorwerpen. Ze communiceren specifieke contexten, situaties en thema's visueel.",
    cat_symbols: "Symbolen",
    cat_symbols_d: "Verkeersborden, religieuze symbolen, valuta's, merken en iconen. Handig om specifieke thema's in een context te plaatsen en visuele betekenis toe te voegen.",
    cat_flags: "Vlaggen",
    cat_flags_d: "Vlaggen van landen, gebieden en gemeenschappen. Uitstekend om herkomst aan te geven, een team te steunen, voor geografische context of culturele identiteit.",

    unicode_title: "Waarom emoji's op elk platform werken",
    unicode_p1: "Emoji's zijn gestandaardiseerde Unicode-tekens, geen afbeeldingen of bestanden. Dit betekent dat ze werken op alle apparaten, besturingssystemen en applicaties die tekst ondersteunen: van Android tot iPhone, van Windows tot Mac, van Instagram tot Discord. Wanneer je hier een emoji kopieert en ergens anders plakt, is het resultaat altijd compatibel.",
    unicode_p2: "Het visuele uiterlijk kan per platform enigszins verschillen (de ❤️ op iOS heeft een andere stijl dan op Android), maar de betekenis en compatibiliteit zijn universeel.",

    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Hoe emoji's kopiëren en plakken op een computer?",
    faq_1_a: "Ga naar deze pagina, klik op een emoji om deze automatisch naar uw klembord te kopiëren. Ga vervolgens naar de gewenste app of website en plak het. Geen installatie vereist.",
    faq_2_q: "Werken emoji's in Instagram-bio's en bijschriften?",
    faq_2_a: "Ja. Instagram accepteert alle Unicode-emoji's in bio's, bijschriften, opmerkingen, verhalen en gebruikersnamen. Kopieer gewoon de emoji op deze pagina en plak deze rechtstreeks in Instagram, of het nu op uw telefoon of computer is.",
    faq_3_q: "Kan ik emoji's gebruiken in mijn WhatsApp-naam en -berichten?",
    faq_3_a: "Ja. WhatsApp ondersteunt Unicode-emoji's in profielnamen, berichten, statussen en groepsbeschrijvingen.",
    faq_4_q: "Werken emoji's in gaming-nicknames zoals Free Fire en Roblox?",
    faq_4_a: "Het hangt af van de game. Sommige accepteren emoji's in bijnamen, terwijl andere speciale Unicode-tekens blokkeren om moderatieredenen. Eenvoudige emoji's zoals ❤️ en ⭐ hebben meestal een betere compatibiliteit. Test altijd voordat u uw bijnaam opslaat.",
    faq_5_q: "Hoe werkt het zoekfilter?",
    faq_5_a: "Terwijl u het trefwoord typt, filtert de tool de lijst automatisch en toont alleen de emoji's die overeenkomen met uw zoekterm. Hierdoor kunt u snel en dynamisch het exacte pictogram vinden.",
    faq_6_q: "Waar vind ik schattige emoji's en hart-emoji's om te kopiëren en plakken?",
    faq_6_a: "Gebruik het zoekveld en typ woorden zoals 'heart', 'love', 'star' of 'cute' om de lijst direct te filteren. Je kunt ook de categorie Smileys en Emoties openen voor schattige gezichten, of alle beschikbare categorieën verkennen.",

    see1: "Symboolkiezer",
    see2: "Barcode Generator",
    see4: "Dominante Afbeeldingskleuren",

    f_1: "Meer dan 3.000 emoji's beschikbaar",
    f_2: "Kopiëren met één klik",
    f_3: "Zoeken op trefwoord",
    f_4: "Geschiedenis van recente emoji's"
  },
  ru: {
    m_title: "Скопировать и Вставить Эмодзи - Онлайн Выбор Эмодзи 😀❤️🎉",
    title: "Скопировать и Вставить Эмодзи",
    meta: "Выбор эмодзи для копирования и вставки. Ищите по ключевым словам или исследуйте 10 категорий: смайлики, животные, еда и символы. Работает на iPhone, Android и ПК.",
    d1: "Ищите любой эмодзи и копируйте его в один клик. Просматривайте 10 категорий или введите ключевое слово, чтобы быстро найти эмодзи сердца ❤️, звезды ⭐, огня 🔥, милых лиц и многого другого. Совместимо с WhatsApp, Instagram, TikTok, Discord и любой платформой, поддерживающей текст, включая iPhone, Android, Windows и Mac.",
    popular_title: "Самые популярные эмодзи",
    popular_p: "Среди наиболее частых запросов для копирования и вставки эмодзи: эмодзи сердца (❤️ 🧡 💛 💚 💙 💜), эмодзи огня 🔥, эмодзи звезды ⭐, большой палец вверх 👍, смех до слез 😂 и милые эмодзи, такие как 🥰 🤩 😍. Этот инструмент позволяет быстро найти их все — просто введите название в поиск и кликните, чтобы скопировать.",
    search_label: "Поиск эмодзи",
    plc: "Поиск... (например, heart, fire, smile)",
    clear: "Очистить поиск",
    categories: "Категории",
    recently_copied: "Недавно скопированные",
    copied_label: "Скопировано!",
    copied_announce: "Эмодзи скопирован в буфер обмена",
    found: "найдено",
    empty: "Эмодзи не найдены. Попробуйте другое ключевое слово на английском языке.",
    results_label: "Сетка эмодзи",
    use_cases_title: "Где использовать эмодзи",
    uc_1_title: "Instagram, TikTok и социальные сети",
    uc_1_desc: "Оживите описание профиля, подписи и комментарии выразительными эмодзи. Посты с эмодзи вызывают больше вовлеченности, делая профиль более человечным и привлекательным.",
    uc_2_title: "WhatsApp и Telegram",
    uc_2_desc: "Точнее выражайте свои эмоции в разговорах. Правильный эмодзи задает тон сообщения, не оставляя места для недопонимания, и ускоряет чтение текстов.",
    uc_3_title: "Discord и онлайн-сообщества",
    uc_3_desc: "Персонализируйте свой никнейм, реагируйте на сообщения и делайте каналы динамичнее. Эмодзи — это естественный язык цифровых сообществ.",
    uc_4_title: "E-mail, презентации и контент",
    uc_4_desc: "Используйте умеренно для выделения важных моментов, очеловечивания заголовков и привлечения внимания в темах писем. Уместно размещенный эмодзи увеличивает открываемость писем.",
    how_it_works_title: "Как пользоваться",
    hiw_1_title: "Просматривайте категории или ищите",
    hiw_1_desc: "Используйте вкладки для изучения эмодзи по темам или введите ключевое слово на английском (например, heart, star, fire), чтобы найти именно тот эмодзи, который вам нужен.",
    hiw_2_title: "Кликните, чтобы скопировать",
    hiw_2_desc: "Один клик на любой эмодзи автоматически копирует его в буфер обмена. Нет необходимости выделять, перетаскивать или нажимать дополнительные клавиши.",
    hiw_3_title: "Вставьте куда угодно",
    hiw_3_desc: "После копирования вставьте в любое нужное место. Это работает на любой платформе, принимающей текст.",
    categories_title: "Доступные категории эмодзи",
    categories_intro: "Эмодзи распределены по 10 категориям для удобства навигации. Вот что включает каждая из них:",
    cat_smileys: "Смайлы и эмоции",
    cat_smileys_d: "Счастливые, грустные, удивленные, влюбленные лица и многое другое. Это самая популярная категория для быстрого и универсального выражения чувств.",
    cat_gestures: "Жесты",
    cat_gestures_d: "Машущие руки, большие пальцы, ладони и повседневные жесты. Идеально подходят для выражения согласия, приветствия, просьб и быстрой реакции.",
    cat_people: "Люди",
    cat_people_d: "Аватары, семьи, профессии и различные репрезентации. Полезны для очеловечивания сообщений и отображения различных контекстов и личностей.",
    cat_animals: "Животные и природа",
    cat_animals_d: "Домашние питомцы, дикие животные, растения, цветы и природные явления. Идеально подходят для тех, кто любит мир природы или хочет добавить натуральный оттенок в сообщение.",
    cat_food: "Еда и напитки",
    cat_food_d: "Фрукты, блюда, десерты, напитки и кухонные принадлежности. Широко используются в рецептах, гастрономических публикациях и разговорах о еде.",
    cat_travel: "Путешествия и места",
    cat_travel_d: "Транспортные средства, достопримечательности, здания и окружение. Отлично подходят для туристических публикаций, отметок о прибытии и разговоров о направлениях.",
    cat_activities: "Активность",
    cat_activities_d: "Спорт, игры, искусство, музыка и хобби. Четко и динамично выражают увлечения, достижения и моменты досуга.",
    cat_objects: "Предметы",
    cat_objects_d: "Технологии, инструменты, одежда, аксессуары и повседневные вещи. Визуально передают конкретные контексты, ситуации и темы.",
    cat_symbols: "Символы",
    cat_symbols_d: "Дорожные знаки, религиозные символы, валюты, бренды и значки. Полезны для контекстуализации конкретных тем и добавления визуального смысла.",
    cat_flags: "Флаги",
    cat_flags_d: "Флаги стран, территорий и сообществ. Отлично подходят для указания происхождения, поддержки команды, географического контекста или культурной идентичности.",
    unicode_title: "Почему эмодзи работают на любой платформе",
    unicode_p1: "Эмодзи — это стандартизированные символы Unicode, а не изображения или файлы. Это значит, что они работают на всех устройствах, операционных системах и в приложениях, поддерживающих текст: от Android до iPhone, от Windows до Mac, от Instagram до Discord. Когда вы копируете эмодзи здесь и вставляете его в другом месте, результат всегда совместим.",
    unicode_p2: "Визуальный вид может незначительно отличаться на разных платформах (❤️ на iOS выглядит иначе, чем на Android), но значение и совместимость остаются универсальными.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Как копировать и вставлять эмодзи на компьютере?",
    faq_1_a: "Перейдите на эту страницу, кликните на любой эмодзи для его автоматического копирования в буфер обмена. Затем откройте нужное приложение или сайт и вставьте его. Установка программ не требуется.",
    faq_2_q: "Работают ли эмодзи в описании профиля и подписях в Instagram?",
    faq_2_a: "Да. Instagram принимает все эмодзи Unicode в био, подписях, комментариях, историях и никнеймах. Просто скопируйте эмодзи на этой странице и вставьте прямо в Instagram как с телефона, так и с компьютера.",
    faq_3_q: "Могу ли я использовать эмодзи в имени и сообщениях в WhatsApp?",
    faq_3_a: "Да. WhatsApp поддерживает эмодзи Unicode в именах профилей, сообщениях, статусах и описаниях групп.",
    faq_4_q: "Работают ли эмодзи в игровых никнеймах, таких как Free Fire и Roblox?",
    faq_4_a: "Это зависит от игры. Некоторые разрешают эмодзи в никнеймах, другие блокируют специальные символы Unicode в целях модерации. Простые эмодзи, такие как ❤️ и ⭐, обычно имеют лучшую совместимость. Всегда проверяйте никнейм перед сохранением.",
    faq_5_q: "Как работает поисковый фильтр?",
    faq_5_a: "По мере ввода ключевого слова инструмент автоматически фильтрует список, отображая только те эмодзи, которые соответствуют вашему поисковому запросу. Это позволяет быстро и динамично найти подходящий значок.",
    faq_6_q: "Где найти милые эмодзи и эмодзи сердца для копирования и вставки?",
    faq_6_a: "Используйте поле поиска на этой странице и введите слова 'heart', 'love', 'star' или 'cute' для мгновенной фильтрации списка. Вы также можете открыть категорию 'Смайлы и эмоции' для поиска милых лиц или изучить все доступные категории.",
    see1: "Выбор символов",
    see2: "Генератор штрихкодов",
    see4: "Доминантные цвета изображения",
    f_1: "Более 3000 доступных эмодзи",
    f_2: "Копирование в один клик",
    f_3: "Поиск по ключевым словам",
    f_4: "История недавних эмодзи"
  }
}
</i18n>