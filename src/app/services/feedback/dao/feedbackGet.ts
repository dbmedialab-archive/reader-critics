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
	Document,
	DocumentQuery,
} from 'mongoose';

import Article from 'base/Article';
import Feedback from 'base/Feedback';
import FeedbackStatus from 'base/FeedbackStatus';
import User from 'base/User';
import Website from 'base/Website';

import { ObjectID } from 'app/db';
import { FeedbackModel } from 'app/db/models';

import {
	wrapFind,
	wrapFindOne,
} from 'app/db/common';

import {
	defaultLimit,
	defaultSkip,
	defaultSort,
} from 'app/services/BasicPersistingService';

import emptyCheck from 'app/util/emptyCheck';

// getByArticle

export function getByArticle (
	article : Article,
	skip : number = defaultSkip,
	limit : number = defaultLimit,
	sort : Object = defaultSort
) : Promise <Feedback[]>
{
	emptyCheck(article);

	return wrapFind(populateFeedbacks(
		FeedbackModel.find({
			article: article.ID,
		})
		.sort(sort).skip(skip).limit(limit)
	));
}

// getByArticleAuthor

type QueryByArticleAuthor = {
	articleAuthors? : ObjectID | string
	website? : ObjectID | string
};

export function getByArticleAuthor (
	author : User,
	website? : Website,
	skip : number = defaultSkip,
	limit : number = defaultLimit,
	sort : Object = defaultSort
) : Promise <Feedback[]>
{
	emptyCheck(author);

	const query : QueryByArticleAuthor = {
		articleAuthors: author.ID,
	};

	if (website !== undefined) {
		query.website = website.ID;
	}

	return wrapFind(populateFeedbacks(
		FeedbackModel.find(query).sort(sort).skip(skip).limit(limit)
	));
}

// getByID

export function getByID(
	objectID : string,
	populated : boolean = true
) : Promise <Feedback>
{
	emptyCheck(objectID);

	return wrapFindOne(populateFeedback(FeedbackModel.findOne({
		_id: new ObjectID(objectID),
	})));
}

// getByStatus with additional query parameter

export function getByStatus (
	currentStatus : FeedbackStatus,
	additionalQuery : {} = {},
	skip : number = defaultSkip,
	limit : number = defaultLimit,
	sort : Object = defaultSort
) : Promise <Feedback[]>
{
	emptyCheck(currentStatus);

	const query = Object.assign({}, additionalQuery, {
		'status.status': currentStatus.toString(),
	});

	return wrapFind(populateFeedbacks(
		FeedbackModel.find(query).sort(sort).skip(skip).limit(limit)
	));
}

// getByUpdateToken

export function getByUpdateToken(oneshotUpdateToken : string) : Promise <Feedback> {
	emptyCheck(oneshotUpdateToken);

	return wrapFindOne(populateFeedback(
		FeedbackModel.findOne({
			oneshotUpdateToken,
		})
	));
}

// getRange, using internal populate

export function getRange (
	skip : number = defaultSkip,
	limit : number = defaultLimit,
	sort : Object = defaultSort
) : Promise <Feedback[]>
{
	return wrapFind(populateFeedbacks(
		FeedbackModel.find().sort(sort).skip(skip).limit(limit)
	));
}

// Internal populate

function populateFeedback <D extends Document> (
	query : DocumentQuery <D, D> // | DocumentQuery <D, D>
) : DocumentQuery <D, D> // | DocumentQuery <D, D>
{
	return query.populate({
		path: 'article',
		populate: {
			path: 'authors',
		},
	})
	.populate('enduser');
}

function populateFeedbacks <D extends Document> (
	query : DocumentQuery <D[], D> // | DocumentQuery <D, D>
) : DocumentQuery <D[], D> // | DocumentQuery <D, D>
{
	return query.populate({
		path: 'article',
		populate: {
			path: 'authors',
		},
	})
	.populate('enduser');
}
