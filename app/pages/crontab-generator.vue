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
  faq: faqs.value
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
    en: '/crontab-generator',
    pt: '/gerador-de-crontab',
    es: '/generador-de-crontab',
    fr: '/generateur-de-crontab',
    it: '/generatore-di-crontab',
    id: '/generator-crontab',
    de: '/crontab-generator',
    nl: '/crontab-generator',
    ru: '/generator-crontab'
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
                  :class="state.cursorPos === idx ? 'text-primary' : 'text-base-content/80'"
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
                  :class="state.cursorPos === idx ? 'text-primary' : 'text-base-content/80'"
                >
                  {{ field.allowed }}
                </div>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div v-if="state.cron" class="mt-6">
            <p class="text-xs uppercase tracking-widest text-base-content/80 mb-2 px-1">{{ t('legends') }}</p>
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
          <p class="text-base-content/90 text-sm mb-4">{{ t('d7') }}</p>
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
    t_faq: "Questions and Answers",
    faq1q: "What is a crontab expression?",
    faq1a: "A crontab expression is a sequence of 5 or 6 space-separated fields that defines when a scheduled task (cron job) should run on Unix-like systems. Each field represents a time unit: minute, hour, day of month, month, and day of week — with an optional seconds field at the start.",
    faq2q: "What's the difference between 5-field and 6-field cron?",
    faq2a: "The 5-field format (minute, hour, day, month, weekday) is the historical Unix cron standard. The 6-field format (often referred to as a 6-digit cron) adds a seconds field at the start, providing finer precision. It is used by schedulers like Quartz (Java), Spring Scheduler, and some modern implementations.",
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
    t_faq: "Perguntas e Respostas",
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
    t_faq: "Preguntas y Respuestas",
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
    title: "Générateur de Crontab",
    pageTitle: "Générateur de Crontab en Ligne — Cron à 5 et 6 Champs",
    meta: "Générateur de crontab en ligne avec validation en temps réel. Créez des expressions cron à 5 ou 6 champs, visualisez la traduction en langage naturel et consultez les prochaines exécutions planifiées.",
    d1: "Éditeur interactif pour écrire et valider des expressions crontab. Au fur et à mesure que vous tapez, l'outil traduit l'expression en langage naturel et calcule les prochaines dates d'exécution à partir d'une date de référence. Prend en charge les deux formats les plus courants : 5 champs (standard Unix/Linux) et 6 champs avec précision à la seconde (Quartz, Spring Scheduler).",
    edition: "Édition",
    results: "Résultats",
    error: "Expression cron non valide",
    all: "Toute valeur du champ",
    in: "À X et Y",
    from: "De X à Y",
    each: "Toutes les X",
    eachFrom: "Toutes les X, à partir de Y",
    legends: "Légende",
    dt: "Date de référence",
    add: "Charger plus",
    reset: "Effacer",
    field: "Seconde,Minute,Heure,Jour,Mois,Semaine",
    see1: "Générateur de UUID",
    see2: "Lettres Différentes",
    see3: "Générateur de Carte de Crédit",
    see4: "Générateur de Date de Naissance",
    t5: "Structure d'une expression cron",
    d51: "Seconde (0–59) — facultatif, présent uniquement dans le format à 6 champs",
    d52: "Minute (0–59)",
    d53: "Heure (0–23)",
    d54: "Jour du mois (1–31)",
    d55: "Mois (1–12 ou JAN–DEC)",
    d56: "Jour de la semaine (0–7 ou SUN–SAT, où 0 et 7 représentent dimanche)",
    t6: "Exemples courants d'expressions cron",
    d6: "Scénarios de planification fréquents et leurs expressions équivalentes",
    d61_t: "* * * * *",
    d61_d: "S'exécute chaque minute",
    d62_t: "0 0 * * *",
    d62_d: "S'exécute tous les jours à minuit",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "À midi, du lundi au vendredi",
    d64_t: "0 0 1 * *",
    d64_d: "À minuit le premier jour de chaque mois",
    t7: "Caractères spéciaux",
    d7: "Signification des symboles utilisés dans les champs de l'expression",
    d71: "Représente toute valeur du champ. Pour les minutes, équivaut à « chaque minute »",
    d72: "Liste des valeurs spécifiques. Pour les heures, « 1,15 » signifie à 1 h et à 15 h",
    d73: "Définit un intervalle. Pour les jours de la semaine, « 1-5 » équivaut à lundi au vendredi",
    d74: "Définit un pas. Pour les minutes, « */2 » s'exécute toutes les 2 minutes",
    t_how: "Comment utiliser",
    how1_t: "Saisissez l'expression",
    how1: "Collez ou saisissez n'importe quelle expression cron dans le champ principal. La validation se fait en temps réel et indique si la syntaxe est correcte au fur et à mesure que vous tapez.",
    how2_t: "Consultez la traduction",
    how2: "Juste sous le champ, l'outil affiche l'expression en langage naturel — utile pour confirmer le sens sans avoir à mémoriser la syntaxe.",
    how3_t: "Visualisez les prochaines exécutions",
    how3: "Dans l'onglet Résultats, consultez les prochaines dates auxquelles la tâche se déclenchera, à partir d'une date de référence configurable.",
    how4_t: "Chargez plus de dates",
    how4: "Utilisez le bouton « Charger plus » pour étendre la liste et valider le comportement de la planification sur de plus longues périodes.",
    t_real: "Cas d'usage réels",
    real_intro: "Scénarios de planification fréquents et les expressions cron équivalentes",
    real1: "0 2 * * * — Sauvegarde quotidienne de la base de données à 2 h",
    real2: "*/15 * * * * — Vérification de l'état toutes les 15 minutes",
    real3: "0 9 * * MON — Envoi du rapport hebdomadaire le lundi à 9 h",
    real4: "0 0 1 1 * — Tâche annuelle d'archivage, le 1er janvier à minuit",
    real5: "0 18 * * FRI — Résumé hebdomadaire le vendredi à 18 h",
    t_edge: "Cas particuliers et motifs avancés",
    edge_intro: "Motifs moins évidents qui suscitent souvent des questions",
    edge1: "0,30 * * * * — S'exécute aux minutes 0 et 30 de chaque heure (deux fois par heure)",
    edge2: "30 0 2 * * * — Format à 6 champs : se déclenche exactement à 02:00:30, avec précision à la seconde",
    edge3: "0 8-18 * * 1-5 — Chaque heure pleine de 8 h à 18 h, uniquement les jours ouvrés",
    t_faq: "Questions et Réponses",
    faq1q: "Qu'est-ce qu'une expression crontab ?",
    faq1a: "Une expression crontab est une séquence de 5 ou 6 champs séparés par des espaces qui définit le moment où une tâche planifiée (cron job) doit s'exécuter sur les systèmes Unix. Chaque champ représente une unité de temps : minute, heure, jour du mois, mois et jour de la semaine — avec un champ supplémentaire facultatif pour les secondes au début.",
    faq2q: "Quelle est la différence entre cron à 5 et 6 champs ?",
    faq2a: "Le format à 5 champs (minute, heure, jour, mois, jour de la semaine) est le standard historique du cron Unix. Le format à 6 champs ajoute un champ de secondes au début, offrant une précision accrue. Il est utilisé par des planificateurs comme Quartz (Java), Spring Scheduler et certaines implémentations modernes.",
    faq3q: "Comment exécuter une tâche toutes les 5 minutes ?",
    faq3a: "Utilisez l'expression */5 * * * *. La notation */5 dans le champ des minutes signifie « tous les pas de 5, en partant de 0 » — la tâche se déclenche aux minutes 0, 5, 10, 15 et ainsi de suite, à chaque heure.",
    faq4q: "Que signifie */N dans une expression cron ?",
    faq4a: "La notation */N indique « toutes les N unités dans la plage du champ ». Dans le champ des minutes, */2 se déclenche toutes les 2 minutes. Dans le champ des heures, */6 se déclenche toutes les 6 heures. La barre oblique définit un pas (step) sur la plage complète autorisée par le champ.",
    faq5q: "Puis-je utiliser des noms à la place des numéros pour les mois et les jours de la semaine ?",
    faq5a: "Oui. Les champs de mois acceptent JAN à DEC et ceux des jours de la semaine acceptent SUN à SAT. Les noms ne font pas la distinction entre majuscules et minuscules dans la plupart des implémentations. Par exemple, 0 9 * * MON-FRI équivaut à 0 9 * * 1-5 et se déclenche à 9 h tous les jours ouvrés.",
    faq6q: "Est-il possible de prévoir quand une expression cron sera exécutée ?",
    faq6a: "Oui. Dans l'onglet Résultats de cet outil, vous visualisez les prochaines dates d'exécution calculées à partir d'une date de référence. Modifier cette date permet de simuler le comportement de la planification à différents moments — utile pour valider les planifications avant leur passage en production.",
    feat1: "Compatible avec les expressions cron à 5 et 6 champs",
    feat2: "Validation en temps réel et traduction en langage naturel",
    feat3: "Visualisation des prochaines dates depuis n'importe quel point dans le temps",
    feat4: "Précision de planification à la seconde",
    feat5: "Caractères spéciaux (L, #) et intervalles pris en charge",
    feat6: "Interface multilingue"
  },
  it: {
    title: "Generatore di Crontab",
    pageTitle: "Generatore di Crontab Online — Cron a 5 e 6 Campi",
    meta: "Generatore di crontab online con validazione in tempo reale. Crea espressioni cron a 5 o 6 campi, visualizza la traduzione in linguaggio naturale e consulta le prossime esecuzioni pianificate.",
    d1: "Editor interattivo per scrivere e validare espressioni crontab. Mentre digiti, lo strumento traduce l'espressione in linguaggio naturale e calcola le prossime date di esecuzione a partire da una data di riferimento. Supporta i due formati più comuni: 5 campi (standard Unix/Linux) e 6 campi con precisione al secondo (Quartz, Spring Scheduler).",
    edition: "Modifica",
    results: "Risultati",
    error: "Espressione cron non valida",
    all: "Qualsiasi valore del campo",
    in: "A X e Y",
    from: "Da X a Y",
    each: "Ogni X",
    eachFrom: "Ogni X, a partire da Y",
    legends: "Legenda",
    dt: "Data di riferimento",
    add: "Carica altri",
    reset: "Cancella",
    field: "Secondo,Minuto,Ora,Giorno,Mese,Settimana",
    see1: "Generatore di UUID",
    see2: "Lettere Diverse",
    see3: "Generatore di Carte di Credito",
    see4: "Generatore di Data di Nascita",
    t5: "Struttura di un'espressione cron",
    d51: "Secondo (0–59) — facoltativo, presente solo nel formato a 6 campi",
    d52: "Minuto (0–59)",
    d53: "Ora (0–23)",
    d54: "Giorno del mese (1–31)",
    d55: "Mese (1–12 o JAN–DEC)",
    d56: "Giorno della settimana (0–7 o SUN–SAT, dove 0 e 7 rappresentano la domenica)",
    t6: "Esempi comuni di espressioni cron",
    d6: "Scenari di pianificazione frequenti e le loro espressioni equivalenti",
    d61_t: "* * * * *",
    d61_d: "Viene eseguito ogni minuto",
    d62_t: "0 0 * * *",
    d62_d: "Viene eseguito ogni giorno a mezzanotte",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "A mezzogiorno, dal lunedì al venerdì",
    d64_t: "0 0 1 * *",
    d64_d: "A mezzanotte il primo giorno di ogni mese",
    t7: "Caratteri speciali",
    d7: "Significato dei simboli utilizzati nei campi dell'espressione",
    d71: "Rappresenta qualsiasi valore del campo. Per i minuti, equivale a 'ogni minuto'",
    d72: "Elenca valori specifici. Per le ore, '1,15' significa all'1 e alle 15",
    d73: "Definisce un intervallo. Per i giorni della settimana, '1-5' equivale a lunedì-venerdì",
    d74: "Definisce un passo. Per i minuti, '*/2' viene eseguito ogni 2 minuti",
    t_how: "Come si usa",
    how1_t: "Digita l'espressione",
    how1: "Incolla o digita qualsiasi espressione cron nel campo principale. La validazione avviene in tempo reale e indica se la sintassi è corretta mentre digiti.",
    how2_t: "Consulta la traduzione",
    how2: "Subito sotto il campo, lo strumento mostra l'espressione in linguaggio naturale — utile per confermare il significato senza dover memorizzare la sintassi.",
    how3_t: "Visualizza le prossime esecuzioni",
    how3: "Nella scheda Risultati, consulta le prossime date in cui l'attività verrà attivata, partendo da una data di riferimento configurabile.",
    how4_t: "Carica altre date",
    how4: "Usa il pulsante 'Carica altri' per estendere l'elenco e validare il comportamento della pianificazione su periodi più lunghi.",
    t_real: "Casi d'uso reali",
    real_intro: "Scenari di pianificazione frequenti e le espressioni cron equivalenti",
    real1: "0 2 * * * — Backup giornaliero del database alle 2",
    real2: "*/15 * * * * — Controllo dello stato ogni 15 minuti",
    real3: "0 9 * * MON — Invio del report settimanale il lunedì alle 9",
    real4: "0 0 1 1 * — Attività annuale di archiviazione, il 1° gennaio a mezzanotte",
    real5: "0 18 * * FRI — Riepilogo settimanale il venerdì alle 18",
    t_edge: "Casi particolari e schemi avanzati",
    edge_intro: "Schemi meno evidenti che spesso generano dubbi",
    edge1: "0,30 * * * * — Viene eseguito ai minuti 0 e 30 di ogni ora (due volte all'ora)",
    edge2: "30 0 2 * * * — Formato a 6 campi: si attiva esattamente alle 02:00:30, con precisione al secondo",
    edge3: "0 8-18 * * 1-5 — A ogni ora piena dalle 8 alle 18, solo nei giorni feriali",
    t_faq: "Domande e Risposte",
    faq1q: "Che cos'è un'espressione crontab?",
    faq1a: "Un'espressione crontab è una sequenza di 5 o 6 campi separati da spazi che definisce il momento in cui un'attività pianificata (cron job) deve essere eseguita sui sistemi Unix. Ogni campo rappresenta un'unità di tempo: minuto, ora, giorno del mese, mese e giorno della settimana — con un campo aggiuntivo facoltativo per i secondi all'inizio.",
    faq2q: "Qual è la differenza tra cron a 5 e 6 campi?",
    faq2a: "Il formato a 5 campi (minuto, ora, giorno, mese, giorno della settimana) è lo standard storico del cron Unix. Il formato a 6 campi aggiunge un campo per i secondi all'inizio, offrendo una precisione maggiore. È utilizzato da pianificatori come Quartz (Java), Spring Scheduler e alcune implementazioni moderne.",
    faq3q: "Come eseguire un'attività ogni 5 minuti?",
    faq3a: "Usa l'espressione */5 * * * *. La notazione */5 nel campo dei minuti significa 'ogni passo di 5, partendo da 0' — l'attività si attiva ai minuti 0, 5, 10, 15 e così via, in tutte le ore.",
    faq4q: "Cosa significa */N in un'espressione cron?",
    faq4a: "La notazione */N indica 'ogni N unità all'interno dell'intervallo del campo'. Nel campo dei minuti, */2 si attiva ogni 2 minuti. Nel campo delle ore, */6 si attiva ogni 6 ore. La barra definisce un passo (step) sull'intero intervallo consentito dal campo.",
    faq5q: "Posso usare nomi al posto dei numeri per mesi e giorni della settimana?",
    faq5a: "Sì. I campi del mese accettano JAN-DEC e quelli del giorno della settimana accettano SUN-SAT. I nomi non fanno distinzione tra maiuscole e minuscole nella maggior parte delle implementazioni. Ad esempio, 0 9 * * MON-FRI equivale a 0 9 * * 1-5 e si attiva alle 9 in tutti i giorni feriali.",
    faq6q: "È possibile prevedere quando un'espressione cron verrà eseguita?",
    faq6a: "Sì. Nella scheda Risultati di questo strumento, visualizzi le prossime date di esecuzione calcolate a partire da una data di riferimento. Modificare questa data permette di simulare il comportamento della pianificazione in diversi momenti, utile per validare le pianificazioni prima di metterle in produzione.",
    feat1: "Compatibile con espressioni cron a 5 e 6 campi",
    feat2: "Validazione in tempo reale e traduzione in linguaggio naturale",
    feat3: "Visualizzazione delle prossime date da qualsiasi punto temporale",
    feat4: "Precisione di pianificazione al secondo",
    feat5: "Caratteri speciali (L, #) e intervalli supportati",
    feat6: "Interfaccia multilingue"
  },
  id: {
    title: "Generator Crontab",
    pageTitle: "Generator Crontab Online — Cron 5 dan 6 Bidang",
    meta: "Generator crontab online dengan validasi waktu nyata. Buat ekspresi cron 5 atau 6 bidang, lihat terjemahan dalam bahasa alami, dan pratinjau eksekusi terjadwal berikutnya.",
    d1: "Editor interaktif untuk menulis dan memvalidasi ekspresi crontab. Saat Anda mengetik, alat ini menerjemahkan ekspresi ke dalam bahasa alami dan menghitung tanggal eksekusi berikutnya dari tanggal referensi yang dapat dikonfigurasi. Mendukung dua format paling umum: 5 bidang (standar Unix/Linux) dan 6 bidang dengan presisi detik (Quartz, Spring Scheduler).",
    edition: "Editor",
    results: "Hasil",
    error: "Ekspresi cron tidak valid",
    all: "Setiap nilai pada bidang",
    in: "Pada X dan Y",
    from: "Dari X sampai Y",
    each: "Setiap X",
    eachFrom: "Setiap X, mulai dari Y",
    legends: "Legenda",
    dt: "Tanggal referensi",
    add: "Muat lebih banyak",
    reset: "Bersihkan",
    field: "Detik,Menit,Jam,Hari,Bulan,Minggu",
    see1: "Generator UUID",
    see2: "Huruf Berbeda",
    see3: "Generator Kartu Kredit",
    see4: "Generator Tanggal Lahir",
    t5: "Struktur ekspresi cron",
    d51: "Detik (0–59) — opsional, hanya pada format 6 bidang",
    d52: "Menit (0–59)",
    d53: "Jam (0–23)",
    d54: "Hari dalam bulan (1–31)",
    d55: "Bulan (1–12 atau JAN–DEC)",
    d56: "Hari dalam minggu (0–7 atau SUN–SAT, di mana 0 dan 7 mewakili Minggu)",
    t6: "Contoh ekspresi cron yang umum",
    d6: "Skenario penjadwalan yang sering digunakan dan ekspresi setaranya",
    d61_t: "* * * * *",
    d61_d: "Berjalan setiap menit",
    d62_t: "0 0 * * *",
    d62_d: "Berjalan setiap hari pada tengah malam",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "Pada tengah hari, Senin sampai Jumat",
    d64_t: "0 0 1 * *",
    d64_d: "Pada tengah malam di hari pertama setiap bulan",
    t7: "Karakter khusus",
    d7: "Arti simbol yang digunakan dalam bidang ekspresi",
    d71: "Mewakili nilai apa pun untuk bidang. Pada menit, setara dengan 'setiap menit'",
    d72: "Mendaftar nilai tertentu. Pada jam, '1,15' berarti pukul 1 dan pukul 15",
    d73: "Mendefinisikan rentang. Pada hari dalam minggu, '1-5' setara dengan Senin sampai Jumat",
    d74: "Mendefinisikan langkah. Pada menit, '*/2' berjalan setiap 2 menit",
    t_how: "Cara menggunakan",
    how1_t: "Ketik ekspresi",
    how1: "Tempel atau ketik ekspresi cron apa pun di bidang utama. Validasi terjadi secara waktu nyata, menunjukkan apakah sintaksis sudah benar saat Anda mengetik.",
    how2_t: "Baca terjemahannya",
    how2: "Tepat di bawah bidang, alat ini menampilkan ekspresi dalam bahasa alami — berguna untuk mengonfirmasi makna tanpa perlu menghafal sintaksisnya.",
    how3_t: "Pratinjau eksekusi berikutnya",
    how3: "Di tab Hasil, lihat tanggal-tanggal berikutnya saat tugas akan dijalankan, dimulai dari tanggal referensi yang dapat dikonfigurasi.",
    how4_t: "Muat lebih banyak tanggal",
    how4: "Gunakan tombol 'Muat lebih banyak' untuk memperluas daftar dan memvalidasi perilaku penjadwalan dalam jangka waktu yang lebih panjang.",
    t_real: "Contoh kasus nyata",
    real_intro: "Skenario penjadwalan yang sering digunakan dan ekspresi cron setaranya",
    real1: "0 2 * * * — Pencadangan basis data harian pada pukul 02.00",
    real2: "*/15 * * * * — Pemeriksaan status setiap 15 menit",
    real3: "0 9 * * MON — Pengiriman laporan mingguan setiap Senin pukul 09.00",
    real4: "0 0 1 1 * — Tugas pengarsipan tahunan, 1 Januari pada tengah malam",
    real5: "0 18 * * FRI — Ringkasan mingguan setiap Jumat pukul 18.00",
    t_edge: "Kasus khusus dan pola lanjutan",
    edge_intro: "Pola yang kurang jelas dan sering menimbulkan pertanyaan",
    edge1: "0,30 * * * * — Berjalan pada menit ke-0 dan ke-30 setiap jam (dua kali per jam)",
    edge2: "30 0 2 * * * — Format 6 bidang: dipicu tepat pada 02:00:30, dengan presisi detik",
    edge3: "0 8-18 * * 1-5 — Setiap jam penuh dari pukul 08.00 sampai 18.00, hanya pada hari kerja",
    t_faq: "Pertanyaan dan Jawaban",
    faq1q: "Apa itu ekspresi crontab?",
    faq1a: "Ekspresi crontab adalah rangkaian 5 atau 6 bidang yang dipisahkan oleh spasi dan menentukan kapan tugas terjadwal (cron job) harus dijalankan pada sistem Unix. Setiap bidang mewakili unit waktu: menit, jam, hari dalam bulan, bulan, dan hari dalam minggu — dengan bidang detik tambahan yang opsional di awal.",
    faq2q: "Apa perbedaan antara cron 5 dan 6 bidang?",
    faq2a: "Format 5 bidang (menit, jam, hari, bulan, hari dalam minggu) adalah standar historis cron Unix. Format 6 bidang menambahkan bidang detik di awal, memberikan presisi yang lebih tinggi. Format ini digunakan oleh penjadwal seperti Quartz (Java), Spring Scheduler, dan beberapa implementasi modern.",
    faq3q: "Bagaimana cara menjalankan tugas setiap 5 menit?",
    faq3a: "Gunakan ekspresi */5 * * * *. Notasi */5 pada bidang menit berarti 'setiap kelipatan 5, dimulai dari 0' — tugas akan dipicu pada menit 0, 5, 10, 15, dan seterusnya, di setiap jam.",
    faq4q: "Apa arti */N dalam ekspresi cron?",
    faq4a: "Notasi */N berarti 'setiap N unit dalam rentang bidang'. Pada bidang menit, */2 dipicu setiap 2 menit. Pada bidang jam, */6 dipicu setiap 6 jam. Garis miring mendefinisikan langkah (step) pada seluruh rentang yang diizinkan oleh bidang.",
    faq5q: "Bisakah saya menggunakan nama daripada angka untuk bulan dan hari dalam minggu?",
    faq5a: "Bisa. Bidang bulan menerima JAN sampai DEC dan bidang hari dalam minggu menerima SUN sampai SAT. Pada sebagian besar implementasi, nama tidak membedakan huruf besar dan kecil. Misalnya, 0 9 * * MON-FRI setara dengan 0 9 * * 1-5 dan dipicu pukul 09.00 pada hari kerja.",
    faq6q: "Apakah mungkin memprediksi kapan ekspresi cron akan dijalankan?",
    faq6a: "Bisa. Di tab Hasil pada alat ini, Anda dapat melihat tanggal eksekusi berikutnya yang dihitung dari tanggal referensi. Mengubah tanggal tersebut memungkinkan Anda menyimulasikan perilaku penjadwalan pada titik waktu yang berbeda — berguna untuk memvalidasi penjadwalan sebelum diterapkan ke produksi.",
    feat1: "Mendukung ekspresi cron 5 dan 6 bidang",
    feat2: "Validasi waktu nyata dan terjemahan dalam bahasa alami",
    feat3: "Pratinjau tanggal berikutnya dari titik waktu mana pun",
    feat4: "Presisi penjadwalan hingga detik",
    feat5: "Mendukung karakter khusus (L, #) dan rentang",
    feat6: "Antarmuka multibahasa"
  },
  de: {
    title: "Crontab-Generator",
    pageTitle: "Crontab-Generator Online — Cron mit 5 und 6 Feldern",
    meta: "Online-Crontab-Generator mit Echtzeitvalidierung. Erstellen Sie Cron-Ausdrücke mit 5 oder 6 Feldern, sehen Sie die Übersetzung in natürlicher Sprache und betrachten Sie die nächsten geplanten Ausführungen.",
    d1: "Interaktiver Editor zum Schreiben und Validieren von Crontab-Ausdrücken. Während Sie tippen, übersetzt das Tool den Ausdruck in natürliche Sprache und berechnet die nächsten Ausführungstermine ab einem konfigurierbaren Referenzdatum. Unterstützt die beiden gängigsten Formate: 5 Felder (Unix/Linux-Standard) und 6 Felder mit Sekundengenauigkeit (Quartz, Spring Scheduler).",
    edition: "Editor",
    results: "Ergebnisse",
    error: "Ungültiger Cron-Ausdruck",
    all: "Jeder Wert des Feldes",
    in: "Bei X und Y",
    from: "Von X bis Y",
    each: "Alle X",
    eachFrom: "Alle X, beginnend bei Y",
    legends: "Legende",
    dt: "Referenzdatum",
    add: "Mehr laden",
    reset: "Zurücksetzen",
    field: "Sekunde,Minute,Stunde,Tag,Monat,Woche",
    see1: "UUID-Generator",
    see2: "Schöne Schriften",
    see3: "Kreditkarten-Generator",
    see4: "Geburtsdatum-Generator",
    t5: "Aufbau eines Cron-Ausdrucks",
    d51: "Sekunde (0–59) — optional, nur im 6-Feld-Format vorhanden",
    d52: "Minute (0–59)",
    d53: "Stunde (0–23)",
    d54: "Tag des Monats (1–31)",
    d55: "Monat (1–12 oder JAN–DEC)",
    d56: "Wochentag (0–7 oder SUN–SAT, wobei 0 und 7 für Sonntag stehen)",
    t6: "Häufige Cron-Ausdrücke",
    d6: "Übliche Zeitplanungsszenarien und ihre entsprechenden Ausdrücke",
    d61_t: "* * * * *",
    d61_d: "Wird jede Minute ausgeführt",
    d62_t: "0 0 * * *",
    d62_d: "Wird täglich um Mitternacht ausgeführt",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "Mittags, von Montag bis Freitag",
    d64_t: "0 0 1 * *",
    d64_d: "Um Mitternacht am ersten Tag jedes Monats",
    t7: "Sonderzeichen",
    d7: "Bedeutung der in den Ausdrucksfeldern verwendeten Symbole",
    d71: "Steht für jeden beliebigen Wert des Feldes. Bei Minuten entspricht dies „jede Minute“",
    d72: "Listet bestimmte Werte auf. Bei Stunden bedeutet „1,15“ um 1 Uhr und um 15 Uhr",
    d73: "Definiert einen Bereich. Bei Wochentagen entspricht „1-5“ Montag bis Freitag",
    d74: "Definiert einen Schritt. Bei Minuten wird „*/2“ alle 2 Minuten ausgeführt",
    t_how: "Anwendung",
    how1_t: "Ausdruck eingeben",
    how1: "Fügen Sie einen beliebigen Cron-Ausdruck in das Hauptfeld ein oder tippen Sie ihn. Die Validierung erfolgt in Echtzeit und zeigt während der Eingabe an, ob die Syntax korrekt ist.",
    how2_t: "Übersetzung lesen",
    how2: "Direkt unter dem Feld zeigt das Tool den Ausdruck in natürlicher Sprache an — nützlich, um die Bedeutung zu bestätigen, ohne die Syntax auswendig zu lernen.",
    how3_t: "Nächste Ausführungen anzeigen",
    how3: "Wechseln Sie zur Registerkarte Ergebnisse, um die nächsten Termine zu sehen, an denen die Aufgabe ausgelöst wird, ausgehend von einem konfigurierbaren Referenzdatum.",
    how4_t: "Weitere Termine laden",
    how4: "Verwenden Sie die Schaltfläche „Mehr laden“, um die Liste zu erweitern und das Verhalten der Zeitplanung über längere Zeiträume zu überprüfen.",
    t_real: "Praxisbeispiele",
    real_intro: "Übliche Zeitplanungsszenarien und die entsprechenden Cron-Ausdrücke",
    real1: "0 2 * * * — Tägliches Datenbank-Backup um 2 Uhr",
    real2: "*/15 * * * * — Statusprüfung alle 15 Minuten",
    real3: "0 9 * * MON — Wöchentlicher Bericht jeden Montag um 9 Uhr",
    real4: "0 0 1 1 * — Jährliche Archivierung am 1. Januar um Mitternacht",
    real5: "0 18 * * FRI — Wochenzusammenfassung jeden Freitag um 18 Uhr",
    t_edge: "Sonderfälle und fortgeschrittene Muster",
    edge_intro: "Weniger offensichtliche Muster, die häufig Fragen aufwerfen",
    edge1: "0,30 * * * * — Wird zur Minute 0 und 30 jeder Stunde ausgeführt (zweimal pro Stunde)",
    edge2: "30 0 2 * * * — 6-Feld-Format: löst exakt um 02:00:30 aus, mit Sekundengenauigkeit",
    edge3: "0 8-18 * * 1-5 — Zu jeder vollen Stunde von 8 bis 18 Uhr, nur an Werktagen",
    t_faq: "Fragen und Antworten",
    faq1q: "Was ist ein Crontab-Ausdruck?",
    faq1a: "Ein Crontab-Ausdruck ist eine Folge von 5 oder 6 durch Leerzeichen getrennten Feldern, die festlegt, wann eine geplante Aufgabe (Cron-Job) auf Unix-Systemen ausgeführt werden soll. Jedes Feld steht für eine Zeiteinheit: Minute, Stunde, Tag des Monats, Monat und Wochentag — mit einem optionalen Sekundenfeld am Anfang.",
    faq2q: "Was ist der Unterschied zwischen Cron mit 5 und 6 Feldern?",
    faq2a: "Das 5-Feld-Format (Minute, Stunde, Tag, Monat, Wochentag) ist der historische Standard von Unix-Cron. Das 6-Feld-Format ergänzt am Anfang ein Sekundenfeld und bietet damit eine höhere Genauigkeit. Es wird von Schedulern wie Quartz (Java), Spring Scheduler und einigen modernen Implementierungen verwendet.",
    faq3q: "Wie führe ich eine Aufgabe alle 5 Minuten aus?",
    faq3a: "Verwenden Sie den Ausdruck */5 * * * *. Die Notation */5 im Minutenfeld bedeutet „in 5er-Schritten ab 0“ — die Aufgabe wird zu den Minuten 0, 5, 10, 15 und so weiter in jeder Stunde ausgelöst.",
    faq4q: "Was bedeutet */N in einem Cron-Ausdruck?",
    faq4a: "Die Notation */N bedeutet „alle N Einheiten innerhalb des Feldbereichs“. Im Minutenfeld wird */2 alle 2 Minuten ausgelöst. Im Stundenfeld wird */6 alle 6 Stunden ausgelöst. Der Schrägstrich definiert einen Schritt über den gesamten zulässigen Bereich des Feldes.",
    faq5q: "Kann ich für Monate und Wochentage Namen statt Zahlen verwenden?",
    faq5a: "Ja. Das Monatsfeld akzeptiert JAN bis DEC und das Wochentagsfeld akzeptiert SUN bis SAT. Bei den meisten Implementierungen wird zwischen Groß- und Kleinschreibung nicht unterschieden. Zum Beispiel ist 0 9 * * MON-FRI gleichbedeutend mit 0 9 * * 1-5 und wird an allen Werktagen um 9 Uhr ausgelöst.",
    faq6q: "Lässt sich vorhersagen, wann ein Cron-Ausdruck ausgeführt wird?",
    faq6a: "Ja. In der Registerkarte Ergebnisse dieses Tools werden die nächsten Ausführungstermine ausgehend von einem Referenzdatum berechnet. Durch Ändern dieses Datums lässt sich das Zeitplanverhalten zu unterschiedlichen Zeitpunkten simulieren — nützlich, um Zeitpläne vor dem Einsatz in der Produktion zu validieren.",
    feat1: "Unterstützt Cron-Ausdrücke mit 5 und 6 Feldern",
    feat2: "Echtzeitvalidierung und Übersetzung in natürliche Sprache",
    feat3: "Vorschau der nächsten Termine ab einem beliebigen Zeitpunkt",
    feat4: "Zeitplanung mit Sekundengenauigkeit",
    feat5: "Sonderzeichen (L, #) und Bereiche werden unterstützt",
    feat6: "Mehrsprachige Oberfläche"
  },
  nl: {
    title: "Crontab-generator",
    pageTitle: "Online crontab-generator — Cron-expressies met 5 en 6 velden",
    meta: "Online crontab-generator met real-time validatie. Bouw cron-expressies met 5 of 6 velden, bekijk de vertaling in natuurlijke taal en bekijk de volgende geplande uitvoeringen.",
    d1: "Interactieve editor voor het schrijven en valideren van crontab-expressies. Terwijl u typt, vertaalt de tool de expressie naar gewone taal en berekent deze de volgende uitvoeringsdata vanaf een configureerbare referentiedatum. Ondersteunt beide veelvoorkomende formaten: 5 velden (standaard Unix/Linux cron) en 6 velden met precisie op secondeniveau (Quartz, Spring Scheduler).",
    edition: "Editor",
    results: "Resultaten",
    error: "Ongeldige cron-expressie",
    all: "Elke waarde in het veld",
    in: "Op X en Y",
    from: "Van X tot Y",
    each: "Elke X",
    eachFrom: "Elke X, beginnend vanaf Y",
    legends: "Legenda",
    dt: "Referentiedatum",
    add: "Meer laden",
    reset: "Wissen",
    field: "Seconde,Minuut,Uur,Dag,Maand,Weekdag",
    t5: "Structuur van een cron-expressie",
    d51: "Seconde (0–59) — optioneel, alleen aanwezig in het 6-veldenformaat",
    d52: "Minuut (0–59)",
    d53: "Uur (0–23)",
    d54: "Dag van de maand (1–31)",
    d55: "Maand (1–12 of JAN–DEC)",
    d56: "Dag van de week (0–7 of SUN–SAT, waarbij zowel 0 als 7 voor zondag staan)",
    t6: "Veelvoorkomende cron-expressies",
    d6: "Frequente planningsscenario's en hun cron-equivalenten",
    d61_t: "* * * * *",
    d61_d: "Draait elke minuut",
    d62_t: "0 0 * * *",
    d62_d: "Draait elke dag om middernacht",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "Om 12:00 uur 's middags, van maandag tot en met vrijdag",
    d64_t: "0 0 1 * *",
    d64_d: "Om middernacht op de eerste dag van elke maand",
    t7: "Speciale tekens",
    d7: "Betekenis van de symbolen die in expressievelden worden gebruikt",
    d71: "Komt overeen met elke waarde voor het veld. Bij minuten staat dit gelijk aan 'elke minuut'",
    d72: "Lijst met specifieke waarden. Bij uren betekent '1,15' om 01:00 en 15:00 uur",
    d73: "Definieert een bereik. Bij weekdagen omvat '1-5' maandag tot en met vrijdag",
    d74: "Definieert een stap. Bij minuten draait '*/2' elke 2 minuten",
    t_how: "Hoe te gebruiken",
    how1_t: "Typ de expressie",
    how1: "Plak of typ een cron-expressie in het hoofdveld. Validatie gebeurt in real-time en geeft tijdens het typen aan of de syntaxis correct is.",
    how2_t: "Lees de vertaling",
    how2: "Net onder de invoer toont de tool de expressie in gewone taal — handig om de betekenis te bevestigen zonder de syntaxis te onthouden.",
    how3_t: "Bekijk de volgende uitvoeringen",
    how3: "Op het tabblad Resultaten ziet u de volgende data waarop de taak wordt geactiveerd, uitgaande van een configureerbare referentiedatum.",
    how4_t: "Meer data laden",
    how4: "Gebruik de knop 'Meer laden' om de lijst uit te breiden en het planningsgedrag over langere perioden te valideren.",
    t_real: "Praktijkvoorbeelden",
    real_intro: "Frequente planningsscenario's en hun bijbehorende cron-expressies",
    real1: "0 2 * * * — Dagelijkse database-backup om 02:00 uur",
    real2: "*/15 * * * * — Statuscontrole elke 15 minuten",
    real3: "0 9 * * MON — Wekelijkse rapport-e-mail elke maandag om 09:00 uur",
    real4: "0 0 1 1 * — Jaarlijkse archiveringstaak op 1 januari om middernacht",
    real5: "0 18 * * FRI — Wekelijks overzicht elke vrijdag om 18:00 uur",
    t_edge: "Uitzonderingen en geavanceerde patronen",
    edge_intro: "Minder voor de hand liggende patronen die vaak vragen oproepen",
    edge1: "0,30 * * * * — Draait op minuut 0 en 30 van elk uur (twee keer per uur)",
    edge2: "30 0 2 * * * — 6-veldenformaat: activeert precies om 02:00:30, met precisie op secondeniveau",
    edge3: "0 8-18 * * 1-5 — Elk heel uur van 08:00 tot 18:00 uur, alleen op weekdagen",
    t_faq: "Vragen en Antwoorden",
    faq1q: "Wat is een crontab-expressie?",
    faq1a: "Een crontab-expressie is een reeks van 5 of 6 door spaties gescheiden velden die bepaalt wanneer een geplande taak (cron job) moet worden uitgevoerd op Unix-achtige systemen. Elk veld vertegenwoordigt een tijdseenheid: minuut, uur, dag van de maand, maand en dag van de week — met een optioneel secondenveld aan het begin.",
    faq2q: "Wat is het verschil tussen 5-veld en 6-veld cron?",
    faq2a: "Het 5-veldenformaat (minuut, uur, dag, maand, weekdag) is de historische Unix cron-standaard. Het 6-veldenformaat voegt een secondenveld aan het begin toe voor een fijnere precisie. Het wordt gebruikt door planners zoals Quartz (Java), Spring Scheduler en sommige moderne implementaties.",
    faq3q: "Hoe voer ik een taak elke 5 minuten uit?",
    faq3a: "Gebruik de expressie */5 * * * *. De notatie */5 in het minutenveld betekent 'elke stap van 5, beginnend vanaf 0' — de taak wordt geactiveerd op minuut 0, 5, 10, 15, enzovoort, in elk uur.",
    faq4q: "Wat betekent */N in een cron-expressie?",
    faq4a: "De notatie */N betekent 'elke N eenheden binnen het bereik van het veld'. In het minutenveld wordt */2 elke 2 minuten geactiveerd. In het urenveld wordt */6 elke 6 uur geactiveerd. De schuine streep definieert een stap over het volledige toegestane bereik van het veld.",
    faq5q: "Kan ik namen gebruiken in plaats van nummers voor maanden en weekdagen?",
    faq5a: "Ja. Het maandveld accepteert JAN tot en met DEC en het weekdagveld accepteert SUN tot en met SAT. Namen zijn bij de meeste implementaties niet hoofdlettergevoelig. Bijvoorbeeld, 0 9 * * MON-FRI is gelijk aan 0 9 * * 1-5 en wordt geactiveerd om 09:00 uur op weekdagen.",
    faq6q: "Kan ik zien wanneer mijn cron-expressie zal draaien?",
    faq6a: "Ja. Op het tabblad Resultaten in deze tool ziet u de toekomstige uitvoeringsdata berekend vanaf een referentiedatum. Door die datum te wijzigen, kunt u het planningsgedrag op verschillende tijdstippen simuleren — handig voor het valideren van schema's voordat ze naar productie gaan.",
    feat1: "Ondersteunt 5-veld en 6-veld cron-expressies",
    feat2: "Real-time validatie en vertaling naar natuurlijke taal",
    feat3: "Voorbeeld van volgende uitvoeringen vanaf elk referentiepunt",
    feat4: "Planningsprecisie op secondeniveau",
    feat5: "Speciale tekens (L, #) en bereiken ondersteund",
    feat6: "Meertalige interface",
    see1: "UUID-generator",
    see2: "Mooie letters",
    see3: "Creditcard-generator",
    see4: "Geboortedatumgenerator"
  },
  ru: {
    title: "Генератор Crontab",
    pageTitle: "Онлайн-генератор Crontab — 5 и 6 полей Cron",
    meta: "Онлайн-генератор crontab с проверкой в реальном времени. Создавайте cron-выражения из 5 или 6 полей, смотрите их перевод на понятный язык и просматривайте предстоящие запланированные запуски.",
    d1: "Интерактивный редактор для написания и проверки crontab-выражений. По мере ввода инструмент переводит выражение на естественный язык и вычисляет даты следующих выполнений от заданной исходной даты. Поддерживает два наиболее распространенных формата: 5 полей (стандарт Unix/Linux) и 6 полей с точностью до секунды (Quartz, Spring Scheduler).",
    edition: "Редактор",
    results: "Результаты",
    error: "Неверное cron-выражение",
    all: "Любое значение поля",
    in: "В X и Y",
    from: "С X по Y",
    each: "Каждые X",
    eachFrom: "Каждые X, начиная с Y",
    legends: "Легенда",
    dt: "Исходная дата",
    add: "Загрузить еще",
    reset: "Очистить",
    field: "Секунда,Минута,Час,День,Месяц,День недели",
    t5: "Структура cron-выражения",
    d51: "Секунда (0–59) — необязательно, присутствует только в формате из 6 полей",
    d52: "Минута (0–59)",
    d53: "Час (0–23)",
    d54: "День месяца (1–31)",
    d55: "Месяц (1–12 или JAN–DEC)",
    d56: "День недели (0–7 или SUN–SAT, где 0 и 7 обозначают воскресенье)",
    t6: "Популярные cron-выражения",
    d6: "Частые сценарии планирования и их эквивалентные cron-выражения",
    d61_t: "* * * * *",
    d61_d: "Выполняется каждую минуту",
    d62_t: "0 0 * * *",
    d62_d: "Выполняется каждый день в полночь",
    d63_t: "0 12 * * MON-FRI",
    d63_d: "В полдень, с понедельника по пятницу",
    d64_t: "0 0 1 * *",
    d64_d: "В полночь в первый день каждого месяца",
    t7: "Специальные символы",
    d7: "Значение символов, используемых в полях выражения",
    d71: "Означает любое значение для поля. В минутах это эквивалентно 'каждую минуту'",
    d72: "Перечисляет конкретные значения. В часах '1,15' означает в 1:00 и в 15:00",
    d73: "Определяет диапазон. В днях недели '1-5' охватывает с понедельника по пятницу",
    d74: "Определяет шаг. В минутах '*/2' означает каждые 2 минуты",
    t_how: "Как пользоваться",
    how1_t: "Введите выражение",
    how1: "Вставьте или введите любое cron-выражение в главное поле. Проверка происходит в реальном времени, показывая, правилен ли синтаксис, по мере ввода.",
    how2_t: "Прочтите перевод",
    how2: "Прямо под полем инструмент показывает выражение на понятном языке — полезно для подтверждения значения без необходимости запоминать синтаксис.",
    how3_t: "Посмотрите следующие запуски",
    how3: "На вкладке 'Результаты' посмотрите следующие даты срабатывания задачи, начиная с настраиваемой исходной даты.",
    how4_t: "Загрузите больше дат",
    how4: "Используйте кнопку 'Загрузить еще', чтобы расширить список и проверить поведение планировщика на более длительных периодах.",
    t_real: "Реальные примеры",
    real_intro: "Частые сценарии планирования и их эквивалентные cron-выражения",
    real1: "0 2 * * * — Ежедневное резервное копирование базы данных в 2:00",
    real2: "*/15 * * * * — Проверка работоспособности каждые 15 минут",
    real3: "0 9 * * MON — Еженедельный отчет по электронной почте каждый понедельник в 9:00",
    real4: "0 0 1 1 * — Ежегодная задача архивирования, 1 января в полночь",
    real5: "0 18 * * FRI — Еженедельная сводка каждую пятницу в 18:00",
    t_edge: "Особые случаи и продвинутые паттерны",
    edge_intro: "Менее очевидные паттерны, которые часто вызывают вопросы",
    edge1: "0,30 * * * * — Выполняется на 0-й и 30-й минутах каждого часа (два раза в час)",
    edge2: "30 0 2 * * * — Формат из 6 полей: срабатывает ровно в 02:00:30, с точностью до секунды",
    edge3: "0 8-18 * * 1-5 — Каждый полный час с 8:00 до 18:00, только в рабочие дни",
    t_faq: "Вопросы и ответы",
    faq1q: "Что такое crontab-выражение?",
    faq1a: "Crontab-выражение — это последовательность из 5 или 6 разделенных пробелами полей, которая определяет, когда запланированная задача (cron job) должна быть выполнена в Unix-подобных системах. Каждое поле представляет единицу времени: минуту, час, день месяца, месяц и день недели — с дополнительным необязательным полем секунд в начале.",
    faq2q: "В чем разница между cron из 5 и 6 полей?",
    faq2a: "Формат из 5 полей (минута, час, день, месяц, день недели) является историческим стандартом Unix cron. Формат из 6 полей добавляет поле секунд в начале, обеспечивая более высокую точность. Он используется такими планировщиками, как Quartz (Java), Spring Scheduler и некоторыми современными реализациями.",
    faq3q: "Как выполнять задачу каждые 5 минут?",
    faq3a: "Используйте выражение */5 * * * *. Нотация */5 в поле минут означает 'каждый шаг в 5 единиц, начиная с 0' — задача будет срабатывать на 0, 5, 10, 15 минутах и так далее, каждый час.",
    faq4q: "Что означает */N в cron-выражении?",
    faq4a: "Нотация */N означает 'каждые N единиц в пределах диапазона поля'. В поле минут */2 срабатывает каждые 2 минуты. В поле часов */6 срабатывает каждые 6 часов. Косая черта определяет шаг по всему допустимому диапазону поля.",
    faq5q: "Могу ли я использовать имена вместо чисел для месяцев и дней недели?",
    faq5a: "Да. Поле месяца принимает значения от JAN до DEC, а поле дня недели — от SUN до SAT. Имена не зависят от регистра в большинстве реализаций. Например, 0 9 * * MON-FRI эквивалентно 0 9 * * 1-5 и срабатывает в 9:00 по рабочим дням.",
    faq6q: "Можно ли предсказать, когда будет выполнено мое cron-выражение?",
    faq6a: "Да. На вкладке 'Результаты' в этом инструменте вы можете увидеть предстоящие даты выполнения, рассчитанные от исходной даты. Изменение этой даты позволяет смоделировать поведение планировщика в разные моменты времени, что полезно для проверки расписания перед его внедрением в рабочую среду.",
    feat1: "Поддерживает cron-выражения из 5 и 6 полей",
    feat2: "Проверка в реальном времени и перевод на естественный язык",
    feat3: "Предварительный просмотр следующих запусков от любой даты",
    feat4: "Точность планирования до секунды",
    feat5: "Поддержка специальных символов (L, #) и диапазонов",
    feat6: "Многоязычный интерфейс",
    see1: "Генератор UUID",
    see2: "Красивые шрифты",
    see3: "Генератор кредитных карт",
    see4: "Генератор дней рождения"
  }
}
</i18n>