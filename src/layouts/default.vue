<template>
  <v-navigation-drawer v-model="drawer" :scrim="!lgAndUp" class="lab-drawer">
    <div class="drawer-logo-area">
      <v-img width="220px" src="/logo.svg" class="mx-auto"></v-img>
    </div>

    <v-divider opacity=".5" class="mb-2" />

    <v-list :items="menuItems" @click="!lgAndUp && (drawer = false)">
    </v-list>

    <template v-slot:append>
      <v-divider opacity=".5" class="mt-2" />
      <v-list>
        <v-list-item to="/login" prepend-icon="mdi-logout" class="logout-item" @click="logout">
          Cerrar sesión
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar elevation="0" class="border-b-thin lab-appbar">
    <template v-slot:prepend>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="drawer = !drawer"
        aria-label="Abrir/Cerrar menú"></v-app-bar-nav-icon>
    </template>

    <template v-slot:append>
      <v-btn
        :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        @click="toggleTheme"
        aria-label="Cambiar tema"
      />
      <user-information />
    </template>
  </v-app-bar>

  <v-main>
    <v-container class="px-16 py-8">
      <router-view />
      <confirm-dialog-host />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import ConfirmDialogHost from '@/components/ConfirmDialogHost.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import { useDisplay, useTheme } from 'vuetify'

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
const theme = useTheme()
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
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

<style scoped>
.lab-drawer {
  background: linear-gradient(180deg, rgb(var(--v-theme-background)) 0%, rgb(var(--v-theme-surface)) 100%) !important;
}

.drawer-logo-area {
  padding: 24px 16px 16px;
  text-align: center;
}

.drawer-logo-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 8px;
  opacity: 0.4;
  color: #94A3B8;
}

.logout-item {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.logout-item:hover {
  opacity: 1;
}
</style>
