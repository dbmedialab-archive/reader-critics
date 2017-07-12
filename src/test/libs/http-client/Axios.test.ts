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

import 'mocha';

import { expect } from 'chai';

import { default as axios } from 'axios';

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
