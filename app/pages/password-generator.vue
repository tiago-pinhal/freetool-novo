<script setup lang="ts">
useScript('https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js', { trigger: 'client' })

const { t } = useI18n({ useScope: 'local' })

const state = reactive({
  hasUpper: true,
  hasLower: true,
  hasNumber: true,
  hasSymbol: true,
  length: 17,
  pass: '',
  score: null as number | null,
  ads: false
})

const disabled = computed(() => !(state.hasUpper || state.hasLower || state.hasNumber || state.hasSymbol))

const strengthClass = computed(() => {
  if (state.score === null) return ''
  if (state.score <= 1) return 'progress-error'
  if (state.score === 2) return 'progress-warning'
  return 'progress-success'
})

const strengthTextClass = computed(() => {
  if (state.score === null) return ''
  if (state.score <= 1) return 'text-error'
  if (state.score === 2) return 'text-warning'
  return 'text-success'
})

const strengthValue = computed(() => {
  if (state.score === null) return 0
  return (state.score + 1) * 20
})

function generate() {
  let chars = ''
  if (state.hasUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (state.hasLower) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (state.hasNumber) chars += '0123456789'
  if (state.hasSymbol) chars += '!#$()*+=@[]_{}'

  let pass = ''
  for (let i = 0; i < state.length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)]
  }

  state.pass = pass
  if (!state.ads) state.ads = true

  const fn = (window as any).zxcvbn
  state.score = fn ? fn(pass).score : null
}

function copy() {
  if (state.pass) navigator.clipboard.writeText(state.pass)
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') }
  ],
  howToName: t('how_it_works_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }]
})

defineI18nRoute({
  paths: {
    en: '/password-generator',
    pt: '/gerador-de-senha',
    es: '/generador-de-contrasena',
    fr: '/generateur-de-mot-de-passe',
    it: '/generatore-di-password',
    id: '/generator-kata-sandi',
    de: '/passwort-generator',
    nl: '/wachtwoord-generator'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'pdf-editor' },
      { label: 'Emojis 😀', to: 'emoji-picker' },
      { label: t('see3'), to: 'hours-and-minutes-calculator' },
      { label: t('see4'), to: 'fancy-letters' }
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls -->
      <div class="space-y-5">
        <!-- Character type toggles -->
        <div class="flex flex-col gap-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="state.hasUpper" class="toggle toggle-primary" />
            <span class="font-medium">{{ t('upp') }}</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="state.hasLower" class="toggle toggle-primary" />
            <span class="font-medium">{{ t('low') }}</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="state.hasNumber" class="toggle toggle-primary" />
            <span class="font-medium">{{ t('num') }}</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="state.hasSymbol" class="toggle toggle-primary" />
            <span class="font-medium">{{ t('sym') }}</span>
          </label>
        </div>

        <!-- Length slider -->
        <div class="form-control">
          <label class="flex justify-between items-center mb-2" for="length-slider">
            <span class="font-bold text-base-content/80">{{ t('len') }}</span>
            <span class="font-black text-primary text-2xl">{{ state.length }}</span>
          </label>
          <input
            id="length-slider"
            type="range"
            min="4"
            max="50"
            v-model="state.length"
            class="range range-primary w-full"
          />
          <div class="flex justify-between text-xs px-1 text-base-content/70 mt-1">
            <span>4</span>
            <span>50</span>
          </div>
        </div>

        <ButtonPrimary
          @click="generate"
          :disabled="disabled"
          icon="heroicons:key-20-solid"
          class="w-full h-14 text-lg"
        >
          {{ t('bt') }}
        </ButtonPrimary>
      </div>

      <!-- Right Column: Result -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[16rem] flex flex-col justify-center">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div v-if="state.pass" class="space-y-4 w-full">
            <LineCopy 
              :content="state.pass" 
              :label="t('pass')" 
              class="!my-0 [&>div:last-child]:!w-full" 
            />

            <!-- Strength indicator -->
            <div v-if="state.score !== null" class="space-y-1 mt-4">
              <div class="flex justify-between text-xs">
                <span class="text-base-content/60">{{ t('strength') }}</span>
                <span class="font-bold" :class="strengthTextClass">{{ t(`str_${state.score}`) }}</span>
              </div>
              <progress
                class="progress w-full"
                :class="strengthClass"
                :value="strengthValue"
                max="100"
              />
            </div>
          </div>
        </Transition>

        <div v-if="!state.pass" class="text-center opacity-70">
          <Icon name="heroicons:key" class="w-16 h-16 mx-auto mb-2" />
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
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
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "Password Generator - Create Strong Random Passwords | Free",
    title: "Password Generator",
    meta: "Free strong password generator. Create secure random passwords instantly. Customize length, symbols, numbers and uppercase. Check password strength in real time.",
    upp: "Uppercase Letters (A-Z)",
    low: "Lowercase Letters (a-z)",
    num: "Numbers (0-9)",
    sym: "Special Characters (!#${'@'}...)",
    len: "Length",
    bt: "Generate Password",
    pass: "Your Password",
    strength: "Strength",
    str_0: "Very Weak",
    str_1: "Weak",
    str_2: "Fair",
    str_3: "Strong",
    str_4: "Very Strong",
    copy: "Copy Password",
    placeholder: "Click Generate to create a password",
    use_cases_title: "Use Cases",
    uc_1_title: "Online Accounts",
    uc_1_desc: "Create unique, hack-proof passwords for your social media and email accounts.",
    uc_2_title: "Financial Security",
    uc_2_desc: "Protect your banking and financial apps with maximum password complexity.",
    uc_3_title: "Work & Business",
    uc_3_desc: "Comply with corporate security policies using professional-grade random passwords.",
    uc_4_title: "Local Encryption",
    uc_4_desc: "Secure your Wi-Fi networks, personal devices, and encrypted local files.",
    how_it_works_title: "How It Works",
    step_1_title: "Customize",
    step_1_desc: "Select the character types (uppercase, lowercase, numbers, symbols) and password length.",
    step_2_title: "Generate",
    step_2_desc: "Click the 'Generate Password' button to create your secure password instantly.",
    step_3_title: "Check & Use",
    step_3_desc: "Review the strength meter and copy the result to your clipboard.",
    faq_title: "Questions and Answers",
    faq_1_q: "Is it safe to generate passwords online?",
    faq_1_a: "Yes. Our generator runs entirely in your browser. Passwords are created locally on your device and are never sent to any server.",
    faq_2_q: "How do I create a strong password?",
    faq_2_a: "A strong password should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and symbols. Avoid common words.",
    faq_3_q: "What makes a password weak?",
    faq_3_a: "Short length (under 8 characters), common words (like 'admin'), or predictable patterns (like '123456').",
    faq_4_q: "Should I change my passwords frequently?",
    faq_4_a: "It is recommended to change passwords periodically for sensitive accounts or immediately if you suspect a breach.",
    see1: "PDF Editor",
    see3: "Hours Calculator",
    see4: "Fancy Fonts"
  },
  pt: {
    pageTitle: "Gerador de Senha Forte - Criar Senhas Seguras | Grátis",
    title: "Gerador de Senha",
    meta: "Gerador de senhas fortes online grátis. Crie senhas seguras e aleatórias instantaneamente. Personalize tamanho, símbolos e números. Verifique a força da senha.",
    upp: "Letras Maiúsculas (A-Z)",
    low: "Letras Minúsculas (a-z)",
    num: "Números (0-9)",
    sym: "Caracteres Especiais (!#${'@'}...)",
    len: "Comprimento",
    bt: "Gerar Senha",
    pass: "Sua Senha",
    strength: "Força",
    str_0: "Muito Fraca",
    str_1: "Fraca",
    str_2: "Média",
    str_3: "Forte",
    str_4: "Muito Forte",
    copy: "Copiar Senha",
    placeholder: "Clique em Gerar para criar uma senha",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Contas Online",
    uc_1_desc: "Crie senhas únicas e à prova de invasão para suas redes sociais e e-mails.",
    uc_2_title: "Segurança Financeira",
    uc_2_desc: "Proteja seus aplicativos bancários e financeiros com complexidade máxima.",
    uc_3_title: "Trabalho e Negócios",
    uc_3_desc: "Cumpra políticas de segurança corporativa usando senhas profissionais.",
    uc_4_title: "Criptografia Local",
    uc_4_desc: "Proteja redes Wi-Fi, dispositivos pessoais e arquivos criptografados locais.",
    how_it_works_title: "Como Funciona",
    step_1_title: "Personalizar",
    step_1_desc: "Selecione os tipos de caracteres (maiúsculas, minúsculas, números, símbolos) e o comprimento da senha.",
    step_2_title: "Gerar",
    step_2_desc: "Clique no botão 'Gerar Senha' para criar sua senha segura instantaneamente.",
    step_3_title: "Copiar e Usar",
    step_3_desc: "Verifique o medidor de força e copie o resultado para sua área de transferência.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "É seguro gerar senhas online?",
    faq_1_a: "Sim. Nosso gerador roda inteiramente no seu navegador. As senhas são criadas localmente no seu dispositivo e nunca são enviadas para nenhum servidor.",
    faq_2_q: "Como criar uma senha forte?",
    faq_2_a: "Uma senha forte deve ter pelo menos 12 caracteres e incluir uma mistura de letras maiúsculas, minúsculas, números e símbolos. Evite palavras comuns.",
    faq_3_q: "O que torna uma senha fraca?",
    faq_3_a: "Comprimento curto (menos de 8 caracteres), palavras comuns (como 'admin') ou padrões previsíveis (como '123456').",
    faq_4_q: "Devo mudar minhas senhas frequentemente?",
    faq_4_a: "Recomenda-se mudar senhas periodicamente para contas críticas ou imediatamente se suspeitar de vazamento.",
    see1: "Editor de PDF",
    see3: "Calculadora de Horas",
    see4: "Fontes Diferentes"
  },
  es: {
    pageTitle: "Generador de Contraseñas Fuertes - Crear Contraseñas Seguras | Gratis",
    title: "Generador de Contraseñas",
    meta: "Generador de contraseñas fuertes online gratuito. Crea contraseñas seguras y aleatorias al instante. Personaliza longitud, símbolos y números.",
    upp: "Letras Mayúsculas (A-Z)",
    low: "Letras Minúsculas (a-z)",
    num: "Números (0-9)",
    sym: "Caracteres Especiales (!#${'@'}...)",
    len: "Longitud",
    bt: "Generar Contraseña",
    pass: "Tu Contraseña",
    strength: "Fortaleza",
    str_0: "Muy Débil",
    str_1: "Débil",
    str_2: "Regular",
    str_3: "Fuerte",
    str_4: "Muy Fuerte",
    copy: "Copiar Contraseña",
    placeholder: "Haz clic en Generar para crear una contraseña",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Cuentas Online",
    uc_1_desc: "Crea contraseñas únicas para tus redes sociales y correos electrónicos.",
    uc_2_title: "Seguridad Financiera",
    uc_2_desc: "Protege tus aplicaciones bancarias con la máxima complejidad de caracteres.",
    uc_3_title: "Trabajo y Negocios",
    uc_3_desc: "Cumple con las políticas de seguridad corporativa usando contraseñas profesionales.",
    uc_4_title: "Cifrado Local",
    uc_4_desc: "Asegura redes Wi-Fi, dispositivos personales y archivos cifrados locales.",
    how_it_works_title: "Cómo Funciona",
    step_1_title: "Personalizar",
    step_1_desc: "Selecciona los tipos de caracteres (mayúsculas, minúsculas, números, símbolos) y la longitud.",
    step_2_title: "Generar",
    step_2_desc: "Haz clic en el botón 'Generar Contraseña' para crear tu contraseña segura al instante.",
    step_3_title: "Copiar y Usar",
    step_3_desc: "Revisa el medidor de fuerza y copia el resultado en el portapapeles.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Es seguro generar contraseñas online?",
    faq_1_a: "Sí. Nuestro generador funciona completamente en tu navegador. Las contraseñas se crean localmente.",
    faq_2_q: "¿Cómo crear una contraseña fuerte?",
    faq_2_a: "Debe tener al menos 12 caracteres e incluir una mezcla de mayúsculas, minúsculas, números y símbolos.",
    faq_3_q: "¿Qué hace débil a una contraseña?",
    faq_3_a: "Longitud corta, palabras comunes (como 'admin') o patrones predecibles (como '123456').",
    faq_4_q: "¿Debo cambiar mis contraseñas con frecuencia?",
    faq_4_a: "Se recomienda cambiarlas periódicamente para cuentas críticas o si sospechas una filtración.",
    see1: "Editor de PDF",
    see3: "Calculadora de Horas",
    see4: "Fuentes Bonitas"
  },
  fr: {
    pageTitle: "Générateur de Mot de Passe Fort - Créer des Mots de Passe Sécurisés | Gratuit",
    title: "Générateur de Mot de Passe",
    meta: "Générateur de mots de passe forts en ligne gratuit. Créez des mots de passe sécurisés et aléatoires instantanément. Personnalisez la longueur, les symboles et les chiffres.",
    upp: "Lettres Majuscules (A-Z)",
    low: "Lettres Minuscules (a-z)",
    num: "Chiffres (0-9)",
    sym: "Caractères Spéciaux (!#${'@'}...)",
    len: "Longueur",
    bt: "Générer un Mot de Passe",
    pass: "Votre Mot de Passe",
    strength: "Force",
    str_0: "Très Faible",
    str_1: "Faible",
    str_2: "Moyen",
    str_3: "Fort",
    str_4: "Très Fort",
    copy: "Copier le Mot de Passe",
    placeholder: "Cliquez sur Générer pour créer un mot de passe",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Comptes en Ligne",
    uc_1_desc: "Créez des mots de passe uniques et inviolables pour vos réseaux sociaux et e-mails.",
    uc_2_title: "Sécurité Financière",
    uc_2_desc: "Protégez vos applications bancaires avec une complexité de caractères maximale.",
    uc_3_title: "Travail & Entreprise",
    uc_3_desc: "Respectez les politiques de sécurité d'entreprise avec des mots de passe professionnels.",
    uc_4_title: "Chiffrement Local",
    uc_4_desc: "Sécurisez vos réseaux Wi-Fi, appareils personnels et fichiers locaux chiffrés.",
    how_it_works_title: "Comment Ça Marche",
    step_1_title: "Personnaliser",
    step_1_desc: "Sélectionnez les types de caractères (majuscules, minuscules, chiffres, symboles) et la longueur.",
    step_2_title: "Générer",
    step_2_desc: "Cliquez sur le bouton 'Générer' pour créer votre mot de passe sécurisé instantanément.",
    step_3_title: "Copier & Utiliser",
    step_3_desc: "Vérifiez l'indicateur de force et copiez le résultat dans votre presse-papiers.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Est-il sûr de générer des mots de passe en ligne ?",
    faq_1_a: "Oui. Notre générateur fonctionne entièrement dans votre navigateur. Les mots de passe sont créés localement.",
    faq_2_q: "Comment créer un mot de passe fort ?",
    faq_2_a: "Visez au moins 12 caractères, en mélangeant majuscules, minuscules, chiffres et symboles.",
    faq_3_q: "Qu'est-ce qui rend un mot de passe faible ?",
    faq_3_a: "Une faible longueur, des mots courants (comme 'admin') ou des schémas prévisibles (comme '123456').",
    faq_4_q: "Dois-je changer mes mots de passe fréquemment ?",
    faq_4_a: "Il est recommandé de les changer périodiquement pour les comptes sensibles ou en cas de doute.",
    see1: "Éditeur de PDF",
    see3: "Calculatrice d'Heures",
    see4: "Polices Stylisées"
  },
  it: {
    pageTitle: "Generatore di Password Forte - Crea Password Sicure | Gratis",
    title: "Generatore di Password",
    meta: "Generatore di password forti online gratuito. Crea password sicure e casuali istantaneamente. Personalizza lunghezza, simboli e numeri.",
    upp: "Lettere Maiuscole (A-Z)",
    low: "Lettere Minuscole (a-z)",
    num: "Numeri (0-9)",
    sym: "Caratteri Speciali (!#${'@'}...)",
    len: "Lunghezza",
    bt: "Genera Password",
    pass: "La Tua Password",
    strength: "Forza",
    str_0: "Molto Debole",
    str_1: "Debole",
    str_2: "Discreta",
    str_3: "Forte",
    str_4: "Molto Forte",
    copy: "Copia Password",
    placeholder: "Clicca su Genera per creare una password",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Account Online",
    uc_1_desc: "Crea password uniche e inviolabili per i tuoi social media ed e-mail.",
    uc_2_title: "Sicurezza Finanziaria",
    uc_2_desc: "Proteggi le tue app bancarie con la massima complessità dei caratteri.",
    uc_3_title: "Lavoro e Azienda",
    uc_3_desc: "Rispetta le politiche di sicurezza aziendali con password casuali professionali.",
    uc_4_title: "Crittografia Locale",
    uc_4_desc: "Proteggi reti Wi-Fi, dispositivi personali e file criptati locali.",
    how_it_works_title: "Come Funziona",
    step_1_title: "Personalizza",
    step_1_desc: "Seleziona i tipi di caratteri (maiuscole, minuscole, numeri, simboli) e la lunghezza.",
    step_2_title: "Genera",
    step_2_desc: "Fai clic sul pulsante 'Genera' per creare istantaneamente la tua password sicura.",
    step_3_title: "Copia e Usa",
    step_3_desc: "Controlla l'indicatore di forza e copia il risultato negli appunti.",
    faq_title: "Domande e Risposte",
    faq_1_q: "È sicuro generare password online?",
    faq_1_a: "Sì. Il nostro generatore funziona interamente nel tuo browser. Le password sono create localmente.",
    faq_2_q: "Come creare una password forte?",
    faq_2_a: "Usa almeno 12 caratteri, mescolando maiuscole, minuscole, numeri e simboli.",
    faq_3_q: "Cosa rende una password debole?",
    faq_3_a: "Lunghezza ridotta, parole comuni (come 'admin') o schemi prevedibili (come '123456').",
    faq_4_q: "Dovrei cambiare le mie password frequentemente?",
    faq_4_a: "Si raccomanda di cambiarle periodicamente per account critici o in caso di dubbi.",
    see1: "Editor di PDF",
    see3: "Calcolatrice Ore",
    see4: "Font Diversi"
  },
  id: {
    pageTitle: "Generator Kata Sandi Kuat - Buat Kata Sandi Aman | Gratis",
    title: "Generator Kata Sandi",
    meta: "Generator kata sandi kuat online gratis. Buat kata sandi aman dan acak secara instan. Sesuaikan panjang, simbol, dan angka.",
    upp: "Huruf Kapital (A-Z)",
    low: "Huruf Kecil (a-z)",
    num: "Angka (0-9)",
    sym: "Karakter Khusus (!#${'@'}...)",
    len: "Panjang",
    bt: "Buat Kata Sandi",
    pass: "Kata Sandi Anda",
    strength: "Kekuatan",
    str_0: "Sangat Lemah",
    str_1: "Lemah",
    str_2: "Sedang",
    str_3: "Kuat",
    str_4: "Sangat Kuat",
    copy: "Salin Kata Sandi",
    placeholder: "Klik Buat untuk membuat kata sandi",
    use_cases_title: "Kasus Penggunaan",
    uc_1_title: "Akun Online",
    uc_1_desc: "Buat kata sandi unik dan tahan retas untuk media sosial dan email Anda.",
    uc_2_title: "Keamanan Finansial",
    uc_2_desc: "Lindungi aplikasi perbankan Anda dengan kompleksitas karakter maksimal.",
    uc_3_title: "Pekerjaan & Bisnis",
    uc_3_desc: "Patuhi kebijakan keamanan korporat menggunakan kata sandi acak profesional.",
    uc_4_title: "Enkripsi Lokal",
    uc_4_desc: "Amankan jaringan Wi-Fi, perangkat pribadi, dan file lokal yang dienkripsi.",
    how_it_works_title: "Cara Kerja",
    step_1_title: "Sesuaikan",
    step_1_desc: "Pilih jenis karakter (huruf kapital, huruf kecil, angka, simbol) dan panjang kata sandi.",
    step_2_title: "Buat",
    step_2_desc: "Klik tombol 'Buat Kata Sandi' untuk langsung membuat kata sandi aman Anda.",
    step_3_title: "Salin & Gunakan",
    step_3_desc: "Tinjau pengukur kekuatan dan salin hasilnya ke papan klip.",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apakah aman membuat kata sandi secara online?",
    faq_1_a: "Ya. Generator kami berjalan sepenuhnya di browser Anda. Kata sandi dibuat secara lokal.",
    faq_2_q: "Bagaimana cara membuat kata sandi yang kuat?",
    faq_2_a: "Gunakan minimal 12 karakter, campurkan huruf besar, huruf kecil, angka, dan simbol.",
    faq_3_q: "Apa yang membuat kata sandi lemah?",
    faq_3_a: "Panjang pendek, kata-kata umum (seperti 'admin'), atau pola yang dapat diprediksi.",
    faq_4_q: "Haruskah saya mengganti kata sandi secara berkala?",
    faq_4_a: "Disarankan untuk menggantinya secara berkala untuk akun sensitif atau jika ada kecurigaan.",
    see1: "Editor PDF",
    see3: "Kalkulator Jam",
    see4: "Font Keren"
  },
  de: {
    pageTitle: "Passwortgenerator – Starke zufällige Passwörter erstellen | Kostenlos",
    title: "Passwortgenerator",
    meta: "Kostenloser starker Passwortgenerator. Erstelle sichere zufällige Passwörter sofort. Länge, Symbole, Zahlen und Großbuchstaben anpassen. Passwortstärke in Echtzeit prüfen.",
    upp: "Großbuchstaben (A-Z)",
    low: "Kleinbuchstaben (a-z)",
    num: "Zahlen (0-9)",
    sym: "Sonderzeichen (!#${'@'}...)",
    len: "Länge",
    bt: "Passwort generieren",
    pass: "Dein Passwort",
    strength: "Stärke",
    str_0: "Sehr schwach",
    str_1: "Schwach",
    str_2: "Mittel",
    str_3: "Stark",
    str_4: "Sehr stark",
    copy: "Passwort kopieren",
    placeholder: "Klicke auf Generieren, um ein Passwort zu erstellen",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Online-Konten",
    uc_1_desc: "Erstelle einzigartige, hack-sichere Passwörter für Social Media und E-Mail-Konten.",
    uc_2_title: "Finanzielle Sicherheit",
    uc_2_desc: "Schütze Banking- und Finanz-Apps mit maximaler Passwortkomplexität.",
    uc_3_title: "Arbeit & Unternehmen",
    uc_3_desc: "Erfülle Sicherheitsrichtlinien mit professionellen zufälligen Passwörtern.",
    uc_4_title: "Lokale Verschlüsselung",
    uc_4_desc: "Sichere WLAN-Netzwerke, Geräte und lokal verschlüsselte Dateien.",
    how_it_works_title: "So funktioniert es",
    step_1_title: "Anpassen",
    step_1_desc: "Wähle die Zeichentypen (Großbuchstaben, Kleinbuchstaben, Zahlen, Symbole) und die Passwortlänge.",
    step_2_title: "Generieren",
    step_2_desc: "Klicke auf die Schaltfläche „Passwort generieren“, um sofort ein sicheres Passwort zu erstellen.",
    step_3_title: "Prüfen & Verwenden",
    step_3_desc: "Überprüfe die Stärkenanzeige und kopiere das Ergebnis in die Zwischenablage.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Ist es sicher, Passwörter online zu generieren?",
    faq_1_a: "Ja. Unser Generator läuft vollständig in deinem Browser. Passwörter werden lokal auf deinem Gerät erstellt und niemals an einen Server gesendet.",
    faq_2_q: "Wie erstelle ich ein starkes Passwort?",
    faq_2_a: "Ein starkes Passwort sollte mindestens 12 Zeichen lang sein und eine Mischung aus Großbuchstaben, Kleinbuchstaben, Zahlen und Symbolen enthalten. Vermeide gängige Wörter.",
    faq_3_q: "Was macht ein Passwort schwach?",
    faq_3_a: "Geringe Länge (unter 8 Zeichen), gängige Wörter (wie „admin“) oder vorhersehbare Muster (wie „123456“).",
    faq_4_q: "Sollte ich meine Passwörter regelmäßig ändern?",
    faq_4_a: "Es wird empfohlen, Passwörter für sensible Konten regelmäßig oder sofort bei Verdacht auf eine Sicherheitsverletzung zu ändern.",
    see1: "PDF-Editor",
    see3: "Stundenrechner",
    see4: "Schicke Schriften"
  },
  nl: {
    pageTitle: "Wachtwoordgenerator – Sterke willekeurige wachtwoorden maken | Gratis",
    title: "Wachtwoordgenerator",
    meta: "Gratis sterke wachtwoordgenerator. Maak direct veilige willekeurige wachtwoorden. Pas lengte, symbolen, cijfers en hoofdletters aan. Controleer sterkte in realtime.",
    upp: "Hoofdletters (A-Z)",
    low: "Kleine letters (a-z)",
    num: "Cijfers (0-9)",
    sym: "Speciale tekens (!#${'@'}...)",
    len: "Lengte",
    bt: "Wachtwoord genereren",
    pass: "Jouw wachtwoord",
    strength: "Sterkte",
    str_0: "Zeer zwak",
    str_1: "Zwak",
    str_2: "Gemiddeld",
    str_3: "Sterk",
    str_4: "Zeer sterk",
    copy: "Wachtwoord kopiëren",
    placeholder: "Klik op Genereren om een wachtwoord te maken",
    use_cases_title: "Gebruiksscenario's",
    uc_1_title: "Online accounts",
    uc_1_desc: "Maak unieke, hackbestendige wachtwoorden voor je sociale media en e-mailaccounts.",
    uc_2_title: "Financiële veiligheid",
    uc_2_desc: "Bescherm je bank- en financiële apps met maximale wachtwoordcomplexiteit.",
    uc_3_title: "Werk & bedrijf",
    uc_3_desc: "Voldoen aan het beveiligingsbeleid van het bedrijf met professionele willekeurige wachtwoorden.",
    uc_4_title: "Lokale versleuteling",
    uc_4_desc: "Beveilig je wifi-netwerken, persoonlijke apparaten en versleutelde lokale bestanden.",
    how_it_works_title: "Hoe het werkt",
    step_1_title: "Aanpassen",
    step_1_desc: "Selecteer de tekentypes (hoofdletters, kleine letters, cijfers, symbolen) en wachtwoordlengte.",
    step_2_title: "Genereren",
    step_2_desc: "Klik op de knop 'Wachtwoord genereren' om direct je veilige wachtwoord aan te maken.",
    step_3_title: "Controleren & gebruiken",
    step_3_desc: "Controleer de sterktemeter en kopieer het resultaat naar je klembord.",
    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Is het veilig om online wachtwoorden te genereren?",
    faq_1_a: "Ja. Onze generator draait volledig in je browser. Wachtwoorden worden lokaal op je apparaat aangemaakt en nooit naar een server verzonden.",
    faq_2_q: "Hoe maak ik een sterk wachtwoord?",
    faq_2_a: "Een sterk wachtwoord moet minstens 12 tekens lang zijn en een mix bevatten van hoofdletters, kleine letters, cijfers en symbolen. Vermijd gewone woorden.",
    faq_3_q: "Wat maakt een wachtwoord zwak?",
    faq_3_a: "Korte lengte (minder dan 8 tekens), gewone woorden (zoals 'admin') of voorspelbare patronen (zoals '123456').",
    faq_4_q: "Moet ik mijn wachtwoorden vaak wijzigen?",
    faq_4_a: "Het wordt aanbevolen om wachtwoorden voor gevoelige accounts regelmatig te wijzigen of onmiddellijk als je een inbreuk vermoedt.",
    see1: "PDF-editor",
    see3: "Urencalculator",
    see4: "Sierletters"
  }
}
</i18n>
