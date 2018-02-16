/* eslint-disable */

const path = require('path');

const rootPath = require('find-root')();

const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');
const seleniumJAR = require('selenium-server-standalone-jar');

console.log('Application root:', rootPath);
console.log('Selenium version:', seleniumJAR.version);
console.log('Chrome driver version:', chromedriver.version);
console.log('Gecko driver version:', geckodriver.version);

require('tsconfig-paths/register');

const selenium = {
	start_process: true,
	server_path: seleniumJAR.path,
	port: 4444,
	cli_args: {
		'webdriver.chrome.driver': chromedriver.path,
		'webdriver.gecko.driver': geckodriver.path,
	},
};

module.exports = {
	src_folders: [ path.join(rootPath, 'out/test/frontend') ],
	live_output: true,

	selenium,

	'test_settings': {
		'default': {
			'filter': '**/*.test.*',
			'launch_url': 'http://localhost',
			'selenium_port': 4444,
			'selenium_host': 'localhost',
			'silent': false,
			'screenshots' : {
				'enabled' : false,
			},
			'end_session_on_fail': true,
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

/*
const conf = {
	src_folders: ['src/test/frontend'],
	output_folder: false,
	selenium: SELENIUM_CONFIGURATION,
	test_runner: {
		type: 'mocha',
		options: {
			ui: 'bdd',
			reporter: 'list',
		},
	},
	test_settings: ENVIRONMENTS,
};
*/
