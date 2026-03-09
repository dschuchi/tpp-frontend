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
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" />

      <v-data-table :headers="headers" :items="productsStore.products" :search="search">
        <template #item.customer_id="{ item }">
          {{ customerName(item.customer_id) }}
        </template>
        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
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
      </v-data-table>
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

definePage({
  meta: {
    permission: 'products:view'
  }
})

const { can } = useUserStore()
const productsStore = useProductsStore()
const customersStore = useCustomersStore()
const search = ref('')

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'Cliente', key: 'customer_id' },
  { title: 'Versión', key: 'version' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

onMounted(() => {
  productsStore.getProducts()
  if (!customersStore.customers.length) {
    customersStore.getCustomers()
  }
})

const customerName = (id: number | null) => {
  if (!id) return '-'
  return customersStore.customers.find(c => c.id === id)?.name ?? '-'
}

const router = useRouter()
const editProduct = (id: any) => router.push({ name: '/products/[id]/edit', params: { id } })

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
  }
}
</script>
