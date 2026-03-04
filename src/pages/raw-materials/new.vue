<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Nueva Materia Prima" subtitle="Complete el formulario para crear una nueva materia prima."
        back-route="/raw-materials" back-text="Materias Primas">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <raw-material-form ref="rawMaterialFormRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import RawMaterialForm from '@/components/RawMaterialForm.vue'
import { useRawMaterialsStore } from '@/stores/rawMaterials.store'
import type { RawMaterial } from '@/types/rawMaterials.types'

definePage({
  meta: {
    permission: 'raw-materials:create'
  }
})

const rawMaterialsStore = useRawMaterialsStore()
const router = useRouter()
const rawMaterialFormRef = ref()

const loading = ref(false)

const form = ref<RawMaterial>({
  name: ''
})

const handleSave = async () => {
  const { valid } = await rawMaterialFormRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    await rawMaterialsStore.create(form.value)
    await router.push('/raw-materials')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
