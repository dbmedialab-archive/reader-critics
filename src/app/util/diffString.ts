/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *  Modified for objects and TypeScript by Dimitriy Borshchov "grimstal" grimstal@bigmir.net
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

interface DiffParsingItem {
	rows: number[];			// Contains indexes of item's positions
}

// Contains info about simple part of string word and every it's position
interface DiffParsingObject {
	[name: string]: DiffParsingItem;
}

// Result of pre-parsing the string
interface DiffResultObject {
	o: any[];				// Array of objects from an old string
	n: any[];				// Array of objects from a new string
}

// Object to show every single part of string after diff check
export interface DiffStringResultObject {
	count: number;			// Amount of items in string part
	added?: boolean;		// Is string added
	removed?: boolean;		// Is string removed
	value: string;			// String part
}

/*
	Pre-parsing strings to find and mark parts which are same and with differences
 */
function diff(o: string[], n: string[]): DiffResultObject {
	const ns: DiffParsingObject = {};			// Info for new string
	const os: DiffParsingObject = {};			// Info for old string
	const nn: any[] = Object.assign([], n);		// Object to change while parsing new string
	const no: any[] = Object.assign([], o);		// Object to change while parsing old string

	// Pick info about every simple part of new string and it's positions
	for (let i = 0; i < nn.length; i++) {
		if (!ns[nn[i]]) {
			ns[nn[i]] = {rows: []};
		}
		ns[nn[i]].rows.push(i);
	}

	// Pick info about every simple part of old string and it's positions
	for (let i = 0; i < no.length; i++) {
		if (!os[no[i]]) {
			os[no[i]] = {rows: []};
		}
		os[no[i]].rows.push(i);
	}

	// Marking parts that are the same
	for (const i in ns) {
		if (ns[i].rows.length === 1 && typeof(os[i]) !== 'undefined' &&
			os[i].rows.length === 1) {
			nn[ns[i].rows[0]] = {text: nn[ns[i].rows[0]], row: os[i].rows[0]};
			no[os[i].rows[0]] = {text: no[os[i].rows[0]], row: ns[i].rows[0]};
		}
	}

	// Looking for parts with differences
	for (let i = 0; i < nn.length - 1; i++) {
		if (nn[i].text && !nn[i + 1].text && nn[i].row + 1 < no.length &&
			!no[nn[i].row + 1].text && nn[i + 1] === no[nn[i].row + 1]) {
			nn[i + 1] = {text: nn[i + 1], row: nn[i].row + 1};
			no[nn[i].row + 1] = {text: no[nn[i].row + 1], row: i + 1};
		}
	}

	// Still looking for parts with differences
	for (let i = nn.length - 1; i > 0; i--) {
		if (nn[i].text && !nn[i - 1].text && nn[i].row > 0 &&
			!no[nn[i].row - 1].text && nn[i - 1] === no[nn[i].row - 1]) {
			nn[i - 1] = {text: nn[i - 1], row: nn[i].row - 1};
			no[nn[i].row - 1] = {text: no[nn[i].row - 1], row: i - 1};
		}
	}

	return {o: no, n: nn};
}

/*
	Building an object or a string with result of diff operation
 */
function diffString(o: string, n: string, isHTML: boolean = false): Array<DiffStringResultObject> | string {
	// Updates the previous string part adding to it value and count of current item
	function updatePrevious(value: string) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffStringResultObject = result[lastIndex];
		const replaceItem: DiffStringResultObject = Object.assign({}, lastItem, {
			count: lastItem.count + 2,
			value: lastItem.value + value,
		});

		result.splice(lastIndex, 1, replaceItem);
	}

	// Adding a new string part with added/deleted flags
	function addOptItem(value: string, isAdding: boolean) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffStringResultObject = result[lastIndex];
		const optItem: DiffStringResultObject = {
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
		const lastItem: DiffStringResultObject = result[lastIndex];
		if (lastItem && !lastItem.added && !lastItem.removed) {
			updatePrevious(value);
		} else {
			result.push({count: 2, value: value});
		}
	}

	const result: DiffStringResultObject[] = [];
	const lastSymbol: string = isHTML ? '\n' : '';	// If building an html text using the '/n' as an end of string
	let str: string = '';

	o = o.replace(/\s+$/, '');
	n = n.replace(/\s+$/, '');

	// Pre-Parsing the strings
	const out: DiffResultObject = diff(!o ? [] : o.split(/\s+/), !n ? [] : n.split(/\s+/));

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
			str += '<del>' + encodeURIComponent(out.o[i]) + oSpace[i] + '</del>';
			addOptItem(out.o[i] + oSpace[i], false);
		}
	} else {
		if (!out.n[0].text) {
			for (let m = 0; m < out.o.length && !out.o[m].text; m++) {
				str += '<del>' + encodeURIComponent(out.o[m]) + oSpace[m] + '</del>';
				addOptItem(out.o[m] + oSpace[m], false);
			}
		}

		for (let i = 0; i < out.n.length; i++) {
			if (!out.n[i].text) {
				str += '<ins>' + encodeURIComponent(out.n[i]) + nSpace[i] + '</ins>';
				addOptItem(out.n[i] + nSpace[i], true);
			} else {
				let pre = '';
				const preArr = [];		// String parts to pass to the end as deleted

				for (let m = out.n[i].row + 1; m < out.o.length && !out.o[m].text; m++) {
					pre += '<del>' + encodeURIComponent(out.o[m]) + oSpace[m] + '</del>';
					preArr.push(out.o[m] + oSpace[m]);
				}
				str += ' ' + out.n[i].text + nSpace[i] + pre;
				addItem(out.n[i].text + nSpace[i]);
				preArr.forEach(function (item) {
					addOptItem(item, false);
				});
			}
		}
	}
	return (isHTML ? str : result);
}

export default diffString;
