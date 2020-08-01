<template>
  <v-row class="pa-10">
    <v-card class="pa-md-4 mx-lg-auto" color="white">
      <v-card-text>
        <p class="display-1 text--primary">
          About
          <br />
        </p>
        <p class="text-left">
          This project is a Mandelbrot Set viewer where you can see periods. Each point in the Set is colored with a different color depending on the period. "Period Checking" is a performance technique used to speed up Mandelbrot Set rendering. Some points inside the Mandelbrot Set have cycles in the orbit of a point.
          <br />
          <br />Read more about
          <a
            target="_blank"
            href="https://github.com/josecelano/c-mandelbrot-arbitrary-precision/blob/master/doc/periodicity-checking.md"
          >period checking</a>.
        </p>
        <p class="text-left">Related projects:</p>
        <ul>
          <li>
            <a
              target="_blank"
              href="https://github.com/josecelano/c-mandelbrot-arbitrary-precision"
            >C console program to generate Mandelbrot Set images</a>.
          </li>
          <li>
            <a
              target="_blank"
              href="https://github.com/josecelano/mandelbrot-orbit"
            >Python console program to generate Mandelbrot Set point orbit graphs</a>.
          </li>
          <li>
            <a
              target="_blank"
              href="https://github.com/josecelano/mandelbrot-api"
            >API to generate two types of Mandelbrot images: tiles and point orbits</a>.
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-row>
</template>
