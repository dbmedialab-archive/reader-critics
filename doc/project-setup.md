# Project Setup

## Dependencies:
* Node.js v8
* NPM v5
* MongoDB ≥ v2.4 (_upsert_, _setDefaultsOnInsert_), preferrably ≥ v3.4
* Redis ≥ v3.0

## Setup
```
git clone git@github.com:dbmedialab/reader-critics.git
npm install
```
`yarn` should work fine as well, however it has happened in the past that it resolved second level dependencies (and especially their versions) in a different way than NPM 5. This lead to conflicting `@types` packages in several cases. Due to this, NPM 5 is the recommended tool for dependency management.
NPM 5 also finally respects the indentation of the `package.json` file; be aware that we use tabs for every file type except YAML, where spaces are mandatory. This is not only a recommendation. If your commit/pull request changes the indentation, it _will be rejected_.

## Node.js
This project is based on TypeScript which runs on top of Node.js on the server side. Since Node 8 is an LTS version, it was chosen to be the preferred version to fuel the project. The `engine` structure in `package.json` defines the current minimum version that should be installed and this is in fact a hard requirement: the application will check the engine version it is launched on against the specification from `package.json` and refuse to proceed if that requirement isn't met.

It is very probable that the project also runs fine with later major versions of Node.js but that is neither tested nor officially supported.

## MongoDB
MongoDB is the main storage backend for this project, everything that should be permanently persistend is going here. We didn't opt for an instance embedded in the distributed Docker image, because the risk of accidentally removing the production database is simply too high. Instead, an appropriate cloud hosted database plan should be chosen, or if you wish to do so, you can also set up your own MongoDB instance and manage it yourself. Having regular backups is recommended and replication is supported out of the box through the driver.

## Redis
We use Redis as storage for message queues (IPC among separated nodes) and as a session cache. Data loss is not a severe problem, all data stored here is completely temporary. However it might happen that in a sudden loss of Redis stored data, active sessions become invalid and the message queue loses jobs. Those will get picked up on the next cleanup run.

Instructions on how to start Redis server locally: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis

It is possible and also recommended to use two different Redis databases for the _session data_ and the _message queue_. This does not necessarily mean using different _instances_ because Redis per default is started with 16 different database numbers per instance. Simply address different databases.

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
|:-------- |:------------ |
| `ANALYTICS_GOOGLE_TRACKING_ID` | Google GTM tracking ID to be injected in templates |
| `AUTH_BCRYPT_ROUNDS` | Number of salt rounds when hashing passwords with BCrypt |
| `AUTH_JWT_SECRET` | 64 character hexadecimal random sequence for signing JSON web tokens |
| `AUTH_SESSION_SECRET` | 64 character hexadecimal random sequence for signing session tokens |
| `AUTH_SESSION_TTL` | Lifetime of a session in minutes |
| `DEBUG`  | Logging output of the app. Recommended is at least `"app:*"` |
| `ESCALATE_THRESHOLD_DEFAULT_TO_EDITOR` | Default number of feedbacks that an article can receive before being escalated to the editor |
| `HTTP_PORT` | Network port where the HTTP server is going to listen |
| `I18N_SYS_LOCALE` | Default system locale that will be used when websites do not override |
| `MAIL_BCC_RECIPIENT` | Set this to a valid e-mail address to BCC all outgoing mail to it |
| `MAIL_SENDER_DOMAIN` | Default domain to use for sending out e-mails |
| `MAIL_TEST_OVERRIDE` | Set this to a valid e-mail address to direct ALL outgoing mail to it. Automatically disabled in production mode. |
| `MONGODB_URL` | MongoDB connection URL for the main backend database |
| `MONGODB_RECONNECTION_LIMIT` | Amount of retries for connecting to MongoDB |
| `RECAPTCHA_PUBLIC_KEY` | Public Google Recaptcha key (Suggestion Box page) |
| `RECAPTCHA_SECRET_KEY` | Secret Google Recaptcha key (Suggestion Box page) |
| `REDIS_URL_MESSAGE_QUEUE` | Redis URL for the database that holds the message queue |
| `REDIS_URL_SESSION_CACHE` | Redis URL for the database that holds the session cache |
| `SENDGRID_API_KEY` | API key for SendGrid mail service |
| `SLACK_BOTNAME` | Bot display name for the Slack integration |
| `SLACK_CHANNEL` | Channel name for the Slack integration to use for notifications. Overrides the Webhook configuration on the receiver. |
| `SLACK_WEBHOOK` | If set to a Slack webhook URL, warnings and errors will be posted to this integration |
| `WEB_CONCURRENCY` | How many cluster processes to start. If not set, takes number of CPU cores. |
