<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

interface Result {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
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

function calc() {
  state.result = null
  state.equal = false

  if (!state.p1 || !state.p2) return

  let d1 = new Date(state.p1)
  let d2 = new Date(state.p2)

  if (d1.getTime() === d2.getTime()) {
    state.equal = true
    return
  }

  if (d1 > d2) [d1, d2] = [d2, d1]

  let years = d2.getFullYear() - d1.getFullYear()
  let months = d2.getMonth() - d1.getMonth()
  let days = d2.getDate() - d1.getDate()
  let hours = d2.getHours() - d1.getHours()
  let minutes = d2.getMinutes() - d1.getMinutes()

  if (minutes < 0) { hours--; minutes += 60 }
  if (hours < 0) { days--; hours += 24 }
  if (days < 0) {
    months--
    days += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate()
  }
  if (months < 0) { years--; months += 12 }

  const diffMs = d2.getTime() - d1.getTime()
  const totalMinutes = Math.round(diffMs / 60000)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)

  state.result = {
    years,
    months,
    days,
    hours,
    minutes,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
    totalHours,
    totalMinutes,
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
    en: '/date-time-difference',
    pt: '/diferenca-entre-datas-e-horas',
    es: '/diferencia-entre-fechas-y-horas',
    fr: '/difference-entre-dates-et-heures',
    it: '/differenza-tra-date-e-ore',
    id: '/selisih-tanggal-dan-waktu',
    de: '/differenz-zwischen-datum-und-uhrzeit',
    nl: '/verschil-tussen-datum-en-tijd',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :see-also-links="[
      { label: t('see1'), to: 'birthday-generator' },
      { label: t('see2'), to: 'time-difference' },
      { label: t('see3'), to: 'future-date-calculator' },
      { label: t('see4'), to: 'past-date-calculator' },
    ]"
  >
    <!-- Inputs -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div class="form-control flex-1 min-w-52">
        <label class="label pb-1" for="p1">
          <span class="label-text font-bold text-base-content/80">{{ t('param1') }}</span>
        </label>
        <input
          id="p1"
          type="datetime-local"
          v-model="state.p1"
          :max="state.p2 || undefined"
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-control flex-1 min-w-52">
        <label class="label pb-1" for="p2">
          <span class="label-text font-bold text-base-content/80">{{ t('param2') }}</span>
        </label>
        <input
          id="p2"
          type="datetime-local"
          v-model="state.p2"
          :min="state.p1 || undefined"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Equal warning -->
    <div v-if="state.equal" class="alert alert-warning">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 shrink-0" />
      <span>{{ t('eq') }}</span>
    </div>

    <!-- Results -->
    <div v-if="state.result" class="space-y-4">
      <!-- Exact breakdown -->
      <div>
        <p class="text-xs uppercase tracking-widest text-base-content/50 mb-2">{{ t('diff') }}</p>
        <div class="stats stats-vertical sm:stats-horizontal shadow w-fit border border-base-content/10">
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
          <div v-if="state.result.hours > 0" class="stat text-center">
            <div class="stat-title">{{ t('hours_label') }}</div>
            <div class="stat-value text-primary">{{ state.result.hours }}</div>
          </div>
          <div v-if="state.result.minutes > 0" class="stat text-center">
            <div class="stat-title">{{ t('minutes_label') }}</div>
            <div class="stat-value text-primary">{{ state.result.minutes }}</div>
          </div>
        </div>
      </div>

      <!-- Equivalents -->
      <div>
        <p class="text-xs uppercase tracking-widest text-base-content/50 mb-2">{{ t('or') }}</p>
        <div class="stats stats-vertical lg:stats-horizontal shadow w-fit border border-base-content/10">
          <div v-if="state.result.totalMonths > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_months_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalMonths.toLocaleString() }}</div>
          </div>
          <div v-if="state.result.totalWeeks > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_weeks_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalWeeks.toLocaleString() }}</div>
          </div>
          <div v-if="state.result.totalDays > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_days_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalDays.toLocaleString() }}</div>
          </div>
          <div v-if="state.result.totalHours > 0" class="stat text-center">
            <div class="stat-title">{{ t('total_hours_label') }}</div>
            <div class="stat-value text-3xl">{{ state.result.totalHours.toLocaleString() }}</div>
          </div>
          <div v-if="state.result.totalMinutes > 0" class="stat text-center">
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
            { title: t('use_6_t'), description: t('use_6_d') }
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
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex1') }}</span></li>
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex2') }}</span></li>
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex3') }}</span></li>
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex4') }}</span></li>
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
    title: "Date and Time Difference Calculator",
    pageTitle: "Date and Time Difference Calculator — Calculate Hours Between Two Datetimes | Free",
    meta: "Calculate the exact difference between two dates and times. Get a precise breakdown in years, months, days, hours and minutes, plus equivalent totals. Free, no registration required.",
    param1: "Start Date & Time",
    param2: "End Date & Time",
    diff: "Exact Difference",
    or: "Or equivalently…",
    years_label: "Years",
    months_label: "Months",
    days_label: "Days",
    hours_label: "Hours",
    minutes_label: "Minutes",
    total_months_label: "Total Months",
    total_weeks_label: "Total Weeks",
    total_days_label: "Total Days",
    total_hours_label: "Total Hours",
    total_minutes_label: "Total Minutes",
    eq: "Please select two different datetimes to calculate the difference",
    features_title: "Features",
    f_1: "Exact breakdown in years, months, days, hours and minutes",
    f_2: "Equivalent totals: months, weeks, days, hours and minutes",
    f_3: "Automatic leap year and DST-safe calculation",
    f_4: "Automatic datetime order correction",
    how_desc: "Enter a start datetime and an end datetime. The calculator instantly shows the elapsed time as an exact breakdown (years, months, days, hours and minutes) and as equivalent totals. Ideal whenever you need to measure a precise interval that spans both dates and times.",
    use_cases_title: "Main Applications",
    use_1_t: "Meeting & Event Duration",
    use_1_d: "Calculate how long a conference, shift or event lasted with precise start and end times.",
    use_2_t: "Project Timelines",
    use_2_d: "Measure the precise time between a project kick-off and its deadline, including time of day.",
    use_3_t: "SLA Monitoring",
    use_3_d: "Determine whether a response or resolution time meets service-level agreements (SLAs).",
    use_4_t: "Travel Planning",
    use_4_d: "Find the exact duration of a trip from departure time to arrival time across different time zones.",
    use_5_t: "Legal & Contracts",
    use_5_d: "Calculate notice periods, contract durations, and legal deadlines to the exact hour.",
    use_6_t: "Medical & Scientific",
    use_6_d: "Measure precise intervals between events such as doses, observations, or scientific experiments.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Enter Start Date & Time",
    step_1_desc: "Click the Start Date & Time field and pick a date and time from the picker, or type it directly.",
    step_2_title: "Enter End Date & Time",
    step_2_desc: "Click the End Date & Time field and pick the second datetime. Results appear instantly.",
    step_3_title: "Read the Results",
    step_3_desc: "The top row shows the exact breakdown in years, months, days, hours and minutes. The second row shows convenient equivalent totals.",
    ex_title: "Common Examples",
    ex1: "Shift duration: from January 10 at 08:00 to January 11 at 20:00 — 1 day and 12 hours, or 36 total hours.",
    ex2: "Flight time: from March 15 at 09:30 to March 16 at 06:15 — 20 hours and 45 minutes.",
    ex3: "Project sprint: from April 1 at 09:00 to April 15 at 18:00 — 14 days and 9 hours.",
    ex4: "Contract period: from January 1 at 00:00 to December 31 at 23:59 — 364 days, 23 hours and 59 minutes.",
    faq_title: "Questions and Answers",
    faq1q: "What is the difference between this tool and the Date Difference Calculator?",
    faq1a: "The Date Difference Calculator works with dates only (no time). This tool accepts both date and time, so it can calculate intervals like '20 hours and 45 minutes' that span less than a full day.",
    faq2q: "Does the calculator handle leap years correctly?",
    faq2a: "Yes. The calculation accounts for leap years automatically. February 2024 has 29 days and this is reflected in the results.",
    faq3q: "What happens if I enter the end datetime before the start datetime?",
    faq3a: "The tool automatically reverses the order and calculates the difference normally. You will always receive a positive result.",
    see1: "Birthday Generator",
    see2: "Hour Difference Calculator",
    see3: "Future Date Calculator",
    see4: "Past Date Calculator"
  },
  pt: {
    title: "Calculadora de Diferença entre Datas e Horas",
    pageTitle: "Calculadora de Diferença entre Datas e Horas — Calcule o Intervalo Exato | Grátis",
    meta: "Calcule a diferença exata entre duas datas e horários. Obtenha o resultado detalhado em anos, meses, dias, horas e minutos, mais totais equivalentes.",
    param1: "Data e Hora Inicial",
    param2: "Data e Hora Final",
    diff: "Diferença Exata",
    or: "Ou equivalentemente…",
    years_label: "Anos",
    months_label: "Meses",
    days_label: "Dias",
    hours_label: "Horas",
    minutes_label: "Minutos",
    total_months_label: "Total em Meses",
    total_weeks_label: "Total em Semanas",
    total_days_label: "Total em Dias",
    total_hours_label: "Total em Horas",
    total_minutes_label: "Total em Minutos",
    eq: "Por favor, selecione dois momentos diferentes para calcular a diferença",
    features_title: "Funcionalidades",
    f_1: "Resultado exato em anos, meses, dias, horas e minutos",
    f_2: "Totais equivalentes: meses, semanas, dias, horas e minutos",
    f_3: "Tratamento automático de anos bissextos",
    f_4: "Correção automática da ordem dos momentos informados",
    how_desc: "Informe uma data e hora inicial e uma data e hora final. A calculadora exibe instantaneamente o tempo decorrido como resultado exato (anos, meses, dias, horas e minutos) e como totais equivalentes. Ideal para medir intervalos precisos que envolvem tanto datas quanto horários.",
    use_cases_title: "Principais Aplicações",
    use_1_t: "Duração de Reuniões e Eventos",
    use_1_d: "Calcule quanto tempo durou uma conferência, turno ou evento com horários precisos de início e fim.",
    use_2_t: "Cronogramas de Projetos",
    use_2_d: "Meça o tempo exato entre o início e o prazo final de um projeto, incluindo o horário do dia.",
    use_3_t: "Monitoramento de SLA",
    use_3_d: "Verifique se um tempo de resposta ou resolução atende aos acordos de nível de serviço (SLAs).",
    use_4_t: "Planejamento de Viagens",
    use_4_d: "Descubra a duração exata de uma viagem do horário de partida ao de chegada.",
    use_5_t: "Jurídico e Contratos",
    use_5_d: "Calcule prazos de aviso, vigências contratuais e prazos legais com precisão de hora.",
    use_6_t: "Médico e Científico",
    use_6_d: "Meça intervalos precisos entre eventos como doses, observações ou experimentos científicos.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Informe a Data e Hora Inicial",
    step_1_desc: "Clique no campo Data e Hora Inicial e selecione a data e o horário no seletor, ou digite diretamente.",
    step_2_title: "Informe a Data e Hora Final",
    step_2_desc: "Clique no campo Data e Hora Final e selecione o segundo momento. O resultado aparece instantaneamente.",
    step_3_title: "Leia os Resultados",
    step_3_desc: "A primeira linha exibe o resultado exato em anos, meses, dias, horas e minutos. A segunda linha mostra totais equivalentes.",
    ex_title: "Exemplos Comuns",
    ex1: "Duração de turno: de 10 de janeiro às 08:00 a 11 de janeiro às 20:00 — 1 dia e 12 horas, ou 36 horas no total.",
    ex2: "Tempo de voo: de 15 de março às 09:30 a 16 de março às 06:15 — 20 horas e 45 minutos.",
    ex3: "Sprint de projeto: de 1 de abril às 09:00 a 15 de abril às 18:00 — 14 dias e 9 horas.",
    ex4: "Período contratual: de 1 de janeiro às 00:00 a 31 de dezembro às 23:59 — 364 dias, 23 horas e 59 minutos.",
    faq_title: "Perguntas e Respostas",
    faq1q: "Qual a diferença entre esta ferramenta e a Calculadora de Diferença de Datas?",
    faq1a: "A Calculadora de Diferença de Datas trabalha apenas com datas, sem horário. Esta ferramenta aceita data e hora, permitindo calcular intervalos como '20 horas e 45 minutos' que abrangem menos de um dia completo.",
    faq2q: "Esta ferramenta trata anos bissextos corretamente?",
    faq2a: "Sim. O cálculo considera anos bissextos automaticamente. Fevereiro de 2024 tem 29 dias e isso é refletido nos resultados.",
    faq3q: "O que acontece se eu inserir o momento final antes do inicial?",
    faq3a: "A ferramenta inverte automaticamente a ordem e calcula a diferença normalmente. Você sempre receberá um resultado positivo.",
    see1: "Gerador de Data de Nascimento",
    see2: "Calculadora de Diferença entre Horas",
    see3: "Calculadora de Data Futura",
    see4: "Calculadora de Data Passada"
  },
  es: {
    title: "Calculadora de Diferencia entre Fechas y Horas",
    pageTitle: "Calculadora de Diferencia entre Fechas y Horas — Calcula el Intervalo Exacto | Gratis",
    meta: "Calcula la diferencia exacta entre dos fechas y horas. Obtén el resultado detallado en años, meses, días, horas y minutos, más totales equivalentes.",
    param1: "Fecha y Hora de Inicio",
    param2: "Fecha y Hora de Fin",
    diff: "Diferencia Exacta",
    or: "O equivalentemente…",
    years_label: "Años",
    months_label: "Meses",
    days_label: "Días",
    hours_label: "Horas",
    minutes_label: "Minutos",
    total_months_label: "Total en Meses",
    total_weeks_label: "Total en Semanas",
    total_days_label: "Total en Días",
    total_hours_label: "Total en Horas",
    total_minutes_label: "Total en Minutos",
    eq: "Por favor, selecciona dos momentos diferentes para calcular la diferencia",
    features_title: "Características",
    f_1: "Resultado exacto en años, meses, días, horas y minutos",
    f_2: "Totales equivalentes: meses, semanas, días, horas y minutos",
    f_3: "Manejo automático de años bisiestos",
    f_4: "Corrección automática del orden de fechas",
    how_desc: "Introduce una fecha y hora de inicio y una fecha y hora de fin. La calculadora muestra al instante el tiempo transcurrido como resultado exacto y como totales equivalentes.",
    use_cases_title: "Principales Aplicaciones",
    use_1_t: "Duración de Reuniones",
    use_1_d: "Calcula cuánto duró una conferencia o turno con horarios precisos de inicio y fin.",
    use_2_t: "Cronogramas de Proyectos",
    use_2_d: "Mide el tiempo exacto entre el inicio y la entrega de un proyecto, incluyendo la hora.",
    use_3_t: "Monitoreo de SLA",
    use_3_d: "Comprueba si los tiempos de respuesta cumplen con los acuerdos de nivel de servicio (SLAs).",
    use_4_t: "Planificación de Viajes",
    use_4_d: "Calcula la duración exacta de un viaje desde la hora de salida hasta la de llegada.",
    use_5_t: "Legal y Contratos",
    use_5_d: "Calcula plazos de aviso y vigencias contractuales con precisión de hora.",
    use_6_t: "Médico y Científico",
    use_6_d: "Mide intervalos precisos entre dosis u observaciones científicas.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Introduce la Fecha y Hora de Inicio",
    step_1_desc: "Haz clic en el campo de inicio y selecciona la fecha y hora.",
    step_2_title: "Introduce la Fecha y Hora de Fin",
    step_2_desc: "Haz clic en el campo de fin y selecciona el segundo momento. Los resultados aparecen al instante.",
    step_3_title: "Lee los Resultados",
    step_3_desc: "La primera fila muestra el desglose exacto. La segunda fila muestra totales equivalentes.",
    ex_title: "Ejemplos Comunes",
    ex1: "Duración de turno: del 10 de enero a las 08:00 al 11 de enero a las 20:00 — 1 día y 12 horas.",
    ex2: "Tiempo de vuelo: del 15 de marzo a las 09:30 al 16 de marzo a las 06:15 — 20 horas y 45 minutos.",
    ex3: "Sprint de proyecto: del 1 de abril a las 09:00 al 15 de abril a las 18:00 — 14 días y 9 horas.",
    ex4: "Período contractual: del 1 de enero a las 00:00 al 31 de diciembre a las 23:59 — 364 días y 23 horas.",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Cuál es la diferencia con la Calculadora de Diferencia de Fechas?",
    faq1a: "La Calculadora de Diferencia de Fechas trabaja solo con fechas. Esta herramienta acepta fecha y hora, permitiendo calcular intervalos menores a un día completo.",
    faq2q: "¿Esta herramienta maneja correctamente los años bisiestos?",
    faq2a: "Sí. El cálculo considera los años bisiestos automáticamente.",
    faq3q: "¿Qué pasa si introduzco el momento final antes del inicial?",
    faq3a: "La herramienta invierte el orden automáticamente. Siempre obtendrás un resultado positivo.",
    see1: "Generador de Fecha de Nacimiento",
    see2: "Calculadora de Diferencia de Horas",
    see3: "Calculadora de Fecha Futura",
    see4: "Calculadora de Fecha Pasada"
  },
  fr: {
    title: "Calculateur de Différence entre Dates et Heures",
    pageTitle: "Calculateur de Différence entre Dates et Heures — Calculez l'Intervalle Exact | Gratuit",
    meta: "Calculez la différence exacte entre deux dates et heures. Obtenez le résultat détaillé en années, mois, jours, heures et minutes, plus les totaux équivalents.",
    param1: "Date et Heure de Début",
    param2: "Date et Heure de Fin",
    diff: "Différence Exacte",
    or: "Ou de manière équivalente…",
    years_label: "Années",
    months_label: "Mois",
    days_label: "Jours",
    hours_label: "Heures",
    minutes_label: "Minutes",
    total_months_label: "Total en Mois",
    total_weeks_label: "Total en Semaines",
    total_days_label: "Total en Jours",
    total_hours_label: "Total en Heures",
    total_minutes_label: "Total en Minutes",
    eq: "Veuillez sélectionner deux moments différents pour calculer la différence",
    features_title: "Fonctionnalités",
    f_1: "Résultat exact en années, mois, jours, heures et minutes",
    f_2: "Totaux équivalents : mois, semaines, jours, heures et minutes",
    f_3: "Gestion automatique des années bissextiles",
    f_4: "Correction automatique de l'ordre des dates",
    how_desc: "Entrez une date et heure de début et une date et heure de fin. Le calculateur affiche instantanément le temps écoulé comme résultat exact et comme totaux équivalents.",
    use_cases_title: "Principales Applications",
    use_1_t: "Durée de Réunions",
    use_1_d: "Calculez la durée d'une conférence ou d'un quart de travail avec des heures de début et de fin précises.",
    use_2_t: "Plannings de Projets",
    use_2_d: "Mesurez le temps exact entre le début et la livraison d'un projet, y compris l'heure.",
    use_3_t: "Suivi des SLA",
    use_3_d: "Vérifiez se os tempos de resposta respeitam os acordos de nível de serviço (SLAs).",
    use_4_t: "Planification de Voyages",
    use_4_d: "Calculez la durée exacte d'un voyage de l'heure de départ à l'heure d'arrivée.",
    use_5_t: "Juridique et Contrats",
    use_5_d: "Calculez des délais de préavis et des durées contractuelles avec une précision à l'heure près.",
    use_6_t: "Médical et Scientifique",
    use_6_d: "Mesurez des intervalles précis entre les doses ou les observations scientifiques.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Entrez la Date et Heure de Début",
    step_1_desc: "Cliquez sur le champ de début et sélectionnez la date et l'heure.",
    step_2_title: "Entrez la Date et Heure de Fin",
    step_2_desc: "Cliquez sur le champ de fin et sélectionnez le deuxième moment. Les résultats apparaissent instantanément.",
    step_3_title: "Lisez les Résultats",
    step_3_desc: "La première ligne montre la décomposition exacte. La deuxième ligne montre les totaux équivalents.",
    ex_title: "Exemples Courants",
    ex1: "Durée de quart : du 10 janvier à 08h00 au 11 janvier à 20h00 — 1 jour et 12 heures.",
    ex2: "Temps de vol : du 15 mars à 09h30 au 16 mars à 06h15 — 20 heures et 45 minutes.",
    ex3: "Sprint de projet : du 1er avril à 09h00 au 15 avril à 18h00 — 14 jours et 9 heures.",
    ex4: "Période contractuelle : du 1er janvier à 00h00 au 31 décembre à 23h59 — 364 jours et 23 heures.",
    faq_title: "Questions et Réponses",
    faq1q: "Quelle est la différence avec le Calculateur de Différence entre Dates ?",
    faq1a: "Le Calculateur de Différence entre Dates travaille uniquement avec des dates. Cet outil accepte date et heure, permettant de calculer des intervalles inférieurs à une journée complète.",
    faq2q: "Cet outil gère-t-il correctement les années bissextiles ?",
    faq2a: "Oui. Le calcul prend en compte les années bissextiles automatiquement.",
    faq3q: "Que se passe-t-il si j'entre le moment de fin avant celui de début ?",
    faq3a: "L'outil inverse l'ordre automatiquement. Vous obtiendrez toujours un résultat positif.",
    see1: "Générateur de Date de Naissance",
    see2: "Calculateur de Différence d'Heures",
    see3: "Calculateur de Date Future",
    see4: "Calculateur de Date Passée"
  },
  it: {
    title: "Calcolatore di Differenza tra Date e Ore",
    pageTitle: "Calcolatore di Differenza tra Date e Ore — Calcola l'Intervallo Esatto | Gratis",
    meta: "Calcola la differenza esatta tra due date e orari. Ottieni il risultato dettagliato in anni, mesi, giorni, ore e minuti, più i totali equivalenti.",
    param1: "Data e Ora di Inizio",
    param2: "Data e Ora di Fine",
    diff: "Differenza Esatta",
    or: "Oppure equivalentemente…",
    years_label: "Anni",
    months_label: "Mesi",
    days_label: "Giorni",
    hours_label: "Ore",
    minutes_label: "Minuti",
    total_months_label: "Totale Mesi",
    total_weeks_label: "Totale Settimane",
    total_days_label: "Totale Giorni",
    total_hours_label: "Totale Ore",
    total_minutes_label: "Totale Minuti",
    eq: "Seleziona due momenti diversi per calcolare la differenza",
    features_title: "Funzionalità",
    f_1: "Risultato esatto in anni, mesi, giorni, ore e minuti",
    f_2: "Totali equivalenti: mesi, settimane, giorni, ore e minuti",
    f_3: "Gestione automatica degli anni bisestili",
    f_4: "Correzione automatica dell'ordine delle date",
    how_desc: "Inserisci una data e ora di inizio e una data e ora di fine. Il calcolatore mostra istantaneamente il tempo trascorso come risultato esatto e come totali equivalenti.",
    use_cases_title: "Principali Applicazioni",
    use_1_t: "Durata di Riunioni",
    use_1_d: "Calcola quanto è durata una conferenza o un turno con orari di inizio e fine precisi.",
    use_2_t: "Cronoprogrammi di Progetto",
    use_2_d: "Misura il tempo esatto tra l'inizio e la consegna di un progetto, inclusa l'ora.",
    use_3_t: "Monitoraggio SLA",
    use_3_d: "Verifica se i tempi di risposta rispettano gli accordi sul livello del servizio (SLA).",
    use_4_t: "Pianificazione Viaggi",
    use_4_d: "Calcola la durata esatta di un viaggio dall'orario di partenza a quello di arrivo.",
    use_5_t: "Legale e Contratti",
    use_5_d: "Calcola i periodi di preavviso e le durate contrattuali con precisione all'ora.",
    use_6_t: "Medico e Scientifico",
    use_6_d: "Misura intervalli precisi tra dosi o osservazioni scientifiche.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Inserisci la Data e Ora di Inizio",
    step_1_desc: "Clicca sul campo di inizio e seleziona la data e l'ora.",
    step_2_title: "Inserisci la Data e Ora di Fine",
    step_2_desc: "Clicca sul campo di fine e seleziona il secondo momento. I risultati appaiono istantaneamente.",
    step_3_title: "Leggi i Risultati",
    step_3_desc: "La prima riga mostra il dettaglio esatto. La seconda riga mostra i totali equivalenti.",
    ex_title: "Esempi Comuni",
    ex1: "Durata turno: dal 10 gennaio alle 08:00 all'11 gennaio alle 20:00 — 1 giorno e 12 ore.",
    ex2: "Tempo di volo: dal 15 marzo alle 09:30 al 16 marzo alle 06:15 — 20 ore e 45 minuti.",
    ex3: "Sprint di progetto: dal 1° aprile alle 09:00 al 15 aprile alle 18:00 — 14 giorni e 9 ore.",
    ex4: "Periodo contrattuale: dal 1° gennaio alle 00:00 al 31 dicembre alle 23:59 — 364 giorni e 23 ore.",
    faq_title: "Domande e Risposte",
    faq1q: "Qual è la differenza con il Calcolatore di Differenza tra Date?",
    faq1a: "Il Calcolatore di Differenza tra Date lavora solo con date. Questo strumento accetta data e ora, consentendo di calcolare intervalli inferiori a un giorno intero.",
    faq2q: "Questo strumento gestisce correttamente gli anni bisestili?",
    faq2a: "Sì. Il calcolo considera gli anni bisestili automaticamente.",
    faq3q: "Cosa succede se inserisco il momento di fine prima di quello di inizio?",
    faq3a: "Lo strumento inverte l'ordine automaticamente. Otterrai sempre un risultato positivo.",
    see1: "Generatore di Data di Nascita",
    see2: "Calcolatore di Differenza tra Ore",
    see3: "Calcolatore di Data Futura",
    see4: "Calcolatore di Data Passata"
  },
  id: {
    title: "Kalkulator Selisih Tanggal dan Waktu",
    pageTitle: "Kalkulator Selisih Tanggal dan Waktu — Hitung Interval Tepat | Gratis",
    meta: "Hitung selisih tepat antara dua tanggal dan waktu. Dapatkan hasil rinci dalam tahun, bulan, hari, jam, dan menit, plus total setara.",
    param1: "Tanggal & Waktu Mulai",
    param2: "Tanggal & Waktu Akhir",
    diff: "Selisih Tepat",
    or: "Atau setara dengan…",
    years_label: "Tahun",
    months_label: "Bulan",
    days_label: "Hari",
    hours_label: "Jam",
    minutes_label: "Menit",
    total_months_label: "Total Bulan",
    total_weeks_label: "Total Minggu",
    total_days_label: "Total Hari",
    total_hours_label: "Total Jam",
    total_minutes_label: "Total Menit",
    eq: "Pilih dua momen yang berbeda untuk menghitung selisihnya",
    features_title: "Fitur",
    f_1: "Hasil tepat dalam tahun, bulan, hari, jam, dan menit",
    f_2: "Total setara: bulan, minggu, hari, jam, dan menit",
    f_3: "Penanganan tahun kabisat secara otomatis",
    f_4: "Koreksi urutan tanggal secara otomatis",
    how_desc: "Masukkan tanggal dan waktu mulai serta tanggal dan waktu akhir. Kalkulator langsung menampilkan waktu yang berlalu sebagai hasil tepat dan total setara.",
    use_cases_title: "Kegunaan Utama",
    use_1_t: "Durasi Rapat dan Acara",
    use_1_d: "Hitung berapa lama konferensi, shift, atau acara berlangsung dengan waktu mulai dan akhir yang tepat.",
    use_2_t: "Jadwal Proyek",
    use_2_d: "Ukur waktu tepat antara awal proyek dan tenggat waktunya, termasuk waktu dalam sehari.",
    use_3_t: "Pemantauan SLA",
    use_3_d: "Tentukan apakah waktu respons atau resolusi memenuhi perjanjian tingkat layanan (SLA).",
    use_4_t: "Perencanaan Perjalanan",
    use_4_d: "Hitung durasi tepat perjalanan dari waktu keberangkatan hingga waktu kedatangan.",
    use_5_t: "Hukum & Kontrak",
    use_5_d: "Hitung masa pemberitahuan, durasi kontrak, e-tenggat waktu hukum dengan presisi jam.",
    use_6_t: "Medis & Ilmiah",
    use_6_d: "Ukur interval tepat antara peristiwa seperti dosis, observasi, atau eksperimen ilmiah.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Masukkan Tanggal & Waktu Mulai",
    step_1_desc: "Klik kolom mulai dan pilih tanggal serta waktu.",
    step_2_title: "Masukkan Tanggal & Waktu Akhir",
    step_2_desc: "Klik kolom akhir dan pilih momen kedua. Hasilnya langsung muncul.",
    step_3_title: "Baca Hasilnya",
    step_3_desc: "Baris pertama menampilkan rincian tepat. Baris kedua menampilkan total setara.",
    ex_title: "Contoh Umum",
    ex1: "Durasi shift: dari 10 Januari pukul 08:00 hingga 11 Januari pukul 20:00 — 1 hari dan 12 jam.",
    ex2: "Waktu penerbangan: dari 15 Maret pukul 09:30 hingga 16 Maret pukul 06:15 — 20 jam dan 45 menit.",
    ex3: "Sprint proyek: dari 1 April pukul 09:00 hingga 15 April pukul 18:00 — 14 hari dan 9 jam.",
    ex4: "Periode kontrak: dari 1 Januari pukul 00:00 hingga 31 Desember pukul 23:59 — 364 hari dan 23 jam.",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Apa perbedaan dengan Kalkulator Selisih Tanggal?",
    faq1a: "Kalkulator Selisih Tanggal hanya bekerja dengan tanggal. Alat ini menerima tanggal dan waktu, memungkinkan kalkulasi interval kurang dari satu hari penuh.",
    faq2q: "Apakah alat ini menangani tahun kabisat dengan benar?",
    faq2a: "Ya. Perhitungan mempertimbangkan tahun kabisat secara otomatis.",
    faq3q: "Apa yang terjadi jika saya memasukkan momen akhir sebelum momen mulai?",
    faq3a: "Alat ini membalik urutan secara otomatis. Anda selalu mendapatkan hasil positif.",
    see1: "Generator Tanggal Lahir",
    see2: "Selisih Waktu",
    see3: "Kalkulator Tanggal Masa Depan",
    see4: "Kalkulator Tanggal Masa Lalu"
  },
  de: {
    title: "Rechner für die Differenz zwischen Datum und Uhrzeit",
    pageTitle: "Rechner für die Differenz zwischen Datum und Uhrzeit — Den genauen Zeitraum berechnen | Kostenlos",
    meta: "Berechnen Sie die exakte Differenz zwischen zwei Daten und Uhrzeiten. Erhalten Sie eine präzise Aufschlüsselung in Jahren, Monaten, Tagen, Stunden und Minuten sowie entsprechende Gesamtwerte.",
    param1: "Startdatum & Uhrzeit",
    param2: "Enddatum & Uhrzeit",
    diff: "Exakte Differenz",
    or: "Oder äquivalent…",
    years_label: "Jahre",
    months_label: "Monate",
    days_label: "Tage",
    hours_label: "Stunden",
    minutes_label: "Minuten",
    total_months_label: "Monate gesamt",
    total_weeks_label: "Wochen gesamt",
    total_days_label: "Tage gesamt",
    total_hours_label: "Stunden gesamt",
    total_minutes_label: "Minuten gesamt",
    eq: "Bitte wählen Sie zwei unterschiedliche Zeitpunkte, um die Differenz zu berechnen",
    features_title: "Funktionen",
    f_1: "Exakte Aufschlüsselung in Jahren, Monaten, Tagen, Stunden und Minuten",
    f_2: "Entsprechende Gesamtwerte: Monate, Wochen, Tage, Stunden und Minuten",
    f_3: "Automatische Berücksichtigung von Schaltjahren",
    f_4: "Automatische Korrektur der eingegebenen Reihenfolge",
    how_desc: "Geben Sie ein Startdatum mit Uhrzeit und ein Enddatum mit Uhrzeit ein. Der Rechner zeigt sofort die verstrichene Zeit als exakte Aufschlüsselung (Jahre, Monate, Tage, Stunden und Minuten) sowie als Gesamtwerte an. Ideal, wenn Sie ein präzises Intervall über Datum und Uhrzeit hinweg messen müssen.",
    use_cases_title: "Hauptanwendungen",
    use_1_t: "Dauer von Meetings & Veranstaltungen",
    use_1_d: "Berechnen Sie, wie lange eine Konferenz, Schicht oder Veranstaltung mit genauen Start- und Endzeiten gedauert hat.",
    use_2_t: "Projektzeitpläne",
    use_2_d: "Messen Sie die exakte Zeit zwischen Projektstart und Frist, einschließlich Uhrzeit.",
    use_3_t: "SLA-Überwachung",
    use_3_d: "Bestimmen Sie, ob eine Antwort- oder Lösungszeit die Service-Level-Agreements (SLAs) einhält.",
    use_4_t: "Reiseplanung",
    use_4_d: "Ermitteln Sie die exakte Dauer einer Reise von Abfahrt bis Ankunft über verschiedene Zeitzonen hinweg.",
    use_5_t: "Recht & Verträge",
    use_5_d: "Berechnen Sie Kündigungsfristen, Vertragslaufzeiten und rechtliche Fristen auf die genaue Stunde.",
    use_6_t: "Medizin & Wissenschaft",
    use_6_d: "Messen Sie präzise Intervalle zwischen Ereignissen wie Dosierungen, Beobachtungen oder wissenschaftlichen Experimenten.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Startdatum & Uhrzeit eingeben",
    step_1_desc: "Klicken Sie auf das Feld für Startdatum & Uhrzeit und wählen Sie ein Datum und eine Uhrzeit aus oder geben Sie sie direkt ein.",
    step_2_title: "Enddatum & Uhrzeit eingeben",
    step_2_desc: "Klicken Sie auf das Feld für Enddatum & Uhrzeit und wählen Sie den zweiten Zeitpunkt aus. Die Ergebnisse erscheinen sofort.",
    step_3_title: "Ergebnisse ablesen",
    step_3_desc: "Die erste Zeile zeigt die exakte Aufschlüsselung in Jahren, Monaten, Tagen, Stunden und Minuten. Die zweite Zeile zeigt praktische Gesamtwerte.",
    ex_title: "Häufige Beispiele",
    ex1: "Schichtdauer: vom 10. Januar um 08:00 bis 11. Januar um 20:00 — 1 Tag und 12 Stunden oder 36 Stunden insgesamt.",
    ex2: "Flugzeit: vom 15. März um 09:30 bis 16. März um 06:15 — 20 Stunden und 45 Minuten.",
    ex3: "Projekt-Sprint: vom 1. April um 09:00 bis 15. April um 18:00 — 14 Tage und 9 Stunden.",
    ex4: "Vertragszeitraum: vom 1. Januar um 00:00 bis 31. Dezember um 23:59 — 364 Tage, 23 Stunden und 59 Minuten.",
    faq_title: "Fragen und Antworten",
    faq1q: "Worin liegt der Unterschied zwischen diesem Tool und dem Datumsdifferenz-Rechner?",
    faq1a: "Der Datumsdifferenz-Rechner arbeitet nur mit Daten (ohne Uhrzeit). Dieses Tool akzeptiert sowohl Datum als auch Uhrzeit und kann daher Intervalle wie '20 Stunden und 45 Minuten' berechnen, die kürzer als ein voller Tag sind.",
    faq2q: "Berücksichtigt der Rechner Schaltjahre korrekt?",
    faq2a: "Ja. Die Berechnung berücksichtigt Schaltjahre automatisch. Februar 2024 hat 29 Tage, und das wird in den Ergebnissen berücksichtigt.",
    faq3q: "Was passiert, wenn ich das Enddatum vor dem Startdatum eingebe?",
    faq3a: "Das Tool kehrt die Reihenfolge automatisch um und berechnet die Differenz normal. Sie erhalten immer ein positives Ergebnis.",
    see1: "Geburtstagsrechner",
    see2: "Stundendifferenz-Rechner",
    see3: "Zukunftsrechner",
    see4: "Vergangenheitsrechner"
  },
  nl: {
    title: "Calculator voor verschil tussen datum en tijd",
    pageTitle: "Calculator voor verschil tussen datum en tijd — Bereken het exacte interval | Gratis",
    meta: "Bereken het exacte verschil tussen twee datums en tijden. Krijg een nauwkeurige uitsplitsing in jaren, maanden, dagen, uren en minuten, plus overeenkomstige totalen.",
    param1: "Startdatum & -tijd",
    param2: "Einddatum & -tijd",
    diff: "Exact verschil",
    or: "Of equivalent…",
    years_label: "Jaren",
    months_label: "Maanden",
    days_label: "Dagen",
    hours_label: "Uren",
    minutes_label: "Minuten",
    total_months_label: "Totaal maanden",
    total_weeks_label: "Totaal weken",
    total_days_label: "Totaal dagen",
    total_hours_label: "Totaal uren",
    total_minutes_label: "Totaal minuten",
    eq: "Selecteer twee verschillende momenten om het verschil te berekenen",
    features_title: "Functies",
    f_1: "Exacte uitsplitsing in jaren, maanden, dagen, uren en minuten",
    f_2: "Overeenkomstige totalen: maanden, weken, dagen, uren en minuten",
    f_3: "Automatische verwerking van schrikkeljaren",
    f_4: "Automatische correctie van de ingevoerde volgorde",
    how_desc: "Voer een startdatum en -tijd en een einddatum en -tijd in. De calculator toont direct de verstreken tijd als exacte uitsplitsing (jaren, maanden, dagen, uren en minuten) en als totalen. Ideaal wanneer u een precies interval over datum én tijd wilt meten.",
    use_cases_title: "Belangrijkste toepassingen",
    use_1_t: "Duur van vergaderingen & evenementen",
    use_1_d: "Bereken hoe lang een conferentie, dienst of evenement heeft geduurd met exacte begin- en eindtijden.",
    use_2_t: "Projecttijdlijnen",
    use_2_d: "Meet de exacte tijd tussen de start van een project en de deadline, inclusief tijdstip.",
    use_3_t: "SLA-bewaking",
    use_3_d: "Bepaal of een reactie- of oplostijd voldoet aan service level agreements (SLA's).",
    use_4_t: "Reisplanning",
    use_4_d: "Vind de exacte duur van een reis van vertrektijd tot aankomsttijd over verschillende tijdzones.",
    use_5_t: "Juridisch & contracten",
    use_5_d: "Bereken opzegtermijnen, contractduur en juridische deadlines tot op het uur nauwkeurig.",
    use_6_t: "Medisch & wetenschappelijk",
    use_6_d: "Meet nauwkeurige intervallen tussen gebeurtenissen zoals doses, observaties of wetenschappelijke experimenten.",
    how_to_use_title: "Hoe u deze tool gebruikt",
    step_1_title: "Voer startdatum & -tijd in",
    step_1_desc: "Klik op het veld voor startdatum & -tijd en kies een datum en tijd, of typ deze direct in.",
    step_2_title: "Voer einddatum & -tijd in",
    step_2_desc: "Klik op het veld voor einddatum & -tijd en kies het tweede moment. De resultaten verschijnen direct.",
    step_3_title: "Lees de resultaten",
    step_3_desc: "De eerste rij toont de exacte uitsplitsing in jaren, maanden, dagen, uren en minuten. De tweede rij toont handige totalen.",
    ex_title: "Veelvoorkomende voorbeelden",
    ex1: "Dienstduur: van 10 januari om 08:00 tot 11 januari om 20:00 — 1 dag en 12 uur, of 36 uur totaal.",
    ex2: "Vluchttijd: van 15 maart om 09:30 tot 16 maart om 06:15 — 20 uur en 45 minuten.",
    ex3: "Project-sprint: van 1 april om 09:00 tot 15 april om 18:00 — 14 dagen en 9 uur.",
    ex4: "Contractperiode: van 1 januari om 00:00 tot 31 december om 23:59 — 364 dagen, 23 uur en 59 minuten.",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Wat is het verschil tussen deze tool en de datumverschilcalculator?",
    faq1a: "De datumverschilcalculator werkt alleen met datums (zonder tijd). Deze tool accepteert zowel datum als tijd, waardoor intervallen zoals '20 uur en 45 minuten' kunnen worden berekend die korter zijn dan een volledige dag.",
    faq2q: "Houdt de calculator correct rekening met schrikkeljaren?",
    faq2a: "Ja. De berekening houdt automatisch rekening met schrikkeljaren. Februari 2024 heeft 29 dagen en dat wordt in de resultaten weerspiegeld.",
    faq3q: "Wat gebeurt er als ik het eindmoment vóór het startmoment invoer?",
    faq3a: "De tool draait de volgorde automatisch om en berekent het verschil normaal. U krijgt altijd een positief resultaat.",
    see1: "Geboortedatum-generator",
    see2: "Tijdsverschilcalculator",
    see3: "Toekomstige datum-calculator",
    see4: "Verleden datum-calculator"
  }
}
</i18n>
