<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })
const route = useRoute()
const router = useRouter()

const nowSeconds = ref(0)
const nowMs = ref(0)
const localTz = ref('UTC')
const shareFeedback = ref(false)
const copiedKey = ref<string | null>(null)

let timer: ReturnType<typeof setInterval> | null = null

const COMMON_TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'America/Sao_Paulo', 'America/Argentina/Buenos_Aires',
  'America/Mexico_City', 'America/Toronto', 'America/Vancouver',
  'Europe/London', 'Europe/Lisbon', 'Europe/Paris', 'Europe/Berlin',
  'Europe/Madrid', 'Europe/Rome', 'Europe/Amsterdam', 'Europe/Moscow',
  'Africa/Cairo', 'Africa/Johannesburg', 'Asia/Dubai', 'Asia/Kolkata',
  'Asia/Bangkok', 'Asia/Singapore', 'Asia/Shanghai', 'Asia/Tokyo',
  'Asia/Seoul', 'Australia/Sydney', 'Australia/Melbourne',
  'Pacific/Auckland', 'Pacific/Honolulu',
]

const timezoneOptions = computed(() => {
  if (localTz.value && !COMMON_TIMEZONES.includes(localTz.value)) {
    return [localTz.value, ...COMMON_TIMEZONES]
  }
  return COMMON_TIMEZONES
})

const state = reactive({
  inputTs: 0,
  timezone: 'UTC',
  manualDate: {
    y: 2024,
    m: 1,
    d: 1,
    h: 0,
    min: 0,
    s: 0,
  },
  deltaBase: 0,
  delta: { d: 0, h: 0, min: 0, s: 0 },
})

onMounted(() => {
  const now = Date.now()
  const nowS = Math.floor(now / 1000)

  // Initialize values
  nowSeconds.value = nowS
  nowMs.value = now
  if (!route.query.ts) state.inputTs = nowS
  else state.inputTs = Number(route.query.ts)

  state.deltaBase = nowS

  const d = new Date()
  state.manualDate = {
    y: d.getFullYear(),
    m: d.getMonth() + 1,
    d: d.getDate(),
    h: d.getHours(),
    min: d.getMinutes(),
    s: d.getSeconds(),
  }

  localTz.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  state.timezone = localTz.value

  timer = setInterval(() => {
    const tick = Date.now()
    nowSeconds.value = Math.floor(tick / 1000)
    nowMs.value = tick
  }, 1000)
})

onUnmounted(() => { if (timer) clearInterval(timer) })

const detectedUnit = computed(() => {
  if (!state.inputTs) return null
  return state.inputTs.toString().length >= 12 ? 'ms' : 's'
})

const deltaBaseUnit = computed(() => {
  if (!state.deltaBase) return null
  return state.deltaBase.toString().length >= 12 ? 'ms' : 's'
})

function formatTz(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZoneName: 'shortOffset',
  }).format(date)
}

function toSqlUtc(date: Date): string {
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${date.getUTCFullYear()}-${p(date.getUTCMonth() + 1)}-${p(date.getUTCDate())} ${p(date.getUTCHours())}:${p(date.getUTCMinutes())}:${p(date.getUTCSeconds())}`
}

function getRelativeTime(date: Date): string {
  const diff = date.getTime() - Date.now()
  const diffS = Math.round(diff / 1000)
  const diffM = Math.round(diffS / 60)
  const diffH = Math.round(diffM / 60)
  const diffD = Math.round(diffH / 24)
  if (Math.abs(diffS) < 5) return t('just_now')
  const isPast = diffS < 0
  const unit =
    Math.abs(diffD) > 0 ? `${Math.abs(diffD)} ${t('days')}` :
    Math.abs(diffH) > 0 ? `${Math.abs(diffH)} ${t('hours')}` :
    Math.abs(diffM) > 0 ? `${Math.abs(diffM)} ${t('min_short')}` :
    `${Math.abs(diffS)} ${t('s_short')}`
  return (isPast ? t('past_format') : t('future_format')).replace('{time}', unit)
}

const convertedDate = computed(() => {
  if (!state.inputTs) return null
  const ts = detectedUnit.value === 'ms' ? state.inputTs : state.inputTs * 1000
  const date = new Date(ts)
  if (isNaN(date.getTime())) return null
  return {
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    tzTime: formatTz(date, state.timezone),
    iso: date.toISOString(),
    sql: toSqlUtc(date),
    relative: getRelativeTime(date),
  }
})

const convertedRows = computed(() => {
  if (!convertedDate.value) return []
  return [
    { key: 'utc', label: t('gmt'), value: convertedDate.value.utc },
    { key: 'local', label: t('local'), value: convertedDate.value.local },
    { key: 'tz', label: state.timezone, value: convertedDate.value.tzTime },
    { key: 'iso', label: t('iso'), value: convertedDate.value.iso },
    { key: 'sql', label: t('sql'), value: convertedDate.value.sql },
    { key: 'rel', label: t('relative'), value: convertedDate.value.relative },
  ]
})

const manualTimestamp = computed(() => {
  const d = new Date(
    state.manualDate.y, state.manualDate.m - 1, state.manualDate.d,
    state.manualDate.h, state.manualDate.min, state.manualDate.s,
  )
  return { seconds: Math.floor(d.getTime() / 1000), ms: d.getTime() }
})

const arithmeticResult = computed(() => {
  const baseS = deltaBaseUnit.value === 'ms' ? Math.floor(state.deltaBase / 1000) : state.deltaBase
  const deltaS = state.delta.d * 86400 + state.delta.h * 3600 + state.delta.min * 60 + state.delta.s
  const resultS = baseS + deltaS
  const date = new Date(resultS * 1000)
  if (isNaN(date.getTime())) return null
  return { seconds: resultS, ms: resultS * 1000, utc: date.toUTCString(), iso: date.toISOString() }
})

function setBaseToNow() {
  state.deltaBase = Math.floor(Date.now() / 1000)
}

async function copyValue(val: string, key: string) {
  await navigator.clipboard.writeText(val)
  copiedKey.value = key
  setTimeout(() => { copiedKey.value = null }, 1500)
}

async function shareUrl() {
  const url = new URL(window.location.href)
  url.searchParams.set('ts', state.inputTs.toString())
  await navigator.clipboard.writeText(url.toString())
  router.replace({ query: { ts: state.inputTs.toString() } })
  shareFeedback.value = true
  setTimeout(() => { shareFeedback.value = false }, 2000)
}

const dateFields = [
  { key: 'y', label: 'year' }, { key: 'm', label: 'month' }, { key: 'd', label: 'day' },
  { key: 'h', label: 'hr' }, { key: 'min', label: 'mn' }, { key: 's', label: 'sc' },
]

const deltaFields = [
  { key: 'd', label: 'day' }, { key: 'h', label: 'hr' },
  { key: 'min', label: 'mn' }, { key: 's', label: 'sc' },
]

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5'), t('f_6')],
  faq: [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') },
  ],
  howToName: t('how_to_use_title'),
  howToSteps: [
    { name: t('step_1_title'), text: t('step_1_desc') },
    { name: t('step_2_title'), text: t('step_2_desc') },
    { name: t('step_3_title'), text: t('step_3_desc') },
  ],
})

useHead({
  title: t('pageTitle'),
  meta: [{ name: 'description', content: t('meta') }],
})

defineI18nRoute({
  paths: {
    pt: '/conversor-timestamp-unix',
    es: '/convertidor-timestamp-unix',
    fr: '/convertisseur-timestamp-unix',
    it: '/convertitore-timestamp-unix',
    id: '/konverter-timestamp-unix',
    de: '/unix-zeitstempel-umrechner',
    nl: '/unix-timestamp-converter',
  },
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :see-also-links="[
      { label: t('see1'), to: 'date-time-tools' },
      { label: t('see2'), to: 'time-converter' },
      { label: t('see3'), to: 'crontab-generator' },
      { label: t('see4'), to: 'uuid-generator' },
    ]"
  >
    <!-- Live Timestamps -->
    <ClientOnly>
      <div class="stats stats-vertical sm:stats-horizontal shadow w-full border border-base-content/10 mb-6">
        <div class="stat">
          <div class="stat-title text-sm uppercase tracking-widest">{{ t('live_s') }}</div>
          <div class="stat-value font-mono text-primary text-2xl tabular-nums">{{ nowSeconds }}</div>
          <div class="stat-actions mt-2">
            <button @click="copyValue(nowSeconds.toString(), 'nowS')" class="btn btn-xs btn-outline">
              <Icon :name="copiedKey === 'nowS' ? 'heroicons:check' : 'heroicons:clipboard'" class="w-3 h-3" />
              {{ copiedKey === 'nowS' ? t('copied') : t('copy') }}
            </button>
          </div>
        </div>
        <div class="stat">
          <div class="stat-title text-sm uppercase tracking-widest">{{ t('live_ms') }}</div>
          <div class="stat-value font-mono text-2xl tabular-nums">{{ nowMs }}</div>
          <div class="stat-actions mt-2">
            <button @click="copyValue(nowMs.toString(), 'nowMs')" class="btn btn-xs btn-outline">
              <Icon :name="copiedKey === 'nowMs' ? 'heroicons:check' : 'heroicons:clipboard'" class="w-3 h-3" />
              {{ copiedKey === 'nowMs' ? t('copied') : t('copy') }}
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Timestamp to Date -->
    <div class="card border border-base-content/10 bg-base-100 shadow mb-4">
      <div class="card-body gap-4">
        <h2 class="card-title text-base-content">
          <Icon name="heroicons:clock" class="w-5 h-5 text-primary" />
          {{ t('ts_to_date') }}
        </h2>
        <div class="flex flex-wrap gap-4">
          <div class="form-control flex-1 min-w-48">
            <label class="label pb-1" for="input-ts">
              <span class="label-text font-bold text-base-content/80">{{ t('label_ts') }}</span>
            </label>
            <input
              id="input-ts"
              type="number"
              v-model="state.inputTs"
              class="input input-bordered font-mono w-full"
              placeholder="1712926315"
            />
            <label v-if="detectedUnit" class="label pt-1">
              <span class="label-text-alt text-primary font-semibold uppercase">{{ t('detected') }}: {{ t(detectedUnit) }}</span>
            </label>
          </div>
          <div class="form-control min-w-48">
            <label class="label pb-1" for="timezone-select">
              <span class="label-text font-bold text-base-content/80">{{ t('timezone') }}</span>
            </label>
            <select id="timezone-select" v-model="state.timezone" class="select select-bordered w-full">
              <option v-for="tz in timezoneOptions" :key="tz" :value="tz">{{ tz }}</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end -mt-2">
          <button @click="shareUrl" class="btn btn-sm btn-ghost">
            <Icon :name="shareFeedback ? 'heroicons:check' : 'heroicons:link'" class="w-4 h-4" />
            {{ shareFeedback ? t('link_copied') : t('share') }}
          </button>
        </div>
        <div v-if="convertedRows.length" class="grid sm:grid-cols-2 gap-2">
          <ClientOnly>
            <div
              v-for="item in convertedRows"
              :key="item.key"
              class="flex items-center gap-2 p-3 rounded-lg border border-base-content/10 bg-base-200"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm text-base-content/60 uppercase tracking-wider">{{ item.label }}</p>
                <p class="font-mono text-sm truncate">{{ item.value }}</p>
              </div>
              <button @click="copyValue(item.value, `conv_${item.key}`)" class="btn btn-xs btn-ghost shrink-0">
                <Icon :name="copiedKey === `conv_${item.key}` ? 'heroicons:check' : 'heroicons:clipboard'" class="w-4 h-4" />
              </button>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Date to Timestamp -->
    <div class="card border border-base-content/10 bg-base-100 shadow mb-4">
      <div class="card-body gap-4">
        <h2 class="card-title text-base-content">
          <Icon name="heroicons:calendar-days" class="w-5 h-5 text-primary" />
          {{ t('date_to_ts') }}
        </h2>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <div v-for="field in dateFields" :key="field.key" class="form-control">
            <label class="label pb-1" :for="'date-' + field.key">
              <span class="label-text text-sm uppercase tracking-wider text-base-content/60">{{ t(field.label) }}</span>
            </label>
            <input
              :id="'date-' + field.key"
              type="number"
              v-model="state.manualDate[field.key as keyof typeof state.manualDate]"
              class="input input-bordered input-sm text-center font-mono"
            />
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-2">
          <div
            v-for="item in [
              { key: 'mts_s', label: t('ts_s'), value: manualTimestamp.seconds.toString() },
              { key: 'mts_ms', label: t('ts_ms'), value: manualTimestamp.ms.toString() },
            ]"
            :key="item.key"
            class="flex items-center gap-2 p-3 rounded-lg border border-base-content/10 bg-base-200"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm text-base-content/60 uppercase tracking-wider">{{ item.label }}</p>
              <p class="font-mono text-sm">{{ item.value }}</p>
            </div>
            <button @click="copyValue(item.value, item.key)" class="btn btn-xs btn-ghost shrink-0">
              <Icon :name="copiedKey === item.key ? 'heroicons:check' : 'heroicons:clipboard'" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Timestamp Arithmetic -->
    <div class="card border border-base-content/10 bg-base-100 shadow mb-6">
      <div class="card-body gap-4">
        <h2 class="card-title text-base-content">
          <Icon name="heroicons:calculator" class="w-5 h-5 text-primary" />
          {{ t('arithmetic_title') }}
        </h2>
        <p class="text-base-content/60 text-sm -mt-2">{{ t('arithmetic_intro') }}</p>

        <div class="form-control">
          <label class="label pb-1" for="base-ts">
            <span class="label-text font-bold text-base-content/80">{{ t('base_ts_label') }}</span>
          </label>
          <div class="flex gap-2">
            <input
              id="base-ts"
              type="number"
              v-model="state.deltaBase"
              class="input input-bordered font-mono flex-1 min-w-0"
            />
            <button @click="setBaseToNow" class="btn btn-outline btn-primary shrink-0">
              {{ t('use_now') }}
            </button>
          </div>
          <label v-if="deltaBaseUnit" class="label pt-1">
            <span class="label-text-alt text-primary font-semibold uppercase">{{ t('detected') }}: {{ t(deltaBaseUnit) }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label pb-1">
            <span class="label-text font-bold text-base-content/80">{{ t('delta_label') }}</span>
          </label>
          <p class="text-sm text-base-content/70 mb-2">{{ t('delta_hint') }}</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div v-for="field in deltaFields" :key="field.key" class="form-control">
              <label class="label pb-1" :for="'delta-' + field.key">
                <span class="label-text text-sm uppercase tracking-wider text-base-content/60">{{ t(field.label) }}</span>
              </label>
              <input
                :id="'delta-' + field.key"
                type="number"
                v-model="state.delta[field.key as keyof typeof state.delta]"
                class="input input-bordered input-sm text-center font-mono"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div v-if="arithmeticResult" class="grid sm:grid-cols-2 gap-2">
          <div
            v-for="item in [
              { key: 'ats_s', label: t('ts_s'), value: arithmeticResult.seconds.toString() },
              { key: 'ats_ms', label: t('ts_ms'), value: arithmeticResult.ms.toString() },
              { key: 'ats_utc', label: t('gmt'), value: arithmeticResult.utc },
              { key: 'ats_iso', label: t('iso'), value: arithmeticResult.iso },
            ]"
            :key="item.key"
            class="flex items-center gap-2 p-3 rounded-lg border border-base-content/10 bg-base-200"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm text-base-content/60 uppercase tracking-wider">{{ item.label }}</p>
              <p class="font-mono text-sm truncate">{{ item.value }}</p>
            </div>
            <button @click="copyValue(item.value, item.key)" class="btn btn-xs btn-ghost shrink-0">
              <Icon :name="copiedKey === item.key ? 'heroicons:check' : 'heroicons:clipboard'" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <template #info>
      <div class="space-y-8">
        <section>
          <p class="text-base-content/80 leading-relaxed">{{ t('how_desc') }}</p>
        </section>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('f_1'), t('f_2'), t('f_3'), t('f_4'), t('f_5'), t('f_6')]"
        />

        <UseCaseSection
          :title="t('use_cases_title')"
          :items="[
            { title: t('use_1_t'), description: t('use_1_d') },
            { title: t('use_2_t'), description: t('use_2_d') },
            { title: t('use_3_t'), description: t('use_3_d') },
            { title: t('use_4_t'), description: t('use_4_d') },
            { title: t('use_5_t'), description: t('use_5_d') },
            { title: t('use_6_t'), description: t('use_6_d') },
          ]"
        />

        <HowToSection
          :title="t('how_to_use_title')"
          :items="[
            { title: t('step_1_title'), description: t('step_1_desc') },
            { title: t('step_2_title'), description: t('step_2_desc') },
            { title: t('step_3_title'), description: t('step_3_desc') },
          ]"
        />

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq1q'), answer: t('faq1a') },
            { question: t('faq2q'), answer: t('faq2a') },
            { question: t('faq3q'), answer: t('faq3a') },
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
  en: {
    title: "Unix Timestamp Converter",
    pageTitle: "Unix Timestamp Converter — Convert Epoch Time Online | Free",
    meta: "Free online Unix timestamp converter. Convert timestamps to human-readable dates in any timezone, convert dates to timestamps, and perform timestamp arithmetic for JWT expiry, cache TTL and more.",
    live_s: "Current Epoch (Seconds)",
    live_ms: "Current Epoch (Milliseconds)",
    ts_to_date: "Timestamp to Date",
    date_to_ts: "Date to Timestamp",
    arithmetic_title: "Timestamp Arithmetic",
    arithmetic_intro: "Add or subtract time from any timestamp. Calculate JWT expiry, cache TTL, session timeouts and scheduled job windows. Works with both seconds and milliseconds.",
    label_ts: "Enter Unix Timestamp",
    detected: "Detected unit",
    s: "Seconds",
    ms: "Milliseconds",
    gmt: "GMT / UTC",
    local: "Your Local Time",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relative",
    timezone: "Timezone",
    share: "Share URL",
    link_copied: "Copied!",
    copy: "Copy",
    copied: "Copied!",
    year: "Year",
    month: "Month",
    day: "Day",
    hr: "Hour",
    mn: "Min",
    sc: "Sec",
    ts_s: "Unix Timestamp (s)",
    ts_ms: "Unix Timestamp (ms)",
    base_ts_label: "Base Timestamp",
    use_now: "Use Now",
    delta_label: "Add / Subtract",
    delta_hint: "Use negative values to go back in time.",
    just_now: "Just now",
    past_format: "{time} ago",
    future_format: "in {time}",
    days: "days",
    hours: "hours",
    min_short: "min",
    s_short: "sec",
    how_desc: "Convert Unix timestamps to human-readable dates in any timezone, or convert any date back to a timestamp. Seconds and milliseconds are detected automatically. Use the arithmetic section to compute JWT expiry, cache TTL or session windows, and share any timestamp via URL in one click.",
    features_title: "Features",
    f_1: "Auto-detection of timestamp precision (seconds or milliseconds)",
    f_2: "Timezone-aware display across 30+ timezones worldwide",
    f_3: "Timestamp arithmetic: add or subtract days, hours, minutes and seconds",
    f_4: "Output in multiple formats: UTC, local time, ISO 8601, SQL and relative",
    f_5: "Convert any date back to Unix Epoch in seconds or milliseconds",
    f_6: "Shareable URLs — send a timestamp to a colleague in one click",
    use_cases_title: "Main Applications",
    use_1_t: "API Debugging",
    use_1_d: "Decode timestamps from API responses and server logs instantly to understand event timelines.",
    use_2_t: "JWT Expiry",
    use_2_d: "Calculate token expiration times precisely using the arithmetic calculator to avoid auth issues.",
    use_3_t: "Database Work",
    use_3_d: "Convert between SQL datetime strings and Unix timestamps for queries and migrations.",
    use_4_t: "Scheduling",
    use_4_d: "Plan future events and cron jobs by computing exact timestamps for any timezone.",
    use_5_t: "Log Analysis",
    use_5_d: "Correlate events across distributed systems by converting log timestamps to a common reference.",
    use_6_t: "Team Collaboration",
    use_6_d: "Share timestamp links so colleagues in different timezones see the correct local time.",
    how_to_use_title: "How to Use This Tool",
    step_1_title: "Enter or check a timestamp",
    step_1_desc: "Paste a Unix timestamp in the Timestamp to Date field — seconds and milliseconds are detected automatically.",
    step_2_title: "Choose a timezone",
    step_2_desc: "Select your preferred timezone to see the converted date in that region.",
    step_3_title: "Use the arithmetic section",
    step_3_desc: "Enter a base timestamp and add or subtract days, hours, minutes or seconds to compute a future or past timestamp.",
    faq_title: "Questions and Answers",
    faq1q: "What is a Unix timestamp?",
    faq1a: "A Unix timestamp is the number of seconds elapsed since 1 January 1970 00:00:00 UTC (the Unix Epoch), not counting leap seconds. It is the standard time representation used by most operating systems, databases and APIs.",
    faq2q: "What is the difference between seconds and milliseconds timestamps?",
    faq2a: "A 10-digit timestamp is in seconds; a 13-digit timestamp is in milliseconds. This tool detects the precision automatically, but you can always check the label shown below the input field.",
    faq3q: "Does this tool handle dates before 1970?",
    faq3a: "Yes. Negative timestamps represent dates before the Unix Epoch. For example, -86400 corresponds to 31 December 1969 at 00:00:00 UTC.",
    see1: "Dates and Times Tools",
    see2: "Time Converter",
    see3: "Crontab Generator",
    see4: "UUID Generator"
  },
  pt: {
    title: "Conversor de Timestamp Unix",
    pageTitle: "Conversor de Timestamp Unix — Converter Epoch Online | Grátis",
    meta: "Conversor de Timestamp Unix online grátis. Converta para qualquer fuso horário, calcule expiração de JWT e TTL de cache, compartilhe por URL. Essencial para devs.",
    live_s: "Epoch Atual (Segundos)",
    live_ms: "Epoch Atual (Milissegundos)",
    ts_to_date: "Timestamp para Data",
    date_to_ts: "Data para Timestamp",
    arithmetic_title: "Calculadora de Timestamp",
    arithmetic_intro: "Some ou subtraia tempo de qualquer timestamp. Calcule expirações de JWT, TTL de cache, timeouts de sessão e janelas de jobs agendados. Funciona com segundos e milissegundos.",
    label_ts: "Insira o Timestamp Unix",
    detected: "Unidade detectada",
    s: "Segundos",
    ms: "Milissegundos",
    gmt: "GMT / UTC",
    local: "Sua Hora Local",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relativo",
    timezone: "Fuso Horário",
    share: "Compartilhar URL",
    link_copied: "Copiado!",
    copy: "Copiar",
    copied: "Copiado!",
    year: "Ano",
    month: "Mês",
    day: "Dia",
    hr: "Hora",
    mn: "Min",
    sc: "Seg",
    ts_s: "Timestamp Unix (s)",
    ts_ms: "Timestamp Unix (ms)",
    base_ts_label: "Timestamp Base",
    use_now: "Usar Agora",
    delta_label: "Somar / Subtrair",
    delta_hint: "Use valores negativos para voltar no tempo.",
    just_now: "Agora mesmo",
    past_format: "{time} atrás",
    future_format: "em {time}",
    days: "dias",
    hours: "horas",
    min_short: "min",
    s_short: "seg",
    how_desc: "Converta timestamps Unix em datas legíveis em qualquer fuso horário, ou converta qualquer data de volta para timestamp. Segundos e milissegundos são detectados automaticamente. Use a seção de aritmética para calcular expiração de JWT, TTL de cache ou janelas de sessão, e compartilhe qualquer timestamp via URL com um clique.",
    features_title: "Funcionalidades",
    f_1: "Detecção automática de precisão (segundos ou milissegundos)",
    f_2: "Exibição com fuso horário em mais de 30 zonas ao redor do mundo",
    f_3: "Aritmética de timestamp: some ou subtraia dias, horas, minutos e segundos",
    f_4: "Output em múltiplos formatos: UTC, local, ISO 8601, SQL e tempo relativo",
    f_5: "Converta qualquer data de volta para Unix Epoch em segundos ou milissegundos",
    f_6: "URLs compartilháveis — envie um timestamp para um colega com um clique",
    use_cases_title: "Principais Aplicações",
    use_1_t: "Depuração de APIs",
    use_1_d: "Decodifique timestamps de respostas de API e logs de servidor instantaneamente.",
    use_2_t: "Expiração de JWT",
    use_2_d: "Calcule tempos de expiração de tokens com precisão usando a calculadora aritmética.",
    use_3_t: "Banco de Dados",
    use_3_d: "Converta entre strings datetime SQL e timestamps Unix para consultas e migrações.",
    use_4_t: "Agendamento",
    use_4_d: "Planeje eventos futuros e cron jobs calculando timestamps exatos para qualquer fuso horário.",
    use_5_t: "Análise de Logs",
    use_5_d: "Correlacione eventos em sistemas distribuídos convertendo timestamps de logs para uma referência comum.",
    use_6_t: "Colaboração em Equipe",
    use_6_d: "Compartilhe links de timestamp para que colegas em fusos diferentes vejam a hora local correta.",
    how_to_use_title: "Como Utilizar Esta Ferramenta",
    step_1_title: "Insira ou verifique um timestamp",
    step_1_desc: "Cole um timestamp Unix no campo Timestamp para Data — segundos e milissegundos são detectados automaticamente.",
    step_2_title: "Escolha um fuso horário",
    step_2_desc: "Selecione o fuso horário de sua preferência para ver a data convertida naquela região.",
    step_3_title: "Use a seção de aritmética",
    step_3_desc: "Insira um timestamp base e some ou subtraia dias, horas, minutos ou segundos para calcular um timestamp futuro ou passado.",
    faq_title: "Perguntas e Respostas",
    faq1q: "O que é um timestamp Unix?",
    faq1a: "Um timestamp Unix é o número de segundos decorridos desde 1º de janeiro de 1970 às 00:00:00 UTC (Unix Epoch), sem contar segundos bissextos. É a representação de tempo padrão usada pela maioria dos sistemas operacionais, bancos de dados e APIs.",
    faq2q: "Qual a diferença entre timestamps em segundos e milissegundos?",
    faq2a: "Um timestamp de 10 dígitos está em segundos; um de 13 dígitos está em milissegundos. Esta ferramenta detecta a precisão automaticamente, mas você sempre pode verificar o rótulo exibido abaixo do campo de entrada.",
    faq3q: "Esta ferramenta lida com datas antes de 1970?",
    faq3a: "Sim. Timestamps negativos representam datas anteriores ao Unix Epoch. Por exemplo, -86400 corresponde a 31 de dezembro de 1969 às 00:00:00 UTC.",
    see1: "Ferramentas de Datas e Horas",
    see2: "Conversor de Tempo",
    see3: "Gerador de Crontab",
    see4: "Gerador de UUID"
  },
  es: {
    title: "Convertidor de Timestamp Unix",
    pageTitle: "Convertidor de Timestamp Unix — Convertir Epoch en Línea | Gratis",
    meta: "Convertidor de Timestamp Unix gratuito en línea. Convierte timestamps a fechas legibles en cualquier zona horaria, fechas a timestamps y realiza aritmética de timestamps.",
    live_s: "Epoch Actual (Segundos)",
    live_ms: "Epoch Actual (Milisegundos)",
    ts_to_date: "Timestamp a Fecha",
    date_to_ts: "Fecha a Timestamp",
    arithmetic_title: "Calculadora de Timestamp",
    arithmetic_intro: "Suma o resta tiempo a cualquier timestamp. Calcula la expiración de JWT, TTL de caché, timeouts de sesión y ventanas de trabajos programados. Funciona con segundos y milisegundos.",
    label_ts: "Introduce el Timestamp Unix",
    detected: "Unidad detectada",
    s: "Segundos",
    ms: "Milisegundos",
    gmt: "GMT / UTC",
    local: "Tu Hora Local",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relativo",
    timezone: "Zona Horaria",
    share: "Compartir URL",
    link_copied: "¡Copiado!",
    copy: "Copiar",
    copied: "¡Copiado!",
    year: "Año",
    month: "Mes",
    day: "Día",
    hr: "Hora",
    mn: "Min",
    sc: "Seg",
    ts_s: "Timestamp Unix (s)",
    ts_ms: "Timestamp Unix (ms)",
    base_ts_label: "Timestamp Base",
    use_now: "Usar Ahora",
    delta_label: "Sumar / Restar",
    delta_hint: "Usa valores negativos para retroceder en el tiempo.",
    just_now: "Ahora mismo",
    past_format: "hace {time}",
    future_format: "en {time}",
    days: "días",
    hours: "horas",
    min_short: "min",
    s_short: "seg",
    how_desc: "Convierte timestamps Unix a fechas legibles en cualquier zona horaria, o convierte cualquier fecha a timestamp. Los segundos y milisegundos se detectan automáticamente. Usa la sección aritmética para calcular la expiración de JWT, TTL de caché o ventanas de sesión, y comparte cualquier timestamp por URL con un clic.",
    features_title: "Características",
    f_1: "Detección automática de precisión (segundos o milisegundos)",
    f_2: "Visualización con zona horaria en más de 30 zonas alrededor del mundo",
    f_3: "Aritmética de timestamps: suma o resta días, horas, minutos y segundos",
    f_4: "Salida en múltiples formatos: UTC, hora local, ISO 8601, SQL y tiempo relativo",
    f_5: "Convierte cualquier fecha al Unix Epoch en segundos o milisegundos",
    f_6: "URLs compartibles — envía un timestamp a un colega con un clic",
    use_cases_title: "Principales Aplicaciones",
    use_1_t: "Depuración de APIs",
    use_1_d: "Decodifica timestamps de respuestas de API y logs de servidor al instante.",
    use_2_t: "Expiración de JWT",
    use_2_d: "Calcula los tiempos de expiración de tokens con precisión usando la calculadora aritmética.",
    use_3_t: "Bases de Datos",
    use_3_d: "Convierte entre cadenas datetime de SQL y timestamps Unix para consultas y migraciones.",
    use_4_t: "Programación",
    use_4_d: "Planifica eventos futuros y trabajos cron calculando timestamps exactos para cualquier zona horaria.",
    use_5_t: "Análisis de Logs",
    use_5_d: "Correlaciona eventos entre sistemas distribuidos convirtiendo timestamps de logs a una referencia común.",
    use_6_t: "Colaboración en Equipo",
    use_6_d: "Comparte enlaces de timestamps para que colegas en diferentes zonas horarias vean la hora local correcta.",
    how_to_use_title: "Cómo Usar Esta Herramienta",
    step_1_title: "Introduce o verifica un timestamp",
    step_1_desc: "Pega un timestamp Unix en el campo Timestamp a Fecha — los segundos y milisegundos se detectan automáticamente.",
    step_2_title: "Elige una zona horaria",
    step_2_desc: "Selecciona tu zona horaria preferida para ver la fecha convertida en esa región.",
    step_3_title: "Usa la sección aritmética",
    step_3_desc: "Introduce un timestamp base y suma o resta días, horas, minutos o segundos para calcular un timestamp futuro o pasado.",
    faq_title: "Preguntas y Respuestas",
    faq1q: "¿Qué es un timestamp Unix?",
    faq1a: "Un timestamp Unix es el número de segundos transcurridos desde el 1 de enero de 1970 a las 00:00:00 UTC (Unix Epoch), sin contar los segundos intercalares. Es la representación de tiempo estándar utilizada por la mayoría de los sistemas operativos, bases de datos y APIs.",
    faq2q: "¿Cuál es la diferencia entre timestamps en segundos y milisegundos?",
    faq2a: "Un timestamp de 10 dígitos está en segundos; uno de 13 dígitos está en milisegundos. Esta herramienta detecta la precisión automáticamente, pero siempre puedes verificar la etiqueta que aparece debajo del campo de entrada.",
    faq3q: "¿Esta herramienta maneja fechas anteriores a 1970?",
    faq3a: "Sí. Los timestamps negativos representan fechas anteriores al Unix Epoch. Por ejemplo, -86400 corresponde al 31 de diciembre de 1969 a las 00:00:00 UTC.",
    see1: "Herramientas de Fechas y Horas",
    see2: "Convertidor de Tiempo",
    see3: "Generador de Crontab",
    see4: "Generador de UUID"
  },
  fr: {
    title: "Convertisseur de Timestamp Unix",
    pageTitle: "Convertisseur de Timestamp Unix — Convertir l'Epoch en Ligne | Gratuit",
    meta: "Convertisseur de Timestamp Unix gratuit en ligne. Convertissez des timestamps en dates lisibles dans n'importe quel fuseau horaire, des dates en timestamps et effectuez de l'arithmétique de timestamps.",
    live_s: "Epoch Actuel (Secondes)",
    live_ms: "Epoch Actuel (Millisecondes)",
    ts_to_date: "Timestamp vers Date",
    date_to_ts: "Date vers Timestamp",
    arithmetic_title: "Calculatrice de Timestamp",
    arithmetic_intro: "Ajoutez ou soustrayez du temps à n'importe quel timestamp. Calculez l'expiration des JWT, le TTL du cache, les délais de session et les fenêtres de tâches planifiées. Fonctionne en secondes et en millisecondes.",
    label_ts: "Entrez le Timestamp Unix",
    detected: "Unité détectée",
    s: "Secondes",
    ms: "Millisecondes",
    gmt: "GMT / UTC",
    local: "Votre Heure Locale",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relatif",
    timezone: "Fuseau Horaire",
    share: "Partager l'URL",
    link_copied: "Copié !",
    copy: "Copier",
    copied: "Copié !",
    year: "Année",
    month: "Mois",
    day: "Jour",
    hr: "Heure",
    mn: "Min",
    sc: "Sec",
    ts_s: "Timestamp Unix (s)",
    ts_ms: "Timestamp Unix (ms)",
    base_ts_label: "Timestamp de Base",
    use_now: "Utiliser Maintenant",
    delta_label: "Ajouter / Soustraire",
    delta_hint: "Utilisez des valeurs négatives pour reculer dans le temps.",
    just_now: "À l'instant",
    past_format: "il y a {time}",
    future_format: "dans {time}",
    days: "jours",
    hours: "heures",
    min_short: "min",
    s_short: "sec",
    how_desc: "Convertissez des timestamps Unix en dates lisibles dans n'importe quel fuseau horaire, ou convertissez n'importe quelle date en timestamp. Les secondes et les millisecondes sont détectées automatiquement. Utilisez la section arithmétique pour calculer l'expiration de JWT, le TTL du cache ou les fenêtres de session, et partagez n'importe quel timestamp par URL en un clic.",
    features_title: "Fonctionnalités",
    f_1: "Détection automatique de la précision (secondes ou millisecondes)",
    f_2: "Affichage avec fuseau horaire dans plus de 30 zones mondiales",
    f_3: "Arithmétique de timestamps : ajoutez ou soustrayez des jours, heures, minutes et secondes",
    f_4: "Sortie en plusieurs formats : UTC, heure locale, ISO 8601, SQL et temps relatif",
    f_5: "Convertissez n'importe quelle date en Unix Epoch en secondes ou millisecondes",
    f_6: "URLs partageables — envoyez un timestamp à un collègue en un clic",
    use_cases_title: "Principales Applications",
    use_1_t: "Débogage d'API",
    use_1_d: "Décodez instantanément les timestamps des réponses d'API et des logs serveur.",
    use_2_t: "Expiration JWT",
    use_2_d: "Calculez précisément les temps d'expiration des tokens avec la calculatrice arithmétique.",
    use_3_t: "Bases de Données",
    use_3_d: "Convertissez entre les chaînes datetime SQL et les timestamps Unix pour les requêtes et migrations.",
    use_4_t: "Planification",
    use_4_d: "Planifiez des événements futurs et des tâches cron en calculant des timestamps exacts pour n'importe quel fuseau.",
    use_5_t: "Analyse de Logs",
    use_5_d: "Corrélez des événements dans des systèmes distribués en convertissant les timestamps en une référence commune.",
    use_6_t: "Collaboration en Équipe",
    use_6_d: "Partagez des liens de timestamps pour que les collègues dans différents fuseaux voient l'heure locale correcte.",
    how_to_use_title: "Comment Utiliser Cet Outil",
    step_1_title: "Entrez ou vérifiez un timestamp",
    step_1_desc: "Collez un timestamp Unix dans le champ Timestamp vers Date — les secondes et millisecondes sont détectées automatiquement.",
    step_2_title: "Choisissez un fuseau horaire",
    step_2_desc: "Sélectionnez votre fuseau horaire préféré pour voir la date convertite dans cette région.",
    step_3_title: "Utilisez la section arithmétique",
    step_3_desc: "Entrez un timestamp de base et ajoutez ou soustrayez des jours, heures, minutes ou secondes pour calculer un timestamp futur ou passé.",
    faq_title: "Questions et Réponses",
    faq1q: "Qu'est-ce qu'un timestamp Unix ?",
    faq1a: "Un timestamp Unix est le nombre de secondes écoulées depuis le 1er janvier 1970 à 00:00:00 UTC (Unix Epoch), sans compter les secondes intercalaires. C'est la représentation du temps standard utilisée par la plupart des systèmes d'exploitation, bases de données et APIs.",
    faq2q: "Quelle est la différence entre les timestamps en secondes et en millisecondes ?",
    faq2a: "Un timestamp de 10 chiffres est en secondes ; un de 13 chiffres est en millisecondes. Cet outil détecte la précision automatiquement, mais vous pouvez toujours vérifier l'étiquette affichée sous le champ de saisie.",
    faq3q: "Cet outil gère-t-il les dates antérieures à 1970 ?",
    faq3a: "Oui. Les timestamps négatifs représentent des dates antérieures à l'Unix Epoch. Par exemple, -86400 correspond au 31 décembre 1969 à 00:00:00 UTC.",
    see1: "Outils de Dates et Heures",
    see2: "Convertisseur de Temps",
    see3: "Générateur de Crontab",
    see4: "Générateur d'UUID"
  },
  it: {
    title: "Convertitore di Timestamp Unix",
    pageTitle: "Convertitore di Timestamp Unix — Converti Epoch Online | Gratuito",
    meta: "Convertitore di Timestamp Unix gratuito online. Converti timestamp in date leggibili in qualsiasi fuso orario, date in timestamp ed esegui operazioni aritmetiche sui timestamp.",
    live_s: "Epoch Attuale (Secondi)",
    live_ms: "Epoch Attuale (Millisecondi)",
    ts_to_date: "Timestamp in Data",
    date_to_ts: "Data in Timestamp",
    arithmetic_title: "Calcolo Timestamp",
    arithmetic_intro: "Aggiungi o sottrai tempo da qualsiasi timestamp. Calcola la scadenza dei JWT, il TTL della cache, i timeout di sessione e le finestre dei job pianificati. Funziona con secondi e millisecondi.",
    label_ts: "Inserisci il Timestamp Unix",
    detected: "Unità rilevata",
    s: "Secondi",
    ms: "Millisecondi",
    gmt: "GMT / UTC",
    local: "La Tua Ora Locale",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relativo",
    timezone: "Fuso Orario",
    share: "Condividi URL",
    link_copied: "Copiato!",
    copy: "Copia",
    copied: "Copiato!",
    year: "Anno",
    month: "Mese",
    day: "Giorno",
    hr: "Ora",
    mn: "Min",
    sc: "Sec",
    ts_s: "Timestamp Unix (s)",
    ts_ms: "Timestamp Unix (ms)",
    base_ts_label: "Timestamp Base",
    use_now: "Usa Adesso",
    delta_label: "Aggiungi / Sottrai",
    delta_hint: "Usa valori negativi per tornare indietro nel tempo.",
    just_now: "Proprio adesso",
    past_format: "{time} fa",
    future_format: "tra {time}",
    days: "giorni",
    hours: "ore",
    min_short: "min",
    s_short: "sec",
    how_desc: "Converti timestamp Unix in date leggibili in qualsiasi fuso orario, o converti qualsiasi data in timestamp. Secondi e millisecondi vengono rilevati automaticamente. Usa la sezione aritmetica per calcolare la scadenza dei JWT, il TTL della cache o le finestre di sessione, e condividi qualsiasi timestamp via URL con un clic.",
    features_title: "Funzionalità",
    f_1: "Rilevamento automatico della precisione (secondi o millisecondi)",
    f_2: "Visualizzazione con fuso orario in oltre 30 zone nel mondo",
    f_3: "Aritmetica dei timestamp: aggiungi o sottrai giorni, ore, minuti e secondi",
    f_4: "Output in più formati: UTC, ora locale, ISO 8601, SQL e tempo relativo",
    f_5: "Converti qualsiasi data in Unix Epoch in secondi o millisecondi",
    f_6: "URL condivisibili — invia un timestamp a un collega con un clic",
    use_cases_title: "Principali Applicazioni",
    use_1_t: "Debug di API",
    use_1_d: "Decodifica istantaneamente i timestamp dalle risposte delle API e dai log del server.",
    use_2_t: "Scadenza JWT",
    use_2_d: "Calcola con precisione i tempi di scadenza dei token usando il calcolo aritmetico.",
    use_3_t: "Database",
    use_3_d: "Converti tra stringhe datetime SQL e timestamp Unix per query e migrazioni.",
    use_4_t: "Pianificazione",
    use_4_d: "Pianifica eventi futuri e job cron calcolando timestamp esatti per qualsiasi fuso orario.",
    use_5_t: "Analisi dei Log",
    use_5_d: "Correla eventi in sistemi distribuiti convertendo i timestamp dei log a un riferimento comune.",
    use_6_t: "Collaborazione in Team",
    use_6_d: "Condividi link di timestamp affinché i colleghi in fusi orari diversi vedano l'ora locale corretta.",
    how_to_use_title: "Come Usare Questo Strumento",
    step_1_title: "Inserisci o verifica un timestamp",
    step_1_desc: "Incolla un timestamp Unix nel campo Timestamp in Data — secondi e millisecondi vengono rilevati automaticamente.",
    step_2_title: "Scegli un fuso orario",
    step_2_desc: "Seleziona il tuo fuso orario preferito per vedere la data convertita in quella regione.",
    step_3_title: "Usa la sezione aritmetica",
    step_3_desc: "Inserisci un timestamp base e aggiungi o sottrai giorni, ore, minuti o secondi per calcolare un timestamp futuro o passato.",
    faq_title: "Domande e Risposte",
    faq1q: "Cos'è un timestamp Unix?",
    faq1a: "Un timestamp Unix è il numero di secondi trascorsi dal 1° gennaio 1970 alle 00:00:00 UTC (Unix Epoch), senza contare i secondi intercalari. È la rappresentazione del tempo standard usata dalla maggior parte dei sistemi operativi, database e API.",
    faq2q: "Qual è la differenza tra timestamp in secondi e millisecondi?",
    faq2a: "Un timestamp di 10 cifre è in secondi; uno di 13 cifre è in millisecondi. Questo strumento rileva la precisione automaticamente, ma puoi sempre verificare l'etichetta mostrata sotto il campo di input.",
    faq3q: "Questo strumento gestisce date precedenti al 1970?",
    faq3a: "Sì. I timestamp negativi rappresentano date anteriori all'Unix Epoch. Ad esempio, -86400 corrisponde al 31 dicembre 1969 alle 00:00:00 UTC.",
    see1: "Strumenti per Date e Ore",
    see2: "Convertitore di Tempo",
    see3: "Generatore di Crontab",
    see4: "Generatore di UUID"
  },
  id: {
    title: "Konverter Timestamp Unix",
    pageTitle: "Konverter Timestamp Unix — Konversi Epoch Secara Online | Gratis",
    meta: "Konverter Timestamp Unix gratis online. Konversi timestamp ke tanggal yang dapat dibaca di zona waktu mana pun, tanggal ke timestamp, dan lakukan aritmetika timestamp.",
    live_s: "Epoch Saat Ini (Detik)",
    live_ms: "Epoch Saat Ini (Milidetik)",
    ts_to_date: "Timestamp ke Tanggal",
    date_to_ts: "Tanggal ke Timestamp",
    arithmetic_title: "Kalkulator Timestamp",
    arithmetic_intro: "Tambah atau kurangi waktu dari timestamp mana pun. Hitung kedaluwarsa JWT, TTL cache, timeout sesi, dan jendela job terjadwal. Berfungsi dengan detik dan milidetik.",
    label_ts: "Masukkan Timestamp Unix",
    detected: "Unit terdeteksi",
    s: "Detik",
    ms: "Milidetik",
    gmt: "GMT / UTC",
    local: "Waktu Lokal Anda",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relatif",
    timezone: "Zona Waktu",
    share: "Bagikan URL",
    link_copied: "Disalin!",
    copy: "Salin",
    copied: "Disalin!",
    year: "Tahun",
    month: "Bulan",
    day: "Hari",
    hr: "Jam",
    mn: "Menit",
    sc: "Detik",
    ts_s: "Timestamp Unix (s)",
    ts_ms: "Timestamp Unix (ms)",
    base_ts_label: "Timestamp Dasar",
    use_now: "Gunakan Sekarang",
    delta_label: "Tambah / Kurangi",
    delta_hint: "Gunakan nilai negatif untuk mundur dalam waktu.",
    just_now: "Baru saja",
    past_format: "{time} yang lalu",
    future_format: "dalam {time}",
    days: "hari",
    hours: "jam",
    min_short: "mnt",
    s_short: "dtk",
    how_desc: "Konversi timestamp Unix ke tanggal yang dapat dibaca di zona waktu mana pun, atau konversi tanggal apa pun ke timestamp. Detik dan milidetik dideteksi secara otomatis. Gunakan bagian aritmetika untuk menghitung kedaluwarsa JWT, TTL cache atau jendela sesi, dan bagikan timestamp mana pun melalui URL dengan satu klik.",
    features_title: "Fitur",
    f_1: "Deteksi otomatis presisi timestamp (detik atau milidetik)",
    f_2: "Tampilan dengan zona waktu di lebih dari 30 zona di seluruh dunia",
    f_3: "Aritmetika timestamp: tambah atau kurangi hari, jam, menit, dan detik",
    f_4: "Output dalam berbagai format: UTC, waktu lokal, ISO 8601, SQL, dan waktu relatif",
    f_5: "Konversi tanggal apa pun ke Unix Epoch dalam detik atau milidetik",
    f_6: "URL yang dapat dibagikan — kirim timestamp ke rekan dengan satu klik",
    use_cases_title: "Kasus Penggunaan Utama",
    use_1_t: "Debug API",
    use_1_d: "Dekode timestamp dari respons API dan log server secara instan.",
    use_2_t: "Kedaluwarsa JWT",
    use_2_d: "Hitung waktu kedaluwarsa token secara presisi menggunakan kalkulator aritmetika.",
    use_3_t: "Database",
    use_3_d: "Konversi antara string datetime SQL dan timestamp Unix untuk kueri dan migrasi.",
    use_4_t: "Penjadwalan",
    use_4_d: "Rencanakan acara mendatang dan cron job dengan menghitung timestamp tepat untuk zona waktu mana pun.",
    use_5_t: "Analisis Log",
    use_5_d: "Korelasikan peristiwa di sistem terdistribusi dengan mengonversi timestamp log ke referensi yang sama.",
    use_6_t: "Kolaborasi Tim",
    use_6_d: "Bagikan tautan timestamp agar rekan di zona waktu berbeda melihat waktu lokal yang benar.",
    how_to_use_title: "Cara Menggunakan Alat Ini",
    step_1_title: "Masukkan atau periksa timestamp",
    step_1_desc: "Tempel timestamp Unix di kolom Timestamp ke Tanggal — detik dan milidetik dideteksi secara otomatis.",
    step_2_title: "Pilih zona waktu",
    step_2_desc: "Pilih zona waktu pilihan Anda untuk melihat tanggal yang dikonversi di wilayah tersebut.",
    step_3_title: "Gunakan bagian aritmetika",
    step_3_desc: "Masukkan timestamp dasar dan tambah atau kurangi hari, jam, menit, atau detik untuk menghitung timestamp masa depan atau masa lalu.",
    faq_title: "Pertanyaan dan Jawaban",
    faq1q: "Apa itu timestamp Unix?",
    faq1a: "Timestamp Unix adalah jumlah detik yang telah berlalu sejak 1 Januari 1970 pukul 00:00:00 UTC (Unix Epoch), tidak termasuk detik kabisat. Ini adalah representasi waktu standar yang digunakan oleh sebagian besar sistem operasi, database, dan API.",
    faq2q: "Apa perbedaan antara timestamp dalam detik dan milidetik?",
    faq2a: "Timestamp 10 digit menggunakan detik; timestamp 13 digit menggunakan milidetik. Alat ini mendeteksi presisi secara otomatis, tetapi Anda selalu dapat memeriksa label yang ditampilkan di bawah kolom input.",
    faq3q: "Apakah alat ini menangani tanggal sebelum 1970?",
    faq3a: "Ya. Timestamp negatif mewakili tanggal sebelum Unix Epoch. Misalnya, -86400 sesuai dengan 31 Desember 1969 pukul 00:00:00 UTC.",
    see1: "Alat Tanggal dan Waktu",
    see2: "Konverter Waktu",
    see3: "Generator Crontab",
    see4: "Generator UUID"
  },
  de: {
    title: "Unix-Timestamp-Konverter",
    pageTitle: "Unix-Timestamp-Konverter — Epoch-Zeit online umrechnen | Kostenlos",
    meta: "Kostenloser Online-Unix-Timestamp-Konverter. Konvertieren Sie Timestamps in lesbare Datumsangaben in jeder Zeitzone, Datumsangaben in Timestamps und führen Sie Timestamp-Arithmetik durch.",
    live_s: "Aktueller Epoch (Sekunden)",
    live_ms: "Aktueller Epoch (Millisekunden)",
    ts_to_date: "Timestamp zu Datum",
    date_to_ts: "Datum zu Timestamp",
    arithmetic_title: "Timestamp-Rechner",
    arithmetic_intro: "Addieren oder subtrahieren Sie Zeit von einem beliebigen Timestamp. Berechnen Sie JWT-Ablaufzeiten, Cache-TTL, Sitzungs-Timeouts und Fenster für geplante Jobs. Funktioniert mit Sekunden und Millisekunden.",
    label_ts: "Unix-Timestamp eingeben",
    detected: "Erkannte Einheit",
    s: "Sekunden",
    ms: "Millisekunden",
    gmt: "GMT / UTC",
    local: "Ihre Ortszeit",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relativ",
    timezone: "Zeitzone",
    share: "URL teilen",
    link_copied: "Kopiert!",
    copy: "Kopieren",
    copied: "Kopiert!",
    year: "Jahr",
    month: "Monat",
    day: "Tag",
    hr: "Std",
    mn: "Min",
    sc: "Sek",
    ts_s: "Unix-Timestamp (s)",
    ts_ms: "Unix-Timestamp (ms)",
    base_ts_label: "Basis-Timestamp",
    use_now: "Jetzt verwenden",
    delta_label: "Addieren / Subtrahieren",
    delta_hint: "Verwenden Sie negative Werte, um in der Zeit zurückzugehen.",
    just_now: "Gerade eben",
    past_format: "vor {time}",
    future_format: "in {time}",
    days: "Tagen",
    hours: "Stunden",
    min_short: "Min",
    s_short: "Sek",
    how_desc: "Konvertieren Sie Unix-Timestamps in lesbare Datumsangaben in beliebigen Zeitzonen oder konvertieren Sie Datumsangaben in Timestamps. Sekunden und Millisekunden werden automatisch erkannt. Nutzen Sie den Arithmetik-Bereich zur Berechnung von JWT-Ablaufzeiten, Cache-TTL oder Sitzungsfenstern und teilen Sie beliebige Timestamps per URL mit einem Klick.",
    features_title: "Funktionen",
    f_1: "Automatische Erkennung der Timestamp-Präzision (Sekunden oder Millisekunden)",
    f_2: "Zeitzonenbasierte Anzeige in über 30 Zeitzonen weltweit",
    f_3: "Timestamp-Arithmetik: Tage, Stunden, Minuten und Sekunden addieren oder subtrahieren",
    f_4: "Ausgabe in mehreren Formaten: UTC, Ortszeit, ISO 8601, SQL und relative Zeit",
    f_5: "Beliebiges Datum in Unix Epoch in Sekunden oder Millisekunden umrechnen",
    f_6: "Teilbare URLs — Timestamp mit einem Klick an Kollegen senden",
    use_cases_title: "Hauptanwendungen",
    use_1_t: "API-Debugging",
    use_1_d: "Timestamps aus API-Antworten und Server-Logs sofort dekodieren.",
    use_2_t: "JWT-Ablauf",
    use_2_d: "Token-Ablaufzeiten präzise mit dem Arithmetik-Rechner berechnen.",
    use_3_t: "Datenbankarbeit",
    use_3_d: "Zwischen SQL-Datetime-Strings und Unix-Timestamps für Abfragen und Migrationen konvertieren.",
    use_4_t: "Zeitplanung",
    use_4_d: "Zukünftige Ereignisse und Cron-Jobs durch Berechnung exakter Timestamps für jede Zeitzone planen.",
    use_5_t: "Log-Analyse",
    use_5_d: "Ereignisse in verteilten Systemen korrelieren, indem Log-Timestamps auf eine gemeinsame Referenz umgerechnet werden.",
    use_6_t: "Teamzusammenarbeit",
    use_6_d: "Timestamp-Links teilen, damit Kollegen in verschiedenen Zeitzonen die korrekte Ortszeit sehen.",
    how_to_use_title: "So verwenden Sie dieses Tool",
    step_1_title: "Timestamp eingeben oder prüfen",
    step_1_desc: "Fügen Sie einen Unix-Timestamp in das Feld Timestamp zu Datum ein — Sekunden und Millisekunden werden automatisch erkannt.",
    step_2_title: "Zeitzone auswählen",
    step_2_desc: "Wählen Sie Ihre bevorzugte Zeitzone, um das konvertierte Datum in dieser Region zu sehen.",
    step_3_title: "Arithmetik-Bereich verwenden",
    step_3_desc: "Geben Sie einen Basis-Timestamp ein und addieren oder subtrahieren Sie Tage, Stunden, Minuten oder Sekunden, um einen zukünftigen oder vergangenen Timestamp zu berechnen.",
    faq_title: "Fragen und Antworten",
    faq1q: "Was ist ein Unix-Timestamp?",
    faq1a: "Ein Unix-Timestamp ist die Anzahl der Sekunden, die seit dem 1. Januar 1970 um 00:00:00 UTC (Unix-Epoch) vergangen sind, ohne Schaltsekunden zu zählen. Er ist die Standardzeitdarstellung der meisten Betriebssysteme, Datenbanken und APIs.",
    faq2q: "Was ist der Unterschied zwischen Timestamps in Sekunden und Millisekunden?",
    faq2a: "Ein 10-stelliger Timestamp ist in Sekunden; ein 13-stelliger ist in Millisekunden. Dieses Tool erkennt die Präzision automatisch, aber Sie können jederzeit das Label unter dem Eingabefeld überprüfen.",
    faq3q: "Verarbeitet dieses Tool Daten vor 1970?",
    faq3a: "Ja. Negative Timestamps stellen Daten vor der Unix-Epoch dar. Zum Beispiel entspricht -86400 dem 31. Dezember 1969 um 00:00:00 UTC.",
    see1: "Datum-Zeit-Werkzeuge",
    see2: "Zeit-Umrechner",
    see3: "Crontab-Generator",
    see4: "UUID-Generator"
  },
  nl: {
    title: "Unix Timestamp-converter",
    pageTitle: "Unix Timestamp-converter — Epoch-tijd online omzetten | Gratis",
    meta: "Gratis online Unix timestamp-converter. Converteer timestamps naar leesbare datums in elke tijdzone, zet datums om naar timestamps en voer tijdrekenkunde uit voor JWT-verloop, cache-TTL en meer.",
    live_s: "Huidige Epoch (seconden)",
    live_ms: "Huidige Epoch (milliseconden)",
    ts_to_date: "Timestamp naar Datum",
    date_to_ts: "Datum naar Timestamp",
    arithmetic_title: "Timestamp-berekening",
    arithmetic_intro: "Tel tijd op of trek tijd af van elke timestamp. Bereken JWT-verloop, cache-TTL, sessie-timeouts en geplande jobvensters. Werkt met zowel seconden als milliseconden.",
    label_ts: "Voer Unix-timestamp in",
    detected: "Gedetecteerde eenheid",
    s: "Seconden",
    ms: "Milliseconden",
    gmt: "GMT / UTC",
    local: "Je lokale tijd",
    iso: "ISO 8601",
    sql: "SQL / MySQL (UTC)",
    relative: "Relatief",
    timezone: "Tijdzone",
    share: "Deel URL",
    link_copied: "Gekopieerd!",
    copy: "Kopieer",
    copied: "Gekopieerd!",
    year: "Jaar",
    month: "Maand",
    day: "Dag",
    hr: "Uur",
    mn: "Min",
    sc: "Sec",
    ts_s: "Unix-timestamp (s)",
    ts_ms: "Unix-timestamp (ms)",
    base_ts_label: "Basis-timestamp",
    use_now: "Gebruik nu",
    delta_label: "Optellen / Aftrekken",
    delta_hint: "Gebruik negatieve waarden om terug in de tijd te gaan.",
    just_now: "Zojuist",
    past_format: "{time} geleden",
    future_format: "over {time}",
    days: "dagen",
    hours: "uren",
    min_short: "min",
    s_short: "sec",
    how_desc: "Converteer Unix-timestamps naar leesbare datums in elke tijdzone, of zet een datum om naar een timestamp. Seconden en milliseconden worden automatisch gedetecteerd. Gebruik de rekenmodule om JWT-verloop, cache-TTL of sessievensters te berekenen, en deel elke timestamp via URL in één klik.",
    features_title: "Functies",
    f_1: "Automatische detectie van timestamp-precisie (seconden of milliseconden)",
    f_2: "Tijdzonebewuste weergave in meer dan 30 tijdzones wereldwijd",
    f_3: "Timestamp-berekeningen: dagen, uren, minuten en seconden optellen of aftrekken",
    f_4: "Uitvoer in meerdere formaten: UTC, lokale tijd, ISO 8601, SQL en relatief",
    f_5: "Converteer elke datum terug naar Unix Epoch in seconden of milliseconden",
    f_6: "Deelbare URL's — stuur een timestamp naar een collega in één klik",
    use_cases_title: "Belangrijkste toepassingen",
    use_1_t: "API-foutopsporing",
    use_1_d: "Decodeer timestamps van API-responses en serverlogs direct om tijdlijnen te begrijpen.",
    use_2_t: "JWT-verloop",
    use_2_d: "Bereken token-verlooptijden nauwkeurig met de rekenmachine om authenticatieproblemen te voorkomen.",
    use_3_t: "Databasewerk",
    use_3_d: "Converteer tussen SQL datetime strings en Unix-timestamps voor queries en migrations.",
    use_4_t: "Planning",
    use_4_d: "Plan toekomstige evenementen en cronjobs door exacte timestamps voor elke tijdzone te berekenen.",
    use_5_t: "Loganalyse",
    use_5_d: "Koppel gebeurtenissen in gedistribueerde systemen door log-timestamps naar een gemeenschappelijke referentie om te zetten.",
    use_6_t: "Team-samenwerking",
    use_6_d: "Deel timestamp-links zodat collega's in verschillende tijdzones de juiste lokale tijd zien.",
    how_to_use_title: "Hoe deze tool te gebruiken",
    step_1_title: "Voer een timestamp in of controleer deze",
    step_1_desc: "Plak een Unix-timestamp in het veld 'Timestamp naar Datum' — seconden en milliseconden worden automatisch gedetecteerd.",
    step_2_title: "Kies een tijdzone",
    step_2_desc: "Selecteer de tijdzone van uw voorkeur om de geconverteerde datum in die regio te zien.",
    step_3_title: "Gebruik de rekenmodule",
    step_3_desc: "Voer een basis-timestamp in en tel dagen, uren, minuten of seconden op of trek ze af om een toekomstige of eerdere timestamp te berekenen.",
    faq_title: "Vragen en Antwoorden",
    faq1q: "Wat is een Unix-timestamp?",
    faq1a: "Een Unix-timestamp is het aantal seconden dat is verstreken sinds 1 januari 1970 00:00:00 UTC (de Unix Epoch), exclusief schrikkelseconden. Het is de standaard tijdweergave voor de meeste besturingssystemen, databases en API's.",
    faq2q: "Wat is het verschil tussen timestamps in seconden en milliseconden?",
    faq2a: "Een 10-cijferige timestamp is in seconden; een 13-cijferige timestamp is in milliseconden. Deze tool detecteert de precisie automatisch, maar u kunt altijd het label onder het invoerveld controleren.",
    faq3q: "Kan deze tool datums voor 1970 aan?",
    faq3a: "Ja. Negatieve timestamps vertegenwoordigen datums voor de Unix Epoch. Bijvoorbeeld, -86400 komt overeen met 31 december 1969 om 00:00:00 UTC.",
    see1: "Datum- en tijdtools",
    see2: "Tijdconverter",
    see3: "Crontab-generator",
    see4: "UUID-generator"
  }
}
</i18n>
