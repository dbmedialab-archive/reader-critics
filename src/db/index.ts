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
	ArticleElement,
	ArticleTag,
	Author,
	Organisation,
	Website,
} from './models';

import initAssociations from './initAssociations';
import initModels from './initModels';
import sequelize from './initSequelize';

const log = api.createLog();

// Create models from their definitions
const models = {
	Article: sequelize.import('article', Article),
	ArticleElement: sequelize.import('article_element', ArticleElement),
	ArticleTag: sequelize.import('article_tag', ArticleTag),
	Author: sequelize.import('author', Author),
	Organisation: sequelize.import('organisation', Organisation),
	Website: sequelize.import('website', Website),
};

export function initDatabase() {
	log('Initializing');
	// Initialize Sequel..ize
	return sequelize.authenticate()
	.then(() => initAssociations(sequelize, models))
	.then(() => initModels(sequelize, models));
}
