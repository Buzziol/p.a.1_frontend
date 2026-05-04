<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="space-y-3 text-center">
      <h1 class="text-2xl font-semibold">403</h1>
      <p>Acesso negado.</p>
      <div class="flex items-center justify-center gap-3">
        <router-link to="/dashboard" class="text-blue-600">Voltar ao dashboard</router-link>
        <button class="text-zinc-600" @click="logout">Sair</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
