<template>
  <button
    class="px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClasses"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
})

const variantClasses = computed(() => ({
  'bg-zinc-900 text-white hover:bg-zinc-800': props.variant === 'primary',
  'bg-zinc-100 text-zinc-900 hover:bg-zinc-200': props.variant === 'secondary',
  'bg-red-600 text-white hover:bg-red-700': props.variant === 'danger',
  'bg-emerald-600 text-white hover:bg-emerald-700': props.variant === 'success',
}))
</script>
