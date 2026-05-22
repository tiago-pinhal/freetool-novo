<script setup lang="ts">
  useScript('https://cdn.jsdelivr.net/npm/xml-js@1.6.11/dist/xml-js.js', {
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
  lang: 'json' as string
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
  const js2xml = (window as any).js2xml
  if (!js2xml) return

  try {
    const input = editor.value!.getValue()
    const jsonObj = JSON.parse(input)
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      js2xml(jsonObj, { compact: true, ignoreComment: true, spaces: 4 })
    editor.value!.setValue(xml)
    editor.value!.setMode('xml')
    editor.value!.setReadOnly(true)
    state.lang = 'xml'
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
    en: '/json-to-xml-converter',
    pt: '/conversor-de-json-para-xml',
    es: '/convertidor-de-json-a-xml',
    fr: '/convertisseur-de-json-en-xml',
    it: '/convertitore-da-json-a-xml',
    id: '/konverter-json-ke-xml',
    de: '/json-zu-xml-konverter',
    nl: '/json-naar-xml-converter'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/XML`"
    wiki-label="XML"
    :see-also-links="[
      { label: t('see1'), to: 'xml-to-json-converter' },
      { label: t('see2'), to: 'csv-to-json-converter' },
      { label: t('see3'), to: 'json-to-csv-converter' },
      { label: t('see4'), to: 'less-to-css-converter' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Loading Placeholder -->
      <div
        v-if="!state.loaded"
        role="status"
        class="flex items-center justify-center h-64 w-full rounded-2xl animate-pulse bg-base-200"
      >
        <Icon name="heroicons:code-bracket" class="w-12 h-12 text-base-content/10" />
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
            {{ t('copy') }} XML
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
        </div>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') }
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

        <!-- FAQ Section -->
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
    m_title: "JSON to XML Converter Online - Free and Instant",
    title: "JSON to XML Converter",
    meta: "Convert JSON to XML online for free. Paste your JSON and get clean, valid, well-structured XML without needing any other tool or installation.",
    d1: "This tool parses your JSON input and maps each key-value pair, nested object, and array to its corresponding XML element. Object keys become XML tags, nested objects become child elements, and array items are wrapped in repeating tags, preserving the original data structure.",
    bt: "Convert",
    rst: "Start Over",
    copy: "Copy",
    plc: "Insert the JSON code here or drag a file",
    err: "Error",
    err_label: "Parse Error",
    how_it_works_title: "How It Works",
    hiw_1_title: "Paste Your JSON",
    hiw_1_desc: "Paste or drag your JSON file into the editor. Make sure it is valid JSON before converting.",
    hiw_2_title: "Click Convert",
    hiw_2_desc: "Hit Convert and the tool parses your JSON and maps it to a clean, well-structured XML document instantly.",
    hiw_3_title: "Copy the XML",
    hiw_3_desc: "The resulting XML appears in the editor ready to use. Click Copy XML to grab it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "SOAP & Web Services",
    uc_1_desc: "Convert JSON payloads to XML for use with SOAP-based web services and enterprise APIs that only accept XML.",
    uc_2_title: "Legacy System Integration",
    uc_2_desc: "Transform modern JSON data into XML when feeding older systems, platforms, or middleware that require XML input.",
    uc_3_title: "Configuration Files",
    uc_3_desc: "Convert JSON configuration objects into XML format for tools, frameworks, and platforms that use XML-based config files.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is my JSON data sent to a server?",
    faq_1_a: "No. The conversion runs entirely inside your browser. Your data never leaves your device.",
    faq_2_q: "What happens to nested JSON objects?",
    faq_2_a: "Nested objects are mapped to nested XML child elements, preserving the original hierarchy of your data.",
    faq_3_q: "How are JSON arrays handled?",
    faq_3_a: "Each item in a JSON array is wrapped in a repeating XML tag using the parent key name, keeping the array structure intact.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Instant JSON to XML conversion",
    f_2: "Handles nested objects and arrays",
    f_3: "Generates valid, well-structured XML",
    f_4: "No registration or installation required"
  },
  pt: {
    m_title: "Conversor de JSON para XML Online - Gratuito e Instantâneo",
    title: "Conversor de JSON para XML",
    meta: "Converta JSON para XML online e gratuitamente. Cole seu JSON e obtenha um XML limpo, válido e bem estruturado sem precisar de nenhuma outra ferramenta ou instalação.",
    d1: "Esta ferramenta analisa o seu JSON e mapeia cada par chave-valor, objeto aninhado e array para o elemento XML correspondente. As chaves viram tags XML, objetos aninhados viram elementos filhos e itens de array são envolvidos em tags repetidas, preservando a estrutura original dos dados.",
    bt: "Converter",
    rst: "Recomeçar",
    copy: "Copiar",
    plc: "Insira o código JSON aqui ou arraste um arquivo",
    err: "Erro",
    err_label: "Erro de Análise",
    how_it_works_title: "Como Funciona",
    hiw_1_title: "Cole o seu JSON",
    hiw_1_desc: "Cole ou arraste o arquivo JSON no editor. Certifique-se de que é um JSON válido antes de converter.",
    hiw_2_title: "Clique em Converter",
    hiw_2_desc: "Pressione Converter e a ferramenta analisa o JSON e mapeia tudo para um documento XML limpo e bem estruturado instantaneamente.",
    hiw_3_title: "Copie o XML",
    hiw_3_desc: "O XML gerado aparece no editor pronto para uso. Clique em Copiar XML para copiá-lo para a área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "SOAP e Web Services",
    uc_1_desc: "Converta payloads JSON em XML para uso com serviços web baseados em SOAP e APIs corporativas que aceitam apenas XML.",
    uc_2_title: "Integração com Sistemas Legados",
    uc_2_desc: "Transforme dados JSON modernos em XML para alimentar sistemas, plataformas ou middlewares mais antigos que exigem entrada em XML.",
    uc_3_title: "Arquivos de Configuração",
    uc_3_desc: "Converta objetos de configuração JSON em formato XML para ferramentas e frameworks que utilizam arquivos de configuração baseados em XML.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O meu JSON é enviado para algum servidor?",
    faq_1_a: "Não. A conversão é feita inteiramente no seu navegador. Os seus dados nunca saem do seu dispositivo.",
    faq_2_q: "O que acontece com objetos JSON aninhados?",
    faq_2_a: "Objetos aninhados são mapeados para elementos XML filhos aninhados, preservando a hierarquia original dos seus dados.",
    faq_3_q: "Como os arrays JSON são tratados?",
    faq_3_a: "Cada item de um array JSON é envolvido em uma tag XML repetida usando o nome da chave pai, mantendo a estrutura do array intacta.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Conversão instantânea de JSON para XML",
    f_2: "Suporte a objetos aninhados e arrays",
    f_3: "Gera XML válido e bem estruturado",
    f_4: "Sem necessidade de cadastro ou instalação"
  },
  es: {
    m_title: "Convertidor de JSON a XML Online - Gratis e Instantáneo",
    title: "Convertidor de JSON a XML",
    meta: "Convierte JSON a XML online y gratis. Pega tu JSON y obtén un XML limpio, válido y bien estructurado sin necesidad de ninguna otra herramienta o instalación.",
    d1: "Esta herramienta analiza tu JSON y mapea cada par clave-valor, objeto anidado y array al elemento XML correspondiente. Las claves se convierten en etiquetas XML, los objetos anidados en elementos hijo y los elementos de array se envuelven en etiquetas repetidas, preservando la estructura original de los datos.",
    bt: "Convertir",
    rst: "Recomenzar",
    copy: "Copiar",
    plc: "Introduce el código JSON aquí o arrastra un archivo",
    err: "Error",
    err_label: "Error de Análisis",
    how_it_works_title: "Cómo Funciona",
    hiw_1_title: "Pega tu JSON",
    hiw_1_desc: "Pega o arrastra tu archivo JSON en el editor. Asegúrate de que sea JSON válido antes de convertir.",
    hiw_2_title: "Haz clic en Convertir",
    hiw_2_desc: "Presiona Convertir y la herramienta analiza el JSON y lo mapea a un documento XML limpio y bien estructurado al instante.",
    hiw_3_title: "Copia el XML",
    hiw_3_desc: "El XML resultante aparece en el editor listo para usar. Haz clic en Copiar XML para copiarlo al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "SOAP y Servicios Web",
    uc_1_desc: "Convierte payloads JSON a XML para usarlos con servicios web basados en SOAP y APIs empresariales que solo aceptan XML.",
    uc_2_title: "Integración con Sistemas Heredados",
    uc_2_desc: "Transforma datos JSON modernos a XML para alimentar sistemas, plataformas o middleware más antiguos que requieren entrada en XML.",
    uc_3_title: "Archivos de Configuración",
    uc_3_desc: "Convierte objetos de configuración JSON a formato XML para herramientas y frameworks que utilizan archivos de configuración basados en XML.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mi JSON se envía a algún servidor?",
    faq_1_a: "No. La conversión se realiza completamente en tu navegador. Tus datos nunca salen de tu dispositivo.",
    faq_2_q: "¿Qué pasa con los objetos JSON anidados?",
    faq_2_a: "Los objetos anidados se mapean a elementos XML hijo anidados, preservando la jerarquía original de tus datos.",
    faq_3_q: "¿Cómo se manejan los arrays JSON?",
    faq_3_a: "Cada elemento de un array JSON se envuelve en una etiqueta XML repetida usando el nombre de la clave padre, manteniendo la estructura del array intacta.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Conversión instantánea de JSON a XML",
    f_2: "Manejo de objetos anidados y arrays",
    f_3: "Genera XML válido y bien estructurado",
    f_4: "Sin necesidad de registro ni instalación"
  },
  fr: {
    m_title: "Convertisseur JSON en XML en Ligne - Gratuit et Instantané",
    title: "Convertisseur JSON en XML",
    meta: "Convertissez JSON en XML en ligne et gratuitement. Collez votre JSON et obtenez un XML propre, valide et bien structuré sans aucun autre outil ni installation.",
    d1: "Cet outil analyse votre JSON et associe chaque paire clé-valeur, objet imbriqué et tableau à l'élément XML correspondant. Les clés deviennent des balises XML, les objets imbriqués deviennent des éléments enfants et les éléments de tableau sont enveloppés dans des balises répétées, préservant la structure originale des données.",
    bt: "Convertir",
    rst: "Recommencer",
    copy: "Copier",
    plc: "Insérez le code JSON ici ou faites glisser un fichier",
    err: "Erreur",
    err_label: "Erreur d'Analyse",
    how_it_works_title: "Comment Ça Marche",
    hiw_1_title: "Collez votre JSON",
    hiw_1_desc: "Collez ou faites glisser votre fichier JSON dans l'éditeur. Assurez-vous qu'il s'agit d'un JSON valide avant de convertir.",
    hiw_2_title: "Cliquez sur Convertir",
    hiw_2_desc: "Appuyez sur Convertir et l'outil analyse votre JSON et le mappe vers un document XML propre et bien structuré instantanément.",
    hiw_3_title: "Copiez le XML",
    hiw_3_desc: "Le XML résultant apparaît dans l'éditeur prêt à l'emploi. Cliquez sur Copier XML pour le copier dans le presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "SOAP et Services Web",
    uc_1_desc: "Convertissez des payloads JSON en XML pour les utiliser avec des services web SOAP et des APIs d'entreprise qui n'acceptent que XML.",
    uc_2_title: "Intégration Systèmes Hérités",
    uc_2_desc: "Transformez des données JSON modernes en XML pour alimenter des systèmes, plateformes ou middlewares plus anciens qui nécessitent une entrée XML.",
    uc_3_title: "Fichiers de Configuration",
    uc_3_desc: "Convertissez des objets de configuration JSON au format XML pour les outils et frameworks qui utilisent des fichiers de configuration basés sur XML.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Mon JSON est-il envoyé à un serveur ?",
    faq_1_a: "Non. La conversion s'effectue entièrement dans votre navigateur. Vos données ne quittent jamais votre appareil.",
    faq_2_q: "Que se passe-t-il avec les objets JSON imbriqués ?",
    faq_2_a: "Les objets imbriqués sont mappés vers des éléments XML enfants imbriqués, préservant la hiérarchie originale de vos données.",
    faq_3_q: "Comment les tableaux JSON sont-ils gérés ?",
    faq_3_a: "Chaque élément d'un tableau JSON est enveloppé dans une balise XML répétée en utilisant le nom de la clé parente, conservant la structure du tableau intacte.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Conversion instantanée de JSON en XML",
    f_2: "Gestion des objets imbriqués et des tableaux",
    f_3: "Génère un XML valide et bien structuré",
    f_4: "Aucune inscription ou installation requise"
  },
  it: {
    m_title: "Convertitore JSON in XML Online - Gratuito e Istantaneo",
    title: "Convertitore JSON in XML",
    meta: "Converti JSON in XML online e gratuitamente. Incolla il tuo JSON e ottieni un XML pulito, valido e ben strutturato senza alcun altro strumento o installazione.",
    d1: "Questo strumento analizza il tuo JSON e mappa ogni coppia chiave-valore, oggetto annidato e array nel corrispondente elemento XML. Le chiavi diventano tag XML, gli oggetti annidati diventano elementi figlio e gli elementi degli array vengono racchiusi in tag ripetuti, preservando la struttura originale dei dati.",
    bt: "Converti",
    rst: "Ricomincia",
    copy: "Copia",
    plc: "Inserisci il codice JSON qui o trascina un file",
    err: "Errore",
    err_label: "Errore di Analisi",
    how_it_works_title: "Come Funziona",
    hiw_1_title: "Incolla il tuo JSON",
    hiw_1_desc: "Incolla o trascina il tuo file JSON nell'editor. Assicurati che sia JSON valido prima di convertire.",
    hiw_2_title: "Clicca Converti",
    hiw_2_desc: "Premi Converti e lo strumento analizza il tuo JSON e lo mappa in un documento XML pulito e ben strutturato istantaneamente.",
    hiw_3_title: "Copia il XML",
    hiw_3_desc: "Il XML risultante appare nell'editor pronto all'uso. Clicca Copia XML per copiarlo negli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "SOAP e Web Service",
    uc_1_desc: "Converti payload JSON in XML per l'uso con web service basati su SOAP e API aziendali che accettano solo XML.",
    uc_2_title: "Integrazione con Sistemi Legacy",
    uc_2_desc: "Trasforma dati JSON moderni in XML per alimentare sistemi, piattaforme o middleware più vecchi che richiedono input XML.",
    uc_3_title: "File di Configurazione",
    uc_3_desc: "Converti oggetti di configurazione JSON in formato XML per strumenti e framework che utilizzano file di configurazione basati su XML.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Il mio JSON viene inviato a un server?",
    faq_1_a: "No. La conversione avviene interamente nel tuo browser. I tuoi dati non lasciano mai il tuo dispositivo.",
    faq_2_q: "Cosa succede agli oggetti JSON annidati?",
    faq_2_a: "Gli oggetti annidati vengono mappati in elementi XML figlio annidati, preservando la gerarchia originale dei tuoi dati.",
    faq_3_q: "Come vengono gestiti gli array JSON?",
    faq_3_a: "Ogni elemento di un array JSON viene racchiuso in un tag XML ripetuto usando il nome della chiave padre, mantenendo intatta la struttura dell'array.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Conversione istantanea da JSON a XML",
    f_2: "Gestione di oggetti annidati e array",
    f_3: "Genera XML valido e ben strutturato",
    f_4: "Nessuna registrazione o installazione richiesta"
  },
  id: {
    m_title: "Konverter JSON ke XML Online - Gratis dan Instan",
    title: "Konverter JSON ke XML",
    meta: "Konversi JSON ke XML online dan gratis. Tempel JSON Anda dan dapatkan XML yang bersih, valid, dan terstruktur dengan baik tanpa memerlukan alat lain atau instalasi apapun.",
    d1: "Alat ini mengurai input JSON Anda dan memetakan setiap pasangan kunci-nilai, objek bersarang, dan array ke elemen XML yang sesuai. Kunci objek menjadi tag XML, objek bersarang menjadi elemen anak, dan item array dibungkus dalam tag berulang, sehingga struktur data asli tetap terjaga.",
    bt: "Konversi",
    rst: "Mulai Ulang",
    copy: "Salin",
    plc: "Masukkan kode JSON di sini atau seret file",
    err: "Kesalahan",
    err_label: "Kesalahan Penguraian",
    how_it_works_title: "Cara Kerja",
    hiw_1_title: "Tempel JSON Anda",
    hiw_1_desc: "Tempel atau seret file JSON ke editor. Pastikan JSON valid sebelum mengonversi.",
    hiw_2_title: "Klik Konversi",
    hiw_2_desc: "Tekan Konversi dan alat akan mengurai JSON Anda serta memetakannya ke dokumen XML yang bersih dan terstruktur dengan baik secara instan.",
    hiw_3_title: "Salin XML",
    hiw_3_desc: "XML yang dihasilkan muncul di editor siap digunakan. Klik Salin XML untuk menyalinnya ke clipboard.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "SOAP & Layanan Web",
    uc_1_desc: "Konversi payload JSON ke XML untuk digunakan dengan layanan web berbasis SOAP dan API perusahaan yang hanya menerima XML.",
    uc_2_title: "Integrasi Sistem Lama",
    uc_2_desc: "Ubah data JSON modern menjadi XML untuk sistem, platform, atau middleware lama yang memerlukan input XML.",
    uc_3_title: "File Konfigurasi",
    uc_3_desc: "Konversi objek konfigurasi JSON ke format XML untuk alat dan framework yang menggunakan file konfigurasi berbasis XML.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah data JSON saya dikirim ke server?",
    faq_1_a: "Tidak. Konversi dilakukan sepenuhnya di browser Anda. Data Anda tidak pernah meninggalkan perangkat Anda.",
    faq_2_q: "Apa yang terjadi dengan objek JSON bersarang?",
    faq_2_a: "Objek bersarang dipetakan ke elemen XML anak yang bersarang, sehingga hierarki asli data Anda tetap terjaga.",
    faq_3_q: "Bagaimana array JSON ditangani?",
    faq_3_a: "Setiap item dalam array JSON dibungkus dalam tag XML berulang menggunakan nama kunci induknya, menjaga struktur array tetap utuh.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Konversi instan dari JSON ke XML",
    f_2: "Menangani objek bersarang dan array",
    f_3: "Menghasilkan XML valid dan terstruktur dengan baik",
    f_4: "Tanpa pendaftaran atau instalasi"
  },
  de: {
    m_title: "JSON-zu-XML-Konverter Online - Kostenlos und Sofort",
    title: "JSON-zu-XML-Konverter",
    meta: "Konvertiere JSON kostenlos online in XML. Füge dein JSON ein und erhalte sauberes, gültiges und gut strukturiertes XML, ganz ohne zusätzliche Tools oder Installation.",
    d1: "Dieses Tool analysiert dein JSON und ordnet jedes Schlüssel-Wert-Paar, verschachtelte Objekt und Array dem entsprechenden XML-Element zu. Objektschlüssel werden zu XML-Tags, verschachtelte Objekte zu Kindelementen, und Array-Elemente werden in wiederholte Tags verpackt, sodass die ursprüngliche Datenstruktur erhalten bleibt.",
    bt: "Konvertieren",
    rst: "Neu beginnen",
    copy: "Kopieren",
    plc: "Füge hier den JSON-Code ein oder ziehe eine Datei hinein",
    err: "Fehler",
    err_label: "Parsing-Fehler",
    how_it_works_title: "So funktioniert es",
    hiw_1_title: "JSON einfügen",
    hiw_1_desc: "Füge deine JSON-Datei in den Editor ein oder ziehe sie hinein. Stelle sicher, dass es gültiges JSON ist, bevor du konvertierst.",
    hiw_2_title: "Auf Konvertieren klicken",
    hiw_2_desc: "Klicke auf Konvertieren und das Tool analysiert dein JSON und wandelt es sofort in ein sauberes, gut strukturiertes XML-Dokument um.",
    hiw_3_title: "XML kopieren",
    hiw_3_desc: "Das erzeugte XML erscheint im Editor und ist sofort einsatzbereit. Klicke auf XML kopieren, um es in die Zwischenablage zu übernehmen.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "SOAP und Webservices",
    uc_1_desc: "Wandle JSON-Payloads in XML um, um sie mit SOAP-basierten Webservices und Unternehmens-APIs zu verwenden, die nur XML akzeptieren.",
    uc_2_title: "Integration mit Altsystemen",
    uc_2_desc: "Transformiere moderne JSON-Daten in XML, wenn ältere Systeme, Plattformen oder Middleware XML-Eingaben benötigen.",
    uc_3_title: "Konfigurationsdateien",
    uc_3_desc: "Konvertiere JSON-Konfigurationsobjekte in XML-Format für Tools, Frameworks und Plattformen, die XML-basierte Konfigurationsdateien verwenden.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Werden meine JSON-Daten an einen Server gesendet?",
    faq_1_a: "Nein. Die Konvertierung läuft vollständig in deinem Browser. Deine Daten verlassen dein Gerät niemals.",
    faq_2_q: "Was passiert mit verschachtelten JSON-Objekten?",
    faq_2_a: "Verschachtelte Objekte werden in verschachtelte XML-Kindelemente umgewandelt, sodass die ursprüngliche Hierarchie deiner Daten erhalten bleibt.",
    faq_3_q: "Wie werden JSON-Arrays behandelt?",
    faq_3_a: "Jedes Element eines JSON-Arrays wird in ein wiederholtes XML-Tag mit dem Namen des übergeordneten Schlüssels eingebettet, sodass die Array-Struktur intakt bleibt.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Sofortige JSON-zu-XML-Konvertierung",
    f_2: "Verarbeitet verschachtelte Objekte und Arrays",
    f_3: "Erzeugt gültiges, gut strukturiertes XML",
    f_4: "Keine Registrierung oder Installation erforderlich"
  },
  nl: {
    m_title: "JSON naar XML Converter Online - Gratis en Direct",
    title: "JSON naar XML Converter",
    meta: "Gratis online JSON naar XML converter. Plak je JSON en krijg schone, geldige en goed gestructureerde XML zonder extra tools of installatie.",
    d1: "Deze tool analyseert je JSON en koppelt elk key-value paar, genest object en array aan het bijbehorende XML-element. Object keys worden XML-tags, geneste objecten worden kind-elementen, en array-items worden verpakt in herhaalde tags, waardoor de oorspronkelijke datastructuur behouden blijft.",
    bt: "Converteren",
    rst: "Opnieuw beginnen",
    copy: "Kopiëren",
    plc: "Plak hier de JSON-code of sleep een bestand hiernaartoe",
    err: "Fout",
    err_label: "Analysefout",
    how_it_works_title: "Hoe het werkt",
    hiw_1_title: "Plak je JSON",
    hiw_1_desc: "Plak of sleep je JSON-bestand in de editor. Zorg ervoor dat het geldige JSON is voordat je converteert.",
    hiw_2_title: "Klik op Converteren",
    hiw_2_desc: "Klik op Converteren en de tool analyseert je JSON en zet deze direct om naar een schoon, goed gestructureerd XML-document.",
    hiw_3_title: "XML kopiëren",
    hiw_3_desc: "De gegenereerde XML verschijnt in de editor en is direct klaar voor gebruik. Klik op Kopiëren om het naar je klembord te kopiëren.",
    use_cases_title: "Gebruiksvoorbeelden",
    uc_1_title: "SOAP en Webservices",
    uc_1_desc: "Zet JSON-payloads om naar XML voor gebruik met SOAP-gebaseerde webservices en enterprise API's die alleen XML accepteren.",
    uc_2_title: "Integratie met oude systemen",
    uc_2_desc: "Transformeer moderne JSON-gegevens naar XML wanneer oudere systemen, platforms of middleware XML-input vereisen.",
    uc_3_title: "Configuratiebestanden",
    uc_3_desc: "Converteer JSON-configuratieobjecten naar XML-formaat voor tools, frameworks en platforms die XML-gebaseerde configuratiebestanden gebruiken.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Worden mijn gegevens veilig verwerkt?",
    faq_1_a: "Ja. Alle conversies vinden plaats in je browser. Je JSON-gegevens worden niet naar onze servers verzonden, wat maximale privacy en veiligheid garandeert.",
    faq_2_q: "Wat gebeurt er met complexe JSON-objecten?",
    faq_2_a: "De tool verwerkt geneste objecten door recursief XML-elementen te maken. Elk niveau in de JSON-hiërarchie wordt vertaald naar een geneste XML-tag.",
    faq_3_q: "Hoe worden JSON-arrays behandeld?",
    faq_3_a: "Elk item in een JSON-array wordt verpakt in een herhaalde XML-tag met de naam van de bovenliggende key, waardoor de array-structuur behouden blijft.",
    see1: "XML → JSON",
    see2: "CSV → JSON",
    see3: "JSON → CSV",
    see4: "LESS → CSS",
    f_1: "Directe JSON naar XML conversie",
    f_2: "Verwerkt geneste objecten en arrays",
    f_3: "Genereert geldige en goed gestructureerde XML",
    f_4: "Geen registratie of installatie vereist"
  }
}
</i18n>
