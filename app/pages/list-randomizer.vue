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
  faq: [
    { question: t('faq_1_q'), answer: t('faq_1_a') },
    { question: t('faq_2_q'), answer: t('faq_2_a') },
    { question: t('faq_3_q'), answer: t('faq_3_a') }
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
    pt: '/sorteador-de-nomes',
    es: '/sorteador-de-nombres',
    fr: '/tirage-au-sort',
    it: '/estrazione-casuale-nomi',
    id: '/pengacak-nama',
    de: '/namen-zufallsgenerator',
    nl: '/namen-loten',
    ru: '/randomizator-spiskov'
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
          <Blockcopy :label="t('result')" :content="state.output">
            <div class="whitespace-pre-wrap font-mono text-lg leading-relaxed">{{ state.output }}</div>
          </Blockcopy>
        </div>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[ t('uc_1'), t('uc_2'), t('uc_3'), t('uc_4') ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') }
          ]"
        />
      </div>
    </template>

    <DragDropText @onDrop="txt => state.list = txt"/>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "List Randomizer & Random Name Picker",
    meta: "Easily shuffle names, words, or items with our free online List Randomizer and Random Name Picker. Generate random orders and fair draws in seconds.",
    desc: "This tool randomizes the order of names, words, or any list of items quickly and fairly. It is ideal for drawing random names, shuffling groups, reorganizing tasks, and ensuring unbiased results in games, competitions, classroom activities, and everyday decisions.",
    bt: "Shuffle",
    result: "Result",
    plc: "Enter your list of items",
    plc_hint: "Enter one item per line...",
    see1: "Percentage",
    see2: "Dice Roller",
    see3: "Rule of Three",
    see4: "Email Extractor",
    how_to_use_title: "How to use",
    step_1_title: "Prepare List",
    step_1_desc: "Type or paste your items into the input area, ensuring each item is on its own line.",
    step_2_title: "Shuffle Items",
    step_2_desc: "Click the 'Shuffle' button to run the randomization algorithm.",
    step_3_title: "Get Random Order",
    step_3_desc: "The items will be rearranged instantly. You can copy the final result with one click using the copy button.",
    f_1: "Instantly shuffle any list of names or words",
    f_2: "Truly unbiased and fair randomization",
    f_3: "Drag and drop text files support",
    f_4: "Completely free and private (client-side processing)",
    features_title: "Features",
    use_cases_title: "Use Cases",
    uc_1: "Drawing random names for giveaways or contests",
    uc_2: "Shuffling groups and teams for sports or classroom activities",
    uc_3: "Randomizing a daily task list to avoid routine",
    uc_4: "Deciding a random order for presentations or turns in games",
    faq_title: "Questions & Answers",
    faq_1_q: "How many items can I shuffle at once?",
    faq_1_a: "There is no strict limit, but for the best experience, we recommend shuffling up to 10,000 items. The processing is done entirely in your browser.",
    faq_2_q: "Is the randomization fair?",
    faq_2_a: "Yes. We use the Fisher-Yates shuffle algorithm, which is a mathematically proven method for generating unbiased permutations of a list.",
    faq_3_q: "Is my data private?",
    faq_3_a: "Absolutely. Your list never leaves your device. All randomization happens locally in your browser, and nothing is sent to our servers."
  },
  pt: {
    title: "Sorteador de Nomes e Listas",
    meta: "Sorteador de nomes online gratuito. Embaralhe nomes, palavras ou itens e gere ordens aleatórias para sorteios justos em poucos segundos.",
    desc: "Esta ferramenta embaralha nomes, palavras ou qualquer lista de itens de forma rápida e imparcial. Ela é ideal para sortear nomes, embaralhar grupos, reorganizar tarefas e garantir resultados justos em jogos, sorteios, atividades em grupo e decisões do dia a dia.",
    bt: "Embaralhar",
    result: "Resultado",
    plc: "Insira sua lista de itens",
    plc_hint: "Informe um item por linha...",
    see1: "Porcentagem",
    see2: "Lançador de Dados",
    see3: "Regra de Três",
    see4: "Extrator de E-mails",
    how_to_use_title: "Como usar",
    step_1_title: "Prepare a Lista",
    step_1_desc: "Digite ou cole seus itens na área de entrada, garantindo que cada item esteja em sua própria linha.",
    step_2_title: "Embaralhe os Itens",
    step_2_desc: "Clique no botão 'Embaralhar' para executar o algoritmo de aleatorização.",
    step_3_title: "Obtenha a Ordem Aleatória",
    step_3_desc: "Os itens serão reorganizados instantaneamente. Você pode copiar o resultado final com um clique usando o botão de cópia.",
    f_1: "Embaralhe nomes, palavras ou itens instantaneamente",
    f_2: "Aleatorização realmente imparcial e justa",
    f_3: "Suporte para arrastar e soltar arquivos de texto",
    f_4: "Processamento local e totalmente gratuito",
    features_title: "Funcionalidades",
    use_cases_title: "Casos de Uso",
    uc_1: "Sortear nomes para rifas, concursos ou brindes",
    uc_2: "Embaralhar grupos e times para esportes ou sala de aula",
    uc_3: "Aleatorizar listas de tarefas diárias para evitar rotina",
    uc_4: "Definir uma ordem aleatória para apresentações ou turnos em jogos",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Quantos itens posso embaralhar de uma vez?",
    faq_1_a: "Não há um limite rígido, mas para uma melhor performance, recomendamos até 10.000 itens. Todo o processamento é feito localmente no seu navegador.",
    faq_2_q: "O sorteio é realmente justo?",
    faq_2_a: "Sim. Utilizamos o algoritmo Fisher-Yates, que é um método matematicamente comprovado para gerar permutações imparciais de uma lista.",
    faq_3_q: "Meus dados estão seguros?",
    faq_3_a: "Totalmente. Sua lista nunca sai do seu dispositivo. Toda a aleatorização acontece localmente no navegador e nada é enviado para nossos servidores."
  },
  es: {
    title: "Sorteador de Nombres y Listas",
    meta: "Sorteador de nombres online gratuito. Mezcla nombres, palabras o elementos y genera un orden al azar para sorteos justos en segundos.",
    desc: "Esta herramienta mezcla nombres, palabras o cualquier lista de elementos de forma rápida e imparcial. Es ideal para sortear nombres, mezclar grupos, reorganizar tareas y garantizar resultados justos en juegos, concursos, actividades en grupo y decisiones cotidianas.",
    bt: "Mezclar",
    result: "Resultado",
    plc: "Ingrese su lista de elementos",
    plc_hint: "Ingrese un elemento por línea...",
    see1: "Porcentaje",
    see2: "Lanzador de Dados",
    see3: "Regla de Tres",
    see4: "Extractor de Emails",
    how_to_use_title: "Cómo usar",
    step_1_title: "Preparar Lista",
    step_1_desc: "Escriba o pegue sus elementos en el área de entrada, asegurándose de que cada elemento esté en su propia línea.",
    step_2_title: "Mezclar Elementos",
    step_2_desc: "Haga clic en el botón 'Mezclar' para ejecutar el algoritmo de aleatorización.",
    step_3_title: "Obtener Orden Aleatorio",
    step_3_desc: "Los elementos se reorganizarán al instante. Puede copiar el resultado final con un clic usando el botón de copiar.",
    f_1: "Mezcla cualquier lista de nombres o palabras al instante",
    f_2: "Aleatorización totalmente imparcial y justa",
    f_3: "Soporte para arrastrar y soltar archivos de texto",
    f_4: "Totalmente gratuito y privado (procesamiento local)",
    features_title: "Funcionalidades",
    use_cases_title: "Casos de Uso",
    uc_1: "Sortear nombres para rifas, concursos o regalos",
    uc_2: "Mezclar grupos y equipos para deportes o actividades en clase",
    uc_3: "Aleatorizar listas de tareas diarias para evitar la rutina",
    uc_4: "Definir un orden aleatorio para presentaciones o turnos en juegos",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Cuántos elementos puedo mezclar a la vez?",
    faq_1_a: "No hay un límite estricto, pero para una mejor experiencia, recomendamos hasta 10,000 elementos. Todo el procesamiento se realiza localmente en su navegador.",
    faq_2_q: "¿Es el sorteo realmente justo?",
    faq_2_a: "Sí. Utilizamos el algoritmo Fisher-Yates, que es un método matemáticamente probado para generar permutaciones imparciales de una lista.",
    faq_3_q: "¿Mis datos están seguros?",
    faq_3_a: "Totalmente. Su lista nunca sale de su dispositivo. Toda la aleatorización ocurre localmente en el navegador y nada se envía a nuestros servidores."
  },
  fr: {
    title: "Tirage au Sort en Ligne - Mélangeur de Liste",
    meta: "Tirage au sort en ligne gratuit. Mélangez facilement noms, mots ou éléments et créez un ordre aléatoire pour vos tirages en quelques secondes.",
    desc: "Cet outil mélange rapidement et de manière impartiale des noms, des mots ou tout autre type de liste. Il est idéal pour tirer des noms au sort, mélanger des groupes, réorganiser des tâches et garantir des résultats justes dans les jeux, les concours, les activités de groupe et les décisions du quotidien.",
    bt: "Mélanger",
    result: "Résultat",
    plc: "Entrez votre liste d'éléments",
    plc_hint: "Entrez un élément par ligne...",
    see1: "Pourcentage",
    see2: "Lanceur de Dés",
    see3: "Règle de Trois",
    see4: "Extracteur d'Emails",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Préparer la Liste",
    step_1_desc: "Saisissez ou collez vos éléments dans la zone de saisie, en vous assurant que chaque élément est sur sa propre ligne.",
    step_2_title: "Mélanger les Éléments",
    step_2_desc: "Cliquez sur le bouton 'Mélanger' pour lancer l'algorithme de randomisation.",
    step_3_title: "Obtenir l'Ordre Aléatoire",
    step_3_desc: "Les éléments seront instantanément réorganisés. Vous pouvez copier le résultat final en un clic à l'aide du bouton de copie.",
    f_1: "Mélangez instantanément n'importe quelle liste de noms ou de mots",
    f_2: "Randomisation totalement impartiale et équitable",
    f_3: "Prise en charge du glisser-déposer de fichiers texte",
    f_4: "Privé et gratuit (traitement côté client)",
    features_title: "Fonctionnalités",
    use_cases_title: "Cas d'Utilisation",
    uc_1: "Tirer des noms au sort pour des tombolas, des concours ou des cadeaux",
    uc_2: "Mélanger des groupes et des équipes pour le sport ou la classe",
    uc_3: "Randomiser des listes de tâches quotidiennes pour éviter la routine",
    uc_4: "Définir un ordre aléatoire pour des présentations ou des tours de jeu",
    faq_title: "Questions et Réponses",
    faq_1_q: "Combien d'éléments puis-je mélanger à la fois ?",
    faq_1_a: "Il n'y a pas de limite stricte, mais pour une meilleure expérience, nous recommandons jusqu'à 10 000 éléments. Tout le traitement est effectué localement dans votre navigateur.",
    faq_2_q: "Le tirage est-il vraiment équitable ?",
    faq_2_a: "Oui. Nous utilisons l'algorithme Fisher-Yates, qui est une méthode mathématiquement prouvée pour générer des permutations impartiales d'une liste.",
    faq_3_q: "Mes données sont-elles en sécurité ?",
    faq_3_a: "Totalement. Votre liste ne quitte jamais votre appareil. Toute la randomisation se produit localement dans le navigateur et rien n'est envoyé à nos serveurs."
  },
  it: {
    title: "Estrazione Casuale Nomi e Liste",
    meta: "Strumento online gratuito per l'estrazione casuale di nomi e liste. Mescola nomi, parole o elementi e crea un ordine casuale per i tuoi sorteggi in pochi secondi.",
    desc: "Questo strumento mescola nomi, parole o qualsiasi elenco di elementi in modo rapido e imparziale. È ideale per estrarre nomi a caso, mescolare gruppi, riorganizzare attività e garantire risultati equi in giochi, sorteggi, attività di gruppo e decisioni quotidiane.",
    bt: "Mescola",
    result: "Risultato",
    plc: "Inserisci la tua lista di elementi",
    plc_hint: "Inserisci un elemento per riga...",
    see1: "Percentuale",
    see2: "Lancio dei Dadi",
    see3: "Regola di Tre",
    see4: "Estrattore di Email",
    how_to_use_title: "Come usare",
    step_1_title: "Prepara la Lista",
    step_1_desc: "Digita o incolla i tuoi elementi nell'area di input, assicurandoti che ogni elemento sia su una riga a sé stante.",
    step_2_title: "Mescola gli Elementi",
    step_2_desc: "Clicca sul pulsante 'Mescola' per eseguire l'algoritmo di randomizzazione.",
    step_3_title: "Ottieni l'Ordine Casuale",
    step_3_desc: "Gli elementi saranno riorganizzati istantaneamente. Puoi copiare il risultato finale con un clic usando il pulsante di copia.",
    f_1: "Mescola istantaneamente nomi, parole o elementi",
    f_2: "Randomizzazione totalmente imparziale ed equa",
    f_3: "Supporto drag-and-drop per file di testo",
    f_4: "Interamente gratuito e privato (elaborazione locale)",
    features_title: "Funzionalità",
    use_cases_title: "Casi d'Uso",
    uc_1: "Estrarre nomi per lotterie, concorsi o omaggi",
    uc_2: "Mescolare gruppi e squadre per sport o attività scolastiche",
    uc_3: "Randomizzare elenchi di attività quotidiane per evitare la routine",
    uc_4: "Definire un ordine casuale per presentazioni o turni di gioco",
    faq_title: "Domande e Risposte",
    faq_1_q: "Quanti elementi posso mescolare alla volta?",
    faq_1_a: "Non esiste un limite rigido, ma per un'esperienza migliore consigliamo fino a 10.000 elementi. L'elaborazione avviene interamente nel tuo browser.",
    faq_2_q: "Il sorteggio è davvero equo?",
    faq_2_a: "Sì. Utilizziamo l'algoritmo Fisher-Yates, un metodo matematicamente provato per generare permutazioni imparziali di un elenco.",
    faq_3_q: "I miei dati sono al sicuro?",
    faq_3_a: "Assolutamente. Il tuo elenco non lascia mai il tuo dispositivo. Tutta la randomizzazione avviene localmente nel browser e nulla viene inviato ai nostri server."
  },
  id: {
    title: "Pengacak Nama dan Daftar",
    meta: "Pengacak nama online gratis. Kocok nama, kata, atau item dengan mudah dan hasilkan urutan acak serta undian yang adil dalam hitungan detik.",
    desc: "Alat ini mengacak nama, kata, atau daftar item apa pun dengan cepat dan adil. Alat ini ideal untuk mengundi nama, mengacak kelompok, menyusun ulang tugas, dan membantu memberikan hasil yang tidak memihak untuk permainan, undian, aktivitas kelompok, dan keputusan sehari-hari.",
    bt: "Kocok",
    result: "Hasil",
    plc: "Masukkan daftar item Anda",
    plc_hint: "Masukkan satu item per baris...",
    see1: "Persentase",
    see2: "Pelempar Dadu",
    see3: "Aturan Tiga",
    see4: "Ekstraktor Email",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Siapkan Daftar",
    step_1_desc: "Ketik atau tempel item Anda ke dalam area input, pastikan setiap item berada di barisnya sendiri.",
    step_2_title: "Kocok Item",
    step_2_desc: "Klik tombol 'Kocok' untuk menjalankan algoritma pengacakan.",
    step_3_title: "Dapatkan Urutan Acak",
    step_3_desc: "Item akan diatur ulang secara instan. Anda dapat menyalin hasil akhir dengan satu klik menggunakan tombol salin.",
    f_1: "Kocok daftar nama atau kata secara instan",
    f_2: "Pengacakan yang sepenuhnya adil dan tidak memihak",
    f_3: "Dukungan seret dan lepas file teks",
    f_4: "Gratis dan pribadi (pemrosesan di sisi klien)",
    features_title: "Fitur",
    use_cases_title: "Contoh Penggunaan",
    uc_1: "Mengundi nama untuk undian, kontes, atau hadiah",
    uc_2: "Mengocok kelompok dan tim untuk olahraga atau kegiatan kelas",
    uc_3: "Mengacak daftar tugas harian untuk menghindari rutinitas",
    uc_4: "Menentukan urutan acak untuk presentasi atau giliran dalam permainan",
    faq_title: "Tanya Jawab",
    faq_1_q: "Berapa banyak item yang bisa saya kocok sekaligus?",
    faq_1_a: "Tidak ada batasan ketat, tetapi untuk pengalaman terbaik, kami merekomendasikan mengocok hingga 10.000 item. Pemrosesan dilakukan sepenuhnya di browser Anda.",
    faq_2_q: "Apakah pengacakannya adil?",
    faq_2_a: "Ya. Kami menggunakan algoritma pengocokan Fisher-Yates, yang merupakan metode yang terbukti secara matematis untuk menghasilkan permutasi daftar yang tidak memihak.",
    faq_3_q: "Apakah data saya aman?",
    faq_3_a: "Sangat aman. Daftar Anda tidak pernah meninggalkan perangkat Anda. Semua pengacakan terjadi secara lokal di browser Anda, dan tidak ada yang dikirim ke server kami."
  },
  de: {
    title: "Namen-Zufallsgenerator und Listenmischer",
    meta: "Kostenloser Namen-Zufallsgenerator online. Mische Namen, Wörter oder Einträge und erzeuge zufällige Reihenfolgen und faire Auslosungen in Sekunden.",
    desc: "Dieses Tool randomisiert die Reihenfolge von Namen, Wörtern oder beliebigen Listeneinträgen schnell und fair. Es eignet sich ideal zum Ziehen zufälliger Namen, Mischen von Gruppen, Neuordnen von Aufgaben und für unvoreingenommene Ergebnisse bei Spielen, Wettbewerben, Unterrichtsaktivitäten und Alltagsentscheidungen.",
    bt: "Mischen",
    result: "Ergebnis",
    plc: "Gib deine Liste von Einträgen ein",
    plc_hint: "Einen Eintrag pro Zeile eingeben...",
    see1: "Prozentrechner",
    see2: "Würfelroller",
    see3: "Dreisatzrechner",
    see4: "E-Mail-Extraktor",
    how_to_use_title: "So verwendest du das Tool",
    step_1_title: "Liste vorbereiten",
    step_1_desc: "Tippe oder füge deine Einträge in das Eingabefeld ein und achte darauf, dass jeder Eintrag in einer eigenen Zeile steht.",
    step_2_title: "Einträge mischen",
    step_2_desc: "Klicke auf die Schaltfläche 'Mischen', um den Zufallsalgorithmus auszuführen.",
    step_3_title: "Zufällige Reihenfolge erhalten",
    step_3_desc: "Die Einträge werden sofort neu angeordnet. Du kannst das Endergebnis mit einem Klick über die Kopierschaltfläche kopieren.",
    f_1: "Jede Liste mit Namen oder Wörtern sofort mischen",
    f_2: "Vollkommen faire und unvoreingenommene Zufallsauswahl",
    f_3: "Unterstützung für Drag-and-drop von Textdateien",
    f_4: "Vollständig kostenlos und privat (clientseitige Verarbeitung)",
    features_title: "Funktionen",
    use_cases_title: "Anwendungsfälle",
    uc_1: "Zufällige Namen für Verlosungen oder Wettbewerbe ziehen",
    uc_2: "Gruppen und Teams für Sport oder Unterrichtsaktivitäten mischen",
    uc_3: "Eine tägliche Aufgabenliste randomisieren, um Routine zu vermeiden",
    uc_4: "Eine zufällige Reihenfolge für Präsentationen oder Spielzüge festlegen",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Wie viele Einträge kann ich auf einmal mischen?",
    faq_1_a: "Es gibt keine strikte Grenze, aber für die beste Erfahrung empfehlen wir bis zu 10.000 Einträge. Die Verarbeitung erfolgt vollständig in deinem Browser.",
    faq_2_q: "Ist die Randomisierung fair?",
    faq_2_a: "Ja. Wir verwenden den Fisher-Yates-Mischalgorithmus, eine mathematisch bewährte Methode zur Erzeugung unvoreingenommener Permutationen einer Liste.",
    faq_3_q: "Sind meine Daten privat?",
    faq_3_a: "Ja. Deine Liste verlässt dein Gerät nie. Die gesamte Randomisierung findet lokal in deinem Browser statt, und nichts wird an unsere Server gesendet."
  },
  nl: {
    title: "Namen Loten & Lijst-randomizer",
    meta: "Gratis online tool om namen te loten. Hussel eenvoudig namen, woorden of items en genereer in enkele seconden een willekeurige volgorde of een eerlijke loting.",
    desc: "Deze tool randomiseert snel en eerlijk de volgorde van namen, woorden of een willekeurige lijst met items. Het is ideaal voor het loten van namen, het husselen van groepen, het reorganiseren van taken en het garanderen van onbevooroordeelde resultaten bij spellen, wedstrijden, klassikale activiteiten en dagelijkse beslissingen.",
    bt: "Husselen",
    result: "Resultaat",
    plc: "Voer je lijst met items in",
    plc_hint: "Voer één item per regel in...",
    see1: "Percentagecalculator",
    see2: "Dobbelsteenroller",
    see3: "Regel-van-drie-calculator",
    see4: "E-mailextractor",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Lijst voorbereiden",
    step_1_desc: "Typ of plak je items in het invoerveld en zorg ervoor dat elk item op een eigen regel staat.",
    step_2_title: "Items husselen",
    step_2_desc: "Klik op de knop 'Husselen' om het randomisatie-algoritme uit te voeren.",
    step_3_title: "Krijg willekeurige volgorde",
    step_3_desc: "De items worden direct opnieuw gerangschikt. Je kunt het eindresultaat met één klik kopiëren met de kopieerknop.",
    f_1: "Hussel direct elke lijst met namen of woorden",
    f_2: "Volledig eerlijke en onbevooroordeelde randomisatie",
    f_3: "Ondersteuning voor drag-and-drop tekstbestanden",
    f_4: "Volledig gratis en privé (verwerking op je eigen apparaat)",
    features_title: "Functies",
    use_cases_title: "Gebruiksvoorbeelden",
    uc_1: "Willekeurige namen loten voor weggeefacties of wedstrijden",
    uc_2: "Groepen en teams husselen voor sport of klassikale activiteiten",
    uc_3: "Een dagelijkse takenlijst randomiseren om routine te voorkomen",
    uc_4: "Een willekeurige volgorde bepalen voor presentaties of beurten in spellen",
    faq_title: "Vragen & Antwoorden",
    faq_1_q: "Hoeveel items kan ik tegelijk husselen?",
    faq_1_a: "Er is geen strikte limiet, maar voor de beste ervaring raden we aan tot 10.000 items te husselen. De verwerking gebeurt volledig in je browser.",
    faq_2_q: "Is de randomisatie eerlijk?",
    faq_2_a: "Ja. We gebruiken het Fisher-Yates husselalgoritme, een wiskundig bewezen methode voor het genereren van onbevooroordeelde permutaties van een lijst.",
    faq_3_q: "Zijn mijn gegevens privé?",
    faq_3_a: "Absoluut. Je lijst verlaat nooit je apparaat. Alle randomisatie gebeurt lokaal in je browser en er wordt niets naar onze servers gestuurd."
  },
  ru: {
    title: "Рандомизатор списков и генератор случайных имен",
    meta: "Легко перемешивайте имена, слова или любые элементы списка онлайн с помощью нашего бесплатного рандомизатора списков. Создавайте случайный порядок за секунды.",
    desc: "Этот инструмент быстро и честно перемешивает порядок имен, слов или любых элементов списка. Он идеально подходит для розыгрыша случайных имен, деления на группы, перераспределения задач и обеспечения непредвзятых результатов в играх, конкурсах, учебных занятиях и повседневных решениях.",
    bt: "Перемешать",
    result: "Результат",
    plc: "Введите ваш список элементов",
    plc_hint: "Введите по одному элементу на строку...",
    see1: "Калькулятор процентов",
    see2: "Бросить кубики",
    see3: "Правило трех",
    see4: "Экстрактор email",
    how_to_use_title: "Инструкция",
    step_1_title: "Подготовьте список",
    step_1_desc: "Введите или вставьте элементы списка в поле ввода, убедившись, что каждый элемент находится на отдельной строке.",
    step_2_title: "Перемешайте элементы",
    step_2_desc: "Нажмите кнопку «Перемешать», чтобы запустить алгоритм случайной сортировки.",
    step_3_title: "Получите случайный порядок",
    step_3_desc: "Элементы мгновенно перестроятся в случайном порядке. Вы можете скопировать итоговый результат в один клик с помощью кнопки копирования.",
    f_1: "Мгновенное перемешивание любых списков имен или слов",
    f_2: "Полностью честная и непредвзятая рандомизация",
    f_3: "Поддержка перетаскивания (drag-and-drop) текстовых файлов",
    f_4: "Полностью бесплатно и конфиденциально (локальная обработка)",
    features_title: "Возможности",
    use_cases_title: "Варианты использования",
    uc_1: "Выбор случайных победителей в розыгрышах или конкурсах",
    uc_2: "Перемешивание и деление на группы или команды для спорта и учебы",
    uc_3: "Случайный выбор порядка задач в списке дел, чтобы избежать рутины",
    uc_4: "Определение случайного порядка выступлений или ходов в играх",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Сколько элементов я могу перемешать за один раз?",
    faq_1_a: "Строгого ограничения нет, но для максимального быстродействия мы рекомендуем перемешивать до 10 000 элементов за раз. Вся обработка происходит прямо в вашем браузере.",
    faq_2_q: "Является ли перемешивание честным?",
    faq_2_a: "Да. Мы используем проверенный временем математический алгоритм Тасования Фишера — Йетса (Fisher-Yates shuffle), который гарантирует получение абсолютно непредвзятых перестановок элементов списка.",
    faq_3_q: "Безопасны ли мои данные?",
    faq_3_a: "Абсолютно. Ваш список никогда не покидает ваше устройство. Вся рандомизация происходит локально в браузере, и никакие данные не отправляются на наши серверы."
  }
}
</i18n>
