import * as express from 'express';
import * as path from 'path';

import config from './config';

export default function() {
	var app: express.Express = express();

	// Models
	for (const model of config.globFiles(config.models)) {
		require(path.resolve(model));
	}

	// Routes
	for (const route of config.globFiles(config.routes)) {
		require(path.resolve(route)).default(app);
	}

	// catch 404 and forward to error handler
	app.use((req: express.Request, res: express.Response, next: Function): void => {
		const err: Error = new Error('Not Found');
		next(err);
	});

	return app;
}
