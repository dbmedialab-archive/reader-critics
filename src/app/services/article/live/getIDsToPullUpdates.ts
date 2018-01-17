import * as app from 'app/util/applib';

import {
	ArticleDocument,
	ArticleModel
} from 'app/db/models';

const log = app.createLog();

export function getIDsToPullUpdates () {
	// This is a rather complex query, but its parts are explained
	return ArticleModel.find({
		// Only a certain timespan will be checked
		'date.created': {
			'$gte': new Date('2018-01-16T10:00:00Z'),  // FIXME parameter
			'$lt': new Date('2018-01-17T10:00:00Z'),  // FIXME parameter
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
					$lt: new Date('2018-01-14T10:00:00Z'),  // FIXME parameter
				},
			},
		],
	})
	.lean().exec()
	.then((docs : ArticleDocument[]) => {
		docs.forEach(d => log(d._id, d.url));
		// log(app.inspect(docs));
	});
}
