[![Build Status](https://travis-ci.com/josecelano/mandelbrot-explorer.svg?branch=master)](https://travis-ci.com/github/josecelano/mandelbrot-explorer)

# Mandelbrot Explorer

This web application shows the orbit of a given point in the Mandelbrot Set fractal.
The main reason why this project was built is to understand the "Period Checking" performance technique.
To generate the Mandelbrot Set fractal you need to calculate recursively the formula `f(z) = z² + c`, where `z` and `c` are complex numbers.
The series of values is the [orbit of the point](https://en.wikipedia.org/wiki/Orbit_trap). Points inside the Mandelbrot Set do not diverge.

"Period Checking" is based on a fractal property, some point orbits inside the Mandelbrot Set has a cycle with different period. For example, all point inside the main cardioid tends to have a fixed value, and points in the main circle (on the left of the main cardioid) have a cycle of period 2.

When you detect a cycle in an orbit you can stop the calculation of the point and save some loop iterations. THat techiche is used by fractal generation software like [Gnofract](https://github.com/fract4d/gnofract4d) 4D](<https://github.com/fract4d/gnofract4d>).

If you want to know more you can read this [period checking](https://github.com/josecelano/c-mandelbrot-arbitrary-precision/blob/master/doc/periodicity-checking.md) documentation.

![Mandelbrot Explorer](doc/img/mandelbrot-explorer-screenshot.png)

## Usage

If you just want to play a little bit on your local machine the fastest way is simply executing:

```s
docker run --rm -p80:80 josecelano/mandelbrot-explorer
```

And open <http://localhost> in your browser.

## Development

Requirements:

* Docker: 19.03.6
* Docker Compose: 1.24.1

Compiles and hot-reloads for development:

```s
./bin/dev/serve
```

Execute tests:

```s
./bin/dev/test
```

Execute linter:

```s
./bin/dev/lint
```

## Production

Compiles and minifies for production:

```s
./bin/production/build
```

Test production artifact in localhost:

```s
./bin/production/serve
```

## Deploy

You can deploy it on [Digital Ocean Kubernetes](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-on-digitalocean-kubernetes-using-helm).

You can see the `yaml` files in [deploy/k8s](deploy/k8s) folder.

Init cluster:
Deploy the app the first time:

```shell
kubectl create -f ./deploy/k8s/mandelbrot-explorer.yaml
kubectl create -f ./deploy/k8s/mandelbrot-explorer-ingress.yaml
```

Re-deploy app after changing the docker image:

```s
kubectl rollout restart deployment mandelbrot-explorer
```

After executing `create` commands you should see something like:

```s
$ kubectl get ingress
NAME                          CLASS    HOSTS                           ADDRESS           PORTS     AGE
mandelbrot-api-ingress        <none>   mandelbrot-set-periods.online   165.227.246.133   80, 443   12d
mandelbrot-explorer-ingress   <none>   mandelbrot-set-periods.online   165.227.246.133   80, 443   18m

$ kubectl get service
NAME                            TYPE           CLUSTER-IP       EXTERNAL-IP       PORT(S)                      AGE
kubernetes                      ClusterIP      10.245.0.1       <none>            443/TCP                      14d
mandelbrot-api                  ClusterIP      10.245.177.151   <none>            80/TCP                       12d
mandelbrot-explorer             ClusterIP      10.245.125.100   <none>            80/TCP                       19m
nginx-ingress-controller        LoadBalancer   10.245.180.171   165.227.246.133   80:30719/TCP,443:32694/TCP   12d
nginx-ingress-default-backend   ClusterIP      10.245.90.167    <none>            80/TCP                       12d

$ kubectl get deployment
NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
mandelbrot-api                  3/3     3            3           12d
mandelbrot-explorer             3/3     3            3           19m
nginx-ingress-controller        1/1     1            1           12d
nginx-ingress-default-backend   1/1     1            1           12d

$ kubectl get pod
NAME                                             READY   STATUS    RESTARTS   AGE
mandelbrot-api-7b89465576-8fbjc                  1/1     Running   0          10d
mandelbrot-api-7b89465576-gfnrv                  1/1     Running   0          10d
mandelbrot-api-7b89465576-qs62p                  1/1     Running   0          10d
mandelbrot-explorer-8c458947c-g2ms7              1/1     Running   0          20m
mandelbrot-explorer-8c458947c-j2pp5              1/1     Running   0          20m
mandelbrot-explorer-8c458947c-z9h4s              1/1     Running   0          20m
nginx-ingress-controller-78c67bcc77-vcp9m        1/1     Running   1          10d
nginx-ingress-default-backend-7c868597f4-wqd2z   1/1     Running   1          10d
```

## Related projects

This API uses these two command-line applications:

* [Console command to generate tiles](https://github.com/josecelano/c-mandelbrot-arbitrary-precision)
* [Console command to generate orbits](https://github.com/josecelano/mandelbrot-orbit)
* [API wrapper for console commands (tiles and orbits)](https://github.com/josecelano/mandelbrot-api)

## Links

* [Orbit traps](https://www.fractaldomains.com/tutorial/use-orbit-traps/2/)
* [Orbit visualization](http://www.stefanbion.de/fraktal-generator/z-orbits.htm)
* [Orbit periods](https://plus.maths.org/content/unveiling-mandelbrot-set)
