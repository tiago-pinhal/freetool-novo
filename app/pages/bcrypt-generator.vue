<script setup lang="ts">
// Carregamento otimizado com @nuxt/scripts
const { onLoaded } = useScript('https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js', {
  trigger: 'client',
  scriptOptions: {
    defer: true
  }
})

const { t, locale } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()

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

// Limpa resultados ao editar entradas
watch(() => stateGen.text, () => stateGen.hash = '')
watch(() => stateGen.round, () => stateGen.hash = '')
watch(() => stateCheck.text, () => stateCheck.check = null)
watch(() => stateCheck.hash, () => stateCheck.check = null)

// Função para Gerar Hash
function generate() {
  const bcrypt = (window as any).dcodeIO?.bcrypt
  if (!bcrypt) return

  if (stateGen.text !== '') {
    stateGen.hash = ''
    stateGen.loading = true

    bcrypt.genSalt(stateGen.round, (err: any, salt: string) => {
      bcrypt.hash(stateGen.text, salt, (err: any, hash: string) => {
        stateGen.hash = hash
        stateGen.loading = false
      })
    })
  }
}

// Função para Verificar Hash
function check() {
  const bcrypt = (window as any).dcodeIO?.bcrypt
  if (!bcrypt) return

  bcrypt.compare(stateCheck.text, stateCheck.hash).then((res: boolean) => {
    stateCheck.check = res
  })
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
    de: '/bcrypt-generator'
  }
})
</script>

<template>
  <ToolPage
    :title="`${t('title')} ${t('m_title')}`"
    :description="t('meta')"
    :info-description="t('desc')"
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
            <div class="form-control w-full sm:w-32">
              <label class="label">
                <span class="label-text font-bold text-base-content/60 text-xs uppercase tracking-wider">{{ t('rounds') }}</span>
              </label>
              <select v-model="stateGen.round" class="select select-bordered bg-base-200 rounded-xl">
                <option v-for="i in 17" :key="i" :value="i + 3">{{ i + 3 }}</option>
              </select>
            </div>

            <button 
              @click="generate"
              class="btn btn-primary btn-lg flex-1 sm:flex-none px-8 rounded-2xl gap-2"
              :disabled="!stateGen.text || stateGen.loading"
            >
              <span v-if="stateGen.loading" class="loading loading-spinner loading-sm"></span>
              <Icon v-else name="heroicons:lock-closed-20-solid" class="w-5 h-5" />
              {{ t('bt') }}
            </button>
          </div>

          <!-- Resultado -->
          <Blockcopy v-if="stateGen.hash" label="Bcrypt Hash" :content="stateGen.hash">
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

          <button 
            @click="check"
            class="btn btn-secondary btn-lg px-8 rounded-2xl gap-2"
            :disabled="!stateCheck.text || !stateCheck.hash"
          >
            <Icon name="heroicons:shield-check-20-solid" class="w-5 h-5" />
            {{ t('check') }}
          </button>

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
    m_title: "and Verifier",
    title: "Bcrypt Generator",
    meta: "Generate secure Bcrypt hashes from any input text with customizable rounds, or verify existing hashes against a source string.",
    desc: "Bcrypt is a highly secure hashing method designed for password encryption, incorporating a unique 'Salt' to prevent rainbow table attacks. By adjusting the 'Rounds' parameter, you set the computational cost, making brute-force attempts significantly harder. Even with the same password, each generation produces a different hash, ensuring top-tier security for your data.",
    check: "Validate Hash",
    bt: "Generate Hash",
    plc: "Text to encrypt",
    plcgen: "Bcrypt Hash string",
    plcver: "Original text to match",
    match: "Success! The hash matches the source text.",
    notmatch: "Verification failed. The hash does not match the text.",
    rounds: "Difficulty (Rounds)",
    see1: "MD5 Hash Generator",
    see2: "JSON Viewer",
    see3: "Email Extractor",
    see4: "XML to JSON Converter"
  },
  pt: {
    m_title: "e Verificador",
    title: "Gerador de Bcrypt",
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
    see4: "Conversor de XML para JSON"
  },
  es: {
    m_title: "y Verificador",
    title: "Generador de Bcrypt",
    meta: "Genere hashes Bcrypt seguros a partir de cualquier texto con rondas personalizables, o verifique hashes existentes.",
    desc: "Bcrypt es un método de cifrado de contraseñas altamente seguro. Utiliza un 'Salt' aleatorio que evita ataques de tablas arcoíris. El factor de costo (Rounds) determina la complejidad computacional, haciendo que los ataques de fuerza bruta sean extremadamente lentos y costosos para un atacante.",
    check: "Validar Hash",
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
    see4: "Convertidor de XML a JSON"
  },
  fr: {
    m_title: "et Vérificateur",
    title: "Générateur Bcrypt",
    meta: "Générez des hachages Bcrypt sécurisés avec des cycles personnalisables ou vérifiez la correspondance d'un hachage.",
    desc: "Bcrypt est une méthode de hachage conçue pour sécuriser les mots de passe. Il intègre un 'Salt' unique pour prévenir les attaques par tables arc-en-ciel. Le paramètre 'Rounds' définit le coût de calcul, rendant les tentatives de force brute beaucoup plus difficiles.",
    check: "Vérifier le Hachage",
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
    see4: "Convertisseur de XML vers JSON"
  },
  it: {
    m_title: "e Verificatore",
    title: "Generatore Bcrypt",
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
    see4: "Convertitore da XML a JSON"
  },
  id: {
    m_title: "dan Verifikator",
    title: "Generator Bcrypt",
    meta: "Buat hash Bcrypt yang aman dengan round yang dapat disesuaikan atau verifikasi kecocokan hash yang ada.",
    desc: "Bcrypt adalah metode hashing yang dirancang untuk mengenkripsi kata sandi secara sangat aman. Fitur 'Salt' mencegah serangan tabel pelangi, sementara 'Rounds' menentukan tingkat kesulitan komputasi agar tahan terhadap serangan brute-force.",
    check: "Validasi Hash",
    bt: "Buat Hash",
    plc: "Teks untuk enkripsi",
    plcgen: "String hash Bcrypt",
    plcver: "Teks asli untuk dicocokkan",
    match: "Berhasil! Hash cocok dengan teks sumber.",
    notmatch: "Verifikasi gagal. Hash tidak cocok dengan teks.",
    rounds: "Kesulitaan (Round)",
    see1: "Generator Hash MD5",
    see2: "Penampil JSON",
    see3: "Ekstraktor Email",
    see4: "Konverter XML ke JSON"
  },
  de: {
    m_title: "und Verifizierer",
    title: "Bcrypt-Generator",
    meta: "Generieren Sie sichere Bcrypt-Hashes mit anpassbaren Rounds oder überprüfen Sie bestehende Hashes.",
    desc: "Bcrypt ist eine hochsichere Hashing-Methode für Passwörter. Ein einzigartiger 'Salt' verhindert Rainbow-Table-Angriffe, während der 'Rounds'-Parameter die Rechenkomplexität bestimmt, um Brute-Force-Angriffe zu erschweren.",
    check: "Hash validieren",
    bt: "Hash generieren",
    plc: "Zu verschlüsselnder Text",
    plcgen: "Bcrypt-Hash-String",
    plcver: "Originaltext zum Abgleich",
    match: "Erfolgreich! Der Hash stimmt mit dem Quelltext überein.",
    notmatch: "Verifizierung fehlgeschlagen. Der Hash stimmt nicht überein.",
    rounds: "Schwierigkeit (Rounds)",
    see1: "MD5-Hash-Generator",
    see2: "JSON-Viewer",
    see3: "Email-Extraktor",
    see4: "XML-zu-JSON-Konverter"
  }
}
</i18n>
