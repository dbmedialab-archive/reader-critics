import 'mocha';

import { expect } from 'chai';

import {
	default as axios,
	AxiosPromise,
	AxiosResponse,
} from 'axios';

import * as httpServer from './httpServer';

const httpPort = 8000;
const baseURL = `http://localhost:${httpPort}/`;

describe('«axios» promise based HTTP client', function() {

	// Setup and teardown

	before((done) => {
		httpServer.listen(httpPort, done);
	});

	after((done) => {
		httpServer.close(done);
	});

	// Tests

	it('Valid route should return HTTP 200', function(done) {
		axios.get(baseURL)
		.then(function(resp) {
			expect(resp.status, 'response.status').to.not.be.undefined;
			expect(resp.status, 'response.status').to.equal(200);
			done();
		})
		.catch(function(error) {
			done(new Error('Axios entered "catch" instead of "then"'));
		});
	});

	it('False route should return HTTP 404', function(done) {
		axios.get(`${baseURL}not-found`)
		.then(function(resp) {
			done(new Error('Axios entered "then" instead of "catch"'));
		})
		.catch(function(error) {
			expect(error.response.status, 'response.status').to.not.be.undefined;
			expect(error.response.status, 'response.status').to.equal(404);
			done();
		});
	});

	it('Crash route should return HTTP 500', function(done) {
		axios.get(`${baseURL}crash-me`)
		.then(function() {
			done(new Error('Axios entered "then" instead of "catch"'));
		})
		.catch(function(error) {
			expect(error.response.status, 'response.status').to.not.be.undefined;
			expect(error.response.status, 'response.status').to.equal(500);
			done();
		});
	});

});
