import * as Promise from 'bluebird';
import * as util from 'util';

import { Model } from 'sequelize';

import { createLog } from '../apilib';

import * as models from './models';

import sequelize from './initSequelize';

const log = createLog();

export default function() : Promise<any> {
	return Promise.resolve()
	.then(() => keyChecks(false))
	.then(syncModels)
	.then(() => keyChecks(true));
}

function syncModels() : Promise<any> {
	const modelz : Model[] = Object.keys(models).map(key => models[key]);

	return Promise.mapSeries(modelz, (model) => {
		log('Syncing %s', model.getTableName());
		return model.sync({ force: true });
	});
}

function keyChecks(onoff : boolean) : Promise<any> {
	return sequelize.query(`SET foreign_key_checks = ${onoff ? '1' : '0'}`);
}
