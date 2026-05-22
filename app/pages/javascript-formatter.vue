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
      parser: 'babel',
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
    en: '/javascript-formatter',
    pt: '/formatador-javascript',
    es: '/formateador-javascript',
    fr: '/formateur-javascript',
    it: '/formattatore-javascript',
    id: '/pemformat-javascript',
    de: '/javascript-formatter',
    nl: '/javascript-formatter'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'javascript-minifier' },
      { label: t('see2'), to: 'html-formatter' },
      { label: t('see3'), to: 'css-formatter' },
      { label: t('see4'), to: 'graphql-formatter' }
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
        lang="javascript"
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
            {{ t('copy') }} Javascript
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
          <p>{{ t('d1') }} {{ t('d2') }}</p>
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
    m_title: "JavaScript Formatter Online - Beautify & Indent JS for Free",
    title: "JavaScript Formatter",
    meta: "Free online JavaScript formatter. Paste your JS code and instantly beautify it with proper indentation and consistent structure.",
    d1: "This online JavaScript formatter parses and reformats your code with consistent indentation and uniform structure. Any messy, minified, or poorly organized script is transformed into readable, well-structured JavaScript in one click.",
    d2: "It removes unnecessary blank lines, fixes indentation, and normalizes spacing around operators and brackets — making the code easier to review, debug, or hand off to a teammate.",
    plc: "Insert the JavaScript code here or drag a file",
    bt: "Format JavaScript",
    rst: "Start Over",
    copy: "Copy",
    err: "Error",
    err_label: "Could not format JavaScript",
    how_it_works_title: "How It Works",
    hiw_1_title: "Paste Your JavaScript",
    hiw_1_desc: "Copy and paste your raw, minified, or unformatted JavaScript into the editor.",
    hiw_2_title: "Click Format",
    hiw_2_desc: "Press the Format JavaScript button and the tool will reformat the code instantly.",
    hiw_3_title: "Copy the Result",
    hiw_3_desc: "Copy the formatted output or start over with new code.",
    use_cases_title: "Use Cases",
    uc_1_title: "Code Reviews",
    uc_1_desc: "Clean up messy scripts before sharing with teammates or opening a pull request.",
    uc_2_title: "Debugging",
    uc_2_desc: "Readable indentation and consistent spacing make it much easier to trace logic and spot bugs.",
    uc_3_title: "Learning & Documentation",
    uc_3_desc: "Properly formatted JavaScript is easier to read, understand, and include in documentation or tutorials.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is my JavaScript code sent to any server?",
    faq_1_a: "No. All formatting is done entirely in your browser. Your code never leaves your device.",
    faq_2_q: "Does the formatter support modern JavaScript syntax?",
    faq_2_a: "Yes. The formatter supports modern JavaScript including ES2020+ features, arrow functions, destructuring, async/await, and more.",
    faq_3_q: "What happens if my JavaScript has syntax errors?",
    faq_3_a: "If the code cannot be parsed, the tool will display an error message so you can identify and fix the issue before formatting.",
    see1: "JavaScript Minifier",
    see2: "HTML Formatter",
    see3: "CSS Formatter",
    see4: "GraphQL Formatter",
    f_1: "Instant JavaScript beautification and formatting",
    f_2: "Correct indentation and consistent spacing",
    f_3: "Syntax error detection and reporting",
    f_4: "No registration or installation required"
  },
  pt: {
    m_title: "Formatador JavaScript Online - Embeleze e Indente JS de Graça",
    title: "Formatador JavaScript",
    meta: "Formatador JavaScript online gratuito. Cole seu código JS e deixe-o organizado com indentação correta e estrutura uniformizada.",
    d1: "Este formatador JavaScript online analisa e reformata seu código com indentação consistente e estrutura uniformizada. Todo código bagunçado, minificado ou mal organizado é transformado em JavaScript legível e bem estruturado com um clique.",
    d2: "Ele remove linhas em branco desnecessárias, corrige a indentação e normaliza o espaçamento em torno de operadores e colchetes — facilitando a revisão, depuração ou entrega do código para um colega.",
    plc: "Insira o código JavaScript aqui ou arraste um arquivo",
    bt: "Formatar JavaScript",
    rst: "Recomeçar",
    copy: "Copiar",
    err: "Erro",
    err_label: "Não foi possível formatar o JavaScript",
    how_it_works_title: "Como Funciona",
    hiw_1_title: "Cole seu JavaScript",
    hiw_1_desc: "Copie e cole seu JavaScript bruto, minificado ou sem formatação no editor.",
    hiw_2_title: "Clique em Formatar",
    hiw_2_desc: "Pressione o botão Formatar JavaScript e o código será reformatado instantaneamente.",
    hiw_3_title: "Copie o Resultado",
    hiw_3_desc: "Copie o código formatado ou comece de novo com um novo código.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Revisões de Código",
    uc_1_desc: "Limpe scripts bagunçados antes de compartilhar com colegas ou abrir um pull request.",
    uc_2_title: "Depuração",
    uc_2_desc: "Indentação legível e espaçamento consistente facilitam muito o rastreamento de lógica e a identificação de bugs.",
    uc_3_title: "Aprendizado e Documentação",
    uc_3_desc: "JavaScript bem formatado é mais fácil de ler, entender e incluir em documentações ou tutoriais.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Meu código JavaScript é enviado para algum servidor?",
    faq_1_a: "Não. Todo o processamento é feito no seu navegador. Seu código nunca sai do seu dispositivo.",
    faq_2_q: "O formatador suporta sintaxe JavaScript moderna?",
    faq_2_a: "Sim. O formatador suporta JavaScript moderno, incluindo recursos ES2020+, arrow functions, desestruturação, async/await e muito mais.",
    faq_3_q: "O que acontece se meu JavaScript tiver erros de sintaxe?",
    faq_3_a: "Se o código não puder ser analisado, a ferramenta exibirá uma mensagem de erro para você identificar e corrigir o problema antes de formatar.",
    see1: "Minificador de JavaScript",
    see2: "Formatador HTML",
    see3: "Formatador CSS",
    see4: "Formatador GraphQL",
    f_1: "Embelezamento e formatação instantânea de JavaScript",
    f_2: "Indentação correta e espaçamento consistente",
    f_3: "Detecção e reporte de erros de sintaxe",
    f_4: "Sem necessidade de cadastro ou instalação"
  },
  es: {
    m_title: "Formateador JavaScript Online - Embellece e Indenta JS Gratis",
    title: "Formateador JavaScript",
    meta: "Formateador JavaScript online gratuito. Pega tu código JS y organízalo al instante con indentación correcta y estructura uniforme.",
    d1: "Este formateador JavaScript online analiza y reformatea tu código con indentación consistente y estructura uniforme. Todo código desordenado, minificado o mal organizado se transforma en JavaScript legible y bien estructurado con un clic.",
    d2: "Elimina líneas en blanco innecesarias, corrige la indentación y normaliza el espaciado alrededor de operadores y corchetes — facilitando la revisión, depuración o entrega del código a un compañero.",
    plc: "Introduce el código JavaScript aquí o arrastra un archivo",
    bt: "Formatear JavaScript",
    rst: "Recomenzar",
    copy: "Copiar",
    err: "Error",
    err_label: "No se pudo formatear el JavaScript",
    how_it_works_title: "Cómo Funciona",
    hiw_1_title: "Pega tu JavaScript",
    hiw_1_desc: "Copia y pega tu JavaScript en bruto, minificado o sin formato en el editor.",
    hiw_2_title: "Haz clic en Formatear",
    hiw_2_desc: "Pulsa el botón Formatear JavaScript y el código se reformateará al instante.",
    hiw_3_title: "Copia el Resultado",
    hiw_3_desc: "Copia el código formateado o empieza de nuevo con código nuevo.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Revisiones de Código",
    uc_1_desc: "Limpia scripts desordenados antes de compartirlos con compañeros o abrir un pull request.",
    uc_2_title: "Depuración",
    uc_2_desc: "La indentación legible y el espaciado consistente facilitan mucho el rastreo de la lógica y la detección de errores.",
    uc_3_title: "Aprendizaje y Documentación",
    uc_3_desc: "El JavaScript bien formateado es más fácil de leer, entender e incluir en documentación o tutoriales.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mi código JavaScript se envía a algún servidor?",
    faq_1_a: "No. Todo el procesamiento se realiza en tu navegador. Tu código nunca sale de tu dispositivo.",
    faq_2_q: "¿El formateador admite sintaxis JavaScript moderna?",
    faq_2_a: "Sí. El formateador admite JavaScript moderno, incluyendo características ES2020+, arrow functions, desestructuración, async/await y más.",
    faq_3_q: "¿Qué ocurre si mi JavaScript tiene errores de sintaxis?",
    faq_3_a: "Si el código no se puede analizar, la herramienta mostrará un mensaje de error para que puedas identificar y solucionar el problema antes de formatear.",
    see1: "Minificador JavaScript",
    see2: "Formateador HTML",
    see3: "Formateador CSS",
    see4: "Formateador GraphQL",
    f_1: "Embellecimiento y formateo instantáneo de JavaScript",
    f_2: "Indentación correcta y espaciado consistente",
    f_3: "Detección y reporte de errores de sintaxis",
    f_4: "Sin necesidad de registro ni instalación"
  },
  fr: {
    m_title: "Formateur JavaScript en Ligne - Embellissez et Indentez JS Gratuitement",
    title: "Formateur JavaScript",
    meta: "Formateur JavaScript en ligne gratuit. Collez votre code JS et obtenez instantanément une indentation correcte et une structure uniforme.",
    d1: "Ce formateur JavaScript en ligne analyse et reformate votre code avec une indentation cohérente et une structure uniforme. Tout code désordonné, minifié ou mal organisé est transformé en JavaScript lisible et bien structuré en un clic.",
    d2: "Il supprime les lignes vides inutiles, corrige l'indentation et normalise les espaces autour des opérateurs et des accolades — facilitant la révision, le débogage ou la transmission du code à un collègue.",
    plc: "Insérez le code JavaScript ici ou faites glisser un fichier",
    bt: "Formater JavaScript",
    rst: "Recommencer",
    copy: "Copier",
    err: "Erreur",
    err_label: "Impossible de formater le JavaScript",
    how_it_works_title: "Comment Ça Marche",
    hiw_1_title: "Collez Votre JavaScript",
    hiw_1_desc: "Copiez et collez votre JavaScript brut, minifié ou non formaté dans l'éditeur.",
    hiw_2_title: "Cliquez sur Formater",
    hiw_2_desc: "Appuyez sur le bouton Formater JavaScript et le code sera reformaté instantanément.",
    hiw_3_title: "Copiez le Résultat",
    hiw_3_desc: "Copiez le code formaté ou recommencez avec un nouveau code.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Revues de Code",
    uc_1_desc: "Nettoyez les scripts désordonnés avant de les partager avec vos collègues ou d'ouvrir une pull request.",
    uc_2_title: "Débogage",
    uc_2_desc: "Une indentation lisible et un espacement cohérent facilitent grandement le suivi de la logique et la détection des bugs.",
    uc_3_title: "Apprentissage et Documentation",
    uc_3_desc: "Un JavaScript bien formaté est plus facile à lire, à comprendre et à inclure dans la documentation ou les tutoriels.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Mon code JavaScript est-il envoyé à un serveur ?",
    faq_1_a: "Non. Tout le traitement est effectué dans votre navigateur. Votre code ne quitte jamais votre appareil.",
    faq_2_q: "Le formateur prend-il en charge la syntaxe JavaScript moderne ?",
    faq_2_a: "Oui. Le formateur prend en charge le JavaScript moderne, y compris les fonctionnalités ES2020+, les fonctions fléchées, la déstructuration, async/await et bien plus encore.",
    faq_3_q: "Que se passe-t-il si mon JavaScript contient des erreurs de syntaxe ?",
    faq_3_a: "Si le code ne peut pas être analysé, l'outil affichera un message d'erreur pour vous aider à identifier et corriger le problème avant le formatage.",
    see1: "Minificateur JavaScript",
    see2: "Formateur HTML",
    see3: "Formateur CSS",
    see4: "Formateur GraphQL",
    f_1: "Embellissement et formatage instantanés du JavaScript",
    f_2: "Indentation correcte et espacement cohérent",
    f_3: "Détection et signalement des erreurs de syntaxe",
    f_4: "Aucune inscription ou installation requise"
  },
  it: {
    m_title: "Formattatore JavaScript Online - Abbellisci e Indenta JS Gratis",
    title: "Formattatore JavaScript",
    meta: "Formattatore JavaScript online gratuito. Incolla il tuo codice JS e ottieni istantaneamente indentazione corretta e struttura uniforme.",
    d1: "Questo formattatore JavaScript online analizza e riformatta il tuo codice con indentazione coerente e struttura uniforme. Qualsiasi codice disordinato, minificato o mal organizzato viene trasformato in JavaScript leggibile e ben strutturato con un clic.",
    d2: "Rimuove le righe vuote inutili, corregge l'indentazione e normalizza la spaziatura attorno a operatori e parentesi — rendendo il codice più facile da revisionare, debuggare o passare a un collega.",
    plc: "Inserisci il codice JavaScript qui o trascina un file",
    bt: "Formatta JavaScript",
    rst: "Ricomincia",
    copy: "Copia",
    err: "Errore",
    err_label: "Impossibile formattare il JavaScript",
    how_it_works_title: "Come Funziona",
    hiw_1_title: "Incolla il tuo JavaScript",
    hiw_1_desc: "Copia e incolla il tuo JavaScript grezzo, minificato o non formattato nell'editor.",
    hiw_2_title: "Clicca su Formatta",
    hiw_2_desc: "Premi il pulsante Formatta JavaScript e il codice verrà riformattato all'istante.",
    hiw_3_title: "Copia il Risultato",
    hiw_3_desc: "Copia il codice formattato o ricomincia con un nuovo codice.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Revisioni del Codice",
    uc_1_desc: "Pulisci gli script disordinati prima di condividerli con i colleghi o aprire una pull request.",
    uc_2_title: "Debug",
    uc_2_desc: "Un'indentazione leggibile e una spaziatura coerente rendono molto più facile tracciare la logica e individuare i bug.",
    uc_3_title: "Apprendimento e Documentazione",
    uc_3_desc: "Il JavaScript ben formattato è più facile da leggere, capire e includere nella documentazione o nei tutorial.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Il mio codice JavaScript viene inviato a qualche server?",
    faq_1_a: "No. Tutta l'elaborazione avviene nel tuo browser. Il tuo codice non lascia mai il tuo dispositivo.",
    faq_2_q: "Il formattatore supporta la sintassi JavaScript moderna?",
    faq_2_a: "Sì. Il formattatore supporta il JavaScript moderno, incluse le funzionalità ES2020+, le arrow function, la destrutturazione, async/await e molto altro.",
    faq_3_q: "Cosa succede se il mio JavaScript ha errori di sintassi?",
    faq_3_a: "Se il codice non può essere analizzato, lo strumento mostrerà un messaggio di errore per aiutarti a identificare e correggere il problema prima della formattazione.",
    see1: "Minificatore di JavaScript",
    see2: "Formattatore HTML",
    see3: "Formattatore CSS",
    see4: "Formattatore GraphQL",
    f_1: "Abbellimento e formattazione istantanei del JavaScript",
    f_2: "Indentazione corretta e spaziatura coerente",
    f_3: "Rilevamento e segnalazione degli errori di sintassi",
    f_4: "Nessuna registrazione o installazione richiesta"
  },
  id: {
    m_title: "Pemformat JavaScript Online - Percantik & Indentasi JS Gratis",
    title: "Pemformat JavaScript",
    meta: "Pemformat JavaScript online gratis. Tempelkan kode JS Anda dan dapatkan indentasi yang benar dan struktur yang seragam secara instan.",
    d1: "Pemformat JavaScript online ini mengurai dan memformat ulang kode Anda dengan indentasi yang konsisten dan struktur yang seragam. Semua kode yang berantakan, diminifikasi, atau tidak terorganisir diubah menjadi JavaScript yang mudah dibaca dan terstruktur dengan baik dalam satu klik.",
    d2: "Alat ini menghapus baris kosong yang tidak perlu, memperbaiki indentasi, dan menormalkan spasi di sekitar operator dan tanda kurung — membuat kode lebih mudah ditinjau, di-debug, atau diserahkan ke rekan kerja.",
    plc: "Masukkan kode JavaScript di sini atau seret file",
    bt: "Format JavaScript",
    rst: "Mulai Ulang",
    copy: "Salin",
    err: "Kesalahan",
    err_label: "Tidak dapat memformat JavaScript",
    how_it_works_title: "Cara Kerja",
    hiw_1_title: "Tempel JavaScript Anda",
    hiw_1_desc: "Salin dan tempel JavaScript mentah, diminifikasi, atau tidak terformat ke dalam editor.",
    hiw_2_title: "Klik Format",
    hiw_2_desc: "Tekan tombol Format JavaScript dan kode akan diformat ulang secara instan.",
    hiw_3_title: "Salin Hasilnya",
    hiw_3_desc: "Salin kode yang telah diformat atau mulai ulang dengan kode baru.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Tinjauan Kode",
    uc_1_desc: "Bersihkan skrip yang berantakan sebelum membagikannya dengan rekan atau membuka pull request.",
    uc_2_title: "Debug",
    uc_2_desc: "Indentasi yang mudah dibaca dan spasi yang konsisten memudahkan penelusuran logika dan identifikasi bug.",
    uc_3_title: "Pembelajaran dan Dokumentasi",
    uc_3_desc: "JavaScript yang terformat dengan baik lebih mudah dibaca, dipahami, dan disertakan dalam dokumentasi atau tutorial.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah kode JavaScript saya dikirim ke server?",
    faq_1_a: "Tidak. Semua pemrosesan dilakukan di browser Anda. Kode Anda tidak pernah meninggalkan perangkat Anda.",
    faq_2_q: "Apakah pemformat mendukung sintaks JavaScript modern?",
    faq_2_a: "Ya. Pemformat mendukung JavaScript modern termasuk fitur ES2020+, arrow function, destructuring, async/await, dan banyak lagi.",
    faq_3_q: "Apa yang terjadi jika JavaScript saya memiliki kesalahan sintaks?",
    faq_3_a: "Jika kode tidak dapat diurai, alat ini akan menampilkan pesan kesalahan agar Anda dapat mengidentifikasi dan memperbaiki masalah sebelum memformat.",
    see1: "Minifikasi JavaScript",
    see2: "Pemformat HTML",
    see3: "Pemformat CSS",
    see4: "Pemformat GraphQL",
    f_1: "Pemercantikan dan pemformatan JavaScript secara instan",
    f_2: "Indentasi yang benar dan spasi yang konsisten",
    f_3: "Deteksi dan pelaporan kesalahan sintaks",
    f_4: "Tanpa pendaftaran atau instalasi"
  },
  de: {
    m_title: "JavaScript Formatter Online - JS kostenlos formatieren und einrücken",
    title: "JavaScript Formatter",
    meta: "Kostenloser Online-JavaScript-Formatter. Fügen Sie Ihren JS-Code ein und formatieren Sie ihn sofort mit korrekter Einrückung und konsistenter Struktur.",
    d1: "Dieser Online-JavaScript-Formatter analysiert und formatiert Ihren Code mit konsistenter Einrückung und einheitlicher Struktur neu. Unübersichtlicher, minifizierter oder schlecht organisierter Code wird mit einem Klick in gut lesbares und strukturiertes JavaScript umgewandelt.",
    d2: "Er entfernt unnötige Leerzeilen, korrigiert die Einrückung und normalisiert Abstände rund um Operatoren und Klammern — wodurch der Code leichter überprüft, debuggt oder an Kollegen weitergegeben werden kann.",
    plc: "Fügen Sie hier den JavaScript-Code ein oder ziehen Sie eine Datei hinein",
    bt: "JavaScript formatieren",
    rst: "Neu beginnen",
    copy: "Kopieren",
    err: "Fehler",
    err_label: "JavaScript konnte nicht formatiert werden",
    how_it_works_title: "So funktioniert es",
    hiw_1_title: "JavaScript einfügen",
    hiw_1_desc: "Kopieren und fügen Sie Ihren rohen, minifizierten oder unformatierten JavaScript-Code in den Editor ein.",
    hiw_2_title: "Formatieren klicken",
    hiw_2_desc: "Klicken Sie auf die Schaltfläche „JavaScript formatieren“, und der Code wird sofort neu formatiert.",
    hiw_3_title: "Ergebnis kopieren",
    hiw_3_desc: "Kopieren Sie das formatierte Ergebnis oder starten Sie mit neuem Code von vorne.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Code-Reviews",
    uc_1_desc: "Bereinigen Sie unübersichtliche Skripte, bevor Sie sie mit Kollegen teilen oder einen Pull Request erstellen.",
    uc_2_title: "Debugging",
    uc_2_desc: "Lesbare Einrückung und konsistente Abstände erleichtern das Nachverfolgen der Logik und das Finden von Fehlern.",
    uc_3_title: "Lernen & Dokumentation",
    uc_3_desc: "Gut formatiertes JavaScript ist leichter zu lesen, zu verstehen und in Dokumentationen oder Tutorials einzubinden.",
    faq_title: "Fragen & Antworten",
    faq_1_q: "Wird mein JavaScript-Code an einen Server gesendet?",
    faq_1_a: "Nein. Die gesamte Verarbeitung erfolgt in Ihrem Browser. Ihr Code verlässt Ihr Gerät nicht.",
    faq_2_q: "Unterstützt der Formatter moderne JavaScript-Syntax?",
    faq_2_a: "Ja. Der Formatter unterstützt modernes JavaScript, einschließlich ES2020+, Arrow Functions, Destructuring, async/await und mehr.",
    faq_3_q: "Was passiert, wenn mein JavaScript Syntaxfehler enthält?",
    faq_3_a: "Wenn der Code nicht verarbeitet werden kann, zeigt das Tool eine Fehlermeldung an, damit Sie das Problem vor der Formatierung beheben können.",
    see1: "JavaScript-Minimierer",
    see2: "HTML-Formatierer",
    see3: "CSS-Formatierer",
    see4: "GraphQL-Formatierer",
    f_1: "Sofortige JavaScript-Formatierung und Verschönerung",
    f_2: "Korrekte Einrückung und konsistente Abstände",
    f_3: "Erkennung und Anzeige von Syntaxfehlern",
    f_4: "Keine Registrierung oder Installation erforderlich"
  },
  nl: {
    m_title: "JavaScript Formatter Online - JS gratis formatteren en inspringen",
    title: "JavaScript Formatter",
    meta: "Gratis online JavaScript-formatter. Plak je JS-code en maak hem direct netjes met correcte inspringing en consistente structuur.",
    d1: "Deze online JavaScript-formatter analyseert en formatteert je code opnieuw met consistente inspringing en structuur. Rommelige, geminificeerde of slecht georganiseerde code wordt met één klik omgezet in leesbare en goed gestructureerde JavaScript.",
    d2: "Het verwijdert onnodige lege regels, corrigeert inspringing en normaliseert spaties rond operatoren en haakjes — waardoor de code makkelijker te controleren, debuggen of te delen is.",
    plc: "Plak hier de JavaScript-code of sleep een bestand",
    bt: "JavaScript formatteren",
    rst: "Opnieuw beginnen",
    copy: "Kopiëren",
    err: "Fout",
    err_label: "Kon JavaScript niet formatteren",
    how_it_works_title: "Hoe het werkt",
    hiw_1_title: "Plak je JavaScript",
    hiw_1_desc: "Kopieer en plak je ruwe, geminificeerde of ongeformatteerde JavaScript in de editor.",
    hiw_2_title: "Klik op formatteren",
    hiw_2_desc: "Druk op de knop 'JavaScript formatteren' en de code wordt direct opnieuw opgemaakt.",
    hiw_3_title: "Kopieer het resultaat",
    hiw_3_desc: "Kopieer de geformatteerde output of begin opnieuw met nieuwe code.",
    use_cases_title: "Gebruiksscenario's",
    uc_1_title: "Code reviews",
    uc_1_desc: "Maak rommelige scripts netjes voordat je ze deelt met collega's of een pull request opent.",
    uc_2_title: "Debugging",
    uc_2_desc: "Goede inspringing en consistente spaties maken het veel makkelijker om logica te volgen en bugs te vinden.",
    uc_3_title: "Leren & documentatie",
    uc_3_desc: "Goed geformatteerde JavaScript is makkelijker te lezen, begrijpen en te gebruiken in documentatie of tutorials.",
    faq_title: "Vragen & antwoorden",
    faq_1_q: "Wordt mijn JavaScript-code naar een server gestuurd?",
    faq_1_a: "Nee. Alles gebeurt in je browser. Je code verlaat je apparaat niet.",
    faq_2_q: "Ondersteunt de formatter moderne JavaScript-syntax?",
    faq_2_a: "Ja. De formatter ondersteunt moderne JavaScript inclusief ES2020+, arrow functions, destructuring, async/await en meer.",
    faq_3_q: "Wat gebeurt er als mijn JavaScript syntaxfouten bevat?",
    faq_3_a: "Als de code niet kan worden geparseerd, toont de tool een foutmelding zodat je het probleem kunt oplossen vóór het formatteren.",
    see1: "JavaScript-minifier",
    see2: "HTML-formatteerder",
    see3: "CSS-formatteerder",
    see4: "GraphQL-formatteerder",
    f_1: "Directe JavaScript-formattering en opschoning",
    f_2: "Correcte inspringing en consistente spaties",
    f_3: "Detectie en melding van syntaxfouten",
    f_4: "Geen registratie of installatie vereist"
  }
}
</i18n>
