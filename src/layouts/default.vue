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
    <v-container class="px-16">
      <router-view />
      <confirm-dialog-host />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import ConfirmDialogHost from '@/components/ConfirmDialogHost.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';

const allMenuItems = [
  {
    title: 'Panel',
    value: 'Panel',
    props: {
      prependIcon: 'mdi-view-dashboard',
      to: '/',
    }
  },
  {
    title: 'Roles',
    value: 'roles',
    props: {
      prependIcon: 'mdi-card-account-details',
      to: '/roles',
    },
    permission: 'roles:view'
  }
]

const userStore = useUserStore()

const menuItems = computed(() => {
  return allMenuItems.filter(item => {
    if (!item.permission) return true;
    return userStore.can(item.permission);
  });
});

const authStore = useAuthStore()

const logout = authStore.logout

</script>
