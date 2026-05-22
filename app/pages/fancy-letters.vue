<script setup lang="ts">
import { dfs, f1, f2, f3, f4, f5, d1 } from '~/assets/js/fonts.js'

const { t } = useI18n({ useScope: 'local' })

const MAX_INPUT_LENGTH = 60
const COPY_FEEDBACK_MS = 2000
const COMBINING_DIACRITICS = /[\u0300-\u036f]/g

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') }
  ]
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

function toArray(text: string): string[] {
  const arr: string[] = []
  for (const c of text) arr.push(c)
  if (arr.length === 26) arr.push(...arr.slice())
  return arr
}

const allFonts: string[][] = []
for (const font of f1) allFonts.push(toArray(font))
for (const font of f2) allFonts.push(font.split(' '))

const fontStyles = [
  { name: 'st_cursive', desc: 'st_cursive_d' },
  { name: 'st_gothic',  desc: 'st_gothic_d'  },
  { name: 'st_bubble',  desc: 'st_bubble_d'  },
  { name: 'st_square',  desc: 'st_square_d'  },
  { name: 'st_mono',    desc: 'st_mono_d'    },
  { name: 'st_invert',  desc: 'st_invert_d'  },
  { name: 'st_manga',   desc: 'st_manga_d'   },
  { name: 'st_zalgo',   desc: 'st_zalgo_d'   }
]

const state = reactive({
  text: '',
  letters: [] as string[],
  decorations: d1.replaceAll('t', t('text')).split('&') as string[],
  selectedDecoration: null as string | null,
  copiedIndex: null as number | null,
  copyAnnouncement: ''
})

function convert(text: string) {
  const raw = text.trim()
  const src = raw === '' ? t('preview_text') : raw
  const noAccents = src.normalize('NFD').replace(COMBINING_DIACRITICS, '')
  const letters: string[] = []

  for (const font of allFonts) {
    let out = ''
    for (const c of noAccents) {
      const idx = dfs.indexOf(c)
      out += idx > -1 && idx < font.length ? font[idx] : c
    }
    letters.push(out)
  }

  for (const symbol of f4) {
    let out = ''
    for (const c of src) out += c.replace(/([^\s])/g, symbol)
    letters.push(out)
  }

  for (const symbol of f3) letters.push(src.split('').join(symbol) + symbol)
  for (const symbol of f5) letters.push(symbol + src.split('').join(symbol) + symbol)

  if (state.selectedDecoration) {
    for (let i = 0; i < letters.length; i++) {
      letters[i] = state.selectedDecoration.replace(t('text'), letters[i])
    }
  }

  state.letters = letters
}

convert('')

watch(() => state.text, (val) => {
  state.copiedIndex = null
  convert(val)
})

watch(() => state.selectedDecoration, () => {
  state.copiedIndex = null
  convert(state.text)
})

function clearInput() {
  state.text = ''
}

async function copy(text: string, index: number) {
  try {
    await navigator.clipboard.writeText(text)
    state.copiedIndex = index
    state.copyAnnouncement = t('copied_announce')
    setTimeout(() => {
      state.copiedIndex = null
      state.copyAnnouncement = ''
    }, COPY_FEEDBACK_MS)
  } catch {
    // Fallback silencioso — navegadores antigos sem Clipboard API
  }
}

defineI18nRoute({
  paths: {
    en: '/fancy-letters',
    pt: '/letras-diferentes',
    es: '/letras-diferentes',
    fr: '/lettres-differentes',
    it: '/lettere-diverse',
    id: '/huruf-berbeda',
    de: '/schoene-schriften',
    nl: '/mooie-letters'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.text.length > 0"
    :see-also-links="[
      { label: t('see1'), to: 'symbol-picker' },
      { label: t('see2'), to: 'invisible-character' },
      { label: t('see3'), to: 'ascii-letter-generator' },
      { label: t('see4'), to: 'kaomoji' }
    ]"
  >
    <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Input principal com contador e botão limpar -->
      <div class="form-control w-full">
        <label for="fancy-input" class="label">
          <span class="label-text font-bold text-base-content">{{ t('in_label') }}</span>
          <span class="label-text-alt text-base-content/70 text-sm">
            {{ state.text.length }} / {{ MAX_INPUT_LENGTH }}
          </span>
        </label>
        <div class="relative">
          <input
            id="fancy-input"
            v-model="state.text"
            type="text"
            :maxlength="MAX_INPUT_LENGTH"
            class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl pr-12"
            :placeholder="t('plc')"
            enterkeyhint="done"
            autocomplete="off"
            spellcheck="false"
            autofocus
          />
          <button
            v-if="state.text.length > 0"
            type="button"
            @click="clearInput"
            :aria-label="t('clear')"
            class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost btn-xs text-base-content/40 hover:text-base-content"
          >
            <Icon name="material-symbols:close-rounded" class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Seletor de decoração -->
      <div class="form-control w-full sm:w-fit">
        <label for="decoration-select" class="label">
          <span class="label-text font-semibold text-base-content">{{ t('decoration') }}</span>
        </label>
        <select
          id="decoration-select"
          v-model="state.selectedDecoration"
          class="select select-bordered bg-base-200 rounded-2xl w-full sm:w-auto ml-2"
        >
          <option :value="null">{{ t('no_deco') }}</option>
          <option v-for="dec in state.decorations" :key="dec" :value="dec">{{ dec }}</option>
        </select>
      </div>

      <!-- Lista de resultados (altura fixa para evitar CLS) -->
      <ul
        class="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm overflow-y-auto"
        style="height: 420px"
        :aria-label="t('results_label')"
      >
        <li
          v-for="(letter, i) in state.letters"
          :key="i"
          class="flex items-center gap-3 px-4 py-3 hover:bg-base-200/60 transition-colors border-b border-base-content/5 last:border-0"
        >
          <span class="flex-1 break-all leading-relaxed select-all text-xl">{{ letter }}</span>
          <button
            type="button"
            @click="copy(letter, i)"
            :aria-label="t('copy')"
            class="btn btn-square btn-ghost btn-sm shrink-0 transition-all duration-200 active:scale-90"
            :class="state.copiedIndex === i ? 'text-success' : 'text-base-content/40 hover:text-primary'"
          >
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="scale-50 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-50 opacity-0"
              mode="out-in"
            >
              <Icon
                :key="state.copiedIndex === i ? 'check' : 'copy'"
                :name="state.copiedIndex === i ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'"
                class="w-5 h-5"
                aria-hidden="true"
              />
            </Transition>
          </button>
        </li>
      </ul>

      <!-- Anúncio acessível para leitores de tela ao copiar -->
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
      >
        {{ state.copyAnnouncement }}
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

        <!-- Glossário de estilos -->
        <div>
          <h2 class="text-xl font-bold mb-4">{{ t('styles_title') }}</h2>
          <p class="text-base-content mb-4">{{ t('styles_intro') }}</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="style in fontStyles"
              :key="style.name"
              class="flex gap-2"
            >
              <span class="text-primary font-bold shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <p>
                <strong>{{ t(style.name) }}:</strong>
                {{ t(style.desc) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Seção educacional: substitui o keyword stuffing antigo -->
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
    m_title: "Letras Diferentes - Gerador de Letras Bonitas - Copiar e Colar",
    title: "Letras Diferentes",
    meta: "Crie letras diferentes e bonitas para Instagram, WhatsApp, Free Fire e Discord. Mais de 30 estilos de letras personalizadas prontas para copiar e colar.",
    d1: "Transforme qualquer texto comum em algo único, decorativo e cheio de personalidade com o nosso gerador de letras bonitas. Esta ferramenta online e gratuita gera dezenas de fontes diferentes e bonitas no estilo cursivo, gótico, bolha, monoespaçado, invertido e muitos outros. É perfeito para quem procura uma font para nick chamativa para jogos, bio do Instagram, recado do WhatsApp ou para se destacar em qualquer rede social.",
    in_label: "Seu texto",
    plc: "Digite seu nome, frase ou nick aqui...",
    preview_text: "Exemplo",
    text: "Texto",
    decoration: "Símbolos e Bordas:",
    no_deco: "Sem decoração",
    copy: "Copiar",
    clear: "Limpar texto",
    copied_announce: "Texto copiado para a área de transferência",
    results_label: "Lista de estilos gerados",

    use_cases_title: "Onde usar suas letras personalizadas",
    uc_1_title: "Instagram, TikTok e redes sociais",
    uc_1_desc: "Destaque a bio, a legenda ou o nome do seu perfil com fontes decorativas. Como tudo é baseado em símbolos universais, funciona direto, sem instalar nenhum aplicativo extra.",
    uc_2_title: "Nicknames para jogos online",
    uc_2_desc: "Crie nicks únicos para Free Fire, Roblox, Fortnite, Valorant e outros. Combine estilos com bordas decorativas para um visual marcante no seu perfil de jogador.",
    uc_3_title: "WhatsApp, Telegram e Discord",
    uc_3_desc: "Personalize seu nome de exibição, status, recados e mensagens. Os caracteres funcionam em praticamente todos os aplicativos de mensagem modernos.",
    uc_4_title: "Perfis de criadores e marcas pessoais",
    uc_4_desc: "Destaque o nome do seu canal, loja ou projeto criativo com uma identidade visual única. Útil para perfis no TikTok, YouTube, Twitch e Etsy, onde um nome diferente pode reforçar o reconhecimento da sua marca.",

    how_it_works_title: "Como usar o gerador de letras e símbolos",
    hiw_1_title: "Digite ou cole seu texto",
    hiw_1_desc: "Escreva seu nome, frase ou nick no campo principal. Os resultados aparecem automaticamente em mais de 30 estilos diferentes, sem precisar clicar em gerar.",
    hiw_2_title: "Adicione bordas e símbolos (opcional)",
    hiw_2_desc: "Use o seletor de decoração para envolver o texto com molduras de estrelas, corações, ondas e outros enfeites. Combine estilos até encontrar o visual perfeito.",
    hiw_3_title: "Copie e cole onde quiser",
    hiw_3_desc: "Clique no ícone ao lado do estilo que mais gostou. O texto vai direto para a área de transferência, pronto para colar na sua rede social, jogo ou aplicativo.",

    styles_title: "Estilos de letras bonitas disponíveis",
    styles_intro: "A ferramenta cobre as principais categorias de fontes Unicode usadas em redes sociais e jogos. Veja abaixo o que cada uma representa:",
    st_cursive: "Cursiva e Script",
    st_cursive_d: "Imitam uma caligrafia elegante e fluida. Ideais para biografias sofisticadas, nomes artísticos e convites digitais.",
    st_gothic: "Gótica e Fraktur",
    st_gothic_d: "Traços fortes inspirados em manuscritos medievais. Boa escolha para um visual com peso, tradição ou pegada heavy metal.",
    st_bubble: "Bolha (Bubble)",
    st_bubble_d: "Letras arredondadas e divertidas, que parecem bolhas infladas. Funcionam bem em mensagens casuais e perfis lúdicos.",
    st_square: "Quadrada (Square)",
    st_square_d: "Caracteres dentro de molduras quadradas, criando um visual geométrico e moderno muito usado em nicks de jogos.",
    st_mono: "Monoespaçada (Retro)",
    st_mono_d: "Cada caractere ocupa exatamente o mesmo espaço, lembrando máquinas de escrever e terminais. Estética limpa e minimalista.",
    st_invert: "Invertida e Espelhada",
    st_invert_d: "Texto virado de cabeça para baixo ou refletido. Útil para efeitos visuais inusitados e brincadeiras nas redes.",
    st_manga: "Mangá",
    st_manga_d: "Inspirada na tipografia de quadrinhos japoneses, com traços dinâmicos que dão movimento ao texto.",
    st_zalgo: "Zalgo e Glitch",
    st_zalgo_d: "Efeito de texto corrompido, com símbolos sobrepostos formando uma trama caótica. Combina com estéticas de terror, mistério e cyberpunk.",

    unicode_title: "Por que essas letras funcionam em qualquer plataforma",
    unicode_p1: "Apesar de parecerem fontes especiais, essas letras não são fontes no sentido técnico. São caracteres reais do padrão Unicode, o mesmo sistema universal que define os emojis e os alfabetos do mundo todo. É por isso que o resultado aparece igual no Android, iPhone, Windows ou Mac, sem precisar instalar nada.",
    unicode_p2: "Como cada caractere é um símbolo independente, o texto pode ser colado em qualquer campo que aceite escrita comum: bio do Instagram, nome no WhatsApp, recado no Discord, nick em jogos e até em formulários. A única limitação aparece quando o aplicativo bloqueia certos blocos do Unicode por questão de moderação ou segurança.",

    faq_title: "Perguntas e Respostas",
    faq_1_q: "Como colocar letras diferentes no Instagram?",
    faq_1_a: "Acesse o Instagram, vá em Editar Perfil e cole o texto estilizado no campo de nome ou bio. Como os caracteres são Unicode universais (o mesmo padrão dos emojis) aparecem automaticamente sem instalar nada. Para legendas e Stories, basta copiar e colar normalmente.",
    faq_2_q: "Letras diferentes funcionam no TikTok?",
    faq_2_a: "Sim. O TikTok aceita caracteres Unicode no nome de usuário, bio e legendas de vídeos. Cole o texto copiado direto nos campos de texto do app. A única limitação é quando o TikTok bloqueia certos blocos Unicode em nomes de usuário — nesses casos, tente um estilo diferente.",
    faq_3_q: "Como criar nick estilizado?",
    faq_3_a: "Digite o nome desejado no campo da ferramenta, escolha um estilo que combine com o seu jogo ou perfil e copie com um clique. Para jogos como Free Fire, Roblox e Fortnite, estilos góticos, quadrados ou com bordas decorativas costumam funcionar bem. Dica: combine um estilo de letra com uma borda para um visual ainda mais marcante.",

    see1: "Seletor de Símbolos",
    see2: "Caractere Invisível",
    see3: "Gerador de Letras ASCII",
    see4: "Seletor de Kaomojis",

    f_1: "Mais de 30 estilos de letras personalizadas",
    f_2: "Cópia rápida com um clique",
    f_3: "Compatível com Instagram, WhatsApp, Discord e jogos",
    f_4: "Gratuito, sem cadastro e sem instalação"
  },
  en: {
    m_title: "Fancy Letters Generator - Copy & Paste Cool Fonts",
    title: "Fancy Letters",
    meta: "Create cool and different letters for Instagram, WhatsApp, Free Fire, and Discord. Over 30 stylized font styles ready to copy and paste.",
    d1: "Transform any ordinary text into something unique, decorative, and full of personality. This tool generates dozens of variations at once, with cursive, gothic, bubble, monospaced, inverted, and many other fonts, ready for you to use in your Instagram bio, gaming nicks, WhatsApp status, or any app that accepts text.",
    in_label: "Your text",
    plc: "Type your name, phrase, or nick here...",
    preview_text: "Example",
    text: "Text",
    decoration: "Symbols & Borders:",
    no_deco: "No decoration",
    copy: "Copy",
    clear: "Clear text",
    copied_announce: "Text copied to clipboard",
    results_label: "List of generated styles",

    use_cases_title: "Where to use your custom letters",
    uc_1_title: "Instagram, TikTok, and social media",
    uc_1_desc: "Make your bio, caption, or profile name stand out with decorative fonts. Since everything is based on universal symbols, it works directly without installing any extra app.",
    uc_2_title: "Nicknames for online games",
    uc_2_desc: "Create unique nicks for Free Fire, Roblox, Fortnite, Valorant, and others. Combine styles with decorative borders for a striking look on your gaming profile.",
    uc_3_title: "WhatsApp, Telegram, and Discord",
    uc_3_desc: "Customize your display name, status, about, and messages. The characters work in practically all modern messaging apps.",
    uc_4_title: "Creator profiles and personal brands",
    uc_4_desc: "Make your channel name, shop, or creative project stand out with a unique visual identity. Useful for profiles on TikTok, YouTube, Twitch, and Etsy, where a distinctive name can reinforce brand recognition.",

    how_it_works_title: "How to use the cool letters generator",
    hiw_1_title: "Type or paste your text",
    hiw_1_desc: "Write your name, phrase, or nick in the main field. The results appear automatically in more than 30 different styles, no need to click generate.",
    hiw_2_title: "Add borders and symbols (optional)",
    hiw_2_desc: "Use the decoration selector to wrap the text with frames of stars, hearts, waves, and other ornaments. Combine styles until you find the perfect look.",
    hiw_3_title: "Copy and paste wherever you want",
    hiw_3_desc: "Click the icon next to the style you liked best. The text goes straight to the clipboard, ready to paste on your social network, game, or app.",

    styles_title: "Available letter styles",
    styles_intro: "The tool covers the main Unicode font categories used in social media and games. See below what each one represents:",
    st_cursive: "Cursive & Script",
    st_cursive_d: "Imitate elegant and flowing handwriting. Ideal for sophisticated bios, artistic names, and digital invitations.",
    st_gothic: "Gothic & Fraktur",
    st_gothic_d: "Strong strokes inspired by medieval manuscripts. Good choice for a look with weight, tradition, or a heavy metal vibe.",
    st_bubble: "Bubble",
    st_bubble_d: "Round and fun letters that look like inflated bubbles. Work well in casual messages and playful profiles.",
    st_square: "Square",
    st_square_d: "Characters inside square frames, creating a geometric and modern look often used in game nicks.",
    st_mono: "Monospaced (Retro)",
    st_mono_d: "Each character takes up exactly the same space, resembling typewriters and terminals. Clean and minimalist aesthetic.",
    st_invert: "Inverted & Mirrored",
    st_invert_d: "Text turned upside down or reflected. Useful for unusual visual effects and pranks on networks.",
    st_manga: "Manga",
    st_manga_d: "Inspired by Japanese comic book typography, with dynamic strokes that give movement to the text.",
    st_zalgo: "Zalgo & Glitch",
    st_zalgo_d: "Corrupted text effect, with overlapping symbols forming a chaotic web. Fits with horror, mystery, and cyberpunk aesthetics.",

    unicode_title: "Why these letters work on any platform",
    unicode_p1: "Although they look like special fonts, these letters are not fonts in the technical sense. They are real characters from the Unicode standard, the same universal system that defines emojis and alphabets worldwide. That's why the result looks the same on Android, iPhone, Windows, or Mac, without needing to install anything.",
    unicode_p2: "Because each character is an independent symbol, the text can be pasted into any field that accepts regular writing: Instagram bio, WhatsApp name, Discord about me, game nicks, and even forms. The only limitation occurs when the app blocks certain Unicode blocks for moderation or security reasons.",

    faq_title: "Questions and Answers",
    faq_1_q: "How to put different letters on Instagram?",
    faq_1_a: "Open Instagram, go to Edit Profile, and paste the styled text into the name or bio field. Since the characters are universal Unicode — the same standard as emojis — they appear automatically without installing anything. For captions and Stories, just copy and paste normally.",
    faq_2_q: "Do different letters work on TikTok?",
    faq_2_a: "Yes. TikTok accepts Unicode characters in the username, bio, and video captions. Paste the copied text directly into the app's text fields. The only limitation is when TikTok blocks certain Unicode blocks in usernames — in that case, try a different style.",
    faq_3_q: "How to create a stylized nickname?",
    faq_3_a: "Type the desired name in the tool's field, choose a style that matches your game or profile, and copy with one click. For games like Free Fire, Roblox, and Fortnite, gothic, square, or border-decorated styles tend to work great. Tip: combine a letter style with a border for an even more striking look.",

    see1: "Symbol Picker",
    see2: "Invisible Character",
    see3: "ASCII Letter Generator",
    see4: "Kaomoji Picker",

    f_1: "Over 30 custom letter styles",
    f_2: "Fast 1-click copy",
    f_3: "Compatible with Instagram, WhatsApp, Discord, and games",
    f_4: "Free, no signup, no installation"
  },
  es: {
    m_title: "Letras Diferentes - Generador de Letras Bonitas - Copiar y Pegar",
    title: "Letras Diferentes",
    meta: "Crea letras diferentes y bonitas para Instagram, WhatsApp, Free Fire y Discord. Más de 30 estilos de fuentes estilizadas listas para copiar y pegar.",
    d1: "Transforma cualquier texto común en algo único, decorativo y lleno de personalidad. Esta herramienta genera decenas de variaciones al mismo tiempo, con fuentes cursivas, góticas, burbuja, monoespaciadas, invertidas y muchas otras, listas para que las uses en tu biografía de Instagram, nicks de juegos, estados de WhatsApp o cualquier aplicación que acepte texto.",
    in_label: "Tu texto",
    plc: "Escribe tu nombre, frase o nick aquí...",
    preview_text: "Ejemplo",
    text: "Texto",
    decoration: "Símbolos y Bordes:",
    no_deco: "Sin decoración",
    copy: "Copiar",
    clear: "Limpiar texto",
    copied_announce: "Texto copiado al portapapeles",
    results_label: "Lista de estilos generados",

    use_cases_title: "Dónde usar tus letras personalizadas",
    uc_1_title: "Instagram, TikTok y redes sociales",
    uc_1_desc: "Destaca tu biografía, la descripción o el nombre de tu perfil con fuentes decorativas. Como todo está basado en símbolos universales, funciona directamente, sin instalar ninguna aplicación extra.",
    uc_2_title: "Nicknames para juegos en línea",
    uc_2_desc: "Crea nicks únicos para Free Fire, Roblox, Fortnite, Valorant y otros. Combina estilos con bordes decorativos para un aspecto llamativo en tu perfil de jugador.",
    uc_3_title: "WhatsApp, Telegram y Discord",
    uc_3_desc: "Personaliza tu nombre de visualización, estado, información y mensajes. Los caracteres funcionan en prácticamente todas las aplicaciones de mensajería modernas.",
    uc_4_title: "Perfiles de creadores y marcas personales",
    uc_4_desc: "Haz destacar el nombre de tu canal, tienda o proyecto creativo con una identidad visual única. Útil para perfiles en TikTok, YouTube, Twitch y Etsy, donde un nombre diferente puede reforzar el reconocimiento de tu marca.",

    how_it_works_title: "Cómo usar el generador de letras bonitas",
    hiw_1_title: "Escribe o pega tu texto",
    hiw_1_desc: "Escribe tu nombre, frase o nick en el campo principal. Los resultados aparecen automáticamente en más de 30 estilos diferentes, sin necesidad de hacer clic en generar.",
    hiw_2_title: "Añade bordes y símbolos (opcional)",
    hiw_2_desc: "Usa el selector de decoración para envolver el texto con marcos de estrellas, corazones, ondas y otros adornos. Combina estilos hasta encontrar el aspecto perfecto.",
    hiw_3_title: "Copia y pega donde quieras",
    hiw_3_desc: "Haz clic en el icono junto al estilo que más te haya gustado. El texto va directo al portapapeles, listo para pegar en tu red social, juego o aplicación.",

    styles_title: "Estilos de letras disponibles",
    styles_intro: "La herramienta cubre las principales categorías de fuentes Unicode utilizadas en redes sociales y juegos. Mira a continuación lo que representa cada una:",
    st_cursive: "Cursiva y Script",
    st_cursive_d: "Imitan una caligrafía elegante y fluida. Ideales para biografías sofisticadas, nombres artísticos e invitaciones digitales.",
    st_gothic: "Gótica y Fraktur",
    st_gothic_d: "Trazos fuertes inspirados en manuscritos medievales. Buena elección para un aspecto con peso, tradición o toque heavy metal.",
    st_bubble: "Burbuja",
    st_bubble_d: "Letras redondeadas y divertidas, que parecen burbujas infladas. Funcionan bien en mensajes casuales y perfiles lúdicos.",
    st_square: "Cuadrada",
    st_square_d: "Caracteres dentro de marcos cuadrados, creando un aspecto geométrico y moderno muy usado en nicks de juegos.",
    st_mono: "Monoespaciada (Retro)",
    st_mono_d: "Cada carácter ocupa exactamente el mismo espacio, recordando a máquinas de escribir y terminales. Estética limpia y minimalista.",
    st_invert: "Invertida y Espejada",
    st_invert_d: "Texto invertido boca abajo o reflejado. Útil para efectos visuales inusuales y bromas en redes.",
    st_manga: "Manga",
    st_manga_d: "Inspirada en la tipografía de cómics japoneses, con trazos dinámicos que dan movimiento al texto.",
    st_zalgo: "Zalgo y Glitch",
    st_zalgo_d: "Efecto de texto corrupto, con símbolos superpuestos formando una trama caótica. Combina con estéticas de terror, misterio y cyberpunk.",

    unicode_title: "Por qué estas letras funcionan en cualquier plataforma",
    unicode_p1: "Aunque parecen fuentes especiales, estas letras no son fuentes en el sentido técnico. Son caracteres reales del estándar Unicode, el mismo sistema universal que define los emojis y los alfabetos de todo el mundo. Es por eso que el resultado se ve igual en Android, iPhone, Windows o Mac, sin necesidad de instalar nada.",
    unicode_p2: "Como cada carácter es un símbolo independiente, el texto puede ser pegado en cualquier campo que acepte escritura común: biografía de Instagram, nombre de WhatsApp, información en Discord, nicks en juegos e incluso en formularios. La única limitación aparece cuando la aplicación bloquea ciertos bloques de Unicode por motivos de moderación o seguridad.",

    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cómo poner letras diferentes en Instagram?",
    faq_1_a: "Abre Instagram, ve a Editar Perfil y pega el texto estilizado en el campo de nombre o bio. Como los caracteres son Unicode universales —el mismo estándar que los emojis— aparecen automáticamente sin instalar nada. Para subtítulos y Stories, simplemente copia y pega normalmente.",
    faq_2_q: "¿Las letras diferentes funcionan en TikTok?",
    faq_2_a: "Sí. TikTok acepta caracteres Unicode en el nombre de usuario, bio y subtítulos de videos. Pega el texto copiado directamente en los campos de texto de la app. La única limitación es cuando TikTok bloquea ciertos bloques Unicode en nombres de usuario — en ese caso, prueba un estilo diferente.",
    faq_3_q: "¿Cómo crear un nick estilizado?",
    faq_3_a: "Escribe el nombre deseado en el campo de la herramienta, elige un estilo que combine con tu juego o perfil y copia con un clic. Para juegos como Free Fire, Roblox y Fortnite, los estilos góticos, cuadrados o con bordes decorativos suelen funcionar muy bien. Consejo: combina un estilo de letra con un borde para un aspecto aún más llamativo.",

    see1: "Selector de Símbolos",
    see2: "Carácter Invisible",
    see3: "Generador de Letras ASCII",
    see4: "Selector de Kaomojis",

    f_1: "Más de 30 estilos de letras personalizadas",
    f_2: "Copia rápida con un clic",
    f_3: "Compatible con Instagram, WhatsApp, Discord y juegos",
    f_4: "Gratis, sin registro y sin instalación"
  },
  fr: {
    m_title: "Lettres Différentes - Générateur de Belles Polices - Copier & Coller",
    title: "Lettres Différentes",
    meta: "Créez des lettres stylées et belles pour Instagram, WhatsApp, Free Fire et Discord. Plus de 30 styles de polices stylisées prêtes à copier et coller.",
    d1: "Transformez n'importe quel texte ordinaire en quelque chose d'unique, de décoratif et plein de personnalité. Cet outil génère des dizaines de variations à la fois, avec des polices cursives, gothiques, bulles, à chasse fixe, inversées et bien d'autres, prêtes à être utilisées dans votre bio Instagram, pseudos de jeux, statut WhatsApp ou toute application acceptant du texte.",
    in_label: "Votre texte",
    plc: "Tapez votre nom, phrase ou pseudo ici...",
    preview_text: "Exemple",
    text: "Texte",
    decoration: "Symboles et Bordures :",
    no_deco: "Sans décoration",
    copy: "Copier",
    clear: "Effacer le texte",
    copied_announce: "Texte copié dans le presse-papiers",
    results_label: "Liste des styles générés",

    use_cases_title: "Où utiliser vos lettres personnalisées",
    uc_1_title: "Instagram, TikTok et réseaux sociaux",
    uc_1_desc: "Mettez en valeur votre bio, légende ou nom de profil avec des polices décoratives. Puisque tout est basé sur des symboles universels, cela fonctionne directement, sans installer d'application supplémentaire.",
    uc_2_title: "Pseudos pour jeux en ligne",
    uc_2_desc: "Créez des pseudos uniques pour Free Fire, Roblox, Fortnite, Valorant et autres. Combinez des styles avec des bordures décoratives pour un look saisissant sur votre profil de joueur.",
    uc_3_title: "WhatsApp, Telegram et Discord",
    uc_3_desc: "Personnalisez votre nom d'affichage, statut, à propos et messages. Les caractères fonctionnent dans presque toutes les applications de messagerie modernes.",
    uc_4_title: "Profils de créateurs et marques personnelles",
    uc_4_desc: "Démarquez le nom de votre chaîne, boutique ou projet créatif avec une identité visuelle unique. Utile pour les profils sur TikTok, YouTube, Twitch et Etsy, où un nom distinctif peut renforcer la reconnaissance de votre marque.",

    how_it_works_title: "Comment utiliser le générateur de belles lettres",
    hiw_1_title: "Tapez ou collez votre texte",
    hiw_1_desc: "Écrivez votre nom, phrase ou pseudo dans le champ principal. Les résultats apparaissent automatiquement dans plus de 30 styles différents, pas besoin de cliquer sur générer.",
    hiw_2_title: "Ajoutez des bordures et symboles (facultatif)",
    hiw_2_desc: "Utilisez le sélecteur de décoration pour envelopper le texte avec des cadres d'étoiles, cœurs, vagues et autres ornements. Combinez les styles jusqu'à trouver le look parfait.",
    hiw_3_title: "Copiez et collez où vous voulez",
    hiw_3_desc: "Cliquez sur l'icône à côté du style que vous avez préféré. Le texte va directement dans le presse-papiers, prêt à être collé sur votre réseau social, jeu ou application.",

    styles_title: "Styles de lettres disponibles",
    styles_intro: "L'outil couvre les principales catégories de polices Unicode utilisées sur les réseaux sociaux et les jeux. Voyez ci-dessous ce que chacune représente :",
    st_cursive: "Cursive et Script",
    st_cursive_d: "Imitent une écriture élégante et fluide. Idéales pour les bios sophistiquées, les noms artistiques et les invitations numériques.",
    st_gothic: "Gothique et Fraktur",
    st_gothic_d: "Traits forts inspirés des manuscrits médiévaux. Bon choix pour un look avec du poids, de la tradition ou une touche heavy metal.",
    st_bubble: "Bulle",
    st_bubble_d: "Lettres arrondies et amusantes, qui ressemblent à des bulles gonflées. Fonctionnent bien dans les messages occasionnels et les profils ludiques.",
    st_square: "Carré",
    st_square_d: "Caractères à l'intérieur de cadres carrés, créant un look géométrique et moderne très utilisé dans les pseudos de jeux.",
    st_mono: "Monospace (Rétro)",
    st_mono_d: "Chaque caractère occupe exactement le même espace, rappelant les machines à écrire et les terminaux. Esthétique épurée et minimaliste.",
    st_invert: "Inversé et Miroir",
    st_invert_d: "Texte tourné à l'envers ou reflété. Utile pour des effets visuels inhabituels et des blagues sur les réseaux.",
    st_manga: "Manga",
    st_manga_d: "Inspiré par la typographie des bandes dessinées japonaises, avec des traits dynamiques qui donnent du mouvement au texte.",
    st_zalgo: "Zalgo et Glitch",
    st_zalgo_d: "Effet de texte corrompu, avec des symboles superposés formant une trame chaotique. Convient aux esthétiques d'horreur, de mystère et cyberpunk.",

    unicode_title: "Pourquoi ces lettres fonctionnent sur n'importe quelle plateforme",
    unicode_p1: "Bien qu'elles ressemblent à des polices spéciales, ces lettres ne sont pas des polices au sens technique. Ce sont de vrais caractères de la norme Unicode, le même système universel qui définit les émojis et les alphabets du monde entier. C'est pourquoi le résultat est le même sur Android, iPhone, Windows ou Mac, sans avoir besoin d'installer quoi que ce soit.",
    unicode_p2: "Puisque chaque caractère est un symbole indépendant, le texte peut être collé dans n'importe quel champ qui accepte l'écriture normale : bio Instagram, nom WhatsApp, à propos de Discord, pseudos dans les jeux et même les formulaires. La seule limitation apparaît lorsque l'application bloque certains blocs Unicode pour des raisons de modération ou de sécurité.",

    faq_title: "Questions et Réponses",
    faq_1_q: "Comment mettre des lettres différentes sur Instagram ?",
    faq_1_a: "Ouvrez Instagram, allez dans Modifier le profil et collez le texte stylisé dans le champ nom ou bio. Comme les caractères sont des Unicode universels — le même standard que les emojis — ils apparaissent automatiquement sans rien installer. Pour les légendes et les Stories, copiez et collez simplement.",
    faq_2_q: "Les lettres différentes fonctionnent-elles sur TikTok ?",
    faq_2_a: "Oui. TikTok accepte les caractères Unicode dans le nom d'utilisateur, la bio et les légendes de vidéos. Collez le texte copié directement dans les champs de texte de l'application. La seule limitation est lorsque TikTok bloque certains blocs Unicode dans les noms d'utilisateur — dans ce cas, essayez un style différent.",
    faq_3_q: "Comment créer un pseudo stylisé ?",
    faq_3_a: "Tapez le nom souhaité dans le champ de l'outil, choisissez un style qui correspond à votre jeu ou profil et copiez en un clic. Pour des jeux comme Free Fire, Roblox et Fortnite, les styles gothiques, carrés ou avec des bordures décoratives fonctionnent très bien. Conseil : combinez un style de lettres avec une bordure pour un look encore plus frappant.",

    see1: "Sélecteur de Symboles",
    see2: "Caractère Invisible",
    see3: "Générateur de Lettres ASCII",
    see4: "Sélecteur de Kaomojis",

    f_1: "Plus de 30 styles de lettres personnalisés",
    f_2: "Copie rapide en un clic",
    f_3: "Compatible avec Instagram, WhatsApp, Discord et les jeux",
    f_4: "Gratuit, sans inscription et sans installation"
  },
  it: {
    m_title: "Lettere Diverse - Generatore di Font Bellissimi - Copia & Incolla",
    title: "Lettere Diverse",
    meta: "Crea lettere diverse e bellissime per Instagram, WhatsApp, Free Fire e Discord. Oltre 30 stili di font stilizzati pronti da copiare e incollare.",
    d1: "Trasforma qualsiasi testo normale in qualcosa di unico, decorativo e pieno di personalità. Questo strumento genera decine di varianti contemporaneamente, con font corsivi, gotici, a bolla, a spaziatura fissa, invertiti e molti altri, pronti per essere usati nella tua bio di Instagram, nei nick dei giochi, nello stato di WhatsApp o in qualsiasi app che accetti del testo.",
    in_label: "Il tuo testo",
    plc: "Scrivi il tuo nome, frase o nick qui...",
    preview_text: "Esempio",
    text: "Testo",
    decoration: "Simboli e Bordi:",
    no_deco: "Nessuna decorazione",
    copy: "Copia",
    clear: "Cancella testo",
    copied_announce: "Testo copiato negli appunti",
    results_label: "Elenco degli stili generati",

    use_cases_title: "Dove usare le tue lettere personalizzate",
    uc_1_title: "Instagram, TikTok e social media",
    uc_1_desc: "Fai risaltare la tua bio, didascalia o nome del profilo con font decorativi. Poiché tutto si basa su simboli universali, funziona direttamente, senza installare alcuna app aggiuntiva.",
    uc_2_title: "Nickname per giochi online",
    uc_2_desc: "Crea nick unici per Free Fire, Roblox, Fortnite, Valorant e altri. Combina stili con bordi decorativi per un look sorprendente sul tuo profilo di gioco.",
    uc_3_title: "WhatsApp, Telegram e Discord",
    uc_3_desc: "Personalizza il tuo nome visualizzato, stato, info e messaggi. I caratteri funzionano in quasi tutte le moderne app di messaggistica.",
    uc_4_title: "Profili di creator e brand personali",
    uc_4_desc: "Fai risaltare il nome del tuo canale, negozio o progetto creativo con un'identità visiva unica. Utile per i profili su TikTok, YouTube, Twitch ed Etsy, dove un nome distintivo può rafforzare il riconoscimento del tuo brand.",

    how_it_works_title: "Come usare il generatore di belle lettere",
    hiw_1_title: "Scrivi o incolla il tuo testo",
    hiw_1_desc: "Scrivi il tuo nome, frase o nick nel campo principale. I risultati appaiono automaticamente in oltre 30 stili diversi, senza bisogno di cliccare per generare.",
    hiw_2_title: "Aggiungi bordi e simboli (opzionale)",
    hiw_2_desc: "Usa il selettore delle decorazioni per avvolgere il testo con cornici di stelle, cuori, onde e altri ornamenti. Combina gli stili fino a trovare il look perfetto.",
    hiw_3_title: "Copia e incolla dove vuoi",
    hiw_3_desc: "Clicca sull'icona accanto allo stile che ti è piaciuto di più. Il testo va direttamente negli appunti, pronto per essere incollato sul tuo social network, gioco o app.",

    styles_title: "Stili di lettere disponibili",
    styles_intro: "Lo strumento copre le principali categorie di font Unicode utilizzate nei social media e nei giochi. Vedi di seguito cosa rappresenta ciascuna:",
    st_cursive: "Corsivo e Script",
    st_cursive_d: "Imitano una scrittura elegante e fluida. Ideali per bio sofisticate, nomi artistici e inviti digitali.",
    st_gothic: "Gotico e Fraktur",
    st_gothic_d: "Tratti forti ispirati ai manoscritti medievales. Ottima scelta per un look con peso, tradizione o un tocco heavy metal.",
    st_bubble: "Bolla",
    st_bubble_d: "Lettere arrotondate e divertenti, che sembrano bolle gonfiate. Funzionano bene nei messaggi casuali e nei profili ludici.",
    st_square: "Quadrato",
    st_square_d: "Caratteri all'interno di cornici quadrate, creando un look geometrico e moderno molto usato nei nick dei giochi.",
    st_mono: "Monospaziato (Retro)",
    st_mono_d: "Ogni carattere occupa esattamente lo stesso spazio, ricordando le macchine da scrivere e i terminali. Estetica pulita e minimalista.",
    st_invert: "Invertito e Speculare",
    st_invert_d: "Testo capovolto o riflesso. Utile per effetti visivi insoliti e scherzi in rete.",
    st_manga: "Manga",
    st_manga_d: "Ispirato alla tipografia dei fumetti giapponesi, con tratti dinamici che danno movimento al testo.",
    st_zalgo: "Zalgo e Glitch",
    st_zalgo_d: "Effetto di testo corrotto, con simboli sovrapposti che formano una trama caotica. Si adatta all'estetica horror, mistero e cyberpunk.",

    unicode_title: "Perché queste lettere funzionano su qualsiasi piattaforma",
    unicode_p1: "Sebbene sembrino font speciali, queste lettere non sono font in senso tecnico. Sono caratteri reali dello standard Unicode, lo stesso sistema universale che definisce gli emoji e gli alfabeti di tutto il mondo. Ecco perché il risultato appare identico su Android, iPhone, Windows o Mac, senza dover installare nulla.",
    unicode_p2: "Poiché ogni carattere è un simbolo indipendente, il testo può essere incollato in qualsiasi campo che accetti la normale scrittura: bio di Instagram, nome su WhatsApp, info di Discord, nick nei giochi e persino nei moduli. L'unica limitazione si verifica quando l'app blocca determinati blocchi Unicode per motivi di moderazione o sicurezza.",

    faq_title: "Domande e Risposte",
    faq_1_q: "Come mettere lettere diverse su Instagram?",
    faq_1_a: "Apri Instagram, vai su Modifica profilo e incolla il testo stilizzato nel campo nome o bio. Poiché i caratteri sono Unicode universali — lo stesso standard degli emoji — appaiono automaticamente senza installare nulla. Per le didascalie e le Stories, copia e incolla normalmente.",
    faq_2_q: "Le lettere diverse funzionano su TikTok?",
    faq_2_a: "Sì. TikTok accetta caratteri Unicode nel nome utente, nella bio e nelle didascalie dei video. Incolla il testo copiato direttamente nei campi di testo dell'app. L'unica limitazione è quando TikTok blocca determinati blocchi Unicode nei nomi utente — in quel caso, prova uno stile diverso.",
    faq_3_q: "Come creare un nickname stilizzato?",
    faq_3_a: "Digita il nome desiderato nel campo dello strumento, scegli uno stile che si adatti al tuo gioco o profilo e copia con un clic. Per giochi come Free Fire, Roblox e Fortnite, gli stili gotici, quadrati o con bordi decorativi funzionano molto bene. Suggerimento: combina uno stile di lettere con un bordo per un look ancora più d'impatto.",

    see1: "Selettore di Simboli",
    see2: "Carattere Invisibile",
    see3: "Generatore di Lettere ASCII",
    see4: "Selettore di Kaomoji",

    f_1: "Oltre 30 stili di lettere personalizzate",
    f_2: "Copia rapida in 1 clic",
    f_3: "Compatibile con Instagram, WhatsApp, Discord e giochi",
    f_4: "Gratuito, senza registrazione e senza installazione"
  },
  id: {
    m_title: "Huruf Berbeda - Generator Huruf Keren - Salin & Tempel",
    title: "Huruf Berbeda",
    meta: "Buat huruf yang berbeda dan keren untuk Instagram, WhatsApp, Free Fire, dan Discord. Lebih dari 30 gaya font bergaya siap untuk disalin dan ditempel.",
    d1: "Ubah teks biasa apa pun menjadi sesuatu yang unik, dekoratif, dan penuh kepribadian. Alat ini menghasilkan puluhan variasi sekaligus, dengan font kursif, gothic, gelembung, monospasi, terbalik, dan banyak lainnya, siap untuk Anda gunakan di bio Instagram, nama game, status WhatsApp, atau aplikasi apa pun yang menerima teks.",
    in_label: "Teks Anda",
    plc: "Ketik nama, frasa, atau nama panggilan Anda di sini...",
    preview_text: "Contoh",
    text: "Teks",
    decoration: "Simbol & Batas:",
    no_deco: "Tanpa dekorasi",
    copy: "Salin",
    clear: "Hapus teks",
    copied_announce: "Teks disalin ke papan klip",
    results_label: "Daftar gaya yang dihasilkan",

    use_cases_title: "Di mana menggunakan huruf kustom Anda",
    uc_1_title: "Instagram, TikTok, dan media sosial",
    uc_1_desc: "Jadikan bio, keterangan, atau nama profil Anda menonjol dengan font dekoratif. Karena semuanya didasarkan pada simbol universal, ini berfungsi secara langsung, tanpa menginstal aplikasi tambahan.",
    uc_2_title: "Nama panggilan untuk game online",
    uc_2_desc: "Buat nama panggilan unik untuk Free Fire, Roblox, Fortnite, Valorant, dan lainnya. Gabungkan gaya dengan batas dekoratif untuk tampilan mencolok di profil pemain Anda.",
    uc_3_title: "WhatsApp, Telegram, dan Discord",
    uc_3_desc: "Sesuaikan nama tampilan, status, tentang, dan pesan Anda. Karakter ini berfungsi di hampir semua aplikasi perpesanan modern.",
    uc_4_title: "Profil kreator dan merek pribadi",
    uc_4_desc: "Jadikan nama saluran, toko, atau proyek kreatif Anda menonjol dengan identitas visual yang unik. Berguna untuk profil di TikTok, YouTube, Twitch, dan Etsy, di mana nama yang berbeda dapat memperkuat pengenalan merek Anda.",

    how_it_works_title: "Cara menggunakan generator huruf keren",
    hiw_1_title: "Ketik atau tempel teks Anda",
    hiw_1_desc: "Tulis nama, frasa, atau nama panggilan Anda di bidang utama. Hasilnya muncul secara otomatis dalam lebih dari 30 gaya berbeda, tidak perlu mengklik hasilkan.",
    hiw_2_title: "Tambahkan batas dan simbol (opsional)",
    hiw_2_desc: "Gunakan pemilih dekorasi untuk membungkus teks dengan bingkai bintang, hati, ombak, dan ornamen lainnya. Gabungkan gaya sampai Anda menemukan tampilan yang sempurna.",
    hiw_3_title: "Salin dan tempel di mana pun Anda mau",
    hiw_3_desc: "Klik ikon di sebelah gaya yang paling Anda sukai. Teks langsung masuk ke papan klip, siap untuk ditempel di jejaring sosial, game, atau aplikasi Anda.",

    styles_title: "Gaya huruf yang tersedia",
    styles_intro: "Alat ini mencakup kategori font Unicode utama yang digunakan di media sosial dan game. Lihat di bawah ini untuk mengetahui apa arti masing-masing gaya:",
    st_cursive: "Kursif & Skrip",
    st_cursive_d: "Meniru tulisan tangan yang elegan dan mengalir. Ideal untuk bio yang canggih, nama artistik, dan undangan digital.",
    st_gothic: "Gothic & Fraktur",
    st_gothic_d: "Goresan kuat yang terinspirasi dari manuskrip abad pertengahan. Pilihan tepat untuk tampilan dengan bobot, tradisi, atau nuansa heavy metal.",
    st_bubble: "Gelembung",
    st_bubble_d: "Huruf bulat dan menyenangkan, yang terlihat seperti gelembung yang ditiup. Berfungsi dengan baik di pesan santai dan profil yang ceria.",
    st_square: "Kotak",
    st_square_d: "Karakter di dalam bingkai persegi, menciptakan tampilan geometris dan modern yang banyak digunakan dalam nama game.",
    st_mono: "Monospasi (Retro)",
    st_mono_d: "Setiap karakter menempati ruang yang sama persis, mengingatkan pada mesin tik dan terminal. Estetika yang bersih dan minimalis.",
    st_invert: "Terbalik & Cermin",
    st_invert_d: "Teks diputar terbalik atau dipantulkan. Berguna untuk efek visual yang tidak biasa dan lelucon di jaringan.",
    st_manga: "Manga",
    st_manga_d: "Terinspirasi dari tipografi buku komik Jepang, dengan goresan dinamis yang memberikan gerakan pada teks.",
    st_zalgo: "Zalgo & Glitch",
    st_zalgo_d: "Efek teks rusak, dengan simbol tumpang tindih yang membentuk jaring kacau. Cocok dengan estetika horor, misteri, dan cyberpunk.",

    unicode_title: "Mengapa huruf-huruf ini berfungsi di platform apa pun",
    unicode_p1: "Meskipun terlihat seperti font khusus, huruf-huruf ini bukanlah font dalam arti teknis. Mereka adalah karakter nyata dari standar Unicode, sistem universal yang sama yang mendefinisikan emoji dan alfabet di seluruh dunia. Itulah sebabnya hasilnya terlihat sama di Android, iPhone, Windows, atau Mac, tanpa perlu menginstal apa pun.",
    unicode_p2: "Karena setiap karakter adalah simbol independen, teks dapat ditempel ke bidang apa pun yang menerima tulisan biasa: bio Instagram, nama WhatsApp, tentang Discord, nama game, dan bahkan formulir. Satu-satunya batasan muncul ketika aplikasi memblokir blok Unicode tertentu karena alasan moderasi atau keamanan.",

    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Cara memasang huruf berbeda di Instagram?",
    faq_1_a: "Buka Instagram, pergi ke Edit Profil, dan tempel teks bergaya ke kolom nama atau bio. Karena karakternya adalah Unicode universal — standar yang sama dengan emoji — muncul secara otomatis tanpa menginstal apa pun. Untuk keterangan dan Stories, cukup salin dan tempel biasa.",
    faq_2_q: "Apakah huruf berbeda berfungsi di TikTok?",
    faq_2_a: "Ya. TikTok menerima karakter Unicode di nama pengguna, bio, dan keterangan video. Tempel teks yang disalin langsung ke kolom teks di aplikasi. Satu-satunya batasan adalah ketika TikTok memblokir blok Unicode tertentu di nama pengguna — dalam kasus tersebut, coba gaya yang berbeda.",
    faq_3_q: "Cara membuat nama panggilan bergaya?",
    faq_3_a: "Ketik nama yang diinginkan di kolom alat, pilih gaya yang sesuai dengan game atau profil Anda, dan salin dengan satu klik. Untuk game seperti Free Fire, Roblox, dan Fortnite, gaya gothic, kotak, atau berhias pinggiran biasanya bekerja dengan baik. Tips: kombinasikan gaya huruf dengan pinggiran untuk tampilan yang lebih mencolok.",

    see1: "Pemilih Simbol",
    see2: "Karakter Tak Terlihat",
    see3: "Generator Huruf ASCII",
    see4: "Pemilih Kaomoji",

    f_1: "Lebih dari 30 gaya huruf khusus",
    f_2: "Salin cepat 1-klik",
    f_3: "Kompatibel dengan Instagram, WhatsApp, Discord, dan game",
    f_4: "Gratis, tanpa pendaftaran, tanpa instalasi"
  },
  de: {
    m_title: "Schöne Schriften - Coole Buchstaben Generator - Kopieren & Einfügen",
    title: "Schöne Schriften",
    meta: "Erstelle schöne und coole Schriften für Instagram, WhatsApp, Free Fire und Discord. Über 30 stylische Schriftarten zum Kopieren und Einfügen.",
    d1: "Verwandle jeden gewöhnlichen Text in etwas Einzigartiges, Dekoratives und voller Persönlichkeit. Dieses Tool generiert Dutzende von Variationen gleichzeitig, mit Schreibschriften, Gothic, Bubble, Monospace, invertierten und vielen anderen Schriftarten, bereit für deine Instagram-Bio, Gaming-Nicks, WhatsApp-Status oder jede andere App, die Text akzeptiert.",
    in_label: "Dein Text",
    plc: "Gib hier deinen Namen, Satz oder Nick ein...",
    preview_text: "Beispiel",
    text: "Text",
    decoration: "Symbole & Ränder:",
    no_deco: "Keine Dekoration",
    copy: "Kopieren",
    clear: "Text löschen",
    copied_announce: "Text in die Zwischenablage kopiert",
    results_label: "Liste der generierten Stile",

    use_cases_title: "Wo du deine benutzerdefinierten Buchstaben verwenden kannst",
    uc_1_title: "Instagram, TikTok und Social Media",
    uc_1_desc: "Hebe deine Bio, Bildunterschrift oder deinen Profilnamen mit dekorativen Schriftarten hervor. Da alles auf universellen Symbolen basiert, funktioniert es direkt, ohne dass eine zusätzliche App installiert werden muss.",
    uc_2_title: "Spitznamen für Online-Spiele",
    uc_2_desc: "Erstelle einzigartige Nicks für Free Fire, Roblox, Fortnite, Valorant und andere. Kombiniere Stile mit dekorativen Rändern für einen auffälligen Look auf deinem Spielerprofil.",
    uc_3_title: "WhatsApp, Telegram und Discord",
    uc_3_desc: "Passe deinen Anzeigenamen, Status, deine Info und Nachrichten an. Die Zeichen funktionieren in fast allen modernen Messaging-Apps.",
    uc_4_title: "Creator-Profile und persönliche Marken",
    uc_4_desc: "Hebe den Namen deines Kanals, Shops oder kreativen Projekts mit einer einzigartigen visuellen Identität hervor. Nützlich für Profile auf TikTok, YouTube, Twitch und Etsy, wo ein markanter Name die Markenbekanntheit stärken kann.",

    how_it_works_title: "So funktioniert der Generator für schöne Buchstaben",
    hiw_1_title: "Tippe oder füge deinen Text ein",
    hiw_1_desc: "Schreibe deinen Namen, Satz oder Nick in das Hauptfeld. Die Ergebnisse erscheinen automatisch in über 30 verschiedenen Stilen, ohne dass du auf Generieren klicken musst.",
    hiw_2_title: "Füge Ränder und Symbole hinzu (optional)",
    hiw_2_desc: "Verwende die Dekorationsauswahl, um den Text mit Rahmen aus Sternen, Herzen, Wellen und anderen Ornamenten zu versehen. Kombiniere die Stile, bis du den perfekten Look gefunden hast.",
    hiw_3_title: "Kopieren und einfügen, wo immer du willst",
    hiw_3_desc: "Klicke auf das Symbol neben dem Stil, der dir am besten gefallen hat. Der Text wird direkt in die Zwischenablage kopiert und kann in dein soziales Netzwerk, Spiel oder deine App eingefügt werden.",

    styles_title: "Verfügbare Buchstabenstile",
    styles_intro: "Das Tool deckt die wichtigsten Unicode-Schriftkategorien ab, die in sozialen Medien und Spielen verwendet werden. Sieh dir unten an, wofür jede steht:",
    st_cursive: "Kursiv & Skript",
    st_cursive_d: "Imitieren eine elegante und fließende Handschrift. Ideal für anspruchsvolle Bios, Künstlernamen und digitale Einladungen.",
    st_gothic: "Gothic & Fraktur",
    st_gothic_d: "Kräftige Striche, inspiriert von mittelalterlichen Manuskripten. Eine gute Wahl für einen Look mit Gewicht, Tradition oder einem Heavy-Metal-Touch.",
    st_bubble: "Blase (Bubble)",
    st_bubble_d: "Runde und lustige Buchstaben, die wie aufgeblasene Blasen aussehen. Funktionieren gut in zwanglosen Nachrichten und verspielten Profilen.",
    st_square: "Quadratisch (Square)",
    st_square_d: "Zeichen innerhalb quadratischer Rahmen, die einen geometrischen und modernen Look erzeugen, der häufig in Spiele-Nicks verwendet wird.",
    st_mono: "Monospace (Retro)",
    st_mono_d: "Jedes Zeichen nimmt genau den gleichen Platz ein, was an Schreibmaschinen und Terminals erinnert. Klare und minimalistische Ästhetik.",
    st_invert: "Invertiert & Gespiegelt",
    st_invert_d: "Text auf den Kopf gestellt oder reflektiert. Nützlich für ungewöhnliche visuelle Effekte und Streiche in Netzwerken.",
    st_manga: "Manga",
    st_manga_d: "Inspiriert von der Typografie japanischer Comics, mit dynamischen Strichen, die dem Text Bewegung verleihen.",
    st_zalgo: "Zalgo & Glitch",
    st_zalgo_d: "Beschädigter Texteffekt, bei dem sich Symbole überlagern und ein chaotisches Netz bilden. Passt zur Horror-, Mystery- und Cyberpunk-Ästhetik.",

    unicode_title: "Warum diese Buchstaben auf jeder Plattform funktionieren",
    unicode_p1: "Obwohl sie wie spezielle Schriftarten aussehen, sind diese Buchstaben im technischen Sinne keine Schriftarten. Es handelt sich um echte Zeichen des Unicode-Standards, demselben universellen System, das auch Emojis und Alphabete weltweit definiert. Deshalb sieht das Ergebnis auf Android, iPhone, Windows oder Mac gleich aus, ohne dass etwas installiert werden muss.",
    unicode_p2: "Da jedes Zeichen ein unabhängiges Symbol ist, kann der Text in jedes Feld eingefügt werden, das normale Schrift akzeptiert: Instagram-Bio, WhatsApp-Name, Discord-Info, Spiel-Nicks und sogar Formulare. Die einzige Einschränkung tritt auf, wenn die App bestimmte Unicode-Blöcke aus Moderations- oder Sicherheitsgründen blockiert.",

    faq_title: "Fragen und Antworten",
    faq_1_q: "Wie füge ich verschiedene Buchstaben auf Instagram ein?",
    faq_1_a: "Öffne Instagram, gehe zu Profil bearbeiten und füge den gestylten Text in das Name- oder Bio-Feld ein. Da die Zeichen universelles Unicode sind — derselbe Standard wie Emojis — erscheinen sie automatisch, ohne dass etwas installiert werden muss. Für Bildunterschriften und Stories einfach kopieren und einfügen.",
    faq_2_q: "Funktionieren verschiedene Buchstaben auf TikTok?",
    faq_2_a: "Ja. TikTok akzeptiert Unicode-Zeichen im Benutzernamen, der Bio und Videobeschreibungen. Füge den kopierten Text direkt in die Textfelder der App ein. Die einzige Einschränkung ist, wenn TikTok bestimmte Unicode-Blöcke in Benutzernamen blockiert — in diesem Fall probiere einen anderen Stil.",
    faq_3_q: "Wie erstelle ich einen stylischen Spitznamen?",
    faq_3_a: "Gib den gewünschten Namen in das Feld des Tools ein, wähle einen Stil, der zu deinem Spiel oder Profil passt, und kopiere mit einem Klick. Für Spiele wie Free Fire, Roblox und Fortnite funktionieren gotische, quadratische oder mit dekorativen Rändern verzierte Stile sehr gut. Tipp: Kombiniere einen Buchstabenstil mit einem Rahmen für einen noch auffälligeren Look.",

    see1: "Symbol-Auswahl",
    see2: "Unsichtbares Zeichen",
    see3: "ASCII-Generator",
    see4: "Kaomoji-Auswahl",

    f_1: "Über 30 benutzerdefinierte Buchstabenstile",
    f_2: "Schnelles Kopieren mit 1 Klick",
    f_3: "Kompatibel mit Instagram, WhatsApp, Discord und Spielen",
    f_4: "Kostenlos, keine Anmeldung, keine Installation"
  },
  nl: {
    m_title: "Mooie Letters - Coole Lettertypen Generator - Kopiëren & Plakken",
    title: "Mooie Letters",
    meta: "Maak verschillende en coole letters voor Instagram, WhatsApp, Free Fire en Discord. Meer dan 30 gestileerde lettertypen om te kopiëren en plakken.",
    d1: "Transformeer elke gewone tekst in iets unieks, decoratiefs en vol persoonlijkheid. Deze tool genereert tientallen variaties tegelijk, met cursieve, gotische, bubbel, monospace, omgekeerde en vele andere lettertypen, klaar voor gebruik in je Instagram-bio, gaming-nicks, WhatsApp-status of elke andere app die tekst accepteert.",
    in_label: "Jouw tekst",
    plc: "Typ hier je naam, zin of nick...",
    preview_text: "Voorbeeld",
    text: "Tekst",
    decoration: "Symbolen & Randen:",
    no_deco: "Geen decoratie",
    copy: "Kopiëren",
    clear: "Tekst wissen",
    copied_announce: "Tekst naar het klembord gekopieerd",
    results_label: "Lijst met gegenereerde stijlen",

    use_cases_title: "Waar je je aangepaste letters kunt gebruiken",
    uc_1_title: "Instagram, TikTok en sociale media",
    uc_1_desc: "Laat je bio, bijschrift of profielnaam opvallen met decoratieve lettertypen. Omdat alles gebaseerd is op universele symbolen, werkt het direct zonder een extra app te hoeven installeren.",
    uc_2_title: "Bijnamen voor online games",
    uc_2_desc: "Maak unieke nicks voor Free Fire, Roblox, Fortnite, Valorant en andere. Combineer stijlen met decoratieve randen voor een opvallende look op je spelersprofiel.",
    uc_3_title: "WhatsApp, Telegram en Discord",
    uc_3_desc: "Pas je weergavenaam, status, info en berichten aan. De tekens werken in vrijwel alle moderne berichten-apps.",
    uc_4_title: "Creator-profielen en persoonlijke merken",
    uc_4_desc: "Laat de naam van je kanaal, winkel of creatief project opvallen met een unieke visuele identiteit. Handig voor profielen op TikTok, YouTube, Twitch en Etsy, waar een herkenbare naam de merkbekendheid kan versterken.",

    how_it_works_title: "Hoe de generator voor mooie letters werkt",
    hiw_1_title: "Typ of plak je tekst",
    hiw_1_desc: "Schrijf je naam, zin of nick in het hoofdveld. De resultaten verschijnen automatisch in meer dan 30 verschillende stijlen, zonder dat je op genereren hoeft te klikken.",
    hiw_2_title: "Voeg randen en symbolen toe (optioneel)",
    hiw_2_desc: "Gebruik de decoratieselector om de tekst in te wikkelen met kaders van sterren, harten, golven en andere ornamenten. Combineer stijlen tot je de perfecte look vindt.",
    hiw_3_title: "Kopiëren en plakken waar je maar wilt",
    hiw_3_desc: "Klik op het icoon naast de stijl die je het mooist vond. De tekst gaat direct naar het klembord, klaar om te plakken in je sociale netwerk, game of app.",

    styles_title: "Beschikbare letterstijlen",
    styles_intro: "De tool dekt de belangrijkste Unicode-lettertypecategorieën die worden gebruikt in sociale media en games. Bekijk hieronder wat elke categorie vertegenwoordigt:",
    st_cursive: "Cursief & Script",
    st_cursive_d: "Imiteren een elegant en vloeiend handschrift. Ideaal voor geavanceerde bio's, artiestennamen en digitale uitnodigingen.",
    st_gothic: "Gotisch & Fraktur",
    st_gothic_d: "Sterke streken geïnspireerd op middeleeuwse manuscripten. Een goede keuze voor een look met gewicht, traditie of een heavy metal-vibe.",
    st_bubble: "Bubbel",
    st_bubble_d: "Ronde en leuke letters, die eruitzien als opgeblazen bubbels. Werken goed in informele berichten en speelse profielen.",
    st_square: "Vierkant",
    st_square_d: "Tekens in vierkante kaders, wat een geometrische en moderne look creëert die vaak in game-nicks wordt gebruikt.",
    st_mono: "Monospace (Retro)",
    st_mono_d: "Elk teken neemt precies dezelfde ruimte in beslag, wat doet denken aan typemachines en terminals. Strakke en minimalistische esthetiek.",
    st_invert: "Omgekeerd & Gespiegeld",
    st_invert_d: "Tekst ondersteboven of weerspiegeld. Handig voor ongebruikelijke visuele effecten en grapjes op netwerken.",
    st_manga: "Manga",
    st_manga_d: "Geïnspireerd door de typografie van Japanse strips, met dynamische streken die beweging aan de tekst geven.",
    st_zalgo: "Zalgo & Glitch",
    st_zalgo_d: "Gecorrumpeerd teksteffect, met overlappende symbolen die een chaotisch web vormen. Past bij de horror-, mysterie- en cyberpunk-esthetiek.",

    unicode_title: "Waarom deze letters op elk platform werken",
    unicode_p1: "Hoewel ze eruitzien als speciale lettertypen, zijn deze letters in technische zin geen lettertypen. Het zijn echte tekens van de Unicode-standaard, hetzelfde universele systeem dat emoji's en alfabetten wereldwijd definieert. Daarom ziet het resultaat er op Android, iPhone, Windows of Mac hetzelfde uit, zonder dat je iets hoeft te installeren.",
    unicode_p2: "Omdat elk teken een onafhankelijk symbool is, kan de tekst worden geplakt in elk veld dat gewone tekst accepteert: Instagram-bio, WhatsApp-naam, Discord-info, game-nicks en zelfs formulieren. De enige beperking doet zich voor wanneer de app bepaalde Unicode-blokken blokkeert om moderatie- of veiligheidsredenen.",

    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Hoe zet je verschillende letters op Instagram?",
    faq_1_a: "Open Instagram, ga naar Profiel bewerken en plak de gestileerde tekst in het naam- of bio-veld. Omdat de tekens universeel Unicode zijn — dezelfde standaard als emoji's — verschijnen ze automatisch zonder dat je iets hoeft te installeren. Voor bijschriften en Stories kun je gewoon kopiëren en plakken.",
    faq_2_q: "Werken verschillende letters op TikTok?",
    faq_2_a: "Ja. TikTok accepteert Unicode-tekens in de gebruikersnaam, bio en videobijschriften. Plak de gekopieerde tekst direct in de tekstvelden van de app. De enige beperking is wanneer TikTok bepaalde Unicode-blokken in gebruikersnamen blokkeert — probeer in dat geval een andere stijl.",
    faq_3_q: "Hoe maak je een gestileerde bijnaam?",
    faq_3_a: "Typ de gewenste naam in het veld van de tool, kies een stijl die past bij je game of profiel en kopieer met één klik. Voor games zoals Free Fire, Roblox en Fortnite werken gotische, vierkante of met decoratieve randen versierde stijlen heel goed. Tip: combineer een letterstijl met een rand voor een nog opvallendere look.",

    see1: "Symbool-kiezer",
    see2: "Onzichtbaar Teken",
    see3: "ASCII-generator",
    see4: "Kaomoji-kiezer",

    f_1: "Meer dan 30 aangepaste letterstijlen",
    f_2: "Snel 1-klik kopiëren",
    f_3: "Compatibel met Instagram, WhatsApp, Discord en games",
    f_4: "Gratis, zonder aanmelden, geen installatie"
  }
}
</i18n>