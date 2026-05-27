<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/jsnview/build/index.min.js', {
  trigger: 'onNuxtReady'
})

const { t } = useI18n({ useScope: 'local' })

// JSON-LD Metadata
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
  ],
  link: [
    { rel: 'stylesheet', href: '/css/jsnview.css' }
  ]
})

// Tool State
const state = reactive({ 
  hasCode: false, 
  loaded: false, 
  error: false as string | boolean, 
  ads: false 
})

const options = { 
  showLen: true, 
  showType: false, 
  showBrackets: true, 
  showFoldmarker: true 
}

const editor = ref<any>(null)
const viewerRef = ref<HTMLElement | null>(null)

function onChange() {
  const viewer = viewerRef.value
  if (!viewer) return

  viewer.innerHTML = ""
  state.ads = true

  const jsnviewFn = (window as any).jsnview
  if (!jsnviewFn) return

  try {
    const rawValue = editor.value!.getValue()
    state.hasCode = rawValue.trim() !== ''
    if (state.hasCode) {
      viewer.appendChild(jsnviewFn(JSON.parse(rawValue), options))
      state.error = false
    }
  } catch (e: any) {
    state.error = e.message
  }
}

// Localized Routes
defineI18nRoute({
  paths: {
    en: '/json-viewer',
    pt: '/visualizador-de-json', 
    es: '/visor-de-json', 
    fr: '/visualiseur-json',
    it: '/visualizzatore-di-json',
    id: '/penampil-json',
    de: '/json-betrachter',
    nl: '/json-viewer',
    ru: '/json-viewer'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'xml-to-json-converter' },
      { label: t('see2'), to: 'json-to-xml-converter' },
      { label: t('see3'), to: 'md5-hash-generator' },
      { label: t('see4'), to: 'bcrypt-generator' }
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
        lang="json" 
        :placeholder="t('plc')" 
        @onLoad="state.loaded = true" 
        @onChange="onChange" 
      />
       
      <!-- Viewer Output -->
      <div v-show="!state.error && state.hasCode" class="space-y-3">
        <div class="flex items-center gap-2 font-bold text-base-content/60 uppercase tracking-wider">
          <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
          {{ t('result') }}
        </div>
        <div 
          ref="viewerRef"
          id="viewer" 
          class="rounded-2xl border-2 border-base-content/10 p-6 bg-[#002240] min-h-[10rem] max-h-[50rem] overflow-y-auto text-lg"
        ></div>
      </div>
        
      <!-- Error Message -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="state.error && state.hasCode" class="alert alert-error shadow-lg border-none rounded-2xl text-white flex-col items-start gap-1">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:x-circle-20-solid" class="w-6 h-6" />
            <span class="font-bold">{{ t('err') }}</span>
          </div>
          <div v-if="typeof state.error === 'string'" class="text-sm opacity-90 font-mono bg-black/20 p-2 rounded-lg w-full mt-1">
            {{ state.error }}
          </div>
        </div>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <div>
          <p>{{ t('d1') }} {{ t('d2') }}</p>
        </div>

        <FeatureSection
          :title="t('features_title')"
          :items="[
            t('f_1'),
            t('f_2'),
            t('f_3'),
            t('f_4')
          ]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
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
        m_title: "JSON Viewer Online - Visualize & Format JSON for Free",
        title: "JSON Viewer",
        meta: "Free online JSON viewer. Paste or upload your JSON and instantly visualize it as a collapsible tree with color-coded fields. No registration required.",
        info_title: "Information",
        d1: "This online JSON viewer displays your data in an interactive tree format, where each node is indented to reflect the data hierarchy. You can expand or collapse any group to focus on the information that matters.",
        d2: "Fields and values are color-coded for quick identification, and any change made to the input is instantly reflected in the visualization. Ideal for developers debugging APIs, validating responses, or inspecting configuration files — no installation or sign-up needed.",
        result: "Result",
        plc: "Insert the JSON code here or drag a file",
        err: "Provide a valid JSON",
        features_title: "Features",
        how_to_use_title: "How to Use",
        hiw_1_title: "Paste Your JSON",
        hiw_1_desc: "Simply paste or drag your raw JSON file into the editor.",
        hiw_2_title: "Instant Verification",
        hiw_2_desc: "The tool quickly validates your code, indicating errors dynamically.",
        hiw_3_title: "Tree Visualization",
        hiw_3_desc: "It generates a fully browsable, color-coded interactive tree for easy data reading.",
        use_cases_title: "Use Cases",
        uc_1_title: "API Debugging",
        uc_1_desc: "Understand extensive payload structures by isolating nodes and checking parent-child relationships.",
        uc_2_title: "Configuration Checking",
        uc_2_desc: "Find missing commas, wrong brackets, or badly structured settings files effortlessly.",
        uc_3_title: "Data Presentation",
        uc_3_desc: "Share screen easily during technical meetings with a sanitized and collapsible JSON graphic.",
        faq_title: "Questions & Answers",
        faq_1_q: "Is my JSON data saved on the server?",
        faq_1_a: "No. The processing happens strictly inside your browser window. We do not transmit or store your JSON objects on our servers, ensuring total privacy.",
        faq_2_q: "Can I copy individual parts of the JSON?",
        faq_2_a: "Yes. By interacting directly with the generated JSON tree, you can copy specific nodes, arrays, or sub-objects without parsing the entire raw text.",
        faq_3_q: "Does the viewer indicate JSON errors?",
        faq_3_a: "Yes. If your JSON payload is malformed (missing quotes, trailing commas, etc.), the tool will display a direct red syntax error flag preventing the tree render.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Interactive JSON tree virtualization",
        f_2: "Syntax highlighting and color-coded fields",
        f_3: "Real-time validation and error detection",
        f_4: "No registration or installation required"
    },
    pt: {
        m_title: "JSON Viewer Online - Visualize e Inspecione JSON de Graça",
        title: "JSON Viewer",
        meta: "JSON Viewer online gratuito. Cole ou digite seu JSON e visualize instantaneamente em uma estrutura de árvore recolhível com campos coloridos.",
        info_title: "Informações",
        d1: "Este JSON Viewer online exibe seus dados em um formato de árvore interativa, onde cada nó é indentado para refletir a hierarquia das informações. Você pode expandir ou recolher qualquer grupo para focar em determinados conjuntos de dados.",
        d2: "Campos e valores são coloridos para facilitar a leitura, e qualquer alteração feita no texto de entrada é refletida instantaneamente. Por isso, a ferramenta é ideal para desenvolvedores que depuram APIs, validam respostas ou inspecionam arquivos de configuração, sem instalação nem cadastro.",
        result: "Resultado",
        plc: "Insira o código JSON aqui ou arraste um arquivo",
        err: "Informe um JSON estruturalmente válido",
        features_title: "Funcionalidades",
        how_to_use_title: "Como Usar",
        hiw_1_title: "Cole seu JSON",
        hiw_1_desc: "Cole ou arraste seu arquivo JSON bruto diretamente no editor.",
        hiw_2_title: "Validação em Tempo Real",
        hiw_2_desc: "A ferramenta valida o conteúdo em tempo real e sinaliza erros de sintaxe automaticamente.",
        hiw_3_title: "Visualização em Árvore",
        hiw_3_desc: "O JSON é transformado em uma árvore interativa e colorida para facilitar a navegação pelos dados.",
        use_cases_title: "Casos de Uso",
        uc_1_title: "Debug de APIs",
        uc_1_desc: "Entenda estruturas complexas de payload isolando nós e verificando relações entre objetos e arrays.",
        uc_2_title: "Validação de Configurações",
        uc_2_desc: "Encontre vírgulas ausentes, chaves incorretas ou arquivos de configuração mal estruturados com facilidade.",
        uc_3_title: "Apresentação de Dados",
        uc_3_desc: "Compartilhe uma visualização JSON mais organizada em reuniões técnicas ou durante análises em equipe.",
        faq_title: "Perguntas e Respostas",
        faq_1_q: "O meu JSON fica salvo nos servidores do site?",
        faq_1_a: "Não. O processamento acontece 100% no seu navegador. Nós não transmitimos nem armazenamos seu JSON em nossos servidores, garantindo total privacidade.",
        faq_2_q: "Consigo recolher partes grandes da árvore para facilitar a leitura?",
        faq_2_a: "Sim. Você pode expandir ou recolher objetos e arrays para explorar a hierarquia do JSON com mais clareza.",
        faq_3_q: "A ferramenta localiza vírgulas e aspas faltando?",
        faq_3_a: "Se o seu JSON contiver sintaxe inválida (aspas faltando, vírgulas extras, etc.), a ferramenta exibirá uma mensagem de erro e o painel visual não será gerado até que o código seja corrigido.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Visualização interativa em árvore JSON",
        f_2: "Destaque de sintaxe e campos coloridos",
        f_3: "Validação em tempo real e detecção de erros",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        m_title: "Visor de JSON Online - Visualiza y Formatea JSON Gratis",
        title: "Visor de JSON",
        meta: "Visor de JSON online gratuito. Pega o sube tu JSON y visualízalo al instante como un árbol plegable con campos en color. Sin registro.",
        info_title: "Información",
        d1: "Este visor de JSON online muestra tus datos en un formato de árbol interactivo, donde cada nodo está indentado para reflejar la jerarquía de la información. Puedes expandir o contraer cualquier grupo para centrarte en lo más importante.",
        d2: "Los campos y valores están coloreados para facilitar la lectura, y cualquier cambio en la entrada se valida al instante. Es ideal para desarrolladores que depuran APIs, validan respuestas o inspeccionan archivos de configuración, sin instalación ni registro.",
        result: "Resultado",
        plc: "Introduce el código JSON aquí o arrastra un archivo",
        err: "Ingrese un JSON estructuralmente válido",
        features_title: "Funcionalidades",
        how_to_use_title: "Cómo usar",
        hiw_1_title: "Pega tu JSON",
        hiw_1_desc: "Pega o arrastra tu archivo JSON sin formato directamente en el editor.",
        hiw_2_title: "Validación en Tiempo Real",
        hiw_2_desc: "La herramienta valida el contenido en tiempo real y señala automáticamente los errores de sintaxis.",
        hiw_3_title: "Visualización en Árbol",
        hiw_3_desc: "El JSON se transforma en un árbol interactivo y en color para facilitar la navegación por los datos.",
        use_cases_title: "Casos de Uso",
        uc_1_title: "Debug de APIs",
        uc_1_desc: "Comprende estructuras de payload complejas aislando nodos y revisando relaciones entre objetos y arrays.",
        uc_2_title: "Validación de Configuración",
        uc_2_desc: "Detecta comas faltantes, llaves incorrectas o archivos de configuración mal estructurados con facilidad.",
        uc_3_title: "Presentación de Datos",
        uc_3_desc: "Comparte una visualización JSON más ordenada durante reuniones técnicas o revisiones en equipo.",
        faq_title: "Preguntas y Respuestas",
        faq_1_q: "¿Se guarda mi código JSON en algún lugar?",
        faq_1_a: "No. Todo el procesamiento se realiza en tu navegador. No almacenamos ni transmitimos tu código JSON a nuestros servidores.",
        faq_2_q: "¿Puedo contraer partes del árbol para facilitar la lectura?",
        faq_2_a: "Sí. Puedes expandir o contraer objetos y arrays para explorar la jerarquía del JSON con más claridad.",
        faq_3_q: "¿El visor detecta errores en el JSON?",
        faq_3_a: "Sí. Si tu JSON tiene errores de sintaxis (comillas o comas faltantes, corchetes incorrectos), aparecerá un bloque rojo de alerta y el árbol no se mostrará hasta que lo corrijas.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Visualización interactiva en árbol JSON",
        f_2: "Resaltado de sintaxis y campos coloreados",
        f_3: "Validación en tiempo real y detección de errores",
        f_4: "Sin necesidad de registro ni instalación"
    },
    fr: {
        m_title: "JSON Viewer en Ligne - Visualisez et Formatez Gratuit",
        title: "JSON Viewer en Ligne",
        meta: "JSON Viewer en ligne gratuit. Collez ou importez votre JSON et visualisez-le instantanément sous forme d'arbre repliable avec champs en couleur.",
        info_title: "Information",
        d1: "Ce JSON Viewer en ligne affiche vos données dans un format d'arbre interactif, où chaque nœud est indenté pour refléter la hiérarchie des informations. Vous pouvez développer ou replier chaque groupe pour vous concentrer sur l'essentiel.",
        d2: "Les champs et les valeurs sont colorés pour faciliter la lecture, et chaque modification de l'entrée est validée instantanément. Idéal pour les développeurs qui déboguent des API, valident des réponses ou inspectent des fichiers de configuration, sans installation ni inscription.",
        result: "Résultat",
        plc: "Insérez le code JSON ici ou faites glisser un fichier",
        err: "Fournissez un JSON syntaxiquement valide",
        features_title: "Fonctionnalités",
        how_to_use_title: "Comment utiliser",
        hiw_1_title: "Collez Votre JSON",
        hiw_1_desc: "Collez ou faites glisser votre fichier JSON brut directement dans l'éditeur.",
        hiw_2_title: "Validation en temps réel",
        hiw_2_desc: "L'outil valide le contenu en temps réel et signale automatiquement les erreurs de syntaxe.",
        hiw_3_title: "Visualisation en Arbre",
        hiw_3_desc: "Le JSON est transformé en arbre interactif et coloré pour faciliter la navigation dans les données.",
        use_cases_title: "Cas d'Utilisation",
        uc_1_title: "Débogage d'API",
        uc_1_desc: "Comprenez des structures de payload complexes en isolant les nœuds et en vérifiant les relations entre objets et tableaux.",
        uc_2_title: "Vérification de Configuration",
        uc_2_desc: "Repérez facilement les virgules manquantes, les accolades incorrectes ou les fichiers de configuration mal structurés.",
        uc_3_title: "Présentation des Données",
        uc_3_desc: "Partagez une vue JSON plus claire pendant des réunions techniques ou des revues en équipe.",
        faq_title: "Questions et Réponses",
        faq_1_q: "Mon JSON est-il enregistré sur vos serveurs ?",
        faq_1_a: "Non. Tout le traitement se fait directement dans votre navigateur. Nous ne transmettons ni ne stockons vos données JSON sur nos serveurs.",
        faq_2_q: "Puis-je replier certaines parties de l'arbre pour faciliter la lecture ?",
        faq_2_a: "Oui. Vous pouvez développer ou replier les objets et les tableaux pour explorer la hiérarchie du JSON plus facilement.",
        faq_3_q: "Le visualiseur détecte-t-il les erreurs JSON ?",
        faq_3_a: "Oui. Si votre JSON contient une erreur de syntaxe (guillemets manquants, virgules en trop, crochets incorrects, etc.), l'outil affiche un message d'erreur et empêche le rendu de l'arbre.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Visualisation interactive en arbre JSON",
        f_2: "Coloration syntaxique et champs colorés",
        f_3: "Validation en temps réel et détection d'erreurs",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        m_title: "Visualizzatore JSON Online - Visualizza e Formatta JSON Gratis",
        title: "Visualizzatore JSON",
        meta: "Visualizzatore JSON online gratuito. Incolla il tuo JSON e visualizzalo istantaneamente come albero espandibile con campi colorati. Senza registrazione.",
        info_title: "Informazioni",
        d1: "Questo visualizzatore JSON online mostra i tuoi dati in un formato ad albero interattivo, dove ogni nodo è indentato per riflettere la gerarchia dei dati. Puoi espandere o comprimere qualsiasi gruppo.",
        d2: "I campi e i valori sono colorati per una rapida identificazione. Ideale per sviluppatori che debuggano API, validano risposte o ispezionano file di configurazione — senza installazione né registrazione.",
        result: "Risultato",
        plc: "Incolla il codice JSON qui o trascina un file",
        err: "JSON non valido",
        features_title: "Funzionalità",
        how_to_use_title: "Come usare",
        hiw_1_title: "Incolla il JSON",
        hiw_1_desc: "Incolla o trascina il tuo file JSON grezzo nell'editor.",
        hiw_2_title: "Validazione in Tempo Reale",
        hiw_2_desc: "Lo strumento valida il codice in tempo reale, segnalando eventuali errori di sintassi.",
        hiw_3_title: "Visualizzazione ad Albero",
        hiw_3_desc: "Il JSON viene trasformato in un albero interattivo, colorato e navigabile per una lettura semplice.",
        use_cases_title: "Casi d'Uso",
        uc_1_title: "Debug di API",
        uc_1_desc: "Comprendi la struttura di payload complessi isolando nodi e verificando le relazioni padre-figlio.",
        uc_2_title: "Controllo di Configurazioni",
        uc_2_desc: "Trova facilmente virgole mancanti, parentesi errate o file di impostazioni mal strutturati.",
        uc_3_title: "Presentazioni Tecniche",
        uc_3_desc: "Condividi lo schermo durante riunioni tecniche con una visualizzazione JSON ordinata e comprimibile.",
        faq_title: "Domande e Risposte",
        faq_1_q: "Il mio JSON viene salvato sui vostri server?",
        faq_1_a: "No. L'elaborazione avviene interamente nel tuo browser. Non trasmettiamo né archiviamo i tuoi dati JSON sui nostri server, garantendo la massima privacy.",
        faq_2_q: "Posso copiare singole parti del JSON?",
        faq_2_a: "Sì. Interagendo direttamente con l'albero generato, puoi copiare nodi, array o sotto-oggetti specifici senza dover analizzare l'intero testo grezzo.",
        faq_3_q: "Il visualizzatore segnala errori nel JSON?",
        faq_3_a: "Sì. Se il JSON è malformato (virgolette mancanti, virgole finali, ecc.), lo strumento mostra un messaggio di errore e blocca il rendering dell'albero.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Visualizzazione interattiva ad albero JSON",
        f_2: "Evidenziazione della sintassi e campi colorati",
        f_3: "Validazione in tempo reale e rilevamento errori",
        f_4: "Nessuna registrazione o installazione richiesta"
    },
    id: {
        m_title: "Penampil JSON Online - Visualisasi & Format Pohon JSON",
        title: "Penampil JSON",
        meta: "Penampil JSON online gratis. Tempelkan JSON Anda dan lihat strukturnya secara instan sebagai pohon berwarna yang dapat dilipat. Tanpa pendaftaran.",
        info_title: "Informasi",
        d1: "Penampil JSON online ini menampilkan data dalam format pohon interaktif, di mana setiap node diindentasi untuk mencerminkan hierarki data. Anda dapat memperluas atau menciutkan kelompok mana pun.",
        d2: "Kolom dan nilai diberi kode warna untuk identifikasi cepat. Ideal untuk developer yang melakukan debug API, memvalidasi respons, atau memeriksa file konfigurasi — tanpa instalasi maupun pendaftaran.",
        result: "Hasil",
        plc: "Tempelkan kode JSON di sini atau seret file",
        err: "Masukkan JSON yang valid",
        features_title: "Fitur",
        how_to_use_title: "Cara menggunakan",
        hiw_1_title: "Tempel JSON Anda",
        hiw_1_desc: "Tempelkan atau seret file JSON Anda ke dalam editor.",
        hiw_2_title: "Validasi Real-time",
        hiw_2_desc: "Alat ini memvalidasi kode secara real-time dan menandai kesalahan sintaks secara langsung.",
        hiw_3_title: "Visualisasi Pohon",
        hiw_3_desc: "JSON Anda diubah menjadi pohon interaktif berwarna yang mudah dinavigasi.",
        use_cases_title: "Contoh Penggunaan",
        uc_1_title: "Debug API",
        uc_1_desc: "Pahami struktur payload yang kompleks dengan mengisolasi node dan memeriksa hubungan antar elemen.",
        uc_2_title: "Pengecekan Konfigurasi",
        uc_2_desc: "Temukan koma yang hilang, tanda kurung yang salah, atau file pengaturan yang tidak terstruktur dengan mudah.",
        uc_3_title: "Presentasi Data",
        uc_3_desc: "Bagikan layar saat rapat teknis dengan tampilan JSON yang rapi dan dapat dilipat.",
        faq_title: "Tanya Jawab",
        faq_1_q: "Apakah data JSON saya tersimpan di server?",
        faq_1_a: "Tidak. Semua pemrosesan dilakukan sepenuhnya di browser Anda. Kami tidak mengirim atau menyimpan data JSON Anda di server kami, sehingga privasi Anda terjaga.",
        faq_2_q: "Bisakah saya menyalin bagian tertentu dari JSON?",
        faq_2_a: "Ya. Dengan berinteraksi langsung dengan pohon yang dihasilkan, Anda dapat menyalin node, array, atau sub-objek tertentu tanpa harus memindai seluruh teks mentah.",
        faq_3_q: "Apakah penampil ini mendeteksi kesalahan JSON?",
        faq_3_a: "Ya. Jika JSON Anda tidak valid (tanda kutip hilang, koma berlebih, dll.), alat ini akan menampilkan pesan error dan mencegah pohon dirender.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Virtualisasi pohon JSON interaktif",
        f_2: "Penyorotan sintaks dan kolom berwarna",
        f_3: "Validasi real-time dan deteksi kesalahan",
        f_4: "Tanpa pendaftaran atau instalasi"
    },
    de: {
        m_title: "JSON Viewer Online - JSON kostenlos visualisieren und formatieren",
        title: "JSON Viewer",
        meta: "Kostenloser Online-JSON Viewer. Füge dein JSON ein oder lade es hoch und visualisiere es sofort als einklappbare Baumstruktur mit farbcodierten Feldern. Keine Registrierung erforderlich.",
        info_title: "Informationen",
        d1: "Dieser Online-JSON Viewer zeigt deine Daten in einem interaktiven Baumformat an, bei dem jeder Knoten eingerückt ist, um die Datenhierarchie darzustellen. Du kannst jede Gruppe ein- oder ausklappen, um dich auf die wichtigen Informationen zu konzentrieren.",
        d2: "Felder und Werte sind farbcodiert, damit du sie schnell erfassen kannst. Jede Änderung an der Eingabe wird sofort in der Visualisierung übernommen. Ideal für Entwickler, die APIs debuggen, Antworten validieren oder Konfigurationsdateien prüfen, ohne Installation oder Anmeldung.",
        result: "Ergebnis",
        plc: "JSON-Code hier einfügen oder eine Datei ziehen",
        err: "Gib ein gültiges JSON ein",
        features_title: "Funktionen",
        how_to_use_title: "So verwendest du das Tool",
        hiw_1_title: "JSON einfügen",
        hiw_1_desc: "Füge dein rohes JSON ein oder ziehe die JSON-Datei direkt in den Editor.",
        hiw_2_title: "Sofortige Validierung",
        hiw_2_desc: "Das Tool validiert deinen Code schnell und zeigt Fehler dynamisch an.",
        hiw_3_title: "Baumvisualisierung",
        hiw_3_desc: "Es erzeugt eine vollständig durchsuchbare, farbcodierte und interaktive Baumansicht für leichteres Lesen der Daten.",
        use_cases_title: "Anwendungsfälle",
        uc_1_title: "API-Debugging",
        uc_1_desc: "Verstehe umfangreiche Payload-Strukturen, indem du Knoten isolierst und Eltern-Kind-Beziehungen prüfst.",
        uc_2_title: "Konfigurationsprüfung",
        uc_2_desc: "Finde fehlende Kommas, falsche Klammern oder schlecht strukturierte Einstellungsdateien mühelos.",
        uc_3_title: "Datenpräsentation",
        uc_3_desc: "Teile deinen Bildschirm in technischen Meetings mit einer bereinigten und einklappbaren JSON-Ansicht.",
        faq_title: "Fragen und Antworten",
        faq_1_q: "Werden meine JSON-Daten auf dem Server gespeichert?",
        faq_1_a: "Nein. Die Verarbeitung erfolgt ausschließlich in deinem Browser. Wir übertragen oder speichern deine JSON-Objekte nicht auf unseren Servern und wahren so deine Privatsphäre.",
        faq_2_q: "Kann ich einzelne Teile des JSON kopieren?",
        faq_2_a: "Ja. Durch direkte Interaktion mit dem erzeugten JSON-Baum kannst du bestimmte Knoten, Arrays oder Unterobjekte kopieren, ohne den gesamten Rohtext zu durchsuchen.",
        faq_3_q: "Zeigt der Betrachter JSON-Fehler an?",
        faq_3_a: "Ja. Wenn dein JSON fehlerhaft ist, etwa durch fehlende Anführungszeichen oder zusätzliche Kommas, zeigt das Tool eine direkte Syntaxfehlermeldung an und verhindert die Baumdarstellung.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Interaktive JSON-Baumvirtualisierung",
        f_2: "Syntaxhervorhebung und farbcodierte Felder",
        f_3: "Echtzeitvalidierung und Fehlererkennung",
        f_4: "Keine Registrierung oder Installation erforderlich"
    },
    nl: {
        m_title: "JSON-viewer online - Visualiseer & formatteer JSON gratis",
        title: "JSON-viewer",
        meta: "Gratis online JSON-viewer. Plak of upload je JSON en visualiseer het direct als een inklapbare boomstructuur met kleurgecodeerde velden. Geen registratie vereist.",
        info_title: "Informatie",
        d1: "Deze online JSON-viewer geeft je gegevens weer in een interactief boomformaat, waarbij elke node is ingesprongen om de gegevenshiërarchie te weerspiegelen. Je kunt elke groep uit- of inklappen om je te concentreren op de informatie die er toe doet.",
        d2: "Velden en waarden zijn kleurgecodeerd voor snelle identificatie, en elke wijziging in de invoer wordt direct weerspiegeld in de visualisatie. Ideaal voor ontwikkelaars die API's debuggen, responses valideren of configuratiebestanden inspecteren — geen installatie of aanmelding nodig.",
        result: "Resultaat",
        plc: "Voeg de JSON-code hier in of sleep een bestand",
        err: "Zorg voor een geldige JSON",
        features_title: "Kenmerken",
        how_to_use_title: "Hoe te gebruiken",
        hiw_1_title: "Plak je JSON",
        hiw_1_desc: "Plak of sleep je ruwe JSON-bestand eenvoudig in de editor.",
        hiw_2_title: "Directe verificatie",
        hiw_2_desc: "De tool valideert je code snel en geeft fouten dynamisch aan.",
        hiw_3_title: "Boomvisualisatie",
        hiw_3_desc: "Het genereert een volledig doorzoekbare, kleurgecodeerde interactieve boom voor het eenvoudig lezen van gegevens.",
        use_cases_title: "Gebruiksscenario's",
        uc_1_title: "API-debugging",
        uc_1_desc: "Begrijp uitgebreide payload-structuren door nodes te isoleren en ouder-kindrelaties te controleren.",
        uc_2_title: "Configuratiecontrole",
        uc_2_desc: "Vind moeiteloos ontbrekende komma's, verkeerde haken of slecht gestructureerde instellingenbestanden.",
        uc_3_title: "Gegevenspresentatie",
        uc_3_desc: "Deel je scherm eenvoudig tijdens technische vergaderingen met een opgeschoonde en inklapbare JSON-grafiek.",
        faq_title: "Vragen & Antwoorden",
        faq_1_q: "Worden mijn JSON-gegevens op de server opgeslagen?",
        faq_1_a: "Nee. De verwerking vindt strikt plaats in je browservenster. We verzenden of bewaren je JSON-objecten niet op onze servers, wat totale privacy garandeert.",
        faq_2_q: "Kan ik afzonderlijke delen van de JSON kopiëren?",
        faq_2_a: "Ja. Door direct te communiceren met de gegenereerde JSON-boom, kun je specifieke nodes, arrays of sub-objecten kopiëren zonder de volledige ruwe tekst te hoeven parsen.",
        faq_3_q: "Geeft de viewer JSON-fouten aan?",
        faq_3_a: "Ja. Als je JSON-payload misvormd is (ontbrekende aanhalingstekens, overtollige komma's, enz.), geeft de tool een directe rode syntactische foutmelding die de render van de boom voorkomt.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Interactieve JSON-boomvirtualisatie",
        f_2: "Syntaxis-highlighting en kleurgecodeerde velden",
        f_3: "Real-time validatie en foutdetectie",
        f_4: "Geen registratie of installatie vereist"
    },
    ru: {
        m_title: "JSON Viewer Онлайн - Визуализация и форматирование JSON бесплатно",
        title: "JSON Viewer",
        meta: "Бесплатный онлайн JSON Viewer. Вставьте или загрузите ваш JSON и мгновенно визуализируйте его в виде раскрывающегося дерева с цветовым выделением полей. Регистрация не требуется.",
        info_title: "Информация",
        d1: "Этот онлайн JSON Viewer отображает ваши данные в формате интерактивного дерева, где каждый узел имеет отступ для отражения иерархии данных. Вы можете разворачивать или сворачивать любую группу, чтобы сосредоточиться на нужной информации.",
        d2: "Поля и значения выделены цветом для быстрой идентификации, а любые изменения, внесенные в поле ввода, мгновенно отражаются в визуализации. Идеально подходит для разработчиков, отлаживающих API, проверяющих ответы или инспектирующих файлы конфигурации — без необходимости установки и регистрации.",
        result: "Результат",
        plc: "Вставьте код JSON сюда или перетащите файл",
        err: "Предоставьте корректный JSON",
        features_title: "Возможности",
        how_to_use_title: "Как использовать",
        hiw_1_title: "Вставьте ваш JSON",
        hiw_1_desc: "Просто вставьте или перетащите исходный JSON-файл в редактор.",
        hiw_2_title: "Мгновенная проверка",
        hiw_2_desc: "Инструмент быстро проверяет ваш код, динамически указывая на синтаксические ошибки.",
        hiw_3_title: "Дерево визуализации",
        hiw_3_desc: "Генерирует полностью интерактивное дерево с цветовым кодированием для удобного чтения данных.",
        use_cases_title: "Примеры использования",
        uc_1_title: "Отладка API",
        uc_1_desc: "Понимайте сложные структуры данных, изолируя узлы и проверяя отношения между родительскими и дочерними элементами.",
        uc_2_title: "Проверка конфигураций",
        uc_2_desc: "Легко находите пропущенные запятые, неверные скобки или плохо структурированные файлы настроек.",
        uc_3_title: "Презентация данных",
        uc_3_desc: "Легко делитесь экраном во время технических встреч со структурированным и сворачиваемым графическим представлением JSON.",
        faq_title: "Вопросы и ответы",
        faq_1_q: "Сохраняются ли мои JSON-данные на сервере?",
        faq_1_a: "Нет. Обработка происходит строго внутри вашего браузера. Мы не передаем и не храним ваши JSON-объекты на наших серверах, гарантируя полную конфиденциальность.",
        faq_2_q: "Могу ли я сворачивать отдельные части дерева для удобства?",
        faq_2_a: "Да. Вы можете разворачивать или сворачивать объекты и массивы, чтобы более наглядно исследовать иерархию JSON.",
        faq_3_q: "Указывает ли просмотрщик на синтаксические ошибки JSON?",
        faq_3_a: "Да. Если ваш JSON-код отформатирован неверно (пропущены кавычки, лишние запятые, неверные скобки и т. д.), инструмент отобразит красное окно с ошибкой и заблокирует рендеринг дерева.",
        see1: "XML → JSON",
        see2: "JSON → XML",
        see3: "MD5",
        see4: "Bcrypt",
        f_1: "Интерактивная визуализация дерева JSON",
        f_2: "Подсветка синтаксиса и цветовое кодирование полей",
        f_3: "Валидация в реальном времени и обнаружение ошибок",
        f_4: "Не требуется регистрация или установка"
    }
}
</i18n>
