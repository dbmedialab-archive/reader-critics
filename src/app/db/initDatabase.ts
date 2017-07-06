import * as colors from 'ansicolors';
import * as stripUrlAuth from 'strip-url-auth';
import * as Mongoose from 'mongoose';

import config from 'app/config';

import * as app from 'app/util/applib';

const log = app.createLog('db:mongo');

export default function () : Promise <any> {
	const mongoURL = config.get('mongodb.url');

	const options : MoreConnectionOptions = {
		config: {
			autoIndex: !app.isProduction,
		},
		keepAlive: 120,
		useMongoClient: true,
	};

	return Mongoose.connect(mongoURL, options)
	.then((...args) => {
		log('Connected to %s', colors.brightWhite(stripUrlAuth(mongoURL)));
		return Promise.resolve(...args);
	})
	.catch(error => {
		log('Failed to connected to %s', colors.brightRed(stripUrlAuth(mongoURL)));
		return Promise.reject(error);
	});
}

// Current @types/mongoose is missing a lot of the recent options,
// here's some overrides and extensions:

interface MoreConnectionOptions extends Mongoose.ConnectionOptions {
	autoIndex?: boolean;
	keepAlive?: number;

	// Recommended with Mongoose 4.11+ but also not yet reflected
	useMongoClient?: boolean;
}
