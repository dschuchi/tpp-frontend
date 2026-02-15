<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="model.name" label="Nombre" variant="outlined" :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="model.tax_id" label="CUIT/CUIL" variant="outlined" :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="model.address" label="Dirección" variant="outlined"
            :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="model.phone" label="Teléfono" variant="outlined"
            :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="model.email" label="Email" variant="outlined"
              :rules="readonly ? [] : [required, emailRule]" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { NewSupplierRequest, UpdateSupplierRequest } from '@/types/suppliers.types'
import type { VForm } from 'vuetify/components'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del proveedor' }
})

type SupplierFormModel = NewSupplierRequest & Partial<UpdateSupplierRequest>

const model = defineModel<SupplierFormModel>({ required: true })

const required = (v: string) => !!v || 'Campo requerido'
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'Correo inválido'

const formRef = ref<VForm>()

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
