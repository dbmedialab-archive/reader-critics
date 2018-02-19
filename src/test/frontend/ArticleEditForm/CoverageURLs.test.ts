
/*
describe('ArticleEditForm URLs coverage tests', () => {
	let thePage;

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
		thePage = openPage(browser, '/fb?articleURL=https://www.dagbladet.no&version=1')

		// Wait for elements to render
			.waitForElementVisible('body', timeToWait)
			.waitForElementVisible('div#app section#content', timeToWait)
			.waitForElementVisible('section#content > article.title', timeToWait)

			.perform(() => done());
	});

	after((browser, done) => browser.end().perform(() => done()));

	// Check if URL input in <ArticleEditForm> works properly:
	// On press 'Return' key value has to save into state and clear input (way 1).
	// If any data is entered into field and press 'Lagre' button it also
	// should be saved

	it('should open the form and set URL\'s by two ways', (browser) => {
		// Click "Edit" button
		thePage.click(elEditBtn)
			.waitForElementVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes hidden
			.assert.visible(elFeedbackForm)

			// Change the content of the text field. Needed to save changes
			// TODO Remove this after RC-50 is solved
			.click(elTextArea)
			.clearValue(elTextArea)
			.setValue(elTextArea, changedText)

			// Change the content of the link field and press Enter
			.click(elLinkInput)
			.clearValue(elLinkInput)
			.setValue(elLinkInput, linkText0)

			// Click outside the form to remove focus from the text field
			.click(elContent)

			// Check if content has changed
			.assert.value(elLinkInput, linkText0)

			// Press "Enter" key on input
			.click(elLinkInput)
			.sendKeys(elLinkInput, browser.Keys.RETURN)

			// Change the content of the link field and press Enter for the second URL
			.click(elLinkInput)
			.clearValue(elLinkInput)
			.setValue(elLinkInput, linkText1)

			// Click outside the form to remove focus from the text field
			.click(elContent)

			// Check if content has changed
			.assert.value(elLinkInput, linkText1)

			// Press "Enter" key
			.click(elLinkInput)
			.sendKeys(elLinkInput, browser.Keys.RETURN)

			// Change the content of the link field without press Enter
			.click(elLinkInput)
			.clearValue(elLinkInput)
			.setValue(elLinkInput, linkText2)

			// Click outside the form to remove focus from the text fields
			.click(elContent)

			// Check if content has changed
			.assert.value(elLinkInput, linkText2);

		// Click "Save" button
		thePage.click(elEditBtn)
			.waitForElementNotVisible(elFeedbackForm, timeToWait)
			.assert.hidden(elFeedbackForm);
	});

	// Check if the links in form are the same we entered before on next open
	// of the <ArticleEditForm>.

	it('should open the form and display the links entered before', (browser) => {
		// Click "Edit" button
		thePage.click(elEditBtn)
			.waitForElementVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes visible
			.assert.visible(elFeedbackForm)

			// Check if the fields contain that links we had entered
			.assert.containsText(elLinkOl, linkText0)
			.assert.containsText(elLinkOl, linkText1)
			.assert.containsText(elLinkOl, linkText2);
	});

	// Check if the links in form are the same ordered we entered them before

	it('should display the links entered before are in a correct order', (browser) => {
		// Check if the fields contain that links we had entered
		thePage.assert.containsText(elLinkLi0, linkText0)
			.assert.containsText(elLinkLi1, linkText1)
			.assert.containsText(elLinkLi2, linkText2);

		// Click "Cancel" button
		thePage.click(elFormCancelBtn)
			.waitForElementNotVisible(elFeedbackForm, timeToWait);
	});

	// Check if we can remove URLs from the list

	it('should remove the link', (browser) => {
		// Click "Edit" button
		thePage.click(elEditBtn)
			.waitForElementVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes visible
			.assert.visible(elFeedbackForm)

			// Check the form doesn't contain that link we had removed
			.click(elLinkLi1)
			.assert.elementNotPresent(elLinkLi2);

		// Click "Save" button
		thePage.click(elFormSaveBtn)
			.waitForElementNotVisible(elFeedbackForm, timeToWait);
	});

	// Check if removed URL is not in a list on next open of <ArticleEditForm>

	it('should removed URL not be in a list on next open', (browser) => {
		// Click "Edit" button
		thePage.click(elEditBtn)
			.waitForElementVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes visible
			.assert.visible(elFeedbackForm)

			// Check if the fields contain that links we had entered
			// and not contain link we removed. TExt of linkText2 has to
			// be in elLinkLi1. elLinkLi2 has to not be in a form

			.assert.containsText(elLinkLi0, linkText0)
			.assert.containsText(elLinkLi1, linkText2)
			.assert.elementNotPresent(elLinkLi2)

			// Add link back.
			.click(elLinkInput)
			.clearValue(elLinkInput)
			.setValue(elLinkInput, linkText1);

		// Click "Save" button
		thePage.click(elFormSaveBtn)
			.waitForElementNotVisible(elFeedbackForm, timeToWait);
	});

	// Check if the links in form are the same ordered we added them
	// after remove one of them

	it('should display the links entered in a correct order after remove one of them', (browser) => {
		// Check if the fields contain that links we had entered
		thePage.click(elEditBtn)
			.waitForElementVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes visible
			.assert.visible(elFeedbackForm)

			// Check the order of links is right
			.assert.containsText(elLinkLi0, linkText0)
			.assert.containsText(elLinkLi1, linkText2)
			.assert.containsText(elLinkLi2, linkText1);

		// Click "Cancel" button
		thePage.click(elFormCancelBtn)
			.waitForElementNotVisible(elFeedbackForm, timeToWait);
	});

	// Check if we can discard removing URLs from the list

	it('should not remove the link on discard', (browser) => {
		// Click "Edit" button
		thePage.click(elEditBtn)
			.waitForElementVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes visible
			.assert.visible(elFeedbackForm)

			// Check the form doesn't contain that link we had removed
			.click(elLinkLi2)
			.assert.elementNotPresent(elLinkLi2)

			// Click "Cancel" button
			.click(elFormCancelBtn)
			.waitForElementNotVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes hidden
			.assert.hidden(elFeedbackForm)

			// Click "Edit" button
			.click(elEditBtn)
			.waitForElementVisible(elFeedbackForm, timeToWait)

			// Check if the form becomes visible
			.assert.visible(elFeedbackForm)

			.assert.elementPresent(elLinkLi0)
			.assert.elementPresent(elLinkLi1)
			.assert.elementPresent(elLinkLi2);

		// Click "Cancel" button
		thePage.click(elFormCancelBtn)
			.waitForElementNotVisible(elFeedbackForm, timeToWait);
	});
});
*/
