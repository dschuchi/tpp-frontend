/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import "./assets/general.css";
import "./assets/typography.css";

async function bootstrap() {
  const app = createApp(App)

  await registerPlugins(app)

  app.mount('#app')
}

bootstrap()
