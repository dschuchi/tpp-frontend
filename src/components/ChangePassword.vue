<template>
  <v-card title="Contraseña" subtitle="Luego de actualizar la contraseña deberá iniciar sesión nuevamente">
    <v-card-text>
      <v-form ref="formRef" @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="password" label="Nueva Contraseña" type="password" variant="outlined"
              :rules="[required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="confirmPassword" label="Confirmar Contraseña" type="password" variant="outlined"
              :rules="[required, matchRule]" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="primary" type="submit" :loading="loading">
              Cambiar Contraseña
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" variant="tonal">
      {{ snackbarText }}
    </v-snackbar>

    <v-dialog v-model="showLogoutModal" persistent max-width="450">
      <v-card class="text-center pa-6">
        <v-card-text>
          <v-icon color="success" icon="mdi-shield-check" size="80" class="mb-4"></v-icon>
          <h3 class="text-h5 mb-2">Contraseña Actualizada</h3>
          <p class="text-body-1 mb-6">
            Por razones de seguridad, es necesario que vuelvas a iniciar sesión con tus nuevas credenciales.
          </p>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="primary" variant="elevated" block size="large" @click="handleLogout">
            Entendido, ir al Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const formRef = ref()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('error')
const showLogoutModal = ref(false)

const required = (v: string) => !!v || 'Campo requerido'
const matchRule = (v: string) => v === password.value || 'Las contraseñas no coinciden'

const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    await userStore.updatePassword(password.value)
    authStore.logout()
    showLogoutModal.value = true
  } catch (error) {
    snackbarText.value = 'No se pudo actualizar la contraseña. Reintente.'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  router.push({name:'/login'})
  userStore.clearUser()
}
</script>
