//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

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
	// catching network error
	// 3xx-5xx responses are NOT network errors, and should be handled in then()
	// you only need one catch() at the end of your promise chain
	// src: https://github.com/bitinn/node-fetch#usage

	it('Valid route should return HTTP 200', (done) => {
		fetch(baseURL)
			.then((resp) => {
				expect(resp.status, 'response.status').to.not.be.undefined;
				expect(resp.status, 'response.status').to.equal(200);
				done();
			})
			.catch((error) => {
				done(new Error(error));
			});
	});

	it('False route should return HTTP 404', (done) => {
		fetch(`${baseURL}not-found`)
			.then((resp) => {
				expect(resp.status, 'response.status').to.not.be.undefined;
				expect(resp.status, 'response.status').to.equal(404);
				done();
			})
			.catch((error) => {
				done(new Error(error));
			});
	});

	it('Crash route should return HTTP 500', (done) => {
		fetch(`${baseURL}crash-me`)
			.then((resp) => {
				expect(resp.status, 'response.status').to.not.be.undefined;
				expect(resp.status, 'response.status').to.equal(500);
				done();
			})
			.catch((error) => {
				done(new Error(error));
			});
	});

});
