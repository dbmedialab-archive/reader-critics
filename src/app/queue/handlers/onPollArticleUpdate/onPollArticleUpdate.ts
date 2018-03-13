//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

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
import { ObjectID } from 'app/db';
import { PollUpdateData } from 'app/services/article/ArticleService';
import { notifyEnduserAboutUpdate } from './notifyEnduserAboutUpdate';

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
	let website : Website;

	// 1 - Article URL and Website identification
	return ArticleURL.from(pollData.url).then((a : ArticleURL) => {
		articleURL = a;
		log('Polling', pollData.url.toString());
		return websiteService.identify(articleURL);
	})
	// 2 - Download the most recent version of the article
	.then((w : Website) => {
		if (w === null) {
			return Promise.reject(new Error('Polling article but could not identify its website'));
		}

		website = w;
		return articleService.fetch(website, articleURL);
	})
	// 3 - Compare the polled data to the existing article
	.then((newArticle : Article) => {
		if (newArticle.version === pollData.version) {
			log('No update found for', pollData.url);
			return;
		}

		return Promise.all([
			articleService.get(articleURL, pollData.version, false),
			update(website, newArticle, new ObjectID(pollData.ID)).then(() => newArticle),
		])
		// 4 - Check existing feedbacks and notify their endusers (if possible)
		.spread((oldRevision : Article, newRevision : Article) => (
			notifyEnduserAboutUpdate(oldRevision, newRevision)
		));
	});
}

function update(website : Website, newArticle : Article, oldID : ObjectID) : Promise <void> {
	return articleService.saveNewVersion(website, newArticle, oldID)
	.then((oldArticle : Article) => {
		log('Successfully updated %s to version %s', oldArticle.url.toString(), newArticle.version);
	});
}
