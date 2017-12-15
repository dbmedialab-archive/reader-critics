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

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Feedback from 'base/Feedback';
import Person from 'base/zz/Person';
import Website from 'base/Website';
import User from 'base/User';

import { ArticleModel } from 'app/db/models';

import {
	wrapExists,
	wrapFindOne,
	wrapSave,
} from 'app/db/common';

import {
	userService,
} from 'app/services';

import emptyCheck from 'app/util/emptyCheck';

export function exists(
	articleURL : string|ArticleURL,
	version : string
) : Promise <boolean>
{
	emptyCheck(articleURL, version);

	return wrapExists(ArticleModel.find({
		url: articleURL instanceof ArticleURL ? articleURL.href : articleURL,
		version,
	}));
}

export function get(
	articleURL : string|ArticleURL,
	version : string,
	populated : boolean = false
) : Promise <Article> {
	emptyCheck(articleURL, version);

	let result = ArticleModel.findOne({
		url: articleURL instanceof ArticleURL ? articleURL.href : articleURL,
		version,
	});

	if (populated) {
		result = result.populate('authors').populate('website');
	}

	return wrapFindOne(result);
}

export function save(website : Website, article : Article) : Promise <Article> {
	emptyCheck(website, article);

	return makeDocument(website, article)
	.then(doc => wrapSave<Article>(new ArticleModel(doc).save()));
}

export function upsert(website : Website, article : Article) : Promise <Article> {
	emptyCheck(website, article);

	const query = {
		url: article.url,
		version: article.version,
	};
	const options = {
		upsert: true,
		setDefaultsOnInsert: true,
	};

	return makeDocument(website, article)
	.then(doc => ArticleModel.update(query, doc, options).exec());
}

export function addFeedback(article : Article, feedback : Feedback) : Promise <Article> {
	emptyCheck(feedback);

	return wrapFindOne(ArticleModel.findOneAndUpdate(
		{ _id : article.ID },
		{
			'$addToSet': {
				feedbacks: feedback.ID,
			},
		}
	));
}

// Helper functions for save() and upsert()

const makeDocument = (website : Website, article : Article) => (
	getUsers(article).then((authors : User[]) => Object.assign({}, article, {
		authors: authors.map(author => author.ID),
		website: website.ID,
		status: {
			escalated: null,
		},
	}))
);

const getUsers = (article : Article) : Promise <User[]> => Promise.all(
	// For some reason, TypeScript rejects Promise.map here. I stopped bothering
	article.authors.map((author : Person) => userService.findOrInsert(author))
);
