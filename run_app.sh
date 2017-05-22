#!/bin/sh

clear

export DEBUG="*,-express:*,-finalhandler,-follow-redirects,-retry-as-promised,-send"
export NODE_ENV="development"

#npm run build:front && npm run build:app && cd out/app && node main.js

node out/start.js

