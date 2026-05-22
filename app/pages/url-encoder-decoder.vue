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
    { question: t('faq_2_q'), answer: t('faq_2_a') }
  ]
})

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

const state = reactive({
  url: '',
  output: ''
})

function encode() {
  state.output = encodeURI(state.url)
}

function decode() {
  state.output = decodeURI(state.url)
}

watch(() => state.url, () => state.output = '')

defineI18nRoute({
  paths: {
    en: '/url-encoder-decoder',
    pt: '/codificador-e-decodificador-de-url',
    es: '/codificador-y-decodificador-de-url',
    fr: '/encodeur-et-decodeur-d-url',
    it: '/codificatore-e-decodificatore-di-url',
    id: '/enkoder-dekoder-url',
    de: '/url-kodierer-und-dekodierer',
    nl: '/url-encoder-decoder-tool'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/URL_encoding`"
    wiki-label="URL Encoding"
    :see-also-links="[
      { label: t('see1'), to: 'less-to-css-converter' },
      { label: t('see2'), to: 'xml-to-json-converter' },
      { label: t('see3'), to: 'json-to-xml-converter' },
      { label: t('see4'), to: 'number-base-converter' }
    ]"
  >
    <template #info>
      <div class="space-y-8">
        <div>
          <p>{{ t('d1') }}</p>
        </div>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') }
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
            { question: t('faq_2_q'), answer: t('faq_2_a') }
          ]"
        />
      </div>
    </template>

    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="form-control w-full">
        <label for="url-input" class="label">
          <span class="label-text font-bold text-base-content">{{ t('in') }}</span>
        </label>
        <input
          id="url-input"
          v-model="state.url"
          type="text"
          class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl"
          autofocus
        />
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!state.url"
          @click="encode()"
        >
          {{ t('encode') }}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!state.url"
          @click="decode()"
        >
          {{ t('decode') }}
        </button>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <LineCopy v-if="state.output" label="URL" :content="state.output">
          {{ state.output }}
        </LineCopy>
      </Transition>
    </div>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "URL Encoder and Decoder",
    meta: "With this URL Encoder and Decoder, you can easily and quickly encode and decode URLs directly in your browser.",
    d1: "With this URL Encoder and Decoder, the Encode button will convert special characters and spaces into a string suitable for web use, ensuring that browsers and other systems correctly interpret the URL. The Decode button reverses the process, converting the encoded string back to its original, readable form. Simply paste the URL into the field above and click the desired action.",
    in: "Enter the URL here",
    encode: "Encode",
    decode: "Decode",
    how_it_works_title: "How It Works",
    step_1_title: "Enter URL",
    step_1_desc: "Paste or type the URL you want to encode or decode.",
    step_2_title: "Choose Action",
    step_2_desc: "Click 'Encode' to format for web use or 'Decode' to revert.",
    step_3_title: "Copy Result",
    step_3_desc: "The result appears instantly. Use the copy button to send it to your clipboard.",
    use_cases_title: "Use Cases",
    uc_1_title: "API Query Parameters",
    uc_1_desc: "Encode keys and values in query strings to ensure special characters don't break the URL structure.",
    uc_2_title: "Safe Data Transmission",
    uc_2_desc: "Ensure that characters like spaces, ampersands, and slashes are correctly handled by web servers.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is URL encoding?",
    faq_1_a: "URL encoding, also known as percent-encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI).",
    faq_2_q: "When should I use URL decoding?",
    faq_2_a: "Use it when you have a URL containing percent signs (e.g., %20) and you want to see the original characters (e.g., spaces).",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Number Base",
    f_1: "Encode URLs for safe web transmission",
    f_2: "Decode encoded URLs to readable format",
    f_3: "Instant encoding and decoding",
    f_4: "Client-side processing — no data sent to servers"
  },
  pt: {
    title: "Codificador e Decodificador de URL",
    meta: "Com este Codificador e Decodificador de URL, você pode codificar e decodificar URLs de forma fácil e rápida diretamente no navegador.",
    d1: "Com este Codificador e Decodificador de URL, o botão Codificar converterá caracteres especiais e espaços em uma sequência adequada para uso na web, assegurando que navegadores e outros sistemas interpretem a URL corretamente. O botão Decodificar reverte o processo, convertendo a sequência codificada de volta à sua forma original e legível. Basta colar a URL no campo acima e clicar na ação desejada.",
    in: "Insira a URL aqui",
    encode: "Codificar",
    decode: "Decodificar",
    how_it_works_title: "Como Funciona",
    step_1_title: "Inserir URL",
    step_1_desc: "Cole ou digite a URL que você deseja codificar ou decodificar.",
    step_2_title: "Escolher Ação",
    step_2_desc: "Clique em 'Codificar' para formatar ou 'Decodificar' para reverter.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "O resultado aparece na hora. Use o botão de copiar para enviar para a área de transferência.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Parâmetros de Consulta de API",
    uc_1_desc: "Codifique chaves e valores em strings de consulta para garantir que caracteres especiais não quebrem a estrutura da URL.",
    uc_2_title: "Transmissão Segura de Dados",
    uc_2_desc: "Garanta que caracteres como espaços, e-comerciais e barras sejam processados corretamente pelos servidores web.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O que é codificação de URL?",
    faq_1_a: "A codificação de URL, também conhecida como percent-encoding, é um mecanismo para codificar informações em um Identificador Uniforme de Recursos (URI).",
    faq_2_q: "Quando devo usar a decodificação de URL?",
    faq_2_a: "Use quando você tiver uma URL contendo sinais de porcentagem (ex: %20) e quiser ver os caracteres originais (ex: espaços).",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Bases Numéricas",
    f_1: "Codifique URLs para transmissão segura na web",
    f_2: "Decodifique URLs codificadas para formato legível",
    f_3: "Codificação e decodificação instantâneas",
    f_4: "Processamento no navegador — nenhum dado enviado a servidores"
  },
  es: {
    title: "Codificador y Decodificador de URL",
    meta: "Con este Codificador y Decodificador de URL, puedes codificar y decodificar URLs de manera fácil y rápida directamente en el navegador.",
    d1: "Con este Codificador y Decodificador de URL, el botón Codificar convertirá caracteres especiales y espacios en una secuencia adecuada para uso en la web, asegurando que los navegadores y otros sistemas interpreten la URL correctamente. El botón Decodificar revierte el proceso, convirtiendo la secuencia codificada de vuelta a su forma original y legible. Simplemente pega la URL en el campo de arriba y haz clic en la acción deseada.",
    in: "Ingresa la URL aquí",
    encode: "Codificar",
    decode: "Decodificar",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Ingresar URL",
    step_1_desc: "Pega o escribe la URL que deseas codificar o decodificar.",
    step_2_title: "Elegir Acción",
    step_2_desc: "Haz clic en 'Codificar' para formatear o 'Decodificar' para revertir.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "El resultado aparece al instante. Usa el botón de copiar para enviarlo al portapapeles.",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Parámetros de Consulta de API",
    uc_1_desc: "Codifica claves y valores en cadenas de consulta para asegurar que los caracteres especiales no rompan la estructura de la URL.",
    uc_2_title: "Transmisión Segura de Datos",
    uc_2_desc: "Asegura que los caracteres como espacios, ampersands y barras sean manejados correctamente por los servidores web.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Qué es la codificación de URL?",
    faq_1_a: "La codificación de URL, también conocida como percent-encoding, es un mecanismo para codificar información en un Identificador de Recursos Uniforme (URI).",
    faq_2_q: "¿Cuándo debo usar la decodificación de URL?",
    faq_2_a: "Úsala cuando tengas una URL que contenga signos de porcentaje (ej: %20) y quieras ver los caracteres originales (ej: espacios).",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Bases Numéricas",
    f_1: "Codifica URLs para transmisión segura en la web",
    f_2: "Decodifica URLs codificadas a formato legible",
    f_3: "Codificación y decodificación instantáneas",
    f_4: "Procesamiento en el navegador — sin envío de datos a servidores"
  },
  fr: {
    title: "Encodeur et Décodeur d'URL",
    meta: "Avec cet Encodeur et Décodeur d'URL, vous pouvez facilement et rapidement encoder et décoder des URL directement dans votre navigateur.",
    d1: "Avec cet Encodeur et Décodeur d'URL, le bouton Encoder convertira les caractères spéciaux et les espaces en une séquence adaptée à l'utilisation sur le web, assurant que les navigateurs et autres systèmes interprètent l'URL correctement. Le bouton Décoder inverse le processus, en convertissant la séquence encodée vers sa forme originale et lisible. Il suffit de coller l'URL dans le champ ci-dessus et de cliquer sur l'action souhaitée.",
    in: "Saisissez l'URL ici",
    encode: "Encoder",
    decode: "Décoder",
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Entrer l'URL",
    step_1_desc: "Collez ou tapez l'URL que vous souhaitez encoder ou décoder.",
    step_2_title: "Choisir l'Action",
    step_2_desc: "Cliquez sur 'Encoder' pour formater ou 'Décoder' pour rétablir.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "Le résultat apparaît instantanément. Utilisez le bouton de copie pour l'envoyer au presse-papiers.",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Paramètres de Requête API",
    uc_1_desc: "Encodez les clés et les valeurs dans les chaînes de requête pour éviter que les caractères spéciaux ne rompent la structure de l'URL.",
    uc_2_title: "Transmission Sécurisée des Données",
    uc_2_desc: "Assurez-vous que les caractères tels que les espaces, les esperluettes et les barres obliques sont correctement gérés par les serveurs web.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Qu'est-ce que l'encodage d'URL ?",
    faq_1_a: "L'encodage d'URL, également appelé percent-encoding, est un mécanisme d'encodage d'informations dans un identifiant de ressource uniforme (URI).",
    faq_2_q: "Quand dois-je utiliser le décodage d'URL ?",
    faq_2_a: "Utilisez-le lorsque vous avez une URL contenant des signes de pourcentage (ex : %20) et que vous souhaitez voir les caractères originaux (ex : espaces).",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Bases Numériques",
    f_1: "Encodez les URL pour une transmission web sécurisée",
    f_2: "Décodez les URL encodées en format lisible",
    f_3: "Encodage et décodage instantanés",
    f_4: "Traitement côté navigateur — aucune donnée envoyée aux serveurs"
  },
  it: {
    title: "Codificatore e Decodificatore di URL",
    meta: "Con questo Codificatore e Decodificatore di URL, puoi codificare e decodificare gli URL in modo facile e rapido direttamente nel browser.",
    d1: "Con questo Codificatore e Decodificatore di URL, il pulsante Codifica convertirà i caratteri speciali e gli spazi in una stringa adatta all'uso web, garantendo che i browser e altri sistemi interpretino correttamente l'URL. Il pulsante Decodifica inverte il processo, convertendo la stringa codificata nella sua forma originale e leggibile. Basta incollare l'URL nel campo sopra e fare clic sull'azione desiderata.",
    in: "Inserisci l'URL qui",
    encode: "Codifica",
    decode: "Decodifica",
    how_it_works_title: "Come Funziona",
    step_1_title: "Inserisci URL",
    step_1_desc: "Incolla o digita l'URL che desideri codificare o decodificare.",
    step_2_title: "Scegli Azione",
    step_2_desc: "Fai clic su 'Codifica' per formattare o 'Decodifica' per ripristinare.",
    step_3_title: "Copia Risultato",
    step_3_desc: "Il risultato appare all'istante. Usa il pulsante di copia per inviarlo agli appunti.",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Parametri di Query API",
    uc_1_desc: "Codifica chiavi e valori nelle stringhe di query per garantire che i caratteri speciali non interrompano la struttura dell'URL.",
    uc_2_title: "Trasmissione Sicura dei Dati",
    uc_2_desc: "Assicura che i caratteri come spazi, e-commerciali e barre siano gestiti correttamente dai server web.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Cos'è la codifica URL?",
    faq_1_a: "La codifica URL, nota anche come percent-encoding, è un meccanismo per codificare informazioni in un Uniform Resource Identifier (URI).",
    faq_2_q: "Quando dovrei usare la decodifica URL?",
    faq_2_a: "Usala quando hai un URL contenente segni di percentuale (es. %20) e desideri visualizzare i caratteri originali (es. spazi).",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Basi Numeriche",
    f_1: "Codifica gli URL per una trasmissione web sicura",
    f_2: "Decodifica gli URL codificati in formato leggibile",
    f_3: "Codifica e decodifica istantanee",
    f_4: "Elaborazione nel browser — nessun dato inviato ai server"
  },
  id: {
    title: "Enkoder dan Dekoder URL",
    meta: "Dengan Enkoder dan Dekoder URL ini, Anda dapat dengan mudah dan cepat melakukan enkode dan dekode URL langsung di browser.",
    d1: "Dengan Enkoder dan Dekoder URL ini, tombol Enkode akan mengubah karakter khusus dan spasi menjadi rangkaian karakter yang sesuai untuk penggunaan web, sehingga browser dan sistem lain dapat menafsirkan URL dengan benar. Tombol Dekode membalik prosesnya, mengubah rangkaian yang sudah dienkode kembali ke bentuk asli yang mudah dibaca. Cukup tempelkan URL ke kolom di atas dan klik tindakan yang diinginkan.",
    in: "Masukkan URL di sini",
    encode: "Enkode",
    decode: "Dekode",
    how_it_works_title: "Cara Kerja",
    step_1_title: "Masukkan URL",
    step_1_desc: "Tempel atau ketik URL yang ingin Anda enkode atau dekode.",
    step_2_title: "Pilih Tindakan",
    step_2_desc: "Klik 'Enkode' untuk memformat atau 'Dekode' untuk mengembalikan.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Hasilnya muncul seketika. Gunakan tombol salin untuk mengirim ke papan klip.",
    use_cases_title: "Contoh Penggunaan",
    uc_1_title: "Parameter Kueri API",
    uc_1_desc: "Enkode kunci dan nilai dalam string kueri untuk memastikan karakter khusus tidak merusak struktur URL.",
    uc_2_title: "Transmisi Data Aman",
    uc_2_desc: "Pastikan karakter seperti spasi, ampersand, dan garis miring ditangani dengan benar oleh server web.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apa itu enkode URL?",
    faq_1_a: "Enkode URL, juga dikenal sebagai percent-encoding, adalah mekanisme untuk mengenkode informasi dalam Uniform Resource Identifier (URI).",
    faq_2_q: "Kapan saya harus menggunakan dekode URL?",
    faq_2_a: "Gunakan saat Anda memiliki URL yang mengandung tanda persen (misalnya, %20) dan Anda ingin melihat karakter aslinya (misalnya, spasi).",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Basis Angka",
    f_1: "Enkode URL untuk transmisi web yang aman",
    f_2: "Dekode URL yang dienkode ke format yang mudah dibaca",
    f_3: "Enkode dan dekode instan",
    f_4: "Pemrosesan di browser — tidak ada data yang dikirim ke server"
  },
  de: {
    title: "URL-Kodierer und -Dekodierer",
    meta: "Mit diesem URL-Kodierer und -Dekodierer kannst du URLs direkt im Browser einfach und schnell kodieren und dekodieren.",
    d1: "Mit diesem URL-Kodierer und -Dekodierer wandelt die Schaltfläche 'Kodieren' Sonderzeichen und Leerzeichen in eine für das Web geeignete Zeichenfolge um, damit Browser und andere Systeme die URL korrekt interpretieren. Die Schaltfläche 'Dekodieren' kehrt den Vorgang um und wandelt die kodierte Zeichenfolge wieder in ihre ursprüngliche, lesbare Form zurück. Füge einfach die URL in das Feld oben ein und klicke auf die gewünschte Aktion.",
    in: "URL hier eingeben",
    encode: "Kodieren",
    decode: "Dekodieren",
    how_it_works_title: "So funktioniert es",
    step_1_title: "URL eingeben",
    step_1_desc: "Füge die URL ein oder tippe sie ein, die du kodieren oder dekodieren möchtest.",
    step_2_title: "Aktion auswählen",
    step_2_desc: "Klicke auf 'Kodieren', um sie webtauglich zu formatieren, oder auf 'Dekodieren', um den Vorgang rückgängig zu machen.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Das Ergebnis erscheint sofort. Verwende den Kopier-Button, um es in die Zwischenablage zu senden.",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "API-Abfrageparameter",
    uc_1_desc: "Kodiere Schlüssel und Werte in Query-Strings, damit Sonderzeichen die URL-Struktur nicht beschädigen.",
    uc_2_title: "Sichere Datenübertragung",
    uc_2_desc: "Stelle sicher, dass Zeichen wie Leerzeichen, kaufmännische Unds und Schrägstriche von Webservern korrekt verarbeitet werden.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Was ist URL-Kodierung?",
    faq_1_a: "URL-Kodierung, auch als Percent-Encoding bekannt, ist ein Mechanismus zum Kodieren von Informationen in einem Uniform Resource Identifier (URI).",
    faq_2_q: "Wann sollte ich URL-Dekodierung verwenden?",
    faq_2_a: "Verwende sie, wenn du eine URL mit Prozentzeichen hast, zum Beispiel %20, und die ursprünglichen Zeichen wie Leerzeichen sehen möchtest.",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Zahlenbasen",
    f_1: "Kodiere URLs für eine sichere Webübertragung",
    f_2: "Dekodiere kodierte URLs in ein lesbares Format",
    f_3: "Sofortiges Kodieren und Dekodieren",
    f_4: "Verarbeitung im Browser — keine Daten werden an Server gesendet"
  },
  nl: {
    title: "URL Encoder & Decoder",
    meta: "Snel URL's coderen e decoderen online. Maak uw URL's veilig voor webtransmissie door speciale tekens om te zetten in percent-gecodeerde formaten.",
    d1: "Onze online URL Encoder & Decoder is een essentieel hulpmiddel voor webontwikkelaars e iedereen die met webadressen werkt. Het stelt u in staat om speciale tekens in een URL om te zetten naar een formaat dat veilig over het internet kan worden verzonden (encoding) of om gecodeerde URL's terug te zetten naar hun leesbare vorm (decoding).",
    in: "Voer URL of tekst in",
    encode: "Coderen (Encode)",
    decode: "Decoderen (Decode)",
    how_it_works_title: "Hoe het werkt",
    step_1_title: "Invoer plakken",
    step_1_desc: "Plak de tekst of URL die u wilt coderen of decoderen in het tekstvak.",
    step_2_title: "Actie kiezen",
    step_2_desc: "Klik op 'Coderen' om tekens naar %-formaat om te zetten, of op 'Decoderen' om %-tekens terug te zetten.",
    step_3_title: "Resultaat gebruiken",
    step_3_desc: "Kopieer de verwerkte tekst direct vanuit de resultaatsectie.",
    use_cases_title: "Gebruiksvoorbeelden",
    uc_1_title: "Query Parameters",
    uc_1_desc: "Codeer waarden in URL-queryreeksen om fouten met spaties e speciale tekens te voorkomen.",
    uc_2_title: "API Ontwikkeling",
    uc_2_desc: "Decodeer API-responses of codeer verzoeken om een correcte gegevensverwerking tussen systemen te garanderen.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is URL Encoding?",
    faq_1_a: "URL encoding (ook wel percent-encoding genoemd) vervangt onveilige ASCII-tekens door een '%' gevolgd door hun hexadecimale equivalent. Spaties worden bijvoorbeeld vaak gecodeerd als %20.",
    faq_2_q: "Waarom moeten URL's gecodeerd worden?",
    faq_2_a: "URL's mogen alleen bepaalde tekens uit de standaard ASCII-set bevatten. Tekens daarbuiten moeten worden gecodeerd om te voorkomen dat ze verkeerd worden geïnterpreteerd door browsers of servers.",
    see1: "LESS → CSS",
    see2: "XML → JSON",
    see3: "JSON → XML",
    see4: "Getalstelsels",
    f_1: "Codeer tekst naar URL-veilig formaat",
    f_2: "Decodeer percent-gecodeerde URL's",
    f_3: "Real-time e veilige verwerking",
    f_4: "Ondersteunt UTF-8 tekens"
  }
}
</i18n>
