#!/bin/sh

clear

export DEBUG="*,-express:*,-finalhandler,-follow-redirects,-retry-as-promised,-send"
export NODE_ENV="development"

node out/start.js

