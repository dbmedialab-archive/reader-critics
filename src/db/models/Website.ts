import { DataTypes, Sequelize } from 'sequelize';

import withDefaults from './defaults';

const Website = (sequelize: Sequelize, types: DataTypes) => {
	return sequelize.define('website', {
		id: {
			type: types.INTEGER.UNSIGNED,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		org_id: {
			type: types.UUID,
			allowNull: false,
		},
		base_url: {
			type: types.STRING,
			allowNull: false,
			isUrl: true,
		},
		name: {
			type: types.STRING,
			allowNull: false,
		},
		master_email: {
			type: types.STRING,
			allowNull: false,
			isEmail: true,
		},
	}, withDefaults({
		indexes: [
			{
				name: 'base_url',
				unique: true,
				fields: ['base_url'],
			},
			{
				name: 'master_email',
				unique: true,
				fields: ['master_email'],
			},
		],
	}));
};

export default Website;
