<template>
<aside class='w-64 bg-white border-r p-4 space-y-2'>
  <router-link class='block' to='/dashboard'>Dashboard</router-link>
  <router-link v-if='canPatients' class='block' to='/patients'>Pacientes</router-link>
  <router-link v-if='canAppointments' class='block' to='/appointments'>Agenda</router-link>
  <router-link v-if='canRecords' class='block' to='/medical-records/new'>Novo Prontuário</router-link>
</aside>
</template>
<script setup>
import { computed } from 'vue';import { useAuthStore } from '../stores/authStore';
const role = computed(()=>useAuthStore().role)
const canPatients=computed(()=>['CLINIC_ADMIN','DOCTOR','RECEPTIONIST'].includes(role.value))
const canAppointments=computed(()=>['CLINIC_ADMIN','DOCTOR','RECEPTIONIST'].includes(role.value))
const canRecords=computed(()=>['CLINIC_ADMIN','DOCTOR'].includes(role.value))
</script>
