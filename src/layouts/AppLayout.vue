<template>
  <div class='min-h-screen bg-zinc-50 flex'>
    <AppSidebar />
    <div class='flex-1'>
      <AppHeader />
      <main class='p-6'><router-view /></main>
    </div>
  </div>
</template>
<script setup>
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
</script>
