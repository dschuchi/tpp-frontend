<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="model.name"
              label="Nombre del cliente"
              variant="outlined"
              :rules="[required]"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="model.tax_id"
              label="CUIT/CUIL"
              variant="outlined"
              rows="2"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="model.address"
              label="Dirección"
              variant="outlined"
              rows="2"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="model.phone"
              label="Teléfono"
              variant="outlined"
              rows="2"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="model.email"
              label="Email"
              variant="outlined"
              rows="2"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import type {Customer} from "@/types/customers.types.ts";

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del cliente' }
})

const model = defineModel<Customer>({ required: true })

const required = (v: string) => !!v || 'Campo requerido'

const formRef = ref<VForm>()

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
