<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  type: 'tool',
  breadcrumb: [
    { name: 'Home', url: localePath('/') },
    { name: t('title') }
  ],
  features: [
    "Extract all valid email addresses from any text automatically",
    "Remove duplicate emails automatically",
    "Export with comma, line break, semicolon, or pipe separator",
    "Drag and drop file support"
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
    id: '/ekstraktor-email'
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
      <div class="space-y-4">
        <p>{{ t('desc') }}</p>
      </div>
    </template>

    <div class="space-y-6">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content/80">{{ t('plc') }}</span>
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
        meta: "Extract multiple email addresses from any large text automatically with our free online Email Extractor. Filter and clean your email lists instantly.",
        desc: "Need to copy dozens of contacts hidden within a large block of text or data? Our Email Extractor is the perfect tool for the job. Simply paste or drag a long text document into the box, choose your preferred list separator (comma, line break, semicolon, or vertical bar), and click 'Extract'. Our algorithm will automatically find all valid embedded emails, filter out any duplicates, and generate a clean, ready-to-use list for your marketing campaigns or mailing needs.",
        sep: "Separate by",
        empty: "No email found",
        bt: "Extract",
        plc: "Insert your text here or drag a file",
        comma: "Comma",
        line: "Line break",
        colon: "Semicolon",
        pipe: "Vertical bar (pipe)",
        res: "Result",
        see1: "Percentage Calculator",
        see2: "List Randomizer",
        see3: "Dice Roller",
        see4: "Rule of Three Calculator"
    },
    pt: {
        title: "Extrator de E-mails",
        meta: "Extraia múltiplos endereços de e-mail de qualquer texto grande automaticamente com nosso Extrator de E-mails online e remova duplicados.",
        desc: "Precisa extrair dezenas de contatos escondidos em um grande bloco de texto ou dados? Nosso Extrator de E-mails facilita esse trabalho. Basta colar ou arrastar um texto longo, escolher o separador da lista (vírgula, quebra de linha, ponto e vírgula ou barra vertical) e clicar em 'Extrair'. A ferramenta encontra automaticamente todos os e-mails válidos, remove duplicados e gera uma lista limpa e pronta para uso.",
        sep: "Separar por",
        empty: "Nenhum e-mail encontrado",
        bt: "Extrair",
        plc: "Insira seu texto aqui ou arraste um arquivo",
        comma: "Vírgula",
        line: "Quebra de linha",
        colon: "Ponto e vírgula",
        pipe: "Barra vertical (pipe)",
        res: "Resultado",
        see1: "Calculadora de Porcentagem",
        see2: "Sorteador de Listas",
        see3: "Lançador de Dados",
        see4: "Calculadora de Regra de Três"
    },
    es: {
        title: "Extractor de Correos Electrónicos",
        meta: "Extrae direcciones de correo de cualquier texto o documento largo con nuestro Extractor de Emails online gratuito. Elimina duplicados al instante.",
        desc: "¿Necesitas extraer decenas de contactos ocultos dentro de grandes bloques de texto o datos? Nuestro Extractor de Correos Electrónicos hace ese trabajo por ti. Solo tienes que pegar o arrastrar el contenido, elegir el separador que prefieras (coma, salto de línea, punto y coma o barra vertical) y hacer clic en 'Extraer'. La herramienta detectará automáticamente todos los correos válidos, eliminará los duplicados y generará una lista limpia y lista para usar.",
        sep: "Separar por",
        empty: "No se encontraron correos electrónicos",
        bt: "Extraer",
        plc: "Introduce tu texto aquí o arrastra un archivo",
        comma: "Coma",
        line: "Salto de línea",
        colon: "Punto y coma",
        pipe: "Barra vertical",
        res: "Resultado",
        see1: "Calculadora de Porcentaje",
        see2: "Aleatorizador de Listas",
        see3: "Lanzador de Dados",
        see4: "Calculadora de Regla de Tres"
    },
    fr: {
        title: "Extracteur d'Emails",
        meta: "Extrayez plusieurs adresses e-mail à partir d'un texte long automatiquement avec notre Extracteur gratuit en ligne.",
        desc: "Vous avez besoin d'extraire des dizaines de contacts cachés dans un long bloc de texte ou de données ? Notre Extracteur d'Emails simplifie ce travail. Il suffit de coller ou de faire glisser votre contenu, puis de choisir le séparateur de liste souhaité (virgule, saut de ligne, point-virgule ou barre verticale). En cliquant sur 'Extraire', l'outil détecte automatiquement toutes les adresses e-mail valides, supprime les doublons et génère une liste propre, prête à l'emploi.",
        sep: "Séparer par",
        empty: "Aucun e-mail trouvé",
        bt: "Extraire",
        plc: "Insérez votre texte ici ou faites glisser un fichier",
        comma: "Virgule",
        line: "Saut de ligne",
        colon: "Point-virgule",
        pipe: "Barre verticale (pipe)",
        res: "Résultat",
        see1: "Calculatrice de Pourcentage",
        see2: "Mélangeur de Listes",
        see3: "Lanceur de Dés",
        see4: "Calculatrice de Règle de Trois"
    },
    it: {
        title: "Estrattore di Email",
        meta: "Estrai automaticamente numerosi indirizzi email da un testo o codice di grandi dimensioni con il nostro Estrattore di Email gratuito.",
        desc: "Hai bisogno di estrarre decine di contatti nascosti all'interno di un grande blocco di testo o dati? Il nostro Estrattore di Email semplifica questo lavoro. Basta incollare o trascinare il contenuto, scegliere il separatore dell'elenco (virgola, interruzione di riga, punto e virgola o barra verticale) e fare clic su 'Estrai'. Lo strumento rileva automaticamente tutte le email valide, rimuove i duplicati e genera un elenco pulito e pronto all'uso.",
        sep: "Separare per",
        empty: "Nessuna email trovata",
        bt: "Estrai",
        plc: "Inserisci il tuo testo qui o trascina un file",
        comma: "Virgola",
        line: "Interruzione di riga",
        colon: "Punto e virgola",
        pipe: "Barra verticale (pipe)",
        res: "Risultato",
        see1: "Calcolatrice di Percentuale",
        see2: "Randomizzatore di Liste",
        see3: "Lanciatore di Dadi",
        see4: "Calcolatrice di Regola di Tre"
    },
    id: {
        title: "Ekstraktor Email",
        meta: "Ekstrak beberapa alamat email dari teks besar apa pun secara otomatis dengan Ekstraktor Email online gratis kami. Filter dan bersihkan daftar email Anda secara instan.",
        desc: "Perlu mengekstrak puluhan kontak yang tersembunyi di dalam blok teks atau data yang besar? Ekstraktor Email kami memudahkan pekerjaan itu. Cukup tempel atau seret teks panjang ke dalam kotak, pilih pemisah daftar yang Anda inginkan (koma, jeda baris, titik koma, atau garis tegak), lalu klik 'Ekstrak'. Alat ini akan secara otomatis menemukan semua email valid, menghapus duplikat, dan menghasilkan daftar yang bersih serta siap digunakan.",
        sep: "Pisahkan dengan",
        empty: "Email tidak ditemukan",
        bt: "Ekstrak",
        plc: "Masukkan teks Anda di sini atau seret file ke sini",
        comma: "Koma",
        line: "Jeda baris",
        colon: "Titik koma",
        pipe: "Garis tegak (pipe)",
        res: "Hasil",
        see1: "Kalkulator Persentase",
        see2: "Pengacak Daftar",
        see3: "Pelempar Dadu",
        see4: "Kalkulator Aturan Tiga"
    }
}
</i18n>
