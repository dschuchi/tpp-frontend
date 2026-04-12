<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="model.batch_number"
              label="Número de lote"
              variant="outlined"
              type="number"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="model.quantity"
              label="Cantidad"
              variant="outlined"
              type="number"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="model.expiration_date"
              label="Fecha de vencimiento"
              variant="outlined"
              type="date"
              :rules="readonly ? [] : [required]"
            />
          </v-col>

          <v-col cols="12">
            <v-divider class="mb-2" />
            <div class="text-caption text-medium-emphasis mb-3">
              Asociaciones (opcional) — Indicá a qué materia prima o material de empaque pertenece este lote, y su proveedor/cliente.
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <paginated-select
              v-model="model.raw_material_id"
              label="Materia Prima"
              item-title="name"
              :load-fn="loadRawMaterials"
              :fetch-by-id-fn="(id) => rawMaterialsStore.getRawMaterial(Number(id))"
            />
          </v-col>

          <v-col cols="12" md="6">
            <paginated-select
              v-model="model.packaging_material_id"
              label="Material de Empaque"
              item-title="code"
              :load-fn="loadPackagingMaterials"
              :fetch-by-id-fn="(id) => packagingMaterialsStore.getPackagingMaterial(Number(id))"
            />
          </v-col>

          <v-col cols="12" md="6">
            <supplier-selector v-model="model.supplier_id" />
          </v-col>

          <v-col cols="12" md="6">
            <customer-selector v-model="model.customer_id" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Batch } from '@/types/batchs.types'
import type { VForm } from 'vuetify/components'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import PaginatedSelect from '@/components/PaginatedSelect.vue'
import CustomerSelector from '@/components/CustomerSelector.vue'
import SupplierSelector from '@/components/SupplierSelector.vue'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del lote' }
})

const model = defineModel<Batch>({ required: true })

const rawMaterialsStore = useRawMaterialsStore()
const packagingMaterialsStore = usePackagingMaterialsStore()

const required = (v: any) => (v !== null && v !== undefined && v !== '') || 'Campo requerido'

const formRef = ref<VForm>()

const loadRawMaterials = async (page: number, _search: string) => {
  const res = await rawMaterialsStore.getRawMaterials(page, 5)
  return { items: res.rawMaterials, total: res.total }
}

const loadPackagingMaterials = async (page: number, _search: string) => {
  const res = await packagingMaterialsStore.getPackagingMaterials(page, 5)
  return { items: res.packagingMaterials, total: res.total }
}

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
