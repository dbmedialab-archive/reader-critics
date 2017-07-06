import { ArticleModel } from 'app/db/models';

import {
	Article,
	ArticleURL,
	Website,
} from 'base/';

import * as app from 'app/util/applib';
const log = app.createLog();

export function load(url : ArticleURL, version : string) : Promise <Article> {
	return Promise.resolve(undefined);
}

export function save(website : Website, article : Article) : Promise <void> {
	log('Saving', article.url.href);
	return new ArticleModel(article).save().then(savedObj => {
		log(app.inspect(savedObj));
		return Promise.resolve();
	});
}
