<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/less@4.5.1/dist/less.min.js', {
  trigger: 'client'
})

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
  resetable: false,
  lang: 'less' as string
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
  const lessFn = (window as any).less
  if (!lessFn) {
    document.location.reload()
    return
  }

  lessFn.render(editor.value!.getValue(), {})
    .then(
      (output: any) => {
        editor.value!.setValue(output.css)
        editor.value!.setMode('css')
        editor.value!.setReadOnly(true)
        state.lang = 'css'
        state.resetable = true
        state.ads = true
      },
      (e: any) => {
        state.error = `${t('err')}: ${e.message}`
      }
    )
}

function reset() {
  editor.value!.setValue('')
  editor.value!.setMode('less')
  editor.value!.setReadOnly(false)
  state.lang = 'less'
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
    en: '/less-to-css-converter',
    pt: '/conversor-de-less-para-css',
    es: '/convertidor-de-less-a-css',
    fr: '/convertisseur-de-less-en-css',
    it: '/convertitore-da-less-a-css',
    id: '/konverter-less-ke-css'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :wiki-url="`https://en.wikipedia.org/wiki/Less_(stylesheet_language)`"
    :wiki-label="'Wikipedia (LESS)'"
    :see-also-links="[
      { label: t('see1'), to: 'xml-to-json-converter' },
      { label: t('see2'), to: 'json-to-xml-converter' },
      { label: t('see3'), to: 'number-base-converter' },
      { label: t('see4'), to: 'storage-unit-converter' }
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
        :lang="state.lang"
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
          <p>{{ t('d1') }}</p>
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
    m_title: "LESS to CSS Converter Online - Free and Instant",
    title: "LESS to CSS Converter",
    meta: "Convert LESS to CSS online for free. Paste your LESS code and get the equivalent valid CSS without needing a build tool.",
    d1: "LESS is a CSS preprocessor that extends the language with variables, nested rules, mixins, and functions, making stylesheets more maintainable and reusable. However, browsers only understand plain CSS, so LESS must be compiled before deployment.",
    bt: "Convert",
    rst: "Start Over",
    copy: "Copy",
    plc: "Insert the LESS code here or drag a file",
    err: "Error",
    err_label: "Compilation Error",
    how_it_works_title: "How It Works",
    hiw_1_title: "Paste Your LESS",
    hiw_1_desc: "Paste or drag your LESS file into the editor. Variables, mixins, and nesting are all supported.",
    hiw_2_title: "Click Convert",
    hiw_2_desc: "Hit the Convert button and the tool compiles your LESS instantly inside the browser.",
    hiw_3_title: "Copy the CSS",
    hiw_3_desc: "The compiled CSS is shown in the editor ready to copy. Click Copy CSS to grab it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "Quick Snippet Testing",
    uc_1_desc: "Test LESS variables, mixins, or nesting rules instantly without setting up a local build environment.",
    uc_2_title: "Style Debugging",
    uc_2_desc: "Isolate and debug specific LESS blocks to understand the generated CSS output and catch errors.",
    uc_3_title: "Code Migration",
    uc_3_desc: "Convert existing LESS stylesheets to plain CSS when migrating projects away from preprocessors.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is my LESS code sent to a server?",
    faq_1_a: "No. The compilation runs entirely inside your browser. Your code never leaves your device.",
    faq_2_q: "Does it support all LESS features?",
    faq_2_a: "Yes. Variables, mixins, nesting, functions, imports from inline definitions, and most LESS language features are fully supported.",
    faq_3_q: "What happens if my LESS has an error?",
    faq_3_a: "The tool displays a descriptive error message so you can locate and fix the issue.",
    see1: "XML to JSON Converter",
    see2: "JSON to XML Converter",
    see3: "Number Base Converter",
    see4: "Storage Unit Converter",
    f_1: "Instant LESS to CSS compilation",
    f_2: "Supports variables, mixins and nesting",
    f_3: "Real-time error feedback",
    f_4: "No registration or installation required"
  },
  pt: {
    m_title: "Conversor de LESS para CSS Online - Gratuito e Instantâneo",
    title: "Conversor de LESS para CSS",
    meta: "Conversor de LESS para CSS online e gratuito. Cole seu código LESS e obtenha o código CSS equivalente e válido sem a necessidade de uma ferramenta de build.",
    d1: "LESS é um pré-processador CSS que estende a linguagem com variáveis, regras aninhadas, mixins e funções, tornando as folhas de estilo mais organizadas e reutilizáveis. Como os navegadores só entendem CSS puro, o LESS precisa ser compilado antes de ser usado.",
    bt: "Converter",
    rst: "Recomeçar",
    copy: "Copiar",
    plc: "Insira o código LESS aqui ou arraste um arquivo",
    err: "Erro",
    err_label: "Erro de Compilação",
    how_it_works_title: "Como Funciona",
    hiw_1_title: "Cole o seu LESS",
    hiw_1_desc: "Cole ou arraste o arquivo LESS no editor. Variáveis, mixins e aninhamento são suportados.",
    hiw_2_title: "Clique em Converter",
    hiw_2_desc: "Pressione o botão Converter e a ferramenta compila o LESS instantaneamente no navegador.",
    hiw_3_title: "Copie o CSS",
    hiw_3_desc: "O CSS gerado aparece no editor pronto para uso. Clique em Copiar CSS para copiar para a área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Teste Rápido de Trechos",
    uc_1_desc: "Teste variáveis, mixins ou regras de aninhamento LESS sem configurar um ambiente de build local.",
    uc_2_title: "Depuração de Estilos",
    uc_2_desc: "Isole e depure blocos LESS específicos para entender o CSS gerado e encontrar erros com facilidade.",
    uc_3_title: "Migração de Código",
    uc_3_desc: "Converta folhas de estilo LESS existentes para CSS puro ao migrar projetos que não usam mais pré-processadores.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O meu código LESS é enviado para algum servidor?",
    faq_1_a: "Não. A compilação é feita inteiramente no seu navegador. O seu código nunca sai do seu dispositivo.",
    faq_2_q: "Suporta todos os recursos do LESS?",
    faq_2_a: "Sim. Variáveis, mixins, aninhamento, funções e a maioria dos recursos da linguagem LESS são totalmente suportados.",
    faq_3_q: "O que acontece se o LESS tiver um erro?",
    faq_3_a: "A ferramenta exibe uma mensagem de erro descritiva para que você possa localizar e corrigir o problema.",
    see1: "Conversor de XML para JSON",
    see2: "Conversor de JSON para XML",
    see3: "Conversor de Bases Numéricas",
    see4: "Conversor de Unidades de Armazenamento",
    f_1: "Compilação instantânea de LESS para CSS",
    f_2: "Suporta variáveis, mixins e aninhamento",
    f_3: "Feedback de erros em tempo real",
    f_4: "Sem necessidade de cadastro ou instalação"
  },
  es: {
    m_title: "Convertidor de LESS a CSS Online - Gratis y Instantáneo",
    title: "Convertidor de LESS a CSS",
    meta: "Convertidor de LESS a CSS online y gratuito. Pega tu código LESS y obtén el CSS equivalente y válido sin necesidad de una herramienta de build.",
    d1: "LESS es un preprocesador CSS que extiende el lenguaje con variables, reglas anidadas, mixins y funciones, haciendo que las hojas de estilo sean más organizadas y reutilizables. Como los navegadores solo entienden CSS puro, LESS debe compilarse antes de usarse.",
    bt: "Convertir",
    rst: "Recomenzar",
    copy: "Copiar",
    plc: "Introduce el código LESS aquí o arrastra un archivo",
    err: "Error",
    err_label: "Error de Compilación",
    how_it_works_title: "Cómo Funciona",
    hiw_1_title: "Pega tu LESS",
    hiw_1_desc: "Pega o arrastra tu archivo LESS en el editor. Variables, mixins y anidamiento son compatibles.",
    hiw_2_title: "Haz clic en Convertir",
    hiw_2_desc: "Presiona el botón Convertir y la herramienta compila el LESS al instante en el navegador.",
    hiw_3_title: "Copia el CSS",
    hiw_3_desc: "El CSS generado aparece en el editor listo para usar. Haz clic en Copiar CSS para copiarlo al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Prueba Rápida de Fragmentos",
    uc_1_desc: "Prueba variables, mixins o reglas de anidamiento LESS sin configurar un entorno de build local.",
    uc_2_title: "Depuración de Estilos",
    uc_2_desc: "Aísla y depura bloques LESS específicos para entender el CSS generado y detectar errores fácilmente.",
    uc_3_title: "Migración de Código",
    uc_3_desc: "Convierte hojas de estilo LESS existentes a CSS puro al migrar proyectos que ya no usan preprocesadores.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mi código LESS se envía a algún servidor?",
    faq_1_a: "No. La compilación se realiza completamente en tu navegador. Tu código nunca sale de tu dispositivo.",
    faq_2_q: "¿Soporta todas las características de LESS?",
    faq_2_a: "Sí. Variables, mixins, anidamiento, funciones y la mayoría de las características del lenguaje LESS son totalmente compatibles.",
    faq_3_q: "¿Qué pasa si mi LESS tiene un error?",
    faq_3_a: "La herramienta muestra un mensaje de error descriptivo para que puedas localizar y corregir el problema.",
    see1: "Convertidor de XML a JSON",
    see2: "Convertidor de JSON a XML",
    see3: "Convertidor de Bases Numéricas",
    see4: "Convertidor de Unidades de Almacenamiento",
    f_1: "Compilación instantánea de LESS a CSS",
    f_2: "Soporta variables, mixins y anidamiento",
    f_3: "Retroalimentación de errores en tiempo real",
    f_4: "Sin necesidad de registro ni instalación"
  },
  fr: {
    m_title: "Convertisseur LESS en CSS en ligne - Gratuit et instantané",
    title: "Convertisseur LESS en CSS",
    meta: "Convertisseur LESS en CSS en ligne et gratuit. Collez votre code LESS et obtenez le CSS équivalent et valide sans avoir besoin d'un outil de build.",
    d1: "LESS est un préprocesseur CSS qui étend le langage avec des variables, des règles imbriquées, des mixins et des fonctions, rendant les feuilles de style plus organisées et réutilisables. Comme les navigateurs ne comprennent que le CSS pur, LESS doit être compilé avant utilisation.",
    bt: "Convertir",
    rst: "Recommencer",
    copy: "Copier",
    plc: "Insérez le code LESS ici ou faites glisser un fichier",
    err: "Erreur",
    err_label: "Erreur de Compilation",
    how_it_works_title: "Comment Ça Marche",
    hiw_1_title: "Collez votre LESS",
    hiw_1_desc: "Collez ou faites glisser votre fichier LESS dans l'éditeur. Variables, mixins et imbrication sont pris en charge.",
    hiw_2_title: "Cliquez sur Convertir",
    hiw_2_desc: "Appuyez sur le bouton Convertir et l'outil compile le LESS instantanément dans le navigateur.",
    hiw_3_title: "Copiez le CSS",
    hiw_3_desc: "Le CSS généré apparaît dans l'éditeur prêt à l'emploi. Cliquez sur Copier CSS pour le copier dans le presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Test Rapide de Fragments",
    uc_1_desc: "Testez des variables, mixins ou règles d'imbrication LESS sans configurer un environnement de build local.",
    uc_2_title: "Débogage de Styles",
    uc_2_desc: "Isolez et déboguez des blocs LESS spécifiques pour comprendre le CSS généré et détecter les erreurs.",
    uc_3_title: "Migration de Code",
    uc_3_desc: "Convertissez des feuilles de style LESS existantes en CSS pur lors de la migration de projets sans préprocesseurs.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Mon code LESS est-il envoyé à un serveur ?",
    faq_1_a: "Non. La compilation s'effectue entièrement dans votre navigateur. Votre code ne quitte jamais votre appareil.",
    faq_2_q: "Prend-il en charge toutes les fonctionnalités LESS ?",
    faq_2_a: "Oui. Les variables, mixins, l'imbrication, les fonctions et la plupart des fonctionnalités du langage LESS sont entièrement prises en charge.",
    faq_3_q: "Que se passe-t-il si mon LESS contient une erreur ?",
    faq_3_a: "L'outil affiche un message d'erreur descriptif pour vous aider à localiser et corriger le problème.",
    see1: "Convertisseur de XML vers JSON",
    see2: "Convertisseur de JSON vers XML",
    see3: "Convertisseur de Bases Numériques",
    see4: "Convertisseur d'Unités de Stockage",
    f_1: "Compilation instantanée de LESS en CSS",
    f_2: "Prend en charge variables, mixins et imbrication",
    f_3: "Retour d'erreur en temps réel",
    f_4: "Aucune inscription ou installation requise"
  },
  it: {
    m_title: "Convertitore LESS in CSS Online - Gratuito e Istantaneo",
    title: "Convertitore LESS in CSS",
    meta: "Convertitore LESS in CSS online e gratuito. Incolla il tuo codice LESS e ottieni il CSS equivalente e valido senza bisogno di uno strumento di build.",
    d1: "LESS è un preprocessore CSS che estende il linguaggio con variabili, regole annidate, mixin e funzioni, rendendo i fogli di stile più organizzati e riutilizzabili. Poiché i browser supportano solo CSS puro, LESS deve essere compilato prima dell'uso.",
    bt: "Converti",
    rst: "Ricomincia",
    copy: "Copia",
    plc: "Inserisci qui il codice LESS o trascina un file",
    err: "Errore",
    err_label: "Errore di Compilazione",
    how_it_works_title: "Come Funziona",
    hiw_1_title: "Incolla il tuo LESS",
    hiw_1_desc: "Incolla o trascina il tuo file LESS nell'editor. Variabili, mixin e annidamento sono supportati.",
    hiw_2_title: "Clicca Converti",
    hiw_2_desc: "Premi il pulsante Converti e lo strumento compila il LESS istantaneamente nel browser.",
    hiw_3_title: "Copia il CSS",
    hiw_3_desc: "Il CSS generato appare nell'editor pronto all'uso. Clicca Copia CSS per copiarlo negli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Test Rapido di Frammenti",
    uc_1_desc: "Testa variabili, mixin o regole di annidamento LESS senza configurare un ambiente di build locale.",
    uc_2_title: "Debug degli Stili",
    uc_2_desc: "Isola e fai il debug di blocchi LESS specifici per capire il CSS generato e individuare gli errori.",
    uc_3_title: "Migrazione del Codice",
    uc_3_desc: "Converti fogli di stile LESS esistenti in CSS puro durante la migrazione di progetti che non usano più preprocessori.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Il mio codice LESS viene inviato a un server?",
    faq_1_a: "No. La compilazione avviene interamente nel tuo browser. Il tuo codice non lascia mai il tuo dispositivo.",
    faq_2_q: "Supporta tutte le funzionalità di LESS?",
    faq_2_a: "Sì. Variabili, mixin, annidamento, funzioni e la maggior parte delle funzionalità del linguaggio LESS sono pienamente supportate.",
    faq_3_q: "Cosa succede se il mio LESS contiene un errore?",
    faq_3_a: "Lo strumento mostra un messaggio di errore descrittivo per aiutarti a individuare e correggere il problema.",
    see1: "Convertitore da XML a JSON",
    see2: "Convertitore da JSON a XML",
    see3: "Convertitore di Basi Numeriche",
    see4: "Convertitore di Unità di Archiviazione",
    f_1: "Compilazione istantanea da LESS a CSS",
    f_2: "Supporta variabili, mixin e annidamento",
    f_3: "Feedback sugli errori in tempo reale",
    f_4: "Nessuna registrazione o installazione richiesta"
  },
  id: {
    m_title: "Konverter LESS ke CSS Online - Gratis dan Instan",
    title: "Konverter LESS ke CSS",
    meta: "Konverter LESS ke CSS online gratis. Tempel kode LESS Anda dan dapatkan CSS yang setara dan valid tanpa perlu alat build.",
    d1: "LESS adalah preprosesor CSS yang memperluas bahasa dengan variabel, aturan bertingkat, mixin, dan fungsi, sehingga stylesheet menjadi lebih terstruktur dan dapat digunakan kembali. Karena browser hanya memahami CSS murni, LESS harus dikompilasi sebelum digunakan.",
    bt: "Konversi",
    rst: "Mulai Ulang",
    copy: "Salin",
    plc: "Masukkan kode LESS di sini atau seret file",
    err: "Kesalahan",
    err_label: "Kesalahan Kompilasi",
    how_it_works_title: "Cara Kerja",
    hiw_1_title: "Tempel LESS Anda",
    hiw_1_desc: "Tempel atau seret file LESS ke editor. Variabel, mixin, dan aturan bertingkat didukung.",
    hiw_2_title: "Klik Konversi",
    hiw_2_desc: "Tekan tombol Konversi dan alat akan mengompilasi LESS secara instan di browser.",
    hiw_3_title: "Salin CSS",
    hiw_3_desc: "CSS yang dihasilkan muncul di editor siap digunakan. Klik Salin CSS untuk menyalinnya ke clipboard.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Uji Cepat Potongan Kode",
    uc_1_desc: "Uji variabel, mixin, atau aturan bertingkat LESS tanpa menyiapkan lingkungan build lokal.",
    uc_2_title: "Debug Style",
    uc_2_desc: "Isolasi dan debug blok LESS tertentu untuk memahami output CSS dan menemukan kesalahan dengan mudah.",
    uc_3_title: "Migrasi Kode",
    uc_3_desc: "Konversi stylesheet LESS yang ada ke CSS murni saat memigrasikan proyek yang tidak lagi menggunakan preprosesor.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah kode LESS saya dikirim ke server?",
    faq_1_a: "Tidak. Kompilasi dilakukan sepenuhnya di browser Anda. Kode Anda tidak pernah meninggalkan perangkat Anda.",
    faq_2_q: "Apakah mendukung semua fitur LESS?",
    faq_2_a: "Ya. Variabel, mixin, aturan bertingkat, fungsi, dan sebagian besar fitur bahasa LESS didukung sepenuhnya.",
    faq_3_q: "Apa yang terjadi jika LESS saya mengandung kesalahan?",
    faq_3_a: "Alat ini menampilkan pesan kesalahan deskriptif agar Anda dapat menemukan dan memperbaiki masalah.",
    see1: "Konverter XML ke JSON",
    see2: "Konverter JSON ke XML",
    see3: "Konverter Basis Angka",
    see4: "Konverter Unit Penyimpanan",
    f_1: "Kompilasi instan LESS ke CSS",
    f_2: "Mendukung variabel, mixin, dan aturan bertingkat",
    f_3: "Umpan balik kesalahan secara real-time",
    f_4: "Tanpa pendaftaran atau instalasi"
  }
}
</i18n>
