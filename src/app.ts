import * as bluebird from 'bluebird';
import * as express from 'express';
import * as http from 'http';
import * as mysql from 'mysql';
import * as util from 'util';

import axios from 'axios';

import config from './config';
import router from './routes';

global.Promise = bluebird;

const debug = api.createDebugChannel();

debug('Starting Kildekritikk API');

// Create Express application
const app = express();

const httpPort = config.get('http.port') || 4001;
const httpServer = http.createServer(app);

// Main application startup
Promise.resolve()  // This will be replaced by other initialization calls, e.g. database and such
.then(startHTTP)
.catch(error => console.error(error.stack));

app.use('/', router);

function startHTTP() {
	httpServer.listen(httpPort, () => {
		debug(`Reader Critic API running on port ${httpPort} in ${config.get('env')} mode`);
	});
}

/*
Later!
const connection = mysql.createConnection(`${config.get('mysql.url')}&charset=utf8_general_ci`);

connection.connect (function (err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log ('connected as id ' + connection.threadId);
});
*/

/*
.then(() => {
  // Start HTTP server

  httpServer.listen(httpPort, () => {
    debug(`Aurora API running on port ${httpPort} in ${config.get('env')} mode`);
    recordEvent('worker_start');

    // If this is the test environment, then there will be a master script waiting for the API service
    // to settle. Send a "we're ready, proceed" signal to this process:
    if (aurora.isTestEnv && process.env.MASTER_PID) {
      const masterPID = parseInt(process.env.MASTER_PID);
      if (masterPID > 0) {
        process.kill(masterPID, 'SIGUSR2');
      }
    } // if (process.env)
  });
})
.catch((error) => {
  console.error(error.stack);
});*/
