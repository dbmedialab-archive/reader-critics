// Util path, add relative import base

import 'source-map-support/register';

import * as findRoot from 'find-root';
import * as path from 'path';

import { addPath } from 'app-module-path';

export const rootPath : string = findRoot(path.dirname(require.main.filename));

addPath(path.join(rootPath, 'out'));

// Use Bluebird globally

import * as Promise from 'bluebird';

// Initialize and start this tool

import * as app from 'app/util/applib';
import * as Mongoose from 'mongoose';

import { initDatabase } from 'app/db';
import { wrapFind } from 'app/db/common';

import { Article } from 'base/Article';
import { ArticleItem } from 'base/ArticleItem';
import { ArticleItemType } from 'base/ArticleItemType';
import { Website } from 'base/Website';

import {
	articleService,
	websiteService,
} from 'app/services';

import {
	ArticleDocument,
	ArticleModel,
} from 'app/db/models';

const log = app.createLog('migrator');

Promise.resolve()
	.then(initDatabase)
	.then(migrateDatabase)
	.catch(error => log(error));

// Migration code

const websites = {};

function migrateDatabase() {
	log('Querying database ...');
	return wrapFind <ArticleDocument, Article> (ArticleModel.find({
		'title': {
			'$exists': false,
		},
	}).populate('website'))
	.then((results : Article[]) => {
		log('%d articles', results.length);
		const promises = [];

		results.forEach(article => {
			promises.push(migrateTitle(article));
		});

		return Promise.all(promises);
	})
	.finally(() => {
		Mongoose.connection.close();
	});
}

function migrateTitle(article : Article) {
	let item = article.items.find((i : ArticleItem) => i.type === ArticleItemType.MainTitle);

	if (item === undefined) {
		item = article.items.find((i : ArticleItem) => i.type === ArticleItemType.SubTitle);
	}

	if (item === undefined) {
		log('No title for article %s, fetching it ...', article.ID);

		return getWebsite(article)
		.then((website) => {
			return articleService.fetch(website, article.url)
			.then((fetched) => {
				return updateArticle(article.ID, fetched.title);
			});
		});
	}
	else {
		const title = item.text;
		return updateArticle(article.ID, title);
	}
}

function updateArticle(ID : string, title : string) {
	log('Updated %s to "%s"', ID, title);
	return ArticleModel.findOneAndUpdate(
		{
			_id : ID,
		},
		{
			'$set': {
				title,
			},
		}
	);
}

function getWebsite(article : Article) : Promise <Website> {
	const websiteID = article.website.ID;

	if (websites[websiteID]) {
		return Promise.resolve(websites[websiteID]);
	}

	return Promise.resolve(websiteService.getByID(websiteID))
	.then(website => {
		websites[websiteID] = website;
		return website;
	});
}
