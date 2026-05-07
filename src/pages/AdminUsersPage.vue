<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-zinc-900">Usuários</h2>
        <p class="text-sm text-zinc-500 mt-1">Gerencie os usuários do sistema</p>
      </div>
      <BaseButton @click="showForm = !showForm">
        {{ showForm ? 'Cancelar' : 'Novo usuário' }}
      </BaseButton>
    </div>

    <!-- Formulário de criação -->
    <BaseCard v-if="showForm" title="Criar Usuário">
      <form class="grid md:grid-cols-2 gap-4" @submit.prevent="createUser">
        <BaseInput v-model="form.name" label="Nome" required placeholder="Nome completo" />
        <BaseInput v-model="form.email" label="E-mail" required type="email" placeholder="email@exemplo.com" />
        <BaseInput v-model="form.password" label="Senha" required type="password" placeholder="Mínimo 6 caracteres" />
        <BaseSelect v-model="form.role" label="Perfil" required>
          <option value="CLINIC_ADMIN">Administrador da Clínica</option>
          <option value="DOCTOR">Médico</option>
          <option value="RECEPTIONIST">Recepcionista</option>
          <option v-if="isSuperAdmin" value="SUPER_ADMIN">Super Admin</option>
        </BaseSelect>
        <BaseInput v-if="isSuperAdmin" v-model="form.clinic_id" label="Clínica ID" type="number" placeholder="ID da clínica" />
        <BaseInput v-if="form.role === 'DOCTOR'" v-model="form.crm" label="CRM" placeholder="CRM do médico" />
        <div class="md:col-span-2 flex gap-3 pt-2">
          <BaseButton type="submit" :disabled="creating">{{ creating ? 'Criando...' : 'Criar usuário' }}</BaseButton>
        </div>
      </form>
      <p v-if="createSuccess" class="text-emerald-600 mt-3 text-sm">Usuário criado com sucesso!</p>
      <ErrorState v-if="createError" :message="createError" />
    </BaseCard>

    <!-- Lista -->
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <BaseCard v-else-if="users.length === 0">Nenhum usuário encontrado.</BaseCard>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left text-zinc-500">
            <th class="pb-3 font-medium">Nome</th>
            <th class="pb-3 font-medium">E-mail</th>
            <th class="pb-3 font-medium">Perfil</th>
            <th class="pb-3 font-medium">Clínica</th>
            <th class="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-b border-zinc-100 hover:bg-zinc-50">
            <td class="py-3 font-medium text-zinc-900">{{ u.name }}</td>
            <td class="py-3 text-zinc-600">{{ u.email }}</td>
            <td class="py-3">
              <span :class="roleBadgeClass(u.role)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ roleLabel(u.role) }}
              </span>
            </td>
            <td class="py-3 text-zinc-600">{{ u.clinic_id || '—' }}</td>
            <td class="py-3">
              <span :class="u.is_active ? 'text-emerald-600' : 'text-red-500'" class="text-xs font-medium">
                {{ u.is_active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { adminService } from '../services/adminService'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseButton from '../components/BaseButton.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const auth = useAuthStore()
const isSuperAdmin = computed(() => auth.role === 'SUPER_ADMIN')

const users = ref([])
const loading = ref(true)
const error = ref('')

const showForm = ref(false)
const form = reactive({ name: '', email: '', password: '', role: 'RECEPTIONIST', clinic_id: '', crm: '' })
const creating = ref(false)
const createSuccess = ref(false)
const createError = ref('')

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  CLINIC_ADMIN: 'Admin Clínica',
  DOCTOR: 'Médico',
  RECEPTIONIST: 'Recepcionista',
}

const roleLabel = (r) => roleLabels[r] || r
const roleBadgeClass = (r) => ({
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  CLINIC_ADMIN: 'bg-blue-100 text-blue-700',
  DOCTOR: 'bg-emerald-100 text-emerald-700',
  RECEPTIONIST: 'bg-amber-100 text-amber-700',
}[r] || 'bg-zinc-100 text-zinc-700')

async function loadUsers() {
  loading.value = true
  error.value = ''
  try {
    users.value = await adminService.listUsers() || []
  } catch {
    error.value = 'Erro ao carregar usuários'
  } finally {
    loading.value = false
  }
}

async function createUser() {
  creating.value = true
  createSuccess.value = false
  createError.value = ''
  try {
    const payload = { ...form }
    if (!payload.clinic_id) delete payload.clinic_id
    if (payload.role !== 'DOCTOR') delete payload.crm
    await adminService.createUser(payload)
    createSuccess.value = true
    Object.keys(form).forEach((k) => (form[k] = ''))
    form.role = 'RECEPTIONIST'
    showForm.value = false
    await loadUsers()
  } catch (e) {
    createError.value = e?.response?.data?.error || 'Erro ao criar usuário'
  } finally {
    creating.value = false
  }
}

onMounted(loadUsers)
</script>
