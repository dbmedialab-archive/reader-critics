import * as Promise from 'bluebird';
import * as util from 'util';

import { Model, Sequelize } from 'sequelize';

import * as api from '../apilib';

const log = api.createLog();

export default function(sql : Sequelize, models) : Promise<any> {  // TODO models: type Object{Model}
	log('Preparing models');
	const modelArr : Model[] = Object.keys(models).map(key => models[key]);

	return Promise.resolve()
	.then(() => keyChecks(sql, false))
	.then(() => syncModels(sql, modelArr))
	.then(() => keyChecks(sql, true));
}

function syncModels(sql : Sequelize, models : Model[]) : Promise<any> {
	return Promise.mapSeries(models, (model) => {
		log('Syncing %s', model.getTableName());
		return model.sync({ /* force: true */ });
	});
}

function keyChecks(sql : Sequelize, onoff : boolean) : Promise<any> {
	return sql.query(`SET foreign_key_checks = ${onoff ? '1' : '0'}`);
}
