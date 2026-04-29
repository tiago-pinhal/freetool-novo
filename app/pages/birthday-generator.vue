<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })

const today = new Date()
const currYear = today.getFullYear()

interface AgeResult {
  years: number
  months: number
  days: number
}

const state = reactive({
  tp: 'age' as 'age' | 'year',
  minAge: 18 as number | null,
  maxAge: 36 as number | null,
  minYear: (currYear - 40) as number | null,
  maxYear: currYear as number | null,
  output: null as string | null,
  age: null as AgeResult | null,
  ads: false
})

watch(() => state.tp, () => {
  state.output = null
  state.age = null
  state.ads = false
})

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generate() {
  let birthday: Date

  if (state.tp === 'age') {
    const min = state.minAge ?? 0
    const max = state.maxAge ?? min
    const start = new Date(today.getFullYear() - max, 0, 1)
    const end = new Date(today)
    end.setFullYear(end.getFullYear() - min)
    birthday = randomDateBetween(start, end)
  } else {
    const minY = state.minYear ?? currYear
    const maxY = state.maxYear ?? currYear
    let candidate: Date
    do {
      candidate = randomDateBetween(new Date(minY, 0, 1), new Date(maxY, 11, 31))
    } while (candidate >= today)
    birthday = candidate
  }

  state.age = calcAge(birthday)
  state.output = birthday.toLocaleDateString(locale.value)
  state.ads = true
}

function calcAge(birthday: Date): AgeResult {
  let years = today.getFullYear() - birthday.getFullYear()
  let months = today.getMonth() - birthday.getMonth()
  let days = today.getDate() - birthday.getDate()

  if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }

  return { years, months, days }
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3')],
  faq: [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') }
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') },
  ],
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    pt: '/gerador-data-nascimento',
    es: '/generador-fecha-nacimiento',
    fr: '/generateur-date-naissance',
    it: '/generatore-data-nascita',
    id: '/generator-tanggal-lahir',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'age-calculator' },
      { label: t('see2'), to: 'future-date-calculator' },
      { label: t('see3'), to: 'past-date-calculator' },
      { label: t('see4'), to: 'date-difference' },
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls -->
      <div class="space-y-5">
        <!-- Mode selector -->
        <div>
          <label class="label pb-1">
            <span class="label-text font-bold text-base-content/80">{{ t('mode_label') }}</span>
          </label>
          <div class="flex flex-wrap gap-3">
            <label 
              class="flex items-center gap-2 cursor-pointer bg-base-200/50 px-4 py-2.5 rounded-xl border transition-all duration-200"
              :class="state.tp === 'age' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-base-content/5 hover:bg-base-200'"
            >
              <input type="radio" value="age" v-model="state.tp" class="radio radio-primary radio-sm" />
              <span class="text-sm font-semibold" :class="state.tp === 'age' ? 'text-primary' : 'text-base-content/70'">{{ t('ages') }}</span>
            </label>
            <label 
              class="flex items-center gap-2 cursor-pointer bg-base-200/50 px-4 py-2.5 rounded-xl border transition-all duration-200"
              :class="state.tp === 'year' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-base-content/5 hover:bg-base-200'"
            >
              <input type="radio" value="year" v-model="state.tp" class="radio radio-primary radio-sm" />
              <span class="text-sm font-semibold" :class="state.tp === 'year' ? 'text-primary' : 'text-base-content/70'">{{ t('years') }}</span>
            </label>
          </div>
        </div>

        <!-- Inputs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <template v-if="state.tp === 'age'">
            <div class="form-control">
              <label class="label pb-1" for="minAge">
                <span class="label-text font-bold text-base-content/80">{{ t('minAge') }}</span>
              </label>
              <input id="minAge" type="number" :min="0" v-model.number="state.minAge" class="input input-bordered w-full" />
            </div>
            <div class="form-control">
              <label class="label pb-1" for="maxAge">
                <span class="label-text font-bold text-base-content/80">{{ t('maxAge') }}</span>
              </label>
              <input id="maxAge" type="number" :min="state.minAge ?? 0" v-model.number="state.maxAge" class="input input-bordered w-full" />
            </div>
          </template>
          <template v-else>
            <div class="form-control">
              <label class="label pb-1" for="minYear">
                <span class="label-text font-bold text-base-content/80">{{ t('minYear') }}</span>
              </label>
              <input id="minYear" type="number" :min="0" v-model.number="state.minYear" class="input input-bordered w-full" />
            </div>
            <div class="form-control">
              <label class="label pb-1" for="maxYear">
                <span class="label-text font-bold text-base-content/80">{{ t('maxYear') }}</span>
              </label>
              <input id="maxYear" type="number" :min="state.minYear ?? 0" v-model.number="state.maxYear" class="input input-bordered w-full" />
            </div>
          </template>
        </div>

        <!-- Generate button -->
        <ButtonPrimary
          @click="generate"
          icon="heroicons:sparkles-20-solid"
          class="w-full h-14 text-lg"
        >
          {{ t('bt') }}
        </ButtonPrimary>
      </div>

      <!-- Right Column: Result -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[16rem] flex flex-col justify-center relative overflow-hidden">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div v-if="state.output" class="space-y-6 w-full">
            <LineCopy 
              :content="state.output" 
              :label="t('dt')" 
              class="!my-0 [&>div:last-child]:!w-full"
            >
              <span class="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-primary">{{ state.output }}</span>
            </LineCopy>

            <!-- Age Stats -->
            <div v-if="state.age" class="space-y-3">
              <div class="mt-2 text-xs uppercase tracking-wider text-base-content font-bold px-1">{{ t('age') }}:</div>
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-base-100/50 rounded-xl p-3 border border-base-content/5 text-center">
                  <div class="text-2xl font-bold text-base-content">{{ state.age.years }}</div>
                  <div class="text-[10px] uppercase text-base-content/50">{{ t('years_label') }}</div>
                </div>
                <div class="bg-base-100/50 rounded-xl p-3 border border-base-content/5 text-center">
                  <div class="text-2xl font-bold text-base-content">{{ state.age.months }}</div>
                  <div class="text-[10px] uppercase text-base-content/50">{{ t('months_label') }}</div>
                </div>
                <div class="bg-base-100/50 rounded-xl p-3 border border-base-content/5 text-center">
                  <div class="text-2xl font-bold text-base-content">{{ state.age.days }}</div>
                  <div class="text-[10px] uppercase text-base-content/50">{{ t('days_label') }}</div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Placeholder -->
        <div v-if="!state.output" class="text-center opacity-70">
          <div class="bg-base-100/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-base-content/5 shadow-sm">
            <Icon name="heroicons:calendar" class="w-8 h-8 text-primary/40" />
          </div>
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <section>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
            { title: t('use_4_t'), description: t('use_4_d') }
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') },
          ]"
        />

        <section>
          <h2 class="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
            <Icon name="heroicons:light-bulb-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('ex_title') }}
          </h2>
          <ul class="space-y-3 text-base-content/80">
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex1') }}</span></li>
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex2') }}</span></li>
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex3') }}</span></li>
            <li class="flex gap-3"><span class="text-primary mt-0.5">•</span><span>{{ t('ex4') }}</span></li>
          </ul>
        </section>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq1q'), answer: t('faq1a') },
            { question: t('faq2q'), answer: t('faq2a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Random Birthday Generator",
    pageTitle: "Random Birthday Generator by Age or Year | Free",
    meta: "Generate random birth dates instantly with exact age calculation. Create dates by age range or birth year for testing, characters and sample data.",
    ages: "By age range",
    years: "By birth year",
    minAge: "Minimum Age",
    maxAge: "Maximum Age",
    minYear: "Start Year",
    maxYear: "End Year",
    bt: "Generate Birthday",
    dt: "Date of Birth",
    age: "Age",
    years_label: "Years",
    months_label: "Months",
    days_label: "Days",
    how_desc: "Use our Birthday Generator to create random birth dates based on a specific age range or a year interval of your choice. You can set an age range such as 18–30 years or a period like 1984–2000. The tool also automatically calculates the exact age in years, months and days.",
    features_title: "Features",
    f_1: "Random birthday generation by age range",
    f_2: "Random birthday generation by birth year range",
    f_3: "Automatic exact age calculation in years, months and days",
    use_cases_title: "Main Applications",
    use_1_t: "Software Testing",
    use_1_d: "Generate realistic birth dates to test age validations and date fields.",
    use_2_t: "Character & Game Creation",
    use_2_d: "Create believable birth dates for fictional characters, NPCs and worldbuilding.",
    use_3_t: "Sample Data & Research",
    use_3_d: "Produce fictitious demographic data for mockups, prototypes and studies.",
    use_4_t: "Privacy",
    use_4_d: "Use a generated date as a placeholder when real data should not be shared.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Choose a Mode",
    step_1_desc: "Select 'By age range' to generate a birthday for someone of a given age, or 'By birth year' to restrict the result to a specific decade or period.",
    step_2_title: "Set the Range",
    step_2_desc: "Enter the minimum and maximum values — either ages or years — to define the window for the random date.",
    step_3_title: "Generate and Copy",
    step_3_desc: "Click 'Generate Birthday'. The result shows the date of birth and the exact calculated age. Use the copy button to copy the generated date.",
    ex_title: "Common Examples",
    ex1: "Young adult character: set age range 18–25 to generate a birth date for someone currently between 18 and 25 years old.",
    ex2: "Millennial dataset: set year range 1981–1996 to generate birth dates within the millennial generation.",
    ex3: "Senior NPC: set age range 60–80 to generate a birth date for an elderly character in a story or game.",
    ex4: "Baby boomer sample: set year range 1946–1964 to create test data for a baby boomer demographic.",
    faq_title: "Questions & Answers",
    mode_label: "Generation Mode",
    placeholder: "Click Generate to create a birthday",
    copy: "Copy date",
    faq1q: "How does the random birthday generator work?",
    faq1a: "Choose the generation method: by age range (for example 25–35 years) or by birth year interval (such as 1990–2000). Enter the minimum and maximum values and click 'Generate Birthday'. The tool instantly creates a random birth date and calculates the exact age based on today's date.",
    faq2q: "What is a random birthday generator used for?",
    faq2a: "This generator is ideal for developers testing age validations, writers and designers creating realistic characters, database administrators generating test data, and educators or researchers.",
    see1: "Age Calculator",
    see2: "Future Date Calculator",
    see3: "Past Date Calculator",
    see4: "Date Difference"
  },
  pt: {
    title: "Gerador de Data de Nascimento Aleatória",
    pageTitle: "Gerador de Data de Nascimento Aleatória por Idade ou Ano | Grátis",
    meta: "Gere datas de nascimento aleatórias instantaneamente com cálculo exato de idade. Crie datas por faixa etária ou ano para testes, personagens e dados de exemplo.",
    ages: "Por faixa etária",
    years: "Por ano de nascimento",
    minAge: "Idade Mínima",
    maxAge: "Idade Máxima",
    minYear: "Ano Inicial",
    maxYear: "Ano Final",
    bt: "Gerar Data de Nascimento",
    dt: "Data de Nascimento",
    age: "Idade",
    years_label: "Anos",
    months_label: "Meses",
    days_label: "Dias",
    how_desc: "Utilize o nosso Gerador de Datas de Nascimento para gerar datas de nascimento aleatórias com base em uma faixa etária específica ou em um intervalo de anos de sua escolha. É possível definir, por exemplo, uma faixa etária de 18 a 30 anos ou um período como 1984 a 2000. Além de gerar datas de nascimento aleatórias, a ferramenta calcula automaticamente a idade exata correspondente, detalhando anos, meses e dias. O gerador pode ser utilizado em diversos cenários, como criação de personagens fictícios, geração de dados de exemplo e simulações de testes em sistemas.",
    features_title: "Funcionalidades",
    f_1: "Geração de datas de nascimento aleatórias por faixa etária",
    f_2: "Geração de datas de nascimento aleatórias por intervalo de anos",
    f_3: "Cálculo automático da idade exata em anos, meses e dias",
    use_cases_title: "Principais Aplicações",
    use_1_t: "Testes de Software",
    use_1_d: "Gere datas de nascimento realistas para testar validações de idade e campos de data.",
    use_2_t: "Criação de Personagens e Jogos",
    use_2_d: "Crie datas críveis para personagens fictícios, NPCs e worldbuilding em histórias ou jogos.",
    use_3_t: "Dados de Exemplo e Pesquisa",
    use_3_d: "Produza dados demográficos fictícios para mockups, protótipos e estudos acadêmicos.",
    use_4_t: "Privacidade",
    use_4_d: "Use uma data gerada como substituta quando a data de nascimento real não deve ser compartilhada.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Escolha o Modo",
    step_1_desc: "Selecione 'Por faixa etária' para gerar um aniversário de alguém com uma determinada idade, ou 'Por ano de nascimento' para restringir o resultado a uma década ou período específico.",
    step_2_title: "Defina o Intervalo",
    step_2_desc: "Informe os valores mínimo e máximo — idades ou anos — para definir o intervalo da data aleatória.",
    step_3_title: "Gerar e Copiar",
    step_3_desc: "Clique em 'Gerar Data de Nascimento'. O resultado exibe a data de nascimento e a idade exata calculada. Use o botão de cópia para copiar a data gerada.",
    ex_title: "Exemplos Comuns",
    ex1: "Personagem jovem adulto: defina faixa etária de 18 a 25 anos para gerar uma data de nascimento de alguém com essa idade atualmente.",
    ex2: "Dataset millennial: defina intervalo de anos de 1981 a 1996 para gerar datas de nascimento da geração millennial.",
    ex3: "NPC idoso: defina faixa etária de 60 a 80 anos para gerar uma data de nascimento de um personagem idoso em uma história ou jogo.",
    ex4: "Amostra baby boomer: defina intervalo de anos de 1946 a 1964 para criar dados de teste para uma demografia baby boomer.",
    faq_title: "Perguntas Frequentes",
    mode_label: "Modo de Geração",
    placeholder: "Clique em Gerar para criar uma data",
    copy: "Copiar data",
    faq1q: "Como funciona o gerador de data de nascimento aleatória?",
    faq1a: "Escolha o método de geração: por faixa etária (exemplo: 25–35 anos) ou por intervalo de anos de nascimento (como 1990–2000). Informe os valores mínimo e máximo e clique em 'Gerar Data de Nascimento'. A ferramenta cria uma data de nascimento aleatória e calcula a idade exata com base na data atual.",
    faq2q: "Para que serve um gerador de data de nascimento?",
    faq2a: "Este gerador é ideal para desenvolvedores testando validações de idade, escritores e designers criando personagens realistas, administradores de banco de dados gerando dados de teste, educadores e pesquisadores.",
    see1: "Calculadora de Idade",
    see2: "Calculadora de Data Futura",
    see3: "Calculadora de Data Passada",
    see4: "Diferença entre Datas"
  },
  es: {
    title: "Generador de Fecha de Nacimiento Aleatoria",
    pageTitle: "Generador de Fecha de Nacimiento Aleatoria por Edad o Año | Gratis",
    meta: "Genera fechas de nacimiento aleatorias al instante con cálculo exacto de edad. Crea fechas por rango de edad o año para pruebas, personajes y datos de ejemplo.",
    ages: "Por rango de edad",
    years: "Por año de nacimiento",
    minAge: "Edad Mínima",
    maxAge: "Edad Máxima",
    minYear: "Año Inicial",
    maxYear: "Año Final",
    bt: "Generar Fecha de Nacimiento",
    dt: "Fecha de Nacimiento",
    age: "Edad",
    years_label: "Años",
    months_label: "Meses",
    days_label: "Días",
    how_desc: "Utiliza nuestro Generador de Fechas de Nacimiento para crear fechas de nacimiento aleatorias basándose en un rango de edad específico o en un intervalo de años. Puedes definir, por ejemplo, un rango de 18 a 30 años o un período como 1984–2000. La herramienta también calcula automáticamente la edad exacta en años, meses y días.",
    features_title: "Características",
    f_1: "Generación de fechas de nacimiento aleatorias por rango de edad",
    f_2: "Generación de fechas de nacimiento aleatorias por rango de años",
    f_3: "Cálculo automático de la edad exacta en años, meses y días",
    use_cases_title: "Principales Aplicaciones",
    use_1_t: "Pruebas de Software",
    use_1_d: "Genera fechas de nacimiento realistas para probar validaciones de edad.",
    use_2_t: "Creación de Personajes y Juegos",
    use_2_d: "Crea fechas creíbles para personajes de ficción, NPCs y worldbuilding.",
    use_3_t: "Datos de Ejemplo e Investigación",
    use_3_d: "Produce datos demográficos ficticios para maquetas, prototipos y estudios.",
    use_4_t: "Privacidad",
    use_4_d: "Usa una fecha generada como sustituta cuando no se debe compartir la fecha real.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Elige el Modo",
    step_1_desc: "Selecciona 'Por rango de edad' para generar un cumpleaños para alguien de una edad determinada, o 'Por año de nacimiento' para limitar el resultado a un período específico.",
    step_2_title: "Define el Rango",
    step_2_desc: "Introduce los valores mínimo y máximo —edades o años— para definir la ventana de la fecha aleatoria.",
    step_3_title: "Generar y Copiar",
    step_3_desc: "Haz clic en 'Generar Fecha de Nacimiento'. El resultado muestra la fecha y la edad exacta calculada. Usa el botón de copia para copiar la fecha generada.",
    ex_title: "Ejemplos Comunes",
    ex1: "Personaje joven adulto: define rango de edad 18–25 para generar una fecha de nacimiento para alguien de esa edad actualmente.",
    ex2: "Dataset millennial: define rango de años 1981–1996 para generar fechas de la generación millennial.",
    ex3: "NPC anciano: define rango de edad 60–80 para generar una fecha para un personaje anciano en una historia o juego.",
    ex4: "Muestra baby boomer: define rango de años 1946–1964 para crear datos de prueba de esa demografía.",
    faq_title: "Preguntas Frecuentes",
    mode_label: "Modo de Generación",
    placeholder: "Haz clic en Generar para crear una fecha",
    copy: "Copiar fecha",
    faq1q: "¿Cómo funciona el generador de fecha de nacimiento aleatória?",
    faq1a: "Elige el método: por rango de edad (por ejemplo, 25–35 años) o por intervalo de años (como 1990–2000). Introduce los valores y haz clic en 'Generar Fecha de Nacimiento'. La herramienta crea una fecha aleatoria y calcula la edad exacta.",
    faq2q: "¿Para qué sirve un generador de fecha de nacimiento?",
    faq2a: "Es ideal para desarrolladores probando validaciones de edad, escritores creando personajes realistas, administradores de bases de datos generando datos de prueba, y educadores o investigadores.",
    see1: "Calculadora de Edad",
    see2: "Calculadora de Fecha Futura",
    see3: "Calculadora de Data Pasada",
    see4: "Diferencia entre Fechas"
  },
  fr: {
    title: "Générateur de Date de Naissance Aléatoire",
    pageTitle: "Générateur de Date de Naissance Aléatoire par Âge ou Année | Gratuit",
    meta: "Générez des dates de naissance aléatoires instantanément avec un calcul d'âge exact. Créez des dates par tranche d'âge ou année pour les tests, personnages et données d'exemple.",
    ages: "Par tranche d'âge",
    years: "Par année de naissance",
    minAge: "Âge Minimum",
    maxAge: "Âge Maximum",
    minYear: "Année de Début",
    maxYear: "Année de Fin",
    bt: "Générer une Date de Naissance",
    dt: "Date de Naissance",
    age: "Âge",
    years_label: "Années",
    months_label: "Mois",
    days_label: "Jours",
    how_desc: "Utilisez notre Générateur de Dates de Naissance pour créer des dates de naissance aléatoires basées sur une tranche d'âge ou un intervalle d'années. Vous pouvez définir par exemple une tranche de 18 à 30 ans ou une période comme 1984–2000. L'outil calcule également automatiquement l'âge exact en années, mois et jours.",
    features_title: "Fonctionnalités",
    f_1: "Génération de dates de naissance aléatoires par tranche d'âge",
    f_2: "Génération de dates de naissance aléatoires par intervalle d'années",
    f_3: "Calcul automatique de l'âge exact en années, mois et jours",
    use_cases_title: "Principales Applications",
    use_1_t: "Tests Logiciels",
    use_1_d: "Générez des dates de naissance réalistes pour tester les validations d'âge.",
    use_2_t: "Création de Personnages et Jeux",
    use_2_d: "Créez des dates crédibles pour des personnages fictifs, PNJs et worldbuilding.",
    use_3_t: "Données d'Exemple et Recherche",
    use_3_d: "Produisez des données démographiques fictives pour maquettes et études.",
    use_4_t: "Confidentialité",
    use_4_d: "Utilisez une date générée comme substitut quand la vraie date ne doit pas être partagée.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Choisissez un Mode",
    step_1_desc: "Sélectionnez 'Par tranche d'âge' pour générer un anniversaire pour quelqu'un d'un âge donné, ou 'Par année de naissance' pour limiter le résultat à une période spécifique.",
    step_2_title: "Définissez la Plage",
    step_2_desc: "Saisissez les valeurs minimale et maximale — âges ou années — pour définir la fenêtre de la date aléatoire.",
    step_3_title: "Générer et Copier",
    step_3_desc: "Cliquez sur 'Générer une Date de Naissance'. Le résultat affiche la date et l'âge exact calculé. Utilisez le bouton de copie pour copier la date générée.",
    ex_title: "Exemples Courants",
    ex1: "Personnage jeune adulte : définissez la tranche 18–25 ans pour générer une date de naissance de quelqu'un de cet âge actuellement.",
    ex2: "Jeu de données millénial : définissez l'intervalle 1981–1996 pour générer des dates de la génération milléniale.",
    ex3: "PNJ senior : définissez la tranche 60–80 ans pour générer une date pour un personnage âgé dans une histoire ou un jeu.",
    ex4: "Échantillon baby boomer : définissez l'intervalle 1946–1964 pour créer des données de test pour cette démographie.",
    faq_title: "Questions Fréquentes",
    mode_label: "Mode de Génération",
    placeholder: "Cliquez sur Générer pour créer une date",
    copy: "Copier la date",
    faq1q: "Comment fonctionne le générateur de date de naissance aléatoire ?",
    faq1a: "Choisissez la méthode : par tranche d'âge (par exemple 25–35 ans) ou par intervalle d'années (comme 1990–2000). Saisissez les valeurs et cliquez sur 'Générer une Date de Naissance'. L'outil crée une date aléatoire et calcule l'âge exact.",
    faq2q: "À quoi sert un générateur de date de naissance ?",
    faq2a: "Il est idéal pour les développeurs testant des validations d'âge, les écrivains créant des personnages réalistes, les administrateurs de bases de données générant des données de test, et les éducateurs ou chercheurs.",
    see1: "Calculateur d'Âge",
    see2: "Calculatrice de Date Future",
    see3: "Calculatrice de Date Passée",
    see4: "Différence entre Dates"
  },
  it: {
    title: "Generatore di Data di Nascita Casuale",
    pageTitle: "Generatore di Data di Nascita Casuale per Età o Anno | Gratis",
    meta: "Genera date di nascita casuali all'istante con calcolo esatto dell'età. Crea date per fascia d'età o anno per test, personaggi e dati di esempio.",
    ages: "Per fascia d'età",
    years: "Per anno di nascita",
    minAge: "Età Minima",
    maxAge: "Età Massima",
    minYear: "Anno Iniziale",
    maxYear: "Anno Finale",
    bt: "Genera Data di Nascita",
    dt: "Data di Nascita",
    age: "Età",
    years_label: "Anni",
    months_label: "Mesi",
    days_label: "Giorni",
    how_desc: "Utilizza il nostro Generatore di Date di Nascita per creare date di nascita casuali basate su una fascia d'età specifica o su un intervallo di anni. Puoi impostare, ad esempio, una fascia da 18 a 30 anni o un periodo come 1984–2000. Lo strumento calcola anche automaticamente l'età esatta in anni, mesi e giorni.",
    features_title: "Funzionalità",
    f_1: "Generazione di date di nascita casuali per fascia d'età",
    f_2: "Generazione di date di nascita casuali per intervallo di anni",
    f_3: "Calcolo automatico dell'età esatta in anni, mesi e giorni",
    use_cases_title: "Principali Applicazioni",
    use_1_t: "Test Software",
    use_1_d: "Genera date di nascita realistiche per testare validazioni di età.",
    use_2_t: "Creazione di Personaggi e Giochi",
    use_2_d: "Crea date credibili per personaggi fittizi, NPC e worldbuilding.",
    use_3_t: "Dati di Esempio e Ricerca",
    use_3_d: "Produci dati demografici fittizi per mockup, prototipi e studi.",
    use_4_t: "Privacy",
    use_4_d: "Usa una data generata come segnaposto quando la data reale non deve essere condivisa.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Scegli la Modalità",
    step_1_desc: "Seleziona 'Per fascia d'età' per generare un compleanno per qualcuno di una data età, o 'Per anno di nascita' per limitare il risultato a un periodo specifico.",
    step_2_title: "Imposta l'Intervallo",
    step_2_desc: "Inserisci i valori minimo e massimo — età o anni — per definire la finestra della data casuale.",
    step_3_title: "Genera e Copia",
    step_3_desc: "Clicca su 'Genera Data di Nascita'. Il risultato mostra la data e l'età esatta calcolata. Usa il pulsante di copia per copiare la data generata.",
    ex_title: "Esempi Comuni",
    ex1: "Personaggio giovane adulto: imposta fascia 18–25 anni per generare una data di nascita di qualcuno di quell'età attualmente.",
    ex2: "Dataset millennial: imposta intervallo 1981–1996 per generare date della generazione millennial.",
    ex3: "NPC anziano: imposta fascia 60–80 anni per generare una data per un personaggio anziano in una storia o gioco.",
    ex4: "Campione baby boomer: imposta intervallo 1946–1964 per creare dati di test per quella demografia.",
    faq_title: "Domande Frequenti",
    mode_label: "Modalità di Generazione",
    placeholder: "Clicca su Genera per creare una data",
    copy: "Copia data",
    faq1q: "Come funziona il generatore di data di nascita casuale?",
    faq1a: "Scegli il metodo: per fascia d'età (ad esempio 25–35 anni) o per intervallo di anni (come 1990–2000). Inserisci i valori e clicca su 'Genera Data di Nascita'. Lo strumento crea una data casuale e calcola l'età esatta.",
    faq2q: "A cosa serve un generatore di data di nascita?",
    faq2a: "È ideale per sviluppatori che testano validazioni di età, scrittori che creano personaggi realistici, amministratori di database che generano dati di test, e educatori o ricercatori.",
    see1: "Calcolatrice dell'Età",
    see2: "Calcolatrice di Data Futura",
    see3: "Calcolatrice di Data Passata",
    see4: "Differenza tra Date"
  },
  id: {
    title: "Generator Tanggal Lahir Acak",
    pageTitle: "Generator Tanggal Lahir Acak berdasarkan Usia atau Tahun | Gratis",
    meta: "Buat tanggal lahir acak secara instan dengan perhitungan usia tepat. Buat tanggal berdasarkan rentang usia atau tahun untuk pengujian, karakter, dan data contoh.",
    ages: "Berdasarkan rentang usia",
    years: "Berdasarkan tahun lahir",
    minAge: "Usia Minimum",
    maxAge: "Usia Maksimum",
    minYear: "Tahun Awal",
    maxYear: "Tahun Akhir",
    bt: "Buat Tanggal Lahir",
    dt: "Tanggal Lahir",
    age: "Usia",
    years_label: "Tahun",
    months_label: "Bulan",
    days_label: "Hari",
    how_desc: "Gunakan Generator Tanggal Lahir kami untuk membuat tanggal lahir acak berdasarkan rentang usia tertentu atau interval tahun pilihan Anda. Anda bisa menetapkan rentang usia 18–30 tahun atau periode seperti 1984–2000. Alat ini juga menghitung usia tepat secara otomatis dalam tahun, bulan, dan hari.",
    features_title: "Fitur",
    f_1: "Pembuatan tanggal lahir acak berdasarkan rentang usia",
    f_2: "Pembuatan tanggal lahir acak berdasarkan rentang tahun",
    f_3: "Perhitungan usia tepat otomatis dalam tahun, bulan, dan hari",
    use_cases_title: "Kegunaan Utama",
    use_1_t: "Pengujian Perangkat Lunak",
    use_1_d: "Hasilkan tanggal lahir realistis untuk menguji validasi usia.",
    use_2_t: "Pembuatan Karakter dan Game",
    use_2_d: "Buat tanggal yang meyakinkan untuk karakter fiksi, NPC, dan worldbuilding.",
    use_3_t: "Data Contoh dan Penelitian",
    use_3_d: "Hasilkan data demografis fiktif untuk mockup, prototipe, dan studi.",
    use_4_t: "Privasi",
    use_4_d: "Gunakan tanggal yang dihasilkan sebagai pengganti saat tanggal lahir asli tidak boleh dibagikan.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Pilih Mode",
    step_1_desc: "Pilih 'Berdasarkan rentang usia' untuk membuat tanggal lahir seseorang dengan usia tertentu, atau 'Berdasarkan tahun lahir' untuk membatasi hasil ke periode tertentu.",
    step_2_title: "Tentukan Rentang",
    step_2_desc: "Masukkan nilai minimum dan maksimum — usia atau tahun — untuk menentukan jendela tanggal acak.",
    step_3_title: "Buat dan Salin",
    step_3_desc: "Klik 'Buat Tanggal Lahir'. Hasilnya menampilkan tanggal lahir dan usia tepat yang dihitung. Gunakan tombol salin untuk menyalin tanggal yang dihasilkan.",
    ex_title: "Contoh Umum",
    ex1: "Karakter dewasa muda: atur rentang usia 18–25 untuk membuat tanggal lahir seseorang yang saat ini berusia tersebut.",
    ex2: "Dataset millennial: atur rentang tahun 1981–1996 untuk membuat tanggal lahir generasi millennial.",
    ex3: "NPC lansia: atur rentang usia 60–80 untuk membuat tanggal lahir karakter lansia dalam cerita atau game.",
    ex4: "Sampel baby boomer: atur rentang tahun 1946–1964 untuk membuat data uji demografis tersebut.",
    faq_title: "Pertanyaan Umum",
    mode_label: "Mode Pembuatan",
    placeholder: "Klik Generate untuk membuat tanggal lahir",
    copy: "Salin tanggal",
    faq1q: "Bagaimana cara kerja generator tanggal lahir acak?",
    faq1a: "Pilih metode: berdasarkan rentang usia (misalnya 25–35 tahun) atau interval tahun (seperti 1990–2000). Masukkan nilai dan klik 'Buat Tanggal Lahir'. Alat ini membuat tanggal lahir acak dan menghitung usia tepat berdasarkan tanggal hari ini.",
    faq2q: "Untuk apa generator tanggal lahir digunakan?",
    faq2a: "Generator ini ideal untuk pengembang yang menguji validasi usia, penulis yang membuat karakter realistis, administrator database yang menghasilkan data uji, serta pendidik atau peneliti.",
    see1: "Kalkulator Usia",
    see2: "Kalkulator Tanggal Masa Depan",
    see3: "Kalkulator Tanggal Masa Lalu",
    see4: "Selisih Tanggal"
  }
}
</i18n>
