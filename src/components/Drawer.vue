<template>
  <v-list dense>
    <v-list-item link>
      <v-list-item-action>
        <v-icon>mdi-home</v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          <router-link to="/">Home</router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item link>
      <v-list-item-action>
        <v-icon>mdi-help</v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          <router-link to="/about">About</router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item link>
      <v-list-item-action>
        <v-icon>mdi-email</v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          <a target="_blank" href="https://github.com/josecelano/mandelbrot-explorer">Contact</a>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "Drawer"
};
</script>