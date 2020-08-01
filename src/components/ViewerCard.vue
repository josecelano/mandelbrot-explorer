<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">Pixel</v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>Pointer pixel position:</v-list-item-content>
        <v-list-item-content>{{ pointerPixelPosText }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>Last clicked position:</v-list-item-content>
        <v-list-item-content>{{ clickedPixelPosText }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>Pixel size (complex plane):</v-list-item-content>
        <v-list-item-content>{{ pixelRealSizeText }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import formatter from "../formatter";

export default {
  name: "ViewerCard",
  props: ["pointerPixel", "clickedPixel", "pixelSize"],
  data: () => ({}),
  computed: {
    pointerPixelPosText: function() {
      if (!this.pointerPixel.x) return "outside fractal";
      return formatter.pixelCoordinatesToString(this.pointerPixel);
    },
    clickedPixelPosText: function() {
      return formatter.pixelCoordinatesToString(this.clickedPixel);
    },
    pixelRealSizeText: function() {
      return this.pixelSize.width + "x" + this.pixelSize.height;
    }
  }
};
</script>