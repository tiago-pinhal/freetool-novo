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
  features: [t('f_1'), t('f_2')],
  faq: faqs.value,
})

useHead({
  title: t('meta_title'),
  meta: [{ name: 'description', content: t('meta') }],
})

const input = ref('')

const output = computed(() => krutidevToUnicode(input.value))

defineI18nRoute({
  paths: {
    en: '/krutidev-to-unicode',
    pt: '/krutidev-para-unicode',
    es: '/krutidev-a-unicode',
    fr: '/krutidev-en-unicode',
    it: '/krutidev-in-unicode',
    id: '/krutidev-ke-unicode',
    de: '/krutidev-zu-unicode',
    nl: '/krutidev-naar-unicode',
    ru: '/krutidev-v-unicode',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :see-also-links="[
      { label: t('see1'), to: 'unicode-to-krutidev' },
      { label: t('see2'), to: 'text-converter' },
      { label: t('see3'), to: 'text-counter' },
      { label: t('see4'), to: 'morse-code-converter' },
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Input -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content">{{ t('input_label') }}</span>
        </label>
        <textarea
          v-model="input"
          rows="8"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl font-mono text-lg leading-relaxed"
          :placeholder="t('input_placeholder')"
          autofocus
          dir="ltr"
        />
      </div>

      <!-- Output -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="output" class="space-y-1">
          <Blockcopy :label="t('output_label')" :content="output">
            <div
              class="whitespace-pre-wrap text-lg leading-relaxed break-words"
              dir="ltr"
              lang="hi"
            >
              {{ output }}
            </div>
          </Blockcopy>
        </div>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2')]"
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

    <DragDropText @onDrop="txt => input = txt" />
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Krutidev to Unicode Converter",
    meta_title: "Free Online Krutidev to Unicode Converter",
    meta: "Convert Krutidev font text to Unicode Devanagari online for free. Compatible with Krutidev 010. Instant result, no installation required.",
    desc: "This tool converts Krutidev text to Unicode Devanagari accurately, preserving consonants, vowels, matras, conjuncts, and numerals. The Krutidev font has been the de facto standard for typing Hindi in India for decades, widely used in government documents, newspapers, and printed materials. Because it is based on ASCII mapping, where each Latin character represents a Devanagari glyph, this text is unreadable on modern devices without the font installed, cannot be indexed by search engines, and does not work in systems expecting Unicode. Processing is done entirely in your browser, ensuring security and privacy.",
    input_label: "Krutidev Text",
    input_placeholder: "Paste Krutidev text here...",
    output_label: "Unicode Devanagari",
    see1: "Unicode to Krutidev",
    see2: "Text Converter",
    see3: "Text Counter",
    see4: "Morse Code Converter",
    features_title: "Features",
    f_1: "Converts Krutidev 010 to Unicode Devanagari with conjunct and matra support",
    f_2: "Automatically repositions ikar (ि) and reph (र्) matras to the correct Unicode order",
    how_to_use_title: "How to Use",
    step_1_title: "Paste the Krutidev text",
    step_1_desc: "Paste the content copied from a document with Krutidev font into the input area. The text will look like scrambled Latin characters.",
    step_2_title: "See the instant result",
    step_2_desc: "Unicode Devanagari is generated automatically as you paste or type. No button click is required.",
    step_3_title: "Copy the Unicode",
    step_3_desc: "Click the copy button to copy the Unicode text. It will work on any system, editor, or platform without requiring special fonts.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is Krutidev?",
    faq_1_a: "Krutidev is a family of fonts for typing Hindi created in India before Unicode standardization. It works by mapping Devanagari alphabet glyphs over ASCII character positions, so the text is only readable with the correct font installed. The Krutidev 010 variant is the most widespread and is the one supported by this tool.",
    faq_2_q: "Why convert Krutidev to Unicode?",
    faq_2_a: "Krutidev text is not searchable, does not work on modern systems without the font installed, and cannot be copied to apps like WhatsApp or Word without breaking. Unicode Devanagari is the universal standard — it works on any device, browser, and operating system without additional configuration.",
    faq_3_q: "Is the conversion accurate?",
    faq_3_a: "The tool is optimized for Krutidev 010, the most widely used variant in government documents, newspapers, and printed materials in India, and covers the vast majority of texts encountered in practice. Consonants, vowels, matras, common conjuncts, and numerals are converted with high fidelity. Other Krutidev variants (011, 012, 020, etc.) may use different mappings for some characters and produce partially incorrect results."
  },
  pt: {
    title: "Conversor de Krutidev para Unicode",
    meta_title: "Conversor de Krutidev para Unicode Online Grátis",
    meta: "Converta texto em fonte Krutidev para Unicode Devanagari online e gratuitamente. Compatível com Krutidev 010. Resultado instantâneo, sem instalação.",
    desc: "Esta ferramenta converte texto Krutidev para Unicode Devanagari com precisão, preservando consoantes, vogais, matras, conjuntas e numerais. A fonte Krutidev foi durante décadas o padrão de facto para digitação de Hindi na Índia, amplamente usada em documentos governamentais, jornais e materiais impressos. Por ser baseada em mapeamento ASCII, onde cada caractere latino representa um glifo Devanagari, esse texto é ilegível em dispositivos modernos sem a fonte instalada, não pode ser indexado por buscadores e não funciona em sistemas que esperam Unicode. O processamento é realizado inteiramente em seu navegador, garantindo segurança e privacidade.",
    input_label: "Texto em Krutidev",
    input_placeholder: "Cole aqui o texto em Krutidev...",
    output_label: "Unicode Devanagari",
    see1: "Unicode para Krutidev",
    see2: "Conversor de Texto",
    see3: "Contador de Texto",
    see4: "Conversor de Morse",
    features_title: "Funcionalidades",
    f_1: "Converte Krutidev 010 para Unicode Devanagari com suporte a conjuntas e matras",
    f_2: "Reposiciona automaticamente matra ikar (ि) e reph (र्) para a ordem Unicode correta",
    how_to_use_title: "Como usar",
    step_1_title: "Cole o texto Krutidev",
    step_1_desc: "Cole o conteúdo copiado de um documento com fonte Krutidev na área de entrada. O texto parecerá caracteres latinos embaralhados.",
    step_2_title: "Veja o resultado instantâneo",
    step_2_desc: "O Unicode Devanagari é gerado automaticamente à medida que você cola ou digita. Não é necessário clicar em nenhum botão.",
    step_3_title: "Copie o Unicode",
    step_3_desc: "Clique no botão de cópia para copiar o texto Unicode. Ele funcionará em qualquer sistema, editor ou plataforma sem necessidade de fontes especiais.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O que é Krutidev?",
    faq_1_a: "Krutidev é uma família de fontes para digitação de Hindi criada na Índia antes da padronização do Unicode. Ela funciona mapeando glifos do alfabeto Devanagari sobre as posições de caracteres ASCII, por isso o texto só é legível com a fonte correta instalada. A variante Krutidev 010 é a mais difundida e é a suportada por esta ferramenta.",
    faq_2_q: "Por que converter Krutidev para Unicode?",
    faq_2_a: "Texto em Krutidev não é pesquisável, não funciona em sistemas modernos sem a fonte instalada e não pode ser copiado para aplicativos como WhatsApp ou Word sem quebrar. O Unicode Devanagari é o padrão universal — funciona em qualquer dispositivo, navegador e sistema operacional sem configuração adicional.",
    faq_3_q: "A conversão é precisa?",
    faq_3_a: "A ferramenta é otimizada para Krutidev 010, a variante mais amplamente usada em documentos governamentais, jornais e materiais impressos na Índia, e cobre a grande maioria dos textos encontrados na prática. Consoantes, vogais, matras, conjuntas comuns e numerais são convertidos com alta fidelidade. Outras variantes da fonte Krutidev (011, 012, 020 etc.) podem usar mapeamentos diferentes para alguns caracteres e produzir resultados parcialmente incorretos."
  },
  es: {
    title: "Conversor de Krutidev a Unicode",
    meta_title: "Conversor de Krutidev a Unicode en Línea Gratis",
    meta: "Convierte texto en fuente Krutidev a Unicode Devanagari en línea gratis. Compatible con Krutidev 010. Resultado instantáneo, sin instalación.",
    desc: "Esta herramienta convierte el texto Krutidev a Unicode Devanagari con precisión, conservando consonantes, vocales, matras, conjuntas y números. La fuente Krutidev ha sido el estándar de facto para escribir en hindi en la India durante décadas, ampliamente utilizada en documentos gubernamentales, periódicos y materiales impresos. Debido a que se basa en la codificación ASCII, donde cada carácter latino representa un glifo Devanagari, este texto es ilegible en dispositivos modernos sin la fuente instalada, no puede ser indexado por motores de búsqueda y no funciona en sistemas que esperan Unicode. El procesamiento se realiza completamente en su navegador, garantizando seguridad y privacidad.",
    input_label: "Texto en Krutidev",
    input_placeholder: "Pega el texto en Krutidev aquí...",
    output_label: "Unicode Devanagari",
    see1: "Unicode a Krutidev",
    see2: "Conversor de Texto",
    see3: "Contador de Texto",
    see4: "Conversor de Código Morse",
    features_title: "Características",
    f_1: "Convierte Krutidev 010 a Unicode Devanagari con soporte para conjuntas y matras",
    f_2: "Reposiciona automáticamente las matras ikar (ि) y reph (र्) al orden Unicode correcto",
    how_to_use_title: "Cómo Usar",
    step_1_title: "Pega el texto Krutidev",
    step_1_desc: "Pega el contenido copiado de un documento con la fuente Krutidev en el área de entrada. El texto parecerá caracteres latinos mezclados.",
    step_2_title: "Ve el resultado instantáneo",
    step_2_desc: "El Unicode Devanagari se genera automáticamente a medida que pegas o escribes. No es necesario hacer clic en ningún botón.",
    step_3_title: "Copia el Unicode",
    step_3_desc: "Haz clic en el botón de copiar para copiar el texto Unicode. Funcionará en cualquier sistema, editor o plataforma sin requerir fuentes especiales.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Qué es Krutidev?",
    faq_1_a: "Krutidev es una familia de fuentes para escribir hindi creada en la India antes de la estandarización de Unicode. Funciona asignando glifos del alfabeto Devanagari sobre las posiciones de caracteres ASCII, por lo que el texto solo se puede leer con la fuente correcta instalada. La variante Krutidev 010 es la más extendida y es la compatible con esta herramienta.",
    faq_2_q: "¿Por qué convertir Krutidev a Unicode?",
    faq_2_a: "El texto en Krutidev no se puede buscar, no funciona en sistemas modernos sin la fuente instalada y no se puede copiar a aplicaciones como WhatsApp o Word sin romperse. Unicode Devanagari es el estándar universal: funciona en cualquier dispositivo, navegador y sistema operativo sin configuración adicional.",
    faq_3_q: "¿Es precisa la conversión?",
    faq_3_a: "La herramienta está optimizada para Krutidev 010, la variante más utilizada en documentos gubernamentales, periódicos y materiales impresos en la India, y cubre la gran mayoría de los textos encontrados en la práctica. Las consonantes, vocales, matras, conjuntas comunes y números se convierten con alta fidelidad. Otras variantes de Krutidev (011, 012, 020, etc.) pueden usar diferentes mapeos para algunos caracteres y producir resultados parcialmente incorrectos."
  },
  fr: {
    title: "Convertisseur de Krutidev en Unicode",
    meta_title: "Convertisseur de Krutidev en Unicode en Ligne Gratuit",
    meta: "Convertissez gratuitement en ligne du texte de la police Krutidev en Unicode Devanagari. Compatible avec Krutidev 010. Résultat instantané, aucune installation requise.",
    desc: "Cet outil convertit avec précision le texte Krutidev en Unicode Devanagari, en préservant les consonnes, les voyelles, les matras, les conjonctions et les chiffres. La police Krutidev a été la norme de facto pour taper en hindi en Inde pendant des décennies, largement utilisée dans les documents gouvernementaux, les journaux et les supports imprimés. Parce qu'elle est basée sur le mappage ASCII, où chaque caractère latin représente un glyphe Devanagari, ce texte est illisible sur les appareils modernes sans la police installée, ne peut pas être indexé par les moteurs de recherche et ne fonctionne pas dans les systèmes attendant de l'Unicode. Le traitement est entièrement effectué dans votre navigateur, garantissant sécurité et confidentialité.",
    input_label: "Texte Krutidev",
    input_placeholder: "Collez le texte Krutidev ici...",
    output_label: "Unicode Devanagari",
    see1: "Unicode en Krutidev",
    see2: "Convertisseur de Texte",
    see3: "Compteur de Texte",
    see4: "Convertisseur de Code Morse",
    features_title: "Caractéristiques",
    f_1: "Convertit Krutidev 010 en Unicode Devanagari avec prise en charge des conjonctions et des matras",
    f_2: "Repositionne automatiquement les matras ikar (ि) et reph (र्) dans le bon ordre Unicode",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Collez le texte Krutidev",
    step_1_desc: "Collez le contenu copié d'un document avec la police Krutidev dans la zone de saisie. Le texte ressemblera à des caractères latins brouillés.",
    step_2_title: "Voir le résultat instantané",
    step_2_desc: "L'Unicode Devanagari est généré automatiquement au fur et à mesure que vous collez ou tapez. Aucun clic n'est nécessaire.",
    step_3_title: "Copier l'Unicode",
    step_3_desc: "Cliquez sur le bouton de copie pour copier le texte Unicode. Il fonctionnera sur n'importe quel système, éditeur ou plateforme sans nécessiter de polices spéciales.",
    faq_title: "Questions & Réponses",
    faq_1_q: "Qu'est-ce que Krutidev ?",
    faq_1_a: "Krutidev est une famille de polices pour taper l'hindi créée en Inde avant la standardisation Unicode. Elle fonctionne en mappant des glyphes de l'alphabet Devanagari sur les positions de caractères ASCII, le texte n'est donc lisible qu'avec la bonne police installée. La variante Krutidev 010 est la plus répandue et est celle prise en charge par cet outil.",
    faq_2_q: "Pourquoi convertir Krutidev en Unicode ?",
    faq_2_a: "Le texte Krutidev ne peut pas être recherché, ne fonctionne pas sur les systèmes modernes sans la police installée et ne peut pas être copié vers des applications comme WhatsApp ou Word sans se casser. L'Unicode Devanagari est la norme universelle — il fonctionne sur n'importe quel appareil, navigateur et système d'exploitation sans configuration supplémentaire.",
    faq_3_q: "La conversion est-elle précise ?",
    faq_3_a: "L'outil est optimisé pour Krutidev 010, la variante la plus largement utilisée dans les documents gouvernementaux, les journaux et les supports imprimés en Inde, et couvre la grande majorité des textes rencontrés en pratique. Les consonnes, voyelles, matras, conjonctions courantes et chiffres sont convertis avec une grande fidélité. D'autres variantes de Krutidev (011, 012, 020, etc.) peuvent utiliser des mappages différents pour certains caractères et produire des résultats partiellement incorrects."
  },
  it: {
    title: "Convertitore da Krutidev a Unicode",
    meta_title: "Convertitore Online Gratuito da Krutidev a Unicode",
    meta: "Converti gratuitamente online il testo del font Krutidev in Unicode Devanagari. Compatibile con Krutidev 010. Risultato istantaneo, nessuna installazione richiesta.",
    desc: "Questo strumento converte in modo accurato il testo Krutidev in Unicode Devanagari, preservando consonanti, vocali, matra, congiunzioni e numeri. Il font Krutidev è stato per decenni lo standard di fatto per digitare in hindi in India, ampiamente utilizzato in documenti governativi, giornali e materiali stampati. Poiché si basa sulla mappatura ASCII, in cui ogni carattere latino rappresenta un glifo Devanagari, questo testo è illeggibile sui dispositivi moderni senza il font installato, non può essere indicizzato dai motori di ricerca e non funziona nei sistemi che prevedono Unicode. L'elaborazione viene eseguita interamente nel tuo browser, garantendo sicurezza e privacy.",
    input_label: "Testo Krutidev",
    input_placeholder: "Incolla qui il testo Krutidev...",
    output_label: "Unicode Devanagari",
    see1: "Da Unicode a Krutidev",
    see2: "Convertitore di Testo",
    see3: "Contatore di Testo",
    see4: "Convertitore di Codice Morse",
    features_title: "Caratteristiche",
    f_1: "Converte Krutidev 010 in Unicode Devanagari con supporto per congiunzioni e matra",
    f_2: "Riposiziona automaticamente i matra ikar (ि) e reph (र्) nel corretto ordine Unicode",
    how_to_use_title: "Come usare",
    step_1_title: "Incolla il testo Krutidev",
    step_1_desc: "Incolla il contenuto copiato da un documento con il font Krutidev nell'area di input. Il testo sembrerà formato da caratteri latini confusi.",
    step_2_title: "Guarda il risultato istantaneo",
    step_2_desc: "L'Unicode Devanagari viene generato automaticamente mentre incolli o digiti. Non è richiesto alcun clic sul pulsante.",
    step_3_title: "Copia l'Unicode",
    step_3_desc: "Fai clic sul pulsante di copia per copiare il testo Unicode. Funzionerà su qualsiasi sistema, editor o piattaforma senza richiedere font speciali.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Cos'è Krutidev?",
    faq_1_a: "Krutidev è una famiglia di font per digitare in hindi creata in India prima della standardizzazione Unicode. Funziona mappando i glifi dell'alfabeto Devanagari sulle posizioni dei caratteri ASCII, quindi il testo è leggibile solo se è installato il font corretto. La variante Krutidev 010 è la più diffusa ed è quella supportata da questo strumento.",
    faq_2_q: "Perché convertire Krutidev in Unicode?",
    faq_2_a: "Il testo Krutidev non è ricercabile, non funziona sui sistemi moderni senza il font installato e non può essere copiato in app come WhatsApp o Word senza rompersi. Unicode Devanagari è lo standard universale: funziona su qualsiasi dispositivo, browser e sistema operativo senza configurazioni aggiuntive.",
    faq_3_q: "La conversione è accurata?",
    faq_3_a: "Lo strumento è ottimizzato per Krutidev 010, la variante più utilizzata in documenti governativi, giornali e materiali stampati in India, e copre la stragrande maggioranza dei testi incontrati in pratica. Consonanti, vocali, matra, congiunzioni comuni e numeri vengono convertiti con elevata fedeltà. Altre varianti Krutidev (011, 012, 020, ecc.) potrebbero utilizzare mappature diverse per alcuni caratteri e produrre risultati parzialmente errati."
  },
  id: {
    title: "Konverter Krutidev ke Unicode",
    meta_title: "Konverter Krutidev ke Unicode Online Gratis",
    meta: "Konversi teks font Krutidev ke Unicode Devanagari secara online dan gratis. Kompatibel dengan Krutidev 010. Hasil instan, tanpa perlu instalasi.",
    desc: "Alat ini mengonversi teks Krutidev ke Unicode Devanagari secara akurat, mempertahankan konsonan, vokal, matra, konjungsi, dan angka. Font Krutidev telah menjadi standar de facto untuk mengetik bahasa Hindi di India selama beberapa dekade, digunakan secara luas dalam dokumen pemerintah, surat kabar, dan materi cetak. Karena berbasis pada pemetaan ASCII, di mana setiap karakter Latin mewakili mesin cetak Devanagari, teks ini tidak dapat dibaca di perangkat modern tanpa menginstal font tersebut, tidak dapat diindeks oleh mesin pencari, dan tidak berfungsi dalam sistem yang mengharapkan Unicode. Pemrosesan dilakukan seluruhnya di browser Anda, memastikan keamanan dan privasi.",
    input_label: "Teks Krutidev",
    input_placeholder: "Tempelkan teks Krutidev di sini...",
    output_label: "Unicode Devanagari",
    see1: "Unicode ke Krutidev",
    see2: "Konverter Teks",
    see3: "Penghitung Teks",
    see4: "Konverter Kode Morse",
    features_title: "Fitur",
    f_1: "Mengonversi Krutidev 010 ke Unicode Devanagari dengan dukungan konjungsi dan matra",
    f_2: "Secara otomatis mengatur ulang posisi matra ikar (ि) dan reph (र्) ke urutan Unicode yang benar",
    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Tempelkan teks Krutidev",
    step_1_desc: "Tempelkan konten yang disalin dari dokumen dengan font Krutidev ke dalam area masukan. Teks akan terlihat seperti karakter Latin yang acak.",
    step_2_title: "Lihat hasil instan",
    step_2_desc: "Unicode Devanagari dihasilkan secara otomatis saat Anda menempelkan atau mengetik. Tidak perlu mengeklik tombol apa pun.",
    step_3_title: "Salin Unicode",
    step_3_desc: "Klik tombol salin untuk menyalin teks Unicode. Ini akan berfungsi di sistem, editor, atau platform apa pun tanpa memerlukan font khusus.",
    faq_title: "Pertanyaan & Jawaban",
    faq_1_q: "Apa itu Krutidev?",
    faq_1_a: "Krutidev adalah keluarga font untuk mengetik bahasa Hindi yang dibuat di India sebelum standardisasi Unicode. Ini bekerja dengan memetakan mesin cetak alfabet Devanagari di atas posisi karakter ASCII, sehingga teks hanya dapat dibaca dengan font yang benar terinstal. Varian Krutidev 010 adalah yang paling tersebar luas dan merupakan yang didukung oleh alat ini.",
    faq_2_q: "Mengapa mengonversi Krutidev ke Unicode?",
    faq_2_a: "Teks Krutidev tidak dapat dicari, tidak berfungsi pada sistem modern tanpa menginstal font, dan tidak dapat disalin ke aplikasi seperti WhatsApp atau Word tanpa rusak. Unicode Devanagari adalah standar universal — ini berfungsi pada perangkat, browser, dan sistem operasi apa pun tanpa konfigurasi tambahan.",
    faq_3_q: "Apakah konversinya akurat?",
    faq_3_a: "Alat ini dioptimalkan untuk Krutidev 010, varian yang paling banyak digunakan dalam dokumen pemerintah, surat kabar, dan materi cetak di India, dan mencakup sebagian besar teks yang ditemui dalam praktiknya. Konsonan, vokal, matra, konjungsi umum, dan angka dikonversi dengan kesetiaan yang tinggi. Varian Krutidev lainnya (011, 012, 020, dll.) mungkin menggunakan pemetaan yang berbeda untuk beberapa karakter dan menghasilkan hasil yang sebagian salah."
  },
  de: {
    title: "Krutidev zu Unicode Konverter",
    meta_title: "Kostenloser Online Krutidev zu Unicode Konverter",
    meta: "Konvertieren Sie Krutidev-Schrifttexte kostenlos online in Unicode-Devanagari. Kompatibel mit Krutidev 010. Sofortiges Ergebnis, keine Installation erforderlich.",
    desc: "Dieses Tool konvertiert Krutidev-Text genau in Unicode-Devanagari und erhält dabei Konsonanten, Vokale, Matras, Konjunkte und Ziffern. Die Krutidev-Schrift ist seit Jahrzehnten der De-facto-Standard zum Tippen von Hindi in Indien und wird häufig in Regierungsdokumenten, Zeitungen und gedruckten Materialien verwendet. Da es auf einer ASCII-Zuordnung basiert, bei der jedes lateinische Zeichen eine Devanagari-Glyphe darstellt, ist dieser Text auf modernen Geräten ohne die installierte Schriftart unlesbar, kann nicht von Suchmaschinen indiziert werden und funktioniert nicht in Systemen, die Unicode erwarten. Die Verarbeitung erfolgt vollständig in Ihrem Browser, wodurch Sicherheit und Datenschutz gewährleistet werden.",
    input_label: "Krutidev Text",
    input_placeholder: "Krutidev-Text hier einfügen...",
    output_label: "Unicode Devanagari",
    see1: "Unicode zu Krutidev",
    see2: "Text Konverter",
    see3: "Textzähler",
    see4: "Morsecode Konverter",
    features_title: "Eigenschaften",
    f_1: "Konvertiert Krutidev 010 in Unicode Devanagari mit Unterstützung von Konjunkten und Matras",
    f_2: "Positioniert ikar (ि) und reph (र्) Matras automatisch in der richtigen Unicode-Reihenfolge neu",
    how_to_use_title: "Wie man es benutzt",
    step_1_title: "Fügen Sie den Krutidev-Text ein",
    step_1_desc: "Fügen Sie den aus einem Dokument mit Krutidev-Schriftart kopierten Inhalt in den Eingabebereich ein. Der Text sieht aus wie durcheinandergewürfelte lateinische Zeichen.",
    step_2_title: "Sehen Sie das sofortige Ergebnis",
    step_2_desc: "Unicode-Devanagari wird automatisch generiert, während Sie einfügen oder tippen. Ein Klick auf eine Schaltfläche ist nicht erforderlich.",
    step_3_title: "Kopieren Sie das Unicode",
    step_3_desc: "Klicken Sie auf die Schaltfläche Kopieren, um den Unicode-Text zu kopieren. Er funktioniert auf jedem System, Editor oder jeder Plattform, ohne dass spezielle Schriftarten erforderlich sind.",
    faq_title: "Fragen & Antworten",
    faq_1_q: "Was ist Krutidev?",
    faq_1_a: "Krutidev ist eine Schriftartenfamilie zum Tippen von Hindi, die in Indien vor der Unicode-Standardisierung entwickelt wurde. Sie funktioniert, indem Devanagari-Alphabet-Glyphen über ASCII-Zeichenpositionen abgebildet werden, sodass der Text nur gelesen werden kann, wenn die richtige Schriftart installiert ist. Die Variante Krutidev 010 ist am weitesten verbreitet und wird von diesem Tool unterstützt.",
    faq_2_q: "Warum Krutidev in Unicode konvertieren?",
    faq_2_a: "Krutidev-Text kann nicht durchsucht werden, funktioniert auf modernen Systemen ohne die installierte Schriftart nicht und kann nicht ohne Fehler in Apps wie WhatsApp oder Word kopiert werden. Unicode Devanagari ist der universelle Standard – es funktioniert auf jedem Gerät, in jedem Browser und in jedem Betriebssystem ohne zusätzliche Konfiguration.",
    faq_3_q: "Ist die Konvertierung genau?",
    faq_3_a: "Das Tool ist für Krutidev 010 optimiert, die am weitesten verbreitete Variante in Regierungsdokumenten, Zeitungen und Drucksachen in Indien, und deckt die überwiegende Mehrheit der in der Praxis anzutreffenden Texte ab. Konsonanten, Vokale, Matras, gebräuchliche Konjunkte und Ziffern werden mit hoher Genauigkeit konvertiert. Andere Krutidev-Varianten (011, 012, 020 usw.) verwenden möglicherweise andere Zuordnungen für einige Zeichen und erzeugen teilweise fehlerhafte Ergebnisse."
  },
  nl: {
    title: "Krutidev naar Unicode Converter",
    meta_title: "Gratis Online Krutidev naar Unicode Converter",
    meta: "Converteer gratis online tekst in het Krutidev lettertype naar Unicode Devanagari. Compatibel met Krutidev 010. Direct resultaat, geen installatie vereist.",
    desc: "Deze tool converteert Krutidev tekst nauwkeurig naar Unicode Devanagari, met behoud van medeklinkers, klinkers, matra's, conjuncten en cijfers. Het Krutidev lettertype is al tientallen jaren de de facto standaard voor het typen van Hindi in India en wordt veel gebruikt in overheidsdocumenten, kranten en gedrukt materiaal. Omdat het gebaseerd is op ASCII-mapping, waarbij elk Latijns teken een Devanagari glief vertegenwoordigt, is deze tekst onleesbaar op moderne apparaten zonder dat het lettertype is geïnstalleerd, kan het niet door zoekmachines worden geïndexeerd en werkt het niet in systemen die Unicode verwachten. De verwerking vindt volledig in uw browser plaats, wat veiligheid en privacy garandeert.",
    input_label: "Krutidev Tekst",
    input_placeholder: "Plak hier de Krutidev tekst...",
    output_label: "Unicode Devanagari",
    see1: "Unicode naar Krutidev",
    see2: "Tekst Converter",
    see3: "Tekst Teller",
    see4: "Morsecode Converter",
    features_title: "Functies",
    f_1: "Converteert Krutidev 010 naar Unicode Devanagari met ondersteuning voor conjuncten en matra's",
    f_2: "Verplaatst ikar (ि) en reph (र्) matra's automatisch naar de juiste Unicode-volgorde",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Plak de Krutidev tekst",
    step_1_desc: "Plak de inhoud die is gekopieerd uit een document met het Krutidev lettertype in het invoergebied. De tekst zal eruitzien als door elkaar gegooide Latijnse tekens.",
    step_2_title: "Bekijk het directe resultaat",
    step_2_desc: "Unicode Devanagari wordt automatisch gegenereerd terwijl u plakt of typt. U hoeft op geen enkele knop te klikken.",
    step_3_title: "Kopieer de Unicode",
    step_3_desc: "Klik op de kopieerknop om de Unicode tekst te kopiëren. Het werkt op elk systeem, elke editor of elk platform zonder dat speciale lettertypen nodig zijn.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is Krutidev?",
    faq_1_a: "Krutidev is een familie van lettertypen voor het typen van Hindi, gecreëerd in India vóór de standaardisatie van Unicode. Het werkt door Devanagari alfabe gliefen te mappen over ASCII-tekenposities, dus de tekst is alleen leesbaar als het juiste lettertype is geïnstalleerd. De variant Krutidev 010 is de meest wijdverspreide en degene die door deze tool wordt ondersteund.",
    faq_2_q: "Waarom Krutidev naar Unicode converteren?",
    faq_2_a: "Krutidev tekst is niet doorzoekbaar, werkt niet op moderne systemen zonder dat het lettertype is geïnstalleerd en kan niet worden gekopieerd naar apps zoals WhatsApp of Word zonder kapot te gaan. Unicode Devanagari is de universele standaard — het werkt op elk apparaat, in elke browser en in elk besturingssysteem zonder extra configuratie.",
    faq_3_q: "Is de conversie nauwkeurig?",
    faq_3_a: "De tool is geoptimaliseerd voor Krutidev 010, de meest gebruikte variant in overheidsdocumenten, kranten en gedrukt materiaal in India, en dekt de overgrote meerderheid van de teksten die in de praktijk worden aangetroffen. Medeklinkers, klinkers, matra's, veelvoorkomende conjuncten en cijfers worden met hoge nauwkeurigheid geconverteerd. Andere Krutidev-varianten (011, 012, 020, enz.) kunnen voor sommige tekens verschillende mappings gebruiken en gedeeltelijk onjuiste resultaten opleveren."
  },
  ru: {
    title: "Конвертер Krutidev в Unicode",
    meta_title: "Бесплатный онлайн-конвертер Krutidev в Unicode",
    meta: "Бесплатно конвертируйте текст шрифта Krutidev в Unicode Devanagari онлайн. Совместимо с Krutidev 010. Мгновенный результат, установка не требуется.",
    desc: "Этот инструмент точно преобразует текст Krutidev в Unicode Devanagari, сохраняя согласные, гласные, матры, конъюнкты и цифры. Шрифт Krutidev на протяжении десятилетий был стандартом де-факто для набора текста на хинди в Индии, широко используясь в правительственных документах, газетах и печатных материалах. Поскольку он основан на сопоставлении ASCII, где каждый латинский символ представляет глиф деванагари, этот текст нечитаем на современных устройствах без установленного шрифта, не может быть проиндексирован поисковыми системами и не работает в системах, ожидающих Unicode. Обработка выполняется полностью в вашем браузере, обеспечивая безопасность и конфиденциальность.",
    input_label: "Текст Krutidev",
    input_placeholder: "Вставьте текст Krutidev сюда...",
    output_label: "Unicode Devanagari",
    see1: "Конвертер Unicode в Krutidev",
    see2: "Конвертер текста",
    see3: "Счетчик текста",
    see4: "Конвертер азбуки Морзе",
    features_title: "Особенности",
    f_1: "Преобразует Krutidev 010 в Unicode Devanagari с поддержкой конъюнктов и матра",
    f_2: "Автоматически изменяет положение матр икар (ि) и реф (र्) на правильный порядок Unicode",
    how_to_use_title: "Как использовать",
    step_1_title: "Вставьте текст Krutidev",
    step_1_desc: "Вставьте содержимое, скопированное из документа со шрифтом Krutidev, в область ввода. Текст будет выглядеть как перепутанные латинские символы.",
    step_2_title: "Смотрите мгновенный результат",
    step_2_desc: "Unicode Devanagari генерируется автоматически по мере вставки или ввода. Никаких нажатий кнопок не требуется.",
    step_3_title: "Скопируйте Unicode",
    step_3_desc: "Нажмите кнопку копирования, чтобы скопировать текст Unicode. Он будет работать в любой системе, редакторе или платформе без использования специальных шрифтов.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Что такое Krutidev?",
    faq_1_a: "Krutidev - это семейство шрифтов для набора текста на хинди, созданное в Индии до стандартизации Unicode. Он работает путем наложения глифов алфавита деванагари на позиции символов ASCII, поэтому текст читается только при наличии правильного шрифта. Вариант Krutidev 010 является наиболее распространенным и поддерживается этим инструментом.",
    faq_2_q: "Зачем конвертировать Krutidev в Unicode?",
    faq_2_a: "Текст Krutidev не доступен для поиска, не работает на современных системах без установленного шрифта и не может быть скопирован в такие приложения, как WhatsApp или Word, без искажений. Unicode Devanagari — универсальный стандарт, работающий на любом устройстве, в любом браузере и операционной системе без дополнительной настройки.",
    faq_3_q: "Точно ли преобразование?",
    faq_3_a: "Инструмент оптимизирован для Krutidev 010, наиболее широко используемого варианта в правительственных документах, газетах и печатных материалах в Индии, и охватывает подавляющее большинство текстов, встречающихся на практике. Согласные, гласные, матры, распространенные конъюнкты и цифры конвертируются с высокой точностью. Другие варианты Krutidev (011, 012, 020 и т.д.) могут использовать другие сопоставления для некоторых символов и выдавать частично неверные результаты."
  }
}
</i18n>
