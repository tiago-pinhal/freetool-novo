<script setup lang="ts">
useScript('https://unpkg.com/papaparse@5.4.1/papaparse.min.js', {
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
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') }
  ]
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

// Tool State
const state = reactive({
  hasCode: false,
  loaded: false,
  error: '' as string,
  ads: false,
  resetable: false,
  lang: 'text' as string,
  options: {
    header: true,
    dynamicTyping: true,
    delimiter: ','
  }
})

const editor = ref<any>(null)

function onChange() {
  state.hasCode = editor.value!.getValue() !== ''
  state.error = ''
}

function convertOrReset() {
  state.error = ''
  state.resetable ? reset() : convert()
}

function convert() {
  const Papa = (window as any).Papa
  if (!Papa) {
    document.location.reload()
    return
  }

  try {
    const text = editor.value!.getValue().trim()
    if (text === '') return

    const result = Papa.parse(text, state.options)

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message)
    }

    editor.value!.setValue(JSON.stringify(result.data, null, '\t'))
    editor.value!.setMode('json')
    editor.value!.setReadOnly(true)
    state.lang = 'json'
    state.resetable = true
    state.ads = true
  } catch (e: any) {
    state.error = `${t('err')}: ${e.message}`
  }
}

function reset() {
  editor.value!.setValue('')
  editor.value!.setMode('text')
  editor.value!.setReadOnly(false)
  state.lang = 'text'
  state.resetable = false
  state.hasCode = false
  state.error = ''
}

function copy() {
  navigator.clipboard.writeText(editor.value!.getValue())
}

// Localized Routes
defineI18nRoute({
  paths: {
    en: '/csv-to-json-converter',
    pt: '/conversor-de-csv-para-json',
    es: '/convertidor-de-csv-a-json',
    fr: '/convertisseur-de-csv-en-json',
    it: '/convertitore-da-csv-a-json',
    id: '/konverter-csv-ke-json',
    de: '/csv-zu-json-konverter',
    nl: '/csv-naar-json-converter',
    ru: '/konverter-csv-v-json'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Comma-separated_values`"
    wiki-label="CSV"
    :see-also-links="[
      { label: t('see1'), to: 'json-to-csv-converter' },
      { label: t('see2'), to: 'xml-to-json-converter' },
      { label: t('see3'), to: 'json-to-xml-converter' },
      { label: t('see4'), to: 'json-viewer' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Loading Placeholder -->
      <div
        v-if="!state.loaded"
        role="status"
        class="flex items-center justify-center h-64 w-full rounded-2xl animate-pulse bg-base-200"
      >
        <Icon name="heroicons:table-cells" class="w-12 h-12 text-base-content/10" />
      </div>

      <!-- Editor Component -->
      <Editor
        v-show="state.loaded"
        ref="editor"
        :lang="state.lang"
        :placeholder="t('plc')"
        @onLoad="state.loaded = true"
        @onChange="onChange"
      />

      <!-- Parse Options -->
      <div class="flex flex-col sm:flex-row gap-6 flex-wrap">
        <!-- Header checkbox -->
        <div class="form-control w-fit">
          <label class="label cursor-pointer gap-3">
            <input
              id="chk-header"
              type="checkbox"
              v-model="state.options.header"
              :disabled="state.resetable"
              class="checkbox checkbox-primary"
            />
            <span class="label-text">{{ t('header') }}</span>
          </label>
        </div>

        <!-- Delimiter select -->
        <div class="form-control w-fit">
          <label class="label gap-3">
            <span class="label-text">{{ t('delimiter') }}</span>
            <select
              id="delimiter"
              v-model="state.options.delimiter"
              :disabled="state.resetable"
              class="select select-sm select-bordered"
            >
              <option value=",">{{ t('comma') }}</option>
              <option value=";">{{ t('semicolon') }}</option>
              <option value="|">{{ t('pipe') }}</option>
              <option value="&#9;">{{ t('tab') }}</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <ButtonPrimary
          @click="convertOrReset"
          :icon="state.resetable ? 'heroicons:arrow-path-20-solid' : 'heroicons:arrow-right-circle-20-solid'"
          :disabled="!state.hasCode && !state.resetable"
          :class="state.resetable ? 'btn-warning' : ''"
          class="w-full sm:w-auto"
        >
          {{ t(state.resetable ? 'rst' : 'bt') }}
        </ButtonPrimary>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <ButtonIndicator
            v-if="state.resetable"
            @onClick="copy"
            class="w-full sm:w-auto"
          >
            {{ t('copy') }} JSON
          </ButtonIndicator>
        </Transition>
      </div>

      <!-- Error Message -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div
          v-if="state.error && state.hasCode"
          class="alert alert-error shadow-lg border-none rounded-2xl text-white flex-col items-start gap-1"
        >
          <div class="flex items-center gap-2">
            <Icon name="heroicons:x-circle-20-solid" class="w-6 h-6" />
            <span class="font-bold">{{ t('err_label') }}</span>
          </div>
          <div class="text-sm opacity-90 font-mono bg-black/20 p-2 rounded-lg w-full mt-1">
            {{ state.error }}
          </div>
        </div>
      </Transition>
    </div>

    <!-- Info Section Content -->
    <template #info>
      <div class="space-y-8">
        <div>
          <p>{{ t('d1') }}</p>
          <p>{{ t('d2') }}</p>
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
            { title: t('hiw_1_title'), description: t('hiw_1_desc') },
            { title: t('hiw_2_title'), description: t('hiw_2_desc') },
            { title: t('hiw_3_title'), description: t('hiw_3_desc') }
          ]"
        />

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    m_title: "CSV to JSON Converter Online - Free and Instant",
    title: "CSV to JSON Converter",
    meta: "Convert CSV to JSON online for free. Paste your CSV and get clean, formatted JSON with automatic type detection and custom delimiter support.",
    d1: "This tool parses your CSV text and maps each row to its JSON equivalent. Headers become object keys and rows become objects in a JSON array, preserving the original data hierarchy.",
    d2: "Converting CSV to JSON is especially useful when integrating tabular data into web applications, migrating legacy database exports, or consuming REST APIs that expect JSON payloads.",
    bt: "Convert",
    rst: "Start Over",
    copy: "Copy",
    plc: "Insert the CSV text here or drag a file",
    header: "First row is header",
    delimiter: "Delimiter:",
    comma: "Comma",
    semicolon: "Semicolon",
    pipe: "Pipe",
    tab: "Tab",
    err: "Error",
    err_label: "Parse Error",
    how_it_works_title: "How It Works",
    hiw_1_title: "Paste Your CSV",
    hiw_1_desc: "Paste or drag your CSV file into the editor. Enable the header option if the first row contains column names.",
    hiw_2_title: "Configure Options",
    hiw_2_desc: "Select the correct delimiter for your file and whether the first row is a header row.",
    hiw_3_title: "Copy the JSON",
    hiw_3_desc: "Hit Convert and the tool generates a clean JSON array instantly. Click Copy JSON to grab it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "Data Migration",
    uc_1_desc: "Convert legacy database exports and spreadsheet files into JSON to load into modern NoSQL databases.",
    uc_2_title: "API Integration",
    uc_2_desc: "Transform spreadsheet datasets into JSON payloads ready to be sent to REST API endpoints.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is my CSV data sent to a server?",
    faq_1_a: "No. The conversion runs entirely inside your browser. Your data never leaves your device.",
    faq_2_q: "Can I use a delimiter other than comma?",
    faq_2_a: "Yes. You can select commas, semicolons, pipe symbols, or tabs to match your file's export format.",
    faq_3_q: "Does it detect numbers and booleans automatically?",
    faq_3_a: "Yes. The parser automatically detects integers, floats, and true/false values and represents them without quotes in the JSON output.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "JSON Viewer",
    f_1: "Instant CSV to JSON conversion",
    f_2: "Custom delimiter support",
    f_3: "Automatic data type detection",
    f_4: "No registration or installation required"
  },
  pt: {
    m_title: "Conversor de CSV para JSON Online - Gratuito e Instantâneo",
    title: "Conversor de CSV para JSON",
    meta: "Converta CSV para JSON online e gratuitamente. Cole seu CSV e obtenha um JSON limpo e formatado com detecção automática de tipos e suporte a delimitadores personalizados.",
    d1: "Esta ferramenta analisa o seu arquivo CSV e mapeia cada linha para o equivalente em JSON. Os cabeçalhos se tornam chaves de objeto e as linhas viram objetos num array JSON, preservando a estrutura original dos dados.",
    d2: "Converter CSV para JSON é especialmente útil ao integrar dados tabulares em sistemas web, migrar exportações de bancos de dados legados ou consumir APIs REST que esperam payloads em JSON.",
    bt: "Converter",
    rst: "Recomeçar",
    copy: "Copiar",
    plc: "Insira o texto CSV aqui ou arraste um arquivo",
    header: "Primeira linha é o cabeçalho",
    delimiter: "Separador:",
    comma: "Vírgula",
    semicolon: "Ponto e Vírgula",
    pipe: "Barra vertical",
    tab: "Tabulação",
    err: "Erro",
    err_label: "Erro de Análise",
    how_it_works_title: "Como Funciona",
    hiw_1_title: "Cole o seu CSV",
    hiw_1_desc: "Cole ou arraste o arquivo CSV no editor. Ative a opção de cabeçalho se a primeira linha contiver os nomes das colunas.",
    hiw_2_title: "Configure as Opções",
    hiw_2_desc: "Selecione o separador correto para o seu arquivo e indique se a primeira linha é o cabeçalho.",
    hiw_3_title: "Copie o JSON",
    hiw_3_desc: "Clique em Converter e a ferramenta gera um array JSON limpo instantaneamente. Clique em Copiar JSON para copiá-lo.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Migração de Dados",
    uc_1_desc: "Converta exportações de bancos de dados e planilhas em JSON para carregar em bancos NoSQL modernos.",
    uc_2_title: "Integração de APIs",
    uc_2_desc: "Transforme datasets de planilhas em payloads JSON prontos para enviar a endpoints de APIs REST.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O meu CSV é enviado para algum servidor?",
    faq_1_a: "Não. A conversão é feita inteiramente no seu navegador. Os seus dados nunca saem do seu dispositivo.",
    faq_2_q: "Posso usar outro separador em vez de vírgula?",
    faq_2_a: "Sim. Você pode selecionar vírgula, ponto e vírgula, barra vertical ou tabulação para corresponder ao formato do seu arquivo.",
    faq_3_q: "A ferramenta detecta números e booleanos automaticamente?",
    faq_3_a: "Sim. O parser detecta automaticamente inteiros, decimais e valores verdadeiro/falso e os representa sem aspas no JSON resultante.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visualizador de JSON",
    f_1: "Conversão instantânea de CSV para JSON",
    f_2: "Suporte a delimitadores personalizados",
    f_3: "Detecção automática de tipos de dados",
    f_4: "Sem necessidade de cadastro ou instalação"
  },
  es: {
    m_title: "Convertidor de CSV a JSON Online - Gratis e Instantáneo",
    title: "Convertidor de CSV a JSON",
    meta: "Convierte CSV a JSON online y gratis. Pega tu CSV y obtén un JSON limpio y formateado con detección automática de tipos y soporte de delimitadores personalizados.",
    d1: "Esta herramienta analiza tu texto CSV y mapea cada fila a su equivalente en JSON. Los encabezados se convierten en claves de objeto y las filas en objetos dentro de un array JSON, preservando la estructura original de los datos.",
    d2: "Convertir CSV a JSON es especialmente útil al integrar datos tabulares en aplicaciones web, migrar exportaciones de bases de datos heredadas o consumir APIs REST que esperan payloads en JSON.",
    bt: "Convertir",
    rst: "Recomenzar",
    copy: "Copiar",
    plc: "Introduce el texto CSV aquí o arrastra un archivo",
    header: "La primera fila es de encabezados",
    delimiter: "Separador:",
    comma: "Coma",
    semicolon: "Punto y Coma",
    pipe: "Barra vertical",
    tab: "Tabulador",
    err: "Error",
    err_label: "Error de Análisis",
    how_it_works_title: "Cómo Funciona",
    hiw_1_title: "Pega tu CSV",
    hiw_1_desc: "Pega o arrastra tu archivo CSV en el editor. Activa la opción de encabezado si la primera fila contiene los nombres de las columnas.",
    hiw_2_title: "Configura las Opciones",
    hiw_2_desc: "Selecciona el separador correcto para tu archivo e indica si la primera fila es un encabezado.",
    hiw_3_title: "Copia el JSON",
    hiw_3_desc: "Haz clic en Convertir y la herramienta genera un array JSON limpio al instante. Haz clic en Copiar JSON para copiarlo.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Migración de Datos",
    uc_1_desc: "Convierte exportaciones de bases de datos y hojas de cálculo en JSON para cargar en bases de datos NoSQL modernas.",
    uc_2_title: "Integración de APIs",
    uc_2_desc: "Transforma datasets de hojas de cálculo en payloads JSON listos para enviar a endpoints de APIs REST.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mi CSV se envía a algún servidor?",
    faq_1_a: "No. La conversión se realiza completamente en tu navegador. Tus datos nunca salen de tu dispositivo.",
    faq_2_q: "¿Puedo usar otro separador en lugar de la coma?",
    faq_2_a: "Sí. Puedes seleccionar coma, punto y coma, barra vertical o tabulador para que coincida con el formato de tu archivo.",
    faq_3_q: "¿La herramienta detecta números y booleanos automáticamente?",
    faq_3_a: "Sí. El parser detecta automáticamente enteros, decimales y valores verdadero/falso y los representa sin comillas en el JSON resultante.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visor de JSON",
    f_1: "Conversión instantánea de CSV a JSON",
    f_2: "Soporte de delimitadores personalizados",
    f_3: "Detección automática de tipos de datos",
    f_4: "Sin necesidad de registro ni instalación"
  },
  fr: {
    m_title: "Convertisseur CSV en JSON en Ligne - Gratuit et Instantané",
    title: "Convertisseur CSV en JSON",
    meta: "Convertissez CSV en JSON en ligne et gratuitement. Collez votre CSV et obtenez un JSON propre et formaté avec détection automatique des types et support de délimiteurs personnalisés.",
    d1: "Cet outil analyse votre texte CSV et associe chaque ligne à son équivalent JSON. Les en-têtes deviennent des clés d'objet et les lignes deviennent des objets dans un tableau JSON, en préservant la structure originale des données.",
    d2: "Convertir du CSV en JSON est particulièrement utile lors de l'intégration de données tabulaires dans des applications web, de la migration d'exports de bases de données ou de la consommation d'API REST attendant des payloads JSON.",
    bt: "Convertir",
    rst: "Recommencer",
    copy: "Copier",
    plc: "Insérez le texte CSV ici ou faites glisser un fichier",
    header: "La première ligne est l'en-tête",
    delimiter: "Séparateur:",
    comma: "Virgule",
    semicolon: "Point-virgule",
    pipe: "Barre verticale",
    tab: "Tabulation",
    err: "Erreur",
    err_label: "Erreur d'Analyse",
    how_it_works_title: "Comment Ça Marche",
    hiw_1_title: "Collez votre CSV",
    hiw_1_desc: "Collez ou faites glisser votre fichier CSV dans l'éditeur. Activez l'option en-tête si la première ligne contient les noms des colonnes.",
    hiw_2_title: "Configurez les Options",
    hiw_2_desc: "Sélectionnez le séparateur correct pour votre fichier et indiquez si la première ligne est un en-tête.",
    hiw_3_title: "Copiez le JSON",
    hiw_3_desc: "Cliquez sur Convertir et l'outil génère un tableau JSON propre instantanément. Cliquez sur Copier JSON pour le copier.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Migration de Données",
    uc_1_desc: "Convertissez des exports de bases de données et des feuilles de calcul en JSON pour les charger dans des bases NoSQL modernes.",
    uc_2_title: "Intégration d'API",
    uc_2_desc: "Transformez des jeux de données tabulaires en payloads JSON prêts à être envoyés à des endpoints d'API REST.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Mon CSV est-il envoyé à un serveur ?",
    faq_1_a: "Non. La conversion s'effectue entièrement dans votre navigateur. Vos données ne quittent jamais votre appareil.",
    faq_2_q: "Puis-je utiliser un séparateur autre que la virgule ?",
    faq_2_a: "Oui. Vous pouvez sélectionner virgule, point-virgule, barre verticale ou tabulation pour correspondre au format de votre fichier.",
    faq_3_q: "L'outil détecte-t-il les nombres et les booléens automatiquement ?",
    faq_3_a: "Oui. Le parser détecte automatiquement les entiers, les décimaux et les valeurs vrai/faux et les représente sans guillemets dans le JSON résultant.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visionneuse JSON",
    f_1: "Conversion instantanée de CSV en JSON",
    f_2: "Support de délimiteurs personnalisés",
    f_3: "Détection automatique des types de données",
    f_4: "Aucune inscription ou installation requise"
  },
  it: {
    m_title: "Convertitore CSV in JSON Online - Gratuito e Istantaneo",
    title: "Convertitore CSV in JSON",
    meta: "Converti CSV in JSON online e gratuitamente. Incolla il tuo CSV e ottieni un JSON pulito e formattato con rilevamento automatico dei tipi e supporto per delimitatori personalizzati.",
    d1: "Questo strumento analizza il tuo testo CSV e mappa ogni riga al suo equivalente JSON. Le intestazioni diventano chiavi di oggetto e le righe diventano oggetti all'interno di un array JSON, preservando la struttura originale dei dati.",
    d2: "Convertire CSV in JSON è particolarmente utile quando si integrano dati tabulari in applicazioni web, si migrano export di database legacy o si consumano API REST che si aspettano payload JSON.",
    bt: "Converti",
    rst: "Ricomincia",
    copy: "Copia",
    plc: "Inserisci il testo CSV qui o trascina un file",
    header: "La prima riga è l'intestazione",
    delimiter: "Separatore:",
    comma: "Virgola",
    semicolon: "Punto e Virgola",
    pipe: "Barra verticale",
    tab: "Tabulazione",
    err: "Errore",
    err_label: "Errore di Analisi",
    how_it_works_title: "Come Funziona",
    hiw_1_title: "Incolla il tuo CSV",
    hiw_1_desc: "Incolla o trascina il tuo file CSV nell'editor. Attiva l'opzione intestazione se la prima riga contiene i nomi delle colonne.",
    hiw_2_title: "Configura le Opzioni",
    hiw_2_desc: "Seleziona il separatore corretto per il tuo file e indica se la prima riga è un'intestazione.",
    hiw_3_title: "Copia il JSON",
    hiw_3_desc: "Premi Converti e lo strumento genera un array JSON pulito all'istante. Clicca Copia JSON per copiarlo.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Migrazione di Dati",
    uc_1_desc: "Converti export di database e file di fogli di calcolo in JSON per caricarli in database NoSQL moderni.",
    uc_2_title: "Integrazione di API",
    uc_2_desc: "Trasforma dataset tabulari in payload JSON pronti per essere inviati a endpoint di API REST.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Il mio CSV viene inviato a un server?",
    faq_1_a: "No. La conversione avviene interamente nel tuo browser. I tuoi dati non lasciano mai il tuo dispositivo.",
    faq_2_q: "Posso usare un separatore diverso dalla virgola?",
    faq_2_a: "Sì. Puoi selezionare virgola, punto e virgola, barra verticale o tabulazione per corrispondere al formato del tuo file.",
    faq_3_q: "Lo strumento rileva numeri e booleani automaticamente?",
    faq_3_a: "Sì. Il parser rileva automaticamente interi, decimali e valori vero/falso e li rappresenta senza virgolette nel JSON risultante.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visualizzatore JSON",
    f_1: "Conversione istantanea da CSV a JSON",
    f_2: "Supporto per delimitatori personalizzati",
    f_3: "Rilevamento automatico dei tipi di dati",
    f_4: "Nessuna registrazione o installazione richiesta"
  },
  id: {
    m_title: "Konverter CSV ke JSON Online - Gratis dan Instan",
    title: "Konverter CSV ke JSON",
    meta: "Konversi CSV ke JSON online dan gratis. Tempel CSV Anda dan dapatkan JSON yang bersih dan terformat dengan deteksi jenis otomatis dan dukungan pemisah kustom.",
    d1: "Alat ini mengurai teks CSV Anda dan memetakan setiap baris ke padanannya dalam JSON. Tajuk menjadi kunci objek dan baris menjadi objek dalam array JSON, sehingga struktur data asli tetap terjaga.",
    d2: "Mengonversi CSV ke JSON sangat berguna saat mengintegrasikan data tabular ke aplikasi web, memindahkan ekspor basis data lama, atau menggunakan REST API yang mengharapkan payload JSON.",
    bt: "Konversi",
    rst: "Mulai Ulang",
    copy: "Salin",
    plc: "Masukkan teks CSV di sini atau seret file",
    header: "Baris pertama adalah tajuk",
    delimiter: "Pemisah:",
    comma: "Koma",
    semicolon: "Titik koma",
    pipe: "Pipa",
    tab: "Tab",
    err: "Kesalahan",
    err_label: "Kesalahan Penguraian",
    how_it_works_title: "Cara Kerja",
    hiw_1_title: "Tempel CSV Anda",
    hiw_1_desc: "Tempel atau seret file CSV ke editor. Aktifkan opsi tajuk jika baris pertama berisi nama kolom.",
    hiw_2_title: "Atur Opsi",
    hiw_2_desc: "Pilih pemisah yang sesuai untuk file Anda dan tentukan apakah baris pertama adalah tajuk.",
    hiw_3_title: "Salin JSON",
    hiw_3_desc: "Tekan Konversi dan alat menghasilkan array JSON yang bersih secara instan. Klik Salin JSON untuk menyalinnya.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Migrasi Data",
    uc_1_desc: "Konversi ekspor basis data dan file spreadsheet ke JSON untuk dimuat ke basis data NoSQL modern.",
    uc_2_title: "Integrasi API",
    uc_2_desc: "Ubah dataset tabular menjadi payload JSON yang siap dikirim ke endpoint REST API.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah data CSV saya dikirim ke server?",
    faq_1_a: "Tidak. Konversi dilakukan sepenuhnya di browser Anda. Data Anda tidak pernah meninggalkan perangkat Anda.",
    faq_2_q: "Bisakah saya menggunakan pemisah selain koma?",
    faq_2_a: "Ya. Anda dapat memilih koma, titik koma, simbol pipa, atau tab sesuai format ekspor file Anda.",
    faq_3_q: "Apakah alat mendeteksi angka dan boolean secara otomatis?",
    faq_3_a: "Ya. Parser secara otomatis mendeteksi bilangan bulat, desimal, dan nilai benar/salah dan merepresentasikannya tanpa tanda kutip dalam output JSON.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Penampil JSON",
    f_1: "Konversi instan dari CSV ke JSON",
    f_2: "Dukungan pemisah kustom",
    f_3: "Deteksi jenis data otomatis",
    f_4: "Tanpa pendaftaran atau instalasi"
  },
  de: {
    m_title: "CSV in JSON umwandeln — Kostenlos Online",
    title: "CSV-zu-JSON-Konverter",
    meta: "CSV in JSON umwandeln — kostenlos und direkt im Browser. CSV-Text einfügen und sofort sauberes JSON erhalten, mit automatischer Typerkennung und wählbarem Trennzeichen.",
    d1: "Dieses Tool analysiert deinen CSV-Text und ordnet jede Zeile ihrem JSON-Äquivalent zu. Kopfzeilen werden zu Objektschlüsseln und Zeilen zu Objekten in einem JSON-Array, wobei die ursprüngliche Datenstruktur erhalten bleibt.",
    d2: "Die Konvertierung von CSV in JSON ist besonders nützlich, wenn tabellarische Daten in Webanwendungen integriert, Exporte aus Altsystemen migriert oder REST-APIs verwendet werden sollen, die JSON-Payloads erwarten.",
    bt: "Konvertieren",
    rst: "Neu beginnen",
    copy: "Kopieren",
    plc: "Füge hier den CSV-Text ein oder ziehe eine Datei hinein",
    header: "Erste Zeile ist die Kopfzeile",
    delimiter: "Trennzeichen:",
    comma: "Komma",
    semicolon: "Semikolon",
    pipe: "Pipe",
    tab: "Tabulator",
    err: "Fehler",
    err_label: "Parsing-Fehler",
    how_it_works_title: "So funktioniert es",
    hiw_1_title: "CSV einfügen",
    hiw_1_desc: "Füge deine CSV-Datei in den Editor ein oder ziehe sie hinein. Aktiviere die Kopfzeilen-Option, wenn die erste Zeile Spaltennamen enthält.",
    hiw_2_title: "Optionen konfigurieren",
    hiw_2_desc: "Wähle das richtige Trennzeichen für deine Datei und gib an, ob die erste Zeile eine Kopfzeile ist.",
    hiw_3_title: "JSON kopieren",
    hiw_3_desc: "Klicke auf Konvertieren und das Tool erzeugt sofort ein sauberes JSON-Array. Klicke auf JSON kopieren, um es in die Zwischenablage zu übernehmen.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Datenmigration",
    uc_1_desc: "Konvertiere Exporte aus Altdatenbanken und Tabellenkalkulationen in JSON, um sie in moderne NoSQL-Datenbanken zu laden.",
    uc_2_title: "API-Integration",
    uc_2_desc: "Wandle Tabellenkalkulationsdaten in JSON-Payloads um, die direkt an REST-API-Endpunkte gesendet werden können.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Werden meine CSV-Daten an einen Server gesendet?",
    faq_1_a: "Nein. Die Konvertierung läuft vollständig in deinem Browser. Deine Daten verlassen dein Gerät niemals.",
    faq_2_q: "Kann ich ein anderes Trennzeichen als das Komma verwenden?",
    faq_2_a: "Ja. Du kannst Kommas, Semikolons, Pipe-Symbole oder Tabulatoren auswählen, damit das Format zu deinem Datei-Export passt.",
    faq_3_q: "Erkennt das Tool Zahlen und Boolesche Werte automatisch?",
    faq_3_a: "Ja. Der Parser erkennt automatisch Ganzzahlen, Dezimalzahlen und Wahr/Falsch-Werte und stellt sie im JSON-Ergebnis ohne Anführungszeichen dar.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "JSON-Betrachter",
    f_1: "Sofortige CSV-zu-JSON-Konvertierung",
    f_2: "Unterstützung für benutzerdefinierte Trennzeichen",
    f_3: "Automatische Erkennung von Datentypen",
    f_4: "Keine Registrierung oder Installation erforderlich"
  },
  nl: {
    m_title: "CSV naar JSON Converter Online - Gratis en Direct",
    title: "CSV naar JSON Converter",
    meta: "Gratis online CSV naar JSON converter. Plak je CSV en krijg schone, geformatteerde JSON met automatische type-detectie en ondersteuning voor aangepaste scheidingstekens.",
    d1: "Deze tool analyseert je CSV-tekst en zet elke rij om naar het JSON-equivalent. Kolomkoppen worden object keys en rijen worden objecten in een JSON-array, waarbij de oorspronkelijke datastructuur behouden blijft.",
    d2: "Het converteren van CSV naar JSON is vooral nuttig bij het integreren van tabelgegevens in webapplicaties, het migreren van exports uit oude databases of het aanroepen van REST API's die JSON-payloads verwachten.",
    bt: "Converteren",
    rst: "Opnieuw beginnen",
    copy: "Kopiëren",
    plc: "Plak hier de CSV-tekst of sleep een bestand hiernaartoe",
    header: "Eerste rij is koptekst",
    delimiter: "Scheidingsteken:",
    comma: "Komma",
    semicolon: "Puntkomma",
    pipe: "Pipe (|)",
    tab: "Tab",
    err: "Fout",
    err_label: "Analysefout",
    how_it_works_title: "Hoe het werkt",
    hiw_1_title: "Plak je CSV",
    hiw_1_desc: "Plak of sleep je CSV-bestand in de editor. Schakel de koptekst-optie in als de eerste rij kolomnamen bevat.",
    hiw_2_title: "Configureer opties",
    hiw_2_desc: "Selecteer het juiste scheidingsteken voor je bestand en geef aan of de eerste rij een koptekst is.",
    hiw_3_title: "Kopieer de JSON",
    hiw_3_desc: "Klik op Converteren en de tool genereert direct een schone JSON-array. Klik op Kopiëren om de JSON naar je klembord te kopiëren.",
    use_cases_title: "Gebruiksvoorbeelden",
    uc_1_title: "Datamigratie",
    uc_1_desc: "Converteer exports uit oude databases en spreadsheetbestanden naar JSON om ze in moderne NoSQL-databases te laden.",
    uc_2_title: "API-integratie",
    uc_2_desc: "Transformeer tabelgegevens uit spreadsheets naar JSON-payloads die klaar zijn om naar REST API-endpoints te worden verzonden.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Worden mijn CSV-gegevens naar een server verzonden?",
    faq_1_a: "Nee. De conversie draait volledig in je browser. Je gegevens verlaten je apparaat nooit.",
    faq_2_q: "Kan ik een ander scheidingsteken dan een komma gebruiken?",
    faq_2_a: "Ja. Je kunt kiezen tussen komma's, puntkomma's, pipe-symbolen of tabs, passend bij het exportformaat van je bestand.",
    faq_3_q: "Detecteert het automatisch getallen en booleans?",
    faq_3_a: "Ja. De parser detecteert automatisch integers, floats en true/false waarden en geeft deze zonder aanhalingstekens weer in de JSON-output.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "JSON Viewer",
    f_1: "Directe CSV naar JSON conversie",
    f_2: "Ondersteuning voor aangepaste scheidingstekens",
    f_3: "Automatische datatypedetectie",
    f_4: "Geen registratie of installatie vereist"
  },
  ru: {
    m_title: "Конвертер CSV в JSON онлайн — бесплатно и мгновенно",
    title: "Конвертер CSV в JSON",
    meta: "Конвертируйте CSV в JSON онлайн бесплатно. Вставьте CSV и получите чистый отформатированный JSON с автоопределением типов данных и поддержкой пользовательских разделителей.",
    d1: "Этот инструмент разбирает ваш текст CSV и преобразует каждую строку в соответствующий объект JSON. Заголовки столбцов становятся ключами объектов, а строки — объектами в массиве JSON, сохраняя исходную иерархию данных.",
    d2: "Конвертация CSV в JSON особенно полезна при интеграции табличных данных в веб-приложения, миграции экспортированных файлов из устаревших баз данных или отправке данных в REST API, ожидающие формат JSON.",
    bt: "Конвертировать",
    rst: "Начать заново",
    copy: "Копировать",
    plc: "Вставьте текст CSV сюда или перетащите файл",
    header: "Первая строка — заголовок",
    delimiter: "Разделитель:",
    comma: "Запятая",
    semicolon: "Точка с запятой",
    pipe: "Вертикальная черта (Pipe)",
    tab: "Табуляция",
    err: "Ошибка",
    err_label: "Ошибка парсинга",
    how_it_works_title: "Как это работает",
    hiw_1_title: "Вставьте CSV",
    hiw_1_desc: "Вставьте или перетащите файл CSV в редактор. Включите опцию заголовка, если первая строка содержит имена столбцов.",
    hiw_2_title: "Настройте параметры",
    hiw_2_desc: "Выберите разделитель, используемый в вашем файле, и укажите, является ли первая строка строкой заголовков.",
    hiw_3_title: "Скопируйте JSON",
    hiw_3_desc: "Нажмите «Конвертировать», чтобы мгновенно получить чистый массив JSON. Нажмите кнопку «Копировать», чтобы скопировать его в буфер обмена.",
    use_cases_title: "Варианты использования",
    uc_1_title: "Миграция данных",
    uc_1_desc: "Конвертируйте экспортированные файлы из старых баз данных и электронных таблиц в JSON для последующей загрузки в современные базы данных NoSQL.",
    uc_2_title: "Интеграция с API",
    uc_2_desc: "Преобразуйте табличные наборы данных в полезную нагрузку (payload) JSON для отправки на конечные точки REST API.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Отправляются ли мои данные CSV на сервер?",
    faq_1_a: "Нет. Конвертация выполняется полностью внутри вашего браузера. Ваши данные никогда не покинут ваше устройство.",
    faq_2_q: "Могу ли я использовать разделитель, отличный от запятой?",
    faq_2_a: "Да. Вы можете выбрать запятую, точку с запятой, вертикальную черту или табуляцию в соответствии с форматом экспорта вашего файла.",
    faq_3_q: "Определяет ли инструмент числа и логические (boolean) значения автоматически?",
    faq_3_a: "Да. Парсер автоматически распознает целые числа, числа с плавающей запятой и логические значения true/false и выводит их в JSON без кавычек.",
    see1: "JSON → CSV",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "JSON Viewer",
    f_1: "Мгновенная конвертация CSV в JSON",
    f_2: "Поддержка пользовательских разделителей",
    f_3: "Автоматическое определение типов данных",
    f_4: "Не требуется регистрация или установка"
  }
}
</i18n>
