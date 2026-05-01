<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const regions = Array.from({ length: 10 }, (_, i) => i.toString())
const regionNames: Record<string, string> = {
  '0': "Rio Grande do Sul (RS)",
  '1': "Distrito Federal (DF), Goiás (GO), Mato Grosso (MT), Mato Grosso do Sul (MS), Tocantins (TO)",
  '2': "Acre (AC), Amapá (AP), Amazonas (AM), Pará (PA), Rondônia (RO), Roraima (RR)",
  '3': "Ceará (CE), Maranhão (MA), Piauí (PI)",
  '4': "Alagoas (AL), Paraíba (PB), Pernambuco (PE), Rio Grande do Norte (RN)",
  '5': "Bahia (BA), Sergipe (SE)",
  '6': "Minas Gerais (MG)",
  '7': "Espírito Santo (ES), Rio de Janeiro (RJ)",
  '8': "São Paulo (SP)",
  '9': "Paraná (PR), Santa Catarina (SC)"
}

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
  navigator.clipboard.writeText(allCpfs).catch(() => { })
}

function getRegionName(digit: string): string {
  return regionNames[digit] || ''
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

// Gera o primeiro CPF assim que a página carrega no cliente.
// Reduz fricção para a intenção transacional ("quero um CPF agora")
// e melhora sinais de comportamento (interação imediata).
onMounted(() => {
  generate()
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
    en: '/cpf-generator',
    pt: '/gerador-de-cpf',
    es: '/generador-de-cpf',
    fr: '/generateur-de-cpf',
    it: '/generatore-di-cpf',
    id: '/generator-cpf',
    de: '/cpf-generator'
  }
})
</script>

<template>
  <ToolPage :title="t('title')" :description="t('meta')" :show-ads="state.ads"
    wiki-url="https://pt.wikipedia.org/wiki/Cadastro_de_pessoas_f%C3%ADsicas"
    wiki-label="CPF (Cadastro de Pessoas Físicas)" :see-also-links="[
      { label: t('see1') + ' 🇧🇷', to: 'cnpj-generator' },
      { label: t('see2'), to: 'fancy-letters' },
      { label: t('see3'), to: 'credit-card-generator' },
      { label: t('see4'), to: 'birthday-generator' }
    ]">
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Controles -->
      <div class="space-y-5">
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

        <div class="form-control">
          <label class="label pb-1" for="region-select">
            <span class="label-text font-bold text-base-content/80">{{ t('select_state') }}</span>
          </label>
          <select id="region-select" v-model="state.selectedRegion" class="select select-bordered w-full">
            <option value="all">{{ t('all_states') }}</option>
            <option v-for="r in regions" :key="r" :value="r">{{ regionNames[r] }}</option>
          </select>
        </div>

        <div v-if="state.showMultiple" class="form-control">
          <label class="label pb-1" for="qty-input">
            <span class="label-text font-bold text-base-content/80">{{ t('quantity') }}</span>
          </label>
          <input id="qty-input" type="number" v-model.number="state.multipleCount" min="2" max="100"
            class="input input-bordered w-full" />
        </div>

        <ButtonPrimary @click="state.showMultiple ? generateMultiple() : generate()"
          icon="heroicons:identification-20-solid" class="w-full h-14 text-lg">
          {{ state.showMultiple ? t('bt_multiple') : t('bt') }}
        </ButtonPrimary>

        <p class="text-sm text-base-content/50 italic px-1 text-center">{{ t('warning') }}</p>
      </div>

      <!-- Resultado -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[16rem] flex flex-col justify-center">
        <Transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100">
          <div v-if="state.cpf && !state.cpfList.length" class="space-y-2 w-full">
            <LineCopy :content="state.cpf" :label="t('cpf_label')" class="!my-0 [&>div:last-child]:!w-full" />
            <p v-if="state.generatedRegion && state.selectedRegion === 'all'"
              class="text-xs text-base-content/60 px-1 mt-3">
              {{ t('region_from') }}: {{ getRegionName(state.generatedRegion) }}
            </p>
          </div>
        </Transition>

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
              <p v-if="state.selectedRegion === 'all'" class="text-xs text-base-content/60 px-1 mt-2">{{
                getRegionName(item.region) }}</p>
            </div>
          </div>
        </div>

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

        <FeatureSection :title="t('features_title')" :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]" />

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:book-open-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <UseCaseSection :title="t('use_cases_title')" :description="t('use_cases_intro')" :items="[
          { title: t('use_1_t'), description: t('use_1_d') },
          { title: t('use_2_t'), description: t('use_2_d') },
          { title: t('use_3_t'), description: t('use_3_d') },
          { title: t('use_4_t'), description: t('use_4_d') },
          { title: t('use_5_t'), description: t('use_5_d') }
        ]" />

        <HowToSection :title="t('how_to_use_title')" :items="[
          { title: t('step_1_title'), description: t('step_1_desc') },
          { title: t('step_2_title'), description: t('step_2_desc') },
          { title: t('step_3_title'), description: t('step_3_desc') }
        ]" />

        <FaqSection :title="t('faq_title')" :items="[
          { question: t('faq_1_q'), answer: t('faq_1_a') },
          { question: t('faq_2_q'), answer: t('faq_2_a') },
          { question: t('faq_3_q'), answer: t('faq_3_a') },
          { question: t('faq_4_q'), answer: t('faq_4_a') },
          { question: t('faq_5_q'), answer: t('faq_5_a') }
        ]" />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    pageTitle: "Gerador de CPF Válido Online — Grátis e Sem Cadastro",
    title: "Gerador de CPF Válido",
    meta: "Gere CPFs válidos online de graça. Por estado, em massa (até 100 por vez), com ou sem pontuação. Para testes de software e desenvolvimento.",

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
    warning: "Os números gerados são fictícios e servem apenas para testes.",

    d1: "Gerador de CPF online e gratuito para desenvolvedores e testes de software. Gere números de CPF matematicamente válidos com dígitos verificadores calculados via algoritmo oficial, garantindo que passem em qualquer validação de formulário ou regra de negócio. Nossa ferramenta funciona direto no navegador, é 100% segura (sem vínculo com pessoas reais) e não exige cadastro. Aproveite recursos avançados como geração de CPF por estado e criação de lotes de até 100 números simultâneos.",

    features_title: "Funcionalidades",
    f_1: "Gera CPF válido por estado",
    f_2: "Lotes de até 100 CPFs únicos",
    f_3: "Formato com pontuação ou só números",
    f_4: "Dígitos verificadores calculados pelo módulo 11",

    how_title: "Como o algoritmo do CPF funciona",
    how_desc: "O algoritmo do CPF é composto por 11 dígitos: 9 de identificação e 2 verificadores no final. Os 9 primeiros são sequenciais por região fiscal, e o 9º indica o estado onde o documento foi emitido. Os dois últimos saem de um cálculo de módulo 11 sobre os anteriores: cada dígito é multiplicado por um peso, soma-se tudo, divide por 11, e o resto define o verificador. O método foi pensado para detectar erros de digitação. Trocar um dígito ou inverter dois quase sempre quebra a validação, o que permite a qualquer sistema rejeitar números inválidos sem precisar consultar a Receita.",

    use_cases_title: "Casos de Uso",
    use_cases_intro: "Confira as principais aplicações práticas do gerador de CPF no fluxo de trabalho de desenvolvimento e QA:",
    use_1_t: "Validação de formulários",
    use_1_d: "Testar máscaras, validadores e mensagens de erro em campos de cadastro.",
    use_2_t: "Testes automatizados",
    use_2_d: "Popular cenários de teste com dados que passam na validação sem expor CPFs reais.",
    use_3_t: "Ambientes de desenvolvimento",
    use_3_d: "Criar registros em homologação e staging sem violar a LGPD nem usar dados de produção.",
    use_4_t: "Integrações e APIs",
    use_4_d: "Testar endpoints, payloads e serviços de terceiros que exigem CPF como parâmetro.",
    use_5_t: "Mockups e demonstrações",
    use_5_d: "Preencher protótipos, telas de demo e apresentações de produto sem utilizar dados reais.",

    how_to_use_title: "Como Usar",
    step_1_title: "Gerar um CPF rápido",
    step_1_desc: "Ao abrir a página, o primeiro CPF já aparece pronto. Para gerar outro, clique em \"Gerar CPF\", o número fica disponível para copiar com um clique.",
    step_2_title: "Gerar vários de uma vez",
    step_2_desc: "Marque \"Gerar Múltiplos CPFs\", escolha quantos (entre 2 e 100) e clique em \"Gerar CPFs\". O botão \"Copiar Todos\" passa a lista inteira para a área de transferência.",
    step_3_title: "Escolher o formato",
    step_3_desc: "Por padrão, o CPF vem com pontos e traço. Se você precisa do número limpo (banco de dados, JSON, etc.), ative \"Somente Números\" antes de gerar.",

    faq_title: "Perguntas Frequentes",
    faq_1_q: "Os CPFs gerados aqui são reais ou estão registrados na Receita Federal?",
    faq_1_a: "Não. São números fictícios construídos com o mesmo algoritmo de validação que a Receita usa, mas sem vínculo nenhum com pessoas reais. Eles passam na verificação dos dígitos porque o cálculo está correto, e nada além disso. Não tente usar para cadastros oficiais, pois não serão aceitos, e a tentativa pode configurar crime.",
    faq_2_q: "Por que existe um campo de estado no gerador?",
    faq_2_a: "O 9º dígito do CPF (logo antes dos verificadores) corresponde à região fiscal onde o documento foi emitido. São Paulo é 8, Rio Grande do Sul é 0, e por aí vai. Para alguns testes, faz diferença gerar números coerentes com uma região específica, e o filtro existe para isso. Se não importa, deixe em \"Todos os Estados\" que o sorteio é aleatório.",
    faq_3_q: "Quando usar o formato com pontos e quando usar só números?",
    faq_3_a: "Depende de onde o número vai entrar. Formulários e telas que mostram o CPF para o usuário normalmente usam o formato pontuado (999.999.999-99). Já bancos de dados, APIs e validações de backend tendem a armazenar o número limpo, sem caracteres especiais. O toggle \"Somente Números\" resolve sem precisar tratar a string depois.",
    faq_4_q: "Posso usar o gerador para qualquer finalidade?",
    faq_4_a: "Para testes de software, estudo, demonstrações e desenvolvimento, sim. É exatamente para isso que ele existe. O que você não pode fazer é usar um CPF gerado em cadastros oficiais, contratos, declarações ou qualquer situação que exija identificação real. Isso configura falsidade ideológica (Art. 299 do Código Penal) e, dependendo do caso, estelionato.",
    faq_5_q: "Qual a diferença entre \"CPF fake\" e \"CPF aleatório\"?",
    faq_5_a: "Na prática, os dois termos se referem à mesma ferramenta: um utilitário que gera números seguindo a regra matemática do CPF, mas sem pertencer a ninguém. Os termos \"fake\" e \"falso\" são populares na busca, embora alguns desenvolvedores prefiram \"fictício\" ou \"de teste\" por soarem menos sugestivos. O resultado e o uso são idênticos.",

    see1: "Gerador de CNPJ",
    see2: "Letras Diferentes",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  },
  en: {
    pageTitle: "Valid CPF Generator Online — Free, No Sign-Up Required",
    title: "Valid CPF Generator",
    meta: "Generate valid CPF numbers online for free. By state, in bulk (up to 100 at once), with or without formatting. For software testing and development.",

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
    warning: "The generated numbers are fictitious and for testing purposes only.",

    d1: "Free online CPF generator for developers and software testing. Generate mathematically valid CPF numbers with check digits calculated using the official algorithm, ensuring they pass any form validation or business rule. Our tool runs entirely in the browser, is 100% safe (not linked to real people), and requires no sign-up. Take advantage of advanced features like state-specific CPF generation and batch creation of up to 100 numbers at once.",

    features_title: "Features",
    f_1: "Generate valid CPF by state",
    f_2: "Batches of up to 100 unique CPFs",
    f_3: "Formatted or numbers-only output",
    f_4: "Check digits calculated via modulo 11",

    how_title: "How the CPF algorithm works",
    how_desc: "The CPF algorithm consists of 11 digits: 9 identification digits and 2 check digits at the end. The first 9 are sequential by fiscal region, and the 9th indicates the state where the document was issued. The last two are derived from a modulo 11 calculation over the preceding digits: each digit is multiplied by a weight, everything is summed, divided by 11, and the remainder determines the check digit. The method was designed to detect typing errors. Changing one digit or swapping two almost always breaks validation, allowing any system to reject invalid numbers without querying the tax authority.",

    use_cases_title: "Use Cases",
    use_cases_intro: "Here are the main practical applications of the CPF generator in development and QA workflows:",
    use_1_t: "Form validation",
    use_1_d: "Test input masks, validators, and error messages in registration fields.",
    use_2_t: "Automated testing",
    use_2_d: "Populate test scenarios with data that passes validation without exposing real CPF numbers.",
    use_3_t: "Development environments",
    use_3_d: "Create records in staging and QA environments without violating data protection laws or using production data.",
    use_4_t: "Integrations and APIs",
    use_4_d: "Test endpoints, payloads, and third-party services that require a CPF as a parameter.",
    use_5_t: "Mockups and demos",
    use_5_d: "Fill in prototypes, demo screens, and product presentations without using real data.",

    how_to_use_title: "How to Use",
    step_1_title: "Generate a CPF quickly",
    step_1_desc: "When you open the page, the first CPF is already ready. To generate another, click \"Generate CPF\" — the number is available to copy with a single click.",
    step_2_title: "Generate several at once",
    step_2_desc: "Check \"Generate Multiple CPFs\", choose how many (between 2 and 100), and click \"Generate CPFs\". The \"Copy All\" button sends the entire list to your clipboard.",
    step_3_title: "Choose the format",
    step_3_desc: "By default, the CPF is formatted with dots and a dash. If you need the raw number (database, JSON, etc.), enable \"Numbers Only\" before generating.",

    faq_title: "Frequently Asked Questions",
    faq_1_q: "Are the CPFs generated here real or registered with the Brazilian tax authority?",
    faq_1_a: "No. They are fictitious numbers built with the same validation algorithm used by the Receita Federal, but with no connection to real people. They pass the check-digit verification because the calculation is correct, and nothing more. Do not attempt to use them for official registrations — they will not be accepted, and the attempt may constitute fraud.",
    faq_2_q: "Why is there a state filter in the generator?",
    faq_2_a: "The 9th digit of the CPF (just before the check digits) corresponds to the fiscal region where the document was issued. São Paulo is 8, Rio Grande do Sul is 0, and so on. For some tests it matters to generate numbers consistent with a specific region, and the filter exists for that purpose. If it doesn't matter, leave it on \"All States\" and the digit will be random.",
    faq_3_q: "When should I use the formatted version vs. numbers only?",
    faq_3_a: "It depends on where the number will be used. Forms and screens that display the CPF to the user typically use the formatted version (999.999.999-99). Databases, APIs, and backend validations, on the other hand, tend to store the raw number without special characters. The \"Numbers Only\" toggle handles this without needing to strip the string afterward.",
    faq_4_q: "Can I use the generator for any purpose?",
    faq_4_a: "For software testing, learning, demos, and development — yes. That is exactly what it was built for. What you cannot do is use a generated CPF in official registrations, contracts, declarations, or any situation that requires real identification. Doing so constitutes document fraud and, depending on the circumstances, may also be considered criminal impersonation.",
    faq_5_q: "What is the difference between a \"fake CPF\" and a \"random CPF\"?",
    faq_5_a: "In practice, both terms refer to the same tool: a utility that generates numbers following the CPF's mathematical rules without belonging to anyone. The terms \"fake\" and \"false\" are popular in searches, although some developers prefer \"fictitious\" or \"test CPF\" as they sound less suggestive. The output and use are identical.",

    see1: "CNPJ Generator",
    see2: "Fancy Letters",
    see3: "Credit Card Generator",
    see4: "Birthday Generator"
  },
  es: {
    pageTitle: "Generador de CPF Válido Online — Gratis y Sin Registro",
    title: "Generador de CPF Válido",
    meta: "Genera CPFs válidos en línea de forma gratuita. Por estado, en lote (hasta 100 a la vez), con o sin formato. Para pruebas de software y desarrollo.",

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
    warning: "Los números generados son ficticios y sirven solo para pruebas.",

    d1: "Generador de CPF en línea y gratuito para desarrolladores y pruebas de software. Genera números de CPF matemáticamente válidos con dígitos verificadores calculados mediante el algoritmo oficial, garantizando que superen cualquier validación de formulario o regla de negocio. Nuestra herramienta funciona directamente en el navegador, es 100% segura (sin vinculación con personas reales) y no requiere registro. Aprovecha funciones avanzadas como la generación de CPF por estado y la creación de lotes de hasta 100 números simultáneos.",

    features_title: "Funcionalidades",
    f_1: "Genera CPF válido por estado",
    f_2: "Lotes de hasta 100 CPFs únicos",
    f_3: "Formato con puntuación o solo números",
    f_4: "Dígitos verificadores calculados por módulo 11",

    how_title: "Cómo funciona el algoritmo del CPF",
    how_desc: "El algoritmo del CPF está compuesto por 11 dígitos: 9 de identificación y 2 verificadores al final. Los 9 primeros son secuenciales por región fiscal, y el 9º indica el estado donde se emitió el documento. Los dos últimos se obtienen de un cálculo de módulo 11 sobre los anteriores: cada dígito se multiplica por un peso, se suman todos, se divide por 11, y el resto define el verificador. El método fue diseñado para detectar errores de escritura. Cambiar un dígito o invertir dos casi siempre rompe la validación, lo que permite a cualquier sistema rechazar números inválidos sin necesidad de consultar a la Receita Federal.",

    use_cases_title: "Casos de Uso",
    use_cases_intro: "Consulta las principales aplicaciones prácticas del generador de CPF en el flujo de trabajo de desarrollo y QA:",
    use_1_t: "Validación de formularios",
    use_1_d: "Probar máscaras, validadores y mensajes de error en campos de registro.",
    use_2_t: "Pruebas automatizadas",
    use_2_d: "Poblar escenarios de prueba con datos que superen la validación sin exponer CPFs reales.",
    use_3_t: "Entornos de desarrollo",
    use_3_d: "Crear registros en homologación y staging sin violar la ley de protección de datos ni usar datos de producción.",
    use_4_t: "Integraciones y APIs",
    use_4_d: "Probar endpoints, payloads y servicios de terceros que requieren el CPF como parámetro.",
    use_5_t: "Maquetas y demostraciones",
    use_5_d: "Completar prototipos, pantallas de demo y presentaciones de producto sin usar datos reales.",

    how_to_use_title: "Cómo Usar",
    step_1_title: "Generar un CPF rápido",
    step_1_desc: "Al abrir la página, el primer CPF ya aparece listo. Para generar otro, haz clic en \"Generar CPF\" — el número queda disponible para copiar con un solo clic.",
    step_2_title: "Generar varios a la vez",
    step_2_desc: "Marca \"Generar Múltiples CPFs\", elige cuántos (entre 2 y 100) y haz clic en \"Generar CPFs\". El botón \"Copiar Todos\" envía la lista completa al portapapeles.",
    step_3_title: "Elegir el formato",
    step_3_desc: "Por defecto, el CPF viene con puntos y guion. Si necesitas el número limpio (base de datos, JSON, etc.), activa \"Solo Números\" antes de generar.",

    faq_title: "Preguntas Frecuentes",
    faq_1_q: "¿Los CPFs generados aquí son reales o están registrados en la Receita Federal?",
    faq_1_a: "No. Son números ficticios construidos con el mismo algoritmo de validación que usa la Receita Federal, pero sin ningún vínculo con personas reales. Superan la verificación de dígitos porque el cálculo es correcto, y nada más. No intentes usarlos en registros oficiales, ya que no serán aceptados, y el intento puede constituir un delito.",
    faq_2_q: "¿Por qué existe un filtro de estado en el generador?",
    faq_2_a: "El 9º dígito del CPF (justo antes de los verificadores) corresponde a la región fiscal donde se emitió el documento. São Paulo es 8, Rio Grande do Sul es 0, y así sucesivamente. Para algunas pruebas importa generar números coherentes con una región específica, y el filtro existe para eso. Si no importa, déjalo en \"Todos los Estados\" y el sorteo será aleatorio.",
    faq_3_q: "¿Cuándo usar el formato con puntos y cuándo solo números?",
    faq_3_a: "Depende de dónde se usará el número. Los formularios y pantallas que muestran el CPF al usuario normalmente usan el formato con puntuación (999.999.999-99). Las bases de datos, APIs y validaciones de backend tienden a almacenar el número limpio, sin caracteres especiales. El toggle \"Solo Números\" lo resuelve sin necesidad de procesar la cadena después.",
    faq_4_q: "¿Puedo usar el generador para cualquier finalidad?",
    faq_4_a: "Para pruebas de software, estudio, demostraciones y desarrollo, sí. Para eso existe exactamente. Lo que no puedes hacer es usar un CPF generado en registros oficiales, contratos, declaraciones o cualquier situación que requiera identificación real. Eso constituye falsedad ideológica y, dependiendo del caso, puede ser considerado estafa.",
    faq_5_q: "¿Cuál es la diferencia entre \"CPF falso\" y \"CPF aleatorio\"?",
    faq_5_a: "En la práctica, ambos términos se refieren a la misma herramienta: un utilitario que genera números siguiendo la regla matemática del CPF, pero sin pertenecer a nadie. Los términos \"falso\" y \"fake\" son populares en las búsquedas, aunque algunos desarrolladores prefieren \"ficticio\" o \"de prueba\" por sonar menos sugestivos. El resultado y el uso son idénticos.",

    see1: "Generador de CNPJ",
    see2: "Letras Diferentes",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Generador de Fecha de Nacimiento"
  },
  fr: {
    pageTitle: "Générateur de CPF Valide en Ligne — Gratuit et Sans Inscription",
    title: "Générateur de CPF Valide",
    meta: "Générez des CPF valides en ligne gratuitement. Par état, en lot (jusqu'à 100 à la fois), avec ou sans formatage. Pour les tests logiciels et le développement.",

    num: "Chiffres Uniquement",
    multiple_label: "Générer Plusieurs CPF",
    select_state: "Sélectionner l'État",
    all_states: "Tous les États",
    region_from: "Région Fiscale",
    bt: "Générer un CPF",
    bt_multiple: "Générer des CPF",
    cpf_label: "CPF Généré",
    quantity: "Quantité",
    generated_cpfs: "CPF Générés ({count})",
    copy_all: "Tout Copier",
    placeholder: "Cliquez sur Générer un CPF pour créer un numéro",
    warning: "Les numéros générés sont fictifs et servent uniquement à des fins de test.",

    d1: "Générateur de CPF en ligne et gratuit pour les développeurs et les tests logiciels. Générez des numéros de CPF mathématiquement valides avec des chiffres de contrôle calculés selon l'algorithme officiel, garantissant qu'ils passent toute validation de formulaire ou règle métier. Notre outil fonctionne directement dans le navigateur, est 100 % sécurisé (sans lien avec de vraies personnes) et ne nécessite aucune inscription. Profitez de fonctionnalités avancées comme la génération de CPF par état et la création de lots de jusqu'à 100 numéros simultanément.",

    features_title: "Fonctionnalités",
    f_1: "Génère un CPF valide par état",
    f_2: "Lots de jusqu'à 100 CPF uniques",
    f_3: "Format avec ponctuation ou chiffres seuls",
    f_4: "Chiffres de contrôle calculés par modulo 11",

    how_title: "Comment fonctionne l'algorithme du CPF",
    how_desc: "L'algorithme du CPF est composé de 11 chiffres : 9 d'identification et 2 de contrôle à la fin. Les 9 premiers sont séquentiels par région fiscale, et le 9e indique l'état où le document a été émis. Les deux derniers résultent d'un calcul modulo 11 sur les précédents : chaque chiffre est multiplié par un poids, tout est additionné, divisé par 11, et le reste détermine le chiffre de contrôle. La méthode a été conçue pour détecter les erreurs de frappe. Modifier un chiffre ou en inverser deux brise presque toujours la validation, ce qui permet à tout système de rejeter les numéros invalides sans consulter l'administration fiscale.",

    use_cases_title: "Cas d'Usage",
    use_cases_intro: "Voici les principales applications pratiques du générateur de CPF dans les flux de travail de développement et de QA :",
    use_1_t: "Validation de formulaires",
    use_1_d: "Tester les masques de saisie, les validateurs et les messages d'erreur dans les champs d'inscription.",
    use_2_t: "Tests automatisés",
    use_2_d: "Alimenter des scénarios de test avec des données qui passent la validation sans exposer de vrais CPF.",
    use_3_t: "Environnements de développement",
    use_3_d: "Créer des enregistrements en staging et en recette sans violer les lois sur la protection des données ni utiliser des données de production.",
    use_4_t: "Intégrations et API",
    use_4_d: "Tester des endpoints, des payloads et des services tiers qui requièrent un CPF comme paramètre.",
    use_5_t: "Maquettes et démonstrations",
    use_5_d: "Remplir des prototypes, des écrans de démo et des présentations produit sans utiliser de vraies données.",

    how_to_use_title: "Comment Utiliser",
    step_1_title: "Générer un CPF rapidement",
    step_1_desc: "En ouvrant la page, le premier CPF est déjà prêt. Pour en générer un autre, cliquez sur « Générer un CPF » — le numéro est disponible à copier en un seul clic.",
    step_2_title: "Générer plusieurs à la fois",
    step_2_desc: "Cochez « Générer Plusieurs CPF », choisissez combien (entre 2 et 100) et cliquez sur « Générer des CPF ». Le bouton « Tout Copier » envoie la liste entière dans le presse-papiers.",
    step_3_title: "Choisir le format",
    step_3_desc: "Par défaut, le CPF est formaté avec des points et un tiret. Si vous avez besoin du numéro brut (base de données, JSON, etc.), activez « Chiffres Uniquement » avant de générer.",

    faq_title: "Questions Fréquentes",
    faq_1_q: "Les CPF générés ici sont-ils réels ou enregistrés auprès de la Receita Federal ?",
    faq_1_a: "Non. Ce sont des numéros fictifs construits avec le même algorithme de validation qu'utilise la Receita Federal, mais sans aucun lien avec de vraies personnes. Ils passent la vérification des chiffres de contrôle parce que le calcul est correct, et rien de plus. N'essayez pas de les utiliser pour des inscriptions officielles — ils ne seront pas acceptés, et la tentative peut constituer une fraude.",
    faq_2_q: "Pourquoi y a-t-il un filtre par état dans le générateur ?",
    faq_2_a: "Le 9e chiffre du CPF (juste avant les chiffres de contrôle) correspond à la région fiscale où le document a été émis. São Paulo correspond au 8, Rio Grande do Sul au 0, et ainsi de suite. Pour certains tests, il est important de générer des numéros cohérents avec une région spécifique, et le filtre existe à cet effet. Si cela n'a pas d'importance, laissez sur « Tous les États » et le tirage sera aléatoire.",
    faq_3_q: "Quand utiliser le format avec ponctuation et quand utiliser les chiffres seuls ?",
    faq_3_a: "Cela dépend de l'endroit où le numéro sera utilisé. Les formulaires et les écrans qui affichent le CPF à l'utilisateur utilisent généralement le format ponctué (999.999.999-99). Les bases de données, les API et les validations backend ont tendance à stocker le numéro brut, sans caractères spéciaux. Le bouton « Chiffres Uniquement » règle cela sans avoir à traiter la chaîne par la suite.",
    faq_4_q: "Puis-je utiliser le générateur à n'importe quelle fin ?",
    faq_4_a: "Pour les tests logiciels, l'apprentissage, les démonstrations et le développement, oui. C'est exactement pour cela qu'il a été créé. Ce que vous ne pouvez pas faire, c'est utiliser un CPF généré dans des inscriptions officielles, des contrats, des déclarations ou toute situation nécessitant une identification réelle. Cela constitue un faux en écriture et, selon les circonstances, peut être considéré comme une escroquerie.",
    faq_5_q: "Quelle est la différence entre un « faux CPF » et un « CPF aléatoire » ?",
    faq_5_a: "En pratique, les deux termes désignent le même outil : un utilitaire qui génère des numéros en suivant la règle mathématique du CPF, mais sans appartenir à personne. Les termes « faux » et « fake » sont populaires dans les recherches, bien que certains développeurs préfèrent « fictif » ou « de test » car ils semblent moins suggestifs. Le résultat et l'utilisation sont identiques.",

    see1: "Générateur de CNPJ",
    see2: "Lettres Différentes",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance"
  },
  it: {
    pageTitle: "Generatore di CPF Valido Online — Gratuito e Senza Registrazione",
    title: "Generatore di CPF Valido",
    meta: "Genera CPF validi online gratuitamente. Per stato, in blocco (fino a 100 alla volta), con o senza formattazione. Per test software e sviluppo.",

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
    warning: "I numeri generati sono fittizi e servono solo a scopi di test.",

    d1: "Generatore di CPF online e gratuito per sviluppatori e test software. Genera numeri CPF matematicamente validi con cifre di controllo calcolate tramite l'algoritmo ufficiale, garantendo che superino qualsiasi validazione di modulo o regola di business. Il nostro strumento funziona direttamente nel browser, è sicuro al 100% (senza collegamento a persone reali) e non richiede registrazione. Sfrutta funzionalità avanzate come la generazione di CPF per stato e la creazione di batch fino a 100 numeri contemporaneamente.",

    features_title: "Funzionalità",
    f_1: "Genera CPF valido per stato",
    f_2: "Batch fino a 100 CPF unici",
    f_3: "Formato con punteggiatura o solo numeri",
    f_4: "Cifre di controllo calcolate con modulo 11",

    how_title: "Come funziona l'algoritmo del CPF",
    how_desc: "L'algoritmo del CPF è composto da 11 cifre: 9 di identificazione e 2 di controllo alla fine. Le prime 9 sono sequenziali per regione fiscale, e la 9ª indica lo stato in cui il documento è stato emesso. Le ultime due derivano da un calcolo modulo 11 sulle cifre precedenti: ogni cifra viene moltiplicata per un peso, tutto viene sommato, diviso per 11, e il resto determina la cifra di controllo. Il metodo è stato progettato per rilevare errori di battitura. Modificare una cifra o invertirne due quasi sempre rompe la validazione, consentendo a qualsiasi sistema di rifiutare numeri non validi senza consultare l'autorità fiscale.",

    use_cases_title: "Casi d'Uso",
    use_cases_intro: "Ecco le principali applicazioni pratiche del generatore di CPF nel flusso di lavoro di sviluppo e QA:",
    use_1_t: "Validazione di moduli",
    use_1_d: "Testare maschere di input, validatori e messaggi di errore nei campi di registrazione.",
    use_2_t: "Test automatizzati",
    use_2_d: "Popolare scenari di test con dati che superano la validazione senza esporre CPF reali.",
    use_3_t: "Ambienti di sviluppo",
    use_3_d: "Creare record in staging e collaudo senza violare le leggi sulla protezione dei dati né usare dati di produzione.",
    use_4_t: "Integrazioni e API",
    use_4_d: "Testare endpoint, payload e servizi di terze parti che richiedono un CPF come parametro.",
    use_5_t: "Mockup e dimostrazioni",
    use_5_d: "Compilare prototipi, schermate demo e presentazioni di prodotto senza utilizzare dati reali.",

    how_to_use_title: "Come Usare",
    step_1_title: "Generare un CPF rapidamente",
    step_1_desc: "Aprendo la pagina, il primo CPF è già pronto. Per generarne un altro, clicca su \"Genera CPF\" — il numero è disponibile per essere copiato con un solo clic.",
    step_2_title: "Generare più CPF in una volta",
    step_2_desc: "Seleziona \"Genera Più CPF\", scegli quanti (tra 2 e 100) e clicca su \"Genera CPF\". Il pulsante \"Copia Tutti\" invia l'intera lista agli appunti.",
    step_3_title: "Scegliere il formato",
    step_3_desc: "Per impostazione predefinita, il CPF è formattato con punti e trattino. Se hai bisogno del numero grezzo (database, JSON, ecc.), attiva \"Solo Numeri\" prima di generare.",

    faq_title: "Domande Frequenti",
    faq_1_q: "I CPF generati qui sono reali o registrati presso la Receita Federal?",
    faq_1_a: "No. Sono numeri fittizi costruiti con lo stesso algoritmo di validazione usato dalla Receita Federal, ma senza alcun collegamento con persone reali. Superano la verifica delle cifre di controllo perché il calcolo è corretto, e nulla di più. Non tentare di usarli per registrazioni ufficiali — non saranno accettati e il tentativo può costituire una frode.",
    faq_2_q: "Perché c'è un filtro per stato nel generatore?",
    faq_2_a: "La 9ª cifra del CPF (subito prima delle cifre di controllo) corrisponde alla regione fiscale in cui il documento è stato emesso. São Paulo corrisponde all'8, Rio Grande do Sul allo 0, e così via. Per alcuni test è importante generare numeri coerenti con una regione specifica, e il filtro esiste per questo. Se non importa, lascia su \"Tutti gli Stati\" e il sorteggio sarà casuale.",
    faq_3_q: "Quando usare il formato con punteggiatura e quando solo i numeri?",
    faq_3_a: "Dipende da dove verrà usato il numero. I moduli e le schermate che mostrano il CPF all'utente utilizzano generalmente il formato con punteggiatura (999.999.999-99). I database, le API e le validazioni backend tendono invece a memorizzare il numero grezzo, senza caratteri speciali. Il toggle \"Solo Numeri\" risolve il problema senza dover elaborare la stringa in seguito.",
    faq_4_q: "Posso usare il generatore per qualsiasi scopo?",
    faq_4_a: "Per test software, studio, dimostrazioni e sviluppo, sì. È esattamente per questo che esiste. Quello che non puoi fare è usare un CPF generato in registrazioni ufficiali, contratti, dichiarazioni o qualsiasi situazione che richieda un'identificazione reale. Ciò costituisce falso in atto pubblico e, a seconda dei casi, può essere considerato una truffa.",
    faq_5_q: "Qual è la differenza tra un \"CPF falso\" e un \"CPF casuale\"?",
    faq_5_a: "In pratica, entrambi i termini si riferiscono allo stesso strumento: un'utilità che genera numeri seguendo la regola matematica del CPF, ma senza appartenere a nessuno. I termini \"falso\" e \"fake\" sono popolari nelle ricerche, sebbene alcuni sviluppatori preferiscano \"fittizio\" o \"di test\" perché sembrano meno suggestivi. Il risultato e l'utilizzo sono identici.",

    see1: "Generatore di CNPJ",
    see2: "Lettere Diverse",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita"
},
  id: {
    pageTitle: "Generator CPF Valid Online — Gratis Tanpa Pendaftaran",
    title: "Generator CPF Valid",
    meta: "Buat CPF valid secara online secara gratis. Per negara bagian, massal (hingga 100 sekaligus), dengan atau tanpa format. Untuk pengujian perangkat lunak dan pengembangan.",

    num: "Angka Saja",
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
    warning: "Nomor yang dihasilkan bersifat fiktif dan hanya untuk keperluan pengujian.",

    d1: "Generator CPF online dan gratis untuk pengembang dan pengujian perangkat lunak. Buat nomor CPF yang valid secara matematis dengan digit verifikasi yang dihitung menggunakan algoritma resmi, memastikan mereka lulus validasi formulir atau aturan bisnis apa pun. Alat kami berjalan langsung di browser, 100% aman (tidak terhubung dengan orang sungguhan), dan tidak memerlukan pendaftaran. Manfaatkan fitur canggih seperti pembuatan CPF per negara bagian dan pembuatan batch hingga 100 nomor sekaligus.",

    features_title: "Fitur",
    f_1: "Buat CPF valid per negara bagian",
    f_2: "Batch hingga 100 CPF unik",
    f_3: "Format dengan tanda baca atau angka saja",
    f_4: "Digit verifikasi dihitung dengan modulo 11",

    how_title: "Cara kerja algoritma CPF",
    how_desc: "Algoritma CPF terdiri dari 11 digit: 9 identifikasi dan 2 verifikasi di akhir. 9 digit pertama bersifat sekuensial berdasarkan wilayah fiskal, dan digit ke-9 menunjukkan negara bagian tempat dokumen diterbitkan. Dua digit terakhir berasal dari perhitungan modulo 11 atas digit sebelumnya: setiap digit dikalikan dengan bobot, semuanya dijumlahkan, dibagi 11, dan sisanya menentukan digit verifikasi. Metode ini dirancang untuk mendeteksi kesalahan ketik. Mengubah satu digit atau membalik dua digit hampir selalu merusak validasi, sehingga sistem apa pun dapat menolak nomor yang tidak valid tanpa perlu menghubungi otoritas pajak.",

    use_cases_title: "Kasus Penggunaan",
    use_cases_intro: "Berikut adalah aplikasi praktis utama generator CPF dalam alur kerja pengembangan dan QA:",
    use_1_t: "Validasi formulir",
    use_1_d: "Menguji mask input, validator, dan pesan kesalahan pada kolom pendaftaran.",
    use_2_t: "Pengujian otomatis",
    use_2_d: "Mengisi skenario pengujian dengan data yang lulus validasi tanpa mengekspos CPF asli.",
    use_3_t: "Lingkungan pengembangan",
    use_3_d: "Membuat catatan di staging dan homologasi tanpa melanggar undang-undang perlindungan data atau menggunakan data produksi.",
    use_4_t: "Integrasi dan API",
    use_4_d: "Menguji endpoint, payload, dan layanan pihak ketiga yang memerlukan CPF sebagai parameter.",
    use_5_t: "Mockup dan demonstrasi",
    use_5_d: "Mengisi prototipe, layar demo, dan presentasi produk tanpa menggunakan data asli.",

    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Buat CPF dengan cepat",
    step_1_desc: "Saat membuka halaman, CPF pertama sudah siap. Untuk membuat yang baru, klik \"Buat CPF\" — nomor tersedia untuk disalin dengan satu klik.",
    step_2_title: "Buat beberapa sekaligus",
    step_2_desc: "Centang \"Buat Beberapa CPF\", pilih jumlahnya (antara 2 dan 100), lalu klik \"Buat CPF\". Tombol \"Salin Semua\" mengirim seluruh daftar ke clipboard.",
    step_3_title: "Pilih format",
    step_3_desc: "Secara default, CPF diformat dengan titik dan tanda hubung. Jika Anda membutuhkan nomor mentah (database, JSON, dll.), aktifkan \"Angka Saja\" sebelum membuat.",

    faq_title: "Pertanyaan yang Sering Diajukan",
    faq_1_q: "Apakah CPF yang dihasilkan di sini nyata atau terdaftar di Receita Federal?",
    faq_1_a: "Tidak. Mereka adalah nomor fiktif yang dibangun dengan algoritma validasi yang sama yang digunakan Receita Federal, tetapi tanpa hubungan apa pun dengan orang nyata. Mereka lulus verifikasi digit karena perhitungannya benar, dan tidak lebih dari itu. Jangan mencoba menggunakannya untuk pendaftaran resmi — tidak akan diterima, dan upaya tersebut dapat dianggap sebagai penipuan.",
    faq_2_q: "Mengapa ada filter negara bagian di generator?",
    faq_2_a: "Digit ke-9 CPF (tepat sebelum digit verifikasi) sesuai dengan wilayah fiskal tempat dokumen diterbitkan. São Paulo adalah 8, Rio Grande do Sul adalah 0, dan seterusnya. Untuk beberapa pengujian, penting untuk menghasilkan nomor yang konsisten dengan wilayah tertentu, dan filter ini ada untuk tujuan itu. Jika tidak penting, biarkan di \"Semua Negara Bagian\" dan pemilihan akan acak.",
    faq_3_q: "Kapan menggunakan format dengan tanda baca dan kapan hanya angka?",
    faq_3_a: "Tergantung di mana nomor akan digunakan. Formulir dan layar yang menampilkan CPF kepada pengguna biasanya menggunakan format bertanda baca (999.999.999-99). Database, API, dan validasi backend cenderung menyimpan nomor mentah, tanpa karakter khusus. Toggle \"Angka Saja\" menyelesaikan ini tanpa perlu memproses string setelahnya.",
    faq_4_q: "Bisakah saya menggunakan generator untuk tujuan apa pun?",
    faq_4_a: "Untuk pengujian perangkat lunak, pembelajaran, demonstrasi, dan pengembangan, ya. Itulah tepatnya tujuan pembuatannya. Yang tidak boleh Anda lakukan adalah menggunakan CPF yang dihasilkan dalam pendaftaran resmi, kontrak, deklarasi, atau situasi apa pun yang memerlukan identifikasi nyata. Hal itu merupakan pemalsuan dokumen dan, tergantung kasusnya, dapat dianggap sebagai penipuan.",
    faq_5_q: "Apa perbedaan antara \"CPF palsu\" dan \"CPF acak\"?",
    faq_5_a: "Dalam praktiknya, kedua istilah mengacu pada alat yang sama: utilitas yang menghasilkan nomor mengikuti aturan matematis CPF, tetapi tanpa milik siapa pun. Istilah \"palsu\" dan \"fake\" populer dalam pencarian, meskipun beberapa pengembang lebih suka \"fiktif\" atau \"untuk pengujian\" karena terdengar kurang sugestif. Hasilnya dan penggunaannya identik.",

    see1: "Generator CNPJ",
    see2: "Huruf Berbeda",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir"
  },
  de: {
    pageTitle: "Gültiger CPF-Generator Online — Kostenlos und Ohne Anmeldung",
    title: "Gültiger CPF-Generator",
    meta: "Generieren Sie gültige CPF-Nummern kostenlos online. Nach Bundesstaat, in Massen (bis zu 100 auf einmal), mit oder ohne Formatierung. Für Softwaretests und Entwicklung.",

    num: "Nur Zahlen",
    multiple_label: "Mehrere CPFs generieren",
    select_state: "Bundesstaat auswählen",
    all_states: "Alle Bundesstaaten",
    region_from: "Steuerregion",
    bt: "CPF generieren",
    bt_multiple: "CPFs generieren",
    cpf_label: "Generierter CPF",
    quantity: "Anzahl",
    generated_cpfs: "Generierte CPFs ({count})",
    copy_all: "Alle kopieren",
    placeholder: "Klicken Sie auf CPF generieren, um eine Nummer zu erstellen",
    warning: "Die generierten Nummern sind fiktiv und dienen ausschließlich Testzwecken.",

    d1: "Kostenloser Online-CPF-Generator für Entwickler und Softwaretests. Generieren Sie mathematisch gültige CPF-Nummern mit Prüfziffern, die nach dem offiziellen Algorithmus berechnet werden, sodass sie jede Formularvalidierung oder Geschäftsregel bestehen. Unser Tool läuft direkt im Browser, ist 100 % sicher (ohne Verbindung zu echten Personen) und erfordert keine Anmeldung. Nutzen Sie erweiterte Funktionen wie die CPF-Generierung nach Bundesstaat und die Erstellung von Batches mit bis zu 100 Nummern gleichzeitig.",

    features_title: "Funktionen",
    f_1: "Gültigen CPF nach Bundesstaat generieren",
    f_2: "Batches mit bis zu 100 eindeutigen CPFs",
    f_3: "Format mit Interpunktion oder nur Zahlen",
    f_4: "Prüfziffern berechnet mit Modulo 11",

    how_title: "Wie der CPF-Algorithmus funktioniert",
    how_desc: "Der CPF-Algorithmus besteht aus 11 Ziffern: 9 Identifikationsziffern und 2 Prüfziffern am Ende. Die ersten 9 sind sequenziell nach Steuerregion, und die 9. gibt den Bundesstaat an, in dem das Dokument ausgestellt wurde. Die letzten beiden ergeben sich aus einer Modulo-11-Berechnung über die vorherigen Ziffern: Jede Ziffer wird mit einem Gewicht multipliziert, alles wird addiert, durch 11 geteilt, und der Rest bestimmt die Prüfziffer. Die Methode wurde entwickelt, um Tippfehler zu erkennen. Das Ändern einer Ziffer oder das Vertauschen von zwei bricht fast immer die Validierung, sodass jedes System ungültige Nummern ablehnen kann, ohne die Steuerbehörde zu befragen.",

    use_cases_title: "Anwendungsfälle",
    use_cases_intro: "Hier sind die wichtigsten praktischen Anwendungen des CPF-Generators im Entwicklungs- und QA-Workflow:",
    use_1_t: "Formularvalidierung",
    use_1_d: "Eingabemasken, Validatoren und Fehlermeldungen in Registrierungsfeldern testen.",
    use_2_t: "Automatisierte Tests",
    use_2_d: "Testszenarien mit Daten füllen, die die Validierung bestehen, ohne echte CPFs preiszugeben.",
    use_3_t: "Entwicklungsumgebungen",
    use_3_d: "Datensätze in Staging- und Testumgebungen erstellen, ohne Datenschutzgesetze zu verletzen oder Produktionsdaten zu verwenden.",
    use_4_t: "Integrationen und APIs",
    use_4_d: "Endpunkte, Payloads und Drittanbieterdienste testen, die einen CPF als Parameter erfordern.",
    use_5_t: "Mockups und Demonstrationen",
    use_5_d: "Prototypen, Demo-Bildschirme und Produktpräsentationen ohne echte Daten ausfüllen.",

    how_to_use_title: "Verwendung",
    step_1_title: "Schnell einen CPF generieren",
    step_1_desc: "Beim Öffnen der Seite ist der erste CPF bereits fertig. Um einen weiteren zu generieren, klicken Sie auf \"CPF generieren\" — die Nummer steht mit einem einzigen Klick zum Kopieren bereit.",
    step_2_title: "Mehrere auf einmal generieren",
    step_2_desc: "Aktivieren Sie \"Mehrere CPFs generieren\", wählen Sie die Anzahl (zwischen 2 und 100) und klicken Sie auf \"CPFs generieren\". Die Schaltfläche \"Alle kopieren\" sendet die gesamte Liste in die Zwischenablage.",
    step_3_title: "Format wählen",
    step_3_desc: "Standardmäßig wird der CPF mit Punkten und Bindestrich formatiert. Wenn Sie die Rohdaten benötigen (Datenbank, JSON usw.), aktivieren Sie \"Nur Zahlen\" vor der Generierung.",

    faq_title: "Häufig gestellte Fragen",
    faq_1_q: "Sind die hier generierten CPFs echt oder bei der Receita Federal registriert?",
    faq_1_a: "Nein. Es sind fiktive Nummern, die mit demselben Validierungsalgorithmus erstellt wurden, den die Receita Federal verwendet, aber ohne jede Verbindung zu echten Personen. Sie bestehen die Prüfzifferüberprüfung, weil die Berechnung korrekt ist, und nichts weiter. Versuchen Sie nicht, sie für offizielle Registrierungen zu verwenden — sie werden nicht akzeptiert, und der Versuch kann als Betrug gewertet werden.",
    faq_2_q: "Warum gibt es einen Bundesstaatsfilter im Generator?",
    faq_2_a: "Die 9. Ziffer des CPF (direkt vor den Prüfziffern) entspricht der Steuerregion, in der das Dokument ausgestellt wurde. São Paulo ist 8, Rio Grande do Sul ist 0, und so weiter. Für einige Tests ist es wichtig, Nummern zu generieren, die mit einer bestimmten Region übereinstimmen, und der Filter dient genau diesem Zweck. Wenn es keine Rolle spielt, lassen Sie es auf \"Alle Bundesstaaten\" und die Auswahl ist zufällig.",
    faq_3_q: "Wann das Format mit Interpunktion und wann nur Zahlen verwenden?",
    faq_3_a: "Es hängt davon ab, wo die Nummer verwendet wird. Formulare und Bildschirme, die den CPF dem Benutzer anzeigen, verwenden normalerweise das formatierte Format (999.999.999-99). Datenbanken, APIs und Backend-Validierungen neigen dazu, die Rohdaten ohne Sonderzeichen zu speichern. Der Schalter \"Nur Zahlen\" löst dies, ohne die Zeichenkette danach verarbeiten zu müssen.",
    faq_4_q: "Kann ich den Generator für jeden Zweck verwenden?",
    faq_4_a: "Für Softwaretests, Lernen, Demonstrationen und Entwicklung, ja. Genau dafür wurde er erstellt. Was Sie nicht tun können, ist einen generierten CPF bei offiziellen Registrierungen, Verträgen, Erklärungen oder in jeder Situation zu verwenden, die eine echte Identifikation erfordert. Dies stellt eine Urkundenfälschung dar und kann je nach Fall als Betrug gewertet werden.",
    faq_5_q: "Was ist der Unterschied zwischen einem \"falschen CPF\" und einem \"zufälligen CPF\"?",
    faq_5_a: "In der Praxis beziehen sich beide Begriffe auf dasselbe Tool: ein Hilfsprogramm, das Nummern nach der mathematischen Regel des CPF generiert, aber niemandem gehört. Die Begriffe \"falsch\" und \"fake\" sind in Suchanfragen populär, obwohl einige Entwickler \"fiktiv\" oder \"Test-CPF\" bevorzugen, da sie weniger suggestiv klingen. Das Ergebnis und die Verwendung sind identisch.",

    see1: "CNPJ-Generator",
    see2: "Andere Buchstaben",
    see3: "Kreditkartengenerator",
    see4: "Geburtsdatum-Generator"
  }
}
</i18n>