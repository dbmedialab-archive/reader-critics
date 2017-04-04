import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

const User = sequelize.define('user', {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	user_name: {
		type: DataTypes.STRING(64),
		allowNull: false,
	},
	full_name: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		isEmail: true,
	},
	metadata: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
}, withDefaults({
	updatedAt: false,
	indexes: [
		{
			name: 'user_index',
			fields: ['user_name'],
		},
		{
			name: 'email_index',
			fields: ['email'],
		},
	],
}));

export default User;
