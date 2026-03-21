<template>
  <paginated-select
    v-model="model"
    label="Cliente"
    item-title="name"
    :load-fn="loadCustomers"
    :fetch-by-id-fn="(id) => customersStore.getCustomer(Number(id))"
  />
</template>

<script setup lang="ts">
import { useCustomersStore } from '@/stores/customers.store'
import PaginatedSelect from './PaginatedSelect.vue'

const model = defineModel<number | null>({ required: true })

const customersStore = useCustomersStore()

const loadCustomers = async (page: number, search: string) => {
  const res = await customersStore.getCustomers(page, 5, { name: search })
  return {
    items: res.customers,
    total: res.total
  }
}
</script>
