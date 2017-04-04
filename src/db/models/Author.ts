import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

import Website from './Website';

const Author = sequelize.define('author', {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	website_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
	},
	full_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		isEmail: true,
	},
}, withDefaults({
	updatedAt: false,
	indexes: [
		{
			name: 'author_email',
			unique: true,
			fields: ['email'],
		},
	],
}));

Author.belongsTo(Website, {
	foreignKey: 'website_id',
});

export default Author;
