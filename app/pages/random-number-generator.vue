<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

interface State {
  min: number | null
  max: number | null
  qty: number | null
  output: string | null
  allowRepetition: boolean
  order: 'asc' | 'desc' | 'rand'
  err: boolean
  ads: boolean
}

const state: State = reactive({
  min: 1,
  max: 60,
  qty: 6,
  output: null,
  allowRepetition: false,
  order: 'rand',
  err: false,
  ads: false
})

function generate() {
  if (state.min == null || state.max == null || state.qty == null) return

  if (state.qty > 5000) {
    state.err = true
    state.output = null
    return
  }

  let arr = generateNumbers(state.min, state.max, state.qty, state.allowRepetition)

  if (arr.length > 0) {
    if (state.order === 'asc') arr = arr.sort((a, b) => a - b)
    if (state.order === 'desc') arr = arr.sort((a, b) => b - a)
    state.output = arr.join(' - ')
  } else {
    state.output = null
  }
}

function generateNumbers(min: number, max: number, qty: number, allowRepetition: boolean): number[] {
  if (!state.ads) state.ads = true

  if (!allowRepetition && qty > (max - min + 1)) {
    state.err = true
    return []
  }

  state.err = false

  if (allowRepetition) {
    return Array.from({ length: qty }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  } else if (qty < 0.5 * (max - min + 1)) {
    const set = new Set<number>()
    while (set.size < qty) set.add(Math.floor(Math.random() * (max - min + 1)) + min)
    return [...set]
  } else {
    const all = Array.from({ length: max - min + 1 }, (_, i) => i + min)
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[all[i], all[j]] = [all[j], all[i]]
    }
    return all.slice(0, qty)
  }
}

function copy() {
  if (state.output) navigator.clipboard.writeText(state.output)
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') }
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }]
})

defineI18nRoute({
  paths: {
    en: '/random-number-generator',
    pt: '/gerador-de-numeros-aleatorios',
    es: '/generador-de-numeros-aleatorios',
    fr: '/generateur-de-nombres-aleatoires',
    it: '/generatore-di-numeri-casuali',
    id: '/generator-angka-acak',
    de: '/zufallszahlengenerator',
    nl: '/willekeurige-getallen-generator'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'password-generator' },
      { label: t('see2'), to: 'credit-card-generator' },
      { label: t('see3'), to: 'cpf-generator' },
      { label: t('see4'), to: 'uuid-generator' }
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls -->
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label for="min" class="label">
              <span class="label-text font-bold text-base-content/80">{{ t('min') }}</span>
            </label>
            <input
              id="min"
              type="number"
              v-model="state.min"
              min="1"
              class="input input-bordered w-full bg-base-200 focus:bg-base-200 rounded-xl font-bold"
              required
              autofocus
            />
          </div>

          <div class="form-control">
            <label for="max" class="label">
              <span class="label-text font-bold text-base-content/80">{{ t('max') }}</span>
            </label>
            <input
              id="max"
              type="number"
              v-model="state.max"
              :min="state.min || 0"
              class="input input-bordered w-full bg-base-200 focus:bg-base-200 rounded-xl font-bold"
              required
            />
          </div>

          <div class="form-control">
            <label for="qty" class="label">
              <span class="label-text font-bold text-base-content/80">{{ t('qty') }}</span>
            </label>
            <input
              id="qty"
              type="number"
              v-model="state.qty"
              min="1"
              max="5000"
              class="input input-bordered w-full bg-base-200 focus:bg-base-200 rounded-xl font-bold"
              required
            />
          </div>

          <div class="form-control">
            <label for="order" class="label">
              <span class="label-text font-bold text-base-content/80">{{ t('order') }}</span>
            </label>
            <select
              id="order"
              v-model="state.order"
              class="select select-bordered w-full bg-base-200 focus:bg-base-200 rounded-xl font-bold"
            >
              <option value="rand">{{ t('rand') }}</option>
              <option value="asc">{{ t('asc') }}</option>
              <option value="desc">{{ t('desc') }}</option>
            </select>
          </div>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" v-model="state.allowRepetition" class="toggle toggle-primary" />
            <span class="label-text font-medium">{{ t('repet') }}</span>
          </label>
        </div>

        <ButtonPrimary @click="generate" icon="heroicons:sparkles-20-solid" class="w-full h-14 text-lg">
          {{ t('bt') }}
        </ButtonPrimary>
      </div>

      <!-- Right Column: Result -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[16rem] flex flex-col items-center justify-center">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div v-if="state.output" class="text-center space-y-4 w-full">
            <p class="text-sm font-bold uppercase tracking-widest text-base-content/50">{{ t('result') }}</p>
            <p class="text-2xl font-black text-primary break-all leading-relaxed">{{ state.output }}</p>
            <ButtonIndicator @onClick="copy" class="mx-auto">{{ t('copy') }}</ButtonIndicator>
          </div>
        </Transition>

        <div v-if="state.err" class="alert alert-error rounded-2xl border-none text-white">
          <Icon name="heroicons:x-circle-20-solid" class="w-5 h-5 shrink-0" />
          <span>{{ state.qty && state.qty > 5000 ? t('err_max') : t('err') }}</span>
        </div>

        <div v-if="!state.output && !state.err" class="text-center opacity-70">
          <Icon name="heroicons:hashtag" class="w-16 h-16 mx-auto mb-2" />
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <div>
          <p>{{ t('d1') }}</p>
        </div>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') },
            { title: t('uc_4_title'), description: t('uc_4_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_it_works_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

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
    pageTitle: "Random Number Generator - Generate Numbers Online | Free",
    title: "Random Number Generator",
    meta: "Free online random number generator. Set a custom range and quantity to create sequences for raffles, lotteries, games, simulations, and statistical analysis.",
    min: "Minimum Value",
    max: "Maximum Value",
    qty: "Quantity",
    order: "Sort Order",
    rand: "Random",
    asc: "Ascending",
    desc: "Descending",
    repet: "Allow Number Repetition",
    bt: "Generate Numbers",
    result: "Generated Numbers",
    copy: "Copy",
    err: "The requested quantity exceeds the allowed range without repetition",
    err_max: "The maximum quantity allowed is 5,000 numbers",
    placeholder: "Ready to generate",
    about_title: "Random Number Generator",
    how_it_works_title: "How It Works",
    step_1_title: "Configure Range",
    step_1_desc: "Set the minimum and maximum values for your numbers.",
    step_2_title: "Generate",
    step_2_desc: "Set the quantity, sort order, and click Generate Numbers.",
    step_3_title: "Copy",
    step_3_desc: "Use the copy button to send the result to your clipboard.",
    d1: "Free online tool for generating random numbers with a custom range and quantity. Ideal for raffles, lotteries, games, simulations, software testing, and statistical analysis. Generate unique or repeated numbers with flexible sorting options.",
    use_cases_title: "Use Cases",
    uc_1_title: "Raffles & Lotteries",
    uc_1_desc: "Generate random numbers to select winners or lottery combinations fairly.",
    uc_2_title: "Games & Board Games",
    uc_2_desc: "Create random elements for game mechanics, dice rolls, or computer simulations.",
    uc_3_title: "Software Testing",
    uc_3_desc: "Produce varied input data to test system functionalities and edge cases.",
    uc_4_title: "Statistical Sampling",
    uc_4_desc: "Obtain random samples for quantitative studies, research, and data analysis.",
    faq_title: "Questions and Answers",
    faq_1_q: "Are the generated numbers truly random?",
    faq_1_a: "Yes. We use standard programming algorithms that generate pseudorandom numbers suitable for most applications such as raffles, games, and simulations.",
    faq_2_q: "Can I generate numbers for the lottery?",
    faq_2_a: "Yes! Set the range (e.g., 1-60) and quantity (e.g., 6), disable repetition, and generate your combination. Works great for any lottery format.",
    faq_3_q: "What is the maximum quantity I can generate?",
    faq_3_a: "You can generate up to 5,000 numbers at once. This ensures the tool remains instant and the results are easy to handle. The only other requirement is mathematical: if you disable repetition, the quantity must fit within your selected range.",
    faq_4_q: "Can numbers repeat?",
    faq_4_a: "You control this! Enable 'Allow Number Repetition' for repeated numbers, or leave it off for unique numbers only.",
    see1: "Password Generator",
    see2: "Credit Card Generator",
    see3: "CPF Generator",
    see4: "UUID Generator"
  },
  pt: {
    pageTitle: "Gerador de Números Aleatórios - Gerar Números Online | Grátis",
    title: "Gerador de Números Aleatórios",
    meta: "Gerador de números aleatórios online grátis. Crie sequências personalizadas para sorteios, loteria, jogos e simulações. Defina intervalo, quantidade e ordenação.",
    min: "Valor Mínimo",
    max: "Valor Máximo",
    qty: "Quantidade a ser Gerada",
    order: "Ordenação",
    rand: "Aleatória",
    asc: "Crescente",
    desc: "Decrescente",
    repet: "Permitir a Repetição de Números",
    bt: "Gerar Números",
    result: "Números Gerados",
    copy: "Copiar",
    err: "A quantidade solicitada é maior que o intervalo permitido sem repetição",
    err_max: "A quantidade máxima permitida é de 5.000 números",
    placeholder: "Pronto para gerar",
    about_title: "Gerador de Números Aleatórios",
    how_it_works_title: "Como Funciona",
    step_1_title: "Configurar Intervalo",
    step_1_desc: "Defina os valores mínimo e máximo para os seus números.",
    step_2_title: "Gerar",
    step_2_desc: "Defina a quantidade, a ordenação e clique em Gerar Números.",
    step_3_title: "Copiar",
    step_3_desc: "Use o botão de copiar para enviar o resultado à área de transferência.",
    d1: "Ferramenta online gratuita para gerar números aleatórios com intervalo e quantidade personalizados. Ideal para sorteios, loteria, jogos, simulações, testes de software e análises estatísticas. Gere números únicos ou repetidos com opções flexíveis de ordenação.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Sorteios e Loterias",
    uc_1_desc: "Gere números aleatórios para selecionar vencedores ou combinações de loteria de forma imparcial.",
    uc_2_title: "Jogos e Tabuleiros",
    uc_2_desc: "Crie elementos aleatórios para mecânicas de jogos, rolagens de dados ou simulações computacionais.",
    uc_3_title: "Testes de Software",
    uc_3_desc: "Produza dados de entrada variados para testar funcionalidades de sistemas e casos de borda.",
    uc_4_title: "Amostragem Estatística",
    uc_4_desc: "Obtenha amostras aleatórias para estudos quantitativos, pesquisas e análise de dados.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Os números gerados são realmente aleatórios?",
    faq_1_a: "Sim. Utilizamos algoritmos de programação padrão que geram números pseudoaleatórios adequados para a maioria das aplicações como sorteios, jogos e simulações.",
    faq_2_q: "Posso gerar números para loteria?",
    faq_2_a: "Sim! Configure o intervalo (ex: 1-60) e quantidade (ex: 6 números), desative a repetição e gere sua combinação. Perfeito para Mega-Sena, Quina, Lotofácil e outras loterias.",
    faq_3_q: "Qual a quantidade máxima que posso gerar?",
    faq_3_a: "Você pode gerar até 5.000 números de uma única vez. Isso garante que a ferramenta continue instantânea e os resultados fáceis de gerenciar. O único outro requisito é matemático: se você desativar a repetição, a quantidade solicitada deve caber dentro do intervalo selecionado.",
    faq_4_q: "Os números podem se repetir?",
    faq_4_a: "Você controla isso! Ative 'Permitir Repetição' para números repetidos, ou desative para apenas números únicos.",
    see1: "Gerador de Senha",
    see2: "Gerador de Cartão de Crédito",
    see3: "Gerador de CPF",
    see4: "Gerador de UUID"
  },
  es: {
    pageTitle: "Generador de Números Aleatorios - Generar Números Online | Gratis",
    title: "Generador de Números Aleatorios",
    meta: "Generador de números aleatorios online gratuito. Crea secuencias numéricas personalizadas para sorteos, lotería, juegos, simulaciones y análisis estadístico.",
    min: "Valor Mínimo",
    max: "Valor Máximo",
    qty: "Cantidad a Generar",
    order: "Ordenación",
    rand: "Aleatoria",
    asc: "Ascendente",
    desc: "Descendente",
    repet: "Permitir Repetición de Números",
    bt: "Generar Números",
    result: "Números Generados",
    copy: "Copiar",
    err: "La cantidad solicitada supera el intervalo permitido sin repetición",
    err_max: "La cantidad máxima permitida es de 5.000 números",
    placeholder: "Listo para generar",
    about_title: "Generador de Números Aleatorios",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Configurar Rango",
    step_1_desc: "Establece los valores mínimo y máximo para tus números.",
    step_2_title: "Generar",
    step_2_desc: "Define la cantidad, el orden y haz clic en Generar Números.",
    step_3_title: "Copiar",
    step_3_desc: "Usa el botón de copiar para enviar el resultado al portapapeles.",
    d1: "Herramienta online gratuita para generar números aleatorios con rango y cantidad personalizados. Ideal para sorteos, lotería, juegos, simulaciones, pruebas de software y análisis estadístico. Genera números únicos o repetidos con opciones flexibles de ordenación.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Sorteos y Loterías",
    uc_1_desc: "Genera números aleatorios para seleccionar ganadores o combinaciones de lotería de forma imparcial.",
    uc_2_title: "Juegos y Tableros",
    uc_2_desc: "Crea elementos aleatorios para mecánicas de juegos, lanzamientos de dados o simulaciones computacionales.",
    uc_3_title: "Pruebas de Software",
    uc_3_desc: "Produce datos de entrada variados para probar funcionalidades del sistema y casos extremos.",
    uc_4_title: "Muestreo Estadístico",
    uc_4_desc: "Obtén muestras aleatorias para estudios cuantitativos, investigaciones y análisis de datos.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Los números generados son realmente aleatorios?",
    faq_1_a: "Sí. Utilizamos algoritmos de programación estándar que generan números pseudoaleatorios adecuados para la mayoría de aplicaciones como sorteos, juegos y simulaciones.",
    faq_2_q: "¿Puedo generar números para la lotería?",
    faq_2_a: "¡Sí! Configura el intervalo (ej: 1-60) y la cantidad (ej: 6 números), desactiva la repetición y genera tu combinación.",
    faq_3_q: "¿Cuál es la cantidad máxima que puedo generar?",
    faq_3_a: "Puedes generar hasta 5.000 números a la vez. Esto garantiza que la herramienta siga siendo instantánea y los resultados fáciles de manejar. El único otro requisito es matemático: si desactivas la repetición, la cantidad solicitada debe caber dentro del rango seleccionado.",
    faq_4_q: "¿Los números pueden repetirse?",
    faq_4_a: "¡Tú decides! Activa 'Permitir Repetición' para números repetidos o desactívalo para obtener únicamente números únicos.",
    see1: "Generador de Contraseña",
    see2: "Generador de Tarjeta de Crédito",
    see3: "Generador de CPF",
    see4: "Generador de UUID"
  },
  fr: {
    pageTitle: "Générateur de Nombres Aléatoires - Générer des Nombres en Ligne | Gratuit",
    title: "Générateur de Nombres Aléatoires",
    meta: "Générateur de nombres aléatoires en ligne gratuit. Créez des séquences numériques personnalisées pour des tirages, jeux, simulations et analyses statistiques.",
    min: "Valeur Minimale",
    max: "Valeur Maximale",
    qty: "Quantité à Générer",
    order: "Ordre",
    rand: "Aléatoire",
    asc: "Croissant",
    desc: "Décroissant",
    repet: "Autoriser la Répétition des Nombres",
    bt: "Générer des Nombres",
    result: "Nombres Générés",
    copy: "Copier",
    err: "La quantité demandée dépasse l'intervalle autorisé sans répétition",
    err_max: "La quantité maximale autorisée est de 5 000 nombres",
    placeholder: "Prêt à générer",
    about_title: "Générateur de Nombres Aléatoires",
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Configurer l'Intervalle",
    step_1_desc: "Définissez les valeurs minimale et maximale de vos nombres.",
    step_2_title: "Générer",
    step_2_desc: "Définissez la quantité, l'ordre et cliquez sur Générer des Nombres.",
    step_3_title: "Copier",
    step_3_desc: "Utilisez le bouton de copie pour envoyer le résultat dans le presse-papiers.",
    d1: "Outil en ligne gratuit pour générer des nombres aléatoires avec un intervalle et une quantité personnalisés. Idéal pour les tirages au sort, la loterie, les jeux, les simulations et les analyses statistiques. Générez des nombres uniques ou répétés avec des options de tri flexibles.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Tirages et Loteries",
    uc_1_desc: "Générez des nombres aléatoires pour sélectionner des gagnants ou des combinaisons de loterie de manière équitable.",
    uc_2_title: "Jeux et Plateaux",
    uc_2_desc: "Créez des éléments aléatoires pour des dynamiques de jeux, des lancers de dés ou des simulations informatiques.",
    uc_3_title: "Tests Logiciels",
    uc_3_desc: "Produisez des données d'entrée variées pour tester des fonctionnalités système et des cas limites.",
    uc_4_title: "Échantillonnage Statistique",
    uc_4_desc: "Obtenez des échantillons aléatoires pour des études quantitatives, des recherches et des analyses de données.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Les nombres générés sont-ils vraiment aléatoires?",
    faq_1_a: "Oui. Nous utilisons des algorithmes standard qui génèrent des nombres pseudo-aléatoires adaptés à la plupart des applications comme les tirages au sort, les jeux et les simulations.",
    faq_2_q: "Puis-je générer des nombres pour la loterie?",
    faq_2_a: "Oui! Configurez l'intervalle (ex: 1-60) et la quantité (ex: 6 nombres), désactivez la répétition et générez votre combinaison.",
    faq_3_q: "Quelle est la quantité maximale que je peux générer?",
    faq_3_a: "Vous pouvez générer jusqu'à 5 000 nombres à la fois. Cela garantit que l'outil reste instantané et que les résultats sont faciles à gérer. La seule autre exigence est mathématique : si vous désactivez la répétition, la quantité demandée doit tenir dans l'intervalle sélectionné.",
    faq_4_q: "Les nombres peuvent-ils se répéter?",
    faq_4_a: "Vous contrôlez cela! Activez 'Autoriser la Répétition' pour des nombres répétés ou désactivez pour des nombres uniquement uniques.",
    see1: "Générateur de Mot de Passe",
    see2: "Générateur de Carte de Crédit",
    see3: "Générateur de CPF",
    see4: "Générateur d'UUID"
  },
  it: {
    pageTitle: "Generatore di Numeri Casuali - Genera Numeri Online | Gratis",
    title: "Generatore di Numeri Casuali",
    meta: "Generatore di numeri casuali online gratuito. Crea sequenze numeriche personalizzate per estrazioni, lotterie, giochi, simulazioni e analisi statistiche.",
    min: "Valore Minimo",
    max: "Valore Massimo",
    qty: "Quantità da Generare",
    order: "Ordinamento",
    rand: "Casuale",
    asc: "Crescente",
    desc: "Decrescente",
    repet: "Consenti Ripetizione dei Numeri",
    bt: "Genera Numeri",
    result: "Numeri Generati",
    copy: "Copia",
    err: "La quantità richiesta supera l'intervallo consentito senza ripetizione",
    err_max: "La quantità massima consentita è di 5.000 numeri",
    placeholder: "Pronto per generare",
    about_title: "Generatore di Numeri Casuali",
    how_it_works_title: "Come Funziona",
    step_1_title: "Configura Intervallo",
    step_1_desc: "Imposta i valori minimo e massimo per i tuoi numeri.",
    step_2_title: "Genera",
    step_2_desc: "Imposta la quantità, l'ordinamento e fai clic su Genera Numeri.",
    step_3_title: "Copia",
    step_3_desc: "Usa il pulsante di copia per inviare il risultato negli appunti.",
    d1: "Strumento online gratuito per generare numeri casuali con intervallo e quantità personalizzati. Ideale per estrazioni, lotterie, giochi, simulazioni, test software e analisi statistiche. Genera numeri unici o ripetuti con opzioni di ordinamento flessibili.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Estrazioni e Lotterie",
    uc_1_desc: "Genera numeri casuali per selezionare vincitori o combinazioni di lotteria in modo imparziale.",
    uc_2_title: "Giochi e Tabelloni",
    uc_2_desc: "Crea elementi casuali per dinamiche di gioco, lanci di dadi o simulazioni informatiche.",
    uc_3_title: "Test Software",
    uc_3_desc: "Produci dati di input variati per testare funzionalità di sistema e casi limite.",
    uc_4_title: "Campionamento Statistico",
    uc_4_desc: "Ottieni campioni casuali per studi quantitativi, ricerche e analisi dei dati.",
    faq_title: "Domande e Risposte",
    faq_1_q: "I numeri generati sono davvero casuali?",
    faq_1_a: "Sì. Utilizziamo algoritmi standard che generano numeri pseudo-casuali adatti alla maggior parte delle applicazioni come estrazioni, giochi e simulazioni.",
    faq_2_q: "Posso generare numeri per la lotteria?",
    faq_2_a: "Sì! Imposta l'intervallo (es: 1-60) e la quantità (es: 6 numeri), disattiva la ripetizione e genera la tua combinazione.",
    faq_3_q: "Qual è la quantità massima che posso generare?",
    faq_3_a: "Puoi generare fino a 5.000 numeri alla volta. Ciò garantisce che lo strumento rimanga istantaneo e i risultati facili da gestire. L'unico altro requisito è matematico: se disattivi la ripetizione, la quantità richiesta deve rientrare nell'intervallo selezionato.",
    faq_4_q: "I numeri possono ripetersi?",
    faq_4_a: "Puoi controllarlo! Attiva 'Consenti Ripetizione' per numeri ripetuti o disattivalo per numeri esclusivamente unici.",
    see1: "Generatore di Password",
    see2: "Generatore di Carte di Credito",
    see3: "Generatore di CPF",
    see4: "Generatore di UUID"
  },
  id: {
    pageTitle: "Generator Angka Acak - Buat Angka Acak Online | Gratis",
    title: "Generator Angka Acak",
    meta: "Generator angka acak online gratis. Buat urutan angka khusus untuk undian, permainan, simulasi, dan analisis statistik dengan rentang dan jumlah yang dapat disesuaikan.",
    min: "Nilai Minimum",
    max: "Nilai Maksimum",
    qty: "Jumlah yang Dihasilkan",
    order: "Urutan",
    rand: "Acak",
    asc: "Naik",
    desc: "Turun",
    repet: "Izinkan Pengulangan Angka",
    bt: "Buat Angka",
    result: "Angka yang Dihasilkan",
    copy: "Salin",
    err: "Jumlah yang diminta melebihi rentang yang diizinkan tanpa pengulangan",
    err_max: "Jumlah maksimum yang diperbolehkan adalah 5.000 angka",
    placeholder: "Siap untuk menghasilkan",
    about_title: "Generator Angka Acak",
    how_it_works_title: "Cara Kerja",
    step_1_title: "Atur Rentang",
    step_1_desc: "Tetapkan nilai minimum dan maksimum untuk angka Anda.",
    step_2_title: "Buat",
    step_2_desc: "Atur jumlah, urutan, dan klik Buat Angka.",
    step_3_title: "Salin",
    step_3_desc: "Gunakan tombol salin untuk menyalin hasil ke papan klip.",
    d1: "Alat online gratis untuk menghasilkan angka acak dengan rentang dan jumlah yang dapat disesuaikan. Ideal untuk undian, lotere, permainan, simulasi, pengujian perangkat lunak, dan analisis statistik. Hasilkan angka unik atau berulang dengan opsi pengurutan yang fleksibel.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Undian & Lotere",
    uc_1_desc: "Hasilkan angka acak untuk memilih pemenang atau kombinasi lotere secara adil.",
    uc_2_title: "Permainan & Papan Permainan",
    uc_2_desc: "Buat elemen acak untuk dinamika permainan, lemparan dadu, atau simulasi komputer.",
    uc_3_title: "Pengujian Perangkat Lunak",
    uc_3_desc: "Hasilkan data masukan bervariasi untuk menguji fungsionalitas sistem dan kasus ekstrem.",
    uc_4_title: "Pengambilan Sampel Statistik",
    uc_4_desc: "Dapatkan sampel acak untuk studi kuantitatif, penelitian, dan analisis data.",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah angka yang dihasilkan benar-benar acak?",
    faq_1_a: "Ya. Kami menggunakan algoritma pemrograman standar yang menghasilkan angka semu-acak yang cocok untuk sebagian besar aplikasi seperti undian, permainan, dan simulasi.",
    faq_2_q: "Bisakah saya menghasilkan angka untuk lotere?",
    faq_2_a: "Ya! Atur rentang (mis: 1-60) dan jumlah (mis: 6 angka), nonaktifkan pengulangan, dan hasilkan kombinasi Anda.",
    faq_3_q: "Berapa jumlah maksimum yang dapat saya hasilkan?",
    faq_3_a: "Anda dapat menghasilkan hingga 5.000 angka sekaligus. Hal ini memastikan alat tetap instan dan hasilnya mudah dikelola. Satu-satunya syarat lainnya adalah matematis: jika Anda menonaktifkan pengulangan, jumlah yang diminta harus muat dalam rentang yang dipilih.",
    faq_4_q: "Apakah angka dapat berulang?",
    faq_4_a: "Anda yang mengontrol! Aktifkan 'Izinkan Pengulangan' untuk angka berulang atau nonaktifkan untuk angka yang sepenuhnya unik.",
    see1: "Generator Kata Sandi",
    see2: "Generator Kartu Kredit",
    see3: "Generator CPF",
    see4: "Generator UUID"
  },
  de: {
    pageTitle: "Zufallszahlengenerator - Zahlen online generieren | Kostenlos",
    title: "Zufallszahlengenerator",
    meta: "Kostenloser Online-Zufallszahlengenerator. Lege einen eigenen Bereich und eine eigene Menge fest, um Sequenzen für Verlosungen, Lotterien, Spiele, Simulationen und statistische Analysen zu erstellen.",
    min: "Minimalwert",
    max: "Maximalwert",
    qty: "Menge",
    order: "Sortierung",
    rand: "Zufällig",
    asc: "Aufsteigend",
    desc: "Absteigend",
    repet: "Zahlenwiederholung zulassen",
    bt: "Zahlen generieren",
    result: "Generierte Zahlen",
    copy: "Kopieren",
    err: "Die angeforderte Menge überschreitet den zulässigen Bereich ohne Wiederholung",
    err_max: "Die maximal zulässige Menge beträgt 5.000 Zahlen",
    placeholder: "Bereit zum Generieren",
    about_title: "Zufallszahlengenerator",
    how_it_works_title: "So funktioniert es",
    step_1_title: "Bereich konfigurieren",
    step_1_desc: "Lege die Minimal- und Maximalwerte für deine Zahlen fest.",
    step_2_title: "Generieren",
    step_2_desc: "Lege die Menge und die Sortierung fest und klicke auf Zahlen generieren.",
    step_3_title: "Kopieren",
    step_3_desc: "Nutze den Kopier-Button, um das Ergebnis in die Zwischenablage zu senden.",
    d1: "Kostenloses Online-Tool zur Generierung von Zufallszahlen mit individuellem Bereich und Menge. Ideal für Verlosungen, Lotterien, Spiele, Simulationen, Softwaretests und statistische Analysen. Generiere einzigartige oder wiederholte Zahlen mit flexiblen Sortieroptionen.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Verlosungen & Lotterien",
    uc_1_desc: "Generiere Zufallszahlen, um Gewinner oder Lotteriekombinationen fair auszuwählen.",
    uc_2_title: "Spiele & Brettspiele",
    uc_2_desc: "Erzeuge Zufallselemente für Spielmechaniken, Würfelwürfe oder Computersimulationen.",
    uc_3_title: "Softwaretests",
    uc_3_desc: "Erzeuge verschiedene Eingabedaten, um Systemfunktionen und Grenzfälle zu testen.",
    uc_4_title: "Statistische Stichproben",
    uc_4_desc: "Erhalte Zufallsstichproben für quantitative Studien, Forschung und Datenanalyse.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Sind die generierten Zahlen wirklich zufällig?",
    faq_1_a: "Ja. Wir verwenden Standardalgorithmen, die Pseudozufallszahlen generieren, die für die meisten Anwendungen wie Verlosungen, Spiele und Simulationen geeignet sind.",
    faq_2_q: "Kann ich Zahlen für die Lotterie generieren?",
    faq_2_a: "Ja! Lege den Bereich (z. B. 1-60) und die Menge (z. B. 6) fest, deaktiviere Wiederholungen und generiere deine Kombination. Funktioniert für jedes Lotterieformat.",
    faq_3_q: "Was ist die maximale Menge, die ich generieren kann?",
    faq_3_a: "Du kannst bis zu 5.000 Zahlen auf einmal generieren. Das stellt sicher, dass das Tool schnell bleibt. Die einzige andere Voraussetzung ist mathematisch: Wenn du Wiederholungen deaktivierst, muss die Menge in den gewählten Bereich passen.",
    faq_4_q: "Können sich Zahlen wiederholen?",
    faq_4_a: "Das entscheidest du! Aktiviere 'Zahlenwiederholung zulassen' für wiederholte Zahlen oder lass es deaktiviert für ausschließlich einzigartige Zahlen.",
    see1: "Passwort-Generator",
    see2: "Kreditkarten-Generator",
    see3: "CPF-Generator",
    see4: "UUID-Generator"
  },
  nl: {
    pageTitle: "Willekeurige getallen generator - Genereer getallen online | Gratis",
    title: "Willekeurige getallen generator",
    meta: "Gratis online willekeurige getallen generator. Stel een aangepast bereik en aantal in om reeksen te maken voor lotingen, loterijen, games, simulaties en statistische analyse.",
    min: "Minimumwaarde",
    max: "Maximumwaarde",
    qty: "Aantal",
    order: "Sorteervolgorde",
    rand: "Willekeurig",
    asc: "Oplopend",
    desc: "Aflopend",
    repet: "Herhaling van getallen toestaan",
    bt: "Getallen genereren",
    result: "Gegenereerde getallen",
    copy: "Kopiëren",
    err: "Het opgevraagde aantal overschrijdt het toegestane bereik zonder herhaling",
    err_max: "Het maximaal toegestane aantal is 5.000 getallen",
    placeholder: "Klaar om te genereren",
    about_title: "Willekeurige getallen generator",
    how_it_works_title: "Hoe het werkt",
    step_1_title: "Bereik configureren",
    step_1_desc: "Stel de minimum- en maximumwaarden in voor je getallen.",
    step_2_title: "Genereren",
    step_2_desc: "Stel het aantal en de sorteervolgorde in en klik op Getallen genereren.",
    step_3_title: "Kopiëren",
    step_3_desc: "Gebruik de kopieerknop om het resultaat naar je klembord te verzenden.",
    d1: "Gratis online tool voor het genereren van willekeurige getallen met een aangepast bereik en aantal. Ideaal voor lotingen, loterijen, games, simulaties, softwaretests and statistische analyse. Genereer unieke of herhaalde getallen met flexibele sorteeropties.",
    use_cases_title: "Gebruiksscenario's",
    uc_1_title: "Lotingen & loterijen",
    uc_1_desc: "Genereer willekeurige getallen om winnaars of loterijcombinaties eerlijk te selecteren.",
    uc_2_title: "Games & bordspellen",
    uc_2_desc: "Maak willekeurige elementen voor spelmechanismen, dobbelsteenworpen of computersimulaties.",
    uc_3_title: "Softwaretests",
    uc_3_desc: "Genereer gevarieerde invoergegevens om systeemfunctionaliteiten en randgevallen te testen.",
    uc_4_title: "Statistische steekproeven",
    uc_4_desc: "Verkrijg willekeurige steekproeven voor kwantitatieve studies, onderzoek en gegevensanalyse.",
    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Zijn de gegenereerde getallen echt willekeurig?",
    faq_1_a: "Ja. We gebruiken standaard algoritmen die pseudowillekeurige getallen genereren die geschikt zijn voor de meeste toepassingen zoals lotingen, games en simulaties.",
    faq_2_q: "Kan ik getallen genereren voor de loterij?",
    faq_2_a: "Ja! Stel het bereik in (bijv. 1-60) en het aantal (bijv. 6), schakel herhaling uit en genereer je combinatie. Werkt uitstekend voor elk loterijformaat.",
    faq_3_q: "Wat is het maximale aantal dat ik kan genereren?",
    faq_3_a: "Je kunt tot 5.000 getallen tegelijk genereren. Dit zorgt ervoor dat de tool direct blijft werken en de resultaten gemakkelijk te verwerken zijn. De enige andere vereiste is wiskundig: als je herhaling uitschakelt, moet het aantal binnen het geselecteerde bereik passen.",
    faq_4_q: "Kunnen getallen worden herhaald?",
    faq_4_a: "Jij hebt de controle! Schakel 'Herhaling van getallen toestaan' in voor herhaalde getallen, of laat het uitgeschakeld voor alleen unieke getallen.",
    see1: "Wachtwoordgenerator",
    see2: "Creditcardgenerator",
    see3: "CPF-generator",
    see4: "UUID-generator"
  }
}
</i18n>
