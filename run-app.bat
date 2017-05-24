set DEBUG=*,-express:*,-finalhandler,-follow-redirects,-retry-as-promised,-send
set NODE_ENV=production

nodemon ./out/start.js
