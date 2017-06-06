const assert = require('assert');

const {
	isObject,
	isString,
} = require('lodash');

const {
	openPage,
} = require('../test-tools-frontend');

const elContent = 'article#article-el-2 p';
const elEditBtn = 'article#article-el-2 footer a#btn-edit-2.button.edit';

const expectedText = 'Kort tid etter ble han historisk da han, som den';

describe('ArticleEditForm', function() {

	it('should reset properly', function(browser) {
		let originalText;

		openPage(browser, '/fb/http://test/xyz/1')

		// Wait for elements to render
		.waitForElementVisible('body', 500)
		.waitForElementVisible('div#app section#content', 1000)
		.waitForElementVisible('section#content > article.title', 5000)

		// Ensure we're addressing the right container
		.assert.containsText(elContent, expectedText)

		// Save current element text for later comparism
		.perform(function(done) {
			browser.getText(elContent, function(result) {
				if (!(isObject(result) && isString(result.value))) {
					assert.fail(null, null, 'Could not get text content from ArticleElement');
					return done();
				}

				originalText = result.value;
				console.log('save component text here for later:', originalText);
				done();
			});
		})

		.click(elEditBtn)

		.perform(function() {
			console.log('Saved:', originalText);
		});
	});

});
