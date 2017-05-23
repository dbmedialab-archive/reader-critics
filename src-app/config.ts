import * as convict from 'convict';

const config = convict({
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4000,
			env: 'HTTP_PORT',
		},
	},
	parser: {
		doc: 'Fallback setting for the article parser',
		fallback: 'html',
		env: 'PARSER',
	},
});

config.validate();

export default config;
