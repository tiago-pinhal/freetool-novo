<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta'),
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') },
  ],
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }],
})

defineI18nRoute({
    paths: {
        pt: '/ferramentas-para-datas-e-horas',
        es: '/herramientas-para-fechas-y-horas',
        fr: '/outils-pour-dates-et-heures',
        it: '/strumenti-per-date-e-ore',
        id: '/alat-tanggal-dan-waktu'
    }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content/70 mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <ToolCard :title="t('dt')" 
        :to="localePath('date-difference')" 
        icon="mdi:calendar-range"
        :index="0"
      />
      <ToolCard :title="t('times')" 
        :to="localePath('time-difference')" 
        icon="mdi:clock-outline"
        :index="1"
      />
      <ToolCard :title="t('diff')" 
        :to="localePath('date-time-difference')" 
        icon="mdi:calendar-clock"
        :index="2"
      />
      <ToolCard :title="t('birth')" 
        :to="localePath('birthday-generator')" 
        icon="mdi:calendar-account"
        :index="3"
      />
      <ToolCard :title="t('age')" 
        :to="localePath('age-calculator')" 
        icon="mdi:calculator"
        :index="4"
      />
      <ToolCard :title="t('hour')" 
        :to="localePath('hours-and-minutes-calculator')" 
        icon="mdi:alarm-plus"
        :index="5"
      />
      <ToolCard :title="t('future')" 
        :to="localePath('future-date-calculator')" 
        icon="mdi:calendar-plus"
        :index="6"
      />
      <ToolCard :title="t('past')" 
        :to="localePath('past-date-calculator')" 
        icon="mdi:calendar-minus"
        :index="0"
      />
      <ToolCard :title="t('time')" 
        :to="localePath('time-converter')" 
        icon="mdi:arrow-left-right"
        :index="1"
      />
    </div>

    <!-- Developers Section -->
    <div class="mt-16 mb-8 flex items-center gap-4">
      <h2 class="text-xl font-bold text-base-content/50 uppercase tracking-widest">{{ t('devs') }}</h2>
      <div class="h-px flex-1 bg-base-content/10"></div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <ToolCard :title="t('cron')" 
        :to="localePath('crontab-generator')" 
        icon="mdi:asterisk"
        :index="2"
      />
      <ToolCard :title="t('unix')" 
        :to="localePath('unix-timestamp-converter')" 
        icon="mdi:clock-fast"
        :index="3"
      />
    </div>

    <div class="mt-16 bg-base-200/50 rounded-3xl p-8 border border-base-content/5 text-center">
      <Adsense />
    </div>
  </div>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Dates and Times Tools",
        meta: "Free online date and time tools: calculate differences, generate dates, age calculator, crontab generator and more. Simplify time calculations!",
        desc: "With these tools, you can calculate date and time differences, generate random dates, calculate ages and create cron expressions with ease. Instant, accurate and no installation required.",
        dt: "Date Difference",
        times: "Time Difference",
        diff: "Date Time Difference",
        birth: "Birthday Generator",
        age: "Age Calculator",
        hour: "Hours and Minutes Calculator",
        cron: "Crontab Generator",
        future: "Future Date Calculator",
        past: "Past Date Calculator",
        time: "Time Converter",
        unix: "Unix Timestamp Converter",
        devs: "Developers"
    },
    pt: {
        title: "Ferramentas para Datas e Horas",
        meta: "Ferramentas de data e hora online grátis: calcular diferenças, gerar datas, calculadora de idade, gerador de crontab e mais. Simplifique cálculos de tempo!",
        desc: "Com essas ferramentas, você pode calcular diferenças entre datas e horas, gerar datas aleatórias, calcular idades e criar expressões cron com facilidade. Instantâneo, preciso e sem necessidade de instalação.",
        dt: "Diferença entre Datas",
        times: "Diferença entre Horas",
        diff: "Diferença entre Datas e Horas",
        birth: "Data de Nascimento",
        age: "Calculadora de Idade",
        hour: "Calculadora de Horas e Minutos",
        cron: "Gerador de Crontab",
        future: "Calculadora de Data Futura",
        past: "Calculadora de Data Passada",
        time: "Conversor de Tempo",
        unix: "Conversor de Timestamp Unix",
        devs: "Desenvolvedores"
    },
    es: {
        title: "Herramientas para Fechas y Horas",
        meta: "Herramientas de fecha y hora online gratis: calcular diferencias, generar fechas, calculadora de edad, generador de crontab y más. ¡Simplifica cálculos de tiempo!",
        desc: "Con estas herramientas, puedes calcular diferencias entre fechas y horas, generar fechas aleatorias, calcular edades y crear expresiones cron con facilidad. Instantáneo, preciso y sin necesidad de instalación.",
        dt: "Diferencia entre Fechas",
        times: "Diferencia entre Horas",
        diff: "Diferencia entre Fechas Y Horas",
        birth: "Fecha de Nacimiento",
        age: "Calculadora de Edad",
        hour: "Calculadora de Horas e Minutos",
        cron: "Generador de Crontab",
        future: "Calculadora de Fecha Futura",
        past: "Calculadora de Data Passada",
        time: "Convertidor de Tiempo",
        unix: "Convertidor de Timestamp Unix",
        devs: "Desarrolladores"
    },
    fr: {
        title: "Outils pour Dates et Heures",
        meta: "Outils de date et heure en ligne gratuits: calculer les différences, générer des dates, calculateur d'âge, générateur de crontab et plus. Simplifiez les calculs de temps!",
        desc: "Avec ces outils, vous pouvez calculer les différences entre dates et heures, générer des dates aléatoires, calculer les âges et créer des expressions cron facilement. Instantané, précis et sans installation nécessaire.",
        dt: "Différence entre Dates",
        times: "Différence entre Heures",
        diff: "Différence entre Dates et Heures",
        birth: "Date de Naissance",
        age: "Calculateur d'Âge",
        hour: "Calculatrice d'Heures et de Minutes",
        cron: "Générateur de Crontab",
        future: "Calculatrice de Date Future",
        past: "Calculatrice de Date Passée",
        time: "Convertisseur de Temps",
        unix: "Convertisseur de Timestamp Unix",
        devs: "Développeurs"
    },
    it: {
        title: "Strumenti per Date e Ore",
        meta: "Strumenti di data e ora online gratuiti: calcolare differenze, generare date, calcolatrice dell'età, generatore di crontab e altro. Semplifica i calcoli temporali!",
        desc: "Con questi strumenti, puoi calcolare le differenze tra date e ore, generare date casuali, calcolare età e creare espressioni cron con facilità. Istantaneo, preciso e senza necessità di installazione.",
        dt: "Differenza tra Date",
        times: "Differenza tra Ore",
        diff: "Differenza tra Date e Ore",
        birth: "Data di Nascita",
        age: "Calcolatrice dell'Età",
        hour: "Calcolatrice di Ore e Minuti",
        cron: "Generatore di Crontab",
        future: "Calcolatrice di Data Futura",
        past: "Calcolatrice di Data Passata",
        time: "Convertitore di Tempo",
        unix: "Convertitore di Timestamp Unix",
        devs: "Sviluppatori"
    },
    id: {
        title: "Alat Tanggal dan Waktu",
        meta: "Alat tanggal dan waktu online gratis: hitung perbedaan, buat tanggal, kalkulator usia, generator crontab, dan lainnya. Sederhanakan perhitungan waktu!",
        desc: "Dengan alat-alat ini, Anda dapat menghitung perbedaan tanggal dan waktu, membuat tanggal acak, menghitung usia, dan membuat ekspresi cron dengan mudah. Instan, akurat, dan tanpa perlu instalasi.",
        dt: "Selisih Tanggal",
        times: "Selisih Waktu",
        diff: "Selisih Tanggal dan Waktu",
        birth: "Generator Tanggal Lahir",
        age: "Kalkulator Usia",
        hour: "Kalkulator Jam dan Menit",
        cron: "Generator Crontab",
        future: "Kalkulator Tanggal Masa Depan",
        past: "Kalkulator Tanggal Masa Lalu",
        time: "Konverter Waktu",
        unix: "Konverter Timestamp Unix",
        devs: "Pengembang"
    }
}
</i18n>
