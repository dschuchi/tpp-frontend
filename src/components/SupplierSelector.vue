<template>
  <v-autocomplete
    v-model="model"
    :items="suppliersStore.suppliers"
    item-title="name"
    item-value="id"
    :label="label"
    :variant="variant"
    :rules="rules"
    :readonly="readonly"
    :clearable="clearable"
    no-data-text="No se encontraron proveedores"
  />
</template>

<script setup lang="ts">
import { useSuppliersStore } from '@/stores/suppliers.store'

const props = defineProps({
  label: { type: String, default: 'Proveedor' },
  variant: { type: String as () => 'outlined' | 'filled' | 'underlined' | 'plain' | 'solo', default: 'outlined' },
  rules: { type: Array as () => ((v: any) => boolean | string)[], default: () => [] },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
})

const model = defineModel<number | null>({ required: true })

const suppliersStore = useSuppliersStore()

onMounted(() => {
  if (!suppliersStore.suppliers.length) {
    suppliersStore.getSuppliers()
  }
})
</script>
