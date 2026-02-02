<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar Usuario" subtitle="Modifique los datos del usuario." back-route="/usuarios"
        back-text="Usuarios">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <user-form ref="userFormRef" v-model="form" :readonly="loading" show-auth-fields />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users.store'
import type { UpdateUserRequest } from '@/types/users.types'
import { useRouter } from 'vue-router'

definePage({
  props: true,
  meta: {
    permission: '*'
  }
})

const props = defineProps<{ id: string }>()
const router = useRouter()
const usersStore = useUsersStore()
const userFormRef = ref()
const loading = ref(false)

const form = ref<UpdateUserRequest>({
  username: '',
  lastname: '',
  email: '',
  password: '',
  rol_id: 0
})

onMounted(async () => {
  loading.value = true
  try {
    const user = await usersStore.getUser(props.id)
    if (user) {
      form.value.username = user.username
      form.value.lastname = user.lastname
      form.value.email = user.email
      form.value.rol_id = Number(user.rol_id)
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await userFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await usersStore.updateUser(props.id, form.value)
    router.push('/usuarios')
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
