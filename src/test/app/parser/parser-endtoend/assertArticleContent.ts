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

import * as util from 'util';

import { assert } from 'chai';

import Article from 'base/Article';
import ArticleItem from 'base/ArticleItem';

import {
	checkItemOrder,
	checkItemOther,
	checkItemStruct,
	checkItemText,
	checkItemType,
} from './assertArticleItems';

const articleItemInspect = (item : ArticleItem) : string => util.inspect(item, {
	breakLength: Infinity,
	colors: false,
	depth: null,
	showHidden: true,
}) + '\n';

export function checkContent(actual : Article, expected : Article) {
	assert.property(actual, 'items', 'Article "items" does not exist');
	assert.isArray(actual.items, 'Article "items" is not a string');
	assert.isNotEmpty(actual.items, 'Array of <ArticleItem> is empty');

	assert.lengthOf(
		actual.items,
		expected.items.length,
		'Array of <ArticleItem> has different length than expected'
	);

	expected.items.forEach((expItem : ArticleItem, index : number) => {
		const actItem = actual.items[index];
		const inspect = articleItemInspect(actItem);

		checkItemType(actItem, expItem, index, inspect);
		checkItemOrder(actItem, expItem, index, inspect);
		checkItemText(actItem, expItem, index, inspect);
		checkItemOther(actItem, expItem, index, inspect);
	});
}
