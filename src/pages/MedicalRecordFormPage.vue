<template>
  <BaseCard title="Novo Prontuário">
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid md:grid-cols-2 gap-4">
        <BaseSelect v-model="form.patient_id" label="Paciente" required>
          <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
        </BaseSelect>
        <BaseInput v-model="form.appointment_id" label="ID da Consulta" required type="number" placeholder="Nº da consulta" />
      </div>
      <BaseTextarea v-model="form.anamnesis" label="Anamnese" :rows="3" />
      <BaseTextarea v-model="form.physical_exam" label="Exame físico" :rows="3" />
      <BaseTextarea v-model="form.diagnostic_hypothesis" label="Hipótese diagnóstica" :rows="2" />
      <BaseTextarea v-model="form.diagnosis" label="Diagnóstico" :rows="2" />
      <BaseTextarea v-model="form.conduct" label="Conduta" :rows="2" />
      <BaseTextarea v-model="form.prescriptions" label="Prescrições" :rows="2" />
      <BaseTextarea v-model="form.exams_requested" label="Exames solicitados" :rows="2" />
      <BaseTextarea v-model="form.evolution" label="Evolução" :rows="2" />
      <div class="flex gap-3 pt-2">
        <BaseButton type="submit" :disabled="loading">{{ loading ? 'Salvando...' : 'Salvar prontuário' }}</BaseButton>
        <BaseButton variant="secondary" type="button" @click="$router.push('/dashboard')">Cancelar</BaseButton>
      </div>
    </form>
    <div v-if="createdId" class="mt-4 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700">
      Prontuário criado! <router-link :to="`/medical-records/${createdId}`" class="underline font-medium">Abrir prontuário</router-link>
    </div>
    <ErrorState v-if="error" :message="error" />
  </BaseCard>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { medicalRecordService } from '../services/medicalRecordService'
import { patientService } from '../services/patientService'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseTextarea from '../components/BaseTextarea.vue'
import BaseButton from '../components/BaseButton.vue'
import ErrorState from '../components/ErrorState.vue'

const fields = ['patient_id', 'appointment_id', 'anamnesis', 'physical_exam', 'diagnostic_hypothesis', 'diagnosis', 'conduct', 'prescriptions', 'exams_requested', 'evolution']
const form = reactive(Object.fromEntries(fields.map((f) => [f, ''])))
const patients = ref([])
const createdId = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const data = await patientService.list({ per_page: 200 })
    patients.value = data.items || data || []
  } catch { /* silent */ }
})

const submit = async () => {
  loading.value = true
  error.value = ''
  createdId.value = ''
  try {
    const d = await medicalRecordService.create(form)
    createdId.value = d.id
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erro ao criar prontuário'
  } finally {
    loading.value = false
  }
}
</script>
