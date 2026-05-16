<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('title')} | Freetool.Dev`,
  meta: [{ name: 'description', content: t('seo_desc') }],
})

usePageJsonLd({
  type: 'page',
  name: `${t('title')} | Freetool.Dev`,
})

defineI18nRoute({
  paths: {
    en: '/about',
    pt: '/sobre',
    es: '/sobre',
    fr: '/a-propos',
    it: '/chi-siamo',
    id: '/tentang-kami',
    de: '/ueber-uns',
    nl: '/over-ons',
  },
})
</script>

<template>
  <div class="container mx-auto px-4 py-24 min-h-[60vh]">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <img src="/img/logo.png" :alt="t('logo_alt')" class="w-12 h-12 object-contain" />
        <h1 class="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {{ t('title') }} FreeTool.Dev
        </h1>
      </div>
      <div class="prose lg:prose-xl space-y-5 text-lg font-medium opacity-90">
        <p>{{ t('meta') }}</p>
        <p>{{ t('d1') }}</p>
        <p>{{ t('d2') }}</p>
        <p>{{ t('d3') }}</p>
        <p>{{ t('d4') }}</p>
        <p>{{ t('d5') }}</p>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
{
  en: {
    title: "About",
    seo_desc: "FreeTool.dev offers a wide variety of free online tools to simplify the daily workflow of developers, designers, students, and tech professionals.",
    meta: "FreeTool.dev is a platform offering a wide variety of completely free online tools, designed to simplify the daily workflow of developers, software testers, designers, content creators, students, and other professionals in the technology and digital creation fields.",
    d1: "Our purpose is to simplify common and recurring tasks, providing practical solutions through tools organized across a variety of categories.",
    d2: "Although many of our solutions are especially useful for technology professionals, we also offer resources aimed at the general public — providing simple, fast alternatives for everyday activities.",
    d3: "Beyond online tools, we offer utility apps on the Google Play Store, expanding our reach and allowing these tasks to be performed directly on smartphones, in a practical and accessible way.",
    d4: "We value efficiency and accessibility, so we strive to provide resources that eliminate the need to install complex software — enabling tasks to be completed quickly, safely, and intuitively.",
    d5: "FreeTool.dev is a collaborative, constantly evolving space designed to support both experienced professionals and those taking their first steps in the world of technology or simply anyone looking for practical solutions for everyday life.",
    logo_alt: "FreeTool.dev Logo"
  },
  pt: {
    title: "Sobre",
    seo_desc: "O FreeTool.dev oferece diversas ferramentas online gratuitas para facilitar o dia a dia de desenvolvedores, designers, estudantes e profissionais de tecnologia.",
    meta: "O FreeTool.dev é uma plataforma que oferece uma ampla variedade de ferramentas online, totalmente gratuitas, projetadas para facilitar o dia a dia de desenvolvedores, testadores de software, designers, criadores de conteúdo, estudantes e demais profissionais que atuam com tecnologia e criação digital.",
    d1: "Nosso propósito é simplificar tarefas comuns e recorrentes, oferecendo soluções práticas por meio de ferramentas organizadas em diversas categorias.",
    d2: "Embora muitas das nossas soluções sejam especialmente úteis para profissionais da área de tecnologia, também disponibilizamos recursos voltados ao público em geral, proporcionando alternativas simples e rápidas para atividades cotidianas.",
    d3: "Além das ferramentas online, oferecemos aplicativos utilitários na loja de apps do Google, ampliando as possibilidades de uso e permitindo que essas tarefas sejam realizadas diretamente pelo smartphone, de forma prática e acessível.",
    d4: "Valorizamos a eficiência e a acessibilidade, por isso buscamos disponibilizar recursos que eliminem a necessidade de instalar softwares complexos, possibilitando a execução das tarefas de maneira rápida, segura e intuitiva.",
    d5: "O FreeTool.dev é um espaço colaborativo e em constante evolução, pensado para apoiar desde profissionais experientes até quem está dando os primeiros passos no universo da tecnologia ou mesmo quem busca soluções práticas para o dia a dia.",
    logo_alt: "Logo do FreeTool.dev"
  },
  es: {
    title: "Sobre nosotros",
    seo_desc: "FreeTool.dev ofrece diversas herramientas en línea gratuitas para facilitar el día a día de desarrolladores, diseñadores, estudiantes y profesionales de la tecnología.",
    meta: "FreeTool.dev es una plataforma que ofrece una amplia variedad de herramientas en línea, totalmente gratuitas, diseñadas para facilitar el día a día de desarrolladores, probadores de software, diseñadores, creadores de contenido, estudiantes y demás profesionales de la tecnología y creación digital.",
    d1: "Nuestro propósito es simplificar tareas comunes y recurrentes, ofreciendo soluciones prácticas mediante herramientas organizadas en diversas categorías.",
    d2: "Aunque muchas de nuestras soluciones son especialmente útiles para profesionales del área tecnológica, también ofrecemos recursos dirigidos al público en general, brindando alternativas simples y rápidas para actividades cotidianas.",
    d3: "Además de las herramientas en línea, ofrecemos aplicaciones utilitarias en la tienda de apps de Google, ampliando las posibilidades de uso y permitiendo realizar estas tareas directamente desde el smartphone de forma práctica y accesible.",
    d4: "Valoramos la eficiencia y la accesibilidad, por lo que buscamos proporcionar recursos que eliminen la necesidad de instalar software complejo, permitiendo ejecutar tareas de manera rápida, segura e intuitiva.",
    d5: "FreeTool.dev es un espacio colaborativo y en constante evolución, pensado para apoyar tanto a profesionales experimentados como a quienes dan sus primeros pasos en el mundo de la tecnología, o simplemente a quienes buscan soluciones prácticas para su día a día.",
    logo_alt: "Logo de FreeTool.dev"
  },
  fr: {
    title: "À propos",
    seo_desc: "FreeTool.dev propose divers outils en ligne gratuits pour simplifier le quotidien des développeurs, designers, étudiants et professionnels de la technologie.",
    meta: "FreeTool.dev est une plateforme offrant une grande variété d'outils en ligne, totalement gratuits, conçus pour faciliter le quotidien des développeurs, testeurs de logiciels, designers, créateurs de contenu, étudiants et autres professionnels de la technologie et de la création numérique.",
    d1: "Notre but est de simplifier les tâches courantes et récurrentes, en offrant des solutions pratiques via des outils organisés en diverses catégories.",
    d2: "Bien que nombre de nos solutions soient particulièrement utiles aux professionnels de la technologie, nous proposons également des ressources destinées au grand public, offrant des alternatives simples et rapides pour les activités quotidiennes.",
    d3: "Outre les outils en ligne, nous proposons des applications utilitaires sur le Google Play Store, élargissant les possibilités d'utilisation et permettant de réaliser ces tâches directement sur smartphone de manière pratique et accessible.",
    d4: "Nous valorisons l'efficacité et l'accessibilité, c'est pourquoi nous cherchons à fournir des ressources qui éliminent le besoin d'installer des logiciels complexes, permettant d'exécuter des tâches de manière rapide, sûre et intuitive.",
    d5: "FreeTool.dev est un espace collaboratif en constante évolution, conçu pour soutenir aussi bien les professionnels expérimentés que ceux qui font leurs premiers pas dans l'univers de la technologie, ou simplement ceux qui recherchent des solutions pratiques au quotidien.",
    logo_alt: "Logo FreeTool.dev"
  },
  it: {
    title: "Chi siamo",
    seo_desc: "FreeTool.dev offre vari strumenti online gratuiti per semplificare la vita quotidiana di sviluppatori, designer, studenti e professionisti della tecnologia.",
    meta: "FreeTool.dev è una piattaforma che offre un'ampia varietà di strumenti online, completamente gratuiti, progettati per facilitare la vita quotidiana di sviluppatori, tester di software, designer, creatori di contenuti, studenti e altri professionisti della tecnologia e della creazione digitale.",
    d1: "Il nostro scopo è semplificare compiti comuni e ricorrenti, offrendo soluzioni pratiche attraverso strumenti organizzati in diverse categorie.",
    d2: "Sebbene molte delle nostre soluzioni siano particolarmente utili per i professionisti della tecnologia, offriamo anche risorse rivolte al grande pubblico, fornendo alternative semplici e veloci per le attività quotidiane.",
    d3: "Oltre agli strumenti online, offriamo app di utilità sul Google Play Store, espandendo le possibilità di utilizzo e permettendo di svolgere queste attività direttamente dallo smartphone in modo pratico e accessibile.",
    d4: "Valorizziamo l'efficienza e l'accessibilità, perciò cerchiamo di fornire risorse che eliminino la necessità di installare software complessi, consentendo di eseguire le attività in modo rapido, sicuro e intuitivo.",
    d5: "FreeTool.dev è uno spazio collaborativo in costante evoluzione, pensato per supportare sia i professionisti esperti che coloro che muovono i primi passi nel mondo della tecnologia, o semplicemente chi cerca soluzioni pratiche per la vita di tutti i giorni.",
    logo_alt: "Logo FreeTool.dev"
  },
  id: {
    title: "Tentang Kami",
    seo_desc: "FreeTool.dev menawarkan berbagai alat online gratis untuk mempermudah pekerjaan harian pengembang, desainer, pelajar dan mahasiswa, serta profesional teknologi.",
    meta: "FreeTool.dev adalah platform yang menawarkan berbagai alat online gratis, dirancang untuk mempermudah keseharian pengembang, penguji perangkat lunak, desainer, pembuat konten, pelajar dan mahasiswa, serta profesional teknologi dan kreasi digital lainnya.",
    d1: "Tujuan kami adalah menyederhanakan tugas-tugas umum dan berulang, dengan memberikan solusi praktis melalui alat yang dikelompokkan ke dalam berbagai kategori.",
    d2: "Walaupun banyak solusi kami sangat berguna bagi profesional teknologi, kami juga menyediakan sumber daya yang ditujukan untuk masyarakat umum, memberikan alternatif yang sederhana dan cepat untuk aktivitas sehari-hari.",
    d3: "Selain alat online, kami menawarkan aplikasi utilitas di Google Play Store, memperluas kemungkinan penggunaan dan memungkinkan tugas-tugas ini dilakukan langsung melalui smartphone dengan praktis dan mudah diakses.",
    d4: "Kami menghargai efisiensi dan aksesibilitas, jadi kami berusaha menyediakan sumber daya yang menghilangkan kebutuhan untuk menginstal perangkat lunak kompleks, sehingga tugas dapat diselesaikan dengan cepat, aman, dan intuitif.",
    d5: "FreeTool.dev adalah ruang kolaboratif yang terus berkembang, dirancang untuk mendukung profesional berpengalaman hingga mereka yang baru mengambil langkah pertama di dunia teknologi, atau siapa saja yang mencari solusi praktis untuk kehidupan sehari-hari.",
    logo_alt: "Logo FreeTool.dev"
  },
  de: {
    title: "Über uns",
    seo_desc: "FreeTool.dev bietet verschiedene kostenlose Online-Tools, um den Arbeitsalltag von Entwicklern, Designern, Studenten und Technologieexperten zu erleichtern.",
    meta: "FreeTool.dev ist eine Plattform, die eine große Auswahl an völlig kostenlosen Online-Tools bietet, um den Alltag von Entwicklern, Softwaretestern, Designern, Content-Creatoren, Studenten und anderen Fachleuten in den Bereichen Technologie und digitalem Schaffen zu erleichtern.",
    d1: "Unser Ziel ist es, häufige und wiederkehrende Aufgaben zu vereinfachen, indem wir praktische Lösungen über Tools anbieten, die in verschiedene Kategorien unterteilt sind.",
    d2: "Obwohl viele unserer Lösungen besonders für Technologiefachleute nützlich sind, bieten wir auch Ressourcen für die breite Öffentlichkeit und stellen einfache und schnelle Alternativen für alltägliche Aktivitäten bereit.",
    d3: "Neben den Online-Tools bieten wir auch Utility-Apps im Google Play Store an, was die Nutzungsmöglichkeiten erweitert und es ermöglicht, diese Aufgaben direkt vom Smartphone aus praktisch und zugänglich auszuführen.",
    d4: "Wir legen Wert auf Effizienz und Zugänglichkeit und bemühen uns daher, Ressourcen bereitzustellen, die die Installation komplexer Software überflüssig machen, sodass Aufgaben schnell, sicher und intuitiv erledigt werden können.",
    d5: "FreeTool.dev ist ein kollaborativer und sich ständig weiterentwickelnder Raum, der erfahrene Fachleute ebenso unterstützen soll wie diejenigen, die ihre ersten Schritte in der Technologiewelt machen oder einfach alle, die praktische Lösungen für den Alltag suchen.",
    logo_alt: "FreeTool.dev-Logo"
  },
  nl: {
    title: "Over ons",
    seo_desc: "FreeTool.dev biedt diverse gratis online tools om de dagelijkse workflow van ontwikkelaars, ontwerpers, studenten en technologieprofessionals te vereenvoudigen.",
    meta: "FreeTool.dev is een platform dat een brede variëteit aan volledig gratis online tools biedt, ontworpen om het dagelijks leven van ontwikkelaars, softwaretesters, ontwerpers, contentcreators, studenten en andere professionals in technologie en digitale creatie te vergemakkelijken.",
    d1: "Ons doel is om veelvoorkomende en terugkerende taken te vereenvoudigen door praktische oplossingen te bieden via tools die in verschillende categorieën zijn ingedeeld.",
    d2: "Hoewel veel van onze oplossingen bijzonder nuttig zijn voor technologieprofessionals, bieden we ook middelen voor het grote publiek, waarmee we eenvoudige en snelle alternatieven bieden voor dagelijkse activiteiten.",
    d3: "Naast online tools bieden we handige apps aan in de Google Play Store, wat de gebruiksmogelijkheden uitbreidt en het mogelijk maakt om deze taken direct vanaf de smartphone op een praktische en toegankelijke manier uit te voeren.",
    d4: "We hechten waarde aan efficiëntie en toegankelijkheid, dus we streven ernaar om middelen aan te bieden die de noodzaak om complexe software te installeren wegnemen, zodat taken snel, veilig en intuïtief kunnen worden uitgevoerd.",
    d5: "FreeTool.dev is een collaboratieve, voortdurend evoluerende ruimte, ontworpen om zowel ervaren professionals als degenen die hun eerste stappen in de technologiewereld zetten, te ondersteunen — of gewoon iedereen die op zoek is naar praktische oplossingen voor het dagelijks leven.",
    logo_alt: "FreeTool.dev-logo"
  }
}
</i18n>
