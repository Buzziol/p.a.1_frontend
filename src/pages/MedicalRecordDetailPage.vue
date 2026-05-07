<template>
  <div class="space-y-6">
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="record">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-zinc-900">Prontuário #{{ record.id }}</h2>
          <p class="text-sm text-zinc-500 mt-1">
            Paciente: <span class="font-medium text-zinc-700">{{ record.patient_name || record.patient_id }}</span>
            <span v-if="record.created_at" class="ml-3">Criado em {{ formatDate(record.created_at) }}</span>
          </p>
        </div>
        <router-link :to="`/medical-records/${record.id}/ai`">
          <BaseButton>Análise IA</BaseButton>
        </router-link>
      </div>

      <!-- Campos clínicos -->
      <div class="grid md:grid-cols-2 gap-4">
        <RecordSection v-if="record.anamnesis" title="Anamnese" :content="record.anamnesis" />
        <RecordSection v-if="record.physical_exam" title="Exame Físico" :content="record.physical_exam" />
        <RecordSection v-if="record.diagnostic_hypothesis" title="Hipótese Diagnóstica" :content="record.diagnostic_hypothesis" />
        <RecordSection v-if="record.diagnosis" title="Diagnóstico" :content="record.diagnosis" />
        <RecordSection v-if="record.conduct" title="Conduta" :content="record.conduct" />
        <RecordSection v-if="record.prescriptions" title="Prescrições" :content="record.prescriptions" />
        <RecordSection v-if="record.exams_requested" title="Exames Solicitados" :content="record.exams_requested" />
        <RecordSection v-if="record.evolution" title="Evolução" :content="record.evolution" />
      </div>

      <!-- Sem dados clínicos -->
      <BaseCard v-if="!hasAnyField">
        <p class="text-zinc-500 text-sm">Nenhum campo clínico preenchido neste prontuário.</p>
      </BaseCard>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { medicalRecordService } from '../services/medicalRecordService'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'

// Inline RecordSection component
const RecordSection = {
  props: { title: String, content: String },
  setup(props) {
    return () => h(BaseCard, null, {
      default: () => [
        h('h3', { class: 'text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2' }, props.title),
        h('p', { class: 'text-zinc-800 whitespace-pre-wrap text-sm leading-relaxed' }, props.content),
      ],
    })
  },
}

const route = useRoute()
const loading = ref(true)
const error = ref('')
const record = ref(null)

const clinicalFields = ['anamnesis', 'physical_exam', 'diagnostic_hypothesis', 'diagnosis', 'conduct', 'prescriptions', 'exams_requested', 'evolution']
const hasAnyField = computed(() => record.value && clinicalFields.some((f) => record.value[f]))

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  try {
    record.value = await medicalRecordService.getById(route.params.id)
  } catch {
    error.value = 'Erro ao carregar prontuário'
  } finally {
    loading.value = false
  }
})
</script>
