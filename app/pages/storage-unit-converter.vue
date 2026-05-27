<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/convert@4/dist/convert.prod.js', {
  trigger: 'client'
})

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
  ]
})

useHead({
  title: t('m_title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

const units: [string, string][] = [
  ['B', 'Byte'], ['b', 'Bit'], ['KB', 'Kilobyte'], ['Kb', 'Kilobit'],
  ['KiB', 'Kibibyte'], ['Kib', 'Kibibit'], ['MB', 'Megabyte'], ['Mb', 'Megabit'],
  ['MiB', 'Mebibyte'], ['Mib', 'Mebibit'], ['GB', 'Gigabyte'], ['Gb', 'Gigabit'],
  ['GiB', 'Gibibyte'], ['Gib', 'Gibibit'], ['TB', 'Terabyte'], ['Tb', 'Terabit'],
  ['TiB', 'Tebibyte'], ['Tib', 'Tebibit'], ['PB', 'Petabyte'], ['Pb', 'Petabit'],
  ['PiB', 'Pebibyte'], ['Pib', 'Pebibit'], ['cB', 'Centibyte'], ['cb', 'Centibit'],
  ['daB', 'Decabyte'], ['dab', 'Decabit'], ['dB', 'Decibyte'], ['db', 'Decibit'],
  ['fB', 'Femtobyte'], ['fb', 'Femtobit'], ['hB', 'Hectobyte'], ['hb', 'Hectobit'],
  ['mB', 'Millibyte'], ['mb', 'Millibit'], ['nB', 'Nanobyte'], ['nb', 'Nanobit'],
  ['pB', 'Picobyte'], ['pb', 'Picobit'], ['μB', 'Microbyte'], ['μb', 'Microbit']
]

const state = reactive({
  value: '',
  from: 'B',
  to: 'MB'
})

const unitOptions = computed(() =>
  units.map(([abbr, key]) => ({ label: `${t(key)} [${abbr}]`, value: abbr }))
)

const output = computed(() => {
  if (!state.value || isNaN(Number(state.value))) return null
  try {
    const convert = (window as any).convert
    if (!convert) return null
    const result = convert.convert(Number(state.value), state.from).to(state.to)
    // Round to 12 decimal places to avoid floating point noise, strip trailing zeros
    return Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(12)).toString()
  } catch {
    return null
  }
})

const useCases = computed(() => [t('uc_1'), t('uc_2'), t('uc_3'), t('uc_4'), t('uc_5')])
const techNotes = computed(() => [t('t_1'), t('t_2'), t('t_3'), t('t_4')])

defineI18nRoute({
  paths: {
    en: '/storage-unit-converter',
    pt: '/conversor-de-unidades-de-armazenamento',
    es: '/convertidor-de-unidades-de-almacenamiento',
    fr: '/convertisseur-de-unites-de-stockage',
    it: '/convertitore-di-unita-di-archiviazione',
    id: '/konverter-unit-penyimpanan',
    de: '/speichereinheiten-umrechner',
    nl: '/opslageenheden-converter',
    ru: '/konverter-edinic-hraneniya'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Units_of_information`"
    :wiki-label="t('wiki_label')"
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
          <label for="storage-value" class="label">
            <span class="label-text font-bold text-base-content text-xs uppercase tracking-wider">{{ t('value') }}</span>
          </label>
          <input
            id="storage-value"
            v-model="state.value"
            type="text"
            class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl"
            autofocus
          />
        </div>

        <ToolSelect
          v-model="state.from"
          :label="t('from')"
          :options="unitOptions"
        />

        <ToolSelect
          v-model="state.to"
          :label="t('to')"
          :options="unitOptions"
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

        <!-- All Supported Units -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
            <Icon name="heroicons:squares-2x2" class="text-primary" />
            {{ t('units_title') }}
          </h2>
          <div class="bg-base-200/30 rounded-3xl p-6 border border-base-content/20">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
              <div v-for="[abbr, key] in units" :key="abbr" class="flex items-center gap-2">
                <Icon name="heroicons:check-circle-20-solid" class="text-success w-4 h-4 shrink-0" />
                <span class="font-mono text-xs text-primary font-bold">{{ abbr }}</span>
                <span class="text-base-content/60 text-sm">{{ t(key) }}</span>
              </div>
            </div>
          </div>
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
    m_title: "Byte Converter — MB to GB, KB to MB, GB to TB and 37 More Units | Free",
    title: "Byte Converter",
    meta: "Free online byte converter. Convert MB to GB, KB to MB, GB to TB and 37 more storage units instantly with full support for both SI decimal (KB, MB, GB) and IEC binary standards (KiB, MiB, GiB).",
    value: "Value",
    from: "From",
    to: "To",
    result: "Result",
    units_title: "All Supported Units",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipedia (Units of Information)",
    Byte: "Byte", Bit: "Bit", Centibyte: "Centibyte", Centibit: "Centibit",
    Decabyte: "Decabyte", Decabit: "Decabit", Decibyte: "Decibyte", Decibit: "Decibit",
    Femtobyte: "Femtobyte", Femtobit: "Femtobit", Gigabyte: "Gigabyte", Gigabit: "Gigabit",
    Gibibyte: "Gibibyte", Gibibit: "Gibibit", Hectobyte: "Hectobyte", Hectobit: "Hectobit",
    Kilobyte: "Kilobyte", Kilobit: "Kilobit", Kibibyte: "Kibibyte", Kibibit: "Kibibit",
    Millibyte: "Millibyte", Millibit: "Millibit", Megabyte: "Megabyte", Megabit: "Megabit",
    Mebibyte: "Mebibyte", Mebibit: "Mebibit", Nanobyte: "Nanobyte", Nanobit: "Nanobit",
    Picobyte: "Picobyte", Picobit: "Picobit", Petabyte: "Petabyte", Petabit: "Petabit",
    Pebibyte: "Pebibyte", Pebibit: "Pebibit", Terabyte: "Terabyte", Terabit: "Terabit",
    Tebibyte: "Tebibyte", Tebibit: "Tebibit", Microbyte: "Microbyte", Microbit: "Microbit",
    d1: "Convert MB to GB, KB to MB, bytes to gigabytes and 37 more unit pairs instantly. Supports both SI decimal units (KB = 1,000 bytes) and IEC binary units (KiB = 1,024 bytes). Ideal for developers, sysadmins, and anyone working with file sizes, RAM, or network bandwidth.",
    how_to_use_title: "How to use",
    how_desc: "This converter handles precise conversions using exact decimal and binary multiplication factors. All conversions normalize through a base byte value before being expressed in the target unit.",
    step_1_title: "Enter Value",
    step_1_desc: "Type the numeric value you want to convert in the 'Value' field.",
    step_2_title: "Select Units",
    step_2_desc: "Choose the original unit (From) and the unit you want to convert to (To) from the dropdowns.",
    step_3_title: "Copy Conversion",
    step_3_desc: "The converted value will be displayed immediately in the result field.",
    apps_title: "Common Applications",
    uc_intro: "Storage unit conversion is essential in many technical and everyday scenarios:",
    uc_1: "Plan storage infrastructure — convert GB to TB for NAS, backup systems and cloud deployments",
    uc_2: "Calculate network bandwidth consumption — convert Mbps to GB/day to estimate data transfer costs",
    uc_3: "Understand hardware specs — compare GiB vs GB to resolve confusion between OS-reported and manufacturer-advertised sizes",
    uc_4: "Debug embedded systems and IoT devices where byte-level precision matters between KB and KiB",
    uc_5: "Compare cloud storage pricing across providers that use different unit standards (SI vs IEC binary)",
    tech_title: "SI vs IEC Binary: Technical Standards",
    tech_desc: "Understanding the two competing standards is critical to avoid errors in storage calculations:",
    t_1: "SI / Decimal units (KB, MB, GB, TB): 1 KB = 1,000 bytes — defined by IEC 80000-13, used by hard drive manufacturers and network providers",
    t_2: "IEC / Binary units (KiB, MiB, GiB, TiB): 1 KiB = 1,024 bytes — defined by IEC 60027-2, used by operating systems for RAM and file system reporting",
    t_3: "The gap grows with scale: 1 TB (SI) ≈ 0.909 TiB (binary) — a 1 TB drive shows ~931 GiB in Windows or macOS",
    t_4: "40 units supported: from Bit and Byte through Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte and all IEC binary equivalents",
    faq_title: "Questions & Answers",
    faq_1_q: "What is the difference between MB and MiB?",
    faq_1_a: "MB (Megabyte) is an SI unit: 1 MB = 1,000,000 bytes. MiB (Mebibyte) is an IEC binary unit: 1 MiB = 1,048,576 bytes. The difference (~4.9%) is small at low scales but becomes significant at GB and TB ranges.",
    faq_2_q: "Why does my 1 TB hard drive show less space on my computer?",
    faq_2_a: "Hard drive manufacturers use SI units: 1 TB = 1,000,000,000,000 bytes. Operating systems (Windows, macOS, Linux) display storage in binary units: 1 TiB = 1,099,511,627,776 bytes. So 1 TB ≈ 931 GiB — the drive is not missing storage, it's a unit standard difference.",
    faq_3_q: "How do I convert Mbps to MB/s?",
    faq_3_a: "Divide by 8: 1 Megabit = 0.125 Megabytes (since 1 byte = 8 bits). So a 100 Mbps connection can transfer about 12.5 MB per second at peak speed.",
    faq_4_q: "Which standard should I use: KB or KiB?",
    faq_4_a: "For file sizes and disk storage: KB (SI, 1,000 bytes). For RAM specifications and programming byte buffers: KiB (IEC binary, 1,024 bytes) is technically correct. Modern standards (IEC 60027-2) reserve 'K' for 1,000 and 'Ki' for 1,024 to eliminate ambiguity.",
    f_1: "Convert between 40 storage units instantly",
    f_2: "Supports both SI (KB, MB, GB) and IEC binary (KiB, MiB, GiB) standards",
    f_3: "Precise mathematical conversions for all units",
    f_4: "No server calls — runs entirely in the browser"
  },
  pt: {
    m_title: "Conversor de Bytes — MB para GB, KB para MB, GB para TB e Mais | Grátis",
    title: "Conversor de Bytes",
    meta: "Conversor de bytes online e gratuito. Converta MB para GB, KB para MB, GB para TB e mais 37 unidades instantaneamente com suporte aos padrões SI decimal (KB, MB, GB) e IEC binário (KiB, MiB, GiB).",
    value: "Valor",
    from: "De",
    to: "Para",
    result: "Resultado",
    units_title: "Todas as Unidades Suportadas",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipédia (Unidades de Informação)",
    Byte: "Byte", Bit: "Bit", Centibyte: "Centibyte", Centibit: "Centibit",
    Decabyte: "Decabyte", Decabit: "Decabit", Decibyte: "Decibyte", Decibit: "Decibit",
    Femtobyte: "Femtobyte", Femtobit: "Femtobit", Gigabyte: "Gigabyte", Gigabit: "Gigabit",
    Gibibyte: "Gibibyte", Gibibit: "Gibibit", Hectobyte: "Hectobyte", Hectobit: "Hectobit",
    Kilobyte: "Kilobyte", Kilobit: "Kilobit", Kibibyte: "Kibibyte", Kibibit: "Kibibit",
    Millibyte: "Millibyte", Millibit: "Millibit", Megabyte: "Megabyte", Megabit: "Megabit",
    Mebibyte: "Mebibyte", Mebibit: "Mebibit", Nanobyte: "Nanobyte", Nanobit: "Nanobit",
    Picobyte: "Picobyte", Picobit: "Picobit", Petabyte: "Petabyte", Petabit: "Petabit",
    Pebibyte: "Pebibyte", Pebibit: "Pebibit", Terabyte: "Terabyte", Terabit: "Terabit",
    Tebibyte: "Tebibyte", Tebibit: "Tebibit", Microbyte: "Microbyte", Microbit: "Microbit",
    d1: "Converta MB para GB, KB para MB, bytes para gigabytes e mais 37 pares de unidades instantaneamente. Suporta unidades decimais SI (KB = 1.000 bytes) e unidades binárias IEC (KiB = 1.024 bytes). Ideal para desenvolvedores, administradores de sistemas e qualquer pessoa que trabalhe com tamanhos de arquivo, RAM ou largura de banda.",
    how_to_use_title: "Como usar",
    how_desc: "Este conversor realiza conversões precisas usando fatores de multiplicação decimais e binários exatos. Todas as conversões são normalizadas por um valor base em bytes antes de serem expressas na unidade de destino.",
    step_1_title: "Digite o Valor",
    step_1_desc: "Digite o valor numérico que deseja converter no campo 'Valor'.",
    step_2_title: "Selecione as Unidades",
    step_2_desc: "Escolha a unidade original (De) e a unidade para a qual deseja converter (Para) nos menus suspensos.",
    step_3_title: "Copiar a Conversão",
    step_3_desc: "O valor convertido será exibido imediatamente no campo de resultado.",
    apps_title: "Aplicações Comuns",
    uc_intro: "A conversão de unidades de armazenamento é essencial em muitos cenários técnicos e cotidianos:",
    uc_1: "Planejar infraestrutura de armazenamento — converter GB para TB em NAS, sistemas de backup e nuvem",
    uc_2: "Calcular consumo de largura de banda — converter Mbps para GB/dia para estimar custos de transferência",
    uc_3: "Entender especificações de hardware — comparar GiB vs GB para resolver a confusão entre tamanho reportado pelo SO e pelo fabricante",
    uc_4: "Depurar sistemas embarcados e dispositivos IoT onde a precisão em bytes importa entre KB e KiB",
    uc_5: "Comparar preços de armazenamento em nuvem entre provedores que usam padrões de unidades diferentes (SI vs IEC binário)",
    tech_title: "SI vs IEC Binário: Padrões Técnicos",
    tech_desc: "Entender os dois padrões em competição é fundamental para evitar erros em cálculos de armazenamento:",
    t_1: "Unidades SI / Decimais (KB, MB, GB, TB): 1 KB = 1.000 bytes — definido pela IEC 80000-13, usado por fabricantes de HD e provedores de rede",
    t_2: "Unidades IEC / Binárias (KiB, MiB, GiB, TiB): 1 KiB = 1.024 bytes — definido pela IEC 60027-2, usado por sistemas operacionais para RAM e relatórios do sistema de arquivos",
    t_3: "A diferença cresce com a escala: 1 TB (SI) ≈ 0,909 TiB (binário) — um HD de 1 TB aparece como ~931 GiB no Windows ou macOS",
    t_4: "40 unidades suportadas: de Bit e Byte a Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte e todos os equivalentes binários IEC",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Qual é a diferença entre MB e MiB?",
    faq_1_a: "MB (Megabyte) é uma unidade SI: 1 MB = 1.000.000 bytes. MiB (Mebibyte) é uma unidade IEC binária: 1 MiB = 1.048.576 bytes. A diferença (~4,9%) é pequena em escalas baixas, mas torna-se significativa em faixas de GB e TB.",
    faq_2_q: "Por que meu HD de 1 TB mostra menos espaço no computador?",
    faq_2_a: "Fabricantes de HD usam unidades SI: 1 TB = 1.000.000.000.000 bytes. Sistemas operacionais (Windows, macOS, Linux) exibem armazenamento em unidades binárias: 1 TiB = 1.099.511.627.776 bytes. Portanto, 1 TB ≈ 931 GiB — o HD não está com espaço faltando, é uma diferença de padrão de unidade.",
    faq_3_q: "Como converter Mbps para MB/s?",
    faq_3_a: "Divida por 8: 1 Megabit = 0,125 Megabytes (pois 1 byte = 8 bits). Então uma conexão de 100 Mbps pode transferir cerca de 12,5 MB por segundo na velocidade máxima.",
    faq_4_q: "Qual padrão devo usar: KB ou KiB?",
    faq_4_a: "Para tamanhos de arquivo e armazenamento em disco: KB (SI, 1.000 bytes). Para especificações de RAM e buffers em programação: KiB (IEC binário, 1.024 bytes) é tecnicamente correto. Os padrões modernos (IEC 60027-2) reservam 'K' para 1.000 e 'Ki' para 1.024 para eliminar ambiguidade.",
    f_1: "Converter entre 40 unidades de armazenamento instantaneamente",
    f_2: "Suporta SI (KB, MB, GB) e IEC binário (KiB, MiB, GiB)",
    f_3: "Conversões matemáticas precisas para todas as unidades",
    f_4: "Sem chamadas ao servidor — roda inteiramente no navegador"
  },
  es: {
    m_title: "Convertidor de Bytes — MB a GB, KB a MB, GB a TB y Más | Gratis",
    title: "Convertidor de Bytes",
    meta: "Convertidor de bytes online y gratuito. Convierte MB a GB, KB a MB, GB a TB y 37 unidades más al instante con soporte para los estándares SI decimal (KB, MB, GB) e IEC binario (KiB, MiB, GiB).",
    value: "Valor",
    from: "De",
    to: "A",
    result: "Resultado",
    units_title: "Todas las Unidades Admitidas",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipedia (Unidades de información)",
    Byte: "Byte", Bit: "Bit", Centibyte: "Centibyte", Centibit: "Centibit",
    Decabyte: "Decabyte", Decabit: "Decabit", Decibyte: "Decibyte", Decibit: "Decibit",
    Femtobyte: "Femtobyte", Femtobit: "Femtobit", Gigabyte: "Gigabyte", Gigabit: "Gigabit",
    Gibibyte: "Gibibyte", Gibibit: "Gibibit", Hectobyte: "Hectobyte", Hectobit: "Hectobit",
    Kilobyte: "Kilobyte", Kilobit: "Kilobit", Kibibyte: "Kibibyte", Kibibit: "Kibibit",
    Millibyte: "Millibyte", Millibit: "Millibit", Megabyte: "Megabyte", Megabit: "Megabit",
    Mebibyte: "Mebibyte", Mebibit: "Mebibit", Nanobyte: "Nanobyte", Nanobit: "Nanobit",
    Picobyte: "Picobyte", Picobit: "Picobit", Petabyte: "Petabyte", Petabit: "Petabit",
    Pebibyte: "Pebibyte", Pebibit: "Pebibit", Terabyte: "Terabyte", Terabit: "Terabit",
    Tebibyte: "Tebibyte", Tebibit: "Tebibit", Microbyte: "Microbyte", Microbit: "Microbit",
    d1: "Convierte MB a GB, KB a MB, bytes a gigabytes y 37 pares de unidades más al instante. Admite unidades decimales SI (KB = 1.000 bytes) y unidades binarias IEC (KiB = 1.024 bytes). Ideal para desarrolladores, administradores de sistemas y cualquiera que trabaje con tamaños de archivos, RAM o ancho de banda.",
    how_to_use_title: "Cómo usar",
    how_desc: "Este convertidor realiza conversiones precisas usando factores de multiplicación decimales y binarios exactos. Todas las conversiones se normalizan mediante un valor base en bytes antes de expresarse en la unidad de destino.",
    step_1_title: "Ingrese el Valor",
    step_1_desc: "Escriba el valor numérico que desea convertir en el campo 'Valor'.",
    step_2_title: "Seleccione las Unidades",
    step_2_desc: "Elija la unidad original (De) y la unidad a la que desea convertir (A) en los menús desplegables.",
    step_3_title: "Copiar la Conversión",
    step_3_desc: "El valor convertido se mostrará inmediatamente en el campo de resultado.",
    apps_title: "Aplicaciones Comunes",
    uc_intro: "La conversión de unidades de almacenamiento es esencial en muchos escenarios técnicos y cotidianos:",
    uc_1: "Planificar infraestructura de almacenamiento — convertir GB a TB para NAS, sistemas de respaldo y nube",
    uc_2: "Calcular consumo de ancho de banda — convertir Mbps a GB/día para estimar costos de transferencia",
    uc_3: "Entender especificaciones de hardware — comparar GiB vs GB para resolver la confusión entre el tamaño reportado por el SO y el fabricante",
    uc_4: "Depurar sistemas embebidos y dispositivos IoT donde la precisión en bytes importa entre KB y KiB",
    uc_5: "Comparar precios de almacenamiento en nube entre proveedores que usan diferentes estándares (SI vs IEC binario)",
    tech_title: "SI vs IEC Binario: Estándares Técnicos",
    tech_desc: "Entender los dos estándares en competencia es fundamental para evitar errores en cálculos de almacenamiento:",
    t_1: "Unidades SI / Decimales (KB, MB, GB, TB): 1 KB = 1.000 bytes — definido por IEC 80000-13, usado por fabricantes de disco duro y proveedores de red",
    t_2: "Unidades IEC / Binarias (KiB, MiB, GiB, TiB): 1 KiB = 1.024 bytes — definido por IEC 60027-2, usado por sistemas operativos para RAM e informes del sistema de archivos",
    t_3: "La diferencia crece con la escala: 1 TB (SI) ≈ 0,909 TiB (binario) — un disco de 1 TB aparece como ~931 GiB en Windows o macOS",
    t_4: "40 unidades soportadas: de Bit y Byte a Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte y todos los equivalentes binarios IEC",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cuál es la diferencia entre MB y MiB?",
    faq_1_a: "MB (Megabyte) es una unidad SI: 1 MB = 1.000.000 bytes. MiB (Mebibyte) es una unidad IEC binaria: 1 MiB = 1.048.576 bytes. La diferencia (~4,9%) es pequeña a baja escala pero se vuelve significativa en rangos de GB y TB.",
    faq_2_q: "¿Por qué mi disco duro de 1 TB muestra menos espacio en el ordenador?",
    faq_2_a: "Los fabricantes de discos usan unidades SI: 1 TB = 1.000.000.000.000 bytes. Los sistemas operativos (Windows, macOS, Linux) muestran el almacenamiento en unidades binarias: 1 TiB = 1.099.511.627.776 bytes. Por tanto, 1 TB ≈ 931 GiB — el disco no tiene espacio faltante, es una diferencia de estándar de unidades.",
    faq_3_q: "¿Cómo convierto Mbps a MB/s?",
    faq_3_a: "Divide entre 8: 1 Megabit = 0,125 Megabytes (ya que 1 byte = 8 bits). Así, una conexión de 100 Mbps puede transferir unos 12,5 MB por segundo a velocidad máxima.",
    faq_4_q: "¿Qué estándar debo usar: KB o KiB?",
    faq_4_a: "Para tamaños de archivos y almacenamiento en disco: KB (SI, 1.000 bytes). Para especificaciones de RAM y buffers en programación: KiB (IEC binario, 1.024 bytes) es técnicamente correcto. Los estándares modernos (IEC 60027-2) reservan 'K' para 1.000 y 'Ki' para 1.024 para eliminar ambigüedad.",
    f_1: "Convertir entre 40 unidades de almacenamiento al instante",
    f_2: "Admite SI (KB, MB, GB) e IEC binario (KiB, MiB, GiB)",
    f_3: "Conversiones matemáticas precisas para todas las unidades",
    f_4: "Sin llamadas al servidor — se ejecuta completamente en el navegador"
  },
  fr: {
    m_title: "Convertisseur d'Unités de Stockage — KB, MB, GB, TB, GiB | Gratuit",
    title: "Convertisseur d'Unités de Stockage",
    meta: "Convertisseur d'unités de stockage en ligne gratuit. Convertissez entre octets, kilooctets, mégaoctets, gigaoctets, téraoctets et 35 autres unités instantanément. Prend en charge les normes SI et IEC binaire.",
    value: "Valeur",
    from: "De",
    to: "À",
    result: "Résultat",
    units_title: "Toutes les Unités Prises en Charge",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipédia (Unités d'information)",
    Byte: "Octet", Bit: "Bit", Centibyte: "Centioctet", Centibit: "Centibit",
    Decabyte: "Décaoctet", Decabit: "Décabit", Decibyte: "Décioctet", Decibit: "Décibit",
    Femtobyte: "Femtooctet", Femtobit: "Femtobit", Gigabyte: "Gigaoctet", Gigabit: "Gigabit",
    Gibibyte: "Gibioctet", Gibibit: "Gibibit", Hectobyte: "Hectooctet", Hectobit: "Hectobit",
    Kilobyte: "Kilooctet", Kilobit: "Kilobit", Kibibyte: "Kibioctet", Kibibit: "Kibibit",
    Millibyte: "Millioctet", Millibit: "Millibit", Megabyte: "Mégaoctet", Megabit: "Mégabit",
    Mebibyte: "Mébioctet", Mebibit: "Mébibit", Nanobyte: "Nanooctet", Nanobit: "Nanobit",
    Picobyte: "Picooctet", Picobit: "Picobit", Petabyte: "Pétaoctet", Petabit: "Pétabit",
    Pebibyte: "Pébioctet", Pebibit: "Pébibit", Terabyte: "Téraoctet", Terabit: "Térabit",
    Tebibyte: "Tébioctet", Tebibit: "Tébibit", Microbyte: "Microoctet", Microbit: "Microbit",
    d1: "Convertissez entre 40 unités de stockage — des bits et octets aux pétaoctets et pébioctets. Prend en charge les unités décimales SI (KB = 1 000 octets) et les unités binaires IEC (KiB = 1 024 octets). Idéal pour les développeurs, administrateurs système et toute personne travaillant avec des tailles de fichiers, de la RAM ou de la bande passante.",
    how_to_use_title: "Comment utiliser",
    how_desc: "Ce convertisseur effectue des conversions précises en utilisant des facteurs de multiplication décimaux et binaires exacts. Toutes les conversions sont normalisées à partir d'une valeur de base en octets avant d'être exprimées dans l'unité cible.",
    step_1_title: "Saisir la Valeur",
    step_1_desc: "Saisissez la valeur numérique que vous souhaitez convertir dans le champ 'Valeur'.",
    step_2_title: "Sélectionner les Unités",
    step_2_desc: "Choisissez l'unité d'origine (De) et l'unité vers laquelle vous souhaitez convertir (À) dans les menus déroulants.",
    step_3_title: "Copier la Conversion",
    step_3_desc: "La valeur convertie s'affichera immédiatement dans le champ de résultat.",
    apps_title: "Applications Courantes",
    uc_intro: "La conversion d'unités de stockage est essentielle dans de nombreux scénarios techniques et quotidiens :",
    uc_1: "Planifier une infrastructure de stockage — convertir des GB en TB pour les NAS, systèmes de sauvegarde et services cloud",
    uc_2: "Calculer la consommation de bande passante — convertir des Mbps en GB/jour pour estimer les coûts de transfert",
    uc_3: "Comprendre les spécifications matérielles — comparer GiB et GB pour résoudre la confusion entre les tailles rapportées par l'OS et le fabricant",
    uc_4: "Déboguer des systèmes embarqués et appareils IoT où la précision à l'octet est importante entre KB et KiB",
    uc_5: "Comparer les prix de stockage cloud entre fournisseurs utilisant des normes d'unités différentes (SI vs IEC binaire)",
    tech_title: "SI vs IEC Binaire : Normes Techniques",
    tech_desc: "Comprendre les deux normes concurrentes est essentiel pour éviter les erreurs dans les calculs de stockage :",
    t_1: "Unités SI / Décimales (KB, MB, GB, TB) : 1 KB = 1 000 octets — défini par IEC 80000-13, utilisé par les fabricants de disques durs et fournisseurs réseau",
    t_2: "Unités IEC / Binaires (KiB, MiB, GiB, TiB) : 1 KiB = 1 024 octets — défini par IEC 60027-2, utilisé par les systèmes d'exploitation pour la RAM et les indications du système de fichiers",
    t_3: "L'écart augmente avec l'échelle : 1 TB (SI) ≈ 0,909 TiB (binaire) — un disque de 1 TB affiche ~931 GiB sous Windows ou macOS",
    t_4: "40 unités prises en charge : du bit et de l'octet au kilooctet, mégaoctet, gigaoctet, téraoctet, pétaoctet et tous les équivalents binaires IEC",
    faq_title: "Questions et Réponses",
    faq_1_q: "Quelle est la différence entre MB et MiB ?",
    faq_1_a: "MB (mégaoctet) est une unité SI : 1 MB = 1 000 000 octets. MiB (mébioctet) est une unité IEC binaire : 1 MiB = 1 048 576 octets. La différence (~4,9 %) est faible à petite échelle mais devient significative aux niveaux GB et TB.",
    faq_2_q: "Pourquoi mon disque dur de 1 To affiche moins d'espace sur mon ordinateur ?",
    faq_2_a: "Les fabricants de disques durs utilisent les unités SI : 1 TB = 1 000 000 000 000 octets. Les systèmes d'exploitation (Windows, macOS, Linux) affichent le stockage en unités binaires : 1 TiB = 1 099 511 627 776 octets. Donc 1 TB ≈ 931 GiB — le disque ne manque pas d'espace, c'est une différence de norme d'unités.",
    faq_3_q: "Comment convertir des Mbps en MB/s ?",
    faq_3_a: "Divisez par 8 : 1 mégabit = 0,125 mégaoctet (car 1 octet = 8 bits). Ainsi, une connexion de 100 Mbps peut transférer environ 12,5 MB par seconde à vitesse maximale.",
    faq_4_q: "Quelle norme utiliser : KB ou KiB ?",
    faq_4_a: "Pour les tailles de fichiers et le stockage sur disque : KB (SI, 1 000 octets). Pour les spécifications de RAM et les tampons en programmation : KiB (IEC binaire, 1 024 octets) est techniquement correct. Les normes modernes (IEC 60027-2) réservent 'K' pour 1 000 et 'Ki' pour 1 024 afin d'éliminer l'ambiguïté.",
    f_1: "Convertir entre 40 unités de stockage instantanément",
    f_2: "Prend en charge SI (KB, MB, GB) et IEC binaire (KiB, MiB, GiB)",
    f_3: "Conversions mathématiques précises pour toutes les unités",
    f_4: "Sans appels serveur — s'exécute entièrement dans le navigateur"
  },
  it: {
    m_title: "Convertitore di Unità di Archiviazione — KB, MB, GB, TB, GiB | Gratis",
    title: "Convertitore di Unità di Archiviazione",
    meta: "Convertitore di unità di archiviazione online gratuito. Converti tra byte, kilobyte, megabyte, gigabyte, terabyte e altre 35 unità all'istante. Supporta gli standard SI e IEC binari.",
    value: "Valore",
    from: "Da",
    to: "A",
    result: "Risultato",
    units_title: "Tutte le Unità Supportate",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipedia (Unità di informazione)",
    Byte: "Byte", Bit: "Bit", Centibyte: "Centibyte", Centibit: "Centibit",
    Decabyte: "Decabyte", Decabit: "Decabit", Decibyte: "Decibyte", Decibit: "Decibit",
    Femtobyte: "Femtobyte", Femtobit: "Femtobit", Gigabyte: "Gigabyte", Gigabit: "Gigabit",
    Gibibyte: "Gibibyte", Gibibit: "Gibibit", Hectobyte: "Hectobyte", Hectobit: "Hectobit",
    Kilobyte: "Kilobyte", Kilobit: "Kilobit", Kibibyte: "Kibibyte", Kibibit: "Kibibit",
    Millibyte: "Millibyte", Millibit: "Millibit", Megabyte: "Megabyte", Megabit: "Megabit",
    Mebibyte: "Mebibyte", Mebibit: "Mebibit", Nanobyte: "Nanobyte", Nanobit: "Nanobit",
    Picobyte: "Picobyte", Picobit: "Picobit", Petabyte: "Petabyte", Petabit: "Petabit",
    Pebibyte: "Pebibyte", Pebibit: "Pebibit", Terabyte: "Terabyte", Terabit: "Terabit",
    Tebibyte: "Tebibyte", Tebibit: "Tebibit", Microbyte: "Microbyte", Microbit: "Microbit",
    d1: "Converti tra 40 unità di archiviazione — da bit e byte a petabyte e pebibit. Supporta unità decimali SI (KB = 1.000 byte) e unità binarie IEC (KiB = 1.024 byte). Ideale per sviluppatori, amministratori di sistema e chiunque lavori con dimensioni di file, RAM o larghezza di banda.",
    how_to_use_title: "Come usare",
    how_desc: "Questo convertitore gestisce conversioni precise usando fattori di moltiplicazione decimali e binari esatti. Tutte le conversioni vengono normalizzate tramite un valore base in byte prima di essere espresse nell'unità di destinazione.",
    step_1_title: "Inserisci il Valore",
    step_1_desc: "Digita il valore numerico che desideri convertire nel campo 'Valore'.",
    step_2_title: "Seleziona le Unità",
    step_2_desc: "Scegli l'unità originale (Da) e l'unità in cui desideri convertirla (A) dai menu a discesa.",
    step_3_title: "Copia la conversione",
    step_3_desc: "Il valore convertito verrà visualizzato immediatamente nel campo del risultato.",
    apps_title: "Applicazioni Comuni",
    uc_intro: "La conversione di unità di archiviazione è essenziale in molti scenari tecnici e quotidiani:",
    uc_1: "Pianificare infrastrutture di archiviazione — convertire GB in TB per NAS, sistemi di backup e servizi cloud",
    uc_2: "Calcolare il consumo di larghezza di banda — convertire Mbps in GB/giorno per stimare i costi di trasferimento dati",
    uc_3: "Comprendere le specifiche hardware — confrontare GiB e GB per risolvere la confusione tra dimensioni riportate dall'OS e dal produttore",
    uc_4: "Debug di sistemi embedded e dispositivi IoT dove la precisione al byte è importante tra KB e KiB",
    uc_5: "Confrontare i prezzi di archiviazione cloud tra provider che usano standard di unità diversi (SI vs IEC binario)",
    tech_title: "SI vs IEC Binario: Standard Tecnici",
    tech_desc: "Comprendere i due standard in competizione è fondamentale per evitare errori nei calcoli di archiviazione:",
    t_1: "Unità SI / Decimali (KB, MB, GB, TB): 1 KB = 1.000 byte — definito da IEC 80000-13, usato dai produttori di dischi rigidi e provider di rete",
    t_2: "Unità IEC / Binarie (KiB, MiB, GiB, TiB): 1 KiB = 1.024 byte — definito da IEC 60027-2, usato dai sistemi operativi per RAM e informazioni del file system",
    t_3: "La differenza cresce con la scala: 1 TB (SI) ≈ 0,909 TiB (binario) — un disco da 1 TB viene visualizzato come ~931 GiB in Windows o macOS",
    t_4: "40 unità supportate: da Bit e Byte a Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte e tutti gli equivalenti binari IEC",
    faq_title: "Domande e Risposte",
    faq_1_q: "Qual è la differenza tra MB e MiB?",
    faq_1_a: "MB (Megabyte) è un'unità SI: 1 MB = 1.000.000 byte. MiB (Mebibyte) è un'unità IEC binaria: 1 MiB = 1.048.576 byte. La differenza (~4,9%) è piccola a bassa scala ma diventa significativa negli intervalli GB e TB.",
    faq_2_q: "Perché il mio disco da 1 TB mostra meno spazio sul computer?",
    faq_2_a: "I produttori di dischi rigidi usano unità SI: 1 TB = 1.000.000.000.000 byte. I sistemi operativi (Windows, macOS, Linux) mostrano lo spazio in unità binarie: 1 TiB = 1.099.511.627.776 byte. Quindi 1 TB ≈ 931 GiB — al disco non manca spazio, è una differenza di standard di unità.",
    faq_3_q: "Come si convertono i Mbps in MB/s?",
    faq_3_a: "Dividi per 8: 1 Megabit = 0,125 Megabyte (poiché 1 byte = 8 bit). Quindi una connessione da 100 Mbps può trasferire circa 12,5 MB al secondo alla velocità massima.",
    faq_4_q: "Quale standard usare: KB o KiB?",
    faq_4_a: "Per dimensioni di file e archiviazione su disco: KB (SI, 1.000 byte). Per specifiche RAM e buffer di programmazione: KiB (IEC binario, 1.024 byte) è tecnicamente corretto. Gli standard moderni (IEC 60027-2) riservano 'K' per 1.000 e 'Ki' per 1.024 per eliminare l'ambiguità.",
    f_1: "Convertire tra 40 unità di archiviazione all'istante",
    f_2: "Supporta SI (KB, MB, GB) e IEC binario (KiB, MiB, GiB)",
    f_3: "Conversioni matematiche precise per tutte le unità",
    f_4: "Nessuna chiamata al server — viene eseguito interamente nel browser"
  },
  id: {
    m_title: "Konverter Unit Penyimpanan — KB, MB, GB, TB, GiB | Gratis Online",
    title: "Konverter Unit Penyimpanan",
    meta: "Konverter unit penyimpanan online gratis. Konversi antara byte, kilobyte, megabyte, gigabyte, terabyte, dan 35 unit lainnya secara instan. Mendukung standar SI dan IEC biner.",
    value: "Nilai",
    from: "Dari",
    to: "Ke",
    result: "Hasil",
    units_title: "Semua Unit yang Didukung",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipedia (Unit informasi)",
    Byte: "Byte", Bit: "Bit", Centibyte: "Centibyte", Centibit: "Centibit",
    Decabyte: "Decabyte", Decabit: "Decabit", Decibyte: "Decibyte", Decibit: "Decibit",
    Femtobyte: "Femtobyte", Femtobit: "Femtobit", Gigabyte: "Gigabyte", Gigabit: "Gigabit",
    Gibibyte: "Gibibyte", Gibibit: "Gibibit", Hectobyte: "Hectobyte", Hectobit: "Hectobit",
    Kilobyte: "Kilobyte", Kilobit: "Kilobit", Kibibyte: "Kibibyte", Kibibit: "Kibibit",
    Millibyte: "Millibyte", Millibit: "Millibit", Megabyte: "Megabyte", Megabit: "Megabit",
    Mebibyte: "Mebibyte", Mebibit: "Mebibit", Nanobyte: "Nanobyte", Nanobit: "Nanobit",
    Picobyte: "Picobyte", Picobit: "Picobit", Petabyte: "Petabyte", Petabit: "Petabit",
    Pebibyte: "Pebibyte", Pebibit: "Pebibit", Terabyte: "Terabyte", Terabit: "Terabit",
    Tebibyte: "Tebibyte", Tebibit: "Tebibit", Microbyte: "Microbyte", Microbit: "Microbit",
    d1: "Konversi antara 40 unit penyimpanan — dari bit dan byte hingga petabyte dan pebibit. Mendukung unit desimal SI (KB = 1.000 byte) dan unit biner IEC (KiB = 1.024 byte). Ideal untuk pengembang, administrator sistem, dan siapa saja yang bekerja dengan ukuran file, RAM, atau bandwidth jaringan.",
    how_to_use_title: "Cara menggunakan",
    how_desc: "Konverter ini menangani konversi presisi menggunakan faktor perkalian desimal dan biner yang tepat. Semua konversi dinormalisasi melalui nilai dasar dalam byte sebelum dinyatakan dalam unit tujuan.",
    step_1_title: "Masukkan Nilai",
    step_1_desc: "Ketik nilai numerik yang ingin Anda konversi di kolom 'Nilai'.",
    step_2_title: "Pilih Unit",
    step_2_desc: "Pilih unit asli (Dari) dan unit tujuan konversi (Ke) dari menu tarik-turun.",
    step_3_title: "Salin Konversi",
    step_3_desc: "Nilai yang dikonversi akan segera ditampilkan di kolom hasil.",
    apps_title: "Aplikasi Umum",
    uc_intro: "Konversi unit penyimpanan sangat penting dalam banyak skenario teknis dan sehari-hari:",
    uc_1: "Merencanakan infrastruktur penyimpanan — mengonversi GB ke TB untuk NAS, sistem cadangan, dan cloud",
    uc_2: "Menghitung konsumsi bandwidth jaringan — mengonversi Mbps ke GB/hari untuk memperkirakan biaya transfer data",
    uc_3: "Memahami spesifikasi hardware — membandingkan GiB vs GB untuk menyelesaikan kebingungan antara ukuran yang dilaporkan OS dan pabrikan",
    uc_4: "Debug sistem embedded dan perangkat IoT di mana presisi byte penting antara KB dan KiB",
    uc_5: "Membandingkan harga penyimpanan cloud antar penyedia yang menggunakan standar unit berbeda (SI vs IEC biner)",
    tech_title: "SI vs IEC Biner: Standar Teknis",
    tech_desc: "Memahami dua standar yang bersaing sangat penting untuk menghindari kesalahan dalam perhitungan penyimpanan:",
    t_1: "Unit SI / Desimal (KB, MB, GB, TB): 1 KB = 1.000 byte — didefinisikan oleh IEC 80000-13, digunakan oleh produsen hard disk dan penyedia jaringan",
    t_2: "Unit IEC / Biner (KiB, MiB, GiB, TiB): 1 KiB = 1.024 byte — didefinisikan oleh IEC 60027-2, digunakan oleh sistem operasi untuk RAM dan laporan sistem file",
    t_3: "Selisihnya bertumbuh dengan skala: 1 TB (SI) ≈ 0,909 TiB (biner) — drive 1 TB menampilkan ~931 GiB di Windows atau macOS",
    t_4: "40 unit didukung: dari Bit dan Byte hingga Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte dan semua ekuivalen biner IEC",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apa perbedaan antara MB dan MiB?",
    faq_1_a: "MB (Megabyte) adalah unit SI: 1 MB = 1.000.000 byte. MiB (Mebibyte) adalah unit biner IEC: 1 MiB = 1.048.576 byte. Perbedaannya (~4,9%) kecil pada skala rendah tetapi menjadi signifikan pada kisaran GB dan TB.",
    faq_2_q: "Mengapa hard disk 1 TB saya menampilkan lebih sedikit ruang di komputer?",
    faq_2_a: "Produsen hard disk menggunakan unit SI: 1 TB = 1.000.000.000.000 byte. Sistem operasi (Windows, macOS, Linux) menampilkan penyimpanan dalam unit biner: 1 TiB = 1.099.511.627.776 byte. Jadi 1 TB ≈ 931 GiB — drive tidak kehilangan ruang, itu adalah perbedaan standar unit.",
    faq_3_q: "Bagaimana cara mengonversi Mbps ke MB/s?",
    faq_3_a: "Bagi dengan 8: 1 Megabit = 0,125 Megabyte (karena 1 byte = 8 bit). Jadi koneksi 100 Mbps dapat mentransfer sekitar 12,5 MB per detik pada kecepatan puncak.",
    faq_4_q: "Standar mana yang harus digunakan: KB atau KiB?",
    faq_4_a: "Untuk ukuran file dan penyimpanan disk: KB (SI, 1.000 byte). Untuk spesifikasi RAM dan buffer pemrograman: KiB (IEC biner, 1.024 byte) secara teknis benar. Standar modern (IEC 60027-2) menetapkan 'K' untuk 1.000 dan 'Ki' untuk 1.024 untuk menghilangkan ambiguitas.",
    f_1: "Konversi antara 40 unit penyimpanan secara instan",
    f_2: "Mendukung SI (KB, MB, GB) dan IEC biner (KiB, MiB, GiB)",
    f_3: "Konversi matematis yang presisi untuk semua unit",
    f_4: "Tanpa panggilan server — berjalan sepenuhnya di browser"
  },
  de: {
    m_title: "Speichereinheiten-Umrechner — KB, MB, GB, TB, GiB, TiB | Kostenlos",
    title: "Speichereinheiten-Umrechner",
    meta: "Kostenloser Online-Umrechner für Speichereinheiten. Konvertiere sofort zwischen Byte, Kilobyte, Megabyte, Gigabyte, Terabyte und 35 weiteren Einheiten. Unterstützt SI- und IEC-Binärstandards.",
    value: "Wert",
    from: "Von",
    to: "Nach",
    result: "Ergebnis",
    units_title: "Alle unterstützten Einheiten",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipedia (Informationseinheiten)",
    Byte: "Byte", Bit: "Bit", Centibyte: "Zentibyte", Centibit: "Zentibit",
    Decabyte: "Dekabyte", Decabit: "Dekabit", Decibyte: "Dezibyte", Decibit: "Dezibit",
    Femtobyte: "Femtobyte", Femtobit: "Femtobit", Gigabyte: "Gigabyte", Gigabit: "Gigabit",
    Gibibyte: "Gibibyte", Gibibit: "Gibibit", Hectobyte: "Hektobyte", Hectobit: "Hektobit",
    Kilobyte: "Kilobyte", Kilobit: "Kilobit", Kibibyte: "Kibibyte", Kibibit: "Kibibit",
    Millibyte: "Millibyte", Millibit: "Millibit", Megabyte: "Megabyte", Megabit: "Megabit",
    Mebibyte: "Mebibyte", Mebibit: "Mebibit", Nanobyte: "Nanobyte", Nanobit: "Nanobit",
    Picobyte: "Pikobyte", Picobit: "Pikobit", Petabyte: "Petabyte", Petabit: "Petabit",
    Pebibyte: "Pebibyte", Pebibit: "Pebibit", Terabyte: "Terabyte", Terabit: "Terabit",
    Tebibyte: "Tebibyte", Tebibit: "Tebibit", Microbyte: "Mikrobyte", Microbit: "Mikrobit",
    d1: "Konvertieren Sie zwischen 40 Speichereinheiten — von Bit und Byte bis zu Petabyte und Pebibit. Unterstützt sowohl dezimale SI-Einheiten (KB = 1.000 Byte) als auch binäre IEC-Einheiten (KiB = 1.024 Byte). Ideal für Entwickler, Systemadministratoren und alle, die mit Dateigrößen, RAM oder Netzwerkbandbreite arbeiten.",
    how_to_use_title: "So verwendest du das Tool",
    how_desc: "Dieser Umrechner führt präzise Umrechnungen mit exakten dezimalen und binären Multiplikationsfaktoren durch. Alle Umrechnungen werden zuerst auf einen Basiswert in Byte normalisiert und danach in der Zieleinheit ausgegeben.",
    step_1_title: "Wert eingeben",
    step_1_desc: "Gib den numerischen Wert, den du umrechnen möchtest, in das Feld 'Wert' ein.",
    step_2_title: "Einheiten auswählen",
    step_2_desc: "Wähle die ursprüngliche Einheit (Von) und die gewünschte Zieleinheit (Nach) in den Dropdowns aus.",
    step_3_title: "Umrechnung ansehen",
    step_3_desc: "Der umgerechnete Wert wird sofort im Ergebnisfeld angezeigt.",
    apps_title: "Häufige Anwendungen",
    uc_intro: "Die Umrechnung von Speichereinheiten ist in vielen technischen und alltäglichen Situationen wichtig:",
    uc_1: "Speicherinfrastruktur planen — GB in TB für NAS, Backup-Systeme und Cloud-Deployments umrechnen",
    uc_2: "Netzwerkbandbreite berechnen — Mbps in GB/Tag umrechnen, um Datenübertragungskosten abzuschätzen",
    uc_3: "Hardware-Spezifikationen verstehen — GiB und GB vergleichen, um Unterschiede zwischen Betriebssystemanzeige und Herstellerangabe zu klären",
    uc_4: "Embedded-Systeme und IoT-Geräte debuggen, bei denen Byte-genaue Präzision zwischen KB und KiB wichtig ist",
    uc_5: "Cloud-Speicherpreise zwischen Anbietern vergleichen, die unterschiedliche Einheitenstandards verwenden (SI vs IEC binär)",
    tech_title: "SI vs. IEC-Binärstandard: Technische Standards",
    tech_desc: "Das Verständnis der beiden konkurrierenden Standards ist entscheidend, um Fehler bei Speicherberechnungen zu vermeiden:",
    t_1: "SI- / Dezimaleinheiten (KB, MB, GB, TB): 1 KB = 1.000 Byte — definiert durch IEC 80000-13, genutzt von Festplattenherstellern und Netzwerkanbietern",
    t_2: "IEC- / Binäreinheiten (KiB, MiB, GiB, TiB): 1 KiB = 1.024 Byte — definiert durch IEC 60027-2, genutzt von Betriebssystemen für RAM und Dateisystemangaben",
    t_3: "Der Unterschied wächst mit der Größenordnung: 1 TB (SI) ≈ 0,909 TiB (binär) — ein 1-TB-Laufwerk erscheint in Windows oder macOS als etwa 931 GiB",
    t_4: "40 Einheiten unterstützt: von Bit und Byte über Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte bis zu allen IEC-Binäräquivalenten",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Was ist der Unterschied zwischen MB und MiB?",
    faq_1_a: "MB (Megabyte) ist eine SI-Einheit: 1 MB = 1.000.000 Byte. MiB (Mebibyte) ist eine binäre IEC-Einheit: 1 MiB = 1.048.576 Byte. Der Unterschied von etwa 4,9% ist bei kleinen Größen gering, wird aber im GB- und TB-Bereich deutlich.",
    faq_2_q: "Warum zeigt meine 1-TB-Festplatte auf dem Computer weniger Speicherplatz an?",
    faq_2_a: "Festplattenhersteller verwenden SI-Einheiten: 1 TB = 1.000.000.000.000 Byte. Betriebssysteme wie Windows, macOS und Linux zeigen Speicher oft in binären Einheiten an: 1 TiB = 1.099.511.627.776 Byte. Deshalb entspricht 1 TB etwa 931 GiB. Es fehlt kein Speicher, es ist ein Unterschied im Einheitenstandard.",
    faq_3_q: "Wie rechne ich Mbps in MB/s um?",
    faq_3_a: "Teile durch 8: 1 Megabit = 0,125 Megabyte, da 1 Byte = 8 Bit. Eine 100-Mbps-Verbindung kann also maximal etwa 12,5 MB pro Sekunde übertragen.",
    faq_4_q: "Welchen Standard sollte ich verwenden: KB oder KiB?",
    faq_4_a: "Für Dateigrößen und Festplattenspeicher: KB (SI, 1.000 Byte). Für RAM-Spezifikationen und Programmierpuffer ist KiB (IEC binär, 1.024 Byte) technisch korrekt. Moderne Standards reservieren 'K' für 1.000 und 'Ki' für 1.024, um Mehrdeutigkeit zu vermeiden.",
    f_1: "Sofort zwischen 40 Speichereinheiten umrechnen",
    f_2: "Unterstützt SI (KB, MB, GB) und IEC binär (KiB, MiB, GiB)",
    f_3: "Präzise mathematische Umrechnungen für alle Einheiten",
    f_4: "Keine Serveraufrufe — läuft vollständig im Browser"
  },
  nl: {
    m_title: "Opslageenheden Converter — KB, MB, GB, TB, GiB, TiB | Gratis Online",
    title: "Opslageenheden Converter",
    meta: "Gratis online opslageenheden converter. Converteer direct tussen bytes, kilobytes, megabytes, gigabytes, terabytes en 35 andere eenheden. Ondersteunt zowel SI (decimale) als IEC (binaire) standaarden.",
    value: "Waarde",
    from: "Van",
    to: "Naar",
    result: "Resultaat",
    units_title: "Alle ondersteunde eenheden",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Wikipedia (Informatie-eenheden)",
    Byte: "Byte", Bit: "Bit", Centibyte: "Centibyte", Centibit: "Centibit",
    Decabyte: "Decabyte", Decabit: "Decabit", Decibyte: "Decibyte", Decibit: "Decibit",
    Femtobyte: "Femtobyte", Femtobit: "Femtobit", Gigabyte: "Gigabyte", Gigabit: "Gigabit",
    Gibibyte: "Gibibyte", Gibibit: "Gibibit", Hectobyte: "Hectobyte", Hectobit: "Hectobit",
    Kilobyte: "Kilobyte", Kilobit: "Kilobit", Kibibyte: "Kibibyte", Kibibit: "Kibibit",
    Millibyte: "Millibyte", Millibit: "Millibit", Megabyte: "Megabyte", Megabit: "Megabit",
    Mebibyte: "Mebibyte", Mebibit: "Mebibit", Nanobyte: "Nanobyte", Nanobit: "Nanobit",
    Picobyte: "Picobyte", Picobit: "Picobit", Petabyte: "Petabyte", Petabit: "Petabit",
    Pebibyte: "Pebibyte", Pebibit: "Pebibit", Terabyte: "Terabyte", Terabit: "Terabit",
    Tebibyte: "Tebibyte", Tebibit: "Tebibit", Microbyte: "Microbyte", Microbit: "Microbit",
    d1: "Converteer tussen 40 opslageenheden — van bits en bytes tot petabytes en pebibits. Ondersteunt zowel SI decimale eenheden (KB = 1.000 bytes) als IEC binaire eenheden (KiB = 1.024 bytes). Ideaal voor ontwikkelaars, systeembeheerders en iedereen die werkt met bestandsgroottes, RAM of netwerkbandbreedte.",
    how_to_use_title: "Hoe te gebruiken",
    how_desc: "Deze converter verwerkt nauwkeurige conversies met exacte decimale en binaire vermenigvuldigingsfactoren. Alle conversies worden genormaliseerd via een basisbyte-waarde voordat ze in de doeleenheid worden uitgedrukt.",
    step_1_title: "Waarde invoeren",
    step_1_desc: "Typ de numerieke waarde die je wilt converteren in het veld 'Waarde'.",
    step_2_title: "Selecteer eenheden",
    step_2_desc: "Kies de oorspronkelijke eenheid (Van) en de eenheid waarnaar je wilt converteren (Naar) uit de keuzelijsten.",
    step_3_title: "Kopieer conversie",
    step_3_desc: "De geconverteerde waarde wordt onmiddellijk weergegeven in het resultaatveld.",
    apps_title: "Veelvoorkomende toepassingen",
    uc_intro: "Conversie van opslageenheden is essentieel in veel technische en alledaagse scenario's:",
    uc_1: "Opslaginfrastructuur plannen — converteer GB naar TB voor NAS, back-upsystemen en cloud-implementaties",
    uc_2: "Bereken het verbruik van netwerkbandbreedte — converteer Mbps naar GB/dag om de kosten voor gegevensoverdracht te schatten",
    uc_3: "Hardware-specificaties begrijpen — vergelijk GiB vs GB om verwarring op te lossen tussen door het OS gerapporteerde en door de fabrikant geadverteerde groottes",
    uc_4: "Debug embedded systemen en IoT-apparaten waar precisie op byte-niveau belangrijk is tussen KB en KiB",
    uc_5: "Vergelijk prijzen voor cloudopslag van verschillende providers die verschillende eenheidstandaarden gebruiken (SI vs IEC binair)",
    tech_title: "SI vs IEC Binair: Technische standaarden",
    tech_desc: "Het begrijpen van de twee concurrerende standaarden is cruciaal om fouten in opslagberekeningen te voorkomen:",
    t_1: "SI / Decimale eenheden (KB, MB, GB, TB): 1 KB = 1.000 bytes — gedefinieerd door IEC 80000-13, gebruikt door fabrikanten van harde schijven en netwerkproviders",
    t_2: "IEC / Binaire eenheden (KiB, MiB, GiB, TiB): 1 KiB = 1.024 bytes — gedefinieerd door IEC 60027-2, gebruikt door besturingssystemen voor RAM en bestandssysteemrapportage",
    t_3: "Het gat groeit met de schaal: 1 TB (SI) ≈ 0,909 TiB (binair) — een schijf van 1 TB toont ~931 GiB in Windows of macOS",
    t_4: "40 eenheden ondersteund: van Bit en Byte tot Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte en alle IEC binaire equivalenten",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is het verschil tussen MB en MiB?",
    faq_1_a: "MB (Megabyte) is een SI-eenheid: 1 MB = 1.000.000 bytes. MiB (Mebibyte) is een IEC binaire eenheid: 1 MiB = 1.048.576 bytes. Het verschil (~4,9%) is klein op lage schaal, maar wordt aanzienlijk bij GB- en TB-bereiken.",
    faq_2_q: "Waarom toont mijn harde schijf van 1 TB minder ruimte op mijn computer?",
    faq_2_a: "Fabrikanten van harde schijven gebruiken SI-eenheden: 1 TB = 1.000.000.000.000 bytes. Besturingssystemen (Windows, macOS, Linux) geven opslag weer in binaire eenheden: 1 TiB = 1.099.511.627.776 bytes. Dus 1 TB ≈ 931 GiB — de schijf mist geen opslagruimte, het is een verschil in eenheidstandaard.",
    faq_3_q: "Hoe converteer ik Mbps naar MB/s?",
    faq_3_a: "Deel door 8: 1 Megabit = 0,125 Megabytes (aangezien 1 byte = 8 bits). Dus een verbinding van 100 Mbps kan ongeveer 12,5 MB per seconde overdragen op topsnelheid.",
    faq_4_q: "Welke standaard moet ik gebruiken: KB of KiB?",
    faq_4_a: "Voor bestandsgroottes en schijfopslag: KB (SI, 1.000 bytes). Voor RAM-specificaties en programmeer-bytebuffers: KiB (IEC binair, 1.024 bytes) is technisch correct. Moderne standaarden (IEC 60027-2) reserveren 'K' voor 1.000 en 'Ki' voor 1.024 om ambiguïteit weg te nemen.",
    f_1: "Converteer direct tussen 40 opslageenheden",
    f_2: "Ondersteunt zowel SI (KB, MB, GB) als IEC binaire (KiB, MiB, GiB) standaarden",
    f_3: "Nauwkeurige wiskundige conversies voor alle eenheden",
    f_4: "Geen serveraanroepen — draait volledig in de browser"
  },
  ru: {
    m_title: "Конвертер байт — перевод МБ в ГБ, КБ в МБ, ГБ в ТБ и еще 37 единиц | Бесплатно",
    title: "Конвертер байт",
    meta: "Бесплатный онлайн-конвертер байт. Мгновенно конвертируйте МБ в ГБ, КБ в МБ, ГБ в ТБ и еще 37 единиц хранения данных с полной поддержкой как десятичного стандарта СИ (КБ, МБ, ГБ), так и двоичного стандарта IEC (КиБ, МиБ, ГиБ).",
    value: "Значение",
    from: "Из",
    to: "В",
    result: "Результат",
    units_title: "Все поддерживаемые единицы",
    see1: "XML → JSON",
    see2: "JSON → XML",
    see3: "CSV → JSON",
    see4: "JSON → CSV",
    wiki_label: "Википедия (Единицы информации)",
    Byte: "Байт", Bit: "Бит", Centibyte: "Сантибайт", Centibit: "Сантибит",
    Decabyte: "Декабайт", Decabit: "Декабит", Decibyte: "Децибайт", Decibit: "Децибит",
    Femtobyte: "Фемтобайт", Femtobit: "Фемтобит", Gigabyte: "Гигабайт", Gigabit: "Гигабит",
    Gibibyte: "Гибибайт", Gibibit: "Гибибит", Hectobyte: "Гектобайт", Hectobit: "Гектобит",
    Kilobyte: "Килобайт", Kilobit: "Килобит", Kibibyte: "Кибибайт", Kibibit: "Кибибит",
    Millibyte: "Миллибайт", Millibit: "Миллибит", Megabyte: "Мегабайт", Megabit: "Мегабит",
    Mebibyte: "Мебибайт", Mebibit: "Мебибит", Nanobyte: "Нанобайт", Nanobit: "Нанобит",
    Picobyte: "Пикобайт", Picobit: "Пикобит", Petabyte: "Петабайт", Petabit: "Петабит",
    Pebibyte: "Пебибайт", Pebibit: "Пебибит", Terabyte: "Терабайт", Terabit: "Терабит",
    Tebibyte: "Тебибайт", Tebibit: "Тебибит", Microbyte: "Микробайт", Microbit: "Микробит",
    d1: "Мгновенно конвертируйте МБ в ГБ, КБ в МБ, байты в гигабайты и еще 37 пар единиц. Поддерживает как десятичные единицы СИ (1 КБ = 1000 байт), так и двоичные единицы IEC (1 КиБ = 1024 байта). Идеально подходит для разработчиков, системных администраторов и всех, кто работает с размерами файлов, оперативной памятью (RAM) или пропускной способностью сети.",
    how_to_use_title: "Инструкция",
    how_desc: "Этот конвертер выполняет точные вычисления, используя строгие десятичные и двоичные коэффициенты умножения. Все преобразования сначала нормализуются к базовому значению в байтах, после чего выражаются в целевой единице измерения.",
    step_1_title: "Введите значение",
    step_1_desc: "Введите числовое значение, которое хотите преобразовать, в поле «Значение».",
    step_2_title: "Выберите единицы",
    step_2_desc: "Выберите исходную единицу (Из) и единицу, в которую хотите выполнить перевод (В), из раскрывающихся списков.",
    step_3_title: "Скопируйте результат",
    step_3_desc: "Преобразованное значение сразу же отобразится в поле результата.",
    apps_title: "Области применения",
    uc_intro: "Конвертация единиц измерения информации необходима во многих технических и повседневных сценариях:",
    uc_1: "Планирование инфраструктуры хранения — перевод ГБ в ТБ для NAS-систем, бэкапов и облачных серверов",
    uc_2: "Расчет сетевого трафика — перевод Мбит/с в ГБ/день для оценки затрат на передачу данных",
    uc_3: "Понимание характеристик оборудования — сравнение ГиБ и ГБ для устранения путаницы между объемом, заявляемым ОС, и тем, что указан производителем",
    uc_4: "Отладка встроенных систем и IoT-устройств, где важна точность на уровне байт между КБ и КиБ",
    uc_5: "Сравнение тарифов на облачное хранилище у провайдеров, использующих разные стандарты единиц (СИ или IEC)",
    tech_title: "СИ против IEC: технические стандарты",
    tech_desc: "Понимание различий между двумя стандартами крайне важно для избежания ошибок в расчетах систем хранения:",
    t_1: "Десятичные единицы СИ (КБ, МБ, ГБ, ТБ): 1 КБ = 1000 байт — определены стандартом IEC 80000-13, используются производителями накопителей и сетевыми провайдерами",
    t_2: "Двоичные единицы IEC (КиБ, МиБ, ГиБ, ТиБ): 1 КиБ = 1024 байта — определены стандартом IEC 60027-2, используются операционными системами для отображения размера файлов и объема RAM",
    t_3: "Разница растет с увеличением масштаба: 1 ТБ (СИ) ≈ 0,909 ТиБ (двоичный) — накопитель емкостью 1 ТБ будет отображаться в Windows или macOS как примерно 931 ГиБ",
    t_4: "Поддерживается 40 единиц: от битов и байтов до килобайтов, мегабайтов, гигабайтов, терабайтов, петабайтов и всех двоичных эквивалентов IEC",
    faq_title: "Вопросы и ответы",
    faq_1_q: "В чем разница между МБ и МиБ?",
    faq_1_a: "МБ (Мегабайт) — это десятичная единица СИ: 1 МБ = 1 000 000 байт. МиБ (Мебибайт) — это двоичная единица IEC: 1 МиБ = 1 048 576 байт. Разница (~4,9%) невелика на малых объемах, но становится весьма заметной на уровне ГБ и ТБ.",
    faq_2_q: "Почему моя жесткий диск на 1 ТБ показывает меньше места на компьютере?",
    faq_2_a: "Производители накопителей используют десятичные единицы СИ: 1 ТБ = 1 000 000 000 000 байт. Операционные системы (Windows, macOS, Linux) рассчитывают объем в двоичных единицах: 1 ТиБ = 1 099 511 627 776 байт. Таким образом, 1 ТБ ≈ 931 ГиБ — накопитель не поврежден и не обманывает вас, это просто разница в стандартах измерения.",
    faq_3_q: "Как перевести Мбит/с в МБ/с?",
    faq_3_a: "Разделите на 8: 1 Мегабит = 0,125 Мегабайта (так как 1 байт = 8 бит). Таким образом, интернет-соединение на скорости 100 Мбит/с может передавать максимум около 12,5 МБ в секунду на пиковой скорости.",
    faq_4_q: "Какой стандарт мне использовать: КБ или КиБ?",
    faq_4_a: "Для размера файлов на диске принято использовать КБ (десятичный СИ, 1000 байт). Для объема оперативной памяти (RAM) и буферов в программировании технически правильным является КиБ (двоичный IEC, 1024 байта). Современные стандарты (IEC 60027-2) закрепляют символ «К» за 1000, а «Ки» за 1024, чтобы устранить двусмысленность.",
    f_1: "Мгновенная конвертация между 40 единицами хранения данных",
    f_2: "Поддержка стандартов СИ (КБ, МБ, ГБ) и IEC (КиБ, МиБ, ГиБ)",
    f_3: "Точные математические расчеты для всех величин",
    f_4: "Без запросов к серверу — работает полностью в браузере"
  }
}
</i18n>
