<template>
  <v-navigation-drawer permanent>
    <div class="justify-items-center mt-3">
      <v-img width="210px" src="/farmacoop-text-logo.png"></v-img>
    </div>
    <v-list :items="menuItems">
    </v-list>
  </v-navigation-drawer>

  <v-app-bar elevation="0" class="border-b-thin">
    <template v-slot:append>
      <user-information />
    </template>
  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
const menuItems = [
  {
    title: 'Inicio',
    value: 'inicio',
    props: {
      prependIcon: 'mdi-view-dashboard'
    }
  },
  {
    title: 'Producción',
    value: 'production',
    props: {
      prependIcon: 'mdi-factory'
    }
  },
  {
    title: 'Clientes',
    value: 'clients',
    props: {
      prependIcon: 'mdi-account'
    }
  },
  {
    title: 'Productos',
    value: 'products',
    props: {
      prependIcon: 'mdi-package-variant-closed'
    }
  },
  {
    title: 'Materia Prima',
    value: 'rawMaterials',
    props: {
      prependIcon: 'mdi-shape'
    }
  },
  {
    title: 'Usuarios',
    value: 'users',
    props: {
      prependIcon: 'mdi-account-group'
    }
  }
]
</script>
