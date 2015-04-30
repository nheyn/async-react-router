FROM nheyn/async-react-router

WORKDIR /var/www/
COPY ./src /var/www/src/
COPY ./package.json /var/www/

RUN npm install -g

CMD basic-site

EXPOSE 8080