import * as Promise from 'bluebird';

before(() => {
	global.Promise = Promise;
});
