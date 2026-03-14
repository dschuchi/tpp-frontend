<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="420"
  >
    <v-card rounded="xl">
      <v-card-title class="text-h6 font-weight-bold pt-5 px-6">
        {{ title }}
      </v-card-title>

      <v-card-text class="px-6 text-medium-emphasis">
        {{ message }}
      </v-card-text>

      <v-card-actions class="px-6 pb-5 pt-2">
        <v-spacer />

        <v-btn variant="text" @click="cancel" class="text-medium-emphasis">
          Cancelar
        </v-btn>

        <v-btn
          :color="confirmColor"
          variant="tonal"
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmText?: string
  confirmColor?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const cancel = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>
