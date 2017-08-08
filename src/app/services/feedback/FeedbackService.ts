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
import User from 'base/User';
import Website from 'base/Website';

import BasicPersistingService from '../BasicPersistingService';

interface FeedbackService extends BasicPersistingService <Feedback> {
	create(article : Article, user : EndUser, items : FeedbackItem[]) : Feedback;
	save(feedback : Feedback);

	getByUser(
		website : Website,
		user : User,
		skip? : number,
		limit? : number,
		sort? : Object
	) : Promise <Feedback[]>;

	getByWebsite(
		website : Website,
		skip? : number,
		limit? : number,
		sort? : Object
	) : Promise <Feedback[]>;
}

export default FeedbackService;
