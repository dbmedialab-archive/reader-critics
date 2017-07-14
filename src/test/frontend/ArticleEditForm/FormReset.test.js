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

const assert = require('assert');

const {
	isObject,
	isString,
} = require('lodash');

const {
	openPage,
} = require('../test-tools-frontend');

const timeToWait = 5000;

// CSS selectors for the various probed elements

const elArticle = 'article#article-el-2';

const elContent = `${elArticle} p`;
const elFeedbackForm = `${elArticle} form`;
const elTextArea = `${elFeedbackForm} fieldset.text textarea`;
const elCommentArea = `${elFeedbackForm} fieldset.comment textarea`;

const elEditBtn = `${elArticle} footer .button.edit`;
const elResetBtn = `${elArticle} footer .button.reset`;

const elFormSaveBtn = `${elFeedbackForm} .button.save`;
const elFormCancelBtn = `${elFeedbackForm} .button.cancel`;

// Some text snippets for display and input fields

const expectedText = 'I dag landet Donald Trump i Israel.';
const changedText = 'Bavaria I dag lorem ipsum dolor Kreiz Birnbaum fix Hollastaudn';
const userComment = 'Here be some comment';
const diffyText = '(Dagbladet): Bavaria I dag landet Donald Trump i Israel. Kort tid etter ble han '
	+ 'historisk da han, som den første sittende amerikanske presidenten, besøkte Vestmuren, bedre '
	+ 'kjent som klagemuren, i Jerusalem. lorem ipsum dolor Kreiz Birnbaum fix Hollastaudn';

describe('ArticleEditForm Reset Tests', () => {
	let thePage;
	let originalText;

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

	before((browser, done) => {
		thePage = openPage(browser, '/fb/http://test/xyz/1')

		// Wait for elements to render
		.waitForElementVisible('body', timeToWait)
		.waitForElementVisible('div#app section#content', timeToWait)
		.waitForElementVisible('section#content > article.title', timeToWait)

		// Ensure we're addressing the right container. Remember that
		// containsText() is a substring match! strictEquals has to be done manually.
		.assert.containsText(elContent, expectedText)

		// Save current element text for later comparism
		.getText(elContent, (result) => {
			if (!(isObject(result) && isString(result.value))) {
				assert.fail(null, null, 'Could not get text content from ArticleElement');
				return;
			}

			originalText = result.value;
		})
		.perform(() => done());
	});

	after((browser, done) => browser.end().perform(() => done()));

	// Check if clicking on "Edit" opens the <ArticleEditForm>

	it('should become visible when clicking the "Edit" button', (browser) => {
		// Click on the "Edit" button and check if <ArticleEditForm>
		// and the sub components become visible
		thePage.click(elEditBtn)
		.waitForElementVisible(elFeedbackForm, timeToWait)
		.waitForElementVisible(elTextArea, timeToWait)
		.waitForElementVisible(elCommentArea, timeToWait)

		// Check if <ArticleEditForm> and the sub components have become visible,
		// also if the "text" field contains the same text as its parent component
		.assert.visible(elFeedbackForm)
		.assert.value(elTextArea, originalText);
	});

	// Check if the text components keep their input.
	// Form elements in React can be set up in a way that makes them read-only
	// (for example, declaring them with value=this.state.some)

	it('should accept and keep user input', (browser) => {
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
		.assert.value(elTextArea, changedText);
	});

	// Check if "Cancel" button works properly. It should close the form
	// without text diff

	it('should close form without accepting text diff', (browser) => {
		// Click "Cancel" button
		thePage.click(elFormCancelBtn)
		.waitForElementNotVisible(elFeedbackForm, timeToWait)

		// Check if the form becomes hidden
		.assert.hidden(elFeedbackForm)

		// Check for the diff. The weird word order comes from the diff package,
		// which currently performs a word-wise diff. This might be changed into
		// a sentence-diff, or at least something that respects consecutive words.
		.assert.containsText(elContent, originalText);
	});

	// Check if the text components can keep their input again on the second form show.
	// Form elements in React can be set up in a way that makes them read-only
	// (for example, declaring them with value=this.state.some)

	it('should accept and keep user input again on the second form show', (browser) => {
		// Click on the "Edit" button and check if <ArticleEditForm>
		// and the sub components become visible
		thePage.click(elEditBtn)
		.waitForElementVisible(elFeedbackForm, timeToWait)
		.waitForElementVisible(elTextArea, timeToWait)
		.waitForElementVisible(elCommentArea, timeToWait);

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
		.assert.value(elTextArea, changedText);
	});

	// Check if the form closes after clicking "Safe"
	// A text diff should appear on its parent component

	it('should close the form and display a text diff', (browser) => {
		// Click "Save" button
		thePage.click(elFormSaveBtn)
		.waitForElementNotVisible(elFeedbackForm, timeToWait)

		// Check if the form becomes hidden
		.assert.hidden(elFeedbackForm)

		// Check for the diff. The weird word order comes from the diff package,
		// which currently performs a word-wise diff. This might be changed into
		// a sentence-diff, or at least something that respects consecutive words.
		.assert.containsText(elContent, diffyText);
	});

	// Check if the data in form is the same we entered before on next open
	// of the <ArticleEditForm>.

	it('should open the form and display a text entered before', (browser) => {
		// Click "Edit" button
		thePage.click(elEditBtn)
		.waitForElementVisible(elFeedbackForm, timeToWait)

		// Check if the form becomes visible
		.assert.visible(elFeedbackForm)

		// Check if the fields contain exactly that text we had entered
		.assert.value(elCommentArea, userComment)
		.assert.value(elTextArea, changedText)

		// Click "Cancel" button
		.click(elFormCancelBtn)
		.waitForElementNotVisible(elFeedbackForm, timeToWait);
	});

	// Check if the form is reset to its original values correctly when
	// clicking the "Reset" button

	it('should reset properly', (browser) => {
		// Click "Reset" button, check for original text, then re-open <ArticleEditForm>
		thePage.click(elResetBtn)
		.assert.hidden(elFeedbackForm)
		.assert.containsText(elContent, originalText)

		// Click on "Edit" to re-open the feedback form
		.click(elEditBtn)
		.waitForElementVisible(elFeedbackForm, timeToWait)

		.assert.value(elTextArea, originalText);
	});
});
