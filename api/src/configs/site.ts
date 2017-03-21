import * as convict from 'convict';

const config = convict({
	env: {
		doc: 'The application environment',
		format: ['production', 'development', 'test'],
		default: 'production',
		env: 'NODE_ENV',
	},
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4001,
			env: 'HTTP_PORT',
		},
	},
	mysql: {
		url: {
			doc: 'MySQL connection URL for the main backend database',
			default: 'mysql://localhost:3306/kildekritikk_api',
			env: 'MYSQL_URL',
		},
	},
	parser: {
		fallback: 'html',
		env: 'PARSER',
	},
});

config.validate();

export default config;
