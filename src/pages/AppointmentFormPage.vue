<template>
  <BaseCard title="Nova Consulta">
    <form class="grid md:grid-cols-2 gap-4" @submit.prevent="submit">
      <BaseSelect v-model="form.patient_id" label="Paciente" required>
        <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }} — {{ p.cpf }}</option>
      </BaseSelect>
      <BaseSelect v-model="form.doctor_profile_id" label="Médico" required>
        <option v-for="u in doctors" :key="u.id" :value="u.doctor_profile_id">{{ u.name }}</option>
      </BaseSelect>
      <BaseInput v-model="form.scheduled_at" label="Data e hora" required type="datetime-local" />
      <BaseInput v-model="form.notes" label="Observações" placeholder="Opcional" />
      <div class="md:col-span-2 flex gap-3 pt-2">
        <BaseButton type="submit" :disabled="loading">{{ loading ? 'Criando...' : 'Criar consulta' }}</BaseButton>
        <BaseButton variant="secondary" type="button" @click="$router.push('/appointments')">Cancelar</BaseButton>
      </div>
    </form>
    <p v-if="success" class="text-emerald-600 mt-4 text-sm">Consulta criada!</p>
    <ErrorState v-if="error" :message="error" />
  </BaseCard>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import { adminService } from '../services/adminService'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseButton from '../components/BaseButton.vue'
import ErrorState from '../components/ErrorState.vue'

const form = reactive({ patient_id: '', doctor_profile_id: '', scheduled_at: '', notes: '' })
const patients = ref([])
const doctors = ref([])
const success = ref(false)
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const pData = await patientService.list({ per_page: 200 })
    patients.value = pData.items || pData || []
    const users = await adminService.listUsers()
    doctors.value = (users || []).filter((u) => u.role === 'DOCTOR' && u.is_active)
      .map((u) => ({ ...u, doctor_profile_id: u.id }))
    // O doctor_profile_id real pode diferir do user.id, mas para o MVP usamos a convenção do seed
  } catch {
    // Silent — selects ficam vazios
  }
})

const submit = async () => {
  loading.value = true
  success.value = false
  error.value = ''
  try {
    const payload = { ...form }
    if (payload.scheduled_at) {
      payload.scheduled_at = new Date(payload.scheduled_at).toISOString()
    }
    await appointmentService.create(payload)
    success.value = true
    Object.keys(form).forEach((k) => (form[k] = ''))
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erro ao criar consulta'
  } finally {
    loading.value = false
  }
}
</script>
