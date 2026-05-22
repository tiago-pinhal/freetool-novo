<script setup lang="ts">
import { ref } from 'vue'

defineI18nRoute(false)

const activeTab = ref('en')

const tabsList = [
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
  { id: 'es', label: 'Español' },
  { id: 'fr', label: 'Français' },
  { id: 'it', label: 'Italiano' }
]

useHead({
  title: 'Privacy Policy for Sudoku | Freetool.Dev',
  meta: [{ name: 'description', content: 'Privacy Policy for the Sudoku mobile application.' }]
})

usePageJsonLd({
  type: 'page',
  name: 'Privacy Policy for Sudoku | Freetool.Dev',
})
</script>

<template>
  <div class="container mx-auto px-4 py-24 min-h-[60vh]">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      <p class="text-sm opacity-50 mb-8">Sudoku Mobile Game</p>

      <ToolTabs v-model:activeTab="activeTab" :tabs="tabsList">
        <template #en>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introduction</h2>
              <p>This Privacy Policy aims to inform how the Sudoku app ("the App") collects, uses, and protects user data. We also recommend that you review our <a href="https://www.freetool.dev/terms-of-use" class="link">"Terms of Use"</a> to understand the rules governing the use of our applications.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">App Usage</h2>
              <p>The app is designed to function offline and does not require user registration. Therefore, we do not collect or store personal information directly from users.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Information Collection</h2>
              <p>To monetize the app, we use AdMob, a Google advertising tool. This service may collect non-personally identifiable information, such as:</p>
              <ul class="list-disc list-inside mt-2 space-y-1 opacity-90">
                <li>Device identifiers (e.g., advertising ID);</li>
                <li>Technical information about the device and operating system;</li>
                <li>Usage data, such as interactions, impressions, and ad clicks.</li>
              </ul>
              <p class="mt-2">The data collected by AdMob is used to personalize ads and enhance the user experience, in accordance with Google's policies and guidelines. For more details, we recommend reviewing the <a href="https://policies.google.com/privacy" class="link" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Control and Access to Information</h2>
              <p>Although we do not collect personal data directly, you can manage the information collected by Google by adjusting your privacy settings and ad preferences on your device. Check Google's ad management options for more information on how to control this data.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Advertising and Redirection</h2>
              <p>The app displays ads provided by AdMob, which may contain links to third-party websites or services. By interacting with an ad, you may be redirected to external pages. We have no control over the content or privacy practices of these sites and recommend that you review their privacy policies before providing any information.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Changes to This Privacy Policy</h2>
              <p>This policy may be updated periodically. We recommend reviewing it frequently to stay informed about any changes.</p>
            </section>
          </div>
        </template>

        <template #pt>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introdução</h2>
              <p>Esta Política de Privacidade tem como objetivo informar como o aplicativo Sudoku ("o App") coleta, utiliza e protege os dados dos usuários. Recomendamos que você também consulte os <a href="https://www.freetool.dev/terms-of-use" class="link">"Termos de Uso"</a> para compreender as regras que regem a utilização dos nossos aplicativos.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Uso do Aplicativo</h2>
              <p>O aplicativo foi desenvolvido para funcionar offline e não exige cadastro. Dessa forma, não coletamos nem armazenamos informações pessoais diretamente dos usuários.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Coleta de Informações</h2>
              <p>Para a monetização do aplicativo, utilizamos o AdMob, uma ferramenta de publicidade do Google. Esse serviço pode coletar informações não pessoalmente identificáveis, tais como:</p>
              <ul class="list-disc list-inside mt-2 space-y-1 opacity-90">
                <li>Identificadores de dispositivo (por exemplo, ID de publicidade);</li>
                <li>Informações técnicas do dispositivo e sistema operacional;</li>
                <li>Dados de utilização, como interações, impressões e cliques nos anúncios.</li>
              </ul>
              <p class="mt-2">Os dados coletados pelo AdMob são utilizados para personalizar os anúncios e melhorar a experiência do usuário, conforme as práticas e diretrizes estabelecidas pelo Google. Para mais detalhes, recomendamos que consulte a <a href="https://policies.google.com/privacy" class="link" target="_blank" rel="noopener noreferrer">Política de Privacidade do Google</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Controle e Acesso às Informações</h2>
              <p>Embora não coletemos dados pessoais diretamente, você pode gerenciar as informações coletadas pelo Google ajustando as configurações de privacidade e preferências de anúncios no seu dispositivo. Consulte as opções de gerenciamento de anúncios fornecidas pelo Google para obter mais informações sobre como controlar esses dados.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Publicidade e Redirecionamento</h2>
              <p>O aplicativo exibe anúncios fornecidos pelo AdMob, que podem conter links para sites ou serviços de terceiros. Ao interagir com um anúncio, você pode ser redirecionado para páginas externas. Não temos controle sobre o conteúdo ou as práticas de privacidade desses sites e recomendamos que você revise suas políticas de privacidade antes de fornecer qualquer informação.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Alterações nesta Política de Privacidade</h2>
              <p>Esta política poderá ser atualizada periodicamente. Recomendamos que a revise com frequência para se manter informado sobre eventuais mudanças.</p>
            </section>
          </div>
        </template>

        <template #es>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introducción</h2>
              <p>Esta Política de Privacidad tiene como objetivo informar cómo la aplicación Sudoku ("la App") recopila, utiliza y protege los datos de los usuarios. También recomendamos que revise nuestros <a href="https://www.freetool.dev/terms-of-use" class="link">"Términos de Uso"</a> para comprender las reglas que rigen el uso de nuestras aplicaciones.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Uso de la Aplicación</h2>
              <p>La aplicación está diseñada para funcionar sin conexión y no requiere registro de usuario. Por lo tanto, no recopilamos ni almacenamos información personal directamente de los usuarios.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Recopilación de Información</h2>
              <p>Para monetizar la aplicación, utilizamos AdMob, una herramienta de publicidad de Google. Este servicio puede recopilar información no identificable personalmente, como:</p>
              <ul class="list-disc list-inside mt-2 space-y-1 opacity-90">
                <li>Identificadores de dispositivo (por ejemplo, ID de publicidad);</li>
                <li>Información técnica sobre el dispositivo y el sistema operativo;</li>
                <li>Datos de uso, como interacciones, impresiones y clics en anuncios.</li>
              </ul>
              <p class="mt-2">Los datos recopilados por AdMob se utilizan para personalizar los anuncios y mejorar la experiencia del usuario, de acuerdo con las políticas y directrices de Google. Para más detalles, recomendamos revisar la <a href="https://policies.google.com/privacy" class="link" target="_blank" rel="noopener noreferrer">Política de Privacidad de Google</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Control y Acceso a la Información</h2>
              <p>Aunque no recopilamos datos personales directamente, puedes gestionar la información recopilada por Google ajustando la configuración de privacidad y preferencias de anuncios en tu dispositivo. Consulta las opciones de gestión de anuncios proporcionadas por Google para obtener más información sobre cómo controlar estos datos.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Publicidad y Redirección</h2>
              <p>La aplicación muestra anuncios proporcionados por AdMob, que pueden contener enlaces a sitios web o servicios de terceros. Al interactuar con un anuncio, puedes ser redirigido a páginas externas. No tenemos control sobre el contenido ni las prácticas de privacidad de estos sitios y recomendamos que revise sus políticas de privacidad antes de proporcionar cualquier información.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Cambios en esta Política de Privacidad</h2>
              <p>Esta política puede actualizarse periódicamente. Recomendamos revisarla con frecuencia para estar informado sobre cualquier cambio.</p>
            </section>
          </div>
        </template>

        <template #fr>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introduction</h2>
              <p>Cette Politique de Confidentialité vise à informer comment l'application Sudoku ("l'App") collecte, utilise et protège les données des utilisateurs. Nous vous recommandons également de consulter nos <a href="https://www.freetool.dev/terms-of-use" class="link">"Conditions d'utilisation"</a> pour comprendre les règles qui régissent l'utilisation de nos applications.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Utilisation de l'Application</h2>
              <p>L'application est conçue pour fonctionner hors ligne et ne nécessite aucune inscription. Par conséquent, nous ne collectons ni ne stockons directement d'informations personnelles des utilisateurs.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Collecte d'Informations</h2>
              <p>Pour monétiser l'application, nous utilisons AdMob, un outil publicitaire de Google. Ce service peut collecter des informations non personnellement identifiables, telles que :</p>
              <ul class="list-disc list-inside mt-2 space-y-1 opacity-90">
                <li>Identifiants d'appareil (par exemple, ID de publicité) ;</li>
                <li>Informations techniques sur l'appareil et le système d'exploitation ;</li>
                <li>Données d'utilisation, telles que les interactions, les impressions et les clics sur les annonces.</li>
              </ul>
              <p class="mt-2">Les données collectées par AdMob sont utilisées pour personnaliser les annonces et améliorer l'expérience utilisateur, conformément aux politiques et directives établies par Google. Pour plus de détails, nous vous recommandons de consulter la <a href="https://policies.google.com/privacy" class="link" target="_blank" rel="noopener noreferrer">Politique de Confidentialité de Google</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Contrôle et Accès aux Informations</h2>
              <p>Bien que nous ne collectons pas directement de données personnelles, vous pouvez gérer les informations collectées par Google en ajustant les paramètres de confidentialité et les préférences publicitaires sur votre appareil. Consultez les options de gestion des annonces fournies par Google pour obtenir plus d'informations sur le contrôle de ces données.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Publicité et Redirection</h2>
              <p>L'application affiche des annonces fournies par AdMob, qui peuvent contenir des liens vers des sites Web ou services tiers. En interagissant avec une annonce, vous pouvez être redirigé vers des pages externes. Nous n'avons aucun contrôle sur le contenu ou les pratiques de confidentialité de ces sites et nous vous recommandons de consulter leurs politiques de confidentialité avant de fournir toute information.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Modifications de cette Politique de Confidentialité</h2>
              <p>Cette politique peut être mise à jour périodiquement. Nous vous recommandons de la consulter régulièrement pour rester informé des éventuels changements.</p>
            </section>
          </div>
        </template>

        <template #it>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introduzione</h2>
              <p>Questa Informativa sulla Privacy ha lo scopo di informare su come l'applicazione Sudoku ("l'App") raccoglie, utilizza e protegge i dati degli utenti. Ti consigliamo inoltre di consultare i nostri <a href="https://www.freetool.dev/terms-of-use" class="link">"Termini di utilizzo"</a> per comprendere le regole che regolano l'uso delle nostre applicazioni.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Utilizzo dell'Applicazione</h2>
              <p>L'applicazione è progettata per funzionare offline e non richiede registrazione. Pertanto, non raccogliamo né memorizziamo direttamente informazioni personali degli utenti.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Raccolta di Informazioni</h2>
              <p>Per monetizzare l'applicazione, utilizziamo AdMob, uno strumento pubblicitario di Google. Questo servizio può raccogliere informazioni non identificabili personalmente, come:</p>
              <ul class="list-disc list-inside mt-2 space-y-1 opacity-90">
                <li>Identificatori del dispositivo (ad esempio, ID pubblicitario);</li>
                <li>Informazioni tecniche sul dispositivo e sul sistema operativo;</li>
                <li>Dati di utilizzo, come interazioni, impressioni e clic sugli annunci.</li>
              </ul>
              <p class="mt-2">I dati raccolti da AdMob vengono utilizzati per personalizzare gli annunci e migliorare l'esperienza dell'utente, in conformità con le politiche e le linee guida stabilite da Google. Per maggiori dettagli, ti consigliamo di consultare la <a href="https://policies.google.com/privacy" class="link" target="_blank" rel="noopener noreferrer">Informativa sulla Privacy di Google</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Controllo e Accesso alle Informazioni</h2>
              <p>Sebbene non raccogliamo direttamente dati personali, puoi gestire le informazioni raccolte da Google regolando le impostazioni sulla privacy e le preferenze degli annunci sul tuo dispositivo. Consulta le opzioni di gestione degli annunci fornite da Google per ottenere maggiori informazioni su come controllare questi dati.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Pubblicità e Reindirizzamento</h2>
              <p>L'applicazione mostra annunci forniti da AdMob, che possono contenere link a siti web o servizi di terze parti. Interagendo con un annuncio, potresti essere reindirizzato a pagine esterne. Non abbiamo alcun controllo sul contenuto o sulle pratiche di privacy di questi siti e ti consigliamo di consultare le loro politiche sulla privacy prima di fornire qualsiasi informazione.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Modifiche a questa Informativa sulla Privacy</h2>
              <p>Questa informativa può essere aggiornata periodicamente. Ti consigliamo di consultarla regolarmente per rimanere informato su eventuali modifiche.</p>
            </section>
          </div>
        </template>
      </ToolTabs>
    </div>
  </div>
</template>