<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/romanice/dist/romanice.min.js', {
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

const state = reactive({
  value: '',
  output: '',
  error: false
})

watch(() => state.value, () => {
  state.output = ''
  state.error = false
})

function getConverter() {
  const Romanice = (window as any).Romanice
  if (!Romanice) return null
  return Romanice.romanice()
}

function toRoman() {
  const converter = getConverter()
  if (!converter) return
  try {
    state.error = false
    state.output = converter.toRoman(state.value.trim())
  } catch {
    state.error = true
    state.output = t('err', [t('to')])
  }
}

function fromRoman() {
  const converter = getConverter()
  if (!converter) return
  try {
    state.error = false
    state.output = String(converter.fromRoman(state.value.trim()))
  } catch {
    state.error = true
    state.output = t('err', [t('from')])
  }
}

defineI18nRoute({
  paths: {
    en: '/roman-numerals-converter',
    pt: '/conversor-de-numeros-romanos',
    es: '/convertidor-de-numeros-romanos',
    fr: '/convertisseur-de-nombres-romains',
    it: '/convertitore-di-numeri-romani',
    id: '/konverter-angka-romawi'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Roman_numerals`"
    wiki-label="Roman Numerals"
    :see-also-links="[
      { label: t('see1'), to: 'number-base-converter' },
      { label: t('see2'), to: 'length-converter' },
      { label: t('see3'), to: 'storage-unit-converter' },
      { label: t('see4'), to: 'temperature-converter' }
    ]"
  >
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
            { question: t('faq_2_q'), answer: t('faq_2_a') }
          ]"
        />
      </div>
    </template>

    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content">{{ t('in') }}</span>
        </label>
        <input
          v-model="state.value"
          type="text"
          class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl font-mono text-lg"
          placeholder="XIV / 14"
          autofocus
          @keyup.enter="toRoman"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <ButtonPrimary
          @click="toRoman"
          icon="heroicons:arrow-right-circle-20-solid"
          :disabled="!state.value"
        >
          {{ t('btn_to') }}
        </ButtonPrimary>

        <ButtonSecondary
          @click="fromRoman"
          icon="heroicons:arrow-left-circle-20-solid"
          :disabled="!state.value"
        >
          {{ t('btn_from') }}
        </ButtonSecondary>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="state.error" class="alert bg-error/10 text-error shadow-lg border-none rounded-2xl">
          <Icon name="heroicons:exclamation-circle-20-solid" class="w-6 h-6" />
          <span class="font-bold">{{ state.output }}</span>
        </div>
        <LineCopy v-else-if="state.output" :label="t('result')" :content="state.output">
          {{ state.output }}
        </LineCopy>
      </Transition>
    </div>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Roman Numerals Converter",
    meta: "Easily convert between Roman numerals and Arabic numbers. Enter any value and convert to or from Roman numerals instantly.",
    desc: "With this tool, you can convert Roman numerals to their equivalent in Arabic numbers and vice versa. Just enter the value you wish to convert and click the button corresponding to the desired conversion. Whether for students, teachers, or anyone who wants a quick conversion, this tool makes it simple.",
    in: "Enter a value (Roman or Arabic)",
    result: "Result",
    to: "to",
    from: "from",
    btn_to: "Convert to Roman",
    btn_from: "Convert from Roman",
    err: "The value could not be converted {0} Roman",
    how_it_works_title: "How It Works",
    step_1_title: "Enter Value",
    step_1_desc: "Type an Arabic number (e.g. 2024) or a Roman numeral (e.g. MMXXIV).",
    step_2_title: "Convert",
    step_2_desc: "Click 'Convert to Roman' or 'Convert from Roman' depending on your input.",
    step_3_title: "Copy",
    step_3_desc: "Use the copy button to send the converted result to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "History & Education",
    uc_1_desc: "Decode dates on historical monuments, research papers, and classical literature.",
    uc_2_title: "Architecture & Design",
    uc_2_desc: "Use Roman numerals for stylish clock faces, building year markers, and chapter headings.",
    faq_title: "Questions & Answers",
    faq_1_q: "Why is there a limit of 3999?",
    faq_1_a: "Standard Roman numerals use M (1000) as the largest symbol. While larger numbers can be represented with bars (vinculum), most standard systems and this tool focus on the 1-3999 range used in common applications.",
    faq_2_q: "How do I read Roman numerals?",
    faq_2_a: "Symbols are usually added (XVI = 10+5+1 = 16). However, if a smaller symbol appears before a larger one, it is subtracted (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Number Base Converter",
    see2: "Length Converter",
    see3: "Storage Unit Converter",
    see4: "Temperature Converter",
    f_1: "Convert Arabic numbers to Roman numerals",
    f_2: "Convert Roman numerals to Arabic numbers",
    f_3: "Instant client-side conversion",
    f_4: "Supports numbers from 1 to 3999"
  },
  pt: {
    title: "Conversor de Números Romanos",
    meta: "Converta facilmente entre números romanos e arábicos. Insira qualquer valor e converta para ou de algarismos romanos instantaneamente.",
    desc: "Com esta ferramenta, você poderá converter algarismos romanos para seu equivalente em números arábicos e vice-versa. Basta inserir o valor que deseja converter e clicar no botão correspondente à conversão desejada. Seja para estudantes, professores ou qualquer pessoa que deseja uma conversão rápida, esta ferramenta torna a tarefa simples.",
    in: "Digite um valor (Romano ou Arábico)",
    result: "Resultado",
    to: "para",
    from: "de",
    btn_to: "Converter para Romano",
    btn_from: "Converter de Romano",
    err: "O valor não pôde ser convertido {0} Romano",
    how_it_works_title: "Como Funciona",
    step_1_title: "Inserir Valor",
    step_1_desc: "Digite um número arábico (ex: 2024) ou um numeral romano (ex: MMXXIV).",
    step_2_title: "Converter",
    step_2_desc: "Clique em 'Converter para Romano' ou 'Converter de Romano' dependendo da entrada.",
    step_3_title: "Copiar",
    step_3_desc: "Use o botão de copiar para enviar o resultado convertido à área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "História e Educação",
    uc_1_desc: "Decifre datas em monumentos históricos, artigos de pesquisa e literatura clássica.",
    uc_2_title: "Arquitetura e Design",
    uc_2_desc: "Use números romanos para mostradores de relógio, marcadores de ano de construção e títulos de capítulos.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Por que existe um limite de 3999?",
    faq_1_a: "Os números romanos padrão usam M (1000) como o maior símbolo. Embora números maiores possam ser representados com barras (vínculo), a maioria dos sistemas e esta ferramenta focam no intervalo de 1-3999 usado em aplicações comuns.",
    faq_2_q: "Como leio números romanos?",
    faq_2_a: "Os símbolos são geralmente somados (XVI = 10+5+1 = 16). No entanto, se um símbolo menor aparecer antes de um maior, ele é subtraído (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Conversor de Bases Numéricas",
    see2: "Conversor de Comprimento",
    see3: "Conversor de Unidades de Armazenamento",
    see4: "Conversor de Temperatura",
    f_1: "Converta números arábicos para algarismos romanos",
    f_2: "Converta algarismos romanos para números arábicos",
    f_3: "Conversão instantânea no navegador",
    f_4: "Suporte a números de 1 a 3999"
  },
  es: {
    title: "Convertidor de Números Romanos",
    meta: "Convierte fácilmente entre números romanos y árabes. Introduce cualquier valor y conviértelo hacia o desde números romanos al instante.",
    desc: "Con esta herramienta, podrás convertir números romanos a su equivalente en números árabes y viceversa. Solo tienes que introducir el valor que deseas convertir y hacer clic en el botón correspondiente a la conversión deseada. Ya sea para estudiantes, profesores o cualquiera que desee una conversión rápida, esta herramienta simplifica la tarea.",
    in: "Introduce un valor (Romano o Árabe)",
    result: "Resultado",
    to: "a",
    from: "de",
    btn_to: "Convertir a Romano",
    btn_from: "Convertir de Romano",
    err: "El valor no pudo ser convertido {0} Romano",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Ingresar Valor",
    step_1_desc: "Escribe un número árabe (ej: 2024) o un número romano (ej: MMXXIV).",
    step_2_title: "Convertir",
    step_2_desc: "Haz clic en 'Convertir a Romano' o 'Convertir de Romano' dependiendo de tu entrada.",
    step_3_title: "Copiar",
    step_3_desc: "Usa el botón de copiar para enviar el resultado convertido al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Historia y Educación",
    uc_1_desc: "Descifra fechas en monumentos históricos, artículos de investigación y literatura clásica.",
    uc_2_title: "Arquitectura y Diseño",
    uc_2_desc: "Usa números romanos para esferas de relojes, marcadores de año de construcción y títulos de capítulos.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Por qué hay un límite de 3999?",
    faq_1_a: "Los números romanos estándar usan M (1000) como el símbolo más grande. Aunque se pueden representar números mayores con barras (vínculo), la mayoría de los sistemas y esta herramienta se centran en el rango 1-3999 utilizado en aplicaciones comunes.",
    faq_2_q: "¿Cómo leo los números romanos?",
    faq_2_a: "Los símbolos generalmente se suman (XVI = 10+5+1 = 16). Sin embargo, si un símbolo más pequeño aparece antes de uno más grande, se resta (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Convertidor de Bases Numéricas",
    see2: "Convertidor de Longitud",
    see3: "Convertidor de Unidades de Almacenamiento",
    see4: "Convertidor de Temperatura",
    f_1: "Convierte números árabes a numerales romanos",
    f_2: "Convierte numerales romanos a números árabes",
    f_3: "Conversión instantánea en el navegador",
    f_4: "Compatible con números del 1 al 3999"
  },
  fr: {
    title: "Convertisseur de Nombres Romains",
    meta: "Convertissez facilement entre chiffres romains et nombres arabes. Entrez n'importe quelle valeur et convertissez instantanément.",
    desc: "Avec cet outil, vous pourrez convertir des chiffres romains en leur équivalent en nombres arabes et vice-versa. Il suffit d'insérer la valeur souhaitée et de cliquer sur le bouton correspondant à la conversion désirée. Que ce soit pour les étudiants, les enseignants ou toute personne désirant effectuer une conversion rapide, cet outil simplifie la tâche.",
    in: "Entrez une valeur (Romain ou Arabe)",
    result: "Résultat",
    to: "en",
    from: "de",
    btn_to: "Convertir en Romain",
    btn_from: "Convertir depuis le Romain",
    err: "La valeur n'a pas pu être convertie {0} Romain",
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Entrer la Valeur",
    step_1_desc: "Tapez un nombre arabe (ex: 2024) ou un chiffre romain (ex: MMXXIV).",
    step_2_title: "Convertir",
    step_2_desc: "Cliquez sur 'Convertir en Romain' ou 'Convertir depuis le Romain' selon votre entrée.",
    step_3_title: "Copier",
    step_3_desc: "Utilisez le bouton de copie pour envoyer le résultat converti dans le presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Histoire et Éducation",
    uc_1_desc: "Déchiffrez des dates sur des monuments historiques, des documents de recherche et de la littérature classique.",
    uc_2_title: "Architecture et Design",
    uc_2_desc: "Utilisez des chiffres romains pour les cadrans d'horloge, les marqueurs d'année de construction et les titres de chapitres.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Pourquoi y a-t-il une limite de 3999 ?",
    faq_1_a: "Les chiffres romains standard utilisent M (1000) comme plus grand symbole. Bien que des nombres plus grands puissent être représentés avec des barres (vinculum), la plupart des systèmes standard et cet outil se concentrent sur la plage 1-3999 utilisée dans les applications courantes.",
    faq_2_q: "Comment lire les chiffres romains ?",
    faq_2_a: "Les symboles sont généralement additionnés (XVI = 10+5+1 = 16). Cependant, si un symbole plus petit apparaît avant un plus grand, il est soustrait (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Convertisseur de Bases Numériques",
    see2: "Convertisseur de Longueur",
    see3: "Convertisseur d'Unités de Stockage",
    see4: "Convertisseur de Température",
    f_1: "Convertissez des nombres arabes en chiffres romains",
    f_2: "Convertissez des chiffres romains en nombres arabes",
    f_3: "Conversion instantanée côté navigateur",
    f_4: "Prend en charge les nombres de 1 à 3999"
  },
  it: {
    title: "Convertitore di Numeri Romani",
    meta: "Converti facilmente tra numeri romani e arabi. Inserisci qualsiasi valore e convertilo da o verso i numeri romani istantaneamente.",
    desc: "Con questo strumento, potrai convertire cifre romane nel loro equivalente in numeri arabi e viceversa. Basta inserire il valore che desideri convertire e fare clic sul pulsante corrispondente alla conversione desiderata. Che si tratti di studenti, insegnanti o chiunque voglia eseguire una conversione rapida, questo strumento semplifica il compito.",
    in: "Inserisci un valore (Romano o Arabo)",
    result: "Risultato",
    to: "in",
    from: "da",
    btn_to: "Converti in Romano",
    btn_from: "Converti da Romano",
    err: "Il valore non è potuto essere convertito {0} Romano",
    how_it_works_title: "Come Funziona",
    step_1_title: "Inserisci Valore",
    step_1_desc: "Digita un numero arabo (es: 2024) o un numero romano (es: MMXXIV).",
    step_2_title: "Converti",
    step_2_desc: "Clicca su 'Converti in Romano' o 'Converti da Romano' a seconda dell'input.",
    step_3_title: "Copia",
    step_3_desc: "Usa il pulsante di copia per inviare il risultato convertito negli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Storia e Istruzione",
    uc_1_desc: "Decifra le date su monumenti storici, documenti di ricerca e letteratura classica.",
    uc_2_title: "Architettura e Design",
    uc_2_desc: "Usa i numeri romani per quadranti di orologi, indicatori dell'anno di costruzione e titoli di capitoli.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Perché c'è un limite di 3999?",
    faq_1_a: "I numeri romani standard usano M (1000) come simbolo più grande. Sebbene numeri più grandi possano essere rappresentati con barre (vinculum), la maggior parte dei sistemi standard e questo strumento si concentrano sull'intervallo 1-3999 utilizzato nelle applicazioni comuni.",
    faq_2_q: "Come leggo i numeri romani?",
    faq_2_a: "I simboli vengono solitamente sommati (XVI = 10+5+1 = 16). Tuttavia, se un simbolo più piccolo appare prima di uno più grande, viene sottratto (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Convertitore di Basi Numeriche",
    see2: "Convertitore di Lunghezza",
    see3: "Convertitore di Unità di Archiviazione",
    see4: "Convertitore di Temperatura",
    f_1: "Converti numeri arabi in cifre romane",
    f_2: "Converti cifre romane in numeri arabi",
    f_3: "Conversione istantanea nel browser",
    f_4: "Supporta numeri da 1 a 3999"
  },
  id: {
    title: "Konverter Angka Romawi",
    meta: "Konversi dengan mudah antara angka Romawi dan Arab. Masukkan nilai apa pun dan konversi ke atau dari angka Romawi secara instan.",
    desc: "Dengan alat ini, Anda dapat mengonversi angka Romawi ke padanannya dalam angka Arab dan sebaliknya. Cukup masukkan nilai yang ingin dikonversi dan klik tombol yang sesuai dengan konversi yang diinginkan. Baik untuk pelajar, guru, maupun siapa pun yang ingin melakukan konversi cepat, alat ini mempermudah prosesnya.",
    in: "Masukkan nilai (Romawi atau Arab)",
    result: "Hasil",
    to: "ke",
    from: "dari",
    btn_to: "Konversi ke Romawi",
    btn_from: "Konversi dari Romawi",
    err: "Nilai tidak dapat dikonversi {0} Romawi",
    how_it_works_title: "Cara Kerja",
    step_1_title: "Masukkan Nilai",
    step_1_desc: "Ketik angka Arab (mis: 2024) atau angka Romawi (mis: MMXXIV).",
    step_2_title: "Konversi",
    step_2_desc: "Klik 'Konversi ke Romawi' atau 'Konversi dari Romawi' tergantung pada masukan Anda.",
    step_3_title: "Salin",
    step_3_desc: "Gunakan tombol salin untuk menyalin hasil yang dikonversi ke papan klip.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Sejarah & Pendidikan",
    uc_1_desc: "Pecahkan kode tanggal pada monumen bersejarah, makalah penelitian, dan sastra klasik.",
    uc_2_title: "Arsitektur & Desain",
    uc_2_desc: "Gunakan angka Romawi untuk tampilan jam yang bergaya, penanda tahun bangunan, dan judul bab.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Mengapa ada batas 3999?",
    faq_1_a: "Angka Romawi standar menggunakan M (1000) sebagai simbol terbesar. Meskipun angka yang lebih besar dapat direpresentasikan dengan garis (vinculum), sebagian besar sistem standar dan alat ini fokus pada rentang 1-3999 yang digunakan dalam aplikasi umum.",
    faq_2_q: "Bagaimana cara membaca angka Romawi?",
    faq_2_a: "Simbol biasanya dijumlahkan (XVI = 10+5+1 = 16). Namun, jika simbol yang lebih kecil muncul sebelum yang lebih besar, maka dikurangi (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Konverter Basis Angka",
    see2: "Konverter Panjang",
    see3: "Konverter Unit Penyimpanan",
    see4: "Konverter Suhu",
    f_1: "Konversi angka Arab ke angka Romawi",
    f_2: "Konversi angka Romawi ke angka Arab",
    f_3: "Konversi instan di sisi klien",
    f_4: "Mendukung angka dari 1 hingga 3999"
  }
}
</i18n>
