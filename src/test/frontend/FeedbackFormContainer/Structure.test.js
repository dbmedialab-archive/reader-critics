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

const {
	openPage,
} = require('../test-tools-frontend');

const articleEl1 = 'article#article-el-1';
const articleEl2 = 'article#article-el-2';
const articleEl3 = 'article#article-el-3';
// const articleEl5 = 'article#article-el-5';
const articleEl6 = 'article#article-el-6';

describe('FeedbackFormContainer', () => {
	let page;

	before((client, done) => {
		page = openPage(client, '/fb?articleURL=https://www.dagbladet.no&version=1')
			.waitForElementVisible('body', 500)
			.waitForElementVisible('div#app section#content', 1000)
			.waitForElementVisible('section#content > article.title', 5000)
			.perform(() => done());
	});

	after((client, done) => {
		client.end(() => done());
	});

	it('Check existence of article elements', (client) => {
		page
			.assert.containsText(`${articleEl1} header div h1 span`, 'Ivanka-klemmen til senatoren gikk ikke helt som planlagt. Og så var sirkuset i gang');
	});

	it('Check CSS classes on article elements', (client) => {
		page
			.assert.cssClassPresent(articleEl1, 'card')
			.assert.cssClassPresent(articleEl1, 'title');
		page
			.assert.cssClassPresent(articleEl2, 'card')
			.assert.cssClassPresent(articleEl2, 'featured');
		page
			.assert.cssClassPresent(articleEl3, 'card')
			.assert.cssClassPresent(articleEl3, 'paragraph');
		/* page
			.assert.cssClassPresent(articleEl5, 'card')
			.assert.cssClassPresent(articleEl5, 'subtitle'); */
		page
			.assert.cssClassPresent(articleEl6, 'card')
			.assert.cssClassPresent(articleEl6, 'subhead');
	});
});
