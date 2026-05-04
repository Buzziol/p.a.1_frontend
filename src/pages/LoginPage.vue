<template><BaseCard class='w-full max-w-md'><h2 class='text-xl mb-4'>Login</h2><form class='space-y-3' @submit.prevent='submit'><BaseInput v-model='email' type='email' placeholder='E-mail'/><BaseInput v-model='password' type='password' placeholder='Senha'/><ErrorState v-if='error' :message='error'/><BaseButton :disabled='loading'>Entrar</BaseButton></form></BaseCard></template>
<script setup>
import { ref } from 'vue';import { useRouter } from 'vue-router';import { useAuthStore } from '../stores/authStore';import BaseCard from '../components/BaseCard.vue';import BaseInput from '../components/BaseInput.vue';import BaseButton from '../components/BaseButton.vue';import ErrorState from '../components/ErrorState.vue';
const email=ref('');const password=ref('');const error=ref('');const loading=ref(false);const router=useRouter();const auth=useAuthStore();
const submit=async()=>{try{loading.value=true;error.value='';await auth.login(email.value, password.value);router.push('/dashboard')}catch(e){error.value=e?.response?.data?.message||'Falha no login'}finally{loading.value=false}}
</script>
