<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Nuevo usuario" subtitle="Complete el formulario para crear un nuevo usuario."
        back-route="/usuarios" back-text="Usuarios">
        <template #actions>
          <v-btn @click="handleCancel"> Cancelar </v-btn>
          <v-btn color="primary" @click="handleSave"> Guardar </v-btn>
        </template>
      </PageHeader>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <UserForm ref="userFormRef" v-model="form" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue';
import UserForm from '@/components/UserForm.vue';
import { useUsersStore } from '@/stores/users.store';
import type { CreateUserRequest } from '@/types/users.types';

definePage({
  meta: {
    permission: 'users:create'
  }
})

const usersStore = useUsersStore()

const router = useRouter()
const userFormRef = ref()

const form = ref<CreateUserRequest>({
  username: '',
  lastname: '',
  email: ''
})

const handleSave = async () => {
  const { valid } = await userFormRef.value.validate()
  if (!valid) return

  await usersStore.createUser(form.value)
  router.push('/usuarios')
}

const handleCancel = router.back
</script>
