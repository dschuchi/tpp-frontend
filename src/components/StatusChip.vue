<template>
  <v-chip
    :color="value ? 'success' : 'error'"
    size="small"
    variant="tonal"
    :prepend-icon="value ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
  >
    {{ value ? trueText : falseText }}
  </v-chip>
</template>

<script setup lang="ts">
defineProps({
  value: Boolean,
  trueText: { type: String, default: 'Activo' },
  falseText: { type: String, default: 'Inactivo' }
})
</script>
