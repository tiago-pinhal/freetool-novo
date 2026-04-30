<script setup lang="ts">
const { t, locale } = useI18n()

// Locale codes used by external libraries differ from the i18n codes
const cronstrueLang = computed(() => (locale.value === 'pt' ? 'pt_BR' : locale.value))
const intlLang = computed(() => (locale.value === 'pt' ? 'pt-BR' : locale.value))

const state = reactive({
  cron: '* * * * * *',
  description: '',
  cursorPos: 0,
  activeTab: 'edition',
  hasSeconds: true,
  hasError: false,
  showAds: false,
})

const stateDates = reactive({
  referenceDate: null as Date | null,
  upcomingRuns: [] as Date[],
})

let lastRunDate: Date | null = null

const cronParts = computed(() =>
  state.cron.trim().split(/\s+/).filter(Boolean)
)

const allFields = computed(() => {
  const labels = t('field').split(',')
  return [
    { label: labels[0], allowed: '0–59' },
    { label: labels[1], allowed: '0–59' },
    { label: labels[2], allowed: '0–23' },
    { label: labels[3], allowed: '1–31 ● L' },
    { label: labels[4], allowed: '1–12 ● JAN–DEC' },
    { label: labels[5], allowed: '0–6 ● SUN–SAT ● L ● #' },
  ]
})

const visibleFields = computed(() =>
  state.hasSeconds ? allFields.value : allFields.value.slice(1)
)

const faqs = computed(() =>
  Array.from({ length: 6 }, (_, i) => ({
    question: t(`faq${i + 1}q`),
    answer: t(`faq${i + 1}a`),
  }))
)

onMounted(() => {
  initReferenceDate()
  generate()
})

watch(() => state.cron, generate)
watch(() => locale.value, generate)

function updateCursorPosition(caret: number) {
  const cron = state.cron
  if (!cron.trim()) {
    state.cursorPos = -1
    return
  }

  state.hasSeconds = cronParts.value.length >= 6

  const upToCaret = cron.substring(0, caret)
  const partsCount = upToCaret.split(/\s+/).filter(Boolean).length
  const endsWithSpace = upToCaret.length > 0 && /\s$/.test(upToCaret)

  state.cursorPos = endsWithSpace ? partsCount : Math.max(0, partsCount - 1)
}

function generate() {
  state.hasSeconds = cronParts.value.length >= 6

  // Skip validation until libraries finish loading; their onload will retry.
  if (!(window as any).cronstrue || !(window as any).Cron) return

  state.hasError = false
  stateDates.upcomingRuns = []

  if (!isCronValid(state.cron)) {
    state.description = ''
    state.hasError = true
    return
  }

  if (stateDates.referenceDate) {
    stateDates.upcomingRuns = computeNextRuns(stateDates.referenceDate, 5)
  }
}

function isCronValid(expression: string): boolean {
  const cronstrue = (window as any).cronstrue
  if (!cronstrue) return false
  try {
    state.description = cronstrue.toString(expression, { locale: cronstrueLang.value })
    return true
  } catch {
    return false
  }
}

function computeNextRuns(from: Date, count: number): Date[] {
  const Cron = (window as any).Cron
  if (!Cron) return []
  try {
    const runs = new Cron(state.cron).nextRuns(count, from)
    if (runs.length) lastRunDate = runs[runs.length - 1]
    return runs
  } catch {
    return []
  }
}

function loadMoreRuns() {
  if (!lastRunDate) return
  stateDates.upcomingRuns.push(...computeNextRuns(lastRunDate, 3))
}

function initReferenceDate() {
  stateDates.referenceDate = new Date()
}

const referenceDateInput = computed({
  get: () => {
    const d = stateDates.referenceDate
    if (!d) return ''
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 16)
  },
  set: (val: string) => {
    if (!val) return
    stateDates.referenceDate = new Date(val)
    generate()
  },
})

function resetCron() {
  state.cron = '* * * * * *'
}

function formatRunDate(date: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }
  if (state.hasSeconds) opts.second = '2-digit'
  return date.toLocaleString(intlLang.value, opts)
}

function relativeFromReference(date: Date): string {
  if (!stateDates.referenceDate) return ''
  const diffMs = date.getTime() - stateDates.referenceDate.getTime()
  if (diffMs < 0) return ''

  const totalSecs = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSecs / 86400)
  const hours = Math.floor((totalSecs % 86400) / 3600)
  const mins = Math.floor((totalSecs % 3600) / 60)
  const secs = totalSecs % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (mins > 0 || (hours === 0 && days === 0)) parts.push(`${mins}min`)
  if (state.hasSeconds && (secs > 0 || (mins === 0 && hours === 0 && days === 0))) parts.push(`${secs}s`)

  return parts.join(' ')
}

function gapFromPrevious(current: Date, previous: Date): string {
  const diffMs = current.getTime() - previous.getTime()
  const totalSecs = Math.round(diffMs / 1000)
  
  if (totalSecs < 60) return `+${totalSecs}s`
  
  const totalMin = Math.floor(totalSecs / 60)
  const remSecs = totalSecs % 60
  
  if (totalMin < 60) {
    return remSecs === 0 ? `+${totalMin}min` : `+${totalMin}min ${remSecs}s`
  }
  
  const hours = Math.floor(totalMin / 60)
  const remMin = totalMin % 60
  
  if (hours < 24) {
    let res = `+${hours}h`
    if (remMin > 0) res += `${remMin}min`
    if (state.hasSeconds && remSecs > 0) res += `${remSecs}s`
    return res
  }
  
  const days = Math.floor(hours / 24)
  const remHours = hours % 24
  let res = `+${days}d`
  if (remHours > 0) res += `${remHours}h`
  if (remMin > 0) res += `${remMin}min`
  return res
}

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: Array.from({ length: 6 }, (_, i) => t(`feat${i + 1}`)),
  faq: faqs.value,
  howToName: t('t_how'),
  howToSteps: [
    { name: t('how1_t'), text: t('how1') },
    { name: t('how2_t'), text: t('how2') },
    { name: t('how3_t'), text: t('how3') },
    { name: t('how4_t'), text: t('how4') },
  ],
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
  script: [
    { src: 'https://unpkg.com/cronstrue@2/dist/cronstrue.min.js', defer: true, crossorigin: 'anonymous', referrerpolicy: 'no-referrer', onload: generate },
    { src: 'https://cdn.jsdelivr.net/npm/croner@10.0.1/dist/croner.umd.min.js', defer: true, crossorigin: 'anonymous', referrerpolicy: 'no-referrer', onload: generate },
    { src: computed(() => `https://unpkg.com/cronstrue@2/locales/${cronstrueLang.value}.min.js`), defer: true, crossorigin: 'anonymous', referrerpolicy: 'no-referrer', onload: generate },
  ],
})

defineI18nRoute({
  paths: {
    pt: '/gerador-de-crontab',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="state.showAds"
    :see-also-links="[
      { label: t('see1'), to: 'uuid-generator' },
      { label: t('see2'), to: 'fancy-letters' },
      { label: t('see3'), to: 'credit-card-generator' },
      { label: t('see4'), to: 'birthday-generator' },
    ]"
  >
    <ToolTabs
      :active-tab="state.activeTab"
      @update:active-tab="(val) => (state.activeTab = val)"
      :tabs="[
        { id: 'edition', label: t('edition') },
        { id: 'results', label: t('results') },
      ]"
    >
      <!-- Editor tab -->
      <template #edition>
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Cron input -->
          <div class="relative">
            <input
              id="cron"
              v-model="state.cron"
              type="text"
              placeholder="* * * * * *"
              autocomplete="off"
              spellcheck="false"
              :aria-label="t('title')"
              class="input input-bordered w-full h-16 text-xl sm:text-2xl font-mono pr-12 bg-base-200/50 focus:bg-base-100 focus:border-primary transition-colors tracking-wider"
              @keyup="updateCursorPosition(($event.target as HTMLInputElement).selectionStart ?? 0); state.showAds = true"
              @click="updateCursorPosition(($event.target as HTMLInputElement).selectionStart ?? 0)"
            />
            <button
              type="button"
              class="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary"
              :aria-label="t('reset')"
              @click="resetCron"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <path d="M6 6L18 18M6 18L18 6" />
              </svg>
            </button>
          </div>

          <!-- Real-time description / error -->
          <div
            v-if="state.cron"
            role="status"
            aria-live="polite"
            class="min-h-[1.25rem] mt-2 px-1 text-sm font-medium"
            :class="state.hasError ? 'text-error' : 'text-base-content/80'"
          >
            {{ state.hasError ? t('error') : state.description }}
          </div>

          <!-- Field cards dashboard -->
          <div v-if="state.cron && !state.hasError" class="p-4 bg-base-200/30 border border-base-content/5 rounded-2xl mt-4">
            <div
              class="grid grid-cols-2 sm:grid-cols-3 gap-2"
              :class="state.hasSeconds ? 'md:grid-cols-6' : 'md:grid-cols-5'"
            >
              <div
                v-for="(field, idx) in visibleFields"
                :key="idx"
                class="p-3 rounded-lg text-center border-2 transition-colors duration-200"
                :class="state.cursorPos === idx
                  ? 'bg-primary/10 border-primary'
                  : 'bg-base-200/50 border-transparent'"
              >
                <div
                  class="text-[10px] uppercase tracking-widest font-bold mb-1"
                  :class="state.cursorPos === idx ? 'text-primary' : 'text-base-content/60'"
                >
                  {{ field.label }}
                </div>
                <div
                  class="font-mono text-base sm:text-lg font-bold truncate"
                  :class="state.cursorPos === idx ? 'text-primary' : 'text-base-content'"
                >
                  {{ cronParts[idx] || '*' }}
                </div>
                <div
                  class="text-xs font-mono font-bold mt-1"
                  :class="state.cursorPos === idx ? 'text-primary' : 'text-base-content/60'"
                >
                  {{ field.allowed }}
                </div>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div v-if="state.cron" class="mt-6">
            <p class="text-xs uppercase tracking-widest text-base-content/50 mb-2 px-1">{{ t('legends') }}</p>
            <dl class="grid grid-cols-[80px_1fr] gap-y-2 gap-x-4 px-4 py-3 bg-base-200/50 rounded-lg text-sm">
              <dt class="font-mono text-primary font-bold">*</dt>
              <dd class="text-base-content/80 m-0">{{ t('all') }}</dd>
              <dt class="font-mono text-primary font-bold">X,Y</dt>
              <dd class="text-base-content/80 m-0">{{ t('in') }}</dd>
              <dt class="font-mono text-primary font-bold">X-Y</dt>
              <dd class="text-base-content/80 m-0">{{ t('from') }}</dd>
              <dt class="font-mono text-primary font-bold">*/X</dt>
              <dd class="text-base-content/80 m-0">{{ t('each') }}</dd>
              <dt class="font-mono text-primary font-bold">Y/X</dt>
              <dd class="text-base-content/80 m-0">{{ t('eachFrom') }}</dd>
            </dl>
          </div>
        </div>
      </template>

      <!-- Results tab -->
      <template #results>
        <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Reference date -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-base-200/50 rounded-lg">
            <label for="ref-date" class="font-medium text-base-content/80 text-sm">{{ t('dt') }}</label>
            <input
              id="ref-date"
              v-model="referenceDateInput"
              type="datetime-local"
              class="input input-bordered input-sm w-full sm:w-64 bg-base-100"
            />
          </div>

          <!-- Next runs list -->
          <div v-if="stateDates.upcomingRuns.length" class="space-y-1 w-fit">
            <div
              v-for="(date, i) in stateDates.upcomingRuns"
              :key="i"
              class="grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2.5rem_12rem_7rem_5rem] items-center gap-2 px-4 py-2 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors text-sm"
            >
              <span class="text-base-content/40 font-mono text-xs">#{{ i + 1 }}</span>
              <span class="font-mono text-base-content truncate">{{ formatRunDate(date) }}</span>
              <span class="text-base-content/60 text-xs whitespace-nowrap">{{ relativeFromReference(date) }}</span>
              <span class="hidden sm:inline text-base-content/40 font-mono text-[11px] text-right">
                {{ (i > 0 && stateDates.upcomingRuns[i - 1]) ? gapFromPrevious(date, stateDates.upcomingRuns[i - 1]) : '' }}
              </span>
            </div>
          </div>

          <!-- Load more -->
          <button
            v-if="stateDates.upcomingRuns.length"
            type="button"
            class="btn btn-primary w-fit"
            @click="loadMoreRuns"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {{ t('add') }}
          </button>
        </div>
      </template>
    </ToolTabs>

    <!-- Info section below tabs -->
    <template #info>
      <div class="space-y-10">
        <section>
          <p class="text-base-content/80 leading-relaxed">{{ t('d1') }}</p>
        </section>

        <FeatureSection
          :title="t('t5')"
          :items="[t('d51'), t('d52'), t('d53'), t('d54'), t('d55'), t('d56')]"
        />

        <UseCaseSection
          :title="t('t6')"
          :description="t('d6')"
          :items="[
            { title: t('d61_t'), description: t('d61_d') },
            { title: t('d62_t'), description: t('d62_d') },
            { title: t('d63_t'), description: t('d63_d') },
            { title: t('d64_t'), description: t('d64_d') },
          ]"
        />

        <!-- Special characters -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-3 flex items-center gap-2">
            <Icon name="heroicons:code-bracket-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('t7') }}
          </h2>
          <p class="text-base-content/70 text-sm mb-4">{{ t('d7') }}</p>
          <dl class="grid grid-cols-[80px_1fr] gap-y-2 gap-x-4 px-4 py-3 bg-base-200/50 rounded-lg text-sm w-fit">
            <dt class="font-mono text-primary font-bold">*</dt>
            <dd class="text-base-content/80 m-0">{{ t('d71') }}</dd>
            <dt class="font-mono text-primary font-bold">X,Y</dt>
            <dd class="text-base-content/80 m-0">{{ t('d72') }}</dd>
            <dt class="font-mono text-primary font-bold">X-Y</dt>
            <dd class="text-base-content/80 m-0">{{ t('d73') }}</dd>
            <dt class="font-mono text-primary font-bold">*/X</dt>
            <dd class="text-base-content/80 m-0">{{ t('d74') }}</dd>
          </dl>
        </section>

        <HowToSection
          :title="t('t_how')"
          :items="[
            { title: t('how1_t'), description: t('how1') },
            { title: t('how2_t'), description: t('how2') },
            { title: t('how3_t'), description: t('how3') },
            { title: t('how4_t'), description: t('how4') },
          ]"
        />

        <!-- Real-world examples -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-3 flex items-center gap-2">
            <Icon name="heroicons:light-bulb-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('t_real') }}
          </h2>
          <p class="text-sm text-base-content/60 mb-4">{{ t('real_intro') }}</p>
          <ul class="space-y-2">
            <li v-for="i in 5" :key="i" class="flex gap-3 text-sm text-base-content/80 font-mono">
              <span class="text-primary mt-0.5 shrink-0">•</span>
              <span>{{ t(`real${i}`) }}</span>
            </li>
          </ul>
        </section>

        <!-- Edge cases -->
        <section>
          <h2 class="text-2xl font-bold text-base-content mb-3 flex items-center gap-2">
            <Icon name="heroicons:exclamation-triangle-20-solid" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('t_edge') }}
          </h2>
          <p class="text-sm text-base-content/60 mb-4">{{ t('edge_intro') }}</p>
          <ul class="space-y-2">
            <li v-for="i in 3" :key="i" class="flex gap-3 text-sm text-base-content/80">
              <span class="text-primary mt-0.5 shrink-0">•</span>
              <span class="font-mono">{{ t(`edge${i}`) }}</span>
            </li>
          </ul>
        </section>

        <FaqSection :title="t('t_faq')" :items="faqs" />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Crontab Generator",
    pageTitle: "Crontab Generator Online — 5 and 6 Field Cron Expressions",
    meta: "Online crontab generator with real-time validation. Build cron expressions with 5 or 6 fields, see the natural-language translation, and preview upcoming scheduled runs.",
    d1: "Interactive editor for writing and validating crontab expressions. As you type, the tool translates the expression into plain language and calculates the next execution dates from a configurable reference date. Supports both common formats: 5 fields (standard Unix/Linux cron) and 6 fields with second-level precision (Quartz, Spring Scheduler).",
    edition: "Editor",
    results: "Results",
    error: "Invalid cron expression",
    all: "Any value in the field",
    in: "At X and Y",
    from: "From X to Y",
    each: "Every X",
    eachFrom: "Every X, starting from Y",
    legends: "Legend",
    dt: "Reference date",
    add: "Load more",
    reset: "Clear",
    field: "Second,Minute,Hour,Day,Month,Weekday",
    t5: "Structure of a cron expression",
    d51: "Second (0–59) — optional, present only in the 6-field format",
    d52: "Minute (0–59)",
    d53: "Hour (0–23)",
    d54: "Day of month (1–31)",
    d55: "Month (1–12 or JAN–DEC)",
    d56: "Day of week (0–7 or SUN–SAT, where 0 and 7 both represent Sunday)",
    t6: "Common cron expressions",
    d6: "Frequent scheduling scenarios and their cron equivalents",
    d61_t: "* * * * *",
    d61_d: "Runs every minute",
    d62_t: "0 0 * * *",
    d62_d: "Runs every day at midnight",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "At noon, Monday through Friday",
    d64_t: "0 0 1 * *",
    d64_d: "At midnight on the first day of each month",
    t7: "Special characters",
    d7: "Meaning of the symbols used in expression fields",
    d71: "Matches any value for the field. In minutes, equals 'every minute'",
    d72: "Lists specific values. In hours, '1,15' means at 1 AM and 3 PM",
    d73: "Defines a range. In weekdays, '1-5' covers Monday through Friday",
    d74: "Defines a step. In minutes, '*/2' runs every 2 minutes",
    t_how: "How to use",
    how1_t: "Type the expression",
    how1: "Paste or type any cron expression in the main field. Validation happens in real time, indicating whether the syntax is correct as you type.",
    how2_t: "Read the translation",
    how2: "Just below the input, the tool shows the expression in plain language — useful for confirming the meaning without memorizing the syntax.",
    how3_t: "Preview upcoming runs",
    how3: "On the Results tab, see the next dates the task will trigger, starting from a configurable reference date.",
    how4_t: "Load more dates",
    how4: "Use the 'Load more' button to extend the list and validate scheduling behavior over longer periods.",
    t_real: "Real-world examples",
    real_intro: "Frequent scheduling scenarios and their equivalent cron expressions",
    real1: "0 2 * * * — Daily database backup at 2 AM",
    real2: "*/15 * * * * — Health check every 15 minutes",
    real3: "0 9 * * MON — Weekly report email every Monday at 9 AM",
    real4: "0 0 1 1 * — Annual archive job, January 1st at midnight",
    real5: "0 18 * * FRI — Weekly summary every Friday at 6 PM",
    t_edge: "Edge cases and advanced patterns",
    edge_intro: "Less obvious patterns that often raise questions",
    edge1: "0,30 * * * * — Runs at minutes 0 and 30 of every hour (twice per hour)",
    edge2: "30 0 2 * * * — 6-field format: triggers exactly at 02:00:30, with second-level precision",
    edge3: "0 8-18 * * 1-5 — Every full hour from 8 AM to 6 PM, weekdays only",
    t_faq: "Frequently asked questions",
    faq1q: "What is a crontab expression?",
    faq1a: "A crontab expression is a sequence of 5 or 6 space-separated fields that defines when a scheduled task (cron job) should run on Unix-like systems. Each field represents a time unit: minute, hour, day of month, month, and day of week — with an optional seconds field at the start.",
    faq2q: "What's the difference between 5-field and 6-field cron?",
    faq2a: "The 5-field format (minute, hour, day, month, weekday) is the historical Unix cron standard. The 6-field format adds a seconds field at the start, providing finer precision. It is used by schedulers like Quartz (Java), Spring Scheduler, and some modern implementations.",
    faq3q: "How do I run a task every 5 minutes?",
    faq3a: "Use the expression */5 * * * *. The */5 notation in the minute field means 'every step of 5, starting from 0' — the task fires at minutes 0, 5, 10, 15, and so on, in every hour.",
    faq4q: "What does */N mean in a cron expression?",
    faq4a: "The */N notation means 'every N units within the field's range'. In the minute field, */2 fires every 2 minutes. In the hour field, */6 fires every 6 hours. The slash defines a step over the field's full allowed range.",
    faq5q: "Can I use names instead of numbers for months and weekdays?",
    faq5a: "Yes. The month field accepts JAN through DEC and the weekday field accepts SUN through SAT. Names are case-insensitive on most implementations. For example, 0 9 * * MON-FRI is equivalent to 0 9 * * 1-5 and fires at 9 AM on weekdays.",
    faq6q: "Can I preview when my cron expression will run?",
    faq6a: "Yes. On the Results tab in this tool, you can see the upcoming execution dates calculated from a reference date. Changing that date lets you simulate scheduling behavior at different points in time — useful for validating schedules before pushing them to production.",
    feat1: "Supports 5-field and 6-field cron expressions",
    feat2: "Real-time validation and natural-language translation",
    feat3: "Preview next runs from any reference date",
    feat4: "Second-level scheduling precision",
    feat5: "Special characters (L, #) and ranges supported",
    feat6: "Multilingual interface",
    see1: "UUID Generator",
    see2: "Fancy Letters",
    see3: "Credit Card Generator",
    see4: "Birthday Generator"
  },
  pt: {
    title: "Gerador de Crontab",
    pageTitle: "Gerador de Crontab Online — Cron de 5 e 6 Campos",
    meta: "Gerador de crontab online com validação em tempo real. Crie expressões cron de 5 ou 6 campos, visualize a tradução em linguagem natural e veja as próximas execuções agendadas.",
    d1: "Editor interativo para escrever e validar expressões crontab. Conforme você digita, a ferramenta traduz a expressão para linguagem natural e calcula as próximas datas de execução a partir de uma data de referência. Aceita os dois formatos mais comuns: 5 campos (padrão Unix/Linux) e 6 campos com precisão de segundos (Quartz, Spring Scheduler).",
    edition: "Edição",
    results: "Resultados",
    error: "Expressão cron inválida",
    all: "Qualquer valor do campo",
    in: "Em X e Y",
    from: "De X a Y",
    each: "A cada X",
    eachFrom: "A cada X, a partir de Y",
    legends: "Legenda",
    dt: "Data de referência",
    add: "Carregar mais",
    reset: "Limpar",
    field: "Segundo,Minuto,Hora,Dia,Mês,Semana",
    t5: "Estrutura de uma expressão cron",
    d51: "Segundo (0–59) — opcional, presente apenas no formato de 6 campos",
    d52: "Minuto (0–59)",
    d53: "Hora (0–23)",
    d54: "Dia do mês (1–31)",
    d55: "Mês (1–12 ou JAN–DEC)",
    d56: "Dia da semana (0–7 ou SUN–SAT, onde 0 e 7 representam domingo)",
    t6: "Exemplos comuns de expressões cron",
    d6: "Cenários frequentes de agendamento e suas expressões equivalentes",
    d61_t: "* * * * *",
    d61_d: "Executa a cada minuto",
    d62_t: "0 0 * * *",
    d62_d: "Executa todos os dias à meia-noite",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "Ao meio-dia, de segunda a sexta-feira",
    d64_t: "0 0 1 * *",
    d64_d: "À meia-noite no primeiro dia de cada mês",
    t7: "Caracteres especiais",
    d7: "Significado dos símbolos usados nos campos da expressão",
    d71: "Representa qualquer valor para o campo. Em minutos, equivale a 'todo minuto'",
    d72: "Lista valores específicos. Em horas, '1,15' significa às 1h e às 15h",
    d73: "Define um intervalo. Em dias da semana, '1-5' equivale a segunda a sexta",
    d74: "Define um passo. Em minutos, '*/2' executa a cada 2 minutos",
    t_how: "Como usar",
    how1_t: "Digite a expressão",
    how1: "Cole ou digite qualquer expressão cron no campo principal. A validação acontece em tempo real, indicando se a sintaxe está correta enquanto você digita.",
    how2_t: "Confira a tradução",
    how2: "Logo abaixo do campo, a ferramenta exibe a expressão em linguagem natural — útil para confirmar o significado sem precisar memorizar a sintaxe.",
    how3_t: "Visualize as próximas execuções",
    how3: "Na aba Resultados, veja as próximas datas em que a tarefa será disparada, partindo de uma data de referência configurável.",
    how4_t: "Carregue mais datas",
    how4: "Use o botão 'Carregar mais' para estender a lista e validar o comportamento do agendamento em prazos mais longos.",
    t_real: "Casos de uso reais",
    real_intro: "Cenários frequentes de agendamento e as expressões cron equivalentes",
    real1: "0 2 * * * — Backup diário do banco de dados às 2h",
    real2: "*/15 * * * * — Verificação de saúde a cada 15 minutos",
    real3: "0 9 * * MON — Envio de relatório semanal às segundas, 9h",
    real4: "0 0 1 1 * — Rotina anual de arquivamento, 1º de janeiro à meia-noite",
    real5: "0 18 * * FRI — Resumo da semana às sextas, 18h",
    t_edge: "Casos especiais e padrões avançados",
    edge_intro: "Padrões menos óbvios que costumam gerar dúvida",
    edge1: "0,30 * * * * — Executa nos minutos 0 e 30 de cada hora (duas vezes por hora)",
    edge2: "30 0 2 * * * — Formato de 6 campos: dispara exatamente às 02:00:30, com precisão de segundos",
    edge3: "0 8-18 * * 1-5 — A cada hora cheia das 8h às 18h, apenas em dias úteis",
    t_faq: "Perguntas frequentes",
    faq1q: "O que é uma expressão crontab?",
    faq1a: "Uma expressão crontab é uma sequência de 5 ou 6 campos separados por espaços que define o momento em que uma tarefa agendada (cron job) deve ser executada em sistemas Unix. Cada campo representa uma unidade de tempo: minuto, hora, dia do mês, mês e dia da semana — com um campo adicional opcional de segundos no início.",
    faq2q: "Qual a diferença entre cron de 5 e 6 campos?",
    faq2a: "O formato de 5 campos (minuto, hora, dia, mês, dia da semana) é o padrão histórico do cron Unix. O formato de 6 campos adiciona um campo de segundos no início, oferecendo precisão maior. É usado por agendadores como Quartz (Java), Spring Scheduler e algumas implementações modernas.",
    faq3q: "Como executar uma tarefa a cada 5 minutos?",
    faq3a: "Use a expressão */5 * * * *. A notação */5 no campo de minutos significa 'a cada passo de 5, começando do 0' — a tarefa será disparada nos minutos 0, 5, 10, 15 e assim por diante, em todas as horas.",
    faq4q: "O que significa */N em uma expressão cron?",
    faq4a: "A notação */N indica 'a cada N unidades dentro do intervalo do campo'. No campo de minutos, */2 dispara a cada 2 minutos. No campo de horas, */6 dispara a cada 6 horas. A barra define um passo (step) sobre o intervalo completo permitido pelo campo.",
    faq5q: "Posso usar nomes em vez de números para meses e dias da semana?",
    faq5a: "Sim. Os campos de mês aceitam JAN a DEC e os de dia da semana aceitam SUN a SAT. Os nomes não diferenciam maiúsculas de minúsculas na maioria das implementações. Por exemplo, 0 9 * * MON-FRI é equivalente a 0 9 * * 1-5 e dispara às 9h em todos os dias úteis.",
    faq6q: "É possível prever quando uma expressão cron será executada?",
    faq6a: "Sim. Na aba Resultados desta ferramenta, você visualiza as próximas datas de execução calculadas a partir de uma data de referência. Alterar essa data permite simular o comportamento do agendamento em diferentes pontos no tempo, útil para validar agendamentos antes de colocar em produção.",
    feat1: "Suporta expressões cron de 5 e 6 campos",
    feat2: "Validação em tempo real e tradução para linguagem natural",
    feat3: "Visualização das próximas datas a partir de qualquer ponto no tempo",
    feat4: "Precisão de agendamento em segundos",
    feat5: "Caracteres especiais (L, #) e intervalos suportados",
    feat6: "Interface multilíngue",
    see1: "Gerador de UUID",
    see2: "Letras Diferentes",
    see3: "Gerador de Cartão de Crédito",
    see4: "Gerador de Data de Nascimento"
  },
  es: {
    title: "Generador de Crontab",
    pageTitle: "Generador de Crontab Online — Cron de 5 y 6 Campos",
    meta: "Generador de crontab online con validación en tiempo real. Crea expresiones cron de 5 o 6 campos, visualiza la traducción en lenguaje natural y consulta las próximas ejecuciones programadas.",
    d1: "Editor interactivo para escribir y validar expresiones crontab. A medida que escribes, la herramienta traduce la expresión a lenguaje natural y calcula las próximas fechas de ejecución a partir de una fecha de referencia. Admite los dos formatos más comunes: 5 campos (estándar Unix/Linux) y 6 campos con precisión de segundos (Quartz, Spring Scheduler).",
    edition: "Edición",
    results: "Resultados",
    error: "Expresión cron no válida",
    all: "Cualquier valor del campo",
    in: "En X e Y",
    from: "De X a Y",
    each: "Cada X",
    eachFrom: "Cada X, a partir de Y",
    legends: "Leyenda",
    dt: "Fecha de referencia",
    add: "Cargar más",
    reset: "Limpiar",
    field: "Segundo,Minuto,Hora,Día,Mes,Semana",
    t5: "Estructura de una expresión cron",
    d51: "Segundo (0–59) — opcional, presente solo en el formato de 6 campos",
    d52: "Minuto (0–59)",
    d53: "Hora (0–23)",
    d54: "Día del mes (1–31)",
    d55: "Mes (1–12 o JAN–DEC)",
    d56: "Día de la semana (0–7 o SUN–SAT, donde 0 y 7 representan domingo)",
    t6: "Ejemplos comunes de expresiones cron",
    d6: "Escenarios frecuentes de programación y sus expresiones equivalentes",
    d61_t: "* * * * *",
    d61_d: "Se ejecuta cada minuto",
    d62_t: "0 0 * * *",
    d62_d: "Se ejecuta todos los días a medianoche",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "Al mediodía, de lunes a viernes",
    d64_t: "0 0 1 * *",
    d64_d: "A medianoche el primer día de cada mes",
    t7: "Caracteres especiales",
    d7: "Significado de los símbolos utilizados en los campos de la expresión",
    d71: "Representa cualquier valor del campo. En minutos, equivale a 'cada minuto'",
    d72: "Lista valores específicos. En horas, '1,15' significa a la 1h y a las 15h",
    d73: "Define un intervalo. En días de la semana, '1-5' equivale a lunes a viernes",
    d74: "Define un paso. En minutos, '*/2' se ejecuta cada 2 minutos",
    t_how: "Cómo usar",
    how1_t: "Escribe la expresión",
    how1: "Pega o escribe cualquier expresión cron en el campo principal. La validación ocurre en tiempo real e indica si la sintaxis es correcta mientras escribes.",
    how2_t: "Consulta la traducción",
    how2: "Justo debajo del campo, la herramienta muestra la expresión en lenguaje natural — útil para confirmar el significado sin necesidad de memorizar la sintaxis.",
    how3_t: "Visualiza las próximas ejecuciones",
    how3: "En la pestaña Resultados, consulta las próximas fechas en que se disparará la tarea, partiendo de una fecha de referencia configurable.",
    how4_t: "Carga más fechas",
    how4: "Usa el botón 'Cargar más' para extender la lista y validar el comportamiento de la programación a más largo plazo.",
    t_real: "Casos de uso reales",
    real_intro: "Escenarios frecuentes de programación y sus expresiones cron equivalentes",
    real1: "0 2 * * * — Copia de seguridad diaria de la base de datos a las 2h",
    real2: "*/15 * * * * — Verificación de estado cada 15 minutos",
    real3: "0 9 * * MON — Envío de informe semanal los lunes a las 9h",
    real4: "0 0 1 1 * — Tarea anual de archivado, 1 de enero a medianoche",
    real5: "0 18 * * FRI — Resumen semanal los viernes a las 18h",
    t_edge: "Casos especiales y patrones avanzados",
    edge_intro: "Patrones menos evidentes que suelen generar dudas",
    edge1: "0,30 * * * * — Se ejecuta en los minutos 0 y 30 de cada hora (dos veces por hora)",
    edge2: "30 0 2 * * * — Formato de 6 campos: se dispara exactamente a las 02:00:30, con precisión de segundos",
    edge3: "0 8-18 * * 1-5 — Cada hora en punto de 8h a 18h, solo en días laborables",
    t_faq: "Preguntas frecuentes",
    faq1q: "¿Qué es una expresión crontab?",
    faq1a: "Una expresión crontab es una secuencia de 5 o 6 campos separados por espacios que define el momento en que una tarea programada (cron job) debe ejecutarse en sistemas Unix. Cada campo representa una unidad de tiempo: minuto, hora, día del mes, mes y día de la semana — con un campo adicional opcional de segundos al principio.",
    faq2q: "¿Cuál es la diferencia entre cron de 5 y 6 campos?",
    faq2a: "El formato de 5 campos (minuto, hora, día, mes, día de la semana) es el estándar histórico del cron Unix. El formato de 6 campos añade un campo de segundos al principio, ofreciendo mayor precisión. Lo usan programadores como Quartz (Java), Spring Scheduler y algunas implementaciones modernas.",
    faq3q: "¿Cómo ejecutar una tarea cada 5 minutos?",
    faq3a: "Usa la expresión */5 * * * *. La notación */5 en el campo de minutos significa 'cada paso de 5, empezando desde 0' — la tarea se dispara en los minutos 0, 5, 10, 15 y así sucesivamente, en todas las horas.",
    faq4q: "¿Qué significa */N en una expresión cron?",
    faq4a: "La notación */N indica 'cada N unidades dentro del intervalo del campo'. En el campo de minutos, */2 se dispara cada 2 minutos. En el campo de horas, */6 se dispara cada 6 horas. La barra define un paso (step) sobre el intervalo completo permitido por el campo.",
    faq5q: "¿Puedo usar nombres en lugar de números para meses y días de la semana?",
    faq5a: "Sí. Los campos de mes aceptan JAN a DEC y los de día de la semana aceptan SUN a SAT. Los nombres no distinguen mayúsculas y minúsculas en la mayoría de las implementaciones. Por ejemplo, 0 9 * * MON-FRI es equivalente a 0 9 * * 1-5 y se dispara a las 9h en todos los días laborables.",
    faq6q: "¿Es posible prever cuándo se ejecutará una expresión cron?",
    faq6a: "Sí. En la pestaña Resultados de esta herramienta, visualizas las próximas fechas de ejecución calculadas a partir de una fecha de referencia. Cambiar esa fecha permite simular el comportamiento de la programación en diferentes puntos en el tiempo, útil para validar programaciones antes de pasarlas a producción.",
    feat1: "Compatible con expresiones cron de 5 y 6 campos",
    feat2: "Validación en tiempo real y traducción a lenguaje natural",
    feat3: "Visualización de las próximas fechas desde cualquier punto en el tiempo",
    feat4: "Precisión de programación en segundos",
    feat5: "Caracteres especiales (L, #) e intervalos compatibles",
    feat6: "Interfaz multilingüe",
    see1: "Generador de UUID",
    see2: "Letras Especiales",
    see3: "Generador de Tarjeta de Crédito",
    see4: "Generador de Fecha de Nacimiento",
  },
  fr: {
    see1: "Générateur de UUID",
    see2: "Lettres Différentes",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance"
  },
  it: {
    see1: "Generatore di UUID",
    see2: "Lettere Diverse",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita"
  },
  id: {
    see1: "Generator UUID",
    see2: "Huruf Berbeda",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir"
  },
}
</i18n>