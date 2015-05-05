FROM node:0.10

COPY ./src /var/async-react-router/src/
COPY ./package.json /var/async-react-router/

WORKDIR /var/async-react-router/
RUN mkdir lib/
RUN npm install --unsafe-perm