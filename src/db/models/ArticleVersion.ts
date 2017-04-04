import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

const ArticleVersion = sequelize.define('article_version', {
	article_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
	},
	internal_version: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
	},
	external_version: {
		type: DataTypes.STRING(64),
		allowNull: false,
	},
}, withDefaults({
	updatedAt: false
}));

export default ArticleVersion;
