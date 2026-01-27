<template>
  <v-chip :color="value ? 'success' : 'error'" size="small">
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
