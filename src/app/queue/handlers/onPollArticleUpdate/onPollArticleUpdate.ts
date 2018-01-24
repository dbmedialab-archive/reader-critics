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

function pollArticle(pollData : PollUpdateData) : Promise <void> {
	let articleURL : ArticleURL;

	// 1 - Article URL and Website identification
	return ArticleURL.from(pollData.url).then((a : ArticleURL) => {
		articleURL = a;
		log('Polling', pollData.url.toString());
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
		if (article.version === pollData.version) {
			log('No update found for', pollData.url);
			return;
		}

		return storeUpdatedArticle(article, pollData);
		// Later when comparing article updates to inform users about it, this is
		// the place where the app should either fire another queue message to
		// trigger comparing "old" versus "updated" or, rather maybe, do that
		// job right here (but in another function, of course).
		// This could very well be its own module inside this handler directory.
	});
}

function storeUpdatedArticle(newArticle : Article, pollData : PollUpdateData) : Promise <void> {
	return Promise.resolve();
}
