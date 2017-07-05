import * as colors from 'ansicolors';
import * as Mongoose from 'mongoose';
import * as stripUrlAuth from 'strip-url-auth';

import config from 'app/config';

import * as app from 'app/util/applib';

Mongoose.Promise = global.Promise;

const log = app.createLog('db:mongo');

export default function () {
	const mongoURL = config.get('mongodb.url');
	const options = {
		keepAlive: 120,
		useMongoClient: true,  // Recommended with Mongoose 4.11+
	};

	// TODO set config.autoIndex to false in production
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
