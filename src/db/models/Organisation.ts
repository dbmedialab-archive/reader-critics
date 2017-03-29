import { DataTypes, Sequelize } from 'sequelize';

import withDefaults from './defaults';

const Organisation = (sequelize: Sequelize, types: DataTypes) => {
	return sequelize.define('organisation', {
		uuid: {
			type: types.UUID,
			primaryKey: true,
			defaultValue: types.UUIDV4,
		},
		name: {
			type: types.STRING,
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
};

export default Organisation;
