<template>
  <v-container>
    <v-img v-if="orbitImageUrl" :eager="true" :src="orbitImageUrl"></v-img>
    <v-progress-circular v-if="!orbitImageUrl" indeterminate color="primary"></v-progress-circular>
  </v-container>
</template>

<script>
import api from "@/api";

export default {
  name: "OrbitGraph",
  props: {
    z: {
      type: Object,
      required: false,
      default: function() {
        return {
          real: 0,
          imaginary: 0
        };
      }
    },
    size: {
      type: Object,
      default: function() {
        return {
          width: 512,
          height: 256
        };
      }
    }
  },
  data: () => ({
    orbitImage: null,
    orbitImageUrl: null
  }),
  watch: {
    z: {
      deep: true,
      handler() {
        this.orbitImageUrl = api.buildOrbitImageEndpointUrl(
          this.z.real,
          this.z.imaginary
        );
      }
    }
  },
  created() {
    this.orbitImageUrl = api.buildOrbitImageEndpointUrl(
      this.z.real,
      this.z.imaginary
    );
  }
};
</script>