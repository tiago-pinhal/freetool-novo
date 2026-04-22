<script setup lang="ts">
useScript('https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.js', {
  trigger: 'client'
})

const { t, locale } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  type: 'tool',
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') }
  ],
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

// Tool State
const state = reactive({ 
  text: '', 
  md5: '' 
})

// Reset MD5 when text changes
watch(() => state.text, () => {
  state.md5 = ''
})

/**
 * Calculates the MD5 Hash using the global md5 function
 */
function calc() {
  const md5Fn = (window as any).md5
  
  if (!md5Fn) {
    if (process.client) {
      document.location.reload()
    }
    return
  }

  if (state.text.trim() !== '') {
    state.md5 = md5Fn(state.text)
  }
}

// Localized Routes
defineI18nRoute({
  paths: {
    en: '/md5-hash-generator',
    pt: '/gerador-de-hash-md5',
    es: '/generador-de-hash-md5',
    fr: '/generateur-de-hash-md5',
    it: '/generatore-di-hash-md5',
    id: '/generator-hash-md5'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.md5"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/MD5`"
    :wiki-label="'Wikipedia (MD5)'"
    :see-also-links="[
      { label: t('see1'), to: 'bcrypt-generator' },
      { label: t('see2'), to: 'json-viewer' },
      { label: t('see3'), to: 'email-extractor' },
      { label: t('see4'), to: 'xml-to-json-converter' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Input Area -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content/80">{{ t('plc') }}</span>
        </label>
        <textarea 
          v-model="state.text"
          rows="6"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl font-mono text-lg leading-relaxed" 
          placeholder="..."
          autofocus
        ></textarea>
      </div>

      <!-- Action Button -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <ButtonPrimary 
          @click="calc"
          icon="heroicons:variable-20-solid"
          :disabled="!state.text.trim()"
          class="w-full sm:w-auto"
        >
          {{ t('bt') }} {{ $i18n.locale == 'en' ? 'MD5 Hash' : 'Hash MD5' }}
        </ButtonPrimary>
      </div>

      <!-- Result Area -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <Blockcopy v-if="state.md5" :label="t('result')" :content="state.md5">
          {{ state.md5 }}
        </Blockcopy>
      </Transition>
    </div>
    <template #info>
      <div class="space-y-4">
        <p>{{ t('desc') }}</p>
        <div class="font-bold mb-2">{{ t('how_title') }}</div>
        <ul class="list-disc list-inside space-y-1 mb-4">
          <li>{{ t('how_1') }}</li>
          <li>{{ t('how_2') }}</li>
        </ul>
        <div class="bg-warning/10 p-4 rounded-xl border border-warning/20">
          <div class="font-bold mb-2 text-warning flex items-center gap-2">
            <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5" />
            {{ t('tip_title') }}
          </div>
          <ul class="list-disc list-inside text-sm space-y-1 text-base-content/80">
            <li>{{ t('tip_security') }}</li>
            <li>{{ t('tip_usage') }}</li>
          </ul>
        </div>
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "MD5 Hash Generator",
    meta: "Easily calculate the MD5 hash (128-bit fingerprint) of any text and verify data integrity by comparing hashes.",
    desc: "MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash algorithm that produces a 128-bit (32-character) fingerprint for any input text or data. It is primarily used to verify data integrity, as it will generate a unique and consistent hash, regardless of the size of the input data. Thus, even the slightest change in the input alters this code, making it easy to identify any modifications. MD5 is often used to verify that a file has not been altered, although for high-security password hashing, more modern algorithms like SHA-256 or Bcrypt are recommended.",
    bt: "Calculate",
    plc: "Text to hash",
    see1: "Bcrypt Generator",
    see2: "JSON Viewer",
    see3: "Email Extractor",
    see4: "XML to JSON Converter",
    tip_title: "Security Warning",
    tip_security: "MD5 is not safe for password hashing as it's vulnerable to collision attacks.",
    tip_usage: "We recommend using Bcrypt for security. MD5 is best suited for file integrity (Checksum).",
    result: "Result",
    how_title: "How to use",
    how_1: "Enter or paste the text you want to use and click Calculate MD5 Hash.",
    how_2: "To verify integrity between different contents, generate the hash for both and compare the results.",
    f_1: "Fast MD5 hash calculation",
    f_2: "128-bit digital fingerprinting",
    f_3: "Data integrity verification",
    f_4: "No registration or installation required"
  },
  pt: {
    title: "Gerador de Hash MD5",
    meta: "Calcule facilmente o hash MD5 (impressão digital de 128 bits) de qualquer texto e verifique a integridade dos dados comparando os hashes.",
    desc: "O MD5 (Message Digest Algorithm 5) é um algoritmo de hash criptográfico bastante utilizado, que produz uma impressão digital de 128 bits (32 caracteres) para qualquer texto ou conjunto de dados. Ele é usado principalmente para verificar a integridade dos dados, pois gera um hash único e consistente. Até a menor alteração na entrada modifica esse código, permitindo identificar facilmente qualquer alteração nos dados originais. Embora útil para verificação de arquivos, para segurança de senhas recomenda-se algoritmos mais robustos como SHA-256 ou Bcrypt.",
    bt: "Calcular",
    plc: "Texto para gerar o hash",
    see1: "Gerador Bcrypt",
    see2: "Visualizador de JSON",
    see3: "Extrator de E-mails",
    see4: "Conversor de XML para JSON",
    tip_title: "Aviso de Segurança",
    tip_security: "O MD5 não é seguro para senhas por ser vulnerável a colisões.",
    tip_usage: "Recomendamos o uso de Bcrypt para segurança de senhas. O MD5 é ideal para verificar a integridade de arquivos (Checksum).",
    result: "Resultado",
    how_title: "Como usar",
    how_1: "Digite ou cole o texto que deseja usar e clique em Calcular Hash MD5.",
    how_2: "Para verificar a integridade entre diferentes conteúdos, gere o hash de ambos e compare os resultados.",
    f_1: "Cálculo rápido de hash MD5",
    f_2: "Impressão digital de 128 bits",
    f_3: "Verificação de integridade de dados",
    f_4: "Sem necessidade de cadastro ou instalação"
  },
  es: {
    title: "Generador de Hash MD5",
    meta: "Calcula fácilmente el hash MD5 (huella digital de 128 bits) de cualquier texto y verifica la integridad de tus datos comparando los hashes.",
    desc: "MD5 (Algoritmo de Resumen del Mensaje 5) es un algoritmo de hash criptográfico muy utilizado que produce una huella digital de 128 bits (32 caracteres) para cualquier texto o datos de entrada. Se utiliza principalmente para verificar la integridad de los datos, ya que genera un hash único y consistente. Incluso el cambio más mínimo en el texto de entrada altera este código, lo que facilita la identificación de cualquier modificación. Para la seguridad de las contraseñas, se recomienda el uso de algoritmos más modernos como SHA-256 o Bcrypt.",
    bt: "Calcular",
    plc: "Texto para generar el hash",
    see1: "Generador Bcrypt",
    see2: "Visor de JSON",
    see3: "Extractor de Correos Electrónicos",
    see4: "Convertidor de XML a JSON",
    tip_title: "Aviso de Seguridad",
    tip_security: "MD5 no es seguro para contraseñas ya que es vulnerable a ataques de colisión.",
    tip_usage: "Recomendamos usar Bcrypt para mayor seguridad. MD5 es ideal para verificar la integridad de archivos (Checksum).",
    result: "Resultado",
    how_title: "Cómo usar",
    how_1: "Escribe o pega el texto que quieres usar y haz clic en Calcular Hash MD5.",
    how_2: "Para verificar la integridad entre contenidos diferentes, genera el hash de ambos y compara los resultados.",
    f_1: "Cálculo rápido de hash MD5",
    f_2: "Huella digital de 128 bits",
    f_3: "Verificación de integridad de datos",
    f_4: "Sin necesidad de registro ni instalación"
  },
  fr: {
    title: "Générateur de Hash MD5",
    meta: "Calculez facilement le hash MD5 (empreinte 128 bits) de n'importe quel texte et vérifiez l'intégrité des données en comparant les hachages.",
    desc: "Le MD5 (Message Digest Algorithm 5) est un algorithme de hachage cryptographique largement utilisé qui produit une empreinte numérique de 128 bits (32 caractères) pour n'importe quel texte ou jeu de données. Il sert principalement à vérifier l'intégrité des données, car il génère un hachage unique et constant. La moindre modification de l'entrée change ce code, ce qui permet de repérer facilement toute altération. Pour le hachage sécurisé des mots de passe, des algorithmes plus récents comme SHA-256 ou Bcrypt sont recommandés.",
    bt: "Calculer",
    plc: "Texte à hacher",
    see1: "Générateur Bcrypt",
    see2: "Visualiseur JSON",
    see3: "Extracteur d'e-mails",
    see4: "Convertisseur de XML vers JSON",
    tip_title: "Avertissement de Sécurité",
    tip_security: "MD5 n'est pas sûr pour les mots de passe car il est vulnérable aux collisions.",
    tip_usage: "Nous recommandons d'utiliser Bcrypt pour la sécurité. MD5 est parfait pour vérifier l'intégrité des fichiers (Checksum).",
    result: "Résultat",
    how_title: "Comment utiliser l'outil",
    how_1: "Saisissez ou collez le texte à utiliser, puis cliquez sur Calculer le Hash MD5.",
    how_2: "Pour vérifier l'intégrité entre différents contenus, générez le hachage des deux et comparez les résultats.",
    f_1: "Calcul rapide de hash MD5",
    f_2: "Empreinte numérique 128 bits",
    f_3: "Vérification de l'intégrité des données",
    f_4: "Aucune inscription ou installation requise"
  },
  it: {
    title: "Generatore di Hash MD5",
    meta: "Calcola l'hash MD5 (impronta a 128 bit) di qualsiasi testo e verifica l'integrità dei dati confrontando gli hash.",
    desc: "L'MD5 (Message Digest Algorithm 5) è un algoritmo di hash crittografico ampiamente utilizzato che produce un'impronta digitale di 128 bit (32 caratteri) per qualsiasi testo o dato in input. Viene usato soprattutto per verificare l'integrità dei dati, perché genera un hash unico e coerente. Anche la modifica più piccola dell'input cambia questo codice, rendendo semplice individuare eventuali alterazioni. Per la sicurezza delle password, sono consigliati algoritmi più moderni e robusti come SHA-256 o Bcrypt.",
    bt: "Calcola",
    plc: "Testo per generare l'hash",
    see1: "Generatore Bcrypt",
    see2: "Visualizzatore di JSON",
    see3: "Estrattore di Email",
    see4: "Convertitore da XML a JSON",
    tip_title: "Avviso di Sicurezza",
    tip_security: "MD5 non è sicuro per le password perché vulnerabile alle collisioni.",
    tip_usage: "Raccomandiamo di usare Bcrypt per la sicurezza. MD5 è ideale per verificare l'integrità dei file (Checksum).",
    result: "Risultato",
    how_title: "Come usare lo strumento",
    how_1: "Digita o incolla il testo da usare e fai clic su Calcola Hash MD5.",
    how_2: "Per verificare l'integrità tra contenuti diversi, genera l'hash di entrambi e confronta i risultati.",
    f_1: "Calcolo rapido hash MD5",
    f_2: "Impronta digitale a 128 bit",
    f_3: "Verifica integrità dati",
    f_4: "Nessuna registrazione o installazione"
  },
  id: {
    title: "Generator Hash MD5",
    meta: "Hitung hash MD5 (sidik jari 128-bit) dengan mudah untuk teks apa pun dan verifikasi integritas data dengan membandingkan hash.",
    desc: "MD5 (Message Digest Algorithm 5) adalah algoritma hash kriptografi yang banyak digunakan yang menghasilkan sidik jari 128-bit (32-karakter) untuk teks atau data input apa pun. Ini terutama digunakan untuk memverifikasi integritas data, karena akan menghasilkan hash yang unik dan konsisten. Bahkan sedikit perubahan pada teks input akan mengubah kode ini, sehingga memudahkan untuk mengidentifikasi setiap perubahan pada data asli. Untuk keamanan kata sandi, algoritma yang lebih kuat seperti SHA-256 atau Bcrypt sangat disarankan. Semua pemrosesan dilakukan di browser Anda dan tidak diperlukan instalasi.",
    bt: "Hitung",
    plc: "Teks untuk dibuat hash",
    see1: "Generator Bcrypt",
    see2: "Penampil JSON",
    see3: "Ekstraktor Email",
    see4: "Konverter XML ke JSON",
    tip_title: "Peringatan Keamanan",
    tip_security: "MD5 tidak aman untuk kata sandi karena rentan terhadap collision attacks.",
    tip_usage: "Kami menyarankan penggunaan Bcrypt untuk keamanan. MD5 paling cocok untuk integritas file (Checksum).",
    result: "Hasil",
    how_title: "Cara menggunakan alat ini",
    how_1: "Ketik atau tempel teks yang ingin Anda gunakan, lalu klik Hitung Hash MD5.",
    how_2: "Untuk memverifikasi integritas antara konten yang berbeda, buat hash untuk keduanya lalu bandingkan hasilnya.",
    f_1: "Perhitungan hash MD5 yang cepat",
    f_2: "Sidik jari digital 128-bit",
    f_3: "Verifikasi integritas data",
    f_4: "Tanpa pendaftaran atau instalasi"
  }
}
</i18n>
