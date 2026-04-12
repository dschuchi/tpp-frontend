<template>
  <v-row>
    <v-col cols="12">
      <page-header
        title="Nuevo Pedido de Producción"
        subtitle="Complete los datos para registrar un pedido de producción."
        back-route="/product-orders"
        back-text="Pedidos de Producción"
      >
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading">Cancelar</v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading">Guardar</v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" md="6">
                <paginated-select
                  v-model="form.product_id"
                  label="Producto *"
                  item-title="name"
                  :load-fn="loadProducts"
                  :fetch-by-id-fn="(id) => productsStore.getProduct(Number(id))"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.status_id"
                  :items="statuses"
                  item-title="name"
                  item-value="id"
                  label="Estado"
                  clearable
                  :loading="loadingStatuses"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.quantity"
                  label="Cantidad a producir *"
                  type="number"
                  :rules="[v => !!v || 'Requerido', v => v > 0 || 'Debe ser mayor a 0']"
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.customer_order_id"
                  label="N° Pedido de cliente (opcional)"
                  type="number"
                  hint="Si este pedido se origina en un pedido de cliente, ingresá su número."
                  :readonly="loading"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import PaginatedSelect from '@/components/PaginatedSelect.vue'
import { useProductOrdersStore } from '@/stores/productOrders.store'
import { useProductsStore } from '@/stores/products.store'
import type { ProductOrder } from '@/types/productOrders.types'

definePage({
  meta: {
    permission: 'product-orders:create'
  }
})

const ordersStore = useProductOrdersStore()
const productsStore = useProductsStore()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const loadingStatuses = ref(false)
const statuses = ref<any[]>([])

const form = ref<ProductOrder>({
  product_id: null as any,
  quantity: null as any,
  customer_order_id: null,
  status_id: null
})

const loadProducts = async (page: number, _search: string) => {
  const res = await productsStore.getProducts(page, 5)
  return { items: res.products, total: res.total }
}

onMounted(async () => {
  loadingStatuses.value = true
  try {
    statuses.value = await ordersStore.getStatuses()
  } finally {
    loadingStatuses.value = false
  }
})

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid || !form.value.product_id) return

  loading.value = true
  try {
    const created = await ordersStore.create({
      ...form.value,
      customer_order_id: form.value.customer_order_id || null
    })
    await router.push({ name: '/product-orders/[id]/', params: { id: created.id! } })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => router.back()
</script>
