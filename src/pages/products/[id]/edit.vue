<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar Producto" subtitle="Modifique los datos del producto."
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

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import ProductForm from '@/components/ProductForm.vue'
import { useProductsStore } from '@/stores/products.store'
import type { Product } from '@/types/products.types'

definePage({
  props: true,
  meta: {
    permission: 'products:edit'
  }
})

const props = defineProps<{ id: string }>()
const router = useRouter()
const productsStore = useProductsStore()
const productFormRef = ref()
const loading = ref(false)

const form = ref<Product>({
  name: '',
  customer_id: null,
  version: '',
  observaciones: ''
})

onMounted(async () => {
  loading.value = true
  try {
    const product = await productsStore.getProduct(Number(props.id))
    if (product) {
      form.value = {
        name: product.name,
        customer_id: product.customer_id,
        version: product.version,
        observaciones: product.observaciones ?? ''
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await productFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await productsStore.update(Number(props.id), form.value)
    router.push('/products')
  } catch (error) {
    console.error('Error updating product:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
