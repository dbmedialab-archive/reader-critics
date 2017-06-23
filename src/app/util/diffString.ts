/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *  Modified by Dimitriy Borshchov "grimstal" grimstal@bigmir.net
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

interface DiffParsingItem {
	rows: number[];
}

interface DiffParsingObject {
	[name: string]: DiffParsingItem;
}

interface DiffResultObject {
	o: any[];
	n: any[];
}

export interface DiffStringResultObject {
	count: number;
	added?: boolean;
	removed?: boolean;
	value: string;
}

function diff(o: string[], n: string[]): DiffResultObject {
	const ns: DiffParsingObject = {};
	const os: DiffParsingObject = {};
	const nn: any[] = Object.assign([], n);
	const no: any[] = Object.assign([], o);

	for (let i = 0; i < n.length; i++) {
		if (!ns[n[i]]) {
			ns[n[i]] = {rows: []};
		}
		ns[n[i]].rows.push(i);
	}

	for (let i = 0; i < o.length; i++) {
		if (!os[o[i]]) {
			os[o[i]] = {rows: []};
		}
		os[o[i]].rows.push(i);
	}

	for (const i in ns) {
		if (ns[i].rows.length === 1 && typeof(os[i]) !== 'undefined' &&
			os[i].rows.length === 1) {
			nn[ns[i].rows[0]] = {text: nn[ns[i].rows[0]], row: os[i].rows[0]};
			no[os[i].rows[0]] = {text: no[os[i].rows[0]], row: ns[i].rows[0]};
		}
	}

	for (let i = 0; i < nn.length - 1; i++) {
		if (nn[i].text && !nn[i + 1].text && nn[i].row + 1 < no.length &&
			!no[nn[i].row + 1].text && nn[i + 1] === no[nn[i].row + 1]) {
			nn[i + 1] = {text: nn[i + 1], row: nn[i].row + 1};
			no[nn[i].row + 1] = {text: no[nn[i].row + 1], row: i + 1};
		}
	}

	for (let i = nn.length - 1; i > 0; i--) {
		if (nn[i].text && !nn[i - 1].text && nn[i].row > 0 &&
			!no[nn[i].row - 1].text && nn[i - 1] === no[nn[i].row - 1]) {
			nn[i - 1] = {text: nn[i - 1], row: nn[i].row - 1};
			no[nn[i].row - 1] = {text: no[nn[i].row - 1], row: i - 1};
		}
	}

	return {o: no, n: nn};
}

function diffString(o: string, n: string, isHTML: boolean): DiffStringResultObject[] | string {
	function updatePrevious(value: string) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffStringResultObject = result[lastIndex];
		const replaceItem: DiffStringResultObject = Object.assign({}, lastItem, {
			count: lastItem.count + 2,
			value: lastItem.value + value,
		});

		result.splice(lastIndex, 1, replaceItem);
	}

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

	function addItem(value: string) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffStringResultObject = result[lastIndex];
		if (lastItem && !lastItem.added && !lastItem.removed) {
			updatePrevious(value);
		} else {
			result.push({count: 2, value: value});
		}
	}

	o = o.replace(/\s+$/, '');
	n = n.replace(/\s+$/, '');

	const out: DiffResultObject = diff(!o ? [] : o.split(/\s+/), !n ? [] : n.split(/\s+/));
	const result: DiffStringResultObject[] = [];
	let str: string = '';

	let oSpace: string[] = o.match(/\s+/g);
	if (!oSpace) {
		oSpace = ['\n'];
	} else {
		oSpace.push('\n');
	}
	let nSpace: string[] = n.match(/\s+/g);
	if (!nSpace) {
		nSpace = ['\n'];
	} else {
		nSpace.push('\n');
	}

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
				const preArr = [];

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
//
// const textA = 'Bavaria ipsum dolor eana is ma Wuascht, a bissal wos gehd ollaweil und sei Diandldrahn de Sonn nois.';
// const textB = 'Bavaria ipsum dolor eana is ma Worschd, a bisserl was geht allerweil und sei Diandldrahn de nackata.';
//
// console.log(diffString(textA, textB, false));

export default diffString;
