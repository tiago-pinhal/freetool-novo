<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [
    t('f_1'),
    t('f_2'),
    t('f_3'),
    t('f_4')
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') }
  ]
})

useHead({
  title: t('title'),
  meta: [
    { name: "description", content: t('meta') }
  ]
})

// Tool State
const state = reactive({ 
  text: '', 
  output: null as string | null, 
  sep: ',', 
  loading: false 
})

const sepOptions = [
  { label: t('comma'), value: ',' },
  { label: t('line'), value: '||' },
  { label: t('colon'), value: ';' },
  { label: t('pipe'), value: '|' }
]

function extract() {
  if (state.text !== "") {
    state.loading = true;

    // Simulate small delay for UX
    setTimeout(() => {
      // Improved regex to avoid capturing trailing punctuation like dots or commas
      const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,8}/gi;
      let emails: string[] | null = state.text.match(regex);

      if (emails && emails.length > 0) {
        // Cleaning potential duplicates and ensuring valid format
        state.output = [...new Set(emails)].join(state.sep !== "||" ? state.sep : "\n");
      } else {
        state.output = ''
      }

      state.loading = false;
    }, 100);
  }
}

defineI18nRoute({
  paths: {
    pt: "/extrator-de-emails",
    es: "/extractor-de-emails",
    fr: '/extracteur-emails',
    it: '/estrattore-di-email',
    id: '/ekstraktor-email',
    de: '/email-extraktor'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.output !== null"
    :see-also-links="[
      { label: t('see1'), to: 'percentage-calculator' },
      { label: t('see2'), to: 'list-randomizer' },
      { label: t('see3'), to: 'dice-roller' },
      { label: t('see4'), to: 'simple-rule-of-three-calculator' }
    ]"
  >
    <template #info>
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :description="t('use_cases_desc')"
          :items="[ t('uc_2'), t('uc_4') ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <section>
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="heroicons:user-group-20-solid" class="w-6 h-6 text-primary" />
            {{ t('ideal_for_title') }}
          </h2>
          <p class="text-base-content/80 leading-relaxed">{{ t('ideal_for_desc') }}</p>
        </section>
      </div>
    </template>

    <div class="space-y-6">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content">{{ t('plc') }}</span>
        </label>
        <textarea 
          v-model="state.text" 
          rows="8" 
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl text-lg" 
          :placeholder="t('plc')"
          autofocus
        ></textarea>
      </div>

      <div class="flex flex-col sm:flex-row items-end gap-4">
        <ToolSelect 
          v-model="state.sep"
          :label="t('sep')"
          :options="sepOptions"
          class="sm:w-64"
        />

        <ButtonPrimary 
          @click="extract"
          icon="heroicons:envelope-20-solid"
          :is-loading="state.loading"
          :disabled="!state.text || state.loading"
        >
          {{ t('bt') }}
        </ButtonPrimary>
      </div>

      <!-- Drag and Drop -->
      <DragDropText @on-drop="txt => state.text = txt" />

      <!-- Result -->
      <Blockcopy 
        v-if="state.output" 
        :label="t('res')" 
        :content="state.output"
      >
        <pre class="whitespace-pre-wrap break-all font-mono text-lg">{{ state.output }}</pre>
      </Blockcopy>

      <!-- Empty State -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="state.output === ''" class="alert alert-error shadow-lg border-none rounded-2xl bg-error/10 text-error">
          <Icon name="heroicons:information-circle-20-solid" class="w-6 h-6" />
          <span class="font-bold">{{ t('empty') }}</span>
        </div>
      </Transition>
    </div>
  </ToolPage>
</template>

<i18n lang="yaml">
{
    en: {
        title: "Email Extractor",
        meta: "Extract multiple email addresses automatically from any text with our online Email Extractor.",
        desc: "Need to extract dozens of contacts hidden inside a large block of text or data? Our Email Extractor makes that easy. Just paste or drag your content into the box, choose your preferred separator for the output list (comma, line break, semicolon, or pipe), and click 'Extract'. The tool automatically finds valid email addresses, removes duplicates, and generates a clean, ready-to-use list.",
        how_to_use_title: "How to use",
        step_1_title: "Input Text",
        step_1_desc: "Paste your text or drag a file into the input box.",
        step_2_title: "Select Separator",
        step_2_desc: "Choose the separator (comma, line break, etc.) and click Extract.",
        step_3_title: "Copy Emails",
        step_3_desc: "Copy the clean list of extracted emails, ready to use.",
        use_cases_title: "Use Cases",
        use_cases_desc: "The Email Extractor helps you turn messy content into a clean, ready-to-use list of contacts. It's perfect for:",
        uc_2: "Extracting emails from long HTML pages or message logs",
        uc_4: "Removing duplicate addresses automatically for outreach",
        ideal_for_title: "Ideal For",
        ideal_for_desc: "This tool is useful for marketing, sales, support, recruiting, customer service, research, and anyone who needs to separate email addresses from long texts quickly and accurately.",
        sep: "Separate by",
        empty: "No email found",
        bt: "Extract",
        plc: "Insert your text here or drag a file",
        comma: "Comma",
        line: "Line break",
        colon: "Semicolon",
        pipe: "Pipe",
        res: "Result",
        features_title: "Features",
        f_1: "Extract all valid email addresses from any text automatically",
        f_2: "Remove duplicate emails automatically",
        f_3: "Export with comma, line break, semicolon, or pipe separator",
        f_4: "Drag and drop file support",
        see1: "Percentage Calculator",
        see2: "List Randomizer",
        see3: "Dice Roller",
        see4: "Rule of Three"
    },
    pt: {
        title: "Extrator de E-mails",
        meta: "Extraia automaticamente múltiplos endereços de e-mail de qualquer texto com nosso Extrator de E-mails online.",
        desc: "Precisa extrair dezenas de contatos escondidos em um grande bloco de texto ou dados? Nosso Extrator de E-mails facilita esse trabalho. Basta colar ou arrastar o conteúdo, escolher o separador da lista de saída (vírgula, quebra de linha, ponto e vírgula ou pipe) e clicar em 'Extrair'. A ferramenta encontra automaticamente todos os e-mails válidos, remove duplicados e gera uma lista limpa e pronta para uso.",
        how_to_use_title: "Como usar",
        step_1_title: "Inserir Texto",
        step_1_desc: "Cole o seu texto ou arraste um arquivo para a caixa de entrada.",
        step_2_title: "Escolher Separador",
        step_2_desc: "Selecione o separador (vírgula, quebra de linha, etc) e clique em Extrair.",
        step_3_title: "Copiar E-mails",
        step_3_desc: "Copie a lista limpa de e-mails extraídos, pronta para uso.",
        use_cases_title: "Casos de Uso",
        use_cases_desc: "O Extrator de E-mails ajuda você a transformar conteúdos bagunçados em uma lista de contatos limpa e pronta para uso. É ideal para:",
        uc_2: "Extrair e-mails de páginas HTML ou logs de mensagens",
        uc_4: "Remover e-mails duplicados para campanhas de marketing",
        ideal_for_title: "Ideal Para",
        ideal_for_desc: "A ferramenta é útil para equipes de marketing, vendas, suporte, recrutamento, atendimento ao cliente, pesquisa e qualquer pessoa que precise separar endereços de e-mail de textos longos com rapidez e precisão.",
        sep: "Separar por",
        empty: "Nenhum e-mail encontrado",
        bt: "Extrair",
        plc: "Insira seu texto aqui ou arraste um arquivo",
        comma: "Vírgula",
        line: "Quebra de linha",
        colon: "Ponto e vírgula",
        pipe: "Pipe",
        res: "Resultado",
        features_title: "Funcionalidades",
        f_1: "Extração automática de e-mails de qualquer texto",
        f_2: "Remoção automática de e-mails duplicados",
        f_3: "Exportação com vírgula, quebra de linha, ponto e vírgula ou pipe",
        f_4: "Suporte para arrastar e soltar arquivos",
        see1: "Calculadora de Porcentagem",
        see2: "Sorteador de Listas",
        see3: "Lançador de Dados",
        see4: "Regra de Três"
    },
    es: {
        title: "Extractor de Emails",
        meta: "Extrae automáticamente múltiples direcciones de email de cualquier texto con nuestro Extractor de Emails online.",
        desc: "¿Necesitas extraer decenas de contactos ocultos dentro de un gran bloque de texto o datos? Nuestro Extractor de Emails te facilita ese trabajo. Solo tienes que pegar o arrastrar el contenido, elegir el separador de la lista de salida que prefieras (coma, salto de línea, punto y coma o pipe) y hacer clic en 'Extraer'. La herramienta detecta automáticamente todos los emails válidos, elimina los duplicados y genera una lista limpia y lista para usar.",
        how_to_use_title: "Cómo usar",
        step_1_title: "Insertar Texto",
        step_1_desc: "Pega tu texto o arrastra un archivo a la caja de entrada.",
        step_2_title: "Elegir Separador",
        step_2_desc: "Selecciona el separador (coma, salto de línea, etc.) y haz clic en Extraer.",
        step_3_title: "Copiar Emails",
        step_3_desc: "Copia la lista limpia de emails extraídos, lista para usar.",
        use_cases_title: "Casos de Uso",
        use_cases_desc: "El Extractor de Emails te ayuda a transformar contenido desordenado en una lista de contactos limpia y lista para usar. Es ideal para:",
        uc_2: "Extraer correos de páginas HTML o registros de mensajes",
        uc_4: "Eliminar correos duplicados para campañas de marketing",
        ideal_for_title: "Ideal Para",
        ideal_for_desc: "La herramienta es útil para equipos de marketing, ventas, soporte, reclutamiento, atención al cliente, investigación y cualquier persona que necesite separar direcciones de email de textos largos con rapidez y precisión.",
        sep: "Separar por",
        empty: "No se encontraron emails",
        bt: "Extraer",
        plc: "Introduce tu texto aquí o arrastra un archivo",
        comma: "Coma",
        line: "Salto de línea",
        colon: "Punto y coma",
        pipe: "Pipe",
        res: "Resultado",
        features_title: "Funcionalidades",
        f_1: "Extracción automática de correos de cualquier texto",
        f_2: "Eliminación automática de correos duplicados",
        f_3: "Exportación con coma, salto de línea, punto y coma o pipe",
        f_4: "Soporte para arrastrar y soltar archivos",
        see1: "Calculadora de Porcentaje",
        see2: "Aleatorizador de Listas",
        see3: "Lanzador de Dados",
        see4: "Regla de Tres"
    },
    fr: {
        title: "Extracteur d'Emails",
        meta: "Extrayez automatiquement plusieurs adresses e-mail à partir de n'importe quel texte avec notre Extracteur d'Emails en ligne.",
        desc: "Vous avez besoin d'extraire des dizaines de contacts cachés dans un grand bloc de texte ou de données ? Notre Extracteur d'Emails simplifie ce travail. Il suffit de coller ou de faire glisser votre contenu, puis de choisir le séparateur de la liste de sortie (virgule, saut de ligne, point-virgule ou pipe) et de cliquer sur 'Extraire'. L'outil détecte automatiquement toutes les adresses e-mail valides, supprime les doublons et génère une liste propre, prête à l'emploi.",
        how_to_use_title: "Comment utiliser l'outil",
        step_1_title: "Insérer le Texte",
        step_1_desc: "Collez votre texte ou faites glisser un fichier dans la zone de saisie.",
        step_2_title: "Choisir le Séparateur",
        step_2_desc: "Sélectionnez le séparateur (virgule, saut de ligne, etc.) et cliquez sur Extraire.",
        step_3_title: "Copier les E-mails",
        step_3_desc: "Copiez la liste propre des e-mails extraits, prête à l'emploi.",
        use_cases_title: "Cas d'Utilisation",
        use_cases_desc: "L'Extracteur d'Emails vous aide à transformer un contenu désordonné en une liste de contacts propre et prête à l'emploi. Il est idéal pour :",
        uc_2: "Extraire des e-mails de longues pages HTML ou de journaux de messages",
        uc_4: "Supprimer automatiquement les adresses en double pour la prospection",
        ideal_for_title: "Idéal Pour",
        ideal_for_desc: "L'outil est utile pour les équipes marketing, vente, support, recrutement, service client, recherche et toute personne qui doit extraire rapidement et précisément des adresses e-mail à partir de longs textes.",
        sep: "Séparer par",
        empty: "Aucun e-mail trouvé",
        bt: "Extraire",
        plc: "Insérez votre texte ici ou faites glisser un fichier",
        comma: "Virgule",
        line: "Saut de ligne",
        colon: "Point-virgule",
        pipe: "Pipe",
        res: "Résultat",
        features_title: "Fonctionnalités",
        f_1: "Extraction automatique des e-mails à partir de n'importe quel texte",
        f_2: "Suppression automatique des e-mails en double",
        f_3: "Exportation avec virgule, saut de ligne, point-virgule ou pipe",
        f_4: "Prise en charge du glisser-déposer de fichiers",
        see1: "Calculatrice de Pourcentage",
        see2: "Mélangeur de Listes",
        see3: "Lanceur de Dés",
        see4: "Règle de Trois"
    },
    it: {
        title: "Estrattore di Email",
        meta: "Estrai automaticamente più indirizzi email da qualsiasi testo con il nostro Estrattore di Email online.",
        desc: "Hai bisogno di estrarre decine di contatti nascosti all'interno di un grande blocco di testo o dati? Il nostro Estrattore di Email semplifica questo lavoro. Basta incollare o trascinare il contenuto, scegliere il separatore dell'elenco di output (virgola, interruzione di riga, punto e virgola o pipe) e fare clic su 'Estrai'. Lo strumento rileva automaticamente tutte le email valide, rimuove i duplicati e genera un elenco pulito e pronto all'uso.",
        how_to_use_title: "Come usare lo strumento",
        step_1_title: "Inserisci Testo",
        step_1_desc: "Incolla il testo o trascina un file nella casella di input.",
        step_2_title: "Scegli Separatore",
        step_2_desc: "Seleziona il separatore (virgola, interruzione di riga, ecc.) e fai clic su Estrai.",
        step_3_title: "Copia Email",
        step_3_desc: "Copia l'elenco pulito delle email estratte, pronto all'uso.",
        use_cases_title: "Casi d'Uso",
        use_cases_desc: "L'Estrattore di Email ti aiuta a trasformare contenuti disordinati in un elenco di contatti pulito e pronto all'uso. È ideale per:",
        uc_2: "Estrarre email da lunghe pagine HTML o log di messaggi",
        uc_4: "Rimuovere automaticamente gli indirizzi duplicati per l'outreach",
        ideal_for_title: "Ideale Per",
        ideal_for_desc: "Lo strumento è utile per team di marketing, vendite, supporto, recruiting, assistenza clienti, ricerca e chiunque abbia bisogno di separare indirizzi email da testi lunghi con rapidità e precisione.",
        sep: "Separare per",
        empty: "Nessuna email trovata",
        bt: "Estrai",
        plc: "Inserisci il tuo testo qui o trascina un file",
        comma: "Virgola",
        line: "Interruzione di riga",
        colon: "Punto e virgola",
        pipe: "Pipe",
        res: "Risultato",
        features_title: "Funzionalità",
        f_1: "Estrazione automatica di email da qualsiasi testo",
        f_2: "Rimozione automatica delle email duplicate",
        f_3: "Esportazione con virgola, riga, punto e virgola o pipe",
        f_4: "Supporto per il trascinamento dei file",
        see1: "Calcolatrice di Percentuale",
        see2: "Randomizzatore di Liste",
        see3: "Lanciatore di Dadi",
        see4: "Regola del Tre"
    },
    id: {
        title: "Ekstraktor Email",
        meta: "Ekstrak beberapa alamat email secara otomatis dari teks apa pun dengan Ekstraktor Email online kami.",
        desc: "Perlu mengekstrak puluhan kontak yang tersembunyi di dalam blok teks atau data yang besar? Ekstraktor Email kami memudahkan pekerjaan itu. Cukup tempel atau seret konten Anda ke dalam kotak, pilih pemisah untuk daftar hasil (koma, jeda baris, titik koma, atau pipe), lalu klik 'Ekstrak'. Alat ini secara otomatis menemukan semua email yang valid, menghapus duplikat, dan menghasilkan daftar yang bersih serta siap digunakan.",
        how_to_use_title: "Cara menggunakan alat ini",
        step_1_title: "Masukkan Teks",
        step_1_desc: "Tempel teks atau seret file ke dalam kotak input.",
        step_2_title: "Pilih Pemisah",
        step_2_desc: "Pilih pemisah (koma, jeda baris, dll) dan klik Ekstrak.",
        step_3_title: "Salin Email",
        step_3_desc: "Salin daftar bersih email yang diekstrak, siap digunakan.",
        use_cases_title: "Contoh Penggunaan",
        use_cases_desc: "Ekstraktor Email membantu Anda mengubah konten yang berantakan menjadi daftar kontak yang bersih dan siap digunakan. Sangat cocok untuk:",
        uc_2: "Mengekstrak email dari halaman HTML panjang atau log pesan",
        uc_4: "Menghapus alamat duplikat secara otomatis untuk penjangkauan",
        ideal_for_title: "Ideal Untuk",
        ideal_for_desc: "Alat ini berguna untuk tim marketing, sales, support, rekrutmen, layanan pelanggan, riset, dan siapa pun yang perlu memisahkan alamat email dari teks panjang dengan cepat dan akurat.",
        sep: "Pisahkan dengan",
        empty: "Email tidak ditemukan",
        bt: "Ekstrak",
        plc: "Masukkan teks Anda di sini atau seret file ke sini",
        comma: "Koma",
        line: "Jeda baris",
        colon: "Titik koma",
        pipe: "Pipe",
        res: "Hasil",
        features_title: "Fitur",
        f_1: "Ekstrak otomatis semua email dari teks apa pun",
        f_2: "Hapus email duplikat secara otomatis",
        f_3: "Ekspor dengan koma, baris, titik koma, atau pipe",
        f_4: "Dukungan seret dan lepas file",
        see1: "Kalkulator Persentase",
        see2: "Pengacak Daftar",
        see3: "Pelempar Dadu",
        see4: "Aturan Tiga"
    },
    de: {
        title: "E-Mail-Extraktor",
        meta: "Extrahiere automatisch mehrere E-Mail-Adressen aus beliebigem Text mit unserem Online-E-Mail-Extraktor.",
        desc: "Musst du viele Kontakte aus einem großen Textblock oder Datensatz extrahieren? Unser E-Mail-Extraktor macht das einfach. Füge deinen Inhalt ein oder ziehe ihn in das Feld, wähle das gewünschte Trennzeichen für die Ausgabeliste (Komma, Zeilenumbruch, Semikolon oder Pipe) und klicke auf 'Extrahieren'. Das Tool findet automatisch gültige E-Mail-Adressen, entfernt Duplikate und erstellt eine saubere, sofort nutzbare Liste.",
        how_to_use_title: "So verwendest du das Tool",
        step_1_title: "Text eingeben",
        step_1_desc: "Füge deinen Text ein oder ziehe eine Datei in das Eingabefeld.",
        step_2_title: "Trennzeichen wählen",
        step_2_desc: "Wähle das Trennzeichen (Komma, Zeilenumbruch usw.) und klicke auf Extrahieren.",
        step_3_title: "E-Mails kopieren",
        step_3_desc: "Kopiere die saubere Liste der extrahierten E-Mails, bereit zur Verwendung.",
        use_cases_title: "Anwendungsfälle",
        use_cases_desc: "Der E-Mail-Extraktor hilft dir, unübersichtliche Inhalte in eine saubere, sofort nutzbare Kontaktliste zu verwandeln. Er eignet sich besonders für:",
        uc_2: "Extrahieren von E-Mails aus langen HTML-Seiten oder Nachrichtenprotokollen",
        uc_4: "Automatisches Entfernen doppelter Adressen für Outreach",
        ideal_for_title: "Ideal für",
        ideal_for_desc: "Dieses Tool ist nützlich für Marketing, Vertrieb, Support, Recruiting, Kundenservice, Recherche und alle, die E-Mail-Adressen schnell und genau aus langen Texten herausfiltern müssen.",
        sep: "Trennen nach",
        empty: "Keine E-Mail gefunden",
        bt: "Extrahieren",
        plc: "Füge deinen Text hier ein oder ziehe eine Datei hinein",
        comma: "Komma",
        line: "Zeilenumbruch",
        colon: "Semikolon",
        pipe: "Pipe",
        res: "Ergebnis",
        features_title: "Funktionen",
        f_1: "Alle gültigen E-Mail-Adressen automatisch aus beliebigem Text extrahieren",
        f_2: "Doppelte E-Mails automatisch entfernen",
        f_3: "Export mit Komma, Zeilenumbruch, Semikolon oder Pipe als Trennzeichen",
        f_4: "Unterstützung für Drag-and-drop-Dateien",
        see1: "Prozentrechner",
        see2: "Listen-Zufallsgenerator",
        see3: "Würfelroller",
        see4: "Dreisatzrechner"
    }
}
</i18n>
