<template>
  <v-container>
    <viewer-card :pointerPixel="pointerPixel" :clickedPixel="clickedPixel" :pixelSize="pixelSize"></viewer-card>
    <tile-card
      :tileResolution="tileResolution"
      :clickedZPoint="clickedZPoint"
      :tileSize="tileSize"
      :leftBottomPoint="leftBottomPoint"
      :topRightPoint="topRightPoint"
    ></tile-card>
  </v-container>
</template>

<script>
import ViewerCard from "./ViewerCard.vue";
import TileCard from "./TileCard.vue";

export default {
  name: "ExplorerPanel",
  components: {
    ViewerCard,
    TileCard
  },
  props: [
    "tileResolution",
    "pointerPixel",
    "clickedPixel",
    "clickedZPoint",
    "pixelSize",
    "tileSize",
    "leftBottomPoint",
    "topRightPoint"
  ]
};
</script>