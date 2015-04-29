FROM node:0.10

COPY ./src /var/async-flux-router/src/
COPY ./__tests__ /var/async-flux-router/__tests__/
COPY ./package.json /var/async-flux-router/

WORKDIR /var/www/
RUN npm install /var/async-flux-router/
#TODO, finish settings up www file for http server

EXPOSE 80