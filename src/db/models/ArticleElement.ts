import { DataTypes, Sequelize } from 'sequelize';

import withDefaults from './defaults';

const ArticleElement = (sequelize: Sequelize, types: DataTypes) => {
	return sequelize.define('article_element', {
		article_id: {
			type: types.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true,
		},
		order: {
			type: types.INTEGER.UNSIGNED,
			allowNull: false,
		},
		type: {
			type: types.ENUM(
				'headline',
				'paragraph',
				'imgcaption',
			),
			allowNull: false,
		},
		metadata: {
			type: types.TEXT,
			allowNull: false,
		},
	}, withDefaults({
		timestamps: false,
	}));
};

export default ArticleElement;
