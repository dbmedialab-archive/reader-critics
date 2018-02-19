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
	openPage,
	timeToWait,
} from '../util';

import {
	acceptAndKeepComment,
	acceptAndKeepText,
} from './acceptAndKeepUserInput';

import { openArticleEditForm } from './openArticleEditForm';
import { setLinksInArticleEditForm } from './setLinksInArticleEditForm';

// Open target page before running all the tests

let thePage : any;

function before(browser, done) {
	thePage = openPage(browser, '/fb/http://dagbladet.no/67728317')
	// Wait for elements to render
	.waitForElementVisible('body', timeToWait)
	.waitForElementVisible('div#app section#content', timeToWait)
	.waitForElementVisible('section#content > article.title', timeToWait)
	// Signal the test runner
	.perform(() => done());
}

// Export tests to Nightwatch

module.exports = {
	before,
	'Open article edit form': (browser) => {
		openArticleEditForm(browser, thePage);
	},
	// 'Accept and keep text': (browser) => {
	// 	acceptAndKeepText(browser, thePage);
	// },
	'Accept and keep a comment': (browser) => {
		acceptAndKeepComment(browser, thePage);
	},
	// 'Set links': (browser) => {
	// 	setLinksInArticleEditForm(browser, thePage);
	// },
};
