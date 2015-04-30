FROM nheyn/async-react-router

#FOR ^
#BEACUSE npm install isn't working for ../../package.json prepublish trigger isn't working
RUN npm install -g babel
RUN babel /var/async-react-router/src -d /var/async-react-router/lib

WORKDIR /var/www/
COPY ./package.json /var/www/
RUN npm install

#MOVE into index.js
RUN npm install -g browserify
RUN npm install babelify

# Last to speed re-build speed
COPY ./src /var/www/src/

#MOVE into index.js
RUN browserify ./src/app.js -t babelify --outfile ./src/statics/app.js

CMD node /var/www/src/index.js

EXPOSE 8080