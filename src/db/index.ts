import * as Promise from 'bluebird';

import {
	DataTypes,
	Model,
	Sequelize,
} from 'sequelize';

import * as api from '../apilib';

// Import model definitions
import {
	Article,
	ArticleTag,
	Author,
	Organisation,
} from './models';

import initModels from './initModels';
import sequelize from './initSequelize';

const log = api.createLog();

// Create models from their definitions
const models = {
	Article: sequelize.import('article', Article),
	ArticleTag: sequelize.import('article_tag', ArticleTag),
	Author: sequelize.import('author', Author),
	Organisation: sequelize.import('organisation', Organisation),
};

export function initDatabase() {
	log('Initialize');
	// Initialize Sequel..ize
	return sequelize.authenticate()
	.then(() => {
		// @see http://docs.sequelizejs.com/en/latest/api/associations/
		log('Create table references');
		return Promise.all([
			models.ArticleTag.belongsTo(models.Article, { foreignKey: 'article_id' }),
		]);

	})
	.then(() => initModels(sequelize, models));
}
