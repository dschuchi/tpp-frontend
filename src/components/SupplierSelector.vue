<template>
  <paginated-select
    v-model="model"
    label="Proveedor"
    item-title="name"
    :load-fn="loadSuppliers"
    :fetch-by-id-fn="(id) => suppliersStore.getSupplier(Number(id))"
  />
</template>

<script setup lang="ts">
import { useSuppliersStore } from '@/stores/suppliers.store'
import PaginatedSelect from './PaginatedSelect.vue'

const model = defineModel<number | null | undefined>({ required: true })

const suppliersStore = useSuppliersStore()

const loadSuppliers = async (page: number, search: string) => {
  const res = await suppliersStore.getSuppliers(page, 5, { name: search })
  return {
    items: res.suppliers,
    total: res.total
  }
}
</script>
