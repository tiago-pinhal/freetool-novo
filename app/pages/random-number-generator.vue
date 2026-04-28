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
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') }
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
    id: '/generator-angka-acak'
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
          <span>{{ t('err') }}</span>
        </div>

        <div v-if="!state.output && !state.err" class="text-center opacity-70">
          <Icon name="heroicons:hashtag" class="w-16 h-16 mx-auto mb-2" />
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <section>
          <p class="mb-4">{{ t('d1') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:play-circle-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_to_use_title') }}
          </h2>
          <div class="grid sm:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="flex flex-col gap-2 bg-base-200/40 p-4 rounded-xl border border-primary/20">
              <span class="text-3xl font-black text-primary/30 leading-none">{{ i }}</span>
              <span class="font-bold text-base-content">{{ t(`step_${i}_title`) }}</span>
              <span class="text-sm text-base-content/70">{{ t(`step_${i}_desc`) }}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:check-badge-20-solid" class="w-6 h-6 text-primary" />
            {{ t('features_title') }}
          </h2>
          <ul class="grid sm:grid-cols-2 gap-3">
            <li
              v-for="i in 4"
              :key="i"
              class="flex items-start gap-2 bg-base-200/40 p-3 rounded-xl border border-primary/20"
            >
              <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 text-success shrink-0 mt-0.5" />
              <span>{{ t(`f_${i}`) }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:briefcase-20-solid" class="w-6 h-6 text-primary" />
            {{ t('use_cases_title') }}
          </h2>
          <ul class="grid sm:grid-cols-2 gap-3">
            <li
              v-for="i in 4"
              :key="i"
              class="flex items-start gap-2 bg-base-200/40 p-3 rounded-xl border border-primary/20"
            >
              <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 text-success shrink-0 mt-0.5" />
              <span>{{ t(`uc_${i}`) }}</span>
            </li>
          </ul>
        </section>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
            { question: t('faq_5_q'), answer: t('faq_5_a') }
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
    placeholder: "Ready to generate",
    about_title: "Random Number Generator",
    how_to_use_title: "How to use",
    step_1_title: "Configure Range",
    step_1_desc: "Set the minimum and maximum values for your numbers.",
    step_2_title: "Generate",
    step_2_desc: "Set the quantity, sort order, and click Generate Numbers.",
    step_3_title: "Copy",
    step_3_desc: "Use the copy button to save the result to your clipboard.",
    d1: "Free online tool for generating random numbers with a custom range and quantity. Ideal for raffles, lotteries, games, simulations, software testing, and statistical analysis. Generate unique or repeated numbers with flexible sorting options.",
    features_title: "Key Features",
    f_1: "Custom Range: Set minimum and maximum values to generate numbers within your specific interval.",
    f_2: "Multiple Numbers: Specify exactly how many numbers to generate in a single operation.",
    f_3: "Repetition Control: Choose whether generated numbers can repeat or must be unique.",
    f_4: "Flexible Sorting: Organize results in ascending, descending, or random order.",
    use_cases_title: "Use Cases",
    uc_1: "Raffles & Lotteries: Generate random numbers to select winners or lottery combinations fairly.",
    uc_2: "Games & Simulations: Create random elements for game mechanics or computer simulations.",
    uc_3: "Software Testing: Produce varied input data to test system functionalities.",
    uc_4: "Statistical Analysis: Obtain random samples for quantitative studies and research.",
    faq_title: "Frequently Asked Questions",
    faq_1_q: "Are the generated numbers truly random?",
    faq_1_a: "Yes. We use standard programming algorithms that generate pseudorandom numbers suitable for most applications such as raffles, games, and simulations.",
    faq_2_q: "Can I generate numbers for the lottery?",
    faq_2_a: "Yes! Set the range (e.g., 1-60) and quantity (e.g., 6), disable repetition, and generate your combination. Works great for any lottery format.",
    faq_3_q: "What is the maximum quantity I can generate?",
    faq_3_a: "There is no fixed limit. You can generate hundreds or thousands of numbers. For unique numbers, the quantity is capped by the range size (e.g., range 1-100 allows at most 100 unique numbers).",
    faq_4_q: "Can numbers repeat?",
    faq_4_a: "You control this! Enable 'Allow Number Repetition' for repeated numbers, or leave it off for unique numbers only.",
    faq_5_q: "Is the generator free?",
    faq_5_a: "Yes, completely free and unlimited. Generate as many numbers as you need with no registration or payment required.",
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
    placeholder: "Pronto para gerar",
    about_title: "Gerador de Números Aleatórios",
    how_to_use_title: "Como usar",
    step_1_title: "Configurar Intervalo",
    step_1_desc: "Defina os valores mínimo e máximo para os seus números.",
    step_2_title: "Gerar",
    step_2_desc: "Defina a quantidade, a ordenação e clique em Gerar Números.",
    step_3_title: "Copiar",
    step_3_desc: "Use o botão de copiar para enviar o resultado à área de transferência.",
    d1: "Ferramenta online gratuita para gerar números aleatórios com intervalo e quantidade personalizados. Ideal para sorteios, loteria, jogos, simulações, testes de software e análises estatísticas. Gere números únicos ou repetidos com opções flexíveis de ordenação.",
    features_title: "Funcionalidades Principais",
    f_1: "Intervalo Personalizado: Defina valores mínimo e máximo para gerar números dentro do seu intervalo específico.",
    f_2: "Quantidade Definida: Especifique quantos números deseja gerar em uma única operação.",
    f_3: "Controle de Repetição: Escolha se os números gerados podem repetir ou devem ser únicos.",
    f_4: "Ordenação Flexível: Organize os resultados em ordem crescente, decrescente ou aleatória.",
    use_cases_title: "Casos de Uso",
    uc_1: "Sorteios e Loteria: Gere números aleatórios para selecionar vencedores de forma imparcial.",
    uc_2: "Jogos e Simulações: Crie elementos aleatórios para dinâmicas de jogos ou simulações computacionais.",
    uc_3: "Testes de Software: Produza dados de entrada variados para testar funcionalidades de sistemas.",
    uc_4: "Análises Estatísticas: Obtenha amostras aleatórias para estudos e pesquisas quantitativas.",
    faq_title: "Perguntas Frequentes",
    faq_1_q: "Os números gerados são realmente aleatórios?",
    faq_1_a: "Sim. Utilizamos algoritmos de programação padrão que geram números pseudoaleatórios adequados para a maioria das aplicações como sorteios, jogos e simulações.",
    faq_2_q: "Posso gerar números para loteria?",
    faq_2_a: "Sim! Configure o intervalo (ex: 1-60) e quantidade (ex: 6 números), desative a repetição e gere sua combinação. Perfeito para Mega-Sena, Quina, Lotofácil e outras loterias.",
    faq_3_q: "Qual a quantidade máxima que posso gerar?",
    faq_3_a: "Não há limite fixo. Você pode gerar centenas ou milhares de números. Para números sem repetição, a quantidade é limitada pelo intervalo (ex: intervalo 1-100 permite no máximo 100 números únicos).",
    faq_4_q: "Os números podem se repetir?",
    faq_4_a: "Você controla isso! Ative 'Permitir Repetição' para números repetidos, ou desative para apenas números únicos.",
    faq_5_q: "O gerador é gratuito?",
    faq_5_a: "Sim, totalmente gratuito e sem limites. Gere quantos números precisar sem cadastro ou pagamento.",
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
    placeholder: "Listo para generar",
    about_title: "Generador de Números Aleatorios",
    how_to_use_title: "Cómo usar",
    step_1_title: "Configurar Rango",
    step_1_desc: "Establece los valores mínimo y máximo para tus números.",
    step_2_title: "Generar",
    step_2_desc: "Define la cantidad, el orden y haz clic en Generar Números.",
    step_3_title: "Copiar",
    step_3_desc: "Usa el botón de copiar para enviar el resultado al portapapeles.",
    d1: "Herramienta online gratuita para generar números aleatorios con rango y cantidad personalizados. Ideal para sorteos, lotería, juegos, simulaciones, pruebas de software y análisis estadístico. Genera números únicos o repetidos con opciones flexibles de ordenación.",
    features_title: "Funcionalidades Principales",
    f_1: "Rango Personalizado: Define valores mínimo y máximo para generar números en tu intervalo específico.",
    f_2: "Cantidad Definida: Especifica cuántos números generar en una sola operación.",
    f_3: "Control de Repetición: Elige si los números generados pueden repetirse o deben ser únicos.",
    f_4: "Ordenación Flexible: Organiza los resultados en orden ascendente, descendente o aleatorio.",
    use_cases_title: "Casos de Uso",
    uc_1: "Sorteos y Lotería: Genera números aleatorios para seleccionar ganadores de forma imparcial.",
    uc_2: "Juegos y Simulaciones: Crea elementos aleatorios para dinámicas de juegos o simulaciones.",
    uc_3: "Pruebas de Software: Produce datos de entrada variados para probar funcionalidades del sistema.",
    uc_4: "Análisis Estadístico: Obtén muestras aleatorias para estudios y análisis cuantitativos.",
    faq_title: "Preguntas Frecuentes",
    faq_1_q: "¿Los números generados son realmente aleatorios?",
    faq_1_a: "Sí. Utilizamos algoritmos de programación estándar que generan números pseudoaleatorios adecuados para la mayoría de aplicaciones como sorteos, juegos y simulaciones.",
    faq_2_q: "¿Puedo generar números para la lotería?",
    faq_2_a: "¡Sí! Configura el intervalo (ej: 1-60) y la cantidad (ej: 6 números), desactiva la repetición y genera tu combinación.",
    faq_3_q: "¿Cuál es la cantidad máxima que puedo generar?",
    faq_3_a: "No hay un límite fijo. Para números sin repetición, la cantidad está limitada por el tamaño del intervalo (ej: intervalo 1-100 permite como máximo 100 números únicos).",
    faq_4_q: "¿Los números pueden repetirse?",
    faq_4_a: "¡Tú decides! Activa 'Permitir Repetición' para números repetidos o desactívalo para obtener únicamente números únicos.",
    faq_5_q: "¿El generador es gratuito?",
    faq_5_a: "Sí, completamente gratuito y sin límites. Genera todos los números que necesites sin registro ni pago.",
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
    placeholder: "Prêt à générer",
    about_title: "Générateur de Nombres Aléatoires",
    how_to_use_title: "Comment utiliser l'outil",
    step_1_title: "Configurer l'Intervalle",
    step_1_desc: "Définissez les valeurs minimale et maximale de vos nombres.",
    step_2_title: "Générer",
    step_2_desc: "Définissez la quantité, l'ordre et cliquez sur Générer des Nombres.",
    step_3_title: "Copier",
    step_3_desc: "Utilisez le bouton de copie pour envoyer le résultat dans le presse-papiers.",
    d1: "Outil en ligne gratuit pour générer des nombres aléatoires avec un intervalle et une quantité personnalisés. Idéal pour les tirages au sort, la loterie, les jeux, les simulations et les analyses statistiques. Générez des nombres uniques ou répétés avec des options de tri flexibles.",
    features_title: "Fonctionnalités Principales",
    f_1: "Intervalle Personnalisé: Définissez des valeurs minimale et maximale pour votre intervalle spécifique.",
    f_2: "Nombres Multiples: Spécifiez combien de nombres générer en une seule opération.",
    f_3: "Contrôle des Répétitions: Choisissez si les nombres peuvent se répéter ou doivent être uniques.",
    f_4: "Tri Flexible: Organisez les résultats par ordre croissant, décroissant ou aléatoire.",
    use_cases_title: "Cas d'Utilisation",
    uc_1: "Tirages et Loterie: Générez des nombres aléatoires pour sélectionner des gagnants de manière équitable.",
    uc_2: "Jeux et Simulations: Créez des éléments aléatoires pour des dynamiques de jeux ou des simulations.",
    uc_3: "Tests Logiciels: Produisez des données d'entrée variées pour tester des fonctionnalités système.",
    uc_4: "Analyses Statistiques: Obtenez des échantillons aléatoires pour des études et analyses quantitatives.",
    faq_title: "Questions Fréquentes",
    faq_1_q: "Les nombres générés sont-ils vraiment aléatoires?",
    faq_1_a: "Oui. Nous utilisons des algorithmes standard qui génèrent des nombres pseudo-aléatoires adaptés à la plupart des applications comme les tirages au sort, les jeux et les simulations.",
    faq_2_q: "Puis-je générer des nombres pour la loterie?",
    faq_2_a: "Oui! Configurez l'intervalle (ex: 1-60) et la quantité (ex: 6 nombres), désactivez la répétition et générez votre combinaison.",
    faq_3_q: "Quelle est la quantité maximale que je peux générer?",
    faq_3_a: "Il n'y a pas de limite fixe. Pour des nombres sans répétition, la quantité est limitée par la taille de l'intervalle (ex: intervalle 1-100 permet au maximum 100 nombres uniques).",
    faq_4_q: "Les nombres peuvent-ils se répéter?",
    faq_4_a: "Vous contrôlez cela! Activez 'Autoriser la Répétition' pour des nombres répétés ou désactivez pour des nombres uniquement uniques.",
    faq_5_q: "Le générateur est-il gratuit?",
    faq_5_a: "Oui, totalement gratuit et sans limites. Générez autant de nombres que vous en avez besoin sans inscription ni paiement.",
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
    placeholder: "Pronto per generare",
    about_title: "Generatore di Numeri Casuali",
    how_to_use_title: "Come usare lo strumento",
    step_1_title: "Configura Intervallo",
    step_1_desc: "Imposta i valori minimo e massimo per i tuoi numeri.",
    step_2_title: "Genera",
    step_2_desc: "Imposta la quantità, l'ordinamento e fai clic su Genera Numeri.",
    step_3_title: "Copia",
    step_3_desc: "Usa il pulsante di copia per inviare il risultato negli appunti.",
    d1: "Strumento online gratuito per generare numeri casuali con intervallo e quantità personalizzati. Ideale per estrazioni, lotterie, giochi, simulazioni, test software e analisi statistiche. Genera numeri unici o ripetuti con opzioni di ordinamento flessibili.",
    features_title: "Funzionalità Principali",
    f_1: "Intervallo Personalizzato: Imposta valori minimo e massimo per il tuo intervallo specifico.",
    f_2: "Numeri Multipli: Specifica quanti numeri generare in una singola operazione.",
    f_3: "Controllo della Ripetizione: Scegli se i numeri possono ripetersi o devono essere unici.",
    f_4: "Ordinamento Flessibile: Organizza i risultati in ordine crescente, decrescente o casuale.",
    use_cases_title: "Casi d'Uso",
    uc_1: "Estrazioni e Lotterie: Genera numeri casuali per selezionare vincitori in modo imparziale.",
    uc_2: "Giochi e Simulazioni: Crea elementi casuali per dinamiche di gioco o simulazioni.",
    uc_3: "Test Software: Produci dati di input variati per testare funzionalità di sistema.",
    uc_4: "Analisi Statistiche: Ottieni campioni casuali per studi e ricerche quantitative.",
    faq_title: "Domande Frequenti",
    faq_1_q: "I numeri generati sono davvero casuali?",
    faq_1_a: "Sì. Utilizziamo algoritmi standard che generano numeri pseudo-casuali adatti alla maggior parte delle applicazioni come estrazioni, giochi e simulazioni.",
    faq_2_q: "Posso generare numeri per la lotteria?",
    faq_2_a: "Sì! Imposta l'intervallo (es: 1-60) e la quantità (es: 6 numeri), disattiva la ripetizione e genera la tua combinazione.",
    faq_3_q: "Qual è la quantità massima che posso generare?",
    faq_3_a: "Non c'è un limite fisso. Per numeri senza ripetizione, la quantità è limitata dalla dimensione dell'intervallo (es: intervallo 1-100 consente al massimo 100 numeri unici).",
    faq_4_q: "I numeri possono ripetersi?",
    faq_4_a: "Puoi controllarlo! Attiva 'Consenti Ripetizione' per numeri ripetuti o disattivalo per numeri esclusivamente unici.",
    faq_5_q: "Il generatore è gratuito?",
    faq_5_a: "Sì, completamente gratuito e senza limiti. Genera quanti numeri ti servono senza registrazione né pagamento.",
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
    placeholder: "Siap untuk menghasilkan",
    about_title: "Generator Angka Acak",
    how_to_use_title: "Cara menggunakan alat ini",
    step_1_title: "Atur Rentang",
    step_1_desc: "Tetapkan nilai minimum dan maksimum untuk angka Anda.",
    step_2_title: "Buat",
    step_2_desc: "Atur jumlah, urutan, dan klik Buat Angka.",
    step_3_title: "Salin",
    step_3_desc: "Gunakan tombol salin untuk menyalin hasil ke papan klip.",
    d1: "Alat online gratis untuk menghasilkan angka acak dengan rentang dan jumlah yang dapat disesuaikan. Ideal untuk undian, lotere, permainan, simulasi, pengujian perangkat lunak, dan analisis statistik. Hasilkan angka unik atau berulang dengan opsi pengurutan yang fleksibel.",
    features_title: "Fitur Utama",
    f_1: "Rentang Kustom: Tetapkan nilai minimum dan maksimum untuk rentang spesifik Anda.",
    f_2: "Banyak Angka: Tentukan berapa banyak angka yang akan dihasilkan dalam satu operasi.",
    f_3: "Kontrol Pengulangan: Pilih apakah angka yang dihasilkan dapat berulang atau harus unik.",
    f_4: "Pengurutan Fleksibel: Atur hasil dalam urutan naik, turun, atau acak.",
    use_cases_title: "Contoh Penggunaan",
    uc_1: "Undian & Lotere: Hasilkan angka acak untuk memilih pemenang secara adil.",
    uc_2: "Permainan & Simulasi: Buat elemen acak untuk dinamika permainan atau simulasi komputer.",
    uc_3: "Pengujian Perangkat Lunak: Hasilkan data masukan bervariasi untuk menguji fungsionalitas sistem.",
    uc_4: "Analisis Statistik: Dapatkan sampel acak untuk studi dan penelitian kuantitatif.",
    faq_title: "Pertanyaan Umum",
    faq_1_q: "Apakah angka yang dihasilkan benar-benar acak?",
    faq_1_a: "Ya. Kami menggunakan algoritma pemrograman standar yang menghasilkan angka semu-acak yang cocok untuk sebagian besar aplikasi seperti undian, permainan, dan simulasi.",
    faq_2_q: "Bisakah saya menghasilkan angka untuk lotere?",
    faq_2_a: "Ya! Atur rentang (mis: 1-60) dan jumlah (mis: 6 angka), nonaktifkan pengulangan, dan hasilkan kombinasi Anda.",
    faq_3_q: "Berapa jumlah maksimum yang dapat saya hasilkan?",
    faq_3_a: "Tidak ada batas tetap. Untuk angka tanpa pengulangan, jumlahnya dibatasi oleh ukuran rentang (mis: rentang 1-100 mengizinkan maksimal 100 angka unik).",
    faq_4_q: "Apakah angka dapat berulang?",
    faq_4_a: "Anda yang mengontrol! Aktifkan 'Izinkan Pengulangan' untuk angka berulang atau nonaktifkan untuk angka yang sepenuhnya unik.",
    faq_5_q: "Apakah generator ini gratis?",
    faq_5_a: "Ya, sepenuhnya gratis dan tanpa batas. Hasilkan angka sebanyak yang Anda butuhkan tanpa pendaftaran atau pembayaran.",
    see1: "Generator Kata Sandi",
    see2: "Generator Kartu Kredit",
    see3: "Generator CPF",
    see4: "Generator UUID"
  }
}
</i18n>
