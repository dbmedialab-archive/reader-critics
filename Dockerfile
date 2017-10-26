#FROM dbmedialab/nodejs-openjdk as javabox
FROM node:8.5.0

ENV DEBIAN_FRONTEND noninteractive

ADD package.json /tmp/package.json

RUN cd /tmp && npm install

RUN mkdir -p /opt/app/node_modules && rsync -av /tmp/node_modules/./ /opt/app/node_modules/./

COPY . /opt/app/

WORKDIR /opt/app/

RUN /bin/bash -l -c "run/lint"

RUN /bin/bash -l -c "run/build"

RUN rm -rf node_modules

RUN NODE_ENV=production && npm install --production

