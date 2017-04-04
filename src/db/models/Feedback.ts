import { DataTypes } from 'sequelize';

import sequelize from '../initSequelize';
import withDefaults from '../modelDefaults';

import Article from './Article';

const Feedback = sequelize.define('feedback', {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	article_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
	},
	user_id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
	},
}, withDefaults({
	updatedAt: false,
	indexes: [
		{
			name: 'feedback_index',
			fields: ['article_id', 'user_id'],
		},
	],
}));

Feedback.belongsTo(Article, {
	foreignKey: 'article_id',
});

export default Feedback;
