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
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PurchaseForm from '@/components/PurchaseForm.vue'
import { usePurchasesStore } from '@/stores/purchases.store'
import type { Purchase, PurchaseFormItem } from '@/types/purchases.types'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import { useUserStore } from '@/stores/user.store'

definePage({
  props: true,
  meta: {
    permission: 'purchases:view'
  }
})

const props = defineProps<{ id: string }>()

const router = useRouter()
const purchasesStore = usePurchasesStore()
const rawMaterialsStore = useRawMaterialsStore()
const packagingMaterialsStore = usePackagingMaterialsStore()
const { can } = useUserStore()

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
        scheduled_date: purchase.scheduled_date ? new Date(purchase.scheduled_date).toISOString().split('T')[0] : '',
        received_date: purchase.received_date ? new Date(purchase.received_date).toISOString().split('T')[0] : '',
      }

      const loadedItems: PurchaseFormItem[] = []
      for (const item of purchase.purchase_items) {
        let raw_material_name = ''
        let packaging_material_name = ''

        if (item.raw_material_id) {
          try {
            const rm = await rawMaterialsStore.getRawMaterial(item.raw_material_id)
            raw_material_name = rm?.name || ''
          } catch (e) { }
        }

        if (item.packaging_material_id) {
          try {
            const pm = await packagingMaterialsStore.getPackagingMaterial(item.packaging_material_id)
            packaging_material_name = pm?.code || ''
          } catch (e) { }
        }

        loadedItems.push({
          raw_material_id: item.raw_material_id,
          raw_material_name,
          packaging_material_id: item.packaging_material_id,
          packaging_material_name,
          quantity: item.quantity,
          unit_price: item.unit_price
        })
      }

      items.value = loadedItems
    }
  } catch (error) {
    console.error("Error cargando compra", error)
  } finally {
    loading.value = false
  }
})
</script>
