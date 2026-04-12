<template>
  <v-row>
    <v-col cols="12">
      <page-header
        title="Editar Materia Prima"
        subtitle="Modifique los datos de la materia prima."
        :back-route="{ name: '/raw-materials/' }"
        back-text="Materias Primas"
      >
        <template #actions>
          <v-btn
            @click="handleCancel"
            :disabled="loading"
          > Cancelar </v-btn>
          <v-btn
            color="primary"
            @click="handleSave"
            :loading="loading"
          > Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <raw-material-form
        ref="rawMaterialFormRef"
        v-model="form"
        :readonly="loading"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import RawMaterialForm from '@/components/RawMaterialForm.vue'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import type { RawMaterial } from '@/types/rawMaterials.types'
import { useRouter } from 'vue-router'

definePage({
  props: true,
  meta: {
    permission: 'raw-materials:edit'
  }
})

const props = defineProps<{ id: string }>()
const router = useRouter()
const rawMaterialsStore = useRawMaterialsStore()
const rawMaterialFormRef = ref()
const loading = ref(false)

const form = ref<RawMaterial>({
  name: ''
})

onMounted(async () => {
  loading.value = true
  try {
    const rawMaterial = await rawMaterialsStore.getRawMaterial(Number(props.id))
    if (rawMaterial) {
      form.value.name = rawMaterial.name
      form.value.density = rawMaterial.density
    }
  } catch (error) {
    console.error('Error fetching raw material:', error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await rawMaterialFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await rawMaterialsStore.update(Number(props.id), form.value)
    router.push({ name: '/raw-materials/' })
  } catch (error) {
    console.error('Error updating raw material:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
