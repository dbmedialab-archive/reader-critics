//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as colors from 'ansicolors';
import * as stripUrlAuth from 'strip-url-auth';
import * as Mongoose from 'mongoose';

import config from 'app/config';

import * as app from 'app/util/applib';

const log = app.createLog('db:mongo');

export default function () : Promise <void> {
	const mongoURL = config.get('mongodb.url');

	const options : MoreConnectionOptions = {
	//	autoIndex: !app.isProduction,  // Option not supported, although the docs mention it
		connectTimeoutMS: 4000,
		keepAlive: 120,
		useMongoClient: true,
		reconnectTries: Number.MAX_VALUE,
		socketTimeoutMS: 2000,
	};

	log('Connecting to', colors.brightWhite(stripUrlAuth(mongoURL)));

	return Mongoose.connect(mongoURL, options)
	.then(() => {
		log('Connection ready');
	})
	.catch(error => {
		log('Failed to connected to database:', error.message);
		return Promise.reject(error);
	});
}

// Current @types/mongoose is missing a lot of the recent options,
// here's some overrides and extensions:

interface MoreConnectionOptions extends Mongoose.ConnectionOptions {
	autoIndex?: boolean;
	connectTimeoutMS?: number;
	keepAlive?: number;
	reconnectTries?: number;
	socketTimeoutMS?: number;

	// Recommended with Mongoose 4.11+ but also not yet reflected
	useMongoClient?: boolean;
}
