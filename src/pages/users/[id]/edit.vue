<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar Usuario" subtitle="Modifique los datos del usuario." :back-route="{name: '/users/'}"
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
      <user-form ref="userFormRef" v-model="form" :readonly="loading" show-role show-password />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import UserForm from '@/components/UserForm.vue'
import { useSnackbarStore } from '@/stores/snackbar.store'
import { useUsersStore } from '@/stores/users.store'
import type { UpdateUserRequest } from '@/types/users.types'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

definePage({
  props: true,
  meta: {
    permission: 'users:edit:all'
  }
})

const props = defineProps<{ id: string }>()
const router = useRouter()
const usersStore = useUsersStore()
const userFormRef = ref()
const loading = ref(false)

const form = ref<UpdateUserRequest>({
  employee_id: '',
  username: '',
  lastname: '',
  email: '',
  password: undefined,
  rol_id: 0
})

onMounted(async () => {
  loading.value = true
  try {
    const user = await usersStore.getUser(props.id)
    if (user) {
      form.value.employee_id = user.employee_id
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

const snackbarStore = useSnackbarStore()

const handleSave = async () => {
  const { valid } = await userFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await usersStore.updateUser(props.id, form.value)
    router.push({name:'/users/'})
  } catch (error) {
    if (error instanceof AxiosError) {
      const {message} = error.response?.data
      snackbarStore.showMessage({
        message
      })
    } else {
      snackbarStore.showMessage({
        message: "Error inesperado"
      })
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = router.back
</script>
