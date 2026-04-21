<template>
  <div class="relative group">
    <div 
      id="editor" 
      class="border-2 border-base-content/10 rounded-2xl overflow-hidden focus-within:border-primary/50 transition-all duration-300 shadow-sm"
      style="font-size: 1.1em"
    />
    <DragDropText @onDrop="onDrop" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{ 
  lang: string, 
  placeholder: string 
}>()
const emit = defineEmits(['onChange', 'onLoad'])

let editor: any = null

onMounted(() => {
  useScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.43.3/ace.js', {
    trigger: 'client'
  }).onLoaded(() => {
    const ace = (window as any).ace
    if (!ace) return

    editor = ace.edit('editor', { 
      maxLines: 20, 
      minLines: 10, 
      placeholder: props.placeholder,
      fontSize: '14px',
      showPrintMargin: false,
      useSoftTabs: true,
      tabSize: 2
    })

    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.43.3')
    editor.setTheme('ace/theme/cobalt')
    editor.session.setMode(`ace/mode/${props.lang}`)
    
    // Autofocus
    editor.focus()
    
    // Listen for changes
    editor.getSession().on('change', () => { 
      emit('onChange') 
    })

    emit('onLoad')
  })
})

function onDrop(txt: string) {
  if (editor) {
    editor.setValue(txt)
  }
}

const getValue = (): string => editor?.getValue() ?? ''
const setValue = (text: string): void => editor?.setValue(text)
const setReadOnly = (value: boolean): void => editor?.setReadOnly(value)
const setMode = (lang: string): void => editor?.session.setMode(`ace/mode/${lang}`)

defineExpose({ getValue, setValue, setReadOnly, setMode })
</script>

<style scoped>
/* Custom scrolls for Ace if needed */
:deep(.ace_scrollbar) {
  background-color: transparent;
}
</style>
