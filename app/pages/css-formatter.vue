<script setup lang="ts">
useScript('https://unpkg.com/prettier@2.8.8/standalone.js', { trigger: 'client' })
useScript('https://unpkg.com/prettier@2.8.8/parser-postcss.js', { trigger: 'client' })

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
      parser: 'css',
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
    en: '/css-formatter',
    pt: '/formatador-css',
    es: '/formateador-css',
    fr: '/formateur-css',
    it: '/formattatore-css',
    id: '/pemformat-css'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'css-minifier' },
      { label: t('see2'), to: 'html-formatter' },
      { label: t('see3'), to: 'javascript-formatter' },
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
        lang="css"
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
            {{ t('copy') }} CSS
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
        m_title: "CSS Formatter Online - Beautify & Indent CSS for Free",
        title: "CSS Formatter",
        meta: "Free online CSS formatter. Paste your CSS code and instantly beautify it with proper indentation and consistent structure.",
        d1: "This online CSS formatter parses and reformats your stylesheet with consistent indentation and uniform structure. Any messy, minified, or poorly organized CSS is transformed into readable, well-structured code in one click.",
        d2: "It removes unnecessary blank lines, fixes indentation, and normalizes spacing inside rules and declarations, making the code easier to review, debug, or hand off to a teammate.",
        plc: "Insert the CSS code here or drag a file",
        bt: "Format CSS",
        rst: "Start Over",
        copy: "Copy",
        err: "Error",
        err_label: "Could not format CSS",
        how_it_works_title: "How It Works",
        hiw_1_title: "Paste Your CSS",
        hiw_1_desc: "Copy and paste your raw, minified, or unformatted CSS into the editor.",
        hiw_2_title: "Click Format",
        hiw_2_desc: "Press the Format CSS button and the tool will reformat the code instantly.",
        hiw_3_title: "Copy the Result",
        hiw_3_desc: "Copy the formatted output or start over with new code.",
        use_cases_title: "Common Use Cases",
        uc_1_title: "Code Reviews",
        uc_1_desc: "Clean up stylesheets before sharing with teammates or opening a pull request.",
        uc_2_title: "Debugging Styles",
        uc_2_desc: "Readable indentation makes it much easier to trace selector hierarchies and spot conflicting rules.",
        uc_3_title: "Learning & Documentation",
        uc_3_desc: "Properly formatted CSS is easier to read, understand, and include in documentation or tutorials.",
        faq_title: "Questions & Answers",
        faq_1_q: "Is my CSS code sent to any server?",
        faq_1_a: "No. All formatting is done entirely in your browser. Your code never leaves your device.",
        faq_2_q: "Does the formatter support modern CSS syntax?",
        faq_2_a: "Yes. The formatter supports modern CSS including custom properties, nesting, media queries, and at-rules.",
        faq_3_q: "What happens if my CSS has syntax errors?",
        faq_3_a: "If the code cannot be parsed, the tool will display an error message so you can identify and fix the issue before formatting.",
        see1: "CSS Minifier",
        see2: "HTML Formatter",
        see3: "JavaScript Formatter",
        see4: "JSON Viewer",
        f_1: "Instant CSS beautification and formatting",
        f_2: "Correct indentation and consistent spacing",
        f_3: "Syntax error detection and reporting",
        f_4: "No registration or installation required"
    },
    pt: {
        m_title: "Formatador CSS Online - Formate e Indente CSS Grátis",
        title: "Formatador CSS",
        meta: "Formatador CSS online gratuito. Cole seu código CSS e deixe-o organizado com indentação correta e estrutura uniformizada.",
        d1: "Este formatador CSS online analisa e reformata sua folha de estilos com indentação consistente e estrutura uniforme. Qualquer código CSS bagunçado, minificado ou mal organizado é transformado em código legível e bem estruturado com um clique.",
        d2: "Ele remove linhas em branco desnecessárias, corrige a indentação e normaliza o espaçamento dentro de regras e declarações, facilitando a revisão, depuração ou entrega do código para um colega.",
        plc: "Insira o código CSS aqui ou arraste um arquivo",
        bt: "Formatar CSS",
        rst: "Recomeçar",
        copy: "Copiar",
        err: "Erro",
        err_label: "Não foi possível formatar o CSS",
        how_it_works_title: "Como Funciona",
        hiw_1_title: "Cole seu CSS",
        hiw_1_desc: "Copie e cole seu CSS bruto, minificado ou sem formatação no editor.",
        hiw_2_title: "Clique em Formatar",
        hiw_2_desc: "Pressione o botão Formatar CSS e o código será reformatado instantaneamente.",
        hiw_3_title: "Copie o Resultado",
        hiw_3_desc: "Copie o código formatado ou comece de novo com um novo código.",
        use_cases_title: "Principais Casos de Uso",
        uc_1_title: "Revisões de Código",
        uc_1_desc: "Limpe folhas de estilo bagunçadas antes de compartilhar com colegas ou abrir um pull request.",
        uc_2_title: "Depuração de Estilos",
        uc_2_desc: "A indentação legível facilita muito o rastreamento de hierarquias de seletores e a identificação de regras conflitantes.",
        uc_3_title: "Aprendizado e Documentação",
        uc_3_desc: "CSS bem formatado é mais fácil de ler, entender e incluir em documentações ou tutoriais.",
        faq_title: "Perguntas e Respostas",
        faq_1_q: "Meu código CSS é enviado para algum servidor?",
        faq_1_a: "Não. Todo o processamento é feito no seu navegador. Seu código nunca sai do seu dispositivo.",
        faq_2_q: "O formatador suporta sintaxe CSS moderna?",
        faq_2_a: "Sim. O formatador suporta CSS moderno, incluindo propriedades customizadas, aninhamento, media queries e at-rules.",
        faq_3_q: "O que acontece se meu CSS tiver erros de sintaxe?",
        faq_3_a: "Se o código não puder ser analisado, a ferramenta exibirá uma mensagem de erro para você identificar e corrigir o problema antes de formatar.",
        see1: "Minificador de CSS",
        see2: "Formatador HTML",
        see3: "Formatador JavaScript",
        see4: "Visualizador de JSON",
        f_1: "Formatação e organização instantânea de CSS",
        f_2: "Indentação correta e espaçamento consistente",
        f_3: "Detecção e reporte de erros de sintaxe",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        m_title: "Formateador CSS Online - Formatea e Indenta CSS Gratis",
        title: "Formateador CSS",
        meta: "Formateador CSS online gratuito. Pega tu código CSS y organízalo al instante con indentación correcta y estructura uniforme.",
        d1: "Este formateador CSS online analiza y reformatea tu hoja de estilos con indentación consistente y estructura uniforme. Todo CSS desordenado, minificado o mal organizado se transforma en código legible y bien estructurado con un clic.",
        d2: "Elimina líneas en blanco innecesarias, corrige la indentación y normaliza el espaciado dentro de reglas y declaraciones, facilitando la revisión, depuración o entrega del código a un compañero.",
        plc: "Introduce el código CSS aquí o arrastra un archivo",
        bt: "Formatear CSS",
        rst: "Recomenzar",
        copy: "Copiar",
        err: "Error",
        err_label: "No se pudo formatear el CSS",
        how_it_works_title: "Cómo Funciona",
        hiw_1_title: "Pega tu CSS",
        hiw_1_desc: "Copia y pega tu CSS en bruto, minificado o sin formato en el editor.",
        hiw_2_title: "Haz clic en Formatear",
        hiw_2_desc: "Pulsa el botón Formatear CSS y el código se reformateará al instante.",
        hiw_3_title: "Copia el Resultado",
        hiw_3_desc: "Copia el código formateado o empieza de nuevo con código nuevo.",
        use_cases_title: "Casos de Uso Comunes",
        uc_1_title: "Revisiones de Código",
        uc_1_desc: "Limpia hojas de estilo desordenadas antes de compartirlas con compañeros o abrir un pull request.",
        uc_2_title: "Depuración de Estilos",
        uc_2_desc: "La indentación legible facilita mucho el rastreo de jerarquías de selectores y la detección de reglas en conflicto.",
        uc_3_title: "Aprendizaje y Documentación",
        uc_3_desc: "El CSS bien formateado es más fácil de leer, entender e incluir en documentación o tutoriales.",
        faq_title: "Preguntas y Respuestas",
        faq_1_q: "¿Mi código CSS se envía a algún servidor?",
        faq_1_a: "No. Todo el procesamiento se realiza en tu navegador. Tu código nunca sale de tu dispositivo.",
        faq_2_q: "¿El formateador admite sintaxis CSS moderna?",
        faq_2_a: "Sí. El formateador admite CSS moderno, incluyendo propiedades personalizadas, anidamiento, media queries y at-rules.",
        faq_3_q: "¿Qué ocurre si mi CSS tiene errores de sintaxis?",
        faq_3_a: "Si el código no se puede analizar, la herramienta mostrará un mensaje de error para que puedas identificar y solucionar el problema antes de formatear.",
        see1: "Minificador CSS",
        see2: "Formateador HTML",
        see3: "Formateador JavaScript",
        see4: "Visor de JSON",
        f_1: "Formateo y organización instantánea de CSS",
        f_2: "Indentación correcta y espaciado consistente",
        f_3: "Detección y reporte de errores de sintaxis",
        f_4: "Sin necesidad de registro ni instalación"
    },
    fr: {
        m_title: "Formateur CSS en Ligne - Formatez et Indentez CSS Gratuitement",
        title: "Formateur CSS",
        meta: "Formateur CSS en ligne gratuit. Collez votre code CSS et obtenez instantanément une indentation correcte et une structure uniforme.",
        d1: "Ce formateur CSS en ligne analyse et reformate votre feuille de styles avec une indentation cohérente et une structure uniforme. Tout CSS désordonné, minifié ou mal organisé est transformé en code lisible et bien structuré en un clic.",
        d2: "Il supprime les lignes vides inutiles, corrige l'indentation et normalise les espaces à l'intérieur des règles et des déclarations, facilitant la révision, le débogage ou la transmission du code à un collègue.",
        plc: "Insérez le code CSS ici ou faites glisser un fichier",
        bt: "Formater CSS",
        rst: "Recommencer",
        copy: "Copier",
        err: "Erreur",
        err_label: "Impossible de formater le CSS",
        how_it_works_title: "Comment Ça Marche",
        hiw_1_title: "Collez Votre CSS",
        hiw_1_desc: "Copiez et collez votre CSS brut, minifié ou non formaté dans l'éditeur.",
        hiw_2_title: "Cliquez sur Formater",
        hiw_2_desc: "Appuyez sur le bouton Formater CSS et le code sera reformaté instantanément.",
        hiw_3_title: "Copiez le Résultat",
        hiw_3_desc: "Copiez le code formaté ou recommencez avec un nouveau code.",
        use_cases_title: "Cas d'Usage Courants",
        uc_1_title: "Revues de Code",
        uc_1_desc: "Nettoyez les feuilles de styles désordonnées avant de les partager avec vos collègues ou d'ouvrir une pull request.",
        uc_2_title: "Débogage de Styles",
        uc_2_desc: "Une indentation lisible facilite grandement le suivi des hiérarchies de sélecteurs et la détection des règles en conflit.",
        uc_3_title: "Apprentissage et Documentation",
        uc_3_desc: "Un CSS bien formaté est plus facile à lire, à comprendre et à inclure dans la documentation ou les tutoriels.",
        faq_title: "Questions et Réponses",
        faq_1_q: "Mon code CSS est-il envoyé à un serveur ?",
        faq_1_a: "Non. Tout le traitement est effectué dans votre navigateur. Votre code ne quitte jamais votre appareil.",
        faq_2_q: "Le formateur prend-il en charge la syntaxe CSS moderne ?",
        faq_2_a: "Oui. Le formateur prend en charge le CSS moderne, y compris les propriétés personnalisées, l'imbrication, les media queries et les at-rules.",
        faq_3_q: "Que se passe-t-il si mon CSS contient des erreurs de syntaxe ?",
        faq_3_a: "Si le code ne peut pas être analysé, l'outil affichera un message d'erreur pour vous aider à identifier et corriger le problème avant le formatage.",
        see1: "Minificateur CSS",
        see2: "Formateur HTML",
        see3: "Formateur JavaScript",
        see4: "Visualiseur JSON",
        f_1: "Formatage instantané du CSS",
        f_2: "Indentation correcte et espacement cohérent",
        f_3: "Détection et signalement des erreurs de syntaxe",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        m_title: "Formattatore CSS Online - Formatta e Indenta CSS Gratis",
        title: "Formattatore CSS",
        meta: "Formattatore CSS online gratuito. Incolla il tuo codice CSS e ottieni istantaneamente indentazione corretta e struttura uniforme.",
        d1: "Questo formattatore CSS online analizza e riformatta il tuo foglio di stile con indentazione coerente e struttura uniforme. Qualsiasi CSS disordinato, minificato o mal organizzato viene trasformato in codice leggibile e ben strutturato con un clic.",
        d2: "Rimuove le righe vuote inutili, corregge l'indentazione e normalizza la spaziatura all'interno di regole e dichiarazioni, rendendo il codice più facile da revisionare, debuggare o passare a un collega.",
        plc: "Inserisci il codice CSS qui o trascina un file",
        bt: "Formatta CSS",
        rst: "Ricomincia",
        copy: "Copia",
        err: "Errore",
        err_label: "Impossibile formattare il CSS",
        how_it_works_title: "Come Funziona",
        hiw_1_title: "Incolla il tuo CSS",
        hiw_1_desc: "Copia e incolla il tuo CSS grezzo, minificato o non formattato nell'editor.",
        hiw_2_title: "Clicca su Formatta",
        hiw_2_desc: "Premi il pulsante Formatta CSS e il codice verrà riformattato all'istante.",
        hiw_3_title: "Copia il Risultato",
        hiw_3_desc: "Copia il codice formattato o ricomincia con un nuovo codice.",
        use_cases_title: "Casi d'Uso Comuni",
        uc_1_title: "Revisioni del Codice",
        uc_1_desc: "Pulisci i fogli di stile disordinati prima di condividerli con i colleghi o aprire una pull request.",
        uc_2_title: "Debug di Stili",
        uc_2_desc: "Un'indentazione leggibile rende molto più facile tracciare le gerarchie di selettori e individuare le regole in conflitto.",
        uc_3_title: "Apprendimento e Documentazione",
        uc_3_desc: "Il CSS ben formattato è più facile da leggere, capire e includere nella documentazione o nei tutorial.",
        faq_title: "Domande e Risposte",
        faq_1_q: "Il mio codice CSS viene inviato a qualche server?",
        faq_1_a: "No. Tutta l'elaborazione avviene nel tuo browser. Il tuo codice non lascia mai il tuo dispositivo.",
        faq_2_q: "Il formattatore supporta la sintassi CSS moderna?",
        faq_2_a: "Sì. Il formattatore supporta il CSS moderno, incluse le proprietà personalizzate, l'annidamento, le media query e le at-rule.",
        faq_3_q: "Cosa succede se il mio CSS ha errori di sintassi?",
        faq_3_a: "Se il codice non può essere analizzato, lo strumento mostrerà un messaggio di errore per aiutarti a identificare e correggere il problema prima della formattazione.",
        see1: "Minificatore di CSS",
        see2: "Formattatore HTML",
        see3: "Formattatore JavaScript",
        see4: "Visualizzatore JSON",
        f_1: "Formattazione istantanea del CSS",
        f_2: "Indentazione corretta e spaziatura coerente",
        f_3: "Rilevamento e segnalazione degli errori di sintassi",
        f_4: "Nessuna registrazione o installazione richiesta"
    },
    id: {
        m_title: "Pemformat CSS Online - Format & Indentasi CSS Gratis",
        title: "Pemformat CSS",
        meta: "Pemformat CSS online gratis. Tempelkan kode CSS Anda dan dapatkan indentasi yang benar dan struktur yang seragam secara instan.",
        d1: "Pemformat CSS online ini mengurai dan memformat ulang lembar gaya Anda dengan indentasi yang konsisten dan struktur yang seragam. Semua CSS yang berantakan, diminifikasi, atau tidak terorganisir diubah menjadi kode yang mudah dibaca dan terstruktur dengan baik dalam satu klik.",
        d2: "Alat ini menghapus baris kosong yang tidak perlu, memperbaiki indentasi, dan menormalkan spasi di dalam aturan dan deklarasi, membuat kode lebih mudah ditinjau, di-debug, atau diserahkan ke rekan kerja.",
        plc: "Masukkan kode CSS di sini atau seret file",
        bt: "Format CSS",
        rst: "Mulai Ulang",
        copy: "Salin",
        err: "Kesalahan",
        err_label: "Tidak dapat memformat CSS",
        how_it_works_title: "Cara Kerja",
        hiw_1_title: "Tempel CSS Anda",
        hiw_1_desc: "Salin dan tempel CSS mentah, diminifikasi, atau tidak terformat ke dalam editor.",
        hiw_2_title: "Klik Format",
        hiw_2_desc: "Tekan tombol Format CSS dan kode akan diformat ulang secara instan.",
        hiw_3_title: "Salin Hasilnya",
        hiw_3_desc: "Salin kode yang telah diformat atau mulai ulang dengan kode baru.",
        use_cases_title: "Kegunaan Utama",
        uc_1_title: "Tinjauan Kode",
        uc_1_desc: "Bersihkan lembar gaya yang berantakan sebelum membagikannya dengan rekan atau membuka pull request.",
        uc_2_title: "Debug Gaya",
        uc_2_desc: "Indentasi yang mudah dibaca memudahkan penelusuran hierarki selektor dan identifikasi aturan yang bertentangan.",
        uc_3_title: "Pembelajaran dan Dokumentasi",
        uc_3_desc: "CSS yang terformat dengan baik lebih mudah dibaca, dipahami, dan disertakan dalam dokumentasi atau tutorial.",
        faq_title: "Tanya Jawab",
        faq_1_q: "Apakah kode CSS saya dikirim ke server?",
        faq_1_a: "Tidak. Semua pemrosesan dilakukan di browser Anda. Kode Anda tidak pernah meninggalkan perangkat Anda.",
        faq_2_q: "Apakah pemformat mendukung sintaks CSS modern?",
        faq_2_a: "Ya. Pemformat mendukung CSS modern termasuk properti kustom, penumpukan, media query, dan at-rule.",
        faq_3_q: "Apa yang terjadi jika CSS saya memiliki kesalahan sintaks?",
        faq_3_a: "Jika kode tidak dapat diurai, alat ini akan menampilkan pesan kesalahan agar Anda dapat mengidentifikasi dan memperbaiki masalah sebelum memformat.",
        see1: "Minifikasi CSS",
        see2: "Pemformat HTML",
        see3: "Pemformat JavaScript",
        see4: "Penampil JSON",
        f_1: "Pemformatan CSS secara instan",
        f_2: "Indentasi yang benar dan spasi yang konsisten",
        f_3: "Deteksi dan pelaporan kesalahan sintaks",
        f_4: "Tanpa pendaftaran atau instalasi"
    }
}
</i18n>
