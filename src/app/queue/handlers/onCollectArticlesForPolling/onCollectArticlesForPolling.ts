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

import * as app from 'app/util/applib';
import * as moment from 'moment';

import {
	DoneCallback,
	Job,
} from 'kue';

import {
	sendMessage,
	MessageType,
} from 'app/queue';

import { articleService } from 'app/services';
import { PollUpdateData } from 'app/services/article/ArticleService';
import { pollParams } from './PollParameters';

const log = app.createLog();

export function onCollectArticlesForPolling(job : Job, done : DoneCallback) : void {
	queryArticles()
	.then(uniq)
	.then((reducedData) => {
		log('Found %d articles that should be polled for updates', reducedData.length);

		// Trigger an update job for each found article. This way we can make use
		// of multiple available job workers by balancing the load throughout all
		// threads that are dedicated to background jobs.
		return Promise.map(reducedData, data => sendMessage(MessageType.PollArticleUpdate, data));

	//	reducedData.forEach();
	})
	.then(() => {
		done();
		return null;
	})
	.catch(error => {
		app.yell(error);
		return done(error);
	});
}

function queryArticles() : Promise <PollUpdateData[]> {
	const now = moment().second(0).millisecond(0).toDate();

	const queries = pollParams.map((pollParam, index) => {
		// Calculate the query dates for certain query periods
		const latestCreated = pollParam.pastBase
			? moment(now).subtract(pollParam.pastBase).toDate()
			: now;

		const earliestCreated = moment(latestCreated).subtract(pollParam.querySpan).toDate();
		const latestPoll = moment(now).subtract(pollParam.pollSpan).toDate();

		return articleService.getIDsToPullUpdates(latestCreated, earliestCreated, latestPoll);
	});

	return Promise.all(queries).then((arrayOfArrays : PollUpdateData[][]) => {
		// Concatenace all arrays of article IDs together into one single array
		return [].concat(...arrayOfArrays) as PollUpdateData[];
	});
}

function uniq(unsortedData : PollUpdateData[]) : Promise <PollUpdateData[]> {
	// Create an intermediate map of IDs to filter out duplicates.
	// Duplicates shouldn't really occur if the polling parameters are set up correctly
	// (no intersection of time periods). But better safe than sorry!
	const theReducer = (accu : {}, item : PollUpdateData) => {
		accu[item.ID] = item;
		return accu;
	};

	const reducedData = unsortedData.reduce(theReducer, Object.create(null));

	return Promise.resolve(Object.values(reducedData));
}
