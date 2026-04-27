<template>
  <div class="space-y-8">
    <div class="rounded-3xl bg-white dark:bg-zinc-900 shadow-soft border border-zinc-200/70 dark:border-white/10 p-10 md:p-14 text-center">
      <div class="mx-auto h-16 w-16 rounded-full flex items-center justify-center" :class="tone.bg">
        <svg v-if="tone.kind==='low'" viewBox="0 0 24 24" class="h-8 w-8" :class="tone.fg"><path fill="currentColor" d="M9.55 17L5 12.45l1.4-1.4l3.15 3.15L17.6 6.65L19 8.05z"/></svg>
        <svg v-else-if="tone.kind==='mid'" viewBox="0 0 24 24" class="h-8 w-8" :class="tone.fg"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m1 15h-2v-2h2Zm0-4h-2V7h2Z"/></svg>
        <svg v-else viewBox="0 0 24 24" class="h-8 w-8" :class="tone.fg"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      </div>
      
      <div class="mt-6">
        <div class="text-5xl md:text-6xl font-semibold tracking-tight">{{ formattedProbability }}</div>
        <div class="text-sm text-zinc-500 mt-1">Probabilidade de Malignidade</div>
      </div>

      <div class="mt-4">
        <div class="text-2xl font-bold uppercase tracking-wide" :class="tone.text">{{ value.diagnosis === 'malignant' ? 'Maligno' : 'Benigno' }}</div>
        <div class="text-sm font-medium px-3 py-1 rounded-full inline-block mt-2" :class="tone.bg + ' ' + tone.fg">
          Confiança: {{ value.confidence_level === 'high' ? 'Alta' : value.confidence_level === 'medium' ? 'Média' : 'Baixa' }}
        </div>
      </div>

      <div class="mt-8 h-px bg-zinc-200 dark:bg-white/10"></div>
      
      <div class="mt-8 text-left bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-white/5">
        <h3 class="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Recomendação Médica
        </h3>
        <p class="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{{ value.recommendation }}</p>
      </div>

      <p class="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
        * Este resultado é gerado por IA e não substitui o diagnóstico médico profissional.
      </p>

      <div class="mt-10 flex items-center justify-center gap-3">
        <button @click="onBack" class="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Novo exame</button>
        <a v-if="filename" class="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity" :download="filename" :href="preview">Baixar imagem</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ value: Object, filename: String, onBack: Function })
const preview = computed(() => '') // Placeholder for image download logic if needed

const formattedProbability = computed(() => {
  if (!props.value || typeof props.value.probability !== 'number') return '0%'
  return `${(props.value.probability * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
})

const tone = computed(() => {
  const diagnosis = props.value?.diagnosis
  const confidence = props.value?.confidence_level

  if (diagnosis === 'malignant') {
    return { kind: 'high', label: 'Alto Risco', text: 'text-red-600', bg: 'bg-red-50 dark:bg-red-500/10', fg: 'text-red-600 dark:text-red-400' }
  }
  
  if (diagnosis === 'benign') {
    if (confidence === 'low') {
       return { kind: 'mid', label: 'Inconclusivo', text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', fg: 'text-amber-600 dark:text-amber-400' }
    }
    return { kind: 'low', label: 'Baixo Risco', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', fg: 'text-emerald-600 dark:text-emerald-400' }
  }

  return { kind: 'mid', label: 'Indefinido', text: 'text-zinc-600', bg: 'bg-zinc-50 dark:bg-zinc-500/10', fg: 'text-zinc-600 dark:text-zinc-400' }
})

const onBack = () => props.onBack && props.onBack()
</script>
