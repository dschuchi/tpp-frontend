<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar Material de Empaque" subtitle="Modifique los datos del material de empaque."
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

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import PackagingMaterialForm from '@/components/PackagingMaterialForm.vue'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import type { PackagingMaterial } from '@/types/packagingMaterials.types'

definePage({
  props: true,
  meta: {
    permission: 'packaging-materials:edit'
  }
})

const props = defineProps<{ id: string }>()
const router = useRouter()
const packagingMaterialsStore = usePackagingMaterialsStore()
const formRef = ref()
const loading = ref(false)

const form = ref<PackagingMaterial>({
  name: '',
  description: '',
  customer_id: null,
  supplier_id: null
})

onMounted(async () => {
  loading.value = true
  try {
    const item = await packagingMaterialsStore.getPackagingMaterial(Number(props.id))
    if (item) {
      form.value = {
        name: item.name,
        description: item.description ?? '',
        customer_id: item.customer_id,
        supplier_id: item.supplier_id
      }
    }
  } catch (error) {
    console.error('Error fetching package material:', error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await packagingMaterialsStore.update(Number(props.id), form.value)
    await router.push('/packaging-materials')
  } catch (error) {
    console.error('Error updating package material:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
