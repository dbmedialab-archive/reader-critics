const assert = require('assert');

const {
	isFunction,
	isObject,
	isString,
} = require('lodash');

const {
	log,
	openPage,
} = require('../test-tools-frontend');

const timeoWait = 5000;

// CSS selectors for the various probed elements

const elArticle = 'article#article-el-2';

const elContent = elArticle + ' p';
const elFeedbackForm = elArticle + ' form';
const elTextArea = elFeedbackForm + ' fieldset.text textarea';
const elCommentArea = elFeedbackForm + ' fieldset.comment textarea';

const elEditBtn = elArticle + ' footer .button.edit';
const elResetBtn = elArticle + ' footer .button.reset';

const elFormSaveBtn = elFeedbackForm + ' .button.save';

// Some text snippets for display and input fields

const expectedText = 'I dag landet Donald Trump i Israel.';
const changedText = 'Bavaria lorem ipsum dolor Kreiz Birnbaum fix Hollastaudn';
const userComment = 'Here be some comment';
const diffyText = 'Bavaria I lorem dag ipsum landet dolor Donald Kreiz Trump Birnbaum';

describe('ArticleEditForm', function() {

	var thePage;
	var originalText;

	// Set up the test page and extract some of the text values for
	// later use. The test case was split up into before() and it(..)
	// because Nightwatch evaluates the complete function chain inside
	// a testcase before actually executing it. This means that
	//
	//  let cyaLater;
	//  browser.url('http://something')
	//  .getValue('#elem', (res) => { cyaLater = res.value })
	//  .doSomethingElse()
	//  .assert.value('#elem', cyaLater);
	//
	// will not work. By the time reference to the variable "cyaLater"
	// is evaluated, it is still undefined. Only when the test then gets
	// executed, the variable will be set. Chicken and egg problem.
	//
	// Workaround? Split up the test case. Another workaround is to use
	// .perform() functions for these "late evaluations", but that blows
	// up the code.

	before(function(browser, done) {
		thePage = openPage(browser, '/fb/http://test/xyz/1')

		// Wait for elements to render
		.waitForElementVisible('body', timeoWait)
		.waitForElementVisible('div#app section#content', timeoWait)
		.waitForElementVisible('section#content > article.title', timeoWait)

		// Ensure we're addressing the right container. Remember that
		// containsText() is a substring match! strictEquals has to be done manually.
		.assert.containsText(elContent, expectedText)

		// Save current element text for later comparism
		.getText(elContent, function(result) {
			if (!(isObject(result) && isString(result.value))) {
				return assert.fail(null, null, 'Could not get text content from ArticleElement');
			}

			originalText = result.value;
		})
		.perform(function() {
			done();
		});
	});

	// Check if clicking on "Edit" opens the <ArticleEditForm>

	it('should become visible when clicking the "Edit" button', function(browser) {
		// Click on the "Edit" button and check if <ArticleEditForm>
		// and the sub components become visible
		thePage.click(elEditBtn)
		.waitForElementVisible(elFeedbackForm, timeoWait)
		.waitForElementVisible(elTextArea, timeoWait)
		.waitForElementVisible(elCommentArea, timeoWait)

		// Check if <ArticleEditForm> and the sub components have become visible,
		// also if the "text" field contains the same text as its parent component
		.assert.visible(elFeedbackForm)
		.assert.value(elTextArea, originalText)
	});

	// The actual test case

	it('should accept and keep user input', function(browser) {
		// Focus comment field and type some text into it
		thePage.click(elCommentArea)
		.setValue(elCommentArea, userComment)

		// Change the content of the text field
		.click(elTextArea)
		.clearValue(elTextArea)
		.setValue(elTextArea, changedText)

		// Click outside the form to remove focus from the text fields
		.click(elContent)

		// Check if the input fields have kept the values that we just fed them
		.assert.value(elCommentArea, userComment)
		.assert.value(elTextArea, changedText)
	});

	it('should close the form and display a text diff', function(browser) {
		// Click "Save" button
		thePage.click(elFormSaveBtn)
		.waitForElementNotVisible(elFeedbackForm, timeoWait)

		// Check if the form becomes hidden
		.assert.hidden(elFeedbackForm)

		// Check for the diff. The weird word order comes from the diff package,
		// which currently performs a word-wise diff. This might be changed into
		// a sentence-diff, or at least something that respects consecutive words.
		.assert.containsText(elContent, diffyText);
	});




		// Click "Reset" button, check for original text, then re-open <ArticleEditForm>
		// .click(elResetBtn)


// it('should reset properly', function(browser) {


		// Doing a plain assert against the previously stored value
		// .assert.containsText(elContent, originalText)
		// will yield that 'originalText' is undefined in that scope.

		// .perform(function() {
		// 	log('originalText', originalText);
		// 	const thisShitIsImmutable = originalText;
		// 	return browser.assert.containsText(elContent, thisShitIsImmutable);
		// })

		// .click(elEditBtn)



		// .waitForElementVisible('#edit-field-1-comment', timeoWait)
		// .click('#edit-field-1-comment')
		// .setValue('#edit-field-1-comment', 'shiiiiiiiiiiiiiiiiiiiiiiiiiite')
		// .click(elTextArea)
		// .setValue(elTextArea, changedText)

/*

		.assert.value(elTextArea, 'narf' /*originalText* /)
		.pause(20000)
*/

/*
		.assert.hidden(elFeedbackForm)

		.click(elResetBtn)
		.assert.containsText(elContent, originalText)
		.click(elEditBtn)

		// Finally, check if the <textarea> was reset properly, it should
		// contain the original text again:
		.assert.visible(elFeedbackForm)
		.assert.value(elTextArea, originalText)

		.end();*/

});
