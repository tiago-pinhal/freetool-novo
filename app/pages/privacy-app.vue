<script setup lang="ts">
import { ref } from 'vue'

defineI18nRoute(false)

const activeTab = ref('en')

const tabsList = [
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
  { id: 'es', label: 'Español' }
]

useHead({
  title: 'Privacy Policy for Mobile Applications | Freetool.Dev',
  meta: [{ name: 'description', content: 'Privacy Policy for our suite of mobile applications.' }]
})

usePageJsonLd({
  type: 'page',
  name: 'Privacy Policy for Mobile Applications | Freetool.Dev',
})
</script>

<template>
  <div class="container mx-auto px-4 py-24 min-h-[60vh]">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      <p class="text-sm opacity-50 mb-8">Mobile Applications</p>

      <ToolTabs v-model:activeTab="activeTab" :tabs="tabsList">
        <template #en>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introduction</h2>
              <p>This Privacy Policy applies to the users of our applications and describes the practices related to the collection and use of information. We recommend that you also read our <a href="https://www.freetool.dev/terms-of-use" class="link">"Terms of Use"</a> to understand the rules governing the use of our applications.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">About Information Collection</h2>
              <p>Our applications do not collect or store any personal information from users. We use Google for advertising purposes, which helps us maintain our services. This usage may result in the collection of non-personally identifiable information. The information collected by Google is used in accordance with their <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank" class="link">"privacy policies"</a>, which we recommend reading to better understand the information collection practices of this service.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Control of Information Collection</h2>
              <p>You have the right to access and control the information that is collected by Google. To learn more about how to manage your ad preferences and privacy, <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank" class="link">visit the relevant page provided by Google</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Third-Party Links</h2>
              <p>Our applications may contain links to third-party websites or services. We are not responsible for the privacy practices of such sites. We suggest that you review the privacy policies of these linked sites before taking any action or providing personal information, as their information collection and usage practices may differ from ours.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Changes to the Privacy Policy</h2>
              <p>We recommend that you review our Privacy Policy from time to time, as it may be updated. The updated version will always be available in our applications.</p>
            </section>
          </div>
        </template>

        <template #pt>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introdução</h2>
              <p>Esta Política de Privacidade aplica-se aos usuários de nossos aplicativos e descreve as práticas relacionadas à coleta e uso de informações. Recomendamos que você também leia nossos <a href="https://www.freetool.dev/terms-of-use" class="link">"Termos de Uso"</a> para entender as regras que regem o uso de nossos aplicativos.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Sobre a Coleta de Informações</h2>
              <p>Nossos aplicativos não coletam ou armazenam nenhuma informação pessoal dos usuários. Utilizamos o Google para fins de publicidade, o que nos ajuda a manter nossos serviços. Essa utilização pode resultar na coleta de informações não pessoalmente identificáveis. As informações coletadas pelo Google são usadas de acordo com suas <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank" class="link">"políticas de privacidade"</a>, que recomendamos a leitura para entender melhor as práticas de coleta de informações deste serviço.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Controle de Coleta de Informações</h2>
              <p>Você tem o direito de acessar e controlar as informações que são coletadas pelo Google. Para saber mais sobre como gerenciar suas preferências de anúncios e privacidade, <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank" class="link">visite a página relevante fornecida pelo Google</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Links de Terceiros</h2>
              <p>Nossos aplicativos podem conter links para sites ou serviços de terceiros. Não somos responsáveis pelas práticas de privacidade de tais sites. Sugerimos que revise as políticas de privacidade desses sites vinculados antes de tomar qualquer ação ou fornecer informações pessoais, pois suas práticas de coleta e uso de informações podem ser diferentes das nossas.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Mudanças na Política de Privacidade</h2>
              <p>Recomendamos que você revise nossa Política de Privacidade de tempos em tempos, pois ela pode ser atualizada. A versão atualizada estará sempre disponível em nossos aplicativos.</p>
            </section>
          </div>
        </template>

        <template #es>
          <div class="space-y-8 opacity-85 leading-relaxed">
            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Introducción</h2>
              <p>Esta Política de Privacidad se aplica a los usuarios de nuestras aplicaciones y describe las prácticas relacionadas con la recopilación y uso de información. Recomendamos que también lea nuestros <a href="https://www.freetool.dev/terms-of-use" class="link">"Términos de Uso"</a> para entender las reglas que rigen el uso de nuestras aplicaciones.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Sobre la Recopilación de Información</h2>
              <p>Nuestras aplicaciones no recopilan ni almacenan ninguna información personal de los usuarios. Utilizamos Google para fines publicitarios, lo que nos ayuda a mantener nuestros servicios. Este uso puede resultar en la recopilación de información no identificable personalmente. La información recopilada por Google se utiliza de acuerdo con sus <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank" class="link">"políticas de privacidad"</a>, que recomendamos leer para entender mejor las prácticas de recopilación de información de este servicio.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Control de la Recopilación de Información</h2>
              <p>Usted tiene el derecho de acceder y controlar la información que es recopilada por Google. Para obtener más información sobre cómo gestionar sus preferencias de anuncios y privacidad, <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank" class="link">visite la página relevante proporcionada por Google</a>.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Enlaces de Terceros</h2>
              <p>Nuestras aplicaciones pueden contener enlaces a sitios web o servicios de terceros. No somos responsables de las prácticas de privacidad de dichos sitios. Sugerimos que revise las políticas de privacidad de estos sitios vinculados antes de tomar cualquier acción o proporcionar información personal, ya que sus prácticas de recopilación y uso de información pueden ser diferentes a las nuestras.</p>
            </section>

            <section>
              <h2 class="text-lg font-bold mb-2 text-orange-300">Cambios en la Política de Privacidad</h2>
              <p>Recomendamos que revise nuestra Política de Privacidad de vez en cuando, ya que puede ser actualizada. La versión actualizada siempre estará disponible en nuestras aplicaciones.</p>
            </section>
          </div>
        </template>
      </ToolTabs>
    </div>
  </div>
</template>