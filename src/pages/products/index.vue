<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Productos" subtitle="Administra los productos del sistema.">
        <template #actions>
          <v-btn v-if="can('products:create')" to="/products/new">
            Nuevo Producto
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        :headers="headers"
        :items="products"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.customer_id="{ item }">
          {{ item.customer_name }}
        </template>
        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip text="Fórmula (Materias Primas)" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('products:view')" v-bind="props" icon variant="text" size="small" color="secondary"
                  @click="goToRecipe(item.id)">
                  <v-icon icon="mdi-flask-outline" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Material de Empaque" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('products:view')" v-bind="props" icon variant="text" size="small" color="secondary"
                  @click="goToPackages(item.id)">
                  <v-icon icon="mdi-package-variant-closed" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('products:edit')" v-bind="props" icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'" @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('products:edit')" v-bind="props" icon variant="text" size="small" color="primary"
                  @click="editProduct(item.id)">
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import { useConfirm } from '@/composables/useConfirm'
import { useProductsStore } from '@/stores/products.store'
import { useCustomersStore } from '@/stores/customers.store'
import { useUserStore } from '@/stores/user.store'
import type { DataTableHeader } from 'vuetify'
import type { DataTableOptions } from '@/types/table.types'
import type { Product } from '@/types/products.types'

definePage({
  meta: {
    permission: 'products:view'
  }
})

const { can } = useUserStore()
const productsStore = useProductsStore()
const customersStore = useCustomersStore()

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'Cliente', key: 'customer_name' },
  { title: 'Versión', key: 'version' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const router = useRouter()
const editProduct = (id: any) => router.push({ name: '/products/[id]/edit', params: { id } })
const goToRecipe = (id: any) => router.push({ name: '/products/[id]/recipe/', params: { id } })
const goToPackages = (id: any) => router.push({ name: '/products/[id]/packages/', params: { id } })

const { confirm } = useConfirm()

const toggleStatus = async (item: any) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar producto' : 'Activar producto',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este producto?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? await productsStore.deactivate(id) : await productsStore.activate(id)
    item.is_active = !item.is_active
  }
}

const itemsPerPage = ref(10)
const products = ref<Product[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  const response = await productsStore.getProducts(page, itemsPerPage)

  products.value = await Promise.all(response.products.map(async (product) => {
    const customer = product.customer_id
      ? await customersStore.getCustomer(product.customer_id)
      : null

    return {
      ...product,
      customer_name: customer?.name ?? '-'
    }
  }))

  totalItems.value = response.total
  loading.value = false
}
</script>
