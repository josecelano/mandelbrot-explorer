[![Build Status](https://travis-ci.com/josecelano/mandelbrot-explorer.svg?branch=master)](https://travis-ci.com/github/josecelano/mandelbrot-explorer)

# Mandelbrot Explorer

This web application shows the orbit of a given point in the Mandelbrot Set fractal.
The main reason why this project was built is to understand the "Period Cheking" performance techniche.

In order to generate the Mandelbrot Set fractal you need to calculate recursively the formula `f(z) = z² + c`, where `z` and `c` are complex numbers.
The series of values is the [orbit of the point](https://en.wikipedia.org/wiki/Orbit_trap). Points inside the Mandelbrot Set do not diverge.

"Period Cheking" is based in a fractal property, some point orbits inside the Mandelbrot Set has a cycle with different period. For example, all point inside the main cardioid tends to a fix value, points in the main circle (on the left of the main cardioid) have a cycle of period 2.

When you detect a cycle in a orbit you can stop the calculation of the point and save some loop iterations. THat techiche is used by fractal generation softwware like [Gnofract 4D](https://github.com/fract4d/gnofract4d).

If you want to know more you can read this [period checking](https://github.com/josecelano/c-mandelbrot-arbitrary-precision/blob/master/doc/periodicity-checking.md) documentation.

Online demo: https://mandelbrot-set-periods.online

![Mandelbrot Explorer](doc/img/mandelbrot-explorer-screenshot.png)

## Development

Compiles and hot-reloads for development:
```
./bin/dev/serve
```

Execute tests:
```
./bin/dev/test
```

Execute linter:
```
./bin/dev/lint
```

## Production

Compiles and minifies for production:
```
./bin/production/build
```

Test production artifact in localhost:
```
./bin/production/serve
```

## Related projects

This API uses these two command line applications:
* [Console command to generate tiles](https://github.com/josecelano/c-mandelbrot-arbitrary-precision)
* [Console command to generate orbits](https://github.com/josecelano/mandelbrot-orbit)
* [API wrapper for console commands (tiles and orbits)](https://github.com/josecelano/mandelbrot-api)

## Links

* [Orbit traps](https://www.fractaldomains.com/tutorial/use-orbit-traps/2/)
* [Orbit visualization](http://www.stefanbion.de/fraktal-generator/z-orbits.htm)
* [Orbit periods](https://plus.maths.org/content/unveiling-mandelbrot-set) 
