import * as path from 'path';
import * as callsite from 'callsite';

/*
TODO this comes later: fancy callsite dependend debug channels

console.log('basepath', path.dirname(require.main.filename));

const callstack = callsite();

if (typeof callstack.length === 'number' && callstack.length > 1) {
	callstack.forEach(csi => console.log(csi.getFileName()));
}
*/

export default {
	createDebugChannel: () => {
		return message => console.log(message);
	},
};
