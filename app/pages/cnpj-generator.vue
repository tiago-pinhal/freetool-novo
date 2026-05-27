<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

// Charset used to draw random characters for the alphanumeric root.
// The RFB recommends excluding I, O, Q and F (visual ambiguity with digits
// and check-digit collisions), so these letters are never generated.
const ALPHA_ROOT_CHARSET = '0123456789ABCDEGHJKLMNPRSTUVWXYZ'

const state = reactive({
  cnpj: '',
  justNum: false,
  cnpjList: [] as string[],
  multipleCount: 5,
  showMultiple: false,
  cnpjType: 'legacy' as 'legacy' | 'alphanumeric',
  ads: false
})

const random = (): number => Math.floor(Math.random() * 10)

// Official CNPJ alphanumeric rule (IN RFB nº 2.229/2024, Serpro / Nota
// Técnica Conjunta CNPJ Alfanumérico 2025.001): the value used in the
// modulo-11 check-digit calculation is the character's ASCII code minus 48.
// Digits 0–9 keep their value; letters map A=17, B=18, ... Z=42.
function charValue(c: string): number {
  return c.charCodeAt(0) - 48
}

function formatCNPJ(raw: string, justNum: boolean): string {
  if (justNum) return raw
  return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8, 12)}-${raw.slice(12, 14)}`
}

function generateLegacyCNPJ(): string {
  const n1 = random(), n2 = random(), n3 = random(), n4 = random()
  const n5 = random(), n6 = random(), n7 = random(), n8 = random()
  const n9 = 0, n10 = 0, n11 = 0, n12 = 1

  let d1 = n12*2 + n11*3 + n10*4 + n9*5 + n8*6 + n7*7 + n6*8 + n5*9 + n4*2 + n3*3 + n2*4 + n1*5
  d1 = 11 - (d1 % 11)
  if (d1 >= 10) d1 = 0

  let d2 = d1*2 + n12*3 + n11*4 + n10*5 + n9*6 + n8*7 + n7*8 + n6*9 + n5*2 + n4*3 + n3*4 + n2*5 + n1*6
  d2 = 11 - (d2 % 11)
  if (d2 >= 10) d2 = 0

  return formatCNPJ('' + n1+n2+n3+n4+n5+n6+n7+n8+n9+n10+n11+n12+d1+d2, state.justNum)
}

function generateAlphanumericCNPJ(): string {
  const raiz = Array.from(
    { length: 8 },
    () => ALPHA_ROOT_CHARSET.charAt(Math.floor(Math.random() * ALPHA_ROOT_CHARSET.length))
  )
  const filial = ['0', '0', '0', '1']
  const all12 = [...raiz, ...filial]

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const sum1 = all12.reduce((acc, c, i) => acc + charValue(c) * w1[i]!, 0)
  const r1 = sum1 % 11
  const d1 = r1 < 2 ? 0 : 11 - r1

  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const sum2 = all12.reduce((acc, c, i) => acc + charValue(c) * w2[i]!, 0) + d1 * 2
  const r2 = sum2 % 11
  const d2 = r2 < 2 ? 0 : 11 - r2

  return formatCNPJ(all12.join('') + d1.toString() + d2.toString(), state.justNum)
}

function generateCNPJ(): string {
  return state.cnpjType === 'alphanumeric' ? generateAlphanumericCNPJ() : generateLegacyCNPJ()
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
    const raw = state.cnpj.replace(/[.\-/]/g, '')
    if (raw.length === 14) state.cnpj = formatCNPJ(raw, state.justNum)
  }
  if (state.cnpjList.length > 0) {
    state.cnpjList = state.cnpjList.map(cnpj => {
      const raw = cnpj.replace(/[.\-/]/g, '')
      return formatCNPJ(raw, state.justNum)
    })
  }
})

watch(() => state.showMultiple, () => {
  if (state.showMultiple) state.cnpj = ''
  else state.cnpjList = []
})

watch(() => state.cnpjType, () => {
  state.cnpj = ''
  state.cnpjList = []
  state.justNum = false
})

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
    { question: t('faq_5_q'), answer: t('faq_5_a') },
    { question: t('faq_6_q'), answer: t('faq_6_a') }
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
    nl: '/cnpj-generator',
    ru: '/generator-cnpj',
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

        <!-- Type selector -->
        <div class="form-control">
          <label class="label pb-1">
            <span class="label-text font-bold text-base-content/80">{{ t('type_label') }}</span>
          </label>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" v-model="state.cnpjType" value="legacy" class="radio radio-primary" />
              <span class="font-medium">{{ t('type_legacy') }}</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" v-model="state.cnpjType" value="alphanumeric" class="radio radio-secondary" />
              <span class="font-medium">{{ t('type_alpha') }}</span>
            </label>
          </div>
        </div>

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
            <div class="mb-2">
              <span :class="['badge badge-sm', state.cnpjType === 'alphanumeric' ? 'badge-secondary' : 'badge-primary badge-outline']">
                {{ state.cnpjType === 'alphanumeric' ? t('type_alpha_short') : t('type_legacy_short') }}
              </span>
            </div>
            <LineCopy
              :content="state.cnpj"
              :label="t('cnpj_label')"
              class="!my-0 [&>div:last-child]:!w-full"
            />
            <p class="text-xs text-base-content/70 italic px-1 text-center mt-3">{{ t('warning') }}</p>
          </div>
        </Transition>

        <!-- Multiple CNPJs -->
        <div v-if="state.cnpjList.length > 0" class="w-full space-y-1">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold">{{ t('generated_cnpjs', { count: state.cnpjList.length }) }}</span>
              <span :class="['badge badge-xs', state.cnpjType === 'alphanumeric' ? 'badge-secondary' : 'badge-primary badge-outline']">
                {{ state.cnpjType === 'alphanumeric' ? t('type_alpha_short') : t('type_legacy_short') }}
              </span>
            </div>
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
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5')]"
          icon="heroicons:check-badge-20-solid"
        />

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:book-open-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:arrows-right-left-20-solid" class="w-6 h-6 text-primary" />
            {{ t('diff_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed">{{ t('diff_desc') }}</p>
        </section>

        <UseCaseSection
          :title="t('use_cases_title')"
          :description="t('use_cases_intro')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
            { title: t('use_4_t'), description: t('use_4_d') },
            { title: t('use_5_t'), description: t('use_5_d') },
            { title: t('use_6_t'), description: t('use_6_d') },
            { title: t('use_7_t'), description: t('use_7_d') }
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
            { question: t('faq_5_q'), answer: t('faq_5_a') },
            { question: t('faq_6_q'), answer: t('faq_6_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    pageTitle: "Gerador de CNPJ Fake — Legado e Alfanumérico | Grátis",
    title: "Gerador de CNPJ",
    meta: "Gere CNPJ fake válido no formato legado (numérico) ou no novo formato alfanumérico, previsto para julho de 2026. Dígitos verificadores calculados pelo algoritmo oficial de módulo 11. Grátis, no navegador, sem cadastro.",

    type_label: "Formato",
    type_legacy: "Formato Numérico",
    type_alpha: "Formato Alfanumérico (novo)",
    type_legacy_short: "Numérico",
    type_alpha_short: "Alfanumérico",

    num: "Sem pontuação",
    multiple_label: "Gerar Múltiplos CNPJs",
    bt: "Gerar CNPJ",
    bt_multiple: "Gerar CNPJs",
    cnpj_label: "CNPJ Gerado",
    quantity: "Quantidade",
    generated_cnpjs: "CNPJs Gerados ({count})",
    copy_all: "Copiar Todos",
    placeholder: "Clique em Gerar CNPJ para criar um número",
    warning: "Os números gerados são fictícios e destinados exclusivamente a testes.",

    d1: "Gerador de CNPJ online e gratuito para desenvolvedores, QAs e estudantes de programação. Suporta o formato legado — 14 dígitos numéricos com dígitos verificadores calculados por módulo 11 — e o novo CNPJ alfanumérico, com implantação prevista para julho de 2026, no qual as doze primeiras posições (raiz e ordem) podem conter letras de A a Z além de números. Os dois últimos caracteres, os dígitos verificadores, permanecem numéricos. Todos os CNPJs gerados são matematicamente válidos e passam em qualquer validação de formato ou regra de negócio. O processo roda inteiramente no navegador, sem cadastro e sem vínculo com empresas reais.",

    features_title: "Funcionalidades",
    f_1: "Geração de CNPJ legado (numérico) e alfanumérico (novo formato)",
    f_2: "Lotes de até 100 CNPJs únicos por vez",
    f_3: "Saída com ou sem pontuação",
    f_4: "Dígitos verificadores calculados pelo algoritmo oficial de módulo 11",
    f_5: "Tabela comparativa e explicação completa do novo CNPJ alfanumérico",

    how_title: "Como Funciona o Algoritmo do CNPJ — Legado e Alfanumérico",
    how_desc: "No CNPJ legado, os 14 dígitos se dividem em raiz (8 dígitos), ordem (4 dígitos — 0001 para a matriz) e verificadores (2 dígitos). Os verificadores são calculados por soma ponderada com módulo 11 aplicado duas vezes: cada caractere é multiplicado por um peso, os resultados são somados e divididos por 11, e o resto define o verificador (0 se o resto for menor que 2, caso contrário 11 menos o resto). No CNPJ alfanumérico o procedimento é o mesmo, mas as doze primeiras posições (raiz e ordem) podem conter letras de A a Z. Para o cálculo, cada caractere recebe o valor da tabela ASCII menos 48: os números de 0 a 9 mantêm seu valor e as letras assumem A=17, B=18, C=19 e assim por diante até Z=42. Os dígitos verificadores resultantes são sempre numéricos (0–9). A Receita Federal recomenda não utilizar as letras I, O, Q e F, por gerarem confusão visual com números e colisões no cálculo do verificador; este gerador já as exclui.",

    diff_title: "CNPJ Legado vs. CNPJ Alfanumérico — Qual a Diferença?",
    diff_desc: "O CNPJ brasileiro passou por uma atualização estrutural. O formato legado utiliza apenas dígitos nos seus 14 caracteres, e o modelo numérico está próximo do seu limite de registros. O novo formato alfanumérico, com implantação prevista para julho de 2026, mantém os 14 caracteres, mas as doze primeiras posições (raiz e ordem) passam a aceitar letras de A a Z além dos dígitos, ampliando de forma significativa a capacidade de novos registros. Apenas os dois dígitos verificadores permanecem numéricos, e o cálculo por módulo 11 não muda — o que simplifica a adaptação dos sistemas existentes.",
    use_cases_title: "Casos de Uso",
    use_cases_intro: "As aplicações práticas mais comuns do gerador de CNPJ no fluxo de trabalho de desenvolvimento e QA são:",
    use_1_t: "Validação de Formulários e UI",
    use_1_d: "Teste campos de CNPJ, máscaras e lógica de validação em cadastros. Com o novo formato alfanumérico disponível, valide se a UI aceita corretamente letras nas primeiras posições.",
    use_2_t: "Sistemas Fiscais e NF-e",
    use_2_d: "Valide fluxos de emissão de nota fiscal eletrônica e integrações com sistemas de faturamento, testando tanto CNPJs legados quanto alfanuméricos.",
    use_3_t: "Bancos de Dados e Ambientes de Staging",
    use_3_d: "Preencha ambientes de staging e homologação com dados empresariais realistas, sem expor informações de empresas reais.",
    use_4_t: "Integração de APIs",
    use_4_d: "Realize testes de integração com serviços externos que validam o formato do CNPJ, verificando se ambos os formatos legado e alfanumérico são aceitos corretamente.",
    use_5_t: "UX Design e Demos",
    use_5_d: "Crie personas empresariais para protótipos no Figma, Adobe XD ou apresentações para clientes sem expor dados reais de empresas.",
    use_6_t: "Migração para o CNPJ Alfanumérico",
    use_6_d: "Gere CNPJs alfanuméricos para testar se sistemas legados foram corretamente atualizados: campos de formulário que aceitam letras, colunas de banco com tipo e comprimento corretos, validações de API e regras de negócio.",
    use_7_t: "Testes de Compatibilidade entre Formatos",
    use_7_d: "Gere lotes com ambos os tipos para garantir que relatórios, integrações e regras de negócio tratem os dois formatos de forma consistente durante o período de coexistência.",

    how_to_use_title: "Como Usar",
    step_1_title: "Escolher o formato",
    step_1_desc: "Selecione entre CNPJ Legado (numérico, 14 dígitos) ou CNPJ Alfanumérico (novo formato com letras nas primeiras posições). Ao abrir a página, um CNPJ legado já é gerado automaticamente.",
    step_2_title: "Gerar um ou vários",
    step_2_desc: "Clique em \"Gerar CNPJ\" para um número único, pronto para copiar com um clique. Para lotes, ative \"Gerar Múltiplos CNPJs\", defina a quantidade (2 a 100) e use \"Copiar Todos\".",
    step_3_title: "Escolher o formato de saída",
    step_3_desc: "Ative \"Sem pontuação\" para remover pontos, barra e traço — ideal para banco de dados, JSON e APIs.",

    faq_title: "Perguntas e Respostas",
    faq_1_q: "O CNPJ gerado é real?",
    faq_1_a: "Não. Os CNPJs gerados são fictícios e não estão cadastrados na Receita Federal. Eles passam na validação matemática dos dígitos verificadores, mas não têm validade legal. Use exclusivamente para testes de software e desenvolvimento.",
    faq_2_q: "É legal usar este gerador de CNPJ?",
    faq_2_a: "Sim, para testes de software, fins educacionais e demonstrações técnicas. Usar CNPJs fictícios ou de terceiros para cadastros oficiais, fraudes ou obtenção de benefícios indevidos é crime de falsidade ideológica (Art. 299 do Código Penal Brasileiro).",
    faq_3_q: "O que é o CNPJ alfanumérico e o que mudou?",
    faq_3_a: "O CNPJ alfanumérico é o novo formato do cadastro empresarial brasileiro, com implantação prevista para julho de 2026. As doze primeiras posições do número (a raiz, de 8 caracteres, e a ordem, de 4) passam a aceitar letras de A a Z além dos dígitos de 0 a 9. Os dois dígitos verificadores continuam numéricos, e o algoritmo de validação por módulo 11 permanece o mesmo — apenas os valores das letras passam a ser obtidos pela tabela ASCII menos 48 (A=17 até Z=42).",
    faq_4_q: "A partir de quando vale o novo CNPJ?",
    faq_4_a: "O novo CNPJ alfanumérico tem implantação prevista para julho de 2026. A Receita Federal adotará uma transição gradual: os CNPJs legados (numéricos) já emitidos continuarão válidos indefinidamente, e os novos registros passarão a receber o formato alfanumérico à medida que o estoque numérico se esgotar. Na prática, sistemas que processam CNPJs precisam estar preparados para validar e armazenar os dois formatos.",
    faq_5_q: "Os CNPJs legados continuam válidos após a mudança?",
    faq_5_a: "Sim. Todos os CNPJs emitidos no formato numérico legado continuam plenamente válidos e não precisam ser substituídos. A adoção do formato alfanumérico é aditiva: os novos registros passarão a usar o novo formato, mas empresas com CNPJ legado não precisam migrar. Para desenvolvedores, isso significa que os sistemas devem aceitar e validar os dois formatos simultaneamente.",
    faq_6_q: "Como funciona o algoritmo de validação do CNPJ?",
    faq_6_a: "O CNPJ tem 2 dígitos verificadores calculados a partir dos 12 primeiros caracteres (raiz + ordem) por soma ponderada com módulo 11 aplicado duas vezes. Os pesos do primeiro cálculo são 5,4,3,2,9,8,7,6,5,4,3,2 e os do segundo 6,5,4,3,2,9,8,7,6,5,4,3,2. No formato alfanumérico, cada caractere é convertido pelo valor da tabela ASCII menos 48 antes do cálculo: os dígitos de 0 a 9 mantêm seu valor e as letras vão de A=17 a Z=42. Se o resto da divisão for menor que 2, o verificador é 0; caso contrário, é 11 menos o resto. A Receita Federal recomenda não utilizar as letras I, O, Q e F.",

    see1: "Gerador de CPF",
    see2: "Letras Diferentes",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  },
  en: {
    pageTitle: "Brazilian CNPJ Generator — Legacy & Alphanumeric New Format | Free",
    title: "CNPJ Generator",
    meta: "Generate valid Brazilian CNPJ in legacy (numeric) or the new alphanumeric format, planned for July 2026. Check digits calculated by the official modulo 11 algorithm. Free, in-browser, no sign-up.",

    type_label: "Format",
    type_legacy: "Numeric Format",
    type_alpha: "Alphanumeric Format (new)",
    type_legacy_short: "Numérico",
    type_alpha_short: "Alphanumeric",

    num: "No punctuation",
    multiple_label: "Generate Multiple CNPJs",
    bt: "Generate CNPJ",
    bt_multiple: "Generate CNPJs",
    cnpj_label: "Generated CNPJ",
    quantity: "Quantity",
    generated_cnpjs: "Generated CNPJs ({count})",
    copy_all: "Copy All",
    placeholder: "Click Generate CNPJ to create a number",
    warning: "The generated numbers are fictitious and intended exclusively for testing purposes.",

    d1: "Free online CNPJ generator for developers, QA engineers, and programming students. Supports both the legacy format — 14 numeric digits with check digits calculated by modulo 11 — and the new alphanumeric CNPJ, planned for July 2026, in which the first twelve positions (base and branch) can contain letters A–Z in addition to digits. The last two characters, the check digits, remain numeric. All generated CNPJs are mathematically valid and pass any format validation or business rule. The process runs entirely in the browser, with no sign-up and no connection to real companies.",

    features_title: "Features",
    f_1: "Legacy (numeric) and alphanumeric (new format) CNPJ generation",
    f_2: "Batches of up to 100 unique CNPJs at once",
    f_3: "Output with or without punctuation",
    f_4: "Check digits calculated via the official modulo 11 algorithm",
    f_5: "Comparison table and full explanation of the new alphanumeric CNPJ",

    how_title: "How the CNPJ Algorithm Works — Legacy and Alphanumeric",
    how_desc: "In the legacy CNPJ, the 14 digits are split into base (8 digits), branch (4 digits — 0001 for headquarters), and check digits (2 digits). The check digits are calculated by weighted sum with modulo 11 applied twice: each character is multiplied by a specific weight, the results are summed, divided by 11, and the remainder determines the check digit (0 if the remainder is less than 2, otherwise 11 minus the remainder). The alphanumeric CNPJ follows the same procedure, but the first twelve positions (base and branch) can include letters A–Z. For the calculation, each character receives its ASCII table value minus 48: digits from 0 to 9 keep their value, and letters become A=17, B=18, C=19, and so on through Z=42. The resulting check digits are always numeric (0–9). The Receita Federal recommends avoiding the letters I, O, Q, and F because they can cause visual confusion with numbers and collisions in the check-digit calculation; this generator already excludes them.",

    diff_title: "Legacy CNPJ vs. Alphanumeric CNPJ — What's the Difference?",
    diff_desc: "The Brazilian CNPJ has undergone a structural update. The legacy format uses only digits across its 14 characters, and the numeric model is close to its registration limit. The new alphanumeric format, planned for July 2026, keeps the 14 characters, but the first twelve positions (base and branch) will accept letters A–Z in addition to digits, significantly expanding capacity for new registrations. Only the two check digits remain numeric, and the modulo 11 calculation does not change — simplifying the adaptation of existing systems.",

    use_cases_title: "Use Cases",
    use_cases_intro: "The most common practical applications of the CNPJ generator in development and QA workflows are:",
    use_1_t: "Form and UI Validation",
    use_1_d: "Test CNPJ fields, masks, and validation logic in registration forms. With the new alphanumeric format available, verify whether the UI correctly accepts letters in the first positions.",
    use_2_t: "Tax Systems and NF-e",
    use_2_d: "Validate invoice issuance flows and billing system integrations, testing both legacy and alphanumeric CNPJs.",
    use_3_t: "Databases and Staging Environments",
    use_3_d: "Fill staging and testing environments with realistic company data without exposing real company information.",
    use_4_t: "API Integration",
    use_4_d: "Run integration tests with external services that validate CNPJ format, checking whether both legacy and alphanumeric formats are accepted.",
    use_5_t: "UX Design and Demos",
    use_5_d: "Create business personas for Figma, Adobe XD prototypes, or client presentations without exposing real company data.",
    use_6_t: "Migration to Alphanumeric CNPJ",
    use_6_d: "Generate alphanumeric CNPJs to test whether legacy systems have been correctly updated: form fields accepting letters, database columns with correct type and length, API validations, and business rules.",
    use_7_t: "Cross-Format Compatibility Testing",
    use_7_d: "Generate batches of both types to ensure reports, integrations, and business rules handle both formats consistently during the coexistence period.",

    how_to_use_title: "How to Use",
    step_1_title: "Choose the format",
    step_1_desc: "Select Legacy CNPJ (numeric, 14 digits) or Alphanumeric CNPJ (new format with letters in the first positions). When you open the page, a legacy CNPJ is already generated automatically.",
    step_2_title: "Generate one or several",
    step_2_desc: "Click \"Generate CNPJ\" for a single number, ready to copy with one click. For batches, enable \"Generate Multiple CNPJs\", set the quantity (2 to 100), and use \"Copy All\".",
    step_3_title: "Choose the output format",
    step_3_desc: "Enable \"No punctuation\" to remove dots, slash, and dash — ideal for databases, JSON, and APIs.",

    faq_title: "Questions & Answers",
    faq_1_q: "Is the generated CNPJ real?",
    faq_1_a: "No. The generated CNPJs are fictitious and not registered with the Receita Federal. They pass mathematical check digit validation, but have no legal validity. Use exclusively for software testing and development.",
    faq_2_q: "Is it legal to use this CNPJ generator?",
    faq_2_a: "Yes, for software testing, educational purposes, and technical demonstrations. Using fictitious or third-party CNPJs for official registrations, fraud, or obtaining undue benefits is a crime under the Brazilian Penal Code (Art. 299).",
    faq_3_q: "What is the alphanumeric CNPJ and what changed?",
    faq_3_a: "The alphanumeric CNPJ is the new format for the Brazilian company registry, planned for July 2026. The first twelve positions of the number (the 8-character base and the 4-character branch) will accept letters A–Z in addition to digits 0–9. The two check digits remain numeric, and the modulo 11 validation algorithm stays the same — only letter values are obtained from the ASCII table minus 48 (A=17 through Z=42).",
    faq_4_q: "From when is the new CNPJ valid?",
    faq_4_a: "The new alphanumeric CNPJ is planned for July 2026. The Receita Federal will adopt a gradual transition: legacy (numeric) CNPJs already issued will remain valid indefinitely, and new company registrations will start receiving the alphanumeric format as the numeric stock is exhausted. In practice, systems processing CNPJs need to be prepared to validate and store both formats.",
    faq_5_q: "Do legacy CNPJs remain valid after the change?",
    faq_5_a: "Yes, all CNPJs issued in the legacy numeric format remain fully valid and do not need to be replaced. The shift to the alphanumeric format is additive: new registrations use the new format, but companies with a legacy CNPJ do not need to migrate. For developers, this means systems must accept and validate both formats simultaneously.",
    faq_6_q: "How does the CNPJ validation algorithm work?",
    faq_6_a: "The CNPJ has 2 check digits calculated from the first 12 characters (base + branch) using weighted sum with modulo 11 applied twice. The weights for the first calculation are 5,4,3,2,9,8,7,6,5,4,3,2 and for the second 6,5,4,3,2,9,8,7,6,5,4,3,2. For alphanumeric CNPJs, letters are converted using their ASCII code minus 48 (A=17 through Z=42) before the same calculation. If the remainder is less than 2, the check digit is 0; otherwise it is 11 minus the remainder. The Receita Federal recommends avoiding the letters I, O, Q, and F.",

    see1: "CPF Generator",
    see2: "Fancy Letters",
    see3: "Credit Card Generator",
    see4: "Birthday Generator"
  },
  es: {
    pageTitle: "Generador de CNPJ Brasileño — Legado y Alfanumérico (Nuevo Formato) | Gratis",
    title: "Generador de CNPJ Brasileño",
    meta: "Genera CNPJ válido en formato legado (numérico) o en el nuevo formato alfanumérico, previsto para julio de 2026. Dígitos verificadores calculados por el algoritmo oficial. Gratis, sin registro.",

    type_label: "Formato",
    type_legacy: "Formato Numérico",
    type_alpha: "Formato Alfanumérico (nuevo)",
    type_legacy_short: "Numérico",
    type_alpha_short: "Alfanumérico",

    num: "Sin puntuación",
    multiple_label: "Generar Múltiples CNPJs",
    bt: "Generar CNPJ",
    bt_multiple: "Generar CNPJs",
    cnpj_label: "CNPJ Generado",
    quantity: "Cantidad",
    generated_cnpjs: "CNPJs Generados ({count})",
    copy_all: "Copiar Todos",
    placeholder: "Haz clic en Generar CNPJ para crear un número",
    warning: "Los números generados son ficticios y están destinados exclusivamente a pruebas.",

    d1: "Generador de CNPJ online y gratuito para desarrolladores, QA y estudiantes de programación. Soporta el formato legado — 14 dígitos numéricos con dígitos verificadores calculados por módulo 11 — y el nuevo CNPJ alfanumérico, previsto para julio de 2026. Todos los CNPJs generados son matemáticamente válidos. El proceso corre en el navegador, sin registro y sin vínculo con empresas reales.",

    features_title: "Funcionalidades",
    f_1: "Generación de CNPJ legado (numérico) y alfanumérico (nuevo formato)",
    f_2: "Lotes de hasta 100 CNPJs únicos a la vez",
    f_3: "Salida con o sin puntuación",
    f_4: "Dígitos verificadores calculados por el algoritmo oficial de módulo 11",
    f_5: "Tabla comparativa y explicación del nuevo CNPJ alfanumérico",

    how_title: "Cómo Funciona el Algoritmo del CNPJ — Legado y Alfanumérico",
    how_desc: "En el CNPJ legado, los 14 dígitos se dividen en raíz (8 dígitos), filial (4 dígitos — 0001 para la matriz) y verificadores (2 dígitos). Los verificadores se calculan por suma ponderada con módulo 11 aplicado dos veces: cada carácter se multiplica por un peso específico, se suman los resultados, se dividen por 11 y el resto determina el verificador (0 si el resto es menor que 2, de lo contrario 11 menos el resto). En el CNPJ alfanumérico el procedimiento es idéntico, pero los doce primeros caracteres (raíz y filial) pueden incluir letras de A a Z — el valor de cada letra es su código ASCII menos 48 (A=17, B=18… Z=42). Los dígitos verificadores resultantes siempre son numéricos (0–9). La Receita Federal recomienda evitar las letras I, O, Q y F para evitar confusión visual y colisiones en el cálculo; este generador ya las excluye.",
    
    diff_title: "CNPJ Legado vs. CNPJ Alfanumérico — ¿Cuál es la Diferencia?",
    diff_desc: "El CNPJ brasileño pasó por una actualización estructural significativa. El formato legado usa exclusivamente dígitos en sus 14 caracteres, con capacidad de aproximadamente 100 millones de bases únicas. El nuevo formato alfanumérico, previsto para julio de 2026, mantiene los 14 caracteres pero los doce primeros (raíz y filial) pasarán a aceptar letras de A a Z además de dígitos, ampliando significativamente la capacidad. Solo los dos dígitos verificadores permanecen numéricos, y el algoritmo de módulo 11 no cambia.",

    use_cases_title: "Casos de Uso",
    use_cases_intro: "Las aplicaciones prácticas más comunes del generador de CNPJ en el flujo de trabajo de desarrollo y QA son:",
    use_1_t: "Validación de Formularios y UI",
    use_1_d: "Prueba campos de CNPJ, máscaras y lógica de validación. Con el formato alfanumérico disponible, verifica si la UI acepta correctamente letras en los primeros caracteres.",
    use_2_t: "Sistemas Fiscales y NF-e",
    use_2_d: "Valida flujos de emisión de facturas e integraciones con sistemas de facturación, probando tanto CNPJs legados como alfanuméricos.",
    use_3_t: "Bases de Datos y Entornos de Staging",
    use_3_d: "Llena entornos de staging y pruebas con datos empresariales realistas sin exponer información de empresas reales.",
    use_4_t: "Integración de APIs",
    use_4_d: "Realiza pruebas de integración con servicios externos que validan el formato del CNPJ, verificando si ambos formatos son aceptados.",
    use_5_t: "UX Design y Demos",
    use_5_d: "Crea personas empresariales para prototipos y presentaciones para clientes sin exponer datos reales.",
    use_6_t: "Migración al CNPJ Alfanumérico",
    use_6_d: "Genera CNPJs alfanuméricos para probar si los sistemas legados fueron correctamente actualizados: campos que aceptan letras, columnas de base de datos con tipo y longitud correctos.",
    use_7_t: "Pruebas de Compatibilidad entre Formatos",
    use_7_d: "Genera lotes de ambos tipos para garantizar que informes, integraciones y reglas de negocio traten los dos formatos de forma consistente.",

    how_to_use_title: "Cómo Usar",
    step_1_title: "Elegir el formato",
    step_1_desc: "Selecciona entre CNPJ Legado (numérico) o CNPJ Alfanumérico (nuevo formato con letras en las primeras posiciones). Al abrir la página, un CNPJ legado ya se genera automáticamente.",
    step_2_title: "Generar uno o varios",
    step_2_desc: "Haz clic en \"Generar CNPJ\" para un número único. Para lotes, activa \"Generar Múltiples CNPJs\", define la cantidad (2 a 100) y usa \"Copiar Todos\".",
    step_3_title: "Elegir el formato de salida",
    step_3_desc: "Activa \"Sin puntuación\" para eliminar puntos, barra y guión — ideal para bases de datos, JSON y APIs.",

    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿El CNPJ generado es real?",
    faq_1_a: "No. Los CNPJs generados son ficticios y no están registrados. Pasan la validación matemática de dígitos verificadores, pero no tienen validez legal. Úsalos exclusivamente para pruebas de software y desarrollo.",
    faq_2_q: "¿Es legal usar este generador de CNPJ?",
    faq_2_a: "Sí, para pruebas de software, fines educativos y demostraciones técnicas. Usar CNPJs ficticios o de terceros para registros oficiales o fraudes es un delito según el Código Penal Brasileño (Art. 299).",
    faq_3_q: "¿Qué es el CNPJ alfanumérico y qué cambió?",
    faq_3_a: "El CNPJ alfanumérico es el nuevo formato del registro empresarial brasileño, previsto para julio de 2026. Los doce primeros caracteres (raíz y filial) pasarán a aceptar letras de A a Z además de dígitos 0 a 9. Solo los dos dígitos verificadores permanecen numéricos, y el algoritmo de módulo 11 no cambia.",
    faq_4_q: "¿A partir de cuándo vale el nuevo CNPJ?",
    faq_4_a: "El nuevo CNPJ alfanumérico está previsto para julio de 2026. Los CNPJs legados ya emitidos seguirán siendo válidos indefinidamente. Los sistemas deberán estar preparados para validar y almacenar ambos formatos.",
    faq_5_q: "¿Los CNPJs legados siguen siendo válidos?",
    faq_5_a: "Sí, todos los CNPJs emitidos en formato numérico legado siguen siendo plenamente válidos. Los sistemas deben aceptar y validar ambos formatos simultáneamente.",
    faq_6_q: "¿Cómo funciona el algoritmo de validación del CNPJ?",
    faq_6_a: "El CNPJ tiene 2 dígitos verificadores calculados a partir de los 12 primeros caracteres mediante una suma ponderada con módulo 11 aplicado dos veces. Los pesos para el primer cálculo son 5,4,3,2,9,8,7,6,5,4,3,2 y para el segundo 6,5,4,3,2,9,8,7,6,5,4,3,2. Para el formato alfanumérico, las letras se convierten usando su código ASCII menos 48 (A=17 hasta Z=42) antes del mismo cálculo. Si el resto de la división es menor que 2, el verificador es 0; de lo contrario, es 11 menos el resto. Se recomienda no usar las letras I, O, Q y F.",

    see1: "Generador de CPF",
    see2: "Letras Diferentes",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Generador de Fecha de Nacimiento"
  },
  fr: {
    pageTitle: "Générateur de CNPJ Brésilien — Ancien et Alphanumérique | Gratuit",
    title: "Générateur de CNPJ Brésilien",
    meta: "Générez un CNPJ valide au format ancien (numérique) ou au nouveau format alphanumérique, prévu pour juillet 2026. Chiffres de contrôle calculés par l'algorithme officiel. Gratuit, sans inscription.",

    type_label: "Format",
    type_legacy: "Format Numérique",
    type_alpha: "Format Alphanumérique (nouveau)",
    type_legacy_short: "Numérique",
    type_alpha_short: "Alphanumérique",

    num: "Sans ponctuation",
    multiple_label: "Générer plusieurs CNPJs",
    bt: "Générer CNPJ",
    bt_multiple: "Générer des CNPJs",
    cnpj_label: "CNPJ Généré",
    quantity: "Quantité",
    generated_cnpjs: "CNPJs Générés ({count})",
    copy_all: "Tout copier",
    placeholder: "Cliquez sur Générer CNPJ pour créer un numéro",
    warning: "Les numéros générés sont fictifs et destinés exclusivement à des fins de test.",

    d1: "Générateur de CNPJ en ligne et gratuit pour les développeurs, testeurs et étudiants en programmation. Prend en charge le format ancien — 14 chiffres numériques avec chiffres de contrôle calculés par modulo 11 — et le nouveau CNPJ alphanumérique, prévu pour juillet 2026. Tous les CNPJs générés sont mathématiquement valides. Le processus s'exécute dans le navigateur, sans inscription.",

    features_title: "Fonctionnalités",
    f_1: "Génération de CNPJ ancien (numérique) et alphanumérique (nouveau format)",
    f_2: "Lots de jusqu'à 100 CNPJs uniques en une fois",
    f_3: "Sortie avec ou sans ponctuation",
    f_4: "Chiffres de contrôle calculés par l'algorithme officiel modulo 11",
    f_5: "Tableau comparatif et explication du nouveau CNPJ alphanumérique",

    how_title: "Comment Fonctionne l'Algorithme du CNPJ — Ancien et Alphanumérique",
    how_desc: "Dans le CNPJ ancien, les 14 chiffres se divisent en racine (8 chiffres), succursale (4 — 0001 pour le siège social) et chiffres de contrôle (2). Les chiffres de contrôle sont calculés par somme pondérée avec modulo 11 appliqué deux fois : chaque caractère est multiplié par un poids spécifique, les résultats sont sommés, divisés par 11, et le reste définit le chiffre de contrôle (0 si le reste est inférieur à 2, sinon 11 moins le reste). Le CNPJ alphanumérique suit le même procédé, mais les douze premiers caractères (racine et succursale) peuvent inclure des lettres A–Z — la valeur de chaque lettre est son code ASCII moins 48 (A=17… Z=42). Les chiffres de contrôle restent toujours numériques (0–9). La Receita Federal recommande d'éviter les lettres I, O, Q et F pour éviter la confusion visuelle et les collisions de calcul ; ce générateur les exclut déjà.",

    diff_title: "CNPJ Ancien vs. CNPJ Alphanumérique — Quelle Différence ?",
    diff_desc: "Le CNPJ brésilien a subi une mise à jour structurelle importante. Le format ancien utilise exclusivement des chiffres sur ses 14 caractères, avec une capacité d'environ 100 millions de racines uniques. Le nouveau format alphanumérique, prévu pour juillet 2026, conserve les 14 caractères mais les douze premiers (racine et succursale) accepteront des lettres A–Z en plus des chiffres, augmentant significativement la capacité. Seuls les deux chiffres de contrôle restent numériques, et l'algorithme modulo 11 ne change pas.",

    use_cases_title: "Cas d'Usage",
    use_cases_intro: "Les applications pratiques les plus courantes du générateur de CNPJ dans les flux de développement et de QA sont :",
    use_1_t: "Validation de formulaires et UI",
    use_1_d: "Testez les champs CNPJ, les masques et la logique de validation. Avec le format alphanumérique, vérifiez si l'UI accepte correctement les lettres.",
    use_2_t: "Systèmes fiscaux et NF-e",
    use_2_d: "Validez les flux d'émission de factures et les intégrations, en testant les deux formats.",
    use_3_t: "Bases de données et environnements de staging",
    use_3_d: "Remplissez les environnements de test avec des données d'entreprise réalistes sans exposer de vraies informations.",
    use_4_t: "Intégration d'API",
    use_4_d: "Effectuez des tests d'intégration avec des services externes validant le format CNPJ.",
    use_5_t: "UX Design et Démos",
    use_5_d: "Créez des personas d'entreprise pour des prototypes et des présentations clients sans exposer de vraies données.",
    use_6_t: "Migration vers le CNPJ Alphanumérique",
    use_6_d: "Générez des CNPJs alphanumériques pour tester si les systèmes existants ont été correctement mis à jour.",
    use_7_t: "Tests de compatibilité entre formats",
    use_7_d: "Générez des lots des deux types pour garantir que les rapports et intégrations gèrent les deux formats de manière cohérente.",

    how_to_use_title: "Comment Utiliser",
    step_1_title: "Choisir le format",
    step_1_desc: "Sélectionnez CNPJ Ancien (numérique) ou CNPJ Alphanumérique (nouveau format avec des lettres dans les premières positions). À l'ouverture, un CNPJ ancien est déjà généré.",
    step_2_title: "Générer un ou plusieurs",
    step_2_desc: "Cliquez sur « Générer CNPJ » pour un numéro unique. Pour des lots, activez « Générer Plusieurs CNPJs » et utilisez « Tout Copier ».",
    step_3_title: "Choisir le format de sortie",
    step_3_desc: "Activez « Sans ponctuation » pour supprimer les points, la barre et le tiret — idéal pour les bases de données, JSON et APIs.",

    faq_title: "Questions et Réponses",
    faq_1_q: "Le CNPJ généré est-il réel ?",
    faq_1_a: "Non. Les CNPJs générés sont fictifs et non enregistrés. Ils passent la validation mathématique, mais n'ont aucune validité légale. Utilisez-les exclusivement pour les tests logiciels.",
    faq_2_q: "Est-il légal d'utiliser ce générateur de CNPJ ?",
    faq_2_a: "Oui, pour les tests logiciels, les fins éducatives et les démonstrations techniques. Utiliser des CNPJs fictifs pour des inscriptions officielles ou des fraudes est un délit selon le Code Pénal Brésilien (Art. 299).",
    faq_3_q: "Qu'est-ce que le CNPJ alphanumérique et qu'est-ce qui a changé ?",
    faq_3_a: "Le CNPJ alphanumérique est le nouveau format du registre d'entreprises brésilien, prévu pour juillet 2026. Les douze premiers caractères (base et filiale) accepteront des lettres A–Z en plus des chiffres 0–9. Seuls les deux chiffres de contrôle restent numériques, et l'algorithme modulo 11 ne change pas.",
    faq_4_q: "À partir de quand le nouveau CNPJ est-il valable ?",
    faq_4_a: "Le nouveau CNPJ alphanumérique est prévu pour juillet 2026. Les CNPJs anciens déjà émis resteront valides indéfiniment. Les systèmes devront être préparés à valider les deux formats.",
    faq_5_q: "Les CNPJs anciens restent-ils valides ?",
    faq_5_a: "Oui, tous les CNPJs émis au format numérique ancien restent pleinement valides. Les systèmes doivent accepter et valider les deux formats simultanément.",
    faq_6_q: "Comment fonctionne l'algorithme de validation du CNPJ ?",
    faq_6_a: "Le CNPJ a 2 chiffres de contrôle calculés à partir des 12 premiers caractères par somme pondérée avec modulo 11 appliqué deux fois. Les poids pour le premier calcul sont 5,4,3,2,9,8,7,6,5,4,3,2 et pour le second 6,5,4,3,2,9,8,7,6,5,4,3,2. Pour les CNPJs alphanumériques, les lettres sont converties via leur code ASCII moins 48 (A=17 à Z=42) avant le même calcul. Si le reste est inférieur à 2, le chiffre de contrôle est 0 ; sinon, il est égal à 11 moins le reste. La Receita Federal recommande d'éviter les lettres I, O, Q et F.",

    see1: "Générateur de CPF",
    see2: "Lettres Différentes",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance"
  },
  it: {
    pageTitle: "Generatore di CNPJ Brasiliano — Legacy e Alfanumerico | Gratis",
    title: "Generatore di CNPJ Brasiliano",
    meta: "Genera CNPJ valido nel formato legacy (numerico) o nel nuovo formato alfanumerico, previsto per luglio 2026. Cifre di controllo calcolate dall'algoritmo ufficiale. Gratis, senza registrazione.",

    type_label: "Formato",
    type_legacy: "Formato Numerico",
    type_alpha: "Formato Alfanumerico (nuovo)",
    type_legacy_short: "Numérico",
    type_alpha_short: "Alfanumerico",

    num: "Senza punteggiatura",
    multiple_label: "Genera Più CNPJ",
    bt: "Genera CNPJ",
    bt_multiple: "Genera più CNPJ",
    cnpj_label: "CNPJ Generato",
    quantity: "Quantità",
    generated_cnpjs: "CNPJ Generati ({count})",
    copy_all: "Copia Tutti",
    placeholder: "Clicca su Genera CNPJ per creare un numero",
    warning: "I numeri generati sono fittizi e destinati esclusivamente a scopi di test.",

    d1: "Generatore di CNPJ online e gratuito per sviluppatori, tester e studenti. Supporta il formato legacy — 14 cifre numeriche con cifre di controllo calcolate tramite modulo 11 — e il nuovo CNPJ alfanumerico, previsto per luglio 2026. Tutti i CNPJ generati sono matematicamente validi. Il processo gira nel browser, senza registrazione.",

    features_title: "Funzionalità",
    f_1: "Generazione di CNPJ legacy (numerico) e alfanumerico (nuovo formato)",
    f_2: "Batch fino a 100 CNPJ unici in una volta",
    f_3: "Output con o senza punteggiatura",
    f_4: "Cifre di controllo calcolate con l'algoritmo ufficiale modulo 11",
    f_5: "Tabella comparativa e spiegazione del nuovo CNPJ alfanumerico",

    how_title: "Come Funziona l'Algoritmo del CNPJ — Legacy e Alfanumerico",
    how_desc: "Nel CNPJ legacy, le 14 cifre si dividono in base (8), filiale (4 — 0001 per la sede) e verificatori (2). I verificatori sono calcolati con somma ponderata e modulo 11 applicato due volte: ogni carattere viene moltiplicato per un peso specifico, i risultati vengono sommati, divisi per 11 e il resto definisce il verificatore (0 se il resto è minore di 2, altrimenti 11 meno il resto). Nel CNPJ alfanumerico la procedura è identica, ma i dodici primi caratteri (base e filiale) possono includere lettere A–Z — il valore di ogni lettera è il suo codice ASCII meno 48 (A=17… Z=42). Le cifre di controllo sono sempre numeriche (0–9). La Receita Federal raccomanda di evitare le lettere I, O, Q e F per evitare confusione visiva e collisioni nel calcolo; questo generatore le esclude già.",

    diff_title: "CNPJ Legacy vs. CNPJ Alfanumerico — Qual è la Differenza?",
    diff_desc: "Il CNPJ brasiliano ha subito un aggiornamento strutturale significativo. Il formato legacy usa solo cifre sui 14 caratteri, con circa 100 milioni di basi uniche. Il nuovo formato alfanumerico, previsto per luglio 2026, mantiene i 14 caratteri ma i primi dodici (base e filiale) accetteranno lettere A–Z oltre alle cifre, ampliando significativamente la capacità. Solo le due cifre di controllo restano numeriche, e l'algoritmo modulo 11 non cambia.",

    use_cases_title: "Casi d'Uso",
    use_cases_intro: "Le applicazioni pratiche più comuni del generatore di CNPJ nel flusso di lavoro di sviluppo e QA sono:",
    use_1_t: "Validazione di form e UI",
    use_1_d: "Testa campi CNPJ, maschere e logica di validazione. Con il formato alfanumerico, verifica se la UI accetta correttamente le lettere.",
    use_2_t: "Sistemi fiscali e NF-e",
    use_2_d: "Valida flussi di emissione fatture e integrazioni, testando entrambi i formati.",
    use_3_t: "Database e ambienti di staging",
    use_3_d: "Popola ambienti di staging con dati aziendali realistici senza esporre informazioni reali.",
    use_4_t: "Integrazione API",
    use_4_d: "Esegui test di integrazione con servizi esterni che validano il formato CNPJ.",
    use_5_t: "UX Design e Demo",
    use_5_d: "Crea personas aziendali per prototipi e presentazioni senza esporre dati reali.",
    use_6_t: "Migrazione al CNPJ Alfanumerico",
    use_6_d: "Genera CNPJ alfanumerici per testare se i sistemi legacy sono stati aggiornati correttamente.",
    use_7_t: "Test di compatibilità tra formati",
    use_7_d: "Genera batch di entrambi i tipi per garantire che report e integrazioni gestiscano i due formati in modo coerente.",

    how_to_use_title: "Come Usare",
    step_1_title: "Scegliere il formato",
    step_1_desc: "Seleziona CNPJ Legacy (numerico) o CNPJ Alfanumerico (nuovo formato). All'apertura, un CNPJ legacy viene già generato.",
    step_2_title: "Generare uno o più",
    step_2_desc: "Clicca su \"Genera CNPJ\" per un numero singolo. Per batch, attiva \"Genera Più CNPJ\" e usa \"Copia Tutti\".",
    step_3_title: "Scegliere il formato di output",
    step_3_desc: "Attiva \"Senza punteggiatura\" per rimuovere punti, barra e trattino — ideale per database, JSON e API.",

    faq_title: "Domande e Risposte",
    faq_1_q: "Il CNPJ generato è reale?",
    faq_1_a: "No. I CNPJ generati sono fittizi e non registrati. Superano la validazione matematica, ma non hanno alcuna validità legale. Usali esclusivamente per test software.",
    faq_2_q: "È legale usare questo generatore di CNPJ?",
    faq_2_a: "Sì, per test software, scopi educativi e dimostrazioni tecniche. Usare CNPJ fittizi per registrazioni ufficiali o frodi è un reato ai sensi del Codice Penale Brasiliano (Art. 299).",
    faq_3_q: "Cos'è il CNPJ alfanumerico e cosa è cambiato?",
    faq_3_a: "Il CNPJ alfanumerico è il nuovo formato del registro aziendale brasiliano, previsto per luglio 2026. I primi dodici caratteri (radice e filiale) accetteranno lettere A–Z oltre alle cifre 0–9. Solo le due cifre di controllo restano numeriche, e l'algoritmo modulo 11 non cambia.",
    faq_4_q: "Da quando è valido il nuovo CNPJ?",
    faq_4_a: "Il nuovo CNPJ alfanumerico è previsto per luglio 2026. I CNPJ legacy già emessi resteranno validi indefinitamente. I sistemi dovranno essere preparati a validare entrambi i formati.",
    faq_5_q: "I CNPJ legacy restano validi?",
    faq_5_a: "Sì, tutti i CNPJ emessi nel formato numerico legacy restano pienamente validi. I sistemi devono accettare e validare entrambi i formati simultaneamente.",
    faq_6_q: "Come funziona l'algoritmo di validazione del CNPJ?",
    faq_6_a: "Il CNPJ ha 2 cifre di controllo calcolate dai primi 12 caratteri con somma ponderata e modulo 11 due volte. I pesi per il primo calcolo sono 5,4,3,2,9,8,7,6,5,4,3,2 e per il secondo 6,5,4,3,2,9,8,7,6,5,4,3,2. Per i CNPJ alfanumerici, le lettere vengono convertite tramite il codice ASCII meno 48 (A=17 fino a Z=42) prima dello stesso calcolo. Se il resto della divisione è minore di 2, la cifra di controllo è 0; altrimenti è 11 meno il resto. Si raccomanda di evitare le lettere I, O, Q e F.",

    see1: "Generatore di CPF",
    see2: "Lettere Diverse",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita"
  },
  id: {
    pageTitle: "Generator CNPJ Brasil — Legacy dan Alfanumerik (Format Baru) | Gratis",
    title: "Generator CNPJ Brasil",
    meta: "Buat CNPJ valid dalam format legacy (numerik) atau format alfanumerik baru, direncanakan untuk Juli 2026. Digit verifikasi dihitung dengan algoritma resmi. Gratis, tanpa pendaftaran.",

    type_label: "Format",
    type_legacy: "Format Numerik",
    type_alpha: "Format Alfanumerik (baru)",
    type_legacy_short: "Numérico",
    type_alpha_short: "Alfanumerik",

    num: "Tanpa tanda baca",
    multiple_label: "Buat Beberapa CNPJ",
    bt: "Buat CNPJ",
    bt_multiple: "Buat Beberapa CNPJ",
    cnpj_label: "CNPJ yang Dibuat",
    quantity: "Jumlah",
    generated_cnpjs: "CNPJ yang Dibuat ({count})",
    copy_all: "Salin Semua",
    placeholder: "Klik Buat CNPJ untuk membuat nomor",
    warning: "Nomor yang dihasilkan bersifat fiktif dan ditujukan semata-mata untuk keperluan pengujian.",

    d1: "Generator CNPJ online dan gratis untuk pengembang, QA, dan pelajar pemrograman. Mendukung format legacy — 14 digit numerik dengan digit verifikasi dihitung menggunakan modulo 11 — dan CNPJ alfanumerik baru, direncanakan untuk Juli 2026. Semua CNPJ yang dihasilkan valid secara matematis. Proses berjalan sepenuhnya di browser, tanpa pendaftaran.",

    features_title: "Fitur",
    f_1: "Pembuatan CNPJ legacy (numerik) dan alfanumerik (format baru)",
    f_2: "Batch hingga 100 CNPJ unik sekaligus",
    f_3: "Output dengan atau tanpa tanda baca",
    f_4: "Digit verifikasi dihitung dengan algoritma resmi modulo 11",
    f_5: "Tabel perbandingan dan penjelasan CNPJ alfanumerik baru",

    how_title: "Cara Kerja Algoritma CNPJ — Legacy dan Alfanumerik",
    how_desc: "Dalam CNPJ legacy, 14 digit dibagi menjadi basis (8), cabang (4 — 0001 untuk kantor pusat) dan digit verifikasi (2). Digit verifikasi dihitung dengan jumlah berbobot dan modulo 11 dua kali: setiap karakter dikalikan dengan bobot tertentu, hasilnya dijumlahkan, dibagi 11, dan sisanya menentukan digit verifikasi (0 jika sisa < 2, jika tidak 11 dikurangi sisa). Pada CNPJ alfanumerik prosedurnya sama, tetapi dua belas karakter pertama (basis dan cabang) dapat mencakup huruf A–Z — nilai setiap huruf adalah kode ASCII-nya dikurangi 48 (A=17… Z=42). Digit verifikasi selalu numerik (0–9). Receita Federal menyarankan untuk menghindari huruf I, O, Q, dan F untuk mencegah kebingungan visual dan tabrakan perhitungan; generator ini sudah mengecualikannya.",

    diff_title: "CNPJ Legacy vs. CNPJ Alfanumerik — Apa Bedanya?",
    diff_desc: "CNPJ Brasil mengalami pembaruan struktural yang signifikan. Format legacy hanya menggunakan digit pada 14 karakternya, dengan kapasitas sekitar 100 juta basis unik. Format alfanumerik baru, direncanakan untuk Juli 2026, mempertahankan 14 karakter tetapi dua belas karakter pertama (basis dan cabang) akan menerima huruf A–Z selain digit, memperluas kapasitas secara signifikan. Hanya dua digit verifikasi yang tetap numerik, dan algoritma modulo 11 tidak berubah.",

    use_cases_title: "Kasus Penggunaan",
    use_cases_intro: "Aplikasi praktis paling umum dari generator CNPJ dalam alur kerja pengembangan dan QA adalah:",
    use_1_t: "Validasi Formulir dan UI",
    use_1_d: "Uji bidang CNPJ, masker, dan logika validasi. Dengan format alfanumerik, periksa apakah UI menerima huruf dengan benar.",
    use_2_t: "Sistem Pajak dan NF-e",
    use_2_d: "Validasi alur penerbitan faktur dan integrasi, menguji kedua format.",
    use_3_t: "Database dan Lingkungan Staging",
    use_3_d: "Isi lingkungan staging dengan data perusahaan yang realistis tanpa mengekspos informasi nyata.",
    use_4_t: "Integrasi API",
    use_4_d: "Lakukan pengujian integrasi dengan layanan eksternal yang memvalidasi format CNPJ.",
    use_5_t: "UX Design dan Demo",
    use_5_d: "Buat persona bisnis untuk prototipe dan presentasi tanpa mengekspos data nyata.",
    use_6_t: "Migrasi ke CNPJ Alfanumerik",
    use_6_d: "Buat CNPJ alfanumerik untuk menguji apakah sistem lama telah diperbarui dengan benar.",
    use_7_t: "Uji Kompatibilitas antar Format",
    use_7_d: "Buat batch dari kedua jenis untuk memastikan laporan dan integrasi menangani kedua format secara konsisten.",

    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Pilih format",
    step_1_desc: "Pilih antara CNPJ Legacy (numerik) atau CNPJ Alfanumerik (format baru). Saat membuka halaman, CNPJ legacy sudah dibuat secara otomatis.",
    step_2_title: "Buat satu atau beberapa",
    step_2_desc: "Klik \"Buat CNPJ\" untuk satu nomor. Untuk batch, aktifkan \"Buat Beberapa CNPJ\" dan gunakan \"Salin Semua\".",
    step_3_title: "Pilih format output",
    step_3_desc: "Aktifkan \"Tanpa tanda baca\" untuk menghapus titik, garis miring, dan tanda hubung — ideal untuk database, JSON, dan API.",

    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah CNPJ yang dihasilkan nyata?",
    faq_1_a: "Tidak. CNPJ yang dihasilkan bersifat fiktif dan tidak terdaftar. Mereka lulus validasi matematis, tetapi tidak memiliki validitas hukum. Gunakan secara eksklusif untuk pengujian perangkat lunak.",
    faq_2_q: "Apakah legal menggunakan generator CNPJ ini?",
    faq_2_a: "Ya, untuk pengujian perangkat lunak, tujuan pendidikan, dan demonstrasi teknis. Menggunakan CNPJ fiktif untuk pendaftaran resmi atau penipuan adalah tindak pidana menurut KUHP Brasil (Pasal 299).",
    faq_3_q: "Apa itu CNPJ alfanumerik dan apa yang berubah?",
    faq_3_a: "CNPJ alfanumerik adalah format baru registrasi perusahaan Brasil, direncanakan untuk Juli 2026. Dua belas karakter pertama (basis dan cabang) akan menerima huruf A–Z selain digit 0–9. Hanya dua digit verifikasi yang tetap numerik, dan algoritma modulo 11 tidak berubah.",
    faq_4_q: "Mulai kapan CNPJ baru berlaku?",
    faq_4_a: "CNPJ alfanumerik baru direncanakan untuk Juli 2026. CNPJ legacy yang sudah diterbitkan akan tetap berlaku selamanya. Sistem harus mempersiapkan diri untuk memvalidasi kedua format.",
    faq_5_q: "Apakah CNPJ legacy tetap berlaku?",
    faq_5_a: "Ya, semua CNPJ yang diterbitkan dalam format numerik legacy tetap sepenuhnya berlaku. Sistem harus menerima dan memvalidasi kedua format secara bersamaan.",
    faq_6_q: "Bagaimana cara kerja algoritma validasi CNPJ?",
    faq_6_a: "CNPJ memiliki 2 digit verifikasi yang dihitung dari 12 karakter pertama menggunakan jumlah berbobot dengan modulo 11 dua kali. Bobot untuk perhitungan pertama adalah 5,4,3,2,9,8,7,6,5,4,3,2 dan untuk yang kedua 6,5,4,3,2,9,8,7,6,5,4,3,2. Untuk CNPJ alfanumerik, huruf dikonversi menggunakan kode ASCII dikurangi 48 (A=17 hingga Z=42) sebelum perhitungan yang sama. Jika sisa pembagian kurang dari 2, digit verifikasi adalah 0; jika tidak, 11 dikurangi sisa. Receita Federal menyarankan untuk menghindari huruf I, O, Q, dan F.",

    see1: "Generator CPF",
    see2: "Huruf Berbeda",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir"
  },
  de: {
    pageTitle: "Brasilianischer CNPJ-Generator — Legacy und Alphanumerisch | Kostenlos",
    title: "Brasilianischer CNPJ-Generator",
    meta: "Generieren Sie gültige CNPJs im Legacy-Format (numerisch) oder im neuen alphanumerischen Format, geplant für Juli 2026. Prüfziffern nach dem offiziellen Algorithmus. Kostenlos, ohne Registrierung.",

    type_label: "Format",
    type_legacy: "Numerisches Format",
    type_alpha: "Alphanumerisches Format (neu)",
    type_legacy_short: "Numérico",
    type_alpha_short: "Alphanumerisch",

    num: "Ohne Satzzeichen",
    multiple_label: "Mehrere CNPJs generieren",
    bt: "CNPJ generieren",
    bt_multiple: "CNPJs generieren",
    cnpj_label: "Generierter CNPJ",
    quantity: "Anzahl",
    generated_cnpjs: "Generierte CNPJs ({count})",
    copy_all: "Alle kopieren",
    placeholder: "Klicken Sie auf CNPJ generieren, um eine Nummer zu erstellen",
    warning: "Die generierten Nummern sind fiktiv und ausschließlich für Testzwecke bestimmt.",

    d1: "Kostenloser Online-CNPJ-Generator für Entwickler, Tester und Programmierstudenten. Unterstützt das Legacy-Format — 14 numerische Stellen mit Prüfziffern nach Modulo-11 — und das neue alphanumerische CNPJ, geplant für Juli 2026. Alle generierten CNPJs sind mathematisch korrekt. Der Prozess läuft vollständig im Browser ab, ohne Registrierung.",

    features_title: "Funktionen",
    f_1: "Generierung von Legacy-CNPJ (numerisch) und alphanumerisch (neues Format)",
    f_2: "Batches mit bis zu 100 eindeutigen CNPJs auf einmal",
    f_3: "Ausgabe mit oder ohne Satzzeichen",
    f_4: "Prüfziffern berechnet nach dem offiziellen Modulo-11-Algorithmus",
    f_5: "Vergleichstabelle und vollständige Erklärung des neuen alphanumerischen CNPJ",

    how_title: "Wie der CNPJ-Algorithmus funktioniert — Legacy und Alphanumerisch",
    how_desc: "Im Legacy-CNPJ sind die 14 Stellen aufgeteilt in Basis (8), Filiale (4 — 0001 für den Hauptsitz) und Prüfziffern (2), berechnet durch gewichtete Summe mit Modulo-11 zweimal: Jedes Zeichen wird mit einem bestimmten Gewicht multipliziert, die Ergebnisse werden addiert, durch 11 geteilt und der Rest bestimmt die Prüfziffer (0, wenn der Rest kleiner als 2 ist, andernfalls 11 minus der Rest). Im alphanumerischen CNPJ ist das Verfahren identisch, aber die ersten zwölf Zeichen (Basis und Filiale) können Buchstaben A–Z enthalten — der Wert jedes Buchstabens ist sein ASCII-Code minus 48 (A=17… Z=42). Die Prüfziffern bleiben immer numerisch (0–9). Die Receita Federal empfiehlt, die Buchstaben I, O, Q und F zu vermeiden, um visuelle Verwechslungen und Berechnungsstörungen zu verhindern; dieser Generator schließt sie bereits aus.",

    diff_title: "Legacy-CNPJ vs. Alphanumerischer CNPJ — Was ist der Unterschied?",
    diff_desc: "Der brasilianische CNPJ hat eine bedeutende strukturelle Aktualisierung erhalten. Das Legacy-Format verwendet ausschließlich Ziffern auf seinen 14 Zeichen, mit ca. 100 Millionen eindeutigen Basen. Das neue alphanumerische Format, geplant für Juli 2026, behält die 14 Zeichen bei, aber die ersten zwölf (Basis und Filiale) werden Buchstaben A–Z zusätzlich zu Ziffern akzeptieren, was die Kapazität erheblich erhöht. Nur die zwei Prüfziffern bleiben numerisch, und der Modulo-11-Algorithmus ändert sich nicht.",

    use_cases_title: "Anwendungsfälle",
    use_cases_intro: "Die häufigsten praktischen Anwendungen des CNPJ-Generators im Entwicklungs- und QA-Workflow sind:",
    use_1_t: "Formular- und UI-Validierung",
    use_1_d: "Testen Sie CNPJ-Felder, Masken und Validierungslogik. Mit dem alphanumerischen Format prüfen Sie, ob die UI Buchstaben korrekt akzeptiert.",
    use_2_t: "Steuersysteme und NF-e",
    use_2_d: "Validieren Sie Rechnungsausstellungsabläufe und Integrationen, indem Sie beide Formate testen.",
    use_3_t: "Datenbanken und Staging-Umgebungen",
    use_3_d: "Füllen Sie Testumgebungen mit realistischen Unternehmensdaten ohne echte Informationen preiszugeben.",
    use_4_t: "API-Integration",
    use_4_d: "Führen Sie Integrationstests mit externen Diensten durch, die das CNPJ-Format validieren.",
    use_5_t: "UX Design und Demos",
    use_5_d: "Erstellen Sie Geschäftspersonas für Prototypen und Präsentationen ohne echte Daten preiszugeben.",
    use_6_t: "Migration zum alphanumerischen CNPJ",
    use_6_d: "Generieren Sie alphanumerische CNPJs, um zu testen, ob Legacy-Systeme korrekt aktualisiert wurden.",
    use_7_t: "Formatübergreifende Kompatibilitätstests",
    use_7_d: "Generieren Sie Batches beider Typen, um sicherzustellen, dass Berichte und Integrationen beide Formate konsistent verarbeiten.",

    how_to_use_title: "Verwendung",
    step_1_title: "Format wählen",
    step_1_desc: "Wählen Sie Legacy-CNPJ (numerisch) oder alphanumerischen CNPJ (neues Format). Beim Öffnen der Seite wird automatisch ein Legacy-CNPJ generiert.",
    step_2_title: "Einen oder mehrere generieren",
    step_2_desc: "Klicken Sie auf \"CNPJ generieren\" für eine einzelne Nummer. Für Batches aktivieren Sie \"Mehrere CNPJs generieren\" und verwenden \"Alle kopieren\".",
    step_3_title: "Ausgabeformat wählen",
    step_3_desc: "Aktivieren Sie \"Ohne Satzzeichen\", um Punkte, Schrägstrich und Bindestrich zu entfernen — ideal für Datenbanken, JSON und APIs.",

    faq_title: "Fragen & Antworten",
    faq_1_q: "Ist der generierte CNPJ echt?",
    faq_1_a: "Nein. Die generierten CNPJs sind fiktiv und nicht registriert. Sie bestehen die mathematische Prüfziffervalidierung, haben aber keine rechtliche Gültigkeit. Ausschließlich für Softwaretests verwenden.",
    faq_2_q: "Ist es legal, diesen CNPJ-Generator zu verwenden?",
    faq_2_a: "Ja, für Softwaretests, Bildungszwecke und technische Demonstrationen. Die Verwendung fiktiver CNPJs für offizielle Registrierungen oder Betrug ist nach dem brasilianischen Strafgesetzbuch (Art. 299) eine Straftat.",
    faq_3_q: "Was ist der alphanumerische CNPJ und was hat sich geändert?",
    faq_3_a: "Der alphanumerische CNPJ ist das neue Format des brasilianischen Unternehmensregisters, geplant für Juli 2026. Die ersten zwölf Zeichen (Basis und Filiale) werden Buchstaben A–Z zusätzlich zu den Ziffern 0–9 akzeptieren. Nur die zwei Prüfziffern bleiben numerisch, und der Modulo-11-Algorithmus ändert sich nicht.",
    faq_4_q: "Ab wann gilt der neue CNPJ?",
    faq_4_a: "Der neue alphanumerische CNPJ ist für Juli 2026 geplant. Bereits ausgestellte Legacy-CNPJs werden unbegrenzt gültig bleiben. Systeme müssen sich darauf vorbereiten, beide Formate zu validieren.",
    faq_5_q: "Bleiben Legacy-CNPJs gültig?",
    faq_5_a: "Ja, alle im numerischen Legacy-Format ausgestellten CNPJs bleiben vollständig gültig. Systeme müssen beide Formate gleichzeitig akzeptieren und validieren.",
    faq_6_q: "Wie funktioniert der CNPJ-Validierungsalgorithmus?",
    faq_6_a: "Der CNPJ hat 2 Prüfziffern, die aus den ersten 12 Zeichen durch gewichtete Summe mit Modulo-11 zweimal berechnet werden. Die Gewichte für die erste Berechnung sind 5,4,3,2,9,8,7,6,5,4,3,2 und für die zweite 6,5,4,3,2,9,8,7,6,5,4,3,2. Für alphanumerische CNPJs werden Buchstaben über ihren ASCII-Code minus 48 umgewandelt (A=17 bis Z=42) vor derselben Berechnung. Wenn der Rest der Division kleiner als 2 ist, ist die Prüfziffer 0; andernfalls ist sie 11 minus der Rest. Es wird empfohlen, die Buchstaben I, O, Q und F zu vermeiden.",

    see1: "CPF-Generator",
    see2: "Schöne Schriften",
    see3: "Kreditkarten-Generator",
    see4: "Geburtsdatum-Generator"
  },
  nl: {
    pageTitle: "Braziliaanse CNPJ-generator — Legacy en Alfanumeriek | Gratis",
    title: "Braziliaanse CNPJ-generator",
    meta: "Genereer geldige CNPJ in legacy (numeriek) of het nieuwe alfanumerieke formaat, gepland voor juli 2026. Controlecijfers berekend via het officiële algoritme. Gratis, zonder registratie.",

    type_label: "Formaat",
    type_legacy: "Numeriek formaat",
    type_alpha: "Alfanumeriek formaat (nieuw)",
    type_legacy_short: "Numérico",
    type_alpha_short: "Alfanumeriek",

    num: "Zonder leestekens",
    multiple_label: "Genereer meerdere CNPJ's",
    bt: "Genereer CNPJ",
    bt_multiple: "Genereer CNPJ's",
    cnpj_label: "Gegenereerde CNPJ",
    quantity: "Aantal",
    generated_cnpjs: "Gegenereerde CNPJ's ({count})",
    copy_all: "Alles kopiëren",
    placeholder: "Klik op Genereer CNPJ om een nummer aan te maken",
    warning: "De gegenereerde nummers zijn fictief en uitsluitend bedoeld voor testdoeleinden.",

    d1: "Gratis online CNPJ-generator voor ontwikkelaars, testers en programmeerstudenten. Ondersteunt het legacy-formaat — 14 numerieke cijfers met controlecijfers berekend via modulo 11 — en de nieuwe alfanumerieke CNPJ, gepland voor juli 2026. Alle gegenereerde CNPJ's zijn wiskundig geldig. Het proces verloopt volledig in de browser, zonder registratie.",

    features_title: "Functionaliteiten",
    f_1: "Generatie van legacy-CNPJ (numeriek) en alfanumeriek (nieuw formaat)",
    f_2: "Batches tot 100 unieke CNPJ's tegelijk",
    f_3: "Uitvoer met of zonder leestekens",
    f_4: "Controlecijfers berekend met het officiële modulo 11-algoritme",
    f_5: "Vergelijkingstabel en uitleg van de nieuwe alfanumerieke CNPJ",

    how_title: "Hoe het CNPJ-algoritme werkt — Legacy en Alfanumeriek",
    how_desc: "In de legacy CNPJ zijn de 14 cijfers verdeeld in basis (8), vestiging (4 — 0001 voor hoofdkantoor) en controlecijfers (2), berekend via gewogen som met modulo 11 twee keer: elk karakter wordt vermenigvuldigd met een specifiek gewicht, de resultaten worden opgeteld, gedeeld door 11, en het restant bepaalt het controlecijfer (0 als het restant kleiner is dan 2, anders 11 min het restant). De alfanumerieke CNPJ volgt dezelfde procedure, maar de eerste twaalf tekens (basis en vestiging) kunnen letters A–Z bevatten — de waarde van elke letter is zijn ASCII-code min 48 (A=17… Z=42). De controlecijfers zijn altijd numeriek (0–9). De Receita Federal raadt aan om de letters I, O, Q en F te vermijden om visuele verwarring en berekeningsbotsingen te voorkomen; deze generator sluit ze al uit.",

    diff_title: "Legacy CNPJ vs. Alfanumerieke CNPJ — Wat is het Verschil?",
    diff_desc: "De Braziliaanse CNPJ heeft een belangrijke structurele update ondergaan. Het legacy-formaat gebruikt uitsluitend cijfers op zijn 14 tekens, met een capaciteit van ongeveer 100 miljoen unieke bases. Het nieuwe alfanumerieke formaat, gepland voor juli 2026, behoudt de 14 tekens maar de eerste twaalf (basis en vestiging) zullen letters A–Z naast cijfers accepteren, waardoor de capaciteit aanzienlijk toeneemt. Alleen de twee controlecijfers blijven numeriek, en het modulo 11-algoritme verandert niet.",

    use_cases_title: "Gebruiksscenario's",
    use_cases_intro: "De meest voorkomende praktische toepassingen van de CNPJ-generator in de ontwikkelings- en QA-workflow zijn:",
    use_1_t: "Formulier- en UI-validatie",
    use_1_d: "Test CNPJ-velden, maskers en validatielogica. Met het alfanumerieke formaat verifieer je of de UI letters correct accepteert.",
    use_2_t: "Fiscale systemen en NF-e",
    use_2_d: "Valideer facturatiestromen en integraties, waarbij beide formaten worden getest.",
    use_3_t: "Databases en stagingomgevingen",
    use_3_d: "Vul testomgevingen met realistische bedrijfsgegevens zonder echte informatie bloot te stellen.",
    use_4_t: "API-integratie",
    use_4_d: "Voer integratietests uit met externe services die het CNPJ-formaat valideren.",
    use_5_t: "UX Design en Demo's",
    use_5_d: "Maak zakelijke persona's voor prototypes en presentaties zonder echte gegevens bloot te stellen.",
    use_6_t: "Migratie naar alfanumerieke CNPJ",
    use_6_d: "Genereer alfanumerieke CNPJ's om te testen of legacy-systemen correct zijn bijgewerkt.",
    use_7_t: "Compatibiliteitstests tussen formaten",
    use_7_d: "Genereer batches van beide typen om te garanderen dat rapporten en integraties beide formaten consistent verwerken.",

    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Formaat kiezen",
    step_1_desc: "Selecteer Legacy CNPJ (numeriek) of alfanumerieke CNPJ (nieuw formaat). Bij het openen van de pagina wordt automatisch een legacy CNPJ gegenereerd.",
    step_2_title: "Één of meerdere genereren",
    step_2_desc: "Klik op \"Genereer CNPJ\" voor één nummer. Voor batches schakel \"Genereer meerdere CNPJ's\" in en gebruik \"Alles kopiëren\".",
    step_3_title: "Uitvoerformaat kiezen",
    step_3_desc: "Schakel \"Zonder leestekens\" in om punten, schuine streep en streepje te verwijderen — ideaal voor databases, JSON en API's.",

    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Is de gegenereerde CNPJ echt?",
    faq_1_a: "Nee. De gegenereerde CNPJ's zijn fictief en niet geregistreerd. Ze slagen voor de wiskundige controlecijfervalidatie, maar hebben geen wettelijke geldigheid. Uitsluitend gebruiken voor softwaretests.",
    faq_2_q: "Is het legaal om deze CNPJ-generator te gebruiken?",
    faq_2_a: "Ja, voor softwaretests, educatieve doeleinden en technische demonstraties. Het gebruik van fictieve CNPJ's voor officiële registraties of fraude is een misdrijf volgens het Braziliaanse Wetboek van Strafrecht (Art. 299).",
    faq_3_q: "Wat is de alfanumerieke CNPJ en wat is er veranderd?",
    faq_3_a: "De alfanumerieke CNPJ is het nieuwe formaat van het Braziliaanse bedrijfsregister, gepland voor juli 2026. De eerste twaalf tekens (basis en vestiging) zullen letters A–Z naast de cijfers 0–9 accepteren. Alleen de twee controlecijfers blijven numeriek, en het modulo 11-algoritme verandert niet.",
    faq_4_q: "Vanaf wanneer is de nieuwe CNPJ geldig?",
    faq_4_a: "De nieuwe alfanumerieke CNPJ is gepland voor juli 2026. Al uitgegeven legacy-CNPJ's zullen onbeperkt geldig blijven. Systemen moeten zich voorbereiden op het valideren van beide formaten.",
    faq_5_q: "Blijven legacy CNPJ's geldig?",
    faq_5_a: "Ja, alle CNPJ's die zijn uitgegeven in het numerieke legacy-formaat blijven volledig geldig. Systemen moeten beide formaten tegelijkertijd accepteren en valideren.",
    faq_6_q: "Hoe werkt het CNPJ-validatiealgoritme?",
    faq_6_a: "De CNPJ heeft 2 controlecijfers berekend op basis van de eerste 12 tekens met gewogen som en modulo 11 twee keer toegepast. De gewichten voor de eerste berekening zijn 5,4,3,2,9,8,7,6,5,4,3,2 en voor de tweede 6,5,4,3,2,9,8,7,6,5,4,3,2. Voor alfanumerieke CNPJ's worden letters omgezet via hun ASCII-code min 48 (A=17 tot Z=42) voor dezelfde berekening. Als het restant van de deling kleiner is dan 2, is het controlecijfer 0; anders is het 11 min het restant. Het wordt aanbevolen om de letters I, O, Q en F te vermijden.",

    see1: "CPF-generator",
    see2: "Mooie letters",
    see3: "Creditcard-generator",
    see4: "Geboortedatum-generator"
  },
  ru: {
    pageTitle: "Генератор CNPJ — тестовые числовые и альфа-цифровые номера | Бесплатно",
    title: "Генератор CNPJ",
    meta: "Бесплатный генератор валидных номеров CNPJ для тестирования. Поддерживает классический числовой формат и новый альфа-цифровой формат (внедряемый с июля 2026 года). Расчет контрольных цифр по модулю 11. Без регистрации.",
    type_label: "Формат",
    type_legacy: "Числовой формат",
    type_alpha: "Альфа-цифровой формат (новый)",
    type_legacy_short: "Числовой",
    type_alpha_short: "Альфа-цифровой",
    num: "Без пунктуации",
    multiple_label: "Генерировать несколько CNPJ",
    bt: "Сгенерировать CNPJ",
    bt_multiple: "Сгенерировать CNPJ",
    cnpj_label: "Сгенерированный CNPJ",
    quantity: "Количество",
    generated_cnpjs: "Сгенерированные CNPJ ({count})",
    copy_all: "Копировать все",
    placeholder: "Нажмите «Сгенерировать CNPJ», чтобы создать номер",
    warning: "Сгенерированные номера являются вымышленными и предназначены исключительно для тестирования.",
    d1: "Бесплатный онлайн-генератор CNPJ для разработчиков, специалистов по тестированию (QA) и студентов-программистов. Поддерживает классический формат (14 цифр с расчетом контрольных знаков по модулю 11) и новый альфа-цифровой CNPJ (планируемый к запуску с июля 2026 года), в котором первые 12 позиций (регистрационный корень и порядковый номер) могут содержать как цифры, так и латинские буквы от A до Z. Последние два символа — контрольные цифры — всегда остаются числовыми. Все созданные номера математически валидны и успешно проходят любую валидацию форм или бизнес-логики. Весь процесс выполняется непосредственно в браузере, без регистрации и без связи с реальными организациями.",
    features_title: "Возможности",
    f_1: "Генерация классического (числового) и нового альфа-цифрового CNPJ",
    f_2: "Списки до 100 уникальных CNPJ за один раз",
    f_3: "Формат с пунктуацией или без",
    f_4: "Расчет контрольных знаков по официальному алгоритму модуля 11",
    f_5: "Сравнительная таблица и полное описание нового альфа-цифрового формата",
    how_title: "Как работает алгоритм CNPJ — числовой и альфа-цифровой",
    how_desc: "В классическом CNPJ 14 символов делятся на корень (8 цифр), номер филиала (4 цифры — например, 0001 для главной компании) и две контрольные цифры в конце. Контрольные цифры вычисляются с помощью взвешенной суммы с применением модуля 11 дважды. Каждый символ умножается на определенный вес, результаты суммируются и делятся на 11. Остаток от деления определяет значение контрольной цифры (0, если остаток меньше 2, иначе 11 минус остаток). В альфа-цифровом CNPJ процедура вычислений полностью аналогична, но первые 12 позиций могут содержать буквы латинского алфавита A–Z. При расчете каждому знаку присваивается значение по таблице ASCII минус 48 (цифры сохраняют значения, а буквы преобразуются: A=17, B=18 и т. д. до Z=42). Итоговые контрольные цифры всегда остаются числовыми (0–9). Налоговая служба Бразилии рекомендует избегать букв I, O, Q и F во избежание визуальной путаницы с цифрами и коллизий при вычислении — наш генератор исключает эти символы по умолчанию.",
    diff_title: "Числовой CNPJ против альфа-цифрового — в чем разница?",
    diff_desc: "Структура бразильских корпоративных номеров CNPJ претерпела важное обновление. Классический формат использует только цифры для всех 14 знаков, и свободный диапазон номеров близок к своему исчерпанию. Новый альфа-цифровой формат, внедрение которого запланировано на июль 2026 года, сохраняет общую длину в 14 символов, но позволяет использовать буквы латинского алфавита от A до Z в первых 12 позициях. Это колоссально увеличивает емкость реестра для новых регистраций. Контрольными остаются только последние 2 знака, и они по-прежнему числовые, а алгоритм расчета по модулю 11 не претерпел изменений, что максимально упрощает адаптацию существующих информационных систем.",
    use_cases_title: "Варианты использования",
    use_cases_intro: "Наиболее распространенные сценарии практического применения генератора CNPJ в процессах разработки и тестирования (QA):",
    use_1_t: "Валидация форм и интерфейсов",
    use_1_d: "Проверяйте маски ввода и логику валидации в полях CNPJ. С помощью поддержки нового формата убедитесь, что ваш интерфейс корректно принимает буквы в первых позициях.",
    use_2_t: "Фискальные системы и расчеты",
    use_2_d: "Тестируйте интеграцию и логику выписывания электронных счетов, отправляя в систему как классические, так и альфа-цифровые номера.",
    use_3_t: "Базы данных и среды стейджинга",
    use_3_d: "Заполняйте тестовые или демонстрационные базы данных реалистичной информацией о компаниях без раскрытия конфиденциальных сведений реального бизнеса.",
    use_4_t: "Интеграция с API",
    use_4_d: "Проводите интеграционные тесты с внешними сервисами, которые валидируют CNPJ, проверяя поддержку обеих версий формата.",
    use_5_t: "UX-проектирование и демонстрации",
    use_5_d: "Создавайте профили юридических лиц для прототипов в Figma, Adobe XD или презентаций для клиентов, не используя реальные реквизиты.",
    use_6_t: "Миграция на альфа-цифровой стандарт",
    use_6_d: "Генерируйте новые альфа-цифровые номера для полноценного тестирования обновленных систем: полей ввода, типов и размеров колонок в БД, API-валидаций и бизнес-правил.",
    use_7_t: "Тестирование совместимости форматов",
    use_7_d: "Создавайте смешанные списки номеров, чтобы убедиться, что аналитические отчеты и интеграции корректно обрабатывают оба типа во время переходного периода.",
    how_to_use_title: "Как использовать",
    step_1_title: "Выбор формата",
    step_1_desc: "Выберите «Числовой формат» (классический, 14 цифр) or «Альфа-цифровой формат» (новый, с буквами в первых позициях). По умолчанию при загрузке страницы классический номер генерируется автоматически.",
    step_2_title: "Генерация одного или списка",
    step_2_desc: "Нажмите «Сгенерировать CNPJ» для получения одного номера (готового для копирования в один клик). Для создания списков активируйте «Генерировать несколько CNPJ», укажите нужное количество (от 2 до 100) и используйте «Копировать все».",
    step_3_title: "Настройка вывода",
    step_3_desc: "Активируйте опцию «Без пунктуации», чтобы убрать точки, косую черту и дефис — это незаменимо для баз данных, JSON-пакетов и вызовов API.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Является ли сгенерированный CNPJ реальным?",
    faq_1_a: "Нет. Все сгенерированные CNPJ являются вымышленными и не зарегистрированы в Федеральной налоговой службе Бразилии (Receita Federal). Они проходят математическую валидацию контрольных цифр, но не имеют юридической силы и предназначены исключительно для тестов.",
    faq_2_q: "Законно ли использовать этот генератор?",
    faq_2_a: "Да, использование инструмента абсолютно законно в целях тестирования ПО, обучения и демонстраций. Использование вымышленных номеров для официальных регистраций, махинаций или получения незаконной выгоды является уголовным преступлением в соответствии с законодательством Бразилии.",
    faq_3_q: "Что такое альфа-цифровой CNPJ и что изменилось?",
    faq_3_a: "Альфа-цифровой CNPJ — это новый формат бразильского реестра юридических лиц, вводимый с июля 2026 года. Первые 12 позиций номера (корень и филиал) теперь могут содержать как цифры, так и буквы. Две контрольные цифры остаются числовыми, а алгоритм расчета по модулю 11 не поменялся — буквы просто конвертируются по таблице ASCII минус 48 (A=17, Z=42).",
    faq_4_q: "С какого момента действует новый CNPJ?",
    faq_4_a: "Внедрение нового формата запланировано на июль 2026 года. Переход будет постепенным: уже выданные числовые CNPJ продолжат действовать бессрочно, а новые компании начнут получать альфа-цифровой формат по мере исчерпания числовых запасов. Информационные системы должны поддерживать обработку обоих стандартов.",
    faq_5_q: "Останутся ли старые CNPJ действительными?",
    faq_5_a: "Да. Все CNPJ в традиционном числовом формате остаются полностью действительными и не требуют замены. Переход на альфа-цифровой формат носит расширяющий характер. Системы должны без проблем принимать и валидировать оба формата одновременно.",
    faq_6_q: "Как именно работает алгоритм валидации CNPJ?",
    faq_6_a: "Два контрольных знака вычисляются на основе первых 12 знаков с помощью взвешенной суммы и модуля 11, применяемых дважды. Веса для первого расчета: 5,4,3,2,9,8,7,6,5,4,3,2; для второго: 6,5,4,3,2,9,8,7,6,5,4,3,2. При альфа-цифровом формате буквы переводятся в числа перед расчетом по формуле ASCII минус 48. Если остаток от деления на 11 меньше 2, то контрольный знак равен 0, иначе он равен 11 минус остаток. Во избежание путаницы буквы I, O, Q и F не генерируются.",
    see1: "Генератор CPF",
    see2: "Красивые шрифты",
    see3: "Генератор кредитных карт",
    see4: "Генератор даты рождения"
  }
}
</i18n>