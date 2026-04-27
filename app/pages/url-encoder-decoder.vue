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
    id: '/enkoder-dekoder-url'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.output"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/URL_encoding`"
    :wiki-label="'Wikipedia (URL Encoding)'"
    :see-also-links="[
      { label: t('see1'), to: 'less-to-css-converter' },
      { label: t('see2'), to: 'xml-to-json-converter' },
      { label: t('see3'), to: 'json-to-xml-converter' },
      { label: t('see4'), to: 'number-base-converter' }
    ]"
  >
    <template #info>
      <p>{{ t('d1') }}</p>
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
    see1: "LESS to CSS Converter",
    see2: "XML to JSON Converter",
    see3: "JSON to XML Converter",
    see4: "Number Base Converter",
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
    see1: "Conversor de LESS para CSS",
    see2: "Conversor de XML para JSON",
    see3: "Conversor de JSON para XML",
    see4: "Conversor de Bases Numéricas",
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
    see1: "Convertidor de LESS a CSS",
    see2: "Convertidor de XML a JSON",
    see3: "Convertidor de JSON a XML",
    see4: "Convertidor de Bases Numéricas",
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
    see1: "Convertisseur de LESS vers CSS",
    see2: "Convertisseur de XML vers JSON",
    see3: "Convertisseur de JSON vers XML",
    see4: "Convertisseur de Bases Numériques",
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
    see1: "Convertitore da LESS a CSS",
    see2: "Convertitore da XML a JSON",
    see3: "Convertitore da JSON a XML",
    see4: "Convertitore di Basi Numeriche",
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
    see1: "Konverter LESS ke CSS",
    see2: "Konverter XML ke JSON",
    see3: "Konverter JSON ke XML",
    see4: "Konverter Basis Angka",
    f_1: "Enkode URL untuk transmisi web yang aman",
    f_2: "Dekode URL yang dienkode ke format yang mudah dibaca",
    f_3: "Enkode dan dekode instan",
    f_4: "Pemrosesan di browser — tidak ada data yang dikirim ke server"
  }
}
</i18n>
