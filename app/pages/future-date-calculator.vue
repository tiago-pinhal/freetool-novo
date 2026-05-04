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
  
  // Reset all offsets
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
    if (val && val > 0) dt = dt.add(val, unit)
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
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') },
  ],
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    pt: '/calculadora-de-data-futura',
    es: '/calculadora-de-fecha-futura',
    fr: '/calculatrice-de-date-future',
    it: '/calcolatrice-di-data-futura',
    id: '/kalkulator-tanggal-masa-depan',
    de: '/zukuenftiges-datum-rechner',
    nl: '/toekomstige-datum-calculator',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.result"
    :see-also-links="[
      { label: t('see1'), to: 'time-difference' },
      { label: t('see2'), to: 'date-time-difference' },
      { label: t('see3'), to: 'past-date-calculator' },
      { label: t('see4'), to: 'hours-and-minutes-calculator' },
    ]"
  >
    <!-- Mode switcher using ToolTabs -->
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
          <!-- Base date input -->
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

          <!-- Offset fields -->
          <div v-if="state.dt" class="mb-6">
            <p class="text-xs uppercase tracking-widest text-base-content/50 mb-3">{{ t('label_add') }}</p>
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

          <!-- Result -->
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
          <!-- Base datetime input -->
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

          <!-- Offset fields -->
          <div v-if="state.dtHr" class="mb-6">
            <p class="text-xs uppercase tracking-widest text-base-content/50 mb-3">{{ t('label_add') }}</p>
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

          <!-- Result -->
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
    title: "Future Date Calculator",
    pageTitle: "Future Date Calculator — Add Days, Weeks, Months or Years to a Date",
    meta: "Free online future date calculator. Add any combination of days, weeks, months and years — with optional hours, minutes and seconds — to any date and get the result instantly.",
    mode_date: "Date",
    mode_datetime: "Date & Time",
    label_from: "Start Date",
    label_from_dt: "Start Date & Time",
    label_add: "Add",
    label_d: "Days",
    label_w: "Weeks",
    label_m: "Months",
    label_y: "Years",
    label_h: "Hours",
    label_min: "Minutes",
    label_s: "Seconds",
    result_label: "Result",
    how_desc: "Our future date calculator simplifies deadline calculations by adding time intervals to any date. Get exact results for adding days, weeks, or years instantly, with optional support for hours and seconds for high-precision planning. The ideal tool for managing timelines, contract expirations, and delivery logistics.",
    features_title: "Features",
    f_1: "Add days, weeks, months and years to any date",
    f_2: "Date & Time mode adds hours, minutes and seconds",
    f_3: "Result formatted in your browser's locale",
    use_cases_title: "Main Use Cases",
    use_1_t: "Project Management",
    use_1_d: "Set delivery dates by adding week or month sprints to the project start date.",
    use_2_t: "Contract Control",
    use_2_d: "Calculate exact expiration dates based on duration (e.g. 12 or 24 months) from the signing date.",
    use_3_t: "Logistics & Deliveries",
    use_3_d: "Determine maximum delivery deadlines by adding calendar days to the dispatch or purchase date.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Choose a Mode",
    step_1_desc: "Select Date for a date-only result, or Date & Time to also include hours, minutes and seconds.",
    step_2_title: "Set a Start Date",
    step_2_desc: "Enter the base date (and time, if applicable) from which you want to calculate.",
    step_3_title: "Add an Interval",
    step_3_desc: "Fill in one or more offset fields and the result updates automatically.",
    ex_title: "Common Examples",
    ex1: "Contract of 6 months: signing on March 1 → expiry on September 1.",
    ex2: "90-day return policy: purchase on January 10 → deadline on April 10.",
    ex3: "Project sprint of 3 weeks: start on Monday May 5 → end on Sunday May 25.",
    faq_title: "Questions & Answers",
    faq1q: "Can I add more than one unit at the same time?",
    faq1a: "Yes. Fill in as many offset fields as you need, for example 1 year and 3 months simultaneously, and the calculator combines them all.",
    faq2q: "Does the calculator handle leap years?",
    faq2a: "Yes. Adding 1 year to February 29, 2024 correctly gives February 28, 2025.",
    faq3q: "What does Date & Time mode add?",
    faq3a: "In Date & Time mode you can also add hours, minutes and seconds on top of any day, week, month or year offset.",
    see1: "Time Difference",
    see2: "Date Time Difference",
    see3: "Past Date Calculator",
    see4: "Hours and Minutes Calculator"
  },
  pt: {
    title: "Calculadora de Data Futura",
    pageTitle: "Calculadora de Data Futura — Adicione Dias, Semanas, Meses ou Anos a uma Data",
    meta: "Calculadora de data futura online e gratuita. Adicione qualquer combinação de dias, semanas, meses e anos — com horas, minutos e segundos opcionais — a qualquer data e obtenha o resultado instantaneamente.",
    mode_date: "Data",
    mode_datetime: "Data e Hora",
    label_from: "Data Inicial",
    label_from_dt: "Data e Hora Inicial",
    label_add: "Adicionar",
    label_d: "Dias",
    label_w: "Semanas",
    label_m: "Meses",
    label_y: "Anos",
    label_h: "Horas",
    label_min: "Minutos",
    label_s: "Segundos",
    result_label: "Resultado",
    how_desc: "Nossa calculadora de data futura simplifica o cálculo de prazos ao adicionar intervalos de tempo a qualquer data. Obtenha resultados exatos para somar dias, semanas ou anos instantaneamente, com suporte opcional a horas e segundos para planejamentos de alta precisão. A ferramenta ideal para gerenciar cronogramas, vencimentos de contratos e logística de entregas.",
    features_title: "Funcionalidades",
    f_1: "Adicione dias, semanas, meses e anos a qualquer data",
    f_2: "Modo Data e Hora adiciona horas, minutos e segundos",
    f_3: "Resultado formatado no idioma do seu navegador",
    use_cases_title: "Principais Casos de Uso",
    use_1_t: "Gestão de Projetos",
    use_1_d: "Defina datas de entrega somando sprints de semanas ou meses ao início do projeto.",
    use_2_t: "Controle de Contratos",
    use_2_d: "Calcule a data exata de expiração baseada na duração (ex: 12 ou 24 meses) a partir da assinatura.",
    use_3_t: "Logística e Entregas",
    use_3_d: "Determine prazos máximos de entrega somando dias corridos à data de despacho ou compra.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Escolha o Modo",
    step_1_desc: "Selecione Data para um resultado apenas com a data, ou Data e Hora para incluir também horas, minutos e segundos.",
    step_2_title: "Defina a Data Inicial",
    step_2_desc: "Informe a data base (e o horário, se aplicável) a partir da qual deseja calcular.",
    step_3_title: "Adicione um Intervalo",
    step_3_desc: "Preencha um ou mais campos de intervalo e o resultado é atualizado automaticamente.",
    ex_title: "Exemplos Comuns",
    ex1: "Contrato de 6 meses: assinatura em 1 de março → vencimento em 1 de setembro.",
    ex2: "Prazo de devolução de 90 dias: compra em 10 de janeiro → prazo em 10 de abril.",
    ex3: "Sprint de 3 semanas: início na segunda-feira, 5 de maio → término no domingo, 25 de maio.",
    faq_title: "Perguntas Frequentes",
    faq1q: "Posso adicionar mais de uma unidade ao mesmo tempo?",
    faq1a: "Sim. Preencha quantos campos de intervalo precisar, por exemplo, 1 ano e 3 meses simultaneamente, e a calculadora combina todos.",
    faq2q: "A calculadora leva em conta anos bissextos?",
    faq2a: "Sim. Adicionar 1 ano ao dia 29 de fevereiro de 2024 resulta corretamente em 28 de fevereiro de 2025.",
    faq3q: "O que o modo Data e Hora acrescenta?",
    faq3a: "No modo Data e Hora, também é possível adicionar horas, minutos e segundos além de qualquer intervalo em dias, semanas, meses ou anos.",
    see1: "Diferença entre Horas",
    see2: "Diferença entre Datas e Horas",
    see3: "Calculadora de Data Passada",
    see4: "Calculadora de Horas e Minutos"
  },
  es: {
    title: "Calculadora de Fecha Futura",
    pageTitle: "Calculadora de Fecha Futura — Añadir Días, Semanas, Meses o Años a una Fecha",
    meta: "Calculadora de fecha futura online y gratuita. Añade cualquier combinación de días, semanas, meses y años — con horas, minutos y segundos opcionales — a cualquier fecha y obtén el resultado al instante.",
    mode_date: "Fecha",
    mode_datetime: "Fecha y Hora",
    label_from: "Fecha Inicial",
    label_from_dt: "Fecha y Hora Inicial",
    label_add: "Añadir",
    label_d: "Días",
    label_w: "Semanas",
    label_m: "Meses",
    label_y: "Años",
    label_h: "Horas",
    label_min: "Minutos",
    label_s: "Segundos",
    result_label: "Resultado",
    how_desc: "Nuestra calculadora de fecha futura simplifica el cálculo de plazos sumando intervalos de tiempo a cualquier fecha. Obtenga resultados exactos para sumar días, semanas o años al instante, con soporte opcional para horas y segundos para planificaciones de alta precisión. La herramienta ideal para gestionar cronogramas, vencimientos y logística.",
    features_title: "Características",
    f_1: "Añade días, semanas, meses y años a cualquier fecha",
    f_2: "El modo Fecha y Hora añade horas, minutos y segundos",
    f_3: "Resultado formateado en el idioma de tu navegador",
    use_cases_title: "Principales Casos de Uso",
    use_1_t: "Gestión de Proyectos",
    use_1_d: "Establezca fechas de entrega sumando sprints de semanas o meses al inicio del proyecto.",
    use_2_t: "Control de Contratos",
    use_2_d: "Calcule fechas exactas de vencimiento basadas en la duración (ej. 12 o 24 meses) desde la firma.",
    use_3_t: "Logística y Entregas",
    use_3_d: "Determine plazos máximos de entrega sumando días naturales a la fecha de envío o compra.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Elige un Modo",
    step_1_desc: "Selecciona Fecha para un resultado solo con la fecha, o Fecha y Hora para incluir también horas, minutos y segundos.",
    step_2_title: "Establece la Fecha Inicial",
    step_2_desc: "Introduce la fecha base (y la hora, si corresponde) desde la que quieres calcular.",
    step_3_title: "Añade un Intervalo",
    step_3_desc: "Rellena uno o más campos de intervalo y el resultado se actualiza automáticamente.",
    ex_title: "Ejemplos Comunes",
    ex1: "Contrato de 6 meses: firma el 1 de marzo → vencimiento el 1 de septiembre.",
    ex2: "Política de devolución de 90 días: compra el 10 de enero → plazo el 10 de abril.",
    ex3: "Sprint de proyecto de 3 semanas: inicio el lunes 5 de mayo → fin el domingo 25 de mayo.",
    faq_title: "Preguntas Frecuentes",
    faq1q: "¿Puedo añadir más de una unidad al mismo tiempo?",
    faq1a: "Sí. Rellena tantos campos de intervalo como necesites, por ejemplo 1 año y 3 meses a la vez, y la calculadora los combina todos.",
    faq2q: "¿La calculadora tiene en cuenta los años bisiestos?",
    faq2a: "Sí. Añadir 1 año al 29 de febrero de 2024 da correctamente el 28 de febrero de 2025.",
    faq3q: "¿Qué añade el modo Fecha y Hora?",
    faq3a: "En el modo Fecha y Hora también puedes añadir horas, minutos y segundos además de cualquier intervalo en días, semanas, meses o años.",
    see1: "Diferencia entre Horas",
    see2: "Diferencia entre Fechas y Horas",
    see3: "Calculadora de Fecha Pasada",
    see4: "Calculadora de Horas y Minutos"
  },
  fr: {
    title: "Calculatrice de Date Future",
    pageTitle: "Calculatrice de Date Future — Ajouter des Jours, Semaines, Mois ou Années à une Date",
    meta: "Calculatrice de date future en ligne et gratuite. Ajoutez n'importe quelle combinaison de jours, semaines, mois et années — avec heures, minutes et secondes en option — à n'importe quelle date et obtenez le résultat instantanément.",
    mode_date: "Date",
    mode_datetime: "Date et Heure",
    label_from: "Date de Départ",
    label_from_dt: "Date et Heure de Départ",
    label_add: "Ajouter",
    label_d: "Jours",
    label_w: "Semaines",
    label_m: "Mois",
    label_y: "Années",
    label_h: "Heures",
    label_min: "Minutes",
    label_s: "Secondes",
    result_label: "Résultat",
    how_desc: "Notre calculatrice de date future simplifie le calcul des délais en ajoutant des intervalles de temps à n'importe quelle date. Obtenez des résultats exacts pour ajouter des jours, des semaines ou des années instantanément, avec un support optionnel pour les heures et les secondes pour une planification de haute précision. L'outil idéal pour gérer les calendriers, les expirations de contrats et la logistique de livraison.",
    features_title: "Fonctionnalités",
    f_1: "Ajoute des jours, semaines, mois et années à n'importe quelle date",
    f_2: "Le mode Date et Heure ajoute heures, minutes et secondes",
    f_3: "Résultat formaté selon la langue de votre navigateur",
    use_cases_title: "Principaux Cas d'Utilisation",
    use_1_t: "Gestion de Projets",
    use_1_d: "Définissez des dates de livraison en ajoutant des sprints de semaines ou de mois au début du projet.",
    use_2_t: "Contrôle des Contrats",
    use_2_d: "Calculez les dates d'expiration exactes selon la durée (ex. 12 ou 24 mois) depuis la signature.",
    use_3_t: "Logistique et Livraisons",
    use_3_d: "Déterminez les délais de livraison maximaux en ajoutant des jours calendaires à la date d'expédition.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Choisissez un Mode",
    step_1_desc: "Sélectionnez Date pour un résultat en date seule, ou Date et Heure pour inclure aussi les heures, minutes et secondes.",
    step_2_title: "Définissez la Date de Départ",
    step_2_desc: "Saisissez la date de base (et l'heure, si applicable) à partir de laquelle vous souhaitez calculer.",
    step_3_title: "Ajoutez un Intervalle",
    step_3_desc: "Remplissez un ou plusieurs champs d'intervalle et le résultat se met à jour automatiquement.",
    ex_title: "Exemples Courants",
    ex1: "Contrat de 6 mois : signature le 1er mars → échéance le 1er septembre.",
    ex2: "Politique de retour de 90 jours : achat le 10 janvier → délai le 10 avril.",
    ex3: "Sprint de projet de 3 semaines : début le lundi 5 mai → fin le dimanche 25 mai.",
    faq_title: "Questions Fréquentes",
    faq1q: "Puis-je ajouter plusieurs unités en même temps ?",
    faq1a: "Oui. Remplissez autant de champs d'intervalle que nécessaire, par exemple 1 an et 3 mois simultanément, et la calculatrice les combine tous.",
    faq2q: "La calculatrice prend-elle en compte les années bissextiles ?",
    faq2a: "Oui. Ajouter 1 an au 29 février 2024 donne correctement le 28 février 2025.",
    faq3q: "Qu'apporte le mode Date et Heure ?",
    faq3a: "En mode Date et Heure, vous pouvez également ajouter des heures, des minutes et des secondes en plus de tout intervalle en jours, semaines, mois ou années.",
    see1: "Différence entre Heures",
    see2: "Différence entre Dates et Heures",
    see3: "Calculatrice de Date Passée",
    see4: "Calculatrice d'Heures et de Minutes"
  },
  it: {
    title: "Calcolatrice di Data Futura",
    pageTitle: "Calcolatrice di Data Futura — Aggiungi Giorni, Settimane, Mesi o Anni a una Data",
    meta: "Calcolatrice di data futura online e gratuita. Aggiungi qualsiasi combinazione di giorni, settimane, mesi e anni — con ore, minuti e secondi opzionali — a qualsiasi data e ottieni il risultato istantaneamente.",
    mode_date: "Data",
    mode_datetime: "Data e Ora",
    label_from: "Data di Partenza",
    label_from_dt: "Data e Ora di Partenza",
    label_add: "Aggiungi",
    label_d: "Giorni",
    label_w: "Settimane",
    label_m: "Mesi",
    label_y: "Anni",
    label_h: "Ore",
    label_min: "Minuti",
    label_s: "Secondi",
    result_label: "Risultato",
    how_desc: "La nostra calcolatrice di data futura semplifica il calcolo delle scadenze aggiungendo intervalli di tempo a qualsiasi data. Ottieni risultati esatti per sommare giorni, settimane o anni istantaneamente, con supporto opzionale per ore e secondi per una pianificazione di alta precisione. Lo strumento ideale per gestire cronoprogrammi, scadenze contrattuali e logistica di consegna.",
    features_title: "Funzionalità",
    f_1: "Aggiunge giorni, settimane, mesi e anni a qualsiasi data",
    f_2: "La modalità Data e Ora aggiunge ore, minuti e secondi",
    f_3: "Risultato formattato nella lingua del tuo browser",
    use_cases_title: "Principali Casi d'Uso",
    use_1_t: "Gestione Progetti",
    use_1_d: "Definisci le date di consegna aggiungendo sprint di settimane o mesi all'inizio del progetto.",
    use_2_t: "Controllo Contratti",
    use_2_d: "Calcola le date di scadenza esatte in base alla durata (es. 12 o 24 mesi) dalla firma.",
    use_3_t: "Logistica e Consegne",
    use_3_d: "Determina i termini massimi di consegna aggiungendo giorni solari alla data di spedizione.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Scegli una Modalità",
    step_1_desc: "Seleziona Data per un risultato solo con la data, o Data e Ora per includere anche ore, minuti e secondi.",
    step_2_title: "Imposta la Data di Partenza",
    step_2_desc: "Inserisci la data base (e l'ora, se applicabile) da cui vuoi calcolare.",
    step_3_title: "Aggiungi un Intervallo",
    step_3_desc: "Compila uno o più campi di intervallo e il risultato si aggiorna automaticamente.",
    ex_title: "Esempi Comuni",
    ex1: "Contratto di 6 mesi: firma il 1° marzo → scadenza il 1° settembre.",
    ex2: "Politica di reso di 90 giorni: acquisto il 10 gennaio → scadenza il 10 aprile.",
    ex3: "Sprint di progetto di 3 settimane: inizio lunedì 5 maggio → fine domenica 25 maggio.",
    faq_title: "Domande Frequenti",
    faq1q: "Posso aggiungere più di un'unità contemporaneamente?",
    faq1a: "Sì. Compila tutti i campi di intervallo necessari, ad esempio 1 anno e 3 mesi simultaneamente, e la calcolatrice li combina tutti.",
    faq2q: "La calcolatrice gestisce gli anni bisestili?",
    faq2a: "Sì. Aggiungere 1 anno al 29 febbraio 2024 dà correttamente il 28 febbraio 2025.",
    faq3q: "Cosa aggiunge la modalità Data e Ora?",
    faq3a: "In modalità Data e Ora puoi aggiungere anche ore, minuti e secondi oltre a qualsiasi intervallo in giorni, settimane, mesi o anni.",
    see1: "Differenza tra Ore",
    see2: "Differenza tra Date e Ore",
    see3: "Calcolatrice di Data Passata",
    see4: "Calcolatrice di Ore e Minuti"
  },
  id: {
    title: "Kalkulator Tanggal Masa Depan",
    pageTitle: "Kalkulator Tanggal Masa Depan — Tambahkan Hari, Minggu, Bulan atau Tahun ke Tanggal",
    meta: "Kalkulator tanggal masa depan online gratis. Tambahkan kombinasi hari, minggu, bulan, dan tahun — dengan jam, menit, dan detik opsional — ke tanggal mana pun dan dapatkan hasilnya seketika.",
    mode_date: "Tanggal",
    mode_datetime: "Tanggal & Waktu",
    label_from: "Tanggal Mulai",
    label_from_dt: "Tanggal & Waktu Mulai",
    label_add: "Tambahkan",
    label_d: "Hari",
    label_w: "Minggu",
    label_m: "Bulan",
    label_y: "Tahun",
    label_h: "Jam",
    label_min: "Menit",
    label_s: "Detik",
    result_label: "Hasil",
    how_desc: "Kalkulator tanggal masa depan kami menyederhanakan perhitungan tenggat waktu dengan menambahkan interval waktu ke tanggal mana pun. Dapatkan hasil tepat untuk menambahkan hari, minggu, atau tahun secara instan, dengan dukungan opsional untuk jam dan detik untuk perencanaan presisi tinggi. Alat ideal untuk mengelola jadwal, kedaluwarsa kontrak, dan logistik pengiriman.",
    features_title: "Fitur",
    f_1: "Menambahkan hari, minggu, bulan, dan tahun ke tanggal mana pun",
    f_2: "Mode Tanggal & Waktu menambahkan jam, menit, dan detik",
    f_3: "Hasil diformat sesuai bahasa browser Anda",
    use_cases_title: "Kasus Penggunaan Utama",
    use_1_t: "Manajemen Proyek",
    use_1_d: "Tetapkan tanggal pengiriman dengan menambahkan sprint minggu atau bulan ke tanggal mulai proyek.",
    use_2_t: "Kontrol Kontrak",
    use_2_d: "Hitung tanggal kedaluwarsa yang tepat berdasarkan durasi (misal 12 atau 24 bulan) dari tanggal penandatanganan.",
    use_3_t: "Logistik & Pengiriman",
    use_3_d: "Tentukan batas waktu pengiriman maksimum dengan menambahkan hari kalender ke tanggal pengiriman.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Pilih Mode",
    step_1_desc: "Pilih Tanggal untuk hasil hanya dengan tanggal, atau Tanggal & Waktu untuk menyertakan jam, menit, dan detik.",
    step_2_title: "Tentukan Tanggal Mulai",
    step_2_desc: "Masukkan tanggal dasar (dan waktu, jika berlaku) yang menjadi titik awal perhitungan.",
    step_3_title: "Tambahkan Interval",
    step_3_desc: "Isi satu atau lebih kolom interval dan hasilnya diperbarui secara otomatis.",
    ex_title: "Contoh Umum",
    ex1: "Kontrak 6 bulan: ditandatangani 1 Maret → berakhir 1 September.",
    ex2: "Kebijakan pengembalian 90 hari: pembelian 10 Januari → batas waktu 10 April.",
    ex3: "Sprint proyek 3 minggu: mulai Senin 5 Mei → selesai Minggu 25 Mei.",
    faq_title: "Pertanyaan Umum",
    faq1q: "Bisakah saya menambahkan lebih dari satu unit sekaligus?",
    faq1a: "Ya. Isi sebanyak kolom interval yang diperlukan, misalnya 1 tahun dan 3 bulan sekaligus, dan kalkulator menggabungkan semuanya.",
    faq2q: "Apakah kalkulator memperhitungkan tahun kabisat?",
    faq2a: "Ya. Menambahkan 1 tahun ke 29 Februari 2024 dengan benar menghasilkan 28 Februari 2025.",
    faq3q: "Apa yang ditambahkan mode Tanggal & Waktu?",
    faq3a: "Dalam mode Tanggal & Waktu, Anda juga dapat menambahkan jam, menit, dan detik di atas interval hari, minggu, bulan, atau tahun.",
    see1: "Selisih Waktu",
    see2: "Selisih Tanggal dan Waktu",
    see3: "Kalkulator Tanggal Masa Lalu",
    see4: "Kalkulator Jam dan Menit"
  },
  de: {
    title: "Zukunftsdatum-Rechner",
    pageTitle: "Zukünftiges Datum Rechner — Tage, Wochen, Monate oder Jahre zu einem Datum addieren",
    meta: "Kostenloser Online-Rechner für zukünftige Daten. Addieren Sie beliebige Kombinationen aus Tagen, Wochen, Monaten und Jahren — optional auch Stunden, Minuten und Sekunden — zu einem Datum und erhalten Sie das Ergebnis sofort.",
    mode_date: "Datum",
    mode_datetime: "Datum & Uhrzeit",
    label_from: "Startdatum",
    label_from_dt: "Startdatum & Uhrzeit",
    label_add: "Hinzufügen",
    label_d: "Tage",
    label_w: "Wochen",
    label_m: "Monate",
    label_y: "Jahre",
    label_h: "Stunden",
    label_min: "Minuten",
    label_s: "Sekunden",
    result_label: "Ergebnis",
    how_desc: "Unser Zukunftsdatum-Rechner vereinfacht Fristenberechnungen durch Hinzufügen von Zeitintervallen zu jedem Datum. Erhalten Sie sofort exakte Ergebnisse für Tage, Wochen oder Jahre, mit optionaler Unterstützung für Stunden und Sekunden für hochpräzise Planungen. Das ideale Tool zur Verwaltung von Zeitplänen, Vertragsabläufen und Lieferlogistik.",
    features_title: "Funktionen",
    f_1: "Addiert Tage, Wochen, Monate und Jahre zu einem beliebigen Datum",
    f_2: "Datum & Uhrzeit-Modus addiert Stunden, Minuten und Sekunden",
    f_3: "Ergebnis in der Sprache Ihres Browsers formatiert",
    use_cases_title: "Hauptanwendungsfälle",
    use_1_t: "Projektmanagement",
    use_1_d: "Legen Sie Liefertermine fest, indem Sie Wochen- oder Monatssprints zum Projektstart addieren.",
    use_2_t: "Vertragskontrolle",
    use_2_d: "Berechnen Sie exakte Ablaufdaten basierend auf der Dauer (z. B. 12 oder 24 Monate) ab dem Unterzeichnungsdatum.",
    use_3_t: "Logistik & Lieferungen",
    use_3_d: "Bestimmen Sie maximale Lieferfristen durch Hinzufügen von Kalendertagen zum Versanddatum.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Modus wählen",
    step_1_desc: "Wählen Sie Datum für ein Ergebnis nur mit dem Datum oder Datum & Uhrzeit, um auch Stunden, Minuten und Sekunden einzubeziehen.",
    step_2_title: "Startdatum festlegen",
    step_2_desc: "Geben Sie das Basisdatum (und ggf. die Uhrzeit) ein, von dem aus Sie berechnen möchten.",
    step_3_title: "Intervall hinzufügen",
    step_3_desc: "Füllen Sie ein oder mehrere Intervallfelder aus und das Ergebnis wird automatisch aktualisiert.",
    ex_title: "Häufige Beispiele",
    ex1: "Vertrag über 6 Monate: Unterzeichnung am 1. März → Ablauf am 1. September.",
    ex2: "Rückgaberecht von 90 Tagen: Kauf am 10. Januar → Frist am 10. April.",
    ex3: "Projekt-Sprint von 3 Wochen: Start am Montag, 5. Mai → Ende am Sonntag, 25. Mai.",
    faq_title: "Häufig gestellte Fragen",
    faq1q: "Kann ich mehrere Einheiten gleichzeitig addieren?",
    faq1a: "Ja. Füllen Sie so viele Intervallfelder aus, wie Sie benötigen, zum Beispiel 1 Jahr und 3 Monate gleichzeitig, und der Rechner kombiniert alles.",
    faq2q: "Berücksichtigt der Rechner Schaltjahre?",
    faq2a: "Ja. 1 Jahr zum 29. Februar 2024 addiert ergibt korrekt den 28. Februar 2025.",
    faq3q: "Was fügt der Modus Datum & Uhrzeit hinzu?",
    faq3a: "Im Modus Datum & Uhrzeit können Sie zusätzlich Stunden, Minuten und Sekunden zu jedem Tage-, Wochen-, Monate- oder Jahresintervall addieren.",
    see1: "Stunden-Differenz-Rechner",
    see2: "Datum-Zeit-Differenzrechner",
    see3: "Vergangenes-Datum-Rechner",
    see4: "Stunden- und Minutenrechner"
  },
  nl: {
    title: "Calculator voor toekomstige datum",
    pageTitle: "Calculator voor toekomstige datum — Voeg dagen, weken, maanden of jaren toe aan een datum",
    meta: "Gratis online calculator voor toekomstige datum. Voeg elke combinatie van dagen, weken, maanden en jaren toe — met optionele uren, minuten en seconden — aan elke datum en krijg direct het resultaat.",
    mode_date: "Datum",
    mode_datetime: "Datum en tijd",
    label_from: "Startdatum",
    label_from_dt: "Startdatum en tijd",
    label_add: "Toevoegen",
    label_d: "Dagen",
    label_w: "Weken",
    label_m: "Maanden",
    label_y: "Jaren",
    label_h: "Uren",
    label_min: "Minuten",
    label_s: "Seconden",
    result_label: "Resultaat",
    how_desc: "Onze calculator voor toekomstige datums vereenvoudigt het berekenen van deadlines door tijdsintervallen aan elke datum toe te voegen. Krijg direct exacte resultaten voor het toevoegen van dagen, weken of jaren, met optionele ondersteuning voor uren en seconden voor zeer nauwkeurige planning. De ideale tool voor het beheren van tijdlijnen, contractvervaldata en leveringslogistiek.",
    features_title: "Functies",
    f_1: "Voeg dagen, weken, maanden en jaren toe aan elke datum",
    f_2: "De modus Datum en tijd voegt uren, minuten en seconden toe",
    f_3: "Resultaat opgemaakt in de taal van uw browser",
    use_cases_title: "Belangrijkste toepassingen",
    use_1_t: "Projectmanagement",
    use_1_d: "Stel leveringsdata vast door week- of maand-sprints toe te voegen aan de startdatum van het project.",
    use_2_t: "Contractbeheer",
    use_2_d: "Bereken exacte vervaldatums op basis van de duur (bijv. 12 of 24 maanden) vanaf de ondertekeningsdatum.",
    use_3_t: "Logistiek en leveringen",
    use_3_d: "Bepaal maximale levertermijnen door kalenderdagen toe te voegen aan de verzend- of aankoopdatum.",
    how_to_use_title: "Hoe deze tool te gebruiken",
    step_1_title: "Kies een modus",
    step_1_desc: "Selecteer Datum voor een resultaat alleen met datum, of Datum en tijd om ook uren, minuten en seconden mee te nemen.",
    step_2_title: "Stel een startdatum in",
    step_2_desc: "Voer de basisdatum in (en tijd, indien van toepassing) vanaf welke u wilt berekenen.",
    step_3_title: "Voeg een interval toe",
    step_3_desc: "Vul een of meer offsetvelden in en het resultaat wordt automatisch bijgewerkt.",
    ex_title: "Veelvoorkomende voorbeelden",
    ex1: "Contract van 6 maanden: ondertekening op 1 maart → vervaldatum op 1 september.",
    ex2: "Retourbeleid van 90 dagen: aankoop op 10 januari → deadline op 10 april.",
    ex3: "Projectsprint van 3 weken: start op maandag 5 mei → einde op zondag 25 mei.",
    faq_title: "Vragen en antwoorden",
    faq1q: "Kan ik meer dan één eenheid tegelijk toevoegen?",
    faq1a: "Ja. Vul zoveel offsetvelden in als u nodig hebt, bijvoorbeeld 1 jaar en 3 maanden tegelijk, en de calculator combineert ze allemaal.",
    faq2q: "Houdt de calculator rekening met schrikkeljaren?",
    faq2a: "Ja. 1 jaar toevoegen aan 29 februari 2024 geeft correct 28 februari 2025.",
    faq3q: "Wat voegt de modus Datum en tijd toe?",
    faq3a: "In de modus Datum en tijd kunt u naast elke dag-, week-, maand- of jaaroffset ook uren, minuten en seconden toevoegen.",
    see1: "Tijdsverschilcalculator",
    see2: "Tijdsverschilcalculator (datum & tijd)",
    see3: "Verleden datum-calculator",
    see4: "Uren- en minuten-calculator"
  }
}
</i18n>
