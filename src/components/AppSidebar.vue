<template>
  <aside class="w-64 bg-white border-r border-zinc-200 flex flex-col">
    <!-- Logo -->
    <div class="h-16 flex items-center px-5 border-b border-zinc-200">
      <span class="text-lg font-bold text-zinc-900 tracking-tight">AegisDerm</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <SidebarLink to="/dashboard" icon="grid" label="Dashboard" />

      <p v-if="canPatients" class="px-3 pt-4 pb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Clínica</p>
      <SidebarLink v-if="canPatients" to="/patients" icon="users" label="Pacientes" />
      <SidebarLink v-if="canAppointments" to="/appointments" icon="calendar" label="Agenda" />
      <SidebarLink v-if="canRecords" to="/medical-records/new" icon="file-text" label="Novo Prontuário" />

      <p v-if="canAdmin" class="px-3 pt-4 pb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Administração</p>
      <SidebarLink v-if="canUsers" to="/admin/users" icon="user-cog" label="Usuários" />
      <SidebarLink v-if="canClinics" to="/admin/clinics" icon="building" label="Clínicas" />
      <SidebarLink v-if="canAudit" to="/admin/audit-logs" icon="scroll" label="Auditoria" />
    </nav>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-zinc-200">
      <p class="text-xs text-zinc-400 truncate">{{ auth.user?.name || auth.user?.email }}</p>
      <p class="text-xs text-zinc-300">{{ roleLabel }}</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import SidebarLink from './SidebarLink.vue'

const auth = useAuthStore()
const role = computed(() => auth.role)

const canPatients = computed(() => ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(role.value))
const canAppointments = computed(() => ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(role.value))
const canRecords = computed(() => ['CLINIC_ADMIN', 'DOCTOR'].includes(role.value))
const canUsers = computed(() => ['SUPER_ADMIN', 'CLINIC_ADMIN'].includes(role.value))
const canClinics = computed(() => role.value === 'SUPER_ADMIN')
const canAudit = computed(() => ['SUPER_ADMIN', 'CLINIC_ADMIN'].includes(role.value))
const canAdmin = computed(() => canUsers.value || canClinics.value || canAudit.value)

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  CLINIC_ADMIN: 'Admin Clínica',
  DOCTOR: 'Médico',
  RECEPTIONIST: 'Recepcionista',
}
const roleLabel = computed(() => roleLabels[role.value] || role.value)
</script>
