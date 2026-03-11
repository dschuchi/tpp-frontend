<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Nuevo Material de Empaque" subtitle="Complete el formulario para crear un nuevo material de empaque."
        back-route="/packaging-materials" back-text="Materiales de Empaque">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <packaging-material-form ref="formRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import PackagingMaterialForm from '@/components/PackagingMaterialForm.vue'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import type { PackagingMaterial } from '@/types/packagingMaterials.types'

definePage({
  meta: {
    permission: 'packaging-materials:create'
  }
})

const packagingMaterialsStore = usePackagingMaterialsStore()
const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = ref<PackagingMaterial>({
  code: '',
  description: '',
  customer_id: null,
  supplier_id: null
})

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await packagingMaterialsStore.create(form.value)
    await router.push('/packaging-materials')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
