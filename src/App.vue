<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white/70 dark:bg-black/40 backdrop-blur sticky top-0 z-20 border-b border-zinc-200/70 dark:border-white/10">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft"></div>
          <span class="text-lg font-semibold tracking-tight">AegisDerm</span>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <section class="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div class="text-center space-y-3 mb-10 md:mb-12">
          <h1 class="text-2xl md:text-4xl font-semibold tracking-tight">Análise de Lesões Cutâneas</h1>
          <p class="text-zinc-500">Faça upload de uma imagem para análise por IA</p>
        </div>

        <div v-if="step==='upload'">
          <div class="rounded-3xl border-2 border-dashed border-zinc-300/70 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-soft p-8 md:p-14">
            <UploadZone :disabled="isLoading" :preview="previewUrl" :filename="filename" @select="onSelect" @analyze="onAnalyze" />
          </div>
        </div>

        <div v-else>
          <ResultView :value="result" :filename="filename" :onBack="reset" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UploadZone from './components/UploadZone.vue'
import ResultView from './components/ResultView.vue'
import api from './services/api'

const step = ref('upload')
const file = ref(null)
const filename = ref('')
const previewUrl = ref('')
const isLoading = ref(false)
const result = ref(0)

function onSelect(f) {
  file.value = f
  filename.value = f.name
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  const supported = /image\/(png|jpe?g|webp)/i.test(f.type)
  previewUrl.value = supported ? URL.createObjectURL(f) : ''
}

async function onAnalyze() {
  if (!file.value) return
  isLoading.value = true
  try {
    const response = await api.predict(file.value)
    result.value = response
    step.value = 'result'
  } catch (error) {
    console.error(error)
    alert(error.message || 'Erro ao processar imagem')
  } finally {
    isLoading.value = false
  }
}

function reset() {
  step.value = 'upload'
  result.value = 0
  file.value = null
  filename.value = ''
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}
</script>
