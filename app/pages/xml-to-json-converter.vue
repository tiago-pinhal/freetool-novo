<script setup lang="ts">
useScript('https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.js', {
  trigger: 'client'
})
useScript('https://cdnjs.cloudflare.com/ajax/libs/fast-xml-parser/4.5.1/fxparser.min.js', {
  trigger: 'client'
})

const { t, locale } = useI18n({ useScope: 'local' })

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
  attr: false,
  lang: 'xml' as string
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
  const XMLParser = (window as any).XMLParser
  if (!XMLParser) {
    document.location.reload()
    return
  }

  try {
    const options = {
      ignoreAttributes: !state.attr,
      attributeNamePrefix: '@',
      allowBooleanAttributes: true,
      ignoreDeclaration: true
    }
    const result = new XMLParser(options).parse(editor.value!.getValue())
    editor.value!.setValue(JSON.stringify(result, null, '\t'))
    editor.value!.setMode('json')
    editor.value!.setReadOnly(true)
    state.lang = 'json'
    state.resetable = true
    state.ads = true
  } catch (e: any) {
    state.error = `${t('err')}: ${e.message}`
  }
}

function reset() {
  editor.value!.setValue('')
  editor.value!.setMode('xml')
  editor.value!.setReadOnly(false)
  state.lang = 'xml'
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
    en: '/xml-to-json-converter',
    pt: '/conversor-de-xml-para-json',
    es: '/convertidor-de-xml-a-json',
    fr: '/convertisseur-de-xml-en-json',
    it: '/convertitore-da-xml-a-json',
    id: '/konverter-xml-ke-json'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/JSON`"
    :wiki-label="'Wikipedia (JSON)'"
    :see-also-links="[
      { label: t('see1'), to: 'less-to-css-converter' },
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

      <!-- Attribute Option -->
      <div class="form-control w-fit">
        <label class="label cursor-pointer gap-3">
          <input
            id="chk-attr"
            type="checkbox"
            v-model="state.attr"
            :disabled="state.resetable"
            class="checkbox checkbox-primary"
          />
          <span class="label-text">{{ t('attr') }}</span>
        </label>
      </div>

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
            {{ t('copy') }} JSON
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
          <p class="text-lg">{{ t('d1') }}</p>
          <p class="text-lg">{{ t('d2') }}</p>
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
                <div class="mt-1"><Icon name="heroicons:check-circle-20-solid" class="text-success w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_1_title') }}</strong>
                  <span>{{ t('uc_1_desc') }}</span>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="mt-1"><Icon name="heroicons:check-circle-20-solid" class="text-success w-5 h-5" /></div>
                <div>
                  <strong class="text-base-content block mb-1 uppercase text-xs tracking-widest font-black">{{ t('uc_2_title') }}</strong>
                  <span>{{ t('uc_2_desc') }}</span>
                </div>
              </li>
              <li class="flex gap-4 sm:col-span-2">
                <div class="mt-1"><Icon name="heroicons:check-circle-20-solid" class="text-success w-5 h-5" /></div>
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
    m_title: "XML to JSON Converter Online - Free and Instant",
    title: "XML to JSON Converter",
    meta: "Convert XML to JSON online for free. Paste your XML and get clean, formatted JSON without needing any tool or installation.",
    d1: "This tool parses your XML input and maps each element, attribute, and value to its JSON equivalent. Tags become object keys, nested elements become nested objects, and repeated tags are automatically grouped into arrays, preserving the original data hierarchy.",
    d2: "Converting XML to JSON is especially useful when integrating systems that only accept JSON, migrating legacy data, or consuming REST APIs that expect JSON payloads.",
    bt: "Convert",
    rst: "Start Over",
    copy: "Copy",
    plc: "Insert the XML code here or drag a file",
    attr: "Include XML attributes (if any)",
    err: "Error",
    err_label: "Parse Error",
    how_it_works_title: "How It Works",
    hiw_1_title: "Paste Your XML",
    hiw_1_desc: "Paste or drag your XML file into the editor. Enable the attribute option if your XML uses attributes you want to keep.",
    hiw_2_title: "Click Convert",
    hiw_2_desc: "Hit Convert and the tool parses your XML and maps it to a clean, formatted JSON structure instantly.",
    hiw_3_title: "Copy the JSON",
    hiw_3_desc: "The resulting JSON appears in the editor ready to use. Click Copy JSON to grab it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "API Integration",
    uc_1_desc: "Convert XML responses from legacy APIs into JSON to feed modern front-end apps or other services.",
    uc_2_title: "Data Migration",
    uc_2_desc: "Transform old XML datasets into JSON format when migrating databases or moving between systems.",
    uc_3_title: "Configuration Conversion",
    uc_3_desc: "Translate XML configuration files into JSON for use with tools and frameworks that work with JSON natively.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is my XML data sent to a server?",
    faq_1_a: "No. The conversion runs entirely inside your browser. Your data never leaves your device.",
    faq_2_q: "What happens to XML attributes?",
    faq_2_a: "By default, attributes are ignored. Enable the 'Include XML attributes' option to map them as keys prefixed with {'@'} in the JSON output.",
    faq_3_q: "What if my XML has repeated tags?",
    faq_3_a: "Repeated tags at the same level are automatically grouped into a JSON array, preserving the original structure.",
    see1: "LESS to CSS Converter",
    see2: "JSON to XML Converter",
    see3: "Number Base Converter",
    see4: "Storage Unit Converter",
    f_1: "Instant XML to JSON conversion",
    f_2: "XML attribute support",
    f_3: "Preserves data hierarchy and nesting",
    f_4: "No registration or installation required"
  },
  pt: {
    m_title: "Conversor de XML para JSON Online - Gratuito e Instantâneo",
    title: "Conversor de XML para JSON",
    meta: "Converta XML para JSON online e gratuitamente. Cole seu XML e obtenha um JSON limpo e formatado sem precisar de nenhuma ferramenta ou instalação.",
    d1: "Esta ferramenta analisa o seu XML e mapeia cada elemento, atributo e valor para o equivalente em JSON. Tags se tornam chaves de objeto, elementos aninhados viram objetos aninhados e tags repetidas são automaticamente agrupadas em arrays, preservando a hierarquia original dos dados.",
    d2: "Converter XML para JSON é especialmente útil ao integrar sistemas que aceitam apenas JSON, migrar dados legados ou consumir APIs REST que esperam payloads em JSON.",
    bt: "Converter",
    rst: "Recomeçar",
    copy: "Copiar",
    plc: "Insira o código XML aqui ou arraste um arquivo",
    attr: "Incluir os atributos XML (se houver)",
    err: "Erro",
    err_label: "Erro de Análise",
    how_it_works_title: "Como Funciona",
    hiw_1_title: "Cole o seu XML",
    hiw_1_desc: "Cole ou arraste o arquivo XML no editor. Ative a opção de atributos se o seu XML usar atributos que deseja manter.",
    hiw_2_title: "Clique em Converter",
    hiw_2_desc: "Pressione Converter e a ferramenta analisa o XML e mapeia tudo para uma estrutura JSON limpa e formatada instantaneamente.",
    hiw_3_title: "Copie o JSON",
    hiw_3_desc: "O JSON gerado aparece no editor pronto para uso. Clique em Copiar JSON para copiá-lo para a área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Integração de APIs",
    uc_1_desc: "Converta respostas XML de APIs legadas em JSON para alimentar aplicações modernas ou outros serviços.",
    uc_2_title: "Migração de Dados",
    uc_2_desc: "Transforme datasets XML antigos em JSON ao migrar bancos de dados ou mover dados entre sistemas.",
    uc_3_title: "Conversão de Configurações",
    uc_3_desc: "Converta arquivos de configuração XML em JSON para uso com ferramentas e frameworks que trabalham com JSON.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O meu XML é enviado para algum servidor?",
    faq_1_a: "Não. A conversão é feita inteiramente no seu navegador. Os seus dados nunca saem do seu dispositivo.",
    faq_2_q: "O que acontece com os atributos XML?",
    faq_2_a: "Por padrão, os atributos são ignorados. Ative a opção 'Incluir atributos XML' para mapeá-los como chaves prefixadas com {'@'} no JSON resultante.",
    faq_3_q: "E se o meu XML tiver tags repetidas?",
    faq_3_a: "Tags repetidas no mesmo nível são automaticamente agrupadas em um array JSON, preservando a estrutura original.",
    see1: "Conversor de LESS para CSS",
    see2: "Conversor de JSON para XML",
    see3: "Conversor de Bases Numéricas",
    see4: "Conversor de Unidades de Armazenamento",
    f_1: "Conversão instantânea de XML para JSON",
    f_2: "Suporte a atributos XML",
    f_3: "Preserva a hierarquia e o aninhamento dos dados",
    f_4: "Sem necessidade de cadastro ou instalação"
  },
  es: {
    m_title: "Convertidor de XML a JSON Online - Gratis y Instantáneo",
    title: "Convertidor de XML a JSON",
    meta: "Convierte XML a JSON online y gratis. Pega tu XML y obtén un JSON limpio y formateado sin necesidad de ninguna herramienta o instalación.",
    d1: "Esta herramienta analiza tu XML y mapea cada elemento, atributo y valor a su equivalente en JSON. Las etiquetas se convierten en claves de objeto, los elementos anidados en objetos anidados y las etiquetas repetidas se agrupan automáticamente en arrays, preservando la jerarquía original de los datos.",
    d2: "Convertir XML a JSON es especialmente útil al integrar sistemas que solo aceptan JSON, migrar datos heredados o consumir APIs REST que esperan payloads en JSON.",
    bt: "Convertir",
    rst: "Recomenzar",
    copy: "Copiar",
    plc: "Introduce el código XML aquí o arrastra un archivo",
    attr: "Incluir los atributos XML (si los hay)",
    err: "Error",
    err_label: "Error de Análisis",
    how_it_works_title: "Cómo Funciona",
    hiw_1_title: "Pega tu XML",
    hiw_1_desc: "Pega o arrastra tu archivo XML en el editor. Activa la opción de atributos si tu XML los usa y quieres conservarlos.",
    hiw_2_title: "Haz clic en Convertir",
    hiw_2_desc: "Presiona Convertir y la herramienta analiza el XML y lo mapea a una estructura JSON limpia y formateada al instante.",
    hiw_3_title: "Copia el JSON",
    hiw_3_desc: "El JSON resultante aparece en el editor listo para usar. Haz clic en Copiar JSON para copiarlo al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Integración de APIs",
    uc_1_desc: "Convierte respuestas XML de APIs heredadas en JSON para alimentar aplicaciones modernas u otros servicios.",
    uc_2_title: "Migración de Datos",
    uc_2_desc: "Transforma datasets XML antiguos a formato JSON al migrar bases de datos o mover datos entre sistemas.",
    uc_3_title: "Conversión de Configuraciones",
    uc_3_desc: "Traduce archivos de configuración XML a JSON para usarlos con herramientas y frameworks que utilizan JSON.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Mi XML se envía a algún servidor?",
    faq_1_a: "No. La conversión se realiza completamente en tu navegador. Tus datos nunca salen de tu dispositivo.",
    faq_2_q: "¿Qué pasa con los atributos XML?",
    faq_2_a: "Por defecto, los atributos se ignoran. Activa la opción 'Incluir atributos XML' para mapearlos como claves con el prefijo {'@'} en el JSON resultante.",
    faq_3_q: "¿Qué pasa si mi XML tiene etiquetas repetidas?",
    faq_3_a: "Las etiquetas repetidas al mismo nivel se agrupan automáticamente en un array JSON, preservando la estructura original.",
    see1: "Convertidor de LESS a CSS",
    see2: "Convertidor de JSON a XML",
    see3: "Convertidor de Bases Numéricas",
    see4: "Convertidor de Unidades de Almacenamiento",
    f_1: "Conversión instantánea de XML a JSON",
    f_2: "Soporte de atributos XML",
    f_3: "Preserva la jerarquía y el anidamiento de datos",
    f_4: "Sin necesidad de registro ni instalación"
  },
  fr: {
    m_title: "Convertisseur XML en JSON en Ligne - Gratuit et Instantané",
    title: "Convertisseur XML en JSON",
    meta: "Convertissez XML en JSON en ligne et gratuitement. Collez votre XML et obtenez un JSON propre et formaté sans aucun outil ni installation.",
    d1: "Cet outil analyse votre XML et associe chaque élément, attribut et valeur à son équivalent JSON. Les balises deviennent des clés d'objet, les éléments imbriqués deviennent des objets imbriqués et les balises répétées sont automatiquement regroupées en tableaux, en préservant la hiérarchie originale des données.",
    d2: "Convertir du XML en JSON est particulièrement utile lors de l'intégration de systèmes qui n'acceptent que le JSON, de la migration de données héritées ou de la consommation d'API REST attendant des payloads JSON.",
    bt: "Convertir",
    rst: "Recommencer",
    copy: "Copier",
    plc: "Insérez le code XML ici ou faites glisser un fichier",
    attr: "Inclure les attributs XML (le cas échéant)",
    err: "Erreur",
    err_label: "Erreur d'Analyse",
    how_it_works_title: "Comment Ça Marche",
    hiw_1_title: "Collez votre XML",
    hiw_1_desc: "Collez ou faites glisser votre fichier XML dans l'éditeur. Activez l'option attributs si votre XML en contient et que vous souhaitez les conserver.",
    hiw_2_title: "Cliquez sur Convertir",
    hiw_2_desc: "Appuyez sur Convertir et l'outil analyse votre XML et le mappe vers une structure JSON propre et formatée instantanément.",
    hiw_3_title: "Copiez le JSON",
    hiw_3_desc: "Le JSON résultant apparaît dans l'éditeur prêt à l'emploi. Cliquez sur Copier JSON pour le copier dans le presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Intégration d'API",
    uc_1_desc: "Convertissez les réponses XML d'API héritées en JSON pour alimenter des applications modernes ou d'autres services.",
    uc_2_title: "Migration de Données",
    uc_2_desc: "Transformez d'anciens jeux de données XML en JSON lors de la migration de bases de données ou du transfert entre systèmes.",
    uc_3_title: "Conversion de Configuration",
    uc_3_desc: "Traduisez des fichiers de configuration XML en JSON pour les utiliser avec des outils et frameworks qui fonctionnent avec JSON.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Mon XML est-il envoyé à un serveur ?",
    faq_1_a: "Non. La conversion s'effectue entièrement dans votre navigateur. Vos données ne quittent jamais votre appareil.",
    faq_2_q: "Que se passe-t-il avec les attributs XML ?",
    faq_2_a: "Par défaut, les attributs sont ignorés. Activez l'option 'Inclure les attributs XML' pour les mapper comme clés préfixées par {'@'} dans le JSON résultant.",
    faq_3_q: "Que se passe-t-il si mon XML contient des balises répétées ?",
    faq_3_a: "Les balises répétées au même niveau sont automatiquement regroupées dans un tableau JSON, en préservant la structure originale.",
    see1: "Convertisseur LESS en CSS",
    see2: "Convertisseur JSON en XML",
    see3: "Convertisseur de Bases Numériques",
    see4: "Convertisseur d'Unités de Stockage",
    f_1: "Conversion instantanée de XML en JSON",
    f_2: "Prise en charge des attributs XML",
    f_3: "Préserve la hiérarchie et l'imbrication des données",
    f_4: "Aucune inscription ou installation requise"
  },
  it: {
    m_title: "Convertitore XML in JSON Online - Gratuito e Istantaneo",
    title: "Convertitore XML in JSON",
    meta: "Converti XML in JSON online e gratuitamente. Incolla il tuo XML e ottieni un JSON pulito e formattato senza alcuno strumento o installazione.",
    d1: "Questo strumento analizza il tuo XML e mappa ogni elemento, attributo e valore nel corrispondente equivalente JSON. I tag diventano chiavi di oggetto, gli elementi annidati diventano oggetti annidati e i tag ripetuti vengono automaticamente raggruppati in array, preservando la gerarchia originale dei dati.",
    d2: "Convertire XML in JSON è particolarmente utile quando si integrano sistemi che accettano solo JSON, si migrano dati legacy o si consumano API REST che si aspettano payload JSON.",
    bt: "Converti",
    rst: "Ricomincia",
    copy: "Copia",
    plc: "Inserisci il codice XML qui o trascina un file",
    attr: "Includi gli attributi XML (se presenti)",
    err: "Errore",
    err_label: "Errore di Analisi",
    how_it_works_title: "Come Funziona",
    hiw_1_title: "Incolla il tuo XML",
    hiw_1_desc: "Incolla o trascina il tuo file XML nell'editor. Attiva l'opzione attributi se il tuo XML li utilizza e vuoi conservarli.",
    hiw_2_title: "Clicca Converti",
    hiw_2_desc: "Premi Converti e lo strumento analizza il tuo XML e lo mappa in una struttura JSON pulita e formattata istantaneamente.",
    hiw_3_title: "Copia il JSON",
    hiw_3_desc: "Il JSON risultante appare nell'editor pronto all'uso. Clicca Copia JSON per copiarlo negli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Integrazione di API",
    uc_1_desc: "Converti le risposte XML di API legacy in JSON per alimentare applicazioni moderne o altri servizi.",
    uc_2_title: "Migrazione di Dati",
    uc_2_desc: "Trasforma vecchi dataset XML in formato JSON durante la migrazione di database o il trasferimento tra sistemi.",
    uc_3_title: "Conversione di Configurazioni",
    uc_3_desc: "Converti file di configurazione XML in JSON per usarli con strumenti e framework che utilizzano JSON.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Il mio XML viene inviato a un server?",
    faq_1_a: "No. La conversione avviene interamente nel tuo browser. I tuoi dati non lasciano mai il tuo dispositivo.",
    faq_2_q: "Cosa succede agli attributi XML?",
    faq_2_a: "Per impostazione predefinita, gli attributi vengono ignorati. Attiva l'opzione 'Includi attributi XML' per mapparli come chiavi con prefisso {'@'} nel JSON risultante.",
    faq_3_q: "Cosa succede se il mio XML ha tag ripetuti?",
    faq_3_a: "I tag ripetuti allo stesso livello vengono automaticamente raggruppati in un array JSON, preservando la struttura originale.",
    see1: "Convertitore LESS in CSS",
    see2: "Convertitore JSON in XML",
    see3: "Convertitore di Basi Numeriche",
    see4: "Convertitore di Unità di Archiviazione",
    f_1: "Conversione istantanea da XML a JSON",
    f_2: "Supporto agli attributi XML",
    f_3: "Preserva la gerarchia e l'annidamento dei dati",
    f_4: "Nessuna registrazione o installazione richiesta"
  },
  id: {
    m_title: "Konverter XML ke JSON Online - Gratis dan Instan",
    title: "Konverter XML ke JSON",
    meta: "Konversi XML ke JSON online dan gratis. Tempel XML Anda dan dapatkan JSON yang bersih dan terformat tanpa memerlukan alat atau instalasi apapun.",
    d1: "Alat ini mengurai input XML Anda dan memetakan setiap elemen, atribut, dan nilai ke padanannya dalam JSON. Tag menjadi kunci objek, elemen bersarang menjadi objek bersarang, dan tag yang berulang otomatis dikelompokkan ke dalam array, sehingga hierarki data asli tetap terjaga.",
    d2: "Mengonversi XML ke JSON sangat berguna saat mengintegrasikan sistem yang hanya menerima JSON, memindahkan data lama, atau menggunakan REST API yang mengharapkan payload JSON.",
    bt: "Konversi",
    rst: "Mulai Ulang",
    copy: "Salin",
    plc: "Masukkan kode XML di sini atau seret file",
    attr: "Sertakan atribut XML (jika ada)",
    err: "Kesalahan",
    err_label: "Kesalahan Penguraian",
    how_it_works_title: "Cara Kerja",
    hiw_1_title: "Tempel XML Anda",
    hiw_1_desc: "Tempel atau seret file XML ke editor. Aktifkan opsi atribut jika XML Anda menggunakannya dan ingin Anda pertahankan.",
    hiw_2_title: "Klik Konversi",
    hiw_2_desc: "Tekan Konversi dan alat akan mengurai XML Anda serta memetakannya ke struktur JSON yang bersih dan terformat secara instan.",
    hiw_3_title: "Salin JSON",
    hiw_3_desc: "JSON yang dihasilkan muncul di editor siap digunakan. Klik Salin JSON untuk menyalinnya ke clipboard.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Integrasi API",
    uc_1_desc: "Konversi respons XML dari API lama ke JSON untuk digunakan oleh aplikasi modern atau layanan lainnya.",
    uc_2_title: "Migrasi Data",
    uc_2_desc: "Ubah dataset XML lama ke format JSON saat memigrasikan database atau memindahkan data antar sistem.",
    uc_3_title: "Konversi Konfigurasi",
    uc_3_desc: "Terjemahkan file konfigurasi XML ke JSON untuk digunakan dengan alat dan framework yang bekerja dengan JSON.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah data XML saya dikirim ke server?",
    faq_1_a: "Tidak. Konversi dilakukan sepenuhnya di browser Anda. Data Anda tidak pernah meninggalkan perangkat Anda.",
    faq_2_q: "Apa yang terjadi dengan atribut XML?",
    faq_2_a: "Secara default, atribut diabaikan. Aktifkan opsi 'Sertakan atribut XML' untuk memetakannya sebagai kunci dengan awalan {'@'} pada output JSON.",
    faq_3_q: "Bagaimana jika XML saya memiliki tag yang berulang?",
    faq_3_a: "Tag yang berulang pada level yang sama secara otomatis dikelompokkan ke dalam array JSON, sehingga struktur aslinya tetap terjaga.",
    see1: "Konverter LESS ke CSS",
    see2: "Konverter JSON ke XML",
    see3: "Konverter Basis Bilangan",
    see4: "Konverter Unit Penyimpanan",
    f_1: "Konversi instan dari XML ke JSON",
    f_2: "Dukungan atribut XML",
    f_3: "Mempertahankan hierarki dan struktur bersarang data",
    f_4: "Tanpa pendaftaran atau instalasi"
  }
}
</i18n>
