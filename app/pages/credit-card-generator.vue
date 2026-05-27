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
  ]
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
    de: '/kreditkarten-generator',
    nl: '/creditcard-generator',
    ru: '/generator-kreditnyh-kart',
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
      </div>

      <!-- Right Column: Card Visual -->
      <div class="flex items-center justify-center">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <!-- Generated Card Wrapper -->
          <div v-if="state.cardNumber" class="w-full sm:max-w-sm flex flex-col items-center gap-4">
            <!-- Card Visual -->
            <div
              class="w-full rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl border border-white/10"
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

            <!-- Warning below the card -->
            <p class="text-xs sm:text-sm text-base-content/50 italic px-1 text-center">
              {{ t('warning') }}
            </p>
          </div>
        </Transition>

        <!-- Placeholder -->
        <div v-if="!state.cardNumber" class="text-center opacity-70">
          <Icon name="heroicons:credit-card" class="w-16 h-16 mx-auto mb-2" />
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

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

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:book-open-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed mb-3">{{ t('how_desc') }}</p>
          <ul class="list-disc pl-5 space-y-1 text-base-content/80 mb-3">
            <li>{{ t('how_li_1') }}</li>
            <li>{{ t('how_li_2') }}</li>
            <li>{{ t('how_li_3') }}</li>
            <li>{{ t('how_li_4') }}</li>
            <li>{{ t('how_li_5') }}</li>
          </ul>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_outro') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:calculator-20-solid" class="w-6 h-6 text-primary" />
            {{ t('luhn_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed mb-3">{{ t('luhn_intro') }}</p>
          <p class="text-base-content/80 mb-2">{{ t('luhn_used_intro') }}</p>
          <ul class="list-disc pl-5 space-y-1 text-base-content/80 mb-4">
            <li>{{ t('luhn_used_1') }}</li>
            <li>{{ t('luhn_used_2') }}</li>
            <li>{{ t('luhn_used_3') }}</li>
            <li>{{ t('luhn_used_4') }}</li>
          </ul>
          <p class="text-base-content/80 mb-2">{{ t('luhn_steps_intro') }}</p>
          <ol class="list-decimal pl-5 space-y-2 text-base-content/80 mb-4">
            <li>{{ t('luhn_s1') }}</li>
            <li>{{ t('luhn_s2') }}</li>
            <li>{{ t('luhn_s3') }}</li>
            <li>{{ t('luhn_s4') }}</li>
          </ol>
          <p class="text-base-content/70 text-sm bg-base-200/50 rounded-lg p-3 mb-3">{{ t('luhn_example') }}</p>
          <p class="text-base-content/80 leading-relaxed">{{ t('luhn_outro') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:identification-20-solid" class="w-6 h-6 text-primary" />
            {{ t('bin_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed mb-3">{{ t('bin_intro') }}</p>
          <p class="text-base-content/80 mb-2">{{ t('bin_identifies_intro') }}</p>
          <ul class="list-disc pl-5 space-y-1 text-base-content/80 mb-4">
            <li>{{ t('bin_id_1') }}</li>
            <li>{{ t('bin_id_2') }}</li>
            <li>{{ t('bin_id_3') }}</li>
            <li>{{ t('bin_id_4') }}</li>
          </ul>
          <p class="text-base-content/80 leading-relaxed">{{ t('bin_outro') }}</p>
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
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:shield-check-20-solid" class="w-6 h-6 text-primary" />
            {{ t('legal_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed mb-4">{{ t('legal_intro') }}</p>
          <div class="grid sm:grid-cols-2 gap-4 mb-4">
            <div class="bg-success/10 border border-success/20 rounded-xl p-4">
              <p class="font-semibold text-success mb-2">{{ t('legal_allowed_title') }}</p>
              <ul class="space-y-1 text-sm text-base-content/80">
                <li class="flex items-start gap-2"><Icon name="heroicons:check-20-solid" class="w-4 h-4 text-success shrink-0 mt-0.5" />{{ t('legal_allowed_1') }}</li>
                <li class="flex items-start gap-2"><Icon name="heroicons:check-20-solid" class="w-4 h-4 text-success shrink-0 mt-0.5" />{{ t('legal_allowed_2') }}</li>
                <li class="flex items-start gap-2"><Icon name="heroicons:check-20-solid" class="w-4 h-4 text-success shrink-0 mt-0.5" />{{ t('legal_allowed_3') }}</li>
                <li class="flex items-start gap-2"><Icon name="heroicons:check-20-solid" class="w-4 h-4 text-success shrink-0 mt-0.5" />{{ t('legal_allowed_4') }}</li>
              </ul>
            </div>
            <div class="bg-error/10 border border-error/20 rounded-xl p-4">
              <p class="font-semibold text-error mb-2">{{ t('legal_prohibited_title') }}</p>
              <ul class="space-y-1 text-sm text-base-content/80">
                <li class="flex items-start gap-2"><Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 text-error shrink-0 mt-0.5" />{{ t('legal_prohibited_1') }}</li>
                <li class="flex items-start gap-2"><Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 text-error shrink-0 mt-0.5" />{{ t('legal_prohibited_2') }}</li>
                <li class="flex items-start gap-2"><Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 text-error shrink-0 mt-0.5" />{{ t('legal_prohibited_3') }}</li>
              </ul>
            </div>
          </div>
          <p class="text-base-content/70 text-sm italic">{{ t('legal_outro') }}</p>
        </section>

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
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    pageTitle: "Gerador de Cartão de Crédito (Visa, Mastercard, Amex, ...) | Grátis",
    title: "Gerador de Cartão de Crédito",
    meta: "Gere números de cartão de crédito fictícios válidos para testes de software e QA. Suporta Visa, Mastercard, Amex e mais, com validação pelo Algoritmo de Luhn. Inclui nome, vencimento e CVV.",
    brands: "Bandeira",
    num: "Número do Cartão",
    name: "Titular",
    dt: "Vencimento",
    bt: "Gerar Cartão",
    placeholder: "Selecione uma bandeira e clique em Gerar",
    warning: "Os dados gerados são fictícios e destinados exclusivamente a testes.",
    d1: "Gere cartões de crédito fictícios completos (número, titular, validade e CVV) para testes de checkout, QA e integração com gateways de pagamento. Os números seguem estrutura real com prefixo BIN e verificação pelo algoritmo de Luhn, mas são totalmente fictícios e não funcionam em transações reais.",
    features_title: "Funcionalidades",
    f_1: "Suporte a mais de 15 bandeiras principais",
    f_2: "Inclui nome, vencimento e CVV para testes realistas",
    f_3: "Números válidos pelo Algoritmo de Luhn (MOD 10)",
    f_4: "Compatível com ambientes de sandbox e homologação",
    how_title: "Como Funciona o Gerador de Cartão de Crédito",
    how_desc: "Os números gerados seguem a estrutura real utilizada pela indústria de pagamentos. Cada cartão é composto por elementos que obedecem a padrões internacionais, incluindo:",
    how_li_1: "Identificação da bandeira pelo prefixo do número",
    how_li_2: "Prefixos BIN compatíveis com cada rede de cartões",
    how_li_3: "Tamanho correto do número por bandeira",
    how_li_4: "Cálculo e inserção do dígito verificador",
    how_li_5: "Validação pelo Algoritmo de Luhn (MOD 10)",
    how_outro: "Isso permite testar sistemas que exigem cartões aparentemente válidos sem expor informações financeiras legítimas.",
    luhn_title: "O Algoritmo de Luhn (MOD 10)",
    luhn_intro: "O Algoritmo de Luhn (ou 'mod 10') é uma regra matemática usada por todos os cartões de crédito para validar sua estrutura. Ele não verifica se um cartão existe de fato, apenas se o número segue o padrão esperado.",
    luhn_used_intro: "É amplamente utilizado por:",
    luhn_used_1: "Gateways de pagamento (Stripe, Adyen, PayPal)",
    luhn_used_2: "APIs financeiras e sistemas antifraude",
    luhn_used_3: "Formulários de checkout",
    luhn_used_4: "Plataformas bancárias digitais",
    luhn_steps_intro: "O cálculo é feito em quatro etapas:",
    luhn_s1: "Percorra os dígitos da direita para a esquerda e dobre cada segundo dígito",
    luhn_s2: "Se ao dobrar o resultado for ≥ 10, some os dois dígitos do produto (ex: 7×2=14 → 1+4=5)",
    luhn_s3: "Some todos os dígitos, dobrados e não dobrados",
    luhn_s4: "Se a soma total for um múltiplo de 10, o número é válido",
    luhn_example: "Exemplo: o número 4111 1111 1111 1111 (cartão Visa de teste amplamente utilizado) resulta em soma 30, sendo válido (30 ÷ 10 = 0 de resto). O último dígito '1' é o dígito verificador.",
    luhn_outro: "Esta ferramenta aplica essa rotina automaticamente ao gerar cada cartão, garantindo que ele passe no Luhn check de qualquer sistema de pagamento.",
    bin_title: "O que são BIN e IIN?",
    bin_intro: "BIN (Bank Identification Number) e IIN (Issuer Identification Number) são dois nomes para o mesmo conceito: os primeiros 4 a 6 dígitos do número de cartão, que identificam a instituição emissora e a rede de pagamento conforme o padrão ISO/IEC 7812.",
    bin_identifies_intro: "A partir desses dígitos, sistemas de pagamento identificam automaticamente:",
    bin_id_1: "A bandeira do cartão (Visa, Mastercard, Amex etc.)",
    bin_id_2: "O banco ou instituição emissora",
    bin_id_3: "O tipo de cartão (crédito, débito ou pré-pago)",
    bin_id_4: "O país de origem do emissor",
    bin_outro: "Esta ferramenta utiliza prefixos BIN reais para cada bandeira selecionada, garantindo que os cartões gerados sejam reconhecidos corretamente por formulários, máscaras e sistemas de detecção de bandeiras.",
    use_cases_title: "Principais Casos de Uso",
    use_cases_intro: "Esta ferramenta é ideal para diversas situações do dia a dia de desenvolvedores e profissionais de tecnologia:",
    use_1_t: "Testes de Checkout e Gateways",
    use_1_d: "Simule fluxos completos de pagamento sem processar uma transação real. Amplamente usado em integrações com Stripe, Adyen e PayPal.",
    use_2_t: "Desenvolvimento Frontend",
    use_2_d: "Valide máscaras de cartão, campos de formulário, comportamento de UI e lógica de detecção de bandeiras sem expor dados sensíveis.",
    use_3_t: "Automação de Testes",
    use_3_d: "Use cartões fictícios em scripts automatizados para validar formulários, fluxos de checkout e regras de negócio (com frameworks como Cypress, Playwright, Selenium, JUnit, Pytest, entre outros).",
    use_4_t: "Educação e Demonstrações",
    use_4_d: "Crie personas realistas com cartões válidos estruturalmente para apresentações, wireframes e provas de conceito.",
    use_5_t: "Validação de APIs de Pagamento",
    use_5_d: "Teste implementações de Luhn check, retornos de erro e integrações com APIs de pagamento sem manipular dados financeiros reais.",
    legal_title: "Uso Responsável e Avisos Legais",
    legal_intro: "Os números gerados não têm vínculo com nenhuma instituição financeira. Em ambientes de produção, qualquer tentativa de uso é automaticamente recusada pelo emissor, pois o número simplesmente não existe em nenhuma base de dados bancária.",
    legal_allowed_title: "Usos permitidos",
    legal_allowed_1: "Desenvolvimento e QA de software",
    legal_allowed_2: "Testes de integração com gateways em sandbox ou homologação",
    legal_allowed_3: "Demonstrações, wireframes e provas de conceito",
    legal_allowed_4: "Automação de testes e validação de formulários",
    legal_prohibited_title: "Usos proibidos",
    legal_prohibited_1: "Tentativas de pagamento ou transação real",
    legal_prohibited_2: "Qualquer forma de fraude ou estelionato",
    legal_prohibited_3: "Uso em sistemas de produção com dados reais",
    legal_outro: "Esta ferramenta é legal e segura. O uso indevido dos dados gerados para fins fraudulentos é crime previsto em lei.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Selecione a bandeira",
    step_1_desc: "Escolha a bandeira desejada no menu (Visa, Mastercard, Amex etc.).",
    step_2_title: "Gere o cartão",
    step_2_desc: "Clique em \"Gerar Cartão\". Todos os dados aparecem no cartão: número, titular, vencimento e CVV.",
    step_3_title: "Copie os dados",
    step_3_desc: "Clique no ícone de cópia ao lado de cada campo para copiá-lo individualmente.",
    brands_title: "Redes e Bandeiras Suportadas",
    brands_desc: "Este gerador suporta 17 redes de pagamento globais, com prefixos BIN específicos por bandeira conforme o padrão ISO/IEC 7812:",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Qual a diferença entre estes cartões e os cartões de teste oficiais dos gateways?",
    faq_1_a: "Gateways como Stripe, PayPal e Adyen fornecem cartões de teste próprios que simulam aprovações e recusas específicas dentro de seus ambientes. Os cartões desta ferramenta seguem a estrutura correta (BIN + Luhn) e são úteis para validar formulários e máscaras em qualquer sistema, mas não simulam respostas específicas de gateway.",
    faq_2_q: "O CVV e a data de validade são reais?",
    faq_2_a: "Não. O CVV e a data de validade são gerados aleatoriamente para fins de teste e não correspondem a nenhum cartão emitido por banco ou instituição financeira.",
    faq_3_q: "Para quais tipos de testes posso usar esta ferramenta?",
    faq_3_a: "Para testes unitários, de integração, E2E, de UI e de regressão. Os dados gerados são compatíveis com qualquer framework de automação.",
    faq_4_q: "É legal usar este gerador?",
    faq_4_a: "Sim. A ferramenta é legal e destinada exclusivamente a fins técnicos e educacionais. O uso indevido dos dados gerados para tentativas de fraude ou transações reais é ilegal.",
    see1: "Gerador de CPF",
    see2: "Gerador de CNPJ",
    see3: "Gerador de Data de Nascimento",
    see4: "Gerador de Senha"
  },
  en: {
    pageTitle: "Credit Card Generator — Fake Credit Card Numbers with CVV for Testing (Visa, Mastercard, Amex) | Free",
    title: "Credit Card Generator",
    meta: "Free credit card generator and fake credit card number tool for software testing, QA and Stripe sandbox. Generate test credit card numbers — Visa, Mastercard, Amex and more — with Luhn validation, name, expiry and CVV.",
    brands: "Card Brand",
    num: "Card Number",
    name: "Cardholder",
    dt: "Expiry",
    bt: "Generate Card",
    placeholder: "Select a brand and click Generate",
    warning: "Generated data is fictitious and intended exclusively for testing.",
    d1: "This free credit card generator creates complete fake credit cards — number, cardholder, expiry and CVV — for checkout testing, QA and integration with payment gateways. The numbers follow the real structure with BIN prefix and Luhn verification, but are entirely fictitious and do not work in real transactions.",
    features_title: "Features",
    f_1: "Supports 15+ major card networks",
    f_2: "Includes name, expiry date and CVV for realistic testing",
    f_3: "Luhn Algorithm (MOD 10) compliant numbers",
    f_4: "Compatible with sandbox and staging environments",
    how_title: "How the Credit Card Generator Works",
    how_desc: "Generated numbers follow the real structure used by the payment industry. Each card is composed of elements that comply with international standards, including:",
    how_li_1: "Card brand identification by number prefix",
    how_li_2: "Compatible BIN prefixes for each card network",
    how_li_3: "Correct number length per brand",
    how_li_4: "Check digit calculation and insertion",
    how_li_5: "Luhn Algorithm (MOD 10) validation",
    how_outro: "This allows testing systems that require apparently valid cards without exposing real financial data.",
    luhn_title: "The Luhn Algorithm (MOD 10)",
    luhn_intro: "The Luhn Algorithm (or 'mod 10') is a mathematical rule used by all credit cards to validate their structure. It does not verify whether a card actually exists, only whether the number follows the expected pattern.",
    luhn_used_intro: "It is widely used by:",
    luhn_used_1: "Payment gateways (Stripe, Adyen, PayPal)",
    luhn_used_2: "Financial APIs and anti-fraud systems",
    luhn_used_3: "Checkout forms",
    luhn_used_4: "Digital banking platforms",
    luhn_steps_intro: "The calculation is done in four steps:",
    luhn_s1: "Traverse the digits from right to left and double every second digit",
    luhn_s2: "If doubling results in ≥ 10, add the two digits of the product (e.g. 7×2=14 → 1+4=5)",
    luhn_s3: "Sum all digits, both doubled and non-doubled",
    luhn_s4: "If the total sum is a multiple of 10, the number is valid",
    luhn_example: "Example: the number 4111 1111 1111 1111 (widely used Visa test card) results in a sum of 30, which is valid (30 ÷ 10 = remainder 0). The last digit '1' is the check digit.",
    luhn_outro: "This tool automatically applies this routine when generating each card, ensuring it passes the Luhn check in any payment system.",
    bin_title: "What are BIN and IIN?",
    bin_intro: "BIN (Bank Identification Number) and IIN (Issuer Identification Number) are two names for the same concept: the first 4 to 6 digits of a card number, which identify the issuing institution and payment network according to the ISO/IEC 7812 standard.",
    bin_identifies_intro: "From these digits, payment systems automatically identify:",
    bin_id_1: "The card brand (Visa, Mastercard, Amex etc.)",
    bin_id_2: "The issuing bank or institution",
    bin_id_3: "The card type (credit, debit or prepaid)",
    bin_id_4: "The country of origin of the issuer",
    bin_outro: "This tool uses real BIN prefixes for each selected brand, ensuring that generated cards are correctly recognized by forms, masks and brand detection systems.",
    use_cases_title: "Main Use Cases",
    use_cases_intro: "This tool is ideal for various everyday situations for developers and technology professionals:",
    use_1_t: "Checkout and Gateway Testing",
    use_1_d: "Simulate complete payment flows without processing a real transaction. Widely used in integrations with Stripe, Adyen and PayPal.",
    use_2_t: "Frontend Development",
    use_2_d: "Validate card masks, form fields, UI behaviour and brand detection logic without exposing sensitive data.",
    use_3_t: "Test Automation",
    use_3_d: "Use fictitious cards in automated scripts to validate forms, checkout flows and business rules (with frameworks such as Cypress, Playwright, Selenium, JUnit, Pytest, among others).",
    use_4_t: "Education and Demonstrations",
    use_4_d: "Create realistic personas with structurally valid cards for presentations, wireframes and proof of concept.",
    use_5_t: "Payment API Validation",
    use_5_d: "Test Luhn check implementations, error responses and integrations with payment APIs without handling real financial data.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Select the card brand",
    step_1_desc: "Choose the desired brand from the menu (Visa, Mastercard, Amex, etc.).",
    step_2_title: "Generate the card",
    step_2_desc: "Click \"Generate Card\". All data appears on the card: number, cardholder, expiry and CVV.",
    step_3_title: "Copy the data",
    step_3_desc: "Click the copy icon next to each field to copy it individually.",
    brands_title: "Supported Networks and Brands",
    brands_desc: "This generator supports 17 global payment networks, with brand-specific BIN prefixes according to the ISO/IEC 7812 standard:",
    faq_title: "Questions & Answers",
    legal_title: "Responsible Use and Legal Notices",
    legal_intro: "Generated numbers have no link to any real financial institution. In production environments, any attempt to use them is automatically declined by the issuer, as the number simply does not exist in any banking database.",
    legal_allowed_title: "Permitted uses",
    legal_allowed_1: "Software development and QA",
    legal_allowed_2: "Gateway integration testing in sandbox or staging environments",
    legal_allowed_3: "Demonstrations, wireframes and proof of concept",
    legal_allowed_4: "Test automation and form validation",
    legal_prohibited_title: "Prohibited uses",
    legal_prohibited_1: "Real payment or transaction attempts",
    legal_prohibited_2: "Any form of fraud or financial crime",
    legal_prohibited_3: "Use in production systems with real data",
    legal_outro: "This tool is legal and safe. Misuse of the generated data for fraudulent purposes is a criminal offence.",
    faq_1_q: "What is the difference between these cards and the official test cards from payment gateways?",
    faq_1_a: "Gateways such as Stripe, PayPal and Adyen provide their own test cards that simulate specific approvals and declines within their environments. Cards from this tool follow the correct structure (BIN + Luhn) and are useful for validating forms and masks in any system, but do not simulate specific gateway responses.",
    faq_2_q: "Are the CVV and expiry date real?",
    faq_2_a: "No. The CVV and expiry date are randomly generated for testing purposes and do not correspond to any card issued by a bank or financial institution.",
    faq_3_q: "What types of tests can I use this tool for?",
    faq_3_a: "For unit, integration, E2E, UI and regression tests. The generated data is compatible with any automation framework.",
    faq_4_q: "Is it legal to use this generator?",
    faq_4_a: "Yes. The tool is legal and intended exclusively for technical and educational purposes. Misuse of the generated data for fraud attempts or real transactions is illegal.",
    see1: "CPF Generator",
    see2: "CNPJ Generator",
    see3: "Birthday Generator",
    see4: "Password Generator"
  },
  es: {
    pageTitle: "Generador de Tarjetas de Crédito Falsas con CVV — Visa, Mastercard, Amex | Gratis",
    title: "Generador de Tarjetas de Crédito",
    meta: "Generador de tarjetas de crédito falsas con CVV, gratis y online. Genera números de tarjeta de crédito ficticios (Visa, Mastercard, Amex) válidos por el Algoritmo de Luhn para pruebas de software y QA. Incluye nombre, vencimiento y CVV.",
    brands: "Marca",
    num: "Número de Tarjeta",
    name: "Titular",
    dt: "Vencimiento",
    bt: "Generar Tarjeta",
    placeholder: "Selecciona una marca y haz clic en Generar",
    warning: "Los datos generados son ficticios y destinados exclusivamente a pruebas.",
    d1: "Genera tarjetas de crédito ficticias completas (número, titular, vencimiento y CVV) para pruebas de checkout, QA e integración con gateways de pago. Los números siguen la estructura real con prefijo BIN y verificación por el algoritmo de Luhn, pero son totalmente ficticios y no funcionan en transacciones reales.",
    features_title: "Funcionalidades",
    f_1: "Soporte para más de 15 redes de tarjetas principales",
    f_2: "Incluye nombre, vencimiento y CVV para pruebas realistas",
    f_3: "Números válidos por el Algoritmo de Luhn (MOD 10)",
    f_4: "Compatible con entornos de sandbox y homologación",
    how_title: "Cómo Funciona el Generador de Tarjetas de Crédito",
    how_desc: "Los números generados siguen la estructura real utilizada por la industria de pagos. Cada tarjeta está compuesta por elementos que cumplen con estándares internacionales, incluyendo:",
    how_li_1: "Identificación de la marca por el prefijo del número",
    how_li_2: "Prefijos BIN compatibles con cada red de tarjetas",
    how_li_3: "Longitud correcta del número por marca",
    how_li_4: "Cálculo e inserción del dígito verificador",
    how_li_5: "Validación por el Algoritmo de Luhn (MOD 10)",
    how_outro: "Esto permite probar sistemas que requieren tarjetas aparentemente válidas sin exponer información financiera legítima.",
    luhn_title: "El Algoritmo de Luhn (MOD 10)",
    luhn_intro: "El Algoritmo de Luhn (o 'mod 10') es una regla matemática utilizada por todas las tarjetas de crédito para validar su estructura. No verifica si una tarjeta existe realmente, solo si el número sigue el patrón esperado.",
    luhn_used_intro: "Es ampliamente utilizado por:",
    luhn_used_1: "Gateways de pago (Stripe, Adyen, PayPal)",
    luhn_used_2: "APIs financieras y sistemas antifraude",
    luhn_used_3: "Formularios de checkout",
    luhn_used_4: "Plataformas bancarias digitales",
    luhn_steps_intro: "El cálculo se realiza en cuatro pasos:",
    luhn_s1: "Recorre los dígitos de derecha a izquierda y dobla cada segundo dígito",
    luhn_s2: "Si al doblar el resultado es ≥ 10, suma los dos dígitos del producto (ej: 7×2=14 → 1+4=5)",
    luhn_s3: "Suma todos los dígitos, doblados y no doblados",
    luhn_s4: "Si la suma total es múltiplo de 10, el número es válido",
    luhn_example: "Ejemplo: el número 4111 1111 1111 1111 (tarjeta Visa de prueba ampliamente utilizada) da una suma de 30, siendo válido (30 ÷ 10 = 0 de resto). El último dígito '1' es el dígito verificador.",
    luhn_outro: "Esta herramienta aplica esta rutina automáticamente al generar cada tarjeta, garantizando que pase el Luhn check de cualquier sistema de pago.",
    bin_title: "¿Qué son BIN e IIN?",
    bin_intro: "BIN (Bank Identification Number) e IIN (Issuer Identification Number) son dos nombres para el mismo concepto: los primeros 4 a 6 dígitos del número de tarjeta, que identifican la institución emisora y la red de pago según el estándar ISO/IEC 7812.",
    bin_identifies_intro: "A partir de estos dígitos, los sistemas de pago identifican automáticamente:",
    bin_id_1: "La marca de la tarjeta (Visa, Mastercard, Amex etc.)",
    bin_id_2: "El banco o institución emisora",
    bin_id_3: "El tipo de tarjeta (crédito, débito o prepago)",
    bin_id_4: "El país de origen del emisor",
    bin_outro: "Esta herramienta utiliza prefijos BIN reales para cada marca seleccionada, garantizando que las tarjetas generadas sean reconocidas correctamente por formularios, máscaras y sistemas de detección de marca.",
    use_cases_title: "Principales Casos de Uso",
    use_cases_intro: "Esta herramienta es ideal para diversas situaciones cotidianas de desarrolladores y profesionales de tecnología:",
    use_1_t: "Pruebas de Checkout y Gateways",
    use_1_d: "Simule flujos completos de pago sin procesar una transacción real. Ampliamente usado en integraciones con Stripe, Adyen y PayPal.",
    use_2_t: "Desarrollo Frontend",
    use_2_d: "Valide máscaras de tarjeta, campos de formulario, comportamiento de UI y lógica de detección de marca sin exponer datos sensibles.",
    use_3_t: "Automatización de Pruebas",
    use_3_d: "Use tarjetas ficticias en scripts automatizados para validar formularios, flujos de checkout y reglas de negocio (con frameworks como Cypress, Playwright, Selenium, JUnit, Pytest, entre otros).",
    use_4_t: "Educación y Demostraciones",
    use_4_d: "Cree personas realistas con tarjetas válidas estructuralmente para presentaciones, wireframes y pruebas de concepto.",
    use_5_t: "Validación de APIs de Pago",
    use_5_d: "Pruebe implementaciones de Luhn check, respuestas de error e integraciones con APIs de pago sin manipular datos financieros reales.",
    legal_title: "Uso Responsable y Avisos Legales",
    legal_intro: "Los números generados no tienen vínculo con ninguna institución financiera real. En entornos de producción, cualquier intento de uso es automáticamente rechazado por el emisor, ya que el número simplemente no existe en ninguna base de datos bancaria.",
    legal_allowed_title: "Usos permitidos",
    legal_allowed_1: "Desarrollo y QA de software",
    legal_allowed_2: "Pruebas de integración con gateways en sandbox u homologación",
    legal_allowed_3: "Demostraciones, wireframes y pruebas de concepto",
    legal_allowed_4: "Automatización de pruebas y validación de formularios",
    legal_prohibited_title: "Usos prohibidos",
    legal_prohibited_1: "Intentos de pago o transacción real",
    legal_prohibited_2: "Cualquier forma de fraude o delito financiero",
    legal_prohibited_3: "Uso en sistemas de producción con datos reales",
    legal_outro: "Esta herramienta es legal y segura. El uso indebido de los datos generados para fines fraudulentos es un delito tipificado por la ley.",
    how_to_use_title: "Cómo Utilizar Esta Herramienta",
    step_1_title: "Selecciona la marca",
    step_1_desc: "Elige la marca deseada en el menú (Visa, Mastercard, Amex, etc.).",
    step_2_title: "Genera la tarjeta",
    step_2_desc: "Haz clic en \"Generar Tarjeta\". Todos los datos aparecen en la tarjeta: número, titular, vencimiento y CVV.",
    step_3_title: "Copia los datos",
    step_3_desc: "Haz clic en el ícono de copiar junto a cada campo para copiarlo individualmente.",
    brands_title: "Redes y Marcas Soportadas",
    brands_desc: "Este generador soporta 17 redes de pago globales, con prefijos BIN específicos por marca según el estándar ISO/IEC 7812:",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cuál es la diferencia entre estas tarjetas y las tarjetas de prueba oficiales de los gateways?",
    faq_1_a: "Gateways como Stripe, PayPal y Adyen proporcionan tarjetas de prueba propias que simulan aprobaciones y rechazos específicos dentro de sus entornos. Las tarjetas de esta herramienta siguen la estructura correcta (BIN + Luhn) y son útiles para validar formularios y máscaras en cualquier sistema, pero no simulan respuestas específicas de gateway.",
    faq_2_q: "¿El CVV y la fecha de vencimiento son reales?",
    faq_2_a: "No. El CVV y la fecha de vencimiento se generan aleatoriamente para fines de prueba y no corresponden a ninguna tarjeta emitida por un banco o institución financiera.",
    faq_3_q: "¿Para qué tipos de pruebas puedo usar esta herramienta?",
    faq_3_a: "Para pruebas unitarias, de integración, E2E, de UI y de regresión. Los datos generados son compatibles con cualquier framework de automatización.",
    faq_4_q: "¿Es legal usar este generador?",
    faq_4_a: "Sí. La herramienta es legal y destinada exclusivamente a fines técnicos y educativos. El uso indebido de los datos generados para intentos de fraude o transacciones reales es ilegal.",
    see1: "Generador de CPF",
    see2: "Generador de CNPJ",
    see3: "Generador de Cumpleaños",
    see4: "Generador de Contraseñas"
  },
  fr: {
    pageTitle: "Générateur de Carte de Crédit — Fausse Carte Bancaire Valide (Visa, Mastercard, Amex) | Gratuit",
    title: "Générateur de Carte de Crédit",
    meta: "Générateur de carte de crédit et fausse carte bancaire en ligne gratuit. Générez des numéros de carte bancaire valides (Visa, Mastercard, Amex) avec l'Algorithme de Luhn pour les tests logiciels et QA. Inclut nom, date d'expiration et CVV.",
    brands: "Réseau",
    num: "Numéro de Carte",
    name: "Titulaire",
    dt: "Expiration",
    bt: "Générer une Carte",
    placeholder: "Sélectionnez un réseau et cliquez sur Générer",
    warning: "Les données générées sont fictives et destinées exclusivement aux tests.",
    d1: "Générez des cartes de crédit fictives complètes (numéro, titulaire, expiration et CVV) pour les tests de checkout, QA et intégration avec les passerelles de paiement. Les numéros suivent la structure réelle avec préfixe BIN et vérification par l'algorithme de Luhn, mais sont totalement fictifs et ne fonctionnent pas pour de vraies transactions.",
    features_title: "Fonctionnalités",
    f_1: "Prise en charge de plus de 15 réseaux de cartes principaux",
    f_2: "Inclut nom, date d'expiration et CVV pour des tests réalistes",
    f_3: "Numéros valides par l'Algorithme de Luhn (MOD 10)",
    f_4: "Compatible avec les environnements sandbox et de recette",
    how_title: "Comment fonctionne le Générateur de Carte de Crédit",
    how_desc: "Les numéros générés suivent la structure réelle utilisée par l'industrie des paiements. Chaque carte est composée d'éléments conformes aux normes internationales, notamment :",
    how_li_1: "Identification du réseau par le préfixe du numéro",
    how_li_2: "Préfixes BIN compatibles avec chaque réseau",
    how_li_3: "Longueur correcte du numéro par réseau",
    how_li_4: "Calcul et insertion du chiffre de contrôle",
    how_li_5: "Validation par l'Algorithme de Luhn (MOD 10)",
    how_outro: "Cela permet de tester des systèmes qui exigent des cartes apparemment valides sans exposer de données financières réelles.",
    luhn_title: "L'Algorithme de Luhn (MOD 10)",
    luhn_intro: "L'Algorithme de Luhn (ou 'mod 10') est une règle mathématique utilisée par toutes les cartes de crédit pour valider leur structure. Il ne vérifie pas si une carte existe réellement, seulement si le numéro suit le schéma attendu.",
    luhn_used_intro: "Il est largement utilisé par :",
    luhn_used_1: "Passerelles de paiement (Stripe, Adyen, PayPal)",
    luhn_used_2: "APIs financières et systèmes antifraude",
    luhn_used_3: "Formulaires de checkout",
    luhn_used_4: "Plateformes bancaires numériques",
    luhn_steps_intro: "Le calcul s'effectue en quatre étapes :",
    luhn_s1: "Parcourez les chiffres de droite à gauche et doublez chaque second chiffre",
    luhn_s2: "Si en doublant le résultat est ≥ 10, additionnez les deux chiffres du produit (ex : 7×2=14 → 1+4=5)",
    luhn_s3: "Additionnez tous les chiffres, doublés et non doublés",
    luhn_s4: "Si la somme totale est un multiple de 10, le numéro est valide",
    luhn_example: "Exemple : le numéro 4111 1111 1111 1111 (carte Visa de test largement utilisée) donne une somme de 30, étant valide (30 ÷ 10 = reste 0). Le dernier chiffre '1' est le chiffre de contrôle.",
    luhn_outro: "Cet outil applique cette routine automatiquement lors de la génération de chaque carte, garantissant qu'elle passe le contrôle Luhn de tout système de paiement.",
    bin_title: "Que sont le BIN et l'IIN ?",
    bin_intro: "BIN (Bank Identification Number) et IIN (Issuer Identification Number) sont deux noms pour le même concept : les 4 à 6 premiers chiffres du numéro de carte, qui identifient l'institution émettrice et le réseau de paiement selon la norme ISO/IEC 7812.",
    bin_identifies_intro: "À partir de ces chiffres, les systèmes de paiement identifient automatiquement :",
    bin_id_1: "Le réseau de la carte (Visa, Mastercard, Amex etc.)",
    bin_id_2: "La banque ou institution émettrice",
    bin_id_3: "Le type de carte (crédit, débit ou prépayé)",
    bin_id_4: "Le pays d'origine de l'émetteur",
    bin_outro: "Cet outil utilise des préfixes BIN réels pour chaque réseau sélectionné, garantissant que les cartes générées soient correctement reconnues par les formulaires, masques et systèmes de détection de réseau.",
    use_cases_title: "Principaux Cas d'Usage",
    use_cases_intro: "Cet outil est idéal pour diverses situations quotidiennes des développeurs et des professionnels de la technologie :",
    use_1_t: "Tests de Checkout et Passerelles",
    use_1_d: "Simulez des flux de paiement complets sans traiter une transaction réelle. Largement utilisé dans les intégrations avec Stripe, Adyen et PayPal.",
    use_2_t: "Développement Frontend",
    use_2_d: "Validez les masques de carte, les champs de formulaire, le comportement de l'UI et la logique de détection de réseau sans exposer de données sensibles.",
    use_3_t: "Automatisation des Tests",
    use_3_d: "Utilisez des cartes fictives dans des scripts automatisés pour valider des formulaires, des flux de checkout et des règles métier (avec des frameworks comme Cypress, Playwright, Selenium, JUnit, Pytest, entre autres).",
    use_4_t: "Éducation et Démonstrations",
    use_4_d: "Créez des personas réalistes avec des cartes valides structurellement pour des présentations, wireframes et preuves de concept.",
    use_5_t: "Validation d'APIs de Paiement",
    use_5_d: "Testez les implémentations de Luhn check, les retours d'erreur et les intégrations avec des APIs de paiement sans manipuler de données financières réelles.",
    legal_title: "Utilisation Responsable et Avertissements Légaux",
    legal_intro: "Les numéros générés n'ont aucun lien avec une institution financière réelle. Dans les environnements de production, toute tentative d'utilisation est automatiquement refusée par l'émetteur, car le numéro n'existe simplement dans aucune base de données bancaire.",
    legal_allowed_title: "Utilisations autorisées",
    legal_allowed_1: "Développement et QA logiciel",
    legal_allowed_2: "Tests d'intégration avec passerelles en sandbox ou recette",
    legal_allowed_3: "Démonstrations, wireframes et preuves de concept",
    legal_allowed_4: "Automatisation des tests et validation de formulaires",
    legal_prohibited_title: "Utilisations interdites",
    legal_prohibited_1: "Tentatives de paiement ou de transaction réelle",
    legal_prohibited_2: "Toute forme de fraude ou de délit financier",
    legal_prohibited_3: "Utilisation dans des systèmes de production avec de vraies données",
    legal_outro: "Cet outil est légal et sûr. L'utilisation abusive des données générées à des fins frauduleuses est un délit prévu par la loi.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Sélectionnez le réseau",
    step_1_desc: "Choisissez le réseau souhaité dans le menu (Visa, Mastercard, Amex, etc.).",
    step_2_title: "Générez la carte",
    step_2_desc: "Cliquez sur \"Générer une Carte\". Toutes les données apparaissent sur la carte : numéro, titulaire, expiration et CVV.",
    step_3_title: "Copiez les données",
    step_3_desc: "Cliquez sur l'icône de copie à côté de chaque champ pour le copier individuellement.",
    brands_title: "Réseaux et Marques Supportés",
    brands_desc: "Ce générateur prend en charge 17 réseaux de paiement mondiaux, avec des préfixes BIN spécifiques par réseau selon la norme ISO/IEC 7812 :",
    faq_title: "Questions et Réponses",
    faq_1_q: "Quelle est la différence entre ces cartes et les cartes de test officielles des passerelles ?",
    faq_1_a: "Des passerelles comme Stripe, PayPal et Adyen fournissent leurs propres cartes de test qui simulent des approbations et des refus spécifiques dans leurs environnements. Les cartes de cet outil suivent la structure correcte (BIN + Luhn) et sont utiles pour valider des formulaires et des masques dans n'importe quel système, mais ne simulent pas les réponses spécifiques d'une passerelle.",
    faq_2_q: "Le CVV et la date d'expiration sont-ils réels ?",
    faq_2_a: "Non. Le CVV et la date d'expiration sont générés aléatoirement à des fins de test et ne correspondent à aucune carte émise par une banque ou institution financière.",
    faq_3_q: "Pour quels types de tests puis-je utiliser cet outil ?",
    faq_3_a: "Pour les tests unitaires, d'intégration, E2E, d'interface et de régression. Les données générées sont compatibles avec n'importe quel framework d'automatisation.",
    faq_4_q: "Est-il légal d'utiliser ce générateur ?",
    faq_4_a: "Oui. L'outil est légal et destiné exclusivement à des fins techniques et éducatives. L'utilisation abusive des données générées pour des tentatives de fraude ou des transactions réelles est illégale.",
    see1: "Générateur de CPF",
    see2: "Générateur de CNPJ",
    see3: "Générateur d'Anniversaire",
    see4: "Générateur de Mot de Passe"
  },
  it: {
    pageTitle: "Generatore Carte di Credito — Numero Carta di Credito Falsa per Test (Visa, Mastercard, Amex) | Gratis",
    title: "Generatore di Carta di Credito",
    meta: "Generatore di carte di credito e numero carta di credito falsa online e gratis. Genera numeri di carta di credito fittizi (Visa, Mastercard, Amex) validi con l'Algoritmo di Luhn per test software e QA. Include nome, scadenza e CVV.",
    brands: "Circuito",
    num: "Numero di Carta",
    name: "Titolare",
    dt: "Scadenza",
    bt: "Genera Carta",
    placeholder: "Seleziona un circuito e clicca su Genera",
    warning: "I dati generati sono fittizi e destinati esclusivamente a test.",
    d1: "Genera carte di credito fittizie complete (numero, titolare, scadenza e CVV) per test di checkout, QA e integrazione con gateway di pagamento. I numeri seguono la struttura reale con prefisso BIN e verifica dall'algoritmo di Luhn, ma sono totalmente fittizi e non funzionano in transazioni reali.",
    features_title: "Funzionalità",
    f_1: "Supporto per oltre 15 circuiti principali",
    f_2: "Include nome, scadenza e CVV per test realistici",
    f_3: "Numeri validi dall'Algoritmo di Luhn (MOD 10)",
    f_4: "Compatibile con ambienti sandbox e collaudo",
    how_title: "Come Funziona il Generatore di Carte di Credito",
    how_desc: "I numeri generati seguono la struttura reale utilizzata dall'industria dei pagamenti. Ogni carta è composta da elementi conformi agli standard internazionali, tra cui:",
    how_li_1: "Identificazione del circuito tramite il prefisso del numero",
    how_li_2: "Prefissi BIN compatibili con ogni rete di carte",
    how_li_3: "Lunghezza corretta del numero per circuito",
    how_li_4: "Calcolo e inserimento della cifra di controllo",
    how_li_5: "Validazione dall'Algoritmo di Luhn (MOD 10)",
    how_outro: "Ciò consente di testare sistemi che richiedono carte apparentemente valide senza esporre dati finanziari reali.",
    luhn_title: "L'Algoritmo di Luhn (MOD 10)",
    luhn_intro: "L'Algoritmo di Luhn (o 'mod 10') è una regola matematica utilizzata da tutte le carte di credito per validare la loro struttura. Non verifica se una carta esiste davvero, solo se il numero segue il pattern atteso.",
    luhn_used_intro: "È ampiamente utilizzato da:",
    luhn_used_1: "Gateway di pagamento (Stripe, Adyen, PayPal)",
    luhn_used_2: "API finanziarie e sistemi antifrode",
    luhn_used_3: "Moduli di checkout",
    luhn_used_4: "Piattaforme bancarie digitali",
    luhn_steps_intro: "Il calcolo avviene in quattro fasi:",
    luhn_s1: "Scorri le cifre da destra a sinistra e raddoppia ogni seconda cifra",
    luhn_s2: "Se raddoppiando il risultato è ≥ 10, somma le due cifre del prodotto (es: 7×2=14 → 1+4=5)",
    luhn_s3: "Somma tutte le cifre, raddoppiate e non",
    luhn_s4: "Se la somma totale è un multiplo di 10, il numero è valido",
    luhn_example: "Esempio: il numero 4111 1111 1111 1111 (carta Visa di test ampiamente utilizzata) dà una somma di 30, risultando valido (30 ÷ 10 = resto 0). L'ultima cifra '1' è la cifra di controllo.",
    luhn_outro: "Questo strumento applica questa routine automaticamente generando ogni carta, garantendo che superi il Luhn check di qualsiasi sistema di pagamento.",
    bin_title: "Cosa sono BIN e IIN?",
    bin_intro: "BIN (Bank Identification Number) e IIN (Issuer Identification Number) sono due nomi per lo stesso concetto: le prime 4-6 cifre del numero di carta, che identificano l'istituzione emittente e la rete di pagamento secondo lo standard ISO/IEC 7812.",
    bin_identifies_intro: "Da queste cifre, i sistemi di pagamento identificano automaticamente:",
    bin_id_1: "Il circuito della carta (Visa, Mastercard, Amex ecc.)",
    bin_id_2: "La banca o istituzione emittente",
    bin_id_3: "Il tipo di carta (credito, debito o prepagata)",
    bin_id_4: "Il paese di origine dell'emittente",
    bin_outro: "Questo strumento utilizza prefissi BIN reali per ogni circuito selezionato, garantendo che le carte generate siano riconosciute correttamente da moduli, maschere e sistemi di rilevamento del circuito.",
    use_cases_title: "Principali Casi d'Uso",
    use_cases_intro: "Questo strumento è ideale per diverse situazioni quotidiane di sviluppatori e professionisti tecnologici:",
    use_1_t: "Test di Checkout e Gateway",
    use_1_d: "Simula flussi di pagamento completi senza elaborare una transazione reale. Ampiamente usato nelle integrazioni con Stripe, Adyen e PayPal.",
    use_2_t: "Sviluppo Frontend",
    use_2_d: "Valida maschere di carta, campi modulo, comportamento UI e logica di rilevamento del circuito senza esporre dati sensibili.",
    use_3_t: "Automazione dei Test",
    use_3_d: "Usa carte fittizie in script automatizzati per validare moduli, flussi di checkout e regole di business (con framework come Cypress, Playwright, Selenium, JUnit, Pytest, tra gli altri).",
    use_4_t: "Educazione e Dimostrazioni",
    use_4_d: "Crea personas realistiche con carte valide strutturalmente per presentazioni, wireframe e prove di concetto.",
    use_5_t: "Validazione di API di Pagamento",
    use_5_d: "Testa implementazioni di Luhn check, risposte di errore e integrazioni con API di pagamento senza manipolare dati finanziari reali.",
    legal_title: "Uso Responsabile e Avvisi Legali",
    legal_intro: "I numeri generati non hanno alcun legame con istituzioni finanziarie reali. Negli ambienti di produzione, qualsiasi tentativo di utilizzo viene automaticamente rifiutato dall'emittente, poiché il numero semplicemente non esiste in nessuna banca dati bancaria.",
    legal_allowed_title: "Usi consentiti",
    legal_allowed_1: "Sviluppo software e QA",
    legal_allowed_2: "Test di integrazione con gateway in sandbox o collaudo",
    legal_allowed_3: "Dimostrazioni, wireframe e prove di concetto",
    legal_allowed_4: "Automazione dei test e validazione di moduli",
    legal_prohibited_title: "Usi vietati",
    legal_prohibited_1: "Tentativi di pagamento o transazione reale",
    legal_prohibited_2: "Qualsiasi forma di frode o reato finanziario",
    legal_prohibited_3: "Utilizzo in sistemi di produzione con dati reali",
    legal_outro: "Questo strumento è legale e sicuro. L'uso improprio dei dati generati per scopi fraudolenti è un reato previsto dalla legge.",
    how_to_use_title: "Come Utilizzare Questo Strumento",
    step_1_title: "Seleziona il circuito",
    step_1_desc: "Scegli il circuito desiderato dal menu (Visa, Mastercard, Amex, ecc.).",
    step_2_title: "Genera la carta",
    step_2_desc: "Clicca su \"Genera Carta\". Tutti i dati appaiono sulla carta: numero, titolare, scadenza e CVV.",
    step_3_title: "Copia i dati",
    step_3_desc: "Clicca sull'icona di copia accanto a ogni campo per copiarlo individualmente.",
    brands_title: "Circuiti e Reti Supportati",
    brands_desc: "Questo generatore supporta 17 reti di pagamento globali, con prefissi BIN specifici per circuito secondo lo standard ISO/IEC 7812:",
    faq_title: "Domande e Risposte",
    faq_1_q: "Qual è la differenza tra queste carte e le carte di test ufficiali dei gateway?",
    faq_1_a: "Gateway come Stripe, PayPal e Adyen forniscono carte di test proprie che simulano approvazioni e rifiuti specifici nei loro ambienti. Le carte di questo strumento seguono la struttura corretta (BIN + Luhn) e sono utili per validare moduli e maschere in qualsiasi sistema, ma non simulano risposte specifiche del gateway.",
    faq_2_q: "Il CVV e la data di scadenza sono reali?",
    faq_2_a: "No. Il CVV e la data di scadenza sono generati casualmente per scopi di test e non corrispondono ad alcuna carta emessa da una banca o istituzione finanziaria.",
    faq_3_q: "Per quali tipi di test posso usare questo strumento?",
    faq_3_a: "Per test unitari, di integrazione, E2E, di UI e di regressione. I dati generati sono compatibili con qualsiasi framework di automazione.",
    faq_4_q: "È legale usare questo generatore?",
    faq_4_a: "Sì. Lo strumento è legale e destinato esclusivamente a scopi tecnici ed educativi. L'uso improprio dei dati generati per tentativi di frode o transazioni reali è illegale.",
    see1: "Generatore di CPF",
    see2: "Generatore di CNPJ",
    see3: "Generatore di Compleanni",
    see4: "Generatore di Password"
  },
  id: {
    pageTitle: "Generator Kartu Kredit — (Visa, Mastercard, Amex, ...) | Gratis",
    title: "Generator Kartu Kredit",
    meta: "Buat nomor kartu kredit fiktif valid untuk pengujian perangkat lunak dan QA. Mendukung Visa, Mastercard, Amex dan lainnya, dengan validasi Algoritma Luhn. Mencakup nama, tanggal kedaluwarsa dan CVV.",
    brands: "Jaringan Kartu",
    num: "Nomor Kartu",
    name: "Pemegang Kartu",
    dt: "Kedaluwarsa",
    bt: "Buat Kartu",
    placeholder: "Pilih jaringan dan klik Buat",
    warning: "Data yang dihasilkan bersifat fiktif dan ditujukan semata-mata untuk pengujian.",
    d1: "Buat kartu kredit fiktif lengkap (nomor, pemegang kartu, kedaluwarsa dan CVV) untuk pengujian checkout, QA dan integrasi dengan gateway pembayaran. Nomornya mengikuti struktur nyata dengan prefiks BIN dan verifikasi algoritma Luhn, tetapi sepenuhnya fiktif dan tidak berfungsi dalam transaksi nyata.",
    features_title: "Fitur",
    f_1: "Mendukung lebih dari 15 jaringan kartu utama",
    f_2: "Mencakup nama, kedaluwarsa dan CVV untuk pengujian realistis",
    f_3: "Nomor valid menurut Algoritma Luhn (MOD 10)",
    f_4: "Kompatibel dengan lingkungan sandbox dan staging",
    how_title: "Cara Kerja Generator Kartu Kredit",
    how_desc: "Nomor yang dihasilkan mengikuti struktur nyata yang digunakan oleh industri pembayaran. Setiap kartu terdiri dari elemen yang mematuhi standar internasional, termasuk:",
    how_li_1: "Identifikasi jaringan kartu melalui prefiks nomor",
    how_li_2: "Prefiks BIN yang kompatibel dengan setiap jaringan",
    how_li_3: "Panjang nomor yang benar per jaringan",
    how_li_4: "Perhitungan dan penyisipan digit verifikasi",
    how_li_5: "Validasi oleh Algoritma Luhn (MOD 10)",
    how_outro: "Ini memungkinkan pengujian sistem yang memerlukan kartu yang tampak valid tanpa mengekspos data keuangan nyata.",
    luhn_title: "Algoritma Luhn (MOD 10)",
    luhn_intro: "Algoritma Luhn (atau 'mod 10') adalah aturan matematika yang digunakan oleh semua kartu kredit untuk memvalidasi strukturnya. Algoritma ini tidak memverifikasi apakah kartu benar-benar ada, hanya apakah nomornya mengikuti pola yang diharapkan.",
    luhn_used_intro: "Banyak digunakan oleh:",
    luhn_used_1: "Gateway pembayaran (Stripe, Adyen, PayPal)",
    luhn_used_2: "API keuangan dan sistem antipenipuan",
    luhn_used_3: "Formulir checkout",
    luhn_used_4: "Platform perbankan digital",
    luhn_steps_intro: "Perhitungan dilakukan dalam empat langkah:",
    luhn_s1: "Telusuri digit dari kanan ke kiri dan gandakan setiap digit kedua",
    luhn_s2: "Jika hasil penggandaan ≥ 10, jumlahkan dua digit hasilnya (mis: 7×2=14 → 1+4=5)",
    luhn_s3: "Jumlahkan semua digit, baik yang digandakan maupun tidak",
    luhn_s4: "Jika jumlah total merupakan kelipatan 10, nomor tersebut valid",
    luhn_example: "Contoh: nomor 4111 1111 1111 1111 (kartu Visa uji yang banyak digunakan) menghasilkan jumlah 30, sehingga valid (30 ÷ 10 = sisa 0). Digit terakhir '1' adalah digit verifikasi.",
    luhn_outro: "Alat ini menerapkan rutinitas ini secara otomatis saat menghasilkan setiap kartu, memastikan kartu lulus Luhn check di sistem pembayaran mana pun.",
    bin_title: "Apa itu BIN dan IIN?",
    bin_intro: "BIN (Bank Identification Number) dan IIN (Issuer Identification Number) adalah dua nama untuk konsep yang sama: 4 hingga 6 digit pertama dari nomor kartu, yang mengidentifikasi lembaga penerbit dan jaringan pembayaran sesuai standar ISO/IEC 7812.",
    bin_identifies_intro: "Dari digit-digit ini, sistem pembayaran secara otomatis mengidentifikasi:",
    bin_id_1: "Jaringan kartu (Visa, Mastercard, Amex dll.)",
    bin_id_2: "Bank atau lembaga penerbit",
    bin_id_3: "Jenis kartu (kredit, debit, atau prabayar)",
    bin_id_4: "Negara asal penerbit",
    bin_outro: "Alat ini menggunakan prefiks BIN nyata untuk setiap jaringan yang dipilih, memastikan kartu yang dihasilkan dikenali dengan benar oleh formulir, masker, dan sistem deteksi jaringan.",
    use_cases_title: "Kasus Penggunaan Utama",
    use_cases_intro: "Alat ini ideal untuk berbagai situasi sehari-hari bagi pengembang dan profesional teknologi:",
    use_1_t: "Pengujian Checkout dan Gateway",
    use_1_d: "Simulasikan alur pembayaran lengkap tanpa memproses transaksi nyata. Banyak digunakan dalam integrasi dengan Stripe, Adyen dan PayPal.",
    use_2_t: "Pengembangan Frontend",
    use_2_d: "Validasi masker kartu, kolom formulir, perilaku UI dan logika deteksi jaringan tanpa mengekspos data sensitif.",
    use_3_t: "Otomasi Pengujian",
    use_3_d: "Gunakan kartu fiktif dalam skrip otomatis untuk memvalidasi formulir, alur checkout dan aturan bisnis (dengan framework seperti Cypress, Playwright, Selenium, JUnit, Pytest, dan lainnya).",
    use_4_t: "Pendidikan dan Demonstrasi",
    use_4_d: "Buat persona realistis dengan kartu yang valid secara struktural untuk presentasi, wireframe dan proof of concept.",
    use_5_t: "Validasi API Pembayaran",
    use_5_d: "Uji implementasi Luhn check, respons kesalahan dan integrasi dengan API pembayaran tanpa memanipulasi data keuangan nyata.",
    legal_title: "Penggunaan Bertanggung Jawab dan Pemberitahuan Hukum",
    legal_intro: "Nomor yang dihasilkan tidak memiliki keterkaitan dengan lembaga keuangan nyata mana pun. Di lingkungan produksi, setiap upaya penggunaan secara otomatis ditolak oleh penerbit, karena nomor tersebut memang tidak ada dalam basis data perbankan mana pun.",
    legal_allowed_title: "Penggunaan yang diizinkan",
    legal_allowed_1: "Pengembangan perangkat lunak dan QA",
    legal_allowed_2: "Pengujian integrasi gateway di sandbox atau staging",
    legal_allowed_3: "Demonstrasi, wireframe dan proof of concept",
    legal_allowed_4: "Otomasi pengujian dan validasi formulir",
    legal_prohibited_title: "Penggunaan yang dilarang",
    legal_prohibited_1: "Upaya pembayaran atau transaksi nyata",
    legal_prohibited_2: "Segala bentuk penipuan atau kejahatan keuangan",
    legal_prohibited_3: "Penggunaan dalam sistem produksi dengan data nyata",
    legal_outro: "Alat ini legal dan aman. Penyalahgunaan data yang dihasilkan untuk tujuan penipuan adalah tindak pidana yang diatur oleh hukum.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Pilih jaringan kartu",
    step_1_desc: "Pilih jaringan yang diinginkan dari menu (Visa, Mastercard, Amex, dll.).",
    step_2_title: "Buat kartu",
    step_2_desc: "Klik \"Buat Kartu\". Semua data muncul di kartu: nomor, pemegang kartu, kedaluwarsa dan CVV.",
    step_3_title: "Salin data",
    step_3_desc: "Klik ikon salin di sebelah setiap kolom untuk menyalinnya secara individual.",
    brands_title: "Jaringan dan Merek yang Didukung",
    brands_desc: "Generator ini mendukung 17 jaringan pembayaran global, dengan prefiks BIN spesifik per jaringan sesuai standar ISO/IEC 7812:",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apa perbedaan antara kartu ini dan kartu uji resmi dari gateway?",
    faq_1_a: "Gateway seperti Stripe, PayPal dan Adyen menyediakan kartu uji sendiri yang mensimulasikan persetujuan dan penolakan spesifik dalam lingkungan mereka. Kartu dari alat ini mengikuti struktur yang benar (BIN + Luhn) dan berguna untuk memvalidasi formulir dan masker di sistem mana pun, tetapi tidak mensimulasikan respons gateway tertentu.",
    faq_2_q: "Apakah CVV dan tanggal kedaluwarsa nyata?",
    faq_2_a: "Tidak. CVV dan tanggal kedaluwarsa dihasilkan secara acak untuk tujuan pengujian dan tidak sesuai dengan kartu yang diterbitkan oleh bank atau lembaga keuangan mana pun.",
    faq_3_q: "Untuk jenis pengujian apa alat ini dapat digunakan?",
    faq_3_a: "Untuk pengujian unit, integrasi, E2E, UI dan regresi. Data yang dihasilkan kompatibel dengan framework otomasi mana pun.",
    faq_4_q: "Apakah legal menggunakan generator ini?",
    faq_4_a: "Ya. Alat ini legal dan ditujukan eksklusif untuk tujuan teknis dan pendidikan. Penyalahgunaan data yang dihasilkan untuk upaya penipuan atau transaksi nyata adalah ilegal.",
    see1: "Generator CPF",
    see2: "Generator CNPJ",
    see3: "Generator Tanggal Lahir",
    see4: "Generator Kata Sandi"
  },
  de: {
    pageTitle: "Kreditkarten-Generator (Visa, Mastercard, Amex, ...) | Kostenlos",
    title: "Kreditkarten-Generator",
    meta: "Generieren Sie gültige fiktive Kreditkartennummern für Softwaretests und QA. Unterstützt Visa, Mastercard, Amex und mehr, mit Luhn-Algorithmus-Validierung. Inklusive Name, Ablaufdatum und CVV.",
    brands: "Kartenmarke",
    num: "Kartennummer",
    name: "Karteninhaber",
    dt: "Ablauf",
    bt: "Karte generieren",
    placeholder: "Marke wählen und auf Generieren klicken",
    warning: "Die generierten Daten sind fiktiv und ausschließlich für Testzwecke bestimmt.",
    d1: "Generieren Sie vollständige fiktive Kreditkarten (Nummer, Inhaber, Ablaufdatum und CVV) für Checkout-Tests, QA und Integration mit Zahlungs-Gateways. Die Nummern folgen der realen Struktur mit BIN-Präfix und Luhn-Prüfung, sind jedoch vollständig fiktiv und funktionieren nicht bei echten Transaktionen.",
    features_title: "Funktionen",
    f_1: "Unterstützung für über 15 große Kartennetzwerke",
    f_2: "Inklusive Name, Ablaufdatum und CVV für realistische Tests",
    f_3: "Gültige Nummern nach dem Luhn-Algorithmus (MOD 10)",
    f_4: "Kompatibel mit Sandbox- und Testumgebungen",
    how_title: "Wie der Kreditkarten-Generator funktioniert",
    how_desc: "Die generierten Nummern folgen der realen Struktur der Zahlungsbranche. Jede Karte besteht aus Elementen, die internationalen Standards entsprechen, darunter:",
    how_li_1: "Kartenmarken-Identifikation über das Nummernpräfix",
    how_li_2: "Kompatible BIN-Präfixe für jedes Kartennetzwerk",
    how_li_3: "Korrekte Nummernlänge je Kartenmarke",
    how_li_4: "Berechnung und Einfügen der Prüfziffer",
    how_li_5: "Validierung durch den Luhn-Algorithmus (MOD 10)",
    how_outro: "Dies ermöglicht das Testen von Systemen, die scheinbar gültige Karten erfordern, ohne echte Finanzdaten preiszugeben.",
    luhn_title: "Der Luhn-Algorithmus (MOD 10)",
    luhn_intro: "Der Luhn-Algorithmus (oder 'mod 10') ist eine mathematische Regel, die von allen Kreditkarten zur Validierung ihrer Struktur verwendet wird. Er prüft nicht, ob eine Karte tatsächlich existiert, sondern nur, ob die Nummer dem erwarteten Muster folgt.",
    luhn_used_intro: "Er wird häufig verwendet von:",
    luhn_used_1: "Zahlungs-Gateways (Stripe, Adyen, PayPal)",
    luhn_used_2: "Finanz-APIs und Betrugserkennungssystemen",
    luhn_used_3: "Checkout-Formularen",
    luhn_used_4: "Digitalen Bankplattformen",
    luhn_steps_intro: "Die Berechnung erfolgt in vier Schritten:",
    luhn_s1: "Gehe die Ziffern von rechts nach links durch und verdopple jede zweite Ziffer",
    luhn_s2: "Wenn das verdoppelte Ergebnis ≥ 10 ist, addiere die beiden Ziffern des Produkts (z.B.: 7×2=14 → 1+4=5)",
    luhn_s3: "Addiere alle Ziffern, verdoppelte und nicht verdoppelte",
    luhn_s4: "Wenn die Gesamtsumme ein Vielfaches von 10 ist, ist die Nummer gültig",
    luhn_example: "Beispiel: Die Nummer 4111 1111 1111 1111 (weit verbreitete Visa-Testkarte) ergibt eine Summe von 30 und ist gültig (30 ÷ 10 = Rest 0). Die letzte Ziffer '1' ist die Prüfziffer.",
    luhn_outro: "Dieses Tool wendet diese Routine beim Generieren jeder Karte automatisch an und stellt sicher, dass die Karte den Luhn-Check jedes Zahlungssystems besteht.",
    bin_title: "Was sind BIN und IIN?",
    bin_intro: "BIN (Bank Identification Number) und IIN (Issuer Identification Number) sind zwei Namen für dasselbe Konzept: die ersten 4 bis 6 Ziffern einer Kartennummer, die das ausgebende Institut und das Zahlungsnetzwerk gemäß ISO/IEC 7812 identifizieren.",
    bin_identifies_intro: "Anhand dieser Ziffern identifizieren Zahlungssysteme automatisch:",
    bin_id_1: "Die Kartenmarke (Visa, Mastercard, Amex usw.)",
    bin_id_2: "Die ausgebende Bank oder Institution",
    bin_id_3: "Den Kartentyp (Kredit, Debit oder Prepaid)",
    bin_id_4: "Das Herkunftsland des Ausstellers",
    bin_outro: "Dieses Tool verwendet echte BIN-Präfixe für jede ausgewählte Kartenmarke und stellt sicher, dass generierte Karten von Formularen, Masken und Markenerkennungssystemen korrekt erkannt werden.",
    use_cases_title: "Hauptanwendungsfälle",
    use_cases_intro: "Dieses Tool ist ideal für verschiedene Alltagssituationen von Entwicklern und Technologieexperten:",
    use_1_t: "Checkout- und Gateway-Tests",
    use_1_d: "Simulieren Sie vollständige Zahlungsabläufe ohne echte Transaktionen. Weit verbreitet in Integrationen mit Stripe, Adyen und PayPal.",
    use_2_t: "Frontend-Entwicklung",
    use_2_d: "Validieren Sie Kartenmasken, Formularfelder, UI-Verhalten und Markenerkennungslogik ohne sensible Daten preiszugeben.",
    use_3_t: "Test-Automatisierung",
    use_3_d: "Verwenden Sie fiktive Karten in automatisierten Skripten zur Validierung von Formularen, Checkout-Abläufen und Geschäftsregeln (mit Frameworks wie Cypress, Playwright, Selenium, JUnit, Pytest u.a.).",
    use_4_t: "Bildung und Demonstrationen",
    use_4_d: "Erstellen Sie realistische Personas mit strukturell gültigen Karten für Präsentationen, Wireframes und Proof-of-Concepts.",
    use_5_t: "Validierung von Zahlungs-APIs",
    use_5_d: "Testen Sie Luhn-Check-Implementierungen, Fehlerantworten und Integrationen mit Zahlungs-APIs ohne echte Finanzdaten zu verarbeiten.",
    legal_title: "Verantwortungsvolle Nutzung und rechtliche Hinweise",
    legal_intro: "Die generierten Nummern haben keine Verbindung zu echten Finanzinstituten. In Produktionsumgebungen wird jeder Nutzungsversuch automatisch vom Aussteller abgelehnt, da die Nummer in keiner Bankdatenbank existiert.",
    legal_allowed_title: "Erlaubte Verwendungen",
    legal_allowed_1: "Softwareentwicklung und QA",
    legal_allowed_2: "Gateway-Integrationstests in Sandbox- oder Testumgebungen",
    legal_allowed_3: "Demonstrationen, Wireframes und Proof-of-Concepts",
    legal_allowed_4: "Test-Automatisierung und Formularvalidierung",
    legal_prohibited_title: "Verbotene Verwendungen",
    legal_prohibited_1: "Versuche echter Zahlungen oder Transaktionen",
    legal_prohibited_2: "Jede Form von Betrug oder Finanzkriminalität",
    legal_prohibited_3: "Verwendung in Produktionssystemen mit echten Daten",
    legal_outro: "Dieses Tool ist legal und sicher. Der Missbrauch der generierten Daten für betrügerische Zwecke ist eine gesetzlich strafbare Handlung.",
    how_to_use_title: "Anleitung",
    step_1_title: "Kartenmarke wählen",
    step_1_desc: "Wählen Sie die gewünschte Marke aus dem Menü (Visa, Mastercard, Amex usw.).",
    step_2_title: "Karte generieren",
    step_2_desc: "Klicken Sie auf \"Karte generieren\". Alle Daten erscheinen auf der Karte: Nummer, Inhaber, Ablauf und CVV.",
    step_3_title: "Daten kopieren",
    step_3_desc: "Klicken Sie auf das Kopiersymbol neben jedem Feld, um es einzeln zu kopieren.",
    brands_title: "Unterstützte Netzwerke und Marken",
    brands_desc: "Dieser Generator unterstützt 17 globale Zahlungsnetzwerke, mit markenspezifischen BIN-Präfixen gemäß ISO/IEC 7812:",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Was ist der Unterschied zwischen diesen Karten und den offiziellen Testkarten der Gateways?",
    faq_1_a: "Gateways wie Stripe, PayPal und Adyen stellen eigene Testkarten bereit, die spezifische Genehmigungen und Ablehnungen in ihren Umgebungen simulieren. Die Karten dieses Tools folgen der korrekten Struktur (BIN + Luhn) und sind nützlich zur Validierung von Formularen und Masken in jedem System, simulieren jedoch keine spezifischen Gateway-Antworten.",
    faq_2_q: "Sind CVV und Ablaufdatum echt?",
    faq_2_a: "Nein. CVV und Ablaufdatum werden zufällig für Testzwecke generiert und entsprechen keiner von einer Bank oder Finanzinstitution ausgegebenen Karte.",
    faq_3_q: "Für welche Testarten kann ich dieses Tool verwenden?",
    faq_3_a: "Für Unit-, Integrations-, E2E-, UI- und Regressionstests. Die generierten Daten sind mit jedem Automatisierungs-Framework kompatibel.",
    faq_4_q: "Ist die Verwendung dieses Generators legal?",
    faq_4_a: "Ja. Das Tool ist legal und ausschließlich für technische und bildungsbezogene Zwecke bestimmt. Der Missbrauch der generierten Daten für Betrugsversuche oder echte Transaktionen ist illegal.",
    see1: "CPF-Generator",
    see2: "CNPJ-Generator",
    see3: "Geburtsdatum-Generator",
    see4: "Passwort-Generator"
  },
  nl: {
    pageTitle: "Creditcardgenerator (Visa, Mastercard, Amex, ...) | Gratis",
    title: "Creditcardgenerator",
    meta: "Genereer geldige fictieve creditcardnummers voor softwaretests en QA. Ondersteunt Visa, Mastercard, Amex en meer, met Luhn-algoritme validatie. Inclusief naam, vervaldatum en CVV.",
    brands: "Kaartmerk",
    num: "Kaartnummer",
    name: "Kaarthouder",
    dt: "Vervaldatum",
    bt: "Kaart genereren",
    placeholder: "Selecteer een merk en klik op Genereren",
    warning: "Gegenereerde gegevens zijn fictief en uitsluitend bedoeld voor testdoeleinden.",
    d1: "Genereer volledige fictieve creditcards (nummer, houder, vervaldatum en CVV) voor checkout-tests, QA en integratie met betalingsgateways. De nummers volgen de echte structuur met BIN-prefix en Luhn-verificatie, maar zijn volledig fictief en werken niet bij echte transacties.",
    features_title: "Functionaliteiten",
    f_1: "Ondersteuning voor meer dan 15 grote kaartnetwerken",
    f_2: "Inclusief naam, vervaldatum en CVV voor realistische tests",
    f_3: "Geldige nummers volgens het Luhn-algoritme (MOD 10)",
    f_4: "Compatibel met sandbox- en testomgevingen",
    how_title: "Hoe de creditcardgenerator werkt",
    how_desc: "De gegenereerde nummers volgen de echte structuur van de betalingsindustrie. Elke kaart bestaat uit elementen die voldoen aan internationale standaarden, waaronder:",
    how_li_1: "Kaartmerk-identificatie via het nummerpréfix",
    how_li_2: "Compatibele BIN-prefixen voor elk kaartnetwerk",
    how_li_3: "Juiste nummerlengste per kaartmerk",
    how_li_4: "Berekening en invoeging van het controlecijfer",
    how_li_5: "Validatie door het Luhn-algoritme (MOD 10)",
    how_outro: "Dit maakt het mogelijk systemen te testen die schijnbaar geldige kaarten vereisen zonder echte financiële gegevens bloot te stellen.",
    luhn_title: "Het Luhn-algoritme (MOD 10)",
    luhn_intro: "Het Luhn-algoritme (of 'mod 10') is een wiskundige regel die door alle creditcards wordt gebruikt om hun structuur te valideren. Het verifieert niet of een kaart daadwerkelijk bestaat, alleen of het nummer het verwachte patroon volgt.",
    luhn_used_intro: "Het wordt veel gebruikt door:",
    luhn_used_1: "Betalingsgateways (Stripe, Adyen, PayPal)",
    luhn_used_2: "Financiële API's en fraudedetectiesystemen",
    luhn_used_3: "Checkout-formulieren",
    luhn_used_4: "Digitale bankplatforms",
    luhn_steps_intro: "De berekening wordt uitgevoerd in vier stappen:",
    luhn_s1: "Doorloop de cijfers van rechts naar links en verdubbel elk tweede cijfer",
    luhn_s2: "Als het verdubbelde resultaat ≥ 10 is, tel de twee cijfers van het product op (bijv.: 7×2=14 → 1+4=5)",
    luhn_s3: "Tel alle cijfers op, verdubbeld en niet-verdubbeld",
    luhn_s4: "Als de totale som een veelvoud van 10 is, is het nummer geldig",
    luhn_example: "Voorbeeld: het nummer 4111 1111 1111 1111 (veelgebruikte Visa-testkaart) geeft een som van 30 en is geldig (30 ÷ 10 = rest 0). Het laatste cijfer '1' is het controlecijfer.",
    luhn_outro: "Dit hulpmiddel past deze routine automatisch toe bij het genereren van elke kaart, zodat deze de Luhn-controle van elk betalingssysteem doorstaat.",
    bin_title: "Wat zijn BIN en IIN?",
    bin_intro: "BIN (Bank Identification Number) en IIN (Issuer Identification Number) zijn twee namen voor hetzelfde concept: de eerste 4 tot 6 cijfers van een kaartnummer, die de uitgevende instelling en het betalingsnetwerk identificeren volgens de ISO/IEC 7812-standaard.",
    bin_identifies_intro: "Aan de hand van deze cijfers identificeren betalingssystemen automatisch:",
    bin_id_1: "Het kaartmerk (Visa, Mastercard, Amex etc.)",
    bin_id_2: "De uitgevende bank of instelling",
    bin_id_3: "Het kaarttype (credit, debit of prepaid)",
    bin_id_4: "Het land van herkomst van de uitgever",
    bin_outro: "Dit hulpmiddel gebruikt echte BIN-prefixen voor elk geselecteerd kaartmerk, zodat gegenereerde kaarten correct worden herkend door formulieren, maskers en merkdetectiesystemen.",
    use_cases_title: "Belangrijkste gebruiksscenario's",
    use_cases_intro: "Dit hulpmiddel is ideaal voor diverse dagelijkse situaties van ontwikkelaars en technologieprofessionals:",
    use_1_t: "Checkout- en gatewaytests",
    use_1_d: "Simuleer volledige betalingsstromen zonder een echte transactie te verwerken. Veel gebruikt in integraties met Stripe, Adyen en PayPal.",
    use_2_t: "Frontend-ontwikkeling",
    use_2_d: "Valideer kaartmaskers, formuliervelden, UI-gedrag en merkdetectielogica zonder gevoelige gegevens bloot te stellen.",
    use_3_t: "Testautomatisering",
    use_3_d: "Gebruik fictieve kaarten in geautomatiseerde scripts om formulieren, checkout-stromen en bedrijfsregels te valideren (met frameworks zoals Cypress, Playwright, Selenium, JUnit, Pytest en andere).",
    use_4_t: "Onderwijs en demonstraties",
    use_4_d: "Maak realistische persona's met structureel geldige kaarten voor presentaties, wireframes en proof-of-concepts.",
    use_5_t: "Validatie van betalings-API's",
    use_5_d: "Test Luhn-check-implementaties, foutreacties en integraties met betalings-API's zonder echte financiële gegevens te verwerken.",
    legal_title: "Verantwoord gebruik en juridische kennisgevingen",
    legal_intro: "De gegenereerde nummers hebben geen koppeling met echte financiële instellingen. In productieomgevingen wordt elke gebruikspoging automatisch geweigerd door de uitgever, omdat het nummer simpelweg niet bestaat in een bankdatabase.",
    legal_allowed_title: "Toegestaan gebruik",
    legal_allowed_1: "Softwareontwikkeling en QA",
    legal_allowed_2: "Gateway-integratietests in sandbox- of testomgevingen",
    legal_allowed_3: "Demonstraties, wireframes en proof-of-concepts",
    legal_allowed_4: "Testautomatisering en formuliervalidatie",
    legal_prohibited_title: "Verboden gebruik",
    legal_prohibited_1: "Pogingen tot echte betalingen of transacties",
    legal_prohibited_2: "Elke vorm van fraude of financieel misdrijf",
    legal_prohibited_3: "Gebruik in productiesystemen met echte gegevens",
    legal_outro: "Dit hulpmiddel is legaal en veilig. Misbruik van de gegenereerde gegevens voor frauduleuze doeleinden is een wettelijk strafbaar feit.",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Selecteer het kaartmerk",
    step_1_desc: "Kies het gewenste merk uit het menu (Visa, Mastercard, Amex, etc.).",
    step_2_title: "Genereer de kaart",
    step_2_desc: "Klik op \"Kaart genereren\". Alle gegevens verschijnen op de kaart: nummer, houder, vervaldatum en CVV.",
    step_3_title: "Gegevens kopiëren",
    step_3_desc: "Klik op het kopieerpictogram naast elk veld om het individueel te kopiëren.",
    brands_title: "Ondersteunde netwerken en merken",
    brands_desc: "Deze generator ondersteunt 17 wereldwijde betalingsnetwerken, met merkspecifieke BIN-prefixen volgens de ISO/IEC 7812-standaard:",
    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Wat is het verschil tussen deze kaarten en de officiële testkaarten van gateways?",
    faq_1_a: "Gateways zoals Stripe, PayPal en Adyen bieden hun eigen testkaarten die specifieke goedkeuringen en weigeringen in hun omgevingen simuleren. Kaarten van dit hulpmiddel volgen de juiste structuur (BIN + Luhn) en zijn nuttig voor het valideren van formulieren en maskers in elk systeem, maar simuleren geen specifieke gateway-reacties.",
    faq_2_q: "Zijn de CVV en vervaldatum echt?",
    faq_2_a: "Nee. De CVV en vervaldatum worden willekeurig gegenereerd voor testdoeleinden en komen niet overeen met een kaart uitgegeven door een bank of financiële instelling.",
    faq_3_q: "Voor welke soorten tests kan ik dit hulpmiddel gebruiken?",
    faq_3_a: "Voor unit-, integratie-, E2E-, UI- en regressietests. De gegenereerde gegevens zijn compatibel met elk automatiseringsframework.",
    faq_4_q: "Is het legaal om deze generator te gebruiken?",
    faq_4_a: "Ja. Het hulpmiddel is legaal en uitsluitend bedoeld voor technische en educatieve doeleinden. Misbruik van de gegenereerde gegevens voor fraudepogingen of echte transacties is illegaal.",
    see1: "CPF-generator",
    see2: "CNPJ-generator",
    see3: "Geboortedatumgenerator",
    see4: "Wachtwoordgenerator"
  },
  ru: {
    pageTitle: "Генератор кредитных карт — тестовые номера Visa, Mastercard, Amex | Бесплатно",
    title: "Генератор кредитных карт",
    meta: "Бесплатный онлайн-генератор случайных номеров кредитных карт для тестирования ПО и QA. Генерация карт Visa, Mastercard, Amex и др. с валидацией по алгоритму Луна, именем, сроком действия и CVV.",
    brands: "Платежная система",
    num: "Номер карты",
    name: "Владелец карты",
    dt: "Срок действия",
    bt: "Сгенерировать карту",
    placeholder: "Выберите платежную систему и нажмите «Сгенерировать»",
    warning: "Сгенерированные данные являются вымышленными и предназначены исключительно для тестирования.",
    d1: "Генерируйте вымышленные кредитные карты в комплекте (номер, имя держателя, срок действия и CVV) для тестирования страниц оплаты, процессов QA и интеграции платежных шлюзов. Номера соответствуют реальной структуре с префиксом BIN и контрольной суммой по алгоритму Луна, но они полностью фиктивны и не могут использоваться для совершения реальных платежей.",
    features_title: "Возможности",
    f_1: "Поддержка более 15 основных платежных систем",
    f_2: "Генерация имени держателя, срока действия и CVV для реалистичного тестирования",
    f_3: "Соответствие номеров карт алгоритму Луна (MOD 10)",
    f_4: "Полная совместимость с тестовыми средами и песочницами (sandbox)",
    how_title: "Как работает генератор кредитных карт",
    how_desc: "Создаваемые номера карт в точности повторяют реальную структуру, принятую в платежной индустрии. Каждая карта состоит из элементов, подчиняющихся международным стандартам, включая:",
    how_li_1: "Определение платежной системы по префиксу номера",
    how_li_2: "Префиксы BIN, соответствующие каждой платежной сети",
    how_li_3: "Корректная длина номера карты для каждой платежной системы",
    how_li_4: "Расчет и вставка контрольной цифры",
    how_li_5: "Валидация по алгоритму Луна (MOD 10)",
    how_outro: "Это позволяет полноценно тестировать функционал платежных форм без риска раскрытия реальных финансовых данных.",
    luhn_title: "Алгоритм Луна (MOD 10)",
    luhn_intro: "Алгоритм Луна (или схема «модуль 10») — это простая математическая формула, используемая во всем мире для проверки правильности структуры номера карты. Он не подтверждает реальное существование карты в банковской базе данных, а лишь удостоверяет, что номер составлен корректно.",
    luhn_used_intro: "Этот алгоритм повсеместно применяется:",
    luhn_used_1: "Платежными шлюзами (Stripe, Adyen, PayPal)",
    luhn_used_2: "Финансовыми API и системами фрод-мониторинга",
    luhn_used_3: "Интерфейсными формами оплаты",
    luhn_used_4: "Платформами интернет-банкинга",
    luhn_steps_intro: "Расчет контрольной суммы состоит из четырех шагов:",
    luhn_s1: "Двигаясь справа налево, удвойте значение каждой второй цифры",
    luhn_s2: "Если после удвоения получилось число 10 или больше, сложите его цифры (например, 7×2=14 → 1+4=5)",
    luhn_s3: "Сложите все полученные цифры номера вместе",
    luhn_s4: "Если итоговая сумма делится на 10 без остатка, то номер считается структурно верным",
    luhn_example: "Пример: широко известная тестовая карта Visa 4111 1111 1111 1111 в сумме дает 30. Поскольку 30 делится на 10 без остатка, номер валиден. Последняя цифра «1» является контрольным числом.",
    luhn_outro: "Наш инструмент автоматически выполняет эти расчеты при генерации каждого номера карты, гарантируя успешное прохождение Luhn check в любой принимающей системе.",
    bin_title: "Что такое BIN и IIN?",
    bin_intro: "BIN (Bank Identification Number) и IIN (Issuer Identification Number) — это два термина, обозначающие одно и то же понятие: первые 4–6 цифр номера карты, которые идентифицируют банк-эмитент и платежную систему в соответствии со стандартом ISO/IEC 7812.",
    bin_identifies_intro: "По этим начальным цифрам платежные системы мгновенно определяют:",
    bin_id_1: "Платежную систему (Visa, Mastercard, Amex и др.)",
    bin_id_2: "Банк или финансовую организацию, выпустившую карту",
    bin_id_3: "Тип карты (кредитная, дебетовая или предоплаченная)",
    bin_id_4: "Страну происхождения банка-эмитента",
    bin_outro: "Этот генератор использует реальные префиксы BIN для выбранных платежных систем, гарантируя правильное автораспознавание логотипов и типов карт в ваших формах ввода.",
    use_cases_title: "Основные сценарии использования",
    use_cases_intro: "Инструмент идеально подходит для решения повседневных задач инженеров, тестировщиков и разработчиков:",
    use_1_t: "Тестирование форм оплаты и платежных шлюзов",
    use_1_d: "Имитируйте полный цикл проведения оплаты на сайте без выполнения реальных финансовых транзакций. Отлично подходит для отладки интеграций со Stripe, Adyen, PayPal.",
    use_2_t: "Разработка пользовательских интерфейсов (Frontend)",
    use_2_d: "Отлаживайте маски полей ввода, логику определения платежной системы по мере ввода и поведение UI без риска утечки конфиденциальных данных.",
    use_3_t: "Автоматизация тестирования (QA Automation)",
    use_3_d: "Используйте вымышленные карты в автоматических сценариях для проверки правильности работы форм, корзин и бизнес-логики (с фреймворками Cypress, Playwright, Selenium, JUnit, Pytest и др.).",
    use_4_t: "Обучение и презентации",
    use_4_d: "Наполняйте прототипы, интерактивные макеты (в Figma, Adobe XD) и слайды презентаций реалистичными данными карт для наглядности перед заказчиком.",
    use_5_t: "Проверка валидаторов API",
    use_5_d: "Тестируйте собственные реализации проверки Luhn check и обработку ошибок API без манипуляций с реальными счетами.",
    how_to_use_title: "Как использовать этот инструмент",
    step_1_title: "Выберите платежную систему",
    step_1_desc: "Выберите нужную платежную сеть из выпадающего списка (Visa, Mastercard, Amex и т. д.).",
    step_2_title: "Сгенерируйте карту",
    step_2_desc: "Нажмите «Сгенерировать карту». Все необходимые реквизиты (номер, имя, срок, CVV) появятся на визуальном макете карты.",
    step_3_title: "Скопируйте реквизиты",
    step_3_desc: "Нажмите на иконку копирования рядом с каждым полем, чтобы сохранить конкретное значение в буфер обмена.",
    brands_title: "Поддерживаемые платежные сети",
    brands_desc: "Генератор поддерживает 17 глобальных платежных сетей со специфическими префиксами BIN в соответствии с требованиями стандарта ISO/IEC 7812:",
    faq_title: "Часто задаваемые вопросы",
    legal_title: "Ответственное использование и правовая информация",
    legal_intro: "Создаваемые номера не имеют привязки к реальным банковским счетам. В рабочей среде (production) любая попытка списать средства будет автоматически отклонена банком-эмитентом, так как такой карты физически не существует.",
    legal_allowed_title: "Разрешенные сценарии",
    legal_allowed_1: "Разработка и ручное/автоматическое тестирование ПО",
    legal_allowed_2: "Интеграционное тестирование платежных шлюзов в режимах sandbox или staging",
    legal_allowed_3: "Создание демо-стендов, макетов и концепций (PoC)",
    legal_allowed_4: "Автоматизация UI-тестов и отладка валидации форм",
    legal_prohibited_title: "Запрещенные действия",
    legal_prohibited_1: "Попытки оплаты реальных товаров или услуг",
    legal_prohibited_2: "Любые виды финансового мошенничества",
    legal_prohibited_3: "Использование на «живых» серверах с реальными финансовыми данными",
    legal_outro: "Этот инструмент полностью легален и безопасен. Использование созданных данных в корыстных или мошеннических целях уголовно наказуемо.",
    faq_1_q: "В чем разница между картами этого генератора и тестовыми картами от самих платежных шлюзов?",
    faq_1_a: "Шлюзы вроде Stripe, PayPal или Adyen предоставляют особые тестовые карты, настроенные на имитацию конкретных кодов ошибок (например, нехватка средств или блокировка). Карты нашего генератора имеют правильный формат (BIN + Luhn) и отлично подходят для отладки форм на фронтенде, но они не умеют вызывать специфические сценарии ответов на стороне шлюза.",
    faq_2_q: "Являются ли срок действия и код CVV реальными?",
    faq_2_a: "Не. Код CVV и дата окончания срока действия генерируются случайным образом и не соответствуют ни одной карте, выпущенной каким-либо реальным банком.",
    faq_3_q: "Для каких видов тестирования подходит этот генератор?",
    faq_3_a: "Для любых видов ручного и автоматизированного тестирования (модульное, интеграционное, сквозное E2E, регрессионное). Сгенерированные данные поддерживаются любыми тестовыми фреймворками.",
    faq_4_q: "Законно ли использовать данный инструмент?",
    faq_4_a: "Да. Генератор абсолютно легален и предназначен исключительно для образовательных и технических целей. Любые попытки применить эти данные для мошенничества незаконны.",
    see1: "Генератор CPF",
    see2: "Генератор CNPJ",
    see3: "Генератор даты рождения",
    see4: "Генератор паролей"
  }
}
</i18n>
