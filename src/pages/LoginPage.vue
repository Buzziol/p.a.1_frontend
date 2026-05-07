<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">AegisDerm</h1>
      <p class="text-sm text-zinc-500 mt-2">Sistema de Gestão Dermatológica</p>
    </div>
    <BaseCard>
      <h2 class="text-xl font-semibold text-zinc-900 mb-4">Entrar</h2>
      <form class="space-y-4" @submit.prevent="submit">
        <BaseInput v-model="email" type="email" label="E-mail" required placeholder="seu@email.com" />
        <BaseInput v-model="password" type="password" label="Senha" required placeholder="Sua senha" />
        <ErrorState v-if="error" :message="error" />
        <BaseButton type="submit" :disabled="loading" class="w-full">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import ErrorState from '../components/ErrorState.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

const submit = async () => {
  try {
    loading.value = true
    error.value = ''
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e?.response?.data?.message || 'Falha no login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>
