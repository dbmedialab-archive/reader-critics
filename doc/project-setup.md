# Project Setup

### Dependencies:
* Node.js v7.10.0
* MongoDB ≥ v2.2 (DBRef feature), preferrably ≥ v3.4

### Setup
```
git clone git@github.com:dbmedialab/reader-critics.git
npm install
```
`yarn` does work fine as well, is a whole lot faster and also **required** for adding new dependencies, if you don't have at least NPM v5.0! Previous versions of NPM always rewrite the whole _package.json_ with space indentation. If your commit/pull request changes the indentation, it _will be rejected_.

### Redis
We use Redis to store session data about authentication for admin pages. Instructions on how to start Redis server locally:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis

### Database
_<< Update documentation with instructions as soon as this is implemented >>_

### Run
```
npm run build && npm run start
```
This will build the app (TypeScript compilation) and frontend bundle (again TypeScript, then
Webpack). If all goes well, the main app will start and greet you with some output on the terminal.

The network port on which the app is listening will be printed out as soon as the initialisation
is finished and the main HTTP server is up.

### Shell Scripts
There are a few Bash scripts in the `/run` folder which will make developing easier. The script for running the test suites is quite long already, and since the Contiguous Integration is using this one for running all the tests, you should do the same.

| Script | What it does |
| ------ | ------------ |
| `run/app`   | Starts the app. Don't forget to build first! |
| `run/build` | Runs the TypeScript compiler and then Webpack to create the frontend bundle |
| `run/lint`  | Lint all the sources. Required for passing the CI. |
| `run/test`  | Runs all test suites. If one breaks, the rest will be skipped. |

### Environment Variables
The app has its default configuration, but often you will want to modify its behaviour. For example, without setting the `DEBUG` variable, you won't get anything on your terminal from a running app, because the `debug` module silences itself unless you ask it to do otherwise.

| Variable | What it does |
| -------- | ------------ |
| `DEBUG`  | Logging output of the app. Recommended is at least `"app:*"` |
| `HTTP_PORT` | Which port to listen on |
| `WEB_CONCURRENCY` | How many cluster processes to start. If not set, takes number of CPU cores. |
