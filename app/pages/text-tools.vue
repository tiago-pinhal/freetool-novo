<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta')
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }],
})

defineI18nRoute({
  paths: {
    en: '/text-tools',
    pt: '/ferramentas-para-textos',
    es: '/herramientas-para-textos',
    fr: '/outils-pour-textes',
    it: '/strumenti-per-testi',
    id: '/alat-teks',
    de: '/textwerkzeuge',
    nl: '/teksttools'
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">
      <ToolCard :title="t('fonts')" 
        :to="localePath('fancy-letters')" 
        icon="mdi:format-letter-starts-with"
        :index="0"
      />
      <ToolCard :title="t('asc')" 
        :to="localePath('ascii-letter-generator')" 
        icon="mdi:alphabetical"
        :index="1"
      />
      <ToolCard :title="t('txt')" 
        :to="localePath('text-converter')" 
        icon="mdi:file-document-edit-outline"
        :index="2"
      />
      <ToolCard :title="t('diff')" 
        :to="localePath('text-comparator')" 
        icon="mdi:vector-difference"
        :index="3"
      />
      <ToolCard :title="t('count')" 
        :to="localePath('text-counter')" 
        icon="mdi:counter"
        :index="4"
      />
      <ToolCard :title="t('lorem')"
        :to="localePath('text-generator')"
        icon="mdi:text"
        :index="5"
      />
      <ToolCard :title="t('invisible')"
        :to="localePath('invisible-character')"
        icon="mdi:eye-off-outline"
        :index="6"
      />
    </div>

    <div class="mt-16 bg-base-200/50 rounded-3xl p-8 border border-base-content/5">
      <Adsense />
    </div>
  </div>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Text Tools",
        meta: "Free online text tools: word counter, text generator, converter, comparator, fancy letters and ASCII art. Boost your productivity!",
        desc: "Transform text case, compare documents, count words, generate placeholder text, create fancy letters and ASCII art. All processing happens in your browser, your data never leaves your device and no installation is required.",
        asc: "ASCII Letter",
        fonts: "Different Letters", 
        txt: "Text Converter",
        diff: "Text Comparator",
        count: "Text Counter",
        lorem: "Text Generator",
        invisible: "Invisible Character"
    },
    pt: {
        title: "Ferramentas para Textos",
        meta: "Ferramentas de texto online grátis: contador de palavras, gerador de texto, conversor, comparador, letras diferentes e ASCII. Aumente sua produtividade!",
        desc: "Transforme maiúsculas e minúsculas, compare documentos, conte palavras, gere texto de preenchimento, crie letras diferentes e arte ASCII. Todo o processamento acontece no seu navegador, seus dados nunca saem do seu dispositivo e nenhuma instalação é necessária.",
        asc: "Letras ASCII",
        fonts: "Letras Diferentes",
        txt: "Conversor de Texto",
        diff: "Comparador de Texto",
        count: "Contador de Texto",
        lorem: "Gerador de Texto",
        invisible: "Caractere Invisível"
    },
    es: {
        title: "Herramientas para Textos",
        meta: "Herramientas de texto online gratis: contador de palabras, generador de texto, convertidor, comparador, letras diferentes y ASCII. ¡Aumenta tu productividad!",
        desc: "Transforma mayúsculas y minúsculas, compara documentos, cuenta palabras, genera texto de relleno, crea letras diferentes y arte ASCII. Todo el procesamiento ocurre en tu navegador, tus datos nunca salen de tu dispositivo y no necesitas instalar nada.",
        asc: "Letras ASCII",
        fonts: "Letras Diferentes",
        txt: "Convertidor de Texto",
        diff: "Comparador de Texto",
        count: "Contador de Texto",
        lorem: "Generador de Texto",
        invisible: "Carácter Invisible"
    },
    fr: {
        title: "Outils pour Textes",
        meta: "Outils de texte en ligne gratuits: compteur de mots, générateur de texte, convertisseur, comparateur, lettres stylisées et ASCII. Boostez votre productivité!",
        desc: "Transformez la casse, comparez des documents, comptez les mots, générez du texte de remplissage, créez des lettres stylisées et de l'art ASCII. Tout le traitement se fait dans votre navigateur, vos données ne quittent jamais votre appareil et aucune installation n'est requise.",
        asc: "Lettres ASCII",
        fonts: "Lettres Différentes",
        txt: "Convertisseur de Texte",
        diff: "Comparateur de Texte",
        count: "Compteur de Texte",
        lorem: "Générateur de Texte",
        invisible: "Caractère Invisible"
    },
    it: {
        title: "Strumenti per Testi",
        meta: "Strumenti di testo online gratuiti: contatore di parole, generatore di testo, convertitore, comparatore, lettere diverse e ASCII. Aumenta la tua produttività!",
        desc: "Trasforma maiuscole e minuscole, confronta documenti, conta le parole, genera testo segnaposto, crea lettere diverse e arte ASCII. Tutta l'elaborazione avviene nel tuo browser, i tuoi dati non lasciano mai il dispositivo e non è necessaria alcuna installazione.",
        asc: "Lettere ASCII",
        fonts: "Lettere Diverse",
        txt: "Convertitore di Testo",
        diff: "Comparatore di Testo",
        count: "Contatore di Testo",
        lorem: "Generatore di Testo",
        invisible: "Carattere Invisibile"
    },
    id: {
        title: "Alat Teks",
        meta: "Alat teks online gratis: penghitung kata, generator teks, konverter, komparator, huruf mewah, dan ASCII art. Tingkatkan produktivitas Anda!",
        desc: "Ubah kapitalisasi teks, bandingkan dokumen, hitung kata, buat teks pengisi, ciptakan huruf berbeda dan seni ASCII. Semua pemrosesan dilakukan di browser Anda, data Anda tidak pernah meninggalkan perangkat Anda dan tidak diperlukan instalasi.",
        asc: "Huruf ASCII",
        fonts: "Huruf Berbeda",
        txt: "Konverter Teks",
        diff: "Komparator Teks",
        count: "Penghitung Teks",
        lorem: "Generator Teks",
        invisible: "Karakter Tak Terlihat"
    },
    de: {
        title: "Textwerkzeuge",
        meta: "Kostenlose Online-Textwerkzeuge: Wortzähler, Textgenerator, Konverter, Vergleicher, besondere Buchstaben und ASCII-Kunst. Steigere deine Produktivität!",
        desc: "Wandle Groß- und Kleinschreibung um, vergleiche Dokumente, zähle Wörter, erstelle Platzhaltertext, erzeuge besondere Buchstaben und ASCII-Kunst. Die gesamte Verarbeitung erfolgt in deinem Browser, deine Daten verlassen niemals dein Gerät und es ist keine Installation erforderlich.",
        asc: "ASCII-Buchstaben",
        fonts: "Besondere Buchstaben",
        txt: "Textkonverter",
        diff: "Textvergleicher",
        count: "Textzähler",
        lorem: "Textgenerator",
        invisible: "Unsichtbares Zeichen"
    },
    nl: {
        title: "Teksttools",
        meta: "Gratis online teksttools: woordenteller, tekstgenerator, converter, vergelijker, bijzondere letters en ASCII-kunst. Verhoog je productiviteit!",
        desc: "Transformeer hoofdletters en kleine letters, vergelijk documenten, tel woorden, genereer placeholder-tekst, maak bijzondere letters en ASCII-kunst. Alle verwerking vindt plaats in je browser, je gegevens verlaten je apparaat nooit en er is geen installatie nodig.",
        asc: "ASCII-letters",
        fonts: "Bijzondere letters",
        txt: "Tekstconverter",
        diff: "Tekstvergelijker",
        count: "Tekstteller",
        lorem: "Tekstgenerator",
        invisible: "Onzichtbaar Teken"
    }
}
</i18n>
