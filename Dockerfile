#FROM dbmedialab/nodejs-openjdk as javabox
FROM node:8.5.0

ENV DEBIAN_FRONTEND noninteractive

ADD package.json /tmp/package.json

RUN apt-get -q update && apt-get -q -y install rsync ca-certificates && apt-get clean

RUN /bin/bash -l -c "npm install -g yarn@1.2.1"

RUN /bin/bash -l -c "cd /tmp && NODE_ENV=development && yarn"

RUN mkdir -p /opt/app/node_modules && rsync -a /tmp/node_modules/./ /opt/app/node_modules/./

COPY . /opt/app/

WORKDIR /opt/app/

RUN /bin/bash -l -c "run/lint"

RUN /bin/bash -l -c "run/build"

RUN NODE_ENV=production && yarn install --production

