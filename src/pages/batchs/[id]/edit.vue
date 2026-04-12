<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar Lote" subtitle="Modifique los datos del lote."
        :back-route="{ name: '/batchs/' }" back-text="Lotes">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <batch-form ref="batchFormRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import BatchForm from '@/components/BatchForm.vue'
import { useBatchsStore } from '@/stores/batchs.store'
import type { Batch } from '@/types/batchs.types'
import { useRouter } from 'vue-router'

definePage({
  props: true,
  meta: {
    permission: 'batchs:edit'
  }
})

const props = defineProps<{ id: string }>()
const router = useRouter()
const batchsStore = useBatchsStore()
const batchFormRef = ref()
const loading = ref(false)

const form = ref<Batch>({
  batch_number: 0,
  quantity: 0,
  expiration_date: '',
  raw_material_id: null,
  packaging_material_id: null,
  supplier_id: null,
  customer_id: null,
})

onMounted(async () => {
  loading.value = true
  try {
    const batch = await batchsStore.getBatch(Number(props.id))
    if (batch) {
      form.value = {
        batch_number: batch.batch_number,
        quantity: batch.quantity,
        expiration_date: batch.expiration_date
          ? new Date(batch.expiration_date).toISOString().split('T')[0]
          : '',
        raw_material_id: batch.raw_material_id ?? null,
        packaging_material_id: batch.packaging_material_id ?? null,
        supplier_id: batch.supplier_id ?? null,
        customer_id: batch.customer_id ?? null,
      }
    }
  } catch (error) {
    console.error('Error fetching batch:', error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await batchFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await batchsStore.update(Number(props.id), {
      batch_number: form.value.batch_number,
      quantity: form.value.quantity,
      expiration_date: form.value.expiration_date,
      raw_material_id: form.value.raw_material_id,
      packaging_material_id: form.value.packaging_material_id,
      supplier_id: form.value.supplier_id,
      customer_id: form.value.customer_id,
    })
    router.push({ name: '/batchs/' })
  } catch (error) {
    console.error('Error updating batch:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
