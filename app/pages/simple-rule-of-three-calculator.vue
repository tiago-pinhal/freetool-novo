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
        id: '/kalkulator-aturan-tiga-sederhana',
        de: '/dreisatzrechner',
        nl: '/regel-van-drie-calculator'
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
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[ t('uc_1'), t('uc_2'), t('uc_3'), t('uc_4') ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <section>
          <div class="p-4 rounded-xl border border-base-content/20 bg-base-300/30">
            <div class="font-bold mb-2 flex items-center gap-2">
              <Icon name="heroicons:light-bulb-20-solid" class="w-5 h-5 text-primary" aria-hidden="true" />
              {{ t('tip_title') }}
            </div>
            <p>
              {{ t('tip_formula') }}: <code class="px-2 py-1 bg-base-100 rounded text-primary font-bold">X = (V3 * V2) / V1</code>
            </p>
          </div>
        </section>
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Rule of Three",
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
        features_title: "Features",
        how_to_use_title: "How to use",
        step_1_title: "Enter Base Values",
        step_1_desc: "Input Value A and Value B to define your initial known proportion.",
        step_2_title: "Enter Target",
        step_2_desc: "Input Value C to find its proportional equivalent (X).",
        step_3_title: "Get Result",
        step_3_desc: "The result is calculated instantly. Use the copy button to send it to your clipboard.",
        see1: "Percentage Calculator",
        see2: "Bcrypt",
        see3: "Email Extractor",
        see4: "JSON Viewer",
        use_cases_title: "Use Cases",
        uc_1: "Scaling cooking recipes based on available ingredients",
        uc_2: "Calculating fuel consumption for different distances",
        uc_3: "Adjusting technical measurements and scale models",
        uc_4: "Solving math problems and business proportion tasks",
        f_1: "Solve direct proportions with three known values",
        f_2: "Real-time result as you type",
        f_3: "Useful for recipes, scaling, and homework",
        f_4: "No registration or installation required"
    },
    pt: {
        title: "Regra de Três",
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
        features_title: "Funcionalidades",
        how_to_use_title: "Como usar",
        step_1_title: "Valores Base",
        step_1_desc: "Insira o Valor A e Valor B para definir a proporção inicial conhecida.",
        step_2_title: "Valor Alvo",
        step_2_desc: "Insira o Valor C para descobrir o seu equivalente proporcional (X).",
        step_3_title: "Resultado",
        step_3_desc: "O cálculo é feito na hora. Use o botão de copiar para enviar para a área de transferência.",
        see1: "Porcentagem",
        see2: "Bcrypt",
        see3: "Extrator de E-mails",
        see4: "Visualizador de JSON",
        use_cases_title: "Casos de Uso",
        uc_1: "Adaptar receitas culinárias baseadas nos ingredientes disponíveis",
        uc_2: "Calcular consumo de combustível para diferentes distâncias",
        uc_3: "Ajustar medidas técnicas e modelos em escala",
        uc_4: "Resolver problemas de matemática e proporções de negócios",
        f_1: "Resolva proporções diretas com três valores conhecidos",
        f_2: "Resultado em tempo real enquanto você digita",
        f_3: "Útil para receitas, escalas e lição de casa",
        f_4: "Sem necessidade de cadastro ou instalação"
    },
    es: {
        title: "Regla de Tres",
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
        features_title: "Funcionalidades",
        how_to_use_title: "Cómo usar",
        step_1_title: "Valores Base",
        step_1_desc: "Ingresa el Valor A y Valor B para definir la proporción inicial conocida.",
        step_2_title: "Valor Objetivo",
        step_2_desc: "Ingresa el Valor C para descubrir su equivalente proporcional (X).",
        step_3_title: "Resultado",
        step_3_desc: "El cálculo es automático. Usa el botón de copiar para enviarlo al portapapeles.",
        see1: "Porcentaje",
        see2: "Bcrypt",
        see3: "Extractor de Emails",
        see4: "Visor de JSON",
        use_cases_title: "Casos de Uso",
        uc_1: "Adaptar recetas culinarias basadas en los ingredientes disponibles",
        uc_2: "Calcular el consumo de combustible para diferentes distancias",
        uc_3: "Ajustar medidas técnicas y modelos a escala",
        uc_4: "Resolver problemas matemáticos y tareas de proporción comercial",
        f_1: "Resuelve proporciones directas con tres valores conocidos",
        f_2: "Resultado en tiempo real mientras escribes",
        f_3: "Útil para recetas, escalas y tareas",
        f_4: "Sin registro ni instalación"
    },
    fr: {
        title: "Règle de Trois",
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
        features_title: "Fonctionnalités",
        how_to_use_title: "Comment utiliser l'outil",
        step_1_title: "Valeurs de Base",
        step_1_desc: "Entrez la Valeur A et la Valeur B pour définir la proportion initiale.",
        step_2_title: "Valeur Cible",
        step_2_desc: "Entrez la Valeur C pour trouver son équivalent proportionnel (X).",
        step_3_title: "Résultat",
        step_3_desc: "Le calcul est instantané. Utilisez le bouton de copie pour l'envoyer au presse-papiers.",
        see1: "Pourcentage",
        see2: "Bcrypt",
        see3: "Extracteur d'Emails",
        see4: "Visualiseur JSON",
        use_cases_title: "Cas d'Utilisation",
        uc_1: "Adapter des recettes de cuisine en fonction des ingrédients disponibles",
        uc_2: "Calculer la consommation de carburant pour différentes distances",
        uc_3: "Ajuster les mesures techniques et les modèles à l'échelle",
        uc_4: "Résoudre des problèmes de mathématiques et des tâches de proportion commerciale",
        f_1: "Résoudre des proportions directes avec trois valeurs connues",
        f_2: "Résultat en temps réel pendant la saisie",
        f_3: "Utile pour les recettes, les échelles et les devoirs",
        f_4: "Aucune inscription ou installation requise"
    },
    it: {
        title: "Regola di Tre",
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
        features_title: "Funzionalità",
        how_to_use_title: "Come usare lo strumento",
        step_1_title: "Valori Base",
        step_1_desc: "Inserisci il Valore A e il Valore B per definire la proporzione iniziale.",
        step_2_title: "Valore Obiettivo",
        step_2_desc: "Inserisci il Valore C per trovare il suo equivalente proporzionale (X).",
        step_3_title: "Risultato",
        step_3_desc: "Il calcolo è istantaneo. Usa il pulsante di copia per inviarlo agli appunti.",
        see1: "Percentuale",
        see2: "Bcrypt",
        see3: "Estrattore di Email",
        see4: "Visualizzatore di JSON",
        use_cases_title: "Casi d'Uso",
        uc_1: "Adattare le ricette di cucina in base agli ingredienti disponibili",
        uc_2: "Calcolare il consumo di carburante per diverse distanze",
        uc_3: "Regolare misure tecniche e modelli in scala",
        uc_4: "Risolvere problemi matematici e compiti di proporzione aziendale",
        f_1: "Risolvi proporzioni dirette con tre valori noti",
        f_2: "Risultato in tempo reale durante la digitazione",
        f_3: "Utile per ricette, scale e compiti",
        f_4: "Nessuna registrazione o installazione"
    },
    id: {
        title: "Aturan Tiga",
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
        features_title: "Fitur",
        how_to_use_title: "Cara menggunakan alat ini",
        step_1_title: "Nilai Dasar",
        step_1_desc: "Masukkan Nilai A dan Nilai B untuk menentukan proporsi awal.",
        step_2_title: "Nilai Target",
        step_2_desc: "Masukkan Nilai C untuk menemukan ekuivalen proporsionalnya (X).",
        step_3_title: "Hasil",
        step_3_desc: "Hasil dihitung seketika. Gunakan tombol salin untuk mengirim ke papan klip.",
        see1: "Persentase",
        see2: "Bcrypt",
        see3: "Ekstraktor Email",
        see4: "Penampil JSON",
        use_cases_title: "Contoh Penggunaan",
        uc_1: "Menyesuaikan resep masakan berdasarkan bahan yang tersedia",
        uc_2: "Menghitung konsumsi bahan bakar untuk jarak yang berbeda",
        uc_3: "Menyesuaikan pengukuran teknis dan model skala",
        uc_4: "Menyelesaikan masalah matematika dan tugas proporsi bisnis",
        f_1: "Selesaikan perbandingan senilai dengan tiga nilai yang diketahui",
        f_2: "Hasil waktu nyata saat Anda mengetik",
        f_3: "Berguna untuk resep, penskalaan, dan PR",
        f_4: "Tanpa pendaftaran atau instalasi"
    },
    de: {
        title: "Einfacher Dreisatzrechner",
        meta: "Berechne einfache Dreisatz-Proportionen online mit unserem kostenlosen Rechner. Finde unbekannte Werte in direkten Proportionen schnell und einfach.",
        desc: "Der einfache Dreisatz, auch als Kreuzmultiplikation bekannt, ist eine praktische mathematische Methode, um einen unbekannten vierten Wert zu finden, wenn bereits drei Werte mit direktem proportionalem Verhältnis bekannt sind. Unser Rechner macht den Vorgang einfach: Ob du ein Rezept skalierst, Prozentsätze berechnest, Maße anpasst oder Hausaufgaben löst, fülle einfach die bekannten Werte aus und der Rechner führt die Berechnung automatisch durch und zeigt das Ergebnis.",
        if: "Bedingungen",
        then: "Ziel",
        val1: "Wert A",
        val2: "Wert B",
        val3: "Wert C",
        result: "Endergebnis (X)",
        copy_result: "Ergebnis kopieren",
        waiting: "Gib alle Werte oben ein, um das Ergebnis zu sehen",
        tip_title: "So funktioniert es",
        tip_formula: "Die verwendete Formel ist",
        features_title: "Funktionen",
        how_to_use_title: "So verwendest du das Tool",
        step_1_title: "Basiswerte eingeben",
        step_1_desc: "Gib Wert A und Wert B ein, um die bekannte Ausgangsproportion festzulegen.",
        step_2_title: "Zielwert eingeben",
        step_2_desc: "Gib Wert C ein, um den proportionalen Gegenwert (X) zu berechnen.",
        step_3_title: "Ergebnis erhalten",
        step_3_desc: "Das Ergebnis wird sofort berechnet. Nutze die Kopierschaltfläche, um es in die Zwischenablage zu übernehmen.",
        see1: "Prozentrechner",
        see2: "Bcrypt",
        see3: "E-Mail-Extraktor",
        see4: "JSON-Betrachter",
        use_cases_title: "Anwendungsfälle",
        uc_1: "Kochrezepte anhand verfügbarer Zutaten skalieren",
        uc_2: "Kraftstoffverbrauch für unterschiedliche Entfernungen berechnen",
        uc_3: "Technische Maße und maßstabsgetreue Modelle anpassen",
        uc_4: "Matheaufgaben und geschäftliche Proportionsaufgaben lösen",
        f_1: "Direkte Proportionen mit drei bekannten Werten lösen",
        f_2: "Ergebnis in Echtzeit während der Eingabe",
        f_3: "Nützlich für Rezepte, Skalierung und Hausaufgaben",
        f_4: "Keine Registrierung oder Installation erforderlich"
    },
    nl: {
        title: "Regel van drie",
        meta: "Bereken eenvoudig de regel van drie online met onze gratis calculator. Vind snel en eenvoudig onbekende waarden in directe proporties.",
        desc: "De eenvoudige regel van drie, ook wel kruislings vermenigvuldigen genoemd, is een praktische wiskundige methode om een onbekende vierde waarde te vinden wanneer je al drie waarden met een direct proportionele relatie kent. Onze calculator maakt het proces eenvoudig: of je nu een recept schaalt, percentages berekent, afmetingen aanpast of huiswerk maakt, vul gewoon de velden in met de bekende waarden en de calculator voert de berekening automatisch uit en toont het resultaat.",
        if: "Voorwaarden",
        then: "Doel",
        val1: "Waarde A",
        val2: "Waarde B",
        val3: "Waarde C",
        result: "Eindresultaat (X)",
        copy_result: "Resultaat kopiëren",
        waiting: "Voer alle waarden hierboven in om het resultaat te zien",
        tip_title: "Hoe het werkt",
        tip_formula: "De gebruikte formule is",
        features_title: "Functies",
        how_to_use_title: "Hoe te gebruiken",
        step_1_title: "Basiswaarden invoeren",
        step_1_desc: "Voer Waarde A en Waarde B in om de initiële bekende verhouding te definiëren.",
        step_2_title: "Doel invoeren",
        step_2_desc: "Voer Waarde C in om de proportionele tegenhanger (X) te vinden.",
        step_3_title: "Resultaat ophalen",
        step_3_desc: "Het resultaat wordt direct berekend. Gebruik de kopieerknop om het naar je klembord te sturen.",
        see1: "Percentagecalculator",
        see2: "Bcrypt-generator",
        see3: "E-mailextractor",
        see4: "JSON-viewer",
        use_cases_title: "Gebruiksvoorbeelden",
        uc_1: "Kookrecepten schalen op basis van beschikbare ingrediënten",
        uc_2: "Brandstofverbruik berekenen voor verschillende afstanden",
        uc_3: "Technische afmetingen en schaalmodellen aanpassen",
        uc_4: "Wiskundeproblemen en zakelijke verhoudingsopdrachten oplossen",
        f_1: "Los directe proporties op met drie bekende waarden",
        f_2: "Realtime resultaat terwijl je typt",
        f_3: "Handig voor recepten, schalen en huiswerk",
        f_4: "Geen registratie of installatie vereist"
    }
}
</i18n>
