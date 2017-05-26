import * as React from 'react';

import {
	diffWords,
	IDiffResult,
} from 'diff';

export default function(oldText : string, newText : string) : any {
	if (oldText === newText) {
		return <span key='0'>{newText}</span>;
	}

	const diff : IDiffResult[] = diffWords(oldText, newText);
	const html : any[] = [];

	console.log('diff:', diff);
	diff.forEach((diffResult : IDiffResult, index : number) => html.push(formatResult(diffResult, index)));

	return html;
}

function formatResult(result : IDiffResult, index : number) {
	if (result.added === true) {
		return <ins key={index}>{result.value}</ins>;
	}
	if (result.removed === true) {
		return <del key={index}>{result.value}</del>;
	}

	return <span key={index}>{result.value}</span>;
}
