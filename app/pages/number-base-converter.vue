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
  to: '2'
})

const baseOptions = computed(() =>
  bases.map(b => ({ label: `(Base ${b.value}) ${t(b.key)}`, value: b.value }))
)

const output = computed(() => {
  if (!state.number.trim()) return null
  const parsed = parseInt(state.number, Number(state.from))
  if (isNaN(parsed)) return t('err')
  return parsed.toString(Number(state.to))
})

const useCases = computed(() => [t('uc_1'), t('uc_2'), t('uc_3'), t('uc_4')])
const techNotes = computed(() => [t('t_1'), t('t_2'), t('t_3'), t('t_4')])

defineI18nRoute({
  paths: {
    en: '/number-base-converter',
    pt: '/conversor-de-bases-numericas',
    es: '/convertidor-de-bases-numericas',
    fr: '/convertisseur-de-bases-numeriques',
    it: '/convertitore-di-basi-numeriche',
    id: '/konverter-basis-angka'
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
      { label: t('see1'), to: 'less-to-css-converter' },
      { label: t('see2'), to: 'xml-to-json-converter' },
      { label: t('see3'), to: 'json-to-xml-converter' },
      { label: t('see4'), to: 'storage-unit-converter' }
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

    <template #info>
      <div class="space-y-8">
        <p>{{ t('d1') }}</p>

        <!-- How It Works -->
        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:play-circle-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_to_use_title') }}
          </h2>
          <p class="mb-4">{{ t('how_desc') }}</p>
          <div class="grid sm:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="flex flex-col gap-2 bg-base-200/40 p-4 rounded-xl border border-primary/20">
              <span class="text-3xl font-black text-primary/30 leading-none">{{ i }}</span>
              <span class="font-bold text-base-content">{{ t(`step_${i}_title`) }}</span>
              <span class="text-sm text-base-content/70">{{ t(`step_${i}_desc`) }}</span>
            </div>
          </div>
        </section>

        <!-- Applications -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Icon name="heroicons:briefcase" class="text-primary" />
            {{ t('apps_title') }}
          </h2>
          <div class="bg-base-200/30 rounded-3xl p-8 border border-base-content/20">
            <p class="mb-4">{{ t('uc_intro') }}</p>
            <ul class="grid sm:grid-cols-2 gap-4 list-none p-0 m-0">
              <li v-for="item in useCases" :key="item" class="flex gap-3">
                <Icon name="heroicons:check-circle-20-solid" class="text-success w-5 h-5 mt-0.5 shrink-0" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Technical Notes -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
            <Icon name="heroicons:cpu-chip" class="text-primary" />
            {{ t('tech_title') }}
          </h2>
          <p class="mb-4">{{ t('tech_desc') }}</p>
          <ul class="space-y-3 list-none p-0 m-0">
            <li v-for="item in techNotes" :key="item" class="flex gap-3">
              <Icon name="heroicons:chevron-right" class="text-primary w-5 h-5 mt-0.5 shrink-0" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <!-- FAQ -->
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
    see1: "LESS to CSS Converter",
    see2: "XML to JSON Converter",
    see3: "JSON to XML Converter",
    see4: "Storage Unit Converter",
    d1: "Free online tool to convert numbers between any two bases from 2 to 20. Convert binary to decimal, hexadecimal to octal, or any combination instantly with maximum precision and zero delays.",
    how_to_use_title: "How to use",
    how_desc: "This tool parses the input number in its source base and converts it to the target base using mathematically exact algorithms. The conversion runs entirely in your browser, ensuring privacy and speed.",
    step_1_title: "Enter Number",
    step_1_desc: "Type or paste the number you want to convert in the 'Number' field.",
    step_2_title: "Select Bases",
    step_2_desc: "Choose the source base (From) and the target base (To) from the dropdown menus.",
    step_3_title: "Copy Result",
    step_3_desc: "The converted number will appear instantly in the result area for you to copy.",
    apps_title: "Common Applications",
    uc_intro: "Number base conversion is a fundamental skill in computer science and engineering. Common real-world uses include:",
    uc_1: "Debug binary and hexadecimal representations in embedded systems and low-level programming",
    uc_2: "Practice numeral system conversions for computer science and digital electronics coursework",
    uc_3: "Convert memory addresses between octal, decimal and hexadecimal in systems and assembly programming",
    uc_4: "Explore historical numeral systems such as vigesimal (base 20, used by the Maya) for academic research",
    tech_title: "Technical Notes and Supported Bases",
    tech_desc: "Key technical details about the bases supported by this converter:",
    t_1: "Binary (base 2): uses only 0 and 1 — the foundation of all digital computing, hardware logic, and bitwise operations",
    t_2: "Octal (base 8) and Hexadecimal (base 16): compact representations widely used in memory addressing, Unix file permissions, and color codes",
    t_3: "Decimal (base 10): the standard human-readable system; all other bases are derived from or converted through decimal internally",
    t_4: "Vigesimal (base 20): historically used by the Mayan civilization; also supported alongside bases 2–19 for academic and historical use",
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
    see1: "Conversor de LESS para CSS",
    see2: "Conversor de XML para JSON",
    see3: "Conversor de JSON para XML",
    see4: "Conversor de Unidades de Armazenamento",
    d1: "Ferramenta online gratuita para converter números entre qualquer base de 2 a 20. Converta binário para decimal, hexadecimal para octal ou qualquer combinação instantaneamente, com máxima precisão e sem atrasos.",
    how_to_use_title: "Como usar",
    how_desc: "Esta ferramenta interpreta o número na base de origem e o converte para a base alvo usando algoritmos matematicamente exatos. O processo ocorre inteiramente no seu navegador, garantindo privacidade e rapidez.",
    step_1_title: "Digite o Número",
    step_1_desc: "Digite ou cole o número que deseja converter no campo 'Número'.",
    step_2_title: "Selecione as Bases",
    step_2_desc: "Escolha a base de origem (De) e a base de destino (Para) nos menus suspensos.",
    step_3_title: "Copie o Resultado",
    step_3_desc: "O número convertido aparecerá instantaneamente na área de resultado para você copiar.",
    apps_title: "Aplicações Comuns",
    uc_intro: "A conversão de bases numéricas é uma habilidade fundamental em ciência da computação e engenharia. Usos comuns no mundo real incluem:",
    uc_1: "Depurar representações binárias e hexadecimais em sistemas embarcados e programação de baixo nível",
    uc_2: "Praticar conversões entre sistemas numéricos para disciplinas de ciência da computação e eletrônica digital",
    uc_3: "Converter endereços de memória entre octal, decimal e hexadecimal em sistemas e programação assembly",
    uc_4: "Explorar sistemas numéricos históricos como o vigesimal (base 20, usado pelos Maias) em pesquisa acadêmica",
    tech_title: "Notas Técnicas e Bases Suportadas",
    tech_desc: "Detalhes técnicos importantes sobre as bases suportadas por este conversor:",
    t_1: "Binário (base 2): usa apenas 0 e 1 — a base de toda computação digital, lógica de hardware e operações bitwise",
    t_2: "Octal (base 8) e Hexadecimal (base 16): representações compactas amplamente usadas em endereçamento de memória, permissões Unix e códigos de cores",
    t_3: "Decimal (base 10): o sistema padrão de leitura humana; todas as outras bases são convertidas internamente através do decimal",
    t_4: "Vigesimal (base 20): usado historicamente pela civilização Maia; suportado junto com as bases 2–19 para uso acadêmico e histórico",
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
    quaternary: "Cuartenario",
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
    see1: "Convertidor de LESS a CSS",
    see2: "Convertidor de XML a JSON",
    see3: "Convertidor de JSON a XML",
    see4: "Convertidor de Unidades de Almacenamiento",
    d1: "Herramienta online gratuita para convertir números entre cualquier base del 2 al 20. Convierte binario a decimal, hexadecimal a octal o cualquier combinación al instante, con máxima precisión y sin retrasos.",
    how_to_use_title: "Cómo usar",
    how_desc: "Esta herramienta interpreta el número en la base de origen y lo convierte a la base destino utilizando algoritmos matemáticamente exactos. El proceso se ejecuta completamente en su navegador, garantizando privacidad y rapidez.",
    step_1_title: "Ingrese el Número",
    step_1_desc: "Escriba o pegue el número que desea convertir en el campo 'Número'.",
    step_2_title: "Seleccione las Bases",
    step_2_desc: "Elija la base de origen (De) y la base de destino (A) en los menús desplegables.",
    step_3_title: "Copie el Resultado",
    step_3_desc: "El número convertido aparecerá instantáneamente en el área de resultado para que lo copies.",
    apps_title: "Aplicaciones Comunes",
    uc_intro: "La conversión de bases numéricas es una habilidad fundamental en ciencias de la computación e ingeniería. Usos comunes en el mundo real incluyen:",
    uc_1: "Depurar representaciones binarias y hexadecimales en sistemas embebidos y programación de bajo nivel",
    uc_2: "Practicar conversiones entre sistemas numéricos para cursos de ciencias de la computación y electrónica digital",
    uc_3: "Convertir direcciones de memoria entre octal, decimal y hexadecimal en programación de sistemas y ensamblador",
    uc_4: "Explorar sistemas numéricos históricos como el vigesimal (base 20, usado por los Mayas) en investigación académica",
    tech_title: "Notas Técnicas y Bases Soportadas",
    tech_desc: "Detalles técnicos importantes sobre las bases soportadas por este conversor:",
    t_1: "Binario (base 2): usa solo 0 y 1 — la base de toda la computación digital, lógica de hardware y operaciones bitwise",
    t_2: "Octal (base 8) y Hexadecimal (base 16): representaciones compactas ampliamente usadas en direccionamiento de memoria, permisos Unix y códigos de color",
    t_3: "Decimal (base 10): el sistema estándar de lectura humana; todas las demás bases se convierten internamente a través del decimal",
    t_4: "Vigesimal (base 20): usado históricamente por la civilización Maya; soportado junto con las bases 2–19 para uso académico e histórico",
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
    see1: "Convertisseur de LESS vers CSS",
    see2: "Convertisseur de XML vers JSON",
    see3: "Convertisseur de JSON vers XML",
    see4: "Convertisseur d'Unités de Stockage",
    d1: "Outil en ligne gratuit pour convertir des nombres entre deux bases quelconques de 2 à 20. Convertissez binaire en décimal, hexadécimal en octal ou toute combinaison instantanément, avec une précision maximale et sans délai.",
    how_to_use_title: "Comment utiliser",
    how_desc: "Cet outil interprète le nombre dans la base source et le convertit vers la base cible en utilisant des algorithmes mathématiquement exacts. Le processus s'exécute entièrement dans votre navigateur, garantissant confidentialité et rapidité.",
    step_1_title: "Saisir le Nombre",
    step_1_desc: "Saisissez ou collez le nombre que vous souhaitez convertir dans le champ 'Nombre'.",
    step_2_title: "Sélectionner les Bases",
    step_2_desc: "Choisissez la base source (De) et la base cible (À) dans les menus déroulants.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "Le nombre converti apparaîtra instantanément dans la zone de résultat pour que vous puissiez le copier.",
    apps_title: "Applications Courantes",
    uc_intro: "La conversion de bases numériques est une compétence fondamentale en informatique et en ingénierie. Les utilisations courantes dans le monde réel incluent :",
    uc_1: "Déboguer les représentations binaires et hexadécimales dans les systèmes embarqués et la programmation bas niveau",
    uc_2: "Pratiquer les conversions entre systèmes numériques pour les cours d'informatique et d'électronique numérique",
    uc_3: "Convertir des adresses mémoire entre octal, décimal et hexadécimal en programmation système et assembleur",
    uc_4: "Explorer les systèmes numériques historiques comme le vigésimal (base 20, utilisé par les Mayas) pour la recherche académique",
    tech_title: "Notes Techniques et Bases Supportées",
    tech_desc: "Détails techniques importants sur les bases supportées par ce convertisseur :",
    t_1: "Binaire (base 2) : utilise uniquement 0 et 1 — la base de toute l'informatique numérique, de la logique matérielle et des opérations bitwise",
    t_2: "Octal (base 8) et Hexadécimal (base 16) : représentations compactes largement utilisées dans l'adressage mémoire, les permissions Unix et les codes couleur",
    t_3: "Décimal (base 10) : le système standard lisible par l'humain ; toutes les autres bases sont converties en interne via le décimal",
    t_4: "Vigésimal (base 20) : utilisé historiquement par la civilisation Maya ; supporté avec les bases 2–19 pour un usage académique et historique",
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
    see1: "Convertitore da LESS a CSS",
    see2: "Convertitore da XML a JSON",
    see3: "Convertitore da JSON a XML",
    see4: "Convertitore di Unità di Archiviazione",
    d1: "Strumento online gratuito per convertire numeri tra due basi qualsiasi da 2 a 20. Converti binario in decimale, esadecimale in ottale o qualsiasi combinazione all'istante, con la massima precisione e senza ritardi.",
    how_to_use_title: "Come usare",
    how_desc: "Questo strumento interpreta il numero nella base di origine e lo converte nella base di destinazione utilizzando algoritmi matematicamente esatti. Il processo avviene interamente nel tuo browser, garantendo privacy e velocità.",
    step_1_title: "Inserisci il Numero",
    step_1_desc: "Digita o incolla il numero che desideri convertire nel campo 'Numero'.",
    step_2_title: "Seleziona le Basi",
    step_2_desc: "Scegli la base di origine (Da) e la base di destinazione (A) dai menu a discesa.",
    step_3_title: "Copia il Risultato",
    step_3_desc: "Il numero convertito apparirà istantaneamente nell'area dei risultati per essere copiato.",
    apps_title: "Applicazioni Comuni",
    uc_intro: "La conversione di basi numeriche è una competenza fondamentale in informatica e ingegneria. Usi comuni nel mondo reale includono:",
    uc_1: "Eseguire il debug di rappresentazioni binarie ed esadecimali in sistemi embedded e programmazione a basso livello",
    uc_2: "Praticare le conversioni tra sistemi numerici per corsi di informatica ed elettronica digitale",
    uc_3: "Convertire indirizzi di memoria tra ottale, decimale ed esadecimale in programmazione di sistema e assembly",
    uc_4: "Esplorare sistemi numerici storici come il vigesimale (base 20, usato dai Maya) per ricerca accademica",
    tech_title: "Note Tecniche e Basi Supportate",
    tech_desc: "Dettagli tecnici importanti sulle basi supportate da questo convertitore:",
    t_1: "Binario (base 2): usa solo 0 e 1 — la base di tutta l'informatica digitale, la logica hardware e le operazioni bitwise",
    t_2: "Ottale (base 8) ed Esadecimale (base 16): rappresentazioni compatte ampiamente usate nell'indirizzamento di memoria, permessi Unix e codici colore",
    t_3: "Decimale (base 10): il sistema standard leggibile dall'uomo; tutte le altre basi vengono convertite internamente tramite il decimale",
    t_4: "Vigesimale (base 20): usato storicamente dalla civiltà Maya; supportato insieme alle basi 2–19 per uso accademico e storico",
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
    see1: "Konverter LESS ke CSS",
    see2: "Konverter XML ke JSON",
    see3: "Konverter JSON ke XML",
    see4: "Konverter Unit Penyimpanan",
    d1: "Alat online gratis untuk mengonversi angka antara dua basis apa pun dari 2 hingga 20. Konversi biner ke desimal, heksadesimal ke oktal, atau kombinasi apa pun secara instan dengan presisi maksimum tanpa hambatan.",
    how_to_use_title: "Cara menggunakan",
    how_desc: "Alat ini mengurai angka input dalam basis sumber dan mengonversinya ke basis target menggunakan algoritma yang tepat secara matematis. Proses ini berjalan sepenuhnya di browser Anda, menjamin privasi dan kecepatan.",
    step_1_title: "Masukkan Angka",
    step_1_desc: "Ketik atau tempel angka yang ingin Anda konversi di kolom 'Angka'.",
    step_2_title: "Pilih Basis",
    step_2_desc: "Pilih basis sumber (Dari) dan basis target (Ke) dari menu tarik-turun.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Angka yang dikonversi akan muncul secara instan di area hasil untuk Anda salin.",
    apps_title: "Aplikasi Umum",
    uc_intro: "Konversi basis angka adalah keterampilan mendasar dalam ilmu komputer dan teknik. Penggunaan dunia nyata yang umum meliputi:",
    uc_1: "Debugging representasi biner dan heksadesimal dalam sistem tertanam dan pemrograman tingkat rendah",
    uc_2: "Melatih konversi sistem angka untuk mata kuliah ilmu komputer dan elektronika digital",
    uc_3: "Mengonversi alamat memori antara oktal, desimal, dan heksadesimal dalam pemrograman sistem dan assembly",
    uc_4: "Menjelajahi sistem angka historis seperti vigesimal (basis 20, digunakan oleh suku Maya) untuk penelitian akademik",
    tech_title: "Catatan Teknis dan Basis yang Didukung",
    tech_desc: "Detail teknis utama tentang basis yang didukung oleh konverter ini:",
    t_1: "Biner (basis 2): hanya menggunakan 0 dan 1 — dasar dari semua komputasi digital dan logika perangkat keras",
    t_2: "Oktal (basis 8) dan Heksadesimal (basis 16): representasi ringkas yang banyak digunakan dalam pengalamatan memori dan kode warna",
    t_3: "Desimal (basis 10): sistem standar yang mudah dibaca manusia; semua basis lainnya dikonversi melalui desimal secara internal",
    t_4: "Vigesimal (basis 20): digunakan secara historis oleh peradaban Maya; didukung bersama basis 2–19 untuk penggunaan akademik",
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
  }
}
</i18n>
