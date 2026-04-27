<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })

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
        id: '/lempar-dadu'
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
                    <p class="font-medium italic">{{ locale === 'pt' ? 'Pronto para rolar' : 'Ready to roll' }}</p>
                </div>
            </div>
        </div>

        <template #info>
            <div class="space-y-8">
                <section>
                    <h2 class="text-2xl font-bold mb-3 flex items-center gap-2">
                        <Icon name="heroicons:information-circle-20-solid" class="w-6 h-6 text-primary" />
                        {{ t('how_title') }}
                    </h2>
                    <p>{{ t('how_desc') }}</p>
                </section>

                <section>
                    <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Icon name="heroicons:check-badge-20-solid" class="w-6 h-6 text-primary" />
                        {{ t('usecases_title') }}
                    </h2>
                    <ul class="grid sm:grid-cols-2 gap-3">
                        <li v-for="i in 4" :key="i" class="flex items-start gap-2 bg-base-200/40 p-3 rounded-xl border border-primary/20">
                            <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 text-success shrink-0 mt-0.5" />
                            <span>{{ t(`uc${i}`) }}</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Icon name="heroicons:question-mark-circle-20-solid" class="w-6 h-6 text-primary" />
                        {{ t('faq_title') }}
                    </h2>
                    <div class="space-y-4">
                        <div v-for="i in 3" :key="i" class="collapse collapse-plus bg-base-200/50 rounded-2xl border border-base-300">
                            <input type="radio" name="dice-faq" :aria-label="t(`faq${i}q`)" /> 
                            <div class="collapse-title text-lg font-bold">
                                {{ t(`faq${i}q`) }}
                            </div>
                            <div class="collapse-content"> 
                                <p>{{ t(`faq${i}a`) }}</p>
                            </div>
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
        pageTitle: "Online Virtual Dice Roller (D&D / RPG) | Free",
        title: "Virtual Dice Roller",
        meta: "Roll virtual polyhedral dice online instantly with our free simulator. Perfect for D&D, board games, random events, or whenever you need a quick reliable d20 or d6 dice roller.",
        f_1: "Generate random numbers for D4 to D100",
        f_2: "Add flat modifiers to the final roll",
        f_3: "Instant sum and physics-like animated results",
        f_4: "100% free with no downloads required",
        how_title: "How the Virtual Dice Roller Works",
        how_desc: "This tool generates highly random outcomes utilizing standard cryptography-strength math functions found in modern browsers. It perfectly simulates classic tabletop physical polyhedral dice (D4, D6, D8, D10, D12, D20, and D100) combining the exact probability distributions needed for flawless Dungeons and Dragons campaigns or regular board gaming. You can throw multiple dice at once and include any number modifiers required by your attributes.",
        usecases_title: "Common Applications",
        uc1: "Playing Tabletop Roleplaying Games (TTRPGs) like D&D, Pathfinder, Call of Cthulhu, etc without physical dice at hand.",
        uc2: "Generating stats for new tabletop characters (e.g., rolling 4d6 to obtain strength and dexterity).",
        uc3: "Speeding up heavy damage rolls where calculating the sum of 10 or 20 dice mentally is time consuming.",
        uc4: "Casual board games, educational probability training, or just deciding who pays for dinner.",
        faq_title: "Frequently Asked Questions",
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
        see1: "Percentage Calculator",
        see2: "List Randomizer",
        see3: "Rule of Three",
        see4: "Email Extractor"
    },
    pt: {
        pageTitle: "Dado Virtual Online e Lançador de RPG (D20, D6) | Grátis",
        title: "Lançador de Dados",
        meta: "Jogue dados virtuais online grátis. Simulador perfeito para RPG, D&D, jogos de tabuleiro, contendo dados poliedrais D4, D6, D8, D10, D12, D20.",
        f_1: "Gere números aleatórios de D4 a D100",
        f_2: "Adicione modificadores fixos ao resultado final",
        f_3: "Soma instantânea e resultados animados",
        f_4: "100% gratuito, sem necessidade de download",
        how_title: "Como funciona o Lançador de Dados",
        how_desc: "Esta ferramenta gera resultados altamente aleatórios utilizando funções matemáticas seguras nativas dos navegadores modernos. Ela simula perfeitamente os pesos físicos e probabilidades dos clássicos dados poliedrais de RPG de mesa (D4, D6, D8, D10, D12, D20 e D100). Você pode rolar incontáveis dados simultaneamente e incluir modificadores (+ e -) exigidos pelas acrobacias de seus personagens para facilitar toda a matemática da partida.",
        usecases_title: "Casos de Uso Comuns",
        uc1: "Jogar RPG de mesa como Dungeons & Dragons ou Pathfinder rapidamente pelo celular.",
        uc2: "Gerar atributos na criação de personagens, simplificando rolagens repetidas de 4d6.",
        uc3: "Agilizar o cálculo de feitiços colossais com dezenas de dados simultâneos.",
        uc4: "Partidas clássicas de banco imobiliário ou tomada de decisões aleatórias.",
        faq_title: "Perguntas Frequentes",
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
        see1: "Calculadora de Porcentagem",
        see2: "Sorteador de Listas",
        see3: "Regra de Três",
        see4: "Extrator de E-mails"
    },
    es: {
        pageTitle: "Dado Virtual Online y Lanzador de Rol (D20, D6) | Gratis",
        title: "Lanzador de Dados Virtual",
        meta: "Lanza dados virtuales gratis online. Simulador perfecto para RPG, D&D y juegos de mesa con dados poliedros D4, D6, D8, D10, D12, D20 y D100.",
        f_1: "Genera números aleatorios de D4 a D100",
        f_2: "Añade modificadores fijos al resultado final",
        f_3: "Suma instantánea y resultados animados",
        f_4: "100% gratis, sin necesidad de descarga",
        how_title: "Cómo funciona el Lanzador Virtual de Dados",
        how_desc: "Esta herramienta genera resultados altamente aleatorios utilizando funciones criptográficas matemáticamente seguras del navegador moderno permitiéndole simular idénticamente la física de cualquier dado de dados poliédricos clásicos (D4, D6, D8, D10, D12, D20 y D100). Sirve tanto como emulador vitalicio de combinaciones de juegos como Dungeons & Dragons así como para solucionar mecánicas de juego en segundos añadiendo cualquier modificador que apliquen los atributos de tu personaje en la ficha.",
        usecases_title: "Casos de Uso Comunes",
        uc1: "Disfrutar de juegos de rol (TTRPGs) como Dungeons & Dragons cuando no hay dados físicos.",
        uc2: "Construcción rápida de atributos del personaje calculando sumas de alto volumen.",
        uc3: "Agilizar los ataques en combates densos donde hay que contabilizar múltiples dados.",
        uc4: "Juegos de mesa diarios, resolver dilemas domésticos y ejercicios didácticos.",
        faq_title: "Preguntas Frecuentes",
        faq1q: "¿El lanzamiento es verdaderamente aleatorio?",
        faq1a: "Sí. La herramienta utiliza los generadores pseudoaleatorios nativos del navegador, lo que garantiza una distribución de resultados completamente equitativa.",
        faq2q: "¿Puedo lanzar varios a la vez?",
        faq2a: "Claro que sí. Modifica el campo 'Cantidad de Dados' y la plataforma lanzará todos al mismo tiempo y sumará automáticamente los valores.",
        faq3q: "¿Qué función cumple el espacio de 'Modificador (+/-)'?",
        faq3a: "En RPGs cada lanzamiento puede tener un bônus (Ej: 1D20 + 4). Esta caja absorbe tu número y devuelve la suma total en tiempo real.",
        dice_type: "Tipo de Dado",
        amount: "Cantidad de Dados",
        modifier: "Modificador (+/-)",
        bt: "Lanzar Dados",
        see1: "Calculadora de Porcentaje",
        see2: "Aleatorizador de Listas",
        see3: "Regra de Tres",
        see4: "Extractor de Correos Electrónicos"
    },
    fr: {
        pageTitle: "Dé Virtuel en Ligne (JDR & D&D) — Simulateur Polyédrique",
        title: "Lanceur de Dés",
        meta: "Lancez des dés virtuels polyédriques en ligne. Simulateur de dés gratuit parfait pour les jeux de rôle, D&D, et jeux de société avec D4, D6, D10, D20.",
        f_1: "Générez des nombres aléatoires de D4 à D100",
        f_2: "Ajoutez des modificateurs fixes au résultat",
        f_3: "Somme instantanée et résultats animés",
        f_4: "100% gratuit, sans téléchargement",
        how_title: "Comment fonctionne le dé en ligne",
        how_desc: "Cet outil simule parfaitement les dés de jeu classiques grâce aux technologies de calcul pseudo-aléatoire internes de votre navigateur. En intégrant des dés polyédriques (D4, D6, D8, D10, D12, D20, D100), il permet de répondre aux besoins exigeants des campagnes de jeux de rôle ou des parties amicales. Vous pouvez ajouter des quantités multiples et inclure un ajustement chiffré (modificateur).",
        usecases_title: "Applications courantes",
        uc1: "Remplacer l'absence de dés physiques en cours de parties de Donjons et Dragons ou Pathfinder.",
        uc2: "Déterminer des jets complexes comme la création initiale d'aptitudes via du classique 4d6.",
        uc3: "Résoudre presque instantanément le calcul de gros dégâts évitant la charge mentale.",
        uc4: "Décider une situation hasardeuse du quotidien ou dynamiser les jeux familiaux.",
        faq_title: "Questions Fréquentes",
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
        see1: "Calculatrice de Pourcentage",
        see2: "Mélangeur de Listes",
        see3: "Règle de Trois",
        see4: "Extracteur d'e-mails"
    },
    it: {
        pageTitle: "Dado Virtuale Online per GDR e D&D (D20, D6) | Gratis",
        title: "Dado Virtuale",
        meta: "Lancia dadi virtuali poliedrici. Usa il simulatore gratuito per giochi di ruolo (D4, D6, D8, D10, D12, D20) e calcola i tuoi tiri.",
        f_1: "Genera numeri casuali da D4 a D100",
        f_2: "Aggiungi modificatori fissi al risultato",
        f_3: "Somma istantanea e risultati animati",
        f_4: "100% gratuito, senza installazione",
        how_title: "Come Funziona il Dado Virtuale",
        how_desc: "Utilizziamo l'algoritmo di calcolo nativo del tuo browser per offrire risultati pseudo-casuali estremamente giusti simulando meticolosamente l'uso di veri e propri dadi di plastica sul tavolo. L'applicazione ingloba il set completo di dadi poliedrici richiesti per il Role Playing Game (D4, D6, D8, D10, D12, D20 e D100) dandovi flessibilità totale di raggruppamento e somministrazione di modificatori di gioco automatici.",
        usecases_title: "Casi d'Uso Tipici",
        uc1: "Masterizzare sessioni di D&D e Pathfinder in mobilità senza dadi fisici.",
        uc2: "Creazione rapida delle schede calcolando tiri voluminosi di 4d6 consecutivamente.",
        uc3: "Agevolare le risoluzioni in arene di scontro smaltendo la somma cumulativa.",
        uc4: "Intrattenimento ordinario o sbroglio di decisioni affidandosi alla pura fortuna.",
        faq_title: "Domande Frequenti",
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
        see1: "Calcolatrice di Percentuale",
        see2: "Generatore di Liste Casuali",
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
        how_title: "Cara Kerja Dadu Virtual",
        how_desc: "Alat ini menyajikan hasil yang benar-benar acak dengan bantuan fungsi matematika bawaan peramban internet modern yang menyimulasikan hukum lemparan dadu fisik klasik secara sangat presisi. Kami menyediakan set semua kelompok dadu poliedrik standar tabletop (D4, D6, D8, D10, D12, D20, dan D100) serta fitur perhitungan modifikator.",
        usecases_title: "Contoh Penggunaan",
        uc1: "Pengganti praktis kala set fisik tidak tersedia untuk petualangan kampanye meja.",
        uc2: "Mempercepat lemparan awal untuk membangun status karakter (4d6).",
        uc3: "Memberi total perhitungan pada efek kerusakan magis berantai.",
        uc4: "Pemutus keraguan umum hingga pemutaran undian biasa.",
        faq_title: "Pertanyaan Umum",
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
        see1: "Kalkulator Persentase",
        see2: "Pengacak Daftar",
        see3: "Aturan Tiga",
        see4: "Ekstraktor Email"
    }
}
</i18n>
