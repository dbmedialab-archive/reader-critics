import fetch from 'node-fetch';
import * as Promise from 'bluebird';
fetch.Promise = Promise;
import 'mocha';

import { expect } from 'chai';

import * as httpServer from './httpServer';

const httpPort = 8000;
const baseURL = `http://localhost:${httpPort}/`;

describe('fetch promise based HTTP client', () => {

	// Setup and teardown

	before((done) => {
		httpServer.listen(httpPort, done);
	});

	after((done) => {
		httpServer.close(done);
	});

	// Tests

	it('Valid route should return HTTP 200', (done) => {
		fetch(baseURL)
			.then((resp) => {
				console.log(resp);
				expect(resp.status, 'response.status').to.not.be.undefined;
				expect(resp.status, 'response.status').to.equal(200);
				done();
			})
			.catch((error) =>{
				done(new Error('Fetch entered "catch" instead of "then"'));
			});
	});

	it('False route should return HTTP 404', (done) => {
		fetch(`${baseURL}not-found`)
			.then((resp) => {
				done(new Error('Fetch entered "then" instead of "catch"'));
			})
			.catch((error)=>{
				expect(error.response.status, 'response.status').to.not.be.undefined;
				expect(error.response.status, 'response.status').to.equal(404);
				done();
			});
	});

	it('Crash route should return HTTP 500', (done) => {
		fetch(`${baseURL}crash-me`)
			.then(() => {
				done(new Error('Fetch entered "then" instead of "catch"'));
			})
			.catch((error) => {
				expect(error.response.status, 'response.status').to.not.be.undefined;
				expect(error.response.status, 'response.status').to.equal(500);
				done();
			});
	});

});
