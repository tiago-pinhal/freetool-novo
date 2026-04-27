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
    id: '/kalkulator-persentase'
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
        <legend class="fieldset-legend font-bold text-sm text-base-content/70 uppercase tracking-wider px-2">{{ t('what') }}</legend>
        
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p1.v1" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage value" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <label class="fieldset-label font-bold text-sm text-base-content/70 uppercase tracking-wider mb-2">{{ t('of') }}</label>
        <input type="number" v-model.number="p1.v2" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Base value" />

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm opacity-60 mr-2">{{ t('answer') }}</span>
          <span class="text-2xl font-black text-primary">{{ r1 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 2: X is what % of Y -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content/70 uppercase tracking-wider px-2">{{ t('value') }}</legend>
        
        <input type="number" v-model.number="p2.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="First value" />

        <label class="fieldset-label font-bold text-sm text-base-content/70 uppercase tracking-wider mb-2">{{ t('rep_of') }}</label>
        <input type="number" v-model.number="p2.v2" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Second value" />

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm opacity-60 mr-2">{{ t('answer') }}</span>
          <span class="text-2xl font-black text-primary">{{ r2 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 3: X is Y% of how much -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content/70 uppercase tracking-wider px-2">{{ t('value') }}</legend>
        
        <input type="number" v-model.number="p3.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Result value" />

        <label class="fieldset-label font-bold text-sm text-base-content/70 uppercase tracking-wider mb-2">{{ t('rep') }}</label>
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p3.v2" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm opacity-60 mr-2">{{ t('of') }}</span>
          <span class="text-2xl font-black text-primary">{{ r3 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 4: Percentage Increase -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content/70 uppercase tracking-wider px-2">{{ t('inc') }}</legend>
        
        <input type="number" v-model.number="p4.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Original value" />

        <label class="fieldset-label font-bold text-sm text-base-content/70 uppercase tracking-wider mb-2">{{ t('by') }}</label>
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p4.v2" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage increase" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm opacity-60 mr-2">{{ t('res') }}</span>
          <span class="text-2xl font-black text-primary">{{ r4 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 5: Percentage Decrease -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content/70 uppercase tracking-wider px-2">{{ t('dec') }}</legend>
        
        <input type="number" v-model.number="p5.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Original value" />

        <label class="fieldset-label font-bold text-sm text-base-content/70 uppercase tracking-wider mb-2">{{ t('by') }}</label>
        <div class="flex w-full mb-4">
          <input type="number" v-model.number="p5.v2" class="input input-bordered rounded-e-none w-full bg-base-100 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Percentage decrease" />
          <div class="flex items-center justify-center px-4 bg-base-300/30 border border-s-0 border-base-content/20 rounded-e-lg text-base-content/60 font-bold">%</div>
        </div>

        <div class="pt-4 border-t border-base-content/10 w-full flex flex-col">
          <div><span class="text-sm opacity-60 mr-2">{{ t('res') }}</span><span class="text-2xl font-black text-primary">{{ r5 }}</span></div>
        </div>
      </fieldset>

      <!-- Calculation 6: Percentage Difference -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content/70 uppercase tracking-wider px-2">{{ t('diff') }}</legend>
        
        <input type="number" v-model.number="p6.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="First value" />

        <label class="fieldset-label font-bold text-sm text-base-content/70 uppercase tracking-wider mb-2">{{ t('and') }}</label>
        <input type="number" v-model.number="p6.v2" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Second value" />

        <div class="pt-4 border-t border-base-content/10 w-full">
          <span class="text-sm opacity-60 mr-2">{{ t('is') }}</span>
          <span class="text-2xl font-black text-primary">{{ r6 }}</span>
        </div>
      </fieldset>

      <!-- Calculation 7: Profit Margin -->
      <fieldset class="fieldset bg-base-200/40 border border-base-content/20 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
        <legend class="fieldset-legend font-bold text-sm text-base-content/70 uppercase tracking-wider px-2">{{ t('cost') }}</legend>
        
        <input type="number" v-model.number="p7.v1" class="input input-bordered w-full bg-base-100 mb-4 border-base-content/20 focus:border-primary" placeholder="0" aria-label="Cost price" />

        <label class="fieldset-label font-bold text-sm text-base-content/70 uppercase tracking-wider mb-2">{{ t('margin') }}</label>
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
        <p>{{ t('features_subtitle') }}</p>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:briefcase-20-solid" class="w-6 h-6 text-primary" />
            {{ t('t4') }}
          </h2>
          <p>{{ t('applications_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:academic-cap-20-solid" class="w-6 h-6 text-primary" />
            {{ t('t5') }}
          </h2>
          <div class="space-y-4">
            <p>{{ t('professional_desc') }}</p>
            <p>{{ t('simplicity_desc') }}</p>
          </div>
        </section>
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
    applications_desc: "Use the calculator to calculate restaurant tips, find out how much you save on sales and promotions, compare offers, calculate product selling prices with profit margin, and analyze business growth rates.",
    professional_desc: "The calculator is useful for product pricing with profit margin, evaluating discounts, analyzing performance variations, solving math exercises, and understanding statistical concepts.",
    simplicity_desc: "Make your percentage calculations simpler with our percentage calculator, ideal for students, professionals, shoppers, and anyone who needs quick and accurate results.",
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
    applications_desc: "Use a calculadora para calcular gorjetas em restaurantes, determinar o valor economizado em promoções, comparar ofertas, calcular o preço de venda de produtos com margem de lucro e analisar taxas de crescimento empresarial.",
    professional_desc: "A calculadora é útil para precificação de produtos com margem de lucro, avaliação de descontos e promoções, análise de variações de performance, resolução de exercícios de matemática e compreensão de conceitos estatísticos.",
    simplicity_desc: "Torne seus cálculos de porcentagem mais simples com nossa calculadora de porcentagens, ideal para estudantes, profissionais, compradores e qualquer pessoa que precise de respostas rápidas e precisas.",
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
    applications_desc: "Usa la calculadora para calcular propinas en restaurantes, determinar el valor ahorrado en promociones, comparar ofertas, calcular el precio de venta de productos con margen de ganancia y analizar tasas de crecimiento empresarial.",
    professional_desc: "La calculadora es útil para fijar precios de productos con margen de ganancia, evaluar descuentos y promociones, analizar variaciones de rendimiento, resolver ejercicios de matemáticas y comprender conceptos estadísticos.",
    simplicity_desc: "Simplifica tus cálculos de porcentaje con nuestra calculadora de porcentajes, ideal para estudiantes, profesionales, compradores y cualquier persona que necesite respuestas rápidas y precisas.",
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
    see4: "Extractor de Correos Electrónicos",
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
    applications_desc: "Utilisez la calculatrice pour calculer les pourboires au restaurant, déterminer le montant économisé lors de promotions, comparer des offres, calculer le prix de vente de produits avec marge bénéficiaire et analyser les taux de croissance d'une entreprise.",
    professional_desc: "La calculatrice est utile pour fixer le prix de produits avec marge bénéficiaire, évaluer des remises et des promotions, analyser des variations de performance, résoudre des exercices de mathématiques et comprendre des concepts statistiques.",
    simplicity_desc: "Simplifiez vos calculs de pourcentage avec notre calculatrice de pourcentage, idéale pour les étudiants, les professionnels, les consommateurs et toute personne qui a besoin de réponses rapides et précises.",
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
    see4: "Extracteur d'e-mails",
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
    applications_desc: "Usa la calcolatrice per calcolare mance al ristorante, determinare l'importo risparmiato nelle promozioni, confrontare offerte, calcolare il prezzo di vendita dei prodotti con margine di profitto e analizzare tassi di crescita aziendale.",
    professional_desc: "La calcolatrice è utile per la determinazione dei prezzi dei prodotti con margine di profitto, la valutazione di sconti e promozioni, l'analisi delle variazioni di performance, la risoluzione di esercizi di matematica e la comprensione di concetti statistici.",
    simplicity_desc: "Rendi più semplici i tuoi calcoli percentuali con la nostra calcolatrice di percentuali, ideale per studenti, professionisti, acquirenti e chiunque abbia bisogno di risposte rapide e precise.",
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
    see1: "Generatore di Liste Casuali",
    see2: "Lanciatore di Dadi",
    see3: "Regola di Tre",
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
    applications_desc: "Gunakan kalkulator untuk menghitung tip di restoran, menentukan jumlah yang dihemat saat promosi, membandingkan penawaran, menghitung harga jual produk dengan margin keuntungan, dan menganalisis tingkat pertumbuhan bisnis.",
    professional_desc: "Kalkulator ini berguna untuk penetapan harga produk dengan margin keuntungan, evaluasi diskon dan promosi, analisis variasi performa, penyelesaian latihan matematika, dan pemahaman konsep statistik.",
    simplicity_desc: "Buat perhitungan persentase Anda lebih sederhana dengan kalkulator persentase kami, ideal untuk pelajar, profesional, pembeli, dan siapa pun yang membutuhkan jawaban cepat dan akurat.",
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
  }
}
</i18n>
