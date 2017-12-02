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

import Article from 'base/Article';
import EndUser from 'base/EndUser';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';
import FeedbackStatus from 'base/FeedbackStatus';
import User from 'base/User';
import Website from 'base/Website';

import BasicPersistingService from '../BasicPersistingService';

import { ObjectID } from 'app/db';

/**
 * The feedback service stores feedbacks to articles and provides functions
 * for several types of queries (TBD).
 *
 * Feedback objects do not yet have a unique constraint in the database, which
 * means that it is theoretically possible to post the exact same object more
 * than once.
 *
 * Feedback objects are never updated completely, only separate fields will be
 * writeable (for example, when changing the queue status). Therefore this
 * service does not have a generic update() function.
 */
interface FeedbackService extends BasicPersistingService <Feedback> {
	/**
	 * Get all feedback objects related to one article.
	 */
	getByArticle(
		article : Article,
		skip? : number,
		limit? : number,
		sort? : Object
	) : Promise <Feedback[]>;

	/**
	 * Get all feedback objects related to one article author, optionally filter
	 * also by website.
	 */
	getByArticleAuthor(
		author : User,
		website? : Website,
		skip? : number,
		limit? : number,
		sort? : Object
	) : Promise <Feedback[]>;

	/**
	 * Get a single feedback object, identified by its database object
	 */
	getByID(objectID : string, populated? : boolean) : Promise <Feedback>;

	/**
	 * Save the new feedback object and create references to all involved objects.
	 * The references to the Website and User objects are copied over from the
	 * provided Article object. This is needed for complex querying with filters.
	 * The array of Users equals the article's authors.
	 *
	 * @throws EmptyError If one of the mandatory parameters is missing.
	 */
	save(
		article : Article,
		user : EndUser,
		items : FeedbackItem[]
	) : Promise <Feedback>;

	/**
	 * Takes a raw input object and validates its structure before saving the
	 * contained feedback with all references. This function uses save() as soon
	 * as all involved objects have been fetched for referencing, of course under
	 * the condition that the initial validation does not throw an error.
	 *
	 * This function is intended for usage on the API, so that the data does not
	 * have to be validated there. Just receive the data from the
	 *
	 * After validating, the function internally fetches the article that this
	 * feedback is based on (identified by its key properties "url" and "version")
	 * and in a parallel database action, retrieves or (if not existing) creates
	 * the EndUser object of Anonymous user.
	 *
	 * When these two objects (Article and EndUser) are ready, both are give to
	 * save() together with the feedback items, which are also parsed from the raw
	 * input object.
	 *
	 * TODO: real JSON schema validation, linking the schema file here in the
	 * documentation for reference. See RC-110.
	 *
	 * @throws SchemaValidationError If the input data does not pass validation
	 */
	validateAndSave(data : any) : Promise <Feedback>;

	/**
	 * Updates the existing feedback object with enduser data.
	 *
	 * @throws EmptyError If enduser parameter is missing.
	 */
	updateEndUser(
		id : ObjectID,
		enduser : EndUser
	) : Promise <Feedback>;

	/**
	 * Returns amount of feedbacks exist for current article
	 *
	 * @throws EmptyError If article parameter is missing.
	 */
	getAmountByArticle(
		article : Article
	) : Promise <number>;

	/**
	 * Updates the current status of the feedback object and puts the (now)
	 * previous status into the log array.
	 */
	updateStatus(
		feedback : Feedback,
		newStatus : FeedbackStatus
	) : Promise <void>

}

export default FeedbackService;
