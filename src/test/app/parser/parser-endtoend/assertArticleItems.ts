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

import ArticleItem from 'base/ArticleItem';

export function checkItemOrder(
	actItem : ArticleItem,
	expItem : ArticleItem,
	index : number,
	inspect : string
) {
	assert.property(actItem, 'order');
	assert.isObject(actItem.order, `Item ${index} "order" is not an object\n${inspect}`);
	assert.isNotEmpty(actItem.order, `Item ${index} "order" is empty\n${inspect}`);

	assert.property(actItem.order, 'item');
	assert.isNumber(actItem.order.item);

	assert.property(actItem.order, 'type');
	assert.isNumber(actItem.order.type);

	assert.strictEqual(
		actItem.order.item,
		expItem.order.item,
		`Item ${index} has different item order\n${inspect}`
	);

	assert.strictEqual(
		actItem.order.type,
		expItem.order.type,
		`Article item ${index} has different type order\n${inspect}`
	);
}

export function checkItemOther(
	actItem : ArticleItem,
	expItem : ArticleItem,
	index : number,
	inspect : string
) {
	if ([ 'featured', 'figure' ].includes(expItem.type)) {
		assert.property(actItem, 'href');
		assert.isString(actItem.href);
		assert.isNotEmpty(actItem.href);

		assert.strictEqual(
			actItem.href,
			expItem.href,
			`Article item ${index} has different "href"\n${inspect}`
		);
	}
}

export function checkItemStruct(
	actItem : ArticleItem,
	expItem : ArticleItem,
	index : number,
	inspect : string
) {
	assert.deepEqual(actItem, expItem, `Item ${index} structure deep check failed \n${inspect}`);
}

export function checkItemText(
	actItem : ArticleItem,
	expItem : ArticleItem,
	index : number,
	inspect : string
) {
	assert.property(actItem, 'text');
	assert.isString(actItem.text);
	assert.isNotEmpty(actItem.text);

	assert.strictEqual(
		actItem.text,
		expItem.text,
		`Article item ${index} has different text\n${inspect}`
	);
}

export function checkItemType(
	actItem : ArticleItem,
	expItem : ArticleItem,
	index : number,
	inspect : string
) {
	assert.property(actItem, 'type');
	assert.isString(actItem.type, `Item ${index} "type" is not a string\n${inspect}`);
	assert.isNotEmpty(actItem.type, `Item ${index} "type" is empty\n${inspect}`);

	assert.strictEqual(
		actItem.type,
		expItem.type,
		`Item ${index} has a differing type\n${inspect}`
	);
}
