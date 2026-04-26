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
      <purchase-form
        ref="purchaseFormRef"
        v-model="form"
        v-model:items="items"
        :readonly="loading"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PurchaseForm from '@/components/PurchaseForm.vue'
import { usePurchasesStore } from '@/stores/purchases.store'
import type { Purchase, PurchaseFormItem } from '@/types/purchases.types'

definePage({
  meta: {
    permission: "purchases:create"
  }
})

const purchasesStore = usePurchasesStore()
const router = useRouter()

const purchaseFormRef = ref()
const loading = ref(false)

const form = ref<Partial<Purchase>>({
  supplier_id: undefined,
  scheduled_date: '',
  received_date: '',
  observation: '',
  status_id: 1
})

const items = ref<PurchaseFormItem[]>([])

const handleSave = async () => {
  const { valid } = await purchaseFormRef.value.validate()
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
</script>
