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
  howToName: t('how_it_works_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
  ],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') }
  ]
})

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

const units = ['m', 'km', 'cm', 'mm', 'μm', 'nm', 'ft', 'in', 'yd', 'mi', 'nmi', 'ly', 'point']

const state = reactive({
  value: null as number | null,
  from: 'm',
  to: 'km'
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
    en: '/length-converter',
    pt: '/conversor-de-comprimento',
    es: '/convertidor-de-longitud',
    fr: '/convertisseur-de-longueur',
    it: '/convertitore-di-lunghezza',
    id: '/konverter-panjang'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Unit_of_length`"
    wiki-label="Length"
    :see-also-links="[
      { label: t('see1'), to: 'temperature-converter' },
      { label: t('see2'), to: 'time-converter' },
      { label: t('see3'), to: 'storage-unit-converter' },
      { label: t('see4'), to: 'roman-numerals-converter' }
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
          <label for="length-value" class="label">
            <span class="label-text font-bold text-base-content">{{ t('value') }}</span>
          </label>
          <input
            id="length-value"
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
    title: "Length Converter",
    meta: "With our Length Measurement Unit Converter, you can easily convert between various units of measurement, such as meters, kilometers, miles, and much more.",
    d1: "Whether you need to transform centimeters into inches, kilometers into miles, feet into meters, or any other combination, our tool is ready to meet your needs. Simply enter the value to be converted and select the source and destination units to obtain the result instantly.",
    d2: "The units of measurement available for conversion include",
    m: "Meter",
    km: "Kilometer",
    cm: "Centimeter",
    mm: "Millimeter",
    μm: "Micrometer",
    nm: "Nanometer",
    ft: "Foot",
    in: "Inch",
    yd: "Yard",
    mi: "Mile",
    nmi: "Nautical Mile",
    ly: "Light-year",
    point: "Point",
    value: "Value",
    from: "From",
    to: "To",
    result: "Result",
    err: "Conversion not performed",
    how_it_works_title: "How It Works",
    step_1_title: "Enter Value",
    step_1_desc: "Type the length value you want to convert.",
    step_2_title: "Select Units",
    step_2_desc: "Choose the source and target length units.",
    step_3_title: "Copy Result",
    step_3_desc: "The conversion happens instantly. Use the copy button to send it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "Engineering & Construction",
    uc_1_desc: "Convert between metric and imperial units for technical drawings and building specifications.",
    uc_2_title: "International Travel",
    uc_2_desc: "Quickly convert road distances from kilometers to miles or heights from meters to feet.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is the difference between the Metric and Imperial systems?",
    faq_1_a: "The Metric system is decimal-based (meters, kilometers), while the Imperial system uses traditional units (inches, feet, miles). Most of the world uses Metric, but the US and UK still use Imperial units for many applications.",
    faq_2_q: "Is this converter accurate for astronomical distances?",
    faq_2_a: "Yes, it supports units like Light-years and Nautical Miles with high precision, making it suitable for both terrestrial and celestial calculations.",
    see1: "Temperature Converter",
    see2: "Time Converter",
    see3: "Storage Unit Converter",
    see4: "Roman Numerals Converter",
    f_1: "Convert between 13 units of length",
    f_2: "Instant real-time conversion",
    f_3: "Supports metric, imperial and astronomical units",
    f_4: "Client-side processing — no data sent to servers"
  },
  pt: {
    title: "Conversor de Comprimento",
    meta: "Com o nosso Conversor de Unidade de Medida de Comprimento, você pode facilmente converter entre diversas unidades de medida, como metros, quilômetros e muito mais.",
    d1: "Seja para transformar centímetros em polegadas, quilômetros em milhas, pés em metros ou qualquer outra combinação, nossa ferramenta está pronta para atender às suas necessidades. Basta inserir o valor a ser convertido e selecionar as unidades de origem e de destino para obter o resultado instantaneamente.",
    d2: "As unidades de medida disponíveis para conversão incluem",
    m: "Metro",
    km: "Quilômetro",
    cm: "Centímetro",
    mm: "Milímetro",
    μm: "Micrômetro",
    nm: "Nanômetro",
    ft: "Pé",
    in: "Polegada",
    yd: "Jarda",
    mi: "Milha",
    nmi: "Milha Náutica",
    ly: "Ano-luz",
    point: "Ponto",
    value: "Valor",
    from: "De",
    to: "Para",
    result: "Resultado",
    err: "Conversão não realizada",
    how_it_works_title: "Como Funciona",
    step_1_title: "Inserir Valor",
    step_1_desc: "Digite o valor de comprimento que você deseja converter.",
    step_2_title: "Selecionar Unidades",
    step_2_desc: "Escolha as unidades de comprimento de origem e destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "A conversão acontece instantaneamente. Use o botão de copiar para enviar para a área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Engenharia e Construção",
    uc_1_desc: "Converta entre unidades métricas e imperiais para desenhos técnicos e especificações de construção.",
    uc_2_title: "Viagens Internacionais",
    uc_2_desc: "Converta rapidamente distâncias de estrada de quilômetros para milhas ou alturas de metros para pés.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Qual a diferença entre os sistemas Métrico e Imperial?",
    faq_1_a: "O sistema Métrico é baseado em decimais (metros, quilômetros), enquanto o sistema Imperial utiliza unidades tradicionais (polegadas, pés, milhas). A maior parte do mundo usa o Métrico, mas os EUA e o Reino Unido ainda usam unidades Imperiais em muitas aplicações.",
    faq_2_q: "Este conversor é preciso para distâncias astronômicas?",
    faq_2_a: "Sim, ele suporta unidades como Anos-luz e Milhas Náuticas com alta precisão, tornando-o adequado para cálculos terrestres e celestiais.",
    see1: "Conversor de Temperatura",
    see2: "Conversor de Tempo",
    see3: "Conversor de Unidades de Armazenamento",
    see4: "Conversor de Números Romanos",
    f_1: "Converta entre 13 unidades de comprimento",
    f_2: "Conversão instantânea em tempo real",
    f_3: "Suporte a unidades métricas, imperiais e astronômicas",
    f_4: "Processamento no navegador — nenhum dado enviado a servidores"
  },
  es: {
    title: "Convertidor de Longitud",
    meta: "Con nuestro Convertidor de Unidad de Medida de Longitud, puede convertir fácilmente entre diversas unidades de medida, como metros, kilómetros y mucho más.",
    d1: "Ya sea para transformar centímetros en pulgadas, kilómetros en millas, pies en metros o cualquier otra combinación, nuestra herramienta está lista para satisfacer sus necesidades. Simplemente ingrese el valor a convertir y seleccione las unidades de origen y destino para obtener el resultado al instante.",
    d2: "Las unidades de medida disponibles para conversión incluyen",
    m: "Metro",
    km: "Kilómetro",
    cm: "Centímetro",
    mm: "Milímetro",
    μm: "Micrómetro",
    nm: "Nanómetro",
    ft: "Pie",
    in: "Pulgada",
    yd: "Yarda",
    mi: "Milla",
    nmi: "Milla Náutica",
    ly: "Año luz",
    point: "Punto",
    value: "Valor",
    from: "De",
    to: "A",
    result: "Resultado",
    err: "Conversión no realizada",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Ingresar Valor",
    step_1_desc: "Escribe el valor de longitud que deseas convertir.",
    step_2_title: "Seleccionar Unidades",
    step_2_desc: "Elige las unidades de longitud de origen y destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "La conversión es instantánea. Usa el botón de copiar para enviarlo al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Ingeniería y Construcción",
    uc_1_desc: "Convierte entre unidades métricas e imperiales para dibujos técnicos y especificaciones de construcción.",
    uc_2_title: "Viajes Internacionales",
    uc_2_desc: "Convierte rápidamente distancias de carretera de kilómetros a millas o alturas de metros a pies.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cuál es la diferencia entre los sistemas Métrico e Imperial?",
    faq_1_a: "El sistema Métrico se basa en decimales (metros, kilómetros), mientras que el sistema Imperial utiliza unidades tradicionales (pulgadas, pies, millas). La mayor parte del mundo usa el Métrico, pero EE. UU. y el Reino Unido todavía usan unidades Imperiales en muchas aplicaciones.",
    faq_2_q: "¿Es preciso este convertidor para distancias astronómicas?",
    faq_2_a: "Sí, admite unidades como Años luz y Millas náuticas con alta precisión, lo que lo hace adecuado para cálculos terrestres y celestiales.",
    see1: "Convertidor de Temperatura",
    see2: "Convertidor de Tiempo",
    see3: "Convertidor de Unidades de Almacenamiento",
    see4: "Convertidor de Números Romanos",
    f_1: "Convierte entre 13 unidades de longitud",
    f_2: "Conversión instantánea en tiempo real",
    f_3: "Compatible con unidades métricas, imperiales y astronómicas",
    f_4: "Procesamiento en el navegador — sin envío de datos a servidores"
  },
  fr: {
    title: "Convertisseur de Longueur",
    meta: "Avec notre Convertisseur d'Unité de Mesure de Longueur, vous pouvez facilement convertir entre diverses unités de mesure, telles que mètres, kilomètres et bien plus encore.",
    d1: "Que ce soit pour transformer des centimètres en pouces, des kilomètres en miles, des pieds en mètres ou toute autre combinaison, notre outil est prêt à répondre à vos besoins. Il suffit d'entrer la valeur à convertir et de sélectionner les unités de départ et d'arrivée pour obtenir le résultat instantanément.",
    d2: "Les unités de mesure disponibles pour la conversion comprennent",
    m: "Mètre",
    km: "Kilomètre",
    cm: "Centimètre",
    mm: "Millimètre",
    μm: "Micromètre",
    nm: "Nanomètre",
    ft: "Pied",
    in: "Pouce",
    yd: "Yard",
    mi: "Mile",
    nmi: "Mille Nautique",
    ly: "Année-lumière",
    point: "Point",
    value: "Valeur",
    from: "De",
    to: "À",
    result: "Résultat",
    err: "Conversion non effectuée",
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Entrer la Valeur",
    step_1_desc: "Tapez la valeur de longueur que vous souhaitez convertir.",
    step_2_title: "Sélectionner les Unités",
    step_2_desc: "Choisissez les unités de longueur de départ et d'arrivée.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "La conversion est instantanée. Utilisez le bouton de copie pour l'envoyer au presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Ingénierie et Construction",
    uc_1_desc: "Convertissez entre les unités métriques et impériales pour les dessins techniques et les spécifications de construction.",
    uc_2_title: "Voyages Internationaux",
    uc_2_desc: "Convertissez rapidement les distances routières de kilomètres en miles ou les hauteurs de mètres en pieds.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Quelle est la différence entre les systèmes Métrique et Impérial ?",
    faq_1_a: "Le système Métrique est basé sur les décimales (mètres, kilomètres), tandis que le système Impérial utilise des unités traditionnelles (pouces, pieds, miles). La majeure partie du monde utilise le Métrique, mais les États-Unis et le Royaume-Uni utilisent toujours les unités impériales pour de nombreuses applications.",
    faq_2_q: "Ce convertisseur est-il précis pour les distances astronomiques ?",
    faq_2_a: "Oui, il prend en charge des unités telles que les années-lumière et les milles nautiques avec une grande précision, ce qui le rend adapté aux calculs terrestres et célestes.",
    see1: "Convertisseur de Température",
    see2: "Convertisseur de Temps",
    see3: "Convertisseur d'Unités de Stockage",
    see4: "Convertisseur de Nombres Romains",
    f_1: "Convertissez entre 13 unités de longueur",
    f_2: "Conversion instantanée en temps réel",
    f_3: "Prend en charge les unités métriques, impériales et astronomiques",
    f_4: "Traitement côté navigateur — aucune donnée envoyée aux serveurs"
  },
  it: {
    title: "Convertitore di Lunghezza",
    meta: "Con il nostro Convertitore di Unità di Misura di Lunghezza, puoi facilmente convertire tra diverse unità di misura, come metri, chilometri e molto altro.",
    d1: "Che si tratti di trasformare centimetri in pollici, chilometri in miglia, piedi in metri o qualsiasi altra combinazione, il nostro strumento è pronto a soddisfare le tue esigenze. Basta inserire il valore da convertire e selezionare le unità di partenza e di arrivo per ottenere il risultato all'istante.",
    d2: "Le unità di misura disponibili per la conversione includono",
    m: "Metro",
    km: "Chilometro",
    cm: "Centimetro",
    mm: "Millimetro",
    μm: "Micrometro",
    nm: "Nanometro",
    ft: "Piede",
    in: "Pollice",
    yd: "Iarda",
    mi: "Miglio",
    nmi: "Miglio Nautico",
    ly: "Anno luce",
    point: "Punto",
    value: "Valore",
    from: "Da",
    to: "A",
    result: "Risultato",
    err: "Conversione non eseguita",
    how_it_works_title: "Come Funziona",
    step_1_title: "Inserisci Valore",
    step_1_desc: "Digita il valore di lunghezza che desideri convertire.",
    step_2_title: "Seleziona Unità",
    step_2_desc: "Scegli le unità di lunghezza di origine e destinazione.",
    step_3_title: "Copia Risultato",
    step_3_desc: "La conversione è istantanea. Usa il pulsante di copia per inviarlo agli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Ingegneria e Costruzioni",
    uc_1_desc: "Converti tra unità metriche e imperiali per disegni tecnici e specifiche di costruzione.",
    uc_2_title: "Viaggi Internazionali",
    uc_2_desc: "Converti rapidamente le distanze stradali da chilometri a miglia o le altezze da metri a piedi.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Qual è la differenza tra i sistemi Metrico e Imperiale?",
    faq_1_a: "Il sistema Metrico è basato sui decimali (metri, chilometri), mentre il sistema Imperiale utilizza unità tradizionali (pollici, piedi, miglia). La maggior parte del mondo usa il Metrico, ma gli USA e il Regno Unito usano ancora le unità imperiali per molte applicazioni.",
    faq_2_q: "Questo convertitore è preciso per le distanze astronomiche?",
    faq_2_a: "Sì, supporta unità come Anni luce e Miglia nautiche con alta precisione, rendendolo adatto sia per calcoli terrestri che celesti.",
    see1: "Convertitore di Temperatura",
    see2: "Convertitore di Tempo",
    see3: "Convertitore di Unità di Archiviazione",
    see4: "Convertitore di Numeri Romani",
    f_1: "Converti tra 13 unità di lunghezza",
    f_2: "Conversione istantanea in tempo reale",
    f_3: "Supporta unità metriche, imperiali e astronomiche",
    f_4: "Elaborazione nel browser — nessun dato inviato ai server"
  },
  id: {
    title: "Konverter Panjang",
    meta: "Dengan Konverter Satuan Panjang kami, Anda dapat dengan mudah mengonversi berbagai satuan ukuran, seperti meter, kilometer, mil, dan banyak lagi.",
    d1: "Baik untuk mengubah sentimeter menjadi inci, kilometer menjadi mil, kaki menjadi meter, atau kombinasi lainnya, alat kami siap memenuhi kebutuhan Anda. Cukup masukkan nilai yang ingin dikonversi, lalu pilih satuan asal dan tujuan untuk mendapatkan hasil secara instan.",
    d2: "Satuan ukuran yang tersedia untuk dikonversi meliputi",
    m: "Meter",
    km: "Kilometer",
    cm: "Sentimeter",
    mm: "Milimeter",
    μm: "Mikrometer",
    nm: "Nanometer",
    ft: "Kaki",
    in: "Inci",
    yd: "Yard",
    mi: "Mil",
    nmi: "Mil Laut",
    ly: "Tahun cahaya",
    point: "Poin",
    value: "Nilai",
    from: "Dari",
    to: "Ke",
    result: "Hasil",
    err: "Konversi tidak dilakukan",
    how_it_works_title: "Cara Kerja",
    step_1_title: "Masukkan Nilai",
    step_1_desc: "Ketik nilai panjang yang ingin Anda konversi.",
    step_2_title: "Pilih Satuan",
    step_2_desc: "Pilih satuan panjang asal dan tujuan.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Konversi terjadi seketika. Gunakan tombol salin untuk mengirim ke papan klip.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Teknik & Konstruksi",
    uc_1_desc: "Konversikan antara satuan metrik dan imperial untuk gambar teknis dan spesifikasi bangunan.",
    uc_2_title: "Perjalanan Internasional",
    uc_2_desc: "Konversikan jarak jalan dari kilometer ke mil atau tinggi dari meter ke kaki dengan cepat.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apa perbedaan antara sistem Metrik dan Imperial?",
    faq_1_a: "Sistem Metrik berbasis desimal (meter, kilometer), sedangkan sistem Imperial menggunakan satuan tradisional (inci, kaki, mil). Sebagian besar dunia menggunakan Metrik, tetapi AS dan Inggris masih menggunakan satuan Imperial untuk banyak aplikasi.",
    faq_2_q: "Apakah konverter ini akurat untuk jarak astronomi?",
    faq_2_a: "Ya, ini mendukung satuan seperti Tahun cahaya dan Mil Laut dengan presisi tinggi, sehingga cocok untuk perhitungan terestrial maupun celestial.",
    see1: "Konverter Suhu",
    see2: "Konverter Waktu",
    see3: "Konverter Unit Penyimpanan",
    see4: "Konverter Angka Romawi",
    f_1: "Konversi antara 13 satuan panjang",
    f_2: "Konversi instan secara real-time",
    f_3: "Mendukung satuan metrik, imperial, dan astronomi",
    f_4: "Pemrosesan di browser — tidak ada data yang dikirim ke server"
  }
}
</i18n>
