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

import { diffString, DiffBit } from './diffString';

// A function that formats a partial string, probably depending on the type
// of diff bit (is it an addition, was this deleted, or not modified at all?)
export type DiffFormatFn = (
	txtbit : string|DiffBit,
	index? : number
) => any;

// A function that takes an already formatted element and pushes it into the
// right spot in the return structure
export type DiffConcatFn = (
	formattedElem : any
) => void;

// A function that tests if the worked-on return structure already has content.
// This is needed for whitespace insertion, because you obviously don't want to
// get spaces at the beginning of a returned string, for example.
export type DiffHasLenFn = () => boolean;

export function diff (
	oldText : string,
	newText : string,
	formatFn : DiffFormatFn,
	concatFn : DiffConcatFn,
	hasLenFn : DiffHasLenFn
) : void
{
	// If there is absolutely no difference, return the original text
	if (oldText === newText) {
		concatFn(oldText);
		return;
	}

	// Perform a diff over the two strings
	const bits: DiffBit[] = diffString(oldText, newText);

	// Glue the diff bits back together with the helper functions. A superior function
	// that wants to ulitize the algorithm has to declare all those helpers internally
	// and then call this diff() function here. The callback mechanism allows to work
	// on arbitrary data and return types/structures.
	bits.forEach((result: DiffBit, index: number) => {
		// Whitespace to separate partials (and the words they contain)
		if (hasLenFn() && canHaveWhiteSpace(result)) {
			concatFn(' ');
		}
		// Paste the current diff bit
		concatFn(formatFn(result, index));
	});
}

// Insert whitespace between parts, when needed (and appropriate)

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

const canHaveWhiteSpace = (result: DiffBit): boolean => {
	if (result.added === true || result.removed === true) {
		return true;  // Always separate 'diff' partials
	}

	if (punctuationASCII.indexOf(result.value.charCodeAt(0)) > 0) {
		return false;  // Do not insert whitespace before punctuation
	}

	return true;
};
