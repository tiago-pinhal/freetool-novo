<script setup lang="ts">
import { Moon, Hemisphere, LunarPhase } from 'lunarphase-js'

const { t, locale } = useI18n({ useScope: 'local' })

const PRINCIPAL_PHASES: readonly LunarPhase[] = [
  LunarPhase.NEW,
  LunarPhase.FIRST_QUARTER,
  LunarPhase.FULL,
  LunarPhase.LAST_QUARTER,
]

const PHASE_KEY_MAP: Record<LunarPhase, string> = {
  [LunarPhase.NEW]: 'new_moon',
  [LunarPhase.WAXING_CRESCENT]: 'waxing_crescent',
  [LunarPhase.FIRST_QUARTER]: 'first_quarter',
  [LunarPhase.WAXING_GIBBOUS]: 'waxing_gibbous',
  [LunarPhase.FULL]: 'full_moon',
  [LunarPhase.WANING_GIBBOUS]: 'waning_gibbous',
  [LunarPhase.LAST_QUARTER]: 'last_quarter',
  [LunarPhase.WANING_CRESCENT]: 'waning_crescent',
}

const SOUTHERN_LOCALES = ['pt', 'id']
const defaultHemisphere = SOUTHERN_LOCALES.includes(locale.value)
  ? Hemisphere.SOUTHERN
  : Hemisphere.NORTHERN

const hemisphere = ref<Hemisphere>(defaultHemisphere)
const today = ref(new Date())

let midnightTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  today.value = new Date()

  const saved = localStorage.getItem('moon-hemisphere')
  if (saved === Hemisphere.NORTHERN || saved === Hemisphere.SOUTHERN) {
    hemisphere.value = saved
  }

  const scheduleMidnightRefresh = () => {
    const msUntilMidnight = new Date().setHours(24, 0, 0, 0) - Date.now()
    midnightTimer = setTimeout(() => {
      today.value = new Date()
      scheduleMidnightRefresh()
    }, msUntilMidnight)
  }

  scheduleMidnightRefresh()
})

onUnmounted(() => {
  if (midnightTimer) {
    clearTimeout(midnightTimer)
  }
})

watch(hemisphere, (value) => {
  if (import.meta.client) {
    localStorage.setItem('moon-hemisphere', value)
  }
})

const phase = computed(() => Moon.lunarPhase(today.value))
const age = computed(() => Moon.lunarAge(today.value))
const agePercent = computed(() => Moon.lunarAgePercent(today.value))
const lunationNumber = computed(() => Moon.lunationNumber(today.value))
const isWaxing = computed(() => Moon.isWaxing(today.value))
const emoji = computed(() => Moon.lunarPhaseEmoji(today.value, { hemisphere: hemisphere.value }))

const illumination = computed(() => {
  const raw = (1 - Math.cos(2 * Math.PI * agePercent.value)) / 2
  return Math.round(raw * 100)
})

// Small bounded linear scan (~720 checks max + minute refinement)
const next = computed(() => {
  const current = phase.value
  const startMs = today.value.getTime()

  const ONE_HOUR = 3_600_000
  const ONE_MINUTE = 60_000
  const ONE_DAY = 24 * ONE_HOUR

  for (let h = 1; h <= 24 * 30; h++) {
    const coarse = new Date(startMs + h * ONE_HOUR)
    const coarsePhase = Moon.lunarPhase(coarse)

    if (
      coarsePhase !== current &&
      PRINCIPAL_PHASES.includes(coarsePhase)
    ) {
      const baseMs = startMs + (h - 1) * ONE_HOUR

      for (let m = 0; m < 60; m++) {
        const precise = new Date(baseMs + m * ONE_MINUTE)
        const precisePhase = Moon.lunarPhase(precise)

        if (precisePhase === coarsePhase) {
          const diffMs = precise.getTime() - startMs

          const days = Math.floor(diffMs / ONE_DAY)
          const hours = Math.floor((diffMs % ONE_DAY) / ONE_HOUR)
          const minutes = Math.floor((diffMs % ONE_HOUR) / ONE_MINUTE)

          return {
            days,
            hours,
            minutes,
            phase: precisePhase,
          }
        }
      }
    }
  }

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    phase: null,
  }
})

const phaseName = computed(() => t(PHASE_KEY_MAP[phase.value]))

const nextPhaseName = computed(() => {
  if (!next.value.phase) {
    return t('unknown_phase')
  }
  return t(PHASE_KEY_MAP[next.value.phase])
})

const illuminationText = computed(() => {
  if (phase.value === LunarPhase.FULL) {
    return t('illumination_full', { pct: illumination.value })
  }
  if (phase.value === LunarPhase.NEW) {
    return t('illumination_new')
  }
  return t('illumination', {
    pct: illumination.value,
    direction: isWaxing.value ? t('growing') : t('shrinking'),
  })
})

const formattedAge = computed(() =>
  new Intl.NumberFormat(locale.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(age.value)
)

const moonAgeText = computed(() => {
  const rounded = parseFloat(age.value.toFixed(1))
  const key = rounded === 1.0 ? 'moon_age_value_singular' : 'moon_age_value_plural'
  return t(key, { days: formattedAge.value })
})

const nextPhaseText = computed(() => {
  const d = next.value.days
  const h = next.value.hours
  const m = next.value.minutes
  const phaseStr = nextPhaseName.value

  let timeStr = ''
  if (d > 0) {
    const dStr = d === 1 ? t('day_singular') : t('day_plural', { n: d })
    if (h > 0) {
      const hStr = h === 1 ? t('hour_singular') : t('hour_plural', { n: h })
      timeStr = `${dStr} ${t('connector')} ${hStr}`
    } else {
      timeStr = dStr
    }
  } else if (h > 0) {
    const hStr = h === 1 ? t('hour_singular') : t('hour_plural', { n: h })
    if (m > 0) {
      const mStr = m === 1 ? t('minute_singular') : t('minute_plural', { n: m })
      timeStr = `${hStr} ${t('connector')} ${mStr}`
    } else {
      timeStr = hStr
    }
  } else if (m > 0) {
    timeStr = m === 1 ? t('minute_singular') : t('minute_plural', { n: m })
  } else {
    timeStr = t('less_than_minute')
  }

  const isSingular = d === 1 || (d === 0 && h === 1 && m === 0) || (d === 0 && h === 0 && m <= 1)
  const hasSingularKey = ['pt', 'es', 'it'].includes(locale.value)
  if (hasSingularKey) {
    const key = isSingular ? 'next_phase_singular' : 'next_phase_plural'
    return t(key, { time: timeStr, phase: phaseStr })
  }

  return t('next_phase', { time: timeStr, phase: phaseStr })
})

const formattedDate = computed(() =>
  new Intl.DateTimeFormat(locale.value, { dateStyle: 'full' }).format(today.value)
)

// --- SEO ---

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') },
  ],
})

useHead({
  title: t('pageTitle'),
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:title', content: t('pageTitle') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ],
})

const moonPhasesList = computed(() => [
  { id: 'new', emoji: '🌑', name: t('p_new_title'), description: t('p_new_desc') },
  { id: 'waxing_crescent', emoji: '🌒', name: t('p_wc_title'), description: t('p_wc_desc') },
  { id: 'first_quarter', emoji: '🌓', name: t('p_fq_title'), description: t('p_fq_desc') },
  { id: 'waxing_gibbous', emoji: '🌔', name: t('p_wg_title'), description: t('p_wg_desc') },
  { id: 'full', emoji: '🌕', name: t('p_full_title'), description: t('p_full_desc') },
  { id: 'waning_gibbous', emoji: '🌖', name: t('p_wng_title'), description: t('p_wng_desc') },
  { id: 'last_quarter', emoji: '🌗', name: t('p_lq_title'), description: t('p_lq_desc') },
  { id: 'waning_crescent', emoji: '🌘', name: t('p_wnc_title'), description: t('p_wnc_desc') }
])

defineI18nRoute({
  paths: {
    en: '/moon-phase',
    pt: '/fase-da-lua',
    es: '/fase-de-la-luna',
    fr: '/phase-de-la-lune',
    it: '/fase-della-luna',
    id: '/fase-bulan',
    de: '/mondphase',
    nl: '/maanstand',
    ru: '/faza-luny',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :see-also-links="[
      { label: t('see1'), to: 'age-calculator' },
      { label: t('see2'), to: 'date-difference' },
      { label: t('see3'), to: 'future-date-calculator' },
      { label: t('see4'), to: 'unix-timestamp-converter' }
    ]"
  >
    <div class="flex flex-col items-center gap-8 py-10">

      <!-- Moon emoji + phase -->
      <ClientOnly>
        <div class="text-center">
          <div class="text-[8rem] leading-none mb-5 select-none" :aria-label="phaseName">
            {{ emoji }}
          </div>
          <h2 class="text-3xl font-black text-primary mb-3">{{ phaseName }}</h2>
          <p class="text-lg text-base-content/80 max-w-md">{{ illuminationText }}</p>
          <p class="text-base text-base-content/50 mt-2">{{ nextPhaseText }}</p>
          <p class="text-sm text-base-content/40 mt-3">
            <time :datetime="today.toISOString()">{{ formattedDate }}</time>
            <span class="mx-2">·</span>
            <span>{{ t('lunation', { n: lunationNumber }) }}</span>
          </p>
        </div>

        <template #fallback>
          <div class="text-center">
            <div class="text-[8rem] leading-none mb-5 select-none">🌙</div>
            <h2 class="text-3xl font-black text-primary mb-3">{{ t('title') }}</h2>
            <p class="text-lg text-base-content/80 max-w-md">{{ t('loading') }}</p>
          </div>
        </template>
      </ClientOnly>

      <!-- Moon age stat -->
      <ClientOnly>
        <div class="bg-base-200/60 border border-primary/10 rounded-2xl px-8 py-4 text-center">
          <p class="text-xs text-base-content/40 uppercase tracking-widest mb-1">{{ t('moon_age') }}</p>
          <p class="font-bold text-base-content">{{ moonAgeText }}</p>
        </div>
      </ClientOnly>

      <!-- Hemisphere toggle -->
      <div class="flex flex-col items-center gap-2">
        <span class="text-sm font-medium text-base-content/50">{{ t('hemisphere') }}</span>
        <div
          role="group"
          :aria-label="t('hemisphere')"
          class="flex bg-base-300/30 p-1 rounded-xl border border-base-content/10 gap-1 min-w-[200px]"
        >
          <button
            type="button"
            :aria-pressed="hemisphere === Hemisphere.NORTHERN"
            class="btn btn-sm flex-1 rounded-lg transition-all duration-200 border-none"
            :class="hemisphere === Hemisphere.NORTHERN ? 'btn-primary font-bold shadow-sm' : 'btn-ghost text-base-content/60 hover:bg-base-200/50'"
            @click="hemisphere = Hemisphere.NORTHERN"
          >
            {{ t('northern') }}
          </button>
          <button
            type="button"
            :aria-pressed="hemisphere === Hemisphere.SOUTHERN"
            class="btn btn-sm flex-1 rounded-lg transition-all duration-200 border-none"
            :class="hemisphere === Hemisphere.SOUTHERN ? 'btn-primary font-bold shadow-sm' : 'btn-ghost text-base-content/60 hover:bg-base-200/50'"
            @click="hemisphere = Hemisphere.SOUTHERN"
          >
            {{ t('southern') }}
          </button>
        </div>
      </div>

    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('how_desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[t('uc1'), t('uc2'), t('uc3'), t('uc4')]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <!-- Moon phases explanation section -->
        <section class="space-y-6">
          <div class="flex items-center gap-4 mb-6">
            <h2 class="text-2xl font-bold text-base-content">{{ t('explain_title') }}</h2>
            <div class="h-px flex-1 bg-base-content/10"></div>
          </div>
          <p class="text-base-content/80 text-sm sm:text-base leading-relaxed">
            {{ t('explain_desc') }}
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              v-for="phase in moonPhasesList" 
              :key="phase.id"
              class="bg-base-200/50 border border-primary/5 hover:border-primary/20 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 group"
            >
              <div class="text-5xl mb-4 select-none transform group-hover:scale-110 transition-transform duration-300">
                {{ phase.emoji }}
              </div>
              <h3 class="font-extrabold text-base text-primary mb-2 group-hover:text-secondary transition-colors duration-300">
                {{ phase.name }}
              </h3>
              <p class="text-xs text-base-content/70 leading-relaxed">
                {{ phase.description }}
              </p>
            </div>
          </div>
        </section>

        <!-- Explanation of Illumination and Moon Age -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div class="bg-base-200/40 border border-primary/5 hover:border-primary/20 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl select-none group-hover:animate-pulse" role="img" aria-hidden="true">☀️</span>
              <h3 class="text-xl font-bold text-base-content group-hover:text-primary transition-colors duration-300">{{ t('illus_term_title') }}</h3>
            </div>
            <p class="text-sm text-base-content/75 leading-relaxed">
              {{ t('illus_term_desc') }}
            </p>
          </div>

          <div class="bg-base-200/40 border border-primary/5 hover:border-primary/20 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl select-none group-hover:animate-spin" style="animation-duration: 4s;" role="img" aria-hidden="true">🔄</span>
              <h3 class="text-xl font-bold text-base-content group-hover:text-primary transition-colors duration-300">{{ t('age_term_title') }}</h3>
            </div>
            <p class="text-sm text-base-content/75 leading-relaxed">
              {{ t('age_term_desc') }}
            </p>
          </div>
        </section>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq1q'), answer: t('faq1a') },
            { question: t('faq2q'), answer: t('faq2a') },
            { question: t('faq3q'), answer: t('faq3a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "Moon Phase Today — What Is the Moon Phase Right Now? | Free",
    title: "Moon Phase Today",
    meta: "Check the current moon phase and lunar phase tonight: new moon, crescent, full moon or waning. See the illumination percentage and countdown to the next phase.",
    loading: "Calculating today's moon phase…",
    lunation: "Lunation #{n}",
    new_moon: "New Moon",
    waxing_crescent: "Waxing Crescent",
    first_quarter: "First Quarter",
    waxing_gibbous: "Waxing Gibbous",
    full_moon: "Full Moon",
    waning_gibbous: "Waning Gibbous",
    last_quarter: "Last Quarter",
    waning_crescent: "Waning Crescent",
    unknown_phase: "Unknown Phase",
    growing: "growing",
    shrinking: "shrinking",
    illumination: "Today's moon is {pct}% illuminated and is {direction}.",
    illumination_full: "Today's moon is {pct}% illuminated — peak brightness of the cycle.",
    illumination_new: "The moon is barely visible — the cycle is starting over.",
    day_singular: "1 day",
    day_plural: "{n} days",
    hour_singular: "1 hour",
    hour_plural: "{n} hours",
    minute_singular: "1 minute",
    minute_plural: "{n} minutes",
    connector: "and",
    less_than_minute: "less than 1 minute",
    next_phase: "{time} until the {phase} phase.",
    moon_age: "Moon Age",
    moon_age_value_singular: "1.0 day into the lunar cycle",
    moon_age_value_plural: "{days} days into the lunar cycle",
    hemisphere: "Hemisphere",
    northern: "Northern",
    southern: "Southern",
    features_title: "Features",
    f_1: "Current lunar phase with name and illustration in real time",
    f_2: "Approximate moon illumination percentage",
    f_3: "Countdown to the next principal lunar phase",
    f_4: "Southern hemisphere support (mirrored moon)",
    how_to_use_title: "How to use",
    how_desc: "The tool automatically calculates the moon phase based on today's date, using the average synodic cycle of 29.53 days. All calculations run directly in your browser, with no external server requests.",
    step_1_title: "See the Current Phase",
    step_1_desc: "When you open the page, today's moon phase is displayed automatically with name, illustration, and illumination percentage.",
    step_2_title: "Choose Your Hemisphere",
    step_2_desc: "If you are in the Southern Hemisphere, select 'Southern' to see the moon illustration in the correct orientation.",
    step_3_title: "Check the Next Phase",
    step_3_desc: "See how much time remains until the next principal phase: first quarter, full moon, last quarter, or new moon.",
    use_cases_title: "Use Cases",
    uc1: "Planning rural activities such as planting and harvesting according to the lunar calendar.",
    uc2: "Checking the moon phase for nighttime photography and amateur astronomy.",
    uc3: "Rituals, spiritual practices, and meditations guided by the lunar cycle.",
    uc4: "General curiosity about the moon's cycle and basic astronomical education.",
    faq_title: "Questions & Answers",
    faq1q: "How is the moon phase calculated?",
    faq1a: "The calculation is based on the moon's synodic cycle, which averages 29.53 days. Starting from a known new moon date, we calculate what point in the cycle we are at today to determine the current phase.",
    faq2q: "Why does the moon illustration look different in the Southern Hemisphere?",
    faq2a: "The moon appears mirrored depending on the hemisphere. In Australia and other southern countries, the crescent appears on the opposite side compared to the Northern Hemisphere. That is why we offer a hemisphere toggle.",
    faq3q: "Is the illumination percentage accurate?",
    faq3a: "The illumination shown is a good approximation based on the average lunar cycle. For high-precision astronomical calculations that account for the moon's elliptical orbit, we recommend specialized software.",
    see1: "Age Calculator",
    see2: "Date Difference Calculator",
    see3: "Future Date Calculator",
    see4: "Unix Timestamp Converter",
    explain_title: "Understand the Moon Phases",
    explain_desc: "The lunar cycle (synodic month) lasts about 29.5 days and is divided into 8 distinct phases, reflecting the portion of the Moon illuminated by the Sun from Earth's perspective. Learn about each phase:",
    p_new_title: "New Moon",
    p_new_desc: "The Moon is positioned between the Earth and the Sun. Its illuminated side faces the Sun, making it completely invisible to us in the night sky.",
    p_wc_title: "Waxing Crescent",
    p_wc_desc: "A sliver of light begins to appear on the edge. This marks the start of the Moon's journey from darkness toward full illumination.",
    p_fq_title: "First Quarter",
    p_fq_desc: "Exactly half of the moon's disk is illuminated. The Moon has completed one-quarter of its orbit around the Earth since the New Moon.",
    p_wg_title: "Waxing Gibbous",
    p_wg_desc: "More than half of the Moon's surface is illuminated, growing larger each day but not yet reaching the complete circle of the Full Moon.",
    p_full_title: "Full Moon",
    p_full_desc: "The entire visible face of the Moon is 100% illuminated by the Sun, shining at its peak brightness in the night sky all night long.",
    p_wng_title: "Waning Gibbous",
    p_wng_desc: "After the full phase, the illuminated surface begins to shrink progressively, though more than half of the Moon remains visible.",
    p_lq_title: "Last Quarter",
    p_lq_desc: "The opposite half of the Moon's disk (compared to the First Quarter) is illuminated, marking the final quarter of the lunar orbit cycle.",
    p_wnc_title: "Waning Crescent",
    p_wnc_desc: "Only a thin silver curved sliver of light remains visible. It is the final phase of the cycle before it resets back to a New Moon.",
    illus_term_title: "What is Moon Illumination?",
    illus_term_desc: "Illumination represents the percentage of the Moon's Earth-facing side reflecting sunlight towards Earth. It ranges from 0% (New Moon) to 100% (Full Moon) as the relative positions of Earth, Moon, and Sun change.",
    age_term_title: "What is Moon Age?",
    age_term_desc: "Moon age is the number of days since the last New Moon. Because the complete lunar cycle averages 29.53 days (synodic month), the age ranges from 0 to 29.5 days, telling us exactly where the Moon is in its cycle."
  },
  pt: {
    pageTitle: "Fase da Lua Hoje — Qual é a Fase da Lua Agora? | Grátis",
    title: "Fase da Lua Hoje",
    meta: "Veja a fase da lua hoje e a fase lunar agora: lua nova, crescente, cheia ou minguante. Confira a iluminação e o tempo para a próxima fase.",
    loading: "Calculando a fase da lua de hoje…",
    lunation: "Lunação Nº {n}",
    new_moon: "Lua Nova",
    waxing_crescent: "Lua Crescente",
    first_quarter: "Quarto Crescente",
    waxing_gibbous: "Gibosa Crescente",
    full_moon: "Lua Cheia",
    waning_gibbous: "Gibosa Minguante",
    last_quarter: "Quarto Minguante",
    waning_crescent: "Lua Minguante",
    unknown_phase: "Fase Desconhecida",
    growing: "crescendo",
    shrinking: "minguando",
    illumination: "A lua de hoje está {pct}% iluminada e está {direction}.",
    illumination_full: "A lua de hoje está {pct}% iluminada — pico de brilho do ciclo.",
    illumination_new: "A lua quase não está visível — o ciclo está recomeçando.",
    day_singular: "1 dia",
    day_plural: "{n} dias",
    hour_singular: "1 hora",
    hour_plural: "{n} horas",
    minute_singular: "1 minuto",
    minute_plural: "{n} minutos",
    connector: "e",
    less_than_minute: "menos de 1 minuto",
    next_phase_singular: "Falta {time} para a fase {phase}.",
    next_phase_plural: "Faltam {time} para a fase {phase}.",
    moon_age: "Idade da Lua",
    moon_age_value_singular: "1,0 dia no ciclo lunar",
    moon_age_value_plural: "{days} dias no ciclo lunar",
    hemisphere: "Hemisfério",
    northern: "Norte",
    southern: "Sul",
    features_title: "Funcionalidades",
    f_1: "Fase lunar atual com nome e imagem em tempo real",
    f_2: "Porcentagem aproximada de iluminação da lua",
    f_3: "Contagem regressiva para a próxima fase principal",
    f_4: "Suporte ao hemisfério sul (lua espelhada)",
    how_to_use_title: "Como usar",
    how_desc: "A ferramenta calcula automaticamente a fase da lua com base na data de hoje, usando o ciclo sinódico médio de 29,53 dias. Os cálculos são feitos diretamente no seu navegador, sem nenhuma consulta a servidores externos.",
    step_1_title: "Veja a Fase Atual",
    step_1_desc: "Ao abrir a página, a fase da lua de hoje já é exibida automaticamente com nome, imagem e porcentagem de iluminação.",
    step_2_title: "Escolha o Hemisfério",
    step_2_desc: "Se você está no hemisfério sul (Brasil, por exemplo), selecione 'Sul' para ver a imagem da lua na orientação correta.",
    step_3_title: "Confira a Próxima Fase",
    step_3_desc: "Veja quanto tempo falta para a próxima fase principal: quarto crescente, lua cheia, quarto minguante ou lua nova.",
    use_cases_title: "Casos de Uso",
    uc1: "Planejar atividades rurais como plantio e colheita de acordo com o calendário lunar.",
    uc2: "Conferir a fase da lua para fotografias noturnas e astronomia amadora.",
    uc3: "Rituais, práticas espirituais e meditações guiadas pelo ciclo lunar.",
    uc4: "Curiosidade geral sobre o ciclo da lua e educação astronômica básica.",
    faq_title: "Perguntas e Respostas",
    faq1q: "Como a fase da lua é calculada?",
    faq1a: "O cálculo é feito com base no ciclo sinódico da lua, que dura em média 29,53 dias. Partindo de uma data de lua nova conhecida, calculamos em que ponto do ciclo estamos hoje para determinar a fase atual.",
    faq2q: "Por que a imagem da lua aparece diferente no hemisfério sul?",
    faq2a: "A lua é vista de forma espelhada dependendo do hemisfério. No Brasil e em outros países do sul, a lua crescente aparece do lado oposto ao do hemisfério norte. Por isso oferecemos a opção de selecionar o hemisfério.",
    faq3q: "A porcentagem de iluminação é exata?",
    faq3a: "A iluminação exibida é uma boa aproximação baseada no ciclo lunar médio. Para cálculos astronômicos de alta precisão que considerem a órbita elíptica da lua, recomendamos softwares especializados.",
    see1: "Calculadora de Idade",
    see2: "Calculadora de Diferença de Datas",
    see3: "Calculadora de Data Futura",
    see4: "Conversor de Timestamp Unix",
    explain_title: "Entenda as Fases da Lua",
    explain_desc: "O ciclo lunar (ou ciclo sinódico) dura cerca de 29,5 dias e é dividido em 8 fases principais, refletindo a porção da Lua que é iluminada pelo Sol a partir do ponto de vista da Terra. Conheça as características de cada fase:",
    p_new_title: "Lua Nova",
    p_new_desc: "A Lua está posicionada entre a Terra e o Sol. Sua face iluminada está voltada para o Sol, tornando-a completamente invisível no céu noturno para nós.",
    p_wc_title: "Lua Crescente",
    p_wc_desc: "Uma pequena fração de luz começa a aparecer. É o início da jornada da Lua saindo da fase escura e caminhando em direção à iluminação total.",
    p_fq_title: "Quarto Crescente",
    p_fq_desc: "Metade do disco lunar fica visível e iluminado. A Lua percorreu exatamente um quarto de sua órbita ao redor da Terra desde a Lua Nova.",
    p_wg_title: "Gibosa Crescente",
    p_wg_desc: "Mais da metade da superfície lunar está iluminada, crescendo a cada dia, mas ainda sem atingir a totalidade da Lua Cheia.",
    p_full_title: "Lua Cheia",
    p_full_desc: "Toda a face da Lua visível da Terra está 100% iluminada pelo Sol, brilhando em seu esplendor máximo no céu durante toda a noite.",
    p_wng_title: "Gibosa Minguante",
    p_wng_desc: "Após a fase cheia, a área iluminada começa a diminuir progressivamente no céu, mantendo ainda mais de 50% de seu brilho visível.",
    p_lq_title: "Quarto Minguante",
    p_lq_desc: "A metade oposta do disco lunar (em comparação com o Quarto Crescente) está iluminada, marcando o último quarto de órbita do ciclo lunar.",
    p_wnc_title: "Lua Minguante",
    p_wnc_desc: "Apenas um pequeno arco ou foice de luz permanece visível no céu. É a última etapa antes do recomeço do ciclo com uma nova Lua Nova.",
    illus_term_title: "O que é a Iluminação da Lua?",
    illus_term_desc: "A iluminação (ou luminosidade) representa a porcentagem da face visível da Lua que está recebendo luz solar direta e refletindo-a em direção à Terra. Ela varia continuamente de 0% (Lua Nova) até 100% (Lua Cheia) conforme a Lua orbita nosso planeta.",
    age_term_title: "O que é a Idade da Lua?",
    age_term_desc: "A idade lunar indica o total de dias decorridos desde a última Lua Nova. Como o ciclo completo médio (ciclo sinódico) dura 29,53 dias, esse valor oscila entre 0 e 29,5, indicando o progresso exato da Lua em sua lunação atual."
  },
  es: {
    pageTitle: "Fase de la Luna Hoy — ¿En qué Fase está la Luna Ahora? | Gratis",
    title: "Fase de la Luna Hoy",
    meta: "Consulta la fase de la luna hoy y la fase lunar ahora: luna nueva, creciente, llena o menguante. Ve la iluminación y el tiempo hasta la próxima fase.",
    loading: "Calculando la fase lunar de hoy…",
    lunation: "Lunación Nº {n}",
    new_moon: "Luna Nueva",
    waxing_crescent: "Luna Creciente",
    first_quarter: "Cuarto Creciente",
    waxing_gibbous: "Gibosa Creciente",
    full_moon: "Luna Llena",
    waning_gibbous: "Gibosa Menguante",
    last_quarter: "Cuarto Menguante",
    waning_crescent: "Luna Menguante",
    unknown_phase: "Fase Desconocida",
    growing: "creciendo",
    shrinking: "menguando",
    illumination: "La luna de hoy está {pct}% iluminada y está {direction}.",
    illumination_full: "La luna de hoy está {pct}% iluminada — máximo brillo del ciclo.",
    illumination_new: "La luna casi no es visible — el ciclo está reiniciando.",
    day_singular: "1 día",
    day_plural: "{n} días",
    hour_singular: "1 hora",
    hour_plural: "{n} horas",
    minute_singular: "1 minuto",
    minute_plural: "{n} minutos",
    connector: "y",
    less_than_minute: "menos de 1 minuto",
    next_phase_singular: "Falta {time} para la fase {phase}.",
    next_phase_plural: "Faltan {time} para la fase {phase}.",
    moon_age: "Edad de la Luna",
    moon_age_value_singular: "1,0 día en el ciclo lunar",
    moon_age_value_plural: "{days} días en el ciclo lunar",
    hemisphere: "Hemisferio",
    northern: "Norte",
    southern: "Sur",
    features_title: "Funcionalidades",
    f_1: "Fase lunar actual con nombre e imagen en tiempo real",
    f_2: "Porcentaje aproximado de iluminación de la luna",
    f_3: "Cuenta regresiva para la próxima fase principal",
    f_4: "Soporte para el hemisferio sur (luna espejada)",
    how_to_use_title: "Cómo usar",
    how_desc: "La herramienta calcula automáticamente la fase lunar basándose en la fecha de hoy, utilizando el ciclo sinódico promedio de 29,53 días. Todos los cálculos se realizan directamente en tu navegador, sin consultas a servidores externos.",
    step_1_title: "Ver la Fase Actual",
    step_1_desc: "Al abrir la página, la fase lunar de hoy se muestra automáticamente con nombre, imagen y porcentaje de iluminación.",
    step_2_title: "Elige tu Hemisferio",
    step_2_desc: "Si estás en el hemisferio sur, selecciona 'Sur' para ver la imagen lunar en la orientación correcta.",
    step_3_title: "Comprueba la Próxima Fase",
    step_3_desc: "Ve cuánto tiempo falta para la próxima fase principal: cuarto creciente, luna llena, cuarto menguante o luna nueva.",
    use_cases_title: "Casos de Uso",
    uc1: "Planificar actividades rurales como siembra y cosecha según el calendario lunar.",
    uc2: "Verificar la fase lunar para fotografía nocturna y astronomía amateur.",
    uc3: "Rituales, prácticas espirituales y meditaciones guiadas por el ciclo lunar.",
    uc4: "Curiosidad general sobre el ciclo lunar y educación astronómica básica.",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Cómo se calcula la fase lunar?",
    faq1a: "El cálculo se basa en el ciclo sinódico de la luna, que dura en promedio 29,53 días. Partiendo de una fecha de luna nueva conocida, calculamos en qué punto del ciclo estamos hoy.",
    faq2q: "¿Por qué la imagen de la luna se ve diferente en el hemisferio sur?",
    faq2a: "La luna se ve espejada según el hemisferio. En Argentina y otros países del sur, el creciente aparece en el lado opuesto al del hemisferio norte. Por eso ofrecemos el selector de hemisferio.",
    faq3q: "¿Es preciso el porcentaje de iluminación?",
    faq3a: "La iluminación mostrada es una buena aproximación basada en el ciclo lunar promedio. Para cálculos astronómicos de alta precisión, recomendamos software especializado.",
    see1: "Calculadora de Edad",
    see2: "Calculadora de Diferencia de Fechas",
    see3: "Calculadora de Fecha Futura",
    see4: "Convertidor de Timestamp Unix",
    explain_title: "Entiende las Fases de la Luna",
    explain_desc: "El ciclo lunar (o ciclo sinódico) dura unos 29,5 días y se divide en 8 fases principales, que reflejan la porción de la Luna iluminada por el Sol vista desde la Tierra. Conoce las características de cada fase:",
    p_new_title: "Luna Nueva",
    p_new_desc: "La Luna está posicionada entre la Tierra y el Sol. Su lado iluminado está orientado hacia el Sol, haciéndola completamente invisible en el cielo nocturno para nosotros.",
    p_wc_title: "Luna Creciente",
    p_wc_desc: "Una pequeña fracción de luz comienza a aparecer. Es el inicio del viaje de la Luna al salir de la fase oscura hacia la iluminación total.",
    p_fq_title: "Cuarto Creciente",
    p_fq_desc: "Exactamente la mitad del disco lunar queda visible e iluminada. La Luna ha completado un cuarto de su órbita alrededor de la Tierra desde la Luna Nueva.",
    p_wg_title: "Gibosa Creciente",
    p_wg_desc: "Más de la mitad de la superficie lunar está iluminada, creciendo cada día, pero aún sin llegar a la totalidad de la Luna Llena.",
    p_full_title: "Luna Llena",
    p_full_desc: "Toda la cara de la Luna visible desde la Tierra está 100% iluminada por el Sol, brillando en su máximo esplendor en el cielo durante toda la noche.",
    p_wng_title: "Gibosa Menguante",
    p_wng_desc: "Después de la fase llena, el área iluminada comienza a disminuir progresivamente, aunque más de la mitad de la Luna sigue siendo visible.",
    p_lq_title: "Cuarto Menguante",
    p_lq_desc: "La mitad opuesta del disco lunar (en comparación con el Cuarto Creciente) está iluminada, marcando el último cuarto de órbita del ciclo lunar.",
    p_wnc_title: "Luna Menguante",
    p_wnc_desc: "Solo un pequeño arco o curva de luz permanece visible en el cielo. Es la última etapa antes de reiniciar el ciclo con una nueva Luna Nueva.",
    illus_term_title: "¿Qué es la Iluminación de la Luna?",
    illus_term_desc: "La iluminación (o luminosidad) representa el porcentaje de la cara visible de la Luna que recibe luz solar directa y la refleja hacia la Tierra. Varía continuamente del 0% (Luna Nueva) al 100% (Luna Llena) a medida que la Luna orbita nuestro planeta.",
    age_term_title: "¿Qué es la Edad de la Luna?",
    age_term_desc: "La edad lunar indica la cantidad de días transcurridos desde la última Luna Nueva. Como el ciclo completo promedio (ciclo sinódico) dura 29,53 días, este valor oscila entre 0 y 29,5, marcando el progreso exacto en su lunación actual."
  },
  fr: {
    pageTitle: "Phase de la Lune Aujourd'hui — Quelle est la Phase Lunaire Maintenant ? | Gratuit",
    title: "Phase de la Lune Aujourd'hui",
    meta: "Découvrez la phase de la lune aujourd'hui : nouvelle lune, croissante, pleine ou décroissante. Illumination en temps réel et compte à rebours jusqu'à la prochaine phase.",
    loading: "Calcul de la phase lunaire d'aujourd'hui…",
    lunation: "Lunaison N°{n}",
    new_moon: "Nouvelle Lune",
    waxing_crescent: "Premier Croissant",
    first_quarter: "Premier Quartier",
    waxing_gibbous: "Gibbeuse Croissante",
    full_moon: "Pleine Lune",
    waning_gibbous: "Gibbeuse Décroissante",
    last_quarter: "Dernier Quartier",
    waning_crescent: "Dernier Croissant",
    unknown_phase: "Phase Inconnue",
    growing: "en croissance",
    shrinking: "en déclin",
    illumination: "La lune d'aujourd'hui est illuminée à {pct}% et est {direction}.",
    illumination_full: "La lune d'aujourd'hui est illuminée à {pct}% — pic de luminosité du cycle.",
    illumination_new: "La lune est presque invisible — le cycle recommence.",
    day_singular: "1 jour",
    day_plural: "{n} jours",
    hour_singular: "1 heure",
    hour_plural: "{n} heures",
    minute_singular: "1 minute",
    minute_plural: "{n} minutes",
    connector: "et",
    less_than_minute: "moins d'une minute",
    next_phase: "Il reste {time} avant la phase {phase}.",
    moon_age: "Âge de la Lune",
    moon_age_value_singular: "1,0 jour dans le cycle lunaire",
    moon_age_value_plural: "{days} jours dans le cycle lunaire",
    hemisphere: "Hémisphère",
    northern: "Nord",
    southern: "Sud",
    features_title: "Fonctionnalités",
    f_1: "Phase lunaire actuelle avec nom et image en temps réel",
    f_2: "Pourcentage approximatif d'illumination de la lune",
    f_3: "Compte à rebours jusqu'à la prochaine phase principale",
    f_4: "Support de l'hémisphère sud (lune miroir)",
    how_to_use_title: "Comment utiliser",
    how_desc: "L'outil calcule automatiquement la phase lunaire en fonction de la date d'aujourd'hui, en utilisant le cycle synodique moyen de 29,53 jours. Tous les calculs sont effectués directement dans votre navigateur.",
    step_1_title: "Voir la Phase Actuelle",
    step_1_desc: "À l'ouverture de la page, la phase lunaire d'aujourd'hui s'affiche automatiquement avec le nom, l'image et le pourcentage d'illumination.",
    step_2_title: "Choisissez votre Hémisphère",
    step_2_desc: "Si vous êtes dans l'hémisphère sud, sélectionnez 'Sud' pour voir l'image de la lune dans la bonne orientation.",
    step_3_title: "Vérifiez la Prochaine Phase",
    step_3_desc: "Voyez combien de temps il reste avant la prochaine phase principale : premier quartier, pleine lune, dernier quartier ou nouvelle lune.",
    use_cases_title: "Cas d'Utilisation",
    uc1: "Planifier des activités agricoles comme les semis et les récoltes selon le calendrier lunaire.",
    uc2: "Vérifier la phase lunaire pour la photographie nocturne et l'astronomie amateur.",
    uc3: "Rituels, pratiques spirituelles et méditations guidées par le cycle lunaire.",
    uc4: "Curiosité générale sur le cycle de la lune et éducation astronomique de base.",
    faq_title: "Questions et Réponses",
    faq1q: "Comment la phase lunaire est-elle calculée ?",
    faq1a: "Le calcul est basé sur le cycle synodique de la lune, qui dure en moyenne 29,53 jours. À partir d'une date de nouvelle lune connue, nous calculons à quel point du cycle nous en sommes aujourd'hui.",
    faq2q: "Pourquoi l'image de la lune est-elle différente dans l'hémisphère sud ?",
    faq2a: "La lune apparaît en miroir selon l'hémisphère. En Australie et dans d'autres pays du sud, le croissant apparaît du côté opposé par rapport à l'hémisphère nord.",
    faq3q: "Le pourcentage d'illumination est-il précis ?",
    faq3a: "L'illumination affichée est une bonne approximation basée sur le cycle lunaire moyen. Pour des calculs astronomiques de haute précision, nous recommandons des logiciels spécialisés.",
    see1: "Calculateur d'Âge",
    see2: "Calculateur de Différence entre Dates",
    see3: "Calculatrice de Date Future",
    see4: "Convertisseur de Timestamp Unix",
    explain_title: "Comprendre les Phases de la Lune",
    explain_desc: "Le cycle lunaire (ou cycle synodique) dure environ 29,5 jours et est divisé en 8 phases principales, reflétant la portion de la Lune éclairée par le Soleil du point de vue de la Terre. Découvrez les caractéristiques de chaque phase :",
    p_new_title: "Nouvelle Lune",
    p_new_desc: "La Lune est positionnée entre la Terre et le Soleil. Sa face éclairée est tournée vers le Soleil, la rendant complètement invisible pour nous dans le ciel nocturne.",
    p_wc_title: "Premier Croissant",
    p_wc_desc: "Une fine fraction de lumière commence à apparaître sur le bord. C'est le début du voyage de la Lune hors de la phase sombre vers la pleine illumination.",
    p_fq_title: "Premier Quartier",
    p_fq_desc: "Exactement la moitié du disque lunaire devient visible et éclairée. La Lune a complété un quart de son orbite autour de la Terre depuis la Nouvelle Lune.",
    p_wg_title: "Lune Gibbeuse Croissante",
    p_wg_desc: "Plus de la moitié de la surface lunaire est éclairée, grandissant chaque jour, mais sans encore atteindre la plénitude de la Pleine Lune.",
    p_full_title: "Pleine Lune",
    p_full_desc: "Toute la face de la Lune visible depuis la Terre est 100% éclairée par le Soleil, brillant de tout son éclat dans le ciel tout au long de la nuit.",
    p_wng_title: "Lune Gibbeuse Décroissante",
    p_wng_desc: "Après la phase pleine, la surface éclairée commence à rétrécir progressivement, même si plus de la moitié de la Lune reste visible.",
    p_lq_title: "Dernier Quartier",
    p_lq_desc: "La moitié opposée du disque lunaire (par rapport au Premier Quartier) est éclairée, marquant le dernier quart d'orbite du cycle lunaire.",
    p_wnc_title: "Dernier Croissant",
    p_wnc_desc: "Seul un mince croissant ou une faucille de lumière reste visible dans le ciel. C'est la dernière étape avant le recommencement du cycle avec une nouvelle Nouvelle Lune.",
    illus_term_title: "Qu'est-ce que l'Illumination de la Lune ?",
    illus_term_desc: "L'illumination (ou luminosité) représente le pourcentage de la face visible de la Lune qui reçoit la lumière directe du Soleil et la réfléchit vers la Terre. Elle varie en permanence de 0% (Nouvelle Lune) à 100% (Pleine Lune) à mesure que la Lune orbite autour de notre planète.",
    age_term_title: "Qu'est-ce que l'Âge de la Lune ?",
    age_term_desc: "L'âge lunaire indique le nombre de jours écoulés depuis la dernière Nouvelle Lune. Comme le cycle complet moyen (mois synodique) dure 29,53 jours, cette valeur varie entre 0 et 29,5, indiquant la progression exacte dans sa lunaison actuelle."
  },
  it: {
    pageTitle: "Fase della Luna Oggi — Qual è la Fase Lunare Adesso? | Gratis",
    title: "Fase della Luna Oggi",
    meta: "Scopri la fase della luna oggi e la fase lunare attuale: luna nuova, crescente, piena o calante. Illuminazione in tempo reale e conto alla rovescia.",
    loading: "Calcolo della fase lunare di oggi…",
    lunation: "Lunazione N°{n}",
    new_moon: "Luna Nuova",
    waxing_crescent: "Luna Crescente",
    first_quarter: "Primo Quarto",
    waxing_gibbous: "Gibbosa Crescente",
    full_moon: "Luna Piena",
    waning_gibbous: "Gibbosa Calante",
    last_quarter: "Ultimo Quarto",
    waning_crescent: "Luna Calante",
    unknown_phase: "Fase Sconosciuta",
    growing: "in crescita",
    shrinking: "in calo",
    illumination: "La luna di oggi è illuminata al {pct}% ed è {direction}.",
    illumination_full: "La luna di oggi è illuminata al {pct}% — picco di luminosità del ciclo.",
    illumination_new: "La luna è quasi invisibile — il ciclo sta ricominciando.",
    day_singular: "1 giorno",
    day_plural: "{n} giorni",
    hour_singular: "1 ora",
    hour_plural: "{n} ore",
    minute_singular: "1 minuto",
    minute_plural: "{n} minuti",
    connector: "e",
    less_than_minute: "meno di un minuto",
    next_phase_singular: "Manca {time} alla fase {phase}.",
    next_phase_plural: "Mancano {time} alla fase {phase}.",
    moon_age: "Età della Luna",
    moon_age_value_singular: "1,0 giorno nel ciclo lunare",
    moon_age_value_plural: "{days} giorni nel ciclo lunare",
    hemisphere: "Emisfero",
    northern: "Nord",
    southern: "Sud",
    features_title: "Funzionalità",
    f_1: "Fase lunare attuale con nome e immagine in tempo reale",
    f_2: "Percentuale approssimativa di illuminazione della luna",
    f_3: "Conto alla rovescia fino alla prossima fase principale",
    f_4: "Supporto per l'emisfero sud (luna specchiata)",
    how_to_use_title: "Come usare",
    how_desc: "Lo strumento calcola automaticamente la fase lunare in base alla data odierna, utilizzando il ciclo sinodico medio di 29,53 giorni. Tutti i calcoli vengono eseguiti direttamente nel tuo browser.",
    step_1_title: "Vedi la Fase Attuale",
    step_1_desc: "All'apertura della pagina, la fase lunare di oggi viene visualizzata automaticamente con nome, immagine e percentuale di illuminazione.",
    step_2_title: "Scegli il tuo Emisfero",
    step_2_desc: "Se sei nell'emisfero sud, seleziona 'Sud' per vedere l'immagine della luna nell'orientamento corretto.",
    step_3_title: "Controlla la Prossima Fase",
    step_3_desc: "Scopri quanto tempo manca alla prossima fase principale: primo quarto, luna piena, ultimo quarto o luna nuova.",
    use_cases_title: "Casi d'Uso",
    uc1: "Pianificare attività agricole come semina e raccolta secondo il calendario lunare.",
    uc2: "Verificare la fase lunare per la fotografia notturna e l'astronomia amatoriale.",
    uc3: "Rituali, pratiche spirituali e meditazioni guidate dal ciclo lunare.",
    uc4: "Curiosità generale sul ciclo della luna ed educazione astronomica di base.",
    faq_title: "Domande e Risposte",
    faq1q: "Come viene calcolata la fase lunare?",
    faq1a: "Il calcolo è basato sul ciclo sinodico della luna, che dura in media 29,53 giorni. Partendo da una data di luna nuova nota, calcoliamo in quale punto del ciclo ci troviamo oggi.",
    faq2q: "Perché l'immagine della luna appare diversa nell'emisfero sud?",
    faq2a: "La luna appare specchiata a seconda dell'emisfero. In Australia e in altri paesi del sud, la falce appare sul lato opposto rispetto all'emisfero nord.",
    faq3q: "La percentuale di illuminazione è precisa?",
    faq3a: "L'illuminazione mostrata è una buona approssimazione basata sul ciclo lunare medio. Per calcoli astronomici ad alta precisione, consigliamo software specializzati.",
    see1: "Calcolatrice dell'Età",
    see2: "Calcolatore di Differenza tra Date",
    see3: "Calcolatrice di Data Futura",
    see4: "Convertitore di Timestamp Unix",
    explain_title: "Comprendere le Fasi Lunari",
    explain_desc: "Il ciclo lunare (o mese sinodico) dura circa 29,5 giorni ed è suddiviso in 8 fasi principali, che riflettono la porzione di Luna illuminata dal Sole dal punto di vista della Terra. Scopri le caratteristiche di ciascuna fase:",
    p_new_title: "Luna Nuova",
    p_new_desc: "La Luna si trova tra la Terra e il Sole. Il suo lato illuminato è rivolto verso il Sole, rendendola completamente invisibile per noi nel cielo notturno.",
    p_wc_title: "Luna Crescente",
    p_wc_desc: "Una sottile fetta di luce inizia ad apparire sul bordo. Questo segna l'inizio del cammino della Luna dall'oscurità verso la piena illuminazione.",
    p_fq_title: "Primo Quarto",
    p_fq_desc: "Esattamente metà del disco lunare diventa visibile e illuminata. La Luna ha completato un quarto della sua orbita attorno alla Terra dalla Luna Nuova.",
    p_wg_title: "Gibbosa Crescente",
    p_wg_desc: "Più di metà della superficie lunare è illuminata, crescendo di giorno in giorno ma senza ancora raggiungere la forma circolare della Luna Piena.",
    p_full_title: "Luna Piena",
    p_full_desc: "L'intera faccia visibile della Luna dalla Terra è illuminata al 100% dal Sole, splendendo al massimo della sua luminosità per tutta la notte.",
    p_wng_title: "Gibbosa Calante",
    p_wng_desc: "Dopo la fase di plenilunio, l'area illuminata inizia a restringersi progressivamente, anche se più di metà della Luna rimane visibile.",
    p_lq_title: "Ultimo Quarto",
    p_lq_desc: "La metà opposta del disco lunare (rispetto al Primo Quarto) è illuminata, segnando l'ultimo quarto dell'orbita del ciclo lunare.",
    p_wnc_title: "Luna Calante",
    p_wnc_desc: "Rimane visibile nel cielo solo un sottile arco o falce di luce. È l'ultima fase del ciclo prima di ricominciare con una nuova Luna Nuova.",
    illus_term_title: "Cos'è l'Illuminazione della Luna?",
    illus_term_desc: "L'illuminazione (o luminosità) rappresenta la percentuale della faccia visibile della Luna che riceve luce solare diretta e la riflette verso la Terra. Varia costantemente da 0% (Luna Nuova) a 100% (Luna Piena) mentre la Luna orbita attorno al nostro pianeta.",
    age_term_title: "Cos'è l'Età della Luna?",
    age_term_desc: "L'età lunare indica il numero di giorni trascorsi dall'ultima Luna Nuova. Poiché il ciclo completo medio (mese sinodico) dura 29,53 giorni, questo valore oscila tra 0 e 29,5, mostrando il progresso esatto nella sua lunazione attuale."
  },
  id: {
    pageTitle: "Fase Bulan Hari Ini — Cek Fase Bulan Sekarang | Gratis",
    title: "Fase Bulan",
    meta: "Cek fase bulan hari ini secara langsung: bulan baru, sabit, purnama, atau bulan tua. Lihat persentase pencahayaan dan hitungan mundur ke fase berikutnya.",
    loading: "Menghitung fase bulan hari ini…",
    lunation: "Lunasi #{n}",
    new_moon: "Bulan Baru",
    waxing_crescent: "Bulan Sabit Awal",
    first_quarter: "Kuartal Pertama",
    waxing_gibbous: "Bulan Cembung Awal",
    full_moon: "Bulan Purnama",
    waning_gibbous: "Bulan Cembung Akhir",
    last_quarter: "Kuartal Terakhir",
    waning_crescent: "Bulan Sabit Akhir",
    unknown_phase: "Fase Tidak Diketahui",
    growing: "bertambah",
    shrinking: "berkurang",
    illumination: "Bulan hari ini bercahaya {pct}% dan sedang {direction}.",
    illumination_full: "Bulan hari ini bercahaya {pct}% — puncak kecerahan siklus.",
    illumination_new: "Bulan hampir tidak terlihat — siklus dimulai kembali.",
    day_singular: "1 hari",
    day_plural: "{n} hari",
    hour_singular: "1 jam",
    hour_plural: "{n} jam",
    minute_singular: "1 menit",
    minute_plural: "{n} menit",
    connector: "dan",
    less_than_minute: "kurang dari 1 menit",
    next_phase: "{time} lagi menuju fase {phase}.",
    moon_age: "Usia Bulan",
    moon_age_value_singular: "1,0 hari dalam siklus bulan",
    moon_age_value_plural: "{days} hari dalam siklus bulan",
    hemisphere: "Belahan Bumi",
    northern: "Utara",
    southern: "Selatan",
    features_title: "Fitur",
    f_1: "Fase bulan saat ini dengan nama dan gambar secara real time",
    f_2: "Persentase perkiraan pencahayaan bulan",
    f_3: "Hitung mundur ke fase utama berikutnya",
    f_4: "Dukungan belahan bumi selatan (bulan cermin)",
    how_to_use_title: "Cara menggunakan",
    how_desc: "Alat ini secara otomatis menghitung fase bulan berdasarkan tanggal hari ini, menggunakan siklus sinodik rata-rata 29,53 hari. Semua perhitungan dilakukan langsung di browser Anda.",
    step_1_title: "Lihat Fase Saat Ini",
    step_1_desc: "Saat membuka halaman, fase bulan hari ini ditampilkan secara otomatis dengan nama, gambar, dan persentase pencahayaan.",
    step_2_title: "Pilih Belahan Bumi Anda",
    step_2_desc: "Jika Anda berada di belahan bumi selatan, pilih 'Selatan' untuk melihat gambar bulan dalam orientasi yang benar.",
    step_3_title: "Periksa Fase Berikutnya",
    step_3_desc: "Lihat berapa lama waktu yang tersisa hingga fase utama berikutnya: kuartal pertama, bulan purnama, kuartal terakhir, atau bulan baru.",
    use_cases_title: "Contoh Penggunaan",
    uc1: "Merencanakan kegiatan pertanian seperti menanam dan memanen sesuai kalender bulan.",
    uc2: "Memeriksa fase bulan untuk fotografi malam dan astronomi amatir.",
    uc3: "Ritual, praktik spiritual, dan meditasi yang dipandu oleh siklus bulan.",
    uc4: "Rasa ingin tahu umum tentang siklus bulan dan pendidikan astronomi dasar.",
    faq_title: "Tanya Jawab",
    faq1q: "Bagaimana fase bulan dihitung?",
    faq1a: "Perhitungan didasarkan pada siklus sinodik bulan, yang rata-rata berlangsung 29,53 hari. Mulai dari tanggal bulan baru yang diketahui, kami menghitung di titik mana dalam siklus kita berada hari ini.",
    faq2q: "Mengapa gambar bulan terlihat berbeda di belahan bumi selatan?",
    faq2a: "Bulan tampak bercermin tergantung pada belahan bumi. Di Australia dan negara-negara selatan lainnya, bulan sabit muncul di sisi yang berlawanan dibandingkan belahan bumi utara.",
    faq3q: "Apakah persentase pencahayaan akurat?",
    faq3a: "Pencahayaan yang ditampilkan adalah perkiraan yang baik berdasarkan siklus bulan rata-rata. Untuk perhitungan astronomi yang presisi tinggi, kami merekomendasikan perangkat lunak khusus.",
    see1: "Kalkulator Usia",
    see2: "Kalkulator Selisih Tanggal",
    see3: "Kalkulator Tanggal Masa Depan",
    see4: "Konverter Timestamp Unix",
    explain_title: "Memahami Fase-Fase Bulan",
    explain_desc: "Siklus bulan (atau bulan sinodik) berlangsung sekitar 29,5 hari dan dibagi menjadi 8 fase utama, yang mencerminkan bagian Bulan yang diterangi oleh Matahari jika dilihat dari Bumi. Pelajari karakteristik dari setiap fase:",
    p_new_title: "Bulan Baru",
    p_new_desc: "Bulan berada di antara Bumi dan Matahari. Sisi yang diterangi menghadap ke Matahari, sehingga Bulan sama sekali tidak terlihat oleh kita di langit malam.",
    p_wc_title: "Bulan Sabit Awal",
    p_wc_desc: "Sebagian kecil cahaya mulai muncul di tepi Bulan. Ini menandai awal perjalanan Bulan keluar dari fase gelap menuju pencahayaan penuh.",
    p_fq_title: "Kuartal Pertama",
    p_fq_desc: "Tepat setengah dari piringan bulan terlihat terang dan diterangi. Bulan telah menyelesaikan seperempat orbitnya mengelilingi Bumi sejak Bulan Baru.",
    p_wg_title: "Bulan Cembung Awal",
    p_wg_desc: "Lebih dari setengah permukaan bulan diterangi cahaya, dan terus bertambah setiap hari, tetapi belum mencapai kebulatan penuh Bulan Purnama.",
    p_full_title: "Bulan Purnama",
    p_full_desc: "Seluruh wajah Bulan yang terlihat dari Bumi 100% diterangi oleh Matahari, bersinar dengan kemegahan puncaknya di langit sepanjang malam.",
    p_wng_title: "Bulan Cembung Akhir",
    p_wng_desc: "Setelah fase purnama, area yang diterangi mulai berkurang secara bertahap, meskipun lebih dari setengah bagian Bulan masih terlihat.",
    p_lq_title: "Kuartal Terakhir",
    p_lq_desc: "Setengah bagian piringan bulan yang berlawanan (dibandingkan dengan Kuartal Pertama) diterangi, menandai kuartal terakhir dari orbit siklus bulan.",
    p_wnc_title: "Bulan Sabit Akhir",
    p_wnc_desc: "Hanya lengkungan cahaya tipis yang tersisa di langit. Ini adalah tahap terakhir sebelum siklus dimulai kembali dengan Bulan Baru yang baru.",
    illus_term_title: "Apa itu Pencahayaan Bulan?",
    illus_term_desc: "Pencahayaan (atau luminositas) menunjukkan persentase permukaan Bulan yang terlihat dari Bumi yang menerima cahaya matahari langsung dan memantulkannya kembali ke Bumi. Nilai ini terus berubah dari 0% (Bulan Baru) hingga 100% (Bulan Purnama) seiring pergerakan Bulan mengelilingi planet kita.",
    age_term_title: "Apa itu Usia Bulan?",
    age_term_desc: "Usia bulan menunjukkan jumlah hari yang telah berlalu sejak Bulan Baru terakhir. Karena rata-rata siklus lengkap (bulan sinodik) berlangsung selama 29,53 hari, nilai ini berkisar antara 0 hingga 29,5, menandai kemajuan tepat dalam siklus bulan saat ini."
  },
  de: {
    pageTitle: "Mondphase Heute — In welcher Mondphase befinden wir uns? | Kostenlos",
    title: "Mondphase Heute",
    meta: "Aktuelle Mondphase heute: Neumond, zunehmender Mond, Vollmond oder abnehmender Mond. Sieh den genauen Beleuchtungsstand und die Zeit bis zur nächsten Phase.",
    loading: "Berechne die heutige Mondphase…",
    lunation: "Lunation Nr. {n}",
    new_moon: "Neumond",
    waxing_crescent: "Zunehmende Sichel",
    first_quarter: "Erstes Viertel",
    waxing_gibbous: "Zunehmender Dreiviertelmond",
    full_moon: "Vollmond",
    waning_gibbous: "Abnehmender Dreiviertelmond",
    last_quarter: "Letztes Viertel",
    waning_crescent: "Abnehmende Sichel",
    unknown_phase: "Unbekannte Phase",
    growing: "zunehmend",
    shrinking: "abnehmend",
    illumination: "Der heutige Mond ist zu {pct}% beleuchtet und ist {direction}.",
    illumination_full: "Der heutige Mond ist zu {pct}% beleuchtet — Höhepunkt der Helligkeit im Zyklus.",
    illumination_new: "Der Mond ist fast unsichtbar — der Zyklus beginnt von Neuem.",
    day_singular: "1 Tag",
    day_plural: "{n} Tage",
    hour_singular: "1 Stunde",
    hour_plural: "{n} Stunden",
    minute_singular: "1 Minute",
    minute_plural: "{n} Minuten",
    connector: "und",
    less_than_minute: "weniger als 1 Minute",
    next_phase: "Noch {time} bis zur Phase {phase}.",
    moon_age: "Mondalter",
    moon_age_value_singular: "1,0 Tag im Mondzyklus",
    moon_age_value_plural: "{days} Tage im Mondzyklus",
    hemisphere: "Hemisphäre",
    northern: "Nord",
    southern: "Süd",
    features_title: "Funktionen",
    f_1: "Aktuelle Mondphase mit Name und Bild in Echtzeit",
    f_2: "Ungefährer Beleuchtungsprozentwert des Mondes",
    f_3: "Countdown bis zur nächsten Hauptmondphase",
    f_4: "Unterstützung der südlichen Hemisphäre (gespiegelter Mond)",
    how_to_use_title: "So verwendest du das Tool",
    how_desc: "Das Tool berechnet automatisch die Mondphase basierend auf dem heutigen Datum und verwendet den durchschnittlichen synodischen Zyklus von 29,53 Tagen. Alle Berechnungen werden direkt in deinem Browser durchgeführt.",
    step_1_title: "Aktuelle Phase anzeigen",
    step_1_desc: "Beim Öffnen der Seite wird die heutige Mondphase automatisch mit Name, Bild und Beleuchtungsprozentwert angezeigt.",
    step_2_title: "Hemisphäre auswählen",
    step_2_desc: "Wenn du auf der südlichen Hemisphäre bist, wähle 'Süd', um das Bild des Mondes in der richtigen Ausrichtung zu sehen.",
    step_3_title: "Nächste Phase prüfen",
    step_3_desc: "Sieh, wie viel Zeit bis zur nächsten Hauptphase verbleibt: erstes Viertel, Vollmond, letztes Viertel oder Neumond.",
    use_cases_title: "Anwendungsfälle",
    uc1: "Planung landwirtschaftlicher Aktivitäten wie Aussaat und Ernte nach dem Mondkalender.",
    uc2: "Überprüfen der Mondphase für Nachtfotografie und Amateurastronomie.",
    uc3: "Rituale, spirituelle Praktiken und Meditationen im Einklang mit dem Mondzyklus.",
    uc4: "Allgemeine Neugier über den Mondzyklus und grundlegende astronomische Bildung.",
    faq_title: "Fragen und Antworten",
    faq1q: "Wie wird die Mondphase berechnet?",
    faq1a: "Die Berechnung basiert auf dem synodischen Zyklus des Mondes, der durchschnittlich 29,53 Tage dauert. Ausgehend von einem bekannten Neumonddatum berechnen wir, an welchem Punkt des Zyklus wir uns heute befinden.",
    faq2q: "Warum sieht das Bild des Mondes auf der südlichen Hemisphäre anders aus?",
    faq2a: "Der Mond erscheint je nach Hemisphäre gespiegelt. In Australien und anderen südlichen Ländern erscheint die Sichel auf der entgegengesetzten Seite im Vergleich zur nördlichen Hemisphäre.",
    faq3q: "Ist der Beleuchtungsprozentwert genau?",
    faq3a: "Die angezeigte Beleuchtung ist eine gute Annäherung basierend auf dem durchschnittlichen Mondzyklus. Für hochpräzise astronomische Berechnungen empfehlen wir spezialisierte Software.",
    see1: "Altersrechner",
    see2: "Datumsdifferenz",
    see3: "Zukunftsdatum-Rechner",
    see4: "Unix-Timestamp-Konverter",
    explain_title: "Die Mondphasen verstehen",
    explain_desc: "Der Mondzyklus (oder synodische Monat) dauert etwa 29,5 Tage und ist in 8 Hauptphasen unterteilt, die den von der Sonne beleuchteten Teil des Mondes aus Sicht der Erde widerspiegeln. Lerne die Eigenschaften jeder Phase kennen:",
    p_new_title: "Neumond",
    p_new_desc: "Der Mond befindet sich zwischen Erde und Sonne. Seine beleuchtete Seite ist der Sonne zugewandt, wodurch er für uns am Nachthimmel völlig unsichtbar ist.",
    p_wc_title: "Zunehmende Sichel",
    p_wc_desc: "Ein schmaler Lichtstreifen beginnt am Rand zu erscheinen. Dies markiert den Beginn der Reise des Mondes aus der dunklen Phase hin zur vollen Beleuchtung.",
    p_fq_title: "Erstes Viertel",
    p_fq_desc: "Genau die Hälfte der Mondscheibe wird sichtbar und beleuchtet. Der Mond hat seit dem Neumond ein Viertel seiner Umlaufbahn um die Erde absolviert.",
    p_wg_title: "Zunehmender Dreiviertelmond",
    p_wg_desc: "Mehr als die Hälfte der Mondoberfläche ist beleuchtet und wächst von Tag zu Tag, hat jedoch die volle Kreisform des Vollmonds noch nicht erreicht.",
    p_full_title: "Vollmond",
    p_full_desc: "Die gesamte von der Erde aus sichtbare Seite des Mondes wird zu 100% von der Sonne beleuchtet und strahlt die ganze Nacht hindurch in voller Pracht am Himmel.",
    p_wng_title: "Abnehmender Dreiviertelmond",
    p_wng_desc: "Nach der Vollmondphase beginnt die beleuchtete Fläche allmählich zu schrumpfen, obwohl immer noch mehr als die Hälfte des Mondes sichtbar ist.",
    p_lq_title: "Letztes Viertel",
    p_lq_desc: "Die entgegengesetzte Hälfte der Mondscheibe (im Vergleich zum Ersten Viertel) ist beleuchtet und markiert das letzte Viertel der Umlaufbahn des Mondzyklus.",
    p_wnc_title: "Abnehmende Sichel",
    p_wnc_desc: "Nur noch eine dünne Lichtsichel bleibt am Himmel sichtbar. Dies ist die letzte Phase, bevor der Zyklus mit einem neuen Neumond von vorne beginnt.",
    illus_term_title: "Was ist die Mondbeleuchtung?",
    illus_term_desc: "Die Beleuchtung (oder Helligkeit) stellt den Prozentsatz der der Erde zugewandten Seite des Mondes dar, der direktes Sonnenlicht erhält und es zur Erde reflektiert. Sie ändert sich kontinuierlich von 0% (Neumond) bis 100% (Vollmond), während der Mond unseren Planeten umkreist.",
    age_term_title: "Was ist das Mondalter?",
    age_term_desc: "Das Mondalter gibt die Anzahl der Tage an, die seit dem letzten Neumond vergangen sind. Da der durchschnittliche vollständige Zyklus (synodischer Monat) 29,53 Tage dauert, liegt dieser Wert zwischen 0 und 29,5 und zeigt den genauen Fortschritt in der aktuellen Lunation."
  },
  nl: {
    pageTitle: "Maanstand Vandaag — Bekijk de Huidige Maanfase Online | Gratis",
    title: "Maanstand",
    meta: "Bekijk de maanstand vandaag en huidige maanfase: nieuwe maan, wassende maan, volle maan of afnemende maan. Verlichtingspercentage en countdown tot de volgende fase.",
    loading: "Berekent de maanfase van vandaag…",
    lunation: "Lunatie nr. {n}",
    new_moon: "Nieuwe Maan",
    waxing_crescent: "Wassende Maansikkel",
    first_quarter: "Eerste Kwartier",
    waxing_gibbous: "Wassende Gebochelde Maan",
    full_moon: "Volle Maan",
    waning_gibbous: "Afnemende Gebochelde Maan",
    last_quarter: "Laatste Kwartier",
    waning_crescent: "Afnemende Maansikkel",
    unknown_phase: "Onbekende Fase",
    growing: "wassend",
    shrinking: "afnemend",
    illumination: "De maan van vandaag is {pct}% verlicht en is {direction}.",
    illumination_full: "De maan van vandaag is {pct}% verlicht — piek van de cyclus.",
    illumination_new: "De maan is bijna onzichtbaar — de cyclus begint opnieuw.",
    day_singular: "1 dag",
    day_plural: "{n} dagen",
    hour_singular: "1 uur",
    hour_plural: "{n} uur",
    minute_singular: "1 minuut",
    minute_plural: "{n} minuten",
    connector: "en",
    less_than_minute: "minder dan 1 minuut",
    next_phase: "Nog {time} tot de {phase} fase.",
    moon_age: "Maanleeftijd",
    moon_age_value_singular: "1,0 dag in de maancyclus",
    moon_age_value_plural: "{days} dagen in de maancyclus",
    hemisphere: "Halfrond",
    northern: "Noord",
    southern: "Zuid",
    features_title: "Functies",
    f_1: "Huidige maanfase met naam en afbeelding in real time",
    f_2: "Geschat verlichtingspercentage van de maan",
    f_3: "Aftellen tot de volgende hoofdmaanfase",
    f_4: "Ondersteuning voor het zuidelijk halfrond (gespiegelde maan)",
    how_to_use_title: "Hoe te gebruiken",
    how_desc: "De tool berekent automatisch de maanfase op basis van de datum van vandaag, met gebruik van de gemiddelde synodische cyclus van 29,53 dagen. Alle berekeningen worden direct in uw browser uitgevoerd.",
    step_1_title: "Bekijk de huidige fase",
    step_1_desc: "Wanneer u de pagina opent, wordt de maanfase van vandaag automatisch weergegeven met naam, afbeelding en verlichtingspercentage.",
    step_2_title: "Kies uw halfrond",
    step_2_desc: "Als u op het zuidelijk halfrond bent, selecteer dan 'Zuid' om de afbeelding van de maan in de juiste oriëntatie te zien.",
    step_3_title: "Controleer de volgende fase",
    step_3_desc: "Zie hoeveel tijd er nog resteert tot de volgende hoofdfase: eerste kwartier, volle maan, laatste kwartier of nieuwe maan.",
    use_cases_title: "Gebruiksvoorbeelden",
    uc1: "Landbouwactiviteiten zoals zaaien en oogsten plannen op basis van de maankalender.",
    uc2: "De maanfase controleren voor nachtfotografie en amateurastronomie.",
    uc3: "Rituelen, spirituele praktijken en meditaties geleid door de maancyclus.",
    uc4: "Algemene nieuwsgierigheid over de maancyclus en basisastronomisch onderwijs.",
    faq_title: "Vragen & Antwoorden",
    faq1q: "Hoe wordt de maanfase berekend?",
    faq1a: "De berekening is gebaseerd op de synodische cyclus van de maan, die gemiddeld 29,53 dagen duurt. Uitgaande van een bekende nieuwemaandatum berekenen we op welk punt in de cyclus we vandaag zijn.",
    faq2q: "Waarom ziet de afbeelding van de maan er anders uit op het zuidelijk halfrond?",
    faq2a: "De maan verschijnt gespiegeld afhankelijk van het halfrond. In Australië en andere zuidelijke landen verschijnt de sikkel aan de tegenovergestelde kant vergeleken met het noordelijk halfrond.",
    faq3q: "Is het verlichtingspercentage nauwkeurig?",
    faq3a: "De weergegeven verlichting is een goede benadering op basis van de gemiddelde maancyclus. Voor zeer nauwkeurige astronomische berekeningen raden we gespecialiseerde software aan.",
    see1: "Leeftijdscalculator",
    see2: "Datumsverschil berekenen",
    see3: "Calculator voor toekomstige datum",
    see4: "Unix Timestamp-converter",
    explain_title: "De Maanfasen Begrijpen",
    explain_desc: "De maancyclus (of synodische maand) duurt ongeveer 29,5 dagen en is onderverdeeld in 8 hoofdfasen, die het deel van de maan weerspiegelen dat vanaf de aarde gezien door de zon wordt verlicht. Ontdek de kenmerken van elke fase:",
    p_new_title: "Nieuwe Maan",
    p_new_desc: "De maan staat tussen de aarde en de zon. De verlichte zijde is naar de zon gekeerd, waardoor de maan voor ons aan de nachthemel volledig onzichtbaar is.",
    p_wc_title: "Wassende Maansikkel",
    p_wc_desc: "Een dunne lichtrand begint aan de zijkant te verschijnen. Dit markiert het begin van de reis van de maan uit de donkere fase naar volledige verlichting.",
    p_fq_title: "Eerste Kwartier",
    p_fq_desc: "Precies de helft van de maanschijf wordt zichtbaar en verlicht. De maan heeft sinds de Nieuwe Maan een kwart van haar baan om de aarde voltooid.",
    p_wg_title: "Wassende Gebochelde Maan",
    p_wg_desc: "Meer dan de helft van het maanoppervlak is verlicht en groeit elke dag, maar heeft nog niet de volledige cirkelvorm van de Volle Maan bereikt.",
    p_full_title: "Volle Maan",
    p_full_desc: "De gehele vanaf de aarde zichtbare zijde van de maan is 100% verlicht door de zon en straalt de hele nacht door in volle glorie aan de hemel.",
    p_wng_title: "Afnemende Gebochelde Maan",
    p_wng_desc: "Na de volle fase begint het verlichte deel geleidelijk te krimpen, hoewel nog steeds meer dan de helft van de maan zichtbaar is.",
    p_lq_title: "Laatste Kwartier",
    p_lq_desc: "De tegenovergestelde helft van de maanschijf (vergeleken met het Eerste Kwartier) is verlicht en markeert het laatste kwartier van de baan in de maancyclus.",
    p_wnc_title: "Afnemende Maansikkel",
    p_wnc_desc: "Er blijft slechts een dunne maansikkel zichtbaar aan de hemel. Dit is de laatste fase van de cyclus voordat deze opnieuw begint met een nieuwe Nieuwe Maan.",
    illus_term_title: "Wat is de Verlichting van de Maan?",
    illus_term_desc: "De verlichting (of helderheid) vertegenwoordigt het percentage van de naar de aarde gerichte zijde van de maan dat direct zonlicht ontvangt en dit naar de aarde reflecteert. Dit percentage varieert voortdurend van 0% (Nieuwe Maan) tot 100% (Volle Maan) terwijl de maan om onze planeet draait.",
    age_term_title: "Wat is de Maanleeftijd?",
    age_term_desc: "De maanleeftijd geeft het aantal dagen aan dat is verstreken sinds de laatste Nieuwe Maan. Omdat de gemiddelde volledige cyclus (synodische maand) 29,53 dagen duurt, varieert deze waarde tussen 0 en 29,5, wat de exacte voortgang in de huidige lunatie aangeeft."
  },
  ru: {
    pageTitle: "Фаза Луны Сегодня — Какая Фаза Луны Сейчас? | Бесплатно",
    title: "Фаза Луны Сегодня",
    meta: "Проверьте текущую фазу Луны сегодня ночью: новолуние, растущая, полнолуние или убывающая. Смотрите процент освещенности и обратный отсчет до следующей фазы.",
    loading: "Расчет фазы Луны на сегодня…",
    lunation: "Лунация №{n}",
    new_moon: "Новолуние",
    waxing_crescent: "Молодая Луна",
    first_quarter: "Первая Четверть",
    waxing_gibbous: "Растущая Луна",
    full_moon: "Полнолуние",
    waning_gibbous: "Убывающая Луна",
    last_quarter: "Третья Четверть",
    waning_crescent: "Старая Луна",
    unknown_phase: "Неизвестная Фаза",
    growing: "растет",
    shrinking: "убывает",
    illumination: "Сегодня Луна освещена на {pct}% и {direction}.",
    illumination_full: "Сегодня Луна освещена на {pct}% — пик яркости цикла.",
    illumination_new: "Луна практически не видна — цикл начинается заново.",
    day_singular: "1 день",
    day_plural: "{n} дн.",
    hour_singular: "1 час",
    hour_plural: "{n} ч.",
    minute_singular: "1 минута",
    minute_plural: "{n} мин.",
    connector: "и",
    less_than_minute: "меньше 1 минуты",
    next_phase: "До фазы {phase} осталось {time}.",
    moon_age: "Возраст Луны",
    moon_age_value_singular: "1.0 день лунного цикла",
    moon_age_value_plural: "{days} дн. лунного цикла",
    hemisphere: "Полушарие",
    northern: "Северное",
    southern: "Южное",
    features_title: "Возможности",
    f_1: "Текущая фаза Луны с названием и изображением в реальном времени",
    f_2: "Приблизительный процент освещенности Луны",
    f_3: "Обратный отсчет до следующей главной лунной фазы",
    f_4: "Поддержка Южного полушария (зеркальное отображение Луны)",
    how_to_use_title: "Как использовать",
    how_desc: "Инструмент автоматически рассчитывает фазу Луны на основе сегодняшней даты, используя средний синодический цикл 29,53 дня. Все расчеты выполняются прямо в вашем браузере, без запросов к внешним серверам.",
    step_1_title: "Смотрите текущую фазу",
    step_1_desc: "При открытии страницы автоматически отображается сегодняшняя фаза Луны с ее названием, изображением и процентом освещенности.",
    step_2_title: "Выберите ваше полушарие",
    step_2_desc: "Если вы находитесь в Южном полушарии, выберите «Южное», чтобы увидеть изображение Луны в правильном ракурсе.",
    step_3_title: "Проверьте следующую фазу",
    step_3_desc: "Посмотрите, сколько времени осталось до следующей главной фазы: первой четверти, полнолуния, третьей четверти или новолуния.",
    use_cases_title: "Примеры использования",
    uc1: "Планирование сельскохозяйственных работ, таких как посадка и сбор урожая по лунному календарю.",
    uc2: "Проверка фазы Луны для ночной фотографии и любительской астрономии.",
    uc3: "Ритуалы, духовные практики и медитации, ориентированные на лунный цикл.",
    uc4: "Общее любопытство к циклу Луны и базовое астрономическое образование.",
    faq_title: "Вопросы и ответы",
    faq1q: "Как рассчитывается фаза Луны?",
    faq1a: "Расчет основан на синодическом цикле Луны, который в среднем составляет 29,53 дня. Начиная с известной даты новолуния, мы вычисляем, в какой точке цикла мы находимся сегодня, чтобы определить текущую фазу.",
    faq2q: "Почему изображение Луны выглядит по-разному в Северном и Южном полушариях?",
    faq2a: "Луна кажется зеркально отраженной в зависимости от полушария. В странах Южного полушария полумесяц виден с противоположной стороны по сравнению с Северным полушарием. Поэтому мы предлагаем переключатель полушарий.",
    faq3q: "Точен ли процент освещенности?",
    faq3a: "Показанная освещенность является хорошим приближением на основе среднего лунного цикла. Для высокоточных астрономических расчетов, учитывающих эллиптическую орбиту Луны, мы рекомендуем специализированное ПО.",
    see1: "Калькулятор возраста",
    see2: "Расчет разницы между датами",
    see3: "Калькулятор будущей даты",
    see4: "Конвертер Unix Timestamp",
    explain_title: "Разберитесь в фазах Луны",
    explain_desc: "Лунный цикл (синодический месяц) длится около 29,5 дней и делится на 8 различных фаз, отражающих долю Луны, освещенную Солнцем с точки зрения Земли. Узнайте о каждой фазе:",
    p_new_title: "Новолуние",
    p_new_desc: "Луна находится между Землей и Солнцем. Ее освещенная сторона обращена к Солнцу, что делает ее совершенно невидимой для нас на ночном небе.",
    p_wc_title: "Молодая Луна",
    p_wc_desc: "На краю диска начинает появляться узкая полоска света. Это знаменяет начало пути Луны от темноты к полному освещению.",
    p_fq_title: "Первая Четверть",
    p_fq_desc: "Освещена ровно половина лунного диска. Луна завершила четверть своей орбиты вокруг Земли с момента Новолуния.",
    p_wg_title: "Растущая Луна",
    p_wg_desc: "Освещено более половины поверхности Луны, она увеличивается с каждым днем, но еще не достигла полного круга Полнолуния.",
    p_full_title: "Полнолуние",
    p_full_desc: "Вся видимая сторона Луны на 100% освещена Солнцем, сияя на пике своей яркости на ночном небе всю ночь.",
    p_wng_title: "Убывающая Луна",
    p_wng_desc: "После полной фазы освещенная поверхность начинает постепенно уменьшаться, хотя более половины Луны остается видимой.",
    p_lq_title: "Третья Четверть",
    p_lq_desc: "Освещена противоположная половина лунного диска (по сравнению с Первой Четвертью), знаменуя последнюю четверть лунной орбиты.",
    p_wnc_title: "Старая Луна",
    p_wnc_desc: "Видимым остается лишь тонкий серебряный изогнутый серп света. Это последняя фаза цикла перед его сбросом обратно к Новолунию.",
    illus_term_title: "Что такое освещенность Луны?",
    illus_term_desc: "Освещенность представляет собой процентную долю видимой стороны Луны, отражающей солнечный свет на Землю. Она варьируется от 0% (новолуние) до 100% (полнолуние) по мере изменения взаимного расположения Земли, Луны и Солнца.",
    age_term_title: "Что такое возраст Луны?",
    age_term_desc: "Возраст Луны — это количество дней, прошедших с момента последнего новолуния. Поскольку полный лунный цикл длится в среднем 29,53 дня (синодический месяц), возраст колеблется от 0 до 29,5 дней, показывая точное положение Луны в ее цикле."
  }
}
</i18n>