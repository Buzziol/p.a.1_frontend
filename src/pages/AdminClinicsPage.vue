<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-zinc-900">Clínicas</h2>
        <p class="text-sm text-zinc-500 mt-1">Gerencie as clínicas cadastradas</p>
      </div>
      <BaseButton @click="showForm = !showForm">
        {{ showForm ? 'Cancelar' : 'Nova clínica' }}
      </BaseButton>
    </div>

    <!-- Formulário de criação -->
    <BaseCard v-if="showForm" title="Criar Clínica">
      <form class="grid md:grid-cols-2 gap-4" @submit.prevent="createClinic">
        <BaseInput v-model="form.name" label="Nome" required placeholder="Nome da clínica" />
        <BaseInput v-model="form.cnpj" label="CNPJ" placeholder="00.000.000/0000-00" maxlength="18" @input="maskCnpj" />
        <BaseInput v-model="form.phone" label="Telefone" placeholder="(00) 00000-0000" maxlength="15" />
        <BaseInput v-model="form.email" label="E-mail" type="email" placeholder="contato@clinica.com" />
        <div class="md:col-span-2 flex gap-3 pt-2">
          <BaseButton type="submit" :disabled="creating">{{ creating ? 'Criando...' : 'Criar clínica' }}</BaseButton>
        </div>
      </form>
      <p v-if="createSuccess" class="text-emerald-600 mt-3 text-sm">Clínica criada com sucesso!</p>
      <ErrorState v-if="createError" :message="createError" />
    </BaseCard>

    <!-- Lista -->
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <BaseCard v-else-if="clinics.length === 0">Nenhuma clínica encontrada.</BaseCard>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <BaseCard v-for="c in clinics" :key="c.id">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-zinc-900">{{ c.name }}</h3>
            <p v-if="c.cnpj" class="text-sm text-zinc-500 mt-1">CNPJ: {{ c.cnpj }}</p>
          </div>
          <span :class="c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded-full text-xs font-medium">
            {{ c.is_active ? 'Ativa' : 'Inativa' }}
          </span>
        </div>
        <div class="mt-3 space-y-1 text-sm text-zinc-600">
          <p v-if="c.email">{{ c.email }}</p>
          <p v-if="c.phone">{{ c.phone }}</p>
          <p class="text-xs text-zinc-400">ID: {{ c.id }}</p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { adminService } from '../services/adminService'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const clinics = ref([])
const loading = ref(true)
const error = ref('')

const showForm = ref(false)
const form = reactive({ name: '', cnpj: '', phone: '', email: '' })
const creating = ref(false)
const createSuccess = ref(false)
const createError = ref('')

function maskCnpj() {
  let v = form.cnpj.replace(/\D/g, '').slice(0, 14)
  if (v.length > 12) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5')
  else if (v.length > 8) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4')
  else if (v.length > 5) v = v.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3')
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,3})/, '$1.$2')
  form.cnpj = v
}

async function loadClinics() {
  loading.value = true
  error.value = ''
  try {
    clinics.value = await adminService.listClinics() || []
  } catch {
    error.value = 'Erro ao carregar clínicas'
  } finally {
    loading.value = false
  }
}

async function createClinic() {
  creating.value = true
  createSuccess.value = false
  createError.value = ''
  try {
    const payload = {}
    Object.entries(form).forEach(([k, v]) => { if (v) payload[k] = v })
    await adminService.createClinic(payload)
    createSuccess.value = true
    Object.keys(form).forEach((k) => (form[k] = ''))
    showForm.value = false
    await loadClinics()
  } catch (e) {
    createError.value = e?.response?.data?.error || 'Erro ao criar clínica'
  } finally {
    creating.value = false
  }
}

onMounted(loadClinics)
</script>
