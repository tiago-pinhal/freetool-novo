<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const uuid = ref('')
const uuidList = ref<string[]>([])
const showMultiple = ref(false)
const multipleCount = ref(5)
const copiedField = ref<string | null>(null)

function generate() {
  uuidList.value = []
  uuid.value = crypto.randomUUID()
}

function generateMultiple() {
  uuid.value = ''
  const count = Math.min(Math.max(multipleCount.value, 2), 100)
  uuidList.value = Array.from({ length: count }, () => crypto.randomUUID())
}

async function copy(value: string, field: string) {
  if (!value) return
  await navigator.clipboard.writeText(value).catch(() => {})
  copiedField.value = field
  setTimeout(() => { copiedField.value = null }, 2000)
}

async function copyAll() {
  await navigator.clipboard.writeText(uuidList.value.join('\n')).catch(() => {})
  copiedField.value = 'all'
  setTimeout(() => { copiedField.value = null }, 2000)
}

watch(showMultiple, (val) => {
  if (val) uuid.value = ''
  else uuidList.value = []
})

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4')],
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') },
    { question: t('faq_4_q'), answer: t('faq_4_a') },
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    en: '/uuid-generator',
    pt: '/gerador-de-uuid',
    es: '/generador-de-uuid',
    fr: '/generateur-de-uuid',
    it: '/generatore-di-uuid',
    id: '/generator-uuid',
    de: '/uuid-generator',
    nl: '/uuid-generator'
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    wiki-url="https://en.wikipedia.org/wiki/Universally_unique_identifier"
    wiki-label="UUID (RFC 4122)"
    :see-also-links="[
      { label: t('see1'), to: 'crontab-generator' },
      { label: t('see2'), to: 'random-number-generator' },
      { label: t('see3'), to: 'credit-card-generator' },
      { label: t('see4'), to: 'text-comparator' },
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls -->
      <div class="space-y-5">
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3 pb-1">
            <input type="checkbox" v-model="showMultiple" class="toggle toggle-primary" />
            <span class="label-text font-bold text-base-content/80">{{ t('multiple_label') }}</span>
          </label>
        </div>

        <div v-if="showMultiple" class="form-control">
          <label class="label pb-1" for="count-input">
            <span class="label-text font-bold text-base-content/80">{{ t('quantity') }}</span>
          </label>
          <input
            id="count-input"
            type="number"
            v-model.number="multipleCount"
            min="2"
            max="100"
            class="input input-bordered w-full"
          />
        </div>

        <ButtonPrimary
          @click="showMultiple ? generateMultiple() : generate()"
          icon="heroicons:key-20-solid"
          class="w-full h-14 text-lg"
        >
          {{ showMultiple ? t('bt_multiple') : t('bt') }}
        </ButtonPrimary>
      </div>

      <!-- Right Column: Output -->
      <div class="flex flex-col justify-center gap-3">
        <!-- Single UUID -->
        <div v-if="uuid" class="bg-base-200/60 border border-base-content/10 rounded-2xl p-5">
          <div class="text-[10px] uppercase tracking-wider text-base-content/50 mb-2">UUID v4</div>
          <div class="flex items-center gap-3">
            <span class="font-mono text-sm sm:text-base break-all flex-1">{{ uuid }}</span>
            <button
              @click="copy(uuid, 'single')"
              class="shrink-0 transition-all duration-200"
              :class="copiedField === 'single' ? 'text-success' : 'text-base-content/40 hover:text-base-content'"
            >
              <Icon :name="copiedField === 'single' ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Multiple UUIDs -->
        <div v-if="uuidList.length > 0" class="bg-base-200/60 border border-base-content/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] uppercase tracking-wider text-base-content/50">{{ t('generated_uuids', { count: uuidList.length }) }}</span>
            <button
              @click="copyAll()"
              class="flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
              :class="copiedField === 'all' ? 'text-success' : 'text-primary hover:text-primary/80'"
            >
              <Icon :name="copiedField === 'all' ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'" class="w-4 h-4" />
              {{ copiedField === 'all' ? t('copied') : t('copy_all') }}
            </button>
          </div>
          <div class="divide-y divide-base-content/10 max-h-72 overflow-y-auto pr-1">
            <div v-for="(id, index) in uuidList" :key="index" class="flex items-center gap-2 py-2">
              <span class="font-mono text-xs flex-1 break-all text-base-content/80">{{ id }}</span>
              <button
                @click="copy(id, `uuid-${index}`)"
                class="shrink-0 transition-all duration-200"
                :class="copiedField === `uuid-${index}` ? 'text-success' : 'text-base-content/40 hover:text-base-content'"
              >
                <Icon :name="copiedField === `uuid-${index}` ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Placeholder -->
        <div v-if="!uuid && !uuidList.length" class="text-center opacity-70 py-8">
          <Icon name="heroicons:key" class="w-16 h-16 mx-auto mb-2" />
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <section>
          <p>{{ t('d1') }}</p>
        </section>

        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
          icon="heroicons:check-badge-20-solid"
        />

        <section>
          <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
            <Icon name="heroicons:book-open-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
            { title: t('use_4_t'), description: t('use_4_d') },
            { title: t('use_5_t'), description: t('use_5_d') }
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

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') },
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "UUID Generator - Generate UUID v4 Online | Free",
    title: "UUID Generator",
    meta: "Free online UUID v4 generator. Create single or multiple unique identifiers instantly for software, databases, APIs and distributed systems. RFC 4122 compliant.",
    d1: "Generate universally unique identifiers with one click. UUID v4 (Universally Unique Identifier version 4) is a 36-character alphanumeric code specified by RFC 4122. Generate a single UUID or a bulk list for testing, database seeding, and distributed systems.",
    features_title: "Features",
    f_1: "Generate UUID v4 instantly in the browser",
    f_2: "Bulk generation of up to 100 UUIDs at once",
    f_3: "Copy individual values or the entire list with one click",
    f_4: "RFC 4122 compliant UUID v4 format",
    how_title: "How the UUID Generator Works",
    how_desc: "Click the generate button to create a random UUID v4 instantly in your browser. If you need a batch, enable multiple generation and choose how many IDs to create. Each UUID follows the standard v4 pattern defined by RFC 4122, making the tool useful for testing, development, integrations and data modeling.",
    use_cases_title: "Main Use Cases",
    use_1_t: "Software Development",
    use_1_d: "Create unique identifiers for entities, records, and internal references within your application architecture.",
    use_2_t: "Database Primary Keys",
    use_2_d: "Generate distributed primary keys without relying on auto-increment sequences, perfect for distributed systems.",
    use_3_t: "APIs and Microservices",
    use_3_d: "Assign unique resource IDs, request IDs, and correlation IDs to track transactions across services.",
    use_4_t: "Testing and Data Seeding",
    use_4_d: "Produce batches of realistic unique values for QA testing, database fixtures, and automated test suites.",
    use_5_t: "Tracking and Logging",
    use_5_d: "Label jobs, events, user sessions, and imported data safely to ensure traceability and uniqueness.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Choose a mode",
    step_1_desc: "Select single UUID generation for one result, or toggle 'Generate Multiple' to set a custom quantity (2–100).",
    step_2_title: "Generate",
    step_2_desc: "Click the generate button. Your UUID(s) appear instantly, ready to use.",
    step_3_title: "Copy",
    step_3_desc: "Click the copy icon next to any UUID, or use 'Copy All' to copy the entire list at once.",
    faq_title: "Questions & Answers",
    faq_1_q: "What is a UUID?",
    faq_1_a: "UUID (Universally Unique Identifier) is a 128-bit identifier standard defined by RFC 4122. Version 4 uses random numbers to generate unique codes, making collisions virtually impossible.",
    faq_2_q: "Are UUID v4 truly unique?",
    faq_2_a: "Yes. With 122 random bits, there are 5.3 undecillion possible combinations. The probability of generating two identical UUIDs is astronomically low, making them safe for distributed systems.",
    faq_3_q: "What is the difference between UUID versions?",
    faq_3_a: "UUID v1 uses timestamp and MAC address; v4 uses random numbers (most common); v5 uses namespace and SHA-1 hash. Version 4 is preferred for its simplicity and privacy (no hardware info exposed).",
    faq_4_q: "Can I use UUIDs as database primary keys?",
    faq_4_a: "Yes. UUIDs are ideal for distributed databases where auto-increment IDs would conflict. They allow generating IDs client-side without database coordination.",
    multiple_label: "Generate Multiple UUIDs",
    quantity: "Quantity",
    bt: "Generate UUID",
    bt_multiple: "Generate UUIDs",
    generated_uuids: "Generated UUIDs ({count})",
    copy_all: "Copy All",
    copied: "Copied!",
    placeholder: "Click Generate to create a UUID",
    see1: "Crontab Generator",
    see2: "Random Number Generator",
    see3: "Credit Card Generator",
    see4: "Text Comparator"
  },
  pt: {
    pageTitle: "Gerador de UUID - Gerar UUID v4 Online | Grátis",
    title: "Gerador de UUID",
    meta: "Gerador de UUID v4 online grátis. Crie identificadores únicos instantaneamente para software, bancos de dados, APIs e sistemas distribuídos. Compatível com RFC 4122.",
    d1: "Gere identificadores universalmente únicos com um clique. UUID v4 (Universally Unique Identifier versão 4) é um código alfanumérico de 36 caracteres especificado pela RFC 4122. Gere um UUID único ou uma lista em lote para testes, população de bancos de dados e sistemas distribuídos.",
    features_title: "Funcionalidades",
    f_1: "Gerar UUID v4 instantaneamente no navegador",
    f_2: "Geração em lote de até 100 UUIDs de uma vez",
    f_3: "Copiar valores individuais ou a lista inteira com um clique",
    f_4: "Formato UUID v4 compatível com RFC 4122",
    how_title: "Como Funciona o Gerador de UUID",
    how_desc: "Clique no botão de gerar para criar instantaneamente um UUID v4 aleatório no navegador. Se precisar de um lote, ative a geração múltipla e escolha quantos IDs deseja criar. Cada UUID segue o padrão v4 definido pela RFC 4122, tornando a ferramenta útil para testes, desenvolvimento, integrações e modelagem de dados.",
    use_cases_title: "Principais Casos de Uso",
    use_1_t: "Desenvolvimento de Software",
    use_1_d: "Crie identificadores únicos para entidades, registros e referências internas na arquitetura da sua aplicação.",
    use_2_t: "Chaves Primárias de Banco de Dados",
    use_2_d: "Gere chaves primárias distribuídas sem depender de sequências auto-incrementais, ideal para sistemas distribuídos.",
    use_3_t: "APIs e Microsserviços",
    use_3_d: "Atribua IDs de recursos, IDs de requisição e IDs de correlação únicos para rastrear transações entre serviços.",
    use_4_t: "Testes e Seed de Dados",
    use_4_d: "Produza lotes de valores únicos realistas para testes de QA, fixtures de banco de dados e suítes de teste automatizadas.",
    use_5_t: "Rastreamento e Logs",
    use_5_d: "Rotule jobs, eventos, sessões de usuário e dados importados com segurança para garantir rastreabilidade e unicidade.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Escolha o modo",
    step_1_desc: "Selecione geração de UUID único ou ative 'Gerar Múltiplos' para definir uma quantidade personalizada (2–100).",
    step_2_title: "Gere",
    step_2_desc: "Clique no botão de gerar. Seu(s) UUID(s) aparece(m) instantaneamente, pronto(s) para uso.",
    step_3_title: "Copie",
    step_3_desc: "Clique no ícone de cópia ao lado de qualquer UUID ou use 'Copiar Todos' para copiar a lista inteira de uma vez.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O que é um UUID?",
    faq_1_a: "UUID (Universally Unique Identifier) é um padrão de identificador de 128 bits definido pela RFC 4122. A versão 4 usa números aleatórios para gerar códigos únicos, tornando colisões virtualmente impossíveis.",
    faq_2_q: "UUIDs v4 são realmente únicos?",
    faq_2_a: "Sim. Com 122 bits aleatórios, existem 5,3 undecilhões de combinações possíveis. A probabilidade de gerar dois UUIDs idênticos é astronomicamente baixa, tornando-os seguros para sistemas distribuídos.",
    faq_3_q: "Qual a diferença entre versões de UUID?",
    faq_3_a: "UUID v1 usa timestamp e endereço MAC; v4 usa números aleatórios (mais comum); v5 usa namespace e hash SHA-1. A versão 4 é preferida pela simplicidade e privacidade (não expõe informações de hardware).",
    faq_4_q: "Posso usar UUIDs como chaves primárias no banco de dados?",
    faq_4_a: "Sim. UUIDs são ideais para bancos de dados distribuídos onde IDs auto-incrementais causariam conflitos. Permitem gerar IDs no cliente sem coordenação com o banco de dados.",
    multiple_label: "Gerar Múltiplos UUIDs",
    quantity: "Quantidade",
    bt: "Gerar UUID",
    bt_multiple: "Gerar UUIDs",
    generated_uuids: "UUIDs Gerados ({count})",
    copy_all: "Copiar Todos",
    copied: "Copiado!",
    placeholder: "Clique em Gerar para criar um UUID",
    see1: "Gerador de Crontab",
    see2: "Números Aleatórios",
    see3: "Gerador de Cartão de Crédito",
    see4: "Comparador de Texto"
  },
  es: {
    pageTitle: "Generador de UUID - Generar UUID v4 Online | Gratis",
    title: "Generador de UUID",
    meta: "Generador de UUID v4 online gratis. Crea identificadores únicos al instante para software, bases de datos, APIs y sistemas distribuidos. Compatible con RFC 4122.",
    d1: "Genera identificadores universalmente únicos con un clic. UUID v4 (Universally Unique Identifier versión 4) es un código alfanumérico de 36 caracteres especificado por RFC 4122. Genera un UUID único o una lista en lote para pruebas, llenado de bases de datos y sistemas distribuidos.",
    features_title: "Funcionalidades",
    f_1: "Generar UUID v4 al instante en el navegador",
    f_2: "Generación masiva de hasta 100 UUIDs a la vez",
    f_3: "Copiar valores individuales o la lista completa con un clic",
    f_4: "Formato UUID v4 compatible con RFC 4122",
    how_title: "Cómo Funciona el Generador de UUID",
    how_desc: "Haz clic en el botón de generar para crear un UUID v4 aleatorio al instante en tu navegador. Si necesitas un lote, activa la generación múltiple y elige cuántos IDs deseas crear. Cada UUID sigue el patrón v4 definido por RFC 4122, por lo que la herramienta resulta útil para pruebas, desarrollo, integraciones y modelado de datos.",
    use_cases_title: "Principales Casos de Uso",
    use_1_t: "Desarrollo de Software",
    use_1_d: "Crea identificadores únicos para entidades, registros y referencias internas en la arquitectura de tu aplicación.",
    use_2_t: "Claves Primarias de Bases de Datos",
    use_2_d: "Genera claves primarias distribuidas sin depender de secuencias auto-incrementales, ideal para sistemas distribuidos.",
    use_3_t: "APIs y Microservicios",
    use_3_d: "Asigna IDs de recursos, IDs de solicitud e IDs de correlación únicos para rastrear transacciones entre servicios.",
    use_4_t: "Pruebas y Carga de Datos",
    use_4_d: "Produce lotes de valores únicos realistas para pruebas de QA, fixtures de bases de datos y suites de pruebas automatizadas.",
    use_5_t: "Seguimiento y Registros",
    use_5_d: "Etiqueta trabajos, eventos, sesiones de usuario y datos importados de forma segura para garantizar la trazabilidad.",
    how_to_use_title: "Cómo Utilizar Esta Herramienta",
    step_1_title: "Elige un modo",
    step_1_desc: "Selecciona generación de un UUID único o activa 'Generar Múltiples' para definir una cantidad personalizada (2–100).",
    step_2_title: "Genera",
    step_2_desc: "Haz clic en el botón de generar. Tu(s) UUID(s) aparece(n) al instante, listo(s) para usar.",
    step_3_title: "Copia",
    step_3_desc: "Haz clic en el ícono de copiar junto a cualquier UUID o usa 'Copiar Todos' para copiar la lista completa de una vez.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Qué es un UUID?",
    faq_1_a: "UUID (Identificador Universalmente Único) es un estándar de identificador de 128 bits definido por RFC 4122. La versión 4 usa números aleatorios para generar códigos únicos, haciendo las colisiones virtualmente imposibles.",
    faq_2_q: "¿Los UUID v4 son realmente únicos?",
    faq_2_a: "Sí. Con 122 bits aleatorios, existen 5,3 undecillones de combinaciones posibles. La probabilidad de generar dos UUIDs idénticos es astronómicamente baja, haciéndolos seguros para sistemas distribuidos.",
    faq_3_q: "¿Cuál es la diferencia entre versiones de UUID?",
    faq_3_a: "UUID v1 usa timestamp y dirección MAC; v4 usa números aleatorios (más común); v5 usa namespace y hash SHA-1. La versión 4 es preferida por su simplicidad y privacidad (no expone información de hardware).",
    faq_4_q: "¿Puedo usar UUIDs como claves primarias en la base de datos?",
    faq_4_a: "Sí. Los UUIDs son ideales para bases de datos distribuidas donde IDs auto-incrementales causarían conflictos. Permiten generar IDs en el cliente sin coordinación con la base de datos.",
    multiple_label: "Generar Múltiples UUIDs",
    quantity: "Cantidad",
    bt: "Generar UUID",
    bt_multiple: "Generar UUIDs",
    generated_uuids: "UUIDs Generados ({count})",
    copy_all: "Copiar Todos",
    copied: "¡Copiado!",
    placeholder: "Haz clic en Generar para crear un UUID",
    see1: "Generador de Crontab",
    see2: "Números Aleatorios",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Comparador de Texto"
  },
  fr: {
    pageTitle: "Générateur de UUID - Générer UUID v4 en Ligne | Gratuit",
    title: "Générateur de UUID",
    meta: "Générateur de UUID v4 en ligne gratuit. Créez des identifiants uniques instantanément pour logiciels, bases de données, APIs et systèmes distribués. Conforme RFC 4122.",
    d1: "Générez des identifiants universellement uniques en un clic. UUID v4 (Identifiant Universel Unique version 4) est un code alphanumérique de 36 caractères spécifié par la RFC 4122. Générez un UUID unique ou une liste en lot pour les tests, le remplissage de bases de données et les systèmes distribués.",
    features_title: "Fonctionnalités",
    f_1: "Générer un UUID v4 instantanément dans le navigateur",
    f_2: "Génération en lot de jusqu'à 100 UUIDs à la fois",
    f_3: "Copier une valeur individuelle ou toute la liste en un clic",
    f_4: "Format UUID v4 conforme à la RFC 4122",
    how_title: "Comment Fonctionne le Générateur de UUID",
    how_desc: "Cliquez sur le bouton de génération pour créer instantanément un UUID v4 aléatoire dans votre navigateur. Si vous avez besoin d'un lot, activez la génération multiple et choisissez le nombre d'identifiants à produire. Chaque UUID suit le modèle v4 défini par la RFC 4122, ce qui rend l'outil utile pour les tests, le développement, les intégrations et la modélisation des données.",
    use_cases_title: "Principaux Cas d'Usage",
    use_1_t: "Développement Logiciel",
    use_1_d: "Créez des identifiants uniques pour les entités, les enregistrements et les références internes dans l'architecture de votre application.",
    use_2_t: "Clés Primaires de Base de Données",
    use_2_d: "Générez des clés primaires distribuées sans dépendre de séquences auto-incrémentées, idéal pour les systèmes distribués.",
    use_3_t: "APIs et Microservices",
    use_3_d: "Attribuez des IDs de ressources, de requêtes et de corrélation uniques pour suivre les transactions entre les services.",
    use_4_t: "Tests et Jeux de Données",
    use_4_d: "Produisez des lots de valeurs uniques réalistes pour les tests QA, les fixtures de base de données et les suites de tests automatisés.",
    use_5_t: "Suivi et Journalisation",
    use_5_d: "Étiquetez les jobs, les événements, les sessions utilisateur et les données importées en toute sécurité pour garantir la traçabilité.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Choisissez un mode",
    step_1_desc: "Sélectionnez la génération d'un UUID unique ou activez 'Générer Plusieurs' pour définir une quantité personnalisée (2–100).",
    step_2_title: "Générez",
    step_2_desc: "Cliquez sur le bouton de génération. Votre ou vos UUID(s) apparaissent instantanément, prêts à l'emploi.",
    step_3_title: "Copiez",
    step_3_desc: "Cliquez sur l'icône de copie à côté de n'importe quel UUID ou utilisez 'Copier Tout' pour copier toute la liste en une seule fois.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Qu'est-ce qu'un UUID ?",
    faq_1_a: "UUID (Identifiant Universel Unique) est un standard d'identifiant de 128 bits défini par RFC 4122. La version 4 utilise des nombres aléatoires pour générer des codes uniques, rendant les collisions virtuellement impossibles.",
    faq_2_q: "Les UUID v4 sont-ils vraiment uniques ?",
    faq_2_a: "Oui. Avec 122 bits aléatoires, il existe 5,3 undécillions de combinaisons possibles. La probabilité de générer deux UUIDs identiques est astronomiquement faible, les rendant sûrs pour les systèmes distribués.",
    faq_3_q: "Quelle est la différence entre les versions d'UUID ?",
    faq_3_a: "UUID v1 utilise timestamp et adresse MAC ; v4 utilise des nombres aléatoires (plus courant) ; v5 utilise namespace et hash SHA-1. La version 4 est préférée pour sa simplicité et confidentialité (n'expose pas d'informations matérielles).",
    faq_4_q: "Puis-je utiliser les UUIDs comme clés primaires dans la base de données ?",
    faq_4_a: "Oui. Les UUIDs sont idéaux pour les bases de données distribuées où les IDs auto-incrémentés causeraient des conflits. Ils permettent de générer des IDs côté client sans coordination avec la base de données.",
    multiple_label: "Générer Plusieurs UUIDs",
    quantity: "Quantité",
    bt: "Générer un UUID",
    bt_multiple: "Générer des UUIDs",
    generated_uuids: "UUIDs Générés ({count})",
    copy_all: "Copier Tout",
    copied: "Copié !",
    placeholder: "Cliquez sur Générer pour créer un UUID",
    see1: "Générateur de Crontab",
    see2: "Nombres Aléatoires",
    see3: "Générateur de Carte de Crédit",
    see4: "Comparateur de Texte"
  },
  it: {
    pageTitle: "Generatore di UUID - Generare UUID v4 Online | Gratis",
    title: "Generatore di UUID",
    meta: "Generatore di UUID v4 online gratis. Crea identificatori unici istantaneamente per software, database, API e sistemi distribuiti. Conforme RFC 4122.",
    d1: "Genera identificatori universalmente unici con un clic. UUID v4 (Identificatore Universalmente Unico versione 4) è un codice alfanumerico di 36 caratteri specificato dalla RFC 4122. Genera un UUID singolo o una lista in blocco per test, popolamento di database e sistemi distribuiti.",
    features_title: "Funzionalità",
    f_1: "Generare UUID v4 istantaneamente nel browser",
    f_2: "Generazione in blocco di fino a 100 UUID alla volta",
    f_3: "Copiare valori singoli o l'intera lista con un clic",
    f_4: "Formato UUID v4 conforme alla RFC 4122",
    how_title: "Come Funziona il Generatore di UUID",
    how_desc: "Fai clic sul pulsante di generazione per creare istantaneamente un UUID v4 casuale nel browser. Se ti serve un lotto, attiva la generazione multipla e scegli quanti ID creare. Ogni UUID segue il formato v4 definito dalla RFC 4122, rendendo lo strumento utile per test, sviluppo, integrazioni e modellazione dei dati.",
    use_cases_title: "Principali Casi d'Uso",
    use_1_t: "Sviluppo Software",
    use_1_d: "Crea identificatori unici per entità, record e riferimenti interni nell'architettura della tua applicazione.",
    use_2_t: "Chiavi Primarie del Database",
    use_2_d: "Genera chiavi primarie distribuite senza dipendere da sequenze auto-incrementali, ideale per sistemi distribuiti.",
    use_3_t: "API e Microservizi",
    use_3_d: "Assegna ID risorsa, ID richiesta e ID correlazione unici per tracciare le transazioni tra i servizi.",
    use_4_t: "Test e Popolamento Dati",
    use_4_d: "Produci lotti di valori unici realistici per test QA, fixture di database e suite di test automatizzate.",
    use_5_t: "Tracciamento e Log",
    use_5_d: "Etichetta job, eventi, sessioni utente e dati importati in sicurezza per garantire tracciabilità e univocità.",
    how_to_use_title: "Come Utilizzare Questo Strumento",
    step_1_title: "Scegli una modalità",
    step_1_desc: "Seleziona la generazione di un singolo UUID o attiva 'Genera Multipli' per impostare una quantità personalizzata (2–100).",
    step_2_title: "Genera",
    step_2_desc: "Clicca sul pulsante di generazione. Il tuo o i tuoi UUID appaiono istantaneamente, pronti all'uso.",
    step_3_title: "Copia",
    step_3_desc: "Clicca sull'icona di copia accanto a qualsiasi UUID o usa 'Copia Tutti' per copiare l'intera lista in una volta.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Cos'è un UUID?",
    faq_1_a: "UUID (Identificatore Universalmente Unico) è uno standard di identificatore a 128 bit definito da RFC 4122. La versione 4 usa numeri casuali per generare codici unici, rendendo le collisioni virtualmente impossibili.",
    faq_2_q: "Gli UUID v4 sono veramente unici?",
    faq_2_a: "Sì. Con 122 bit casuali, esistono 5,3 undecilioni di combinazioni possibili. La probabilità di generare due UUID identici è astronomicamente bassa, rendendoli sicuri per sistemi distribuiti.",
    faq_3_q: "Qual è la differenza tra le versioni UUID?",
    faq_3_a: "UUID v1 usa timestamp e indirizzo MAC; v4 usa numeri casuali (più comune); v5 usa namespace e hash SHA-1. La versione 4 è preferita per semplicità e privacy (non espone informazioni hardware).",
    faq_4_q: "Posso usare UUID come chiavi primarie nel database?",
    faq_4_a: "Sì. Gli UUID sono ideali per database distribuiti dove ID auto-incrementali causerebbero conflitti. Permettono di generare ID lato client senza coordinazione con il database.",
    multiple_label: "Genera Multipli UUID",
    quantity: "Quantità",
    bt: "Genera UUID",
    bt_multiple: "Genera UUID",
    generated_uuids: "UUID Generati ({count})",
    copy_all: "Copia Tutti",
    copied: "Copiato!",
    placeholder: "Clicca su Genera per creare un UUID",
    see1: "Generatore di Crontab",
    see2: "Numeri Casuali",
    see3: "Generatore di Carta di Credito",
    see4: "Comparatore di Testo"
  },
  id: {
    pageTitle: "Generator UUID - Buat UUID v4 Online | Gratis",
    title: "Generator UUID",
    meta: "Generator UUID v4 online gratis. Buat identifier unik secara instan untuk software, database, API, dan sistem terdistribusi. Sesuai RFC 4122.",
    d1: "Hasilkan identifier unik secara universal dengan satu klik. UUID v4 (Universally Unique Identifier versi 4) adalah kode alfanumerik 36 karakter yang ditentukan oleh RFC 4122. Hasilkan satu UUID atau daftar dalam jumlah banyak untuk pengujian, pengisian database, dan sistem terdistribusi.",
    features_title: "Fitur",
    f_1: "Menghasilkan UUID v4 secara instan di browser",
    f_2: "Pembuatan massal hingga 100 UUID sekaligus",
    f_3: "Menyalin nilai individual atau seluruh daftar dengan satu klik",
    f_4: "Format UUID v4 sesuai RFC 4122",
    how_title: "Cara Kerja Generator UUID",
    how_desc: "Klik tombol generate untuk langsung membuat UUID v4 acak di browser Anda. Jika membutuhkan banyak sekaligus, aktifkan mode multiple dan pilih jumlah ID yang ingin dibuat. Setiap UUID mengikuti pola v4 yang ditentukan oleh RFC 4122, sehingga alat ini berguna untuk testing, development, integrasi, dan pemodelan data.",
    use_cases_title: "Kegunaan Utama",
    use_1_t: "Pengembangan Perangkat Lunak",
    use_1_d: "Buat identifier unik untuk entitas, record, dan referensi internal dalam arsitektur aplikasi Anda.",
    use_2_t: "Primary Key Database",
    use_2_d: "Hasilkan primary key terdistribusi tanpa bergantung pada urutan auto-increment, ideal untuk sistem terdistribusi.",
    use_3_t: "API dan Microservices",
    use_3_d: "Tetapkan ID resource, ID request, dan ID korelasi yang unik untuk melacak transaksi antar layanan.",
    use_4_t: "Pengujian e Seeding Data",
    use_4_d: "Hasilkan kumpulan nilai unik yang realistis untuk pengujian QA, fixture database, e rangkaian pengujian otomatis.",
    use_5_t: "Pelacakan e Pencatatan",
    use_5_d: "Beri label pada job, event, sesi pengguna, e data impor dengan aman untuk memastikan ketertelusuran e keunikan.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Pilih mode",
    step_1_desc: "Pilih pembuatan UUID tunggal atau aktifkan 'Hasilkan Banyak' untuk mengatur jumlah yang diinginkan (2–100).",
    step_2_title: "Generate",
    step_2_desc: "Klik tombol generate. UUID Anda muncul seketika, siap digunakan.",
    step_3_title: "Salin",
    step_3_desc: "Klik ikon salin di sebelah UUID mana saja atau gunakan 'Salin Semua' untuk menyalin seluruh daftar sekaligus.",
    faq_title: "Pertanyaan dan Jawaban",
    faq_1_q: "Apa itu UUID?",
    faq_1_a: "UUID (Universally Unique Identifier) adalah standar identifier 128-bit yang ditentukan oleh RFC 4122. Versi 4 menggunakan angka acak untuk menghasilkan kode unik, sehingga kemungkinan tabrakan hampir tidak ada.",
    faq_2_q: "Apakah UUID v4 benar-benar unik?",
    faq_2_a: "Ya. Dengan 122 bit acak, terdapat sekitar 5,3 undecillion kemungkinan kombinasi. Kemungkinan menghasilkan dua UUID yang sama sangat kecil secara astronomis, sehingga aman untuk sistem terdistribusi.",
    faq_3_q: "Apa perbedaan antar versi UUID?",
    faq_3_a: "UUID v1 menggunakan timestamp dan alamat MAC; v4 menggunakan angka acak (paling umum); v5 menggunakan namespace dan hash SHA-1. Versi 4 lebih disukai karena sederhana dan menjaga privasi (tidak mengekspos informasi hardware).",
    faq_4_q: "Bisakah saya menggunakan UUID sebagai primary key database?",
    faq_4_a: "Ya. UUID sangat cocok untuk database terdistribusi di mana ID auto-increment bisa menyebabkan konflik. UUID memungkinkan pembuatan ID di sisi client tanpa koordinasi dengan database.",
    multiple_label: "Hasilkan Banyak UUID",
    quantity: "Jumlah",
    bt: "Generate UUID",
    bt_multiple: "Generate UUID",
    generated_uuids: "UUID yang Dihasilkan ({count})",
    copy_all: "Salin Semua",
    copied: "Disalin!",
    placeholder: "Klik Generate untuk membuat UUID",
    see1: "Generator Crontab",
    see2: "Angka Acak",
    see3: "Generator Kartu Kredit",
    see4: "Pembanding Teks"
  },
  de: {
    pageTitle: "UUID-Generator – UUID v4 online erstellen | Kostenlos",
    title: "UUID-Generator",
    meta: "Kostenloser online UUID v4 Generator. Erstelle sofort einzelne oder mehrere eindeutige Identifikatoren für Software, Datenbanken, APIs und verteilte Systeme. RFC 4122 konform.",
    d1: "Erzeuge universell eindeutige Identifikatoren mit einem Klick. UUID v4 (Universally Unique Identifier Version 4) ist ein 36-stelliger alphanumerischer Code gemäß RFC 4122. Generiere einzelne UUIDs oder eine Liste für Tests, Datenbank-Seeding und verteilte Systeme.",
    features_title: "Funktionen",
    f_1: "UUID v4 sofort im Browser generieren",
    f_2: "Batch-Erstellung von bis zu 100 UUIDs gleichzeitig",
    f_3: "Einzelne Werte oder komplette Liste mit einem Klick kopieren",
    f_4: "RFC 4122 konformes UUID v4 Format",
    how_title: "So funktioniert der UUID-Generator",
    how_desc: "Klicke auf den Button „Generieren“, um sofort eine zufällige UUID v4 in deinem Browser zu erstellen. Wenn du mehrere benötigst, aktiviere die Mehrfachgenerierung und wähle die gewünschte Anzahl an IDs. Jede UUID folgt dem Standard-v4-Muster gemäß RFC 4122, was das Tool nützlich für Tests, Entwicklung, Integrationen und Datenmodellierung macht.",
    use_cases_title: "Anwendungsfälle",
    use_1_t: "Softwareentwicklung",
    use_1_d: "Erstelle eindeutige Identifikatoren für Entitäten, Datensätze und interne Referenzen in deiner Anwendungsarchitektur.",
    use_2_t: "Datenbank-Primärschlüssel",
    use_2_d: "Erzeuge verteilte Primärschlüssel ohne Abhängigkeit von Auto-Increment-Sequenzen, ideal für verteilte Systeme.",
    use_3_t: "APIs und Microservices",
    use_3_d: "Weise eindeutige Ressourcen-IDs, Request-IDs und Korrelations-IDs zu, um Transaktionen über Dienste hinweg zu verfolgen.",
    use_4_t: "Tests und Daten-Seeding",
    use_4_d: "Produziere Batches von realistischen eindeutigen Werten für QA-Tests, Datenbank-Fixtures und automatisierte Test-Suites.",
    use_5_t: "Tracking und Logging",
    use_5_d: "Kennzeichne Jobs, Events, Benutzersitzungen und importierte Daten sicher, um Rückverfolgbarkeit und Eindeutigkeit zu gewährleisten.",
    how_to_use_title: "So verwendest du das Tool",
    step_1_title: "Modus wählen",
    step_1_desc: "Wähle die Generierung einer einzelnen UUID oder aktiviere „Mehrere generieren“, um eine benutzerdefinierte Anzahl festzulegen (2–100).",
    step_2_title: "Generieren",
    step_2_desc: "Klicke auf den Generieren-Button. Deine UUID(s) erscheinen sofort und sind einsatzbereit.",
    step_3_title: "Kopieren",
    step_3_desc: "Klicke auf das Kopiersymbol neben einer UUID oder nutze „Alle kopieren“, um die gesamte Liste auf einmal zu kopieren.",
    faq_title: "Fragen & Antworten",
    faq_1_q: "Was ist eine UUID?",
    faq_1_a: "Eine UUID (Universally Unique Identifier) ist ein 128-Bit-Identifikationsstandard gemäß RFC 4122. Version 4 verwendet Zufallszahlen zur Erzeugung eindeutiger Codes, wodurch Kollisionen praktisch unmöglich sind.",
    faq_2_q: "Sind UUID v4 wirklich eindeutig?",
    faq_2_a: "Ja. Mit 122 zufälligen Bits gibt es 5,3 Undezillionen mögliche Kombinationen. Die Wahrscheinlichkeit, zwei identische UUIDs zu generieren, ist astronomisch gering, was sie sicher für verteilte Systeme macht.",
    faq_3_q: "Was ist der Unterschied zwischen den UUID-Versionen?",
    faq_3_a: "UUID v1 nutzt Zeitstempel und MAC-Adresse; v4 nutzt Zufallszahlen (am häufigsten); v5 nutzt Namensraum und SHA-1-Hash. Version 4 wird wegen ihrer Einfachheit und Privatsphäre bevorzugt.",
    faq_4_q: "Kann ich UUIDs als Datenbank-Primärschlüssel verwenden?",
    faq_4_a: "Ja. UUIDs sind ideal für verteilte Datenbanken, in denen Auto-Increment-IDs zu Konflikten führen würden. Sie ermöglichen die clientseitige ID-Generierung ohne Datenbankkoordination.",
    multiple_label: "Mehrere UUIDs generieren",
    quantity: "Anzahl",
    bt: "UUID generieren",
    bt_multiple: "UUIDs generieren",
    generated_uuids: "Generierte UUIDs ({count})",
    copy_all: "Alle kopieren",
    copied: "Kopiert!",
    placeholder: "Klicke auf Generieren, um eine UUID zu erstellen",
    see1: "Crontab-Generator",
    see2: "Zufallszahlengenerator",
    see3: "Kreditkartengenerator",
    see4: "Textvergleich"
  },
  nl: {
    pageTitle: "UUID-generator - Genereer UUID v4 Online | Gratis",
    title: "UUID-generator",
    meta: "Gratis online UUID v4-generator. Maak direct enkele of meerdere unieke identificatiecodes voor software, databases, API's en gedistribueerde systemen. RFC 4122-conform.",
    d1: "Genereer universeel unieke identificatiecodes met één klik. UUID v4 (Universally Unique Identifier versie 4) is een alfanumerieke code van 36 tekens gespecificeerd door RFC 4122. Genereer een enkele UUID of een bulklijst voor testen, database-seeding en gedistribueerde systemen.",
    features_title: "Kenmerken",
    f_1: "Genereer direct UUID v4 in de browser",
    f_2: "Bulkgeneratie van maximaal 100 UUID's tegelijk",
    f_3: "Kopieer individuele waarden of de volledige lijst met één klik",
    f_4: "RFC 4122-conform UUID v4-formaat",
    how_title: "Hoe de UUID-generator werkt",
    how_desc: "Klik op de genereerknop om direct een willekeurige UUID v4 in je browser aan te maken. Als je er meerdere nodig hebt, schakel dan 'Genereer meerdere' in en kies het gewenste aantal ID's. Elke UUID volgt het standaard v4-patroon gedefinieerd door RFC 4122, wat de tool nuttig maakt voor testen, ontwikkeling, integraties en datamodellering.",
    use_cases_title: "Belangrijkste gebruiksscenario's",
    use_1_t: "Softwareontwikkeling",
    use_1_d: "Maak unieke identificatiecodes voor entiteiten, records en interne referenties binnen je applicatie-architectuur.",
    use_2_t: "Database primaire sleutels",
    use_2_d: "Genereer gedistribueerde primaire sleutels zonder afhankelijk te zijn van auto-increment sequenties, ideaal voor gedistribueerde systemen.",
    use_3_t: "API's en microservices",
    use_3_d: "Wijs unieke resource-ID's, request-ID's en correlatie-ID's toe om transacties tussen services te volgen.",
    use_4_t: "Testen en database-seeding",
    use_4_d: "Produceer batches van realistische unieke waarden voor QA-testen, database-fixtures en geautomatiseerde testsuites.",
    use_5_t: "Tracking en logging",
    use_5_d: "Label taken, evenementen, gebruikerssessies en geïmporteerde gegevens veilig om traceerbaarheid en uniciteit te garanderen.",
    how_to_use_title: "Hoe deze tool te gebruiken",
    step_1_title: "Kies een modus",
    step_1_desc: "Selecteer de generatie van een enkele UUID, of schakel 'Genereer meerdere' in om een aangepast aantal in te stellen (2–100).",
    step_2_title: "Genereer",
    step_2_desc: "Klik op de genereerknop. Je UUID('s) verschijnen direct, klaar voor gebruik.",
    step_3_title: "Kopieer",
    step_3_desc: "Klik op het kopieericoon naast een UUID, of gebruik 'Alles kopiëren' om de hele lijst in één keer te kopiëren.",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Wat is een UUID?",
    faq_1_a: "UUID (Universally Unique Identifier) is een 128-bits identifier-standaard gedefinieerd door RFC 4122. Versie 4 gebruikt willekeurige getallen om unieke codes te genereren, waardoor botsingen vrijwel onmogelijk zijn.",
    faq_2_q: "Zijn UUID v4 echt uniek?",
    faq_2_a: "Ja. Met 122 willekeurige bits zijn er 5,3 undeciljard mogelijke combinaties. De kans op het genereren van twee identieke UUID's is astronomisch laag, waardoor ze veilig zijn voor gedistribueerde systemen.",
    faq_3_q: "Wat is het verschil tussen UUID-versies?",
    faq_3_a: "UUID v1 gebruikt een timestamp en MAC-adres; v4 gebruikt willekeurige getallen (meest voorkomend); v5 gebruikt een namespace en SHA-1 hash. Versie 4 heeft de voorkeur vanwege zijn eenvoud en privacy (geen hardware-informatie blootgesteld).",
    faq_4_q: "Kan ik UUID's gebruiken als database primaire sleutels?",
    faq_4_a: "Ja. UUID's zijn ideaal voor gedistribueerde databases waar auto-increment ID's conflicten zouden veroorzaken. Ze maken het mogelijk om ID's aan de clientzijde te genereren zonder coördinatie van de database.",
    multiple_label: "Genereer meerdere UUID's",
    quantity: "Aantal",
    bt: "Genereer UUID",
    bt_multiple: "Genereer UUID's",
    generated_uuids: "Gegenereerde UUID's ({count})",
    copy_all: "Alles kopiëren",
    copied: "Gekopieerd!",
    placeholder: "Klik op Genereer om een UUID aan te maken",
    see1: "Crontab-generator",
    see2: "Willekeurige getallen-generator",
    see3: "Creditcard-generator",
    see4: "Tekstvergelijker"
  }
}
</i18n>
