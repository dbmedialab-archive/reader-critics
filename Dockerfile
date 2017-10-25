FROM dbmedialab/nodejs-openjdk as javabox

WORKDIR /src

COPY . .

RUN bash -l -c 'npm install && run/lint && run/build'

FROM node:8-alpine as nodejs

COPY --from=javabox /src/** ./

RUN apk add --no-cache ca-certificates

RUN npm install --production

