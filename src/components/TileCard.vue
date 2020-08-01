<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">Image</v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>Left Bottom z point:</v-list-item-content>
        <v-list-item-content>{{ leftBottomPointText }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>Right top z point:</v-list-item-content>
        <v-list-item-content>{{ rightTopPointText }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>Resolution:</v-list-item-content>
        <v-list-item-content>{{ resolutionText }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>Size (complex plane):</v-list-item-content>
        <v-list-item-content>{{ tileRealSizeText }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import formatter from "../formatter";

export default {
  name: "ViewerCard",
  props: [
    "tileResolution",
    "clickedZPoint",
    "tileSize",
    "leftBottomPoint",
    "topRightPoint"
  ],
  computed: {
    resolutionText: function() {
      return formatter.resolutionToString(this.tileResolution);
    },
    pointerPixelPosText: function() {
      return formatter.pixelCoordinatesToString(this.pointerPixel);
    },
    clickedPixelPosText: function() {
      return formatter.pixelCoordinatesToString(this.clickedPixel);
    },
    pixelRealSizeText: function() {
      return this.pixelSize.width + "x" + this.pixelSize.height;
    },
    tileRealSizeText: function() {
      return this.tileSize.width + "x" + this.tileSize.height;
    },
    leftBottomPointText: function() {
      return formatter.complexToString(this.leftBottomPoint);
    },
    rightTopPointText: function() {
      return formatter.complexToString(this.topRightPoint);
    }
  }
};
</script>