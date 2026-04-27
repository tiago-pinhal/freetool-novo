<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f_1'),
    t('f_2'),
    t('f_3'),
    t('f_4')
  ]
})

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

// Tool State
interface State { v1: number|null, v2: number|null, v3: number|null }
const state: State = reactive({ v1: null, v2: null, v3: null });

const output = computed(() => {
    const { v1, v2, v3 } = state;
    if (v1 === null || v2 === null || v3 === null || v1 === 0) return null;
    const res = (v3 * v2) / v1;
    // Format to 4 decimal places if it's a long float, but keep it clean
    return Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(4)).toString();
})

// Localized Routes
defineI18nRoute({
    paths: {
        en: '/simple-rule-of-three-calculator',
        pt: '/calculadora-regra-de-tres-simples', 
        es: '/calculadora-regla-de-tres-simple', 
        fr: '/calculatrice-regle-de-trois-simple',
        it: '/calcolatrice-regola-di-tre-semplice',
        id: '/kalkulator-aturan-tiga-sederhana'
    }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :see-also-links="[
      { label: t('see1'), to: 'percentage-calculator' },
      { label: t('see2'), to: 'bcrypt-generator' },
      { label: t('see3'), to: 'email-extractor' },
      { label: t('see4'), to: 'json-viewer' }
    ]"
  >
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 md:p-10 rounded-3xl">
        
        <!-- Logic Groups -->
        <div class="space-y-6">
          <!-- Concept: If A -> B -->
          <div class="space-y-2">
            <span class="text-xs font-bold uppercase tracking-wider text-primary px-1">{{ t('if') }}</span>
            <div class="space-y-1.5">
              <div class="flex justify-between px-1">
                <span class="text-sm font-bold text-base-content uppercase tracking-tighter">{{ t('val1') }}</span>
                <span class="text-sm font-bold text-base-content uppercase tracking-tighter">{{ t('val2') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <input 
                  id="v1"
                  v-model.number="state.v1" 
                  type="number"
                  class="input input-bordered input-lg w-full h-16 bg-base-100 focus:border-primary transition-all rounded-xl font-mono text-lg"
                  placeholder="0"
                  :aria-label="`${t('if')} - ${t('val1')}`"
                />
                <Icon name="heroicons:arrow-long-right-20-solid" class="w-6 h-6 shrink-0 opacity-30" aria-hidden="true" />
                <input 
                  id="v2"
                  v-model.number="state.v2" 
                  type="number"
                  class="input input-bordered input-lg w-full h-16 bg-base-100 focus:border-primary transition-all rounded-xl font-mono text-lg"
                  placeholder="0"
                  :aria-label="t('val2')"
                />
              </div>
            </div>
          </div>

          <!-- Header for Objective -->
          <div class="pt-4">
            <span class="text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">{{ t('then') }}</span>
          </div>

          <!-- Concept: Then C -> X -->
          <!-- Concept: Then C -> X -->
          <div class="space-y-1.5">
            <div class="flex justify-between px-1">
              <span class="text-sm font-bold text-base-content uppercase tracking-tighter">{{ t('val3') }}</span>
              <span class="text-sm text-primary uppercase tracking-tighter font-black">{{ t('result') }}</span>
            </div>
            <div class="flex items-center gap-3">
              <input 
                id="v3"
                v-model.number="state.v3" 
                type="number"
                class="input input-bordered input-lg w-full h-16 bg-base-100 focus:border-primary transition-all rounded-xl font-mono text-lg"
                placeholder="0"
                :aria-label="`${t('then')} - ${t('val3')}`"
              />
              <Icon name="heroicons:arrow-long-right-20-solid" class="w-6 h-6 shrink-0 opacity-30" aria-hidden="true" />
              <div class="w-full flex items-center justify-center h-16 bg-primary/5 rounded-xl border border-primary/10 border-dashed" aria-hidden="true">
                <span class="text-primary font-black text-2xl">X</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Result Display -->
        <div class="flex flex-col items-center justify-center space-y-4 p-8 bg-base-100 rounded-2xl border border-base-content/10 shadow-lg relative overflow-hidden" aria-live="polite">
          <h2 class="text-sm font-semibold text-base-content uppercase tracking-widest">{{ t('result') }}</h2>
          
          <div class="text-5xl md:text-6xl font-black text-primary transition-all duration-300 tabular-nums">
            {{ output ?? '...' }}
          </div>
          
          <div v-if="output" class="pt-4 w-full">
            <Blockcopy :label="t('result')" :content="output" class="!bg-base-200">
              {{ t('copy_result') }}
            </Blockcopy>
          </div>
          <p v-else class="text-xs text-base-content text-center italic">
            {{ t('waiting') }}
          </p>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-4">
        <p>{{ t('desc') }}</p>
        <div class="p-4 rounded-xl border border-base-content/20">
          <div class="font-bold mb-2 flex items-center gap-2">
            <Icon name="heroicons:light-bulb-20-solid" class="w-5 h-5" aria-hidden="true" />
            {{ t('tip_title') }}
          </div>
          <p>
            {{ t('tip_formula') }}: <code class="px-1 rounded">X = (V3 * V2) / V1</code>
          </p>
        </div>
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Simple Rule of Three Calculator",
        meta: "Calculate simple rule of three proportions online with our free calculator. Find unknown values in direct proportions quickly and easily.",
        desc: "The simple rule of three, also known as cross-multiplication, is a practical mathematical method used to find an unknown fourth value when you already know three values with a direct proportional relationship. Our calculator makes the process easy: whether you're scaling a recipe, calculating percentages, adjusting measurements, or doing homework, just fill in the fields with the known values and the calculator will automatically perform the calculation and show the result.",
        if: "Conditions",
        then: "Target",
        val1: "Value A",
        val2: "Value B",
        val3: "Value C",
        result: "Final Result (X)",
        copy_result: "Copy Result",
        waiting: "Enter all values above to see the result",
        tip_title: "How it works",
        tip_formula: "The formula used is",
        see1: "Percentage Calculator",
        see2: "Bcrypt Generator",
        see3: "Email Extractor",
        see4: "JSON Viewer",
        f_1: "Solve direct proportions with three known values",
        f_2: "Real-time result as you type",
        f_3: "Useful for recipes, scaling, and homework",
        f_4: "No registration or installation required"
    },
    pt: {
        title: "Calculadora de Regra de Três Simples",
        meta: "Calcule regra de três simples online com nossa calculadora gratuita. Descubra valores desconhecidos em proporções diretas de forma rápida e fácil.",
        desc: "A regra de três simples, também conhecida como multiplicação cruzada, é um método matemático prático para descobrir um quarto valor desconhecido quando você já conhece três valores com proporção direta entre si. Nossa calculadora facilita esse processo: seja para adaptar receitas, calcular porcentagens, ajustar medidas ou resolver exercícios escolares, basta preencher os campos com os valores conhecidos para que a calculadora faça o cálculo automaticamente e mostre o resultado.",
        if: "Condições",
        then: "Objetivo",
        val1: "Valor A",
        val2: "Valor B",
        val3: "Valor C",
        result: "Resultado Final (X)",
        copy_result: "Copiar Resultado",
        waiting: "Preencha os valores acima para ver o resultado",
        tip_title: "Como funciona",
        tip_formula: "A fórmula utilizada é",
        see1: "Calculadora de Porcentagem",
        see2: "Gerador Bcrypt",
        see3: "Extrator de E-mails",
        see4: "Visualizador de JSON",
        f_1: "Resolva proporções diretas com três valores conhecidos",
        f_2: "Resultado em tempo real enquanto você digita",
        f_3: "Útil para receitas, escalas e lição de casa",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        title: "Calculadora de Regla de Tres Simple",
        meta: "Calcula la regla de tres simple online con nuestra calculadora gratis. Descubre valores desconocidos en proporciones directas de forma rápida y sencilla.",
        desc: "La regla de tres simple, también conocida como multiplicación cruzada, es un método matemático práctico para descubrir un cuarto valor desconocido cuando ya conoces tres valores con una relación de proporcionalidad directa. Nuestra herramienta facilita este proceso: ya sea para ajustar una receta, calcular porcentajes, adaptar medidas o resolver tareas escolares, solo tienes que completar los campos con los valores conocidos para que la calculadora haga el cálculo automáticamente y muestre el resultado.",
        if: "Condiciones",
        then: "Objetivo",
        val1: "Valor A",
        val2: "Valor B",
        val3: "Valor C",
        result: "Resultado Final (X)",
        copy_result: "Copiar Resultado",
        waiting: "Complete los valores arriba para ver el resultado",
        tip_title: "Cómo funciona",
        tip_formula: "La fórmula utilizada es",
        see1: "Calculadora de Porcentaje",
        see2: "Generador Bcrypt",
        see3: "Extractor de Correos Electrónicos",
        see4: "Visor de JSON",
        f_1: "Resuelve proporciones directas con tres valores conocidos",
        f_2: "Resultado en tiempo real mientras escribes",
        f_3: "Útil para recetas, escalas y tareas",
        f_4: "Sin registro ni instalación"
    },
    fr: {
        title: "Calculatrice de Règle de Trois Simple",
        meta: "Calculez une règle de trois simple en ligne avec notre calculatrice gratuite. Trouvez rapidement et facilement une valeur inconnue dans une proportion directe.",
        desc: "La règle de trois simple, également appelée produit en croix, est une méthode mathématique pratique pour trouver une quatrième valeur inconnue lorsque vous connaissez déjà trois valeurs liées par une proportion directe. Notre calculatrice simplifie ce calcul : que ce soit pour adapter une recette, calculer des pourcentages, ajuster des mesures ou faire des exercices scolaires, il suffit de remplir les champs avec les valeurs connues pour que la calculatrice effectue automatiquement le calcul et affiche le résultat.",
        if: "Conditions",
        then: "Cible",
        val1: "Valeur A",
        val2: "Valeur B",
        val3: "Valeur C",
        result: "Résultat Final (X)",
        copy_result: "Copier le résultat",
        waiting: "Entrez les valeurs ci-dessus pour voir le résultat",
        tip_title: "Comment ça marche",
        tip_formula: "La formule utilisée est",
        see1: "Calculatrice de Pourcentage",
        see2: "Générateur Bcrypt",
        see3: "Extracteur d'e-mails",
        see4: "Visualiseur JSON",
        f_1: "Résoudre des proportions directes avec trois valeurs connues",
        f_2: "Résultat en temps réel pendant la saisie",
        f_3: "Utile pour les recettes, les échelles et les devoirs",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        title: "Calcolatrice di Regola di Tre Semplice",
        meta: "Calcola la regola di tre semplice online con la nostra calcolatrice gratuita. Trova valori sconosciuti nelle proporzioni dirette in modo rapido e semplice.",
        desc: "La regola di tre semplice, nota anche come moltiplicazione incrociata, è un metodo matematico pratico per trovare un quarto valore sconosciuto quando conosci già tre valori in proporzione diretta tra loro. La nostra calcolatrice semplifica il procedimento: che tu debba adattare una ricetta, calcolare percentuali, regolare misure o svolgere compiti scolastici, ti basta compilare i campi con i valori noti perché la calcolatrice esegua automaticamente il calcolo e mostri il risultato.",
        if: "Condizioni",
        then: "Obiettivo",
        val1: "Valore A",
        val2: "Valore B",
        val3: "Valore C",
        result: "Risultato Finale (X)",
        copy_result: "Copia Risultato",
        waiting: "Inserisci i valori sopra per vedere il risultato",
        tip_title: "Come funziona",
        tip_formula: "La formula utilizzata è",
        see1: "Calcolatrice di Percentuale",
        see2: "Generatore Bcrypt",
        see3: "Estrattore di Email",
        see4: "Visualizzatore di JSON",
        f_1: "Risolvi proporzioni dirette con tre valori noti",
        f_2: "Risultato in tempo reale durante la digitazione",
        f_3: "Utile per ricette, scale e compiti",
        f_4: "Nessuna registrazione o installazione"
    },
    id: {
        title: "Kalkulator Aturan Tiga Sederhana",
        meta: "Hitung aturan tiga sederhana secara online dengan kalkulator gratis kami. Temukan nilai yang belum diketahui dalam perbandingan senilai dengan cepat dan mudah.",
        desc: "Aturan tiga sederhana, yang juga dikenal sebagai perkalian silang, adalah metode matematika praktis untuk menemukan nilai keempat yang belum diketahui ketika Anda sudah memiliki tiga nilai dengan hubungan perbandingan senilai. Kalkulator kami mempermudah proses ini: baik untuk menyesuaikan resep, menghitung persentase, mengatur ukuran, atau mengerjakan tugas sekolah, cukup isi kolom dengan nilai-nilai yang sudah diketahui agar kalkulator menghitung secara otomatis dan menampilkan hasilnya.",
        if: "Kondisi",
        then: "Target",
        val1: "Nilai A",
        val2: "Nilai B",
        val3: "Nilai C",
        result: "Hasil Akhir (X)",
        copy_result: "Salin Hasil",
        waiting: "Masukkan semua nilai di atas untuk melihat hasil",
        tip_title: "Cara kerja",
        tip_formula: "Rumus yang digunakan adalah",
        see1: "Kalkulator Persentase",
        see2: "Generator Bcrypt",
        see3: "Ekstraktor Email",
        see4: "Penampil JSON",
        f_1: "Selesaikan perbandingan senilai dengan tiga nilai yang diketahui",
        f_2: "Hasil waktu nyata saat Anda mengetik",
        f_3: "Berguna untuk resep, penskalaan, dan PR",
        f_4: "Tanpa pendaftaran atau instalasi"
    }
}
</i18n>
