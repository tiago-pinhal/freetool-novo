<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

interface DiffMatchPatch {
  diff_main(text1: string, text2: string): DiffTuple[]
  diff_cleanupSemantic(diffs: DiffTuple[]): void
}

type DiffTuple = [number, string]

const DIFF_DELETE = -1
const DIFF_EQUAL = 0
const DIFF_INSERT = 1

const { onLoaded } = useScript('https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch_uncompressed.js', {
  trigger: 'client'
})

const { t } = useI18n({ useScope: 'local' })

const state = reactive({
  text1: '',
  text2: '',
  output: '',
  eq: false,
  ads: false
})

const comparator = ref<DiffMatchPatch | null>(null)

const hasBothTexts = computed(() => state.text1 !== '' && state.text2 !== '')
const showResult = computed(() => hasBothTexts.value && (state.eq || state.output !== ''))

const faqs = computed(() => [
  { question: t('faq1q'), answer: t('faq1a') },
  { question: t('faq2q'), answer: t('faq2a') },
  { question: t('faq3q'), answer: t('faq3a') }
])

const features = computed(() => [
  t('f_1'),
  t('f_2'),
  t('f_3'),
  t('f_4')
])

const howToSteps = computed(() => [
  { name: t('step_1_title'), text: t('step_1_desc') },
  { name: t('step_2_title'), text: t('step_2_desc') },
  { name: t('step_3_title'), text: t('step_3_desc') }
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: features.value,
  faq: faqs.value
})

useHead({
  title: t('meta_title'),
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:title', content: t('meta_title') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'pt_BR' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: t('meta_title') },
    { name: 'twitter:description', content: t('meta') }
  ]
})

onLoaded(() => {
  const DiffMatchPatchCtor = (window as typeof window & { diff_match_patch?: new () => DiffMatchPatch }).diff_match_patch

  if (DiffMatchPatchCtor) {
    comparator.value = new DiffMatchPatchCtor()
    match()
  }
})

watch(
  () => [state.text1, state.text2],
  () => match()
)

function match() {
  if (!hasBothTexts.value) {
    state.output = ''
    state.eq = false
    return
  }

  if (!state.ads) {
    state.ads = true
  }

  if (state.text1 === state.text2) {
    state.eq = true
    state.output = ''
    return
  }

  if (!comparator.value) {
    state.eq = false
    state.output = ''
    return
  }

  const diff = comparator.value.diff_main(state.text1, state.text2)
  comparator.value.diff_cleanupSemantic(diff)

  state.output = formatDiff(diff)
  state.eq = false
}

function formatDiff(diff: DiffTuple[]) {
  return diff.map(([operation, value]) => {
    const text = escapeHtml(value).replace(/\n/g, '<span class="diff-line-break">&para;</span><br>')

    if (operation === DIFF_INSERT) {
      return `<ins>${text}</ins>`
    }

    if (operation === DIFF_DELETE) {
      return `<del>${text}</del>`
    }

    if (operation === DIFF_EQUAL) {
      return `<span>${text}</span>`
    }

    return text
  }).join('')
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

defineI18nRoute({
  paths: {
    en: '/text-comparator',
    pt: '/comparador-de-texto',
    es: '/comparador-de-texto',
    fr: '/comparateur-de-texte',
    it: '/comparatore-di-testo',
    id: '/komparator-teks',
    de: '/text-vergleicher',
    nl: '/tekstvergelijker'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'text-converter' },
      { label: t('see2'), to: 'ascii-letter-generator' },
      { label: t('see3'), to: 'fancy-letters' },
      { label: t('see4'), to: 'text-counter' },
      { label: t('see_morse'), to: 'morse-code-converter' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="form-control w-full">
          <label class="label" for="txt-original">
            <span class="label-text font-bold text-base-content">{{ t('label_original') }}</span>
          </label>
          <textarea
            id="txt-original"
            v-model="state.text1"
            rows="9"
            class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-base leading-relaxed"
            :placeholder="t('plc1')"
            autofocus
          ></textarea>
        </div>

        <div class="form-control w-full">
          <label class="label" for="txt-modified">
            <span class="label-text font-bold text-base-content">{{ t('label_modified') }}</span>
          </label>
          <textarea
            id="txt-modified"
            v-model="state.text2"
            rows="9"
            class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-base leading-relaxed"
            :placeholder="t('plc2')"
          ></textarea>
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        leave-active-class="transition duration-200 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="showResult" class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 class="text-lg font-bold text-base-content flex items-center gap-2">
              <Icon name="heroicons:document-magnifying-glass-20-solid" class="w-5 h-5 text-primary" aria-hidden="true" />
              {{ t('result') }}
            </h2>

            <div v-if="!state.eq" class="flex items-center gap-4 text-xs font-medium opacity-70">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-sm bg-error/30 border border-error/50 line-through decoration-error"></span>
                <span>{{ t('legend_del') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-sm bg-primary/30 border border-primary/50"></span>
                <span>{{ t('legend_ins') }}</span>
              </div>
            </div>
          </div>

          <div v-if="state.eq" class="alert alert-success rounded-2xl">
            <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6" aria-hidden="true" />
            <span>{{ t('eq') }}</span>
          </div>

          <div
            v-else
            class="diff-output rounded-2xl border border-base-content/10 bg-base-200/60 p-5 text-base leading-8 text-base-content"
            v-html="state.output"
          />
        </div>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <p class="text-base-content/80 leading-relaxed">{{ t('about_desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="features"
        />

        <UseCaseSection
          :title="t('apps_title')"
          :items="[
            { title: t('app_1_t'), description: t('app_1_d') },
            { title: t('app_2_t'), description: t('app_2_d') },
            { title: t('app_3_t'), description: t('app_3_d') },
            { title: t('app_4_t'), description: t('app_4_d') },
            { title: t('app_5_t'), description: t('app_5_d') }
          ]"
        />

        <UseCaseSection
          :title="t('edge_title')"
          :description="t('edge_desc')"
          :items="[
            { title: t('edge_1_t'), description: t('edge_1_d') },
            { title: t('edge_2_t'), description: t('edge_2_d') },
            { title: t('edge_3_t'), description: t('edge_3_d') },
            { title: t('edge_4_t'), description: t('edge_4_d') }
          ]"
        />

         <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <FaqSection :title="t('faq_title')" :items="faqs" />
      </div>
    </template>
  </ToolPage>
</template>

<style scoped>
.diff-output {
  overflow-wrap: anywhere;
  white-space: normal;
  backdrop-filter: blur(10px) brightness(1.1);
}

.diff-output :deep(ins),
.diff-output :deep(del) {
  border-radius: 0.4rem;
  padding: 0.1rem 0.25rem;
  text-decoration: none;
  margin: 0 0.05rem;
}

.diff-output :deep(ins) {
  background-color: color-mix(in oklab, var(--color-primary) 25%, transparent);
  color: var(--color-primary);
  font-weight: 600;
}

.diff-output :deep(del) {
  background-color: color-mix(in oklab, var(--color-error) 25%, transparent);
  color: var(--color-error);
  font-weight: 600;
  text-decoration: line-through;
}

.diff-output :deep(.diff-line-break) {
  color: color-mix(in oklab, currentColor 40%, transparent);
  font-size: 0.8em;
  padding-inline: 0.2rem;
  user-select: none;
}
</style>

<i18n lang="yaml">
{
  pt: {
    title: "Comparador de Texto",
    meta_title: "Comparador de Texto Online Grátis - Encontre Diferenças Instantaneamente",
    meta: "Compare dois textos online gratuitamente. Identifique adições, remoções e alterações em tempo real com destaque visual colorido.",
    about_desc: "Este Comparador de Texto online é a solução ideal para identificar diferenças entre duas versões de um conteúdo de forma instantânea e automática. Esqueça a revisão manual: basta inserir o texto original e a versão modificada para visualizar destaques precisos de tudo o que foi adicionado ou removido, ou para confirmar rapidamente se os textos permanecem exatamente iguais. Perfeito para revisar contratos, códigos e documentos, garantindo precisão total e privacidade, já que o processamento é realizado localmente no seu navegador.",
    features_title: "Principais Funcionalidades",
    f_1: "Comparação de texto em tempo real",
    f_2: "Destaque visual para adições e remoções",
    f_3: "Mensagem clara quando os textos são idênticos",
    f_4: "Compatível com textos longos e qualquer tipo de conteúdo",
    apps_title: "Aplicações e Casos de Uso",
    app_1_t: "Revisão editorial",
    app_1_d: "Compare rascunhos, edições e versões finais para localizar mudanças em artigos, descrições e textos institucionais.",
    app_2_t: "Programação",
    app_2_d: "Verifique diferenças em snippets de código, JSON, XML, arquivos de configuração e documentação técnica.",
    app_3_t: "SEO e conteúdo",
    app_3_d: "Acompanhe alterações em títulos, meta descriptions, headings, blocos de página e textos otimizados para busca.",
    app_4_t: "Jurídico e negócios",
    app_4_d: "Revise mudanças em contratos, políticas, propostas comerciais e termos antes da aprovação.",
    app_5_t: "Educação",
    app_5_d: "Compare versões de trabalhos, respostas, redações e documentos acadêmicos de forma simples.",
    how_to_use_title: "Como usar",
    step_1_title: "Insira o texto original",
    step_1_desc: "Insira na primeira caixa a versão inicial do conteúdo que você deseja comparar.",
    step_2_title: "Insira o texto modificado",
    step_2_desc: "Insira na segunda caixa a versão nova ou revisada do mesmo conteúdo.",
    step_3_title: "Confira as diferenças",
    step_3_desc: "Veja imediatamente os trechos removidos (em vermelho e riscados) e adicionados (em azul) para revisar as mudanças com total precisão.",
    edge_title: "Precisão e Casos Especiais",
    edge_desc: "O comparador cobre os cenários práticos mais comuns para revisão rápida de conteúdo.",
    edge_1_t: "Textos idênticos",
    edge_1_d: "A ferramenta exibe uma confirmação clara sempre que os textos forem identificados como idênticos.",
    edge_2_t: "Quebras de linha",
    edge_2_d: "As quebras de linha são preservadas no resultado para facilitar a leitura de parágrafos, listas e blocos de código.",
    edge_3_t: "Mudanças semânticas",
    edge_3_d: "O algoritmo organiza o resultado para destacar alterações relevantes, evitando uma comparação visual confusa.",
    edge_4_t: "Conteúdo colado no navegador",
    edge_4_d: "Você não precisa enviar arquivos. Basta inserir o conteúdo diretamente nas caixas de texto.",
    faq_title: "Perguntas e Respostas",
    faq1q: "Como o comparador de texto mostra as diferenças?",
    faq1a: "Ele compara as duas versões e destaca visualmente os trechos removidos e adicionados para facilitar a leitura das alterações.",
    faq2q: "Posso comparar código com esta ferramenta?",
    faq2a: "Sim. A ferramenta funciona bem para snippets, arquivos de configuração, JSON, XML e outros blocos de texto técnico.",
    faq3q: "O que acontece se os textos forem idênticos?",
    faq3a: "A ferramenta informa que os dois textos são idênticos e não há diferenças a mostrar.",
    label_original: "Texto original",
    label_modified: "Texto modificado",
    plc1: "Insira o texto original aqui",
    plc2: "Insira o texto modificado aqui",
    result: "Diferenças encontradas",
    legend_del: "Removido",
    legend_ins: "Adicionado",
    eq: "Os textos são idênticos. Nenhuma diferença encontrada.",
    see1: "Conversor de Texto",
    see2: "Gerador de Letras ASCII",
    see3: "Letras Diferentes",
    see4: "Contador de Texto",
    see_morse: "Código Morse"
  },
  en: {
    title: "Text Comparator",
    meta_title: "Free Online Text Comparator - Find Differences Instantly",
    meta: "Compare two texts online for free. Identify additions, deletions, and changes in real-time with colored visual highlighting.",
    about_desc: "This online Text Comparator is the ideal solution to identify differences between two versions of content instantly and automatically. Forget manual reviewing: just insert the original text and the modified version to view precise highlights of everything that was added or removed, or to quickly confirm if the texts remain exactly the same. Perfect for reviewing contracts, code, and documents, ensuring total accuracy and privacy, as the processing is done locally in your browser.",
    features_title: "Key Features",
    f_1: "Real-time text comparison",
    f_2: "Visual highlight for additions and deletions",
    f_3: "Clear message when texts are identical",
    f_4: "Compatible with long texts and any type of content",
    apps_title: "Applications and Use Cases",
    app_1_t: "Editorial review",
    app_1_d: "Compare drafts, edits, and final versions to locate changes in articles, descriptions, and institutional texts.",
    app_2_t: "Programming",
    app_2_d: "Check for differences in code snippets, JSON, XML, configuration files, and technical documentation.",
    app_3_t: "SEO and content",
    app_3_d: "Track changes in titles, meta descriptions, headings, page blocks, and search-optimized texts.",
    app_4_t: "Legal and business",
    app_4_d: "Review changes in contracts, policies, business proposals, and terms before approval.",
    app_5_t: "Education",
    app_5_d: "Compare versions of assignments, answers, essays, and academic documents simply.",
    how_to_use_title: "How to use",
    step_1_title: "Insert original text",
    step_1_desc: "Insert in the first box the initial version of the content you want to compare.",
    step_2_title: "Insert modified text",
    step_2_desc: "Insert in the second box the new or revised version of the same content.",
    step_3_title: "Check the differences",
    step_3_desc: "Immediately see the removed (in red and crossed out) and added (in blue) sections to review the changes with complete precision.",
    edge_title: "Accuracy and Special Cases",
    edge_desc: "The comparator covers the most common practical scenarios for fast content review.",
    edge_1_t: "Identical texts",
    edge_1_d: "The tool displays a clear confirmation whenever the texts are identified as identical.",
    edge_2_t: "Line breaks",
    edge_2_d: "Line breaks are preserved in the result to facilitate reading paragraphs, lists, and code blocks.",
    edge_3_t: "Semantic changes",
    edge_3_d: "The algorithm organizes the result to highlight relevant changes, avoiding a confusing visual comparison.",
    edge_4_t: "Content pasted in the browser",
    edge_4_d: "You don't need to send files. Just insert the content directly into the text boxes.",
    faq_title: "Questions and Answers",
    faq1q: "How does the text comparator show differences?",
    faq1a: "It compares the two versions and visually highlights the removed and added sections to make reading the changes easier.",
    faq2q: "Can I compare code with this tool?",
    faq2a: "Yes. The tool works well for snippets, configuration files, JSON, XML, and other technical text blocks.",
    faq3q: "What happens if the texts are identical?",
    faq3a: "The tool informs that the two texts are identical and there are no differences to show.",
    label_original: "Original text",
    label_modified: "Modified text",
    plc1: "Insert original text here",
    plc2: "Insert modified text here",
    result: "Differences found",
    legend_del: "Removed",
    legend_ins: "Added",
    eq: "The texts are identical. No differences found.",
    see1: "Text Converter",
    see2: "ASCII Letter Generator",
    see3: "Fancy Letters",
    see4: "Text Counter",
    see_morse: "Morse Code"
  },
  es: {
    title: "Comparador de Textos",
    meta_title: "Comparador de Textos Online Gratis - Encuentra Diferencias al Instante",
    meta: "Compara dos textos online de forma gratuita. Identifica adiciones, eliminaciones y cambios en tiempo real con resaltado visual a color.",
    about_desc: "Este Comparador de Textos online es la solución ideal para identificar diferencias entre dos versiones de un contenido de forma instantánea y automática. Olvídate de la revisión manual: solo inserta el texto original y la versión modificada para visualizar resaltados precisos de todo lo que fue añadido o eliminado, o para confirmar rápidamente si los textos siguen siendo exactamente iguales. Perfecto para revisar contratos, códigos y documentos, garantizando total precisión y privacidad, ya que el procesamiento se realiza localmente en tu navegador.",
    features_title: "Características Principales",
    f_1: "Comparación de textos en tiempo real",
    f_2: "Resaltado visual para adiciones y eliminaciones",
    f_3: "Mensaje claro cuando los textos son idénticos",
    f_4: "Compatible con textos largos y cualquier tipo de contenido",
    apps_title: "Aplicaciones y Casos de Uso",
    app_1_t: "Revisión editorial",
    app_1_d: "Compara borradores, ediciones y versiones finales para localizar cambios en artículos, descripciones y textos institucionales.",
    app_2_t: "Programación",
    app_2_d: "Verifica diferencias en fragmentos de código, JSON, XML, archivos de configuración y documentación técnica.",
    app_3_t: "SEO y contenido",
    app_3_d: "Haz un seguimiento de los cambios en títulos, meta descripciones, encabezados, bloques de página y textos optimizados para búsquedas.",
    app_4_t: "Legal y negocios",
    app_4_d: "Revisa los cambios en contratos, políticas, propuestas comerciales y términos antes de su aprobación.",
    app_5_t: "Educación",
    app_5_d: "Compara versiones de trabajos, respuestas, ensayos y documentos académicos de forma sencilla.",
    how_to_use_title: "Cómo usar",
    step_1_title: "Inserta el texto original",
    step_1_desc: "Inserta en el primer cuadro la versión inicial del contenido que deseas comparar.",
    step_2_title: "Inserta el texto modificado",
    step_2_desc: "Inserta en el segundo cuadro la versión nueva o revisada del mismo contenido.",
    step_3_title: "Revisa las diferencias",
    step_3_desc: "Mira inmediatamente las secciones eliminadas (en rojo y tachadas) y añadidas (en azul) para revisar los cambios con total precisión.",
    edge_title: "Precisión y Casos Especiales",
    edge_desc: "El comparador cubre los escenarios prácticos más comunes para la revisión rápida de contenido.",
    edge_1_t: "Textos idénticos",
    edge_1_d: "La herramienta muestra una confirmación clara siempre que los textos sean identificados como idénticos.",
    edge_2_t: "Saltos de línea",
    edge_2_d: "Los saltos de línea se mantienen en el resultado para facilitar la lectura de párrafos, listas y bloques de código.",
    edge_3_t: "Cambios semánticos",
    edge_3_d: "El algoritmo organiza el resultado para destacar las alteraciones relevantes, evitando una comparación visual confusa.",
    edge_4_t: "Contenido pegado en el navegador",
    edge_4_d: "No necesitas enviar archivos. Simplemente inserta el contenido directamente en los cuadros de texto.",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Cómo muestra las diferencias el comparador de textos?",
    faq1a: "Compara las dos versiones y resalta visualmente las secciones eliminadas y añadidas para facilitar la lectura de los cambios.",
    faq2q: "¿Puedo comparar código con esta herramienta?",
    faq2a: "Sí. La herramienta funciona bien para fragmentos, archivos de configuración, JSON, XML y otros bloques de texto técnico.",
    faq3q: "¿Qué sucede si los textos son idénticos?",
    faq3a: "La herramienta informa que los dos textos son idénticos y que no hay diferencias para mostrar.",
    label_original: "Texto original",
    label_modified: "Texto modificado",
    plc1: "Inserta el texto original aquí",
    plc2: "Inserta el texto modificado aquí",
    result: "Diferencias encontradas",
    legend_del: "Eliminado",
    legend_ins: "Añadido",
    eq: "Los textos son idénticos. No se encontraron diferencias.",
    see1: "Convertidor de Texto",
    see2: "Generador de Letras ASCII",
    see3: "Letras Diferentes",
    see4: "Contador de Texto"
  },
  fr: {
    title: "Comparateur de Texte",
    meta_title: "Comparateur de Texte en Ligne Gratuit - Trouvez les Différences Instantanément",
    meta: "Comparez deux textes en ligne gratuitement. Identifiez les ajouts, les suppressions et les modifications en temps réel avec une mise en évidence visuelle colorée.",
    about_desc: "Ce Comparateur de Texte en ligne est la solution idéale pour identifier les différences entre deux versions d'un contenu instantanément et automatiquement. Oubliez la révision manuelle : il suffit d'insérer le texte original et la version modifiée pour visualiser avec précision tout ce qui a été ajouté ou supprimé, ou pour confirmer rapidement si les textes restent exactement les mêmes. Parfait pour réviser des contrats, du code et des documents, en garantissant une précision totale et la confidentialité, car le traitement est effectué localement dans votre navigateur.",
    features_title: "Fonctionnalités Principales",
    f_1: "Comparaison de texte en temps réel",
    f_2: "Mise en évidence visuelle des ajouts et suppressions",
    f_3: "Message clair lorsque les textes sont identiques",
    f_4: "Compatible avec les textes longs et tout type de contenu",
    apps_title: "Applications et Cas d'Utilisation",
    app_1_t: "Révision éditoriale",
    app_1_d: "Comparez les brouillons, les éditions et les versions finales pour localiser les modifications dans les articles, les descriptions et les textes institutionnels.",
    app_2_t: "Programmation",
    app_2_d: "Vérifiez les différences dans les extraits de code, JSON, XML, fichiers de configuration et documentation technique.",
    app_3_t: "SEO et contenu",
    app_3_d: "Suivez les modifications des titres, des méta-descriptions, des en-têtes, des blocs de pages et des textes optimisés pour la recherche.",
    app_4_t: "Juridique et affaires",
    app_4_d: "Révisez les modifications apportées aux contrats, politiques, propositions commerciales et conditions avant approbation.",
    app_5_t: "Éducation",
    app_5_d: "Comparez simplement les versions de travaux, réponses, essais et documents académiques.",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Insérez le texte original",
    step_1_desc: "Insérez dans la première case la version initiale du contenu que vous souhaitez comparer.",
    step_2_title: "Insérez le texte modifié",
    step_2_desc: "Insérez dans la deuxième case la version nouvelle ou révisée du même contenu.",
    step_3_title: "Vérifiez les différences",
    step_3_desc: "Voyez immédiatement les sections supprimées (en rouge et barrées) et ajoutées (en bleu) pour réviser les modifications avec une précision totale.",
    edge_title: "Précision et Cas Particuliers",
    edge_desc: "Le comparateur couvre les scénarios pratiques les plus courants pour une révision rapide du contenu.",
    edge_1_t: "Textes identiques",
    edge_1_d: "L'outil affiche une confirmation claire chaque fois que les textes sont identifiés comme identiques.",
    edge_2_t: "Sauts de ligne",
    edge_2_d: "Les sauts de ligne sont conservés dans le résultat pour faciliter la lecture des paragraphes, des listes et des blocs de code.",
    edge_3_t: "Modifications sémantiques",
    edge_3_d: "L'algorithme organise le résultat pour mettre en évidence les modifications pertinentes, évitant ainsi une comparaison visuelle confuse.",
    edge_4_t: "Contenu collé dans le navigateur",
    edge_4_d: "Vous n'avez pas besoin d'envoyer de fichiers. Insérez simplement le contenu directement dans les zones de texte.",
    faq_title: "Questions et Réponses",
    faq1q: "Comment le comparateur de texte montre-t-il les différences ?",
    faq1a: "Il compare les deux versions et met en évidence visuellement les sections supprimées et ajoutées pour faciliter la lecture des modifications.",
    faq2q: "Puis-je comparer du code avec cet outil ?",
    faq2a: "Oui. L'outil fonctionne bien pour les extraits, les fichiers de configuration, JSON, XML et autres blocs de texte technique.",
    faq3q: "Que se passe-t-il si les textes sont identiques ?",
    faq3a: "L'outil informe que les deux textes sont identiques et qu'il n'y a aucune différence à montrer.",
    label_original: "Texte original",
    label_modified: "Texte modifié",
    plc1: "Insérez le texte original ici",
    plc2: "Insérez le texte modifié ici",
    result: "Différences trouvées",
    legend_del: "Supprimé",
    legend_ins: "Ajouté",
    eq: "Les textes sont identiques. Aucune différence trouvée.",
    see1: "Convertisseur de Texte",
    see2: "Générateur de Lettres ASCII",
    see3: "Lettres Différentes",
    see4: "Compteur de Texte"
  },
  it: {
    title: "Comparatore di Testo",
    meta_title: "Comparatore di Testo Online Gratis - Trova Differenze Istantaneamente",
    meta: "Confronta due testi online gratuitamente. Identifica aggiunte, rimozioni e modifiche in tempo reale con un'evidenziazione visiva a colori.",
    about_desc: "Questo Comparatore di Testo online è la soluzione ideale per identificare le differenze tra due versioni di un contenuto in modo istantaneo e automatico. Dimentica la revisione manuale: basta inserire il testo originale e la versione modificata per visualizzare con precisione tutto ciò che è stato aggiunto o rimosso, oppure per confermare rapidamente se i testi rimangono esattamente gli stessi. Perfetto per la revisione di contratti, codice e documenti, garantendo totale precisione e privacy, poiché l'elaborazione avviene localmente nel tuo browser.",
    features_title: "Funzionalità Principali",
    f_1: "Confronto del testo in tempo reale",
    f_2: "Evidenziazione visiva per aggiunte e rimozioni",
    f_3: "Messaggio chiaro quando i testi sono identici",
    f_4: "Compatibile con testi lunghi e qualsiasi tipo di contenuto",
    apps_title: "Applicazioni e Casi d'Uso",
    app_1_t: "Revisione editoriale",
    app_1_d: "Confronta bozze, modifiche e versioni finali per individuare i cambiamenti in articoli, descrizioni e testi istituzionali.",
    app_2_t: "Programmazione",
    app_2_d: "Verifica le differenze nei frammenti di codice, JSON, XML, file di configurazione e documentazione tecnica.",
    app_3_t: "SEO e contenuti",
    app_3_d: "Tieni traccia delle modifiche in titoli, meta descrizioni, intestazioni, blocchi di pagina e testi ottimizzati per la ricerca.",
    app_4_t: "Legale e affari",
    app_4_d: "Rivedi le modifiche a contratti, politiche, proposte commerciali e termini prima dell'approvazione.",
    app_5_t: "Istruzione",
    app_5_d: "Confronta semplicemente versioni di compiti, risposte, saggi e documenti accademici.",
    how_to_use_title: "Come usare",
    step_1_title: "Inserisci il testo originale",
    step_1_desc: "Inserisci nel primo riquadro la versione iniziale del contenuto che desideri confrontare.",
    step_2_title: "Inserisci il testo modificato",
    step_2_desc: "Inserisci nel secondo riquadro la versione nuova o revisionata dello stesso contenuto.",
    step_3_title: "Controlla le differenze",
    step_3_desc: "Visualizza immediatamente le sezioni rimosse (in rosso e barrate) e aggiunte (in blu) per rivedere le modifiche con totale precisione.",
    edge_title: "Precisione e Casi Speciali",
    edge_desc: "Il comparatore copre gli scenari pratici più comuni per una rapida revisione dei contenuti.",
    edge_1_t: "Testi identici",
    edge_1_d: "Lo strumento mostra una chiara conferma ogni volta che i testi vengono identificati come identici.",
    edge_2_t: "Interruzioni di riga",
    edge_2_d: "Le interruzioni di riga vengono mantenute nel risultato per facilitare la lettura di paragrafi, elenchi e blocchi di codice.",
    edge_3_t: "Cambiamenti semantici",
    edge_3_d: "L'algoritmo organizza il risultato per evidenziare le modifiche rilevanti, evitando un confronto visivo confuso.",
    edge_4_t: "Contenuto incollato nel browser",
    edge_4_d: "Non hai bisogno di inviare file. Basta inserire il contenuto direttamente nelle caselle di testo.",
    faq_title: "Domande e Risposte",
    faq1q: "Come mostra le differenze il comparatore di testo?",
    faq1a: "Confronta le due versioni ed evidenzia visivamente le sezioni rimosse e aggiunte per facilitare la lettura delle modifiche.",
    faq2q: "Posso confrontare il codice con questo strumento?",
    faq2a: "Sì. Lo strumento funziona bene per frammenti di codice, file di configurazione, JSON, XML e altri blocchi di testo tecnico.",
    faq3q: "Cosa succede se i testi sono identici?",
    faq3a: "Lo strumento informa che i due testi sono identici e non ci sono differenze da mostrare.",
    label_original: "Testo originale",
    label_modified: "Testo modificato",
    plc1: "Inserisci il testo originale qui",
    plc2: "Inserisci il testo modificato qui",
    result: "Differenze trovate",
    legend_del: "Rimosso",
    legend_ins: "Aggiunto",
    eq: "I testi sono identici. Nessuna differenza trovata.",
    see1: "Convertitore di Testo",
    see2: "Generatore di Lettere ASCII",
    see3: "Lettere Diverse",
    see4: "Contatore di Testo"
  },
  id: {
    title: "Komparator Teks",
    meta_title: "Komparator Teks Online Gratis - Temukan Perbedaan Seketika",
    meta: "Bandingkan dua teks secara online gratis. Identifikasi penambahan, penghapusan, dan perubahan secara real-time dengan penyorotan visual berwarna.",
    about_desc: "Komparator Teks online ini adalah solusi ideal untuk mengidentifikasi perbedaan antara dua versi konten secara instan dan otomatis. Lupakan revisi manual: cukup masukkan teks asli dan versi yang dimodifikasi untuk melihat sorotan yang tepat dari semua yang ditambahkan atau dihapus, atau untuk mengonfirmasi dengan cepat apakah teks tetap sama persis. Sempurna untuk meninjau kontrak, kode, dan dokumen, memastikan keakuratan dan privasi total, karena pemrosesan dilakukan secara lokal di browser Anda.",
    features_title: "Fitur Utama",
    f_1: "Perbandingan teks secara real-time",
    f_2: "Sorotan visual untuk penambahan dan penghapusan",
    f_3: "Pesan yang jelas saat teks identik",
    f_4: "Kompatibel dengan teks panjang dan semua jenis konten",
    apps_title: "Aplikasi dan Kasus Penggunaan",
    app_1_t: "Tinjauan editorial",
    app_1_d: "Bandingkan draf, suntingan, dan versi akhir untuk menemukan perubahan dalam artikel, deskripsi, dan teks institusional.",
    app_2_t: "Pemrograman",
    app_2_d: "Periksa perbedaan dalam potongan kode, JSON, XML, file konfigurasi, dan dokumentasi teknis.",
    app_3_t: "SEO dan konten",
    app_3_d: "Lacak perubahan pada judul, deskripsi meta, tajuk, blok halaman, dan teks yang dioptimalkan untuk pencarian.",
    app_4_t: "Hukum dan bisnis",
    app_4_d: "Tinjau perubahan dalam kontrak, kebijakan, proposal bisnis, dan persyaratan sebelum persetujuan.",
    app_5_t: "Pendidikan",
    app_5_d: "Bandingkan versi tugas, jawaban, esai, dan dokumen akademik dengan mudah.",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Masukkan teks asli",
    step_1_desc: "Masukkan ke dalam kotak pertama versi awal konten yang ingin Anda bandingkan.",
    step_2_title: "Masukkan teks yang dimodifikasi",
    step_2_desc: "Masukkan ke dalam kotak kedua versi baru atau yang direvisi dari konten yang sama.",
    step_3_title: "Periksa perbedaannya",
    step_3_desc: "Segera lihat bagian yang dihapus (dengan warna merah dan dicoret) dan ditambahkan (dengan warna biru) untuk meninjau perubahan dengan presisi penuh.",
    edge_title: "Akurasi dan Kasus Khusus",
    edge_desc: "Komparator mencakup skenario praktis yang paling umum untuk tinjauan konten yang cepat.",
    edge_1_t: "Teks identik",
    edge_1_d: "Alat ini menampilkan konfirmasi yang jelas setiap kali teks diidentifikasi sebagai identik.",
    edge_2_t: "Jeda baris",
    edge_2_d: "Jeda baris dipertahankan dalam hasil untuk memudahkan membaca paragraf, daftar, dan blok kode.",
    edge_3_t: "Perubahan semantik",
    edge_3_d: "Algoritme mengatur hasil untuk menyoroti perubahan yang relevan, menghindari perbandingan visual yang membingungkan.",
    edge_4_t: "Konten ditempel di browser",
    edge_4_d: "Anda tidak perlu mengirim file. Cukup masukkan konten langsung ke dalam kotak teks.",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Bagaimana komparator teks menunjukkan perbedaan?",
    faq1a: "Alat ini membandingkan dua versi dan menyoroti secara visual bagian yang dihapus dan ditambahkan untuk memudahkan membaca perubahan.",
    faq2q: "Bisakah saya membandingkan kode dengan alat ini?",
    faq2a: "Ya. Alat ini berfungsi dengan baik untuk potongan, file konfigurasi, JSON, XML, dan blok teks teknis lainnya.",
    faq3q: "Apa yang terjadi jika teksnya identik?",
    faq3a: "Alat ini menginformasikan bahwa kedua teks itu identik dan tidak ada perbedaan yang harus ditunjukkan.",
    label_original: "Teks asli",
    label_modified: "Teks yang dimodifikasi",
    plc1: "Masukkan teks asli di sini",
    plc2: "Masukkan teks yang dimodifikasi di sini",
    result: "Perbedaan ditemukan",
    legend_del: "Dihapus",
    legend_ins: "Ditambahkan",
    eq: "Teks identik. Tidak ada perbedaan yang ditemukan.",
    see1: "Konverter Teks",
    see2: "Pembuat Huruf ASCII",
    see3: "Huruf Keren",
    see4: "Penghitung Teks"
  },
  de: {
    title: "Text-Vergleicher",
    meta_title: "Kostenloser Online-Textvergleicher - Unterschiede sofort finden",
    meta: "Vergleichen Sie zwei Texte online kostenlos. Identifizieren Sie Hinzufügungen, Löschungen und Änderungen in Echtzeit mit farbiger visueller Hervorhebung.",
    about_desc: "Dieser Online-Text-Vergleicher ist die ideale Lösung, um Unterschiede zwischen zwei Versionen eines Inhalts sofort und automatisch zu erkennen. Vergessen Sie die manuelle Überprüfung: Fügen Sie einfach den Originaltext und die geänderte Version ein, um genaue Hervorhebungen von allem zu sehen, was hinzugefügt oder entfernt wurde, oder um schnell zu bestätigen, ob die Texte genau gleich geblieben sind. Perfekt für die Überprüfung von Verträgen, Code und Dokumenten, um absolute Genauigkeit und Datenschutz zu gewährleisten, da die Verarbeitung lokal in Ihrem Browser erfolgt.",
    features_title: "Hauptmerkmale",
    f_1: "Textvergleich in Echtzeit",
    f_2: "Visuelle Hervorhebung für Ergänzungen und Löschungen",
    f_3: "Klare Nachricht, wenn Texte identisch sind",
    f_4: "Kompatibel mit langen Texten und jeder Art von Inhalt",
    apps_title: "Anwendungen und Anwendungsfälle",
    app_1_t: "Redaktionelle Überprüfung",
    app_1_d: "Vergleichen Sie Entwürfe, Bearbeitungen und Endversionen, um Änderungen in Artikeln, Beschreibungen und institutionellen Texten zu finden.",
    app_2_t: "Programmierung",
    app_2_d: "Überprüfen Sie Unterschiede in Code-Snippets, JSON, XML, Konfigurationsdateien und technischer Dokumentation.",
    app_3_t: "SEO und Inhalt",
    app_3_d: "Verfolgen Sie Änderungen an Titeln, Meta-Beschreibungen, Überschriften, Seitenblöcken und suchoptimierten Texten.",
    app_4_t: "Recht und Wirtschaft",
    app_4_d: "Überprüfen Sie Änderungen in Verträgen, Richtlinien, Geschäftsvorschlägen und Bedingungen vor der Genehmigung.",
    app_5_t: "Bildung",
    app_5_d: "Vergleichen Sie ganz einfach Versionen von Aufgaben, Antworten, Aufsätzen und akademischen Dokumenten.",
    how_to_use_title: "Wie man es benutzt",
    step_1_title: "Originaltext einfügen",
    step_1_desc: "Fügen Sie in das erste Feld die ursprüngliche Version des Inhalts ein, den Sie vergleichen möchten.",
    step_2_title: "Geänderten Text einfügen",
    step_2_desc: "Fügen Sie in das zweite Feld die neue oder überarbeitete Version desselben Inhalts ein.",
    step_3_title: "Unterschiede prüfen",
    step_3_desc: "Sehen Sie sofort die entfernten (rot und durchgestrichen) und hinzugefügten (blau) Abschnitte, um die Änderungen mit absoluter Präzision zu überprüfen.",
    edge_title: "Genauigkeit und Sonderfälle",
    edge_desc: "Der Vergleicher deckt die häufigsten praktischen Szenarien für eine schnelle Inhaltsüberprüfung ab.",
    edge_1_t: "Identische Texte",
    edge_1_d: "Das Tool zeigt eine klare Bestätigung an, wenn die Texte als identisch erkannt werden.",
    edge_2_t: "Zeilenumbrüche",
    edge_2_d: "Zeilenumbrüche bleiben im Ergebnis erhalten, um das Lesen von Absätzen, Listen und Codeblöcken zu erleichtern.",
    edge_3_t: "Semantische Änderungen",
    edge_3_d: "Der Algorithmus organisiert das Ergebnis, um relevante Änderungen hervorzuheben und einen verwirrenden visuellen Vergleich zu vermeiden.",
    edge_4_t: "Im Browser eingefügter Inhalt",
    edge_4_d: "Sie müssen keine Dateien senden. Fügen Sie den Inhalt einfach direkt in die Textfelder ein.",
    faq_title: "Fragen und Antworten",
    faq1q: "Wie zeigt der Textvergleicher Unterschiede an?",
    faq1a: "Er vergleicht die beiden Versionen und hebt die entfernten und hinzugefügten Abschnitte visuell hervor, um das Lesen der Änderungen zu erleichtern.",
    faq2q: "Kann ich mit diesem Tool Code vergleichen?",
    faq2a: "Ja. Das Tool funktioniert gut für Snippets, Konfigurationsdateien, JSON, XML und andere technische Textblöcke.",
    faq3q: "Was passiert, wenn die Texte identisch sind?",
    faq3a: "Das Tool informiert darüber, dass die beiden Texte identisch sind und es keine Unterschiede gibt.",
    label_original: "Originaltext",
    label_modified: "Geänderter Text",
    plc1: "Originaltext hier einfügen",
    plc2: "Geänderten Text hier einfügen",
    result: "Gefundene Unterschiede",
    legend_del: "Entfernt",
    legend_ins: "Hinzugefügt",
    eq: "Die Texte sind identisch. Keine Unterschiede gefunden.",
    see1: "Textkonverter",
    see2: "ASCII-Buchstaben-Generator",
    see3: "Ausgefallene Buchstaben",
    see4: "Textzähler"
  },
  nl: {
    title: "Tekstvergelijker",
    meta_title: "Gratis Online Tekstvergelijker - Vind Verschillen Direct",
    meta: "Vergelijk twee teksten online gratis. Identificeer toevoegingen, verwijderingen en wijzigingen in realtime met gekleurde visuele markeringen.",
    about_desc: "Deze online Tekstvergelijker is de ideale oplossing om direct en automatisch verschillen te identificeren tussen twee versies van een inhoud. Vergeet handmatige controle: voeg eenvoudig de originele tekst en de gewijzigde versie in om nauwkeurige markeringen te zien van alles wat is toegevoegd of verwijderd, of om snel te bevestigen of de teksten precies hetzelfde zijn gebleven. Perfect voor het beoordelen contracten, code en documenten, met gegarandeerde nauwkeurigheid en privacy, aangezien de verwerking lokaal in uw browser plaatsvindt.",
    features_title: "Belangrijkste Kenmerken",
    f_1: "Realtime tekstvergelijking",
    f_2: "Visuele markering voor toevoegingen en verwijderingen",
    f_3: "Duidelijke melding wanneer teksten identiek zijn",
    f_4: "Compatibel met lange teksten en elk type inhoud",
    apps_title: "Toepassingen en Gebruiksscenario's",
    app_1_t: "Redactionele controle",
    app_1_d: "Vergelijk concepten, bewerkingen en eindversies om wijzigingen in artikelen, beschrijvingen en institutionele teksten te vinden.",
    app_2_t: "Programmeren",
    app_2_d: "Controleer verschillen in codefragmenten, JSON, XML, configuratiebestanden en technische documentatie.",
    app_3_t: "SEO en inhoud",
    app_3_d: "Volg wijzigingen in titels, metabeschrijvingen, koppen, paginablokken en voor zoeken geoptimaliseerde teksten.",
    app_4_t: "Juridisch en zakelijk",
    app_4_d: "Beoordeel wijzigingen in contracten, beleid, zakelijke voorstellen en voorwaarden vóór goedkeuring.",
    app_5_t: "Onderwijs",
    app_5_d: "Vergelijk eenvoudig versies van opdrachten, antwoorden, essays en academische documenten.",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Voer de originele tekst in",
    step_1_desc: "Voer in het eerste vak de initiële versie in van de inhoud die u wilt vergelijken.",
    step_2_title: "Voer de gewijzigde tekst in",
    step_2_desc: "Voer in het tweede vak de nieuwe of herziene versie van dezelfde inhoud in.",
    step_3_title: "Controleer de verschillen",
    step_3_desc: "Bekijk onmiddellijk de verwijderde (in rood en doorgestreept) en toegevoegde (in blauw) secties om de wijzigingen met volledige precisie te beoordelen.",
    edge_title: "Nauwkeurigheid en Speciale Gevallen",
    edge_desc: "De vergelijker dekt de meest voorkomende praktische scenario's voor een snelle inhoudscontrole.",
    edge_1_t: "Identieke teksten",
    edge_1_d: "De tool toont een duidelijke bevestiging wanneer de teksten als identiek worden geïdentificeerd.",
    edge_2_t: "Regelovergangen",
    edge_2_d: "Regelovergangen blijven in het resultaat behouden om het lezen van alinea's, lijsten en codeblokken te vergemakkelijken.",
    edge_3_t: "Semantische wijzigingen",
    edge_3_d: "Het algoritme organiseert het resultaat om relevante wijzigingen te markeren, waardoor een verwarrende visuele vergelijking wordt voorkomen.",
    edge_4_t: "Inhoud geplakt in de browser",
    edge_4_d: "U hoeft geen bestanden te verzenden. Voer de inhoud gewoon rechtstreeks in de tekstvakken in.",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Hoe toont de tekstvergelijker verschillen?",
    faq1a: "Het vergelijkt de twee versies en markeert visueel de verwijderde en toegevoegde secties om het lezen van de wijzigingen te vergemakkelijken.",
    faq2q: "Kan ik code vergelijken met deze tool?",
    faq2a: "Ja. De tool werkt goed voor fragmenten, configuratiebestanden, JSON, XML en andere technische tekstblokken.",
    faq3q: "Wat gebeurt er als de teksten identiek zijn?",
    faq3a: "De tool meldt dat de twee teksten identiek zijn en dat er geen verschillen zijn om te tonen.",
    label_original: "Originele tekst",
    label_modified: "Gewijzigde tekst",
    plc1: "Voer hier de originele tekst in",
    plc2: "Voer hier de gewijzigde tekst in",
    result: "Gevonden verschillen",
    legend_del: "Verwijderd",
    legend_ins: "Toegevoegd",
    eq: "De teksten zijn identiek. Geen verschillen gevonden.",
    see1: "Tekstconverter",
    see2: "ASCII-lettergenerator",
    see3: "Luxe Letters",
    see4: "Tekstteller"
  }
}
</i18n>
