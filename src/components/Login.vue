<template>
  <v-container class="pa-0">
    <v-row class="h-screen" align-content="center" justify="center">
      <v-card class="pa-12 pb-8" elevation="8" rounded="lg" min-width="640px">
        <v-img class="mx-auto my-6" src="/farmacoop-text-logo.png"></v-img>

        <v-container class="px-16">
          <v-text-field placeholder="Correo electronico" prepend-inner-icon="mdi-email-outline"
          variant="outlined"></v-text-field>
          
          <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          placeholder="Contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>
          
          <v-btn class="mb-8" color="blue" size="large" variant="tonal" block>
            Iniciar sesión
          </v-btn>
        </v-container>
      </v-card>
    </v-row>
  </v-container>
</template>

<script setup>
const visible = ref(false)

</script>