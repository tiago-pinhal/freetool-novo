<script setup lang="ts">
type QRCodeOptions = Record<string, unknown>

interface QRCodeStylingInstance {
  update: (options: QRCodeOptions) => void
  append: (element: HTMLElement) => void
  download: (options: { name: string; extension: 'png' }) => void
}

type QRCodeStylingConstructor = new (options: QRCodeOptions) => QRCodeStylingInstance

declare global {
  interface Window {
    QRCodeStyling?: QRCodeStylingConstructor
  }
}

const { t } = useI18n({ useScope: 'local' })

const PIX_GUI = 'br.gov.bcb.pix'

const state = reactive({
  type: 'URL',
  url: '',
  text: '',
  sms_phone: '',
  sms_message: '',
  email_address: '',
  email_subject: '',
  email_message: '',
  wifi_ssid: '',
  wifi_hidden: false,
  wifi_pass: '',
  wifi_cripto: 'WPA',
  card_first_name: '',
  card_last_name: '',
  card_cell: '',
  card_tel_work: '',
  card_email: '',
  card_street: '',
  card_city: '',
  card_state: '',
  card_zip: '',
  card_country: '',
  card_org: '',
  card_job: '',
  card_site: '',
  pix_key: '',
  pix_name: '',
  pix_city: '',
  pix_amount: '',
  pix_desc: '',
  width: 320,
  height: 320,
  lockProportions: true,
  margin: 8,
  logo: '',
  logo_hide: true,
  logo_margin: 5,
  dot_type: 'square',
  dot_color: '#111827',
  bg_color: '#ffffff',
  corners_type: 'square',
  corners_color: '#111827',
  corners_dot_type: 'square',
  corners_dot_color: '#111827'
})

const canvasRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const qrLoaded = ref(false)
const downloadFeedback = ref('')
let qrCode: QRCodeStylingInstance | null = null
let logoObjectUrl = ''

const faqItems = computed(() => [
  { question: t('faq_1_q'), answer: t('faq_1_a') },
  { question: t('faq_3_q'), answer: t('faq_3_a') },
  { question: t('faq_4_q'), answer: t('faq_4_a') }
])

const hasCustomData = computed(() => {
  return Boolean(
    state.url ||
    state.text ||
    state.sms_phone ||
    state.sms_message ||
    state.email_address ||
    state.email_subject ||
    state.email_message ||
    state.wifi_ssid ||
    state.card_first_name ||
    state.card_last_name ||
    state.card_cell ||
    state.card_email ||
    state.pix_key ||
    state.pix_name ||
    state.pix_city ||
    state.pix_amount ||
    state.pix_desc
  )
})

usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  howToName: t('how_to_title'),
  howToSteps: [
    { name: t('how_1_title'), text: t('how_1_desc') },
    { name: t('how_2_title'), text: t('how_2_desc') },
    { name: t('how_3_title'), text: t('how_3_desc') }
  ],
  faq: faqItems.value
})

useHead({
  title: t('page_title'),
  meta: [
    { name: 'description', content: t('meta') },
    { property: 'og:title', content: t('og_title') },
    { property: 'og:description', content: t('meta') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: t('og_title') },
    { name: 'twitter:description', content: t('meta') }
  ]
})

watch(() => state.width, (val) => {
  if (state.lockProportions) state.height = val
})

watch(() => state.height, (val) => {
  if (state.lockProportions) state.width = val
})

watch(state, () => {
  if (qrLoaded.value) generate()
}, { deep: true })

const previewContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Auto-size based on container if it's the first load
  if (previewContainerRef.value) {
    const width = previewContainerRef.value.clientWidth - 24 // Subtract padding
    if (width > 120 && width < 1000) {
      state.width = Math.floor(width)
      state.height = Math.floor(width)
    }
  }
})

onBeforeUnmount(() => {
  if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl)
})

function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function generate() {
  if (!window.QRCodeStyling || !canvasRef.value) return

  const options: QRCodeOptions = {
    data: getData(),
    width: clampDimension(state.width),
    height: clampDimension(state.height),
    margin: Math.max(0, Number(state.margin) || 0),
    type: 'svg',
    image: state.logo || undefined,
    imageOptions: {
      hideBackgroundDots: state.logo_hide,
      margin: Math.max(0, Number(state.logo_margin) || 0),
      crossOrigin: 'anonymous'
    },
    dotsOptions: {
      type: state.dot_type,
      color: state.dot_color
    },
    cornersSquareOptions: {
      type: state.corners_type,
      color: state.corners_color
    },
    cornersDotOptions: {
      type: state.corners_dot_type,
      color: state.corners_dot_color
    },
    backgroundOptions: {
      color: state.bg_color
    }
  }

  if (qrCode) {
    qrCode.update(options)
  } else {
    qrCode = new window.QRCodeStyling(options)
    qrCode.append(canvasRef.value)
  }
}

function clampDimension(value: number) {
  return Math.min(1000, Math.max(120, Number(value) || 320))
}

function getData() {
  switch (state.type) {
    case 'URL':
      return state.url.trim() || 'https://www.freetool.dev'
    case 'VCARD':
      return getVCard()
    case 'EMAIL':
      return `MATMSG:TO:${escapeQrValue(state.email_address)};SUB:${escapeQrValue(state.email_subject)};BODY:${escapeQrValue(state.email_message)};;`
    case 'WIFI':
      return `WIFI:S:${escapeQrValue(state.wifi_ssid)};P:${escapeQrValue(state.wifi_pass)};T:${state.wifi_cripto};H:${state.wifi_hidden};`
    case 'SMS':
       return `SMSTO:${state.sms_phone}:${state.sms_message}`
    case 'PIX':
       return generatePixPayload()
     default:
       return state.text.trim() || t('text_placeholder')
 }
 }
 
 function generatePixPayload() {
   const pixKey = state.pix_key.trim()
   if (!pixKey) return t('pix_empty')
 
   const name = removeAccents(state.pix_name.trim() || 'RECEBEDOR').toUpperCase().substring(0, 25)
   const city = removeAccents(state.pix_city.trim() || 'CIDADE').toUpperCase().substring(0, 15)
   const amount = formatPixAmount(state.pix_amount)
   // Fixed overhead: GUI field = 18, key field header = 4, desc field header = 4.
   // So desc can be at most (99 - 18 - 4 - pixKey.length - 4) chars.
   const maxDescLen = Math.max(0, 73 - pixKey.length)
   const desc = removeAccents(state.pix_desc.trim()).substring(0, Math.min(20, maxDescLen))
 
   // Merchant Account Information
   let merchantInfo = emvField('00', PIX_GUI)
   merchantInfo += emvField('01', pixKey)
   if (desc) merchantInfo += emvField('02', desc)
 
   let payload = emvField('00', '01') // Payload Format Indicator
   payload += emvField('26', merchantInfo)
   payload += emvField('52', '0000') // Merchant Category Code
   payload += emvField('53', '986')  // Transaction Currency (BRL)
   
   if (amount && amount !== '0.00') {
     payload += emvField('54', amount)
   }
 
   payload += emvField('58', 'BR')   // Country Code
   payload += emvField('59', name)
   payload += emvField('60', city)
   payload += emvField('62', emvField('05', '***')) // Additional Data Field (Reference Label)
   payload += '6304'      // CRC16 Indicator
 
   return payload + calculateCRC16(payload)
 }

 function emvField(id: string, value: string) {
   return `${id}${value.length.toString().padStart(2, '0')}${value}`
 }

 function formatPixAmount(value: string) {
   const normalized = String(value).trim().replace(',', '.')
   if (!normalized) return ''

   const amount = Number(normalized)
   if (!Number.isFinite(amount) || amount <= 0) return ''

   return amount.toFixed(2)
 }
 
 function calculateCRC16(data: string) {
   let crc = 0xFFFF
   const polynomial = 0x1021
 
   for (let i = 0; i < data.length; i++) {
     crc ^= data.charCodeAt(i) << 8
     for (let j = 0; j < 8; j++) {
       if (crc & 0x8000) {
         crc = (crc << 1) ^ polynomial
       } else {
         crc = crc << 1
       }
     }
   }
 
   return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
 }

function getVCard() {
  let content = 'BEGIN:VCARD\nVERSION:4.0'
  const fullName = [state.card_first_name, state.card_last_name].filter(Boolean).join(' ')

  if (fullName) content += `\nFN:${escapeVCard(fullName)}`
  if (state.card_last_name || state.card_first_name) {
    content += `\nN:${escapeVCard(state.card_last_name)};${escapeVCard(state.card_first_name)};;;`
  }
  if (state.card_street || state.card_city || state.card_state || state.card_zip || state.card_country) {
    content += `\nADR:;;${escapeVCard(state.card_street)};${escapeVCard(state.card_city)};${escapeVCard(state.card_state)};${escapeVCard(state.card_zip)};${escapeVCard(state.card_country)}`
  }
  if (state.card_cell) content += `\nTEL;TYPE=cell:tel:${escapeVCard(state.card_cell)}`
  if (state.card_tel_work) content += `\nTEL;TYPE=work:tel:${escapeVCard(state.card_tel_work)}`
  if (state.card_email) content += `\nEMAIL:${escapeVCard(state.card_email)}`
  if (state.card_org) content += `\nORG:${escapeVCard(state.card_org)}`
  if (state.card_job) content += `\nTITLE:${escapeVCard(state.card_job)}`
  if (state.card_site) content += `\nURL:${escapeVCard(state.card_site)}`

  return `${content}\nEND:VCARD`
}

function escapeVCard(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

function escapeQrValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:')
}

function chooseLogo() {
  fileInputRef.value?.click()
}

function onLogoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl)
  logoObjectUrl = URL.createObjectURL(file)
  state.logo = logoObjectUrl
}

function removeLogo() {
  if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl)
  logoObjectUrl = ''
  state.logo = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function download() {
  if (!qrCode) return
  qrCode.download({ name: 'qrcode', extension: 'png' })
  downloadFeedback.value = t('download_success')
  window.setTimeout(() => {
    downloadFeedback.value = ''
  }, 2000)
}

defineI18nRoute({
  paths: {
    pt: '/gerador-de-qr-code',
    es: '/generador-de-qr-code',
    fr: '/generateur-de-qr-code',
    it: '/generatore-di-qr-code',
    id: '/pembuat-kode-qr',
    de: '/qr-code-generator',
    nl: '/qr-code-generator'
  }
})

const { onLoaded } = useScript('https://cdn.jsdelivr.net/npm/qr-code-styling@1.9.2/lib/qr-code-styling.min.js', {
  trigger: 'client'
})

onLoaded(() => {
  qrLoaded.value = true
  generate()
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('meta')"
    :show-ads="hasCustomData"
    :see-also-links="[
      { label: t('see1'), to: 'emoji-picker' },
      { label: t('see2'), to: 'barcode-generator' },
      { label: t('see3'), to: 'random-colors' },
      { label: t('see4'), to: 'dominant-colors-of-the-image' }
    ]"
  >
    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div class="space-y-4">
        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4">
          <h2 class="mb-4 text-lg font-bold text-base-content">{{ t('data') }}</h2>

          <div class="grid gap-4">
            <label class="form-control flex flex-col w-full">
              <span class="label-text mb-2 font-semibold">{{ t('data_opt') }}</span>
              <select id="qr-type" v-model="state.type" class="select select-bordered bg-base-100">
                <option value="URL">URL / Link</option>
                <option value="VCARD">vCard</option>
                <option value="EMAIL">Email</option>
                <option value="WIFI">Wi-Fi</option>
                <option value="SMS">SMS</option>
                <option value="PIX">{{ t('pix') }}</option>
                <option value="TEXT">{{ t('text') }}</option>
              </select>
            </label>

            <label v-if="state.type === 'URL'" class="form-control flex flex-col w-full">
              <span class="label-text mb-2 font-semibold">URL</span>
              <input id="qr-url" v-model="state.url" type="url" class="input input-bordered bg-base-100" placeholder="https://www.freetool.dev" inputmode="url" />
            </label>

            <template v-if="state.type === 'VCARD'">
              <div class="grid gap-3 sm:grid-cols-2">
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('first_name') }}</span>
                  <input id="first-name" v-model="state.card_first_name" type="text" class="input input-bordered bg-base-100" autocomplete="given-name" />
                </label>
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('last_name') }}</span>
                  <input id="last-name" v-model="state.card_last_name" type="text" class="input input-bordered bg-base-100" autocomplete="family-name" />
                </label>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('cell') }}</span>
                  <input id="cell" v-model="state.card_cell" type="tel" class="input input-bordered bg-base-100" autocomplete="tel" />
                </label>
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('tel_work') }}</span>
                  <input id="tel-work" v-model="state.card_tel_work" type="tel" class="input input-bordered bg-base-100" />
                </label>
              </div>

              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">Email</span>
                <input id="card-email" v-model="state.card_email" type="email" class="input input-bordered bg-base-100" autocomplete="email" />
              </label>

              <div class="grid gap-3 sm:grid-cols-2">
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('org') }}</span>
                  <input id="org" v-model="state.card_org" type="text" class="input input-bordered bg-base-100" autocomplete="organization" />
                </label>
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('job') }}</span>
                  <input id="job" v-model="state.card_job" type="text" class="input input-bordered bg-base-100" />
                </label>
              </div>

              <details class="collapse collapse-arrow rounded-2xl border border-base-content/10 bg-base-100">
                <summary class="collapse-title font-semibold">{{ t('address') }}</summary>
                <div class="collapse-content grid gap-3">
                  <label class="form-control flex flex-col w-full">
                    <span class="label-text mb-2 font-semibold">{{ t('street') }}</span>
                    <input v-model="state.card_street" type="text" class="input input-bordered bg-base-100" :placeholder="t('street')" autocomplete="street-address" />
                  </label>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="form-control flex flex-col w-full">
                      <span class="label-text mb-2 font-semibold">{{ t('city') }}</span>
                      <input v-model="state.card_city" type="text" class="input input-bordered bg-base-100" :placeholder="t('city')" autocomplete="address-level2" />
                    </label>
                    <label class="form-control flex flex-col w-full">
                      <span class="label-text mb-2 font-semibold">{{ t('state') }}</span>
                      <input v-model="state.card_state" type="text" class="input input-bordered bg-base-100" :placeholder="t('state')" autocomplete="address-level1" />
                    </label>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="form-control flex flex-col w-full">
                      <span class="label-text mb-2 font-semibold">{{ t('zip') }}</span>
                      <input v-model="state.card_zip" type="text" class="input input-bordered bg-base-100" :placeholder="t('zip')" autocomplete="postal-code" />
                    </label>
                    <label class="form-control flex flex-col w-full">
                      <span class="label-text mb-2 font-semibold">{{ t('country') }}</span>
                      <input v-model="state.card_country" type="text" class="input input-bordered bg-base-100" :placeholder="t('country')" autocomplete="country-name" />
                    </label>
                  </div>
                  <label class="form-control flex flex-col w-full">
                    <span class="label-text mb-2 font-semibold">Site</span>
                    <input v-model="state.card_site" type="url" class="input input-bordered bg-base-100" placeholder="Site" inputmode="url" />
                  </label>
                </div>
              </details>
            </template>

            <template v-if="state.type === 'EMAIL'">
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">Email</span>
                <input v-model="state.email_address" type="email" class="input input-bordered bg-base-100" :placeholder="t('email_placeholder')" autocomplete="email" />
              </label>
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('subject') }}</span>
                <input v-model="state.email_subject" type="text" class="input input-bordered bg-base-100" :placeholder="t('subject')" />
              </label>
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('msg') }}</span>
                <textarea v-model="state.email_message" class="textarea textarea-bordered min-h-28 bg-base-100" :placeholder="t('msg')" maxlength="4000" />
              </label>
            </template>

            <template v-if="state.type === 'WIFI'">
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('ssid') }}</span>
                <input v-model="state.wifi_ssid" type="text" class="input input-bordered bg-base-100" :placeholder="t('ssid')" autocomplete="off" />
              </label>
              <div class="grid gap-3 sm:grid-cols-2">
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('pass') }}</span>
                  <input v-model="state.wifi_pass" type="password" class="input input-bordered bg-base-100" :placeholder="t('pass')" autocomplete="new-password" />
                </label>
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('cripto') }}</span>
                  <select v-model="state.wifi_cripto" class="select select-bordered bg-base-100" :aria-label="t('cripto')">
                    <option value="WPA">WPA/WPA2/WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{{ t('none') }}</option>
                  </select>
                </label>
              </div>
              <label class="label cursor-pointer justify-start gap-3">
                <input v-model="state.wifi_hidden" type="checkbox" class="toggle toggle-primary" />
                <span class="label-text">{{ t('hidden') }}</span>
              </label>
            </template>

            <template v-if="state.type === 'SMS'">
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('phone') }}</span>
                <input v-model="state.sms_phone" type="tel" class="input input-bordered bg-base-100" :placeholder="t('phone')" inputmode="tel" />
              </label>
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('msg') }}</span>
                <textarea v-model="state.sms_message" class="textarea textarea-bordered min-h-24 bg-base-100" :placeholder="t('msg')" maxlength="150" />
              </label>
            </template>

            <template v-if="state.type === 'PIX'">
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('pix_key') }}</span>
                <input v-model="state.pix_key" type="text" class="input input-bordered bg-base-100" :placeholder="t('pix_key_placeholder')" />
              </label>
              <div class="grid gap-3 sm:grid-cols-2">
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('pix_name') }}</span>
                  <input v-model="state.pix_name" type="text" class="input input-bordered bg-base-100" :placeholder="t('pix_name')" maxlength="25" />
                </label>
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('pix_city') }}</span>
                  <input v-model="state.pix_city" type="text" class="input input-bordered bg-base-100" :placeholder="t('pix_city')" maxlength="15" />
                </label>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('pix_amount') }} {{ t('optional') }}</span>
                  <input v-model="state.pix_amount" type="number" step="0.01" min="0" class="input input-bordered bg-base-100" placeholder="0.00" />
                </label>
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('msg') }} {{ t('optional') }}</span>
                  <input v-model="state.pix_desc" type="text" class="input input-bordered bg-base-100" :placeholder="t('pix_desc_placeholder')" maxlength="20" />
                </label>
              </div>
              <p class="text-xs text-base-content/60 px-1 mt-1">
                {{ t('pix_note') }}
              </p>
            </template>

            <label v-if="state.type === 'TEXT'" class="form-control flex flex-col w-full">
              <span class="label-text mb-2 font-semibold">{{ t('text') }}</span>
              <textarea
                v-model="state.text"
                class="textarea textarea-bordered min-h-28 bg-base-100"
                :placeholder="t('text_placeholder')"
                maxlength="4000"
              />
            </label>
          </div>
        </section>

        <section class="rounded-2xl border border-base-content/10 bg-base-200/35 p-4">
          <h2 class="mb-4 text-lg font-bold text-base-content">{{ t('customization') }}</h2>

          <div class="grid gap-5">
            <div class="flex items-end gap-3">
              <label class="form-control flex-1">
                <span class="label-text mb-2 font-semibold">{{ t('width') }}</span>
                <input v-model.number="state.width" type="number" min="120" max="1000" class="input input-bordered bg-base-100" />
              </label>
              
              <div class="mb-2">
                <button 
                  type="button" 
                  class="btn btn-ghost btn-sm btn-circle" 
                  :class="{ 'text-primary': state.lockProportions }"
                  @click="state.lockProportions = !state.lockProportions"
                  :title="state.lockProportions ? t('unlink') : t('link')"
                >
                  <Icon :name="state.lockProportions ? 'heroicons:link-20-solid' : 'heroicons:link-slash-20-solid'" class="h-5 w-5" />
                </button>
              </div>

              <label class="form-control flex-1">
                <span class="label-text mb-2 font-semibold">{{ t('height') }}</span>
                <input v-model.number="state.height" type="number" min="120" max="1000" class="input input-bordered bg-base-100" />
              </label>
              <label class="form-control w-20">
                <span class="label-text mb-2 font-semibold">{{ t('margin') }}</span>
                <input v-model.number="state.margin" type="number" min="0" max="80" class="input input-bordered bg-base-100" />
              </label>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('dot_style') }}</span>
                <select v-model="state.dot_type" class="select select-bordered bg-base-100">
                  <option value="square">{{ t('square') }}</option>
                  <option value="dots">{{ t('dots') }}</option>
                  <option value="rounded">{{ t('rounded') }}</option>
                  <option value="extra-rounded">Extra {{ t('rounded') }}</option>
                  <option value="classy">{{ t('classy') }}</option>
                  <option value="classy-rounded">{{ t('classy') }} {{ t('rounded') }}</option>
                </select>
              </label>
              <label class="form-control flex flex-col w-full">
                <span class="label-text mb-2 font-semibold">{{ t('corner_style') }}</span>
                <select v-model="state.corners_type" class="select select-bordered bg-base-100">
                  <option value="square">{{ t('square') }}</option>
                  <option value="dots">{{ t('dots') }}</option>
                  <option value="extra-rounded">Extra {{ t('rounded') }}</option>
                </select>
              </label>
            </div>

            <h3 class="text-sm font-bold opacity-80 uppercase tracking-wide">{{ t('colors_label') }}</h3>

            <div class="grid gap-3 grid-cols-2">
              <label class="qr-color-control">
                <span>{{ t('dot_color') }}</span>
                <input v-model="state.dot_color" type="color" />
              </label>
              <label class="qr-color-control">
                <span>{{ t('corners_color') }}</span>
                <input v-model="state.corners_color" type="color" />
              </label>
              <label class="qr-color-control">
                <span>{{ t('corners_dot_color') }}</span>
                <input v-model="state.corners_dot_color" type="color" />
              </label>
              <label class="qr-color-control">
                <span>{{ t('bck_clr') }}</span>
                <input v-model="state.bg_color" type="color" />
              </label>
            </div>

            <div class="rounded-2xl border border-base-content/10 bg-base-100 p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="font-bold">{{ t('logo') }}</h3>
                  <p class="text-sm text-base-content/70">{{ t('logo_help') }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button type="button" class="btn btn-primary btn-sm" @click="chooseLogo">
                    <Icon name="heroicons:arrow-up-tray-20-solid" class="h-4 w-4" aria-hidden="true" />
                    {{ t('choose_logo') }}
                  </button>
                  <button v-if="state.logo" type="button" class="btn btn-ghost btn-sm" @click="removeLogo">
                    {{ t('remove') }}
                  </button>
                </div>
              </div>

              <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onLogoChange" />

              <div v-if="state.logo" class="mt-4 grid gap-3 sm:grid-cols-[1fr_160px]">
                <label class="label cursor-pointer justify-start gap-3 rounded-xl bg-base-200 px-3">
                  <input v-model="state.logo_hide" type="checkbox" class="toggle toggle-primary" />
                  <span class="label-text">{{ t('hide') }}</span>
                </label>
                <label class="form-control flex flex-col w-full">
                  <span class="label-text mb-2 font-semibold">{{ t('logo_margin') }}</span>
                  <input v-model.number="state.logo_margin" type="number" min="0" max="40" class="input input-bordered bg-base-100" />
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:sticky lg:top-6 lg:self-start">
        <div class="rounded-2xl border border-primary/20 bg-base-100 p-4 shadow-sm">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold">{{ t('preview') }}</h2>
            <span class="badge badge-outline">{{ state.width }} x {{ state.height }}</span>
          </div>

          <div ref="previewContainerRef" class="flex flex-col min-h-[340px] items-center justify-center rounded-2xl bg-base-200/50 p-3 overflow-hidden">
            <div id="qr-code" ref="canvasRef" class="qr-preview overflow-hidden rounded-xl bg-white shadow-inner flex items-center justify-center min-h-[300px]" />
            
            <div v-if="state.width > 400 || state.height > 400" class="mt-2 text-center">
              <span class="badge badge-ghost badge-sm opacity-60">{{ t('scaled_preview') }} ({{ state.width }}x{{ state.height }}px)</span>
            </div>
          </div>

          <button type="button" class="btn btn-primary mt-4 w-full" :disabled="!qrLoaded" :aria-label="t('download_aria')" @click="download">
            <Icon name="heroicons:arrow-down-tray-20-solid" class="h-5 w-5" aria-hidden="true" />
            Download PNG
          </button>

          <p class="mt-3 text-sm text-base-content/70">{{ t('scan_tip') }}</p>
          <div role="status" aria-live="polite" class="sr-only">{{ downloadFeedback }}</div>
        </div>
      </aside>
    </div>

    <template #info>
      <div class="space-y-8">
        <p>{{ t('intro') }}</p>

        <FeatureSection
          :title="t('features_title')"
          :items="[t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')]"
        />

        <section>
          <h2 class="mb-3 text-2xl font-bold text-base-content flex items-center gap-2">
            <Icon name="material-symbols:qr-code-2-rounded" class="text-primary w-6 h-6" aria-hidden="true" />
            {{ t('types_title') }}
          </h2>
          <p class="mb-4 text-base-content/80 leading-relaxed">{{ t('types_desc') }}</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <p v-for="key in ['type_url', 'type_vcard', 'type_pix', 'type_email', 'type_wifi', 'type_sms', 'type_text']" :key="key" class="rounded-2xl border border-base-content/10 bg-base-200/40 p-4">
              {{ t(key) }}
            </p>
          </div>
        </section>

        <UseCaseSection
          :title="t('use_cases_title')"
          :description="t('use_cases_desc')"
          :items="[
            { title: t('uc_1_title'), description: t('uc_1_desc') },
            { title: t('uc_2_title'), description: t('uc_2_desc') },
            { title: t('uc_3_title'), description: t('uc_3_desc') },
            { title: t('uc_4_title'), description: t('uc_4_desc') }
          ]"
        />

        <HowToSection
          :title="t('how_to_title')"
          :items="[
            { title: t('how_1_title'), description: t('how_1_desc') },
            { title: t('how_2_title'), description: t('how_2_desc') },
            { title: t('how_3_title'), description: t('how_3_desc') }
          ]"
        />

        <FaqSection :title="t('faq_title')" :items="faqItems" />
      </div>
    </template>
  </ToolPage>
</template>

<style scoped>
.qr-preview {
  width: 100%;
  max-width: 100%;
}

.qr-preview :deep(svg), 
.qr-preview :deep(canvas) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
}

.qr-preview :deep(svg),
.qr-preview :deep(canvas) {
  max-width: 100% !important;
  max-height: 100% !important;
  height: auto !important;
  width: auto !important;
  display: block;
}

/* Ensure the library's wrapper div also behaves */
.qr-preview :deep(> div) {
  display: flex !important;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

.qr-color-control {
  display: flex;
  min-height: 3.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid color-mix(in oklab, currentColor 12%, transparent);
  border-radius: 1rem;
  background: color-mix(in oklab, currentColor 4%, transparent);
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.qr-color-control input {
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  cursor: pointer;
  border: 0;
  border-radius: 999px;
  background: transparent;
  padding: 0;
}
</style>

<i18n lang="yaml">
{
  en: {
    title: "QR Code Generator",
    page_title: "QR Code Generator with Logo - Create Free Custom QR Code",
    meta: "Free online QR Code generator with logo. Create QR codes for PIX, Wi-Fi, vCard and URL. Customize colors, shapes and download in high resolution for printing.",
    og_title: "Free Online QR Code Generator with Logo",
    intro: "Create custom QR codes with logo for free and privately. Our tool offers instant in-browser processing, ensuring your data never leaves your device. Ideal for printed and digital materials.",
    data: "QR Code Data",
    data_opt: "Data type",
    text: "Text",
    text_placeholder: "Type the text that will be saved in the QR Code",
    first_name: "First Name",
    last_name: "Last Name",
    address: "Address",
    street: "Street",
    city: "City",
    state: "State",
    zip: "Zip Code",
    country: "Country",
    phone: "Phone",
    cell: "Cell",
    tel_work: "Work Phone",
    org: "Organization",
    job: "Job Title",
    subject: "Subject",
    msg: "Message",
    ssid: "Network Name",
    cripto: "Encryption",
    none: "None",
    hidden: "Hidden Wi-Fi network",
    pass: "Password",
    pix_key: "PIX Key",
    pix_name: "Receiver Name",
    pix_city: "City",
    pix_amount: "Amount",
    colors_label: "Colors",
    customization: "Customization",
    width: "Width",
    height: "Height",
    margin: "Margin",
    logo: "Logo",
    logo_help: "Add an image to the center of the QR Code and test reading before printing.",
    choose_logo: "Choose logo",
    logo_margin: "Logo margin",
    hide: "Hide dots behind logo",
    remove: "Remove",
    dot_style: "Dot style",
    corner_style: "Corner style",
    square: "Square",
    dots: "Dots",
    rounded: "Rounded",
    classy: "Classy",
    dot_color: "Dots",
    corners_color: "Corners",
    corners_dot_color: "Corner center",
    bck_clr: "Background",
    preview: "Preview",
    scan_tip: "Tip: use good contrast between dots and background to keep the QR Code easy to scan.",
    download_aria: "Download QR Code as PNG image",
    download_success: "QR Code downloaded successfully.",
    features_title: "QR Code generator features",
    feature_1: "QR Code creation for URL, vCard contacts, Wi-Fi, PIX, Email, SMS and text",
    feature_2: "Customization of colors, dot shapes, corners, size and margin",
    feature_3: "Central logo upload with margin control and hidden background",
    feature_4: "High-resolution PNG image download, ready for use in prints of any size",
    use_cases_title: "Where to use custom QR Codes",
    use_cases_desc: "Custom QR codes help connect physical materials to digital experiences without requiring the person to manually type links or data.",
    uc_1_title: "Marketing and printed materials",
    uc_1_desc: "Include QR codes on cards, folders, packaging, banners and posters to lead visitors to pages, catalogs, coupons and campaigns.",
    uc_2_title: "Digital business card",
    uc_2_desc: "Use the vCard template to share name, phone, email, company, job title, address and website in a single scan.",
    uc_3_title: "Quick Wi-Fi access",
    uc_3_desc: "Create QR codes for Wi-Fi networks and allow customers, guests or teams to connect without typing the password.",
    uc_4_title: "Service and communication",
    uc_4_desc: "Generate QR codes for pre-filled SMS or email and reduce steps in forms, support, reservations and quote requests.",
    how_to_title: "How to create a QR Code",
    how_1_title: "Choose content type",
    how_1_desc: "Select a content type and fill in only the necessary fields for that format.",
    how_2_title: "Customize appearance",
    how_2_desc: "Adjust size, margin, colors, dot shape and corners. If you want, add your brand logo to the center.",
    how_3_title: "Test and download in PNG",
    how_3_desc: "Check the preview, scan with your phone to validate and download the PNG file ready to use digitally or in print.",
    types_title: "Available QR Code types",
    types_desc: "Each type generates a structure compatible with common QR code readers on modern smartphones.",
    type_url: "URL: directs the person to a website, landing page, form, menu, social profile or online file.",
    type_vcard: "vCard: saves contact data directly to the phone's agenda.",
    type_email: "Email: opens the email app with recipient, subject and message already filled in.",
    type_wifi: "Wi-Fi: facilitates connection to a network with SSID, password and encryption type.",
    type_sms: "SMS: opens a text message with phone and content defined.",
    type_pix: "PIX: generates a static QR Code for receiving payments and transfers.",
    type_text: "Text: stores simple information that appears directly upon scanning.",
    faq_title: "Frequently Asked Questions",
    faq_1_q: "Can I add my logo to the QR Code?",
    faq_1_a: "Yes. Use the logo option to upload an image and position it in the center. To keep reading reliable, prefer simple logos and test the QR code before printing.",
    faq_3_q: "Does the QR Code still work with different colors and shapes?",
    faq_3_a: "Yes, as long as there is enough contrast between the dots and the background. Avoid very light colors on dots and always test reading on your phone.",
    faq_4_q: "What format is the download in?",
    faq_4_a: "Files are generated in high-quality PNG format, ideal for digital use and printing.",
    see1: "Emoji Picker",
    see2: "Barcode Generator",
    see3: "Random Colors",
    see4: "Dominant Colors of the Image",
    email_placeholder: "email{'@'}example.com",
    optional: "(Optional)",
    pix_key_placeholder: "CPF, Email, Phone or Random Key",
    pix_desc_placeholder: "Description",
    pix_note: "Note: The generated PIX QR Code is static. Verify the data before sharing.",
    pix_empty: "Provide a PIX key to generate the QR Code",
    unlink: "Unlink proportions",
    link: "Link proportions",
    scaled_preview: "Scaled preview",
    pix: "PIX (Brazil)"
  },
  pt: {
    title: "Gerador de QR Code",
    page_title: "Gerador de QR Code com Logo - Criar QR Code Personalizado Grátis",
    meta: "Gerador de QR Code com logo online e grátis. Crie QR Codes para PIX, Wi-Fi, vCard e URL. Personalize cores, formatos e baixe em alta resolução para impressão.",
    og_title: "Gerador de QR Code com Logo Online e Grátis",
    intro: "Crie QR Codes personalizados com logo de forma gratuita e privada. Nossa ferramenta oferece processamento instantâneo no navegador, garantindo que seus dados não saiam do seu dispositivo. Ideal para materiais impressos e digitais.",

    data: "Dados do QR Code",
    data_opt: "Tipo de dado",
    text: "Texto",
    text_placeholder: "Digite o texto que será salvo no QR Code",
    first_name: "Nome",
    last_name: "Sobrenome",
    address: "Endereço",
    street: "Rua",
    city: "Cidade",
    state: "Estado",
    zip: "Código Postal (CEP)",
    country: "País",
    phone: "Telefone",
    cell: "Celular",
    tel_work: "Telefone do trabalho",
    org: "Empresa",
    job: "Cargo",
    subject: "Assunto",
    msg: "Mensagem",
    ssid: "Nome da rede",
    cripto: "Criptografia",
    none: "Nenhuma",
    hidden: "Rede Wi-Fi oculta",
    pass: "Senha",
    pix_key: "Chave PIX",
    pix_name: "Nome do Recebedor",
    pix_city: "Cidade",
    pix_amount: "Valor",

    colors_label: "Cores",
    customization: "Personalização",
    width: "Largura",
    height: "Altura",
    margin: "Margem",
    logo: "Logotipo",
    logo_help: "Adicione uma imagem ao centro do QR Code e teste a leitura antes de imprimir.",
    choose_logo: "Escolher logo",
    logo_margin: "Margem do logo",
    hide: "Ocultar pontos atrás do logo",
    remove: "Remover",
    dot_style: "Formato dos pontos",
    corner_style: "Formato dos cantos",
    square: "Quadrado",
    dots: "Pontos",
    rounded: "Arredondado",
    classy: "Elegante",
    dot_color: "Pontos",
    corners_color: "Cantos",
    corners_dot_color: "Centro dos cantos",
    bck_clr: "Fundo",
    preview: "Pré-visualização",
    scan_tip: "Dica: use bom contraste entre pontos e fundo para manter o QR Code fácil de escanear.",
    download_aria: "Baixar QR Code como imagem PNG",
    download_success: "QR Code baixado com sucesso.",

    features_title: "Recursos do gerador de QR Code",
    feature_1: "Criação de QR Code para URL, contatos vCard, Wi-Fi, PIX, Email, SMS e texto",
    feature_2: "Personalização de cores, formatos dos pontos, cantos, tamanho e margem",
    feature_3: "Upload de logo central com controle de margem e fundo oculto",
    feature_4: "Download em imagem PNG de alta resolução, pronta para uso em impressos de qualquer tamanho",

    use_cases_title: "Onde usar QR Codes personalizados",
    use_cases_desc: "QR Codes personalizados ajudam a conectar materiais físicos a experiências digitais sem exigir que a pessoa digite links ou dados manualmente.",
    uc_1_title: "Marketing e materiais impressos",
    uc_1_desc: "Inclua QR Codes em cartões, folders, embalagens, banners e cartazes para levar visitantes a páginas, catálogos, cupons e campanhas.",
    uc_2_title: "Cartão de visita digital",
    uc_2_desc: "Use o modelo vCard para compartilhar nome, telefone, email, empresa, cargo, endereço e site em um único escaneamento.",
    uc_3_title: "Acesso rápido ao Wi-Fi",
    uc_3_desc: "Crie QR Codes para redes Wi-Fi e permita que clientes, convidados ou equipes se conectem sem digitar a senha.",
    uc_4_title: "Atendimento e comunicação",
    uc_4_desc: "Gere QR Codes para SMS ou email pré-preenchido e reduza etapas em formulários, suporte, reservas e pedidos de orçamento.",

    how_to_title: "Como criar um QR Code",
    how_1_title: "Escolha o tipo de conteúdo",
    how_1_desc: "Selecione um tipo de conteúdo e preencha apenas os campos necessários para aquele formato.",
    how_2_title: "Personalize a aparência",
    how_2_desc: "Ajuste tamanho, margem, cores, formato dos pontos e cantos. Se quiser, adicione o logo da sua marca ao centro.",
    how_3_title: "Teste e baixe em PNG",
    how_3_desc: "Confira a prévia, escaneie com o celular para validar e baixe o arquivo PNG pronto para usar no digital ou impresso.",

    types_title: "Tipos de QR Code disponíveis",
    types_desc: "Cada tipo gera uma estrutura compatível com leitores comuns de QR Code em celulares modernos.",
    type_url: "URL: direciona a pessoa para um site, landing page, formulário, cardápio, perfil social ou arquivo online.",
    type_vcard: "vCard: salva dados de contato diretamente na agenda do celular.",
    type_email: "Email: abre o aplicativo de email com destinatário, assunto e mensagem já preenchidos.",
    type_wifi: "Wi-Fi: facilita a conexão a uma rede com SSID, senha e tipo de criptografia.",
    type_sms: "SMS: abre uma mensagem de texto com telefone e conteúdo definidos.",
    type_pix: "PIX: gera um QR Code estático para recebimento de pagamentos e transferências.",
    type_text: "Texto: armazena uma informação simples que aparece diretamente ao escanear.",

    faq_title: "Perguntas frequentes",
    faq_1_q: "Posso adicionar meu logo ao QR Code?",
    faq_1_a: "Sim. Use a opção de logo para enviar uma imagem e posicioná-la no centro. Para manter a leitura confiável, prefira logos simples e teste o QR Code antes de imprimir.",
    faq_3_q: "O QR Code continua funcionando com cores e formatos diferentes?",
    faq_3_a: "Sim, desde que exista contraste suficiente entre os pontos e o fundo. Evite cores muito claras nos pontos e sempre teste a leitura no celular.",
    faq_4_q: "O download é feito em qual formato?",
    faq_4_a: "Os arquivos são gerados no formato PNG de alta qualidade, ideal para uso digital e impressão.",

    see1: "Seletor de Emoji",
    see2: "Gerador de Código de Barras",
    see3: "Cores Aleatórias",
    see4: "Cores Dominantes da Imagem",
    email_placeholder: "email{'@'}exemplo.com",
    optional: "(Opcional)",
    pix_key_placeholder: "CPF, Email, Telefone ou Chave Aleatória",
    pix_desc_placeholder: "Descrição",
    pix_note: "Nota: O QR Code PIX gerado é estático. Verifique os dados antes de compartilhar.",
    pix_empty: "Informe uma chave PIX para gerar o QR Code",
    unlink: "Desvincular proporções",
    link: "Vincular proporções",
    scaled_preview: "Visualização em escala",
    pix: "PIX (Brasil)"
  },
  es: {
    title: "Generador de Código QR",
    page_title: "Generador de Código QR con Logo - Crear Código QR Personalizado Gratis",
    meta: "Generador de código QR con logo online y gratis. Crea códigos QR para PIX, Wi-Fi, vCard y URL. Personaliza colores, formas y descarga en alta resolución para impresión.",
    og_title: "Generador de Código QR con Logo Online y Gratis",
    intro: "Crea códigos QR personalizados con logo de forma gratuita y privada. Nuestra herramienta ofrece procesamiento instantáneo en el navegador, garantizando que sus datos no salgan de su dispositivo. Ideal para materiales impresos y digitales.",
    data: "Datos del Código QR",
    data_opt: "Tipo de dato",
    text: "Texto",
    text_placeholder: "Escriba el texto que se guardará en el código QR",
    first_name: "Nombre",
    last_name: "Apellido",
    address: "Dirección",
    street: "Calle",
    city: "Ciudad",
    state: "Estado",
    zip: "Código Postal",
    country: "País",
    phone: "Teléfono",
    cell: "Celular",
    tel_work: "Teléfono del trabajo",
    org: "Empresa",
    job: "Cargo",
    subject: "Asunto",
    msg: "Mensaje",
    ssid: "Nombre de la red",
    cripto: "Cifrado",
    none: "Ninguno",
    hidden: "Red Wi-Fi oculta",
    pass: "Contraseña",
    pix_key: "Clave PIX",
    pix_name: "Nombre del receptor",
    pix_city: "Ciudad",
    pix_amount: "Valor",
    colors_label: "Colores",
    customization: "Personalización",
    width: "Ancho",
    height: "Altura",
    margin: "Margen",
    logo: "Logotipo",
    logo_help: "Agregue una imagen al centro del código QR y pruebe la lectura antes de imprimir.",
    choose_logo: "Elegir logo",
    logo_margin: "Margen del logo",
    hide: "Ocultar puntos detrás del logo",
    remove: "Eliminar",
    dot_style: "Formato de puntos",
    corner_style: "Formato de esquinas",
    square: "Cuadrado",
    dots: "Puntos",
    rounded: "Redondeado",
    classy: "Elegante",
    dot_color: "Puntos",
    corners_color: "Esquinas",
    corners_dot_color: "Centro de esquinas",
    bck_clr: "Fondo",
    preview: "Vista previa",
    scan_tip: "Sugerencia: use un buen contraste entre los puntos y el fondo para que el código QR sea fácil de escanear.",
    download_aria: "Descargar código QR como imagen PNG",
    download_success: "Código QR descargado con éxito.",
    features_title: "Funciones del generador de códigos QR",
    feature_1: "Creación de códigos QR para URL, contactos vCard, Wi-Fi, PIX, Correo electrónico, SMS y texto",
    feature_2: "Personalización de colores, formatos de puntos, esquinas, tamaño y margen",
    feature_3: "Carga de logo central con control de margen y fondo oculto",
    feature_4: "Descarga de imagen PNG de alta resolución, lista para usar en impresiones de cualquier tamaño",
    use_cases_title: "Dónde usar códigos QR personalizados",
    use_cases_desc: "Los códigos QR personalizados ayudan a conectar materiales físicos con experiencias digitales sin requerir que la persona escriba enlaces o datos manualmente.",
    uc_1_title: "Marketing y materiales impresos",
    uc_1_desc: "Incluya códigos QR en tarjetas, folletos, empaques, pancartas y carteles para llevar a los visitantes a páginas, catálogos, cupones y campañas.",
    uc_2_title: "Tarjeta de visita digital",
    uc_2_desc: "Use el modelo vCard para compartir nombre, teléfono, correo electrónico, empresa, cargo, dirección y sitio web en un solo escaneo.",
    uc_3_title: "Acceso rápido a Wi-Fi",
    uc_3_desc: "Cree códigos QR para redes Wi-Fi y permita que clientes, invitados o equipos se conecten sin escribir la contraseña.",
    uc_4_title: "Atención y comunicación",
    uc_4_desc: "Genere códigos QR para SMS o correo electrónico pre-completado y reduzca pasos en formularios, soporte, reservas y solicitudes de presupuesto.",
    how_to_title: "Cómo crear un código QR",
    how_1_title: "Elija el tipo de contenido",
    how_1_desc: "Seleccione un tipo de contenido y complete solo los campos necesarios para ese formato.",
    how_2_title: "Personalice la apariencia",
    how_2_desc: "Ajuste el tamaño, margen, colores, formato de puntos y esquinas. Si lo desea, agregue el logo de su marca al centro.",
    how_3_title: "Pruebe y descargue en PNG",
    how_3_desc: "Verifique la vista previa, escanee con su teléfono para validar y descargue el archivo PNG listo para usar digitalmente o impreso.",
    types_title: "Tipos de códigos QR disponibles",
    types_desc: "Cada tipo genera una estructura compatible con los lectores de códigos QR comunes en los teléfonos modernos.",
    type_url: "URL: dirige a la persona a un sitio web, página de destino, formulario, menú, perfil social o archivo en línea.",
    type_vcard: "vCard: guarda los datos de contacto directamente en la agenda del teléfono.",
    type_email: "Correo electrónico: abre la aplicación de correo con destinatario, asunto y mensaje ya completados.",
    type_wifi: "Wi-Fi: facilita la conexión a una red con SSID, contraseña y tipo de cifrado.",
    type_sms: "SMS: abre un mensaje de texto con teléfono y contenido definidos.",
    type_pix: "PIX: genera un código QR estático para recibir pagos y transferencias.",
    type_text: "Texto: almacena información simple que aparece directamente al escanear.",
    faq_title: "Preguntas frecuentes",
    faq_1_q: "¿Puedo agregar mi logo al código QR?",
    faq_1_a: "Sí. Use la opción de logo para enviar una imagen y posicionarla en el centro. Para mantener la lectura confiable, prefiera logos simples y pruebe el código QR antes de imprimir.",
    faq_3_q: "¿El código QR sigue funcionando con diferentes colores y formas?",
    faq_3_a: "Sí, siempre que haya suficiente contraste entre los puntos y el fondo. Evite colores muy claros en los puntos y siempre pruebe la lectura en su teléfono.",
    faq_4_q: "¿En qué formato se realiza la descarga?",
    faq_4_a: "Los archivos se generan en formato PNG de alta calidad, ideal para uso digital e impresión.",
    see1: "Copiar y Pegar Emojis",
    see2: "Generador de Código de Barras",
    see3: "Colores Aleatorios",
    see4: "Colores Dominantes de la Imagen",
    email_placeholder: "email{'@'}ejemplo.com",
    optional: "(Opcional)",
    pix_key_placeholder: "CPF, Correo, Teléfono o Clave Aleatoria",
    pix_desc_placeholder: "Descripción",
    pix_note: "Nota: El Código QR PIX generado es estático. Verifique los datos antes de compartir.",
    pix_empty: "Proporcione una clave PIX para generar el Código QR",
    unlink: "Desvincular proporciones",
    link: "Vincular proporciones",
    scaled_preview: "Vista previa a escala",
    pix: "PIX (Brasil)"
  },
  fr: {
    title: "Générateur de Code QR",
    page_title: "Générateur de Code QR avec Logo - Créer un Code QR Personnalisé Gratuit",
    meta: "Générateur de code QR avec logo en ligne et gratuit. Créez des codes QR pour PIX, Wi-Fi, vCard et URL. Personnalisez les couleurs, les formes et téléchargez en haute résolution pour l'impression.",
    og_title: "Générateur de Code QR avec Logo Online et Gratuit",
    intro: "Créez des codes QR personnalisés avec logo gratuitement et en toute confidentialité. Notre outil offre un traitement instantané dans le navigateur, garantissant que vos données ne quittent jamais votre appareil. Idéal pour les supports imprimés et numériques.",
    data: "Données du Code QR",
    data_opt: "Type de données",
    text: "Texte",
    text_placeholder: "Tapez le texte qui sera enregistré dans le code QR",
    first_name: "Prénom",
    last_name: "Nom",
    address: "Adresse",
    street: "Rue",
    city: "Ville",
    state: "État",
    zip: "Code Postal",
    country: "Pays",
    phone: "Téléphone",
    cell: "Portable",
    tel_work: "Téléphone professionnel",
    org: "Organisation",
    job: "Poste",
    subject: "Objet",
    msg: "Message",
    ssid: "Nom du réseau",
    cripto: "Chiffrement",
    none: "Aucun",
    hidden: "Réseau Wi-Fi caché",
    pass: "Mot de passe",
    pix_key: "Clé PIX",
    pix_name: "Nom du destinataire",
    pix_city: "Ville",
    pix_amount: "Montant",
    colors_label: "Couleurs",
    customization: "Personnalisation",
    width: "Largeur",
    height: "Hauteur",
    margin: "Marge",
    logo: "Logo",
    logo_help: "Ajoutez une image au centre du code QR et testez la lecture avant d'imprimer.",
    choose_logo: "Choisir un logo",
    logo_margin: "Marge du logo",
    hide: "Masquer les points derrière le logo",
    remove: "Supprimer",
    dot_style: "Style de points",
    corner_style: "Style de coins",
    square: "Carré",
    dots: "Points",
    rounded: "Arrondi",
    classy: "Élégant",
    dot_color: "Points",
    corners_color: "Coins",
    corners_dot_color: "Centre des coins",
    bck_clr: "Fond",
    preview: "Aperçu",
    scan_tip: "Conseil : utilisez un bon contraste entre les points et le fond pour que le code QR soit facile à scanner.",
    download_aria: "Télécharger le code QR en image PNG",
    download_success: "Code QR téléchargé avec succès.",
    features_title: "Fonctionnalités du générateur de codes QR",
    feature_1: "Création de codes QR pour URL, contacts vCard, Wi-Fi, PIX, Email, SMS et texte",
    feature_2: "Personnalisation des couleurs, formes de points, coins, taille et marge",
    feature_3: "Téléchargement de logo central avec contrôle de marge et fond masqué",
    feature_4: "Téléchargement d'image PNG haute résolution, prête à l'emploi pour des impressions de toutes tailles",
    use_cases_title: "Où utiliser des codes QR personnalisés",
    use_cases_desc: "Les codes QR personnalisés aident à connecter les supports physiques aux expériences numériques sans obliger la personne à saisir manuellement des liens ou des données.",
    uc_1_title: "Marketing et supports imprimés",
    uc_1_desc: "Incluez des codes QR sur des cartes, des dépliants, des emballages, des bannières et des affiches pour diriger les visiteurs vers des pages, des catalogues, des coupons et des campagnes.",
    uc_2_title: "Carte de visite numérique",
    uc_2_desc: "Utilisez le modèle vCard pour partager le nom, le téléphone, l'e-mail, l'entreprise, le poste, l'adresse et le site Web en un seul scan.",
    uc_3_title: "Accès Wi-Fi rapide",
    uc_3_desc: "Créez des codes QR pour les réseaux Wi-Fi et permettez aux clients, invités ou équipes de se connecter sans saisir le mot de passe.",
    uc_4_title: "Service et communication",
    uc_4_desc: "Générez des codes QR pour des SMS ou des e-mails pré-remplis et réduisez les étapes dans les formulaires, le support, les réservations et les demandes de devis.",
    how_to_title: "Comment créer un code QR",
    how_1_title: "Choisissez le type de contenu",
    how_1_desc: "Sélectionnez un type de contenu et remplissez uniquement les champs nécessaires pour ce format.",
    how_2_title: "Personnalisez l'apparence",
    how_2_desc: "Ajustez la taille, la marge, les couleurs, la forme des points et les coins. Si vous le souhaitez, ajoutez le logo de votre marque au centre.",
    how_3_title: "Testez et téléchargez en PNG",
    how_3_desc: "Vérifiez l'aperçu, scannez avec votre téléphone pour valider et téléchargez le fichier PNG prêt à l'emploi numérique ou imprimé.",
    types_title: "Types de codes QR disponibles",
    types_desc: "Chaque type génère une structure compatible avec les lecteurs de codes QR courants sur les smartphones modernes.",
    type_url: "URL : dirige la personne vers un site Web, une page de destination, un formulaire, un menu, un profil social ou un fichier en ligne.",
    type_vcard: "vCard : enregistre les données de contact directement dans l'agenda du téléphone.",
    type_email: "E-mail : ouvre l'application de messagerie avec le destinataire, l'objet et le message déjà remplis.",
    type_wifi: "Wi-Fi : facilite la connexion à un réseau avec le SSID, le mot de passe et le type de chiffrement.",
    type_sms: "SMS : ouvre un message texte avec le téléphone et le contenu définis.",
    type_pix: "PIX : génère un code QR statique pour la réception de paiements et de virements.",
    type_text: "Texte : stocke des informations simples qui apparaissent directement lors du scan.",
    faq_title: "Foire Aux Questions",
    faq_1_q: "Puis-je ajouter mon logo au code QR ?",
    faq_1_a: "Oui. Utilisez l'option logo pour télécharger une image et la positionner au centre. Pour garder une lecture fiable, préférez des logos simples et testez le code QR avant d'imprimer.",
    faq_3_q: "Le code QR fonctionne-t-il toujours avec des couleurs et des formes différentes ?",
    faq_3_a: "Oui, à condition qu'il y ait suffisamment de contraste entre les points et le fond. Évitez les couleurs très claires sur les points et testez toujours la lecture sur votre téléphone.",
    faq_4_q: "Quel est le format de téléchargement ?",
    faq_4_a: "Les fichiers sont générés au format PNG de haute qualité, idéal pour une utilisation numérique et l'impression.",
    see1: "Copier Coller Emoji",
    see2: "Générateur de Code-Barres",
    see3: "Couleurs Aléatoires",
    see4: "Couleurs Dominantes de l'Image",
    email_placeholder: "email{'@'}exemple.com",
    optional: "(Optionnel)",
    pix_key_placeholder: "CPF, E-mail, Téléphone ou Clé Aléatoire",
    pix_desc_placeholder: "Description",
    pix_note: "Remarque : Le code QR PIX généré est statique. Vérifiez les données avant de les partager.",
    pix_empty: "Fournissez une clé PIX pour générer le code QR",
    unlink: "Dissocier les proportions",
    link: "Lier les proportions",
    scaled_preview: "Aperçu à l'échelle",
    pix: "PIX (Brésil)"
  },
  it: {
    title: "Generatore di Codice QR",
    page_title: "Generatore di Codice QR con Logo - Crea Codice QR Personalizzato Gratis",
    meta: "Generatore di codici QR con logo online e gratuito. Crea codici QR per PIX, Wi-Fi, vCard e URL. Personalizza colori, forme e scarica in alta risoluzione per la stampa.",
    og_title: "Generatore di Codice QR con Logo Online e Gratis",
    intro: "Crea codici QR personalizzati con logo in modo gratuito e privato. Il nostro strumento offre un'elaborazione istantanea nel browser, garantendo che i tuoi dati non lascino mai il tuo dispositivo. Ideale per materiali stampati e digitali.",
    data: "Dati del Codice QR",
    data_opt: "Tipo di dati",
    text: "Testo",
    text_placeholder: "Digita il testo che verrà salvato nel Codice QR",
    first_name: "Nome",
    last_name: "Cognome",
    address: "Indirizzo",
    street: "Via",
    city: "Città",
    state: "Stato",
    zip: "Codice Postale",
    country: "Paese",
    phone: "Telefono",
    cell: "Cellulare",
    tel_work: "Telefono ufficio",
    org: "Organizzazione",
    job: "Ruolo",
    subject: "Oggetto",
    msg: "Messaggio",
    ssid: "Nome della rete",
    cripto: "Crittografia",
    none: "Nessuna",
    hidden: "Rete Wi-Fi nascosta",
    pass: "Password",
    pix_key: "Chiave PIX",
    pix_name: "Nome del ricevente",
    pix_city: "Città",
    pix_amount: "Importo",
    colors_label: "Colori",
    customization: "Personalizzazione",
    width: "Larghezza",
    height: "Altezza",
    margin: "Margine",
    logo: "Logo",
    logo_help: "Aggiungi un'immagine al centro del codice QR e testa la lettura prima di stampare.",
    choose_logo: "Scegli logo",
    logo_margin: "Margine del logo",
    hide: "Nascondi i punti dietro il logo",
    remove: "Rimuovi",
    dot_style: "Stile dei punti",
    corner_style: "Stile degli angoli",
    square: "Quadrato",
    dots: "Punti",
    rounded: "Arrotondato",
    classy: "Elegante",
    dot_color: "Punti",
    corners_color: "Angoli",
    corners_dot_color: "Centro degli angoli",
    bck_clr: "Sfondo",
    preview: "Anteprima",
    scan_tip: "Suggerimento: usa un buon contrasto tra i punti e lo sfondo per mantenere il codice QR facile da scansionare.",
    download_aria: "Scarica il codice QR come immagine PNG",
    download_success: "Codice QR scaricato con successo.",
    features_title: "Funzionalità del generatore di codici QR",
    feature_1: "Creazione di codici QR per URL, contatti vCard, Wi-Fi, PIX, Email, SMS e testo",
    feature_2: "Personalizzazione di colori, forme dei punti, angoli, dimensioni e margine",
    feature_3: "Caricamento del logo centrale con controllo del margine e sfondo nascosto",
    feature_4: "Download di immagini PNG ad alta risoluzione, pronte per l'uso in stampe di qualsiasi dimensione",
    use_cases_title: "Dove usare codici QR personalizzati",
    use_cases_desc: "I codici QR personalizzati aiutano a connettere i materiali fisici alle esperienze digitali senza richiedere alla persona di digitare manualmente link o dati.",
    uc_1_title: "Marketing e materiali stampati",
    uc_1_desc: "Includi i codici QR su biglietti da visita, brochure, confezioni, banner e poster per indirizzare i visitatori a pagine, cataloghi, coupon e campagne.",
    uc_2_title: "Biglietto da visita digitale",
    uc_2_desc: "Usa il modello vCard per condividere nome, telefono, email, azienda, ruolo, indirizzo e sito web in una sola scansione.",
    uc_3_title: "Accesso rapido al Wi-Fi",
    uc_3_desc: "Crea codici QR per le reti Wi-Fi e consenti a clienti, ospiti o team di connettersi senza digitare la password.",
    uc_4_title: "Servizio e comunicazione",
    uc_4_desc: "Genera codici QR per SMS o email precompilati e riduci i passaggi in moduli, supporto, prenotazioni e richieste di preventivo.",
    how_to_title: "Come creare un codice QR",
    how_1_title: "Scegli il tipo di contenuto",
    how_1_desc: "Seleziona un tipo di contenuto e compila solo i campi necessari per quel formato.",
    how_2_title: "Personalizza l'aspetto",
    how_2_desc: "Regola dimensioni, margine, colori, forma dei punti e angoli. Se vuoi, aggiungi il logo del tuo marchio al centro.",
    how_3_title: "Testa e scarica in PNG",
    how_3_desc: "Controlla l'anteprima, scansiona con il tuo telefono per convalidare e scarica il file PNG pronto per l'uso digitale o cartaceo.",
    types_title: "Tipi di codici QR disponibili",
    types_desc: "Ogni tipo genera una struttura compatibile con i comuni lettori di codici QR sui moderni smartphone.",
    type_url: "URL: indirizza la persona a un sito web, landing page, modulo, menu, profilo social o file online.",
    type_vcard: "vCard: salva i dati di contatto direttamente nella rubrica del telefono.",
    type_email: "Email: apre l'app email con destinatario, oggetto e messaggio già compilati.",
    type_wifi: "Wi-Fi: facilita la connessione a una rete con SSID, password e tipo di crittografia.",
    type_sms: "SMS: apre un messaggio di testo con telefono e contenuto definiti.",
    type_pix: "PIX: genera un codice QR statico per la ricezione di pagamenti e bonifici.",
    type_text: "Testo: memorizza una semplice informazione che appare direttamente alla scansione.",
    faq_title: "Domande frequenti",
    faq_1_q: "Posso aggiungere il mio logo al codice QR?",
    faq_1_a: "Sì. Usa l'opzione logo per caricare un'immagine e posizionarla al centro. Per mantenere la lettura affidabile, preferisci loghi semplici e testa il codice QR prima di stampare.",
    faq_3_q: "Il codice QR funziona ancora con colori e forme diverse?",
    faq_3_a: "Sì, a condizione che ci sia abbastanza contrasto tra i punti e lo sfondo. Evita colori troppo chiari sui punti e testa sempre la lettura sul tuo telefono.",
    faq_4_q: "In quale formato viene effettuato il download?",
    faq_4_a: "I file vengono generati in formato PNG di alta qualità, ideale per l'uso digitale e la stampa.",
    see1: "Copia e Incolla Emoji",
    see2: "Generatore di Codice a Barre",
    see3: "Colori Casuali",
    see4: "Colori Dominanti dell'Immagine",
    email_placeholder: "email{'@'}esempio.com",
    optional: "(Opzionale)",
    pix_key_placeholder: "CPF, Email, Telefono o Chiave Casuale",
    pix_desc_placeholder: "Descrizione",
    pix_note: "Nota: Il QR Code PIX generato è statico. Verifica i dati prima di condividere.",
    pix_empty: "Fornisci una chiave PIX per generare il QR Code",
    unlink: "Scollega proporzioni",
    link: "Collega proporzioni",
    scaled_preview: "Anteprima in scala",
    pix: "PIX (Brasile)"
  },
  id: {
    title: "Pembuat Kode QR",
    page_title: "Pembuat Kode QR dengan Logo - Buat Kode QR Kustom Gratis",
    meta: "Pembuat kode QR dengan logo online dan gratis. Buat kode QR kustom untuk PIX, Wi-Fi, vCard dan URL. Sesuaikan warna, bentuk, unduh dalam resolusi tinggi untuk pencetakan.",
    og_title: "Pembuat Kode QR dengan Logo Online Gratis",
    intro: "Buat kode QR kustom dengan logo secara gratis dan pribadi. Alat kami menawarkan pemrosesan instan di browser, memastikan data Anda tidak pernah meninggalkan perangkat Anda. Ideal untuk materi cetak dan digital.",
    data: "Data Kode QR",
    data_opt: "Jenis data",
    text: "Teks",
    text_placeholder: "Ketik teks yang akan disimpan dalam Kode QR",
    first_name: "Nama Depan",
    last_name: "Nama Belakang",
    address: "Alamat",
    street: "Jalan",
    city: "Kota",
    state: "Provinsi",
    zip: "Kode Pos",
    country: "Negara",
    phone: "Telepon",
    cell: "Ponsel",
    tel_work: "Telepon Kantor",
    org: "Organisasi",
    job: "Jabatan",
    subject: "Subjek",
    msg: "Pesan",
    ssid: "Nama Jaringan",
    cripto: "Enkripsi",
    none: "Tidak ada",
    hidden: "Jaringan Wi-Fi tersembunyi",
    pass: "Kata Sandi",
    pix_key: "Kunci PIX",
    pix_name: "Nama Penerima",
    pix_city: "Kota",
    pix_amount: "Jumlah",
    colors_label: "Warna",
    customization: "Kustomisasi",
    width: "Lebar",
    height: "Tinggi",
    margin: "Margin",
    logo: "Logo",
    logo_help: "Tambahkan gambar ke tengah kode QR dan uji pembacaan sebelum mencetak.",
    choose_logo: "Pilih logo",
    logo_margin: "Margin logo",
    hide: "Sembunyikan titik di belakang logo",
    remove: "Hapus",
    dot_style: "Gaya titik",
    corner_style: "Gaya sudut",
    square: "Kotak",
    dots: "Titik",
    rounded: "Bulat",
    classy: "Elegan",
    dot_color: "Titik",
    corners_color: "Sudut",
    corners_dot_color: "Pusat sudut",
    bck_clr: "Latar Belakang",
    preview: "Pratinjau",
    scan_tip: "Tip: gunakan kontras yang baik antara titik dan latar belakang agar kode QR mudah dipindai.",
    download_aria: "Unduh kode QR sebagai gambar PNG",
    download_success: "Kode QR berhasil diunduh.",
    features_title: "Fitur pembuat kode QR",
    feature_1: "Pembuatan kode QR untuk URL, kontak vCard, Wi-Fi, PIX, Email, SMS, dan teks",
    feature_2: "Kustomisasi warna, bentuk titik, sudut, ukuran, dan margin",
    feature_3: "Unggah logo tengah dengan kontrol margin dan latar belakang tersembunyi",
    feature_4: "Unduh gambar PNG resolusi tinggi, siap digunakan untuk cetakan ukuran apa pun",
    use_cases_title: "Tempat menggunakan kode QR kustom",
    use_cases_desc: "Kode QR kustom membantu menghubungkan materi fisik ke pengalaman digital tanpa mengharuskan orang mengetik tautan atau data secara manual.",
    uc_1_title: "Pemasaran dan materi cetak",
    uc_1_desc: "Sertakan kode QR pada kartu, brosur, kemasan, spanduk, dan poster untuk mengarahkan pengunjung ke halaman, katalog, kupon, dan kampanye.",
    uc_2_title: "Kartu nama digital",
    uc_2_desc: "Gunakan model vCard untuk berbagi nama, telepon, email, perusahaan, jabatan, alamat, dan situs web dalam satu pemindaian.",
    uc_3_title: "Akses Wi-Fi cepat",
    uc_3_desc: "Buat kode QR untuk jaringan Wi-Fi dan izinkan pelanggan, tamu, atau tim terhubung tanpa mengetik kata sandi.",
    uc_4_title: "Layanan dan komunikasi",
    uc_4_desc: "Hasilkan kode QR untuk SMS atau email yang sudah diisi sebelumnya dan kurangi langkah dalam formulir, dukungan, reservasi, dan permintaan penawaran.",
    how_to_title: "Cara membuat kode QR",
    how_1_title: "Pilih jenis konten",
    how_1_desc: "Pilih jenis konten dan isi hanya bidang yang diperlukan untuk format tersebut.",
    how_2_title: "Sesuaikan tampilan",
    how_2_desc: "Sesuaikan ukuran, margin, warna, bentuk titik, dan sudut. Jika mau, tambahkan logo merek Anda ke tengah.",
    how_3_title: "Uji dan unduh dalam PNG",
    how_3_desc: "Periksa pratinjau, pindai dengan ponsel Anda untuk memvalidasi, dan unduh file PNG yang siap digunakan secara digital atau cetak.",
    types_title: "Jenis kode QR yang tersedia",
    types_desc: "Setiap jenis menghasilkan struktur yang kompatibel dengan pembaca kode QR umum pada ponsel cerdas modern.",
    type_url: "URL: mengarahkan orang ke situs web, halaman pendaratan, formulir, menu, profil sosial, atau file online.",
    type_vcard: "vCard: menyimpan data kontak langsung ke buku telepon.",
    type_email: "Email: membuka aplikasi email dengan penerima, subjek, dan pesan yang sudah diisi.",
    type_wifi: "Wi-Fi: memudahkan koneksi ke jaringan dengan SSID, kata sandi, dan jenis enkripsi.",
    type_sms: "SMS: membuka pesan teks dengan telepon dan konten yang ditentukan.",
    type_pix: "PIX: menghasilkan kode QR statis untuk menerima pembayaran dan transfer.",
    type_text: "Teks: menyimpan informasi sederhana yang muncul langsung saat pemindaian.",
    faq_title: "Pertanyaan yang Sering Diajukan",
    faq_1_q: "Bisakah saya menambahkan logo saya ke kode QR?",
    faq_1_a: "Ya. Gunakan opsi logo untuk mengunggah gambar dan memposisikannya di tengah. Agar pembacaan tetap andal, pilih logo yang sederhana dan uji kode QR sebelum mencetak.",
    faq_3_q: "Apakah kode QR masih berfungsi dengan warna dan bentuk yang berbeda?",
    faq_3_a: "Ya, selama ada kontras yang cukup antara titik dan latar belakang. Hindari warna yang sangat terang pada titik dan selalu uji pembacaan di ponsel Anda.",
    faq_4_q: "Dalam format apa unduhan dilakukan?",
    faq_4_a: "File dihasilkan dalam format PNG berkualitas tinggi, ideal untuk penggunaan digital dan cetak.",
    see1: "Pemilih Emoji",
    see2: "Pembuat Barcode",
    see3: "Warna Acak",
    see4: "Warna Dominan Gambar",
    email_placeholder: "email{'@'}contoh.com",
    optional: "(Opsional)",
    pix_key_placeholder: "CPF, Email, Telepon, atau Kunci Acak",
    pix_desc_placeholder: "Deskripsi",
    pix_note: "Catatan: Kode QR PIX yang dihasilkan bersifat statis. Periksa data sebelum membagikan.",
    pix_empty: "Masukkan kunci PIX untuk membuat Kode QR",
    unlink: "Pisahkan proporsi",
    link: "Tautkan proporsi",
    scaled_preview: "Pratinjau berskala",
    pix: "PIX (Brasil)"
  },
  de: {
    title: "QR-Code-Generator",
    page_title: "QR-Code-Generator mit Logo - Kostenlos benutzerdefinierten QR-Code erstellen",
    meta: "Kostenloser Online-QR-Code-Generator mit Logo. Erstellen Sie QR-Codes für PIX, WLAN, vCard und URL. Passen Sie Farben und Formen an und laden Sie sie in hoher Auflösung für den Druck herunter.",
    og_title: "Kostenloser Online-QR-Code-Generator mit Logo",
    intro: "Erstellen Sie kostenlos und privat benutzerdefinierte QR-Codes mit Logo. Unser Tool bietet eine sofortige Verarbeitung im Browser, sodass Ihre Daten Ihr Gerät nie verlassen. Ideal für Druck- und digitale Materialien.",
    data: "QR-Code-Daten",
    data_opt: "Datentyp",
    text: "Text",
    text_placeholder: "Geben Sie den Text ein, der im QR-Code gespeichert werden soll",
    first_name: "Vorname",
    last_name: "Nachname",
    address: "Adresse",
    street: "Straße",
    city: "Stadt",
    state: "Bundesland",
    zip: "Postleitzahl",
    country: "Land",
    phone: "Telefon",
    cell: "Handy",
    tel_work: "Telefon (Arbeit)",
    org: "Unternehmen",
    job: "Position",
    subject: "Betreff",
    msg: "Nachricht",
    ssid: "Netzwerkname",
    cripto: "Verschlüsselung",
    none: "Keine",
    hidden: "Verstecktes WLAN-Netzwerk",
    pass: "Passwort",
    pix_key: "PIX-Schlüssel",
    pix_name: "Name des Empfängers",
    pix_city: "Stadt",
    pix_amount: "Betrag",
    colors_label: "Farben",
    customization: "Anpassung",
    width: "Breite",
    height: "Höhe",
    margin: "Rand",
    logo: "Logo",
    logo_help: "Fügen Sie in der Mitte des QR-Codes ein Bild hinzu und testen Sie das Scannen vor dem Drucken.",
    choose_logo: "Logo auswählen",
    logo_margin: "Logo-Rand",
    hide: "Punkte hinter dem Logo ausblenden",
    remove: "Entfernen",
    dot_style: "Punktstil",
    corner_style: "Eckstil",
    square: "Quadrat",
    dots: "Punkte",
    rounded: "Abgerundet",
    classy: "Elegant",
    dot_color: "Punkte",
    corners_color: "Ecken",
    corners_dot_color: "Mitte der Ecken",
    bck_clr: "Hintergrund",
    preview: "Vorschau",
    scan_tip: "Tipp: Verwenden Sie einen guten Kontrast zwischen Punkten und Hintergrund, damit der QR-Code leicht zu scannen ist.",
    download_aria: "QR-Code als PNG-Bild herunterladen",
    download_success: "QR-Code erfolgreich heruntergeladen.",
    features_title: "Funktionen des QR-Code-Generators",
    feature_1: "QR-Code-Erstellung für URL, vCard-Kontakte, WLAN, PIX, E-Mail, SMS und Text",
    feature_2: "Anpassung von Farben, Punktformen, Ecken, Größe und Rand",
    feature_3: "Zentraler Logo-Upload mit Randsteuerung und verborgenem Hintergrund",
    feature_4: "Hochauflösender PNG-Bild-Download, bereit für den Einsatz in Drucken jeder Größe",
    use_cases_title: "Wo benutzerdefinierte QR-Codes verwendet werden",
    use_cases_desc: "Benutzerdefinierte QR-Codes helfen dabei, physische Materialien mit digitalen Erlebnissen zu verbinden, ohne dass die Person Links oder Daten manuell eingeben muss.",
    uc_1_title: "Marketing und gedruckte Materialien",
    uc_1_desc: "Fügen Sie QR-Codes auf Karten, Broschüren, Verpackungen, Bannern und Postern hinzu, um Besucher auf Seiten, Kataloge, Gutscheine und Kampagnen zu leiten.",
    uc_2_title: "Digitale Visitenkarte",
    uc_2_desc: "Verwenden Sie die vCard-Vorlage, um Name, Telefon, E-Mail, Unternehmen, Position, Adresse und Website in einem einzigen Scan zu teilen.",
    uc_3_title: "Schneller WLAN-Zugang",
    uc_3_desc: "Erstellen Sie QR-Codes für WLAN-Netzwerke und ermöglichen Sie Kunden, Gästen oder Teams, sich ohne Eingabe des Passworts zu verbinden.",
    uc_4_title: "Service und Kommunikation",
    uc_4_desc: "Generieren Sie QR-Codes für vorausgefüllte SMS oder E-Mails und reduzieren Sie Schritte bei Formularen, Support, Reservierungen und Angebotsanfragen.",
    how_to_title: "So erstellen Sie einen QR-Code",
    how_1_title: "Wählen Sie den Inhaltstyp",
    how_1_desc: "Wählen Sie einen Inhaltstyp aus und füllen Sie nur die für dieses Format erforderlichen Felder aus.",
    how_2_title: "Passen Sie das Erscheinungsbild an",
    how_2_desc: "Passen Sie Größe, Rand, Farben, Punktform und Ecken an. Fügen Sie auf Wunsch Ihr Markenlogo in die Mitte ein.",
    how_3_title: "Testen und als PNG herunterladen",
    how_3_desc: "Überprüfen Sie die Vorschau, scannen Sie zur Validierung mit Ihrem Telefon und laden Sie die PNG-Datei herunter, bereit zur digitalen oder gedruckten Verwendung.",
    types_title: "Verfügbare QR-Code-Typen",
    types_desc: "Jeder Typ generiert eine Struktur, die mit gängigen QR-Code-Lesern auf modernen Smartphones kompatibel ist.",
    type_url: "URL: leitet die Person auf eine Website, Landingpage, ein Formular, ein Menü, ein soziales Profil oder eine Online-Datei weiter.",
    type_vcard: "vCard: speichert Kontaktdaten direkt im Telefonbuch.",
    type_email: "E-Mail: öffnet die E-Mail-App mit bereits ausgefülltem Empfänger, Betreff und Nachricht.",
    type_wifi: "WLAN: erleichtert die Verbindung mit einem Netzwerk mit SSID, Passwort und Verschlüsselungstyp.",
    type_sms: "SMS: öffnet eine Textnachricht mit definierter Telefonnummer und Inhalt.",
    type_pix: "PIX: generiert einen statischen QR-Code zum Empfangen von Zahlungen und Überweisungen.",
    type_text: "Text: speichert einfache Informationen, die direkt beim Scannen angezeigt werden.",
    faq_title: "Häufig gestellte Fragen",
    faq_1_q: "Kann ich mein Logo zum QR-Code hinzufügen?",
    faq_1_a: "Ja. Verwenden Sie die Logo-Option, um ein Bild hochzuladen und in der Mitte zu platzieren. Um eine zuverlässige Lesbarkeit zu gewährleisten, bevorzugen Sie einfache Logos und testen Sie den QR-Code vor dem Drucken.",
    faq_3_q: "Funktioniert der QR-Code noch mit verschiedenen Farben und Formen?",
    faq_3_a: "Ja, solange ein ausreichender Kontrast zwischen den Punkten und Hintergrund besteht. Vermeiden Sie sehr helle Farben bei den Punkten und testen Sie das Scannen immer auf Ihrem Telefon.",
    faq_4_q: "In welchem Format erfolgt der Download?",
    faq_4_a: "Die Dateien werden im hochwertigen PNG-Format generiert, ideal für die digitale Verwendung und den Druck.",
    see1: "Emoji Kopieren und Einfügen",
    see2: "Barcode-Generator",
    see3: "Zufällige Farben",
    see4: "Dominante Farben des Bildes",
    email_placeholder: "email{'@'}beispiel.com",
    optional: "(Optional)",
    pix_key_placeholder: "CPF, E-Mail, Telefon oder Zufälliger Schlüssel",
    pix_desc_placeholder: "Beschreibung",
    pix_note: "Hinweis: Der generierte PIX QR-Code ist statisch. Überprüfen Sie die Daten vor dem Teilen.",
    pix_empty: "Geben Sie einen PIX-Schlüssel ein, um den QR-Code zu generieren",
    unlink: "Proportionen aufheben",
    link: "Proportionen verknüpfen",
    scaled_preview: "Skalierte Vorschau",
    pix: "PIX (Brasilien)"
  },
  nl: {
    title: "QR Code Generator",
    page_title: "QR Code Generator met Logo - Maak Gratis Aangepaste QR Code",
    meta: "Gratis online QR-code generator met logo. Maak QR-codes voor PIX, Wi-Fi, vCard en URL. Pas kleuren en vormen aan en download in hoge resolutie voor afdrukken.",
    og_title: "Gratis Online QR Code Generator met Logo",
    intro: "Maak gratis en privé aangepaste QR-codes met logo. Onze tool biedt directe verwerking in de browser, zodat uw gegevens uw apparaat nooit verlaten. Ideaal voor gedrukt en digitaal materiaal.",
    data: "QR Code Gegevens",
    data_opt: "Datatype",
    text: "Tekst",
    text_placeholder: "Typ de tekst die in de QR-code wordt opgeslagen",
    first_name: "Voornaam",
    last_name: "Achternaam",
    address: "Adres",
    street: "Straat",
    city: "Stad",
    state: "Provincie",
    zip: "Postcode",
    country: "Land",
    phone: "Telefoonnummer",
    cell: "Mobiel",
    tel_work: "Werktelefoon",
    org: "Bedrijf",
    job: "Functie",
    subject: "Onderwerp",
    msg: "Bericht",
    ssid: "Netwerknaam",
    cripto: "Versleuteling",
    none: "Geen",
    hidden: "Verborgen wifi-netwerk",
    pass: "Wachtwoord",
    pix_key: "PIX-sleutel",
    pix_name: "Naam ontvanger",
    pix_city: "Stad",
    pix_amount: "Bedrag",
    colors_label: "Kleuren",
    customization: "Aanpassing",
    width: "Breedte",
    height: "Hoogte",
    margin: "Marge",
    logo: "Logo",
    logo_help: "Voeg een afbeelding toe in het midden van de QR-code en test het scannen voor het afdrukken.",
    choose_logo: "Kies logo",
    logo_margin: "Logomarge",
    hide: "Verberg stippen achter logo",
    remove: "Verwijderen",
    dot_style: "Stippelstijl",
    corner_style: "Hoekstijl",
    square: "Vierkant",
    dots: "Stippen",
    rounded: "Afgerond",
    classy: "Elegant",
    dot_color: "Stippen",
    corners_color: "Hoeken",
    corners_dot_color: "Midden van hoeken",
    bck_clr: "Achtergrond",
    preview: "Voorbeeld",
    scan_tip: "Tip: gebruik een goed contrast tussen stippen en achtergrond om de QR-code gemakkelijk te kunnen scannen.",
    download_aria: "Download QR-code als PNG-afbeelding",
    download_success: "QR-code succesvol gedownload.",
    features_title: "Functies van QR Code Generator",
    feature_1: "QR-code maken voor URL, vCard-contacten, wifi, PIX, e-mail, sms en tekst",
    feature_2: "Aanpassing van kleuren, stippelvormen, hoeken, grootte en marge",
    feature_3: "Centrale logo-upload met margecontrole en verborgen achtergrond",
    feature_4: "PNG-afbeelding downloaden in hoge resolutie, klaar voor gebruik in afdrukken van elk formaat",
    use_cases_title: "Waar aangepaste QR-codes te gebruiken",
    use_cases_desc: "Aangepaste QR-codes helpen fysieke materialen te verbinden met digitale ervaringen zonder dat de persoon handmatig links of gegevens hoeft in te typen.",
    uc_1_title: "Marketing en gedrukt materiaal",
    uc_1_desc: "Voeg QR-codes toe aan kaarten, folders, verpakkingen, banners en posters om bezoekers naar pagina's, catalogi, kortingsbonnen en campagnes te leiden.",
    uc_2_title: "Digitaal visitekaartje",
    uc_2_desc: "Gebruik het vCard-sjabloon om naam, telefoon, e-mail, bedrijf, functie, adres en website in één scan te delen.",
    uc_3_title: "Snelle wifi-toegang",
    uc_3_desc: "Maak QR-codes voor wifi-netwerken en laat klanten, gasten of teams verbinding maken zonder het wachtwoord in te typen.",
    uc_4_title: "Service en communicatie",
    uc_4_desc: "Genereer QR-codes voor vooraf ingevulde sms-berichten of e-mails en verminder stappen in formulieren, ondersteuning, reserveringen en offerteaanvragen.",
    how_to_title: "Hoe een QR-code te maken",
    how_1_title: "Kies inhoudstype",
    how_1_desc: "Selecteer een inhoudstype en vul alleen de benodigde velden voor dat formaat in.",
    how_2_title: "Pas het uiterlijk aan",
    how_2_desc: "Pas grootte, marge, kleuren, stippelvorm en hoeken aan. Voeg desgewenst uw merklogo toe in het midden.",
    how_3_title: "Test en download in PNG",
    how_3_desc: "Controleer het voorbeeld, scan met uw telefoon om te valideren en download het PNG-bestand klaar voor digitaal of gedrukt gebruik.",
    types_title: "Beschikbare QR-codetypes",
    types_desc: "Elk type genereert een structuur die compatibel is met veelvoorkomende QR-codelezers op moderne smartphones.",
    type_url: "URL: leidt de persoon naar een website, bestemmingspagina, formulier, menu, sociaal profiel of online bestand.",
    type_vcard: "vCard: slaat contactgegevens direct op in het adresboek van de telefoon.",
    type_email: "E-mail: opent de e-mailapp met ontvanger, onderwerp en bericht al ingevuld.",
    type_wifi: "Wifi: vergemakkelijkt de verbinding met een netwerk met SSID, wachtwoord en versleutelingstype.",
    type_sms: "Sms: opent een sms-bericht met gedefinieerde telefoon en inhoud.",
    type_pix: "PIX: genereert een statische QR-code voor het ontvangen van betalingen en overschrijvingen.",
    type_text: "Tekst: slaat eenvoudige informatie op die direct verschijnt bij het scannen.",
    faq_title: "Veelgestelde Vragen",
    faq_1_q: "Kan ik mijn logo toevoegen aan de QR-code?",
    faq_1_a: "Ja. Gebruik de logo-optie om een afbeelding te uploaden en in het midden te plaatsen. Kies voor betrouwbaar scannen bij voorkeur voor eenvoudige logo's en test de QR-code voor het afdrukken.",
    faq_3_q: "Werkt de QR-code nog steeds met verschillende kleuren en vormen?",
    faq_3_a: "Ja, zolang er voldoende contrast is tussen de stippen en de achtergrond. Vermijd zeer lichte kleuren bij de stippen en test het scannen altijd op uw telefoon.",
    faq_4_q: "In welk formaat wordt de download uitgevoerd?",
    faq_4_a: "De bestanden worden gegenereerd in hoogwaardig PNG-formaat, ideaal voor digitaal gebruik en afdrukken.",
    see1: "Emoji Kopiëren en Plakken",
    see2: "Barcode Generator",
    see3: "Willekeurige Kleuren",
    see4: "Dominante Kleuren van de Afbeelding",
    email_placeholder: "email{'@'}voorbeeld.com",
    optional: "(Optioneel)",
    pix_key_placeholder: "CPF, E-mail, Telefoon of Willekeurige Sleutel",
    pix_desc_placeholder: "Beschrijving",
    pix_note: "Let op: De gegenereerde PIX QR-code is statisch. Controleer de gegevens voor het delen.",
    pix_empty: "Geef een PIX-sleutel op om de QR-code te genereren",
    unlink: "Verhoudingen ontkoppelen",
    link: "Verhoudingen koppelen",
    scaled_preview: "Geschaalde weergave",
    pix: "PIX (Brazilië)"
  }
}
</i18n>
