<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Detalle del Usuario" subtitle="Visualice los datos del usuario." :back-route='{name:"/users/"}'
        back-text="Usuarios">
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <user-form v-model="form" readonly show-role />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import UserForm from '@/components/UserForm.vue'
import { useUserStore } from '@/stores/user.store'
import { useUsersStore } from '@/stores/users.store'
import type { UpdateUserRequest } from '@/types/users.types'

definePage({
  props: true,
  meta: {
    permission: 'users:edit:all'
  }
})

const props = defineProps<{ id: string }>()
const usersStore = useUsersStore()
const { can } = useUserStore()

const form = ref<UpdateUserRequest>({
  username: '',
  lastname: '',
  email: '',
  password: '',
  rol_id: 0
})

onMounted(async () => {
  try {
    const user = await usersStore.getUser(props.id)
    if (user) {
      form.value.username = user.username
      form.value.lastname = user.lastname
      form.value.email = user.email
      form.value.rol_id = Number(user.rol_id)
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
})
</script>
