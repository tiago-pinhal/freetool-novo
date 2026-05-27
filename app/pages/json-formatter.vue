<script setup lang="ts">
useScript('https://unpkg.com/prettier@2.8.8/standalone.js', { trigger: 'client' })
useScript('https://unpkg.com/prettier@2.8.8/parser-babel.js', { trigger: 'client' })

const { t } = useI18n({ useScope: 'local' })

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

// ─── Estado Reativo ───────────────────────────────────────────────────────────
const state = reactive({
  hasCode: false,
  loaded: false,
  error: '' as string,
  ads: false,
  resetable: false,
  indentSize: 2 as 2 | 4,   // tamanho do indent: 2 ou 4 espaços
})

const editor = ref<any>(null)

// ─── Handlers de Evento ───────────────────────────────────────────────────────

/** Atualiza flag de conteúdo e limpa erro ao digitar */
function onChange() {
  state.hasCode = editor.value!.getValue() !== ''
  state.error = ''
}

/** Alterna entre formatar e resetar */
function convertOrReset() {
  state.error = ''
  state.resetable ? reset() : formatCode()
}

/**
 * Formata o JSON usando Prettier com parser 'json'.
 * O Prettier acessa o parser babel que já foi carregado via useScript CDN,
 * exposto em window.prettierPlugins.babel.
 */
function formatCode() {
  const prettierStandalone = (window as any).prettier
  const babelPlugin = (window as any).prettierPlugins?.babel

  if (!prettierStandalone || !babelPlugin) {
    // Scripts CDN ainda não carregaram — recarrega a página
    document.location.reload()
    return
  }

  const rawInput = editor.value!.getValue().trim()

  if (!rawInput) {
    state.error = t('err_empty')
    return
  }

  try {
    // Validação prévia: tenta parsear como JSON antes de enviar ao Prettier
    JSON.parse(rawInput)

    // Formata com Prettier usando o parser 'json' (via plugin babel)
    const formatted: string = prettierStandalone.format(rawInput, {
      parser: 'json',
      plugins: [babelPlugin],
      tabWidth: state.indentSize,
      printWidth: 80,
    })

    editor.value!.setValue(formatted)
    editor.value!.setReadOnly(true)
    state.resetable = true
    state.ads = true
  } catch (e: any) {
    // Erro de parse JSON ou de formatação Prettier
    state.error = `${t('err')}: ${e.message}`
  }
}

/** Reseta o editor para o estado inicial */
function reset() {
  editor.value!.setValue('')
  editor.value!.setReadOnly(false)
  state.resetable = false
  state.hasCode = false
  state.error = ''
  state.ads = false
}

/** Copia o conteúdo formatado para a área de transferência */
function copy() {
  navigator.clipboard.writeText(editor.value!.getValue())
}

// ─── Roteamento i18n ──────────────────────────────────────────────────────────
defineI18nRoute({
  paths: {
    en: '/json-formatter',
    pt: '/formatador-json',
    es: '/formateador-json',
    fr: '/formateur-json',
    it: '/formattatore-json',
    id: '/json-formatter',
    de: '/json-formatter',
    nl: '/json-formatter',
    ru: '/formatator-json'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'json-viewer' },
      { label: t('see2'), to: 'json-to-csv-converter' },
      { label: t('see3'), to: 'html-formatter' },
      { label: t('see4'), to: 'javascript-formatter' }
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

      <!-- Editor de Código -->
      <Editor
        v-show="state.loaded"
        ref="editor"
        lang="json"
        :placeholder="t('plc')"
        @onLoad="state.loaded = true"
        @onChange="onChange"
      />

      <!-- Controles: Indent + Botões de Ação -->
      <div class="flex flex-col sm:flex-row items-center gap-4">

        <!-- Seletor de tamanho de indentação (apenas quando editável) -->
        <div
          v-if="!state.resetable"
          class="flex items-center gap-2 text-sm text-base-content/70"
        >
          <span>{{ t('indent_label') }}</span>
          <div class="join">
            <button
              class="join-item btn btn-sm"
              :class="state.indentSize === 2 ? 'btn-primary' : 'btn-outline border-base-content/20'"
              @click="state.indentSize = 2"
            >
              2
            </button>
            <button
              class="join-item btn btn-sm"
              :class="state.indentSize === 4 ? 'btn-primary' : 'btn-outline border-base-content/20'"
              @click="state.indentSize = 4"
            >
              4
            </button>
          </div>
        </div>

        <!-- Botão principal: Formatar / Reset -->
        <ButtonPrimary
          @click="convertOrReset"
          :icon="state.resetable ? 'heroicons:arrow-path-20-solid' : 'heroicons:arrow-right-circle-20-solid'"
          :disabled="!state.hasCode && !state.resetable"
          :class="state.resetable ? 'btn-warning' : ''"
          class="w-full sm:w-auto"
        >
          {{ t(state.resetable ? 'rst' : 'bt') }}
        </ButtonPrimary>

        <!-- Botão de cópia — aparece após formatar -->
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

      <!-- Mensagem de Erro -->
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

    <!-- Seção Informativa -->
    <template #info>
      <div class="space-y-12">
        <div>
          <p style="white-space: pre-line;">{{ t('d1') }}</p>
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
    m_title: "JSON Formatter & Validator Online - Free Beautifier",
    title: "JSON Formatter",
    meta: "Free online JSON formatter, validator and beautifier. Format, validate and pretty print JSON instantly — 100% local, your data never leaves your browser.",
    d1: "Our online JSON formatter, validator and beautifier lets you organize, correct, and standardize JSON structures in a simple and intuitive way. With just one click, the tool analyzes the provided JSON and, if it is valid, a clean, well-formatted and pretty-printed version is automatically generated.\n\nYou can also customize the indentation between 2 or 4 spaces, improving data readability, facilitating debugging, and optimizing code maintenance.\n\nThis tool is ideal for developers who want a free JSON validator and formatter online to organize API data, configuration files, and payloads in a practical and productive manner.",
    plc: "Paste the JSON code here or drag a file",
    bt: "Format JSON",
    rst: "Start Over",
    copy: "Copy",
    err: "Invalid JSON",
    err_empty: "The editor is empty. Paste some JSON first.",
    err_label: "Could not format JSON",
    indent_label: "Indent:",
    how_it_works_title: "How It Works",
    hiw_1_title: "Paste Your JSON",
    hiw_1_desc: "Copy and paste your raw or minified JSON into the editor.",
    hiw_2_title: "Click Format",
    hiw_2_desc: "Press the Format JSON button. The tool validates and beautifies the code instantly.",
    hiw_3_title: "Copy the Result",
    hiw_3_desc: "Copy the formatted output or start over with new JSON.",
    use_cases_title: "Use Cases",
    uc_1_title: "API Response Debugging",
    uc_1_desc: "Quickly readable API responses that are otherwise returned as a single minified line.",
    uc_2_title: "Config File Editing",
    uc_2_desc: "Format JSON config files (package.json, tsconfig, etc.) for easier reading and editing.",
    uc_3_title: "Data Inspection",
    uc_3_desc: "Explore nested JSON structures from logs, databases, or third-party integrations at a glance.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is my JSON data sent to any server?",
    faq_1_a: "No. All formatting is done entirely in your browser. Your data never leaves your device.",
    faq_2_q: "What happens if my JSON has syntax errors?",
    faq_2_a: "The tool validates the JSON before formatting. If it detects a syntax error, it displays a clear error message so you can locate and fix the issue.",
    faq_3_q: "What indentation options are available?",
    faq_3_a: "You can choose between 2-space and 4-space indentation. Both are widely used — 2 spaces is common in JavaScript projects, while 4 spaces is preferred in many other environments.",
    f_1: "Instant JSON formatting and beautification",
    f_2: "Syntax validation before formatting",
    f_3: "Configurable indentation (2 or 4 spaces)",
    f_4: "No registration or installation required",
    see1: "JSON Viewer",
    see2: "JSON to CSV Converter",
    see3: "HTML Formatter",
    see4: "JavaScript Formatter"
  },
  pt: {
    m_title: "Formatador e Validador JSON Online - Embelezador JSON Grátis",
    title: "Formatador JSON",
    meta: "Formatador, validador e embelezador JSON online e gratuito. Formate, valide e visualize JSON com indentação personalizável — tudo direto no seu navegador.",
    d1: "Nosso formatador, validador e embelezador JSON online permite organizar, corrigir e padronizar estruturas JSON de forma simples e intuitiva. Com apenas um clique, é realizada a análise do JSON informado e, caso ele esteja válido, uma versão limpa, embelezada e bem estruturada é gerada automaticamente.\n\nTambém é possível personalizar a indentação entre 2 ou 4 espaços, melhorando a legibilidade dos dados, facilitando a depuração e otimizando a manutenção do código.\n\nEssa ferramenta é ideal para desenvolvedores que desejam um validador e formatador JSON online grátis para organizar dados de APIs, arquivos de configuração e payloads de maneira prática e produtiva.",
    plc: "Cole o código JSON aqui ou arraste um arquivo",
    bt: "Formatar JSON",
    rst: "Recomeçar",
    copy: "Copiar",
    err: "JSON inválido",
    err_empty: "O editor está vazio. Cole algum JSON primeiro.",
    err_label: "Não foi possível formatar o JSON",
    indent_label: "Indentação:",
    how_it_works_title: "Como Funciona",
    hiw_1_title: "Cole seu JSON",
    hiw_1_desc: "Copie e cole seu JSON bruto ou minificado no editor.",
    hiw_2_title: "Clique em Formatar",
    hiw_2_desc: "Pressione o botão Formatar JSON. A ferramenta valida e embeleza o código instantaneamente.",
    hiw_3_title: "Copie o Resultado",
    hiw_3_desc: "Copie a saída formatada ou recomece com um novo JSON.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Depuração de Respostas de API",
    uc_1_desc: "Torne legíveis respostas de API que chegam como uma única linha minificada.",
    uc_2_title: "Edição de Arquivos de Configuração",
    uc_2_desc: "Formate arquivos de configuração JSON (package.json, tsconfig, etc.) para leitura e edição mais fáceis.",
    uc_3_title: "Inspeção de Dados",
    uc_3_desc: "Explore estruturas JSON aninhadas de logs, bancos de dados ou integrações de terceiros.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Meus dados JSON são enviados para algum servidor?",
    faq_1_a: "Não. Toda a formatação é feita no seu navegador. Seus dados nunca saem do seu dispositivo.",
    faq_2_q: "O que acontece se meu JSON tiver erros de sintaxe?",
    faq_2_a: "A ferramenta valida o JSON antes de formatar. Se detectar um erro de sintaxe, exibe uma mensagem de erro clara para você localizar e corrigir o problema.",
    faq_3_q: "Quais opções de indentação estão disponíveis?",
    faq_3_a: "Você pode escolher entre indentação de 2 ou 4 espaços. Ambas são amplamente usadas — 2 espaços são comuns em projetos JavaScript, enquanto 4 espaços são preferidos em muitos outros ambientes.",
    f_1: "Formatação e embelezamento instantâneo de JSON",
    f_2: "Validação de sintaxe antes da formatação",
    f_3: "Indentação configurável (2 ou 4 espaços)",
    f_4: "Sem cadastro ou instalação necessária",
    see1: "JSON Viewer",
    see2: "Conversor de JSON para CSV",
    see3: "Formatador HTML",
    see4: "Formatador JavaScript"
  },
  es: {
    m_title: "Formateador y Validador JSON Online Gratis",
    title: "Formateador JSON",
    meta: "Formateador, validador y embellecedor JSON online y gratis. Formatea, valida y embellece tu código JSON al instante — todo se procesa localmente en tu navegador.",
    d1: "Nuestro formateador, validador y embellecedor JSON online permite organizar, corregir y estandarizar estructuras JSON de forma sencilla e intuitiva. Con solo un clic, se realiza el análisis del JSON ingresado y, si es válido, se genera automáticamente una versión limpia, embellecida y bien estructurada.\n\nTambién es posible personalizar la sangría entre 2 o 4 espacios, mejorando la legibilidad de los datos, facilitando la depuración y optimizando el mantenimiento del código.\n\nEsta herramienta es ideal para desarrolladores que buscan un validador y formateador JSON online gratis para organizar datos de APIs, archivos de configuración y payloads de manera práctica y productiva.",
    plc: "Pega el código JSON aquí o arrastra un archivo",
    bt: "Formatear JSON",
    rst: "Empezar de nuevo",
    copy: "Copiar",
    err: "JSON inválido",
    err_empty: "El editor está vacío. Pega algún JSON primero.",
    err_label: "No se pudo formatear el JSON",
    indent_label: "Indentación:",
    how_it_works_title: "Cómo Funciona",
    hiw_1_title: "Pega tu JSON",
    hiw_1_desc: "Copia y pega tu JSON en bruto o minificado en el editor.",
    hiw_2_title: "Haz clic en Formatear",
    hiw_2_desc: "Presiona el botón Formatear JSON. La herramienta valida y embellece el código al instante.",
    hiw_3_title: "Copia el Resultado",
    hiw_3_desc: "Copia la salida formateada o empieza de nuevo con un nuevo JSON.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Depuración de Respuestas de API",
    uc_1_desc: "Convierte en legibles las respuestas de API que llegan como una sola línea minificada.",
    uc_2_title: "Edición de Archivos de Configuración",
    uc_2_desc: "Formatea archivos de configuración JSON (package.json, tsconfig, etc.) para una lectura y edición más sencillas.",
    uc_3_title: "Inspección de Datos",
    uc_3_desc: "Explora estructuras JSON anidadas provenientes de logs, bases de datos o integraciones de terceros.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mis datos JSON se envían a algún servidor?",
    faq_1_a: "No. Todo el formateo se realiza en tu navegador. Tus datos nunca abandonan tu dispositivo.",
    faq_2_q: "¿Qué ocurre si mi JSON tiene errores de sintaxis?",
    faq_2_a: "La herramienta valida el JSON antes de formatear. Si detecta un error de sintaxis, muestra un mensaje de error claro para que puedas localizar y corregir el problema.",
    faq_3_q: "¿Qué opciones de indentación están disponibles?",
    faq_3_a: "Puedes elegir entre indentación de 2 o 4 espacios. Ambas son ampliamente usadas — 2 espacios son comunes en proyectos JavaScript, mientras que 4 espacios se prefieren en muchos otros entornos.",
    f_1: "Formateo y embellecimiento instantáneo de JSON",
    f_2: "Validación de sintaxis antes del formateo",
    f_3: "Indentación configurable (2 o 4 espacios)",
    f_4: "Sin registro ni instalación requerida",
    see1: "Visor de JSON",
    see2: "Convertidor de JSON a CSV",
    see3: "Formateador HTML",
    see4: "Formateador JavaScript"
  },
  fr: {
    m_title: "Formateur et Validateur JSON en Ligne - Gratuit",
    title: "Formateur JSON",
    meta: "Formateur, validateur et embellisseur JSON en ligne gratuit. Formatez, validez et embellissez votre code JSON instantanément — tout est traité localement dans votre navigateur.",
    d1: "Notre formateur, validateur et embellisseur JSON en ligne permet d'organiser, de corriger et de standardiser les structures JSON de manière simple et intuitive. En un seul clic, le JSON fourni est analysé et, s'il est valide, une version propre, embellie et bien structurée est automatiquement générée.\n\nIl est également possible de personnaliser l'indentation entre 2 ou 4 espaces, ce qui améliore la lisibilité des données, facilite le débogage et optimise la maintenance du code.\n\nCet outil est idéal pour les développeurs qui cherchent un validateur et formateur JSON en ligne gratuit pour organiser les données des API, les fichiers de configuration et les payloads de manière pratique et productive.",
    plc: "Collez le code JSON ici ou déposez un fichier",
    bt: "Formater JSON",
    rst: "Recommencer",
    copy: "Copier",
    err: "JSON invalide",
    err_empty: "L'éditeur est vide. Collez d'abord du JSON.",
    err_label: "Impossible de formater le JSON",
    indent_label: "Indentation :",
    how_it_works_title: "Comment ça fonctionne",
    hiw_1_title: "Collez votre JSON",
    hiw_1_desc: "Copiez et collez votre JSON brut ou minifié dans l'éditeur.",
    hiw_2_title: "Cliquez sur Formater",
    hiw_2_desc: "Appuyez sur le bouton Formater JSON. L'outil valide et embellit le code instantanément.",
    hiw_3_title: "Copiez le résultat",
    hiw_3_desc: "Copiez la sortie formatée ou recommencez avec un nouveau JSON.",
    use_cases_title: "Cas d'utilisation",
    uc_1_title: "Débogage de réponses d'API",
    uc_1_desc: "Rendez lisibles les réponses d'API qui arrivent sous forme d'une seule ligne minifiée.",
    uc_2_title: "Édition de fichiers de configuration",
    uc_2_desc: "Formatez les fichiers de configuration JSON (package.json, tsconfig, etc.) pour une lecture et une édition plus faciles.",
    uc_3_title: "Inspection des données",
    uc_3_desc: "Explorez les structures JSON imbriquées provenant de journaux, de bases de données ou d'intégrations tierces.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Mes données JSON sont-elles envoyées à un serveur ?",
    faq_1_a: "Non. Tout le formatage est effectué dans votre navigateur. Vos données ne quittent jamais votre appareil.",
    faq_2_q: "Que se passe-t-il si mon JSON contient des erreurs de syntaxe ?",
    faq_2_a: "L'outil valide le JSON avant de le formater. S'il détecte une erreur de syntaxe, il affiche un message d'erreur clair pour vous aider à localiser et corriger le problème.",
    faq_3_q: "Quelles options d'indentation sont disponibles ?",
    faq_3_a: "Vous pouvez choisir entre une indentation de 2 ou 4 espaces. Les deux sont largement utilisées — 2 espaces sont courants dans les projets JavaScript, tandis que 4 espaces sont préférés dans de nombreux autres environnements.",
    f_1: "Formatage et embellissement instantané du JSON",
    f_2: "Validation de la syntaxe avant le formatage",
    f_3: "Indentation configurable (2 ou 4 espaces)",
    f_4: "Sans inscription ni installation requise",
    see1: "Visualiseur JSON",
    see2: "Convertisseur JSON en CSV",
    see3: "Formateur HTML",
    see4: "Formateur JavaScript"
  },
  it: {
    m_title: "Formattatore e Validatore JSON Online Gratuito",
    title: "Formattatore JSON",
    meta: "Formattatore, validatore e abbellitore JSON online e gratuito. Formatta, valida e abbellisci il tuo codice JSON istantaneamente — tutto elaborato localmente nel tuo browser.",
    d1: "Il nostro formattatore, validatore e abbellitore JSON online consente di organizzare, correggere e standardizzare le strutture JSON in modo semplice e intuitivo. Con un solo clic, viene eseguita l'analisi del JSON fornito e, se valido, viene generata automaticamente una versione pulita, abbellita e ben strutturata.\n\nÈ inoltre possibile personalizzare l'indentazione tra 2 o 4 spazi, migliorando la leggibilità dei dati, facilitando il debug e ottimizzando la manutenzione del codice.\n\nQuesto strumento è ideale per gli sviluppatori che cercano un validatore e formattatore JSON online gratuito per organizzare dati di API, file di configurazione e payload in modo pratico e produttivo.",
    plc: "Incolla il codice JSON qui o trascina un file",
    bt: "Formatta JSON",
    rst: "Ricomincia",
    copy: "Copia",
    err: "JSON non valido",
    err_empty: "L'editor è vuoto. Incolla prima del JSON.",
    err_label: "Impossibile formattare il JSON",
    indent_label: "Indentazione:",
    how_it_works_title: "Come Funziona",
    hiw_1_title: "Incolla il tuo JSON",
    hiw_1_desc: "Copia e incolla il tuo JSON grezzo o minificato nell'editor.",
    hiw_2_title: "Clicca su Formatta",
    hiw_2_desc: "Premi il pulsante Formatta JSON. Lo strumento valida e abbellisce il codice istantaneamente.",
    hiw_3_title: "Copia il Risultato",
    hiw_3_desc: "Copia l'output formattato o ricomincia con un nuovo JSON.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Debug di Risposte API",
    uc_1_desc: "Rendi leggibili le risposte API che arrivano come un'unica riga minificata.",
    uc_2_title: "Modifica di File di Configurazione",
    uc_2_desc: "Formatta file di configurazione JSON (package.json, tsconfig, ecc.) per una lettura e modifica più semplici.",
    uc_3_title: "Ispezione dei Dati",
    uc_3_desc: "Esplora strutture JSON annidate provenienti da log, database o integrazioni di terze parti.",
    faq_title: "Domande e Risposte",
    faq_1_q: "I miei dati JSON vengono inviati a qualche server?",
    faq_1_a: "No. Tutta la formattazione viene eseguita nel tuo browser. I tuoi dati non lasciano mai il tuo dispositivo.",
    faq_2_q: "Cosa succede se il mio JSON contiene errori di sintassi?",
    faq_2_a: "Lo strumento valida il JSON prima di formattarlo. Se rileva un errore di sintassi, mostra un messaggio di errore chiaro per aiutarti a individuare e correggere il problema.",
    faq_3_q: "Quali opzioni di indentazione sono disponibili?",
    faq_3_a: "Puoi scegliere tra un'indentazione di 2 o 4 spazi. Entrambe sono ampiamente utilizzate — 2 spazi sono comuni nei progetti JavaScript, mentre 4 spazi sono preferiti in molti altri ambienti.",
    f_1: "Formattazione e abbellimento istantaneo del JSON",
    f_2: "Validazione della sintassi prima della formattazione",
    f_3: "Indentazione configurabile (2 o 4 spazi)",
    f_4: "Nessuna registrazione o installazione richiesta",
    see1: "Visualizzatore JSON",
    see2: "Convertitore JSON in CSV",
    see3: "Formattatore HTML",
    see4: "Formattatore JavaScript"
  },
  id: {
    m_title: "Format dan Validasi JSON Online - Pemercantik JSON Gratis",
    title: "Format JSON",
    meta: "Pemformat, validator, dan pemercantik JSON online gratis. Format, validasi, dan percantik kode JSON Anda secara instan — semuanya diproses langsung di browser.",
    d1: "Pemformat, validator, dan pemercantik JSON online kami memungkinkan Anda untuk mengatur, memperbaiki, dan menstandardisasi struktur JSON dengan cara yang sederhana dan intuitif. Hanya dengan satu klik, analisis JSON yang diberikan akan dilakukan dan, jika valid, versi yang bersih, dipercantik, dan terstruktur dengan baik akan dibuat secara otomatis.\n\nAnda juga dapat menyesuaikan indentasi antara 2 atau 4 spasi, meningkatkan keterbacaan data, mempermudah debugging, dan mengoptimalkan pemeliharaan kode.\n\nAlat ini sangat ideal bagi pengembang yang mencari validator dan pemformat JSON online gratis untuk mengatur data API, file konfigurasi, dan payload dengan cara yang praktis dan produktif.",
    plc: "Tempel kode JSON di sini atau seret file",
    bt: "Format JSON",
    rst: "Mulai Ulang",
    copy: "Salin",
    err: "JSON tidak valid",
    err_empty: "Editor kosong. Tempel JSON terlebih dahulu.",
    err_label: "Tidak dapat memformat JSON",
    indent_label: "Indentasi:",
    how_it_works_title: "Cara Kerja",
    hiw_1_title: "Tempel JSON Anda",
    hiw_1_desc: "Salin dan tempel JSON mentah atau yang diminifikasi ke dalam editor.",
    hiw_2_title: "Klik Format",
    hiw_2_desc: "Tekan tombol Format JSON. Alat ini memvalidasi dan mempercantik kode secara instan.",
    hiw_3_title: "Salin Hasilnya",
    hiw_3_desc: "Salin output yang telah diformat atau mulai ulang dengan JSON baru.",
    use_cases_title: "Kasus Penggunaan",
    uc_1_title: "Debug Respons API",
    uc_1_desc: "Jadikan mudah dibaca respons API yang datang sebagai satu baris yang diminifikasi.",
    uc_2_title: "Pengeditan File Konfigurasi",
    uc_2_desc: "Format file konfigurasi JSON (package.json, tsconfig, dll.) agar lebih mudah dibaca dan diedit.",
    uc_3_title: "Inspeksi Data",
    uc_3_desc: "Jelajahi struktur JSON bersarang dari log, basis data, atau integrasi pihak ketiga.",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah data JSON saya dikirim ke server?",
    faq_1_a: "Tidak. Semua pemformatan dilakukan sepenuhnya di browser Anda. Data Anda tidak pernah meninggalkan perangkat Anda.",
    faq_2_q: "Apa yang terjadi jika JSON saya memiliki kesalahan sintaks?",
    faq_2_a: "Alat ini memvalidasi JSON sebelum memformatnya. Jika mendeteksi kesalahan sintaks, pesan kesalahan yang jelas akan ditampilkan agar Anda dapat menemukan dan memperbaiki masalahnya.",
    faq_3_q: "Opsi indentasi apa saja yang tersedia?",
    faq_3_a: "Anda dapat memilih antara indentasi 2 atau 4 spasi. Keduanya banyak digunakan — 2 spasi umum di proyek JavaScript, sedangkan 4 spasi lebih disukai di banyak lingkungan lain.",
    f_1: "Pemformatan dan pempercantikan JSON secara instan",
    f_2: "Validasi sintaks sebelum pemformatan",
    f_3: "Indentasi yang dapat dikonfigurasi (2 atau 4 spasi)",
    f_4: "Tidak perlu pendaftaran atau instalasi",
    see1: "Penampil JSON",
    see2: "Konverter JSON ke CSV",
    see3: "Pemformat HTML",
    see4: "Pemformat JavaScript"
  },
  de: {
    m_title: "JSON Formatter & Validator Online - Kostenlos",
    title: "JSON Formatter",
    meta: "Kostenloser Online-JSON-Formatter, Validator und Beautifier. Formatieren, validieren und verschönern Sie Ihren JSON-Code sofort — alles wird lokal in Ihrem Browser verarbeitet.",
    d1: "Unser Online-JSON-Formatter, -Validator und -Beautifier ermöglicht es Ihnen, JSON-Strukturen einfach und intuitiv zu organisieren, zu korrigieren und zu standardisieren. Mit nur einem Klick wird das eingegebene JSON analysiert und, falls es gültig ist, automatisch eine saubere, verschönerte und gut strukturierte Version generiert.\n\nSie können auch die Einrückung auf 2 oder 4 Leerzeichen anpassen, was die Lesbarkeit der Daten verbessert, das Debugging erleichtert und die Code-Wartung optimiert.\n\nDieses Tool ist ideal für Entwickler, die einen kostenlosen JSON-Validator und -Formatter online suchen, um API-Daten, Konfigurationsdateien und Payloads auf praktische und produktive Weise zu organisieren.",
    plc: "JSON-Code hier einfügen oder Datei ablegen",
    bt: "JSON formatieren",
    rst: "Neu beginnen",
    copy: "Kopieren",
    err: "Ungültiges JSON",
    err_empty: "Der Editor ist leer. Fügen Sie zuerst JSON ein.",
    err_label: "JSON konnte nicht formatiert werden",
    indent_label: "Einrückung:",
    how_it_works_title: "So funktioniert es",
    hiw_1_title: "JSON einfügen",
    hiw_1_desc: "Kopieren Sie Ihr rohes oder minifiziertes JSON und fügen Sie es in den Editor ein.",
    hiw_2_title: "Auf Formatieren klicken",
    hiw_2_desc: "Drücken Sie den Button JSON formatieren. Das Tool validiert und verschönert den Code sofort.",
    hiw_3_title: "Ergebnis kopieren",
    hiw_3_desc: "Kopieren Sie die formatierte Ausgabe oder beginnen Sie mit neuem JSON von vorne.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Debugging von API-Antworten",
    uc_1_desc: "Macht API-Antworten lesbar, die als eine einzige minifizierte Zeile ankommen.",
    uc_2_title: "Bearbeitung von Konfigurationsdateien",
    uc_2_desc: "Formatieren Sie JSON-Konfigurationsdateien (package.json, tsconfig usw.) für einfacheres Lesen und Bearbeiten.",
    uc_3_title: "Dateninspektion",
    uc_3_desc: "Erkunden Sie verschachtelte JSON-Strukturen aus Logs, Datenbanken oder Drittanbieter-Integrationen.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Werden meine JSON-Daten an einen Server gesendet?",
    faq_1_a: "Nein. Die gesamte Formatierung erfolgt vollständig in Ihrem Browser. Ihre Daten verlassen Ihr Gerät nie.",
    faq_2_q: "Was passiert, wenn mein JSON Syntaxfehler enthält?",
    faq_2_a: "Das Tool validiert das JSON vor dem Formatieren. Wenn ein Syntaxfehler erkannt wird, wird eine klare Fehlermeldung angezeigt, damit Sie das Problem finden und beheben können.",
    faq_3_q: "Welche Einrückungsoptionen stehen zur Verfügung?",
    faq_3_a: "Sie können zwischen 2 oder 4 Leerzeichen als Einrückung wählen. Beide sind weit verbreitet — 2 Leerzeichen sind in JavaScript-Projekten üblich, während 4 Leerzeichen in vielen anderen Umgebungen bevorzugt werden.",
    f_1: "Sofortige JSON-Formatierung und -Verschönerung",
    f_2: "Syntaxvalidierung vor der Formatierung",
    f_3: "Konfigurierbare Einrückung (2 oder 4 Leerzeichen)",
    f_4: "Keine Registrierung oder Installation erforderlich",
    see1: "JSON-Betrachter",
    see2: "JSON-zu-CSV-Konverter",
    see3: "HTML-Formatierer",
    see4: "JavaScript-Formatierer"
  },
  nl: {
    m_title: "JSON Formatter en Validator Online - Gratis JSON Beautifier",
    title: "JSON Formatter",
    meta: "Gratis online JSON-formatter, validator en beautifier. Formatteer, valideer en verfraai uw JSON-code direct — alles wordt lokaal in uw browser verwerkt.",
    d1: "Onze online JSON-formatter, validator en beautifier maakt het mogelijk om JSON-structuren op een eenvoudige en intuïtieve manier te organiseren, te corrigeren en te standaardiseren. Met slechts één klik wordt het ingevoerde JSON-bestand geanalyseerd en, als het geldig is, wordt er automatisch een schone, verfraaide en goed gestructureerde versie gegenereerd.\n\nHet is ook mogelijk om de inspringing aan te passen tussen 2 of 4 spaties, wat de leesbaarheid van de gegevens verbetert, het debuggen vergemakkelijkt en het code-onderhoud optimaliseert.\n\nDeze tool is ideaal voor ontwikkelaars die op zoek zijn naar een gratis online JSON-validator en formatter om API-gegevens, configuratiebestanden en payloads op een praktische en productieve manier te organiseren.",
    plc: "Plak de JSON-code hier of sleep een bestand",
    bt: "JSON formatteren",
    rst: "Opnieuw beginnen",
    copy: "Kopiëren",
    err: "Ongeldige JSON",
    err_empty: "De editor is leeg. Plak eerst wat JSON.",
    err_label: "JSON kon niet worden geformatteerd",
    indent_label: "Inspringing:",
    how_it_works_title: "Hoe het werkt",
    hiw_1_title: "Plak uw JSON",
    hiw_1_desc: "Kopieer en plak uw ruwe of geminificeerde JSON in de editor.",
    hiw_2_title: "Klik op Formatteren",
    hiw_2_desc: "Druk op de knop JSON formatteren. Het hulpmiddel valideert en verfraait de code direct.",
    hiw_3_title: "Kopieer het resultaat",
    hiw_3_desc: "Kopieer de geformatteerde uitvoer of begin opnieuw met nieuwe JSON.",
    use_cases_title: "Toepassingen",
    uc_1_title: "Debuggen van API-antwoorden",
    uc_1_desc: "Maak API-antwoorden leesbaar die als één geminificeerde regel binnenkomen.",
    uc_2_title: "Bewerken van configuratiebestanden",
    uc_2_desc: "Formatteer JSON-configuratiebestanden (package.json, tsconfig, enz.) voor eenvoudigere leesbaarheid en bewerking.",
    uc_3_title: "Data-inspectie",
    uc_3_desc: "Verken geneste JSON-structuren afkomstig uit logs, databases of integraties van derden.",
    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Worden mijn JSON-gegevens naar een server verzonden?",
    faq_1_a: "Nee. Alle opmaak wordt volledig in uw browser uitgevoerd. Uw gegevens verlaten uw apparaat nooit.",
    faq_2_q: "Wat gebeurt er als mijn JSON syntaxfouten bevat?",
    faq_2_a: "Het hulpmiddel valideert de JSON vóór het formatteren. Als er een syntaxfout wordt gedetecteerd, wordt een duidelijke foutmelding weergegeven zodat u het probleem kunt vinden en oplossen.",
    faq_3_q: "Welke inspringopties zijn beschikbaar?",
    faq_3_a: "U kunt kiezen tussen 2 of 4 spaties als inspringing. Beide worden veel gebruikt — 2 spaties zijn gebruikelijk in JavaScript-projecten, terwijl 4 spaties de voorkeur hebben in veel andere omgevingen.",
    f_1: "Directe JSON-opmaak en verfraaiing",
    f_2: "Syntaxvalidatie vóór het formatteren",
    f_3: "Configureerbare inspringing (2 of 4 spaties)",
    f_4: "Geen registratie of installatie vereist",
    see1: "JSON-viewer",
    see2: "JSON naar CSV Converter",
    see3: "HTML-formatteerder",
    see4: "JavaScript-formatteerder"
  },
  ru: {
    m_title: "Форматтер и валидатор JSON онлайн — бесплатный инструмент разметки JSON",
    title: "Форматтер JSON",
    meta: "Бесплатный онлайн-форматтер, валидатор и структуризатор JSON. Форматируйте, проверяйте и делайте JSON красивым и читаемым — 100% локально в браузере.",
    d1: "Наш онлайн-форматтер, валидатор и структуризатор JSON позволяет упорядочивать, исправлять и стандартизировать структуры JSON простым и интуитивно понятным способом. Всего в один клик инструмент анализирует предоставленный JSON и, если он синтаксически верен, автоматически генерирует чистую, хорошо отформатированную и структурированную версию.\n\nВы также можете настроить размер отступов (2 или 4 пробела), что улучшает читаемость данных, облегчает отладку и оптимизирует сопровождение кода.\n\nЭтот инструмент идеально подходит для разработчиков, которым нужен бесплатный онлайн-валидатор и форматтер JSON для быстрой организации данных API, конфигурационных файлов и полезной нагрузки (payload).",
    plc: "Вставьте код JSON сюда или перетащите файл",
    bt: "Форматировать JSON",
    rst: "Начать заново",
    copy: "Копировать",
    err: "Невалидный JSON",
    err_empty: "Редактор пуст. Сначала вставьте код JSON.",
    err_label: "Не удалось отформатировать JSON",
    indent_label: "Отступ:",
    how_it_works_title: "Как это работает",
    hiw_1_title: "Вставьте ваш JSON",
    hiw_1_desc: "Скопируйте и вставьте исходный или минифицированный JSON-код в редактор.",
    hiw_2_title: "Нажмите «Форматировать»",
    hiw_2_desc: "Нажмите кнопку «Форматировать JSON». Инструмент мгновенно проверит синтаксис и отформатирует код.",
    hiw_3_title: "Скопируйте результат",
    hiw_3_desc: "Скопируйте отформатированный результат или начните заново с новым JSON-кодом.",
    use_cases_title: "Варианты использования",
    uc_1_title: "Отладка ответов API",
    uc_1_desc: "Сделайте читаемыми ответы API, которые часто возвращаются в виде одной длинной минифицированной строки.",
    uc_2_title: "Редактирование конфигурационных файлов",
    uc_2_desc: "Форматируйте конфигурационные JSON-файлы (package.json, tsconfig и т. д.) для удобства чтения и редактирования.",
    uc_3_title: "Инспекция данных",
    uc_3_desc: "Быстро исследуйте сложные вложенные структуры JSON из логов, баз данных или сторонних сервисов.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Отправляются ли мои JSON-данные на какой-либо сервер?",
    faq_1_a: "Нет. Все форматирование выполняется исключительно в вашем браузере. Ваши данные никогда не покидают ваше устройство.",
    faq_2_q: "Что произойдет, если в моем JSON будут синтаксические ошибки?",
    faq_2_a: "Инструмент проверяет синтаксис JSON перед форматированием. При обнаружении ошибки выводится понятное сообщение, помогающее быстро локализовать и устранить проблему.",
    faq_3_q: "Какие варианты отступов поддерживаются?",
    faq_3_a: "Вы можете выбрать отступ в 2 или 4 пробела. Оба варианта популярны: отступ в 2 пробела часто используется в проектах на JavaScript, тогда как 4 пробела предпочитают во многих других языках программирования и средах.",
    f_1: "Мгновенное форматирование и украшение JSON",
    f_2: "Валидация синтаксиса перед форматированием",
    f_3: "Настраиваемые отступы (2 или 4 пробела)",
    f_4: "Не требуется регистрация или установка",
    see1: "Просмотр JSON",
    see2: "Конвертер JSON в CSV",
    see3: "Форматтер HTML",
    see4: "Форматтер JavaScript"
  }
}
</i18n>