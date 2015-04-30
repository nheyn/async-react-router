FROM nheyn/async-react-router

#FOR ^
#BEACUSE npm install isn't working for ../../package.json prepublish trigger isn't working
RUN npm install -g babel
RUN babel /var/async-react-router/src -d /var/async-react-router/lib

WORKDIR /var/www/
COPY ./src /var/www/src/
COPY ./package.json /var/www/

#BEACUSE npm install isn't working for ./package.json preinstall trigger isn't working
RUN babel /var/www/src/index.js -o /var/www/src/index.es5.js
#FOR v

RUN npm install

CMD node /var/www/src/index.es5.js

EXPOSE 8080