import 'mocha';

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
