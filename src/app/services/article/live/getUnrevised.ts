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

import {
	Article,
	Website,
} from 'base';

import { ArticleModel } from 'app/db/models';
import { wrapFind } from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

export function getUnrevised (
	website : Website,
	latestCreated : Date,
	earliestCreated : Date
) : Promise <Article[]>
{
	emptyCheck(latestCreated, earliestCreated);
	return wrapFind(ArticleModel.find({
		'website': website.ID,
		// Only a certain timespan will be checked
		'date.created': {
			'$gt': earliestCreated,
			'$lte': latestCreated,
		},
		// Only articles that have received feedback
		'feedbacks': {
			$exists: true,
			$not: {
				'$size': 0,
			},
		},
	// Only those where the "newerVersion" field does not exist yet, meaning
		// those which haven't been already outdated by an updated version that
		// exists here in the database
		'newerVersion': {
			'$exists': false,
		},
	}).populate('authors'));
}
