const log = require('debug')('nightwatch');

const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');
const seleniumJAR = require('selenium-server-standalone-jar');

log('Selenium version: %s', seleniumJAR.version);
log('Chrome driver version: %s', chromedriver.version);
log('Gecko driver version: %s', geckodriver.version);

// require('source-map-support/register');  -- not quite there yet
// require('ts-node/register');
// require('tsconfig-paths/register');

const conf = {
	'src_folders': ['test/frontend'],
	'output_folder': false,

	'selenium': {
		'server_path': seleniumJAR.path,
		'start_process': true,
		'port': 4444,
		'cli_args': {
			'webdriver.chrome.driver': chromedriver.path,
			'webdriver.gecko.driver': geckodriver.path,
		},
	},

	'test_runner': {
		'type': 'mocha',
		'options': {
			'ui': 'bdd',
			'reporter': 'list'
		},
	},

	'test_settings': {
		'default': {
			'filter': '*.test.js',
			'launch_url': 'http://localhost',
			'selenium_port': 4444,
			'selenium_host': 'localhost',
			'silent': true,
			'screenshots' : {
				'enabled' : false,
			},
			'desiredCapabilities': {
				'browserName': 'chrome',
			},
			// 'desiredCapabilities': {
			//  	'browserName': 'firefox',
			//  	'marionette': true
			// },
		},
	},
};

module.exports = conf;
