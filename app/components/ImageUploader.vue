<template>
  <div id="file">
    <div class="flex items-center justify-center w-full" v-show="props.show">
      <label for="dropzone">
        <div class="flex flex-col items-center justify-center">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>file-upload</title>
            <path
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13.5,16V19H10.5V16H8L12,12L16,16H13.5M13,9V3.5L18.5,9H13Z" />
          </svg>
          <p class="mb-2 text-base-content/60">
            <span class="font-semibold">{{ t('clk') }}</span> {{ t('drg') }}
          </p>
        </div>
        <input id="dropzone" type="file" @change.prevent="onChange" :multiple="multiple" accept="image/*"
          class="hidden" />
      </label>
    </div>
    <div id="drag-area" v-show="dropActive">
      <Icon name="heroicons:photo-20-solid" class="w-20 h-20 text-white opacity-50 animate-bounce" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ multiple?: boolean; show?: boolean }>()
const emit = defineEmits<{ (e: 'onFile', value: File | File[]): void }>()

const dropActive = ref(false)

onMounted(() => {
  if (window.FormData) watchDragAndDrop(true)
})

onBeforeUnmount(() => {
  watchDragAndDrop(false)
})

function onChange(e: Event) {
  const input = e.target as HTMLInputElement
  uploadFiles(input.files)
}

function uploadFiles(files: FileList | null) {
  if (!files) return

  const allFiles = props.multiple ? [...files] : [files[0]]
  const imageFiles = allFiles.filter(f => f.type.startsWith('image/'))

  if (imageFiles.length > 0) {
    emit('onFile', props.multiple ? imageFiles : imageFiles[0])
    if (!props.multiple) watchDragAndDrop(false)
  }
}

function watchDragAndDrop(add: boolean) {
  const method = add ? 'addEventListener' : 'removeEventListener'
  document[method]('dragenter', onDragenter as EventListener, false)
  document[method]('dragleave', onDragleave as EventListener, false)
  document[method]('dragover', onDragover as EventListener, false)
  document[method]('drop', onDrop as EventListener, false)
}

function onDragenter(e: DragEvent) {
  e.preventDefault()
  if (dropActive.value || !e.dataTransfer) return
  const dt = e.dataTransfer
  if (
    (dt.files && dt.files.length) ||
    !dt.types ||
    dt.types.includes?.('Files') ||
    (dt.types as any).contains?.('Files')
  ) {
    dropActive.value = true
  }
}

function onDragleave(e: DragEvent) {
  e.preventDefault()
  if (!dropActive.value) return
  if (
    (e.target as HTMLElement).nodeName === 'HTML' ||
    e.clientX <= 0 ||
    e.clientY <= 0 ||
    e.clientX >= window.innerWidth ||
    e.clientY >= window.innerHeight
  ) {
    dropActive.value = false
  }
}

function onDragover(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dropActive.value = false
  uploadFiles(e.dataTransfer?.files ?? null)
}

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="yaml">
{
  en: { clk: "Click to upload", drg: "or drag and drop" },
  pt: { clk: "Clique para fazer o upload", drg: "ou arraste e solte" },
  es: { clk: "Haz clic para subir", drg: "o arrastra y suelta" },
  fr: { clk: "Cliquez pour télécharger", drg: "ou glissez-déposez" },
  it: { clk: "Fai clic per caricare", drg: "o trascina e rilascia" },
  id: { clk: "Klik untuk mengunggah", drg: "atau seret dan lepas" }
}
</i18n>

<style lang="postcss" scoped>
#drag-area {
  @apply flex items-center justify-center fixed left-0 top-0 w-full h-full overflow-hidden z-50 bg-black/50;
}

#file {
  @apply max-w-2xl w-full;
}

label {
  @apply flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer
    border-base-content/20 bg-base-200/40 hover:bg-base-200/70 hover:border-primary/40 transition-colors;
}

svg {
  @apply w-12 h-12 mb-3 text-base-content/40;
}
</style>
