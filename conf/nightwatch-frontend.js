const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');
const seleniumJAR = require('selenium-server-standalone-jar');

console.log('Selenium version:', seleniumJAR.version);
console.log('Chrome driver version:', chromedriver.version);
console.log('Gecko driver version:', geckodriver.version);

// require('source-map-support/register');  -- not quite there yet
// require('ts-node/register');
// require('tsconfig-paths/register');

var SELENIUM_CONFIGURATION = {
	start_process: true,
	server_path: seleniumJAR.path,
	port: 4444,
	cli_args : {
		'webdriver.chrome.driver': chromedriver.path,
		'webdriver.gecko.driver': geckodriver.path,
	}
};

var DEFAULT_CONFIGURATION = {
		filter: '**/*.test.js',
		launch_url: 'http://localhost',
		selenium_port: 4444,
		exclude : [],
		selenium_host: 'localhost',
		silent: true,
		screenshots : {
			enabled : false,
			path : ""
		},
		globals: {
			
		},
		end_session_on_fail: true,
		desiredCapabilities: {
			browserName: 'chrome',
		},
		// 'desiredCapabilities': {
		//  	'browserName': 'firefox',
		//  	'marionette': true
		// },
	};
	var ENVIRONMENTS = {
		default: DEFAULT_CONFIGURATION,
		chrome : {
			desiredCapabilities: {
				browserName: "chrome"
			}
		},
	};


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

module.exports = conf;
