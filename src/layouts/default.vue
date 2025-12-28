<template>
  <v-app-bar title="Farmacoop" />

  <v-navigation-drawer>
    <v-list nav>
      <v-list-item title="Sidebar"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
//
</script>
