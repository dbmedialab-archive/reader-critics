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
	ArticleDocument,
	ArticleModel
} from 'app/db/models';

import emptyCheck from 'app/util/emptyCheck';

export function getIDsToPullUpdates (
	latestCreated : Date,
	earliestCreated : Date,
	latestPoll : Date
) : Promise <string[]>
{
	emptyCheck(latestCreated, earliestCreated, latestPoll);
	// Returning the promise from Mongoose directly will, once again, make
	// TypeScript cry. So we wrap this thing, old style.
	return new Promise((resolve, reject) => {
		// This is a rather complex query, but its parts are explained
		ArticleModel.find({
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
			// Only those which either haven't been polled yet, or whose last time to
			// poll has passed a timeout.
			$or: [
				{
					'date.lastPoll': {
						'$exists': false,
					},
				},
				{
					'date.lastPoll': {
						$lt: latestPoll,
					},
				},
			],
		})
		.lean().exec()
		.then((docs : ArticleDocument[]) => {
			resolve(docs.map(doc => doc._id as string));
		})
		.catch(error => reject(error));
	});
}
