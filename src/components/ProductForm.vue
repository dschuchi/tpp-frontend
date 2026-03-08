<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="model.name" label="Nombre" variant="outlined" :rules="readonly ? [] : [required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="model.version" label="Versión" variant="outlined" :rules="readonly ? [] : [required]" />
          </v-col>
          <v-col cols="12">
            <customer-selector v-model="model.customer_id" :rules="readonly ? [] : [requiredSelect]" :readonly="readonly" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="model.observaciones" label="Observaciones" variant="outlined" rows="3" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from '@/types/products.types'
import type { VForm } from 'vuetify/components'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del producto' }
})

const model = defineModel<Product>({ required: true })

const required = (v: string) => !!v || 'Campo requerido'
const requiredSelect = (v: number | null) => !!v || 'Campo requerido'

const formRef = ref<VForm>()

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
