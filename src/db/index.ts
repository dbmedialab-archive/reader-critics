import * as Promise from 'bluebird';

import {
	Model,
	Sequelize,
} from 'sequelize';

import * as api from '../apilib';

import * as models from './models';

import initModels from './initModels';
import sequelize from './initSequelize';

const log = api.createLog();

export function initDatabase() {
	log('Initializing');
	// Initialize Sequel..ize
	return sequelize.authenticate().then(initModels);
}
