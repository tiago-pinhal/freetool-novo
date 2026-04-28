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
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
    { question: t('faq_5_q'), answer: t('faq_5_a') }
  ],
  howToName: t('how_to_use_title'),
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
    id: '/generator-kata-sandi'
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
        <section>
          <p class="mb-4">{{ t('d1') }}</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:play-circle-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_to_use_title') }}
          </h2>
          <div class="grid sm:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="flex flex-col gap-2 bg-base-200/40 p-4 rounded-xl border border-primary/20">
              <span class="text-3xl font-black text-primary/30 leading-none">{{ i }}</span>
              <span class="font-bold text-base-content">{{ t(`step_${i}_title`) }}</span>
              <span class="text-sm text-base-content/70">{{ t(`step_${i}_desc`) }}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:check-badge-20-solid" class="w-6 h-6 text-primary" />
            {{ t('features_title') }}
          </h2>
          <ul class="grid sm:grid-cols-2 gap-3">
            <li
              v-for="i in 4"
              :key="i"
              class="flex items-start gap-2 bg-base-200/40 p-3 rounded-xl border border-primary/20"
            >
              <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 text-success shrink-0 mt-0.5" />
              <span>{{ t(`f_${i}`) }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:shield-check-20-solid" class="w-6 h-6 text-primary" />
            {{ t('security_title') }}
          </h2>
          <p class="mb-3">{{ t('d3') }}</p>
          <p>{{ t('d4') }}</p>
        </section>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
            { question: t('faq_5_q'), answer: t('faq_5_a') }
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
    d1: "With our Password Generator, you can instantly create strong, secure passwords to protect your accounts against unauthorized access. All generation happens locally in your browser. Your passwords never leave your device.",
    how_to_use_title: "How to use",
    step_1_title: "Customize",
    step_1_desc: "Select the character types (uppercase, lowercase, numbers, symbols) and password length.",
    step_2_title: "Generate",
    step_2_desc: "Click the 'Generate Password' button to create your secure password instantly.",
    step_3_title: "Copy & Use",
    step_3_desc: "Use the copy button to save the password to your clipboard.",
    features_title: "Customize Your Security",
    f_1: "Include uppercase letters (A-Z) to increase password complexity.",
    f_2: "Mix in lowercase letters (a-z) for a broader character set.",
    f_3: "Add numbers (0-9) to strengthen the password further.",
    f_4: "Use special characters (!#${'@'}...) for maximum security.",
    security_title: "Security First",
    d3: "Our algorithm avoids predictable sequences and evaluates password strength in real time. The strength score reflects how difficult the password is to crack, ranging from Very Weak to Very Strong.",
    d4: "We recommend creating a unique password for each account, updating them regularly, and storing them in a secure password manager.",
    faq_title: "Frequently Asked Questions",
    faq_1_q: "Is it safe to generate passwords online?",
    faq_1_a: "Yes. Our generator runs entirely in your browser. Passwords are created locally on your device and are never sent to any server.",
    faq_2_q: "How do I create a strong password?",
    faq_2_a: "A strong password should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and symbols. Avoid common words or personal data.",
    faq_3_q: "What makes a password weak?",
    faq_3_a: "Short passwords (fewer than 8 characters), common words susceptible to dictionary attacks, predictable patterns like 123456, or reusing the same password across multiple sites.",
    faq_4_q: "Should I change my passwords frequently?",
    faq_4_a: "It is recommended to change passwords periodically, especially for critical accounts such as email and banking, or immediately if you suspect a data breach.",
    faq_5_q: "Is this tool free?",
    faq_5_a: "Yes, 100% free and unlimited. Generate as many secure passwords as you need with no registration or payment required.",
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
    d1: "Com o nosso Gerador de Senhas, você cria facilmente senhas fortes e seguras para blindar seus dados contra acessos não autorizados. Toda a geração ocorre localmente no seu navegador. Suas senhas nunca saem do seu dispositivo.",
    how_to_use_title: "Como usar",
    step_1_title: "Personalizar",
    step_1_desc: "Selecione os tipos de caracteres (maiúsculas, minúsculas, números, símbolos) e o comprimento da senha.",
    step_2_title: "Gerar",
    step_2_desc: "Clique no botão 'Gerar Senha' para criar sua senha segura instantaneamente.",
    step_3_title: "Copiar e Usar",
    step_3_desc: "Use o botão de copiar para enviar a senha à área de transferência.",
    features_title: "Personalize sua Segurança",
    f_1: "Inclua letras maiúsculas (A-Z) para aumentar a complexidade da senha.",
    f_2: "Combine com letras minúsculas (a-z) para um conjunto de caracteres mais amplo.",
    f_3: "Adicione números (0-9) para fortalecer ainda mais a senha.",
    f_4: "Use caracteres especiais (!#${'@'}...) para máxima segurança.",
    security_title: "Segurança em Primeiro Lugar",
    d3: "Nosso algoritmo evita sequências previsíveis e avalia a robustez da senha em tempo real. A pontuação de força reflete o quão difícil é quebrar a senha, variando de Muito Fraca a Muito Forte.",
    d4: "Recomendamos criar senhas únicas para cada conta, atualizá-las regularmente e guardá-las em gerenciadores de senha seguros.",
    faq_title: "Perguntas Frequentes",
    faq_1_q: "É seguro gerar senhas online?",
    faq_1_a: "Sim. Nosso gerador roda inteiramente no seu navegador. As senhas são criadas localmente no seu dispositivo e nunca são enviadas para nenhum servidor.",
    faq_2_q: "Como criar uma senha forte?",
    faq_2_a: "Uma senha forte deve ter pelo menos 12 caracteres e incluir uma mistura de letras maiúsculas, minúsculas, números e símbolos. Evite palavras comuns ou dados pessoais.",
    faq_3_q: "O que torna uma senha fraca?",
    faq_3_a: "Senhas curtas (menos de 8 caracteres), palavras comuns sujeitas a ataques de dicionário, padrões previsíveis como 123456 ou reutilizar a mesma senha em vários sites.",
    faq_4_q: "Devo mudar minhas senhas frequentemente?",
    faq_4_a: "Recomenda-se mudar senhas periodicamente, especialmente para contas críticas como e-mail e banco, ou imediatamente se suspeitar de vazamento de dados.",
    faq_5_q: "A ferramenta é gratuita?",
    faq_5_a: "Sim, 100% gratuita e sem limites. Gere quantas senhas seguras precisar sem cadastro ou pagamento.",
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
    d1: "Con nuestro Generador de Contraseñas, puedes crear fácilmente contraseñas fuertes y seguras para proteger tus cuentas contra accesos no autorizados. Toda la generación ocurre localmente en tu navegador. Tus contraseñas nunca salen de tu dispositivo.",
    how_to_use_title: "Cómo usar",
    step_1_title: "Personalizar",
    step_1_desc: "Selecciona los tipos de caracteres (mayúsculas, minúsculas, números, símbolos) y la longitud de la contraseña.",
    step_2_title: "Generar",
    step_2_desc: "Haz clic en el botón 'Generar Contraseña' para crear tu contraseña segura al instante.",
    step_3_title: "Copiar y Usar",
    step_3_desc: "Usa el botón de copiar para enviar la contraseña al portapapeles.",
    features_title: "Personaliza tu Seguridad",
    f_1: "Incluye letras mayúsculas (A-Z) para aumentar la complejidad.",
    f_2: "Combina con letras minúsculas (a-z) para un conjunto de caracteres más amplio.",
    f_3: "Añade números (0-9) para fortalecer aún más la contraseña.",
    f_4: "Usa caracteres especiales (!#${'@'}...) para máxima seguridad.",
    security_title: "La Seguridad es lo Primero",
    d3: "Nuestro algoritmo evita secuencias predecibles y evalúa la solidez de la contraseña en tiempo real. La puntuación de fortaleza refleja lo difícil que es descifrar la contraseña, desde Muy Débil hasta Muy Fuerte.",
    d4: "Recomendamos crear contraseñas únicas para cada cuenta, actualizarlas regularmente y guardarlas en gestores de contraseñas seguros.",
    faq_title: "Preguntas Frecuentes",
    faq_1_q: "¿Es seguro generar contraseñas online?",
    faq_1_a: "Sí. Nuestro generador funciona completamente en tu navegador. Las contraseñas se crean localmente en tu dispositivo y nunca se envían a ningún servidor.",
    faq_2_q: "¿Cómo crear una contraseña fuerte?",
    faq_2_a: "Una contraseña fuerte debe tener al menos 12 caracteres e incluir una mezcla de letras mayúsculas, minúsculas, números y símbolos. Evita palabras comunes o datos personales.",
    faq_3_q: "¿Qué hace débil a una contraseña?",
    faq_3_a: "Contraseñas cortas (menos de 8 caracteres), palabras comunes vulnerables a ataques de diccionario, patrones predecibles como 123456 o reutilizar la misma contraseña en varios sitios.",
    faq_4_q: "¿Debo cambiar mis contraseñas con frecuencia?",
    faq_4_a: "Se recomienda cambiar las contraseñas periódicamente, especialmente para cuentas críticas como correo y banco, o inmediatamente si sospechas de una filtración de datos.",
    faq_5_q: "¿La herramienta es gratuita?",
    faq_5_a: "Sí, 100% gratuita y sin límites. Genera todas las contraseñas seguras que necesites sin registro ni pago.",
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
    d1: "Avec notre Générateur de Mot de Passe, vous créez facilement des mots de passe forts et sécurisés pour protéger vos comptes contre les accès non autorisés. Toute la génération se fait localement dans votre navigateur. Vos mots de passe ne quittent jamais votre appareil.",
    how_to_use_title: "Comment utiliser l'outil",
    step_1_title: "Personnaliser",
    step_1_desc: "Sélectionnez les types de caractères (majuscules, minuscules, chiffres, symboles) et la longueur du mot de passe.",
    step_2_title: "Générer",
    step_2_desc: "Cliquez sur le bouton 'Générer un Mot de Passe' pour créer votre mot de passe sécurisé instantanément.",
    step_3_title: "Copier et Utiliser",
    step_3_desc: "Utilisez le bouton de copie pour envoyer le mot de passe dans le presse-papiers.",
    features_title: "Personnalisez Votre Sécurité",
    f_1: "Incluez des lettres majuscules (A-Z) pour augmenter la complexité.",
    f_2: "Combinez avec des lettres minuscules (a-z) pour un jeu de caractères plus large.",
    f_3: "Ajoutez des chiffres (0-9) pour renforcer davantage le mot de passe.",
    f_4: "Utilisez des caractères spéciaux (!#${'@'}...) pour une sécurité maximale.",
    security_title: "La Sécurité avant Tout",
    d3: "Notre algorithme évite les séquences prévisibles et évalue la solidité du mot de passe en temps réel. Le score de force reflète la difficulté à déchiffrer le mot de passe, allant de Très Faible à Très Fort.",
    d4: "Nous recommandons de créer des mots de passe uniques pour chaque compte, de les mettre à jour régulièrement et de les stocker dans des gestionnaires de mots de passe sécurisés.",
    faq_title: "Questions Fréquentes",
    faq_1_q: "Est-il sûr de générer des mots de passe en ligne?",
    faq_1_a: "Oui. Notre générateur fonctionne entièrement dans votre navigateur. Les mots de passe sont créés localement sur votre appareil et ne sont jamais envoyés à aucun serveur.",
    faq_2_q: "Comment créer un mot de passe fort?",
    faq_2_a: "Un mot de passe fort doit contenir au moins 12 caractères et inclure un mélange de lettres majuscules, minuscules, chiffres et symboles. Évitez les mots courants ou les données personnelles.",
    faq_3_q: "Qu'est-ce qui rend un mot de passe faible?",
    faq_3_a: "Les mots de passe courts (moins de 8 caractères), les mots courants vulnérables aux attaques par dictionnaire, les schémas prévisibles comme 123456 ou la réutilisation du même mot de passe sur plusieurs sites.",
    faq_4_q: "Dois-je changer mes mots de passe fréquemment?",
    faq_4_a: "Il est recommandé de changer les mots de passe périodiquement, surtout pour les comptes critiques comme l'email et la banque, ou immédiatement en cas de soupçon de fuite de données.",
    faq_5_q: "Cet outil est-il gratuit?",
    faq_5_a: "Oui, 100% gratuit et sans limites. Générez autant de mots de passe sécurisés que vous le souhaitez sans inscription ni paiement.",
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
    d1: "Con il nostro Generatore di Password, puoi creare facilmente password forti e sicure per proteggere i tuoi account dagli accessi non autorizzati. Tutta la generazione avviene localmente nel tuo browser. Le tue password non lasciano mai il tuo dispositivo.",
    how_to_use_title: "Come usare lo strumento",
    step_1_title: "Personalizza",
    step_1_desc: "Seleziona i tipi di caratteri (maiuscole, minuscole, numeri, simboli) e la lunghezza della password.",
    step_2_title: "Genera",
    step_2_desc: "Fai clic sul pulsante 'Genera Password' per creare istantaneamente la tua password sicura.",
    step_3_title: "Copia e Usa",
    step_3_desc: "Usa il pulsante di copia per inviare la password negli appunti.",
    features_title: "Personalizza la Tua Sicurezza",
    f_1: "Includi lettere maiuscole (A-Z) per aumentare la complessità.",
    f_2: "Combina con lettere minuscole (a-z) per un set di caratteri più ampio.",
    f_3: "Aggiungi numeri (0-9) per rafforzare ulteriormente la password.",
    f_4: "Usa caratteri speciali (!#${'@'}...) per la massima sicurezza.",
    security_title: "La Sicurezza Prima di Tutto",
    d3: "Il nostro algoritmo evita sequenze prevedibili e valuta la solidità della password in tempo reale. Il punteggio di forza riflette quanto sia difficile decifrare la password, da Molto Debole a Molto Forte.",
    d4: "Consigliamo di creare password uniche per ogni account, aggiornarle regolarmente e conservarle in gestori di password sicuri.",
    faq_title: "Domande Frequenti",
    faq_1_q: "È sicuro generare password online?",
    faq_1_a: "Sì. Il nostro generatore funziona interamente nel tuo browser. Le password vengono create localmente sul tuo dispositivo e non vengono mai inviate ad alcun server.",
    faq_2_q: "Come creare una password forte?",
    faq_2_a: "Una password forte deve avere almeno 12 caratteri e includere un mix di lettere maiuscole, minuscole, numeri e simboli. Evita parole comuni o dati personali.",
    faq_3_q: "Cosa rende una password debole?",
    faq_3_a: "Password corte (meno di 8 caratteri), parole comuni vulnerabili agli attacchi dizionario, schemi prevedibili come 123456 o riutilizzare la stessa password su più siti.",
    faq_4_q: "Dovrei cambiare le mie password frequentemente?",
    faq_4_a: "Si raccomanda di cambiare le password periodicamente, soprattutto per account critici come email e banca, o immediatamente in caso di sospetta violazione dei dati.",
    faq_5_q: "Lo strumento è gratuito?",
    faq_5_a: "Sì, 100% gratuito e senza limiti. Genera tutte le password sicure che ti servono senza registrazione o pagamento.",
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
    d1: "Dengan Generator Kata Sandi kami, Anda dapat dengan mudah membuat kata sandi yang kuat dan aman untuk melindungi akun Anda dari akses yang tidak sah. Semua pembuatan terjadi secara lokal di browser Anda. Kata sandi Anda tidak pernah meninggalkan perangkat Anda.",
    how_to_use_title: "Cara menggunakan alat ini",
    step_1_title: "Sesuaikan",
    step_1_desc: "Pilih jenis karakter (huruf kapital, huruf kecil, angka, simbol) dan panjang kata sandi.",
    step_2_title: "Buat",
    step_2_desc: "Klik tombol 'Buat Kata Sandi' untuk langsung membuat kata sandi aman Anda.",
    step_3_title: "Salin & Gunakan",
    step_3_desc: "Gunakan tombol salin untuk menyalin kata sandi ke papan klip.",
    features_title: "Sesuaikan Keamanan Anda",
    f_1: "Sertakan huruf kapital (A-Z) untuk meningkatkan kompleksitas.",
    f_2: "Gabungkan dengan huruf kecil (a-z) untuk kumpulan karakter yang lebih luas.",
    f_3: "Tambahkan angka (0-9) untuk memperkuat kata sandi lebih lanjut.",
    f_4: "Gunakan karakter khusus (!#${'@'}...) untuk keamanan maksimal.",
    security_title: "Keamanan adalah Prioritas",
    d3: "Algoritma kami menghindari urutan yang dapat diprediksi dan mengevaluasi kekuatan kata sandi secara real time. Skor kekuatan mencerminkan seberapa sulit kata sandi untuk dipecahkan, mulai dari Sangat Lemah hingga Sangat Kuat.",
    d4: "Kami menyarankan membuat kata sandi unik untuk setiap akun, memperbaruinya secara berkala, dan menyimpannya di pengelola kata sandi yang aman.",
    faq_title: "Pertanyaan Umum",
    faq_1_q: "Apakah aman membuat kata sandi secara online?",
    faq_1_a: "Ya. Generator kami berjalan sepenuhnya di browser Anda. Kata sandi dibuat secara lokal di perangkat Anda dan tidak pernah dikirim ke server mana pun.",
    faq_2_q: "Bagaimana membuat kata sandi yang kuat?",
    faq_2_a: "Kata sandi yang kuat harus memiliki setidaknya 12 karakter dan mencakup campuran huruf kapital, huruf kecil, angka, dan simbol. Hindari kata-kata umum atau data pribadi.",
    faq_3_q: "Apa yang membuat kata sandi lemah?",
    faq_3_a: "Kata sandi pendek (kurang dari 8 karakter), kata-kata umum yang rentan terhadap serangan kamus, pola yang dapat diprediksi seperti 123456, atau menggunakan kata sandi yang sama di banyak situs.",
    faq_4_q: "Haruskah saya mengganti kata sandi secara berkala?",
    faq_4_a: "Disarankan untuk mengganti kata sandi secara berkala, terutama untuk akun penting seperti email dan perbankan, atau segera jika mencurigai kebocoran data.",
    faq_5_q: "Apakah alat ini gratis?",
    faq_5_a: "Ya, 100% gratis dan tanpa batas. Buat kata sandi aman sebanyak yang Anda butuhkan tanpa pendaftaran atau pembayaran.",
    see1: "Editor PDF",
    see3: "Kalkulator Jam",
    see4: "Font Keren"
  }
}
</i18n>
