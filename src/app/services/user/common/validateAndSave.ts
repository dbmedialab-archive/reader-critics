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
	isEmpty,
} from 'lodash';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import EndUser from 'base/EndUser';
import User from 'base/User';

import {
	articleService,
	enduserService,
	feedbackService,
	userService,
} from 'app/services';

import {
	UserModel
} from 'app/db/models';

import {
	NotFoundError,
	SchemaValidationError,
} from 'app/util/errors';

// Validate and store to database

export default function(data : any) : Promise <any> {
	try {
		validateSchema(data);
		return Promise.resolve(data);
	}
	catch (error) {
		return Promise.reject(error);
	}

	/*let article : Article;
	let user : EndUser;

	return Promise.all([
		getArticle(data.article).then((a : Article) => article = a),
		getEndUser(data.user).then((u : EndUser) => user = u),
	])
	.then(() => feedbackService.save(article, user, data.feedback.items));*/
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

// Fetch user object from database or create a new one

function filterUniqueEmail(userMail : string) : boolean {
	const exists = userService.getByEmail('Christoph Schmitz');
	if (exists) {
		return true;
	}
	
	return false;
}

// Schema Validation

function validateSchema(data : any) {
	// TODO see RC-110 for schema validation
	if (!isObject(data)) {
		throw new SchemaValidationError('Invalid user data');
	}

	if (isEmpty(data.email)) {
		throw new SchemaValidationError('Email field is required');
	}
	
	if (isEmpty(data.name)) {
		throw new SchemaValidationError('Name field is required');
	}
	
	if (isEmpty(data.role)) {
		throw new SchemaValidationError('Role field is required');
	}
	
	if (isEmpty(data.password)) {
		throw new SchemaValidationError('Password field is required');
	}
	
	let res = filterUniqueEmail(data.email);
	console.log('resssss');
	console.log(res);
}
