import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

import Organisation from './Organisation';

const Website = sequelize.define('website', {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	org_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	base_url: {
		type: DataTypes.STRING,
		allowNull: false,
		isUrl: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	master_email: {
		type: DataTypes.STRING,
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

Website.belongsTo(Organisation, {
	foreignKey: 'org_id',
});

export default Website;
