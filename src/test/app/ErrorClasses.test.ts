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

import { assert } from 'chai';

import {
	ConfigError,
	EmptyError,
	InvalidRequestError,
	NotFoundError,
	ParserNotFoundError,
	SchemaValidationError,
} from 'app/util/errors';

describe('Error classes', () => {
	it('ConfigError', () => {
		const e = new ConfigError('message');
		assert.isTrue(e instanceof ConfigError);
		assert.isTrue(e instanceof Error);
	});

	it('EmptyError', () => {
		const e = new EmptyError('message');
		assert.isTrue(e instanceof EmptyError);
		assert.isTrue(e instanceof Error);
	});

	it('InvalidRequestError', () => {
		const e = new InvalidRequestError('message');
		assert.isTrue(e instanceof InvalidRequestError);
		assert.isTrue(e instanceof Error);
	});

	it('NotFoundError', () => {
		const e = new NotFoundError('message');
		assert.isTrue(e instanceof NotFoundError);
		assert.isTrue(e instanceof Error);
	});

	it('ParserNotFoundError', () => {
		const e = new ParserNotFoundError('message');
		assert.isTrue(e instanceof ParserNotFoundError);
		assert.isTrue(e instanceof Error);
	});

	it('SchemaValidationError', () => {
		const e = new SchemaValidationError('message');
		assert.isTrue(e instanceof SchemaValidationError);
		assert.isTrue(e instanceof Error);
	});
});
