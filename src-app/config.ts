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
	mongodb: {
		url: {
			doc: 'MongoDB connection URL for the main backend database',
			default: 'mongodb://localhost:27017/readercritics',
			env: 'MONGODB_URL',
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
