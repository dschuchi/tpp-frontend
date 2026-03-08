<template>
  <v-navigation-drawer v-model="drawer" :scrim="!lgAndUp">
    <div class="justify-items-center mt-3">
      <v-img width="250px" src="/logo.svg"></v-img>
    </div>
    <v-list :items="menuItems" @click="!lgAndUp && (drawer = false)">
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
    <template v-slot:prepend>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="drawer = !drawer"
        aria-label="Abrir/Cerrar menú"></v-app-bar-nav-icon>
    </template>

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
import { useDisplay } from 'vuetify'

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
    title: 'Usuarios',
    value: 'usuarios',
    props: {
      prependIcon: 'mdi-account-group',
      to: '/users',
    },
    permission: 'users:edit:all'
  },
  {
    title: 'Roles',
    value: 'roles',
    props: {
      prependIcon: 'mdi-card-account-details',
      to: '/roles',
    },
    permission: 'roles:view'
  },
  {
    title: 'Clientes',
    value: 'customers',
    props: {
      prependIcon: 'mdi-account-tie',
      to: '/customers',
    },
    permission: 'customers:view'
  },
  {
    title: 'Proveedores',
    value: 'suppliers',
    props: {
      prependIcon: 'mdi-truck',
      to: '/suppliers',
    },
    permission: "suppliers:view"
  },
  {
    title: 'Materia Prima',
    value: 'raw-materials',
    props: {
      prependIcon: 'mdi-package-variant',
      to: '/raw-materials',
    },
    permission: 'raw-materials:view'
  },
  {
    title: 'Material de Empaque',
    value: 'packaging-materials',
    props: {
      prependIcon: 'mdi-package-variant-closed',
      to: '/packaging-materials',
    },
    permission: 'packaging-materials:view'
  },
  {
    title: 'Productos',
    value: 'products',
    props: {
      prependIcon: 'mdi-cube-outline',
      to: '/products',
    },
    permission: 'products:view'
  }
]

const { lgAndUp } = useDisplay()
const drawer = ref(lgAndUp.value)

watch(lgAndUp, (isDesktop) => {
  drawer.value = isDesktop
})

const userStore = useUserStore()

const menuItems = computed(() => {
  return allMenuItems.filter(item => {
    if (!item.permission) return true;
    return userStore.can(item.permission);
  });
});

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  userStore.clearUser()
}

</script>
