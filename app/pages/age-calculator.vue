<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/moment@2.30.1/moment.min.js', { trigger: 'client' })

const { t } = useI18n({ useScope: 'local' })

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
    { question: t('faq_3_q'), answer: t('faq_3_a') }
  ],
  howToName: t('how_it_works_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
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
    de: '/alter-rechner'
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
  en: {
    pageTitle: "Age Calculator - How Old Am I?",
    title: "Age Calculator",
    meta: "Free online age calculator. Enter your date of birth and instantly discover your exact age in years, months, weeks, and days.",
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
    faq_title: "Frequently Asked Questions",
    faq_1_q: "How is the age calculated?",
    faq_1_a: "We calculate the exact difference between your birth date and today, decomposed into years, months, weeks, and days.",
    faq_2_q: "Is this calculator accurate?",
    faq_2_a: "Yes. It uses precise date arithmetic that accounts for leap years and varying month lengths.",
    faq_3_q: "What does 'or...' mean in the results?",
    faq_3_a: "It shows alternative ways to express your age, for example your total age expressed entirely in months or entirely in weeks.",
    see1: "Birthday Generator",
    see2: "Date Difference",
    see3: "Future Date Calculator",
    see4: "Past Date Calculator"
  },
  pt: {
    pageTitle: "Calculadora de Idade - Quantos Anos Eu Tenho?",
    title: "Calculadora de Idade",
    meta: "Calculadora de idade online grátis. Descubra sua idade exata em anos, meses, semanas e dias a partir da sua data de nascimento.",
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
    faq_title: "Perguntas Frequentes",
    faq_1_q: "Como a idade é calculada?",
    faq_1_a: "Calculamos a diferença exata entre sua data de nascimento e hoje, decomposta em anos, meses, semanas e dias.",
    faq_2_q: "A calculadora é precisa?",
    faq_2_a: "Sim. Utiliza aritmética de datas precisa, considerando anos bissextos e a variação no número de dias dos meses.",
    faq_3_q: "O que significa 'ou...' nos resultados?",
    faq_3_a: "Exibe formas alternativas de expressar sua idade, por exemplo, sua idade total expressa apenas em meses ou apenas em semanas.",
    see1: "Data de Nascimento",
    see2: "Diferença entre Datas",
    see3: "Calculadora de Data Futura",
    see4: "Calculadora de Data Passada"
  },
  es: {
    pageTitle: "Calculadora de Edad - ¿Cuántos Años Tengo?",
    title: "Calculadora de Edad",
    meta: "Calculadora de edad online gratuita. Descubre tu edad exacta en años, meses, semanas y días desde tu fecha de nacimiento.",
    dt: "Fecha de nacimiento",
    age: "Tu edad",
    or: "o",
    err: "Ingresa una fecha anterior a hoy",
    placeholder: "Ingresa tu fecha de nacimiento",
    years: "año|años",
    months: "mes|meses",
    weeks: "semana|semanas",
    days: "día|días",
    years_label: "Años",
    months_label: "Meses",
    weeks_label: "Semanas",
    days_label: "Días",
    total_months_label: "Total en Meses",
    total_weeks_label: "Total en Semanas",
    total_days_label: "Total en Días",
    week_day: "Día de la semana",
    day_0: "Domingo",
    day_1: "Lunes",
    day_2: "Martes",
    day_3: "Miércoles",
    day_4: "Jueves",
    day_5: "Viernes",
    day_6: "Sábado",
    desc: "Esta calculadora de edad gratuita calcula con precisión cuánto tiempo de vida tienes con base en tu fecha de nacimiento. El resultado va más allá de un simple número de años: se presenta de forma completa, con la edad descompuesta en años, meses, semanas y días, y también en unidades totales, como cuántos meses o cuántos días has vivido.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Conoce Tu Edad Exacta",
    uc_1_desc: "Descubre exactamente cuántos años, meses, semanas y días tienes.",
    uc_2_title: "Calcular la Edad de Cualquier Persona",
    uc_2_desc: "Ingresa cualquier fecha de nacimiento para conocer la edad exacta de un hijo, padre, paciente o cliente.",
    uc_3_title: "Documentos Oficiales",
    uc_3_desc: "Verifica rápidamente tu edad para formularios, contratos o servicios con restricción de edad.",
    uc_4_title: "Salud y Bienestar",
    uc_4_desc: "Sigue los hitos relacionados con la edad y los indicadores de salud con precisión.",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Introduce la Fecha de Nacimiento",
    step_1_desc: "Selecciona tu fecha de nacimiento usando el campo de fecha.",
    step_2_title: "Cálculo Instantáneo",
    step_2_desc: "Tu edad se calcula automáticamente en cuanto seleccionas una fecha.",
    step_3_title: "Ver Resultados",
    step_3_desc: "Visualiza tu edad en años, meses, semanas y días, más representaciones alternativas.",
    faq_title: "Preguntas Frecuentes",
    faq_1_q: "¿Cómo se calcula la edad?",
    faq_1_a: "Calculamos la diferencia exacta entre tu fecha de nacimiento y hoy, descompuesta en años, meses, semanas y días.",
    faq_2_q: "¿Es precisa la calculadora?",
    faq_2_a: "Sí. Utiliza aritmética de fechas precisa que tiene en cuenta los años bisiestos y los meses con diferente número de días.",
    faq_3_q: "¿Qué significa 'o...' en los resultados?",
    faq_3_a: "Muestra formas alternativas de expresar tu edad, por ejemplo tu edad total expresada solo en meses o solo en semanas.",
    see1: "Fecha de Nacimiento",
    see2: "Diferencia entre Fechas",
    see3: "Calculadora de Fecha Futura",
    see4: "Calculadora de Fecha Pasada"
  },
  fr: {
    pageTitle: "Calculateur d'Âge - Quel Âge Ai-Je ?",
    title: "Calculateur d'Âge",
    meta: "Calculateur d'âge en ligne gratuit. Entrez votre date de naissance et découvrez instantanément votre âge exact en années, mois, semaines et jours.",
    dt: "Date de naissance",
    age: "Votre âge",
    or: "ou",
    err: "Veuillez entrer une date antérieure à aujourd'hui",
    placeholder: "Entrez votre date de naissance",
    years: "an|ans",
    months: "mois|mois",
    weeks: "semaine|semaines",
    days: "jour|jours",
    years_label: "Années",
    months_label: "Mois",
    weeks_label: "Semaines",
    days_label: "Jours",
    total_months_label: "Total en Mois",
    total_weeks_label: "Total en Semaines",
    total_days_label: "Total en Jours",
    week_day: "Jour de la semaine",
    day_0: "Dimanche",
    day_1: "Lundi",
    day_2: "Mardi",
    day_3: "Mercredi",
    day_4: "Jeudi",
    day_5: "Vendredi",
    day_6: "Samedi",
    desc: "Cette calculatrice d'âge gratuite calcule avec précision le temps de vie que vous avez vécu en fonction de votre date de naissance. Le résultat va bien au-delà d'un simple nombre d'années : il est présenté de manière complète, avec l'âge décomposé en années, mois, semaines et jours, ainsi qu'en unités totales, comme le nombre de mois ou de jours que vous avez vécus.",
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
    faq_title: "Questions Fréquentes",
    faq_1_q: "Comment l'âge est-il calculé ?",
    faq_1_a: "Nous calculons la différence exacte entre votre date de naissance et aujourd'hui, décomposée en années, mois, semaines et jours.",
    faq_2_q: "Ce calculateur est-il précis ?",
    faq_2_a: "Oui. Il utilise une arithmétique de dates précise qui tient compte des années bissextiles et des mois de longueurs variables.",
    faq_3_q: "Que signifie 'ou...' dans les résultats ?",
    faq_3_a: "Cela montre des façons alternatives d'exprimer votre âge, par exemple votre âge total exprimé uniquement en mois ou en semaines.",
    see1: "Date de Naissance",
    see2: "Différence entre Dates",
    see3: "Calculatrice de Date Future",
    see4: "Calculatrice de Date Passée"
  },
  it: {
    pageTitle: "Calcolatrice dell'Età - Quanti Anni Ho?",
    title: "Calcolatrice dell'Età",
    meta: "Calcolatrice dell'età online gratuita. Inserisci la tua data di nascita e scopri istantaneamente la tua età esatta in anni, mesi, settimane e giorni.",
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
    faq_title: "Domande Frequenti",
    faq_1_q: "Come viene calcolata l'età?",
    faq_1_a: "Calcoliamo la differenza esatta tra la tua data di nascita e oggi, scomposta in anni, mesi, settimane e giorni.",
    faq_2_q: "Questa calcolatrice è accurata?",
    faq_2_a: "Sì. Utilizza un'aritmetica delle date precisa che tiene conto degli anni bisestili e dei mesi di lunghezza variabile.",
    faq_3_q: "Cosa significa 'o...' nei risultati?",
    faq_3_a: "Mostra modi alternativi per esprimere la tua età, ad esempio la tua età totale espressa solo in mesi o solo in settimane.",
    see1: "Data di Nascita",
    see2: "Differenza tra Date",
    see3: "Calcolatrice di Data Futura",
    see4: "Calcolatrice di Data Passata"
  },
  id: {
    pageTitle: "Kalkulator Usia - Berapa Umur Saya?",
    title: "Kalkulator Usia",
    meta: "Kalkulator usia online gratis. Masukkan tanggal lahir Anda dan temukan usia tepat Anda dalam tahun, bulan, minggu, dan hari secara instan.",
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
    week_day: "Hari dalam seminggu",
    day_0: "Minggu",
    day_1: "Senin",
    day_2: "Selasa",
    day_3: "Rabu",
    day_4: "Kamis",
    day_5: "Jumat",
    day_6: "Sabtu",
    desc: "Kalkulator usia gratis ini menghitung dengan tepat berapa lama Anda telah hidup berdasarkan tanggal lahir Anda. Hasilnya lebih dari sekadar angka tahun: disajikan secara lengkap, dengan usia yang diuraikan dalam tahun, bulan, minggu, dan hari, serta dalam unit total, seperti berapa bulan atau berapa hari yang telah Anda jalani.",
    use_cases_title: "Kasus Penggunaan",
    uc_1_title: "Ketahui Usia Tepat Anda",
    uc_1_desc: "Temukan dengan tepat berapa tahun, bulan, minggu, dan hari usia Anda.",
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
    faq_title: "Pertanyaan Umum",
    faq_1_q: "Bagaimana usia dihitung?",
    faq_1_a: "Kami menghitung perbedaan tepat antara tanggal lahir Anda dan hari ini, diuraikan dalam tahun, bulan, minggu, dan hari.",
    faq_2_q: "Apakah kalkulator ini akurat?",
    faq_2_a: "Ya. Menggunakan aritmatika tanggal yang tepat dengan memperhitungkan tahun kabisat dan panjang bulan yang berbeda.",
    faq_3_q: "Apa arti 'atau...' di hasil?",
    faq_3_a: "Menampilkan cara alternatif untuk mengungkapkan usia Anda, misalnya total usia yang dinyatakan dalam bulan atau minggu saja.",
    see1: "Generator Ulang Tahun",
    see2: "Selisih Tanggal",
    see3: "Kalkulator Tanggal Masa Depan",
    see4: "Kalkulator Tanggal Masa Lalu"
  },
  de: {
    pageTitle: "Alter Rechner - Wie alt bin ich?",
    title: "Alter Rechner",
    meta: "Kostenloser Online-Altersrechner. Geben Sie Ihr Geburtsdatum ein und erfahren Sie sofort Ihr exaktes Alter in Jahren, Monaten, Wochen und Tagen.",
    dt: "Geburtsdatum",
    age: "Ihr Alter",
    or: "oder",
    err: "Bitte geben Sie ein Datum vor dem heutigen Tag ein",
    placeholder: "Geben Sie Ihr Geburtsdatum ein",
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
    desc: "Dieser kostenlose Altersrechner berechnet präzise, wie lange Sie bereits leben, basierend auf Ihrem Geburtsdatum. Das Ergebnis geht über eine einfache Jahreszahl hinaus: Es wird detailliert dargestellt, wobei Ihr Alter in Jahre, Monate, Wochen und Tage aufgeschlüsselt wird, sowie in Gesamteinheiten, wie viele Monate oder Tage Sie gelebt haben.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Kennen Sie Ihr exaktes Alter",
    uc_1_desc: "Finden Sie präzise heraus, wie alt Sie in Jahren, Monaten, Wochen und Tagen sind.",
    uc_2_title: "Das Alter von jedem berechnen",
    uc_2_desc: "Geben Sie ein beliebiges Geburtsdatum ein, um das genaue Alter eines Kindes, Elternteils, Patienten oder Kunden zu erfahren.",
    uc_3_title: "Offizielle Dokumente",
    uc_3_desc: "Überprüfen Sie schnell Ihr Alter für Formulare, Verträge oder altersbeschränkte Dienste.",
    uc_4_title: "Gesundheit & Fitness",
    uc_4_desc: "Verfolgen Sie altersbedingte Meilensteine und Gesundheits-Benchmarks mit Präzision.",
    how_it_works_title: "So funktioniert es",
    step_1_title: "Geburtsdatum eingeben",
    step_1_desc: "Wählen Sie Ihr Geburtsdatum über das Datumsauswahlfeld aus.",
    step_2_title: "Sofortige Berechnung",
    step_2_desc: "Ihr Alter wird automatisch berechnet, sobald Sie ein Datum auswählen.",
    step_3_title: "Ergebnisse sehen",
    step_3_desc: "Sehen Sie Ihr Alter aufgeschlüsselt in Jahre, Monate, Wochen und Tage sowie alternative Darstellungen.",
    faq_title: "Häufig gestellte Fragen",
    faq_1_q: "Wie wird das Alter berechnet?",
    faq_1_a: "Wir berechnen die exakte Differenz zwischen Ihrem Geburtsdatum und heute, aufgeschlüsselt in Jahre, Monate, Wochen und Tage.",
    faq_2_q: "Ist dieser Rechner genau?",
    faq_2_a: "Ja. Er verwendet eine präzise Datumsarithmetik, die Schaltjahre und unterschiedliche Monatslängen berücksichtigt.",
    faq_3_q: "Was bedeutet 'oder...' in den Ergebnissen?",
    faq_3_a: "Es zeigt alternative Wege, Ihr Alter auszudrücken, zum Beispiel Ihr Gesamtalter vollständig in Monaten oder vollständig in Wochen.",
    see1: "Geburtstagsgenerator",
    see2: "Datumsdifferenz",
    see3: "Zukunftsdatum-Rechner",
    see4: "Vergangenheitsdatum-Rechner"
  }
}
</i18n>
