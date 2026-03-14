<template>
  <div class="d-flex justify-space-between align-center flex-wrap gap-3">

    <div>
      <div class="mb-1">
        <v-btn variant="plain" :to="backRoute" class="px-0 text-none" size="small" prepend-icon="mdi-arrow-left"
          :class="{ 'opacity-0': !backRoute }" :disabled="!backRoute" :ripple="false">
          {{ backText ? 'Volver a ' + backText : 'Volver' }}
        </v-btn>
      </div>

      <div>
        <h1 class="text-h4 font-weight-bold">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="text-subtitle-2 text-medium-emphasis mt-1">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div v-if="$slots.actions" class="d-flex align-center ga-2">
      <slot name="actions"></slot>
    </div>

  </div>
  <v-divider class="mt-4 mb-6" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  backRoute: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: null
  },
  backText: {
    type: String,
    default: null
  }
})
</script>
