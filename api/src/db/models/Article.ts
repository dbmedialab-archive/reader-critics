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
		url: {
			type: types.STRING,
			allowNull: false,
			isUrl: true,
		},
	}, withDefaults({
		updatedAt: false,
		indexes: [
			{
				name: 'article_url',
				unique: true,
				fields: ['url'],
			}
		]
	}));
};

export default Article;
