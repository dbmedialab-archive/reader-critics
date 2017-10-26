#FROM dbmedialab/nodejs-openjdk as javabox
FROM node:8.5.0 as builder

ENV DEBIAN_FRONTEND noninteractive

ADD package.json /tmp/package.json

RUN apt-get -q update && apt-get -q -y install rsync

RUN /bin/bash -l -c "npm install -g yarn"

RUN /bin/bash -l -c "cd /tmp && yarn"

RUN mkdir -p /opt/app/node_modules && rsync -a /tmp/node_modules/./ /opt/app/node_modules/./

COPY . /opt/app/

WORKDIR /opt/app/

RUN /bin/bash -l -c "run/lint"

RUN /bin/bash -l -c "run/build"



FROM node:8.5.0 as nodejs

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -q update && apt-get install -y ca-certificates

WORKDIR /opt/app

COPY --from=builder /opt/app/ /opt/app/

RUN if [ -f package.json-lock ]; then rm -f package.json-lock ; fi

RUN NODE_ENV=production && yarn

