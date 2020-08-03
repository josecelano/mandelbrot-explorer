<template>
  <v-row>
    <v-col cols="12" lg="4">
        <orbit :point="orbitPoint"></orbit>
    </v-col>
    <v-col cols="12" lg="8">
      <v-btn rounded @click="reset">reset</v-btn>
      <v-btn rounded @click="zoomIn">zoom in</v-btn>
      <v-btn rounded @click="zoomOut">zoom out</v-btn>
      <explorer
        :tileResolution="tileResolution"
        :leftBottomPoint="leftBottomPoint"
        :topRightPoint="topRightPoint"
        @clicked="onClickExplorer"
        @double-clicked="onDoubleClickExplorer"
      ></explorer>
    </v-col>
  </v-row>
</template>

<script>
import { objectsAreEqual } from "@/comparison";
import {
  zoomInByFactor,
  zoomOutByFactor,
  convertFromDomainToAPIFormat,
  createTileFromCenterAndSize,
  getTileSize,
  getCenterPoint,
  createTileFromCornerPoints,
} from "@/tile";
import Explorer from "@/components/Explorer.vue";
import Orbit from "@/components/Orbit.vue";

export default {
  name: "Home",
  components: {
    Explorer,
    Orbit,
  },
  data: () => ({
    tileResolution: {
      width: 512,
      height: 512,
    },
    clickedZPoint: {
      real: 0,
      imaginary: 0,
    },
    zoomFactor: 1.5,
    initialTile: {
      left_bottom_zx: -1.5,
      left_bottom_zy: -1,
      top_right_zx: 0.5,
      top_right_zy: 1,
    },
    initialOrbitPoint: {
      real: 0,
      imaginary: 0,
    },
  }),
  computed: {
    leftBottomPoint() {
      return {
        real: Number(this.$route.query.left_bottom_zx),
        imaginary: Number(this.$route.query.left_bottom_zy),
      };
    },
    topRightPoint() {
      return {
        real: Number(this.$route.query.top_right_zx),
        imaginary: Number(this.$route.query.top_right_zy),
      };
    },
    orbitPoint() {
      return {
        real: Number(this.$route.query.orbit_zx),
        imaginary: Number(this.$route.query.orbit_zy),
      };
    },
    tile() {
      return createTileFromCornerPoints(
        this.leftBottomPoint,
        this.topRightPoint
      );
    },
    tileSize() {
      return getTileSize(this.tile);
    },
  },
  created() {
    if (this.noUrlQueryParamsDefined()) {
      this.initUrlWithDefaultParams();
    }
  },
  methods: {
    noUrlQueryParamsDefined() {
      return Object.keys(this.$route.query).length == 0;
    },
    onClickExplorer(clickedZPoint) {
      this.clickedZPoint = clickedZPoint;
      this.updateUrlFromTileAndOrbitPoint(this.tile, clickedZPoint);
    },
    onDoubleClickExplorer(clickedZPoint) {
      this.centerTileAndZoomIn(clickedZPoint);
    },
    initUrlWithDefaultParams() {
      this.reset();
    },
    reset() {
      this.updateUrl(this.initialTile, this.initialOrbitPoint);
    },
    updateUrlFromTileAndOrbitPoint(newTile, neworbitPoint) {
      this.updateUrl(convertFromDomainToAPIFormat(newTile), neworbitPoint);
    },
    updateUrl(newTile, neworbitPoint) {
      const newQuery = {
        ...this.$route.query,
        left_bottom_zx: String(newTile.left_bottom_zx),
        left_bottom_zy: String(newTile.left_bottom_zy),
        top_right_zx: String(newTile.top_right_zx),
        top_right_zy: String(newTile.top_right_zy),
        orbit_zx: String(neworbitPoint.real),
        orbit_zy: String(neworbitPoint.imaginary),
      };

      if (objectsAreEqual(this.$route.query, newQuery)) return;

      this.$router.push({ query: newQuery });
    },
    zoomIn() {
      const newTile = zoomInByFactor(this.tile, this.zoomFactor);
      this.updateUrlFromTileAndOrbitPoint(newTile, getCenterPoint(newTile));
    },
    zoomOut() {
      const newTile = zoomOutByFactor(this.tile, this.zoomFactor);
      this.updateUrlFromTileAndOrbitPoint(newTile, getCenterPoint(newTile));
    },
    centerTileAndZoomIn(clickedZPoint) {
      const newTileWithCenterOnClickedZPoint = createTileFromCenterAndSize(
        clickedZPoint,
        this.tileSize
      );
      const newScaledTile = zoomInByFactor(
        newTileWithCenterOnClickedZPoint,
        this.zoomFactor
      );
      this.updateUrlFromTileAndOrbitPoint(
        newScaledTile,
        getCenterPoint(newScaledTile)
      );
    },
  },
};
</script>
