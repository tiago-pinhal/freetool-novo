<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

interface Result {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalMonths: number
  totalHours: number
  totalMinutes: number
}

const state = reactive({
  p1: '',
  p2: '',
  result: null as Result | null,
  equal: false,
})

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function calc() {
  state.result = null
  state.equal = false

  if (!state.p1 || !state.p2) return

  let d1 = parseDate(state.p1)
  let d2 = parseDate(state.p2)

  if (d1.getTime() === d2.getTime()) {
    state.equal = true
    return
  }

  if (d1 > d2) [d1, d2] = [d2, d1]

  let years = d2.getFullYear() - d1.getFullYear()
  let months = d2.getMonth() - d1.getMonth()
  let days = d2.getDate() - d1.getDate()

  if (days < 0) {
    months--
    days += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const diffMs = d2.getTime() - d1.getTime()
  const totalDays = Math.round(diffMs / 86400000)

  state.result = {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
    totalHours: Math.round(diffMs / 3600000),
    totalMinutes: Math.round(diffMs / 60000),
  }
}

watch(() => state.p1, calc)
watch(() => state.p2, calc)

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
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
    en: '/date-difference',
    pt: '/diferenca-entre-datas',
    es: '/diferencia-entre-fechas',
    fr: '/difference-entre-dates',
    it: '/differenza-tra-date',
    id: '/selisih-tanggal',
    de: '/datumsdifferenz',
    nl: '/datumsverschil'
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :see-also-links="[
      { label: t('see1'), to: 'time-difference' },
      { label: t('see2'), to: 'date-time-difference' },
      { label: t('see3'), to: 'future-date-calculator' },
      { label: t('see4'), to: 'past-date-calculator' },
    ]"
  >
    <!-- Inputs -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div class="form-control flex-1 min-w-44">
        <label class="label pb-1" for="p1">
          <span class="label-text font-bold text-base-content/80">{{ t('param1') }}</span>
        </label>
        <input
          id="p1"
          type="date"
          v-model="state.p1"
          :max="state.p2 || undefined"
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-control flex-1 min-w-44">
        <label class="label pb-1" for="p2">
          <span class="label-text font-bold text-base-content/80">{{ t('param2') }}</span>
        </label>
        <input
          id="p2"
          type="date"
          v-model="state.p2"
          :min="state.p1 || undefined"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Equal dates warning -->
    <div v-if="state.equal" class="alert alert-warning">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 shrink-0" />
      <span>{{ t('eq') }}</span>
    </div>

    <!-- Results -->
    <div v-if="state.result" class="space-y-4">
      <!-- Exact breakdown -->
      <div>
        <p class="text-xs uppercase tracking-widest text-base-content/90 mb-2">{{ t('diff') }}</p>
        <div class="stats shadow w-fit border border-base-content/10">
          <div v-if="state.result.years > 0" class="stat text-center">
            <div class="stat-title">{{ t('years_label') }}</div>
            <div class="stat-value text-primary">{{ state.result.years }}</div>
          </div>
          <div v-if="state.result.months > 0" class="stat text-center">
            <div class="stat-title">{{ t('months_label') }}</div>
            <div class="stat-value text-primary">{{ state.result.months }}</div>
          </div>
          <div v-if="state.result.days > 0" class="stat text-center">
            <div class="stat-title">{{ t('days_label') }}</div>
            <div class="stat-value text-primary">{{ state.result.days }}</div>
          </div>
        </div>
      </div>

      <!-- Equivalents -->
      <div>
        <p class="text-xs uppercase tracking-widest text-base-content/90 mb-2">{{ t('or') }}</p>
        <div class="stats stats-vertical lg:stats-horizontal shadow w-fit border border-base-content/10">
          <div v-if="state.result.totalMonths > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_months_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalMonths.toLocaleString() }}</div>
          </div>
          <div v-if="state.result.totalWeeks > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_weeks_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalWeeks.toLocaleString() }}</div>
          </div>
          <div class="stat text-center">
            <div class="stat-title">{{ t('total_days_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalDays.toLocaleString() }}</div>
          </div>
          <div v-if="state.result.totalDays <= 730" class="stat text-center">
            <div class="stat-title">{{ t('total_hours_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalHours.toLocaleString() }}</div>
          </div>
          <div v-if="state.result.totalDays <= 60" class="stat text-center">
            <div class="stat-title">{{ t('total_minutes_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalMinutes.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <section>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
            { title: t('use_4_t'), description: t('use_4_d') },
            { title: t('use_5_t'), description: t('use_5_d') },
            { title: t('use_6_t'), description: t('use_6_d') },
            { title: t('use_7_t'), description: t('use_7_d') }
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
            <li class="flex gap-3">
              <span class="text-primary mt-0.5">•</span>
              <span>{{ t('ex4') }}</span>
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
    title: "Date Difference Calculator",
    pageTitle: "Date Difference Calculator — Calculate Days Between Two Dates | Free",
    meta: "Calculate the difference between two dates instantly. Get exact results in years, months and days, plus equivalents in weeks, total days, hours and minutes.",
    param1: "Start Date",
    param2: "End Date",
    diff: "Exact Difference",
    or: "Or equivalently…",
    years_label: "Years",
    months_label: "Months",
    days_label: "Days",
    total_months_label: "Total Months",
    total_weeks_label: "Total Weeks",
    total_days_label: "Total Days",
    total_hours_label: "Total Hours",
    total_minutes_label: "Total Minutes",
    eq: "Please select two different dates to calculate the difference",
    features_title: "Features",
    f_1: "Exact breakdown in years, months and remaining days",
    f_2: "Equivalent totals: months, weeks, days, hours and minutes",
    f_3: "Automatic leap year handling",
    f_4: "Automatic date order correction",
    how_desc: "Find out exactly how much time separates any two dates. The result shows the difference broken down in years, months and days, plus convenient equivalents in weeks, total days, hours or minutes. Leap years and months of different lengths are handled automatically.",
    use_cases_title: "Main Applications",
    use_1_t: "Project Management",
    use_1_d: "Track deadlines, milestones and timelines for your projects and professional goals.",
    use_2_t: "Event Planning",
    use_2_d: "Schedule events based on specific dates and precise intervals to ensure perfect coordination.",
    use_3_t: "Deadline Tracking",
    use_3_d: "Stay organised by calculating delivery, meeting or appointment deadlines precisely.",
    use_4_t: "Financial Calculations",
    use_4_d: "Determine payment periods, contract expiries and investment durations for better financial control.",
    use_5_t: "Personal Planning",
    use_5_d: "Schedule trips, anniversaries and other personal commitments without guessing the duration.",
    use_6_t: "Education",
    use_6_d: "Calculate academic deadlines, school terms and study schedules to optimize your learning time.",
    use_7_t: "Health & Wellness",
    use_7_d: "Track intervals between appointments, treatments or medication cycles accurately.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Enter a Start Date",
    step_1_desc: "Click the Start Date field and pick the first date from the calendar or type it directly.",
    step_2_title: "Enter an End Date",
    step_2_desc: "Click the End Date field and pick the second date. Results appear instantly.",
    step_3_title: "Read the Results",
    step_3_desc: "The top row shows the exact breakdown in years, months and days. The second row shows convenient equivalent totals.",
    ex_title: "Common Examples",
    ex1: "Holiday planning: from December 20 to January 5 — the calculator shows 16 days, making it easy to request time off or book accommodation.",
    ex2: "Project deadline: from March 1 to June 30 — the result is 3 months and 29 days, useful for sprint and milestone planning.",
    ex3: "Pregnancy tracking: from February 14 to November 14 — exactly 9 months, useful for expectant parents to plan ahead.",
    ex4: "Contract duration: from January 1 to December 31 — 365 days (or 366 in a leap year), common in annual agreements.",
    faq_title: "Questions and Answers",
    faq1q: "Does the calculator count the start date?",
    faq1a: "No. The calculation counts the time elapsed between the two dates. For example, from January 1 to January 3 the result is 2 days — the start date is not included in the count.",
    faq2q: "Does this tool handle leap years correctly?",
    faq2a: "Yes. The calculation correctly recognises leap years. February 2024 has 29 days, and this is automatically reflected in the results.",
    faq3q: "What happens if I enter the end date before the start date?",
    faq3a: "The tool automatically reverses the dates and calculates the difference normally. You will always receive a positive result regardless of the order.",
    see1: "Hour Difference Calculator",
    see2: "Date and Time Difference Calculator",
    see3: "Future Date Calculator",
    see4: "Past Date Calculator"
  },
  pt: {
    title: "Calculadora de Diferença de Datas",
    pageTitle: "Calculadora de Diferença de Datas — Calcule Dias Entre Duas Datas | Grátis",
    meta: "Calcule a diferença entre duas datas com precisão. Obtenha o resultado exato em anos, meses e dias, mais equivalentes em semanas, dias totais, horas e minutos.",
    param1: "Data Inicial",
    param2: "Data Final",
    diff: "Diferença Exata",
    or: "Ou equivalentemente…",
    years_label: "Anos",
    months_label: "Meses",
    days_label: "Dias",
    total_months_label: "Total em Meses",
    total_weeks_label: "Total em Semanas",
    total_days_label: "Total em Dias",
    total_hours_label: "Total em Horas",
    total_minutes_label: "Total em Minutos",
    eq: "Por favor, selecione duas datas diferentes para calcular a diferença",
    features_title: "Funcionalidades",
    f_1: "Resultado exato em anos, meses e dias restantes",
    f_2: "Totais equivalentes: meses, semanas, dias, horas e minutos",
    f_3: "Tratamento automático de anos bissextos",
    f_4: "Correção automática da ordem das datas",
    how_desc: "Descubra exatamente quanto tempo separa duas datas quaisquer. O resultado exibe a diferença em anos, meses e dias, além de equivalentes em semanas, dias totais, horas ou minutos conforme o intervalo. Anos bissextos e meses de diferentes durações são tratados automaticamente.",
    use_cases_title: "Principais Aplicações",
    use_1_t: "Gestão de Projetos",
    use_1_d: "Acompanhe prazos, marcos e cronogramas para seus projetos e objetivos profissionais.",
    use_2_t: "Organização de Eventos",
    use_2_d: "Programe eventos com base em datas específicas e intervalos precisos para garantir coordenação perfeita.",
    use_3_t: "Monitoramento de Prazos",
    use_3_d: "Mantenha-se organizado calculando prazos de entregas, reuniões ou compromissos com precisão.",
    use_4_t: "Cálculos Financeiros",
    use_4_d: "Determine períodos de pagamento, vencimentos contratuais e durações de investimento para melhor controle financeiro.",
    use_5_t: "Planejamento Pessoal",
    use_5_d: "Agende viagens, datas comemorativas e outros compromissos pessoais sem adivinhar a duração.",
    use_6_t: "Educação e Estudos",
    use_6_d: "Calcule prazos acadêmicos, períodos letivos e cronogramas de estudos para otimizar seu tempo de aprendizado.",
    use_7_t: "Saúde e Bem-Estar",
    use_7_d: "Acompanhe intervalos entre consultas, tratamentos ou ciclos de medicação com precisão.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Informe a Data Inicial",
    step_1_desc: "Clique no campo Data Inicial e selecione a primeira data no calendário ou digite diretamente.",
    step_2_title: "Informe a Data Final",
    step_2_desc: "Clique no campo Data Final e selecione a segunda data. O resultado aparece instantaneamente.",
    step_3_title: "Leia os Resultados",
    step_3_desc: "A primeira linha exibe o resultado exato em anos, meses e dias. A segunda linha mostra totais equivalentes para referência rápida.",
    ex_title: "Exemplos Comuns",
    ex1: "Planejamento de férias: de 20 de dezembro a 5 de janeiro — a calculadora mostra 16 dias, facilitando o pedido de folga ou a reserva de hospedagem.",
    ex2: "Prazo de projeto: de 1 de março a 30 de junho — o resultado é 3 meses e 29 dias, útil para planejamento de sprints e marcos.",
    ex3: "Acompanhamento de gravidez: de 14 de fevereiro a 14 de novembro — exatamente 9 meses, útil para futuros pais se planejarem.",
    ex4: "Duração de contrato: de 1 de janeiro a 31 de dezembro — 365 dias (ou 366 em ano bissexto), comum em acordos anuais.",
    faq_title: "Perguntas e Respostas",
    faq1q: "A calculadora conta o dia inicial?",
    faq1a: "Não. O cálculo conta o tempo decorrido entre as duas datas. Por exemplo, de 1 de janeiro a 3 de janeiro o resultado é 2 dias — o dia inicial não é incluído na contagem.",
    faq2q: "Esta ferramenta trata anos bissextos corretamente?",
    faq2a: "Sim. O cálculo reconhece corretamente anos bissextos. Fevereiro de 2024 tem 29 dias, e isso é refletido automaticamente nos resultados.",
    faq3q: "O que acontece se eu inserir a data final antes da data inicial?",
    faq3a: "A ferramenta inverte automaticamente as datas e calcula a diferença normalmente. Você sempre receberá um resultado positivo, independente da ordem.",
    see1: "Calculadora de Diferença entre Horas",
    see2: "Calculadora de Diferença entre Datas e Horas",
    see3: "Calculadora de Data Futura",
    see4: "Calculadora de Data Passada"
  },
  es: {
    title: "Calculadora de Diferencia de Fechas",
    pageTitle: "Calculadora de Diferencia de Fechas — Calcule el Tiempo entre Dos Fechas",
    meta: "Calcula la diferencia entre dos fechas al instante. Obtén el resultado exacto en años, meses y días, más equivalentes en semanas, días totales, horas y minutos.",
    param1: "Fecha de Inicio",
    param2: "Fecha de Fin",
    diff: "Diferencia Exacta",
    or: "O equivalentemente…",
    years_label: "Años",
    months_label: "Meses",
    days_label: "Días",
    total_months_label: "Total en Meses",
    total_weeks_label: "Total en Semanas",
    total_days_label: "Total en Días",
    total_hours_label: "Total en Horas",
    total_minutes_label: "Total en Minutos",
    eq: "Por favor, selecciona dos fechas diferentes para calcular la diferencia",
    features_title: "Características",
    f_1: "Resultado exacto en años, meses y días restantes",
    f_2: "Totales equivalentes: meses, semanas, días, horas y minutos",
    f_3: "Manejo automático de años bisiestos",
    f_4: "Corrección automática del orden de fechas",
    how_desc: "Descubre exactamente cuánto tiempo separa dos fechas cualesquiera. El resultado muestra la diferencia en años, meses y días, más equivalentes en semanas, días totales, horas o minutos según el intervalo. Los años bisiestos y los meses de diferente duración se gestionan automáticamente.",
    use_cases_title: "Principales Casos de Uso",
    use_1_t: "Gestión de Proyectos",
    use_1_d: "Realiza un seguimiento de plazos, hitos y cronogramas para tus proyectos y objetivos profesionales.",
    use_2_t: "Organización de Eventos",
    use_2_d: "Programa eventos basados en fechas específicas e intervalos precisos para garantizar una coordinación perfecta.",
    use_3_t: "Control de Plazos",
    use_3_d: "Mantente organizado calculando los plazos de entrega, reuniones o citas con precisión.",
    use_4_t: "Cálculos Financieros",
    use_4_d: "Determina los períodos de pago, los vencimientos de los contratos y la duración de las inversiones.",
    use_5_t: "Planificación Personal",
    use_5_d: "Organiza viajes, aniversarios y otros compromisos personales sin adivinar la duración.",
    use_6_t: "Educación",
    use_6_d: "Calcula los plazos académicos y los calendarios de estudio para optimizar tu tiempo de aprendizaje.",
    use_7_t: "Salud",
    use_7_d: "Controla los intervalos entre consultas, tratamientos o ciclos de medicación con precisión.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Introduce la Fecha de Inicio",
    step_1_desc: "Haz clic en el campo Fecha de Inicio y selecciona la primera fecha.",
    step_2_title: "Introduce la Fecha de Fin",
    step_2_desc: "Haz clic en el campo Fecha de Fin y selecciona la segunda fecha. Los resultados aparecen al instante.",
    step_3_title: "Lee los Resultados",
    step_3_desc: "La primera fila muestra el desglose exacto en años, meses y días. La segunda fila muestra totales equivalentes.",
    ex_title: "Ejemplos Comunes",
    ex1: "Planificación de vacaciones: del 20 de diciembre al 5 de enero — la calculadora muestra 16 días.",
    ex2: "Plazo de proyecto: del 1 de marzo al 30 de junio — el resultado es 3 meses y 29 días.",
    ex3: "Seguimiento de embarazo: del 14 de febrero al 14 de noviembre — exactamente 9 meses.",
    ex4: "Duración de contrato: del 1 de enero al 31 de diciembre — 365 días (o 366 en año bisiesto).",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿La calculadora cuenta el día de inicio?",
    faq1a: "No. El cálculo cuenta el tiempo transcurrido entre las dos fechas. Por ejemplo, del 1 al 3 de enero el resultado es 2 días.",
    faq2q: "¿Esta herramienta maneja correctamente los años bisiestos?",
    faq2a: "Sí. El cálculo reconoce correctamente los años bisiestos. Febrero de 2024 tiene 29 días y esto se refleja automáticamente.",
    faq3q: "¿Qué pasa si introduzco la fecha de fin antes que la de inicio?",
    faq3a: "La herramienta invierte automáticamente las fechas y calcula la diferencia normalmente. Siempre obtendrás un resultado positivo.",
    see1: "Calculadora de Diferencia de Horas",
    see2: "Calculadora de Diferencia de Fecha y Hora",
    see3: "Calculadora de Fecha Futura",
    see4: "Calculadora de Fecha Pasada"
  },
  fr: {
    title: "Calculateur de Différence entre Dates",
    pageTitle: "Calculateur de Différence entre Dates — Calculez le Temps entre Deux Dates",
    meta: "Calculez la différence entre deux dates instantanément. Obtenez le résultat exact en années, mois et jours, plus les équivalents en semaines, jours totaux, heures et minutes.",
    param1: "Date de Début",
    param2: "Date de Fin",
    diff: "Différence Exacte",
    or: "Ou de manière équivalente…",
    years_label: "Années",
    months_label: "Mois",
    days_label: "Jours",
    total_months_label: "Total en Mois",
    total_weeks_label: "Total en Semaines",
    total_days_label: "Total en Jours",
    total_hours_label: "Total en Heures",
    total_minutes_label: "Total en Minutes",
    eq: "Veuillez sélectionner deux dates différentes pour calculer la différence",
    features_title: "Fonctionnalités",
    f_1: "Résultat exact en années, mois et jours restants",
    f_2: "Totaux équivalents : mois, semaines, jours, heures et minutes",
    f_3: "Gestion automatique des années bissextiles",
    f_4: "Correction automatique de l'ordre des dates",
    how_desc: "Découvrez exactement combien de temps sépare deux dates quelconques. Le résultat affiche la différence en années, mois et jours, ainsi que des équivalents en semaines, jours totaux, heures ou minutes selon l'intervalle. Les années bissextiles et les mois de durées différentes sont gérés automatiquement.",
    use_cases_title: "Principaux Cas d'Utilisation",
    use_1_t: "Gestion de Projet",
    use_1_d: "Suivez les délais, les jalons et les calendriers de vos projets et objectifs professionnels.",
    use_2_t: "Organisation d'Événements",
    use_2_d: "Planifiez des événements basés sur des dates spécifiques et des intervalles précis pour une coordination parfaite.",
    use_3_t: "Suivi des Délais",
    use_3_d: "Restez organisé en calculant précisément les délais de livraison, de réunion ou de rendez-vous.",
    use_4_t: "Calculs Financiers",
    use_4_d: "Déterminez les périodes de paiement, les expirations de contrat et les durées d'investissement.",
    use_5_t: "Planification Personnelle",
    use_5_d: "Organisez vos voyages, anniversaires et autres engagements personnels sans deviner la durée.",
    use_6_t: "Éducation",
    use_6_d: "Calculez les délais académiques et les calendriers scolaires pour optimiser votre temps d'apprentissage.",
    use_7_t: "Santé",
    use_7_d: "Suivez avec précision les intervalles entre les consultations, les traitements ou les cycles de médication.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Entrez la Date de Début",
    step_1_desc: "Cliquez sur le champ Date de Début et sélectionnez la première date.",
    step_2_title: "Entrez la Date de Fin",
    step_2_desc: "Cliquez sur le champ Date de Fin et sélectionnez la deuxième date. Les résultats apparaissent instantanément.",
    step_3_title: "Lisez les Résultats",
    step_3_desc: "La première ligne affiche la décomposition exacte en années, mois et jours. La deuxième ligne montre les totaux équivalents.",
    ex_title: "Exemples Courants",
    ex1: "Planification de vacances : du 20 décembre au 5 janvier — le calculateur affiche 16 jours.",
    ex2: "Délai de projet : du 1er mars au 30 juin — le résultat est 3 mois et 29 jours.",
    ex3: "Suivi de grossesse : du 14 février au 14 novembre — exactement 9 mois.",
    ex4: "Durée de contrat : du 1er janvier au 31 décembre — 365 jours (ou 366 en année bissextile).",
    faq_title: "Questions et Réponses",
    faq1q: "Le calculateur compte-t-il le jour de début ?",
    faq1a: "Non. Le calcul compte le temps écoulé entre les deux dates. Par exemple, du 1er au 3 janvier le résultat est 2 jours.",
    faq2q: "Cet outil gère-t-il correctement les années bissextiles ?",
    faq2a: "Oui. Le calcul reconnaît correctement les années bissextiles. Février 2024 a 29 jours, ce qui est automatiquement reflété.",
    faq3q: "Que se passe-t-il si j'entre la date de fin avant la date de début ?",
    faq3a: "L'outil inverse automatiquement les dates et calcule la différence normalement. Vous obtiendrez toujours un résultat positif.",
    see1: "Calculateur de Différence d'Heures",
    see2: "Calculateur de Différence de Date et Heure",
    see3: "Calculateur de Date Future",
    see4: "Calculateur de Date Passée"
  },
  it: {
    title: "Calcolatore di Differenza tra Date",
    pageTitle: "Calcolatore di Differenza tra Date — Calcola il Tempo tra Due Date",
    meta: "Calcola la differenza tra due date all'istante. Ottieni il risultato esatto in anni, mesi e giorni, più equivalenti in settimane, giorni totali, ore e minuti.",
    param1: "Data di Inizio",
    param2: "Data di Fine",
    diff: "Differenza Esatta",
    or: "Oppure equivalentemente…",
    years_label: "Anni",
    months_label: "Mesi",
    days_label: "Giorni",
    total_months_label: "Totale Mesi",
    total_weeks_label: "Totale Settimane",
    total_days_label: "Totale Giorni",
    total_hours_label: "Totale Ore",
    total_minutes_label: "Totale Minuti",
    eq: "Seleziona due date diverse per calcolare la differenza",
    features_title: "Funzionalità",
    f_1: "Risultato esatto in anni, mesi e giorni rimanenti",
    f_2: "Totali equivalenti: mesi, settimane, giorni, ore e minuti",
    f_3: "Gestione automatica degli anni bisestili",
    f_4: "Correzione automatica dell'ordine delle date",
    how_desc: "Scopri esattamente quanto tempo separa due date qualsiasi. Il risultato mostra la differenza in anni, mesi e giorni, più gli equivalenti in settimane, giorni totali, ore o minuti in base all'intervallo. Gli anni bisestili e i mesi di durata diversa sono gestiti automaticamente.",
    use_cases_title: "Principali Casi d'Uso",
    use_1_t: "Gestione Progetti",
    use_1_d: "Monitora scadenze, traguardi e cronoprogrammi per i tuoi progetti e obiettivi professionali.",
    use_2_t: "Organizzazione Eventi",
    use_2_d: "Pianifica eventi basandoti su date precise e intervalli accurati per garantire una coordinazione perfetta.",
    use_3_t: "Controllo Scadenze",
    use_3_d: "Rimani organizzato calcolando con precisione i termini di consegna, riunioni o appuntamenti.",
    use_4_t: "Calcoli Finanziari",
    use_4_d: "Determina periodi di pagamento, scadenze contrattuali e durate degli investimenti per un miglior controllo.",
    use_5_t: "Pianificazione Personale",
    use_5_d: "Organizza viaggi, anniversari e altri impegni personali senza dover indovinare la durata.",
    use_6_t: "Istruzione",
    use_6_d: "Calcola scadenze accademiche e calendari scolastici per ottimizzare il tuo tempo di apprendimento.",
    use_7_t: "Salute",
    use_7_d: "Monitora con precisione gli intervalli tra visite, trattamenti o cicli di medicazione.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Inserisci la Data di Inizio",
    step_1_desc: "Clicca sul campo Data di Inizio e seleziona la prima data.",
    step_2_title: "Inserisci la Data di Fine",
    step_2_desc: "Clicca sul campo Data di Fine e seleziona la seconda data. I risultati appaiono istantaneamente.",
    step_3_title: "Leggi i Risultati",
    step_3_desc: "La prima riga mostra il dettaglio esatto in anni, mesi e giorni. La seconda riga mostra i totali equivalenti.",
    ex_title: "Esempi Comuni",
    ex1: "Pianificazione vacanze: dal 20 dicembre al 5 gennaio — il calcolatore mostra 16 giorni.",
    ex2: "Scadenza progetto: dal 1° marzo al 30 giugno — il risultato è 3 mesi e 29 giorni.",
    ex3: "Monitoraggio gravidanza: dal 14 febbraio al 14 novembre — esattamente 9 mesi.",
    ex4: "Durata contratto: dal 1° gennaio al 31 dicembre — 365 giorni (o 366 in anno bisestile).",
    faq_title: "Domande e Risposte",
    faq1q: "Il calcolatore conta il giorno di inizio?",
    faq1a: "No. Il calcolo conta il tempo trascorso tra le due date. Ad esempio, dal 1° al 3 gennaio il risultato è 2 giorni.",
    faq2q: "Questo strumento gestisce correttamente gli anni bisestili?",
    faq2a: "Sì. Il calcolo riconosce correttamente gli anni bisestili. Febbraio 2024 ha 29 giorni e questo viene riflesso automaticamente.",
    faq3q: "Cosa succede se inserisco la data di fine prima di quella di inizio?",
    faq3a: "Lo strumento inverte automaticamente le date e calcola la differenza normalmente. Otterrai sempre un risultato positivo.",
    see1: "Calcolatore di Differenza tra Ore",
    see2: "Calcolatore di Differenza tra Data e Ora",
    see3: "Calcolatore di Data Futura",
    see4: "Calcolatore di Data Passata"
  },
  id: {
    title: "Kalkulator Selisih Tanggal",
    pageTitle: "Kalkulator Selisih Tanggal — Hitung Waktu antara Dua Tanggal",
    meta: "Hitung selisih antara dua tanggal secara instan. Dapatkan hasil tepat dalam tahun, bulan, dan hari, plus setara dalam minggu, total hari, jam, dan menit.",
    param1: "Tanggal Mulai",
    param2: "Tanggal Akhir",
    diff: "Selisih Tepat",
    or: "Atau setara dengan…",
    years_label: "Tahun",
    months_label: "Bulan",
    days_label: "Hari",
    total_months_label: "Total Bulan",
    total_weeks_label: "Total Minggu",
    total_days_label: "Total Hari",
    total_hours_label: "Total Jam",
    total_minutes_label: "Total Menit",
    eq: "Pilih dua tanggal yang berbeda untuk menghitung selisihnya",
    features_title: "Fitur",
    f_1: "Hasil tepat dalam tahun, bulan, dan hari yang tersisa",
    f_2: "Total setara: bulan, minggu, hari, jam, dan menit",
    f_3: "Penanganan tahun kabisat secara otomatis",
    f_4: "Koreksi urutan tanggal secara otomatis",
    how_desc: "Temukan dengan tepat berapa lama jarak antara dua tanggal mana pun. Hasilnya menampilkan selisih dalam tahun, bulan, dan hari, ditambah setara dalam minggu, total hari, jam, atau menit sesuai intervalnya. Tahun kabisat dan bulan dengan panjang berbeda ditangani secara otomatis.",
    use_cases_title: "Kasus Penggunaan Utama",
    use_1_t: "Manajemen Proyek",
    use_1_d: "Pantau tenggat waktu, tonggak, dan jadwal untuk proyek dan tujuan profesional Anda.",
    use_2_t: "Perencanaan Acara",
    use_2_d: "Jadwalkan acara berdasarkan tanggal dan interval yang tepat untuk memastikan koordinasi yang sempurna.",
    use_3_t: "Pemantauan Tenggat",
    use_3_d: "Tetap terorganisir dengan menghitung batas waktu pengiriman, rapat, atau janji temu secara presisi.",
    use_4_t: "Perhitungan Keuangan",
    use_4_d: "Tentukan periode pembayaran, jatuh tempo kontrak, dan durasi investasi untuk kontrol keuangan yang lebih baik.",
    use_5_t: "Perencanaan Pribadi",
    use_5_d: "Atur perjalanan, hari jadi, dan komitmen pribadi lainnya tanpa menebak durasinya.",
    use_6_t: "Pendidikan",
    use_6_d: "Hitung tenggat akademik dan jadwal belajar untuk mengoptimalkan waktu belajar Anda.",
    use_7_t: "Kesehatan",
    use_7_d: "Pantau interval antara konsultasi, perawatan, atau siklus pengobatan secara akurat.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Masukkan Tanggal Mulai",
    step_1_desc: "Klik kolom Tanggal Mulai dan pilih tanggal pertama.",
    step_2_title: "Masukkan Tanggal Akhir",
    step_2_desc: "Klik kolom Tanggal Akhir dan pilih tanggal kedua. Hasilnya langsung muncul.",
    step_3_title: "Baca Hasilnya",
    step_3_desc: "Baris pertama menampilkan rincian tepat dalam tahun, bulan, dan hari. Baris kedua menampilkan total setara.",
    ex_title: "Contoh Umum",
    ex1: "Perencanaan liburan: dari 20 Desember hingga 5 Januari — kalkulator menampilkan 16 hari.",
    ex2: "Tenggat proyek: dari 1 Maret hingga 30 Juni — hasilnya adalah 3 bulan 29 hari.",
    ex3: "Pemantauan kehamilan: dari 14 Februari hingga 14 November — tepat 9 bulan.",
    ex4: "Durasi kontrak: dari 1 Januari hingga 31 Desember — 365 hari (atau 366 di tahun kabisat).",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Apakah kalkulator menghitung tanggal mulai?",
    faq1a: "Tidak. Perhitungan menghitung waktu yang berlalu di antara dua tanggal. Misalnya, dari 1 Januari hingga 3 Januari hasilnya adalah 2 hari.",
    faq2q: "Apakah alat ini menangani tahun kabisat dengan benar?",
    faq2a: "Ya. Perhitungan mengenali tahun kabisat dengan benar. Februari 2024 memiliki 29 hari dan ini secara otomatis tercermin dalam hasilnya.",
    faq3q: "Apa yang terjadi jika saya memasukkan tanggal akhir sebelum tanggal mulai?",
    faq3a: "Alat ini secara otomatis membalik tanggal dan menghitung selisih seperti biasa. Anda selalu mendapatkan hasil positif.",
    see1: "Selisih Waktu",
    see2: "Selisih Tanggal dan Waktu",
    see3: "Kalkulator Tanggal Masa Depan",
    see4: "Kalkulator Tanggal Masa Lalu"
  },
  de: {
    title: "Datumsdifferenz",
    pageTitle: "Datumsdifferenz-Rechner — Zeit zwischen zwei Daten berechnen",
    meta: "Berechnen Sie sofort die Differenz zwischen zwei Daten. Erhalten Sie das exakte Ergebnis in Jahren, Monaten und Tagen sowie Entsprechungen in Wochen, Gesamttagen, Stunden und Minuten.",
    param1: "Startdatum",
    param2: "Enddatum",
    diff: "Exakte Differenz",
    or: "Oder entsprechend…",
    years_label: "Jahre",
    months_label: "Monate",
    days_label: "Tage",
    total_months_label: "Gesamtmonate",
    total_weeks_label: "Gesamtwochen",
    total_days_label: "Gesamttage",
    total_hours_label: "Gesamtstunden",
    total_minutes_label: "Gesamtminuten",
    eq: "Bitte wählen Sie zwei verschiedene Daten aus, um die Differenz zu berechnen",
    features_title: "Funktionen",
    f_1: "Exaktes Ergebnis in Jahren, Monaten und verbleibenden Tagen",
    f_2: "Äquivalente Summen: Monate, Wochen, Tage, Stunden und Minuten",
    f_3: "Automatische Berücksichtigung von Schaltjahren",
    f_4: "Automatische Korrektur der Datumsreihenfolge",
    how_desc: "Finden Sie genau heraus, wie viel Zeit zwischen zwei beliebigen Daten liegt. Das Ergebnis zeigt die Differenz aufgeschlüsselt in Jahren, Monaten und Tagen sowie praktische Entsprechungen in Wochen, Gesamttagen, Stunden oder Minuten. Schaltjahre und Monate unterschiedlicher Länge werden automatisch berücksichtigt.",
    use_cases_title: "Hauptanwendungsfälle",
    use_1_t: "Projektmanagement",
    use_1_d: "Verfolgen Sie Fristen, Meilensteine und Zeitpläne für Ihre Projekte und beruflichen Ziele.",
    use_2_t: "Veranstaltungsplanung",
    use_2_d: "Planen Sie Veranstaltungen basierend auf spezifischen Daten und präzisen Intervallen für eine perfekte Koordination.",
    use_3_t: "Fristenüberwachung",
    use_3_d: "Bleiben Sie organisiert, indem Sie Liefer-, Besprechungs- oder Terminfristen präzise berechnen.",
    use_4_t: "Finanzberechnungen",
    use_4_d: "Bestimmen Sie Zahlungsperioden, Vertragsabläufe und Investitionsdauern für eine bessere Finanzkontrolle.",
    use_5_t: "Persönliche Planung",
    use_5_d: "Planen Sie Reisen, Jubiläen und andere persönliche Verpflichtungen, ohne die Dauer schätzen zu müssen.",
    use_6_t: "Bildung",
    use_6_d: "Berechnen Sie akademische Fristen und Lernpläne, um Ihre Lernzeit zu optimieren.",
    use_7_t: "Gesundheit & Wohlbefinden",
    use_7_d: "Verfolgen Sie Intervalle zwischen Terminen, Behandlungen oder Medikamentenzyklen genau.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Startdatum eingeben",
    step_1_desc: "Klicken Sie auf das Feld Startdatum und wählen Sie das erste Datum aus dem Kalender aus oder geben Sie es direkt ein.",
    step_2_title: "Enddatum eingeben",
    step_2_desc: "Klicken Sie auf das Feld Enddatum und wählen Sie das zweite Datum aus. Die Ergebnisse werden sofort angezeigt.",
    step_3_title: "Ergebnisse lesen",
    step_3_desc: "Die erste Zeile zeigt die exakte Aufschlüsselung in Jahren, Monaten und Tagen. Die zweite Zeile zeigt entsprechende Gesamtsummen.",
    ex_title: "Häufige Beispiele",
    ex1: "Urlaubsplanung: vom 20. Dezember bis 5. Januar — der Rechner zeigt 16 Tage an.",
    ex2: "Projektfrist: vom 1. März bis 30. Juni — das Ergebnis ist 3 Monate und 29 Tage.",
    ex3: "Schwangerschaftsüberwachung: vom 14. Februar bis 14. November — genau 9 Monate.",
    ex4: "Vertragslaufzeit: vom 1. Januar bis 31. Dezember — 365 Tage (oder 366 im Schaltjahr).",
    faq_title: "Fragen und Antworten",
    faq1q: "Zählt der Rechner den Starttag mit?",
    faq1a: "Nein. Die Berechnung zählt die verstrichene Zeit zwischen den beiden Daten. Zum Beispiel ist das Ergebnis vom 1. bis zum 3. Januar 2 Tage.",
    faq2q: "Berücksichtigt dieses Tool Schaltjahre korrekt?",
    faq2a: "Ja. Die Berechnung erkennt Schaltjahre korrekt. Der Februar 2024 hat 29 Tage, was sich automatisch in den Ergebnissen widerspiegelt.",
    faq3q: "Was passiert, wenn ich das Enddatum vor dem Startdatum eingebe?",
    faq3a: "Das Tool vertauscht die Daten automatisch und berechnet die Differenz normal. Sie erhalten immer ein positives Ergebnis.",
    see1: "Stunden-Differenz-Rechner",
    see2: "Datum-Zeit-Differenz-Rechner",
    see3: "Zukunfts-Datum-Rechner",
    see4: "Vergangenheits-Datum-Rechner"
  },
  nl: {
    title: "Datumsverschil berekenen",
    pageTitle: "Datumsverschil berekenen — Bereken dagen tussen twee datums | Gratis",
    meta: "Bereken direct het verschil tussen twee datums. Krijg exacte resultaten in jaren, maanden en dagen, plus equivalenten in weken, totale dagen, uren en minuten.",
    param1: "Begindatum",
    param2: "Einddatum",
    diff: "Exact verschil",
    or: "Of gelijkwaardig…",
    years_label: "Jaren",
    months_label: "Maanden",
    days_label: "Dagen",
    total_months_label: "Totaal aantal maanden",
    total_weeks_label: "Totaal aantal weken",
    total_days_label: "Totaal aantal dagen",
    total_hours_label: "Totaal aantal uren",
    total_minutes_label: "Totaal aantal minuten",
    eq: "Selecteer twee verschillende datums om het verschil te berekenen",
    features_title: "Kenmerken",
    f_1: "Exacte uitsplitsing in jaren, maanden en resterende dagen",
    f_2: "Gelijkwaardige totalen: maanden, weken, dagen, uren en minuten",
    f_3: "Automatische verwerking van schrikkeljaren",
    f_4: "Automatische correctie van de datumvolgorde",
    how_desc: "Ontdek precies hoeveel tijd er tussen twee datums zit. Het resultaat toont het verschil uitgesplitst in jaren, maanden en dagen, plus handige equivalenten in weken, totale dagen, uren of minuten. Schrikkeljaren en maanden van verschillende lengtes worden automatisch verwerkt.",
    use_cases_title: "Belangrijkste toepassingen",
    use_1_t: "Projectmanagement",
    use_1_d: "Volg deadlines, mijlpalen en tijdlijnen voor uw projecten en professionele doelen.",
    use_2_t: "Evenementenplanning",
    use_2_d: "Plan evenementen op basis van specifieke datums en nauwkeurige intervallen voor een perfecte coördinatie.",
    use_3_t: "Deadlinebewaking",
    use_3_d: "Blijf georganiseerd door leverings-, vergader- of afspraakdeadlines precies te berekenen.",
    use_4_t: "Financiële berekeningen",
    use_4_d: "Bepaal betalingstermijnen, vervaldatums van contracten en investeringsduur voor een betere financiële controle.",
    use_5_t: "Persoonlijke planning",
    use_5_d: "Plan reizen, jubilea en andere persoonlijke verplichtingen zonder de duur te hoeven raden.",
    use_6_t: "Onderwijs",
    use_6_d: "Bereken academische deadlines en studieschema's om uw leertijd te optimaliseren.",
    use_7_t: "Gezondheid & Welzijn",
    use_7_d: "Volg intervallen tussen afspraken, behandelingen of medicatiecycli nauwkeurig.",
    how_to_use_title: "Hoe deze tool te gebruiken",
    step_1_title: "Voer een begindatum in",
    step_1_desc: "Klik op het veld Begindatum en kies de eerste datum uit de kalender of typ deze rechtstreeks in.",
    step_2_title: "Voer een einddatum in",
    step_2_desc: "Klik op het veld Einddatum en kies de tweede datum. De resultaten verschijnen onmiddellijk.",
    step_3_title: "Lees de resultaten",
    step_3_desc: "De bovenste rij toont de exacte uitsplitsing in jaren, maanden en dagen. De tweede rij toont handige gelijkwaardige totalen.",
    ex_title: "Veelvoorkomende voorbeelden",
    ex1: "Vakantieplanning: van 20 december tot 5 januari — de calculator toont 16 dagen, waardoor het eenvoudig is om vrij te vragen of accommodatie te boeken.",
    ex2: "Projectdeadline: van 1 maart tot 30 juni — het resultaat is 3 maanden en 29 dagen, handig voor sprint- en mijlpalenplanning.",
    ex3: "Zwangerschapsregistratie: van 14 februari tot 14 november — precies 9 maanden, handig voor aanstaande ouders om vooruit te plannen.",
    ex4: "Contractduur: van 1 januari tot 31 december — 365 dagen (of 366 in een schrikkeljaar), gebruikelijk bij jaarlijkse overeenkomsten.",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Telt de calculator de begindatum mee?",
    faq1a: "Nee. De berekening telt de verstreken tijd tussen de twee datums. Van 1 januari tot 3 januari is het resultaat bijvoorbeeld 2 dagen — de begindatum wordt niet meegeteld.",
    faq2q: "Verwerkt deze tool schrikkeljaren correct?",
    faq2a: "Ja. De berekening herkent schrikkeljaren correct. Februari 2024 heeft 29 dagen, en dit wordt automatisch verwerkt in de resultaten.",
    faq3q: "Wat gebeurt er als ik de einddatum vóór de begindatum invoer?",
    faq3a: "De tool draait de datums automatisch om en berekent het verschil normaal. U ontvangt altijd een positief resultaat, ongeacht de volgorde.",
    see1: "Tijdverschil berekenen",
    see2: "Datum- en tijdverschil berekenen",
    see3: "Datum in de toekomst berekenen",
    see4: "Datum in het verleden berekenen"
  }
}
</i18n>