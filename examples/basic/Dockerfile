FROM nheyn/async-react-router

WORKDIR /var/www/

COPY ./src /var/www/src/
COPY ./package.json /var/www/
RUN npm install --unsafe-perm

#MOVE into index.js
RUN npm install -g browserify
RUN npm install babelify
RUN mkdir ./src/statics
RUN browserify ./src/app.js -t babelify --outfile ./src/statics/app.js

CMD node /var/www/src/index.js

EXPOSE 8080