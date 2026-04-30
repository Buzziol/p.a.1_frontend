<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="block">
    <span v-if="label" class="block text-sm font-medium text-slate-700 mb-1">
      {{ label }}
    </span>

    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-300 px-3 py-2"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>
