# Project Setup

## Dependencies:
* Node.js ≥ v8.1.4
* NPM ≥ v5.0
* MongoDB ≥ v2.4 (_upsert_, _setDefaultsOnInsert_), preferrably ≥ v3.4
* Redis ≥ v3.0

## Setup
```
git clone git@github.com:dbmedialab/reader-critics.git
npm install
```
`yarn` should work fine as well, however it has happened in the past that it resolved second level dependencies (and especially their versions) in a different way than NPM 5. This lead to conflicting `@types` packages in several cases. Due to this, NPM 5 is the recommended tool for dependency management.
NPM 5 also finally respects the indentation of the `package.json` file; be aware that we use tabs for every file type except YAML, where spaces are mandatory. This is not only a recommendation. If your commit/pull request changes the indentation, it _will be rejected_.

## MongoDB
MongoDB is the main storage backend for this project, everything that should be permanently persistend is going here. We didn't opt for an instance embedded in the distributed Docker image, because the risk of accidentally removing the production database is simply too high. Instead, an appropriate cloud hosted database plan should be chosen, or if you wish to do so, you can also set up your own MongoDB instance and manage it yourself. Having regular backups is recommended and replication is supported out of the box through the driver.

## Redis
We use Redis as storage for message queues (IPC among separated nodes) and as a session cache. Data loss is not a severe problem, all data stored here is completely temporary. However it might happen that in a sudden loss of Redis stored data, active sessions become invalid and the message queue loses jobs. Those will get picked up on the next cleanup run.
Instructions on how to start Redis server locally: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis

## Run
```
npm run build && npm run start
```
This will build the app (TypeScript compilation) and frontend bundle (again TypeScript, then
Webpack). If all goes well, the main app will start and greet you with some output on the terminal.

The network port on which the app is listening will be printed out as soon as the initialisation
is finished and the main HTTP server is up.

## Shell Scripts
There are a few Bash scripts in the `/run` folder which will make developing easier. The script for running the test suites is quite long already, and since the Contiguous Integration is using this one for running all the tests, you should do the same.

| Script | What it does |
| ------ | ------------ |
| `run/app`   | Starts the app. Don't forget to build first! |
| `run/build` | Runs the TypeScript compiler and then Webpack to create the frontend bundle |
| `run/lint`  | Lint all the sources. Required for passing the CI. |
| `run/test`  | Runs all test suites. If one breaks, the rest will be skipped. |

## Environment Variables
The app has its default configuration, but often you will want to modify its behaviour. For example, without setting the `DEBUG` variable, you won't get anything on your terminal from a running app, because the `debug` module silences itself unless you ask it to do otherwise.

| Variable | What it does |
| -------- | ------------ |
| `DEBUG`  | Logging output of the app. Recommended is at least `"app:*"` |
| `HTTP_PORT` | Which port to listen on |
| `WEB_CONCURRENCY` | How many cluster processes to start. If not set, takes number of CPU cores. |
