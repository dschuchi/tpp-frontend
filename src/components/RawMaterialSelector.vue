<template>
  <paginated-select
    v-model="model"
    label="Materia Prima"
    item-title="name"
    :load-fn="loadRawMaterials"
    :fetch-by-id-fn="(id) => rawMaterialsStore.getRawMaterial(Number(id))"
  />
</template>

<script setup lang="ts">
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import PaginatedSelect from './PaginatedSelect.vue'

const model = defineModel<number | null | undefined>({ required: true })

const rawMaterialsStore = useRawMaterialsStore()

const loadRawMaterials = async (page: number, search: string) => {
  const res = await rawMaterialsStore.getRawMaterials(page, 5, { name: search })
  return {
    items: res.rawMaterials,
    total: res.total
  }
}
</script>
