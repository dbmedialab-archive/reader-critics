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

import * as cluster from 'cluster';
import * as colors from 'ansicolors';
import * as stripUrlAuth from 'strip-url-auth';
import * as Mongoose from 'mongoose';
import * as app from 'app/util/applib';

import { Document, Model } from 'mongoose';

import models from 'app/db/models';
import config from 'app/config';

const log = app.createLog('db:mongo');

const mongoURL = config.get('db.mongo.url');

const options : MoreConnectionOptions = {
	autoIndex: false,
	connectTimeoutMS: 4000,
	keepAlive: 120,
	poolSize: cluster.isMaster || (!cluster.isMaster && !cluster.isWorker) ? 1 : 8,
	useMongoClient: true,
	reconnectTries: Number.MAX_VALUE,
	socketTimeoutMS: 2000,
};

const reconnectionLimit = config.get('db.mongo.reconnectionLimit');
const matchTestHosts = /^mongodb:\/\/(:?localhost|mongo)(:\d+)?\/.+$/;

export function initDatabase() : Promise <void> {
	if (app.isTest && !matchTestHosts.test(mongoURL)) {
		return Promise.reject(new Error(
			'Refusing to run test environment on an unknown database host! ' +
			`Configured host "${mongoURL}" does not match ${matchTestHosts.source} -- ` +
			`Check regular expression "matchTestHosts" in ${__filename.replace(app.rootPath, '')}`
		));
	}
	return initiateConnection().then(() => ensureIndexes());
}

export function closeDatabase() : Promise <void> {
	return Mongoose.connection.close();
}

// Create initial connection, retry if necessary (e.g. connection error)

let reconnectionAmount = 1;

function initiateConnection() : Promise <void> {
	return new Promise((resolve, reject) => {
		log('Connecting to', colors.brightWhite(stripUrlAuth(mongoURL)));
		Mongoose.connect(mongoURL, options)
		.then(() => {
			log('Connection ready');
			reconnectionAmount = 1;
			resolve();
		})
		.catch(error => {
			const reconnectionCooldown = Math.min(Math.pow(reconnectionAmount++, 2), 60);
			log('Failed to connected to database:', error.message);

			if (reconnectionAmount < reconnectionLimit) {
				log(`Retry in ${reconnectionCooldown} seconds`);
				setTimeout(() => resolve(initiateConnection()), reconnectionCooldown * 1000);
			}
			else {
				reject(error);
			}
		});
	});
}

// Ensure all collection indexes are created. Due to Mongoose's buggy auto index
// feature, we have to do this manually and one collection after another here,
// otherwise this can create a race condition with concurrent access (queries
// colliding with MongoDB background job that creates the indexes)
// The flaw is documented, suggested fix is to actually do it like here.

function ensureIndexes() : Promise <void> {
	if (cluster.isWorker) {
		return Promise.resolve();  // Only initialize indexes on the master process
	}

	return new Promise((resolve, reject) => {
		Promise.mapSeries(Object.values(models), ensureIndex)
		.then(() => resolve())
		.catch(error => reject(error));
	});
}

function ensureIndex <T extends Document> (model : Model<T>) : Promise <void> {
	return model.ensureIndexes();
}

// Current @types/mongoose is missing a lot of the recent options,
// here's some overrides and extensions:

interface MoreConnectionOptions extends Mongoose.ConnectionOptions {
	autoIndex? : boolean
	connectTimeoutMS? : number
	keepAlive? : number
	poolSize? : number
	reconnectInterval? : number
	reconnectTries? : number
	socketTimeoutMS? : number
	// Recommended with Mongoose 4.11+ but also not yet reflected
	useMongoClient? : boolean
}
