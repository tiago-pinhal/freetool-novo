<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()

// JSON-LD and SEO
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
        pt: '/ferramentas-para-pdf',
        es: '/herramientas-para-pdf',
        fr: '/outils-pour-pdf',
        it: '/strumenti-per-pdf',
        id: '/alat-pdf',
        de: '/pdf-werkzeuge'
    }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
        {{ t('title') }}
      </h1>
      <p class="text-lg text-base-content/70 mx-auto">
        {{ t('desc') }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ToolCard 
        :title="t('edit')" 
        to="pdf-editor" 
        icon="mdi:file-cog"
        :index="0"
      />
      <ToolCard 
        :title="t('split')" 
        to="pdf-splitter" 
        icon="mdi:content-cut"
        :index="1"
      />
      <ToolCard 
        :title="t('num')" 
        to="numbering-pdf" 
        icon="mdi:numeric-1-box-multiple-outline"
        :index="2"
      />
      <ToolCard 
        :title="t('to_img')" 
        to="pdf-to-image" 
        icon="mdi:file-image"
        :index="3"
      />
    </div>

    <!-- Ad placeholder -->
    <div class="mt-16 bg-base-200/50 rounded-3xl p-8 border border-base-content/5">
      <Adsense />
    </div>
  </div>
</template>

<i18n lang="yaml">
{
    en: {
        title: "PDF Tools",
        meta: "Free online PDF tools: edit, split, number pages and convert PDF to image. Powerful document manipulation without software installation!",
        desc: "With these tools, you can edit, split, add page numbers to PDF files and convert them to images, all with ease. Processing happens entirely in your browser, so your documents never leave your device and no software installation is required.",
        edit: "Edit PDF",
        split: "Split PDF",
        num: "Number PDF",
        to_img: "PDF to Image",
    },
    pt: {
        title: "Ferramentas para PDF",
        meta: "Ferramentas de PDF online grátis: editar, dividir, numerar páginas e converter PDF em imagem. Manipulação poderosa de documentos sem instalação de software!",
        desc: "Com essas ferramentas, você pode editar, dividir, adicionar numeração de páginas e converter arquivos PDF em imagens com facilidade. Todo o processamento acontece no seu navegador, seus documentos nunca saem do seu dispositivo e nenhuma instalação é necessária.",
        edit: "Editar PDF",
        split: "Dividir PDF",
        num: "Numerar PDF",
        to_img: "PDF para Imagem",
    },
    es: {
        title: "Herramientas para PDF",
        meta: "Herramientas de PDF online gratis: editar, dividir, numerar páginas y convertir PDF a imagen. ¡Manipulación poderosa de documentos sin instalación de software!",
        desc: "Con estas herramientas puedes editar, dividir, añadir numeración de páginas y convertir archivos PDF a imágenes fácilmente. Todo el procesamiento ocurre en tu navegador, tus documentos nunca salen de tu dispositivo y no se necesita ninguna instalación.",
        edit: "Editar PDF",
        split: "Dividir PDF",
        num: "Numerar PDF",
        to_img: "PDF a Imagen",
    },
    fr: {
        title: "Outils pour PDF",
        meta: "Outils PDF en ligne gratuits : éditer, diviser, numéroter les pages et convertir un PDF en image. Manipulation puissante de documents sans installation de logiciel !",
        desc: "Avec ces outils, vous pouvez éditer, diviser, numéroter les pages et convertir des fichiers PDF en images facilement. Tout le traitement se fait dans votre navigateur, vos documents ne quittent jamais votre appareil et aucune installation n'est requise.",
        edit: "Éditer PDF",
        split: "Diviser PDF",
        num: "Numéroter PDF",
        to_img: "PDF en Image",
    },
    it: {
        title: "Strumenti per PDF",
        meta: "Strumenti PDF online gratuiti: modifica, dividi, numera le pagine e converti PDF in immagine. Gestione potente dei documenti senza installazione di software!",
        desc: "Con questi strumenti puoi modificare, dividere, aggiungere numerazione alle pagine e convertire file PDF in immagini con facilità. L'elaborazione avviene interamente nel tuo browser, i tuoi documenti non lasciano mai il dispositivo e non è richiesta alcuna installazione.",
        edit: "Modifica PDF",
        split: "Dividi PDF",
        num: "Numera PDF",
        to_img: "PDF in Immagine",
    },
    id: {
        title: "Alat PDF",
        meta: "Alat PDF online gratis: edit, pisahkan, beri nomor halaman, dan konversi PDF ke gambar. Manipulasi dokumen yang andal tanpa instalasi perangkat lunak!",
        desc: "Dengan alat-alat ini, Anda dapat mengedit, memisahkan, memberi nomor halaman, dan mengonversi file PDF menjadi gambar dengan mudah. Semua pemrosesan dilakukan di browser Anda, dokumen Anda tidak pernah meninggalkan perangkat dan tidak diperlukan instalasi apa pun.",
        edit: "Edit PDF",
        split: "Pisahkan PDF",
        num: "Beri Nomor PDF",
        to_img: "PDF ke Gambar",
    },
    de: {
        title: "PDF-Werkzeuge",
        meta: "Kostenlose Online-PDF-Tools: PDF-Dateien bearbeiten, teilen, nummerieren und in Bilder konvertieren. Leistungsstarke Dokumentenbearbeitung ohne Softwareinstallation!",
        desc: "Mit diesen Tools können Sie PDF-Dateien bearbeiten, teilen, Seitenzahlen hinzufügen und in Bilder konvertieren. Die gesamte Verarbeitung erfolgt in Ihrem Browser, Ihre Dokumente verlassen niemals Ihr Gerät und eine Installation ist nicht erforderlich.",
        edit: "PDF bearbeiten",
        split: "PDF teilen",
        num: "PDF nummerieren",
        to_img: "PDF zu Bild",
    }
}
</i18n>
