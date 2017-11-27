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

import {ArticleModel} from 'app/db/models';

export default function (search?: string) : Promise <number> {
	const match = {
		feedbacks: {$not: {$eq: 0}},
		'itemField.order.type': 1,
		'itemField.order.item': 1,
	};
	if (search) {
		match['$or'] = [
			{'itemField.text' : new RegExp(`${search}`, 'i')},
			{'url' : new RegExp(`^(?:http(?:s)?\\:\\/\\/)?(?:www\\.)?(?:.*\\..*\\/)${search}`, 'i')},
			// The RegExp above is looking for search string match in URL AFTER the domain part
			// Example: for string 'dagbladet' it would find only the article with second link below:
			// - 'http://www.dagbladet.no/articles/65342134'
			// - 'http://mopo.no/articles/dagbladet-never-die/63232123'
		];
	}

	return ArticleModel.aggregate([
			{
				$lookup: {
					from: 'feedbacks',
					localField: '_id',
					foreignField: 'article',
					as: 'feedbacks',
				},
			},
			{
				$project: {
					ID: '$_id',
					itemField: '$items',
					feedbacks: {
						$size: '$feedbacks',
					},
				},
			},
			{
				$unwind: '$itemField',
			},
			{
				$match: match,
			},
		])
		.then((d: any) => d.length);
}
