<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">Downloads</v-card-title>
    <v-divider></v-divider>
    <div class="pa-5">
      <ul>
        <li>
          <a target="_blank" :href="imageUrl(0)">Image "black on white"</a>
        </li>
        <li>
          <a target="_blank" :href="imageUrl(1)">Image "white on black"</a>
        </li>
        <li>
          <a target="_blank" :href="imageUrl(2)">Image "colored periods"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(0)">ASCII graph "@"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(1)">ASCII graph "number of interations"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(2)">ASCII graph "iterations inside"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(3)">ASCII graph "periods"</a>
        </li>
      </ul>
    </div>
  </v-card>
</template>

<script>
import api from "../api";

export default {
  name: "DownloadsCard",
  props: ["tileCommonUrlParams"],
  methods: {
    imageUrl: function (color_map) {
      return api.buildTileImageEndpointUrl(this.tileCommonUrlParams, color_map);
    },
    asciiGraphUrl: function (ascii_map) {
      return api.buildAsciiGraphEndpointUrl(
        this.tileCommonUrlParams,
        ascii_map
      );
    },
  },
};
</script>