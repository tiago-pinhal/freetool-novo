<script setup lang="ts">
useScript('https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js', {
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
        <div class="bg-base-300/30 p-4 rounded-xl border border-base-content/5">
          <h4 class="font-bold mb-2">💡 {{ t('tip') }}</h4>
          <ul class="list-disc list-inside text-sm space-y-1">
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
              <span class="label-text font-bold text-base-content/60">{{ t('plc') }}</span>
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
              <span class="label-text font-bold text-base-content/60">{{ t('plcgen') }}</span>
            </label>
            <input 
              v-model="stateCheck.hash"
              type="text" 
              class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl font-mono text-sm" 
              placeholder="$2a$12$..."
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold text-base-content/60">{{ t('plcver') }}</span>
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
    meta: "Generate secure Bcrypt hashes from any input text with customizable rounds, or verify existing hashes against a source string.",
    desc: "Bcrypt is a highly secure hashing method designed for password encryption, incorporating a unique 'Salt' to prevent rainbow table attacks. By adjusting the 'Rounds' parameter, you set the computational cost, making brute-force attempts significantly harder. Even with the same password, each generation produces a different hash, ensuring top-tier security for your data.",
    check: "Verify Match",
    bt: "Generate Hash",
    plc: "Text to encrypt",
    plcgen: "Bcrypt Hash string",
    plcver: "Original text to match",
    match: "The hash matches the text successfully!",
    notmatch: "The hash does not match the provided text.",
    rounds: "Complexity (Rounds)",
    see1: "MD5 Hash Generator",
    see2: "JSON Viewer",
    see3: "Email Extractor",
    see4: "XML to JSON Converter",
    tip: "Quick Tip:",
    result: "Result",
    tip_rounds: "Rounds: Higher values are more secure but increase processing time.",
    tip_salt: "Salt: Automatically included to prevent rainbow table attacks.",
    f_1: "Secure Bcrypt hash generation",
    f_2: "Customizable salt rounds (4-20)",
    f_3: "Real-time hash verification",
    f_4: "Client-side processing for maximum privacy"
  },
  pt: {
    title: "Gerador e Verificador de Bcrypt",
    meta: "Gere hashes Bcrypt seguros a partir de qualquer texto com rounds personalizáveis, ou verifique hashes existentes contra um texto original.",
    desc: "O Bcrypt é um método de hashing amplamente utilizado para criptografar senhas devido à sua resistência a ataques de força bruta. Este algoritmo adiciona sequências aleatórias (Salt) à senha, produzindo resultados complexos e aumentando a segurança. O termo Rounds refere-se ao custo computacional: quanto maior, mais difícil e lento é o processamento, dificultando ataques.",
    check: "Verificar Correspondência",
    bt: "Gerar Hash",
    plc: "Texto para criptografar",
    plcgen: "Insira o Hash Bcrypt",
    plcver: "Texto original para conferir",
    match: "O hash corresponde ao texto com sucesso!",
    notmatch: "O hash não corresponde ao texto informado.",
    rounds: "Complexidade (Rounds)",
    see1: "Gerador de Hash MD5",
    see2: "Visualizador de JSON",
    see3: "Extrator de E-mails",
    see4: "Conversor de XML para JSON",
    tip: "Dica Rápida:",
    result: "Resultado",
    tip_rounds: "Rounds: Valores mais altos são mais seguros, porém aumentam o tempo de processamento.",
    tip_salt: "Salt: Incluído automaticamente para prevenir ataques de dicionário (rainbow tables).",
    f_1: "Geração de hash Bcrypt seguro",
    f_2: "Rounds de salt personalizáveis (4-20)",
    f_3: "Verificação de hash em tempo real",
    f_4: "Processamento no navegador para total privacidade"
  },
  es: {
    title: "Generador y Verificador de Bcrypt",
    meta: "Genere hashes Bcrypt seguros a partir de cualquier texto con rondas personalizables, o verifique hashes existentes.",
    desc: "Bcrypt es un método de cifrado de contraseñas altamente seguro. Utiliza un 'Salt' aleatorio que evita ataques de tablas arcoíris. El factor de costo (Rounds) determina la complejidad computacional, haciendo que los ataques de fuerza bruta sean extremadamente lentos y costosos para un atacante.",
    check: "Verificar Correspondencia",
    bt: "Generar Hash",
    plc: "Texto a cifrar",
    plcgen: "Cadena de hash Bcrypt",
    plcver: "Texto original para comparar",
    match: "¡Éxito! El hash coincide con el texto original.",
    notmatch: "La verificación falló. El hash no coincide con el texto.",
    rounds: "Dificultad (Rounds)",
    see1: "Generador de Hash MD5",
    see2: "Visor de JSON",
    see3: "Extractor de Correos Electrónicos",
    see4: "Convertidor de XML a JSON",
    tip: "Consejo Rápido:",
    result: "Resultado",
    tip_rounds: "Rondas: Valores más altos son más seguros pero más lentos.",
    tip_salt: "Salt: Incluido automáticamente para prevenir ataques de tablas arcoíris.",
    f_1: "Generación de hash Bcrypt seguro",
    f_2: "Rondas de salt personalizables (4-20)",
    f_3: "Verificación de hash en tiempo real",
    f_4: "Procesamiento local para total privacidad"
  },
  fr: {
    title: "Générateur et Vérificateur Bcrypt",
    meta: "Générez des hachages Bcrypt sécurisés avec des cycles personnalisables ou vérifiez la correspondance d'un hachage.",
    desc: "Bcrypt est une méthode de hachage conçue pour sécuriser les mots de passe. Il intègre un 'Salt' unique pour prévenir les attaques par tables arc-en-ciel. Le paramètre 'Rounds' définit le coût de calcul, rendant les tentatives de force brute beaucoup plus difficiles.",
    check: "Vérifier la Correspondance",
    bt: "Générer le Hachage",
    plc: "Texte à chiffrer",
    plcgen: "Chaîne de hachage Bcrypt",
    plcver: "Texte original à vérifier",
    match: "Succès ! Le hachage correspond au texte source.",
    notmatch: "Échec de la vérification. Le hachage ne correspond pas.",
    rounds: "Complexité (Rounds)",
    see1: "Générateur de Hash MD5",
    see2: "Visualiseur JSON",
    see3: "Extracteur d'e-mails",
    see4: "Convertisseur de XML vers JSON",
    tip: "Astuce Rapide :",
    result: "Résultat",
    tip_rounds: "Cycles : Des valeurs plus élevées sont plus sûres mais plus lentes.",
    tip_salt: "Salt : Inclus automatiquement pour prévenir les attaques par tables arc-en-ciel.",
    f_1: "Génération de hash Bcrypt sécurisée",
    f_2: "Cycles de salt personnalisables (4-20)",
    f_3: "Vérification de hachage en temps réel",
    f_4: "Traitement côté client pour la confidentialité"
  },
  it: {
    title: "Generatore e Verificatore Bcrypt",
    meta: "Genera hash Bcrypt sicuri con round personalizzabili o verifica la corrispondenza tra un hash e un testo di input.",
    desc: "Bcrypt è uno standard di hashing per proteggere le password. Utilizza un 'Salt' casuale per ogni password, assicurando che hash identici non corrispondano mai allo stesso testo, aumentando drasticamente la sicurezza contro attacchi brute-force.",
    check: "Verifica Corrispondenza",
    bt: "Genera Hash",
    plc: "Testo da crittografare",
    plcgen: "Stringa hash Bcrypt",
    plcver: "Testo originale da confrontare",
    match: "Successo! L'hash corrisponde al testo originale.",
    notmatch: "Verifica fallita. L'hash non corrisponde al testo.",
    rounds: "Difficoltà (Rounds)",
    see1: "Generatore di Hash MD5",
    see2: "Visualizzatore di JSON",
    see3: "Estrattore di Email",
    see4: "Convertitore da XML a JSON",
    tip: "Consiglio Rapido:",
    tip_rounds: "Round: Valori più alti sono più sicuri ma più lenti.",
    tip_salt: "Salt: Incluso automaticamente per prevenire attacchi rainbow table.",
    result: "Risultato",
    f_1: "Generazione hash Bcrypt sicura",
    f_2: "Round di salt personalizzabili (4-20)",
    f_3: "Verifica hash in tempo real",
    f_4: "Elaborazione nel browser per la privacy"
  },
  id: {
    title: "Generator dan Verifikator Bcrypt",
    meta: "Buat hash Bcrypt yang aman dengan round yang dapat disesuaikan atau verifikasi kecocokan hash yang ada.",
    desc: "Bcrypt adalah metode hashing yang dirancang untuk mengenkripsi kata sandi secara sangat aman. Fitur 'Salt' mencegah serangan tabel pelangi, sementara 'Rounds' menentukan tingkat kesulitan komputasi agar tahan terhadap serangan brute-force. Semua pemrosesan dilakukan di browser Anda dan tidak diperlukan instalasi.",
    check: "Verifikasi Kecocokan",
    bt: "Buat Hash",
    plc: "Teks untuk enkripsi",
    plcgen: "String hash Bcrypt",
    plcver: "Teks asli untuk dicocokkan",
    match: "Berhasil! Hash cocok dengan teks sumber.",
    notmatch: "Verifikasi gagal. Hash tidak cocok dengan teks.",
    rounds: "Kesulitan (Round)",
    see1: "Generator Hash MD5",
    see2: "Penampil JSON",
    see3: "Ekstraktor Email",
    see4: "Konverter XML ke JSON",
    tip: "Tips Cepat:",
    result: "Hasil",
    tip_rounds: "Round: Nilai yang lebih tinggi lebih aman tetapi lebih lambat.",
    tip_salt: "Salt: Disertakan secara otomatis untuk mencegah serangan tabel pelangi.",
    f_1: "Pembuatan hash Bcrypt yang aman",
    f_2: "Putaran salt yang dapat disesuaikan (4-20)",
    f_3: "Verifikasi hash waktu nyata",
    f_4: "Pemrosesan sisi klien untuk privasi total"
  }
}
</i18n>
