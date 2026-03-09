<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Nuevo Producto" subtitle="Complete el formulario para crear un nuevo producto."
        back-route="/products" back-text="Productos">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <product-form ref="productFormRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import ProductForm from '@/components/ProductForm.vue'
import { useProductsStore } from '@/stores/products.store'
import type { Product } from '@/types/products.types'

definePage({
  meta: {
    permission: 'products:create'
  }
})

const productsStore = useProductsStore()
const router = useRouter()
const productFormRef = ref()
const loading = ref(false)

const form = ref<Product>({
  name: '',
  customer_id: null,
  version: '',
  observaciones: ''
})

const handleSave = async () => {
  const { valid } = await productFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await productsStore.create(form.value)
    await router.push('/products')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
