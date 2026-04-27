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
        pt: "/formatadores-de-codigo",
        es: "/formateadores-de-codigo",
        fr: '/formateurs-de-code',
        it: '/formattatori-di-codice',
        id: '/pemformat-kode'
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
      <ToolCard         :title="t('graphql')" 
        :to="localePath('graphql-formatter')" 
        icon="mdi:graphql"
        :index="3"
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
        meta: "Free online code formatters: HTML, JavaScript, CSS and GraphQL. Format and beautify your code instantly!",
        desc: "Format and beautify your code in a structured and organized way. All processing happens in your browser, your code never leaves your device and no installation is required.",
        html: "HTML Formatter",
        js: "JavaScript Formatter",
        css: "CSS Formatter",
        graphql: "GraphQL Formatter"
    },
    pt: {
        title: "Formatadores de Código",
        meta: "Formatadores de código online grátis: HTML, JavaScript, CSS e GraphQL. Formate e embeleze seu código instantaneamente!",
        desc: "Formate e embeleze seu código de forma estruturada e organizada. Todo o processamento acontece no seu navegador, seu código nunca sai do seu dispositivo e nenhuma instalação é necessária.",
        html: "Formatador de HTML",
        js: "Formatador de JavaScript",
        css: "Formatador de CSS",
        graphql: "Formatador de GraphQL"
    },
    es: {
        title: "Formateadores de Código",
        meta: "Formateadores de código online gratis: HTML, JavaScript, CSS y GraphQL. ¡Formatea y embellece tu código instantáneamente!",
        desc: "Formatea y embellece tu código de manera estructurada y organizada. Todo el procesamiento ocurre en tu navegador, tu código nunca sale de tu dispositivo y no necesitas instalar nada.",
        html: "Formateador de HTML",
        js: "Formateador de JavaScript",
        css: "Formateador de CSS",
        graphql: "Formateador de GraphQL"
    },
    fr: {
        title: "Formateurs de Code",
        meta: "Formateurs de code en ligne gratuits : HTML, JavaScript, CSS et GraphQL. Formatez et embellissez votre code instantanément !",
        desc: "Formatez et embellissez votre code de manière structurée et organisée. Tout le traitement se fait dans votre navigateur, votre code ne quitte jamais votre appareil et aucune installation n'est requise.",
        html: "Formateur HTML",
        js: "Formateur JavaScript",
        css: "Formateur CSS",
        graphql: "Formateur GraphQL"
    },
    it: {
        title: "Formattatori di Codice",
        meta: "Formattatori di codice online gratuiti: HTML, JavaScript, CSS e GraphQL. Formatta e abbellisci il tuo codice istantaneamente!",
        desc: "Formatta e abbellisci il tuo codice in modo strutturato e organizzato. Tutta l'elaborazione avviene nel tuo browser, il tuo codice non lascia mai il dispositivo e non è necessaria alcuna installazione.",
        html: "Formattatore HTML",
        js: "Formattatore JavaScript",
        css: "Formattatore CSS",
        graphql: "Formattatore GraphQL"
    },
    id: {
        title: "Pemformat Kode",
        meta: "Pemformat kode online gratis: HTML, JavaScript, CSS dan GraphQL. Format dan percantik kode Anda secara instan!",
        desc: "Format dan percantik kode Anda secara terstruktur dan terorganisir. Semua pemrosesan dilakukan di browser Anda, kode Anda tidak pernah meninggalkan perangkat Anda dan tidak diperlukan instalasi.",
        html: "Pemformat HTML",
        js: "Pemformat JavaScript",
        css: "Pemformat CSS",
        graphql: "Pemformat GraphQL"
    }
}
</i18n>
