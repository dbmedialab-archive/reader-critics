#FROM dbmedialab/nodejs-openjdk as javabox
FROM node:8.5.0

ENV DEBIAN_FRONTEND noninteractive

ADD package.json /tmp/package.json

RUN cd /tmp && npm install --no-optional --no-package-lock

RUN apt-get -q update && apt-get -y install rsync ca-certificates iproute2

RUN mkdir -p /opt/app/node_modules && rsync -av /tmp/node_modules/./ /opt/app/node_modules/./ && rm -rf /tmp/node_modules

COPY . /opt/app/

WORKDIR /opt/app/

RUN /bin/bash -l -c "run/lint"

RUN /bin/bash -l -c "run/build"

RUN npm prune --production

RUN npm cache clean --force

