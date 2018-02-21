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

import { assert } from 'chai';
import { Feedback } from 'base/Feedback';

// Generic structure check

export const assertFeedbackObject = (f : Feedback) => {
	assert.isObject(f);

	[ 'article', 'enduser', 'items', 'status' ].forEach(prop => {
		assert.property(f, prop);
	});

	[ 'articleAuthors' ].forEach(prop => {
		assert.notProperty(f, prop);
	});

	// Test if "article" object was populated
	assert.isObject(f.article);
	[ 'authors', 'items', 'url', 'version' ].forEach(prop => {
		assert.property(f.article, prop);
	});

	// Test if "article.authors" array was populated
	assert.isArray(f.article.authors);
	f.article.authors.forEach(author => {
		assert.isObject(author);
		[ 'email', 'name' ].forEach(prop => {
			assert.property(author, prop);
		});
	});

	assert.isObject(f.date);
	assert.isObject(f.enduser);

	assert.isObject(f.status);
	assert.isString(f.status.status);

	assert.isArray(f.items);
};
