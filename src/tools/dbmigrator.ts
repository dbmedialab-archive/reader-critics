// Util path, add relative import base

import * as findRoot from 'find-root';
import * as path from 'path';

import { addPath } from 'app-module-path';

export const rootPath : string = findRoot(path.dirname(require.main.filename));

addPath(path.join(rootPath, 'out'));

// Use Bluebird globally

import * as Bluebird from 'bluebird';

global.Promise = Bluebird;

// Initialize and start this tool

import * as app from 'app/util/applib';
import * as Mongoose from 'mongoose';

import { initDatabase } from 'app/db';
import { ArticleModel } from 'app/db/models';

const log = app.createLog('migrator');

Promise.resolve()
	.then(initDatabase)
	.then(migrateDatabase)
	.catch(error => log(error));

// Migration code

function migrateDatabase() : Promise <any> {
	return ArticleModel
	.count({}).then(result => {
		log('%d articles found', result);
		Mongoose.connection.close();
	});
}
