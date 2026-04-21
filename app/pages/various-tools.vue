<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageJsonLd({
  type: 'page',
  name: t('title'),
  description: t('meta'),
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') },
  ],
})

useHead({
  title: t('title'),
  meta: [{ name: "description", content: t('meta') }],
})

defineI18nRoute({
  paths: {
        pt: "/ferramentas-diversas",
        es: "/herramientas-diversas",
    fr: '/outils-divers',
        it: "/strumenti-diversi",
        id: "/berbagai-alat",
        de: "/verschiedene-werkzeuge"
    }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="tools-title">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content/70 mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">
      <ToolCard        :title="t('calc')"
        :to="localePath('percentage-calculator')"
        icon="mdi:percent"
        :index="0"
      />
      <ToolCard        :title="t('list')"
        :to="localePath('list-randomizer')"
        icon="mdi:shuffle-variant"
        :index="1"
      />
      <ToolCard        :title="t('dice')"
        :to="localePath('dice-roller')"
        icon="mdi:dice-multiple"
        :index="2"
      />
      <ToolCard        :title="t('rule')"
        :to="localePath('simple-rule-of-three-calculator')"
        icon="mdi:numeric-3-box-multiple-outline"
        :index="3"
      />
      <ToolCard        :title="t('email')"
        :to="localePath('email-extractor')"
        icon="mdi:at"
        :index="4"
      />
    </div>

    <div class="mt-16 mb-8 flex items-center gap-4">
      <h2 class="text-xl font-bold text-base-content/50 uppercase tracking-widest">{{ t('devs') }}</h2>
      <div class="h-px flex-1 bg-base-content/10" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">
      <ToolCard        :title="t('json')"
        :to="localePath('json-viewer')"
        icon="mdi:code-json"
        :index="5"
      />
      <ToolCard        :title="t('md5')"
        :to="localePath('md5-hash-generator')"
        icon="mdi:hashtag"
        :index="6"
      />
      <ToolCard        :title="t('bcrypt')"
        :to="localePath('bcrypt-generator')"
        icon="mdi:script-text-key"
        :index="0"
      />
    </div>

    <div class="mt-16 bg-base-200/50 rounded-3xl p-8 border border-base-content/5">
      <Adsense />
    </div>
  </div>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Miscellaneous Tools",
        meta: "Free online miscellaneous tools: percentage calculator, list randomizer, dice roller, rule of three, email extractor, JSON viewer, MD5 and Bcrypt generators. Useful tools for everyday tasks!",
        desc: "Calculate percentages, randomize lists, roll dice, solve rule of three problems, extract emails from text and view formatted JSON. All processing happens in your browser and no installation is required.",
        devs: "For Developers",
        calc: "Percentage Calculator",
        list: "List Randomizer",
        dice: "Dice Roller",
        rule: "Rule of Three",
        email: "Email Extractor",
        json: "JSON Viewer",
        md5: "MD5 Hash Generator",
        bcrypt: "Bcrypt Generator",
    },
    pt: {
        title: "Ferramentas Diversas",
        meta: "Ferramentas online grátis diversas: calculadora de porcentagem, sorteador de listas, lançador de dados, regra de três, extrator de e-mails, visualizador JSON, geradores MD5 e Bcrypt. Ferramentas úteis para o dia a dia!",
        desc: "Calcule porcentagens, sorteie listas, role dados, resolva regra de três, extraia e-mails de textos e visualize JSON formatado. Todo o processamento acontece no seu navegador e nenhuma instalação é necessária.",
        devs: "Para Desenvolvedores",
        calc: "Calculadora de Porcentagem",
        list: "Sorteador de Listas",
        dice: "Lançador de Dados",
        rule: "Regra de Três",
        email: "Extrator de E-mails",
        json: "Visualizador de JSON",
        md5: "Gerador de Hash MD5",
        bcrypt: "Gerador Bcrypt",
    },
    es: {
        title: "Herramientas Diversas",
        meta: "Herramientas online gratis diversas: calculadora de porcentaje, aleatorizador de listas, lanzador de dados, regla de tres, extractor de correos, visor JSON, generadores MD5 y Bcrypt. ¡Herramientas útiles para el día a día!",
        desc: "Calcula porcentajes, aleatoriza listas, lanza dados, resuelve regla de tres, extrae correos electrónicos de textos y visualiza JSON formateado. Todo el procesamiento ocurre en tu navegador y no necesitas instalar nada.",
        devs: "Para Desarrolladores",
        calc: "Calculadora de Porcentaje",
        list: "Aleatorizador de Listas",
        dice: "Lanzador de Dados",
        rule: "Regla de Tres",
        email: "Extractor de Correos",
        json: "Visor de JSON",
        md5: "Generador de Hash MD5",
        bcrypt: "Generador Bcrypt",
    },
    fr: {
        title: "Outils Divers",
        meta: "Outils en ligne gratuits divers : calculatrice de pourcentage, mélangeur de listes, lanceur de dés, règle de trois, extracteur d'e-mails, visualiseur JSON, générateurs MD5 et Bcrypt. Outils utiles pour le quotidien !",
        desc: "Calculez des pourcentages, mélangez des listes, lancez des dés, résolvez la règle de trois, extrayez des e-mails de textes et visualisez du JSON formaté. Tout le traitement se fait dans votre navigateur et aucune installation n'est requise.",
        devs: "Pour les Développeurs",
        calc: "Calculatrice de Pourcentage",
        list: "Mélangeur de Listes",
        dice: "Lanceur de Dés",
        rule: "Règle de Trois",
        email: "Extracteur d'E-mails",
        json: "Visualiseur JSON",
        md5: "Générateur de Hash MD5",
        bcrypt: "Générateur Bcrypt",
    },
    it: {
        title: "Strumenti Vari",
        meta: "Strumenti online gratuiti vari: calcolatrice di percentuale, randomizzatore di liste, lanciatore di dadi, regola di tre, estrattore di email, visualizzatore JSON, generatori MD5 e Bcrypt. Strumenti utili per le attività quotidiane!",
        desc: "Calcola percentuali, mescola liste, lancia dadi, risolvi la regola di tre, estrai email da testi e visualizza JSON formattato. Tutta l'elaborazione avviene nel tuo browser e non è necessaria alcuna installazione.",
        devs: "Per Sviluppatori",
        calc: "Calcolatrice di Percentuale",
        list: "Randomizzatore di Liste",
        dice: "Lanciatore di Dadi",
        rule: "Regola di Tre",
        email: "Estrattore di Email",
        json: "Visualizzatore di JSON",
        md5: "Generatore di Hash MD5",
        bcrypt: "Generatore Bcrypt",
    },
    id: {
        title: "Berbagai Alat",
        meta: "Alat online gratis: kalkulator persentase, pengacak daftar, pelempar dadu, aturan tiga, ekstraktor email, penampil JSON, generator MD5 dan Bcrypt. Alat berguna untuk kegiatan sehari-hari!",
        desc: "Hitung persentase, acak daftar, lempar dadu, selesaikan aturan tiga, ekstrak email dari teks dan tampilkan JSON terformat. Semua pemrosesan dilakukan di browser Anda dan tidak diperlukan instalasi apa pun.",
        devs: "Untuk Developer",
        calc: "Kalkulator Persentase",
        list: "Pengacak Daftar",
        dice: "Pelempar Dadu",
        rule: "Aturan Tiga",
        email: "Ekstraktor Email",
        json: "Penampil JSON",
        md5: "Generator Hash MD5",
        bcrypt: "Generator Bcrypt",
    },
    de: {
        title: "Verschiedene Werkzeuge",
        meta: "Kostenlose Online-Tools: Prozentrechner, Listen-Randomizer, Würfelwurf, Dreisatz, E-Mail-Extraktor, JSON-Viewer, MD5- und Bcrypt-Generatoren. Nützliche Tools für den Alltag!",
        desc: "Berechnen Sie Prozentsätze, mischen Sie Listen, würfeln Sie, lösen Sie Dreisatz-Aufgaben, extrahieren Sie E-Mails aus Texten und zeigen Sie formatierten JSON an. Die Verarbeitung erfolgt vollständig in Ihrem Browser und eine Installation ist nicht erforderlich.",
        devs: "Für Entwickler",
        calc: "Prozentrechner",
        list: "Listen-Randomizer",
        dice: "Würfelwurf",
        rule: "Dreisatz",
        email: "E-Mail-Extraktor",
        json: "JSON-Viewer",
        md5: "MD5-Hash-Generator",
        bcrypt: "Bcrypt-Generator",
    }
}
</i18n>
