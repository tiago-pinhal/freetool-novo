<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const state = reactive({
  cnpj: '',
  justNum: false,
  cnpjList: [] as string[],
  multipleCount: 5,
  showMultiple: false,
  ads: false
})

const random = (): number => Math.floor(Math.random() * 10)

function formatCNPJ(digits: string, justNum: boolean): string {
  if (justNum) return digits
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

function generateCNPJ(): string {
  const n1 = random(), n2 = random(), n3 = random(), n4 = random()
  const n5 = random(), n6 = random(), n7 = random(), n8 = random()
  const n9 = 0, n10 = 0, n11 = 0, n12 = 1

  let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5
  d1 = 11 - (d1 % 11)
  if (d1 >= 10) d1 = 0

  let d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6
  d2 = 11 - (d2 % 11)
  if (d2 >= 10) d2 = 0

  return formatCNPJ('' + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9 + n10 + n11 + n12 + d1 + d2, state.justNum)
}

function generate(): void {
  state.cnpjList = []
  state.cnpj = generateCNPJ()
  if (!state.ads) state.ads = true
}

function generateMultiple(): void {
  state.cnpj = ''
  const count = Math.min(Math.max(state.multipleCount, 2), 100)
  const cnpjs = new Set<string>()
  let attempts = 0
  while (cnpjs.size < count && attempts < count * 10) {
    cnpjs.add(generateCNPJ())
    attempts++
  }
  state.cnpjList = Array.from(cnpjs)
  if (!state.ads) state.ads = true
}

function copyAll(): void {
  navigator.clipboard.writeText(state.cnpjList.join('\n')).catch(() => {})
}

watch(() => state.justNum, () => {
  if (state.cnpj) {
    const numbers = state.cnpj.replace(/\D/g, '')
    if (numbers.length === 14) state.cnpj = formatCNPJ(numbers, state.justNum)
  }
  if (state.cnpjList.length > 0) {
    state.cnpjList = state.cnpjList.map(cnpj => formatCNPJ(cnpj.replace(/\D/g, ''), state.justNum))
  }
})

watch(() => state.showMultiple, () => {
  if (state.showMultiple) state.cnpj = ''
  else state.cnpjList = []
})

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
    en: '/cnpj-generator',
    pt: '/gerador-de-cnpj',
    es: '/generador-de-cnpj',
    fr: '/generateur-de-cnpj',
    it: '/generatore-di-cnpj',
    id: '/generator-cnpj',
    de: '/cnpj-generator',
    nl: '/cnpj-generator'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    wiki-url="https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica"
    wiki-label="CNPJ (Cadastro Nacional da Pessoa Jurídica)"
    :see-also-links="[
      { label: t('see1') + ' 🇧🇷', to: 'cpf-generator' },
      { label: t('see2'), to: 'fancy-letters' },
      { label: t('see3'), to: 'credit-card-generator' },
      { label: t('see4'), to: 'birthday-generator' }
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls -->
      <div class="space-y-5">
        <!-- Toggles -->
        <div class="flex flex-col gap-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="state.justNum" class="toggle toggle-primary" />
            <span class="font-medium">{{ t('num') }}</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="state.showMultiple" class="toggle toggle-primary" />
            <span class="font-medium">{{ t('multiple_label') }}</span>
          </label>
        </div>

        <!-- Multiple count (conditional) -->
        <div v-if="state.showMultiple" class="form-control">
          <label class="label pb-1" for="qty-input">
            <span class="label-text font-bold text-base-content/80">{{ t('quantity') }}</span>
          </label>
          <input
            id="qty-input"
            type="number"
            v-model.number="state.multipleCount"
            min="2"
            max="100"
            class="input input-bordered w-full"
          />
        </div>

        <ButtonPrimary
          @click="state.showMultiple ? generateMultiple() : generate()"
          icon="heroicons:building-office-2-20-solid"
          class="w-full h-14 text-lg"
        >
          {{ state.showMultiple ? t('bt_multiple') : t('bt') }}
        </ButtonPrimary>
        <p class="text-sm text-base-content/50 italic px-1 text-center">{{ t('warning') }}</p>
      </div>

      <!-- Right Column: Result -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[10rem] flex flex-col justify-center">
        <!-- Single CNPJ -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div v-if="state.cnpj && !state.cnpjList.length" class="space-y-2 w-full">
            <LineCopy
              :content="state.cnpj"
              :label="t('cnpj_label')"
              class="!my-0 [&>div:last-child]:!w-full"
            />
          </div>
        </Transition>

        <!-- Multiple CNPJs -->
        <div v-if="state.cnpjList.length > 0" class="w-full space-y-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-semibold">{{ t('generated_cnpjs', { count: state.cnpjList.length }) }}</span>
            <button @click="copyAll" class="btn btn-ghost btn-sm gap-1.5">
              <Icon name="material-symbols:content-copy-outline" class="w-4 h-4" />
              {{ t('copy_all') }}
            </button>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
            <LineCopy
              v-for="(cnpj, index) in state.cnpjList"
              :key="index"
              :content="cnpj"
              :label="`CNPJ ${index + 1}`"
              class="!my-0"
            />
          </div>
        </div>

        <!-- Placeholder -->
        <div v-if="!state.cnpj && !state.cnpjList.length" class="text-center opacity-70">
          <Icon name="heroicons:building-office-2" class="w-16 h-16 mx-auto mb-2" />
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

        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
          icon="heroicons:check-badge-20-solid"
        />

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:book-open-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <UseCaseSection
          :title="t('use_cases_title')"
          :description="t('use_cases_intro')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
            { title: t('use_4_t'), description: t('use_4_d') },
            { title: t('use_5_t'), description: t('use_5_d') }
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
  pt: {
    pageTitle: "Gerador de CNPJ Válido e Aleatório para Testes — Grátis",
    title: "Gerador de CNPJ",
    meta: "Gerador de CNPJ online grátis para testes de software. Gere um ou vários CNPJs válidos, em formato pontuado ou somente números, de forma simples e fácil.",
    num: "Somente Números",
    multiple_label: "Gerar Múltiplos CNPJs",
    bt: "Gerar CNPJ",
    bt_multiple: "Gerar CNPJs",
    cnpj_label: "CNPJ Gerado",
    quantity: "Quantidade",
    generated_cnpjs: "CNPJs Gerados ({count})",
    copy_all: "Copiar Todos",
    placeholder: "Clique em Gerar CNPJ para criar um número",
    warning: "Os números gerados são fictícios e destinados exclusivamente a testes.",
    d1: "Ferramenta online gratuita para gerar CNPJ válido para desenvolvedores, testadores de software (QA) e estudantes de programação. Gere números fictícios de registro empresarial com dígitos verificadores matematicamente corretos, em formato pontuado ou somente números. Ideal para testes de sistemas, validação de formulários e ambientes de staging.",
    features_title: "Funcionalidades",
    f_1: "Gere CNPJs válidos instantaneamente",
    f_2: "Gere até 100 CNPJs únicos de uma vez",
    f_3: "Formato pontuado ou somente números",
    f_4: "Geração com dígitos verificadores matematicamente corretos",
    how_title: "O que é CNPJ e Como Funciona o Algoritmo?",
    how_desc: "O CNPJ (Cadastro Nacional da Pessoa Jurídica) é o número de registro nacional de empresas do Brasil. Este número único de 14 dígitos é obrigatório para qualquer pessoa jurídica — necessário para emitir notas fiscais, abrir contas bancárias empresariais e realizar atividades comerciais. A estrutura do CNPJ é composta por 12 dígitos base seguidos por 2 dígitos verificadores calculados por um algoritmo de soma ponderada com módulo-11 aplicado duas vezes.",
    use_cases_title: "Principais Casos de Uso",
    use_cases_intro: "Nosso gerador de CNPJ é a solução ideal para diversas situações do dia a dia de desenvolvedores e profissionais de tecnologia:",
    use_1_t: "Validação de Formulários",
    use_1_d: "Teste campos de CNPJ, máscaras e lógica de validação em cadastros de clientes.",
    use_2_t: "Sistemas Fiscais",
    use_2_d: "Valide fluxos de emissão de NF-e e integração com sistemas de faturamento.",
    use_3_t: "Bancos de Dados",
    use_3_d: "Preencha ambientes de staging e homologação com dados empresariais realistas.",
    use_4_t: "Integração de APIs",
    use_4_d: "Realize testes de integração com serviços externos que validam o formato do CNPJ.",
    use_5_t: "UX Design & Demos",
    use_5_d: "Crie personas empresariais para demonstrações sem expor dados reais.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Gerar um CNPJ",
    step_1_desc: "Escolha o formato desejado e clique em \"Gerar CNPJ\". O número gerado pode ser copiado com um clique.",
    step_2_title: "Gerar múltiplos CNPJs",
    step_2_desc: "Ative \"Gerar Múltiplos CNPJs\", defina a quantidade (2 a 100) e clique em \"Gerar CNPJs\". Use \"Copiar Todos\" para copiar a lista completa.",
    step_3_title: "Com ou sem pontuação",
    step_3_desc: "Ative \"Somente Números\" para obter o CNPJ sem pontos, barra e traço — ideal para integrações e bancos de dados.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O CNPJ gerado é real?",
    faq_1_a: "Não. Os CNPJs gerados são fictícios e não estão cadastrados. Eles passam na validação matemática dos dígitos verificadores, mas não têm validade legal. Use exclusivamente para testes de software e desenvolvimento.",
    faq_2_q: "É legal usar este gerador de CNPJ?",
    faq_2_a: "Sim, para testes de software, fins educacionais e demonstrações técnicas. Usar CNPJs fictícios ou de terceiros para cadastros oficiais, fraudes ou obtenção de benefícios indevidos é crime de falsidade ideológica (Art. 299 do Código Penal Brasileiro).",
    faq_3_q: "Como funciona a validação do CNPJ?",
    faq_3_a: "O CNPJ possui 2 dígitos verificadores calculados a partir dos 12 primeiros dígitos usando soma ponderada com módulo-11 aplicado duas vezes. Nosso gerador cria números que passam nessa validação, tornando-os adequados para testes de sistemas.",
    faq_4_q: "Posso gerar vários CNPJs de uma vez?",
    faq_4_a: "Sim! Gere até 100 CNPJs únicos de uma vez. Perfeito para testes em lote, automação de QA e preenchimento de bases de dados de teste.",
    see1: "Gerador de CPF",
    see2: "Letras Diferentes",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  },
  en: {
    pageTitle: "Brazilian CNPJ Generator — Fake & Valid for Testing",
    title: "CNPJ Generator",
    meta: "Free online CNPJ generator for software testing. Generate one or multiple valid CNPJs, formatted or numbers-only, quickly and easily.",
    num: "Numbers Only",
    multiple_label: "Generate Multiple CNPJs",
    bt: "Generate CNPJ",
    bt_multiple: "Generate CNPJs",
    cnpj_label: "Generated CNPJ",
    quantity: "Quantity",
    generated_cnpjs: "Generated CNPJs ({count})",
    copy_all: "Copy All",
    placeholder: "Click Generate CNPJ to create a number",
    warning: "The generated numbers are fictitious and intended exclusively for testing purposes.",
    d1: "Free online tool to generate valid CNPJ numbers for developers, software testers (QA), and programming students. Generate fictitious Brazilian company registration numbers with mathematically correct check digits, in formatted or numbers-only format. Ideal for system testing, form validation, and staging environments.",
    features_title: "Features",
    f_1: "Generate valid CNPJs instantly",
    f_2: "Generate up to 100 unique CNPJs at once",
    f_3: "Formatted or numbers-only format",
    f_4: "Generation with mathematically correct check digits",
    how_title: "What is CNPJ and How Does the Algorithm Work?",
    how_desc: "The CNPJ (Cadastro Nacional da Pessoa Jurídica) is Brazil's national company registration number. This unique 14-digit number is mandatory for any legal entity — required for issuing invoices, opening business bank accounts, and conducting official commercial activities. The CNPJ structure consists of 12 base digits followed by 2 check digits calculated using a weighted sum algorithm with modulo-11 applied twice.",
    use_cases_title: "Main Use Cases",
    use_cases_intro: "Our CNPJ generator is the ideal solution for various everyday situations for developers and technology professionals:",
    use_1_t: "Form Validation",
    use_1_d: "Test CNPJ fields, masks, and validation logic in registration forms.",
    use_2_t: "Tax Systems",
    use_2_d: "Validate NF-e issuance flows and integration with billing systems.",
    use_3_t: "Databases",
    use_3_d: "Fill staging and testing environments with realistic company data.",
    use_4_t: "API Integration",
    use_4_d: "Perform integration tests with external services that validate CNPJ format.",
    use_5_t: "UX Design & Demos",
    use_5_d: "Create business personas for demonstrations without exposing real data.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Generate a CNPJ",
    step_1_desc: "Choose the desired format and click \"Generate CNPJ\". The generated number can be copied with one click.",
    step_2_title: "Generate multiple CNPJs",
    step_2_desc: "Enable \"Generate Multiple CNPJs\", set the quantity (2 to 100) and click \"Generate CNPJs\". Use \"Copy All\" to copy the full list.",
    step_3_title: "With or without punctuation",
    step_3_desc: "Enable \"Numbers Only\" to get the CNPJ without dots, slash, and dash — ideal for integrations and databases.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is the generated CNPJ real?",
    faq_1_a: "No. The generated CNPJs are fictitious and not registered. They pass the mathematical check digit validation, but have no legal validity. Use exclusively for software testing and development.",
    faq_2_q: "Is it legal to use this CNPJ generator?",
    faq_2_a: "Yes, for software testing, educational purposes, and technical demonstrations. Using fictitious or third-party CNPJs for official registrations, fraud, or obtaining undue benefits is a crime under the Brazilian Penal Code (Art. 299).",
    faq_3_q: "How does CNPJ validation work?",
    faq_3_a: "The CNPJ has 2 check digits calculated from the first 12 digits using a weighted sum with modulo-11 applied twice. Our generator creates numbers that pass this validation, making them suitable for system testing.",
    faq_4_q: "Can I generate multiple CNPJs at once?",
    faq_4_a: "Yes! Generate up to 100 unique CNPJs at once. Perfect for batch testing, QA automation, and filling test databases.",
    see1: "CPF Generator",
    see2: "Fancy Letters",
    see3: "Credit Card Generator",
    see4: "Birthday Generator"
  },
  es: {
    pageTitle: "Generador de CNPJ Válido para Pruebas — Gratis",
    title: "Generador de CNPJ Brasileño",
    meta: "Generador de CNPJ online gratuito para pruebas de software. Genera uno o varios CNPJs válidos, con puntuación o solo números, de forma sencilla y rápida.",
    num: "Solo Números",
    multiple_label: "Generar Múltiples CNPJs",
    bt: "Generar CNPJ",
    bt_multiple: "Generar CNPJs",
    cnpj_label: "CNPJ Generado",
    quantity: "Cantidad",
    generated_cnpjs: "CNPJs Generados ({count})",
    copy_all: "Copiar Todos",
    placeholder: "Haz clic en Generar CNPJ para crear un número",
    warning: "Los números generados son ficticios y están destinados exclusivamente a pruebas.",
    d1: "Herramienta online gratuita para generar CNPJ válido para desarrolladores, testers de software (QA) y estudiantes de programación. Genera números ficticios de registro empresarial brasileño con dígitos verificadores matemáticamente correctos, en formato con puntuación o solo números. Ideal para pruebas de sistemas, validación de formularios y entornos de staging.",
    features_title: "Funcionalidades",
    f_1: "Genera CNPJs válidos al instante",
    f_2: "Genera hasta 100 CNPJs únicos a la vez",
    f_3: "Formato con puntuación o solo números",
    f_4: "Generación con dígitos verificadores matemáticamente correctos",
    how_title: "¿Qué es el CNPJ y cómo funciona el algoritmo?",
    how_desc: "El CNPJ (Cadastro Nacional da Pessoa Jurídica) es el número de registro nacional de empresas de Brasil. Este número único de 14 dígitos es obligatorio para cualquier persona jurídica — necesario para emitir facturas, abrir cuentas bancarias empresariales y realizar actividades comerciales. La estructura del CNPJ se compone de 12 dígitos base seguidos de 2 dígitos verificadores calculados mediante un algoritmo de suma ponderada con módulo-11 aplicado dos veces.",
    use_cases_title: "Principales Casos de Uso",
    use_cases_intro: "Nuestro generador de CNPJ es la solución ideal para diversas situaciones cotidianas de desarrolladores y profesionales de tecnología:",
    use_1_t: "Validación de Formularios",
    use_1_d: "Pruebe campos de CNPJ, máscaras y lógica de validación en registros de clientes.",
    use_2_t: "Sistemas Fiscales",
    use_2_d: "Valide flujos de emisión de facturas e integración con sistemas de facturación.",
    use_3_t: "Bases de Datos",
    use_3_d: "Llene entornos de staging y pruebas con datos empresariales realistas.",
    use_4_t: "Integración de APIs",
    use_4_d: "Realice pruebas de integración con servicios externos que validan el formato del CNPJ.",
    use_5_t: "Diseño UX y Demos",
    use_5_d: "Cree personas empresariales para demostraciones sin exponer datos reales.",
    how_to_use_title: "Cómo Utilizar Esta Herramienta",
    step_1_title: "Generar un CNPJ",
    step_1_desc: "Elige el formato deseado y haz clic en \"Generar CNPJ\". El número generado puede copiarse con un clic.",
    step_2_title: "Generar múltiples CNPJs",
    step_2_desc: "Activa \"Generar Múltiples CNPJs\", define la cantidad (2 a 100) y haz clic en \"Generar CNPJs\". Usa \"Copiar Todos\" para copiar la lista completa.",
    step_3_title: "Con o sin puntuación",
    step_3_desc: "Activa \"Solo Números\" para obtener el CNPJ sin puntos, barra ni guión — ideal para integraciones y bases de datos.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿El CNPJ generado es real?",
    faq_1_a: "No. Los CNPJs generados son ficticios y no están registrados. Pasan la validación matemática de los dígitos verificadores, pero no tienen validez legal. Úsalos exclusivamente para pruebas de software y desarrollo.",
    faq_2_q: "¿Es legal usar este generador de CNPJ?",
    faq_2_a: "Sí, para pruebas de software, fines educativos y demostraciones técnicas. Usar CNPJs ficticios o de terceros para registros oficiales, fraudes u obtención de beneficios indebidos es un delito según el Código Penal Brasileño (Art. 299).",
    faq_3_q: "¿Cómo funciona la validación del CNPJ?",
    faq_3_a: "El CNPJ tiene 2 dígitos verificadores calculados a partir de los 12 primeros dígitos usando suma ponderada con módulo-11 aplicado dos veces. Nuestro generador crea números que pasan esta validación, haciéndolos adecuados para pruebas.",
    faq_4_q: "¿Puedo generar varios CNPJs a la vez?",
    faq_4_a: "¡Sí! Genera hasta 100 CNPJs únicos a la vez. Perfecto para pruebas en lote, automatización de QA y relleno de bases de datos de prueba.",
    see1: "Generador de CPF",
    see2: "Letras Diferentes",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Generador de Fecha de Nacimiento"
  },
  fr: {
    pageTitle: "Générateur de CNPJ Brésilien — Exemple Valide Gratuit",
    title: "Générateur de CNPJ Brésilien",
    meta: "Générateur de CNPJ en ligne gratuit pour les tests logiciels. Générez un ou plusieurs CNPJs valides, avec ou sans ponctuation, facilement et rapidement.",
    num: "Chiffres Uniquement",
    multiple_label: "Générer Plusieurs CNPJs",
    bt: "Générer CNPJ",
    bt_multiple: "Générer des CNPJs",
    cnpj_label: "CNPJ Généré",
    quantity: "Quantité",
    generated_cnpjs: "CNPJs Générés ({count})",
    copy_all: "Tout Copier",
    placeholder: "Cliquez sur Générer CNPJ pour créer un numéro",
    warning: "Les numéros générés sont fictifs et destinés exclusivement à des fins de test.",
    d1: "Outil en ligne gratuit pour générer des CNPJ valides pour les développeurs, les testeurs de logiciels (QA) et les étudiants en programmation. Générez des numéros fictifs d'enregistrement d'entreprise brésilienne avec des chiffres de contrôle mathématiquement corrects, au format ponctué ou chiffres uniquement. Idéal pour les tests de systèmes, la validation de formulaires et les environnements de staging.",
    features_title: "Fonctionnalités",
    f_1: "Générez des CNPJs valides instantanément",
    f_2: "Générez jusqu'à 100 CNPJs uniques en une fois",
    f_3: "Format ponctué ou chiffres uniquement",
    f_4: "Génération avec chiffres de contrôle mathématiquement corrects",
    how_title: "Qu'est-ce que le CNPJ et comment fonctionne l'algorithme ?",
    how_desc: "Le CNPJ (Cadastro Nacional da Pessoa Jurídica) est le numéro d'enregistrement national des entreprises au Brésil. Ce numéro unique de 14 chiffres est obligatoire pour toute personne morale — nécessaire pour émettre des factures, ouvrir des comptes bancaires professionnels et exercer des activités commerciales. La structure du CNPJ est composée de 12 chiffres de base suivis de 2 chiffres de contrôle calculés par un algorithme de somme pondérée avec modulo-11 appliqué deux fois.",
    use_cases_title: "Principaux Cas d'Usage",
    use_cases_intro: "Notre générateur de CNPJ est la solution idéale pour diverses situations quotidiennes des développeurs et des professionnels de la technologie :",
    use_1_t: "Validation de Formulaires",
    use_1_d: "Testez les champs CNPJ, les masques et la logique de validation dans les formulaires.",
    use_2_t: "Systèmes Fiscaux",
    use_2_d: "Validez les flux d'émission de factures et l'intégration avec les systèmes de facturation.",
    use_3_t: "Bases de Données",
    use_3_d: "Remplissez les environnements de staging et de test avec des données d'entreprise réalistes.",
    use_4_t: "Intégration d'API",
    use_4_d: "Effectuez des tests d'intégration avec des services externes validant le format CNPJ.",
    use_5_t: "UX Design & Demos",
    use_5_d: "Créez des personas d'entreprise pour des démos sans exposer de vraies données.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Générer un CNPJ",
    step_1_desc: "Choisissez le format souhaité et cliquez sur \"Générer CNPJ\". Le numéro généré peut être copié en un clic.",
    step_2_title: "Générer plusieurs CNPJs",
    step_2_desc: "Activez \"Générer Plusieurs CNPJs\", définissez la quantité (2 à 100) et cliquez sur \"Générer des CNPJs\". Utilisez \"Tout Copier\" pour copier la liste complète.",
    step_3_title: "Avec ou sans ponctuation",
    step_3_desc: "Activez \"Chiffres Uniquement\" pour obtenir le CNPJ sans points, barre ni tiret — idéal pour les intégrations et les bases de données.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Le CNPJ généré est-il réel ?",
    faq_1_a: "Non. Les CNPJs générés sont fictifs et non enregistrés. Ils passent la validation mathématique des chiffres de contrôle, mais n'ont aucune validité légale. Utilisez-les exclusivement pour les tests logiciels et le développement.",
    faq_2_q: "Est-il légal d'utiliser ce générateur de CNPJ ?",
    faq_2_a: "Oui, pour les tests logiciels, les fins éducatives et les démonstrations techniques. Utiliser des CNPJs fictifs ou de tiers pour des inscriptions officielles, des fraudes ou l'obtention d'avantages indus est un crime selon le Code Pénal Brésilien (Art. 299).",
    faq_3_q: "Comment fonctionne la validation du CNPJ ?",
    faq_3_a: "Le CNPJ possède 2 chiffres de contrôle calculés à partir des 12 premiers chiffres via une somme pondérée avec modulo-11 appliqué deux fois. Notre générateur crée des numéros qui passent cette validation, les rendant adaptés aux tests de systèmes.",
    faq_4_q: "Puis-je générer plusieurs CNPJs à la fois ?",
    faq_4_a: "Oui ! Générez jusqu'à 100 CNPJs uniques en une fois. Parfait pour les tests en lot, l'automatisation QA et le remplissage de bases de données de test.",
    see1: "Générateur de CPF",
    see2: "Lettres Différentes",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance"
  },
  it: {
    pageTitle: "Generatore di CNPJ Brasile — Esempio Valido Gratis",
    title: "Generatore di CNPJ Brasiliano",
    meta: "Generatore di CNPJ online gratuito per test software. Genera uno o più CNPJ validi, con o senza punteggiatura, in modo semplice e veloce.",
    num: "Solo Numeri",
    multiple_label: "Genera Più CNPJ",
    bt: "Genera CNPJ",
    bt_multiple: "Genera CNPJ",
    cnpj_label: "CNPJ Generato",
    quantity: "Quantità",
    generated_cnpjs: "CNPJ Generati ({count})",
    copy_all: "Copia Tutti",
    placeholder: "Clicca su Genera CNPJ per creare un numero",
    warning: "I numeri generati sono fittizi e destinati esclusivamente a scopi di test.",
    d1: "Strumento online gratuito per generare CNPJ validi per sviluppatori, tester di software (QA) e studenti di programmazione. Genera numeri fittizi di registro aziendale brasiliano con cifre di controllo matematicamente corrette, in formato punteggiato o solo numeri. Ideale per test di sistemi, validazione di moduli e ambienti di staging.",
    features_title: "Funzionalità",
    f_1: "Genera CNPJ validi istantaneamente",
    f_2: "Genera fino a 100 CNPJ unici in una volta",
    f_3: "Formato punteggiato o solo numeri",
    f_4: "Generazione con cifre di controllo matematicamente corrette",
    how_title: "Cos'è il CNPJ e come funziona l'algoritmo?",
    how_desc: "Il CNPJ (Cadastro Nacional da Pessoa Jurídica) è il numero di registro nazionale delle aziende in Brasile. Questo numero univoco di 14 cifre è obbligatorio per qualsiasi persona giuridica — necessario per emettere fatture, aprire conti bancari aziendali e svolgere attività commerciali. La struttura del CNPJ è composta da 12 cifre base seguite da 2 cifre di controllo calcolate tramite un algoritmo di somma ponderata con modulo-11 applicato due volte.",
    use_cases_title: "Principali Casi d'Uso",
    use_cases_intro: "Il nostro generatore di CNPJ è la soluzione ideale per diverse situazioni quotidiane di sviluppatori e professionisti tecnologici:",
    use_1_t: "Validazione Moduli",
    use_1_d: "Testa campi CNPJ, maschere e logica di validazione nei moduli di registrazione.",
    use_2_t: "Sistemi Fiscali",
    use_2_d: "Valida flussi di emissione fatture e integrazione con sistemi di fatturazione.",
    use_3_t: "Database",
    use_3_d: "Popola ambienti di staging e test con dati aziendali realistici.",
    use_4_t: "Integrazione API",
    use_4_d: "Esegui test di integrazione con servizi esterni che validano il formato CNPJ.",
    use_5_t: "UX Design & Demo",
    use_5_d: "Crea personas aziendali per dimostrazioni senza esporre dati reali.",
    how_to_use_title: "Come Utilizzare Questo Strumento",
    step_1_title: "Generare un CNPJ",
    step_1_desc: "Scegli il formato desiderato e clicca su \"Genera CNPJ\". Il numero generato può essere copiato con un clic.",
    step_2_title: "Generare più CNPJ",
    step_2_desc: "Attiva \"Genera Più CNPJ\", imposta la quantità (da 2 a 100) e clicca su \"Genera CNPJ\". Usa \"Copia Tutti\" per copiare l'intera lista.",
    step_3_title: "Con o senza punteggiatura",
    step_3_desc: "Attiva \"Solo Numeri\" per ottenere il CNPJ senza punti, barra e trattino — ideale per integrazioni e database.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Il CNPJ generato è reale?",
    faq_1_a: "No. I CNPJ generati sono fittizi e non registrati. Superano la validazione matematica delle cifre di controllo, ma non hanno alcuna validità legale. Usali esclusivamente per test software e sviluppo.",
    faq_2_q: "È legale usare questo generatore di CNPJ?",
    faq_2_a: "Sì, per test software, scopi educativi e dimostrazioni tecniche. Usare CNPJ fittizi o di terzi per registrazioni ufficiali, frodi o ottenimento di vantaggi indebiti è un reato ai sensi del Codice Penale Brasiliano (Art. 299).",
    faq_3_q: "Come funziona la validazione del CNPJ?",
    faq_3_a: "Il CNPJ ha 2 cifre di controllo calcolate dalle prime 12 cifre usando una somma ponderata con modulo-11 applicato due volte. Il nostro generatore crea numeri che superano questa validazione, rendendoli adatti ai test di sistemi.",
    faq_4_q: "Posso generare più CNPJ in una volta?",
    faq_4_a: "Sì! Genera fino a 100 CNPJ unici in una volta. Perfetto per test in batch, automazione QA e popolamento di database di test.",
    see1: "Generatore di CPF",
    see2: "Lettere Diverse",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita"
  },
  id: {
    pageTitle: "Generator CNPJ Brasil Valid untuk Pengujian — Gratis",
    title: "Generator CNPJ Brasil",
    meta: "Generator CNPJ online gratis untuk pengujian perangkat lunak. Buat satu atau beberapa CNPJ valid, dengan atau tanpa tanda baca, dengan mudah dan cepat.",
    num: "Hanya Angka",
    multiple_label: "Buat Beberapa CNPJ",
    bt: "Buat CNPJ",
    bt_multiple: "Buat CNPJ",
    cnpj_label: "CNPJ yang Dibuat",
    quantity: "Jumlah",
    generated_cnpjs: "CNPJ yang Dibuat ({count})",
    copy_all: "Salin Semua",
    placeholder: "Klik Buat CNPJ untuk membuat nomor",
    warning: "Nomor yang dihasilkan bersifat fiktif dan ditujukan semata-mata untuk keperluan pengujian.",
    d1: "Alat online gratis untuk menghasilkan CNPJ valid bagi pengembang, penguji perangkat lunak (QA), dan mahasiswa pemrograman. Buat nomor fiktif registrasi perusahaan Brasil dengan digit verifikasi yang benar secara matematis, dalam format berpungtuasi atau hanya angka. Ideal untuk pengujian sistem, validasi formulir, dan lingkungan staging.",
    features_title: "Fitur",
    f_1: "Buat CNPJ valid secara instan",
    f_2: "Buat hingga 100 CNPJ unik sekaligus",
    f_3: "Format berpungtuasi atau hanya angka",
    f_4: "Pembuatan dengan digit verifikasi yang benar secara matematis",
    how_title: "Apa itu CNPJ dan Bagaimana Cara Kerja Algoritmanya?",
    how_desc: "CNPJ (Cadastro Nacional da Pessoa Jurídica) adalah nomor registrasi nasional perusahaan di Brasil. Nomor unik 14 digit ini wajib dimiliki oleh setiap badan hukum — diperlukan untuk menerbitkan faktur, membuka rekening bank bisnis, dan menjalankan kegiatan komersial. Struktur CNPJ terdiri dari 12 digit dasar diikuti 2 digit verifikasi yang dihitung menggunakan algoritma jumlah berbobot dengan modulo-11 yang diterapkan dua kali.",
    use_cases_title: "Kasus Penggunaan Utama",
    use_cases_intro: "Generator CNPJ kami adalah solusi ideal untuk berbagai situasi sehari-hari bagi pengembang dan profesional teknologi:",
    use_1_t: "Validasi Formulir",
    use_1_d: "Uji bidang CNPJ, masker, dan logika validasi dalam formulir pendaftaran.",
    use_2_t: "Sistem Pajak",
    use_2_d: "Validasi alur penerbitan faktur dan integrasi dengan sistem penagihan.",
    use_3_t: "Basis Data",
    use_3_d: "Isi lingkungan staging dan pengujian dengan data perusahaan yang realistis.",
    use_4_t: "Integrasi API",
    use_4_d: "Lakukan pengujian integrasi dengan layanan eksternal yang memvalidasi format CNPJ.",
    use_5_t: "Desain UX & Demo",
    use_5_d: "Buat persona bisnis untuk demonstrasi tanpa mengekspos data nyata.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Buat satu CNPJ",
    step_1_desc: "Pilih format yang diinginkan dan klik \"Buat CNPJ\". Nomor yang dihasilkan bisa disalin dengan satu klik.",
    step_2_title: "Buat beberapa CNPJ",
    step_2_desc: "Aktifkan \"Buat Beberapa CNPJ\", tentukan jumlahnya (2 hingga 100) dan klik \"Buat CNPJ\". Gunakan \"Salin Semua\" untuk menyalin seluruh daftar.",
    step_3_title: "Dengan atau tanpa tanda baca",
    step_3_desc: "Aktifkan \"Hanya Angka\" untuk mendapatkan CNPJ tanpa titik, garis miring, dan tanda hubung — ideal untuk integrasi dan basis data.",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah CNPJ yang dihasilkan nyata?",
    faq_1_a: "Tidak. CNPJ yang dihasilkan bersifat fiktif dan tidak terdaftar. Mereka lulus validasi matematis digit verifikasi, tetapi tidak memiliki validitas hukum. Gunakan secara eksklusif untuk pengujian perangkat lunak dan pengembangan.",
    faq_2_q: "Apakah legal menggunakan generator CNPJ ini?",
    faq_2_a: "Ya, untuk pengujian perangkat lunak, tujuan pendidikan, dan demonstrasi teknis. Menggunakan CNPJ fiktif atau milik pihak ketiga untuk pendaftaran resmi, penipuan, atau memperoleh keuntungan yang tidak semestinya adalah tindak pidana menurut Kitab Undang-Undang Hukum Pidana Brasil (Pasal 299).",
    faq_3_q: "Bagaimana cara kerja validasi CNPJ?",
    faq_3_a: "CNPJ memiliki 2 digit verifikasi yang dihitung dari 12 digit pertama menggunakan jumlah berbobot dengan modulo-11 yang diterapkan dua kali. Generator kami membuat nomor yang lulus validasi ini, sehingga cocok untuk pengujian sistem.",
    faq_4_q: "Bisakah saya membuat beberapa CNPJ sekaligus?",
    faq_4_a: "Ya! Buat hingga 100 CNPJ unik sekaligus. Sempurna untuk pengujian batch, otomasi QA, dan pengisian basis data pengujian.",
    see1: "Generator CPF",
    see2: "Huruf Berbeda",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir"
  },
  de: {
    pageTitle: "Gültiger CNPJ-Generator Online für Tests — Kostenlos",
    title: "Brasilianischer CNPJ-Generator",
    meta: "Kostenloser Online-CNPJ-Generator für Softwaretests. Generieren Sie einen oder mehrere gültige CNPJs, mit oder ohne Formatierung, einfach und schnell.",
    num: "Nur Zahlen",
    multiple_label: "Mehrere CNPJs generieren",
    bt: "CNPJ generieren",
    bt_multiple: "CNPJs generieren",
    cnpj_label: "Generierter CNPJ",
    quantity: "Anzahl",
    generated_cnpjs: "Generierte CNPJs ({count})",
    copy_all: "Alle kopieren",
    placeholder: "Klicken Sie auf CNPJ generieren, um eine Nummer zu erstellen",
    warning: "Die generierten Nummern sind fiktiv und ausschließlich für Testzwecke bestimmt.",
    d1: "Kostenloses Online-Tool zum Generieren gültiger CNPJ-Nummern für Entwickler, Softwaretester (QA) und Programmierstudenten. Generieren Sie fiktive brasilianische Unternehmensregisternummern mit mathematisch korrekten Prüfziffern, im formatierten Format oder nur als Zahlen. Ideal für Systemtests, Formularvalidierung und Staging-Umgebungen.",
    features_title: "Funktionen",
    f_1: "Gültige CNPJs sofort generieren",
    f_2: "Bis zu 100 eindeutige CNPJs auf einmal generieren",
    f_3: "Formatiertes Format oder nur Zahlen",
    f_4: "Generierung mit mathematisch korrekten Prüfziffern",
    how_title: "Was ist der CNPJ und wie funktioniert der Algorithmus?",
    how_desc: "Der CNPJ (Cadastro Nacional da Pessoa Jurídica) ist die nationale Unternehmensregisternummer Brasiliens. Diese eindeutige 14-stellige Nummer ist für jede juristische Person obligatorisch — erforderlich für die Ausstellung von Rechnungen, die Eröffnung von Geschäftskonten und die Durchführung offizieller kommerzieller Aktivitäten. Die CNPJ-Struktur besteht aus 12 Basisstellen gefolgt von 2 Prüfziffern, die mit einem gewichteten Summenalgorithmus mit zweimal angewendetem Modulo-11 berechnet werden.",
    use_cases_title: "Wichtigste Anwendungsfälle",
    use_cases_intro: "Unser CNPJ-Generator ist die ideale Lösung für verschiedene Alltagssituationen von Entwicklern und Technologieexperten:",
    use_1_t: "Formularvalidierung",
    use_1_d: "Testen Sie CNPJ-Felder, Masken und Validierungslogik in Registrierungsformularen.",
    use_2_t: "Steuersysteme",
    use_2_d: "Validieren Sie NF-e-Ausstellungsabläufe und die Integration in Abrechnungssysteme.",
    use_3_t: "Datenbanken",
    use_3_d: "Füllen Sie Staging- und Testumgebungen mit realistischen Unternehmensdaten.",
    use_4_t: "API-Integration",
    use_4_d: "Führen Sie Integrationstests mit externen Diensten durch, die das CNPJ-Format validieren.",
    use_5_t: "UX Design & Demos",
    use_5_d: "Erstellen Sie Geschäftspersonas für Demonstrationen, ohne echte Daten preiszugeben.",
    how_to_use_title: "Verwendung dieses Tools",
    step_1_title: "Einen CNPJ generieren",
    step_1_desc: "Wählen Sie das gewünschte Format und klicken Sie auf \"CNPJ generieren\". Die generierte Nummer kann mit einem Klick kopiert werden.",
    step_2_title: "Mehrere CNPJs generieren",
    step_2_desc: "Aktivieren Sie \"Mehrere CNPJs generieren\", legen Sie die Anzahl fest (2 bis 100) und klicken Sie auf \"CNPJs generieren\". Verwenden Sie \"Alle kopieren\", um die gesamte liste zu kopieren.",
    step_3_title: "Mit oder ohne Punktierung",
    step_3_desc: "Aktivieren Sie \"Nur Zahlen\", um den CNPJ ohne Punkte, Schrägstrich und Bindestrich zu erhalten — ideal für Integrationen und Datenbanken.",
    faq_title: "Fragen & Antworten",
    faq_1_q: "Ist der generierte CNPJ echt?",
    faq_1_a: "Nein. Die generierten CNPJs sind fiktiv und nicht registriert. Sie bestehen die mathematische Prüfziffervalidierung, haben aber keine rechtliche Gültigkeit. Ausschließlich für Softwaretests und Entwicklung verwenden.",
    faq_2_q: "Ist es legal, diesen CNPJ-Generator zu verwenden?",
    faq_2_a: "Ja, für Softwaretests, Bildungszwecke und technische Demonstrationen. Die Verwendung fiktiver oder fremder CNPJs für offizielle Registrierungen, Betrug oder die Erlangung unrechtmäßiger Vorteile ist nach dem brasilianischen Strafgesetzbuch (Art. 299) eine Straftat.",
    faq_3_q: "Wie funktioniert die CNPJ-Validierung?",
    faq_3_a: "Der CNPJ hat 2 Prüfziffern, die aus den ersten 12 Stellen mittels einer gewichteten Summe mit zweimal angewendetem Modulo-11 berechnet werden. Unser Generator erstellt Nummern, die diese Validierung bestehen und sich somit für Systemtests eignen.",
    faq_4_q: "Kann ich mehrere CNPJs auf einmal generieren?",
    faq_4_a: "Ja! Generieren Sie bis zu 100 eindeutige CNPJs auf einmal. Perfekt für Batch-Tests, QA-Automatisierung und das Befüllen von Testdatenbanken.",
    see1: "CPF-Generator",
    see2: "Schöne Schriften",
    see3: "Kreditkarten-Generator",
    see4: "Geburtsdatum-Generator"
  },
  nl: {
    pageTitle: "Geldige CNPJ-generator Online voor Tests — Gratis",
    title: "Braziliaanse CNPJ-generator",
    meta: "Gratis online CNPJ-generator voor softwaretests. Genereer snel en eenvoudig één of meerdere geldige CNPJ's, geformatteerd of alleen cijfers.",
    num: "Alleen cijfers",
    multiple_label: "Genereer meerdere CNPJ's",
    bt: "Genereer CNPJ",
    bt_multiple: "Genereer CNPJ's",
    cnpj_label: "Gegenereerde CNPJ",
    quantity: "Aantal",
    generated_cnpjs: "Gegenereerde CNPJ's ({count})",
    copy_all: "Alles kopiëren",
    placeholder: "Klik op Genereer CNPJ om een nummer aan te maken",
    warning: "De gegenereerde nummers zijn fictief en uitsluitend bedoeld voor testdoeleinden.",
    d1: "Gratis online tool om geldige CNPJ-nummers te genereren voor ontwikkelaars, softwaretesters (QA) en programmeerstudenten. Genereer fictieve Braziliaanse bedrijfsregistratienummers met wiskundig correcte controlecijfers, in geformatteerd of alleen-cijfers formaat. Ideaal voor systeemtesten, formuliervalidatie en staging-omgevingen.",
    features_title: "Functionaliteiten",
    f_1: "Genereer direct geldige CNPJ's",
    f_2: "Genereer tot 100 unieke CNPJ's tegelijk",
    f_3: "Geformatteerd of alleen-cijfers formaat",
    f_4: "Generatie met wiskundig correcte controlecijfers",
    how_title: "Wat is CNPJ en hoe werkt het algoritme?",
    how_desc: "De CNPJ (Cadastro Nacional da Pessoa Jurídica) is het nationale bedrijfsregistratienummer van Brazilië. Dit unieke 14-cijferige nummer is verplicht voor elke rechtspersoon — vereist voor het uitgeven van facturen, het openen van zakelijke bankrekeningen en het uitvoeren van officiële commerciële activiteiten. De CNPJ-structuur bestaat uit 12 basiscijfers gevolgd door 2 controlecijfers berekend met een gewogen som-algoritme met modulo-11 dat twee keer is toegepast.",
    use_cases_title: "Belangrijkste gebruiksscenario's",
    use_cases_intro: "Onze CNPJ-generator is de ideale oplossing voor diverse alledaagse situaties voor ontwikkelaars en technologieprofessionals:",
    use_1_t: "Formuliervalidatie",
    use_1_d: "Test CNPJ-velden, maskers en validatielogica in registratieformulieren.",
    use_2_t: "Fiscale systemen",
    use_2_d: "Valideer NF-e uitgiftestromen en integratie met facturatiesystemen.",
    use_3_t: "Databases",
    use_3_d: "Vul staging- en testomgevingen met realistische bedrijfsgegevens.",
    use_4_t: "API-integratie",
    use_4_d: "Voer integratietests uit met externe services die het CNPJ-formaat valideren.",
    use_5_t: "UX Design & Demo's",
    use_5_d: "Maak zakelijke persona's voor demonstraties zonder echte gegevens bloot te stellen.",
    how_to_use_title: "Hoe deze tool te gebruiken",
    step_1_title: "Een CNPJ genereren",
    step_1_desc: "Kies het gewenste formaat en klik op \"Genereer CNPJ\". Het gegenereerde nummer kan met één klik worden gekopieerd.",
    step_2_title: "Meerdere CNPJ's genereren",
    step_2_desc: "Schakel \"Genereer meerdere CNPJ's\" in, stel het aantal in (2 tot 100) en klik op \"Genereer CNPJ's\". Gebruik \"Alles kopiëren\" om de volledige lijst te kopiëren.",
    step_3_title: "Met of zonder interpunctie",
    step_3_desc: "Schakel \"Alleen cijfers\" in om de CNPJ zonder punten, schuine streep en streepje te krijgen — ideaal voor integraties en databases.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Is de gegenereerde CNPJ echt?",
    faq_1_a: "Nee. De gegenereerde CNPJ's zijn fictief en niet geregistreerd. Ze slagen voor de wiskundige controlecijfervalidatie, maar hebben geen wettelijke geldigheid. Uitsluitend gebruiken voor softwaretests en ontwikkeling.",
    faq_2_q: "Is het legaal om deze CNPJ-generator te gebruiken?",
    faq_2_a: "Ja, voor softwaretests, educatieve doeleinden en technische demonstraties. Het gebruik van fictieve of andermans CNPJ's voor officiële registraties, fraude of het verkrijgen van onrechtmatige voordelen is een misdrijf volgens het Braziliaanse Wetboek van Strafrecht (Art. 299).",
    faq_3_q: "Hoe werkt CNPJ-validatie?",
    faq_3_a: "De CNPJ heeft 2 controlecijfers berekend op basis van de eerste 12 cijfers met behulp van een gewogen som met modulo-11 twee keer toegepast. Onze generator maakt nummers die deze validatie doorstaan, waardoor ze geschikt zijn voor systeemtesten.",
    faq_4_q: "Kan ik meerdere CNPJ's tegelijk genereren?",
    faq_4_a: "Ja! Genereer tot 100 unieke CNPJ's tegelijk. Perfect voor batchtesten, QA-automatisering en het vullen van testdatabases.",
    see1: "CPF-generator",
    see2: "Mooie letters",
    see3: "Creditcard-generator",
    see4: "Geboortedatum-generator"
  }
}
</i18n>
