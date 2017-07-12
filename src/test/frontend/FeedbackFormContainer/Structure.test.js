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
	openPage
} = require('../test-tools-frontend');

const article_el_1 = 'article#article-el-1';
const article_el_2 = 'article#article-el-2';
const article_el_5 = 'article#article-el-5';

describe('FeedbackFormContainer', function() {

	let page;

	before(function(client, done) {
		page = openPage(client, '/fb/http://test/xyz/1')
			.waitForElementVisible('body', 500)
			.waitForElementVisible('div#app section#content', 1000)
			.waitForElementVisible('section#content > article.title', 5000)
			.perform(function() {
				done()
			});
	});

	after(function(client, done) {
		client.end(function() {
			done();
		});
	});

	it('Check existence of article elements', function(client) {
		page
			.assert.containsText(article_el_1 + ' h1', 'Her blir Donald Trump sowas von historisk');
	});

	it('Check CSS classes on article elements', function(client) {
		page
			.assert.cssClassPresent(article_el_1, 'card')
			.assert.cssClassPresent(article_el_1, 'title');
		page
			.assert.cssClassPresent(article_el_2, 'card')
			.assert.cssClassPresent(article_el_2, 'paragraph');
		page
			.assert.cssClassPresent(article_el_5, 'card')
			.assert.cssClassPresent(article_el_5, 'subtitle');
	});

});
