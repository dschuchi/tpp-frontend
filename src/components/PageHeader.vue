<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-space-between align-center flex-wrap">
      <div>
        <h1 class="text-h4 font-weight-bold">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="text-subtitle-1 font-weight-light text-medium-emphasis mt-1">
          {{ subtitle }}
        </p>
      </div>

      <div v-if="$slots.actions" class="d-flex align-center ga-2">
        <slot name="actions"></slot>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
