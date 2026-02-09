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
          <v-col cols="12" sm="2" class="d-flex justify-center">
            <v-avatar size="80" color="blue">
              {{ avatarText }}
            </v-avatar>
          </v-col>

          <v-col cols="12" sm="5">
            <div class="text-subtitle-1 font-weight-bold">Nombre</div>
            <div class="text-body-1 mb-2">{{ userStore.name }}</div>

            <div class="text-subtitle-1 font-weight-bold">Correo</div>
            <div class="text-body-1 text-grey">{{ userStore.email }}</div>
          </v-col>

          <v-col cols="12" sm="5">
            <div class="text-subtitle-1 font-weight-bold">Apellido</div>
            <div class="text-body-1 mb-2">{{ userStore.lastname }}</div>

            <div class="text-subtitle-1 font-weight-bold">Rol de Usuario</div>
            <v-chip color="secondary" size="small">{{ userStore.rol_name }}</v-chip>
          </v-col>

        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue';
import { useUserStore } from '@/stores/user.store';

definePage({
  meta: {
    permission: 'users:edit:me'
  }
})

const userStore = useUserStore()
const avatarText = computed(() => userStore.name.charAt(0) + userStore.lastname.charAt(0))

</script>
