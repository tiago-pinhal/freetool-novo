<script setup lang="ts">
const { onLoaded } = useScript('https://cdn.jsdelivr.net/gh/lukehaas/getlorem@master/lib/getlorem.js', {
  trigger: 'client'
})

const { t, locale } = useI18n({ useScope: 'local' })

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f_1'),
    t('f_2'),
    t('f_3')
  ],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') }
  ]
})

useHead({
  title: t('meta_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

enum TypeContent { PARAGRAPHS, WORDS, SENTENCES, LISTS }

const state = reactive({
  qty: 1,
  typeContent: TypeContent.PARAGRAPHS,
  wrap: false,
  lorem: false,
  output: ''
})

function generate() {
  const getlorem = (window as any).getlorem
  if (!getlorem) return

  const wrap = state.wrap ? "p" : null
  
  switch (state.typeContent) {
    case TypeContent.PARAGRAPHS:
      state.output = getlorem.paragraphs(state.qty, wrap, state.lorem)
      break
    case TypeContent.WORDS:
      state.output = getlorem.words(state.qty, wrap, state.lorem)
      break
    case TypeContent.SENTENCES:
      state.output = getlorem.sentences(state.qty, wrap, state.lorem)
      break
    case TypeContent.LISTS:
      state.output = getlorem.lists(state.qty, wrap, state.lorem)
      break
  }
}

watch(
  () => [state.qty, state.typeContent, state.wrap, state.lorem],
  () => generate()
)

onLoaded(() => {
  generate()
})

defineI18nRoute({
    paths: {
      en: '/text-generator',
      pt: '/gerador-de-texto',
      es: '/generador-de-texto',
      fr: '/generateur-de-texte',
      it: '/generatore-di-testo',
      id: '/generator-teks',
      de: '/text-generator',
      nl: '/tekst-generator',
      ru: '/generator-teksta'
    }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.output"
    :see-also-links="[
      { label: t('see1'), to: 'text-counter' },
      { label: t('see2'), to: 'text-converter' },
      { label: t('see3'), to: 'ascii-letter-generator' },
      { label: t('see4'), to: 'fancy-letters' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-200 p-6 rounded-2xl">
        <!-- Quantity -->
        <div class="form-control w-full">
          <label class="label" for="qty-input">
            <span class="label-text font-bold text-base-content">{{ t('qty') }}</span>
          </label>
          <input 
            id="qty-input"
            type="number" 
            min="1" 
            v-model="state.qty" 
            class="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-all rounded-xl font-mono text-lg" 
          />
        </div>

        <!-- Toggles -->
        <div class="flex flex-col justify-center space-y-2 mt-2 md:mt-8">
          <label class="label cursor-pointer justify-start gap-3 w-fit">
            <input type="checkbox" class="toggle toggle-primary" v-model="state.wrap" />
            <span class="label-text text-base-content">{{ t('tags') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3 w-fit">
            <input type="checkbox" class="toggle toggle-primary" v-model="state.lorem" />
            <span class="label-text text-base-content">{{ t('lorem') }}</span>
          </label>
        </div>
      </div>

      <!-- Type Content Selection -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content">{{ t('gen') }}</span>
        </label>
        <div class="join flex-wrap w-full">
          <button class="btn join-item flex-1" :class="state.typeContent === TypeContent.PARAGRAPHS ? 'btn-primary' : 'btn-outline border-base-content/20'" @click="state.typeContent = TypeContent.PARAGRAPHS">{{ t('paragraphs') }}</button>
          <button class="btn join-item flex-1" :class="state.typeContent === TypeContent.WORDS ? 'btn-primary' : 'btn-outline border-base-content/20'" @click="state.typeContent = TypeContent.WORDS">{{ t('words') }}</button>
          <button class="btn join-item flex-1" :class="state.typeContent === TypeContent.SENTENCES ? 'btn-primary' : 'btn-outline border-base-content/20'" @click="state.typeContent = TypeContent.SENTENCES">{{ t('sentences') }}</button>
          <button class="btn join-item flex-1" :class="state.typeContent === TypeContent.LISTS ? 'btn-primary' : 'btn-outline border-base-content/20'" @click="state.typeContent = TypeContent.LISTS">{{ t('lists') }}</button>
        </div>
      </div>

      <!-- Result Area -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <Blockcopy v-if="state.output" :label="t('result')" :content="state.output">
          <div class="prose prose-sm max-w-none text-base-content whitespace-pre-wrap" v-html="state.output" />
        </Blockcopy>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <!-- Features -->
        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3') ]"
          icon="heroicons:document-text-20-solid"
        />

        <!-- How to Use -->
        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <!-- FAQ -->
        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Lorem Ipsum Generator",
    meta_title: "Lorem Ipsum Generator — Free Placeholder Text Online",
    meta: "Free Lorem Ipsum generator online. Create placeholder text — paragraphs, sentences, words and lists for web design, Figma, Sketch and prototyping.",
    desc: "Our Lorem Ipsum Generator instantly creates placeholder text for designers and developers. Use placeholders in wireframes, mockups, and prototypes to visualize the final layout without distractions from real content. Ideal for web design, UI/UX projects, Figma usage, and theme creation, the tool offers natural-looking text while the definitive content is not yet available. Lorem Ipsum is the industry standard in typography and design for layout testing, making it essential for frontend professionals and marketing teams.",
    qty: "Quantity",
    paragraphs: "Paragraphs",
    words: "Words",
    sentences: "Sentences",
    lists: "Lists",
    tags: "Add HTML paragraph tags",
    lorem: "Start with 'Lorem ipsum'",
    gen: "Generate",
    result: "Result",
    features_title: "Key Benefits",
    f_1: "Instant Placeholder Text: Generate Lorem Ipsum paragraphs, sentences, words, or lists in one click, no signup or installation required.",
    f_2: "Flexible Output: Choose exact quantities and add HTML paragraph tags for direct use in your code, CMS, or design tool.",
    f_3: "Perfect for Designers & Developers: Ideal for mockups, wireframes, website templates, app prototypes, presentations, and demos.",
    how_to_use_title: "How to Use",
    step_1_title: "Choose the quantity",
    step_1_desc: "Enter how many paragraphs, sentences, words, or list items you need for your project.",
    step_2_title: "Select options",
    step_2_desc: "Enable HTML paragraph tags for web projects, or start with the classic 'Lorem ipsum dolor sit amet' opening.",
    step_3_title: "Generate and copy",
    step_3_desc: "Select the desired content type and copy the placeholder text directly to your design tool or code editor.",
    faq_title: "Frequently Asked Questions",
    faq_1_q: "What is Lorem Ipsum and what is it used for?",
    faq_1_a: "It is standard pseudo-Latin text used in the printing and web design industry to fill text spaces in mockups and wireframes, allowing designers to evaluate layout and typography without being distracted by content.",
    faq_2_q: "Why use dummy text instead of real text?",
    faq_2_a: "Using real text can cause reviewers and clients to focus on the written message rather than the design. Lorem Ipsum has a normal distribution of letters, perfectly mimicking the visual weight of natural content.",
    faq_3_q: "Does the generated text have any hidden meaning or inappropriate words?",
    faq_3_a: "No. Our generator uses the classic format based on original Latin texts from the 1st century, ensuring there are no embarrassing words or hidden jokes in the middle of the placeholder text.",
    faq_4_q: "Can I use the generated text in commercial projects?",
    faq_4_a: "Yes! All placeholder text generated by this tool is completely free and copyright-free, and can be used in any personal or commercial project, such as websites, apps, and themes.",
    see1: "Text Counter",
    see2: "Text Converter",
    see3: "ASCII Letter Generator",
    see4: "Fancy Letters",
  },
  pt: {
    title: "Gerador de Lorem Ipsum",
    meta_title: "Gerador de Lorem Ipsum — Texto Placeholder Online Grátis",
    meta: "Gerador de Lorem Ipsum online grátis. Crie texto placeholder — parágrafos, frases, palavras e listas para web design, Figma, Sketch e prototipagem.",
    desc: "Nosso Gerador de Lorem Ipsum cria textos de preenchimento instantaneamente para designers e desenvolvedores. Utilize placeholders em wireframes, mockups e protótipos para visualizar o layout final sem distrações com o conteúdo real. Ideal para web design, projetos de UI/UX, uso no Figma e criação de temas, a ferramenta oferece textos com aparência natural enquanto o conteúdo definitivo ainda não está disponível. O Lorem Ipsum é o padrão da indústria em tipografia e design para testes de layout, sendo essencial para profissionais de frontend e equipes de marketing.",
    qty: "Quantidade",
    paragraphs: "Parágrafos",
    words: "Palavras",
    sentences: "Frases",
    lists: "Listas",
    tags: "Adicionar tags HTML de parágrafo",
    lorem: "Iniciar com 'Lorem ipsum'",
    gen: "Gerar",
    result: "Resultado",
    features_title: "Principais Benefícios",
    f_1: "Texto Placeholder Instantâneo: Gere parágrafos, frases, palavras ou listas Lorem Ipsum em um clique, sem necessidade de cadastro ou instalação.",
    f_2: "Saída Flexível: Escolha quantidades exatas e adicione tags HTML de parágrafo para uso direto no seu código, CMS ou ferramenta de design.",
    f_3: "Perfeito para Designers e Desenvolvedores: Ideal para mockups, wireframes, templates de sites, protótipos de apps, apresentações e demonstrações.",
    how_to_use_title: "Como Usar",
    step_1_title: "Escolha a quantidade",
    step_1_desc: "Informe quantos parágrafos, frases, palavras ou itens de lista você precisa para seu projeto.",
    step_2_title: "Selecione opções",
    step_2_desc: "Ative tags HTML de parágrafo para projetos web, ou inicie com a clássica abertura 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Gere e copie",
    step_3_desc: "Selecione o tipo de conteúdo desejado e copie o texto placeholder direto para sua ferramenta de design ou editor de código.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O que é Lorem Ipsum e para que serve?",
    faq_1_a: "É um texto padrão em pseudo-latim usado na indústria gráfica e de web design para preencher espaços de texto em mockups e wireframes, permitindo que os designers avaliem o layout e a tipografia sem se distraírem com o conteúdo.",
    faq_2_q: "Por que usar texto fictício em vez de texto real?",
    faq_2_a: "Usar um texto real pode fazer com que os revisores e clientes foquem na mensagem escrita em vez do design. O Lorem Ipsum tem uma distribuição normal de letras, o que imita perfeitamente o peso visual de um conteúdo natural.",
    faq_3_q: "O texto gerado tem algum significado oculto ou palavras impróprias?",
    faq_3_a: "Não. O nosso gerador utiliza o formato clássico baseado em textos originais em latim do século I, garantindo que não haja palavras constrangedoras ou piadas escondidas no meio do preenchimento.",
    faq_4_q: "Posso usar o texto gerado em projetos comerciais?",
    faq_4_a: "Sim! Todo o texto placeholder gerado por esta ferramenta é totalmente gratuito e livre de direitos autorais, podendo ser usado em qualquer projeto pessoal ou comercial, como sites, aplicativos e temas.",
    see1: "Contador de Texto",
    see2: "Conversor de Texto",
    see3: "Letras ASCII",
    see4: "Letras Diferentes",
  },
   es: {
    title: "Generador Lorem Ipsum",
    meta_title: "Generador Lorem Ipsum — Texto Placeholder Online Gratis",
    meta: "Generador Lorem Ipsum online gratis. Crea texto placeholder — párrafos, frases, palabras y listas para diseño web, Figma, Sketch y prototipado.",
    desc: "Nuestro Generador de Lorem Ipsum crea textos de relleno instantáneamente para diseñadores y desarrolladores. Utiliza placeholders en wireframes, mockups y prototipos para visualizar el diseño final sin distracciones con el contenido real. Ideal para diseño web, proyectos de UI/UX, uso en Figma y creación de temas, la herramienta ofrece textos con un aspecto natural mientras el contenido definitivo aún no está disponible. Lorem Ipsum es el estándar de la industria en tipografía y diseño para pruebas de maquetación, siendo esencial para profesionales de frontend y equipos de marketing.",
    qty: "Cantidad",
    paragraphs: "Párrafos",
    words: "Palabras",
    sentences: "Frases",
    lists: "Listas",
    tags: "Añadir etiquetas HTML de párrafo",
    lorem: "Empezar con 'Lorem ipsum'",
    gen: "Generar",
    result: "Resultado",
    features_title: "Principales Beneficios",
    f_1: "Texto Placeholder Instantáneo: Genera párrafos, frases, palabras o listas Lorem Ipsum con un clic, sin necesidad de registro ni instalación.",
    f_2: "Salida Flexible: Elige cantidades exactas y añade etiquetas HTML de párrafo para usar directamente en tu código, CMS o herramienta de diseño.",
    f_3: "Perfecto para Diseñadores y Desarrolladores: Ideal para mockups, wireframes, plantillas web, prototipos de apps, presentaciones y demostraciones.",
    how_to_use_title: "Cómo Usar",
    step_1_title: "Elige la cantidad",
    step_1_desc: "Indica cuántos párrafos, frases, palabras o elementos de lista necesitas para tu proyecto.",
    step_2_title: "Selecciona las opciones",
    step_2_desc: "Activa las etiquetas HTML de párrafo para proyectos web, o empieza con la clásica apertura 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Genera y copia",
    step_3_desc: "Selecciona el tipo de contenido deseado y copia el texto placeholder directamente a tu herramienta de diseño o editor de código.",
    faq_title: "Preguntas Frecuentes",
    faq_1_q: "¿Qué es Lorem Ipsum y para qué sirve?",
    faq_1_a: "Es un texto estándar en pseudo-latín utilizado en la industria gráfica y de diseño web para rellenar espacios de texto en mockups y wireframes, permitiendo a los diseñadores evaluar la maquetación y la tipografía sin distraerse con el contenido.",
    faq_2_q: "¿Por qué usar texto falso en lugar de texto real?",
    faq_2_a: "Usar texto real puede hacer que los revisores y clientes se enfoquen en el mensaje escrito en lugar del diseño. Lorem Ipsum tiene una distribución normal de letras, lo que imita perfectamente el peso visual de un contenido natural.",
    faq_3_q: "¿El texto generado tiene algún significado oculto o palabras inapropiadas?",
    faq_3_a: "No. Nuestro generador utiliza el formato clásico basado en textos originales en latín del siglo I, garantizando que no haya palabras vergonzosas o bromas ocultas en medio del texto de relleno.",
    faq_4_q: "¿Puedo usar el texto generado en proyectos comerciales?",
    faq_4_a: "¡Sí! Todo el texto placeholder generado por esta herramienta es totalmente gratuito y libre de derechos de autor, y puede usarse en cualquier proyecto personal o comercial, como sitios web, aplicaciones y temas.",
    see1: "Contador de Texto",
    see2: "Conversor de Texto",
    see3: "Generador de Letras ASCII",
    see4: "Letras Diferentes",
  },
  fr: {
    title: "Générateur Lorem Ipsum",
    meta_title: "Générateur Lorem Ipsum — Faux Texte en Ligne Gratuit",
    meta: "Générateur Lorem Ipsum en ligne gratuit. Créez du faux texte — paragraphes, phrases, mots et listes pour le web design, Figma, Sketch et le prototypage.",
    desc: "Notre générateur de Lorem Ipsum crée instantanément du texte de remplissage pour les designers et les développeurs. Utilisez des espaces réservés dans vos wireframes, maquettes et prototypes pour visualiser la mise en page finale sans être distrait par le contenu réel. Idéal pour le web design, les projets UI/UX, l'utilisation dans Figma et la création de thèmes, l'outil offre un texte d'apparence naturelle en attendant le contenu définitif. Le Lorem Ipsum est la norme de l'industrie en typographie et en design pour tester les mises en page, ce qui en fait un élément essentiel pour les professionnels du frontend et les équipes marketing.",
    qty: "Quantité",
    paragraphs: "Paragraphes",
    words: "Mots",
    sentences: "Phrases",
    lists: "Listes",
    tags: "Ajouter des balises HTML de paragraphe",
    lorem: "Commencer par 'Lorem ipsum'",
    gen: "Générer",
    result: "Résultat",
    features_title: "Principaux Avantages",
    f_1: "Faux Texte Instantané : Générez des paragraphes, des phrases, des mots ou des listes Lorem Ipsum en un clic, sans inscription ni installation.",
    f_2: "Sortie Flexible : Choisissez des quantités exactes et ajoutez des balises HTML de paragraphe pour une utilisation directe dans votre code, CMS ou outil de design.",
    f_3: "Parfait pour les Designers et les Développeurs : Idéal pour les maquettes, les wireframes, les modèles de sites web, les prototypes d'applications, les présentations et les démonstrations.",
    how_to_use_title: "Comment l'Utiliser",
    step_1_title: "Choisissez la quantité",
    step_1_desc: "Indiquez le nombre de paragraphes, phrases, mots ou éléments de liste dont vous avez besoin pour votre projet.",
    step_2_title: "Sélectionnez les options",
    step_2_desc: "Activez les balises HTML de paragraphe pour les projets web, ou commencez avec l'ouverture classique 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Générez et copiez",
    step_3_desc: "Sélectionnez le type de contenu souhaité et copiez le faux texte directement dans votre outil de design ou votre éditeur de code.",
    faq_title: "Questions Fréquentes",
    faq_1_q: "Qu'est-ce que le Lorem Ipsum et à quoi ça sert ?",
    faq_1_a: "C'est un texte standard en pseudo-latin utilisé dans l'imprimerie et le web design pour remplir des espaces de texte dans les maquettes et wireframes, permettant aux designers d'évaluer la mise en page et la typographie sans être distraits par le contenu.",
    faq_2_q: "Pourquoi utiliser du faux texte plutôt que du vrai texte ?",
    faq_2_a: "L'utilisation de texte réel peut amener les relecteurs et les clients à se concentrer sur le message écrit plutôt que sur le design. Le Lorem Ipsum a une distribution normale des lettres, ce qui imite parfaitement le poids visuel d'un contenu naturel.",
    faq_3_q: "Le texte généré a-t-il une signification cachée ou des mots inappropriés ?",
    faq_3_a: "Non. Notre générateur utilise le format classique basé sur des textes originaux en latin du Ier siècle, garantissant l'absence de mots gênants ou de blagues cachées au milieu du texte de remplissage.",
    faq_4_q: "Puis-je utiliser le texte généré dans des projets commerciaux ?",
    faq_4_a: "Oui ! Tout le faux texte généré par cet outil est entièrement gratuit et libre de droits, et peut être utilisé dans n'importe quel projet personnel ou commercial, comme des sites web, des applications et des thèmes.",
    see1: "Compteur de Mots",
    see2: "Convertisseur de Texte",
    see3: "Générateur de Lettres ASCII",
    see4: "Lettres Spéciales",
  },
  it: {
    title: "Generatore Lorem Ipsum",
    meta_title: "Generatore Lorem Ipsum — Testo Segnaposto Online Gratis",
    meta: "Generatore Lorem Ipsum online gratis. Crea testo segnaposto — paragrafi, frasi, parole e liste per web design, Figma, Sketch e prototipazione.",
    desc: "Il nostro Generatore di Lorem Ipsum crea istantaneamente testo riempitivo per designer e sviluppatori. Utilizza i placeholder in wireframe, mockup e prototipi per visualizzare il layout finale senza distrarti con il contenuto reale. Ideale per web design, progetti UI/UX, uso in Figma e creazione di temi, lo strumento offre un testo dall'aspetto naturale mentre il contenuto definitivo non è ancora disponibile. Il Lorem Ipsum è lo standard del settore in tipografia e design per i test di layout, essendo essenziale per professionisti frontend e team di marketing.",
    qty: "Quantità",
    paragraphs: "Paragrafi",
    words: "Parole",
    sentences: "Frasi",
    lists: "Elenchi",
    tags: "Aggiungi tag HTML di paragrafo",
    lorem: "Inizia con 'Lorem ipsum'",
    gen: "Genera",
    result: "Risultato",
    features_title: "Principali Vantaggi",
    f_1: "Testo Placeholder Istantaneo: Genera paragrafi, frasi, parole o elenchi Lorem Ipsum in un clic, senza registrazione o installazione.",
    f_2: "Output Flessibile: Scegli quantità esatte e aggiungi tag HTML di paragrafo per l'uso diretto nel tuo codice, CMS o strumento di design.",
    f_3: "Perfetto per Designer e Sviluppatori: Ideale per mockup, wireframe, template di siti web, prototipi di app, presentazioni e dimostrazioni.",
    how_to_use_title: "Come Usare",
    step_1_title: "Scegli la quantità",
    step_1_desc: "Indica quanti paragrafi, frasi, parole o elementi di elenco ti servono per il tuo progetto.",
    step_2_title: "Seleziona le opzioni",
    step_2_desc: "Attiva i tag HTML di paragrafo per progetti web, oppure inizia con la classica apertura 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Genera e copia",
    step_3_desc: "Seleziona il tipo di contenuto desiderato e copia il testo placeholder direttamente nel tuo strumento di design o editor di codice.",
    faq_title: "Domande Frequenti",
    faq_1_q: "Che cos'è il Lorem Ipsum e a cosa serve?",
    faq_1_a: "È un testo standard in pseudo-latino utilizzato nell'industria grafica e del web design per riempire gli spazi di testo in mockup e wireframe, consentendo ai designer di valutare il layout e la tipografia senza essere distratti dal contenuto.",
    faq_2_q: "Perché usare testo finto invece di testo reale?",
    faq_2_a: "L'uso di testo reale può indurre i revisori e i clienti a concentrarsi sul messaggio scritto anziché sul design. Il Lorem Ipsum ha una distribuzione normale delle lettere, che imita perfettamente il peso visivo del contenuto naturale.",
    faq_3_q: "Il testo generato ha un significato nascosto o parole inappropriate?",
    faq_3_a: "No. Il nostro generatore utilizza il formato classico basato sui testi latini originali del I secolo, garantendo che non ci siano parole imbarazzanti o scherzi nascosti in mezzo al testo riempitivo.",
    faq_4_q: "Posso utilizzare il testo generato in progetti commerciali?",
    faq_4_a: "Sì! Tutto il testo placeholder generato da questo strumento è completamente gratuito e privo di copyright e può essere utilizzato in qualsiasi progetto personale o commerciale, come siti web, applicazioni e temi.",
    see1: "Contatore di Testo",
    see2: "Convertitore di Testo",
    see3: "Generatore di Lettere ASCII",
    see4: "Lettere Diverse",
  },
  id: {
    title: "Generator Lorem Ipsum",
    meta_title: "Generator Lorem Ipsum — Teks Placeholder Online Gratis",
    meta: "Generator Lorem Ipsum online gratis. Buat teks placeholder — paragraf, kalimat, kata, dan daftar untuk desain web, Figma, Sketch, dan pembuatan prototipe.",
    desc: "Generator Lorem Ipsum kami secara instan membuat teks pengisi untuk desainer dan pengembang. Gunakan placeholder di wireframe, mockup, dan prototipe untuk memvisualisasikan tata letak akhir tanpa terganggu oleh konten asli. Ideal untuk desain web, proyek UI/UX, penggunaan Figma, dan pembuatan tema, alat ini menawarkan teks yang tampak alami sementara konten definitif belum tersedia. Lorem Ipsum adalah standar industri dalam tipografi dan desain untuk pengujian tata letak, sehingga sangat penting bagi para profesional frontend dan tim pemasaran.",
    qty: "Jumlah",
    paragraphs: "Paragraf",
    words: "Kata",
    sentences: "Kalimat",
    lists: "Daftar",
    tags: "Tambahkan tag paragraf HTML",
    lorem: "Mulai dengan 'Lorem ipsum'",
    gen: "Hasilkan",
    result: "Hasil",
    features_title: "Manfaat Utama",
    f_1: "Teks Placeholder Instan: Hasilkan paragraf, kalimat, kata, atau daftar Lorem Ipsum dalam satu klik, tanpa perlu mendaftar atau menginstal.",
    f_2: "Output Fleksibel: Pilih jumlah yang tepat dan tambahkan tag paragraf HTML untuk digunakan langsung dalam kode, CMS, atau alat desain Anda.",
    f_3: "Sempurna untuk Desainer & Pengembang: Ideal untuk mockup, wireframe, templat situs web, prototipe aplikasi, presentasi, dan demonstrasi.",
    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Pilih jumlah",
    step_1_desc: "Tentukan berapa banyak paragraf, kalimat, kata, atau item daftar yang Anda butuhkan untuk proyek Anda.",
    step_2_title: "Pilih opsi",
    step_2_desc: "Aktifkan tag paragraf HTML untuk proyek web, atau mulai dengan pembukaan klasik 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Hasilkan dan salin",
    step_3_desc: "Pilih jenis konten yang diinginkan dan salin teks placeholder langsung ke alat desain atau editor kode Anda.",
    faq_title: "Pertanyaan yang Sering Diajukan",
    faq_1_q: "Apa itu Lorem Ipsum dan untuk apa digunakan?",
    faq_1_a: "Ini adalah teks standar dalam bahasa pseudo-Latin yang digunakan dalam industri percetakan dan desain web untuk mengisi ruang teks pada mockup dan wireframe, memungkinkan desainer untuk mengevaluasi tata letak dan tipografi tanpa terganggu oleh konten.",
    faq_2_q: "Mengapa menggunakan teks tiruan alih-alih teks asli?",
    faq_2_a: "Menggunakan teks asli dapat menyebabkan peninjau dan klien fokus pada pesan tertulis alih-alih desain. Lorem Ipsum memiliki distribusi huruf yang normal, dengan sempurna meniru bobot visual dari konten alami.",
    faq_3_q: "Apakah teks yang dihasilkan memiliki makna tersembunyi atau kata-kata yang tidak pantas?",
    faq_3_a: "Tidak. Generator kami menggunakan format klasik berdasarkan teks Latin asli dari abad ke-1, memastikan tidak ada kata-kata memalukan atau lelucon tersembunyi di tengah teks pengisi.",
    faq_4_q: "Bolehkah saya menggunakan teks yang dihasilkan dalam proyek komersial?",
    faq_4_a: "Ya! Semua teks placeholder yang dihasilkan oleh alat ini benar-benar gratis dan bebas hak cipta, dan dapat digunakan dalam proyek pribadi atau komersial apa pun, seperti situs web, aplikasi, dan tema.",
    see1: "Penghitung Teks",
    see2: "Konverter Teks",
    see3: "Generator Huruf ASCII",
    see4: "Huruf Keren",
  },
  de: {
    title: "Lorem Ipsum Generator",
    meta_title: "Lorem Ipsum Generator — Kostenloser Platzhaltertext Online",
    meta: "Kostenloser Lorem Ipsum Generator online. Erstellen Sie Platzhaltertext — Absätze, Sätze, Wörter und Listen für Webdesign, Figma, Sketch und Prototyping.",
    desc: "Unser Lorem-Ipsum-Generator erstellt sofort Fülltext für Designer und Entwickler. Verwenden Sie Platzhalter in Wireframes, Mockups und Prototypen, um das endgültige Layout zu visualisieren, ohne vom eigentlichen Inhalt abgelenkt zu werden. Ideal für Webdesign, UI/UX-Projekte, die Verwendung in Figma und die Erstellung von Themes. Das Tool bietet natürlich aussehenden Text, solange der endgültige Inhalt noch nicht verfügbar ist. Lorem Ipsum ist der Industriestandard in Typografie und Design für Layout-Tests und daher für Frontend-Profis und Marketingteams unerlässlich.",
    qty: "Menge",
    paragraphs: "Absätze",
    words: "Wörter",
    sentences: "Sätze",
    lists: "Listen",
    tags: "HTML-Absatz-Tags hinzufügen",
    lorem: "Beginnen mit 'Lorem ipsum'",
    gen: "Generieren",
    result: "Ergebnis",
    features_title: "Hauptvorteile",
    f_1: "Sofortiger Platzhaltertext: Generieren Sie Lorem-Ipsum-Absätze, Sätze, Wörter oder Listen mit einem Klick, ohne Anmeldung oder Installation.",
    f_2: "Flexible Ausgabe: Wählen Sie genaue Mengen und fügen Sie HTML-Absatz-Tags zur direkten Verwendung in Ihrem Code, CMS oder Design-Tool hinzu.",
    f_3: "Perfekt für Designer und Entwickler: Ideal für Mockups, Wireframes, Website-Vorlagen, App-Prototypen, Präsentationen und Demos.",
    how_to_use_title: "Verwendung",
    step_1_title: "Wählen Sie die Menge",
    step_1_desc: "Geben Sie an, wie viele Absätze, Sätze, Wörter oder Listenelemente Sie für Ihr Projekt benötigen.",
    step_2_title: "Optionen auswählen",
    step_2_desc: "Aktivieren Sie HTML-Absatz-Tags für Webprojekte oder beginnen Sie mit der klassischen Eröffnung 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Generieren und kopieren",
    step_3_desc: "Wählen Sie den gewünschten Inhaltstyp und kopieren Sie den Platzhaltertext direkt in Ihr Design-Tool oder Ihren Code-Editor.",
    faq_title: "Häufig gestellte Fragen",
    faq_1_q: "Was ist Lorem Ipsum und wofür wird es verwendet?",
    faq_1_a: "Es ist ein Standardtext in Pseudo-Latein, der in der Druck- und Webdesign-Industrie verwendet wird, um Texträume in Mockups und Wireframes zu füllen, sodass Designer das Layout und die Typografie bewerten können, ohne vom Inhalt abgelenkt zu werden.",
    faq_2_q: "Warum Pseudo-Text anstelle von echtem Text verwenden?",
    faq_2_a: "Die Verwendung von echtem Text kann dazu führen, dass sich Gutachter und Kunden auf die geschriebene Nachricht anstatt auf das Design konzentrieren. Lorem Ipsum hat eine normale Buchstabenverteilung, die das visuelle Gewicht natürlicher Inhalte perfekt imitiert.",
    faq_3_q: "Hat der generierte Text eine versteckte Bedeutung oder unangemessene Wörter?",
    faq_3_a: "Nein. Unser Generator verwendet das klassische Format, das auf lateinischen Originaltexten aus dem 1. Jahrhundert basiert, und stellt sicher, dass sich keine peinlichen Wörter oder versteckten Witze in der Mitte des Fülltextes befinden.",
    faq_4_q: "Kann ich den generierten Text in kommerziellen Projekten verwenden?",
    faq_4_a: "Ja! Alle Platzhaltertexte, die von diesem Tool generiert werden, sind völlig kostenlos und urheberrechtsfrei und können in jedem privaten oder kommerziellen Projekt wie Websites, Apps und Themes verwendet werden.",
    see1: "Wortzähler",
    see2: "Textkonverter",
    see3: "ASCII-Buchstaben-Generator",
    see4: "Ausgefallene Buchstaben",
  },
  nl: {
    title: "Lorem Ipsum Generator",
    meta_title: "Lorem Ipsum Generator — Gratis Placeholder Tekst Online",
    meta: "Gratis Lorem Ipsum generator online. Maak placeholder tekst — paragrafen, zinnen, woorden en lijsten voor webdesign, Figma, Sketch en prototyping.",
    desc: "Onze Lorem Ipsum Generator maakt direct vultekst voor ontwerpers en ontwikkelaars. Gebruik placeholders in wireframes, mockups en prototypes om de uiteindelijke lay-out te visualiseren zonder te worden afgeleid door de echte inhoud. Ideaal voor webdesign, UI/UX-projecten, gebruik in Figma en het maken van thema's. De tool biedt natuurlijk ogende tekst terwijl de definitieve inhoud nog niet beschikbaar is. Lorem Ipsum is de industriestandaard in typografie en design voor lay-outtests, waardoor het essentieel is voor frontend-professionals en marketingteams.",
    qty: "Aantal",
    paragraphs: "Paragrafen",
    words: "Woorden",
    sentences: "Zinnen",
    lists: "Lijsten",
    tags: "HTML-paragraaftags toevoegen",
    lorem: "Begin met 'Lorem ipsum'",
    gen: "Genereren",
    result: "Resultaat",
    features_title: "Belangrijkste Voordelen",
    f_1: "Directe Placeholder Tekst: Genereer Lorem Ipsum paragrafen, zinnen, woorden of lijsten met één klik, zonder registratie of installatie.",
    f_2: "Flexibele Output: Kies exacte hoeveelheden en voeg HTML-paragraaftags toe voor direct gebruik in uw code, CMS of ontwerptool.",
    f_3: "Perfect voor Ontwerpers & Ontwikkelaars: Ideaal voor mockups, wireframes, websitesjablonen, app-prototypes, presentaties en demo's.",
    how_to_use_title: "Hoe te Gebruiken",
    step_1_title: "Kies de hoeveelheid",
    step_1_desc: "Geef aan hoeveel paragrafen, zinnen, woorden of lijstitems u nodig heeft voor uw project.",
    step_2_title: "Selecteer opties",
    step_2_desc: "Schakel HTML-paragraaftags in voor webprojecten, of begin met de klassieke opening 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Genereer en kopieer",
    step_3_desc: "Selecteer het gewenste inhoudstype en kopieer de placeholder tekst direct naar uw ontwerptool of code-editor.",
    faq_title: "Veelgestelde Vragen",
    faq_1_q: "Wat is Lorem Ipsum en waarvoor wordt het gebruikt?",
    faq_1_a: "Het is een standaard pseudo-Latijnse tekst die wordt gebruikt in de grafische en webdesign-industrie om tekstvakken in mockups en wireframes te vullen, zodat ontwerpers de lay-out en typografie kunnen evalueren zonder door de inhoud te worden afgeleid.",
    faq_2_q: "Waarom dummytekst gebruiken in plaats van echte tekst?",
    faq_2_a: "Het gebruik van echte tekst kan ertoe leiden dat reviewers en klanten zich concentreren op de geschreven boodschap in plaats van op het ontwerp. Lorem Ipsum heeft een normale letterverdeling, die het visuele gewicht van natuurlijke inhoud perfect nabootst.",
    faq_3_q: "Heeft de gegenereerde tekst een verborgen betekenis of ongepaste woorden?",
    faq_3_a: "Nee. Onze generator gebruikt het klassieke formaat op basis van originele Latijnse teksten uit de 1e eeuw, wat garandeert dat er geen gênante woorden of verborgen grappen in het midden van de vultekst staan.",
    faq_4_q: "Kan ik de gegenereerde tekst in commerciële projecten gebruiken?",
    faq_4_a: "Ja! Alle placeholder tekst die door deze tool wordt gegenereerd, is volledig gratis en vrij van auteursrechten en kan worden gebruikt in elk persoonlijk of commercieel project, zoals websites, apps en thema's.",
    see1: "Woordenteller",
    see2: "Tekst Converter",
    see3: "ASCII Letter Generator",
    see4: "Aparte Letters",
  },
  ru: {
    title: "Генератор Lorem Ipsum",
    meta_title: "Генератор Lorem Ipsum — бесплатный текст-рыба онлайн",
    meta: "Бесплатный онлайн-генератор Lorem Ipsum. Создавайте текст-рыбу: абзацы, предложения, слова и списки для веб-дизайна, Figma, Sketch и прототипирования.",
    desc: "Наш генератор Lorem Ipsum мгновенно создает текст-рыбу (заполнитель) для дизайнеров и разработчиков. Используйте плейсхолдеры в вайрфреймах, макетах и прототипах, чтобы визуализировать конечный макет, не отвлекаясь на реальный контент. Инструмент идеально подходит для веб-дизайна, UI/UX-проектов, работы в Figma и создания тем, предлагая текст с естественной структурой, пока окончательный контент еще не готов. Lorem Ipsum является стандартом в типографике и дизайне для тестирования разметки, что делает его незаменимым для фронтенд-разработчиков и маркетологов.",
    qty: "Количество",
    paragraphs: "Абзацы",
    words: "Слова",
    sentences: "Предложения",
    lists: "Списки",
    tags: "Добавить HTML-теги абзаца",
    lorem: "Начинать с 'Lorem ipsum'",
    gen: "Сгенерировать",
    result: "Результат",
    features_title: "Основные преимущества",
    f_1: "Мгновенный плейсхолдер: создавайте абзацы, предложения, слова или списки Lorem Ipsum в один клик, без регистрации и установки.",
    f_2: "Гибкие настройки: выбирайте точное количество и добавляйте HTML-теги абзацев для прямого использования в коде, CMS или редакторах.",
    f_3: "Идеально для работы: отлично подходит для макетов, вайрфреймов, шаблонов сайтов, прототипов приложений и презентаций.",
    how_to_use_title: "Как использовать",
    step_1_title: "Выберите количество",
    step_1_desc: "Укажите, сколько абзацев, предложений, слов или элементов списка вам необходимо для вашего проекта.",
    step_2_title: "Выберите параметры",
    step_2_desc: "Включите HTML-теги абзацев для веб-проектов или начните с классического вступления 'Lorem ipsum dolor sit amet'.",
    step_3_title: "Сгенерируйте и скопируйте",
    step_3_desc: "Выберите нужный тип контента и скопируйте сгенерированный текст-заполнитель прямо в ваш графический редактор или среду разработки.",
    faq_title: "Часто задаваемые вопросы",
    faq_1_q: "Что такое Lorem Ipsum и для чего он используется?",
    faq_1_a: "Это стандартный псевдолатинский текст-заполнитель, используемый в полиграфии и веб-дизайне для заполнения текстовых блоков в макетах. Он позволяет оценить визуальную структуру и типографику, не отвлекаясь на смысл контента.",
    faq_2_q: "Зачем использовать макетный текст вместо реального?",
    faq_2_a: "Использование реального текста может отвлекать клиентов и рецензентов, заставляя их вчитываться в содержание вместо оценки дизайна. Lorem Ipsum имеет нормальное распределение букв, идеально имитируя визуальный вес естественного языка.",
    faq_3_q: "Содержит ли сгенерированный текст скрытый смысл или ненормативную лексику?",
    faq_3_a: "Нет. Наш генератор использует классический формат на основе оригинальных латинских текстов I века до н.э., гарантируя отсутствие двусмысленных слов или скрытых шуток посреди текста-заполнителя.",
    faq_4_q: "Можно ли использовать сгенерированный текст в коммерческих проектах?",
    faq_4_a: "Да! Весь текст-заполнитель, создаваемый этим инструментом, полностью бесплатен и не защищен авторским правом. Вы можете свободно использовать его в любых личных и коммерческих проектах, включая сайты, приложения и темы оформления.",
    see1: "Счетчик текста",
    see2: "Конвертер текста",
    see3: "Генератор ASCII-букв",
    see4: "Красивые буквы",
  }
}
</i18n>
