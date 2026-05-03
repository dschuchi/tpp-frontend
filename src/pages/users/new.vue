<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Nuevo usuario" subtitle="Complete el formulario para crear un nuevo usuario."
        :back-route='{name:"/users/"}' back-text="Usuarios">
        <template #actions>
          <v-btn @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave" :loading="loading"> Guardar </v-btn>
        </template>
      </PageHeader>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <UserForm ref="userFormRef" v-model="form" :readonly="loading" />
    </v-col>
  </v-row>

  <v-dialog v-model="showPasswordDialog" persistent max-width="500">
    <v-card prepend-icon="$info" title="Usuario creado exitosamente">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <p>
              El sistema ha generado la siguiente contraseña inical.
              <strong>Cópiala ahora, no podrás verla nuevamente.</strong>
            </p>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="generatedPassword" label="Contraseña inicial" variant="outlined" readonly
              append-inner-icon="mdi-content-copy" @click:append-inner="copyToClipboard" hide-details></v-text-field>
          </v-col>
          <v-slide-y-transition>
            <v-col cols="12" v-if="copied">
              <v-alert type="success" variant="tonal" density="compact" icon="mdi-clipboard-check">
                ¡Contraseña copiada al portapapeles!
              </v-alert>
            </v-col>
          </v-slide-y-transition>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" variant="elevated" size="large" @click="closeAndRedirect">
          Entendido, ir al listado
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users.store'
import type { CreateUserRequest } from '@/types/users.types'
import { useSnackbarStore } from '@/stores/snackbar.store'
import { AxiosError } from 'axios'

definePage({
  meta: {
    permission: 'users:create'
  }
})

const usersStore = useUsersStore()
const router = useRouter()
const userFormRef = ref()

const loading = ref(false)
const showPasswordDialog = ref(false)
const generatedPassword = ref('')
const copied = ref(false)

const form = ref<CreateUserRequest>({
  employee_id: '',
  username: '',
  lastname: '',
  email: ''
})

const snackbarStore = useSnackbarStore()

const handleSave = async () => {
  const { valid } = await userFormRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const response = await usersStore.createUser(form.value)
    generatedPassword.value = response.password
    showPasswordDialog.value = true
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

const copyToClipboard = () => {
  if (!generatedPassword.value) return
  navigator.clipboard.writeText(generatedPassword.value)
  copied.value = true
  setTimeout(() => copied.value = false, 3000)
}

const closeAndRedirect = () => {
  showPasswordDialog.value = false
  router.push({name: '/users/'})
}

const handleCancel = () => router.back()
</script>
