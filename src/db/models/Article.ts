import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

const Article = sequelize.define('article', {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	permalink: {
		type: DataTypes.STRING,
		allowNull: false,
		isUrl: true,
	},
	external_version: {
		type: DataTypes.STRING(64),
		allowNull: false,
	},
	internal_version: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
	},
}, withDefaults({
	updatedAt: false,
	indexes: [
		{
			name: 'article_version',
			unique: true,
			fields: ['permalink', 'external_version'],
		},
	],
}));

export default Article;
