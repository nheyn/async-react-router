FROM node:0.10

COPY ./src /var/async-react-router/src/
COPY ./__tests__ /var/async-react-router/__tests__/
COPY ./package.json /var/async-react-router/

WORKDIR /var/async-react-router/
RUN npm install