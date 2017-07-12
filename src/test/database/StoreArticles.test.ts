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

// tslint:disable-next-line
import { assert } from 'chai';

import {
	Article,
	ArticleURL,
} from 'base';

import {
	articleService,
	websiteService,
} from 'app/services';

import { initDatabase } from 'app/db';
import { ArticleModel } from 'app/db/models';

const testURL = 'http://www.dagbladet.no/68469658';

describe.skip('Store article', function () {

	before(function (done) {
		initDatabase().then(() => done()).catch(error => done(error));
	});

	it('Example one', function(done) {
		const articleURL = new ArticleURL(testURL);
		const website = websiteService.identify(articleURL);

		articleService.fetch(website, articleURL)
		.then((article : Article) => {
			console.log('safe ---------');
			return articleService.save(website, article);
		})
		.then(() => {
			console.log('load ---------');
			const loaded = ArticleModel.findOne({}).exec()
			.then((...args) => {
				console.dir(...args);
				console.log('result -------');
				console.dir(loaded);
			});
		})
		.then(() => done())
		.catch(error => done(error));
	});

});
