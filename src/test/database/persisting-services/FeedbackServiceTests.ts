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

import * as path from 'path';

import { assert } from 'chai';
import { ISuiteCallbackContext } from 'mocha';

import ArticleURL from 'base/ArticleURL';
import Feedback from 'base/Feedback';

import {
	articleService,
	feedbackService,
} from 'app/services';

import * as app from 'app/util/applib';

const feedbackDir = path.join('resources', 'feedback');

export default function(this: ISuiteCallbackContext) {
	let feedbackCount : number;

	it('clear()', () => feedbackService.clear());

	it('validateAndSave()', () => app.scanDir(feedbackDir).then((files : string[]) => {
		feedbackCount = files.length;

		return Promise.mapSeries(files, (filename : string) => {
			return app.loadJSON(path.join(feedbackDir, filename))
			.then((a : any) => {
				assert.isNotNull(a);
				return feedbackService.validateAndSave(a);
			});
		});
	}));

	it('count()', () => feedbackService.count().then(count => {
		assert.strictEqual(count, feedbackCount);
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
}

const assertFeedbackObject = (f : Feedback) => {
	assert.isObject(f);

	[ 'article', 'enduser', 'articleAuthors', 'items', 'status' ].forEach(prop => {
		assert.property(f, prop);
	});

	assert.isArray(f.articleAuthors);
	assert.isArray(f.items);
};
