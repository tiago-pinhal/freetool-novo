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
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    pt: '/minificadores-de-codigo',
    es: '/minificadores-de-codigo',
    fr: '/minificateurs-de-code',
    it: '/minificatori-di-codice',
    id: '/minifikasi-kode'
  },
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
      <ToolCard        :title="t('html')"
        :to="localePath('html-minifier')"
        icon="mdi:language-html5"
        :index="0"
      />
      <ToolCard        :title="t('js')"
        :to="localePath('javascript-minifier')"
        icon="mdi:language-javascript"
        :index="1"
      />
      <ToolCard        :title="t('css')"
        :to="localePath('css-minifier')"
        icon="mdi:language-css3"
        :index="2"
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
        title: "Code Minifiers",
        meta: "Free online code minifiers: HTML, JavaScript and CSS. Optimize and compress your code to improve page load time instantly!",
        desc: "Minify and compress your HTML, JavaScript and CSS code to reduce file size and speed up page load. All processing happens in your browser, your code never leaves your device and no installation is required.",
        html: "HTML Minifier",
        js: "JavaScript Minifier",
        css: "CSS Minifier"
    },
    pt: {
        title: "Minificadores de Código",
        meta: "Minificadores de código online grátis: HTML, JavaScript e CSS. Otimize e comprima seu código para melhorar o tempo de carregamento instantaneamente!",
        desc: "Minifique e comprima seu código HTML, JavaScript e CSS para reduzir o tamanho dos arquivos e acelerar o carregamento das páginas. Todo o processamento acontece no seu navegador, seu código nunca sai do seu dispositivo e nenhuma instalação é necessária.",
        html: "Minificador de HTML",
        js: "Minificador de JavaScript",
        css: "Minificador de CSS"
    },
    es: {
        title: "Minificadores de Código",
        meta: "Minificadores de código online gratis: HTML, JavaScript y CSS. ¡Optimiza y comprime tu código para mejorar el tiempo de carga instantáneamente!",
        desc: "Minifica y comprime tu código HTML, JavaScript y CSS para reducir el tamaño de los archivos y acelerar la carga de las páginas. Todo el procesamiento ocurre en tu navegador, tu código nunca sale de tu dispositivo y no necesitas instalar nada.",
        html: "Minificador de HTML",
        js: "Minificador de JavaScript",
        css: "Minificador de CSS"
    },
    fr: {
        title: "Minificateurs de Code",
        meta: "Minificateurs de code en ligne gratuits : HTML, JavaScript et CSS. Optimisez et compressez votre code pour améliorer le temps de chargement instantanément !",
        desc: "Minifiez et compressez votre code HTML, JavaScript et CSS pour réduire la taille des fichiers et accélérer le chargement des pages. Tout le traitement se fait dans votre navigateur, votre code ne quitte jamais votre appareil et aucune installation n'est requise.",
        html: "Minificateur HTML",
        js: "Minificateur JavaScript",
        css: "Minificateur CSS"
    },
    it: {
        title: "Minificatori di Codice",
        meta: "Minificatori di codice online gratuiti: HTML, JavaScript e CSS. Ottimizza e comprimi il tuo codice per migliorare il tempo di caricamento istantaneamente!",
        desc: "Minifica e comprimi il tuo codice HTML, JavaScript e CSS per ridurre la dimensione dei file e velocizzare il caricamento delle pagine. Tutta l'elaborazione avviene nel tuo browser, il tuo codice non lascia mai il dispositivo e non è necessaria alcuna installazione.",
        html: "Minificatore HTML",
        js: "Minificatore JavaScript",
        css: "Minificatore CSS"
    },
    id: {
        title: "Minifikasi Kode",
        meta: "Minifikasi kode online gratis: HTML, JavaScript, dan CSS. Optimalkan dan kompres kode Anda untuk meningkatkan waktu pemuatan halaman secara instan!",
        desc: "Minimalkan dan kompres kode HTML, JavaScript, dan CSS Anda untuk mengurangi ukuran file dan mempercepat pemuatan halaman. Semua pemrosesan dilakukan di browser Anda, kode Anda tidak pernah meninggalkan perangkat dan tidak diperlukan instalasi apa pun.",
        html: "Minifikasi HTML",
        js: "Minifikasi JavaScript",
        css: "Minifikasi CSS"
    }
}
</i18n>
