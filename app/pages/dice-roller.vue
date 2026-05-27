<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const availableDice = [4, 6, 8, 10, 12, 20, 100]

// Tool State
const state = reactive({ 
    amount: 1, 
    type: 20,
    modifier: 0,
    output: [] as number[], 
    baseTotal: 0,
    total: null as number | null, 
    ads: false,
    isRolling: false 
})

/**
 * Roll the dice
 */
function roll() {
  if (state.amount < 1) state.amount = 1
  if (state.amount > 100) state.amount = 100

  // Always reset output to reflect current dice type during animation
  state.output = Array.from({ length: state.amount }, () => state.type === 6 ? 1 : state.type)

  state.isRolling = true

  setTimeout(() => {
    const results = []
    let baseTotal = 0
    
    for (let i = 0; i < state.amount; i++) {
        const rollValue = Math.floor(Math.random() * state.type) + 1
        results.push(rollValue)
        baseTotal += rollValue
    }
    
    state.output = results
    state.baseTotal = baseTotal
    state.total = baseTotal + (Number(state.modifier) || 0)
    state.isRolling = false

    if(!state.ads){
        state.ads = true
    }
  }, 600)
}

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
        { question: t('faq1q'), answer: t('faq1a') },
        { question: t('faq2q'), answer: t('faq2a') },
        { question: t('faq3q'), answer: t('faq3a') }
    ]
})

useHead({
    title: t('pageTitle'),
    meta: [
        { name: 'description', content: t('meta') }
    ]
})

const faqs = computed(() => [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') },
    { question: t('faq4q'), answer: t('faq4a') }
])

// Localized Routes
defineI18nRoute({
    paths: {
        en: '/dice-roller',
        pt: '/lancador-de-dados',
        es: '/lanzador-de-dados',
        fr: '/lanceur-de-des',
        it: '/lanciatore-di-dadi',
        id: '/lempar-dadu',
        de: '/wuerfelroller',
        nl: '/dobbelsteenroller',
        ru: '/brosit-kubik'
    }
})
</script>

<template>
    <ToolPage
        :title="t('title')"
        :description="t('meta')"
        :show-ads="state.ads"
        :see-also-links="[
            { label: t('see1'), to: 'percentage-calculator' },
            { label: t('see2'), to: 'list-randomizer' },
            { label: t('see3'), to: 'simple-rule-of-three-calculator' },
            { label: t('see4'), to: 'email-extractor' }
        ]"
    >
        <div class="grid lg:grid-cols-2 gap-8 mb-4">
            <!-- Left Column: Controls -->
            <div class="space-y-6">
                <div>
                    <label class="label">
                        <span class="label-text font-bold text-base-content/80">{{ t('dice_type') }}</span>
                    </label>
                    <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        <button 
                            v-for="dType in availableDice" 
                            :key="dType" 
                            @click="state.type = dType" 
                            type="button" 
                            :class="[
                                'btn btn-sm sm:btn-md font-bold transition-all rounded-xl',
                                state.type === dType 
                                    ? 'btn-primary' 
                                    : 'btn-outline border-base-300 hover:border-primary/50'
                            ]"
                        >
                            D{{ dType }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="form-control">
                        <label for="amount" class="label">
                            <span class="label-text font-bold text-base-content/80">{{ t('amount') }}</span>
                        </label> 
                        <input 
                            id="amount" 
                            type="number" 
                            v-model="state.amount" 
                            min="1" 
                            max="100" 
                            class="input input-bordered w-full bg-base-200 focus:bg-base-200 transition-all rounded-xl font-bold" 
                        />
                    </div>

                    <div class="form-control">
                        <label for="modifier" class="label">
                            <span class="label-text font-bold text-base-content/80">{{ t('modifier') }}</span>
                        </label> 
                        <input 
                            id="modifier" 
                            type="number" 
                            v-model="state.modifier" 
                            class="input input-bordered w-full bg-base-200 focus:bg-base-200 transition-all rounded-xl font-bold" 
                        />
                    </div>
                </div>

                <ButtonPrimary 
                    @click="roll" 
                    :disabled="state.isRolling" 
                    icon="heroicons:play-20-solid"
                    class="w-full h-14 text-lg"
                >
                    {{ t('bt') }}
                </ButtonPrimary>
            </div>

            <!-- Right Column: Results -->
            <div class="bg-base-200/50 border border-primary/10 rounded-2xl p-6 min-h-[16rem] flex flex-col items-center justify-center">
                <div v-if="state.total !== null || state.isRolling" class="text-center mb-6">
                    <h2 class="text-3xl font-black text-primary flex items-baseline justify-center gap-2">
                        Total: 
                        <span v-if="!state.isRolling">{{ state.total }}</span>
                        <span v-else class="loading loading-dots loading-md text-primary"></span>
                    </h2>
                    <p v-if="state.modifier !== 0 && !state.isRolling" class="font-medium opacity-80">
                        ({{ state.baseTotal }} {{ state.modifier > 0 ? '+' : '' }}{{ state.modifier }})
                    </p>
                </div>
                
                <div class="flex flex-wrap gap-4 justify-center items-center">
                    <Dice 
                        v-for="(val, i) in state.output" 
                        :key="i" 
                        :type="state.type" 
                        :value="val" 
                        :rolling="state.isRolling" 
                    />
                </div>

                <div v-if="state.total === null && !state.isRolling" class="text-center opacity-70">
                    <Icon name="heroicons:cube-transparent" class="w-16 h-16 mx-auto mb-2" />
                    <p class="font-medium italic">{{ t('ready') }}</p>
                </div>
            </div>
        </div>

        <template #info>
            <div class="space-y-8">
                <p>{{ t('how_desc') }}</p>

                <FeatureSection
                  :title="t('features_title')"
                  :items="[ t('f_1'), t('f_2'), t('f_3'), t('f_4') ]"
                />

                <UseCaseSection
                  :title="t('use_cases_title')"
                  :items="[ t('uc1'), t('uc2'), t('uc3'), t('uc4') ]"
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
                    { question: t('faq1q'), answer: t('faq1a') },
                    { question: t('faq2q'), answer: t('faq2a') },
                    { question: t('faq3q'), answer: t('faq3a') }
                  ]"
                />
            </div>
        </template>
    </ToolPage>
</template>

<i18n lang="yaml">
{
    en: {
        pageTitle: "Online Virtual Dice Roller (D&D / RPG) | Free",
        title: "Virtual Dice Roller",
        meta: "Roll virtual polyhedral dice online instantly with our free simulator. Perfect for D&D, board games, random events, or whenever you need a quick reliable d20 or d6 dice roller.",
        f_1: "Generate random numbers for D4 to D100",
        f_2: "Add flat modifiers to the final roll",
        f_3: "Instant sum and physics-like animated results",
        f_4: "100% free with no downloads required",
        features_title: "Features",
        how_to_use_title: "How to use",
        how_desc: "This tool generates highly random outcomes utilizing standard cryptography-strength math functions found in modern browsers. It perfectly simulates classic tabletop physical polyhedral dice (D4, D6, D8, D10, D12, D20, and D100).",
        step_1_title: "Select Dice Type",
        step_1_desc: "Choose from standard D4, D6, D8, D10, D12, D20, or D100 dice from the selection menu.",
        step_2_title: "Configure Roll",
        step_2_desc: "Set the number of dice to roll (up to 100) and add any optional modifiers required by your game rules.",
        step_3_title: "Roll and Result",
        step_3_desc: "Click 'Roll Dice' to see animated results and the calculated sum total instantly.",
        use_cases_title: "Use Cases",
        uc1: "Playing Tabletop Roleplaying Games (TTRPGs) like D&D, Pathfinder, Call of Cthulhu, etc without physical dice at hand.",
        uc2: "Generating stats for new tabletop characters (e.g., rolling 4d6 to obtain strength and dexterity).",
        uc3: "Speeding up heavy damage rolls where calculating the sum of 10 or 20 dice mentally is time consuming.",
        uc4: "Casual board games, educational probability training, or just deciding who pays for dinner.",
        faq_title: "Questions & Answers",
        faq1q: "Is this online dice roller truly random?",
        faq1a: "Yes. Our tool relies on robust pseudorandom number generators built into modern web browsers, ensuring a fair distribution that matches the behavior of physical dice precisely — with no hidden weights or biased outcomes.",
        faq2q: "Can I roll multiple dice at once (like 4d6)?",
        faq2a: "Absolutely. Simply change the 'Number of Dice' field to whatever quantity you require. The simulator will cast all of them simultaneously and automatically calculate the sum total for your convenience.",
        faq3q: "What does the 'Modifier' field do?",
        faq3a: "In RPGs, you often need to attach a flat bonus or penalty to your roll (like 1d20 + 4). By adding a value to the Modifier field, the engine automatically considers this math operation in the final 'Total' output.",
        dice_type: "Dice Type",
        amount: "Number of Dice",
        modifier: "Modifier (+/-)",
        bt: "Roll Dice",
        ready: "Ready to roll",
        see1: "Percentage",
        see2: "List Randomizer",
        see3: "Rule of Three",
        see4: "Email Extractor"
    },
    pt: {
        pageTitle: "Dado Virtual Online - Lançador de Dados para RPG e D&D | Grátis",
        title: "Dado Virtual",
        meta: "Dado virtual online grátis. Simulador perfeito para RPG, D&D e jogos de tabuleiro, com dados poliedrais D4, D6, D8, D10, D12, D20 e D100.",
        f_1: "Gere números aleatórios de D4 a D100",
        f_2: "Adicione modificadores fixos ao resultado final",
        f_3: "Soma instantânea e resultados animados",
        f_4: "100% gratuito, sem necessidade de download",
        features_title: "Funcionalidades",
        how_to_use_title: "Como usar",
        how_desc: "Esta ferramenta gera resultados altamente aleatórios utilizando funções matemáticas seguras nativas dos navegadores modernos. Ela simula perfeitamente os pesos físicos e probabilidades dos clássicos dados poliedrais.",
        step_1_title: "Selecione o Tipo de Dado",
        step_1_desc: "Escolha entre os dados padrão D4, D6, D8, D10, D12, D20 ou D100 no menu de seleção.",
        step_2_title: "Configure a Rolagem",
        step_2_desc: "Defina a quantidade de dados a serem rolados (até 100) e adicione modificadores opcionais exigidos pelas regras.",
        step_3_title: "Role e Veja o Resultado",
        step_3_desc: "Clique em 'Rolar Dados' para ver os resultados animados e o somatório total calculado instantaneamente.",
        use_cases_title: "Casos de Uso",
        uc1: "Jogar RPG de mesa como Dungeons & Dragons ou Pathfinder rapidamente pelo celular.",
        uc2: "Gerar atributos na criação de personagens, simplificando rolagens repetidas de 4d6.",
        uc3: "Agilizar o cálculo de feitiços colossais com dezenas de dados simultâneos.",
        uc4: "Partidas clássicas de banco imobiliário ou tomada de decisões aleatórias.",
        faq_title: "Perguntas e Respostas",
        faq1q: "O lançamento online é realmente aleatório?",
        faq1a: "Sim. Nossa ferramenta recorre aos geradores robustos de números pseudo-aleatórios fornecidos nativamente pelo seu navegador, garantindo uma distribuição justa equivalente a um dado real.",
        faq2q: "Posso lançar múltiplos dados ao mesmo tempo?",
        faq2a: "Com certeza. Basta alterar o campo de 'Quantidade de Dados'. O simulador jogará todos simultaneamente e calculará o somatório total para você.",
        faq3q: "Para que serve o campo 'Modificador'?",
        faq3a: "Em RPGs, costuma-se atrelar bônus (ex: 1d20 + 4). Ao preencher este campo, o motor aplica a operação automaticamente no resultado final.",
        dice_type: "Tipo de Dado",
        amount: "Quantidade de Dados",
        modifier: "Modificador (+/-)",
        bt: "Rolar Dados",
        ready: "Pronto para rolar",
        see1: "Porcentagem",
        see2: "Sorteador de Listas",
        see3: "Regra de Três",
        see4: "Extrator de E-mails"
    },
    es: {
        pageTitle: "Dados Virtuales Online - Lanzador de Dados para Rol y D&D | Gratis",
        title: "Dados Virtuales",
        meta: "Dados virtuales gratis online. Simulador perfecto para RPG, D&D y juegos de mesa con dados poliedros D4, D6, D8, D10, D12, D20 y D100.",
        f_1: "Genera números aleatorios de D4 a D100",
        f_2: "Añade modificadores fijos al resultado final",
        f_3: "Suma instantánea y resultados animados",
        f_4: "100% gratis, sin necesidad de descarga",
        features_title: "Funcionalidades",
        how_to_use_title: "Cómo usar",
        how_desc: "Esta herramienta genera resultados altamente aleatorios utilizando funciones criptográficas matemáticamente seguras del navegador moderno permitiéndole simular idénticamente la física de cualquier dado poliédrico.",
        step_1_title: "Seleccione el Tipo de Dado",
        step_1_desc: "Elija entre los dados estándar D4, D6, D8, D10, D12, D20 o D100 en el menú de selección.",
        step_2_title: "Configure el Lanzamiento",
        step_2_desc: "Defina la cantidad de dados a lanzar (hasta 100) y agregue cualquier modificador opcional requerido.",
        step_3_title: "Lance y Vea el Resultado",
        step_3_desc: "Haga clic en 'Lanzar Dados' para ver los resultados animados y la suma total calculada al instante.",
        use_cases_title: "Casos de Uso",
        uc1: "Disfrutar de juegos de rol (TTRPGs) como Dungeons & Dragons cuando no hay dados físicos.",
        uc2: "Construcción rápida de atributos del personaje calculando sumas de alto volumen.",
        uc3: "Agilizar los ataques en combates densos donde hay que contabilizar múltiples dados.",
        uc4: "Juegos de mesa diarios, resolver dilemas domésticos y ejercicios didácticos.",
        faq_title: "Preguntas y Respuestas",
        faq1q: "¿El lanzamiento es verdaderamente aleatorio?",
        faq1a: "Sí. La herramienta utiliza los generadores pseudoaleatorios nativos del navegador, lo que garantiza una distribución de resultados completamente equitativa.",
        faq2q: "¿Puedo lanzar varios a la vez?",
        faq2a: "Claro que sí. Modifica el campo 'Cantidad de Dados' y la plataforma lanzará todos al mismo tiempo y sumará automáticamente los valores.",
        faq3q: "¿Qué función cumple el espacio de 'Modificador (+/-)'?",
        faq3a: "En RPGs cada lanzamiento puede tener un bonus (Ej: 1D20 + 4). Esta caja absorbe tu número y devuelve la suma total en tiempo real.",
        dice_type: "Tipo de Dado",
        amount: "Cantidad de Dados",
        modifier: "Modificador (+/-)",
        bt: "Lanzar Dados",
        ready: "Listo para lanzar",
        see1: "Porcentaje",
        see2: "Aleatorizador de Listas",
        see3: "Regla de Tres",
        see4: "Extractor de Emails"
    },
    fr: {
        pageTitle: "Dé Virtuel en Ligne (JDR & D&D) — Simulateur Polyédrique",
        title: "Lanceur de Dés",
        meta: "Lancez des dés virtuels polyédriques en ligne. Simulateur de dés gratuit parfait pour les jeux de rôle, D&D, et jeux de société avec D4, D6, D10, D20.",
        f_1: "Générez des nombres aléatoires de D4 à D100",
        f_2: "Ajoutez des modificateurs fixes au résultat",
        f_3: "Somme instantanée et résultats animés",
        f_4: "100% gratuit, sans téléchargement",
        features_title: "Fonctionnalités",
        how_to_use_title: "Comment utiliser",
        how_desc: "Cet outil simule parfaitement les dés de jeu classiques grâce aux technologies de calcul pseudo-aléatoire internes de votre navigateur. Il intègre tous les dés polyédriques standards.",
        step_1_title: "Sélectionnez le Type de Dé",
        step_1_desc: "Choisissez parmi les dés standards D4, D6, D8, D10, D12, D20 ou D100 dans le menu de sélection.",
        step_2_title: "Configurez le Lancer",
        step_2_desc: "Définissez le nombre de dés à lancer (jusqu'à 100) et ajoutez d'éventuels modificateurs optionnels.",
        step_3_title: "Lancez et Résultat",
        step_3_desc: "Cliquez sur 'Lancer Dés' pour voir les résultats animés et le total calculé instantanément.",
        use_cases_title: "Cas d'Utilisation",
        uc1: "Remplacer l'absence de dés physiques en cours de parties de Donjons et Dragons ou Pathfinder.",
        uc2: "Déterminer des jets complexes comme la création initiale d'aptitudes via du classique 4d6.",
        uc3: "Résoudre presque instantanément le calcul de gros dégâts évitant la charge mentale.",
        uc4: "Décider une situation hasardeuse du quotidien ou dynamiser les jeux familiaux.",
        faq_title: "Questions et Réponses",
        faq1q: "Ce simulateur est-il 100% aléatoire ?",
        faq1a: "Oui. Le lancer dépend de la génération sécurisée native du navigateur évitant les défauts mécaniques du matériel.",
        faq2q: "Peut-on jouer un lot de dés ?",
        faq2a: "Définitivement ! Renseignez tout simplement votre 'Nombre de dés' et l'application jettera l'ensemble.",
        faq3q: "Pourquoi utiliser un modificateur ?",
        faq3a: "En JDR, la mécanique demande souvent un bonus inné (ex: 1d20+5). L'interface intégrera d'office cette mathématique au rendu final.",
        dice_type: "Type de dé",
        amount: "Nombre de Dés",
        modifier: "Modificateur (+/-)",
        bt: "Lancer Dés",
        ready: "Prêt à lancer",
        see1: "Pourcentage",
        see2: "Mélangeur de Listes",
        see3: "Règle de Trois",
        see4: "Extracteur d'Emails"
    },
    it: {
        pageTitle: "Dado Virtuale Online per GDR e D&D (D20, D6) | Gratis",
        title: "Dado Virtuale",
        meta: "Lancia dadi virtuali poliedrici. Usa il simulatore gratuito per giochi di ruolo (D4, D6, D8, D10, D12, D20) e calcola i tuoi tiri.",
        f_1: "Genera numeri casuali da D4 a D100",
        f_2: "Aggiungi modificatori fissi al risultato",
        f_3: "Somma istantanea e risultati animati",
        f_4: "100% gratuito, senza installazione",
        features_title: "Funzionalità",
        how_to_use_title: "Come usare",
        how_desc: "Utilizziamo l'algoritmo di calcolo nativo del tuo browser per offrire risultati pseudo-casuali estremamente equi, simulando meticolosamente l'uso di veri dadi poliedrici.",
        step_1_title: "Seleziona il Tipo di Dado",
        step_1_desc: "Scegli tra i dadi standard D4, D6, D8, D10, D12, D20 o D100 dal menu di selezione.",
        step_2_title: "Configura il Lancio",
        step_2_desc: "Imposta il numero di dadi da lanciare (fino a 100) e aggiungi eventuali modificatori opzionali.",
        step_3_title: "Lancia e Risultato",
        step_3_desc: "Clicca su 'Lancia Dadi' per vedere i risultati animati e il totale calcolato istantaneamente.",
        use_cases_title: "Casi d'Uso",
        uc1: "Masterizzare sessioni di D&D e Pathfinder in mobilità senza dadi fisici.",
        uc2: "Creazione rapida delle schede calcolando tiri voluminosi di 4d6 consecutivamente.",
        uc3: "Agevolare le risoluzioni in arene di scontro smaltendo la somma cumulativa.",
        uc4: "Intrattenimento ordinario o sbroglio di decisioni affidandosi alla pura fortuna.",
        faq_title: "Domande e Risposte",
        faq1q: "È affidabile o trucca i risultati?",
        faq1a: "Sì. Il simulatore utilizza i generatori pseudocasuali nativi del browser per garantire una distribuzione equa dei risultati.",
        faq2q: "È concepito per lanciarne a dozzine contemporaneamente?",
        faq2a: "Certo che sì. Immettendo il valore nel numero dei dadi l'applicativo fa rimbalzare tutte le richieste e ne stampa il risultato finale.",
        faq3q: "Che significato ha il Modificatore (+/-)?",
        faq3a: "Nei GDR ad un evento basico occorre addizionare la bravura dell'eroe (Ex: D20 + 4). Lo script chiuderà la somma regalandoti il totale finale.",
        dice_type: "Tipo di Dado",
        amount: "Numero di Dadi",
        modifier: "Modificatore (+/-)",
        bt: "Lancia Dadi",
        ready: "Pronto a lanciare",
        see1: "Percentuale",
        see2: "Randomizzatore di Liste",
        see3: "Regola di Tre",
        see4: "Estrattore di Email"
    },
    id: {
        pageTitle: "Pelempar Dadu Virtual Online (RPG / D&D) | Gratis",
        title: "Dadu Virtual",
        meta: "Lempar dadu poliedrik virtual online secara instan. Cocok untuk permainan peran (RPG), D&D, acara acak, dengan dadu D4, D6, D20.",
        f_1: "Hasilkan angka acak dari D4 hingga D100",
        f_2: "Tambahkan modifikator tetap ke hasil akhir",
        f_3: "Jumlah instan dan hasil animasi",
        f_4: "100% gratis, tanpa unduhan",
        features_title: "Fitur",
        how_to_use_title: "Cara menggunakan",
        how_desc: "Alat ini menyajikan hasil yang benar-benar acak dengan bantuan fungsi matematika bawaan peramban internet modern yang menyimulasikan hukum lemparan dadu fisik klasik secara sangat presisi.",
        step_1_title: "Pilih Jenis Dadu",
        step_1_desc: "Pilih dari dadu standar D4, D6, D8, D10, D12, D20, atau D100 dari menu pilihan.",
        step_2_title: "Konfigurasi Lemparan",
        step_2_desc: "Atur jumlah dadu yang akan dilempar (hingga 100) dan tambahkan modifikator opsional apa pun.",
        step_3_title: "Lempar dan Hasil",
        step_3_desc: "Klik 'Lempar Dadu' untuk melihat hasil animasi dan total jumlah yang dihitung secara instan.",
        use_cases_title: "Contoh Penggunaan",
        uc1: "Pengganti praktis kala set fisik tidak tersedia untuk petualangan kampanye meja.",
        uc2: "Mempercepat lemparan awal untuk membangun status karakter (4d6).",
        uc3: "Memberi total perhitungan pada efek kerusakan magis berantai.",
        uc4: "Pemutus keraguan umum hingga pemutaran undian biasa.",
        faq_title: "Tanya Jawab",
        faq1q: "Apakah angka keluaran ini adil?",
        faq1a: "Iya, murni adil tanpa pemberat. Alat ini mengacu pada penghasil bilik semu acak canggih bawaan peramban.",
        faq2q: "Bolehkah saya menggelindingkan lusinan keping?",
        faq2a: "Sangat diperbolehkan. Sesuaikan kuantitas Anda, ia akan memutar serentak dan menggabungkan hasil bulat total.",
        faq3q: "Bagian 'Modifikator (+/-)' difungsikan sebagai apa?",
        faq3a: "Demi menyesuaikan formula pertempuran di mana lemparan Anda dijumlah bersama nilai karakter (Misal 1D20 + 3).",
        dice_type: "Jenis Dadu",
        amount: "Jumlah Dadu",
        modifier: "Modifikator (+/-)",
        bt: "Lempar Dadu",
        ready: "Siap melempar",
        see1: "Persentase",
        see2: "Pengacak Daftar",
        see3: "Aturan Tiga",
        see4: "Ekstraktor Email"
    },
    de: {
        pageTitle: "Würfel Online - Virtueller Würfelsimulator für D&D und RPG | Kostenlos",
        title: "Würfel Online",
        meta: "Würfel online kostenlos. Virtueller Würfelsimulator perfekt für D&D, Brettspiele und Zufallsereignisse, mit polyedrischen Würfeln D4, D6, D8, D10, D12, D20 und D100.",
        f_1: "Zufallszahlen von D4 bis D100 erzeugen",
        f_2: "Feste Modifikatoren zum Endwurf hinzufügen",
        f_3: "Sofortige Summe und animierte Ergebnisse",
        f_4: "100% kostenlos, ohne Download",
        features_title: "Funktionen",
        how_to_use_title: "So verwendest du das Tool",
        how_desc: "Dieses Tool erzeugt sehr zufällige Ergebnisse mit modernen mathematischen Zufallsfunktionen im Browser. Es simuliert klassische polyedrische Tischwürfel wie D4, D6, D8, D10, D12, D20 und D100.",
        step_1_title: "Würfeltyp auswählen",
        step_1_desc: "Wähle Standardwürfel wie D4, D6, D8, D10, D12, D20 oder D100 aus der Auswahl.",
        step_2_title: "Wurf konfigurieren",
        step_2_desc: "Lege die Anzahl der Würfel fest (bis zu 100) und füge optionale Modifikatoren hinzu, die deine Spielregeln erfordern.",
        step_3_title: "Würfeln und Ergebnis",
        step_3_desc: "Klicke auf 'Würfeln', um animierte Ergebnisse und die berechnete Gesamtsumme sofort zu sehen.",
        use_cases_title: "Anwendungsfälle",
        uc1: "Tischrollenspiele (TTRPGs) wie D&D, Pathfinder oder Call of Cthulhu spielen, wenn keine echten Würfel zur Hand sind.",
        uc2: "Werte für neue Tischrollenspiel-Charaktere erzeugen, zum Beispiel mit 4W6 für Stärke oder Geschicklichkeit.",
        uc3: "Große Schadenswürfe beschleunigen, bei denen das Kopfrechnen mit 10 oder 20 Würfeln zeitaufwendig ist.",
        uc4: "Brettspiele, Wahrscheinlichkeitstraining oder spontane Entscheidungen im Alltag.",
        faq_title: "Fragen und Antworten",
        faq1q: "Ist dieser Online-Würfelroller wirklich zufällig?",
        faq1a: "Ja. Das Tool nutzt robuste Pseudozufallszahlengeneratoren moderner Webbrowser und liefert eine faire Verteilung ohne versteckte Gewichtung oder voreingenommene Ergebnisse.",
        faq2q: "Kann ich mehrere Würfel gleichzeitig werfen, zum Beispiel 4W6?",
        faq2a: "Ja. Ändere einfach das Feld 'Anzahl der Würfel' auf die benötigte Menge. Der Simulator würfelt alle gleichzeitig und berechnet automatisch die Gesamtsumme.",
        faq3q: "Wofür ist das Feld 'Modifikator'?",
        faq3a: "In RPGs braucht man oft einen festen Bonus oder Malus zum Wurf, etwa 1W20 + 4. Mit dem Modifikator wird dieser Wert automatisch in die Gesamtsumme eingerechnet.",
        dice_type: "Würfeltyp",
        amount: "Anzahl der Würfel",
        modifier: "Modifikator (+/-)",
        bt: "Würfeln",
        ready: "Bereit zum Würfeln",
        see1: "Prozentrechner",
        see2: "Listen-Zufallsgenerator",
        see3: "Dreisatzrechner",
        see4: "E-Mail-Extraktor"
    },
    nl: {
        pageTitle: "Dobbelsteen Online - Virtuele Dobbelsteensimulator voor D&D en RPG | Gratis",
        title: "Dobbelsteen Online",
        meta: "Dobbelsteen online gratis. Virtuele dobbelsteensimulator perfect voor D&D, bordspellen en willekeurige gebeurtenissen, met polyedrische dobbelstenen D4, D6, D8, D10, D12, D20 en D100.",
        f_1: "Genereer willekeurige getallen van D4 tot D100",
        f_2: "Voeg vaste modifiers toe aan de uiteindelijke worp",
        f_3: "Directe som en geanimeerde resultaten",
        f_4: "100% gratis zonder downloads vereist",
        features_title: "Functies",
        how_to_use_title: "Hoe te gebruiken",
        how_desc: "Deze tool genereert zeer willekeurige uitkomsten met behulp van standaard cryptografische rekenfuncties in moderne browsers. Het simuleert perfect de klassieke fysieke polyedrische dobbelstenen (D4, D6, D8, D10, D12, D20 en D100).",
        step_1_title: "Selecteer dobbelsteentype",
        step_1_desc: "Kies uit standaard D4, D6, D8, D10, D12, D20 of D100 dobbelstenen uit het keuzemenu.",
        step_2_title: "Worp configureren",
        step_2_desc: "Stel het aantal te werpen dobbelstenen in (tot 100) en voeg eventuele optionele modifiers toe.",
        step_3_title: "Werpen en resultaat",
        step_3_desc: "Klik op 'Dobbelstenen werpen' om direct de geanimeerde resultaten en de berekende som te zien.",
        use_cases_title: "Gebruiksvoorbeelden",
        uc1: "Het spelen van tafelrollenspellen (TTRPG's) zoals D&D of Pathfinder zonder fysieke dobbelstenen bij de hand.",
        uc2: "Het genereren van statistieken voor nieuwe personages (bijv. 4d6 werpen voor kracht en behendigheid).",
        uc3: "Het versnellen van zware schadeworpen waarbij het handmatig berekenen van de som tijdrovend is.",
        uc4: "Gewone bordspellen, educatieve waarschijnlijkheidstraining of beslissen wie het diner betaalt.",
        faq_title: "Vragen & Antwoorden",
        faq1q: "Is deze online dobbelsteenroller echt willekeurig?",
        faq1a: "Ja. Onze tool vertrouwt op robuuste pseudowillekeurige getallengeneratoren die in moderne webbrowsers zijn ingebouwd, wat zorgt voor een eerlijke verdeling.",
        faq2q: "Kan ik meerdere dobbelstenen tegelijk werpen?",
        faq2a: "Absoluut. Verander gewoon het veld 'Aantal dobbelstenen'. De simulator werpt ze allemaal tegelijkertijd en berekent automatisch de som.",
        faq3q: "Wat doet het veld 'Modifier'?",
        faq3a: "In RPG's moet je vaak een vaste bonus of straf toevoegen (zoals 1d20 + 4). De engine houdt automatisch rekening met deze bewerking in het totaal.",
        dice_type: "Dobbelsteentype",
        amount: "Aantal dobbelstenen",
        modifier: "Modifier (+/-)",
        bt: "Dobbelstenen werpen",
        ready: "Klaar om te werpen",
        see1: "Percentagecalculator",
        see2: "Lijst-randomizer",
        see3: "Regel-van-drie-calculator",
        see4: "E-mailextractor"
    },
    ru: {
        pageTitle: "Виртуальные кубики онлайн — бросить кости для RPG и D&D | Бесплатно",
        title: "Виртуальные кубики",
        meta: "Бросайте виртуальные многогранные кубики онлайн с помощью нашего бесплатного симулятора. Отлично подходит для D&D, настольных игр, случайных событий или когда нужен надежный d20 или d6.",
        f_1: "Генерация случайных чисел для кубиков от D4 до D100",
        f_2: "Добавление плоских модификаторов к итоговому броску",
        f_3: "Мгновенное суммирование и анимированные результаты броска",
        f_4: "100% бесплатно, без необходимости скачивания",
        features_title: "Возможности",
        how_to_use_title: "Инструкция",
        how_desc: "Этот инструмент генерирует случайные результаты с использованием надежных криптографически стойких математических функций вашего браузера. Он идеально имитирует классические настольные многогранные кубики (D4, D6, D8, D10, D12, D20 и D100).",
        step_1_title: "Выберите тип кубика",
        step_1_desc: "Выберите стандартный кубик D4, D6, D8, D10, D12, D20 или D100 в меню выбора.",
        step_2_title: "Настройте бросок",
        step_2_desc: "Укажите количество кубиков для броска (до 100) и добавьте любые модификаторы в соответствии с правилами вашей игры.",
        step_3_title: "Бросьте и получите результат",
        step_3_desc: "Нажмите кнопку «Бросить кубики», чтобы увидеть анимацию броска и мгновенно получить итоговую сумму.",
        use_cases_title: "Варианты использования",
        uc1: "Игра в настольные ролевые игры (TTRPG), такие как D&D, Pathfinder, Call of Cthulhu и др., когда под рукой нет физических кубиков.",
        uc2: "Генерация характеристик новых персонажей (например, бросок 4d6 для определения силы, ловкости и т.д.).",
        uc3: "Ускорение бросков с большим количеством кубиков урона, когда подсчет суммы 10 или 20 кубиков вручную занимает много времени.",
        uc4: "Обычные настольные игры, обучение теории вероятностей или простой способ решить, кто сегодня платит за ужин.",
        faq_title: "Вопросы и ответы",
        faq1q: "Является ли этот онлайн-бросатель кубиков действительно случайным?",
        faq1a: "Да. Наш инструмент использует надежные генераторы псевдослучайных чисел, встроенные в современные веб-браузеры. Это гарантирует честное распределение, в точности соответствующее поведению физических кубиков, без каких-либо скрытых весов или предвзятых результатов.",
        faq2q: "Могу ли я бросить несколько кубиков одновременно (например, 4d6)?",
        faq2a: "Конечно. Просто укажите необходимое количество в поле «Количество кубиков». Симулятор бросит их все одновременно и автоматически посчитает общую сумму для вашего удобства.",
        faq3q: "Что делает поле «Модификатор»?",
        faq3a: "В ролевых играх к броску часто требуется добавить плоский бонус или штраф (например, 1d20 + 4). При указании значения в поле «Модификатор» калькулятор автоматически применит это математическое действие к итоговому результату.",
        dice_type: "Тип кубика",
        amount: "Количество кубиков",
        modifier: "Модификатор (+/-)",
        bt: "Бросить кубики",
        ready: "Готово к броску",
        see1: "Калькулятор процентов",
        see2: "Рандомизатор списков",
        see3: "Правило трех",
        see4: "Экстрактор email"
    }
}
</i18n>
