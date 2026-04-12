<template>
  <v-row>
    <v-col cols="12">
      <page-header
        :title="`Materiales de Empaque: ${productName}`"
        subtitle="Materiales de empaque asociados a este producto."
        :back-route="{ name: '/products/' }"
        back-text="Productos"
      >
        <template #actions>
          <v-btn v-if="can('products:create')" color="primary" @click="openAddDialog">
            Agregar Material de Empaque
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
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip text="Quitar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('products:delete')"
                  v-bind="props"
                  icon variant="text" size="small" color="error"
                  @click="removeItem(item)"
                >
                  <v-icon icon="mdi-delete" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="pa-4">Agregar Material de Empaque</v-card-title>
      <v-card-text>
        <paginated-select
          v-model="selectedPackagingMaterialId"
          label="Material de Empaque"
          item-title="code"
          :load-fn="loadPackagingMaterials"
          :fetch-by-id-fn="(id) => packagingMaterialsStore.getPackagingMaterial(Number(id))"
        />
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="closeDialog" :disabled="saving">Cancelar</v-btn>
        <v-btn color="primary" @click="handleAdd" :loading="saving" :disabled="!selectedPackagingMaterialId">
          Agregar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import PaginatedSelect from '@/components/PaginatedSelect.vue'
import { useProductRecipeStore } from '@/stores/productRecipe.store'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import { useProductsStore } from '@/stores/products.store'
import { useUserStore } from '@/stores/user.store'
import { useConfirm } from '@/composables/useConfirm'
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
const packagingMaterialsStore = usePackagingMaterialsStore()
const productsStore = useProductsStore()

const headers: DataTableHeader[] = [
  { title: 'Código', key: 'packaging_material_code' },
  { title: 'Descripción', key: 'packaging_material_description' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const productName = ref('')
const items = ref<any[]>([])
const loading = ref(true)
const dialog = ref(false)
const saving = ref(false)
const selectedPackagingMaterialId = ref<number | null>(null)

const loadPackagingMaterials = async (page: number, _search: string) => {
  const res = await packagingMaterialsStore.getPackagingMaterials(page, 5)
  return { items: res.packagingMaterials, total: res.total }
}

const loadData = async () => {
  loading.value = true
  try {
    const [product, packageMaterials] = await Promise.all([
      productsStore.getProduct(Number(props.id)),
      recipeStore.getPackageMaterialsByProductId(Number(props.id))
    ])
    productName.value = product?.name ?? `#${props.id}`
    items.value = packageMaterials ?? []
  } catch (error) {
    console.error('Error cargando materiales de empaque:', error)
    productName.value = `#${props.id}`
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const openAddDialog = () => {
  selectedPackagingMaterialId.value = null
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const handleAdd = async () => {
  if (!selectedPackagingMaterialId.value) return
  saving.value = true
  try {
    await recipeStore.addPackageMaterial(Number(props.id), selectedPackagingMaterialId.value)
    closeDialog()
    await loadData()
  } catch (error) {
    console.error('Error agregando material de empaque:', error)
  } finally {
    saving.value = false
  }
}

const { confirm } = useConfirm()

const removeItem = async (item: any) => {
  const ok = await confirm({
    title: 'Quitar material de empaque',
    message: '¿Estás seguro de que querés quitar este material de empaque del producto?',
    confirmText: 'Quitar',
    confirmColor: 'error'
  })
  if (ok && item.id) {
    await recipeStore.removePackageMaterial(item.id)
    await loadData()
  }
}
</script>
