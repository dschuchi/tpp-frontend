<template>
  <v-card class="mb-4">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <supplier-selector v-model="model.supplierId" :rules="[required]" :readonly="readonly" />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="model.statusId"
              :items="statuses"
              item-title="name"
              item-value="id"
              label="Estado"
              variant="outlined"
              :rules="[required]"
              :readonly="readonly"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="model.scheduledDate"
              label="Fecha Programada"
              type="date"
              variant="outlined"
              clearable
              :readonly="readonly"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="model.receivedDate"
              label="Fecha de Recepción"
              type="date"
              variant="outlined"
              clearable
              :readonly="readonly"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="model.observation"
              label="Observaciones"
              variant="outlined"
              rows="3"
              :readonly="readonly"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>

  <v-card title="Ítems de Compra">
    <template #append>
      <v-btn v-if="!readonly" color="primary" variant="text" prepend-icon="mdi-plus" @click="openAddItemDialog" :disabled="readonly">
        Agregar Ítem
      </v-btn>
    </template>
    <v-card-text>
      <v-data-table
        :headers="itemsHeaders"
        :items="items"
        hover
      >
        <template #item.materialType="{ item }">
          <span v-if="item.materialType == 'raw_material'">MP</span>
          <span v-if="item.materialType == 'packaging_material'">ME</span>
        </template>
        <template #item.code="{ item }">
          {{ item.rawMaterialId ?? item.packagingMaterialId ?? 'Error' }}
        </template>
        <template #item.unitPrice="{ item }">
          ${{ item.unitPrice }}
        </template>
        <template #item.actions="{ index }">
          <div class="d-flex justify-end">
            <v-btn
              v-if="!readonly"
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              @click="removeItem(index)"
              :disabled="readonly"
            />
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="pa-4">Agregar Ítem</v-card-title>
      <v-card-text>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
        <v-form ref="itemFormRef">
          <v-row>
            <v-col cols="12">
              <raw-material-selector
                v-model="itemForm.rawMaterialId"
                clearable
                :disabled="!!itemForm.packagingMaterialId"
              />
            </v-col>
            <v-col cols="12">
              <packaging-material-selector
                v-model="itemForm.packagingMaterialId"
                clearable
                :disabled="!!itemForm.rawMaterialId"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="itemForm.quantity"
                label="Cantidad"
                type="number"
                :rules="[v => !!v || 'Requerido', v => v > 0 || 'Debe ser mayor a 0']"
                :readonly="savingItem"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="itemForm.unit"
                :items="['Unidades','Gramos', 'Litros']"
                label="Unidad"
                :rules="[v => !!v || 'Requerido']"
                :readonly="savingItem"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="itemForm.unitPrice"
                label="Precio Unitario"
                prefix="$"
                :rules="[v => !!v || 'Requerido']"
                :readonly="savingItem"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="closeDialog" :disabled="savingItem">Cancelar</v-btn>
        <v-btn color="primary" @click="handleAddItem" :loading="savingItem">Agregar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SupplierSelector from '@/components/SupplierSelector.vue'
import RawMaterialSelector from '@/components/RawMaterialSelector.vue'
import PackagingMaterialSelector from '@/components/PackagingMaterialSelector.vue'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import type { DataTableHeader } from 'vuetify'
import type { VForm } from 'vuetify/components'
import type { Purchase } from '@/models/purchase.model'
import type { PurchaseItem } from '@/models/purchase-item.model'


const props = defineProps({
  readonly: { type: Boolean, default: false }
})

const model = defineModel<Partial<Purchase>>({ required: true })
const items = defineModel<PurchaseItem[]>('items', { required: true })

const rawMaterialsStore = useRawMaterialsStore()
const packagingMaterialsStore = usePackagingMaterialsStore()

const statuses = [
  { id: 1, name: 'Pendiente' },
  { id: 2, name: 'En proceso' },
  { id: 3, name: 'Completado' },
  { id: 4, name: 'Cancelado' }
]

const formRef = ref<VForm>()
const itemFormRef = ref<VForm>()
const dialog = ref(false)
const savingItem = ref(false)
const errorMessage = ref('')

const itemsHeaders: DataTableHeader[] = [
  { title: 'Tipo', key: 'materialType' },
  { title: 'Codigo', key: 'code' },
  { title: 'Nombre', key: 'materialName' },
  { title: 'Cantidad', key: 'quantity' },
  { title: 'Unidad', key: 'unit' },
  { title: 'Precio Unit.', key: 'unitPrice' }
]

if (!props.readonly) {
  itemsHeaders.push({ title: 'Acciones', key: 'actions', align: 'end', sortable: false })
}

const emptyItemForm = (): PurchaseItem => ({
  id: 0,
  rawMaterialId: null,
  packagingMaterialId: null,
  materialName: '',
  materialType: 'raw_material',
  quantity: 0,
  unitPrice: 0
})

const itemForm = ref(emptyItemForm())

const openAddItemDialog = () => {
  itemForm.value = emptyItemForm()
  errorMessage.value = ''
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const handleAddItem = async () => {
  errorMessage.value = ''
  const { valid } = await itemFormRef.value!.validate()
  if (!valid) return
  if (!itemForm.value.rawMaterialId && !itemForm.value.packagingMaterialId) {
    errorMessage.value = 'Debe seleccionar una Materia Prima o un Material de Empaque.'
    return
  }
  if (itemForm.value.rawMaterialId && itemForm.value.packagingMaterialId) {
    errorMessage.value = 'Debe seleccionar una Materia Prima o un Material de Empaque.'
    return
  }

  savingItem.value = true
  try {
    if (itemForm.value.rawMaterialId) {
      const rm = await rawMaterialsStore.getRawMaterial(itemForm.value.rawMaterialId)
      itemForm.value.materialName = rm?.name
      itemForm.value.materialType = 'raw_material'
    }
    if (itemForm.value.packagingMaterialId) {
      const pm = await packagingMaterialsStore.getPackagingMaterial(itemForm.value.packagingMaterialId)
      itemForm.value.materialName = pm?.code
      itemForm.value.materialType = 'packaging_material'
    }

    items.value.push({
      rawMaterialId: itemForm.value.rawMaterialId,
      packagingMaterialId: itemForm.value.packagingMaterialId,
      quantity: itemForm.value.quantity,
      //unit: itemForm.value.unit,
      unitPrice: itemForm.value.unitPrice,
      id: itemForm.value.id,
      materialName: itemForm.value.materialName,
      materialType: itemForm.value.materialType
    })
    closeDialog()
  } catch (error) {
    console.error('Error al agregar ítem:', error)
  } finally {
    savingItem.value = false
  }
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
}

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })

const required = (v: any) => !!v || 'Campo requerido'
</script>
