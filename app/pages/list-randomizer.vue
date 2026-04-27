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
  ]
})

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('meta') }
  ]
})

// Tool State
const state = reactive({
  list: '',
  output: '',
  loading: false
})

/**
 * Shuffles the list items using the Fisher-Yates algorithm
 */
function shuffle() {
  if (!state.list.trim()) return

  state.loading = true
  
  // Artificial delay for UI feedback
  setTimeout(() => {
    let array = state.list.split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)

    // Fisher-Yates Shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }

    state.output = array.join('\n')
    state.loading = false
  }, 150)
}

// Reset output when input changes
watch(() => state.list, () => {
  state.output = ''
})

// Localized Routes
defineI18nRoute({
  paths: {
    en: '/list-randomizer',
    pt: '/embaralhador-de-listas',
    es: '/mezclador-de-listas',
    fr: '/melangeur-de-listes',
    it: '/mescolatore-di-liste',
    id: '/pengacak-daftar'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="!!state.output"
    :see-also-links="[
      { label: t('see1'), to: 'percentage-calculator' },
      { label: t('see2'), to: 'dice-roller' },
      { label: t('see3'), to: 'simple-rule-of-three-calculator' },
      { label: t('see4'), to: 'email-extractor' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Input Area -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold text-base-content">{{ t('plc') }}</span>
        </label>
        <textarea 
          v-model="state.list"
          rows="8"
          class="textarea textarea-bordered textarea-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl font-mono text-lg leading-relaxed" 
          :placeholder="t('plc_hint')"
          autofocus
        ></textarea>
      </div>

      <!-- Action Button -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <ButtonPrimary 
          @click="shuffle"
          icon="heroicons:arrows-right-left-20-solid"
          :disabled="!state.list.trim() || state.loading"
          :loading="state.loading"
          class="w-full sm:w-auto"
        >
          {{ t('bt') }}
        </ButtonPrimary>
      </div>

      <!-- Result Area -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="state.output" class="space-y-2">
          <label class="label">
            <span class="label-text font-bold text-base-content">{{ t('result') }}</span>
          </label>
          <Blockcopy :content="state.output">
            <div class="whitespace-pre-wrap font-mono text-lg leading-relaxed">{{ state.output }}</div>
          </Blockcopy>
        </div>
      </Transition>
    </div>

    <template #info>
      <p>{{ t('desc') }}</p>
      <div class="font-bold">{{ t('how_title') }}</div>
      <ul class="list-disc list-inside">
        <li>{{ t('how_1') }}</li>
        <li>{{ t('how_2') }}</li>
        <li>{{ t('how_3') }}</li>
      </ul>
    </template>

    <DragDropText @onDrop="txt => state.list = txt"/>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "List Randomizer & List Shuffler",
    meta: "Easily shuffle names, words, or items with our free online List Randomizer. Generate random orders and fair draws in a matter of seconds.",
    desc: "This tool randomizes the order of names, words, or any list of items quickly and fairly. It is ideal for drawing random names, shuffling groups, reorganizing tasks, and ensuring unbiased results in games, competitions, classroom activities, and everyday decisions.",
    bt: "Shuffle",
    result: "Result",
    plc: "Enter your list of items",
    plc_hint: "Enter one item per line...",
    see1: "Percentage Calculator",
    see2: "Dice Roller",
    see3: "Rule of Three Calculator",
    see4: "Email Extractor",
    how_title: "How to use",
    how_1: "Type or paste your list of items into the text area.",
    how_2: "Ensure each item is on a new line.",
    how_3: "Click the 'Shuffle' button to generate a random order.",
    f_1: "Instantly shuffle any list of names or words",
    f_2: "Unbiased Fisher-Yates randomization algorithm",
    f_3: "Drag and drop text files support",
    f_4: "Completely free and private (client-side processing)"
  },
  pt: {
    title: "Embaralhador e Sorteador de Listas",
    meta: "Embaralhe nomes, palavras ou itens facilmente com nosso Sorteador de Listas online gratuito. Crie ordens aleatórias para sorteios em segundos.",
    desc: "Esta ferramenta embaralha nomes, palavras ou qualquer lista de itens de forma rápida e imparcial. Ela é ideal para sortear nomes, embaralhar grupos, reorganizar tarefas e garantir resultados justos em jogos, sorteios, atividades em grupo e decisões do dia a dia.",
    bt: "Embaralhar",
    result: "Resultado",
    plc: "Insira sua lista de itens",
    plc_hint: "Informe um item por linha...",
    see1: "Calculadora de Porcentagem",
    see2: "Lançador de Dados",
    see3: "Calculadora de Regra de Três",
    see4: "Extrator de E-mails",
    how_title: "Como usar",
    how_1: "Digite ou cole sua lista de itens no campo de texto.",
    how_2: "Certifique-se de que cada item esteja em uma nova linha.",
    how_3: "Clique no botão 'Embaralhar' para gerar uma ordem aleatória.",
    f_1: "Embaralhe nomes, palavras ou itens instantaneamente",
    f_2: "Algoritmo Fisher-Yates de aleatorização imparcial",
    f_3: "Suporte para arrastar e soltar arquivos de texto",
    f_4: "Processamento local e totalmente gratuito"
  },
  es: {
    title: "Aleatorizador y Mezclador de Listas",
    meta: "Mezcla nombres, palabras o elementos fácilmente con nuestro Aleatorizador de Listas online gratuito. Genera un orden al azar para sorteos en segundos.",
    desc: "Esta herramienta mezcla nombres, palabras o cualquier lista de elementos de forma rápida e imparcial. Es ideal para sortear nombres, mezclar grupos, reorganizar tareas y garantizar resultados justos en juegos, concursos, actividades en grupo y decisiones cotidianas.",
    bt: "Mezclar",
    result: "Resultado",
    plc: "Ingrese su lista de elementos",
    plc_hint: "Ingrese un elemento por línea...",
    see1: "Calculadora de Porcentaje",
    see2: "Lanzador de Dados",
    see3: "Calculadora de Regla de Tres",
    see4: "Extractor de Correos Electrónicos",
    how_title: "Cómo usar",
    how_1: "Escribe o pega tu lista de elementos en el área de texto.",
    how_2: "Asegúrate de que cada elemento esté en una línea nueva.",
    how_3: "Haz clic en el botón 'Mezclar' para generar un orden aleatorio.",
    f_1: "Mezcla cualquier lista de nombres o palabras al instante",
    f_2: "Algoritmo de aleatorización Fisher-Yates sin sesgos",
    f_3: "Soporte para arrastrar y soltar archivos de texto",
    f_4: "Totalmente gratuito y privado (procesamiento local)"
  },
  fr: {
    title: "Générateur de Liste Aléatoire & Mélangeur",
    meta: "Mélangez facilement des noms, mots ou éléments avec notre générateur de liste aléatoire en ligne. Créez un ordre au hasard pour vos tirages au sort.",
    desc: "Cet outil mélange rapidement et de manière impartiale des noms, des mots ou tout autre type de liste. Il est idéal pour tirer des noms au sort, mélanger des groupes, réorganiser des tâches et garantir des résultats justes dans les jeux, les concours, les activités de groupe et les décisions du quotidien.",
    bt: "Mélanger",
    result: "Résultat",
    plc: "Entrez votre liste d'éléments",
    plc_hint: "Entrez un élément par ligne...",
    see1: "Calculatrice de Pourcentage",
    see2: "Lanceur de Dés",
    see3: "Calculatrice de Règle de Trois",
    see4: "Extracteur d'E-mails",
    how_title: "Comment utiliser",
    how_1: "Saisissez ou collez votre liste d'éléments dans la zone de texte.",
    how_2: "Assurez-vous que chaque élément est sur une nouvelle ligne.",
    how_3: "Cliquez sur le bouton 'Mélanger' pour générer un ordre aléatoire.",
    f_1: "Mélangez instantanément n'importe quelle liste de noms ou de mots",
    f_2: "Algorithme de randomisation Fisher-Yates impartial",
    f_3: "Prise en charge du glisser-déposer de fichiers texte",
    f_4: "Privé et gratuit (traitement côté client)"
  },
  it: {
    title: "Randomizzatore di Liste",
    meta: "Mescola facilmente nomi, parole o elementi con il nostro generatore di liste casuali online. Crea un ordine casuale per i tuoi sorteggi in pochi secondi.",
    desc: "Questo strumento mescola nomi, parole o qualsiasi elenco di elementi in modo rapido e imparziale. È ideale per estrarre nomi a caso, mescolare gruppi, riorganizzare attività e garantire risultati equi in giochi, sorteggi, attività di gruppo e decisioni quotidiane.",
    bt: "Mescola",
    result: "Risultato",
    plc: "Inserisci la tua lista di elementi",
    plc_hint: "Inserisci un elemento per riga...",
    see1: "Calcolatrice di Percentuale",
    see2: "Lanciatore di Dadi",
    see3: "Calcolatrice di Regola di Tre",
    see4: "Estrattore di Email",
    how_title: "Come usare",
    how_1: "Digita o incolla il tuo elenco di elementi nell'area di testo.",
    how_2: "Assicurati che ogni elemento sia su una nuova riga.",
    how_3: "Fai clic sul pulsante 'Mescola' per generare un ordine casuale.",
    f_1: "Mescola istantaneamente nomi, parole o elementi",
    f_2: "Algoritmo di randomizzazione Fisher-Yates imparziale",
    f_3: "Supporto drag-and-drop per file di testo",
    f_4: "Interamente gratuito e privato (elaborazione locale)"
  },
  id: {
    title: "Pengacak Daftar",
    meta: "Mudah mengocok nama, kata, atau item dengan Pengacak Daftar online gratis kami. Hasilkan urutan acak dan undian yang adil dalam hitungan detik.",
    desc: "Alat ini mengacak nama, kata, atau daftar item apa pun dengan cepat dan adil. Alat ini ideal untuk mengundi nama, mengacak kelompok, menyusun ulang tugas, dan membantu memberikan hasil yang tidak memihak untuk permainan, undian, aktivitas kelompok, dan keputusan sehari-hari.",
    bt: "Kocok",
    result: "Hasil",
    plc: "Masukkan daftar item Anda",
    plc_hint: "Masukkan satu item per baris...",
    see1: "Kalkulator Persentase",
    see2: "Pelempar Dadu",
    see3: "Kalkulator Aturan Tiga",
    see4: "Ekstraktor Email",
    how_title: "Cara menggunakan",
    how_1: "Ketik atau tempel daftar item Anda ke dalam area teks.",
    how_2: "Pastikan setiap item berada di baris baru.",
    how_3: "Klik tombol 'Kocok' untuk menghasilkan urutan acak.",
    f_1: "Kocok daftar nama atau kata secara instan",
    f_2: "Algoritma pengacakan Fisher-Yates yang tidak memihak",
    f_3: "Dukungan seret dan lepas file teks",
    f_4: "Gratis dan pribadi (pemrosesan di sisi klien)"
  }
}
</i18n>
