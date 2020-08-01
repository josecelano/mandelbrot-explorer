FROM node:10-alpine as builder

WORKDIR /build

COPY package.json /build/
COPY yarn.lock /build/

RUN yarn install

COPY . /build/

RUN yarn build

FROM nginx:1.16.1-alpine as client

COPY --from=builder /build/dist /var/www

COPY docker/config/nginx/default.conf /etc/nginx/conf.d/default.conf