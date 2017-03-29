import { Sequelize } from 'sequelize';

import config from '../config';

import * as api from '../apilib';

const mysqlURL = config.get('mysql.url');
const log = api.createLog('db:sequel');

const sequelize = new Sequelize(mysqlURL, {
	logging: log,
});

export default sequelize;
