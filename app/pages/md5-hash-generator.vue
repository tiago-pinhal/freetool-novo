<script setup lang="ts">
useScript('https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.js', {
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
    if (import.meta.client) {
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
    id: '/generator-hash-md5',
    de: '/md5-hash-generator',
    nl: '/md5-hash-generator'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.md5"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/MD5`"
    wiki-label="MD5"
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
          <span class="label-text font-bold text-base-content">{{ t('plc') }}</span>
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
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <!-- Features -->
        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
          icon="heroicons:shield-check-20-solid"
        />

        <!-- How to Use -->
        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />
     
        <div class="bg-warning/10 p-4 rounded-xl border border-warning/20">
          <div class="font-bold mb-2 text-warning flex items-center gap-2">
            <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5" />
            {{ t('tip_title') }}
          </div>
          <ul class="list-disc list-inside text-sm space-y-1">
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
    features_title: "Features",
    plc: "Text to hash",
    see1: "Bcrypt",
    see2: "JSON Viewer",
    see3: "Email Extractor",
    see4: "XML → JSON",
    tip_title: "Security Warning",
    tip_security: "MD5 is not safe for password hashing as it's vulnerable to collision attacks.",
    tip_usage: "We recommend using Bcrypt for security. MD5 is best suited for file integrity (Checksum).",
    result: "Result",
    how_to_use_title: "How to use",
    step_1_title: "Enter Text",
    step_1_desc: "Type or paste the source text into the input area.",
    step_2_title: "Generate Hash",
    step_2_desc: "Click the 'Calculate MD5 Hash' button to process the text.",
    step_3_title: "Copy Result",
    step_3_desc: "The unique 32-character MD5 hash will be generated instantly for you to copy.",
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
    features_title: "Funcionalidades",
    plc: "Texto para gerar o hash",
    see1: "Bcrypt",
    see2: "Visualizador de JSON",
    see3: "Extrator de E-mails",
    see4: "XML → JSON",
    tip_title: "Aviso de Segurança",
    tip_security: "O MD5 não é seguro para senhas por ser vulnerável a colisões.",
    tip_usage: "Recomendamos o uso de Bcrypt para segurança de senhas. O MD5 é ideal para verificar a integridade de arquivos (Checksum).",
    result: "Resultado",
    how_to_use_title: "Como usar",
    step_1_title: "Digite o Texto",
    step_1_desc: "Digite ou cole o texto de origem na área de entrada.",
    step_2_title: "Gere o Hash",
    step_2_desc: "Clique no botão 'Calcular Hash MD5' para processar o texto.",
    step_3_title: "Copie o Resultado",
    step_3_desc: "O hash MD5 exclusivo de 32 caracteres será gerado instantaneamente para você copiar.",
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
    features_title: "Funcionalidades",
    plc: "Texto para generar el hash",
    see1: "Bcrypt",
    see2: "Visor de JSON",
    see3: "Extractor de Emails",
    see4: "XML → JSON",
    tip_title: "Aviso de Seguridad",
    tip_security: "MD5 no es seguro para contraseñas ya que es vulnerable a ataques de colisión.",
    tip_usage: "Recomendamos usar Bcrypt para mayor seguridad. MD5 es ideal para verificar la integridad de archivos (Checksum).",
    result: "Resultado",
    how_to_use_title: "Cómo usar",
    step_1_title: "Ingrese el Texto",
    step_1_desc: "Escriba o pegue el texto de origen en el área de entrada.",
    step_2_title: "Generar Hash",
    step_2_desc: "Haga clic en el botón 'Calcular Hash MD5' para procesar el texto.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "El hash MD5 único de 32 caracteres se generará al instante para que lo copies.",
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
    features_title: "Fonctionnalités",
    plc: "Texte à hacher",
    see1: "Bcrypt",
    see2: "Visualiseur JSON",
    see3: "Extracteur d'Emails",
    see4: "XML → JSON",
    tip_title: "Avertissement de Sécurité",
    tip_security: "MD5 n'est pas sûr pour les mots de passe car il est vulnérable aux collisions.",
    tip_usage: "Nous recommandons d'utiliser Bcrypt pour la sécurité. MD5 est parfait pour vérifier l'intégrité des fichiers (Checksum).",
    result: "Résultat",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Saisir le Texte",
    step_1_desc: "Saisissez ou collez le texte source dans la zone de saisie.",
    step_2_title: "Générer le Hash",
    step_2_desc: "Cliquez sur le bouton 'Calculer le Hash MD5' pour traiter le texte.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "Le hachage MD5 unique de 32 caractères sera généré instantanément pour que vous puissiez le copier.",
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
    features_title: "Funzionalità",
    plc: "Testo per generare l'hash",
    see1: "Bcrypt",
    see2: "Visualizzatore JSON",
    see3: "Estrattore di Email",
    see4: "XML → JSON",
    tip_title: "Avviso di Sicurezza",
    tip_security: "MD5 non è sicuro per le password perché vulnerabile alle collisioni.",
    tip_usage: "Raccomandiamo di usare Bcrypt per la sicurezza. MD5 è ideale per verificare l'integrità dei file (Checksum).",
    result: "Risultato",
    how_to_use_title: "Come usare",
    step_1_title: "Inserisci il Testo",
    step_1_desc: "Digita o incolla il testo sorgente nell'area di input.",
    step_2_title: "Genera Hash",
    step_2_desc: "Clicca sul pulsante 'Calcola Hash MD5' per elaborare il testo.",
    step_3_title: "Copia il Risultato",
    step_3_desc: "L'hash MD5 univoco di 32 caratteri verrà generato istantaneamente per essere copiato.",
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
    features_title: "Fitur",
    plc: "Teks untuk dibuat hash",
    see1: "Bcrypt",
    see2: "Penampil JSON",
    see3: "Ekstraktor Email",
    see4: "XML → JSON",
    tip_title: "Peringatan Keamanan",
    tip_security: "MD5 tidak aman untuk kata sandi karena rentan terhadap collision attacks.",
    tip_usage: "Kami menyarankan penggunaan Bcrypt untuk keamanan. MD5 paling cocok untuk integritas file (Checksum).",
    result: "Hasil",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Masukkan Teks",
    step_1_desc: "Ketik atau tempel teks sumber ke dalam area input.",
    step_2_title: "Buat Hash",
    step_2_desc: "Klik tombol 'Hitung Hash MD5' untuk memproses teks.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Hash MD5 32-karakter yang unik akan dibuat secara instan untuk Anda salin.",
    f_1: "Perhitungan hash MD5 yang cepat",
    f_2: "Sidik jari digital 128-bit",
    f_3: "Verifikasi integritas data",
    f_4: "Tanpa pendaftaran atau instalasi"
  },
  de: {
    title: "MD5-Hash-Generator",
    meta: "Berechne einfach den MD5-Hash (128-Bit-Fingerabdruck) eines beliebigen Textes und prüfe die Datenintegrität durch den Vergleich von Hashes.",
    desc: "MD5 (Message Digest Algorithm 5) ist ein weit verbreiteter kryptografischer Hash-Algorithmus, der für jeden Eingabetext oder Datensatz einen 128-Bit-Fingerabdruck mit 32 Zeichen erzeugt. Er wird hauptsächlich zur Prüfung der Datenintegrität verwendet, da er einen eindeutigen und konsistenten Hash erzeugt. Schon die kleinste Änderung an der Eingabe verändert diesen Code und macht Änderungen leicht erkennbar. Für sicheres Passwort-Hashing werden jedoch modernere Algorithmen wie SHA-256 oder Bcrypt empfohlen.",
    bt: "Berechnen",
    features_title: "Funktionen",
    plc: "Text zum Hashen",
    see1: "Bcrypt",
    see2: "JSON-Betrachter",
    see3: "E-Mail-Extraktor",
    see4: "XML → JSON",
    tip_title: "Sicherheitswarnung",
    tip_security: "MD5 ist für Passwort-Hashing nicht sicher, da es anfällig für Kollisionsangriffe ist.",
    tip_usage: "Wir empfehlen Bcrypt für die Passwortsicherheit. MD5 eignet sich am besten zur Prüfung der Dateiintegrität (Checksum).",
    result: "Ergebnis",
    how_to_use_title: "So verwendest du das Tool",
    step_1_title: "Text eingeben",
    step_1_desc: "Gib den Ausgangstext in das Eingabefeld ein oder füge ihn dort ein.",
    step_2_title: "Hash erzeugen",
    step_2_desc: "Klicke auf die Schaltfläche 'MD5-Hash berechnen', um den Text zu verarbeiten.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Der eindeutige MD5-Hash mit 32 Zeichen wird sofort erzeugt und kann kopiert werden.",
    f_1: "Schnelle MD5-Hash-Berechnung",
    f_2: "Digitaler 128-Bit-Fingerabdruck",
    f_3: "Prüfung der Datenintegrität",
    f_4: "Keine Registrierung oder Installation erforderlich"
  },
  nl: {
    title: "MD5-hashgenerator",
    meta: "Bereken eenvoudig de MD5-hash (128-bits vingerafdruk) van elke tekst en verifieer de integriteit van gegevens door hashes te vergelijken.",
    desc: "MD5 (Message Digest Algorithm 5) is een veelgebruikt cryptografisch hashing-algoritme dat een 128-bits (32 karakters) vingerafdruk produceert voor elke ingevoerde tekst of gegevens. Het wordt voornamelijk gebruikt om de integriteit van gegevens te verifiëren, omdat het een unieke en consistente hash genereert, ongeacht de grootte van de invoergegevens. Zelfs de kleinste verandering in de invoer wijzigt deze code, waardoor eventuele wijzigingen eenvoudig te herkennen zijn. MD5 wordt vaak gebruikt om te controleren of een bestand niet is gewijzigd, hoewel voor veilige wachtwoord-hashing modernere algoritmen zoals SHA-256 of Bcrypt worden aanbevolen.",
    bt: "Berekenen",
    features_title: "Kenmerken",
    plc: "Tekst om te hashen",
    see1: "Bcrypt",
    see2: "JSON-viewer",
    see3: "E-mailextractor",
    see4: "XML → JSON",
    tip_title: "Veiligheidswaarschuwing",
    tip_security: "MD5 is niet veilig voor wachtwoord-hashing omdat het kwetsbaar is voor botsingsaanvallen.",
    tip_usage: "We raden aan om Bcrypt te gebruiken voor de beveiliging van wachtwoorden. MD5 is het meest geschikt voor bestandsintegriteit (Checksum).",
    result: "Resultaat",
    how_to_use_title: "Hoe gebruik je deze tool",
    step_1_title: "Tekst invoeren",
    step_1_desc: "Typ of plak de brontekst in het invoerveld.",
    step_2_title: "Hash genereren",
    step_2_desc: "Klik op de knop 'MD5-hash berekenen' om de tekst te verwerken.",
    step_3_title: "Resultaat kopiëren",
    step_3_desc: "De unieke 32-karakter MD5-hash wordt direct gegenereerd zodat je deze kunt kopiëren.",
    f_1: "Snelle MD5-hashberekening",
    f_2: "128-bits digitale vingerafdruk",
    f_3: "Verificatie van gegevensintegriteit",
    f_4: "Geen registratie of installatie vereist"
  }
}
</i18n>
