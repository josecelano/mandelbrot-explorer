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
                  v-for="(image, index) in imageTiles"
                  v-bind:key="index"
                  :config="gridTileConfig(index, image)"
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
    imageTiles: [],
    numberOfImageTilesLoaded: 0,
    imageGrid: {
      rows: 4,
      cols: 4,
    },
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
    gridTileSize() {
      return {
        width: this.tileResolution.width / this.imageGrid.cols,
        height: this.tileResolution.height / this.imageGrid.rows,
      };
    },
    gridNumberOfTiles() {
      return this.imageGrid.rows * this.imageGrid.cols;
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
      this.fetchTilesFromAPI();
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
    gridTileConfig(index, image) {
      const tileWidth = this.gridTileSize.width;
      const tileHeight = this.gridTileSize.height;

      const row = Math.floor(index / this.imageGrid.cols);
      const col = index % this.imageGrid.cols;

      return {
        image: image,
        x: col * tileWidth,
        y: row * tileHeight,
        width: tileWidth,
        height: tileHeight,
      };
    },
    fetchTilesFromAPI() {
      this.numberOfImageTilesLoaded = 0;
      this.imageTiles = Array(this.gridNumberOfTiles);

      this.showDownloadProgressBar();

      const grid = splitIntoGrid(
        this.tile,
        this.imageGrid.rows,
        this.imageGrid.cols
      );

      let row, col, index;

      index = 0;
      for (row = 0; row < this.imageGrid.rows; row++) {
        for (col = 0; col < this.imageGrid.cols; col++) {
          const tile = grid[row][col];
          const imageUrl = api.buildTileImageEndpointUrl(
            {
              left_bottom_zx: tile.leftBottomPoint.real,
              left_bottom_zy: tile.leftBottomPoint.imaginary,
              top_right_zx: tile.topRightPoint.real,
              top_right_zy: tile.topRightPoint.imaginary,
              res_x: this.tileResolution.width / this.imageGrid.cols,
              res_y: this.tileResolution.height / this.imageGrid.rows,
            },
            COLOR_MAP.COLORED_PERIODS
          );
          api.fetchTile(imageUrl, index).then((tile) => {
            this.imageTiles.splice(tile.index, 1, tile.image);
            this.numberOfImageTilesLoaded++;
            if (this.numberOfImageTilesLoaded >= this.gridNumberOfTiles) {
              this.hideDownloadProgressBar();
            }
          });
          index++;
        }
      }
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