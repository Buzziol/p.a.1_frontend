<template>
  <header class="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between">
    <h1 class="font-semibold text-zinc-900">{{ pageTitle }}</h1>
    <div class="flex items-center gap-4">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-medium text-zinc-700">{{ auth.user?.name || auth.user?.email }}</p>
        <p class="text-xs text-zinc-400" v-if="auth.clinic">Clínica {{ auth.clinic.name || auth.clinic.id || auth.clinic }}</p>
      </div>
      <button
        @click="logout"
        class="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        Sair
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/patients': 'Pacientes',
  '/patients/new': 'Novo Paciente',
  '/appointments': 'Agenda',
  '/appointments/new': 'Nova Consulta',
  '/medical-records/new': 'Novo Prontuário',
  '/admin/users': 'Usuários',
  '/admin/clinics': 'Clínicas',
  '/admin/audit-logs': 'Auditoria',
}

const pageTitle = computed(() => pageTitles[route.path] || 'AegisDerm')

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>
