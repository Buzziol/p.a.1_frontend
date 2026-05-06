<template>
  <div class="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm" v-bind="$attrs">
    <h3 v-if="title" class="text-lg font-semibold text-zinc-900 mb-4">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>
