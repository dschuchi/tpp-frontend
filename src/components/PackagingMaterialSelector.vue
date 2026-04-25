<template>
  <paginated-select
    v-model="model"
    label="Material de Empaque"
    item-title="code"
    :load-fn="loadPackagingMaterials"
    :fetch-by-id-fn="(id) => packagingMaterialsStore.getPackagingMaterial(Number(id))"
  />
</template>

<script setup lang="ts">
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import PaginatedSelect from './PaginatedSelect.vue'

const model = defineModel<number | null | undefined>({ required: true })

const packagingMaterialsStore = usePackagingMaterialsStore()

const loadPackagingMaterials = async (page: number, search: string) => {
  const res = await packagingMaterialsStore.getPackagingMaterials(page, 5, { code: search })
  return {
    items: res.packagingMaterials,
    total: res.total
  }
}
</script>
