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

import {
	testGetByStatus,
	testUpdateStatus,
} from './FeedbackServiceTests/StatusFunctions';

import { assertFeedbackObject } from './FeedbackServiceTests/assertFeedbackObject';

import * as app from 'app/util/applib';

const feedbackCreateDir = path.join('resources', 'feedback', 'create');
const feedbackUpdateDir = path.join('resources', 'feedback', 'update');

const feedbackIDs = [];

// Test runtime data

let feedbackCount : number;

// Main test function

export default function(this: ISuiteCallbackContext) {
	this.slow(250);

	testClear();
	testValidateAndSave();
	testCount();
	testValidateAndUpdateEnduser();

	testGetByArticle();
	testGetByArticleAuthor();

	testUpdateStatus();
	testGetByStatus();
}

// feedbackService.clear()

const testClear = () => it('clear()', () => feedbackService.clear());

// feedbackService.validateAndSave()

const testValidateAndSave = () => it('validateAndSave()', () => (
	app.scanDir(feedbackCreateDir)
	.then((files : string[]) => {
		feedbackCount = files.length;

		return Promise.mapSeries(files.sort(), (filename : string) => {
			return app.loadJSON(path.join(feedbackCreateDir, filename))
			.then((a : any) => {
				assert.isNotNull(a);
				return feedbackService.validateAndSave(a).then(feedback => {
					feedbackIDs.push(feedback.ID);
				});
			});
		});
	})
));

const testValidateAndUpdateEnduser = () => it('validateAndUpdateEnduser()', () => (
	app.scanDir(feedbackUpdateDir)
	.then((files : string[]) => Promise.mapSeries(files.sort(), (filename : string) => (
		app.loadJSON(path.join(feedbackUpdateDir, filename))
		.then((a : any) => {
			assert.isNotNull(a);
			return feedbackService.validateAndUpdateEnduser(a);
		})
	))) // .then(files, ..)
));

// feedbackService.count()

const testCount = () => it('count()', () => feedbackService.count()
.then(count => {
	assert.strictEqual(
		count, feedbackCount,
		`Expected object count of ${feedbackCount} but got ${count} instead`
	);
}));

// feedbackService.getByArticle()

const testGetByArticle = () => it('getByArticle()', () => {
	return ArticleURL.from('http://avisa.tld/1')
	.then(articleURL => articleService.get(articleURL, 'final-draft'))
	.then(article => feedbackService.getByArticle(article))
	.then((results : Feedback[]) => {
		assert.lengthOf(results, 1);
		results.forEach(feedback => assertFeedbackObject(feedback));
	});
});

// feedbackService.getByArticleAuthor()

const testGetByArticleAuthor = () => it('getByArticleAuthor()', () => {
	return userService.get('Axel Egon Unterbichler')
	.then(author => {
		return feedbackService.getByArticleAuthor(author);
	})
	.then((results : Feedback[]) => {
		assert.lengthOf(results, 2);
		results.forEach((feedback, index) => {
			assertFeedbackObject(feedback);
		});
	});
});
