<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/gh/kangax/html-minifier@gh-pages/dist/htmlminifier.min.js', { trigger: 'client' })

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
  state.resetable ? reset() : minifyCode()
}

function minifyCode() {
  const htmlMinifier = (window as any).htmlMinifier
  if (!htmlMinifier) {
    document.location.reload()
    return
  }

  try {
    let code = editor.value!.getValue()
    const addOpen = !code.startsWith('<style')
    const addClose = !code.endsWith('</style>')

    if (addOpen) code = '<style>' + code
    if (addClose) code += '</style>'

    code = htmlMinifier.minify(code, { collapseWhitespace: true, minifyCSS: true })

    if (addOpen) code = code.replace('<style>', '')
    if (addClose) code = code.replace('</style>', '')

    editor.value!.setValue(code)
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

defineI18nRoute({
  paths: {
    en: '/css-minifier',
    pt: '/minificador-css',
    es: '/minificador-css',
    fr: '/minificateur-css',
    it: '/minificatore-css',
    id: '/css-minifier'
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
      { label: t('see2'), to: 'javascript-minifier' },
      { label: t('see3'), to: 'css-formatter' },
      { label: t('see4'), to: 'html-formatter' }
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
        m_title: "CSS Minifier Online - Minify & Compress CSS for Free",
        title: "CSS Minifier",
        meta: "Free online CSS minifier. Paste your CSS code and instantly compress it by removing whitespace, comments, and redundant rules.",
        d1: "This online CSS minifier compresses your stylesheet for production by stripping out whitespace, blank lines, and comments. Any verbose or development-ready CSS is reduced to the smallest possible size in one click.",
        d2: "Smaller stylesheets mean faster page loads, lower bandwidth costs, and better scores on Lighthouse and Core Web Vitals. Paste your CSS, click minify, and get production-ready output in seconds.",
        plc: "Paste the CSS code here or drag a file",
        bt: "Minify CSS",
        rst: "Start Over",
        copy: "Copy",
        err: "Error",
        err_label: "Could not minify CSS",
        how_it_works_title: "How It Works",
        hiw_1_title: "Paste Your CSS",
        hiw_1_desc: "Copy and paste your CSS source code into the editor.",
        hiw_2_title: "Click Minify",
        hiw_2_desc: "Press the Minify CSS button and the tool will compress the code instantly.",
        hiw_3_title: "Copy the Result",
        hiw_3_desc: "Copy the minified output or start over with new code.",
        use_cases_title: "Common Use Cases",
        uc_1_title: "Production Deployment",
        uc_1_desc: "Reduce stylesheet file size before deploying to production for faster page loads and lower bandwidth usage.",
        uc_2_title: "Email Templates",
        uc_2_desc: "Minify inline CSS in email templates to keep message size small and improve deliverability.",
        uc_3_title: "Lighthouse & Core Web Vitals",
        uc_3_desc: "Smaller CSS payloads directly reduce render-blocking time and improve First Contentful Paint scores.",
        faq_title: "Questions & Answers",
        faq_1_q: "Is my CSS code sent to any server?",
        faq_1_a: "No. All minification is done entirely in your browser. Your code never leaves your device.",
        faq_2_q: "Does minification break my CSS?",
        faq_2_a: "No. The minifier only removes whitespace and comments that have no effect on rendering. The output is functionally identical to the original.",
        faq_3_q: "What happens if my CSS has syntax errors?",
        faq_3_a: "If the CSS cannot be parsed, the tool will display an error message so you can identify and fix the issue before minifying.",
        see1: "HTML Minifier",
        see2: "JavaScript Minifier",
        see3: "CSS Formatter",
        see4: "HTML Formatter",
        f_1: "Instant CSS compression and minification",
        f_2: "Removes whitespace, comments, and redundant rules",
        f_3: "Handles both plain CSS and style-tagged blocks",
        f_4: "No registration or installation required"
    },
    pt: {
        m_title: "Minificador de CSS Online - Minifique e Comprima CSS Grátis",
        title: "Minificador de CSS",
        meta: "Otimize o desempenho do seu site comprimindo o código CSS para produção. Remova espaços, comentários e regras redundantes com um clique.",
        d1: "Este minificador de CSS online comprime sua folha de estilos para produção removendo espaços desnecessários, linhas em branco e comentários. Qualquer CSS verboso é reduzido ao menor tamanho possível com um clique.",
        d2: "Folhas de estilo menores significam carregamentos mais rápidos, menor custo de banda e melhores pontuações no Lighthouse e Core Web Vitals. Cole o CSS, clique em minificar e obtenha o resultado pronto para produção em segundos.",
        plc: "Insira o código CSS aqui ou arraste um arquivo",
        bt: "Minificar CSS",
        rst: "Recomeçar",
        copy: "Copiar",
        err: "Erro",
        err_label: "Não foi possível minificar o CSS",
        how_it_works_title: "Como Funciona",
        hiw_1_title: "Cole seu CSS",
        hiw_1_desc: "Copie e cole o código-fonte CSS no editor.",
        hiw_2_title: "Clique em Minificar",
        hiw_2_desc: "Pressione o botão Minificar CSS e o código será comprimido instantaneamente.",
        hiw_3_title: "Copie o Resultado",
        hiw_3_desc: "Copie o CSS minificado ou recomece com um novo código.",
        use_cases_title: "Principais Casos de Uso",
        uc_1_title: "Deploy em Produção",
        uc_1_desc: "Reduza o tamanho das folhas de estilo antes de publicar em produção para carregamentos mais rápidos e menor uso de banda.",
        uc_2_title: "Templates de E-mail",
        uc_2_desc: "Minifique CSS inline em templates de e-mail para manter o tamanho das mensagens pequeno e melhorar a entregabilidade.",
        uc_3_title: "Lighthouse e Core Web Vitals",
        uc_3_desc: "Payloads CSS menores reduzem diretamente o tempo de bloqueio de renderização e melhoram os scores de First Contentful Paint.",
        faq_title: "Perguntas e Respostas",
        faq_1_q: "Meu código CSS é enviado para algum servidor?",
        faq_1_a: "Não. Todo o processamento é feito no seu navegador. Seu código nunca sai do seu dispositivo.",
        faq_2_q: "A minificação quebra meu CSS?",
        faq_2_a: "Não. O minificador remove apenas espaços e comentários que não afetam a renderização. O resultado é funcionalmente idêntico ao original.",
        faq_3_q: "O que acontece se meu CSS tiver erros de sintaxe?",
        faq_3_a: "Se o CSS não puder ser analisado, a ferramenta exibirá uma mensagem de erro para você identificar e corrigir o problema antes de minificar.",
        see1: "Minificador de HTML",
        see2: "Minificador de Javascript",
        see3: "Formatador CSS",
        see4: "Formatador HTML",
        f_1: "Compressão e minificação instantânea de CSS",
        f_2: "Remove espaços, comentários e regras redundantes",
        f_3: "Suporta CSS puro e blocos com tag style",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        m_title: "Minificador CSS Online - Minifica y Comprime CSS Gratis",
        title: "Minificador CSS",
        meta: "Minificador CSS online gratuito. Pega tu código CSS y comprímelo al instante eliminando espacios, comentarios y reglas redundantes.",
        d1: "Este minificador CSS online comprime tu hoja de estilos para producción eliminando espacios en blanco, líneas vacías y comentarios. Cualquier CSS verboso se reduce al menor tamaño posible con un clic.",
        d2: "Las hojas de estilo más pequeñas significan cargas más rápidas, menor coste de ancho de banda y mejores puntuaciones en Lighthouse y Core Web Vitals. Pega tu CSS, haz clic en minificar y obtén el resultado listo para producción en segundos.",
        plc: "Pega el código CSS aquí o arrastra un archivo",
        bt: "Minificar CSS",
        rst: "Recomenzar",
        copy: "Copiar",
        err: "Error",
        err_label: "No se pudo minificar el CSS",
        how_it_works_title: "Cómo Funciona",
        hiw_1_title: "Pega tu CSS",
        hiw_1_desc: "Copia y pega el código fuente CSS en el editor.",
        hiw_2_title: "Haz clic en Minificar",
        hiw_2_desc: "Pulsa el botón Minificar CSS y el código se comprimirá al instante.",
        hiw_3_title: "Copia el Resultado",
        hiw_3_desc: "Copia el CSS minificado o empieza de nuevo con código nuevo.",
        use_cases_title: "Casos de Uso Comunes",
        uc_1_title: "Despliegue en Producción",
        uc_1_desc: "Reduce el tamaño de las hojas de estilo antes de desplegarlas en producción para cargas más rápidas y menor uso de ancho de banda.",
        uc_2_title: "Plantillas de Email",
        uc_2_desc: "Minifica el CSS en línea en plantillas de email para mantener el tamaño del mensaje pequeño y mejorar la entregabilidad.",
        uc_3_title: "Lighthouse y Core Web Vitals",
        uc_3_desc: "Los payloads CSS más pequeños reducen directamente el tiempo de bloqueo de renderizado y mejoran las puntuaciones de First Contentful Paint.",
        faq_title: "Preguntas y Respuestas",
        faq_1_q: "¿Mi código CSS se envía a algún servidor?",
        faq_1_a: "No. Todo el procesamiento se realiza en tu navegador. Tu código nunca sale de tu dispositivo.",
        faq_2_q: "¿La minificación rompe mi CSS?",
        faq_2_a: "No. El minificador solo elimina espacios y comentarios que no tienen efecto en el renderizado. El resultado es funcionalmente idéntico al original.",
        faq_3_q: "¿Qué ocurre si mi CSS tiene errores de sintaxis?",
        faq_3_a: "Si el CSS no se puede analizar, la herramienta mostrará un mensaje de error para que puedas identificar y solucionar el problema antes de minificar.",
        see1: "Minificador HTML",
        see2: "Minificador Javascript",
        see3: "Formateador CSS",
        see4: "Formateador HTML",
        f_1: "Compresión y minificación instantánea de CSS",
        f_2: "Elimina espacios, comentarios y reglas redundantes",
        f_3: "Compatible con CSS puro y bloques con etiqueta style",
        f_4: "Sin necesidad de registro ni instalación"
    },
    fr: {
        m_title: "Minificateur CSS en Ligne - Minifiez et Compressez CSS Gratuitement",
        title: "Minificateur CSS",
        meta: "Minificateur CSS en ligne gratuit. Collez votre code CSS et compressez-le instantanément en supprimant les espaces, commentaires et règles redondantes.",
        d1: "Ce minificateur CSS en ligne compresse votre feuille de styles pour la production en supprimant les espaces, les lignes vides et les commentaires. Tout CSS verbeux est réduit à la taille minimale possible en un clic.",
        d2: "Des feuilles de styles plus légères se traduisent par des chargements plus rapides, des coûts de bande passante réduits et de meilleures notes sur Lighthouse et Core Web Vitals. Collez votre CSS, cliquez sur minifier et obtenez un résultat prêt pour la production en quelques secondes.",
        plc: "Collez le code CSS ici ou faites glisser un fichier",
        bt: "Minifier CSS",
        rst: "Recommencer",
        copy: "Copier",
        err: "Erreur",
        err_label: "Impossible de minifier le CSS",
        how_it_works_title: "Comment Ça Marche",
        hiw_1_title: "Collez Votre CSS",
        hiw_1_desc: "Copiez et collez le code source CSS dans l'éditeur.",
        hiw_2_title: "Cliquez sur Minifier",
        hiw_2_desc: "Appuyez sur le bouton Minifier CSS et le code sera compressé instantanément.",
        hiw_3_title: "Copiez le Résultat",
        hiw_3_desc: "Copiez le CSS minifié ou recommencez avec un nouveau code.",
        use_cases_title: "Cas d'Usage Courants",
        uc_1_title: "Déploiement en Production",
        uc_1_desc: "Réduisez la taille des feuilles de styles avant le déploiement en production pour des chargements plus rapides et une moindre consommation de bande passante.",
        uc_2_title: "Templates Email",
        uc_2_desc: "Minifiez le CSS en ligne dans les templates email pour réduire la taille des messages et améliorer la délivrabilité.",
        uc_3_title: "Lighthouse et Core Web Vitals",
        uc_3_desc: "Des payloads CSS plus légers réduisent directement le temps de blocage du rendu et améliorent les scores de First Contentful Paint.",
        faq_title: "Questions et Réponses",
        faq_1_q: "Mon code CSS est-il envoyé à un serveur ?",
        faq_1_a: "Non. Tout le traitement est effectué dans votre navigateur. Votre code ne quitte jamais votre appareil.",
        faq_2_q: "La minification casse-t-elle mon CSS ?",
        faq_2_a: "Non. Le minificateur supprime uniquement les espaces et les commentaires qui n'ont aucun effet sur le rendu. Le résultat est fonctionnellement identique à l'original.",
        faq_3_q: "Que se passe-t-il si mon CSS contient des erreurs de syntaxe ?",
        faq_3_a: "Si le CSS ne peut pas être analysé, l'outil affichera un message d'erreur pour vous aider à identifier et corriger le problème avant la minification.",
        see1: "Minificateur HTML",
        see2: "Minificateur Javascript",
        see3: "Formateur CSS",
        see4: "Formateur HTML",
        f_1: "Compression et minification instantanée du CSS",
        f_2: "Suppression des espaces, commentaires et règles redondantes",
        f_3: "Compatible avec le CSS brut et les blocs avec balise style",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        m_title: "Minificatore CSS Online - Minifica e Comprimi CSS Gratis",
        title: "Minificatore CSS",
        meta: "Minificatore CSS online gratuito. Incolla il tuo codice CSS e comprimilo istantaneamente rimuovendo spazi, commenti e regole ridondanti.",
        d1: "Questo minificatore CSS online comprime il tuo foglio di stile per la produzione rimuovendo spazi bianchi, righe vuote e commenti. Qualsiasi CSS prolisso viene ridotto alla dimensione minima possibile con un clic.",
        d2: "Fogli di stile più piccoli significano caricamenti più veloci, costi di banda ridotti e migliori punteggi su Lighthouse e Core Web Vitals. Incolla il CSS, clicca su minifica e ottieni il risultato pronto per la produzione in pochi secondi.",
        plc: "Incolla il codice CSS qui o trascina un file",
        bt: "Minifica CSS",
        rst: "Ricomincia",
        copy: "Copia",
        err: "Errore",
        err_label: "Impossibile minificare il CSS",
        how_it_works_title: "Come Funziona",
        hiw_1_title: "Incolla il tuo CSS",
        hiw_1_desc: "Copia e incolla il codice sorgente CSS nell'editor.",
        hiw_2_title: "Clicca su Minifica",
        hiw_2_desc: "Premi il pulsante Minifica CSS e il codice verrà compresso all'istante.",
        hiw_3_title: "Copia il Risultato",
        hiw_3_desc: "Copia il CSS minificato o ricomincia con un nuovo codice.",
        use_cases_title: "Casi d'Uso Comuni",
        uc_1_title: "Deploy in Produzione",
        uc_1_desc: "Riduci la dimensione dei fogli di stile prima del deploy in produzione per caricamenti più veloci e minore utilizzo di banda.",
        uc_2_title: "Template Email",
        uc_2_desc: "Minifica il CSS inline nei template email per mantenere le dimensioni del messaggio piccole e migliorare la recapitabilità.",
        uc_3_title: "Lighthouse e Core Web Vitals",
        uc_3_desc: "Payload CSS più piccoli riducono direttamente il tempo di blocco del rendering e migliorano i punteggi di First Contentful Paint.",
        faq_title: "Domande e Risposte",
        faq_1_q: "Il mio codice CSS viene inviato a qualche server?",
        faq_1_a: "No. Tutta l'elaborazione avviene nel tuo browser. Il tuo codice non lascia mai il tuo dispositivo.",
        faq_2_q: "La minificazione rompe il mio CSS?",
        faq_2_a: "No. Il minificatore rimuove solo spazi e commenti che non hanno effetto sul rendering. Il risultato è funzionalmente identico all'originale.",
        faq_3_q: "Cosa succede se il mio CSS ha errori di sintassi?",
        faq_3_a: "Se il CSS non può essere analizzato, lo strumento mostrerà un messaggio di errore per aiutarti a identificare e correggere il problema prima della minificazione.",
        see1: "Minificatore HTML",
        see2: "Minificatore Javascript",
        see3: "Formattatore CSS",
        see4: "Formattatore HTML",
        f_1: "Compressione e minificazione istantanea del CSS",
        f_2: "Rimozione di spazi, commenti e regole ridondanti",
        f_3: "Compatibile con CSS puro e blocchi con tag style",
        f_4: "Nessuna registrazione o installazione richiesta"
    },
    id: {
        m_title: "Minifikasi CSS Online - Minifikasi & Kompresi CSS Gratis",
        title: "Minifikasi CSS",
        meta: "Minifikasi CSS online gratis. Tempelkan kode CSS Anda dan kompres secara instan dengan menghapus spasi, komentar, dan aturan berlebih.",
        d1: "Minifikasi CSS online ini mengompres lembar gaya Anda untuk produksi dengan menghapus spasi kosong, baris kosong, dan komentar. Semua CSS yang panjang dikurangi ke ukuran terkecil yang mungkin dalam satu klik.",
        d2: "Lembar gaya yang lebih kecil berarti pemuatan halaman lebih cepat, biaya bandwidth lebih rendah, dan skor Lighthouse serta Core Web Vitals yang lebih baik. Tempel CSS Anda, klik minifikasi, dan dapatkan hasil siap produksi dalam hitungan detik.",
        plc: "Tempel kode CSS di sini atau seret file",
        bt: "Minifikasi CSS",
        rst: "Mulai Ulang",
        copy: "Salin",
        err: "Kesalahan",
        err_label: "Tidak dapat minifikasi CSS",
        how_it_works_title: "Cara Kerja",
        hiw_1_title: "Tempel CSS Anda",
        hiw_1_desc: "Salin dan tempel kode sumber CSS ke dalam editor.",
        hiw_2_title: "Klik Minifikasi",
        hiw_2_desc: "Tekan tombol Minifikasi CSS dan kode akan dikompres secara instan.",
        hiw_3_title: "Salin Hasilnya",
        hiw_3_desc: "Salin CSS yang telah diminifikasi atau mulai ulang dengan kode baru.",
        use_cases_title: "Kegunaan Utama",
        uc_1_title: "Deploy ke Produksi",
        uc_1_desc: "Kurangi ukuran file lembar gaya sebelum deploy ke produksi untuk pemuatan lebih cepat dan penggunaan bandwidth lebih rendah.",
        uc_2_title: "Template Email",
        uc_2_desc: "Minifikasi CSS inline dalam template email untuk menjaga ukuran pesan tetap kecil dan meningkatkan ketercapaian.",
        uc_3_title: "Lighthouse dan Core Web Vitals",
        uc_3_desc: "Payload CSS yang lebih kecil secara langsung mengurangi waktu pemblokiran rendering dan meningkatkan skor First Contentful Paint.",
        faq_title: "Tanya Jawab",
        faq_1_q: "Apakah kode CSS saya dikirim ke server?",
        faq_1_a: "Tidak. Semua pemrosesan dilakukan di browser Anda. Kode Anda tidak pernah meninggalkan perangkat Anda.",
        faq_2_q: "Apakah minifikasi merusak CSS saya?",
        faq_2_a: "Tidak. Minifikasi hanya menghapus spasi dan komentar yang tidak memengaruhi rendering. Hasilnya identik secara fungsional dengan aslinya.",
        faq_3_q: "Apa yang terjadi jika CSS saya memiliki kesalahan sintaks?",
        faq_3_a: "Jika CSS tidak dapat diurai, alat ini akan menampilkan pesan kesalahan agar Anda dapat mengidentifikasi dan memperbaiki masalah sebelum minifikasi.",
        see1: "Minifikasi HTML",
        see2: "Minifikasi Javascript",
        see3: "Pemformat CSS",
        see4: "Pemformat HTML",
        f_1: "Kompresi dan minifikasi CSS secara instan",
        f_2: "Menghapus spasi, komentar, dan aturan berlebih",
        f_3: "Kompatibel dengan CSS murni dan blok dengan tag style",
        f_4: "Tanpa pendaftaran atau instalasi"
    }
}
</i18n>
