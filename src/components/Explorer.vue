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
                <v-image
                  :config="{
                  image: image00, 
                  x:0, 
                  y:0, 
                  width: 256, 
                  height: 256}"
                />
                <v-image
                  :config="{
                  image: image01, 
                  x:256, 
                  y:0, 
                  width: 256, 
                  height: 256}"
                />
                <v-image
                  :config="{
                  image: image10, 
                  x:0, 
                  y:256, 
                  width: 256, 
                  height: 256}"
                />
                <v-image
                  :config="{
                  image: image11, 
                  x:256, 
                  y:256, 
                  width: 256, 
                  height: 256}"
                />
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
  splitIntoGrid,
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
    image00: null,
    image01: null,
    image10: null,
    image11: null,
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

      const grid = splitIntoGrid(this.tile, 2, 2);

      // image00
      const tile00 = grid[0][0];
      const imageUrl00 = api.buildTileImageEndpointUrl(
        {
          left_bottom_zx: tile00.leftBottomPoint.real,
          left_bottom_zy: tile00.leftBottomPoint.imaginary,
          top_right_zx: tile00.topRightPoint.real,
          top_right_zy: tile00.topRightPoint.imaginary,
          res_x: this.tileResolution.width / 2,
          res_y: this.tileResolution.height / 2,
        },
        COLOR_MAP.COLORED_PERIODS
      );

      // image01
      const tile01 = grid[0][1];
      const imageUrl01 = api.buildTileImageEndpointUrl(
        {
          left_bottom_zx: tile01.leftBottomPoint.real,
          left_bottom_zy: tile01.leftBottomPoint.imaginary,
          top_right_zx: tile01.topRightPoint.real,
          top_right_zy: tile01.topRightPoint.imaginary,
          res_x: this.tileResolution.width / 2,
          res_y: this.tileResolution.height / 2,
        },
        COLOR_MAP.COLORED_PERIODS
      );

      // image10
      const tile10 = grid[1][0];
      const imageUrl10 = api.buildTileImageEndpointUrl(
        {
          left_bottom_zx: tile10.leftBottomPoint.real,
          left_bottom_zy: tile10.leftBottomPoint.imaginary,
          top_right_zx: tile10.topRightPoint.real,
          top_right_zy: tile10.topRightPoint.imaginary,
          res_x: this.tileResolution.width / 2,
          res_y: this.tileResolution.height / 2,
        },
        COLOR_MAP.COLORED_PERIODS
      );

      // image11
      const tile11 = grid[1][1];
      const imageUrl11 = api.buildTileImageEndpointUrl(
        {
          left_bottom_zx: tile11.leftBottomPoint.real,
          left_bottom_zy: tile11.leftBottomPoint.imaginary,
          top_right_zx: tile11.topRightPoint.real,
          top_right_zy: tile11.topRightPoint.imaginary,
          res_x: this.tileResolution.width / 2,
          res_y: this.tileResolution.height / 2,
        },
        COLOR_MAP.COLORED_PERIODS
      );

      await Promise.all([
        api.fetchTile(imageUrl00).then((image) => {
          this.image00 = image;
        }),
        api.fetchTile(imageUrl01).then((image) => {
          this.image01 = image;
        }),
        api.fetchTile(imageUrl10).then((image) => {
          this.image10 = image;
        }),
        api.fetchTile(imageUrl11).then((image) => {
          this.image11 = image;
        }),
      ]);

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