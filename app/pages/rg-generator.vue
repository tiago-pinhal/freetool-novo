<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const state = reactive({
  rg: '',
  justNum: false,
  ads: false
})

function generate() {
  const num = String(Math.floor(Math.random() * 89999999 + 10000000))
  const dig = calcDigit(num)
  const rg = num + dig
  state.rg = state.justNum ? rg : format(rg)
  if (!state.ads) state.ads = true
}

function calcDigit(rg: string): string {
  let idx = 1
  let sum = 0

  for (let num of rg) {
    sum += Number(num) * ++idx
  }

  let dig = 11 - (sum % 11)
  return dig === 10 ? 'X' : dig > 10 ? '0' : dig.toString()
}

function format(rg: string): string {
  const num = rg.toUpperCase().replace(/[^\dX]/g, '')
  return num.length <= 9
    ? num.replace(/^(\d{1,2})(\d{3})(\d{3})([\dX])$/, '$1.$2.$3-$4')
    : rg
}

watch(() => state.justNum, () => {
  if (state.rg) {
    const chars = state.rg.toUpperCase().replace(/[^\dX]/g, '')
    state.rg = state.justNum ? chars : format(chars)
  }
})

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
  ]
})

useHead({
  title: `${t('title')} - ${t('br')}`,
  meta: [{ name: 'description', content: t('meta') }]
})

defineI18nRoute({
  paths: {
    pt: '/gerador-de-rg',
    es: '/generador-de-rg',
    fr: '/generateur-de-rg',
    it: '/generatore-di-rg',
    id: '/generator-rg'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    wiki-url="https://pt.wikipedia.org/wiki/C%C3%A9dula_de_identidade"
    wiki-label="RG (Registro Geral / Carteira de Identidade)"
    :see-also-links="[
      { label: t('see1') + ' 🇧🇷', to: 'cpf-generator' },
      { label: t('see2') + ' 🇧🇷', to: 'cnpj-generator' },
      { label: t('see3'), to: 'credit-card-generator' },
      { label: t('see4'), to: 'birthday-generator' }
    ]"
  >
    <div class="grid lg:grid-cols-2 gap-8 mb-4">
      <!-- Left Column: Controls -->
      <div class="space-y-5">
        <div class="flex flex-col gap-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="state.justNum" class="toggle toggle-primary" />
            <span class="font-medium">{{ t('num') }}</span>
          </label>
        </div>

        <ButtonPrimary
          @click="generate"
          icon="heroicons:identification-20-solid"
          class="w-full h-14 text-lg mt-4"
        >
          {{ t('bt') }}
        </ButtonPrimary>
        <p class="text-sm text-base-content/50 italic px-1 text-center">{{ t('warning') }}</p>
      </div>

      <!-- Right Column: Result -->
      <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[10rem] flex flex-col justify-center">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div v-if="state.rg" class="space-y-2 w-full">
            <LineCopy
              :content="state.rg"
              :label="t('rg_label')"
              class="!my-0 [&>div:last-child]:!w-full"
            />
          </div>
        </Transition>

        <!-- Placeholder -->
        <div v-if="!state.rg" class="text-center opacity-70">
          <Icon name="heroicons:identification" class="w-16 h-16 mx-auto mb-2" />
          <p class="font-medium italic">{{ t('placeholder') }}</p>
        </div>
      </div>
    </div>

    <Mordizi v-if="state.ads" />

    <template #info>
      <div class="space-y-8">
        <section class="space-y-4">
          <p>{{ t('d1') }}.</p>
          <p>{{ t('d2') }}.</p>
          <p>{{ t('d3') }}.</p>
          <p>{{ t('d4') }}.</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:play-circle-20-solid" class="w-6 h-6 text-primary" />
            {{ t('how_to_use_title') }}
          </h2>
          <div class="grid sm:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="flex flex-col gap-2 bg-base-200/40 p-4 rounded-xl border border-primary/20">
              <span class="text-3xl font-black text-primary/30 leading-none">{{ i }}</span>
              <span class="font-bold text-base-content">{{ t(`step_${i}_title`) }}</span>
              <span class="text-sm text-base-content/70">{{ t(`step_${i}_desc`) }}</span>
            </div>
          </div>
        </section>
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "Valid RG Generator Online for Testing — Free",
    title: "Brazilian RG Generator", 
    meta: "Random RG number generator for software testing and demonstrations. Create fictitious numbers in the standard format, safe and without real data.",
    d1: "The Registro Geral (RG) is the main civil identification document in Brazil, used to prove a person's identity in various everyday situations such as opening bank accounts, school enrollments, contracts, and other legal transactions",
    d2: "Our Random RG Number Generator was developed to facilitate the creation of fictitious RG numbers, ideal for software testing, system demonstrations, and development environments. This tool is especially recommended for developers, software testers, and technology professionals who need to validate processes without using real personal data",
    d3: "The tool generates random RG numbers that have no connection to real identification data, ensuring privacy and security during testing. The numbers follow the Brazilian standard RG format, for example, “99.999.999-9”. For greater flexibility, it is possible to select the “Numbers Only” option, which generates the RG without dots or dashes, making it easier to input into databases or systems that require a pure numeric format",
    d4: "It is important to emphasize that RG forgery is a crime punishable by law, and misuse of the information generated by this tool can result in serious legal consequences. Therefore, the use of the generator is strictly exclusive for educational purposes, software testing, and legitimate demonstrations, with the user assuming full responsibility for the correct use of the generated data",
    num: "Numbers Only",
    bt: "Generate RG",
    placeholder: "Click Generate RG to create a number",
    rg_label: "Generated RG",
    warning: "The generated numbers are fictitious and intended exclusively for testing purposes.",
    br: "Brazil",
    how_to_use_title: "How to use",
    step_1_title: "Generate an RG",
    step_1_desc: "Choose the desired format and click \"Generate RG\". The generated number can be copied to your clipboard with one click.",
    step_2_title: "With or without punctuation",
    step_2_desc: "Enable \"Numbers Only\" to get the RG without dots and dash — ideal for integrations and databases.",
    step_3_title: "Copy Result",
    step_3_desc: "The generated RG will appear instantly. Use the copy button to send it to your clipboard.",
    see1: "CPF Generator",
    see2: "CNPJ Generator",
    see3: "Credit Card Generator",
    see4: "Birthday Generator"
  },
  pt: {
    pageTitle: "Gerador de RG Válido Online para Testes — Grátis",
    title: "Gerador de RG", 
    meta: "Gerador de números de RG aleatórios para testes de software e demonstrações. Crie números fictícios no formato padrão, seguros e sem dados reais.",
    d1: "O Registro Geral (RG) é o principal documento de identificação civil no Brasil, utilizado para comprovar a identidade de uma pessoa em diversas situações do dia a dia, como abertura de contas bancárias, matrículas escolares, contratos e outras operações legais",
    d2: "Nosso Gerador de Números de RG Aleatórios foi desenvolvido para facilitar a criação de números fictícios de RG, ideais para testes de software, demonstrações de sistemas e ambientes de desenvolvimento. Essa ferramenta é especialmente indicada para desenvolvedores, testadores de software e profissionais da área de tecnologia que precisam validar processos sem utilizar dados pessoais reais",
    d3: "A ferramenta gera números de RG aleatórios que não possuem qualquer ligação com dados reais de identificação, garantindo a privacidade e a segurança durante os testes. Os números seguem o formato padrão brasileiro de RG, por exemplo, “99.999.999-9”. Para maior flexibilidade, é possível escolher a opção “Somente Números”, que gera o RG sem pontos ou traços, facilitando a inserção em bancos de dados ou sistemas que exigem formato numérico puro",
    d4: "É importante destacar que a falsificação de RG é um crime previsto em lei, e o uso indevido das informações geradas por esta ferramenta pode acarretar sérias consequências legais. Portanto, o uso do gerador é estritamente exclusivo para fins educacionais, testes de software e demonstrações legítimas, ficando a cargo do usuário a responsabilidade pelo uso correto dos dados gerados",
    num: "Somente Números",
    bt: "Gerar RG",
    placeholder: "Clique em Gerar RG para gerar um número",
    rg_label: "RG Gerado",
    warning: "Os números gerados são fictícios e destinados exclusivamente a testes.",
    br: "Brasil",
    how_to_use_title: "Como usar",
    step_1_title: "Gerar um RG",
    step_1_desc: "Escolha o formato desejado e clique em \"Gerar RG\". O número gerado pode ser copiado com um clique na área de transferência.",
    step_2_title: "Com ou sem pontuação",
    step_2_desc: "Ative \"Somente Números\" para obter o RG sem pontos e traço — ideal para integrações e bancos de dados.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "O RG gerado aparecerá instantaneamente. Use o botão de copiar para enviá-lo para a área de transferência.",
    see1: "Gerador de CPF",
    see2: "Gerador de CNPJ",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  },
  es: {
    pageTitle: "Generador de RG Válido Online para Pruebas — Gratis",
    title: "Generador de RG Brasileño", 
    meta: "Generador de números de RG aleatorios para pruebas de software y demostraciones. Cree números ficticios en el formato estándar, seguros y sin datos reales.",
    d1: "El Registro General (RG) es el principal documento de identificación civil en Brasil, utilizado para comprobar la identidad de una persona en diversas situaciones cotidianas como apertura de cuentas bancarias, matrículas escolares, contratos y otras operaciones legales",
    d2: "Nuestro Generador de Números de RG Aleatorios fue desarrollado para facilitar la creación de números ficticios de RG, ideales para pruebas de software, demostraciones de sistemas y entornos de desarrollo. Esta herramienta está especialmente recomendada para desarrolladores, testers de software y profesionales del área tecnológica que necesitan validar procesos sin usar datos personales reales",
    d3: "La herramienta genera números de RG aleatorios que no tienen ninguna relación con datos reales de identificación, garantizando la privacidad y seguridad durante las pruebas. Los números siguen el formato estándar brasileño de RG, por ejemplo, “99.999.999-9”. Para mayor flexibilidad, es posible seleccionar la opción “Solo Números”, que genera el RG sin puntos ni guiones, facilitando su inserción en bases de datos o sistemas que requieren formato numérico puro",
    d4: "Es importante destacar que la falsificación de RG es un delito previsto por la ley, y el uso indebido de la información generada por esta herramienta puede acarrear graves consecuencias legales. Por lo tanto, el uso del generador es estrictamente exclusivo para fines educativos, pruebas de software y demostraciones legítimas, quedando a cargo del usuario la responsabilidad del uso correcto de los datos generados",
    num: "Solo Números",
    bt: "Generar RG",
    placeholder: "Haz clic en Generar RG para crear un número",
    rg_label: "RG Generado",
    warning: "Los números generados son ficticios y están destinados exclusivamente a pruebas.",
    br: "Brasil",
    how_to_use_title: "Cómo usar",
    step_1_title: "Generar un RG",
    step_1_desc: "Elige el formato deseado y haz clic en \"Generar RG\". El número generado puede copiarse al portapapeles con un solo clic.",
    step_2_title: "Con o sin puntuación",
    step_2_desc: "Activa \"Solo Números\" para obtener el RG sin puntos ni guión — ideal para integraciones y bases de datos.",
    step_3_title: "Copiar Resultado",
    step_3_desc: "El RG generado aparecerá al instante. Usa el botón de copiar para enviarlo a tu portapapeles.",
    see1: "Generador de CPF",
    see2: "Generador de CNPJ",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Generador de Fecha de Nacimiento"
  },
  fr: {
    pageTitle: "Générateur de RG Valide en Ligne pour Tests — Gratuit",
    title: "Générateur de RG Brésilien", 
    meta: "Générateur de numéros RG aléatoires pour tests logiciels et démonstrations. Créez des numéros fictifs au format standard, sécurisés et sans données réelles.",
    d1: "Le Registre Général (RG) est le principal document d'identification civile au Brésil, utilisé pour prouver l'identité d'une personne dans diverses situations quotidiennes telles que l'ouverture de comptes bancaires, les inscriptions scolaires, les contrats et autres opérations légales",
    d2: "Notre générateur de numéros RG aléatoires a été développé pour faciliter la création de numéros RG fictifs, idéaux pour les tests logiciels, les démonstrations de systèmes et les environnements de développement. Cet outil est particulièrement recommandé pour les développeurs, testeurs de logiciels et professionnels du secteur technologique qui ont besoin de valider des processus sans utiliser de données personnelles réelles",
    d3: "L'outil génère des numéros RG aléatoires qui n'ont aucun lien avec des données d'identification réelles, garantissant la confidentialité et la sécurité pendant les tests. Les numéros suivent le format standard brésilien du RG, par exemple, “99.999.999-9”. Pour plus de flexibilité, il est possible de sélectionner l'option “Chiffres Seuls”, qui génère le RG sans points ni traits d'union, facilitant ainsi l'insertion dans des bases de données ou des systèmes nécessitant un format numérique pur",
    d4: "Il est important de souligner que la falsification de RG est un crime puni par la loi, et l'utilisation abusive des informations générées par cet outil peut entraîner de graves conséquences juridiques. Par conséquent, l'utilisation du générateur est strictement exclusive à des fins éducatives, pour les tests logiciels et les démonstrations légitimes, la responsabilité de l'utilisation correcte des données générées incombant à l'utilisateur",
    num: "Chiffres Seuls",
    bt: "Générer RG",
    placeholder: "Cliquez sur Générer RG pour créer un numéro",
    rg_label: "RG Généré",
    warning: "Les numéros générés sont fictifs et destinés exclusivement à des fins de test.",
    br: "Brésil",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Générer un RG",
    step_1_desc: "Choisissez le format souhaité et cliquez sur \"Générer RG\". Le numéro généré peut être copié dans votre presse-papiers en un clic.",
    step_2_title: "Avec ou sans ponctuation",
    step_2_desc: "Activez \"Chiffres Seuls\" pour obtenir le RG sans points ni tiret — idéal pour les intégrations et bases de données.",
    step_3_title: "Copier le Résultat",
    step_3_desc: "Le RG généré apparaîtra instantanément. Utilisez le bouton de copie pour l'envoyer au presse-papiers.",
    see1: "Générateur de CPF",
    see2: "Générateur de CNPJ",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance"
  },
  it: {
    pageTitle: "Generatore di RG Valido Online per Test — Gratis",
    title: "Generatore di RG Brasiliano", 
    meta: "Generatore di numeri RG casuali per test software e dimostrazioni. Crea numeri fittizi nel formato standard, sicuri e senza dati reali.",
    d1: "Il Registro Generale (RG) è il principale documento di identificazione civile in Brasile, utilizzato per comprovare l'identità di una persona in diverse situazioni quotidiane come l'apertura di conti bancari, iscrizioni scolastiche, contratti e altre operazioni legali",
    d2: "Il nostro Generatore di Numeri RG Casuali è stato sviluppato per facilitare la creazione di numeri RG fittizi, ideali per test software, dimostrazioni di sistemi e ambienti di sviluppo. Questo strumento è particolarmente indicato per sviluppatori, tester software e professionisti del settore tecnologico che necessitano di convalidare processi senza utilizzare dati personali reali",
    d3: "Lo strumento genera numeri RG casuali che non hanno alcun collegamento con dati di identificazione reali, garantendo la privacy e la sicurezza durante i test. I numeri seguono il formato standard brasiliano del RG, ad esempio, “99.999.999-9”. Per una maggiore flessibilità, è possibile selezionare l'opzione “Solo Numeri”, che genera il RG senza punti o trattini, facilitando l'inserimento in database o sistemi che richiedono un formato numerico puro",
    d4: "È importante sottolineare che la falsificazione del RG è un reato punito dalla legge e l'uso improprio delle informazioni generate da questo strumento può comportare gravi conseguenze legali. Pertanto, l'uso del generatore è strettamente esclusivo a fini educativi, test software e dimostrazioni legittime, con l'utente che si assume la piena responsabilità per l'uso corretto dei dati generati",
    num: "Solo Numeri",
    bt: "Genera RG",
    placeholder: "Clicca su Genera RG per creare un numero",
    rg_label: "RG Generato",
    warning: "I numeri generati sono fittizi e destinati esclusivamente a scopi di test.",
    br: "Brasile",
    how_to_use_title: "Come usare",
    step_1_title: "Generare un RG",
    step_1_desc: "Scegli il formato desiderato e clicca su \"Genera RG\". Il numero generato può essere copiato negli appunti con un clic.",
    step_2_title: "Con o senza punteggiatura",
    step_2_desc: "Attiva \"Solo Numeri\" per ottenere il RG senza punti e trattino — ideale per integrazioni e database.",
    step_3_title: "Copia Risultato",
    step_3_desc: "Il RG generato apparirà all'istante. Usa il pulsante di copia per inviarlo agli appunti.",
    see1: "Generatore di CPF",
    see2: "Generatore di CNPJ",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita"
  },
  id: {
    pageTitle: "Generator RG Valid Online untuk Pengujian — Gratis",
    title: "Generator RG Brasil",
    meta: "Generator nomor RG acak untuk pengujian perangkat lunak dan demonstrasi. Buat nomor fiktif dalam format standar, aman dan tanpa data nyata.",
    d1: "Registro Geral (RG) adalah dokumen identifikasi sipil utama di Brasil, yang digunakan untuk membuktikan identitas seseorang dalam berbagai situasi sehari-hari seperti pembukaan rekening bank, pendaftaran sekolah, kontrak, dan transaksi hukum lainnya",
    d2: "Generator Nomor RG Acak kami dikembangkan untuk memudahkan pembuatan nomor RG fiktif, ideal untuk pengujian perangkat lunak, demonstrasi sistem, dan lingkungan pengembangan. Alat ini sangat direkomendasikan untuk pengembang, penguji perangkat lunak, dan profesional teknologi yang perlu memvalidasi proses tanpa menggunakan data pribadi nyata",
    d3: "Alat ini menghasilkan nomor RG acak yang tidak memiliki keterkaitan dengan data identifikasi nyata, memastikan privasi dan keamanan selama pengujian. Nomor mengikuti format RG standar Brasil, misalnya, \"99.999.999-9\". Untuk fleksibilitas lebih, kamu dapat memilih opsi \"Hanya Angka\", yang menghasilkan RG tanpa titik atau tanda hubung, memudahkan input ke dalam database atau sistem yang memerlukan format numerik murni",
    d4: "Penting untuk ditekankan bahwa pemalsuan RG adalah tindak pidana yang dapat dihukum oleh hukum, dan penyalahgunaan informasi yang dihasilkan oleh alat ini dapat mengakibatkan konsekuensi hukum yang serius. Oleh karena itu, penggunaan generator ini sangat eksklusif hanya untuk tujuan pendidikan, pengujian perangkat lunak, dan demonstrasi yang sah, dengan pengguna bertanggung jawab penuh atas penggunaan data yang dihasilkan dengan benar",
    num: "Hanya Angka",
    bt: "Buat RG",
    placeholder: "Klik Buat RG untuk membuat nomor",
    rg_label: "RG Dibuat",
    warning: "Nomor yang dihasilkan bersifat fiktif dan ditujukan semata-mata untuk keperluan pengujian.",
    br: "Brasil",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Buat satu RG",
    step_1_desc: "Pilih format yang diinginkan dan klik \"Buat RG\". Nomor yang dihasilkan dapat disalin ke papan klip dengan satu klik.",
    step_2_title: "Dengan atau tanpa tanda baca",
    step_2_desc: "Aktifkan \"Hanya Angka\" untuk mendapatkan RG tanpa titik dan tanda hubung — ideal untuk integrasi dan basis data.",
    step_3_title: "Salin Hasil",
    step_3_desc: "RG yang dihasilkan akan langsung muncul. Gunakan tombol salin untuk mengirimnya ke papan klip.",
    see1: "Generator CPF",
    see2: "Generator CNPJ",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir"
  }
}
</i18n>
