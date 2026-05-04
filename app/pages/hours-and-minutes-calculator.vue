<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

interface TimeEntry {
  h: number
  m: number
  isSub: boolean
}

const state = reactive({
  hrs: [] as TimeEntry[],
  h: null as number | null,
  m: null as number | null,
  rate: null as number | null,
  res: '0h 0m',
  decRes: '0.00',
  payout: '0.00',
})

watch(() => [state.hrs, state.rate], () => {
  let totalMins = 0
  state.hrs.forEach((entry: TimeEntry) => {
    const mins = entry.h * 60 + entry.m
    totalMins += entry.isSub ? -mins : mins
  })
  const isNeg = totalMins < 0
  const absMins = Math.abs(totalMins)
  const outH = Math.trunc(absMins / 60)
  const outM = absMins % 60
  state.res = (isNeg && absMins > 0 ? '-' : '') + format(outH, outM)
  if (!state.res.trim()) state.res = '0h 0m'
  const decimalValue = totalMins / 60
  state.decRes = decimalValue.toFixed(2)
  if (state.rate && state.rate > 0) {
    state.payout = (Math.max(0, decimalValue) * state.rate).toFixed(2)
  } else {
    state.payout = '0.00'
  }
}, { deep: true })

function add(isSub: boolean) {
  const h = state.h ?? 0
  const m = state.m ?? 0
  if (h > 0 || m > 0) {
    state.hrs.push({ h, m, isSub })
  }
  state.h = null
  state.m = null
}

function clearAll() {
  state.hrs = []
}

function format(h: number, m: number) {
  if (h === 0 && m === 0) return '0h 0m'
  let aux = ''
  if (h > 0) aux += h + 'h '
  if (m > 0 || h === 0) aux += m + 'm'
  return aux.trim()
}

function remove(idx: number) {
  state.hrs.splice(idx, 1)
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
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
    pt: '/calculadora-de-horas-e-minutos',
    es: '/calculadora-de-horas-y-minutos',
    fr: '/calculatrice-d-heures-et-de-minutes',
    it: '/calcolatrice-di-ore-e-minuti',
    id: '/kalkulator-jam-dan-menit',
    de: '/stunden-minuten-rechner',
    nl: '/uren-en-minuten-calculator',
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
      { label: t('see3'), to: 'time-converter' },
      { label: t('see4'), to: 'crontab-generator' },
    ]"
  >
    <!-- Inputs + buttons -->
    <div class="flex flex-wrap items-end gap-4 mb-4">
      <div class="form-control w-32">
        <label class="label pb-1" for="inp-h">
          <span class="label-text font-bold text-base-content/80">{{ t('param_h') }}</span>
        </label>
        <input
          id="inp-h"
          type="number"
          v-model="state.h"
          min="0"
          @keyup.enter="add(false)"
          placeholder="0"
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-control w-32">
        <label class="label pb-1" for="inp-m">
          <span class="label-text font-bold text-base-content/80">{{ t('param_m') }}</span>
        </label>
        <input
          id="inp-m"
          type="number"
          v-model="state.m"
          min="0"
          max="59"
          @keyup.enter="add(false)"
          placeholder="0"
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-control justify-end">
        <div class="flex gap-2">
          <button
            class="btn btn-primary"
            :disabled="!state.h && !state.m"
            @click="add(false)"
          >
            + {{ t('btn_add') }}
          </button>
          <button
            class="btn btn-error"
            :disabled="!state.h && !state.m"
            @click="add(true)"
          >
            − {{ t('btn_sub') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Entry chips -->
    <TransitionGroup
      v-if="state.hrs.length"
      tag="div"
      name="list"
      class="flex flex-wrap gap-2 mb-2"
    >
      <div
        v-for="(hr, i) in state.hrs"
        :key="`${i}-${hr.h}-${hr.m}`"
        class="badge badge-lg gap-1 font-medium py-3"
        :class="hr.isSub ? 'badge-error badge-outline' : 'badge-primary badge-outline'"
      >
        {{ hr.isSub ? '−' : '+' }} {{ format(hr.h, hr.m) }}
        <button class="ml-1 opacity-70 hover:opacity-100 cursor-pointer" @click="remove(i)">✕</button>
      </div>
    </TransitionGroup>

    <!-- Clear all -->
    <div v-if="state.hrs.length" class="mb-4">
      <button class="btn btn-ghost btn-sm text-error" @click="clearAll">
        ✕ {{ t('btn_clear') }}
      </button>
    </div>

    <!-- Hourly rate -->
    <div class="form-control max-w-xs mb-6">
      <label class="label pb-1" for="rate">
        <span class="label-text font-bold text-base-content/80">{{ t('rate_label') }}</span>
      </label>
      <label class="input input-bordered flex items-center gap-2">
        <span class="text-base-content/50 font-medium">$</span>
        <input
          id="rate"
          type="number"
          step="0.01"
          v-model="state.rate"
          :placeholder="t('rate_placeholder')"
          class="grow"
        />
      </label>
    </div>

    <!-- Results -->
    <div class="stats stats-vertical lg:stats-horizontal shadow w-fit border border-base-content/10">
      <div class="stat text-center">
        <div class="stat-title">{{ t('total_label') }}</div>
        <div class="stat-value text-primary">{{ state.res }}</div>
      </div>
      <div class="stat text-center">
        <div class="stat-title">{{ t('decimal_label') }}</div>
        <div class="stat-value text-3xl">{{ state.decRes }}<span class="text-base opacity-60">h</span></div>
      </div>
      <div class="stat text-center">
        <div class="stat-title">{{ t('payout_label') }}</div>
        <div class="stat-value text-3xl text-success"><span class="text-base opacity-60">$</span>{{ state.payout }}</div>
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
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') },
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
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Hours and Minutes Calculator",
    pageTitle: "Hours and Minutes Calculator — Add and Subtract Time Online",
    meta: "Free online hours and minutes calculator. Add or subtract time intervals, get precise accumulated totals, convert to decimal format, and calculate hourly earnings instantly.",
    param_h: "Hours",
    param_m: "Minutes",
    btn_add: "Add",
    btn_sub: "Subtract",
    btn_clear: "Clear All",
    rate_label: "Hourly Rate (Optional)",
    rate_placeholder: "e.g. 45.00",
    total_label: "Total Time",
    decimal_label: "Decimal",
    payout_label: "Payout",
    how_desc: "Manage your time with precision: add and subtract hours and minutes to get accumulated totals simply and quickly. This tool is ideal for timesheet tracking, project billing, or converting to the decimal format required by accounting software. If desired, enter your hourly rate to view the estimated gross payout instantly.",
    features_title: "Features",
    f_1: "Add and subtract multiple time entries in sequence",
    f_2: "Automatically converts the total to decimal hours",
    f_3: "Calculates gross pay when an hourly rate is provided",
    f_4: "Supports negative totals — useful for tracking overtime deductions",
    use_cases_title: "Main Use Cases",
    uc_1_title: "Freelancers and Contractors",
    uc_1_desc: "Add hours worked across multiple projects, subtract breaks and instantly see your invoice total.",
    uc_2_title: "HR and Payroll",
    uc_2_desc: "Convert clock hours to the decimal format required by payroll and accounting software.",
    uc_3_title: "Logbooks and Equipment",
    uc_3_desc: "Sum flight hours, machine hours or service intervals without struggling with minute arithmetic.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Enter a Time Entry",
    step_1_desc: "Type hours and/or minutes in the input fields.",
    step_2_title: "Add or Subtract",
    step_2_desc: "Click Add to accumulate time or Subtract to deduct it — for example a lunch break.",
    step_3_title: "Read the Results",
    step_3_desc: "The total updates instantly in hours and minutes, decimal hours and estimated payout.",
    ex_title: "Common Examples",
    ex1: "Work log: add 3h 30m + 2h 45m and subtract 1h (lunch) — the calculator shows 5h 15m (5.25h).",
    ex2: "Freelance billing: after logging 8h 20m at $55/h the payout shows $458.33 automatically.",
    ex3: "Machine hours: sum daily run times across a week to get the total maintenance interval.",
    faq_title: "Questions & Answers",
    faq1q: "How do I deduct a lunch break?",
    faq1a: "Type the break duration in the fields (e.g. 1 hour, 0 minutes) and click Subtract. The break is removed from the running total automatically.",
    faq2q: "Why are hours shown in decimal format?",
    faq2a: "Payroll and accounting systems use decimal hours (e.g. 0.5 for 30 minutes) to calculate salaries. The decimal value is shown automatically alongside the standard hours-and-minutes total.",
    see1: "Time Difference",
    see2: "Date Time Difference",
    see3: "Time Converter",
    see4: "Crontab Generator"
  },
  pt: {
    title: "Calculadora de Horas e Minutos",
    pageTitle: "Calculadora de Horas e Minutos — Somar e Subtrair Tempo Online",
    meta: "Calculadora de horas e minutos online e gratuita. Some ou subtraia intervalos de tempo, obtenha totais acumulados com precisão, converta para o formato decimal e calcule ganhos por hora instantaneamente.",
    param_h: "Horas",
    param_m: "Minutos",
    btn_add: "Adicionar",
    btn_sub: "Subtrair",
    btn_clear: "Limpar Tudo",
    rate_label: "Ganho por Hora (Opcional)",
    rate_placeholder: "ex: 45.00",
    total_label: "Tempo Total",
    decimal_label: "Decimal",
    payout_label: "Valor a Receber",
    how_desc: "Gerencie seu tempo com precisão: some e subtraia horas e minutos para obter totais acumulados de forma simples e rápida. Esta ferramenta é ideal para controle de ponto, faturamento de projetos ou conversão para o formato decimal exigido por softwares de contabilidade. Se desejar, informe seu valor/hora para visualizar o pagamento bruto estimado instantaneamente.",
    features_title: "Funcionalidades",
    f_1: "Adição e subtração de múltiplas entradas de tempo em sequência",
    f_2: "Conversão automática do total para horas decimais",
    f_3: "Cálculo do pagamento bruto ao informar o valor por hora",
    f_4: "Suporte a totais negativos — útil para controle de deduções de horas extras",
    use_cases_title: "Principais Casos de Uso",
    uc_1_title: "Freelancers e Profissionais Liberais",
    uc_1_desc: "Some horas trabalhadas em projetos, abata intervalos e descubra quanto faturar de imediato.",
    uc_2_title: "RH e Fechamento de Folha",
    uc_2_desc: "Converta horas relógio para o sistema centesimal (decimal) exigido pelos softwares de contabilidade.",
    uc_3_title: "Diários de Bordo e Maquinário",
    uc_3_desc: "Some tempo de voo ou horas de máquina sem quebrar a cabeça com a matemática de minutos.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Informe uma Entrada de Tempo",
    step_1_desc: "Digite horas e/ou minutos nos campos de entrada.",
    step_2_title: "Adicione ou Subtraia",
    step_2_desc: "Clique em Adicionar para acumular tempo ou em Subtrair para descontá-lo — por exemplo, um intervalo de almoço.",
    step_3_title: "Leia os Resultados",
    step_3_desc: "O total é atualizado instantaneamente em horas e minutos, horas decimais e valor estimado a receber.",
    ex_title: "Exemplos Comuns",
    ex1: "Registro de trabalho: adicione 3h 30m + 2h 45m e subtraia 1h (almoço) — a calculadora mostra 5h 15m (5,25h).",
    ex2: "Faturamento freelance: após registrar 8h 20m a $55/h, o valor a receber mostra $458,33 automaticamente.",
    ex3: "Horas de máquina: some os tempos diários de operação durante a semana para obter o intervalo de manutenção total.",
    faq_title: "Perguntas Frequentes",
    faq1q: "Como descontar o horário de almoço do meu total de horas?",
    faq1a: "Digite a duração do intervalo nos campos (por exemplo, 1 hora e 0 minutos) e clique em Subtrair. O desconto é feito automaticamente no total acumulado.",
    faq2q: "Por que converter as horas para formato decimal?",
    faq2a: "A maioria dos softwares de folha de pagamento e gestão de RH utiliza o modelo decimal para calcular salário (onde 30 minutos viram 0,5 horas). O valor decimal é exibido automaticamente ao lado do total em horas e minutos.",
    see1: "Diferença entre Horas",
    see2: "Diferença entre Datas e Horas",
    see3: "Conversor de Tempo",
    see4: "Gerador de Crontab"
  },
  es: {
    title: "Calculadora de Horas y Minutos",
    pageTitle: "Calculadora de Horas y Minutos — Sumar y Restar Tiempo Online",
    meta: "Calculadora de horas y minutos online y gratuita. Sume o reste intervalos de tiempo, obtenga totales acumulados con precisión, convierta a formato decimal y calcule ganancias por hora al instante.",
    param_h: "Horas",
    param_m: "Minutos",
    btn_add: "Añadir",
    btn_sub: "Restar",
    btn_clear: "Borrar Todo",
    rate_label: "Tarifa por Hora (Opcional)",
    rate_placeholder: "ej: 45.00",
    total_label: "Tiempo Total",
    decimal_label: "Decimal",
    payout_label: "Pago Estimado",
    how_desc: "Gestione su tiempo con precisión: sume y reste horas y minutos para obtener totales acumulados de forma sencilla y rápida. Esta herramienta es ideal para el control de asistencia, facturación de proyectos o conversión al formato decimal exigido por los softwares de contabilidad. Si lo desea, ingrese su tarifa por hora para visualizar el pago bruto estimado instantáneamente.",
    features_title: "Características",
    f_1: "Suma y resta múltiples entradas de tiempo en secuencia",
    f_2: "Convierte automáticamente el total a horas decimales",
    f_3: "Calcula el pago bruto al introducir una tarifa por hora",
    f_4: "Admite totales negativos — útil para deducciones de horas extras",
    use_cases_title: "Principales Casos de Uso",
    uc_1_title: "Freelancers y Autónomos",
    uc_1_desc: "Suma horas trabajadas en distintos proyectos, descuenta descansos y obtén el total a facturar de inmediato.",
    uc_2_title: "RRHH y Nóminas",
    uc_2_desc: "Convierte horas de reloj al formato decimal requerido por los programas de contabilidad y nómina.",
    uc_3_title: "Cuadernos de Bitácora y Maquinaria",
    uc_3_desc: "Suma horas de vuelo, horas de máquina o intervalos de servicio sin complicarte con la aritmética de minutos.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Introduce una Entrada de Tiempo",
    step_1_desc: "Escribe horas y/o minutos en los campos de entrada.",
    step_2_title: "Añade o Resta",
    step_2_desc: "Haz clic en Añadir para acumular tiempo o en Restar para deducirlo — por ejemplo, un descanso para comer.",
    step_3_title: "Lee los Resultados",
    step_3_desc: "El total se actualiza al instante en horas y minutos, horas decimales y pago estimado.",
    ex_title: "Ejemplos Comunes",
    ex1: "Registro de trabajo: añade 3h 30m + 2h 45m y resta 1h (comida) — la calculadora muestra 5h 15m (5,25h).",
    ex2: "Facturación freelance: tras registrar 8h 20m a $55/h, el pago estimado muestra $458,33 automáticamente.",
    ex3: "Horas de máquina: suma los tiempos diarios de operación a lo largo de la semana para obtener el intervalo de mantenimiento total.",
    faq_title: "Preguntas Frecuentes",
    faq1q: "¿Cómo descuento el tiempo de comida de mi total de horas?",
    faq1a: "Escribe la duración del descanso en los campos (por ejemplo, 1 hora y 0 minutos) y haz clic en Restar. El descuento se aplica automáticamente al total acumulado.",
    faq2q: "¿Por qué se muestran las horas en formato decimal?",
    faq2a: "La mayoría de los programas de nómina y RRHH usan horas decimales para calcular salarios (donde 30 minutos equivalen a 0,5 horas). El valor decimal aparece automáticamente junto al total en horas y minutos.",
    see1: "Diferencia entre Horas",
    see2: "Diferencia entre Fechas Y Horas",
    see3: "Convertidor de Tiempo",
    see4: "Generador de Crontab"
  },
  fr: {
    title: "Calculateur d'Heures et Minutes",
    pageTitle: "Calculateur d'Heures et de Minutes — Additionner et Soustraire en Ligne",
    meta: "Calculatrice d'heures et de minutes en ligne gratuite. Additionnez ou soustrayez des intervalles de temps, obtenez des totaux accumulés avec précision, convertissez au format décimal et calculez les gains horaires instantanément.",
    param_h: "Heures",
    param_m: "Minutes",
    btn_add: "Ajouter",
    btn_sub: "Soustraire",
    btn_clear: "Tout Effacer",
    rate_label: "Taux Horaire (Optionnel)",
    rate_placeholder: "ex : 45.00",
    total_label: "Temps Total",
    decimal_label: "Décimal",
    payout_label: "Rémunération",
    how_desc: "Gérez votre temps avec précision : additionnez et soustrayez des heures et des minutes pour obtenir des totaux cumulés de manière simple et rapide. Cet outil est idéal pour le suivi du temps de travail, la facturation de projets ou la conversion au format décimal requis par les logiciels de comptabilité. Si vous le souhaitez, saisissez votre taux horaire pour visualiser instantanément la rémunération brute estimée.",
    features_title: "Fonctionnalités",
    f_1: "Addition et soustraction de plusieurs entrées de temps à la suite",
    f_2: "Conversion automatique du total en heures décimales",
    f_3: "Calcul de la rémunération brute en renseignant un taux horaire",
    f_4: "Totaux négatifs pris en charge — utile pour les déductions d'heures supplémentaires",
    use_cases_title: "Principaux Cas d'Utilisation",
    uc_1_title: "Freelances et Indépendants",
    uc_1_desc: "Additionnez les heures travaillées sur plusieurs projets, déduisez les pauses et obtenez immédiatement le total à facturer.",
    uc_2_title: "RH et Paie",
    uc_2_desc: "Convertissez les heures d'horloge au format décimal exigé par les logiciels de comptabilité et de paie.",
    uc_3_title: "Journaux de Bord et Machines",
    uc_3_desc: "Additionnez les heures de vol, les heures machine ou les intervalles de maintenance sans vous battre avec l'arithmétique des minutes.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Saisissez une Entrée de Temps",
    step_1_desc: "Tapez les heures et/ou les minutes dans les champs de saisie.",
    step_2_title: "Ajoutez ou Soustrayez",
    step_2_desc: "Cliquez sur Ajouter pour cumuler du temps ou sur Soustraire pour le déduire — par exemple une pause déjeuner.",
    step_3_title: "Lisez les Résultats",
    step_3_desc: "Le total se met à jour instantanément en heures et minutes, en heures décimales et en rémunération estimée.",
    ex_title: "Exemples Courants",
    ex1: "Journal de travail : ajoutez 3h 30m + 2h 45m et soustrayez 1h (déjeuner) — le calculateur affiche 5h 15m (5,25h).",
    ex2: "Facturation freelance : après avoir enregistré 8h 20m à 55 $/h, la rémunération affiche 458,33 $ automatiquement.",
    ex3: "Heures machine : additionnez les temps de fonctionnement quotidiens sur une semaine pour obtenir l'intervalle de maintenance total.",
    faq_title: "Questions Fréquentes",
    faq1q: "Comment déduire une pause déjeuner de mon total d'heures ?",
    faq1a: "Saisissez la durée de la pause dans les champs (par exemple 1 heure et 0 minute) et cliquez sur Soustraire. La déduction est appliquée automatiquement au total cumulé.",
    faq2q: "Pourquoi les heures sont-elles affichées en format décimal ?",
    faq2a: "La plupart des logiciels de paie et de RH utilisent les heures décimales pour calculer les salaires (30 minutes = 0,5 heure). La valeur décimale s'affiche automatiquement à côté du total en heures et minutes.",
    see1: "Différence entre Heures",
    see2: "Différence entre Dates et Heures",
    see3: "Convertisseur de Temps",
    see4: "Générateur de Crontab"
  },
  it: {
    title: "Calcolatrice di Ore e Minuti",
    pageTitle: "Calcolatrice di Ore e Minuti — Somma e Sottrai Tempo Online",
    meta: "Calcolatrice di ore e minuti online gratuita. Somma o sottrai intervalli di tempo, ottieni totali accumulati con precisione, converti in formato decimale e calcola i guadagni orari istantaneamente.",
    param_h: "Ore",
    param_m: "Minuti",
    btn_add: "Aggiungi",
    btn_sub: "Sottrai",
    btn_clear: "Svuota Tutto",
    rate_label: "Tariffa Oraria (Opzionale)",
    rate_placeholder: "es. 45.00",
    total_label: "Tempo Totale",
    decimal_label: "Decimale",
    payout_label: "Compenso",
    how_desc: "Gestisci il tuo tempo con precisione: somma e sottrai ore e minuti per ottenere totali accumulati in modo semplice e rapido. Questo strumento è ideale per il monitoraggio delle ore di lavoro, la fatturazione di progetti o la conversione nel formato decimale richiesto dai software di contabilità. Se lo desideri, inserisci la tua tariffa oraria per visualizzare istantaneamente il pagamento lordo stimato.",
    features_title: "Funzionalità",
    f_1: "Addizione e sottrazione di più voci di tempo in sequenza",
    f_2: "Conversione automatica del totale in ore decimali",
    f_3: "Calcolo del compenso lordo inserendo una tariffa oraria",
    f_4: "Supporto a totali negativi — utile per le detrazioni di straordinari",
    use_cases_title: "Principali Casi d'Uso",
    uc_1_title: "Freelance e Liberi Professionisti",
    uc_1_desc: "Somma le ore lavorate su più progetti, detrai le pause e ottieni subito il totale da fatturare.",
    uc_2_title: "Risorse Umane e Paghe",
    uc_2_desc: "Converti le ore orologio nel formato decimale richiesto dai software di contabilità e paghe.",
    uc_3_title: "Registri e Macchinari",
    uc_3_desc: "Somma ore di volo, ore macchina o intervalli di manutenzione senza fare i conti con l'aritmetica dei minuti.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Inserisci una Voce di Tempo",
    step_1_desc: "Digita ore e/o minuti nei campi di input.",
    step_2_title: "Aggiungi o Sottrai",
    step_2_desc: "Clicca Aggiungi per accumulare tempo o Sottrai per detrarlo — ad esempio una pausa pranzo.",
    step_3_title: "Leggi i Risultati",
    step_3_desc: "Il totale si aggiorna all'istante in ore e minuti, ore decimali e compenso stimato.",
    ex_title: "Esempi Comuni",
    ex1: "Registro lavoro: aggiungi 3h 30m + 2h 45m e sottrai 1h (pranzo) — la calcolatrice mostra 5h 15m (5,25h).",
    ex2: "Fatturazione freelance: dopo aver registrato 8h 20m a $55/h, il compenso mostra $458,33 automaticamente.",
    ex3: "Ore macchina: somma i tempi di funzionamento giornalieri nell'arco della settimana per ottenere l'intervallo di manutenzione totale.",
    faq_title: "Domande Frequenti",
    faq1q: "Come detraggo la pausa pranzo dal mio totale di ore?",
    faq1a: "Inserisci la durata della pausa nei campi (ad esempio 1 ora e 0 minuti) e clicca Sottrai. La detrazione viene applicata automaticamente al totale accumulato.",
    faq2q: "Perché le ore sono mostrate in formato decimale?",
    faq2a: "La maggior parte dei software paghe e HR usa le ore decimali per calcolare gli stipendi (30 minuti = 0,5 ore). Il valore decimale viene mostrato automaticamente accanto al totale in ore e minuti.",
    see1: "Differenza tra Ore",
    see2: "Differenza tra Date e Ore",
    see3: "Convertitore di Tempo",
    see4: "Generatore di Crontab"
  },
  id: {
    title: "Kalkulator Jam dan Menit",
    pageTitle: "Kalkulator Jam dan Menit — Tambah dan Kurangi Waktu Online",
    meta: "Kalkulator jam dan menit online gratis. Tambah atau kurangi interval waktu, dapatkan total akumulasi dengan presisi, konversi ke format desimal, dan hitung penghasilan per jam secara instan.",
    param_h: "Jam",
    param_m: "Menit",
    btn_add: "Tambah",
    btn_sub: "Kurangi",
    btn_clear: "Hapus Semua",
    rate_label: "Tarif per Jam (Opsional)",
    rate_placeholder: "mis. 45.00",
    total_label: "Total Waktu",
    decimal_label: "Desimal",
    payout_label: "Penghasilan",
    how_desc: "Kelola waktu Anda dengan presisi: tambah dan kurangi jam serta menit untuk mendapatkan total akumulasi dengan cara yang sederhana dan cepat. Alat ini ideal untuk pelacakan jam kerja, penagihan proyek, atau konversi ke format desimal yang diperlukan oleh perangkat lunak akuntansi. Jika diinginkan, masukkan tarif per jam Anda untuk melihat estimasi pembayaran bruto secara instan.",
    features_title: "Fitur",
    f_1: "Penambahan dan pengurangan beberapa entri waktu secara berurutan",
    f_2: "Konversi otomatis total ke jam desimal",
    f_3: "Penghitungan penghasilan kotor saat tarif per jam dimasukkan",
    f_4: "Mendukung total negatif — berguna untuk melacak pemotongan lembur",
    use_cases_title: "Kasus Penggunaan Utama",
    uc_1_title: "Freelancer dan Kontraktor",
    uc_1_desc: "Tambahkan jam kerja dari berbagai proyek, kurangi waktu istirahat, dan langsung ketahui total tagihan Anda.",
    uc_2_title: "HR dan Penggajian",
    uc_2_desc: "Konversi jam ke format desimal yang dibutuhkan perangkat lunak akuntansi dan penggajian.",
    uc_3_title: "Buku Log dan Peralatan",
    uc_3_desc: "Jumlahkan jam terbang, jam mesin, atau interval servis tanpa repot berhitung menit.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Masukkan Entri Waktu",
    step_1_desc: "Ketik jam dan/atau menit di kolom input.",
    step_2_title: "Tambah atau Kurangi",
    step_2_desc: "Klik Tambah untuk mengakumulasi waktu atau Kurangi untuk memotongnya — misalnya waktu istirahat makan siang.",
    step_3_title: "Baca Hasilnya",
    step_3_desc: "Total diperbarui seketika dalam jam dan menit, jam desimal, serta estimasi penghasilan.",
    ex_title: "Contoh Umum",
    ex1: "Catatan kerja: tambahkan 3j 30m + 2j 45m lalu kurangi 1j (makan siang) — kalkulator menampilkan 5j 15m (5,25j).",
    ex2: "Tagihan freelance: setelah mencatat 8j 20m dengan tarif $55/j, penghasilan otomatis menampilkan $458,33.",
    ex3: "Jam mesin: jumlahkan waktu operasi harian selama seminggu untuk mendapatkan total interval perawatan.",
    faq_title: "Pertanyaan Umum",
    faq1q: "Bagaimana cara memotong waktu makan siang dari total jam saya?",
    faq1a: "Ketik durasi istirahat di kolom (misalnya 1 jam dan 0 menit) lalu klik Kurangi. Pengurangan diterapkan otomatis ke total yang terkumpul.",
    faq2q: "Mengapa jam ditampilkan dalam format desimal?",
    faq2a: "Sebagian besar perangkat lunak penggajian dan HR menggunakan jam desimal untuk menghitung gaji (30 menit = 0,5 jam). Nilai desimal ditampilkan otomatis di samping total jam dan menit.",
    see1: "Selisih Waktu",
    see2: "Selisih Tanggal dan Waktu",
    see3: "Konverter Waktu",
    see4: "Generator Crontab"
  },
  de: {
    title: "Stunden- und Minutenrechner",
    pageTitle: "Stunden- und Minutenrechner — Zeit Online Addieren und Subtrahieren",
    meta: "Kostenloser Online-Rechner für Stunden und Minuten. Addieren oder subtrahieren Sie Zeitintervalle, erhalten Sie präzise Gesamtsummen, konvertieren Sie ins Dezimalformat und berechnen Sie sofort Ihren Stundenverdienst.",
    param_h: "Stunden",
    param_m: "Minuten",
    btn_add: "Hinzufügen",
    btn_sub: "Abziehen",
    btn_clear: "Alles löschen",
    rate_label: "Stundensatz (Optional)",
    rate_placeholder: "z.B. 45.00",
    total_label: "Gesamtzeit",
    decimal_label: "Dezimal",
    payout_label: "Voraussichtliche Auszahlung",
    how_desc: "Verwalten Sie Ihre Zeit präzise: Addieren und subtrahieren Sie Stunden und Minuten, um einfach und schnell Gesamtsummen zu erhalten. Dieses Tool ist ideal für die Zeiterfassung, Projektabrechnung oder die Konvertierung in das von Buchhaltungssoftware benötigte Dezimalformat. Geben Sie bei Bedarf Ihren Stundensatz ein, um sofort die geschätzte Bruttoauszahlung zu sehen.",
    features_title: "Funktionen",
    f_1: "Mehrere Zeiteinträge nacheinander addieren und subtrahieren",
    f_2: "Konvertiert die Gesamtsumme automatisch in Dezimalstunden",
    f_3: "Berechnet den Bruttolohn, wenn ein Stundensatz angegeben wird",
    f_4: "Unterstützt negative Gesamtsummen — nützlich für Überstundenabzüge",
    use_cases_title: "Hauptanwendungsfälle",
    uc_1_title: "Freelancer und Auftragnehmer",
    uc_1_desc: "Addieren Sie geleistete Arbeitsstunden aus verschiedenen Projekten, ziehen Sie Pausen ab und sehen Sie sofort Ihren Rechnungsbetrag.",
    uc_2_title: "Personalwesen und Lohnabrechnung",
    uc_2_desc: "Konvertieren Sie Uhrzeitstunden in das von Lohnabrechnungs- und Buchhaltungssoftware benötigte Dezimalformat.",
    uc_3_title: "Logbücher und Ausrüstung",
    uc_3_desc: "Summieren Sie Flugstunden, Maschinenstunden oder Wartungsintervalle, ohne sich mit der Minutenarithmetik abmühen zu müssen.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Zeiteintrag eingeben",
    step_1_desc: "Geben Sie Stunden und/oder Minuten in die Eingabefelder ein.",
    step_2_title: "Addieren oder Subtrahieren",
    step_2_desc: "Klicken Sie auf Hinzufügen, um Zeit zu sammeln, oder auf Abziehen, um sie abzuziehen — zum Beispiel eine Mittagspause.",
    step_3_title: "Ergebnisse lesen",
    step_3_desc: "Die Gesamtsumme wird sofort in Stunden und Minuten, Dezimalstunden und voraussichtlicher Auszahlung aktualisiert.",
    ex_title: "Häufige Beispiele",
    ex1: "Arbeitsprotokoll: 3h 30m + 2h 45m addieren und 1h (Mittagspause) abziehen — der Rechner zeigt 5h 15m (5,25h).",
    ex2: "Freelance-Abrechnung: Nach Erfassung von 8h 20m bei 55 €/h zeigt die Auszahlung automatisch 458,33 € an.",
    ex3: "Maschinenstunden: Summieren Sie die täglichen Laufzeiten einer Woche, um das gesamte Wartungsintervall zu erhalten.",
    faq_title: "Häufig gestellte Fragen",
    faq1q: "Wie ziehe ich eine Mittagspause von meiner Gesamtstundenzahl ab?",
    faq1a: "Geben Sie die Dauer der Pause in die Felder ein (z. B. 1 Stunde, 0 Minuten) und klicken Sie auf Abziehen. Die Pause wird automatisch von der laufenden Gesamtsumme abgezogen.",
    faq2q: "Warum werden Stunden im Dezimalformat angezeigt?",
    faq2a: "Lohnabrechnungs- und Buchhaltungssysteme verwenden Dezimalstunden (z. B. 0,5 für 30 Minuten), um Gehälter zu berechnen. Der Dezimalwert wird automatisch neben der Standard-Stunden-und-Minuten-Gesamtsumme angezeigt.",
    see1: "Stunden-Differenz-Rechner",
    see2: "Datum-Zeit-Differenzrechner",
    see3: "Zeitumrechner",
    see4: "Crontab-Generator"
  },
  nl: {
    title: "Calculator voor uren en minuten",
    pageTitle: "Calculator voor uren en minuten — Tijd online optellen en aftrekken",
    meta: "Gratis online calculator voor uren en minuten. Tel of trek tijdsintervallen af, krijg nauwkeurige totalen, converteer naar decimale uren en bereken direct uw uurloon.",
    param_h: "Uren",
    param_m: "Minuten",
    btn_add: "Toevoegen",
    btn_sub: "Aftrekken",
    btn_clear: "Alles wissen",
    rate_label: "Uurtarief (optioneel)",
    rate_placeholder: "bijv. 45.00",
    total_label: "Totale tijd",
    decimal_label: "Decimaal",
    payout_label: "Uitbetaling",
    how_desc: "Beheer uw tijd nauwkeurig: tel en trek uren en minuten af om eenvoudig en snel totalen te berekenen. Deze tool is ideaal voor urenregistratie, projectfacturatie of conversie naar het decimale formaat dat boekhoudsoftware vereist. Indien gewenst kunt u uw uurtarief invoeren om direct de geschatte bruto-uitbetaling te zien.",
    features_title: "Functies",
    f_1: "Meerdere tijdsinvoerwaarden achter elkaar optellen en aftrekken",
    f_2: "Zet het totaal automatisch om naar decimale uren",
    f_3: "Berekent de bruto-uitbetaling bij invoer van een uurtarief",
    f_4: "Ondersteunt negatieve totalen — handig voor het bijhouden van overuren of aftrek",
    use_cases_title: "Belangrijkste toepassingen",
    uc_1_title: "Freelancers en opdrachtnemers",
    uc_1_desc: "Tel gewerkte uren van meerdere projecten op, trek pauzes af en zie direct uw factuurbedrag.",
    uc_2_title: "HR en salarisadministratie",
    uc_2_desc: "Zet klokuren om naar het decimale formaat dat vereist is door salaris- en boekhoudsoftware.",
    uc_3_title: "Logboeken en apparatuur",
    uc_3_desc: "Tel vlieguren, machine-uren of onderhoudsintervallen zonder ingewikkelde minutenberekeningen.",
    how_to_use_title: "Hoe deze tool te gebruiken",
    step_1_title: "Voer een tijdsinvoer in",
    step_1_desc: "Typ uren en/of minuten in de invoervelden.",
    step_2_title: "Optellen of aftrekken",
    step_2_desc: "Klik op Toevoegen om tijd op te tellen of op Aftrekken om deze te verminderen — bijvoorbeeld een lunchpauze.",
    step_3_title: "Bekijk de resultaten",
    step_3_desc: "Het totaal wordt direct bijgewerkt in uren en minuten, decimale uren en geschatte uitbetaling.",
    ex_title: "Veelvoorkomende voorbeelden",
    ex1: "Werkregistratie: tel 3u 30m + 2u 45m op en trek 1u (lunch) af — de calculator toont 5u 15m (5,25u).",
    ex2: "Freelance facturatie: na registratie van 8u 20m tegen €55/u toont de uitbetaling automatisch €458,33.",
    ex3: "Machine-uren: tel dagelijkse gebruikstijden over een week op om het totale onderhoudsinterval te krijgen.",
    faq_title: "Veelgestelde vragen",
    faq1q: "Hoe trek ik een lunchpauze af van mijn totale uren?",
    faq1a: "Voer de duur van de pauze in (bijv. 1 uur en 0 minuten) en klik op Aftrekken. De pauze wordt automatisch van het totaal afgetrokken.",
    faq2q: "Waarom worden uren in decimaal formaat weergegeven?",
    faq2a: "Salaris- en boekhoudsystemen gebruiken decimale uren (bijv. 0,5 voor 30 minuten) om lonen te berekenen. De decimale waarde wordt automatisch weergegeven naast het standaard totaal in uren en minuten.",
    see1: "Tijdsverschilcalculator",
    see2: "Tijdsverschilcalculator (datum & tijd)",
    see3: "Tijdsomzetter",
    see4: "Crontab-generator"
  }
}
</i18n>

<style lang="postcss" scoped>
.list-move, .list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
.list-leave-active {
  position: absolute;
}
</style>
