<template>
  <input
    :value="modelValue"
    class="w-full border rounded-xl px-3 py-2"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
