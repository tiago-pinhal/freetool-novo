<script setup lang="ts">
import { dfs, f1, f2, f3, f4, f5, d1 } from '~/assets/js/fonts.js'

const { t } = useI18n({ useScope: 'local' })

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

useHead({
  title: t('m_title'),
  meta: [{ name: 'description', content: t('meta') }]
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
  { name: 'st_cursive',  desc: 'st_cursive_d'  },
  { name: 'st_gothic',   desc: 'st_gothic_d'   },
  { name: 'st_bubble',   desc: 'st_bubble_d'   },
  { name: 'st_square',   desc: 'st_square_d'   },
  { name: 'st_mono',     desc: 'st_mono_d'     },
  { name: 'st_invert',   desc: 'st_invert_d'   },
  { name: 'st_manga',    desc: 'st_manga_d'    },
  { name: 'st_zalgo',    desc: 'st_zalgo_d'    }
]

const state = reactive({
  text: '',
  letters: [] as string[],
  decorations: d1.replaceAll('t', t('text')).split('&') as string[],
  selectedDecoration: null as string | null,
  copiedIndex: null as number | null
})

function convert(text: string) {
  const raw = text.trim()
  const src = raw === '' ? 'FreeTool' : raw
  const noAccents = src.normalize('NFD').replace(/[̀-ͯ]/g, '')
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

async function copy(text: string, index: number) {
  try {
    await navigator.clipboard.writeText(text)
    state.copiedIndex = index
    setTimeout(() => { state.copiedIndex = null }, 2000)
  } catch {}
}

defineI18nRoute({
  paths: {
    en: '/fancy-letters',
    pt: '/letras-diferentes',
    es: '/letras-diferentes',
    fr: '/lettres-differentes',
    it: '/lettere-diverse',
    id: '/huruf-berbeda'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.text.length > 0"
    :see-also-links="[
      { label: t('see1'), to: 'url-encoder-decoder' },
      { label: t('see2'), to: 'password-generator' },
      { label: t('see3'), to: 'list-randomizer' },
      { label: t('see4'), to: 'email-extractor' }
    ]"
  >
    <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Input -->
      <div class="form-control w-full">
        <label for="fancy-input" class="label">
          <span class="label-text font-bold text-base-content">{{ t('in_label') }}</span>
        </label>
        <input
          id="fancy-input"
          v-model="state.text"
          type="text"
          class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl"
          :placeholder="t('plc')"
          autofocus
        />
      </div>

      <!-- Decoration Select -->
      <div class="form-control w-full sm:w-fit">
        <label for="decoration-select" class="label">
          <span class="label-text font-semibold text-base-content">{{ t('decoration') }}</span>
        </label>
        <select
          id="decoration-select"
          v-model="state.selectedDecoration"
          class="select select-bordered bg-base-200 rounded-2xl w-full sm:w-auto"
        >
          <option :value="null">{{ t('no_deco') }}</option>
          <option v-for="dec in state.decorations" :key="dec" :value="dec">{{ dec }}</option>
        </select>
      </div>

      <!-- Results — height fixo elimina CLS -->
      <ul
        class="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm overflow-y-auto"
        style="height: 420px"
        aria-label="Resultados"
      >
        <li
          v-for="(letter, i) in state.letters"
          :key="i"
          class="flex items-center gap-3 px-4 py-3 hover:bg-base-200/60 transition-colors border-b border-base-content/5 last:border-0"
        >
          <span class="flex-1 break-all leading-relaxed select-all">{{ letter }}</span>
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

    </div>

    <template #info>
      <div class="space-y-8">

        <p>{{ t('d1') }}</p>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') }
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

        <!-- Glossário de Estilos -->
        <div>
          <h2 class="text-xl font-bold mb-4">{{ t('styles_title') }}</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="style in fontStyles"
              :key="style.name"
              class="flex gap-2"
            >
              <span class="text-primary font-bold shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <p class="text-sm">
                <strong>{{ t(style.name) }}:</strong>
                {{ t(style.desc) }}
              </p>
            </div>
          </div>
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

        <!-- Lista de fontes para SEO -->
        <div>
          <p class="text-sm font-semibold mb-1 text-base-content/70">{{ t('fonts_included') }}</p>
          <p class="text-xs text-base-content/40 leading-relaxed">{{ t('fonts_list') }}</p>
        </div>

      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    m_title: "Gerador de Letras Diferentes Online – Copiar e Colar Grátis",
    title: "Letras Diferentes e Bonitas",
    meta: "Gere letras diferentes e bonitas para copiar e colar no Instagram, WhatsApp, Facebook e Discord. Mais de 30 estilos: cursiva, gótica, negrito, zalgo e outros.",
    d1: "Este gerador de letras diferentes usa caracteres Unicode para transformar qualquer texto em dezenas de estilos únicos — cursiva, gótica, negrito, monoespaçado, invertido, zalgo e muito mais. O resultado pode ser copiado e colado em qualquer lugar: bios do Instagram, status do WhatsApp, nicknames de jogos ou qualquer editor de texto.",
    in_label: "Seu texto",
    plc: "Digite seu nome, frase ou nick aqui...",
    text: "Texto",
    decoration: "Decoração",
    no_deco: "Sem decoração",
    copy: "Copiar",
    use_cases_title: "Para que servem as letras diferentes",
    uc_1_title: "Instagram, TikTok e Facebook",
    uc_1_desc: "Destaque sua bio, legenda ou nome de perfil com fontes decorativas que chamam atenção. Como são caracteres Unicode padrão, funcionam em qualquer plataforma sem instalar nada.",
    uc_2_title: "Nicknames para Jogos",
    uc_2_desc: "Crie nicks únicos para Free Fire, Roblox, Fortnite, Valorant e outros jogos. Combine estilos com os símbolos decorativos para um nick ainda mais exclusivo.",
    uc_3_title: "WhatsApp, Discord e Mensagens",
    uc_3_desc: "Deixe seus status, nomes de grupo e mensagens com um visual diferente. Os caracteres funcionam em qualquer app que suporte Unicode — ou seja, praticamente todos.",
    how_it_works_title: "Como usar o gerador de letras diferentes",
    hiw_1_title: "Digite ou cole o texto",
    hiw_1_desc: "Escreva seu nome, nick ou frase no campo acima. Os resultados aparecem automaticamente em todos os estilos disponíveis.",
    hiw_2_title: "Escolha uma decoração (opcional)",
    hiw_2_desc: "Use o seletor de símbolos para adicionar bordas ou efeitos decorativos ao redor do texto. Experimente até encontrar o estilo certo.",
    hiw_3_title: "Copie e cole onde quiser",
    hiw_3_desc: "Clique no ícone de copiar ao lado do estilo preferido e cole direto no Instagram, WhatsApp, Discord ou onde precisar.",
    styles_title: "Estilos de letras disponíveis",
    st_cursive: "Cursiva / Script",
    st_cursive_d: "Imita uma caligrafia elegante com letras fluidas. Perfeita para bios sofisticadas e convites digitais.",
    st_gothic: "Gótico / Fraktur",
    st_gothic_d: "Traços ousados inspirados nos manuscritos medievais. Transmitem tradição e personalidade marcante.",
    st_bubble: "Bolha",
    st_bubble_d: "Letras com formato arredondado, semelhante a bolhas infladas. Ideal para designs divertidos e descontraídos.",
    st_square: "Quadrado",
    st_square_d: "Caracteres em molduras quadradas com visual geométrico moderno, muito usado em nicknames e títulos.",
    st_mono: "Monoespaçado",
    st_mono_d: "Espaçamento fixo por caractere, com visual técnico e limpo. Ótimo para estéticas minimalistas.",
    st_invert: "Invertido",
    st_invert_d: "Letras viradas de cabeça para baixo ou espelhadas, criando um efeito visual inusitado e criativo.",
    st_manga: "Mangá",
    st_manga_d: "Inspirado na tipografia dos quadrinhos japoneses, com traços expressivos e dinâmicos.",
    st_zalgo: "Zalgo / Glitch",
    st_zalgo_d: "Aparência caótica com letras sobrepostas por sinais diacríticos. Muito usado para efeitos corrompidos ou assombrados.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Como fazer letras diferentes para copiar e colar?",
    faq_1_a: "Digite o texto no campo desta ferramenta. Os resultados aparecem automaticamente em mais de 30 estilos. Clique no ícone de copiar ao lado do estilo desejado e cole onde precisar — é só isso.",
    faq_2_q: "As letras diferentes funcionam no Instagram?",
    faq_2_a: "Sim. Todos os estilos gerados usam caracteres Unicode padrão, aceitos nativamente pelo Instagram em bios, nomes de usuário, comentários e legendas.",
    faq_3_q: "Posso usar letras diferentes no WhatsApp?",
    faq_3_a: "Sim. O WhatsApp suporta Unicode, então basta copiar o texto estilizado e colar diretamente em mensagens, nome do perfil ou status.",
    faq_4_q: "As letras diferentes funcionam em nicknames de jogos?",
    faq_4_a: "Depende do jogo. Free Fire, Roblox, Fortnite e vários outros aceitam caracteres Unicode em nicknames. Alguns jogos mais restritos podem aceitar apenas caracteres padrão.",
    faq_5_q: "Preciso instalar algum aplicativo ou fonte especial?",
    faq_5_a: "Não. Os caracteres gerados fazem parte do padrão Unicode, já presente em todos os sistemas operacionais e dispositivos modernos. Não é necessário instalar nada.",
    fonts_included: "Fontes incluídas neste gerador",
    fonts_list: "Negrito Serifado, Negrito Itálico, Sans-Serif, Sans-Serif Itálico, Sans-Serif Negrito, Sans-Serif Negrito Itálico, Script Cursivo, Script Negrito, Fraktur Gótico, Fraktur Negrito, Double-Struck Contorno, Quadrado, Quadrado Negativo, Circulado, Circulado Negativo, Entre Parênteses, Cherokee, Etíope, Mistura Grega, Acentos Agudos, Trema, Letras Riscadas, Invertido, Símbolos de Moeda, Mistura Grego/Coreano, Mistura Cirílico, Silabário Aborígene Canadense, CJK Estético, Monoespaçado, Versalete, Leet Speak, Sobrescrito, Largura Total, Zalgo Glitch, Decoração Sublinhada, Decoração Tachada, Decoração em Onda, Bordas com Estrelas, Bordas com Corações, Bordas com Notas Musicais, Bordas com Brilhos",
    see1: "Codificador de URL",
    see2: "Gerador de Senhas",
    see3: "Randomizador de Listas",
    see4: "Extrator de E-mails",
    f_1: "Mais de 30 estilos de letras Unicode",
    f_2: "Copiar e colar com um clique",
    f_3: "Funciona no Instagram, WhatsApp, Discord e jogos",
    f_4: "Gratuito, sem cadastro e sem instalação"
  }
}
</i18n>
