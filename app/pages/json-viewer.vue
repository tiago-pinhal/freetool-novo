<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/jsnview/build/index.min.js', {
  trigger: 'client'
})

const { t, locale } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()

// JSON-LD Metadata
usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  type: 'tool',
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') }
  ]
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ],
  link: [
    { rel: 'stylesheet', href: '/css/jsnview.css' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            "name": t('title'),
            "description": t('meta'),
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": [
              "Interactive JSON tree virtualization",
              "Syntax highlighting and color-coded fields",
              "Real-time validation and error detection",
              "No registration or installation required"
            ]
          },
          {
            "@type": "HowTo",
            "name": t('how_it_works_title'),
            "step": [
              { "@type": "HowToStep", "position": 1, "name": t('hiw_1_title'), "text": t('hiw_1_desc') },
              { "@type": "HowToStep", "position": 2, "name": t('hiw_2_title'), "text": t('hiw_2_desc') },
              { "@type": "HowToStep", "position": 3, "name": t('hiw_3_title'), "text": t('hiw_3_desc') }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": t('faq_1_q'),
                "acceptedAnswer": { "@type": "Answer", "text": t('faq_1_a') }
              },
              {
                "@type": "Question",
                "name": t('faq_2_q'),
                "acceptedAnswer": { "@type": "Answer", "text": t('faq_2_a') }
              },
              {
                "@type": "Question",
                "name": t('faq_3_q'),
                "acceptedAnswer": { "@type": "Answer", "text": t('faq_3_a') }
              }
            ]
          }
        ]
      })
    }
  ]
})

// Tool State
const state = reactive({ 
  hasCode: false, 
  loaded: false, 
  error: false, 
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
  } catch (e) {
    state.error = true
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
    id: '/penampil-json'
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
        <div class="flex items-center gap-2 text-sm font-bold text-base-content/60 uppercase tracking-wider">
          <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
          {{ t('viewer') }}
        </div>
        <div 
          ref="viewerRef"
          id="viewer" 
          class="rounded-2xl border-2 border-base-content/10 p-6 bg-[#002240] min-h-[10rem] max-h-[50rem] overflow-y-auto"
        ></div>
      </div>
        
      <!-- Error Message -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="state.error && state.hasCode" class="alert alert-error shadow-lg border-none rounded-2xl text-white">
          <Icon name="heroicons:x-circle-20-solid" class="w-6 h-6" />
          <span class="font-bold">{{ t('err') }}</span>
        </div>
      </Transition>
    </div>

    <!-- Info Section Content -->
    <template #info>
      <div class="space-y-12">
        <!-- Main Description -->
        <div class="prose prose-sm max-w-none text-base-content/70 leading-relaxed">
          <p class="text-lg">{{ t('d1') }} {{ t('d2') }}</p>
        </div>

        <!-- How It Works -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Icon name="heroicons:light-bulb" class="text-primary" />
            {{ t('how_it_works_title') }}
          </h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-base-200/50 p-6 rounded-2xl border border-base-content/5 hover:border-primary/20 transition-colors group">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span class="font-bold text-primary text-xl">1</span>
              </div>
              <h3 class="font-bold text-base-content mb-2">{{ t('hiw_1_title') }}</h3>
              <p class="text-sm text-base-content/60 leading-relaxed">{{ t('hiw_1_desc') }}</p>
            </div>
            <div class="bg-base-200/50 p-6 rounded-2xl border border-base-content/5 hover:border-primary/20 transition-colors group">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span class="font-bold text-primary text-xl">2</span>
              </div>
              <h3 class="font-bold text-base-content mb-2">{{ t('hiw_2_title') }}</h3>
              <p class="text-sm text-base-content/60 leading-relaxed">{{ t('hiw_2_desc') }}</p>
            </div>
            <div class="bg-base-200/50 p-6 rounded-2xl border border-base-content/5 hover:border-primary/20 transition-colors group">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span class="font-bold text-primary text-xl">3</span>
              </div>
              <h3 class="font-bold text-base-content mb-2">{{ t('hiw_3_title') }}</h3>
              <p class="text-sm text-base-content/60 leading-relaxed">{{ t('hiw_3_desc') }}</p>
            </div>
          </div>
        </section>

        <!-- Use Cases -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Icon name="heroicons:briefcase" class="text-primary" />
            {{ t('use_cases_title') }}
          </h2>
          <div class="bg-base-200/30 rounded-3xl p-8 border border-base-content/5">
            <ul class="grid sm:grid-cols-2 gap-6 list-none p-0 m-0">
              <li class="flex gap-4">
                <div class="mt-1"><Icon name="heroicons:check-circle" class="text-primary w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_1_title') }}</strong>
                  <span class="text-sm text-base-content/60 leading-relaxed">{{ t('uc_1_desc') }}</span>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="mt-1"><Icon name="heroicons:check-circle" class="text-primary w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_2_title') }}</strong>
                  <span class="text-sm text-base-content/60 leading-relaxed">{{ t('uc_2_desc') }}</span>
                </div>
              </li>
              <li class="flex gap-4 sm:col-span-2">
                <div class="mt-1"><Icon name="heroicons:check-circle" class="text-primary w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_3_title') }}</strong>
                  <span class="text-sm text-base-content/60 leading-relaxed">{{ t('uc_3_desc') }}</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- FAQ Section -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Icon name="heroicons:question-mark-circle" class="text-primary" />
            {{ t('faq_title') }}
          </h2>
          <div class="space-y-4">
            <div class="collapse collapse-arrow bg-base-200/50 border border-base-content/5 rounded-2xl">
              <input type="radio" name="faq-accordion" checked="checked" /> 
              <div class="collapse-title text-lg font-bold text-base-content">
                {{ t('faq_1_q') }}
              </div>
              <div class="collapse-content text-base-content/60 leading-relaxed pb-4">
                <p>{{ t('faq_1_a') }}</p>
              </div>
            </div>
            <div class="collapse collapse-arrow bg-base-200/50 border border-base-content/5 rounded-2xl">
              <input type="radio" name="faq-accordion" /> 
              <div class="collapse-title text-lg font-bold text-base-content">
                {{ t('faq_2_q') }}
              </div>
              <div class="collapse-content text-base-content/60 leading-relaxed pb-4">
                <p>{{ t('faq_2_a') }}</p>
              </div>
            </div>
            <div class="collapse collapse-arrow bg-base-200/50 border border-base-content/5 rounded-2xl">
              <input type="radio" name="faq-accordion" /> 
              <div class="collapse-title text-lg font-bold text-base-content">
                {{ t('faq_3_q') }}
              </div>
              <div class="collapse-content text-base-content/60 leading-relaxed pb-4">
                <p>{{ t('faq_3_a') }}</p>
              </div>
            </div>
          </div>
        </section>
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
        viewer: "Viewer",
        plc: "Insert the JSON code here or drag a file",
        err: "Provide a valid JSON",
        how_it_works_title: "How It Works",
        hiw_1_title: "Paste Your JSON",
        hiw_1_desc: "Simply paste or drag your raw JSON file into the editor.",
        hiw_2_title: "Instant Verification",
        hiw_2_desc: "The tool quickly validates your code, indicating errors dynamically.",
        hiw_3_title: "Tree Visualization",
        hiw_3_desc: "It generates a fully browsable, color-coded interactive tree for easy data reading.",
        use_cases_title: "Common Use Cases",
        uc_1_title: "API Debugging",
        uc_1_desc: "Understand extensive payload structures by isolating nodes and checking parent-child relationships.",
        uc_2_title: "Configuration Checking",
        uc_2_desc: "Find missing commas, wrong brackets, or badly structured settings files effortlessly.",
        uc_3_title: "Data Presentation",
        uc_3_desc: "Share screen easily during technical meetings with a sanitized and collapsible JSON graphic.",
        faq_title: "Frequently Asked Questions",
        faq_1_q: "Is my JSON data saved on the server?",
        faq_1_a: "No. The processing happens strictly inside your browser window. We do not transmit or store your JSON objects on our servers, ensuring total privacy.",
        faq_2_q: "Can I copy individual parts of the JSON?",
        faq_2_a: "Yes. By interacting directly with the generated JSON tree, you can copy specific nodes, arrays, or sub-objects without parsing the entire raw text.",
        faq_3_q: "Does the viewer indicate JSON errors?",
        faq_3_a: "Yes. If your JSON payload is malformed (missing quotes, trailing commas, etc.), the tool will display a direct red syntax error flag preventing the tree render.",
        see1: "XML to JSON Converter",
        see2: "JSON to XML Converter",
        see3: "MD5 Hash Generator",
        see4: "Bcrypt Generator"
    },
    pt: {
        m_title: "Visualizador de JSON Online - Visualize e Formate JSON de Graça",
        title: "Visualizador de JSON",
        meta: "Visualizador de JSON online gratuito. Cole ou envie seu JSON e visualize instantaneamente como uma árvore recolhível com campos coloridos. Sem cadastro.",
        info_title: "Informações",
        d1: "Este visualizador de JSON online exibe seus dados em um formato de árvore interativa, onde cada nó reflete visualmente a hierarquia dos dados. Você pode expandir ou recolher grupos longos.",
        d2: "Campos e valores são coloridos para identificação rápida, e qualquer alteração feita na entrada é validada instantaneamente. Ideal para desenvolvedores depurando APIs sem instalação ou cadastro.",
        viewer: "Árvore de Resultados",
        plc: "Insira o código JSON aqui ou arraste um arquivo",
        err: "Informe um JSON estruturalmente válido",
        how_it_works_title: "Como Funciona",
        hiw_1_title: "Cole seu JSON",
        hiw_1_desc: "Cole seu código cru direto no editor interativo.",
        hiw_2_title: "Validação Imediata",
        hiw_2_desc: "A ferramenta acusa erro de sintaxe em tempo real, sem refresh de página.",
        hiw_3_title: "Visualização em Árvore",
        hiw_3_desc: "O código é desmembrado e colorizado, permitindo que você feche as chaves grandes e navegue.",
        use_cases_title: "Principais Casos de Uso",
        uc_1_title: "Depuração de APIs (Endpoints)",
        uc_1_desc: "Entenda objetos complexos retornados em APIs isolando arrays e abrindo apenas variáveis chaves.",
        uc_2_title: "Validação de Configurações",
        uc_2_desc: "Descubra aquela vírgula esquecida ou chaves mal fechadas em arquivos de setting críticos.",
        uc_3_title: "Análise Visual",
        uc_3_desc: "Enxergue dados aninhados sem embaralhamento mental lendo logs crus extensos.",
        faq_title: "Perguntas Frequentes (FAQ)",
        faq_1_q: "O meu JSON fica salvo nos servidores do site?",
        faq_1_a: "Não. A leitura, validação e estruturação da árvore interativa ocorre 100% no seu navegador de internet, oferecendo o mais alto nível de segurança para logs confidenciais.",
        faq_2_q: "Consigo minimizar blocos grandes para focar na leitura?",
        faq_2_a: "Sim. A grande vantagem de um Visualizador (Viewer) ao invés de um arquivo puro é que você pode fechar todos os nós (nodes) e investigar a hierarquia do arquivo aos poucos.",
        faq_3_q: "A ferramenta localiza vírgulas e aspas faltando?",
        faq_3_a: "Se o seu JSON contiver sintaxe inválida (aspas faltando, vírgulas extras, etc.), a ferramenta exibirá uma mensagem de erro e o painel visual não será gerado até que o código seja corrigido.",
        see1: "Conversor de XML para JSON",
        see2: "Conversor de JSON para XML",
        see3: "Gerador de Hash MD5",
        see4: "Gerador Bcrypt"
    },
    es: {
        m_title: "Visor de JSON Online - Visualiza y Formatea JSON Gratis",
        title: "Visor de JSON",
        meta: "Visor de JSON online gratuito. Pega o sube tu JSON y visualízalo al instante como un árbol plegable con campos en color. Sin registro.",
        info_title: "Información",
        d1: "Este visor de JSON online muestra tus datos en un formato de árbol interactivo, donde cada nodo está indentado para reflejar la jerarquía. Puedes expandir o colapsar nodos extensos.",
        d2: "Los campos y valores están coloreados para una identificación rápida. Ideal para desarrolladores que depuran APIs o inspeccionan archivos de configuración sin instalación.",
        viewer: "Árbol Resultante",
        plc: "Introduce el código JSON aquí o arrastra un archivo",
        err: "Ingrese un JSON estructuralmente válido",
        how_it_works_title: "Cómo Funciona",
        hiw_1_title: "Pega tu Código",
        hiw_1_desc: "Pega el bloque JSON crudo directamente en el editor.",
        hiw_2_title: "Verificación en Vivo",
        hiw_2_desc: "El sistema señala un fallo de sintaxis sin refrescar la ventana.",
        hiw_3_title: "Navegación Visual",
        hiw_3_desc: "Se desglosa la información para leer de forma jerárquica con colores específicos.",
        use_cases_title: "Usos Cotidianos",
        uc_1_title: "Depuración de Endpoints",
        uc_1_desc: "Lee payloads masivos aislando los datos hijos o padres para no confundirte.",
        uc_2_title: "Detección de Sintaxis",
        uc_2_desc: "Halla de un vistazo comillas o corchetes extraviados que rompen tus scripts.",
        uc_3_title: "Exposición de Datos",
        uc_3_desc: "Presenta las tramas JSON lógicamente estructuradas ante compañeros menos técnicos.",
        faq_title: "Preguntas Frecuentes",
        faq_1_q: "¿Se guarda mi código JSON en algún lugar?",
        faq_1_a: "No. Todo el procesamiento se realiza en tu navegador. No almacenamos ni transmitimos tu código JSON a nuestros servidores.",
        faq_2_q: "¿Puedo contraer o colapsar parte del árbol?",
        faq_2_a: "Sí. Cada objeto o arreglo principal posee flechas desplegables que admiten cierres y aperturas modulares para facilitarte la inmersión.",
        faq_3_q: "¿El visor detecta errores en el JSON?",
        faq_3_a: "Sí. Si tu JSON tiene errores de sintaxis (comillas o comas faltantes, corchetes incorrectos), aparecerá un bloque rojo de alerta y el árbol no se mostrará hasta que lo corrijas.",
        see1: "Convertidor de XML a JSON",
        see2: "Convertidor de JSON a XML",
        see3: "Generador de Hash MD5",
        see4: "Generador Bcrypt"
    },
    fr: {
        m_title: "Visualiseur JSON en Ligne - Visualisez et Formatez Gratuit",
        title: "Visualiseur JSON",
        meta: "Visualiseur JSON en ligne gratuit. Collez ou importez votre JSON et visualisez-le instantanément sous forme d'arbre repliable avec champs en couleur.",
        info_title: "Information",
        d1: "Ce visualiseur JSON en ligne affiche vos données dans un format d'arbre interactif, où chaque nœud est indenté pour refléter la hiérarchie des données.",
        d2: "Les champs et les valeurs sont colorés pour une identification rapide. Idéal pour les développeurs qui déboguent des APIs ou des fichiers de configuration sans installation.",
        viewer: "Arborescence Visuelle",
        plc: "Insérez le code JSON ici ou faites glisser un fichier",
        err: "Fournissez un JSON syntaxiquement valide",
        how_it_works_title: "Comment l'utiliser ?",
        hiw_1_title: "Saisir le Code",
        hiw_1_desc: "Copiez le JSON natif dans notre boite d'édition texte.",
        hiw_2_title: "Alerte Directe",
        hiw_2_desc: "Une fonction de validation analyse vos guillemets et virgules en temps réel avant d'autoriser l'affichage de l'arbre.",
        hiw_3_title: "Exploration Chromatique",
        hiw_3_desc: "Les données sont traduites de texte noir en blocs structurés modifiables et interactifs.",
        use_cases_title: "Scénarios Pratiques",
        uc_1_title: "Relecture d'API",
        uc_1_desc: "Analyser des requêtes de type GET complexes pour en dissocier chaque paramètre facilement.",
        uc_2_title: "Diagnostic Syntaxique",
        uc_2_desc: "Repérez instantanément les virgules manquantes ou les accolades mal fermées qui cassent vos scripts.",
        uc_3_title: "Log et Support",
        uc_3_desc: "Surfez par section de log volumineux grâce aux cloisons rétractables.",
        faq_title: "Foire Aux Questions",
        faq_1_q: "Le site sauvegarde-t-il l’historique des JSON ?",
        faq_1_a: "Aucunement. L'analyse structurale se génère organiquement au niveau de votre navigateur via Javascript. Nous n'archivons ni ne transmettons les extraits collés.",
        faq_2_q: "Peut-on masquer un ensemble volumineux lors de la lecture ?",
        faq_2_a: "C'est l'essence de cet outil : Il rend le survol dynamique. Repoussez des tableaux à listes massives pour clarifier les paramètres qui vous manquent.",
        faq_3_q: "Le visualiseur détecte-t-il les erreurs d'inattention ?",
        faq_3_a: "La fenêtre de visualisation refusera de compiler un tableau si la saisie manque de formalisme (oubli de parenthèses ou de crochets), ce qui sécurise globalement le diagnostic.",
        see1: "Convertisseur de XML vers JSON",
        see2: "Convertisseur de JSON vers XML",
        see3: "Générateur de Hash MD5",
        see4: "Générateur Bcrypt"
    },
    it: {
        m_title: "Visualizzatore JSON Online - Visualizza e Formatta JSON Gratis",
        title: "Visualizzatore JSON",
        meta: "Visualizzatore JSON online gratuito. Incolla il tuo JSON e visualizzalo istantaneamente come albero espandibile con campi colorati. Senza registrazione.",
        info_title: "Informazioni",
        d1: "Questo visualizzatore JSON online mostra i tuoi dati in un formato ad albero interattivo, dove ogni nodo è indentato per riflettere la gerarchia dei dati. Puoi espandere o comprimere qualsiasi gruppo.",
        d2: "I campi e i valori sono colorati per una rapida identificazione. Ideale per sviluppatori che debuggano API, validano risposte o ispezionano file di configurazione — senza installazione né registrazione.",
        viewer: "Albero Visivo",
        plc: "Incolla il codice JSON qui o trascina un file",
        err: "JSON non valido",
        how_it_works_title: "Come Funziona",
        hiw_1_title: "Incolla il JSON",
        hiw_1_desc: "Incolla o trascina il tuo file JSON grezzo nell'editor.",
        hiw_2_title: "Validazione Immediata",
        hiw_2_desc: "Lo strumento valida il codice in tempo reale, segnalando eventuali errori di sintassi.",
        hiw_3_title: "Visualizzazione ad Albero",
        hiw_3_desc: "Il JSON viene trasformato in un albero interattivo, colorato e navigabile per una lettura semplice.",
        use_cases_title: "Casi d'Uso Comuni",
        uc_1_title: "Debug di API",
        uc_1_desc: "Comprendi la struttura di payload complessi isolando nodi e verificando le relazioni padre-figlio.",
        uc_2_title: "Controllo di Configurazioni",
        uc_2_desc: "Trova facilmente virgole mancanti, parentesi errate o file di impostazioni mal strutturati.",
        uc_3_title: "Presentazioni Tecniche",
        uc_3_desc: "Condividi lo schermo durante riunioni tecniche con una visualizzazione JSON ordinata e comprimibile.",
        faq_title: "Domande Frequenti (FAQ)",
        faq_1_q: "Il mio JSON viene salvato sui vostri server?",
        faq_1_a: "No. L'elaborazione avviene interamente nel tuo browser. Non trasmettiamo né archiviamo i tuoi dati JSON sui nostri server, garantendo la massima privacy.",
        faq_2_q: "Posso copiare singole parti del JSON?",
        faq_2_a: "Sì. Interagendo direttamente con l'albero generato, puoi copiare nodi, array o sotto-oggetti specifici senza dover analizzare l'intero testo grezzo.",
        faq_3_q: "Il visualizzatore segnala errori nel JSON?",
        faq_3_a: "Sì. Se il JSON è malformato (virgolette mancanti, virgole finali, ecc.), lo strumento mostra un messaggio di errore e blocca il rendering dell'albero.",
        see1: "Convertitore da XML a JSON",
        see2: "Convertitore da JSON a XML",
        see3: "Generatore di Hash MD5",
        see4: "Generatore Bcrypt"
    },
    id: {
        m_title: "Penampil JSON Online - Visualisasi & Format Pohon JSON",
        title: "Penampil JSON",
        meta: "Penampil JSON online gratis. Tempelkan JSON Anda dan lihat strukturnya secara instan sebagai pohon berwarna yang dapat dilipat. Tanpa pendaftaran.",
        info_title: "Informasi",
        d1: "Penampil JSON online ini menampilkan data Anda dalam format pohon interaktif, di mana setiap node diindentasi untuk mencerminkan hierarki data. Anda dapat memperluas atau menciutkan kelompok mana pun.",
        d2: "Kolom dan nilai diberi kode warna untuk identifikasi cepat. Ideal untuk developer yang men-debug API, memvalidasi respons, atau memeriksa file konfigurasi — tanpa instalasi maupun pendaftaran.",
        viewer: "Pohon Data",
        plc: "Tempelkan kode JSON di sini atau seret file",
        err: "Masukkan JSON yang valid",
        how_it_works_title: "Cara Kerja",
        hiw_1_title: "Tempel JSON Anda",
        hiw_1_desc: "Tempelkan atau seret file JSON Anda ke dalam editor.",
        hiw_2_title: "Validasi Instan",
        hiw_2_desc: "Alat ini memvalidasi kode secara real-time dan menandai kesalahan sintaks secara langsung.",
        hiw_3_title: "Visualisasi Pohon",
        hiw_3_desc: "JSON Anda diubah menjadi pohon interaktif berwarna yang mudah dinavigasi.",
        use_cases_title: "Kegunaan Utama",
        uc_1_title: "Debug API",
        uc_1_desc: "Pahami struktur payload yang kompleks dengan mengisolasi node dan memeriksa hubungan antar elemen.",
        uc_2_title: "Pengecekan Konfigurasi",
        uc_2_desc: "Temukan koma yang hilang, tanda kurung yang salah, atau file pengaturan yang tidak terstruktur dengan mudah.",
        uc_3_title: "Presentasi Data",
        uc_3_desc: "Bagikan layar saat rapat teknis dengan tampilan JSON yang rapi dan dapat dilipat.",
        faq_title: "Pertanyaan yang Sering Diajukan",
        faq_1_q: "Apakah data JSON saya tersimpan di server?",
        faq_1_a: "Tidak. Semua pemrosesan dilakukan sepenuhnya di browser Anda. Kami tidak mengirim atau menyimpan data JSON Anda di server kami, sehingga privasi Anda terjaga.",
        faq_2_q: "Bisakah saya menyalin bagian tertentu dari JSON?",
        faq_2_a: "Ya. Dengan berinteraksi langsung dengan pohon yang dihasilkan, Anda dapat menyalin node, array, o sub-objek tertentu tanpa harus memindai seluruh teks mentah.",
        faq_3_q: "Apakah penampil ini mendeteksi kesalahan JSON?",
        faq_3_a: "Ya. Jika JSON Anda tidak valid (tanda kutip hilang, koma berlebih, dll.), alat ini akan menampilkan pesan error dan mencegah pohon dirender.",
        see1: "Konverter XML ke JSON",
        see2: "Konverter JSON ke XML",
        see3: "Generator Hash MD5",
        see4: "Generator Bcrypt"
    }
}
</i18n>
