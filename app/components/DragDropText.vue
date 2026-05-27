<template>
  <div v-show="dropActive" class="flex items-center justify-center fixed inset-0 w-full h-full overflow-hidden z-[9999] bg-black/70 backdrop-blur-sm transition-all duration-300">
    <div class="flex flex-col items-center gap-4">
      <Icon name="heroicons:document-arrow-up-20-solid" class="w-16 h-16 text-white opacity-50 animate-bounce" />
      <span class="text-white text-lg font-bold">{{ t('drop_msg') }}</span>
    </div>
  </div>
</template>
  
<script setup>
const dropActive = ref(false)
const emit = defineEmits(['onDrop'])
const { t } = useI18n({ useScope: 'local' })

onMounted(() => {
  if (process.client && window.FormData) {
    watchDragAndDrop(true);
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    watchDragAndDrop(false);
  }
})

function watchDragAndDrop(addEvt) {
  const action = addEvt ? document.addEventListener : document.removeEventListener;
  action('dragenter', onDragenter, false);
  action('dragleave', onDragleave, false);
  action('dragover', onDragover, false);
  action('drop', onDrop, false);
}

function onDragenter(e) {
  e.preventDefault()
  if (dropActive.value) return;
  
  const dt = e.dataTransfer
  if (dt && (dt.files?.length || dt.types?.includes('Files'))) {
    dropActive.value = true;
  }
}

function onDragleave(e) {
  e.preventDefault()
  if (!dropActive.value) return;
  
  if (e.target.nodeName === 'HTML' || (!e.fromElement && (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight))) {
    dropActive.value = false;
  }
}

function onDragover(e) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
  }
}

function onDrop(e) {
  e.preventDefault()
  const reader = new FileReader();
  reader.onload = event => {
    emit("onDrop", event.target.result);
    dropActive.value = false;
  };
  if (e.dataTransfer.files[0]) {
    reader.readAsText(e.dataTransfer.files[0], "UTF-8");
  } else {
    dropActive.value = false;
  }
}
</script>

<i18n lang="yaml">
{
  en: { drop_msg: "Drop the file here" },
  pt: { drop_msg: "Solte o arquivo aqui" },
  es: { drop_msg: "Suelta el archivo aquí" },
  fr: { drop_msg: "Déposez le fichier ici" },
  it: { drop_msg: "Rilascia il file qui" },
  id: { drop_msg: "Lepas file di sini" },
  de: { drop_msg: "Datei hier ablegen" },
  nl: { drop_msg: "Sleep het bestand hierheen" },
  ru: { drop_msg: "Перетащите файл сюда" }
}
</i18n>

<style scoped>
</style>
