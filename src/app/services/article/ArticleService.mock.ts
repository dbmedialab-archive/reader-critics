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

import { Article } from 'base';

import {
	ArticleDocument,
	ArticleModel
} from 'app/db/models';

import ArticleService from './ArticleService';
import createPersistingService from '../createPersistingService';

import download from './mock/download';
import fetch from './common/fetch';
import getRangeWithFBCount from './common/getRangeWithFBCount';
import getByID from './common/getByID';
import getAmount from './common/getAmount';

import { getIDsToPullUpdates } from './live/getIDsToPullUpdates';
import { getNonUpdated } from './live/getNonUpdated';
import { getRelatedArticleItem } from './common/getRelatedArticleItem';
import { setOptions } from './common/setOptions';

import {
	addFeedback,
	exists,
	get,
	save,
	saveNewVersion,
	upsert,
} from './ArticleDAO';

module.exports = createPersistingService <ArticleDocument, ArticleService, Article> (
	ArticleModel, {
		addFeedback,
		download,
		exists,
		fetch,
		get,
		save,
		saveNewVersion,
		upsert,
		getAmount,
		getByID,
		getIDsToPullUpdates,
		getNonUpdated,
		getRangeWithFBCount,
		getRelatedArticleItem,
		setOptions,
	}
) as ArticleService;
