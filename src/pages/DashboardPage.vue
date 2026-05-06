<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold text-zinc-900">Dashboard</h2>
      <p class="text-sm text-zinc-500 mt-1">Bem-vindo, {{ auth.user?.name || auth.user?.email }}</p>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseCard v-if="data.total_clinics !== undefined">
        <p class="text-sm text-zinc-500">Clínicas ativas</p>
        <p class="text-3xl font-bold text-zinc-900 mt-1">{{ data.total_clinics }}</p>
      </BaseCard>
      <BaseCard v-if="data.total_users !== undefined">
        <p class="text-sm text-zinc-500">Usuários ativos</p>
        <p class="text-3xl font-bold text-zinc-900 mt-1">{{ data.total_users }}</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-zinc-500">Total de pacientes</p>
        <p class="text-3xl font-bold text-zinc-900 mt-1">{{ data.total_patients ?? '—' }}</p>
      </BaseCard>
      <BaseCard v-if="data.appointments_today !== undefined">
        <p class="text-sm text-zinc-500">Consultas hoje</p>
        <p class="text-3xl font-bold text-blue-600 mt-1">{{ data.appointments_today }}</p>
      </BaseCard>
      <BaseCard v-if="data.appointments_scheduled !== undefined">
        <p class="text-sm text-zinc-500">Agendadas</p>
        <p class="text-3xl font-bold text-amber-600 mt-1">{{ data.appointments_scheduled }}</p>
      </BaseCard>
      <BaseCard v-if="data.my_appointments_today !== undefined">
        <p class="text-sm text-zinc-500">Minhas consultas hoje</p>
        <p class="text-3xl font-bold text-emerald-600 mt-1">{{ data.my_appointments_today }}</p>
      </BaseCard>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <BaseCard title="Ações rápidas">
        <div class="flex flex-wrap gap-2">
          <router-link v-if="canPatients" to="/patients" class="px-3 py-2 text-sm bg-zinc-100 rounded-xl hover:bg-zinc-200 transition">Ver pacientes</router-link>
          <router-link v-if="canAppointments" to="/appointments" class="px-3 py-2 text-sm bg-zinc-100 rounded-xl hover:bg-zinc-200 transition">Ver agenda</router-link>
          <router-link v-if="canCreatePatient" to="/patients/new" class="px-3 py-2 text-sm bg-zinc-100 rounded-xl hover:bg-zinc-200 transition">Novo paciente</router-link>
          <router-link v-if="canCreateAppointment" to="/appointments/new" class="px-3 py-2 text-sm bg-zinc-100 rounded-xl hover:bg-zinc-200 transition">Nova consulta</router-link>
          <router-link v-if="canRecords" to="/medical-records/new" class="px-3 py-2 text-sm bg-zinc-100 rounded-xl hover:bg-zinc-200 transition">Novo prontuário</router-link>
        </div>
      </BaseCard>
      <BaseCard title="Informações">
        <p class="text-sm text-zinc-600">Perfil: <span class="font-medium">{{ auth.role }}</span></p>
        <p class="text-sm text-zinc-600 mt-1" v-if="auth.clinic">Clínica ID: {{ auth.clinic.id || auth.clinic }}</p>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { adminService } from '../services/adminService'
import BaseCard from '../components/BaseCard.vue'
import LoadingState from '../components/LoadingState.vue'

const auth = useAuthStore()
const data = ref({})
const loading = ref(true)

const canPatients = computed(() => ['CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(auth.role))
const canAppointments = computed(() => ['CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(auth.role))
const canCreatePatient = computed(() => ['CLINIC_ADMIN', 'RECEPTIONIST'].includes(auth.role))
const canCreateAppointment = computed(() => ['CLINIC_ADMIN', 'RECEPTIONIST'].includes(auth.role))
const canRecords = computed(() => ['CLINIC_ADMIN', 'DOCTOR'].includes(auth.role))

onMounted(async () => {
  try {
    data.value = await adminService.dashboard()
  } catch { /* silent */ }
  finally { loading.value = false }
})
</script>
