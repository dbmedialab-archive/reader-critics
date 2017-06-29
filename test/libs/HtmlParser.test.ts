import 'mocha';

import { assert } from 'chai';
import { URL } from 'url';
import HtmlParser from '../../src/app/parser/html/HtmlParser.mock';

// Tests

describe('Html Parser', function() {
	let article;

	before(function(done) {
		new HtmlParser('../../resources/page/page-get.html')
			.getArticle()
			.then(function(data) {
				article = data;
				done();
			});
	});

	// it('Parser works correctly', function() {
	// 	article.elements.forEach((item) => {
	// 		console.log(item);
	// 	});
	// 	assert.equal(true, true);
	// });

});
