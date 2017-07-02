import * as util from 'util';

import * as hasColor from 'has-color';

export function inspect(obj : any) : string {
	return util.inspect(obj, {
		breakLength: Infinity,
		colors: <boolean> hasColor,
		depth: null,
		showHidden: true,
	});
}
