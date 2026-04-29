<template><header class='h-16 bg-white border-b px-6 flex items-center justify-between'><h1 class='font-semibold'>Dermato Admin</h1><button @click='logout' class='text-sm text-zinc-600'>Sair</button></header></template>
<script setup>
import { useRouter } from 'vue-router';import { useAuthStore } from '../stores/authStore';
const router=useRouter();const auth=useAuthStore();const logout=()=>{auth.logout();router.push('/login')}
</script>
