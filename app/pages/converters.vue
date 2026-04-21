<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta'),
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') },
  ],
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }],
})

defineI18nRoute({
  paths: {
        pt: "/conversores",
        es: "/convertidores",
    fr: '/convertisseurs',
    it: '/convertitori',
    id: '/konverter',
        de: '/konverter'
    }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content/70 mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-6">
      <ToolCard        :title="t('roman')"
        :to="localePath('roman-numerals-converter')"
        icon="mdi:format-list-numbered-rtl"
        :index="0"
      />
      <ToolCard
        :cols="5"
        :title="t('length')"
        :to="localePath('length-converter')"
        icon="mdi:ruler"
        :index="1"
      />
      <ToolCard        :title="t('temperature')"
        :to="localePath('temperature-converter')"
        icon="mdi:thermometer"
        :index="2"
      />
      <ToolCard        :title="t('time')"
        :to="localePath('time-converter')"
        icon="mdi:clock-outline"
        :index="3"
      />
      <ToolCard        :title="t('url')"
        :to="localePath('url-encoder-decoder')"
        icon="mdi:link-variant"
        :index="4"
      />
    </div>

    <div class="mt-16 mb-8 flex items-center gap-4">
      <h2 class="text-xl font-bold text-base-content/50 uppercase tracking-widest">{{ t('devs') }}</h2>
      <div class="h-px flex-1 bg-base-content/10" />
    </div>

    <div class="flex flex-wrap justify-center gap-6">
      <ToolCard        :title="t('less')"
        :to="localePath('less-to-css-converter')"
        icon="mdi:file-code-outline"
        :index="5"
      />
      <ToolCard        :title="t('xmlToJson')"
        :to="localePath('xml-to-json-converter')"
        icon="mdi:code-braces"
        :index="6"
      />
      <ToolCard        :title="t('jsonToXml')"
        :to="localePath('json-to-xml-converter')"
        icon="mdi:code-json"
        :index="0"
      />
      <ToolCard        :title="t('csvToJson')"
        :to="localePath('csv-to-json-converter')"
        icon="mdi:file-delimited-outline"
        :index="1"
      />
      <ToolCard        :title="t('jsonToCsv')"
        :to="localePath('json-to-csv-converter')"
        icon="mdi:file-delimited"
        :index="2"
      />
      <ToolCard        :title="t('num')"
        :to="localePath('number-base-converter')"
        icon="mdi:numeric"
        :index="3"
      />
      <ToolCard        :title="t('unit')"
        :to="localePath('storage-unit-converter')"
        icon="mdi:harddisk"
        :index="4"
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
        title: "Converter Tools",
        meta: "Free online converters: units, temperature, time, roman numerals, URL, LESS to CSS, XML/JSON and more. Convert data instantly!",
        desc: "Convert units of length, temperature and time, encode and decode URLs, convert roman numerals and switch between data formats like XML, JSON and CSV. All processing happens in your browser and no installation is required.",
        devs: "For Developers",
        roman: "Roman Numerals",
        length: "Length",
        temperature: "Temperature",
        time: "Time",
        url: "URL/Link",
        less: "LESS → CSS",
        xmlToJson: "XML → JSON",
        jsonToXml: "JSON → XML",
        csvToJson: "CSV → JSON",
        jsonToCsv: "JSON → CSV",
        num: "Number Base",
        unit: "Storage Unit",
    },
    pt: {
        title: "Ferramentas de Conversão",
        meta: "Conversores online grátis: unidades, temperatura, tempo, números romanos, URL, LESS para CSS, XML/JSON e mais. Converta dados instantaneamente!",
        desc: "Converta unidades de comprimento, temperatura e tempo, codifique e decodifique URLs, converta números romanos e transite entre formatos de dados como XML, JSON e CSV. Todo o processamento acontece no seu navegador e nenhuma instalação é necessária.",
        devs: "Para Desenvolvedores",
        roman: "Números Romanos",
        length: "Comprimento",
        temperature: "Temperatura",
        time: "Tempo",
        url: "URL/Link",
        less: "LESS → CSS",
        xmlToJson: "XML → JSON",
        jsonToXml: "JSON → XML",
        csvToJson: "CSV → JSON",
        jsonToCsv: "JSON → CSV",
        num: "Bases Numéricas",
        unit: "Unidades de Armazenamento",
    },
    es: {
        title: "Herramientas de Conversión",
        meta: "Convertidores online gratis: unidades, temperatura, tiempo, números romanos, URL, LESS a CSS, XML/JSON y más. ¡Convierte datos instantáneamente!",
        desc: "Convierte unidades de longitud, temperatura y tiempo, codifica y decodifica URLs, convierte números romanos y cambia entre formatos de datos como XML, JSON y CSV. Todo el procesamiento ocurre en tu navegador y no necesitas instalar nada.",
        devs: "Para Desarrolladores",
        roman: "Números Romanos",
        length: "Longitud",
        temperature: "Temperatura",
        time: "Tiempo",
        url: "URL/Enlace",
        less: "LESS → CSS",
        xmlToJson: "XML → JSON",
        jsonToXml: "JSON → XML",
        csvToJson: "CSV → JSON",
        jsonToCsv: "JSON → CSV",
        num: "Bases Numéricas",
        unit: "Unidades de Almacenamiento",
    },
    fr: {
        title: "Outils de Conversion",
        meta: "Convertisseurs en ligne gratuits : unités, température, temps, nombres romains, URL, LESS vers CSS, XML/JSON et plus. Convertissez des données instantanément !",
        desc: "Convertissez des unités de longueur, de température et de temps, encodez et décodez des URLs, convertissez des nombres romains et passez entre des formats de données comme XML, JSON et CSV. Tout le traitement se fait dans votre navigateur et aucune installation n'est requise.",
        devs: "Pour les Développeurs",
        roman: "Nombres Romains",
        length: "Longueur",
        temperature: "Température",
        time: "Temps",
        url: "URL/Lien",
        less: "LESS → CSS",
        xmlToJson: "XML → JSON",
        jsonToXml: "JSON → XML",
        csvToJson: "CSV → JSON",
        jsonToCsv: "JSON → CSV",
        num: "Bases Numériques",
        unit: "Unités de Stockage",
    },
    it: {
        title: "Strumenti di Conversione",
        meta: "Convertitori online gratuiti: unità, temperatura, tempo, numeri romani, URL, LESS a CSS, XML/JSON e altro. Converti dati istantaneamente!",
        desc: "Converti unità di lunghezza, temperatura e tempo, codifica e decodifica URL, converti numeri romani e passa tra formati di dati come XML, JSON e CSV. Tutta l'elaborazione avviene nel tuo browser e non è necessaria alcuna installazione.",
        devs: "Per Sviluppatori",
        roman: "Numeri Romani",
        length: "Lunghezza",
        temperature: "Temperatura",
        time: "Tempo",
        url: "URL/Link",
        less: "LESS → CSS",
        xmlToJson: "XML → JSON",
        jsonToXml: "JSON → XML",
        csvToJson: "CSV → JSON",
        jsonToCsv: "JSON → CSV",
        num: "Basi Numeriche",
        unit: "Unità di Archiviazione",
    },
    id: {
        title: "Alat Konversi",
        meta: "Konverter online gratis: satuan, suhu, waktu, angka Romawi, URL, LESS ke CSS, XML/JSON, dan lainnya. Konversi data seketika!",
        desc: "Konversi satuan panjang, suhu dan waktu, encode dan decode URL, konversi angka Romawi dan beralih antar format data seperti XML, JSON dan CSV. Semua pemrosesan dilakukan di browser Anda dan tidak diperlukan instalasi apa pun.",
        devs: "Untuk Developer",
        roman: "Angka Romawi",
        length: "Panjang",
        temperature: "Suhu",
        time: "Waktu",
        url: "URL/Tautan",
        less: "LESS → CSS",
        xmlToJson: "XML → JSON",
        jsonToXml: "JSON → XML",
        csvToJson: "CSV → JSON",
        jsonToCsv: "JSON → CSV",
        num: "Basis Angka",
        unit: "Unit Penyimpanan",
    },
    de: {
        title: "Konverter-Werkzeuge",
        meta: "Kostenlose Online-Konverter: Einheiten, Temperatur, Zeit, römische Zahlen, URL, LESS zu CSS, XML/JSON und mehr. Daten sofort konvertieren!",
        desc: "Konvertieren Sie Längen-, Temperatur- und Zeiteinheiten, kodieren und dekodieren Sie URLs, konvertieren Sie römische Zahlen und wechseln Sie zwischen Datenformaten wie XML, JSON und CSV. Die Verarbeitung erfolgt vollständig in Ihrem Browser und eine Installation ist nicht erforderlich.",
        devs: "Für Entwickler",
        roman: "Römische Zahlen",
        length: "Länge",
        temperature: "Temperatur",
        time: "Zeit",
        url: "URL/Link",
        less: "LESS → CSS",
        xmlToJson: "XML → JSON",
        jsonToXml: "JSON → XML",
        csvToJson: "CSV → JSON",
        jsonToCsv: "JSON → CSV",
        num: "Zahlenbasis",
        unit: "Speichereinheit",
    }
}
</i18n>
