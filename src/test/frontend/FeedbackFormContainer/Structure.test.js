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
