<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const faqs = computed(() => [
  { question: t('faq_1_q'), answer: t('faq_1_a') },
  { question: t('faq_2_q'), answer: t('faq_2_a') },
  { question: t('faq_3_q'), answer: t('faq_3_a') },
])

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3')],
  faq: faqs.value
})

useHead({
  title: t('meta_title'),
  meta: [{ name: 'description', content: t('meta') }]
})

const state = reactive({
  text: '',
  times: 3,
  sep: 'space',
  customSep: '-',
  perLine: false,
})

const separator = computed(() => {
  switch (state.sep) {
    case 'space': return ' '
    case 'comma': return ', '
    case 'newline': return '\n'
    case 'none': return ''
    case 'custom': return state.customSep
    default: return ' '
  }
})

const output = computed(() => {
  const trimmed = state.text.trim()
  if (!trimmed) return ''

  const sep = separator.value
  const n = Math.min(Math.max(1, Math.floor(state.times ?? 1)), 9999)

  if (state.perLine) {
    const lines = state.text.split('\n').filter(l => l.trim())
    if (!lines.length) return ''
    return lines.map(line => Array(n).fill(line.trim()).join(sep)).join('\n')
  }

  return Array(n).fill(trimmed).join(sep)
})

defineI18nRoute({
  paths: {
    en: '/text-repeater',
    pt: '/repetidor-de-texto',
    es: '/repetidor-de-texto',
    fr: '/repeteur-de-texte',
    it: '/ripetitore-di-testo',
    id: '/pengulang-teks',
    de: '/text-wiederholer',
    nl: '/tekst-herhaler',
    ru: '/povtoritel-teksta',
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :see-also-links="[
      { label: t('see1'), to: 'text-counter' },
      { label: t('see2'), to: 'text-converter' },
      { label: t('see3'), to: 'list-randomizer' },
      { label: t('see4'), to: 'text-generator' },
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Input -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content">{{ t('input_label') }}</span>
        </label>
        <textarea
          v-model="state.text"
          rows="6"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl font-mono text-lg leading-relaxed"
          :placeholder="t('input_placeholder')"
          autofocus
        />
      </div>

      <!-- Controls -->
      <div class="flex flex-wrap gap-4 items-end">
        <!-- Times -->
        <div class="flex flex-col">
          <label class="label">
            <span class="label-text font-bold text-base-content">{{ t('times_label') }}</span>
          </label>
          <input
            v-model.number="state.times"
            type="number"
            min="1"
            max="9999"
            class="input input-bordered input-lg bg-base-200 w-28 rounded-2xl text-center"
          />
        </div>

        <!-- Separator -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold text-base-content">{{ t('sep_label') }}</span>
          </label>
          <select
            v-model="state.sep"
            class="select select-bordered select-lg bg-base-200 rounded-2xl"
          >
            <option value="space">{{ t('sep_space') }}</option>
            <option value="comma">{{ t('sep_comma') }}</option>
            <option value="newline">{{ t('sep_newline') }}</option>
            <option value="none">{{ t('sep_none') }}</option>
            <option value="custom">{{ t('sep_custom') }}</option>
          </select>
        </div>

        <!-- Custom separator input -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="state.sep === 'custom'" class="flex flex-col">
            <label class="label">
              <span class="label-text font-bold text-base-content">{{ t('custom_sep_label') }}</span>
            </label>
            <input
              v-model="state.customSep"
              type="text"
              class="input input-bordered input-lg bg-base-200 w-32 rounded-2xl font-mono text-center"
              maxlength="20"
            />
          </div>
        </Transition>

        <!-- Per-line toggle -->
        <div class="form-control justify-end pb-1">
          <label class="label cursor-pointer gap-3">
            <span class="label-text font-bold text-base-content">{{ t('per_line_label') }}</span>
            <input
              v-model="state.perLine"
              type="checkbox"
              class="toggle toggle-primary"
            />
          </label>
        </div>
      </div>

      <!-- Output -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="output" class="space-y-1">
          <Blockcopy :label="t('result')" :content="output">
            <div class="whitespace-pre-wrap font-mono text-lg leading-relaxed break-all">{{ output }}</div>
          </Blockcopy>
        </div>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3')]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') },
          ]"
        />

        <FaqSection
          :title="t('faq_title')"
          :items="faqs"
        />
      </div>
    </template>

    <DragDropText @onDrop="txt => state.text = txt" />
  </ToolPage>
</template>

<i18n lang="yaml">
{
  pt: {
    title: "Repetidor de Texto e Palavras",
    meta_title: "Repetidor de Texto e Palavras Online Grátis",
    meta: "Repetidor de texto e palavras online e gratuito. Repita qualquer conteúdo quantas vezes quiser, escolha o separador e aplique a repetição linha a linha.",
    desc: "Seja para gerar dados de teste, preencher layouts, criar listas repetidas ou montar exemplos para apresentações, usar um repetidor de palavras manual é cansativo e sujeito a erros. Com esta ferramenta, você define quantas vezes o conteúdo será repetido e como cada ocorrência será separada — por espaço, vírgula, quebra de linha ou qualquer caractere personalizado. Quando o texto possui várias linhas, também é possível repetir cada linha individualmente, facilitando a duplicação de listas inteiras de uma só vez. O resultado é gerado instantaneamente e pode ser copiado com um clique.",
    input_label: "Texto para repetir",
    input_placeholder: "Digite ou cole o texto aqui...",
    times_label: "Repetições",
    sep_label: "Separador",
    sep_space: "Espaço",
    sep_comma: "Vírgula",
    sep_newline: "Nova linha",
    sep_none: "Nenhum",
    sep_custom: "Personalizado",
    custom_sep_label: "Separador",
    per_line_label: "Repetir linha a linha",
    result: "Resultado",
    see1: "Contador de Texto",
    see2: "Conversor de Texto",
    see3: "Sorteador de Listas",
    see4: "Gerador de Texto",
    features_title: "Funcionalidades",
    f_1: "Repita qualquer texto ou palavra quantas vezes quiser",
    f_2: "Escolha o separador: espaço, vírgula, nova linha ou personalizado",
    f_3: "Repita cada linha do texto individualmente",
    how_to_use_title: "Como usar",
    step_1_title: "Digite o texto",
    step_1_desc: "Escreva ou cole o texto que deseja repetir na área de entrada.",
    step_2_title: "Configure as opções",
    step_2_desc: "Defina o número de repetições e escolha o separador entre cada uma delas.",
    step_3_title: "Copie o resultado",
    step_3_desc: "O resultado aparece automaticamente. Clique no botão de cópia para copiar com um clique.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Há um limite de repetições?",
    faq_1_a: "O limite máximo é de 9.999 repetições, suficiente para qualquer uso prático.",
    faq_2_q: "Posso repetir várias linhas ao mesmo tempo?",
    faq_2_a: "Sim! Ative a opção 'Repetir linha a linha' e cada linha do texto será repetida de forma independente.",
    faq_3_q: "Meus dados estão seguros?",
    faq_3_a: "Totalmente. O processamento acontece localmente no seu navegador, garantindo privacidade e segurança."
  },
  en: {
    title: "Text & Word Repeater",
    meta_title: "Text Repeater - Repeat Words & Text Online Free",
    meta: "Free text repeater and word repeater online. Repeat any text or word as many times as you want, choose the separator, and apply repetition line by line.",
    desc: "Whether you need to generate test data, fill a layout, build repeated lists, or put together examples for a presentation, doing it manually is tedious and error-prone. With this tool you choose how many times to repeat the content and how to separate each occurrence — space, comma, line break, or any custom character. When your input has multiple lines, you can also repeat each line individually, making it easy to duplicate entire lists in one go. The result is generated instantly and can be copied with a single click.",
    input_label: "Text to repeat",
    input_placeholder: "Type or paste your text here...",
    times_label: "Repetitions",
    sep_label: "Separator",
    sep_space: "Space",
    sep_comma: "Comma",
    sep_newline: "New line",
    sep_none: "None",
    sep_custom: "Custom",
    custom_sep_label: "Separator",
    per_line_label: "Repeat line by line",
    result: "Result",
    see1: "Text Counter",
    see2: "Text Converter",
    see3: "List Randomizer",
    see4: "Text Generator",
    features_title: "Features",
    f_1: "Repeat any text or word as many times as you want",
    f_2: "Choose the separator: space, comma, new line, or custom",
    f_3: "Repeat each line of the text individually",
    how_to_use_title: "How to use",
    step_1_title: "Enter the text",
    step_1_desc: "Type or paste the text you want to repeat into the input area.",
    step_2_title: "Set the options",
    step_2_desc: "Define the number of repetitions and choose the separator between each one.",
    step_3_title: "Copy the result",
    step_3_desc: "The result appears automatically. Click the copy button to copy it with a single click.",
    faq_title: "Questions & Answers",
    faq_1_q: "Is there a repetition limit?",
    faq_1_a: "The maximum limit is 9,999 repetitions, which is more than enough for any practical use.",
    faq_2_q: "Can I repeat multiple lines at once?",
    faq_2_a: "Yes! Enable the 'Repeat line by line' option and each line of the text will be repeated independently.",
    faq_3_q: "Is my data safe?",
    faq_3_a: "Absolutely. All processing happens locally in your browser — nothing is sent to our servers."
  },
  es: {
    title: "Repetidor de Texto y Palabras",
    meta_title: "Repetidor de Texto y Palabras Online Gratis",
    meta: "Repetidor de texto y palabras online y gratuito. Repite cualquier contenido las veces que quieras, elige el separador y aplica la repetición línea a línea.",
    desc: "Ya sea para generar datos de prueba, rellenar un diseño, crear listas repetidas o preparar ejemplos para una presentación, hacerlo manualmente es tedioso y propenso a errores. Con esta herramienta defines cuántas veces se repetirá el contenido y cómo se separará cada ocurrencia — espacio, coma, salto de línea o cualquier carácter personalizado. Cuando el texto tiene varias líneas, también puedes repetir cada una de forma independiente, lo que facilita duplicar listas enteras de una sola vez. El resultado se genera al instante y puede copiarse con un solo clic.",
    input_label: "Texto a repetir",
    input_placeholder: "Escribe o pega el texto aquí...",
    times_label: "Repeticiones",
    sep_label: "Separador",
    sep_space: "Espacio",
    sep_comma: "Coma",
    sep_newline: "Nueva línea",
    sep_none: "Ninguno",
    sep_custom: "Personalizado",
    custom_sep_label: "Separador",
    per_line_label: "Repetir línea a línea",
    result: "Resultado",
    see1: "Contador de Texto",
    see2: "Convertidor de Texto",
    see3: "Sorteador de Listas",
    see4: "Generador de Texto",
    features_title: "Funcionalidades",
    f_1: "Repite cualquier texto o palabra las veces que quieras",
    f_2: "Elige el separador: espacio, coma, nueva línea o personalizado",
    f_3: "Repite cada línea del texto de forma individual",
    how_to_use_title: "Cómo usar",
    step_1_title: "Escribe el texto",
    step_1_desc: "Escribe o pega el texto que deseas repetir en el área de entrada.",
    step_2_title: "Configura las opciones",
    step_2_desc: "Define el número de repeticiones y elige el separador entre cada una.",
    step_3_title: "Copia el resultado",
    step_3_desc: "El resultado aparece automáticamente. Haz clic en el botón de copia para copiarlo con un solo clic.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Hay un límite de repeticiones?",
    faq_1_a: "El límite máximo es de 9.999 repeticiones, más que suficiente para cualquier uso práctico.",
    faq_2_q: "¿Puedo repetir varias líneas a la vez?",
    faq_2_a: "¡Sí! Activa la opción 'Repetir línea a línea' y cada línea del texto se repetirá de forma independiente.",
    faq_3_q: "¿Mis datos están seguros?",
    faq_3_a: "Totalmente. Todo el procesamiento ocurre localmente en tu navegador y nada se envía a nuestros servidores."
  },
  fr: {
    title: "Répéteur de Texte et de Mots",
    meta_title: "Répéteur de Texte et de Mots en Ligne Gratuit",
    meta: "Répéteur de texte et de mots gratuit en ligne. Répétez n'importe quel contenu autant de fois que vous le souhaitez, choisissez le séparateur et appliquez la répétition ligne par ligne.",
    desc: "Que ce soit pour générer des données de test, remplir une maquette, créer des listes répétées ou préparer des exemples pour une présentation, le faire manuellement est fastidieux et source d'erreurs. Avec cet outil, vous définissez combien de fois le contenu sera répété et comment chaque occurrence sera séparée — espace, virgule, saut de ligne ou tout caractère personnalisé. Lorsque le texte comporte plusieurs lignes, vous pouvez aussi répéter chaque ligne individuellement, ce qui facilite la duplication de listes entières en une seule opération. Le résultat est généré instantanément et peut être copié en un seul clic.",
    input_label: "Texte à répéter",
    input_placeholder: "Saisissez ou collez votre texte ici...",
    times_label: "Répétitions",
    sep_label: "Séparateur",
    sep_space: "Espace",
    sep_comma: "Virgule",
    sep_newline: "Nouvelle ligne",
    sep_none: "Aucun",
    sep_custom: "Personnalisé",
    custom_sep_label: "Séparateur",
    per_line_label: "Répéter ligne par ligne",
    result: "Résultat",
    see1: "Compteur de Texte",
    see2: "Convertisseur de Texte",
    see3: "Tirage au Sort",
    see4: "Générateur de Texte",
    features_title: "Fonctionnalités",
    f_1: "Répétez n'importe quel texte ou mot autant de fois que vous le souhaitez",
    f_2: "Choisissez le séparateur : espace, virgule, nouvelle ligne ou personnalisé",
    f_3: "Répétez chaque ligne du texte individuellement",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Saisissez le texte",
    step_1_desc: "Écrivez ou collez le texte que vous souhaitez répéter dans la zone de saisie.",
    step_2_title: "Configurez les options",
    step_2_desc: "Définissez le nombre de répétitions et choisissez le séparateur entre chacune.",
    step_3_title: "Copiez le résultat",
    step_3_desc: "Le résultat apparaît automatiquement. Cliquez sur le bouton de copie pour le copier en un seul clic.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Y a-t-il une limite de répétitions ?",
    faq_1_a: "La limite maximale est de 9 999 répétitions, ce qui est largement suffisant pour tout usage pratique.",
    faq_2_q: "Puis-je répéter plusieurs lignes à la fois ?",
    faq_2_a: "Oui ! Activez l'option 'Répéter ligne par ligne' et chaque ligne du texte sera répétée de façon indépendante.",
    faq_3_q: "Mes données sont-elles en sécurité ?",
    faq_3_a: "Absolument. Tout le traitement s'effectue localement dans votre navigateur et rien n'est envoyé à nos serveurs."
  },
  it: {
    title: "Ripetitore di Parole e Testo",
    meta_title: "Ripetitore di Parole e Testo Online Gratis",
    meta: "Ripetitore di parole e testo online e gratuito. Ripeti qualsiasi contenuto quante volte vuoi, scegli il separatore e applica la ripetizione riga per riga.",
    desc: "Che si tratti di generare dati di test, riempire un layout, creare elenchi ripetuti o preparare esempi per una presentazione, farlo manualmente è noioso e soggetto a errori. Con questo strumento definisci quante volte il contenuto verrà ripetuto e come separare ogni occorrenza — spazio, virgola, interruzione di riga o qualsiasi carattere personalizzato. Quando il testo ha più righe, puoi anche ripetere ciascuna individualmente, rendendo facile duplicare intere liste in una sola operazione. Il risultato viene generato istantaneamente e può essere copiato con un solo clic.",
    input_label: "Testo da ripetere",
    input_placeholder: "Digita o incolla il testo qui...",
    times_label: "Ripetizioni",
    sep_label: "Separatore",
    sep_space: "Spazio",
    sep_comma: "Virgola",
    sep_newline: "Nuova riga",
    sep_none: "Nessuno",
    sep_custom: "Personalizzato",
    custom_sep_label: "Separatore",
    per_line_label: "Ripeti riga per riga",
    result: "Risultato",
    see1: "Contatore di Testo",
    see2: "Convertitore di Testo",
    see3: "Estrattore Casuale",
    see4: "Generatore di Testo",
    features_title: "Funzionalità",
    f_1: "Ripeti qualsiasi testo o parola quante volte vuoi",
    f_2: "Scegli il separatore: spazio, virgola, nuova riga o personalizzato",
    f_3: "Ripeti ogni riga del testo individualmente",
    how_to_use_title: "Come usare",
    step_1_title: "Inserisci il testo",
    step_1_desc: "Scrivi o incolla il testo che desideri ripetere nell'area di input.",
    step_2_title: "Configura le opzioni",
    step_2_desc: "Definisci il numero di ripetizioni e scegli il separatore tra ciascuna.",
    step_3_title: "Copia il risultato",
    step_3_desc: "Il risultato appare automaticamente. Clicca sul pulsante di copia per copiarlo con un solo clic.",
    faq_title: "Domande e Risposte",
    faq_1_q: "C'è un limite di ripetizioni?",
    faq_1_a: "Il limite massimo è di 9.999 ripetizioni, più che sufficiente per qualsiasi uso pratico.",
    faq_2_q: "Posso ripetere più righe contemporaneamente?",
    faq_2_a: "Sì! Attiva l'opzione 'Ripeti riga per riga' e ogni riga del testo verrà ripetuta in modo indipendente.",
    faq_3_q: "I miei dati sono al sicuro?",
    faq_3_a: "Assolutamente. Tutta l'elaborazione avviene localmente nel tuo browser e nulla viene inviato ai nostri server."
  },
  id: {
    title: "Pengulang Teks",
    meta_title: "Pengulang Teks - Ulangi Kata & Teks Online Gratis",
    meta: "Ulangi kata, frasa, atau teks sebanyak yang Anda inginkan dengan pemisah khusus. Terapkan pengulangan pada satu atau beberapa baris sekaligus.",
    desc: "Baik untuk menghasilkan data uji, mengisi tata letak, membuat daftar berulang, atau menyiapkan contoh untuk presentasi, melakukannya secara manual memakan waktu dan rentan terhadap kesalahan. Dengan alat ini Anda menentukan berapa kali konten akan diulang dan bagaimana setiap kemunculan dipisahkan — spasi, koma, baris baru, atau karakter khusus apa pun. Ketika teks memiliki beberapa baris, Anda juga dapat mengulang setiap baris secara individual, sehingga mudah untuk menduplikasi seluruh daftar sekaligus. Hasilnya dibuat secara instan dan dapat disalin dengan satu klik.",
    input_label: "Teks untuk diulang",
    input_placeholder: "Ketik atau tempel teks Anda di sini...",
    times_label: "Pengulangan",
    sep_label: "Pemisah",
    sep_space: "Spasi",
    sep_comma: "Koma",
    sep_newline: "Baris baru",
    sep_none: "Tidak ada",
    sep_custom: "Kustom",
    custom_sep_label: "Pemisah",
    per_line_label: "Ulangi baris per baris",
    result: "Hasil",
    see1: "Penghitung Teks",
    see2: "Konverter Teks",
    see3: "Pengacak Daftar",
    see4: "Generator Teks",
    features_title: "Fitur",
    f_1: "Ulangi teks atau kata apa pun sebanyak yang Anda inginkan",
    f_2: "Pilih pemisah: spasi, koma, baris baru, atau kustom",
    f_3: "Ulangi setiap baris teks secara individual",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Masukkan teks",
    step_1_desc: "Ketik atau tempel teks yang ingin Anda ulangi ke area input.",
    step_2_title: "Atur opsi",
    step_2_desc: "Tentukan jumlah pengulangan dan pilih pemisah di antara setiap pengulangan.",
    step_3_title: "Salin hasilnya",
    step_3_desc: "Hasilnya muncul secara otomatis. Klik tombol salin untuk menyalinnya dengan satu klik.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah ada batas pengulangan?",
    faq_1_a: "Batas maksimum adalah 9.999 pengulangan, lebih dari cukup untuk penggunaan praktis apa pun.",
    faq_2_q: "Bisakah saya mengulang beberapa baris sekaligus?",
    faq_2_a: "Ya! Aktifkan opsi 'Ulangi baris per baris' dan setiap baris teks akan diulang secara independen.",
    faq_3_q: "Apakah data saya aman?",
    faq_3_a: "Tentu saja. Semua pemrosesan dilakukan secara lokal di browser Anda dan tidak ada yang dikirim ke server kami."
  },
  de: {
    title: "Text-Wiederholer",
    meta_title: "Text Wiederholen - Wörter & Texte Online Kostenlos Wiederholen",
    meta: "Wiederholen Sie Wörter, Sätze oder Texte so oft Sie möchten mit benutzerdefinierten Trennzeichen. Wenden Sie die Wiederholung auf eine oder mehrere Zeilen gleichzeitig an.",
    desc: "Ob zum Erzeugen von Testdaten, zum Befüllen eines Layouts, zum Erstellen wiederholter Listen oder zum Vorbereiten von Beispielen für eine Präsentation — dies manuell zu tun ist mühsam und fehleranfällig. Mit diesem Tool legen Sie fest, wie oft der Inhalt wiederholt wird und wie jede Wiederholung getrennt wird — durch Leerzeichen, Komma, Zeilenumbruch oder ein beliebiges benutzerdefiniertes Zeichen. Wenn der Text mehrere Zeilen hat, können Sie auch jede Zeile einzeln wiederholen, was das Duplizieren ganzer Listen auf einmal erleichtert. Das Ergebnis wird sofort erzeugt und kann mit einem einzigen Klick kopiert werden.",
    input_label: "Zu wiederholender Text",
    input_placeholder: "Text hier eingeben oder einfügen...",
    times_label: "Wiederholungen",
    sep_label: "Trennzeichen",
    sep_space: "Leerzeichen",
    sep_comma: "Komma",
    sep_newline: "Neue Zeile",
    sep_none: "Keines",
    sep_custom: "Benutzerdefiniert",
    custom_sep_label: "Trennzeichen",
    per_line_label: "Zeile für Zeile wiederholen",
    result: "Ergebnis",
    see1: "Textzähler",
    see2: "Textkonverter",
    see3: "Listen-Randomizer",
    see4: "Textgenerator",
    features_title: "Funktionen",
    f_1: "Wiederhole beliebigen Text oder Wörter so oft du möchtest",
    f_2: "Wähle das Trennzeichen: Leerzeichen, Komma, neue Zeile oder benutzerdefiniert",
    f_3: "Wiederhole jede Zeile des Textes einzeln",
    how_to_use_title: "So verwendest du das Tool",
    step_1_title: "Text eingeben",
    step_1_desc: "Gib den Text, den du wiederholen möchtest, in das Eingabefeld ein oder füge ihn ein.",
    step_2_title: "Optionen festlegen",
    step_2_desc: "Lege die Anzahl der Wiederholungen fest und wähle das Trennzeichen zwischen den einzelnen Wiederholungen.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Das Ergebnis erscheint automatisch. Klicke auf die Kopierschaltfläche, um es mit einem Klick zu kopieren.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Gibt es ein Wiederholungslimit?",
    faq_1_a: "Das Maximum liegt bei 9.999 Wiederholungen — mehr als genug für jeden praktischen Anwendungsfall.",
    faq_2_q: "Kann ich mehrere Zeilen gleichzeitig wiederholen?",
    faq_2_a: "Ja! Aktiviere die Option 'Zeile für Zeile wiederholen' und jede Zeile des Textes wird unabhängig wiederholt.",
    faq_3_q: "Sind meine Daten sicher?",
    faq_3_a: "Absolut. Die gesamte Verarbeitung erfolgt lokal in deinem Browser und nichts wird an unsere Server gesendet."
  },
  nl: {
    title: "Tekst Herhaler",
    meta_title: "Tekst Herhalen - Woorden & Tekst Online Gratis Herhalen",
    meta: "Herhaal woorden, zinnen of teksten zo vaak als je wilt met aangepaste scheidingstekens. Pas de herhaling toe op één of meerdere regels tegelijk.",
    desc: "Of het nu gaat om het genereren van testdata, het vullen van een lay-out, het maken van herhaalde lijsten of het voorbereiden van voorbeelden voor een presentatie — het handmatig doen is omslachtig en foutgevoelig. Met dit hulpmiddel bepaal je hoe vaak de inhoud wordt herhaald en hoe elke herhaling wordt gescheiden — door een spatie, komma, regelafbreking of een willekeurig aangepast teken. Als de tekst meerdere regels heeft, kun je ook elke regel afzonderlijk herhalen, wat het in één keer dupliceren van volledige lijsten eenvoudig maakt. Het resultaat wordt direct gegenereerd en kan met één klik worden gekopieerd.",
    input_label: "Te herhalen tekst",
    input_placeholder: "Typ of plak je tekst hier...",
    times_label: "Herhalingen",
    sep_label: "Scheidingsteken",
    sep_space: "Spatie",
    sep_comma: "Komma",
    sep_newline: "Nieuwe regel",
    sep_none: "Geen",
    sep_custom: "Aangepast",
    custom_sep_label: "Scheidingsteken",
    per_line_label: "Regel voor regel herhalen",
    result: "Resultaat",
    see1: "Tekstteller",
    see2: "Tekstconverter",
    see3: "Lijst-randomizer",
    see4: "Tekstgenerator",
    features_title: "Functies",
    f_1: "Herhaal elke tekst of elk woord zo vaak als je wilt",
    f_2: "Kies het scheidingsteken: spatie, komma, nieuwe regel of aangepast",
    f_3: "Herhaal elke regel van de tekst afzonderlijk",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Voer de tekst in",
    step_1_desc: "Typ of plak de tekst die je wilt herhalen in het invoerveld.",
    step_2_title: "Stel de opties in",
    step_2_desc: "Bepaal het aantal herhalingen en kies het scheidingsteken tussen elke herhaling.",
    step_3_title: "Kopieer het resultaat",
    step_3_desc: "Het resultaat verschijnt automatisch. Klik op de kopieerknop om het met één klik te kopiëren.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Is er een herhalingslimiet?",
    faq_1_a: "Het maximum is 9.999 herhalingen, ruim voldoende voor elk praktisch gebruik.",
    faq_2_q: "Kan ik meerdere regels tegelijk herhalen?",
    faq_2_a: "Ja! Activeer de optie 'Regel voor regel herhalen' en elke regel van de tekst wordt onafhankelijk herhaald.",
    faq_3_q: "Zijn mijn gegevens veilig?",
    faq_3_a: "Absoluut. Alle verwerking vindt lokaal plaats in je browser en er wordt niets naar onze servers verzonden."
  },
  ru: {
    title: "Повторитель текста и слов онлайн",
    meta_title: "Повторитель текста — Повторить слова и текст онлайн бесплатно",
    meta: "Бесплатный онлайн-повторитель текста и слов. Повторяйте любой текст или слова столько раз, сколько захотите, выбирайте разделитель и применяйте построчное повторение.",
    desc: "Будь то генерация тестовых данных, заполнение макетов, создание повторяющихся списков или подготовка примеров для презентации — делать это вручную долго и легко допустить ошибки. С помощью этого инструмента вы можете указать, сколько раз повторить содержимое и как разделить каждое повторение — пробелом, запятой, переносом строки или любым другим пользовательским символом. Если в вашем тексте несколько строк, вы также можете повторить каждую строку индивидуально, что позволяет быстро дублировать целые списки. Результат создается мгновенно и копируется в один клик.",
    input_label: "Текст для повторения",
    input_placeholder: "Введите или вставьте ваш текст здесь...",
    times_label: "Количество повторений",
    sep_label: "Разделитель",
    sep_space: "Пробел",
    sep_comma: "Запятая",
    sep_newline: "Новая строка",
    sep_none: "Нет",
    sep_custom: "Другой",
    custom_sep_label: "Разделитель",
    per_line_label: "Повторять построчно",
    result: "Результат",
    see1: "Счетчик текста",
    see2: "Конвертер текста",
    see3: "Рандомизатор списков",
    see4: "Генератор текста",
    features_title: "Возможности",
    f_1: "Повторение любого текста или слова столько раз, сколько необходимо",
    f_2: "Выбор разделителя: пробел, запятая, новая строка или собственный символ",
    f_3: "Построчное повторение текста в индивидуальном порядке",
    how_to_use_title: "Инструкция по использованию",
    step_1_title: "Введите текст",
    step_1_desc: "Напишите или вставьте текст, который хотите повторить, в поле ввода.",
    step_2_title: "Настройте параметры",
    step_2_desc: "Укажите количество повторений и выберите подходящий разделитель.",
    step_3_title: "Скопируйте результат",
    step_3_desc: "Результат отобразится автоматически. Нажмите на кнопку копирования, чтобы скопировать текст в один клик.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Есть ли лимит на количество повторений?",
    faq_1_a: "Максимальный предел составляет 9 999 повторений, что вполне достаточно для любых практических целей.",
    faq_2_q: "Можно ли повторить несколько строк одновременно?",
    faq_2_a: "Да! Включите функцию «Повторять построчно», и каждая строка текста повторится независимо от остальных.",
    faq_3_q: "Безопасны ли мои данные?",
    faq_3_a: "Абсолютно. Вся обработка происходит локально в вашем браузере, и ваши данные не отправляются на наши серверы."
  }
}
</i18n>
