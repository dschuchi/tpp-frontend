<template>
    <v-row
      align="center"
      justify="center"
      class="fill-height fill-width"
    >
      <v-col md="6" class="pa-0 fill-height hidden-sm-and-down left-background text-white">
        <v-row class="pa-16" align="center">
          <v-col cols="1">
            <v-avatar
              color="primary"
              rounded="lg"
              size="60"
            >
              <v-icon icon="mdi-flask-outline" color="white" size="40"/>
            </v-avatar>
          </v-col>

          <v-col cols="11">
            <p class="typo-h1">Farmacoop</p>
            <p class="typo-body-sm">Laboratory ERP System</p>
          </v-col>

          <v-col cols="12" class="pt-16">
            <span class="typo-h2">Pharmaceutical Laboratory Management</span>
          </v-col>

          <v-col cols="6">
            <span class="typo-body">Secure, compliant, and efficient laboratory operations management system designed for pharmaceutical.</span>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-row justify="center">
          <v-col cols="7">
            <p class="typo-h1 pb-6">
              ¡Bienvenido de nuevo!
            </p>

            <p class="typo-body-lg pb-6">
              Inicie sesión para acceder al panel de control de su laboratorio
            </p>

            <v-form
              ref="form"
              class="typo-body-lg"
            >
              <div class="text-subtitle-1 font-weight-bold">Email Address</div>

              <v-text-field
                v-model="email"
                placeholder="your.email@pharmatech.com"
                prepend-inner-icon="mdi-email-outline"
                rounded="lg"
                :rules="[requiredRule]"
              />

              <div class="text-subtitle-1 font-weight-bold">Password</div>

              <v-text-field
                v-model="password"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                :type="visible ? 'text' : 'password'"
                :append-inner-icon="visible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="visible = !visible"
                rounded="lg"
                :rules="[requiredRule]"
              />

              <div class="typo-body-sm text-right pb-6">
                <a
                  class="text-caption text-decoration-none text-info"
                  href="#"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Forgot password?</a>
              </div>

              <v-btn
                block
                color="primary"
                :ripple="false"
                :loading="loading"
                elevation="0"
                rounded="lg"
                class="minus-btn font-weight-bold"
                @click="submit"
              >
                Sign in
              </v-btn>
            </v-form>

            <v-divider opacity=".3" thickness="1.5" class="my-10">
              <span class="on-surface-variant">Or continue with</span>
            </v-divider>

            <v-btn
              block
              color="transparent"
              :ripple="false"
              :loading="loading"
              elevation="0"
              border="md"
              rounded="lg"
              class="minus-btn font-weight-bold mb-10"
            >
              <v-img
                :src="googleLogo"
                width="20"
                height="20"
                class="mr-2"
              />
              Google
            </v-btn>

            <v-card
              variant="tonal"
              color="info"
              border="md"
              class="px-6 py-4 border-info"
              rounded="lg"
            >
              <div class="d-flex align-start">
                <v-icon icon="mdi-shield-outline" class="mr-4 mt-1" />

                <div class="flex-1">
                  <div class="typo-h3">
                    Secure Access
                  </div>

                  <p class="typo-body">
                    All login attempts are logged and monitored for security purposes.
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-snackbar
        v-model="snackbar"
        color="error"
        :timeout="4000"
      >
        {{ loginError }}
      </v-snackbar>
    </v-row>
</template>

<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import googleLogo from '@/assets/google-logo.svg'

const authStore = useAuthStore()

const visible = ref(false)
const email = ref()
const password = ref()
const form = ref()
const loginError = ref('')
const loading = ref(false)
const snackbar = ref(false)

const requiredRule = (v: string) => !!v || 'Campo obligatorio'

const submit = async () => {
  loginError.value = ''

  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true

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
    snackbar.value = true
  }

  loading.value = false
}
</script>

<style scoped>
.left-background {
  position: relative;
  background: linear-gradient(180deg, #0f4c81 0%, #0a3254 100%);
  overflow: hidden;
}
.border-info{
  border-color: #18bad1 !important;
}
</style>
