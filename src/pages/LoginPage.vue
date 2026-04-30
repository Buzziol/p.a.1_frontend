<template>
  <BaseCard class="w-full max-w-md">
    <h2 class="text-xl mb-4">Login</h2>
    <form class="space-y-3" @submit.prevent="handleLogin">
      <BaseInput v-model="email" label="E-mail" type="email" />
      <BaseInput v-model="password" label="Senha" type="password" />
      <ErrorState v-if="error" :message="error" />
      <button type="submit" class="px-4 py-2 rounded-xl bg-zinc-900 text-white disabled:opacity-50" :disabled="loading">Entrar</button>
    </form>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import ErrorState from '../components/ErrorState.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''

    console.log('LOGIN FORM:', {
      email: email.value,
      password: password.value
    })

    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e?.response?.data?.message || 'Falha no login'
  } finally {
    loading.value = false
  }
}
</script>
