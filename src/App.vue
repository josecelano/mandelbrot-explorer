<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app right>
      <drawer></drawer>
    </v-navigation-drawer>

    <v-app-bar app color="cyan" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>Mandelbrot Periods Explorer</v-toolbar-title>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer color="cyan" app>
      <v-spacer></v-spacer>
      <span class="white--text">Built with <a href="https://vuetifyjs.com/">vuetifyjs</a> by Jose Celano {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Drawer from "./components/Drawer.vue";

export default {
  name: "AppLayout",
  components: {
    Drawer
  },
  props: {
    source: String
  },  
  data: () => ({
    drawer: false
  })
};
</script>