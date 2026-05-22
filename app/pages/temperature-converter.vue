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
    id: '/konverter-suhu',
    de: '/temperatur-umrechner',
    nl: '/temperatuur-converter'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Temperature`"
    wiki-label="Temperature"
    :see-also-links="[
      { label: t('see1'), to: 'length-converter' },
      { label: t('see2'), to: 'time-converter' },
      { label: t('see3'), to: 'storage-unit-converter' },
      { label: t('see4'), to: 'number-base-converter' }
    ]"
  >
    <template #info>
      <div class="space-y-8">
        <div>
          <p>{{ t('d1') }}</p>
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
    how_it_works_title: "How It Works",
    step_1_title: "Enter Value",
    step_1_desc: "Type the temperature value you want to convert.",
    step_2_title: "Select Scales",
    step_2_desc: "Choose the source and target temperature scales.",
    step_3_title: "Copy Result",
    step_3_desc: "The conversion happens instantly. Use the copy button to send it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "Cooking & Recipes",
    uc_1_desc: "Quickly convert oven temperatures between Celsius and Fahrenheit for international recipes.",
    uc_2_title: "Scientific Research",
    uc_2_desc: "Convert measurements to Kelvin or Rankine for thermodynamic calculations and laboratory work.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is the difference between Celsius and Fahrenheit?",
    faq_1_a: "Celsius is based on the freezing and boiling points of water (0°C and 100°C), while Fahrenheit uses a different scale (32°F and 212°F for the same points).",
    faq_2_q: "When is Kelvin used?",
    faq_2_a: "Kelvin is the primary unit of temperature in the physical sciences and is used when absolute temperature measurements are required.",
    see1: "Length",
    see2: "Time",
    see3: "Storage Unit",
    see4: "Number Base",
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
    how_it_works_title: "Como Funciona",
    step_1_title: "Inserir Valor",
    step_1_desc: "Digite o valor da temperatura que você deseja converter.",
    step_2_title: "Selecionar Escalas",
    step_2_desc: "Escolha as escalas de temperatura de origem e destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "A conversão acontece instantaneamente. Use o botão de copiar para enviar para a área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Culinária e Receitas",
    uc_1_desc: "Converta rapidamente temperaturas de forno entre Celsius e Fahrenheit para receitas internacionais.",
    uc_2_title: "Pesquisa Científica",
    uc_2_desc: "Converta medições para Kelvin ou Rankine para cálculos termodinâmicos e trabalho de laboratório.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Qual a diferença entre Celsius e Fahrenheit?",
    faq_1_a: "Celsius é baseado nos pontos de congelamento e ebulição da água (0°C e 100°C), enquanto Fahrenheit usa uma escala diferente (32°F e 212°F para os mesmos pontos).",
    faq_2_q: "Quando o Kelvin é usado?",
    faq_2_a: "Kelvin é a unidade principal de temperatura nas ciências físicas e é usado quando medições de temperatura absoluta são necessárias.",
    see1: "Comprimento",
    see2: "Tempo",
    see3: "Unidades de Armazenamento",
    see4: "Bases Numéricas",
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
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Ingresar Valor",
    step_1_desc: "Escribe el valor de temperatura que deseas convertir.",
    step_2_title: "Seleccionar Escalas",
    step_2_desc: "Elige las escalas de temperatura de origen y destino.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "La conversión es instantánea. Usa el botón de copiar para enviarlo al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Cocina y Recetas",
    uc_1_desc: "Convierte rápidamente las temperaturas del horno entre Celsius y Fahrenheit para recetas internacionales.",
    uc_2_title: "Investigación Científica",
    uc_2_desc: "Convierte mediciones a Kelvin o Rankine para cálculos termodinámicos y trabajo de laboratorio.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cuál es la diferencia entre Celsius y Fahrenheit?",
    faq_1_a: "Celsius se basa en los puntos de congelación y ebullición del agua (0°C y 100°C), mientras que Fahrenheit utiliza una escala diferente (32°F y 212°F para los mismos puntos).",
    faq_2_q: "¿Cuándo se usa el Kelvin?",
    faq_2_a: "Kelvin es la unidad principal de temperatura en las ciencias físicas y se utiliza cuando se requieren mediciones de temperatura absoluta.",
    see1: "Longitud",
    see2: "Tiempo",
    see3: "Unidades de Almacenamiento",
    see4: "Bases Numéricas",
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
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Entrer la Valeur",
    step_1_desc: "Tapez la valeur de température que vous souhaitez convertir.",
    step_2_title: "Sélectionner les Échelles",
    step_2_desc: "Choisissez les échelles de température de départ et d'arrivée.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "La conversion est instantanée. Utilisez le bouton de copie pour l'envoyer au presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Cuisine et Recettes",
    uc_1_desc: "Convertissez rapidement les températures du four entre Celsius et Fahrenheit pour des recettes internationales.",
    uc_2_title: "Recherche Scientifique",
    uc_2_desc: "Convertissez les mesures en Kelvin ou Rankine pour les calculs thermodynamiques et les travaux de laboratoire.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Quelle est la différence entre Celsius et Fahrenheit ?",
    faq_1_a: "Le Celsius est basé sur les points de congélation et d'ébullition de l'eau (0°C et 100°C), tandis que le Fahrenheit utilise une échelle différente (32°F et 212°F pour les mêmes points).",
    faq_2_q: "Quand le Kelvin est-il utilisé ?",
    faq_2_a: "Le Kelvin est l'unité principale de température dans les sciences physiques et est utilisé lorsque des mesures de température absolue sont nécessaires.",
    see1: "Longueur",
    see2: "Temps",
    see3: "Unités de Stockage",
    see4: "Bases Numériques",
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
    how_it_works_title: "Come Funziona",
    step_1_title: "Inserisci Valore",
    step_1_desc: "Digita il valore di temperatura che desideri convertire.",
    step_2_title: "Seleziona Scale",
    step_2_desc: "Scegli le scale di temperatura di origine e destinazione.",
    step_3_title: "Copia Risultato",
    step_3_desc: "La conversione è istantanea. Usa il pulsante di copia per inviarlo agli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Cucina e Ricette",
    uc_1_desc: "Converti rapidamente le temperature del forno tra Celsius e Fahrenheit per ricette internazionali.",
    uc_2_title: "Ricerca Scientifica",
    uc_2_desc: "Converti le misurazioni in Kelvin o Rankine per calcoli termodinamici e lavori in laboratorio.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Qual è la differenza tra Celsius e Fahrenheit?",
    faq_1_a: "Celsius si basa sui punti di congelamento e ebollizione dell'acqua (0°C e 100°C), mentre Fahrenheit utilizza una scala diversa (32°F e 212°F per gli stessi punti).",
    faq_2_q: "Quando viene usato il Kelvin?",
    faq_2_a: "Il Kelvin è l'unità principale di temperatura nelle scienze fisiche e viene utilizzato quando sono richieste misurazioni della temperatura assoluta.",
    see1: "Lunghezza",
    see2: "Tempo",
    see3: "Unità di Archiviazione",
    see4: "Basi Numeriche",
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
    how_it_works_title: "Cara Kerja",
    step_1_title: "Masukkan Nilai",
    step_1_desc: "Ketik nilai suhu yang ingin Anda konversi.",
    step_2_title: "Pilih Skala",
    step_2_desc: "Pilih skala suhu asal dan tujuan.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Konversi terjadi seketika. Gunakan tombol salin untuk mengirim ke papan klip.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Memasak & Resep",
    uc_1_desc: "Konversikan suhu oven antara Celsius dan Fahrenheit dengan cepat untuk resep internasional.",
    uc_2_title: "Penelitian Ilmiah",
    uc_2_desc: "Konversikan pengukuran ke Kelvin atau Rankine untuk perhitungan termodinamika dan pekerjaan laboratorium.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apa perbedaan antara Celsius dan Fahrenheit?",
    faq_1_a: "Celsius didasarkan pada titik beku dan titik didih air (0°C dan 100°C), sedangkan Fahrenheit menggunakan skala yang berbeda (32°F dan 212°F untuk titik yang sama).",
    faq_2_q: "Kapan Kelvin digunakan?",
    faq_2_a: "Kelvin adalah satuan utama suhu dalam ilmu fisika dan digunakan ketika pengukuran suhu absolut diperlukan.",
    see1: "Panjang",
    see2: "Waktu",
    see3: "Unit Penyimpanan",
    see4: "Basis Angka",
    f_1: "Konversi antara Celsius, Fahrenheit, Kelvin, dan Rankine",
    f_2: "Konversi instan secara real-time",
    f_3: "Mendukung semua skala suhu utama",
    f_4: "Pemrosesan di browser — tidak ada data yang dikirim ke server"
  },
  de: {
    title: "Temperatur-Umrechner",
    meta: "Dieser Umrechner für Temperatureinheiten erleichtert die Umrechnung zwischen verschiedenen Einheiten wie Celsius, Fahrenheit, Rankine und Kelvin.",
    d1: "Mit diesem Temperatur-Umrechner kannst du zum Beispiel schnell von Celsius in Fahrenheit oder von Kelvin in Celsius umrechnen. Egal, ob du Schüler, Wissenschaftler, Techniker oder einfach nur neugierig auf verschiedene Temperaturskalen bist: Dieses Tool hilft dir dabei, Temperaturen in die Einheit deiner Wahl umzuwandeln. Gib einfach den gewünschten Wert ein, wähle die Ausgangs- und Zieleinheit, und das Ergebnis wird sofort angezeigt.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Wert",
    from: "Von",
    to: "Nach",
    result: "Ergebnis",
    err: "Umrechnung nicht durchgeführt",
    how_it_works_title: "So funktioniert es",
    step_1_title: "Wert eingeben",
    step_1_desc: "Gib den Temperaturwert ein, den du umrechnen möchtest.",
    step_2_title: "Skalen auswählen",
    step_2_desc: "Wähle die Ausgangs- und Zieltemperaturskala.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Die Umrechnung erfolgt sofort. Nutze den Kopier-Button, um das Ergebnis in die Zwischenablage zu senden.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Kochen und Rezepte",
    uc_1_desc: "Wandle Ofentemperaturen schnell zwischen Celsius und Fahrenheit um, um internationale Rezepte korrekt nachzukochen.",
    uc_2_title: "Wissenschaftliche Forschung",
    uc_2_desc: "Konvertiere Messwerte in Kelvin oder Rankine für thermodynamische Berechnungen und Laborarbeit.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Was ist der Unterschied zwischen Celsius und Fahrenheit?",
    faq_1_a: "Celsius basiert auf dem Gefrier- und Siedepunkt von Wasser (0°C und 100°C), während Fahrenheit eine andere Skala verwendet (32°F und 212°F für dieselben Punkte).",
    faq_2_q: "Wann wird Kelvin verwendet?",
    faq_2_a: "Kelvin ist die grundlegende Temperatureinheit in den physikalischen Wissenschaften und wird verwendet, wenn absolute Temperaturmessungen erforderlich sind.",
    see1: "Länge",
    see2: "Zeit",
    see3: "Speichereinheiten",
    see4: "Zahlenbasen",
    f_1: "Zwischen Celsius, Fahrenheit, Kelvin und Rankine umrechnen",
    f_2: "Sofortige Umrechnung in Echtzeit",
    f_3: "Unterstützt alle wichtigen Temperaturskalen",
    f_4: "Verarbeitung im Browser — keine Daten werden an Server gesendet"
  },
  nl: {
    title: "Temperatuur-converter",
    meta: "Converteer eenvoudig tussen Celsius, Fahrenheit, Kelvin en Rankine met onze gratis online temperatuur-converter.",
    d1: "Of je nu de weersverwachting in een ander land wilt begrijpen, een wetenschappelijk experiment uitvoert of een recept volgt, onze tool biedt directe en nauwkeurige temperatuurconversies.",
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin",
    R: "Rankine",
    value: "Waarde",
    from: "Van",
    to: "Naar",
    result: "Resultaat",
    err: "Conversie niet uitgevoerd",
    how_it_works_title: "Hoe het werkt",
    step_1_title: "Voer waarde in",
    step_1_desc: "Typ de temperatuurwaarde die je wilt converteren.",
    step_2_title: "Selecteer eenheden",
    step_2_desc: "Kies de bron- en doeltemperatuurschalen.",
    step_3_title: "Resultaat bekijken",
    step_3_desc: "Het resultaat verschijnt direct. Gebruik de kopieerknop om het op te slaan.",
    use_cases_title: "Gebruiksvoorbeelden",
    uc_1_title: "Koken & Bakken",
    uc_1_desc: "Converteer oventemperaturen tussen Celsius e Fahrenheit voor internationale recepten.",
    uc_2_title: "Wetenschap & Techniek",
    uc_2_desc: "Zet temperaturen om naar Kelvin voor thermodynamische berekeningen e laboratoriumwerk.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is het absolute nulpunt?",
    faq_1_a: "Het absolute nulpunt is de laagst mogelijke temperatuur waarbij alle thermische beweging stopt. Dit komt overeen met 0 Kelvin of -273,15 Celsius.",
    faq_2_q: "Bij welke temperatuur zijn Celsius e Fahrenheit gelijk?",
    faq_2_a: "De schalen van Celsius e Fahrenheit snijden elkaar precies op -40 graden. Dus -40°C is gelijk aan -40°F.",
    see1: "Lengte",
    see2: "Tijd",
    see3: "Romeinse cijfers",
    see4: "Getalstelsels",
    f_1: "Converteer Celsius, Fahrenheit, Kelvin e Rankine",
    f_2: "Directe real-time resultaten",
    f_3: "Ondersteuning voor wetenschappelijke schalen",
    f_4: "Privé e veilig in uw browser"
  }
}
</i18n>
