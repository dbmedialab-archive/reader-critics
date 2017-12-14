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
	DoneCallback,
	Job,
} from 'kue';

import { articleService } from 'app/services';
import { EscalationLevel } from 'base/EscalationLevel';
import { EscalationThresholds } from 'base/EscalationThresholds';

import {
	sendMessage,
	MessageType,
} from 'app/queue';

import Article from 'base/Article';
import Website from 'base/Website';
import config from 'app/config';

import * as app from 'app/util/applib';

const log = app.createLog();

const minThreshold = 3;
const maxThreshold = 200;

export function onCheckEscalationToEditor(job : Job, done : DoneCallback) : void {
	const { articleID } = job.data;
	process(articleID).then(() => {
		done();
		return null;  // Silences the "Promise handler not returned" warnings
	})
	.catch(error => {
		app.yell(error);
		done(error);
		return null;
	});
}

function process(articleID) {
	// We could just push the whole article object into the job message and check
	// the length of the "feedbacks" array here. Two problems with that:
	// - Increased pressure on the queue database because it would have to handle
	//   potentially large payload objects;
	// - Another process concurrently pushing another feedback to this article
	//   will increase the count in the database, but the object in this process
	//   here would know nothing about that; There is actually no guaranteed
	//   "immediate" execution of a queue job so several seconds could pass
	//   between queueing "CheckEscalationToEditor" and picking it up here.
	// The logical thing to do: requery the article here, the round trip to the
	// database is arguable.
	return articleService.getByID(articleID)
	.then(article => {
		const thresholds = getThresholds(article.website);

		log(
			'%s in status "%s" has %d feedbacks / "%s" needs %d',
			articleID, (article.status.escalated || 'none'),
			article.feedbacks.length,
			EscalationLevel.ToEditor, thresholds.toEditor
		);

		const msgPromises : Promise <void> [] = [];

		if (shouldNotifyEditor(thresholds, article)) {
			// Opposite to what's mentioned above, here indeed the whole article
			// object is stuffed into the queue job. But this happens way less often
			// than the check operation.
			msgPromises.push(sendMessage(MessageType.SendEditorEscalation, { article }));
		}

		return Promise.all(msgPromises);
	});
}

function getThresholds(website : Website) : EscalationThresholds {
	// Default threshold value from the application config
	let toEditor : number = config.get('escalateThreshold.defaults.toEditor');

	// Get the threshold setting from the website configuration, if it is set
	if (website.escalateThreshold) {
		if (website.escalateThreshold.toEditor) {
			toEditor = website.escalateThreshold.toEditor;
		}
	}

	// Apply some sensible boundaries to that number
	toEditor = Math.max(toEditor, minThreshold);
	toEditor = Math.min(toEditor, maxThreshold);

	return {
		toEditor,
	};
}

const shouldNotifyEditor = (thresholds : EscalationThresholds, article : Article) => (
	article.status.escalated === null
	&& article.feedbacks.length > thresholds.toEditor
);
