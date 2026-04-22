<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  type: 'tool',
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') }
  ],
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
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-primary">{{ t('if') }}</span>
            <div class="flex items-center gap-3">
              <input 
                id="v1"
                v-model.number="state.v1" 
                type="number"
                class="input input-bordered input-lg w-full bg-base-100 focus:border-primary transition-all rounded-xl font-mono text-lg"
                placeholder="0"
                :aria-label="`${t('if')} - ${t('val1')}`"
              />
              <Icon name="heroicons:arrow-long-right-20-solid" class="w-6 h-6 shrink-0 opacity-30" aria-hidden="true" />
              <input 
                id="v2"
                v-model.number="state.v2" 
                type="number"
                class="input input-bordered input-lg w-full bg-base-100 focus:border-primary transition-all rounded-xl font-mono text-lg"
                placeholder="0"
                :aria-label="t('val2')"
              />
            </div>
            <div class="flex justify-between px-1">
              <span class="text-[10px] text-base-content/70 uppercase tracking-tighter">{{ t('val1') }}</span>
              <span class="text-[10px] text-base-content/70 uppercase tracking-tighter">{{ t('val2') }}</span>
            </div>
          </div>

          <!-- Divider with label -->
          <div class="relative flex items-center py-2">
            <div class="flex-grow border-t border-base-content/10"></div>
            <span class="flex-shrink mx-4 text-xs font-medium text-base-content/60 uppercase tracking-widest">{{ t('then') }}</span>
            <div class="flex-grow border-t border-base-content/10"></div>
          </div>

          <!-- Concept: Then C -> X -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <input 
                id="v3"
                v-model.number="state.v3" 
                type="number"
                class="input input-bordered input-lg w-full bg-base-100 focus:border-primary transition-all rounded-xl font-mono text-lg"
                placeholder="0"
                :aria-label="`${t('then')} - ${t('val3')}`"
              />
              <Icon name="heroicons:arrow-long-right-20-solid" class="w-6 h-6 shrink-0 opacity-30" aria-hidden="true" />
              <div class="w-full flex items-center justify-center h-16 bg-primary/5 rounded-xl border border-primary/20 border-dashed" aria-hidden="true">
                <span class="text-primary font-bold text-xl">X</span>
              </div>
            </div>
            <div class="flex justify-between px-1">
              <span class="text-[10px] text-base-content/70 uppercase tracking-tighter">{{ t('val3') }}</span>
              <span class="text-[10px] text-primary/70 uppercase tracking-tighter font-bold">{{ t('result') }}</span>
            </div>
          </div>
        </div>

        <!-- Result Display -->
        <div class="flex flex-col items-center justify-center space-y-4 p-8 bg-base-100 rounded-2xl border border-base-content/10 shadow-lg relative overflow-hidden" aria-live="polite">
          <h2 class="text-sm font-semibold text-base-content/80 uppercase tracking-widest">{{ t('result') }}</h2>
          
          <div class="text-5xl md:text-6xl font-black text-primary transition-all duration-300 tabular-nums">
            {{ output ?? '...' }}
          </div>
          
          <div v-if="output" class="pt-4 w-full">
            <Blockcopy :label="t('result')" :content="output" class="!bg-base-200">
              {{ t('copy_result') }}
            </Blockcopy>
          </div>
          <p v-else class="text-xs text-base-content/80 text-center italic">
            {{ t('waiting') }}
          </p>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-4">
        <p>{{ t('desc') }}</p>
        <div class="bg-primary/10 p-4 rounded-xl border border-primary/20">
          <div class="font-bold mb-2 text-primary flex items-center gap-2">
            <Icon name="heroicons:light-bulb-20-solid" class="w-5 h-5" aria-hidden="true" />
            {{ t('tip_title') }}
          </div>
          <p class="text-sm text-base-content/80">
            {{ t('tip_formula') }}: <code class="bg-base-200 px-1 rounded">X = (V3 * V2) / V1</code>
          </p>
        </div>
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Rule of Three Calculator",
        meta: "Calculate cross multiplication and direct proportions online with our free Rule of Three Calculator. Solve proportions quickly and easily.",
        desc: "The simple rule of three (also known as cross-multiplication) is the most practical mathematical method to find an unknown fourth value when you already know three values that have a direct proportional relationship. Our calculator makes it effortless: whether you're resizing an image, scaling a recipe, calculating percentages, or doing homework, just enter the three known values and we will automatically compute and reveal the missing fourth value instantly.",
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
        meta: "Calcule a regra de três simples online com nossa calculadora gratuita. Descubra facilmente valores desconhecidos em proporções diretas e frações.",
        desc: "A regra de três simples e direta (ou multiplicação cruzada) é o método matemático mais prático para descobrir um valor desconhecido a partir de três valores direta e proporcionalmente relacionados que você já possui. Nossa calculadora facilita sua vida: seja para adaptar receitas, calcular porcentagens, ajustar escalas no design ou resolver exercícios escolares, basta preencher os 3 valores sabidos que o sistema revelará o 4º valor automaticamente.",
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
        meta: "Calcula la regla de tres simple online con nuestra calculadora gratis. Descubre el valor de la incógnita en proporciones directas fácilmente.",
        desc: "La regla de tres simple y directa es el método matemático más útil para averiguar un valor desconocido a partir de tres valores proporcionales que ya conoces. Nuestra herramienta te facilitará enormemente la tarea: ya sea para ajustar los ingredientes de una receta, calcular porcentajes rápidos, escalar imágenes o resolver deberes escolares, basta con introducir los tres datos que tienes y la aplicación revelará automáticamente el cuarto valor faltante.",
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
        title: "Calculatrice de Règle de Trois (Produit en Croix)",
        meta: "Faites le calcul de la règle de trois (produit en croix) en ligne avec notre calculatrice gratuite. Trouvez rapidement la valeur d'une proportion.",
        desc: "La règle de trois (également célèbre sous le nom de produit en croix) est la méthode mathématique la plus pratique pour déterminer une valeur inconnue à partir de trois autres quantités directement proportionnelles. Notre calculatrice vous simplifie la vie : qu'il s'agisse d'adapter une recette, d'ajuster des échelles de design, de calculer des pourcentages ou de faire des exercices scolaires, entrez simplement les trois valeurs connues.",
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
        meta: "Calcola proporzioni e regola del tre semplice online. Scopri un valore incognito partendo da tre numeri noti in modo facile e veloce.",
        desc: "La regola del tre semplice è il metodo matematico più pratico per trovare un quarto valore incognito quando possiedi già tre valori tra loro direttamente proporzionali. Il nostro calcolatore semplifica ogni operazione: per adattare quantità in ricette, fare calcoli in scala per la grafica, calcolare percentuali o per aiutare gli studenti, ti basterà inserire nei campi i tre valori a te noti.",
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
        meta: "Hitung perkalian silang dan perbandingan senilai secara online dengan Kalkulator Aturan Tiga gratis kami. Selesaikan perbandingan dengan cepat dan mudah.",
        desc: "Aturan tiga sederhana (juga dikenal sebagai perkalian silang) adalah metode matematika paling praktis untuk menemukan nilai keempat yang tidak diketahui ketika Anda sudah mengetahui tiga nilai yang memiliki hubungan perbandingan senilai. Kalkulator kami membuatnya mudah: baik Anda sedang mengubah ukuran gambar, menyesuaikan takaran resep, menghitung persentase, atau mengerjakan tugas sekolah.",
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
