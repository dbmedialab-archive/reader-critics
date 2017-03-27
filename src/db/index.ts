import * as Promise from 'bluebird';

import {
	DataTypes,
	Model,
	Sequelize,
} from 'sequelize';

// Import model definitions
import {
	Article,
	ArticleTag,
	Organisation,
} from './models';

import * as api from '../apilib';
import sequelize from './initSequelize';

const log = api.createLog();

// Create models from their definitions
const models = {
	Article: sequelize.import('article', Article),
	ArticleTag: sequelize.import('article_tag', ArticleTag),
	Organisation: sequelize.import('organisation', Organisation),
};

// Initialize Sequel..ize
sequelize
.authenticate()
.then(function(err) {
	log('Connection has been established successfully.');
})
.catch(function (err) {
	log('Unable to connect to the database:', err);
});

/*
// Create relations
// models.ArticleTag.belongsTo(models.Article);

// Sync models against database
const modelObjs: Model[] = Object.keys(models).map(key => models[key]);

sequelize.query('set foreign_key_checks = 0;')
.then(() => Promise.mapSeries(modelObjs, model => model.sync({ force: true })))
.then(() => sequelize.query('set foreign_key_checks = 1;'))

// Create model references
.then(() => {
	// @see http://docs.sequelizejs.com/en/latest/api/associations/
	console.log('Create references');
	/*
	FIXME this is not doing anything! how come? also not logging on the console
	return Promise.all([
		models.Article.hasMany(models.ArticleTag),  // , { foreignKey: 'article_id' }
		models.ArticleTag.belongsTo(models.Article),  // , { foreignKey: 'article_id' }
	]);
	* /
})

.catch(error => console.error(error.stack));
*/
