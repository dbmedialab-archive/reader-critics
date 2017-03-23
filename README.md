# Reader-critics

[![Greenkeeper badge](https://badges.greenkeeper.io/dbmedialab/Reader-critics.svg?token=a55103c0252ec9f2b14f7bb9af0229280aeba52887991f94b78b271f245e9f0c)](https://greenkeeper.io/)
Leserkritikk versjon 2

### API

Dependencies:
* Node.js 7.7
* MySQL 5.6

##### Setup
```
git clone git@github.com:dbmedialab/Reader-critics.git
cd api
npm install
```
Of course, `yarn` works fine as well!

Initialise your local MySQL with a database and user:
```
CREATE DATABASE IF NOT EXISTS readercritics;
CREATE USER 'readercritics'@'localhost' IDENTIFIED BY "secret%123";
GRANT ALL ON readercritics.* TO 'readercritics'@'localhost';
```

##### Run
```
npm run build && node run start
```

