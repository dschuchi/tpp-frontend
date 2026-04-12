<template>
  <v-row>
    <v-col cols="12">
      <page-header
        title="Nuevo Pedido de Cliente"
        subtitle="Complete los datos para registrar un pedido."
        back-route="/customer-orders"
        back-text="Pedidos de Clientes"
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
                <customer-selector v-model="form.customer_id" />
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
              <v-col cols="6" md="3">
                <v-text-field
                  v-model="form.total"
                  label="Total"
                  :rules="[v => !!v || 'Requerido']"
                  prefix="$"
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  v-model="form.tax"
                  label="Impuesto (%)"
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.estimated_date"
                  label="Fecha estimada de entrega"
                  type="date"
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.presentation"
                  label="Presentación"
                  placeholder="Ej: Caja x 100"
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.package_detail"
                  label="Detalle de empaque"
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox
                  v-model="form.inputs_provided_by_customer"
                  label="Insumos provistos por el cliente"
                  :readonly="loading"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.observations"
                  label="Observaciones"
                  rows="3"
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
import CustomerSelector from '@/components/CustomerSelector.vue'
import { useCustomerOrdersStore } from '@/stores/customerOrders.store'
import type { CustomerOrder } from '@/types/customerOrders.types'

definePage({
  meta: {
    permission: 'customer-orders:create'
  }
})

const ordersStore = useCustomerOrdersStore()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const loadingStatuses = ref(false)
const statuses = ref<any[]>([])

const form = ref<CustomerOrder>({
  customer_id: null as any,
  total: '',
  tax: '',
  presentation: '',
  package_detail: '',
  inputs_provided_by_customer: false,
  estimated_date: null,
  observations: '',
  status_id: null
})

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
  if (!valid) return

  loading.value = true
  try {
    const created = await ordersStore.create({
      ...form.value,
      estimated_date: form.value.estimated_date ? new Date(form.value.estimated_date).toISOString() : null
    })
    await router.push({ name: '/customer-orders/[id]/', params: { id: created.id! } })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => router.back()
</script>
