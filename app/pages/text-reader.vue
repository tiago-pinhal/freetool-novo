<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')]
})

useHead({
  title: t('title'),
  meta: [{ name: 'description', content: t('meta') }]
})

defineI18nRoute({
  paths: {
    en: '/text-reader',
    pt: '/leitor-de-texto',
    es: '/lector-de-texto',
    fr: '/lecteur-de-texte',
    it: '/lettore-di-testo',
    id: '/pembaca-teks',
    de: '/text-vorleser',
    nl: '/tekst-voorlezer',
    ru: '/chtenie-teksta',
  }
})

// ── State ──────────────────────────────────────────────────────────────────
const isReadingMode = ref(false)
const textInput = ref('')
const loadedText = ref('')
const sentences = ref<string[]>([])
const currentSentence = ref(0)
const isReading = ref(false)
const voices = ref<SpeechSynthesisVoice[]>([])
const selectedVoice = ref('')
const speed = ref(0.9)
const pitch = ref(1.0)
const engine = ref<'native' | 'chunks' | 'manual'>('native')
const isVoiceReady = ref(false)
const errorCount = ref(0)
const statusMsg = ref<{ text: string; type: 'info' | 'success' | 'error' | 'warning' } | null>(null)
let statusTimer: ReturnType<typeof setTimeout> | null = null
let readTimer: ReturnType<typeof setTimeout> | null = null

// ── Computed ───────────────────────────────────────────────────────────────
const progress = computed(() =>
  sentences.value.length ? Math.round((currentSentence.value / sentences.value.length) * 100) : 0
)
const wordCount = computed(() =>
  loadedText.value.split(/\s+/).filter(Boolean).length
)
const hasText = computed(() => loadedText.value.length > 0)

const displayedHTML = computed(() => {
  if (!loadedText.value) return ''
  let html = loadedText.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
  if (!isReading.value || currentSentence.value >= sentences.value.length) return html

  const sentence = sentences.value[currentSentence.value]
  if (!sentence) return html
  const words = sentence.split(' ').slice(0, 5).join(' ')
  const safeWords = words.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const idx = html.search(new RegExp(safeWords, 'i'))
  if (idx === -1) return html

  return (
    html.substring(0, idx) +
    '<mark class="bg-primary/20 border-b-2 border-primary/50 text-base-content font-medium rounded-sm px-1 py-0.5 transition-colors duration-200">' +
    html.substring(idx, idx + sentence.length) +
    '</mark>' +
    html.substring(idx + sentence.length)
  )
})

const playBtnLabel = computed(() => {
  if (progress.value === 100) return t('read_again_btn')
  return t('play_btn')
})

const engineDescription = computed(() => {
  if (engine.value === 'chunks') return t('engine_chunks_desc')
  if (engine.value === 'manual') return t('engine_manual_desc')
  return t('engine_native_desc')
})

// ── Status helpers ─────────────────────────────────────────────────────────
function showStatus(text: string, type: typeof statusMsg.value extends null ? never : NonNullable<typeof statusMsg.value>['type'], autoDismiss = 0) {
  if (statusTimer) clearTimeout(statusTimer)
  statusMsg.value = { text, type }
  if (autoDismiss) statusTimer = setTimeout(() => (statusMsg.value = null), autoDismiss)
}

// ── Voice loading ──────────────────────────────────────────────────────────
function loadVoices() {
  const available = speechSynthesis.getVoices()
  if (available.length) {
    voices.value = available
    if (!selectedVoice.value) {
      const pt = available.find(v => v.lang.startsWith('pt'))
      if (pt) selectedVoice.value = pt.name
    }
    // If it recovered, show success
    if (statusMsg.value?.text === t('status_no_voices')) {
      showStatus(t('status_ready'), 'success', 2000)
    }
  }
}

onMounted(() => {
  if (!('speechSynthesis' in window)) {
    showStatus(t('status_unsupported'), 'error')
    return
  }
  isVoiceReady.value = true
  loadVoices()
  speechSynthesis.addEventListener('voiceschanged', loadVoices)
  
  // Browsers load voices asynchronously. If after 1.5s we still have 0, warn the user.
  setTimeout(() => {
    if (voices.value.length === 0) {
      showStatus(t('status_no_voices'), 'error')
    } else {
      showStatus(t('status_ready'), 'success', 2000)
    }
  }, 1500)
})

onBeforeUnmount(() => {
  speechSynthesis.cancel()
  speechSynthesis.removeEventListener('voiceschanged', loadVoices)
})

// ── Text processing ────────────────────────────────────────────────────────
function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.name.endsWith('.txt')) {
    return showStatus(t('status_invalid_file'), 'error', 3000)
  }
  const reader = new FileReader()
  reader.onload = ev => {
    textInput.value = (ev.target?.result as string) ?? ''
    showStatus(t('status_loaded'), 'success', 2000)
  }
  reader.onerror = () => showStatus(t('status_file_error'), 'error', 3000)
  reader.readAsText(file, 'UTF-8')
}

function buildSentences(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim()
  const maxLen = engine.value === 'chunks' ? 200 : engine.value === 'manual' ? 150 : 300
  const result: string[] = []

  const rawParts = clean.split(/([.!?]+\s*)/).filter(s => s.trim())
  const complete: string[] = []
  for (let i = 0; i < rawParts.length; i += 2) {
    const s = rawParts[i]
    const p = rawParts[i + 1] ?? ''
    if (s?.trim()) complete.push((s + p).trim())
  }

  let chunk = ''
  complete.forEach((sentence, idx) => {
    if (sentence.length > maxLen) {
      if (chunk.trim()) { result.push(chunk.trim()); chunk = '' }
      splitLong(sentence, maxLen, result)
    } else {
      if (chunk.length + sentence.length + 1 > maxLen && chunk.trim()) {
        result.push(chunk.trim()); chunk = sentence
      } else {
        chunk += (chunk ? ' ' : '') + sentence
      }
      if (idx === complete.length - 1 && chunk.trim()) result.push(chunk.trim())
    }
  })

  sentences.value = result.filter(s => s.length > 10)
  currentSentence.value = 0
}

function splitLong(sentence: string, maxLen: number, result: string[]) {
  const parts = sentence.split(/([,;]+\s*)/).filter(s => s.trim())
  let chunk = ''
  for (let i = 0; i < parts.length; i += 2) {
    const full = ((parts[i] ?? '') + (parts[i + 1] ?? '')).trim()
    if (!full) continue
    if (chunk.length + full.length + 1 > maxLen && chunk.trim()) {
      result.push(chunk.trim()); chunk = full
    } else {
      chunk += (chunk ? ' ' : '') + full
    }
  }
  if (chunk.trim()) result.push(chunk.trim())
}

// ── Playback ───────────────────────────────────────────────────────────────
function startOrRestartReading() {
  if (!isVoiceReady.value) return showStatus(t('status_not_ready'), 'error', 3000)
  if (voices.value.length === 0) return showStatus(t('status_no_voices'), 'error', 5000)
  const text = textInput.value.trim()
  if (!text) return showStatus(t('status_empty_input'), 'error', 2000)

  if (progress.value === 100) { currentSentence.value = 0 }
  
  if (!isReadingMode.value || loadedText.value !== text) {
    loadedText.value = text
    buildSentences(text)
    isReadingMode.value = true
  }

  isReading.value = true
  errorCount.value = 0
  readNext()
}

function stopReading() {
  isReading.value = false
  currentSentence.value = 0
  errorCount.value = 0
  if (readTimer) { clearTimeout(readTimer); readTimer = null }
  speechSynthesis.cancel()
  setTimeout(() => speechSynthesis.resume(), 50)
  statusMsg.value = null
}

function editMode() {
  stopReading()
  isReadingMode.value = false
}

function restartReading() {
  stopReading()
  currentSentence.value = 0
  errorCount.value = 0
  if (isReadingMode.value) setTimeout(startOrRestartReading, 300)
}

function readNext() {
  if (!isReading.value) return
  if (currentSentence.value >= sentences.value.length) { finishReading(); return }
  const text = sentences.value[currentSentence.value]
  if (!text || text.length < 3) { currentSentence.value++; readNext(); return }
  speak(text)
}

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text)
  u.rate = Math.max(0.5, Math.min(1.8, speed.value))
  u.pitch = Math.max(0.7, Math.min(1.3, pitch.value))
  u.volume = 1
  u.lang = 'pt-BR'

  if (selectedVoice.value) {
    const v = voices.value.find(v => v.name === selectedVoice.value)
    if (v) u.voice = v
  }

  const startedAt = Date.now()

  u.onend = () => {
    if (!isReading.value) return
    // Chrome bug: onend fires instantly without audio when engine is in bad state.
    // If elapsed < 100ms for any non-trivial text, treat as silent failure and retry.
    if (Date.now() - startedAt < 100 && text.length > 20) {
      setTimeout(() => { if (isReading.value) speak(text) }, 300)
      return
    }
    currentSentence.value++
    const pause = engine.value === 'manual' ? 700 : engine.value === 'chunks' ? 350 : 150
    const extra = text.match(/[.!?]$/) ? 200 : text.match(/[,;:]$/) ? 80 : 0
    readTimer = setTimeout(readNext, pause + extra)
  }

  u.onerror = (ev) => {
    if (ev.error === 'interrupted') return
    if (!isReading.value) return
    errorCount.value++
    if (errorCount.value >= 3) {
      showStatus(t('status_many_errors'), 'error')
      stopReading(); return
    }
    currentSentence.value++
    readTimer = setTimeout(readNext, 500)
  }

  // Chrome fix: resume if paused before speaking (common after cancel())
  if (speechSynthesis.paused) speechSynthesis.resume()
  speechSynthesis.speak(u)
}

function finishReading() {
  isReading.value = false
  showStatus(t('status_done'), 'success', 3000)
}

watch(engine, () => {
  stopReading()
  if (isReadingMode.value && hasText.value) buildSentences(loadedText.value)
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="hasText"
    :see-also-links="[
      { label: t('see1'), to: 'percentage-calculator' },
      { label: t('see2'), to: 'email-extractor' },
      { label: t('see3'), to: 'text-counter' },
      { label: t('see4'), to: 'list-randomizer' }
    ]"
  >
    <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Status message -->
      <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <div v-if="statusMsg" :class="[
          'alert text-sm font-semibold rounded-xl',
          statusMsg.type === 'success' && 'alert-success',
          statusMsg.type === 'error'   && 'alert-error',
          statusMsg.type === 'warning' && 'alert-warning',
          statusMsg.type === 'info'    && 'alert-info',
        ]">{{ statusMsg.text }}</div>
      </Transition>

      <!-- Settings Toolbar -->
      <div class="bg-base-200/40 border border-base-content/10 rounded-2xl p-4">
        <div class="flex flex-col sm:flex-row gap-4 items-end">
          <div v-if="voices.length" class="flex-1 space-y-1 w-full">
            <label class="text-xs font-bold text-base-content/50 uppercase tracking-wider">{{ t('voice_label') }}</label>
            <select v-model="selectedVoice" class="select select-bordered select-sm w-full rounded-xl">
              <option value="">{{ t('voice_default') }}</option>
              <option v-for="v in voices" :key="v.name" :value="v.name">{{ v.name }} ({{ v.lang }})</option>
            </select>
          </div>
          <div class="flex-1 space-y-1 w-full">
            <label class="text-xs font-bold text-base-content/50 uppercase tracking-wider">{{ t('speed_label') }} {{ speed.toFixed(1) }}x</label>
            <input type="range" v-model.number="speed" min="0.3" max="2" step="0.1" class="range range-primary range-sm w-full" />
          </div>
          <div class="flex-1 space-y-1 w-full">
            <label class="text-xs font-bold text-base-content/50 uppercase tracking-wider">{{ t('pitch_label') }} {{ pitch.toFixed(1) }}</label>
            <input type="range" v-model.number="pitch" min="0.7" max="1.3" step="0.05" class="range range-primary range-sm w-full" />
          </div>
          <div class="flex-1 space-y-1 w-full">
            <label class="text-xs font-bold text-base-content/50 uppercase tracking-wider">{{ t('engine_label') }}</label>
            <select v-model="engine" class="select select-bordered select-sm w-full rounded-xl">
              <option value="native">{{ t('engine_native') }}</option>
              <option value="chunks">{{ t('engine_chunks') }}</option>
              <option value="manual">{{ t('engine_manual') }}</option>
            </select>
          </div>
        </div>

        <!-- Engine Helper Info -->
        <div class="mt-3 pt-3 border-t border-base-content/5 flex items-start gap-2 text-xs text-base-content/60">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span class="font-semibold text-base-content/85">{{ t('engine_tip') }}:</span>
            {{ engineDescription }}
          </div>
        </div>
      </div>

      <!-- Main Container: Edit Mode OR Reading Mode -->
      <div v-if="!isReadingMode" class="space-y-4">
        <!-- Edit Mode -->
        <textarea
          v-model="textInput"
          rows="10"
          class="textarea textarea-bordered w-full bg-base-200 focus:bg-base-100 rounded-2xl text-base leading-relaxed resize-y"
          :placeholder="t('textarea_placeholder')"
        />
        <div class="flex flex-wrap items-center justify-between gap-3">
          <label class="btn btn-ghost btn-sm rounded-xl cursor-pointer text-base-content/70">
            {{ t('file_btn') }}
            <input type="file" accept=".txt" class="hidden" @change="onFileChange" />
          </label>
          <button class="btn btn-primary rounded-xl min-w-36" :disabled="!textInput.trim()" @click="startOrRestartReading">
            ▶ {{ playBtnLabel }}
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <!-- Reading Mode -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs text-base-content/50">
            <span>{{ t('chars_label') }} {{ loadedText.length.toLocaleString() }} &nbsp;|&nbsp; {{ t('words_label') }} {{ wordCount.toLocaleString() }}</span>
            <span>{{ progress }}% &nbsp;({{ t('part_label') }} {{ currentSentence }}/{{ sentences.length }})</span>
          </div>
          <progress class="progress progress-primary w-full" :value="progress" max="100" />
        </div>

        <div class="bg-base-200/40 border border-base-content/10 rounded-2xl p-6 text-base leading-relaxed min-h-48 font-serif" v-html="displayedHTML" />
        
        <div class="flex flex-wrap items-center gap-3">
          <button v-if="isReading" class="btn btn-error rounded-xl min-w-36" @click="stopReading">
            ■ {{ t('stop_btn') }}
          </button>
          <button v-else class="btn btn-primary rounded-xl min-w-36" @click="startOrRestartReading">
            ▶ {{ playBtnLabel }}
          </button>
          <button class="btn btn-ghost btn-sm rounded-xl text-base-content/70" @click="editMode">✏️ {{ t('edit_btn') }}</button>
        </div>
      </div>

    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('desc') }}</p>

        <FeatureSection :title="t('features_title')" :items="[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')]" />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') }
          ]"
        />

        <UseCaseSection :title="t('use_cases_title')" :items="[t('uc1'), t('uc2'), t('uc3'), t('uc4')]" />

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq_1_q'), answer: t('faq_1_a') },
            { question: t('faq_2_q'), answer: t('faq_2_a') },
            { question: t('faq_3_q'), answer: t('faq_3_a') },
            { question: t('faq_4_q'), answer: t('faq_4_a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Free Online Text Reader — Listen to Any Text Aloud",
    meta: "Free online text reader. Paste or upload any text and listen with natural voices. Control speed, pitch, and see the sentence being read highlighted in real time.",
    desc: "Our free online text reader turns any text into audio directly in your browser — no installation needed. Paste a text or upload a TXT file, choose a voice, adjust speed and pitch, then press Play. The current sentence is highlighted in real time as it is read. Click Stop to end reading or Edit Text to go back and adjust the content at any time. Great for studying, proofreading by ear, or accessibility.",
    textarea_placeholder: "Paste your text here...",
    file_btn: "Choose File",
    engine_label: "Voice Engine",
    engine_native: "Native",
    engine_chunks: "By Parts",
    engine_manual: "Manual",
    engine_tip: "About the Engine",
    engine_native_desc: "Default mode. Fast, continuous reading with very short natural pauses. Ideal for everyday use.",
    engine_chunks_desc: "Splits the text into smaller parts to prevent freezes or interruptions in unstable browsers.",
    engine_manual_desc: "Long, explicit pauses after each sentence. Perfect for accessibility, studying, or detailed follow-along.",
    voice_label: "Voice",
    voice_default: "Default Voice",
    speed_label: "Speed",
    pitch_label: "Pitch",
    play_btn: "Start Reading",
    stop_btn: "Stop",
    edit_btn: "Edit Text",
    read_again_btn: "Read Again",
    chars_label: "Characters:",
    words_label: "Words:",
    part_label: "Part",
    empty_msg: "Load a text to start reading",
    status_ready: "Voice system ready.",
    status_unsupported: "Your browser does not support speech synthesis. Try Chrome or Edge.",
    status_loaded: "File loaded successfully!",
    status_empty_input: "Please enter some text before starting.",
    status_invalid_file: "Please select a TXT file.",
    status_file_error: "Error reading the file.",
    status_no_text: "Please load a text first.",
    status_no_voices: "No voices were found on your device or browser.",
    status_not_ready: "Voice system is not ready. Try reloading the page.",
    status_done: "Reading complete!",
    status_many_errors: "Too many errors detected. Try switching the voice engine.",
    features_title: "Features",
    f1: "Text-to-speech directly in the browser, no installation needed",
    f2: "Voice selection with automatic language matching",
    f3: "Adjustable speed and pitch controls",
    f4: "Current sentence highlighted in real time",
    f5: "Upload TXT files directly",
    f6: "Real-time progress: bar, sentence counter, and word count",
    how_to_use_title: "How to use",
    step_1_title: "Paste or upload text",
    step_1_desc: "Paste text into the box or upload a TXT file. Click Start Reading when ready.",
    step_2_title: "Control playback",
    step_2_desc: "Click Stop to end reading and return to the beginning. Click Edit Text at any time to go back and adjust the content.",
    step_3_title: "Adjust voice, speed, and pitch",
    step_3_desc: "Select your preferred voice and adjust speed and pitch. If you experience instability, try the By Parts or Manual mode.",
    use_cases_title: "Use Cases",
    uc1: "Study by reading and listening to content at the same time.",
    uc2: "Proofread documents by listening instead of reading.",
    uc3: "Accessibility for users with visual or reading difficulties.",
    uc4: "Practice pronunciation while following along in real time.",
    faq_title: "Questions & Answers",
    faq_1_q: "Does the text reader work without internet?",
    faq_1_a: "Yes. The tool uses your browser's built-in speech synthesis, which works completely offline after the page loads.",
    faq_2_q: "Which voices are available?",
    faq_2_a: "Available voices depend on your browser and operating system. The tool automatically selects a matching voice for the language. Chrome and Edge typically offer the best options.",
    faq_3_q: "What is the difference between the reading modes?",
    faq_3_a: "Native mode is the fastest and smoothest. By Parts introduces longer pauses between sentences for better compatibility with some browsers. Manual adds even longer pauses, ideal for detailed follow-along or accessibility.",
    faq_4_q: "What file formats are accepted?",
    faq_4_a: "The tool accepts plain text files (TXT). For other formats such as PDF or Word, copy the content and paste it directly into the text box.",
    see1: "Percentage Calculator",
    see2: "Email Extractor",
    see3: "Text Counter",
    see4: "List Randomizer"
  },
  pt: {
    title: "Leitor de Texto Online Grátis — Ouvir Texto em Voz Alta",
    meta: "Leitor de texto online grátis. Cole ou carregue qualquer texto e ouça em voz alta com vozes naturais. Controle velocidade, tom e veja a frase sendo lida em tempo real.",
    desc: "Nosso leitor de texto online gratuito transforma qualquer texto em áudio diretamente no seu navegador, sem instalar nada. Cole um texto ou carregue um arquivo TXT, escolha a voz, ajuste a velocidade e o tom, e pressione Play. A frase atual é destacada em tempo real enquanto a leitura acontece. Clique em Parar para encerrar ou em Editar Texto para voltar e ajustar o conteúdo a qualquer momento. Ideal para estudar, revisar documentos ouvindo, ou acessibilidade.",
    textarea_placeholder: "Cole o seu texto aqui...",
    file_btn: "Escolher Arquivo",
    engine_label: "Motor de Voz",
    engine_native: "Nativo",
    engine_chunks: "Por Partes",
    engine_manual: "Manual",
    engine_tip: "Sobre o Motor",
    engine_native_desc: "Modo padrão. Leitura rápida e contínua com pausas naturais muito curtas. Ideal para o uso diário.",
    engine_chunks_desc: "Divide o texto em partes menores para evitar travamentos ou interrupções em navegadores instáveis.",
    engine_manual_desc: "Pausas longas e explícitas a cada frase. Perfeito para acessibilidade, estudos ou acompanhamento detalhado.",
    voice_label: "Voz",
    voice_default: "Voz Padrão",
    speed_label: "Velocidade",
    pitch_label: "Tom",
    play_btn: "Iniciar Leitura",
    stop_btn: "Parar",
    edit_btn: "Editar Texto",
    read_again_btn: "Ler Novamente",
    chars_label: "Caracteres:",
    words_label: "Palavras:",
    part_label: "Parte",
    empty_msg: "Carregue um texto para começar a leitura",
    status_ready: "Sistema de voz pronto.",
    status_unsupported: "Seu navegador não suporta síntese de voz. Tente Chrome ou Edge.",
    status_loaded: "Texto carregado com sucesso!",
    status_empty_input: "Por favor, insira algum texto antes de carregar.",
    status_invalid_file: "Selecione um arquivo TXT.",
    status_file_error: "Erro ao ler o arquivo.",
    status_no_text: "Carregue um texto primeiro.",
    status_no_voices: "Nenhuma voz de leitura foi encontrada no seu dispositivo/navegador.",
    status_not_ready: "Sistema de voz não está pronto. Tente recarregar a página.",
    status_done: "Leitura concluída!",
    status_many_errors: "Muitos erros detectados. Tente trocar o motor de voz.",
    features_title: "Funcionalidades",
    f1: "Leitura em voz alta direto no navegador, sem instalar nada",
    f2: "Seleção de voz com prioridade para vozes em português",
    f3: "Controle de velocidade e tom da leitura",
    f4: "Destaque da frase atual em tempo real",
    f5: "Suporte para carregar arquivos TXT",
    f6: "Progresso em tempo real: barra, contador de frases e palavras",
    how_to_use_title: "Como usar",
    step_1_title: "Cole ou carregue o texto",
    step_1_desc: "Cole o texto na caixa ou carregue um arquivo TXT. Clique em Iniciar Leitura quando estiver pronto.",
    step_2_title: "Controle a leitura",
    step_2_desc: "Clique em Parar para encerrar a leitura e voltar ao início. Clique em Editar Texto a qualquer momento para voltar e ajustar o conteúdo.",
    step_3_title: "Ajuste voz, velocidade e tom",
    step_3_desc: "Selecione a voz preferida e ajuste a velocidade e o tom. Se houver instabilidade, experimente o modo Por Partes ou Manual.",
    use_cases_title: "Casos de Uso",
    uc1: "Estudar lendo e ouvindo o conteúdo ao mesmo tempo.",
    uc2: "Revisar textos e documentos ouvindo em vez de ler.",
    uc3: "Acessibilidade para pessoas com dificuldade de leitura visual.",
    uc4: "Praticar pronúncia ao acompanhar a leitura em tempo real.",
    faq_title: "Perguntas e Respostas",
    faq_1_q: "O leitor de texto funciona sem internet?",
    faq_1_a: "Sim. A ferramenta usa a síntese de voz nativa do seu navegador, que funciona completamente offline após o carregamento da página.",
    faq_2_q: "Quais vozes estão disponíveis?",
    faq_2_a: "As vozes disponíveis dependem do seu navegador e sistema operacional. A ferramenta prioriza automaticamente vozes em português. Chrome e Edge costumam oferecer as melhores opções.",
    faq_3_q: "Qual a diferença entre os modos de leitura?",
    faq_3_a: "O modo Nativo é o mais rápido e fluido. Por Partes faz pausas maiores entre frases, mais compatível com alguns navegadores. Manual oferece pausas ainda maiores para acompanhamento mais detalhado.",
    faq_4_q: "Quais formatos de arquivo são aceitos?",
    faq_4_a: "A ferramenta aceita arquivos de texto simples TXT. Para outros formatos como PDF ou Word, copie o conteúdo e cole diretamente na caixa de texto.",
    see1: "Calculadora de Porcentagem",
    see2: "Extrator de E-mails",
    see3: "Contador de Texto",
    see4: "Sorteador de Listas"
  },
  es: {
    title: "Lector de Texto Online Gratis — Escuchar Cualquier Texto",
    meta: "Lector de texto online gratis. Pega o carga cualquier texto y escúchalo con voces naturales. Controla la velocidad, el tono y ve la frase que se está leyendo resaltada en tiempo real.",
    desc: "Nuestro lector de texto online gratuito convierte cualquier texto en audio directamente en tu navegador, sin instalar nada. Pega un texto o carga un archivo TXT, elige la voz, ajusta la velocidad y el tono, y presiona Play. La frase actual se resalta en tiempo real mientras se lee. Haz clic en Detener para finalizar la lectura o en Editar Texto para volver y ajustar el contenido en cualquier momento. Ideal para estudiar, revisar documentos escuchando, o accesibilidad.",
    textarea_placeholder: "Pega tu texto aquí...",
    file_btn: "Elegir Archivo",
    engine_label: "Motor de Voz",
    engine_native: "Nativo",
    engine_chunks: "Por Partes",
    engine_manual: "Manual",
    engine_tip: "Sobre el Motor",
    engine_native_desc: "Modo predeterminado. Lectura rápida y continua con pausas naturales muy cortas. Ideal para el uso diario.",
    engine_chunks_desc: "Divide el texto en partes más pequeñas para evitar bloqueos o interrupciones en navegadores inestables.",
    engine_manual_desc: "Pausas largas y explícitas después de cada frase. Perfecto para accesibilidad, estudio o seguimiento detallado.",
    voice_label: "Voz",
    voice_default: "Voz Predeterminada",
    speed_label: "Velocidad",
    pitch_label: "Tono",
    play_btn: "Iniciar Lectura",
    stop_btn: "Detener",
    edit_btn: "Editar Texto",
    read_again_btn: "Leer de Nuevo",
    chars_label: "Caracteres:",
    words_label: "Palabras:",
    part_label: "Parte",
    empty_msg: "Carga un texto para comenzar la lectura",
    status_ready: "Sistema de voz listo.",
    status_unsupported: "Tu navegador no admite síntesis de voz. Prueba con Chrome o Edge.",
    status_loaded: "Archivo cargado con éxito.",
    status_empty_input: "Por favor, introduce algún texto antes de comenzar.",
    status_invalid_file: "Selecciona un archivo TXT.",
    status_file_error: "Error al leer el archivo.",
    status_no_text: "Carga un texto primero.",
    status_no_voices: "No se encontraron voces en tu dispositivo o navegador.",
    status_not_ready: "El sistema de voz no está listo. Intenta recargar la página.",
    status_done: "Lectura completada.",
    status_many_errors: "Se detectaron demasiados errores. Intenta cambiar el motor de voz.",
    features_title: "Funcionalidades",
    f1: "Texto a voz directamente en el navegador, sin instalar nada",
    f2: "Selección de voz con coincidencia automática de idioma",
    f3: "Controles ajustables de velocidad y tono",
    f4: "Frase actual resaltada en tiempo real",
    f5: "Carga de archivos TXT directamente",
    f6: "Progreso en tiempo real: barra, contador de frases y palabras",
    how_to_use_title: "Cómo usar",
    step_1_title: "Pega o carga el texto",
    step_1_desc: "Pega el texto en el cuadro o carga un archivo TXT. Haz clic en Iniciar Lectura cuando estés listo.",
    step_2_title: "Controla la reproducción",
    step_2_desc: "Haz clic en Detener para finalizar la lectura y volver al inicio. Haz clic en Editar Texto en cualquier momento para volver y ajustar el contenido.",
    step_3_title: "Ajusta voz, velocidad y tono",
    step_3_desc: "Selecciona tu voz preferida y ajusta la velocidad y el tono. Si experimentas inestabilidad, prueba el modo Por Partes o Manual.",
    use_cases_title: "Casos de Uso",
    uc1: "Estudiar leyendo y escuchando el contenido al mismo tiempo.",
    uc2: "Revisar documentos escuchando en lugar de leer.",
    uc3: "Accesibilidad para personas con dificultades visuales o de lectura.",
    uc4: "Practicar pronunciación siguiendo la lectura en tiempo real.",
    faq_title: "Preguntas y Respuestas",
    faq_1_q: "¿El lector de texto funciona sin internet?",
    faq_1_a: "Sí. La herramienta usa la síntesis de voz integrada de tu navegador, que funciona completamente sin conexión una vez cargada la página.",
    faq_2_q: "¿Qué voces están disponibles?",
    faq_2_a: "Las voces disponibles dependen de tu navegador y sistema operativo. La herramienta selecciona automáticamente una voz en el idioma correspondiente. Chrome y Edge suelen ofrecer las mejores opciones.",
    faq_3_q: "¿Cuál es la diferencia entre los modos de lectura?",
    faq_3_a: "El modo Nativo es el más rápido y fluido. Por Partes introduce pausas más largas entre frases para mayor compatibilidad con algunos navegadores. Manual añade pausas aún más largas, ideal para seguimiento detallado o accesibilidad.",
    faq_4_q: "¿Qué formatos de archivo se aceptan?",
    faq_4_a: "La herramienta acepta archivos de texto plano (TXT). Para otros formatos como PDF o Word, copia el contenido y pégalo directamente en el cuadro de texto.",
    see1: "Calculadora de Porcentajes",
    see2: "Extractor de Emails",
    see3: "Contador de Texto",
    see4: "Aleatorizador de Listas"
  },
  fr: {
    title: "Lecteur de Texte en Ligne Gratuit — Écouter N'importe Quel Texte",
    meta: "Lecteur de texte en ligne gratuit. Collez ou chargez n'importe quel texte et écoutez-le avec des voix naturelles. Contrôlez la vitesse, le ton et suivez la phrase en cours en temps réel.",
    desc: "Notre lecteur de texte en ligne gratuit convertit n'importe quel texte en audio directement dans votre navigateur, sans rien installer. Collez un texte ou chargez un fichier TXT, choisissez la voix, ajustez la vitesse et le ton, puis appuyez sur Play. La phrase en cours est mise en évidence en temps réel pendant la lecture. Cliquez sur Arrêter pour terminer la lecture ou sur Modifier le texte pour revenir et ajuster le contenu à tout moment. Idéal pour étudier, relire des documents en écoutant, ou l'accessibilité.",
    textarea_placeholder: "Collez votre texte ici...",
    file_btn: "Choisir un fichier",
    engine_label: "Moteur de voix",
    engine_native: "Natif",
    engine_chunks: "Par parties",
    engine_manual: "Manuel",
    engine_tip: "À propos du moteur",
    engine_native_desc: "Mode par défaut. Lecture rapide et continue avec des pauses naturelles très courtes. Idéal pour un usage quotidien.",
    engine_chunks_desc: "Divise le texte en parties plus petites pour éviter les blocages ou les interruptions sur les navigateurs instables.",
    engine_manual_desc: "Longues pauses explicites après chaque phrase. Parfait pour l'accessibilité, l'étude ou un suivi détaillé.",
    voice_label: "Voix",
    voice_default: "Voix par défaut",
    speed_label: "Vitesse",
    pitch_label: "Tonalité",
    play_btn: "Démarrer la lecture",
    stop_btn: "Arrêter",
    edit_btn: "Modifier le texte",
    read_again_btn: "Relire",
    chars_label: "Caractères :",
    words_label: "Mots :",
    part_label: "Partie",
    empty_msg: "Chargez un texte pour commencer la lecture",
    status_ready: "Système vocal prêt.",
    status_unsupported: "Votre navigateur ne prend pas en charge la synthèse vocale. Essayez Chrome ou Edge.",
    status_loaded: "Fichier chargé avec succès.",
    status_empty_input: "Veuillez saisir du texte avant de commencer.",
    status_invalid_file: "Veuillez sélectionner un fichier TXT.",
    status_file_error: "Erreur lors de la lecture du fichier.",
    status_no_text: "Chargez un texte en premier.",
    status_no_voices: "Aucune voix trouvée sur votre appareil ou navigateur.",
    status_not_ready: "Le système vocal n'est pas prêt. Essayez de recharger la page.",
    status_done: "Lecture terminée.",
    status_many_errors: "Trop d'erreurs détectées. Essayez de changer le moteur vocal.",
    features_title: "Fonctionnalités",
    f1: "Synthèse vocale directement dans le navigateur, sans installation",
    f2: "Sélection de voix avec correspondance automatique de la langue",
    f3: "Contrôles de vitesse et de tonalité ajustables",
    f4: "Phrase en cours mise en évidence en temps réel",
    f5: "Chargement de fichiers TXT directement",
    f6: "Progression en temps réel : barre, compteur de phrases et de mots",
    how_to_use_title: "Comment utiliser",
    step_1_title: "Collez ou chargez le texte",
    step_1_desc: "Collez le texte dans la zone ou chargez un fichier TXT. Cliquez sur Démarrer la lecture quand vous êtes prêt.",
    step_2_title: "Contrôlez la lecture",
    step_2_desc: "Cliquez sur Arrêter pour terminer la lecture et revenir au début. Cliquez sur Modifier le texte à tout moment pour revenir en arrière.",
    step_3_title: "Ajustez voix, vitesse et tonalité",
    step_3_desc: "Sélectionnez votre voix préférée et ajustez la vitesse et le ton. En cas d'instabilité, essayez le mode Par parties ou Manuel.",
    use_cases_title: "Cas d'utilisation",
    uc1: "Étudier en lisant et en écoutant le contenu en même temps.",
    uc2: "Relire des documents en écoutant plutôt qu'en lisant.",
    uc3: "Accessibilité pour les personnes ayant des difficultés visuelles ou de lecture.",
    uc4: "Pratiquer la prononciation en suivant la lecture en temps réel.",
    faq_title: "Questions et réponses",
    faq_1_q: "Le lecteur de texte fonctionne-t-il sans internet ?",
    faq_1_a: "Oui. L'outil utilise la synthèse vocale intégrée de votre navigateur, qui fonctionne entièrement hors ligne une fois la page chargée.",
    faq_2_q: "Quelles voix sont disponibles ?",
    faq_2_a: "Les voix disponibles dépendent de votre navigateur et de votre système d'exploitation. L'outil sélectionne automatiquement une voix dans la langue correspondante. Chrome et Edge offrent généralement les meilleures options.",
    faq_3_q: "Quelle est la différence entre les modes de lecture ?",
    faq_3_a: "Le mode Natif est le plus rapide et le plus fluide. Par parties introduit des pauses plus longues entre les phrases pour une meilleure compatibilité. Manuel ajoute des pauses encore plus longues, idéal pour un suivi détaillé ou l'accessibilité.",
    faq_4_q: "Quels formats de fichier sont acceptés ?",
    faq_4_a: "L'outil accepte les fichiers texte brut (TXT). Pour d'autres formats comme PDF ou Word, copiez le contenu et collez-le directement dans la zone de texte.",
    see1: "Calculatrice de Pourcentage",
    see2: "Extracteur d'Emails",
    see3: "Compteur de Texte",
    see4: "Mélangeur de Listes"
  },
  it: {
    title: "Lettore di Testo Online Gratuito — Ascolta Qualsiasi Testo",
    meta: "Lettore di testo online gratuito. Incolla o carica qualsiasi testo e ascoltalo con voci naturali. Controlla velocità, tono e segui la frase in corso evidenziata in tempo reale.",
    desc: "Il nostro lettore di testo online gratuito converte qualsiasi testo in audio direttamente nel tuo browser, senza installare nulla. Incolla un testo o carica un file TXT, scegli la voce, regola velocità e tono, poi premi Play. La frase corrente viene evidenziata in tempo reale durante la lettura. Clicca su Ferma per terminare la lettura o su Modifica testo per tornare e modificare il contenuto in qualsiasi momento. Ideale per studiare, rivedere documenti ascoltando, o accessibilità.",
    textarea_placeholder: "Incolla il tuo testo qui...",
    file_btn: "Scegli file",
    engine_label: "Motore vocale",
    engine_native: "Nativo",
    engine_chunks: "A parti",
    engine_manual: "Manuale",
    engine_tip: "Sul motore",
    engine_native_desc: "Modalità predefinita. Lettura rapida e continua con pause naturali molto brevi. Ideale per l'uso quotidiano.",
    engine_chunks_desc: "Divide il testo in parti più piccole per evitare blocchi o interruzioni nei browser instabili.",
    engine_manual_desc: "Pause lunghe ed esplicite dopo ogni frase. Perfetto per accessibilità, studio o un seguito dettagliato.",
    voice_label: "Voce",
    voice_default: "Voce predefinita",
    speed_label: "Velocità",
    pitch_label: "Tono",
    play_btn: "Avvia lettura",
    stop_btn: "Ferma",
    edit_btn: "Modifica testo",
    read_again_btn: "Leggi di nuovo",
    chars_label: "Caratteri:",
    words_label: "Parole:",
    part_label: "Parte",
    empty_msg: "Carica un testo per iniziare la lettura",
    status_ready: "Sistema vocale pronto.",
    status_unsupported: "Il tuo browser non supporta la sintesi vocale. Prova Chrome o Edge.",
    status_loaded: "File caricato con successo.",
    status_empty_input: "Inserisci del testo prima di iniziare.",
    status_invalid_file: "Seleziona un file TXT.",
    status_file_error: "Errore nella lettura del file.",
    status_no_text: "Carica prima un testo.",
    status_no_voices: "Nessuna voce trovata sul tuo dispositivo o browser.",
    status_not_ready: "Il sistema vocale non è pronto. Prova a ricaricare la pagina.",
    status_done: "Lettura completata.",
    status_many_errors: "Troppi errori rilevati. Prova a cambiare il motore vocale.",
    features_title: "Funzionalità",
    f1: "Sintesi vocale direttamente nel browser, senza installazioni",
    f2: "Selezione della voce con corrispondenza automatica della lingua",
    f3: "Controlli regolabili di velocità e tono",
    f4: "Frase corrente evidenziata in tempo reale",
    f5: "Caricamento diretto di file TXT",
    f6: "Progresso in tempo reale: barra, contatore di frasi e parole",
    how_to_use_title: "Come usare",
    step_1_title: "Incolla o carica il testo",
    step_1_desc: "Incolla il testo nella casella o carica un file TXT. Clicca su Avvia lettura quando sei pronto.",
    step_2_title: "Controlla la riproduzione",
    step_2_desc: "Clicca su Ferma per terminare la lettura e tornare all'inizio. Clicca su Modifica testo in qualsiasi momento per tornare indietro.",
    step_3_title: "Regola voce, velocità e tono",
    step_3_desc: "Seleziona la voce preferita e regola velocità e tono. In caso di instabilità, prova la modalità A parti o Manuale.",
    use_cases_title: "Casi d'uso",
    uc1: "Studiare leggendo e ascoltando il contenuto allo stesso tempo.",
    uc2: "Rivedere documenti ascoltando invece di leggere.",
    uc3: "Accessibilità per persone con difficoltà visive o di lettura.",
    uc4: "Praticare la pronuncia seguendo la lettura in tempo reale.",
    faq_title: "Domande e risposte",
    faq_1_q: "Il lettore di testo funziona senza internet?",
    faq_1_a: "Sì. Lo strumento usa la sintesi vocale integrata del browser, che funziona completamente offline dopo il caricamento della pagina.",
    faq_2_q: "Quali voci sono disponibili?",
    faq_2_a: "Le voci disponibili dipendono dal browser e dal sistema operativo. Lo strumento seleziona automaticamente una voce nella lingua corrispondente. Chrome ed Edge offrono generalmente le migliori opzioni.",
    faq_3_q: "Qual è la differenza tra le modalità di lettura?",
    faq_3_a: "La modalità Nativa è la più veloce e fluida. A parti introduce pause più lunghe tra le frasi per una migliore compatibilità. Manuale aggiunge pause ancora più lunghe, ideale per un seguito dettagliato o accessibilità.",
    faq_4_q: "Quali formati di file sono accettati?",
    faq_4_a: "Lo strumento accetta file di testo semplice (TXT). Per altri formati come PDF o Word, copia il contenuto e incollalo direttamente nella casella di testo.",
    see1: "Calcolatrice Percentuale",
    see2: "Estrattore di Email",
    see3: "Contatore di Testo",
    see4: "Randomizzatore di Liste"
  },
  id: {
    title: "Pembaca Teks Online Gratis — Dengarkan Teks Apa Saja",
    meta: "Pembaca teks online gratis. Tempel atau unggah teks apa saja dan dengarkan dengan suara alami. Atur kecepatan, nada, dan ikuti kalimat yang sedang dibaca secara real-time.",
    desc: "Pembaca teks online gratis kami mengubah teks apa saja menjadi audio langsung di browser Anda, tanpa perlu menginstal apa pun. Tempel teks atau unggah file TXT, pilih suara, atur kecepatan dan nada, lalu tekan Play. Kalimat yang sedang dibaca disorot secara real-time. Klik Berhenti untuk mengakhiri pembacaan atau Edit Teks untuk kembali dan menyesuaikan konten kapan saja. Cocok untuk belajar, memeriksa dokumen sambil mendengarkan, atau aksesibilitas.",
    textarea_placeholder: "Tempel teks Anda di sini...",
    file_btn: "Pilih File",
    engine_label: "Mesin Suara",
    engine_native: "Bawaan",
    engine_chunks: "Per Bagian",
    engine_manual: "Manual",
    engine_tip: "Tentang Mesin",
    engine_native_desc: "Mode default. Pembacaan cepat dan berkelanjutan dengan jeda alami yang sangat singkat. Ideal untuk penggunaan sehari-hari.",
    engine_chunks_desc: "Membagi teks menjadi bagian-bagian kecil untuk menghindari pembekuan atau gangguan pada browser yang tidak stabil.",
    engine_manual_desc: "Jeda panjang dan eksplisit setelah setiap kalimat. Sempurna untuk aksesibilitas, belajar, atau mengikuti bacaan secara detail.",
    voice_label: "Suara",
    voice_default: "Suara Default",
    speed_label: "Kecepatan",
    pitch_label: "Nada",
    play_btn: "Mulai Membaca",
    stop_btn: "Berhenti",
    edit_btn: "Edit Teks",
    read_again_btn: "Baca Lagi",
    chars_label: "Karakter:",
    words_label: "Kata:",
    part_label: "Bagian",
    empty_msg: "Muat teks untuk mulai membaca",
    status_ready: "Sistem suara siap.",
    status_unsupported: "Browser Anda tidak mendukung sintesis suara. Coba Chrome atau Edge.",
    status_loaded: "File berhasil dimuat.",
    status_empty_input: "Masukkan teks sebelum memulai.",
    status_invalid_file: "Pilih file TXT.",
    status_file_error: "Gagal membaca file.",
    status_no_text: "Muat teks terlebih dahulu.",
    status_no_voices: "Tidak ada suara yang ditemukan di perangkat atau browser Anda.",
    status_not_ready: "Sistem suara belum siap. Coba muat ulang halaman.",
    status_done: "Pembacaan selesai.",
    status_many_errors: "Terlalu banyak kesalahan terdeteksi. Coba ganti mesin suara.",
    features_title: "Fitur",
    f1: "Teks ke suara langsung di browser, tanpa instalasi",
    f2: "Pemilihan suara dengan pencocokan bahasa otomatis",
    f3: "Kontrol kecepatan dan nada yang dapat disesuaikan",
    f4: "Kalimat saat ini disorot secara real-time",
    f5: "Unggah file TXT langsung",
    f6: "Progres real-time: bilah, penghitung kalimat dan kata",
    how_to_use_title: "Cara menggunakan",
    step_1_title: "Tempel atau unggah teks",
    step_1_desc: "Tempel teks ke dalam kotak atau unggah file TXT. Klik Mulai Membaca saat siap.",
    step_2_title: "Kontrol pemutaran",
    step_2_desc: "Klik Berhenti untuk mengakhiri pembacaan dan kembali ke awal. Klik Edit Teks kapan saja untuk kembali dan menyesuaikan konten.",
    step_3_title: "Sesuaikan suara, kecepatan, dan nada",
    step_3_desc: "Pilih suara yang Anda inginkan dan sesuaikan kecepatan serta nada. Jika tidak stabil, coba mode Per Bagian atau Manual.",
    use_cases_title: "Kasus Penggunaan",
    uc1: "Belajar dengan membaca dan mendengarkan konten secara bersamaan.",
    uc2: "Memeriksa dokumen dengan mendengarkan alih-alih membaca.",
    uc3: "Aksesibilitas bagi pengguna dengan kesulitan visual atau membaca.",
    uc4: "Berlatih pengucapan sambil mengikuti bacaan secara real-time.",
    faq_title: "Tanya Jawab",
    faq_1_q: "Apakah pembaca teks berfungsi tanpa internet?",
    faq_1_a: "Ya. Alat ini menggunakan sintesis suara bawaan browser Anda, yang berfungsi sepenuhnya offline setelah halaman dimuat.",
    faq_2_q: "Suara apa saja yang tersedia?",
    faq_2_a: "Suara yang tersedia bergantung pada browser dan sistem operasi Anda. Alat ini secara otomatis memilih suara dalam bahasa yang sesuai. Chrome dan Edge biasanya menawarkan opsi terbaik.",
    faq_3_q: "Apa perbedaan antara mode pembacaan?",
    faq_3_a: "Mode Bawaan adalah yang paling cepat dan lancar. Per Bagian memperkenalkan jeda lebih lama antar kalimat untuk kompatibilitas lebih baik. Manual menambahkan jeda yang lebih panjang lagi, ideal untuk mengikuti bacaan secara detail atau aksesibilitas.",
    faq_4_q: "Format file apa yang diterima?",
    faq_4_a: "Alat ini menerima file teks biasa (TXT). Untuk format lain seperti PDF atau Word, salin kontennya dan tempel langsung ke kotak teks.",
    see1: "Kalkulator Persentase",
    see2: "Ekstraktor Email",
    see3: "Penghitung Teks",
    see4: "Pengacak Daftar"
  },
  de: {
    title: "Kostenloser Online-Textvorleser — Jeden Text anhören",
    meta: "Kostenloser Online-Textvorleser. Text einfügen oder TXT-Datei hochladen und mit natürlichen Stimmen anhören. Geschwindigkeit und Tonhöhe anpassen, aktuellen Satz in Echtzeit verfolgen.",
    desc: "Unser kostenloser Online-Textvorleser wandelt jeden Text direkt im Browser in Audio um — ohne Installation. Text einfügen oder TXT-Datei hochladen, Stimme auswählen, Geschwindigkeit und Tonhöhe einstellen und auf Wiedergabe drücken. Der aktuelle Satz wird in Echtzeit hervorgehoben. Klicken Sie auf Stopp, um die Wiedergabe zu beenden, oder auf Text bearbeiten, um zurückzugehen und den Inhalt jederzeit anzupassen. Ideal zum Lernen, Dokumente beim Zuhören prüfen oder für Barrierefreiheit.",
    textarea_placeholder: "Text hier einfügen...",
    file_btn: "Datei auswählen",
    engine_label: "Lesemodus",
    engine_native: "Nativ",
    engine_chunks: "Abschnitte",
    engine_manual: "Manuell",
    engine_tip: "Über Modi",
    engine_native_desc: "Standardmodus. Schnelles und flüssiges Vorlesen mit sehr kurzen natürlichen Pausen. Ideal für den täglichen Gebrauch.",
    engine_chunks_desc: "Teilt den Text in kleinere Abschnitte auf, um Einfrieren oder Störungen in instabilen Browsern zu vermeiden.",
    engine_manual_desc: "Lange und explizite Pausen nach jedem Satz. Perfekt für Barrierefreiheit, Lernen oder detailliertes Mitlesen.",
    voice_label: "Stimme",
    voice_default: "Standardstimme",
    speed_label: "Geschwindigkeit",
    pitch_label: "Tonhöhe",
    play_btn: "Vorlesen starten",
    stop_btn: "Stopp",
    edit_btn: "Text bearbeiten",
    read_again_btn: "Nochmal lesen",
    chars_label: "Zeichen:",
    words_label: "Wörter:",
    part_label: "Teil",
    empty_msg: "Text laden, um mit dem Lesen zu beginnen",
    status_ready: "Sprachsystem bereit.",
    status_unsupported: "Ihr Browser unterstützt keine Sprachsynthese. Versuchen Sie Chrome oder Edge.",
    status_loaded: "Datei erfolgreich geladen.",
    status_empty_input: "Bitte vor dem Start Text eingeben.",
    status_invalid_file: "Bitte eine TXT-Datei auswählen.",
    status_file_error: "Fehler beim Lesen der Datei.",
    status_no_text: "Bitte zuerst Text laden.",
    status_no_voices: "Keine Stimmen auf Ihrem Gerät oder Browser gefunden.",
    status_not_ready: "Sprachsystem noch nicht bereit. Bitte Seite neu laden.",
    status_done: "Vorlesen abgeschlossen.",
    status_many_errors: "Zu viele Fehler erkannt. Versuchen Sie, den Lesemodus zu wechseln.",
    features_title: "Funktionen",
    f1: "Text-zu-Sprache direkt im Browser, ohne Installation",
    f2: "Stimmenauswahl mit automatischer Sprachanpassung",
    f3: "Anpassbare Geschwindigkeits- und Tonhöhenregler",
    f4: "Aktueller Satz wird in Echtzeit hervorgehoben",
    f5: "TXT-Datei direkt hochladen",
    f6: "Echtzeit-Fortschritt: Balken, Satz- und Wortzähler",
    how_to_use_title: "So verwenden Sie es",
    step_1_title: "Text einfügen oder hochladen",
    step_1_desc: "Text in das Feld einfügen oder eine TXT-Datei hochladen. Wenn bereit, auf Vorlesen starten klicken.",
    step_2_title: "Wiedergabe steuern",
    step_2_desc: "Klicken Sie auf Stopp, um die Wiedergabe zu beenden und zum Anfang zurückzukehren. Jederzeit auf Text bearbeiten klicken, um zurückzugehen und den Inhalt anzupassen.",
    step_3_title: "Stimme, Geschwindigkeit und Tonhöhe anpassen",
    step_3_desc: "Bevorzugte Stimme auswählen und Geschwindigkeit sowie Tonhöhe einstellen. Bei Instabilität den Modus Abschnitte oder Manuell ausprobieren.",
    use_cases_title: "Anwendungsfälle",
    uc1: "Lernen durch gleichzeitiges Lesen und Hören von Inhalten.",
    uc2: "Dokumente prüfen, indem man zuhört statt liest.",
    uc3: "Barrierefreiheit für Benutzer mit Seh- oder Leseschwierigkeiten.",
    uc4: "Aussprache üben und dabei der Lesung in Echtzeit folgen.",
    faq_title: "Häufige Fragen",
    faq_1_q: "Funktioniert der Textvorleser ohne Internet?",
    faq_1_a: "Ja. Das Tool nutzt die integrierte Sprachsynthese des Browsers, die nach dem Laden der Seite vollständig offline funktioniert.",
    faq_2_q: "Welche Stimmen sind verfügbar?",
    faq_2_a: "Die verfügbaren Stimmen hängen von Browser und Betriebssystem ab. Das Tool wählt automatisch eine Stimme in der passenden Sprache aus. Chrome und Edge bieten in der Regel die besten Optionen.",
    faq_3_q: "Was ist der Unterschied zwischen den Lesemodi?",
    faq_3_a: "Der Nativ-Modus ist der schnellste und flüssigste. Abschnitte führt längere Pausen zwischen Sätzen ein für bessere Kompatibilität. Manuell fügt noch längere Pausen hinzu — ideal für detailliertes Mitlesen oder Barrierefreiheit.",
    faq_4_q: "Welche Dateiformate werden akzeptiert?",
    faq_4_a: "Das Tool akzeptiert einfache Textdateien (TXT). Für andere Formate wie PDF oder Word, Inhalt kopieren und direkt in das Textfeld einfügen.",
    see1: "Prozentrechner",
    see2: "E-Mail-Extraktor",
    see3: "Textzähler",
    see4: "Listen-Zufallsgenerator"
  },
  nl: {
    title: "Gratis Online Tekst Voorlezer — Luister naar Elke Tekst",
    meta: "Gratis online tekst voorlezer. Plak of upload tekst en luister met natuurlijke stemmen. Pas snelheid en toonhoogte aan en volg de huidige zin in realtime.",
    desc: "Onze gratis online tekst voorlezer zet elke tekst direct in uw browser om naar audio — zonder installatie. Plak tekst of upload een TXT-bestand, kies een stem, stel snelheid en toonhoogte in en druk op Afspelen. De huidige zin wordt in realtime gemarkeerd. Klik op Stoppen om het lezen te beëindigen of op Tekst bewerken om terug te gaan en de inhoud op elk moment aan te passen. Ideaal voor studeren, documenten beluisteren of toegankelijkheid.",
    textarea_placeholder: "Plak uw tekst hier...",
    file_btn: "Bestand kiezen",
    engine_label: "Leesmodus",
    engine_native: "Standaard",
    engine_chunks: "Stukken",
    engine_manual: "Handmatig",
    engine_tip: "Over modi",
    engine_native_desc: "Standaardmodus. Snel en vloeiend voorlezen met zeer korte natuurlijke pauzes. Ideaal voor dagelijks gebruik.",
    engine_chunks_desc: "Verdeelt de tekst in kleinere stukken om bevriezing of storingen in instabiele browsers te voorkomen.",
    engine_manual_desc: "Lange en expliciete pauzes na elke zin. Perfect voor toegankelijkheid, leren of gedetailleerd meelezen.",
    voice_label: "Stem",
    voice_default: "Standaardstem",
    speed_label: "Snelheid",
    pitch_label: "Toonhoogte",
    play_btn: "Beginnen met lezen",
    stop_btn: "Stoppen",
    edit_btn: "Tekst bewerken",
    read_again_btn: "Opnieuw lezen",
    chars_label: "Tekens:",
    words_label: "Woorden:",
    part_label: "Deel",
    empty_msg: "Laad tekst om te beginnen met lezen",
    status_ready: "Spraaksysteem gereed.",
    status_unsupported: "Uw browser ondersteunt geen spraaksynthese. Probeer Chrome of Edge.",
    status_loaded: "Bestand succesvol geladen.",
    status_empty_input: "Voer tekst in voor u begint.",
    status_invalid_file: "Kies een TXT-bestand.",
    status_file_error: "Fout bij het lezen van het bestand.",
    status_no_text: "Laad eerst tekst.",
    status_no_voices: "Geen stemmen gevonden op uw apparaat of browser.",
    status_not_ready: "Spraaksysteem nog niet gereed. Probeer de pagina te vernieuwen.",
    status_done: "Lezen voltooid.",
    status_many_errors: "Te veel fouten gedetecteerd. Probeer de leesmodus te wijzigen.",
    features_title: "Functies",
    f1: "Tekst-naar-spraak direct in de browser, zonder installatie",
    f2: "Stemkeuze met automatische taalovereenstemming",
    f3: "Aanpasbare snelheids- en toonhoogteregelaars",
    f4: "Huidige zin wordt in realtime gemarkeerd",
    f5: "TXT-bestand direct uploaden",
    f6: "Realtime voortgang: balk, zins- en woordenteller",
    how_to_use_title: "Hoe te gebruiken",
    step_1_title: "Tekst plakken of uploaden",
    step_1_desc: "Plak tekst in het veld of upload een TXT-bestand. Klik op Beginnen met lezen wanneer u klaar bent.",
    step_2_title: "Afspelen bedienen",
    step_2_desc: "Klik op Stoppen om het lezen te beëindigen en terug te keren naar het begin. Klik op Tekst bewerken om terug te gaan en de inhoud aan te passen.",
    step_3_title: "Stem, snelheid en toonhoogte aanpassen",
    step_3_desc: "Kies uw voorkeursstem en pas snelheid en toonhoogte aan. Bij instabiliteit kunt u de modus Stukken of Handmatig proberen.",
    use_cases_title: "Toepassingen",
    uc1: "Studeren door inhoud tegelijkertijd te lezen en te beluisteren.",
    uc2: "Documenten controleren door te luisteren in plaats van te lezen.",
    uc3: "Toegankelijkheid voor gebruikers met visuele of leesmoeilijkheden.",
    uc4: "Uitspraak oefenen terwijl u de lezing in realtime volgt.",
    faq_title: "Veelgestelde vragen",
    faq_1_q: "Werkt de tekst voorlezer zonder internet?",
    faq_1_a: "Ja. Het hulpmiddel gebruikt de ingebouwde spraaksynthese van uw browser, die volledig offline werkt na het laden van de pagina.",
    faq_2_q: "Welke stemmen zijn beschikbaar?",
    faq_2_a: "De beschikbare stemmen hangen af van uw browser en besturingssysteem. Het hulpmiddel kiest automatisch een stem in de bijpassende taal. Chrome en Edge bieden doorgaans de beste opties.",
    faq_3_q: "Wat is het verschil tussen de leesmodi?",
    faq_3_a: "De Standaard-modus is de snelste en vloeiendste. Stukken introduceert langere pauzes tussen zinnen voor betere compatibiliteit. Handmatig voegt nog langere pauzes toe — ideaal voor gedetailleerd meelezen of toegankelijkheid.",
    faq_4_q: "Welke bestandsformaten worden geaccepteerd?",
    faq_4_a: "Het hulpmiddel accepteert eenvoudige tekstbestanden (TXT). Voor andere formaten zoals PDF of Word, kopieer de inhoud en plak deze direct in het tekstveld.",
    see1: "Percentagerekenmachine",
    see2: "E-mailextractor",
    see3: "Tekstteller",
    see4: "Lijstrandomizer"
  },
  ru: {
    title: "Бесплатный онлайн-редактор текста для чтения вслух (синтезатор речи) | Онлайн",
    meta: "Бесплатный онлайн-инструмент для чтения текста вслух. Вставьте или загрузите любой текст и слушайте его с помощью естественных голосов. Настраивайте скорость, тон и следите за выделением читаемой фразы в реальном времени.",
    desc: "Наш бесплатный онлайн-инструмент для чтения текста преобразует любой текст в речь прямо в вашем браузере — без установки программ. Вставьте текст или загрузите TXT-файл, выберите голос, настройте скорость и высоту тона, а затем нажмите кнопку воспроизведения. Читаемое предложение выделяется в реальном времени. Нажмите «Стоп» для завершения чтения или «Редактировать текст», чтобы вернуться и изменить содержимое в любое время. Отлично подходит для учебы, проверки текста на слух или повышения доступности.",
    textarea_placeholder: "Вставьте ваш текст здесь...",
    file_btn: "Выбрать файл",
    engine_label: "Режим чтения",
    engine_native: "Стандартный",
    engine_chunks: "По частям",
    engine_manual: "Вручную",
    engine_tip: "О режимах",
    engine_native_desc: "Стандартный режим. Быстрое, непрерывное чтение с очень короткими естественными паузами. Идеально для повседневного использования.",
    engine_chunks_desc: "Разделяет текст на небольшие фрагменты для предотвращения зависаний или прерываний в нестабильных браузерах.",
    engine_manual_desc: "Длинные, явные паузы после каждого предложения. Идеально для людей с ограниченными возможностями, учебы или подробного отслеживания.",
    voice_label: "Голос",
    voice_default: "Голос по умолчанию",
    speed_label: "Скорость",
    pitch_label: "Высота тона",
    play_btn: "Читать вслух",
    stop_btn: "Стоп",
    edit_btn: "Редактировать текст",
    read_again_btn: "Прочитать еще раз",
    chars_label: "Символы:",
    words_label: "Слова:",
    part_label: "Часть",
    empty_msg: "Загрузите текст, чтобы начать чтение",
    status_ready: "Речевая система готова.",
    status_unsupported: "Ваш браузер не поддерживает синтез речи. Попробуйте Chrome или Edge.",
    status_loaded: "Файл успешно загружен!",
    status_empty_input: "Пожалуйста, введите текст перед началом чтения.",
    status_invalid_file: "Пожалуйста, выберите файл в формате TXT.",
    status_file_error: "Ошибка чтения файла.",
    status_no_text: "Сначала загрузите текст.",
    status_no_voices: "На вашем устройстве или в браузере не найдены голоса для чтения.",
    status_not_ready: "Речевая система не готова. Попробуйте перезагрузить страницу.",
    status_done: "Чтение завершено!",
    status_many_errors: "Обнаружено слишком много ошибок. Попробуйте изменить режим чтения.",
    features_title: "Возможности",
    f1: "Преобразование текста в речь прямо в браузере, без установки приложений",
    f2: "Выбор голоса с автоматическим подбором языка",
    f3: "Удобная регулировка скорости и высоты тона чтения",
    f4: "Подсветка текущего предложения в реальном времени",
    f5: "Прямая загрузка файлов формата TXT",
    f6: "Индикация прогресса: шкала, счетчик предложений и слов в реальном времени",
    how_to_use_title: "Инструкция по использованию",
    step_1_title: "Вставьте или загрузите текст",
    step_1_desc: "Вставьте текст в поле ввода или загрузите TXT-файл. Нажмите «Читать вслух», когда будете готовы.",
    step_2_title: "Управляйте воспроизведением",
    step_2_desc: "Нажмите «Стоп», чтобы завершить чтение и вернуться к началу. Нажмите «Редактировать текст» в любой момент, чтобы изменить содержимое.",
    step_3_title: "Настройте голос, скорость и тон",
    step_3_desc: "Выберите подходящий голос и отрегулируйте скорость и высоту тона. Если воспроизведение нестабильно, попробуйте режим «По частям» или «Вручную».",
    use_cases_title: "Варианты использования",
    uc1: "Обучение путем одновременного чтения текста и прослушивания аудио.",
    uc2: "Вычитка и проверка документов на слух вместо обычного чтения.",
    uc3: "Доступность для пользователей со слабым зрением или трудностями с чтением.",
    uc4: "Практика произношения при параллельном отслеживании текста в реальном времени.",
    faq_title: "Вопросы и ответы",
    faq_1_q: "Работает ли синтезатор речи без интернета?",
    faq_1_a: "Да. Инструмент использует встроенный синтез речи вашего браузера, который полностью автономен и работает без подключения к сети после загрузки страницы.",
    faq_2_q: "Какие голоса доступны для выбора?",
    faq_2_a: "Доступные голоса зависят от вашего браузера и операционной системы. Инструмент автоматически выбирает голос, соответствующий языку. Обычно лучшие варианты предлагают Chrome и Edge.",
    faq_3_q: "В чем разница между режимами чтения?",
    faq_3_a: "Стандартный режим — самый быстрый и естественный. Режим «По частям» вводит более длинные паузы между предложениями для лучшей совместимости с браузерами. Режим «Вручную» добавляет еще более длинные паузы, что идеально для людей с ограниченными возможностями или детальной работы.",
    faq_4_q: "Какие форматы файлов поддерживаются?",
    faq_4_a: "Инструмент принимает простые текстовые файлы (TXT). Для чтения других форматов, таких как PDF или Word, скопируйте текст и вставьте его непосредственно в поле ввода.",
    see1: "Калькулятор процентов",
    see2: "Экстрактор email",
    see3: "Счетчик текста",
    see4: "Рандомизатор списков"
  }
}
</i18n>
