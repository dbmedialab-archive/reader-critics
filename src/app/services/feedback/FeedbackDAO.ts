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
import * as mongoose from 'mongoose';

import Article from 'base/Article';
import EndUser from 'base/EndUser';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';
import FeedbackStatus from 'base/FeedbackStatus';
import User from 'base/User';
import Website from 'base/Website';

import { FeedbackModel } from 'app/db/models';

import {
	wrapFind, wrapFindOne,
	wrapSave,
} from 'app/db/common';

import {
	defaultLimit,
	defaultSkip,
	defaultSort,
} from 'app/services/BasicPersistingService';

import emptyCheck from 'app/util/emptyCheck';
import {ObjectID} from 'bson';

// getByArticle

export function getByArticle (
	article : Article,
	skip : number = defaultSkip,
	limit : number = defaultLimit,
	sort : Object = defaultSort
) : Promise <Feedback[]>
{
	emptyCheck(article);

	return wrapFind(populateFeedback(
		FeedbackModel.find({
			article: article.ID,
		})
		.sort(sort).skip(skip).limit(limit)
	));
}

// getByArticleAuthor

export function getByArticleAuthor (
	author : User,
	website? : Website,
	skip : number = defaultSkip,
	limit : number = defaultLimit,
	sort : Object = defaultSort
) : Promise <Feedback[]>
{
	emptyCheck(author);

	const query : any = {
		articleAuthors: author.ID,
	};

	if (website !== undefined) {
		query.website = website.ID;
	}

	return wrapFind(populateFeedback(
		FeedbackModel.find(query)
		.sort(sort).skip(skip).limit(limit)
	));
}

// getRange, using internal populate

export function getRange (
	skip : number = defaultSkip,
	limit : number = defaultLimit,
	sort : Object = defaultSort
) : Promise <Feedback[]>
{
	return wrapFind(populateFeedback(
		FeedbackModel.find()
		.sort(sort).skip(skip).limit(limit)
	));
}

// Internal populate

function populateFeedback <D extends Document> (
	query : DocumentQuery <D[], D>
) : DocumentQuery <D[], D>
{
	return query.populate({
		path: 'article',
		populate: {
			path: 'authors',
		},
	})
	.populate('enduser');
}

// save

export function save (
	article : Article,
	enduser : EndUser,
	items : FeedbackItem[]
) : Promise <Feedback>
{
	emptyCheck(article, enduser, items);

	// console.log('------------------------------------------------------------');
	// console.log('article object in feedback.save:', article);
	// console.log('\n');

	return makeDocument(article, enduser, items)
	.then(doc => wrapSave<Feedback>(new FeedbackModel(doc).save()));
}

const makeDocument = (
	article : Article,
	enduser : EndUser,
	items : FeedbackItem[]
) => Promise.resolve({
	article: article.ID,
	enduser: enduser.ID,

	website: article.website.ID,
	articleAuthors: article.authors.map(author => author.ID),

	items,
	status: FeedbackStatus.New,

	date: {
		statusChange: new Date(),
	},
});

// update

export function updateEndUser (
	id : ObjectID,
	enduser : EndUser
) : Promise <Feedback>
{
	emptyCheck(enduser);

	const updateData:{
		enduser: any,
	} = {
		enduser: null,
	};

	updateData.enduser = enduser.ID;

	return FeedbackModel.findById(id).then((feedback) => {
		if (!feedback) {
			throw new Error(`No such feedback ${id}`);
		}
		feedback.enduser = updateData.enduser;
		return wrapSave(feedback.save());
	});
}
