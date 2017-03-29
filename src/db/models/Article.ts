import { DataTypes, Sequelize } from 'sequelize';

import withDefaults from './defaults';

const Article = (sequelize: Sequelize, types: DataTypes) => {
	return sequelize.define('article', {
		id: {
			type: types.INTEGER.UNSIGNED,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		permalink: {
			type: types.STRING,
			allowNull: false,
			isUrl: true,
		},
		external_version: {
			type: types.STRING(64),
			allowNull: false,
		},
		internal_version: {
			type: types.INTEGER.UNSIGNED,
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
};

export default Article;
