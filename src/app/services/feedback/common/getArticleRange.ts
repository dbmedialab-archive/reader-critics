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

import {defaultLimit, defaultSkip} from 'app/services/BasicPersistingService';
import {FeedbackDocument, FeedbackModel} from 'app/db/models';
import {Document} from 'mongoose';

// getArticleRange, using internal populate
export default function(skip: number = defaultSkip,
						limit: number = defaultLimit,
						sort: Object = {
							'feedbacks.items.order.type': -1,
							'date.created': -1,
						}): Promise <FeedbackDocument[]> {
	return FeedbackModel
		.aggregate(
			[
				{
					$group: {
						_id: {
							article: '$article',
							enduser: '$enduser',
						},
						feedbacks: {
							$addToSet: '$_id',
						},
					},
				},
				{
					$project: {
						_id: 0,
						article: '$_id.article',
						enduser: '$_id.enduser',
						feedbacks: '$feedbacks',
					},
				},
				{$sort: sort},
				{$skip: skip},
				{$limit: limit},
			])
		.then(populateFeedback);
}

// Internal populate

function populateFeedback<D extends Document> (
	query: FeedbackDocument[]
	): Promise <FeedbackDocument[]> {
	return FeedbackModel.populate(query, {
		path: 'article',
		populate: {
			path: 'authors',
		},
	}).then(result => FeedbackModel.populate(result,{
		path: 'feedbacks',
		populate: {
			path: 'feedback',
		},
		select: '-article -enduser',
	})).then(result => FeedbackModel.populate(result, {
		path: 'enduser',
		populate: {
			path: 'enduser',
		},
	}));
}
