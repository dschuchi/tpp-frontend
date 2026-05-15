<template>
  <v-row>
    <v-col cols="12">
      <page-header
        title="Editar Compra"
        subtitle="Modifique los datos de la orden de compra."
        :back-route="{name:'/purchases/'}"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PurchaseForm from '@/components/PurchaseForm.vue'
import { usePurchasesStore } from '@/stores/purchases.store'
import type { Purchase } from '@/models/purchase.model'
import type { PurchaseItem } from '@/models/purchase-item.model'


definePage({
  props: true,
  meta: {
    permission: 'purchases:edit'
  }
})

const props = defineProps<{ id: string }>()

const router = useRouter()
const purchasesStore = usePurchasesStore()

const purchaseFormRef = ref()
const loading = ref(false)

const form = ref<Partial<Purchase>>({})

const items = ref<PurchaseItem[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const purchase = await purchasesStore.getPurchase(Number(props.id))
    if (purchase) {
      form.value = {
        ...purchase
      }
      items.value = purchase.items
    }
  } catch (error) {
    console.error("Error cargando compra", error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await purchaseFormRef.value.validate()
  if (!valid || !form.value.supplierId) return

  loading.value = true
  try {
    const payload = {
      ...form.value,
      scheduled_date: form.value.scheduledDate ? new Date(form.value.scheduledDate).toISOString() : undefined,
      received_date: form.value.receivedDate ? new Date(form.value.receivedDate).toISOString() : undefined,
      purchase_items: items.value.map(i => ({
        raw_material_id: i.rawMaterialId || undefined,
        packaging_material_id: i.packagingMaterialId || undefined,
        quantity: i.quantity,
        unit_price: i.unitPrice
      }))
    }

    await purchasesStore.update(Number(props.id), payload)
    await router.push({ name: '/purchases/' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
