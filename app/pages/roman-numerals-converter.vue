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
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') }
  ]
})

useHead({
  title: t('pageTitle'),
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
    id: '/konverter-angka-romawi',
    de: '/roemische-zahlen-konverter',
    nl: '/romeinse-cijfers-converter',
    ru: '/konverter-rimskih-cifr'
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
      { label: t('see3'), to: 'temperature-converter' },
      { label: t('see4'), to: 'time-converter' }
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
    pageTitle: "Roman Numerals Converter — Convert Numbers to Roman Numerals (1 to 3999)",
    meta: "Free Roman numerals converter and translator. Convert numbers to Roman numerals and Roman numerals to numbers instantly — supports values from 1 to 3999, with full chart and rules.",
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
    see1: "Number Base",
    see2: "Length",
    see3: "Temperature",
    see4: "Time",
    f_1: "Convert Arabic numbers to Roman numerals",
    f_2: "Convert Roman numerals to Arabic numbers",
    f_3: "Instant client-side conversion",
    f_4: "Supports numbers from 1 to 3999"
  },
  pt: {
    title: "Conversor de Números Romanos",
    pageTitle: "Conversor de Números Romanos — Converta Algarismos Romanos (1 a 3999) Online",
    meta: "Conversor de números romanos online e gratuito. Converta números arábicos para algarismos romanos e vice-versa instantaneamente — de 1 a 3999, com tabela completa de números romanos.",
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
    see1: "Bases Numéricas",
    see2: "Comprimento",
    see3: "Temperatura",
    see4: "Tempo",
    f_1: "Converta números arábicos para algarismos romanos",
    f_2: "Converta algarismos romanos para números arábicos",
    f_3: "Conversão instantânea no navegador",
    f_4: "Suporte a números de 1 a 3999"
  },
  es: {
    title: "Convertidor de Números Romanos",
    pageTitle: "Convertidor de Números Romanos — Convierte Números a Romanos (del 1 al 3999)",
    meta: "Convertidor de números romanos online y gratis. Convierte números a romanos y de romanos a números al instante — del 1 al 3999, con tabla completa de los números romanos.",
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
    see1: "Bases Numéricas",
    see2: "Longitud",
    see3: "Temperatura",
    see4: "Tiempo",
    f_1: "Convierte números árabes a numerales romanos",
    f_2: "Convierte numerales romanos a números árabes",
    f_3: "Conversión instantánea en el navegador",
    f_4: "Compatible con números del 1 al 3999"
  },
  fr: {
    title: "Convertisseur de Chiffres Romains",
    pageTitle: "Convertisseur de Chiffres Romains — Convertir Nombres en Chiffres Romains (1 à 3999)",
    meta: "Convertisseur de chiffres romains en ligne et gratuit. Convertissez des nombres en chiffres romains et inversement instantanément — de 1 à 3999, avec tableau complet des chiffres romains.",
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
    see1: "Bases Numériques",
    see2: "Longueur",
    see3: "Température",
    see4: "Temps",
    f_1: "Convertissez des nombres arabes en chiffres romains",
    f_2: "Convertissez des chiffres romains en nombres arabes",
    f_3: "Conversion instantanée côté navigateur",
    f_4: "Prend en charge les nombres de 1 à 3999"
  },
  it: {
    title: "Convertitore di Numeri Romani",
    pageTitle: "Convertitore di Numeri Romani — Conversione Numeri Romani (da 1 a 3999) Online",
    meta: "Convertitore di numeri romani online e gratis. Conversione di numeri romani in arabi e viceversa istantaneamente — da 1 a 3999, con tabella completa dei numeri romani.",
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
    see1: "Basi Numeriche",
    see2: "Lunghezza",
    see3: "Temperatura",
    see4: "Tempo",
    f_1: "Converti numeri arabi in cifre romane",
    f_2: "Converti cifre romane in numeri arabi",
    f_3: "Conversione istantanea nel browser",
    f_4: "Supporta numeri da 1 a 3999"
  },
  id: {
    title: "Konverter Angka Romawi",
    pageTitle: "Konverter Angka Romawi — Konversi Angka Romawi 1 sampai 3999 Online",
    meta: "Konverter angka Romawi online dan gratis. Konversi angka biasa ke angka Romawi dan sebaliknya secara instan — dari 1 sampai 3999, lengkap dengan tabel angka Romawi.",
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
    see1: "Basis Angka",
    see2: "Panjang",
    see3: "Suhu",
    see4: "Waktu",
    f_1: "Konversi angka Arab ke angka Romawi",
    f_2: "Konversi angka Romawi ke angka Arab",
    f_3: "Konversi instan di sisi klien",
    f_4: "Mendukung angka dari 1 hingga 3999"
  },
  de: {
    title: "Römische Zahlen Umrechnen",
    pageTitle: "Römische Zahlen umrechnen — Übersetzer & Konverter (1 bis 3999) Online",
    meta: "Kostenloser Online-Konverter und Übersetzer für römische Zahlen. Rechne arabische Zahlen in römische Zahlen um und umgekehrt — von 1 bis 3999, mit vollständiger Tabelle römischer Zahlen.",
    desc: "Mit diesem Tool kannst du römische Zahlen in ihre Entsprechung in arabischen Zahlen umwandeln und umgekehrt. Gib einfach den Wert ein, den du konvertieren möchtest, und klicke auf die Schaltfläche für die gewünschte Umrechnung. Ob für Schüler, Lehrkräfte oder alle, die eine schnelle Umrechnung benötigen, dieses Tool macht es einfach.",
    in: "Wert eingeben (Römisch oder Arabisch)",
    result: "Ergebnis",
    to: "zu",
    from: "von",
    btn_to: "In Römisch umrechnen",
    btn_from: "Aus Römisch umrechnen",
    err: "Der Wert konnte nicht {0} Römisch umgerechnet werden",
    how_it_works_title: "So funktioniert es",
    step_1_title: "Wert eingeben",
    step_1_desc: "Gib eine arabische Zahl (z. B. 2024) oder eine römische Zahl (z. B. MMXXIV) ein.",
    step_2_title: "Umrechnen",
    step_2_desc: "Klicke je nach Eingabe auf 'In Römisch umrechnen' oder 'Aus Römisch umrechnen'.",
    step_3_title: "Kopieren",
    step_3_desc: "Nutze den Kopier-Button, um das umgerechnete Ergebnis in die Zwischenablage zu senden.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Geschichte und Bildung",
    uc_1_desc: "Entschlüssle Daten auf historischen Denkmälern, Forschungsarbeiten und in klassischer Literatur.",
    uc_2_title: "Architektur und Design",
    uc_2_desc: "Verwende römische Zahlen für stilvolle Zifferblätter, Baujahresmarkierungen und Kapitelüberschriften.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Warum gibt es eine Begrenzung auf 3999?",
    faq_1_a: "Standardmäßige römische Zahlen verwenden M (1000) als größtes Symbol. Größere Zahlen können zwar mit Überstrichen dargestellt werden, aber die meisten Standardsysteme und dieses Tool konzentrieren sich auf den Bereich 1 bis 3999, der in typischen Anwendungen verwendet wird.",
    faq_2_q: "Wie lese ich römische Zahlen?",
    faq_2_a: "Symbole werden normalerweise addiert (XVI = 10+5+1 = 16). Wenn jedoch ein kleineres Symbol vor einem größeren steht, wird es subtrahiert (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Zahlenbasen",
    see2: "Länge",
    see3: "Temperatur",
    see4: "Zeit",
    f_1: "Arabische Zahlen in römische Zahlen umrechnen",
    f_2: "Römische Zahlen in arabische Zahlen umrechnen",
    f_3: "Sofortige Umrechnung im Browser",
    f_4: "Unterstützt Zahlen von 1 bis 3999"
  },
  nl: {
    title: "Romeinse cijfers omzetten",
    pageTitle: "Romeinse Cijfers Omzetten — Online Converter (1 t/m 3999)",
    meta: "Gratis online tool om Romeinse cijfers om te zetten. Converteer getallen naar Romeinse cijfers en andersom direct — van 1 t/m 3999, met volledige tabel van Romeinse cijfers.",
    desc: "Met deze tool kun je Romeinse cijfers omzetten naar hun equivalent in Arabische cijfers en andersom. Voer de waarde in die je wilt converteren en klik op de knop voor de gewenste omzetting. Ideaal voor studenten, docenten of iedereen die een snelle berekening nodig heeft.",
    in: "Voer waarde in (Romeins of Arabisch)",
    result: "Resultaat",
    to: "naar",
    from: "van",
    btn_to: "Converteren naar Romeins",
    btn_from: "Converteren van Romeins",
    err: "De waarde kon niet {0} Romeins worden geconverteerd",
    how_it_works_title: "Hoe het werkt",
    step_1_title: "Voer waarde in",
    step_1_desc: "Typ een Arabisch getal (bijv. 2024) of een Romeins cijfer (bijv. MMXXIV) in.",
    step_2_title: "Converteren",
    step_2_desc: "Klik op 'Converteren naar Romeins' of 'Converteren van Romeins' afhankelijk van je invoer.",
    step_3_title: "Kopiëren",
    step_3_desc: "Gebruik de kopieerknop om het geconverteerde resultaat naar je klembord te sturen.",
    use_cases_title: "Gebruiksvoorbeelden",
    uc_1_title: "Geschiedenis en onderwijs",
    uc_1_desc: "Ontcijfer datums op historische monumenten, in onderzoekspapers en klassieke literatuur.",
    uc_2_title: "Architectuur en ontwerp",
    uc_2_desc: "Lees datums van gebouwen, voorbladen van boeken en hoofdstukken die Romeinse cijfers gebruiken.",
    faq_title: "Veelgestelde vragen",
    faq_1_q: "Waarom is er een limiet van 3999?",
    faq_1_a: "Standaard Romeinse cijfers gebruiken M (1000) als grootste symbool. Hoewel grotere getallen kunnen worden weergegeven met een streep (vinculum), richten de meeste standaardsystemen en deze tool zich op het bereik 1-3999 dat in algemene toepassingen wordt gebruikt.",
    faq_2_q: "Hoe lees je Romeinse cijfers?",
    faq_2_a: "Symbolen worden meestal opgeteld (XVI = 10+5+1 = 16). Echter, als een kleiner symbool voor een groter symbool verschijnt, wordt het afgetrokken (IV = 5-1 = 4, IX = 10-1 = 9).",
    see1: "Getalstelsels",
    see2: "Lengte",
    see3: "Temperatuur",
    see4: "Tijd",
    f_1: "Converteer Arabische getallen naar Romeinse cijfers",
    f_2: "Converteer Romeinse cijfers naar Arabische getallen",
    f_3: "Directe conversie in de browser",
    f_4: "Ondersteunt getallen van 1 tot 3999"
  },
  ru: {
    title: "Конвертер римских цифр",
    pageTitle: "Конвертер римских цифр — перевод чисел в римские цифры (от 1 до 3999) | Онлайн",
    meta: "Бесплатный онлайн-переводчик и конвертер римских цифр. Мгновенно переводите арабские числа в римские цифры и наоборот — поддерживает значения от 1 до 3999, содержит таблицы и правила.",
    desc: "С помощью этого инструмента вы можете легко переводить римские цифры в арабские числа и обратно. Просто введите значение, которое хотите преобразовать, и нажмите кнопку нужного направления конвертации. Этот инструмент прост и полезен для школьников, преподавателей и всех, кому требуется быстрый перевод.",
    in: "Введите значение (римское или арабское число)",
    result: "Результат",
    to: "в",
    from: "из",
    btn_to: "Перевести в римские",
    btn_from: "Перевести из римских",
    err: "Не удалось перевести значение {0} римские",
    how_it_works_title: "Как это работает",
    step_1_title: "Введите значение",
    step_1_desc: "Введите арабское число (например, 2024) или римскую цифру (например, MMXXIV).",
    step_2_title: "Сконвертируйте",
    step_2_desc: "Нажмите «Перевести в римские» или «Перевести из римских» в зависимости от исходного значения.",
    step_3_title: "Скопируйте результат",
    step_3_desc: "Используйте кнопку копирования, чтобы сохранить результат перевода в буфер обмена.",
    use_cases_title: "Варианты использования",
    uc_1_title: "История и образование",
    uc_1_desc: "Расшифровка дат на исторических памятниках, в научных работах и классической литературе.",
    uc_2_title: "Архитектура и дизайн",
    uc_2_desc: "Использование римских цифр для оформления циферблатов часов, указания года постройки зданий и заголовков глав книг.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Почему максимальное ограничение составляет 3999?",
    faq_1_a: "В классической римской системе счисления M (1000) является самым большим символом. Хотя более крупные числа можно записывать с горизонтальной чертой над ними (vinculum), большинство стандартных систем и данный конвертер ориентированы на диапазон от 1 до 3999, который покрывает практически все повседневные нужды.",
    faq_2_q: "Как правильно читать римские цифры?",
    faq_2_a: "В большинстве случаев значения символов складываются (например, XVI = 10 + 5 + 1 = 16). Однако, если меньшая цифра стоит перед большей, она вычитается (например, IV = 5 - 1 = 4, IX = 10 - 1 = 9).",
    see1: "Системы счисления",
    see2: "Длина",
    see3: "Температура",
    see4: "Время",
    f_1: "Перевод арабских чисел в римские цифры",
    f_2: "Перевод римских цифр в арабские числа",
    f_3: "Мгновенные расчеты на стороне клиента",
    f_4: "Поддержка чисел в диапазоне от 1 до 3999"
  }
}
</i18n>
