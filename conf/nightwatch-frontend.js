/* eslint-disable */

const path = require('path');
const rootPath = require('find-root')();

require('app-module-path').addPath(path.join(rootPath, 'out'));
require('source-map-support').install();
require('tsconfig-paths/register');

const chromedriver = require('chromedriver');
// const geckodriver = require('geckodriver');
const seleniumJAR = require('selenium-server-standalone-jar');

console.log('Application root:', rootPath);
console.log('Selenium version:', seleniumJAR.version);
console.log('Chrome driver version:', chromedriver.version);
// console.log('Gecko driver version:', geckodriver.version);

const selenium = {
	start_process: true,
	server_path: seleniumJAR.path,
	port: 4444,
	cli_args: {
		'webdriver.chrome.driver': chromedriver.path,
		// 'webdriver.gecko.driver': geckodriver.path,
	},
};

module.exports = {
	src_folders: [
		path.join(rootPath, 'out/test/frontend')
	],
	output_folder: 'stats',
	live_output: false,

	selenium,

	test_settings: {
		default: {
			filter: '**/*.test.*',
			launch_url: 'http://localhost',
			selenium_port: 4444,
			selenium_host: 'localhost',
			silent: false,
			screenshots: {
				enabled: false,
			},
			end_session_on_fail: true,
			desiredCapabilities: {
				browserName: 'chrome',
			},
		},
	},
};
