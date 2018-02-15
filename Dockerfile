#FROM dbmedialab/nodejs-openjdk as javabox
FROM node:8.9.4-slim

ENV DEBIAN_FRONTEND noninteractive

ADD package.json /tmp/package.json

RUN cd /tmp && npm install --no-optional --no-package-lock --quiet

RUN apt-get -q update && apt-get -y install rsync ca-certificates iproute2 git

RUN mkdir -p /opt/app/node_modules && rsync -av /tmp/node_modules/./ /opt/app/node_modules/./ && rm -rf /tmp/node_modules

COPY . /opt/app/

WORKDIR /opt/app/

RUN /bin/bash -l -c "run/lint"

#ENV NODE_ENV production

RUN NODE_ENV="production" /bin/bash -l -c "run/build"

#RUN npm prune --production --no-package-lock --quiet

#RUN find /opt/app/resources -mindepth 1 -type d -exec rm -rf {} \;

#RUN rm -rf /opt/app/*.log /opt/app/*.txt /opt/app/config*json5 /opt/app/conf /opt/app/src /opt/app/stats

RUN npm cache clean --force

