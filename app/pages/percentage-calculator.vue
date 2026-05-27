<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()

interface Params { 
  v1: number | null
  v2: number | null 
}

const p1: Params = reactive({ v1: null, v2: null })
const p2: Params = reactive({ v1: null, v2: null })
const p3: Params = reactive({ v1: null, v2: null })
const p4: Params = reactive({ v1: null, v2: null })
const p5: Params = reactive({ v1: null, v2: null })
const p6: Params = reactive({ v1: null, v2: null })
const p7: Params = reactive({ v1: null, v2: null })

// Helper to format numbers based on user's locale
function formatNumber(num: number): string {
  if (!isFinite(num)) return '...'
  const rounded = Math.round(num * 100) / 100
  return new Intl.NumberFormat(locale.value, { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(rounded)
}

// Validation helper
function isValid(v1: number | null, v2: number | null): boolean {
  return v1 !== null && v2 !== null && !isNaN(v1) && !isNaN(v2)
}

const r1 = computed(() => {
  const { v1, v2 } = p1
  if (isValid(v1, v2)) return formatNumber((v1! / 100) * v2!)
  return '...'
})

const r2 = computed(() => {
  const { v1, v2 } = p2
  if (isValid(v1, v2) && v2 !== 0) return formatNumber((v1! / v2!) * 100) + '%'
  return '...'
})

const r3 = computed(() => {
  const { v1, v2 } = p3
  if (isValid(v1, v2) && v2 !== 0) return formatNumber(v1! / (v2! / 100))
  return '...'
})

const r4 = computed(() => {
  const { v1, v2 } = p4
  if (isValid(v1, v2)) return formatNumber(v1! * (1 + v2! / 100))
  return '...'
})

const r5 = computed(() => {
  const { v1, v2 } = p5
  if (isValid(v1, v2)) return formatNumber(v1! * (1 - v2! / 100))
  return '...'
})

const r5b = computed(() => {
  const { v1, v2 } = p5
  if (isValid(v1, v2)) return formatNumber(v1! * (v2! / 100))
  return '...'
})

const r6 = computed(() => {
  const { v1, v2 } = p6
  if (isValid(v1, v2) && v1 !== 0) {
    const diff = v2! - v1!
    const percentage = Math.abs(diff / v1!) * 100
    const sign = diff > 0 ? '+' : diff < 0 ? '-' : ''
    return `${sign}${formatNumber(percentage)}%`
  }
  return '...'
})

const r7 = computed(() => {
  const { v1, v2 } = p7
  if (isValid(v1, v2) && v2! < 100) return formatNumber(v1! / (1 - v2! / 100))
  return '...'
})

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f1'),
    t('f2'),
    t('f3'),
    t('f4'),
    t('f5'),
    t('f6')
  ],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') },
    { question: t('faq_6_q'), answer: t('faq_6_a') },
    { question: t('faq_7_q'), answer: t('faq_7_a') }
  ]
})

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

defineI18nRoute({
  paths: {
    en: '/percentage-calculator',
    pt: '/calculadora-de-porcentagem',
    es: '/calculadora-de-porcentaje',
    fr: '/calculatrice-de-pourcentage',
    it: '/calcolatrice-di-percentuale',
    id: '/kalkulator-persentase',
    de: '/prozentrechner',
    nl: '/percentagecalculator',
    ru: '/kalkulyator-procentov'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="true"
    :see-also-links="[
      { label: t('see1'), to: 'list-randomizer' },
      { label: t('see2'), to: 'dice-roller' },
      { label: t('see3'), to: 'simple-rule-of-three-calculator' },
      { label: t('see4'), to: 'email-extractor' }
    ]"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Calculation 1: X% of Y -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content uppercase tracking-wider px-2">{{ t('what') }}</legend>
        
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p1.v1" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage value" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <label class="fieldset-label font-bold text-sm text-base-content uppercase tracking-wider mb-2">{{ t('of') }}</label>
        <input type="number" v-model.number="p1.v2" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Base value" />

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm font-bold mr-2">{{ t('answer') }}</span>
          <span class="text-2xl font-black text-primary">{{ r1 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 2: X is what % of Y -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content uppercase tracking-wider px-2">{{ t('value') }}</legend>
        
        <input type="number" v-model.number="p2.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="First value" />

        <label class="fieldset-label font-bold text-sm text-base-content uppercase tracking-wider mb-2">{{ t('rep_of') }}</label>
        <input type="number" v-model.number="p2.v2" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Second value" />

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm font-bold mr-2">{{ t('answer') }}</span>
          <span class="text-2xl font-black text-primary">{{ r2 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 3: X is Y% of how much -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content uppercase tracking-wider px-2">{{ t('value') }}</legend>
        
        <input type="number" v-model.number="p3.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Result value" />

        <label class="fieldset-label font-bold text-sm text-base-content uppercase tracking-wider mb-2">{{ t('rep') }}</label>
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p3.v2" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm font-bold mr-2">{{ t('of') }}</span>
          <span class="text-2xl font-black text-primary">{{ r3 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 4: Percentage Increase -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content uppercase tracking-wider px-2">{{ t('inc') }}</legend>
        
        <input type="number" v-model.number="p4.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Original value" />

        <label class="fieldset-label font-bold text-sm text-base-content uppercase tracking-wider mb-2">{{ t('by') }}</label>
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p4.v2" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage increase" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm font-bold mr-2">{{ t('res') }}</span>
          <span class="text-2xl font-black text-primary">{{ r4 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 5: Percentage Decrease -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content uppercase tracking-wider px-2">{{ t('dec') }}</legend>
        
        <input type="number" v-model.number="p5.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Original value" />

        <label class="fieldset-label font-bold text-sm text-base-content uppercase tracking-wider mb-2">{{ t('by') }}</label>
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p5.v2" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage decrease" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <div class="pt-4 border-t border-base-content/10 w-full flex flex-col">
          <div><span class="text-sm font-bold mr-2">{{ t('res') }}</span><span class="text-2xl font-black text-primary">{{ r5 }}</span></div>
        </div>
      </fieldset>

      <!-- Calculation 6: Percentage Difference -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content uppercase tracking-wider px-2">{{ t('diff') }}</legend>
        
        <input type="number" v-model.number="p6.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="First value" />

        <label class="fieldset-label font-bold text-sm text-base-content uppercase tracking-wider mb-2">{{ t('and') }}</label>
        <input type="number" v-model.number="p6.v2" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Second value" />

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm font-bold mr-2">{{ t('is') }}</span>
          <span class="text-2xl font-black text-primary">{{ r6 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 7: Profit Margin -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content uppercase tracking-wider px-2">{{ t('cost') }}</legend>
        
        <input type="number" v-model.number="p7.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Cost price" />

        <label class="fieldset-label font-bold text-sm text-base-content uppercase tracking-wider mb-2">{{ t('margin') }}</label>
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p7.v2" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Profit margin" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm opacity-60 mr-2">{{ t('sale_price') }}</span>
          <span class="text-2xl font-black text-primary">{{ r7 }}</span>
        </div>
      </fieldset>
    </div>

    <template #info>
      <div class="space-y-8">
        <p class="mb-4">{{ t('desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6') ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[ t('uc1'), t('uc2'), t('uc3'), t('uc4') ]"
        />

        <section>
          <h2 class="text-2xl font-bold mb-4">{{ t('examples_title') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-base-200/40 border border-primary/5 rounded-2xl p-5 space-y-2">
              <h3 class="font-bold text-primary">{{ t('ex1_title') }}</h3>
              <p class="text-sm text-base-content/70 leading-relaxed">{{ t('ex1_desc') }}</p>
            </div>
            <div class="bg-base-200/40 border border-primary/5 rounded-2xl p-5 space-y-2">
              <h3 class="font-bold text-primary">{{ t('ex2_title') }}</h3>
              <p class="text-sm text-base-content/70 leading-relaxed">{{ t('ex2_desc') }}</p>
            </div>
            <div class="bg-base-200/40 border border-primary/5 rounded-2xl p-5 space-y-2">
              <h3 class="font-bold text-primary">{{ t('ex3_title') }}</h3>
              <p class="text-sm text-base-content/70 leading-relaxed">{{ t('ex3_desc') }}</p>
            </div>
            <div class="bg-base-200/40 border border-primary/5 rounded-2xl p-5 space-y-2">
              <h3 class="font-bold text-primary">{{ t('ex4_title') }}</h3>
              <p class="text-sm text-base-content/70 leading-relaxed">{{ t('ex4_desc') }}</p>
            </div>
            <div class="bg-base-200/40 border border-primary/5 rounded-2xl p-5 space-y-2 md:col-span-2">
              <h3 class="font-bold text-primary">{{ t('ex5_title') }}</h3>
              <p class="text-sm text-base-content/70 leading-relaxed">{{ t('ex5_desc') }}</p>
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
            { question: t('faq_5_q'), answer: t('faq_5_a') },
            { question: t('faq_6_q'), answer: t('faq_6_a') },
            { question: t('faq_7_q'), answer: t('faq_7_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Percentage Calculator",
    meta: "Free percentage calculator online. Calculate percentage increase, percentage difference, decrease, and profit margin instantly — results update as you type.",
    desc: "Find percentages, increases, decreases, and differences between values quickly and easily. Perform percentage calculations with speed and precision using our free tool. Calculations are processed in real-time as you enter values, with results displayed automatically on the screen.",
    t2: "Multiple Calculation Types",
    t3: "Seven Calculation Modes Available",
    t4: "Everyday Applications",
    t5: "Professional and Academic Use",
    features_subtitle: "Our calculator offers seven calculation modes to meet your needs: basic percentage to find what percentage one number represents of another; percentage increases to calculate increments; percentage decreases to determine discounts with the amount saved shown; original value to find the starting amount from a percentage; percentage difference to compare changes between two numbers; and profit margin to calculate the selling price from cost and desired margin.",
    how_to_use_title: "How to use",
    step_1_title: "Choose Calculation",
    step_1_desc: "Select the calculation mode that fits your needs from the 7 available options.",
    step_2_title: "Enter Values",
    step_2_desc: "Input your numbers into the corresponding fields. No need to click calculate.",
    step_3_title: "Get Results",
    step_3_desc: "The result is calculated instantly and displayed on the screen as you type.",
    applications_desc: "Use the calculator to calculate restaurant tips, find out how much you save on sales and promotions, compare offers, calculate product selling prices with profit margin, and analyze business growth rates.",
    professional_desc: "The calculator is useful for product pricing with profit margin, evaluating discounts, analyzing performance variations, solving math exercises, and understanding statistical concepts.",
    simplicity_desc: "Make your percentage calculations simpler with our percentage calculator, ideal for students, professionals, shoppers, and anyone who needs quick and accurate results.",
    features_title: "Features",
    use_cases_title: "Use Cases",
    uc1: "Calculating restaurant tips easily.",
    uc2: "Finding out how much you save on sales and promotions.",
    uc3: "Calculating product selling prices with profit margins.",
    uc4: "Analyzing business growth rates and performance variations.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is the difference between percentage decrease and percentage difference?",
    faq_1_a: "Percentage decrease calculates a discount on a starting value (e.g., 20% off $100). Percentage difference compares two independent numbers to show the relative change between them.",
    faq_2_q: "How is the profit margin calculated?",
    faq_2_a: "It uses your cost price and desired margin to find the final sale price, ensuring the specified percentage of the sale price is your actual profit.",
    faq_3_q: "Can I use decimal numbers in my calculations?",
    faq_3_a: "Yes! Our calculator fully supports decimal values for both base numbers and percentages, giving you precise results for complex calculations.",
    what: "What is",
    of: "Of:",
    answer: "Answer:",
    value: "The value",
    rep: "Represents",
    rep_of: "What percentage of",
    inc: "Increasing the value",
    dec: "Decreasing the value",
    by: "By:",
    res: "We obtain:",
    diff: "The difference between",
    and: "And",
    is: "Is:",
    cost: "Cost price",
    margin: "With a profit margin of",
    sale_price: "Sale price:",
    see1: "List Randomizer",
    see2: "Dice Roller",
    see3: "Rule of Three",
    see4: "Email Extractor",
    f1: "Calculate what percentage one number is of another",
    f2: "Percentage increase and decrease with amount saved",
    f3: "Find original value from a known percentage",
    f4: "Percentage difference between two values",
    f5: "Profit margin calculator (cost + margin → sale price)",
    f6: "Real-time results as you type",
    examples_title: "Practical Examples",
    ex1_title: "Calculating a Salary Raise",
    ex1_desc: "Your current salary is $4,000 and you received a 12% raise. Use the 'Increase by' calculator: enter 4000 and 12% to instantly see your new salary of $4,480.",
    ex2_title: "Finding the Price After a Discount",
    ex2_desc: "A $250 jacket is on sale for 30% off. Use the 'Decrease by' calculator: enter 250 and 30% to get the discounted price of $175 — saving you $75.",
    ex3_title: "Setting a Price with Profit Margin",
    ex3_desc: "Your product costs $80 to make and you want a 40% profit margin. Use the profit margin calculator: enter 80 as cost and 40% as margin to get the correct sale price of $133.33.",
    ex4_title: "Comparing Sales Growth",
    ex4_desc: "Revenue went from $18,000 last quarter to $22,500 this quarter. Use the 'Difference between' calculator to instantly see a +25% growth rate.",
    ex5_title: "Finding the Original Price Before a Discount",
    ex5_desc: "You paid $85 for a jacket that was 15% off. Since $85 is 85% of the original price, use the 'X is Y% of how much' calculator: enter 85 as the value and 85 as the percentage. The original price was $100.",
    faq_4_q: "How do I calculate the percentage change between two numbers?",
    faq_4_a: "Use the 'Difference between' calculator. Enter the starting value and the final value — the tool automatically shows the relative change with a +/- sign to indicate increase or decrease.",
    faq_5_q: "How do I find the original price before a discount?",
    faq_5_a: "Use the 'X is Y% of how much' calculator. If an item has a 15% discount, the sale price is 85% of the original. Enter the sale price and 85 as the percentage to instantly find what it cost before the discount.",
    faq_6_q: "Can I calculate a percentage of a percentage?",
    faq_6_a: "Yes. Calculate the first result normally, then use that result as the base for the second calculation. For example, to find 10% of 20% of $500: first calculate 20% of 500 to get $100, then find 10% of $100 to get $10.",
    faq_7_q: "What is considered a good profit margin?",
    faq_7_a: "It depends on the industry. Retail typically targets 10–20%, software and digital products can reach 60–80%, and services usually fall between 20–40%. Use the profit margin calculator to find the exact sale price for any margin goal."
  },
  pt: {
    title: "Calculadora de Porcentagem",
    meta: "Calculadora de porcentagem online grátis. Calcule porcentagem, aumento percentual, desconto e margem de lucro em tempo real — sem precisar clicar em calcular.",
    desc: "Encontre porcentagens, aumentos, reduções e diferenças entre valores de forma simples e instantânea. Realize cálculos percentuais com rapidez e precisão usando nossa ferramenta gratuita. Os cálculos são processados em tempo real conforme você digita os valores nos campos, e os resultados são exibidos automaticamente na tela.",
    t2: "Múltiplos Tipos de Cálculo",
    t3: "Sete Modos de Cálculo Disponíveis",
    t4: "Aplicações no Cotidiano",
    t5: "Uso Profissional e Acadêmico",
    features_subtitle: "Nossa calculadora oferece sete modos de cálculo para atender às suas necessidades: porcentagem básica para descobrir que porcentagem um número representa de outro; aumentos percentuais para calcular acréscimos; reduções percentuais para determinar descontos com exibição do valor economizado; valor original para encontrar o valor inicial a partir de uma porcentagem; diferença percentual para comparar variações entre dois números; e margem de lucro para calcular o preço de venda a partir do custo e da margem desejada.",
    how_to_use_title: "Como usar",
    step_1_title: "Escolher Cálculo",
    step_1_desc: "Selecione o modo de cálculo que atende à sua necessidade dentre as 7 opções.",
    step_2_title: "Inserir Valores",
    step_2_desc: "Digite os números nos campos correspondentes. Não é necessário clicar em calcular.",
    step_3_title: "Ver Resultados",
    step_3_desc: "O resultado é calculado instantaneamente e exibido na tela enquanto você digita.",
    applications_desc: "Use a calculadora para calcular gorjetas em restaurantes, determinar o valor economizado em promoções, comparar ofertas, calcular o preço de venda de produtos com margem de lucro e analisar taxas de crescimento empresarial.",
    professional_desc: "A calculadora é útil para precificação de produtos com margem de lucro, avaliação de descontos e promoções, análise de variações de performance, resolução de exercícios de matemática e compreensão de conceitos estatísticos.",
    simplicity_desc: "Torne seus cálculos de porcentagem mais simples com nossa calculadora de porcentagens, ideal para estudantes, profissionais, compradores e qualquer pessoa que precise de respostas rápidas e precisas.",
    features_title: "Funcionalidades",
    use_cases_title: "Casos de Uso",
    uc1: "Calcular gorjetas em restaurantes com facilidade.",
    uc2: "Descobrir o valor economizado em promoções e liquidações.",
    uc3: "Calcular preços de venda de produtos incluindo a margem de lucro desejada.",
    uc4: "Analisar taxas de crescimento empresarial e variações de performance.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Qual a diferença entre redução percentual e diferença percentual?",
    faq_1_a: "A redução percentual calcula um desconto sobre um valor inicial (ex: 20% de desconto em R$ 100). A diferença percentual compara dois números independentes para mostrar a variação relativa entre eles.",
    faq_2_q: "Como a margem de lucro é calculada?",
    faq_2_a: "A ferramenta usa o preço de custo e a margem desejada para encontrar o preço de venda final, garantindo que a porcentagem informada seja o seu lucro real sobre a venda.",
    faq_3_q: "Posso usar números decimais nos cálculos?",
    faq_3_a: "Sim! Nossa calculadora tem suporte completo a valores decimais tanto para os números base quanto para as porcentagens, oferecendo precisão para cálculos complexos.",
    what: "Quanto é",
    of: "De:",
    answer: "Resposta:",
    value: "O valor",
    rep: "Representa",
    rep_of: "Qual porcentagem de",
    inc: "Aumentando o valor",
    dec: "Diminuindo o valor",
    by: "Em:",
    res: "Obtemos:",
    diff: "A diferença entre",
    and: "E",
    is: "É:",
    cost: "Preço de custo",
    margin: "Com margem de lucro de",
    sale_price: "Preço de venda:",
    see1: "Sorteador de Listas",
    see2: "Lançador de Dados",
    see3: "Regra de Três",
    see4: "Extrator de E-mails",
    f1: "Calcula que porcentagem um número representa de outro",
    f2: "Aumento e redução percentual com valor economizado",
    f3: "Encontra o valor original a partir de uma porcentagem",
    f4: "Diferença percentual entre dois valores",
    f5: "Calculadora de margem de lucro (custo + margem → preço de venda)",
    f6: "Resultados em tempo real enquanto você digita",
    examples_title: "Exemplos Práticos",
    ex1_title: "Calculando um Aumento de Salário",
    ex1_desc: "Seu salário atual é R$ 4.000 e você recebeu um aumento de 12%. Use a calculadora 'Aumentando o valor': insira 4000 e 12% para ver instantaneamente seu novo salário de R$ 4.480.",
    ex2_title: "Encontrando o Preço Após um Desconto",
    ex2_desc: "Uma jaqueta de R$ 250 está com 30% de desconto. Use a calculadora 'Diminuindo o valor': insira 250 e 30% para obter o preço com desconto de R$ 175 — economizando R$ 75.",
    ex3_title: "Definindo Preço com Margem de Lucro",
    ex3_desc: "Seu produto custa R$ 80 para fabricar e você quer 40% de margem de lucro. Use a calculadora de margem de lucro: insira 80 como custo e 40% como margem para obter o preço de venda correto de R$ 133,33.",
    ex4_title: "Comparando Crescimento de Vendas",
    ex4_desc: "A receita foi de R$ 18.000 no trimestre passado para R$ 22.500 neste. Use a calculadora 'A diferença entre' para ver instantaneamente um crescimento de +25%.",
    ex5_title: "Encontrando o Preço Original Antes do Desconto",
    ex5_desc: "Você pagou R$ 85 por uma jaqueta com 15% de desconto. Como R$ 85 é 85% do preço original, use a calculadora de 'valor original': insira 85 como valor e 85 como porcentagem. O preço original era R$ 100.",
    faq_4_q: "Como calcular a variação percentual entre dois números?",
    faq_4_a: "Use a calculadora 'A diferença entre'. Insira o valor inicial e o valor final — a ferramenta mostra automaticamente a variação relativa com sinal + ou - para indicar aumento ou redução.",
    faq_5_q: "Como encontrar o preço original antes de um desconto?",
    faq_5_a: "Use a calculadora de valor original. Se um item tem 15% de desconto, o preço pago representa 85% do original. Insira o preço pago e 85 como porcentagem para descobrir o valor antes do desconto.",
    faq_6_q: "Posso calcular uma porcentagem de uma porcentagem?",
    faq_6_a: "Sim. Calcule o primeiro resultado normalmente e use esse resultado como base para o segundo cálculo. Por exemplo, para 10% de 20% de R$ 500: primeiro calcule 20% de 500 (R$ 100), depois 10% de R$ 100 (R$ 10).",
    faq_7_q: "O que é considerada uma boa margem de lucro?",
    faq_7_a: "Depende do setor. O varejo geralmente mira entre 10–20%, software e produtos digitais podem chegar a 60–80%, e serviços costumam ficar entre 20–40%. Use a calculadora de margem de lucro para encontrar o preço de venda exato para qualquer meta."
  },
  es: {
    title: "Calculadora de Porcentajes",
    meta: "Calculadora de porcentaje online gratis. Calcula porcentaje, aumentos, descuentos y margen de beneficio al instante — los resultados se actualizan mientras escribes.",
    desc: "Encuentra porcentajes, aumentos, reducciones y diferencias entre valores de forma sencilla e instantánea. Realiza cálculos porcentuales con rapidez y precisión usando nuestra herramienta gratuita. Los cálculos se procesan en tiempo real a medida que introduces los valores en los campos, y los resultados se muestran automáticamente en pantalla.",
    t2: "Múltiples Tipos de Cálculo",
    t3: "Siete Modos de Cálculo Disponibles",
    t4: "Aplicaciones Cotidianas",
    t5: "Uso Profesional y Académico",
    features_subtitle: "Nuestra calculadora ofrece siete modos de cálculo para satisfacer tus necesidades: porcentaje básico para descubrir qué porcentaje representa un número de otro; aumentos porcentuales para calcular incrementos; reducciones porcentuales para determinar descuentos mostrando el valor ahorrado; valor original para encontrar el valor inicial a partir de un porcentaje; diferencia porcentual para comparar variaciones entre dos números; y margen de ganancia para calcular el precio de venta a partir del costo y del margen deseado.",
    how_to_use_title: "Cómo usar",
    step_1_title: "Elegir Cálculo",
    step_1_desc: "Selecciona el modo de cálculo que se ajuste a tus necesidades entre las 7 opciones.",
    step_2_title: "Ingresar Valores",
    step_2_desc: "Introduce los números en los campos correspondientes. No es necesario hacer clic en calcular.",
    step_3_title: "Ver Resultados",
    step_3_desc: "El resultado se calcula al instante y se muestra en pantalla mientras escribes.",
    applications_desc: "Usa la calculadora para calcular propinas en restaurantes, determinar el valor ahorrado en promociones, comparar ofertas, calcular el precio de venta de productos con margen de ganancia y analizar tasas de crecimiento empresarial.",
    professional_desc: "La calculadora es útil para fijar precios de productos con margen de ganancia, evaluar descuentos y promociones, analizar variaciones de rendimiento, resolver ejercicios de matemáticas y comprender conceptos estadísticos.",
    simplicity_desc: "Simplifica tus cálculos de porcentaje con nuestra calculadora de porcentajes, ideal para estudiantes, profesionales, compradores y cualquier persona que necesite respuestas rápidas y precisas.",
    features_title: "Funcionalidades",
    use_cases_title: "Casos de Uso",
    uc1: "Calcular propinas en restaurantes fácilmente.",
    uc2: "Saber cuánto ahorras en rebajas y promociones.",
    uc3: "Calcular precios de venta de productos con margen de beneficio.",
    uc4: "Analizar tasas de crecimiento empresarial y variaciones de rendimiento.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cuál es la diferencia entre reducción porcentual y diferencia porcentual?",
    faq_1_a: "La reducción porcentual calcula un descuento sobre un valor inicial (ej. 20% de descuento en $100). La diferencia porcentual compara dos números independientes para mostrar la variación relativa entre ellos.",
    faq_2_q: "¿Cómo se calcula el margen de ganancia?",
    faq_2_a: "La herramienta utiliza el precio de costo y el margen deseado para calcular el precio de venta final, asegurando que el porcentaje indicado sea su ganancia real sobre la venta.",
    faq_3_q: "¿Puedo usar números decimales en mis cálculos?",
    faq_3_a: "¡Sí! Nuestra calculadora admite valores decimales tanto para los números base como para los porcentajes, brindando precisión en cálculos complejos.",
    what: "Cuánto es",
    of: "De:",
    answer: "Respuesta:",
    value: "El valor",
    rep: "Representa",
    rep_of: "Qué porcentaje representa de",
    inc: "Aumentando el valor",
    dec: "Disminuyendo el valor",
    by: "En:",
    res: "Obtenemos:",
    diff: "La diferencia entre",
    and: "Y",
    is: "Es:",
    cost: "Precio de costo",
    margin: "Con un margen de ganancia de",
    sale_price: "Precio de venta:",
    see1: "Aleatorizador de Listas",
    see2: "Lanzador de Dados",
    see3: "Regla de Tres",
    see4: "Extractor de Emails",
    f1: "Calcula qué porcentaje representa un número de otro",
    f2: "Aumento y reducción porcentual con valor ahorrado",
    f3: "Encuentra el valor original a partir de un porcentaje",
    f4: "Diferencia porcentual entre dos valores",
    f5: "Calculadora de margen de ganancia (costo + margen → precio de venta)",
    f6: "Resultados en tiempo real mientras escribes",
    examples_title: "Ejemplos Prácticos",
    ex1_title: "Calculando un Aumento de Sueldo",
    ex1_desc: "Tu sueldo actual es $4.000 y recibiste un aumento del 12%. Usa la calculadora 'Aumentando el valor': ingresa 4000 y 12% para ver al instante tu nuevo sueldo de $4.480.",
    ex2_title: "Encontrando el Precio con Descuento",
    ex2_desc: "Una chaqueta de $250 tiene un 30% de descuento. Usa la calculadora 'Disminuyendo el valor': ingresa 250 y 30% para obtener el precio con descuento de $175 — ahorrando $75.",
    ex3_title: "Fijando Precio con Margen de Ganancia",
    ex3_desc: "Tu producto cuesta $80 fabricarlo y quieres un 40% de margen de ganancia. Usa la calculadora de margen de ganancia: ingresa 80 como costo y 40% como margen para obtener el precio de venta correcto de $133,33.",
    ex4_title: "Comparando el Crecimiento de Ventas",
    ex4_desc: "Las ventas pasaron de $18.000 el trimestre pasado a $22.500 este trimestre. Usa la calculadora 'La diferencia entre' para ver al instante un crecimiento de +25%.",
    ex5_title: "Encontrando el Precio Original Antes del Descuento",
    ex5_desc: "Pagaste $85 por una chaqueta con 15% de descuento. Como $85 es el 85% del precio original, usa la calculadora de valor original: ingresa 85 como valor y 85 como porcentaje. El precio original era $100.",
    faq_4_q: "¿Cómo calcular el cambio porcentual entre dos números?",
    faq_4_a: "Usa la calculadora 'La diferencia entre'. Ingresa el valor inicial y el valor final — la herramienta muestra automáticamente el cambio relativo con signo + o - para indicar aumento o disminución.",
    faq_5_q: "¿Cómo encontrar el precio original antes de un descuento?",
    faq_5_a: "Usa la calculadora de valor original. Si un artículo tiene 15% de descuento, el precio pagado representa el 85% del original. Ingresa el precio pagado y 85 como porcentaje para encontrar el valor antes del descuento.",
    faq_6_q: "¿Puedo calcular un porcentaje de un porcentaje?",
    faq_6_a: "Sí. Calcula el primer resultado normalmente y usa ese resultado como base para el segundo cálculo. Por ejemplo, para el 10% del 20% de $500: primero calcula el 20% de 500 ($100), luego el 10% de $100 ($10).",
    faq_7_q: "¿Qué se considera un buen margen de ganancia?",
    faq_7_a: "Depende del sector. El comercio minorista generalmente apunta a un 10–20%, el software y los productos digitales pueden llegar al 60–80%, y los servicios suelen estar entre el 20–40%. Usa la calculadora de margen de ganancia para encontrar el precio de venta exacto para cualquier objetivo."
  },
  fr: {
    title: "Calculatrice de Pourcentage",
    meta: "Calculatrice pourcentage en ligne gratuite. Calculez des pourcentages, augmentations, réductions et marges bénéficiaires instantanément — résultats en temps réel.",
    desc: "Trouvez des pourcentages, des augmentations, des réductions et des différences entre valeurs de façon simple et instantanée. Effectuez des calculs de pourcentage rapidement et précisément avec notre outil gratuit. Les calculs sont traités en temps réel lorsque vous saisissez les valeurs dans les champs, et les résultats s'affichent automatiquement à l'écran.",
    t2: "Multiples Types de Calcul",
    t3: "Sept Modes de Calcul Disponibles",
    t4: "Applications Quotidiennes",
    t5: "Usage Professionnel et Académique",
    features_subtitle: "Notre calculatrice propose sept modes de calcul pour répondre à vos besoins : pourcentage de base pour savoir quel pourcentage un nombre représente d'un autre ; augmentations en pourcentage pour calculer des hausses ; réductions en pourcentage pour déterminer des remises avec affichage du montant économisé ; valeur d'origine pour retrouver le montant initial à partir d'un pourcentage ; différence en pourcentage pour comparer les variations entre deux nombres ; et marge bénéficiaire pour calculer le prix de vente à partir du coût et de la marge souhaitée.",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Choisir le Calcul",
    step_1_desc: "Sélectionnez le mode de calcul adapté à vos besoins parmi les 7 options.",
    step_2_title: "Entrer les Valeurs",
    step_2_desc: "Saisissez les nombres dans les champs correspondants. Inutile de cliquer sur calculer.",
    step_3_title: "Voir les Résultats",
    step_3_desc: "Le résultat est calculé instantanément et affiché à l'écran pendant la saisie.",
    applications_desc: "Utilisez la calculatrice pour calculer les pourboires au restaurant, déterminer le montant économisé lors de promotions, comparer des offres, calculer le prix de vente de produits avec marge bénéficiaire et analyser les taux de croissance d'une entreprise.",
    professional_desc: "La calculatrice est utile pour fixer le prix de produits avec marge bénéficiaire, évaluer des remises et des promotions, analyser des variations de performance, résoudre des exercices de mathématiques et comprendre des concepts statistiques.",
    simplicity_desc: "Simplifiez vos calculs de pourcentage avec notre calculatrice de pourcentage, idéale pour les étudiants, les professionnels, les consommateurs et toute personne qui a besoin de réponses rapides et précises.",
    features_title: "Fonctionnalités",
    use_cases_title: "Cas d'Utilisation",
    uc1: "Calculer facilement les pourboires au restaurant.",
    uc2: "Découvrir combien vous économisez pendant les soldes et promotions.",
    uc3: "Calculer les prix de vente des produits avec une marge bénéficiaire.",
    uc4: "Analyser les taux de croissance des entreprises et les variations de performance.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Quelle est la différence entre la réduction en pourcentage et la différence en pourcentage ?",
    faq_1_a: "La réduction calcule une remise sur une valeur initiale (ex. 20% de réduction sur 100€). La différence compare deux nombres indépendants pour montrer la variation relative entre eux.",
    faq_2_q: "Comment la marge bénéficiaire est-elle calculée ?",
    faq_2_a: "L'outil utilise le prix de revient et la marge souhaitée pour trouver le prix de vente final, garantissant que le pourcentage indiqué est votre bénéfice réel sur la vente.",
    faq_3_q: "Puis-je utiliser des nombres décimaux dans mes calculs ?",
    faq_3_a: "Oui ! Notre calculatrice prend entièrement en charge les valeurs décimales pour les nombres de base et les pourcentages, offrant une grande précision pour les calculs complexes.",
    what: "Quel est",
    of: "De:",
    answer: "Réponse:",
    value: "La valeur",
    rep: "Représente",
    rep_of: "Quel pourcentage de",
    inc: "Augmenter la valeur",
    dec: "Diminuer la valeur",
    by: "De:",
    res: "Nous obtenons:",
    diff: "La différence entre",
    and: "Et",
    is: "Est:",
    cost: "Prix de revient",
    margin: "Avec une marge bénéficiaire de",
    sale_price: "Prix de vente:",
    see1: "Mélangeur de Listes",
    see2: "Lanceur de Dés",
    see3: "Règle de Trois",
    see4: "Extracteur d'Emails",
    f1: "Calculez quel pourcentage un nombre représente d'un autre",
    f2: "Augmentation et réduction en pourcentage avec montant économisé",
    f3: "Trouvez la valeur originale à partir d'un pourcentage",
    f4: "Différence en pourcentage entre deux valeurs",
    f5: "Calculatrice de marge bénéficiaire (coût + marge → prix de vente)",
    f6: "Résultats en temps réel pendant la saisie",
    examples_title: "Exemples Pratiques",
    ex1_title: "Calculer une Augmentation de Salaire",
    ex1_desc: "Ton salaire actuel est de 4 000€ et tu as reçu une augmentation de 12%. Utilise la calculatrice 'Augmenter la valeur' : saisis 4000 et 12% pour voir instantanément ton nouveau salaire de 4 480€.",
    ex2_title: "Trouver le Prix Après une Réduction",
    ex2_desc: "Une veste à 250€ est soldée à -30%. Utilise 'Diminuer la valeur' : saisis 250 et 30% pour obtenir le prix réduit de 175€ — soit 75€ d'économie.",
    ex3_title: "Fixer un Prix avec Marge Bénéficiaire",
    ex3_desc: "Ton produit coûte 80€ à fabriquer et tu veux une marge de 40%. Utilise la calculatrice de marge bénéficiaire : saisis 80 comme coût et 40% comme marge pour obtenir le bon prix de vente de 133,33€.",
    ex4_title: "Comparer la Croissance des Ventes",
    ex4_desc: "Le chiffre d'affaires est passé de 18 000€ le trimestre dernier à 22 500€ ce trimestre. Utilise 'La différence entre' pour voir instantanément une croissance de +25%.",
    ex5_title: "Retrouver le Prix Original Avant Remise",
    ex5_desc: "Tu as payé 85€ pour une veste remisée de 15%. Comme 85€ correspond à 85% du prix original, utilise la calculatrice de valeur d'origine : saisis 85 comme valeur et 85 comme pourcentage. Le prix original était 100€.",
    faq_4_q: "Comment calculer la variation en pourcentage entre deux nombres ?",
    faq_4_a: "Utilise la calculatrice 'La différence entre'. Saisis la valeur de départ et la valeur finale — l'outil affiche automatiquement la variation relative avec un signe + ou - pour indiquer une hausse ou une baisse.",
    faq_5_q: "Comment retrouver le prix initial avant une remise ?",
    faq_5_a: "Utilise la calculatrice de valeur d'origine. Si un article est remisé de 15%, le prix payé représente 85% du prix original. Saisis le prix payé et 85 comme pourcentage pour retrouver le prix avant remise.",
    faq_6_q: "Peut-on calculer un pourcentage d'un pourcentage ?",
    faq_6_a: "Oui. Calcule d'abord le premier résultat normalement, puis utilise ce résultat comme base pour le second calcul. Par exemple, pour 10% de 20% de 500€ : calcule d'abord 20% de 500 (100€), puis 10% de 100€ (10€).",
    faq_7_q: "Quel est un bon taux de marge bénéficiaire ?",
    faq_7_a: "Cela dépend du secteur. Le commerce de détail vise généralement 10–20%, les logiciels et produits numériques peuvent atteindre 60–80%, et les services se situent souvent entre 20–40%. Utilise la calculatrice de marge pour trouver le prix de vente exact pour n'importe quel objectif."
  },
  it: {
    title: "Calcolatrice Percentuale",
    meta: "Calcolatrice percentuale online gratuita. Calcola percentuale, aumento percentuale, sconto e margine di profitto in tempo reale — risultati aggiornati mentre digiti.",
    desc: "Trova percentuali, aumenti, riduzioni e differenze tra valori in modo semplice e istantaneo. Esegui calcoli percentuali con rapidità e precisione usando il nostro strumento gratuito. I calcoli vengono elaborati in tempo reale mentre inserisci i valori nei campi, e i risultati vengono mostrati automaticamente sullo schermo.",
    t2: "Molteplici Tipi di Calcolo",
    t3: "Sette Modalità di Calcolo Disponibili",
    t4: "Applicazioni Quotidiane",
    t5: "Uso Professionale e Accademico",
    features_subtitle: "La nostra calcolatrice offre sette modalità di calcolo per soddisfare le tue esigenze: percentuale di base per scoprire quale percentuale un numero rappresenta di un altro; aumenti percentuali per calcolare incrementi; riduzioni percentuali per determinare sconti con visualizzazione dell'importo risparmiato; valore originale per trovare il valore iniziale a partire da una percentuale; differenza percentuale per confrontare variazioni tra due numeri; e margine di profitto per calcolare il prezzo di vendita a partire dal costo e dal margine desiderato.",
    how_to_use_title: "Come usare",
    step_1_title: "Scegliere Calcolo",
    step_1_desc: "Seleziona la modalità di calcolo più adatta alle tue esigenze tra le 7 opzioni.",
    step_2_title: "Inserire i Valori",
    step_2_desc: "Inserisci i numeri nei campi corrispondenti. Non è necessario cliccare su calcola.",
    step_3_title: "Vedere i Risultati",
    step_3_desc: "Il risultato viene calcolato istantaneamente e mostrato sullo schermo mentre digiti.",
    applications_desc: "Usa la calcolatrice per calcolare mance al ristorante, determinare l'importo risparmiato nelle promozioni, confrontare offerte, calcolare il prezzo di vendita dei prodotti con margine di profitto e analizzare tassi di crescita aziendale.",
    professional_desc: "La calcolatrice è utile per la determinazione dei prezzi dei prodotti con margine di profitto, la valutazione di sconti e promozioni, l'analisi delle variazioni di performance, la risoluzione di esercizi di matematica e la comprensione di concetti statistici.",
    simplicity_desc: "Rendi più semplici i tuoi calcoli percentuali con la nostra calcolatrice di percentuali, ideale per studenti, professionisti, acquirenti e chiunque abbia bisogno di risposte rapide e precise.",
    features_title: "Funzionalità",
    use_cases_title: "Casi d'Uso",
    uc1: "Calcolare facilmente le mance al ristorante.",
    uc2: "Scoprire quanto risparmi durante i saldi e le promozioni.",
    uc3: "Calcolare i prezzi di vendita dei prodotti con margine di profitto.",
    uc4: "Analizzare i tassi di crescita aziendale e le variazioni di performance.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Qual è la differenza tra riduzione percentuale e differenza percentuale?",
    faq_1_a: "La riduzione calcola uno sconto su un valore iniziale (es. 20% di sconto su 100€). La differenza confronta due numeri indipendenti per mostrare la variazione relativa tra loro.",
    faq_2_q: "Come viene calcolato il margine di profitto?",
    faq_2_a: "Lo strumento utilizza il prezzo di costo e il margine desiderato per trovare il prezzo di vendita finale, assicurando che la percentuale indicata sia il tuo profitto reale sulla vendita.",
    faq_3_q: "Posso usare numeri decimali nei miei calcoli?",
    faq_3_a: "Sì! La nostra calcolatrice supporta pienamente i valori decimali sia per i numeri base che per le percentuali, offrendo precisione per calcoli complessi.",
    what: "Quanto è",
    of: "Di:",
    answer: "Risposta:",
    value: "Il valore",
    rep: "Rappresenta",
    rep_of: "Che percentuale rappresenta di",
    inc: "Aumentando il valore",
    dec: "Diminuendo il valore",
    by: "Di:",
    res: "Otteniamo:",
    diff: "La differenza tra",
    and: "E",
    is: "È:",
    cost: "Prezzo di costo",
    margin: "Con un margine di profitto del",
    sale_price: "Prezzo di vendita:",
    see1: "Randomizzatore di Liste",
    see2: "Lanciatore di Dadi",
    see3: "Regola di Tre",
    see4: "Estrattore di Email",
    f1: "Calcola quale percentuale un numero rappresenta di un altro",
    f2: "Aumento e riduzione percentuale con importo risparmiato",
    f3: "Trova il valore originale da una percentuale",
    f4: "Differenza percentuale tra due valori",
    f5: "Calcolatrice del margine di profitto (costo + margine → prezzo di vendita)",
    f6: "Risultati in tempo reale mentre digiti",
    examples_title: "Esempi Pratici",
    ex1_title: "Calcolare un Aumento di Stipendio",
    ex1_desc: "Il tuo stipendio attuale è €4.000 e hai ricevuto un aumento del 12%. Usa la calcolatrice 'Aumentando il valore': inserisci 4000 e 12% per vedere subito il nuovo stipendio di €4.480.",
    ex2_title: "Trovare il Prezzo Dopo uno Sconto",
    ex2_desc: "Una giacca da €250 è in saldo al 30%. Usa 'Diminuendo il valore': inserisci 250 e 30% per ottenere il prezzo scontato di €175 — risparmiando €75.",
    ex3_title: "Impostare un Prezzo con Margine di Profitto",
    ex3_desc: "Il tuo prodotto costa €80 da produrre e vuoi un margine del 40%. Usa la calcolatrice del margine di profitto: inserisci 80 come costo e 40% come margine per ottenere il prezzo di vendita corretto di €133,33.",
    ex4_title: "Confrontare la Crescita delle Vendite",
    ex4_desc: "Il fatturato è passato da €18.000 il trimestre scorso a €22.500 questo trimestre. Usa 'La differenza tra' per vedere subito una crescita del +25%.",
    ex5_title: "Trovare il Prezzo Originale Prima dello Sconto",
    ex5_desc: "Hai pagato €85 per una giacca scontata del 15%. Poiché €85 è l'85% del prezzo originale, usa la calcolatrice del valore originale: inserisci 85 come valore e 85 come percentuale. Il prezzo originale era €100.",
    faq_4_q: "Come si calcola la variazione percentuale tra due numeri?",
    faq_4_a: "Usa la calcolatrice 'La differenza tra'. Inserisci il valore iniziale e il valore finale — lo strumento mostra automaticamente la variazione relativa con il segno + o - per indicare un aumento o una riduzione.",
    faq_5_q: "Come si trova il prezzo originale prima di uno sconto?",
    faq_5_a: "Usa la calcolatrice del valore originale. Se un articolo ha il 15% di sconto, il prezzo pagato rappresenta l'85% dell'originale. Inserisci il prezzo pagato e 85 come percentuale per trovare il valore prima dello sconto.",
    faq_6_q: "Posso calcolare una percentuale di una percentuale?",
    faq_6_a: "Sì. Calcola prima il primo risultato normalmente, poi usa quel risultato come base per il secondo calcolo. Ad esempio, per il 10% del 20% di €500: calcola prima il 20% di 500 (€100), poi il 10% di €100 (€10).",
    faq_7_q: "Qual è considerato un buon margine di profitto?",
    faq_7_a: "Dipende dal settore. Il commercio al dettaglio punta generalmente al 10–20%, il software e i prodotti digitali possono raggiungere il 60–80%, e i servizi di solito si collocano tra il 20–40%. Usa la calcolatrice del margine per trovare il prezzo di vendita esatto per qualsiasi obiettivo."
  },
  id: {
    title: "Kalkulator Persentase",
    meta: "Kalkulator persentase online gratis. Hitung persentase, kenaikan, diskon, dan margin keuntungan secara instan — hasil langsung muncul saat Anda mengetik.",
    desc: "Temukan persentase, kenaikan, penurunan, dan perbedaan antar nilai dengan mudah dan instan. Lakukan perhitungan persentase dengan cepat dan akurat menggunakan alat gratis kami. Perhitungan diproses secara real-time saat Anda mengetik nilai di kolom, dan hasilnya otomatis ditampilkan di layar.",
    t2: "Berbagai Jenis Perhitungan",
    t3: "Tujuh Mode Perhitungan Tersedia",
    t4: "Aplikasi Sehari-hari",
    t5: "Penggunaan Profesional dan Akademik",
    features_subtitle: "Kalkulator kami menawarkan tujuh mode perhitungan untuk memenuhi kebutuhan Anda: persentase dasar untuk mengetahui berapa persen suatu angka dari angka lain; kenaikan persentase untuk menghitung penambahan; penurunan persentase untuk menentukan diskon dengan menampilkan jumlah yang dihemat; nilai awal untuk menemukan nilai semula dari sebuah persentase; perbedaan persentase untuk membandingkan perubahan antara dua angka; dan margin keuntungan untuk menghitung harga jual berdasarkan biaya dan margin yang diinginkan.",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Pilih Perhitungan",
    step_1_desc: "Pilih mode perhitungan yang sesuai dengan kebutuhan Anda dari 7 opsi yang tersedia.",
    step_2_title: "Masukkan Nilai",
    step_2_desc: "Ketik angka pada kolom yang sesuai. Tidak perlu mengklik tombol hitung.",
    step_3_title: "Lihat Hasil",
    step_3_desc: "Hasilnya dihitung secara instan dan ditampilkan di layar saat Anda mengetik.",
    applications_desc: "Gunakan kalkulator untuk menghitung tip di restoran, menentukan jumlah yang dihemat saat promosi, membandingkan penawaran, menghitung harga jual produk dengan margin keuntungan, dan menganalisis tingkat pertumbuhan bisnis.",
    professional_desc: "Kalkulator ini berguna untuk penetapan harga produk dengan margin keuntungan, evaluasi diskon dan promosi, analisis variasi performa, penyelesaian latihan matematika, dan pemahaman konsep statistik.",
    simplicity_desc: "Buat perhitungan persentase Anda lebih sederhana dengan kalkulator persentase kami, ideal untuk pelajar, profesional, pembeli, dan siapa pun yang membutuhkan jawaban cepat dan akurat.",
    features_title: "Fitur",
    use_cases_title: "Contoh Penggunaan",
    uc1: "Menghitung tip di restoran dengan mudah.",
    uc2: "Mengetahui berapa banyak uang yang Anda hemat saat promosi dan diskon.",
    uc3: "Menghitung harga jual produk dengan margin keuntungan.",
    uc4: "Menganalisis tingkat pertumbuhan bisnis dan variasi kinerja.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apa perbedaan antara penurunan persentase dan perbedaan persentase?",
    faq_1_a: "Penurunan persentase menghitung diskon pada nilai awal (misalnya diskon 20% dari $100). Perbedaan persentase membandingkan dua angka independen untuk menunjukkan perubahan relatif di antara keduanya.",
    faq_2_q: "Bagaimana margin keuntungan dihitung?",
    faq_2_a: "Alat ini menggunakan harga biaya dan margin yang diinginkan untuk menentukan harga jual akhir, memastikan persentase yang ditentukan adalah keuntungan nyata Anda dari penjualan.",
    faq_3_q: "Bisakah saya menggunakan angka desimal dalam perhitungan?",
    faq_3_a: "Ya! Kalkulator kami sepenuhnya mendukung nilai desimal untuk angka dasar maupun persentase, memberikan Anda hasil yang akurat untuk perhitungan rumit.",
    what: "Berapa",
    of: "Dari:",
    answer: "Jawaban:",
    value: "Nilai",
    rep: "Mewakili",
    rep_of: "Berapa persen dari",
    inc: "Meningkatkan nilai",
    dec: "Mengurangi nilai",
    by: "Sebesar:",
    res: "Kami memperoleh:",
    diff: "Perbedaan antara",
    and: "Dan",
    is: "Adalah:",
    cost: "Harga biaya",
    margin: "Dengan margin keuntungan sebesar",
    sale_price: "Harga jual:",
    see1: "Pengacak Daftar",
    see2: "Pelempar Dadu",
    see3: "Aturan Tiga",
    see4: "Ekstraktor Email",
    f1: "Hitung berapa persentase satu angka dari angka lainnya",
    f2: "Kenaikan dan penurunan persentase dengan jumlah yang dihemat",
    f3: "Temukan nilai asli dari persentase",
    f4: "Perbedaan persentase antara dua nilai",
    f5: "Kalkulator margin keuntungan (biaya + margin → harga jual)",
    f6: "Hasil real-time saat Anda mengetik",
    examples_title: "Contoh Praktis",
    ex1_title: "Menghitung Kenaikan Gaji",
    ex1_desc: "Gaji Anda saat ini Rp 4.000.000 dan mendapat kenaikan 12%. Gunakan kalkulator 'Meningkatkan nilai': masukkan 4000000 dan 12% untuk langsung melihat gaji baru Rp 4.480.000.",
    ex2_title: "Menemukan Harga Setelah Diskon",
    ex2_desc: "Sebuah jaket seharga Rp 250.000 mendapat diskon 30%. Gunakan 'Mengurangi nilai': masukkan 250000 dan 30% untuk mendapatkan harga diskon Rp 175.000 — menghemat Rp 75.000.",
    ex3_title: "Menetapkan Harga dengan Margin Keuntungan",
    ex3_desc: "Produk Anda berharga Rp 80.000 untuk dibuat dan Anda ingin margin 40%. Gunakan kalkulator margin keuntungan: masukkan 80000 sebagai biaya dan 40% sebagai margin untuk mendapatkan harga jual yang tepat Rp 133.333.",
    ex4_title: "Membandingkan Pertumbuhan Penjualan",
    ex4_desc: "Pendapatan naik dari Rp 18.000.000 kuartal lalu menjadi Rp 22.500.000 kuartal ini. Gunakan 'Perbedaan antara' untuk langsung melihat pertumbuhan +25%.",
    ex5_title: "Menemukan Harga Asli Sebelum Diskon",
    ex5_desc: "Anda membayar Rp 85.000 untuk jaket yang didiskon 15%. Karena Rp 85.000 adalah 85% dari harga asli, gunakan kalkulator nilai awal: masukkan 85000 sebagai nilai dan 85 sebagai persentase. Harga aslinya adalah Rp 100.000.",
    faq_4_q: "Bagaimana cara menghitung perubahan persentase antara dua angka?",
    faq_4_a: "Gunakan kalkulator 'Perbedaan antara'. Masukkan nilai awal dan nilai akhir — alat ini otomatis menampilkan perubahan relatif dengan tanda + atau - untuk menunjukkan kenaikan atau penurunan.",
    faq_5_q: "Bagaimana cara menemukan harga asli sebelum diskon?",
    faq_5_a: "Gunakan kalkulator nilai awal. Jika barang didiskon 15%, harga yang dibayar mewakili 85% dari harga asli. Masukkan harga yang dibayar dan 85 sebagai persentase untuk menemukan nilai sebelum diskon.",
    faq_6_q: "Bisakah saya menghitung persentase dari persentase?",
    faq_6_a: "Bisa. Hitung hasil pertama secara normal, lalu gunakan hasil itu sebagai dasar untuk perhitungan kedua. Misalnya, untuk 10% dari 20% dari Rp 500.000: pertama hitung 20% dari 500.000 (Rp 100.000), lalu 10% dari Rp 100.000 (Rp 10.000).",
    faq_7_q: "Berapa margin keuntungan yang dianggap baik?",
    faq_7_a: "Tergantung industri. Ritel biasanya menargetkan 10–20%, perangkat lunak dan produk digital bisa mencapai 60–80%, dan layanan biasanya berada di antara 20–40%. Gunakan kalkulator margin keuntungan untuk menemukan harga jual yang tepat sesuai target Anda."
  },
  de: {
    title: "Prozentrechner",
    meta: "Kostenloser Prozentrechner online. Prozent berechnen, Erhöhungen, Rabatte und Gewinnmargen — Ergebnisse werden in Echtzeit angezeigt, während du tippst.",
    desc: "Finde Prozentsätze, Erhöhungen, Reduzierungen und Unterschiede zwischen Werten schnell und einfach. Führe Prozentberechnungen mit hoher Geschwindigkeit und Genauigkeit mit unserem kostenlosen Tool aus. Die Berechnungen erfolgen in Echtzeit, während du Werte eingibst, und die Ergebnisse werden automatisch auf dem Bildschirm angezeigt.",
    t2: "Mehrere Berechnungsarten",
    t3: "Sieben Berechnungsmodi verfügbar",
    t4: "Alltägliche Anwendungen",
    t5: "Professionelle und akademische Nutzung",
    features_subtitle: "Unser Rechner bietet sieben Berechnungsmodi für deine Anforderungen: einfache Prozentrechnung, um zu ermitteln, welchen Prozentsatz eine Zahl von einer anderen darstellt; prozentuale Erhöhungen zur Berechnung von Aufschlägen; prozentuale Reduzierungen zur Berechnung von Rabatten; ursprünglicher Wert aus einem bekannten Prozentsatz; prozentuale Differenz zum Vergleich zweier Werte; und Gewinnmarge zur Berechnung des Verkaufspreises aus Kosten und gewünschter Marge.",
    how_to_use_title: "So verwendest du das Tool",
    step_1_title: "Berechnung auswählen",
    step_1_desc: "Wähle den Berechnungsmodus, der zu deinem Bedarf passt, aus den 7 verfügbaren Optionen.",
    step_2_title: "Werte eingeben",
    step_2_desc: "Gib deine Zahlen in die entsprechenden Felder ein. Ein Klick auf Berechnen ist nicht nötig.",
    step_3_title: "Ergebnisse erhalten",
    step_3_desc: "Das Ergebnis wird sofort berechnet und während der Eingabe auf dem Bildschirm angezeigt.",
    applications_desc: "Nutze den Rechner, um Trinkgeld im Restaurant zu berechnen, Ersparnisse bei Angeboten und Aktionen zu ermitteln, Angebote zu vergleichen, Verkaufspreise mit Gewinnmarge zu berechnen und Wachstumsraten im Geschäft zu analysieren.",
    professional_desc: "Der Rechner ist nützlich für Produktpreise mit Gewinnmarge, die Bewertung von Rabatten, die Analyse von Leistungsänderungen, Matheübungen und das Verständnis statistischer Konzepte.",
    simplicity_desc: "Vereinfache deine Prozentberechnungen mit unserem Prozentrechner, ideal für Schüler, Studierende, Berufstätige, Käufer und alle, die schnelle und genaue Ergebnisse benötigen.",
    features_title: "Funktionen",
    use_cases_title: "Anwendungsfälle",
    uc1: "Trinkgeld im Restaurant einfach berechnen.",
    uc2: "Ermitteln, wie viel du bei Angeboten und Aktionen sparst.",
    uc3: "Verkaufspreise von Produkten mit Gewinnmargen berechnen.",
    uc4: "Geschäftswachstum und Leistungsänderungen analysieren.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Was ist der Unterschied zwischen prozentualer Reduzierung und prozentualer Differenz?",
    faq_1_a: "Die prozentuale Reduzierung berechnet einen Rabatt auf einen Ausgangswert, zum Beispiel 20% Rabatt auf 100. Die prozentuale Differenz vergleicht zwei unabhängige Zahlen und zeigt die relative Veränderung zwischen ihnen.",
    faq_2_q: "Wie wird die Gewinnmarge berechnet?",
    faq_2_a: "Das Tool verwendet deinen Kostenpreis und die gewünschte Marge, um den finalen Verkaufspreis zu ermitteln. So entspricht der angegebene Prozentsatz dem tatsächlichen Gewinnanteil am Verkaufspreis.",
    faq_3_q: "Kann ich Dezimalzahlen in meinen Berechnungen verwenden?",
    faq_3_a: "Ja. Unser Rechner unterstützt Dezimalwerte sowohl für Grundzahlen als auch für Prozentsätze und liefert präzise Ergebnisse für komplexe Berechnungen.",
    what: "Was sind",
    of: "Von:",
    answer: "Antwort:",
    value: "Der Wert",
    rep: "Entspricht",
    rep_of: "Welchem Prozentsatz von",
    inc: "Wert erhöhen",
    dec: "Wert verringern",
    by: "Um:",
    res: "Wir erhalten:",
    diff: "Die Differenz zwischen",
    and: "Und",
    is: "Ist:",
    cost: "Kostenpreis",
    margin: "Mit einer Gewinnmarge von",
    sale_price: "Verkaufspreis:",
    see1: "Listen-Zufallsgenerator",
    see2: "Würfelroller",
    see3: "Dreisatzrechner",
    see4: "E-Mail-Extraktor",
    f1: "Berechne, welchen Prozentsatz eine Zahl von einer anderen darstellt",
    f2: "Prozentuale Erhöhung und Reduzierung mit erspartem Betrag",
    f3: "Ursprünglichen Wert aus einem bekannten Prozentsatz finden",
    f4: "Prozentuale Differenz zwischen zwei Werten",
    f5: "Gewinnmargenrechner (Kosten + Marge → Verkaufspreis)",
    f6: "Echtzeitergebnisse während der Eingabe",
    examples_title: "Praktische Beispiele",
    ex1_title: "Gehaltserhöhung berechnen",
    ex1_desc: "Dein Gehalt beträgt 4.000€ und du bekommst 12% mehr. Nutze den Rechner 'Wert erhöhen': gib 4000 und 12% ein und sieh sofort dein neues Gehalt von 4.480€.",
    ex2_title: "Preis nach Rabatt berechnen",
    ex2_desc: "Eine Jacke für 250€ ist um 30% reduziert. Nutze 'Wert verringern': gib 250 und 30% ein und erhalte den Rabattpreis von 175€ — du sparst 75€.",
    ex3_title: "Verkaufspreis mit Gewinnmarge festlegen",
    ex3_desc: "Dein Produkt kostet 80€ in der Herstellung und du willst 40% Gewinnmarge. Nutze den Gewinnmargenrechner: gib 80 als Kosten und 40% als Marge ein, um den korrekten Verkaufspreis von 133,33€ zu erhalten.",
    ex4_title: "Umsatzwachstum vergleichen",
    ex4_desc: "Der Umsatz stieg von 18.000€ im letzten Quartal auf 22.500€ in diesem Quartal. Nutze 'Die Differenz zwischen', um sofort ein Wachstum von +25% zu sehen.",
    ex5_title: "Ursprünglichen Preis vor dem Rabatt ermitteln",
    ex5_desc: "Du hast 85€ für eine Jacke bezahlt, die 15% Rabatt hatte. Da 85€ 85% des Originalpreises sind, nutze den Rechner für den ursprünglichen Wert: gib 85 als Wert und 85 als Prozentsatz ein. Der Originalpreis betrug 100€.",
    faq_4_q: "Wie berechne ich die prozentuale Veränderung zwischen zwei Zahlen?",
    faq_4_a: "Nutze den Rechner 'Die Differenz zwischen'. Gib den Ausgangswert und den Endwert ein — das Tool zeigt automatisch die relative Veränderung mit einem + oder - Zeichen an.",
    faq_5_q: "Wie finde ich den Originalpreis vor einem Rabatt?",
    faq_5_a: "Nutze den Rechner für den ursprünglichen Wert. Bei 15% Rabatt entspricht der bezahlte Preis 85% des Originalpreises. Gib den gezahlten Preis und 85 als Prozentsatz ein, um den Preis vor dem Rabatt zu finden.",
    faq_6_q: "Kann ich einen Prozentsatz eines Prozentsatzes berechnen?",
    faq_6_a: "Ja. Berechne zuerst das erste Ergebnis normal und verwende dieses Ergebnis dann als Basis für die zweite Berechnung. Um zum Beispiel 10% von 20% von 500€ zu finden: berechne zuerst 20% von 500 (100€), dann 10% von 100€ (10€).",
    faq_7_q: "Was gilt als gute Gewinnmarge?",
    faq_7_a: "Das hängt von der Branche ab. Der Einzelhandel zielt typischerweise auf 10–20%, Software und digitale Produkte können 60–80% erreichen, und Dienstleistungen liegen meist zwischen 20–40%. Nutze den Gewinnmargenrechner, um den genauen Verkaufspreis für jedes Ziel zu finden."
  },
  nl: {
    title: "Percentagecalculator",
    meta: "Gratis percentagecalculator online. Bereken percentages, verhogingen, kortingen en winstmarges direct — resultaten verschijnen terwijl je typt.",
    desc: "Vind snel en eenvoudig percentages, verhogingen, verlagingen en verschillen tussen waarden. Voer percentageberekeningen uit met snelheid en precisie met behulp van onze gratis tool. Berekeningen worden realtime verwerkt terwijl je de waarden invoert, en de resultaten worden automatisch op het scherm getoond.",
    t2: "Meerdere soorten berekeningen",
    t3: "Zeven berekeningsmodi beschikbaar",
    t4: "Dagelijkse toepassingen",
    t5: "Professioneel en academisch gebruik",
    features_subtitle: "Onze calculator biedt zeven berekeningsmodi om aan je behoeften te voldoen: basispercentage om te vinden welk percentage het ene getal van het andere vertegenwoordigt; percentageverhogingen om toenames te berekenen; percentageverlagingen om kortingen te bepalen met weergave van het bespaarde bedrag; oorspronkelijke waarde om het startbedrag te vinden vanuit een percentage; percentageverschil om veranderingen tussen twee getallen te vergelijken; en winstmarge om de verkoopprijs te berekenen op basis van de kosten en de gewenste marge.",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Kies berekening",
    step_1_desc: "Selecteer de berekeningsmodus die bij je behoeften past uit de 7 beschikbare opties.",
    step_2_title: "Voer waarden in",
    step_2_desc: "Voer je getallen in de overeenkomstige velden in. Klikken op berekenen is niet nodig.",
    step_3_title: "Krijg resultaten",
    step_3_desc: "Het resultaat wordt direct berekend en op het scherm getoond terwijl je typt.",
    applications_desc: "Gebruik de calculator om fooien in restaurants te berekenen, te ontdekken hoeveel je bespaart bij uitverkoop en promoties, aanbiedingen te vergelijken, verkoopprijzen van producten met winstmarge te berekenen en groeipercentages van bedrijven te analyseren.",
    professional_desc: "De calculator is nuttig voor productbeprijzing met winstmarge, het evalueren van kortingen, het analyseren van prestatievariaties, het oplossen van wiskunde-oefeningen en het begrijpen van statistische concepten.",
    simplicity_desc: "Maak je percentageberekeningen eenvoudiger met onze percentagecalculator, ideaal voor studenten, professionals, shoppers en iedereen die snelle en nauwkeurige resultaten nodig heeft.",
    features_title: "Functies",
    use_cases_title: "Gebruiksvoorbeelden",
    uc1: "Eenvoudig fooien in restaurants berekenen.",
    uc2: "Ontdekken hoeveel je bespaart bij uitverkoop en promoties.",
    uc3: "Verkoopprijzen van producten berekenen met winstmarges.",
    uc4: "Groeipercentages en prestatievariaties van bedrijven analyseren.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is het verschil tussen percentageverlaging en percentageverschil?",
    faq_1_a: "Percentageverlaging berekent een korting op een startwaarde (bijv. 20% korting op €100). Percentageverschil vergelijkt twee onafhankelijke getallen om de relatieve verandering tussen beide te tonen.",
    faq_2_q: "Hoe wordt de winstmarge berekend?",
    faq_2_a: "Het gebruikt je kostprijs en de gewenste marge om de uiteindelijke verkoopprijs te vinden, waarbij het opgegeven percentage van de verkoopprijs je werkelijke winst is.",
    faq_3_q: "Kan ik decimale getallen gebruiken in mijn berekeningen?",
    faq_3_a: "Ja! Onze calculator ondersteunt volledig decimale waarden voor zowel basisgetallen als percentages, waardoor je nauwkeurige resultaten krijgt voor complexe berekeningen.",
    what: "Wat is",
    of: "Van:",
    answer: "Antwoord:",
    value: "De waarde",
    rep: "Vertegenwoordigt",
    rep_of: "Welk percentage van",
    inc: "De waarde verhogen",
    dec: "De waarde verlagen",
    by: "Met:",
    res: "We verkrijgen:",
    diff: "Het verschil tussen",
    and: "En",
    is: "Is:",
    cost: "Kostprijs",
    margin: "Met een winstmarge van",
    sale_price: "Verkoopprijs:",
    see1: "Lijst-randomizer",
    see2: "Dobbelsteenroller",
    see3: "Regel-van-drie-calculator",
    see4: "E-mailextractor",
    f1: "Bereken welk percentage het ene getal van het andere is",
    f2: "Percentageverhoging en -verlaging met bespaard bedrag",
    f3: "Vind de oorspronkelijke waarde vanuit een bekend percentage",
    f4: "Percentageverschil tussen twee waarden",
    f5: "Winstmargecalculator (kosten + marge → verkoopprijs)",
    f6: "Realtime resultaten terwijl je typt",
    examples_title: "Praktische Voorbeelden",
    ex1_title: "Een Salarisverhoging Berekenen",
    ex1_desc: "Je huidige salaris is €4.000 en je hebt 12% loonsverhoging gekregen. Gebruik de 'Waarde verhogen' calculator: voer 4000 en 12% in om meteen je nieuwe salaris van €4.480 te zien.",
    ex2_title: "De Prijs Na Korting Vinden",
    ex2_desc: "Een jas van €250 is 30% afgeprijsd. Gebruik 'Waarde verlagen': voer 250 en 30% in om de kortingsprijs van €175 te krijgen — je bespaart €75.",
    ex3_title: "Prijs Instellen met Winstmarge",
    ex3_desc: "Je product kost €80 om te maken en je wilt een winstmarge van 40%. Gebruik de winstmargecalculator: voer 80 in als kostprijs en 40% als marge om de juiste verkoopprijs van €133,33 te krijgen.",
    ex4_title: "Omzetgroei Vergelijken",
    ex4_desc: "De omzet steeg van €18.000 vorig kwartaal naar €22.500 dit kwartaal. Gebruik 'Het verschil tussen' om meteen een groei van +25% te zien.",
    ex5_title: "Oorspronkelijke Prijs Voor Korting Vinden",
    ex5_desc: "Je betaalde €85 voor een jas met 15% korting. Omdat €85 gelijk is aan 85% van de originele prijs, gebruik je de calculator voor de oorspronkelijke waarde: voer 85 in als waarde en 85 als percentage. De originele prijs was €100.",
    faq_4_q: "Hoe bereken ik de procentuele verandering tussen twee getallen?",
    faq_4_a: "Gebruik de 'Het verschil tussen' calculator. Voer de beginwaarde en de eindwaarde in — het tool toont automatisch de relatieve verandering met een + of - teken om verhoging of verlaging aan te geven.",
    faq_5_q: "Hoe vind ik de originele prijs vóór een korting?",
    faq_5_a: "Gebruik de calculator voor de oorspronkelijke waarde. Bij 15% korting is de betaalde prijs 85% van de originele. Voer de betaalde prijs en 85 als percentage in om de waarde vóór korting te vinden.",
    faq_6_q: "Kan ik een percentage van een percentage berekenen?",
    faq_6_a: "Ja. Bereken eerst het eerste resultaat normaal en gebruik dat resultaat als basis voor de tweede berekening. Bijvoorbeeld, voor 10% van 20% van €500: bereken eerst 20% van 500 (€100), dan 10% van €100 (€10).",
    faq_7_q: "Wat wordt beschouwd als een goede winstmarge?",
    faq_7_a: "Dat hangt af van de sector. De detailhandel richt zich doorgaans op 10–20%, software en digitale producten kunnen 60–80% bereiken, en diensten zitten meestal tussen 20–40%. Gebruik de winstmargecalculator om de exacte verkoopprijs voor elk margedoel te vinden."
  },
  ru: {
    title: "Калькулятор процентов",
    meta: "Бесплатный калькулятор процентов онлайн. Мгновенно рассчитывайте увеличение на процент, процентную разницу, скидки и маржу прибыли — результаты обновляются на лету.",
    desc: "Быстро и легко находите проценты, увеличение, уменьшение и разницу между значениями. Выполняйте процентные расчеты быстро и точно с помощью нашего бесплатного инструмента. Все вычисления происходят в режиме реального времени прямо во время ввода, а результаты мгновенно выводятся на экран.",
    t2: "Несколько типов расчетов",
    t3: "Доступно семь режимов расчета",
    t4: "Повседневное использование",
    t5: "Профессиональное и академическое применение",
    features_subtitle: "Наш калькулятор предлагает семь режимов расчета для любых нужд: базовый процент для нахождения доли одного числа от другого; увеличение на процент для расчета наценок; уменьшение на процент для определения скидки с показом сэкономленной суммы; нахождение исходного значения по известному проценту; процентное различие для сравнения изменений между двумя числами; и маржа прибыли для расчета цены продажи на основе себестоимости и желаемой маржи.",
    how_to_use_title: "Инструкция",
    step_1_title: "Выберите тип расчета",
    step_1_desc: "Выберите один из 7 доступных режимов расчета в соответствии с вашей задачей.",
    step_2_title: "Введите значения",
    step_2_desc: "Просто введите числа в соответствующие поля. Нажимать кнопку «Рассчитать» не требуется.",
    step_3_title: "Получите результат",
    step_3_desc: "Результат рассчитывается мгновенно и отображается на экране прямо по мере ввода.",
    applications_desc: "Используйте калькулятор, чтобы посчитать чаевые в ресторане, узнать размер скидки на распродажах, сравнить предложения, рассчитать продажную стоимость товара с учетом наценки или проанализировать темпы роста бизнеса.",
    professional_desc: "Калькулятор полезен для ценообразования товаров с маржой прибыли, оценки скидок, анализа отклонений показателей эффективности, решения математических задач и понимания статистических концепций.",
    simplicity_desc: "Упростите ваши процентные расчеты с помощью нашего онлайн-калькулятора процентов — идеального инструмента для студентов, профессионалов, покупателей и всех, кому нужны быстрые и точные результаты.",
    features_title: "Возможности",
    use_cases_title: "Варианты использования",
    uc1: "Простой расчет чаевых в ресторанах.",
    uc2: "Быстрое нахождение размера скидки во время распродаж.",
    uc3: "Расчет продажной цены товаров с учетом желаемой маржи прибыли.",
    uc4: "Анализ темпов роста бизнеса и изменений показателей эффективности.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "В чем разница между уменьшением на процент и процентным различием?",
    faq_1_a: "Уменьшение на процент рассчитывает скидку от исходного значения (например, скидка 20% от $100). Процентное различие сравнивает два независимых числа, чтобы показать относительное изменение между ними.",
    faq_2_q: "Как рассчитывается маржа прибыли?",
    faq_2_a: "Инструмент использует себестоимость (цену закупки/производства) и желаемую маржу для определения конечной цены продажи, гарантируя, что указанный процент от цены продажи будет вашей чистой прибылью.",
    faq_3_q: "Могу ли я использовать десятичные дроби в расчетах?",
    faq_3_a: "Да! Наш калькулятор полностью поддерживает десятичные значения как для базовых чисел, так и для процентов, обеспечивая точные результаты для сложных расчетов.",
    what: "Сколько будет",
    of: "От:",
    answer: "Ответ:",
    value: "Значение",
    rep: "Составляет",
    rep_of: "Какую долю в % составляет от",
    inc: "Увеличить значение",
    dec: "Уменьшить значение",
    by: "На:",
    res: "Получим:",
    diff: "Разница между",
    and: "И",
    is: "Составляет:",
    cost: "Себестоимость",
    margin: "С маржой прибыли",
    sale_price: "Цена продажи:",
    see1: "Рандомизатор списков",
    see2: "Бросить кубики",
    see3: "Правило трех",
    see4: "Экстрактор email",
    f1: "Расчет доли одного числа от другого в процентах",
    f2: "Увеличение и уменьшение на процент с показом сэкономленной суммы",
    f3: "Нахождение исходного значения по известному проценту",
    f4: "Процентное различие между двумя значениями",
    f5: "Калькулятор маржи прибыли (себестоимость + маржа → цена продажи)",
    f6: "Расчет в реальном времени прямо во время ввода",
    examples_title: "Практические примеры",
    ex1_title: "Расчет повышения зарплаты",
    ex1_desc: "Ваша текущая зарплата составляет $4,000, и вам повысили её на 12%. Используйте калькулятор «Увеличить значение»: введите 4000 и 12%, чтобы мгновенно увидеть новую зарплату — $4,480.",
    ex2_title: "Определение цены после скидки",
    ex2_desc: "Куртка стоимостью $250 продается со скидкой 30%. Используйте калькулятор «Уменьшить значение»: введите 250 и 30%, чтобы получить цену со скидкой — $175 (при этом ваша экономия составит $75).",
    ex3_title: "Установка цены с маржой прибыли",
    ex3_desc: "Производство товара обходится вам в $80, и вы хотите получить маржу прибыли 40%. Используйте калькулятор маржи прибыли: введите себестоимость 80 и маржу 40%, чтобы получить правильную цену продажи — $133.33.",
    ex4_title: "Сравнение роста продаж",
    ex4_desc: "Выручка выросла с $18,000 в прошлом квартале до $22,500 в этом. Используйте калькулятор «Разница между», чтобы мгновенно увидеть темп роста +25%.",
    ex5_title: "Поиск исходной цены до применения скидки",
    ex5_desc: "Вы заплатили $85 за куртку, которая продавалась со скидкой 15%. Поскольку $85 — это 85% от первоначальной цены, используйте калькулятор «значение составляет Y% от скольких»: введите 85 как значение и 85 как процент. Исходная цена составляла $100.",
    faq_4_q: "Как рассчитать процентное изменение между двумя числами?",
    faq_4_a: "Используйте калькулятор «Разница между». Введите начальное и конечное значение — инструмент автоматически покажет относительное изменение со знаком + или -, указывающим на увеличение или уменьшение.",
    faq_5_q: "Как найти первоначальную цену до скидки?",
    faq_5_a: "Используйте калькулятор для нахождения исходного значения по известному проценту. Если на товар действует скидка 15%, оплаченная цена составляет 85% от исходной. Введите оплаченную цену и 85 в качестве процента, чтобы узнать стоимость до скидки.",
    faq_6_q: "Могу ли я рассчитать процент от процента?",
    faq_6_a: "Да. Рассчитайте первый результат обычным образом, а затем используйте полученное число как основу для второго расчета. Например, чтобы найти 10% от 20% от $500: сначала посчитайте 20% от 500 (это $100), а затем 10% от $100 (это $10).",
    faq_7_q: "Какая маржа прибыли считается хорошей?",
    faq_7_a: "Это зависит от отрасли. В розничной торговле обычно ориентируются на 10–20%, в сфере ПО и цифровых продуктов маржа может достигать 60–80%, а в услугах обычно колеблется между 20% и 40%. Используйте калькулятор маржи прибыли, чтобы подобрать точную цену продажи под любую цель."
  }
}
</i18n>