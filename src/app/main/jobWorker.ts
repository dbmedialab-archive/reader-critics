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

import * as colors from 'ansicolors';
import * as cluster from 'cluster';

import * as app from 'app/util/applib';

import { initDatabase } from 'app/db';
import { initJobWorkerQueue } from 'app/queue';
import { initLocalizationStrings } from 'app/services/localization';

/* !!! >>>>> */
import Article from 'base/Article';
import Feedback from 'base/Feedback';

import onNewFeedback from 'app/queue/handlers/onNewFeedback';

import {
	articleService,
	feedbackService,
} from 'app/services';
/* <<<<< !!! */

import startupErrorHandler from './startupErrorHandler';

let log;

/**
 * Main function of worker process
 */
export default function() {
	log = app.createLog('worker');
	log('Starting %s worker - ID %d', colors.brightYellow('job'), cluster.worker.id);

	// Main application startup

	Promise.resolve()
		.then(initLocalizationStrings)
		.then(initDatabase)
		.then(initJobWorkerQueue)

/* !!! >>>>> ####################################################### >>>>>*/
		.then(() => {
			log('### MOCK new feedback event #######################################################');

			// Get an article from the test crowd
			return articleService.get('http://www.mopo.no/2', '201707251349')
			// Get first feedback for this article => test contents
			.then((article : Article) => {
				if (article === null) {
					return Promise.reject('Test article not found');
				}
				return feedbackService.getByArticle(article, 0, 1, {
					'date.created': 1,
				});
			})
			// Check result and get feedback from array
			.then((results : Feedback[]) => {
				if (results.length !== 1) {
					return Promise.reject('Test feedback not found');
				}
				return Promise.resolve(results[0]);
			})
			// Send fake event to job processor
			.then((feedback : Feedback) => onNewFeedback({
				data: feedback,
			}, () => {
				log('done() callback');
				log('### MOCK feedback event finished ##################################################');
			}));
		})
/* <<<<< ####################################################### <<<<< !!! */

		.catch(startupErrorHandler);
}
