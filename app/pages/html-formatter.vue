<script setup lang="ts">
useScript('https://unpkg.com/prettier@2.8.8/standalone.js', { trigger: 'client' })
useScript('https://unpkg.com/prettier@2.8.8/parser-html.js', { trigger: 'client' })

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
      parser: 'html',
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
    en: '/html-formatter',
    pt: '/formatador-html',
    es: '/formateador-html',
    fr: '/formateur-html',
    it: '/formattatore-html',
    id: '/pemformat-html'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'html-minifier' },
      { label: t('see2'), to: 'javascript-formatter' },
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
        lang="html"
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
            {{ t('copy') }} HTML
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
        m_title: "HTML Formatter Online - Beautify & Indent HTML for Free",
        title: "HTML Formatter",
        meta: "Free online HTML formatter. Paste your HTML code and instantly beautify it with proper indentation and consistent structure.",
        d1: "This online HTML formatter parses and reformats your HTML code with consistent indentation and uniform structure. Any messy, minified, or poorly organized markup is transformed into readable, well-structured HTML in one click.",
        d2: "It removes unnecessary blank lines, fixes indentation, and aligns tags correctly, making the code easier to review, debug, or hand off to a teammate.",
        plc: "Insert the HTML code here or drag a file",
        bt: "Format HTML",
        rst: "Start Over",
        copy: "Copy",
        err: "Error",
        err_label: "Could not format HTML",
        how_it_works_title: "How It Works",
        hiw_1_title: "Paste Your HTML",
        hiw_1_desc: "Copy and paste your raw, minified, or unformatted HTML into the editor.",
        hiw_2_title: "Click Format",
        hiw_2_desc: "Press the Format HTML button and the tool will reformat the code instantly.",
        hiw_3_title: "Copy the Result",
        hiw_3_desc: "Copy the formatted output or start over with new code.",
        use_cases_title: "Common Use Cases",
        uc_1_title: "Code Reviews",
        uc_1_desc: "Clean up messy HTML before sharing it with teammates or opening a pull request.",
        uc_2_title: "Debugging Templates",
        uc_2_desc: "Readable indentation makes it much easier to spot unclosed tags or nesting issues.",
        uc_3_title: "Learning & Documentation",
        uc_3_desc: "Properly formatted HTML is easier to read, understand, and include in documentation.",
        faq_title: "Questions & Answers",
        faq_1_q: "Is my HTML code sent to any server?",
        faq_1_a: "No. All formatting is done entirely in your browser. Your code never leaves your device.",
        faq_2_q: "Which HTML standard does this formatter support?",
        faq_2_a: "The formatter supports standard HTML5 markup including custom attributes, inline scripts, and styles.",
        faq_3_q: "What happens if my HTML has syntax errors?",
        faq_3_a: "If the HTML cannot be parsed, the tool will display an error message so you can identify and fix the issue.",
        see1: "HTML Minifier",
        see2: "JavaScript Formatter",
        see3: "CSS Formatter",
        see4: "JSON Viewer",
        f_1: "Instant HTML beautification and formatting",
        f_2: "Correct indentation and tag alignment",
        f_3: "Syntax error detection and reporting",
        f_4: "No registration or installation required"
    },
    pt: {
        m_title: "Formatador HTML Online - Formate e Indente HTML Grátis",
        title: "Formatador HTML",
        meta: "Formatador HTML online gratuito. Cole seu código HTML e deixe-o organizado com indentação correta e estrutura uniformizada.",
        d1: "Este formatador HTML online analisa e reformata seu código HTML com indentação consistente e estrutura uniforme. Qualquer marcação bagunçada, minificada ou mal organizada é transformada em HTML legível e bem estruturado com um clique.",
        d2: "Ele remove linhas em branco desnecessárias, corrige a indentação e alinha as tags corretamente, facilitando a revisão, depuração ou entrega do código para um colega.",
        plc: "Insira o código HTML aqui ou arraste um arquivo",
        bt: "Formatar HTML",
        rst: "Recomeçar",
        copy: "Copiar",
        err: "Erro",
        err_label: "Não foi possível formatar o HTML",
        how_it_works_title: "Como Funciona",
        hiw_1_title: "Cole seu HTML",
        hiw_1_desc: "Copie e cole seu HTML bruto, minificado ou sem formatação no editor.",
        hiw_2_title: "Clique em Formatar",
        hiw_2_desc: "Pressione o botão Formatar HTML e o código será reformatado instantaneamente.",
        hiw_3_title: "Copie o Resultado",
        hiw_3_desc: "Copie o código formatado ou recomece com um novo código.",
        use_cases_title: "Principais Casos de Uso",
        uc_1_title: "Revisões de Código",
        uc_1_desc: "Limpe o HTML bagunçado antes de compartilhar com colegas ou abrir um pull request.",
        uc_2_title: "Depuração de Templates",
        uc_2_desc: "A indentação legível facilita muito a identificação de tags não fechadas ou problemas de aninhamento.",
        uc_3_title: "Aprendizado e Documentação",
        uc_3_desc: "HTML bem formatado é mais fácil de ler, entender e incluir em documentações.",
        faq_title: "Perguntas e Respostas",
        faq_1_q: "Meu código HTML é enviado para algum servidor?",
        faq_1_a: "Não. Todo o processamento é feito no seu navegador. Seu código nunca sai do seu dispositivo.",
        faq_2_q: "Qual padrão HTML este formatador suporta?",
        faq_2_a: "O formatador suporta marcação HTML5 padrão, incluindo atributos personalizados, scripts inline e estilos.",
        faq_3_q: "O que acontece se meu HTML tiver erros de sintaxe?",
        faq_3_a: "Se o HTML não puder ser analisado, a ferramenta exibirá uma mensagem de erro para você identificar e corrigir o problema.",
        see1: "Minificador de HTML",
        see2: "Formatador JavaScript",
        see3: "Formatador CSS",
        see4: "Visualizador de JSON",
        f_1: "Formatação e organização instantânea de HTML",
        f_2: "Indentação correta e alinhamento de tags",
        f_3: "Detecção e reporte de erros de sintaxe",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        m_title: "Formateador HTML Online - Formatea e Indenta HTML Gratis",
        title: "Formateador HTML",
        meta: "Formateador HTML online gratuito. Pega tu código HTML y organízalo al instante con indentación correcta y estructura uniforme.",
        d1: "Este formateador HTML online analiza y reformatea tu código HTML con indentación consistente y estructura uniforme. Todo marcado desordenado, minificado o mal organizado se transforma en HTML legible y bien estructurado con un clic.",
        d2: "Elimina líneas en blanco innecesarias, corrige la indentación y alinea las etiquetas correctamente, facilitando la revisión, depuración o entrega del código a un compañero.",
        plc: "Introduce el código HTML aquí o arrastra un archivo",
        bt: "Formatear HTML",
        rst: "Recomenzar",
        copy: "Copiar",
        err: "Error",
        err_label: "No se pudo formatear el HTML",
        how_it_works_title: "Cómo Funciona",
        hiw_1_title: "Pega tu HTML",
        hiw_1_desc: "Copia y pega tu HTML en bruto, minificado o sin formato en el editor.",
        hiw_2_title: "Haz clic en Formatear",
        hiw_2_desc: "Pulsa el botón Formatear HTML y el código se reformateará al instante.",
        hiw_3_title: "Copia el Resultado",
        hiw_3_desc: "Copia el código formateado o empieza de nuevo con código nuevo.",
        use_cases_title: "Casos de Uso Comunes",
        uc_1_title: "Revisiones de Código",
        uc_1_desc: "Limpia el HTML desordenado antes de compartirlo con compañeros o abrir un pull request.",
        uc_2_title: "Depuración de Plantillas",
        uc_2_desc: "La indentación legible facilita mucho la identificación de etiquetas sin cerrar o problemas de anidamiento.",
        uc_3_title: "Aprendizaje y Documentación",
        uc_3_desc: "El HTML bien formateado es más fácil de leer, entender e incluir en documentación.",
        faq_title: "Preguntas y Respuestas",
        faq_1_q: "¿Mi código HTML se envía a algún servidor?",
        faq_1_a: "No. Todo el procesamiento se realiza en tu navegador. Tu código nunca sale de tu dispositivo.",
        faq_2_q: "¿Qué estándar HTML admite este formateador?",
        faq_2_a: "El formateador admite marcado HTML5 estándar, incluyendo atributos personalizados, scripts en línea y estilos.",
        faq_3_q: "¿Qué ocurre si mi HTML tiene errores de sintaxis?",
        faq_3_a: "Si el HTML no se puede analizar, la herramienta mostrará un mensaje de error para que puedas identificar y solucionar el problema.",
        see1: "Minificador HTML",
        see2: "Formateador JavaScript",
        see3: "Formateador CSS",
        see4: "Visor de JSON",
        f_1: "Formateo y organización instantánea de HTML",
        f_2: "Indentación correcta y alineación de etiquetas",
        f_3: "Detección y reporte de errores de sintaxis",
        f_4: "Sin necesidad de registro ni instalación"
    },
    fr: {
        m_title: "Formateur HTML en Ligne - Formatez et Indentez HTML Gratuitement",
        title: "Formateur HTML",
        meta: "Formateur HTML en ligne gratuit. Collez votre code HTML et obtenez instantanément une indentation correcte et une structure uniforme.",
        d1: "Ce formateur HTML en ligne analyse et reformate votre code HTML avec une indentation cohérente et une structure uniforme. Tout balisage désordonné, minifié ou mal organisé est transformé en HTML lisible et bien structuré en un clic.",
        d2: "Il supprime les lignes vides inutiles, corrige l'indentation et aligne correctement les balises, facilitant la révision, le débogage ou la transmission du code à un collègue.",
        plc: "Insérez le code HTML ici ou faites glisser un fichier",
        bt: "Formater HTML",
        rst: "Recommencer",
        copy: "Copier",
        err: "Erreur",
        err_label: "Impossible de formater le HTML",
        how_it_works_title: "Comment Ça Marche",
        hiw_1_title: "Collez Votre HTML",
        hiw_1_desc: "Copiez et collez votre HTML brut, minifié ou non formaté dans l'éditeur.",
        hiw_2_title: "Cliquez sur Formater",
        hiw_2_desc: "Appuyez sur le bouton Formater HTML et le code sera reformaté instantanément.",
        hiw_3_title: "Copiez le Résultat",
        hiw_3_desc: "Copiez le code formaté ou recommencez avec un nouveau code.",
        use_cases_title: "Cas d'Usage Courants",
        uc_1_title: "Revues de Code",
        uc_1_desc: "Nettoyez le HTML désordonné avant de le partager avec vos collègues ou d'ouvrir une pull request.",
        uc_2_title: "Débogage de Templates",
        uc_2_desc: "Une indentation lisible facilite grandement la détection de balises non fermées ou de problèmes d'imbrication.",
        uc_3_title: "Apprentissage et Documentation",
        uc_3_desc: "Un HTML bien formaté est plus facile à lire, à comprendre et à inclure dans la documentation.",
        faq_title: "Questions et Réponses",
        faq_1_q: "Mon code HTML est-il envoyé à un serveur ?",
        faq_1_a: "Non. Tout le traitement est effectué dans votre navigateur. Votre code ne quitte jamais votre appareil.",
        faq_2_q: "Quel standard HTML ce formateur prend-il en charge ?",
        faq_2_a: "Le formateur prend en charge le balisage HTML5 standard, y compris les attributs personnalisés, les scripts en ligne et les styles.",
        faq_3_q: "Que se passe-t-il si mon HTML contient des erreurs de syntaxe ?",
        faq_3_a: "Si le HTML ne peut pas être analysé, l'outil affichera un message d'erreur pour vous aider à identifier et corriger le problème.",
        see1: "Minificateur HTML",
        see2: "Formateur JavaScript",
        see3: "Formateur CSS",
        see4: "Visualiseur JSON",
        f_1: "Formatage instantané du HTML",
        f_2: "Indentation correcte et alignement des balises",
        f_3: "Détection et signalement des erreurs de syntaxe",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        m_title: "Formattatore HTML Online - Formatta e Indenta HTML Gratis",
        title: "Formattatore HTML",
        meta: "Formattatore HTML online gratuito. Incolla il tuo codice HTML e ottieni istantaneamente indentazione corretta e struttura uniforme.",
        d1: "Questo formattatore HTML online analizza e riformatta il tuo codice HTML con indentazione coerente e struttura uniforme. Qualsiasi markup disordinato, minificato o mal organizzato viene trasformato in HTML leggibile e ben strutturato con un clic.",
        d2: "Rimuove le righe vuote inutili, corregge l'indentazione e allinea correttamente i tag, rendendo il codice più facile da revisionare, debuggare o passare a un collega.",
        plc: "Inserisci il codice HTML qui o trascina un file",
        bt: "Formatta HTML",
        rst: "Ricomincia",
        copy: "Copia",
        err: "Errore",
        err_label: "Impossibile formattare l'HTML",
        how_it_works_title: "Come Funziona",
        hiw_1_title: "Incolla il tuo HTML",
        hiw_1_desc: "Copia e incolla il tuo HTML grezzo, minificato o non formattato nell'editor.",
        hiw_2_title: "Clicca su Formatta",
        hiw_2_desc: "Premi il pulsante Formatta HTML e il codice verrà riformattato all'istante.",
        hiw_3_title: "Copia il Risultato",
        hiw_3_desc: "Copia il codice formattato o ricomincia con un nuovo codice.",
        use_cases_title: "Casi d'Uso Comuni",
        uc_1_title: "Revisioni del Codice",
        uc_1_desc: "Pulisci l'HTML disordinato prima di condividerlo con i colleghi o aprire una pull request.",
        uc_2_title: "Debug di Template",
        uc_2_desc: "Un'indentazione leggibile rende molto più facile individuare tag non chiusi o problemi di annidamento.",
        uc_3_title: "Apprendimento e Documentazione",
        uc_3_desc: "L'HTML ben formattato è più facile da leggere, capire e includere nella documentazione.",
        faq_title: "Domande e Risposte",
        faq_1_q: "Il mio codice HTML viene inviato a qualche server?",
        faq_1_a: "No. Tutta l'elaborazione avviene nel tuo browser. Il tuo codice non lascia mai il tuo dispositivo.",
        faq_2_q: "Quale standard HTML supporta questo formattatore?",
        faq_2_a: "Il formattatore supporta il markup HTML5 standard, inclusi attributi personalizzati, script inline e stili.",
        faq_3_q: "Cosa succede se il mio HTML ha errori di sintassi?",
        faq_3_a: "Se l'HTML non può essere analizzato, lo strumento mostrerà un messaggio di errore per aiutarti a identificare e correggere il problema.",
        see1: "Minificatore di HTML",
        see2: "Formattatore JavaScript",
        see3: "Formattatore CSS",
        see4: "Visualizzatore JSON",
        f_1: "Formattazione istantanea dell'HTML",
        f_2: "Indentazione corretta e allineamento dei tag",
        f_3: "Rilevamento e segnalazione degli errori di sintassi",
        f_4: "Nessuna registrazione o installazione richiesta"
    },
    id: {
        m_title: "Pemformat HTML Online - Format & Indentasi HTML Gratis",
        title: "Pemformat HTML",
        meta: "Pemformat HTML online gratis. Tempelkan kode HTML Anda dan dapatkan indentasi yang benar dan struktur yang seragam secara instan.",
        d1: "Pemformat HTML online ini mengurai dan memformat ulang kode HTML Anda dengan indentasi yang konsisten dan struktur yang seragam. Semua markup yang berantakan, diminifikasi, atau tidak terorganisir diubah menjadi HTML yang mudah dibaca dan terstruktur dengan baik dalam satu klik.",
        d2: "Alat ini menghapus baris kosong yang tidak perlu, memperbaiki indentasi, dan menyelaraskan tag dengan benar, membuat kode lebih mudah ditinjau, di-debug, atau diserahkan ke rekan kerja.",
        plc: "Masukkan kode HTML di sini atau seret file",
        bt: "Format HTML",
        rst: "Mulai Ulang",
        copy: "Salin",
        err: "Kesalahan",
        err_label: "Tidak dapat memformat HTML",
        how_it_works_title: "Cara Kerja",
        hiw_1_title: "Tempel HTML Anda",
        hiw_1_desc: "Salin dan tempel HTML mentah, diminifikasi, atau tidak terformat ke dalam editor.",
        hiw_2_title: "Klik Format",
        hiw_2_desc: "Tekan tombol Format HTML dan kode akan diformat ulang secara instan.",
        hiw_3_title: "Salin Hasilnya",
        hiw_3_desc: "Salin kode yang telah diformat atau mulai ulang dengan kode baru.",
        use_cases_title: "Kegunaan Utama",
        uc_1_title: "Tinjauan Kode",
        uc_1_desc: "Bersihkan HTML yang berantakan sebelum membagikannya dengan rekan atau membuka pull request.",
        uc_2_title: "Debug Template",
        uc_2_desc: "Indentasi yang mudah dibaca memudahkan identifikasi tag yang tidak ditutup atau masalah pengurutan.",
        uc_3_title: "Pembelajaran dan Dokumentasi",
        uc_3_desc: "HTML yang terformat dengan baik lebih mudah dibaca, dipahami, dan disertakan dalam dokumentasi.",
        faq_title: "Tanya Jawab",
        faq_1_q: "Apakah kode HTML saya dikirim ke server?",
        faq_1_a: "Tidak. Semua pemrosesan dilakukan di browser Anda. Kode Anda tidak pernah meninggalkan perangkat Anda.",
        faq_2_q: "Standar HTML apa yang didukung pemformat ini?",
        faq_2_a: "Pemformat mendukung markup HTML5 standar termasuk atribut kustom, skrip inline, dan gaya.",
        faq_3_q: "Apa yang terjadi jika HTML saya memiliki kesalahan sintaks?",
        faq_3_a: "Jika HTML tidak dapat diurai, alat ini akan menampilkan pesan kesalahan agar Anda dapat mengidentifikasi dan memperbaiki masalah.",
        see1: "Minifikasi HTML",
        see2: "Pemformat JavaScript",
        see3: "Pemformat CSS",
        see4: "Penampil JSON",
        f_1: "Pemformatan HTML secara instan",
        f_2: "Indentasi yang benar dan penyelarasan tag",
        f_3: "Deteksi dan pelaporan kesalahan sintaks",
        f_4: "Tanpa pendaftaran atau instalasi"
    }
}
</i18n>
