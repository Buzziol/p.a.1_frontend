<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold text-zinc-900">Logs de Auditoria</h2>
      <p class="text-sm text-zinc-500 mt-1">Registro de ações realizadas no sistema</p>
    </div>

    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <BaseCard v-else-if="logs.length === 0">Nenhum log encontrado.</BaseCard>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left text-zinc-500">
            <th class="pb-3 font-medium">Data</th>
            <th class="pb-3 font-medium">Ação</th>
            <th class="pb-3 font-medium">Entidade</th>
            <th class="pb-3 font-medium">ID Entidade</th>
            <th class="pb-3 font-medium">Usuário</th>
            <th class="pb-3 font-medium">IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in logs" :key="l.id" class="border-b border-zinc-100 hover:bg-zinc-50">
            <td class="py-3 text-zinc-600 whitespace-nowrap">{{ formatDate(l.created_at) }}</td>
            <td class="py-3">
              <span :class="actionBadgeClass(l.action)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ l.action }}
              </span>
            </td>
            <td class="py-3 text-zinc-900 font-medium">{{ l.entity_type }}</td>
            <td class="py-3 text-zinc-600">{{ l.entity_id }}</td>
            <td class="py-3 text-zinc-600">{{ l.user_id }}</td>
            <td class="py-3 text-zinc-400 text-xs">{{ l.ip_address || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '../services/adminService'
import BaseCard from '../components/BaseCard.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const logs = ref([])
const loading = ref(true)
const error = ref('')

const actionBadgeClass = (action) => ({
  CREATE: 'bg-emerald-100 text-emerald-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
}[action] || 'bg-zinc-100 text-zinc-700')

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

async function loadLogs() {
  loading.value = true
  error.value = ''
  try {
    logs.value = await adminService.listAuditLogs() || []
  } catch {
    error.value = 'Erro ao carregar logs'
  } finally {
    loading.value = false
  }
}

onMounted(loadLogs)
</script>
