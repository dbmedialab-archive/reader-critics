/* eslint-disable indent */

import * as sel from './cssSelectors';

const changedText = 'Det er alt lorem ipsum dolor.';
const userComment = 'Here be some comment';

export function acceptAndKeepComment(browser, thePage) {
	// Focus comment field and type some text into it
	thePage.click(sel.elCommentArea)
	.setValue(sel.elCommentArea, userComment)

	// Click another input field to remove focus from the text field
	.click(sel.elTextArea)
	.pause(1000)

	// Check if the comment field has kept the value
	.assert.value(sel.elCommentArea, userComment)

	// Change the content of the text field
	// .click(sel.elTextArea)
	// .clearValue(sel.elTextArea)
	// .setValue(sel.elTextArea, changedText)

	// // Check if the input fields have kept the values that we just fed them
	// .assert.value(sel.elTextArea, changedText)

	.pause(2000)
}

export function acceptAndKeepText(browser, thePage) {
	// Focus comment field and type some text into it
	thePage.click(sel.elTextArea)
	.setValue(sel.elTextArea, changedText)

	// Click outside the form to remove focus from the text fields
	.click(sel.elButtonArea)

	// Check if the comment field has kept the value
	.assert.value(sel.elTextArea, changedText)

	// Change the content of the text field
	// .click(sel.elTextArea)
	// .clearValue(sel.elTextArea)
	// .setValue(sel.elTextArea, changedText)

	// // Check if the input fields have kept the values that we just fed them
	// .assert.value(sel.elTextArea, changedText)

	.pause(2000)
}
