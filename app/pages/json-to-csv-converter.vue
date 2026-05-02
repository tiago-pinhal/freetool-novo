<script setup lang="ts">
useScript('https://unpkg.com/papaparse@5.5.3/papaparse.min.js', {
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
    { name: t('hiw_1_title'), text: t('hiw_1_desc') },
    { name: t('hiw_2_title'), text: t('hiw_2_desc') },
    { name: t('hiw_3_title'), text: t('hiw_3_desc') }
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
  lang: 'json' as string,
  options: {
    header: true,
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
  if (!Papa) return

  try {
    const text = editor.value!.getValue().trim()
    if (text === '') return

    const data = JSON.parse(text)
    const result = Papa.unparse(data, {
      delimiter: state.options.delimiter,
      header: state.options.header
    })

    editor.value!.setValue(result)
    editor.value!.setMode('text')
    editor.value!.setReadOnly(true)
    state.lang = 'text'
    state.resetable = true
    state.ads = true
  } catch (e: any) {
    state.error = `${t('err')}: ${e.message}`
  }
}

function reset() {
  editor.value!.setValue('')
  editor.value!.setMode('json')
  editor.value!.setReadOnly(false)
  state.lang = 'json'
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
    en: '/json-to-csv-converter',
    pt: '/conversor-de-json-para-csv',
    es: '/convertidor-de-json-a-csv',
    fr: '/convertisseur-de-json-en-csv',
    it: '/convertitore-da-json-a-csv',
    id: '/konverter-json-ke-csv',
    de: '/json-zu-csv-konverter',
    nl: '/json-naar-csv-converter'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/JSON`"
    wiki-label="JSON"
    :see-also-links="[
      { label: t('see1'), to: 'csv-to-json-converter' },
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
        <Icon name="heroicons:code-bracket-square" class="w-12 h-12 text-base-content/10" />
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

      <!-- Options -->
      <div class="flex flex-col sm:flex-row gap-6 flex-wrap">
        <!-- Header checkbox -->
        <div class="form-control w-fit">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              id="chk-header"
              type="checkbox"
              v-model="state.options.header"
              :disabled="state.resetable"
              class="toggle toggle-primary"
            />
            <span class="label-text font-medium">{{ t('header') }}</span>
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
            {{ t('copy') }} CSV
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
            `${t('uc_1_title')}: ${t('uc_1_desc')}`,
            `${t('uc_2_title')}: ${t('uc_2_desc')}`
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
    m_title: "JSON to CSV Converter Online - Free and Instant",
    title: "JSON to CSV Converter",
    meta: "Convert JSON to CSV online for free. Instantly transform JSON array objects into tabular formats suitable for spreadsheet software like Excel.",
    d1: "This tool transforms a list of JSON-formatted data into a simple table (CSV), making it easier to view and use in spreadsheets. Object keys become header columns, while their values populate the rows below.",
    d2: "Converting JSON to CSV is incredibly useful for exporting API responses into Excel files, migrating databases back to legacy reporting systems, or preparing raw data files for business teams.",
    bt: "Convert",
    rst: "Start Over",
    copy: "Copy",
    plc: "Insert the JSON code here or drag a file",
    header: "Include header on first row",
    delimiter: "Delimiter:",
    comma: "Comma",
    semicolon: "Semicolon",
    pipe: "Pipe",
    tab: "Tab",
    err: "Error",
    err_label: "Invalid JSON",
    how_it_works_title: "How It Works",
    hiw_1_title: "Paste Your JSON",
    hiw_1_desc: "Paste or drag your JSON file into the editor. Enable the header option if you want the first row of the CSV to include column names.",
    hiw_2_title: "Verify Options",
    hiw_2_desc: "The system validates the JSON syntax. You can toggle whether to include column headers in the first row.",
    hiw_3_title: "Convert to CSV",
    hiw_3_desc: "Click Convert to instantly generate the CSV text with columns separated by your chosen delimiter.",
    use_cases_title: "Use Cases",
    uc_1_title: "Export to Spreadsheets",
    uc_1_desc: "Transform structured JSON data (like API responses) into a readable format for Excel or Google Sheets.",
    uc_2_title: "System Migration",
    uc_2_desc: "Convert document-based data for easy importing into conventional systems and relational databases.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is my JSON data saved on the server?",
    faq_1_a: "No. All processing happens entirely inside your browser. We never transmit or store your JSON data on our servers.",
    faq_2_q: "What JSON structure do you support?",
    faq_2_a: "The tool expects a JSON array of objects, where each object represents a row and its keys become the CSV column headers.",
    faq_3_q: "Can I use a delimiter other than comma?",
    faq_3_a: "Yes. You can choose between commas, semicolons, pipe symbols, or tabs to match the format expected by your software.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "JSON Viewer",
    f_1: "Instant JSON to CSV conversion",
    f_2: "Custom delimiter support",
    f_3: "Automatic flattening of objects",
    f_4: "No registration or installation required"
  },
  pt: {
    m_title: "Conversor de JSON para CSV Online - Gratuito e Instantâneo",
    title: "Conversor de JSON para CSV",
    meta: "Converta JSON para CSV online e gratuitamente. Transforme instantaneamente arrays de objetos JSON em arquivos CSV limpos compatíveis com Excel.",
    d1: "Esta ferramenta transforma uma lista de dados em formato JSON em uma tabela simples (CSV), facilitando a visualização e o uso em planilhas. As chaves dos objetos viram colunas de cabeçalho, enquanto os valores preenchem as linhas.",
    d2: "Converter JSON para CSV é essencial para exportar respostas de APIs para relatórios em Excel, migrar coleções de bancos para auditoria manual ou preparar bases para equipes de analistas.",
    bt: "Converter",
    rst: "Recomeçar",
    copy: "Copiar",
    plc: "Insira o código JSON aqui ou arraste um arquivo",
    header: "Incluir cabeçalho na primeira linha",
    delimiter: "Separador:",
    comma: "Vírgula",
    semicolon: "Ponto e Vírgula",
    pipe: "Pipe",
    tab: "Tabulação",
    err: "Erro",
    err_label: "JSON Inválido",
    how_it_works_title: "Como Funciona",
    hiw_1_title: "Cole seu JSON",
    hiw_1_desc: "Cole ou arraste o seu arquivo JSON no editor. Ative a opção de cabeçalho se desejar que a primeira linha do CSV contenha os nomes das colunas.",
    hiw_2_title: "Verifique as Opções",
    hiw_2_desc: "O sistema analisa se há erros no JSON. Você pode optar por incluir ou não a linha de cabeçalho.",
    hiw_3_title: "Converta para CSV",
    hiw_3_desc: "Ao clicar em Converter, o texto CSV é gerado instantaneamente com as colunas separadas pelo delimitador escolhido.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Conversão para Planilhas",
    uc_1_desc: "Transforme dados estruturados em JSON (como respostas de APIs) em um formato legível para Excel ou Google Sheets.",
    uc_2_title: "Migração de Sistemas",
    uc_2_desc: "Converta matrizes de informações para importá-las facilmente em sistemas e bancos de dados tradicionais.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Os meus dados JSON ficam salvos no servidor?",
    faq_1_a: "Não. Todo o processamento ocorre inteiramente no seu navegador. Não transmitimos nem armazenamos seus dados JSON em nossos servidores.",
    faq_2_q: "Qual estrutura de JSON é suportada?",
    faq_2_a: "A ferramenta espera um array de objetos JSON, onde cada objeto representa uma linha e suas chaves tornam-se os cabeçalhos das colunas.",
    faq_3_q: "Posso usar um separador diferente de vírgula?",
    faq_3_a: "Sim. Você pode escolher entre vírgula, ponto e vírgula, pipe ou tabulação para adequar ao formato do seu programa.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visualizador de JSON",
    f_1: "Conversão instantânea de JSON para CSV",
    f_2: "Suporte a delimitadores personalizados",
    f_3: "Achatamento automático de objetos",
    f_4: "Sem necessidade de cadastro ou instalação"
  },
  es: {
    m_title: "Convertidor de JSON a CSV Online - Gratis e Instantáneo",
    title: "Convertidor de JSON a CSV",
    meta: "Convierte JSON a CSV online y gratis. Transforma instantáneamente arrays de objetos JSON en un archivo CSV limpio compatible con Excel.",
    d1: "Esta herramienta transforma una lista de datos en formato JSON en una tabla simple (CSV), facilitando su visualización y uso en hojas de cálculo. Las claves de los objetos se convierten en columnas de encabezado, mientras que sus valores rellenan las filas.",
    d2: "Convertir JSON a CSV es excelente para exportar respuestas de APIs a tablas Excel, migrar bases de datos u organizar bases tabulares para análisis posterior.",
    bt: "Convertir",
    rst: "Recomenzar",
    copy: "Copiar",
    plc: "Introduce el código JSON aquí o arrastra un archivo",
    header: "Incluir encabezado en la primera fila",
    delimiter: "Separador:",
    comma: "Coma",
    semicolon: "Punto y Coma",
    pipe: "Barra vertical",
    tab: "Tabulador",
    err: "Error",
    err_label: "JSON Inválido",
    how_it_works_title: "Cómo Funciona",
    hiw_1_title: "Pega tu JSON",
    hiw_1_desc: "Pega o arrastra tu archivo JSON en el editor. Activa la opción de encabezado si deseas que la primera fila del CSV contenga los nombres de las columnas.",
    hiw_2_title: "Verifica las Opciones",
    hiw_2_desc: "El sistema comprueba el formato JSON. Tienes la opción de incluir o no la primera línea de encabezado.",
    hiw_3_title: "Convierte a CSV",
    hiw_3_desc: "Al hacer clic en Convertir, se genera el texto CSV con las columnas separadas por el delimitador elegido.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Exportar a Hojas de Cálculo",
    uc_1_desc: "Transforma datos estructurados en JSON en un formato compatible con Excel o Google Sheets.",
    uc_2_title: "Migración de Sistemas",
    uc_2_desc: "Convierte información en masa para importarla fácilmente a bases de datos relacionales tradicionales.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mis datos JSON se guardan en el servidor?",
    faq_1_a: "No. Todo el procesamiento ocurre en tu navegador. No transmitimos ni almacenamos tus datos JSON en nuestros servidores.",
    faq_2_q: "¿Qué estructura JSON admite el conversor?",
    faq_2_a: "La herramienta espera un array de objetos JSON, donde cada objeto representa una fila y sus claves se convierten en los encabezados de columna.",
    faq_3_q: "¿Puedo usar un separador distinto a la coma?",
    faq_3_a: "Sí. Puedes elegir entre coma, punto y coma, barra vertical o tabulador según el formato esperado por tu aplicación.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visor de JSON",
    f_1: "Conversión instantánea de JSON a CSV",
    f_2: "Soporte de delimitadores personalizados",
    f_3: "Aplanamiento automático de objetos",
    f_4: "Sin necesidad de registro ni instalación"
  },
  fr: {
    m_title: "Convertisseur JSON en CSV en Ligne - Gratuit et Instantané",
    title: "Convertisseur JSON en CSV",
    meta: "Convertissez JSON en CSV en ligne et gratuitement. Transformez instantanément des tableaux d'objets JSON en un fichier CSV propre pour tableur.",
    d1: "Cet outil transforme une liste de données au format JSON en un simple tableau (CSV), facilitant l'affichage et l'utilisation dans les tableurs. Les clés des objets deviennent des colonnes d'en-tête, tandis que leurs valeurs remplissent les lignes.",
    d2: "Le passage du format JSON au format CSV est idéal pour exporter des flux API en documents lisibles pour tableurs, pour migrer des données ou préparer des extractions pour analyse.",
    bt: "Convertir",
    rst: "Recommencer",
    copy: "Copier",
    plc: "Insérez le code JSON ici ou faites glisser un fichier",
    header: "Inclure l'en-tête sur la première ligne",
    delimiter: "Séparateur:",
    comma: "Virgule",
    semicolon: "Point-virgule",
    pipe: "Barre verticale",
    tab: "Tabulation",
    err: "Erreur",
    err_label: "JSON Invalide",
    how_it_works_title: "Comment Ça Marche",
    hiw_1_title: "Coller votre JSON",
    hiw_1_desc: "Collez ou faites glisser votre fichier JSON dans l'éditeur. Activez l'option d'en-tête si vous souhaitez que la première ligne du CSV contienne les noms des colonnes.",
    hiw_2_title: "Vérifier les Options",
    hiw_2_desc: "Le système vérifie la validité du JSON. Vous pouvez choisir d'inclure ou non la ligne d'en-tête.",
    hiw_3_title: "Convertir en CSV",
    hiw_3_desc: "Cliquez sur Convertir pour générer instantanément le texte CSV avec les colonnes séparées par le délimiteur choisi.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Exportation vers Tableur",
    uc_1_desc: "Transformez des données JSON structurées en un format directement lisible par Excel ou Google Sheets.",
    uc_2_title: "Migration de Systèmes",
    uc_2_desc: "Convertissez des informations en lot pour les importer facilement dans des bases de données traditionnelles.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Mes données JSON sont-elles sauvegardées sur le serveur ?",
    faq_1_a: "Non. Tout le traitement s'effectue dans votre navigateur. Nous ne transmettons ni ne stockons vos données JSON sur nos serveurs.",
    faq_2_q: "Quelle structure JSON est supportée ?",
    faq_2_a: "L'outil attend un tableau d'objets JSON, où chaque objet représente une ligne et ses clés deviennent les en-têtes de colonnes.",
    faq_3_q: "Puis-je utiliser un séparateur personnalisé ?",
    faq_3_a: "Oui. Vous pouvez choisir entre la virgule, le point-virgule, la barre verticale ou la tabulation selon le format attendu.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visionneuse JSON",
    f_1: "Conversion instantanée de JSON en CSV",
    f_2: "Support de délimiteurs personnalisés",
    f_3: "Aplatissement automatique des objets",
    f_4: "Aucune inscription ou installation requise"
  },
  it: {
    m_title: "Convertitore JSON in CSV Online - Gratuito e Istantaneo",
    title: "Convertitore JSON in CSV",
    meta: "Converti JSON in CSV online e gratuitamente. Trasforma all'istante array di oggetti JSON in un file CSV pulito compatibile con i fogli di calcolo.",
    d1: "Questo strumento trasforma un elenco di dati in formato JSON in una semplice tabella (CSV), facilitandone la visualizzazione e l'uso nei fogli di calcolo. Le chiavi degli oggetti diventano colonne di intestazione, mentre i loro valori riempiono le righe.",
    d2: "Convertire JSON in CSV è fondamentale per esportare risposte API in file Excel per analisi, migrare database o preparare report per team aziendali.",
    bt: "Converti",
    rst: "Ricomincia",
    copy: "Copia",
    plc: "Inserisci il codice JSON qui o trascina un file",
    header: "Includi intestazione nella prima riga",
    delimiter: "Separatore:",
    comma: "Virgola",
    semicolon: "Punto e Virgola",
    pipe: "Barra verticale",
    tab: "Tabulazione",
    err: "Errore",
    err_label: "JSON non valido",
    how_it_works_title: "Come Funziona",
    hiw_1_title: "Incolla il tuo JSON",
    hiw_1_desc: "Incolla o trascina il tuo file JSON nell'editor. Attiva l'opzione intestazione se desideri che la prima riga del CSV contenga i nomi delle colonne.",
    hiw_2_title: "Verifica Opzioni",
    hiw_2_desc: "Il sistema verifica la sintassi JSON. Puoi scegliere se includere o meno la riga di intestazione.",
    hiw_3_title: "Converti in CSV",
    hiw_3_desc: "Clicca Converti per generare istantaneamente il testo CSV con le colonne separate dal delimitatore scelto.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Esportazione in Fogli di Calcolo",
    uc_1_desc: "Trasforma dati strutturati in JSON in un formato leggibile per Excel o Google Sheets.",
    uc_2_title: "Migrazione di Sistemi",
    uc_2_desc: "Converti informazioni in massa per importarle rapidamente in sistemi relazionali tradizionali.",
    faq_title: "Domande e Risposte",
    faq_1_q: "I miei dati JSON vengono salvati sul server?",
    faq_1_a: "No. Tutta l'elaborazione avviene interamente nel tuo browser. Non trasmettiamo né archiviamo i tuoi dati JSON sui nostri server.",
    faq_2_q: "Quale struttura JSON è supportata?",
    faq_2_a: "Lo strumento si aspetta un array di oggetti JSON, dove ogni oggetto rappresenta una riga e le sue chiavi diventano le intestazioni delle colonne.",
    faq_3_q: "Posso usare un separatore diverso dalla virgola?",
    faq_3_a: "Sì. Puoi scegliere tra virgola, punto e virgola, barra verticale o tabulazione in base al formato richiesto.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Visualizzatore JSON",
    f_1: "Conversione istantanea da JSON a CSV",
    f_2: "Supporto per delimitatori personalizzati",
    f_3: "Appiattimento automatico degli oggetti",
    f_4: "Nessuna registrazione o installazione richiesta"
  },
  id: {
    m_title: "Konverter JSON ke CSV Online - Gratis dan Instan",
    title: "Konverter JSON ke CSV",
    meta: "Konversi JSON ke CSV secara online gratis. Ubah susunan array objek JSON menjadi format tabel CSV yang bersih untuk spreadsheet.",
    d1: "Alat ini mengubah daftar data dalam format JSON menjadi tabel sederhana (CSV), sehingga lebih mudah untuk dilihat dan digunakan di lembar spreadsheet. Kunci objek menjadi kolom tajuk, sementara nilainya mengisi baris di bawahnya.",
    d2: "Mengubah JSON menjadi CSV sangat berguna saat mengekspor hasil API ke file Excel, memindahkan database lama, atau menyiapkan file data untuk analisis bisnis.",
    bt: "Konversi",
    rst: "Mulai Ulang",
    copy: "Salin",
    plc: "Masukkan kode JSON di sini atau seret file ke sini",
    header: "Sertakan tajuk di baris pertama",
    delimiter: "Pemisah:",
    comma: "Koma",
    semicolon: "Titik koma",
    pipe: "Pipa",
    tab: "Tab",
    err: "Kesalahan",
    err_label: "JSON tidak valid",
    how_it_works_title: "Cara Kerja",
    hiw_1_title: "Tempel JSON Anda",
    hiw_1_desc: "Tempel atau seret file JSON Anda ke editor. Aktifkan opsi tajuk jika Anda ingin baris pertama CSV menyertakan nama kolom.",
    hiw_2_title: "Verifikasi Opsi",
    hiw_2_desc: "Sistem akan memvalidasi sintaks JSON. Anda dapat memilih untuk menyertakan tajuk kolom atau tidak.",
    hiw_3_title: "Konversi ke CSV",
    hiw_3_desc: "Klik Konversi untuk menghasilkan teks CSV dengan kolom yang dipisahkan oleh pemisah yang dipilih.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Ekspor ke Spreadsheet",
    uc_1_desc: "Ubah data terstruktur JSON menjadi format yang terbaca untuk Excel atau Google Sheets.",
    uc_2_title: "Migrasi Sistem",
    uc_2_desc: "Konversikan data dalam jumlah besar untuk diimpor dengan mudah ke sistem tradisional dan basis data relasional.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah data JSON saya disimpan di server?",
    faq_1_a: "Tidak. Semua pemrosesan terjadi sepenuhnya di browser Anda. Kami tidak mengirim atau menyimpan data JSON Anda di server kami.",
    faq_2_q: "Struktur JSON apa yang didukung?",
    faq_2_a: "Alat ini mengharapkan array objek JSON, di mana setiap objek mewakili satu baris dan kuncinya menjadi header kolom CSV.",
    faq_3_q: "Bisakah saya menggunakan pemisah selain koma?",
    faq_3_a: "Ya. Anda dapat memilih antara koma, titik koma, simbol pipa, atau tab sesuai format yang diharapkan oleh aplikasi Anda.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Penampil JSON",
    f_1: "Konversi instan JSON ke CSV",
    f_2: "Dukungan pemisah kustom",
    f_3: "Object flattening otomatis",
    f_4: "Tanpa pendaftaran atau instalasi"
  },
  de: {
    m_title: "JSON-zu-CSV-Konverter Online - Kostenlos und Sofort",
    title: "JSON-zu-CSV-Konverter",
    meta: "Konvertiere JSON kostenlos online in CSV. Wandle JSON-Objekt-Arrays sofort in tabellarische CSV-Dateien um, die sich für Excel und andere Tabellenkalkulationen eignen.",
    d1: "Dieses Tool wandelt eine Liste von Daten im JSON-Format in eine einfache Tabelle (CSV) um, damit sie sich leichter in Tabellenkalkulationen ansehen und verwenden lassen. Objektschlüssel werden zu Kopfzeilen-Spalten, während ihre Werte die darunterliegenden Zeilen füllen.",
    d2: "Die Konvertierung von JSON in CSV ist besonders nützlich, um API-Antworten in Excel-Dateien zu exportieren, Daten in ältere Berichtssysteme zu migrieren oder Rohdaten für Business-Teams aufzubereiten.",
    bt: "Konvertieren",
    rst: "Neu beginnen",
    copy: "Kopieren",
    plc: "Füge hier den JSON-Code ein oder ziehe eine Datei hinein",
    header: "Kopfzeile in der ersten Zeile einfügen",
    delimiter: "Trennzeichen:",
    comma: "Komma",
    semicolon: "Semikolon",
    pipe: "Pipe",
    tab: "Tabulator",
    err: "Fehler",
    err_label: "Ungültiges JSON",
    how_it_works_title: "So funktioniert es",
    hiw_1_title: "JSON einfügen",
    hiw_1_desc: "Füge deine JSON-Datei in den Editor ein oder ziehe sie hinein. Aktiviere die Kopfzeilen-Option, wenn die erste CSV-Zeile die Spaltennamen enthalten soll.",
    hiw_2_title: "Optionen prüfen",
    hiw_2_desc: "Das System überprüft die JSON-Syntax. Du kannst festlegen, ob die erste Zeile Spaltenüberschriften enthalten soll oder nicht.",
    hiw_3_title: "In CSV umwandeln",
    hiw_3_desc: "Klicke auf Konvertieren, um sofort den CSV-Text mit Spalten zu erzeugen, die durch das gewählte Trennzeichen getrennt sind.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Export in Tabellenkalkulationen",
    uc_1_desc: "Wandle strukturierte JSON-Daten wie API-Antworten in ein lesbares Format für Excel oder Google Sheets um.",
    uc_2_title: "Systemmigration",
    uc_2_desc: "Konvertiere dokumentbasierte Daten, damit sie sich leicht in klassische Systeme und relationale Datenbanken importieren lassen.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Werden meine JSON-Daten auf dem Server gespeichert?",
    faq_1_a: "Nein. Die gesamte Verarbeitung findet vollständig in deinem Browser statt. Wir übertragen oder speichern deine JSON-Daten nicht auf unseren Servern.",
    faq_2_q: "Welche JSON-Struktur wird unterstützt?",
    faq_2_a: "Das Tool erwartet ein JSON-Array von Objekten, bei dem jedes Objekt eine Zeile darstellt und seine Schlüssel zu den Spaltenüberschriften der CSV werden.",
    faq_3_q: "Kann ich ein anderes Trennzeichen als das Komma verwenden?",
    faq_3_a: "Ja. Du kannst zwischen Komma, Semikolon, Pipe-Symbol oder Tabulator wählen, je nachdem, welches Format deine Software erwartet.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "JSON-Betrachter",
    f_1: "Sofortige JSON-zu-CSV-Konvertierung",
    f_2: "Unterstützung für benutzerdefinierte Trennzeichen",
    f_3: "Automatisches Abflachen von Objekten",
    f_4: "Keine Registrierung oder Installation erforderlich"
  },
  nl: {
    m_title: "JSON naar CSV Converter Online - Gratis en Direct",
    title: "JSON naar CSV Converter",
    meta: "Gratis online JSON naar CSV converter. Transformeer JSON-objecten direct naar tabelformaat voor Excel of Google Sheets.",
    d1: "Deze tool transformeert een lijst met JSON-gegevens naar een eenvoudige tabel (CSV), waardoor het makkelijker is om ze te bekijken en te gebruiken in spreadsheets. De keys van de objecten worden de kolomkoppen, terwijl de waarden de rijen eronder vullen.",
    d2: "Het converteren van JSON naar CSV is erg nuttig voor het exporteren van API-responses naar Excel, het migreren van databases of het voorbereiden van ruwe data voor zakelijke teams.",
    bt: "Converteren",
    rst: "Opnieuw beginnen",
    copy: "Kopiëren",
    plc: "Plak hier de JSON-code of sleep een bestand hiernaartoe",
    header: "Voeg koptekst toe aan de eerste rij",
    delimiter: "Scheidingsteken:",
    comma: "Komma",
    semicolon: "Puntkomma",
    pipe: "Pipe (|)",
    tab: "Tab",
    err: "Fout",
    err_label: "Ongeldige JSON",
    how_it_works_title: "Hoe het werkt",
    hiw_1_title: "Plak je JSON",
    hiw_1_desc: "Plak of sleep je JSON-bestand in de editor. Schakel de koptekst-optie in als je wilt dat de eerste rij van de CSV de kolomnamen bevat.",
    hiw_2_title: "Controleer opties",
    hiw_2_desc: "Het systeem valideert de JSON-syntaxis. Je kunt kiezen of je kolomkoppen in de eerste rij wilt opnemen.",
    hiw_3_title: "Converteren naar CSV",
    hiw_3_desc: "Klik op Converteren om direct de CSV-tekst te genereren met kolommen gescheiden door het door jou gekozen scheidingsteken.",
    use_cases_title: "Gebruiksvoorbeelden",
    uc_1_title: "Exporteren naar spreadsheets",
    uc_1_desc: "Transformeer gestructureerde JSON-gegevens (zoals API-responses) naar een leesbaar formaat voor Excel of Google Sheets.",
    uc_2_title: "Systeemmigratie",
    uc_2_desc: "Converteer document-gebaseerde gegevens om ze eenvoudig te kunnen importeren in conventionele systemen en relationele databases.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Worden mijn JSON-gegevens op de server opgeslagen?",
    faq_1_a: "Nee. Alle verwerking vindt volledig plaats in je browser. We verzenden of bewaren je JSON-gegevens nooit op onze servers.",
    faq_2_q: "Welke JSON-structuur wordt ondersteund?",
    faq_2_a: "De tool verwacht een JSON-array van objecten, waarbij elk object een rij vertegenwoordigt en de keys de CSV-kolomkoppen worden.",
    faq_3_q: "Kan ik een ander scheidingsteken dan een komma gebruiken?",
    faq_3_a: "Ja. Je kunt kiezen tussen komma's, puntkomma's, pipe-symbolen of tabs, passend bij het formaat dat je software verwacht.",
    see1: "CSV → JSON",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "JSON Viewer",
    f_1: "Directe JSON naar CSV conversie",
    f_2: "Ondersteuning voor aangepaste scheidingstekens",
    f_3: "Automatisch afvlakken van objecten",
    f_4: "Geen registratie of installatie vereist"
  }
}
</i18n>
