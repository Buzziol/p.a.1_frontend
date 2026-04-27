<template>
  <div
    class="relative"
    @dragenter.prevent="drag = true"
    @dragover.prevent
    @dragleave.prevent="drag = false"
    @drop.prevent="onDrop"
  >
    <input ref="input" type="file" accept="image/*" class="sr-only" @change="onChange" />
    <div
      class="rounded-3xl border-2 border-dashed transition p-10 md:p-14 text-center"
      :class="drag ? 'border-brand-600 bg-brand-50/40 dark:bg-white/5' : 'border-zinc-300/60 dark:border-white/10'"
    >
      <div class="mx-auto h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <svg viewBox='0 0 24 24' class="h-7 w-7 text-zinc-600"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v8h3l-4 5l-4-5h3V4a1 1 0 0 1 1-1Z"/><path fill="currentColor" d="M5 20h14v-2H5v2Z"/></svg>
      </div>
      <div class="mt-6 space-y-2">
        <div class="text-lg">Selecione ou arraste uma imagem</div>
        <div class="text-xs text-zinc-500">PNG, JPG ou WEBP (máx. 10MB)</div>
      </div>
      <div class="mt-8 flex items-center justify-center gap-3">
        <button :disabled="disabled" @click="$refs.input.click()" class="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 disabled:opacity-50">Escolher arquivo</button>
        <button :disabled="!localFile || disabled" @click="$emit('analyze')" class="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 disabled:opacity-50">Analisar</button>
      </div>
      <div v-if="filename" class="mt-6 text-sm text-zinc-500 truncate">Selecionado: {{ filename }}</div>
      <div v-if="preview" class="mt-8">
        <img :src="preview" alt="" class="mx-auto rounded-2xl max-h-72 object-cover border border-zinc-200 dark:border-zinc-800" @error="hidePreview"/>
      </div>
      <div v-else-if="localFile" class="mt-8 text-xs text-zinc-400">Pré-visualização indisponível para este formato.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ disabled: Boolean, preview: String, filename: String })
const emit = defineEmits(['select','analyze'])

const drag = ref(false)
const localFile = ref(null)
const showPreview = ref(true)

watch(() => props.preview, () => { showPreview.value = true })

function onDrop(e) {
  drag.value = false
  const f = e.dataTransfer.files?.[0]
  if (f) selectFile(f)
}

function onChange(e) {
  const f = e.target.files?.[0]
  if (f) selectFile(f)
}

function selectFile(f) {
  localFile.value = f
  emit('select', f)
}

function hidePreview() {
  showPreview.value = false
}
</script>
