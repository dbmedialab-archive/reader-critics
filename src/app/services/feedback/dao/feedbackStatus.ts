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

import Feedback from 'base/Feedback';
import FeedbackStatus from 'base/FeedbackStatus';
import emptyCheck from 'app/util/emptyCheck';

import { FeedbackModel } from 'app/db/models';
import { wrapFindOne } from 'app/db/common';
import { ModelFindByIdAndUpdateOptions } from 'mongoose';

export function updateStatus(
	feedback : Feedback,
	newStatus : FeedbackStatus
) : Promise <void>
{
	emptyCheck(feedback, newStatus);

	// Need to load the feedback object first for pushing its current status
	// back into its log array. Don't rely on whatever comes in through the
	// "feedback" parameter to this function, it might be outdated, modified,
	// not correctly populated, just don't.
	// I'm afraid this isn't an atomic operation either since MongoDB does not
	// really support document locks, but it's much closer to the ideal.
	return wrapFindOne(FeedbackModel.findOne({
		_id: feedback.ID,
	}))
	// Now findByIdAndUpdate(), move current status to log, set the new one
	.then((fbBefore : Feedback) => {
		const {
			status,
			changeDate,
		} = fbBefore.status;

		const update = {
			// Move current status to log ...
			'$push': {
				'status.log': {
					status,
					changeDate,
				},
			},
			// ... and set the new one
			'$set': {
				'status.status': newStatus.toString(),
				'status.changeDate': new Date(),
			},
		};

		const options : ModelFindByIdAndUpdateOptions = {
			// Options! We do not want upsert, fail if it doesn't exist!
			// Impossible by the way, because of the preceeding findOne().
			upsert: false,
		};

		return FeedbackModel.findByIdAndUpdate(feedback.ID, update, options);
	})
	// Ignoring whatever comes from findByIdAndUpdate(), we just return a void
	// promise here. TypeScript is giving me enormous trouble because it insists
	// on the type of the object returned from findByIdAndUpdate() is incompatible
	// with the "Feedback" interface, even when wrapping it with wrapFindOne().
	// Since the modified object is (at least I think so right now) not needed
	// inside the application and it just would have been convenient for the tests
	// I decided to give up and just return Promise <void> instead.
	// If need be, chain another getByID() here.
	.then(() => {
		return null;
	});
}
