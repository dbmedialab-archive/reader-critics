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

// The following two lines might be a bit confusing, but TypeScript really wants it that way:
import { diffString, DiffBit } from './diffString';
export { DiffBit } from './diffString';

export type DiffFormatterFunction = (
	result : DiffBit,
	index? : number
) => any;

export type DiffConcatterFunction = (
	formattedElem : any
) => void;

export function diff (
	oldText : string,
	newText : string,
	formatter : DiffFormatterFunction,
	concatter : DiffConcatterFunction
) : void
{
	if (oldText === newText) {
		concatter(oldText);
		return;
	}

	const bits: DiffBit[] = diffString(oldText, newText);
	const html: any[] = [];

	bits.forEach((result: DiffBit, index: number) => {
		if (html.length > 0 && canHaveWhiteSpace(result)) {
			concatter(' ');  // Whitespace to separate tags (and the words they contain)
		}
		concatter(formatter(result, index));
	});
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

function canHaveWhiteSpace(result: DiffBit): boolean {
	if (result.added === true && result.removed === true) {
		return true;  // Always separate 'diff' tags
	}

	if (punctuationASCII.indexOf(result.value.charCodeAt(0)) > 0) {
		return false;  // Do not insert whitespace before punctuation
	}

	return true;
}
