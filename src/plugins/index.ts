/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'

// Types
import type { App } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

export async function registerPlugins(app: App) {
  app
    .use(vuetify)
    .use(pinia)

  const authStore = useAuthStore()
  if (authStore.token) {
    await authStore.me()
  } else {
    authStore.hydrated = true
  }

  app.use(router)
}
