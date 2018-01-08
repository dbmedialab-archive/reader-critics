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

import Article from './Article';
import EndUser from './EndUser';
import FeedbackItem from './FeedbackItem';
import FeedbackStatus from './FeedbackStatus';
import PersistedModel from './zz/PersistedModel';
import User from './User';
import Website from './Website';

export interface FeedbackStatusEntry {
	status : FeedbackStatus
	changeDate : Date
}

interface Feedback extends PersistedModel {
	/** The Article that this feedback object is based on */
	article : Article

	/** The EndUser who sent in this feedback */
	enduser : EndUser

	/** Copy of the Website reference from "article", for filtered queries */
	website? : Website

	/** Copy of the authors references from "article", for filtered queries */
	articleAuthors? : User[]

	/** The actual feedback data, related to the article items */
	items : FeedbackItem[]

	/** Current processing status and a log of all past status changes */
	status : FeedbackStatusEntry & {
		log : FeedbackStatusEntry[]
	}

	/**
	 * Token which enables an enduser to update his/her data after the feedback
	 * has already been posted
	 */
	oneshotUpdateToken? : string

	date? : {
		created? : Date
		modified? : Date
	}
}

export default Feedback;
