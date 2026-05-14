<template>
  <v-row>
    <v-col cols="12">
      <page-header
        :title="`Fórmula: ${productName}`"
        subtitle="Materias primas utilizadas en este producto."
        :back-route="{ name: '/products/' }"
        back-text="Productos"
      >
        <template #actions>
          <v-btn v-if="can('products:create')" color="primary" @click="openAddDialog">
            Agregar Materia Prima
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        hover
      >
        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Activar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('products:delete')"
                  v-bind="props"
                  icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'"
                  @click="toggleItemStatus(item)"
                >
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('products:edit')"
                  v-bind="props"
                  icon variant="text" size="small" color="primary"
                  @click="openEditDialog(item)"
                >
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="pa-4">
        {{ editingId ? 'Editar Materia Prima' : 'Agregar Materia Prima' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row>
            <v-col cols="12">
              <paginated-select
                v-model="form.raw_material_id"
                label="Materia Prima"
                item-title="name"
                :load-fn="loadRawMaterials"
                :fetch-by-id-fn="(id) => rawMaterialsStore.getRawMaterial(Number(id))"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="form.percentage"
                label="Porcentaje"
                type="number"
                :rules="[v => !!v || 'Requerido', v => v > 0 || 'Debe ser mayor a 0', v => v <= 100 || 'Debe ser menor o igual a 100']"
                :readonly="saving"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.observation"
                label="Observación"
                :rules="[v => !!v || 'Requerido']"
                :readonly="saving"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="closeDialog" :disabled="saving">Cancelar</v-btn>
        <v-btn color="primary" @click="handleSave" :loading="saving">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import PaginatedSelect from '@/components/PaginatedSelect.vue'
import { useProductRecipeStore } from '@/stores/productRecipe.store'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import { useUserStore } from '@/stores/user.store'
import { useConfirm } from '@/composables/useConfirm'
import type { ProductRecipeItem } from '@/types/productRecipe.types'
import type { DataTableHeader } from 'vuetify'

definePage({
  props: true,
  meta: {
    permission: 'products:view'
  }
})

const props = defineProps<{ id: string }>()
const { can } = useUserStore()
const recipeStore = useProductRecipeStore()
const rawMaterialsStore = useRawMaterialsStore()

const headers: DataTableHeader[] = [
  { title: 'Materia Prima', key: 'raw_material_name' },
  { title: 'Porcentaje', key: 'percentage' },
  { title: 'Observación', key: 'observation' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const productName = ref('')
const items = ref<ProductRecipeItem[]>([])
const loading = ref(true)
const dialog = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref()

const emptyForm = () => ({ raw_material_id: null as number | null, percentage: 0, observation: '' })
const form = ref(emptyForm())

const loadRawMaterials = async (page: number, search: string) => {
  const res = await rawMaterialsStore.getRawMaterials(page, 5)
  return { items: res.rawMaterials, total: res.total }
}

const loadRecipe = async () => {
  loading.value = true
  try {
    const recipe = await recipeStore.getRecipeByProductId(Number(props.id))
    productName.value = recipe?.product_name ?? `#${props.id}`
    items.value = recipe?.items ?? []
  } catch (error) {
    console.error('Error cargando fórmula:', error)
    productName.value = `#${props.id}`
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadRecipe)

const openAddDialog = () => {
  editingId.value = null
  form.value = emptyForm()
  dialog.value = true
}

const openEditDialog = (item: ProductRecipeItem) => {
  editingId.value = item.id ?? null
  form.value = {
    raw_material_id: item.raw_material_id,
    percentage: item.percentage,
    observation: item.observation
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid || !form.value.raw_material_id) return

  saving.value = true
  try {
    if (editingId.value) {
      await recipeStore.updateRecipeItem(editingId.value, {
        raw_material_id: form.value.raw_material_id,
        percentage: form.value.percentage,
        observation: form.value.observation
      })
    } else {
      await recipeStore.createRecipeItems(Number(props.id), [{
        raw_material_id: form.value.raw_material_id!,
        percentage: form.value.percentage,
        observation: form.value.observation
      }])
    }
    closeDialog()
    await loadRecipe()
  } catch (error) {
    console.error('Error guardando:', error)
  } finally {
    saving.value = false
  }
}

const { confirm } = useConfirm()

const toggleItemStatus = async (item: ProductRecipeItem) => {
  const isDeactivating = item.is_active
  const ok = await confirm({
    title: isDeactivating ? 'Desactivar ingrediente' : 'Activar ingrediente',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} esta materia prima de la fórmula?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })
  if (ok && item.id) {
    isDeactivating
      ? await recipeStore.deactivateRecipeItem(item.id)
      : await recipeStore.activateRecipeItem(item.id)
    await loadRecipe()
  }
}
</script>
