import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000
  }),
  actions: {
    showMessage({ message, color = 'error', timeout = 3000 }: { message: string, color?: string, timeout?: number }) {
      this.message = message
      this.color = color
      this.timeout = timeout
      this.show = true
    }
  }
})
