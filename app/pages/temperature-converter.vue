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
  ]
})

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

const units = ['C', 'F', 'K', 'R']

const state = reactive({
  value: null as number | null,
  from: 'C',
  to: 'F'
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
    en: '/temperature-converter',
    pt: '/conversor-de-temperatura',
    es: '/convertidor-de-temperatura',
    fr: '/convertisseur-de-temperature',
    it: '/convertitore-di-temperatura',
    id: '/konverter-suhu'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Temperature`"
    :wiki-label="'Wikipedia (Temperature)'"
    :see-also-links="[
      { label: t('see1'), to: 'length-converter' },
      { label: t('see2'), to: 'time-converter' },
      { label: t('see3'), to: 'storage-unit-converter' },
      { label: t('see4'), to: 'number-base-converter' }
    ]"
  >
    <template #info>
      <p>{{ t('d1') }}</p>
    </template>

    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="form-control w-full">
          <label for="temp-value" class="label">
            <span class="label-text font-bold text-base-content">{{ t('value') }}</span>
          </label>
          <input
            id="temp-value"
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
    title: "Temperature Converter",
    meta: "This Temperature Measurement Converter makes it easy to convert between different measurement units such as Celsius, Fahrenheit, Rankine and Kelvin.",
    d1: "With this temperature converter, you can, for example, quickly convert from Celsius to Fahrenheit or from Kelvin to Celsius. Whether you are a student, scientist, technician, or simply someone curious about different temperature scales, this tool allows you to convert temperatures to the unit of your choice. Just enter the desired value, select the source and target units, and the result will be displayed instantly.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Value",
    from: "From",
    to: "To",
    result: "Result",
    err: "Conversion not performed",
    see1: "Length Converter",
    see2: "Time Converter",
    see3: "Storage Unit Converter",
    see4: "Number Base Converter",
    f_1: "Convert between Celsius, Fahrenheit, Kelvin and Rankine",
    f_2: "Instant real-time conversion",
    f_3: "Supports all major temperature scales",
    f_4: "Client-side processing — no data sent to servers"
  },
  pt: {
    title: "Conversor de Temperatura",
    meta: "Este Conversor de Medida de Temperatura facilita a conversão entre diferentes unidades de medida como Celsius, Fahrenheit, Rankine e Kelvin.",
    d1: "Com este conversor de temperatura, você poderá, por exemplo, converter rapidamente de Celsius para Fahrenheit ou de Kelvin para Celsius. Seja você estudante, cientista, técnico ou simplesmente alguém curioso sobre diferentes escalas de temperatura, esta ferramenta permite converter temperaturas para a unidade de sua escolha. Basta inserir o valor desejado, selecionar as unidades de origem e destino, e o resultado será exibido instantaneamente.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Valor",
    from: "De",
    to: "Para",
    result: "Resultado",
    err: "Conversão não realizada",
    see1: "Conversor de Comprimento",
    see2: "Conversor de Tempo",
    see3: "Conversor de Unidades de Armazenamento",
    see4: "Conversor de Bases Numéricas",
    f_1: "Converta entre Celsius, Fahrenheit, Kelvin e Rankine",
    f_2: "Conversão instantânea em tempo real",
    f_3: "Suporte a todas as principais escalas de temperatura",
    f_4: "Processamento no navegador — nenhum dado enviado a servidores"
  },
  es: {
    title: "Convertidor de Temperatura",
    meta: "Este Convertidor de Medida de Temperatura facilita la conversión entre diferentes unidades de medida como Celsius, Fahrenheit, Rankine y Kelvin.",
    d1: "Con este convertidor de temperatura, podrás, por ejemplo, convertir rápidamente de Celsius a Fahrenheit o de Kelvin a Celsius. Ya seas estudiante, científico, técnico o simplemente alguien curioso acerca de las diferentes escalas de temperatura, esta herramienta te permite convertir temperaturas a la unidad de tu elección. Solo tienes que introducir el valor deseado, seleccionar las unidades de origen y destino, y el resultado se mostrará instantáneamente.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Valor",
    from: "De",
    to: "A",
    result: "Resultado",
    err: "Conversión no realizada",
    see1: "Convertidor de Longitud",
    see2: "Convertidor de Tiempo",
    see3: "Convertidor de Unidades de Almacenamiento",
    see4: "Convertidor de Bases Numéricas",
    f_1: "Convierte entre Celsius, Fahrenheit, Kelvin y Rankine",
    f_2: "Conversión instantánea en tiempo real",
    f_3: "Compatible con todas las escalas de temperatura principales",
    f_4: "Procesamiento en el navegador — sin envío de datos a servidores"
  },
  fr: {
    title: "Convertisseur de Température",
    meta: "Ce Convertisseur de Mesure de Température facilite la conversion entre différentes unités de mesure comme le Celsius, le Fahrenheit, le Rankine et le Kelvin.",
    d1: "Avec ce convertisseur de température, vous pourrez, par exemple, convertir rapidement de Celsius à Fahrenheit ou de Kelvin à Celsius. Que vous soyez étudiant, scientifique, technicien ou simplement quelqu'un de curieux à propos des différentes échelles de température, cet outil vous permet de convertir les températures dans l'unité de votre choix. Il suffit d'entrer la valeur souhaitée, de sélectionner les unités de départ et d'arrivée, et le résultat sera affiché instantanément.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Valeur",
    from: "De",
    to: "À",
    result: "Résultat",
    err: "Conversion non effectuée",
    see1: "Convertisseur de Longueur",
    see2: "Convertisseur de Temps",
    see3: "Convertisseur d'Unités de Stockage",
    see4: "Convertisseur de Bases Numériques",
    f_1: "Convertissez entre Celsius, Fahrenheit, Kelvin et Rankine",
    f_2: "Conversion instantanée en temps réel",
    f_3: "Prend en charge toutes les principales échelles de température",
    f_4: "Traitement côté navigateur — aucune donnée envoyée aux serveurs"
  },
  it: {
    title: "Convertitore di Temperatura",
    meta: "Questo Convertitore di Misure di Temperatura facilita la conversione tra diverse unità di misura come Celsius, Fahrenheit, Rankine e Kelvin.",
    d1: "Con questo convertitore di temperatura, potrai, ad esempio, convertire rapidamente da Celsius a Fahrenheit o da Kelvin a Celsius. Che tu sia uno studente, scienziato, tecnico o semplicemente una persona curiosa sulle diverse scale di temperatura, questo strumento ti permette di convertire le temperature nell'unità di tua scelta. Basta inserire il valore desiderato, selezionare le unità di origine e destinazione, e il risultato verrà visualizzato all'istante.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Valore",
    from: "Da",
    to: "A",
    result: "Risultato",
    err: "Conversione non eseguita",
    see1: "Convertitore di Lunghezza",
    see2: "Convertitore di Tempo",
    see3: "Convertitore di Unità di Archiviazione",
    see4: "Convertitore di Basi Numeriche",
    f_1: "Converti tra Celsius, Fahrenheit, Kelvin e Rankine",
    f_2: "Conversione istantanea in tempo reale",
    f_3: "Supporta tutte le principali scale di temperatura",
    f_4: "Elaborazione nel browser — nessun dato inviato ai server"
  },
  id: {
    title: "Konverter Suhu",
    meta: "Konverter Suhu ini memudahkan konversi antara berbagai satuan ukuran seperti Celsius, Fahrenheit, Rankine dan Kelvin.",
    d1: "Dengan konverter suhu ini, Anda dapat, misalnya, dengan cepat mengonversi dari Celsius ke Fahrenheit atau dari Kelvin ke Celsius. Baik Anda seorang pelajar, ilmuwan, teknisi, atau sekadar penasaran dengan berbagai skala suhu, alat ini membantu Anda mengubah suhu ke satuan pilihan Anda. Cukup masukkan nilai yang diinginkan, pilih satuan asal dan tujuan, lalu hasilnya akan ditampilkan seketika.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Nilai",
    from: "Dari",
    to: "Ke",
    result: "Hasil",
    err: "Konversi tidak dilakukan",
    see1: "Konverter Panjang",
    see2: "Konverter Waktu",
    see3: "Konverter Unit Penyimpanan",
    see4: "Konverter Basis Angka",
    f_1: "Konversi antara Celsius, Fahrenheit, Kelvin, dan Rankine",
    f_2: "Konversi instan secara real-time",
    f_3: "Mendukung semua skala suhu utama",
    f_4: "Pemrosesan di browser — tidak ada data yang dikirim ke server"
  }
}
</i18n>
