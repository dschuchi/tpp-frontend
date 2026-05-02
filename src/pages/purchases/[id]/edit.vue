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
import type { Purchase, PurchaseFormItem } from '@/types/purchases.types'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'

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
        ...purchase
      }
      items.value = purchase.purchase_items
    }
  } catch (error) {
    console.error("Error cargando compra", error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await purchaseFormRef.value.validate()
  if (!valid || !form.value.supplier_id) return

  loading.value = true
  try {
    const payload = {
      ...form.value,
      scheduled_date: form.value.scheduled_date ? new Date(form.value.scheduled_date).toISOString() : undefined,
      received_date: form.value.received_date ? new Date(form.value.received_date).toISOString() : undefined,
      purchase_items: items.value.map(i => ({
        raw_material_id: i.raw_material_id || undefined,
        packaging_material_id: i.packaging_material_id || undefined,
        quantity: i.quantity,
        unit_price: i.unit_price
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
