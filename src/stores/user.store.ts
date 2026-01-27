import type { LoginResponse, User } from "@/types/users.types"

export const useUserStore = defineStore('user', {
  state: (): User => ({
    name: '',
    lastname: '',
    email: '',
    rol_name: '',
    permissions: []
  }),

  getters: {
    fullname: (state) => `${state.name} ${state.lastname}`
  },

  actions: {
    async setUser(loginResponse: LoginResponse) {
      const { name, lastname, email, rol_name, permissions } = loginResponse
      this.$patch({
        name,
        lastname,
        email,
        rol_name,
        permissions
      })
    },
    async clearUser() {
      this.$reset()
    }
  }
})
