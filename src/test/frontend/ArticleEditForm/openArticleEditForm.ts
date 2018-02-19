/* eslint-disable indent */

import * as sel from './cssSelectors';

export function openArticleEditForm(browser, thePage) {
	thePage.click(sel.elEditBtn)

	// Check if the form becomes visible
	.assert.visible(sel.elFeedbackForm)

	// Check if sub elements become visible
	.assert.visible(sel.elTextArea)
	.assert.visible(sel.elCommentArea)
	.assert.visible(sel.elLinkInput)

	.assert.visible(sel.elFormCancelBtn)
	.assert.visible(sel.elFormSaveBtn)

	.pause(2000);
}
