<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js', { trigger: 'client' })

const { t } = useI18n({ useScope: 'local' })

const state = reactive({
  isDtHr: false,
  dt: '',
  dtHr: '',
  result: '',
})

const offset = reactive({
  year: null as number | null,
  month: null as number | null,
  week: null as number | null,
  day: null as number | null,
  hour: null as number | null,
  minute: null as number | null,
  second: null as number | null,
})

watch([() => state.dt, () => state.dtHr], calc)
watch(offset, calc, { deep: true })

watch(() => state.isDtHr, () => {
  state.dt = ''
  state.dtHr = ''
  state.result = ''
  offset.year = null
  offset.month = null
  offset.week = null
  offset.day = null
  offset.hour = null
  offset.minute = null
  offset.second = null
})

function calc() {
  const dayjs = (window as any).dayjs
  if (!dayjs) return

  const base = state.isDtHr ? state.dtHr : state.dt
  if (!base) {
    state.result = ''
    return
  }

  let dt = dayjs(base)

  const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'] as const
  units.forEach(unit => {
    const val = offset[unit]
    if (val && val > 0) dt = dt.subtract(val, unit)
  })

  const fmt: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(state.isDtHr ? { hour: '2-digit', minute: '2-digit', second: '2-digit' } : {}),
  }

  state.result = new Intl.DateTimeFormat(navigator.language, fmt).format(dt.toDate())
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3')],
  faq: [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') },
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    en: '/past-date-calculator',
    pt: '/calculadora-de-data-passada',
    es: '/calculadora-de-fecha-pasada',
    fr: '/calculatrice-de-date-passee',
    it: '/calcolatrice-di-data-passata',
    id: '/kalkulator-tanggal-masa-lalu',
    de: '/vergangenes-datum-rechner',
    nl: '/verleden-datum-calculator',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.result"
    :see-also-links="[
      { label: t('see1'), to: 'future-date-calculator' },
      { label: t('see2'), to: 'date-difference' },
      { label: t('see3'), to: 'age-calculator' },
      { label: t('see4'), to: 'birthday-generator' },
    ]"
  >
    <ToolTabs
      :active-tab="state.isDtHr ? 'datetime' : 'date'"
      @update:active-tab="(val) => state.isDtHr = (val === 'datetime')"
      :tabs="[
        { id: 'date', label: t('mode_date') },
        { id: 'datetime', label: t('mode_datetime') }
      ]"
    >
      <template #date>
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="flex flex-col gap-1 mb-6">
            <label class="label-text font-bold text-base-content/80 px-1" for="base-input-date">
              {{ t('label_from') }}
            </label>
            <input
              id="base-input-date"
              type="date"
              v-model="state.dt"
              class="input input-bordered w-full sm:w-52 bg-base-100 focus:bg-base-100 transition-all"
            />
          </div>

          <div v-if="state.dt" class="mb-6">
            <p class="text-xs uppercase tracking-widest text-base-content/50 mb-3">{{ t('label_sub') }}</p>
            <div class="flex flex-wrap gap-4">
              <div class="form-control w-28">
                <label class="label pb-1" for="off-d">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_d') }}</span>
                </label>
                <input id="off-d" type="number" min="0" v-model.number="offset.day" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-w">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_w') }}</span>
                </label>
                <input id="off-w" type="number" min="0" v-model.number="offset.week" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-m">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_m') }}</span>
                </label>
                <input id="off-m" type="number" min="0" v-model.number="offset.month" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-y">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_y') }}</span>
                </label>
                <input id="off-y" type="number" min="0" v-model.number="offset.year" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
            </div>
          </div>

          <div v-if="state.result" class="stats shadow border border-base-content/10 w-fit">
            <div class="stat">
              <div class="stat-title">{{ t('result_label') }}</div>
              <div class="stat-value text-primary text-2xl leading-snug">{{ state.result }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #datetime>
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="flex flex-col gap-1 mb-6">
            <label class="label-text font-bold text-base-content/80 px-1" for="base-input-dt">
              {{ t('label_from_dt') }}
            </label>
            <input
              id="base-input-dt"
              type="datetime-local"
              v-model="state.dtHr"
              class="input input-bordered w-full sm:w-64 bg-base-100 focus:bg-base-100 transition-all"
            />
          </div>

          <div v-if="state.dtHr" class="mb-6">
            <p class="text-xs uppercase tracking-widest text-base-content/50 mb-3">{{ t('label_sub') }}</p>
            <div class="flex flex-wrap gap-4">
              <div class="form-control w-28">
                <label class="label pb-1" for="off-d-dt">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_d') }}</span>
                </label>
                <input id="off-d-dt" type="number" min="0" v-model.number="offset.day" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-w-dt">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_w') }}</span>
                </label>
                <input id="off-w-dt" type="number" min="0" v-model.number="offset.week" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-m-dt">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_m') }}</span>
                </label>
                <input id="off-m-dt" type="number" min="0" v-model.number="offset.month" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-y-dt">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_y') }}</span>
                </label>
                <input id="off-y-dt" type="number" min="0" v-model.number="offset.year" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-h">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_h') }}</span>
                </label>
                <input id="off-h" type="number" min="0" v-model.number="offset.hour" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-min">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_min') }}</span>
                </label>
                <input id="off-min" type="number" min="0" v-model.number="offset.minute" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
              <div class="form-control w-28">
                <label class="label pb-1" for="off-s">
                  <span class="label-text font-bold text-base-content/80">{{ t('label_s') }}</span>
                </label>
                <input id="off-s" type="number" min="0" v-model.number="offset.second" placeholder="0" class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all" />
              </div>
            </div>
          </div>

          <div v-if="state.result" class="stats shadow border border-base-content/10 w-fit">
            <div class="stat">
              <div class="stat-title">{{ t('result_label') }}</div>
              <div class="stat-value text-primary text-2xl leading-snug">{{ state.result }}</div>
            </div>
          </div>
        </div>
      </template>
    </ToolTabs>

    <template #info>
      <div class="space-y-8">
        <section>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') },
          ]"
        />

        <section>
          <h2 class="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
            <Icon name="heroicons:light-bulb-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('ex_title') }}
          </h2>
          <ul class="space-y-3 text-base-content/80">
            <li class="flex gap-3">
              <span class="text-primary mt-0.5">•</span>
              <span>{{ t('ex1') }}</span>
            </li>
            <li class="flex gap-3">
              <span class="text-primary mt-0.5">•</span>
              <span>{{ t('ex2') }}</span>
            </li>
            <li class="flex gap-3">
              <span class="text-primary mt-0.5">•</span>
              <span>{{ t('ex3') }}</span>
            </li>
          </ul>
        </section>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq1q'), answer: t('faq1a') },
            { question: t('faq2q'), answer: t('faq2a') },
            { question: t('faq3q'), answer: t('faq3a') },
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Past Date Calculator",
    pageTitle: "Past Date Calculator — Subtract Days, Weeks, Months or Years from a Date",
    meta: "Free online past date calculator. Subtract any combination of days, weeks, months and years — with optional hours, minutes and seconds — from any date and get the result instantly.",
    mode_date: "Date",
    mode_datetime: "Date & Time",
    label_from: "Start Date",
    label_from_dt: "Start Date & Time",
    label_sub: "Subtract",
    label_d: "Days",
    label_w: "Weeks",
    label_m: "Months",
    label_y: "Years",
    label_h: "Hours",
    label_min: "Minutes",
    label_s: "Seconds",
    result_label: "Result",
    how_desc: "Our past date calculator simplifies finding retroactive dates by subtracting precise time intervals from any reference point. Subtract days, weeks, months, or years instantly to identify warranty periods, conduct project retroplanning, or perform historical research, with optional support for hours and seconds for maximum precision.",
    features_title: "Features",
    f_1: "Subtract days, weeks, months and years from any date",
    f_2: "Date & Time mode subtracts hours, minutes and seconds",
    f_3: "Result formatted in your browser's locale",
    use_cases_title: "Main Use Cases",
    use_1_t: "Warranties & Deadlines",
    use_1_d: "Find the purchase date or contract start date based on the expiration date.",
    use_2_t: "Retroplanning",
    use_2_d: "Determine when a project must start to meet a specific final deadline.",
    use_3_t: "Historical Research",
    use_3_d: "Calculate exact milestones in the past by subtracting time periods from known dates.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Choose a Mode",
    step_1_desc: "Select Date for a date-only result, or Date & Time to also include hours, minutes and seconds.",
    step_2_title: "Set a Reference Date",
    step_2_desc: "Enter the base date (and time, if applicable) from which you want to subtract.",
    step_3_title: "Subtract an Interval",
    step_3_desc: "Fill in one or more offset fields and the result updates automatically.",
    ex_title: "Common Examples",
    ex1: "Warranty of 2 years: expiry on March 15, 2026 → purchase date was March 15, 2024.",
    ex2: "90-day trial period: cancellation on April 10 → trial started on January 10.",
    ex3: "Project retroplanning: deadline on June 30, minus 3 months → work must start by March 31.",
    faq_title: "Questions and Answers",
    faq1q: "Can I subtract more than one unit at the same time?",
    faq1a: "Yes. Fill in as many offset fields as you need, for example 1 year and 3 months simultaneously, and the calculator combines them all.",
    faq2q: "Does the calculator handle leap years?",
    faq2a: "Yes. Subtracting 1 year from February 28, 2025 correctly gives February 28, 2024.",
    faq3q: "What else can I subtract in Date & Time mode?",
    faq3a: "In Date & Time mode you can also subtract hours, minutes and seconds on top of any day, week, month or year offset.",
    see1: "Future Date Calculator",
    see2: "Date Difference",
    see3: "Age Calculator",
    see4: "Birthday Generator"
  },
  pt: {
    title: "Calculadora de Data Passada",
    pageTitle: "Calculadora de Data Passada — Subtraia Dias, Semanas, Meses ou Anos de uma Data",
    meta: "Calculadora de data passada online e gratuita. Subtraia qualquer combinação de dias, semanas, meses e anos — com horas, minutos e segundos opcionais — de qualquer data e obtenha o resultado instantaneamente.",
    mode_date: "Data",
    mode_datetime: "Data e Hora",
    label_from: "Data de Referência",
    label_from_dt: "Data e Hora de Referência",
    label_sub: "Subtrair",
    label_d: "Dias",
    label_w: "Semanas",
    label_m: "Meses",
    label_y: "Anos",
    label_h: "Horas",
    label_min: "Minutos",
    label_s: "Segundos",
    result_label: "Resultado",
    how_desc: "Nossa calculadora de data passada facilita a descoberta de datas retroativas ao subtrair intervalos de tempo precisos de qualquer ponto de referência. Subtraia dias, semanas, meses ou anos instantaneamente para identificar prazos de garantia, realizar retroplanejamento de projetos ou pesquisas históricas, com suporte opcional a horas e segundos para máxima exatidão.",
    features_title: "Funcionalidades",
    f_1: "Subtraia dias, semanas, meses e anos de qualquer data",
    f_2: "Modo Data e Hora subtrai horas, minutos e segundos",
    f_3: "Resultado formatado no idioma do seu navegador",
    use_cases_title: "Principais Casos de Uso",
    use_1_t: "Garantias e Prazos",
    use_1_d: "Descubra a data de compra ou início de um contrato a partir da data de vencimento.",
    use_2_t: "Retroplanejamento",
    use_2_d: "Determine quando um projeto deve começar para atingir um prazo final específico.",
    use_3_t: "Pesquisa Histórica",
    use_3_d: "Calcule marcos exatos no passado subtraindo períodos de tempo de datas conhecidas.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Escolha o Modo",
    step_1_desc: "Selecione Data para um resultado apenas com a data, ou Data e Hora para incluir também horas, minutos e segundos.",
    step_2_title: "Defina a Data de Referência",
    step_2_desc: "Informe a data base (e o horário, se aplicável) da qual deseja subtrair.",
    step_3_title: "Subtraia um Intervalo",
    step_3_desc: "Preencha um ou mais campos de intervalo e o resultado é atualizado automaticamente.",
    ex_title: "Exemplos Comuns",
    ex1: "Garantia de 2 anos: vencimento em 15 de março de 2026 → data de compra foi 15 de março de 2024.",
    ex2: "Período de teste de 90 dias: cancelamento em 10 de abril → teste iniciou em 10 de janeiro.",
    ex3: "Retroplanejamento: prazo em 30 de junho, menos 3 meses → trabalho deve começar até 31 de março.",
    faq_title: "Perguntas e Respostas",
    faq1q: "Posso subtrair mais de uma unidade ao mesmo tempo?",
    faq1a: "Sim. Preencha quantos campos de intervalo precisar, por exemplo, 1 ano e 3 meses simultaneamente, e a calculadora combina todos.",
    faq2q: "A calculadora leva em conta anos bissextos?",
    faq2a: "Sim. Subtrair 1 ano do dia 28 de fevereiro de 2025 resulta corretamente em 28 de fevereiro de 2024.",
    faq3q: "O que mais posso subtrair no modo Data e Hora?",
    faq3a: "No modo Data e Hora, também é possível subtrair horas, minutos e segundos além de qualquer intervalo em dias, semanas, meses ou anos.",
    see1: "Calculadora de Data Futura",
    see2: "Diferença entre Datas",
    see3: "Calculadora de Idade",
    see4: "Data de Nascimento"
  },
  es: {
    title: "Calculadora de Fecha Pasada",
    pageTitle: "Calculadora de Fecha Pasada — Restar Días, Semanas, Meses o Años de una Fecha",
    meta: "Calculadora de fecha pasada online y gratuita. Resta cualquier combinación de días, semanas, meses y años — con horas, minutos y segundos opcionales — de cualquier fecha y obtén el resultado al instante.",
    mode_date: "Fecha",
    mode_datetime: "Fecha y Hora",
    label_from: "Fecha de Referencia",
    label_from_dt: "Fecha y Hora de Referencia",
    label_sub: "Restar",
    label_d: "Días",
    label_w: "Semanas",
    label_m: "Meses",
    label_y: "Años",
    label_h: "Horas",
    label_min: "Minutos",
    label_s: "Segundos",
    result_label: "Resultado",
    how_desc: "Nuestra calculadora de fecha pasada facilita el descubrimiento de fechas retroactivas restando intervalos de tiempo precisos de cualquier punto de referencia. Reste días, semanas, meses o años al instante para identificar plazos de garantía, realizar retroplanificación de proyectos o investigaciones históricas, con soporte opcional para horas y segundos para la máxima exactitud.",
    features_title: "Características",
    f_1: "Resta días, semanas, meses y años de cualquier fecha",
    f_2: "El modo Fecha y Hora resta horas, minutos y segundos",
    f_3: "Resultado formateado en el idioma de tu navegador",
    use_cases_title: "Principales Casos de Uso",
    use_1_t: "Garantías y Plazos",
    use_1_d: "Descubra la fecha de compra o el inicio de un contrato a partir de la fecha de vencimiento.",
    use_2_t: "Retroplanificación",
    use_2_d: "Determine cuándo debe comenzar un proyecto para cumplir con un plazo final específico.",
    use_3_t: "Investigación Histórica",
    use_3_d: "Calcule hitos exactos en el pasado restando períodos de tiempo de fechas conocidas.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Elige un Modo",
    step_1_desc: "Selecciona Fecha para un resultado solo con la fecha, o Fecha y Hora para incluir también horas, minutos y segundos.",
    step_2_title: "Establece la Fecha de Referencia",
    step_2_desc: "Introduce la fecha base (y la hora, si corresponde) de la que quieres restar.",
    step_3_title: "Resta un Intervalo",
    step_3_desc: "Rellena uno o más campos de intervalo y el resultado se actualiza automáticamente.",
    ex_title: "Ejemplos Comunes",
    ex1: "Garantía de 2 años: vencimiento el 15 de marzo de 2026 → fecha de compra fue el 15 de marzo de 2024.",
    ex2: "Período de prueba de 90 días: cancelación el 10 de abril → prueba comenzó el 10 de enero.",
    ex3: "Retroplanificación: plazo el 30 de junio, menos 3 meses → el trabajo debe comenzar antes del 31 de marzo.",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Puedo restar más de una unidad al mismo tiempo?",
    faq1a: "Sí. Rellena tantos campos de intervalo como necesites, por ejemplo 1 año y 3 meses a la vez, y la calculadora los combina todos.",
    faq2q: "¿La calculadora tiene en cuenta los años bisiestos?",
    faq2a: "Sí. Restar 1 año del 28 de febrero de 2025 da correctamente el 28 de febrero de 2024.",
    faq3q: "¿Qué más puedo restar en el modo Fecha y Hora?",
    faq3a: "En el modo Fecha y Hora también puedes restar horas, minutos y segundos además de cualquier intervalo en días, semanas, meses o años.",
    see1: "Calculadora de Fecha Futura",
    see2: "Diferencia entre Fechas",
    see3: "Calculadora de Edad",
    see4: "Fecha de Nacimiento"
  },
  fr: {
    title: "Calculatrice de Date Passée",
    pageTitle: "Calculatrice de Date Passée — Soustraire des Jours, Semaines, Mois ou Années d'une Date",
    meta: "Calculatrice de date passée en ligne et gratuite. Soustrayez n'importe quelle combinaison de jours, semaines, mois et années — avec heures, minutes et secondes en option — de n'importe quelle date et obtenez le résultat instantanément.",
    mode_date: "Date",
    mode_datetime: "Date et Heure",
    label_from: "Date de Référence",
    label_from_dt: "Date et Heure de Référence",
    label_sub: "Soustraire",
    label_d: "Jours",
    label_w: "Semaines",
    label_m: "Mois",
    label_y: "Années",
    label_h: "Heures",
    label_min: "Minutes",
    label_s: "Secondes",
    result_label: "Résultat",
    how_desc: "Notre calculatrice de date passée facilite la découverte de dates rétroactives en soustrayant des intervalles de temps précis de n'importe quel point de référence. Soustrayez des jours, des semaines, des mois ou des années instantanément pour identifier les délais de garantie, réaliser un rétro-planning de projet ou des recherches historiques, avec un support optionnel pour les heures et les secondes pour une précision maximale.",
    features_title: "Fonctionnalités",
    f_1: "Soustrait des jours, semaines, mois et années de n'importe quelle date",
    f_2: "Le mode Date et Heure soustrait heures, minutes et secondes",
    f_3: "Résultat formaté selon la langue de votre navigateur",
    use_cases_title: "Principaux Cas d'Utilisation",
    use_1_t: "Garanties et Délais",
    use_1_d: "Découvrez la date d'achat ou le début d'un contrat à partir de la date d'expiration.",
    use_2_t: "Rétro-planning",
    use_2_d: "Déterminez quand un projet doit commencer pour respecter une échéance finale spécifique.",
    use_3_t: "Recherche Historique",
    use_3_d: "Calculez des jalons précis dans le passé en soustrayant des périodes de temps de dates connues.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Choisissez un Mode",
    step_1_desc: "Sélectionnez Date pour un résultat en date seule, ou Date et Heure pour inclure aussi les heures, minutes et secondes.",
    step_2_title: "Définissez la Date de Référence",
    step_2_desc: "Saisissez la date de base (et l'heure, si applicable) de laquelle vous souhaitez soustraire.",
    step_3_title: "Soustrayez un Intervalle",
    step_3_desc: "Remplissez un ou plusieurs champs d'intervalle et le résultat se met à jour automatiquement.",
    ex_title: "Exemples Courants",
    ex1: "Garantie de 2 ans : expiration le 15 mars 2026 → date d'achat était le 15 mars 2024.",
    ex2: "Période d'essai de 90 jours : annulation le 10 avril → l'essai a commencé le 10 janvier.",
    ex3: "Rétroplanification : délai le 30 juin, moins 3 mois → le travail doit commencer avant le 31 mars.",
    faq_title: "Questions et Réponses",
    faq1q: "Puis-je soustraire plusieurs unités en même temps ?",
    faq1a: "Oui. Remplissez autant de champs d'intervalle que nécessaire, par exemple 1 an et 3 mois simultanément, et la calculatrice les combine tous.",
    faq2q: "La calculatrice prend-elle en compte les années bissextiles ?",
    faq2a: "Oui. Soustraire 1 an du 28 février 2025 donne correctement le 28 février 2024.",
    faq3q: "Que peut-on soustraire de plus en mode Date et Heure ?",
    faq3a: "En mode Date et Heure, vous pouvez également soustraire des heures, des minutes et des secondes en plus de tout intervalle en jours, semaines, mois ou années.",
    see1: "Calculatrice de Date Future",
    see2: "Différence entre Dates",
    see3: "Calculateur d'Âge",
    see4: "Date de Naissance"
  },
  it: {
    title: "Calcolatrice di Data Passata",
    pageTitle: "Calcolatrice di Data Passata — Sottrai Giorni, Settimane, Mesi o Anni da una Data",
    meta: "Calcolatrice di data passata online e gratuita. Sottrai qualsiasi combinazione di giorni, settimane, mesi e anni — con ore, minuti e secondi opzionali — da qualsiasi data e ottieni il risultato istantaneamente.",
    mode_date: "Data",
    mode_datetime: "Data e Ora",
    label_from: "Data di Riferimento",
    label_from_dt: "Data e Ora di Riferimento",
    label_sub: "Sottrai",
    label_d: "Giorni",
    label_w: "Settimane",
    label_m: "Mesi",
    label_y: "Anni",
    label_h: "Ore",
    label_min: "Minuti",
    label_s: "Secondi",
    result_label: "Risultato",
    how_desc: "La nostra calcolatrice di data passata facilita la scoperta di date retroattive sottraendo intervalli di tempo precisi da qualsiasi punto di riferimento. Sottrai giorni, settimane, mesi o anni istantaneamente per identificare termini di garanzia, realizzare retropianificazione di progetti o ricerche storiche, con supporto opzionale per ore e secondi per la massima accuratezza.",
    features_title: "Funzionalità",
    f_1: "Sottrae giorni, settimane, mesi e anni da qualsiasi data",
    f_2: "La modalità Data e Ora sottrae ore, minuti e secondi",
    f_3: "Risultato formattato nella lingua del tuo browser",
    use_cases_title: "Principali Casi d'Uso",
    use_1_t: "Garanzie e Scadenze",
    use_1_d: "Scopri la data di acquisto o l'inizio di un contratto a partire dalla data di scadenza.",
    use_2_t: "Retropianificazione",
    use_2_d: "Determina quando un progetto deve iniziare per rispettare una scadenza finale specifica.",
    use_3_t: "Ricerca Storica",
    use_3_d: "Calcola pietre miliari esatte nel passato sottraendo periodi di tempo da date note.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Scegli una Modalità",
    step_1_desc: "Seleziona Data per un risultato solo con la data, o Data e Ora per includere anche ore, minuti e secondi.",
    step_2_title: "Imposta la Data di Riferimento",
    step_2_desc: "Inserisci la data base (e l'ora, se applicabile) da cui vuoi sottrarre.",
    step_3_title: "Sottrai un Intervallo",
    step_3_desc: "Compila uno o più campi di intervallo e il risultato si aggiorna automaticamente.",
    ex_title: "Esempi Comuni",
    ex1: "Garanzia di 2 anni: scadenza il 15 marzo 2026 → data di acquisto era il 15 marzo 2024.",
    ex2: "Periodo di prova di 90 giorni: cancellazione il 10 aprile → la prova è iniziata il 10 gennaio.",
    ex3: "Retropianificazione: scadenza il 30 giugno, meno 3 mesi → il lavoro deve iniziare entro il 31 marzo.",
    faq_title: "Domande e Risposte",
    faq1q: "Posso sottrarre più di un'unità contemporaneamente?",
    faq1a: "Sì. Compila tutti i campi di intervallo necessari, ad esempio 1 anno e 3 mesi simultaneamente, e la calcolatrice li combina tutti.",
    faq2q: "La calcolatrice gestisce gli anni bisestili?",
    faq2a: "Sì. Sottrarre 1 anno dal 28 febbraio 2025 dà correttamente il 28 febbraio 2024.",
    faq3q: "Cosa si può sottrarre in più nella modalità Data e Ora?",
    faq3a: "In modalità Data e Ora puoi anche sottrarre ore, minuti e secondi oltre a qualsiasi intervallo in giorni, settimane, mesi o anni.",
    see1: "Calcolatrice di Data Futura",
    see2: "Differenza tra Date",
    see3: "Calcolatrice dell'Età",
    see4: "Data di Nascita"
  },
  id: {
    title: "Kalkulator Tanggal Masa Lalu",
    pageTitle: "Kalkulator Tanggal Masa Lalu — Kurangi Hari, Minggu, Bulan atau Tahun dari Tanggal",
    meta: "Kalkulator tanggal masa lalu online gratis. Kurangi kombinasi hari, minggu, bulan, dan tahun — dengan jam, menit, dan detik opsional — dari tanggal mana pun dan dapatkan hasilnya seketika.",
    mode_date: "Tanggal",
    mode_datetime: "Tanggal & Waktu",
    label_from: "Tanggal Referensi",
    label_from_dt: "Tanggal & Waktu Referensi",
    label_sub: "Kurangi",
    label_d: "Hari",
    label_w: "Minggu",
    label_m: "Bulan",
    label_y: "Tahun",
    label_h: "Jam",
    label_min: "Menit",
    label_s: "Detik",
    result_label: "Hasil",
    how_desc: "Kalkulator tanggal masa lalu kami memudahkan pencarian tanggal retroaktif dengan mengurangi interval waktu yang tepat dari titik referensi mana pun. Kurangi hari, minggu, bulan, atau tahun secara instan untuk mengidentifikasi jangka waktu garansi, melakukan perencanaan retroaktif proyek, atau penelitian sejarah, dengan dukungan opsional untuk jam dan detik untuk presisi maksimum.",
    features_title: "Fitur",
    f_1: "Mengurangi hari, minggu, bulan, dan tahun dari tanggal mana pun",
    f_2: "Mode Tanggal & Waktu mengurangi jam, menit, dan detik",
    f_3: "Hasil diformat sesuai bahasa browser Anda",
    use_cases_title: "Kasus Penggunaan Utama",
    use_1_t: "Garansi & Jaminan",
    use_1_d: "Temukan tanggal pembelian atau mulainya garansi dengan mengurangi durasinya dari tanggal kedaluwarsa.",
    use_2_t: "Perencanaan Retroaktif",
    use_2_d: "Kerjakan mundur dari tenggat waktu untuk menemukan tanggal mulai yang paling akhir yang memungkinkan.",
    use_3_t: "Penelitian Sejarah",
    use_3_d: "Hitung tanggal kejadian masa lalu dengan mengurangi interval yang diketahui dari titik referensi.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Pilih Mode",
    step_1_desc: "Pilih Tanggal untuk hasil hanya dengan tanggal, atau Tanggal & Waktu untuk menyertakan jam, menit, dan detik.",
    step_2_title: "Tentukan Tanggal Referensi",
    step_2_desc: "Masukkan tanggal dasar (dan waktu, jika berlaku) yang akan dikurangi.",
    step_3_title: "Kurangi Interval",
    step_3_desc: "Isi satu atau lebih kolom interval dan hasilnya diperbarui secara otomatis.",
    ex_title: "Contoh Umum",
    ex1: "Garansi 2 tahun: kedaluwarsa 15 Maret 2026 → tanggal pembelian adalah 15 Maret 2024.",
    ex2: "Masa uji coba 90 hari: pembatalan 10 April → uji coba dimulai 10 Januari.",
    ex3: "Perencanaan retroaktif: tenggat 30 Juni, dikurangi 3 bulan → pekerjaan harus dimulai sebelum 31 Maret.",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Bisakah saya mengurangi lebih dari satu unit sekaligus?",
    faq1a: "Ya. Isi sebanyak kolom interval yang diperlukan, misalnya 1 tahun dan 3 bulan sekaligus, dan kalkulator menggabungkan semuanya.",
    faq2q: "Apakah kalkulator memperhitungkan tahun kabisat?",
    faq2a: "Ya. Mengurangi 1 tahun dari 28 Februari 2025 dengan benar menghasilkan 28 Februari 2024.",
    faq3q: "Apa lagi yang bisa dikurangi di mode Tanggal & Waktu?",
    faq3a: "Dalam mode Tanggal & Waktu, Anda juga dapat mengurangi jam, menit, dan detik di atas interval hari, minggu, bulan, atau tahun.",
    see1: "Kalkulator Tanggal Masa Depan",
    see2: "Selisih Tanggal",
    see3: "Kalkulator Usia",
    see4: "Generator Tanggal Lahir"
  },
  de: {
    title: "Vergangenes-Datum-Rechner",
    pageTitle: "Vergangenes-Datum-Rechner — Tage, Wochen, Monate oder Jahre von einem Datum abziehen",
    meta: "Kostenloser Online-Rechner für vergangene Daten. Ziehen Sie beliebige Kombinationen aus Tagen, Wochen, Monaten und Jahren — optional auch Stunden, Minuten und Sekunden — von einem Datum ab und erhalten Sie sofort das Ergebnis.",
    mode_date: "Datum",
    mode_datetime: "Datum & Uhrzeit",
    label_from: "Startdatum",
    label_from_dt: "Startdatum & Uhrzeit",
    label_sub: "Abziehen",
    label_d: "Tage",
    label_w: "Wochen",
    label_m: "Monate",
    label_y: "Jahre",
    label_h: "Stunden",
    label_min: "Minuten",
    label_s: "Sekunden",
    result_label: "Ergebnis",
    how_desc: "Unser Vergangenheitsdatum-Rechner erleichtert das Finden rückwirkender Daten, indem genaue Zeitintervalle von jedem Bezugspunkt abgezogen werden. Ziehen Sie sofort Tage, Wochen, Monate oder Jahre ab, um Garantiefristen zu bestimmen, eine Projekt-Retroplanung durchzuführen oder historische Recherchen zu unterstützen, mit optionaler Unterstützung für Stunden und Sekunden für maximale Präzision.",
    features_title: "Funktionen",
    f_1: "Tage, Wochen, Monate und Jahre von jedem Datum abziehen",
    f_2: "Der Modus Datum & Uhrzeit zieht Stunden, Minuten und Sekunden ab",
    f_3: "Ergebnis in der Sprache Ihres Browsers formatiert",
    use_cases_title: "Hauptanwendungsfälle",
    use_1_t: "Garantien & Fristen",
    use_1_d: "Ermitteln Sie das Kaufdatum oder das Startdatum eines Vertrags anhand des Ablaufdatums.",
    use_2_t: "Retroplanung",
    use_2_d: "Bestimmen Sie, wann ein Projekt beginnen muss, um eine bestimmte Endfrist einzuhalten.",
    use_3_t: "Historische Forschung",
    use_3_d: "Berechnen Sie exakte Meilensteine in der Vergangenheit, indem Sie Zeiträume von bekannten Daten abziehen.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Modus wählen",
    step_1_desc: "Wählen Sie Datum für ein Ergebnis nur mit Datum, oder Datum & Uhrzeit, um auch Stunden, Minuten und Sekunden einzubeziehen.",
    step_2_title: "Referenzdatum festlegen",
    step_2_desc: "Geben Sie das Basisdatum ein (und ggf. die Uhrzeit), von dem aus Sie abziehen möchten.",
    step_3_title: "Ein Intervall abziehen",
    step_3_desc: "Füllen Sie ein oder mehrere Intervallfelder aus und das Ergebnis wird automatisch aktualisiert.",
    ex_title: "Häufige Beispiele",
    ex1: "2-Jahres-Garantie: Ablauf am 15. März 2026 → Kaufdatum war der 15. März 2024.",
    ex2: "90-Tage-Testzeitraum: Kündigung am 10. April → Test begann am 10. Januar.",
    ex3: "Projekt-Retroplanung: Frist am 30. Juni, minus 3 Monate → die Arbeit muss spätestens am 31. März beginnen.",
    faq_title: "Fragen und Antworten",
    faq1q: "Kann ich mehr als eine Einheit gleichzeitig abziehen?",
    faq1a: "Ja. Füllen Sie so viele Intervallfelder aus, wie Sie benötigen, zum Beispiel 1 Jahr und 3 Monate gleichzeitig, und der Rechner kombiniert alles.",
    faq2q: "Berücksichtigt der Rechner Schaltjahre?",
    faq2a: "Ja. 1 Jahr vom 28. Februar 2025 abzuziehen ergibt korrekt den 28. Februar 2024.",
    faq3q: "Was kann ich im Modus Datum & Uhrzeit noch abziehen?",
    faq3a: "Im Modus Datum & Uhrzeit können Sie zusätzlich Stunden, Minuten und Sekunden zu jedem Tages-, Wochen-, Monats- oder Jahresintervall abziehen.",
    see1: "Zukunftsdatum-Rechner",
    see2: "Stunden-Differenz-Rechner",
    see3: "Alter-Rechner",
    see4: "Geburtsdatum-Generator"
  },
  nl: {
    title: "Calculator voor verleden datum",
    pageTitle: "Calculator voor verleden datum — Trek dagen, weken, maanden of jaren af van een datum",
    meta: "Gratis online calculator voor verleden datum. Trek elke combinatie van dagen, weken, maanden en jaren — met optionele uren, minuten en seconden — af van elke datum en krijg direct het resultaat.",
    mode_date: "Datum",
    mode_datetime: "Datum en tijd",
    label_from: "Startdatum",
    label_from_dt: "Startdatum en tijd",
    label_sub: "Aftrekken",
    label_d: "Dagen",
    label_w: "Weken",
    label_m: "Maanden",
    label_y: "Jaren",
    label_h: "Uren",
    label_min: "Minuten",
    label_s: "Seconden",
    result_label: "Resultaat",
    how_desc: "Onze calculator voor verleden datum maakt het eenvoudig om terugwerkende datums te vinden door nauwkeurige tijdsintervallen van elk referentiepunt af te trekken. Trek direct dagen, weken, maanden of jaren af om garantietermijnen te bepalen, projectretroplanning uit te voeren of historisch onderzoek te doen, met optionele ondersteuning voor uren en seconden voor maximale precisie.",
    features_title: "Functies",
    f_1: "Trek dagen, weken, maanden en jaren af van elke datum",
    f_2: "De modus Datum en tijd trekt uren, minuten en seconden af",
    f_3: "Resultaat opgemaakt in de taal van uw browser",
    use_cases_title: "Belangrijkste toepassingen",
    use_1_t: "Garanties & deadlines",
    use_1_d: "Vind de aankoopdatum of startdatum van een contract op basis van de vervaldatum.",
    use_2_t: "Retroplanning",
    use_2_d: "Bepaal wanneer een project moet beginnen om een specifieke einddeadline te halen.",
    use_3_t: "Historisch onderzoek",
    use_3_d: "Bereken exacte mijlpalen in het verleden door tijdsperioden af te trekken van bekende datums.",
    how_to_use_title: "Hoe deze tool te gebruiken",
    step_1_title: "Kies een modus",
    step_1_desc: "Selecteer Datum voor een resultaat alleen met datum, of Datum en tijd om ook uren, minuten en seconden op te nemen.",
    step_2_title: "Stel een referentiedatum in",
    step_2_desc: "Voer de basisdatum in (en tijd, indien van toepassing) waarvan u wilt aftrekken.",
    step_3_title: "Trek een interval af",
    step_3_desc: "Vul een of meer intervalvelden in en het resultaat wordt automatisch bijgewerkt.",
    ex_title: "Veelvoorkomende voorbeelden",
    ex1: "Garantie van 2 jaar: vervaldatum op 15 maart 2026 → aankoopdatum was 15 maart 2024.",
    ex2: "Proefperiode van 90 dagen: annulering op 10 april → proefperiode begon op 10 januari.",
    ex3: "Retroplanning van een project: deadline op 30 juni, min 3 maanden → het werk moet uiterlijk op 31 maart beginnen.",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Kan ik meer dan één eenheid tegelijk aftrekken?",
    faq1a: "Ja. Vul zoveel intervalvelden in als nodig is, bijvoorbeeld 1 jaar en 3 maanden tegelijk, en de calculator combineert ze allemaal.",
    faq2q: "Houdt de calculator rekening met schrikkeljaren?",
    faq2a: "Ja. 1 jaar aftrekken van 28 februari 2025 geeft correct 28 februari 2024.",
    faq3q: "Wat kan ik nog meer aftrekken in de modus Datum en tijd?",
    faq3a: "In de modus Datum en tijd kunt u ook uren, minuten en seconden aftrekken bovenop elk interval in dagen, weken, maanden of jaren.",
    see1: "Toekomstige datum-calculator",
    see2: "Tijdsverschilcalculator",
    see3: "Leeftijdscalculator",
    see4: "Geboortedatum-generator"
  }
}
</i18n>
