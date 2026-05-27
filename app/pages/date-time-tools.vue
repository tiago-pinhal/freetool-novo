<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta')
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }],
})

defineI18nRoute({
  paths: {
    en: '/date-time-tools',
    pt: '/ferramentas-para-datas-e-horas',
    es: '/herramientas-para-fechas-y-horas',
    fr: '/outils-pour-dates-et-heures',
    it: '/strumenti-per-date-e-ore',
    id: '/alat-tanggal-dan-waktu',
    de: '/werkzeuge-fuer-datum-und-uhrzeit',
    nl: '/datum-en-tijd-tools',
    ru: '/instrumenty-dlya-dat-i-vremeni'
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content mx-auto">
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
        :index="7"
      />
      <ToolCard :title="t('time')" 
        :to="localePath('time-converter')" 
        icon="mdi:arrow-left-right"
        :index="8"
      />
    </div>

    <!-- Developers Section -->
    <div class="mt-16 mb-8 flex items-center gap-4">
      <h3 class="text-sm font-bold text-base-content/50 uppercase tracking-widest">{{ t('devs') }}</h3>
      <div class="h-px flex-1 bg-base-content/10" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <ToolCard :title="t('cron')" 
        :to="localePath('crontab-generator')" 
        icon="mdi:asterisk"
        :index="9"
      />
      <ToolCard :title="t('unix')" 
        :to="localePath('unix-timestamp-converter')" 
        icon="mdi:clock-fast"
        :index="10"
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
        devs: "For Developers"
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
        devs: "Para Desenvolvedores"
    },
    es: {
        title: "Herramientas para Fechas y Horas",
        meta: "Herramientas de fecha y hora online gratis: calcular diferencias, generar fechas, calculadora de edad, generador de crontab y más. ¡Simplifica cálculos de tiempo!",
        desc: "Con estas herramientas, puedes calcular diferencias entre fechas y horas, generar fechas aleatorias, calcular edades y crear expresiones cron con facilidad. Instantáneo, preciso y sin necesidad de instalación.",
        dt: "Diferencia entre Fechas",
        times: "Diferencia entre Horas",
        diff: "Diferencia entre Fechas y Horas",
        birth: "Fecha de Nacimiento",
        age: "Calculadora de Edad",
        hour: "Calculadora de Horas y Minutos",
        cron: "Generador de Crontab",
        future: "Calculadora de Fecha Futura",
        past: "Calculadora de Fecha Pasada",
        time: "Convertidor de Tiempo",
        unix: "Convertidor de Timestamp Unix",
        devs: "Para Desarrolladores"
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
        devs: "Pour les Développeurs"
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
        devs: "Per Sviluppatori"
    },
    id: {
        title: "Alat Tanggal dan Waktu",
        meta: "Alat tanggal dan waktu online gratis: hitung perbedaan, buat tanggal, kalkulator usia, generator crontab, dan lainnya. Sederhanakan perhitungan waktu!",
        desc: "Dengan alat-alat ini, Anda dapat menghitung perbedaan tanggal dan waktu, membuat tanggal acak, menghitung usia, dan membuat ekspresi cron dengan mudah. Instan, akurat, dan tidak diperlukan instalasi.",
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
        devs: "Untuk Developer"
    },
    de: {
        title: "Werkzeuge für Datum und Uhrzeit",
        meta: "Kostenlose Online-Tools für Datum und Uhrzeit: Unterschiede berechnen, Daten generieren, Altersrechner, Crontab-Generator und mehr. Zeitberechnungen einfach gemacht!",
        desc: "Mit diesen Tools kannst du Datums- und Zeitunterschiede berechnen, zufällige Daten erzeugen, Alter berechnen und Cron-Ausdrücke ganz einfach erstellen. Sofort, genau und ohne Installation.",
        dt: "Datumsdifferenz",
        times: "Zeitdifferenz",
        diff: "Datums- und Zeitdifferenz",
        birth: "Geburtsdatum-Generator",
        age: "Altersrechner",
        hour: "Stunden-und-Minuten-Rechner",
        cron: "Crontab-Generator",
        future: "Rechner für zukünftiges Datum",
        past: "Rechner für vergangenes Datum",
        time: "Zeit-Umrechner",
        unix: "Unix-Zeitstempel-Umrechner",
        devs: "Für Entwickler"
    },
    nl: {
        title: "Datum- en tijdtools",
        meta: "Gratis online datum- en tijdtools: bereken verschillen, genereer datums, leeftijdscalculator, crontab-generator en meer. Vereenvoudig tijdberekeningen!",
        desc: "Met deze tools kun je met gemak verschillen tussen datums en tijden berekenen, willekeurige datums genereren, leeftijden berekenen en cron-expressies maken. Direct, nauwkeurig en geen installatie vereist.",
        dt: "Datumverschil",
        times: "Tijdverschil",
        diff: "Datum- en tijdverschil",
        birth: "Geboortedatumgenerator",
        age: "Leeftijdscalculator",
        hour: "Uren- en minutencalculator",
        cron: "Crontab-generator",
        future: "Toekomstige datumcalculator",
        past: "Verleden datumcalculator",
        time: "Tijdconverter",
        unix: "Unix timestamp-converter",
        devs: "Voor ontwikkelaars"
    },
    ru: {
        title: "Инструменты для дат и времени",
        meta: "Бесплатные онлайн-инструменты для работы с датами и временем: расчет разницы, генерация дат, калькулятор возраста, генератор crontab и многое другое. Упростите расчеты времени!",
        desc: "С помощью этих инструментов вы сможете легко рассчитывать разницу между датами и временем, генерировать случайные даты, рассчитывать возраст и создавать cron-выражения. Быстро, точно и без необходимости установки.",
        dt: "Разница между датами",
        times: "Разница во времени",
        diff: "Разница между датами и временем",
        birth: "Генератор дат рождения",
        age: "Калькулятор возраста",
        hour: "Калькулятор часов и минут",
        cron: "Генератор Crontab",
        future: "Калькулятор будущей даты",
        past: "Калькулятор прошедшей даты",
        time: "Конвертер времени",
        unix: "Конвертер Unix timestamp",
        devs: "Для разработчиков"
    }
}
</i18n>
