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
  defaults: {
    VTextField: { variant: 'outlined', color: 'primary', density: 'compact' },
    VSelect: { variant: 'outlined', color: 'primary', density: 'compact' },
    VAutocomplete: { variant: 'outlined', color: 'primary', density: 'compact' },
    VCombobox: { variant: 'outlined', color: 'primary', density: 'compact' },
    VTextarea: { variant: 'outlined', color: 'primary', density: 'compact' },
    VBtn: { rounded: 'lg', elevation: 0 },
    VCard: { rounded: 'lg', elevation: 0 },
    VDataTable: { hover: true },
    VChip: { rounded: 'md' },
    VAppBar: { elevation: 0 }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          // Core Brand — Midnight Lab palette
          primary: '#1E9FE8',
          secondary: '#00C4CC',
          tertiary: '#64748B',
          // Status
          success: '#34D399',
          error: '#F87171',
          warning: '#FBBF24',
          info: '#38BDF8',
          // Backgrounds
          background: '#060D18',
          surface: '#0C1929',
          // Text
          'on-background': '#CBD5E1',
          'on-surface': '#94A3B8',
          'on-surface-variant': '#64748B',
          // Borders
          outline: '#1A3254',
        }
      },
      light: {
        dark: false,
        colors: {
          // Core Brand
          primary: '#0369A1',
          secondary: '#0891B2',
          tertiary: '#64748B',
          // Status
          success: '#059669',
          error: '#DC2626',
          warning: '#D97706',
          info: '#0284C7',
          // Backgrounds
          background: '#EEF5FD',
          surface: '#FFFFFF',
          // Text
          'on-background': '#0C1929',
          'on-surface': '#334155',
          'on-surface-variant': '#64748B',
          // Borders
          outline: '#BAE6FD',
        }
      },
    }
  },
})
