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

const output = computed(() => unicodeToKrutidev(input.value))

defineI18nRoute({
  paths: {
    en: '/unicode-to-krutidev',
    pt: '/unicode-para-krutidev',
    es: '/unicode-a-krutidev',
    fr: '/unicode-en-krutidev',
    it: '/unicode-in-krutidev',
    id: '/unicode-ke-krutidev',
    de: '/unicode-zu-krutidev',
    nl: '/unicode-naar-krutidev',
    ru: '/unicode-v-krutidev',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!output"
    :see-also-links="[
      { label: t('see1'), to: 'krutidev-to-unicode' },
      { label: t('see2'), to: 'text-converter' },
      { label: t('see3'), to: 'morse-code-converter' },
      { label: t('see4'), to: 'text-counter' },
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
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-lg leading-relaxed"
          :placeholder="t('input_placeholder')"
          autofocus
          dir="ltr"
          lang="hi"
        />
      </div>

      <!-- Output -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="output" class="space-y-2">
          <Blockcopy :label="t('output_label')" :content="output">
            <div class="whitespace-pre-wrap font-mono text-lg leading-relaxed break-all">
              {{ output }}
            </div>
          </Blockcopy>
          <p class="text-sm text-base-content/50 px-1">{{ t('output_note') }}</p>
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
    title: "Unicode to Krutidev Converter",
    meta_title: "Free Online Unicode to Krutidev Converter",
    meta: "Convert Unicode Devanagari text to Krutidev 010 font online for free. Ideal for generating content compatible with legacy systems, printing, and documents requiring Krutidev.",
    desc: "This tool converts Unicode Devanagari text to Krutidev 010 encoding, allowing the result to be pasted directly into any software or document that uses the Krutidev font. Although Unicode is the modern standard for Hindi, many legacy systems, publishing software, and industrial printers in India still operate exclusively with Krutidev. The conversion automatically repositions the ikar (ि) and reph (र्) to the correct encoding order of the font. Processing is done entirely in your browser, ensuring security and privacy.",
    input_label: "Unicode Devanagari Text",
    input_placeholder: "Paste Unicode Hindi text here...",
    output_label: "Krutidev Result",
    see1: "Krutidev to Unicode",
    see2: "Text Converter",
    see3: "Morse Code Converter",
    see4: "Text Counter",
    features_title: "Features",
    f_1: "Converts Unicode Devanagari to Krutidev 010 with conjunct and matra support",
    f_2: "Automatically repositions ikar (ि) and reph (र्) to the Krutidev encoding order",
    how_to_use_title: "How to Use",
    step_1_title: "Paste the Unicode text",
    step_1_desc: "Paste the Unicode Devanagari Hindi text into the input area.",
    step_2_title: "Check the result",
    step_2_desc: "The Krutidev text is generated automatically as you type or paste the content.",
    output_note: "If the Krutidev font is not installed on the device, the result will look like Latin characters — expected behavior for this encoding.",
    step_3_title: "Copy the result",
    step_3_desc: "Click the copy button and paste it directly into the target software or document.",
    faq_title: "Questions & Answers",
    faq_1_q: "The result looks like scrambled characters, what should I do?",
    faq_1_a: "This happens because the Krutidev font is not installed on the device. The text is correct. Simply paste it into the target software with the Krutidev 010 font applied for the Devanagari to appear correctly.",
    faq_2_q: "When do I need to convert Unicode to Krutidev?",
    faq_2_a: "This conversion is necessary when working with older Indian publishing software, industrial printers that only support Krutidev, legacy government documents, or any system that hasn't been upgraded to Unicode.",
    faq_3_q: "Is the conversion accurate?",
    faq_3_a: "The tool is optimized for Krutidev 010, the most widely used variant, and covers the vast majority of Hindi texts encountered in practice. Consonants, vowels, matras, common conjuncts, and numerals are converted with high fidelity. If the destination is a system using another Krutidev variant (011, 012, 020, etc.), some characters might map differently — in those cases, apply the Krutidev 010 font to the result to verify visual fidelity."
  },
  pt: {
    title: "Conversor de Unicode para Krutidev",
    meta_title: "Conversor de Unicode para Krutidev Online Grátis",
    meta: "Converta texto Unicode Devanagari para a fonte Krutidev 010 online e gratuitamente. Ideal para gerar conteúdo compatível com sistemas legados, impressão e documentos que exigem Krutidev.",
    desc: "Esta ferramenta converte texto Unicode Devanagari para o encoding Krutidev 010, permitindo que o resultado seja colado diretamente em qualquer software ou documento que utilize a fonte Krutidev. Embora o Unicode seja o padrão moderno para Hindi, muitos sistemas legados, softwares de publicação e impressoras industriais na Índia ainda operam exclusivamente com Krutidev. A conversão reposiciona automaticamente o ikar (ि) e o reph (र्) para a ordem correta de codificação da fonte.  O processamento é realizado inteiramente em seu navegador, garantindo segurança e privacidade.",
    input_label: "Texto Unicode Devanagari",
    input_placeholder: "Cole aqui o texto em Hindi Unicode...",
    output_label: "Resultado em Krutidev",
    see1: "Krutidev para Unicode",
    see2: "Conversor de Texto",
    see3: "Conversor de Morse",
    see4: "Contador de Texto",
    features_title: "Funcionalidades",
    f_1: "Converte Unicode Devanagari para Krutidev 010 com suporte a conjuntas e matras",
    f_2: "Reposiciona automaticamente ikar (ि) e reph (र्) para a ordem de codificação Krutidev",
    how_to_use_title: "Como usar",
    step_1_title: "Cole o texto Unicode",
    step_1_desc: "Cole o texto em Hindi Unicode Devanagari na área de entrada.",
    step_2_title: "Confira o resultado",
    step_2_desc: "O texto Krutidev é gerado automaticamente à medida que você digita ou cola o conteúdo.",
    output_note: "Caso a fonte Krutidev não esteja instalada no dispositivo, o resultado parecerá caracteres latinos — comportamento esperado do encoding.",
    step_3_title: "Copie o resultado",
    step_3_desc: "Clique no botão de cópia e cole diretamente no software ou documento de destino.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O resultado aparece como caracteres embaralhados, o que fazer?",
    faq_1_a: "Isso acontece porque a fonte Krutidev não está instalada no dispositivo. O texto está correto. Basta colá-lo no software de destino com a fonte Krutidev 010 aplicada para que o Devanagari apareça corretamente.",
    faq_2_q: "Quando preciso converter Unicode para Krutidev?",
    faq_2_a: "Essa conversão é necessária ao trabalhar com softwares de publicação indianos mais antigos, impressoras industriais que só suportam Krutidev, documentos governamentais legados ou qualquer sistema que não tenha sido atualizado para Unicode.",
    faq_3_q: "A conversão é precisa?",
    faq_3_a: "A ferramenta é otimizada para Krutidev 010, a variante mais amplamente usada, e cobre a grande maioria dos textos Hindi encontrados na prática. Consoantes, vogais, matras, conjuntas comuns e numerais são convertidos com alta fidelidade. Se o destino for um sistema que use outra variante da fonte Krutidev (011, 012, 020 etc.), alguns caracteres podem ser mapeados de forma diferente — nesses casos, aplique a fonte Krutidev 010 ao resultado para verificar a fidelidade visual."
  },
  es: {
    title: "Conversor de Unicode a Krutidev",
    meta_title: "Conversor de Unicode a Krutidev en Línea Gratis",
    meta: "Convierte texto Unicode Devanagari a fuente Krutidev 010 en línea gratis. Ideal para generar contenido compatible con sistemas heredados, impresión y documentos que requieren Krutidev.",
    desc: "Esta herramienta convierte el texto Unicode Devanagari a la codificación Krutidev 010, permitiendo que el resultado se pegue directamente en cualquier software o documento que utilice la fuente Krutidev. Aunque Unicode es el estándar moderno para el hindi, muchos sistemas heredados, software de publicación e impresoras industriales en la India todavía operan exclusivamente con Krutidev. La conversión reposiciona automáticamente el ikar (ि) y reph (र्) al orden de codificación correcto de la fuente. El procesamiento se realiza completamente en su navegador, garantizando seguridad y privacidad.",
    input_label: "Texto Unicode Devanagari",
    input_placeholder: "Pega el texto en hindi Unicode aquí...",
    output_label: "Resultado en Krutidev",
    see1: "Krutidev a Unicode",
    see2: "Conversor de Texto",
    see3: "Conversor de Código Morse",
    see4: "Contador de Texto",
    features_title: "Características",
    f_1: "Convierte Unicode Devanagari a Krutidev 010 con soporte para conjuntas y matras",
    f_2: "Reposiciona automáticamente el ikar (ि) y reph (र्) al orden de codificación de Krutidev",
    how_to_use_title: "Cómo Usar",
    step_1_title: "Pega el texto Unicode",
    step_1_desc: "Pega el texto hindi Unicode Devanagari en el área de entrada.",
    step_2_title: "Revisa el resultado",
    step_2_desc: "El texto en Krutidev se genera automáticamente a medida que escribes o pegas el contenido.",
    output_note: "Si la fuente Krutidev no está instalada en el dispositivo, el resultado se verá como caracteres latinos — comportamiento esperado para esta codificación.",
    step_3_title: "Copia el resultado",
    step_3_desc: "Haz clic en el botón de copiar y pégalo directamente en el software o documento de destino.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "El resultado se ve como caracteres mezclados, ¿qué debo hacer?",
    faq_1_a: "Esto sucede porque la fuente Krutidev no está instalada en el dispositivo. El texto es correcto. Simplemente pégalo en el software de destino con la fuente Krutidev 010 aplicada para que el devanagari aparezca correctamente.",
    faq_2_q: "¿Cuándo necesito convertir Unicode a Krutidev?",
    faq_2_a: "Esta conversión es necesaria cuando se trabaja con software de publicación indio antiguo, impresoras industriales que solo admiten Krutidev, documentos gubernamentales heredados o cualquier sistema que no se haya actualizado a Unicode.",
    faq_3_q: "¿Es precisa la conversión?",
    faq_3_a: "La herramienta está optimizada para Krutidev 010, la variante más utilizada, y cubre la gran mayoría de los textos en hindi que se encuentran en la práctica. Consonantes, vocales, matras, conjuntas comunes y números se convierten con alta fidelidad. Si el destino es un sistema que utiliza otra variante de Krutidev (011, 012, 020, etc.), algunos caracteres pueden asignarse de manera diferente — en esos casos, aplica la fuente Krutidev 010 al resultado para verificar la fidelidad visual."
  },
  fr: {
    title: "Convertisseur d'Unicode en Krutidev",
    meta_title: "Convertisseur d'Unicode en Krutidev en Ligne Gratuit",
    meta: "Convertissez gratuitement en ligne du texte Unicode Devanagari en police Krutidev 010. Idéal pour générer du contenu compatible avec les anciens systèmes, l'impression et les documents nécessitant Krutidev.",
    desc: "Cet outil convertit le texte Unicode Devanagari vers l'encodage Krutidev 010, permettant de coller directement le résultat dans n'importe quel logiciel ou document utilisant la police Krutidev. Bien que l'Unicode soit la norme moderne pour le hindi, de nombreux anciens systèmes, logiciels de publication et imprimantes industrielles en Inde fonctionnent encore exclusivement avec Krutidev. La conversion repositionne automatiquement le ikar (ि) et reph (र्) dans le bon ordre d'encodage de la police. Le traitement est entièrement effectué dans votre navigateur, garantissant sécurité et confidentialité.",
    input_label: "Texte Unicode Devanagari",
    input_placeholder: "Collez le texte hindi Unicode ici...",
    output_label: "Résultat Krutidev",
    see1: "Krutidev en Unicode",
    see2: "Convertisseur de Texte",
    see3: "Convertisseur de Code Morse",
    see4: "Compteur de Texte",
    features_title: "Caractéristiques",
    f_1: "Convertit l'Unicode Devanagari en Krutidev 010 avec prise en charge des conjonctions et des matras",
    f_2: "Repositionne automatiquement ikar (ि) et reph (र्) dans l'ordre d'encodage Krutidev",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Collez le texte Unicode",
    step_1_desc: "Collez le texte hindi Unicode Devanagari dans la zone de saisie.",
    step_2_title: "Vérifiez le résultat",
    step_2_desc: "Le texte Krutidev est généré automatiquement au fur et à mesure que vous tapez ou collez le contenu.",
    output_note: "Si la police Krutidev n'est pas installée sur l'appareil, le résultat ressemblera à des caractères latins — un comportement normal pour cet encodage.",
    step_3_title: "Copiez le résultat",
    step_3_desc: "Cliquez sur le bouton de copie et collez-le directement dans le logiciel ou le document cible.",
    faq_title: "Questions & Réponses",
    faq_1_q: "Le résultat ressemble à des caractères brouillés, que dois-je faire ?",
    faq_1_a: "Cela se produit car la police Krutidev n'est pas installée sur l'appareil. Le texte est correct. Il suffit de le coller dans le logiciel cible avec la police Krutidev 010 appliquée pour que le Devanagari apparaisse correctement.",
    faq_2_q: "Quand dois-je convertir l'Unicode en Krutidev ?",
    faq_2_a: "Cette conversion est nécessaire lorsque vous travaillez avec d'anciens logiciels de publication indiens, des imprimantes industrielles ne prenant en charge que Krutidev, des documents gouvernementaux d'archives ou tout système n'ayant pas été mis à jour vers Unicode.",
    faq_3_q: "La conversion est-elle précise ?",
    faq_3_a: "L'outil est optimisé pour Krutidev 010, la variante la plus utilisée, et couvre la grande majorité des textes hindi rencontrés en pratique. Consonnes, voyelles, matras, conjonctions courantes et chiffres sont convertis avec une grande fidélité. Si la destination est un système utilisant une autre variante de Krutidev (011, 012, 020, etc.), certains caractères peuvent être mappés différemment — dans ce cas, appliquez la police Krutidev 010 au résultat pour vérifier la fidélité visuelle."
  },
  it: {
    title: "Convertitore da Unicode a Krutidev",
    meta_title: "Convertitore Online Gratuito da Unicode a Krutidev",
    meta: "Converti gratuitamente online il testo Unicode Devanagari nel font Krutidev 010. Ideale per generare contenuti compatibili con sistemi legacy, stampe e documenti che richiedono Krutidev.",
    desc: "Questo strumento converte il testo Unicode Devanagari nella codifica Krutidev 010, consentendo di incollare il risultato direttamente in qualsiasi software o documento che utilizzi il font Krutidev. Sebbene Unicode sia lo standard moderno per l'hindi, molti sistemi legacy, software di pubblicazione e stampanti industriali in India operano ancora esclusivamente con Krutidev. La conversione riposiziona automaticamente l'ikar (ि) e il reph (र्) nel corretto ordine di codifica del font. L'elaborazione viene eseguita interamente nel tuo browser, garantendo sicurezza e privacy.",
    input_label: "Testo Unicode Devanagari",
    input_placeholder: "Incolla qui il testo hindi Unicode...",
    output_label: "Risultato Krutidev",
    see1: "Da Krutidev a Unicode",
    see2: "Convertitore di Testo",
    see3: "Convertitore di Codice Morse",
    see4: "Contatore di Testo",
    features_title: "Caratteristiche",
    f_1: "Converte Unicode Devanagari in Krutidev 010 con supporto per congiunzioni e matra",
    f_2: "Riposiziona automaticamente ikar (ि) e reph (र्) nell'ordine di codifica Krutidev",
    how_to_use_title: "Come usare",
    step_1_title: "Incolla il testo Unicode",
    step_1_desc: "Incolla il testo hindi Unicode Devanagari nell'area di input.",
    step_2_title: "Controlla il risultato",
    step_2_desc: "Il testo Krutidev viene generato automaticamente mentre digiti o incolli il contenuto.",
    output_note: "Se il font Krutidev non è installato sul dispositivo, il risultato sembrerà formato da caratteri latini: comportamento previsto per questa codifica.",
    step_3_title: "Copia il risultato",
    step_3_desc: "Fai clic sul pulsante di copia e incollalo direttamente nel software o documento di destinazione.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Il risultato sembra caratteri confusi, cosa devo fare?",
    faq_1_a: "Questo accade perché il font Krutidev non è installato sul dispositivo. Il testo è corretto. Basta incollarlo nel software di destinazione applicando il font Krutidev 010 affinché il Devanagari venga visualizzato correttamente.",
    faq_2_q: "Quando devo convertire da Unicode a Krutidev?",
    faq_2_a: "Questa conversione è necessaria quando si lavora con software di pubblicazione indiani più vecchi, stampanti industriali che supportano solo Krutidev, documenti governativi legacy o qualsiasi sistema che non sia stato aggiornato a Unicode.",
    faq_3_q: "La conversione è accurata?",
    faq_3_a: "Lo strumento è ottimizzato per Krutidev 010, la variante più utilizzata, e copre la stragrande maggioranza dei testi in hindi che si incontrano in pratica. Consonanti, vocali, matra, congiunzioni comuni e numeri vengono convertiti con un'elevata fedeltà. Se la destinazione è un sistema che utilizza un'altra variante Krutidev (011, 012, 020, ecc.), alcuni caratteri potrebbero essere mappati in modo diverso: in questi casi, applica il font Krutidev 010 al risultato per verificare la fedeltà visiva."
  },
  id: {
    title: "Konverter Unicode ke Krutidev",
    meta_title: "Konverter Unicode ke Krutidev Online Gratis",
    meta: "Konversi teks Unicode Devanagari ke font Krutidev 010 secara online dan gratis. Ideal untuk menghasilkan konten yang kompatibel dengan sistem warisan, pencetakan, dan dokumen yang memerlukan Krutidev.",
    desc: "Alat ini mengonversi teks Unicode Devanagari ke pengodean Krutidev 010, memungkinkan hasil untuk ditempelkan secara langsung ke perangkat lunak atau dokumen apa pun yang menggunakan font Krutidev. Meskipun Unicode adalah standar modern untuk bahasa Hindi, banyak sistem warisan, perangkat lunak penerbitan, dan printer industri di India masih beroperasi secara eksklusif dengan Krutidev. Konversi tersebut secara otomatis mengatur ulang ikar (ि) dan reph (र्) ke urutan pengodean font yang benar. Pemrosesan dilakukan seluruhnya di browser Anda, memastikan keamanan dan privasi.",
    input_label: "Teks Unicode Devanagari",
    input_placeholder: "Tempelkan teks Hindi Unicode di sini...",
    output_label: "Hasil Krutidev",
    see1: "Krutidev ke Unicode",
    see2: "Konverter Teks",
    see3: "Konverter Kode Morse",
    see4: "Penghitung Teks",
    features_title: "Fitur",
    f_1: "Mengonversi Unicode Devanagari ke Krutidev 010 dengan dukungan konjungsi dan matra",
    f_2: "Secara otomatis mengatur ulang posisi ikar (ि) dan reph (र्) ke urutan pengodean Krutidev",
    how_to_use_title: "Cara Menggunakan",
    step_1_title: "Tempelkan teks Unicode",
    step_1_desc: "Tempelkan teks Hindi Unicode Devanagari ke area masukan.",
    step_2_title: "Periksa hasil",
    step_2_desc: "Teks Krutidev dihasilkan secara otomatis saat Anda mengetik atau menempelkan konten.",
    output_note: "Jika font Krutidev tidak diinstal pada perangkat, hasilnya akan terlihat seperti karakter Latin — perilaku yang diharapkan untuk pengodean ini.",
    step_3_title: "Salin hasil",
    step_3_desc: "Klik tombol salin dan tempelkan langsung ke perangkat lunak atau dokumen target.",
    faq_title: "Pertanyaan & Jawaban",
    faq_1_q: "Hasilnya terlihat seperti karakter acak, apa yang harus saya lakukan?",
    faq_1_a: "Ini terjadi karena font Krutidev tidak diinstal pada perangkat. Teksnya benar. Cukup tempelkan ke perangkat lunak target dengan menerapkan font Krutidev 010 agar Devanagari muncul dengan benar.",
    faq_2_q: "Kapan saya perlu mengonversi Unicode ke Krutidev?",
    faq_2_a: "Konversi ini diperlukan saat bekerja dengan perangkat lunak penerbitan India lama, printer industri yang hanya mendukung Krutidev, dokumen pemerintah warisan, atau sistem apa pun yang belum ditingkatkan ke Unicode.",
    faq_3_q: "Apakah konversinya akurat?",
    faq_3_a: "Alat ini dioptimalkan untuk Krutidev 010, varian yang paling banyak digunakan, dan mencakup sebagian besar teks Hindi yang ditemui dalam praktik. Konsonan, vokal, matra, konjungsi umum, dan angka dikonversi dengan ketelitian tinggi. Jika tujuannya adalah sistem yang menggunakan varian Krutidev lain (011, 012, 020, dll.), beberapa karakter mungkin dipetakan secara berbeda — dalam kasus tersebut, terapkan font Krutidev 010 ke hasil untuk memverifikasi ketepatan visual."
  },
  de: {
    title: "Unicode zu Krutidev Konverter",
    meta_title: "Kostenloser Online Unicode zu Krutidev Konverter",
    meta: "Konvertieren Sie Unicode-Devanagari-Text kostenlos online in die Schriftart Krutidev 010. Ideal zum Generieren von Inhalten, die mit Altsystemen, beim Drucken und für Dokumente, die Krutidev erfordern, kompatibel sind.",
    desc: "Dieses Tool konvertiert Unicode-Devanagari-Text in die Krutidev 010-Codierung, sodass das Ergebnis direkt in jede Software oder jedes Dokument eingefügt werden kann, das die Krutidev-Schriftart verwendet. Obwohl Unicode der moderne Standard für Hindi ist, arbeiten viele ältere Systeme, Publishing-Software und Industriedrucker in Indien immer noch ausschließlich mit Krutidev. Die Konvertierung positioniert das ikar (ि) und reph (र्) automatisch in die richtige Kodierungsreihenfolge der Schriftart. Die Verarbeitung erfolgt vollständig in Ihrem Browser und gewährleistet Sicherheit und Datenschutz.",
    input_label: "Unicode Devanagari Text",
    input_placeholder: "Fügen Sie hier den Unicode-Hindi-Text ein...",
    output_label: "Krutidev-Ergebnis",
    see1: "Krutidev zu Unicode",
    see2: "Text Konverter",
    see3: "Morsecode Konverter",
    see4: "Textzähler",
    features_title: "Eigenschaften",
    f_1: "Konvertiert Unicode-Devanagari in Krutidev 010 mit Unterstützung für Konjunkt und Matra",
    f_2: "Positioniert ikar (ि) und reph (र्) automatisch in der Krutidev-Kodierungsreihenfolge neu",
    how_to_use_title: "Wie man es benutzt",
    step_1_title: "Fügen Sie den Unicode-Text ein",
    step_1_desc: "Fügen Sie den Hindi-Text in Unicode-Devanagari in den Eingabebereich ein.",
    step_2_title: "Überprüfen Sie das Ergebnis",
    step_2_desc: "Der Krutidev-Text wird automatisch generiert, während Sie tippen oder den Inhalt einfügen.",
    output_note: "Wenn die Krutidev-Schriftart nicht auf dem Gerät installiert ist, sieht das Ergebnis wie lateinische Zeichen aus – das erwartete Verhalten für diese Kodierung.",
    step_3_title: "Kopieren Sie das Ergebnis",
    step_3_desc: "Klicken Sie auf die Schaltfläche Kopieren und fügen Sie es direkt in die Zielsoftware oder das Dokument ein.",
    faq_title: "Fragen & Antworten",
    faq_1_q: "Das Ergebnis sieht wie durcheinandergewürfelte Zeichen aus, was soll ich tun?",
    faq_1_a: "Dies liegt daran, dass die Krutidev-Schriftart nicht auf dem Gerät installiert ist. Der Text ist korrekt. Fügen Sie ihn einfach in die Zielsoftware ein, auf die die Krutidev 010-Schriftart angewendet wurde, damit das Devanagari korrekt angezeigt wird.",
    faq_2_q: "Wann muss ich Unicode in Krutidev konvertieren?",
    faq_2_a: "Diese Konvertierung ist erforderlich, wenn Sie mit älterer indischer Publishing-Software, Industriedruckern, die nur Krutidev unterstützen, alten Regierungsdokumenten oder anderen Systemen arbeiten, die nicht auf Unicode aktualisiert wurden.",
    faq_3_q: "Ist die Konvertierung genau?",
    faq_3_a: "Das Tool ist für Krutidev 010 optimiert, die am weitesten verbreitete Variante, und deckt die große Mehrheit der in der Praxis vorkommenden Hindi-Texte ab. Konsonanten, Vokale, Matras, gebräuchliche Konjunkte und Ziffern werden originalgetreu konvertiert. Wenn das Ziel ein System ist, das eine andere Krutidev-Variante verwendet (011, 012, 020 usw.), werden einige Zeichen möglicherweise anders abgebildet – wenden Sie in diesen Fällen die Krutidev 010-Schriftart auf das Ergebnis an, um die visuelle Wiedergabetreue zu überprüfen."
  },
  nl: {
    title: "Unicode naar Krutidev Converter",
    meta_title: "Gratis Online Unicode naar Krutidev Converter",
    meta: "Converteer gratis online Unicode Devanagari tekst naar het Krutidev 010 lettertype. Ideaal voor het genereren van inhoud die compatibel is met oudere systemen, afdrukken en documenten die Krutidev vereisen.",
    desc: "Deze tool converteert Unicode Devanagari tekst naar de Krutidev 010 codering, waardoor het resultaat direct in elke software of elk document kan worden geplakt dat het Krutidev lettertype gebruikt. Hoewel Unicode de moderne standaard is voor Hindi, werken veel verouderde systemen, publicatiesoftware en industriële printers in India nog steeds uitsluitend met Krutidev. De conversie herpositioneert automatisch de ikar (ि) en reph (र्) naar de juiste coderingsvolgorde van het lettertype. De verwerking gebeurt volledig in uw browser, wat veiligheid en privacy garandeert.",
    input_label: "Unicode Devanagari Tekst",
    input_placeholder: "Plak hier Unicode Hindi tekst...",
    output_label: "Krutidev Resultaat",
    see1: "Krutidev naar Unicode",
    see2: "Tekst Converter",
    see3: "Morsecode Converter",
    see4: "Tekst Teller",
    features_title: "Functies",
    f_1: "Converteert Unicode Devanagari naar Krutidev 010 met ondersteuning voor conjunct en matra",
    f_2: "Herpositioneert automatisch ikar (ि) en reph (र्) naar de Krutidev coderingsvolgorde",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Plak de Unicode tekst",
    step_1_desc: "Plak de Unicode Devanagari Hindi tekst in het invoergebied.",
    step_2_title: "Controleer het resultaat",
    step_2_desc: "De Krutidev tekst wordt automatisch gegenereerd terwijl u typt of de inhoud plakt.",
    output_note: "Als het Krutidev lettertype niet op het apparaat is geïnstalleerd, ziet het resultaat eruit als Latijnse tekens — verwacht gedrag voor deze codering.",
    step_3_title: "Kopieer het resultaat",
    step_3_desc: "Klik op de kopieerknop en plak het direct in de doelsoftware of het doeldocument.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Het resultaat ziet eruit als door elkaar gegooide tekens, wat moet ik doen?",
    faq_1_a: "Dit gebeurt omdat het Krutidev lettertype niet op het apparaat is geïnstalleerd. De tekst is correct. Plak het gewoon in de doelsoftware waarop het Krutidev 010 lettertype is toegepast om de Devanagari correct weer te geven.",
    faq_2_q: "Wanneer moet ik Unicode naar Krutidev converteren?",
    faq_2_a: "Deze conversie is nodig bij het werken met oudere Indiase publicatiesoftware, industriële printers die alleen Krutidev ondersteunen, verouderde overheidsdocumenten of elk systeem dat niet is geüpgraded naar Unicode.",
    faq_3_q: "Is de conversie nauwkeurig?",
    faq_3_a: "De tool is geoptimaliseerd voor Krutidev 010, de meest gebruikte variant, en bestrijkt de overgrote meerderheid van Hindi teksten die in de praktijk voorkomen. Medeklinkers, klinkers, matra's, veelvoorkomende conjuncten en cijfers worden zeer natuurgetrouw geconverteerd. Als de bestemming een systeem is dat een andere Krutidev-variant gebruikt (011, 012, 020, enz.), kunnen sommige tekens anders in kaart worden gebracht — pas in dat geval het Krutidev 010 lettertype toe op het resultaat om de visuele getrouwheid te verifiëren."
  },
  ru: {
    title: "Конвертер Unicode в Krutidev",
    meta_title: "Бесплатный онлайн-конвертер Unicode в Krutidev",
    meta: "Бесплатно конвертируйте текст Unicode Devanagari в шрифт Krutidev 010 онлайн. Идеально подходит для создания контента, совместимого со старыми системами, печати и документов, требующих Krutidev.",
    desc: "Этот инструмент преобразует текст Unicode Devanagari в кодировку Krutidev 010, позволяя вставлять результат непосредственно в любое программное обеспечение или документ, использующий шрифт Krutidev. Хотя Unicode является современным стандартом для хинди, многие устаревшие системы, издательское программное обеспечение и промышленные принтеры в Индии по-прежнему работают исключительно с Krutidev. Преобразование автоматически перемещает икар (ि) и реф (र्) в правильный порядок кодировки шрифта. Обработка выполняется полностью в вашем браузере, обеспечивая безопасность и конфиденциальность.",
    input_label: "Текст Unicode Devanagari",
    input_placeholder: "Вставьте текст на хинди в кодировке Unicode сюда...",
    output_label: "Результат Krutidev",
    see1: "Конвертер Krutidev в Unicode",
    see2: "Конвертер текста",
    see3: "Конвертер азбуки Морзе",
    see4: "Счетчик текста",
    features_title: "Особенности",
    f_1: "Преобразует Unicode Devanagari в Krutidev 010 с поддержкой конъюнкта и матры",
    f_2: "Автоматически перемещает икар (ि) и реф (र्) в порядок кодировки Krutidev",
    how_to_use_title: "Как использовать",
    step_1_title: "Вставьте текст Unicode",
    step_1_desc: "Вставьте текст хинди Unicode Devanagari в область ввода.",
    step_2_title: "Проверьте результат",
    step_2_desc: "Текст Krutidev генерируется автоматически по мере того, как вы вводите или вставляете содержимое.",
    output_note: "Если шрифт Krutidev не установлен на устройстве, результат будет выглядеть как латинские символы — ожидаемое поведение для этой кодировки.",
    step_3_title: "Скопируйте результат",
    step_3_desc: "Нажмите кнопку копирования и вставьте прямо в целевую программу или документ.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Результат выглядит как перепутанные символы, что делать?",
    faq_1_a: "Это происходит потому, что на устройстве не установлен шрифт Krutidev. Текст правильный. Просто вставьте его в целевую программу с примененным шрифтом Krutidev 010, чтобы Devanagari отображался корректно.",
    faq_2_q: "Когда мне нужно преобразовать Unicode в Krutidev?",
    faq_2_a: "Это преобразование необходимо при работе со старым индийским издательским программным обеспечением, промышленными принтерами, которые поддерживают только Krutidev, устаревшими правительственными документами или любой системой, которая не была обновлена до Unicode.",
    faq_3_q: "Точно ли преобразование?",
    faq_3_a: "Инструмент оптимизирован для Krutidev 010, наиболее широко используемого варианта, и охватывает подавляющее большинство текстов на хинди, встречающихся на практике. Согласные, гласные, матры, общие конъюнкты и цифры конвертируются с высокой точностью. Если целью является система, использующая другой вариант Krutidev (011, 012, 020 и т.д.), некоторые символы могут отображаться по-другорому — в этих случаях примените к результату шрифт Krutidev 010, чтобы проверить визуальную точность."
  }
}
</i18n>
