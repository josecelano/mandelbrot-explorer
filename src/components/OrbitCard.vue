<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">Orbit</v-card-title>
    <v-card-subtitle
      class="subheading font-weight-bold"
    >Click on the Mandelbrot Set image to plot the orbit of the point</v-card-subtitle>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>Z point:</v-list-item-content>
        <v-list-item-content class="align-end">{{ clickedPixelZPosText }}</v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-text>
      <orbit-graph :z="point"></orbit-graph>
    </v-card-text>
  </v-card>
</template>

<script>
import formatter from "../formatter";
import OrbitGraph from "./OrbitGraph.vue";

export default {
  name: "OrbitCard",
  components: {
    OrbitGraph
  },
  props: ["point"],
  computed: {
    clickedPixelZPosText: function() {
      return formatter.complexToString(this.point);
    }
  }
};
</script>