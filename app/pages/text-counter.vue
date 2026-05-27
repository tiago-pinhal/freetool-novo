<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

const { t } = useI18n({ useScope: 'local' })

const faqs = computed(() => [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') }
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f_1'),
    t('f_2'),
    t('f_3'),
    t('f_4')
  ],
  faq: faqs.value
})

useHead({
  title: t('meta_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

interface State { 
  text: string; 
  words: number; 
  paragraphs: number; 
  lines: number; 
  chars: number; 
  all: number; 
  ads: boolean; 
}
const state: State = reactive({ 
  text: '', 
  words: 0, 
  paragraphs: 0, 
  lines: 0, 
  chars: 0, 
  all: 0, 
  ads: false 
})

function updateCounts() {
    if (import.meta.client && (window as any).Countable) {
        (window as any).Countable.count(state.text, (totals: any) => {
            state.words = totals.words;
            state.paragraphs = totals.paragraphs;
            state.lines = state.text !== '' ? state.text.split(/\r\n|\r|\n/).length : 0;
            state.chars = totals.characters;
            state.all = totals.all;

            if (!state.ads && state.words) {
                state.ads = true;
            }
        })
    }
}

useScript('https://cdn.jsdelivr.net/npm/countable@3.0.1/Countable.js', { trigger: 'client' }).onLoaded(() => {
    updateCounts();
})

watch(() => state.text, () => {
    updateCounts();
})

// Localized Routes
defineI18nRoute({
  paths: {
    en: '/text-counter',
    pt: '/contador-de-texto',
    es: '/contador-de-texto',
    fr: '/compteur-de-texte',
    it: '/contatore-di-testo',
    id: '/penghitung-teks',
    de: '/text-zaehler',
    nl: '/tekstteller',
    ru: '/schetchik-teksta'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('converter'), to: 'text-converter' },
      { label: t('ascii'), to: 'ascii-letter-generator' },
      { label: t('fancy'), to: 'fancy-letters' },
      { label: t('generator'), to: 'text-generator' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Input Area -->
      <div class="form-control w-full">
        <textarea 
          id="txt"
          v-model="state.text"
          rows="8"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-lg leading-relaxed" 
          :placeholder="t('plc')"
          autofocus
        ></textarea>
      </div>

      <!-- Result Area (Stats) -->
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-content/10 bg-base-200">
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('words') }}</div>
          <div class="stat-value text-primary">{{ state.words }}</div>
        </div>
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('chars') }}</div>
          <div class="stat-value text-primary">{{ state.chars }}</div>
        </div>
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('chars') }} ({{ t('all') }})</div>
          <div class="stat-value text-primary">{{ state.all }}</div>
        </div>
        <div class="stat text-center lg:border-r lg:border-base-content/10 border-b lg:border-b-0 border-base-content/10">
          <div class="stat-title whitespace-normal">{{ t('paragraphs') }}</div>
          <div class="stat-value text-primary">{{ state.paragraphs }}</div>
        </div>
        <div class="stat text-center">
          <div class="stat-title whitespace-normal">{{ t('lines') }}</div>
          <div class="stat-value text-primary">{{ state.lines }}</div>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <p class="text-base-content/80 leading-relaxed">{{ t('about_desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
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

<i18n lang="yaml">
{
  pt: {
    title: "Contador de Texto",
    meta_title: "Contador de Caracteres e Palavras Online — Linhas e Parágrafos",
    ogLocale: "pt_BR",
    meta: "Contador de caracteres e palavras online grátis. Conte caracteres com e sem espaços, palavras, linhas e parágrafos em tempo real.",
    about_desc: "Este contador de caracteres e palavras gratuito permite analisar e contar palavras, caracteres, linhas e parágrafos com rapidez e precisão diretamente no seu navegador. Com processamento em tempo real, você acompanha instantaneamente métricas essenciais do seu conteúdo e garante que seu texto esteja dentro dos limites exigidos para SEO, redes sociais, trabalhos acadêmicos e produção de texto no dia a dia.",
    how_to_use_title: "Como usar o Contador de Texto",
    step_1_title: "Insira o seu texto",
    step_1_desc: "Digite ou cole o conteúdo que você deseja analisar.",
    step_2_title: "Veja os resultados",
    step_2_desc: "Os totais de palavras, caracteres, linhas e parágrafos são atualizados instantaneamente enquanto você digita ou cola o texto.",
    step_3_title: "Analise as métricas",
    step_3_desc: "Use as estatísticas em tempo real para validar limites de conteúdo e atender critérios de SEO, redes sociais e trabalhos acadêmicos.",
    apps_title: "Aplicações e Casos de Uso",
    app_1_t: "Redação para SEO",
    app_1_d: "Otimize títulos e meta descriptions mantendo-os dentro dos limites ideais de caracteres para mecanismos de busca.",
    app_2_t: "Redes Sociais",
    app_2_d: "Garanta que seus posts caibam nos limites de plataformas como X (Twitter), Instagram, LinkedIn e WhatsApp.",
    app_3_t: "Trabalhos Acadêmicos",
    app_3_d: "Acompanhe a contagem exata de palavras e parágrafos para redações, artigos, teses e relatórios escolares.",
    app_4_t: "Copy de Marketing",
    app_4_d: "Valide o tamanho de anúncios, chamadas, e-mails e textos para landing pages com precisão.",
    app_5_t: "Edição e Revisão",
    app_5_d: "Compare versões de um texto e controle a expansão ou redução de conteúdo de forma prática.",
    edge_title: "Precisão e Casos Especiais",
    edge_desc: "Este contador de texto foi pensado para mostrar com clareza as métricas que mais importam no dia a dia.",
    edge_1_t: "Caracteres com e sem espaços",
    edge_1_d: "Exibimos os dois totais porque cada plataforma define 'caractere' de forma diferente. Por exemplo, algumas contam espaços e outras não.",
    edge_2_t: "Contagem de linhas",
    edge_2_d: "Útil para formulários, roteiros e redações com limite por linha.",
    edge_3_t: "Contagem de parágrafos",
    edge_3_d: "Ajuda a verificar a estrutura de artigos, posts e textos formatados.",
    edge_4_t: "Atualização em tempo real",
    edge_4_d: "Os totais mudam automaticamente enquanto você digita ou cola um texto.",
    faq_title: "Perguntas e Respostas",
    faq1q: "Qual a diferença entre caracteres e caracteres com espaços?",
    faq1a: "Caracteres normalmente contam letras, números e pontuação sem incluir espaços. Já caracteres com espaços somam também os espaços em branco no total.",
    faq2q: "O contador funciona com textos em outros idiomas?",
    faq2a: "Sim. A ferramenta funciona com qualquer idioma que use espaços para separar palavras, como inglês, espanhol, francês, alemão e outros. A contagem de caracteres independe do idioma.",
    faq3q: "Há limite de tamanho de texto que posso analisar?",
    faq3a: "Não. Não há limite imposto pela ferramenta. O processamento é feito diretamente no seu navegador, então você pode colar textos longos como artigos, teses ou scripts sem restrição.",
    features_title: "Principais Funcionalidades",
    f_1: "Contador de palavras",
    f_2: "Contador de caracteres com e sem espaços",
    f_3: "Contador de parágrafos e linhas",
    f_4: "Resultados em tempo real",
    plc: "Digite ou cole seu texto aqui para contar palavras e caracteres...",
    words: "Palavras",
    paragraphs: "Parágrafos",
    lines: "Linhas",
    chars: "Caracteres",
    all: "com espaços",
    converter: "Conversor de Texto",
    ascii: "Gerador de Letras ASCII",
    fancy: "Letras Diferentes",
    generator: "Gerador de Texto"
  },
  en: {
    title: "Text Counter",
    meta_title: "Word & Character Counter Online — Count Words, Lines and Paragraphs",
    ogLocale: "en_US",
    meta: "Free online word counter and character counter. Count words, characters with and without spaces, lines and paragraphs in real time.",
    about_desc: "This free word counter and character counter lets you analyze and count words, characters, lines, and paragraphs quickly and accurately right in your browser. With real-time processing, you can instantly track essential metrics for your content and ensure your text stays within the required limits for SEO, social media, academic work, and everyday writing.",
    how_to_use_title: "How to use the Text Counter",
    step_1_title: "Enter your text",
    step_1_desc: "Type or paste the content you want to analyze.",
    step_2_title: "See the results",
    step_2_desc: "The totals for words, characters, lines, and paragraphs update instantly as you type or paste text.",
    step_3_title: "Analyze the metrics",
    step_3_desc: "Use real-time statistics to validate content limits and meet criteria for SEO, social networks, and academic work.",
    apps_title: "Applications and Use Cases",
    app_1_t: "SEO Writing",
    app_1_d: "Optimize titles and meta descriptions by keeping them within ideal character limits for search engines.",
    app_2_t: "Social Media",
    app_2_d: "Ensure your posts fit the limits of platforms like X (Twitter), Instagram, LinkedIn, and WhatsApp.",
    app_3_t: "Academic Work",
    app_3_d: "Keep track of exact word and paragraph counts for essays, articles, theses, and school reports.",
    app_4_t: "Marketing Copy",
    app_4_d: "Validate the size of ads, headlines, emails, and landing page copy with precision.",
    app_5_t: "Editing and Proofreading",
    app_5_d: "Compare text versions and manage content expansion or reduction practically.",
    edge_title: "Precision and Special Cases",
    edge_desc: "This text counter is designed to clearly show the metrics that matter most day-to-day.",
    edge_1_t: "Characters with and without spaces",
    edge_1_d: "We display both totals because each platform defines a 'character' differently. For instance, some count spaces while others don't.",
    edge_2_t: "Line count",
    edge_2_d: "Useful for forms, scripts, and essays with line limits.",
    edge_3_t: "Paragraph count",
    edge_3_d: "Helps you verify the structure of articles, posts, and formatted texts.",
    edge_4_t: "Real-time updates",
    edge_4_d: "Totals change automatically as you type or paste text.",
    faq_title: "Questions and Answers",
    faq1q: "What is the difference between characters and characters with spaces?",
    faq1a: "Characters normally count letters, numbers, and punctuation without including spaces. Characters with spaces also add blank spaces to the total.",
    faq2q: "Does the counter work with texts in other languages?",
    faq2a: "Yes. The tool works with any language that uses spaces to separate words, such as English, Spanish, French, German, and others. Character counting is language-independent.",
    faq3q: "Is there a limit to the size of text I can analyze?",
    faq3a: "No. There is no limit imposed by the tool. Processing is done directly in your browser, so you can paste long texts like articles, theses, or scripts without restriction.",
    features_title: "Main Features",
    f_1: "Word counter",
    f_2: "Character counter with and without spaces",
    f_3: "Paragraph and line counter",
    f_4: "Real-time results",
    plc: "Type or paste your text here to count words and characters...",
    words: "Words",
    paragraphs: "Paragraphs",
    lines: "Lines",
    chars: "Characters",
    all: "with spaces",
    converter: "Text Converter",
    ascii: "ASCII Letter Generator",
    fancy: "Fancy Letters",
    generator: "Text Generator"
  },
  es: {
    title: "Contador de Texto",
    meta_title: "Contador de Caracteres y Palabras Online — Líneas y Párrafos",
    ogLocale: "es_ES",
    meta: "Contador de caracteres y palabras online gratis. Cuenta caracteres con y sin espacios, palabras, líneas y párrafos en tiempo real.",
    about_desc: "Este contador de caracteres y palabras gratuito te permite analizar y contar palabras, caracteres, líneas y párrafos con rapidez y precisión directamente en tu navegador. Con el procesamiento en tiempo real, puedes monitorear instantáneamente métricas esenciales de tu contenido y asegurarte de que tu texto cumpla con los límites exigidos para SEO, redes sociales, trabajos académicos y redacción diaria.",
    how_to_use_title: "Cómo usar el Contador de Texto",
    step_1_title: "Ingresa tu texto",
    step_1_desc: "Escribe o pega el contenido que deseas analizar.",
    step_2_title: "Mira los resultados",
    step_2_desc: "Los totales de palabras, caracteres, líneas y párrafos se actualizan al instante mientras escribes o pegas el texto.",
    step_3_title: "Analiza las métricas",
    step_3_desc: "Usa las estadísticas en tiempo real para validar los límites de contenido y cumplir con los criterios de SEO, redes sociales y trabajos académicos.",
    apps_title: "Aplicaciones y Casos de Uso",
    app_1_t: "Redacción para SEO",
    app_1_d: "Optimiza títulos y meta descripciones manteniéndolos dentro de los límites ideales de caracteres para los motores de búsqueda.",
    app_2_t: "Redes Sociales",
    app_2_d: "Asegúrate de que tus publicaciones se ajusten a los límites de plataformas como X (Twitter), Instagram, LinkedIn y WhatsApp.",
    app_3_t: "Trabajos Académicos",
    app_3_d: "Mantén un registro del recuento exacto de palabras y párrafos para ensayos, artículos, tesis y reportes escolares.",
    app_4_t: "Copy de Marketing",
    app_4_d: "Valida el tamaño de los anuncios, titulares, correos electrónicos y textos de landing pages con precisión.",
    app_5_t: "Edición y Revisión",
    app_5_d: "Compara versiones de texto y controla la expansión o reducción de contenido de manera práctica.",
    edge_title: "Precisión y Casos Especiales",
    edge_desc: "Este contador de texto está diseñado para mostrar claramente las métricas que más importan en el día a día.",
    edge_1_t: "Caracteres con y sin espacios",
    edge_1_d: "Mostramos ambos totales porque cada plataforma define un 'carácter' de manera diferente. Por ejemplo, algunas cuentan los espacios y otras no.",
    edge_2_t: "Conteo de líneas",
    edge_2_d: "Útil para formularios, guiones y ensayos con límites de líneas.",
    edge_3_t: "Conteo de párrafos",
    edge_3_d: "Te ayuda a verificar la estructura de artículos, publicaciones y textos formateados.",
    edge_4_t: "Actualización en tiempo real",
    edge_4_d: "Los totales cambian automáticamente mientras escribes o pegas un texto.",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Cuál es la diferencia entre caracteres y caracteres con espacios?",
    faq1a: "Los caracteres normalmente cuentan letras, números y puntuación sin incluir los espacios. Los caracteres con espacios también suman los espacios en blanco al total.",
    faq2q: "¿El contador funciona con textos en otros idiomas?",
    faq2a: "Sí. La herramienta funciona con cualquier idioma que use espacios para separar palabras, como inglés, español, francés, alemán y otros. El recuento de caracteres es independiente del idioma.",
    faq3q: "¿Existe un límite de tamaño para el texto que puedo analizar?",
    faq3a: "No. La herramienta no impone ningún límite. El procesamiento se realiza directamente en tu navegador, por lo que puedes pegar textos extensos como artículos, tesis o guiones sin restricción.",
    features_title: "Funcionalidades Principales",
    f_1: "Contador de palabras",
    f_2: "Contador de caracteres con y sin espacios",
    f_3: "Contador de párrafos y líneas",
    f_4: "Resultados en tiempo real",
    plc: "Escribe o pega tu texto aquí para contar palabras y caracteres...",
    words: "Palabras",
    paragraphs: "Párrafos",
    lines: "Líneas",
    chars: "Caracteres",
    all: "con espacios",
    converter: "Convertidor de Texto",
    ascii: "Generador de Letras ASCII",
    fancy: "Letras Raras",
    generator: "Generador de Texto"
  },
  fr: {
    title: "Compteur de Texte",
    meta_title: "Compteur de Mots et Caractères en Ligne — Lignes et Paragraphes",
    ogLocale: "fr_FR",
    meta: "Compteur de mots et de caractères en ligne gratuit. Comptez les caractères avec et sans espaces, les mots, lignes et paragraphes en temps réel.",
    about_desc: "Ce compteur de mots et de caractères gratuit vous permet d'analyser et de compter les mots, caractères, lignes et paragraphes avec rapidité et précision, directement dans votre navigateur. Avec un traitement en temps réel, vous pouvez suivre instantanément les métriques essentielles de votre contenu et vous assurer que votre texte respecte les limites exigées pour le SEO, les réseaux sociaux, les travaux académiques et la rédaction quotidienne.",
    how_to_use_title: "Comment utiliser le Compteur de Texte",
    step_1_title: "Insérez votre texte",
    step_1_desc: "Tapez ou collez le contenu que vous souhaitez analyser.",
    step_2_title: "Voir les résultats",
    step_2_desc: "Les totaux des mots, caractères, lignes et paragraphes sont mis à jour instantanément pendant que vous tapez ou collez le texte.",
    step_3_title: "Analysez les métriques",
    step_3_desc: "Utilisez les statistiques en temps réel pour valider les limites de contenu et répondre aux critères de SEO, des réseaux sociaux et des travaux académiques.",
    apps_title: "Applications et Cas d'Utilisation",
    app_1_t: "Rédaction pour le SEO",
    app_1_d: "Optimisez les titres et les méta-descriptions en les gardant dans les limites de caractères idéales pour les moteurs de recherche.",
    app_2_t: "Réseaux Sociaux",
    app_2_d: "Assurez-vous que vos publications respectent les limites des plateformes telles que X (Twitter), Instagram, LinkedIn et WhatsApp.",
    app_3_t: "Travaux Académiques",
    app_3_d: "Gardez une trace exacte du nombre de mots et de paragraphes pour vos essais, articles, thèses et rapports scolaires.",
    app_4_t: "Copywriting",
    app_4_d: "Validez la taille des annonces, des titres, des e-mails et des textes de landing pages avec précision.",
    app_5_t: "Édition et Révision",
    app_5_d: "Comparez les versions de texte et contrôlez l'expansion ou la réduction du contenu de manière pratique.",
    edge_title: "Précision et Cas Spéciaux",
    edge_desc: "Ce compteur de texte a été conçu pour afficher clairement les métriques les plus importantes au quotidien.",
    edge_1_t: "Caractères avec et sans espaces",
    edge_1_d: "Nous affichons les deux totaux car chaque plateforme définit un « caractère » différemment. Par exemple, certaines comptent les espaces et d'autres non.",
    edge_2_t: "Nombre de lignes",
    edge_2_d: "Utile pour les formulaires, les scripts et les essais ayant une limite de lignes.",
    edge_3_t: "Nombre de paragraphes",
    edge_3_d: "Vous aide à vérifier la structure des articles, des publications et des textes formatés.",
    edge_4_t: "Mise à jour en temps réel",
    edge_4_d: "Les totaux changent automatiquement lorsque vous tapez ou collez un texte.",
    faq_title: "Questions et Réponses",
    faq1q: "Quelle est la différence entre les caractères et les caractères avec espaces ?",
    faq1a: "Les caractères comptent normalement les lettres, les chiffres et la ponctuation sans inclure les espaces. Les caractères avec espaces ajoutent également les espaces vides au total.",
    faq2q: "Le compteur fonctionne-t-il avec des textes dans d'autres langues ?",
    faq2a: "Oui. L'outil fonctionne avec n'importe quelle langue qui utilise des espaces pour séparer les mots, comme l'anglais, l'espagnol, le français, l'allemand, etc. Le comptage des caractères est indépendant de la langue.",
    faq3q: "Y a-t-il une limite de taille pour le texte que je peux analyser ?",
    faq3a: "Non. L'outil n'impose aucune limite. Le traitement se fait directement dans votre navigateur, vous pouvez donc coller de longs textes tels que des articles, des thèses ou des scripts sans restriction.",
    features_title: "Fonctionnalités Principales",
    f_1: "Compteur de mots",
    f_2: "Compteur de caractères avec et sans espaces",
    f_3: "Compteur de paragraphes et de lignes",
    f_4: "Résultats en temps réel",
    plc: "Tapez ou collez votre texte ici pour compter les mots et les caractères...",
    words: "Mots",
    paragraphs: "Paragraphes",
    lines: "Lignes",
    chars: "Caractères",
    all: "avec espaces",
    converter: "Convertisseur de Texte",
    ascii: "Générateur de Lettres ASCII",
    fancy: "Lettres Spéciales",
    generator: "Générateur de Texte"
  },
  it: {
    title: "Contatore di Testo",
    meta_title: "Contatore di Testo Online - Parole, Caratteri, Righe e Paragrafi",
    ogLocale: "it_IT",
    meta: "Conta parole, caratteri, righe e paragrafi del tuo testo in tempo reale con uno strumento online e gratuito.",
    about_desc: "Questo Contatore di Testo ti permette di analizzare e contare parole, caratteri, righe e paragrafi in modo rapido e preciso direttamente nel tuo browser. Con l'elaborazione in tempo reale, puoi monitorare istantaneamente le metriche essenziali del tuo contenuto e assicurarti che il tuo testo rientri nei limiti richiesti per SEO, social media, lavori accademici e scrittura quotidiana.",
    how_to_use_title: "Come usare il Contatore di Testo",
    step_1_title: "Inserisci il tuo testo",
    step_1_desc: "Digita o incolla il contenuto che desideri analizzare.",
    step_2_title: "Guarda i risultati",
    step_2_desc: "I totali di parole, caratteri, righe e paragrafi si aggiornano istantaneamente mentre digiti o incolli il testo.",
    step_3_title: "Analizza le metriche",
    step_3_desc: "Usa le statistiche in tempo reale per convalidare i limiti dei contenuti e soddisfare i criteri SEO, dei social network e dei lavori accademici.",
    apps_title: "Applicazioni e Casi d'Uso",
    app_1_t: "Scrittura SEO",
    app_1_d: "Ottimizza i titoli e le meta descrizioni mantenendoli entro i limiti ideali di caratteri per i motori di ricerca.",
    app_2_t: "Social Media",
    app_2_d: "Assicurati che i tuoi post rispettino i limiti di piattaforme come X (Twitter), Instagram, LinkedIn e WhatsApp.",
    app_3_t: "Lavori Accademici",
    app_3_d: "Tieni traccia del conteggio esatto di parole e paragrafi per saggi, articoli, tesi e relazioni scolastiche.",
    app_4_t: "Copywriting",
    app_4_d: "Convalida le dimensioni di annunci, titoli, e-mail e testi di landing page con precisione.",
    app_5_t: "Editing e Revisione",
    app_5_d: "Confronta le versioni del testo e controlla l'espansione o la riduzione dei contenuti in modo pratico.",
    edge_title: "Precisione e Casi Speciali",
    edge_desc: "Questo contatore di testo è stato progettato per mostrare chiaramente le metriche che contano di più nella vita di tutti i giorni.",
    edge_1_t: "Caratteri con e senza spazi",
    edge_1_d: "Mostriamo entrambi i totali perché ogni piattaforma definisce un 'carattere' in modo diverso. Ad esempio, alcune contano gli spazi e altre no.",
    edge_2_t: "Conteggio delle righe",
    edge_2_d: "Utile per moduli, script e saggi con limiti di righe.",
    edge_3_t: "Conteggio dei paragrafi",
    edge_3_d: "Ti aiuta a verificare la struttura di articoli, post e testi formattati.",
    edge_4_t: "Aggiornamento in tempo reale",
    edge_4_d: "I totali cambiano automaticamente mentre digiti o incolli un testo.",
    faq_title: "Domande e Risposte",
    faq1q: "Qual è la differenza tra caratteri e caratteri con spazi?",
    faq1a: "I caratteri normalmente contano lettere, numeri e punteggiatura senza includere gli spazi. I caratteri con spazi aggiungono anche gli spazi vuoti al totale.",
    faq2q: "Il contatore funziona con testi in altre lingue?",
    faq2a: "Sì. Lo strumento funziona con qualsiasi lingua che usa gli spazi per separare le parole, come inglese, spagnolo, francese, tedesco e altre. Il conteggio dei caratteri è indipendente dalla lingua.",
    faq3q: "C'è un limite di dimensione per il testo che posso analizzare?",
    faq3a: "No. Lo strumento non impone alcun limite. L'elaborazione viene eseguita direttamente nel tuo browser, quindi puoi incollare testi lunghi come articoli, tesi o script senza restrizioni.",
    features_title: "Funzionalità Principali",
    f_1: "Contatore di parole",
    f_2: "Contatore di caratteri con e senza spazi",
    f_3: "Contatore di paragrafi e righe",
    f_4: "Risultati in tempo reale",
    plc: "Digita o incolla qui il tuo testo per contare parole e caratteri...",
    words: "Parole",
    paragraphs: "Paragrafi",
    lines: "Righe",
    chars: "Caratteri",
    all: "con spazi",
    converter: "Convertitore di Testo",
    ascii: "Generatore di Lettere ASCII",
    fancy: "Lettere Particolari",
    generator: "Generatore di Testo"
  },
  id: {
    title: "Penghitung Teks",
    meta_title: "Penghitung Kata & Karakter Online — Baris dan Paragraf",
    ogLocale: "id_ID",
    meta: "Penghitung kata dan karakter online gratis. Hitung karakter dengan dan tanpa spasi, kata, baris, dan paragraf secara real time.",
    about_desc: "Penghitung kata dan karakter gratis ini memungkinkan Anda untuk menganalisis dan menghitung kata, karakter, baris, dan paragraf dengan cepat dan akurat langsung di browser Anda. Dengan pemrosesan waktu nyata, Anda dapat langsung melacak metrik penting untuk konten Anda dan memastikan teks Anda tetap berada dalam batas yang diperlukan untuk SEO, media sosial, tugas akademik, dan penulisan sehari-hari.",
    how_to_use_title: "Cara menggunakan Penghitung Teks",
    step_1_title: "Masukkan teks Anda",
    step_1_desc: "Ketik atau rekatkan konten yang ingin Anda analisis.",
    step_2_title: "Lihat hasilnya",
    step_2_desc: "Total untuk kata, karakter, baris, dan paragraf diperbarui secara instan saat Anda mengetik atau merekatkan teks.",
    step_3_title: "Analisis metriknya",
    step_3_desc: "Gunakan statistik waktu nyata untuk memvalidasi batas konten dan memenuhi kriteria untuk SEO, jejaring sosial, dan pekerjaan akademik.",
    apps_title: "Aplikasi dan Kasus Penggunaan",
    app_1_t: "Penulisan SEO",
    app_1_d: "Optimalkan judul dan deskripsi meta dengan menjaganya dalam batas karakter yang ideal untuk mesin pencari.",
    app_2_t: "Media Sosial",
    app_2_d: "Pastikan postingan Anda sesuai dengan batas platform seperti X (Twitter), Instagram, LinkedIn, dan WhatsApp.",
    app_3_t: "Tugas Akademik",
    app_3_d: "Pantau jumlah kata dan paragraf yang tepat untuk esai, artikel, tesis, dan laporan sekolah.",
    app_4_t: "Copywriting",
    app_4_d: "Validasi ukuran iklan, judul, email, dan teks halaman landas (landing page) dengan presisi.",
    app_5_t: "Pengeditan dan Revisi",
    app_5_d: "Bandingkan versi teks dan kendalikan perluasan atau pengurangan konten secara praktis.",
    edge_title: "Presisi dan Kasus Khusus",
    edge_desc: "Penghitung teks ini dirancang untuk menampilkan metrik yang paling penting sehari-hari dengan jelas.",
    edge_1_t: "Karakter dengan dan tanpa spasi",
    edge_1_d: "Kami menampilkan kedua total karena setiap platform mendefinisikan 'karakter' secara berbeda. Misalnya, beberapa menghitung spasi dan yang lain tidak.",
    edge_2_t: "Jumlah baris",
    edge_2_d: "Berguna untuk formulir, skrip, dan esai dengan batas baris.",
    edge_3_t: "Jumlah paragraf",
    edge_3_d: "Membantu Anda memverifikasi struktur artikel, postingan, dan teks berformat.",
    edge_4_t: "Pembaruan waktu nyata",
    edge_4_d: "Total berubah secara otomatis saat Anda mengetik atau merekatkan teks.",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Apa perbedaan antara karakter dan karakter dengan spasi?",
    faq1a: "Karakter biasanya menghitung huruf, angka, dan tanda baca tanpa menyertakan spasi. Karakter dengan spasi juga menambahkan spasi kosong ke total.",
    faq2q: "Apakah penghitung ini berfungsi dengan teks dalam bahasa lain?",
    faq2a: "Ya. Alat ini berfungsi dengan bahasa apa pun yang menggunakan spasi untuk memisahkan kata, seperti Inggris, Spanyol, Prancis, Jerman, dan lainnya. Penghitungan karakter tidak bergantung pada bahasa.",
    faq3q: "Apakah ada batasan ukuran teks yang dapat saya analisis?",
    faq3a: "Tidak. Tidak ada batasan yang diberlakukan oleh alat ini. Pemrosesan dilakukan langsung di browser Anda, sehingga Anda dapat merekatkan teks panjang seperti artikel, tesis, atau skrip tanpa batasan.",
    features_title: "Fitur Utama",
    f_1: "Penghitung kata",
    f_2: "Penghitung karakter dengan dan tanpa spasi",
    f_3: "Penghitung paragraf dan baris",
    f_4: "Hasil waktu nyata",
    plc: "Ketik atau rekatkan teks Anda di sini untuk menghitung kata dan karakter...",
    words: "Kata",
    paragraphs: "Paragraf",
    lines: "Baris",
    chars: "Karakter",
    all: "dengan spasi",
    converter: "Konverter Teks",
    ascii: "Pembuat Huruf ASCII",
    fancy: "Huruf Unik",
    generator: "Pembuat Teks"
  },
  de: {
    title: "Textzähler",
    meta_title: "Zeichenzähler Online — Wörter, Zeilen und Absätze zählen",
    ogLocale: "de_DE",
    meta: "Kostenloser Online-Zeichenzähler und Wortzähler. Zeichen mit und ohne Leerzeichen, Wörter, Zeilen und Absätze in Echtzeit zählen.",
    about_desc: "Dieser kostenlose Zeichenzähler und Wortzähler ermöglicht es Ihnen, Wörter, Zeichen, Zeilen und Absätze schnell und genau direkt in Ihrem Browser zu analysieren und zu zählen. Mit der Echtzeitverarbeitung können Sie wichtige Metriken für Ihre Inhalte sofort verfolgen und sicherstellen, dass Ihr Text innerhalb der erforderlichen Grenzen für SEO, soziale Medien, akademische Arbeiten und das tägliche Schreiben bleibt.",
    how_to_use_title: "Wie man den Textzähler benutzt",
    step_1_title: "Geben Sie Ihren Text ein",
    step_1_desc: "Tippen oder fügen Sie den Inhalt ein, den Sie analysieren möchten.",
    step_2_title: "Sehen Sie die Ergebnisse",
    step_2_desc: "Die Summen für Wörter, Zeichen, Zeilen und Absätze werden sofort aktualisiert, während Sie Text eingeben oder einfügen.",
    step_3_title: "Analysieren Sie die Metriken",
    step_3_desc: "Verwenden Sie Echtzeitstatistiken, um Inhaltsgrenzen zu validieren und Kriterien für SEO, soziale Netzwerke und akademische Arbeiten zu erfüllen.",
    apps_title: "Anwendungen und Anwendungsfälle",
    app_1_t: "SEO-Texten",
    app_1_d: "Optimieren Sie Titel und Meta-Beschreibungen, indem Sie diese innerhalb der idealen Zeichengrenzen für Suchmaschinen halten.",
    app_2_t: "Soziale Medien",
    app_2_d: "Stellen Sie sicher, dass Ihre Beiträge in die Grenzen von Plattformen wie X (Twitter), Instagram, LinkedIn und WhatsApp passen.",
    app_3_t: "Akademische Arbeiten",
    app_3_d: "Behalten Sie den genauen Überblick über Wort- und Absatzanzahlen für Aufsätze, Artikel, Abschlussarbeiten und Schulberichte.",
    app_4_t: "Marketing-Copy",
    app_4_d: "Validieren Sie die Größe von Anzeigen, Schlagzeilen, E-Mails und Texten für Landingpages präzise.",
    app_5_t: "Bearbeitung und Korrektur",
    app_5_d: "Vergleichen Sie Textversionen und kontrollieren Sie die Erweiterung oder Kürzung von Inhalten auf praktische Weise.",
    edge_title: "Präzision und Sonderfälle",
    edge_desc: "Dieser Textzähler wurde entwickelt, um die Metriken, auf die es im Alltag am meisten ankommt, übersichtlich darzustellen.",
    edge_1_t: "Zeichen mit und ohne Leerzeichen",
    edge_1_d: "Wir zeigen beide Summen an, da jede Plattform ein 'Zeichen' anders definiert. Zum Beispiel zählen einige Leerzeichen mit, andere nicht.",
    edge_2_t: "Zeilenanzahl",
    edge_2_d: "Nützlich für Formulare, Skripte und Aufsätze mit Zeilenbeschränkungen.",
    edge_3_t: "Absatzanzahl",
    edge_3_d: "Hilft Ihnen, die Struktur von Artikeln, Beiträgen und formatierten Texten zu überprüfen.",
    edge_4_t: "Echtzeit-Updates",
    edge_4_d: "Die Summen ändern sich automatisch, wenn Sie einen Text eingeben oder einfügen.",
    faq_title: "Fragen und Antworten",
    faq1q: "Was ist der Unterschied zwischen Zeichen und Zeichen mit Leerzeichen?",
    faq1a: "Zeichen zählen normalerweise Buchstaben, Zahlen und Satzzeichen ohne Leerzeichen. Zeichen mit Leerzeichen addieren auch die Leerzeichen zur Gesamtsumme.",
    faq2q: "Funktioniert der Zähler mit Texten in anderen Sprachen?",
    faq2a: "Ja. Das Tool funktioniert mit jeder Sprache, die Leerzeichen zur Trennung von Wörtern verwendet, wie z.B. Englisch, Spanisch, Französisch, Deutsch und andere. Das Zeichenzählen ist sprachunabhängig.",
    faq3q: "Gibt es ein Limit für die Textgröße, die ich analysieren kann?",
    faq3a: "Nein. Es gibt kein vom Tool auferlegtes Limit. Die Verarbeitung erfolgt direkt in Ihrem Browser, sodass Sie lange Texte wie Artikel, Abschlussarbeiten oder Skripte ohne Einschränkung einfügen können.",
    features_title: "Hauptfunktionen",
    f_1: "Wortzähler",
    f_2: "Zeichenzähler mit und ohne Leerzeichen",
    f_3: "Absatz- und Zeilenzähler",
    f_4: "Ergebnisse in Echtzeit",
    plc: "Geben Sie Ihren Text hier ein oder fügen Sie ihn ein, um Wörter und Zeichen zu zählen...",
    words: "Wörter",
    paragraphs: "Absätze",
    lines: "Zeilen",
    chars: "Zeichen",
    all: "mit Leerzeichen",
    converter: "Textkonverter",
    ascii: "ASCII-Buchstaben-Generator",
    fancy: "Ausgefallene Buchstaben",
    generator: "Textgenerator"
  },
  nl: {
    title: "Tekstteller",
    meta_title: "Woordenteller Online — Woorden, Tekens, Regels en Alinea's tellen",
    ogLocale: "nl_NL",
    meta: "Gratis online woordenteller en tekenteller. Tel woorden, tekens met en zonder spaties, regels en alinea's in realtime.",
    about_desc: "Met deze gratis woordenteller en tekenteller kunt u snel en nauwkeurig woorden, tekens, regels en alinea's analyseren en tellen, rechtstreeks in uw browser. Met realtime verwerking kunt u direct essentiële statistieken voor uw inhoud volgen en ervoor zorgen dat uw tekst binnen de vereiste limieten blijft voor SEO, sociale media, academisch werk en dagelijks schrijven.",
    how_to_use_title: "Hoe de Tekstteller te gebruiken",
    step_1_title: "Voer uw tekst in",
    step_1_desc: "Typ of plak de inhoud die u wilt analyseren.",
    step_2_title: "Bekijk de resultaten",
    step_2_desc: "De totalen voor woorden, tekens, regels en alinea's worden direct bijgewerkt terwijl u typt of tekst plakt.",
    step_3_title: "Analyseer de statistieken",
    step_3_desc: "Gebruik realtime statistieken om inhoudslimieten te valideren en te voldoen aan criteria voor SEO, sociale netwerken en academisch werk.",
    apps_title: "Toepassingen en Gebruiksscenario's",
    app_1_t: "SEO Schrijven",
    app_1_d: "Optimaliseer titels en metabeschrijvingen door ze binnen de ideale tekenlimieten voor zoekmachines te houden.",
    app_2_t: "Sociale Media",
    app_2_d: "Zorg ervoor dat uw berichten binnen de limieten passen van platforms zoals X (Twitter), Instagram, LinkedIn en WhatsApp.",
    app_3_t: "Academisch Werk",
    app_3_d: "Houd de exacte woord- en alinea-aantallen bij voor essays, artikelen, scripties en schoolrapporten.",
    app_4_t: "Marketingteksten",
    app_4_d: "Valideer de grootte van advertenties, koppen, e-mails en teksten voor bestemmingspagina's met precisie.",
    app_5_t: "Bewerken en Nakijken",
    app_5_d: "Vergelijk tekstversies en beheer de uitbreiding of vermindering van inhoud op een praktische manier.",
    edge_title: "Precisie en Speciale Gevallen",
    edge_desc: "Deze tekstteller is ontworpen om de statistieken die er dagelijks het meest toe doen duidelijk weer te geven.",
    edge_1_t: "Tekens met en zonder spaties",
    edge_1_d: "We geven beide totalen weer omdat elk platform een 'teken' anders definieert. Sommige tellen bijvoorbeeld spaties mee en andere niet.",
    edge_2_t: "Regelaantal",
    edge_2_d: "Handig voor formulieren, scripts en essays met regellimieten.",
    edge_3_t: "Alinea-aantal",
    edge_3_d: "Helpt u de structuur van artikelen, berichten en opgemaakte teksten te verifiëren.",
    edge_4_t: "Realtime updates",
    edge_4_d: "Totalen veranderen automatisch terwijl u typt of tekst plakt.",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Wat is het verschil tussen tekens en tekens met spaties?",
    faq1a: "Tekens tellen normaal gesproken letters, cijfers en leestekens zonder spaties mee te rekenen. Tekens met spaties voegen ook de blanco spaties toe aan het totaal.",
    faq2q: "Werkt de teller met teksten in andere talen?",
    faq2a: "Ja. De tool werkt met elke taal die spaties gebruikt om woorden te scheiden, zoals Engels, Spaans, Frans, Duits en andere. Het tellen van tekens is taalonafhankelijk.",
    faq3q: "Is er een limiet aan de grootte van de tekst die ik kan analyseren?",
    faq3a: "Nee. Er is geen limiet opgelegd door de tool. De verwerking gebeurt direct in uw browser, dus u kunt zonder beperking lange teksten zoals artikelen, scripties of scripts plakken.",
    features_title: "Belangrijkste Functies",
    f_1: "Woordenteller",
    f_2: "Tekenteller met en zonder spaties",
    f_3: "Alinea- en regelteller",
    f_4: "Realtime resultaten",
    plc: "Typ of plak uw tekst hier om woorden en tekens te tellen...",
    words: "Woorden",
    paragraphs: "Alinea's",
    lines: "Regels",
    chars: "Tekens",
    all: "met spaties",
    converter: "Tekstconverter",
    ascii: "ASCII-lettergenerator",
    fancy: "Speciale Letters",
    generator: "Tekstgenerator"
  },
  ru: {
    title: "Счетчик слов и символов",
    meta_title: "Счетчик символов и слов онлайн — строки и абзацы",
    ogLocale: "ru_RU",
    meta: "Бесплатный онлайн-счетчик символов и слов. Считайте символы (с пробелами и без), слова, строки и абзацы в реальном времени.",
    about_desc: "Этот бесплатный счетчик слов и символов позволяет быстро и точно анализировать и подсчитывать слова, символы, строки и абзацы прямо в вашем браузере. Благодаря обработке в реальном времени вы можете мгновенно отслеживать основные метрики вашего текста и проверять его соответствие ограничениям для SEO, социальных сетей, академических работ и повседневных задач.",
    how_to_use_title: "Как использовать счетчик текста",
    step_1_title: "Вставьте ваш текст",
    step_1_desc: "Напечатайте или вставьте текст, который хотите проанализировать.",
    step_2_title: "Смотрите результаты",
    step_2_desc: "Количество слов, символов, строк и абзацев обновляется мгновенно по мере ввода или вставки текста.",
    step_3_title: "Анализируйте метрики",
    step_3_desc: "Используйте статистику в реальном времени, чтобы проверять ограничения на размер контента и соответствовать критериям SEO, социальных сетей и учебных заданий.",
    apps_title: "Применение и варианты использования",
    app_1_t: "SEO-копирайтинг",
    app_1_d: "Оптимизируйте заголовки и мета-описания, придерживаясь идеальных ограничений по количеству символов для поисковых систем.",
    app_2_t: "Социальные сети",
    app_2_d: "Убедитесь, что ваши посты соответствуют лимитам таких платформ, как X (Twitter), Instagram, LinkedIn и WhatsApp.",
    app_3_t: "Академические работы",
    app_3_d: "Следите за точным количеством слов и абзацев при написании эссе, статей, диссертаций и школьных отчетов.",
    app_4_t: "Маркетинговые тексты",
    app_4_d: "Точно проверяйте длину рекламных объявлений, заголовков, email-рассылок и текстов для лендингов.",
    app_5_t: "Редактура и вычитка",
    app_5_d: "Сравнивайте разные версии текста и легко контролируйте сокращение или расширение контента.",
    edge_title: "Точность и особые случаи",
    edge_desc: "Этот счетчик текста разработан для удобного отображения наиболее важных повседневных метрик.",
    edge_1_t: "Символы с пробелами и без",
    edge_1_d: "Мы показываем оба значения, так как каждая платформа определяет «символ» по-разному. Например, некоторые учитывают пробелы, а другие — нет.",
    edge_2_t: "Подсчет строк",
    edge_2_d: "Полезно для заполнения форм, написания сценариев и эссе с ограничением по количеству строк.",
    edge_3_t: "Подсчет абзацев",
    edge_3_d: "Помогает проверить структуру статей, постов и форматированных текстов.",
    edge_4_t: "Обновление в реальном времени",
    edge_4_d: "Итоговые значения меняются автоматически по мере ввода или вставки текста.",
    faq_title: "Вопросы и ответы",
    faq1q: "В чем разница между символами и символами с пробелами?",
    faq1a: "Обычно под символами понимаются буквы, цифры и знаки препинания без учета пробелов. «Символы с пробелами» включают в итоговое число все пробелы и отступы.",
    faq2q: "Работает ли счетчик с текстами на других языках?",
    faq2a: "Да. Инструмент работает с любым языком, где слова разделяются пробелами: английским, испанским, французским, немецким и другими. Подсчет символов от языка не зависит.",
    faq3q: "Есть ли ограничения на объем анализируемого текста?",
    faq3a: "Нет. Инструмент не имеет никаких ограничений. Обработка происходит прямо в вашем браузере, поэтому вы можете без проблем вставлять длинные тексты, такие как статьи, диссертации или сценарии.",
    features_title: "Основные возможности",
    f_1: "Счетчик слов",
    f_2: "Счетчик символов с пробелами и без",
    f_3: "Счетчик абзацев и строк",
    f_4: "Результаты в реальном времени",
    plc: "Напечатайте или вставьте текст сюда для подсчета слов и символов...",
    words: "Слов",
    paragraphs: "Абзацев",
    lines: "Строк",
    chars: "Символов",
    all: "с пробелами",
    converter: "Конвертер текста",
    ascii: "Генератор ASCII-букв",
    fancy: "Красивые буквы",
    generator: "Генератор текста"
  }
}
</i18n>
