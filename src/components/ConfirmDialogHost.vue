<template>
  <ConfirmDialog
    v-if="options"
    :model-value="visible"
    :title="options.title"
    :message="options.message"
    :confirm-text="options.confirmText"
    :confirm-color="options.confirmColor"
    @confirm="onConfirm"
    @update:model-value="onCancel"
  />
</template>

<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'
import ConfirmDialog from './ConfirmDialog.vue'

const { visible, options, onConfirm, onCancel } = useConfirm()
</script>
