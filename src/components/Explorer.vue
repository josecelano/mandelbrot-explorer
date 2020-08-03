<template>
  <v-row align="start">
    <v-col cols="12" md="6">
      <v-card>
        <v-responsive :min-width="stageConfig.width">
          <v-card-title class="subheading font-weight-bold">Explorer</v-card-title>
          <v-card-subtitle
            class="subheading font-weight-bold"
          >Double click on a the Mandelbrot Set image to center and zoom in</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-stage ref="tileStage" :config="stageConfig">
              <v-layer
                ref="tileLayer"
                @mousemove="onMouseMove"
                @mouseout="onMouseOut"
                @click="onClick"
                @dblclick="onDoubleClick"
              >
                <v-image :config="{x:0, y:0, image: image}" />
              </v-layer>
            </v-stage>
            <v-progress-linear :active="imageLoading" :value="imageLoadPercentage"></v-progress-linear>
            <span v-if="imageLoading">Loading image ...</span>
          </v-card-text>
        </v-responsive>
      </v-card>
      <v-container>
        <color-card></color-card>
      </v-container>
    </v-col>
    <v-col cols="12" md="6">
      <explorer-panel
        :tileResolution="tileResolution"
        :leftBottomPoint="leftBottomPoint"
        :topRightPoint="topRightPoint"
        :pointerPixel="pointerPixel"
        :clickedPixel="clickedPixel"
        :clickedZPoint="clickedZPoint"
        :pixelSize="pixelSize"
        :tileSize="tileSize"
      ></explorer-panel>

      <v-container>
        <downloads-card :tileCommonUrlParams="tileCommonUrlParams"></downloads-card>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import { default as api, COLOR_MAP } from "@/api";
import { objectsAreEqual } from "@/comparison";
import {
  getTileSize,
  createTileFromCornerPoints,
  getPixelSize,
  calculateZPointForPixelCoordinates,
} from "@/tile";
import ColorCard from "@/components/ColorCard.vue";
import DownloadsCard from "@/components/DownloadsCard.vue";
import ExplorerPanel from "@/components/ExplorerPanel.vue";

export default {
  name: "Explorer",
  components: {
    ColorCard,
    DownloadsCard,
    ExplorerPanel,
  },
  props: ["tileResolution", "leftBottomPoint", "topRightPoint"],
  data: () => ({
    image: null,
    timerInterval: null,
    imageLoading: false,
    imageLoadPercentage: 0,
    pointerPixel: {
      x: null,
      y: null,
    },
    clickedPixel: {
      x: null,
      y: null,
    },
    clickedZPoint: {
      real: 0,
      imaginary: 0,
    },
  }),
  computed: {
    tile() {
      return createTileFromCornerPoints(
        this.leftBottomPoint,
        this.topRightPoint
      );
    },
    tileSize() {
      return getTileSize(this.tile);
    },
    pixelSize() {
      return getPixelSize(this.tile, this.tileResolution);
    },
    tileCommonUrlParams: function () {
      return {
        left_bottom_zx: this.leftBottomPoint.real,
        left_bottom_zy: this.leftBottomPoint.imaginary,
        top_right_zx: this.topRightPoint.real,
        top_right_zy: this.topRightPoint.imaginary,
        res_x: this.tileResolution.width,
        res_y: this.tileResolution.height,
      };
    },
    stageConfig() {
      return {
        width: this.tileResolution.width,
        height: this.tileResolution.height,
      };
    },
  },
  watch: {
    tileCommonUrlParams(newValue, oldValue) {
      if (objectsAreEqual(newValue, oldValue)) return;
      this.updateTile();
    },
  },
  created() {
    this.updateTile();
  },
  methods: {
    onClick() {
      this.updateClickPosition();
      this.calculateZPointForClickedPosition();
      this.$emit("clicked", this.clickedZPoint);
    },
    onDoubleClick() {
      this.$emit("double-clicked", this.clickedZPoint);
    },
    onMouseMove() {
      const mousePos = this.$refs.tileStage.getNode().getPointerPosition();
      this.pointerPixel = {
        x: mousePos.x,
        y: mousePos.y,
      };
    },
    onMouseOut() {
      this.pointerPixel = {
        x: null,
        y: null,
      };
    },
    updateTile() {
      this.fetchTileFromAPI();
    },
    updateClickPosition() {
      const mousePos = this.$refs.tileStage.getNode().getPointerPosition();
      this.clickedPixel = {
        x: mousePos.x,
        y: mousePos.y,
      };
    },
    calculateZPointForClickedPosition() {
      this.clickedZPoint = calculateZPointForPixelCoordinates(
        this.tile,
        this.tileResolution,
        this.clickedPixel
      );
    },
    imageUrl: function () {
      return api.buildTileImageEndpointUrl(
        this.tileCommonUrlParams,
        COLOR_MAP.COLORED_PERIODS
      );
    },
    async fetchTileFromAPI() {
      this.showDownloadProgressBar();
      this.image = await api.fetchTile(this.imageUrl());
      this.image.width = this.tileResolution.width;
      this.image.height = this.tileResolution.height;
      this.hideDownloadProgressBar();
    },
    showDownloadProgressBar() {
      this.timerInterval = setInterval(
        () => (this.imageLoadPercentage += 1),
        1000
      );
      this.imageLoading = true;
      this.imageLoadPercentage = 0;
    },
    hideDownloadProgressBar() {
      this.imageLoading = false;
      clearInterval(this.timerInterval);
    },
  },
};
</script>