import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

const Organisation = sequelize.define('organisation', {
	uuid: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, withDefaults({
	indexes: [
		{
			name: 'org_name',
			unique: true,
			fields: ['name'],
		},
	],
}));

export default Organisation;
