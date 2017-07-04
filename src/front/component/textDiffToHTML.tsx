import * as React from 'react';

import {diffString, DiffStringResultObject} from 'app/util/diffString';

export default function (oldText: string, newText: string): any {
	if (oldText === newText) {
		return <span key='0'>{newText}</span>;
	}

	const diff: DiffStringResultObject[] = diffString(oldText, newText);
	const html: any[] = [];

	diff.forEach((result: DiffStringResultObject, index: number) => {
		if (html.length > 0 && canHaveWhiteSpace(result)) {
			html.push(' ');  // Whitespace to separate tags (and the words they contain)
		}
		html.push(formatResult(result, index));
	});

	return html;
}

// Generate <ins> and <del> tags for additions and removals

function formatResult(result: DiffStringResultObject, index: number) {
	if (result.added === true) {
		return <ins key={index}>{result.value.trim()}</ins>;
	}
	if (result.removed === true) {
		return <del key={index}>{result.value.trim()}</del>;
	}

	return <span key={index}>{result.value.trim()}</span>;
}

// Insert whitespace between tags, when needed (and appropriate)

const punctuationASCII: number[] = [
	0x21,  // !
	0x22,  // "
	0x27,  // '
	0x28,  // (
	0x29,  // )
	0x2C,  // ,
	0x2E,  // .
	0x3A,  // :
	0x3B,  // ;
	0x3F,  // ?
];

function canHaveWhiteSpace(result: DiffStringResultObject): boolean {
	if (result.added === true && result.removed === true) {
		return true;  // Always separate 'diff' tags
	}

	if (punctuationASCII.indexOf(result.value.charCodeAt(0)) > 0) {
		return false;  // Do not insert whitespace before punctuation
	}

	return true;
}
