import { Sequelize } from 'sequelize';

import config from '../config';

import { createLog } from '../apilib';

const mysqlURL = config.get('mysql.url');
const log = createLog('db:sequel');

const sequelize = new Sequelize(mysqlURL, {
	logging: log,
});

export default sequelize;
