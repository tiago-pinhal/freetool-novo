<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/convert@4/dist/convert.prod.js', {
  trigger: 'client'
})

const { t, locale } = useI18n({ useScope: 'local' })

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f_1'),
    t('f_2'),
    t('f_3'),
    t('f_4')
  ],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') }
  ]
})

useHead({
  title: t('page_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

const units = ['s', 'ms', 'μs', 'ns', 'min', 'h', 'd', 'wk', 'mo', 'yr', 'dec', 'century', 'millennium']

const state = reactive({
  value: null as number | null,
  from: 'min',
  to: 'h'
})

const unitOptions = computed(() =>
  units.map(u => ({ label: t(u), value: u }))
)

const output = computed(() => {
  if (state.value === null || state.value === undefined || state.value === ('' as any)) return null
  try {
    const convert = (window as any).convert
    if (!convert) return null
    const result = convert.convert(+state.value, state.from).to(state.to)
    return String(Number(result.toFixed(10)))
  } catch {
    return t('err')
  }
})

defineI18nRoute({
  paths: {
    en: '/time-converter',
    pt: '/conversor-de-tempo',
    es: '/convertidor-de-tiempo',
    fr: '/convertisseur-de-temps',
    it: '/convertitore-di-tempo',
    id: '/konverter-waktu',
    de: '/zeit-umrechner',
    nl: '/tijdconverter',
    ru: '/konverter-vremeni'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Unit_of_time`"
    wiki-label="Units of Time"
    :see-also-links="[
      { label: t('see1'), to: 'time-difference' },
      { label: t('see2'), to: 'hours-and-minutes-calculator' },
      { label: t('see3'), to: 'date-time-difference' },
      { label: t('see4'), to: 'crontab-generator' }
    ]"
  >
    <template #info>
      <div class="space-y-8">
        <div>
          <p class="mb-4">{{ t('d1') }}</p>
          <p>{{ t('d2') }}: {{ units.map(u => t(u)).join(', ') }}.</p>
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
            { question: t('faq_2_q'), answer: t('faq_2_a') }
          ]"
        />
      </div>
    </template>

    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="form-control w-full">
          <label for="time-value" class="label">
            <span class="label-text font-bold text-base-content">{{ t('value') }}</span>
          </label>
          <input
            id="time-value"
            v-model.number="state.value"
            type="number"
            class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl"
            autofocus
          />
        </div>

        <ToolSelect
          v-model="state.from"
          :label="t('from')"
          :options="unitOptions"
        />

        <ToolSelect
          v-model="state.to"
          :label="t('to')"
          :options="unitOptions"
        />
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <LineCopy v-if="output" :label="t('result')" :content="output">
          {{ output }}
        </LineCopy>
      </Transition>
    </div>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Time Converter",
    page_title: "Time Converter — Hours to Minutes, Seconds to Minutes, Days, Weeks & More | Free",
    meta: "Free online time converter. Convert hours to minutes, seconds to minutes, minutes to hours, days to weeks and more — between 13 time units, from nanoseconds to millenniums.",
    d1: "With this hours to minutes converter and seconds to minutes calculator, you can convert between any of 13 time units — seconds, minutes, hours, days, weeks, months, years, and much more. To perform the conversion, simply enter the value you wish to convert, choose the current measurement unit, and the unit to which the value will be converted. The tool will instantly display the converted result in the chosen destination measurement unit.",
    d2: "Supported time measurement units",
    s: "Seconds",
    ms: "Milliseconds",
    μs: "Microseconds",
    ns: "Nanoseconds",
    min: "Minutes",
    h: "Hours",
    d: "Days",
    wk: "Weeks",
    mo: "Months",
    yr: "Years",
    dec: "Decades",
    century: "Centuries",
    millennium: "Millenniums",
    value: "Value",
    from: "From",
    to: "To",
    result: "Result",
    err: "Conversion not performed",
    how_it_works_title: "How It Works",
    step_1_title: "Enter Value",
    step_1_desc: "Type the time value you want to convert.",
    step_2_title: "Select Units",
    step_2_desc: "Choose the source and target time units.",
    step_3_title: "Copy Result",
    step_3_desc: "The conversion happens instantly. Use the copy button to send it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "Project Planning",
    uc_1_desc: "Quickly estimate project durations by converting weeks and months into hours or days for precise scheduling.",
    uc_2_title: "Scientific Calculations",
    uc_2_desc: "Convert nanoseconds and microseconds into standard units for technical documentation and experiments.",
    faq_title: "Questions & Answers",
    faq_1_q: "How are months and years handled?",
    faq_1_a: "Because months and years have varying lengths, we use standard average values for conversion. This ensures consistent results for estimations and general planning.",
    faq_2_q: "Which units are supported?",
    faq_2_a: "This tool supports the following 13 units: nanoseconds, microseconds, milliseconds, seconds, minutes, hours, days, weeks, months, years, decades, centuries, and millenniums.",
    see1: "Time Difference",
    see2: "Hours and Minutes Calculator",
    see3: "Date Time Difference",
    see4: "Crontab Generator",
    f_1: "Convert between 13 time units",
    f_2: "Instant real-time conversion",
    f_3: "Supports from nanoseconds to millenniums",
    f_4: "Client-side processing — no data sent to servers"
  },
  pt: {
    title: "Conversor de Tempo",
    page_title: "Conversor de Tempo — Converter Horas em Minutos, Segundos para Minutos, Dias e Mais | Grátis",
    meta: "Conversor de tempo online grátis. Converta horas em minutos, segundos para minutos, minutos para horas, dias em semanas e mais — entre 13 unidades de tempo, de nanossegundos a milênios.",
    d1: "Com este conversor de horas em minutos e de segundos para minutos, você pode converter entre quaisquer das 13 unidades de tempo — segundos, minutos, horas, dias, semanas, meses ou anos, e muito mais. Para realizar a conversão, basta inserir o valor que deseja converter, escolher a unidade de medida atual e a unidade para a qual o valor será convertido. A ferramenta apresentará instantaneamente o resultado na unidade escolhida.",
    d2: "Unidades de medida de tempo suportadas",
    s: "Segundos",
    ms: "Milissegundos",
    μs: "Microssegundos",
    ns: "Nanosegundos",
    min: "Minutos",
    h: "Horas",
    d: "Dias",
    wk: "Semanas",
    mo: "Meses",
    yr: "Anos",
    dec: "Décadas",
    century: "Séculos",
    millennium: "Milênios",
    value: "Valor",
    from: "De",
    to: "Para",
    result: "Resultado",
    err: "Conversão não realizada",
    how_it_works_title: "Como Funciona",
    step_1_title: "Inserir Valor",
    step_1_desc: "Digite o valor de tempo que você deseja converter.",
    step_2_title: "Selecionar Unidades",
    step_2_desc: "Escolha as unidades de tempo de origem e destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "A conversão acontece instantaneamente. Use o botão de copiar para enviar para a área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Planejamento de Projetos",
    uc_1_desc: "Estime durações de projetos rapidamente convertendo semanas e meses em horas ou dias para cronogramas precisos.",
    uc_2_title: "Cálculos Científicos",
    uc_2_desc: "Converta nanossegundos e microssegundos em unidades padrão para documentação técnica e experimentos.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Como meses e anos são tratados?",
    faq_1_a: "Como meses e anos possuem durações variadas, utilizamos valores médios padrão para a conversão. Isso garante resultados consistentes para estimativas e planejamentos gerais.",
    faq_2_q: "Quais unidades são suportadas?",
    faq_2_a: "Esta ferramenta suporta as seguintes 13 unidades: nanossegundos, microssegundos, milissegundos, segundos, minutos, horas, dias, semanas, meses, anos, décadas, séculos e milênios.",
    see1: "Diferença entre Horas",
    see2: "Calculadora de Horas e Minutos",
    see3: "Diferença entre Datas e Horas",
    see4: "Gerador de Crontab",
    f_1: "Converta entre 13 unidades de tempo",
    f_2: "Conversão instantânea em tempo real",
    f_3: "Suporte de nanossegundos a milênios",
    f_4: "Processamento no navegador — nenhum dado enviado a servidores"
  },
  es: {
    title: "Convertidor de Tiempo",
    page_title: "Convertidor de Tiempo — Convertir Horas a Minutos, Segundos a Minutos, Días y Más | Gratis",
    meta: "Convertidor de tiempo online gratis. Convierte horas a minutos, segundos a minutos, minutos a horas, días a semanas y más — entre 13 unidades de tiempo, desde nanosegundos hasta milenios.",
    d1: "Con este convertidor de horas a minutos y de segundos a minutos, puedes convertir entre cualquiera de las 13 unidades de tiempo — segundos, minutos, horas, días, semanas, meses o años, y mucho más. Para realizar la conversión, simplemente inserta el valor que deseas convertir, elige la unidad de medida actual y la unidad a la que se convertirá el valor. La herramienta mostrará instantáneamente el resultado en la unidad elegida.",
    d2: "Unidades de medida de tiempo admitidas",
    s: "Segundos",
    ms: "Milisegundos",
    μs: "Microsegundos",
    ns: "Nanosegundos",
    min: "Minutos",
    h: "Horas",
    d: "Días",
    wk: "Semanas",
    mo: "Meses",
    yr: "Años",
    dec: "Décadas",
    century: "Siglos",
    millennium: "Milenios",
    value: "Valor",
    from: "De",
    to: "A",
    result: "Resultado",
    err: "Conversión no realizada",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Ingresar Valor",
    step_1_desc: "Escribe el valor de tiempo que deseas convertir.",
    step_2_title: "Seleccionar Unidades",
    step_2_desc: "Elige las unidades de tiempo de origen y destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "La conversión es instantánea. Usa el botón de copiar para enviarlo al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Planificación de Proyectos",
    uc_1_desc: "Estima rápidamente la duración de los proyectos convirtiendo semanas y meses en horas o días para cronogramas precisos.",
    uc_2_title: "Cálculos Científicos",
    uc_2_desc: "Convierte nanosegundos y microsegundos en unidades estándar para documentación técnica y experimentos.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cómo se manejan los meses y años?",
    faq_1_a: "Debido a que los meses y años tienen duraciones variables, utilizamos valores promedio estándar para la conversión. Esto garantiza resultados consistentes para estimaciones y planificación general.",
    faq_2_q: "¿Qué unidades son compatibles?",
    faq_2_a: "Esta herramienta admite las siguientes 13 unidades: nanosegundos, microsegundos, milisegundos, segundos, minutos, horas, días, semanas, meses, años, décadas, siglos y milenios.",
    see1: "Diferencia entre Horas",
    see2: "Calculadora de Horas y Minutos",
    see3: "Diferencia entre Fechas y Horas",
    see4: "Generador de Crontab",
    f_1: "Convierte entre 13 unidades de tiempo",
    f_2: "Conversión instantánea en tiempo real",
    f_3: "Compatible desde nanosegundos hasta milenios",
    f_4: "Procesamiento en el navegador — sin envío de datos a servidores"
  },
  fr: {
    title: "Convertisseur de Temps",
    page_title: "Convertisseur de Temps — Convertir Minutes en Heures, Secondes, Jours et Plus | Gratuit",
    meta: "Convertisseur de temps en ligne gratuit. Convertissez les minutes en heures, secondes en minutes, jours en semaines et plus, entre 13 unités de temps — des nanosecondes aux millénaires.",
    d1: "Avec ce convertisseur de temps, vous pourrez, par exemple, convertir des secondes en minutes, des minutes en heures, des heures en jours, des jours en semaines, des mois ou des années, et ainsi de suite. Pour effectuer la conversion, il suffit d'insérer la valeur que vous souhaitez convertir, de choisir l'unité de mesure actuelle et l'unité vers laquelle la valeur sera convertie. L'outil affichera instantanément le résultat converti dans l'unité de mesure de destination choisie.",
    d2: "Unités de mesure de temps prises en charge",
    s: "Secondes",
    ms: "Millisecondes",
    μs: "Microsecondes",
    ns: "Nanosecondes",
    min: "Minutes",
    h: "Heures",
    d: "Jours",
    wk: "Semaines",
    mo: "Mois",
    yr: "Années",
    dec: "Décennies",
    century: "Siècles",
    millennium: "Millénaires",
    value: "Valeur",
    from: "De",
    to: "À",
    result: "Résultat",
    err: "Conversion non effectuée",
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Entrer la Valeur",
    step_1_desc: "Tapez la valeur de temps que vous souhaitez convertir.",
    step_2_title: "Sélectionner les Unités",
    step_2_desc: "Choisissez les unités de temps de départ et d'arrivée.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "La conversion est instantanée. Utilisez le bouton de copie pour l'envoyer au presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Planification de Projet",
    uc_1_desc: "Estimez rapidement la durée des projets en convertissant les semaines et les mois en heures ou en jours pour des plannings précis.",
    uc_2_title: "Calculs Scientifiques",
    uc_2_desc: "Convertissez les nanosecondes et les microsecondes en unités standard pour la documentation technique et les expériences.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Comment les mois et les années sont-ils gérés ?",
    faq_1_a: "Comme les mois et les années ont des durées variables, nous utilisons des valeurs moyennes standard pour la conversion. Cela garantit des résultats cohérents pour les estimations et la planification générale.",
    faq_2_q: "Quelles unités sont prises en charge ?",
    faq_2_a: "Cet outil prend en charge les 13 unités suivantes : nanosecondes, microsecondes, millisecondes, secondes, minutes, heures, jours, semaines, mois, années, décennies, siècles et millénaires.",
    see1: "Différence entre Heures",
    see2: "Calculatrice d'Heures et de Minutes",
    see3: "Différence entre Dates et Heures",
    see4: "Générateur de Crontab",
    f_1: "Convertissez entre 13 unités de temps",
    f_2: "Conversion instantanée en temps réel",
    f_3: "Prend en charge des nanosecondes aux millénaires",
    f_4: "Traitement côté navigateur — aucune donnée envoyée aux serveurs"
  },
  it: {
    title: "Convertitore di Tempo",
    page_title: "Convertitore di Tempo — Convertire Minuti in Ore, Secondi, Giorni e Altro | Gratis",
    meta: "Convertitore di tempo online gratuito. Converti minuti in ore, secondi in minuti, giorni in settimane e altro, tra 13 unità di tempo — dai nanosecondi ai millenni.",
    d1: "Con questo convertitore di tempo, potrai, ad esempio, convertire secondi in minuti, minuti in ore, ore in giorni, giorni in settimane, mesi o anni, e così via. Per effettuare la conversione, basta inserire il valore che si desidera convertire, scegliere l'unità di misura attuale e l'unità in cui il valore sarà convertito. Lo strumento mostrerà istantaneamente il risultato convertito nell'unità di misura di destinazione scelta.",
    d2: "Unità di misura del tempo supportate",
    s: "Secondi",
    ms: "Millisecondi",
    μs: "Microsecondi",
    ns: "Nanosecondi",
    min: "Minuti",
    h: "Ore",
    d: "Giorni",
    wk: "Settimane",
    mo: "Mesi",
    yr: "Anni",
    dec: "Decenni",
    century: "Secoli",
    millennium: "Millenni",
    value: "Valore",
    from: "Da",
    to: "A",
    result: "Risultato",
    err: "Conversione non eseguita",
    how_it_works_title: "Come Funziona",
    step_1_title: "Inserisci Valore",
    step_1_desc: "Digita il valore di tempo che desideri convertire.",
    step_2_title: "Seleziona Unità",
    step_2_desc: "Scegli le unità di tempo di origine e destinazione.",
    step_3_title: "Copia Risultato",
    step_3_desc: "La conversione è istantanea. Usa il pulsante di copia per inviarlo agli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Pianificazione del Progetto",
    uc_1_desc: "Stima rapidamente la durata dei progetti convertendo settimane e mesi in ore o giorni per programmi precisi.",
    uc_2_title: "Calcoli Scientifici",
    uc_2_desc: "Converti nanosecondi e microsecondi in unità standard per documentazione tecnica ed esperimenti.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Come vengono gestiti mesi e anni?",
    faq_1_a: "Poiché mesi e anni hanno lunghezze variabili, utilizziamo valori medi standard per la conversione. Ciò garantisce risultati coerenti per stime e pianificazione generale.",
    faq_2_q: "Quali unità sono supportate?",
    faq_2_a: "Questo strumento supporta le seguenti 13 unità: nanosecondi, microsecondi, millisecondi, secondi, minuti, ore, giorni, settimane, mesi, anni, decenni, secoli e millenni.",
    see1: "Differenza tra Ore",
    see2: "Calcolatrice di Ore e Minuti",
    see3: "Differenza tra Date e Ore",
    see4: "Generatore di Crontab",
    f_1: "Converti tra 13 unità di tempo",
    f_2: "Conversione istantanea in tempo reale",
    f_3: "Supporta dai nanosecondi ai millenni",
    f_4: "Elaborazione nel browser — nessun dato inviato ai server"
  },
  id: {
    title: "Konverter Waktu",
    page_title: "Konverter Waktu — Konversi Menit ke Jam, Detik, Hari, dan Lainnya | Gratis",
    meta: "Konverter waktu online gratis. Konversi menit ke jam, detik ke menit, hari ke minggu, dan lainnya, antara 13 satuan waktu — dari nanodetik hingga milenium.",
    d1: "Dengan konverter waktu ini, Anda dapat, misalnya, mengonversi detik ke menit, menit ke jam, jam ke hari, hari ke minggu, bulan, atau tahun, dan seterusnya. Untuk melakukan konversi, cukup masukkan nilai yang ingin dikonversi, pilih satuan pengukuran saat ini, dan satuan tujuan konversi. Alat ini akan langsung menampilkan hasil konversi dalam satuan tujuan yang dipilih.",
    d2: "Satuan pengukuran waktu yang didukung",
    s: "Detik",
    ms: "Milidetik",
    μs: "Mikrodetik",
    ns: "Nanodetik",
    min: "Menit",
    h: "Jam",
    d: "Hari",
    wk: "Minggu",
    mo: "Bulan",
    yr: "Tahun",
    dec: "Dekade",
    century: "Abad",
    millennium: "Milenium",
    value: "Nilai",
    from: "Dari",
    to: "Ke",
    result: "Hasil",
    err: "Konversi tidak dilakukan",
    how_it_works_title: "Cara Kerja",
    step_1_title: "Masukkan Nilai",
    step_1_desc: "Ketik nilai waktu yang ingin Anda konversi.",
    step_2_title: "Pilih Satuan",
    step_2_desc: "Pilih satuan waktu asal dan tujuan.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Konversi terjadi seketika. Gunakan tombol salin untuk mengirim ke papan klip.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Perencanaan Proyek",
    uc_1_desc: "Perkirakan durasi proyek dengan cepat dengan mengonversi minggu dan bulan menjadi jam atau hari untuk jadwal yang tepat.",
    uc_2_title: "Perhitungan Ilmiah",
    uc_2_desc: "Konversikan nanodetik dan mikrodetik ke satuan standar untuk dokumentasi teknis dan eksperimen.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Bagaimana bulan dan tahun ditangani?",
    faq_1_a: "Karena bulan dan tahun memiliki panjang yang bervariasi, kami menggunakan nilai rata-rata standar untuk konversi. Ini memastikan hasil yang konsisten untuk estimasi dan perencanaan umum.",
    faq_2_q: "Satuan mana yang didukung?",
    faq_2_a: "Alat ini mendukung 13 satuan berikut: nanodetik, mikrodetik, milidetik, detik, menit, jam, hari, minggu, bulan, tahun, dekade, abad, dan milenium.",
    see1: "Selisih Waktu",
    see2: "Kalkulator Jam dan Menit",
    see3: "Selisih Tanggal dan Waktu",
    see4: "Generator Crontab",
    f_1: "Konversi antara 13 satuan waktu",
    f_2: "Konversi instan secara real-time",
    f_3: "Mendukung dari nanodetik hingga milenium",
    f_4: "Pemrosesan di browser — tidak ada data yang dikirim ke server"
  },
  de: {
    title: "Zeit-Umrechner",
    page_title: "Zeit-Umrechner — Minuten in Stunden, Sekunden, Tage und mehr umrechnen | Kostenlos",
    meta: "Kostenloser Online-Zeit-Umrechner. Rechnen Sie Minuten in Stunden, Sekunden in Minuten, Tage in Wochen und mehr zwischen 13 Zeiteinheiten um — von Nanosekunden bis Jahrtausenden.",
    d1: "Mit diesem Zeit-Umrechner kannst du zum Beispiel Sekunden in Minuten, Minuten in Stunden, Stunden in Tage, Tage in Wochen, Monate oder Jahre umrechnen und vieles mehr. Gib einfach den Wert ein, den du umrechnen möchtest, wähle die aktuelle Maßeinheit und dann die Einheit aus, in die der Wert umgerechnet werden soll. Das Tool zeigt das umgerechnete Ergebnis sofort in der gewählten Zieleinheit an.",
    d2: "Unterstützte Zeiteinheiten",
    s: "Sekunden",
    ms: "Millisekunden",
    μs: "Mikrosekunden",
    ns: "Nanosekunden",
    min: "Minuten",
    h: "Stunden",
    d: "Tage",
    wk: "Wochen",
    mo: "Monate",
    yr: "Jahre",
    dec: "Jahrzehnte",
    century: "Jahrhunderte",
    millennium: "Jahrtausende",
    value: "Wert",
    from: "Von",
    to: "Nach",
    result: "Ergebnis",
    err: "Umrechnung nicht durchgeführt",
    how_it_works_title: "So funktioniert es",
    step_1_title: "Wert eingeben",
    step_1_desc: "Gib den Zeitwert ein, den du umrechnen möchtest.",
    step_2_title: "Einheiten auswählen",
    step_2_desc: "Wähle die Quell- und Zieleinheit der Zeit.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Die Umrechnung erfolgt sofort. Nutze den Kopier-Button, um das Ergebnis in die Zwischenablage zu senden.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Projektplanung",
    uc_1_desc: "Schätze Projektdauern schnell ab, indem du Wochen und Monate für eine präzisere Planung in Stunden oder Tage umrechnest.",
    uc_2_title: "Wissenschaftliche Berechnungen",
    uc_2_desc: "Wandle Nanosekunden und Mikrosekunden in Standard-Einheiten für technische Dokumentation und Experimente um.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Wie werden Monate und Jahre behandelt?",
    faq_1_a: "Da Monate und Jahre unterschiedlich lang sind, verwenden wir standardisierte Durchschnittswerte für die Umrechnung. So entstehen konsistente Ergebnisse für Schätzungen und allgemeine Planungen.",
    faq_2_q: "Welche Einheiten werden unterstützt?",
    faq_2_a: "Dieses Tool unterstützt die folgenden 13 Einheiten: Nanosekunden, Mikrosekunden, Millisekunden, Sekunden, Minuten, Stunden, Tage, Wochen, Monate, Jahre, Jahrzehnte, Jahrhunderte und Jahrtausende.",
    see1: "Stunden-Differenz-Rechner",
    see2: "Stunden-und-Minuten-Rechner",
    see3: "Datum-Zeit-Differenzrechner",
    see4: "Crontab-Generator",
    f_1: "Zwischen 13 Zeiteinheiten umrechnen",
    f_2: "Sofortige Umrechnung in Echtzeit",
    f_3: "Unterstützt von Nanosekunden bis Jahrtausenden",
    f_4: "Verarbeitung im Browser — keine Daten werden an Server gesendet"
  },
  nl: {
    title: "Tijdconverter",
    page_title: "Tijdconverter — Minuten naar Uren, Seconden, Dagen en Meer Omzetten | Gratis",
    meta: "Gratis online tijdconverter. Zet minuten om naar uren, seconden naar minuten, dagen naar weken en meer, tussen 13 tijdseenheden — van nanoseconden tot millennia.",
    d1: "Met deze tijdconverter kun je bijvoorbeeld seconden omzetten naar minuten, minuten naar uren, uren naar dagen, dagen naar weken, maanden of jaren, enzovoort. Om de conversie uit te voeren, voer je gewoon de waarde in die je wilt omzetten, kies je de huidige meeteenheid en de eenheid waarnaar de waarde moet worden omgezet. De tool toont direct het geconverteerde resultaat in de gekozen doeleenheid.",
    d2: "Ondersteunde tijdseenheden",
    s: "Seconden",
    ms: "Milliseconden",
    μs: "Microseconden",
    ns: "Nanoseconden",
    min: "Minuten",
    h: "Uren",
    d: "Dagen",
    wk: "Weken",
    mo: "Maanden",
    yr: "Jaren",
    dec: "Decennia",
    century: "Eeuwen",
    millennium: "Millennia",
    value: "Waarde",
    from: "Van",
    to: "Naar",
    result: "Resultaat",
    err: "Conversie niet uitgevoerd",
    how_it_works_title: "Hoe het werkt",
    step_1_title: "Voer waarde in",
    step_1_desc: "Typ de tijdwaarde die je wilt omzetten.",
    step_2_title: "Selecteer eenheden",
    step_2_desc: "Kies de bron- en doel-tijdseenheden.",
    step_3_title: "Kopieer resultaat",
    step_3_desc: "De conversie vindt direct plaats. Gebruik de kopieerknop om het resultaat naar je klembord te sturen.",
    use_cases_title: "Gebruiksscenario's",
    uc_1_title: "Projectplanning",
    uc_1_desc: "Schat de projectduur snel in door weken en maanden om te zetten in uren of dagen voor een nauwkeurige planning.",
    uc_2_title: "Wetenschappelijke berekeningen",
    uc_2_desc: "Converteer nanoseconden en microseconden naar standaardeenheden voor technische documentatie en experimenten.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Hoe worden maanden en jaren behandeld?",
    faq_1_a: "Omdat maanden en jaren variërende lengtes hebben, gebruiken we standaard gemiddelde waarden voor de conversie. Dit zorgt voor consistente resultaten voor schattingen en algemene planning.",
    faq_2_q: "Welke eenheden worden ondersteund?",
    faq_2_a: "Deze tool ondersteunt de volgende 13 eenheden: nanoseconden, microseconden, milliseconden, seconden, minuten, uren, dagen, weken, maanden, jaren, decennia, eeuwen en millennia.",
    see1: "Tijdsverschilcalculator",
    see2: "Uren- en minuten-calculator",
    see3: "Tijdsverschilcalculator (datum & tijd)",
    see4: "Crontab-generator",
    f_1: "Converteer tussen 13 tijdseenheden",
    f_2: "Directe real-time conversie",
    f_3: "Ondersteuning van nanoseconden tot millennia",
    f_4: "Verwerking in de browser — geen gegevens naar servers verzonden"
  },
  ru: {
    title: "Конвертер времени",
    page_title: "Конвертер времени — перевод часов в минуты, секунд в минуты, дни, недели и другое | Бесплатно",
    meta: "Бесплатный онлайн-конвертер времени. Переводите часы в минуты, секунды в минуты, минуты в часы, дни в недели и многое другое — между 13 единицами времени, от наносекунд до тысячелетий.",
    d1: "С помощью этого конвертера времени вы можете переводить значения между любыми из 13 единиц времени — секундами, минутами, часами, днями, неделями, месяцами, годами и многим другим. Чтобы выполнить перевод, просто введите значение, которое вы хотите конвертировать, выберите исходную единицу измерения и целевую единицу. Инструмент мгновенно отобразит полученный результат в выбранной единице измерения.",
    d2: "Поддерживаемые единицы измерения времени",
    s: "Секунды",
    ms: "Миллисекунды",
    μs: "Микросекунды",
    ns: "Наносекунды",
    min: "Минуты",
    h: "Часы",
    d: "Дни",
    wk: "Недели",
    mo: "Месяцы",
    yr: "Годы",
    dec: "Десятилетия",
    century: "Века",
    millennium: "Тысячелетия",
    value: "Значение",
    from: "Из",
    to: "В",
    result: "Результат",
    err: "Конвертация не выполнена",
    how_it_works_title: "Как это работает",
    step_1_title: "Введите значение",
    step_1_desc: "Введите значение времени, которое вы хотите перевести.",
    step_2_title: "Выберите единицы",
    step_2_desc: "Выберите исходную и целевую единицы времени из выпадающих списков.",
    step_3_title: "Скопируйте результат",
    step_3_desc: "Конвертация происходит мгновенно. Используйте кнопку копирования, чтобы сохранить результат в буфер обмена.",
    use_cases_title: "Варианты использования",
    uc_1_title: "Планирование проектов",
    uc_1_desc: "Быстро оценивайте продолжительность проектов, переводя недели и месяцы в часы или дни для создания точных графиков.",
    uc_2_title: "Научные расчеты",
    uc_2_desc: "Переводите наносекунды и микросекунды в стандартные единицы для технической документации и проведения экспериментов.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Как рассчитываются месяцы и годы?",
    faq_1_a: "Поскольку месяцы и годы имеют разную продолжительность, мы используем стандартные средние значения для конвертации. Это обеспечивает согласованные результаты при оценках и общем планировании.",
    faq_2_q: "Какие единицы измерения поддерживаются?",
    faq_2_a: "Этот инструмент поддерживает следующие 13 единиц: наносекунды, микросекунды, миллисекунды, секунды, минуты, часы, дни, недели, месяцы, годы, десятилетия, века и тысячелетия.",
    see1: "Разница во времени",
    see2: "Калькулятор часов и минут",
    see3: "Разница дат и времени",
    see4: "Генератор Crontab",
    f_1: "Конвертация между 13 единицами времени",
    f_2: "Мгновенный перевод в реальном времени",
    f_3: "Поддержка от наносекунд до тысячелетий",
    f_4: "Обработка на стороне клиента — данные не отправляются на серверы"
  }
}
</i18n>
