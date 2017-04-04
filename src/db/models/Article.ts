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
}, withDefaults());

export default Article;
