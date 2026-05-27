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
    id: '/pemformat-css',
    de: '/css-formatter',
    nl: '/css-formatter',
    ru: '/formatator-css'
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
        m_title: "CSS Formatter & Beautifier Online - Format for Free",
        title: "CSS Formatter",
        meta: "Free online CSS formatter and beautifier. Paste your CSS code and instantly format, indent and beautify it with consistent structure — no signup, no installation.",
        d1: "This online CSS formatter and beautifier parses and reformats your stylesheet with consistent indentation and uniform structure. Any messy, minified, or poorly organized CSS is transformed into readable, well-structured code in one click.",
        d2: "It removes unnecessary blank lines, fixes indentation, and normalizes spacing inside rules and declarations, making the code easier to review, debug, or hand off to a teammate — a free CSS beautifier that runs entirely in your browser.",
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
        use_cases_title: "Use Cases",
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
        meta: "Formatador CSS online e gratuito (CSS beautifier). Cole seu código CSS e deixe-o organizado com indentação correta e estrutura uniformizada.",
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
        use_cases_title: "Casos de Uso",
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
        meta: "Formateador CSS online y gratuito (CSS beautifier). Pega tu código CSS y organízalo al instante con indentación correcta y estructura uniforme.",
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
        use_cases_title: "Casos de Uso",
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
        m_title: "Formateur CSS en Ligne - Indentez votre CSS Gratuit",
        title: "Formateur CSS",
        meta: "Formateur CSS en ligne gratuit (CSS beautifier). Collez votre code CSS et obtenez instantanément une indentation correcte et une structure uniforme.",
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
        use_cases_title: "Cas d'Utilisation",
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
        m_title: "Formattatore CSS Online - Indenta il tuo CSS Gratis",
        title: "Formattatore CSS",
        meta: "Formattatore CSS online gratuito (CSS beautifier). Incolla il tuo codice CSS e ottieni istantaneamente indentazione corretta e struttura uniforme.",
        d1: "Questo formattatore CSS online analizza e riformatta il tuo foglio di stile con indentazione coerente e struttura uniforme. Qualsiasi CSS disordinato, minificato o mal organizzato viene trasformato in codice leggibile e ben strutturato con un clic.",
        d2: "Rimuove le righe vuote inutili, corregge l'indentazione e normalizza la spaziatura all'interno di regole e dichiarazioni, rendendo il codice più facile da revisionare, debuggare o passare a un collega.",
        plc: "Inserisci il codice CSS ici o trascina un file",
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
        use_cases_title: "Casi d'Uso",
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
        faq_3_a: "Se il codice non può essere analizzato, lo strumento mostrerà un messaggio d'errore per aiutarti a identificare e correggere il problema prima della formattazione.",
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
        meta: "Pemformat CSS online gratis (CSS beautifier). Tempelkan kode CSS Anda dan dapatkan indentasi yang benar dan struktur yang seragam secara instan.",
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
        use_cases_title: "Contoh Penggunaan",
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
        f_1: "Pemercantikan dan pemformatan CSS secara instan",
        f_2: "Indentasi yang benar dan spasi yang konsisten",
        f_3: "Deteksi dan pelaporan kesalahan sintaks",
        f_4: "Tanpa pendaftaran atau instalasi"
    },
    de: {
        m_title: "CSS Formatter & Beautifier Online - Kostenlos",
        title: "CSS Formatter",
        meta: "Kostenloser Online-CSS-Formatter und Beautifier. Fügen Sie Ihren CSS-Code ein und formatieren Sie ihn sofort mit korrekter Einrückung und konsistenter Struktur.",
        d1: "Dieser Online-CSS-Formatter analysiert und formatiert Ihr Stylesheet mit konsistenter Einrückung und einheitlicher Struktur neu. Unübersichtlicher, minifizierter oder schlecht organisierter CSS-Code wird mit einem Klick in gut lesbaren und strukturierten Code umgewandelt.",
        d2: "Er entfernt unnötige Leerzeilen, korrigiert die Einrückung und normalisiert Abstände innerhalb von Regeln und Deklarationen, wodurch der Code leichter überprüft, debuggt oder an Kollegen weitergegeben werden kann.",
        plc: "Fügen Sie hier den CSS-Code ein oder ziehen Sie eine Datei hinein",
        bt: "CSS formatieren",
        rst: "Neu beginnen",
        copy: "Kopieren",
        err: "Fehler",
        err_label: "CSS konnte nicht formatiert werden",
        how_it_works_title: "So funktioniert es",
        hiw_1_title: "CSS einfügen",
        hiw_1_desc: "Kopieren und fügen Sie Ihren rohen, minifizierten oder unformatierten CSS-Code in den Editor ein.",
        hiw_2_title: "Formatieren klicken",
        hiw_2_desc: "Klicken Sie auf die Schaltfläche „CSS formatieren“, und der Code wird sofort neu formatiert.",
        hiw_3_title: "Ergebnis kopieren",
        hiw_3_desc: "Kopieren Sie das formatierte Ergebnis oder starten Sie mit neuem Code von vorne.",
        use_cases_title: "Anwendungsfälle",
        uc_1_title: "Code-Reviews",
        uc_1_desc: "Bereinigen Sie Stylesheets, bevor Sie sie mit Kollegen teilen oder einen Pull Request erstellen.",
        uc_2_title: "Styles debuggen",
        uc_2_desc: "Lesbare Einrückung erleichtert das Nachverfolgen von Selektor-Hierarchien und das Finden widersprüchlicher Regeln erheblich.",
        uc_3_title: "Lernen & Dokumentation",
        uc_3_desc: "Gut formatiertes CSS ist leichter zu lesen, zu verstehen und in Dokumentationen oder Tutorials einzubinden.",
        faq_title: "Fragen & Antworten",
        faq_1_q: "Wird mein CSS-Code an einen Server gesendet?",
        faq_1_a: "Nein. Die gesamte Verarbeitung erfolgt in Ihrem Browser. Ihr Code verlässt Ihr Gerät nicht.",
        faq_2_q: "Unterstützt der Formatter moderne CSS-Syntax?",
        faq_2_a: "Ja. Der Formatter unterstützt modernes CSS, einschließlich benutzerdefinierter Eigenschaften, Verschachtelung, Media Queries und At-Rules.",
        faq_3_q: "Was passiert, wenn mein CSS Syntaxfehler enthält?",
        faq_3_a: "Wenn der Code nicht verarbeitet werden kann, zeigt das Tool eine Fehlermeldung an, damit Sie das Problem vor der Formatierung beheben können.",
        see1: "CSS-Minimierer",
        see2: "HTML-Formatierer",
        see3: "JavaScript-Formatierer",
        see4: "JSON-Betrachter",
        f_1: "Sofortige CSS-Formatierung und Verschönerung",
        f_2: "Korrekte Einrückung und konsistente Abstände",
        f_3: "Erkennung und Anzeige von Syntaxfehlern",
        f_4: "Keine Registrierung oder Installation erforderlich"
    },
    nl: {
        m_title: "CSS Formatter & Beautifier Online - Gratis",
        title: "CSS Formatter",
        meta: "Gratis online CSS-formatter en beautifier. Plak je CSS-code en maak hem direct netjes met correcte inspringing en consistente structuur.",
        d1: "Deze online CSS-formatter analyseert en formatteert je stylesheet opnieuw met consistente inspringing en structuur. Rommelige, geminificeerde of slecht georganiseerde CSS wordt met één klik omgezet in leesbare en goed gestructureerde code.",
        d2: "Het verwijdert onnodige lege regels, corrigeert inspringing en normaliseert spaties binnen regels en declaraties, waardoor de code makkelijker te controleren, debuggen of te delen is.",
        plc: "Plak hier de CSS-code of sleep een bestand",
        bt: "CSS formatteren",
        rst: "Opnieuw beginnen",
        copy: "Kopiëren",
        err: "Fout",
        err_label: "Kon CSS niet formatteren",
        how_it_works_title: "Hoe het werkt",
        hiw_1_title: "Plak je CSS",
        hiw_1_desc: "Kopieer en plak je ruwe, geminificeerde of ongeformatteerde CSS in de editor.",
        hiw_2_title: "Klik op formatteren",
        hiw_2_desc: "Druk op de knop 'CSS formatteren' en de code wordt direct opnieuw opgemaakt.",
        hiw_3_title: "Kopieer het resultaat",
        hiw_3_desc: "Kopieer de geformatteerde output of begin opnieuw met nieuwe code.",
        use_cases_title: "Gebruiksscenario's",
        uc_1_title: "Code reviews",
        uc_1_desc: "Maak stylesheets netjes voordat je ze deelt met collega's of een pull request opent.",
        uc_2_title: "Styles debuggen",
        uc_2_desc: "Goede inspringing maakt het veel makkelijker om selector-hiërarchieën te volgen en conflicterende regels te vinden.",
        uc_3_title: "Leren & documentatie",
        uc_3_desc: "Goed geformatteerde CSS is makkelijker te lezen, begrijpen en te gebruiken in documentatie of tutorials.",
        faq_title: "Vragen & antwoorden",
        faq_1_q: "Wordt mijn CSS-code naar een server gestuurd?",
        faq_1_a: "Nee. Alles gebeurt in je browser. Je code verlaat je apparaat niet.",
        faq_2_q: "Ondersteunt de formatter moderne CSS-syntax?",
        faq_2_a: "Ja. De formatter ondersteunt moderne CSS inclusief custom properties, nesting, media queries en at-rules.",
        faq_3_q: "Wat gebeurt er als mijn CSS syntaxfouten bevat?",
        faq_3_a: "Als de code niet kan worden geparseerd, toont de tool een foutmelding zodat je het probleem kunt oplossen vóór het formatteren.",
        see1: "CSS-minifier",
        see2: "HTML-formatteerder",
        see3: "JavaScript-formatteerder",
        see4: "JSON-viewer",
        f_1: "Directe CSS-formattering en opschoning",
        f_2: "Correcte inspringing en consistente spaties",
        f_3: "Detectie en melding van syntaxfouten",
        f_4: "Geen registratie of installatie vereist"
    },
    ru: {
        m_title: "Форматтер CSS онлайн — форматируйте и индентируйте CSS бесплатно",
        title: "Форматтер CSS",
        meta: "Бесплатный онлайн-форматтер и структуризатор CSS. Вставьте свой CSS-код, чтобы мгновенно отформатировать, индентировать и сделать его аккуратным и читаемым.",
        d1: "Этот онлайн-форматтер и структуризатор CSS анализирует и форматирует вашу таблицу стилей с последовательным отступом и единой структурой. Любой запутанный, минифицированный или плохо организованный код CSS преобразуется в хорошо читаемый и структурированный код всего за один клик.",
        d2: "Он удаляет ненужные пустые строки, исправляет отступы и нормализует пробелы внутри правил и объявлений, что упрощает просмотр, отладку или передачу кода другим разработчикам. Инструмент работает полностью в вашем браузере.",
        plc: "Вставьте код CSS сюда или перетащите файл",
        bt: "Форматировать CSS",
        rst: "Начать заново",
        copy: "Копировать",
        err: "Ошибка",
        err_label: "Не удалось отформатировать CSS",
        how_it_works_title: "Как это работает",
        hiw_1_title: "Вставьте ваш CSS",
        hiw_1_desc: "Скопируйте и вставьте исходный, минифицированный или неформатированный CSS-код в редактор.",
        hiw_2_title: "Нажмите «Форматировать»",
        hiw_2_desc: "Нажмите кнопку «Форматировать CSS», и инструмент мгновенно перестроит код.",
        hiw_3_title: "Скопируйте результат",
        hiw_3_desc: "Скопируйте отформатированный результат или начните заново с новым кодом.",
        use_cases_title: "Варианты использования",
        uc_1_title: "Обзоры кода (Code Review)",
        uc_1_desc: "Приведите таблицы стилей в порядок перед тем, как делиться ими с коллегами или создавать пулл-реквест.",
        uc_2_title: "Отладка стилей",
        uc_2_desc: "Удобочитаемые отступы значительно упрощают отслеживание иерархии селекторов и поиск конфликтущих правил.",
        uc_3_title: "Обучение и документация",
        uc_3_desc: "Правильно форматированный CSS легче читать, понимать и использовать в учебных руководствах или документации.",
        faq_title: "Вопросы и ответы",
        faq_1_q: "Отправляется ли мой CSS-код на какой-либо сервер?",
        faq_1_a: "Нет. Все форматирование выполняется исключительно в вашем браузере. Ваш код никогда не покидает ваше устройство.",
        faq_2_q: "Поддерживает ли форматтер современный синтаксис CSS?",
        faq_2_a: "Да. Форматтер поддерживает современные возможности CSS, включая пользовательские свойства (переменные), вложенность, медиа-запросы и директивы (at-rules).",
        faq_3_q: "Что произойдет, если в моем CSS-коде будут синтаксические ошибки?",
        faq_3_a: "Если код не удастся проанализировать, инструмент выведет сообщение об ошибке, чтобы вы могли локализовать и исправить проблему перед форматированием.",
        see1: "Минификатор CSS",
        see2: "Форматтер HTML",
        see3: "Форматтер JavaScript",
        see4: "Просмотр JSON",
        f_1: "Мгновенное форматирование и украшение CSS",
        f_2: "Правильные отступы и последовательные пробелы",
        f_3: "Обнаружение и отображение синтаксических ошибок",
        f_4: "Не требуется регистрация или установка"
    }
}
</i18n>
