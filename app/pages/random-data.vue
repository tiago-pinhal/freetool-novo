<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta')
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }],
})

defineI18nRoute({
  paths: {
    en: '/random-data',
    pt: "/dados-aleatorios",
    es: "/datos-aleatorios",
    fr: '/donnees-aleatoires',
    it: '/dati-casuali',
    id: '/data-acak',
    de: '/zufallsdaten',
    nl: '/willekeurige-gegevens'
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <h2 class="sr-only">{{ t('available_generators') }}</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <ToolCard         :title="t('number')" 
        :to="localePath('random-number-generator')" 
        icon="mdi:dice-multiple"
        :index="0"
      />
      <ToolCard         :title="t('pass')" 
        :to="localePath('password-generator')" 
        icon="mdi:lock"
        :index="1"
      />
    </div>

    <!-- Developers Section -->
    <div class="mt-16 mb-8 flex items-center gap-4">
      <h3 class="text-sm font-bold text-base-content/50 uppercase tracking-widest">{{ t('devs') }}</h3>
      <div class="h-px flex-1 bg-base-content/10" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <ToolCard         :title="t('cpf')" 
        :to="localePath('cpf-generator')" 
        icon="mdi:card-account-details"
        :index="2"
      />
      <ToolCard :title="t('cnpj')" 
        :to="localePath('cnpj-generator')" 
        icon="mdi:office-building"
        :index="3"
      />
      <ToolCard :title="t('rg')" 
        :to="localePath('rg-generator')" 
        icon="mdi:card-account-details-outline"
        :index="4"
      />
      <ToolCard :title="t('cc')" 
        :to="localePath('credit-card-generator')" 
        icon="mdi:credit-card"
        :index="5"
      />
      <ToolCard :title="t('uuid')" 
        :to="localePath('uuid-generator')" 
        icon="mdi:identifier"
        :index="6"
      />
    </div>

    <div class="mt-16 bg-base-200/50 rounded-3xl p-8 border border-base-content/5 text-center">
      <Adsense />
    </div>
  </div>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Random Data Generators",
        meta: "Free online random data generators: numbers, passwords, CPF, CNPJ, RG, credit cards and UUID. Generate test data instantly!",
        desc: "With these tools, you can generate random numbers, secure passwords, and fictitious data for testing and development. Perfect for developers and testers. Instant and no installation required.",
        available_generators: "Available Generators",
        cc: "Credit Card Generator",
        number: "Random Number Generator",
        pass: "Password Generator",
        cpf: "CPF Generator 🇧🇷",
        cnpj: "CNPJ Generator 🇧🇷",
        rg: "RG Generator 🇧🇷",
        uuid: "UUID Generator",
        devs: "For Developers"
    },
    pt: {
        title: "Geradores de Dados Aleatórios",
        meta: "Geradores de dados aleatórios online grátis: números, senhas, CPF, CNPJ, RG, cartões de crédito e UUID. Gere dados de teste instantaneamente!",
        desc: "Com essas ferramentas, você pode gerar números aleatórios, senhas seguras e dados fictícios para testes e desenvolvimento. Perfeito para desenvolvedores e testadores. Instantâneo e sem necessidade de instalação.",
        available_generators: "Geradores Disponíveis",
        cc: "Gerador de Cartão de Crédito",
        number: "Gerador de Números Aleatórios",
        pass: "Gerador de Senha",
        cpf: "Gerador de CPF 🇧🇷",
        cnpj: "Gerador de CNPJ 🇧🇷",
        rg: "Gerador de RG 🇧🇷",
        uuid: "Gerador de UUID",
        devs: "Para Desenvolvedores"
    },
    es: {
        title: "Generadores de Datos Aleatorios",
        meta: "Generadores de datos aleatorios online gratis: números, contraseñas, CPF, CNPJ, RG, tarjetas de crédito y UUID. ¡Genera datos de prueba instantáneamente!",
        desc: "Con estas herramientas, puedes generar números aleatorios, contraseñas seguras y datos ficticios para pruebas y desarrollo. Perfecto para desarrolladores y testers. Instantáneo y sin necesidad de instalación.",
        available_generators: "Generadores Disponibles",
        cc: "Generador de Tarjeta de Crédito",
        number: "Generador de Números Aleatorios",
        pass: "Generador de Contraseña",
        cpf: "Generador de CPF 🇧🇷",
        cnpj: "Generador de CNPJ 🇧🇷",
        rg: "Generador de RG 🇧🇷",
        uuid: "Generador de UUID",
        devs: "Para Desarrolladores"
    },
    fr: {
        title: "Générateurs de Données Aléatoires",
        meta: "Générateurs de données aléatoires en ligne gratuits: nombres, mots de passe, CPF, CNPJ, RG, cartes de crédit et UUID. Générez des données de test instantanément!",
        desc: "Avec ces outils, vous pouvez générer des nombres aléatoires, des mots de passe sécurisés et des données fictives pour les tests et le développement. Parfait pour les développeurs et testeurs. Instantané et sans installation nécessaire.",
        available_generators: "Générateurs Disponibles",
        cc: "Générateur de Carte de Crédit",
        number: "Générateur de Nombres Aléatoires",
        pass: "Générateur de Mot de Passe",
        cpf: "Générateur de CPF 🇧🇷",
        cnpj: "Générateur de CNPJ 🇧🇷",
        rg: "Générateur de RG 🇧🇷",
        uuid: "Générateur de UUID",
        devs: "Pour les Développeurs"
    },
    it: {
        title: "Generatori di Dati Casuali",
        meta: "Generatori di dati casuali online gratuiti: numeri, password, CPF, CNPJ, RG, carte di credito e UUID. Genera dati di test istantaneamente!",
        desc: "Con questi strumenti, puoi generare numeri casuali, password sicure e dati fittizi per test e sviluppo. Perfetto per sviluppatori e tester. Istantaneo e senza necessità di installazione.",
        available_generators: "Generatori Disponibili",
        cc: "Generatore di Carta di Credito",
        number: "Generatore di Numeri Casuali",
        pass: "Generatore di Password",
        cpf: "Generatore di CPF 🇧🇷",
        cnpj: "Generatore di CNPJ 🇧🇷",
        rg: "Generatore di RG 🇧🇷",
        uuid: "Generatore di UUID",
        devs: "Per Sviluppatori"
    },
    id: {
        title: "Generator Data Acak",
        meta: "Generator data acak online gratis: angka, kata sandi, CPF, CNPJ, RG, kartu kredit, dan UUID. Buat data uji secara instan!",
        desc: "Dengan alat-alat ini, Anda dapat membuat angka acak, kata sandi yang aman, dan data fiktif untuk pengujian dan pengembangan. Sempurna untuk pengembang dan penguji. Instan dan tidak diperlukan instalasi.",
        available_generators: "Generator Tersedia",
        cc: "Generator Kartu Kredit",
        number: "Generator Angka Acak",
        pass: "Generator Kata Sandi",
        cpf: "Generator CPF 🇧🇷",
        cnpj: "Generator CNPJ 🇧🇷",
        rg: "Generator RG 🇧🇷",
        uuid: "Generator UUID",
        devs: "Untuk Developer"
    },
    de: {
        title: "Generatoren für Zufallsdaten",
        meta: "Kostenlose Online-Generatoren für Zufallsdaten: Zahlen, Passwörter, CPF, CNPJ, RG, Kreditkarten und UUID. Erzeuge Testdaten sofort!",
        desc: "Mit diesen Tools kannst du Zufallszahlen, sichere Passwörter und fiktive Daten für Tests und Entwicklung erzeugen. Perfekt für Entwickler und Tester. Sofort und ohne Installation.",
        available_generators: "Verfügbare Generatoren",
        cc: "Kreditkarten-Generator",
        number: "Zufallszahl-Generator",
        pass: "Passwort-Generator",
        cpf: "CPF-Generator 🇧🇷",
        cnpj: "CNPJ-Generator 🇧🇷",
        rg: "RG-Generator 🇧🇷",
        uuid: "UUID-Generator",
        devs: "Für Entwickler"
    },
    nl: {
        title: "Willekeurige gegevensgeneratoren",
        meta: "Gratis online willekeurige gegevensgeneratoren: getallen, wachtwoorden, CPF, CNPJ, RG, creditcards en UUID. Genereer direct testgegevens!",
        desc: "Met deze tools kun je willekeurige getallen, veilige wachtwoorden en fictieve gegevens genereren voor testen en ontwikkeling. Perfect voor ontwikkelaars en testers. Direct en geen installatie vereist.",
        available_generators: "Beschikbare generatoren",
        cc: "Creditcardgenerator",
        number: "Willekeurige getallengenerator",
        pass: "Wachtwoordgenerator",
        cpf: "CPF-generator 🇧🇷",
        cnpj: "CNPJ-generator 🇧🇷",
        rg: "RG-generator 🇧🇷",
        uuid: "UUID-generator",
        devs: "Voor ontwikkelaars"
    }
}
</i18n>
