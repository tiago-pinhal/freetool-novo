<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/moment@2.30.1/moment.min.js', { trigger: 'client' })

const { t } = useI18n({ useScope: 'local' })

// ---------------------------------------------------------------------------
// Reference years for the static SEO "Examples" section.
// These capture the long-tail cluster "born in X, how old am I" without
// requiring user interaction. Rendered on the server so search engines
// can index the computed ages.
// ---------------------------------------------------------------------------
const EXAMPLE_YEARS = [1990, 2000, 2005, 2010] as const

interface ExampleAge {
  year: number
  years: number
  yearsNextBirthday: number
}

/**
 * Compute the current age (in completed years) for a given birth year,
 * assuming birth date is January 1st of that year. Pure function that
 * works in both SSR and client environments — no moment.js dependency.
 */
function computeAgeFromYear(birthYear: number, today: Date): ExampleAge {
  const birth = new Date(Date.UTC(birthYear, 0, 1))
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

  let years = todayUtc.getUTCFullYear() - birth.getUTCFullYear()

  // Adjust if the anniversary hasn't happened yet this year.
  const hasHadBirthday =
    todayUtc.getUTCMonth() > birth.getUTCMonth() ||
    (todayUtc.getUTCMonth() === birth.getUTCMonth() && todayUtc.getUTCDate() >= birth.getUTCDate())

  if (!hasHadBirthday) years -= 1

  return {
    year: birthYear,
    years,
    yearsNextBirthday: years + 1
  }
}

// Computed once at setup time. The 1-day staleness between SSR and client
// hydration is irrelevant for age display, and useState ensures SSR/CSR
// consistency without hydration mismatches.
const examples = useState<ExampleAge[]>('age-calc-examples', () => {
  const now = new Date()
  return EXAMPLE_YEARS.map(year => computeAgeFromYear(year, now))
})

// ---------------------------------------------------------------------------
// Interactive calculator state (unchanged behavior).
// ---------------------------------------------------------------------------
const state = reactive({
  dt: '',
  decompYears: 0,
  decompMonths: 0,
  decompWeeks: 0,
  decompDays: 0,
  totalMonths: 0,
  totalWeeks: 0,
  totalDays: 0,
  weekDay: null as number | null,
  err: false,
  ads: false,
  ready: false
})

const todayStr = computed(() => new Date().toISOString().slice(0, 10))

watch(() => state.dt, () => calc())

function calc() {
  state.ready = false
  state.err = false
  state.weekDay = null

  if (!state.dt) return

  const moment = (window as any).moment
  if (!moment) return

  const today = moment().startOf('day')
  const birth = moment(state.dt).startOf('day')

  if (birth.isSameOrAfter(today)) {
    state.err = true
    return
  }

  let cursor = birth.clone()
  state.decompYears = today.diff(cursor, 'years')
  cursor.add(state.decompYears, 'years')
  state.decompMonths = today.diff(cursor, 'months')
  cursor.add(state.decompMonths, 'months')
  state.decompWeeks = today.diff(cursor, 'weeks')
  cursor.add(state.decompWeeks, 'weeks')
  state.decompDays = today.diff(cursor, 'days')

  state.totalDays = today.diff(birth, 'days')
  state.totalWeeks = Math.floor(state.totalDays / 7)
  state.totalMonths = today.diff(birth, 'months')
  state.weekDay = birth.day()
  state.ready = true
  if (!state.ads) state.ads = true
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') },
    { question: t('faq_6_q'), answer: t('faq_6_a') },
    { question: t('faq_7_q'), answer: t('faq_7_a') }
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }]
})

defineI18nRoute({
  paths: {
    en: '/age-calculator',
    pt: '/calculadora-de-idade',
    es: '/calculadora-de-edad',
    fr: '/calculateur-d-age',
    it: '/calcolatrice-dell-eta',
    id: '/kalkulator-usia',
    de: '/alter-rechner',
    nl: '/leeftijdscalculator',
    ru: '/kalkulyator-vozrasta'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'birthday-generator' },
      { label: t('see2'), to: 'date-difference' },
      { label: t('see3'), to: 'future-date-calculator' },
      { label: t('see4'), to: 'past-date-calculator' }
    ]"
  >
    <!-- Input -->
    <div class="mb-6">
      <div class="form-control w-fit flex flex-col">
        <label class="label pb-1" for="birth-date">
          <span class="label-text font-bold text-base-content/80">{{ t('dt') }}</span>
        </label>
        <input
          id="birth-date"
          type="date"
          v-model="state.dt"
          :max="todayStr"
          class="input input-bordered w-full sm:w-52"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-if="state.err" class="alert alert-error mb-4">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 shrink-0" />
      <span>{{ t('err') }}</span>
    </div>

    <!-- Results -->
    <div v-if="state.ready" class="space-y-4">
      <!-- Decomposed age -->
      <div>
        <p class="text-xs uppercase tracking-widest text-base-content/50 mb-2">{{ t('age') }}</p>
        <div class="stats shadow w-fit border border-base-content/10">
          <div v-if="state.decompYears > 0" class="stat text-center">
            <div class="stat-title">{{ t('years_label') }}</div>
            <div class="stat-value text-primary">{{ state.decompYears }}</div>
          </div>
          <div v-if="state.decompMonths > 0" class="stat text-center">
            <div class="stat-title">{{ t('months_label') }}</div>
            <div class="stat-value text-primary">{{ state.decompMonths }}</div>
          </div>
          <div v-if="state.decompWeeks > 0" class="stat text-center">
            <div class="stat-title">{{ t('weeks_label') }}</div>
            <div class="stat-value text-primary">{{ state.decompWeeks }}</div>
          </div>
          <div v-if="state.decompDays > 0" class="stat text-center">
            <div class="stat-title">{{ t('days_label') }}</div>
            <div class="stat-value text-primary">{{ state.decompDays }}</div>
          </div>
        </div>
      </div>

      <!-- Totals -->
      <div>
        <p class="text-xs uppercase tracking-widest text-base-content/50 mb-2">{{ t('or') }}</p>
        <div class="stats stats-vertical lg:stats-horizontal shadow w-fit border border-base-content/10">
          <div v-if="state.totalMonths > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_months_label') }}</div>
            <div class="stat-value text-3xl">{{ state.totalMonths.toLocaleString() }}</div>
          </div>
          <div v-if="state.totalWeeks > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_weeks_label') }}</div>
            <div class="stat-value text-3xl">{{ state.totalWeeks.toLocaleString() }}</div>
          </div>
          <div v-if="state.totalDays > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_days_label') }}</div>
            <div class="stat-value text-3xl">{{ state.totalDays.toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- Day of week -->
      <div v-if="state.weekDay !== null">
        <div class="stats shadow w-fit border border-base-content/10">
          <div class="stat text-center">
            <div class="stat-title">{{ t('week_day') }}</div>
            <div class="stat-value text-2xl">{{ t(`day_${state.weekDay}`) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder -->
    <div v-if="!state.ready && !state.err" class="text-center opacity-70 py-8">
      <Icon name="heroicons:cake" class="w-16 h-16 mx-auto mb-2" />
      <p class="font-medium italic">{{ t('placeholder') }}</p>
    </div>

    <template #info>
      <div class="space-y-8">
        <div>
          <p>{{ t('desc') }}</p>
        </div>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_it_works_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <!-- Examples section: SSR-rendered for SEO long-tail capture -->
        <section>
          <h2 class="text-xl font-bold mb-2">{{ t('examples_title') }}</h2>
          <p class="mb-4 text-base-content/80">{{ t('examples_intro') }}</p>
          <ul class="space-y-2">
            <li
              v-for="ex in examples"
              :key="ex.year"
              class="bg-base-200/50 border border-base-content/10 rounded-lg px-4 py-3"
            >
              <strong>{{ t('examples_item_q', { year: ex.year }) }}</strong>
              <span class="block text-base-content/80 mt-1">
                {{ t('examples_item_a', { years: ex.years, yearsNext: ex.yearsNextBirthday }) }}
              </span>
            </li>
          </ul>
        </section>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
            { question: t('faq_5_q'), answer: t('faq_5_a') },
            { question: t('faq_6_q'), answer: t('faq_6_a') },
            { question: t('faq_7_q'), answer: t('faq_7_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "Age Calculator - How Old Am I?",
    title: "Age Calculator",
    meta: "Find out how old you are with this free age calculator. Enter your date of birth and instantly see your exact age in years, months, weeks, and days.",
    dt: "Date of birth",
    age: "Your age",
    or: "or",
    err: "Please enter a date before today",
    placeholder: "Enter your date of birth above",
    years: "year|years",
    months: "month|months",
    weeks: "week|weeks",
    days: "day|days",
    years_label: "Years",
    months_label: "Months",
    weeks_label: "Weeks",
    days_label: "Days",
    total_months_label: "Total Months",
    total_weeks_label: "Total Weeks",
    total_days_label: "Total Days",
    week_day: "Day of the week",
    day_0: "Sunday",
    day_1: "Monday",
    day_2: "Tuesday",
    day_3: "Wednesday",
    day_4: "Thursday",
    day_5: "Friday",
    day_6: "Saturday",
    desc: "This free age calculator precisely calculates how long you have been alive based on your date of birth. The result goes beyond a simple number of years: it is presented in full detail, with your age broken down into years, months, weeks, and days, as well as in total units, such as how many months or how many days you have lived.",
    use_cases_title: "Use Cases",
    uc_1_title: "Know Your Exact Age",
    uc_1_desc: "Find out precisely how old you are in years, months, weeks, and days.",
    uc_2_title: "Calculate Anyone's Age",
    uc_2_desc: "Enter any birth date to find out the exact age of a child, parent, patient, or client.",
    uc_3_title: "Official Documents",
    uc_3_desc: "Quickly verify your age for forms, contracts, or age-restricted services.",
    uc_4_title: "Health & Fitness",
    uc_4_desc: "Track age-related milestones and health benchmarks with precision.",
    how_it_works_title: "How It Works",
    step_1_title: "Enter Birth Date",
    step_1_desc: "Select your date of birth using the date picker field.",
    step_2_title: "Instant Calculation",
    step_2_desc: "Your age is calculated automatically as soon as you select a date.",
    step_3_title: "See Results",
    step_3_desc: "View your age broken down into years, months, weeks, and days, plus alternative representations.",
    examples_title: "Common Examples",
    examples_intro: "A quick reference for those wondering how old they are based on common birth years. The values below are updated automatically.",
    examples_item_q: "If you were born in {year}, how old are you?",
    examples_item_a: "You are currently {years} years old, or {yearsNext} if you have already had your birthday this year.",
    faq_title: "Questions and Answers",
    faq_1_q: "How is the age calculated?",
    faq_1_a: "We calculate the exact difference between your birth date and today, decomposed into years, months, weeks, and days.",
    faq_2_q: "Is this calculator accurate?",
    faq_2_a: "Yes. It uses precise date arithmetic that accounts for leap years and varying month lengths.",
    faq_3_q: "What does 'or...' mean in the results?",
    faq_3_a: "It shows alternative ways to express your age, for example your total age expressed entirely in months or entirely in weeks.",
    faq_4_q: "How do I find out how old I am from my date of birth?",
    faq_4_a: "Simply enter your date of birth in the field above. The calculator instantly compares it with today's date and shows the result in years, months, weeks, and days.",
    faq_5_q: "Does the calculator work for any age?",
    faq_5_a: "Yes. It works for any birth date in the past, from young children to centenarians. The only restriction is that the date entered must be earlier than today.",
    faq_6_q: "Can I calculate the age on a specific date instead of today?",
    faq_6_a: "This calculator uses today's date as a reference. To compare two arbitrary dates, use our date difference tool, which returns the interval between any two dates.",
    faq_7_q: "Why does the result show weeks and days separately?",
    faq_7_a: "Breaking the age down into years, months, weeks, and days provides a more complete view than the year number alone. It is useful for monitoring babies, anniversaries, and personal milestones.",
    see1: "Birthday Generator",
    see2: "Date Difference",
    see3: "Future Date Calculator",
    see4: "Past Date Calculator"
  },
  pt: {
    pageTitle: "Calculadora de Idade - Quantos Anos Eu Tenho?",
    title: "Calculadora de Idade",
    meta: "Descubra quantos anos você tem com esta calculadora de idade online grátis. Informe sua data de nascimento e veja sua idade exata em anos, meses, semanas e dias.",
    dt: "Data de nascimento",
    age: "Sua idade",
    or: "ou",
    err: "Insira uma data anterior à data de hoje",
    placeholder: "Informe sua data de nascimento",
    years: "ano|anos",
    months: "mês|meses",
    weeks: "semana|semanas",
    days: "dia|dias",
    years_label: "Anos",
    months_label: "Meses",
    weeks_label: "Semanas",
    days_label: "Dias",
    total_months_label: "Total em Meses",
    total_weeks_label: "Total em Semanas",
    total_days_label: "Total em Dias",
    week_day: "Dia da semana",
    day_0: "Domingo",
    day_1: "Segunda-feira",
    day_2: "Terça-feira",
    day_3: "Quarta-feira",
    day_4: "Quinta-feira",
    day_5: "Sexta-feira",
    day_6: "Sábado",
    desc: "Esta calculadora de idade gratuita calcula com precisão quanto tempo de vida você tem com base na sua data de nascimento. O resultado vai além de um simples número de anos: ele é apresentado de forma completa, com a idade decomposta em anos, meses, semanas e dias, e também em unidades totais, como quantos meses ou quantos dias você já viveu.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Saiba Sua Idade Exata",
    uc_1_desc: "Descubra com precisão quantos anos, meses, semanas e dias você tem.",
    uc_2_title: "Calcular a Idade de Qualquer Pessoa",
    uc_2_desc: "Insira qualquer data de nascimento para descobrir a idade exata de um filho, pai, paciente ou cliente.",
    uc_3_title: "Documentos Oficiais",
    uc_3_desc: "Confirme rapidamente sua idade para formulários, contratos ou serviços com restrição de idade.",
    uc_4_title: "Saúde e Bem-estar",
    uc_4_desc: "Acompanhe marcos relacionados à idade e indicadores de saúde com precisão.",
    how_it_works_title: "Como Funciona",
    step_1_title: "Informe a Data de Nascimento",
    step_1_desc: "Selecione sua data de nascimento usando o campo de data.",
    step_2_title: "Cálculo Instantâneo",
    step_2_desc: "Sua idade é calculada automaticamente assim que você selecionar uma data.",
    step_3_title: "Veja o Resultado",
    step_3_desc: "Visualize sua idade em anos, meses, semanas e dias, além de representações alternativas.",
    examples_title: "Exemplos Comuns",
    examples_intro: "Uma referência rápida para quem quer saber quantos anos tem com base em anos de nascimento comuns. Os valores abaixo são atualizados automaticamente.",
    examples_item_q: "Se eu nasci em {year}, quantos anos eu tenho?",
    examples_item_a: "Você tem atualmente {years} anos, ou {yearsNext} se já fez aniversário este ano.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Como a idade é calculada?",
    faq_1_a: "Calculamos a diferença exata entre sua data de nascimento e hoje, decomposta em anos, meses, semanas e dias.",
    faq_2_q: "A calculadora é precisa?",
    faq_2_a: "Sim. Ela usa aritmética de datas precisa que considera anos bissextos e meses com durações diferentes.",
    faq_3_q: "O que significa 'ou...' nos resultados?",
    faq_3_a: "Mostra formas alternativas de expressar sua idade, por exemplo o total expresso apenas em meses ou apenas em semanas.",
    faq_4_q: "Como saber quantos anos eu tenho a partir da data de nascimento?",
    faq_4_a: "Basta informar sua data de nascimento no campo acima. A calculadora compara com a data de hoje e mostra o resultado em anos, meses, semanas e dias instantaneamente.",
    faq_5_q: "A calculadora funciona para qualquer idade?",
    faq_5_a: "Sim. Funciona para qualquer data de nascimento no passado, de crianças pequenas a centenários. A única restrição é que a data informada precisa ser anterior à data atual.",
    faq_6_q: "Posso calcular a idade em uma data específica em vez de hoje?",
    faq_6_a: "Esta calculadora usa a data de hoje como referência. Para comparar duas datas quaisquer, utilize nossa ferramenta de diferença entre datas, que retorna o intervalo entre duas datas arbitrárias.",
    faq_7_q: "Por que o resultado mostra semanas e dias separadamente?",
    faq_7_a: "Decompor a idade em anos, meses, semanas e dias oferece uma visão mais completa do que apenas o número de anos. É útil para acompanhar bebês, aniversários e marcos pessoais.",
    see1: "Gerador de Aniversário",
    see2: "Diferença entre Datas",
    see3: "Calculadora de Data Futura",
    see4: "Calculadora de Data Passada"
  },
  es: {
    pageTitle: "Calculadora de Edad - ¿Cuántos Años Tengo?",
    title: "Calculadora de Edad",
    meta: "Descubre cuántos años tienes con esta calculadora de edad online gratuita. Introduce tu fecha de nacimiento y consulta al instante tu edad exacta en años, meses, semanas y días.",
    dt: "Fecha de nacimiento",
    age: "Tu edad",
    or: "o",
    err: "Introduce una fecha anterior a hoy",
    placeholder: "Introduce tu fecha de nacimiento",
    years: "año|años",
    months: "mes|meses",
    weeks: "semana|semanas",
    days: "día|días",
    years_label: "Años",
    months_label: "Meses",
    weeks_label: "Semanas",
    days_label: "Días",
    total_months_label: "Total Meses",
    total_weeks_label: "Total Semanas",
    total_days_label: "Total Días",
    week_day: "Día de la semana",
    day_0: "Domingo",
    day_1: "Lunes",
    day_2: "Martes",
    day_3: "Miércoles",
    day_4: "Jueves",
    day_5: "Viernes",
    day_6: "Sábado",
    desc: "Esta calculadora de edad gratuita calcula con precisión cuánto tiempo has vivido a partir de tu fecha de nacimiento. El resultado va más allá de un simple número de años: se presenta de forma completa, con la edad descompuesta en años, meses, semanas y días, y también en unidades totales, como cuántos meses o días has vivido.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Conoce Tu Edad Exacta",
    uc_1_desc: "Descubre con precisión cuántos años, meses, semanas y días tienes.",
    uc_2_title: "Calcular la Edad de Cualquier Persona",
    uc_2_desc: "Introduce cualquier fecha de nacimiento para conocer la edad exacta de un hijo, padre, paciente o cliente.",
    uc_3_title: "Documentos Oficiales",
    uc_3_desc: "Verifica rápidamente tu edad para formularios, contratos o servicios con restricción de edad.",
    uc_4_title: "Salud y Bienestar",
    uc_4_desc: "Sigue hitos relacionados con la edad e indicadores de salud con precisión.",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Introduce la Fecha de Nacimiento",
    step_1_desc: "Selecciona tu fecha de nacimiento utilizando el campo de fecha.",
    step_2_title: "Cálculo Instantáneo",
    step_2_desc: "Tu edad se calcula automáticamente en cuanto seleccionas una fecha.",
    step_3_title: "Consulta los Resultados",
    step_3_desc: "Visualiza tu edad en años, meses, semanas y días, además de representaciones alternativas.",
    examples_title: "Ejemplos Comunes",
    examples_intro: "Una referencia rápida para quienes quieren saber cuántos años tienen a partir de años de nacimiento comunes. Los valores siguientes se actualizan automáticamente.",
    examples_item_q: "Si nací en {year}, ¿cuántos años tengo?",
    examples_item_a: "Actualmente tienes {years} años, o {yearsNext} si ya cumpliste años este año.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cómo se calcula la edad?",
    faq_1_a: "Calculamos la diferencia exacta entre tu fecha de nacimiento y hoy, descompuesta en años, meses, semanas y días.",
    faq_2_q: "¿Esta calculadora es precisa?",
    faq_2_a: "Sí. Utiliza aritmética de fechas precisa que tiene en cuenta los años bisiestos y los meses de duración variable.",
    faq_3_q: "¿Qué significa 'o...' en los resultados?",
    faq_3_a: "Muestra formas alternativas de expresar tu edad, por ejemplo tu edad total expresada solo en meses o solo en semanas.",
    faq_4_q: "¿Cómo saber cuántos años tengo a partir de mi fecha de nacimiento?",
    faq_4_a: "Solo introduce tu fecha de nacimiento en el campo de arriba. La calculadora la compara con la fecha de hoy y muestra el resultado en años, meses, semanas y días al instante.",
    faq_5_q: "¿La calculadora funciona para cualquier edad?",
    faq_5_a: "Sí. Funciona para cualquier fecha de nacimiento en el pasado, desde niños pequeños hasta centenarios. La única restricción es que la fecha introducida sea anterior a la fecha actual.",
    faq_6_q: "¿Puedo calcular la edad en una fecha específica en lugar de hoy?",
    faq_6_a: "Esta calculadora usa la fecha de hoy como referencia. Para comparar dos fechas cualesquiera, utiliza nuestra herramienta de diferencia entre fechas, que devuelve el intervalo entre dos fechas arbitrarias.",
    faq_7_q: "¿Por qué el resultado muestra semanas y días por separado?",
    faq_7_a: "Descomponer la edad en años, meses, semanas y días ofrece una visión más completa que solo el número de años. Es útil para hacer seguimiento de bebés, aniversarios e hitos personales.",
    see1: "Generador de Cumpleaños",
    see2: "Diferencia entre Fechas",
    see3: "Calculadora de Fecha Futura",
    see4: "Calculadora de Fecha Pasada"
  },
  fr: {
    pageTitle: "Calculateur d'Âge - Quel Âge Ai-je?",
    title: "Calculateur d'Âge",
    meta: "Découvrez quel âge vous avez avec ce calculateur d'âge en ligne gratuit. Saisissez votre date de naissance et obtenez instantanément votre âge exact en années, mois, semaines et jours.",
    dt: "Date de naissance",
    age: "Votre âge",
    or: "ou",
    err: "Veuillez saisir une date antérieure à aujourd'hui",
    placeholder: "Saisissez votre date de naissance",
    years: "an|ans",
    months: "mois|mois",
    weeks: "semaine|semaines",
    days: "jour|jours",
    years_label: "Années",
    months_label: "Mois",
    weeks_label: "Semaines",
    days_label: "Jours",
    total_months_label: "Total Mois",
    total_weeks_label: "Total Semaines",
    total_days_label: "Total Jours",
    week_day: "Jour de la semaine",
    day_0: "Dimanche",
    day_1: "Lundi",
    day_2: "Mardi",
    day_3: "Mercredi",
    day_4: "Jeudi",
    day_5: "Vendredi",
    day_6: "Samedi",
    desc: "Ce calculateur d'âge gratuit calcule précisément depuis combien de temps vous vivez à partir de votre date de naissance. Le résultat va bien au-delà d'un simple nombre d'années : il est présenté de manière complète, avec l'âge décomposé en années, mois, semaines et jours, ainsi qu'en unités totales, comme le nombre de mois ou de jours que vous avez vécus.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Connaître Votre Âge Exact",
    uc_1_desc: "Découvrez précisément votre âge en années, mois, semaines et jours.",
    uc_2_title: "Calculer l'Âge de N'importe Qui",
    uc_2_desc: "Entrez n'importe quelle date de naissance pour connaître l'âge exact d'un enfant, parent, patient ou client.",
    uc_3_title: "Documents Officiels",
    uc_3_desc: "Vérifiez rapidement votre âge pour des formulaires, contrats ou services à accès restreint.",
    uc_4_title: "Santé et Bien-être",
    uc_4_desc: "Suivez les étapes liées à l'âge et les indicateurs de santé avec précision.",
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Entrez la Date de Naissance",
    step_1_desc: "Sélectionnez votre date de naissance à l'aide du champ de date.",
    step_2_title: "Calcul Instantané",
    step_2_desc: "Votre âge est calculé automatiquement dès que vous sélectionnez une date.",
    step_3_title: "Voir les Résultats",
    step_3_desc: "Visualisez votre âge en années, mois, semaines et jours, ainsi que des représentations alternatives.",
    examples_title: "Exemples Courants",
    examples_intro: "Une référence rapide pour ceux qui se demandent quel âge ils ont en fonction d'années de naissance courantes. Les valeurs ci-dessous sont mises à jour automatiquement.",
    examples_item_q: "Si je suis né en {year}, quel âge ai-je ?",
    examples_item_a: "Vous avez actuellement {years} ans, ou {yearsNext} si vous avez déjà fêté votre anniversaire cette année.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Comment l'âge est-il calculé ?",
    faq_1_a: "Nous calculons la différence exacte entre votre date de naissance et aujourd'hui, décomposée en années, mois, semaines et jours.",
    faq_2_q: "Ce calculateur est-il précis ?",
    faq_2_a: "Oui. Il utilise une arithmétique de dates précise qui tient compte des années bissextiles et des mois de longueurs variables.",
    faq_3_q: "Que signifie 'ou...' dans les résultats ?",
    faq_3_a: "Cela montre des façons alternatives d'exprimer votre âge, par exemple votre âge total exprimé uniquement en mois ou en semaines.",
    faq_4_q: "Comment savoir quel âge j'ai à partir de ma date de naissance ?",
    faq_4_a: "Il suffit de saisir votre date de naissance dans le champ ci-dessus. Le calculateur la compare à la date du jour et affiche instantanément le résultat en années, mois, semaines et jours.",
    faq_5_q: "Le calculateur fonctionne-t-il pour tout âge ?",
    faq_5_a: "Oui. Il fonctionne pour toute date de naissance passée, des jeunes enfants aux centenaires. La seule restriction est que la date saisie doit être antérieure à la date actuelle.",
    faq_6_q: "Puis-je calculer l'âge à une date précise au lieu d'aujourd'hui ?",
    faq_6_a: "Ce calculateur utilise la date du jour comme référence. Pour comparer deux dates quelconques, utilisez notre outil de différence entre dates, qui retourne l'intervalle entre deux dates arbitraires.",
    faq_7_q: "Pourquoi le résultat affiche-t-il les semaines et les jours séparément ?",
    faq_7_a: "Décomposer l'âge en années, mois, semaines et jours offre une vision plus complète que le simple nombre d'années. C'est utile pour suivre les bébés, les anniversaires et les jalons personnels.",
    see1: "Générateur de Date de Naissance",
    see2: "Différence entre Dates",
    see3: "Calculatrice de Date Future",
    see4: "Calculatrice de Date Passée"
  },
  it: {
    pageTitle: "Calcolatrice dell'Età - Quanti Anni Ho?",
    title: "Calcolatrice dell'Età",
    meta: "Scopri quanti anni hai con questa calcolatrice dell'età online gratuita. Inserisci la tua data di nascita e visualizza immediatamente la tua età esatta in anni, mesi, settimane e giorni.",
    dt: "Data di nascita",
    age: "La tua età",
    or: "o",
    err: "Inserisci una data precedente ad oggi",
    placeholder: "Inserisci la tua data di nascita",
    years: "anno|anni",
    months: "mese|mesi",
    weeks: "settimana|settimane",
    days: "giorno|giorni",
    years_label: "Anni",
    months_label: "Mesi",
    weeks_label: "Settimane",
    days_label: "Giorni",
    total_months_label: "Totale Mesi",
    total_weeks_label: "Totale Settimane",
    total_days_label: "Totale Giorni",
    week_day: "Giorno della settimana",
    day_0: "Domenica",
    day_1: "Lunedì",
    day_2: "Martedì",
    day_3: "Mercoledì",
    day_4: "Giovedì",
    day_5: "Venerdì",
    day_6: "Sabato",
    desc: "Questa calcolatrice dell'età gratuita calcola con precisione quanto tempo di vita hai in base alla tua data di nascita. Il risultato va oltre un semplice numero di anni: viene presentato in modo completo, con l'età scomposta in anni, mesi, settimane e giorni, e anche in unità totali, come quanti mesi o quanti giorni hai vissuto.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Conosci la Tua Età Esatta",
    uc_1_desc: "Scopri con precisione quanti anni, mesi, settimane e giorni hai.",
    uc_2_title: "Calcolare l'Età di Chiunque",
    uc_2_desc: "Inserisci qualsiasi data di nascita per scoprire l'età esatta di un figlio, genitore, paziente o cliente.",
    uc_3_title: "Documenti Ufficiali",
    uc_3_desc: "Verifica rapidamente la tua età per moduli, contratti o servizi con restrizioni di età.",
    uc_4_title: "Salute e Benessere",
    uc_4_desc: "Monitora traguardi legati all'età e indicatori di salute con precisione.",
    how_it_works_title: "Come Funziona",
    step_1_title: "Inserisci la Data di Nascita",
    step_1_desc: "Seleziona la tua data di nascita utilizzando il campo data.",
    step_2_title: "Calcolo Istantaneo",
    step_2_desc: "La tua età viene calcolata automaticamente non appena selezioni una data.",
    step_3_title: "Visualizza i Risultati",
    step_3_desc: "Visualizza la tua età in anni, mesi, settimane e giorni, più rappresentazioni alternative.",
    examples_title: "Esempi Comuni",
    examples_intro: "Un riferimento rapido per chi vuole sapere quanti anni ha in base ad anni di nascita comuni. I valori riportati di seguito si aggiornano automaticamente.",
    examples_item_q: "Se sono nato nel {year}, quanti anni ho?",
    examples_item_a: "Attualmente hai {years} anni, o {yearsNext} se hai già compiuto gli anni quest'anno.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Come viene calcolata l'età?",
    faq_1_a: "Calcoliamo la differenza esatta tra la tua data di nascita e oggi, scomposta in anni, mesi, settimane e giorni.",
    faq_2_q: "Questa calcolatrice è accurata?",
    faq_2_a: "Sì. Utilizza un'aritmetica delle date precisa che tiene conto degli anni bisestili e delle diverse durate dei mesi.",
    faq_3_q: "Cosa significa 'o...' nei risultati?",
    faq_3_a: "Mostra modi alternativi per esprimere la tua età, ad esempio la tua età totale espressa interamente in mesi o in settimane.",
    faq_4_q: "Come faccio a sapere quanti anni ho a partire dalla mia data di nascita?",
    faq_4_a: "È sufficiente inserire la tua data di nascita nel campo qui sopra. La calcolatrice la confronta con la data odierna e mostra immediatamente il risultato in anni, mesi, settimane e giorni.",
    faq_5_q: "La calcolatrice funziona per qualsiasi età?",
    faq_5_a: "Sì. Funziona per qualsiasi data di nascita nel passato, dai bambini piccoli ai centenari. L'unica restrizione è che la data inserita sia precedente alla data attuale.",
    faq_6_q: "Posso calcolare l'età a una data specifica invece di oggi?",
    faq_6_a: "Questa calcolatrice usa la data di oggi come riferimento. Per confrontare due date qualsiasi, utilizza il nostro strumento di differenza tra date, che restituisce l'intervallo tra due date arbitrarie.",
    faq_7_q: "Perché il risultato mostra separatamente settimane e giorni?",
    faq_7_a: "Scomporre l'età in anni, mesi, settimane e giorni offre una visione più completa rispetto al solo numero di anni. È utile per monitorare neonati, anniversari e tappe personali.",
    see1: "Generatore di Compleanno",
    see2: "Differenza tra Date",
    see3: "Calcolatrice Data Futura",
    see4: "Calcolatrice Data Passata"
  },
  id: {
    pageTitle: "Kalkulator Usia - Berapa Umur Saya?",
    title: "Kalkulator Usia",
    meta: "Cari tahu berapa umur Anda dengan kalkulator usia online gratis ini. Masukkan tanggal lahir Anda dan lihat usia pasti dalam tahun, bulan, minggu, dan hari secara instan.",
    dt: "Tanggal lahir",
    age: "Usia Anda",
    or: "atau",
    err: "Masukkan tanggal sebelum hari ini",
    placeholder: "Masukkan tanggal lahir Anda",
    years: "tahun|tahun",
    months: "bulan|bulan",
    weeks: "minggu|minggu",
    days: "hari|hari",
    years_label: "Tahun",
    months_label: "Bulan",
    weeks_label: "Minggu",
    days_label: "Hari",
    total_months_label: "Total Bulan",
    total_weeks_label: "Total Minggu",
    total_days_label: "Total Hari",
    week_day: "Hari dalam minggu",
    day_0: "Minggu",
    day_1: "Senin",
    day_2: "Selasa",
    day_3: "Rabu",
    day_4: "Kamis",
    day_5: "Jumat",
    day_6: "Sabtu",
    desc: "Kalkulator usia gratis ini menghitung secara akurat berapa lama Anda telah hidup berdasarkan tanggal lahir. Hasilnya melampaui sekadar jumlah tahun: ditampilkan secara lengkap, dengan usia diuraikan dalam tahun, bulan, minggu, dan hari, juga dalam satuan total, seperti berapa bulan atau berapa hari Anda telah hidup.",
    use_cases_title: "Kasus Penggunaan",
    uc_1_title: "Ketahui Usia Tepat Anda",
    uc_1_desc: "Cari tahu dengan tepat berapa tahun, bulan, minggu, dan hari usia Anda.",
    uc_2_title: "Hitung Usia Siapa Saja",
    uc_2_desc: "Masukkan tanggal lahir siapa pun untuk mengetahui usia tepat anak, orang tua, pasien, atau klien.",
    uc_3_title: "Dokumen Resmi",
    uc_3_desc: "Verifikasi cepat usia Anda untuk formulir, kontrak, atau layanan dengan batasan usia.",
    uc_4_title: "Kesehatan dan Kebugaran",
    uc_4_desc: "Pantau tonggak sejarah terkait usia dan indikator kesehatan dengan tepat.",
    how_it_works_title: "Cara Kerja",
    step_1_title: "Masukkan Tanggal Lahir",
    step_1_desc: "Pilih tanggal lahir Anda menggunakan kolom tanggal.",
    step_2_title: "Perhitungan Instan",
    step_2_desc: "Usia Anda dihitung secara otomatis begitu Anda memilih tanggal.",
    step_3_title: "Lihat Hasilnya",
    step_3_desc: "Lihat usia Anda dalam tahun, bulan, minggu, dan hari, beserta representasi alternatif.",
    examples_title: "Contoh Umum",
    examples_intro: "Referensi cepat bagi mereka yang ingin tahu berapa umurnya berdasarkan tahun lahir yang umum. Nilai-nilai di bawah ini diperbarui secara otomatis.",
    examples_item_q: "Jika saya lahir pada {year}, berapa umur saya?",
    examples_item_a: "Saat ini Anda berusia {years} tahun, atau {yearsNext} jika Anda sudah berulang tahun tahun ini.",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Bagaimana usia dihitung?",
    faq_1_a: "Kami menghitung perbedaan tepat antara tanggal lahir Anda dan hari ini, diuraikan dalam tahun, bulan, minggu, dan hari.",
    faq_2_q: "Apakah kalkulator ini akurat?",
    faq_2_a: "Ya. Menggunakan aritmatika tanggal yang tepat dengan memperhitungkan tahun kabisat dan panjang bulan yang berbeda.",
    faq_3_q: "Apa arti 'atau...' di hasil?",
    faq_3_a: "Menampilkan cara alternatif untuk mengungkapkan usia Anda, misalnya total usia yang dinyatakan dalam bulan atau minggu saja.",
    faq_4_q: "Bagaimana cara mengetahui umur saya dari tanggal lahir?",
    faq_4_a: "Cukup masukkan tanggal lahir Anda di kolom di atas. Kalkulator membandingkannya dengan tanggal hari ini dan langsung menampilkan hasilnya dalam tahun, bulan, minggu, dan hari.",
    faq_5_q: "Apakah kalkulator bekerja untuk semua usia?",
    faq_5_a: "Ya. Berfungsi untuk tanggal lahir apa pun di masa lalu, dari anak-anak kecil hingga lansia berusia seratus tahun. Satu-satunya batasan adalah tanggal yang dimasukkan harus sebelum tanggal saat ini.",
    faq_6_q: "Bisakah saya menghitung usia pada tanggal tertentu, bukan hari ini?",
    faq_6_a: "Kalkulator ini menggunakan tanggal hari ini sebagai referensi. Untuk membandingkan dua tanggal sembarang, gunakan alat selisih tanggal kami, yang mengembalikan interval antara dua tanggal apa pun.",
    faq_7_q: "Mengapa hasilnya menampilkan minggu dan hari secara terpisah?",
    faq_7_a: "Menguraikan usia dalam tahun, bulan, minggu, dan hari memberikan gambaran yang lebih lengkap dibandingkan hanya jumlah tahun. Berguna untuk memantau bayi, peringatan, dan tonggak pribadi.",
    see1: "Generator Ulang Tahun",
    see2: "Selisih Tanggal",
    see3: "Kalkulator Tanggal Masa Depan",
    see4: "Kalkulator Tanggal Masa Lalu"
  },
  de: {
    pageTitle: "Altersrechner - Wie alt bin ich?",
    title: "Altersrechner",
    meta: "Finden Sie heraus, wie alt Sie sind, mit diesem kostenlosen Online-Altersrechner. Geben Sie Ihr Geburtsdatum ein und sehen Sie sofort Ihr exaktes Alter in Jahren, Monaten, Wochen und Tagen.",
    dt: "Geburtsdatum",
    age: "Ihr Alter",
    or: "oder",
    err: "Bitte geben Sie ein Datum vor dem heutigen Tag ein",
    placeholder: "Geben Sie Ihr Geburtsdatum ein",
    years: "Jahr|Jahre",
    months: "Monat|Monate",
    weeks: "Woche|Wochen",
    days: "Tag|Tage",
    years_label: "Jahre",
    months_label: "Monate",
    weeks_label: "Wochen",
    days_label: "Tage",
    total_months_label: "Gesamtmonate",
    total_weeks_label: "Gesamtwochen",
    total_days_label: "Gesamttage",
    week_day: "Wochentag",
    day_0: "Sonntag",
    day_1: "Montag",
    day_2: "Dienstag",
    day_3: "Mittwoch",
    day_4: "Donnerstag",
    day_5: "Freitag",
    day_6: "Samstag",
    desc: "Dieser kostenlose Altersrechner berechnet präzise, wie lange Sie bereits leben, basierend auf Ihrem Geburtsdatum. Das Ergebnis geht über eine einfache Jahreszahl hinaus: Es wird detailliert dargestellt, wobei Ihr Alter in Jahre, Monate, Wochen und Tage aufgeschlüsselt wird sowie in Gesamteinheiten, wie viele Monate oder Tage Sie gelebt haben.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Exaktes Alter bestimmen",
    uc_1_desc: "Finden Sie genau heraus, wie alt Sie in Jahren, Monaten, Wochen und Tagen sind.",
    uc_2_title: "Alter beliebiger Personen berechnen",
    uc_2_desc: "Geben Sie ein beliebiges Geburtsdatum ein, um das exakte Alter eines Kindes, Elternteils, Patienten oder Kunden zu ermitteln.",
    uc_3_title: "Offizielle Dokumente",
    uc_3_desc: "Überprüfen Sie schnell Ihr Alter für Formulare, Verträge oder altersbeschränkte Dienste.",
    uc_4_title: "Gesundheit & Fitness",
    uc_4_desc: "Verfolgen Sie altersbezogene Meilensteine und Gesundheitskennzahlen präzise.",
    how_it_works_title: "So funktioniert es",
    step_1_title: "Geburtsdatum eingeben",
    step_1_desc: "Wählen Sie Ihr Geburtsdatum im Datumsfeld aus.",
    step_2_title: "Sofortige Berechnung",
    step_2_desc: "Ihr Alter wird automatisch berechnet, sobald Sie ein Datum auswählen.",
    step_3_title: "Ergebnisse anzeigen",
    step_3_desc: "Sehen Sie Ihr Alter in Jahren, Monaten, Wochen und Tagen sowie alternative Darstellungen.",
    examples_title: "Häufige Beispiele",
    examples_intro: "Eine schnelle Referenz für alle, die wissen möchten, wie alt sie auf Basis gängiger Geburtsjahre sind. Die nachstehenden Werte werden automatisch aktualisiert.",
    examples_item_q: "Wenn ich {year} geboren bin, wie alt bin ich?",
    examples_item_a: "Sie sind derzeit {years} Jahre alt, bzw. {yearsNext} Jahre, wenn Sie dieses Jahr bereits Geburtstag hatten.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Wie wird das Alter berechnet?",
    faq_1_a: "Wir berechnen die exakte Differenz zwischen Ihrem Geburtsdatum und dem heutigen Datum, aufgeschlüsselt in Jahre, Monate, Wochen und Tage.",
    faq_2_q: "Ist dieser Rechner genau?",
    faq_2_a: "Ja. Er verwendet präzise Datumsarithmetik unter Berücksichtigung von Schaltjahren und unterschiedlichen Monatslängen.",
    faq_3_q: "Was bedeutet 'oder...' in den Ergebnissen?",
    faq_3_a: "Es zeigt alternative Darstellungen Ihres Alters, z. B. vollständig in Monaten oder Wochen ausgedrückt.",
    faq_4_q: "Wie erfahre ich mein Alter aus meinem Geburtsdatum?",
    faq_4_a: "Geben Sie einfach Ihr Geburtsdatum in das Feld oben ein. Der Rechner vergleicht es mit dem heutigen Datum und zeigt das Ergebnis sofort in Jahren, Monaten, Wochen und Tagen an.",
    faq_5_q: "Funktioniert der Rechner für jedes Alter?",
    faq_5_a: "Ja. Er funktioniert für jedes Geburtsdatum in der Vergangenheit, vom Kleinkind bis zum Hundertjährigen. Einzige Einschränkung: Das eingegebene Datum muss vor dem heutigen Datum liegen.",
    faq_6_q: "Kann ich das Alter zu einem bestimmten Datum anstelle von heute berechnen?",
    faq_6_a: "Dieser Rechner verwendet das heutige Datum als Referenz. Um zwei beliebige Daten zu vergleichen, nutzen Sie unser Tool zur Datumsdifferenz, das den Abstand zwischen zwei beliebigen Daten ausgibt.",
    faq_7_q: "Warum werden Wochen und Tage separat angezeigt?",
    faq_7_a: "Die Aufschlüsselung des Alters in Jahre, Monate, Wochen und Tage bietet ein vollständigeres Bild als nur die Jahreszahl. Das ist nützlich für die Verfolgung von Babys, Jubiläen und persönlichen Meilensteinen.",
    see1: "Geburtstagsgenerator",
    see2: "Datumsdifferenz-Rechner",
    see3: "Zukunftsrechner",
    see4: "Vergangenheitsrechner"
  },
  nl: {
    pageTitle: "Leeftijdscalculator - Hoe oud ben ik?",
    title: "Leeftijdscalculator",
    meta: "Ontdek hoe oud u bent met deze gratis online leeftijdscalculator. Voer uw geboortedatum in en zie direct uw exacte leeftijd in jaren, maanden, weken en dagen.",
    dt: "Geboortedatum",
    age: "Uw leeftijd",
    or: "of",
    err: "Voer een datum in vóór vandaag",
    placeholder: "Voer uw geboortedatum in",
    years: "jaar|jaren",
    months: "maand|maanden",
    weeks: "week|weken",
    days: "dag|dagen",
    years_label: "Jaren",
    months_label: "Maanden",
    weeks_label: "Weken",
    days_label: "Dagen",
    total_months_label: "Totaal maanden",
    total_weeks_label: "Totaal weken",
    total_days_label: "Totaal dagen",
    week_day: "Dag van de week",
    day_0: "Zondag",
    day_1: "Maandag",
    day_2: "Dinsdag",
    day_3: "Woensdag",
    day_4: "Donderdag",
    day_5: "Vrijdag",
    day_6: "Zaterdag",
    desc: "Deze gratis leeftijdscalculator berekent nauwkeurig hoe lang u al leeft op basis van uw geboortedatum. Het resultaat gaat verder dan alleen jaren: uw leeftijd wordt volledig uitgesplitst in jaren, maanden, weken en dagen, evenals in totalen zoals het aantal maanden of dagen dat u heeft geleefd.",
    use_cases_title: "Toepassingen",
    uc_1_title: "Ken uw exacte leeftijd",
    uc_1_desc: "Ontdek precies hoe oud u bent in jaren, maanden, weken en dagen.",
    uc_2_title: "Leeftijd van anderen berekenen",
    uc_2_desc: "Voer een geboortedatum in om de exacte leeftijd van een kind, ouder, patiënt of klant te berekenen.",
    uc_3_title: "Officiële documenten",
    uc_3_desc: "Controleer snel uw leeftijd voor formulieren, contracten of diensten met leeftijdsbeperkingen.",
    uc_4_title: "Gezondheid & fitness",
    uc_4_desc: "Volg leeftijdsgerelateerde mijlpalen en gezondheidsindicatoren nauwkeurig.",
    how_it_works_title: "Hoe het werkt",
    step_1_title: "Voer geboortedatum in",
    step_1_desc: "Selecteer uw geboortedatum via het datumveld.",
    step_2_title: "Directe berekening",
    step_2_desc: "Uw leeftijd wordt automatisch berekend zodra u een datum selecteert.",
    step_3_title: "Bekijk resultaten",
    step_3_desc: "Bekijk uw leeftijd in jaren, maanden, weken en dagen en alternatieve weergaven.",
    examples_title: "Veelvoorkomende voorbeelden",
    examples_intro: "Een snelle referentie voor wie wil weten hoe oud hij of zij is op basis van veelvoorkomende geboortejaren. De onderstaande waarden worden automatisch bijgewerkt.",
    examples_item_q: "Als ik in {year} ben geboren, hoe oud ben ik dan?",
    examples_item_a: "U bent momenteel {years} jaar oud, of {yearsNext} als u dit jaar al jarig bent geweest.",
    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Hoe wordt de leeftijd berekend?",
    faq_1_a: "We berekenen het exacte verschil tussen uw geboortedatum en vandaag, opgesplitst in jaren, maanden, weken en dagen.",
    faq_2_q: "Is deze calculator nauwkeurig?",
    faq_2_a: "Ja. Hij gebruikt nauwkeurige datumberekeningen met rekening met schrikkeljaren en variabele maandlengtes.",
    faq_3_q: "Wat betekent 'of...' in de resultaten?",
    faq_3_a: "Dit toont alternatieve manieren om uw leeftijd uit te drukken, bijvoorbeeld volledig in maanden of weken.",
    faq_4_q: "Hoe weet ik hoe oud ik ben aan de hand van mijn geboortedatum?",
    faq_4_a: "Voer eenvoudig uw geboortedatum in het veld hierboven in. De calculator vergelijkt deze met de datum van vandaag en toont het resultaat direct in jaren, maanden, weken en dagen.",
    faq_5_q: "Werkt de calculator voor elke leeftijd?",
    faq_5_a: "Ja. Hij werkt voor elke geboortedatum in het verleden, van jonge kinderen tot honderdjarigen. De enige beperking is dat de ingevoerde datum vóór de huidige datum moet liggen.",
    faq_6_q: "Kan ik de leeftijd op een specifieke datum berekenen in plaats van vandaag?",
    faq_6_a: "Deze calculator gebruikt de datum van vandaag als referentie. Om twee willekeurige datums te vergelijken, gebruik onze tool voor datumverschil, die het interval tussen twee willekeurige datums teruggeeft.",
    faq_7_q: "Waarom worden weken en dagen apart weergegeven?",
    faq_7_a: "Het uitsplitsen van de leeftijd in jaren, maanden, weken en dagen geeft een vollediger beeld dan alleen het aantal jaren. Dit is nuttig voor het volgen van baby's, jubilea en persoonlijke mijlpalen.",
    see1: "Geboortedatum-generator",
    see2: "Datumverschil-calculator",
    see3: "Toekomstige datum-calculator",
    see4: "Verleden datum-calculator"
  },
  ru: {
    pageTitle: "Калькулятор возраста — Сколько мне лет?",
    title: "Калькулятор возраста",
    meta: "Узнайте, сколько вам лет, с помощью этого бесплатного калькулятора возраста. Введите дату рождения и мгновенно увидите точный возраст в годах, месяцах, неделях и днях.",
    dt: "Дата рождения",
    age: "Ваш возраст",
    or: "или",
    err: "Пожалуйста, введите дату ранее сегодняшнего дня",
    placeholder: "Введите дату рождения выше",
    years: "год|года|лет",
    months: "месяц|месяца|месяцев",
    weeks: "неделя|недели|недель",
    days: "день|дня|дней",
    years_label: "Лет",
    months_label: "Месяцев",
    weeks_label: "Недель",
    days_label: "Дней",
    total_months_label: "Всего месяцев",
    total_weeks_label: "Всего недель",
    total_days_label: "Всего дней",
    week_day: "День недели",
    day_0: "Воскресенье",
    day_1: "Понедельник",
    day_2: "Вторник",
    day_3: "Среда",
    day_4: "Четверг",
    day_5: "Пятница",
    day_6: "Суббота",
    desc: "Этот бесплатный калькулятор возраста точно рассчитывает, сколько времени вы прожили, на основе вашей даты рождения. Результат выходит за рамки простого количества лет: он представлен во всех деталях, с разбивкой вашего возраста на года, месяцы, недели и дни, а также в общих единицах, показывающих, сколько всего месяцев или дней вы прожили.",
    use_cases_title: "Варианты использования",
    uc_1_title: "Узнайте свой точный возраст",
    uc_1_desc: "Выясните с точностью до дня, сколько вам лет, месяцев, недель и дней.",
    uc_2_title: "Расчет возраста любого человека",
    uc_2_desc: "Введите любую дату рождения, чтобы узнать точный возраст ребенка, родителя, пациента или клиента.",
    uc_3_title: "Официальные документы",
    uc_3_desc: "Быстро проверяйте свой возраст для заполнения анкет, договоров или получения услуг с возрастными ограничениями.",
    uc_4_title: "Здоровье и фитнес",
    uc_4_desc: "Точно отслеживайте возрастные изменения и показатели здоровья.",
    how_it_works_title: "Как это работает",
    step_1_title: "Введите дату рождения",
    step_1_desc: "Выберите свою дату рождения, используя поле календаря.",
    step_2_title: "Мгновенный расчет",
    step_2_desc: "Ваш возраст рассчитывается автоматически сразу после выбора даты.",
    step_3_title: "Просмотр результатов",
    step_3_desc: "Ознакомьтесь с подробной разбивкой вашего возраста на годы, месяцы, недели и дни, а также с альтернативными вариантами выражения возраста.",
    examples_title: "Популярные примеры",
    examples_intro: "Быстрая справка для тех, кто хочет узнать свой возраст на основе популярных лет рождения. Значения ниже обновляются автоматически.",
    examples_item_q: "Если вы родились в {year} году, сколько вам лет?",
    examples_item_a: "Сейчас вам {years} лет (или {yearsNext} лет, если у вас уже был день рождения в этом году).",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Как рассчитывается возраст?",
    faq_1_a: "Мы рассчитываем точную разницу между вашей датой рождения и сегодняшним днем, раскладывая её на годы, месяцы, недели и дни.",
    faq_2_q: "Точен ли этот калькулятор?",
    faq_2_a: "Да. Он использует точную календарную арифметику, которая автоматически учитывает високосные года и разную длину месяцев.",
    faq_3_q: "Что означает раздел «или…» в результатах?",
    faq_3_a: "Он показывает альтернативные способы выражения вашего возраста, например, ваш общий возраст, выраженный целиком в месяцах или целиком в неделях.",
    faq_4_q: "Как узнать свой возраст по дате рождения?",
    faq_4_a: "Просто введите свою дату рождения в поле выше. Калькулятор мгновенно сравнит её с текущей датой и покажет результат в годах, месяцах, неделях и днях.",
    faq_5_q: "Работает ли калькулятор для любого возраста?",
    faq_5_a: "Да. Он работает для любой даты рождения в прошлом — от маленьких детей до долгожителей. Единственное ограничение заключается в том, что вводимая дата должна быть ранее сегодняшнего дня.",
    faq_6_q: "Могу ли я рассчитать возраст на определенную дату, а не на сегодня?",
    faq_6_a: "Этот калькулятор использует сегодняшнюю дату в качестве ориентира. Чтобы сравнить две произвольные даты, воспользуйтесь нашим инструментом расчета разницы дат, который возвращает точный интервал между любыми двумя датами.",
    faq_7_q: "Почему в результатах недели и дни показаны отдельно?",
    faq_7_a: "Разложение возраста на годы, месяцы, недели и дни дает более полное представление, чем простое количество лет. Это особенно полезно для наблюдения за развитием младенцев, отслеживания юбилеев и личных вех.",
    see1: "Генератор дат рождения",
    see2: "Разница между датами",
    see3: "Калькулятор будущей даты",
    see4: "Калькулятор прошедшей даты"
  }
}
</i18n>