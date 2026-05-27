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
        en: "/code-formatters",
        pt: "/formatadores-de-codigo",
        es: "/formateadores-de-codigo",
        fr: '/formateurs-de-code',
        it: '/formattatori-di-codice',
        id: '/pemformat-kode',
        de: '/code-formatierer',
        nl: '/code-formatteerders',
        ru: '/formatteery-koda'
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

    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <ToolCard         :title="t('html')" 
        :to="localePath('html-formatter')" 
        icon="mdi:language-html5"
        :index="0"
      />
      <ToolCard         :title="t('js')" 
        :to="localePath('javascript-formatter')" 
        icon="mdi:language-javascript"
        :index="1"
      />
      <ToolCard         :title="t('css')" 
        :to="localePath('css-formatter')" 
        icon="mdi:language-css3"
        :index="2"
      />
      <ToolCard         :title="t('json')" 
        :to="localePath('json-formatter')" 
        icon="mdi:code-json"
        :index="3"
      />
      <ToolCard         :title="t('graphql')" 
        :to="localePath('graphql-formatter')" 
        icon="mdi:graphql"
        :index="4"
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
        title: "Code Formatters",
        meta: "Free online code formatters: HTML, JSON, JavaScript, CSS and GraphQL. Format and beautify your code instantly!",
        desc: "Format and beautify your code in a structured and organized way. All processing happens in your browser, your code never leaves your device and no installation is required.",
        html: "HTML Formatter",
        json: "JSON Formatter",
        js: "JavaScript Formatter",
        css: "CSS Formatter",
        graphql: "GraphQL Formatter"
    },
    pt: {
        title: "Formatadores de Código",
        meta: "Formatadores de código online grátis: HTML, JSON, JavaScript, CSS e GraphQL. Formate e embeleze seu código instantaneamente!",
        desc: "Formate e embeleze seu código de forma estruturada e organizada. Todo o processamento acontece no seu navegador, seu código nunca sai do seu dispositivo e nenhuma instalação é necessária.",
        html: "Formatador de HTML",
        json: "Formatador JSON",
        js: "Formatador de JavaScript",
        css: "Formatador de CSS",
        graphql: "Formatador de GraphQL"
    },
    es: {
        title: "Formateadores de Código",
        meta: "Formateadores de código online gratis: HTML, JSON, JavaScript, CSS y GraphQL. ¡Formatea y embellece tu código instantáneamente!",
        desc: "Formatea y embellece tu código de manera estructurada y organizada. Todo el procesamiento ocurre en tu navegador, tu código nunca sale de tu dispositivo y no necesitas instalar nada.",
        html: "Formateador de HTML",
        json: "Formateador JSON",
        js: "Formateador de JavaScript",
        css: "Formateador de CSS",
        graphql: "Formateador de GraphQL"
    },
    fr: {
        title: "Formateurs de Code",
        meta: "Formateurs de code en ligne gratuits : HTML, JSON, JavaScript, CSS et GraphQL. Formatez et embellissez votre code instantanément !",
        desc: "Formatez et embellissez votre code de manière structurée et organisée. Tout le traitement se fait dans votre navigateur, votre code ne quitte jamais votre appareil et aucune installation n'est requise.",
        html: "Formateur HTML",
        json: "Formateur JSON",
        js: "Formateur JavaScript",
        css: "Formateur CSS",
        graphql: "Formateur GraphQL"
    },
    it: {
        title: "Formattatori di Codice",
        meta: "Formattatori di codice online gratuiti: HTML, JSON, JavaScript, CSS e GraphQL. Formatta e abbellisci il tuo codice istantaneamente!",
        desc: "Formatta e abbellisci il tuo codice in modo strutturato e organizzato. Tutta l'elaborazione avviene nel tuo browser, il tuo codice non lascia mai il dispositivo e non è necessaria alcuna installazione.",
        html: "Formattatore HTML",
        json: "Formattatore JSON",
        js: "Formattatore JavaScript",
        css: "Formattatore CSS",
        graphql: "Formattatore GraphQL"
    },
    id: {
        title: "Pemformat Kode",
        meta: "Pemformat kode online gratis: HTML, JSON, JavaScript, CSS dan GraphQL. Format dan percantik kode Anda secara instan!",
        desc: "Format dan percantik kode Anda secara terstruktur dan terorganisir. Semua pemrosesan dilakukan di browser Anda, kode Anda tidak pernah meninggalkan perangkat Anda dan tidak diperlukan instalasi.",
        html: "Pemformat HTML",
        json: "Pemformat JSON",
        js: "Pemformat JavaScript",
        css: "Pemformat CSS",
        graphql: "Pemformat GraphQL"
    },
    de: {
        title: "Code-Formatierer",
        meta: "Kostenlose Online-Code-Formatierer: HTML, JSON, JavaScript, CSS und GraphQL. Formatiere und verschönere deinen Code sofort!",
        desc: "Formatiere und verschönere deinen Code auf strukturierte und organisierte Weise. Die gesamte Verarbeitung läuft in deinem Browser, dein Code verlässt niemals dein Gerät und es ist keine installation erforderlich.",
        html: "HTML-Formatierer",
        json: "JSON-Formatierer",
        js: "JavaScript-Formatierer",
        css: "CSS-Formatierer",
        graphql: "GraphQL-Formatierer"
    },
    nl: {
        title: "Code-formatteerders",
        meta: "Gratis online code-formatteerders: HTML, JSON, JavaScript, CSS en GraphQL. Formatteer en verfraai je code direct!",
        desc: "Formatteer en verfraai je code op een gestructureerde en georganiseerde manier. Alle verwerking vindt plaats in je browser, je code verlaat je apparaat nooit en er is geen installatie nodig.",
        html: "HTML-formatteerder",
        json: "JSON-formatteerder",
        js: "JavaScript-formatteerder",
        css: "CSS-formatteerder",
        graphql: "GraphQL-formatteerder"
    },
    ru: {
        title: "Форматтеры кода",
        meta: "Бесплатные онлайн-форматтеры кода: HTML, JSON, JavaScript, CSS и GraphQL. Мгновенно форматируйте и улучшайте внешний вид вашего кода!",
        desc: "Форматируйте и структурируйте ваш код, делая его чистым и удобным для чтения. Вся обработка происходит прямо в браузере: ваш код никогда не покидает устройство, и установка дополнительных инструментов не требуется.",
        html: "Форматтер HTML",
        json: "Форматтер JSON",
        js: "Форматтер JavaScript",
        css: "Форматтер CSS",
        graphql: "Форматтер GraphQL"
    }
}
</i18n>
