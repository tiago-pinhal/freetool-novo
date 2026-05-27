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
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') }
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
    de: '/cpf-generator',
    nl: '/cpf-generator',
    ru: '/generator-cpf',
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

       
      </div>

      <!-- Resultado -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 flex flex-col justify-center">
        <Transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100">
          <div v-if="state.cpf && !state.cpfList.length" class="space-y-2 w-full">
            <LineCopy :content="state.cpf" :label="t('cpf_label')" class="!my-0 [&>div:last-child]:!w-full" />
            <p v-if="state.generatedRegion && state.selectedRegion === 'all'"
              class="text-xs text-base-content/70 px-1 mt-3">
              {{ t('region_from') }}: {{ getRegionName(state.generatedRegion) }}
            </p>
            <p class="text-xs text-base-content/70 italic px-1 text-center mt-3">{{ t('warning') }}</p>
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
              <p v-if="state.selectedRegion === 'all'" class="text-xs text-base-content/70 px-1 mt-2">{{
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

        <FeatureSection :title="t('features_title')" :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5')]" />

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:book-open-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:map-20-solid" class="w-6 h-6 text-primary" />
            {{ t('table_title') }}
          </h2>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th class="w-16 text-center">{{ t('table_digit') }}</th>
                  <th>{{ t('table_states') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in regions" :key="r">
                  <td class="font-mono font-bold text-primary text-center">{{ r }}</td>
                  <td>{{ regionNames[r] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <UseCaseSection :title="t('use_cases_title')" :description="t('use_cases_intro')" :items="[
          { title: t('use_1_t'), description: t('use_1_d') },
          { title: t('use_2_t'), description: t('use_2_d') },
          { title: t('use_3_t'), description: t('use_3_d') },
          { title: t('use_4_t'), description: t('use_4_d') },
          { title: t('use_5_t'), description: t('use_5_d') },
          { title: t('use_6_t'), description: t('use_6_d') },
          { title: t('use_7_t'), description: t('use_7_d') }
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
    pageTitle: "Gerador de CPF Válido Online para Testes — Grátis",
    title: "Gerador de CPF",
    meta: "Gerador de CPF válido para testes e desenvolvimento de software. Gere um CPF aleatório ou vários de uma vez, por estado, com ou sem pontuação. Grátis, sem cadastro.",

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

    d1: "Gerador de CPF online e gratuito voltado para desenvolvedores e testes de software. A ferramenta gera números de CPF válidos matematicamente, com os dígitos verificadores calculados pelo algoritmo oficial de módulo 11, de modo que passam em qualquer validação de formulário ou regra de negócio. Todo o processo acontece no próprio navegador, sem cadastro e sem vínculo com pessoas reais. É possível gerar um CPF aleatório, restringir o resultado a um estado específico ou criar lotes de até 100 números de uma só vez.",

    features_title: "Funcionalidades",
    f_1: "Gera CPF válido por estado",
    f_2: "Lotes de até 100 CPFs únicos",
    f_3: "Formato com pontuação ou só números",
    f_4: "Dígitos verificadores calculados pelo módulo 11",
    f_5: "Tabela de regiões fiscais por dígito",

    how_title: "Como o algoritmo do CPF funciona",
    how_desc: "O algoritmo do CPF é composto por 11 dígitos: 9 de identificação e 2 verificadores no final. Os 9 primeiros são sequenciais por região fiscal, e o 9º indica o estado onde o documento foi emitido. Os dois últimos saem de um cálculo de módulo 11 sobre os anteriores: cada dígito é multiplicado por um peso, soma-se tudo, divide por 11, e o resto define o verificador. O método foi pensado para detectar erros de digitação. Trocar um dígito ou inverter dois quase sempre quebra a validação, o que permite a qualquer sistema rejeitar números inválidos sem precisar consultar a Receita.",

    use_cases_title: "Casos de Uso",
    use_cases_intro: "As aplicações práticas mais comuns do gerador de CPF no fluxo de trabalho de desenvolvimento e QA são:",
    use_1_t: "Validação de formulários e UI",
    use_1_d: "Testar máscaras de input, validações em tempo real (JavaScript, React, Angular etc.), mensagens de erro e comportamento do frontend com dados que passam em todas as regras.",
    use_2_t: "Testes automatizados (Unit, Integration e E2E)",
    use_2_d: "Popular fixtures, bancos de dados de teste e cenários com CPFs válidos, eliminando o uso de dados reais e reduzindo o risco de vazamento.",
    use_3_t: "Ambientes de desenvolvimento e homologação",
    use_3_d: "Criar usuários de teste em staging, bancos locais ou ambientes de demonstração sem violar a LGPD e sem precisar de dados de produção.",
    use_4_t: "Testes de APIs e integrações",
    use_4_d: "Enviar payloads realistas para endpoints que exigem CPF: cadastros, consultas de crédito, emissões de nota fiscal e serviços de terceiros.",
    use_5_t: "Mockups, protótipos e apresentações",
    use_5_d: "Preencher telas no Figma, Adobe XD ou slides para clientes com dados visualmente convincentes, sem expor informações reais.",
    use_6_t: "Testes de performance e carga",
    use_6_d: "Gerar centenas de CPFs rapidamente para simular grandes volumes de cadastros ou consultas em ambiente controlado.",
    use_7_t: "Estudos, treinamentos e cursos",
    use_7_d: "Professores e alunos usam para exemplos práticos em aulas de programação, bancos de dados e validações de formulário.",

    how_to_use_title: "Como Usar",
    step_1_title: "Gerar um CPF rápido",
    step_1_desc: "Ao abrir a página, o primeiro CPF já aparece pronto. Para gerar outro, clique em \"Gerar CPF\", o número fica disponível para copiar com um clique.",
    step_2_title: "Gerar vários de uma vez",
    step_2_desc: "Marque \"Gerar Múltiplos CPFs\", escolha quantos (entre 2 e 100) e clique em \"Gerar CPFs\". O botão \"Copiar Todos\" passa a lista inteira para a área de transferência.",
    step_3_title: "Escolher o formato",
    step_3_desc: "Por padrão, o CPF vem com pontos e traço. Se você precisa do número limpo (banco de dados, JSON, etc.), ative \"Somente Números\" antes de gerar.",

    faq_title: "Perguntas e Respostas",
    faq_1_q: "Usar um CPF gerado é crime?",
    faq_1_a: "Depende do uso. Para testes de software, estudo, demonstrações e desenvolvimento, não há problema, pois é exatamente para isso que a ferramenta existe. O que configura crime é usar um CPF gerado em cadastros oficiais, contratos, declarações ou qualquer situação que exija identificação real. Nesse caso, a conduta pode caracterizar falsidade ideológica (Art. 299 do Código Penal) e, dependendo do contexto, estelionato.",
    faq_2_q: "O CPF gerado aqui é válido e está registrado na Receita Federal?",
    faq_2_a: "O número é matematicamente válido, ou seja, passa na verificação dos dígitos porque o cálculo do módulo 11 está correto. Mas é fictício e não tem nenhum vínculo com pessoas reais nem registro na Receita Federal. Ele serve para validar formulários e regras de negócio durante o desenvolvimento, e nada além disso. Tentar usá-lo em cadastros oficiais não funciona e ainda pode configurar crime.",
    faq_3_q: "Como o gerador define o estado e o que significa o nono dígito do CPF?",
    faq_3_a: "O nono dígito do CPF, logo antes dos dois verificadores, corresponde à região fiscal onde o documento foi emitido. São Paulo é 8, Rio Grande do Sul é 0, Paraná e Santa Catarina são 9, e assim por diante. O seletor de estado fixa esse dígito para gerar números coerentes com uma região específica. Deixando em \"Todos os Estados\", o dígito é sorteado de forma aleatória.",
    faq_4_q: "Quando usar o CPF com pontuação e quando usar só números?",
    faq_4_a: "Depende de onde o número vai entrar. Formulários e telas que exibem o CPF para o usuário costumam usar o formato pontuado (999.999.999-99). Bancos de dados, APIs e validações de backend tendem a armazenar o número limpo, sem caracteres especiais. A opção \"Somente Números\" resolve isso direto na geração, sem precisar tratar a string depois.",
    faq_5_q: "Qual a diferença entre CPF fake, falso e aleatório?",
    faq_5_a: "Na prática, todos os termos descrevem a mesma ferramenta: um utilitário que gera números seguindo a regra matemática do CPF, mas sem pertencer a ninguém. \"Fake\" e \"falso\" são as buscas mais comuns, enquanto alguns desenvolvedores preferem \"fictício\", \"aleatório\" ou \"de teste\" por soarem menos sugestivos. O resultado e a finalidade são os mesmos em todos os casos.",

    table_title: "9º Dígito do CPF por Região Fiscal",
    table_digit: "Dígito",
    table_states: "Estados",
    see1: "Gerador de CNPJ",
    see2: "Letras Diferentes",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  },
  en: {
    pageTitle: "Brazilian CPF Generator — Fake & Valid for Testing",
    title: "CPF Generator",
    meta: "Brazilian CPF generator for software testing and development. Generate a random CPF or several at once, by state, with or without punctuation. Free, no sign-up.",

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

    d1: "Free online CPF generator built for developers and software testing. The tool generates mathematically valid CPF numbers, with check digits calculated by the official modulo 11 algorithm, so they pass any form validation or business rule. The whole process runs in the browser, with no sign-up and no connection to real people. You can generate a random CPF, restrict the result to a specific state, or create batches of up to 100 numbers at once.",

    features_title: "Features",
    f_1: "Generate valid CPF by state",
    f_2: "Batches of up to 100 unique CPFs",
    f_3: "Formatted or numbers-only output",
    f_4: "Check digits calculated via modulo 11",
    f_5: "Fiscal region table by digit",

    how_title: "How the CPF algorithm works",
    how_desc: "The CPF algorithm consists of 11 digits: 9 identification digits and 2 check digits at the end. The first 9 are sequential by fiscal region, and the 9th indicates the state where the document was issued. The last two are derived from a modulo 11 calculation over the preceding digits: each digit is multiplied by a weight, everything is summed, divided by 11, and the remainder determines the check digit. The method was designed to detect typing errors. Changing one digit or swapping two almost always breaks validation, allowing any system to reject invalid numbers without querying the tax authority.",

    use_cases_title: "Use Cases",
    use_cases_intro: "The most common practical applications of the CPF generator in development and QA workflows are:",
    use_1_t: "Form and UI validation",
    use_1_d: "Test input masks, real-time validators (JavaScript, React, Angular, etc.), error messages, and frontend behavior with data that passes every business rule.",
    use_2_t: "Automated testing (Unit, Integration & E2E)",
    use_2_d: "Populate fixtures, test databases, and scenarios with valid CPFs, eliminating real data and reducing the risk of data leaks.",
    use_3_t: "Development and staging environments",
    use_3_d: "Create test users in staging, local databases, or demo environments without violating data protection laws or touching production data.",
    use_4_t: "API and integration testing",
    use_4_d: "Send realistic payloads to endpoints that require a CPF: registrations, credit checks, invoice issuance, and third-party services.",
    use_5_t: "Mockups, prototypes, and presentations",
    use_5_d: "Fill Figma, Adobe XD screens, or client slide decks with visually convincing data, without exposing real information.",
    use_6_t: "Performance and load testing",
    use_6_d: "Generate hundreds of CPFs quickly to simulate large registration or query volumes in a controlled environment.",
    use_7_t: "Studies, training, and courses",
    use_7_d: "Teachers and students use generated CPFs for hands-on examples in programming classes, database courses, and form validation exercises.",

    how_to_use_title: "How to Use",
    step_1_title: "Generate a CPF quickly",
    step_1_desc: "When you open the page, the first CPF is already ready. To generate another, click \"Generate CPF\" — the number is available to copy with a single click.",
    step_2_title: "Generate several at once",
    step_2_desc: "Check \"Generate Multiple CPFs\", choose how many (between 2 and 100), and click \"Generate CPFs\". The \"Copy All\" button sends the entire list to your clipboard.",
    step_3_title: "Choose the format",
    step_3_desc: "By default, the CPF is formatted with dots and a dash. If you need the raw number (database, JSON, etc.), enable \"Numbers Only\" before generating.",

    faq_title: "Questions and Answers",
    faq_1_q: "What is a CPF and what is this generator for?",
    faq_1_a: "The CPF (Cadastro de Pessoas Físicas) is the Brazilian individual taxpayer registry number, the equivalent of a national ID/tax number for individuals. This generator produces numbers that follow the CPF's mathematical rules so they pass form validation and business logic during development. It is meant for software testing, learning, and demos — not for real identification.",
    faq_2_q: "Are the generated CPFs valid and registered with the Brazilian tax authority?",
    faq_2_a: "The number is mathematically valid, meaning it passes check-digit verification because the modulo 11 calculation is correct. But it is fictitious, with no connection to real people and no registration with the Receita Federal. It exists to validate forms and business rules during development, and nothing more. Using a generated CPF in official registrations does not work and, under Brazilian law, may constitute fraud.",
    faq_3_q: "How does the generator set the state, and what does the 9th digit of the CPF mean?",
    faq_3_a: "The 9th digit of the CPF, just before the two check digits, corresponds to the fiscal region where the document was issued. São Paulo is 8, Rio Grande do Sul is 0, Paraná and Santa Catarina are 9, and so on. The state selector fixes that digit to generate numbers consistent with a specific region. Left on \"All States\", the digit is chosen at random.",
    faq_4_q: "When should I use the formatted CPF and when numbers only?",
    faq_4_a: "It depends on where the number will be used. Forms and screens that display the CPF to the user typically use the formatted version (999.999.999-99). Databases, APIs, and backend validations tend to store the raw number without special characters. The \"Numbers Only\" option handles this at generation time, with no need to strip the string afterward.",
    faq_5_q: "What is the difference between a fake, false, and random CPF?",
    faq_5_a: "In practice, all these terms describe the same tool: a utility that generates numbers following the CPF's mathematical rules without belonging to anyone. \"Fake\" and \"false\" are the most common searches, while some developers prefer \"fictitious\", \"random\", or \"test CPF\" as they sound less suggestive. The result and the purpose are the same in every case.",

    table_title: "CPF 9th Digit by Fiscal Region",
    table_digit: "Digit",
    table_states: "States",
    see1: "CNPJ Generator",
    see2: "Fancy Letters",
    see3: "Credit Card Generator",
    see4: "Birthday Generator"
  },
  es: {
    pageTitle: "Generador de CPF de Brasil — Ejemplo Válido Gratis",
    title: "Generador de CPF Brasileño",
    meta: "Generador de CPF válido para pruebas y desarrollo de software. Genera un CPF aleatorio o varios a la vez, por estado, con o sin puntuación. Gratis, sin registro.",

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

    d1: "Generador de CPF online y gratuito orientado a desarrolladores y pruebas de software. La herramienta genera números de CPF matemáticamente válidos, con los dígitos verificadores calculados mediante el algoritmo oficial de módulo 11, de modo que superan cualquier validación de formulario o regla de negocio. Todo el proceso ocurre en el propio navegador, sin registro y sin vínculo con personas reales. Es posible generar un CPF aleatorio, restringir el resultado a un estado específico o crear lotes de hasta 100 números a la vez.",

    features_title: "Funcionalidades",
    f_1: "Genera CPF válido por estado",
    f_2: "Lotes de hasta 100 CPFs únicos",
    f_3: "Formato con puntuación o solo números",
    f_4: "Dígitos verificadores calculados por módulo 11",
    f_5: "Tabla de regiones fiscales por dígito",

    how_title: "Cómo funciona el algoritmo del CPF",
    how_desc: "El algoritmo del CPF está compuesto por 11 dígitos: 9 de identificación y 2 verificadores al final. Los 9 primeros son secuenciales por región fiscal, y el 9º indica el estado donde se emitió el documento. Los dos últimos se obtienen de un cálculo de módulo 11 sobre los anteriores: cada dígito se multiplica por un peso, se suman todos, se divide por 11, y el resto define el verificador. El método fue diseñado para detectar errores de escritura. Cambiar un dígito o invertir dos casi siempre rompe la validación, lo que permite a cualquier sistema rechazar números inválidos sin necesidad de consultar a la Receita Federal.",

    use_cases_title: "Casos de Uso",
    use_cases_intro: "Las aplicaciones prácticas más comunes del generador de CPF en el flujo de trabajo de desarrollo y QA son:",
    use_1_t: "Validación de formularios y UI",
    use_1_d: "Probar máscaras de entrada, validaciones en tiempo real (JavaScript, React, Angular, etc.), mensajes de error y comportamiento del frontend con datos que superan todas las reglas.",
    use_2_t: "Pruebas automatizadas (Unit, Integration y E2E)",
    use_2_d: "Poblar fixtures, bases de datos de prueba y escenarios con CPFs válidos, eliminando el uso de datos reales y reduciendo el riesgo de fuga.",
    use_3_t: "Entornos de desarrollo y homologación",
    use_3_d: "Crear usuarios de prueba en staging, bases de datos locales o entornos de demostración sin violar leyes de protección de datos ni usar datos de producción.",
    use_4_t: "Pruebas de APIs e integraciones",
    use_4_d: "Enviar payloads realistas a endpoints que requieren CPF: registros, consultas de crédito, emisión de facturas y servicios de terceros.",
    use_5_t: "Maquetas, prototipos y presentaciones",
    use_5_d: "Completar pantallas en Figma, Adobe XD o diapositivas para clientes con datos visualmente convincentes, sin exponer información real.",
    use_6_t: "Pruebas de rendimiento y carga",
    use_6_d: "Generar cientos de CPFs rápidamente para simular grandes volúmenes de registros o consultas en entorno controlado.",
    use_7_t: "Estudios, entrenamientos y cursos",
    use_7_d: "Profesores y alumnos los usan para ejemplos prácticos en clases de programación, bases de datos y validación de formularios.",

    how_to_use_title: "Cómo Usar",
    step_1_title: "Generar un CPF rápido",
    step_1_desc: "Al abrir la página, el primer CPF ya aparece listo. Para generar otro, haz clic en \"Generar CPF\" — el número queda disponible para copiar con un solo clic.",
    step_2_title: "Generar varios a la vez",
    step_2_desc: "Marca \"Generar Múltiples CPFs\", elige cuántos (entre 2 y 100) y haz clic en \"Generar CPFs\". El botón \"Copiar Todos\" envía la lista completa al portapapeles.",
    step_3_title: "Elegir el formato",
    step_3_desc: "Por defecto, el CPF viene con puntos y guion. Si necesitas el número limpio (base de datos, JSON, etc.), activa \"Solo Números\" antes de generar.",

    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Qué es un CPF y para qué sirve este generador?",
    faq_1_a: "El CPF (Cadastro de Pessoas Físicas) es el número de registro tributario individual de Brasil, el equivalente a un número de identificación fiscal para personas físicas. Este generador produce números que siguen las reglas matemáticas del CPF para que superen la validación de formularios y la lógica de negocio durante el desarrollo. Está pensado para pruebas de software, estudio y demostraciones, no para identificación real.",
    faq_2_q: "¿Los CPFs generados son válidos y están registrados en la Receita Federal?",
    faq_2_a: "El número es matemáticamente válido, es decir, supera la verificación de dígitos porque el cálculo del módulo 11 es correcto. Pero es ficticio, sin ningún vínculo con personas reales ni registro en la Receita Federal. Existe para validar formularios y reglas de negocio durante el desarrollo, y nada más. Usar un CPF generado en registros oficiales no funciona y, según la legislación brasileña, puede constituir un delito.",
    faq_3_q: "¿Cómo define el generador el estado y qué significa el noveno dígito del CPF?",
    faq_3_a: "El noveno dígito del CPF, justo antes de los dos verificadores, corresponde a la región fiscal donde se emitió el documento. São Paulo es 8, Rio Grande do Sul es 0, Paraná y Santa Catarina son 9, y así sucesivamente. El selector de estado fija ese dígito para generar números coherentes con una región específica. Dejándolo en \"Todos los Estados\", el dígito se sortea de forma aleatoria.",
    faq_4_q: "¿Cuándo usar el CPF con puntuación y cuándo solo números?",
    faq_4_a: "Depende de dónde se usará el número. Los formularios y pantallas que muestran el CPF al usuario suelen usar el formato con puntuación (999.999.999-99). Las bases de datos, APIs y validaciones de backend tienden a almacenar el número limpio, sin caracteres especiales. La opción \"Solo Números\" lo resuelve en el momento de la generación, sin necesidad de procesar la cadena después.",
    faq_5_q: "¿Cuál es la diferencia entre un CPF fake, falso y aleatorio?",
    faq_5_a: "En la práctica, todos estos términos describen la misma herramienta: un utilitario que genera números siguiendo la regla matemática del CPF, pero sin pertenecer a nadie. \"Fake\" y \"falso\" son las búsquedas más comunes, mientras que algunos desarrolladores prefieren \"ficticio\", \"aleatorio\" o \"de prueba\" por sonar menos sugestivos. El resultado y la finalidad son los mismos en todos los casos.",

    table_title: "9º Dígito del CPF por Región Fiscal",
    table_digit: "Dígito",
    table_states: "Estados",
    see1: "Generador de CNPJ",
    see2: "Letras Diferentes",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Generador de Fecha de Nacimiento"
  },
  fr: {
    pageTitle: "Générateur de CPF Valide en Ligne pour Tests — Gratuit",
    title: "Générateur de CPF Brésilien",
    meta: "Générateur de CPF valide pour les tests et le développement logiciel. Générez un CPF aléatoire ou plusieurs à la fois, par état, avec ou sans ponctuation. Gratuit, sans inscription.",

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

    d1: "Générateur de CPF en ligne et gratuit destiné aux développeurs et aux tests logiciels. L'outil génère des numéros de CPF mathématiquement valides, avec les chiffres de contrôle calculés par l'algorithme officiel modulo 11, de sorte qu'ils passent n'importe quelle validation de formulaire ou règle métier. Tout le processus se déroule dans le navigateur, sans inscription et sans lien avec de vraies personnes. Il est possible de générer un CPF aléatoire, de restreindre le résultat à un état spécifique ou de créer des lots allant jusqu'à 100 numéros en une seule fois.",

    features_title: "Fonctionnalités",
    f_1: "Génère un CPF valide par état",
    f_2: "Lots de jusqu'à 100 CPF uniques",
    f_3: "Format avec ponctuation ou chiffres seuls",
    f_4: "Chiffres de contrôle calculés par modulo 11",
    f_5: "Tableau des régions fiscales par chiffre",

    how_title: "Comment fonctionne l'algorithme du CPF",
    how_desc: "L'algorithme du CPF est composé de 11 chiffres : 9 d'identification et 2 de contrôle à la fin. Les 9 premiers sont séquentiels par région fiscale, et le 9e indique l'état où le document a été émis. Les deux derniers résultent d'un calcul modulo 11 sur les précédents : chaque chiffre est multiplié par un poids, tout est additionné, divisé par 11, et le reste détermine le chiffre de contrôle. La méthode a été conçue pour détecter les erreurs de frappe. Modifier un chiffre ou en inverser deux brise presque toujours la validation, ce qui permet à tout système de rejeter les numéros invalides sans consulter l'administration fiscale.",

    use_cases_title: "Cas d'Usage",
    use_cases_intro: "Les applications pratiques les plus courantes du générateur de CPF dans le flux de travail de développement et de QA sont :",
    use_1_t: "Validation de formulaires et UI",
    use_1_d: "Tester les masques de saisie, les validations en temps réel (JavaScript, React, Angular, etc.), les messages d'erreur et le comportement du frontend avec des données qui passent toutes les règles.",
    use_2_t: "Tests automatisés (Unit, Integration et E2E)",
    use_2_d: "Alimenter des fixtures, des bases de données de test et des scénarios avec des CPF valides, en éliminant les données réelles et en réduisant le risque de fuite.",
    use_3_t: "Environnements de développement et de recette",
    use_3_d: "Créer des utilisateurs de test en staging, dans des bases de données locales ou des environnements de démonstration sans violer les lois sur la protection des données ni utiliser des données de production.",
    use_4_t: "Tests d'API et d'intégrations",
    use_4_d: "Envoyer des payloads réalistes aux endpoints nécessitant un CPF : inscriptions, vérifications de crédit, émission de factures et services tiers.",
    use_5_t: "Maquettes, prototypes et présentations",
    use_5_d: "Remplir des écrans Figma, Adobe XD ou des diapositives clients avec des données visuellement convaincantes, sans exposer de vraies informations.",
    use_6_t: "Tests de performance et de charge",
    use_6_d: "Générer des centaines de CPF rapidement pour simuler de grands volumes d'inscriptions ou de requêtes dans un environnement contrôlé.",
    use_7_t: "Études, formations et cours",
    use_7_d: "Professeurs et étudiants les utilisent pour des exemples pratiques en cours de programmation, de bases de données et de validation de formulaires.",

    how_to_use_title: "Comment Utiliser",
    step_1_title: "Générer un CPF rapidement",
    step_1_desc: "En ouvrant la page, le premier CPF est déjà prêt. Pour en générer un autre, cliquez sur « Générer un CPF » — le numéro est disponible à copier en un seul clic.",
    step_2_title: "Générer plusieurs à la fois",
    step_2_desc: "Cochez « Générer Plusieurs CPF », choisissez combien (entre 2 et 100) et cliquez sur « Générer des CPF ». Le bouton « Tout Copier » envoie la liste entière dans le presse-papiers.",
    step_3_title: "Choisir le format",
    step_3_desc: "Par défaut, le CPF est formaté avec des points et un tiret. Si vous avez besoin du numéro brut (base de données, JSON, etc.), activez « Chiffres Uniquement » avant de générer.",

    faq_title: "Questions et Réponses",
    faq_1_q: "Utiliser un CPF généré est-il illégal ?",
    faq_1_a: "Cela dépend de l'usage. Pour les tests logiciels, l'apprentissage, les démonstrations et le développement, il n'y a aucun problème, car c'est exactement à cela que sert l'outil. Ce qui constitue un délit, c'est d'utiliser un CPF généré dans des registres officiels, des contrats, des déclarations ou toute situation nécessitant une identification réelle. Dans ce cas, le comportement peut être qualifié de falsification idéologique (Art. 299 du Code pénal brésilien) et, selon le contexte, d'escroquerie.",
    faq_2_q: "Le CPF généré ici est-il valide et enregistré auprès de la Receita Federal ?",
    faq_2_a: "Le numéro est mathématiquement valide, c'est-à-dire qu'il passe la vérification des chiffres car le calcul modulo 11 est correct. Mais il est fictif et n'a aucun lien avec de vraies personnes ni d'enregistrement auprès de la Receita Federal. Il sert à valider des formulaires et des règles métier pendant le développement, et rien de plus. Tenter de l'utiliser dans des registres officiels ne fonctionne pas et peut constituer un délit.",
    faq_3_q: "Comment le générateur détermine-t-il l'état et que signifie le neuvième chiffre du CPF ?",
    faq_3_a: "Le neuvième chiffre du CPF, juste avant les deux chiffres de contrôle, correspond à la région fiscale où le document a été émis. São Paulo est 8, Rio Grande do Sul est 0, Paraná et Santa Catarina sont 9, et ainsi de suite. Le sélecteur d'état fixe ce chiffre pour générer des numéros cohérents avec une région spécifique. En laissant sur « Tous les États », le chiffre est tiré au sort de manière aléatoire.",
    faq_4_q: "Quand utiliser le CPF avec ponctuation et quand utiliser seulement les chiffres ?",
    faq_4_a: "Cela dépend de l'endroit où le numéro sera utilisé. Les formulaires et les écrans qui affichent le CPF à l'utilisateur utilisent généralement le format avec ponctuation (999.999.999-99). Les bases de données, les API et les validations backend ont tendance à stocker le numéro brut, sans caractères spéciaux. L'option « Chiffres Uniquement » règle cela directement lors de la génération, sans avoir besoin de traiter la chaîne ensuite.",
    faq_5_q: "Quelle est la différence entre un CPF fake, faux et aléatoire ?",
    faq_5_a: "En pratique, tous ces termes décrivent le même outil : un utilitaire qui génère des numéros suivant la règle mathématique du CPF, mais sans appartenir à personne. « Fake » et « faux » sont les recherches les plus courantes, tandis que certains développeurs préfèrent « fictif », « aléatoire » ou « de test » car ils semblent moins suggestifs. Le résultat et la finalité sont les mêmes dans tous les cas.",

    table_title: "9e Chiffre du CPF par Région Fiscale",
    table_digit: "Chiffre",
    table_states: "États",
    see1: "Générateur de CNPJ",
    see2: "Lettres Différentes",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance"
  },
  it: {
    pageTitle: "Generatore di CPF Valido Online per Test — Gratis",
    title: "Generatore di CPF Brasiliano",
    meta: "Generatore di CPF valido per test e sviluppo software. Genera un CPF casuale o più alla volta, per stato, con o senza punteggiatura. Gratis, senza registrazione.",

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

    d1: "Generatore di CPF online e gratuito pensato per sviluppatori e test software. Lo strumento genera numeri di CPF matematicamente validi, con le cifre di controllo calcolate dall'algoritmo ufficiale modulo 11, in modo che superino qualsiasi validazione di modulo o regola aziendale. L'intero processo avviene nel browser, senza registrazione e senza collegamento con persone reali. È possibile generare un CPF casuale, limitare il risultato a uno stato specifico o creare batch fino a 100 numeri in una sola volta.",

    features_title: "Funzionalità",
    f_1: "Genera CPF valido per stato",
    f_2: "Batch fino a 100 CPF unici",
    f_3: "Formato con punteggiatura o solo numeri",
    f_4: "Cifre di controllo calcolate con modulo 11",
    f_5: "Tabella delle regioni fiscali per cifra",

    how_title: "Come funziona l'algoritmo del CPF",
    how_desc: "L'algoritmo del CPF è composto da 11 cifre: 9 di identificazione e 2 di controllo alla fine. Le prime 9 sono sequenziali per regione fiscale, e la 9ª indica lo stato in cui il documento è stato emesso. Le ultime due derivano da un calcolo modulo 11 sulle cifre precedenti: ogni cifra viene moltiplicata per un peso, tutto viene sommato, diviso per 11, e il resto determina la cifra di controllo. Il metodo è stato progettato per rilevare errori di battitura. Modificare una cifra o invertirne due quasi sempre rompe la validazione, consentendo a qualsiasi sistema di rifiutare numeri non validi senza consultare l'autorità fiscale.",

    use_cases_title: "Casi d'Uso",
    use_cases_intro: "Le applicazioni pratiche più comuni del generatore di CPF nel flusso di lavoro di sviluppo e QA sono:",
    use_1_t: "Validazione di form e UI",
    use_1_d: "Testare maschere di input, validazioni in tempo reale (JavaScript, React, Angular, ecc.), messaggi di errore e comportamento del frontend con dati che superano tutte le regole.",
    use_2_t: "Test automatizzati (Unit, Integration e E2E)",
    use_2_d: "Popolare fixture, database di test e scenari con CPF validi, eliminando i dati reali e riducendo il rischio di fuga.",
    use_3_t: "Ambienti di sviluppo e collaudo",
    use_3_d: "Creare utenti di test in staging, database locali o ambienti di dimostrazione senza violare le leggi sulla protezione dei dati né usare dati di produzione.",
    use_4_t: "Test di API e integrazioni",
    use_4_d: "Inviare payload realistici agli endpoint che richiedono un CPF: registrazioni, controlli di credito, emissione di fatture e servizi di terze parti.",
    use_5_t: "Mockup, prototipi e presentazioni",
    use_5_d: "Riempire schermate in Figma, Adobe XD o slide per clienti con dati visivamente convincenti, senza esporre informazioni reali.",
    use_6_t: "Test di performance e carico",
    use_6_d: "Generare centinaia di CPF rapidamente per simulare grandi volumi di registrazioni o query in un ambiente controllato.",
    use_7_t: "Studi, formazione e corsi",
    use_7_d: "Professori e studenti li usano per esempi pratici in lezioni di programmazione, database e validazione di form.",

    how_to_use_title: "Come Usare",
    step_1_title: "Generare un CPF rapidamente",
    step_1_desc: "Aprendo la pagina, il primo CPF è già pronto. Per generarne un altro, clicca su \"Genera CPF\" — il numero è disponibile per essere copiato con un solo clic.",
    step_2_title: "Generare più CPF in una volta",
    step_2_desc: "Seleziona \"Genera Più CPF\", scegli quanti (tra 2 e 100) e clicca su \"Genera CPF\". Il pulsante \"Copia Tutti\" invia l'intera lista agli appunti.",
    step_3_title: "Scegliere il formato",
    step_3_desc: "Per impostazione predefinita, il CPF è formattato con punti e trattino. Se hai bisogno del numero grezzo (database, JSON, ecc.), attiva \"Solo Numeri\" prima di generare.",

    faq_title: "Domande e Risposte",
    faq_1_q: "Usare un CPF generato è illegale?",
    faq_1_a: "Dipende dall'uso. Per test software, studio, dimostrazioni e sviluppo, non c'è alcun problema, poiché è esattamente per questo che esiste lo strumento. Ciò che costituisce un reato è usare un CPF generato in registri ufficiali, contratti, dichiarazioni o qualsiasi situazione che richieda un'identificazione reale. In tal caso, il comportamento può configurarsi come falsità ideologica (Art. 299 del Codice Penale brasiliano) e, a seconda del contesto, truffa.",
    faq_2_q: "Il CPF generato qui è valido e registrato presso la Receita Federal?",
    faq_2_a: "Il numero è matematicamente valido, cioè supera la verifica delle cifre perché il calcolo del modulo 11 è corretto. Ma è fittizio e non ha alcun legame con persone reali né registrazione presso la Receita Federal. Serve a validare moduli e regole aziendali durante lo sviluppo, e nient'altro. Tentare di usarlo in registri ufficiali non funziona e può configurarsi come reato.",
    faq_3_q: "Come il generatore determina lo stato e cosa significa la nona cifra del CPF?",
    faq_3_a: "La nona cifra del CPF, appena prima delle due cifre di controllo, corrisponde alla regione fiscale in cui il documento è stato emesso. São Paulo è 8, Rio Grande do Sul è 0, Paraná e Santa Catarina sono 9, e così via. Il selettore di stato fissa quella cifra per generare numeri coerenti con una regione specifica. Lasciando su \"Tutti gli Stati\", la cifra viene sorteggiata in modo casuale.",
    faq_4_q: "Quando usare il CPF con punteggiatura e quando usare solo numeri?",
    faq_4_a: "Dipende da dove verrà usato il numero. I moduli e le schermate che mostrano il CPF all'utente di solito usano il formato con punteggiatura (999.999.999-99). I database, le API e le validazioni backend tendono a memorizzare il numero pulito, senza caratteri speciali. L'opzione \"Solo Numeri\" risolve questo al momento della generazione, senza dover elaborare la stringa in seguito.",
    faq_5_q: "Qual è la differenza tra un CPF fake, falso e casuale?",
    faq_5_a: "In pratica, tutti questi termini descrivono lo stesso strumento: un'utilità che genera numeri seguendo la regola matematica del CPF, ma senza appartenere a nessuno. \"Fake\" e \"falso\" sono le ricerche più comuni, mentre alcuni sviluppatori preferiscono \"fittizio\", \"casuale\" o \"di test\" perché sembrano meno suggestivi. Il risultato e la finalità sono gli stessi in tutti i casi.",

    table_title: "9ª Cifra del CPF per Regione Fiscale",
    table_digit: "Cifra",
    table_states: "Stati",
    see1: "Generatore di CNPJ",
    see2: "Lettere Diverse",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita"
},
  id: {
    pageTitle: "Generator CPF Valid Online untuk Pengujian — Gratis",
    title: "Generator CPF Brasil",
    meta: "Generator CPF valid untuk pengujian dan pengembangan perangkat lunak. Buat CPF acak atau beberapa sekaligus, per negara bagian, dengan atau tanpa tanda baca. Gratis, tanpa pendaftaran.",

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

    d1: "Generator CPF online dan gratis yang ditujukan untuk pengembang dan pengujian perangkat lunak. Alat ini menghasilkan nomor CPF yang valid secara matematis, dengan digit verifikasi dihitung menggunakan algoritma resmi modulo 11, sehingga lolos dari validasi formulir atau aturan bisnis apa pun. Seluruh proses berjalan di browser, tanpa pendaftaran dan tanpa kaitan dengan orang nyata. Anda dapat membuat CPF acak, membatasi hasil ke negara bagian tertentu, atau membuat batch hingga 100 nomor sekaligus.",

    features_title: "Fitur",
    f_1: "Buat CPF valid per negara bagian",
    f_2: "Batch hingga 100 CPF unik",
    f_3: "Format dengan tanda baca atau angka saja",
    f_4: "Digit verifikasi dihitung dengan modulo 11",
    f_5: "Tabel wilayah fiskal berdasarkan digit",

    how_title: "Cara kerja algoritma CPF",
    how_desc: "Algoritma CPF terdiri dari 11 digit: 9 identifikasi dan 2 verifikasi di akhir. 9 digit pertama bersifat sekuensial berdasarkan wilayah fiskal, dan digit ke-9 menunjukkan negara bagian tempat dokumen diterbitkan. Dua digit terakhir berasal dari perhitungan modulo 11 atas digit sebelumnya: setiap digit dikalikan dengan bobot, semuanya dijumlahkan, dibagi 11, dan sisanya menentukan digit verifikasi. Metode ini dirancang untuk mendeteksi kesalahan ketik. Mengubah satu digit atau membalik dua digit hampir selalu merusak validasi, sehingga sistem apa pun dapat menolak nomor yang tidak valid tanpa perlu menghubungi otoritas pajak.",

    use_cases_title: "Kasus Penggunaan",
    use_cases_intro: "Aplikasi praktis paling umum dari generator CPF dalam alur kerja pengembangan dan QA adalah:",
    use_1_t: "Validasi formulir dan UI",
    use_1_d: "Menguji mask input, validasi real-time (JavaScript, React, Angular, dll.), pesan kesalahan, dan perilaku frontend dengan data yang lolos semua aturan.",
    use_2_t: "Pengujian otomatis (Unit, Integration & E2E)",
    use_2_d: "Mengisi fixture, database pengujian, dan skenario dengan CPF valid, menghilangkan data nyata dan mengurangi risiko kebocoran.",
    use_3_t: "Lingkungan pengembangan dan staging",
    use_3_d: "Membuat pengguna uji di staging, database lokal, atau lingkungan demo tanpa melanggar undang-undang perlindungan data atau menggunakan data produksi.",
    use_4_t: "Pengujian API dan integrasi",
    use_4_d: "Mengirim payload realistis ke endpoint yang memerlukan CPF: pendaftaran, pemeriksaan kredit, penerbitan faktur, dan layanan pihak ketiga.",
    use_5_t: "Mockup, prototipe, dan presentasi",
    use_5_d: "Mengisi layar Figma, Adobe XD, atau slide klien dengan data yang meyakinkan secara visual, tanpa mengekspos informasi nyata.",
    use_6_t: "Pengujian performa dan beban",
    use_6_d: "Menghasilkan ratusan CPF dengan cepat untuk mensimulasikan volume pendaftaran atau kueri besar dalam lingkungan terkendali.",
    use_7_t: "Studi, pelatihan, dan kursus",
    use_7_d: "Guru dan siswa menggunakannya untuk contoh praktis di kelas pemrograman, database, dan validasi formulir.",

    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Buat CPF dengan cepat",
    step_1_desc: "Saat membuka halaman, CPF pertama sudah siap. Untuk membuat yang baru, klik \"Buat CPF\" — nomor tersedia untuk disalin dengan satu klik.",
    step_2_title: "Buat beberapa sekaligus",
    step_2_desc: "Centang \"Buat Beberapa CPF\", pilih jumlahnya (antara 2 dan 100), lalu klik \"Buat CPF\". Tombol \"Salin Semua\" mengirim seluruh daftar ke clipboard.",
    step_3_title: "Pilih format",
    step_3_desc: "Secara default, CPF diformat dengan titik dan tanda hubung. Jika Anda membutuhkan nomor mentah (database, JSON, dll.), aktifkan \"Angka Saja\" sebelum membuat.",

    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah menggunakan CPF yang dihasilkan adalah tindak pidana?",
    faq_1_a: "Tergantung penggunaannya. Untuk pengujian perangkat lunak, studi, demonstrasi, dan pengembangan, tidak ada masalah, karena memang itulah tujuan alat ini. Yang menjadi tindak pidana adalah menggunakan CPF yang dihasilkan dalam daftar resmi, kontrak, deklarasi, atau situasi apa pun yang memerlukan identifikasi nyata. Dalam hal itu, perilaku tersebut dapat dikategorikan sebagai pemalsuan ideologis (Pasal 299 KUHP Brasil) dan, tergantung konteksnya, penipuan.",
    faq_2_q: "Apakah CPF yang dihasilkan di sini valid dan terdaftar di Receita Federal?",
    faq_2_a: "Nomor ini valid secara matematis, artinya lolos verifikasi digit karena perhitungan modulo 11 sudah benar. Namun fiktif dan tidak memiliki kaitan dengan orang nyata maupun pendaftaran di Receita Federal. Nomor ini digunakan untuk memvalidasi formulir dan aturan bisnis selama pengembangan, dan tidak lebih dari itu. Mencoba menggunakannya dalam pendaftaran resmi tidak akan berhasil dan masih dapat dikategorikan sebagai tindak pidana.",
    faq_3_q: "Bagaimana generator menentukan negara bagian dan apa arti digit kesembilan CPF?",
    faq_3_a: "Digit kesembilan CPF, tepat sebelum dua digit verifikasi, sesuai dengan wilayah fiskal tempat dokumen diterbitkan. São Paulo adalah 8, Rio Grande do Sul adalah 0, Paraná dan Santa Catarina adalah 9, dan seterusnya. Pemilih negara bagian menetapkan digit tersebut untuk menghasilkan nomor yang konsisten dengan wilayah tertentu. Jika dibiarkan pada \"Semua Negara Bagian\", digit dipilih secara acak.",
    faq_4_q: "Kapan menggunakan CPF dengan tanda baca dan kapan menggunakan angka saja?",
    faq_4_a: "Tergantung di mana nomor tersebut akan digunakan. Formulir dan layar yang menampilkan CPF kepada pengguna biasanya menggunakan format dengan tanda baca (999.999.999-99). Database, API, dan validasi backend cenderung menyimpan nomor bersih, tanpa karakter khusus. Opsi \"Angka Saja\" menangani ini langsung saat pembuatan, tanpa perlu memproses string setelahnya.",
    faq_5_q: "Apa perbedaan antara CPF fake, palsu, dan acak?",
    faq_5_a: "Dalam praktiknya, semua istilah tersebut menggambarkan alat yang sama: sebuah utilitas yang menghasilkan nomor mengikuti aturan matematis CPF, tetapi tanpa dimiliki oleh siapa pun. \"Fake\" dan \"palsu\" adalah pencarian yang paling umum, sementara beberapa pengembang lebih suka \"fiktif\", \"acak\", atau \"uji coba\" karena terdengar kurang sugestif. Hasilnya dan tujuannya sama dalam semua kasus.",

    table_title: "Digit ke-9 CPF berdasarkan Wilayah Fiskal",
    table_digit: "Digit",
    table_states: "Negara Bagian",
    see1: "Generator CNPJ",
    see2: "Huruf Berbeda",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir"
  },
  de: {
    pageTitle: "Gültiger CPF-Generator Online für Tests — Kostenlos",
    title: "CPF-Generator",
    meta: "Gültiger CPF-Generator für Tests und Softwareentwicklung. Erstellen Sie eine zufällige CPF oder mehrere auf einmal, nach Bundesstaat, mit oder ohne Satzzeichen. Kostenlos, ohne Registrierung.",

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

    d1: "Kostenloser Online-CPF-Generator für Entwickler und Softwaretests. Das Tool erzeugt mathematisch gültige CPF-Nummern, deren Prüfziffern nach dem offiziellen Modulo-11-Algorithmus berechnet werden, sodass sie jede Formularvalidierung oder Geschäftsregel bestehen. Der gesamte Prozess läuft im Browser ab, ohne Registrierung und ohne Bezug zu echten Personen. Es ist möglich, eine zufällige CPF zu generieren, das Ergebnis auf einen bestimmten Bundesstaat einzuschränken oder Stapel mit bis zu 100 Nummern auf einmal zu erstellen.",

    features_title: "Funktionen",
    f_1: "Gültigen CPF nach Bundesstaat generieren",
    f_2: "Batches mit bis zu 100 eindeutigen CPFs",
    f_3: "Format mit Interpunktion oder nur Zahlen",
    f_4: "Prüfziffern berechnet mit Modulo 11",
    f_5: "Tabelle der Steuerregionen nach Ziffer",

    how_title: "Wie der CPF-Algorithmus funktioniert",
    how_desc: "Der CPF-Algorithmus besteht aus 11 Ziffern: 9 Identifikationsziffern und 2 Prüfziffern am Ende. Die ersten 9 sind sequenziell nach Steuerregion, und die 9. gibt den Bundesstaat an, in dem das Dokument ausgestellt wurde. Die letzten beiden ergeben sich aus einer Modulo-11-Berechnung über die vorherigen Ziffern: Jede Ziffer wird mit einem Gewicht multipliziert, alles wird addiert, durch 11 geteilt, und der Rest bestimmt die Prüfziffer. Die Methode wurde entwickelt, um Tippfehler zu erkennen. Das Ändern einer Ziffer oder das Vertauschen von zwei bricht fast immer die Validierung, sodass jedes System ungültige Nummern ablehnen kann, ohne die Steuerbehörde zu befragen.",

    use_cases_title: "Anwendungsfälle",
    use_cases_intro: "Die häufigsten praktischen Anwendungen des CPF-Generators im Entwicklungs- und QA-Workflow sind:",
    use_1_t: "Formular- und UI-Validierung",
    use_1_d: "Eingabemasken, Echtzeit-Validierungen (JavaScript, React, Angular usw.), Fehlermeldungen und Frontend-Verhalten mit Daten testen, die alle Regeln bestehen.",
    use_2_t: "Automatisierte Tests (Unit, Integration und E2E)",
    use_2_d: "Fixtures, Testdatenbanken und Szenarien mit gültigen CPFs füllen, echte Daten vermeiden und das Leckagenrisiko reduzieren.",
    use_3_t: "Entwicklungs- und Staging-Umgebungen",
    use_3_d: "Testbenutzer in Staging, lokalen Datenbanken oder Demo-Umgebungen erstellen, ohne Datenschutzgesetze zu verletzen oder Produktionsdaten zu verwenden.",
    use_4_t: "API- und Integrationstests",
    use_4_d: "Realistische Payloads an Endpoints senden, die eine CPF erfordern: Registrierungen, Kreditprüfungen, Rechnungsausstellung und Drittanbieterdienste.",
    use_5_t: "Mockups, Prototypen und Präsentationen",
    use_5_d: "Figma-, Adobe XD-Bildschirme oder Kundenfolien mit visuell überzeugenden Daten füllen, ohne echte Informationen preiszugeben.",
    use_6_t: "Performance- und Lasttests",
    use_6_d: "Hunderte von CPFs schnell generieren, um große Registrierungs- oder Abfragevolumen in einer kontrollierten Umgebung zu simulieren.",
    use_7_t: "Studium, Schulungen und Kurse",
    use_7_d: "Lehrer und Schüler nutzen sie für praktische Beispiele in Programmier-, Datenbank- und Formularvalidierungskursen.",

    how_to_use_title: "Verwendung",
    step_1_title: "Schnell einen CPF generieren",
    step_1_desc: "Beim Öffnen der Seite ist der erste CPF bereits fertig. Um einen weiteren zu generieren, klicken Sie auf \"CPF generieren\" — die Nummer steht mit einem einzigen Klick zum Kopieren bereit.",
    step_2_title: "Mehrere auf einmal generieren",
    step_2_desc: "Aktivieren Sie \"Mehrere CPFs generieren\", wählen Sie die Anzahl (zwischen 2 und 100) und klicken Sie auf \"CPFs generieren\". Die Schaltfläche \"Alle kopieren\" sendet die gesamte Liste in die Zwischenablage.",
    step_3_title: "Format wählen",
    step_3_desc: "Standardmäßig wird der CPF mit Punkten und Bindestrich formatiert. Wenn Sie die Rohdaten benötigen (Datenbank, JSON usw.), aktivieren Sie \"Nur Zahlen\" vor der Generierung.",

    faq_title: "Fragen und Antworten",
    faq_1_q: "Ist die Verwendung einer generierten CPF strafbar?",
    faq_1_a: "Es kommt auf die Verwendung an. Für Softwaretests, Studium, Demonstrationen und Entwicklung gibt es kein Problem, denn genau dafür ist das Tool gedacht. Was einen Straftatbestand darstellt, ist die Verwendung einer generierten CPF in amtlichen Registern, Verträgen, Erklärungen oder in jeder Situation, die eine echte Identifizierung erfordert. In diesem Fall kann das Verhalten als ideologische Fälschung (Art. 299 des brasilianischen Strafgesetzbuches) und je nach Kontext als Betrug eingestuft werden.",
    faq_2_q: "Ist die hier generierte CPF gültig und bei der Receita Federal registriert?",
    faq_2_a: "Die Nummer ist mathematisch gültig, d. h. sie besteht die Ziffernprüfung, weil die Modulo-11-Berechnung korrekt ist. Sie ist jedoch fiktiv und hat weder eine Verbindung zu echten Personen noch eine Registrierung bei der Receita Federal. Sie dient dazu, Formulare und Geschäftsregeln während der Entwicklung zu validieren, und mehr nicht. Der Versuch, sie in offiziellen Registern zu verwenden, funktioniert nicht und kann einen Straftatbestand darstellen.",
    faq_3_q: "Wie bestimmt der Generator den Bundesstaat und was bedeutet die neunte Ziffer der CPF?",
    faq_3_a: "Die neunte Ziffer der CPF, direkt vor den zwei Prüfziffern, entspricht der Steuerregion, in der das Dokument ausgestellt wurde. São Paulo ist 8, Rio Grande do Sul ist 0, Paraná und Santa Catarina sind 9, und so weiter. Der Bundesstaatsauswähler fixiert diese Ziffer, um Nummern zu erzeugen, die mit einer bestimmten Region übereinstimmen. Wenn \"Alle Bundesstaaten\" ausgewählt ist, wird die Ziffer zufällig gewählt.",
    faq_4_q: "Wann sollte die CPF mit Satzzeichen und wann nur als Zahlen verwendet werden?",
    faq_4_a: "Es kommt darauf an, wo die Nummer verwendet wird. Formulare und Bildschirme, die die CPF dem Benutzer anzeigen, verwenden in der Regel das Format mit Satzzeichen (999.999.999-99). Datenbanken, APIs und Backend-Validierungen neigen dazu, die saubere Nummer ohne Sonderzeichen zu speichern. Die Option \"Nur Zahlen\" löst dies direkt bei der Generierung, ohne die Zeichenkette nachträglich bearbeiten zu müssen.",
    faq_5_q: "Was ist der Unterschied zwischen einer gefälschten, falschen und zufälligen CPF?",
    faq_5_a: "In der Praxis beschreiben alle diese Begriffe dasselbe Tool: ein Dienstprogramm, das Nummern nach der mathematischen Regel der CPF generiert, aber niemandem gehört. \"Fake\" und \"falsch\" sind die häufigsten Suchanfragen, während einige Entwickler \"fiktiv\", \"zufällig\" oder \"Test-CPF\" bevorzugen, da diese weniger suggestiv klingen. Das Ergebnis und der Zweck sind in allen Fällen gleich.",

    table_title: "9. Ziffer der CPF nach Steuerregion",
    table_digit: "Ziffer",
    table_states: "Bundesstaaten",
    see1: "CNPJ-Generator",
    see2: "Andere Buchstaben",
    see3: "Kreditkartengenerator",
    see4: "Geburtsdatum-Generator"
  },
  nl: {
    pageTitle: "Geldige CPF-generator Online voor Tests — Gratis",
    title: "CPF-generator",
    meta: "Geldige CPF-generator voor tests en softwareontwikkeling. Maak een willekeurige CPF of meerdere tegelijk, per staat, met of zonder leestekens. Gratis, zonder registratie.",

    num: "Alleen cijfers",
    multiple_label: "Genereer meerdere CPF's",
    select_state: "Selecteer staat",
    all_states: "Alle staten",
    region_from: "Fiscale regio",
    bt: "Genereer CPF",
    bt_multiple: "Genereer CPF's",
    cpf_label: "Gegenereerde CPF",
    quantity: "Aantal",
    generated_cpfs: "Gegenereerde CPF's ({count})",
    copy_all: "Alles kopiëren",
    placeholder: "Klik op Genereer CPF om een nummer aan te maken",
    warning: "De gegenereerde nummers zijn fictief en dienen uitsluitend voor testdoeleinden.",

    d1: "Gratis online CPF-generator voor ontwikkelaars en softwaretests. Het hulpmiddel genereert wiskundig geldige CPF-nummers, waarvan de controlecijfers berekend worden via het officiële modulo 11-algoritme, zodat ze elke formuliervalidatie of bedrijfsregel doorstaan. Het hele proces verloopt in de browser, zonder registratie en zonder koppeling met echte personen. Het is mogelijk een willekeurige CPF te genereren, het resultaat te beperken tot een specifieke staat of batches van maximaal 100 nummers tegelijk aan te maken.",

    features_title: "Functionaliteiten",
    f_1: "Genereer geldige CPF per staat",
    f_2: "Batches tot 100 unieke CPF's",
    f_3: "Formaat met interpunctie of alleen cijfers",
    f_4: "Controlecijfers berekend met modulo 11",
    f_5: "Tabel van fiscale regio's per cijfer",

    how_title: "Hoe het CPF-algoritme werkt",
    how_desc: "Het CPF-algoritme bestaat uit 11 cijfers: 9 identificatiecijfers en 2 controlecijfers aan het einde. De eerste 9 zijn opeenvolgend per fiscale regio, en het 9e cijfer geeft de staat aan waar het document is uitgegeven. De laatste twee zijn het resultaat van een modulo 11-berekening over de voorgaande cijfers: elk cijfer wordt vermenigvuldigd met een gewicht, alles wordt opgeteld, gedeeld door 11, en de rest bepaalt het controlecijfer. De methode is ontworpen om typefouten te detecteren. Het wijzigen van een cijfer of het omdraaien van twee cijfers verbreekt bijna altijd de validatie, waardoor elk systeem ongeldige nummers kan weigeren zonder de belastingdienst te raadplegen.",

    use_cases_title: "Gebruiksscenario's",
    use_cases_intro: "De meest voorkomende praktische toepassingen van de CPF-generator in de ontwikkelings- en QA-workflow zijn:",
    use_1_t: "Formulier- en UI-validatie",
    use_1_d: "Inputmaskers, realtime validaties (JavaScript, React, Angular, etc.), foutmeldingen en frontendgedrag testen met gegevens die alle regels doorstaan.",
    use_2_t: "Geautomatiseerde tests (Unit, Integration & E2E)",
    use_2_d: "Fixtures, testdatabases en scenario's vullen met geldige CPF's, zonder echte gegevens en met minder lekrisico.",
    use_3_t: "Ontwikkelings- en stagingomgevingen",
    use_3_d: "Testgebruikers aanmaken in staging, lokale databases of demo-omgevingen zonder privacywetten te overtreden of productiegegevens te gebruiken.",
    use_4_t: "API- en integratietests",
    use_4_d: "Realistische payloads sturen naar endpoints die een CPF vereisen: registraties, kredietcontroles, factuuruitgifte en diensten van derden.",
    use_5_t: "Mockups, prototypes en presentaties",
    use_5_d: "Figma-, Adobe XD-schermen of klantpresentaties vullen met visueel overtuigende gegevens, zonder echte informatie bloot te stellen.",
    use_6_t: "Performance- en loadtests",
    use_6_d: "Honderden CPF's snel genereren om grote volumes aan registraties of zoekopdrachten te simuleren in een gecontroleerde omgeving.",
    use_7_t: "Studies, trainingen en cursussen",
    use_7_d: "Docenten en studenten gebruiken ze voor praktische voorbeelden in lessen programmeren, databases en formuliervalidatie.",

    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Snel een CPF genereren",
    step_1_desc: "Bij het openen van de pagina is de eerste CPF al klaar. Om een nieuwe te genereren, klik op \"Genereer CPF\" — het nummer is met één klik beschikbaar om te kopiëren.",
    step_2_title: "Meerdere tegelijk genereren",
    step_2_desc: "Vink \"Genereer meerdere CPF's\" aan, kies het aantal (tussen 2 en 100) en klik op \"Genereer CPF's\". De knop \"Alles kopiëren\" stuurt de hele lijst naar het klembord.",
    step_3_title: "Formaat kiezen",
    step_3_desc: "Standaard wordt de CPF geformatteerd met punten en een streepje. Als je het ruwe nummer nodig hebt (database, JSON, etc.), schakel dan \"Alleen cijfers\" in voor het genereren.",

    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Is het gebruik van een gegenereerde CPF strafbaar?",
    faq_1_a: "Het hangt af van het gebruik. Voor softwaretests, studie, demonstraties en ontwikkeling is er geen probleem, want dat is precies waarvoor het hulpmiddel bedoeld is. Wat een strafbaar feit vormt, is het gebruik van een gegenereerde CPF in officiële registers, contracten, verklaringen of elke situatie die echte identificatie vereist. In dat geval kan het gedrag worden gekwalificeerd als ideologische valsheid (Art. 299 van het Braziliaanse Wetboek van Strafrecht) en, afhankelijk van de context, als oplichting.",
    faq_2_q: "Is de hier gegenereerde CPF geldig en geregistreerd bij de Receita Federal?",
    faq_2_a: "Het nummer is wiskundig geldig, dat wil zeggen dat het de cijfercontrole doorstaat omdat de modulo 11-berekening correct is. Maar het is fictief en heeft geen enkele koppeling met echte personen noch een registratie bij de Receita Federal. Het dient om formulieren en bedrijfsregels te valideren tijdens de ontwikkeling, en niets meer. Proberen het te gebruiken in officiële registers werkt niet en kan nog steeds een strafbaar feit vormen.",
    faq_3_q: "Hoe bepaalt de generator de staat en wat betekent het negende cijfer van de CPF?",
    faq_3_a: "Het negende cijfer van de CPF, vlak voor de twee controlecijfers, komt overeen met de fiscale regio waar het document is uitgegeven. São Paulo is 8, Rio Grande do Sul is 0, Paraná en Santa Catarina zijn 9, enzovoort. De staatskiezer fixeert dat cijfer om nummers te genereren die consistent zijn met een specifieke regio. Als \"Alle Staten\" geselecteerd is, wordt het cijfer willekeurig gekozen.",
    faq_4_q: "Wanneer de CPF met leestekens gebruiken en wanneer alleen cijfers?",
    faq_4_a: "Het hangt af van waar het nummer zal worden gebruikt. Formulieren en schermen die de CPF aan de gebruiker tonen, gebruiken doorgaans het geformatteerde formaat (999.999.999-99). Databases, API's en backend-validaties slaan de nummers doorgaans op zonder speciale tekens. De optie \"Alleen cijfers\" regelt dit direct bij het genereren, zonder de tekenreeks achteraf te hoeven verwerken.",
    faq_5_q: "Wat is het verschil tussen een nep-, valse en willekeurige CPF?",
    faq_5_a: "In de praktijk beschrijven al deze termen hetzelfde hulpmiddel: een hulpprogramma dat nummers genereert volgens de wiskundige regel van de CPF, maar zonder aan iemand toe te behoren. \"Nep\" en \"vals\" zijn de meest voorkomende zoekopdrachten, terwijl sommige ontwikkelaars de voorkeur geven aan \"fictief\", \"willekeurig\" of \"test-CPF\" omdat die minder suggestief klinken. Het resultaat en het doel zijn in alle gevallen hetzelfde.",

    table_title: "9e Cijfer van de CPF per Fiscale Regio",
    table_digit: "Cijfer",
    table_states: "Staten",
    see1: "CNPJ-generator",
    see2: "Mooie letters",
    see3: "Creditcard-generator",
    see4: "Geboortedatum-generator"
  },
  ru: {
    pageTitle: "Генератор CPF — создать валидный CPF для тестов онлайн | Бесплатно",
    title: "Генератор CPF",
    meta: "Бесплатный генератор валидных номеров CPF для тестирования и разработки программного обеспечения. Генерируйте один случайный CPF или несколько сразу по штатам, с форматированием или без. Без регистрации.",
    num: "Только цифры",
    multiple_label: "Генерировать несколько CPF",
    select_state: "Выберите штат",
    all_states: "Все штаты",
    region_from: "Фискальный регион",
    bt: "Сгенерировать CPF",
    bt_multiple: "Сгенерировать CPF",
    cpf_label: "Сгенерированный CPF",
    quantity: "Количество",
    generated_cpfs: "Сгенерированные CPF ({count})",
    copy_all: "Копировать все",
    placeholder: "Нажмите «Сгенерировать CPF», чтобы создать номер",
    warning: "Сгенерированные номера являются вымышленными и предназначены исключительно для тестирования.",
    d1: "Бесплатный онлайн-генератор CPF, предназначенный для разработчиков и тестировщиков программного обеспечения. Инструмент генерирует математически верные номера CPF с контрольными цифрами, вычисленными по официальному алгоритму модуля 11, благодаря чему они проходят любую валидацию форм или бизнес-логики. Весь процесс происходит непосредственно в вашем браузере, без регистрации и без привязки к реальным людям. Вы можете сгенерировать один случайный CPF, ограничить результат определенным штатом или создавать списки до 100 номеров за один раз.",
    features_title: "Возможности",
    f_1: "Генерация валидных CPF по штатам",
    f_2: "Списки до 100 уникальных CPF",
    f_3: "Формат с пунктуацией или только цифры",
    f_4: "Контрольные цифры рассчитываются по модулю 11",
    f_5: "Таблица фискальных регионов по цифрам",
    how_title: "Как работает алгоритм CPF",
    how_desc: "Алгоритм CPF состоит из 11 цифр: 9 идентификационных и 2 контрольных в конце. Первые 9 цифр последовательно соответствуют фискальным регионам, а 9-я цифра указывает на штат, где документ был выдан. Последние две цифры получаются в результате расчета модуля 11 по предыдущим цифрам: каждая цифра умножается на определенный вес, все складывается, делится на 11, и остаток определяет контрольную цифру. Этот метод был разработан для обнаружения опечаток. Изменение даже одной цифры или перестановка двух почти всегда нарушают валидацию, что позволяет любой системе отклонять недействительные номера без обращения в налоговые органы.",
    use_cases_title: "Варианты использования",
    use_cases_intro: "Наиболее распространенные практические сценарии применения генератора CPF в разработке и тестировании (QA):",
    use_1_t: "Валидация форм и интерфейсов",
    use_1_d: "Тестирование масок ввода, валидации в реальном времени (JavaScript, React, Angular и др.), сообщений об ошибках и поведения интерфейса с данными, которые соответствуют всем правилам.",
    use_2_t: "Автоматизированное тестирование (Unit, Integration и E2E)",
    use_2_d: "Заполнение фикстур, тестовых баз данных и сценариев валидными CPF, что исключает использование личных данных реальных людей и снижает риск их утечки.",
    use_3_t: "Среды разработки и демо-стенды",
    use_3_d: "Создание тестовых пользователей на стейджинге, в локальных базах данных или демонстрационных окружениях без нарушения законов о защите персональных данных и без использования реальной информации.",
    use_4_t: "Тестирование API и интеграций",
    use_4_d: "Отправка реалистичных данных на эндпоинты, требующие CPF: формы регистрации, кредитные проверки, выставление счетов и сторонние сервисы.",
    use_5_t: "Макеты, прототипы и презентации",
    use_5_d: "Наполнение экранов в Figma, Adobe XD или слайдов для клиентов визуально убедительными данными без раскрытия реальной конфиденциальной информации.",
    use_6_t: "Тестирование производительности и нагрузки",
    use_6_d: "Быстрая генерация сотен CPF для имитации большого потока регистраций или запросов в контролируемой среде.",
    use_7_t: "Обучение, курсы и семинары",
    use_7_d: "Преподаватели и студенты используют генератор для практических примеров на занятиях по программированию, базам данных и валидации форм.",
    how_to_use_title: "Как использовать",
    step_1_title: "Быстрая генерация одного CPF",
    step_1_desc: "При открытии страницы первый CPF уже готов. Чтобы сгенерировать другой, нажмите «Сгенерировать CPF» — номер мгновенно появится на экране и будет готов к копированию.",
    step_2_title: "Генерация нескольких номеров за раз",
    step_2_desc: "Отметьте пункт «Генерировать несколько CPF», выберите количество (от 2 до 100) и нажмите «Сгенерировать CPF». Кнопка «Копировать все» скопирует весь список в буфер обмена.",
    step_3_title: "Выбор формата вывода",
    step_3_desc: "По умолчанию CPF генерируется в отформатированном виде (с точками и дефисом). Если вам нужен чистый номер (для баз данных, JSON и т. д.), активируйте «Только цифры» перед началом генерации.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Является ли использование сгенерированного CPF преступлением?",
    faq_1_a: "Все зависит от целей использования. Для тестирования программного обеспечения, обучения, демонстраций и разработки никаких проблем нет — именно для этого инструмент и создан. Преступлением является использование сгенерированного CPF при официальной регистрации, заключении договоров, подаче деклараций или в любых ситуациях, требующих реальной идентификации личности. В таких случаях это может быть квалифицировано как предоставление заведомо ложных сведений или мошенничество.",
    faq_2_q: "Действителен ли сгенерированный здесь CPF и зарегистрирован ли он в Федеральной налоговой службе Бразилии?",
    faq_2_a: "Номер является математически валидным, то есть он успешно проходит валидацию контрольных цифр по алгоритму модуля 11. Однако он полностью вымышленный, не связан с реальными людьми и не зарегистрирован в налоговой службе (Receita Federal). Он предназначен исключительно для тестирования форм и бизнес-правил при разработке программного обеспечения.",
    faq_3_q: "Как генератор определяет штат и что означает девятая цифра CPF?",
    faq_3_a: "Девятая цифра CPF (последняя перед двумя контрольными цифрами) указывает на фискальный регион, в котором документ был выдан. Например, Сан-Паулу соответствует цифра 8, Риу-Гранди-ду-Сул — 0, Парана и Сан-Катарина — 9 и так далее. Селектор штата фиксирует эту цифру для генерации номеров, привязанных к конкретной территории. Если выбрано «Все штаты», эта цифра определяется случайно.",
    faq_4_q: "Когда использовать CPF с форматированием, а когда — только цифры?",
    faq_4_a: "Это зависит от ваших требований. Формы и интерфейсы, отображаемые пользователям, обычно используют отформатированный вид (999.999.999-99). В то же время базы данных, API и серверные валидаторы чаще всего хранят чистую строку без специальных символов. Опция «Только цифры» позволяет получить нужный формат сразу при генерации, исключая необходимость дополнительной очистки строки.",
    faq_5_q: "В чем разница между терминами fake, ложный, случайный или тестовый CPF?",
    faq_5_a: "На практике все эти понятия описывают один и тот же инструмент — утилиту для создания номеров по математическим правилам CPF, которые никому реально не принадлежат. Разработчики часто называют его «тестовым», «фиктивным» или «случайным» CPF, чтобы подчеркнуть исключительно профессиональную сферу применения.",
    table_title: "9-я цифра CPF по фискальным регионам",
    table_digit: "Цифра",
    table_states: "Штаты",
    see1: "Генератор CNPJ",
    see2: "Красивые шрифты",
    see3: "Генератор кредитных карт",
    see4: "Генератор даты рождения"
  }
}
</i18n>