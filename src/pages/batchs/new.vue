<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Nuevo Lote" subtitle="Complete el formulario para crear un nuevo lote."
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

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BatchForm from '@/components/BatchForm.vue'
import { useBatchsStore } from '@/stores/batchs.store'
import type { Batch } from '@/types/batchs.types'

definePage({
  meta: {
    permission: 'batchs:create'
  }
})

const batchsStore = useBatchsStore()
const router = useRouter()
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

const handleSave = async () => {
  const { valid } = await batchFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await batchsStore.create(form.value)
    await router.push({ name: '/batchs/' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
