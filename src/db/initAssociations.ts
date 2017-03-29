import {
	Model,
	Sequelize,
} from 'sequelize';

import * as api from '../apilib';

const log = api.createLog();

/**
 * @see http://docs.sequelizejs.com/en/latest/api/associations/
 */
export default function(sql : Sequelize, models) {  // TODO models: type Object{Model}

	log('Creating table references');

	return Promise.all([
		models.ArticleElement.belongsTo(models.Article, {
			foreignKey: 'article_id',
		}),
		models.ArticleTag.belongsTo(models.Article, {
			foreignKey: 'article_id',
		}),
		models.Author.belongsTo(models.Website, {
			foreignKey: 'website_id',
		}),
		models.Website.belongsTo(models.Organisation, {
			foreignKey: 'org_id',
		}),
	]);
}
