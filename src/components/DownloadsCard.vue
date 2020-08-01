<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold">Downloads</v-card-title>
    <v-divider></v-divider>
    <div class="pa-5">
      <ul>
        <li>
          <a target="_blank" :href="imageUrl(0)">Download image "black on white"</a>
        </li>
        <li>
          <a target="_blank" :href="imageUrl(1)">Download image "white on black"</a>
        </li>
        <li>
          <a target="_blank" :href="imageUrl(2)">Download image "colored periods"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(0)">Download ASCII graph "@"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(1)">Download ASCII graph "number of interations"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(2)">Download ASCII graph "iterations inside"</a>
        </li>
        <li>
          <a target="_blank" :href="asciiGraphUrl(3)">Download ASCII graph "periods"</a>
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
    imageUrl: function(color_map) {
      const tileUrlParams = {
        ...this.tileCommonUrlParams,
        format: 0, // PNG image
        color_map
      };
      return api.buildTileEndpointUrl(tileUrlParams);
    },
    asciiGraphUrl: function(ascii_map) {
      const tileUrlParams = {
        ...this.tileCommonUrlParams,
        format: 1, // Ascii graph
        ascii_map
      };
      return api.buildTileEndpointUrl(tileUrlParams);
    }
  }
};
</script>