<script setup lang="ts">
useScript('https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/tinycolor.js', { trigger: 'client' })

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
    { question: t('faq_2_q'), answer: t('faq_2_a') }
  ]
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }]
})

const state = reactive({
  color: '#FFF',
  hex: '',
  hex8: '',
  rgb: '',
  hsl: '',
  hsv: '',
  isValid: true,
  ads: false
})

watch(() => state.color, () => convert(true))

onMounted(() => {
  const init = () => {
    if ((window as any).tinycolor) {
      convert(false)
    } else {
      requestAnimationFrame(init)
    }
  }
  init()
})

function convert(showAds: boolean) {
  const tiny = (window as any).tinycolor?.(state.color)
  if (!tiny) return

  if (tiny.isValid()) {
    state.hex = tiny.toHexString()
    state.hex8 = tiny.toHex8String()
    state.rgb = tiny.toRgbString()
    state.hsl = tiny.toHslString()
    state.hsv = tiny.toHsvString()
  }

  state.isValid = tiny.isValid()
  if (showAds) state.ads = true
}

defineI18nRoute({
  paths: {
    en: '/color-converter',
    pt: '/conversor-de-cores',
    es: '/convertidor-de-colores',
    fr: '/convertisseur-de-couleurs',
    it: '/convertitore-di-colori',
    id: '/konverter-warna',
    de: '/farben-konverter',
    nl: '/kleur-converter'
  }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.ads"
    :see-also-links="[
      { label: t('see1'), to: 'random-colors' },
      { label: t('see2'), to: 'dominant-colors-of-the-image' },
      { label: t('see3'), to: 'color-combination' },
      { label: t('see4'), to: 'qrcode-generator' }
    ]"
  >
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Input row -->
      <div class="form-control w-full">
        <label for="color-input" class="label">
          <span class="label-text font-bold text-base-content">{{ t('in') }}</span>
        </label>
        <div class="flex items-center gap-3">
          <input
            id="color-input"
            v-model="state.color"
            type="text"
            class="input input-bordered input-lg w-full bg-base-200 focus:bg-base-200 transition-all rounded-2xl"
            autofocus
          />
          <div
            v-show="state.isValid"
            class="rounded-xl border border-base-content/20 flex-shrink-0 shadow-sm"
            :style="{ background: state.color, height: '52px', width: '52px' }"
          />
        </div>
      </div>

      <!-- Conversion results -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <div v-if="state.isValid" class="flex flex-wrap gap-4">
          <LineCopy label="HEX" :content="state.hex" class="!my-0 [&>div]:!w-full min-w-48 flex-1" />
          <LineCopy label="HEX8" :content="state.hex8" class="!my-0 [&>div]:!w-full min-w-48 flex-1" />
          <LineCopy label="RGB" :content="state.rgb" class="!my-0 [&>div]:!w-full min-w-48 flex-1" />
          <LineCopy label="HSL" :content="state.hsl" class="!my-0 [&>div]:!w-full min-w-48 flex-1" />
          <LineCopy label="HSV" :content="state.hsv" class="!my-0 [&>div]:!w-full min-w-48 flex-1" />
        </div>
      </Transition>

      <!-- Invalid state -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="!state.isValid"
          class="flex items-center gap-3 p-4 rounded-2xl bg-error/10 border border-error/20 text-error"
        >
          <Icon name="heroicons:exclamation-circle" class="w-5 h-5 flex-shrink-0" />
          <span class="font-medium">{{ t('invalid') }}</span>
        </div>
      </Transition>
    </div>

    <template #info>
      <div class="space-y-8">
        <div>
          <p>{{ t('d1') }}</p>
        </div>

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_it_works_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') }
          ]"
        />

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    pageTitle: "Color Converter Online: Convert HEX, RGB, HSL and HSV | Free",
    title: "Color Converter",
    meta: "Convert colors online between HEX, RGB, HSL, HSV, and HEX8. Enter a color code and get instant conversions in all formats.",
    in: "Enter a valid color code",
    invalid: "Enter a valid color",
    d1: "The Color Converter converts any color code or color name between HEX, RGB, HSL, HSV, and HEX8 formats. Type or paste the value in the input field and all equivalent formats will appear instantly. Each result has a copy button so you can use it directly in your projects.",
    f_1: "Convert colors between HEX, RGB, HSL, HSV, and HEX8",
    f_2: "Real-time conversion as you type",
    f_3: "One-click copy for each color format",
    f_4: "Client-side processing, no data sent to servers",
    use_cases_title: "Use Cases",
    uc_1_title: "Web & UI Design",
    uc_1_desc: "Convert HEX codes from design tools like Figma into RGB or HSL values for CSS variables.",
    uc_2_title: "Cross-format Development",
    uc_2_desc: "Switch between color formats required by different frameworks, languages, or rendering APIs.",
    uc_3_title: "Accessibility & Theming",
    uc_3_desc: "Use HSL values to adjust lightness and saturation when building accessible color palettes.",
    how_it_works_title: "How to Use the Color Converter",
    step_1_title: "Enter a Color",
    step_1_desc: "Type any valid color code (HEX, RGB, HSL, color name) into the input field.",
    step_2_title: "Copy and Use",
    step_2_desc: "Click the copy icon next to any format to send it directly to your clipboard.",
    faq_title: "Questions and Answers",
    faq_1_q: "What color formats are supported as input?",
    faq_1_a: "You can enter HEX (#fff, #ffffff), RGB (rgb(255,255,255)), HSL, HSV, named colors (red, blue), and more. Any format recognized by the CSS specification is accepted.",
    faq_2_q: "What is HEX8?",
    faq_2_a: "HEX8 is an 8-digit hexadecimal color that includes an alpha (transparency) channel, for example #ffffffff. It is supported in modern CSS and some design tools.",
    see1: "Random Colors",
    see2: "Image Colors",
    see3: "Color Combination",
    see4: "QR Code Generator"
  },
  pt: {
    pageTitle: "Conversor de Cores Online: Converta HEX, RGB, HSL e HSV | Grátis",
    title: "Conversor de Cores",
    meta: "Converta cores online entre HEX, RGB, HSL, HSV e HEX8. Informe um código de cor e veja todas as conversões instantaneamente.",
    in: "Informe um código de cor válido",
    invalid: "Informe uma cor válida",
    d1: "O Conversor de Cores converte qualquer código ou nome de cor entre os formatos HEX, RGB, HSL, HSV e HEX8. Digite ou cole o valor no campo de entrada e todos os formatos equivalentes aparecerão instantaneamente. Cada resultado tem um botão de cópia para usar diretamente nos seus projetos.",
    f_1: "Converta cores entre HEX, RGB, HSL, HSV e HEX8",
    f_2: "Conversão em tempo real enquanto você digita",
    f_3: "Copie qualquer formato com um clique",
    f_4: "Processamento local, nenhum dado é enviado a servidores",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Web & Design de UI",
    uc_1_desc: "Converta códigos HEX de ferramentas como Figma para valores RGB ou HSL para variáveis CSS.",
    uc_2_title: "Desenvolvimento Multiformato",
    uc_2_desc: "Alterne entre formatos de cor exigidos por diferentes frameworks, linguagens ou APIs de renderização.",
    uc_3_title: "Acessibilidade & Temas",
    uc_3_desc: "Use valores HSL para ajustar brilho e saturação ao criar paletas de cores acessíveis.",
    how_it_works_title: "Como Usar o Conversor de Cores",
    step_1_title: "Insira uma Cor",
    step_1_desc: "Digite qualquer código de cor válido (HEX, RGB, HSL, nome de cor) no campo de entrada.",
    step_2_title: "Copiar e Usar",
    step_2_desc: "Clique no ícone de cópia ao lado de qualquer formato para enviá-lo direto para a área de transferência.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "Quais formatos de cor são aceitos como entrada?",
    faq_1_a: "Você pode inserir HEX (#fff, #ffffff), RGB (rgb(255,255,255)), HSL, HSV, nomes de cores (red, blue) e outros formatos reconhecidos pela especificação CSS.",
    faq_2_q: "O que é HEX8?",
    faq_2_a: "HEX8 é uma cor hexadecimal de 8 dígitos que inclui um canal alfa (transparência), por exemplo #ffffffff. É suportado em CSS moderno e algumas ferramentas de design.",
    see1: "Cores Aleatórias",
    see2: "Cores da Imagem",
    see3: "Combinação de Cores",
    see4: "Gerador de QR Code"
  },
  es: {
    pageTitle: "Convertidor de Colores Online: Convierte HEX, RGB, HSL y HSV | Gratis",
    title: "Convertidor de Colores",
    meta: "Convierte colores online entre HEX, RGB, HSL, HSV y HEX8. Introduce un código y obtén conversiones instantáneas.",
    in: "Introduce un código de color válido",
    invalid: "Introduce un color válido",
    d1: "El Convertidor de Colores convierte cualquier código o nombre de color entre los formatos HEX, RGB, HSL, HSV y HEX8. Escribe o pega el valor en el campo de entrada y todos los formatos equivalentes aparecerán al instante. Cada resultado tiene un botón de copia para usarlo directamente en tus proyectos.",
    f_1: "Convierte colores entre HEX, RGB, HSL, HSV y HEX8",
    f_2: "Conversión en tiempo real mientras escribes",
    f_3: "Copia cualquier formato con un clic",
    f_4: "Procesamiento local, sin envío de datos a servidores",
    use_cases_title: "Casos de Uso",
    uc_1_title: "Web & Diseño de UI",
    uc_1_desc: "Convierte códigos HEX de herramientas como Figma en valores RGB o HSL para variables CSS.",
    uc_2_title: "Desarrollo Multiformato",
    uc_2_desc: "Cambia entre formatos de color requeridos por distintos frameworks, lenguajes o APIs.",
    uc_3_title: "Accesibilidad & Temas",
    uc_3_desc: "Usa valores HSL para ajustar brillo y saturación al crear paletas de colores accesibles.",
    how_it_works_title: "Cómo Usar el Convertidor de Colores",
    step_1_title: "Introduce un Color",
    step_1_desc: "Escribe cualquier código de color válido (HEX, RGB, HSL, nombre de color) en el campo.",
    step_2_title: "Copiar y Usar",
    step_2_desc: "Haz clic en el icono de copiar junto a cualquier formato para enviarlo al portapapeles.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿Qué formatos de color se aceptan como entrada?",
    faq_1_a: "Puedes ingresar HEX (#fff, #ffffff), RGB (rgb(255,255,255)), HSL, HSV, nombres de colores (red, blue) y cualquier formato reconocido por la especificación CSS.",
    faq_2_q: "¿Qué es HEX8?",
    faq_2_a: "HEX8 es un color hexadecimal de 8 dígitos que incluye un canal alfa (transparencia), por ejemplo #ffffffff. Es compatible con CSS moderno y algunas herramientas de diseño.",
    see1: "Colores Aleatorios",
    see2: "Colores de la Imagen",
    see3: "Combinación de Colores",
    see4: "Generador de QR Code"
  },
  fr: {
    pageTitle: "Convertisseur de Couleurs en Ligne: Convertir HEX, RGB, HSL et HSV | Gratuit",
    title: "Convertisseur de Couleurs",
    meta: "Convertissez des couleurs en ligne entre HEX, RGB, HSL, HSV et HEX8. Entrez un code couleur et obtenez les conversions instantanément.",
    in: "Saisissez un code couleur valide",
    invalid: "Saisissez une couleur valide",
    d1: "Le Convertisseur de Couleurs convertit n'importe quel code ou nom de couleur entre les formats HEX, RGB, HSL, HSV et HEX8. Saisissez ou collez la valeur dans le champ de saisie et tous les formats équivalents apparaîtront instantanément. Chaque résultat dispose d'un bouton de copie pour l'utiliser directement dans vos projets.",
    f_1: "Convertissez des couleurs entre HEX, RGB, HSL, HSV et HEX8",
    f_2: "Conversion en temps réel pendant la saisie",
    f_3: "Copiez n'importe quel format en un clic",
    f_4: "Traitement local, aucune donnée envoyée aux serveurs",
    use_cases_title: "Cas d'Utilisation",
    uc_1_title: "Web & Design UI",
    uc_1_desc: "Convertissez les codes HEX de Figma en valeurs RGB ou HSL pour les variables CSS.",
    uc_2_title: "Développement Multi-format",
    uc_2_desc: "Passez d'un format de couleur à l'autre selon les besoins des frameworks, langages ou API.",
    uc_3_title: "Accessibilité & Thèmes",
    uc_3_desc: "Utilisez les valeurs HSL pour ajuster la luminosité et la saturation lors de la création de palettes accessibles.",
    how_it_works_title: "Comment Utiliser le Convertisseur de Couleurs",
    step_1_title: "Entrez une Couleur",
    step_1_desc: "Saisissez n'importe quel code couleur valide (HEX, RGB, HSL, nom de couleur) dans le champ.",
    step_2_title: "Copier et Utiliser",
    step_2_desc: "Cliquez sur l'icône de copie à côté de n'importe quel format pour l'envoyer dans le presse-papiers.",
    faq_title: "Questions et Réponses",
    faq_1_q: "Quels formats de couleur sont acceptés en entrée ?",
    faq_1_a: "Vous pouvez saisir du HEX (#fff, #ffffff), du RGB (rgb(255,255,255)), du HSL, du HSV, des noms de couleurs (red, blue) et tout format reconnu par la spécification CSS.",
    faq_2_q: "Qu'est-ce que HEX8 ?",
    faq_2_a: "HEX8 est une couleur hexadécimale à 8 chiffres incluant un canal alpha (transparence), par exemple #ffffffff. Pris en charge par le CSS moderne et certains outils de design.",
    see1: "Couleurs Aléatoires",
    see2: "Couleurs de l'Image",
    see3: "Combinaison de Couleurs",
    see4: "Générateur de QR Code"
  },
  it: {
    pageTitle: "Convertitore di Colori Online: Converti HEX, RGB, HSL e HSV | Gratis",
    title: "Convertitore di Colori",
    meta: "Converti colori online tra HEX, RGB, HSL, HSV e HEX8. Inserisci un codice colore e ottieni conversioni immediate.",
    in: "Inserisci un codice colore valido",
    invalid: "Inserisci un colore valido",
    d1: "Il Convertitore di Colori converte qualsiasi codice o nome di colore tra i formati HEX, RGB, HSL, HSV e HEX8. Digita o incolla il valore nel campo di inserimento e tutti i formati equivalenti appariranno immediatamente. Ogni risultato ha un pulsante di copia per usarlo direttamente nei tuoi progetti.",
    f_1: "Converti colori tra HEX, RGB, HSL, HSV e HEX8",
    f_2: "Conversione in tempo reale mentre digiti",
    f_3: "Copia qualsiasi formato con un clic",
    f_4: "Elaborazione locale, nessun dato inviato ai server",
    use_cases_title: "Casi d'Uso",
    uc_1_title: "Web & Design UI",
    uc_1_desc: "Converti codici HEX da strumenti come Figma in valori RGB o HSL per variabili CSS.",
    uc_2_title: "Sviluppo Multi-formato",
    uc_2_desc: "Passa da un formato colore all'altro in base ai requisiti di framework, linguaggi o API.",
    uc_3_title: "Accessibilità & Temi",
    uc_3_desc: "Usa i valori HSL per regolare luminosità e saturazione nella creazione di palette di colori accessibili.",
    how_it_works_title: "Come Usare il Convertitore di Colori",
    step_1_title: "Inserisci un Colore",
    step_1_desc: "Digita qualsiasi codice colore valido (HEX, RGB, HSL, nome colore) nel campo di input.",
    step_2_title: "Copia e Usa",
    step_2_desc: "Fai clic sull'icona di copia accanto a qualsiasi formato per inviarlo negli appunti.",
    faq_title: "Domande e Risposte",
    faq_1_q: "Quali formati di colore sono accettati come input?",
    faq_1_a: "Puoi inserire HEX (#fff, #ffffff), RGB (rgb(255,255,255)), HSL, HSV, nomi di colori (red, blue) e qualsiasi formato riconosciuto dalla specifica CSS.",
    faq_2_q: "Cos'è HEX8?",
    faq_2_a: "HEX8 è un colore esadecimale a 8 cifre che include un canale alfa (trasparenza), ad esempio #ffffffff. Supportato da CSS moderno e da alcuni strumenti di design.",
    see1: "Colori Casuali",
    see2: "Colori dell'Immagine",
    see3: "Combinazione di Colori",
    see4: "Generatore di QR Code"
  },
  id: {
    pageTitle: "Konverter Warna Online: Konversi HEX, RGB, HSL, dan HSV | Gratis",
    title: "Konverter Warna",
    meta: "Konversi warna online antara HEX, RGB, HSL, HSV, dan HEX8. Masukkan kode warna dan dapatkan konversi instan dalam semua format.",
    in: "Masukkan kode warna yang valid",
    invalid: "Masukkan warna yang valid",
    d1: "Konverter Warna mengonversi kode atau nama warna apa pun antara format HEX, RGB, HSL, HSV, dan HEX8. Ketik atau tempel nilainya di kolom input dan semua format yang setara akan muncul seketika. Setiap hasil memiliki tombol salin untuk langsung digunakan dalam proyek Anda.",
    f_1: "Konversi warna antara HEX, RGB, HSL, HSV, dan HEX8",
    f_2: "Konversi real-time saat Anda mengetik",
    f_3: "Salin format apa pun dengan satu klik",
    f_4: "Pemrosesan lokal, tidak ada data yang dikirim ke server",
    use_cases_title: "Kasus Penggunaan",
    uc_1_title: "Web & Desain UI",
    uc_1_desc: "Konversi kode HEX dari alat seperti Figma ke nilai RGB atau HSL untuk variabel CSS.",
    uc_2_title: "Pengembangan Multi-format",
    uc_2_desc: "Beralih antar format warna yang diperlukan oleh berbagai framework, bahasa, atau API rendering.",
    uc_3_title: "Aksesibilitas & Tema",
    uc_3_desc: "Gunakan nilai HSL untuk menyesuaikan kecerahan dan saturasi saat membangun palet warna yang aksesibel.",
    how_it_works_title: "Cara Menggunakan Konverter Warna",
    step_1_title: "Masukkan Warna",
    step_1_desc: "Ketik kode warna yang valid (HEX, RGB, HSL, nama warna) ke dalam kolom input.",
    step_2_title: "Salin dan Gunakan",
    step_2_desc: "Klik ikon salin di sebelah format mana pun untuk langsung mengirimnya ke papan klip.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Format warna apa yang didukung sebagai input?",
    faq_1_a: "Anda dapat memasukkan HEX (#fff, #ffffff), RGB (rgb(255,255,255)), HSL, HSV, nama warna (red, blue), dan format lain yang dikenali oleh spesifikasi CSS.",
    faq_2_q: "Apa itu HEX8?",
    faq_2_a: "HEX8 adalah warna heksadesimal 8 digit yang menyertakan saluran alfa (transparansi), misalnya #ffffffff. Didukung oleh CSS modern dan beberapa alat desain.",
    see1: "Warna Acak",
    see2: "Warna Gambar",
    see3: "Kombinasi Warna",
    see4: "Generator Kode QR"
  },
  de: {
    pageTitle: "Farben-Konverter Online: HEX, RGB, HSL und HSV umwandeln | Kostenlos",
    title: "Farben-Konverter",
    meta: "Farben online zwischen HEX, RGB, HSL, HSV und HEX8 konvertieren. Gib einen Farbcode ein und erhalte sofortige Konvertierungen in allen Formaten.",
    in: "Gültigen Farbcode eingeben",
    invalid: "Gültige Farbe eingeben",
    d1: "Der Farben-Konverter wandelt jeden Farbcode oder Farbnamen zwischen den Formaten HEX, RGB, HSL, HSV und HEX8 um. Gib den Wert in das Eingabefeld ein oder füge ihn ein, und alle äquivalenten Formate erscheinen sofort. Jedes Ergebnis hat einen Kopierbutton, um es direkt in deinen Projekten zu verwenden.",
    f_1: "Farben zwischen HEX, RGB, HSL, HSV und HEX8 konvertieren",
    f_2: "Echtzeit-Konvertierung während der Eingabe",
    f_3: "Jedes Format mit einem Klick kopieren",
    f_4: "Lokale Verarbeitung, keine Daten werden an Server gesendet",
    use_cases_title: "Anwendungsfälle",
    uc_1_title: "Web & UI-Design",
    uc_1_desc: "HEX-Codes aus Tools wie Figma in RGB- oder HSL-Werte für CSS-Variablen umwandeln.",
    uc_2_title: "Cross-Format-Entwicklung",
    uc_2_desc: "Zwischen Farbformaten wechseln, die von verschiedenen Frameworks, Sprachen oder Rendering-APIs benötigt werden.",
    uc_3_title: "Barrierefreiheit & Themes",
    uc_3_desc: "HSL-Werte verwenden, um Helligkeit und Sättigung beim Erstellen barrierefreier Farbpaletten anzupassen.",
    how_it_works_title: "So verwendest du den Farben-Konverter",
    step_1_title: "Farbe eingeben",
    step_1_desc: "Gib einen beliebigen gültigen Farbcode (HEX, RGB, HSL, Farbname) in das Eingabefeld ein.",
    step_2_title: "Kopieren und Verwenden",
    step_2_desc: "Klicke auf das Kopiersymbol neben einem Format, um es direkt in die Zwischenablage zu senden.",
    faq_title: "Fragen und Antworten",
    faq_1_q: "Welche Farbformate werden als Eingabe unterstützt?",
    faq_1_a: "Du kannst HEX (#fff, #ffffff), RGB (rgb(255,255,255)), HSL, HSV, Farbnamen (red, blue) und alle von der CSS-Spezifikation erkannten Formate eingeben.",
    faq_2_q: "Was ist HEX8?",
    faq_2_a: "HEX8 ist eine 8-stellige Hexadezimalfarbe mit einem Alpha-Kanal (Transparenz), z. B. #ffffffff. Sie wird von modernem CSS und einigen Design-Tools unterstützt.",
    see1: "Zufällige Farben",
    see2: "Bildfarben",
    see3: "Farbkombination",
    see4: "QR-Code-Generator"
  },
  nl: {
    pageTitle: "Kleur Converter Online: HEX, RGB, HSL en HSV omzetten | Gratis",
    title: "Kleur Converter",
    meta: "Converteer kleuren online tussen HEX, RGB, HSL, HSV en HEX8. Voer een kleurcode in en ontvang directe conversies in alle formaten.",
    in: "Voer een geldige kleurcode in",
    invalid: "Voer een geldige kleur in",
    d1: "De Kleurconverter converteert elke kleurcode of kleurnaam tussen de formaten HEX, RGB, HSL, HSV en HEX8. Typ of plak de waarde in het invoerveld en alle equivalente formaten verschijnen direct. Elk resultaat heeft een kopieerknop om het direct in uw projecten te gebruiken.",
    f_1: "Converteer kleuren tussen HEX, RGB, HSL, HSV en HEX8",
    f_2: "Real-time conversie terwijl u typt",
    f_3: "Kopieer elk formaat met één klik",
    f_4: "Lokale verwerking, geen gegevens verzonden naar servers",
    use_cases_title: "Gebruiksscenario's",
    uc_1_title: "Web & UI-ontwerp",
    uc_1_desc: "Converteer HEX-codes uit tools zoals Figma naar RGB- of HSL-waarden voor CSS-variabelen.",
    uc_2_title: "Cross-format Ontwikkeling",
    uc_2_desc: "Wissel tussen kleurformaten die vereist zijn door verschillende frameworks, talen of rendering-API's.",
    uc_3_title: "Toegankelijkheid & Thema's",
    uc_3_desc: "Gebruik HSL-waarden om helderheid en verzadiging aan te passen bij het bouwen van toegankelijke kleurpaletten.",
    how_it_works_title: "Hoe de Kleurconverter te gebruiken",
    step_1_title: "Voer een kleur in",
    step_1_desc: "Typ een geldige kleurcode (HEX, RGB, HSL, kleurnaam) in het invoerveld.",
    step_2_title: "Kopiëren en gebruiken",
    step_2_desc: "Klik op het kopieerpictogram naast een formaat om het direct naar uw klembord te sturen.",
    faq_title: "Vragen en Antwoorden",
    faq_1_q: "Welke kleurformaten worden als invoer ondersteund?",
    faq_1_a: "U kunt HEX (#fff, #ffffff), RGB (rgb(255,255,255)), HSL, HSV, kleurnamen (red, blue) en elk formaat dat door de CSS-specificatie wordt herkend invoeren.",
    faq_2_q: "Wat is HEX8?",
    faq_2_a: "HEX8 is een hexadecimale kleur van 8 cijfers met een alfakanaal (transparantie), bijvoorbeeld #ffffffff. Ondersteund door modern CSS en sommige ontwerptools.",
    see1: "Willekeurige Kleuren",
    see2: "Afbeeldingskleuren",
    see3: "Kleurcombinatie",
    see4: "QR-codegenerator"
  }
}
</i18n>
