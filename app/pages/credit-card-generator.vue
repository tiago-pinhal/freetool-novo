<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/chance@1.1.13/chance.js', { trigger: 'client' })

const { t } = useI18n({ useScope: 'local' })

const brands = [
  { v: 'visa', t: 'Visa' },
  { v: 'mc', t: 'Mastercard' },
  { v: 'amex', t: 'American Express' },
  { v: 'maestro', t: 'Maestro' },
  { v: 'electron', t: 'Visa Electron' },
  { v: 'discover', t: 'Discover Card' },
  { v: 'jcb', t: 'JCB' },
  { v: 'dccarte', t: 'Diners Club Carte Blanche' },
  { v: 'dcenroute', t: 'Diners Club enRoute' },
  { v: 'dcintl', t: 'Diners Club International' },
  { v: 'dcusc', t: 'Diners Club US & Canada' },
  { v: 'instapay', t: 'InstaPayment' },
  { v: 'chinaunion', t: 'China UnionPay' },
  { v: 'bankcard', t: 'Bankcard' },
  { v: 'laser', t: 'Laser' },
  { v: 'solo', t: 'Solo' },
  { v: 'switch', t: 'Switch' },
]

const state = reactive({
  brand: 'visa',
  cardNumber: '',
  name: '',
  dt: '',
  cvv: '',
  ads: false,
})

const copiedField = ref<string | null>(null)

function generate() {
  const chance = (window as any).chance
  if (!chance) return

  const minCVV = state.brand === 'amex' ? 1000 : 100
  const maxCVV = state.brand === 'amex' ? 9999 : 999

  state.dt = chance.exp()
  state.name = chance.name().toUpperCase()
  state.cvv = chance.natural({ min: minCVV, max: maxCVV }).toString()
  state.cardNumber = chance.cc({ type: state.brand })
  if (!state.ads) state.ads = true
}

async function copy(value: string, field: string) {
  if (!value) return
  await navigator.clipboard.writeText(value).catch(() => {})
  copiedField.value = field
  setTimeout(() => { copiedField.value = null }, 2000)
}

watch(() => state.brand, () => {
  state.cardNumber = ''
  state.name = ''
  state.dt = ''
  state.cvv = ''
})

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') },
  ],
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    en: '/credit-card-generator',
    pt: '/gerador-de-cartao-de-credito',
    es: '/generador-de-tarjetas-de-credito',
    fr: '/generateur-de-carte-de-credit',
    it: '/generatore-di-carta-di-credito',
    id: '/generator-kartu-kredit',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    wiki-url="https://en.wikipedia.org/wiki/Luhn_algorithm"
    wiki-label="Luhn Algorithm (MOD 10)"
    :see-also-links="[
      { label: t('see1') + ' 🇧🇷', to: 'cpf-generator' },
      { label: t('see2') + ' 🇧🇷', to: 'cnpj-generator' },
      { label: t('see3'), to: 'birthday-generator' },
      { label: t('see4'), to: 'password-generator' },
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls -->
      <div class="space-y-5">
        <div class="form-control">
          <label class="label pb-1" for="brand-select">
            <span class="label-text font-bold text-base-content/80">{{ t('brands') }}</span>
          </label>
          <select id="brand-select" v-model="state.brand" class="select select-bordered w-full">
            <option v-for="b in brands" :key="b.v" :value="b.v">{{ b.t }}</option>
          </select>
        </div>

        <ButtonPrimary
          @click="generate"
          icon="heroicons:credit-card-20-solid"
          class="w-full h-14 text-lg"
        >
          {{ t('bt') }}
        </ButtonPrimary>
        <p class="text-sm text-base-content/50 italic px-1 text-center">{{ t('warning') }}</p>
      </div>

      <!-- Right Column: Card Visual -->
      <div class="flex items-center justify-center">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <!-- Generated Card -->
          <div
            v-if="state.cardNumber"
            class="w-full sm:max-w-sm rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl border border-white/10"
            style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
          >
            <!-- Decorations -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 pointer-events-none" />

            <!-- Top row -->
            <div class="flex justify-between items-start mb-8">
              <span class="text-xs font-bold tracking-widest uppercase text-white/80">{{ state.brand }}</span>
              <div class="w-10 h-7 rounded bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner" />
            </div>

            <!-- Card Number -->
            <div class="mb-6">
              <div class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{{ t('num') }}</div>
              <div class="flex items-center gap-2">
                <span class="font-mono tracking-[3px] text-base sm:text-lg text-white">{{ state.cardNumber }}</span>
                <button
                  @click="copy(state.cardNumber, 'number')"
                  class="shrink-0 transition-all duration-200"
                  :class="copiedField === 'number' ? 'text-success' : 'text-white/50 hover:text-white'"
                >
                  <Icon :name="copiedField === 'number' ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Bottom row -->
            <div class="flex gap-6">
              <div class="flex-1 min-w-0">
                <div class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{{ t('name') }}</div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-white truncate">{{ state.name }}</span>
                  <button
                    @click="copy(state.name, 'name')"
                    class="shrink-0 transition-all duration-200"
                    :class="copiedField === 'name' ? 'text-success' : 'text-white/50 hover:text-white'"
                  >
                    <Icon :name="copiedField === 'name' ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div class="shrink-0">
                <div class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{{ t('dt') }}</div>
                <div class="flex items-center gap-1.5">
                  <span class="text-sm font-medium text-white">{{ state.dt }}</span>
                  <button
                    @click="copy(state.dt, 'dt')"
                    class="shrink-0 transition-all duration-200"
                    :class="copiedField === 'dt' ? 'text-success' : 'text-white/50 hover:text-white'"
                  >
                    <Icon :name="copiedField === 'dt' ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div class="shrink-0">
                <div class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">CVV</div>
                <div class="flex items-center gap-1.5">
                  <span class="text-sm font-medium text-white">{{ state.cvv }}</span>
                  <button
                    @click="copy(state.cvv, 'cvv')"
                    class="shrink-0 transition-all duration-200"
                    :class="copiedField === 'cvv' ? 'text-success' : 'text-white/50 hover:text-white'"
                  >
                    <Icon :name="copiedField === 'cvv' ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Placeholder -->
        <div v-if="!state.cardNumber" class="text-center opacity-70">
          <Icon name="heroicons:credit-card" class="w-16 h-16 mx-auto mb-2" />
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

    <Mordizi v-if="state.ads" />

    <template #info>
      <div class="space-y-8">
        <section>
          <p>{{ t('d1') }}</p>
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
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:book-open-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_title') }}
          </h2>
          <p>{{ t('how_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:list-bullet-20-solid" class="w-6 h-6 text-primary" />
            {{ t('apps_title') }}
          </h2>
          <p class="mb-3">{{ t('use_cases_intro') }}</p>
          <ul class="grid gap-2">
            <li v-for="i in 5" :key="i" class="flex items-start gap-2">
              <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 text-success shrink-0 mt-0.5" />
              <span>{{ t(`use_${i}`) }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:squares-2x2-20-solid" class="w-6 h-6 text-primary" />
            {{ t('brands_title') }}
          </h2>
          <p class="mb-4">{{ t('brands_desc') }}</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 bg-base-200/40 p-4 rounded-xl border border-base-content/10 text-sm">
            <div v-for="b in ['Visa', 'Mastercard', 'American Express', 'Maestro', 'Visa Electron', 'Discover Card', 'JCB', 'Diners Club', 'China UnionPay', 'InstaPayment', 'Bankcard', 'Laser / Solo / Switch']" :key="b" class="flex items-center gap-1.5">
              <Icon name="heroicons:check-circle-20-solid" class="w-4 h-4 text-success shrink-0" />
              <span>{{ b }}</span>
            </div>
          </div>
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

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    pageTitle: "Gerador de Cartão de Crédito (Visa, Mastercard, Amex...) | Grátis",
    title: "Gerador de Cartão de Crédito",
    meta: "Gere números de cartão de crédito fictícios para testes de software. Suporta Visa, Mastercard, Amex e mais. Válido pelo Algoritmo de Luhn, inclui nome, vencimento e CVV.",
    brands: "Bandeira",
    num: "Número do Cartão",
    name: "Titular",
    dt: "Vencimento",
    bt: "Gerar Cartão",
    placeholder: "Selecione uma bandeira e clique em Gerar",
    warning: "Os dados gerados são fictícios e destinados exclusivamente a testes. Estes cartões não podem ser cobrados.",
    d1: "Gere números de cartão de crédito fictícios para testes de software e validação de fluxos de checkout. Crie números válidos para Visa, Mastercard, American Express e mais, completos com nome do titular, vencimento e CVV.",
    features_title: "Funcionalidades",
    f_1: "Suporte a mais de 15 bandeiras principais",
    f_2: "Inclui nome, vencimento e CVV para testes realistas",
    f_3: "Números válidos pelo Algoritmo de Luhn (MOD 10)",
    f_4: "Geração local no navegador para total privacidade",
    how_title: "Como Funciona o Gerador de Cartão de Crédito",
    how_desc: "Esta ferramenta utiliza o Algoritmo de Luhn (MOD 10) para gerar números matematicamente válidos, porém fictícios. Ela também simula os prefixos BIN/IIN específicos da indústria de acordo com os padrões ISO/IEC 7812. Isso permite que desenvolvedores testem máscaras de formulário e fluxos de pagamento com segurança, sem manipular dados sensíveis reais.",
    apps_title: "Principais Casos de Uso",
    use_cases_intro: "Esta ferramenta é ideal para diversas situações do dia a dia de desenvolvedores e profissionais de tecnologia:",
    use_1: "Validar lógica de máscaras e campos de formulário frontend para diferentes bandeiras de cartão",
    use_2: "Testar implementações de Luhn check no backend e simulações de erro em gateways de pagamento",
    use_3: "Criar personas realistas para pesquisa de UX, wireframing e demos interativas de checkout",
    use_4: "Executar testes de ponta a ponta em ambientes de staging onde transações reais estão desativadas",
    use_5: "Debugar estados de UI de pagamento, como transições de carregamento, telas de sucesso ou ícones de bandeira",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Selecione a bandeira",
    step_1_desc: "Escolha a bandeira desejada no menu (Visa, Mastercard, Amex etc.).",
    step_2_title: "Gere o cartão",
    step_2_desc: "Clique em \"Gerar Cartão\". Todos os dados aparecem no cartão: número, titular, vencimento e CVV.",
    step_3_title: "Copie os dados",
    step_3_desc: "Clique no ícone de cópia ao lado de cada campo para copiá-lo individualmente.",
    brands_title: "Redes e Bandeiras Suportadas",
    brands_desc: "Este gerador suporta uma ampla gama de redes de pagamento globais, garantindo cobertura total de testes para sistemas internacionais:",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Estes números de cartão são reais?",
    faq_1_a: "Não. São números fictícios que passam apenas em verificações matemáticas. Eles não podem ser usados para compras reais ou transações financeiras.",
    faq_2_q: "Posso usar esses cartões em sites reais?",
    faq_2_a: "Não. Processadores de pagamento reais verificam o cartão via rede bancária. Estes cartões serão sempre recusados se uma transação for tentada.",
    faq_3_q: "Por que preciso de um cartão falso para testes?",
    faq_3_a: "Isso permite que desenvolvedores criem e testem interfaces de pagamento com segurança. Você pode verificar se seu código identifica corretamente um Visa vs Amex sem arriscar dados reais.",
    faq_4_q: "É legal usar este gerador?",
    faq_4_a: "Sim, desde que usado para testes de software, fins educacionais ou demonstrações técnicas. Tentar usar dados falsos para fraudes é ilegal e não funcionará.",
    see1: "Gerador de CPF",
    see2: "Gerador de CNPJ",
    see3: "Gerador de Data de Nascimento",
    see4: "Gerador de Senha"
  },
  en: {
    pageTitle: "Credit Card Generator (Visa, Mastercard, Amex...) | Free",
    title: "Credit Card Generator",
    meta: "Generate fake credit card numbers for software testing. Supports Visa, Mastercard, Amex and more. Luhn algorithm compliant, includes name, expiry date and CVV.",
    brands: "Card Brand",
    num: "Card Number",
    name: "Cardholder",
    dt: "Expiry",
    bt: "Generate Card",
    placeholder: "Select a brand and click Generate",
    warning: "Generated data is fictitious and intended exclusively for testing. These cards cannot be charged.",
    d1: "Generate fake credit card numbers for software testing and checkout flow validation. Create valid numbers for Visa, Mastercard, American Express and more, complete with cardholder name, expiry date and CVV.",
    features_title: "Features",
    f_1: "Supports 15+ major card networks",
    f_2: "Includes name, expiry date and CVV for realistic testing",
    f_3: "Luhn Algorithm (MOD 10) compliant numbers",
    f_4: "Generated locally in the browser for full privacy",
    how_title: "How the Credit Card Generator Works",
    how_desc: "This tool uses the Luhn Algorithm (MOD 10) to generate mathematically valid yet fictitious numbers. It also simulates industry-specific BIN/IIN prefixes according to ISO/IEC 7812 standards. This allows developers to safely test form masks and payment system flows without handling real sensitive data.",
    apps_title: "Main Use Cases",
    use_cases_intro: "This tool is ideal for various everyday situations for developers and technology professionals:",
    use_1: "Validate frontend form masks and field logic for different card brands",
    use_2: "Test Luhn check implementations on the backend and payment gateway error simulations",
    use_3: "Create realistic personas for UX research, wireframing and interactive checkout demos",
    use_4: "Run end-to-end tests in staging environments where real transactions are disabled",
    use_5: "Debug payment UI states such as loading transitions, success screens or brand icons",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Select the card brand",
    step_1_desc: "Choose the desired brand from the menu (Visa, Mastercard, Amex, etc.).",
    step_2_title: "Generate the card",
    step_2_desc: "Click \"Generate Card\". All data appears on the card: number, cardholder, expiry and CVV.",
    step_3_title: "Copy the data",
    step_3_desc: "Click the copy icon next to each field to copy it individually.",
    brands_title: "Supported Networks and Brands",
    brands_desc: "This generator supports a wide range of global payment networks, ensuring complete test coverage for international systems:",
    faq_title: "Questions & Answers",
    faq_1_q: "Are these card numbers real?",
    faq_1_a: "No. They are fictitious numbers that only pass mathematical checks. They cannot be used for real purchases or financial transactions.",
    faq_2_q: "Can I use these cards on real websites?",
    faq_2_a: "No. Real payment processors verify the card via the banking network. These cards will always be declined if a transaction is attempted.",
    faq_3_q: "Why do I need a fake card for testing?",
    faq_3_a: "It allows developers to safely build and test payment interfaces. You can verify if your code correctly identifies a Visa vs Amex without risking real data.",
    faq_4_q: "Is it legal to use this generator?",
    faq_4_a: "Yes, as long as it is used for software testing, educational purposes, or technical demonstrations. Attempting to use fake data for fraud is illegal and will not work.",
    see1: "CPF Generator",
    see2: "CNPJ Generator",
    see3: "Birthday Generator",
    see4: "Password Generator"
  },
  es: {
    pageTitle: "Generador de Tarjetas de Crédito (Visa, Mastercard, Amex...) | Gratis",
    title: "Generador de Tarjetas de Crédito",
    meta: "Genera números de tarjeta de crédito falsos para pruebas de software. Compatible con Visa, Mastercard, Amex y más. Válido por el Algoritmo de Luhn, incluye nombre, vencimiento y CVV.",
    brands: "Marca",
    num: "Número de Tarjeta",
    name: "Titular",
    dt: "Vencimiento",
    bt: "Generar Tarjeta",
    placeholder: "Selecciona una marca y haz clic en Generar",
    warning: "Los datos generados son ficticios y destinados exclusivamente a pruebas. Estas tarjetas no pueden ser cobradas.",
    d1: "Genera números de tarjeta de crédito ficticios para pruebas de software y validación de flujos de pago. Crea números válidos para Visa, Mastercard, American Express y más, completos con nombre del titular, vencimiento y CVV.",
    features_title: "Funcionalidades",
    f_1: "Soporte para más de 15 redes de tarjetas principales",
    f_2: "Incluye nombre, vencimiento y CVV para pruebas realistas",
    f_3: "Números válidos por el Algoritmo de Luhn (MOD 10)",
    f_4: "Generación local en el navegador para total privacidad",
    how_title: "Cómo Funciona el Generador de Tarjetas de Crédito",
    how_desc: "Esta herramienta usa el Algoritmo de Luhn (MOD 10) para generar números matemáticamente válidos pero ficticios. También simula los prefijos BIN/IIN específicos de la industria según los estándares ISO/IEC 7812. Esto permite a los desarrolladores probar máscaras de formulario y flujos de pago sin manejar datos sensibles reales.",
    apps_title: "Principales Casos de Uso",
    use_cases_intro: "Esta herramienta es ideal para diversas situaciones cotidianas de desarrolladores y profesionales de tecnología:",
    use_1: "Validar máscaras de formulario y lógica de campos frontend para distintas marcas de tarjeta",
    use_2: "Probar implementaciones de Luhn check en el backend y simulaciones de error en gateways de pago",
    use_3: "Crear personas realistas para investigación de UX, wireframing y demos de checkout",
    use_4: "Ejecutar pruebas de extremo a extremo en entornos de staging donde las transacciones reales están deshabilitadas",
    use_5: "Depurar estados de UI de pago como transiciones de carga, pantallas de éxito o íconos de marca",
    how_to_use_title: "Cómo Utilizar Esta Herramienta",
    step_1_title: "Selecciona la marca",
    step_1_desc: "Elige la marca deseada en el menú (Visa, Mastercard, Amex, etc.).",
    step_2_title: "Genera la tarjeta",
    step_2_desc: "Haz clic en \"Generar Tarjeta\". Todos los datos aparecen en la tarjeta: número, titular, vencimiento y CVV.",
    step_3_title: "Copia los datos",
    step_3_desc: "Haz clic en el ícono de copiar junto a cada campo para copiarlo individualmente.",
    brands_title: "Redes y Marcas Soportadas",
    brands_desc: "Este generador soporta una amplia gama de redes de pago globales, asegurando cobertura completa de pruebas para sistemas internacionales:",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Estos números de tarjeta son reales?",
    faq_1_a: "No. Son números ficticios que solo pasan verificaciones matemáticas. No pueden usarse para compras reales o transacciones financieras.",
    faq_2_q: "¿Puedo usar estas tarjetas en sitios reales?",
    faq_2_a: "No. Los procesadores de pago reales verifican la tarjeta a través de la red bancaria. Estas tarjetas siempre serán rechazadas si se intenta una transacción.",
    faq_3_q: "¿Por qué necesito una tarjeta falsa para pruebas?",
    faq_3_a: "Permite a los desarrolladores construir y probar interfaces de pago de forma segura. Puedes verificar si tu código identifica correctamente un Visa vs Amex sin arriesgar datos reales.",
    faq_4_q: "¿Es legal usar este generador?",
    faq_4_a: "Sí, siempre que se use para pruebas de software, fines educativos o demostraciones técnicas. Intentar usar datos falsos para fraudes es ilegal y no funcionará.",
    see1: "Generador de CPF",
    see2: "Generador de CNPJ",
    see3: "Generador de Cumpleaños",
    see4: "Generador de Contraseñas"
  },
  fr: {
    pageTitle: "Générateur de Carte de Crédit (Visa, Mastercard, Amex...) | Gratuit",
    title: "Générateur de Carte de Crédit",
    meta: "Générez des numéros de carte de crédit fictifs pour les tests logiciels. Compatible Visa, Mastercard, Amex et plus. Conforme à l'algorithme de Luhn, inclut nom, date d'expiration et CVV.",
    brands: "Réseau",
    num: "Numéro de Carte",
    name: "Titulaire",
    dt: "Expiration",
    bt: "Générer une Carte",
    placeholder: "Sélectionnez un réseau et cliquez sur Générer",
    warning: "Les données générées sont fictives et destinées exclusivement aux tests. Ces cartes ne peuvent pas être débitées.",
    d1: "Générez des numéros de carte de crédit fictifs pour les tests logiciels et la validation des flux de paiement. Créez des numéros valides pour Visa, Mastercard, American Express et plus, complets avec le nom du titulaire, la date d'expiration et le CVV.",
    features_title: "Fonctionnalités",
    f_1: "Prise en charge de plus de 15 réseaux de cartes principaux",
    f_2: "Inclut nom, date d'expiration et CVV pour des tests réalistes",
    f_3: "Numéros conformes à l'algorithme de Luhn (MOD 10)",
    f_4: "Génération locale dans le navigateur pour une confidentialité totale",
    how_title: "Comment fonctionne le Générateur de Carte de Crédit",
    how_desc: "Cet outil utilise l'algorithme de Luhn (MOD 10) pour générer des numéros mathématiquement valides mais fictifs. Il simule également les préfixes BIN/IIN spécifiques à l'industrie selon les normes ISO/IEC 7812. Cela permet aux développeurs de tester les masques de formulaires et les flux de paiement sans manipuler de données sensibles réelles.",
    apps_title: "Principaux Cas d'Usage",
    use_cases_intro: "Cet outil est idéal pour diverses situations quotidiennes des développeurs et des professionnels de la technologie :",
    use_1: "Valider les masques de formulaire et la logique des champs frontend pour différents réseaux de cartes",
    use_2: "Tester les implémentations de Luhn check en backend et les simulations d'erreur des passerelles de paiement",
    use_3: "Créer des personas réalistes pour la recherche UX, le wireframing et les démos de checkout",
    use_4: "Exécuter des tests de bout en bout dans des environnements de staging où les transactions réelles sont désactivées",
    use_5: "Déboguer les états UI de paiement comme les transitions de chargement, les écrans de succès ou les icônes de réseau",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Sélectionnez le réseau",
    step_1_desc: "Choisissez le réseau souhaité dans le menu (Visa, Mastercard, Amex, etc.).",
    step_2_title: "Générez la carte",
    step_2_desc: "Cliquez sur \"Générer une Carte\". Toutes les données apparaissent sur la carte : numéro, titulaire, expiration et CVV.",
    step_3_title: "Copiez les données",
    step_3_desc: "Cliquez sur l'icône de copie à côté de chaque champ pour le copier individuellement.",
    brands_title: "Réseaux et Marques Supportés",
    brands_desc: "Ce générateur prend en charge une large gamme de réseaux de paiement mondiaux, assurant une couverture de tests complète pour les systèmes internationaux :",
    faq_title: "Questions et Réponses",
    faq_1_q: "Ces numéros de carte sont-ils réels ?",
    faq_1_a: "Non. Ce sont des numéros fictifs qui ne passent que des vérifications mathématiques. Ils ne peuvent pas être utilisés pour de vrais achats ou transactions financières.",
    faq_2_q: "Puis-je utiliser ces cartes sur de vrais sites ?",
    faq_2_a: "Non. Les vrais processeurs de paiement vérifient la carte via le réseau bancaire. Ces cartes seront toujours refusées si une transaction est tentée.",
    faq_3_q: "Pourquoi ai-je besoin d'une fausse carte pour les tests ?",
    faq_3_a: "Cela permet aux développeurs de créer et tester des interfaces de paiement en toute sécurité. Vous pouvez vérifier si votre code identifie correctement un Visa vs Amex sans risquer de vraies données.",
    faq_4_q: "Est-il légal d'utiliser ce générateur ?",
    faq_4_a: "Oui, tant qu'il est utilisé pour des tests logiciels, des fins éducatives ou des démonstrations techniques. Tenter d'utiliser de fausses données pour des fraudes est illégal et ne fonctionnera pas.",
    see1: "Générateur de CPF",
    see2: "Générateur de CNPJ",
    see3: "Générateur d'Anniversaire",
    see4: "Générateur de Mot de Passe"
  },
  it: {
    pageTitle: "Generatore di Carta di Credito (Visa, Mastercard, Amex...) | Gratis",
    title: "Generatore di Carta di Credito",
    meta: "Genera numeri di carta di credito fittizi per test software. Supporta Visa, Mastercard, Amex e altri. Conforme all'algoritmo di Luhn, include nome, scadenza e CVV.",
    brands: "Circuito",
    num: "Numero di Carta",
    name: "Titolare",
    dt: "Scadenza",
    bt: "Genera Carta",
    placeholder: "Seleziona un circuito e clicca su Genera",
    warning: "I dati generati sono fittizi e destinati esclusivamente a test. Queste carte non possono essere addebitate.",
    d1: "Genera numeri di carta di credito fittizi per test software e validazione dei flussi di pagamento. Crea numeri validi per Visa, Mastercard, American Express e altri, completi di nome del titolare, scadenza e CVV.",
    features_title: "Funzionalità",
    f_1: "Supporto per oltre 15 circuiti principali",
    f_2: "Include nome, scadenza e CVV per test realistici",
    f_3: "Numeri conformi all'algoritmo di Luhn (MOD 10)",
    f_4: "Generazione locale nel browser per la massima privacy",
    how_title: "Come Funziona il Generatore di Carta di Credito",
    how_desc: "Questo strumento utilizza l'algoritmo di Luhn (MOD 10) per generare numeri matematicamente validi ma fittizi. Simula anche i prefissi BIN/IIN specifici del settore secondo gli standard ISO/IEC 7812. Ciò consente agli sviluppatori di testare maschere di modulo e flussi di pagamento senza gestire dati sensibili reali.",
    apps_title: "Principali Casi d'Uso",
    use_cases_intro: "Questo strumento è ideale per diverse situazioni quotidiane di sviluppatori e professionisti tecnologici:",
    use_1: "Validare maschere di modulo e logica dei campi frontend per diversi circuiti di carte",
    use_2: "Testare implementazioni di Luhn check nel backend e simulazioni di errore dei gateway di pagamento",
    use_3: "Creare personas realistiche per ricerca UX, wireframing e demo di checkout",
    use_4: "Eseguire test end-to-end in ambienti di staging dove le transazioni reali sono disabilitate",
    use_5: "Debug degli stati UI di pagamento come transizioni di caricamento, schermate di successo o icone del circuito",
    how_to_use_title: "Come Utilizzare Questo Strumento",
    step_1_title: "Seleziona il circuito",
    step_1_desc: "Scegli il circuito desiderato dal menu (Visa, Mastercard, Amex, ecc.).",
    step_2_title: "Genera la carta",
    step_2_desc: "Clicca su \"Genera Carta\". Tutti i dati appaiono sulla carta: numero, titolare, scadenza e CVV.",
    step_3_title: "Copia i dati",
    step_3_desc: "Clicca sull'icona di copia accanto a ogni campo per copiarlo individualmente.",
    brands_title: "Circuiti e Reti Supportati",
    brands_desc: "Questo generatore supporta un'ampia gamma di reti di pagamento globali, garantendo una copertura di test completa per sistemi internazionali:",
    faq_title: "Domande e Risposte",
    faq_1_q: "Questi numeri di carta sono reali?",
    faq_1_a: "No. Sono numeri fittizi che superano solo le verifiche matematiche. Non possono essere utilizzati per acquisti reali o transazioni finanziarie.",
    faq_2_q: "Posso usare queste carte su siti reali?",
    faq_2_a: "No. I veri processori di pagamento verificano la carta tramite la rete bancaria. Queste carte saranno sempre rifiutate se si tenta una transazione.",
    faq_3_q: "Perché ho bisogno di una carta falsa per i test?",
    faq_3_a: "Permette agli sviluppatori di creare e testare interfacce di pagamento in sicurezza. Puoi verificare se il tuo codice identifica correttamente un Visa vs Amex senza rischiare dati reali.",
    faq_4_q: "È legale usare questo generatore?",
    faq_4_a: "Sì, purché utilizzato per test software, scopi educativi o dimostrazioni tecniche. Tentare di usare dati falsi per frodi è illegale e non funzionerà.",
    see1: "Generatore di CPF",
    see2: "Generatore di CNPJ",
    see3: "Generatore di Compleanni",
    see4: "Generatore di Password"
  },
  id: {
    pageTitle: "Generator Kartu Kredit (Visa, Mastercard, Amex...) | Gratis",
    title: "Generator Kartu Kredit",
    meta: "Buat nomor kartu kredit fiktif untuk pengujian perangkat lunak. Mendukung Visa, Mastercard, Amex dan lainnya. Sesuai algoritma Luhn, mencakup nama, tanggal kedaluwarsa dan CVV.",
    brands: "Jaringan Kartu",
    num: "Nomor Kartu",
    name: "Pemegang Kartu",
    dt: "Kedaluwarsa",
    bt: "Buat Kartu",
    placeholder: "Pilih jaringan dan klik Buat",
    warning: "Data yang dihasilkan bersifat fiktif dan ditujukan semata-mata untuk pengujian. Kartu-kartu ini tidak dapat ditagih.",
    d1: "Buat nomor kartu kredit fiktif untuk pengujian perangkat lunak dan validasi alur pembayaran. Buat nomor valid untuk Visa, Mastercard, American Express dan lainnya, lengkap dengan nama pemegang kartu, tanggal kedaluwarsa dan CVV.",
    features_title: "Fitur",
    f_1: "Mendukung lebih dari 15 jaringan kartu utama",
    f_2: "Mencakup nama, tanggal kedaluwarsa dan CVV untuk pengujian realistis",
    f_3: "Nomor sesuai algoritma Luhn (MOD 10)",
    f_4: "Dibuat secara lokal di browser untuk privasi penuh",
    how_title: "Cara Kerja Generator Kartu Kredit",
    how_desc: "Alat ini menggunakan Algoritma Luhn (MOD 10) untuk menghasilkan nomor yang valid secara matematis namun fiktif. Ini juga mensimulasikan prefiks BIN/IIN khusus industri sesuai standar ISO/IEC 7812. Hal ini memungkinkan pengembang untuk menguji masker formulir dan alur sistem pembayaran tanpa menangani data sensitif nyata.",
    apps_title: "Kasus Penggunaan Utama",
    use_cases_intro: "Alat ini ideal untuk berbagai situasi sehari-hari bagi pengembang dan profesional teknologi:",
    use_1: "Memvalidasi masker formulir dan logika kolom frontend untuk berbagai jaringan kartu",
    use_2: "Menguji implementasi Luhn check di backend dan simulasi error gateway pembayaran",
    use_3: "Membuat persona realistis untuk riset UX, wireframing dan demo checkout interaktif",
    use_4: "Menjalankan pengujian end-to-end di lingkungan staging di mana transaksi nyata dinonaktifkan",
    use_5: "Men-debug status UI pembayaran seperti transisi loading, layar sukses atau ikon jaringan",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Pilih jaringan kartu",
    step_1_desc: "Pilih jaringan yang diinginkan dari menu (Visa, Mastercard, Amex, dll.).",
    step_2_title: "Buat kartu",
    step_2_desc: "Klik \"Buat Kartu\". Semua data muncul di kartu: nomor, pemegang kartu, kedaluwarsa dan CVV.",
    step_3_title: "Salin data",
    step_3_desc: "Klik ikon salin di sebelah setiap kolom untuk menyalinnya secara individual.",
    brands_title: "Jaringan dan Merek yang Didukung",
    brands_desc: "Generator ini mendukung berbagai jaringan pembayaran global, memastikan cakupan pengujian lengkap untuk sistem internasional:",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah nomor kartu ini nyata?",
    faq_1_a: "Tidak. Ini adalah nomor fiktif yang hanya lulus pemeriksaan matematis. Tidak dapat digunakan untuk pembelian nyata atau transaksi keuangan.",
    faq_2_q: "Bisakah saya menggunakan kartu ini di situs nyata?",
    faq_2_a: "Tidak. Prosesor pembayaran nyata memverifikasi kartu melalui jaringan perbankan. Kartu-kartu ini akan selalu ditolak jika transaksi dicoba.",
    faq_3_q: "Mengapa saya memerlukan kartu palsu untuk pengujian?",
    faq_3_a: "Ini memungkinkan pengembang untuk membangun dan menguji antarmuka pembayaran dengan aman. Anda dapat memverifikasi apakah kode Anda mengidentifikasi Visa vs Amex dengan benar tanpa mempertaruhkan data nyata.",
    faq_4_q: "Apakah legal menggunakan generator ini?",
    faq_4_a: "Ya, selama digunakan untuk pengujian perangkat lunak, tujuan pendidikan, atau demonstrasi teknis. Mencoba menggunakan data palsu untuk penipuan adalah ilegal dan tidak akan berhasil.",
    see1: "Generator CPF",
    see2: "Generator CNPJ",
    see3: "Generator Tanggal Lahir",
    see4: "Generator Kata Sandi"
  }
}
</i18n>
