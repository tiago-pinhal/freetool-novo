<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const regions = Array.from({ length: 10 }, (_, i) => i.toString())

interface CpfItem {
  cpf: string
  region: string
}

const state = reactive({
  cpf: '',
  justNum: false,
  cpfList: [] as CpfItem[],
  multipleCount: 5,
  showMultiple: false,
  selectedRegion: 'all',
  generatedRegion: '',
  ads: false
})

const randomDigit = (): number => Math.floor(Math.random() * 10)

function getRegionDigit(): number {
  if (state.selectedRegion === 'all') return randomDigit()
  return parseInt(state.selectedRegion)
}

function formatCPF(digits: number[], justNum: boolean): string {
  const joined = digits.join('')
  return justNum
    ? joined
    : `${joined.slice(0, 3)}.${joined.slice(3, 6)}.${joined.slice(6, 9)}-${joined.slice(9)}`
}

function generateCPF(): { cpf: string; region: string } {
  const digits = Array.from({ length: 8 }, () => randomDigit())
  const regionDigit = getRegionDigit()
  digits.push(regionDigit)

  let sum = digits.reduce((acc, digit, index) => acc + digit * (10 - index), 0)
  const d1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  sum = digits.reduce((acc, digit, index) => acc + digit * (11 - index), 0) + d1 * 2
  const d2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return {
    cpf: formatCPF([...digits, d1, d2], state.justNum),
    region: regionDigit.toString()
  }
}

function generate(): void {
  state.cpfList = []
  const result = generateCPF()
  state.cpf = result.cpf
  state.generatedRegion = result.region
  if (!state.ads) state.ads = true
}

function generateMultiple(): void {
  const count = Math.min(Math.max(state.multipleCount, 2), 100)
  state.cpf = ''
  state.generatedRegion = ''
  const cpfs = new Map<string, string>()
  let attempts = 0
  while (cpfs.size < count && attempts < count * 10) {
    const result = generateCPF()
    cpfs.set(result.cpf, result.region)
    attempts++
  }
  state.cpfList = Array.from(cpfs.entries()).map(([cpf, region]) => ({ cpf, region }))
  if (!state.ads) state.ads = true
}

function copyAll(): void {
  const allCpfs = state.cpfList.map(item => item.cpf).join('\n')
  navigator.clipboard.writeText(allCpfs).catch(() => {})
}

function getRegionName(digit: string): string {
  return t(`region${digit}`)
}

watch(() => state.justNum, () => {
  if (state.cpf) {
    const numbers = state.cpf.replace(/\D/g, '')
    if (numbers.length === 11)
      state.cpf = formatCPF(numbers.split('').map(Number), state.justNum)
  }
  if (state.cpfList.length > 0) {
    state.cpfList = state.cpfList.map(item => {
      const numbers = item.cpf.replace(/\D/g, '')
      return { cpf: formatCPF(numbers.split('').map(Number), state.justNum), region: item.region }
    })
  }
})

watch(() => state.showMultiple, () => {
  if (state.showMultiple) {
    state.cpf = ''
    state.generatedRegion = ''
  } else {
    state.cpfList = []
  }
})

watch(() => state.selectedRegion, () => {
  state.cpf = ''
  state.generatedRegion = ''
  state.cpfList = []
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
    en: '/cpf-generator',
    pt: '/gerador-de-cpf',
    es: '/generador-de-cpf',
    fr: '/generateur-de-cpf',
    it: '/generatore-di-cpf',
    id: '/generator-cpf'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    wiki-url="https://pt.wikipedia.org/wiki/Cadastro_de_pessoas_f%C3%ADsicas"
    wiki-label="CPF (Cadastro de Pessoas Físicas)"
    :see-also-links="[
      { label: t('see1') + ' 🇧🇷', to: 'cnpj-generator' },
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

        <!-- Region Select -->
        <div class="form-control">
          <label class="label pb-1" for="region-select">
            <span class="label-text font-bold text-base-content/80">{{ t('select_state') }}</span>
          </label>
          <select id="region-select" v-model="state.selectedRegion" class="select select-bordered w-full">
            <option value="all">{{ t('all_states') }}</option>
            <option v-for="r in regions" :key="r" :value="r">{{ t(`region${r}`) }}</option>
          </select>
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
          icon="heroicons:identification-20-solid"
          class="w-full h-14 text-lg"
        >
          {{ state.showMultiple ? t('bt_multiple') : t('bt') }}
        </ButtonPrimary>
         <p class="text-sm text-base-content/50 italic px-1 text-center">{{ t('warning') }}</p>
      </div>

      <!-- Right Column: Result -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[16rem] flex flex-col justify-center">
        <!-- Single CPF -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div v-if="state.cpf && !state.cpfList.length" class="space-y-2 w-full">
            <LineCopy
              :content="state.cpf"
              :label="t('cpf_label')"
              class="!my-0 [&>div:last-child]:!w-full"
            />
            <p v-if="state.generatedRegion && state.selectedRegion === 'all'" class="text-xs text-base-content/60 px-1 mt-3">
              {{ t('region_from') }}: {{ getRegionName(state.generatedRegion) }}
            </p>
          </div>
        </Transition>

        <!-- Multiple CPFs -->
        <div v-if="state.cpfList.length > 0" class="w-full space-y-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-semibold">{{ t('generated_cpfs', { count: state.cpfList.length }) }}</span>
            <button @click="copyAll" class="btn btn-ghost btn-sm gap-1.5">
              <Icon name="material-symbols:content-copy-outline" class="w-4 h-4" />
              {{ t('copy_all') }}
            </button>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div v-for="(item, index) in state.cpfList" :key="index">
              <LineCopy :content="item.cpf" :label="`CPF ${index + 1}`" class="!my-0" />
               <p v-if="state.selectedRegion === 'all'" class="text-xs text-base-content/60 px-1 mt-2">{{ getRegionName(item.region) }}</p>
            </div>
          </div>
        </div>

        <!-- Placeholder -->
        <div v-if="!state.cpf && !state.cpfList.length" class="text-center opacity-70">
          <Icon name="heroicons:identification" class="w-16 h-16 mx-auto mb-2" />
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
    pageTitle: "Gerador de CPF Válido Online para Testes — Grátis",
    title: "Gerador de CPF",
    meta: "Gerador de CPF online grátis para testes de software. Gere CPFs válidos por estado brasileiro de forma simples e fácil.",
    num: "Somente Números",
    multiple_label: "Gerar Múltiplos CPFs",
    select_state: "Selecione o Estado",
    all_states: "Todos os Estados",
    region_from: "Região Fiscal",
    bt: "Gerar CPF",
    bt_multiple: "Gerar CPFs",
    cpf_label: "CPF Gerado",
    quantity: "Quantidade",
    generated_cpfs: "CPFs Gerados ({count})",
    copy_all: "Copiar Todos",
    placeholder: "Clique em Gerar CPF para criar um número",
    warning: "Os números gerados são fictícios e destinados exclusivamente a testes.",
    d1: "Ferramenta online gratuita para gerar CPF válido para desenvolvedores, testadores de software (QA) e estudantes de programação. Gere números fictícios com dígitos verificadores matematicamente corretos, por estado brasileiro, em formato pontuado ou somente números. Ideal para testes de sistemas, validação de formulários e ambientes de desenvolvimento.",
    features_title: "Funcionalidades",
    f_1: "Gere CPF válido por estado brasileiro",
    f_2: "Gere até 100 CPFs únicos de uma vez",
    f_3: "Formato pontuado ou somente números",
    f_4: "Geração com dígitos verificadores matematicamente corretos",
    how_title: "O que é CPF e Como Funciona o Algoritmo?",
    how_desc: "O CPF (Cadastro de Pessoas Físicas) é o documento de identificação fiscal brasileiro emitido pela Receita Federal do Brasil. Este número único de 11 dígitos é obrigatório para todo cidadão brasileiro e estrangeiro residente no país. A estrutura do CPF é composta por 9 dígitos identificadores seguidos por 2 dígitos verificadores calculados através de um algoritmo de módulo-11 duplo, desenvolvido para detectar erros de digitação e validar a autenticidade do número.",
    use_cases_title: "Casos de Uso",
    use_cases_intro: "Nosso gerador de CPF é a solução ideal para diversas situações do dia a dia de desenvolvedores e profissionais de tecnologia:",
    use_1_t: "Validação de Formulários",
    use_1_d: "Valide campos de cadastro e lógica de validação em sistemas web.",
    use_2_t: "Testes Automatizados",
    use_2_d: "Crie cenários de teste realistas para aplicações web e mobile.",
    use_3_t: "Bancos de Dados",
    use_3_d: "Preencha ambientes de homologação e staging com dados seguros.",
    use_4_t: "Integração de APIs",
    use_4_d: "Realize testes de integração com serviços externos que exigem CPF.",
    use_5_t: "UX & Demos",
    use_5_d: "Crie personas para demonstrações sem expor dados reais de usuários.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Gerar um CPF",
    step_1_desc: "Escolha o estado (opcional) e o formato desejado, depois clique em \"Gerar CPF\". O número gerado pode ser copiado com um clique.",
    step_2_title: "Gerar múltiplos CPFs",
    step_2_desc: "Ative \"Gerar Múltiplos CPFs\", defina a quantidade (2 a 100) e clique em \"Gerar CPFs\". Use \"Copiar Todos\" para copiar a lista completa.",
    step_3_title: "Com ou sem pontuação",
    step_3_desc: "Ative \"Somente Números\" para obter o CPF sem pontos e traço — ideal para integrações e bancos de dados.",
    region0: "Rio Grande do Sul (RS)",
    region1: "Distrito Federal (DF), Goiás (GO), Mato Grosso (MT), Mato Grosso do Sul (MS), Tocantins (TO)",
    region2: "Acre (AC), Amapá (AP), Amazonas (AM), Pará (PA), Rondônia (RO), Roraima (RR)",
    region3: "Ceará (CE), Maranhão (MA), Piauí (PI)",
    region4: "Alagoas (AL), Paraíba (PB), Pernambuco (PE), Rio Grande do Norte (RN)",
    region5: "Bahia (BA), Sergipe (SE)",
    region6: "Minas Gerais (MG)",
    region7: "Espírito Santo (ES), Rio de Janeiro (RJ)",
    region8: "São Paulo (SP)",
    region9: "Paraná (PR), Santa Catarina (SC)",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Este CPF é real ou pode ser usado em cadastros oficiais?",
    faq_1_a: "Não. Os CPFs gerados são fictícios e não estão registrados na Receita Federal do Brasil. Eles passam na validação matemática dos dígitos verificadores, mas não possuem qualquer validade legal ou documental. Use exclusivamente para testes de software e desenvolvimento.",
    faq_2_q: "Por que o 9º dígito do CPF indica um estado brasileiro?",
    faq_2_a: "A Receita Federal organiza o cadastro por regiões fiscais. O 9º dígito (antes dos verificadores) codifica essa região: 8 para São Paulo, 7 para ES/RJ, 0 para RS, por exemplo. Nossa ferramenta permite filtrar por estado para criar cenários de teste regionais específicos.",
    faq_3_q: "Qual a diferença entre o formato pontuado e somente números?",
    faq_3_a: "O formato 999.999.999-99 é o padrão visual usado em formulários, documentos e interfaces. O formato 99999999999 (somente números) é preferido para validações de backend, integrações com APIs e armazenamento em banco de dados.",
    faq_4_q: "É legal usar este gerador de CPF?",
    faq_4_a: "Sim, para testes de software, fins educacionais e demonstrações técnicas. Usar CPFs fictícios ou de terceiros para cadastros oficiais, fraudes ou obtenção de benefícios indevidos é crime de falsidade ideológica (Art. 299 do Código Penal Brasileiro).",
    see1: "Gerador de CNPJ",
    see2: "Letras Diferentes",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  },
  en: {
    pageTitle: "Valid CPF Generator Online for Testing — Free",
    title: "CPF Generator",
    meta: "Free online CPF generator for software testing. Generate valid CPFs by Brazilian state quickly and easily.",
    num: "Numbers Only",
    multiple_label: "Generate Multiple CPFs",
    select_state: "Select State",
    all_states: "All States",
    region_from: "Fiscal Region",
    bt: "Generate CPF",
    bt_multiple: "Generate CPFs",
    cpf_label: "Generated CPF",
    quantity: "Quantity",
    generated_cpfs: "Generated CPFs ({count})",
    copy_all: "Copy All",
    placeholder: "Click Generate CPF to create a number",
    warning: "The generated numbers are fictitious and intended exclusively for testing purposes.",
    d1: "Free online tool to generate valid CPF numbers for developers, software testers (QA), and programming students. Generate fictitious numbers with mathematically correct check digits, by Brazilian state, in formatted or numbers-only format. Ideal for system testing, form validation, and development environments.",
    features_title: "Features",
    f_1: "Generate valid CPF by Brazilian state",
    f_2: "Generate up to 100 unique CPFs at once",
    f_3: "Formatted or numbers-only format",
    f_4: "Generation with mathematically correct check digits",
    how_title: "What is CPF and How Does the Algorithm Work?",
    how_desc: "The CPF (Cadastro de Pessoas Físicas) is the Brazilian tax identification document issued by the Receita Federal do Brasil. This unique 11-digit number is mandatory for all Brazilian citizens and foreign residents in the country. The CPF structure consists of 9 identifying digits followed by 2 check digits calculated through a double modulo-11 algorithm, designed to detect typing errors and validate the authenticity of the number.",
    use_cases_title: "Use Cases",
    use_cases_intro: "Our CPF generator is the ideal solution for various everyday situations for developers and technology professionals:",
    use_1_t: "Form Validation",
    use_1_d: "Validate registration forms and web systems with realistic data.",
    use_2_t: "Automated Testing",
    use_2_d: "Create automated test scenarios for web and mobile applications.",
    use_3_t: "Databases",
    use_3_d: "Fill staging and homologation environments with secure test data.",
    use_4_t: "API Integration",
    use_4_d: "Perform integration tests with external services that require CPF.",
    use_5_t: "UX & Demos",
    use_5_d: "Create personas for demonstrations without exposing real user data.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Generate a CPF",
    step_1_desc: "Choose a state (optional) and the desired format, then click \"Generate CPF\". The generated number can be copied with one click.",
    step_2_title: "Generate multiple CPFs",
    step_2_desc: "Enable \"Generate Multiple CPFs\", set the quantity (2 to 100) and click \"Generate CPFs\". Use \"Copy All\" to copy the full list.",
    step_3_title: "With or without punctuation",
    step_3_desc: "Enable \"Numbers Only\" to get the CPF without dots and dash — ideal for integrations and databases.",
    region0: "Rio Grande do Sul (RS)",
    region1: "Federal District (DF), Goiás (GO), Mato Grosso (MT), Mato Grosso do Sul (MS), Tocantins (TO)",
    region2: "Acre (AC), Amapá (AP), Amazonas (AM), Pará (PA), Rondônia (RO), Roraima (RR)",
    region3: "Ceará (CE), Maranhão (MA), Piauí (PI)",
    region4: "Alagoas (AL), Paraíba (PB), Pernambuco (PE), Rio Grande do Norte (RN)",
    region5: "Bahia (BA), Sergipe (SE)",
    region6: "Minas Gerais (MG)",
    region7: "Espírito Santo (ES), Rio de Janeiro (RJ)",
    region8: "São Paulo (SP)",
    region9: "Paraná (PR), Santa Catarina (SC)",
    faq_title: "Questions & Answers",
    faq_1_q: "Is this CPF real or can it be used in official registrations?",
    faq_1_a: "No. The generated CPFs are fictitious and not registered with the Receita Federal do Brasil. They pass the mathematical check digit validation, but have no legal or documentary validity. Use exclusively for software testing and development.",
    faq_2_q: "Why does the 9th CPF digit indicate a Brazilian state?",
    faq_2_a: "The Receita Federal organizes the register by fiscal regions. The 9th digit (before the check digits) encodes this region: 8 for São Paulo, 7 for ES/RJ, 0 for RS, for example. Our tool allows filtering by state to create specific regional test scenarios.",
    faq_3_q: "What is the difference between formatted and numbers-only format?",
    faq_3_a: "The 999.999.999-99 format is the visual standard used in forms, documents, and interfaces. The 99999999999 format (numbers only) is preferred for backend validations, API integrations, and database storage.",
    faq_4_q: "Is it legal to use this CPF generator?",
    faq_4_a: "Yes, for software testing, educational purposes, and technical demonstrations. Using fictitious or third-party CPFs for official registrations, fraud, or obtaining undue benefits is a crime under the Brazilian Penal Code.",
    see1: "CNPJ Generator",
    see2: "Fancy Letters",
    see3: "Credit Card Generator",
    see4: "Birthday Generator"
  },
  es: {
    pageTitle: "Generador de CPF Válido Online para Pruebas — Gratis",
    title: "Generador de CPF",
    meta: "Generador de CPF online gratuito para pruebas de software. Genera CPFs válidos por estado brasileño de forma sencilla y rápida.",
    num: "Solo Números",
    multiple_label: "Generar Múltiples CPFs",
    select_state: "Seleccionar Estado",
    all_states: "Todos los Estados",
    region_from: "Región Fiscal",
    bt: "Generar CPF",
    bt_multiple: "Generar CPFs",
    cpf_label: "CPF Generado",
    quantity: "Cantidad",
    generated_cpfs: "CPFs Generados ({count})",
    copy_all: "Copiar Todos",
    placeholder: "Haz clic en Generar CPF para crear un número",
    warning: "Los números generados son ficticios y están destinados exclusivamente a pruebas.",
    d1: "Herramienta online gratuita para generar CPF válido para desarrolladores, testers de software (QA) y estudiantes de programación. Genera números ficticios con dígitos verificadores matemáticamente correctos, por estado brasileño, en formato con puntuación o solo números. Ideal para pruebas de sistemas, validación de formularios y entornos de desarrollo.",
    features_title: "Funcionalidades",
    f_1: "Genera CPF válido por estado brasileño",
    f_2: "Genera hasta 100 CPFs únicos a la vez",
    f_3: "Formato con puntuación o solo números",
    f_4: "Generación con dígitos verificadores matemáticamente correctos",
    how_title: "¿Qué es el CPF y cómo funciona el algoritmo?",
    how_desc: "El CPF (Cadastro de Pessoas Físicas) es el documento de identificación fiscal brasileño emitido por la Receita Federal do Brasil. Este número único de 11 dígitos es obligatorio para todo ciudadano brasileño y extranjero residente en el país. La estructura del CPF se compone de 9 dígitos identificadores seguidos de 2 dígitos verificadores calculados mediante un algoritmo de módulo-11 doble, diseñado para detectar errores de escritura y validar la autenticidad del número.",
    use_cases_title: "Casos de Uso",
    use_cases_intro: "Nuestro generador de CPF es la solución ideal para diversas situaciones cotidianas de desarrolladores y profesionales de tecnología:",
    use_1_t: "Validación de Formularios",
    use_1_d: "Valide campos de registro y sistemas web con datos realistas.",
    use_2_t: "Pruebas Automatizadas",
    use_2_d: "Cree escenarios de prueba para aplicaciones web y móviles.",
    use_3_t: "Bases de Datos",
    use_3_d: "Llene entornos de staging y pruebas con datos de prueba seguros.",
    use_4_t: "Integración de APIs",
    use_4_d: "Realice pruebas de integración con servicios externos que exigen CPF.",
    use_5_t: "UX y Demos",
    use_5_d: "Cree personas para demostraciones sin exponer datos reales de usuarios.",
    how_to_use_title: "Cómo Utilizar Esta Herramienta",
    step_1_title: "Generar un CPF",
    step_1_desc: "Elige un estado (opcional) y el formato deseado, luego haz clic en \"Generar CPF\". El número generado puede copiarse con un clic.",
    step_2_title: "Generar múltiples CPFs",
    step_2_desc: "Activa \"Generar Múltiples CPFs\", define la cantidad (2 a 100) y haz clic en \"Generar CPFs\". Usa \"Copiar Todos\" para copiar la lista completa.",
    step_3_title: "Con o sin puntuación",
    step_3_desc: "Activa \"Solo Números\" para obtener el CPF sin puntos ni guión — ideal para integraciones y bases de datos.",
    region0: "Rio Grande do Sul (RS)",
    region1: "Distrito Federal (DF), Goiás (GO), Mato Grosso (MT), Mato Grosso do Sul (MS), Tocantins (TO)",
    region2: "Acre (AC), Amapá (AP), Amazonas (AM), Pará (PA), Rondônia (RO), Roraima (RR)",
    region3: "Ceará (CE), Maranhão (MA), Piauí (PI)",
    region4: "Alagoas (AL), Paraíba (PB), Pernambuco (PE), Rio Grande do Norte (RN)",
    region5: "Bahia (BA), Sergipe (SE)",
    region6: "Minas Gerais (MG)",
    region7: "Espírito Santo (ES), Rio de Janeiro (RJ)",
    region8: "São Paulo (SP)",
    region9: "Paraná (PR), Santa Catarina (SC)",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Este CPF es real o puede usarse en registros oficiales?",
    faq_1_a: "No. Los CPFs generados son ficticios y no están registrados en la Receita Federal do Brasil. Pasan la validación matemática de los dígitos verificadores, pero no tienen validez legal ni documental. Úsalos exclusivamente para pruebas de software y desarrollo.",
    faq_2_q: "¿Por qué el 9º dígito del CPF indica un estado brasileño?",
    faq_2_a: "La Receita Federal organiza el catastro por regiones fiscales. El 9º dígito (antes de los verificadores) codifica esa región: 8 para São Paulo, 7 para ES/RJ, 0 para RS, por ejemplo. Nuestra herramienta permite filtrar por estado para crear escenarios de prueba regionales específicos.",
    faq_3_q: "¿Cuál es la diferencia entre el formato con puntuación y solo números?",
    faq_3_a: "El formato 999.999.999-99 es el estándar visual usado en formularios, documentos e interfaces. El formato 99999999999 (solo números) es preferido para validaciones de backend, integraciones con APIs y almacenamiento en bases de datos.",
    faq_4_q: "¿Es legal usar este generador de CPF?",
    faq_4_a: "Sí, para pruebas de software, fines educativos y demostraciones técnicas. Usar CPFs ficticios o de terceros para registros oficiales, fraudes u obtención de beneficios indebidos es un delito según el Código Penal Brasileño.",
    see1: "Generador de CNPJ",
    see2: "Letras Diferentes",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Generador de Fecha de Nacimiento"
  },
  fr: {
    pageTitle: "Générateur de CPF Valide en Ligne pour Tests — Gratuit",
    title: "Générateur de CPF",
    meta: "Générateur de CPF en ligne gratuit pour les tests logiciels. Générez des CPFs valides par état brésilien facilement et rapidement.",
    num: "Chiffres Uniquement",
    multiple_label: "Générer Plusieurs CPFs",
    select_state: "Sélectionner l'État",
    all_states: "Tous les États",
    region_from: "Région Fiscale",
    bt: "Générer CPF",
    bt_multiple: "Générer des CPFs",
    cpf_label: "CPF Généré",
    quantity: "Quantité",
    generated_cpfs: "CPFs Générés ({count})",
    copy_all: "Tout Copier",
    placeholder: "Cliquez sur Générer CPF pour créer un numéro",
    warning: "Les numéros générés sont fictifs et destinés exclusivement à des fins de test.",
    d1: "Outil en ligne gratuit pour générer des CPF valides pour les développeurs, les testeurs de logiciels (QA) et les étudiants en programmation. Générez des numéros fictifs avec des chiffres de contrôle mathématiquement corrects, par état brésilien, au format ponctué ou chiffres uniquement. Idéal pour les tests de systèmes, la validation de formulaires et les environnements de développement.",
    features_title: "Fonctionnalités",
    f_1: "Générez un CPF valide par état brésilien",
    f_2: "Générez jusqu'à 100 CPFs uniques en une fois",
    f_3: "Format ponctué ou chiffres uniquement",
    f_4: "Génération avec chiffres de contrôle mathématiquement corrects",
    how_title: "Qu'est-ce que le CPF et comment fonctionne l'algorithme ?",
    how_desc: "Le CPF (Cadastro de Pessoas Físicas) est le document d'identification fiscale brésilien émis par la Receita Federal do Brasil. Ce numéro unique de 11 chiffres est obligatoire pour tout citoyen brésilien et étranger résidant dans le pays. La structure du CPF est composée de 9 chiffres identificateurs suivis de 2 chiffres de contrôle calculés via un algorithme de double modulo-11, conçu pour détecter les erreurs de frappe et valider l'authenticité du numéro.",
    use_cases_title: "Cas d'Utilisation",
    use_cases_intro: "Notre générateur de CPF est la solution idéale pour diverses situations quotidiennes des développeurs et des professionnels de la technologie :",
    use_1_t: "Validation de Formulaires",
    use_1_d: "Validez les formulaires d'inscription et les systèmes web.",
    use_2_t: "Tests Automatisés",
    use_2_d: "Créez des scénarios de test pour applications web et mobiles.",
    use_3_t: "Bases de Données",
    use_3_d: "Remplissez les environnements de test avec des données sécurisées.",
    use_4_t: "Intégration d'API",
    use_4_d: "Effectuez des tests d'intégration avec des services exigeant un CPF.",
    use_5_t: "UX & Demos",
    use_5_d: "Créez des personas pour des démos sans exposer de données réelles.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Générer un CPF",
    step_1_desc: "Choisissez un état (facultatif) et le format souhaité, puis cliquez sur \"Générer CPF\". Le numéro généré peut être copié en un clic.",
    step_2_title: "Générer plusieurs CPFs",
    step_2_desc: "Activez \"Générer Plusieurs CPFs\", définissez la quantité (2 à 100) et cliquez sur \"Générer des CPFs\". Utilisez \"Tout Copier\" pour copier la liste complète.",
    step_3_title: "Avec ou sans ponctuation",
    step_3_desc: "Activez \"Chiffres Uniquement\" pour obtenir le CPF sans points ni tiret — idéal pour les intégrations et les bases de données.",
    region0: "Rio Grande do Sul (RS)",
    region1: "District Fédéral (DF), Goiás (GO), Mato Grosso (MT), Mato Grosso do Sul (MS), Tocantins (TO)",
    region2: "Acre (AC), Amapá (AP), Amazonas (AM), Pará (PA), Rondônia (RO), Roraima (RR)",
    region3: "Ceará (CE), Maranhão (MA), Piauí (PI)",
    region4: "Alagoas (AL), Paraíba (PB), Pernambuco (PE), Rio Grande do Norte (RN)",
    region5: "Bahia (BA), Sergipe (SE)",
    region6: "Minas Gerais (MG)",
    region7: "Espírito Santo (ES), Rio de Janeiro (RJ)",
    region8: "São Paulo (SP)",
    region9: "Paraná (PR), Santa Catarina (SC)",
    faq_title: "Questions et Réponses",
    faq_1_q: "Ce CPF est-il réel ou peut-il être utilisé dans des inscriptions officielles ?",
    faq_1_a: "Non. Les CPFs générés sont fictifs et ne sont pas enregistrés à la Receita Federal do Brasil. Ils passent la validation mathématique des chiffres de contrôle, mais n'ont aucune validité légale ou documentaire. Utilisez-les exclusivement pour les tests logiciels et le développement.",
    faq_2_q: "Pourquoi le 9e chiffre du CPF indique-t-il un état brésilien ?",
    faq_2_a: "La Receita Federal organise le registre par régions fiscales. Le 9e chiffre (avant les vérificateurs) encode cette région : 8 pour São Paulo, 7 pour ES/RJ, 0 pour RS, par exemple. Notre outil permet de filtrer par état pour créer des scénarios de test régionaux spécifiques.",
    faq_3_q: "Quelle est la différence entre le format ponctué et chiffres uniquement ?",
    faq_3_a: "Le format 999.999.999-99 est le standard visuel utilisé dans les formulaires, documents et interfaces. Le format 99999999999 (chiffres uniquement) est préféré pour les validations backend, les intégrations avec les APIs et le stockage en base de données.",
    faq_4_q: "Est-il légal d'utiliser ce générateur de CPF ?",
    faq_4_a: "Oui, pour les tests logiciels, les fins éducatives et les démonstrations techniques. Utiliser des CPFs fictifs ou de tiers pour des inscriptions officielles, des fraudes ou l'obtention d'avantages indus est un crime selon le Code Pénal Brésilien.",
    see1: "Générateur de CNPJ",
    see2: "Lettres Différentes",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance"
  },
  it: {
    pageTitle: "Generatore di CPF Valido Online per Test — Gratis",
    title: "Generatore di CPF",
    meta: "Generatore di CPF online gratuito per test software. Genera CPF validi per stato brasiliano in modo semplice e veloce.",
    num: "Solo Numeri",
    multiple_label: "Genera Più CPF",
    select_state: "Seleziona Stato",
    all_states: "Tutti gli Stati",
    region_from: "Regione Fiscale",
    bt: "Genera CPF",
    bt_multiple: "Genera CPF",
    cpf_label: "CPF Generato",
    quantity: "Quantità",
    generated_cpfs: "CPF Generati ({count})",
    copy_all: "Copia Tutti",
    placeholder: "Clicca su Genera CPF per creare un numero",
    warning: "I numeri generati sono fittizi e destinati esclusivamente a scopi di test.",
    d1: "Strumento online gratuito per generare CPF validi per sviluppatori, tester di software (QA) e studenti di programmazione. Genera numeri fittizi con cifre di controllo matematicamente corrette, per stato brasiliano, in formato punteggiato o solo numeri. Ideale per test di sistemi, validazione di moduli e ambienti di sviluppo.",
    features_title: "Funzionalità",
    f_1: "Genera CPF valido per stato brasiliano",
    f_2: "Genera fino a 100 CPF unici in una volta",
    f_3: "Formato punteggiato o solo numeri",
    f_4: "Generazione con cifre di controllo matematicamente corrette",
    how_title: "Cos'è il CPF e come funziona l'algoritmo?",
    how_desc: "Il CPF (Cadastro de Pessoas Físicas) è il documento di identificazione fiscale brasiliano emesso dalla Receita Federal do Brasil. Questo numero univoco di 11 cifre è obbligatorio per tutti i cittadini brasiliani e gli stranieri residenti nel paese. La struttura del CPF è composta da 9 cifre identificative seguite da 2 cifre di controllo calcolate tramite un algoritmo di doppio modulo-11, progettato per rilevare errori di battitura e validare l'autenticità del numero.",
    use_cases_title: "Casi d'Uso",
    use_cases_intro: "Il nostro generatore di CPF è la soluzione ideale per diverse situazioni quotidiane di sviluppatori e professionisti tecnologici:",
    use_1_t: "Validazione Moduli",
    use_1_d: "Valida moduli di registrazione e sistemi web con dati realistici.",
    use_2_t: "Test Automatizzati",
    use_2_d: "Crea scenari di test per applicazioni web e mobile.",
    use_3_t: "Database",
    use_3_d: "Popola ambienti di test e staging con dati sicuri.",
    use_4_t: "Integrazione API",
    use_4_d: "Esegui test di integrazione con servizi esterni che richiedono il CPF.",
    use_5_t: "UX & Demo",
    use_5_d: "Crea personas per dimostrazioni senza esporre dati reali.",
    how_to_use_title: "Come Utilizzare Questo Strumento",
    step_1_title: "Generare un CPF",
    step_1_desc: "Scegli uno stato (facoltativo) e il formato desiderato, poi clicca su \"Genera CPF\". Il numero generato può essere copiato con un clic.",
    step_2_title: "Generare più CPF",
    step_2_desc: "Attiva \"Genera Più CPF\", imposta la quantità (da 2 a 100) e clicca su \"Genera CPF\". Usa \"Copia Tutti\" per copiare l'intera lista.",
    step_3_title: "Con o senza punteggiatura",
    step_3_desc: "Attiva \"Solo Numeri\" per ottenere il CPF senza punti e trattino — ideale per integrazioni e database.",
    region0: "Rio Grande do Sul (RS)",
    region1: "Distretto Federale (DF), Goiás (GO), Mato Grosso (MT), Mato Grosso do Sul (MS), Tocantins (TO)",
    region2: "Acre (AC), Amapá (AP), Amazonas (AM), Pará (PA), Rondônia (RO), Roraima (RR)",
    region3: "Ceará (CE), Maranhão (MA), Piauí (PI)",
    region4: "Alagoas (AL), Paraíba (PB), Pernambuco (PE), Rio Grande do Norte (RN)",
    region5: "Bahia (BA), Sergipe (SE)",
    region6: "Minas Gerais (MG)",
    region7: "Espírito Santo (ES), Rio de Janeiro (RJ)",
    region8: "São Paulo (SP)",
    region9: "Paraná (PR), Santa Catarina (SC)",
    faq_title: "Domande e Risposte",
    faq_1_q: "Questo CPF è reale o può essere usato in registrazioni ufficiali?",
    faq_1_a: "No. I CPF generati sono fittizi e non registrati presso la Receita Federal do Brasil. Superano la validazione matematica delle cifre di controllo, ma non hanno alcuna validità legale o documentale. Usali esclusivamente per test software e sviluppo.",
    faq_2_q: "Perché la 9a cifra del CPF indica uno stato brasiliano?",
    faq_2_a: "La Receita Federal organizza il registro per regioni fiscali. La 9a cifra (prima dei verificatori) codifica questa regione: 8 per São Paulo, 7 per ES/RJ, 0 per RS, ad esempio. Il nostro strumento consente di filtrare per stato per creare scenari di test regionali specifici.",
    faq_3_q: "Qual è la differenza tra formato punteggiato e solo numeri?",
    faq_3_a: "Il formato 999.999.999-99 è lo standard visivo usato in moduli, documenti e interfacce. Il formato 99999999999 (solo numeri) è preferito per validazioni backend, integrazioni con API e archiviazione in database.",
    faq_4_q: "È legale usare questo generatore di CPF?",
    faq_4_a: "Sì, per test software, scopi educativi e dimostrazioni tecniche. Usare CPF fittizi o di terzi per registrazioni ufficiali, frodi o ottenimento di vantaggi indebiti è un reato ai sensi del Codice Penale Brasiliano.",
    see1: "Generatore di CNPJ",
    see2: "Lettere Diverse",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita"
  },
  id: {
    pageTitle: "Generator CPF Valid Online untuk Pengujian — Gratis",
    title: "Generator CPF",
    meta: "Generator CPF online gratis untuk pengujian perangkat lunak. Buat CPF valid berdasarkan negara bagian Brasil dengan mudah dan cepat.",
    num: "Hanya Angka",
    multiple_label: "Buat Beberapa CPF",
    select_state: "Pilih Negara Bagian",
    all_states: "Semua Negara Bagian",
    region_from: "Wilayah Fiskal",
    bt: "Buat CPF",
    bt_multiple: "Buat CPF",
    cpf_label: "CPF yang Dibuat",
    quantity: "Jumlah",
    generated_cpfs: "CPF yang Dibuat ({count})",
    copy_all: "Salin Semua",
    placeholder: "Klik Buat CPF untuk membuat nomor",
    warning: "Nomor yang dihasilkan bersifat fiktif dan ditujukan semata-mata untuk keperluan pengujian.",
    d1: "Alat online gratis untuk menghasilkan CPF valid bagi pengembang, penguji perangkat lunak (QA), dan mahasiswa pemrograman. Buat nomor fiktif dengan digit verifikasi yang benar secara matematis, berdasarkan negara bagian Brasil, dalam format berpungtuasi atau hanya angka. Ideal untuk pengujian sistem, validasi formulir, dan lingkungan pengembangan.",
    features_title: "Fitur",
    f_1: "Buat CPF valid berdasarkan negara bagian Brasil",
    f_2: "Buat hingga 100 CPF unik sekaligus",
    f_3: "Format berpungtuasi atau hanya angka",
    f_4: "Pembuatan dengan digit verifikasi yang benar secara matematis",
    how_title: "Apa itu CPF dan Bagaimana Cara Kerja Algoritmanya?",
    how_desc: "CPF (Cadastro de Pessoas Físicas) adalah dokumen identifikasi pajak Brasil yang diterbitkan oleh Receita Federal do Brasil. Nomor unik 11 digit ini wajib dimiliki oleh semua warga negara Brasil dan warga negara asing yang tinggal di negara tersebut. Struktur CPF terdiri dari 9 digit identifikasi diikuti oleh 2 digit verifikasi yang dihitung melalui algoritma modulo-11 ganda, dirancang untuk mendeteksi kesalahan pengetikan dan memvalidasi keaslian nomor.",
    use_cases_title: "Contoh Penggunaan",
    use_cases_intro: "Generator CPF kami adalah solusi ideal untuk berbagai situasi sehari-hari bagi pengembang dan profesional teknologi:",
    use_1_t: "Validasi Formulir",
    use_1_d: "Validasi formulir pendaftaran dan sistem web dengan data realistis.",
    use_2_t: "Pengujian Otomatis",
    use_2_d: "Buat skenario pengujian untuk aplikasi web dan seluler.",
    use_3_t: "Basis Data",
    use_3_d: "Isi lingkungan staging dengan data pengujian yang aman.",
    use_4_t: "Integrasi API",
    use_4_d: "Lakukan pengujian integrasi dengan layanan eksternal yang memerlukan CPF.",
    use_5_t: "UX & Demo",
    use_5_d: "Buat persona untuk demonstrasi tanpa mengekspos data pengguna nyata.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Buat satu CPF",
    step_1_desc: "Pilih negara bagian (opsional) dan format yang diinginkan, lalu klik \"Buat CPF\". Nomor yang dihasilkan bisa disalin dengan satu klik.",
    step_2_title: "Buat beberapa CPF",
    step_2_desc: "Aktifkan \"Buat Beberapa CPF\", tentukan jumlahnya (2 hingga 100) dan klik \"Buat CPF\". Gunakan \"Salin Semua\" untuk menyalin seluruh daftar.",
    step_3_title: "Dengan atau tanpa tanda baca",
    step_3_desc: "Aktifkan \"Hanya Angka\" untuk mendapatkan CPF tanpa titik dan tanda hubung — ideal untuk integrasi dan basis data.",
    region0: "Rio Grande do Sul (RS)",
    region1: "Distrik Federal (DF), Goiás (GO), Mato Grosso (MT), Mato Grosso do Sul (MS), Tocantins (TO)",
    region2: "Acre (AC), Amapá (AP), Amazonas (AM), Pará (PA), Rondônia (RO), Roraima (RR)",
    region3: "Ceará (CE), Maranhão (MA), Piauí (PI)",
    region4: "Alagoas (AL), Paraíba (PB), Pernambuco (PE), Rio Grande do Norte (RN)",
    region5: "Bahia (BA), Sergipe (SE)",
    region6: "Minas Gerais (MG)",
    region7: "Espírito Santo (ES), Rio de Janeiro (RJ)",
    region8: "São Paulo (SP)",
    region9: "Paraná (PR), Santa Catarina (SC)",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah CPF ini nyata atau bisa digunakan untuk pendaftaran resmi?",
    faq_1_a: "Tidak. CPF yang dihasilkan adalah fiktif dan tidak terdaftar di Receita Federal do Brasil. Mereka lulus validasi matematis digit verifikasi, tetapi tidak memiliki validitas hukum atau dokumenter. Gunakan secara eksklusif untuk pengujian perangkat lunak dan pengembangan.",
    faq_2_q: "Mengapa digit ke-9 CPF menunjukkan negara bagian Brasil?",
    faq_2_a: "Receita Federal mengorganisir pendaftaran berdasarkan wilayah fiskal. Digit ke-9 (sebelum verifikator) mengkodekan wilayah ini: 8 untuk São Paulo, 7 untuk ES/RJ, 0 untuk RS, misalnya. Alat kami memungkinkan pemfilteran berdasarkan negara bagian untuk membuat skenario pengujian regional tertentu.",
    faq_3_q: "Apa perbedaan antara format berpungtuasi dan hanya angka?",
    faq_3_a: "Format 999.999.999-99 adalah standar visual yang digunakan dalam formulir, dokumen, dan antarmuka. Format 99999999999 (hanya angka) lebih disukai untuk validasi backend, integrasi dengan API, dan penyimpanan basis data.",
    faq_4_q: "Apakah legal menggunakan generator CPF ini?",
    faq_4_a: "Ya, untuk pengujian perangkat lunak, tujuan pendidikan, dan demonstrasi teknis. Menggunakan CPF fiktif atau milik pihak ketiga untuk pendaftaran resmi, penipuan, atau memperoleh keuntungan yang tidak semestinya adalah tindak pidana menurut Kitab Undang-Undang Hukum Pidana Brasil.",
    see1: "Generator CNPJ",
    see2: "Huruf Berbeda",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir"
  }
}
</i18n>
