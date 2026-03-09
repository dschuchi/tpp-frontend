<template>
  <v-autocomplete
    v-model="model"
    :items="customersStore.customers"
    item-title="name"
    item-value="id"
    :label="label"
    :variant="variant"
    :rules="rules"
    :readonly="readonly"
    :clearable="clearable"
    no-data-text="No se encontraron clientes"
  />
</template>

<script setup lang="ts">
import { useCustomersStore } from '@/stores/customers.store'

const props = defineProps({
  label: { type: String, default: 'Cliente' },
  variant: { type: String as () => 'outlined' | 'filled' | 'underlined' | 'plain' | 'solo', default: 'outlined' },
  rules: { type: Array as () => ((v: any) => boolean | string)[], default: () => [] },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
})

const model = defineModel<number | null>({ required: true })

const customersStore = useCustomersStore()

onMounted(() => {
  if (!customersStore.customers.length) {
    customersStore.getCustomers()
  }
})
</script>
