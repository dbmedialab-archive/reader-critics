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
} from 'lodash';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import EndUser from 'base/EndUser';
import Feedback from 'base/Feedback';

import {
	articleService,
	enduserService,
	feedbackService,
} from 'app/services';

import {
	NotFoundError,
	SchemaValidationError,
} from 'app/util/errors';

// Validate and store to database

export default function(data : any) : Promise <Feedback> {
	try {
		validateSchema(data);
	}
	catch (error) {
		return Promise.reject(error);
	}

	let article : Article;
	let enduser : EndUser;

	return Promise.all([
		getArticle(data.article).then((a : Article) => {
			// console.log('------------------------------------------------------------');
			// console.log('validateAndSave got article:', a);
			// console.log('\n');
			article = a;
		}),
		// Get Anonymous user from DB
		enduserService.get(null, null).then((u : EndUser) => enduser = u),
	])
	.then(() => feedbackService.save(article, enduser, data.feedback.items));
}

// Fetch article object

function getArticle(articleData : any) : Promise <Article> {
	const url = articleData.url;
	const version = articleData.version;

	return ArticleURL.from(url)
	.then(articleURL => articleService.get(articleURL, version, true))
	.then((article : Article) => (article === null
		? Promise.reject(new NotFoundError(`Article "${url}" with version "${version}" not found`))
		: article
	));
}

// Schema Validation

function validateSchema(data : any) {
	// TODO see RC-110 for schema validation
	if (!isObject(data)) {
		throw new SchemaValidationError('Invalid feedback data');
	}
	if (!isObject(data.article)) {
		throw new SchemaValidationError('Feedback data is missing "article" object');
	}
	if (!isObject(data.feedback)) {
		throw new SchemaValidationError('Feedback data is missing "feedback" object');
	}
}
