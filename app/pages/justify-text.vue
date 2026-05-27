<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

interface State {
  text: string
  output: string
  width: number
  padChar: string
  padPreset: string
  breakWords: boolean
  justifyLastLine: boolean
  ads: boolean
}

const state: State = reactive({
  text: '',
  output: '',
  width: 40,
  padChar: ' ',
  padPreset: 'space',
  breakWords: false,
  justifyLastLine: false,
  ads: false
})

const padPresets = [
  { key: 'space', char: ' ' },
  { key: 'dash', char: '-' },
  { key: 'dot', char: '.' },
  { key: 'underscore', char: '_' },
  { key: 'custom', char: '' },
]

watch(() => state.padPreset, (key) => {
  const preset = padPresets.find(p => p.key === key)
  if (preset && key !== 'custom') state.padChar = preset.char
})

function generate() {
  if (!state.text.trim()) {
    state.output = ''
    return
  }

  if (!state.ads) state.ads = true

  const width = Math.max(1, Math.min(state.width, 1000)) // safe bounds
  const pad = state.padChar.length > 0 ? state.padChar.charAt(0) : ' '
  
  const paragraphs = state.text.split(/\n/)
  const justifiedParagraphs = paragraphs.map(p => {
    if (p.trim() === '') return ''

    let words = p.trim().split(/\s+/)
    
    if (state.breakWords) {
      const brokenWords: string[] = []
      for (const word of words) {
        if (word.length > width) {
          let current = word
          while (current.length > width) {
            brokenWords.push(current.substring(0, width))
            current = current.substring(width)
          }
          if (current.length > 0) brokenWords.push(current)
        } else {
          brokenWords.push(word)
        }
      }
      words = brokenWords
    }

    const lines: string[][] = []
    let currentLine: string[] = []
    let currentLength = 0

    for (const word of words) {
      if (currentLine.length === 0) {
        currentLine.push(word)
        currentLength = word.length
      } else if (currentLength + 1 + word.length <= width) {
        currentLine.push(word)
        currentLength += 1 + word.length
      } else {
        lines.push(currentLine)
        currentLine = [word]
        currentLength = word.length
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    const justifiedLines = lines.map((line, index) => {
      const isLastLine = index === lines.length - 1
      if (line.length === 1) {
        if ((!isLastLine || state.justifyLastLine) && line[0].length < width) {
          return line[0] + pad.repeat(width - line[0].length)
        }
        return line[0]
      }

      if (isLastLine && !state.justifyLastLine) {
        return line.join(' ')
      }

      const totalSpaces = width - line.reduce((sum, word) => sum + word.length, 0)
      const gaps = line.length - 1
      const spacesPerGap = Math.floor(totalSpaces / gaps)
      const extraSpaces = totalSpaces % gaps

      let justifiedLine = ''
      for (let i = 0; i < line.length - 1; i++) {
        justifiedLine += line[i]
        const spaceLength = spacesPerGap + (i < extraSpaces ? 1 : 0)
        justifiedLine += pad.repeat(spaceLength)
      }
      justifiedLine += line[line.length - 1]

      return justifiedLine
    })

    return justifiedLines.join('\n')
  })

  state.output = justifiedParagraphs.join('\n')
}

watch(() => [state.text, state.width, state.padChar, state.breakWords, state.justifyLastLine], generate, { deep: true })

function copy() {
  if (state.output) navigator.clipboard.writeText(state.output)
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') }
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('pageTitle') },
    { property: 'og:description', content: t('meta') },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('pageTitle') },
    { name: 'twitter:description', content: t('meta') }
  ]
})

defineI18nRoute({
  paths: {
    en: '/justify-text',
    pt: '/justificar-texto',
    es: '/justificar-texto',
    fr: '/justifier-texte',
    it: '/giustifica-testo',
    id: '/ratakan-teks',
    de: '/text-ausrichten',
    nl: '/tekst-uitvullen',
    ru: '/vyrovnyat-tekst'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :info-description="t('d1')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'text-counter' },
      { label: t('see2'), to: 'text-comparator' },
      { label: t('see3'), to: 'invisible-character' },
      { label: t('see4'), to: 'text-generator' }
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls & Input -->
      <div class="space-y-4">
        
        <div class="form-control">
          <label for="input" class="label">
            <span class="label-text font-bold text-base-content/80">{{ t('input_label') }}</span>
          </label>
          <textarea
            id="input"
            v-model="state.text"
            class="textarea textarea-bordered w-full h-48 bg-base-200 focus:bg-base-200 rounded-xl leading-relaxed text-base"
            :placeholder="t('placeholder_input')"
            autofocus
          ></textarea>
        </div>

        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4 space-y-4">
          <div class="flex gap-4 items-start">
            <label class="form-control w-32 shrink-0 flex flex-col">
              <span class="label-text mb-2 font-semibold">{{ t('width') }}</span>
              <input
                id="width"
                type="number"
                v-model="state.width"
                min="1"
                max="1000"
                class="input input-bordered w-full bg-base-100 rounded-xl font-bold"
              />
            </label>

            <label class="form-control flex-1 flex flex-col">
              <span class="label-text mb-2 font-semibold">{{ t('padChar') }}</span>
              <select v-model="state.padPreset" class="select select-bordered bg-base-100">
                <option v-for="preset in padPresets" :key="preset.key" :value="preset.key">
                  {{ t('preset_' + preset.key) }}
                </option>
              </select>
              <input
                v-if="state.padPreset === 'custom'"
                type="text"
                v-model="state.padChar"
                maxlength="1"
                :placeholder="t('padChar_placeholder')"
                @focus="$event.target.select()"
                @click="$event.target.select()"
                class="input input-bordered bg-base-100 w-full font-bold text-center font-mono mt-2 placeholder:text-base-content/30"
              />
            </label>
          </div>
          
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input type="checkbox" v-model="state.breakWords" class="toggle toggle-primary" />
              <span class="label-text font-medium">{{ t('breakWords') }}</span>
            </label>
          </div>
          
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input type="checkbox" v-model="state.justifyLastLine" class="toggle toggle-primary" />
              <span class="label-text font-medium">{{ t('justifyLastLine') }}</span>
            </label>
          </div>
        </section>
      </div>

      <!-- Right Column: Result -->
      <div class="space-y-4 h-full flex flex-col">
        <div class="form-control flex-1">
          <label for="output" class="label flex justify-between">
            <span class="label-text font-bold text-base-content/80">{{ t('output_label') }}</span>
            <button v-if="state.output" @click="copy" class="btn btn-xs btn-ghost text-primary">
              <Icon name="heroicons:document-duplicate" class="w-4 h-4 mr-1" />
              {{ t('copy') }}
            </button>
          </label>
          <textarea
            id="output"
            readonly
            :value="state.output"
            class="textarea textarea-bordered w-full h-full min-h-[16rem] bg-base-200/50 rounded-xl leading-relaxed font-mono whitespace-pre text-sm overflow-x-auto resize-none"
            :placeholder="t('placeholder_output')"
          ></textarea>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4')]"
        />

        <section>
          <h3 class="text-xl font-bold mb-2">{{ t('example_title') }}</h3>
          <p class="text-base-content/70 mb-4">{{ t('example_desc') }}</p>
          <pre class="bg-base-200/50 border border-base-content/10 rounded-2xl p-6 font-mono text-sm whitespace-pre overflow-x-auto leading-relaxed">{{ t('example_content') }}</pre>
        </section>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') },
            { title: t('uc_4_title'), description: t('uc_4_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_it_works_title')"
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
            { question: t('faq_3_q'), answer: t('faq_3_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
pt:
  pageTitle: "Justificador de Texto Online — Alinhamento Perfeito | Grátis"
  title: "Justificador de Texto"
  meta: "Alinhe perfeitamente seus textos com largura personalizada para redes sociais, design editorial e código. Esta ferramenta online te ajuda a justificar textos de forma rápida, fácil e gratuita."
  input_label: "Texto Original"
  placeholder_input: "Cole ou digite seu texto aqui..."
  output_label: "Texto Justificado"
  placeholder_output: "O texto justificado aparecerá aqui instantaneamente..."
  width: "Largura da Linha"
  padChar: "Preenchimento"
  preset_space: "Espaço"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Outro"
  padChar_placeholder: "Digite um caractere"
  breakWords: "Quebrar Palavras Longas"
  justifyLastLine: "Justificar Última Linha"
  copy: "Copiar"
  d1: "Tenha textos alinhados e justificados com precisão e rapidez. Esta ferramenta converte qualquer bloco de texto simples em um formato simétrico e organizado, oferecendo controle total sobre a largura das linhas e o espaçamento. O processamento ocorre exclusivamente no seu navegador para garantir privacidade total. É a escolha ideal para quem precisa de formatação profissional em redes sociais, código-fonte ou design editorial de forma rápida e gratuita."
  features_title: "Recursos do Justificador"
  f_1: "Alinhamento bilateral perfeito em tempo real"
  f_2: "Controle preciso do número de caracteres por linha"
  f_3: "Opção de substituir espaços em branco por caracteres personalizados (como traços ou pontos)"
  f_4: "Suporte completo à quebra inteligente de palavras longas e preservação de parágrafos"
  example_title: "Exemplo Prático"
  example_desc: "Veja como criar um sumário com pontos de preenchimento usando largura 40 e o caractere ponto (.):"
  example_content: |
    Introdução.............................1
    Metodologia...........................15
    Resultados............................42
    Conclusão.............................88
    Bibliografia..........................92
  use_cases_title: "Casos de Uso"
  uc_1_title: "Design Editorial e Diagramação"
  uc_1_desc: "Obtenha textos justificados para simular blocos de revistas, newsletters ou jornais em softwares que não possuem essa função nativamente."
  uc_2_title: "Documentação de Código (Desenvolvedores)"
  uc_2_desc: "Formate perfeitamente blocos longos de comentários ou cabeçalhos de licença de software em arquivos de texto (txt/markdown) usando caracteres personalizados."
  uc_3_title: "Redes Sociais e Blogs"
  uc_3_desc: "Formate legendas para Instagram, LinkedIn ou Facebook onde o recurso nativo de justificação não está disponível, criando um visual harmônico."
  uc_4_title: "ASCII Art e Retro Design"
  uc_4_desc: "Alinhe caracteres de forma uniforme para blocos de leitura vintage ou letreiros de terminal."
  how_it_works_title: "Como Justificar seu Texto"
  step_1_title: "Cole o Texto"
  step_1_desc: "Insira na caixa de entrada o texto que você deseja justificar. Você pode colar ou digitar diretamente."
  step_2_title: "Defina a Largura"
  step_2_desc: "Ajuste a largura da linha, escolha o caractere de preenchimento (espaço, traço, etc.) e configure o alinhamento da última linha e quebra de palavras."
  step_3_title: "Copie o Resultado"
  step_3_desc: "O resultado final é gerado instantaneamente e o texto justificado está pronto para ser copiado e utilizado onde você precisar."
  faq_title: "Perguntas e Respostas"
  faq_1_q: "O que faz a opção 'Quebrar Palavras Longas'?"
  faq_1_a: "Essa opção impede que palavras muito longas ou links ultrapassem o limite de largura definido. Ao ativá-la, a ferramenta realiza a quebra automática do termo excedente para manter as margens laterais perfeitamente alinhadas."
  faq_2_q: "Posso preencher o texto com traços em vez de espaços?"
  faq_2_a: "Sim. É possível escolher outros caracteres para preencher as lacunas do texto (como '-', '_' ou '.'), sendo ideal para gerar divisórias visuais ou layouts estilizados."
  faq_3_q: "O que acontece com os parágrafos já presentes no texto?"
  faq_3_a: "Os parágrafos originais são totalmente preservados. Como cada quebra de linha é tratada de forma independente, a ferramenta processa cada bloco individualmente para garantir que o layout final permaneça organizado e legível."
  see1: "Contador de Texto"
  see2: "Comparador de Texto"
  see3: "Caractere Invisível"
  see4: "Gerador de Texto"
en:
  pageTitle: "Text Justifier Online — Perfect Alignment | Free"
  title: "Text Justifier"
  meta: "Align text perfectly with a custom line width for social media, editorial design, and code. This free online text justifier helps you justify text quickly and easily."
  input_label: "Original Text"
  placeholder_input: "Paste or type your text here..."
  output_label: "Justified Text"
  placeholder_output: "The justified text will appear here instantly..."
  width: "Line Width"
  padChar: "Fill Character"
  preset_space: "Space"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Other"
  padChar_placeholder: "Type a character"
  breakWords: "Break Long Words"
  justifyLastLine: "Justify Last Line"
  copy: "Copy"
  d1: "Get your text aligned and justified with precision and speed. This text justifier converts any plain text block into a symmetrical and organized format, giving you full control over line width and spacing. Processing happens entirely in your browser to guarantee complete privacy. The ideal choice for anyone who needs professional text alignment for social media, source code, or editorial design — fast and free."
  features_title: "Justifier Features"
  f_1: "Perfect bilateral alignment in real time"
  f_2: "Precise control over the number of characters per line"
  f_3: "Option to replace spaces with custom characters (such as dashes or dots)"
  f_4: "Full support for smart long-word breaking and paragraph preservation"
  example_title: "Practical Example"
  example_desc: "See how to create a table of contents with dot leaders using width 40 and the dot (.) character:"
  example_content: |
    Introduction...........................1
    Methodology...........................15
    Results...............................42
    Conclusion............................88
    Bibliography..........................92
  use_cases_title: "Use Cases"
  uc_1_title: "Editorial Design & Layout"
  uc_1_desc: "Get justified text to simulate magazine, newsletter, or newspaper blocks in software that doesn't support this feature natively."
  uc_2_title: "Code Documentation (Developers)"
  uc_2_desc: "Perfectly format long comment blocks or software license headers in plain text files (txt/markdown) using custom characters."
  uc_3_title: "Social Media & Blogs"
  uc_3_desc: "Format captions for Instagram, LinkedIn, or Facebook where native justification is unavailable, creating a clean and harmonious visual."
  uc_4_title: "ASCII Art & Retro Design"
  uc_4_desc: "Align characters uniformly for vintage reading blocks or terminal-style signs."
  how_it_works_title: "How to Justify Your Text"
  step_1_title: "Paste Your Text"
  step_1_desc: "Enter the text you want to justify in the input box. You can paste or type directly."
  step_2_title: "Set the Width"
  step_2_desc: "Adjust the line width, choose the fill character (space, dash, etc.), and configure last-line alignment and word breaking."
  step_3_title: "Copy the Result"
  step_3_desc: "The final result is generated instantly and the justified text is ready to be copied and used wherever you need it."
  faq_title: "Questions & Answers"
  faq_1_q: "What does the 'Break Long Words' option do?"
  faq_1_a: "This option prevents very long words or links from exceeding the defined line width. When enabled, the tool automatically breaks the overflowing term to keep the side margins perfectly aligned."
  faq_2_q: "Can I fill the text with dashes instead of spaces?"
  faq_2_a: "Yes. You can choose other characters to fill the gaps in the text (such as '-', '_', or '.'), ideal for creating visual dividers or stylized layouts."
  faq_3_q: "What happens to existing paragraphs in the text?"
  faq_3_a: "The original paragraphs are fully preserved. Since each line break is treated independently, the tool processes each block individually to ensure the final layout remains organized and readable."
  see1: "Text Counter"
  see2: "Text Comparator"
  see3: "Invisible Character"
  see4: "Text Generator"
es:
  pageTitle: "Justificador de Texto Online — Alineación Perfecta | Gratis"
  title: "Justificador de Texto"
  meta: "Alinea textos perfectamente con un ancho personalizado para redes sociales, diseño editorial y código. Esta herramienta online gratuita te ayuda a justificar textos de forma rápida y sencilla."
  input_label: "Texto Original"
  placeholder_input: "Pega o escribe tu texto aquí..."
  output_label: "Texto Justificado"
  placeholder_output: "El texto justificado aparecerá aquí al instante..."
  width: "Ancho de Línea"
  padChar: "Relleno"
  preset_space: "Espacio"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Otro"
  padChar_placeholder: "Escribe un carácter"
  breakWords: "Dividir Palabras Largas"
  justifyLastLine: "Justificar Última Línea"
  copy: "Copiar"
  d1: "Ten textos alineados y justificados con precisión y rapidez. Esta herramienta convierte cualquier bloque de texto simple en un formato simétrico y organizado, ofreciendo control total sobre el ancho de línea y el espaciado. El procesamiento ocurre exclusivamente en tu navegador para garantizar privacidad total. La opción ideal para quienes necesitan formato profesional en redes sociales, código fuente o diseño editorial de forma rápida y gratuita."
  features_title: "Características del Justificador"
  f_1: "Alineación bilateral perfecta en tiempo real"
  f_2: "Control preciso sobre el número de caracteres por línea"
  f_3: "Opción de reemplazar espacios por caracteres personalizados (como guiones o puntos)"
  f_4: "Soporte completo para división inteligente de palabras largas y preservación de párrafos"
  example_title: "Ejemplo Práctico"
  example_desc: "Mira cómo crear un índice con puntos de relleno usando ancho 40 y el carácter punto (.):"
  example_content: |
    Introducción...........................1
    Metodología...........................15
    Resultados............................42
    Conclusión............................88
    Bibliografía..........................92
  use_cases_title: "Casos de Uso"
  uc_1_title: "Diseño Editorial y Maquetación"
  uc_1_desc: "Obtén textos justificados para simular bloques de revistas, newsletters o periódicos en software que no tiene esta función de forma nativa."
  uc_2_title: "Documentación de Código (Desarrolladores)"
  uc_2_desc: "Formatea perfectamente bloques largos de comentarios o encabezados de licencia de software en archivos de texto (txt/markdown) usando caracteres personalizados."
  uc_3_title: "Redes Sociales y Blogs"
  uc_3_desc: "Formatea leyendas para Instagram, LinkedIn o Facebook donde el recurso nativo de justificación no está disponible, creando un aspecto visual armónico."
  uc_4_title: "Arte ASCII y Diseño Retro"
  uc_4_desc: "Alinea caracteres de forma uniforme para bloques de lectura vintage o letreros de terminal."
  how_it_works_title: "Cómo Justificar tu Texto"
  step_1_title: "Pega el Texto"
  step_1_desc: "Ingresa en el cuadro de entrada el texto que deseas justificar. Puedes pegarlo o escribirlo directamente."
  step_2_title: "Define el Ancho"
  step_2_desc: "Ajusta el ancho de línea, elige el carácter de relleno (espacio, guión, etc.) y configura la alineación de la última línea y la división de palabras."
  step_3_title: "Copia el Resultado"
  step_3_desc: "El resultado final se genera al instante y el texto justificado está listo para ser copiado y usado donde lo necesites."
  faq_title: "Preguntas y Respuestas"
  faq_1_q: "¿Qué hace la opción 'Dividir Palabras Largas'?"
  faq_1_a: "Esta opción evita que palabras muy largas o enlaces superen el límite de ancho definido. Al activarla, la herramienta realiza la división automática del término excedente para mantener los márgenes laterales perfectamente alineados."
  faq_2_q: "¿Puedo rellenar el texto con guiones en vez de espacios?"
  faq_2_a: "Sí. Es posible elegir otros caracteres para rellenar los espacios del texto (como '-', '_' o '.'), ideal para crear divisores visuales o diseños estilizados."
  faq_3_q: "¿Qué ocurre con los párrafos ya presentes en el texto?"
  faq_3_a: "Los párrafos originales se preservan por completo. Como cada salto de línea se trata de forma independiente, la herramienta procesa cada bloque individualmente para garantizar que el layout final permanezca organizado y legible."
  see1: "Contador de Texto"
  see2: "Comparador de Texto"
  see3: "Carácter Invisible"
  see4: "Generador de Texto"
fr:
  pageTitle: "Justificateur de Texte en Ligne — Alignement Parfait | Gratuit"
  title: "Justificateur de Texte"
  meta: "Alignez des textes parfaitement avec une largeur personnalisée pour les réseaux sociaux, le design éditorial et le code. Cet outil gratuit vous aide à justifier un texte en ligne rapidement et facilement."
  input_label: "Texte Original"
  placeholder_input: "Collez ou tapez votre texte ici..."
  output_label: "Texte Justifié"
  placeholder_output: "Le texte justifié apparaîtra ici instantanément..."
  width: "Largeur de Ligne"
  padChar: "Remplissage"
  preset_space: "Espace"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Autre"
  padChar_placeholder: "Tapez un caractère"
  breakWords: "Couper les Mots Longs"
  justifyLastLine: "Justifier la Dernière Ligne"
  copy: "Copier"
  d1: "Obtenez des textes alignés et justifiés avec précision et rapidité. Cet outil convertit n'importe quel bloc de texte brut en un format symétrique et organisé, offrant un contrôle total sur la largeur des lignes et l'espacement. Le traitement s'effectue exclusivement dans votre navigateur pour garantir une confidentialité totale. Le choix idéal pour quiconque a besoin de justifier un texte en ligne de manière professionnelle pour les réseaux sociaux, le code source ou le design éditorial."
  features_title: "Fonctionnalités du Justificateur"
  f_1: "Alignement bilatéral parfait en temps réel"
  f_2: "Contrôle précis du nombre de caractères par ligne"
  f_3: "Option pour remplacer les espaces par des caractères personnalisés (comme des tirets ou des points)"
  f_4: "Prise en charge complète de la coupure intelligente des mots longs et de la préservation des paragraphes"
  example_title: "Exemple Pratique"
  example_desc: "Voyez comment créer un sommaire avec des points de remplissage en utilisant une largeur de 40 et le caractère point (.) :"
  example_content: |
    Introduction...........................1
    Méthodologie..........................15
    Résultats.............................42
    Conclusion............................88
    Bibliographie.........................92
  use_cases_title: "Cas d'Utilisation"
  uc_1_title: "Design Éditorial et Mise en Page"
  uc_1_desc: "Obtenez des textes justifiés pour simuler des blocs de magazines, newsletters ou journaux dans des logiciels qui ne proposent pas cette fonction nativement."
  uc_2_title: "Documentation de Code (Développeurs)"
  uc_2_desc: "Formatez parfaitement de longs blocs de commentaires ou des en-têtes de licence logicielle dans des fichiers texte brut (txt/markdown) à l'aide de caractères personnalisés."
  uc_3_title: "Réseaux Sociaux et Blogs"
  uc_3_desc: "Formatez des légendes pour Instagram, LinkedIn ou Facebook lorsque la justification native n'est pas disponible, pour un rendu visuel harmonieux."
  uc_4_title: "Art ASCII et Design Rétro"
  uc_4_desc: "Alignez des caractères de manière uniforme pour des blocs de lecture vintage ou des affichages de terminal."
  how_it_works_title: "Comment Justifier votre Texte"
  step_1_title: "Collez le Texte"
  step_1_desc: "Saisissez dans la zone de texte le contenu que vous souhaitez justifier. Vous pouvez le coller ou le taper directement."
  step_2_title: "Définissez la Largeur"
  step_2_desc: "Ajustez la largeur de ligne, choisissez le caractère de remplissage (espace, tiret, etc.) et configurez l'alignement de la dernière ligne et la coupure des mots."
  step_3_title: "Copiez le Résultat"
  step_3_desc: "Le résultat final est généré instantanément et le texte justifié est prêt à être copié et utilisé où vous en avez besoin."
  faq_title: "Questions et Réponses"
  faq_1_q: "Que fait l'option 'Couper les Mots Longs' ?"
  faq_1_a: "Cette option empêche les mots très longs ou les liens de dépasser la largeur de ligne définie. En l'activant, l'outil effectue la coupure automatique du terme excédentaire pour maintenir les marges latérales parfaitement alignées."
  faq_2_q: "Puis-je remplir le texte avec des tirets au lieu d'espaces ?"
  faq_2_a: "Oui. Il est possible de choisir d'autres caractères pour remplir les espaces du texte (comme '-', '_' ou '.'), idéal pour créer des séparateurs visuels ou des mises en page stylisées."
  faq_3_q: "Que se passe-t-il avec les paragraphes déjà présents dans le texte ?"
  faq_3_a: "Les paragraphes originaux sont entièrement préservés. Comme chaque saut de ligne est traité de façon indépendante, l'outil traite chaque bloc individuellement pour garantir que la mise en page finale reste organisée et lisible."
  see1: "Compteur de Texte"
  see2: "Comparateur de Texte"
  see3: "Caractère Invisible"
  see4: "Générateur de Texte"
it:
  pageTitle: "Giustificatore di Testo Online — Allineamento Perfetto | Gratis"
  title: "Giustificatore di Testo"
  meta: "Allinea testi perfettamente con una larghezza personalizzata per social network, design editoriale e codice. Questo strumento gratuito ti aiuta a generare testo giustificato online in modo rapido e semplice."
  input_label: "Testo Originale"
  placeholder_input: "Incolla o digita il tuo testo qui..."
  output_label: "Testo Giustificato"
  placeholder_output: "Il testo giustificato apparirà qui all'istante..."
  width: "Larghezza Riga"
  padChar: "Riempimento"
  preset_space: "Spazio"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Altro"
  padChar_placeholder: "Digita un carattere"
  breakWords: "Spezza Parole Lunghe"
  justifyLastLine: "Giustifica l'Ultima Riga"
  copy: "Copia"
  d1: "Ottieni testi allineati e giustificati con precisione e rapidità. Questo strumento converte qualsiasi blocco di testo semplice in un formato simmetrico e organizzato, offrendo il controllo totale sulla larghezza delle righe e la spaziatura. L'elaborazione avviene esclusivamente nel tuo browser per garantire la massima privacy. La scelta ideale per chi ha bisogno di formattazione professionale su social network, codice sorgente o design editoriale, in modo rapido e gratuito."
  features_title: "Funzionalità del Giustificatore"
  f_1: "Allineamento bilaterale perfetto in tempo reale"
  f_2: "Controllo preciso del numero di caratteri per riga"
  f_3: "Opzione per sostituire gli spazi con caratteri personalizzati (come trattini o punti)"
  f_4: "Supporto completo per la divisione intelligente delle parole lunghe e la preservazione dei paragrafi"
  example_title: "Esempio Pratico"
  example_desc: "Guarda come creare un sommario con punti di riempimento usando larghezza 40 e il carattere punto (.):"
  example_content: |
    Introduzione...........................1
    Metodologia...........................15
    Risultati.............................42
    Conclusione...........................88
    Bibliografia..........................92
  use_cases_title: "Casi d'Uso"
  uc_1_title: "Design Editoriale e Impaginazione"
  uc_1_desc: "Ottieni testi giustificati per simulare blocchi di riviste, newsletter o giornali in software che non dispone di questa funzione in modo nativo."
  uc_2_title: "Documentazione del Codice (Sviluppatori)"
  uc_2_desc: "Formatta perfettamente lunghi blocchi di commenti o intestazioni di licenze software in file di testo (txt/markdown) usando caratteri personalizzati."
  uc_3_title: "Social Network e Blog"
  uc_3_desc: "Formatta didascalie per Instagram, LinkedIn o Facebook dove la giustificazione nativa non è disponibile, creando un risultato visivo armonioso."
  uc_4_title: "Arte ASCII e Design Retrò"
  uc_4_desc: "Allinea i caratteri in modo uniforme per blocchi di lettura vintage o display in stile terminale."
  how_it_works_title: "Come Giustificare il tuo Testo"
  step_1_title: "Incolla il Testo"
  step_1_desc: "Inserisci nel campo di testo il contenuto che desideri giustificare. Puoi incollarlo o digitarlo direttamente."
  step_2_title: "Imposta la Larghezza"
  step_2_desc: "Regola la larghezza della riga, scegli il carattere di riempimento (spazio, trattino, ecc.) e configura l'allineamento dell'ultima riga e la divisione delle parole."
  step_3_title: "Copia il Risultato"
  step_3_desc: "Il risultato finale viene generato all'istante e il testo giustificato è pronto per essere copiato e utilizzato dove ne hai bisogno."
  faq_title: "Domande e Risposte"
  faq_1_q: "Cosa fa l'opzione 'Spezza Parole Lunghe'?"
  faq_1_a: "Questa opzione impedisce che parole molto lunghe o link superino il limite di larghezza definito. Attivandola, lo strumento esegue la divisione automatica del termine eccedente per mantenere i margini laterali perfettamente allineati."
  faq_2_q: "Posso riempire il testo con trattini invece degli spazi?"
  faq_2_a: "Sì. È possibile scegliere altri caratteri per riempire gli spazi nel testo (come '-', '_' o '.'), ideale per creare separatori visivi o layout stilizzati."
  faq_3_q: "Cosa succede ai paragrafi già presenti nel testo?"
  faq_3_a: "I paragrafi originali vengono preservati integralmente. Poiché ogni interruzione di riga è trattata in modo indipendente, lo strumento elabora ogni blocco singolarmente per garantire che il layout finale rimanga organizzato e leggibile."
  see1: "Contatore di Testo"
  see2: "Comparatore di Testo"
  see3: "Carattere Invisibile"
  see4: "Generatore di Testo"

id:
  pageTitle: "Justifikasi Teks Online — Perataan Sempurna | Gratis"
  title: "Justifikasi Teks"
  meta: "Ratakan teks dengan sempurna menggunakan lebar baris yang dapat disesuaikan untuk media sosial, desain editorial, dan kode. Alat gratis ini membantu Anda meratakan teks secara online dengan cepat dan mudah."
  input_label: "Teks Asli"
  placeholder_input: "Tempel atau ketik teks Anda di sini..."
  output_label: "Teks Rata"
  placeholder_output: "Teks yang diratakan akan muncul di sini secara instan..."
  width: "Lebar Baris"
  padChar: "Karakter Pengisi"
  preset_space: "Spasi"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Lainnya"
  padChar_placeholder: "Ketik satu karakter"
  breakWords: "Pisahkan Kata Panjang"
  justifyLastLine: "Ratakan Baris Terakhir"
  copy: "Salin"
  d1: "Dapatkan teks yang rata dan terstruktur dengan presisi dan kecepatan tinggi. Alat ini mengubah blok teks biasa menjadi format yang simetris dan terorganisir, memberikan kontrol penuh atas lebar baris dan spasi antar kata. Semua pemrosesan dilakukan sepenuhnya di browser Anda untuk menjamin privasi total. Pilihan ideal bagi siapa saja yang membutuhkan pemformatan profesional untuk media sosial, kode sumber, atau desain editorial secara cepat dan gratis."
  features_title: "Fitur Justifikasi Teks"
  f_1: "Perataan bilateral sempurna secara real time"
  f_2: "Kontrol presisi jumlah karakter per baris"
  f_3: "Opsi mengganti spasi dengan karakter kustom (seperti tanda hubung atau titik)"
  f_4: "Dukungan penuh untuk pemisahan kata panjang dan pelestarian paragraf"
  example_title: "Contoh Praktis"
  example_desc: "Lihat cara membuat daftar isi dengan titik pengisi menggunakan lebar 40 dan karakter titik (.):"
  example_content: |
    Pendahuluan............................1
    Metodologi............................15
    Hasil.................................42
    Kesimpulan............................88
    Referensi.............................92
  use_cases_title: "Kasus Penggunaan"
  uc_1_title: "Desain Editorial dan Tata Letak"
  uc_1_desc: "Dapatkan teks rata untuk menyimulasikan blok majalah, newsletter, atau koran di perangkat lunak yang tidak mendukung fitur ini secara bawaan."
  uc_2_title: "Dokumentasi Kode (Pengembang)"
  uc_2_desc: "Format blok komentar panjang atau header lisensi perangkat lunak secara sempurna di file teks (txt/markdown) menggunakan karakter kustom."
  uc_3_title: "Media Sosial dan Blog"
  uc_3_desc: "Format teks untuk Instagram, LinkedIn, atau Facebook di mana fitur perataan bawaan tidak tersedia, menciptakan tampilan yang harmonis."
  uc_4_title: "Seni ASCII dan Desain Retro"
  uc_4_desc: "Ratakan karakter secara seragam untuk blok bacaan bergaya vintage atau tampilan terminal."
  how_it_works_title: "Cara Meratakan Teks Anda"
  step_1_title: "Tempel Teks"
  step_1_desc: "Masukkan teks yang ingin Anda ratakan ke dalam kotak input. Anda bisa menempel atau mengetik langsung."
  step_2_title: "Atur Lebar Baris"
  step_2_desc: "Sesuaikan lebar baris, pilih karakter pengisi (spasi, tanda hubung, dll.) dan atur perataan baris terakhir serta pemisahan kata."
  step_3_title: "Salin Hasilnya"
  step_3_desc: "Hasilnya dihasilkan secara instan dan teks yang diratakan siap disalin dan digunakan di mana pun Anda butuhkan."
  faq_title: "Pertanyaan dan Jawaban"
  faq_1_q: "Apa fungsi opsi 'Pisahkan Kata Panjang'?"
  faq_1_a: "Opsi ini mencegah kata-kata yang sangat panjang atau tautan melebihi batas lebar yang ditentukan. Saat diaktifkan, alat ini secara otomatis memotong kata yang melebihi batas agar margin tetap sejajar dengan sempurna."
  faq_2_q: "Bisakah saya mengisi teks dengan tanda hubung, bukan spasi?"
  faq_2_a: "Ya. Anda bisa memilih karakter lain untuk mengisi celah dalam teks (seperti '-', '_', atau '.'), ideal untuk membuat pemisah visual atau tata letak yang bergaya."
  faq_3_q: "Apa yang terjadi pada paragraf yang sudah ada di teks?"
  faq_3_a: "Paragraf asli dipertahankan sepenuhnya. Karena setiap baris baru diperlakukan secara independen, alat ini memproses setiap blok secara individual untuk memastikan tata letak akhir tetap teratur dan mudah dibaca."
  see1: "Penghitung Teks"
  see2: "Pembanding Teks"
  see3: "Karakter Tak Terlihat"
  see4: "Pembuat Teks"
de:
  pageTitle: "Text Ausrichten Online — Perfekte Ausrichtung | Kostenlos"
  title: "Text Ausrichten"
  meta: "Richten Sie Texte perfekt aus mit einer anpassbaren Zeilenbreite für soziale Netzwerke, redaktionelles Design und Code. Dieses kostenlose Online-Tool hilft Ihnen, Texte schnell und einfach im Blocksatz zu formatieren."
  input_label: "Originaltext"
  placeholder_input: "Fügen Sie Ihren Text hier ein oder tippen Sie ihn..."
  output_label: "Ausgerichteter Text"
  placeholder_output: "Der ausgerichtete Text erscheint hier sofort..."
  width: "Zeilenbreite"
  padChar: "Füllzeichen"
  preset_space: "Leerzeichen"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Andere"
  padChar_placeholder: "Zeichen eingeben"
  breakWords: "Lange Wörter Umbrechen"
  justifyLastLine: "Letzte Zeile Ausrichten"
  copy: "Kopieren"
  d1: "Erhalten Sie präzise und gleichmäßig ausgerichtete Texte im Blocksatz. Dieses Tool wandelt jeden einfachen Textblock in ein symmetrisches und strukturiertes Format um und bietet vollständige Kontrolle über Zeilenbreite und Zeichenabstand. Die Verarbeitung erfolgt ausschließlich in Ihrem Browser, um vollständige Privatsphäre zu gewährleisten. Die ideale Wahl für alle, die professionelle Textformatierung für soziale Netzwerke, Quellcode oder redaktionelles Design benötigen — schnell und kostenlos."
  features_title: "Funktionen des Textausrichters"
  f_1: "Perfekte beidseitige Ausrichtung in Echtzeit"
  f_2: "Präzise Kontrolle über die Zeichenanzahl pro Zeile"
  f_3: "Option zum Ersetzen von Leerzeichen durch benutzerdefinierte Zeichen (wie Bindestriche oder Punkte)"
  f_4: "Vollständige Unterstützung für intelligenten Wortumbruch und Absatzerhaltung"
  example_title: "Praktisches Beispiel"
  example_desc: "Sehen Sie, wie Sie ein Inhaltsverzeichnis mit Füllpunkten erstellen, mit einer Breite von 40 und dem Punktzeichen (.):"
  example_content: |
    Einleitung.............................1
    Methodik..............................15
    Ergebnisse............................42
    Fazit.................................88
    Literatur.............................92
  use_cases_title: "Anwendungsfälle"
  uc_1_title: "Redaktionelles Design und Layout"
  uc_1_desc: "Erhalten Sie Blocksatztexte, um Zeitschriften-, Newsletter- oder Zeitungsblöcke in Software zu simulieren, die diese Funktion nicht nativ unterstützt."
  uc_2_title: "Code-Dokumentation (Entwickler)"
  uc_2_desc: "Formatieren Sie lange Kommentarblöcke oder Software-Lizenz-Header in Textdateien (txt/markdown) mithilfe benutzerdefinierter Zeichen perfekt."
  uc_3_title: "Soziale Netzwerke und Blogs"
  uc_3_desc: "Formatieren Sie Bildunterschriften für Instagram, LinkedIn oder Facebook, wo die native Ausrichtungsfunktion nicht verfügbar ist, und erzielen Sie ein harmonisches visuelles Ergebnis."
  uc_4_title: "ASCII-Kunst und Retro-Design"
  uc_4_desc: "Richten Sie Zeichen gleichmäßig aus für Vintage-Leseblöcke oder Terminal-Anzeigen."
  how_it_works_title: "So richten Sie Ihren Text aus"
  step_1_title: "Text Einfügen"
  step_1_desc: "Geben Sie den Text, den Sie ausrichten möchten, in das Eingabefeld ein. Sie können ihn einfügen oder direkt tippen."
  step_2_title: "Breite Festlegen"
  step_2_desc: "Passen Sie die Zeilenbreite an, wählen Sie das Füllzeichen (Leerzeichen, Bindestrich usw.) und konfigurieren Sie die Ausrichtung der letzten Zeile und den Wortumbruch."
  step_3_title: "Ergebnis Kopieren"
  step_3_desc: "Das Endergebnis wird sofort generiert und der ausgerichtete Text ist bereit zum Kopieren und Verwenden, wo immer Sie ihn benötigen."
  faq_title: "Fragen und Antworten"
  faq_1_q: "Was bewirkt die Option 'Lange Wörter Umbrechen'?"
  faq_1_a: "Diese Option verhindert, dass sehr lange Wörter oder Links das definierte Breitenlimit überschreiten. Bei Aktivierung bricht das Tool das überlange Wort automatisch um, damit die Ränder perfekt ausgerichtet bleiben."
  faq_2_q: "Kann ich den Text mit Bindestrichen statt Leerzeichen füllen?"
  faq_2_a: "Ja. Sie können andere Zeichen wählen, um die Lücken im Text zu füllen (wie '-', '_' oder '.'), ideal zum Erstellen visueller Trennlinien oder stilisierter Layouts."
  faq_3_q: "Was passiert mit bereits vorhandenen Absätzen im Text?"
  faq_3_a: "Die ursprünglichen Absätze bleiben vollständig erhalten. Da jeder Zeilenumbruch unabhängig behandelt wird, verarbeitet das Tool jeden Block einzeln, um sicherzustellen, dass das endgültige Layout strukturiert und lesbar bleibt."
  see1: "Textzähler"
  see2: "Textvergleicher"
  see3: "Unsichtbares Zeichen"
  see4: "Textgenerator"

nl:
  pageTitle: "Tekst Uitvullen Online — Perfecte Uitlijning | Gratis"
  title: "Tekst Uitvullen"
  meta: "Vul teksten perfect uit met een aanpasbare regelbreedte voor sociale media, redactioneel design en code. Dit gratis online hulpmiddel helpt u tekst snel en eenvoudig uit te vullen."
  input_label: "Originele Tekst"
  placeholder_input: "Plak of typ uw tekst hier..."
  output_label: "Uitgevulde Tekst"
  placeholder_output: "De uitgevulde tekst verschijnt hier direct..."
  width: "Regelbreedte"
  padChar: "Opvulteken"
  preset_space: "Spatie"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Ander"
  padChar_placeholder: "Typ een teken"
  breakWords: "Lange Woorden Afbreken"
  justifyLastLine: "Laatste Regel Uitvullen"
  copy: "Kopiëren"
  d1: "Krijg nauwkeurig en gelijkmatig uitgevulde teksten met precisie en snelheid. Dit hulpmiddel zet elk gewoon tekstblok om in een symmetrisch en georganiseerd formaat, met volledige controle over de regelbreedte en de woordafstand. De verwerking vindt uitsluitend in uw browser plaats om volledige privacy te garanderen. De ideale keuze voor iedereen die professionele tekstopmaak nodig heeft voor sociale media, broncode of redactioneel design — snel en gratis."
  features_title: "Functies van de Tekstuitvuller"
  f_1: "Perfecte bilaterale uitlijning in realtime"
  f_2: "Nauwkeurige controle over het aantal tekens per regel"
  f_3: "Optie om spaties te vervangen door aangepaste tekens (zoals koppeltekens of punten)"
  f_4: "Volledige ondersteuning voor slim woordafbreking en behoud van alinea's"
  example_title: "Praktisch Voorbeeld"
  example_desc: "Zie hoe je een inhoudsopgave maakt met opvulpunten met behulp van breedte 40 en het puntteken (.):"
  example_content: |
    Inleiding..............................1
    Methodologie..........................15
    Resultaten............................42
    Conclusie.............................88
    Bibliografie..........................92
  use_cases_title: "Toepassingen"
  uc_1_title: "Redactioneel Design en Opmaak"
  uc_1_desc: "Krijg uitgevulde teksten om blokken van tijdschriften, nieuwsbrieven of kranten te simuleren in software die deze functie niet standaard ondersteunt."
  uc_2_title: "Code-documentatie (Ontwikkelaars)"
  uc_2_desc: "Formatteer lange commentaarblokken of softwarelicentie-headers in tekstbestanden (txt/markdown) perfect met aangepaste tekens."
  uc_3_title: "Sociale Media en Blogs"
  uc_3_desc: "Formatteer bijschriften voor Instagram, LinkedIn of Facebook waar de native uitvulfunctie niet beschikbaar is, voor een harmonieus visueel resultaat."
  uc_4_title: "ASCII-kunst en Retro-design"
  uc_4_desc: "Lijn tekens gelijkmatig uit voor vintage leesblokken of terminalweergaven."
  how_it_works_title: "Hoe u uw Tekst Uitvult"
  step_1_title: "Plak de Tekst"
  step_1_desc: "Voer de tekst die u wilt uitvullen in het invoerveld in. U kunt hem plakken of direct typen."
  step_2_title: "Stel de Breedte In"
  step_2_desc: "Pas de regelbreedte aan, kies het opvulteken (spatie, koppelteken, enz.) en stel de uitlijning van de laatste regel en de woordafbreking in."
  step_3_title: "Kopieer het Resultaat"
  step_3_desc: "Het eindresultaat wordt direct gegenereerd en de uitgevulde tekst is klaar om gekopieerd en gebruikt te worden waar u het nodig heeft."
  faq_title: "Vragen en Antwoorden"
  faq_1_q: "Wat doet de optie 'Lange Woorden Afbreken'?"
  faq_1_a: "Deze optie voorkomt dat zeer lange woorden of links de ingestelde breedte overschrijden. Wanneer ingeschakeld, breekt het hulpmiddel het te lange woord automatisch af zodat de marges perfect uitgelijnd blijven."
  faq_2_q: "Kan ik de tekst vullen met koppeltekens in plaats van spaties?"
  faq_2_a: "Ja. U kunt andere tekens kiezen om de tussenruimtes in de tekst te vullen (zoals '-', '_' of '.'), ideaal voor het maken van visuele scheidingslijnen of gestileerde opmaak."
  faq_3_q: "Wat gebeurt er met de alinea's die al in de tekst staan?"
  faq_3_a: "De originele alinea's blijven volledig behouden. Omdat elke regelafbreking onafhankelijk wordt behandeld, verwerkt het hulpmiddel elk blok afzonderlijk om te garanderen dat de uiteindelijke opmaak georganiseerd en leesbaar blijft."
  see1: "Tekstteller"
  see2: "Tekstvergelijker"
  see3: "Onzichtbaar Teken"
  see4: "Tekstgenerator"
ru:
  pageTitle: "Выравнивание текста онлайн — красивый blocksatz (выравнивание по ширине) | Бесплатно"
  title: "Выравнивание текста по ширине"
  meta: "Идеально выравнивайте ваши тексты по ширине с настраиваемой длиной строки для соцсетей, верстки и кода. Бесплатный онлайн-инструмент поможет сделать текст симметричным."
  input_label: "Исходный текст"
  placeholder_input: "Вставьте или введите ваш текст здесь..."
  output_label: "Выровненный текст"
  placeholder_output: "Выровненный по ширине текст появится здесь мгновенно..."
  width: "Ширина строки"
  padChar: "Символ заполнения"
  preset_space: "Пробел"
  preset_dash: "-"
  preset_dot: "."
  preset_underscore: "_"
  preset_custom: "Другой"
  padChar_placeholder: "Введите символ"
  breakWords: "Переносить длинные слова"
  justifyLastLine: "Выравнивать последнюю строку"
  copy: "Копировать"
  d1: "Получите красиво выровненный по ширине текст с высокой точностью и скоростью. Этот инструмент преобразует любой блок обычного текста в симметричный и структурированный формат, предоставляя полный контроль над шириной строки и пробелами. Вся обработка происходит прямо в вашем браузере, обеспечивая абсолютную конфиденциальность. Это идеальный выбор для тех, кому нужно профессиональное форматирование текстов для соцсетей, исходного кода или верстки — быстро и бесплатно."
  features_title: "Возможности выравнивателя"
  f_1: "Идеальное двустороннее выравнивание по ширине в реальном времени"
  f_2: "Точный контроль количества символов в строке"
  f_3: "Возможность замены пробелов на любые символы (например, точки или дефисы)"
  f_4: "Полная поддержка умного переноса длинных слов и сохранения исходных абзацев"
  example_title: "Практический пример"
  example_desc: "Посмотрите, как создать оглавление с заполнением точками при ширине строки 40 и использовании символа точки (.):"
  example_content: |
    Введение...............................1
    Методология...........................15
    Результаты............................42
    Заключение............................88
    Библиография..........................92
  use_cases_title: "Варианты использования"
  uc_1_title: "Верстка и макетирование"
  uc_1_desc: "Получайте текст, выровненный по ширине, для имитации колонок в журналах, рассылках или газетах в редакторах, где нет встроенной функции выравнивания."
  uc_2_title: "Документирование кода (для разработчиков)"
  uc_2_desc: "Красиво форматируйте длинные блоки комментариев или заголовки лицензий в текстовых файлах (txt/markdown) с использованием пользовательских символов."
  uc_3_title: "Социальные сети и блоги"
  uc_3_desc: "Форматируйте описания для Instagram, LinkedIn или Facebook, где стандартная функция выравнивания по ширине отсутствует, создавая аккуратный и гармоничный визуальный стиль."
  uc_4_title: "ASCII-арт и ретро-дизайн"
  uc_4_desc: "Равномерно выравнивайте символы для винтажных текстовых блоков или панелей терминала."
  how_it_works_title: "Как выровнять текст"
  step_1_title: "Вставьте текст"
  step_1_desc: "Вставьте в поле ввода исходный текст, который хотите выровнять. Вы можете скопировать его или ввести вручную."
  step_2_title: "Настройте ширину"
  step_2_desc: "Укажите желаемую ширину строки, выберите символ заполнения (пробел, дефис и т. д.), настройте правила для последней строки и переноса слов."
  step_3_title: "Скопируйте результат"
  step_3_desc: "Итоговый результат создается мгновенно. Готовый текст, выровненный по ширине, можно скопировать в один клик."
  faq_title: "Вопросы и ответы"
  faq_1_q: "Что делает функция «Переносить длинные слова»?"
  faq_1_a: "Эта функция предотвращает выход слишком длинных слов или ссылок за установленные рамки ширины строки. При ее включении инструмент автоматически делит слово, чтобы сохранить ровные и аккуратные боковые границы текста."
  faq_2_q: "Можно ли заполнить пробелы между словами дефисами вместо обычных пробелов?"
  faq_2_a: "Да. Вы можете выбрать любые другие символы для заполнения промежутков в тексте (например, '-', '_' или '.'). Это отлично подходит для создания визуальных разделителей или необычных стилизованных макетов."
  faq_3_q: "Что происходит с уже существующими абзацами в тексте?"
  faq_3_a: "Все исходные абзацы полностью сохраняются. Каждый блок текста обрабатывается индивидуально, гарантируя, что готовый макет останется аккуратным, упорядоченным и удобным для чтения."
  see1: "Счетчик текста"
  see2: "Сравнение текстов"
  see3: "Невидимый символ"
  see4: "Генератор текста"
</i18n>