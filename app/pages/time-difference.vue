<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

interface Result {
  hours: number
  minutes: number
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

  const [h1, m1] = state.p1.split(':').map(Number)
  const [h2, m2] = state.p2.split(':').map(Number)

  const total1 = h1 * 60 + m1
  const total2 = h2 * 60 + m2
  const diffMinutes = Math.abs(total2 - total1)

  if (diffMinutes === 0) {
    state.equal = true
    return
  }

  state.result = {
    hours: Math.floor(diffMinutes / 60),
    minutes: diffMinutes % 60,
    totalMinutes: diffMinutes,
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
    en: '/time-difference',
    pt: '/diferenca-entre-horas',
    es: '/diferencia-entre-horas',
    fr: '/difference-entre-heures',
    it: '/differenza-tra-ore',
    id: '/selisih-waktu',
    de: '/stundendifferenz-rechner',
    nl: '/tijdsverschilcalculator',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :see-also-links="[
      { label: t('see1'), to: 'birthday-generator' },
      { label: t('see2'), to: 'date-time-difference' },
      { label: t('see3'), to: 'future-date-calculator' },
      { label: t('see4'), to: 'past-date-calculator' },
    ]"
  >
    <!-- Inputs -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div class="form-control flex-1 min-w-40">
        <label class="label pb-1" for="p1">
          <span class="label-text font-bold text-base-content/80">{{ t('param1') }}</span>
        </label>
        <input
          id="p1"
          type="time"
          v-model="state.p1"
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-control flex-1 min-w-40">
        <label class="label pb-1" for="p2">
          <span class="label-text font-bold text-base-content/80">{{ t('param2') }}</span>
        </label>
        <input
          id="p2"
          type="time"
          v-model="state.p2"
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
      <!-- Breakdown -->
      <div>
        <p class="text-xs uppercase tracking-widest text-base-content/50 mb-2">{{ t('diff') }}</p>
        <div class="stats stats-vertical sm:stats-horizontal shadow w-fit border border-base-content/10">
          <div class="stat text-center">
            <div class="stat-title">{{ t('hours_label') }}</div>
            <div class="stat-value text-primary">{{ state.result.hours }}</div>
          </div>
          <div class="stat text-center">
            <div class="stat-title">{{ t('minutes_label') }}</div>
            <div class="stat-value text-primary">{{ state.result.minutes }}</div>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div v-if="state.result.totalMinutes > 0">
        <p class="text-xs uppercase tracking-widest text-base-content/50 mb-2">{{ t('or') }}</p>
        <div class="stats shadow w-fit border border-base-content/10">
          <div class="stat text-center">
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
    title: "Hour Difference Calculator",
    pageTitle: "Hour Difference Calculator — Calculate Time Between Two Times | Free",
    meta: "Calculate the exact difference between two times in hours and minutes, plus the total elapsed time in minutes. Free, no registration required.",
    param1: "Start Time",
    param2: "End Time",
    diff: "Difference",
    or: "Or equivalently…",
    hours_label: "Hours",
    minutes_label: "Minutes",
    total_minutes_label: "Total Minutes",
    eq: "Please enter two different times to calculate the difference",
    features_title: "Features",
    f_1: "Exact breakdown in hours and minutes",
    f_2: "Total elapsed time in minutes",
    f_3: "Automatic time order correction",
    f_4: "Works with any two times of the day",
    how_desc: "Enter a start time and an end time. The calculator instantly shows the exact difference in hours and minutes, plus the total equivalent in minutes. Ideal for tracking work shifts, study sessions, workouts, and any other timed activity.",
    use_cases_title: "Main Applications",
    use_1_t: "Work & Study",
    use_1_d: "Calculate how long you spent on a specific task or study session to optimize your productivity.",
    use_2_t: "Workouts",
    use_2_d: "Track the duration of your training sessions and cardio activities with precision.",
    use_3_t: "Events & Appointments",
    use_3_d: "Organise your day by calculating intervals between activities and appointment times.",
    use_4_t: "Shift Tracking",
    use_4_d: "Quickly find out how many hours and minutes a work shift lasted for payroll or personal logs.",
    use_5_t: "Billing & Invoicing",
    use_5_d: "Compute billable hours between start and end times for clients and freelance projects.",
    use_6_t: "Travel",
    use_6_d: "Measure journey durations when you know the departure and arrival times of your trips.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Enter Start Time",
    step_1_desc: "Click the Start Time field and type or select the starting time.",
    step_2_title: "Enter End Time",
    step_2_desc: "Click the End Time field and type or select the ending time. Results appear instantly.",
    step_3_title: "Read the Results",
    step_3_desc: "The breakdown shows the difference in hours and minutes. Below that you can see the total equivalent in minutes.",
    ex_title: "Common Examples",
    ex1: "Work session: from 09:00 to 17:30 — 8 hours and 30 minutes, or 510 total minutes.",
    ex2: "Workout: from 06:15 to 07:00 — 45 minutes.",
    ex3: "Study block: from 14:00 to 16:45 — 2 hours and 45 minutes, or 165 total minutes.",
    ex4: "Night shift: from 22:00 to 06:00 — 8 hours.",
    faq_title: "Questions and Answers",
    faq1q: "What is the difference between this tool and the Date and Time Difference Calculator?",
    faq1a: "This tool works with time only (no date). The Date and Time Difference Calculator accepts both date and time, allowing you to calculate intervals that span multiple days.",
    faq2q: "What happens if I enter the end time before the start time?",
    faq2a: "The tool automatically calculates the absolute difference, so the order does not matter. You will always receive a positive result.",
    faq3q: "Can I calculate overnight shifts that cross midnight?",
    faq3a: "Yes. Since the tool computes the absolute difference between two times, it works correctly regardless of their order — enter 22:00 and 06:00 and you will get 8 hours.",
    see1: "Birthday Generator",
    see2: "Date and Time Difference Calculator",
    see3: "Future Date Calculator",
    see4: "Past Date Calculator"
  },
  pt: {
    title: "Diferença entre Horas",
    pageTitle: "Calculadora de Diferença entre Horas — Calcule o Tempo entre Dois Horários | Grátis",
    meta: "Com a nossa Calculadora de Horas, você pode calcular a diferença entre dois horários em horas e minutos, obtendo também o total acumulado do tempo decorrido em minutos. Grátis, sem cadastro.",
    param1: "Horário Inicial",
    param2: "Horário Final",
    diff: "Diferença",
    or: "Ou equivalentemente…",
    hours_label: "Horas",
    minutes_label: "Minutos",
    total_minutes_label: "Total em Minutos",
    eq: "Informe horários diferentes para calcular a diferença",
    features_title: "Funcionalidades",
    f_1: "Resultado exato em horas e minutos",
    f_2: "Total do tempo decorrido em minutos",
    f_3: "Inversão automática da ordem dos horários",
    f_4: "Funciona com quaisquer dois horários do dia",
    how_desc: "Basta inserir os horários de início e término nos campos indicados, e o cálculo será realizado automaticamente, retornando a diferença exata entre os dois horários informados em horas e minutos, além do total equivalente em minutos.",
    use_cases_title: "Principais Aplicações",
    use_1_t: "Estudo e Trabalho",
    use_1_d: "Calcule o tempo que você dedicou a uma tarefa específica ou sessão de estudos para otimizar sua produtividade.",
    use_2_t: "Exercícios Físicos",
    use_2_d: "Acompanhe a duração dos seus treinos e atividades de cardio com precisão.",
    use_3_t: "Eventos e Compromissos",
    use_3_d: "Organize o seu dia calculando os intervalos entre as suas atividades e horários de compromissos.",
    use_4_t: "Controle de Turnos",
    use_4_d: "Descubra rapidamente quantas horas e minutos durou um turno de trabalho para folha de pagamento ou registros pessoais.",
    use_5_t: "Faturamento",
    use_5_d: "Calcule horas faturáveis entre o início e o fim de um serviço para clientes e projetos freelance.",
    use_6_t: "Viagens",
    use_6_d: "Meça a duração de trajetos quando você conhece os horários de partida e chegada das suas viagens.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Informe o Horário Inicial",
    step_1_desc: "Clique no campo Horário Inicial e digite ou selecione o horário de início.",
    step_2_title: "Informe o Horário Final",
    step_2_desc: "Clique no campo Horário Final e digite ou selecione o horário de término. O resultado aparece instantaneamente.",
    step_3_title: "Leia os Resultados",
    step_3_desc: "O painel superior exibe a diferença em horas e minutos. Abaixo você vê o total equivalente em minutos.",
    ex_title: "Exemplos Comuns",
    ex1: "Jornada de trabalho: das 09:00 às 17:30 — 8 horas e 30 minutos, ou 510 minutos no total.",
    ex2: "Treino físico: das 06:15 às 07:00 — 45 minutos.",
    ex3: "Bloco de estudo: das 14:00 às 16:45 — 2 horas e 45 minutos, ou 165 minutos no total.",
    ex4: "Turno noturno: das 22:00 às 06:00 — 8 horas.",
    faq_title: "Perguntas e Respostas",
    faq1q: "Qual a diferença entre esta ferramenta e a Calculadora de Diferença entre Datas e Horas?",
    faq1a: "Esta ferramenta trabalha apenas com horários, sem data. A Calculadora de Diferença entre Datas e Horas aceita data e hora, permitindo calcular intervalos que se estendem por vários dias.",
    faq2q: "O que acontece se eu inserir o horário final antes do inicial?",
    faq2a: "A ferramenta calcula automaticamente a diferença absoluta, portanto a ordem não importa. Você sempre receberá um resultado positivo.",
    faq3q: "Posso calcular turnos noturnos que cruzam a meia-noite?",
    faq3a: "Sim. Como a ferramenta calcula a diferença absoluta entre dois horários, ela funciona corretamente independentemente da ordem. Informe 22:00 e 06:00 e você obterá 8 horas.",
    see1: "Gerador de Data de Nascimento",
    see2: "Calculadora de Diferença entre Datas e Horas",
    see3: "Calculadora de Data Futura",
    see4: "Calculadora de Data Passada"
  },
  es: {
    title: "Calculadora de Diferencia entre Horas",
    pageTitle: "Calculadora de Diferencia entre Horas — Calcula el Tiempo entre Dos Horarios | Gratis",
    meta: "Calcula la diferencia entre dos horarios en horas y minutos, obteniendo también el total acumulado en minutos. Gratis, sin registro.",
    param1: "Hora de Inicio",
    param2: "Hora de Fin",
    diff: "Diferencia",
    or: "O equivalentemente…",
    hours_label: "Horas",
    minutes_label: "Minutos",
    total_minutes_label: "Total en Minutos",
    eq: "Introduce dos horarios diferentes para calcular la diferencia",
    features_title: "Características",
    f_1: "Resultado exacto en horas y minutos",
    f_2: "Tiempo total transcurrido en minutos",
    f_3: "Corrección automática del orden de los horarios",
    f_4: "Funciona con cualquier par de horarios del día",
    how_desc: "Introduce una hora de inicio y una hora de fin. La calculadora muestra al instante la diferencia exacta en horas y minutos, más el total equivalente en minutos.",
    use_cases_title: "Principales Aplicaciones",
    use_1_t: "Estudio y Trabajo",
    use_1_d: "Calcula el tiempo dedicado a una tarea específica o sesión de estudio para optimizar tu productividad.",
    use_2_t: "Ejercicio Físico",
    use_2_d: "Controla la duración de tus entrenamientos y actividades de cardio con precisión.",
    use_3_t: "Eventos y Citas",
    use_3_d: "Organiza tu día calculando intervalos entre actividades y horarios de citas.",
    use_4_t: "Control de Turnos",
    use_4_d: "Descubre rápidamente cuántas horas y minutos duró un turno de trabajo para registros personales.",
    use_5_t: "Facturación",
    use_5_d: "Calcula horas facturables entre inicio y fin de un servicio para clientes y proyectos freelance.",
    use_6_t: "Viajes",
    use_6_d: "Mide la duración de trayectos conociendo las horas de salida y llegada de tus viajes.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Introduce la Hora de Inicio",
    step_1_desc: "Haz clic en el campo Hora de Inicio y escribe o selecciona la hora.",
    step_2_title: "Introduce la Hora de Fin",
    step_2_desc: "Haz clic en el campo Hora de Fin y selecciona la segunda hora. Los resultados aparecen al instante.",
    step_3_title: "Lee los Resultados",
    step_3_desc: "El panel superior muestra la diferencia en horas y minutos. Debajo verás el total equivalente en minutos.",
    ex_title: "Ejemplos Comunes",
    ex1: "Jornada laboral: de las 09:00 a las 17:30 — 8 horas y 30 minutos, o 510 minutos en total.",
    ex2: "Entrenamiento: de las 06:15 a las 07:00 — 45 minutos.",
    ex3: "Sesión de estudio: de las 14:00 a las 16:45 — 2 horas y 45 minutos.",
    ex4: "Turno nocturno: de las 22:00 a las 06:00 — 8 horas.",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Cuál es la diferencia con la Calculadora de Diferencia entre Fechas y Horas?",
    faq1a: "Esta herramienta trabaja solo con horarios, sin fecha. La otra calculadora acepta fecha y hora, permitiendo calcular intervalos que abarcan varios días.",
    faq2q: "¿Qué pasa si introduzco la hora de fin antes que la de inicio?",
    faq2a: "La herramienta calcula automáticamente la diferencia absoluta. Siempre obtendrás un resultado positivo.",
    faq3q: "¿Puedo calcular turnos nocturnos que cruzan la medianoche?",
    faq3a: "Sí. Al calcular la diferencia absoluta, el orden no importa. Introduce 22:00 y 06:00 y obtendrás 8 horas.",
    see1: "Generador de Fecha de Nacimiento",
    see2: "Calculadora de Diferencia de Fecha y Hora",
    see3: "Calculadora de Fecha Futura",
    see4: "Calculadora de Fecha Pasada"
  },
  fr: {
    title: "Calculateur de Différence d'Heures",
    pageTitle: "Calculateur de Différence d'Heures — Calculez le Temps entre Deux Horaires | Gratuit",
    meta: "Calculez la différence entre deux horaires en heures et minutes, en obtenant aussi le total écoulé en minutes. Gratuit, sans inscription.",
    param1: "Heure de Début",
    param2: "Heure de Fin",
    diff: "Différence",
    or: "Ou de manière équivalente…",
    hours_label: "Heures",
    minutes_label: "Minutes",
    total_minutes_label: "Total en Minutes",
    eq: "Entrez deux horaires différents pour calculer la différence",
    features_title: "Fonctionnalités",
    f_1: "Résultat exact en heures et minutes",
    f_2: "Temps total écoulé en minutes",
    f_3: "Correction automatique de l'ordre des horaires",
    f_4: "Fonctionne avec n'importe quelle paire d'horaires",
    how_desc: "Entrez une heure de début et une heure de fin. Le calculateur affiche instantanément la différence exacte en heures et minutes, ainsi que le total équivalent en minutes.",
    use_cases_title: "Principales Applications",
    use_1_t: "Étude et Travail",
    use_1_d: "Calculez le temps consacré à une tâche spécifique ou à une session d'étude pour optimiser votre productivité.",
    use_2_t: "Exercice Physique",
    use_2_d: "Suivez avec précision la durée de vos séances d'entraînement et de vos activités cardio.",
    use_3_t: "Événements et Rendez-vous",
    use_3_d: "Organisez votre journée en calculant les intervalles entre les activités et les horaires de rendez-vous.",
    use_4_t: "Suivi des Quarts",
    use_4_d: "Découvrez rapidement combien d'heures et de minutes a duré un quart de travail pour vos registres.",
    use_5_t: "Facturation",
    use_5_d: "Calculez les heures facturables entre le début et la fin d'un service pour vos clients.",
    use_6_t: "Voyages",
    use_6_d: "Mesurez la durée des trajets en connaissant les heures de départ et d'arrivée de vos voyages.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Entrez l'Heure de Début",
    step_1_desc: "Cliquez sur le champ Heure de Début et saisissez ou sélectionnez l'heure.",
    step_2_title: "Entrez l'Heure de Fin",
    step_2_desc: "Cliquez sur le champ Heure de Fin et sélectionnez la deuxième heure. Les résultats apparaissent instantanément.",
    step_3_title: "Lisez les Résultats",
    step_3_desc: "Le panneau supérieur affiche la différence en heures et minutes. En dessous, vous verrez le total équivalent en minutes.",
    ex_title: "Exemples Courants",
    ex1: "Journée de travail : de 09h00 à 17h30 — 8 heures et 30 minutes, ou 510 minutes au total.",
    ex2: "Entraînement : de 06h15 à 07h00 — 45 minutes.",
    ex3: "Session d'étude : de 14h00 à 16h45 — 2 heures et 45 minutes.",
    ex4: "Quart de nuit : de 22h00 à 06h00 — 8 heures.",
    faq_title: "Questions et Réponses",
    faq1q: "Quelle est la différence avec le Calculateur de Différence entre Dates et Heures ?",
    faq1a: "Cet outil travaille uniquement avec des horaires, sans date. L'autre calculateur accepte date et heure, permettant de calculer des intervalles sur plusieurs jours.",
    faq2q: "Que se passe-t-il si j'entre l'heure de fin avant celle de début ?",
    faq2a: "L'outil calcule automatiquement la différence absolue. Vous obtiendrez toujours un résultat positif.",
    faq3q: "Puis-je calculer des quarts de nuit qui traversent minuit ?",
    faq3a: "Oui. En calculant la différence absolue, l'ordre n'a pas d'importance. Entrez 22:00 et 06:00 et vous obtiendrez 8 heures.",
    see1: "Générateur de Date de Naissance",
    see2: "Calculateur de Différence entre Dates et Heures",
    see3: "Calculateur de Date Future",
    see4: "Calculateur de Date Passée"
  },
  it: {
    title: "Calcolatore di Differenza tra Ore",
    pageTitle: "Calcolatore di Differenza tra Ore — Calcola il Tempo tra Due Orari | Gratis",
    meta: "Calcola la differenza tra due orari in ore e minuti, ottenendo anche il totale trascorso in minuti. Gratis, senza registrazione.",
    param1: "Ora di Inizio",
    param2: "Ora di Fine",
    diff: "Differenza",
    or: "Oppure equivalentemente…",
    hours_label: "Ore",
    minutes_label: "Minuti",
    total_minutes_label: "Totale Minuti",
    eq: "Inserisci due orari diversi per calcolare la differenza",
    features_title: "Funzionalità",
    f_1: "Risultato esatto in ore e minuti",
    f_2: "Tempo totale trascorso in minuti",
    f_3: "Correzione automatica dell'ordine degli orari",
    f_4: "Funziona con qualsiasi coppia di orari della giornata",
    how_desc: "Inserisci un orario di inizio e un orario di fine. Il calcolatore mostra istantaneamente la differenza esatta in ore e minuti, più il totale equivalente in minuti.",
    use_cases_title: "Principali Applicazioni",
    use_1_t: "Studio e Lavoro",
    use_1_d: "Calcola il tempo dedicato a un'attività specifica o a una sessione di studio per ottimizzare la produttività.",
    use_2_t: "Esercizio Fisico",
    use_2_d: "Tieni traccia della durata dei tuoi allenamenti e delle attività cardio con precisione.",
    use_3_t: "Eventi e Appuntamenti",
    use_3_d: "Organizza la giornata calcolando gli intervalli tra le diverse attività e gli orari degli appuntamenti.",
    use_4_t: "Controllo Turni",
    use_4_d: "Scopri rapidamente quante ore e minuti è durato un turno di lavoro per i tuoi registri personali.",
    use_5_t: "Fatturazione",
    use_5_d: "Calcola le ore fatturabili tra l'inizio e la fine di un servizio per clienti e progetti freelance.",
    use_6_t: "Viaggi",
    use_6_d: "Misura la durata dei tragitti conoscendo gli orari di partenza e di arrivo dei tuoi viaggi.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Inserisci l'Ora di Inizio",
    step_1_desc: "Clicca sul campo Ora di Inizio e digita o seleziona l'orario.",
    step_2_title: "Inserisci l'Ora di Fine",
    step_2_desc: "Clicca sul campo Ora di Fine e seleziona il secondo orario. I risultati appaiono istantaneamente.",
    step_3_title: "Leggi i Risultati",
    step_3_desc: "Il pannello superiore mostra la differenza in ore e minuti. Sotto trovi il totale equivalente in minuti.",
    ex_title: "Esempi Comuni",
    ex1: "Giornata lavorativa: dalle 09:00 alle 17:30 — 8 ore e 30 minuti, o 510 minuti in totale.",
    ex2: "Allenamento: dalle 06:15 alle 07:00 — 45 minuti.",
    ex3: "Sessione di studio: dalle 14:00 alle 16:45 — 2 ore e 45 minuti.",
    ex4: "Turno notturno: dalle 22:00 alle 06:00 — 8 ore.",
    faq_title: "Domande e Risposte",
    faq1q: "Qual è la differenza con il Calcolatore di Differenza tra Date e Ore?",
    faq1a: "Questo strumento lavora solo con orari, senza data. L'altro calcolatore accetta data e ora, consentendo di calcolare intervalli che si estendono su più giorni.",
    faq2q: "Cosa succede se inserisco l'ora di fine prima di quella di inizio?",
    faq2a: "Lo strumento calcola automaticamente la differenza assoluta. Otterrai sempre un risultato positivo.",
    faq3q: "Posso calcolare turni notturni che attraversano la mezzanotte?",
    faq3a: "Sì. Calcolando la differenza assoluta, l'ordine non conta. Inserisci 22:00 e 06:00 e otterrai 8 ore.",
    see1: "Generatore di Data di Nascita",
    see2: "Calcolatore di Differenza tra Date e Ore",
    see3: "Calcolatore di Data Futura",
    see4: "Calcolatore di Data Passata"
  },
  id: {
    title: "Kalkulator Selisih Waktu",
    pageTitle: "Kalkulator Selisih Waktu — Hitung Waktu antara Dua Jam | Gratis",
    meta: "Hitung selisih antara dua waktu dalam jam dan menit, serta total waktu yang berlalu dalam menit. Gratis, tanpa pendaftaran.",
    param1: "Waktu Mulai",
    param2: "Waktu Akhir",
    diff: "Selisih",
    or: "Atau setara dengan…",
    hours_label: "Jam",
    minutes_label: "Menit",
    total_minutes_label: "Total Menit",
    eq: "Masukkan dua waktu yang berbeda untuk menghitung selisihnya",
    features_title: "Fitur",
    f_1: "Hasil tepat dalam jam dan menit",
    f_2: "Total waktu yang berlalu dalam menit",
    f_3: "Koreksi urutan waktu secara otomatis",
    f_4: "Bekerja dengan pasangan waktu mana pun",
    how_desc: "Masukkan waktu mulai dan waktu akhir. Kalkulator langsung menampilkan selisih tepat dalam jam dan menit, serta total setara dalam menit.",
    use_cases_title: "Kegunaan Utama",
    use_1_t: "Studi dan Pekerjaan",
    use_1_d: "Hitung waktu yang dihabiskan untuk tugas tertentu atau sesi belajar untuk mengoptimalkan produktivitas Anda.",
    use_2_t: "Olahraga",
    use_2_d: "Lacak durasi sesi latihan dan aktivitas kardio Anda dengan presisi.",
    use_3_t: "Acara dan Janji",
    use_3_d: "Atur hari Anda dengan menghitung interval antara aktivitas dan waktu janji temu.",
    use_4_t: "Pelacakan Shift",
    use_4_d: "Cari tahu dengan cepat berapa jam dan menit shift kerja berlangsung untuk catatan pribadi Anda.",
    use_5_t: "Penagihan",
    use_5_d: "Hitung jam yang dapat ditagih antara awal dan akhir layanan untuk klien dan proyek freelance.",
    use_6_t: "Perjalanan",
    use_6_d: "Ukur durasi perjalanan saat mengetahui waktu berangkat dan tiba dari perjalanan Anda.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Masukkan Waktu Mulai",
    step_1_desc: "Klik kolom Waktu Mulai dan ketik atau pilih waktunya.",
    step_2_title: "Masukkan Waktu Akhir",
    step_2_desc: "Klik kolom Waktu Akhir dan pilih waktu kedua. Hasilnya langsung muncul.",
    step_3_title: "Baca Hasilnya",
    step_3_desc: "Panel atas menampilkan selisih dalam jam dan menit. Di bawahnya Anda melihat total setara dalam menit.",
    ex_title: "Contoh Umum",
    ex1: "Hari kerja: dari pukul 09:00 hingga 17:30 — 8 jam dan 30 menit, atau 510 menit total.",
    ex2: "Olahraga: dari pukul 06:15 hingga 07:00 — 45 menit.",
    ex3: "Sesi belajar: dari pukul 14:00 hingga 16:45 — 2 jam dan 45 menit.",
    ex4: "Shift malam: dari pukul 22:00 hingga 06:00 — 8 jam.",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Apa perbedaan dengan Kalkulator Selisih Tanggal dan Waktu?",
    faq1a: "Alat ini hanya bekerja dengan waktu, tanpa tanggal. Kalkulator lainnya menerima tanggal dan waktu, memungkinkan kalkulasi interval yang mencakup beberapa hari.",
    faq2q: "Apa yang terjadi jika saya memasukkan waktu akhir sebelum waktu mulai?",
    faq2a: "Alat ini menghitung selisih absolut secara otomatis. Anda selalu mendapatkan hasil positif.",
    faq3q: "Bisakah saya menghitung shift malam yang melewati tengah malam?",
    faq3a: "Ya. Karena menghitung selisih absolut, urutan tidak penting. Masukkan 22:00 dan 06:00 dan Anda akan mendapatkan 8 jam.",
    see1: "Generator Tanggal Lahir",
    see2: "Kalkulator Selisih Tanggal dan Waktu",
    see3: "Kalkulator Tanggal Masa Depan",
    see4: "Kalkulator Tanggal Masa Lalu"
  },
  de: {
    title: "Stunden-Differenz-Rechner",
    pageTitle: "Stunden-Differenz-Rechner — Zeit zwischen zwei Uhrzeiten berechnen | Kostenlos",
    meta: "Berechnen Sie den genauen Unterschied zwischen zwei Uhrzeiten in Stunden und Minuten sowie die gesamte verstrichene Zeit in Minuten. Kostenlos, keine Registrierung erforderlich.",
    param1: "Startzeit",
    param2: "Endzeit",
    diff: "Differenz",
    or: "Oder äquivalent…",
    hours_label: "Stunden",
    minutes_label: "Minuten",
    total_minutes_label: "Gesamtminuten",
    eq: "Bitte geben Sie zwei verschiedene Uhrzeiten ein, um die Differenz zu berechnen",
    features_title: "Funktionen",
    f_1: "Genaue Aufschlüsselung in Stunden und Minuten",
    f_2: "Gesamte verstrichene Zeit in Minuten",
    f_3: "Automatische Korrektur der Reihenfolge",
    f_4: "Funktioniert mit beliebigen zwei Uhrzeiten des Tages",
    how_desc: "Geben Sie eine Startzeit und eine Endzeit ein. Der Rechner zeigt sofort die genaue Differenz in Stunden und Minuten sowie die insgesamt entsprechende Zeit in Minuten an. Ideal für Arbeitszeiten, Lerneinheiten, Workouts und jede andere zeitlich erfasste Aktivität.",
    use_cases_title: "Hauptanwendungen",
    use_1_t: "Arbeit & Studium",
    use_1_d: "Berechnen Sie, wie lange Sie an einer bestimmten Aufgabe oder Lerneinheit gearbeitet haben, um Ihre Produktivität zu optimieren.",
    use_2_t: "Workouts",
    use_2_d: "Verfolgen Sie die Dauer Ihrer Trainingseinheiten und Cardio-Aktivitäten präzise.",
    use_3_t: "Termine & Veranstaltungen",
    use_3_d: "Organisieren Sie Ihren Tag, indem Sie Intervalle zwischen Aktivitäten und Terminen berechnen.",
    use_4_t: "Schicht-Erfassung",
    use_4_d: "Finden Sie schnell heraus, wie viele Stunden und Minuten eine Arbeitsschicht gedauert hat, für die Lohnabrechnung oder private Aufzeichnungen.",
    use_5_t: "Abrechnung & Rechnungsstellung",
    use_5_d: "Berechnen Sie abrechenbare Stunden zwischen Start und Ende eines Auftrags für Kunden und Freelancer-Projekte.",
    use_6_t: "Reisen",
    use_6_d: "Messen Sie die Dauer von Reisen, wenn Sie die Abfahrts- und Ankunftszeiten kennen.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Startzeit eingeben",
    step_1_desc: "Klicken Sie auf das Feld für die Startzeit und geben Sie die Anfangszeit ein oder wählen Sie sie aus.",
    step_2_title: "Endzeit eingeben",
    step_2_desc: "Klicken Sie auf das Feld für die Endzeit und geben Sie die Endzeit ein oder wählen Sie sie aus. Die Ergebnisse erscheinen sofort.",
    step_3_title: "Ergebnisse ablesen",
    step_3_desc: "Die Aufschlüsselung zeigt die Differenz in Stunden und Minuten. Darunter sehen Sie den gesamten entsprechenden Wert in Minuten.",
    ex_title: "Häufige Beispiele",
    ex1: "Arbeitsschicht: von 09:00 bis 17:30 — 8 Stunden und 30 Minuten, also 510 Gesamtminuten.",
    ex2: "Training: von 06:15 bis 07:00 — 45 Minuten.",
    ex3: "Lernblock: von 14:00 bis 16:45 — 2 Stunden und 45 Minuten, also 165 Gesamtminuten.",
    ex4: "Nachtschicht: von 22:00 bis 06:00 — 8 Stunden.",
    faq_title: "Fragen und Antworten",
    faq1q: "Was ist der Unterschied zwischen diesem Tool und dem Datums- und Zeit-Differenzrechner?",
    faq1a: "Dieses Tool arbeitet nur mit Uhrzeiten (ohne Datum). Der Datums- und Zeit-Differenzrechner akzeptiert sowohl Datum als auch Uhrzeit und ermöglicht so die Berechnung von Intervallen über mehrere Tage.",
    faq2q: "Was passiert, wenn ich die Endzeit vor der Startzeit eingebe?",
    faq2a: "Das Tool berechnet automatisch die absolute Differenz, daher ist die Reihenfolge egal. Sie erhalten immer ein positives Ergebnis.",
    faq3q: "Kann ich Nachtschichten berechnen, die über Mitternacht hinausgehen?",
    faq3a: "Ja. Da das Tool die absolute Differenz zwischen zwei Uhrzeiten berechnet, funktioniert es unabhängig von der Reihenfolge korrekt — geben Sie 22:00 und 06:00 ein, und Sie erhalten 8 Stunden.",
    see1: "Geburtstagsrechner",
    see2: "Datum- und Zeit-Differenzrechner",
    see3: "Zukunftsrechner",
    see4: "Vergangenheitsrechner"
  },
  nl: {
    title: "Tijdsverschilcalculator",
    pageTitle: "Tijdsverschilcalculator — Bereken de tijd tussen twee tijden | Gratis",
    meta: "Bereken het exacte verschil tussen twee tijden in uren en minuten, plus de totale verstreken tijd in minuten. Gratis, zonder registratie.",
    param1: "Begintijd",
    param2: "Eindtijd",
    diff: "Verschil",
    or: "Of equivalent…",
    hours_label: "Uren",
    minutes_label: "Minuten",
    total_minutes_label: "Totaal aantal minuten",
    eq: "Voer twee verschillende tijden in om het verschil te berekenen",
    features_title: "Kenmerken",
    f_1: "Exacte uitsplitsing in uren en minuten",
    f_2: "Totale verstreken tijd in minuten",
    f_3: "Automatische correctie van de volgorde",
    f_4: "Werkt met elk tweetal tijden op de dag",
    how_desc: "Voer een begintijd en een eindtijd in. De calculator toont direct het exacte verschil in uren en minuten, plus het totale equivalent in minuten. Ideaal voor het bijhouden van werkdiensten, studiesessies, workouts en andere tijdgebonden activiteiten.",
    use_cases_title: "Belangrijkste toepassingen",
    use_1_t: "Werk & Studie",
    use_1_d: "Bereken hoe lang u aan een specifieke taak of studiesessie hebt besteed om uw productiviteit te optimaliseren.",
    use_2_t: "Work-outs",
    use_2_d: "Houd de duur van uw trainingssessies en cardio-activiteiten nauwkeurig bij.",
    use_3_t: "Evenementen & Afspraken",
    use_3_d: "Organiseer uw dag door intervallen tussen activiteiten en afspraaktijden te berekenen.",
    use_4_t: "Dienstregistratie",
    use_4_d: "Kom snel te weten hoeveel uren en minuten een werkdienst duurde, voor salarisadministratie of persoonlijke notities.",
    use_5_t: "Facturatie & Declaratie",
    use_5_d: "Bereken factureerbare uren tussen begin en einde van een dienst voor klanten en freelanceprojecten.",
    use_6_t: "Reizen",
    use_6_d: "Meet de duur van reizen wanneer u de vertrek- en aankomsttijden kent.",
    how_to_use_title: "Hoe u deze tool gebruikt",
    step_1_title: "Voer de begintijd in",
    step_1_desc: "Klik op het veld Begintijd en typ of selecteer de begintijd.",
    step_2_title: "Voer de eindtijd in",
    step_2_desc: "Klik op het veld Eindtijd en typ of selecteer de eindtijd. De resultaten verschijnen direct.",
    step_3_title: "Lees de resultaten",
    step_3_desc: "De uitsplitsing toont het verschil in uren en minuten. Daaronder ziet u het totale equivalent in minuten.",
    ex_title: "Veelvoorkomende voorbeelden",
    ex1: "Werkdienst: van 09:00 tot 17:30 — 8 uur en 30 minuten, of 510 minuten in totaal.",
    ex2: "Work-out: van 06:15 tot 07:00 — 45 minuten.",
    ex3: "Studieblok: van 14:00 tot 16:45 — 2 uur en 45 minuten, of 165 minuten in totaal.",
    ex4: "Nachtdienst: van 22:00 tot 06:00 — 8 uur.",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Wat is het verschil tussen deze tool en de calculator voor datum- en tijdsverschil?",
    faq1a: "Deze tool werkt alleen met tijden (zonder datum). De calculator voor datum- en tijdsverschil accepteert zowel datum als tijd, zodat u intervallen over meerdere dagen kunt berekenen.",
    faq2q: "Wat gebeurt er als ik de eindtijd vóór de begintijd invoer?",
    faq2a: "De tool berekent automatisch het absolute verschil, dus de volgorde maakt niet uit. U krijgt altijd een positief resultaat.",
    faq3q: "Kan ik nachtdiensten berekenen die over middernacht heen lopen?",
    faq3a: "Ja. Omdat de tool het absolute verschil tussen twee tijden berekent, werkt hij correct ongeacht de volgorde — voer 22:00 en 06:00 in en u krijgt 8 uur.",
    see1: "Geboortedatum-generator",
    see2: "Tijdsverschilcalculator (datum & tijd)",
    see3: "Toekomstige datum-calculator",
    see4: "Verleden datum-calculator"
  }
}
</i18n>
