FROM dbmedialab/nodejs-openjdk as javabox

ENV DEBIAN_FRONTEND noninteractive

ADD package.json /tmp/package.json

RUN apt-get -q update && apt-get -q -y install rsync

RUN bash -l -c 'cd /tmp && npm install'

RUN mkdir -p /opt/app/node_modules && rsync -av /tmp/node_modules/./ /opt/app/node_modules/./

COPY . /opt/app/

#RUN rm -rf /opt/app/node_modules/* && rsync -av /tmp/node_modules/./ /opt/app/node_modules/./

WORKDIR /opt/app/

RUN bash -l -c 'run/lint'

RUN bash -l -c 'run/build'




FROM node:8 as nodejs

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -q update && apt-get install -y ca-certificates

WORKDIR /opt/app

COPY --from=javabox /opt/app/** ./

RUN npm install --production

