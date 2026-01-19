<template>
  <v-navigation-drawer permanent>
    <div class="justify-items-center mt-3">
      <v-img width="210px" src="/farmacoop-text-logo.png"></v-img>
    </div>
    <v-list :items="menuItems">
    </v-list>
    <template v-slot:append>
      <v-list>
        <v-list-item to="/login" prepend-icon="mdi-logout" @click="logout">
          Cerrar sesión
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar elevation="0" class="border-b-thin">
    <template v-slot:append>
      <user-information />
    </template>
  </v-app-bar>

  <v-main>
    <v-container>
      <router-view />
      <confirm-dialog-host />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import ConfirmDialogHost from '@/components/ConfirmDialogHost.vue';
import { useAuthStore } from '@/stores/auth.store';

const menuItems = [
  {
    title: 'Panel',
    value: 'Panel',
    props: {
      prependIcon: 'mdi-view-dashboard',
      to: '/',
    }
  },
  {
    title: 'Producción',
    value: 'production',
    props: {
      prependIcon: 'mdi-factory',
      to: '/produccion',
      disabled: true
    }
  },
  {
    title: 'Clientes',
    value: 'clients',
    props: {
      prependIcon: 'mdi-account',
      to: '/clientes',
      disabled: true
    }
  },
  {
    title: 'Productos',
    value: 'products',
    props: {
      prependIcon: 'mdi-package-variant-closed',
      to: '/productos',
      disabled: true
    }
  },
  {
    title: 'Materia Prima',
    value: 'rawMaterials',
    props: {
      prependIcon: 'mdi-shape',
      to: '/materia-prima',
      disabled: true
    }
  },
  {
    title: 'Usuarios',
    value: 'users',
    props: {
      prependIcon: 'mdi-account-group',
      to: '/usuarios',
      disabled: true
    }
  },
  {
    title: 'Roles',
    value: 'roles',
    props: {
      prependIcon: 'mdi-card-account-details',
      to: '/roles',
    }
  }
]

const authStore = useAuthStore()

const logout = authStore.logout

</script>
