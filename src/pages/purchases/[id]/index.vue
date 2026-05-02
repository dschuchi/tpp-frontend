<template>
  <v-row>
    <v-col cols="12">
      <page-header
        title="Detalle de Compra"
        subtitle="Visualice los datos de la orden de compra."
        :back-route="{ name: '/purchases/' }"
        back-text="Compras"
      >
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <purchase-form
        v-model="form"
        v-model:items="items"
        :readonly="true"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import PurchaseForm from '@/components/PurchaseForm.vue'
import { usePurchasesStore } from '@/stores/purchases.store'
import type { Purchase, PurchaseFormItem } from '@/types/purchases.types'

definePage({
  props: true,
  meta: {
    permission: 'purchases:view'
  }
})

const props = defineProps<{ id: string }>()

const purchasesStore = usePurchasesStore()

const loading = ref(false)

const form = ref<Partial<Purchase>>({
  supplier_id: undefined,
  scheduled_date: '',
  received_date: '',
  observation: '',
  status_id: 1
})

const items = ref<PurchaseFormItem[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const purchase = await purchasesStore.getPurchase(Number(props.id))
    if (purchase) {
      form.value = {
        ...purchase,
      }

      items.value = purchase.purchase_items
    }
  } catch (error) {
    console.error("Error cargando compra", error)
  } finally {
    loading.value = false
  }
})
</script>
