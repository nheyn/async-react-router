FROM node:0.10

#MOVED from examples/basic for speed
RUN npm install -g babel
RUN npm install -g browserify
RUN npm install babelify
#MOVED from examples/basic for speed


#COPY ./src /var/async-react-router/src/
COPY ./package.json /var/async-react-router/

WORKDIR /var/async-react-router/
RUN mkdir src/
RUN mkdir lib/
RUN npm install --unsafe-perm

#MOVED from line 9
COPY ./src /var/async-react-router/src/
#MOVED from line 9