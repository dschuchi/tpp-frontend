<template>
  <v-row>
    <v-col cols="12">
      <page-header
        title="Nueva Compra"
        subtitle="Complete el formulario para crear una nueva orden de compra."
        back-route="/purchases"
        back-text="Compras"
      >
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card class="mb-4">
        <v-card-text>
          <v-form ref="formRef" @submit.prevent>
            <v-row>
              <v-col cols="12">
                <supplier-selector v-model="form.supplier_id" :rules="[required]" :readonly="loading" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.scheduled_date"
                  label="Fecha Programada"
                  type="date"
                  variant="outlined"
                  clearable
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.received_date"
                  label="Fecha de Recepción"
                  type="date"
                  variant="outlined"
                  clearable
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.observation"
                  label="Observaciones"
                  variant="outlined"
                  rows="3"
                  :readonly="loading"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <v-card title="Ítems de Compra">
        <template #append>
          <v-btn color="primary" variant="text" prepend-icon="mdi-plus" @click="openAddItemDialog" :disabled="loading">
            Agregar Ítem
          </v-btn>
        </template>
        <v-card-text>
          <v-data-table
            :headers="itemsHeaders"
            :items="items"
            hover
          >
            <template #item.unit_price="{ item }">
              ${{ item.unit_price }}
            </template>
            <template #item.actions="{ index }">
              <div class="d-flex justify-end">
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  size="small"
                  @click="removeItem(index)"
                  :disabled="loading"
                />
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="pa-4">Agregar Ítem</v-card-title>
      <v-card-text>
        <v-form ref="itemFormRef">
          <v-row>
            <v-col cols="12" md="6">
              <raw-material-selector
                v-model="itemForm.raw_material_id"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <packaging-material-selector
                v-model="itemForm.packaging_material_id"
                clearable
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
              <v-text-field
                v-model="itemForm.unit_price"
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
import PageHeader from '@/components/PageHeader.vue'
import SupplierSelector from '@/components/SupplierSelector.vue'
import RawMaterialSelector from '@/components/RawMaterialSelector.vue'
import PackagingMaterialSelector from '@/components/PackagingMaterialSelector.vue'
import { usePurchasesStore } from '@/stores/purchases.store'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import type { Purchase } from '@/types/purchases.types'
import type { DataTableHeader } from 'vuetify'

definePage({
  meta: {
    permission: "purchases:create"
  }
})

const purchasesStore = usePurchasesStore()
const rawMaterialsStore = useRawMaterialsStore()
const packagingMaterialsStore = usePackagingMaterialsStore()
const router = useRouter()

const formRef = ref()
const itemFormRef = ref()
const loading = ref(false)
const dialog = ref(false)
const savingItem = ref(false)

const form = ref<Partial<Purchase>>({
  supplier_id: undefined,
  scheduled_date: '',
  received_date: '',
  observation: '',
  status_id: 1
})

interface LocalItem {
  raw_material_id?: number | null
  raw_material_name?: string
  packaging_material_id?: number | null
  packaging_material_name?: string
  unit_price: string
  quantity: number
}

const items = ref<LocalItem[]>([])

const itemsHeaders: DataTableHeader[] = [
  { title: 'Materia Prima', key: 'raw_material_name' },
  { title: 'Mat. Empaque', key: 'packaging_material_name' },
  { title: 'Cantidad', key: 'quantity' },
  { title: 'Precio Unit.', key: 'unit_price' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const emptyItemForm = () => ({
  raw_material_id: null as number | null,
  packaging_material_id: null as number | null,
  quantity: 0,
  unit_price: ''
})

const itemForm = ref(emptyItemForm())

const openAddItemDialog = () => {
  itemForm.value = emptyItemForm()
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const handleAddItem = async () => {
  const { valid } = await itemFormRef.value.validate()
  if (!valid) return
  if (!itemForm.value.raw_material_id && !itemForm.value.packaging_material_id) {
    alert('Debe seleccionar una Materia Prima o un Material de Empaque.')
    return
  }

  savingItem.value = true
  try {
    let raw_material_name = ''
    let packaging_material_name = ''

    if (itemForm.value.raw_material_id) {
      const rm = await rawMaterialsStore.getRawMaterial(itemForm.value.raw_material_id)
      raw_material_name = rm?.name ?? ''
    }
    if (itemForm.value.packaging_material_id) {
      const pm = await packagingMaterialsStore.getPackagingMaterial(itemForm.value.packaging_material_id)
      packaging_material_name = pm?.code ?? pm?.name ?? ''
    }

    items.value.push({
      raw_material_id: itemForm.value.raw_material_id,
      raw_material_name,
      packaging_material_id: itemForm.value.packaging_material_id,
      packaging_material_name,
      quantity: itemForm.value.quantity,
      unit_price: itemForm.value.unit_price
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

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid || !form.value.supplier_id) return

  loading.value = true
  try {
    const payload = {
      ...form.value,
      scheduled_date: form.value.scheduled_date ? new Date(form.value.scheduled_date).toISOString() : null,
      received_date: form.value.received_date ? new Date(form.value.received_date).toISOString() : null,
      purchase_items: items.value.map(i => ({
        raw_material_id: i.raw_material_id || undefined,
        packaging_material_id: i.packaging_material_id || undefined,
        quantity: i.quantity,
        unit_price: i.unit_price
      }))
    }

    await purchasesStore.create(payload)
    await router.push('/purchases')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => router.back()
const required = (v: any) => !!v || 'Campo requerido'
</script>
