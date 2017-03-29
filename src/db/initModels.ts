import * as Promise from 'bluebird';
import * as util from 'util';

import { Sequelize } from 'sequelize';

import * as api from '../apilib';

const log = api.createLog();

export default function(sql : Sequelize, models) : Promise<any> {
	log('Preparing models');
	return Promise.resolve()
	.then(() => keyChecks(sql, false))
	.then(() => syncModels(sql, models))
	.then(() => keyChecks(sql, true));
}

function syncModels(sql : Sequelize, models) : Promise<any> {
	return Promise.mapSeries(values(models), (model) => {
		console.dir(model);
		return model.sync({ force: true });
	});
}

function keyChecks(sql : Sequelize, onoff : boolean) : Promise<any> {
	return sql.query(`SET foreign_key_checks = ${onoff ? '1' : '0'}`);
}

const values = (obj) => Object.keys(obj).map(key => obj[key]);
