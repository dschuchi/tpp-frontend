<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar cliente" subtitle="Modifique los datos del cliente."
                  back-route="/customers" back-text="Clientes">
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

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { useRouter } from 'vue-router'
import type {Customer} from "@/types/customers.types.ts";
import {useCustomersStore} from "@/stores/customers.store.ts";
import {ref} from "vue";

definePage({
  props: true,
  meta: {
    permission: 'customers:edit'
  }
})

const props = defineProps<{ id: string }>()

const router = useRouter()
const customerFormRef = ref()

const loading = ref(false)

const form = ref<Customer>({
  name: '',
  tax_id: '',
  address: '',
  phone: '',
  email: ''
})

const customersStore = useCustomersStore()

onMounted(async () => {
  loading.value = true

  try {
    const customer = await customersStore.getCustomer(Number(props.id))

    if (customer) {
      form.value = { ...customer }
    }

  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await customerFormRef.value.validate()
  if (!valid) return

  await customersStore.updateCustomer(Number(props.id), form.value)
  router.push({ name: '/customers/' })
}

const handleCancel = router.back
</script>
