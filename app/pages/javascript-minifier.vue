<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/terser/dist/bundle.min.js', { trigger: 'client' })

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

async function minifyCode() {
  const Terser = (window as any).Terser
  if (!Terser) {
    document.location.reload()
    return
  }

  try {
    const { code, error } = await Terser.minify(editor.value!.getValue())
    if (code) {
      editor.value!.setValue(code)
      editor.value!.setReadOnly(true)
      state.resetable = true
      state.ads = true
    } else {
      state.error = `${t('err')}: ${error}`
    }
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
    en: '/javascript-minifier',
    pt: '/minificador-javascript',
    es: '/minificador-javascript',
    fr: '/minificateur-javascript',
    it: '/minificatore-javascript',
    id: '/javascript-minifier',
    de: '/javascript-minifier',
    nl: '/javascript-minifier'
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
      { label: t('see2'), to: 'html-minifier' },
      { label: t('see3'), to: 'javascript-formatter' },
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
            {{ t('copy') }} JavaScript
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
        m_title: "JavaScript Minifier Online - Minify & Compress JS for Free",
        title: "JavaScript Minifier",
        meta: "Free online JavaScript minifier. Paste your JS code and instantly compress it by removing whitespace, shortening variable names, and optimizing expressions.",
        d1: "This online JavaScript optimizer uses Terser to compress your code for production. It removes whitespace, comments, and dead code, shortens variable and function names, and simplifies expressions, all without changing how the code behaves.",
        d2: "Smaller JavaScript bundles mean faster page loads, lower bandwidth costs, and better scores on Lighthouse and Core Web Vitals. Paste your source, click minify, and get production-ready output in seconds.",
        plc: "Paste the JavaScript code here or drag a file",
        bt: "Minify JavaScript",
        rst: "Start Over",
        copy: "Copy",
        err: "Error",
        err_label: "Could not minify JavaScript",
        how_it_works_title: "How It Works",
        hiw_1_title: "Paste Your JavaScript",
        hiw_1_desc: "Copy and paste your JavaScript source code into the editor.",
        hiw_2_title: "Click Minify",
        hiw_2_desc: "Press the Minify JavaScript button and Terser will compress the code instantly.",
        hiw_3_title: "Copy the Result",
        hiw_3_desc: "Copy the minified output or start over with new code.",
        use_cases_title: "Use Cases",
        uc_1_title: "Production Deployment",
        uc_1_desc: "Reduce JS bundle size before deploying to production for faster page loads and lower bandwidth usage.",
        uc_2_title: "Build Pipeline",
        uc_2_desc: "Quickly minify standalone scripts outside your build tool when you need a fast, one-off optimization.",
        uc_3_title: "Lighthouse & Core Web Vitals",
        uc_3_desc: "Smaller JavaScript payloads directly improve Time to Interactive and Total Blocking Time scores.",
        faq_title: "Questions & Answers",
        faq_1_q: "Is my JavaScript code sent to any server?",
        faq_1_a: "No. All minification is done entirely in your browser using Terser. Your code never leaves your device.",
        faq_2_q: "Does minification change how my code works?",
        faq_2_a: "No. Terser only removes whitespace, comments, and redundant syntax, and renames variables internally. The minified code is functionally identical to the original.",
        faq_3_q: "What happens if my JavaScript has syntax errors?",
        faq_3_a: "If the code cannot be parsed, the tool will display an error message so you can identify and fix the issue before minifying.",
        see1: "CSS Minifier",
        see2: "HTML Minifier",
        see3: "JavaScript Formatter",
        see4: "HTML Formatter",
        f_1: "Instant JavaScript compression powered by Terser",
        f_2: "Variable and function name shortening",
        f_3: "Dead code removal and expression simplification",
        f_4: "No registration or installation required"
    },
    pt: {
        m_title: "Minificador de JavaScript Online - Minifique e Comprima JS Grátis",
        title: "Minificador de Javascript",
        meta: "Melhore o desempenho do seu site otimizando o código JavaScript para produção. Remova espaços, comentários e encurte variáveis com um clique.",
        d1: "Este minificador de JavaScript online usa o Terser para comprimir seu código para produção. Ele remove espaços, comentários e código morto, encurta nomes de variáveis e funções, e simplifica expressões, tudo sem alterar o comportamento do código.",
        d2: "Bundles JavaScript menores resultam em carregamentos mais rápidos, menor custo de banda e melhores pontuações no Lighthouse e Core Web Vitals. Cole o código, clique em minificar e obtenha o resultado pronto para produção em segundos.",
        plc: "Insira o código JavaScript aqui ou arraste um arquivo",
        bt: "Minificar Javascript",
        rst: "Recomeçar",
        copy: "Copiar",
        err: "Erro",
        err_label: "Não foi possível minificar o JavaScript",
        how_it_works_title: "Como Funciona",
        hiw_1_title: "Cole seu JavaScript",
        hiw_1_desc: "Copie e cole o código-fonte JavaScript no editor.",
        hiw_2_title: "Clique em Minificar",
        hiw_2_desc: "Pressione o botão Minificar JavaScript e o Terser comprimirá o código instantaneamente.",
        hiw_3_title: "Copie o Resultado",
        hiw_3_desc: "Copie o JavaScript minificado ou recomece com um novo código.",
        use_cases_title: "Casos de Uso",
        uc_1_title: "Deploy em Produção",
        uc_1_desc: "Reduza o tamanho do bundle JS antes de publicar em produção para carregamentos mais rápidos e menor uso de banda.",
        uc_2_title: "Pipeline de Build",
        uc_2_desc: "Minifique scripts avulsos fora da sua ferramenta de build quando precisar de uma otimização rápida e pontual.",
        uc_3_title: "Lighthouse e Core Web Vitals",
        uc_3_desc: "Payloads JavaScript menores melhoram diretamente o Time to Interactive e os scores de Total Blocking Time.",
        faq_title: "Perguntas e Respostas",
        faq_1_q: "Meu código JavaScript é enviado para algum servidor?",
        faq_1_a: "Não. Todo o processamento é feito no seu navegador com o Terser. Seu código nunca sai do seu dispositivo.",
        faq_2_q: "A minificação altera o funcionamento do meu código?",
        faq_2_a: "Não. O Terser apenas remove espaços, comentários e sintaxe redundante, e renomeia variáveis internamente. O código minificado é funcionalmente idêntico ao original.",
        faq_3_q: "O que acontece se meu JavaScript tiver erros de sintaxe?",
        faq_3_a: "Se o código não puder ser analisado, a ferramenta exibirá uma mensagem de erro para você identificar e corrigir o problema antes de minificar.",
        see1: "Minificador de CSS",
        see2: "Minificador de HTML",
        see3: "Formatador Javascript",
        see4: "Formatador HTML",
        f_1: "Compressão instantânea de JavaScript com Terser",
        f_2: "Encurtamento de nomes de variáveis e funções",
        f_3: "Remoção de código morto e simplificação de expressões",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        m_title: "Minificador JavaScript Online - Minifica y Comprime JS Gratis",
        title: "Minificador JavaScript",
        meta: "Minificador JavaScript online gratuito. Pega tu código JS y comprímelo al instante eliminando espacios, acortando variables y optimizando expresiones.",
        d1: "Este minificador JavaScript online usa Terser para comprimir tu código para producción. Elimina espacios, comentarios y código muerto, acorta nombres de variables y funciones, y simplifica expresiones, sin cambiar el comportamiento del código.",
        d2: "Los bundles JavaScript más pequeños resultan en cargas más rápidas, menor coste de ancho de banda y mejores puntuaciones en Lighthouse y Core Web Vitals. Pega tu código, haz clic en minificar y obtén el resultado listo para producción en segundos.",
        plc: "Pega el código JavaScript aquí o arrastra un archivo",
        bt: "Minificar JavaScript",
        rst: "Recomenzar",
        copy: "Copiar",
        err: "Error",
        err_label: "No se pudo minificar el JavaScript",
        how_it_works_title: "Cómo Funciona",
        hiw_1_title: "Pega tu JavaScript",
        hiw_1_desc: "Copia y pega el código fuente JavaScript en el editor.",
        hiw_2_title: "Haz clic en Minificar",
        hiw_2_desc: "Pulsa el botón Minificar JavaScript y Terser comprimirá el código al instante.",
        hiw_3_title: "Copia el Resultado",
        hiw_3_desc: "Copia el JavaScript minificado o empieza de nuevo con código nuevo.",
        use_cases_title: "Casos de Uso",
        uc_1_title: "Despliegue en Producción",
        uc_1_desc: "Reduce el tamaño del bundle JS antes de desplegarlo en producción para cargas más rápidas y menor uso de ancho de banda.",
        uc_2_title: "Pipeline de Build",
        uc_2_desc: "Minifica scripts independientes fuera de tu herramienta de build cuando necesites una optimización rápida y puntual.",
        uc_3_title: "Lighthouse y Core Web Vitals",
        uc_3_desc: "Los payloads JavaScript más pequeños mejoran directamente el Time to Interactive y las puntuaciones de Total Blocking Time.",
        faq_title: "Preguntas y Respuestas",
        faq_1_q: "¿Mi código JavaScript se envía a algún servidor?",
        faq_1_a: "No. Todo el procesamiento se realiza en tu navegador con Terser. Tu código nunca sale de tu dispositivo.",
        faq_2_q: "¿La minificación cambia el funcionamiento de mi código?",
        faq_2_a: "No. Terser solo elimina espacios, comentarios y sintaxis redundante, y renombra variables internamente. El código minificado es funcionalmente idéntico al original.",
        faq_3_q: "¿Qué ocurre si mi JavaScript tiene errores de sintaxis?",
        faq_3_a: "Si el código no se puede analizar, la herramienta mostrará un mensaje de error para que puedas identificar y solucionar el problema antes de minificar.",
        see1: "Minificador CSS",
        see2: "Minificador HTML",
        see3: "Formateador JavaScript",
        see4: "Formateador HTML",
        f_1: "Compresión instantánea de JavaScript con Terser",
        f_2: "Acortamiento de nombres de variables y funciones",
        f_3: "Eliminación de código muerto y simplificación de expresiones",
        f_4: "Sin necesidad de registro ni instalación"
    },
    fr: {
        m_title: "Minificateur JavaScript en Ligne - Minifiez et Compressez JS Gratuitement",
        title: "Minificateur JavaScript",
        meta: "Minificateur JavaScript en ligne gratuit. Collez votre code JS et compressez-le instantanément en supprimant les espaces, en raccourcissant les variables et en optimisant les expressions.",
        d1: "Ce minificateur JavaScript en ligne utilise Terser pour comprimer votre code pour la production. Il supprime les espaces, les commentaires et le code mort, raccourcit les noms de variables et de fonctions, et simplifie les expressions, sans modifier le comportement du code.",
        d2: "Des bundles JavaScript plus légers se traduisent par des chargements plus rapides, des coûts de bande passante réduits et de meilleures notes sur Lighthouse et Core Web Vitals. Collez votre code, cliquez sur minifier et obtenez un résultat prêt pour la production en quelques secondes.",
        plc: "Collez le code JavaScript ici ou faites glisser un fichier",
        bt: "Minifier JavaScript",
        rst: "Recommencer",
        copy: "Copier",
        err: "Erreur",
        err_label: "Impossible de minifier le JavaScript",
        how_it_works_title: "Comment Ça Marche",
        hiw_1_title: "Collez Votre JavaScript",
        hiw_1_desc: "Copiez et collez le code source JavaScript dans l'éditeur.",
        hiw_2_title: "Cliquez sur Minifier",
        hiw_2_desc: "Appuyez sur le bouton Minifier JavaScript et Terser compressera le code instantanément.",
        hiw_3_title: "Copiez le Résultat",
        hiw_3_desc: "Copiez le JavaScript minifié ou recommencez avec un nouveau code.",
        use_cases_title: "Cas d'Utilisation",
        uc_1_title: "Déploiement en Production",
        uc_1_desc: "Réduisez la taille du bundle JS avant le déploiement en production pour des chargements plus rapides et une moindre consommation de bande passante.",
        uc_2_title: "Pipeline de Build",
        uc_2_desc: "Minifiez des scripts autonomes en dehors de votre outil de build lorsque vous avez besoin d'une optimisation rapide et ponctuelle.",
        uc_3_title: "Lighthouse et Core Web Vitals",
        uc_3_desc: "Des payloads JavaScript plus légers améliorent directement le Time to Interactive et les scores de Total Blocking Time.",
        faq_title: "Questions et Réponses",
        faq_1_q: "Mon code JavaScript est-il envoyé à un serveur ?",
        faq_1_a: "Non. Tout le traitement est effectué dans votre navigateur avec Terser. Votre code ne quitte jamais votre appareil.",
        faq_2_q: "La minification change-t-elle le fonctionnement de mon code ?",
        faq_2_a: "Non. Terser supprime uniquement les espaces, les commentaires et la syntaxe redondante, et renomme les variables en interne. Le code minifié est fonctionnellement identique à l'original.",
        faq_3_q: "Que se passe-t-il si mon JavaScript contient des erreurs de syntaxe ?",
        faq_3_a: "Si le code ne peut pas être analysé, l'outil affichera un message d'erreur pour vous aider à identifier et corriger le problème avant la minification.",
        see1: "Minificateur CSS",
        see2: "Minificateur HTML",
        see3: "Formateur JavaScript",
        see4: "Formateur HTML",
        f_1: "Compression instantanée de JavaScript avec Terser",
        f_2: "Raccourcissement des noms de variables et de fonctions",
        f_3: "Suppression du code mort et simplification des expressions",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        m_title: "Minificatore JavaScript Online - Minifica e Comprimi JS Gratis",
        title: "Minificatore JavaScript",
        meta: "Minificatore JavaScript online gratuito. Incolla il tuo codice JS e comprimilo istantaneamente rimuovendo spazi, accorciando variabili e ottimizzando le espressioni.",
        d1: "Questo minificatore JavaScript online usa Terser per comprimere il tuo codice per la produzione. Rimuove spazi, commenti e codice morto, accorcia i nomi di variabili e funzioni, e semplifica le espressioni, senza modificare il comportamento del codice.",
        d2: "Bundle JavaScript più piccoli significano caricamenti più veloci, costi di banda ridotti e migliori punteggi su Lighthouse e Core Web Vitals. Incolla il codice, clicca su minifica e ottieni il risultato pronto per la produzione in pochi secondi.",
        plc: "Incolla il codice JavaScript qui o trascina un file",
        bt: "Minifica JavaScript",
        rst: "Ricomincia",
        copy: "Copia",
        err: "Errore",
        err_label: "Impossibile minificare il JavaScript",
        how_it_works_title: "Come Funziona",
        hiw_1_title: "Incolla il tuo JavaScript",
        hiw_1_desc: "Copia e incolla il codice sorgente JavaScript nell'editor.",
        hiw_2_title: "Clicca su Minifica",
        hiw_2_desc: "Premi il pulsante Minifica JavaScript e Terser comprimerà il codice all'istante.",
        hiw_3_title: "Copia il Risultato",
        hiw_3_desc: "Copia il JavaScript minificato o ricomincia con un nuovo codice.",
        use_cases_title: "Casi d'Uso",
        uc_1_title: "Deploy in Produzione",
        uc_1_desc: "Riduci la dimensione del bundle JS prima del deploy in produzione per caricamenti più veloci e minore utilizzo di banda.",
        uc_2_title: "Pipeline di Build",
        uc_2_desc: "Minifica script autonomi al di fuori del tuo strumento di build quando hai bisogno di un'ottimizzazione rapida e una tantum.",
        uc_3_title: "Lighthouse e Core Web Vitals",
        uc_3_desc: "Payload JavaScript più piccoli migliorano direttamente il Time to Interactive e i punteggi di Total Blocking Time.",
        faq_title: "Domande e Risposte",
        faq_1_q: "Il mio codice JavaScript viene inviato a qualche server?",
        faq_1_a: "No. Tutta l'elaborazione avviene nel tuo browser con Terser. Il tuo codice non lascia mai il tuo dispositivo.",
        faq_2_q: "La minificazione cambia il funzionamento del mio codice?",
        faq_2_a: "No. Terser rimuove solo spazi, commenti e sintassi ridondante, e rinomina le variabili internamente. Il codice minificato è funzionalmente identico all'originale.",
        faq_3_q: "Cosa succede se il mio JavaScript ha errori di sintassi?",
        faq_3_a: "Se il codice non può essere analizzato, lo strumento mostrerà un messaggio di errore per aiutarti a identificare e correggere il problema prima della minificazione.",
        see1: "Minificatore di CSS",
        see2: "Minificatore HTML",
        see3: "Formattatore JavaScript",
        see4: "Formattatore HTML",
        f_1: "Compressione istantanea di JavaScript con Terser",
        f_2: "Accorciamento dei nomi di variabili e funzioni",
        f_3: "Rimozione del codice morto e semplificazione delle espressioni",
        f_4: "Nessuna registrazione o installazione richiesta"
    },
    id: {
        m_title: "Minifikasi JavaScript Online - Minifikasi & Kompresi JS Gratis",
        title: "Minifikasi JavaScript",
        meta: "Minifikasi JavaScript online gratis. Tempelkan kode JS Anda dan kompres secara instan dengan menghapus spasi, mempersingkat variabel, dan mengoptimalkan ekspresi.",
        d1: "Minifikasi JavaScript online ini menggunakan Terser untuk mengompres kode Anda untuk produksi. Alat ini menghapus spasi, komentar, dan kode mati, mempersingkat nama variabel dan fungsi, serta menyederhanakan ekspresi, tanpa mengubah perilaku kode.",
        d2: "Bundle JavaScript yang lebih kecil berarti pemuatan halaman lebih cepat, biaya bandwidth lebih rendah, dan skor Lighthouse serta Core Web Vitals yang lebih baik. Tempel kode Anda, klik minifikasi, dan dapatkan hasil siap produksi dalam hitungan detik.",
        plc: "Tempel kode JavaScript di sini atau seret file",
        bt: "Minifikasi JavaScript",
        rst: "Mulai Ulang",
        copy: "Salin",
        err: "Kesalahan",
        err_label: "Tidak dapat minifikasi JavaScript",
        how_it_works_title: "Cara Kerja",
        hiw_1_title: "Tempel JavaScript Anda",
        hiw_1_desc: "Salin dan tempel kode sumber JavaScript ke dalam editor.",
        hiw_2_title: "Klik Minifikasi",
        hiw_2_desc: "Tekan tombol Minifikasi JavaScript dan Terser akan mengompres kode secara instan.",
        hiw_3_title: "Salin Hasilnya",
        hiw_3_desc: "Salin JavaScript yang telah diminifikasi atau mulai ulang dengan kode baru.",
        use_cases_title: "Contoh Penggunaan",
        uc_1_title: "Deploy ke Produksi",
        uc_1_desc: "Kurangi ukuran bundle JS sebelum deploy ke produksi untuk pemuatan lebih cepat dan penggunaan bandwidth lebih rendah.",
        uc_2_title: "Pipeline Build",
        uc_2_desc: "Minifikasi skrip mandiri di luar alat build Anda ketika Anda membutuhkan optimasi cepat dan sekali pakai.",
        uc_3_title: "Lighthouse dan Core Web Vitals",
        uc_3_desc: "Payload JavaScript yang lebih kecil secara langsung meningkatkan Time to Interactive dan skor Total Blocking Time.",
        faq_title: "Tanya Jawab",
        faq_1_q: "Apakah kode JavaScript saya dikirim ke server?",
        faq_1_a: "Tidak. Semua pemrosesan dilakukan di browser Anda menggunakan Terser. Kode Anda tidak pernah meninggalkan perangkat Anda.",
        faq_2_q: "Apakah minifikasi mengubah cara kerja kode saya?",
        faq_2_a: "Tidak. Terser hanya menghapus spasi, komentar, dan sintaks berlebih, serta mengganti nama variabel secara internal. Kode yang diminifikasi identik secara fungsional dengan aslinya.",
        faq_3_q: "Apa yang terjadi jika JavaScript saya memiliki kesalahan sintaks?",
        faq_3_a: "Jika kode tidak dapat diurai, alat ini akan menampilkan pesan kesalahan agar Anda dapat mengidentifikasi dan memperbaiki masalah sebelum minifikasi.",
        see1: "Minifikasi CSS",
        see2: "Minifikasi HTML",
        see3: "Pemformat JavaScript",
        see4: "Pemformat HTML",
        f_1: "Kompresi JavaScript secara instan dengan Terser",
        f_2: "Pemendekkan nama variabel dan fungsi",
        f_3: "Penghapusan kode mati dan penyederhanaan ekspresi",
        f_4: "Tanpa pendaftaran atau instalasi"
    },
    de: {
      m_title: "JavaScript-Minifier Online – JS kostenlos minifizieren & komprimieren",
      title: "JavaScript-Minifier",
      meta: "Kostenloser Online-JavaScript-Minifier. Füge deinen JS-Code ein und komprimiere ihn sofort, indem Leerzeichen entfernt, Variablen gekürzt und Ausdrücke optimiert werden.",
      d1: "Dieser Online-JavaScript-Minifier verwendet Terser, um deinen Code für die Produktion zu komprimieren. Er entfernt Leerzeichen, Kommentare und toten Code, kürzt Variablen- und Funktionsnamen und vereinfacht Ausdrücke, ohne das Verhalten zu verändern.",
      d2: "Kleinere JavaScript-Bundles bedeuten schnellere Ladezeiten, geringere Bandbreitenkosten und bessere Werte bei Lighthouse und Core Web Vitals. Füge deinen Code ein, klicke auf Minifizieren und erhalte in Sekunden produktionsreifen Output.",
      plc: "JavaScript-Code hier einfügen oder Datei hineinziehen",
      bt: "JavaScript minifizieren",
      rst: "Zurücksetzen",
      copy: "Kopieren",
      err: "Fehler",
      err_label: "JavaScript konnte nicht minifiziert werden",
      how_it_works_title: "So funktioniert es",
      hiw_1_title: "JavaScript einfügen",
      hiw_1_desc: "Kopiere und füge deinen JavaScript-Quellcode in den Editor ein.",
      hiw_2_title: "Minifizieren klicken",
      hiw_2_desc: "Klicke auf „JavaScript minifizieren“ und Terser komprimiert den Code sofort.",
      hiw_3_title: "Ergebnis kopieren",
      hiw_3_desc: "Kopiere die minifizierte Ausgabe oder beginne mit neuem Code.",
      use_cases_title: "Anwendungsfälle",
      uc_1_title: "Produktivbereitstellung",
      uc_1_desc: "Reduziere die Größe von JS-Bundles vor dem Deployment für schnellere Ladezeiten und geringeren Bandbreitenverbrauch.",
      uc_2_title: "Build-Pipeline",
      uc_2_desc: "Minifiziere einzelne Skripte außerhalb deiner Build-Tools, wenn du eine schnelle, einmalige Optimierung brauchst.",
      uc_3_title: "Lighthouse & Core Web Vitals",
      uc_3_desc: "Kleinere JavaScript-Payloads verbessern direkt Time to Interactive und Total Blocking Time.",
      faq_title: "Fragen & Antworten",
      faq_1_q: "Wird mein JavaScript-Code an einen Server gesendet?",
      faq_1_a: "Nein. Die gesamte Verarbeitung erfolgt in deinem Browser mit Terser. Dein Code verlässt dein Gerät nicht.",
      faq_2_q: "Verändert die Minifizierung die Funktionsweise meines Codes?",
      faq_2_a: "Nein. Terser entfernt nur Leerzeichen, Kommentare und redundante Syntax und benennt Variablen intern um. Das Ergebnis ist funktional identisch.",
      faq_3_q: "Was passiert bei Syntaxfehlern im JavaScript?",
      faq_3_a: "Wenn der Code nicht geparst werden kann, zeigt das Tool eine Fehlermeldung an, damit du das Problem beheben kannst.",
      see1: "CSS-Minifier",
      see2: "HTML-Minifier",
      see3: "JavaScript-Formatter",
      see4: "HTML-Formatter",
      f_1: "Sofortige JavaScript-Kompression mit Terser",
      f_2: "Kürzung von Variablen- und Funktionsnamen",
      f_3: "Entfernung von totem Code und Vereinfachung von Ausdrücken",
      f_4: "Keine Registrierung oder Installation erforderlich"
  },
  nl: {
      m_title: "JavaScript-minifier online – JS gratis minifiëren & comprimeren",
      title: "JavaScript-minifier",
      meta: "Gratis online JavaScript-minifier. Plak je JS-code en comprimeer deze direct door spaties te verwijderen, variabelen te verkorten en expressies te optimaliseren.",
      d1: "Deze online JavaScript-minifier gebruikt Terser om je code te comprimeren voor productie. Hij verwijdert spaties, opmerkingen en dode code, verkort variabele- en functienamen en vereenvoudigt expressies zonder het gedrag te veranderen.",
      d2: "Kleinere JavaScript-bundels betekenen snellere laadtijden, lagere bandbreedtekosten en betere scores in Lighthouse en Core Web Vitals. Plak je code, klik op minifiëren en krijg binnen enkele seconden productieklare output.",
      plc: "Plak hier de JavaScript-code of sleep een bestand",
      bt: "JavaScript minifiëren",
      rst: "Opnieuw beginnen",
      copy: "Kopiëren",
      err: "Fout",
      err_label: "JavaScript kon niet worden geminificeerd",
      how_it_works_title: "Hoe het werkt",
      hiw_1_title: "Plak je JavaScript",
      hiw_1_desc: "Kopieer en plak je JavaScript-broncode in de editor.",
      hiw_2_title: "Klik op minifiëren",
      hiw_2_desc: "Klik op de knop JavaScript minifiëren en Terser comprimeert de code direct.",
      hiw_3_title: "Kopieer het resultaat",
      hiw_3_desc: "Kopieer de geminificeerde output of begin opnieuw met nieuwe code.",
      use_cases_title: "Gebruiksscenario’s",
      uc_1_title: "Productie-deploy",
      uc_1_desc: "Verklein JS-bundles vóór deployment voor snellere laadtijden en minder bandbreedtegebruik.",
      uc_2_title: "Build-pipeline",
      uc_2_desc: "Minifieer losse scripts buiten je build-tool wanneer je een snelle, eenmalige optimalisatie nodig hebt.",
      uc_3_title: "Lighthouse & Core Web Vitals",
      uc_3_desc: "Kleinere JavaScript-payloads verbeteren direct Time to Interactive en Total Blocking Time.",
      faq_title: "Vragen & antwoorden",
      faq_1_q: "Wordt mijn JavaScript-code naar een server gestuurd?",
      faq_1_a: "Nee. Alle verwerking gebeurt volledig in je browser met Terser. Je code verlaat je apparaat niet.",
      faq_2_q: "Verandert minificatie hoe mijn code werkt?",
      faq_2_a: "Nee. Terser verwijdert alleen spaties, opmerkingen en overbodige syntax en hernoemt variabelen intern. De output is functioneel identiek.",
      faq_3_q: "Wat gebeurt er als mijn JavaScript syntaxisfouten bevat?",
      faq_3_a: "Als de code niet kan worden geparseerd, toont de tool een foutmelding zodat je het probleem kunt oplossen.",
      see1: "CSS-minifier",
      see2: "HTML-minifier",
      see3: "JavaScript-formatter",
      see4: "HTML-formatter",
      f_1: "Directe JavaScript-compressie met Terser",
      f_2: "Verkorting van variabele- en functienamen",
      f_3: "Verwijdering van dode code en vereenvoudiging van expressies",
      f_4: "Geen registratie of installatie vereist"
  }
}
</i18n>
