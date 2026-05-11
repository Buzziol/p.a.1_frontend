<template>
  <LoadingState v-if="loadingData" />
  <BaseCard v-else title="Editar Paciente">
    <form class="grid md:grid-cols-2 gap-4" @submit.prevent="submit">
      <BaseInput v-model="form.name" label="Nome completo" required />
      <BaseInput :modelValue="form.cpf" label="CPF" disabled />
      <BaseInput v-model="form.email" label="E-mail" required type="email" />
      <BaseInput v-model="form.phone" label="Telefone" required />
      <BaseInput v-model="form.birth_date" label="Data de nascimento" required type="date" />
      <BaseSelect v-model="form.blood_type" label="Tipo sanguíneo" required>
        <option v-for="t in bloodTypes" :key="t" :value="t">{{ t }}</option>
      </BaseSelect>
      <BaseInput v-model="form.address" label="Endereço" required />
      <BaseInput v-model="form.cep" label="CEP" required />
      <BaseSelect v-model="form.marital_status" label="Estado civil" required>
        <option v-for="s in maritalStatuses" :key="s" :value="s">{{ s }}</option>
      </BaseSelect>
      <div class="md:col-span-2 flex gap-3 pt-2">
        <BaseButton type="submit" :disabled="loading">{{ loading ? 'Salvando...' : 'Salvar' }}</BaseButton>
        <BaseButton variant="secondary" type="button" @click="$router.push('/patients')">Cancelar</BaseButton>
      </div>
    </form>
    <p v-if="success" class="text-emerald-600 mt-4 text-sm">Paciente atualizado!</p>
    <ErrorState v-if="error" :message="error" />
  </BaseCard>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { patientService } from '../services/patientService'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseButton from '../components/BaseButton.vue'
import ErrorState from '../components/ErrorState.vue'
import LoadingState from '../components/LoadingState.vue'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const maritalStatuses = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']

const route = useRoute()
const form = reactive({
  name: '', cpf: '', address: '', cep: '', phone: '',
  birth_date: '', blood_type: '', email: '', marital_status: '',
})
const success = ref(false)
const error = ref('')
const loading = ref(false)
const loadingData = ref(true)

onMounted(async () => {
  try {
    const p = await patientService.getById(route.params.id)
    Object.assign(form, p)
  } catch {
    error.value = 'Erro ao carregar paciente'
  } finally {
    loadingData.value = false
  }
})

const submit = async () => {
  loading.value = true
  success.value = false
  error.value = ''
  try {
    await patientService.update(route.params.id, form)
    success.value = true
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erro ao atualizar paciente'
  } finally {
    loading.value = false
  }
}
</script>
