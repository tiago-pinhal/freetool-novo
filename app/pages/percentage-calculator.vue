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
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
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
    de: '/prozentrechner'
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

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') }
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
    meta: "Free online percentage calculator for quick and accurate calculations. Calculate increases, decreases, and differences quickly and easily.",
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
    f6: "Real-time results as you type"
  },
  pt: {
    title: "Calculadora de Porcentagem",
    meta: "Calculadora de porcentagem online gratuita para cálculos rápidos e precisos. Calcule aumentos, reduções e diferenças de um jeito rápido e fácil.",
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
    f6: "Resultados em tempo real enquanto você digita"
  },
  es: {
    title: "Calculadora de Porcentajes",
    meta: "Calculadora de porcentajes online gratuita para cálculos rápidos y precisos. Calcula aumentos, reducciones y diferencias de forma rápida y sencilla.",
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
    f6: "Resultados en tiempo real mientras escribes"
  },
  fr: {
    title: "Calculatrice de Pourcentage",
    meta: "Calculatrice de pourcentage en ligne gratuite pour des calculs rapides et précis. Calculez les augmentations, les réductions et les écarts rapidement et facilement.",
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
    f6: "Résultats en temps réel pendant la saisie"
  },
  it: {
    title: "Calcolatrice di Percentuali",
    meta: "Calcolatrice di percentuali online gratuita per calcoli rapidi e precisi. Calcola aumenti, riduzioni e differenze in modo rapido e semplice.",
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
    see3: "Regola del Tre",
    see4: "Estrattore di Email",
    f1: "Calcola quale percentuale un numero rappresenta di un altro",
    f2: "Aumento e riduzione percentuale con importo risparmiato",
    f3: "Trova il valore originale da una percentuale",
    f4: "Differenza percentuale tra due valori",
    f5: "Calcolatrice del margine di profitto (costo + margine → prezzo di vendita)",
    f6: "Risultati in tempo reale mentre digiti"
  },
  id: {
    title: "Kalkulator Persentase",
    meta: "Kalkulator persentase online gratis untuk perhitungan yang cepat dan akurat. Hitung kenaikan, penurunan, dan perbedaan dengan cepat dan mudah.",
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
    f6: "Hasil real-time saat Anda mengetik"
  },
  de: {
    title: "Prozentrechner",
    meta: "Kostenloser Online-Prozentrechner für schnelle und genaue Berechnungen. Berechne Erhöhungen, Reduzierungen und Unterschiede schnell und einfach.",
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
    f6: "Echtzeitergebnisse während der Eingabe"
  }
}
</i18n>
