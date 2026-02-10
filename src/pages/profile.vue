<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Perfil del Usuario" subtitle="Administre la información personal y seguridad de la cuenta.">
      </PageHeader>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card title="Información Personal">
        <v-row align="center" class="pa-4">
          <v-col cols="12" sm="6">
            <v-text-field :model-value="userStore.name" label="Nombre" variant="outlined" readonly />
            <v-text-field :model-value="userStore.lastname" label="Apellido" variant="outlined" readonly />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field :model-value="userStore.email" label="Correo" variant="outlined" readonly />
            <v-select density="compact" :model-value="userStore.rol_name" label="Rol" variant="outlined" readonly />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <ChangePassword />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue';
import ChangePassword from '@/components/ChangePassword.vue';
import { useUserStore } from '@/stores/user.store';

definePage({
  meta: {
    permission: 'users:edit:me'
  }
})

const userStore = useUserStore()

</script>
