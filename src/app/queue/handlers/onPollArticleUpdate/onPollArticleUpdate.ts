import * as app from 'app/util/applib';

import {
	DoneCallback,
	Job,
} from 'kue';

import {
	Article,
	Website
} from 'base';

import {
	articleService,
	websiteService,
} from 'app/services';

import { ArticleURL } from 'base/ArticleURL';
import { PollUpdateData } from 'app/services/article/ArticleService';

const log = app.createLog();

export function onPollArticleUpdate(job : Job, done : DoneCallback) : void {
	pollArticle(job.data as PollUpdateData)
	.then(() => {
		done();
		return null;
	})
	.catch(error => {
		if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
			log('Network problem while trying to fetch article (%s)', error.code);
		}
		else {
			app.yell(error);
		}
		return done(error);
	});
}

function pollArticle(poll : PollUpdateData) : Promise <void> {
	let articleURL : ArticleURL;

	// 1 - Article URL and Website identification
	return ArticleURL.from(poll.url).then((a : ArticleURL) => {
		articleURL = a;
		log('Polling', poll.url.toString());
		return websiteService.identify(articleURL);
	})
	// 2 - Download the most recent version of the article
	.then((website : Website) => {
		if (website === null) {
			return Promise.reject(new Error('Polling article but could not identify its website'));
		}

		return articleService.fetch(website, articleURL);
	})
	.then((article : Article) => {
		log('fetched ...', article.version);
		log('local .....', poll.version);
	});
}
