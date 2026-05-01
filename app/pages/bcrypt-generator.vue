<script setup lang="ts">
useScript('https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js', {
  trigger: 'onNuxtReady'
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
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
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
    id: '/generator-bcrypt',
    de: '/bcrypt-generator-und-pruefer',
    nl: '/bcrypt-generator-en-checker'
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
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
        />
        
        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') },
            { title: t('uc_4_title'), description: t('uc_4_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <div class="bg-base-300/30 p-4 rounded-xl border border-base-content/20">
          <div class="font-bold mb-2">💡 {{ t('tip') }}</div>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ t('tip_rounds') }}</li>
            <li>{{ t('tip_salt') }}</li>
          </ul>
        </div>
      </div>
    </template>

    <ToolTabs 
      v-model:activeTab="currentTab"
      :tabs="[
        { id: 'gen', label: t('bt') },
        { id: 'check', label: t('check') }
      ]"
    >
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
    features_title: "Features",
    plc: "Text to hash",
    plcgen: "Bcrypt hash",
    plcver: "Original text",
    match: "The hash matches the provided text.",
    notmatch: "The hash does not match the provided text.",
    rounds: "Cost factor (Rounds)",
    see1: "MD5",
    see2: "JSON Viewer",
    see3: "Email Extractor",
    see4: "XML → JSON",
    tip: "Quick Tip:",
    result: "Result",
    use_cases_title: "Common Use Cases",
    uc_1_title: "Password Storage",
    uc_1_desc: "Securely hash user passwords before storing them in your database.",
    uc_2_title: "Security Testing",
    uc_2_desc: "Test authentication flows and login systems with valid Bcrypt hashes.",
    uc_3_title: "Legacy Migration",
    uc_3_desc: "Verify and update old password hashes during system migrations.",
    uc_4_title: "Learning & Dev",
    uc_4_desc: "Understand how salt and cost factors (rounds) impact hash security.",
    how_to_use_title: "How to use",
    step_1_title: "Generate Hash",
    step_1_desc: "Enter the source text, choose the number of Rounds, and click Generate Hash.",
    step_2_title: "Verify Hash",
    step_2_desc: "Paste the Bcrypt hash, enter the original text, and click Verify Hash.",
    step_3_title: "Copy Results",
    step_3_desc: "Use the copy button next to the hash or the comparison result for your application.",
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
    features_title: "Funcionalidades",
    plc: "Texto para gerar o hash",
    plcgen: "Hash Bcrypt",
    plcver: "Texto original",
    match: "O hash corresponde ao texto informado.",
    notmatch: "O hash não corresponde ao texto informado.",
    rounds: "Fator de custo (Rounds)",
    see1: "MD5",
    see2: "Visualizador de JSON",
    see3: "Extrator de E-mails",
    see4: "XML → JSON",
    tip: "Dica Rápida:",
    result: "Resultado",
    use_cases_title: "Casos de Uso Comuns",
    uc_1_title: "Armazenamento de Senhas",
    uc_1_desc: "Gere hashes seguros de senhas de usuários antes de salvá-las no banco de dados.",
    uc_2_title: "Testes de Segurança",
    uc_2_desc: "Teste fluxos de autenticação e sistemas de login com hashes Bcrypt válidos.",
    uc_3_title: "Migração de Sistemas",
    uc_3_desc: "Verifique e atualize hashes de senhas antigos durante migrações de sistema.",
    uc_4_title: "Educação e Dev",
    uc_4_desc: "Entenda como o salt e os rounds impactam a segurança do hash.",
    how_to_use_title: "Como usar",
    step_1_title: "Gerar Hash",
    step_1_desc: "Informe o texto de origem, escolha a quantidade de Rounds e clique em Gerar Hash.",
    step_2_title: "Verificar Hash",
    step_2_desc: "Cole o Hash Bcrypt, informe o texto original e clique em Verificar Hash.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "Utilize o botão de copiar ao lado do hash ou o resultado da comparação em sua aplicação.",
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
    features_title: "Funcionalidades",
    plc: "Texto para generar el hash",
    plcgen: "Hash Bcrypt",
    plcver: "Texto original",
    match: "El hash coincide con el texto proporcionado.",
    notmatch: "El hash no coincide con el texto proporcionado.",
    rounds: "Factor de costo (Rounds)",
    see1: "MD5",
    see2: "Visor de JSON",
    see3: "Extractor de Emails",
    see4: "XML → JSON",
    tip: "Consejo Rápido:",
    result: "Resultado",
    use_cases_title: "Casos de Uso Comunes",
    uc_1_title: "Almacenamiento de Contraseñas",
    uc_1_desc: "Genere hashes seguros de contraseñas antes de guardarlas en la base de datos.",
    uc_2_title: "Pruebas de Seguridad",
    uc_2_desc: "Pruebe flujos de autenticación y sistemas de inicio de sesión con hashes válidos.",
    uc_3_title: "Migración de Sistemas",
    uc_3_desc: "Verifique y actualice hashes de contraseñas antiguos durante las migraciones.",
    uc_4_title: "Educación y Dev",
    uc_4_desc: "Comprenda cómo el salt y las rondas afectan la seguridad del hash.",
    how_to_use_title: "Cómo usar",
    step_1_title: "Generar Hash",
    step_1_desc: "Introduce el texto de origen, elige la cantidad de Rounds y haz clic en Generar Hash.",
    step_2_title: "Verificar Hash",
    step_2_desc: "Pega el Hash Bcrypt, introduce el texto original y haz clic en Verificar Hash.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "Usa el botón de copiar junto al hash o el resultado de la comparación en tu aplicación.",
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
    features_title: "Fonctionnalités",
    plc: "Texte à hacher",
    plcgen: "Hachage Bcrypt",
    plcver: "Texte d'origine",
    match: "Le hachage correspond au texte fourni.",
    notmatch: "Le hachage ne correspond pas au texte fourni.",
    rounds: "Facteur de coût (Rounds)",
    see1: "MD5",
    see2: "Visualiseur JSON",
    see3: "Extracteur d'Emails",
    see4: "XML → JSON",
    tip: "Astuce Rapide :",
    result: "Résultat",
    use_cases_title: "Cas d'Usage Courants",
    uc_1_title: "Stockage de Mots de Passe",
    uc_1_desc: "Hachez en toute sécurité les mots de passe avant de les stocker en base de données.",
    uc_2_title: "Tests de Sécurité",
    uc_2_desc: "Testez les flux d'authentification avec des hachages Bcrypt valides.",
    uc_3_title: "Migration de Systèmes",
    uc_3_desc: "Vérifiez et mettez à jour les anciens hachages lors des migrations de système.",
    uc_4_title: "Éducation et Dev",
    uc_4_desc: "Comprenez comment le sel et les rounds impactent la sécurité du hachage.",
    how_to_use_title: "Comment utiliser l'outil",
    step_1_title: "Générer le Hachage",
    step_1_desc: "Saisissez le texte source, choisissez le nombre de Rounds et cliquez sur Générer le Hachage.",
    step_2_title: "Vérifier le Hachage",
    step_2_desc: "Collez le hachage Bcrypt, saisissez le texte d'origine et cliquez sur Vérifier le Hachage.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "Utilisez le bouton de copie à côté du hachage ou le résultat de la comparaison.",
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
    features_title: "Funzionalità",
    plc: "Testo per generare l'hash",
    plcgen: "Hash Bcrypt",
    plcver: "Testo originale",
    match: "L'hash corrisponde al testo fornito.",
    notmatch: "L'hash non corrisponde al testo fornito.",
    rounds: "Fattore di costo (Rounds)",
    see1: "MD5",
    see2: "Visualizzatore JSON",
    see3: "Estrattore di Email",
    see4: "XML → JSON",
    tip: "Consiglio Rapido:",
    result: "Risultato",
    use_cases_title: "Casi d'Uso Comuni",
    uc_1_title: "Archiviazione Password",
    uc_1_desc: "Esegui l'hashing sicuro delle password prima di memorizzarle nel database.",
    uc_2_title: "Test di Sicurezza",
    uc_2_desc: "Testa i flussi di autenticazione e i sistemi di login con hash Bcrypt validi.",
    uc_3_title: "Migrazione Sistemi",
    uc_3_desc: "Verifica e aggiorna i vecchi hash delle password durante le migrazioni.",
    uc_4_title: "Formazione e Dev",
    uc_4_desc: "Comprendi come il salt e i round influiscono sulla sicurezza dell'hash.",
    how_to_use_title: "Come usare lo strumento",
    step_1_title: "Genera Hash",
    step_1_desc: "Inserisci il testo di origine, scegli il numero di Rounds e fai clic su Genera Hash.",
    step_2_title: "Verifica Hash",
    step_2_desc: "Incolla l'Hash Bcrypt, inserisci il testo originale e fai clic su Verifica Hash.",
    step_3_title: "Copia Risultato",
    step_3_desc: "Usa il pulsante di copia accanto all'hash o il risultato del confronto per la tua app.",
    tip_rounds: "Rounds: Valori più alti sono più sicuri, ma richiedono più tempo di elaborazione.",
    tip_salt: "Salt: Incluso automaticamente per aiutare a prevenire gli attacchi con rainbow table.",
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
    features_title: "Fitur",
    plc: "Teks untuk dibuat hash",
    plcgen: "Hash Bcrypt",
    plcver: "Teks asli",
    match: "Hash cocok dengan teks yang diberikan.",
    notmatch: "Hash tidak cocok dengan teks yang diberikan.",
    rounds: "Faktor biaya (Rounds)",
    see1: "MD5",
    see2: "Penampil JSON",
    see3: "Ekstraktor Email",
    see4: "XML → JSON",
    tip: "Tips Cepat:",
    result: "Hasil",
    use_cases_title: "Kasus Penggunaan Umum",
    uc_1_title: "Penyimpanan Kata Sandi",
    uc_1_desc: "Buat hash kata sandi pengguna dengan aman sebelum menyimpannya di database.",
    uc_2_title: "Pengujian Keamanan",
    uc_2_desc: "Uji alur autentikasi dan sistem login dengan hash Bcrypt yang valid.",
    uc_3_title: "Migrasi Sistem",
    uc_3_desc: "Verifikasi dan perbarui hash kata sandi lama selama migrasi sistem.",
    uc_4_title: "Edukasi & Dev",
    uc_4_desc: "Pahami bagaimana salt dan round berdampak pada keamanan hash.",
    how_to_use_title: "Cara menggunakan alat ini",
    step_1_title: "Buat Hash",
    step_1_desc: "Masukkan teks sumber, pilih jumlah Rounds, lalu klik Buat Hash.",
    step_2_title: "Verifikasi Hash",
    step_2_desc: "Tempel Hash Bcrypt, masukkan teks asli, lalu klik Verifikasi Hash.",
    step_3_title: "Salin Hasil",
    step_3_desc: "Gunakan tombol salin di samping hash atau hasil perbandingan untuk aplikasi Anda.",
    tip_rounds: "Rounds: Nilai yang lebih tinggi lebih aman, tetapi membutuhkan waktu pemrosesan lebih lama.",
    tip_salt: "Salt: Disertakan secara otomatis untuk mencegah serangan rainbow table.",
    f_1: "Pembuatan Hash Bcrypt yang aman",
    f_2: "Jumlah rounds yang dapat disesuaikan (4-20)",
    f_3: "Verifikasi hash waktu nyata",
    f_4: "Pemrosesan sisi klien untuk privasi total"
  },
  de: {
    title: "Bcrypt-Generator und Prüfer",
    meta: "Erzeuge sichere Bcrypt-Hashes aus beliebigem Text mit anpassbaren Rounds oder prüfe, ob ein vorhandener Hash zu einem bestimmten Text passt.",
    desc: "Bcrypt ist ein sicherer Hashing-Algorithmus, der häufig für Passwörter verwendet wird. Jeder Hash enthält einen eindeutigen Salt, um Angriffe mit Rainbow Tables zu erschweren. Die Einstellung Rounds steuert den Rechenaufwand: Höhere Werte sind langsamer, machen Brute-Force-Angriffe aber deutlich schwieriger. Auch bei gleichem Text ist jeder erzeugte Hash unterschiedlich.",
    check: "Hash prüfen",
    bt: "Hash erzeugen",
    features_title: "Funktionen",
    plc: "Text zum Hashen",
    plcgen: "Bcrypt-Hash",
    plcver: "Originaltext",
    match: "Der Hash stimmt mit dem angegebenen Text überein.",
    notmatch: "Der Hash stimmt nicht mit dem angegebenen Text überein.",
    rounds: "Kostenfaktor (Rounds)",
    see1: "MD5",
    see2: "JSON-Betrachter",
    see3: "E-Mail-Extraktor",
    see4: "XML → JSON",
    tip: "Kurztipp:",
    result: "Ergebnis",
    use_cases_title: "Häufige Anwendungsfälle",
    uc_1_title: "Passwortspeicherung",
    uc_1_desc: "Hashen Sie Passwörter sicher, bevor Sie sie in der Datenbank speichern.",
    uc_2_title: "Sicherheitstests",
    uc_2_desc: "Testen Sie Authentifizierungsabläufe mit gültigen Bcrypt-Hashes.",
    uc_3_title: "Systemmigration",
    uc_3_desc: "Überprüfen und aktualisieren Sie alte Passwort-Hashes bei Migrationen.",
    uc_4_title: "Lernen & Dev",
    uc_4_desc: "Verstehen Sie, wie Salt und Rounds die Hash-Sicherheit beeinflussen.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Hash erzeugen",
    step_1_desc: "Geben Sie den Ausgangstext ein, wählen Sie die Anzahl der Rounds und klicken Sie auf Hash erzeugen.",
    step_2_title: "Hash prüfen",
    step_2_desc: "Fügen Sie den Bcrypt-Hash ein, geben Sie den Originaltext ein und klicken Sie auf Hash prüfen.",
    step_3_title: "Ergebnis kopieren",
    step_3_desc: "Nutzen Sie die Kopierschaltfläche neben dem Hash oder das Vergleichsergebnis für Ihre Anwendung.",
    tip_rounds: "Rounds: Höhere Werte sind sicherer, benötigen aber mehr Verarbeitungszeit.",
    tip_salt: "Salt: Wird automatisch eingefügt, um Angriffe mit Rainbow Tables zu erschweren.",
    f_1: "Sichere Erzeugung von Bcrypt-Hashes",
    f_2: "Anpassbare Rounds (4-20)",
    f_3: "Hash-Prüfung in Echtzeit",
    f_4: "Clientseitige Verarbeitung für maximale Privatsphäre"
  },
  nl: {
    title: "Bcrypt-generator en checker",
    meta: "Genereer veilige Bcrypt-hashes van elke tekst met aanpasbare rounds of controleer of een bestaande hash overeenkomt met een specifieke tekst.",
    desc: "Bcrypt is een veilig hashing-algoritme dat veel wordt gebruikt voor wachtwoorden. Elke hash bevat een unieke salt om aanvallen met rainbow tables te bemoeilijken. De instelling 'Rounds' regelt de rekenkracht: hogere waarden zijn trager, maar maken brute-force-aanvallen aanzienlijk moeilijker. Zelfs bij dezelfde tekst is elke gegenereerde hash anders.",
    check: "Hash controleren",
    bt: "Hash genereren",
    features_title: "Kenmerken",
    plc: "Tekst om te hashen",
    plcgen: "Bcrypt-hash",
    plcver: "Originele tekst",
    match: "De hash komt overeen met de opgegeven tekst.",
    notmatch: "De hash komt niet overeen met de opgegeven tekst.",
    rounds: "Kostenfactor (Rounds)",
    see1: "MD5",
    see2: "JSON-viewer",
    see3: "E-mailextractor",
    see4: "XML → JSON",
    tip: "Korte tip:",
    result: "Resultaat",
    use_cases_title: "Veelvoorkomende scenario's",
    uc_1_title: "Wachtwoordopslag",
    uc_1_desc: "Hash wachtwoorden van gebruikers veilig voordat je ze in de database opslaat.",
    uc_2_title: "Beveiligingstesten",
    uc_2_desc: "Test authenticatieflows en loginsystemen met geldige Bcrypt-hashes.",
    uc_3_title: "Systeemmigratie",
    uc_3_desc: "Verifieer en update oude wachtwoordhashes tijdens systeemmigraties.",
    uc_4_title: "Educatie & Dev",
    uc_4_desc: "Begrijp hoe salt en rounds de veiligheid van hashes beïnvloeden.",
    how_to_use_title: "Hoe gebruik je deze tool",
    step_1_title: "Hash genereren",
    step_1_desc: "Voer de brontekst in, selecteer het aantal Rounds en klik op Hash genereren.",
    step_2_title: "Hash verifiëren",
    step_2_desc: "Plak de Bcrypt-hash, voer de originele tekst in en klik op Hash controleren.",
    step_3_title: "Resultaat kopiëren",
    step_3_desc: "Gebruik de kopieerknop naast de hash of het vergelijkingsresultaat voor je applicatie.",
    tip_rounds: "Rounds: Hogere waarden zijn veiliger, maar vereisen meer verwerkingstijd.",
    tip_salt: "Salt: Wordt automatisch toegevoegd om aanvallen met rainbow tables te voorkomen.",
    f_1: "Veilige generatie van Bcrypt-hashes",
    f_2: "Aanpasbaar aantal rounds (4-20)",
    f_3: "Real-time hash-verificatie",
    f_4: "Verwerking aan de clientzijde voor maximale privacy"
  }
}
</i18n>
