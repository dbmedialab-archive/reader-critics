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

import * as cryptoRandomString from 'crypto-random-string';
import * as app from 'app/util/applib';

import { isObject } from 'lodash';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import EndUser from 'base/EndUser';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';
import FeedbackStatus from 'base/FeedbackStatus';

import {
	articleService,
	enduserService,
	feedbackService,
} from 'app/services';

import {
	NotFoundError,
	SchemaValidationError,
} from 'app/util/errors';

/**
 * Intermediate type for internal use, used between validation and persistence.
 */
type RawArticle = {
	article? :  Article, //TODO testing have to check
	feedback? : {
		items? :  Array <FeedbackItem>, //TODO testing have to check
	},
};

const testToken = 'one-shot-test-token';
let testTokenIncrement = 1;

/**
 * Validate and store to database
 */
export function validateAndSave(data : {}) : PromiseLike <Feedback> {
	return validateSchema(data)
	// Collect all the objects that we need to create and persist a new Feedback
	.then((rawArticle : RawArticle) => Promise.all([
		getArticle(rawArticle.article),
		getAnonymousEndUser(),
		// These are synchronous, but work nonetheless with Promise.all()
		rawArticle.feedback.items,
		getOneShotToken(),
	]))
	// After gathering all the necessary data, persist the new Feedback
	// object to the database
	.spread(storeFeedback)
	// Update article object with reference to the new feedback object
	.then(({ article, feedback } : { article : Article, feedback : Feedback}) => {
		return articleService.addFeedback(article, feedback).then(() => feedback);
	});
}

function storeFeedback( //TODO testing types !done
		article: Article,
		enduser: EndUser,
		items: Array <FeedbackItem>,
		oneshotUpdateToken: string
	) {
	return feedbackService.save(
		article,
		enduser,
		items,
		FeedbackStatus.AwaitEnduserData,
		oneshotUpdateToken
	)
	.then((feedback) => ({
		article,
		feedback,
	}));
}

/**
 * Fetch article object belonging to the new feedback
 */
function getArticle(articleData : any) : Promise <Article> {
	const url = articleData.url;
	const version = articleData.version;

	return ArticleURL.from(url)
	.then(articleURL => articleService.get(articleURL, version, true))
	.then((article: Article|PromiseLike <Article>) => (article === null
		//TODO testing was Article done
				? Promise.reject(new NotFoundError(`Article "${url}" with version "${version}" not found`))
				: article));
}

/**
 * Fetch the anonymous enduser; initially the feedback will be linked to that
 * user until the real enduser has typed in his data into the frontend site
 * and has submitted this "update". If the user
 */
function getAnonymousEndUser() : Promise <EndUser> {
	return enduserService.get();  // Yes, it's really that easy!
}

/**
 * Generate a (cryptographically strong) random string for the enduser data
 * one shot update token.
 */
function getOneShotToken() : string {
	// 368 bytes of random. Yes, an unusual number!
	// Use a fixed update token when in test mode (that is matched by the mock data)
	return app.isTest ? `${testToken}-${testTokenIncrement++}` : cryptoRandomString(92);
}

/**
 * Schema Validator
 */
function validateSchema(data : {}) : Promise <RawArticle> {
	// TODO see RC-110 for schema validation
	if (!isObject(data)) {
		return Promise.reject(new SchemaValidationError(
			'Invalid feedback data'
		));
	}
	if (!isObject(data['article'])) {
		return Promise.reject(new SchemaValidationError(
			'Feedback data is missing "article" object'
		));
	}
	if (!isObject(data['feedback'])) {
		return Promise.reject(new SchemaValidationError(
			'Feedback data is missing "feedback" object'
		));
	}

	return Promise.resolve(data as RawArticle);  // cast to intermediate type
}
