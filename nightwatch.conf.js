const log = require('debug')('nightwatch');

const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');
const seleniumJAR = require('selenium-server-standalone-jar');

log('Selenium version: %s', seleniumJAR.version);
log('Chrome driver version: %s', chromedriver.version);
log('Gecko driver version: %s', geckodriver.version);

log(geckodriver);

const conf = {
	'src_folders': ['tests'],
	'output_folder': 'reports',

	'selenium': {
		'server_path': seleniumJAR.path,
		'start_process': true,
//		'log_path': '',
		'port': 4444,
		'cli_args': {
			'webdriver.chrome.driver': chromedriver.path,
			'webdriver.gecko.driver': geckodriver.path,
			// 'webdriver.edge.driver': ''
		},
	},

	'test_settings': {
		'default': {
			'launch_url': 'http://localhost',
			'selenium_port': 4444,
			'selenium_host': 'localhost',
			'silent': true,
			'screenshots' : {
				'enabled' : false,
			},
			'desiredCapabilities': {
				'browserName': 'firefox',
				'marionette': true
			}
		},
	},
};

module.exports = conf;
