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

export type DiffFormatterFunction = (
	txtbit : string|DiffBit,
	index? : number
) => any;

export type DiffConcatterFunction = (
	formattedElem : any
) => void;

// Object to show every single part of string after diff check
export interface DiffBit {
	count: number;			// Amount of items in string part
	added?: boolean;		// Is string added
	removed?: boolean;		// Is string removed
	value: string;			// String part
}

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
	if (result.added === true && result.removed === true) {
		return true;  // Always separate 'diff' tags
	}

	if (punctuationASCII.indexOf(result.value.charCodeAt(0)) > 0) {
		return false;  // Do not insert whitespace before punctuation
	}

	return true;
};

// tslint:disable cyclomatic-complexity
// tsl i n t : disable max-file-line-count

/*
 * Create an array of DiffBits from object or a string with result of diff operation
 */
function diffString(o: string, n: string): Array<DiffBit> {
	// Updates the previous string part adding to it value and count of current item
	function updatePrevious(value: string) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffBit = result[lastIndex];
		const replaceItem: DiffBit = Object.assign({}, lastItem, {
			count: lastItem.count + 2,
			value: lastItem.value + value,
		});

		result.splice(lastIndex, 1, replaceItem);
	}

	// Adding a new string part with added/deleted flags
	function addOptItem(value: string, isAdding: boolean) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffBit = result[lastIndex];
		const optItem: DiffBit = {
			count: 2,
			added: isAdding,
			removed: !isAdding,
			value: value,
		};

		if (lastItem && (isAdding ?
				(lastItem.added && !lastItem.removed) :
				(!lastItem.added && lastItem.removed))) {
			updatePrevious(value);
		} else {
			result.push(optItem);
		}
	}

	// Adding a new string part for item that has not been changed
	function addItem(value: string) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffBit = result[lastIndex];
		if (lastItem && !lastItem.added && !lastItem.removed) {
			updatePrevious(value);
		} else {
			result.push({count: 2, value: value});
		}
	}

	const result: DiffBit[] = [];
	const lastSymbol: string = '';

	o = o.replace(/\s+$/, '');
	n = n.replace(/\s+$/, '');

	// Pre-Parsing the strings
	const out: DiffResultObject = diffPreParse(!o ? [] : o.split(/\s+/), !n ? [] : n.split(/\s+/));

	// Setting an array of space characters to add
	let oSpace: string[] = o.match(/\s+/g);
	if (!oSpace) {
		oSpace = [lastSymbol];
	} else {
		oSpace.push(lastSymbol);
	}
	let nSpace: string[] = n.match(/\s+/g);
	if (!nSpace) {
		nSpace = [lastSymbol];
	} else {
		nSpace.push(lastSymbol);
	}

	// If not new string set all as deleted
	if (out.n.length === 0) {
		for (let i = 0; i < out.o.length; i++) {
			addOptItem(out.o[i] + oSpace[i], false);
		}
	} else {
		if (!out.n[0].text) {
			for (let m = 0; m < out.o.length && !out.o[m].text; m++) {
				addOptItem(out.o[m] + oSpace[m], false);
			}
		}

		for (let i = 0; i < out.n.length; i++) {
			if (!out.n[i].text) {
				addOptItem(out.n[i] + nSpace[i], true);
			} else {
				const preArr = [];		// String parts to pass to the end as deleted

				for (let m = out.n[i].row + 1; m < out.o.length && !out.o[m].text; m++) {
					preArr.push(out.o[m] + oSpace[m]);
				}
				addItem(out.n[i].text + nSpace[i]);
				preArr.forEach(function (item) {
					addOptItem(item, false);
				});
			}
		}
	}
	return result;
}
