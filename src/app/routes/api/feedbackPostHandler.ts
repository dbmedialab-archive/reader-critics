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

import {
	isObject,
	isString,
} from 'lodash';

import {
	Request,
	Response,
} from 'express';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import EndUser from 'base/EndUser';

import {
	articleService,
	enduserService,
	feedbackService,
} from 'app/services';

import {
	errorResponse,
	okResponse,
} from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

type FeedbackData = {
	article: any,
	feedback: any,
	user: any,
};

export default function (requ : Request, resp : Response) : void {
	if (!checkIncomingData(requ)) {
		const msg = 'Invalid feedback data';
		log(msg, requ.body);
		return errorResponse(resp, new Error(msg), msg, {
			status: 400,
		});
	}

	const feedback : FeedbackData = requ.body;
	log('Feedback:', app.inspect(feedback));

	let article : Article;
	let user : EndUser;

	Promise.all([
		getArticle(feedback.article).then((a : Article) => article = a),
		getUser(feedback.user).then((u : EndUser) => user = u),
	])
	.then(() => {
		const fb = feedbackService.create(article, user, feedback.feedback.items);
		return feedbackService.save(fb);
	})
	.then(() => okResponse(resp))
	.catch(error => errorResponse(resp, error));
}

// Fetch article object

function getArticle(articleData : any) : Promise <Article> {
	log('getArticle', articleData);
	// TODO parameter checks?
	return ArticleURL.from(articleData.url)
	.then(url => articleService.get(url, articleData.version));
}

// Fetch user object from database or create a new one

function getUser(userData : any) : Promise <EndUser> {
	log('getUser', userData);
	const name = isString(userData.name) ? userData.name : null;
	const email = isString(userData.email) ? userData.email : null;

	return enduserService.get(name, email)
	.then((u : EndUser) => u !== null ? u : enduserService.save({
		name,
		email,
	}));
}

// Rudimentary schema check

function checkIncomingData(requ : Request) : boolean {
	const fb = requ.body || {};
	return isObject(fb)
		&& isObject(fb.article)
		&& isObject(fb.feedback)
		&& isObject(fb.user);
}
