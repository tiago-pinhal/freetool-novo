<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const COPY_FEEDBACK_MS = 2000
const MAX_RECENT = 10

interface Category {
  id: string
  name: string
  icon: string
}

const categories: Category[] = [
  { id: 'smile', name: 'cat_smile', icon: '🙂' },
  { id: 'happy', name: 'cat_happy', icon: '😃' },
  { id: 'laugh', name: 'cat_laugh', icon: '😂' },
  { id: 'cute', name: 'cat_cute', icon: '🥰' },
  { id: 'shy', name: 'cat_shy', icon: '☺️' },
  { id: 'wink', name: 'cat_wink', icon: '😉' },
  { id: 'love', name: 'cat_love', icon: '❤️' },
  { id: 'sad', name: 'cat_sad', icon: '😭' },
  { id: 'cry', name: 'cat_cry', icon: '😢' },
  { id: 'angry', name: 'cat_angry', icon: '😡' },
  { id: 'annoyed', name: 'cat_annoyed', icon: '😒' },
  { id: 'surprised', name: 'cat_surprised', icon: '😲' },
  { id: 'scared', name: 'cat_scared', icon: '😨' },
  { id: 'confused', name: 'cat_confused', icon: '😵‍💫' },
  { id: 'thinking', name: 'cat_thinking', icon: '🤔' },
  { id: 'tired', name: 'cat_tired', icon: '😫' },
  { id: 'sleep', name: 'cat_sleep', icon: '😴' },
  { id: 'sorry', name: 'cat_sorry', icon: '🙏' },
  { id: 'thanks', name: 'cat_thanks', icon: '🙇' },
  { id: 'hello', name: 'cat_hello', icon: '👋' },
  { id: 'bye', name: 'cat_bye', icon: '🙋' },
  { id: 'please', name: 'cat_please', icon: '🥺' },
  { id: 'yes-ok', name: 'cat_yes_ok', icon: '👌' },
  { id: 'no', name: 'cat_no', icon: '🙅' },
  { id: 'shrug', name: 'cat_shrug', icon: '🤷‍♂️' },
  { id: 'facepalm', name: 'cat_facepalm', icon: '🤦' },
  { id: 'table-flip', name: 'cat_table_flip', icon: '┻' },
  { id: 'celebration', name: 'cat_celebration', icon: '🎉' },
  { id: 'excited', name: 'cat_excited', icon: '🤩' },
  { id: 'applause', name: 'cat_applause', icon: '👏' },
  { id: 'fight', name: 'cat_fight', icon: '👊' },
  { id: 'hug', name: 'cat_hug', icon: '🤗' },
  { id: 'kiss', name: 'cat_kiss', icon: '😘' },
  { id: 'drink', name: 'cat_drink', icon: '🥤' },
  { id: 'animals', name: 'cat_animals', icon: '🐾' },
  { id: 'cat', name: 'cat_cat', icon: '🐱' },
  { id: 'dog', name: 'cat_dog', icon: '🐶' },
  { id: 'rabbit', name: 'cat_rabbit', icon: '🐰' },
  { id: 'bear', name: 'cat_bear', icon: '🐻' },
  { id: 'bird', name: 'cat_bird', icon: '🐦' },
  { id: 'fish', name: 'cat_fish', icon: '🐟' },
  { id: 'magic', name: 'cat_magic', icon: '✨' },
  { id: 'sparkle', name: 'cat_sparkle', icon: '💫' },
  { id: 'symbols', name: 'cat_symbols', icon: '✦' },
  { id: 'peace', name: 'cat_peace', icon: '✌️' },
  { id: 'cheer', name: 'cat_cheer', icon: '📣' },
  { id: 'dance', name: 'cat_dance', icon: '💃' },
  { id: 'sing', name: 'cat_sing', icon: '🎤' },
  { id: 'work', name: 'cat_work', icon: '💼' },
  { id: 'study', name: 'cat_study', icon: '📚' },
  { id: 'computer', name: 'cat_computer', icon: '💻' },
  { id: 'money', name: 'cat_money', icon: '💰' },
  { id: 'season', name: 'cat_season', icon: '🌸' },
  { id: 'holiday', name: 'cat_holiday', icon: '🎄' },
  { id: 'misc', name: 'cat_misc', icon: '☯' }
]

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
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
    { name: 'description', content: t('meta') }
  ]
})

const state = reactive({
  categoryId: 'happy',
  loading: false,
  kaomojis: [] as string[],
  recentlyCopied: [] as string[],
  copiedChar: null as string | null,
  copyAnnouncement: ''
})

const cachedCategories: Record<string, string[]> = {}

async function loadCategory(id: string) {
  if (cachedCategories[id]) {
    state.kaomojis = cachedCategories[id]
    return
  }
  
  state.loading = true
  try {
    const res = await fetch(`/kaomoji/${id}.json`)
    if (res.ok) {
      const json = await res.json()
      cachedCategories[id] = json
      state.kaomojis = json
    } else {
      state.kaomojis = []
    }
  } catch (e) {
    console.error(e)
    state.kaomojis = []
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('recentKaomojis')
    if (saved) state.recentlyCopied = JSON.parse(saved).slice(0, MAX_RECENT)
  } catch {}

  loadCategory(state.categoryId)
})

watch(() => state.categoryId, (newId) => {
  loadCategory(newId)
})

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

function addToRecent(char: string) {
  const filtered = state.recentlyCopied.filter(c => c !== char)
  state.recentlyCopied = [char, ...filtered].slice(0, MAX_RECENT)
  try {
    localStorage.setItem('recentKaomojis', JSON.stringify(state.recentlyCopied))
  } catch {}
}

defineI18nRoute({
  paths: {
    en: '/kaomoji',
    pt: '/kaomoji',
    es: '/kaomoji',
    fr: '/kaomoji',
    it: '/kaomoji',
    id: '/kaomoji',
    de: '/kaomoji',
    nl: '/kaomoji'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.kaomojis.length > 0"
    :see-also-links="[
      { label: t('see1'), to: 'emoji-picker' },
      { label: t('see2'), to: 'symbol-picker' },
      { label: t('see3'), to: 'fancy-letters' },
      { label: t('see4'), to: 'lenny-face' }
    ]"
  >
    <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Seletor de Categoria (Combobox) -->
      <div class="form-control w-full">
        <label for="category-select" class="label">
          <span class="label-text font-bold text-base-content">{{ t('category_label') }}</span>
          <span v-if="!state.loading" class="label-text-alt text-base-content/70 text-sm">
            {{ state.kaomojis.length }} {{ t('found') }}
          </span>
        </label>
        <select
          id="category-select"
          v-model="state.categoryId"
          class="select select-bordered select-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-lg font-medium"
        >
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ t(cat.name) }}
          </option>
        </select>
      </div>

      <!-- Kaomojis copiados recentemente -->
      <div v-if="state.recentlyCopied.length > 0" class="bg-base-200 rounded-2xl px-4 py-3">
        <p class="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">{{ t('recently_copied') }}</p>
        <div class="flex flex-wrap gap-2.5">
          <button
            v-for="(char, i) in state.recentlyCopied"
            :key="i"
            type="button"
            @click="copy(char)"
            class="relative text-base sm:text-lg md:text-xl px-4 py-2.5 rounded-xl transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-base-100 shadow-sm whitespace-nowrap"
            :class="state.copiedChar === char ? 'bg-success/20 scale-110 ring-2 ring-success' : ''"
          >
            {{ char }}
          </button>
        </div>
      </div>

      <!-- Live Region para Leitores de Tela -->
      <div aria-live="polite" class="sr-only">
        {{ state.copyAnnouncement }}
      </div>

      <!-- Lista Principal de Kaomojis -->
      <div class="bg-base-200 rounded-3xl p-4 sm:p-6 min-h-[400px]">
        <div v-if="state.loading" class="flex justify-center items-center py-20">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        
        <div v-else-if="state.kaomojis.length === 0" class="text-center py-20 text-base-content/60">
          {{ t('no_results') }}
        </div>
        
        <div v-else class="flex flex-wrap justify-center gap-3">
          <button
            v-for="(char, i) in state.kaomojis"
            :key="i"
            type="button"
            @click="copy(char)"
            class="relative group flex items-center justify-center px-5 py-3 md:px-6 md:py-4 bg-base-100 hover:bg-base-300 transition-all duration-200 rounded-2xl shadow-sm hover:shadow-md active:scale-95 min-h-[64px] cursor-pointer"
            :class="state.copiedChar === char ? '!bg-success/20 ring-2 ring-success scale-[1.02]' : ''"
            :aria-label="`${t('copy_aria')} ${char}`"
          >
            <span class="text-base sm:text-lg md:text-xl font-medium tracking-wide whitespace-nowrap text-center">{{ char }}</span>
            
            <div
              class="absolute inset-0 flex items-center justify-center bg-success/90 text-success-content rounded-2xl opacity-0 scale-90 transition-all duration-200"
              :class="state.copiedChar === char ? '!opacity-100 !scale-100 z-10' : ''"
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

<i18n lang="json">
{
  "en": {
    "m_title": "Kaomojis to Copy and Paste - Text Faces Online",
    "title": "Kaomojis to Copy and Paste",
    "meta": "Complete collection of dozens of Kaomojis and Text Faces to copy and paste on WhatsApp, Instagram, TikTok, and Discord.",
    "d1": "Find kaomojis and text faces to copy and paste into messages, bios, comments, nicknames, and posts. Our collection features dozens of curated categories to make your search easier, including emotion expressions (like happy, sad, angry, shy, and love), famous actions (like shrugging, facepalm, and table flipping), as well as cute animal faces (cats, dogs, bears) and special symbols (sparkles, magic, and music). Just click your favorite face to copy and paste it anywhere.",
    "category_label": "Select a Category",
    "found": "kaomojis found",
    "recently_copied": "Recently Copied",
    "no_results": "No kaomojis found in this category.",
    "copy_aria": "Copy kaomoji",
    "copied": "Copied!",
    "copied_announce": "Kaomoji copied to clipboard",
    "cat_smile": "Smiles",
    "cat_happy": "Happy & Smiling",
    "cat_laugh": "Laughing",
    "cat_cute": "Cute",
    "cat_shy": "Shy",
    "cat_wink": "Winking",
    "cat_love": "Love & Romance",
    "cat_sad": "Sad & Crying",
    "cat_cry": "Crying",
    "cat_angry": "Angry & Table Flipping",
    "cat_annoyed": "Annoyed",
    "cat_surprised": "Surprised & Shocked",
    "cat_scared": "Scared",
    "cat_confused": "Confused",
    "cat_thinking": "Thinking",
    "cat_tired": "Tired",
    "cat_sleep": "Sleeping",
    "cat_sorry": "Apologizing",
    "cat_thanks": "Thanks & Gratitude",
    "cat_hello": "Hello",
    "cat_bye": "Goodbye",
    "cat_please": "Please",
    "cat_yes_ok": "Yes & OK",
    "cat_no": "No",
    "cat_shrug": "Shrugging",
    "cat_facepalm": "Facepalm",
    "cat_table_flip": "Table Flipping",
    "cat_celebration": "Celebration",
    "cat_excited": "Excited",
    "cat_applause": "Applause",
    "cat_fight": "Fighting",
    "cat_hug": "Hugs",
    "cat_kiss": "Kisses",
    "cat_drink": "Drinks",
    "cat_animals": "Animals",
    "cat_cat": "Cats",
    "cat_dog": "Dogs",
    "cat_rabbit": "Rabbits",
    "cat_bear": "Bears",
    "cat_bird": "Birds",
    "cat_fish": "Fish",
    "cat_magic": "Magic & Sparkles",
    "cat_sparkle": "Sparkles",
    "cat_symbols": "Symbols",
    "cat_peace": "Peace",
    "cat_cheer": "Cheering",
    "cat_dance": "Dancing",
    "cat_sing": "Singing",
    "cat_work": "Working",
    "cat_study": "Studying",
    "cat_computer": "Computer",
    "cat_money": "Money",
    "cat_season": "Seasons",
    "cat_holiday": "Holidays",
    "cat_misc": "Miscellaneous",

    "use_cases_title": "Where to use kaomojis",
    "uc_1_title": "WhatsApp, Telegram, and Messages",
    "uc_1_desc": "Use text faces to give tone to conversations, respond with humor, or lighten up a message without relying on stickers or images.",
    "uc_2_title": "Instagram, TikTok, and Social Media",
    "uc_2_desc": "Kaomojis work great in bios, captions, and comments because they grab visual attention while keeping the content in a copiable text format.",
    "uc_3_title": "Discord, Forums, and Communities",
    "uc_3_desc": "Personalize replies, usernames, channels, and interactions in online communities with expressions that convey emotion even in pure text environments.",
    "uc_4_title": "Nicknames, Profiles, and Creative Content",
    "uc_4_desc": "Add style to usernames, signatures, notes, descriptions, and decorative text layouts without having to install extra fonts or apps.",

    "how_it_works_title": "How to use",
    "hiw_1_title": "Choose a category",
    "hiw_1_desc": "Open the categories list and select the type of kaomoji you are looking for, such as happy, cute, love, angry, applause, animals, or symbols.",
    "hiw_2_title": "Click to copy",
    "hiw_2_desc": "Click on any kaomoji in the list to automatically copy it to your clipboard. Your recently copied items are saved on the page for quick access.",
    "hiw_3_title": "Paste anywhere",
    "hiw_3_desc": "Once copied, paste it into WhatsApp, Instagram, Discord, TikTok, email, documents, or any other application that accepts text.",

    "faq_title": "Questions & Answers",
    "faq_1_q": "What is a kaomoji?",
    "faq_1_a": "A kaomoji is a face composed of text characters, symbols, and punctuation marks. Unlike emojis, it does not rely on platform-specific graphic designs since it consists of standard copiable text.",
    "faq_2_q": "How to copy and paste kaomojis?",
    "faq_2_a": "Choose a category, click on the desired kaomoji, and it will be copied to your clipboard. Then, paste it into the app, social network, or text field of your choice.",
    "faq_3_q": "Do kaomojis work on WhatsApp and Instagram?",
    "faq_3_a": "Yes. Because kaomojis are text characters, they work in WhatsApp messages, Instagram bios and captions, comments, posts, and any other field that supports text.",
    "faq_4_q": "Can I use kaomojis in game nicknames?",
    "faq_4_a": "It depends on the game. Many support special text characters, but some block symbols due to internal rules or filters. We recommend testing the kaomoji before saving your permanent nickname.",
    "faq_5_q": "Why do some kaomojis look different on certain devices?",
    "faq_5_a": "Most text symbols are cross-platform compatible, but fonts, character spacing, and Unicode support can vary across different mobile devices, browsers, and operating systems.",

    "see1": "Emoji Picker",
    "see2": "Special Symbols",
    "see3": "Fancy Letters",
    "see4": "Lenny Face Generator",
  },
  "pt": {
    "m_title": "Kaomojis para Copiar e Colar - Carinhas de Texto Online",
    "title": "Kaomojis para Copiar e Colar",
    "meta": "Coleção com dezenas de Kaomojis e Carinhas de Texto (Text Faces) para copiar e colar no WhatsApp, Instagram, TikTok e Discord.",
    "d1": "Encontre kaomojis e carinhas de texto para copiar e colar em mensagens, bios, comentários, nicks e posts. Nossa coleção conta com dezenas de categorias organizadas para facilitar sua busca, incluindo expressões de sentimentos como feliz, triste, bravo, tímido e apaixonado, ações famosas como dar de ombros, bater a mão na testa (facepalm) e virar a mesa, além de carinhas de animais como gatos, cachorros e ursos, e símbolos especiais como brilhos, magia e música. Basta clicar na sua carinha favorita para copiar e colar onde quiser.",
    "category_label": "Selecione uma Categoria",
    "found": "kaomojis encontrados",
    "recently_copied": "Copiados Recentemente",
    "no_results": "Nenhum kaomoji encontrado nesta categoria.",
    "copy_aria": "Copiar kaomoji",
    "copied": "Copiado!",
    "copied_announce": "Kaomoji copiado para a área de transferência",
    "cat_smile": "Sorrisos",
    "cat_happy": "Felizes & Sorridentes",
    "cat_laugh": "Risadas",
    "cat_cute": "Fofos",
    "cat_shy": "Tímidos",
    "cat_wink": "Piscando",
    "cat_love": "Amor & Apaixonado",
    "cat_sad": "Tristes & Chorando",
    "cat_cry": "Chorando",
    "cat_angry": "Raiva & Virando a Mesa",
    "cat_annoyed": "Irritados",
    "cat_surprised": "Surpresos & Chocados",
    "cat_scared": "Assustados",
    "cat_confused": "Confusos",
    "cat_thinking": "Pensando",
    "cat_tired": "Cansados",
    "cat_sleep": "Dormindo",
    "cat_sorry": "Desculpas",
    "cat_thanks": "Agradecimento",
    "cat_hello": "Olá",
    "cat_bye": "Tchau",
    "cat_please": "Por Favor",
    "cat_yes_ok": "Sim & OK",
    "cat_no": "Não",
    "cat_shrug": "Dando de Ombros & Confuso",
    "cat_facepalm": "Não Acredito",
    "cat_table_flip": "Virando a Mesa",
    "cat_celebration": "Celebração",
    "cat_excited": "Animados",
    "cat_applause": "Aplausos",
    "cat_fight": "Lutando",
    "cat_hug": "Abraços",
    "cat_kiss": "Beijos",
    "cat_drink": "Bebidas",
    "cat_animals": "Animais",
    "cat_cat": "Gatos",
    "cat_dog": "Cachorros",
    "cat_rabbit": "Coelhos",
    "cat_bear": "Ursos",
    "cat_bird": "Pássaros",
    "cat_fish": "Peixes",
    "cat_magic": "Magia & Brilho",
    "cat_sparkle": "Brilhos",
    "cat_symbols": "Símbolos",
    "cat_peace": "Paz",
    "cat_cheer": "Torcida",
    "cat_dance": "Dança",
    "cat_sing": "Cantando",
    "cat_work": "Trabalho",
    "cat_study": "Estudo",
    "cat_computer": "Computador",
    "cat_money": "Dinheiro",
    "cat_season": "Estações",
    "cat_holiday": "Feriados",
    "cat_misc": "Variados",

    "use_cases_title": "Onde usar kaomojis",
    "uc_1_title": "WhatsApp, Telegram e mensagens",
    "uc_1_desc": "Use carinhas de texto para dar tom às conversas, responder com humor ou deixar uma mensagem mais leve sem depender de figurinhas e imagens.",
    "uc_2_title": "Instagram, TikTok e redes sociais",
    "uc_2_desc": "Kaomojis funcionam bem em bios, legendas e comentários porque chamam atenção visualmente e mantêm o conteúdo em formato de texto copiável.",
    "uc_3_title": "Discord, fóruns e comunidades",
    "uc_3_desc": "Personalize respostas, nomes, tópicos e interações em comunidades online com expressões que passam emoção mesmo em ambientes de texto puro.",
    "uc_4_title": "Nicks, perfis e conteúdos criativos",
    "uc_4_desc": "Adicione estilo a nomes de usuário, assinaturas, notas, descrições e pequenos textos decorativos sem precisar instalar fontes ou aplicativos extras.",

    "how_it_works_title": "Como usar",
    "hiw_1_title": "Escolha uma categoria",
    "hiw_1_desc": "Abra a lista de categorias e selecione o tipo de kaomoji que você procura, como felizes, fofos, amor, raiva, aplausos, animais ou símbolos.",
    "hiw_2_title": "Clique para copiar",
    "hiw_2_desc": "Clique em qualquer kaomoji da lista para copiá-lo automaticamente para a área de transferência. Os itens copiados recentemente ficam salvos na página para acesso rápido.",
    "hiw_3_title": "Cole em qualquer lugar",
    "hiw_3_desc": "Depois de copiar, cole no WhatsApp, Instagram, Discord, TikTok, e-mail, documentos ou qualquer outro aplicativo que aceite texto.",

    "faq_title": "Perguntas e Respostas",
    "faq_1_q": "O que é um kaomoji?",
    "faq_1_a": "Kaomoji é uma carinha formada com caracteres de texto, símbolos e sinais de pontuação. Diferente dos emojis, ele não depende de um desenho específico da plataforma, pois é composto por texto copiável.",
    "faq_2_q": "Como copiar e colar kaomojis?",
    "faq_2_a": "Escolha uma categoria, clique no kaomoji desejado e ele será copiado para a área de transferência. Em seguida, cole no aplicativo, rede social ou campo de texto onde quiser usar.",
    "faq_3_q": "Kaomojis funcionam no WhatsApp e Instagram?",
    "faq_3_a": "Sim. Como kaomojis são caracteres de texto, eles funcionam em mensagens do WhatsApp, bios e legendas do Instagram, comentários, posts e outros campos que aceitam texto.",
    "faq_4_q": "Posso usar kaomojis em nicknames de jogos?",
    "faq_4_a": "Depende do jogo. Muitos aceitam caracteres de texto especiais, mas alguns bloqueiam símbolos por regras internas ou moderação. Teste o kaomoji antes de salvar o nickname definitivo.",
    "faq_5_q": "Por que alguns kaomojis aparecem diferentes em certos aparelhos?",
    "faq_5_a": "A maioria dos símbolos de texto é compatível entre plataformas, mas fontes, largura de caracteres e suporte a Unicode podem variar entre celulares, navegadores e sistemas operacionais.",

    "see1": "Seletor de Emojis",
    "see2": "Símbolos Especiais",
    "see3": "Letras Diferentes",
    "see4": "Gerador de Lenny Face",
  },
  "es": {
    "m_title": "Kaomojis para Copiar y Pegar - Caritas de Texto Online",
    "title": "Kaomojis para Copiar y Pegar",
    "meta": "Colección con decenas de Kaomojis y Caritas de Texto (Text Faces) para copiar y pegar en WhatsApp, Instagram, TikTok y Discord.",
    "d1": "Encuentra kaomojis y caritas de texto para copiar y pegar en mensajes, biografías, comentarios, nicks y publicaciones. Nuestra colección cuenta con decenas de categorías organizadas para facilitar tu búsqueda, incluyendo expresiones de sentimientos como feliz, triste, enojo, tímido y amor, acciones famosas como encogerse de hombros, llevarse la mano a la cara (facepalm) y voltear mesas, además de caritas de animales como gatos, perros y osos, y símbolos especiales como brillos, magia y música. Solo haz clic en tu carita favorita para copiar y pegar.",
    "category_label": "Selecciona una Categoría",
    "found": "kaomojis encontrados",
    "recently_copied": "Copiados Recientemente",
    "no_results": "No se encontraron kaomojis en esta categoría.",
    "copy_aria": "Copiar kaomoji",
    "copied": "¡Copiado!",
    "copied_announce": "Kaomoji copiado al portapapeles",
    "cat_smile": "Sonrisas",
    "cat_happy": "Felices y Sonrientes",
    "cat_laugh": "Risas",
    "cat_cute": "Lindos & Tiernos",
    "cat_shy": "Tímidos",
    "cat_wink": "Guiñando",
    "cat_love": "Amor y Romance",
    "cat_sad": "Tristes y Llorando",
    "cat_cry": "Llorando",
    "cat_angry": "Enojados y Volteando Mesas",
    "cat_annoyed": "Irritados",
    "cat_surprised": "Sorprendidos y Conmocionados",
    "cat_scared": "Asustados",
    "cat_confused": "Confundidos",
    "cat_thinking": "Pensando",
    "cat_tired": "Cansados",
    "cat_sleep": "Durmiendo",
    "cat_sorry": "Disculpándose",
    "cat_thanks": "Agradecimiento",
    "cat_hello": "Hola",
    "cat_bye": "Adiós",
    "cat_please": "Por Favor",
    "cat_yes_ok": "Sí y OK",
    "cat_no": "No",
    "cat_shrug": "Encogiéndose de Hombros",
    "cat_facepalm": "Facepalm",
    "cat_table_flip": "Volteando la Mesa",
    "cat_celebration": "Celebración",
    "cat_excited": "Entusiasmados",
    "cat_applause": "Aplausos",
    "cat_fight": "Peleando",
    "cat_hug": "Abrazos",
    "cat_kiss": "Besos",
    "cat_drink": "Bebidas",
    "cat_animals": "Animales",
    "cat_cat": "Gatos",
    "cat_dog": "Perros",
    "cat_rabbit": "Conejos",
    "cat_bear": "Osos",
    "cat_bird": "Pájaros",
    "cat_fish": "Peces",
    "cat_magic": "Magia y Destellos",
    "cat_sparkle": "Brillos",
    "cat_symbols": "Símbolos",
    "cat_peace": "Paz",
    "cat_cheer": "Apoyo",
    "cat_dance": "Bailando",
    "cat_sing": "Cantando",
    "cat_work": "Trabajo",
    "cat_study": "Estudio",
    "cat_computer": "Computadora",
    "cat_money": "Dinero",
    "cat_season": "Estaciones",
    "cat_holiday": "Días Festivos",
    "cat_misc": "Variados",

    "use_cases_title": "Dónde usar kaomojis",
    "uc_1_title": "WhatsApp, Telegram y mensajes",
    "uc_1_desc": "Usa caritas de texto para dar tono a las conversaciones, responder con humor o hacer que un mensaje sea más ameno sin depender de stickers o imágenes.",
    "uc_2_title": "Instagram, TikTok y redes sociales",
    "uc_2_desc": "Los kaomojis funcionan muy bien en biografías, descripciones y comentarios porque llaman la atención visualmente y mantienen el contenido en un formato de texto copiable.",
    "uc_3_title": "Discord, foros y comunidades",
    "uc_3_desc": "Personaliza respuestas, nombres de usuario, canales e interacciones en comunidades online con expresiones que transmiten emociones incluso en entornos de texto puro.",
    "uc_4_title": "Nicknames, perfiles y contenido creativo",
    "uc_4_desc": "Añade estilo a nombres de usuario, firmas, notas, descripciones y pequeños diseños de texto decorativos sin tener que instalar fuentes o aplicaciones adicionales.",

    "how_it_works_title": "Cómo usar",
    "hiw_1_title": "Elige una categoría",
    "hiw_1_desc": "Abre la lista de categorías y selecciona el tipo de kaomoji que buscas, como felices, tiernos, amor, enojo, aplausos, animales o símbolos.",
    "hiw_2_title": "Haz clic para copiar",
    "hiw_2_desc": "Haz clic en cualquier kaomoji de la lista para copiarlo automáticamente al portapapeles. Los elementos copiados recientemente se guardan en la página para un acceso rápido.",
    "hiw_3_title": "Pega en cualquier lugar",
    "hiw_3_desc": "Después de copiar, pégalo en WhatsApp, Instagram, Discord, TikTok, correo electrónico, documentos o cualquier otra aplicación que acepte texto.",

    "faq_title": "Preguntas y Respuestas",
    "faq_1_q": "¿Qué es un kaomoji?",
    "faq_1_a": "Un kaomoji es una carita compuesta por caracteres de texto, símbolos y signos de puntuación. A diferencia de los emojis, no depende del diseño gráfico específico de una plataforma, ya que se compone de texto estándar copiable.",
    "faq_2_q": "¿Cómo copiar y pegar kaomojis?",
    "faq_2_a": "Elige una categoría, haz clic en el kaomoji deseado y se copiará al portapapeles. Luego, pégalo en la aplicación, red social o campo de texto donde quieras usarlo.",
    "faq_3_q": "¿Los kaomojis funcionan en WhatsApp e Instagram?",
    "faq_3_a": "Sí. Al ser caracteres de texto, funcionan en mensajes de WhatsApp, biografías y descripciones de Instagram, comentarios, publicaciones y cualquier otro campo que acepte texto.",
    "faq_4_q": "¿Puedo usar kaomojis en nicknames de juegos?",
    "faq_4_a": "Depende del juego. Muchos admiten caracteres de texto especiales, mas algunos bloquean símbolos por reglas internas o filtros de moderación. Recomendamos probar el kaomoji antes de guardar el nickname definitivo.",
    "faq_5_q": "¿Por qué algunos kaomojis se ven diferentes en ciertos dispositivos?",
    "faq_5_a": "La mayoría de los símbolos de texto son compatibles entre plataformas, pero las fuentes, el espaciado de caracteres y el soporte de Unicode pueden variar entre celulares, navegadores y sistemas operativos.",

    "see1": "Selector de Emojis",
    "see2": "Símbolos Especiales",
    "see3": "Letras Bonitas",
    "see4": "Generador de Lenny Face",
  },
  "fr": {
    "m_title": "Kaomojis à Copier et Coller - Émoticônes de Texte en Ligne",
    "title": "Kaomojis à Copier et Coller",
    "meta": "Collection de dizaines de Kaomojis et d'émoticônes de texte (Text Faces) à copier et coller sur WhatsApp, Instagram, TikTok et Discord.",
    "d1": "Trouvez des kaomojis et des émoticônes de texte à copier et coller dans vos messages, bios, commentaires, pseudos et publications. Notre collection comprend des dizaines de catégories organisées pour faciliter vos recherches, notamment des expressions d'émotions (comme joyeux, triste, en colère, timide et amoureux), des actions célèbres (comme le haussement d'épaules, le facepalm et le renversement de table), ainsi que d'adorables visages d'animaux (chats, chiens, ours) et des symboles spéciaux (étincelles, magie et musique). Cliquez simplement sur votre frimousse préférée pour la copier et la coller.",
    "category_label": "Sélectionner une Catégorie",
    "found": "kaomojis trouvés",
    "recently_copied": "Récemment Copiés",
    "no_results": "Aucun kaomoji trouvé dans cette catégorie.",
    "copy_aria": "Copier le kaomoji",
    "copied": "Copié !",
    "copied_announce": "Kaomoji copié dans le presse-papiers",
    "cat_smile": "Sourires",
    "cat_happy": "Heureux & Souriants",
    "cat_laugh": "Rires",
    "cat_cute": "Mignons",
    "cat_shy": "Timides",
    "cat_wink": "Clins d'œil",
    "cat_love": "Amour & Romance",
    "cat_sad": "Tristes & En pleurs",
    "cat_cry": "Pleurs",
    "cat_angry": "Colère & Renversement de Table",
    "cat_annoyed": "Agacés",
    "cat_surprised": "Surpris & Choqués",
    "cat_scared": "Effrayés",
    "cat_confused": "Confus",
    "cat_thinking": "Pensifs",
    "cat_tired": "Fatigués",
    "cat_sleep": "Endormis",
    "cat_sorry": "Excuse",
    "cat_thanks": "Remerciements",
    "cat_hello": "Bonjour",
    "cat_bye": "Au revoir",
    "cat_please": "S'il vous plaît",
    "cat_yes_ok": "Oui & OK",
    "cat_no": "Non",
    "cat_shrug": "Haussement d'épaules",
    "cat_facepalm": "Facepalm",
    "cat_table_flip": "Renversement de Table",
    "cat_celebration": "Célébration",
    "cat_excited": "Excités",
    "cat_applause": "Applaudissements",
    "cat_fight": "Combat",
    "cat_hug": "Câlins",
    "cat_kiss": "Bisous",
    "cat_drink": "Boissons",
    "cat_animals": "Animaux",
    "cat_cat": "Chats",
    "cat_dog": "Chiens",
    "cat_rabbit": "Lapins",
    "cat_bear": "Ours",
    "cat_bird": "Oiseaux",
    "cat_fish": "Poissons",
    "cat_magic": "Magie & Paillettes",
    "cat_sparkle": "Étincelles",
    "cat_symbols": "Symboles",
    "cat_peace": "Paix",
    "cat_cheer": "Encouragement",
    "cat_dance": "Danse",
    "cat_sing": "Chant",
    "cat_work": "Travail",
    "cat_study": "Études",
    "cat_computer": "Ordinateur",
    "cat_money": "Argent",
    "cat_season": "Saisons",
    "cat_holiday": "Vacances",
    "cat_misc": "Divers",

    "use_cases_title": "Où utiliser les kaomojis",
    "uc_1_title": "WhatsApp, Telegram et SMS",
    "uc_1_desc": "Utilisez des émoticônes de texte pour donner le ton à vos conversations, répondre avec humour ou égayer un message sans dépendre d'images ou de stickers.",
    "uc_2_title": "Instagram, TikTok et réseaux sociaux",
    "uc_2_desc": "Les kaomojis fonctionnent très bien dans les bios, les légendes et les commentaires car ils attirent l'attention tout en restant des textes copiables.",
    "uc_3_title": "Discord, forums et communautés",
    "uc_3_desc": "Personnalisez vos réponses, pseudos, canaux et interactions dans les communautés en ligne avec des expressions qui transmettent des émotions même en texte brut.",
    "uc_4_title": "Nicknames, profils et contenus créatifs",
    "uc_4_desc": "Ajoutez du style à vos pseudos, signatures, notes, descriptions et petits arrangements de texte décoratifs sans avoir à installer de polices ou d'applications.",

    "how_it_works_title": "Comment utiliser",
    "hiw_1_title": "Choisissez une catégorie",
    "hiw_1_desc": "Ouvrez la liste des catégories et sélectionnez le type de kaomoji que vous recherchez, tel que joyeux, mignon, amoureux, en colère, applaudissements, animaux ou symboles.",
    "hiw_2_title": "Cliquez pour copier",
    "hiw_2_desc": "Cliquez sur n'importe quel kaomoji de la liste pour le copier automatiquement dans le presse-papiers. Les éléments récemment copiés sont sauvegardés pour un accès rapide.",
    "hiw_3_title": "Collez n'importe où",
    "hiw_3_desc": "Une fois copié, collez-le sur WhatsApp, Instagram, Discord, TikTok, par e-mail, dans des documents ou toute autre application acceptant du texte.",

    "faq_title": "Questions & Réponses",
    "faq_1_q": "Qu'est-ce qu'un kaomoji ?",
    "faq_1_a": "Un kaomoji est un visage composé de caractères de texte, de symboles et de signes de ponctuation. Contrairement aux emojis, il ne dépend pas d'un graphisme propre à chaque plateforme, puisqu'il est constitué de texte standard copiable.",
    "faq_2_q": "Comment copier et coller des kaomojis ?",
    "faq_2_a": "Choisissez une catégorie, cliquez sur le kaomoji souhaité et il sera copié dans votre presse-papiers. Collez-le ensuite dans l'application, le réseau social ou le champ de texte de votre choix.",
    "faq_3_q": "Les kaomojis fonctionnent-ils sur WhatsApp et Instagram ?",
    "faq_3_a": "Oui. Comme les kaomojis sont des caractères de texte, ils fonctionnent dans les messages WhatsApp, les bios et légendes Instagram, les commentaires, les publications et tout autre champ acceptant du texte.",
    "faq_4_q": "Puis-je utiliser des kaomojis dans des pseudos de jeux ?",
    "faq_4_a": "Cela dépend du jeu. Beaucoup acceptent les caractères spéciaux, mais certains bloquent les symboles en raison de filtres ou de règles internes. Nous vous conseillons de tester le kaomoji avant d'enregistrer définitivement votre pseudo.",
    "faq_5_q": "Pourquoi certains kaomojis apparaissent-ils différemment selon les appareils ?",
    "faq_5_a": "La plupart des symboles textuels sont compatibles entre les plateformes, mais les polices, l'espacement des caractères et la prise en charge d'Unicode peuvent varier selon les téléphones, navigateurs et systèmes d'exploitation.",

    "see1": "Sélecteur d'Emojis",
    "see2": "Symboles Spéciaux",
    "see3": "Lettres Stylées",
    "see4": "Générateur de Lenny Face",
  },
  "it": {
    "m_title": "Kaomoji da Copiare e Incollare - Faccine di Testo Online",
    "title": "Kaomoji da Copiare e Incollare",
    "meta": "Raccolta con decine di Kaomoji e Faccine di Testo (Text Faces) da copiare e incollare su WhatsApp, Instagram, TikTok e Discord.",
    "d1": "Trova kaomoji e faccine di testo da copiare e incollare in messaggi, biografie, commenti, nick e post. La nostra collezione comprende decine di categorie organizzate per facilitare la tua ricerca, tra cui espressioni di emozioni (come felice, triste, arrabbiato, timido e innamorato), azioni famose (come l'alzata di spalle, il facepalm e il ribaltamento del tavolo), oltre a simpatiche faccine di animali (gatti, cani, orsi) e simboli speciali (scintille, magia e musica). Clicca sulla tua faccina preferita per copiarla e incollarla.",
    "category_label": "Seleziona una Categoria",
    "found": "kaomoji trovati",
    "recently_copied": "Copiati di Recente",
    "no_results": "Nessun kaomoji trovato in questa categoria.",
    "copy_aria": "Copia kaomoji",
    "copied": "Copiato!",
    "copied_announce": "Kaomoji copiato negli appunti",
    "cat_smile": "Sorrisi",
    "cat_happy": "Felici & Sorridenti",
    "cat_laugh": "Risate",
    "cat_cute": "Carini",
    "cat_shy": "Timidi",
    "cat_wink": "Occhiolino",
    "cat_love": "Amore & Romantici",
    "cat_sad": "Tristi & In Lacrime",
    "cat_cry": "Piangenti",
    "cat_angry": "Arrabbiati & Tavoli Ribaltati",
    "cat_annoyed": "Infastiditi",
    "cat_surprised": "Sorpresi & Scioccati",
    "cat_scared": "Spaventati",
    "cat_confused": "Confusi",
    "cat_thinking": "Pensierosi",
    "cat_tired": "Stanchi",
    "cat_sleep": "Addormentati",
    "cat_sorry": "Scuse",
    "cat_thanks": "Ringraziamenti",
    "cat_hello": "Ciao",
    "cat_bye": "Saluti",
    "cat_please": "Per Favore",
    "cat_yes_ok": "Sì & OK",
    "cat_no": "No",
    "cat_shrug": "Alzando le Spalle",
    "cat_facepalm": "Facepalm",
    "cat_table_flip": "Tavolo Ribaltato",
    "cat_celebration": "Celebrazione",
    "cat_excited": "Entusiasti",
    "cat_applause": "Applausi",
    "cat_fight": "Combattimento",
    "cat_hug": "Abbracci",
    "cat_kiss": "Baci",
    "cat_drink": "Bevande",
    "cat_animals": "Animali",
    "cat_cat": "Gatti",
    "cat_dog": "Cani",
    "cat_rabbit": "Conigli",
    "cat_bear": "Orsi",
    "cat_bird": "Uccelli",
    "cat_fish": "Pesci",
    "cat_magic": "Magia & Scintille",
    "cat_sparkle": "Scintille",
    "cat_symbols": "Simboli",
    "cat_peace": "Pace",
    "cat_cheer": "Tifo",
    "cat_dance": "Ballo",
    "cat_sing": "Canto",
    "cat_work": "Lavoro",
    "cat_study": "Studio",
    "cat_computer": "Computer",
    "cat_money": "Soldi",
    "cat_season": "Stagioni",
    "cat_holiday": "Festività",
    "cat_misc": "Vari",

    "use_cases_title": "Dove usare i kaomoji",
    "uc_1_title": "WhatsApp, Telegram e messaggi",
    "uc_1_desc": "Usa le faccine di testo per dare tono alle conversazioni, rispondere con umorismo o rendere un messaggio più leggero senza dipendere da adesivi e immagini.",
    "uc_2_title": "Instagram, TikTok e social media",
    "uc_2_desc": "I kaomoji funzionano benissimo nelle bio, nelle didascalie e nei commenti perché catturano l'attenzione visivamente e mantengono il contenuto in un formato di testo copiabile.",
    "uc_3_title": "Discord, forum e community",
    "uc_3_desc": "Personalizza risposte, nomi utente, canali e interazioni nelle community online con espressioni che trasmettono emozioni anche in ambienti di testo puro.",
    "uc_4_title": "Nicknames, profili e contenuti creativi",
    "uc_4_desc": "Aggiungi stile a nomi utente, firme, note, descrizioni e piccoli layout di testo decorativi senza dover installare font o applicazioni aggiuntive.",

    "how_it_works_title": "Come usare",
    "hiw_1_title": "Scegli una categoria",
    "hiw_1_desc": "Apri l'elenco delle categorie e seleziona il tipo di kaomoji che cerchi, come felici, carini, amore, rabbia, applausi, animali o simboli.",
    "hiw_2_title": "Clicca per copiare",
    "hiw_2_desc": "Clicca su qualsiasi kaomoji nell'elenco per copiarlo automaticamente negli appunti. Gli elementi copiati di recente vengono salvati sulla pagina per un accesso rapido.",
    "hiw_3_title": "Incolla ovunque",
    "hiw_3_desc": "Una volta copiato, incollalo su WhatsApp, Instagram, Discord, TikTok, e-mail, documenti o qualsiasi altra applicazione che accetta testo.",

    "faq_title": "Domande & Risposte",
    "faq_1_q": "Cos'è un kaomoji?",
    "faq_1_a": "Un kaomoji è una faccina composta da caratteri di testo, simboli e segni di punteggiatura. A differenza degli emoji, non dipende dal design grafico specifico di una piattaforma, poiché è composto da testo standard copiabile.",
    "faq_2_q": "Come copiare e incollare i kaomoji?",
    "faq_2_a": "Scegli una categoria, fai clic sul kaomoji desiderato e verrà copiato negli appunti. Successivamente, incollalo nell'applicazione, social network o campo di testo in cui desideri utilizzarlo.",
    "faq_3_q": "I kaomoji funzionano su WhatsApp e Instagram?",
    "faq_3_a": "Sì. Poiché i kaomoji sono caratteri di testo, funzionano nei messaggi di WhatsApp, nelle biografie e didascalie di Instagram, nei commenti, nei post e in qualsiasi altro campo che accetta testo.",
    "faq_4_q": "Posso usare i kaomoji nei nickname dei giochi?",
    "faq_4_a": "Dipende dal gioco. Molti supportano caratteri speciali di testo, ma alcuni bloccano i simboli a causa di filtri o regole interne. Si consiglia di testare il kaomoji prima di salvare definitivamente il nickname.",
    "faq_5_q": "Perché alcuni kaomoji appaiono diversi su determinati dispositivi?",
    "faq_5_a": "La maggior parte dei simboli di testo è compatibile tra le piattaforme, ma i font, la larghezza dei caratteri e il supporto Unicode possono variare a seconda del telefono, del browser e del sistema operativo.",

    "see1": "Selettore di Emoji",
    "see2": "Simboli Speciali",
    "see3": "Lettere Particolari",
    "see4": "Generatore di Lenny Face",
  },
  "id": {
    "m_title": "Kaomoji untuk Salin dan Tempel - Wajah Teks Online",
    "title": "Kaomoji untuk Salin dan Tempel",
    "meta": "Koleksi puluhan Kaomoji dan Wajah Teks (Text Faces) untuk disalin dan ditempel di WhatsApp, Instagram, TikTok, dan Discord.",
    "d1": "Temukan kaomoji dan wajah teks untuk disalin dan ditempel ke dalam pesan, bio, komentar, nama panggilan (nick), dan postingan. Koleksi kami memiliki puluhan kategori terorganisir untuk memudahkan pencarian Anda, termasuk ekspresi emosi (seperti bahagia, sedih, marah, malu, dan cinta), aksi terkenal (seperti mengangkat bahu, tepuk jidat/facepalm, dan membalikkan meja), serta wajah hewan lucu (kucing, anjing, beruang) dan simbol khusus (kilauan, sihir, dan musik). Cukup klik wajah favorit Anda untuk menyalin dan menempelkannya.",
    "category_label": "Pilih Kategori",
    "found": "kaomoji ditemukan",
    "recently_copied": "Baru Saja Disalin",
    "no_results": "Tidak ada kaomoji yang ditemukan dalam kategori ini.",
    "copy_aria": "Salin kaomoji",
    "copied": "Tersalin!",
    "copied_announce": "Kaomoji berhasil disalin ke papan klip",
    "cat_smile": "Senyum",
    "cat_happy": "Bahagia & Tersenyum",
    "cat_laugh": "Tertawa",
    "cat_cute": "Lucu & Imut",
    "cat_shy": "Malu",
    "cat_wink": "Berkedip",
    "cat_love": "Cinta & Kasih Sayang",
    "cat_sad": "Sedih & Menangis",
    "cat_cry": "Menangis",
    "cat_angry": "Marah & Membalikkan Meja",
    "cat_annoyed": "Kesal",
    "cat_surprised": "Terkejut & Kaget",
    "cat_scared": "Takut",
    "cat_confused": "Bingung",
    "cat_thinking": "Berpikir",
    "cat_tired": "Lelah",
    "cat_sleep": "Tidur",
    "cat_sorry": "Meminta Maaf",
    "cat_thanks": "Terima Kasih",
    "cat_hello": "Halo",
    "cat_bye": "Selamat Tinggal",
    "cat_please": "Mohon & Tolong",
    "cat_yes_ok": "Ya & OK",
    "cat_no": "Tidak",
    "cat_shrug": "Mengangkat Bahu",
    "cat_facepalm": "Tepuk Jidat",
    "cat_table_flip": "Membalikkan Meja",
    "cat_celebration": "Perayaan",
    "cat_excited": "Gembira",
    "cat_applause": "Tepuk Tangan",
    "cat_fight": "Bertarung",
    "cat_hug": "Pelukan",
    "cat_kiss": "Ciuman",
    "cat_drink": "Minuman",
    "cat_animals": "Hewan",
    "cat_cat": "Kucing",
    "cat_dog": "Anjing",
    "cat_rabbit": "Kelinci",
    "cat_bear": "Beruang",
    "cat_bird": "Burung",
    "cat_fish": "Ikan",
    "cat_magic": "Sihir & Kilauan",
    "cat_sparkle": "Kilauan",
    "cat_symbols": "Simbol",
    "cat_peace": "Damai",
    "cat_cheer": "Sorakan",
    "cat_dance": "Menari",
    "cat_sing": "Bernyanyi",
    "cat_work": "Bekerja",
    "cat_study": "Belajar",
    "cat_computer": "Komputer",
    "cat_money": "Uang",
    "cat_season": "Musim",
    "cat_holiday": "Hari Libur",
    "cat_misc": "Lain-lain",

    "use_cases_title": "Tempat Menggunakan Kaomoji",
    "uc_1_title": "WhatsApp, Telegram, dan Pesan",
    "uc_1_desc": "Gunakan wajah teks untuk memberi nada pada percakapan, merespons dengan humor, atau menceriakan pesan tanpa harus bergantung pada stiker atau gambar.",
    "uc_2_title": "Instagram, TikTok, dan Media Sosial",
    "uc_2_desc": "Kaomoji sangat cocok untuk bio, caption, dan komentar karena menarik perhatian secara visual sekaligus menjaga konten tetap dalam format teks yang dapat disalin.",
    "uc_3_title": "Discord, Forum, dan Komunitas",
    "uc_3_desc": "Personalisasikan balasan, nama pengguna, saluran, dan interaksi di komunitas online dengan ekspresi yang menyampaikan emosi bahkan dalam lingkungan teks biasa.",
    "uc_4_title": "Nama Panggilan (Nick), Profil, dan Konten Kreatif",
    "uc_4_desc": "Tambahkan gaya pada nama pengguna, tanda tangan, catatan, deskripsi, dan tata letak teks dekoratif kecil tanpa harus menginstal font atau aplikasi tambahan.",

    "how_it_works_title": "Cara menggunakan",
    "hiw_1_title": "Pilih kategori",
    "hiw_1_desc": "Buka daftar kategori dan pilih jenis kaomoji yang Anda cari, seperti bahagia, imut, cinta, marah, tepuk tangan, hewan, atau simbol.",
    "hiw_2_title": "Klik untuk menyalin",
    "hiw_2_desc": "Klik kaomoji apa saja dalam daftar untuk menyalinnya secara otomatis ke papan klip Anda. Item yang baru saja disalin akan disimpan di halaman untuk akses cepat.",
    "hiw_3_title": "Tempel di mana saja",
    "hiw_3_desc": "Setelah disalin, tempelkan ke WhatsApp, Instagram, Discord, TikTok, email, dokumen, atau aplikasi lain apa pun yang menerima teks.",

    "faq_title": "Pertanyaan & Jawaban",
    "faq_1_q": "Apa itu kaomoji?",
    "faq_1_a": "Kaomoji adalah wajah yang terdiri dari karakter teks, simbol, dan tanda baca. Berbeda dengan emoji, kaomoji tidak bergantung pada desain grafis khusus platform tertentu karena terdiri dari teks standar yang dapat disalin.",
    "faq_2_q": "Bagaimana cara menyalin dan menempel kaomoji?",
    "faq_2_a": "Pilih kategori, klik kaomoji yang diinginkan, dan kaomoji tersebut akan disalin ke papan klip Anda. Kemudian, tempelkan ke aplikasi, media sosial, atau kolom teks pilihan Anda.",
    "faq_3_q": "Apakah kaomoji berfungsi di WhatsApp dan Instagram?",
    "faq_3_a": "Ya. Karena kaomoji adalah karakter teks, mereka berfungsi di pesan WhatsApp, bio dan caption Instagram, komentar, postingan, dan kolom lainnya yang menerima teks.",
    "faq_4_q": "Apakah saya bisa menggunakan kaomoji untuk nama panggilan (nickname) game?",
    "faq_4_a": "Tergantung pada game tersebut. Banyak game yang mendukung karakter teks khusus, tetapi beberapa memblokir simbol karena aturan internal atau filter moderasi. Kami menyarankan untuk menguji kaomoji terlebih dahulu sebelum menyimpan nickname permanen Anda.",
    "faq_5_q": "Mengapa beberapa kaomoji terlihat berbeda di perangkat tertentu?",
    "faq_5_a": "Sebagian besar simbol teks kompatibel lintas platform, tetapi font, lebar karakter, dan dukungan Unicode dapat bervariasi di berbagai ponsel, browser, dan sistem operasi.",

    "see1": "Pemilih Emoji",
    "see2": "Simbol Khusus",
    "see3": "Huruf Estetik",
    "see4": "Pembuat Lenny Face",
  },
  "de": {
    "m_title": "Kaomojis zum Kopieren und Einfügen - Text-Smileys Online",
    "title": "Kaomojis zum Kopieren und Einfügen",
    "meta": "Sammlung mit Dutzenden von Kaomojis und Text-Smileys (Text Faces) zum Kopieren und Einfügen auf WhatsApp, Instagram, TikTok und Discord.",
    "d1": "Finde Kaomojis und Text-Smileys zum Kopieren und Einfügen in Nachrichten, Bios, Kommentaren, Nicks und Beiträgen. Unsere Sammlung bietet Dutzende sortierter Kategorien, um dir die Suche zu erleichtern, darunter Gefühlsausdrücke (wie glücklich, traurig, wütend, schüchtern und verliebt), bekannte Aktionen (wie Achselzucken, Facepalm und Tisch umwerfen) sowie niedliche Tiergesichter (Katzen, Hunde, Bären) und Sonderzeichen (Funkeln, Magie und Musik). Klicke einfach auf dein Lieblings-Kaomoji, um es zu kopieren und überall einzufügen.",
    "category_label": "Kategorie Auswählen",
    "found": "Kaomojis gefunden",
    "recently_copied": "Zuletzt Kopiert",
    "no_results": "Keine Kaomojis in dieser Kategorie gefunden.",
    "copy_aria": "Kaomoji kopieren",
    "copied": "Kopiert!",
    "copied_announce": "Kaomoji in die Zwischenablage kopiert",
    "cat_smile": "Lächeln",
    "cat_happy": "Glücklich & Lächelnd",
    "cat_laugh": "Lachen",
    "cat_cute": "Süß & Niedlich",
    "cat_shy": "Schüchtern",
    "cat_wink": "Zwinkern",
    "cat_love": "Liebe & Romantik",
    "cat_sad": "Traurig & Weinend",
    "cat_cry": "Weinend",
    "cat_angry": "Wütend & Tisch Umwerfen",
    "cat_annoyed": "Genervt",
    "cat_surprised": "Überrascht & Schockiert",
    "cat_scared": "Ängstlich",
    "cat_confused": "Verwirrt",
    "cat_thinking": "Nachdenklich",
    "cat_tired": "Müde",
    "cat_sleep": "Schlafend",
    "cat_sorry": "Entschuldigung",
    "cat_thanks": "Danke",
    "cat_hello": "Hallo",
    "cat_bye": "Tschüss",
    "cat_please": "Bitte",
    "cat_yes_ok": "Ja & OK",
    "cat_no": "Nein",
    "cat_shrug": "Achselzucken",
    "cat_facepalm": "Facepalm",
    "cat_table_flip": "Tisch Umwerfen",
    "cat_celebration": "Feier",
    "cat_excited": "Aufgeregt",
    "cat_applause": "Applaus",
    "cat_fight": "Kampf",
    "cat_hug": "Umarmung",
    "cat_kiss": "Kuss",
    "cat_drink": "Getränke",
    "cat_animals": "Tiere",
    "cat_cat": "Katzen",
    "cat_dog": "Hunde",
    "cat_rabbit": "Hasen",
    "cat_bear": "Bären",
    "cat_bird": "Vögel",
    "cat_fish": "Fische",
    "cat_magic": "Magie & Funkeln",
    "cat_sparkle": "Funkeln",
    "cat_symbols": "Symbole",
    "cat_peace": "Frieden",
    "cat_cheer": "Anfeuern",
    "cat_dance": "Tanzen",
    "cat_sing": "Singen",
    "cat_work": "Arbeit",
    "cat_study": "Lernen",
    "cat_computer": "Computer",
    "cat_money": "Geld",
    "cat_season": "Jahreszeiten",
    "cat_holiday": "Feiertage",
    "cat_misc": "Sonstiges",

    "use_cases_title": "Wo man Kaomojis verwendet",
    "uc_1_title": "WhatsApp, Telegram und Nachrichten",
    "uc_1_desc": "Verwende Text-Smileys, um deinen Chats Ausdruck zu verleihen, humorvoll zu antworten oder Nachrichten aufzulockern, ganz ohne auf Sticker oder Bilder angewiesen zu sein.",
    "uc_2_title": "Instagram, TikTok und Social Media",
    "uc_2_desc": "Kaomojis eignen sich hervorragend für Bios, Bildunterschriften und Kommentare, da sie visuell auffallen und der Inhalt als kopierbarer Text erhalten bleibt.",
    "uc_3_title": "Discord, Foren und Communities",
    "uc_3_desc": "Personalisiere deine Antworten, Benutzernamen, Kanäle und Interaktionen in Online-Communities mit Ausdrücken, die auch in reinen Textumgebungen Emotionen vermitteln.",
    "uc_4_title": "Nicknames, Profile und kreative Inhalte",
    "uc_4_desc": "Verleihe Benutzernamen, Signaturen, Notizen, Beschreibungen und kleinen dekorativen Texten Stil, ohne zusätzliche Schriftarten oder Apps installieren zu müssen.",

    "how_it_works_title": "So funktioniert es",
    "hiw_1_title": "Wähle eine Kategorie",
    "hiw_1_desc": "Öffne die Kategorieliste und wähle die Art von Kaomoji, nach der du suchst, z. B. glücklich, süß, verliebt, wütend, Applaus, Tiere oder Symbole.",
    "hiw_2_title": "Zum Kopieren anklicken",
    "hiw_2_desc": "Klicke auf ein beliebiges Kaomoji in der Liste, um es automatisch in deine Zwischenablage zu kopieren. Zuletzt kopierte Elemente werden für den schnellen Zugriff auf der Seite gespeichert.",
    "hiw_3_title": "Überall einfügen",
    "hiw_3_desc": "Nach dem Kopieren fügst du es einfach in WhatsApp, Instagram, Discord, TikTok, E-Mails, Dokumente oder jede andere App ein, die Text unterstützt.",

    "faq_title": "Fragen & Antworten",
    "faq_1_q": "Was ist ein Kaomoji?",
    "faq_1_a": "Ein Kaomoji ist ein Smiley, das aus Textzeichen, Symbolen und Satzzeichen besteht. Im Gegensatz zu Emojis hängt es nicht von einem plattformspezifischen Design ab, da es aus rein kopierbarem Standardtext besteht.",
    "faq_2_q": "Wie kopiere und füge ich Kaomojis ein?",
    "faq_2_a": "Wähle eine Kategorie, klicke auf das gewünschte Kaomoji und es wird in deine Zwischenablage kopiert. Füge es dann in die App, das soziale Netzwerk oder das Textfeld deiner Wahl ein.",
    "faq_3_q": "Funktionieren Kaomojis auf WhatsApp und Instagram?",
    "faq_3_a": "Ja. Da Kaomojis reine Textzeichen sind, funktionieren sie in WhatsApp-Nachrichten, Instagram-Bios und -Bildunterschriften, Kommentaren, Beiträgen und jedem anderen Textfeld.",
    "faq_4_q": "Kann ich Kaomojis in Nicknames von Spielen verwenden?",
    "faq_4_a": "Das hängt vom Spiel ab. Viele unterstützen spezielle Textzeichen, aber einige blockieren Symbole aufgrund interner Filter oder Regeln. Wir empfehlen, das Kaomoji zu testen, bevor du den Nickname endgültig speicherst.",
    "faq_5_q": "Warum sehen manche Kaomojis auf verschiedenen Geräten anders aus?",
    "faq_5_a": "Die meisten Textsymbole sind plattformübergreifend kompatibel, aber Schriftarten, Zeichenbreiten und die Unicode-Unterstützung können je nach Smartphone, Browser und Betriebssystem variieren.",

    "see1": "Emoji-Auswahl",
    "see2": "Sonderzeichen",
    "see3": "Schöne Schriftarten",
    "see4": "Lenny Face Generator",
  },
  "nl": {
    "m_title": "Kaomojis Kopiëren en Plakken - Online Tekst-Smileys",
    "title": "Kaomojis Kopiëren en Plakken",
    "meta": "Verzameling met tientallen Kaomojis en Tekst-Smileys (Text Faces) om te kopiëren en te plakken op WhatsApp, Instagram, TikTok en Discord.",
    "d1": "Vind kaomojis en tekst-smileys om te kopiëren en te plakken in berichten, bio's, reacties, nicks en posts. Onze collectie bevat tientallen georganiseerde categorieën om je zoekopdracht te vergemakkelijken, waaronder gevoelsuitdrukkingen (zoals blij, verdrietig, boos, verlegen en verliefd), bekende acties (zoals schouderophalen, facepalm en tafel omdraaien), evenals schattige dierengezichtjes (katten, honden, beren) en speciale symbolen (glinstering, magie en muziek). Klik gewoon op je favoriete gezichtje om het te kopiëren en te plakken.",
    "category_label": "Selecteer een Categorie",
    "found": "kaomojis gevonden",
    "recently_copied": "Onlangs Gekopieerd",
    "no_results": "Geen kaomojis gevonden in deze categorie.",
    "copy_aria": "Kaomoji kopiëren",
    "copied": "Gekopieerd!",
    "copied_announce": "Kaomoji gekopieerd naar klembord",
    "cat_smile": "Glimlach",
    "cat_happy": "Blij & Glimlachend",
    "cat_laugh": "Lachen",
    "cat_cute": "Schattig & Lief",
    "cat_shy": "Verlegen",
    "cat_wink": "Knipogen",
    "cat_love": "Liefde & Verliefd",
    "cat_sad": "Verdrietig & Huilend",
    "cat_cry": "Huilend",
    "cat_angry": "Boos & Tafel Omdraaien",
    "cat_annoyed": "Geïrriteerd",
    "cat_surprised": "Verrast & Geschokt",
    "cat_scared": "Bang",
    "cat_confused": "Verward",
    "cat_thinking": "Nadenkend",
    "cat_tired": "Moe",
    "cat_sleep": "Slapend",
    "cat_sorry": "Excuses",
    "cat_thanks": "Bedankt",
    "cat_hello": "Hallo",
    "cat_bye": "Doei",
    "cat_please": "Alstublieft",
    "cat_yes_ok": "Ja & OK",
    "cat_no": "Nee",
    "cat_shrug": "Schouderophalen",
    "cat_facepalm": "Facepalm",
    "cat_table_flip": "Tafel Omdraaien",
    "cat_celebration": "Feest",
    "cat_excited": "Enthousiast",
    "cat_applause": "Applaus",
    "cat_fight": "Vechten",
    "cat_hug": "Knuffel",
    "cat_kiss": "Kus",
    "cat_drink": "Drankjes",
    "cat_animals": "Dieren",
    "cat_cat": "Katten",
    "cat_dog": "Honden",
    "cat_rabbit": "Konijnen",
    "cat_bear": "Beren",
    "cat_bird": "Vogels",
    "cat_fish": "Vissen",
    "cat_magic": "Magie & Glinstering",
    "cat_sparkle": "Glinstering",
    "cat_symbols": "Symbolen",
    "cat_peace": "Vrede",
    "cat_cheer": "Aanmoediging",
    "cat_dance": "Dansen",
    "cat_sing": "Zingen",
    "cat_work": "Werk",
    "cat_study": "Studie",
    "cat_computer": "Computer",
    "cat_money": "Geld",
    "cat_season": "Seizoenen",
    "cat_holiday": "Feestdagen",
    "cat_misc": "Diversen",

    "use_cases_title": "Waar kaomojis te gebruiken",
    "uc_1_title": "WhatsApp, Telegram en chatberichten",
    "uc_1_desc": "Gebruik tekst-smileys om de toon in je gesprekken te zetten, met humor te antwoorden of berichten op te fleuren, zonder dat je afhankelijk bent van stickers of afbeeldingen.",
    "uc_2_title": "Instagram, TikTok en sociale media",
    "uc_2_desc": "Kaomojis zijn ideaal voor bio's, bijschriften en reacties omdat ze visueel de aandacht trekken en de inhoud als kopieerbare tekst behouden.",
    "uc_3_title": "Discord, forums en communities",
    "uc_3_desc": "Personaliseer je antwoorden, gebruikersnamen, kanalen en interacties in online communities met uitdrukkingen die emoties overbrengen, zelfs in platte tekstomgevingen.",
    "uc_4_title": "Nicknames, profielen en creatieve inhoud",
    "uc_4_desc": "Voeg stijl toe aan gebruikersnamen, handtekeningen, notities, beschrijvingen en kleine decoratieve teksten zonder dat je extra lettertypen of apps hoeft te installeren.",

    "how_it_works_title": "Hoe te gebruiken",
    "hiw_1_title": "Kies een categorie",
    "hiw_1_desc": "Open de categorielijst en selecteer het type kaomoji dat je zoekt, zoals blij, schattig, liefde, boos, applaus, dieren of symbolen.",
    "hiw_2_title": "Klik om te kopiëren",
    "hiw_2_desc": "Klik op een kaomoji in de lijst om deze automatisch naar je klembord te kopiëren. Onlangs gekopieerde items worden opgeslagen op de pagina voor snelle toegang.",
    "hiw_3_title": "Plak overal",
    "hiw_3_desc": "Na het kopiëren plak je het gewoon in WhatsApp, Instagram, Discord, TikTok, e-mail, documenten of een andere app die tekst ondersteunt.",

    "faq_title": "Veelgestelde Vragen & Antwoorden",
    "faq_1_q": "Wat is een kaomoji?",
    "faq_1_a": "Een kaomoji is een smiley gemaakt van teksttekens, symbolen en leestekens. In tegenstelling tot emojis is een kaomoji niet afhankelijk van een specifiek platformontwerp, omdat deze bestaat uit kopieerbare standaardtekst.",
    "faq_2_q": "Hoe kun je kaomojis kopiëren en plakken?",
    "faq_2_a": "Kies een categorie, klik op de gewenste kaomoji en deze wordt naar je klembord gekopieerd. Plak hem vervolgens in de app, het sociale netwerk of het tekstveld van je keuze.",
    "faq_3_q": "Werken kaomojis op WhatsApp en Instagram?",
    "faq_3_a": "Ja. Omdat kaomojis teksttekens zijn, werken ze in WhatsApp-berichten, Instagram-bio's en -bijschriften, reacties, berichten en elk ander tekstveld.",
    "faq_4_q": "Kan ik kaomojis gebruiken in nicknames voor games?",
    "faq_4_a": "Dit hangt af van het spel. Vele ondersteunen speciale teksttekens, maar sommige blokkeren symbolen vanwege interne filters of regels. We raden aan om de kaomoji te testen voordat je je definitieve nickname opslaat.",
    "faq_5_q": "Waarom zien sommige kaomojis er op bepaalde apparaten anders uit?",
    "faq_5_a": "De meeste tekstsymbolen zijn platformoverschrijdend compatibel, maar lettertypen, tekenbreedte en Unicode-ondersteuning kunnen variëren per telefoon, browser en besturingssysteem.",

    "see1": "Emoji-Kiezer",
    "see2": "Speciale Symbolen",
    "see3": "Mooie Lettertypen",
    "see4": "Lenny Face Generator",
  }
}
</i18n>
