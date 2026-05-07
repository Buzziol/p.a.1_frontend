<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-zinc-900">Pacientes</h2>
        <p class="text-sm text-zinc-500 mt-1">{{ total }} paciente(s) encontrado(s)</p>
      </div>
      <router-link v-if="canCreate" to="/patients/new">
        <BaseButton>Novo paciente</BaseButton>
      </router-link>
    </div>

    <!-- Busca -->
    <div class="flex gap-3">
      <div class="flex-1">
        <BaseInput v-model="search" placeholder="Buscar por nome, CPF ou e-mail..." @keyup.enter="loadPatients(1)" />
      </div>
      <BaseButton @click="loadPatients(1)">Buscar</BaseButton>
    </div>

    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <BaseCard v-else-if="items.length === 0">Nenhum paciente encontrado.</BaseCard>

    <!-- Tabela -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left text-zinc-500">
            <th class="pb-3 font-medium">Nome</th>
            <th class="pb-3 font-medium">CPF</th>
            <th class="pb-3 font-medium">Telefone</th>
            <th class="pb-3 font-medium">E-mail</th>
            <th class="pb-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in items" :key="p.id" class="border-b border-zinc-100 hover:bg-zinc-50">
            <td class="py-3 font-medium text-zinc-900">{{ p.name }}</td>
            <td class="py-3 text-zinc-600">{{ p.cpf }}</td>
            <td class="py-3 text-zinc-600">{{ p.phone || '—' }}</td>
            <td class="py-3 text-zinc-600">{{ p.email || '—' }}</td>
            <td class="py-3 text-right space-x-2">
              <router-link v-if="canEdit" :to="`/patients/${p.id}/edit`" class="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        v-for="pg in totalPages" :key="pg"
        @click="loadPatients(pg)"
        :class="pg === page ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'"
        class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
      >
        {{ pg }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { patientService } from '../services/patientService'
import { useAuthStore } from '../stores/authStore'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const role = computed(() => useAuthStore().role)
const canCreate = computed(() => ['CLINIC_ADMIN', 'RECEPTIONIST'].includes(role.value))
const canEdit = computed(() => ['CLINIC_ADMIN', 'RECEPTIONIST'].includes(role.value))

const items = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')
const page = ref(1)
const total = ref(0)
const perPage = 15
const totalPages = computed(() => Math.ceil(total.value / perPage))

async function loadPatients(pg = 1) {
  loading.value = true
  error.value = ''
  page.value = pg
  try {
    const params = { page: pg, per_page: perPage }
    if (search.value.trim()) params.search = search.value.trim()
    const d = await patientService.list(params)
    items.value = d.items || d || []
    total.value = d.total || items.value.length
  } catch {
    error.value = 'Erro ao buscar pacientes'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadPatients(1))
</script>
