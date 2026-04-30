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
            <option v-for="r in regions" :key="r" :value="r">{{ t(`region${r}`) }}</option>
          </select>
        </div>

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

      <!-- Resultado -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[16rem] flex flex-col justify-center">
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

    d1: "Esta ferramenta gera números de CPF aleatórios e matematicamente válidos, com os dígitos verificadores calculados corretamente. Os números servem para testar formulários, popular bases de homologação e validar regras de negócio em sistemas — qualquer cenário onde você precisa de um CPF que passe na validação do algoritmo, mas não está vinculado a uma pessoa real. Funciona direto no navegador, sem cadastro, e dá pra filtrar por estado de origem ou gerar lotes de até 100 de uma vez.",

    features_title: "Funcionalidades",
    f_1: "Gera CPF válido por estado",
    f_2: "Lotes de até 100 CPFs únicos",
    f_3: "Formato com pontuação ou só números",
    f_4: "Dígitos verificadores calculados pelo módulo 11",

    how_title: "Como o algoritmo do CPF funciona",
    how_desc: "O CPF tem 11 dígitos: 9 de identificação e 2 verificadores no final. Os 9 primeiros são sequenciais por região fiscal, e o 9º indica o estado onde o documento foi emitido. Os dois últimos saem de um cálculo de módulo 11 sobre os anteriores: cada dígito é multiplicado por um peso, soma-se tudo, divide por 11, e o resto define o verificador. O método foi pensado para detectar erros de digitação. Trocar um dígito ou inverter dois quase sempre quebra a validação, o que permite a qualquer sistema rejeitar números inválidos sem precisar consultar a Receita.",

    use_cases_title: "Casos de Uso",
    use_cases_intro: "Onde um CPF gerado faz sentido no dia a dia de quem desenvolve:",
    use_1_t: "Validação de formulários",
    use_1_d: "Testar máscaras, validadores e mensagens de erro em campos de cadastro.",
    use_2_t: "Testes automatizados",
    use_2_d: "Popular cenários de teste com dados que passam na validação sem expor CPFs reais.",
    use_3_t: "Ambientes de desenvolvimento",
    use_3_d: "Criar registros em homologação e staging sem violar a LGPD nem usar dados de produção.",
    use_4_t: "Integrações e APIs",
    use_4_d: "Testar endpoints e serviços de terceiros que exigem CPF como parâmetro.",
    use_5_t: "Mockups e demonstrações",
    use_5_d: "Preencher protótipos, telas de demo e materiais de apresentação sem dados reais.",

    how_to_use_title: "Como Usar",
    step_1_title: "Gerar um CPF rápido",
    step_1_desc: "Ao abrir a página, o primeiro CPF já aparece pronto. Para gerar outro, clique em \"Gerar CPF\" — o número fica disponível para copiar com um clique.",
    step_2_title: "Gerar vários de uma vez",
    step_2_desc: "Marque \"Gerar Múltiplos CPFs\", escolha quantos (entre 2 e 100) e clique em \"Gerar CPFs\". O botão \"Copiar Todos\" passa a lista inteira para a área de transferência.",
    step_3_title: "Escolher o formato",
    step_3_desc: "Por padrão, o CPF vem com pontos e traço. Se você precisa do número limpo (banco de dados, JSON, etc.), ative \"Somente Números\" antes de gerar.",

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

    faq_title: "Perguntas Frequentes",
    faq_1_q: "Os CPFs gerados aqui são reais ou estão registrados na Receita Federal?",
    faq_1_a: "Não. São números fictícios construídos com o mesmo algoritmo de validação que a Receita usa, mas sem vínculo nenhum com pessoas reais. Eles passam na verificação dos dígitos porque o cálculo está correto, e nada além disso. Não tente usar para cadastros oficiais — não vão ser aceitos, e a tentativa pode configurar crime.",
    faq_2_q: "Por que existe um campo de estado no gerador?",
    faq_2_a: "O 9º dígito do CPF (logo antes dos verificadores) corresponde à região fiscal onde o documento foi emitido. São Paulo é 8, Rio Grande do Sul é 0, e por aí vai. Para alguns testes, faz diferença gerar números coerentes com uma região específica, e o filtro existe para isso. Se não importa, deixe em \"Todos os Estados\" que o sorteio é aleatório.",
    faq_3_q: "Quando usar o formato com pontos e quando usar só números?",
    faq_3_a: "Depende de onde o número vai entrar. Formulários e telas que mostram o CPF para o usuário normalmente usam o formato pontuado (999.999.999-99). Já bancos de dados, APIs e validações de backend tendem a armazenar o número limpo, sem caracteres especiais. O toggle \"Somente Números\" resolve sem precisar tratar a string depois.",
    faq_4_q: "Posso usar o gerador para qualquer finalidade?",
    faq_4_a: "Para testes de software, estudo, demonstrações e desenvolvimento, sim — é exatamente para isso que ele existe. O que você não pode fazer é usar um CPF gerado em cadastros oficiais, contratos, declarações ou qualquer situação que exija identificação real. Isso configura falsidade ideológica (Art. 299 do Código Penal) e, dependendo do caso, estelionato.",
    faq_5_q: "Qual a diferença entre \"CPF fake\" e \"CPF aleatório\"?",
    faq_5_a: "Na prática, é a mesma coisa: um número que segue a regra matemática do CPF mas não pertence a ninguém. Os termos \"fake\" e \"falso\" são populares na busca, embora alguns desenvolvedores prefiram \"fictício\" ou \"de teste\" por soarem menos sugestivos. O resultado e o uso são idênticos.",

    see1: "Gerador de CNPJ",
    see2: "Letras Diferentes",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  }
}
</i18n>