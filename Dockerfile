FROM dbmedialab/nodejs-openjdk as javabox

ADD package.json /tmp/package.json
RUN bash -l -c 'cd /tmp && npm install'
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

COPY . /opt/app/

WORKDIR /opt/app/

RUN bash -l -c 'run/lint'

RUN bash -l -c 'run/build'




FROM node:8 as nodejs

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -q update && apt-get install -y ca-certificates

WORKDIR /opt/app

COPY --from=javabox /opt/app/** ./

RUN npm install --production

