<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f_1'),
    t('f_2'),
    t('f_3'),
    t('f_4')
  ],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') }
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
  ]
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

const baseKeys = ['binary', 'ternary', 'quaternary', 'quinary', 'senary', 'septenary', 'octal', 'nonary', 'decimal', 'undecimal', 'duodecimal', 'tridecimal', 'tetradecimal', 'pentadecimal', 'hexadecimal', 'heptadecimal', 'octodecimal', 'nonadecimal', 'vigesimal']
const bases = Array.from({ length: 19 }, (_, i) => ({ value: String(i + 2), key: baseKeys[i] }))

const state = reactive({
  number: '',
  from: '10',
  to: '2',
  ads: false
})

const baseOptions = computed(() =>
  bases.map(b => ({ label: `(Base ${b.value}) ${t(b.key)}`, value: b.value }))
)

const output = computed(() => {
  if (!state.number.trim()) return null
  if (!state.ads) state.ads = true
  const parsed = parseInt(state.number, Number(state.from))
  if (isNaN(parsed)) return t('err')
  return parsed.toString(Number(state.to))
})



defineI18nRoute({
  paths: {
    en: '/number-base-converter',
    pt: '/conversor-de-bases-numericas',
    es: '/convertidor-de-bases-numericas',
    fr: '/convertisseur-de-bases-numeriques',
    it: '/convertitore-di-basi-numeriche',
    id: '/konverter-basis-angka',
    de: '/zahlenbasen-umrechner',
    nl: '/talstelsel-converter'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Positional_notation`"
    :wiki-label="'Wikipedia (Numeral Systems)'"
    :see-also-links="[
      { label: t('see1'), to: 'xml-to-json-converter' },
      { label: t('see2'), to: 'json-to-xml-converter' },
      { label: t('see3'), to: 'csv-to-json-converter' },
      { label: t('see4'), to: 'json-to-csv-converter' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="form-control w-full">
          <label for="num-value" class="label">
            <span class="label-text font-bold text-base-content text-xs uppercase tracking-wider">{{ t('num') }}</span>
          </label>
          <input
            id="num-value"
            v-model="state.number"
            type="text"
            class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl"
            autofocus
          />
        </div>

        <ToolSelect
          v-model="state.from"
          :label="t('from')"
          :options="baseOptions"
        />

        <ToolSelect
          v-model="state.to"
          :label="t('to')"
          :options="baseOptions"
        />
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <LineCopy v-if="output" :label="t('result')" :content="output">
          {{ output }}
        </LineCopy>
      </Transition>
    </div>

    <Mordizi v-if="state.ads" />

    <template #info>
      <div class="space-y-8">
        <p>{{ t('d1') }}</p>

        <UseCaseSection
          :title="t('tech_title')"
          :description="t('tech_desc')"
          :items="[
            { title: t('t_1_t'), description: t('t_1_d') },
            { title: t('t_2_t'), description: t('t_2_d') },
            { title: t('t_3_t'), description: t('t_3_d') },
            { title: t('t_4_t'), description: t('t_4_d') }
          ]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :description="t('uc_intro')"
          :items="[
            { title: t('uc_1_t'), description: t('uc_1_d') },
            { title: t('uc_2_t'), description: t('uc_2_d') },
            { title: t('uc_3_t'), description: t('uc_3_d') },
            { title: t('uc_4_t'), description: t('uc_4_d') }
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
            { question: t('faq_4_q'), answer: t('faq_4_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    m_title: "Number Base Converter — Binary, Octal, Decimal, Hex | Free Online",
    title: "Number Base Converter",
    meta: "Free online number base converter. Convert between binary, octal, decimal, hexadecimal and 15 other bases instantly. Perfect for programming, engineering and computer science.",
    num: "Number",
    from: "From",
    to: "To",
    result: "Result",
    err: "Invalid number",
    binary: "Binary",
    ternary: "Ternary",
    quaternary: "Quaternary",
    quinary: "Quinary",
    senary: "Senary",
    septenary: "Septenary",
    octal: "Octal",
    nonary: "Nonary",
    decimal: "Decimal",
    undecimal: "Undecimal",
    duodecimal: "Duodecimal",
    tridecimal: "Tridecimal",
    tetradecimal: "Tetradecimal",
    pentadecimal: "Pentadecimal",
    hexadecimal: "Hexadecimal",
    heptadecimal: "Heptadecimal",
    octodecimal: "Octodecimal",
    nonadecimal: "Nonadecimal",
    vigesimal: "Vigesimal",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Free online tool to convert numbers between any two bases from 2 to 20. Convert binary to decimal, hexadecimal to octal, or any combination instantly with maximum precision and zero delays.",
    how_to_use_title: "How to use",
    how_desc: "This tool parses the input number in its source base and converts it to the target base using mathematically exact algorithms. The conversion runs entirely in your browser, ensuring privacy and speed.",
    step_1_title: "Enter Number",
    step_1_desc: "Type or paste the number you want to convert in the 'Number' field.",
    step_2_title: "Select Bases",
    step_2_desc: "Choose the source base (From) and the target base (To) from the dropdown menus.",
    step_3_title: "Copy Result",
    step_3_desc: "The converted number will appear instantly in the result area for you to copy.",
    use_cases_title: "Common Applications",
    uc_intro: "Number base conversion is a fundamental skill in computer science and engineering. Common real-world uses include:",
    uc_1_t: "Software Debugging",
    uc_1_d: "Debug binary and hexadecimal representations in embedded systems and low-level programming.",
    uc_2_t: "Educational Practice",
    uc_2_d: "Practice numeral system conversions for computer science and digital electronics coursework.",
    uc_3_t: "Systems Programming",
    uc_3_d: "Convert memory addresses between octal, decimal and hexadecimal in assembly programming.",
    uc_4_t: "Historical Research",
    uc_4_d: "Explore historical numeral systems such as vigesimal for academic and mathematical research.",
    tech_title: "Technical Notes",
    tech_desc: "Key technical details about the bases supported by this converter:",
    t_1_t: "Binary (Base 2)",
    t_1_d: "Uses only 0 and 1 — the foundation of all digital computing and hardware logic.",
    t_2_t: "Octal & Hexadecimal",
    t_2_d: "Compact representations used in memory addressing, file permissions, and color codes.",
    t_3_t: "Decimal (Base 10)",
    t_3_d: "The standard human-readable system used as the primary interface for all conversions.",
    t_4_t: "Advanced Bases",
    t_4_d: "Support for bases 11–20, including vigesimal (base 20) used by ancient civilizations.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is the most common number base conversion in programming?",
    faq_1_a: "Binary ↔ Hexadecimal. Hexadecimal is a compact representation of binary: each hex digit maps exactly to 4 binary digits (nibble). For example, 0xFF = 11111111 in binary = 255 in decimal.",
    faq_2_q: "How do I convert binary to decimal?",
    faq_2_a: "Enter the binary number in the input field, select Base 2 as the source, and Base 10 as the target. The result appears instantly — no button press needed.",
    faq_3_q: "What is hexadecimal used for in programming?",
    faq_3_a: "Hexadecimal is used for memory addresses, color codes (#RGB), file permissions in Unix (e.g. chmod 0x755), network MAC addresses, and raw byte values in debugging tools and hex editors.",
    faq_4_q: "Are there limits to the numbers I can convert?",
    faq_4_a: "Yes. This tool supports safe integers up to 2⁵³ - 1 (about 9 quadrillion in decimal). For most practical uses in programming and education, this limit is never reached.",
    f_1: "Convert between bases 2 to 20 instantly",
    f_2: "Supports binary, octal, decimal, hexadecimal and vigesimal",
    f_3: "No server calls — runs entirely in the browser",
    f_4: "Mathematically exact conversions for all supported bases"
  },
  pt: {
    m_title: "Conversor de Bases Numéricas — Binário, Octal, Decimal, Hex | Grátis",
    title: "Conversor de Bases Numéricas",
    meta: "Conversor de bases numéricas online grátis. Converta entre binário, octal, decimal, hexadecimal e outras 15 bases instantaneamente. Ideal para programação e ciência da computação.",
    num: "Número",
    from: "De",
    to: "Para",
    result: "Resultado",
    err: "Número inválido",
    binary: "Binário",
    ternary: "Ternário",
    quaternary: "Quaternário",
    quinary: "Quinário",
    senary: "Senário",
    septenary: "Septenário",
    octal: "Octal",
    nonary: "Nonário",
    decimal: "Decimal",
    undecimal: "Undecimal",
    duodecimal: "Duodecimal",
    tridecimal: "Tridecimal",
    tetradecimal: "Tetradecimal",
    pentadecimal: "Pentadecimal",
    hexadecimal: "Hexadecimal",
    heptadecimal: "Heptadecimal",
    octodecimal: "Octodecimal",
    nonadecimal: "Nonadecimal",
    vigesimal: "Vigesimal",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Ferramenta online gratuita para converter números entre qualquer base de 2 a 20. Converta binário para decimal, hexadecimal para octal ou qualquer combinação instantaneamente, com máxima precisão e sem atrasos.",
    how_to_use_title: "Como usar",
    how_desc: "Esta ferramenta interpreta o número na base de origem e o converte para a base alvo usando algoritmos matematicamente exatos. O processo ocorre inteiramente no seu navegador, garantindo privacidade e rapidez.",
    step_1_title: "Digite o Número",
    step_1_desc: "Digite ou cole o número que deseja converter no campo 'Número'.",
    step_2_title: "Selecione as Bases",
    step_2_desc: "Escolha a base de origem (De) e a base de destino (Para) nos menus suspensos.",
    step_3_title: "Copie o Resultado",
    step_3_desc: "O número convertido aparecerá instantaneamente na área de resultado para você copiar.",
    use_cases_title: "Aplicações Comuns",
    uc_intro: "A conversão de bases numéricas é uma habilidade fundamental em ciência da computação e engenharia. Usos comuns incluem:",
    uc_1_t: "Depuração de Software",
    uc_1_d: "Depure representações binárias e hexadecimais em sistemas embarcados e programação de baixo nível.",
    uc_2_t: "Prática Educativa",
    uc_2_d: "Pratique conversões entre sistemas numéricos para disciplinas de ciência da computação e eletrônica digital.",
    uc_3_t: "Programação de Sistemas",
    uc_3_d: "Converta endereços de memória entre octal, decimal e hexadecimal em sistemas e programação assembly.",
    uc_4_t: "Pesquisa Histórica",
    uc_4_d: "Explore sistemas numéricos históricos como o vigesimal para fins acadêmicos e matemáticos.",
    tech_title: "Notas Técnicas",
    tech_desc: "Detalhes técnicos importantes sobre as bases suportadas por este conversor:",
    t_1_t: "Binário (Base 2)",
    t_1_d: "Usa apenas 0 e 1 — a base de toda computação digital, lógica de hardware e operações bitwise.",
    t_2_t: "Octal & Hexadecimal",
    t_2_d: "Representações compactas amplamente usadas em endereçamento de memória, permissões Unix e códigos de cores.",
    t_3_t: "Decimal (Base 10)",
    t_3_d: "O sistema padrão de leitura humana; todas as outras bases são convertidas internamente através do decimal.",
    t_4_t: "Bases Avançadas",
    t_4_d: "Suporte para bases 11–20, incluindo o vigesimal usado por civilizações antigas.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Qual é a conversão de bases mais comum na programação?",
    faq_1_a: "Binário ↔ Hexadecimal. O hexadecimal é uma representação compacta do binário: cada dígito hex corresponde exatamente a 4 dígitos binários (nibble). Por exemplo, 0xFF = 11111111 em binário = 255 em decimal.",
    faq_2_q: "Como converter binário para decimal?",
    faq_2_a: "Insira o número binário no campo de entrada, selecione Base 2 como origem e Base 10 como destino. O resultado aparece instantaneamente — sem precisar clicar em nenhum botão.",
    faq_3_q: "Para que serve o hexadecimal na programação?",
    faq_3_a: "O hexadecimal é usado em endereços de memória, códigos de cor (#RGB), permissões de arquivos Unix (ex: chmod 0x755), endereços MAC de rede e valores brutos de bytes em ferramentas de depuração e editores hexadecimais.",
    faq_4_q: "Há limites para os números que posso converter?",
    faq_4_a: "Sim. Esta ferramenta suporta inteiros seguros até 2⁵³ - 1 (cerca de 9 quatrilhões em decimal). Para a maioria dos usos práticos em programação e educação, esse limite nunca é atingido.",
    f_1: "Converter entre bases 2 a 20 instantaneamente",
    f_2: "Suporta binário, octal, decimal, hexadecimal e vigesimal",
    f_3: "Sem chamadas ao servidor — roda inteiramente no navegador",
    f_4: "Conversões matematicamente exatas para todas as bases suportadas"
  },
  es: {
    m_title: "Conversor de Bases Numéricas — Binario, Octal, Decimal, Hex | Gratis",
    title: "Conversor de Bases Numéricas",
    meta: "Conversor de bases numéricas online gratis. Convierte entre binario, octal, decimal, hexadecimal y otras 15 bases al instante. Ideal para programación y ciencias de la computación.",
    num: "Número",
    from: "De",
    to: "A",
    result: "Resultado",
    err: "Número inválido",
    binary: "Binario",
    ternary: "Ternario",
    quaternary: "Cuaternario",
    quinary: "Quinario",
    senary: "Senario",
    septenary: "Septenario",
    octal: "Octal",
    nonary: "Nonario",
    decimal: "Decimal",
    undecimal: "Undecimal",
    duodecimal: "Duodecimal",
    tridecimal: "Tridecimal",
    tetradecimal: "Tetradecimal",
    pentadecimal: "Pentadecimal",
    hexadecimal: "Hexadecimal",
    heptadecimal: "Heptadecimal",
    octodecimal: "Octodecimal",
    nonadecimal: "Nonadecimal",
    vigesimal: "Vigesimal",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Herramienta online gratuita para convertir números entre cualquier base del 2 al 20. Convierte binario a decimal, hexadecimal a octal o cualquier combinación al instante, con máxima precisión y sin retrasos.",
    how_to_use_title: "Cómo usar",
    how_desc: "Esta herramienta interpreta el número en la base de origen y lo convierte a la base destino utilizando algoritmos matemáticamente exactos. El proceso se ejecuta completamente en su navegador, garantizando privacidad y rapidez.",
    step_1_title: "Ingrese el Número",
    step_1_desc: "Escriba o pegue el número que desea convertir en el campo 'Número'.",
    step_2_title: "Seleccione las Bases",
    step_2_desc: "Elija la base de origen (De) y la base de destino (A) en los menús desplegables.",
    step_3_title: "Copie el Resultado",
    step_3_desc: "El número convertido aparecerá instantáneamente en el área de resultado para que lo copies.",
    use_cases_title: "Aplicaciones Comunes",
    uc_intro: "La conversión de bases numéricas es una habilidad fundamental en informática e ingeniería. Usos comunes incluyen:",
    uc_1_t: "Depuración de Software",
    uc_1_d: "Depure representaciones binarias y hexadecimales en sistemas embebidos y programación de bajo nivel.",
    uc_2_t: "Práctica Educativa",
    uc_2_d: "Practique conversiones entre sistemas numéricos para cursos de informática y electrónica digital.",
    uc_3_t: "Programación de Sistemas",
    uc_3_d: "Convierta direcciones de memoria entre octal, decimal y hexadecimal en ensamblador y sistemas.",
    uc_4_t: "Investigación Histórica",
    uc_4_d: "Explore sistemas numéricos históricos como el vigesimal para fines académicos y matemáticos.",
    tech_title: "Notas Técnicas",
    tech_desc: "Detalles técnicos importantes sobre las bases soportadas por este conversor:",
    t_1_t: "Binario (Base 2)",
    t_1_d: "Usa solo 0 y 1 — la base de toda la computación digital, lógica de hardware y operaciones bitwise.",
    t_2_t: "Octal y Hexadecimal",
    t_2_d: "Representaciones compactas usadas en direccionamiento de memoria, permisos Unix e iconos de color.",
    t_3_t: "Decimal (Base 10)",
    t_3_d: "El sistema estándar de lectura humana utilizado como interfaz principal para todas las conversiones.",
    t_4_t: "Bases Avanzadas",
    t_4_d: "Soporte para bases 11–20, incluyendo el vigesimal (base 20) usado por civilizaciones antiguas.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cuál es la conversión de bases más común en programación?",
    faq_1_a: "Binario ↔ Hexadecimal. El hexadecimal es una representación compacta del binario: cada dígito hex corresponde exactamente a 4 dígitos binarios (nibble). Por ejemplo, 0xFF = 11111111 en binario = 255 en decimal.",
    faq_2_q: "¿Cómo convierto binario a decimal?",
    faq_2_a: "Ingresa el número binario en el campo de entrada, selecciona Base 2 como origen y Base 10 como destino. El resultado aparece instantáneamente, sin necesidad de pulsar ningún botón.",
    faq_3_q: "¿Para qué sirve el hexadecimal en programación?",
    faq_3_a: "El hexadecimal se usa en direcciones de memoria, códigos de color (#RGB), permisos de archivos Unix (ej: chmod 0x755), direcciones MAC de red y valores brutos de bytes en herramientas de depuración y editores hexadecimales.",
    faq_4_q: "¿Hay límites para los números que puedo convertir?",
    faq_4_a: "Sí. Esta herramienta admite enteros seguros hasta 2⁵³ - 1 (unos 9 cuatrillones en decimal). Para la mayoría de los usos prácticos en programación y educación, este límite nunca se alcanza.",
    f_1: "Convertir entre bases 2 a 20 instantáneamente",
    f_2: "Soporta binario, octal, decimal, hexadecimal y vigesimal",
    f_3: "Sin llamadas al servidor — se ejecuta completamente en el navegador",
    f_4: "Conversiones matemáticamente exactas para todas las bases compatibles"
  },
  fr: {
    m_title: "Convertisseur de Bases Numériques — Binaire, Octal, Décimal, Hex | Gratuit",
    title: "Convertisseur de Bases Numériques",
    meta: "Convertisseur de bases numériques en ligne gratuit. Convertissez entre binaire, octal, décimal, hexadécimal et 15 autres bases instantanément. Idéal pour la programmation et l'informatique.",
    num: "Nombre",
    from: "De",
    to: "À",
    result: "Résultat",
    err: "Nombre invalide",
    binary: "Binaire",
    ternary: "Ternaire",
    quaternary: "Quaternaire",
    quinary: "Quinaire",
    senary: "Sénaire",
    septenary: "Septénaire",
    octal: "Octal",
    nonary: "Nonaire",
    decimal: "Décimal",
    undecimal: "Undécimal",
    duodecimal: "Duodécimal",
    tridecimal: "Tridécimal",
    tetradecimal: "Tétradécimal",
    pentadecimal: "Pentadécimal",
    hexadecimal: "Hexadécimal",
    heptadecimal: "Heptadécimal",
    octodecimal: "Octodécimal",
    nonadecimal: "Nonadécimal",
    vigesimal: "Vigésimal",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Outil en ligne gratuit pour convertir des nombres entre deux bases quelconques de 2 à 20. Convertissez binaire en décimal, hexadécimal en octal ou toute combinaison instantanément, avec une précision maximale et sans délai.",
    how_to_use_title: "Comment utiliser",
    how_desc: "Cet outil interprète le nombre dans la base source et le convertit vers la base cible en utilisant des algorithmes mathématiquement exacts. Le processus s'exécute entièrement dans votre navigateur, garantissant confidentialité et rapidité.",
    step_1_title: "Saisir le Nombre",
    step_1_desc: "Saisissez ou collez le nombre que vous souhaitez convertir dans le champ 'Nombre'.",
    step_2_title: "Sélectionner les Bases",
    step_2_desc: "Choisissez la base source (De) et la base cible (À) dans les menus déroulants.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "Le nombre converti apparaîtra instantanément dans la zone de résultat pour que vous puissiez le copier.",
    use_cases_title: "Applications Courantes",
    uc_intro: "La conversion de bases numériques est une compétence fondamentale en informatique. Les utilisations courantes incluent :",
    uc_1_t: "Débogage Logiciel",
    uc_1_d: "Déboguez les représentations binaires et hexadécimales dans les systèmes embarqués.",
    uc_2_t: "Pratique Éducative",
    uc_2_d: "Pratiquez les conversions pour les cours d'informatique et d'électronique numérique.",
    uc_3_t: "Programmation Système",
    uc_3_d: "Convertissez les adresses mémoire entre octal, décimal et hexadécimal en assembleur.",
    uc_4_t: "Recherche Historique",
    uc_4_d: "Explorez les systèmes historiques comme le vigésimal pour la recherche académique.",
    tech_title: "Notes Techniques",
    tech_desc: "Détails techniques importants sur les bases supportées par ce convertisseur :",
    t_1_t: "Binaire (Base 2)",
    t_1_d: "Utilise uniquement 0 et 1 — la base de toute l'informatique numérique e de la logique matérielle.",
    t_2_t: "Octal & Hexadécimal",
    t_2_d: "Représentations compactes utilisées dans l'adressage mémoire e les permissions Unix.",
    t_3_t: "Décimal (Base 10)",
    t_3_d: "Le système standard lisible par l'humain utilisé comme interface principale.",
    t_4_t: "Bases Avancées",
    t_4_d: "Support des bases 11–20, incluant le vigésimal (base 20) utilisé par les anciennes civilisations.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Quelle est la conversion de bases la plus courante en programmation ?",
    faq_1_a: "Binaire ↔ Hexadécimal. L'hexadécimal est une représentation compacte du binaire : chaque chiffre hex correspond exactement à 4 chiffres binaires (nibble). Par exemple, 0xFF = 11111111 en binaire = 255 en décimal.",
    faq_2_q: "Comment convertir du binaire en décimal ?",
    faq_2_a: "Saisissez le nombre binaire dans le champ de saisie, sélectionnez Base 2 comme source et Base 10 comme cible. Le résultat s'affiche instantanément, sans appuyer sur aucun bouton.",
    faq_3_q: "À quoi sert l'hexadécimal en programmation ?",
    faq_3_a: "L'hexadécimal est utilisé pour les adresses mémoire, les codes couleur (#RGB), les permissions de fichiers Unix (ex : chmod 0x755), les adresses MAC réseau et les valeurs brutes d'octets dans les outils de débogage et les éditeurs hexadécimaux.",
    faq_4_q: "Y a-t-il des limites aux nombres que je peux convertir ?",
    faq_4_a: "Oui. Cet outil prend en charge les entiers sûrs jusqu'à 2⁵³ - 1 (environ 9 quadrillions en décimal). Pour la plupart des usages pratiques en programmation et en éducation, cette limite n'est jamais atteinte.",
    f_1: "Convertir entre les bases 2 à 20 instantanément",
    f_2: "Supporte binaire, octal, décimal, hexadécimal et vigésimal",
    f_3: "Sans appels serveur — s'exécute entièrement dans le navigateur",
    f_4: "Conversions mathématiquement exactes pour toutes les bases supportées"
  },
  it: {
    m_title: "Convertitore di Basi Numeriche — Binario, Ottale, Decimale, Hex | Gratis",
    title: "Convertitore di Basi Numeriche",
    meta: "Convertitore di basi numeriche online gratuito. Converti tra binario, ottale, decimale, esadecimale e altre 15 basi all'istante. Ideale per programmazione e informatica.",
    num: "Numero",
    from: "Da",
    to: "A",
    result: "Risultato",
    err: "Numero non valido",
    binary: "Binario",
    ternary: "Ternario",
    quaternary: "Quaternario",
    quinary: "Quinario",
    senary: "Senario",
    septenary: "Settenario",
    octal: "Ottale",
    nonary: "Nonario",
    decimal: "Decimale",
    undecimal: "Undecimale",
    duodecimal: "Duodecimale",
    tridecimal: "Tridecimale",
    tetradecimal: "Tetradecimale",
    pentadecimal: "Pentadecimale",
    hexadecimal: "Esadecimale",
    heptadecimal: "Eptadecimale",
    octodecimal: "Ottodecimale",
    nonadecimal: "Nonadecimale",
    vigesimal: "Vigesimale",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Strumento online gratuito per convertire numeri tra due basi qualsiasi da 2 a 20. Converti binario in decimale, esadecimale in ottale o qualsiasi combinazione all'istante, con la massima precisione e senza ritardi.",
    how_to_use_title: "Come usare",
    how_desc: "Questo strumento interpreta il numero nella base di origine e lo converte nella base di destinazione utilizzando algoritmi matematicamente esatti. Il processo avviene interamente nel tuo browser, garantendo privacy e velocità.",
    step_1_title: "Inserisci il Numero",
    step_1_desc: "Digita o incolla il numero che desideri convertire nel campo 'Numero'.",
    step_2_title: "Seleziona le Basi",
    step_2_desc: "Scegli la base di origine (Da) e la base di destinazione (A) dai menu a discesa.",
    step_3_title: "Copia il Risultato",
    step_3_desc: "Il numero convertito apparirà istantaneamente nell'area dei risultati per essere copiato.",
    use_cases_title: "Applicazioni Comuni",
    uc_intro: "La conversione di basi numeriche è una competenza fondamentale in informatica. Gli usi comuni includono:",
    uc_1_t: "Debug del Software",
    uc_1_d: "Esegui il debug di rappresentazioni binarie ed esadecimali in sistemi embedded e firmware.",
    uc_2_t: "Pratica Educativa",
    uc_2_d: "Esercitati con le conversioni per corsi di informatica ed elettronica digitale.",
    uc_3_t: "Programmazione di Sistemi",
    uc_3_d: "Converti indirizzi di memoria tra ottale, decimale ed esadecimale in assembly.",
    uc_4_t: "Ricerca Storica",
    uc_4_d: "Esplora sistemi numerici storici come il vigesimale per scopi accademici.",
    tech_title: "Note Tecniche",
    tech_desc: "Dettagli tecnici importanti sulle basi supportate da questo convertitore:",
    t_1_t: "Binario (Base 2)",
    t_1_d: "Usa solo 0 e 1 — la base di tutta l'informatica digitale e della logica hardware.",
    t_2_t: "Ottale & Esadecimale",
    t_2_d: "Rappresentazioni compatte usate nell'indirizzamento di memoria e permessi Unix.",
    t_3_t: "Decimale (Base 10)",
    t_3_d: "Il sistema standard leggibile dall'uomo utilizzato come interfaccia principale.",
    t_4_t: "Basi Avanzate",
    t_4_d: "Supporto per basi 11–20, incluso il vigesimale (base 20) usato da antiche civiltà.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Qual è la conversione di basi più comune nella programmazione?",
    faq_1_a: "Binario ↔ Esadecimale. L'esadecimale è una rappresentazione compatta del binario: ogni cifra hex corrisponde esattamente a 4 cifre binarie (nibble). Ad esempio, 0xFF = 11111111 in binario = 255 in decimale.",
    faq_2_q: "Come converto il binario in decimale?",
    faq_2_a: "Inserisci il numero binario nel campo di input, seleziona Base 2 come origine e Base 10 come destinazione. Il risultato appare istantaneamente, senza premere alcun pulsante.",
    faq_3_q: "A cosa serve l'esadecimale nella programmazione?",
    faq_3_a: "L'esadecimale è usato per gli indirizzi di memoria, i codici colore (#RGB), i permessi dei file Unix (es: chmod 0x755), gli indirizzi MAC di rete e i valori grezzi in byte negli strumenti di debug e negli editor esadecimali.",
    faq_4_q: "Ci sono limiti ai numeri che posso convertire?",
    faq_4_a: "Sì. Questo strumento supporta numeri interi sicuri fino a 2⁵³ - 1 (circa 9 quadrilioni in decimale). Per la maggior parte degli usi pratici in programmazione e istruzione, questo limite non viene mai raggiunto.",
    f_1: "Convertire tra basi 2 e 20 istantaneamente",
    f_2: "Supporta binario, ottale, decimale, esadecimale e vigesimale",
    f_3: "Nessuna chiamata al server — viene eseguito interamente nel browser",
    f_4: "Conversioni matematicamente esatte per tutte le basi supportate"
  },
  id: {
    m_title: "Konverter Basis Angka — Biner, Oktal, Desimal, Hex | Gratis Online",
    title: "Konverter Basis Angka",
    meta: "Konverter basis angka online gratis. Konversi antara biner, oktal, desimal, heksadesimal, dan 15 basis lainnya secara instan. Ideal untuk pemrograman dan ilmu komputer.",
    num: "Angka",
    from: "Dari",
    to: "Ke",
    result: "Hasil",
    err: "Angka tidak valid",
    binary: "Biner",
    ternary: "Ternary",
    quaternary: "Kuaterner",
    quinary: "Kwiner",
    senary: "Senari",
    septenary: "Septenari",
    octal: "Oktal",
    nonary: "Nonari",
    decimal: "Desimal",
    undecimal: "Undesimal",
    duodecimal: "Duodesimal",
    tridecimal: "Tridesimal",
    tetradecimal: "Tetradesimal",
    pentadecimal: "Pentadesimal",
    hexadecimal: "Heksadesimal",
    heptadecimal: "Heptadesimal",
    octodecimal: "Oktodesimal",
    nonadecimal: "Nonadesimal",
    vigesimal: "Vigesimal",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Alat online gratis untuk mengonversi angka antara dua basis apa pun dari 2 hingga 20. Konversi biner ke desimal, heksadesimal ke oktal, atau kombinasi apa pun secara instan dengan presisi maksimum tanpa hambatan.",
    how_to_use_title: "Cara menggunakan",
    how_desc: "Alat ini mengurai angka input dalam basis sumber dan mengonversinya ke basis target menggunakan algoritma yang tepat secara matematis. Proses ini berjalan sepenuhnya di browser Anda, menjamin privasi dan kecepatan.",
    step_1_title: "Masukkan Angka",
    step_1_desc: "Ketik atau tempel angka yang ingin Anda konversi di kolom 'Angka'.",
    step_2_title: "Pilih Basis",
    step_2_desc: "Pilih basis sumber (Dari) dan basis target (Ke) dari menu tarik-turun.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Angka yang dikonversi akan muncul secara instan di area hasil untuk Anda salin.",
    use_cases_title: "Aplikasi Umum",
    uc_intro: "Konversi basis angka adalah keterampilan mendasar dalam ilmu komputer. Penggunaan umum meliputi:",
    uc_1_t: "Debugging Perangkat Lunak",
    uc_1_d: "Debug representasi biner dan heksadesimal dalam sistem tertanam dan tingkat rendah.",
    uc_2_t: "Praktik Pendidikan",
    uc_2_d: "Latih konversi sistem angka untuk mata kuliah ilmu komputer dan elektronika digital.",
    uc_3_t: "Pemrograman Sistem",
    uc_3_d: "Konversi alamat memori antara oktal, desimal, dan heksadesimal dalam assembly.",
    uc_4_t: "Penelitian Sejarah",
    uc_4_d: "Jelajahi sistem angka historis seperti vigesimal untuk tujuan akademik dan matematika.",
    tech_title: "Catatan Teknis",
    tech_desc: "Detail teknis utama tentang basis yang didukung oleh konverter ini:",
    t_1_t: "Biner (Basis 2)",
    t_1_d: "Hanya menggunakan 0 dan 1 — dasar dari semua komputasi digital dan logika perangkat keras.",
    t_2_t: "Oktal & Heksadesimal",
    t_2_d: "Representasi ringkas yang digunakan dalam pengalamatan memori e izin file Unix.",
    t_3_t: "Desimal (Basis 10)",
    t_3_d: "Sistem standar yang mudah dibaca manusia yang digunakan sebagai antarmuka utama.",
    t_4_t: "Basis Lanjutan",
    t_4_d: "Dukungan untuk basis 11–20, termasuk vigesimal (basis 20) yang digunakan suku Maya.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apa konversi basis angka yang paling umum dalam pemrograman?",
    faq_1_a: "Biner ↔ Heksadesimal. Heksadesimal adalah representasi biner yang ringkas: setiap digit hex memetakan tepat ke 4 digit biner (nibble).",
    faq_2_q: "Bagaimana cara mengonversi biner ke desimal?",
    faq_2_a: "Masukkan angka biner di kolom input, pilih Basis 2 sebagai sumber, dan Basis 10 sebagai target. Hasilnya muncul secara instan.",
    faq_3_q: "Untuk apa heksadesimal digunakan dalam pemrograman?",
    faq_3_a: "Heksadesimal digunakan untuk alamat memori, kode warna (#RGB), izin file Unix, alamat MAC jaringan, dan nilai byte mentah.",
    faq_4_q: "Apakah ada batasan angka yang bisa saya konversi?",
    faq_4_a: "Ya. Alat ini mendukung integer aman hingga 2⁵³ - 1 (sekitar 9 kuadriliun dalam desimal). Untuk sebagian besar penggunaan praktis, batas ini tidak pernah tercapai.",
    f_1: "Konversi antara basis 2 hingga 20 secara instan",
    f_2: "Mendukung biner, oktal, desimal, heksadesimal, dan vigesimal",
    f_3: "Tanpa panggilan server — berjalan sepenuhnya di browser",
    f_4: "Konversi matematis yang tepat untuk semua basis yang didukung"
  },
  de: {
    m_title: "Zahlenbasen-Umrechner — Binär, Oktal, Dezimal, Hex | Kostenlos",
    title: "Zahlenbasen-Umrechner",
    meta: "Kostenloser Online-Zahlenbasen-Umrechner. Konvertiere sofort zwischen Binär, Oktal, Dezimal, Hexadezimal und 15 weiteren Basen. Ideal für Programmierung, Technik und Informatik.",
    num: "Zahl",
    from: "Von",
    to: "Nach",
    result: "Ergebnis",
    err: "Ungültige Zahl",
    binary: "Binär",
    ternary: "Ternär",
    quaternary: "Quaternär",
    quinary: "Quinär",
    senary: "Senär",
    septenary: "Septenär",
    octal: "Oktal",
    nonary: "Nonär",
    decimal: "Dezimal",
    undecimal: "Undezimal",
    duodecimal: "Duodezimal",
    tridecimal: "Tridezimal",
    tetradecimal: "Tetradezimal",
    pentadecimal: "Pentadezimal",
    hexadecimal: "Hexadezimal",
    heptadecimal: "Heptadezimal",
    octodecimal: "Oktodezimal",
    nonadecimal: "Nonadezimal",
    vigesimal: "Vigesimal",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Kostenloses Online-Tool zum Konvertieren von Zahlen zwischen beliebigen Basen von 2 bis 20. Wandle Binär in Dezimal, Hexadezimal in Oktal oder jede andere Kombination sofort um, mit maximaler Genauigkeit und ohne Verzögerung.",
    how_to_use_title: "So verwendest du das Tool",
    how_desc: "Dieses Tool interpretiert die eingegebene Zahl in ihrer Ausgangsbasis und konvertiert sie mit mathematisch exakten Algorithmen in die Zielbasis. Die Umrechnung läuft vollständig in deinem Browser und sorgt so für Datenschutz und Geschwindigkeit.",
    step_1_title: "Zahl eingeben",
    step_1_desc: "Gib die Zahl, die du umrechnen möchtest, in das Feld 'Zahl' ein oder füge sie dort ein.",
    step_2_title: "Basen auswählen",
    step_2_desc: "Wähle die Ausgangsbasis (Von) und die Zielbasis (Nach) in den Dropdown-Menüs aus.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Die umgerechnete Zahl erscheint sofort im Ergebnisbereich und kann dort kopiert werden.",
    use_cases_title: "Häufige Anwendungen",
    uc_intro: "Die Umrechnung von Zahlenbasen ist eine grundlegende Fähigkeit in der Informatik. Anwendungen sind:",
    uc_1_t: "Software-Debugging",
    uc_1_d: "Debugge binäre und hexadezimale Darstellungen in eingebetteten Systemen.",
    uc_2_t: "Bildung & Übung",
    uc_2_d: "Übe Umrechnungen für Informatik- und Digitalelektronik-Kurse.",
    uc_3_t: "Systemprogrammierung",
    uc_3_d: "Wandle Speicheradressen in Assembler zwischen Oktal, Dezimal und Hexadezimal um.",
    uc_4_t: "Historische Forschung",
    uc_4_d: "Untersuche historische Zahlensysteme wie das vigesimale System der Maya.",
    tech_title: "Technische Hinweise",
    tech_desc: "Wichtige technische Details zu den von diesem Umrechner unterstützten Basen:",
    t_1_t: "Binär (Basis 2)",
    t_1_d: "Verwendet nur 0 und 1 — die Grundlage aller digitalen Berechnungen e der Hardwarelogik.",
    t_2_t: "Oktal & Hexadezimal",
    t_2_d: "Kompakte Darstellungen für Speicheradressierung, Unix-Dateirechte e Farbcodes.",
    t_3_t: "Dezimal (Basis 10)",
    t_3_d: "Das für Menschen übliche Standardsystem, das als primäre Schnittstelle dient.",
    t_4_t: "Erweiterte Basen",
    t_4_d: "Unterstützung für die Basen 11–20, einschließlich des vigesimalen Systems (Basis 20).",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Welche Zahlenbasen-Umrechnung ist in der Programmierung am häufigsten?",
    faq_1_a: "Binär ↔ Hexadezimal. Hexadezimal ist eine kompakte Darstellung von Binärzahlen: Jede Hex-Ziffer entspricht genau 4 Binärziffern (Nibble). Zum Beispiel gilt 0xFF = 11111111 binär = 255 dezimal.",
    faq_2_q: "Wie konvertiere ich Binär in Dezimal?",
    faq_2_a: "Gib die Binärzahl in das Eingabefeld ein, wähle Basis 2 als Ausgangsbasis und Basis 10 als Zielbasis. Das Ergebnis erscheint sofort, ohne dass du einen Button drücken musst.",
    faq_3_q: "Wofür wird Hexadezimal in der Programmierung verwendet?",
    faq_3_a: "Hexadezimal wird für Speicheradressen, Farbcodes (#RGB), Unix-Dateirechte (z. B. chmod 0x755), Netzwerk-MAC-Adressen und rohe Bytewerte in Debugging-Tools und Hex-Editoren verwendet.",
    faq_4_q: "Gibt es Grenzen für die Zahlen, die ich umrechnen kann?",
    faq_4_a: "Ja. Dieses Tool unterstützt sichere Ganzzahlen bis 2⁵³ - 1 (etwa 9 Billiarden im Dezimalsystem). Für die meisten praktischen Anwendungen in Programmierung und Bildung wird dieses Limit nie erreicht.",
    f_1: "Sofort zwischen Basen 2 bis 20 umrechnen",
    f_2: "Unterstützt Binär, Oktal, Dezimal, Hexadezimal und Vigesimal",
    f_3: "Keine Serveraufrufe — läuft vollständig im Browser",
    f_4: "Mathematisch exakte Umrechnungen für alle unterstützten Basen"
  },
  nl: {
    m_title: "Talstelsel Converter — Binair, Octaal, Decimaal, Hex | Gratis Online",
    title: "Talstelsel Converter",
    meta: "Gratis online talstelsel converter. Converteer direct tussen binair, octaal, decimaal, hexadecimaal en 15 andere bases. Perfect voor programmeren, techniek en informatica.",
    num: "Getal",
    from: "Van",
    to: "Naar",
    result: "Resultaat",
    err: "Ongeldig getal",
    binary: "Binair",
    ternary: "Ternair",
    quaternary: "Quaternair",
    quinary: "Quinair",
    senary: "Senair",
    septenary: "Septenair",
    octal: "Octaal",
    nonary: "Nonair",
    decimal: "Decimaal",
    undecimal: "Undecimaal",
    duodecimal: "Duodecimaal",
    tridecimal: "Tridecimaal",
    tetradecimal: "Tetradecimaal",
    pentadecimal: "Pentadecimaal",
    hexadecimal: "Hexadecimaal",
    heptadecimal: "Heptadecimaal",
    octodecimal: "Octodecimaal",
    nonadecimal: "Nonadecimaal",
    vigesimal: "Vigesimaal",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    d1: "Gratis online tool om getallen te converteren tussen elke twee bases van 2 tot 20. Converteer binair naar decimaal, hexadecimaal naar octaal, of elke andere combinatie direct met maximale precisie en zonder vertraging.",
    how_to_use_title: "Hoe te gebruiken",
    how_desc: "Deze tool verwerkt het ingevoerde getal in de bronbasis en converteert het naar de doelbasis met behulp van wiskundig exacte algoritmen. De conversie draait volledig in je browser, wat privacy en snelheid garandeert.",
    step_1_title: "Voer getal in",
    step_1_desc: "Typ of plak het getal dat je wilt converteren in het veld 'Getal'.",
    step_2_title: "Selecteer bases",
    step_2_desc: "Kies de bronbasis (Van) en de doelbasis (Naar) uit de keuzemenu's.",
    step_3_title: "Resultaat kopiëren",
    step_3_desc: "Het geconverteerde getal verschijnt direct in het resultaatgebied zodat je het kunt kopiëren.",
    use_cases_title: "Veelvoorkomende toepassingen",
    uc_intro: "Conversie tussen talstelsels is een fundamentele vaardigheid in de informatica en techniek. Veelvoorkomende toepassingen zijn:",
    uc_1_t: "Software Debugging",
    uc_1_d: "Debug binaire en hexadecimale representaties in embedded systemen en low-level programmering.",
    uc_2_t: "Educatieve Oefening",
    uc_2_d: "Oefen conversies tussen talstelsels voor cursussen informatica en digitale elektronica.",
    uc_3_t: "Systeemprogrammering",
    uc_3_d: "Converteer geheugenadressen tussen octaal, decimaal en hexadecimaal in assembly-programmering.",
    uc_4_t: "Historisch Onderzoek",
    uc_4_d: "Verken historische talstelsels zoals vigesimaal (basis 20) voor academisch en wiskundig onderzoek.",
    tech_title: "Technische opmerkingen",
    tech_desc: "Belangrijke technische details over de bases die door deze converter worden ondersteund:",
    t_1_t: "Binair (Basis 2)",
    t_1_d: "Gebruikt alleen 0 en 1 — de basis van alle digitale berekeningen en hardwarelogica.",
    t_2_t: "Octaal & Hexadecimaal",
    t_2_d: "Compacte weergaven die worden gebruikt bij geheugenadressering, bestandsrechten en kleurcodes.",
    t_3_t: "Decimaal (Basis 10)",
    t_3_d: "Het standaard menselijk leesbare systeem dat wordt gebruikt als de primaire interface voor alle conversies.",
    t_4_t: "Geavanceerde Bases",
    t_4_d: "Ondersteuning voor bases 11–20, inclusief vigesimaal (basis 20) dat werd gebruikt door oude beschavingen.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is de meest voorkomende conversie tussen talstelsels bij programmeren?",
    faq_1_a: "Binair ↔ Hexadecimaal. Hexadecimaal is een compacte weergave van binair: elk hex-cijfer komt precies overeen met 4 binaire cijfers (nibble). Bijvoorbeeld, 0xFF = 11111111 in binair = 255 in decimaal.",
    faq_2_q: "Hoe converteer ik binair naar decimaal?",
    faq_2_a: "Voer het binaire getal in het invoerveld in, selecteer Basis 2 als bron en Basis 10 als doel. Het resultaat verschijnt direct — je hoeft op geen enkele knop te drukken.",
    faq_3_q: "Waarvoor wordt hexadecimaal gebruikt bij programmeren?",
    faq_3_a: "Hexadecimaal wordt gebruikt voor geheugenadressen, kleurcodes (#RGB), bestandsrechten in Unix (bijv. chmod 0x755), netwerk-MAC-adressen en ruwe byte-waarden in debug-tools en hex-editors.",
    faq_4_q: "Zijn er limieten aan de getallen die ik kan converteren?",
    faq_4_a: "Ja. Deze tool ondersteunt veilige gehele getallen tot 2⁵³ - 1 (ongeveer 9 biljard in decimaal). Voor de meeste praktische toepassingen in programmeren en onderwijs wordt deze limiet nooit bereikt.",
    f_1: "Converteer direct tussen bases 2 tot 20",
    f_2: "Ondersteunt binair, octaal, decimaal, hexadecimaal en vigesimaal",
    f_3: "Geen serveraanroepen — draait volledig in de browser",
    f_4: "Wiskundig exacte conversies voor alle ondersteunde bases"
  }
}
</i18n>
