<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Nuevo cliente" subtitle="Complete el formulario para crear un nuevo cliente."
        :back-route="{name: '/customers/'}" back-text="Clientes">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <customer-form ref="customerFormRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import {useCustomersStore} from "@/stores/customers.store.ts";
import type { Customer } from '@/types/customers.types';

definePage({
  meta: {
    permission: 'customers:create'
  }
})

const router = useRouter()
const customersStore = useCustomersStore()

const loading = ref(false)

const customerFormRef = ref()

const form = ref<Customer>({
  name: '',
  tax_id: '',
  address: '',
  phone: '',
  email: ''
})

const handleSave = async () => {
  const { valid } = await customerFormRef.value.validate()
  if (!valid) return

  await customersStore.createCustomer(form.value)
  router.push({name:'/customers/'})
}

const handleCancel = router.back
</script>
