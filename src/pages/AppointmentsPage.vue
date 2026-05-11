<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-zinc-900">Agenda</h2>
        <p class="text-sm text-zinc-500 mt-1">Consultas agendadas</p>
      </div>
      <router-link v-if="canCreate" to="/appointments/new">
        <BaseButton>Nova consulta</BaseButton>
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="grid sm:grid-cols-3 gap-3">
      <BaseInput v-model="filters.date" label="Data" type="date" />
      <BaseSelect v-model="filters.status" label="Status">
        <option value="">Todos</option>
        <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
      </BaseSelect>
      <div class="flex items-end">
        <BaseButton @click="load" class="w-full">Filtrar</BaseButton>
      </div>
    </div>

    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <BaseCard v-else-if="items.length === 0">Nenhuma consulta encontrada.</BaseCard>

    <!-- Tabela -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left text-zinc-500">
            <th class="pb-3 font-medium">Data/Hora</th>
            <th class="pb-3 font-medium">Paciente</th>
            <th class="pb-3 font-medium">Médico</th>
            <th class="pb-3 font-medium">Status</th>
            <th class="pb-3 font-medium">Observações</th>
            <th class="pb-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in items" :key="a.id" class="border-b border-zinc-100 hover:bg-zinc-50">
            <td class="py-3 text-zinc-900 font-medium whitespace-nowrap">{{ formatDateTime(a.scheduled_at) }}</td>
            <td class="py-3 text-zinc-700">{{ a.patient_name || a.patient_id }}</td>
            <td class="py-3 text-zinc-600">{{ a.doctor_name || a.doctor_profile_id }}</td>
            <td class="py-3">
              <span :class="statusBadge(a.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ statusLabel(a.status) }}
              </span>
            </td>
            <td class="py-3 text-zinc-500 text-xs max-w-[200px] truncate">{{ a.notes || '—' }}</td>
            <td class="py-3 text-right">
              <select
                v-if="canUpdate"
                :value="a.status"
                @change="updateStatus(a.id, ($event.target).value)"
                class="text-xs border border-zinc-200 rounded-lg px-2 py-1 bg-white"
              >
                <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { appointmentService } from '../services/appointmentService'
import { useAuthStore } from '../stores/authStore'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseCard from '../components/BaseCard.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const role = computed(() => useAuthStore().role)
const canCreate = computed(() => ['CLINIC_ADMIN', 'RECEPTIONIST'].includes(role.value))
const canUpdate = computed(() => ['CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(role.value))

const statuses = [
  { value: 'SCHEDULED', label: 'Agendada' },
  { value: 'CONFIRMED', label: 'Confirmada' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'COMPLETED', label: 'Concluída' },
  { value: 'CANCELLED', label: 'Cancelada' },
  { value: 'NO_SHOW', label: 'Não compareceu' },
  { value: 'RESCHEDULED', label: 'Remarcada' },
]

const filters = reactive({ date: '', status: '' })
const items = ref([])
const loading = ref(false)
const error = ref('')

const statusLabel = (s) => statuses.find((x) => x.value === s)?.label || s
const statusBadge = (s) => ({
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-zinc-100 text-zinc-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-orange-100 text-orange-700',
  RESCHEDULED: 'bg-purple-100 text-purple-700',
}[s] || 'bg-zinc-100 text-zinc-700')

function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (filters.date) params.date = filters.date
    if (filters.status) params.status = filters.status
    const d = await appointmentService.list(params)
    items.value = d.items || d || []
  } catch {
    error.value = 'Erro ao buscar consultas'
  } finally {
    loading.value = false
  }
}

async function updateStatus(id, status) {
  try {
    await appointmentService.updateStatus(id, status)
    await load()
  } catch {
    error.value = 'Erro ao atualizar status'
  }
}

onMounted(load)
</script>
