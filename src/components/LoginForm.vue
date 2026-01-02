<template>
  <v-container class="pa-0">
    <v-row class="h-screen" align-content="center" justify="center">
      <v-card class="pa-12 pb-8" elevation="8" rounded="lg" min-width="640px">
        <v-img class="mx-auto my-6" src="/farmacoop-text-logo.png"></v-img>

        <v-form ref="form" @submit.prevent="submit">
          <v-container class="px-16">
            <v-alert v-if="loginError" type="error" variant="tonal" class="mb-6">
              {{ loginError }}
            </v-alert>

            <v-text-field class="mb-1" label="Correo electronico" prepend-inner-icon="mdi-email-outline"
              variant="outlined" v-model="email" :rules="[requiredRule]"></v-text-field>

            <v-text-field class="mb-1" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'" label="Contraseña" prepend-inner-icon="mdi-lock-outline"
              variant="outlined" @click:append-inner="visible = !visible" v-model="password"
              :rules="[requiredRule]"></v-text-field>

            <v-btn class="mb-8" type="submit" color="blue" size="x-large" variant="tonal" block>
              Iniciar sesión
            </v-btn>
          </v-container>
        </v-form>

      </v-card>
    </v-row>
  </v-container>
</template>

<script setup>
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const visible = ref(false)
const email = ref()
const password = ref()
const form = ref()
const loginError = ref('')

const requiredRule = v => !!v || 'Campo obligatorio'

const submit = async () => {
  loginError.value = ''

  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    await authStore.login(
      {
        email: email.value,
        password: password.value
      }
    )
    router.replace('/')
  } catch {
    loginError.value = 'Correo o contraseña incorrectos'
  }
}
</script>
