import * as Promise from 'bluebird';

import {
	Model,
	Sequelize,
} from 'sequelize';

import { createLog } from '../apilib';

import initModels from './initModels';
import sequelize from './initSequelize';

const log = createLog();

export function initDatabase() {
	log('Initializing');
	// Initialize Sequel..ize
	return sequelize.authenticate().then(initModels);
}
