/* eslint-disable indent */

import * as sel from './cssSelectors';

export function setLinksInArticleEditForm(browser, thePage) {
	thePage.click(sel.elEditBtn)

	// Check if the form becomes visible
	.assert.visible(sel.elFeedbackForm)

	// Change the content of the link field and press Enter
	.click(sel.elLinkInput)
	.clearValue(sel.elLinkInput)
	.setValue(sel.elLinkInput, sel.linkText0)
	.sendKeys(sel.elLinkInput, browser.Keys.RETURN)

	.pause(2000)
}
