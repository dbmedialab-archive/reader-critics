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

// import * as colors from 'ansicolors';
import * as path from 'path';

import { assert } from 'chai';
import { ISuiteCallbackContext } from 'mocha';

import ArticleURL from 'base/ArticleURL';
import Feedback from 'base/Feedback';

import {
	articleService,
	feedbackService,
	userService,
} from 'app/services';

import * as app from 'app/util/applib';
import {ObjectID} from 'bson';

const feedbackDir = path.join('resources', 'feedback', 'create');
const feedbackUpdateDir = path.join('resources', 'feedback', 'update');
const feedbackIDs = [];

export default function(this: ISuiteCallbackContext) {
	let feedbackCount : number;

	it('clear()', () => feedbackService.clear());

	it('validateAndSave()', () => app.scanDir(feedbackDir).then((files : string[]) => {
		feedbackCount = files.length;

		return Promise.mapSeries(files, (filename : string) => {
			return app.loadJSON(path.join(feedbackDir, filename))
			.then((a : any) => {
				assert.isNotNull(a);
				return feedbackService.validateAndSave(a).then((doc) => {
					feedbackIDs.push(doc.ID);
				});
			});
		});
	}));

	it('validateAndUpdateEndUser()', () => app.scanDir(feedbackUpdateDir).then((files : string[]) => {
		return Promise.mapSeries(files, (filename : string, index: number) => {
			return app.loadJSON(path.join(feedbackUpdateDir, filename))
				.then((a: any) => {
					assert.isNotNull(a);
					return feedbackService.validateAndUpdateEndUser(feedbackIDs[index], a);
				});
		});
	}));

	it('count()', () => feedbackService.count().then(count => {
		assert.strictEqual(
			count, feedbackCount,
			`Expected object count of ${feedbackCount} but got ${count} instead`
		);
	}));

	it('getByArticle()', () => {
		return ArticleURL.from('http://www.mopo.no/1')
		.then(articleURL => articleService.get(articleURL, 'final-draft'))
		.then(article => feedbackService.getByArticle(article))
		.then((results : Feedback[]) => {
			assert.lengthOf(results, 1);
			results.forEach(feedback => assertFeedbackObject(feedback));
		});
	});

	it('getByArticleAuthor()', () => {
		return userService.get('Axel Egon Unterbichler')
		.then(author => {
			return feedbackService.getByArticleAuthor(author);
		})
		.then((results : Feedback[]) => {
			assert.lengthOf(results, 2);
			results.forEach((feedback, index) => {
				// console.error(colors.brightYellow(
				// 	`--- queried feedback #${index} -------------------------------------------------------`
				// ));
				// console.error(app.inspect(feedback));
				// console.error(colors.brightYellow(
				// 	'-------------------------------------------------------------------------------\n'
				// ));
				assertFeedbackObject(feedback);
			});
		});
	});
}

const assertFeedbackObject = (f : Feedback) => {
	assert.isObject(f);

	[ 'article', 'enduser', 'items', 'status' ].forEach(prop => {
		assert.property(f, prop);
	});

	[ 'articleAuthors' ].forEach(prop => {
		assert.notProperty(f, prop);
	});

	// Test if "article" object was populated
	assert.isObject(f.article);
	[ 'authors', 'items', 'url', 'version' ].forEach(prop => {
		assert.property(f.article, prop);
	});

	// Test if "article.authors" array was populated
	assert.isArray(f.article.authors);
	f.article.authors.forEach(author => {
		assert.isObject(author);
		[ 'email', 'name' ].forEach(prop => {
			assert.property(author, prop);
		});
	});

	assert.isObject(f.date);
	assert.isObject(f.enduser);

	assert.isArray(f.items);
};
