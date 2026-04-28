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
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
  ]
})

useHead({
  title: t('title'),
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
    id: '/konverter-waktu'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Unit_of_time`"
    :wiki-label="'Wikipedia (Units of Time)'"
    :see-also-links="[
      { label: t('see1'), to: 'date-time-tools' },
      { label: t('see2'), to: 'date-time-tools' },
      { label: t('see3'), to: 'date-time-tools' },
      { label: t('see4'), to: 'date-time-tools' }
    ]"
  >
    <template #info>
      <div class="space-y-8">
        <section>
          <p class="mb-4">{{ t('d1') }}</p>
          <p>{{ t('d2') }}: {{ units.map(u => t(u)).join(', ') }}.</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:play-circle-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_to_use_title') }}
          </h2>
          <div class="grid sm:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="flex flex-col gap-2 bg-base-200/40 p-4 rounded-xl border border-primary/20">
              <span class="text-3xl font-black text-primary/30 leading-none">{{ i }}</span>
              <span class="font-bold text-base-content">{{ t(`step_${i}_title`) }}</span>
              <span class="text-sm text-base-content/70">{{ t(`step_${i}_desc`) }}</span>
            </div>
          </div>
        </section>
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
    meta: "This Time Unit Converter simplifies the conversion between various time measurement units, such as minutes, hours, seconds, days, weeks, months, years, among others.",
    d1: "With this time converter, you can, for example, convert seconds to minutes, minutes to hours, hours to days, days to weeks, months, or years, and so on. To perform the conversion, simply enter the value you wish to convert, choose the current measurement unit, and the unit to which the value will be converted. The tool will instantly display the converted result in the chosen destination measurement unit.",
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
    how_to_use_title: "How to use",
    step_1_title: "Enter Value",
    step_1_desc: "Type the time value you want to convert.",
    step_2_title: "Select Units",
    step_2_desc: "Choose the source and target time units.",
    step_3_title: "Copy Result",
    step_3_desc: "The conversion happens instantly. Use the copy button to send it to your clipboard.",
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
    meta: "Este Conversor de Unidades de Tempo facilita a conversão entre várias unidades de medida de tempo, como minutos, horas, segundos, dias, semanas, meses, anos, entre outros.",
    d1: "Com este conversor de tempo, você poderá, por exemplo, converter segundos para minutos, minutos para horas, horas para dias, dias em semanas, meses ou anos, e assim por diante. Para realizar a conversão, basta inserir o valor que deseja converter, escolher a unidade de medida atual e a unidade para a qual o valor será convertido. A ferramenta apresentará instantaneamente o resultado convertido na unidade de medida de destino escolhida.",
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
    how_to_use_title: "Como usar",
    step_1_title: "Inserir Valor",
    step_1_desc: "Digite o valor de tempo que você deseja converter.",
    step_2_title: "Selecionar Unidades",
    step_2_desc: "Escolha as unidades de tempo de origem e destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "A conversão acontece instantaneamente. Use o botão de copiar para enviar para a área de transferência.",
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
    meta: "Este Convertidor de Unidades de Tiempo facilita la conversión entre varias unidades de medida de tiempo, como minutos, horas, segundos, días, semanas, meses, años, entre otros.",
    d1: "Con este convertidor de tiempo, podrás, por ejemplo, convertir segundos en minutos, minutos en horas, horas en días, días en semanas, meses o años, y así sucesivamente. Para realizar la conversión, simplemente inserta el valor que deseas convertir, elige la unidad de medida actual y la unidad a la que se convertirá el valor. La herramienta mostrará instantáneamente el resultado convertido en la unidad de medida de destino elegida.",
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
    how_to_use_title: "Cómo usar",
    step_1_title: "Ingresar Valor",
    step_1_desc: "Escribe el valor de tiempo que deseas convertir.",
    step_2_title: "Seleccionar Unidades",
    step_2_desc: "Elige las unidades de tiempo de origen y destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "La conversión es instantánea. Usa el botón de copiar para enviarlo al portapapeles.",
    see1: "Diferencia entre Horas",
    see2: "Calculadora de Horas y Minutos",
    see3: "Diferencia entre Fechas Y Horas",
    see4: "Generador de Crontab",
    f_1: "Convierte entre 13 unidades de tiempo",
    f_2: "Conversión instantánea en tiempo real",
    f_3: "Compatible desde nanosegundos hasta milenios",
    f_4: "Procesamiento en el navegador — sin envío de datos a servidores"
  },
  fr: {
    title: "Convertisseur de Temps",
    meta: "Ce Convertisseur d'Unités de Temps facilite la conversion entre différentes unités de mesure du temps, telles que les minutes, les heures, les secondes, les jours, les semaines, les mois, les années, et bien d'autres.",
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
    how_to_use_title: "Comment utiliser l'outil",
    step_1_title: "Entrer la Valeur",
    step_1_desc: "Tapez la valeur de temps que vous souhaitez convertir.",
    step_2_title: "Sélectionner les Unités",
    step_2_desc: "Choisissez les unités de temps de départ et d'arrivée.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "La conversion est instantanée. Utilisez le bouton de copie pour l'envoyer au presse-papiers.",
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
    meta: "Questo Convertitore di Unità di Tempo facilita la conversione tra varie unità di misura del tempo, come minuti, ore, secondi, giorni, settimane, mesi, anni e altre ancora.",
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
    how_to_use_title: "Come usare lo strumento",
    step_1_title: "Inserisci Valore",
    step_1_desc: "Digita il valore di tempo che desideri convertire.",
    step_2_title: "Seleziona Unità",
    step_2_desc: "Scegli le unità di tempo di origine e destinazione.",
    step_3_title: "Copia Risultato",
    step_3_desc: "La conversione è istantanea. Usa il pulsante di copia per inviarlo agli appunti.",
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
    meta: "Konverter Satuan Waktu ini mempermudah konversi antara berbagai satuan pengukuran waktu, seperti menit, jam, detik, hari, minggu, bulan, tahun, di antara lainnya.",
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
    how_to_use_title: "Cara menggunakan alat ini",
    step_1_title: "Masukkan Nilai",
    step_1_desc: "Ketik nilai waktu yang ingin Anda konversi.",
    step_2_title: "Pilih Satuan",
    step_2_desc: "Pilih satuan waktu asal dan tujuan.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Konversi terjadi seketika. Gunakan tombol salin untuk mengirim ke papan klip.",
    see1: "Selisih Waktu",
    see2: "Kalkulator Jam dan Menit",
    see3: "Selisih Tanggal dan Waktu",
    see4: "Generator Crontab",
    f_1: "Konversi antara 13 satuan waktu",
    f_2: "Konversi instan secara real-time",
    f_3: "Mendukung dari nanodetik hingga milenium",
    f_4: "Pemrosesan di browser — tidak ada data yang dikirim ke server"
  }
}
</i18n>
