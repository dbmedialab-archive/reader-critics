import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

import Article from './Article';

const ArticleElement = sequelize.define('article_element', {
	article_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
	},
	order: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
	},
	type: {
		type: DataTypes.ENUM(
			'headline',
			'paragraph',
			'imgcaption',
		),
		allowNull: false,
	},
	metadata: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
}, withDefaults({
	timestamps: false,
}));

ArticleElement.belongsTo(Article, {
	foreignKey: 'article_id',
});

export default ArticleElement;
