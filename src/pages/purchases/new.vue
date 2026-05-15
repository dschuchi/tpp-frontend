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
import type { Purchase } from '@/models/purchase.model'
import type { PurchaseItem } from '@/models/purchase-item.model'


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
  supplierId: undefined,
  statusId: undefined,
  observation: '',
  scheduledDate: undefined,
  receivedDate: undefined,
  items: []
})

const items = ref<PurchaseItem[]>([])

const handleSave = async () => {
  const { valid } = await purchaseFormRef.value.validate()
  if (!valid || !form.value.supplierId) return

  loading.value = true
  try {
    await purchasesStore.create(form.value)
    await router.push('/purchases')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => router.back()
</script>
