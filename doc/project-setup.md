# Project Setup

#### Dependencies:
* Node.js v7.10.0
* MongoDB ≥ v2.2 (DBRef feature), preferrably ≥ v3.4

#### Setup
```
git clone git@github.com:dbmedialab/reader-critics.git
npm install
```
`yarn` should work fine as well, but mind that it is currently not officially supported.

#### Database
The database initialisation will occur automatically upon first start of the main application,
if the configured database is empty at that moment. Bootstrap data for your own specific
installation will be applied, if found.

<< Update documentation with instructions as soon as this is implemented >>

#### Run
```
npm run build && node run start
```
This will build the app (TypeScript compilation) and frontend bundle (again TypeScript, then
Webpack). If all goes well, the main app will start and greet you with some output on the terminal.

The network port on which the app is listening will be printed out as soon as the initialisation
is finished and the main HTTP server is up.
