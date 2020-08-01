<template>
  <v-container>
    <orbit-card :point="point"></orbit-card>
  </v-container>
</template>

<script>
import OrbitCard from "./OrbitCard.vue";

export default {
  name: "Orbit",
  components: {
    OrbitCard
  },
  props: ["point"]
};
</script>
