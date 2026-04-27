<script setup lang="ts">
useScript('https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js', {
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

// Estados da Ferramenta
const currentTab = ref('gen')
const stateGen = reactive({ 
  text: '', 
  hash: '', 
  round: 12, 
  loading: false 
})

const stateCheck = reactive({
  text: '',
  hash: '',
  check: null as boolean | null
})

watch(() => [stateCheck.text, stateCheck.hash], () => {
  stateCheck.check = null
})

// Opções de Rounds para o Select
const roundOptions = Array.from({ length: 17 }, (_, i) => ({
  label: i + 4,
  value: i + 4
}))

// Função para Gerar Hash
function generate() {
  const bcrypt = (window as any).dcodeIO?.bcrypt
  if (!bcrypt) return

  if (stateGen.text !== '') {
    stateGen.hash = ''
    stateGen.loading = true

    bcrypt.genSalt(stateGen.round, (err: any, salt: string) => {
      if (err) { stateGen.loading = false; return }
      bcrypt.hash(stateGen.text, salt, (err: any, hash: string) => {
        stateGen.loading = false
        if (!err) stateGen.hash = hash
      })
    })
  }
}

// Função para Verificar Hash
function check() {
  const bcrypt = (window as any).dcodeIO?.bcrypt
  if (!bcrypt) return

  bcrypt.compare(stateCheck.text, stateCheck.hash)
    .then((res: boolean) => { stateCheck.check = res })
    .catch(() => { stateCheck.check = false })
}

// Configuração de Rotas Localizadas
defineI18nRoute({
  paths: {
    en: '/bcrypt-generator',
    pt: '/gerador-de-bcrypt',
    es: '/generador-de-bcrypt',
    fr: '/generateur-de-bcrypt',
    it: '/generatore-di-bcrypt',
    id: '/generator-bcrypt'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!stateGen.hash || stateCheck.check !== null"
    :wiki-url="`https://${locale}.wikipedia.org/wiki/Bcrypt`"
    :wiki-label="'Wikipedia (Bcrypt)'"
    :see-also-links="[
      { label: t('see1'), to: 'md5-hash-generator' },
      { label: t('see2'), to: 'json-viewer' },
      { label: t('see3'), to: 'email-extractor' },
      { label: t('see4'), to: 'xml-to-json-converter' }
    ]"
  >
    <template #info>
      <div class="space-y-4">
        <p>{{ t('desc') }}</p>
        <div class="font-bold">{{ t('how_title') }}</div>
        <ul class="list-disc list-inside">
          <li>{{ t('how_gen') }}</li>
          <li>{{ t('how_check') }}</li>
        </ul>
        <div class="bg-base-300/30 p-4 rounded-xl border border-base-content/20">
          <div class="font-bold mb-2">💡 {{ t('tip') }}</div>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ t('tip_rounds') }}</li>
            <li>{{ t('tip_salt') }}</li>
          </ul>
        </div>
      </div>
    </template>

    <!-- Sistema de Abas -->
    <ToolTabs 
      v-model:activeTab="currentTab"
      :tabs="[
        { id: 'gen', label: t('bt') },
        { id: 'check', label: t('check') }
      ]"
    >
      <!-- Conteúdo: Gerador -->
      <template #gen>
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold text-base-content">{{ t('plc') }}</span>
            </label>
            <input 
              v-model="stateGen.text"
              type="text" 
              class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl" 
              placeholder="..."
              autofocus
            />
          </div>

          <div class="flex flex-col sm:flex-row items-end gap-4">
            
            <ToolSelect 
              v-model.number="stateGen.round"
              :label="t('rounds')"
              :options="roundOptions"
              class="sm:w-40"
            />

            <ButtonPrimary 
              @click="generate"
              icon="heroicons:lock-closed-20-solid"
              :is-loading="stateGen.loading"
              :disabled="!stateGen.text"
            >
              {{ t('bt') }}
            </ButtonPrimary>
          </div>

          <!-- Resultado -->
          <Blockcopy v-if="stateGen.hash" :label="t('result')" :content="stateGen.hash">
            {{ stateGen.hash }}
          </Blockcopy>
        </div>
      </template>

      <!-- Conteúdo: Verificador -->
      <template #check>
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold text-base-content">{{ t('plcgen') }}</span>
            </label>
            <input 
              v-model="stateCheck.hash"
              type="text" 
              class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl font-mono text-lg" 
              placeholder="$2a$12$..."
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold text-base-content">{{ t('plcver') }}</span>
            </label>
            <input 
              v-model="stateCheck.text"
              type="text" 
              class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl" 
              placeholder="..."
            />
          </div>

          <ButtonSecondary 
            @click="check"
            icon="heroicons:shield-check-20-solid"
            :disabled="!stateCheck.text || !stateCheck.hash"
          >
            {{ t('check') }}
          </ButtonSecondary>

          <!-- Resultado da Verificação -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
          >
            <div v-if="stateCheck.check !== null" class="alert shadow-lg border-none rounded-2xl" :class="stateCheck.check ? 'bg-success/10 text-success' : 'bg-error/10 text-error'">
              <Icon :name="stateCheck.check ? 'heroicons:check-circle-20-solid' : 'heroicons:x-circle-20-solid'" class="w-6 h-6" />
              <span class="font-bold">{{ t(stateCheck.check ? 'match' : 'notmatch') }}</span>
            </div>
          </Transition>
        </div>
      </template>
    </ToolTabs>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Bcrypt Generator and Verifier",
    meta: "Generate secure Bcrypt hashes from any input text with customizable rounds, or verify whether an existing hash matches a given text.",
    desc: "Bcrypt is a secure hashing algorithm widely used for passwords. It includes a unique salt in every hash to help prevent rainbow table attacks. The Rounds setting controls the computational cost: higher values are slower to process, but make brute-force attacks much harder. Even when the same text is used, each generated hash is different.",
    check: "Verify Hash",
    bt: "Generate Hash",
    plc: "Text to hash",
    plcgen: "Bcrypt hash",
    plcver: "Original text",
    match: "The hash matches the provided text.",
    notmatch: "The hash does not match the provided text.",
    rounds: "Cost factor (Rounds)",
    see1: "MD5 Hash Generator",
    see2: "JSON Viewer",
    see3: "Email Extractor",
    see4: "XML to JSON Converter",
    tip: "Quick Tip:",
    result: "Result",
    how_title: "How to use",
    how_gen: "To generate a hash, enter the source text, choose the number of Rounds, and click Generate Hash.",
    how_check: "To verify a hash, paste the Bcrypt hash, enter the original text, and click Verify Hash.",
    tip_rounds: "Rounds: Higher values are more secure, but they also take longer to process.",
    tip_salt: "Salt: Automatically included to prevent rainbow table attacks.",
    f_1: "Secure Bcrypt hash generation",
    f_2: "Customizable rounds (4-20)",
    f_3: "Real-time hash verification",
    f_4: "Client-side processing for maximum privacy"
  },
  pt: {
    title: "Gerador e Verificador de Bcrypt",
    meta: "Gere hashes Bcrypt seguros a partir de qualquer texto com rounds personalizáveis ou verifique se um hash existente corresponde a um determinado texto.",
    desc: "Bcrypt é um algoritmo de hash seguro, amplamente usado para senhas. Ele inclui um salt exclusivo em cada hash para ajudar a prevenir ataques com rainbow tables. A configuração de Rounds define o custo computacional: quanto maior o valor, mais lento será o processamento, mas mais difícil se torna um ataque de força bruta. Mesmo usando o mesmo texto, cada hash gerado é diferente.",
    check: "Verificar Hash",
    bt: "Gerar Hash",
    plc: "Texto para gerar o hash",
    plcgen: "Hash Bcrypt",
    plcver: "Texto original",
    match: "O hash corresponde ao texto informado.",
    notmatch: "O hash não corresponde ao texto informado.",
    rounds: "Fator de custo (Rounds)",
    see1: "Gerador de Hash MD5",
    see2: "Visualizador de JSON",
    see3: "Extrator de E-mails",
    see4: "Conversor de XML para JSON",
    tip: "Dica Rápida:",
    result: "Resultado",
    how_title: "Como usar",
    how_gen: "Para gerar um hash, informe o texto de origem, escolha a quantidade de Rounds e clique em Gerar Hash.",
    how_check: "Para verificar um hash, cole o Hash Bcrypt, informe o texto original e clique em Verificar Hash.",
    tip_rounds: "Rounds: Valores mais altos são mais seguros, mas aumentam o tempo de processamento.",
    tip_salt: "Salt: Incluído automaticamente para ajudar a prevenir ataques com rainbow tables.",
    f_1: "Geração de Hash Bcrypt seguro",
    f_2: "Rounds personalizáveis (4-20)",
    f_3: "Verificação de hash em tempo real",
    f_4: "Processamento no navegador para total privacidade"
  },
  es: {
    title: "Generador y Verificador de Bcrypt",
    meta: "Genere hashes Bcrypt seguros a partir de cualquier texto con rondas personalizables o verifique si un hash existente coincide con un texto determinado.",
    desc: "Bcrypt es un algoritmo de hash seguro, muy utilizado para contraseñas. Incluye un salt único en cada hash para ayudar a prevenir ataques mediante rainbow tables. El ajuste de Rounds define el costo computacional: cuanto mayor sea el valor, más lento será el proceso, pero más difícil será un ataque de fuerza bruta. Incluso usando el mismo texto, cada hash generado es diferente.",
    check: "Verificar Hash",
    bt: "Generar Hash",
    plc: "Texto para generar el hash",
    plcgen: "Hash Bcrypt",
    plcver: "Texto original",
    match: "El hash coincide con el texto proporcionado.",
    notmatch: "El hash no coincide con el texto proporcionado.",
    rounds: "Factor de costo (Rounds)",
    see1: "Generador de Hash MD5",
    see2: "Visor de JSON",
    see3: "Extractor de Correos Electrónicos",
    see4: "Convertidor de XML a JSON",
    tip: "Consejo Rápido:",
    result: "Resultado",
    how_title: "Cómo usar",
    how_gen: "Para generar un hash, introduce el texto de origen, elige la cantidad de Rounds y haz clic en Generar Hash.",
    how_check: "Para verificar un hash, pega el Hash Bcrypt, introduce el texto original y haz clic en Verificar Hash.",
    tip_rounds: "Rounds: Los valores más altos son más seguros, pero tardan más en procesarse.",
    tip_salt: "Salt: Incluido automáticamente para prevenir ataques de tablas arcoíris.",
    f_1: "Generación de Hash Bcrypt seguro",
    f_2: "Rondas personalizables (4-20)",
    f_3: "Verificación de hash en tiempo real",
    f_4: "Procesamiento en el navegador para total privacidad"
  },
  fr: {
    title: "Générateur et Vérificateur Bcrypt",
    meta: "Générez des hachages Bcrypt sécurisés à partir de n'importe quel texte avec des rounds personnalisables, ou vérifiez si un hachage existant correspond à un texte donné.",
    desc: "Bcrypt est un algorithme de hachage sécurisé, largement utilisé pour les mots de passe. Il inclut un salt unique dans chaque hachage afin d'aider à prévenir les attaques par tables arc-en-ciel. Le paramètre Rounds définit le coût de calcul : plus la valeur est élevée, plus le traitement est lent, mais plus les attaques par force brute deviennent difficiles. Même avec le même texte, chaque hachage généré est différent.",
    check: "Vérifier le Hachage",
    bt: "Générer le Hachage",
    plc: "Texte à hacher",
    plcgen: "Hachage Bcrypt",
    plcver: "Texte d'origine",
    match: "Le hachage correspond au texte fourni.",
    notmatch: "Le hachage ne correspond pas au texte fourni.",
    rounds: "Facteur de coût (Rounds)",
    see1: "Générateur de Hash MD5",
    see2: "Visualiseur JSON",
    see3: "Extracteur d'e-mails",
    see4: "Convertisseur de XML vers JSON",
    tip: "Astuce Rapide :",
    result: "Résultat",
    how_title: "Comment utiliser l'outil",
    how_gen: "Pour générer un hachage, saisissez le texte source, choisissez le nombre de Rounds et cliquez sur Générer le Hachage.",
    how_check: "Pour vérifier un hachage, collez le hachage Bcrypt, saisissez le texte d'origine et cliquez sur Vérifier le Hachage.",
    tip_rounds: "Rounds : Des valeurs plus élevées sont plus sûres, mais demandent plus de temps de traitement.",
    tip_salt: "Salt : Inclus automatiquement pour aider à prévenir les attaques par tables arc-en-ciel.",
    f_1: "Génération sécurisée de hachages Bcrypt",
    f_2: "Nombre de rounds personnalisable (4-20)",
    f_3: "Vérification de hachage en temps réel",
    f_4: "Traitement côté client pour une confidentialité maximale"
  },
  it: {
    title: "Generatore e Verificatore Bcrypt",
    meta: "Genera Hash Bcrypt sicuri da qualsiasi testo con round personalizzabili oppure verifica se un hash esistente corrisponde a un testo specifico.",
    desc: "Bcrypt è un algoritmo di hashing sicuro, ampiamente usato per le password. Include un salt univoco in ogni hash per aiutare a prevenire gli attacchi basati su rainbow table. L'impostazione dei Rounds definisce il costo computazionale: più alto è il valore, più lento sarà il processo, ma più difficile diventerà un attacco brute-force. Anche usando lo stesso testo, ogni hash generato è diverso.",
    check: "Verifica Hash",
    bt: "Genera Hash",
    plc: "Testo per generare l'hash",
    plcgen: "Hash Bcrypt",
    plcver: "Testo originale",
    match: "L'hash corrisponde al testo fornito.",
    notmatch: "L'hash non corrisponde al testo fornito.",
    rounds: "Fattore di costo (Rounds)",
    see1: "Generatore di Hash MD5",
    see2: "Visualizzatore di JSON",
    see3: "Estrattore di Email",
    see4: "Convertitore da XML a JSON",
    tip: "Consiglio Rapido:",
    tip_rounds: "Rounds: Valori più alti sono più sicuri, ma richiedono più tempo di elaborazione.",
    tip_salt: "Salt: Incluso automaticamente per aiutare a prevenire gli attacchi con rainbow table.",
    result: "Risultato",
    how_title: "Come usare lo strumento",
    how_gen: "Per generare un hash, inserisci il testo di origine, scegli il numero di Rounds e fai clic su Genera Hash.",
    how_check: "Per verificare un hash, incolla l'Hash Bcrypt, inserisci il testo originale e fai clic su Verifica Hash.",
    f_1: "Generazione sicura di Hash Bcrypt",
    f_2: "Numero di rounds personalizzabile (4-20)",
    f_3: "Verifica dell'hash in tempo reale",
    f_4: "Elaborazione lato client per la massima privacy"
  },
  id: {
    title: "Generator dan Verifikator Bcrypt",
    meta: "Buat Hash Bcrypt yang aman dari teks apa pun dengan round yang dapat disesuaikan, atau verifikasi apakah hash yang ada cocok dengan teks tertentu.",
    desc: "Bcrypt adalah algoritma hashing yang aman dan banyak digunakan untuk kata sandi. Setiap hash menyertakan salt unik untuk membantu mencegah serangan rainbow table. Pengaturan Rounds menentukan biaya komputasi: semakin tinggi nilainya, semakin lama prosesnya, tetapi semakin sulit serangan brute-force dilakukan. Bahkan untuk teks yang sama, setiap hash yang dihasilkan akan berbeda.",
    check: "Verifikasi Hash",
    bt: "Buat Hash",
    plc: "Teks untuk dibuat hash",
    plcgen: "Hash Bcrypt",
    plcver: "Teks asli",
    match: "Hash cocok dengan teks yang diberikan.",
    notmatch: "Hash tidak cocok dengan teks yang diberikan.",
    rounds: "Faktor biaya (Rounds)",
    see1: "Generator Hash MD5",
    see2: "Penampil JSON",
    see3: "Ekstraktor Email",
    see4: "Konverter XML ke JSON",
    tip: "Tips Cepat:",
    result: "Hasil",
    how_title: "Cara menggunakan alat ini",
    how_gen: "Untuk membuat hash, masukkan teks sumber, pilih jumlah Rounds, lalu klik Buat Hash.",
    how_check: "Untuk memverifikasi hash, tempel Hash Bcrypt, masukkan teks asli, lalu klik Verifikasi Hash.",
    tip_rounds: "Rounds: Nilai yang lebih tinggi lebih aman, tetapi membutuhkan waktu pemrosesan lebih lama.",
    tip_salt: "Salt: Disertakan secara otomatis untuk mencegah serangan rainbow table.",
    f_1: "Pembuatan Hash Bcrypt yang aman",
    f_2: "Jumlah rounds yang dapat disesuaikan (4-20)",
    f_3: "Verifikasi hash waktu nyata",
    f_4: "Pemrosesan sisi klien untuk privasi total"
  }
}
</i18n>
