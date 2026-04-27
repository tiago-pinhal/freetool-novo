<script setup lang="ts">
useScript('https://unpkg.com/prettier@2.8.8/standalone.js', { trigger: 'client' })
useScript('https://unpkg.com/prettier@2.8.8/parser-graphql.js', { trigger: 'client' })

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
  resetable: false
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
  const prettierFn = (window as any).prettier
  const prettierPlugins = (window as any).prettierPlugins
  if (!prettierFn) {
    document.location.reload()
    return
  }

  try {
    const formatted = prettierFn.format(editor.value!.getValue(), {
      parser: 'graphql',
      plugins: prettierPlugins
    })
    editor.value!.setValue(formatted)
    editor.value!.setReadOnly(true)
    state.resetable = true
    state.ads = true
  } catch (e: any) {
    state.error = `${t('err')}: ${e.message}`
  }
}

function reset() {
  editor.value!.setValue('')
  editor.value!.setReadOnly(false)
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
    en: '/graphql-formatter',
    pt: '/formatador-graphql',
    es: '/formateador-graphql',
    fr: '/formateur-graphql',
    it: '/formattatore-graphql',
    id: '/pemformat-graphql'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'javascript-formatter' },
      { label: t('see2'), to: 'html-formatter' },
      { label: t('see3'), to: 'css-formatter' },
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
        <Icon name="heroicons:code-bracket" class="w-12 h-12 text-base-content/10" />
      </div>

      <!-- Editor Component -->
      <Editor
        v-show="state.loaded"
        ref="editor"
        lang="graphql"
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
            {{ t('copy') }} GraphQL
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
      <div class="space-y-12">
        <div>
          <p class="text-lg">{{ t('d1') }} {{ t('d2') }}</p>
        </div>

        <!-- How It Works -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Icon name="heroicons:light-bulb" class="text-primary" />
            {{ t('how_it_works_title') }}
          </h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-base-200/50 p-6 rounded-2xl border border-base-content/20">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <span class="font-bold text-primary text-xl">1</span>
              </div>
              <h3 class="font-bold text-base-content mb-2">{{ t('hiw_1_title') }}</h3>
              <p>{{ t('hiw_1_desc') }}</p>
            </div>
            <div class="bg-base-200/50 p-6 rounded-2xl border border-base-content/20">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <span class="font-bold text-primary text-xl">2</span>
              </div>
              <h3 class="font-bold text-base-content mb-2">{{ t('hiw_2_title') }}</h3>
              <p>{{ t('hiw_2_desc') }}</p>
            </div>
            <div class="bg-base-200/50 p-6 rounded-2xl border border-base-content/20">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <span class="font-bold text-primary text-xl">3</span>
              </div>
              <h3 class="font-bold text-base-content mb-2">{{ t('hiw_3_title') }}</h3>
              <p>{{ t('hiw_3_desc') }}</p>
            </div>
          </div>
        </section>

        <!-- Use Cases -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Icon name="heroicons:briefcase" class="text-primary" />
            {{ t('use_cases_title') }}
          </h2>
          <div class="bg-base-200/30 rounded-3xl p-8 border border-base-content/20">
            <ul class="grid sm:grid-cols-2 gap-6 list-none p-0 m-0">
              <li class="flex gap-4">
                <div class="mt-1"><Icon name="heroicons:check-circle" class="text-primary w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_1_title') }}</strong>
                  <span>{{ t('uc_1_desc') }}</span>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="mt-1"><Icon name="heroicons:check-circle" class="text-primary w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_2_title') }}</strong>
                  <span>{{ t('uc_2_desc') }}</span>
                </div>
              </li>
              <li class="flex gap-4 sm:col-span-2">
                <div class="mt-1"><Icon name="heroicons:check-circle" class="text-primary w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_3_title') }}</strong>
                  <span>{{ t('uc_3_desc') }}</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

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
        m_title: "GraphQL Formatter Online - Beautify & Indent GraphQL for Free",
        title: "GraphQL Formatter",
        meta: "Free online GraphQL formatter. Paste your queries, mutations or schema and instantly beautify them with proper indentation and consistent structure.",
        d1: "This online GraphQL formatter parses and reformats your queries, mutations, subscriptions, and schema definitions with consistent indentation and uniform structure. Any messy or minified GraphQL is transformed into readable, well-structured code in one click.",
        d2: "It fixes indentation, aligns fields and arguments correctly, and normalizes spacing across the document, making the code easier to review, debug, or share with your team.",
        plc: "Insert the GraphQL code here or drag a file",
        bt: "Format GraphQL",
        rst: "Start Over",
        copy: "Copy",
        err: "Error",
        err_label: "Could not format GraphQL",
        how_it_works_title: "How It Works",
        hiw_1_title: "Paste Your GraphQL",
        hiw_1_desc: "Copy and paste your raw or unformatted query, mutation, subscription, or schema into the editor.",
        hiw_2_title: "Click Format",
        hiw_2_desc: "Press the Format GraphQL button and the tool will reformat the code instantly.",
        hiw_3_title: "Copy the Result",
        hiw_3_desc: "Copy the formatted output or start over with new code.",
        use_cases_title: "Common Use Cases",
        uc_1_title: "API Development",
        uc_1_desc: "Format queries and mutations before committing them to your codebase or sharing with teammates.",
        uc_2_title: "Schema Review",
        uc_2_desc: "Readable indentation makes it much easier to review type definitions, fields, and relationships in SDL files.",
        uc_3_title: "Debugging Queries",
        uc_3_desc: "Well-formatted GraphQL is easier to read line by line and helps isolate missing fields or incorrect arguments.",
        faq_title: "Questions & Answers",
        faq_1_q: "Is my GraphQL code sent to any server?",
        faq_1_a: "No. All formatting is done entirely in your browser. Your code never leaves your device.",
        faq_2_q: "Does the formatter support SDL and executable documents?",
        faq_2_a: "Yes. The formatter supports both Schema Definition Language (SDL) files and executable documents including queries, mutations, subscriptions, and fragments.",
        faq_3_q: "What happens if my GraphQL has syntax errors?",
        faq_3_a: "If the code cannot be parsed, the tool will display an error message so you can identify and fix the issue before formatting.",
        see1: "JavaScript Formatter",
        see2: "HTML Formatter",
        see3: "CSS Formatter",
        see4: "JSON Viewer",
        f_1: "Instant GraphQL beautification and formatting",
        f_2: "Correct indentation and field alignment",
        f_3: "Syntax error detection and reporting",
        f_4: "No registration or installation required"
    },
    pt: {
        m_title: "Formatador GraphQL Online - Formate e Indente GraphQL Grátis",
        title: "Formatador GraphQL",
        meta: "Formatador GraphQL online gratuito. Cole suas queries, mutations ou schema e deixe-os organizados com indentação correta e estrutura uniformizada.",
        d1: "Este formatador GraphQL online analisa e reformata suas queries, mutations, subscriptions e definições de schema com indentação consistente e estrutura uniformizada. Todo GraphQL bagunçado ou minificado é transformado em código legível e bem estruturado com um clique.",
        d2: "Ele corrige a indentação, alinha campos e argumentos corretamente e normaliza o espaçamento em todo o documento, facilitando a revisão, depuração ou compartilhamento com a equipe.",
        plc: "Insira o código GraphQL aqui ou arraste um arquivo",
        bt: "Formatar GraphQL",
        rst: "Recomeçar",
        copy: "Copiar",
        err: "Erro",
        err_label: "Não foi possível formatar o GraphQL",
        how_it_works_title: "Como Funciona",
        hiw_1_title: "Cole seu GraphQL",
        hiw_1_desc: "Copie e cole sua query, mutation, subscription ou schema bruto no editor.",
        hiw_2_title: "Clique em Formatar",
        hiw_2_desc: "Pressione o botão Formatar GraphQL e o código será reformatado instantaneamente.",
        hiw_3_title: "Copie o Resultado",
        hiw_3_desc: "Copie o código formatado ou comece de novo com um novo código.",
        use_cases_title: "Principais Casos de Uso",
        uc_1_title: "Desenvolvimento de APIs",
        uc_1_desc: "Formate queries e mutations antes de adicioná-las ao repositório ou compartilhar com colegas.",
        uc_2_title: "Revisão de Schema",
        uc_2_desc: "A indentação legível facilita muito a revisão de definições de tipos, campos e relacionamentos em arquivos SDL.",
        uc_3_title: "Depuração de Queries",
        uc_3_desc: "GraphQL bem formatado é mais fácil de ler linha a linha e ajuda a identificar campos ausentes ou argumentos incorretos.",
        faq_title: "Perguntas e Respostas",
        faq_1_q: "Meu código GraphQL é enviado para algum servidor?",
        faq_1_a: "Não. Todo o processamento é feito no seu navegador. Seu código nunca sai do seu dispositivo.",
        faq_2_q: "O formatador suporta SDL e documentos executáveis?",
        faq_2_a: "Sim. O formatador suporta tanto arquivos SDL (Schema Definition Language) quanto documentos executáveis, incluindo queries, mutations, subscriptions e fragments.",
        faq_3_q: "O que acontece se meu GraphQL tiver erros de sintaxe?",
        faq_3_a: "Se o código não puder ser analisado, a ferramenta exibirá uma mensagem de erro para você identificar e corrigir o problema antes de formatar.",
        see1: "Formatador JavaScript",
        see2: "Formatador HTML",
        see3: "Formatador CSS",
        see4: "Visualizador de JSON",
        f_1: "Formatação e organização instantânea de GraphQL",
        f_2: "Indentação correta e alinhamento de campos",
        f_3: "Detecção e reporte de erros de sintaxe",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        m_title: "Formateador GraphQL Online - Formatea e Indenta GraphQL Gratis",
        title: "Formateador GraphQL",
        meta: "Formateador GraphQL online gratuito. Pega tus queries, mutations o schema y organízalos al instante con indentación correcta y estructura uniforme.",
        d1: "Este formateador GraphQL online analiza y reformatea tus queries, mutations, subscriptions y definiciones de schema con indentación consistente y estructura uniforme. Todo GraphQL desordenado o minificado se transforma en código legible y bien estructurado con un clic.",
        d2: "Corrige la indentación, alinea campos y argumentos correctamente y normaliza el espaciado en todo el documento, facilitando la revisión, depuración o compartición con el equipo.",
        plc: "Introduce el código GraphQL aquí o arrastra un archivo",
        bt: "Formatear GraphQL",
        rst: "Recomenzar",
        copy: "Copiar",
        err: "Error",
        err_label: "No se pudo formatear el GraphQL",
        how_it_works_title: "Cómo Funciona",
        hiw_1_title: "Pega tu GraphQL",
        hiw_1_desc: "Copia y pega tu query, mutation, subscription o schema en bruto en el editor.",
        hiw_2_title: "Haz clic en Formatear",
        hiw_2_desc: "Pulsa el botón Formatear GraphQL y el código se reformateará al instante.",
        hiw_3_title: "Copia el Resultado",
        hiw_3_desc: "Copia el código formateado o empieza de nuevo con código nuevo.",
        use_cases_title: "Casos de Uso Comunes",
        uc_1_title: "Desarrollo de APIs",
        uc_1_desc: "Formatea queries y mutations antes de agregarlas al repositorio o compartirlas con compañeros.",
        uc_2_title: "Revisión de Schema",
        uc_2_desc: "La indentación legible facilita mucho la revisión de definiciones de tipos, campos y relaciones en archivos SDL.",
        uc_3_title: "Depuración de Queries",
        uc_3_desc: "El GraphQL bien formateado es más fácil de leer línea a línea y ayuda a identificar campos faltantes o argumentos incorrectos.",
        faq_title: "Preguntas y Respuestas",
        faq_1_q: "¿Mi código GraphQL se envía a algún servidor?",
        faq_1_a: "No. Todo el procesamiento se realiza en tu navegador. Tu código nunca sale de tu dispositivo.",
        faq_2_q: "¿El formateador admite SDL y documentos ejecutables?",
        faq_2_a: "Sí. El formateador admite tanto archivos SDL (Schema Definition Language) como documentos ejecutables, incluyendo queries, mutations, subscriptions y fragments.",
        faq_3_q: "¿Qué ocurre si mi GraphQL tiene errores de sintaxis?",
        faq_3_a: "Si el código no se puede analizar, la herramienta mostrará un mensaje de error para que puedas identificar y solucionar el problema antes de formatear.",
        see1: "Formateador JavaScript",
        see2: "Formateador HTML",
        see3: "Formateador CSS",
        see4: "Visor de JSON",
        f_1: "Formateo y organización instantánea de GraphQL",
        f_2: "Indentación correcta y alineación de campos",
        f_3: "Detección y reporte de errores de sintaxis",
        f_4: "Sin necesidad de registro ni instalación"
    },
    fr: {
        m_title: "Formateur GraphQL en Ligne - Formatez et Indentez GraphQL Gratuitement",
        title: "Formateur GraphQL",
        meta: "Formateur GraphQL en ligne gratuit. Collez vos requêtes, mutations ou schéma et obtenez instantanément une indentation correcte et une structure uniforme.",
        d1: "Ce formateur GraphQL en ligne analyse et reformate vos requêtes, mutations, abonnements et définitions de schéma avec une indentation cohérente et une structure uniforme. Tout GraphQL désordonné ou minifié est transformé en code lisible et bien structuré en un clic.",
        d2: "Il corrige l'indentation, aligne correctement les champs et les arguments, et normalise les espaces dans tout le document, facilitant la révision, le débogage ou le partage avec l'équipe.",
        plc: "Insérez le code GraphQL ici ou faites glisser un fichier",
        bt: "Formater GraphQL",
        rst: "Recommencer",
        copy: "Copier",
        err: "Erreur",
        err_label: "Impossible de formater le GraphQL",
        how_it_works_title: "Comment Ça Marche",
        hiw_1_title: "Collez Votre GraphQL",
        hiw_1_desc: "Copiez et collez votre requête, mutation, abonnement ou schéma brut dans l'éditeur.",
        hiw_2_title: "Cliquez sur Formater",
        hiw_2_desc: "Appuyez sur le bouton Formater GraphQL et le code sera reformaté instantanément.",
        hiw_3_title: "Copiez le Résultat",
        hiw_3_desc: "Copiez le code formaté ou recommencez avec un nouveau code.",
        use_cases_title: "Cas d'Usage Courants",
        uc_1_title: "Développement d'API",
        uc_1_desc: "Formatez les requêtes et mutations avant de les ajouter au dépôt ou de les partager avec vos collègues.",
        uc_2_title: "Revue de Schéma",
        uc_2_desc: "Une indentation lisible facilite grandement la revue des définitions de types, des champs et des relations dans les fichiers SDL.",
        uc_3_title: "Débogage de Requêtes",
        uc_3_desc: "Un GraphQL bien formaté est plus facile à lire ligne par ligne et aide à identifier les champs manquants ou les arguments incorrects.",
        faq_title: "Questions et Réponses",
        faq_1_q: "Mon code GraphQL est-il envoyé à un serveur ?",
        faq_1_a: "Non. Tout le traitement est effectué dans votre navigateur. Votre code ne quitte jamais votre appareil.",
        faq_2_q: "Le formateur prend-il en charge SDL et les documents exécutables ?",
        faq_2_a: "Oui. Le formateur prend en charge les fichiers SDL (Schema Definition Language) ainsi que les documents exécutables, y compris les requêtes, mutations, abonnements et fragments.",
        faq_3_q: "Que se passe-t-il si mon GraphQL contient des erreurs de syntaxe ?",
        faq_3_a: "Si le code ne peut pas être analysé, l'outil affichera un message d'erreur pour vous aider à identifier et corriger le problème avant le formatage.",
        see1: "Formateur JavaScript",
        see2: "Formateur HTML",
        see3: "Formateur CSS",
        see4: "Visualiseur JSON",
        f_1: "Formatage instantané du GraphQL",
        f_2: "Indentation correcte et alignement des champs",
        f_3: "Détection et signalement des erreurs de syntaxe",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        m_title: "Formattatore GraphQL Online - Formatta e Indenta GraphQL Gratis",
        title: "Formattatore GraphQL",
        meta: "Formattatore GraphQL online gratuito. Incolla le tue query, mutation o schema e ottieni istantaneamente indentazione corretta e struttura uniforme.",
        d1: "Questo formattatore GraphQL online analizza e riformatta le tue query, mutation, subscription e definizioni di schema con indentazione coerente e struttura uniforme. Qualsiasi GraphQL disordinato o minificato viene trasformato in codice leggibile e ben strutturato con un clic.",
        d2: "Corregge l'indentazione, allinea campi e argomenti correttamente e normalizza la spaziatura nell'intero documento, rendendo il codice più facile da revisionare, debuggare o condividere con il team.",
        plc: "Inserisci il codice GraphQL qui o trascina un file",
        bt: "Formatta GraphQL",
        rst: "Ricomincia",
        copy: "Copia",
        err: "Errore",
        err_label: "Impossibile formattare il GraphQL",
        how_it_works_title: "Come Funziona",
        hiw_1_title: "Incolla il tuo GraphQL",
        hiw_1_desc: "Copia e incolla la tua query, mutation, subscription o schema grezzo nell'editor.",
        hiw_2_title: "Clicca su Formatta",
        hiw_2_desc: "Premi il pulsante Formatta GraphQL e il codice verrà riformattato all'istante.",
        hiw_3_title: "Copia il Risultato",
        hiw_3_desc: "Copia il codice formattato o ricomincia con un nuovo codice.",
        use_cases_title: "Casi d'Uso Comuni",
        uc_1_title: "Sviluppo di API",
        uc_1_desc: "Formatta query e mutation prima di aggiungerle al repository o condividerle con i colleghi.",
        uc_2_title: "Revisione dello Schema",
        uc_2_desc: "Un'indentazione leggibile rende molto più facile revisionare le definizioni di tipi, campi e relazioni nei file SDL.",
        uc_3_title: "Debug di Query",
        uc_3_desc: "Il GraphQL ben formattato è più facile da leggere riga per riga e aiuta a individuare campi mancanti o argomenti errati.",
        faq_title: "Domande e Risposte",
        faq_1_q: "Il mio codice GraphQL viene inviato a qualche server?",
        faq_1_a: "No. Tutta l'elaborazione avviene nel tuo browser. Il tuo codice non lascia mai il tuo dispositivo.",
        faq_2_q: "Il formattatore supporta SDL e documenti eseguibili?",
        faq_2_a: "Sì. Il formattatore supporta sia i file SDL (Schema Definition Language) che i documenti eseguibili, incluse query, mutation, subscription e fragment.",
        faq_3_q: "Cosa succede se il mio GraphQL ha errori di sintassi?",
        faq_3_a: "Se il codice non può essere analizzato, lo strumento mostrerà un messaggio di errore per aiutarti a identificare e correggere il problema prima della formattazione.",
        see1: "Formattatore JavaScript",
        see2: "Formattatore HTML",
        see3: "Formattatore CSS",
        see4: "Visualizzatore JSON",
        f_1: "Formattazione istantanea del GraphQL",
        f_2: "Indentazione corretta e allineamento dei campi",
        f_3: "Rilevamento e segnalazione degli errori di sintassi",
        f_4: "Nessuna registrazione o installazione richiesta"
    },
    id: {
        m_title: "Pemformat GraphQL Online - Format & Indentasi GraphQL Gratis",
        title: "Pemformat GraphQL",
        meta: "Pemformat GraphQL online gratis. Tempelkan query, mutation, atau schema Anda dan dapatkan indentasi yang benar dan struktur yang seragam secara instan.",
        d1: "Pemformat GraphQL online ini mengurai dan memformat ulang query, mutation, subscription, dan definisi schema Anda dengan indentasi yang konsisten dan struktur yang seragam. Semua GraphQL yang berantakan atau diminifikasi diubah menjadi kode yang mudah dibaca dan terstruktur dengan baik dalam satu klik.",
        d2: "Alat ini memperbaiki indentasi, menyelaraskan field dan argumen dengan benar, dan menormalkan spasi di seluruh dokumen, membuat kode lebih mudah ditinjau, di-debug, atau dibagikan ke tim.",
        plc: "Masukkan kode GraphQL di sini atau seret file",
        bt: "Format GraphQL",
        rst: "Mulai Ulang",
        copy: "Salin",
        err: "Kesalahan",
        err_label: "Tidak dapat memformat GraphQL",
        how_it_works_title: "Cara Kerja",
        hiw_1_title: "Tempel GraphQL Anda",
        hiw_1_desc: "Salin dan tempel query, mutation, subscription, atau schema mentah ke dalam editor.",
        hiw_2_title: "Klik Format",
        hiw_2_desc: "Tekan tombol Format GraphQL dan kode akan diformat ulang secara instan.",
        hiw_3_title: "Salin Hasilnya",
        hiw_3_desc: "Salin kode yang telah diformat atau mulai ulang dengan kode baru.",
        use_cases_title: "Kegunaan Utama",
        uc_1_title: "Pengembangan API",
        uc_1_desc: "Format query dan mutation sebelum menambahkannya ke repositori atau membagikannya ke rekan kerja.",
        uc_2_title: "Tinjauan Schema",
        uc_2_desc: "Indentasi yang mudah dibaca memudahkan peninjauan definisi tipe, field, dan relasi dalam file SDL.",
        uc_3_title: "Debug Query",
        uc_3_desc: "GraphQL yang terformat dengan baik lebih mudah dibaca baris per baris dan membantu mengidentifikasi field yang hilang atau argumen yang salah.",
        faq_title: "Tanya Jawab",
        faq_1_q: "Apakah kode GraphQL saya dikirim ke server?",
        faq_1_a: "Tidak. Semua pemrosesan dilakukan di browser Anda. Kode Anda tidak pernah meninggalkan perangkat Anda.",
        faq_2_q: "Apakah pemformat mendukung SDL dan dokumen yang dapat dieksekusi?",
        faq_2_a: "Ya. Pemformat mendukung file SDL (Schema Definition Language) maupun dokumen yang dapat dieksekusi, termasuk query, mutation, subscription, dan fragment.",
        faq_3_q: "Apa yang terjadi jika GraphQL saya memiliki kesalahan sintaks?",
        faq_3_a: "Jika kode tidak dapat diurai, alat ini akan menampilkan pesan kesalahan agar Anda dapat mengidentifikasi dan memperbaiki masalah sebelum memformat.",
        see1: "Pemformat JavaScript",
        see2: "Pemformat HTML",
        see3: "Pemformat CSS",
        see4: "Penampil JSON",
        f_1: "Pemformatan GraphQL secara instan",
        f_2: "Indentasi yang benar dan penyelarasan field",
        f_3: "Deteksi dan pelaporan kesalahan sintaks",
        f_4: "Tanpa pendaftaran atau instalasi"
    }
}
</i18n>
