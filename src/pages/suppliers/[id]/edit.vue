<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar Proveedor" subtitle="Modifique los datos del proveedor." :back-route="{name:'/suppliers/'}"
        back-text="Proveedores">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <supplier-form ref="supplierFormRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import SupplierForm from '@/components/SupplierForm.vue'
import { useSuppliersStore } from '@/stores/suppliers.store'
import type { UpdateSupplierRequest } from '@/types/suppliers.types'
import { useRouter } from 'vue-router'

definePage({
  props: true,
  meta: {
    permission: 'suppliers:edit'
  }
})

const props = defineProps<{ id: string }>()
const router = useRouter()
const suppliersStore = useSuppliersStore()
const supplierFormRef = ref()
const loading = ref(false)

const form = ref<UpdateSupplierRequest>({
  name: '',
  tax_id: '',
  email: '',
  phone: '',
  address: ''
})

onMounted(async () => {
  loading.value = true
  try {
    const supplier = await suppliersStore.getSupplier(Number(props.id))
    if (supplier) {
      form.value.name = supplier.name
      form.value.tax_id = supplier.tax_id
      form.value.email = supplier.email
      form.value.phone = supplier.phone
      form.value.address = supplier.address
    }
  } catch (error) {
    console.error('Error fetching supplier:', error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await supplierFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await suppliersStore.update(Number(props.id), form.value)
    router.push({name:'/suppliers/'})
  } catch (error) {
    console.error('Error updating supplier:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
