<template>
  <v-app-bar>
    <template v-slot:prepend>
      <div class="ms-5">
        <v-img width="210px" src="/farmacoop-text-logo.png"></v-img>
      </div>
    </template>
    <user-information />
  </v-app-bar>

  <v-navigation-drawer>
    <v-list :items="menuItems">
    </v-list>
  </v-navigation-drawer>

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
