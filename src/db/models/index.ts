import * as requireAll from 'require-all';

module.exports = requireAll({
	dirname: __dirname,
	// Only files that start with a capital letter
	filter: /^([A-Z]\w+)\.(:?js|ts)/,
	// Map the default exports
	resolve: mod => mod.default,
});
