<template>
  <router-link
    :to="to"
    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
    :class="isActive
      ? 'bg-zinc-900 text-white'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'"
  >
    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
      <template v-if="icon === 'grid'">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </template>
      <template v-else-if="icon === 'users'">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </template>
      <template v-else-if="icon === 'calendar'">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </template>
      <template v-else-if="icon === 'file-text'">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </template>
      <template v-else-if="icon === 'user-cog'">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><circle cx="20" cy="15" r="2" /><path d="M20 11v1" /><path d="M20 19v1" /><path d="M16.5 13l.87.5" /><path d="M22.63 16.5l.87.5" /><path d="M16.5 17l.87-.5" /><path d="M22.63 13.5l.87-.5" />
      </template>
      <template v-else-if="icon === 'building'">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="6" x2="9" y2="6.01" /><line x1="15" y1="6" x2="15" y2="6.01" /><line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" /><line x1="9" y1="14" x2="9" y2="14.01" /><line x1="15" y1="14" x2="15" y2="14.01" /><path d="M9 22v-4h6v4" />
      </template>
      <template v-else-if="icon === 'scroll'">
        <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 0 0-2-2H2v2a2 2 0 0 0 2 2h2v12" /><path d="M19 17V5a2 2 0 0 0-2-2H4" />
      </template>
    </svg>
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
})

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>
