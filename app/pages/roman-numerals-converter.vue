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
    :wiki-label="'Wikipedia (Roman Numerals)'"
    :see-also-links="[
      { label: t('see1'), to: 'number-base-converter' },
      { label: t('see2'), to: 'length-converter' },
      { label: t('see3'), to: 'storage-unit-converter' },
      { label: t('see4'), to: 'temperature-converter' }
    ]"
  >
    <template #info>
      <div class="space-y-8">
        <p class="mb-4">{{ t('desc') }}</p>

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
    how_to_use_title: "How to use",
    step_1_title: "Enter Value",
    step_1_desc: "Type an Arabic number (e.g. 2024) or a Roman numeral (e.g. MMXXIV).",
    step_2_title: "Convert",
    step_2_desc: "Click 'Convert to Roman' or 'Convert from Roman' depending on your input.",
    step_3_title: "Copy",
    step_3_desc: "Use the copy button to send the converted result to your clipboard.",
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
    how_to_use_title: "Como usar",
    step_1_title: "Inserir Valor",
    step_1_desc: "Digite um número arábico (ex: 2024) ou um numeral romano (ex: MMXXIV).",
    step_2_title: "Converter",
    step_2_desc: "Clique em 'Converter para Romano' ou 'Converter de Romano' dependendo da entrada.",
    step_3_title: "Copiar",
    step_3_desc: "Use o botão de copiar para enviar o resultado convertido à área de transferência.",
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
    how_to_use_title: "Cómo usar",
    step_1_title: "Ingresar Valor",
    step_1_desc: "Escribe un número árabe (ej: 2024) o un número romano (ej: MMXXIV).",
    step_2_title: "Convertir",
    step_2_desc: "Haz clic en 'Convertir a Romano' o 'Convertir de Romano' dependiendo de tu entrada.",
    step_3_title: "Copiar",
    step_3_desc: "Usa el botón de copiar para enviar el resultado convertido al portapapeles.",
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
    how_to_use_title: "Comment utiliser l'outil",
    step_1_title: "Entrer la Valeur",
    step_1_desc: "Tapez un nombre arabe (ex: 2024) ou un chiffre romain (ex: MMXXIV).",
    step_2_title: "Convertir",
    step_2_desc: "Cliquez sur 'Convertir en Romain' ou 'Convertir depuis le Romain' selon votre entrée.",
    step_3_title: "Copier",
    step_3_desc: "Utilisez le bouton de copie pour envoyer le résultat converti dans le presse-papiers.",
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
    how_to_use_title: "Come usare lo strumento",
    step_1_title: "Inserisci Valore",
    step_1_desc: "Digita un numero arabo (es: 2024) o un numero romano (es: MMXXIV).",
    step_2_title: "Converti",
    step_2_desc: "Clicca su 'Converti in Romano' o 'Converti da Romano' a seconda dell'input.",
    step_3_title: "Copia",
    step_3_desc: "Usa il pulsante di copia per inviare il risultato convertito negli appunti.",
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
    how_to_use_title: "Cara menggunakan alat ini",
    step_1_title: "Masukkan Nilai",
    step_1_desc: "Ketik angka Arab (mis: 2024) atau angka Romawi (mis: MMXXIV).",
    step_2_title: "Konversi",
    step_2_desc: "Klik 'Konversi ke Romawi' atau 'Konversi dari Romawi' tergantung pada masukan Anda.",
    step_3_title: "Salin",
    step_3_desc: "Gunakan tombol salin untuk menyalin hasil yang dikonversi ke papan klip.",
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
