<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="model.name" label="Nombre" variant="outlined" :rules="readonly ? [] : [required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="model.description" label="Descripción" variant="outlined" />
          </v-col>
          <v-col cols="12" md="6">
            <customer-selector v-model="model.customer_id" :readonly="readonly" :clearable="!readonly" />
          </v-col>
          <v-col cols="12" md="6">
            <supplier-selector v-model="model.supplier_id" :readonly="readonly" :clearable="!readonly" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PackagingMaterial } from '@/types/packagingMaterials.types'
import type { VForm } from 'vuetify/components'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del material de empaque' }
})

const model = defineModel<PackagingMaterial>({ required: true })

const required = (v: string) => !!v || 'Campo requerido'

const formRef = ref<VForm>()

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
