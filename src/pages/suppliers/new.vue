<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Nuevo proveedor" subtitle="Complete el formulario para crear un nuevo proveedor."
        :back-route="{name:'/suppliers/'}" back-text="Proveedores">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </PageHeader>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <SupplierForm ref="supplierFormRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import SupplierForm from '@/components/SupplierForm.vue'
import { useSuppliersStore } from '@/stores/suppliers.store'
import type { NewSupplierRequest } from '@/types/suppliers.types'

definePage({
  meta: {
    permission: 'suppliers:create'
  }
})

const suppliersStore = useSuppliersStore()
const router = useRouter()
const supplierFormRef = ref()

const loading = ref(false)

const form = ref<NewSupplierRequest>({
  name: '',
  tax_id: '',
  email: '',
  phone: '',
  address: ''
})

const handleSave = async () => {
  const { valid } = await supplierFormRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    await suppliersStore.create(form.value)
    router.push({name:'/suppliers/'})
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
