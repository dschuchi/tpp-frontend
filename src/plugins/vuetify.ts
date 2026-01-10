/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults:{
    VTextField: {variant: 'outlined', color: 'info', density: 'compact'},
  },
  theme: {
    defaultTheme: 'system',
    themes: {
      dark: {
        dark: true,
        colors:{
          // Core Brand
          primary: '#0F4C81',
          secondary: '#2E8B57',
          tertiary: '#6C7A89',

          // Status
          success: '#28A745',
          error: '#DC3545',
          warning: '#FFC107',
          info: '#17A2B8',

          // Backgrounds
          background: '#111827', // App background color
          surface: '#1E293B', // Components (cards, tables, etc.) background color

          // Text
          'on-background': '#F9FAFB',
          'on-surface': '#9CA3AF',
          'on-surface-variant': '#6B7280',

          // Borders
          outline: '#374151',
        }
      },
      light: {
        dark: false,
        colors: {
          // Core Brand
          primary: '#0F4C81',
          secondary: '#2E8B57',
          tertiary: '#6C7A89',

          // Status
          success: '#28A745',
          error: '#DC3545',
          warning: '#FFC107',
          info: '#17A2B8',

          // Backgrounds
          background: '#FFFFFF', // App background color
          surface: '#F9FAFB', // Components (cards, tables, etc.) background color

          // Text
          'on-background': '#1F2937',
          'on-surface': '#4B5563',
          'on-surface-variant': '#9CA3AF',

          // Borders / dividers
          outline: '#E5E7EB',
        }
      },
    }
  },
})
